import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleaInacapPage } from './emplea-inacap.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleaInacapPage
  },
  {
    path: 'detalle-oferta',
    loadChildren: () => import('./detalle-oferta/detalle-oferta.module').then(m => m.DetalleOfertaPageModule)
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleaInacapPageRoutingModule { }
