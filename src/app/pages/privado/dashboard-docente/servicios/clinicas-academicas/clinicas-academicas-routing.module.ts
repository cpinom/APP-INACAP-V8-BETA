import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicasAcademicasPage } from './clinicas-academicas.page';

const routes: Routes = [
  {
    path: '',
    component: ClinicasAcademicasPage
  },
  {
    path: 'marcar-asistencia',
    loadChildren: () => import('./marcar-asistencia/marcar-asistencia.module').then( m => m.MarcarAsistenciaPageModule)
  },  {
    path: 'detalle-agenda',
    loadChildren: () => import('./detalle-agenda/detalle-agenda.module').then( m => m.DetalleAgendaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicasAcademicasPageRoutingModule { }
