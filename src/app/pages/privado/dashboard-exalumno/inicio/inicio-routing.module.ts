import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'detalle-oferta',
    loadChildren: () => import('src/app/pages/privado/shared/emplea-inacap/detalle-oferta/detalle-oferta.module').then(m => m.DetalleOfertaPageModule)
  },
  {
    path: 'inacapmail',
    loadChildren: () => import('src/app/pages/privado/shared/inacapmail/inacapmail.module').then(m => m.InacapmailPageModule)
  },
  {
    path: 'certificados',
    loadChildren: () => import('src/app/pages/privado/shared/certificados/certificados.module').then(m => m.CertificadosPageModule)
  },
  {
    path: 'beneficios',
    loadChildren: () => import('./beneficios/beneficios.module').then(m => m.BeneficiosPageModule)
  },
  {
    path: 'practica-profesional',
    loadChildren: () => import('src/app/pages/privado/shared/practica-profesional/practica-profesional.module').then(m => m.PracticaProfesionalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule { }
