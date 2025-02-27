import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortafolioPage } from './portafolio.page';

const routes: Routes = [
  {
    path: '',
    component: PortafolioPage
  },  {
    path: 'informacion-personal',
    loadChildren: () => import('./informacion-personal/informacion-personal.module').then( m => m.InformacionPersonalPageModule)
  },
  {
    path: 'carta-presentacion',
    loadChildren: () => import('./carta-presentacion/carta-presentacion.module').then( m => m.CartaPresentacionPageModule)
  },
  {
    path: 'practica-profesional',
    loadChildren: () => import('./practica-profesional/practica-profesional.module').then( m => m.PracticaProfesionalPageModule)
  },
  {
    path: 'certificados-intermedios',
    loadChildren: () => import('./certificados-intermedios/certificados-intermedios.module').then( m => m.CertificadosIntermediosPageModule)
  },
  {
    path: 'progresion',
    loadChildren: () => import('./progresion/progresion.module').then( m => m.ProgresionPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortafolioPageRoutingModule { }
