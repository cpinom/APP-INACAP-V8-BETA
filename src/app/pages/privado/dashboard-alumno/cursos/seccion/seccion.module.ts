import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SeccionPageRoutingModule } from './seccion-routing.module';
import { SeccionPage } from './seccion.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeccionPageRoutingModule,
    DirectivesModule,
    ComponentsModule,
    MbscModule
  ],
  declarations: [SeccionPage]
})
export class SeccionPageModule { }
