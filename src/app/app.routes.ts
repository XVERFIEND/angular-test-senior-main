import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VehicleDetailComponent } from './vehicle/components/vehicle-list/vehicle-detail/vehicle-detail-component';
import { VehicleListComponent } from './vehicle/components/vehicle-list/vehicle-list';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: '**', component: PageNotFoundComponent }
];
