import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudPracticaPageRoutingModule } from './solicitud-practica-routing.module';
import { SolicitudPracticaPage } from './solicitud-practica.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitudPracticaPageRoutingModule,
    DirectivesModule,
    CodeInputModule
  ],
  declarations: [SolicitudPracticaPage]
})
export class SolicitudPracticaPageModule { }
