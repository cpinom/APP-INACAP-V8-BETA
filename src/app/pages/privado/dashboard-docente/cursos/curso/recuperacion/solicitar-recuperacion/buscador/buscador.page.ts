import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonNav, IonPopover, Platform } from '@ionic/angular';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DisponibilidadPage } from '../disponibilidad/disponibilidad.page';
import { EstudiantesPage } from '../estudiantes/estudiantes.page';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
})
export class BuscadorPage implements OnInit {

  @ViewChild('datePicker') datePicker!: IonPopover;
  form: FormGroup;
  equipForm: FormGroup | undefined;
  clase: any;
  seccion: any;
  mostrarData = true;
  data: any;
  submitted = false;
  equipArray: string[] = [];
  equipoTdesc!: string;
  fechaMinimaSolicitud: string = moment().format('YYYY-MM-DD');

  constructor(private api: DocenteService,
    private error: ErrorHandlerService,
    private fb: FormBuilder,
    private dialog: DialogService,
    private nav: IonNav,
    private pt: Platform) {

    this.form = this.fb.group({
      sala: ['', Validators.required],
      fecha: [moment().format('DD/MM/YYYY'), Validators.compose([
        Validators.required,
        Validators.pattern(/[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/)
      ])],
      fechaPicker: [this.fechaMinimaSolicitud],
      horaInicio: ['', Validators.required],
      bloqueUnico: [false],
      equipamiento: [false]
    });

    this.fecha?.valueChanges.subscribe((value) => {
      if (!value) {
        this.fechaPicker?.setValue('', { emitEvent: false });
      }
    });

    this.fechaPicker?.valueChanges.subscribe((date) => {
      const value = moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
      this.fecha?.setValue(value);
      this.datePicker && this.datePicker.dismiss();
    })
  }
  async ngOnInit() {

    if (this.pt.is('mobileweb')) {
      this.fechaMinimaSolicitud = moment('16042024', 'DDMMYYYY').format('YYYY-MM-DD');
      this.fechaPicker?.setValue(moment('16042024', 'DDMMYYYY').format('YYYY-MM-DD'))
    }

    if (!this.data) {
      this.mostrarData = false;

      try {
        let result = await this.api.getRecuperacionCursoV5(this.clase.seccCcod, this.clase.ssecNcorr);

        if (result.success) {
          this.data = result.data;
        }
        else {
          throw Error();
        }
      }
      catch (error: any) {
        await this.error.handle(error);
      }
      finally {
        this.mostrarData = true;
      }
    }
  }
  async buscar() {
    this.submitted = true;

    if (this.form.valid) {
      let loading = await this.dialog.showLoading({ message: 'Espere un momento...' });
      let result: any;

      try {
        const fechaSolicitud = this.fecha?.value;
        const lclaNcorr = this.clase.lclaNcorr;
        const sedeCcod = this.clase.sedeCcod;
        const horaCcod = this.horaInicio?.value;
        const bloqueUnico = this.bloqueUnico?.value ? 1 : 0;
        const tsalCcod = this.sala?.value;
        result = await this.api.buscarBloquesDisponiblesV6(fechaSolicitud, lclaNcorr, horaCcod, bloqueUnico, tsalCcod, sedeCcod);
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
        }
      }
      finally {
        await loading.dismiss();
      }

      if (result.success) {
        await this.nav.push(DisponibilidadPage, {
          bloques: result.bloques,
          data: {
            lclaNcorr: this.clase.lclaNcorr,
            horaCcod: this.horaInicio?.value,
            fechaSolicitud: this.fecha?.value,
            tsalCcod: this.sala?.value,
            equipTdesc: this.equipamiento?.value ? this.equipArray.join(', ') : '',
            seccion: this.data.seccion
          }
        });
      }
      else if (result.alumnos && result.alumnos.length) {
        await this.nav.push(EstudiantesPage, { alumnos: result.alumnos });
      }
      else {
        this.mostrarAlerta(result.message);
      }
    }
  }
  async mostrarAlerta(message: string, callback?: Function) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: 'Recuperación de Clases',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          handler: () => {
            callback && callback();
          }
        }
      ]
    });

    return alert;
  }
  getEquipamiento(e: any, equipo: string) {
    let detail = e.detail.checked;

    if (detail) {
      this.equipArray.push(equipo);
    }
    else {
      let itemIndex;
      this.equipArray.forEach((item, index) => {
        if (item === equipo) {
          itemIndex = index;
        }
      });
      if (itemIndex !== undefined) {
        delete this.equipArray[itemIndex];
      }

      const filtered = this.equipArray.filter(function (el) {
        return el != null;
      });
      this.equipArray = filtered;
    }
  }
  validaDiaDomingo = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0;
  };
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get sala() { return this.form.get('sala'); }
  get fecha() { return this.form.get('fecha'); }
  get fechaPicker() { return this.form.get('fechaPicker'); }
  get horaInicio() { return this.form.get('horaInicio'); }
  get bloqueUnico() { return this.form.get('bloqueUnico'); }
  get equipamiento() { return this.form.get('equipamiento'); }

}
