import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.component.html',
  styleUrls: ['./product-header.component.css'],
  standalone: false
})
export class ProductHeaderComponent {

  searchTerm: string = '';

  @Output() searchChange = new EventEmitter<string>();

  onSearch(): void {
    this.searchChange.emit(this.searchTerm);
  }
}