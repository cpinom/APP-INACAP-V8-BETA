import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleaInacapPage } from './emplea-inacap.page';
import { AccessGuard } from 'src/app/core/guards/access.guard';

const routes: Routes = [
  {
    path: '',
    component: EmpleaInacapPage
  },
  {
    path: 'detalle-oferta',
    loadChildren: () => import('./detalle-oferta/detalle-oferta.module').then( m => m.DetalleOfertaPageModule)
  },
  {
    path: 'configuraciones',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpleaInacapPageRoutingModule {}
