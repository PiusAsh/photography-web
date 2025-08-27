export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[]; // gallery
  year: number;
  price: number;
  mainImage: string;
  size?: any;
  print?: any;
  priceRange?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  finalPrice?: number;
  displayPrice?: string;
  options?: {
    size: any;
    type: any;
  };
}
