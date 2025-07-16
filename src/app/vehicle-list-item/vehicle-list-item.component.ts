import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Vehicle } from '../vehicle/vehicle.model';

@Component({
  selector: 'app-vehicle-list-item',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './vehicle-list-item.component.html',
  styleUrl: './vehicle-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListItemComponent {
  @Input({ required: true }) vehicle!: Vehicle;

  @Output() selected = new EventEmitter<string>();

  onViewDetails(): void {
    this.selected.emit(this.vehicle.id);
  }
}
