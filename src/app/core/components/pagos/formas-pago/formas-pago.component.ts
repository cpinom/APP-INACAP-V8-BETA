import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../services/snackbar.service';
import * as webpay from './webpay';
import * as cupon from './cupon';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.scss'],
})
export class FormasPagoComponent implements OnInit {

  pagoForm: FormGroup;
  formasPago!: any[];
  pagoId!: number;
  montoCarro!: string;

  constructor(private fb: FormBuilder,
    private snackbar: SnackbarService,
    private dialog: DialogService) {
    this.pagoForm = this.fb.group({
      tpaoCcod: ['', Validators.required]
    });
  }
  ngOnInit() { }
  async procesar() {
    if (!this.pagoForm.valid) {
      await this.snackbar.showToast('Debe elegir una forma de pago.');
      return;
    }

    const params = {
      tpaoCcod: this.pagoForm.get('tpaoCcod')?.value,
      paonNcorr: this.pagoId

    };

    await this.dialog.dismissModal(params);
  }
  resolverImagen(tpaoCcod: any) {
    if (tpaoCcod == 12) {
      return cupon.imgBase64;
    }
    else {
      return webpay.imgBase64;
    }
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
