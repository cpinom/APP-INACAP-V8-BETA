import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgresionPage } from './progresion.page';

const routes: Routes = [
  {
    path: '',
    component: ProgresionPage
  },
  {
    path: 'acuerdo-tutorial',
    loadChildren: () => import('./acuerdo-tutorial/acuerdo-tutorial.module').then(m => m.AcuerdoTutorialPageModule)
  },  {
    path: 'malla-curricular',
    loadChildren: () => import('./malla-curricular/malla-curricular.module').then( m => m.MallaCurricularPageModule)
  },
  {
    path: 'riesgos-academicos',
    loadChildren: () => import('./riesgos-academicos/riesgos-academicos.module').then( m => m.RiesgosAcademicosPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgresionPageRoutingModule { }
