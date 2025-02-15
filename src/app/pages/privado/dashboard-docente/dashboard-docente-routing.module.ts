import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardDocentePage } from './dashboard-docente.page';
import { accessGuard } from 'src/app/core/guards/access.guard';
import { Rol } from 'src/app/core/interfaces/auth.interfaces';

const routes: Routes = [
  {
    path: '',
    component: DashboardDocentePage,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        canMatch: [accessGuard],
        data: { role: Rol.docente },
        loadChildren: () => import('./inicio/inicio.module').then(m => m.InicioPageModule)
      },
      {
        path: 'cursos',
        canMatch: [accessGuard],
        data: { role: Rol.docente },
        loadChildren: () => import('./cursos/cursos.module').then(m => m.CursosPageModule)
      },
      {
        path: 'horario',
        canMatch: [accessGuard],
        data: { role: Rol.docente },
        loadChildren: () => import('./horario/horario.module').then(m => m.HorarioPageModule)
      },
      {
        path: 'servicios',
        canMatch: [accessGuard],
        data: { role: Rol.docente },
        loadChildren: () => import('./servicios/servicios.module').then(m => m.ServiciosPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardDocentePageRoutingModule { }
