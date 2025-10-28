import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Star } from 'lucide-angular';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="star-rating">
      <div class="stars" [class.disabled]="!interactive">
        <span *ngFor="let star of stars; let i = index" 
              class="star-wrapper"
              (mouseover)="interactive && onHover(i + 1)"
              (mouseleave)="interactive && onLeave()"
              (click)="interactive && onClick(i + 1)">
          <div class="star-container">
            <lucide-icon 
              name="star" 
              [class.filled]="star.filled"
              [class.half-filled]="star.halfFilled"
              [class.hovered]="star.hovered">
            </lucide-icon>
            <!-- Half star overlay -->
            <lucide-icon 
              *ngIf="star.halfFilled"
              name="star" 
              class="half-star filled">
            </lucide-icon>
          </div>
        </span>
      </div>
      <span *ngIf="showRating" class="rating-text">
        {{ displayRating }} {{ showCount ? '(' + ratingCount + ')' : '' }}
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      display: flex;
      gap: 0.25rem;
    }

    .star-wrapper {
      cursor: pointer;
      display: inline-flex;
    }

    .disabled .star-wrapper {
      cursor: default;
    }

    .star-container {
      position: relative;
      display: inline-flex;
    }

    lucide-icon {
      width: 24px;
      height: 24px;
      stroke: #d4d4d4;
      stroke-width: 1.5;
      transition: all 0.2s ease;
      fill: transparent;
      &:hover {
        transform: scale(1.1);
      }
    }

    lucide-icon.filled {
      stroke: gold;
      fill: gold;
      filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.3));
    }

    lucide-icon.half-filled {
      position: relative;
    }

    .half-star {
      position: absolute;
      left: 0;
      top: 0;
      width: 12px; /* Half width to create half-star effect */
      overflow: hidden;
      stroke: gold;
      fill: gold;
      filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.3));
    }

    lucide-icon.hovered {
      transform: scale(1.1);
      stroke: gold;
      fill: gold;
      filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
    }

    .rating-text {
      font-size: 0.9rem;
      color: #666;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() ratingCount = 0;
  @Input() interactive = true;
  @Input() showRating = true;
  @Input() showCount = true;
  @Output() ratingChange = new EventEmitter<number>();

  stars = Array(5).fill(null).map(() => ({ 
    filled: false, 
    halfFilled: false,
    hovered: false 
  }));
  hoveredRating = 0;

  ngOnInit() {
    this.updateStars();
  }

  ngOnChanges() {
    this.updateStars();
  }

  onClick(rating: number) {
    if (!this.interactive) return;
    this.rating = rating;
    this.updateStars();
    this.ratingChange.emit(rating);
  }

  onHover(rating: number) {
    if (!this.interactive) return;
    this.hoveredRating = rating;
    this.updateStars(true);
  }

  onLeave() {
    if (!this.interactive) return;
    this.hoveredRating = 0;
    this.updateStars();
  }

  private updateStars(isHovered = false) {
    const activeRating = isHovered ? this.hoveredRating : this.rating;
    this.stars.forEach((star, index) => {
      const position = index + 1;
      const difference = position - activeRating;
      
      star.filled = position <= Math.floor(activeRating);
      star.halfFilled = !star.filled && difference <= 0.5 && difference > 0;
      star.hovered = isHovered && position <= this.hoveredRating;
    });
  }

  get displayRating(): string {
    return this.rating.toFixed(1);
  }
}