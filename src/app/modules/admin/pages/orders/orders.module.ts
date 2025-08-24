import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '../../../../shared/shared-module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
