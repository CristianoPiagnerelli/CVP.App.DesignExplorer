import { Component, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../services/data.service';
import { Option } from '../../models/option.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cards-grid',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="cards-grid" (document:keydown.escape)="clearSelection()">
      <mat-card
        *ngFor="let option of options"
        [class.hidden]="!option.visible"
        [class.hoverable]="true"
        [class.selected]="option === selectedOption"
        (click)="toggleSelection(option)"
        tabindex="0"
        (keydown.enter)="toggleSelection(option)"
        (keydown.space)="toggleSelection(option)">
        
        <mat-card-header>
          <mat-card-title>{{ option.name }}</mat-card-title>
        </mat-card-header>
        <img mat-card-image src="https://preview.redd.it/bbi1h959eq571.jpg?auto=webp&s=395f6f1548c2f3146f1cadf5d47c7122ee5eca36">
      </mat-card>
    </div>
  `,
  styles: [`
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }

    .hidden {
      display: none;
    }

    mat-card {
      margin-bottom: 16px;
      transition: all 0.2s ease-in-out;
      outline: none;
    }

    mat-card.hoverable:hover {
      border: 2px solid #3f51b5;
      box-shadow: 0 4px 20px rgba(63, 81, 181, 0.4);
      transform: scale(1.02);
      cursor: pointer;
    }

    mat-card.selected {
      border: 2px solid #3f51b5;
      box-shadow: 0 4px 20px rgba(63, 81, 181, 0.4);
      transform: scale(1.03);
    }

  `],
  host: {
    '(document:keydown.escape)': 'clearSelection()'
  }
})
export class CardsGridComponent implements OnInit, OnDestroy {
  options: Option[] = [];
  selectedOption: Option | null = null;
  private subscription: Subscription | null = null;
  private clickListener!: () => void;

  constructor(
    private dataService: DataService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.subscription = this.dataService.getOptions().subscribe(options => {
      this.options = options;
    });

    // Ascolta click sul documento
    this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      // Se il click NON è dentro il componente
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.clearSelection();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.clickListener) {
      this.clickListener();
    }
  }

  toggleSelection(option: Option): void {
    this.selectedOption = this.selectedOption === option ? null : option;
  }

  clearSelection(): void {
    this.selectedOption = null;
  }
}