import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VotacionesPageRoutingModule } from './votaciones-routing.module';
import { VotacionesPage } from './votaciones.page';
import { DirectivesModule } from 'src/app/core/directives/directives.module';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotacionesPageRoutingModule,
    DirectivesModule
  ],
  declarations: [VotacionesPage]
})
export class VotacionesPageModule { }
