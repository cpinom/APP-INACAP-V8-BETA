import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiciosPage } from './servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPage
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'verificacion-documentos',
    loadChildren: () => import('./verificacion-documentos/verificacion-documentos.module').then(m => m.VerificacionDocumentosPageModule)
  },
  {
    path: 'informacion',
    loadChildren: () => import('./informacion/informacion.module').then( m => m.InformacionPageModule)
  },
  {
    path: 'consulta-bip',
    loadChildren: () => import('./consulta-bip/consulta-bip.module').then( m => m.ConsultaBipPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPageRoutingModule { }
