import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  template: `
    <div class="review-form">
      <h3>Write a Review</h3>
      
      <div class="rating-section">
        <label>Overall Rating</label>
        <app-star-rating
          [rating]="rating"
          [showRating]="false"
          (ratingChange)="onRatingChange($event)">
        </app-star-rating>
      </div>

      <div class="form-group">
        <label for="review-text">Your Review</label>
        <textarea
          id="review-text"
          [(ngModel)]="comment"
          rows="4"
          placeholder="Share your experience with this product..."
          class="review-textarea">
        </textarea>
      </div>

      <div class="form-group">
        <label>Add Photos</label>
        <div class="photo-upload">
          <input
            type="file"
            multiple
            accept="image/*"
            (change)="onFileSelected($event)"
            #fileInput
            class="file-input">
          <button type="button" (click)="fileInput.click()" class="upload-btn">
            Choose Photos
          </button>
          <span class="file-info" *ngIf="selectedFiles.length">
            {{selectedFiles.length}} photo(s) selected
          </span>
        </div>
        
        <div class="photo-previews" *ngIf="selectedFiles.length">
          <div *ngFor="let file of selectedFiles; let i = index" class="preview-item">
            <img [src]="previewUrls[i]" alt="Preview">
            <button type="button" class="remove-btn" (click)="removeFile(i)">×</button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="submit-btn"
          [disabled]="!isValid || submitting"
          (click)="onSubmit()">
          {{ submitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .review-form {
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    .rating-section {
      margin: 1rem 0;
    }

    .form-group {
      margin: 1.5rem 0;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .review-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      resize: vertical;
      min-height: 100px;
    }

    .photo-upload {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .file-input {
      display: none;
    }

    .upload-btn {
      padding: 0.5rem 1rem;
      background-color: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .upload-btn:hover {
      background-color: #eeeeee;
    }

    .file-info {
      color: #666;
      font-size: 0.875rem;
    }

    .photo-previews {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .preview-item {
      position: relative;
      width: 100px;
      height: 100px;
    }

    .preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }

    .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ff4444;
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
    }

    .submit-btn {
      padding: 0.75rem 1.5rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: #43A047;
    }

    .submit-btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class ReviewFormComponent {
  @Input() productId!: string;
  @Output() reviewSubmit = new EventEmitter<{
    rating: number;
    comment: string;
    files: File[];
  }>();

  rating = 0;
  comment = '';
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  submitting = false;

  onRatingChange(rating: number) {
    this.rating = rating;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      
      this.selectedFiles = [...this.selectedFiles, ...validFiles].slice(0, 5);
      this.updatePreviews();
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  private updatePreviews() {
    this.previewUrls = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit() {
    if (!this.isValid || this.submitting) return;
    
    this.submitting = true;
    this.reviewSubmit.emit({
      rating: this.rating,
      comment: this.comment.trim(),
      files: this.selectedFiles
    });
  }

  get isValid(): boolean {
    return this.rating > 0; // Only require a rating to enable submit
  }
}