import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../modules/shop/models/product';

@Component({
  selector: 'app-product-grid',
  standalone: false,
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss'
})
export class ProductGrid {
 @Input() products: Product[] = [];
  @Input() title: string = 'Products';
  @Output() productSelected = new EventEmitter<Product>();

  selectProduct(product: Product) {
    this.productSelected.emit(product);
  }
}
