import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificadosPage } from './certificados.page';

const routes: Routes = [
  {
    path: '',
    component: CertificadosPage,
  },
  {
    path: 'nueva-solicitud',
    loadChildren: () => import('./nueva-solicitud/nueva-solicitud.module').then(m => m.NuevaSolicitudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificadosPageRoutingModule { }
