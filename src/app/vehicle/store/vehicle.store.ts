import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  withHooks,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

import { Vehicle } from '../models/vehicle.model';
import { VehicleDataService } from '../services/vehicle-data.service';
import { VehicleSortService } from '../services/vehicle-sort.service';

// defines the interface for the state
interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  selectedVehicleId: string | null;
  searchTerm: string;
  sortType: keyof Vehicle;
  sortDirection: 'asc' | 'desc';
}

// set the initial empty state
const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  error: null,
  selectedVehicleId: null,
  searchTerm: '',
  sortType: 'price',
  sortDirection: 'asc',
};

/*
  this is my 2.1.
  i wanted to use a store to keep the data consistent
  and i'm assuming the real world data set of vehicles would
  be quite large. using a store is better for scalability and
  make it easier to maintain.
  i specifically wanted to try a signalStore for the reduced
  boilerplate compared to a traditional NgRx store (which
  i used a lot previously and always disliked how bulky and
  convoluted it seemed). i'm also a big fan of signals
*/

export const VehicleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState), // set initial state
  // derived state. read-only values that are updated when state changes
  withComputed((store, vehicleSortService = inject(VehicleSortService)) => ({
    // returns the selected vehicle
    selectedVehicle: computed(() => {
      const selectedId = store.selectedVehicleId();
      if (!selectedId) {
        return undefined;
      }
      return store.vehicles().find((v) => v.id === selectedId);
    }),
    // returns total number of vehicles in store (used for list page,
    // can be used for pagination or similar)
    totalVehicles: computed(() => store.vehicles().length),
    // our main value for handling sorting and filtering
    // of vehicles
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
  // defines functions to modify state
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
    },
  })),
  withHooks(({ loadVehicles }) => ({
    onInit() {
      loadVehicles();
    },
  }))
);
