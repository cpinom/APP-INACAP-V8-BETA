import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgresionPageRoutingModule } from './progresion-routing.module';
import { ProgresionPage } from './progresion.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgresionPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [ProgresionPage]
})
export class ProgresionPageModule { }
