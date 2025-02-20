import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';
import { FormasPagoComponent } from './formas-pago/formas-pago.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormasPagoComponent,
    DetallePagoComponent
  ],
  exports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FormasPagoComponent,
    DetallePagoComponent
  ]
})

export class PagosModule { }