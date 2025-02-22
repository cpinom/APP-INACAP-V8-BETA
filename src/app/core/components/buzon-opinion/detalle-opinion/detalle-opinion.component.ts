import { Component, inject, OnInit } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { BuzonOpinionService } from 'src/app/core/services/http/buzonopinion.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-detalle-opinion',
  templateUrl: './detalle-opinion.component.html',
  styleUrls: ['./detalle-opinion.component.scss'],
})
export class DetalleOpinionComponent implements OnInit {

  data: any;

  private api = inject(BuzonOpinionService);
  private utils = inject(UtilsService);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);
  private pt = inject(Platform);

  constructor() { }
  ngOnInit() {}
  async descargarArchivo() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      const result = await this.api.descargarAdjuntoV6(this.data.resoNcorr, this.data.tipoUsuario);

      if (result.success) {
        const base64 = result.data.resoArchivo;
        const fileName = this.data.resoNombreArchivo;
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
  resolverEstado(esreCcod: any) {
    if (esreCcod == 1)
      return 'info';
    else if (esreCcod == 2)
      return 'success';
    else if (esreCcod == 4)
      return 'danger';
    else
      return '';
  }
  resolverMiniatura() {
    return `${this.api.baseUrl}/v6/buzon-opinion/thumbnail?resoNcorr=${this.data.resoNcorr}&tuserCcod=${this.data.tipoUsuario}`;
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  isImage(path: string): boolean {
    return this.utils.isImage(path);
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}

