import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from 'src/app/core/guards/access.guard';
import { CursosPage } from './cursos.page';

const routes: Routes = [
  {
    path: '',
    component: CursosPage
  },
  {
    path: 'configuraciones',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'seccion',
    canActivate: [AccessGuard],
    loadChildren: () => import('./seccion/seccion.module').then(m => m.SeccionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosPageRoutingModule { }
