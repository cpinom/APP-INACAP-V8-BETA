import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioPageRoutingModule } from './inicio-routing.module';
import { InicioPage } from './inicio.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { MbscModule } from '@mobiscroll/angular';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { MaterialModule } from 'src/app/app-material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    InicioPageRoutingModule,
    ComponentsModule,
    MaterialModule,
    DirectivesModule,
    MbscModule
  ],
  declarations: [InicioPage]
})
export class InicioPageModule { }
