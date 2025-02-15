import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardAlumnoPage } from './dashboard-alumno.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardAlumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardAlumnoPageRoutingModule {}
