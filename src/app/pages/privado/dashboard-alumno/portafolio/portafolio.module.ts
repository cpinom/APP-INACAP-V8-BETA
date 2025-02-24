import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PortafolioPageRoutingModule } from './portafolio-routing.module';
import { PortafolioPage } from './portafolio.page';
import { ComponentsModule } from "../../../../core/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PortafolioPageRoutingModule,
    ComponentsModule
],
  declarations: [PortafolioPage]
})
export class PortafolioPageModule { }
