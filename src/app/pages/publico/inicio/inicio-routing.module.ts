import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'detalle-destacado',
    loadChildren: () => import('./detalle-destacado/detalle-destacado.module').then(m => m.DetalleDestacadoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule { }
