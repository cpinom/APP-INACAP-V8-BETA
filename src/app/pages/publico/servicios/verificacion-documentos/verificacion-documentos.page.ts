import { Component, ElementRef, OnInit, viewChild, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MediaService } from 'src/app/core/services/media.service';
import { PublicService } from 'src/app/core/services/http/public.service';
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
  @ViewChild('detalleMdl') detalleMdl!: IonModal;
  tipoCertificado!: TipoCertificado;
  form: FormGroup;
  certificadoValido: any;
  detalle: any;

  constructor(private fb: FormBuilder,
    private pt: Platform,
    private dialog: DialogService,
    private utils: UtilsService,
    private error: ErrorHandlerService,
    private api: PublicService,
    private media: MediaService) {

    this.form = this.fb.group({
      codigo: ['', Validators.compose([
        Validators.pattern(/^[A-Za-z0-9]+$/),
        Validators.required
      ])]
    });

    this.codigo?.valueChanges.subscribe((value) => {
      if (!value) {
        this.certificadoValido = null;
        this.detalle = null;
      }
    });

    if (this.pt.is('mobileweb')) {
      this.codigo?.setValue('4F7A62895DC969B2');
    }

  }
  ngOnInit() {

    /*if (this.pt.is('mobileweb')) {
      this.tipoCertificado = TipoCertificado.Otro;
      this.detalle = [
        "INGENIERÍA EN INFORMÁTICA",
        "455",
        "CONCENTRACION DE NOTAS PARA BECAS Y CREDITOS",
        "BENJAMIN ANTONIO AHUMADA FERNANDEZ",
        "19-11-2024",
        "INSTITUTO PROFESIONAL",
        "null",
        "21407160-6",
        "0",
        "null",
        "null",
        "",
        "null",
        "null"
      ]

      setTimeout(async () => {
        await this.detalleMdl.present();
      }, 1000);
    }*/

  }
  async validar() {
    if (this.form.valid) {
      const loading = await this.dialog.showLoading({ message: 'Validando...' });

      try {
        const response = await this.api.validarCodigoDocumento(this.codigo?.value);

        if (response.success) {
          await loading.dismiss();

          if (response.code == 200) {
            await this.procesarResultado(response.data);
          }
          else {
            await this.presentError('INACAP', 'No se pudo validar el certificado. Vuelve a intentarlo.');
          }
        }
        else {
          throw Error(response);
        }
      }
      catch (error: any) {
        await this.presentError('INACAP', 'El servicio no se encuentra disponible o presenta algunos problemas de cobertura, reintente en un momento.');
      }
      finally {
        await loading.dismiss();
      }

    }
  }
  async cargarDocumento(inputEl: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      const media = await this.media.getMedia();

      if (media) {
        const fileSize = media.size / 1024 / 1024;
        const base64String = media.data;

        if (fileSize >= 150) {
          this.presentError('INACAP', 'Los documentos no pueden exceder los 150 MB.');
          return;
        }

        try {
          await this.uploadBase64Fragmented(base64String, media.name);
        }
        catch (error: any) {
          await this.presentError('INACAP', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
        }
      }
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
            await this.procesarResultado(response.data.info);
          }
          else if (response.code == 404) {
            await loading.dismiss();
            await this.presentError('INACAP', 'Certificado no válido.');
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
  async procesarResultado(info: any) {
    if (info) {
      this.detalle = info;
      this.certificadoValido = true;

      const tdetCcod = this.detalle[1];

      if (tdetCcod != '559') {
        if (tdetCcod == "899" || tdetCcod == "593" || tdetCcod == "949" || tdetCcod == "952" || tdetCcod == "594") {
          this.tipoCertificado = TipoCertificado.Grado;
        }
        else {
          if (tdetCcod == "900" || tdetCcod == "570" || tdetCcod == "57") {
            this.tipoCertificado = TipoCertificado.Normal;
          }
          else {
            this.tipoCertificado = TipoCertificado.Otro;
          }
        }
      }
      else {
        this.tipoCertificado = TipoCertificado.Capacitacion;
      }

      await this.detalleMdl.present();
    }
    else {
      throw Error('No se pudo obtener información del certificado.');
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
  get codigoError() {
    if (this.codigo?.touched) {
      if (this.codigo?.hasError('required')) return 'Campo es obligatorio.';
      if (this.codigo?.hasError('pattern')) return 'Sólo puede ingresar caracteres alfanuméricos.';
    }

    return;
  }

}
