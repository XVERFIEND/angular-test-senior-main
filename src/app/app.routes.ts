import { Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail-component';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: '**', redirectTo: 'vehicles' }
];
