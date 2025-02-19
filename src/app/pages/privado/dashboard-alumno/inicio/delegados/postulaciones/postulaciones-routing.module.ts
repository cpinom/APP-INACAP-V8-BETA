import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostulacionesPage } from './postulaciones.page';

const routes: Routes = [
  {
    path: '',
    component: PostulacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostulacionesPageRoutingModule { }
