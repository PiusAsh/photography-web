import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ProductsComponent } from './pages/products/products.component';
import { SharedModule } from '../../shared/shared-module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProduct } from './pages/add-product/add-product';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AllProductsComponent } from './pages/all-products/all-products';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent,
    SidebarComponent,
    ProductsComponent,
    AddProduct,
    DashboardComponent,
    AllProductsComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AdminModule { }