import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import { Footer } from "../../../shared/components/footer/footer";
import { PortfolioService } from '../../admin/pages/add-portfolio/portfolio.service';
import { CategoryService } from '../../shared/services/category.service';
import { Navbar } from "../../../shared/components/navbar/navbar";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, SharedModule, Footer, Navbar],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio implements OnInit {
  categories: any[] = [];
  selectedCategory: string = '';
  allPortfolioItems: any[] = [];
  filteredPortfolioItems: any[] = [];
  showPortfolioGrid: boolean = true;

  pageNumber: number = 1;
  pageSize: number = 8; // Number of items per page
  totalPages: number = 1;
  loading: boolean = false;

  constructor(
    private route: Router,
    private http: HttpClient, // HttpClient is needed for services, but not directly in component
    private portfolioService: PortfolioService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.portfolioService.getAllCategories().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.categories = [{ id: 0, name: 'All', description: '', status: '', dateCreated: '' }, ...response.data];
          this.selectedCategory = 'All';
          this.loadPortfolioItems(this.selectedCategory === 'All' ? '' : this.selectedCategory);
        } else {
          console.error('Failed to load categories:', response.errorMessage);
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  loadPortfolioItems(searchTerm: string = ''): void {
    if (this.loading || this.pageNumber > this.totalPages) {
      return; // Prevent multiple loads or loading beyond total pages
    }

    this.loading = true;
    this.portfolioService.getPortfolioItems(this.pageNumber, this.pageSize, searchTerm).subscribe({
      next: (response: { status: any; data: { items: any; totalPages: number; }; errorMessage: any; }) => {
        if (response.status && response.data && response.data.items) {
          this.allPortfolioItems = [...this.allPortfolioItems, ...response.data.items]; // Append new items
          this.filteredPortfolioItems = this.allPortfolioItems; // Update filtered items
          this.totalPages = response.data.totalPages;
          this.loading = false;
        } else {
          console.error('Failed to load portfolio items:', response.errorMessage);
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Error fetching portfolio items:', err);
        this.loading = false;
      }
    });
  }

  selectCategory(categoryName: string): void {
    if (this.selectedCategory !== categoryName) {
      this.selectedCategory = categoryName;
      this.pageNumber = 1; // Reset page number on category change
      this.allPortfolioItems = []; // Clear existing items
      this.filteredPortfolioItems = []; // Clear filtered items
      this.totalPages = 1; // Reset total pages

      this.showPortfolioGrid = false; // Temporarily hide to trigger animation
      setTimeout(() => {
        const searchTerm = categoryName === 'All' ? '' : categoryName;
        this.loadPortfolioItems(searchTerm);
        this.showPortfolioGrid = true;
      }, 10);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    // Check if scrolled to bottom (within a threshold)
    const scrollHeight = event.target.documentElement.scrollHeight;
    const scrollTop = event.target.documentElement.scrollTop;
    const clientHeight = event.target.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100 && !this.loading && this.pageNumber < this.totalPages) {
      this.pageNumber++;
      const searchTerm = this.selectedCategory === 'All' ? '' : this.selectedCategory;
      this.loadPortfolioItems(searchTerm);
    }
  }
}
