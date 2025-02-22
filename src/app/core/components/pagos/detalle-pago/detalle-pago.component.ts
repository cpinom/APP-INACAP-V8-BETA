import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PortalPagosService } from 'src/app/core/services/http/portalpagos.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

const EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.scss'],
})
export class DetallePagoComponent implements OnInit {

  success!: boolean;
  tpaoCcod!: string;
  paonNcorr!: string;
  data: any;
  hideLoadingSpinner = false;

  constructor(private api: PortalPagosService,
    private error: ErrorHandlerService,
    private dialog: DialogService,
    private global: AppGlobal,
    private pt: Platform,
    private snackbar: SnackbarService) { }

  async ngOnInit() {
    try {
      let params = { tpaoCcod: this.tpaoCcod, paonNcorr: this.paonNcorr };
      let result = await this.api[this.success ? 'getPagoExito' : 'getPagoFracaso'](params);

      if (this.success) {
        result.total = result.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      this.data = result;
    }
    catch (error) {
      await this.error.handle(error);
    }
    finally {
      this.hideLoadingSpinner = true;
    }
  }

  async descargarPDF() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });
    const params = {
      paonNcorr: this.paonNcorr,
      tpaoCcod: this.tpaoCcod,
      exito: this.success ? 1 : 0
    };

    try {
      let result = await this.api.descargarCertificado(params);
      let fileName = 'certificado_' + this.paonNcorr + '.pdf';

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
    catch (error) {
      await this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }

  async enviarCorreo() {
    if (!this.success) {
      return;
    }

    await this.dialog.showAlert({
      header: 'Enviar por correo',
      inputs: [
        {
          name: 'correo',
          type: 'email',
          placeholder: 'Correo destinatario',
          value: this.global.Integration ? 'cpinom&#64;inacap.cl' : ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Enviar',
          handler: async (item) => {
            let msgError = '';

            if (item.correo.length === 0) {
              msgError = 'Debes ingresar un correo.';
            }
            else if (!(EMAIL_REGEXP.test(item.correo))) {
              msgError = 'Debes ingresar un correo válido.';
            }

            if (msgError.length > 0) {
              this.snackbar.showToast(msgError, 3000, 'danger');
              return false;
            }

            let params = {
              paonNcorr: this.paonNcorr,
              tpaoCcod: this.tpaoCcod,
              correo: item.correo
            };

            const loading = await this.dialog.showLoading({ message: 'Enviando correo...' });

            try {
              await this.api.enviarCorreoComprobante(params);
              await this.snackbar.showToast('El documento de pago ha sido enviado correctamente.', 3000, 'success');
            }
            catch {
              await this.snackbar.showToast('Ha ocurrido un error mientras se procesaba tu solicitud.', 3000, 'error');
            }
            finally {
              await loading.dismiss();
            }

            return true;
          }
        }
      ]
    });
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
