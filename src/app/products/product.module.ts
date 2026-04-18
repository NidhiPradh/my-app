import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ProductHeaderComponent } from './product-header/product-header.component';
import { AddProductComponent } from './add-product/add-product.component';

@NgModule({
  declarations: [
    ProductListComponent,
    PaginationComponent,
    ProductHeaderComponent,
    AddProductComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
