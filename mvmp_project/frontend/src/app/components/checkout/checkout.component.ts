import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  name = '';
  address = '';

  constructor(private orderService: OrderService, private router: Router) {}

  placeOrder(){
    const order = { name: this.name, address: this.address };
    this.orderService.placeOrder(order).subscribe({
      next: ()=> {
        alert('Order placed');
        this.router.navigate(['/']);
      },
      error: ()=> {
        alert('Failed to place order (backend may be offline).');
      }
    });
  }
}
