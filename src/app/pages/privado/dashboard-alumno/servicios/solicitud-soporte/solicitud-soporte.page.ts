import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal, IonRouterOutlet, LoadingController } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { CentroAyudaService } from 'src/app/core/services/centro-ayuda.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-solicitud-soporte',
  templateUrl: './solicitud-soporte.page.html',
  styleUrls: ['./solicitud-soporte.page.scss'],
})
export class SolicitudSoportePage implements OnInit {

  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-¿?¡!]+$';
  mostrarCargando = true;
  mostrarData = false;
  tabsModel = 0;
  categorias: any;
  casos: any;
  caso: any;
  form: FormGroup;
  submitted = false;
  mostrarSubmotivo = false;
  mostrarCentroAyuda = false;

  constructor(private api: CentroAyudaService,
    private fb: FormBuilder,
    private loading: LoadingController,
    private error: ErrorHandlerService,
    private snackbar: SnackbarService,
    private alert: AlertController,
    private routerOutlet: IonRouterOutlet,
    private profile: ProfileService,
    private events: EventsService) {

    this.form = this.fb.group({
      ambito: [, Validators.required],
      tematica: [, Validators.required],
      submotivo: [, Validators.required],
      descripcion: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(this.patternStr)
      ])]
    });

    this.ambito.valueChanges.subscribe(() => {
      this.tematica.setValue(null);
      this.submotivo.setValue(null);
    });

    this.tematica.valueChanges.subscribe(() => {
      this.submotivo.setValue(null);

      if (this.submotivos.length == 1 && this.submotivos[0].nombre == '') {
        this.submotivo.setValue(this.submotivos[0].label);
        this.mostrarSubmotivo = false;
      } 
      else {
        if (this.tematica.valid && this.submotivos.length > 0) {
          this.mostrarSubmotivo = true;
        }
      }
    });

  }
  async ngOnInit() {
    const principal = await this.profile.getStorage('principal');

    if (principal) {
      const programa = principal.programas[principal.programaIndex];
      const sedeCcod = programa.sedeCcod;
      const status = await this.profile.getStorage('status');

      if (status && ('centroAyuda' in status)) {
        if (status.centroAyuda.indexOf(sedeCcod) > -1) {
          this.mostrarCentroAyuda = true;
        }
      }

      if (this.mostrarCentroAyuda) {
        this.cargar();
      }
      else {
        this.mostrarCargando = false;
      }
    }

    this.api.marcarVista(VISTAS_ALUMNO.CENTRO_AYUDA)
  }
  async cargar() {
    try {
      let result = await this.api.getPrincipal();

      if (result.success) {
        const { data } = result;
        this.categorias = data.categorias;
        this.procesarCasos(data.casos || []);
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
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;

    setTimeout(() => {
      this.cargar()
    }, 500);
  }
  async mostrarDetalle(caso: any, modal: IonModal) {
    const loading = await this.loading.create({ message: 'Cargando...' });
    const params = { numero: caso.caseNumber };

    loading.present();

    try {
      const response = await this.api.getCaso(params);

      if (response.success) {
        this.caso = response.data;
        modal.present();
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      loading.dismiss();
    }
  }
  onDetalleDismiss(e?: any) {
    this.events.app.next({ action: 'app:modal-dismiss' });
  }
  async crearCaso() {
    this.submitted = true;

    if (this.form.valid) {
      let loading = await this.loading.create({ message: 'Procesando...' });
      let params = {
        submotivo: this.submotivo.value,
        descripcion: this.descripcion.value
      };

      await loading.present();

      try {
        let result = await this.api.crearCaso(params);

        if (result.success) {
          this.presentSuccess('Su caso ha sido recibido correctamente.');
          this.procesarCasos(result.data.casos || []);
          this.resetForm();
        } 
        else {
          this.presentError(result.message);
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
          return;
        }
      }
      finally {
        loading.dismiss();
      }
    }
    else {
      this.snackbar.showToast('Existen errores en la información.')
    }
  }
  async presentSuccess(text: string) {
    let alert = await this.alert.create({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Nueva Caso',
      cssClass: 'success-alert',
      message: `<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>${text}`,
      buttons: [
        {
          text: 'Aceptar',
          handler: async () => { }
        }
      ]
    });

    await alert.present();
  }
  async presentError(text?: string) {
    const message = text ? text : 'Hubo un error enviando su solicitud. Comuníquese con la asistencia telefónica.';

    let alert = await this.alert.create({
      backdropDismiss: false,
      keyboardClose: false,
      header: 'Error',
      message: message,
      buttons: [
        {
          text: 'Cerrar',
          role: 'ok',
          handler: () => { }
        }
      ]
    });

    await alert.present();
  }
  procesarCasos(casos: any[]) {
    this.casos = casos.sort((a, b) => {
      return (parseInt(a.caseNumber) > parseInt(b.caseNumber)) ? -1 : 1;
    })
  }
  resetForm() {
    this.ambito.setValue('');
    this.tematica.setValue('');
    this.submotivo.setValue('');
    this.descripcion.setValue('');
    this.submitted = false;
    this.form.markAsUntouched();
    this.form.reset()
  }

  get ambitos() {
    if (this.categorias) {
      let ambitos = [];

      for (let item in this.categorias.ambitos) {
        ambitos.push(item)
      }

      return ambitos.sort();
    }

    return [];
  }
  get tematicas() {
    if (this.ambito.value) {
      let tematicas = [];

      for (let item in this.categorias.ambitos[this.ambito.value].tematicas) {
        tematicas.push(item)
      }

      return tematicas.sort();
    }

    return [];
  }
  get submotivos() {
    if (this.tematica.value) {
      let submotivos = [];

      for (let item in this.categorias.ambitos[this.ambito.value].tematicas[this.tematica.value].submotivos) {
        let submotivo = this.categorias.ambitos[this.ambito.value].tematicas[this.tematica.value].submotivos[item];
        submotivos.push(submotivo);
      }

      return submotivos.sort();
    }

    return [];
  }
  get mostrarTematicas() {
    return this.ambito.valid === true;
  }
  get ambito() { return this.form.get('ambito'); }
  get tematica() { return this.form.get('tematica'); }
  get submotivo() { return this.form.get('submotivo'); }
  get descripcion() { return this.form.get('descripcion'); }
  get routerOutletEl() {
    return this.routerOutlet.nativeEl;
  }

}
