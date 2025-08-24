export interface OrderResponse {
  status: boolean;
  data: OrderData;
}

export interface OrderData {
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: Order[];
}

export interface Order {
  id: string;
  customer: Customer;
  customerJson: string; // Consider parsing this if needed, but 'customer' object is already available
  itemsJson: string; // Consider parsing this if needed, but 'items' array is already available
  items: OrderItem[];
  totalAmount: number;
  paymentReference: string;
  paymentMethod: string;
  paymentStatus: string;
  orderDate: string; // ISO 8601 date string
  orderStatus: string;
  secretCode: string;
  createdAt: string; // ISO 8601 date string
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  productId: string;
  productName: string | null; // Can be null based on example
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: ProductOptions;
}

export interface ProductOptions {
  size: SizeOption;
  print: PrintOption;
}

export interface SizeOption {
  name: string;
  amount: number;
}

export interface PrintOption {
  name: string;
  amount: number;
}
