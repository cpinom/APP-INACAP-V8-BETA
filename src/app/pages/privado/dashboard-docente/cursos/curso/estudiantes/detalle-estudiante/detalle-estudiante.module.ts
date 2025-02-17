import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleEstudiantePageRoutingModule } from './detalle-estudiante-routing.module';
import { DetalleEstudiantePage } from './detalle-estudiante.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DetalleEstudiantePageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [DetalleEstudiantePage]
})
export class DetalleEstudiantePageModule { }
