import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DelegadosPageRoutingModule } from './delegados-routing.module';
import { DelegadosPage } from './delegados.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DelegadosPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [DelegadosPage]
})
export class DelegadosPageModule { }
