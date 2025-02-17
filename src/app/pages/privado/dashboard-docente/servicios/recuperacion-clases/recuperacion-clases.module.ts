import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecuperacionClasesPageRoutingModule } from './recuperacion-clases-routing.module';
import { RecuperacionClasesPage } from './recuperacion-clases.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperacionClasesPageRoutingModule
  ],
  declarations: [RecuperacionClasesPage]
})
export class RecuperacionClasesPageModule { }
