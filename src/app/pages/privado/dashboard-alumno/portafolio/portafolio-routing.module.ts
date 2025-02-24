import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortafolioPage } from './portafolio.page';

const routes: Routes = [
  {
    path: '',
    component: PortafolioPage
  },  {
    path: 'informacion-personal',
    loadChildren: () => import('./informacion-personal/informacion-personal.module').then( m => m.InformacionPersonalPageModule)
  },
  {
    path: 'carta-presentacion',
    loadChildren: () => import('./carta-presentacion/carta-presentacion.module').then( m => m.CartaPresentacionPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PortafolioPageRoutingModule { }
