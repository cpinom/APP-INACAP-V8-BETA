import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BuscadorDocentePageRoutingModule } from './buscador-docente-routing.module';
import { BuscadorDocentePage } from './buscador-docente.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BuscadorDocentePageRoutingModule,
    ComponentsModule
  ],
  declarations: [BuscadorDocentePage]
})
export class BuscadorDocentePageModule { }
