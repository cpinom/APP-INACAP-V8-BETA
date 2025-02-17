import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnedrivePage } from './onedrive.page';

const routes: Routes = [
  {
    path: '',
    component: OnedrivePage
  },
  {
    path: 'folder-content',
    loadChildren: () => import('./folder-content/folder-content.module').then( m => m.FolderContentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnedrivePageRoutingModule {}
