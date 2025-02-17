import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EstudiantesPageRoutingModule } from './estudiantes-routing.module';
import { EstudiantesPage } from './estudiantes.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstudiantesPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [EstudiantesPage]
})
export class EstudiantesPageModule { }
