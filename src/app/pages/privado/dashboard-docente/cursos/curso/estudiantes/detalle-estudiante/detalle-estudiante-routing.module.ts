import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleEstudiantePage } from './detalle-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleEstudiantePage
  },  {
    path: 'evaluaciones',
    loadChildren: () => import('./evaluaciones/evaluaciones.module').then( m => m.EvaluacionesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleEstudiantePageRoutingModule { }
