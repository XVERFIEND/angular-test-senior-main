import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, catchError, startWith, filter } from 'rxjs/operators';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { VehicleStore } from '../vehicle/vehicle.store';
import { FormsModule } from '@angular/forms';
import { combineLatest, of } from 'rxjs';
import { FinanceCalculatorService } from '../finance-calculator/finance-calculator-service';
import { Vehicle } from '../vehicle/vehicle.model';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-detail-component.html',
  styleUrl: './vehicle-detail-component.scss',
})
export class VehicleDetailComponent {
  private route = inject(ActivatedRoute);
  readonly vehicleStore = inject(VehicleStore);
  private financeCalculatorService = inject(FinanceCalculatorService);

  vehicleId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null }
  );

  vehicle = computed(() => {
    const id = this.vehicleId();
    const allVehicles = this.vehicleStore.vehicles();

    if (!id || !allVehicles) {
      return undefined;
    }
    return allVehicles.find((v) => v.id === id);
  });

  vehicleDataAttemptedLoad = signal(false);
  vehicleNotFound = signal(false);

  term = signal(60);
  deposit = signal(0);

  quoteError = signal<string | null>(null);

  private financeInputs$ = combineLatest([
    toObservable(this.vehicle),
    toObservable(this.term),
    toObservable(this.deposit),
  ]).pipe(
    filter(([vehicle]) => !!vehicle),
    map(([vehicle, term, deposit]) => ({
      vehicle: vehicle as Vehicle,
      term,
      deposit,
    }))
  );

  financeQuote = toSignal(
    this.financeInputs$.pipe(
      switchMap(({ vehicle, term, deposit }) => {
        this.quoteError.set(null);
        return this.financeCalculatorService
          .generateFinanceQuote(vehicle, term, deposit)
          .pipe(
            catchError((err) => {
              this.quoteError.set(err.message);
              return of(null);
            })
          );
      }),
      startWith(null)
    ),
    { initialValue: null }
  );

  constructor(private router: Router) {
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

    effect(() => {
      const currentRouteId = this.vehicleId();
      if (this.vehicleStore.selectedVehicleId() !== currentRouteId) {
        this.vehicleStore.selectVehicle(currentRouteId);
      }
    });

    effect(
      () => {
        const currentVehicle = this.vehicle();
        if (currentVehicle && currentVehicle.price && this.deposit() === 0) {
          this.deposit.set(parseFloat((currentVehicle.price * 0.1).toFixed(2)));
        }
      },
      { allowSignalWrites: true }
    );
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }
}
