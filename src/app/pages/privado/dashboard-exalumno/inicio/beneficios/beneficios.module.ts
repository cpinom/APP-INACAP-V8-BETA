import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BeneficiosPageRoutingModule } from './beneficios-routing.module';
import { BeneficiosPage } from './beneficios.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeneficiosPageRoutingModule,
    DirectivesModule
  ],
  declarations: [BeneficiosPage]
})
export class BeneficiosPageModule { }
