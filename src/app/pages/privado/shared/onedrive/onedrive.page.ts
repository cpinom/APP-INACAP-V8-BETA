import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, AlertButton, AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MediaService } from 'src/app/core/services/media.service';
import { OneDriveService } from 'src/app/core/services/onedrive.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { Global } from './../../../../app.global';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-onedrive',
  templateUrl: './onedrive.page.html',
  styleUrls: ['./onedrive.page.scss'],
})
export class OnedrivePage implements OnInit {

  @ViewChild('adjuntosInput') adjuntarEl!: ElementRef;
  mostrarData = false;
  mostrarCargando = true;
  items: any;
  driveId: string = '';

  constructor(private router: Router,
    private api: OneDriveService,
    private error: ErrorHandlerService,
    private nav: NavController,
    private action: ActionSheetController,
    private alert: AlertController,
    private pt: Platform,
    private media: MediaService,
    private snackbar: SnackbarService,
    private loading: LoadingController,
    private dialog: DialogService,
    private global: Global,
  private utils: UtilsService) { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar(force?: boolean) {
    const driveIdStoraged = await this.api.getStorage('driveId');

    if (driveIdStoraged != null) {
      this.driveId = driveIdStoraged;
    }

    if (force === true) {
      this.driveId = '';
    }

    try {
      const result = await this.api.getPrincipalV5(this.driveId);

      if (result.success) {
        const { data } = result;
        this.driveId = data.driveId;
        this.items = data.items;
        await this.api.setStorage('driveId', this.driveId)
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error.status == 401) {
        this.error.handle(error);
        return
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar(e) {
    this.mostrarCargando = false;
    this.cargar(true).finally(() => {
      e.target.complete();
    })
  }
  async itemTap(item: any) {
    if (item.folder) {
      const params = { id: item.id, driveId: this.driveId, name: item.name }
      await this.nav.navigateForward(`${this.router.url}/folder-content`, { state: params });
    }
    else if (item.file) {
      await this.descargarTap(item);
    }
  }
  async optionsTap(item: any, e: any) {
    e.stopPropagation();

    let buttons: any;

    if (item.folder) {
      buttons = [
        {
          text: 'Cambiar nombre',
          handler: () => {
            this.renombrarCarpetaTap(item);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarTap(item);
          }
        }
      ];
    }
    else if (item.file) {
      buttons = [
        {
          text: 'Descargar',
          handler: () => {
            this.descargarTap(item);
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarTap(item);
          }
        }
      ]
    }

    buttons.push({
      text: 'Cancelar',
      role: 'cancel'
    });

    const actionSheet = await this.action.create({
      header: item.name,
      buttons: buttons
    });

    await actionSheet.present();
  }
  async crearCarpetaTap() {
    const nombreCarpeta = await this.confimarNombreCarpeta();

    if (nombreCarpeta) {
      const loading = await this.loading.create({ message: 'Creando...' });

      await loading.present();

      try {
        const result = await this.api.crearCarpeta({ carpeta: nombreCarpeta });

        if (result.success) {
          this.items = result.items;
        }
        else {
          throw Error();
        }
      }
      catch (error) {
        if (error.status == 401) {
          this.error.handle(error);
          return;
        }

        this.snackbar.showToast('La carpeta no pudo ser creada.', 3000, 'danger')
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async renombrarCarpetaTap(folder: any) {
    const nombreCarpeta = await this.confimarNombreCarpeta(folder);

    if (nombreCarpeta) {
      const loading = await this.loading.create({ message: 'Actualizando...' });

      await loading.present();

      try {
        const result = await this.api.renombrarCarpeta({
          folderId: folder.id,
          carpeta: nombreCarpeta
        });

        if (result.success) {
          this.items = result.items;
        }
        else {
          throw Error();
        }
      }
      catch (error) {
        if (error.status == 401) {
          this.error.handle(error);
          return;
        }

        this.snackbar.showToast('La carpeta no pudo ser renombrada.', 3000, 'danger')
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async agregarArchivoTap(inputEl: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      const media = await this.media.getMedia();

      if (media) {
        const fileSize = media.size / 1024 / 1024;
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
  async adjuntar(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024;

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

        const response = await this.api.cargarArchivo(this.driveId, params);

        if (response.success) {
          if (response.code == 202) {
            const progreso = Math.round(response.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (response.code == 200) {
            this.items = response.data.items;
            this.snackbar.showToast('Archivo cargado correctamente.', 3000, 'success');
          }
        }
        else {
          throw Error(response);
        }

      }
    }
    catch (error) {
      return Promise.reject(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async descargarTap(file: any) {
    const loading = await this.loading.create({ message: 'Descargando...' });

    await loading.present();

    try {
      const result = await this.api.descargarArchivo({ fileId: file.id, folderId: this.driveId });

      if (result.success) {
        if (this.pt.is('mobileweb')) {
          const linkSource = `data:${file.contentType};base64,${result.data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = file.name;
          downloadLink.click();
        }
        else {
          const fileResult = await Filesystem.writeFile({
            path: file.name,
            data: result.data,
            directory: Directory.Cache
          });

          FileOpener.open({
            filePath: fileResult.uri,
            contentType: file.contentType
          });
        }
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      if (error.status == 401) {
        this.error.handle(error);
        return;
      }

      this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  async eliminarTap(file: any) {
    const loading = await this.dialog.showLoading({ message: 'Eliminando...' });

    try {
      const result = await this.api.eliminarArchivo({ fileId: file.id, folderId: this.driveId });

      if (result.success) {
        this.items = result.items;
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      if (error.status == 401) {
        this.error.handle(error);
        return;
      }

      this.snackbar.showToast('No se pudo eliminar el archivo.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  confimarNombreCarpeta(item?: any): Promise<string> {
    return new Promise((resolve) => {
      let buttons: AlertButton[];

      if (item) {
        buttons = [
          {
            text: 'Cambiar nombre',
            role: 'destructive',
            handler: (item) => {
              resolve(item.name);
            }
          },
          {
            text: 'Cancelar'
          }
        ];
      }
      else {
        buttons = [
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Crear',
            handler: (item) => {
              resolve(item.name);
            }
          }
        ];
      }

      this.alert.create({
        header: item ? 'Cambiar nombre' : 'Nombre de carpeta',
        inputs: [
          {
            name: 'name',
            type: 'text',
            value: item ? item.name : null,
            placeholder: 'Nueva carpeta'
          }
        ],
        buttons: buttons
      }).then(alert => alert.present());
    });
  }
  resolverMiniatura(fileId: string) {
    return `${this.global.Api}/api/onedrive/v5/thumbnail?driveId=${this.driveId}&fileId=${fileId}`;
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  isImage(path: string): boolean {
    return this.utils.isImage(path);
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
  get backUrl() { return this.router.url.replace('/onedrive', ''); }

}
