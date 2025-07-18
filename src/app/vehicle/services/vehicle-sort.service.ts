import { Injectable } from '@angular/core';

import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root',
})

/*
 2-3 User should be able to sort the order of the data displayed (e.g. by price, year, or mileage ascending and descending)
*/
export class VehicleSortService {
  sortVehicles(
    vehicles: Vehicle[],
    sortType: keyof Vehicle | null,
    sortDirection: 'asc' | 'desc' | null
  ): Vehicle[] {
    if (!sortType) return vehicles;

    return [...vehicles].sort((a, b) => {
      const aValue = a[sortType];
      const bValue = b[sortType];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }
}
