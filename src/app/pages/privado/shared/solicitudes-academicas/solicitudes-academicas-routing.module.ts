import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudesAcademicasPage } from './solicitudes-academicas.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesAcademicasPage
  },
  {
    path: 'solicitud-simple',
    loadChildren: () => import('./solicitud-simple/solicitud-simple.module').then(m => m.SolicitudPageModule)
  },
  {
    path: 'solicitud-documentos',
    loadChildren: () => import('./solicitud-documentos/solicitud-documentos.module').then( m => m.SolicitudDocumentosPageModule)
  },
  {
    path: 'solicitud-practica',
    loadChildren: () => import('./solicitud-practica/solicitud-practica.module').then( m => m.SolicitudPracticaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesAcademicasPageRoutingModule { }
