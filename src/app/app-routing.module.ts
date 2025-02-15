import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { homeGuard } from './core/guards/home.guard';
import { accessGuard } from './core/guards/access.guard';
import { Rol } from './core/interfaces/auth.interfaces';
import { publicGuard } from './core/guards/public.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'publico',
    pathMatch: 'full'
  },
  {
    path: 'publico',
    canMatch: [homeGuard],
    loadChildren: () => import('./pages/publico/publico.module').then(m => m.PublicoPageModule)
  },
  {
    path: 'privado',
    canMatch: [authGuard],
    loadChildren: () => import('./pages/privado/privado.module').then(m => m.PrivadoPageModule)
  },
  {
    path: 'dashboard-alumno',
    canMatch: [accessGuard],
    data: { role: Rol.alumno },
    loadChildren: () => import('./pages/privado/dashboard-alumno/dashboard-alumno.module').then(m => m.DashboardAlumnoPageModule)
  },
  {
    path: 'dashboard-docente',
    canMatch: [accessGuard],
    data: { role: Rol.docente },
    loadChildren: () => import('./pages/privado/dashboard-docente/dashboard-docente.module').then(m => m.DashboardDocentePageModule)
  },
  {
    path: 'dashboard-exalumno',
    canMatch: [accessGuard],
    data: { role: Rol.exalumno },
    loadChildren: () => import('./pages/privado/dashboard-exalumno/dashboard-exalumno.module').then(m => m.DashboardExalumnoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
