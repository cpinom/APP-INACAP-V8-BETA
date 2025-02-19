import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcuerdoTutorialPage } from './acuerdo-tutorial.page';

const routes: Routes = [
  {
    path: '',
    component: AcuerdoTutorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcuerdoTutorialPageRoutingModule { }
