import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResultadosPageRoutingModule } from './resultados-routing.module';
import { ResultadosPage } from './resultados.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadosPageRoutingModule,
    DirectivesModule,
    ComponentsModule,
    MbscModule
  ],
  declarations: [ResultadosPage]
})
export class ResultadosPageModule { }
