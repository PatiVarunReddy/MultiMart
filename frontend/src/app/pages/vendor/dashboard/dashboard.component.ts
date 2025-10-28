import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { InventoryService } from '../../../services/inventory.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendor-dashboard',
  template: `
    <div class="container" style="margin-top: 2rem;">
      <h1 style="margin-bottom: 2rem;">Vendor Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <lucide-icon name="package" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <h3>{{products.length}}</h3>
            <p>My Products</p>
          </div>
        </div>
        <div class="stat-card">
          <lucide-icon name="shopping-cart" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <h3>{{orders.length}}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div class="stat-card">
          <lucide-icon name="dollar-sign" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <h3>₹{{totalSales}}</h3>
            <p>Total Sales</p>
          </div>
        </div>
        <div class="stat-card" *ngIf="inventoryStats">
          <lucide-icon name="box" class="stat-icon"></lucide-icon>
          <div class="stat-info">
            <h3>{{inventoryStats.totalItems || 0}}</h3>
            <p>Sourced Items</p>
          </div>
        </div>
      </div>
      
      <!-- TABS -->
      <div class="tabs">
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'products'"
          (click)="switchTab('products')">
          <lucide-icon name="package" style="width: 18px; height: 18px;"></lucide-icon>
          My Products
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'browse'"
          (click)="switchTab('browse')">
          <lucide-icon name="shopping-bag" style="width: 18px; height: 18px;"></lucide-icon>
          Browse Inventory
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'inventory'"
          (click)="switchTab('inventory')">
          <lucide-icon name="box" style="width: 18px; height: 18px;"></lucide-icon>
          My Inventory
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'orders'"
          (click)="switchTab('orders')">
          <lucide-icon name="truck" style="width: 18px; height: 18px;"></lucide-icon>
          Orders
        </button>
      </div>
      
      <!-- MY PRODUCTS TAB -->
      <div class="card" *ngIf="activeTab === 'products'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2>My Products</h2>
          <button class="btn btn-primary" (click)="toggleProductForm()">
            <lucide-icon [name]="showAddProduct ? 'x' : 'package'" style="width: 18px; height: 18px; margin-right: 0.5rem;"></lucide-icon>
            {{showAddProduct ? 'Cancel' : 'Add New Product'}}
          </button>
        </div>
        
        <!-- DETAILED PRODUCT FORM -->
        <div *ngIf="showAddProduct" class="product-form">
          <h3 style="margin-bottom: 1.5rem; color: #2c3e50;">{{editingProduct ? 'Edit Product' : 'Add New Product'}}</h3>
          
          <div *ngIf="message" [class]="messageClass" style="margin-bottom: 1rem;">{{message}}</div>
          
          <form [formGroup]="productForm" (ngSubmit)="saveProduct()">
            <div class="form-row">
              <div class="form-group" style="flex: 2;">
                <label>Product Name *</label>
                <input 
                  type="text" 
                  formControlName="name" 
                  class="form-control" 
                  placeholder="e.g., iPhone 15 Pro Max"
                  autocomplete="off">
                <small *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="error-text">
                  Product name is required
                </small>
              </div>
              
              <div class="form-group">
                <label>Brand</label>
                <input 
                  type="text" 
                  formControlName="brand" 
                  class="form-control" 
                  placeholder="e.g., Apple"
                  autocomplete="organization">
              </div>
            </div>
            
            <div class="form-group">
              <label>Description *</label>
              <textarea 
                formControlName="description" 
                class="form-control" 
                rows="4" 
                placeholder="Detailed product description..."
                autocomplete="off"></textarea>
              <small *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched" class="error-text">
                Description is required
              </small>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <select formControlName="category" class="form-control">
                  <option value="">Select Category</option>
                  <option *ngFor="let cat of categories" [value]="cat._id">{{cat.name}}</option>
                </select>
                <small *ngIf="productForm.get('category')?.invalid && productForm.get('category')?.touched" class="error-text">
                  Category is required
                </small>
              </div>
              
              <div class="form-group">
                <label>Price (₹) *</label>
                <input 
                  type="number" 
                  formControlName="price" 
                  class="form-control" 
                  placeholder="0"
                  autocomplete="off">
              </div>
              
              <div class="form-group">
                <label>Discount Price (₹)</label>
                <input 
                  type="number" 
                  formControlName="discountPrice" 
                  class="form-control" 
                  placeholder="Optional"
                  autocomplete="off">
              </div>
              
              <div class="form-group">
                <label>Stock Quantity *</label>
                <input 
                  type="number" 
                  formControlName="stock" 
                  class="form-control" 
                  placeholder="0"
                  autocomplete="off">
              </div>
            </div>
            
            <div class="form-group">
              <label>Product Images (URLs) *</label>
              <div *ngFor="let img of imageInputs; let i = index" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input 
                  type="url" 
                  [(ngModel)]="imageInputs[i]" 
                  [ngModelOptions]="{standalone: true}"
                  class="form-control" 
                  placeholder="https://example.com/image.jpg"
                  autocomplete="url">
                <button type="button" (click)="removeImageInput(i)" class="btn btn-danger" style="padding: 0.5rem 1rem; display: flex; align-items: center;">
                  <lucide-icon name="x" style="width: 16px; height: 16px;"></lucide-icon>
                </button>
              </div>
              <button type="button" (click)="addImageInput()" class="btn" style="background: #ecf0f1; margin-top: 0.5rem; display: inline-flex; align-items: center;">
                <lucide-icon name="package" style="width: 16px; height: 16px; margin-right: 0.5rem;"></lucide-icon>
                Add Another Image
              </button>
              <small style="display: block; margin-top: 0.5rem; color: #7f8c8d;">
                Tip: Use image URLs from services like Imgur, Cloudinary, or direct links
              </small>
            </div>
            
            <div class="form-group">
              <label>Tags (comma-separated)</label>
              <input 
                type="text" 
                formControlName="tags" 
                class="form-control" 
                placeholder="e.g., smartphone, electronics, 5G"
                autocomplete="off">
              <small style="display: block; margin-top: 0.5rem; color: #7f8c8d;">
                Separate tags with commas for better search
              </small>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>
                  <input type="checkbox" formControlName="isFeatured" style="margin-right: 0.5rem;">
                  Featured Product
                </label>
              </div>
              
              <div class="form-group">
                <label>
                  <input type="checkbox" formControlName="freeShipping" style="margin-right: 0.5rem;">
                  Free Shipping
                </label>
              </div>
            </div>
            
            <div class="form-row" *ngIf="!productForm.get('freeShipping')?.value">
              <div class="form-group">
                <label>Shipping Cost (₹)</label>
                <input type="number" formControlName="shippingCost" class="form-control" placeholder="0">
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" (click)="cancelForm()" class="btn" style="background: #95a5a6; color: white;">
                Cancel
              </button>
              <button type="submit" class="btn btn-success" [disabled]="productForm.invalid || saving">
                {{saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}}
              </button>
            </div>
          </form>
        </div>
        
        <!-- PRODUCTS TABLE -->
        <div *ngIf="!showAddProduct" class="products-table">
          <div *ngIf="products.length === 0" style="text-align: center; padding: 2rem; color: #7f8c8d;">
            <lucide-icon name="package" style="width: 64px; height: 64px; margin-bottom: 1rem; stroke: #bdc3c7;"></lucide-icon>
            <p style="font-size: 1.2rem;">No products yet</p>
            <p>Click "Add New Product" to create your first product</p>
          </div>
          
          <table *ngIf="products.length > 0">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of products">
                <td>
                  <img [src]="product.images[0] || 'https://via.placeholder.com/60'" 
                       style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                </td>
                <td>
                  <strong>{{product.name}}</strong><br>
                  <small style="color: #7f8c8d;">{{product.brand}}</small>
                </td>
                <td>
                  <strong style="color: #27ae60;">₹{{product.discountPrice || product.price}}</strong>
                  <span *ngIf="product.discountPrice" style="display: block; text-decoration: line-through; font-size: 0.85rem; color: #95a5a6;">
                    ₹{{product.price}}
                  </span>
                </td>
                <td>
                  <span [style.color]="product.stock > 10 ? '#27ae60' : product.stock > 0 ? '#f39c12' : '#e74c3c'">
                    {{product.stock}} units
                  </span>
                </td>
                <td>
                  <span class="badge" [class.badge-success]="product.isApproved" [class.badge-warning]="!product.isApproved">
                    {{product.isApproved ? 'Approved' : 'Pending'}}
                  </span>
                </td>
                <td>
                  <div style="display: flex; gap: 0.5rem;">
                    <button (click)="editProduct(product)" class="btn-edit">
                      <lucide-icon name="package" style="width: 18px; height: 18px;"></lucide-icon>
                      Edit
                    </button>
                    <button (click)="deleteProduct(product._id)" class="btn-delete">
                      <lucide-icon name="x" style="width: 18px; height: 18px;"></lucide-icon>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- BROWSE INVENTORY TAB -->
      <div class="card" *ngIf="activeTab === 'browse'">
        <h2 style="margin-bottom: 1.5rem;">Browse Products from Other Vendors</h2>
        <p style="color: #7f8c8d; margin-bottom: 1.5rem;">Source quality products from other vendors to expand your inventory</p>
        
        <div *ngIf="message && activeTab === 'browse'" [class]="messageClass" style="margin-bottom: 1rem;">{{message}}</div>
        
        <div *ngIf="browseProducts.length === 0" class="empty-state">
          <lucide-icon name="shopping-bag" style="width: 64px; height: 64px; color: #bdc3c7;"></lucide-icon>
          <p style="font-size: 1.2rem;">No products available</p>
        </div>
        
        <div class="products-grid" *ngIf="browseProducts.length > 0">
          <div class="product-browse-card" *ngFor="let product of browseProducts">
            <img [src]="product.images[0] || 'https://via.placeholder.com/200'" class="product-browse-image">
            <div class="product-browse-content">
              <h4>{{product.name}}</h4>
              <p class="product-browse-vendor">
                <lucide-icon name="store" style="width: 14px; height: 14px;"></lucide-icon>
                {{product.vendor?.storeName}}
              </p>
              <p class="product-browse-category">{{product.category?.name}}</p>
              <div class="product-browse-price">
                <span class="price-main">₹{{product.discountPrice || product.price}}</span>
                <span class="stock-info">{{product.stock}} in stock</span>
              </div>
              <button class="btn btn-primary" (click)="openSourceModal(product)" style="width: 100%; margin-top: 1rem;">
                <lucide-icon name="plus" style="width: 16px; height: 16px;"></lucide-icon>
                Source This Product
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- MY INVENTORY TAB -->
      <div class="card" *ngIf="activeTab === 'inventory'">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2>My Sourced Inventory</h2>
          <button class="btn btn-success" (click)="loadInventoryAnalytics()">
            <lucide-icon name="bar-chart" style="width: 18px; height: 18px; margin-right: 0.5rem;"></lucide-icon>
            View Analytics
          </button>
        </div>
        
        <div *ngIf="inventoryAnalytics" class="analytics-grid" style="margin-bottom: 2rem;">
          <div class="analytics-card">
            <h4>Total Investment</h4>
            <p class="analytics-value">₹{{inventoryAnalytics.totalInvestment}}</p>
          </div>
          <div class="analytics-card">
            <h4>Potential Revenue</h4>
            <p class="analytics-value">₹{{inventoryAnalytics.totalPotentialRevenue}}</p>
          </div>
          <div class="analytics-card">
            <h4>Expected Profit</h4>
            <p class="analytics-value" [style.color]="inventoryAnalytics.expectedProfit > 0 ? '#27ae60' : '#e74c3c'">
              ₹{{inventoryAnalytics.expectedProfit}}
            </p>
          </div>
          <div class="analytics-card">
            <h4>Avg Profit Margin</h4>
            <p class="analytics-value">{{inventoryAnalytics.averageProfitMargin}}%</p>
          </div>
        </div>
        
        <div *ngIf="inventory.length === 0" class="empty-state">
          <lucide-icon name="box" style="width: 64px; height: 64px; color: #bdc3c7;"></lucide-icon>
          <p style="font-size: 1.2rem;">No inventory items yet</p>
          <p>Browse products from other vendors to build your inventory</p>
        </div>
        
        <table *ngIf="inventory.length > 0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Source Vendor</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Profit Margin</th>
              <th>Total Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of inventory">
              <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <img [src]="item.sourceProduct?.images?.[0] || 'https://via.placeholder.com/40'" 
                       style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                  <span>{{item.sourceProduct?.name}}</span>
                </div>
              </td>
              <td>{{item.sourceVendor?.storeName}}</td>
              <td>{{item.quantity}}</td>
              <td>₹{{item.purchasePrice}}</td>
              <td>₹{{item.sellingPrice}}</td>
              <td>
                <span [style.color]="item.profitMargin > 20 ? '#27ae60' : item.profitMargin > 10 ? '#f39c12' : '#e74c3c'">
                  {{item.profitMargin}}%
                </span>
              </td>
              <td><strong>₹{{item.totalCost}}</strong></td>
              <td>
                <span class="badge" 
                      [class.badge-success]="item.status === 'active'"
                      [class.badge-warning]="item.status === 'out-of-stock'"
                      [class.badge-danger]="item.status === 'discontinued'">
                  {{item.status}}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 0.5rem;">
                  <button (click)="updateInventoryItem(item)" class="btn-edit">Edit</button>
                  <button (click)="deleteInventoryItem(item._id)" class="btn-delete">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- ORDERS TAB -->
      <div class="card" *ngIf="activeTab === 'orders'">
        <h2 style="margin-bottom: 1.5rem;">Orders</h2>
        
        <div *ngIf="orders.length === 0" class="empty-state">
          <lucide-icon name="truck" style="width: 64px; height: 64px; color: #bdc3c7;"></lucide-icon>
          <p style="font-size: 1.2rem;">No orders yet</p>
        </div>
        
        <div *ngIf="orders.length > 0">
          <div class="order-card" *ngFor="let order of orders" style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h4>Order #{{order._id.slice(-8)}}</h4>
                <p style="color: #7f8c8d; margin: 0.5rem 0;">
                  {{order.orderItems.length}} item(s) • ₹{{order.totalPrice}}
                </p>
                <p style="color: #7f8c8d; margin: 0;">
                  {{order.createdAt | date:'medium'}}
                </p>
              </div>
              <span class="badge badge-{{order.orderStatus === 'Delivered' ? 'success' : 'warning'}}">
                {{order.orderStatus}}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- SOURCE PRODUCT MODAL -->
      <div class="modal" *ngIf="showSourceModal" (click)="closeSourceModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2>Source Product</h2>
            <button (click)="closeSourceModal()" style="background: none; border: none; cursor: pointer;">
              <lucide-icon name="x" style="width: 24px; height: 24px;"></lucide-icon>
            </button>
          </div>
          
          <div *ngIf="selectedProduct" style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 1rem; align-items: start;">
              <img [src]="selectedProduct.images[0]" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
              <div>
                <h3>{{selectedProduct.name}}</h3>
                <p style="color: #7f8c8d;">{{selectedProduct.vendor?.storeName}}</p>
                <p><strong>Available Stock:</strong> {{selectedProduct.stock}} units</p>
                <p><strong>Price:</strong> ₹{{selectedProduct.discountPrice || selectedProduct.price}}</p>
              </div>
            </div>
          </div>
          
          <div *ngIf="message && showSourceModal" [class]="messageClass" style="margin-bottom: 1rem;">{{message}}</div>
          
          <form [formGroup]="sourceForm" (ngSubmit)="submitSourceProduct()">
            <div class="form-group">
              <label>Quantity to Source *</label>
              <input type="number" formControlName="quantity" class="form-control" min="1" [max]="selectedProduct?.stock">
            </div>
            
            <div class="form-group">
              <label>Purchase Price per Unit *</label>
              <input type="number" formControlName="purchasePrice" class="form-control" min="0" step="0.01">
              <small style="color: #7f8c8d;">The price you'll pay to source this product</small>
            </div>
            
            <div class="form-group">
              <label>Your Selling Price *</label>
              <input type="number" formControlName="sellingPrice" class="form-control" min="0" step="0.01">
              <small style="color: #7f8c8d;">The price you'll sell at (recommended: add 20-30% margin)</small>
            </div>
            
            <div class="form-group" *ngIf="sourceForm.get('purchasePrice')?.value && sourceForm.get('sellingPrice')?.value">
              <div style="padding: 1rem; background: #e8f5e9; border-radius: 8px;">
                <p style="margin: 0; color: #27ae60;">
                  <strong>Profit per unit:</strong> 
                  ₹{{sourceForm.get('sellingPrice')?.value - sourceForm.get('purchasePrice')?.value}}
                  ({{((sourceForm.get('sellingPrice')?.value - sourceForm.get('purchasePrice')?.value) / sourceForm.get('purchasePrice')?.value * 100).toFixed(1)}}%)
                </p>
                <p style="margin: 0.5rem 0 0 0; color: #27ae60;">
                  <strong>Total Investment:</strong> 
                  ₹{{sourceForm.get('purchasePrice')?.value * sourceForm.get('quantity')?.value}}
                </p>
              </div>
            </div>
            
            <div class="form-group">
              <label>Notes (Optional)</label>
              <textarea formControlName="notes" class="form-control" rows="2" placeholder="Any notes about this sourcing..."></textarea>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
              <button type="button" (click)="closeSourceModal()" class="btn">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="sourceForm.invalid || loading">
                {{loading ? 'Sourcing...' : 'Source Product'}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    
    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
    }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      stroke-width: 2;
    }
    
    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
    }
    
    .stat-info p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
    }
    
    .product-form {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .error-text {
      color: #e74c3c;
      font-size: 0.85rem;
      display: block;
      margin-top: 0.25rem;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 2px solid #ddd;
    }
    
    .products-table table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    
    .products-table th {
      background: #34495e;
      color: white;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }
    
    .products-table td {
      padding: 1rem;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .products-table tr:hover {
      background: #f8f9fa;
    }
    
    .badge {
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .badge-success {
      background: #d4edda;
      color: #155724;
    }
    
    .badge-warning {
      background: #fff3cd;
      color: #856404;
    }
    
    /* Modern Action Buttons */
    .btn-edit,
    .btn-delete {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .btn-edit {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .btn-edit:hover {
      background: linear-gradient(135deg, #5568d3 0%, #6a4293 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }
    
    .btn-delete {
      background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
      color: white;
    }
    
    .btn-delete:hover {
      background: linear-gradient(135deg, #d42d3f 0%, #e04f3b 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(235, 51, 73, 0.3);
    }
    
    .btn-edit:active,
    .btn-delete:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid #e9ecef;
      padding-bottom: 0;
    }
    
    .tab-button {
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      color: #7f8c8d;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      font-size: 1rem;
    }
    
    .tab-button:hover {
      color: #667eea;
      border-bottom-color: #667eea;
    }
    
    .tab-button.active {
      color: #667eea;
      border-bottom-color: #667eea;
      font-weight: 600;
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    
    .product-browse-card {
      border: 1px solid #e9ecef;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s;
      background: white;
    }
    
    .product-browse-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    
    .product-browse-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    
    .product-browse-content {
      padding: 1rem;
    }
    
    .product-browse-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #2c3e50;
    }
    
    .product-browse-vendor {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      color: #7f8c8d;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    }
    
    .product-browse-category {
      color: #95a5a6;
      font-size: 0.85rem;
      margin: 0.3rem 0;
    }
    
    .product-browse-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }
    
    .price-main {
      font-size: 1.3rem;
      font-weight: bold;
      color: #27ae60;
    }
    
    .stock-info {
      color: #7f8c8d;
      font-size: 0.85rem;
    }
    
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .analytics-card {
      padding: 1.5rem;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      text-align: center;
    }
    
    .analytics-card h4 {
      margin: 0 0 1rem 0;
      color: #7f8c8d;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .analytics-value {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0;
      color: #2c3e50;
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .badge-danger {
      background: #e74c3c;
    }
  `]
})
export class VendorDashboardComponent implements OnInit {
  // Existing properties
  products: any[] = [];
  orders: any[] = [];
  categories: any[] = [];
  totalSales = 0;
  showAddProduct = false;
  productForm: FormGroup;
  imageInputs: string[] = [''];
  saving = false;
  message = '';
  messageClass = '';
  editingProduct: any = null;
  
