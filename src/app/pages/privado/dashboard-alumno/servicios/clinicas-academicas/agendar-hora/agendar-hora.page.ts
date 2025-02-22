import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { localeEs, MbscEventcalendarView } from '@mobiscroll/angular';
import { ClinicasAcademicasService } from 'src/app/core/services/http/clinicas-academicas.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { RutValidator, ValidateRut } from 'src/app/core/validators/rut.validators';
import * as moment from 'moment';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ActionSheetController, NavController } from '@ionic/angular';
import { debounceTime, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-agendar-hora',
  templateUrl: './agendar-hora.page.html',
  styleUrls: ['./agendar-hora.page.scss'],
})
export class AgendarHoraPage implements OnInit {

  @ViewChild('stepper') private stepper!: MatStepper;
  mostrarCargando = true;
  mostrarData = false;
  participantesForm: FormGroup;
  ParticipantesSubmitted = false;
  horaForm: FormGroup;
  resumenForm: FormGroup;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-]+$';
  submitted = false;
  ofertas: any;
  pickerLocale = localeEs;
  eventosHorario: any;
  fechaConsulta: any = moment().toDate();
  myView: MbscEventcalendarView = {
    calendar: { type: 'week' },
    agenda: { type: 'day' }
  };
  sedeCcod: any;
  asignaturas!: any[];

  constructor(private fb: FormBuilder,
    private api: ClinicasAcademicasService,
    private profile: ProfileService,
    private error: ErrorHandlerService,
    private dialog: DialogService,
    private snackbar: SnackbarService,
    private events: EventsService,
    private nav: NavController,
    private action: ActionSheetController) {

    this.participantesForm = this.fb.group({
      participantes: new FormArray([])
    });

    this.horaForm = this.fb.group({
      oferta: [, Validators.required]
    });

    this.resumenForm = this.fb.group({
      asigCcod: [, Validators.required]
    });

  }

  async ngOnInit() {
    const profile = await this.profile.getPrincipal();
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const rut = profile.rut;
    const nombre = `${profile.persTnombreSocial || profile.persTnombre} ${profile.persTapePaterno} ${profile.persTapeMaterno}`;
    const correo = profile.persTemailInacap;

    this.agregarParticipante(programa.matrNcorr, 1, rut, nombre, correo);
    this.sedeCcod = programa.sedeCcod;
    this.cargarOfertas();
  }
  async cargarOfertas() {
    try {
      const request = await this.api.getOfertasDisponibles(this.sedeCcod);

      if (request.success) {
        this.ofertas = request.data.ofertas;
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
  recargar() {

  }
  agregarParticipante(matricula?: number, solicitante?: number, rut?: string, nombre?: string, correo?: string) {
    const oferta = this.oferta?.value;

    if (oferta) {
      if (this.participantes.length >= oferta.acacNcupo) {
        this.snackbar.showToast(`La clínica permite hasta  ${oferta.acacNcupo} asistentes.`, 3000);
        return;
      }
    }

    const form = this.fb.group({
      matricula: [matricula || 0],
      solicitante: [solicitante || 0],
      rut: [rut, Validators.compose([
        Validators.required,
        ValidateRut
      ])],
      // rut: [rut,
      //   [Validators.required],
      //   [this.rutValidator()]
      // ],
      nombre: [nombre, Validators.compose([
        Validators.maxLength(50),
        Validators.pattern(this.patternStr)
      ])],
      correo: [correo, Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });

    const matriculaCtrl = form.get('matricula');
    const rutCtrl = form.get('rut');
    const nombreCtrl = form.get('nombre');
    const correoCtrl = form.get('correo');

    rutCtrl?.valueChanges.subscribe(async (rut: any) => {
      if (rutCtrl.valid) {
        // debugger
        const rutFormateado = RutValidator.formatear(rut);
        const controles = this.participantes.controls;
        const existeRut = controles.some(t => {
          return RutValidator.formatear(t.value.rut) == rutFormateado
        });

        if (existeRut) {
          this.snackbar.showToast(`El rut "${rutFormateado}" ingresado ya existe para otro asistente.`, 3000);
          rutCtrl.setValue('', { emitEvent: false });
          return;
        }

        nombreCtrl?.setValue('');
        correoCtrl?.setValue('');
        matriculaCtrl?.setValue(0);

        const loading = await this.dialog.showLoading({ message: 'Consultando Rut...' });

        try {
          const request = await this.api.buscarAlumno(this.sedeCcod, rut);

          if (request.success && request.code == 200) {
            const { alumno } = request.data;
            nombreCtrl?.setValue(alumno.nombreCompleto);
            correoCtrl?.setValue(alumno.persTemailInacap);
            matriculaCtrl?.setValue(alumno.matrNcorr);

            rutCtrl.setErrors(null);
          }
          else {
            rutCtrl.setErrors({
              noEsAlumno: true
            })
          }
        }
        catch (error: any) {
          if (error && error.status == 401) {
            await this.error.handle(error);
          }
        }
        finally {
          await loading.dismiss();
        }
      }
    });

    correoCtrl?.valueChanges.subscribe((correo: any) => {
      if (correoCtrl.valid) {
        const controles = this.participantes.controls;
        const existeCorreo = controles.some(t => t.value.correo.toUpperCase() == correo.toUpperCase());

        if (existeCorreo) {
          this.snackbar.showToast(`El correo "${correo}" ingresado ya existe para otro asistente.`, 3000);
          correoCtrl.setValue('', { emitEvent: false });
          return;
        }
      }
    });

    this.participantes.push(form);
    this.stepper && this.stepper.selected && (this.stepper.selected.completed = false);

    if (this.participantes.length > 1) {
      this.submitted = true;
    }
  }
  eliminarParticipante(index: number) {
    this.participantes.removeAt(index);
  }
  async onSelectionChange(e: any) {

    if (e.previouslySelectedIndex > e.selectedIndex) {
      if (e.selectedIndex == 0) {
        const first = this.stepper.steps.get(1);
        const second = this.stepper.steps.get(2);
        first && (first.completed = false);
        second && (second.completed = false);
      }
      else if (e.selectedIndex == 1) {
        const second = this.stepper.steps.get(2);
        second && (second.completed = false);
      }
    }
    else {
      if (e.selectedIndex == 1) {
        const zero = this.stepper.steps.get(0);
        zero && (zero.completed = true);
      }
      else if (e.selectedIndex == 2) {
        const zero = this.stepper.steps.get(0);
        const first = this.stepper.steps.get(1);
        zero && (zero.completed = true);
        first && (first.completed = true);
        this.asignaturas = JSON.parse(this.oferta?.value.asignaturas);
      }
    }
  }
  mostrarParticipantes() {
    if (this.horaForm.valid) {
      this.stepper?.next();
    }
  }
  mostrarDetalleHora() {
    this.submitted = true;

    if (this.participantesForm.valid) {
      this.submitted = false;
      this.stepper?.next();
    }
  }
  async reservarHora() {
    this.submitted = true;

    if (this.resumenForm.valid) {
      const confirmar = await this.confirmar('¿Estas seguro de reservar la Clínica seleccionada?');

      if (confirmar) {
        this.submitted = false;

        const loading = await this.dialog.showLoading({ message: 'Agendando hora...' });
        const participantes = this.participantes.value.map((t: any) => `${t.matricula}|${t.solicitante}|${t.correo}`).join(',');
        const asignaturas = this.asigCcod?.value.join('');
        const oferta = this.oferta?.value;
        const params = {
          acofNcorr: oferta.acofNcorr,
          participantes: participantes,
          asigCcod: asignaturas,
          sedeCcod: this.sedeCcod
        };

        try {
          const request = await this.api.agendarOferta(params);

          if (request.success) {
            this.events.app.next({ action: 'app:clinicas-recargar' });
            this.nav.navigateBack(`${this.backUrl}`, { replaceUrl: true });
            this.mostrarExito();

          }
        }
        catch (error: any) {
          if (error && error.status == 401) {
            await this.error.handle(error);
          }
        }
        finally {
          await loading.dismiss();
        }
      }
    }
  }
  async mostrarExito() {
    const mensaje = 'La clínica ha sido agendada correctamente.'

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Nueva Reserva.',
      cssClass: 'success-alert',
      message: `<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>${mensaje}`,
      buttons: ['Aceptar']
    });
  }
  confirmar(message: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialog.showAlert({
        header: title || 'Nueva Reserva',
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => {
              resolve(true);
            }
          }
        ]
      })
    });
    // return new Promise(async (resolve) => {

    //   const actionSheet = await this.action.create({
    //     header: title || 'Nueva Reserva',
    //     subHeader: message,
    //     buttons: [
    //       {
    //         text: 'Continuar',
    //         role: 'destructive',
    //         handler: () => resolve(true)
    //       },
    //       {
    //         text: 'Cancelar',
    //         role: 'cancel',
    //         handler: () => resolve(false)
    //       }
    //     ]
    //   });

    //   await actionSheet.present();

    // })
  }
  rutValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<{ [key: string]: any } | null> => {
      if (!control.value) {
        return Promise.resolve(null);
      }

      if (RutValidator.validar(control.value) && this.sedeCcod) {
        // return this.api.buscarAlumno(this.sedeCcod, control.value).then(result => {
        //   if (!result.success) {
        //     return { 'rut': true }
        //   }
        // });
        return this.api.buscarAlumno(this.sedeCcod, control.value).then(result => {
          if (!result.success) {
            return { 'rut': true };
          }
          return null;
        })
      }

      return Promise.resolve(null);
    }
  }
  get otrosParticipantes() {
    if (this.participantes.controls.length) {
      return this.participantes.value.map((t: any) => `${t.correo}`);//.slice(1)
    }
    return [];
  }
  get participantes() { return this.participantesForm.get('participantes') as FormArray; }
  get oferta() { return this.horaForm.get('oferta'); }
  get asigCcod() { return this.resumenForm.get('asigCcod'); }
  get backUrl() { return '/alumno/servicios/clinicas-academicas'; }

}
