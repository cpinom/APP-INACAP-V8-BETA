import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'credencial-virtual',
    loadChildren: () => import('./credencial-virtual/credencial-virtual.module').then( m => m.CredencialVirtualPageModule)
  },
  {
    path: 'documentos',
    loadChildren: () => import('./documentos/documentos.module').then( m => m.DocumentosPageModule)
  },
  {
    path: 'cuenta-corriente',
    loadChildren: () => import('../servicios/cuenta-corriente/cuenta-corriente.module').then(m => m.CuentaCorrientePageModule)
  },
  {
    path: 'informacion-academica',
    loadChildren: () => import('./informacion-academica/informacion-academica.module').then( m => m.InformacionAcademicaPageModule)
  },
  {
    path: 'foto-perfil',
    loadChildren: () => import('./foto-perfil/foto-perfil.module').then( m => m.FotoPerfilPageModule)
  },
  {
    path: 'editar-correo',
    loadChildren: () => import('src/app/pages/privado/shared/datos-personales/editar-correo/editar-correo.module').then(m => m.EditarCorreoPageModule)
  },
  {
    path: 'editar-telefono',
    loadChildren: () => import('src/app/pages/privado/shared/datos-personales/editar-telefono/editar-telefono.module').then(m => m.EditarTelefonoPageModule)
  },  {
    path: 'datos-emergencia',
    loadChildren: () => import('./datos-emergencia/datos-emergencia.module').then( m => m.DatosEmergenciaPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule { }
