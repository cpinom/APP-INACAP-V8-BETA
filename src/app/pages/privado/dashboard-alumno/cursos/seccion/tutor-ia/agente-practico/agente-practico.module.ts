import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgentePracticoPageRoutingModule } from './agente-practico-routing.module';
import { AgentePracticoPage } from './agente-practico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentePracticoPageRoutingModule
  ],
  declarations: [AgentePracticoPage]
})
export class AgentePracticoPageModule { }
