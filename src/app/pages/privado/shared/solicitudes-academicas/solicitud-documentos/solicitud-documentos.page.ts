import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonModal, IonPopover, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { SolicitudesService } from 'src/app/core/services/http/solicitudes.service';
import { MediaService } from 'src/app/core/services/media.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

export enum SOLICITUD {
  JUSTIFICACION_INASISTENCIA = 1,
  CONVALIDACION_PRACTICA_LABORAL = 4,
  INTERRUPCION_ESTUDIOS = 9,
  CONVALIDACION_ASIGNATURAS = 14,
  ESTUDIANTE_TRABAJADOR = 19,
  ESTUDIANTE_HIJOS_MENOR = 29,
  ANULACION_CONTRATO = 35,
  CONVALIDACION_ASIGNATURAS_EST_TP = 50
};

@Component({
  selector: 'app-solicitud-documentos',
  templateUrl: './solicitud-documentos.page.html',
  styleUrls: ['./solicitud-documentos.page.scss'],
})
export class SolicitudDocumentosPage implements OnInit {

  @ViewChild('datePicker') datePicker!: IonPopover;
  solicitud: any;
  data: any;
  showMore!: boolean;
  presentingElement: HTMLElement | null = null;
  causalSel: any;
  tiposDocumentos: any;
  tipoDocumento: any;
  deshabilitaEnviar = false;
  archivos: any[] = [];
  viaConvalidacionSel: any;
  solicitudForm!: FormGroup;
  submitted = false;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-]+$';
  terminos = false;
  detalleSolicitud: any;
  fechaMaxima: string = moment().format('YYYY-MM-DD');
  justificacionCausales = false;
  documentosCausales = [];

  private router = inject(Router);
  private nav = inject(NavController);
  private api = inject(SolicitudesService);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);
  private routerOutlet = inject(IonRouterOutlet);
  private pt = inject(Platform);
  private error = inject(ErrorHandlerService);
  private fb = inject(FormBuilder);
  private action = inject(ActionSheetController);
  private events = inject(EventsService);
  private media = inject(MediaService);

  constructor() {
    this.solicitud = this.router.getCurrentNavigation()?.extras.state;
  }
  async ngOnInit() {
    if (!this.solicitud) {
      await this.nav.navigateBack(this.backUrl);
      return;
    }

    await this.cargar();
  }
  async cargar() {
    let loading = await this.dialog.showLoading({ message: 'Cargando...' });
    let params = { planCcod: this.solicitud.planCcod, tisoCcod: this.solicitud.tisoCcod };

    try {
      let result = await this.api.getDatosSolicitud(params);

      if (result.success) {
        if (this.solicitud.tisoCcod == SOLICITUD.JUSTIFICACION_INASISTENCIA) {
          result.data.evaluaciones = (result.data.evaluaciones as any[]).sort((a, b) => {
            return (parseInt(a.caliNcorr) < parseInt(b.caliNcorr)) ? -1 : 1;
          });
        }

        this.data = result.data;
        this.data.glosa = result.glosa;
        this.data.titulo = this.solicitud.tisoTdesc;
        await this.setupForm();
      }
      else {
        await loading.dismiss();
        await this.presentError(result.message, true);
      }
    }
    catch (error: any) {
      this.error.handle(error, async () => {
        if (error.status != 401) {
          await this.nav.navigateBack(this.backUrl);
        }
      })
    }
    finally {
      await loading.dismiss();
    }

    this.presentingElement = this.routerOutlet.nativeEl;
  }
  async presentError(msg: string, returnBack?: boolean) {
    let message;

    if (!msg) {
      message = 'Se produjo un problema cargando estos datos.';
    }

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Solicitudes',
      message: msg ? msg : message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'ok',
          handler: async () => {
            if (returnBack == true) {
              await this.nav.navigateBack(this.backUrl);
            }
          }
        }
      ]
    });
  }
  async setupForm() {

    if (this.solicitud.tisoCcod == SOLICITUD.JUSTIFICACION_INASISTENCIA) {

      this.tiposDocumentos = this.data.tipos;
      this.solicitudForm = this.fb.group({
        evaluaciones: new FormArray([]),
        motivo: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(1000)
        ])]
      });

      this.data.evaluaciones.forEach((item: any) => {
        this.evaluaciones.push(new FormControl(false))
      });
    }
    else if (this.solicitud.tisoCcod == 4) {
      this.tiposDocumentos = this.data.tipos;
    }
    else if (this.solicitud.tisoCcod == 9) {
      this.solicitudForm = this.fb.group({
        causalInterrupcion: ['', Validators.required]
      });
    }
    else if (this.solicitud.tisoCcod == 14) {
      this.solicitudForm = this.fb.group({
        viaConvalidacion: ['', Validators.required],
        organismoAutorizado: [],
        otroOrganismo: ['']
      });

      this.viaConvalidacion?.valueChanges.subscribe((via) => {
        if (via.tieneOrganizacion == 'SI') {
          this.organismoAutorizado?.clearValidators();
          this.organismoAutorizado?.setValidators([Validators.required]);
        }
        else {
          this.organismoAutorizado?.clearValidators();
        }
        // this.organismoAutorizado.setValue('');
        this.organismoAutorizado?.updateValueAndValidity();
      })

      this.organismoAutorizado?.valueChanges.subscribe((orgaCcod) => {
        if (orgaCcod == 0) {
          this.otroOrganismo?.clearValidators();
          this.otroOrganismo?.setValidators([Validators.required, Validators.maxLength(100), Validators.pattern(this.patternStr)]);
        }
        else {
          this.otroOrganismo?.clearValidators();
        }
        // this.otroOrganismo.setValue('');
        this.otroOrganismo?.updateValueAndValidity();
      })
    }
    else if (this.solicitud.tisoCcod == 19) {
      this.solicitudForm = this.fb.group({
        tipoTrabajador: ['', Validators.required]
      });

      this.tipoTrabajador?.valueChanges.subscribe(() => {
        this.tipoTrabajadorChange();
      })
    }
    else if (this.solicitud.tisoCcod == SOLICITUD.ESTUDIANTE_HIJOS_MENOR) {
      this.tiposDocumentos = this.data.tipos;
      this.solicitudForm = this.fb.group({
        nacimiento: [moment().format('DD/MM/YYYY'), Validators.compose([
          Validators.required,
          Validators.pattern(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/)
        ])],
        nacimientoPicker: [this.fechaMaxima]
      });

      this.nacimiento?.valueChanges.subscribe((value) => {
        if (!value) {
          this.solicitudForm.get('nacimientoPicker')?.setValue('', { emitEvent: false });
        }
      })

      this.solicitudForm.get('nacimientoPicker')?.valueChanges.subscribe((date) => {
        const value = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
        this.nacimiento?.setValue(value);
        this.datePicker && this.datePicker.dismiss();
      })
    }
    else if (this.solicitud.tisoCcod == SOLICITUD.ANULACION_CONTRATO) {
      this.tiposDocumentos = [];
      this.solicitudForm = this.fb.group({
        motivo: []
      })
    }
    else if (this.solicitud.tisoCcod == 50) {
      this.tiposDocumentos = this.data.tipos;
      this.solicitudForm = this.fb.group({
        colegio: ['', Validators.required]
      });
    }

  }
  async procesar(modal: IonModal) {
    this.submitted = true;

    let params: any = {
      tisoCcod: this.solicitud.tisoCcod,
      planCcod: this.solicitud.planCcod
    };
    let mensajeSolicitud = '';

    if (this.solicitud.tisoCcod == SOLICITUD.JUSTIFICACION_INASISTENCIA) {
      params['ttraCcod'] = 0;
    }
    else if (this.solicitud.tisoCcod == 9) {
      if (!this.solicitudForm.valid) {
        return;
      }

      params['ttraCcod'] = this.causalInterrupcion?.value.tcieCcod;
    }
    else if (this.solicitud.tisoCcod == 14) {
      if (!this.solicitudForm.valid) {
        return;
      }

      params['ttraCcod'] = this.viaConvalidacion?.value.viasCcod;
    }
    else if (this.solicitud.tisoCcod == 19) {
      if (!this.solicitudForm.valid) {
        return;
      }
      params['ttraCcod'] = this.tipoTrabajador?.value;
    }
    else if (this.solicitud.tisoCcod == SOLICITUD.ESTUDIANTE_HIJOS_MENOR) {
      if (!this.solicitudForm.valid) {
        return;
      }
      params['ttraCcod'] = 0;
    }
    else if (this.solicitud.tisoCcod == SOLICITUD.ANULACION_CONTRATO) {
      let marcaCausales = this.data.causales.filter((t: any) => t.checked == true).length > 0;
      let archivosObligatorios = 0;

      if (!marcaCausales) {
        this.presentError('Debe seleccionar al menos una causa.');
        return;
      }

      this.tiposDocumentos.forEach((doc: any) => {
        if (doc.obliAlumno == 1 && doc.archivos.length == 0) {
          archivosObligatorios++;
        }
      })

      if (archivosObligatorios > 0) {
        this.presentError('Debe adjuntar por lo menos uno de los documentos requeridos.');
        return;
      }
    }
    else if (this.solicitud.tisoCcod == 50) {
      if (!this.solicitudForm.valid) {
        return;
      }
      params['ttraCcod'] = 0;
    }
    else {
      params['ttraCcod'] = 0;
    }

    if (this.solicitud.tisoCcod != SOLICITUD.ANULACION_CONTRATO) {
      this.deshabilitaEnviar = true;

      try {
        let result = await this.api.validarDocumentosObligatorios(params);

        if (result.success) {
          if (result.message == 'SI') {
            this.presentError('Debe adjuntar los documentos marcados como obligatorios (*).');
            return;
          }
        }
      }
      catch {
        this.presentError('No fue posible continuar con la solicitud.');
        return;
      }
      finally {
        this.deshabilitaEnviar = false;
      }
    }

    let validarTerminos = this.totalArchivos > 0;

    if (this.tiposDocumentos.length && this.totalArchivos == 0) {
      mensajeSolicitud = 'Para que tu solicitud sea procesada, recuerda que debes presentar en Oficina Curricular de tu sede un documento fidedigno que la respalde, dentro del plazo establecido en el Reglamento Académico o será rechazada. \n\n¿Deseas realizar esta solicitud sin documento adjunto?';
    }

    if (validarTerminos && !this.terminos) {
      return;
    }

    if (this.solicitud.tisoCcod == SOLICITUD.JUSTIFICACION_INASISTENCIA) {
      if (!this.solicitudForm.valid) {
        return;
      }

      let evaluaciones: any[] = [];

      this.evaluaciones.value.forEach((evaluacion: boolean, i: string | number) => {
        if (evaluacion == true) {
          evaluaciones.push(this.data.evaluaciones[i].caliNcorr);
        }
      });

      if (evaluaciones.length == 0) {
        return;
      }

      params['evaluaciones'] = evaluaciones;
      params['motivo'] = this.motivo?.value;
      params['entregaJustificacion'] = '0';
    }
    else if (this.solicitud.tisoCcod == 4) {
      params['entregaContratoTrabajo'] = '0'; //OC9849
      params['entregaCertificadoAFP'] = '0'; //OC9849
      params['entregaCertificadoEmpresa'] = '0'; //OC9849
      params['entregaBoletasHonorarios'] = '0'; //OC9849
      delete params['ttraCcod'];
    }
    else if (this.solicitud.tisoCcod == 9) {
      params['tcieCcod'] = this.causalInterrupcion?.value.tcieCcod;
      params['documentos'] = [this.tiposDocumentos[0].camsTid];
      params['documentosAdjuntos'] = this.totalArchivos;
      delete params['ttraCcod'];
    }
    else if (this.solicitud.tisoCcod == 14) {
      let viasSeleccionada = this.viaConvalidacion?.value;

      params['viasCcod'] = viasSeleccionada.viasCcod;
      params['validaTieneOrg'] = viasSeleccionada.tieneOrganizacion;
      params['orgaCcod'] = this.organismoAutorizado?.value;
      params['orgaOtro'] = this.otroOrganismo?.value;
      delete params['ttraCcod'];

      if (viasSeleccionada.viasCcod == 1) {
        params['certificadoNotas'] = '0';
        params['programaEstudio'] = '0';
        params['contenidoPe'] = '0';
      }
      else if (viasSeleccionada.viasCcod == 2) {
        params['certificadoNotas'] = '0';
        params['contenidoPe'] = '0';
      }
      else if (viasSeleccionada.viasCcod == 3) {
        params['certificadoNotas'] = '0';
        params['programaEstudio'] = '0';
        params['contenidoPe'] = '0';
      }
      else if (viasSeleccionada.viasCcod == 4) {
        params['certificadoOrganismo'] = '0';
        params['catalogoCompetencias'] = '0';
      }
      else if (viasSeleccionada.viasCcod == 5) {
        params['certificadoNotas'] = '0';
        params['programaEstudio'] = '0';
        params['contenidoPe'] = '0';
      }
      else if (viasSeleccionada.viasCcod == 6) {
        params['certificadoTitulo'] = '0';
        params['mallaCurricular'] = '0';
        params['perfilEgreso'] = '0';
        params['certificadoNotas'] = '0';
        params['otrosDocumentosConv'] = '0';
      }
    }
    else if (this.solicitud.tisoCcod == 19) {
      params['entregaAFP'] = '0';
      params['entregaContrato'] = '0';
      params['entregaCertificado'] = '0';
      params['entregaDeclaracion'] = '0';
    }
    else if (this.solicitud.tisoCcod == SOLICITUD.ESTUDIANTE_HIJOS_MENOR) {
      params['fechaNacimiento'] = this.nacimiento?.value;
      params['entregaCertificado'] = '0';
    }
    else if (this.solicitud.tisoCcod == SOLICITUD.ANULACION_CONTRATO) {
      let causales: any[] = [];
      let documentos: any[] = [];

      params['causales_otros'] = this.justificacionCausales ? this.motivo?.value : '';

      this.data.causales.forEach((causal: any) => {
        if (causal.checked == true) {
          causales.push(causal.tacoCcod);

          let dependencia = this.data.dependencias.find((t: any) => t.tacoCcod == causal.tacoCcod);

          if (dependencia) {
            documentos.push(dependencia.camsTid);
          }
        }
      });

      params['causales'] = causales.join(',');
      params['documentos'] = documentos;
    }
    else if (this.solicitud.tisoCcod == 50) {
      params['certNotasC'] = 0;
      params['certEgresoLEM'] = 0;
    }

    let confirm = await this.confirmarEnvio(mensajeSolicitud);

    if (!confirm) {
      return;
    }

    let loading = await this.dialog.showLoading({ message: 'Procesando...' });
    let message = '';
    let mostrarExito = false;

    try {
      let result = await this.api.procesarSolicitud(params);

      if (result.success) {
        mostrarExito = true;
        message = result.html || '<span>La solicitud ha sido ingresada correctamente.</span>';

        // if (this.data && this.data.archivos && this.data.archivos.length) {
        //   this.data.archivos = [];
        // }
      }
      else {
        message = result.message
      }
    }
    catch (error: any) {
      this.error.handle(error);
      return
    }
    finally {
      await loading.dismiss();
    }

    if (mostrarExito) {
      this.detalleSolicitud = message;
      this.events.app.next({ action: 'app:solicitudes-academicas-inicio' })

      await modal.present();
      await modal.onDidDismiss();
      await this.nav.navigateBack(this.backUrl);
    }
    else {
      this.error.handle(message);
    }
  }
  onDetalleDismiss(e?: any) {
    this.events.app.next({ action: 'app:modal-dismiss' });
  }
  async adjuntarArchivo(inputEl: any, data: any) {
    this.tipoDocumento = data;

    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      let file = await this.media.getMedia();

      if (file) {
        let fileSize = file.size / 1024 / 1024;

        if (fileSize <= 3) {
          let loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });

          try {
            const params = { tisoCcod: this.solicitud.tisoCcod, stiaNcorr: this.tipoDocumento.stiaNcorr };
            const response: any = await this.api.agregarArchivo(file.path, file.name, params);
            const result = response.data;

            if (result.success == false) {
              await this.presentError(result.message);
              return;
            }

            this.tipoDocumento.archivos = result.data.filter((t: any) => t.stiaNcorr == this.tipoDocumento.stiaNcorr);
            this.resolverTerminos();
          }
          catch (error: any) {
            this.presentError('No fue posible cargar el archivo.');
          }
          finally {
            await loading.dismiss();
          }
        }
        else {
          this.presentError('El archivo no pueden exceder los 3 MB.');
        }
      }
    }
  }
  async adjuntarArchivoWeb(event: any) {
    if (event.target.files.length > 0) {
      let formData = new FormData();
      let file = event.target.files[0];
      var fileSize = file.size / 1024 / 1024;

      if (fileSize <= 3) {
        let loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });
        formData.append('file', file);

        try {
          let params = { tisoCcod: this.solicitud.tisoCcod, stiaNcorr: this.tipoDocumento.stiaNcorr };
          let result = await this.api.agregarArchivoWeb(formData, params);

          if (result.success == false) {
            await this.presentError(result.message);
            return;
          }

          this.tipoDocumento.archivos = result.data.filter((t: any) => t.stiaNcorr == this.tipoDocumento.stiaNcorr);
          this.resolverTerminos();
        }
        catch (error: any) {
          this.presentError('No fue posible cargar el archivo.');
        }
        finally {
          await loading.dismiss();
        }
      }
      else {
        this.presentError('El archivo no puede exceder los 3 MB.');
      }
    }
  }
  async eliminarArchivo(data: any, soarNcorr: any) {
    this.tipoDocumento = data;
    let loading = await this.dialog.showLoading({ message: 'Eliminando archivo...' });

    try {
      let params = { soarNcorr: soarNcorr, tisoCcod: this.solicitud.tisoCcod, stiaNcorr: data.stiaNcorr };
      let response = await this.api.eliminarArchivo(params);

      if (response.success) {
        this.tipoDocumento.archivos = response.data;
        this.resolverTerminos();
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async mostrarCausales(modal: IonModal) {
    if (this.causalInterrupcion?.value) {
      this.causalSel = this.causalInterrupcion?.value;
    }
    await modal.present();
  }
  async guardarCausal(modal: IonModal) {
    modal.dismiss();

    if (this.causalSel) {
      this.causalInterrupcion?.setValue(this.causalSel);

      let snackbar = await this.snackbar.create('Cargando...', false, 'secondary');
      let params = { tisoCcod: this.solicitud.tisoCcod, identCcod: this.causalInterrupcion?.value.tcieCcod };

      await snackbar.present();

      try {
        let result = await this.api.getTiposDocumentos(params);

        if (result.success) {
          this.tiposDocumentos = result.tipos;
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

        this.presentError('No fue posible completar la solicitud.');
      }
      finally {
        await snackbar.dismiss();
      }
    }
  }
  onCausalesDismiss(e?: any) {
    this.events.app.next({ action: 'app:modal-dismiss' });
  }
  async tipoTrabajadorChange() {
    if (this.tipoTrabajador?.valid) {
      let snackbar = await this.snackbar.create('Cargando...', false, 'secondary');
      let params = { tisoCcod: this.solicitud.tisoCcod, identCcod: this.tipoTrabajador.value };

      this.deshabilitaEnviar = true;
      await snackbar.present();

      try {
        let result = await this.api.getTiposDocumentos(params);

        if (result.success) {
          this.tiposDocumentos = result.tipos;
        }
      }
      catch { }
      finally {
        this.deshabilitaEnviar = false;
        await snackbar.dismiss();
      }
    }
  }
  async mostrarVias(modal: IonModal) {
    if (this.viaConvalidacion?.value) {
      this.viaConvalidacionSel = this.viaConvalidacion.value
    }
    await modal.present();
  }
  async guardarVia(modal: IonModal) {
    await modal.dismiss();

    if (this.viaConvalidacionSel) {
      this.viaConvalidacion?.setValue(this.viaConvalidacionSel);

      let snackbar = await this.snackbar.create('Cargando...', false, 'secondary');
      let params = { tisoCcod: this.solicitud.tisoCcod, identCcod: this.viaConvalidacion?.value.viasCcod };

      this.deshabilitaEnviar = true;
      await snackbar.present();

      try {
        let result = await this.api.getTiposDocumentos(params);

        if (result.success) {
          this.tiposDocumentos = result.tipos;
          this.resolverTerminos();
        }
      }
      catch { }
      finally {
        this.deshabilitaEnviar = false;
        await snackbar.dismiss();
      }
    }
  }
  onViasDismiss(e?: any) {
    this.events.app.next({ action: 'app:modal-dismiss' });
  }
  async organismoAutorizadoChange() {
  }
  async causalChange(data: any) {
    if (data.tacoCcod == 7) {
      let control = this.motivo;
      if (data.checked) {
        control?.setValidators(Validators.required);
        control?.updateValueAndValidity();
      }
      else {
        control?.clearValidators();
        control?.setValue('');
        control?.updateValueAndValidity();
      }

      this.justificacionCausales = data.checked;
    }

    let tiposDocumentosCopy = Object.assign([], this.tiposDocumentos);
    let causales = this.data.causales.filter((t: any) => t.checked == true);

    this.tiposDocumentos = [];

    if (causales.length) {
      causales.forEach((causal: any) => {
        let documentoPrevio = tiposDocumentosCopy.find((t: any) => t.tacoCcod == causal.tacoCcod);
        let archivos = [];

        if (documentoPrevio) {
          archivos = documentoPrevio.archivos;
        }

        let documentos = this.data.documentosAnulacion.filter((t: any) => t.tacoCcod == causal.tacoCcod);

        if (documentos.length) {
          documentos = documentos.map((t: any) => { return Object.assign({ archivos: archivos }, t) });
        }

        this.tiposDocumentos = this.tiposDocumentos.concat(documentos);
      });
    }
  }
  async confirmarEnvio(message?: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const actionSheet = await this.action.create({
        cssClass: message ? 'solicitud-alert' : '',
        header: 'Enviar Solicitud',
        subHeader: message || '¿Segur@ que quiere enviar la Solicitud?',
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => {
              resolve(true)
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false)
            }
          }
        ]
      });

      await actionSheet.present();
    })
  }
  resolverTerminos() { }
  resolverMostrarAdjuntar(archivos: any[]) {
    if (archivos.length == 0) return true;
    if (this.solicitud.tisoCcod == 14 || this.solicitud.tisoCcod == SOLICITUD.ANULACION_CONTRATO) return true;
    return false;
  }
  trimString(string: any, length: number) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }
  get glosaCompleta() {
    if (this.solicitud.tisoCcod == SOLICITUD.ANULACION_CONTRATO)
      return true;
    return false;
  }
  get evaluaciones() { return this.solicitudForm.get('evaluaciones') as FormArray; }
  get motivo() { return this.solicitudForm.get('motivo'); }
  get causalInterrupcion() { return this.solicitudForm.get('causalInterrupcion'); }
  get viaConvalidacion() { return this.solicitudForm.get('viaConvalidacion') }
  get organismoAutorizado() { return this.solicitudForm.get('organismoAutorizado') }
  get otroOrganismo() { return this.solicitudForm.get('otroOrganismo') }
  get tipoTrabajador() { return this.solicitudForm.get('tipoTrabajador'); }
  get nacimiento() { return this.solicitudForm.get('nacimiento'); }
  get colegio() { return this.solicitudForm.get('colegio'); }
  get totalArchivos() {
    let contadorArchivos = 0;

    if (this.tiposDocumentos && this.tiposDocumentos.length) {
      this.tiposDocumentos.forEach((tipo: any) => {
        contadorArchivos += tipo.archivos.length
      });
    }

    return contadorArchivos;
  }
  get validarEvaluaciones() {
    if (this.solicitud.tisoCcod != SOLICITUD.JUSTIFICACION_INASISTENCIA) {
      return true;
    }

    let isValid = false;

    this.evaluaciones.value.forEach((evaluacion: any) => {
      if (evaluacion === true) {
        isValid = true;
      }
    });

    return isValid;
  }
  get backUrl() {
    return this.router.url.startsWith('/dashboard-alumno/inicio/solicitud-justificacion-inasistencia')
      ? this.router.url.replace('/solicitud-justificacion-inasistencia', '')
      : this.router.url.replace('/solicitud-documentos', '');
  }
  get backText() {
    return this.router.url.startsWith('/dashboard-alumno/inicio/solicitud-justificacion-inasistencia')
      ? 'Inicio'
      : 'Solicitudes';
  }

}
