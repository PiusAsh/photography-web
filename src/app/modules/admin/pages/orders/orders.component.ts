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
}
