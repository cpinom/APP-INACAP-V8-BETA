import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaePage } from './dae.page';

const routes: Routes = [
  {
    path: '',
    component: DaePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaePageRoutingModule {}
