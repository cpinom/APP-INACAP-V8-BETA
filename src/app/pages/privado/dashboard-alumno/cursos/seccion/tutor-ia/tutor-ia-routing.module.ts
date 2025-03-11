import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorIaPage } from './tutor-ia.page';

const routes: Routes = [
  {
    path: '',
    component: TutorIaPage
  },  {
    path: 'agente',
    loadChildren: () => import('./agente/agente.module').then( m => m.AgentePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorIaPageRoutingModule { }
