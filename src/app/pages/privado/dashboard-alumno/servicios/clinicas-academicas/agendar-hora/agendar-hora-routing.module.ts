import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendarHoraPage } from './agendar-hora.page';

const routes: Routes = [
  {
    path: '',
    component: AgendarHoraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendarHoraPageRoutingModule { }
