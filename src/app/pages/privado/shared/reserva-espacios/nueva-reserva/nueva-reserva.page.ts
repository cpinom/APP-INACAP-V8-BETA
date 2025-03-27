import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { localeEs } from '@mobiscroll/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as moment from 'moment';
import { ReservasEspacioService } from 'src/app/core/services/http/reservas-espacio.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-nueva-reserva',
  templateUrl: './nueva-reserva.page.html',
  styleUrls: ['./nueva-reserva.page.scss'],
})
export class NuevaReservaPage implements OnInit {

  @ViewChild('stepper') private myStepper?: MatStepper;
  mostrarData = false;
  cliente: any;
  categorias: any;
  proveedores: any;
  camposAdicionales: any;
  firstStep: FormGroup;
  secondStep: FormGroup;
  aditionalsFieldStep: FormGroup | undefined;
  pickerLocale = localeEs;
  fechaConsulta: any;
  slots: any;
  user: any;
  themeVariant: any;

  private router = inject(Router);
  private api = inject(ReservasEspacioService);
  private dialog = inject(DialogService);
  private fb = inject(FormBuilder);
  private nav = inject(NavController);
  private events = inject(EventsService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);
  private auth = inject(AuthService);
  private profile = inject(ProfileService);

  constructor() {

    this.firstStep = this.fb.group({
      categoria: ['', Validators.required],
      proveedor: ['', Validators.required]
    });

    this.secondStep = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });

    this.categoria?.valueChanges.subscribe(() => {
      this.categoriasChange();
    });

    this.fecha?.valueChanges.subscribe((value: any) => {
      this.fechaConsulta = moment(value).format('YYYY-MM-DD');

      if (this.proveedor?.valid) {
        this.cargarDisponibilidad();
      }
    });

    this.themeVariant = this.profile.isDarkMode() ? 'dark' : 'light';

  }
  async ngOnInit() {
    const params = this.router.getCurrentNavigation()?.extras.state;

    if (params) {
      this.cliente = params['cliente'];
      this.categorias = params['categorias'];
      this.user = (await this.auth.getAuth()).user;

      if (this.categorias.length == 1) {
        this.categoria?.setValue(this.categorias[0]);
      }
    }
    else {
      this.nav.navigateBack(this.backUrl);
      return;
    }

    this.mostrarData = true;
  }
  async categoriasChange() {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });
    const arcaCcodServicio = this.categoria?.value.arcaCcodServicio;

    this.proveedor?.setValue('');

    try {
      const result = await this.api.getProveedoresV2(arcaCcodServicio);

      if (result.success) {
        this.proveedores = result.proveedores;

        if (result.proveedores.length == 1) {
          this.proveedor?.setValue(this.proveedores[0], { emitEvent: true })
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

      this.categoria?.setValue('', { emitEvent: false });
      await this.snackbar.showToast('Ha ocurrido un error mientras se procesaba tu solicitud.');
    }
    finally {
      await loading.dismiss();
    }
  }
  async onSelectionChange(e: any) {
    // Va avanzando
    if (e.previouslySelectedIndex < e.selectedIndex) {
      if (e.selectedIndex == 1) {
        await this.cargarDisponibilidad();
      }
      else if (e.selectedIndex == 2) {
        await this.cargarCamposAdicionales();
      }
    }
    // Va en retroceso
    else {
      if (e.selectedIndex == 0) {
        this.proveedor?.setValue('');
        this.slots = [];
        this.fecha?.setValue('', { emitEvent: false });
        this.hora?.setValue('');
      }
      else if (e.selectedIndex == 1) {
        this.slots = [];
        this.hora?.setValue('');
        this.camposAdicionales = undefined;
        this.aditionalsFieldStep = undefined;
        await this.cargarDisponibilidad();
      }

      e.previouslySelectedStep.completed = false;
    }
  }
  seleccionarEspacio(hora: string) {
    debugger
    this.hora?.setValue(hora);
    this.myStepper?.next();
  }
  prevStep() {
    if (this.myStepper?.selected) {
      this.myStepper.selected.completed = false;
    }
    this.myStepper?.previous();
  }
  async onHorarioChange(args: any) {
    this.fecha?.setValue(moment(args.firstDay).toDate());
  }
  async cargarDisponibilidad() {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });
    const params = {
      arcaCcod: this.categoria?.value.arcaCcod,
      idServicio: this.categoria?.value.arcaCcodServicio,
      idProveedor: this.proveedor?.value.id,
      contador: this.proveedor?.value.cantidad,
      fechaConsulta: this.fechaConsulta
    };

    try {
      const result = await this.api.getDisponibilidad(params);

      if (result.success) {
        this.slots = result.slots;
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

      this.snackbar.showToast('Ha ocurrido un error mientras se procesaba tu solicitud.');
    }
    finally {
      await loading.dismiss();
    }
  }
  async cargarCamposAdicionales() {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });
    let arcaCcodServicio: string = this.categoria?.value.arcaCcodServicio;

    if (arcaCcodServicio.indexOf(',') > -1) {
      arcaCcodServicio = this.proveedor?.value.id.split('|')[1];
    }

    try {
      const result = await this.api.getCamposAdicionalesV2(arcaCcodServicio);

      if (result.success) {
        this.camposAdicionales = result.camposAdicionales;

        let campos: any = {};

        this.camposAdicionales.forEach((field: any) => {
          let value = field.default_value ? field.default_value : '';
          let required = !field.optional ? Validators.required : false;

          if (field.default_value == 'RUT') {
            value = this.user.data.rut;
          }

          if (field.is_visible === true) {
            campos[field.name] = [value, required];
          }
        });

        this.aditionalsFieldStep = this.fb.group(campos);
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

      this.snackbar.showToast('Ha ocurrido un error mientras se procesaba tu solicitud.');
    }
    finally {
      await loading.dismiss();
    }
  }
  async crearReservaV2() {
    if (!this.aditionalsFieldStep?.valid) {
      return;
    }

    let camposAdicionales = [];
    let controls = this.aditionalsFieldStep.controls;

    for (let key in controls) {
      camposAdicionales.push({
        field: key,
        value: controls[key].value
      })
    }

    const loading = await this.dialog.showLoading({ message: 'Procesando...' });
    const params = {
      service_id: this.categoria?.value.arcaCcodServicio,
      provider_id: this.proveedor?.value.id,
      category_id: this.categoria?.value.arcaCcod,
      client_id: this.cliente.id,
      count: 1,
      start_datetime: `${this.fechaConsulta} ${this.hora?.value}`,
      location_id: null,
      additional_fields: camposAdicionales
    };

    try {
      const result = await this.api.crearReservaV2(params);

      if (result.success) {
        const params = { id: result.data.id, mostrarSuccess: true };

        this.events.app.next({ action: 'app:reserva-espacios-reload' });
        this.presentSuccess(async () => {
          await this.nav.navigateForward(`${this.backUrl}/detalle-reserva`, { state: params, replaceUrl: true });
        })
      }
      else if (result.message) {
        await this.presentError(result.message);
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

      await this.presentError('No pudimos crear la reserva. Vuelve a intentarlo.');
    }
    finally {
      await loading.dismiss();
    }
  }
  async presentSuccess(callback: Function) {
    const mensaje = 'La reserva ha sido agendada correctamente.'

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Nueva Reserva.',
      cssClass: 'success-alert',
      message: `<div class="image"><ion-icon src = "./assets/icon/check_circle.svg"></ion-icon></div>${mensaje}`,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            callback();
          }
        }
      ]
    });
  }
  async presentError(message: string) {
    await this.dialog.showAlert({
      header: 'Nueva Reserva',
      message: message,
      buttons: [{
        text: 'Aceptar'
      }]
    })
  }
  get backUrl() { return this.router.url.replace('/nueva-reserva', ''); }
  get categoria() { return this.firstStep.get('categoria'); }
  get proveedor() { return this.firstStep.get('proveedor'); }
  get fecha() { return this.secondStep.get('fecha'); }
  get hora() { return this.secondStep.get('hora'); }

}
