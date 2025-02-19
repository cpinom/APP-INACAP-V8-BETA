import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CredencialesDigitalesPageRoutingModule } from './credenciales-digitales-routing.module';
import { CredencialesDigitalesPage } from './credenciales-digitales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CredencialesDigitalesPageRoutingModule
  ],
  declarations: [CredencialesDigitalesPage]
})
export class CredencialesDigitalesPageModule { }
