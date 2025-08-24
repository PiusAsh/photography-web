import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProduct } from './pages/add-product/add-product';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AllProductsComponent } from './pages/all-products/all-products';
import { EditProductComponent } from './pages/edit-product/edit-product.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'all-products', component: AllProductsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'add-product', component: AddProduct },
      { path: 'edit-product/:id', component: EditProductComponent },
      { path: 'qr-generator', loadComponent: () => import('./pages/qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent) },
      { path: 'orders', loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
