import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ProductsComponent } from './pages/products/products.component';
import { AddProduct } from './pages/add-product/add-product';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AllProductsComponent } from './pages/all-products/all-products';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { CustomersComponent } from './pages/customers/customers';
import { AddPortfolio } from './pages/add-portfolio/add-portfolio';
import { PortfolioComponent } from './pages/portfolio/portfolio';


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
      { path: 'customers', component: CustomersComponent },
      { path: 'add-portfolio', component: AddPortfolio },
      { path: 'edit-portfolio/:id', component: AddPortfolio },
      { path: 'portfolio', component: PortfolioComponent },
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
