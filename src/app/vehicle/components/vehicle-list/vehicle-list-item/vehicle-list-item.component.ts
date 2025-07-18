import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { Vehicle } from '../../../models/vehicle.model';

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
  vehicle = input.required<Vehicle>();

  // ouput string
  selected = output<string>();

  // called from template. on click, emit the vehicle id
  onViewDetails(): void {
    this.selected.emit(this.vehicle().id);
  }
}
