import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardAlumnoPage } from './dashboard-alumno.page';
import { accessGuard } from 'src/app/core/guards/access.guard';
import { Rol } from 'src/app/core/interfaces/auth.interfaces';

const routes: Routes = [
  {
    path: '',
    component: DashboardAlumnoPage,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        canMatch: [accessGuard],
        data: { role: Rol.alumno },
        loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'cursos',
        canMatch: [accessGuard],
        data: { role: Rol.alumno },
        loadChildren: () => import('./cursos/cursos.module').then(m => m.CursosPageModule)
      },
      {
        path: 'portafolio',
        canMatch: [accessGuard],
        data: { role: Rol.alumno },
        loadChildren: () => import('./portafolio/portafolio.module').then(m => m.PortafolioPageModule)
      },
      {
        path: 'servicios',
        canMatch: [accessGuard],
        data: { role: Rol.alumno },
        loadChildren: () => import('./servicios/servicios.module').then(m => m.ServiciosPageModule)
      },
      {
        path: 'perfil',
        canMatch: [accessGuard],
        data: { role: Rol.alumno },
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardAlumnoPageRoutingModule { }
