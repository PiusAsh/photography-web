import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductService } from '../../../shop/_services/product.service';
import { environment } from '../../../../../../public/environment/environment';

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  year: number;
  mainImage: string;
  dateCreated: string;
  variants: Array<{ price: number; type: string; size: string; }>;
}

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
  selector: 'app-all-products',
  templateUrl: './all-products.html',
  standalone: false,
  styleUrls: ['./all-products.scss']
})
export class AllProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 3;
  totalPages = 1;
  totalCount = 0;
  searchTerm = '';
  selectedProduct: Product | null = null;
  showDeleteModal = false;

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private router: Router
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

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onEditProduct(product: Product): void {
    // Navigate to edit product page with product ID
    this.router.navigate(['/app/edit-product', product.id]);
  }

  onDeleteProduct(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          this.loadProducts();
          this.showDeleteModal = false;
          this.selectedProduct = null;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5);
    
    for (let i = 1; i <= maxPages; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getPriceRange(product: Product): string {
    if (!product.variants || product.variants.length === 0) {
      return 'N/A';
    }
    
    const prices = product.variants.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    return min === max ? `₦${min.toLocaleString()}` : `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
  }
}