import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetallePagoPageRoutingModule } from './detalle-pago-routing.module';
import { DetallePagoPage } from './detalle-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallePagoPageRoutingModule
  ],
  declarations: [DetallePagoPage]
})
export class DetallePagoPageModule { }
