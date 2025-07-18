import { Injectable } from '@angular/core';
import { catchError, delay, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})

/*
  This was requested in the spec so it is shown here,
  however I have used NgRx to create a signal store
  that i will be using throughout the rest of the
  app :)
  I thought since this was a senior position I'd
  show my capabilities a little more.
  See: vehicle.store.ts
/*

/*
1.2: Implement an injectable `VehicleService` that includes two
async methods
*/
export class VehicleService {
  private dataPath = 'public/data/vehicles.json';

  constructor(private http: HttpClient) {}

  /*
  1.2.1: Return all of the mock `Vehicle` data
  */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.dataPath).pipe(
      delay(1500), // delay so we can see loading state
      catchError((error) => {
        console.error('Error fetching vehicles:', error);
        return throwError(() => new Error('Failed to load vehicle data.'));
      })
    );
  }

  /*
  1.2.2: Return a single `Vehicle` from the mock
  `Vehicle` data based on a provided ID.
  */
  getVehicleById(id: string): Observable<Vehicle | undefined> {
    return this.getVehicles().pipe(
      switchMap((vehicles) => {
        return of(vehicles.find((v) => v.id === id));
      }),
      catchError((error) => {
        console.error(`Error fetching vehicle with ID ${id}:`, error);
        return throwError(
          () => new Error(`Failed to retrieve vehicle with ID ${id}.`)
        );
      })
    );
  }
}
