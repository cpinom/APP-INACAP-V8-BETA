import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RiesgosAcademicosPageRoutingModule } from './riesgos-academicos-routing.module';
import { RiesgosAcademicosPage } from './riesgos-academicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiesgosAcademicosPageRoutingModule
  ],
  declarations: [RiesgosAcademicosPage]
})
export class RiesgosAcademicosPageModule { }
