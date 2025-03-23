import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetalleCursoPageRoutingModule } from './detalle-curso-routing.module';
import { DetalleCursoPage } from './detalle-curso.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCursoPageRoutingModule,
    PipesModule
  ],
  declarations: [DetalleCursoPage]
})
export class DetalleCursoPageModule { }
