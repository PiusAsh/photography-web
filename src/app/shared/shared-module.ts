import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GoogleMapDirective } from './directives/googleMap.directive';
import { ValidatePhoneNumberDirective } from './directives/validatePhoneNumber.directive';
import { NumberFormatDirective } from './directives/input-amount-currency.directive';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgToastModule } from 'ng-angular-popup';
import { LoaderComponent } from './components/loader/loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { currencyFormatPipe } from './pipes/currency.pipe';
import { ProductGrid } from './components/product-grid/product-grid';
import { ProductGridCarousel } from './components/product-grid-carousel/product-grid-carousel';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    GoogleMapDirective,
    ValidatePhoneNumberDirective,
    NumberFormatDirective,
    DateFormatPipe,
    LoaderComponent,
    ProductGridCarousel,
    ProductGrid,
    currencyFormatPipe
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgToastModule,
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    HttpClientModule
    
  ],
  exports: [
    GoogleMapDirective,
    ValidatePhoneNumberDirective,
    NumberFormatDirective,
    currencyFormatPipe,
    DateFormatPipe,
    LoaderComponent,
    ProductGrid,
    ProductGridCarousel,
NgbModule,
  CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    HttpClientModule,

    // Modules
    NgxPaginationModule,
    NgToastModule
  ],
  providers: [DatePipe],
})
export class SharedModule { }
