import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VehicleListItemComponent } from '../vehicle-list-item/vehicle-list-item.component';
import {
  DIRECTION_SORT_OPTIONS,
  VEHICLE_SORT_OPTIONS,
} from '../vehicle-sort/vehicle-sort-options.constants';
import { Vehicle } from '../vehicle/vehicle.model';
import { VehicleListFacade } from './vehicle-list.facade';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VehicleListItemComponent,
  ],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListComponent {
  // import sort option constants
  public vehicleSortOptions = VEHICLE_SORT_OPTIONS;
  public directionSortOptions = DIRECTION_SORT_OPTIONS;

  // inject vehicleList facade
  private readonly vehicleListFacade = inject(VehicleListFacade);

  // reactive form controls from facade for input fields in the template
  public readonly searchControl = this.vehicleListFacade.searchControl;
  public readonly sortTypeControl = this.vehicleListFacade.sortTypeControl;
  public readonly sortDirectionControl =
    this.vehicleListFacade.sortDirectionControl;

  // signals from facade
  public readonly vehicles: Signal<Vehicle[]> = this.vehicleListFacade.vehicles;
  public readonly loading: Signal<boolean> = this.vehicleListFacade.loading;
  public readonly error: Signal<string | null> = this.vehicleListFacade.error;

  // method called from template when vehicle is selected
  onVehicleSelected(id: string): void {
    this.vehicleListFacade.selectVehicle(id);
  }
}
