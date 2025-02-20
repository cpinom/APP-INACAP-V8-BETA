import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeccionPage } from './seccion.page';

const routes: Routes = [
  {
    path: '',
    component: SeccionPage
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./estudiantes/estudiantes.module').then( m => m.EstudiantesPageModule)
  },
  {
    path: 'evaluaciones',
    loadChildren: () => import('./evaluaciones/evaluaciones.module').then( m => m.EvaluacionesPageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'bibliografia',
    loadChildren: () => import('./bibliografia/bibliografia.module').then( m => m.BibliografiaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeccionPageRoutingModule {}
