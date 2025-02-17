import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudPageRoutingModule } from './solicitud-simple-routing.module';
import { SolicitudPage } from './solicitud-simple.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitudPageRoutingModule,
    DirectivesModule
  ],
  declarations: [SolicitudPage]
})
export class SolicitudPageModule { }
