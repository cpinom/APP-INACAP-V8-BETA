import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatosContactoPageRoutingModule } from './datos-contacto-routing.module';
import { DatosContactoPage } from './datos-contacto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosContactoPageRoutingModule
  ],
  declarations: [DatosContactoPage]
})
export class DatosContactoPageModule {}
