import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { Router } from '@angular/router';
import { CartService } from '../_services/cart.service';
import { CartItem } from '../models/product';
import { Navbar } from "../../../shared/components/navbar/navbar";
import { Footer } from "../../../shared/components/footer/footer";

@Component({
  selector: 'app-cart-page',
  imports: [SharedModule, Navbar, Footer],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss'
})


export class CartPage implements OnInit {
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getCount(): number {
    return this.cartService.getCount();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  removeFromCart(item: CartItem): void {
    if (item.options) {
      this.cartService.removeFromCart(item.product.id, item.options);
    }
  }

  updateQuantity(item: CartItem, action: 'increase' | 'decrease'): void {
    let newQuantity = item.quantity;
    if (action === 'increase') {
      newQuantity++;
    } else if (item.quantity > 1) {
      newQuantity--;
    }

    if (newQuantity !== item.quantity && item.options) {
      this.cartService.updateQuantity(item.product.id, newQuantity, item.options);
    }
  }

  goToCheckout(): void {
    this.router.navigate(['/store/checkout']);
    window.scrollTo(0, 0);
  }

  gotoPage(path: string): void {
    this.router.navigate([path]);
    window.scrollTo(0, 0);
  }

  trackByItem(index: number, item: CartItem): string {
    return item.product.id + JSON.stringify(item.options);
  }
}
