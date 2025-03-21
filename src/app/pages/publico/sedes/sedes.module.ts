import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SedesPageRoutingModule } from './sedes-routing.module';
import { SedesPage } from './sedes.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SedesPageRoutingModule,
    ComponentsModule,
    DirectivesModule
  ],
  declarations: [SedesPage]
})
export class SedesPageModule { }
