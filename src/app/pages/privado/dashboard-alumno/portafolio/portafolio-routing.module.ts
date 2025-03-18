import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortafolioPage } from './portafolio.page';

const routes: Routes = [
  {
    path: '',
    component: PortafolioPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'informacion-personal',
    loadChildren: () => import('./informacion-personal/informacion-personal.module').then( m => m.InformacionPersonalPageModule)
  },
  {
    path: 'practica-profesional',
    loadChildren: () => import('src/app/pages/privado/shared/practica-profesional/practica-profesional.module').then( m => m.PracticaProfesionalPageModule)
  },
  {
    path: 'certificados-intermedios',
    loadChildren: () => import('./certificados-intermedios/certificados-intermedios.module').then( m => m.CertificadosIntermediosPageModule)
  },
  {
    path: 'progresion',
    loadChildren: () => import('./progresion/progresion.module').then( m => m.ProgresionPageModule)
  },
  {
    path: 'reconocimientos',
    loadChildren: () => import('./reconocimientos/reconocimientos.module').then( m => m.ReconocimientosPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortafolioPageRoutingModule { }
