import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DocentesPageRoutingModule } from './docentes-routing.module';
import { DocentesPage } from './docentes.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DocentesPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [DocentesPage]
})
export class DocentesPageModule { }
