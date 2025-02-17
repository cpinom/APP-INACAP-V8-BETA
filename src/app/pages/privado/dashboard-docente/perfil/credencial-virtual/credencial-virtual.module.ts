import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CredencialVirtualPageRoutingModule } from './credencial-virtual-routing.module';
import { CredencialVirtualPage } from './credencial-virtual.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { PipesModule } from 'src/app/core/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CredencialVirtualPageRoutingModule,
    ComponentsModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [CredencialVirtualPage]
})
export class CredencialVirtualPageModule { }
