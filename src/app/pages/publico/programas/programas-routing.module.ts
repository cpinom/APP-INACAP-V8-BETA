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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgramasPageRoutingModule { }
