import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AsesorPedagogicoPageRoutingModule } from './asesor-pedagogico-routing.module';
import { AsesorPedagogicoPage } from './asesor-pedagogico.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsesorPedagogicoPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [AsesorPedagogicoPage]
})
export class AsesorPedagogicoPageModule { }
