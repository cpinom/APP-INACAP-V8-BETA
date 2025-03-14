import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirectorCarreraPageRoutingModule } from './director-carrera-routing.module';
import { DirectorCarreraPage } from './director-carrera.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectorCarreraPageRoutingModule,
    DirectivesModule,
    ComponentsModule
  ],
  declarations: [DirectorCarreraPage]
})
export class DirectorCarreraPageModule { }
