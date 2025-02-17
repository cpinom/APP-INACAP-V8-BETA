import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderErrorPageRoutingModule } from './folder-error-routing.module';

import { FolderErrorPage } from './folder-error.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderErrorPageRoutingModule
  ],
  declarations: [FolderErrorPage]
})
export class FolderErrorPageModule {}
