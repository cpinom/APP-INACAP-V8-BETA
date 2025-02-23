import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, IonPopover, NavController } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as $ from 'jquery';
import { SolicitudesService } from 'src/app/core/services/http/solicitudes.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud-simple.page.html',
  styleUrls: ['./solicitud-simple.page.scss'],
})
export class SolicitudPage implements OnInit {

  @ViewChild('datePicker') datePicker!: IonPopover;
  mostrarCargando = true;
  mostrarData = false;
  data: any;
  showMore!: boolean;
  solicitud: any;
  tipoSolicitud!: number;
  solicitudForm!: FormGroup;
  justificacionCausales = false;
  submitted = false;
  fechaMaxima: string = ''; //format(new Date(), 'yyyy-MM-dd');

  // 25, 34, 40, 

  private router = inject(Router);
  private api = inject(SolicitudesService);
  private dialog = inject(DialogService);
  private formBuilder = inject(FormBuilder);
  private error = inject(ErrorHandlerService);
  private snackbar = inject(SnackbarService);
  private nav = inject(NavController);
  private action = inject(ActionSheetController);

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
    const planCcod = this.solicitud.planCcod;
    const tisoCcod = this.solicitud.tisoCcod;

    try {
      const result = await this.api.getDatosSolicitudV5(tisoCcod, planCcod);

      if (result.success) {
        this.data = result.data;
        this.data.glosa = result.glosa;
        this.data.titulo = this.solicitud.tisoTdesc;
        this.tipoSolicitud = this.solicitud.tisoCcod;
        this.setupForm();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('Ha ocurrido un error al cargar la solicitud.');
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }
  setupForm() {
    if (this.tipoSolicitud == 7) { // RED. CARGA ACADEMICA
      this.solicitudForm = this.formBuilder.group({
        motivo: ['', Validators.required]
      })
    }
    else if (this.tipoSolicitud == 12) { // TRASLADO SEDE
      this.solicitudForm = this.formBuilder.group({
        sede: ['', Validators.required],
        motivo: ['', Validators.required]
      })
    }
    else if (this.tipoSolicitud == 22) { // CAMBIO PROG. ESTUDIO
      this.solicitudForm = this.formBuilder.group({
        programa: ['', Validators.required]
      })
    }
    else if (this.tipoSolicitud == 34) {
      this.solicitudForm = this.formBuilder.group({
        evaluaciones: new FormArray([]),
        motivo: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(1000)
        ])]
      });

