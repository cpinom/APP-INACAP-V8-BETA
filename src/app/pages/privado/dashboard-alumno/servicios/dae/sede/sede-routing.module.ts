import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SedePage } from './sede.page';

const routes: Routes = [
  {
    path: '',
    component: SedePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SedePageRoutingModule {}
