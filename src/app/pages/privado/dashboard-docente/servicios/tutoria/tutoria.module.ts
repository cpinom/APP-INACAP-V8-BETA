import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TutoriaPageRoutingModule } from './tutoria-routing.module';
import { TutoriaPage } from './tutoria.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutoriaPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [TutoriaPage]
})
export class TutoriaPageModule { }
