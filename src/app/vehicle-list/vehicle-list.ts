import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
  Signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleListItemComponent } from '../vehicle-list-item/vehicle-list-item.component';
import {
  VEHICLE_SORT_OPTIONS,
  DIRECTION_SORT_OPTIONS,
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
export class VehicleListComponent implements OnInit {
  public vehicleSortOptions = VEHICLE_SORT_OPTIONS;
  public directionSortOptions = DIRECTION_SORT_OPTIONS;

  private readonly vehicleListFacade = inject(VehicleListFacade);
  public readonly searchControl = this.vehicleListFacade.searchControl;
  public readonly sortTypeControl = this.vehicleListFacade.sortTypeControl;
  public readonly sortDirectionControl =
    this.vehicleListFacade.sortDirectionControl;

  public readonly vehicles: Signal<Vehicle[]> = this.vehicleListFacade.vehicles;
  public readonly loading: Signal<boolean> = this.vehicleListFacade.loading;
  public readonly error: Signal<string | null> = this.vehicleListFacade.error;

  ngOnInit(): void {}

  onVehicleSelected(id: string): void {
    this.vehicleListFacade.selectVehicle(id);
  }

  public trackById(index: number, vehicle: Vehicle): string {
    return vehicle.id;
  }
}
