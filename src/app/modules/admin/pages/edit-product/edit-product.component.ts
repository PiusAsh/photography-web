import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../shop/_services/product.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {
  @ViewChild('mainFileInput') mainFileInput!: ElementRef;
  @ViewChild('multipleFileInput') multipleFileInput!: ElementRef;

  mainImagePreviewUrl: string | ArrayBuffer | null = null;
  additionalImagePreviewUrls: (string | ArrayBuffer)[] = [];
  productForm!: FormGroup;
  isDragOver = false;
  productId: string = '';
  loading = false;
  product: any = null;
  isEditMode = true;

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService, 
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {

    this.initForm();
    this.loadProduct();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: [this.productId],
      name: ['', Validators.required],
      description: ['', Validators.required],
      year: ['', Validators.required],
      mainImage: [''],
      images: this.fb.array([]),
      variants: this.fb.array([this.createVariant()])
    });
  }

  private loadProduct(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.loading = true;
        this.productService.getProductById(this.productId).subscribe(
          (response: any) => {
            this.product = response?.data;
            this.populateForm();
            this.loading = false;
          },
          error => {
            console.error('Error loading product:', error);
            this.loading = false;
            this.toast.danger('Failed to load product. Please try again.');
            this.router.navigate(['/app/all-products']);
          }
        );
      }
    });
  }

  private populateForm(): void {
    if (!this.product) return;

    // Clear existing form arrays
    while (this.variants.length !== 0) {
      this.variants.removeAt(0);
    }
    while (this.images.length !== 0) {
      this.images.removeAt(0);
    }

    // Populate basic fields
    this.productForm.patchValue({
      name: this.product.name,
      description: this.product.description,
      year: this.product.year,
      mainImage: this.product.mainImage
    });

    // Set main image preview
    if (this.product.mainImage) {
      this.mainImagePreviewUrl = this.product.mainImage;
    }

    // Populate variants array
    if (this.product.variants && this.product.variants.length > 0) {
      this.product.variants.forEach((variantItem: any) => {
        this.variants.push(this.fb.group({
          price: [variantItem.price, Validators.required],
          type: [variantItem.type, Validators.required],
          size: [variantItem.size, Validators.required]
        }));
      });
    } else {
      this.variants.push(this.createVariant());
    }

    // Populate images array
    if (this.product.images && this.product.images.length > 0) {
      this.product.images.forEach((imageUrl: string) => {
        this.images.push(this.fb.control(imageUrl));
        this.additionalImagePreviewUrls.push(imageUrl);
      });
    }
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

  get images(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  triggerMainFileInputClick(): void {
    this.mainFileInput.nativeElement.click();
  }

  triggerMultipleFileInputClick(): void {
    this.multipleFileInput.nativeElement.click();
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
          this.mainImagePreviewUrl = null;
        }
      );
    }
  }

  onMultipleFilesSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const files = Array.from(fileList);

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
            this.images.push(this.fb.control(response?.data?.imageUrl));
            console.log('Image uploaded:', response?.data?.imageUrl);
          },
          error => {
            console.error('Error uploading image:', error);
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
    if (!file.type.startsWith('image/')) {
      this.toast.danger('Please upload only image files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'main') {
        this.mainImagePreviewUrl = reader.result;
      } else {
        this.additionalImagePreviewUrls.push(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    this.productService.uploadImage(file).subscribe(
      (response: any) => {
        if (type === 'main') {
          this.productForm.patchValue({ mainImage: response?.data.imageUrl });
          console.log('Main image uploaded:', response?.data?.imageUrl);
        } else {
          this.images.push(this.fb.control(response?.data?.imageUrl));
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
    event.stopPropagation();
    this.mainImagePreviewUrl = null;
    this.productForm.patchValue({ mainImage: '' });
  }

  removeAdditionalImage(index: number): void {
    this.additionalImagePreviewUrls.splice(index, 1);
    this.images.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      this.productForm.patchValue({
        id: this.productId
      })
      this.productService.updateProduct(this.productId, this.productForm.value).subscribe(
        response => {
          console.log('Product updated successfully:', response);
          this.loading = false;
          this.toast.success('Product updated successfully!');
          this.router.navigate(['/app/all-products']);
        },
        error => {
          console.error('Error updating product:', error);
          this.loading = false;
          this.toast.danger('Failed to update product. Please try again.');
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/all-products']);
  }
}