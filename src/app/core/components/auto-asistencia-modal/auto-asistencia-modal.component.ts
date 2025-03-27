import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Platform } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { AlumnoService } from '../../services/http/alumno.service';
import { AppGlobal } from 'src/app/app.global';
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
export class AutoAsistenciaModalComponent implements OnInit, AfterViewInit, OnDestroy {

  private dialog = inject(DialogService);
  private changeDetector = inject(ChangeDetectorRef);
  private pt = inject(Platform);
  private utils = inject(UtilsService);
  private api = inject(AlumnoService);
  private global = inject(AppGlobal);

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
  stream!: MediaStream;
  timeoutId: any;
  stopLoop = false;

  constructor() { }
  async ngAfterViewInit() { }
  async ngOnInit() {
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
        await this.showAlertApp('INACAP', 'Cámara');
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
        await this.showAlertApp('INACAP', 'Galería');
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
        await this.showAlertApp('INACAP', 'Ubicación');
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
  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
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
    this.stopLoop = false;
    this.timeoutId = null;
    this.contadorExisto = 0;
    this.contadorFracaso = 0;
    this.rostroValido = false;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'user' } }, audio: false });
      this.video1Ref.nativeElement.srcObject = this.stream;
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
    const loading = await this.dialog.showLoading({ message: 'Cargando Cédula...' });

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

    if (this.stopLoop && this.timeoutId) {
      clearTimeout(this.timeoutId);
      return null;
    }

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

          this.rostroValido = distance < 0.6;

          if (distance < 0.6) {
            this.contadorExisto++;
          }
          else {
            this.contadorFracaso++;
          }

          if (this.contadorExisto > 9) {
            this.stopLoop = true;
            video1.pause();
            video1.currentTime = 0;

            const result = await this.registrarAsistencia();

            if (result === true) {
              this.pasos = Pasos.final;
            }
            else if (typeof result === 'string') {
              await this.presentAlert(result);
              this.pasos = Pasos.inicial;
            }
            else {
              await this.presentAlert('No se pudo registrar la asistencia. Vuelve a intentarlo.');
              this.pasos = Pasos.cedula;
            }
          }
          else if (this.contadorFracaso > 9) {
            this.stopLoop = true;
            await this.presentAlert('Rostro no válido, vuelve a intentarlo.', async () => {
              this.pasos = Pasos.cedula;
            });

            video1.pause();
            video1.currentTime = 0;
          }
        }
      }
    }

    this.timeoutId = setTimeout(() => this.onPlay(), 50);
    return null;
  }
  async registrarAsistencia() {
    const loading = await this.dialog.showLoading({ message: 'Verificando tu ubicación...' });
    const position = await this.getCurrentPosition();

    if (position == null) {
      await loading.dismiss();
      await this.showAlertApp('INACAP', 'Ubicación');
      return Promise.resolve(false);
    }

    const userLat = position?.coords.latitude;
    const userLng = position?.coords.longitude;

    if (!this.validarRangoPermitido(userLat, userLng)) {
      await loading.dismiss();
      return Promise.resolve('Tu dispositivo está lejos del centro médico. Intenta nuevamente cuando estés más cerca.');
    }

    loading.message = 'Registrando Asistencia...';

    this.data.apesTlatitud = userLat;
    this.data.apesTlongitud = userLng;

    try {
      const result = await this.api.registrarAsistenciaCC(this.data);

      if (result.success) {
        this.pasos = Pasos.final;
        this.asistenciaCC = result.data.asistenciaCC;

        return Promise.resolve(true);
      }
      else {
        return Promise.resolve(false);
      }
    }
    catch (error: any) {
      return Promise.resolve(false);
    }
    finally {
      await loading.dismiss();
    }
  }
  async getCurrentPosition() {
    let position = null;

    try {
      position = await Geolocation.getCurrentPosition();
    }
    catch { }

    return position;
  }
  validarRangoPermitido(latActual: number, lonActual: number) {
    // debugger
    const latDestino = parseFloat(this.data.apceTlatitud);
    const lonDestino = parseFloat(this.data.apceTlongitud);
    const radioMetros = this.data.radioPermitido;
    const distancia = this.calcularDistanciaMetros(latActual, lonActual, latDestino, lonDestino);
    // const distancia = this.calcularDistanciaMetros(-36.607512, -72.101721, latDestino, lonDestino);

    // console.log('distancia');
    // console.log(distancia);

    if (distancia <= radioMetros) {
      return true;
    }

    return false;
  }
  async presentAlert(message: string, callback?: Function) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: 'Registro de Asistencia',
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
      message: `Permitir que INACAP acceda a la ${option} del dispositivo.`,
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
  private calcularDistanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = this.gradosARadianes(lat2 - lat1);
    const dLon = this.gradosARadianes(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.gradosARadianes(lat1)) *
      Math.cos(this.gradosARadianes(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  private gradosARadianes(grados: number): number {
    return grados * (Math.PI / 180);
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
