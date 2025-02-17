import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalPagosPage } from './portal-pagos.page';

const routes: Routes = [
  {
    path: '',
    component: PortalPagosPage
  },
  // {
  //   path: 'modal-exito',
  //   loadChildren: () => import('./modal-exito/modal-exito.module').then(m => m.ModalExitoPageModule)
  // },
  // {
  //   path: 'modal-fracaso',
  //   loadChildren: () => import('./modal-fracaso/modal-fracaso.module').then(m => m.ModalFracasoPageModule)
  // },
  // {
  //   path: 'modal-compromiso',
  //   loadChildren: () => import('./modal-compromiso/modal-compromiso.module').then(m => m.ModalCompromisoPageModule)
  // },
  {
    path: 'detalle-compromiso',
    loadChildren: () => import('./detalle-compromiso/detalle-compromiso.module').then( m => m.DetalleCompromisoPageModule)
  },  {
    path: 'detalle-pago',
    loadChildren: () => import('./detalle-pago/detalle-pago.module').then( m => m.DetallePagoPageModule)
  },



  // {
  //   path: 'modal-confirmacion',
  //   loadChildren: () => import('./modal-confirmacion/modal-confirmacion.module').then( m => m.ModalConfirmacionPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortalPagosPageRoutingModule { }
