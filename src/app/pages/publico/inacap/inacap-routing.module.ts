import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InacapPage } from './inacap.page';

const routes: Routes = [
  {
    path: '',
    component: InacapPage
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'detalle-inacap',
    loadChildren: () => import('./detalle-inacap/detalle-inacap.module').then(m => m.DetalleInacapPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InacapPageRoutingModule { }
