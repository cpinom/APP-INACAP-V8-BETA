import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Platform } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { AlumnoService } from '../../services/http/alumno.service';
import { AppGlobal } from 'src/app/app.global';
import { MediaService } from '../../services/media.service';
import { Camera } from '@capacitor/camera';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { Geolocation } from '@capacitor/geolocation';

declare var faceapi: any;

enum Pasos {
  inicial = 0,
  cedula = 1,
  captura = 2,
  final = 3
};

@Component({
  selector: 'app-auto-asistencia-modal',
  templateUrl: './auto-asistencia-modal.component.html',
  styleUrls: ['./auto-asistencia-modal.component.scss'],
})
export class AutoAsistenciaModalComponent implements OnInit, AfterViewInit {

  private dialog = inject(DialogService);
  private changeDetector = inject(ChangeDetectorRef);
  private pt = inject(Platform);
  private utils = inject(UtilsService);
  private api = inject(AlumnoService);
  private global = inject(AppGlobal);
  private media = inject(MediaService);

  @ViewChild('video1', { static: false }) video1Ref!: ElementRef;
  @ViewChild('overlay1', { static: false }) overlay1Ref!: ElementRef;
  @ViewChild('perfilInput') perfilInput!: ElementRef;
  data: any;
  pasos: Pasos = Pasos.inicial;
  fotoCelula: string = '';
  fotoCelulaRostro: string = '';
  resultFacedetection: any;
  modelsLoaded = false;
  modelsError = false;
  contadorExisto = 0;
  contadorFracaso = 0;
  rostroValido = false;
  asistenciaCC: any;

  constructor() { }
  async ngAfterViewInit() { }
  async ngOnInit() {
    console.log(this.data);
    const loading = await this.dialog.showLoading({ message: 'Cargando Modelos...' });

    if (this.pt.is('capacitor')) {
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

      permiteContinuar = false;

      let permissionLocation = await Geolocation.checkPermissions();

      if (permissionLocation.location == 'denied' || permissionLocation.location == 'prompt') {
        permissionLocation = await Geolocation.requestPermissions();
      }

      if (permissionLocation.location == 'granted') {
        permiteContinuar = true;
      }

      if (!permiteContinuar) {
        await loading.dismiss();
        await this.showAlertApp('INACAP', 'la ubicación');
        return;
      }

    }

    try {
      this.modelsLoaded = await this.loadModels();
    }
    catch (error: any) {
      this.modelsError = true;
    }
    finally {
      await loading.dismiss();
    }
  }
  anteriorPaso(step: Pasos) {
    this.pasos = step;
  }
  async siguientePaso(step: Pasos, inputEl?: any) {
    if (step == Pasos.cedula) {

      // if (this.pt.is('mobileweb')) {
      inputEl.click();
      // }
      // else {
      //   const media = await this.media.getMedia();

      //   if (media) {
      //     const fileSize = media.size / 1024 / 1024;
      //     const base64String = media.data;

      //     if (fileSize >= 150) {
      //       await this.presentAlert('Los documentos no pueden exceder los 150 MB.');
      //       return;
      //     }

      //     try {
      //       await this.uploadBase64Fragmented(base64String, media.name);
      //     }
      //     catch (error: any) {
      //       // if (error && error.status == 401) {
      //       //   await this.error.handle(error);
      //       //   return
      //       // }

      //       await this.presentAlert(error.message || 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      //     }
      //   }
      // }

    }

    if (step == Pasos.captura) {
      await this.validarRostro();
    }

  }
  async validarRostro() {
    this.pasos = Pasos.captura;
    this.changeDetector.detectChanges();

    try {
      const mediaResult = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false });

      this.video1Ref.nativeElement.srcObject = mediaResult;
      this.video1Ref.nativeElement.addEventListener('loadeddata', this.onPlay.bind(this));
      this.video1Ref.nativeElement.play();
    }
    catch {
      await this.presentAlert('No se pudo acceder a la cámara. Vuelve a intentarlo.', async () => {
        await this.cerrar();
      });
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
        await this.uploadBase64Fragmented(base64, file.name);
      }
      catch (error: any) {
        // if (error && error.status == 401) {
        //   await this.error.handle(error);
        //   return;
        // }

        await this.presentAlert(error.message || 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      }
      finally {
        this.perfilInput.nativeElement.value = '';
      }
    }
  }
  async uploadBase64Fragmented(base64String: string, fileName: string): Promise<void> {
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

        const result = await this.api.cargarFotoCedula(0, params);

        if (result.success) {
          if (result.code == 202) {
            const progreso = Math.round(result.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (result.code == 200) {
            const file = this.utils.createImageFromBase64(result.data);

            try {
              await this.detectarRostro(file);

              this.fotoCelula = 'data:image/jpeg;base64,' + result.data;
              this.fotoCelulaRostro = 'data:image/jpeg;base64,' + result.face;
              this.pasos = Pasos.cedula;
            }
            catch {
              this.pasos = Pasos.inicial;
              await this.presentAlert('No se pudo detectar el rostro en la foto. Vuelve a intentarlo.');
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
  async detectarRostro(imageEl: HTMLImageElement) {
    try {
      this.resultFacedetection = await faceapi.detectSingleFace(imageEl, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!this.resultFacedetection) {
        throw Error();
      }

      return Promise.resolve(true);
    }
    catch {
      return Promise.reject();
    }
  }
  async onPlay() {
    const video1 = this.video1Ref.nativeElement;

    if (video1.paused || video1.ended)
      return null; //setTimeout(() => this.onPlay());

    if (this.modelsLoaded) {
      const resultFacedetection = this.resultFacedetection;
      const detectResult = await faceapi.detectSingleFace(video1, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detectResult) {
        const canvas = this.overlay1Ref.nativeElement;
        const dims = faceapi.matchDimensions(canvas, video1, true)
        faceapi.draw.drawDetections(canvas, faceapi.resizeResults(detectResult, dims));

        if (resultFacedetection && detectResult) {
          const distance = faceapi.euclideanDistance(this.resultFacedetection.descriptor, detectResult.descriptor);
          console.log(distance);
          this.rostroValido = distance < 0.6;

          if (distance < 0.6) {
            this.contadorExisto++;
          }
          else {
            this.contadorFracaso++;
          }

          if (this.contadorExisto > 9) {
            video1.pause();
            video1.currentTime = 0;

            await this.registrarAsistencia();

            this.pasos = Pasos.final;
          }
          else if (this.contadorFracaso > 9) {

            await this.presentAlert('Rostro no válido, vuelve a intentarlo.', async () => {
              this.pasos = Pasos.cedula;
            });

            video1.pause();
            video1.currentTime = 0;
          }
        }
      }
    }

    setTimeout(() => this.onPlay(), 250);
    return null;
  }
  async registrarAsistencia() {
    const loading = await this.dialog.showLoading({ message: 'Registrando asistencia...' });
    debugger
    const position = await this.getCurrentPosition();
    const userLat = position?.coords.latitude;
    const userLng = position?.coords.longitude;

    this.data.apesTlatitud = userLat;
    this.data.apesTlongitud = userLng;

    try {
      const result = await this.api.registrarAsistenciaCC(this.data);

      if (result.success) {
        this.pasos = Pasos.final;
        this.asistenciaCC = result.data.asistenciaCC;
      }
    }
    catch (error: any) {
    }
    finally {
      await loading.dismiss();
    }
  }
  async getCurrentPosition() {
    let position = null;

    try {
      position = await Geolocation.getCurrentPosition();
    } catch { }

    return position;
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
  async showAlertApp(header: string = 'INACAP', option: string) {
    const alert = await this.dialog.showAlert({
      header: header,
      message: `Permitir que INACAP acceda a ${option} del dispositivo.`,
      buttons: [
        {
          text: '"Abrir" Configuración',
          role: 'destructive',
          handler: async () => {
            await this.cerrar();

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
            await this.cerrar();
          }
        }
      ]
    });

    return alert;
  }
  async cerrar(result?: boolean) {
    await this.dialog.dismissModal(this.asistenciaCC);
  }
  private async loadModels(): Promise<boolean> {
    try {
      // await faceapi.nets.ssdMobilenetv1.loadFromUri(this.urlModels);
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
  get urlModels() {
    if (this.pt.is('mobileweb')) {
      return `https://siga.desa.inacap.cl/inacap.api.movil/content/models`;
    }

    return `${this.global.Api}/content/models`;
  }

}
