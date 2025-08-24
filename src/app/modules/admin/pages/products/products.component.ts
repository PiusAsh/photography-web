import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../shop/_services/product.service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('mainFileInput') mainFileInput!: ElementRef;
  @ViewChild('multipleFileInput') multipleFileInput!: ElementRef;

  mainImagePreviewUrl: string | ArrayBuffer | null = null;
  additionalImagePreviewUrls: (string | ArrayBuffer)[] = [];
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService, private http: HttpClient) { }

  triggerMainFileInputClick(): void {
    this.mainFileInput.nativeElement.click();
  }

  triggerMultipleFileInputClick(): void {
    this.multipleFileInput.nativeElement.click();
  }

  ngOnInit(): void {
    localStorage.setItem('phToken', 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1NTk1MzIxOS1iNjc3LTQxZTktODU5NS01NGFkMjIwZmVmYzIiLCJlbWFpbCI6InN0cmluZyIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc1MTg0MTQ1OSwiZXhwIjoxNzUyNDQ2MjU5LCJpYXQiOjE3NTE4NDE0NTl9.EAqpJPXue2V4MKyzXN7JGWksIZTZSki82N1IUb_Lb4i9lmhh6KQd1U-18YGjypjFOVsJkeEalAr02grSV4lR2g');

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      year: ['', Validators.required],
      size: this.fb.array([this.createSize()]),
      print: this.fb.array([this.createPrint()]),
      mainImage: [''],
      images: this.fb.array([])
    });
  }

  createSize(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  createPrint(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  get size(): FormArray {
    return this.productForm.get('size') as FormArray;
  }

  get print(): FormArray {
    return this.productForm.get('print') as FormArray;
  }

  addSize(): void {
    this.size.push(this.createSize());
  }

  addPrint(): void {
    this.print.push(this.createPrint());
  }

  removeSize(index: number): void {
    this.size.removeAt(index);
  }

  removePrint(index: number): void {
    this.print.removeAt(index);
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
          this.productForm.reset();
          alert('Product created successfully!');
        },
        error => {
          console.error('Error creating product:', error);
          alert('Failed to create product. Please try again.');
        }
      );
    }
  }
}
