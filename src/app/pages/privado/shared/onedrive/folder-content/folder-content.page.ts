import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, LoadingController, Platform } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { OneDriveService } from 'src/app/core/services/http/onedrive.service';
import { MediaService } from 'src/app/core/services/media.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-folder-content',
  templateUrl: './folder-content.page.html',
  styleUrls: ['./folder-content.page.scss'],
})
export class FolderContentPage implements OnInit {

  @ViewChild('adjuntosInput') adjuntarEl!: ElementRef;
  mostrarCargando = true;
  mostrarData = false;
  data: any;
  items: any;

  private router = inject(Router);
  private pt = inject(Platform);
  private media = inject(MediaService);
  private snackbar = inject(SnackbarService);
  private api = inject(OneDriveService);
  private error = inject(ErrorHandlerService);
  private action = inject(ActionSheetController);
  private loading = inject(LoadingController);
  private dialog = inject(DialogService);
  private global = inject(AppGlobal);
  private utils = inject(UtilsService);

  constructor() { }

  async ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;

    if (!this.data) {
      await this.router.navigate([this.backUrl], { replaceUrl: true });
      return;
    }

    this.cargar();
  }
  async cargar() {
    try {
      const result = await this.api.getArchivosV5(this.data.driveId, this.data.id);

      if (result.success) {
        const { data } = result;
        this.items = data.items;
      }
      else {
        throw Error();
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
  async optionsTap(item: any, e: any) {
    e.stopPropagation();

    let buttons = [
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
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ];

    const actionSheet = await this.action.create({
      header: item.name,
      buttons: buttons
    });

    await actionSheet.present();
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
            await this.error.handle(error);
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
        await this.error.handle(error);
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

        const response = await this.api.cargarArchivo(this.data.id, params);

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
    catch (error: any) {
      return Promise.reject(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  resolverMiniatura(fileId: string) {
    return `${this.global.Api}/api/onedrive/v5/thumbnail?driveId=${this.data.driveId}&fileId=${fileId}`;
  }
  escanearTap() {
    alert('Falta implementar')
  }
  async descargarTap(file: any) {
    const loading = await this.loading.create({ message: 'Descargando...' });

    await loading.present();

    try {
      const result = await this.api.descargarArchivo({ fileId: file.id, folderId: this.data.id });

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
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  async eliminarTap(file: any) {
    const loading = await this.loading.create({ message: 'Eliminando...' });

    await loading.present();

    try {
      const result = await this.api.eliminarArchivo({ fileId: file.id, folderId: this.data.id });

      if (result.success) {
        this.items = result.items;
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

      this.snackbar.showToast('No se pudo eliminar el archivo.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  async itemTap(item: any) {
    this.descargarTap(item);
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  isImage(path: string) {
    return this.utils.isImage(path)
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
  get backUrl() { return this.router.url.replace('/folder-content', ''); }

}
