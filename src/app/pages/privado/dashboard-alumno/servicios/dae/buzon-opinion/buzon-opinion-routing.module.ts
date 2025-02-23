import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuzonOpinionPage } from './buzon-opinion.page';

const routes: Routes = [
  {
    path: '',
    component: BuzonOpinionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuzonOpinionPageRoutingModule { }
