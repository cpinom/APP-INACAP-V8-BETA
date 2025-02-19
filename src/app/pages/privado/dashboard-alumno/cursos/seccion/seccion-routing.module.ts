import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from 'src/app/core/guards/access.guard';
import { SeccionPage } from './seccion.page';

const routes: Routes = [
  {
    path: '',
    component: SeccionPage
  },
  {
    path: 'estudiantes',
    canActivate: [AccessGuard],
    loadChildren: () => import('./estudiantes/estudiantes.module').then( m => m.EstudiantesPageModule)
  },
  {
    path: 'evaluaciones',
    canActivate: [AccessGuard],
    loadChildren: () => import('./evaluaciones/evaluaciones.module').then( m => m.EvaluacionesPageModule)
  },
  {
    path: 'asistencia',
    canActivate: [AccessGuard],
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'bibliografia',
    canActivate: [AccessGuard],
    loadChildren: () => import('./bibliografia/bibliografia.module').then( m => m.BibliografiaPageModule)
  },  {
    path: 'auto-asistencia',
    loadChildren: () => import('./auto-asistencia/auto-asistencia.module').then( m => m.AutoAsistenciaPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeccionPageRoutingModule {}
