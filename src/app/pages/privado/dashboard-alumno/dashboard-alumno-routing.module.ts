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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardAlumnoPageRoutingModule { }
