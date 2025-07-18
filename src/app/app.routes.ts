import { Routes } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail-component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: '**', component: PageNotFoundComponent }
];
