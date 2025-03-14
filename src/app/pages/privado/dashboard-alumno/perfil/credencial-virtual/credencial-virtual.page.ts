import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ProfileService } from 'src/app/core/services/profile.service';

declare const QRCode: any;

@Component({
  selector: 'app-credencial-virtual',
  templateUrl: './credencial-virtual.page.html',
  styleUrls: ['./credencial-virtual.page.scss'],
})
export class CredencialVirtualPage implements OnInit {

  private dialog = inject(DialogService);
  private profile = inject(ProfileService);

  @ViewChild('barcode') barcode!: ElementRef;
  @ViewChild('qrcode') qrcode!: ElementRef;
  perfil: any;
  programa: any;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    const principal = await this.profile.getStorage('principal');
    this.programa = principal.programas[principal.programaIndex];
    this.perfil = await this.profile.getPrincipal();
    this.generarCodigoQR();
    this.generarCodigoBarra();
  }
  generarCodigoQR() {
    if (!this.perfil) {
      return;
    }

    const options = {
      text: this.getQRCode,
      width: 160,
      height: 160,
      correctLevel: QRCode.CorrectLevel.H
    }

    new QRCode(this.qrcode.nativeElement, options);
  }
  generarCodigoBarra() {
    if (!this.perfil) {
      return;
    }

    const BarCodeText = this.perfil.rut.replace('-', '/');

    JsBarcode(this.barcode.nativeElement, BarCodeText, {
      height: 30,
      width: 1.7,
      displayValue: false,
      format: 'CODE128A',
      lineColor: '#040B15'
    });
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get nombreCompleto() {
    if (this.perfil) {
      if (this.perfil.persTnombreSocial)
        return `${this.perfil.persTnombreSocial} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
      return `${this.perfil.persTnombre} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }
    return '';
  }
  get getQRCode() {
    if (this.perfil)
      return this.perfil.qrCode;
    return 'invalid';
  }
  get mostrarDelegado() {
    return this.perfil && this.perfil.estadoDelegado == 1;
  }
  get mostrarEstacionamiento() {
    if (this.perfil) {
      if (this.perfil.estadoEstacionamiento == 2) return true;
      if (this.perfil.estadoEstacionamiento == 3) return false;
    }
    return null;
  }
  get mostrarAccesibilidad() {
    return this.perfil && this.perfil.estadoAccesibilidad == 1;
  }
  get mostrarTransporte() {
    if (this.perfil && this.perfil.estadoTransporte == 1) {
      if (this.programa && ['AHS', 'AGA', 'L5', 'L6', 'GA', 'HS'].indexOf(this.programa.espeCcod.trim()) > -1) {
        return true;
      }
    }
    return false;
  }

}
