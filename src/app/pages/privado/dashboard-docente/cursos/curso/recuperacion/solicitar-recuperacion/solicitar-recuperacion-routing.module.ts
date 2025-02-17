import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SolicitarRecuperacionPage } from './solicitar-recuperacion.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarRecuperacionPage
  },  {
    path: 'buscador',
    loadChildren: () => import('./buscador/buscador.module').then( m => m.BuscadorPageModule)
  },
  {
    path: 'disponibilidad',
    loadChildren: () => import('./disponibilidad/disponibilidad.module').then( m => m.DisponibilidadPageModule)
  },
  {
    path: 'estudiantes',
    loadChildren: () => import('./estudiantes/estudiantes.module').then( m => m.EstudiantesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarRecuperacionPageRoutingModule { }
