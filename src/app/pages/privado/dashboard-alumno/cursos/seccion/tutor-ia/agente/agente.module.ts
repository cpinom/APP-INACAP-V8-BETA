import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgentePageRoutingModule } from './agente-routing.module';
import { AgentePage } from './agente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgentePageRoutingModule
  ],
  declarations: [AgentePage]
})
export class AgentePageModule { }
