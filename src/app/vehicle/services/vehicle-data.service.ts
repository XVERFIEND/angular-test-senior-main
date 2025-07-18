// src/app/services/vehicle-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, catchError, throwError } from 'rxjs';

import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleDataService {
  private dataPath = 'public/data/vehicles.json';

  constructor(private http: HttpClient) {}

  /*
    mocks pulling data from and endpoint
    delay added so we get to see loading state
  */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.dataPath).pipe(
      delay(1500),
      catchError((error) => {
        console.error('Error fetching vehicles:', error);
        return throwError(() => new Error('Failed to load vehicle data.'));
      })
    );
  }
}
