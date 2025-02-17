import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CertificadosPageRoutingModule } from './certificados-routing.module';
import { CertificadosPage } from './certificados.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    CertificadosPageRoutingModule
  ],
  declarations: [CertificadosPage]
})
export class CertificadosPageModule { }
