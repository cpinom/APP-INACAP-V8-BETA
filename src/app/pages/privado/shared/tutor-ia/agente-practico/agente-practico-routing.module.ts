import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentePracticoPage } from './agente-practico.page';

const routes: Routes = [
  {
    path: '',
    component: AgentePracticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentePracticoPageRoutingModule { }
