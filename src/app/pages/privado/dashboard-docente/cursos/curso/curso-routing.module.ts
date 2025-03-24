import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursoPage } from './curso.page';

const routes: Routes = [
  {
    path: '',
    component: CursoPage
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./estudiantes/estudiantes.module').then(m => m.EstudiantesPageModule)
  },
  {
    path: 'evaluaciones',
    loadChildren: () => import('./evaluaciones/evaluaciones.module').then(m => m.EvaluacionesPageModule)
  },
  {
    path: 'recuperacion',
    loadChildren: () => import('./recuperacion/recuperacion.module').then(m => m.RecuperacionPageModule)
  },
  {
    path: 'descriptor-asignatura',
    loadChildren: () => import('./descriptor-asignatura/descriptor-asignatura.module').then(m => m.DescriptorAsignaturaPageModule)
  },
  {
    path: 'tutor-ia',
    loadChildren: () => import('src/app/pages/privado/shared/tutor-ia/tutor-ia.module').then(m => m.TutorIaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursoPageRoutingModule { }
