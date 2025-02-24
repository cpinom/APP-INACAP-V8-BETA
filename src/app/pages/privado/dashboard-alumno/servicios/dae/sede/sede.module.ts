import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SedePageRoutingModule } from './sede-routing.module';
import { SedePage } from './sede.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SedePageRoutingModule,
    ComponentsModule
  ],
  declarations: [SedePage]
})
export class SedePageModule { }
