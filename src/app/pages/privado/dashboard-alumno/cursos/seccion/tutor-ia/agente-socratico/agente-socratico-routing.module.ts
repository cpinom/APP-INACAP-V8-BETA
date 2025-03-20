import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgenteSocraticoPage } from './agente-socratico.page';

const routes: Routes = [
  {
    path: '',
    component: AgenteSocraticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgenteSocraticoPageRoutingModule { }
