import { Component, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { DialogService } from '../../services/dialog.service';
import { AnimationController } from '@ionic/angular';
import { ImageModalComponent } from '../image-modal/image-modal.component';
import { CapacitorHttp } from '@capacitor/core';
import * as desconocido from 'src/scripts/foto.desconocido';

const CACHE_FOLDER = 'CACHED-IMG';

@Component({
  selector: 'app-cached-image',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})
export class CachedImageComponent implements OnInit {

  private dialog = inject(DialogService);
  private animationCtrl = inject(AnimationController);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  _src!: string;
  hasError = false;

  constructor() { }

  ngOnInit() { }

  @Input() spinner = false;
  @Input() hideViewer = false;
  @Input()
  set src(imageUrl: string) {
    const imageName = imageUrl.split('/').pop();

    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`
    }).then(readFile => {
      this._src = `data:image/png;base64,${readFile.data}`;
    }).catch(async e => {
      await this.storeImage(imageUrl, imageName!);

      Filesystem.readFile({
        directory: Directory.Cache,
        path: `${CACHE_FOLDER}/${imageName}`
      }).then(readFile => {
        this._src = `data:image/png;base64,${readFile.data}`;
      });
    })

  }
  async onClick(event?: Event) {
    event?.preventDefault();

    if (this.hasError || this.hideViewer) {
      return;
    }

    event?.stopPropagation();

    await this.dialog.showModal({
      component: ImageModalComponent,
      componentProps: {
        src: this._src
      },
      cssClass: 'transparent-modal',
      showBackdrop: true,
      keyboardClose: true,
      animated: false
      // enterAnimation: this.enterAnimation
    });

  }
  async storeImage(url: string, path: string) {
    const response = await CapacitorHttp.get({ url, responseType: 'blob' });
    let base64Data;

    if (response.status == 200) {
      base64Data = `data:image/png;base64,${response.data}`;
    }
    else {
      base64Data = desconocido.imgBase64;
      this.renderer.setAttribute(this.el.nativeElement, 'class', 'error');
      this.hasError = true;
    }

    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache
    });

    return savedFile;
  }
  // enterAnimation = (baseEl: HTMLElement) => {
  //   const root = baseEl.shadowRoot;

  //   const backdropAnimation = this.animationCtrl
  //     .create()
  //     .addElement(root?.querySelector('ion-backdrop')!)
  //     .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  //   const wrapperAnimation = this.animationCtrl
  //     .create()
  //     .addElement(root?.querySelector('.modal-wrapper')!)
  //     .keyframes([
  //       { offset: 0, opacity: '0', transform: 'scale(0)' },
  //       { offset: 1, opacity: '0.99', transform: 'scale(1)' },
  //     ]);

  //   return this.animationCtrl
  //     .create()
  //     .addElement(baseEl)
  //     .easing('ease-out')
  //     .duration(250)
  //     .addAnimation([backdropAnimation, wrapperAnimation]);
  // };

}
