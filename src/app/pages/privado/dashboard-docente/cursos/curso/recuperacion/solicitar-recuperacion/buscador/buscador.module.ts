import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BuscadorPageRoutingModule } from './buscador-routing.module';
import { BuscadorPage } from './buscador.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BuscadorPageRoutingModule,
    PipesModule
  ],
  declarations: [BuscadorPage]
})
export class BuscadorPageModule { }
