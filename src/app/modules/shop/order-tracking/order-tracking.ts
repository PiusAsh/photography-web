import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../public/environment/environment';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod?: string;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, Navbar, Footer],
  styleUrls: ['./order-tracking.scss']
})
export class OrderTrackingComponent implements OnInit {
  trackingForm: FormGroup;
  isAuthenticated = false;
  isLoading = false;
  customerEmail = '';
  orders: Order[] = [];
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.trackingForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      secretCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if user is already authenticated (e.g., from localStorage)
    const savedEmail = localStorage.getItem('tracking_email');
    const savedSecretCode = localStorage.getItem('tracking_secret_code');
    
    if (savedEmail && savedSecretCode) {
      this.trackingForm.patchValue({
        email: savedEmail,
        secretCode: savedSecretCode
      });
      this.trackOrders();
    }
  }

  get f() {
    return this.trackingForm.controls;
  }

  trackOrders(): void {
    if (this.trackingForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, secretCode } = this.trackingForm.value;

    // Save credentials for future use
    localStorage.setItem('tracking_email', email);
    localStorage.setItem('tracking_secret_code', secretCode);

    // API call to track orders
    this.http.post<{ success: boolean; orders?: Order[]; message?: string }>(
      `${environment.BASE_URL}Order/track`,
      { email, secretCode }
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success && response.orders) {
          this.orders = response.orders;
          this.customerEmail = email;
          this.isAuthenticated = true;
        } else {
          this.errorMessage = response.message || 'No orders found for the provided credentials.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error tracking orders:', error);
        
        if (error.status === 404) {
          this.errorMessage = 'No orders found for the provided credentials.';
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid credentials. Please check your email and secret code.';
        } else {
          this.errorMessage = 'An error occurred while tracking orders. Please try again.';
        }
      }
    });
  }

  resetTracking(): void {
    this.isAuthenticated = false;
    this.orders = [];
    this.customerEmail = '';
    this.errorMessage = '';
    this.trackingForm.reset();
    
    // Clear saved credentials
    localStorage.removeItem('tracking_email');
    localStorage.removeItem('tracking_secret_code');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return `₦${price.toLocaleString()}`;
  }

  getOrderStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled',
      'refunded': 'status-refunded'
    };
    return statusMap[status.toLowerCase()] || 'status-pending';
  }

  getOrderStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'bi bi-clock',
      'processing': 'bi bi-gear',
      'shipped': 'bi bi-truck',
      'delivered': 'bi bi-check-circle',
      'cancelled': 'bi bi-x-circle',
      'refunded': 'bi bi-arrow-return-left'
    };
    return iconMap[status.toLowerCase()] || 'bi bi-clock';
  }

  viewOrderDetails(order: Order): void {
    // This could open a modal or navigate to a detailed view
    console.log('Viewing order details:', order);
    
    // For now, we'll just show an alert with basic info
    const details = `
Order #${order.orderNumber}
Date: ${this.formatDate(order.orderDate)}
Status: ${order.status}
Total: ${this.formatPrice(order.totalAmount)}
Items: ${order.items.length} item(s)
    `;
    
    alert(details);
  }
} 