import { signalStore, withState, withComputed, withMethods, withHooks } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';
import { Vehicle } from './vehicle.model';
import { VehicleSortService } from '../vehicle-list/vehicle-sort/vehicle-sort.service';
import { VehicleDataService } from './vehicle-data.service';

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  selectedVehicleId: string | null;
  searchTerm: string;
  sortType: keyof Vehicle;
  sortDirection: 'asc' | 'desc';
}

const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
  searchTerm: '',
  sortType: 'price',
  sortDirection: 'asc',
};

export const VehicleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store, vehicleSortService = inject(VehicleSortService)) => ({
    selectedVehicle: computed(() => {
      const selectedId = store.selectedVehicleId();
      if (!selectedId) {
        return undefined;
      }
      return store.vehicles().find(v => v.id === selectedId);
    }),
    totalVehicles: computed(() => store.vehicles().length),
    filteredAndSortedVehicles: computed(() => {
      const vehicles = store.vehicles();
      const searchTerm = store.searchTerm().toLowerCase();
      const sortType = store.sortType();
      const sortDirection = store.sortDirection();

      let processedVehicles = vehicles.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(searchTerm) ||
          vehicle.model.toLowerCase().includes(searchTerm)
      );

      processedVehicles = vehicleSortService.sortVehicles(
        processedVehicles,
        sortType,
        sortDirection
      );

      return processedVehicles;
    }),
  })),
  withMethods((store, vehicleDataService = inject(VehicleDataService)) => ({
    loadVehicles: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          vehicleDataService.getVehicles().pipe(
            tap((vehicles) => patchState(store, { vehicles, loading: false })),
            catchError((error: any) => {
              patchState(store, { error: error.message, loading: false });
              return of([]);
            })
          )
        )
      )
    ),
    selectVehicle(id: string | null) {
      patchState(store, { selectedVehicleId: id });
    },
    clearSelectedVehicle() {
      patchState(store, { selectedVehicleId: null });
    },
    setSearchTerm(term: string) {
      patchState(store, { searchTerm: term });
    },
    setSortType(sortType: keyof Vehicle) {
      patchState(store, { sortType });
    },
    setSortDirection(sortDirection: 'asc' | 'desc') {
      patchState(store, { sortDirection });
    }
  })),
  withHooks(({ loadVehicles }) => ({
    onInit() {
      loadVehicles();
    },
  }))
);