  // New inventory properties
  activeTab = 'products';
  inventory: any[] = [];
  browseProducts: any[] = [];
  inventoryStats: any = null;
  inventoryAnalytics: any = null;
  showSourceModal = false;
  selectedProduct: any = null;
  sourceForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private inventoryService: InventoryService,
    private http: HttpClient
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      brand: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPrice: [0],
      stock: [0, [Validators.required, Validators.min(0)]],
      tags: [''],
      isFeatured: [false],
      freeShipping: [false],
      shippingCost: [0]
    });
    
    this.sourceForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      purchasePrice: [0, [Validators.required, Validators.min(0)]],
      sellingPrice: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getMyProducts().subscribe({
      next: (response: any) => {
        this.products = response.data || [];
        console.log('[SUCCESS] Loaded vendor products:', this.products);
      },
      error: (err) => {
        console.error('[ERROR] Failed to load products:', err);
      }
    });
  }

  loadCategories(): void {
    this.http.get<any>('http://localhost:5000/api/categories').subscribe({
      next: (response) => {
        this.categories = response.data || [];
        console.log('[SUCCESS] Loaded categories:', this.categories);
      },
      error: (err) => {
        console.error('[ERROR] Error loading categories:', err);
      }
    });
  }

  toggleProductForm(): void {
    this.showAddProduct = !this.showAddProduct;
    if (!this.showAddProduct) {
      this.cancelForm();
    }
  }

  addImageInput(): void {
    this.imageInputs.push('');
  }

  removeImageInput(index: number): void {
    this.imageInputs.splice(index, 1);
    if (this.imageInputs.length === 0) {
      this.imageInputs = [''];
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    this.message = '';

    const formData = this.productForm.value;
    
    // Process images
    const validImages = this.imageInputs.filter(img => img && img.trim() !== '');
    
    // Process tags
    const tagsArray = formData.tags ? formData.tags.split(',').map((t: string) => t.trim()) : [];
    
    const productData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      brand: formData.brand,
      price: formData.price,
      discountPrice: formData.discountPrice || undefined,
      stock: formData.stock,
      images: validImages.length > 0 ? validImages : ['https://via.placeholder.com/500'],
      tags: tagsArray,
      isFeatured: formData.isFeatured,
      shippingInfo: {
        freeShipping: formData.freeShipping,
        shippingCost: formData.freeShipping ? 0 : formData.shippingCost
      }
    };

    const request = this.editingProduct 
      ? this.productService.updateProduct(this.editingProduct._id, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: (response) => {
        this.saving = false;
        this.message = this.editingProduct ? '[SUCCESS] Product updated successfully!' : '[SUCCESS] Product added successfully!';
        this.messageClass = 'alert alert-success';
        
        setTimeout(() => {
          this.loadProducts();
          this.cancelForm();
          this.showAddProduct = false;
        }, 1500);
      },
      error: (err) => {
        this.saving = false;
        this.message = '[ERROR] ' + (err.error?.message || 'Failed to save product');
        this.messageClass = 'alert alert-error';
      }
    });
  }

  editProduct(product: any): void {
    this.editingProduct = product;
    this.showAddProduct = true;
    
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category._id || product.category,
      brand: product.brand || '',
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      tags: product.tags ? product.tags.join(', ') : '',
      isFeatured: product.isFeatured || false,
      freeShipping: product.shippingInfo?.freeShipping || false,
      shippingCost: product.shippingInfo?.shippingCost || 0
    });
    
    this.imageInputs = product.images && product.images.length > 0 ? [...product.images] : [''];
  }

  cancelForm(): void {
    this.productForm.reset({
      price: 0,
      discountPrice: 0,
      stock: 0,
      isFeatured: false,
      freeShipping: false,
      shippingCost: 0
    });
    this.imageInputs = [''];
    this.editingProduct = null;
    this.message = '';
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          alert('[SUCCESS] Product deleted successfully!');
        },
        error: () => {
          alert('[ERROR] Failed to delete product');
        }
      });
    }
  }
  
  // New inventory methods
  switchTab(tab: string): void {
    this.activeTab = tab;
    this.message = '';
    this.showAddProduct = false;
    
    if (tab === 'browse' && this.browseProducts.length === 0) {
      this.loadBrowseProducts();
    } else if (tab === 'inventory' && this.inventory.length === 0) {
      this.loadMyInventory();
    } else if (tab === 'orders' && this.orders.length === 0) {
      this.loadOrders();
    }
  }
  
  loadBrowseProducts(): void {
    this.inventoryService.getBrowseProducts().subscribe({
      next: (response: any) => {
        this.browseProducts = response.data || [];
        console.log('[SUCCESS] Loaded browse products:', this.browseProducts);
      },
      error: (err) => {
        console.error('[ERROR] Failed to load browse products:', err);
        this.message = 'Failed to load products';
        this.messageClass = 'alert alert-error';
      }
    });
  }
  
  loadMyInventory(): void {
    this.inventoryService.getMyInventory().subscribe({
      next: (response: any) => {
        this.inventory = response.data || [];
        this.inventoryStats = response.stats || null;
        console.log('[SUCCESS] Loaded inventory:', this.inventory);
      },
      error: (err) => {
        console.error('[ERROR] Failed to load inventory:', err);
      }
    });
  }
  
  loadOrders(): void {
    this.orderService.getVendorOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data || [];
        this.totalSales = this.orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
        console.log('[SUCCESS] Loaded orders:', this.orders);
      },
      error: (err) => {
        console.error('[ERROR] Failed to load orders:', err);
      }
    });
  }
  
  loadInventoryAnalytics(): void {
    this.inventoryService.getInventoryAnalytics().subscribe({
      next: (response: any) => {
        this.inventoryAnalytics = response.data;
        console.log('[SUCCESS] Loaded analytics:', this.inventoryAnalytics);
      },
      error: (err) => {
        console.error('[ERROR] Failed to load analytics:', err);
      }
    });
  }
  
  openSourceModal(product: any): void {
    this.selectedProduct = product;
    this.showSourceModal = true;
    this.message = '';
    
    // Pre-fill with suggested pricing
    const suggestedPurchasePrice = product.discountPrice || product.price;
    const suggestedSellingPrice = Math.round(suggestedPurchasePrice * 1.25); // 25% markup
    
    this.sourceForm.patchValue({
      quantity: 1,
      purchasePrice: suggestedPurchasePrice,
      sellingPrice: suggestedSellingPrice
    });
  }
  
  closeSourceModal(): void {
    this.showSourceModal = false;
    this.selectedProduct = null;
    this.sourceForm.reset({
      quantity: 1,
      purchasePrice: 0,
      sellingPrice: 0,
      notes: ''
    });
    this.message = '';
  }
  
  submitSourceProduct(): void {
    if (this.sourceForm.invalid || !this.selectedProduct) return;
    
    this.loading = true;
    this.message = '';
    
    const formData = {
      ...this.sourceForm.value,
      productId: this.selectedProduct._id
    };
    
    this.inventoryService.sourceProduct(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.message = 'Product sourced successfully!';
        this.messageClass = 'alert alert-success';
        
        setTimeout(() => {
          this.closeSourceModal();
          this.loadMyInventory();
          this.switchTab('inventory');
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.message = err.error?.message || 'Failed to source product';
        this.messageClass = 'alert alert-error';
      }
    });
  }
  
  updateInventoryItem(item: any): void {
    const newQuantity = prompt(`Update quantity for ${item.sourceProduct?.name}:`, item.quantity);
    if (newQuantity === null) return;
    
    const newSellingPrice = prompt(`Update selling price:`, item.sellingPrice);
    if (newSellingPrice === null) return;
    
    const updateData = {
      quantity: parseInt(newQuantity),
      sellingPrice: parseFloat(newSellingPrice)
    };
    
    this.inventoryService.updateInventory(item._id, updateData).subscribe({
      next: () => {
        this.loadMyInventory();
        alert('Inventory updated successfully!');
      },
      error: (err) => {
        alert('Failed to update inventory');
      }
    });
  }
  
  deleteInventoryItem(id: string): void {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      this.inventoryService.deleteInventory(id).subscribe({
        next: () => {
          this.loadMyInventory();
          alert('Inventory item deleted successfully!');
        },
        error: () => {
          alert('Failed to delete inventory item');
        }
      });
    }
  }
}

