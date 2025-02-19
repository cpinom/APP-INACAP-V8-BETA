import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InicioPageRoutingModule } from './inicio-routing.module';
import { InicioPage } from './inicio.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { MbscModule } from '@mobiscroll/angular';
import { AccesosDirectosPageModule } from './accesos-directos/accesos-directos.module';
import { BienvenidaPageModule } from '../../shared/datos-personales/bienvenida/bienvenida.module';
import { MaterialModule } from 'src/app/app-material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    ComponentsModule,
    DirectivesModule,
    MaterialModule,
    MbscModule,
    AccesosDirectosPageModule,
    BienvenidaPageModule
  ],
  declarations: [InicioPage]
})
export class InicioPageModule { }
