import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgenteSocraticoPageRoutingModule } from './agente-socratico-routing.module';
import { AgenteSocraticoPage } from './agente-socratico.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgenteSocraticoPageRoutingModule,
    PipesModule
  ],
  declarations: [AgenteSocraticoPage]
})
export class AgenteSocraticoPageModule { }
