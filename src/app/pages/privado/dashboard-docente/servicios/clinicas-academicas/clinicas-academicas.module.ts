import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClinicasAcademicasPageRoutingModule } from './clinicas-academicas-routing.module';
import { ClinicasAcademicasPage } from './clinicas-academicas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClinicasAcademicasPageRoutingModule
  ],
  declarations: [ClinicasAcademicasPage]
})
export class ClinicasAcademicasPageModule { }
