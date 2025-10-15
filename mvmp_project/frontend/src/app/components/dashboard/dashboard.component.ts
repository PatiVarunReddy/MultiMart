import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  userRole = localStorage.getItem('role') || 'User';
  constructor() {}

  ngOnInit(): void {}
}
