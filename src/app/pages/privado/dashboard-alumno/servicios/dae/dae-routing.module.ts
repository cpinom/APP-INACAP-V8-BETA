import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DaePage } from './dae.page';

const routes: Routes = [
  {
    path: '',
    component: DaePage
  },
  {
    path: 'actividades-extracurriculares',
    loadChildren: () => import('./actividades-extracurriculares/actividades-extracurriculares.module').then(m => m.ActividadesExtracurricularesPageModule)
  },
  {
    path: 'sede',
    loadChildren: () => import('./../../inicio/sede/sede.module').then(m => m.SedePageModule)
  },
  {
    path: 'reserva-espacios',
    loadChildren: () => import('src/app/pages/privado/shared/reserva-espacios/reserva-espacios.module').then(m => m.ReservaEspaciosPageModule)
  },
  {
    path: 'buzon-opinion',
    loadChildren: () => import('./buzon-opinion/buzon-opinion.module').then(m => m.BuzonOpinionPageModule)
  },
  {
    path: 'equipo',
    loadChildren: () => import('./equipo/equipo.module').then( m => m.EquipoPageModule)
  },
  {
    path: 'delegados',
    loadChildren: () => import('./delegados/delegados.module').then(m => m.DelegadosPageModule)
  },
  {
    path: 'seguro-accidentes',
    loadChildren: () => import('./seguro-accidentes/seguro-accidentes.module').then(m => m.SeguroAccidentesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaePageRoutingModule { }
