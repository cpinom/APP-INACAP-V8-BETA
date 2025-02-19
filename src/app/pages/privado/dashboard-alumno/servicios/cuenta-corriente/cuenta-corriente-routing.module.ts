import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuentaCorrientePage } from './cuenta-corriente.page';

const routes: Routes = [
  {
    path: '',
    component: CuentaCorrientePage
  },
  {
    path: 'beneficios/:instCcod/:carrCcod/:compNdocto',
    loadChildren: () => import('./beneficios/beneficios.module').then(m => m.BeneficiosPageModule)
  },
  {
    path: 'detalle-cuenta/:instCcod/:carrCcod',
    loadChildren: () => import('./detalle-cuenta/detalle-cuenta.module').then(m => m.DetalleCuentaPageModule)
  },
  {
    path: 'detalle-concepto',
    loadChildren: () => import('./detalle-concepto/detalle-concepto.module').then(m => m.DetalleConceptoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentaCorrientePageRoutingModule { }
