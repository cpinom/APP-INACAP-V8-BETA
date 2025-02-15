import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrivadoPageRoutingModule } from './privado-routing.module';
import { PrivadoPage } from './privado.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivadoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PrivadoPage]
})
export class PrivadoPageModule { }
