import { SortOption } from '../models/vehicle-sort-options.model';

export const VEHICLE_SORT_OPTIONS: SortOption[] = [
  { sortType: 'price', label: 'Price' },
  { sortType: 'year', label: 'Year' },
  { sortType: 'mileage', label: 'Mileage' },
];

export const DIRECTION_SORT_OPTIONS: {
  sortType: 'asc' | 'desc';
  label: string;
}[] = [
  { sortType: 'asc', label: 'Ascending' },
  { sortType: 'desc', label: 'Descending' },
];
