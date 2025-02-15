import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { CachedImageComponent } from './cached-image/cached-image.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ImageModalComponent } from './image-modal/image-modal.component';

@NgModule({
  schemas: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    CachedImageComponent,
    AvatarComponent,
    ImageModalComponent
  ],
  exports: [
    HeaderComponent,
    CachedImageComponent,
    AvatarComponent,
    ImageModalComponent
  ]
})
export class ComponentsModule { }