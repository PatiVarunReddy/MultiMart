import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(){
    this.orderService.getCart().subscribe({
      next: (res) => this.cartItems = res,
      error: () => this.cartItems = []
    });
  }

  checkout(){
    // navigate to checkout in real app
    alert('Proceed to checkout');
  }
}
