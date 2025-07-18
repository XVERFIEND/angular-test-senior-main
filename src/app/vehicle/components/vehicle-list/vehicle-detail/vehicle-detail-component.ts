import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { FinanceCalculatorComponent } from '../../../../finance-calculator/finance-calculator.component';
import { VehicleStore } from '../../../store/vehicle.store';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, FinanceCalculatorComponent],
  templateUrl: './vehicle-detail-component.html',
  styleUrl: './vehicle-detail-component.scss',
})
export class VehicleDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly vehicleStore = inject(VehicleStore);

  // signal to hold vehicle ID from url param
  vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null }
  );

  // computed signal. finds vehicle that matches ID
  vehicle = computed(() => {
    const id = this.vehicleId();
    const allVehicles = this.vehicleStore.vehicles();

    if (!id || !allVehicles) {
      return undefined;
    }
    return allVehicles.find((v) => v.id === id);
  });

  // signals for handling errors
  vehicleDataAttemptedLoad = signal(false);
  vehicleNotFound = signal(false);

  constructor() {
    /*
      when data is loaded, set vehicleDataAttemptedLoad true to prevent
      reapeated attempts to load
    */
    effect(
      () => {
        if (
          this.vehicleStore.vehicles().length > 0 &&
          !this.vehicleDataAttemptedLoad()
        ) {
          this.vehicleDataAttemptedLoad.set(true);
        }
      },
      { allowSignalWrites: true }
    );

    // error handling around vehicleNotFound
    effect(
      () => {
        const id = this.vehicleId();
        const currentVehicle = this.vehicle();
        const attemptedLoad = this.vehicleDataAttemptedLoad();

        if (id && currentVehicle !== undefined && this.vehicleNotFound()) {
          this.vehicleNotFound.set(false);
        }

        if (id && attemptedLoad && currentVehicle === undefined) {
          console.warn(`Vehicle with ID "${id}" not found.`);
          this.vehicleNotFound.set(true);
        } else if (!id && attemptedLoad) {
          this.vehicleNotFound.set(true);
        }
      },
      { allowSignalWrites: true }
    );

    // syncronise store with route
    effect(() => {
      const currentRouteId = this.vehicleId();
      if (this.vehicleStore.selectedVehicleId() !== currentRouteId) {
        this.vehicleStore.selectVehicle(currentRouteId);
      }
    });
  }

  // button to return to vehicle list
  goBack(): void {
    this.router.navigate(['/vehicles']);
  }
}
