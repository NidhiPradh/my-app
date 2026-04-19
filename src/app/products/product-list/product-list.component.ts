import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  errorMessage = '';
  filteredProducts: Product[] = [];
  currentPage = 1;
  pageSize = 6;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data; // initialize
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  }

 get paginatedProducts(): Product[] {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
}

  onPageChange(page: number): void {
    this.currentPage = page;
  }
  //
  onSearchChange(search: string): void {
    const term = search.toLowerCase();

    this.filteredProducts = this.products.filter(p =>
      p.productName.toLowerCase().includes(term)
    );

    this.currentPage = 1;
  }
editProduct(productId?: number) {
  this.router.navigate(['products/add-product', productId]);
}
actionOnProduct() {
  this.router.navigate(['products/add-product']);
 
}}
