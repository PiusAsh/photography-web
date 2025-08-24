import { Component, OnInit } from '@angular/core';
import { Footer } from "../../../shared/components/footer/footer";
import { Navbar } from "../../../shared/components/navbar/navbar";
import { CartService } from '../_services/cart.service';
import { ProductService } from '../_services/product.service';
import { Product } from '../models/product';
import { SharedModule } from '../../../shared/shared-module';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../public/environment/environment';

interface ProductsResponse {
  status: boolean;
  data: {
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    items: Product[];
  };
  errorMessage: string | null;
}

@Component({
  selector: 'app-store',
  imports: [Footer, Navbar, SharedModule],
  templateUrl: './store.html',
  styleUrl: './store.scss'
})
export class Store implements OnInit {
  products: Product[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;
  totalCount = 0;
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'newest';
  showFilters = false;

  categories = [
    { id: '', name: 'All Categories' },
    { id: 'portrait', name: 'Portraits' },
    { id: 'landscape', name: 'Landscapes' },
    { id: 'street', name: 'Street Photography' },
    { id: 'abstract', name: 'Abstract' },
    { id: 'nature', name: 'Nature' }
  ];

  sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name A-Z' }
  ];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const url = `${environment.BASE_URL}Products?PageNumber=${this.currentPage}&PageSize=${this.pageSize}&searchTerm=${this.searchTerm}`;
    
    this.http.get<ProductsResponse>(url).subscribe({
      next: (response) => {
        if (response.status) {
          this.products = response.data.items;
          this.totalPages = response.data.totalPages;
          this.totalCount = response.data.totalCount;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onCategoryChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo(0, 0);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  addToCart(product: Product) {
    // this.cartService.addToCart(product);
  }

  viewProduct(item: Product) {
    this.router.navigate([`/store/product/${item?.id}`]);
    window.scrollTo(0, 0);
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5);
    
    for (let i = 1; i <= maxPages; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getPriceRange(product: Product): string {
    return `₦${product.price.toLocaleString()}`;
  }
}