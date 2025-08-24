import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../add-portfolio/portfolio.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  standalone: false,
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class PortfolioComponent implements OnInit {
  portfolioItems: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10; // Default page size
  totalPages: number = 1;
  totalCount: number = 0;

  constructor(
    private portfolioService: PortfolioService,
    private toast: NgToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPortfolioItems();
  }

  getPortfolioItems(): void {
    this.portfolioService.getPortfolioItems(this.pageNumber, this.pageSize, '').subscribe({
      next: (response) => {
        if (response.status) {
          this.portfolioItems = response.data.items;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalPages = response.data.totalPages;
          this.totalCount = response.data.totalCount;
        } else {
          // this.toast.danger({ detail: 'ERROR', summary: response.errorMessage || 'Failed to fetch portfolio items.', duration: 5000 });
        }
      },
      error: (err) => {
        console.error('Error fetching portfolio items:', err);
        // this.toast.danger({ detail: 'ERROR', summary: 'An error occurred while fetching portfolio items.', duration: 5000 });
      }
    });
  }

  deletePortfolioItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.portfolioService.deletePortfolioItem(id).subscribe({
        next: (response) => {
          if (response.status) {
            // this.toast.success({ detail: 'SUCCESS', summary: 'Item deleted successfully!', duration: 5000 });
            this.getPortfolioItems(); // Refresh the list
          } else {
            // this.toast.danger({ detail: 'ERROR', summary: response.errorMessage || 'Failed to delete item.', duration: 5000 });
          }
        },
        error: (err) => {
          console.error('Error deleting portfolio item:', err);
          // this.toast.danger({ detail: 'ERROR', summary: 'An error occurred while deleting item.', duration: 5000 });
        }
      });
    }
  }

  editPortfolioItem(id: string): void {
    this.router.navigate(['/app/edit-portfolio', id]);
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getPortfolioItems();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getPortfolioItems();
    }
  }
}
