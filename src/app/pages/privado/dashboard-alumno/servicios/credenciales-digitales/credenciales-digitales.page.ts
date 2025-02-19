import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
// import { Share } from '@capacitor/share';
import { ActionSheetController, AlertController, IonModal, LoadingController, NavController, Platform } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { CertificadosService } from 'src/app/core/services/certificados.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import * as $ from 'jquery';
import { FileOpener } from '@capacitor-community/file-opener';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-credenciales-digitales',
  templateUrl: './credenciales-digitales.page.html',
  styleUrls: ['./credenciales-digitales.page.scss'],
})
export class CredencialesDigitalesPage implements OnInit {

  carreraForm: FormGroup;
  carreras: any;
  certificados: any;
  certificado: any;
  mostrarCargando = true;
  mostrarError = false;
  periodos: any;
  periodo: any;
  programa: any;

  constructor(private profile: ProfileService,
    private fb: FormBuilder,
    private error: ErrorHandlerService,
    private router: Router,
    private api: CertificadosService,
    private loading: LoadingController,
    private pt: Platform,
    private alert: AlertController,
    private nav: NavController,
    private action: ActionSheetController,
    private utils: UtilsService,
    private dialog: DialogService) {

    this.carreraForm = this.fb.group({
      carrera: ['', Validators.required]
    });

    this.carrera.valueChanges.subscribe(() => {
      this.cargarCertificados();
    });

  }
  async ngOnInit() {
    this.cargar();
    this.api.marcarVista(VISTAS_ALUMNO.CREDENCIALES);
  }
  async resolverPeriodo(force?: boolean) {
    let periodo = await this.api.getStorage('periodo');

    if (!(force === true)) {
      if (periodo) {
        return Promise.resolve(periodo);
      }
    }

    let inputs = [];

    try {
      let loading = await this.loading.create({ message: 'Espere...' });

      await loading.present();

      try {
        let result = await this.api.getPeriodos();

        if (result.success) {
          inputs = result.periodos.map(t => {
            return {
              value: t.periCcod,
              label: t.periTdesc,
              type: 'radio',
              checked: t.periCcod == periodo
            }
          })
        }
        else {
          return Promise.resolve();
        }
      }
      catch (error: any) {
        return Promise.reject();
        // this.error.handle(error, async () => {
        //   await this.nav.navigateBack(this.backUrl);
        // });
      }
      finally {
        loading.dismiss();
      }
    }
    catch (error: any) {
      return Promise.resolve();
    }

    let alert = await this.alert.create({
      backdropDismiss: false,
      keyboardClose: false,
      header: 'Seleccione el período académico',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          role: 'destructive'
        }
      ],
      inputs: inputs,
    });

    await alert.present();

    const periodoResult = await alert.onWillDismiss();

    if (periodoResult.role == 'destructive') {
      if (periodoResult.data && periodoResult.data.values) {
        await this.api.setStorage('periodo', periodoResult.data.values);
        return Promise.resolve(periodoResult.data.values);
      }
    }

    return Promise.resolve();
  }
  async cargar() {
    const periodo = await this.resolverPeriodo();

    if (periodo) {
      this.periodo = periodo;
      this.api.setStorage('periodo', periodo);
    }
    else {
      this.error.handle();
      this.nav.navigateBack(this.backUrl);
      return;
    }

    let carrCcod = await this.api.getStorage('carrCcod');
    let principal = await this.profile.getStorage('principal');
    let programa = principal.programas[principal.programaIndex];

    if (carrCcod) {
      let programaIndex = principal.programas.findIndex(t => t.carrCcod == carrCcod);

      if (programaIndex > -1) {
        programa = principal.programas[programaIndex];
      }
      else {
        carrCcod = undefined;
        this.api.removeStorage('carrCcod');
      }
    }

    try {
      let carrera;
      let params = {
        planCcod: programa.planCcod,
        espeCcod: programa.espeCcod,
        exAlumno: 0,
        periCcod: this.periodo
      };
      let result = await this.api.getPrincipalV4(params);
      let intermedios = result.disponibles.find(t => t.title.toUpperCase() == 'CERTIFICADOS INTERMEDIOS');

      if (intermedios) {
        this.certificados = intermedios.children;
      }
      else {
        this.certificados = [];
      }

      this.carreras = result.carreras;

      if (carrCcod) {
        carrera = result.carreras.find(t => t.carrCcod == carrCcod);
      }
      else {
        carrera = result.carreras[0];
      }

      if (carrera) {
        this.carrera.setValue(carrera, { emitEvent: false });
        this.api.setStorage('carrCcod', carrera.carrCcod);
      }
    }
    catch (error: any) {
      this.mostrarError = true;
    }
    finally {
      this.mostrarCargando = false;
    }
  }
  async cargarCertificados() {
    this.mostrarCargando = true;
    this.certificados = [];

    try {
      let carrera = this.carrera.value;
      let params = { exAlumno: 0, planCcod: carrera.planCcod, espeCcod: carrera.espeCcod, periCcod: this.periodo };
      let result = await this.api.getCertificados(params);

      let intermedios = result.disponibles.find(t => t.title.toUpperCase() == 'CERTIFICADOS INTERMEDIOS');

      if (intermedios) {
        this.certificados = intermedios.children;
      }
      else {
        this.certificados = [];
      }

      this.api.setStorage('carrCcod', carrera.carrCcod);
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      this.mostrarCargando = false;
    }
  }
  async recargar() {
    const periodo = await this.resolverPeriodo(true);

    if (periodo) {
      this.periodo = periodo;
    }
    else {
      return;
    }

    this.cargarCertificados();
  }
  async solicitar(certificado: any) {
    const actionSheet = await this.action.create({
      header: 'Certificado Intermedio',
      buttons: [
        {
          text: 'Compartir',
          handler: () => {
            this.generar(certificado);
          }
        },
        {
          text: 'Salir',
          role: 'destructive'
        }
      ]
    });

    await actionSheet.present();
  }
  async generar(certificado: any) {
    let carrera = this.carrera.value;
    let params = {
      tdetCcod: certificado.tdetCcod,
      ticeCcod: certificado.ticeCcod,
      espeCcod: carrera.espeCcod,
      planCcod: carrera.planCcod,
      acliNcorr: 0,
      periCcod: this.periodo,
      ceppCcod: '1',
      resoTdetalle: ''
    };


    const loading = await this.loading.create({ message: 'Preparando Certificado...' });

    await loading.present();

    try {
      let result = await this.api.solicitarCertificadoV4(params);

      if (result.success) {
        const cemeTtipo = result.cemeTtipo;

        if (cemeTtipo == 1) {
          loading.dismiss();
          this.descargarPdf(result.url);
        }
        else {
          this.error.handle('No fue posible solicitar tu Certificado. Es posible que estés tratando de solicitar un certificado para un período en el cual no estuviste matriculado.')
        }
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async descargarPdf(pdf: string) {
    let loading = await this.loading.create({ message: 'Descargando...' });
    let url = $(pdf).attr('name');
    let mcerNcorr = this.utils.getUrlParams('mcer_ncorr', url);
    let tdetCcod = this.utils.getUrlParams('tdet_ccod', url);
    let codVerif = this.utils.getUrlParams('verif', url);
    let params = {
      mcerNcorr: mcerNcorr,
      tdetCcod: tdetCcod,
      codVerif: codVerif
    };

    await loading.present();

    try {
      let result = await this.api.descargarCertificado(params);
      let fileName = 'certificado_' + mcerNcorr + '.pdf';

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
          // const file = await Filesystem.writeFile({
          //   path: fileName,
          //   data: result.data,
          //   directory: Directory.Cache
          // });

          // Share.share({
          //   url: file.uri,
          //   dialogTitle: 'Certificado Intermedio',
          // });
        }
        this.api.marcarVista(VISTAS_ALUMNO.COMPARTE_CREDENCIALES)
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
      }

      await this.dialog.showAlert({
        cssClass: 'warning-alert',
        header: 'Certificado Intermedio',
        message: `<div class="image"><img src="./assets/images/warning.svg" /><br />El certificado no se encuentra disponible.</div>`,
        buttons: ['Aceptar']
      });

      // this.error.alert('Certificado Intermedio', 'El certificado no se encuentra disponible.')
    }
    finally {
      await loading.dismiss();
    }
  }
  get backUrl() { return this.router.url.replace('/credenciales-digitales', ''); }
  get carrera() { return this.carreraForm.get('carrera'); }

}
