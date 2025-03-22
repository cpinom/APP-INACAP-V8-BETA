import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProgramasPageRoutingModule } from './programas-routing.module';
import { ProgramasPage } from './programas.page';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { EducacionSuperiorComponentModule } from './educacion-superior/educacion-superior.component.module';
import { EducacionContinuaComponentModule } from './educacion-continua/educacion-continua.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProgramasPageRoutingModule,
    ComponentsModule,
    EducacionSuperiorComponentModule,
    EducacionContinuaComponentModule
  ],
  declarations: [ProgramasPage]
})
export class ProgramasPageModule { }
