import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InformacionAcademicaPageRoutingModule } from './informacion-academica-routing.module';
import { InformacionAcademicaPage } from './informacion-academica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionAcademicaPageRoutingModule
  ],
  declarations: [InformacionAcademicaPage]
})
export class InformacionAcademicaPageModule { }
