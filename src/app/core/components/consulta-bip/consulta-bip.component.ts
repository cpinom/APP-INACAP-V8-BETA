import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppGlobal } from 'src/app/app.global';
import { ConsultaBipService } from '../../services/http/consultabip.service';
import { numberLength } from '../../validators/numberLength.validators';
import * as moment from 'moment';
import { SnackbarService } from '../../services/snackbar.service';
import { IonItemSliding } from '@ionic/angular';
//http://pocae.tstgo.cl/PortalCAE-WAR-MODULE/
@Component({
  selector: 'consulta-bip-cmp',
  templateUrl: './consulta-bip.component.html',
  styleUrls: ['./consulta-bip.component.scss'],
})
export class ConsultaBipComponent implements OnInit {

  @ViewChild(IonItemSliding) slidingItem!: IonItemSliding;
  @Input('rol') rol!: string;
  bipForm: FormGroup;
  estadoBoton: boolean = true;
  data: any;
  tarjetas: any[] = [];
  consultandoSaldos = false;
  submitted = false;

  private api = inject(ConsultaBipService);
  private global = inject(AppGlobal);
  private snackbar = inject(SnackbarService);
  private formBuilder = inject(FormBuilder);

  constructor() {

    this.bipForm = this.formBuilder.group({
      codigo: [this.global.Integration ? '41271178' : '', Validators.compose([
        numberLength(0, 14),
        Validators.required
      ])]
    });

  }

  async ngOnInit() {
    let tarjetas = await this.getTarjetas();
    let saldos = [];

    if (this.permitirGuardar && tarjetas.length) {
      // this.consultandoSaldos = true;

      // try {
      //   for (const item of tarjetas) {
      //     let result = await this.getInfo(item.id);
      //     saldos.push(result);
      //   }
      // } catch {
      //   saldos = tarjetas;
      // } finally {
      //  this.consultandoSaldos = false;
      // }
      this.consultandoSaldos = false;
      this.tarjetas = tarjetas;
    }
  }
  async getInfo(codigo: string) {
    return this.api.getSaldoBip({ codigo: codigo });
  }
  async consultar() {
    this.submitted = true;

    if (this.bipForm.valid) {
      this.estadoBoton = false;

      try {
        let codigo = this.codigo?.value;
        let existeCodigo = false;

        this.tarjetas.forEach((item: any) => {
          if (item.id == codigo) existeCodigo = true;
        });

        if (!existeCodigo) {
          let result = await this.getInfo(codigo);

          if (result.success) {
            this.data = result
          }
          else {
            this.codigo?.setValue('');
            this.snackbar.showToast(result.message);
          }
        }
        else {
          this.codigo?.setValue('');
          await this.snackbar.showToast('El código ya existe en sus tarjetas guardadas.');
        }
      }
      catch (error: any) {
        if (error && error.status == 400) {
          await this.snackbar.showToast(error.error.error);
        }
        else {
          await this.snackbar.showToast('Ha ocurrido un error mientras se procesaba su solicitud.');
        }
      }
      finally {
        this.estadoBoton = true;
      }
    }
  }
  async recargar(item: any) {
    item.cargado = false;

    try {
      let result = await this.getInfo(item.id);
      item.saldoTarjeta = result['saldoTarjeta'];
      item.fechaSaldo = result['fechaSaldo'];
      item.fechaConsulta = result['fechaConsulta'];
      item.estadoContrato = result['estadoContrato'];
    } finally {
      item.cargado = true;
    }

    await this.api.setStorage(this.storageName, this.tarjetas);
  }
  async getTarjetas() {
    let tarjetas = await this.api.getStorage(this.storageName);
    return tarjetas || [];
  }
  async guardarTarjeta() {
    if (this.data) {
      this.data.cargado = true;
      this.tarjetas.push(this.data);
      this.data = undefined;
      this.codigo?.setValue('');
      await this.api.setStorage(this.storageName, this.tarjetas);
    }
  }
  async eliminarTarjeta(item: any) {
    this.tarjetas = this.tarjetas.filter(t => t.id !== item.id);
    this.slidingItem.closeOpened();
    await this.api.setStorage(this.storageName, this.tarjetas);
  }
  formatFecha(fechaString: string) {
    const fecha = moment(fechaString, 'DD/MM/YYYY');
    return fecha.format('D [de] MMMM, YYYY. hh:mm');
  }
  get storageName() { return this.rol == 'alumno' ? 'alumno-tarjetas' : 'docente-tarjetas'; }
  get permitirGuardar() { return this.rol == 'alumno' || this.rol == 'docente' }
  get codigo() { return this.bipForm.get('codigo'); }

}
