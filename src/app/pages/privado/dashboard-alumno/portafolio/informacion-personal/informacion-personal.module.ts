import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InformacionPersonalPageRoutingModule } from './informacion-personal-routing.module';
import { InformacionPersonalPage } from './informacion-personal.page';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPersonalPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InformacionPersonalPage]
})
export class InformacionPersonalPageModule { }
