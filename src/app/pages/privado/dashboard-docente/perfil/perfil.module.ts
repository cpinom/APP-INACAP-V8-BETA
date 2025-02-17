import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PerfilPage } from './perfil.page';
import { CredencialVirtualPageModule } from './credencial-virtual/credencial-virtual.module';
import { DatosPersonalesPageModule } from './datos-personales/datos-personales.module';
import { FotoPerfilPageModule } from './foto-perfil/foto-perfil.module';
import { SedesPageModule } from './sedes/sedes.module';
import { PrincipalPageModule } from './principal/principal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPageModule,
    CredencialVirtualPageModule,
    DatosPersonalesPageModule,
    FotoPerfilPageModule,
    SedesPageModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule { }
