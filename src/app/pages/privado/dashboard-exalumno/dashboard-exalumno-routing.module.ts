import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardExalumnoPage } from './dashboard-exalumno.page';
import { Rol } from 'src/app/core/interfaces/auth.interfaces';
import { accessGuard } from 'src/app/core/guards/access.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardExalumnoPage,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        canMatch: [accessGuard],
        data: { role: Rol.exalumno },
        loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'empleos',
        canMatch: [accessGuard],
        data: { role: Rol.exalumno },
        loadChildren: () => import('./empleos/empleos.module').then(m => m.EmpleosPageModule)
      },
      {
        path: 'equipo',
        canMatch: [accessGuard],
        data: { role: Rol.exalumno },
        loadChildren: () => import('./equipo/equipo.module').then(m => m.EquipoPageModule)
      },
      {
        path: 'perfil',
        canMatch: [accessGuard],
        data: { role: Rol.exalumno },
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardExalumnoPageRoutingModule { }
