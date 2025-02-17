import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirAcademicoPageRoutingModule } from './dir-academico-routing.module';
import { DirAcademicoPage } from './dir-academico.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    DirectivesModule,
    DirAcademicoPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DirAcademicoPage]
})
export class DirAcademicoPageModule { }
