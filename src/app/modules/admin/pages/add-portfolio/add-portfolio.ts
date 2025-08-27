import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { PortfolioService } from './portfolio.service';
import { CloudinaryService } from '../../../shared/services/cloudinary.service';


@Component({
  selector: 'app-add-portfolio',
  standalone: false,
  templateUrl: './add-portfolio.html',
  styleUrls: ['./add-portfolio.scss']
})
export class AddPortfolio implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  portfolioForm!: FormGroup;
  imagePreviews: { url: string, imageUrl?: string }[] = [];
  uploads: { progress: number, url?: string, error?: boolean }[] = [];
  isDragOver = false;
  categories: any;
  selectedCategory: string = '';
  isEditMode: boolean = false;
  portfolioItemId: string | null = null;
  uploadInProgress: boolean = false;
  overallProgress: number = 0;
  totalFiles: number = 0;

  constructor(
    private fb: FormBuilder,
    private portfolioService: PortfolioService,
    private toast: NgToastService,
    private route: ActivatedRoute, private clondinaryService: CloudinaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.portfolioForm = this.fb.group({
      images: this.fb.array([], Validators.required)
    });

    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      this.portfolioItemId = params.get('id');
      if (this.portfolioItemId) {
        this.isEditMode = true;
        this.loadPortfolioItem(this.portfolioItemId);
      }
    });
  }
loadCategories(): void {
    this.portfolioService.getAllCategories().subscribe({
      next: (response: any) => {
        if (response.status && response.data) {
          this.categories = response.data;
        } else {
          console.error('Failed to load categories:', response.errorMessage);
        }
      },
      error: (err: any) => {
        console.error('Error fetching categories:', err);
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
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  private handleFiles(files: File[]): void {
    this.uploadInProgress = true;
    this.overallProgress = 0;
    this.totalFiles = files.length;
    let processedFiles = 0;

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const previewUrl = URL.createObjectURL(file);
      this.imagePreviews.push({ url: previewUrl });
      this.uploads.push({ progress: 0, error: false });

      this.uploadFile(file, this.imagePreviews.length - 1, () => {
        processedFiles++;
        this.overallProgress = Math.round((processedFiles / this.totalFiles) * 100);
        if (processedFiles === this.totalFiles) {
          this.uploadInProgress = false;
        }
      });
    });
  }

  private uploadFile(file: File, index: number, callback: () => void): void {
    this.clondinaryService.uploadImage(file).subscribe({
      next: (event) => {
        if (typeof event === 'number') {
          this.uploads[index].progress = event;
        } else if (typeof event === 'string') {
          const imageUrl = event;
          this.imagePreviews[index].url = imageUrl;
          this.imagePreviews[index].imageUrl = imageUrl;
          this.uploads[index].url = imageUrl;
          this.images.push(this.fb.control(imageUrl));
          callback();
        }
      },
      error: () => {
        this.toast.danger(`Failed to upload ${file.name}.`);
        this.uploads[index].error = true;
        this.uploads[index].progress = 100; // Mark as complete to remove progress bar
        callback();
      }
    });
  }

  removeImage(index: number): void {
    const removedImageUrl = this.imagePreviews[index].imageUrl;
    this.imagePreviews.splice(index, 1);
    this.uploads.splice(index, 1);

    if (removedImageUrl) {
      const imageIndexInForm = this.images.controls.findIndex(control => control.value === removedImageUrl);
      if (imageIndexInForm > -1) {
        this.images.removeAt(imageIndexInForm);
      }
    }
  }

  private loadPortfolioItem(id: string): void {
    this.portfolioService.getPortfolioItem(id).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          const item = response.data;
          this.selectedCategory = item.category;
          this.imagePreviews = [{ url: item.imageUrl, imageUrl: item.imageUrl }];
          this.uploads = [{ progress: 100, url: item.imageUrl }];
          this.images.push(this.fb.control(item.imageUrl));
        } else {
          this.router.navigate(['/app/portfolio']);
        }
      },
      error: () => {
        this.router.navigate(['/app/portfolio']);
      }
    });
  }

  onSubmit(): void {
    if (this.uploadInProgress) {
      this.toast.info('Please wait for the image uploads to complete.');
      return;
    }
    if (this.portfolioForm.invalid || !this.selectedCategory) {
      return;
    }

    const portfolioItems = this.images.value.map((imageUrl: string) => ({
      imageUrl,
      category: this.selectedCategory,
      description: 'this',
      status: 'this'
    }));

    if (this.isEditMode) {
      this.portfolioService.updatePortfolioItem(this.portfolioItemId!, {
        id: this.portfolioItemId!,
        imageUrl: portfolioItems[0].imageUrl,
        category: this.selectedCategory,
        description: 'this',
        status: 'this'
      }).subscribe(() => {
        this.router.navigate(['/app/portfolio']);
      });
    } else {
      this.portfolioService.addPortfolio(portfolioItems).subscribe(() => {
        this.resetForm();
        this.router.navigate(['/app/portfolio']);
      });
    }
  }

  private resetForm(): void {
    this.portfolioForm.reset();
    this.images.clear();
    this.imagePreviews = [];
    this.uploads = [];
    this.selectedCategory = '';
  }
}
