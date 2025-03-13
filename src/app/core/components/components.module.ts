import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CachedImageComponent } from './cached-image/cached-image.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { HorarioComponent } from './horario/horario.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { BuzonOpinionComponent } from './buzon-opinion/buzon-opinion.component';
import { SedeComponent } from './sede/sede.component';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule } from '../pipes/pipes.module';
import { DetalleOpinionComponent } from './buzon-opinion/detalle-opinion/detalle-opinion.component';
import { NuevaOpinionComponent } from './buzon-opinion/nueva-opinion/nueva-opinion.component';
import { MbscModule } from '@mobiscroll/angular';
import { MensajeModule } from './mensaje/mensaje.module';
import { PeriodosComponent } from './periodos/periodos.component';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal/barcode-scanning-modal.component';
import { ConsultaBipComponent } from './consulta-bip/consulta-bip.component';
import { BibliotecaComponent } from './sede/biblioteca/biblioteca.component';
import { CafeteriaComponent } from './sede/cafeteria/cafeteria.component';

@NgModule({
  schemas: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PipesModule,
    MbscModule,
    MensajeModule
  ],
  declarations: [
    HeaderComponent,
    CachedImageComponent,
    AvatarComponent,
    ImageModalComponent,
    HorarioComponent,
    TypeaheadComponent,
    BuzonOpinionComponent,
    DetalleOpinionComponent,
    NuevaOpinionComponent,
    SedeComponent,
    BibliotecaComponent,
    CafeteriaComponent,
    PeriodosComponent,
    BarcodeScanningModalComponent,
    ConsultaBipComponent
  ],
  exports: [
    HeaderComponent,
    CachedImageComponent,
    AvatarComponent,
    ImageModalComponent,
    HorarioComponent,
    TypeaheadComponent,
    BuzonOpinionComponent,
    DetalleOpinionComponent,
    NuevaOpinionComponent,
    SedeComponent,
    BibliotecaComponent,
    CafeteriaComponent,
    PeriodosComponent,
    BarcodeScanningModalComponent,
    ConsultaBipComponent
  ]
})
export class ComponentsModule { }