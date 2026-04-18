import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: false
})
export class AddProductComponent {

  constructor(private productService: ProductService, private authservice: AuthService) {

  }
  product: Product = {} as Product;

  onSubmit(form: any) {
    this.authservice.user$.subscribe(user => {
      if (user) {
        this.product.createdBy = Number(user.id); // Assuming user has an 'id' property
      }
    });
    if(this.product.createdBy) {
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
    
  }

}
