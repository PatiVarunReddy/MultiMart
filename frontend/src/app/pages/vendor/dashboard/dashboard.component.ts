import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
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
            <p>Total Products</p>
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
      </div>
      
      <div class="card">
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
                <input type="text" formControlName="name" class="form-control" placeholder="e.g., iPhone 15 Pro Max">
                <small *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="error-text">
                  Product name is required
                </small>
              </div>
              
              <div class="form-group">
                <label>Brand</label>
                <input type="text" formControlName="brand" class="form-control" placeholder="e.g., Apple">
              </div>
            </div>
            
            <div class="form-group">
              <label>Description *</label>
              <textarea formControlName="description" class="form-control" rows="4" 
                        placeholder="Detailed product description..."></textarea>
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
                <input type="number" formControlName="price" class="form-control" placeholder="0">
              </div>
              
              <div class="form-group">
                <label>Discount Price (₹)</label>
                <input type="number" formControlName="discountPrice" class="form-control" placeholder="Optional">
              </div>
              
              <div class="form-group">
                <label>Stock Quantity *</label>
                <input type="number" formControlName="stock" class="form-control" placeholder="0">
              </div>
            </div>
            
            <div class="form-group">
              <label>Product Images (URLs) *</label>
              <div *ngFor="let img of imageInputs; let i = index" style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="url" [(ngModel)]="imageInputs[i]" [ngModelOptions]="{standalone: true}"
                       class="form-control" placeholder="https://example.com/image.jpg">
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
              <input type="text" formControlName="tags" class="form-control" 
                     placeholder="e.g., smartphone, electronics, 5G">
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
  `]
})
export class VendorDashboardComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
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
}
