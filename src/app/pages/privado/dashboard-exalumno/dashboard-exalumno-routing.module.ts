import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardExalumnoPage } from './dashboard-exalumno.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardExalumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardExalumnoPageRoutingModule {}
