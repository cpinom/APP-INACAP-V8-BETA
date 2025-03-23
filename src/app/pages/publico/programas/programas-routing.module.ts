import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramasPage } from './programas.page';

const routes: Routes = [
  {
    path: '',
    component: ProgramasPage
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'detalle-carrera/:areaCcod/:espeCcod',
    loadChildren: () => import('./educacion-superior/detalle-carrera/detalle-carrera.module').then( m => m.DetalleCarreraPageModule)
  },
  {
    path: 'detalle-curso',
    loadChildren: () => import('./educacion-continua/detalle-curso/detalle-curso.module').then( m => m.DetalleCursoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramasPageRoutingModule { }
