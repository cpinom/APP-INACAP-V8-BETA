import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from 'src/app/core/guards/access.guard';
import { OfertasPracticaPage } from './ofertas-practica.page';

const routes: Routes = [
  {
    path: '',
    component: OfertasPracticaPage
  },
  {
    path: 'detalle',
    canActivate: [AccessGuard],
    loadChildren: () => import('./detalle/detalle.module').then(m => m.DetallePageModule)
  },
  {
    path: 'practicas',
    canActivate: [AccessGuard],
    loadChildren: () => import('./practicas/practicas.module').then(m => m.PracticasPageModule)
  },
  {
    path: 'buscador',
    loadChildren: () => import('./buscador/buscador.module').then( m => m.BuscadorPageModule)
  },
  {
    path: 'solicitud-practica',
    loadChildren: () => import('src/app/pages/privado/common/solicitudes-academicas/solicitud-practica/solicitud-practica.module').then( m => m.SolicitudPracticaPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfertasPracticaPageRoutingModule { }
