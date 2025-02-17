import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservaEspaciosPage } from './reserva-espacios.page';

const routes: Routes = [
  {
    path: '',
    component: ReservaEspaciosPage
  },
  {
    path: 'nueva-reserva',
    loadChildren: () => import('./nueva-reserva/nueva-reserva.module').then( m => m.NuevaReservaPageModule)
  },
  {
    path: 'detalle-reserva',
    loadChildren: () => import('./detalle-reserva/detalle-reserva.module').then( m => m.DetalleReservaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservaEspaciosPageRoutingModule { }
