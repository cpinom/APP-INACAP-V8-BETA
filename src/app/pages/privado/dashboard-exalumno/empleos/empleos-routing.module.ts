import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleosPage } from './empleos.page';

const routes: Routes = [
  {
    path: '',
    component: EmpleosPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'detalle-oferta',
    loadChildren: () => import('src/app/pages/privado/shared/emplea-inacap/detalle-oferta/detalle-oferta.module').then(m => m.DetalleOfertaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleosPageRoutingModule {}
