import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentePage } from './agente.page';

const routes: Routes = [
  {
    path: '',
    component: AgentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentePageRoutingModule { }
