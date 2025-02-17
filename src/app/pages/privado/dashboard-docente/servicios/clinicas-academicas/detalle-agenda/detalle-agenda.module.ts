import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleAgendaPageRoutingModule } from './detalle-agenda-routing.module';
import { DetalleAgendaPage } from './detalle-agenda.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAgendaPageRoutingModule,
    PipesModule
  ],
  declarations: [DetalleAgendaPage]
})
export class DetalleAgendaPageModule { }
