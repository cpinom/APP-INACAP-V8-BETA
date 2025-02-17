import { Component, inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { AlertController, IonNav, LoadingController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { MediaService } from 'src/app/core/services/media.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-foto-perfil-docente',
  templateUrl: './foto-perfil.page.html',
  styleUrls: ['./foto-perfil.page.scss'],
})
export class FotoPerfilPage implements OnInit {

  file: any;
  fotoPerfil: any;
  permitirGuardar!: boolean;
  solicitudId!: number;

  private domSanitizer = inject(DomSanitizer);
  private loading = inject(LoadingController);
  private alert = inject(AlertController);
  private nav = inject(IonNav);
  private media = inject(MediaService);
  private api = inject(DocenteService);
  private events = inject(EventsService);
  private auth = inject(AuthService);
  private utils = inject(UtilsService);
  private pt = inject(Platform);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async ngOnInit() {
    if (this.file) {
      this.permitirGuardar = false;

      if (this.pt.is('mobileweb')) {
        this.fotoPerfil = await this.utils.createImageFromFile(this.file);
        this.validarFotoWeb();
      }
      else {
        this.fotoPerfil = await this.media.getBase64String(this.file.path);
        this.validarFoto();
      }
    }
  }
  async validarFotoWeb() {
    let formData = new FormData();
    let loading = await this.loading.create({ message: 'Analizando rostro...' });

    formData.append('file', this.file);

    await loading.present();

    try {
      let result = await this.api.validarFotoPerfilWeb(formData);

      if (result.success) {
        this.solicitudId = result.pdsoNcorr;
        this.permitirGuardar = true;
      }
      else {
        if (result.exception) {
          this.error.handle(result.message, () => { }, true);
        }
        else {
          await this.presentarAlert(result.message);
        }
      }
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async validarFoto() {
    let loading = await this.loading.create({ message: 'Analizando rostro...' });
    let file = this.file;

    await loading.present();

    try {
      const response: any = await this.api.validarFotoPerfil(file.path, file.name);
      const result = response.data;

      if (result.success) {
        this.solicitudId = result.pdsoNcorr;
        this.permitirGuardar = true;
      }
      else {
        if (result.exception) {
          this.error.handle(result.message, () => { }, true);
        }
        else {
          await this.presentarAlert(result.message);
        }
      }
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async guardar() {
    let loading = await this.loading.create({ message: 'Guardar Foto...' });
    let params = { pdsoNcorr: this.solicitudId };
    let result = null;

    await loading.present();

    try {
      result = await this.api.guardarFotoPerfil(params);
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }

    if (result && result.success) {
      await this.notificarAvatar();
      await this.presentarSuccess(result.message);
      await this.nav.pop();
    }
    else {
    }
  }
  async repetir() {
    let file = await this.media.getMedia(true);

    if (file != null) {
      this.file = file;
      this.fotoPerfil = await this.media.getBase64String(this.file.path);
      this.permitirGuardar = false;
      this.validarFoto();
    }
  }
  resolverFoto() {
    return this.domSanitizer.bypassSecurityTrustUrl(this.fotoPerfil);
  }
  async presentarAlert(message: string) {
    let alert = await this.alert.create({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Nueva Foto Perfil',
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async () => {
            await this.nav.pop();
          }
        },
        {
          text: 'Repetir',
          handler: async () => {
            await this.repetir();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentarSuccess(message: string) {
    let alert = await this.alert.create({
      keyboardClose: false,
      backdropDismiss: false,
      cssClass: 'success-alert',
      header: 'Nueva Foto Perfil',
      message: '<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>' + message,
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => { }
        }
      ]
    });

    await alert.present();
  }
  async notificarAvatar() {
    const auth = await this.auth.getAuth();
    const user = auth.user;

    try {
      await Filesystem.deleteFile({
        path: `CACHED-IMG/${user.data.persNcorr}`,
        directory: Directory.Cache
      })
    }
    catch { }

    this.events.app.next({ action: 'app:auth-notify-property', prop: 'perfilImagen' });
  }

}
