import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PerfilPageRoutingModule } from './perfil-routing.module';
import { PerfilPage } from './perfil.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { CredencialVirtualPageModule } from './credencial-virtual/credencial-virtual.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    ComponentsModule,
    CredencialVirtualPageModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule { }
