import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EquipoPageRoutingModule } from './equipo-routing.module';
import { EquipoPage } from './equipo.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipoPageRoutingModule,
    DirectivesModule
  ],
  declarations: [EquipoPage]
})
export class EquipoPageModule { }
