import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InacapmailPage } from './inacapmail.page';

const routes: Routes = [
  {
    path: '',
    component: InacapmailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InacapmailPageRoutingModule { }
