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
  imagePreviews: { url: string, imageUrl?: string }[] = []; // no raw File kept
  uploads: { progress: number, url?: string }[] = [];
  isDragOver = false;
  categories: any;
  selectedCategory: string = '';
  isEditMode: boolean = false;
  portfolioItemId: string | null = null;

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

  // private handleFiles(files: File[]): void {
  //   files.forEach((file) => {
  //     if (!file.type.startsWith('image/')) return;

  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       // show local preview first
  //       this.imagePreviews.push({ url: reader.result as string });
  //       this.uploads.push({ progress: 0 });
  //       this.uploadFile(file, this.imagePreviews.length - 1);
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // }
  private handleFiles(files: File[]): void {
  files.forEach((file) => {
    if (!file.type.startsWith('image/')) return;

    // Use object URL for fast preview (no base64 memory overhead)
    const previewUrl = URL.createObjectURL(file);

    this.imagePreviews.push({ url: previewUrl });
    this.uploads.push({ progress: 0 });

    this.uploadFile(file, this.imagePreviews.length - 1);
  });
}


  // private uploadFile(file: File, index: number): void {
  //   this.portfolioService.uploadImage(file).subscribe({
  //     next: (event: HttpEvent<any>) => {
  //       switch (event.type) {
  //         case HttpEventType.UploadProgress:
  //           if (event.total) {
  //             this.uploads[index].progress = Math.round(100 * (event.loaded / event.total));
  //           }
  //           break;
  //         case HttpEventType.Response:
  //           const imageUrl = event.body?.data?.imageUrl;
  //           if (imageUrl) {
  //             // replace preview URL with uploaded one
  //             this.imagePreviews[index].url = imageUrl;
  //             this.imagePreviews[index].imageUrl = imageUrl;
  //             this.uploads[index].url = imageUrl;

  //             // add to form
  //             this.images.push(this.fb.control(imageUrl));
  //           }
  //           break;
  //       }
  //     },
  //     error: () => {
  //       this.removeImage(index);
  //     }
  //   });
  // }
private uploadFile(file: File, index: number): void {
  this.clondinaryService.uploadImage(file).subscribe({
    next: (event) => {
      if (typeof event === 'number') {
        // progress
        this.uploads[index].progress = event;
      } else if (typeof event === 'string') {
        // Cloudinary final URL
        const imageUrl = event;
        this.imagePreviews[index].url = imageUrl;
        this.imagePreviews[index].imageUrl = imageUrl;
        this.uploads[index].url = imageUrl;

        // add to form
        this.images.push(this.fb.control(imageUrl));
      }
    },
    error: () => {
      this.removeImage(index);
    }
  });
}

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.uploads.splice(index, 1);
    this.images.removeAt(index);
  }

  private loadPortfolioItem(id: string): void {
    this.portfolioService.getPortfolioItem(id).subscribe({
      next: (response) => {
        if (response.status && response.data) {
          const item = response.data;
          this.selectedCategory = item.category;

          // load existing image
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
