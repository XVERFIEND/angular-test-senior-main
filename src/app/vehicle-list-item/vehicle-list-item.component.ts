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
  // input vehicle object
  @Input({ required: true }) vehicle!: Vehicle;

  // ouput string event
  @Output() selected = new EventEmitter<string>();

  // called from template. on click, emit the vehicle id
  onViewDetails(): void {
    this.selected.emit(this.vehicle.id);
  }
}
