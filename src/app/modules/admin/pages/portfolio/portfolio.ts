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
  allPortfolioItems: any[] = [];
  filteredPortfolioItems: any[] = [];
  categories: any[] = [];
  selectedCategory: string = 'All';

  constructor(
    private portfolioService: PortfolioService,
    private toast: NgToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllPortfolioItems();
  }

  loadCategories(): void {
    this.portfolioService.getAllCategories().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.categories = [{ name: 'All' }, ...response.data];
        }
      }
    });
  }

  loadAllPortfolioItems(): void {
    // Assuming getPortfolioItems with a large page size fetches all items.
    // This might need adjustment based on the actual service implementation.
    this.portfolioService.getPortfolioItems(1, 1000, '').subscribe({
      next: (response) => {
        if (response.status) {
          this.allPortfolioItems = response.data.items;
          this.filterPortfolioItems();
        }
      }
    });
  }

  filterPortfolioItems(): void {
    if (this.selectedCategory === 'All') {
      this.filteredPortfolioItems = this.allPortfolioItems;
    } else {
      this.filteredPortfolioItems = this.allPortfolioItems.filter(item => item.category === this.selectedCategory);
      console.log(this.filteredPortfolioItems, this.selectedCategory, 'test');
    }
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.filterPortfolioItems();
  }

  deletePortfolioItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.portfolioService.deletePortfolioItem(id).subscribe({
        next: (response) => {
          if (response.status) {
            this.loadAllPortfolioItems(); // Refresh the list
          }
        }
      });
    }
  }

  editPortfolioItem(id: string): void {
    this.router.navigate(['/app/edit-portfolio', id]);
  }
}