import { Component, inject, OnInit } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SolicitudesService } from 'src/app/core/services/http/solicitudes.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-solicitud-detalle',
  templateUrl: './solicitud-detalle.page.html',
  styleUrls: ['./solicitud-detalle.page.scss'],
})
export class SolicitudDetallePage implements OnInit {

  data: any;

  private api = inject(SolicitudesService);
  private dialog = inject(DialogService);
  private utils = inject(UtilsService);
  private error = inject(ErrorHandlerService);
  private pt = inject(Platform);
  private snackbar = inject(SnackbarService);

  constructor() { }

  ngOnInit() { }
  resolverLabel(text: string) {
    if (!text) return '';
    return text.replace(/\.$/, "") + ": ";
  }
  resolverEstado(item: any) {
    if (item.esolCcod == 3) return 'danger';
    if (item.esolCcod == 2) return 'success';
    if (item.esolCcod == 1) return 'warning';
    if (item.esolCcod == 6) return 'medium';
    if (item.esolCcod == 8 || item.esolCcod == 11) return 'danger';
    return '';
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  async descargar(url: string) {
    if (!url) return;
    await this.utils.openLink(url);
  }
  async descargarArchivo(item: any) {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      const result = await this.api.descargarAdjuntoV5(item.soarNcorr);

      if (result.success) {
        const { data } = result;
        const base64 = data.soarFarchivo;
        const fileName = data.soarTnombre;
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
  async anular() {
    const confirm = await this.confirmarEliminar();

    if (!confirm) return;

    await this.dialog.dismissModal({ anular: true });
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  confirmarEliminar(): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.dialog.showAlert({
        header: 'Anular Solicitud',
        message: '¿Estás seguro que deseas anular la Solicitud?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          }, {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      });
    })
  }

}
