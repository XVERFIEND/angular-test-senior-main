import { Injectable, inject, Signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { Vehicle } from '../../models/vehicle.model';
import { VehicleStore } from '../../store/vehicle.store';

@Injectable({
  providedIn: 'root',
})
export class VehicleListFacade {
  public searchControl = new FormControl('');
  public sortTypeControl = new FormControl<keyof Vehicle>('price');
  public sortDirectionControl = new FormControl<'asc' | 'desc'>('asc');

  readonly vehicleStore = inject(VehicleStore);
  private router = inject(Router);

  public readonly vehicles: Signal<Vehicle[]> =
    this.vehicleStore.filteredAndSortedVehicles;

  public readonly loading: Signal<boolean> = this.vehicleStore.loading;
  public readonly error: Signal<string | null> = this.vehicleStore.error;

  constructor() {
    this.initializeFormControls();
    this.setupSubscriptions();
  }

  private initializeFormControls(): void {
    this.vehicleStore.setSearchTerm(this.searchControl.value || '');
    this.vehicleStore.setSortType(this.sortTypeControl.value || 'price');
    this.vehicleStore.setSortDirection(
      this.sortDirectionControl.value || 'asc'
    );
  }

  private setupSubscriptions(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.vehicleStore.setSearchTerm(term || '');
      });

    this.sortTypeControl.valueChanges.subscribe((sortType) => {
      if (sortType) {
        this.vehicleStore.setSortType(sortType);
      }
    });

    this.sortDirectionControl.valueChanges.subscribe((sortDirection) => {
      if (sortDirection) {
        this.vehicleStore.setSortDirection(sortDirection);
      }
    });
  }

  public selectVehicle(id: string): void {
    this.router.navigate(['/vehicle', id]);
  }
}
