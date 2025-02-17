import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuscadorDocentePage } from './buscador-docente.page';

const routes: Routes = [
  {
    path: '',
    component: BuscadorDocentePage
  },
  {
    path: 'resultados',
    loadChildren: () => import('./resultados/resultados.module').then(m => m.ResultadosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuscadorDocentePageRoutingModule { }
