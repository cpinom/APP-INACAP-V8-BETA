import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirCarreraPageRoutingModule } from './dir-carrera-routing.module';
import { DirCarreraPage } from './dir-carrera.page';
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
    DirCarreraPageRoutingModule,
    ComponentsModule
  ],
  declarations: [DirCarreraPage]
})
export class DirCarreraPageModule { }
