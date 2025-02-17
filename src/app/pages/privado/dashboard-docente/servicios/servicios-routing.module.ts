import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from 'src/app/core/guards/access.guard';
import { ServiciosPage } from './servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosPage
  },
  {
    path: 'configuraciones',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'buzon-opinion',
    canActivate: [AccessGuard],
    loadChildren: () => import('./buzon-opinion/buzon-opinion.module').then(m => m.BuzonOpinionPageModule)
  },
  {
    path: 'tutoria',
    canActivate: [AccessGuard],
    loadChildren: () => import('./tutoria/tutoria.module').then(m => m.TutoriaPageModule)
  },
  {
    path: 'dir-academico',
    canActivate: [AccessGuard],
    loadChildren: () => import('./dir-academico/dir-academico.module').then(m => m.DirAcademicoPageModule)
  },
  {
    path: 'dir-carrera',
    canActivate: [AccessGuard],
    loadChildren: () => import('./dir-carrera/dir-carrera.module').then(m => m.DirCarreraPageModule)
  },
  {
    path: 'recuperacion-clases',
    canActivate: [AccessGuard],
    loadChildren: () => import('./recuperacion-clases/recuperacion-clases.module').then(m => m.RecuperacionClasesPageModule)
  },
  {
    path: 'notificaciones',
    canActivate: [AccessGuard],
    loadChildren: () => import('../notificaciones/notificaciones.module').then(m => m.NotificacionesPageModule)
  },
  {
    path: 'evaluacion-docente',
    canActivate: [AccessGuard],
    loadChildren: () => import('./evaluacion-docente/evaluacion-docente.module').then(m => m.EvaluacionDocentePageModule)
  },
  {
    path: 'buscador-docente',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/buscador-docente/buscador-docente.module').then(m => m.BuscadorDocentePageModule)
  },
  {
    path: 'solicitud-estacionamiento',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/solicitud-estacionamiento/solicitud-estacionamiento.module').then(m => m.SolicitudEstacionamientoPageModule)
  },
  {
    path: 'reserva-espacios',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/reserva-espacios/reserva-espacios.module').then(m => m.ReservaEspaciosPageModule)
  },
  {
    path: 'clinicas-academicas',
    canActivate: [AccessGuard],
    loadChildren: () => import('./clinicas-academicas/clinicas-academicas.module').then( m => m.ClinicasAcademicasPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPageRoutingModule { }
