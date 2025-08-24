import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Store } from './store/store';
import { CheckoutPage } from './checkout-page/checkout-page';
import { CartPage } from './cart-page/cart-page';
import { ProductDetails } from './product-details/product-details';
import { OrderTrackingComponent } from './order-tracking/order-tracking';

const routes: Routes = [
  {path: "", component: Store},
  {path: "checkout", component: CheckoutPage},
  {path: "order-tracking", component: OrderTrackingComponent},
  { path: 'product/:id', component: ProductDetails },
  {path: "cart", component: CartPage},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
