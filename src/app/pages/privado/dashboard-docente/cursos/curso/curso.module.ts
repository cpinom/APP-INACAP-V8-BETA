import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CursoPageRoutingModule } from './curso-routing.module';
import { CursoPage } from './curso.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    CursoPageRoutingModule,
    DirectivesModule
  ],
  declarations: [CursoPage]
})
export class CursoPageModule { }
