import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaBipPage } from './consulta-bip.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaBipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaBipPageRoutingModule { }
