import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReconocimientosPageRoutingModule } from './reconocimientos-routing.module';

import { ReconocimientosPage } from './reconocimientos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReconocimientosPageRoutingModule
  ],
  declarations: [ReconocimientosPage]
})
export class ReconocimientosPageModule {}
