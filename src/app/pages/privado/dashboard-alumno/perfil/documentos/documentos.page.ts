import { Component, inject, OnInit } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Browser } from '@capacitor/browser';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ActionSheetController, Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DocumentosService } from 'src/app/core/services/http/documentos.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.page.html',
  styleUrls: ['./documentos.page.scss'],
})
export class DocumentosPage implements OnInit {

  private api = inject(DocumentosService);
  private error = inject(ErrorHandlerService);
  private action = inject(ActionSheetController);
  private dialog = inject(DialogService);
  private pt = inject(Platform);
  private snackbar = inject(SnackbarService);

  mostrarCargando = true;
  mostrarData = false;
  tabModel = 0;
  contratos: any;
  acuerdoTutorial: any;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const result = await this.api.getPrincipal();

      if (result.success) {
        this.contratos = result.data.contratos;
        this.acuerdoTutorial = result.data.acuerdoTutorial;
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
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 500)
  }
  async detalleContrato(data: any) {
    let buttons = [];

    if (data.urlFirmaAlumno) {
      buttons.push({
        text: 'Firmar Estudiante',
        handler: () => {
          this.firmarContarto(data.urlFirmaAlumno);
          return true;
        }
      })
    }

    if (data.urlFirmaFiador) {
      buttons.push({
        text: 'Firmar Fiador',
        handler: () => {
          this.firmarContarto(data.urlFirmaFiador);
          return true;
        }
      })
    }

    buttons.push({
      text: 'Descargar',
      handler: async () => {
        this.descargarContrato(data.postNcorr);
        return true;
      }
    });

    buttons.push({
      text: 'Salir',
      role: 'destructive'
    });

    const actionSheet = await this.action.create({
      header: 'Estado del Contrato: ' + data.estado,
      buttons: buttons
    });

    await actionSheet.present();
  }
  async firmarContarto(url: string) {
    await Browser.open({ url: url });
  }
  async descargarContrato(postNcorr: any) {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      const result = await this.api.descargarContrato({ postNcorr: postNcorr });
      const fileName = `contrato_${postNcorr}.pdf`;

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
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }

      await this.snackbar.showToast('Certificado no disponible.', 3000, 'danger');
    }
    finally {
      await loading.dismiss();
    }
  }
  async descargarAcuerdoTutorial() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      const random = this.getRandomInt(1111111111, 9999999999);
      const result = await this.api.descargarAcuerdoTurorial({});
      const fileName = `acuerdo_tutorial_${random}.pdf`;

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
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }

      await this.snackbar.showToast('Certificado no disponible.', 3000, 'danger');
    }
    finally {
      await loading.dismiss();
    }
  }
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
