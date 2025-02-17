import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SolicitudDocumentosPageRoutingModule } from './solicitud-documentos-routing.module';
import { SolicitudDocumentosPage } from './solicitud-documentos.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SolicitudDocumentosPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [SolicitudDocumentosPage]
})
export class SolicitudDocumentosPageModule { }
