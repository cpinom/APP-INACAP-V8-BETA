import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorIaPage } from './tutor-ia.page';

const routes: Routes = [
  {
    path: '',
    component: TutorIaPage
  },
  {
    path: 'agente-socratico',
    loadChildren: () => import('./agente-socratico/agente-socratico.module').then( m => m.AgenteSocraticoPageModule)
  },
  {
    path: 'agente-practico',
    loadChildren: () => import('./agente-practico/agente-practico.module').then( m => m.AgentePracticoPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then( m => m.TestPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorIaPageRoutingModule { }
