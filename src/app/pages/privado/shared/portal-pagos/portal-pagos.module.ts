import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PortalPagosPageRoutingModule } from './portal-pagos-routing.module';
import { PortalPagosPage } from './portal-pagos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PortalPagosPageRoutingModule
  ],
  declarations: [PortalPagosPage]
})
export class PortalPagosPageModule { }
