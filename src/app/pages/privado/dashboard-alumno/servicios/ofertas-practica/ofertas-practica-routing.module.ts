import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfertasPracticaPage } from './ofertas-practica.page';

const routes: Routes = [
  {
    path: '',
    component: OfertasPracticaPage
  },
  {
    path: 'detalle',
    loadChildren: () => import('./detalle/detalle.module').then(m => m.DetallePageModule)
  },
  {
    path: 'practicas',
    loadChildren: () => import('./practicas/practicas.module').then(m => m.PracticasPageModule)
  },
  {
    path: 'buscador',
    loadChildren: () => import('./buscador/buscador.module').then(m => m.BuscadorPageModule)
  },
  {
    path: 'solicitud-practica',
    loadChildren: () => import('src/app/pages/privado/shared/solicitudes-academicas/solicitud-practica/solicitud-practica.module').then(m => m.SolicitudPracticaPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfertasPracticaPageRoutingModule { }
