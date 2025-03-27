import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { SeguroAccidentesService } from 'src/app/core/services/http/seguroaccidentes.service';
import { MediaService } from 'src/app/core/services/media.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.page.html',
  styleUrls: ['./nueva-solicitud.page.scss'],
})
export class NuevaSolicitudPage implements OnInit, OnDestroy {

  @ViewChild('adjuntosInput') adjuntarEl!: ElementRef;
  @ViewChild('stepper') private myStepper?: MatStepper;
  mostrarData = false;
  firstStep: FormGroup;
  secondStep: FormGroup;
  // hideLoadingSpinner!: boolean;
  perfilAlumno: any;
  bancosArray = [];
  correosArray: any[] = [];
  tipoCuentasArray = [];
  submitAttempt = false;
  // image: any;
  // imageName!: string;
  // imageArray = [];
  // imageArraySize: number = 1;
  // imageArraySizeError!: boolean;
  correoConfig = {
    header: 'Correo de contacto',
  };
  documentos: any[] = [];
  solicitudId = 0;

  private api = inject(SeguroAccidentesService);
  private alumno = inject(AlumnoService);
  private profile = inject(ProfileService);
  private dialog = inject(DialogService);
  private router = inject(Router);
  private alert = inject(AlertController);
  private error = inject(ErrorHandlerService);
  private pt = inject(Platform);
  private snackbar = inject(SnackbarService);
  private action = inject(ActionSheetController);
  private media = inject(MediaService);
  private fb = inject(FormBuilder);
  private utils = inject(UtilsService);

  constructor() {

    this.firstStep = this.fb.group({
      nombre: [''],
      rut: [''],
      emailCtrl: ['', Validators.required],
      telefonoCtrl: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^\+569\d{8}$/)
      ])]
    });

    this.secondStep = this.fb.group({
      tipoCuentaCtrl: ['', Validators.required],
      bancoCtrl: ['', Validators.required],
      numCuentaCtrl: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(24),
        Validators.pattern(/^[0-9]\d*$/)
      ])]
    });
  }
  async ngOnInit() {
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const data = await this.api.getStorage('principal');
    let perfil = await this.profile.getPrincipal();

    this.bancosArray = data['bancos'];
    this.tipoCuentasArray = data['tipoCuentas'];

    if (!perfil) {
      const result = await this.alumno.getPerfilV5(programa.sedeCcod);

      if (result.success) {
        perfil = result.perfil;
        await this.profile.setPrincipal(perfil);
      }
    }

    this.correosArray.push(perfil.persTemailInacap);

    if (perfil.persTemail && perfil.persTemail != perfil.persTemailInacap) {
      this.correosArray.push(perfil.persTemail.toLowerCase());
    }

    this.nombreCtrl?.setValue(perfil.persTnombre);
    this.rutCtrl?.setValue(perfil.rut);
    this.firstStep.patchValue({ emailCtrl: this.correosArray[0] });
    this.perfilAlumno = perfil;
    this.mostrarData = true;
  }
  ngOnDestroy() {
    if (this.solicitudId > 0) {
      this.api.eliminarSolicitud(this.solicitudId);
    }
  }
  async nextStep(number: number, formGroup?: FormGroup) {
    if (number === 1) {
      formGroup?.markAllAsTouched();

      if (formGroup?.valid) {
        if (this.myStepper) {
          if (this.myStepper.selected) {
            this.myStepper.selected.completed = true;
          }
          this.myStepper.next();
        }
        this.submitAttempt = false;
      }
    }
    else if (number === 2) {
      this.submitAttempt = true;
      formGroup?.markAllAsTouched();

      if (formGroup?.valid && this.documentos.length > 0) {
        this.myStepper?.next();
      }
    }
  }
  prevStep(stepper?: any) {
    this.myStepper?.previous();
  }
  async enviarSolicitud() {
    const confirm = await this.confirmar('¿Estás seguro de que deseas enviar la solicitud?');

    if (!confirm) return;

    const loading = await this.dialog.showLoading({ message: 'Procesando solicitud...' });

    try {
      const params = {
        solicitudId: this.solicitudId,
        email: this.emailCtrl?.value,
        telefono: this.telefonoCtrl?.value,
        datosBancarios: `${this.bancoCtrl?.value} | ${this.tipoCuentaCtrl?.value} | ${this.numCuentaCtrl?.value}`
      };

      const result = await this.api.enviarSolicitud(params);

      if (result.success) {
        await this.presentSuccess('Se ha ingresado tu solicitud nº' + result.casoId + ' de manera exitosa.');
      }
      else {
        await this.presentError('Error al enviar solicitud', 'No se pudo enviar la solicitud. Vuelve a intentarlo.');
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      await loading.dismiss();
    }
  }
  async adjuntar(input: any) {
    if (this.pt.is('mobileweb')) {
      input.click();
    }
    else {
      let file = await this.media.getMedia(true);

      if (file) {
        /*let soliNcorr = this.solicitud.soliNcorr;
        let fileSize = file.size / 1024 / 1024;
        let loading = await this.loading.create({ message: 'Cargando archivo...' });

        if (fileSize <= 3) {
          await loading.present();

          try {
            const params = { soliNcorr: soliNcorr };
            const response: any = await this.api.agregarArchivoSolicitud(file.path, file.name, params);
            const result = response.data;

            if (result.success) {
              this.solicitud.documentos = result.documentos;
              await this.api.setStorage('solicitud', this.solicitud);
            } else {
              this.snackbar.showToast(result.message, 3000, 'danger');
            }
          }
          catch (error) {
            this.snackbar.showToast('No fue posible cargar el archivo.', 2000);
          }
          finally {
            await loading.dismiss();
          }
        } else {
          this.snackbar.showToast('Los documentos no pueden exceder los 3 MB.', 2000);
        }*/
      }
    }
  }
  async adjuntarArchivos(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      let fileSize = file.size / 1024 / 1024;

      if (fileSize >= 150) {
        await this.presentError('Cargar Archivos', 'Los documentos no pueden exceder los 150 MB.');
        return;
      }

      try {
        const base64 = await this.utils.fileToBase64(file);
        await this.uploadBase64Fragmented(base64, file.name);
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }

        await this.presentError('Cargar Archivos', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      }
      finally {
        this.adjuntarEl.nativeElement.value = '';
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

        const result = await this.api.cargarArchivo(this.solicitudId, params);

        if (result.success) {
          if (result.code == 202) {
            const progreso = Math.round(result.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (result.code == 200) {
            this.solicitudId = result.data.solicitudId;
            this.documentos = result.data.documentos;
            await this.snackbar.showToast('Archivo cargado correctamente.', 3000, 'success');
          }
        }
        else {
          throw Error(result);
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
  async eliminarArchivo(aptaNcorr: any, e: any) {
    e.stopPropagation();

    const loading = await this.dialog.showLoading({ message: 'Eliminando archivo...' });

    try {
      const result = await this.api.eliminarArchivo(this.solicitudId, aptaNcorr);

      if (result.success) {
        this.documentos = result.data.documentos;
        await this.snackbar.showToast('Archivo eliminado correctamente.', 3000, 'success');
      }
      else {
        throw Error(result);
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.presentError('Eliminar Archivo', 'No se pudo eliminar el archivo. Vuelve a intentarlo.');
    }
    finally {
      await loading.dismiss();
    }
  }
  async descargarArchivo(item: any) {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      const result = await this.api.descargarArchivo(item.aptaNcorr);

      if (result.success) {
        const base64 = result.data.aptaBarchivo;
        const fileName = result.data.aptaTnombre;
        const contentType = this.utils.getMimeType(fileName);

        if (this.pt.is('mobileweb')) {
          const linkSource = `data:${contentType};base64,${base64}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
        else {
          const fileResult = await Filesystem.writeFile({
            path: fileName,
            data: base64,
            directory: Directory.Cache
          });

          await FileOpener.open({
            filePath: fileResult.uri,
            contentType: contentType
          });
        }

      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  confirmar(message: string, title?: string): Promise<boolean> {

    return new Promise(async (resolve) => {

      const alert = await this.dialog.showAlert({
        header: title || 'Confirmar envío solicitud',
        subHeader: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      });

      return alert;

    });
  }
  async presentSuccess(mensaje: string) {
    await this.dialog.showAlert({
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'success-alert',
      message: '<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>' + mensaje,
      buttons: [
        {
          text: 'Aceptar',
          role: 'ok',
          handler: async () => {
            await this.router.navigate([this.backUrl]);
          }
        }
      ]
    });
  }
  async presentError(title: string, message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: title,
      buttons: ['Aceptar']
    });

    return alert;
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  isImage(path: string): boolean {
    return this.utils.isImage(path);
  }
  resolverMiniatura(aptaNcorr: any) {
    return `${this.api.baseUrl}/v5/seguro-accidentes/thumbnail?aptaNcorr=${aptaNcorr}`;
  }
  get nombreCtrl() { return this.firstStep.get('nombre'); }
  get rutCtrl() { return this.firstStep.get('rut'); }
  get emailCtrl() { return this.firstStep.get('emailCtrl'); }
  get telefonoCtrl() { return this.firstStep.get('telefonoCtrl'); }
  get tipoCuentaCtrl() { return this.secondStep.get('tipoCuentaCtrl'); }
  get bancoCtrl() { return this.secondStep.get('bancoCtrl'); }
  get numCuentaCtrl() { return this.secondStep.get('numCuentaCtrl'); }
  get backUrl() { return this.router.url.replace('/nueva-solicitud', ''); }

  get telefonoError() {
    if (this.telefonoCtrl?.hasError('pattern'))
      return 'Teléfono inválido (Ej: +56990009000)';
    if (this.telefonoCtrl?.hasError('required'))
      return 'Campo obligatorio.';
    return '';
  }

}

