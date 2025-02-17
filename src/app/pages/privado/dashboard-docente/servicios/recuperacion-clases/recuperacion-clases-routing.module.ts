import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecuperacionClasesPage } from './recuperacion-clases.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperacionClasesPage
  },
  {
    path: 'detalle-solicitud/:reclNcorr',
    loadChildren: () => import('src/app/pages/privado/docente/cursos/curso/recuperacion/detalle-solicitud/detalle-solicitud.module').then(m => m.DetalleSolicitudPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperacionClasesPageRoutingModule { }
