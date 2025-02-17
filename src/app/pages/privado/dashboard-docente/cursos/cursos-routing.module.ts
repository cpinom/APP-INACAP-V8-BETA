import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursosPage } from './cursos.page';

const routes: Routes = [
  {
    path: '',
    component: CursosPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'curso',
    loadChildren: () => import('./curso/curso.module').then(m => m.CursoPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'seccion',
    loadChildren: () => import('./curso/curso.module').then(m => m.CursoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosPageRoutingModule { }
