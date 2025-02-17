import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudDocumentosPage } from './solicitud-documentos.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudDocumentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudDocumentosPageRoutingModule { }
