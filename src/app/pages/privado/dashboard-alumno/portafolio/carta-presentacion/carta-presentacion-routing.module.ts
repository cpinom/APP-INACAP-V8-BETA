import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartaPresentacionPage } from './carta-presentacion.page';

const routes: Routes = [
  {
    path: '',
    component: CartaPresentacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartaPresentacionPageRoutingModule {}
