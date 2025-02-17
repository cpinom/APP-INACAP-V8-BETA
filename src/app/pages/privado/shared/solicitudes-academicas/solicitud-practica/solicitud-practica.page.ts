import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, IonModal, IonRouterOutlet, NavController } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { SolicitudesService } from 'src/app/core/services/http/solicitudes.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ValidateRut } from 'src/app/core/validators/rut.validators';

export enum SOLICITUD {
  INSCRIPCION_PRACTICA = 2,
  CONVALIDACION_PRACTICA = 43,
  HOMOLOGACION_PRACTICA = 44
};

@Component({
  selector: 'app-solicitud-practica',
  templateUrl: './solicitud-practica.page.html',
  styleUrls: ['./solicitud-practica.page.scss'],
})
export class SolicitudPracticaPage implements OnInit {

  praticaForm!: FormGroup;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-]+$';
  patternNum = '^[0-9]*$';
  data: any;
  submitted = false;
  solicitud: any;
  detalleSolicitud: any;
  showMore!: boolean;

  constructor(private fb: FormBuilder,
    private router: Router,
    private api: SolicitudesService,
    private dialog: DialogService,
    private error: ErrorHandlerService,
    private snackbar: SnackbarService,
    private nav: NavController,
    public routerOutlet: IonRouterOutlet,
    private events: EventsService,
    private action: ActionSheetController) {
    this.solicitud = this.router.getCurrentNavigation()?.extras.state;
  }
  async ngOnInit() {
    if (!this.solicitud) {
      await this.nav.navigateBack(this.backUrl);
      return;
    }

    await this.cargar();
  }
  setupForm() {

    if (this.solicitud.tisoCcod == SOLICITUD.INSCRIPCION_PRACTICA) {

      this.praticaForm = this.fb.group({
        tipos: ['', Validators.required],
        rut: ['', Validators.compose([
          Validators.required,
          ValidateRut
        ])],
        nombre: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        direccion: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        pais: ['', Validators.required],
        region: ['', Validators.required],
        ciudad: ['', Validators.required],
        comuna: ['', Validators.required],
        ciudadExtranjera: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        rutContacto: ['', Validators.compose([
          Validators.required,
          ValidateRut
        ])],
        nombreContacto: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        cargoContacto: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        telefonoContacto: ['', Validators.compose([
          Validators.required,
          Validators.pattern(/^(\+56){0,1}(9)[98765]\d{7}$/)
        ])],
        correoContacto: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])],
        sector: ['', Validators.required],
        horasPractica: [''],
        horasPracticaIngreso: [''],
        preguntas: ['', Validators.required]
      });

      this.tipos?.valueChanges.subscribe((treqCcod) => {
        this.horasPractica?.clearValidators();
        this.horasPracticaIngreso?.clearValidators();

        if (treqCcod == 4) {
          this.horasPractica?.setValidators(Validators.required);
          this.horasPractica?.updateValueAndValidity();
          this.cargarHoras();
        }
        else {
          this.horasPracticaIngreso?.setValidators([
            Validators.required,
            Validators.pattern(this.patternNum),
            Validators.min(1)
          ]);
        }

        this.horasPractica?.updateValueAndValidity();
        this.horasPracticaIngreso?.updateValueAndValidity();
      });

      this.pais?.valueChanges.subscribe((paisCcod) => {
        if (paisCcod == 1) {
          this.ciudadExtranjera && this.clearValidators(this.ciudadExtranjera);
          this.region?.setValidators(Validators.required);
          this.region?.updateValueAndValidity();
          this.ciudad?.setValidators(Validators.required);
          this.ciudad?.updateValueAndValidity();
          this.comuna?.setValidators(Validators.required);
          this.comuna?.updateValueAndValidity();
        }
        else {
          this.region && this.clearValidators(this.region);
          this.ciudad && this.clearValidators(this.ciudad);
          this.comuna && this.clearValidators(this.comuna);
          this.ciudadExtranjera?.setValidators(Validators.required);
          this.ciudadExtranjera?.updateValueAndValidity();
        }
      });

      this.region?.valueChanges.subscribe(() => {
        this.cargarCiudades()
      });

      this.ciudad?.valueChanges.subscribe(() => {
        this.cargarComunas();
      });

      if (this.data.tipos.length) {
        this.tipos?.setValue(this.data.tipos[0].treqCcod, { emitEvent: false });
      }

      if (this.data.horasPracticas.length) {
        this.horasPractica?.setValue(this.data.horasPracticas[0].horas, { emitEvent: false });
      }

      this.pais?.setValue(1);

    }
    else if (this.solicitud.tisoCcod == SOLICITUD.CONVALIDACION_PRACTICA) {

      this.praticaForm = this.fb.group({
        tipos: ['', Validators.required],
        rut: ['', Validators.compose([
          Validators.required,
          ValidateRut
        ])],
        nombre: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        direccion: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        pais: ['', Validators.required],
        region: ['', Validators.required],
        ciudad: ['', Validators.required],
        comuna: ['', Validators.required],
        ciudadExtranjera: ['', Validators.compose([
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(this.patternStr)
        ])],
        sector: ['', Validators.required],
        horasPractica: ['', Validators.required],
        condicion: ['', Validators.required]
      });

      this.tipos?.valueChanges.subscribe(() => {
        this.cargarHoras();
      });

      this.pais?.valueChanges.subscribe((paisCcod) => {
        if (paisCcod == 1) {
          this.ciudadExtranjera && this.clearValidators(this.ciudadExtranjera);
          this.region?.setValidators(Validators.required);
          this.region?.updateValueAndValidity();
          this.ciudad?.setValidators(Validators.required);
          this.ciudad?.updateValueAndValidity();
          this.comuna?.setValidators(Validators.required);
          this.comuna?.updateValueAndValidity();
        }
        else {
          this.region && this.clearValidators(this.region);
          this.ciudad && this.clearValidators(this.ciudad);
          this.comuna && this.clearValidators(this.comuna);
          this.ciudadExtranjera?.setValidators(Validators.required);
          this.ciudadExtranjera?.updateValueAndValidity();
        }
      });

      this.region?.valueChanges.subscribe(() => {
        this.cargarCiudades()
      });

      this.ciudad?.valueChanges.subscribe(() => {
        this.cargarComunas();
      });

      if (this.data.tiposPracticas.length) {
        this.tipos?.setValue(this.data.tiposPracticas[0].treqCcod, { emitEvent: false });
      }

      if (this.data.horasPracticas.length) {
        this.horasPractica?.setValue(this.data.horasPracticas[0].horas, { emitEvent: false });
      }

      this.pais?.setValue(1);

    }
    else if (this.solicitud.tisoCcod == SOLICITUD.HOMOLOGACION_PRACTICA) {

      this.praticaForm = this.fb.group({
        tipos: ['', Validators.required],
        motivo: ['', Validators.required],
        horasPractica: []
      });

      this.motivo?.valueChanges.subscribe((value) => {
        if (value == 1) {
          this.horasPractica?.clearValidators();
        }
        else if (value == 2) {
          this.horasPractica?.setValidators([
            Validators.required,
            Validators.pattern(this.patternNum),
            Validators.min(1)
          ])
        }
        this.horasPractica?.updateValueAndValidity();
      });

      if (this.data.tiposPracticas.length) {
        this.tipos?.setValue(this.data.tiposPracticas[0].treqCcod, { emitEvent: false });
      }

    }
  }
  async cargar() {
    let loading = await this.dialog.showLoading({ message: 'Cargando...' });
    let planCcod = this.solicitud.planCcod;
    let tisoCcod = this.solicitud.tisoCcod;
    let params = { planCcod: planCcod, tisoCcod: tisoCcod };

    try {
      let result = await this.api.getDatosSolicitud(params);

      if (result.success) {
        this.data = result.data;
        this.data.glosa = result.glosa;
        this.data.titulo = this.solicitud.tisoTdesc;
        this.setupForm();
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.error.handle(error, async () => {
        await this.nav.navigateBack(this.backUrl);
      });
    }
    finally {
      loading.dismiss();
    }
  }
  async procesar(modal: IonModal) {
    this.submitted = true;

    if (this.praticaForm.valid) {
      let params: any = { tisoCcod: this.solicitud.tisoCcod, planCcod: this.solicitud.planCcod };

      if (this.solicitud.tisoCcod == SOLICITUD.INSCRIPCION_PRACTICA) {
        params = Object.assign(this.praticaForm.value, params, {
          rut: format(this.rut?.value).split('.').join(''),
          rutContacto: format(this.rutContacto?.value).split('.').join('')
        });
      }
      else if (this.solicitud.tisoCcod == SOLICITUD.CONVALIDACION_PRACTICA) {
        params = Object.assign(params, {
          treqCcod: this.tipos?.value,
          rutEmpresa: format(this.rut?.value).split('.').join(''),
          nombreEmpresa: this.nombre?.value,
          direccionEmpresa: this.direccion?.value,
          paisCcod: this.pais?.value,
          comuCcod: this.comuna?.value,
          ciudCcod: this.ciudad?.value,
          regiCcod: this.region?.value,
          ciudadExtranjera: this.ciudadExtranjera?.value,
          clacCcod: this.sector?.value,
          horasPractica: this.horasPractica?.value,
          ttraCcod: this.condicion?.value
        });
      }
      else if (this.solicitud.tisoCcod == SOLICITUD.HOMOLOGACION_PRACTICA) {
        if (this.motivo?.value == 2) {
          var horasIngreso = parseInt(this.horasPractica?.value);
          let horasMaxIngreso = parseInt(this.data.horasPracticasNro);

          if (horasIngreso > horasMaxIngreso) {
            this.snackbar.showToast(`Las horas a homologar no deben sobrepasar las ${horasMaxIngreso} horas.`);
            return;
          }

          params['horasPracticaIngreso'] = this.horasPractica?.value;
        }
        else {
          params['horasPracticaIngreso'] = '';
        }

        params['treqCcod'] = this.tipos?.value;
        params['id'] = this.motivo?.value;
        params['name'] = this.motivo?.value == 1 ? 'Otros Estudios' : 'Actividades de Vinculación con el Medio';
      }

      let confirm = await this.confirmarEnvio();

      if (!confirm) {
        return;
      }

      let loading = await this.dialog.showLoading({ message: 'Procesando solicitud...' });

      try {
        let result = await this.api.procesarSolicitud(params);

        if (result.success) {
          this.detalleSolicitud = result.html;
        }
        else {
          this.detalleSolicitud = result.message;
        }
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
        this.api.marcarVista(VISTAS_ALUMNO.SOLICITUDES_PRACTICA);
      }

      if (this.detalleSolicitud) {
        this.events.app.next({ action: 'app:solicitudes-academicas-inicio' });
        await modal.present();
      }
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
  async cargarCiudades() {
    let control = this.region;

    if (control?.valid && this.pais?.value == 1) {
      let loading = await this.snackbar.create('Cargando...', false, 'secondary');

      await loading.present();

      try {
        let params = { regiCcod: control?.value };
        let result = await this.api.getCiudades(params);
        this.data.ciudades = result;
        this.data.comunas = [];
        this.ciudad?.setValue('', { emitEvent: false });
        this.comuna?.setValue('', { emitEvent: false });
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async cargarComunas() {
    let control = this.ciudad;

    if (control?.valid && this.pais?.value == 1) {
      let loading = await this.snackbar.create('Cargando...', false, 'secondary');

      await loading.present();

      try {
        let params = { ciudCcod: control?.value, regiCcod: this.region?.value };
        let result = await this.api.getComunas(params);
        this.data.comunas = result;

        if (this.data.comunas.length == 1) {
          this.comuna?.patchValue(this.data.comunas[0]['codigo']);
        }
        else {
          this.comuna?.setValue('', { emitEvent: false });
        }
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        loading.dismiss();
      }
    }
  }
  async cargarHoras() {
    if (this.tipos?.valid) {
      let params = { planCcod: this.solicitud.planCcod, treqCcod: this.tipos.value };
      let loading = await this.snackbar.create('Cargando...', false, 'secondary');

      await loading.present();

      try {
        let result = await this.api.getHorasPracticas(params);

        if (result.success) {
          this.data.horas = result.horas;
        }
        else { }
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async onDetalleDismiss(e: any) {
    this.events.app.next({ action: 'app:modal-dismiss' });
    this.nav.navigateBack(this.backUrl);
  }
  clearValidators(control: AbstractControl) {
    control?.clearValidators();
    control?.setValue('');
    control?.updateValueAndValidity();
  }
  trimString(string: string, length: number) {
    return string.length > length
      ? string.substring(0, length) + "..."
      : string;
  }
  get glosaCompleta() {
    if (this.solicitud.tisoCcod == 2)
      return false;
    return true;
  }
  get tipos() { return this.praticaForm.get('tipos'); }
  get motivo() { return this.praticaForm.get('motivo'); }
  get rut() { return this.praticaForm.get('rut'); }
  get nombre() { return this.praticaForm.get('nombre'); }
  get direccion() { return this.praticaForm.get('direccion'); }
  get pais() { return this.praticaForm.get('pais'); }
  get region() { return this.praticaForm.get('region'); }
  get ciudad() { return this.praticaForm.get('ciudad'); }
  get comuna() { return this.praticaForm.get('comuna'); }
  get ciudadExtranjera() { return this.praticaForm.get('ciudadExtranjera'); }
  get rutContacto() { return this.praticaForm.get('rutContacto'); }
  get nombreContacto() { return this.praticaForm.get('nombreContacto'); }
  get cargoContacto() { return this.praticaForm.get('cargoContacto'); }
  get telefonoContacto() { return this.praticaForm.get('telefonoContacto'); }
  get correoContacto() { return this.praticaForm.get('correoContacto'); }
  get sector() { return this.praticaForm.get('sector'); }
  get horasPractica() { return this.praticaForm.get('horasPractica'); }
  get horasPracticaIngreso() { return this.praticaForm.get('horasPracticaIngreso'); }
  get preguntas() { return this.praticaForm.get('preguntas'); }
  get condicion() { return this.praticaForm.get('condicion'); }
  get backUrl() { return this.router.url.replace('/solicitud-practica', ''); }
  get backText() {
    return this.router.url.startsWith('/dashboard-alumno/inicio/ofertas-practica') ? 'Ofertas de Práctica' : 'Solicitudes';
  }

}

function clean(rut: string) {
  return typeof rut === 'string' ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase() : '';
}

function format(rut: string) {
  rut = clean(rut);

  let result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1);

  for (let i = 4; i < rut.length; i += 3) {
    result = rut.slice(-3 - i, -i) + '.' + result;
  }

  return result;
}
