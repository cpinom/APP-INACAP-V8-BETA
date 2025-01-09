import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PublicService } from 'src/app/core/services/public.service';
import { UtilsService } from 'src/app/core/services/utils.service';

enum TipoCertificado {
  Grado = 1,
  Normal = 2,
  Otro = 3,
  Capacitacion = 4,
  Invalido = 5
}

@Component({
  selector: 'app-verificacion-documentos',
  templateUrl: './verificacion-documentos.page.html',
  styleUrls: ['./verificacion-documentos.page.scss'],
  standalone: false
})
export class VerificacionDocumentosPage implements OnInit {

  @ViewChild('documentosInput') adjuntarEl!: ElementRef;
  form: FormGroup;
  certificadoValido: any;
  detalle: any;

  constructor(private fb: FormBuilder,
    private pt: Platform,
    private dialog: DialogService,
    private utils: UtilsService,
    private error: ErrorHandlerService,
    private api: PublicService
  ) {

    this.form = this.fb.group({
      codigo: ['', Validators.required]
    });

    this.codigo?.valueChanges.subscribe((value) => {
      if (!value) {
        this.certificadoValido = null;
        this.detalle = null;
      }
    });

  }

  ngOnInit() {
  }
  validar() {
    debugger
  }
  cargarDocumento(inputEl: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
    }
  }
  async cargarDocumentoWeb(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024;

    if (fileSize >= 150) {
      await this.presentError('INACAP', 'Los documentos no pueden exceder los 150 MB.');
      return;
    }

    try {
      const base64 = await this.utils.fileToBase64(file);
      await this.uploadBase64Fragmented(base64, file.name);
    }
    catch (error: any) {
      await this.presentError('INACAP', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
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

        const response = await this.api.validarDocumento(params);

        if (response.success) {

          if (response.code == 202) {
            const progreso = Math.round(response.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (response.code == 200) {
            await loading.dismiss();

            debugger
            // this.items = response.data.items;
            // this.snackbar.showToast('Archivo cargado correctamente.', 3000, 'success');
          }
          else if (response.code == 404) {
            await loading.dismiss();

            debugger
            await this.presentError('INACAP', 'Certificado no válido.');
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
  async presentError(title: string, message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: title,
      buttons: ['Aceptar']
    });

    return alert;
  }

  get codigo() { return this.form.get('codigo'); }

}
