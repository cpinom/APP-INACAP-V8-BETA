import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderErrorPage } from './folder-error.page';

const routes: Routes = [
  {
    path: '',
    component: FolderErrorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderErrorPageRoutingModule {}
