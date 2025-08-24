import { Component, OnInit } from '@angular/core';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: false,
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalCount: number = 0;
  selectedOrder: any = null;
  orderToUpdate: any = null;
  newStatus: string = '';
  availableStatuses: string[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders(this.pageNumber, this.pageSize).subscribe(
      (response: any) => {
        if (response.status) {
          this.orders = response.data.items;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalPages = response.data.totalPages;
          this.totalCount = response.data.totalCount;
          window.scrollTo(0, 0);
        } else {
          console.error('Failed to fetch orders:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getOrders();
    }

  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getOrders();
      
    }

  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  openUpdateStatusModal(order: any): void {
    this.orderToUpdate = order;
    this.newStatus = order.orderStatus;
  }

  updateOrderStatus(): void {
    if (this.orderToUpdate && this.newStatus) {
   const   payload = {
orderStatus: this.newStatus
      }
      this.orderService.updateOrderStatus(this.orderToUpdate.id, payload).subscribe(
        () => {
          this.getOrders();
          this.closeModal();
        },
        (error: any) => {
          console.error('Error updating order status:', error);
        }
      );
    }
  }

  closeModal(): void {
    this.selectedOrder = null;
    this.orderToUpdate = null;
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
}
