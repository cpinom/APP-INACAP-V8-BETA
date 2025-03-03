import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReconocimientosPage } from './reconocimientos.page';

const routes: Routes = [
  {
    path: '',
    component: ReconocimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReconocimientosPageRoutingModule {}
