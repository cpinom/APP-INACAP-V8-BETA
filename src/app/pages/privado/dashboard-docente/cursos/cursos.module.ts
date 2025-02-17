import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CursosPageRoutingModule } from './cursos-routing.module';
import { CursosPage } from './cursos.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    CursosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CursosPage]
})
export class CursosPageModule { }
