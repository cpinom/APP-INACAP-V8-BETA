import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CuentaCorrientePageRoutingModule } from './cuenta-corriente-routing.module';
import { CuentaCorrientePage } from './cuenta-corriente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentaCorrientePageRoutingModule
  ],
  declarations: [CuentaCorrientePage]
})
export class CuentaCorrientePageModule { }
