import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CertificadosIntermediosPageRoutingModule } from './certificados-intermedios-routing.module';

import { CertificadosIntermediosPage } from './certificados-intermedios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CertificadosIntermediosPageRoutingModule
  ],
  declarations: [CertificadosIntermediosPage]
})
export class CertificadosIntermediosPageModule {}
