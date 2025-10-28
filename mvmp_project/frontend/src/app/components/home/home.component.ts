import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  searchKeyword = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => this.products = res,
      error: () => {
        // fallback demo products if backend isn't available
        this.products = [
          { id: '1', name: 'Gold Lamp', price: 49.99, image: 'https://via.placeholder.com/300x200?text=Gold+Lamp' },
          { id: '2', name: 'Midnight Vase', price: 79.5, image: 'https://via.placeholder.com/300x200?text=Midnight+Vase' }
        ];
      }
    });
  }

  search() {
    if (this.searchKeyword.trim() !== '') {
      this.productService.searchProducts(this.searchKeyword).subscribe({
        next: (res) => this.products = res,
        error: () => this.loadProducts()
      });
    } else {
      this.loadProducts();
    }
  }
}