      this.data.evaluaciones.forEach(() => {
        this.evaluaciones.push(new FormControl(false))
      });

    }
    else if (this.tipoSolicitud == 45) { // ASIGNATURAS INTERSEMESTRALES
      this.solicitudForm = this.formBuilder.group({
        sede: ['', Validators.required]
      })
    }
    else {
      this.solicitudForm = this.formBuilder.group({
        motivo: []
      })
    }

  }
  async procesar() {
    this.submitted = true;

    if (this.solicitudForm.valid) {
      let enviarSolicitud = true;
      let errorSolicitud = '';
      let data = this.solicitud;
      let planCcod = data.planCcod;
      let params: any = {
        tisoCcod: this.tipoSolicitud,
        planCcod: planCcod
      };

      switch (this.tipoSolicitud) {
        case 5:
        case 7: {
          let asignaturas: any[] = [];

          this.data.asignaturas.forEach((item: any) => {
            if (item.checked) {
              asignaturas.push(this.tipoSolicitud == 7 ? item.seccCcod : item.asigCcod);
            }
          });

          if (asignaturas.length == 0) {
            enviarSolicitud = false;
            errorSolicitud = 'Debe seleccionar al menos una asignatura.';
          }
          else {
            params['asignaturas'] = asignaturas;

            if (this.tipoSolicitud == 7) {
              params['motivo'] = this.motivo?.value
            }
          }

          break;
        }
        case 12: {
          params['sedeCcod'] = this.sede?.value;
          params['motivo'] = this.motivo?.value;
          break;
        }
        case 15: {
          let secciones: any[] = [];

          this.data.secciones.forEach((seccion: any) => {
            if (seccion.ssecSelected) {
              secciones.push({
                ssecElimina: seccion.ssecNcorr,
                ssecAgrega: seccion.ssecSelected
              });
            }
          });

          if (secciones.length == 0) {
            enviarSolicitud = false;
            errorSolicitud = 'Debe cambiar al menos una sección.';
          }
          else {
            params['secciones'] = secciones;
          }

          break;
        }
        case 21: {
          params['jornCcod'] = this.data.jornada.value;
          break;
        }
        case 22: {
          params['oferNcorr'] = this.programa?.value;
          break;
        }
        // case 34: {
        //   if (this.solicitud.tisoCcod == 1) {
        //     if (!this.solicitudForm.valid) {
        //       return;
        //     }

        //     let evaluaciones = [];

        //     this.evaluaciones.value.forEach((evaluacion, i) => {
        //       if (evaluacion == true) {
        //         evaluaciones.push(this.data.evaluaciones[i].seccCcod);
        //       }
        //     });

        //     if (evaluaciones.length == 0) {
        //       return;
        //     }

        //     params['evaluaciones'] = evaluaciones;
        //     params['motivo'] = this.motivo.value;
        //     params['entregaJustificacion'] = '0';
        //   }
        // }
        case 35: {
          let causales: any[] = [];
          let documentos: any[] = [];
          params['causales_otros'] = '';

          this.data.causales.forEach((item: any) => {
            if (item.checked) {
              causales.push(item.tacoCcod);

              if (item.tacoCcod == 7) {
                params['causales_otros'] = this.motivo?.value;
              }

              let dependencia = this.data.dependencias.filter((dep: any) => {
                if (item.tacoCcod == dep.tacoCcod)
                  return dep.camsTid;
              });

              if (dependencia.length) {
                documentos.push(dependencia[0].camsTid);
              }
            }
          });

          if (causales.length == 0) {
            enviarSolicitud = false;
            errorSolicitud = 'Debe seleccionar al menos una causa.';
          }
          else {
            params['causales'] = causales.join(',');
            params['documentos'] = documentos;
          }

          break;
        }
        case 45: {
          let asignaturas: any[] = [];

          this.data.asignaturas.forEach((item: any) => {
            if (item.checked) {
              asignaturas.push(item.asigCcod);
            }
          });

          if (asignaturas.length == 0) {
            enviarSolicitud = false;
            errorSolicitud = 'Debe seleccionar al menos una asignatura.';
          }
          else if (asignaturas.length > 2) {
            enviarSolicitud = false;
            errorSolicitud = 'Sólo puede seleccionar un máximo de 2 asignaturas.';
          }
          else {
            params['asignaturas'] = asignaturas;
            params['sedeCcod'] = this.sede?.value;
          }

          break;
        }
      }

      if (enviarSolicitud) {
        let confirm = await this.confirmarEnvio();

        if (!confirm) {
          return;
        }

        const loading = await this.dialog.showLoading({ message: 'Procesando...' });
        let message = '';
        let mostrarExito = false;

        try {
          const result = await this.api.procesarSolicitud(params);

          if (result.success) {
            mostrarExito = true;
            message = result.html || '<span>La solicitud ha sido ingresada correctamente.</span>';
          }
          else {
            message = result.message
          }
        }
        catch (error: any) {
          if (error && error.status == 401) {
            await this.error.handle(error);
            return
          }

          message = 'Ha ocurrido un error al procesar la solicitud.';
        }
        finally {
          await loading.dismiss();

          if (this.tipoSolicitud == 1) {
            this.api.marcarVista(VISTAS_ALUMNO.SOLICITUDES_INASISTENCIA);
          }
        }

        if (mostrarExito) {
          await this.presentSuccess(message);
          await this.router.navigate([this.backUrl], { replaceUrl: true });
        }
        else {
          await this.presentError(message);
        }
      }
      else {
        await this.presentError(errorSolicitud);
      }
    }
  }
  async sedesChange() {
    const loading = await this.dialog.showLoading({ message: 'Cargando asignaturas...' });
    const sedeCcod = this.sede?.value;
    const planCcod = this.solicitud.planCcod;

    try {
      const result = await this.api.getAsignaturasPendientesV5(sedeCcod, planCcod);

      if (result.success) {
        this.data.asignaturas = result.data.asignaturas;
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

      await this.snackbar.showToast('Ha ocurrido un error al cargar las asignaturas.');
    }
    finally {
      await loading.dismiss();
    }
  }
  causalChange(data: any) {
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
  }
  mostrarCambiosCarga(seccion: any) {
    return seccion.ssecSelected == 0 ? 'Sin cambio...' : seccion.disponibles.find((t: any) => t.ssecNcorr == seccion.ssecSelected).ssecTdesc;
  }
  async confirmarEnvio(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const actionSheet = await this.action.create({
        header: '¿Segur@ que quieres enviar la Solicitud?',
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
  async presentSuccess(message: string) {
    await this.dialog.showAlert({
      header: 'Detalle Solicitud',
      backdropDismiss: false,
      keyboardClose: false,
      cssClass: 'success-alert',
      message: `<div class="image"><ion-icon src = "./assets/icon/check_circle.svg"></ion-icon></div>${$(message).text()}`,
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
  }
  async presentError(message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: 'Envío de Solicitud',
      buttons: ['Aceptar']
    });

    return alert;
  }
  trimString(string: string, length: number) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }
  get glosaCompleta() {
    if (this.tipoSolicitud == 3 || this.tipoSolicitud == 6 || this.tipoSolicitud == 10 || this.tipoSolicitud == 15 || this.tipoSolicitud == 17 || this.tipoSolicitud == 21 || this.tipoSolicitud == 22 || this.tipoSolicitud == 34 || this.tipoSolicitud == 40)
      return true;
    return false;
  }
  get solicitudDisponible() {
    if (this.tipoSolicitud == 5 || this.tipoSolicitud == 7 || this.tipoSolicitud == 12 || this.tipoSolicitud == 15 || this.tipoSolicitud == 21 || this.tipoSolicitud == 22 || this.tipoSolicitud == 34 || this.tipoSolicitud == 45) {
      return true;
    }
    return false;
  }
  get sede() { return this.solicitudForm.get('sede'); }
  get evaluaciones() { return this.solicitudForm.get('evaluaciones') as FormArray; }
  get terminos() { return this.solicitudForm.get('terminos'); }
  get motivo() { return this.solicitudForm.get('motivo'); }
  get programa() { return this.solicitudForm.get('programa'); }
  get nacimiento() { return this.solicitudForm.get('nacimiento'); }
  get tipos() { return this.solicitudForm.get('tipos'); }

  get validarEvaluaciones() {
    if (this.tipoSolicitud != 1) {
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
    let parts = this.router.url.split('/');
    let index = parts.indexOf('solicitud-simple');

    if (index > -1) {
      return parts.slice(1, index).join('/');
    }
    return '';
  }
}
