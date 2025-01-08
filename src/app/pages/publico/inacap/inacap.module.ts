import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InacapPageRoutingModule } from './inacap-routing.module';
import { InacapPage } from './inacap.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InacapPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InacapPage]
})
export class InacapPageModule { }
