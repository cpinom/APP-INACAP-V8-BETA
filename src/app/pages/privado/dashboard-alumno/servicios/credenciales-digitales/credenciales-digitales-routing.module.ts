import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CredencialesDigitalesPage } from './credenciales-digitales.page';

const routes: Routes = [
  {
    path: '',
    component: CredencialesDigitalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CredencialesDigitalesPageRoutingModule { }
