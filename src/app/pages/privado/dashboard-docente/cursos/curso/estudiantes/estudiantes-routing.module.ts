import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstudiantesPage } from './estudiantes.page';

const routes: Routes = [
  {
    path: '',
    component: EstudiantesPage
  },
  {
    path: 'detalle-estudiante',
    loadChildren: () => import('./detalle-estudiante/detalle-estudiante.module').then(m => m.DetalleEstudiantePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstudiantesPageRoutingModule { }
