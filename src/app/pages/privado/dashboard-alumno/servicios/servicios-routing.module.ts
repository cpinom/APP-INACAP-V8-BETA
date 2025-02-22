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
    path: 'buscador-docente',
    loadChildren: () => import('src/app/pages/privado/shared/buscador-docente/buscador-docente.module').then(m => m.BuscadorDocentePageModule)
  },
  {
    path: 'solicitudes-academicas',
    loadChildren: () => import('src/app/pages/privado/shared/solicitudes-academicas/solicitudes-academicas.module').then(m => m.SolicitudesAcademicasPageModule)
  },
  {
    path: 'director-carrera',
    loadChildren: () => import('./director-carrera/director-carrera.module').then(m => m.DirectorCarreraPageModule)
  },
  {
    path: 'docentes',
    loadChildren: () => import('./docentes/docentes.module').then(m => m.DocentesPageModule)
  },
  {
    path: 'ofertas-practica',
    loadChildren: () => import('./ofertas-practica/ofertas-practica.module').then(m => m.OfertasPracticaPageModule)
  },
  {
    path: 'certificados',
    loadChildren: () => import('src/app/pages/privado/shared/certificados/certificados.module').then(m => m.CertificadosPageModule)
  },
  {
    path: 'portal-pagos',
    loadChildren: () => import('src/app/pages/privado/shared/portal-pagos/portal-pagos.module').then(m => m.PortalPagosPageModule)
  },
  {
    path: 'situaciones-pendientes',
    loadChildren: () => import('./situaciones-pendientes/situaciones-pendientes.module').then(m => m.SituacionesPendientesPageModule)
  },
  {
    path: 'consulta-bip',
    loadChildren: () => import('./consulta-bip/consulta-bip.module').then(m => m.ConsultaBipPageModule)
  },
  {
    path: 'mesa-servicios',
    loadChildren: () => import('./mesa-servicios/mesa-servicios.module').then(m => m.MesaServiciosPageModule)
  },
  {
    path: 'cuenta-corriente',
    loadChildren: () => import('./cuenta-corriente/cuenta-corriente.module').then(m => m.CuentaCorrientePageModule)
  },
  {
    path: 'devolucion-gratuidad',
    loadChildren: () => import('./devolucion-gratuidad/devolucion-gratuidad.module').then(m => m.DevolucionGratuidadPageModule)
  },
  {
    path: 'asesor-pedagogico',
    loadChildren: () => import('./asesor-pedagogico/asesor-pedagogico.module').then(m => m.AsesorPedagogicoPageModule)
  },
  {
    path: 'credenciales-digitales',
    loadChildren: () => import('./credenciales-digitales/credenciales-digitales.module').then(m => m.CredencialesDigitalesPageModule)
  },
  {
    path: 'solicitud-soporte',
    loadChildren: () => import('./solicitud-soporte/solicitud-soporte.module').then(m => m.SolicitudSoportePageModule)
  },
  {
    path: 'solicitud-estacionamiento',
    loadChildren: () => import('src/app/pages/privado/shared/solicitud-estacionamiento/solicitud-estacionamiento.module').then(m => m.SolicitudEstacionamientoPageModule)
  },
  {
    path: 'emplea-inacap',
    loadChildren: () => import('src/app/pages/privado/shared/emplea-inacap/emplea-inacap.module').then(m => m.EmpleaInacapPageModule)
  },  {
    path: 'dae',
    loadChildren: () => import('./dae/dae.module').then( m => m.DaePageModule)
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
