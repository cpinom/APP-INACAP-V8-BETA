import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgresionPage } from './progresion.page';

const routes: Routes = [
  {
    path: '',
    component: ProgresionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgresionPageRoutingModule {}
