import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiciosPage } from './servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'buzon-opinion',
    loadChildren: () => import('./buzon-opinion/buzon-opinion.module').then(m => m.BuzonOpinionPageModule)
  },
  {
    path: 'tutoria',
    loadChildren: () => import('./tutoria/tutoria.module').then(m => m.TutoriaPageModule)
  },
  {
    path: 'dir-academico',
    loadChildren: () => import('./dir-academico/dir-academico.module').then(m => m.DirAcademicoPageModule)
  },
  {
    path: 'dir-carrera',
    loadChildren: () => import('./dir-carrera/dir-carrera.module').then(m => m.DirCarreraPageModule)
  },
  {
    path: 'recuperacion-clases',
    loadChildren: () => import('./recuperacion-clases/recuperacion-clases.module').then(m => m.RecuperacionClasesPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'evaluacion-docente',
    loadChildren: () => import('./evaluacion-docente/evaluacion-docente.module').then(m => m.EvaluacionDocentePageModule)
  },
  {
    path: 'buscador-docente',
    loadChildren: () => import('src/app/pages/privado/shared/buscador-docente/buscador-docente.module').then(m => m.BuscadorDocentePageModule)
  },
  {
    path: 'solicitud-estacionamiento',
    loadChildren: () => import('src/app/pages/privado/shared/solicitud-estacionamiento/solicitud-estacionamiento.module').then(m => m.SolicitudEstacionamientoPageModule)
  },
  {
    path: 'reserva-espacios',
    loadChildren: () => import('src/app/pages/privado/shared/reserva-espacios/reserva-espacios.module').then(m => m.ReservaEspaciosPageModule)
  },
  {
    path: 'clinicas-academicas',
    loadChildren: () => import('./clinicas-academicas/clinicas-academicas.module').then(m => m.ClinicasAcademicasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPageRoutingModule { }
