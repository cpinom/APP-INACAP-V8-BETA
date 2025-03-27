import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Camera } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, NavController, Platform } from '@ionic/angular';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { MediaService } from 'src/app/core/services/media.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

declare var faceapi: any;

enum Pasos {
  inicial = 0,
  capturarFotoPerfil = 1,
  capturarFotoCedula = 2
};

@Component({
  selector: 'app-foto-perfil',
  templateUrl: './foto-perfil.page.html',
  styleUrls: ['./foto-perfil.page.scss'],
})
export class FotoPerfilPage implements OnInit {

  private pt = inject(Platform);
  private media = inject(MediaService);
  private dialog = inject(DialogService);
  private api = inject(AlumnoService);
  private snackbar = inject(SnackbarService);
  private global = inject(AppGlobal);
  private utils = inject(UtilsService);
  private error = inject(ErrorHandlerService);
  private action = inject(ActionSheetController);
  private domSanitizer = inject(DomSanitizer);
  private events = inject(EventsService);
  private auth = inject(AuthService);
  private nav = inject(NavController);

  @ViewChild('perfilInput') perfilInput!: ElementRef;
  pasoActual = Pasos.inicial;
  fotoPerfil!: string;
  fotoCelula!: string;
  fotoCelulaRostro!: string;
  solicitudId!: number;
  token!: string;
  modelsLoaded = false;
  mostrarCargando = true;
  mostrarData = false;

  constructor() { }

  async ngOnInit() {

    if (this.pt.is('capacitor')) {
      const loading = await this.dialog.showLoading({ message: 'Verificando...' });
      let permiteContinuar = false;
      let permission = await Camera.checkPermissions();

      if (permission.camera == 'denied' || permission.camera == 'prompt') {
        permission = await Camera.requestPermissions({ permissions: ['camera'] });
      }

      if (permission.camera == 'granted') {
        permiteContinuar = true;
      }

      if (!permiteContinuar) {
        await loading.dismiss();
        await this.showAlertApp('INACAP', 'la cámara');
        return;
      }

      permiteContinuar = false;

      if (permission.photos == 'denied' || permission.photos == 'prompt') {
        permission = await Camera.requestPermissions({ permissions: ['photos'] });
      }

      if (permission.photos == 'granted') {
        permiteContinuar = true;
      }

      if (!permiteContinuar) {
        await loading.dismiss();
        await this.showAlertApp('INACAP', 'la galería');
        return;
      }

      await loading.dismiss();
    }


    await this.cargar();
  }
  async cargar() {
    try {
      const request = await this.api.crearSolicitudFoto();

      if (request.success) {
        this.solicitudId = request.solicitudId;
        this.token = request.token;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async adjuntarPerfil(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileSize = file.size / 1024 / 1024;

      if (fileSize >= 150) {
        await this.presentAlert('Los documentos no pueden exceder los 150 MB.');
        return;
      }

      try {
        const base64 = await this.utils.fileToBase64(file);
        await this.uploadBase64Fragmented(base64, file.name, 'fotoperfil');
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }

        await this.presentAlert(error.message || 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      }
      finally {
        this.perfilInput.nativeElement.value = '';
      }
    }
  }
  async adjuntarCedula(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileSize = file.size / 1024 / 1024;

      if (fileSize >= 150) {
        await this.presentAlert('Los documentos no pueden exceder los 150 MB.');
        return;
      }

      try {
        const base64 = await this.utils.fileToBase64(file);
        await this.uploadBase64Fragmented(base64, file.name, 'fotocedula');
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }

        await this.presentAlert(error.message || 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      }
      finally {
        this.perfilInput.nativeElement.value = '';
      }
    }
  }
  async uploadBase64Fragmented(base64String: string, fileName: string, method: string | 'fotoperfil' | 'fotocedula'): Promise<void> {
    const fragments = this.utils.divideBase64(base64String);
    const totalParts = fragments.length;
    const loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });

    try {
      for (let i = 0; i < fragments.length; i++) {
        const base64Fragment = fragments[i];
        const partNumber = i + 1;
        const params = {
          file: base64Fragment,
          fileName: encodeURIComponent(fileName),
          partNumber: partNumber,
          totalParts: totalParts
        };

        if (totalParts > 1 && partNumber == totalParts) {
          loading.message = '(100%) finalizando....';
        }

        let result;
        if (method === 'fotoperfil') {
          result = await this.api.cargarFotoPerfil(this.solicitudId, params);
        }
        else if (method === 'fotocedula') {
          result = await this.api.cargarFotoCedula(this.solicitudId, params);
        }

        if (result.success) {
          if (result.code == 202) {
            const progreso = Math.round(result.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (result.code == 200) {
            if (method === 'fotoperfil') {
              await loading.dismiss();
              this.fotoPerfil = 'data:image/jpeg;base64,' + result.data;
            }
            else if (method === 'fotocedula') {
              this.fotoCelula = 'data:image/jpeg;base64,' + result.data;
              this.fotoCelulaRostro = 'data:image/jpeg;base64,' + result.face;
              this.pasoActual = Pasos.capturarFotoCedula;

              if (!this.modelsLoaded) {
                loading.message = 'Cargando modelos...';
                this.modelsLoaded = await this.loadModels();
              }

              if (this.modelsLoaded) {
                loading.message = 'Comparando rostros...';
                await this.compararRostros(this.fotoPerfil, this.fotoCelula);
              }
              else {
                await this.presentAlert('Ha ocurrido un error mientras procesamos tu solicitud. Vuelve a intentarlo', () => {
                  this.fotoPerfil = '';
                  this.fotoCelula = '';
                  this.fotoCelulaRostro = '';
                  this.pasoActual = Pasos.inicial;
                });
              }
            }
          }
        }
        else {
          throw Error(result.message);
        }

      }
    }
    catch (error: any) {
      return Promise.reject(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async anteriorPaso(index: number) {
    this.pasoActual = index;
  }
  async siguientePaso(index: number, inputEl?: any) {
    if (index == Pasos.capturarFotoPerfil) {
      if (!this.fotoPerfil) {

        if (this.pt.is('mobileweb')) {
          inputEl.click();
        }
        else {
          const media = await this.media.getMedia();

          if (media) {
            const fileSize = media.size / 1024 / 1024;
            const base64String = media.data;

            if (fileSize >= 150) {
              await this.presentAlert('La imagen no pueden exceder los 150 MB.');
              return;
            }

            try {
              await this.uploadBase64Fragmented(base64String, media.name, 'fotoperfil');
            }
            catch (error: any) {
              if (error && error.status == 401) {
                await this.error.handle(error);
                return
              }

              await this.presentAlert(error.message || 'No se pudo procesar el archivo. Vuelve a intentarlo.');
            }
          }
        }
      }
      else {
        this.pasoActual = index;
      }
    }
    else if (index == Pasos.capturarFotoCedula) {

      // if (this.pt.is('mobileweb')) {
      inputEl.click();
      // }
      // else {
      //   const media = await this.media.getMedia(true);

      //   if (media) {
      //     const fileSize = media.size / 1024 / 1024;
      //     const base64String = media.data;

      //     if (fileSize >= 150) {
      //       await this.presentAlert('La imagen no pueden exceder los 150 MB.');
      //       return;
      //     }

      //     try {
      //       await this.uploadBase64Fragmented(base64String, media.name, 'fotocedula');
      //     }
      //     catch (error: any) {
      //       if (error && error.status == 401) {
      //         await this.error.handle(error);
      //         return
      //       }

      //       await this.presentAlert(error.message || 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      //     }
      //   }
      // }
    }

  }
  async procesarFotoPerfil() {
    const loading = await this.dialog.showLoading({ message: 'Actualizando Foto...' });
    const base64 = this.fotoPerfil.replace(/^data:(.*,)?/, '');
    const params = { fotoPerfil: base64, token: this.token };

    try {
      const response = await this.api.actualizarFotoPerfil(params);

      if (response.success) {
        await this.notificarAvatar();
        this.snackbar.showToast('Tu nueva foto de perfil ha sido cargada correctamente.', 3000, 'success');
        this.nav.pop();
      }
      else {
        await this.presentAlert('Ha ocurrido un error inesperado procesando tu solicitud. Vuelve a intentar.', () => {
          this.fotoPerfil = '';
          this.fotoCelula = '';
          this.fotoCelulaRostro = '';
          this.pasoActual = Pasos.inicial;
        })
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  protected async procesarSolicitud() {
    const loading = await this.dialog.showLoading({ message: 'Procesando...' });
    const params = {
      solicitudId: this.solicitudId,
      fotoPerfil: this.fotoPerfil.replace(/^data:(.*,)?/, ''),
      fotoCedula: this.fotoCelula.replace(/^data:(.*,)?/, ''),
      token: this.token
    };

    try {
      const result = await this.api.guardarSolicitudFoto(params);

      if (result.success) {
        this.events.app.next({ action: 'app:foto-perfil-enviada' });
        this.snackbar.showToast('La solicitud ha sido enviada correctamente para ser revisada por el DAE de su sede.', 3000, 'success');
        this.nav.pop();
      }
      else {
        this.snackbar.showToast(result.message);
      }
    }
    catch (error) {
      console.log(error);
      this.snackbar.showToast('Ha ocurrido un error mientras se procesaba su fotografía.', 3000, 'danger');
    }
    finally {
      await loading.dismiss();
      this.api.marcarVista(VISTAS_ALUMNO.ENVIA_FOTO_PERFIL);
    }
  }
  async enviarSolicitud() {
    const confirm = await this.confirmarSolicitud();

    if (confirm) {
      await this.procesarSolicitud();
    }
    else {
      this.fotoPerfil = '';
      this.fotoCelula = '';
      this.fotoCelulaRostro = '';
      this.pasoActual = Pasos.inicial;
    }
  }
  async confirmarSolicitud(): Promise<boolean> {
    return new Promise((resolve) => {
      this.action.create({
        header: '¿Esta seguro de enviar la fotografía para ser validada?',
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => {
              resolve(true);
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          }
        ]
      }).then(alert => alert.present());
    });
  }
  async presentSuccess() {
    await this.dialog.showAlert({
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'success-foto-perfil',
      message: `<div class="foto-contenedor">
                  <img class="foto-cedula" src="${this.fotoCelulaRostro}" />
                  <img class="foto-perfil" src="${this.fotoPerfil}" />
                  <img class="icon" src="./assets/images/icon_check_circle_fill.svg" />
                </div>`,
      header: '¡Foto validada!',
      subHeader: 'Hemos validado con éxito tu foto de perfil.',
      buttons: [
        {
          text: 'Usar como foto de perfil',
          handler: () => {
            this.procesarFotoPerfil();
          },
          role: 'destructive'
        },
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            this.fotoPerfil = '';
            this.fotoCelula = '';
            this.fotoCelulaRostro = '';
            this.pasoActual = Pasos.inicial;
          }
        }
      ]
    });
  }
  async presentError() {
    const alert = await this.dialog.showAlert({
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'fail-foto-perfil',
      message: `<img src = "./assets/images/warning.svg" /><br />
                No hemos podido establecer la semejanza entre ambas imágenes. Puedes intentarlo nuevamente con otra imagen o mandar la solicitud para ser evaluada por tu DAE.`,
      header: 'Foto Perfil',
      buttons: [
        {
          text: 'Volver a Intentar',
          role: 'destructive',
          handler: () => {
            this.fotoPerfil = '';
            this.fotoCelula = '';
            this.fotoCelulaRostro = '';
            this.pasoActual = Pasos.inicial;
          }
        },
        {
          text: 'Enviar solicitud al DAE',
          role: 'cancel',
          handler: () => {
            this.enviarSolicitud();
          }
        }
      ]
    });

    return alert;
  }
  async presentAlert(message: string, callback?: Function) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-foto-perfil',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: 'Foto Perfil',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            callback && callback();
          }
        }
      ]
    });

    return alert;
  }
  resolverFoto(tipo: number): SafeUrl {
    if (tipo == 1 && this.fotoPerfil)
      return this.domSanitizer.bypassSecurityTrustUrl(this.fotoPerfil);
    if (tipo == 2 && this.fotoCelula)
      return this.domSanitizer.bypassSecurityTrustUrl(this.fotoCelula);
    return '';
  }
  async notificarAvatar() {
    debugger
    const auth = await this.auth.getAuth();
    const { user } = auth;

    try {
      await Filesystem.deleteFile({
        path: `CACHED-IMG/${user.data.persNcorr}`,
        directory: Directory.Cache
      })
    }
    catch { }

    this.events.app.next({ action: 'app:auth-notify-property', prop: 'perfilImagen' });
  }
  async compararRostros(base64Image1: string, base64Image2: string) {
    const image1 = await this.base64ToImage(base64Image1);
    const image2 = await this.base64ToImage(base64Image2);

    // Obtener los descriptores faciales
    const descriptor1 = await this.getFaceDescriptor(image1);
    const descriptor2 = await this.getFaceDescriptor(image2);

    if (descriptor1 && descriptor2) {
      // Comparar los descriptores
      const distance = this.compareDescriptors(descriptor1, descriptor2);
      // Determinar si los rostros son similares
      const similarityThreshold = 0.6;  // Generalmente se usa 0.6 como umbral de similitud

      if (distance < similarityThreshold) {
        await this.presentSuccess();
      }
      else {
        await this.presentError();
      }

      console.log(`Distancia entre rostros: ${distance}`);
    }
    else {
      await this.presentError();
    }
  }
  async getFaceDescriptor(image: HTMLImageElement) {
    try {
      const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        return null;
      }
      return detection.descriptor;
    }
    catch (error) { }
  }
  compareDescriptors(descriptor1: any, descriptor2: any) {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    return distance;
  }
  async showAlertApp(header: string = 'INACAP', option: string) {
    const alert = await this.dialog.showAlert({
      header: header,
      message: `Permitir que INACAP acceda a ${option} del dispositivo.`,
      buttons: [
        {
          text: '"Abrir" Configuración',
          role: 'destructive',
          handler: async () => {
            if (this.pt.is('ios')) {
              await NativeSettings.openIOS({
                option: IOSSettings.App,
              });
            }
            else {
              await NativeSettings.openAndroid({
                option: AndroidSettings.Application
              });
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: async () => {
            await this.nav.navigateBack('/dashboard-alumno/perfil');
          }
        }
      ]
    });

    return alert;
  }
  private async loadModels(): Promise<boolean> {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(this.urlModels);
      await faceapi.nets.tinyFaceDetector.loadFromUri(this.urlModels);
      await faceapi.nets.faceLandmark68Net.loadFromUri(this.urlModels);
      await faceapi.nets.faceRecognitionNet.loadFromUri(this.urlModels);
      // await faceapi.nets.faceExpressionNet.loadFromUri(urlModels);
      return true;
    }
    catch {
      return false;
    }
  }
  base64ToImage(base64: string) {
    return new Promise<HTMLImageElement>(resolve => {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.src = base64;
    });
  }
  get urlModels() {
    if (this.pt.is('mobileweb')) {
      return `https://siga.desa.inacap.cl/inacap.api.movil/content/models`;
    }

    return `${this.global.Api}/content/models`;
  }

}
