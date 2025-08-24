import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../public/environment/environment';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared-module';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Footer } from '../../../shared/components/footer/footer';
import { ActivatedRoute, Router } from '@angular/router';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: any;
}

interface Order {
  id: string;
  customer: any;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: string;
  orderStatus: string;
  secretCode: string;
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
  selectedOrder: Order | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.trackingForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      secretCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const code = params['code'];

      if (email && code) {
        this.trackingForm.patchValue({ email: email, secretCode: code });
        this.trackOrders();
      }
    });
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

    this.http.get<any>(
      `${environment.BASE_URL}Order/track?email=${email}&secretCode=${secretCode}`
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status) {
          this.orders = response.data;
          this.customerEmail = email;
          this.isAuthenticated = true;
        } else {
          this.errorMessage = response.errorMessage || 'No orders found for the provided credentials.';
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
    this.router.navigate(['/store/order-tracking']);
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
      'pending': '',
      'processing': '',
      'shipped': '',
      'delivered': '',
      'cancelled': '',
      'refunded': ''
      // 'pending': 'bi bi-clock',
      // 'processing': 'bi bi-gear',
      // 'shipped': 'bi bi-truck',
      // 'delivered': 'bi bi-check-circle',
      // 'cancelled': 'bi bi-x-circle',
      // 'refunded': 'bi bi-arrow-return-left'
    };
    return iconMap[status.toLowerCase()] ;
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeModal(): void {
    this.selectedOrder = null;
  }
}
 