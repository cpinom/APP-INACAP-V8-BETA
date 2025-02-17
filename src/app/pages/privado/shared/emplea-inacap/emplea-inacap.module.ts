import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmpleaInacapPageRoutingModule } from './emplea-inacap-routing.module';
import { EmpleaInacapPage } from './emplea-inacap.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
    EmpleaInacapPageRoutingModule
  ],
  declarations: [EmpleaInacapPage]
})
export class EmpleaInacapPageModule {}
