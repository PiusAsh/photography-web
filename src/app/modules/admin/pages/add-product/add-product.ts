import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ProductService } from '../../../shop/_services/product.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})

export class AddProduct implements OnInit {
  @ViewChild('mainFileInput') mainFileInput!: ElementRef;
  @ViewChild('multipleFileInput') multipleFileInput!: ElementRef;

  mainImagePreviewUrl: string | ArrayBuffer | null = null;
  additionalImagePreviewUrls: (string | ArrayBuffer)[] = [];
  productForm!: FormGroup;
  isDragOver = false;

  constructor(private fb: FormBuilder, private productService: ProductService, private http: HttpClient, private toast: NgToastService) { }

  triggerMainFileInputClick(): void {
    this.mainFileInput.nativeElement.click();
  }

  triggerMultipleFileInputClick(): void {
    this.multipleFileInput.nativeElement.click();
  }

  ngOnInit(): void {

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      mainImage: [''],
      images: this.fb.array([]),
      variants: this.fb.array([this.createVariant()])
    });
  }

  createVariant(): FormGroup {
    return this.fb.group({
      price: ['', Validators.required],
      type: ['', Validators.required],
      size: ['', Validators.required]
    });
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant(): void {
    this.variants.push(this.createVariant());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      // Display image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);

      // Upload image
      this.productService.uploadImage(file).subscribe(
        (response: any) => {
          this.productForm.patchValue({ mainImage: response?.data.imageUrl });
          console.log('Main image uploaded:', response?.data?.imageUrl);
        },
        error => {
          console.error('Error uploading main image:', error);
          this.mainImagePreviewUrl = null; // Clear preview on error
        }
      );
    }
  }

  onMultipleFilesSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const files = Array.from(fileList);
      const imagesFormArray = this.productForm.get('images') as FormArray;

      files.forEach(file => {
        // Display image preview
        const reader = new FileReader();
        reader.onload = () => {
          this.additionalImagePreviewUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload image
        this.productService.uploadImage(file).subscribe(
          (response: any) => {
            imagesFormArray.push(this.fb.control(response?.data?.imageUrl));
            console.log('Image uploaded:', response?.data?.imageUrl);
          },
          error => {
            console.error('Error uploading image:', error);
            // Optionally, remove the preview if upload fails
            const index = this.additionalImagePreviewUrls.findIndex(url => url === reader.result);
            if (index > -1) {
              this.additionalImagePreviewUrls.splice(index, 1);
            }
          }
        );
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent, type: 'main' | 'additional'): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    if (type === 'main') {
      const file = files[0];
      this.handleFileUpload(file, 'main');
    } else if (type === 'additional') {
      Array.from(files).forEach(file => {
        this.handleFileUpload(file, 'additional');
      });
    }
  }

  private handleFileUpload(file: File, type: 'main' | 'additional'): void {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.toast.danger('Please upload only image files.');
      return;
    }

    // Display image preview
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'main') {
        this.mainImagePreviewUrl = reader.result;
      } else {
        this.additionalImagePreviewUrls.push(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Upload image
    this.productService.uploadImage(file).subscribe(
      (response: any) => {
        if (type === 'main') {
          this.productForm.patchValue({ mainImage: response?.data.imageUrl });
          console.log('Main image uploaded:', response?.data?.imageUrl);
        }
        else {
          const imagesFormArray = this.productForm.get('images') as FormArray;
          imagesFormArray.push(this.fb.control(response?.data?.imageUrl));
          console.log('Image uploaded:', response?.data?.imageUrl);
        }
      },
      error => {
        console.error('Error uploading image:', error);
        if (type === 'main') {
          this.mainImagePreviewUrl = null;
        } else {
          const index = this.additionalImagePreviewUrls.findIndex(url => url === reader.result);
          if (index > -1) {
            this.additionalImagePreviewUrls.splice(index, 1);
          }
        }
      }
    );
  }

  removeMainImage(event: Event): void {
    event.stopPropagation(); // Prevent triggering the file input
    this.mainImagePreviewUrl = null;
    this.productForm.patchValue({ mainImage: '' });
  }

  removeAdditionalImage(index: number): void {
    this.additionalImagePreviewUrls.splice(index, 1);
    const imagesFormArray = this.productForm.get('images') as FormArray;
    imagesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe(
        response => {
          console.log('Product created successfully:', response);
          // Optionally, reset the form or navigate to another page
          // this.productForm.reset();
          this.toast.success('Product created successfully!');
        },
        error => {
          console.error('Error creating product:', error);
          this.toast.danger('Failed to create product. Please try again.');
        }
      );
    }
  }
}
