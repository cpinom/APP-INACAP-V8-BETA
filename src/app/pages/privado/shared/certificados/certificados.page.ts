import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonModal, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CertificadosService } from 'src/app/core/services/certificados.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { DetallePagoPage } from '../portal-pagos/detalle-pago/detalle-pago.page';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/core/services/profile.service';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import * as $ from 'jquery';
import { VISTAS_EXALUMNO } from 'src/app/core/constants/exalumno';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';

const EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.page.html',
  styleUrls: ['./certificados.page.scss'],
})
export class CertificadosPage implements OnInit {

  @ViewChild('periodos') periodosMdl?: IonModal;
  certificadosFiltrados: any;
  certificadosFiltro = '';
  certificados!: any[];
  disponibles!: any[];
  carreras!: any[];
  directos!: any[];
  historial!: any[];
  activeTab = 0;
  mostrarCargando = true;
  mostrarData = false;
  mostrarError = false;
  esExalumno!: number;
  detallePago: any;
  pagoExito!: boolean;
  carreraForm: FormGroup;
  periodo: any;
  reloadObs: Subscription;

  constructor(private auth: AuthService,
    private api: CertificadosService,
    private dialog: DialogService,
    private action: ActionSheetController,
    private snackbar: SnackbarService,
    private error: ErrorHandlerService,
    private utils: UtilsService,
    private router: Router,
    private pt: Platform,
    public routerOutlet: IonRouterOutlet,
    private nav: NavController,
    private fb: FormBuilder,
    private events: EventsService,
    private profile: ProfileService) {

    this.reloadObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:certificados-recargar') {
        this.mostrarData = false;
        this.recargar();
      }
    });

    this.carreraForm = this.fb.group({
      carrera: ['', Validators.required]
    });

    this.carrera?.valueChanges.subscribe(() => {
      this.cargarCertificados();
    });

  }
  async ngOnInit() {
    await this.cargarTodo();

    // Diferenciar marca si es exalumno
    if (this.esExalumno == 1) {
      this.api.marcarVista(VISTAS_EXALUMNO.CERTIFICADOS);
    }
    else {
      this.api.marcarVista(VISTAS_ALUMNO.CERTIFICADOS);
    }
  }
  async cargarTodo() {
    let auth = await this.auth.getAuth();

    if (auth.perfil) {
      this.esExalumno = auth.perfil == '/exalumno' ? 1 : 0
    }
    else {
      this.esExalumno = auth.user.esExalumno ? 1 : 0;
    }

    try {
      this.periodo = await this.resolverPeriodo();

      if (!this.periodo) {
        await this.nav.navigateBack(this.backUrl);
        return;
      }
      else {
        await this.api.setStorage('periodo', this.periodo);
      }

      await this.cargar();
    }
    catch {
      this.mostrarCargando = false;
      this.mostrarError = true;
    }
  }
  ngOnDestroy() {
    this.reloadObs.unsubscribe();
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
      const loading = await this.dialog.showLoading({ message: 'Espere...' });

      try {
        const result = await this.api.getPeriodos();

        if (result.success) {
          inputs = result.periodos.map((t: any) => {
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
      catch (error) {
        return Promise.reject();
      }
      finally {
        loading.dismiss();
      }
    }
    catch (error) {
      return Promise.resolve();
    }

    const alert = await this.dialog.showAlert({
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
    try {
      if (this.esExalumno) {
        const params = { exAlumno: this.esExalumno, periCcod: this.periodo };
        const result = await this.api.getPrincipalV3(params);

        this.carreras = result.carreras || [];
        this.directos = result.directos || [];
        this.disponibles = result.disponibles || [];
        this.historial = result.historial || [];

        let carrCcod = await this.api.getStorage('carrCcod');
        let carrera;

        if (carrCcod) {
          carrera = result.carreras.find((t: any) => t.carrCcod == carrCcod);
        }
        else {
          carrera = result.carreras[0];
        }

        if (carrera) {
          this.carrera?.setValue(carrera, { emitEvent: false });
          this.api.setStorage('carrCcod', carrera.carrCcod);
        }
      }
      else {
        const principal = await this.profile.getStorage('principal');
        let carrCcod = await this.api.getStorage('carrCcod');
        let programa = principal.programas[principal.programaIndex];

        if (carrCcod) {
          const programaIndex = principal.programas.findIndex((t: any) => t.carrCcod == carrCcod);

          if (programaIndex > -1) {
            programa = principal.programas[programaIndex];
          }
          else {
            carrCcod = undefined;
            this.api.removeStorage('carrCcod');
          }
        }

        const params = { planCcod: programa.planCcod, espeCcod: programa.espeCcod, exAlumno: this.esExalumno, periCcod: this.periodo };
        const result = await this.api.getPrincipalV4(params);
        let carrera;

        this.carreras = result.carreras || [];
        this.directos = result.directos || [];
        this.disponibles = result.disponibles || [];
        this.historial = result.historial || [];

        if (carrCcod) {
          carrera = result.carreras.find((t:any) => t.carrCcod == carrCcod);
        }
        else {
          carrera = result.carreras[0];
        }

        if (carrera) {
          this.carrera?.setValue(carrera, { emitEvent: false });
          this.api.setStorage('carrCcod', carrera.carrCcod);
        }
      }
    }
    catch (error) {
      this.error.handle(error, async () => {
        await this.nav.navigateBack(this.backUrl);
      });
    }
    finally {
      this.mostrarData = true;
      this.mostrarCargando = false;
    }
  }
  async recargarError() {
    this.mostrarCargando = true;
    this.mostrarError = false;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargarTodo();
    }, 500);
  }
  async recargar(e?: any) {
    let mostrarSnackbar = e && !e.target.complete;
    let snackbar = await this.snackbar.create('Cargando...', false, 'secondary');

    if (e) {
      const periodo = await this.resolverPeriodo(true);

      if (periodo) {
        this.periodo = periodo;
      }
      else {
        if (!mostrarSnackbar) e.target.complete();
        return;
      }
    }
    if (mostrarSnackbar) {
      await snackbar.present();
    }

    try {
      await this.cargar()
    }
    finally {
      if (!mostrarSnackbar) e.target.complete();
      else await snackbar.dismiss();
    }
  }
  async cargarCertificados() {
    this.mostrarData = false;

    try {
      const carrera = this.carrera?.value;
      const params = { exAlumno: this.esExalumno, planCcod: carrera.planCcod, espeCcod: carrera.espeCcod, periCcod: this.periodo };
      const result = await this.api.getCertificados(params);

      this.directos = result.directos;
      this.disponibles = result.disponibles;
      this.api.setStorage('carrCcod', carrera.carrCcod);
    }
    catch (error) {
      this.error.handle(error);
    }
    finally {
      this.mostrarData = true;
    }
  }
  async solicitar(certificado:any) {
    let carrera = this.carrera?.value;
    let data = Object.assign(certificado, {
      espeCcod: carrera.espeCcod,
      planCcod: carrera.planCcod,
      periCcod: this.periodo
    });

    await this.nav.navigateForward(`${this.router.url}/nueva-solicitud`, { state: data })

  }
  async detalleCertificado(data: any) {
    if (!data['accion']) {
      const loading = await this.dialog.showLoading({ message: 'Cargando...' });
      const params = { resoNcorr: data.resoNcorr };

      try {
        data['accion'] = await this.api.getDetalleCertificado(params);
      }
      catch (error) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }

    const accion = data['accion'];

    if (accion) {
      const buttons = [];
      const url = $(accion.link).attr('name');

      if (url) {
        buttons.push({
          text: 'Descargar',
          handler: () => {
            this.descargar(url, data.tdetCcod);
          }
        });
        buttons.push({
          text: 'Enviar por Correo',
          handler: () => {
            this.correo(url, data.tdetCcod);
          }
        });
      }

      if (/*accion.link &&*/ accion.desabilita != 1) {
        buttons.push({
          text: 'Eliminar',
          handler: () => {
            this.eliminar(data.resoNcorr);
          }
        });
      }

      if (buttons.length) {

        buttons.push({
          text: 'Salir',
          role: 'destructive'
        });

        const actionSheet = await this.action.create({
          header: 'Estado de Pago: ' + accion.estadoPago,
          buttons: buttons
        });

        await actionSheet.present();

      }
      else {
        this.snackbar.showToast('Certificado no disponible.');
      }
    }
  }
  filtrarCertificados() {
    this.certificadosFiltrados = this.certificados.filter(element => {
      return element.tdetTdesc.toLowerCase().indexOf(this.certificadosFiltro.toLowerCase()) > -1;
    });
  }
  resetCertificados() {
    this.certificadosFiltro = '';
    this.certificadosFiltrados = this.certificados;
  }
  async mostrarDetallePago(detallePago: any, pagoExito: boolean) {
    const modal = await this.dialog.showModal({
      component: DetallePagoPage,
      handle: false,
      componentProps: {
        pagoExito: pagoExito,
        data: detallePago
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    const modalResult = await modal.onWillDismiss();

    if (modalResult.data) {
      this.mostrarData = false;
      this.recargar();
    }
  }
  async descargar(url: string, tdetCcod: string) {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });
    const mcerNcorr = this.utils.getUrlParams('mcer_ncorr', url);
    const codVerif = this.utils.getUrlParams('verif', url);

    try {
      const result = await this.api.descargarCertificadoV5(mcerNcorr, tdetCcod, codVerif);
      const fileName = `certificado_${mcerNcorr}.pdf`;

      if (result.success) {
        const { data } = result;

        if (this.pt.is('mobileweb')) {
          const linkSource = `data:application/pdf;base64,${data.base64}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
        else {
          const file = await Filesystem.writeFile({
            path: fileName,
            data: data.base64,
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
    catch (error:any) {
      if (error&&error.status == 401) {
        this.error.handle(error);
        return;
      }

      this.snackbar.showToast('El certificado no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }

  }
  async correo(url: string, tdetCcod: string) {
    const correo = await this.confimarCorreo();

    if (correo) {
      const loading = await this.dialog.showLoading({ message: 'Procesando...' });
      const params = { mcerNcorr: this.utils.getUrlParams('mcer_ncorr', url), tdetCcod: tdetCcod, codVerif: this.utils.getUrlParams('verif', url), correo: correo };

      try {
        await this.api.enviarCorreo(params);
        this.snackbar.showToast('Su solicitud está siendo procesada. En breve llegará el certificado al correo indicado.', 3000, 'success');
      }
      catch (error) {
        this.error.handle(error);
      }
      finally {
        loading.dismiss();
      }
    }
  }
  async eliminar(resoNcorr:any) {
    const confirmar = await this.confirmarEliminar();

    if (confirmar) {
      const loading = await this.dialog.showLoading({ message: 'Procesando...' });
      const params = { resoNcorr: resoNcorr };

      await loading.present();

      try {
        this.historial = await this.api.eliminarCertificado(params);
        this.snackbar.showToast('El certificado solicitado ha sido eliminado correctamente.', 3000, 'success');
      }
      catch (error) {
        this.error.handle(error);
      }
      finally {
        loading.dismiss();
      }

    }
  }
  confirmarEliminar(): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.dialog.showAlert({
        header: 'Eliminar Solicitud',
        message: '¿Esta seguro que desea eliminar la solicitud seleccionada?',
        cssClass: 'danger',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => resolve(false)
          },
          {
            text: 'Continuar',
            handler: () => resolve(true)
          }
        ]
      })
    })
  }
  confimarCorreo(): Promise<string> {
    return new Promise(async (resolve) => {
      await this.dialog.showAlert({
        header: 'Enviar por correo',
        inputs: [
          {
            name: 'correo',
            type: 'email',
            placeholder: 'Correo destinatario'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Enviar',
            handler: (item) => {
              let msgError = '';
              if (item.correo.length === 0) {
                msgError = 'Debe ingresar un correo';
              }
              else if (!(EMAIL_REGEXP.test(item.correo))) {
                msgError = 'Debe ingresar un correo válido';
              }
              if (msgError.length > 0) {
                this.snackbar.showToast(msgError);
                return false;
              }

              resolve(item.correo);
              return true;
            }
          }
        ]
      })
    })
  }
  get mostrarCarreras() { return this.carreras && this.carreras.length > 1; }
  get carrera() { return this.carreraForm.get('carrera'); }
  get backUrl() { return this.router.url.replace('/certificados', ''); }

}

