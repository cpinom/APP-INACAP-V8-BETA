import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, Platform } from '@ionic/angular';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { CertificadosService } from 'src/app/core/services/http/certificados.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { EventsService } from 'src/app/core/services/events.service';
import * as $ from 'jquery';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.page.html',
  styleUrls: ['./nueva-solicitud.page.scss'],
})
export class NuevaSolicitudPage implements OnInit {

  data: any;
  certificadoForm: FormGroup;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-]+$';
  mostrarResolucion = false;
  submitted = false;
  motivos = [
    { id: 1, label: 'Para los fines que estime conveniente' },
    { id: 2, label: 'Para ser presentado en Institución' }
  ];

  private formBuilder = inject(FormBuilder);
  private dialog = inject(DialogService);
  private api = inject(CertificadosService);
  private utils = inject(UtilsService);
  private router = inject(Router);
  private error = inject(ErrorHandlerService);
  private events = inject(EventsService);
  private action = inject(ActionSheetController);
  private pt = inject(Platform);
  private snackbar = inject(SnackbarService);

  constructor() {

    this.certificadoForm = this.formBuilder.group({
      ceppCcod: ['', Validators.required],
      resoTdetalle: ['']
    });

    this.tipo?.valueChanges.subscribe((value) => {
      if (value == 1) {
        this.detalle?.clearValidators();
        this.detalle?.setValue('');
        this.detalle?.updateValueAndValidity();
      }
      else {
        this.detalle?.setValidators(Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(this.patternStr)
        ]));
        this.detalle?.setValue('');
        this.detalle?.updateValueAndValidity();
      }
    });

    this.tipo?.setValue(1);

  }
  async ngOnInit() {
    this.data = this.router.getCurrentNavigation()?.extras.state;
    // this.data.cemeTtipo=0;

    if (!this.data) {
      await this.router.navigate([this.backUrl], { replaceUrl: true });
      return;
    }
  }
  async ionViewWillLeave() { }
  async solicitar() {
    this.submitted = true;

    if (this.certificadoForm.valid) {
      const params = Object.assign(this.certificadoForm.value, {
        tdetCcod: this.data.tdetCcod,
        espeCcod: this.data.espeCcod,
        planCcod: this.data.planCcod,
        acliNcorr: 0,
        periCcod: this.data.periCcod
      });
      let mensaje = 'El certificado solicitado no tiene costo. Quedará disponible para su descarga en la sección "Solicitados".';

      if (parseInt(this.data.tdetMonto) > 0) {
        mensaje = `El costo asociado al Certificado es de CLP $${this.data.tdetMonto}, el cual será cargado a su cuenta corriente y podrá pagarlo en el Portal de Pagos electrónico o en la caja de cualquier Sede de INACAP.`;
      }

      const confirmar = await this.confirmarSolicitud(mensaje);

      if (confirmar) {
        const loading = await this.dialog.showLoading({ message: 'Procesando solicitud...' });

        try {
          let result = await this.api.solicitarCertificado(params);
          this.data = Object.assign(this.data, result);
          this.mostrarResolucion = true;
          this.events.app.next({ action: 'app:certificados-recargar' });
        }
        catch (error: any) {
          await this.error.handle(error);
        }
        finally {
          await loading.dismiss();
        }
      }
    }
  }
  confirmarSolicitud(message: string): Promise<boolean> {

    return new Promise(async (resolve) => {

      const actionSheet = await this.action.create({
        cssClass: 'certificado-cls',
        header: 'Solicitud de Certificado',
        subHeader: message,
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            // cssClass: 'secondary',
            handler: () => resolve(false)
          }
        ]
      });

      await actionSheet.present();
    })

  }
  async descargar() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });
    const url = $(this.data.url).attr('name') || '';
    const mcerNcorr = this.utils.getUrlParams('mcer_ncorr', url);
    const tdetCcod = this.utils.getUrlParams('tdet_ccod', url);
    const codVerif = this.utils.getUrlParams('verif', url);
    const params = {
      mcerNcorr: mcerNcorr,
      tdetCcod: tdetCcod,
      codVerif: codVerif
    };

    try {
      const result = await this.api.descargarCertificado(params);
      const fileName = 'certificado_' + mcerNcorr + '.pdf';

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
        return;
      }

      await this.snackbar.showToast('El certificado no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  get tipo() { return this.certificadoForm.get('ceppCcod'); }
  get detalle() { return this.certificadoForm.get('resoTdetalle'); }
  get backUrl() { return this.router.url.replace('/nueva-solicitud', ''); }
}
