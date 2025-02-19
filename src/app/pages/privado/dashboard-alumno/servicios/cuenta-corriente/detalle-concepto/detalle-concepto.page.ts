import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { CuentaCorrienteService } from 'src/app/core/services/cuentacorriente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { FileOpener } from '@capacitor-community/file-opener';

@Component({
  selector: 'app-detalle-concepto',
  templateUrl: './detalle-concepto.page.html',
  styleUrls: ['./detalle-concepto.page.scss'],
})
export class DetalleConceptoPage implements OnInit {

  data: any;

  constructor(private modalCtrl: ModalController,
    private api: CuentaCorrienteService,
    private loading: LoadingController,
    private error: ErrorHandlerService,
    private snackbar: SnackbarService,
    private pt: Platform) { }

  ngOnInit() { }
  cerrar() {
    this.modalCtrl.dismiss();
  }
  async descargar(item) {
    let loading = await this.loading.create({ message: 'Descargando...' });
    let params = {
      ingrNcorr: item.ingreso,
      folio: item.folio
    };

    await loading.present();

    try {
      let result = await this.api.descargarDocumento(params);
      let fileName = 'documento_' + item.ingreso + '.pdf';

      if (result.success) {
        if (this.pt.is('mobileweb')) {
          const linkSource = `data:application/pdf;base64,${result.data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
        else {
          const file = await Filesystem.writeFile({
            path: fileName,
            data: result.data,
            directory: Directory.Cache
          });

          await FileOpener.open({
            filePath: file.uri,
            contentType: 'application/pdf'
          });
        }
      }
    }
    catch (error: any) {
      if (error.status == 404) {
        this.snackbar.showToast('Documento no disponible', 2000);
      }
      else {
        this.error.handle(error);
      }
    }
    finally {
      await loading.dismiss();
    }
  }
  get concepto() {
    if (this.data && this.data.data.length) {
      return this.data.data[0].concepto.trim();
    }
    return '';
  }

}
