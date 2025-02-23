import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BuzonOpinionPageRoutingModule } from './buzon-opinion-routing.module';
import { BuzonOpinionPage } from './buzon-opinion.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuzonOpinionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [BuzonOpinionPage]
})
export class BuzonOpinionPageModule { }
