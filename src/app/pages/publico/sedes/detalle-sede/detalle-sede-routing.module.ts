import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleSedePage } from './detalle-sede.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleSedePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleSedePageRoutingModule { }
