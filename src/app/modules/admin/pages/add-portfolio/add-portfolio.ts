import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { PortfolioService } from './portfolio.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-portfolio',
  standalone: false,
  templateUrl: './add-portfolio.html',
  styleUrl: './add-portfolio.scss'
})
export class AddPortfolio implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  portfolioForm!: FormGroup;
  imagePreviews: { url: string, file?: File, imageUrl?: string }[] = []; // Added imageUrl for existing images
  isDragOver = false;
  categories: string[] = ['Weddings', 'Portraits', 'Nature', 'Events', 'Other'];
  selectedCategory: string = '';
  isEditMode: boolean = false;
  portfolioItemId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private toast: NgToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.portfolioForm = this.fb.group({
      images: this.fb.array([])
    });

    this.route.paramMap.subscribe(params => {
      this.portfolioItemId = params.get('id');
      if (this.portfolioItemId) {
        this.isEditMode = true;
        this.loadPortfolioItem(this.portfolioItemId);
      }
    });
  }

  get images(): FormArray {
    return this.portfolioForm.get('images') as FormArray;
  }

  triggerFileInputClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList) {
      this.handleFiles(Array.from(fileList));
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

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  private handleFiles(files: File[]): void {
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        //this.toast.danger({ detail: 'ERROR', summary: 'Please upload only image files.', duration: 5000 });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push({ url: reader.result as string, file: file });
        this.images.push(this.fb.control(file)); // Add file to FormArray
      };
      reader.readAsDataURL(file);
    });
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.images.removeAt(index);
  }

  private loadPortfolioItem(id: string): void {
    this.portfolioService.getPortfolioItem(id).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          const item = response.data;
          this.selectedCategory = item.category;
          this.imagePreviews = [{ url: item.imageUrl, imageUrl: item.imageUrl }]; // For single image edit
          this.images.push(this.fb.control(item.imageUrl)); // Add existing image URL to FormArray
        } else {
         // this.toast.danger({ detail: 'ERROR', summary: response.errorMessage || 'Failed to load portfolio item.', duration: 5000 });
          // this.router.navigate(['/app/portfolio']);
        }
      },
      error: (err) => {
        console.error('Error loading portfolio item:', err);
        //this.toast.danger({ detail: 'ERROR', summary: 'An error occurred while loading portfolio item.', duration: 5000 });
        this.router.navigate(['/app/portfolio']);
      }
    });
  }

  onSubmit(): void {
    if (!this.selectedCategory || this.imagePreviews.length === 0) {
    //  this.toast.danger({ detail: 'ERROR', summary: 'Please upload images and select a category.', duration: 5000 });
      return;
    }

    const portfolioItems: any[] = [];
    let uploadCount = 0;
    const totalUploads = this.imagePreviews.length;

    if (totalUploads === 0) {
    //  this.toast.danger({ detail: 'ERROR', summary: 'No images to upload.', duration: 5000 });
      return;
    }

    // Filter out existing images (those with imageUrl but no file) for update scenario
    const newFilesToUpload = this.imagePreviews.filter(p => p.file);
    const existingImageUrls = this.imagePreviews.filter(p => p.imageUrl && !p.file).map(p => p.imageUrl);

    // If in edit mode and no new files are uploaded, but there's an existing image
    if (this.isEditMode && newFilesToUpload.length === 0 && existingImageUrls.length > 0) {
      this.portfolioService.updatePortfolioItem(this.portfolioItemId!, {
        id: this.portfolioItemId!,
        imageUrl: existingImageUrls[0], // Assuming single image for edit
        category: this.selectedCategory,
        description: 'this',
        status: 'this'
      }).subscribe({
        next: (res) => {
      //    this.toast.success({ detail: 'SUCCESS', summary: 'Portfolio updated successfully!', duration: 5000 });
          this.router.navigate(['/app/portfolio']);
        },
        error: (err) => {
          console.error('Error updating portfolio:', err);
         // this.toast.danger({ detail: 'ERROR', summary: 'Failed to update portfolio. Please try again.', duration: 5000 });
        }
      });
      return;
    }

    // Handle new file uploads for both add and edit scenarios
    newFilesToUpload.forEach((preview, index) => {
      this.portfolioService.uploadImage(preview.file!).subscribe({
        next: (response) => {
          uploadCount++;
          if (response?.data?.imageUrl) {
            portfolioItems.push({
              
              imageUrl: response.data.imageUrl,
              category: this.selectedCategory,
                description: 'this',
        status: 'this'
            });
          }

          if (uploadCount === newFilesToUpload.length) {
            // All new images uploaded
            if (this.isEditMode) {
              // For edit mode, update the single item with the newly uploaded image
              this.portfolioService.updatePortfolioItem(this.portfolioItemId!, {
                id: this.portfolioItemId!,
                imageUrl: portfolioItems[0].imageUrl, // Assuming single image for edit
                category: this.selectedCategory,
                   description: 'this',
        status: 'this'
              }).subscribe({
                next: (res) => {
               //   this.toast.success({ detail: 'SUCCESS', summary: 'Portfolio updated successfully!', duration: 5000 });
                  this.router.navigate(['/app/portfolio']);
                },
                error: (err) => {
                  console.error('Error updating portfolio:', err);
                //  this.toast.danger({ detail: 'ERROR', summary: 'Failed to update portfolio. Please try again.', duration: 5000 });
                }
              });
            } else {
              // For add mode, add all newly uploaded images
              this.portfolioService.addPortfolio(portfolioItems).subscribe({
                next: (res) => {
                //  this.toast.success({ detail: 'SUCCESS', summary: 'Portfolio added successfully!', duration: 5000 });
                this.router.navigate(['/app/portfolio']);  
                this.resetForm();
                },
                error: (err) => {
                  console.error('Error adding portfolio:', err);
                  //this.toast.danger({ detail: 'ERROR', summary: 'Failed to add portfolio. Please try again.', duration: 5000 });
                }
              });
            }
          }
        },
        error: (err) => {
          uploadCount++;
          console.error('Error uploading image:', err);
         // this.toast.danger({ detail: 'ERROR', summary: `Failed to upload image ${index + 1}.`, duration: 5000 });

          if (uploadCount === newFilesToUpload.length) {
            // If all new uploads failed or some succeeded, handle accordingly
            if (portfolioItems.length > 0) {
              if (this.isEditMode) {
                // If in edit mode and new upload failed, but there was an existing image
                // This case should ideally not happen if newFilesToUpload.length > 0
                // but as a fallback, if no new image uploaded, try to update with existing one
                if (existingImageUrls.length > 0) {
                  this.portfolioService.updatePortfolioItem(this.portfolioItemId!, {
                    id: this.portfolioItemId!,
                    imageUrl: existingImageUrls[0],
                    category: this.selectedCategory
                  }).subscribe({
                    next: (res) => {
                      //this.toast.success({ detail: 'SUCCESS', summary: 'Portfolio updated successfully (retained old image).', duration: 5000 });
                      this.router.navigate(['/app/portfolio']);
                    },
                    error: (err) => {
                      console.error('Error updating portfolio after new image upload failed:', err);
                      // this.toast.danger({ detail: 'ERROR', summary: 'Failed to update portfolio after new image upload failed.', duration: 5000 });
                    }
                  });
                } else {
                  // this.toast.danger({ detail: 'ERROR', summary: 'New image upload failed and no old image to retain.', duration: 5000 });
                }
              } else {
                // Add mode, some uploads failed
                // this.toast.danger({ detail: 'ERROR', summary: 'Some images failed to upload. Portfolio not added.', duration: 5000 });
              }
            } else {
              // this.toast.danger({ detail: 'ERROR', summary: 'No images were successfully uploaded to add to portfolio.', duration: 5000 });
            }
          }
        }
      });
    });
  }

  private resetForm(): void {
    this.portfolioForm.reset();
    this.images.clear();
    this.imagePreviews = [];
    this.selectedCategory = '';
  }
}