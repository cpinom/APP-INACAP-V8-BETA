import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditarTelefonoPageRoutingModule } from './editar-telefono-routing.module';
import { EditarTelefonoPage } from './editar-telefono.page';
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditarTelefonoPageRoutingModule,
    CodeInputModule
  ],
  declarations: [EditarTelefonoPage]
})
export class EditarTelefonoPageModule {}
