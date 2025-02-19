import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgresionPageRoutingModule } from './progresion-routing.module';
import { ProgresionPage } from './progresion.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgresionPageRoutingModule,
    PipesModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [ProgresionPage]
})
export class ProgresionPageModule { }
