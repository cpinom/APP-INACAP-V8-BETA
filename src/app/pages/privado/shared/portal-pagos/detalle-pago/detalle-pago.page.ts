import { Component, inject, OnInit } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PortalPagosService } from 'src/app/core/services/http/portalpagos.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

const EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.page.html',
  styleUrls: ['./detalle-pago.page.scss'],
})
export class DetallePagoPage implements OnInit {

  pagoExito!: boolean;
  data: any;
  pagoId: any;
  medioPagoId: any;

  private pt = inject(Platform);
  private dialog = inject(DialogService);
  private api = inject(PortalPagosService);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);

  constructor() { }

  async ngOnInit() {
    this.pagoId = this.data.paonNcorr;
    this.medioPagoId = this.data.tpaoCcod;
  }
  async cerrar(userClose?: boolean) {
    await this.dialog.dismissModal(userClose === true);
  }
  async descargarPDF() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });
    const params = {
      paonNcorr: this.pagoId,
      tpaoCcod: this.medioPagoId,
      exito: this.pagoExito ? 1 : 0
    };

    try {
      const result = await this.api.descargarCertificado(params);
      const fileName = 'certificado_' + this.pagoId + '.pdf';

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
      await this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async enviarCorreo() {
    if (!this.pagoExito) {
      return;
    }

    const loading = await this.dialog.showLoading({ message: 'Enviando correo...' });

    await this.dialog.showAlert({
      header: 'Enviar por correo',
      inputs: [
        {
          name: 'correo',
          type: 'email',
          placeholder: 'Correo destinatario',
          value: this.pt.is('mobileweb') ? 'cpinom&#64;inacap.cl' : ''
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
              paonNcorr: this.pagoId,
              tpaoCcod: this.medioPagoId,
              correo: item.correo
            };

            try {
              await this.api.enviarCorreoComprobante(params);
              await loading.dismiss();
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
}
