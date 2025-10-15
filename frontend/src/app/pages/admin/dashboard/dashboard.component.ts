import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1>Admin Dashboard</h1>
      
      <div class="card">
        <h2>Platform Overview</h2>
        <p>Manage users, vendors, products, and orders from here.</p>
        <p><em>Admin features will be expanded...</em></p>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  ngOnInit(): void {}
}
