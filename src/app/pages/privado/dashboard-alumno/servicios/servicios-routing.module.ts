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
    path: 'buscador-docente',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/buscador-docente/buscador-docente.module').then(m => m.BuscadorDocentePageModule)
  },
  {
    path: 'solicitudes-academicas',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/solicitudes-academicas/solicitudes-academicas.module').then(m => m.SolicitudesAcademicasPageModule)
  },
  {
    path: 'director-carrera',
    canActivate: [AccessGuard],
    loadChildren: () => import('./director-carrera/director-carrera.module').then(m => m.DirectorCarreraPageModule)
  },
  {
    path: 'docentes',
    canActivate: [AccessGuard],
    loadChildren: () => import('./docentes/docentes.module').then(m => m.DocentesPageModule)
  },
  {
    path: 'ofertas-practica',
    canActivate: [AccessGuard],
    loadChildren: () => import('./ofertas-practica/ofertas-practica.module').then(m => m.OfertasPracticaPageModule)
  },
  {
    path: 'certificados',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/certificados/certificados.module').then(m => m.CertificadosPageModule)
  },
  {
    path: 'portal-pagos',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/portal-pagos/portal-pagos.module').then(m => m.PortalPagosPageModule)
  },
  {
    path: 'situaciones-pendientes',
    canActivate: [AccessGuard],
    loadChildren: () => import('./situaciones-pendientes/situaciones-pendientes.module').then(m => m.SituacionesPendientesPageModule)
  },
  {
    path: 'consulta-bip',
    canActivate: [AccessGuard],
    loadChildren: () => import('./consulta-bip/consulta-bip.module').then(m => m.ConsultaBipPageModule)
  },
  {
    path: 'mesa-servicios',
    canActivate: [AccessGuard],
    loadChildren: () => import('./mesa-servicios/mesa-servicios.module').then(m => m.MesaServiciosPageModule)
  },
  {
    path: 'cuenta-corriente',
    canActivate: [AccessGuard],
    loadChildren: () => import('./cuenta-corriente/cuenta-corriente.module').then(m => m.CuentaCorrientePageModule)
  },
  {
    path: 'devolucion-gratuidad',
    canActivate: [AccessGuard],
    loadChildren: () => import('./devolucion-gratuidad/devolucion-gratuidad.module').then(m => m.DevolucionGratuidadPageModule)
  },
  {
    path: 'asesor-pedagogico',
    canActivate: [AccessGuard],
    loadChildren: () => import('./asesor-pedagogico/asesor-pedagogico.module').then(m => m.AsesorPedagogicoPageModule)
  },
  {
    path: 'credenciales-digitales',
    canActivate: [AccessGuard],
    loadChildren: () => import('./credenciales-digitales/credenciales-digitales.module').then(m => m.CredencialesDigitalesPageModule)
  },
  {
    path: 'solicitud-soporte',
    canActivate: [AccessGuard],
    loadChildren: () => import('./solicitud-soporte/solicitud-soporte.module').then(m => m.SolicitudSoportePageModule)
  },
  {
    path: 'solicitud-estacionamiento',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/solicitud-estacionamiento/solicitud-estacionamiento.module').then(m => m.SolicitudEstacionamientoPageModule)
  },
  {
    path: 'emplea-inacap',
    canActivate: [AccessGuard],
    loadChildren: () => import('src/app/pages/privado/common/emplea-inacap/emplea-inacap.module').then( m => m.EmpleaInacapPageModule)
  },
  // {
  //   path: 'bibliotecas',
  //   canActivate: [AccessGuard],
  //   loadChildren: () => import('src/app/pages/privado/common/bibliotecas/bibliotecas.module').then(m => m.BibliotecasPageModule)
  // },
  // {
  //   path: 'clinicas-academicas',
  //   canActivate: [AccessGuard],
  //   loadChildren: () => import('./clinicas-academicas/clinicas-academicas.module').then( m => m.ClinicasAcademicasPageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosPageRoutingModule { }
