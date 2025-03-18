import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipoPage } from './equipo.page';

const routes: Routes = [
  {
    path: '',
    component: EquipoPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipoPageRoutingModule { }
