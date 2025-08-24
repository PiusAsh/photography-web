import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Product } from '../../../modules/shop/models/product';

@Component({
  selector: 'app-product-grid-carousel',
  standalone: false,
  templateUrl: './product-grid-carousel.html',
  styleUrl: './product-grid-carousel.scss'
})
export class ProductGridCarousel {
@Input() products: Product[] = [];
  @Input() title: string = 'Products';
  @Output() productSelected = new EventEmitter<Product>();

  selectProduct(product: Product) {
    this.productSelected.emit(product);
    window.scrollTo(0, 0);
  }

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

scroll(direction: 'left' | 'right') {
  const container = this.scrollContainer.nativeElement;
  const scrollAmount = 250;

  if (direction === 'left') {
    container.scrollLeft -= scrollAmount;
  } else {
    container.scrollLeft += scrollAmount;
  }
}

  getPriceRange(product: any): string {
    const sizes = product?.size || [];
    const prints = product?.print || [];

    if (sizes.length > 0 && prints.length > 0) {
      const sizeAmounts = sizes.map((s: { amount: any; }) => s.amount);
      const printAmounts = prints.map((p: { amount: any; }) => p.amount);
      const minPrice = Math.min(...sizeAmounts) + Math.min(...printAmounts);
      const maxPrice = Math.max(...sizeAmounts) + Math.max(...printAmounts);
      return `₦${minPrice.toLocaleString()} – ₦${maxPrice.toLocaleString()}`;
    } else {
      return 'N/A';
    }
  }
}
