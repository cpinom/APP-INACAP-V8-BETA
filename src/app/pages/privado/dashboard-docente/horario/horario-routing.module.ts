import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HorarioPage } from './horario.page';

const routes: Routes = [
  {
    path: '',
    component: HorarioPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: ':seccCcod/:ssecNcorr/:asigCcod',
    loadChildren: () => import('src/app/pages/privado/dashboard-docente/cursos/curso/curso.module').then(m => m.CursoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorarioPageRoutingModule { }
