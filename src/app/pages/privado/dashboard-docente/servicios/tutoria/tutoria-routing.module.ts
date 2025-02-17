import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutoriaPage } from './tutoria.page';

const routes: Routes = [
  {
    path: '',
    component: TutoriaPage
  },
  {
    path: 'estudiante',
    loadChildren: () => import('./estudiante-tut/estudiante-tut.module').then(m => m.EstudianteTutPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutoriaPageRoutingModule { }
