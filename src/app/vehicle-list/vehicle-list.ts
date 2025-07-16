import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  VEHICLE_SORT_OPTIONS,
  DIRECTION_SORT_OPTIONS,
} from './vehicle-sort/vehicle-sort-options.constants';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Router } from '@angular/router';
import { VehicleStore } from '../vehicle/vehicle.store';
import { Vehicle } from '../vehicle/vehicle.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
})
export class VehicleListComponent implements OnInit {
  public vehicleSortOptions = VEHICLE_SORT_OPTIONS;
  public directionSortOptions = DIRECTION_SORT_OPTIONS;

  public searchControl = new FormControl('');
  public sortTypeControl = new FormControl<keyof Vehicle>('price');
  public sortDirectionControl = new FormControl<'asc' | 'desc'>('asc');

  readonly vehicleStore = inject(VehicleStore);
  private router = inject(Router);

  ngOnInit(): void {
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

    this.vehicleStore.setSearchTerm(this.searchControl.value || '');
    this.vehicleStore.setSortType(this.sortTypeControl.value || 'price');
    this.vehicleStore.setSortDirection(
      this.sortDirectionControl.value || 'asc'
    );
  }

  navigateToVehicleDetail(id: string): void {
    this.router.navigate(['/vehicle', id]);
  }
}
