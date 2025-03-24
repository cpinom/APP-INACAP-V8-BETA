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
    path: 'inacapmail',
    loadChildren: () => import('src/app/pages/privado/shared/inacapmail/inacapmail.module').then(m => m.InacapmailPageModule)
  },
  {
    path: 'inacapmail',
    loadChildren: () => import('src/app/pages/privado/shared/inacapmail/inacapmail.module').then(m => m.InacapmailPageModule)
  },
  {
    path: 'microsoft-teams',
    loadChildren: () => import('src/app/pages/privado/shared/microsoft-teams/microsoft-teams.module').then(m => m.MicrosoftTeamsPageModule)
  },
  {
    path: 'seccion',
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/pages/privado/dashboard-docente/cursos/curso/curso.module').then(m => m.CursoPageModule)
      },
    ]
  },
  {
    path: 'tutoria',
    loadChildren: () => import('../servicios/tutoria/tutoria.module').then(m => m.TutoriaPageModule)
  },
  {
    path: 'reserva-espacios',
    loadChildren: () => import('src/app/pages/privado/shared/reserva-espacios/reserva-espacios.module').then(m => m.ReservaEspaciosPageModule)
  },
  {
    path: 'onedrive',
    loadChildren: () => import('src/app/pages/privado/shared/onedrive/onedrive.module').then(m => m.OnedrivePageModule)
  },
  {
    path: 'sede',
    loadChildren: () => import('src/app/pages/privado/dashboard-docente/perfil/sedes/sedes.module').then(m => m.SedesPageModule)
  },
  // {
  //   path: 'comunicaciones',
  //   loadChildren: () => import('./comunicaciones/comunicaciones.module').then(m => m.ComunicacionesPageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule { }
