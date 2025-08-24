import { Component, OnInit } from '@angular/core';
import { OrderService } from '../orders/order.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.html',
  standalone: false,
  styleUrls: ['./customers.scss']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 20;
  totalPages: number = 1;
  totalCount: number = 0;
  searchTerm: string = '';

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(): void {
    this.orderService.getCustomers(this.pageNumber, this.pageSize, this.searchTerm).subscribe(
      (response: any) => {
        if (response.status) {
          this.customers = response.data.items;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalPages = response.data.totalPages;
          this.totalCount = response.data.totalCount;
        } else {
          console.error('Failed to fetch customers:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  search(): void {
    this.pageNumber = 1;
    this.getCustomers();
  }

  onSearchInput(): void {
    if (!this.searchTerm) {
      this.search();
    }
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getCustomers();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getCustomers();
    }
  }
}