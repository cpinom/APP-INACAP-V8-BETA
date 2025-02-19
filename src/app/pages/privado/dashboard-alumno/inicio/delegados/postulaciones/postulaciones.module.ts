import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostulacionesPageRoutingModule } from './postulaciones-routing.module';
import { PostulacionesPage } from './postulaciones.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostulacionesPageRoutingModule,
    DirectivesModule
  ],
  declarations: [PostulacionesPage]
})
export class PostulacionesPageModule { }
