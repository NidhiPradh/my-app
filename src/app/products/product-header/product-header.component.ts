import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.component.html',
  styleUrls: ['./product-header.component.css'],
  standalone: false
})
export class ProductHeaderComponent {
/**
 *
 */
constructor(    private router: Router) {  
}
  searchTerm: string = '';

  @Output() searchChange = new EventEmitter<string>();

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }
    //add-product
  addProduct() {
  this.router.navigate(['products/add-product']);  
  }
}