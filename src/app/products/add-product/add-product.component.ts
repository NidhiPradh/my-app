import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: false
})
export class AddProductComponent implements OnInit {
  product: Product = {} as Product;
  constructor(private productService: ProductService,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router) {
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // load product data for editing
      this.productService.getProductById(Number(id)).subscribe({
        next: (res) => {
          this.product = res;
          this.cdr.detectChanges();
          // Fix date format for input[type="date"]
          this.product.manufactureDate = this.formatDateForInput(this.product.manufactureDate);
          this.product.expiryDate = this.formatDateForInput(this.product.expiryDate);
          this.product.recievedDate = this.formatDateForInput(this.product.recievedDate);
        },
        error: (err) => {
          console.error('Error loading product', err);
        }
      });
    }
  }


  onSubmit(form: any) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product.productID = Number(id);
    }
    this.authservice.user$.subscribe(user => {
      if (user) {
        this.product.createdBy = Number(user.id);
      }
    });
    if (this.product.createdBy && this.product.productID == undefined) {
      this.productService.addProduct(this.product).subscribe({
        next: (res) => {
          console.log('Product added successfully', res);
          alert('Product added successfully!');
          form.resetForm();
        },
        error: () => {
          alert('Failed to add product. Please try again.');
        }
      });
      //
    }
    else if (this.product.productID) {
      alert('product updated successfully!');
      this.router.navigate(['products']);
    }

  }

  formatDateForInput(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

}
