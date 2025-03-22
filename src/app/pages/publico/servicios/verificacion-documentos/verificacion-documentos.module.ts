import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerificacionDocumentosPageRoutingModule } from './verificacion-documentos-routing.module';
import { VerificacionDocumentosPage } from './verificacion-documentos.page';
import { ModalInstruccionesPageModule } from './modal-instrucciones/modal-instrucciones.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VerificacionDocumentosPageRoutingModule,
    ModalInstruccionesPageModule
  ],
  declarations: [VerificacionDocumentosPage]
})
export class VerificacionDocumentosPageModule { }
