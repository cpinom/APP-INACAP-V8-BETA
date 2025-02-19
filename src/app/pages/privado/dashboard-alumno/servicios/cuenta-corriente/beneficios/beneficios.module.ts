import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BeneficiosPageRoutingModule } from './beneficios-routing.module';
import { BeneficiosPage } from './beneficios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BeneficiosPageRoutingModule
  ],
  declarations: [BeneficiosPage]
})
export class BeneficiosPageModule { }
