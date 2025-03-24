import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgentePracticoPageRoutingModule } from './agente-practico-routing.module';
import { AgentePracticoPage } from './agente-practico.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentePracticoPageRoutingModule,
    PipesModule
  ],
  declarations: [AgentePracticoPage]
})
export class AgentePracticoPageModule { }
