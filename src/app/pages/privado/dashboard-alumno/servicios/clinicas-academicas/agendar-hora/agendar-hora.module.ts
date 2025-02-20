import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendarHoraPageRoutingModule } from './agendar-hora-routing.module';
import { AgendarHoraPage } from './agendar-hora.page';
import { MaterialModule } from 'src/app/app-material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AgendarHoraPageRoutingModule,
    MaterialModule
  ],
  declarations: [AgendarHoraPage]
})
export class AgendarHoraPageModule { }
