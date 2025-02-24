import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartaPresentacionPageRoutingModule } from './carta-presentacion-routing.module';

import { CartaPresentacionPage } from './carta-presentacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartaPresentacionPageRoutingModule
  ],
  declarations: [CartaPresentacionPage]
})
export class CartaPresentacionPageModule {}
