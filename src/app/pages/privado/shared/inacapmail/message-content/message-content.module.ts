import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MessageContentPageRoutingModule } from './message-content-routing.module';
import { MessageContentPage } from './message-content.page';
import { PipesModule } from 'src/app/core/pipes/pipes.module';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { MaterialModule } from 'src/app/app.material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    MessageContentPageRoutingModule,
    DirectivesModule,
    MaterialModule
  ],
  declarations: [MessageContentPage]
})
export class MessageContentPageModule { }
