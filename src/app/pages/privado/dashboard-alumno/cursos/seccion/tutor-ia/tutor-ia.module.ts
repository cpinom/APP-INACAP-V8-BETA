import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TutorIaPageRoutingModule } from './tutor-ia-routing.module';
import { TutorIaPage } from './tutor-ia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorIaPageRoutingModule
  ],
  declarations: [TutorIaPage]
})
export class TutorIaPageModule { }
