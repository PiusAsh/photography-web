import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/product';
import { NgToastService } from 'ng-angular-popup';


@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'photoCart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  cart$ = this.cartSubject.asObservable();

  constructor(private toast: NgToastService) {}

  get cart(): CartItem[] {
    return this.cartSubject.value;
  }

  private loadCartFromStorage(): CartItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private updateStorage(cart: CartItem[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }

  findItemInCart(productId: string, options: { size: any, print: any }): CartItem | undefined {
    return this.cart.find(item => 
      item.product.id === productId &&
      item.options?.size.name === options.size.name &&
      item.options?.print.name === options.print.name
    );
  }

  addToCart(product: Product, quantity: number, options: { size: any, print: any }) {
    const existingItem = this.findItemInCart(product.id, options);

    if (existingItem) {
      this.toast.danger(`${product.name} with the same options is already in the cart.`);
      return;
    }

    const cartItem: CartItem = {
      product: product,
      quantity: quantity,
      finalPrice: product.price * quantity,
      displayPrice: `₦${(product.price * quantity).toLocaleString()}`,
      options: options
    };

    const updatedCart = [...this.cart, cartItem];
    this.cartSubject.next(updatedCart);
    this.updateStorage(updatedCart);
    this.toast.success(`${product.name} added to cart.`);
  }

  removeFromCart(productId: string, options: { size: any, print: any }) {
    const initialCartLength = this.cart.length;
    const updatedCart = this.cart.filter(item => 
      !(item.product.id === productId && 
        item.options?.size.name === options.size.name && 
        item.options?.print.name === options.print.name)
    );

    if (updatedCart.length < initialCartLength) {
      this.cartSubject.next(updatedCart);
      this.updateStorage(updatedCart);
      this.toast.success(`Item removed from cart.`);
    } else {
      this.toast.danger('Item not found in cart.');
    }
  }

  clearCart() {
    this.cartSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
    this.toast.success('Cart cleared.');
  }

  updateQuantity(productId: string, quantity: number, options: { size: any, print: any }) {
    const cartCopy = [...this.cart];
    const itemIndex = cartCopy.findIndex(item => 
      item.product.id === productId &&
      item.options?.size.name === options.size.name &&
      item.options?.print.name === options.print.name
    );

    if (itemIndex === -1) {
      this.toast.danger('Item not found in cart.');
      return;
    }

    cartCopy[itemIndex].quantity = quantity;
    this.recalculateItemPrice(cartCopy[itemIndex]);

    this.cartSubject.next(cartCopy);
    this.updateStorage(cartCopy);
  }

  private recalculateItemPrice(item: CartItem) {
    item.finalPrice = item.product.price * item.quantity;
    item.displayPrice = `₦${item.finalPrice.toLocaleString()}`;
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => {
      const price = item.finalPrice || item.product.price;
      return sum + price;
    }, 0);
  }

  getCartItems(): CartItem[] {
    return [...this.cart];
  }

  isInCart(productId: string): boolean {
    return this.cart.some(item => item.product.id === productId);
  }

  getCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  setCart(items: CartItem[]) {
    this.cartSubject.next([...items]);
    this.updateStorage(items);
  }
}
