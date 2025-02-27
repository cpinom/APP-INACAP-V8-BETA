import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage
  },
  {
    path: 'configuraciones',
    loadChildren: () => import('src/app/pages/privado/shared/configuraciones/configuraciones.module').then(m => m.ConfiguracionesPageModule)
  },
  {
    path: 'seccion',
    loadChildren: () => import('src/app/pages/privado/dashboard-alumno/cursos/seccion/seccion.module').then(m => m.SeccionPageModule)
  },
  {
    path: 'inacapmail',
    loadChildren: () => import('src/app/pages/privado/shared/inacapmail/inacapmail.module').then(m => m.InacapmailPageModule)
  },
  {
    path: 'inacapmail/message/:id',
    loadChildren: () => import('src/app/pages/privado/shared/inacapmail/message-content/message-content-routing.module').then(m => m.MessageContentPageRoutingModule)
  },
  {
    path: 'certificados',
    loadChildren: () => import('src/app/pages/privado/shared/certificados/certificados.module').then(m => m.CertificadosPageModule)
  },
  {
    path: 'microsoft-teams',
    loadChildren: () => import('src/app/pages/privado/shared/microsoft-teams/microsoft-teams.module').then(m => m.MicrosoftTeamsPageModule)
  },
  {
    path: 'malla-curricular',
    loadChildren: () => import('./malla-curricular/malla-curricular.module').then(m => m.MallaCurricularPageModule)
  },
  {
    path: 'horario',
    loadChildren: () => import('./horario/horario.module').then(m => m.HorarioPageModule)
  },
  {
    path: 'seguro-accidentes',
    loadChildren: () => import('src/app/pages/privado/dashboard-alumno/servicios/dae/seguro-accidentes/seguro-accidentes.module').then(m => m.SeguroAccidentesPageModule)
  },
  {
    path: 'solicitudes-academicas',
    loadChildren: () => import('src/app/pages/privado/shared/solicitudes-academicas/solicitudes-academicas.module').then(m => m.SolicitudesAcademicasPageModule)
  },
  {
    path: 'solicitud-justificacion-inasistencia',
    loadChildren: () => import('src/app/pages/privado/shared/solicitudes-academicas/solicitud-documentos/solicitud-documentos.module').then(m => m.SolicitudDocumentosPageModule)
  },
  {
    path: 'ofertas-practica',
    loadChildren: () => import('src/app/pages/privado/dashboard-alumno/servicios/ofertas-practica/ofertas-practica.module').then(m => m.OfertasPracticaPageModule)
  },
  {
    path: 'progresion',
    loadChildren: () => import('./progresion/progresion.module').then(m => m.ProgresionPageModule)
  },
  {
    path: 'postulaciones',
    loadChildren: () => import('./delegados/postulaciones/postulaciones.module').then(m => m.PostulacionesPageModule)
  },
  {
    path: 'votaciones',
    loadChildren: () => import('./delegados/votaciones/votaciones.module').then(m => m.VotacionesPageModule)
  },
  {
    path: 'sede',
    loadChildren: () => import('./sede/sede.module').then(m => m.SedePageModule)
  },
  {
    path: 'portal-pagos',
    loadChildren: () => import('src/app/pages/privado/shared/portal-pagos/portal-pagos.module').then(m => m.PortalPagosPageModule)
  },
  {
    path: 'cuenta-corriente',
    loadChildren: () => import('../servicios/cuenta-corriente/cuenta-corriente.module').then(m => m.CuentaCorrientePageModule)
  },
  {
    path: 'onedrive',
    loadChildren: () => import('src/app/pages/privado/shared/onedrive/onedrive.module').then(m => m.OnedrivePageModule)
  },
  {
    path: 'reserva-espacios',
    loadChildren: () => import('src/app/pages/privado/shared/reserva-espacios/reserva-espacios.module').then(m => m.ReservaEspaciosPageModule)
  },
  {
    path: 'datos-contacto',
    loadChildren: () => import('./datos-contacto/datos-contacto.module').then(m => m.DatosContactoPageModule)
  },

  // {
  //   path: 'accesos-directos',
  //   loadChildren: () => import('./accesos-directos/accesos-directos.module').then( m => m.AccesosDirectosPageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule { }
