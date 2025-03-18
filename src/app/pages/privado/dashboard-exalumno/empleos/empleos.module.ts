import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmpleosPageRoutingModule } from './empleos-routing.module';
import { EmpleosPage } from './empleos.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpleosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmpleosPage]
})
export class EmpleosPageModule { }
