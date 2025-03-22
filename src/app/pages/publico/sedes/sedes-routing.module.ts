import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SedesPage } from './sedes.page';

const routes: Routes = [
  {
    path: '',
    component: SedesPage
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'detalle-sede/:sedeCcod',
    loadChildren: () => import('./detalle-sede/detalle-sede.module').then(m => m.DetalleSedePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SedesPageRoutingModule { }
