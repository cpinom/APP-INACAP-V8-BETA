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
    loadChildren: () => import('./../servicios/ofertas-practica/ofertas-practica.module').then( m => m.OfertasPracticaPageModule)
  },
  {
    path: 'certificados-intermedios',
    loadChildren: () => import('./../servicios/credenciales-digitales/credenciales-digitales.module').then( m => m.CredencialesDigitalesPageModule)
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
