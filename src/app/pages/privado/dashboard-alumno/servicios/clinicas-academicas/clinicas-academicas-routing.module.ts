import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicasAcademicasPage } from './clinicas-academicas.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicasAcademicasPage
  },
  {
    path: 'agendar-hora',
    loadChildren: () => import('./agendar-hora/agendar-hora.module').then(m => m.AgendarHoraPageModule)
  },
  {
    path: 'detalle-agenda',
    loadChildren: () => import('./detalle-agenda/detalle-agenda.module').then(m => m.DetalleAgendaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicasAcademicasPageRoutingModule { }
