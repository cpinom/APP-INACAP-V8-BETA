import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EstudianteTutPageRoutingModule } from './estudiante-tut-routing.module';
import { EstudianteTutPage } from './estudiante-tut.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EstudianteTutPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [EstudianteTutPage]
})
export class EstudianteTutPageModule { }
