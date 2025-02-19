import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { BuzonOpinionService } from 'src/app/core/services/http/buzonopinion.service';
import { MediaService } from 'src/app/core/services/media.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-nueva-opinion',
  templateUrl: './nueva-opinion.component.html',
  styleUrls: ['./nueva-opinion.component.scss'],
})
export class NuevaOpinionComponent implements OnInit, OnDestroy {

  @ViewChild('archivoInput') adjuntarEl!: ElementRef;
  opinionForm: FormGroup;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-]+$';
  tipoUsuario!: string;
  clasificaciones: any;
  topicos: any;
  temas: any;
  submitAttempt!: boolean;
  solicitudId = 0;
  nombreDocumento!: string;

  private api = inject(BuzonOpinionService);
  private dialog = inject(DialogService);
  private error = inject(ErrorHandlerService);
  private media = inject(MediaService);
  private pt = inject(Platform);
  private snackbar = inject(SnackbarService);
  private formBuilder = inject(FormBuilder);
  private utils = inject(UtilsService);

  constructor() {

    this.opinionForm = this.formBuilder.group({
      clopCcod: ['', Validators.required],
      ticoCcod: ['', Validators.required],
      coopCcod: ['', Validators.required],
      resoTsugerencia: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(2000),
        Validators.pattern(this.patternStr)
      ])]
    });

  }
  ngOnDestroy() {
    this.eliminarArchivo();
  }
  ngOnInit() {
    this.clopCcod?.setValue(this.clasificaciones[0].clopCcod);
    this.ticoCcod?.setValue(this.topicos[0].ticoCcod);
    this.coopCcod?.setValue(this.temas[0].coopCcod);
    this.mensaje?.setValue('');
  }
  async getSubcategorias(ticoCcod: any) {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      const result = await this.api.getSubcategoriasV6(ticoCcod);

      if (result.success) {
        this.temas = result.data.temas;
        this.coopCcod?.patchValue(this.temas[0].coopCcod);
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async adjuntarArchivoWeb(event: any) {
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
          this.error.handle(error);
          return;
        }

        await this.presentError('Cargar Archivos', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      }
      finally {
        this.adjuntarEl.nativeElement.value = '';
      }
    }
  }
  async adjuntarArchivo(inputEl: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      const media = await this.media.getMedia();

      if (media) {
        const fileSize = media?.size! / 1024 / 1024;
        const base64String = media.data;

        if (fileSize >= 150) {
          this.presentError('Cargar Archivos', 'Los documentos no pueden exceder los 150 MB.');
          return;
        }

        try {
          await this.uploadBase64Fragmented(base64String, media.name);
        }
        catch (error: any) {
          if (error && error.status == 401) {
            this.error.handle(error);
            return
          }

          await this.presentError('Cargar Archivos', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
        }
      }
    }
  }
  async uploadBase64Fragmented(base64String: string, fileName: string): Promise<void> {
    const fragments = this.utils.divideBase64(base64String);
    const totalParts = fragments.length;
    const loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });
    const tuserCcod = this.tipoUsuario;

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

        const result = await this.api.cargarArchivoV6(tuserCcod, params);

        if (result.success) {
          if (result.code == 202) {
            const progreso = Math.round(result.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (result.code == 200) {
            this.solicitudId = result.data.resoNcorr;
            this.nombreDocumento = fileName;
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
  async descargarArchivo() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      const result = await this.api.descargarAdjuntoV6(this.solicitudId, this.tipoUsuario);

      if (result.success) {
        const base64 = result.data.resoArchivo;
        const fileName = this.nombreDocumento;
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
        this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  async eliminarArchivo(e?: any, notify?: boolean) {
    e && e.stopPropagation();

    if (this.solicitudId) {
      let loading: HTMLIonLoadingElement | undefined;

      if (notify == true) {
        loading = await this.dialog.showLoading({ message: 'Eliminando...' });
      }

      try {
        await this.api.eliminarArchivoV6(this.solicitudId, this.tipoUsuario);
      }
      catch { }

      this.solicitudId = 0;
      this.nombreDocumento = '';

      if (notify == true) {
        await loading?.dismiss();
        await this.snackbar.showToast('Archivo eliminado correctamente.', 3000, 'success');
      }
    }
  }
  async enviar() {
    this.submitAttempt = true;

    if (this.opinionForm.valid) {
      const params = Object.assign(this.opinionForm.value, { tuserCcod: this.tipoUsuario, resoNcorr: this.solicitudId });
      const loading = await this.dialog.showLoading({ message: 'Enviando...' });

      try {
        const result = await this.api.enviarOpinionV6(params);

        if (result.success) {
          this.solicitudId = 0;
          await loading.dismiss();
          await this.presentSuccess(result.data);
          await this.dialog.dismissModal(true);
        }
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  resolverMiniatura() {
    return `${this.api.baseUrl}/v6/buzon-opinion/thumbnail?resoNcorr=${this.solicitudId}&tuserCcod=${this.tipoUsuario}`;
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  isImage(path: string): boolean {
    return this.utils.isImage(path);
  }
  async presentSuccess(result: any) {
    const mensaje = 'Tu opinión N° ' + result.resoNcorr + ' se ha ingresado con éxito.'

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Buzón de Opiniones',
      cssClass: 'success-alert',
      message: `<div class="image"><ion-icon src = "./assets/icon/check_circle.svg"></ion-icon></div>${mensaje}`,
      buttons: [{
        text: 'Aceptar'
      }]
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
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get clopCcod() { return this.opinionForm.get('clopCcod'); }
  get ticoCcod() { return this.opinionForm.get('ticoCcod'); }
  get coopCcod() { return this.opinionForm.get('coopCcod'); }
  get mensaje() { return this.opinionForm.get('resoTsugerencia'); }

}
