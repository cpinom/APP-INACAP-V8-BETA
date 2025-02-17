import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatosPersonalesPage } from './datos-personales.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPersonalesPage
  },
  {
    path: 'editar-correo',
    loadChildren: () => import('../../../shared/datos-personales/editar-correo/editar-correo.module').then(m => m.EditarCorreoPageModule)
  },
  {
    path: 'editar-telefono',
    loadChildren: () => import('../../../shared/datos-personales/editar-telefono/editar-telefono.module').then(m => m.EditarTelefonoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPersonalesPageRoutingModule { }
