import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import JsBarcode from 'jsbarcode';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

declare const QRCode: any;

@Component({
  selector: 'app-credencial-virtual',
  templateUrl: './credencial-virtual.page.html',
  styleUrls: ['./credencial-virtual.page.scss'],
})
export class CredencialVirtualPage implements OnInit {

  private dialog = inject(DialogService);
  private pt = inject(Platform);
  private profile = inject(ProfileService);
  private api = inject(ExalumnoService);

  @ViewChild('barcode') barcode!: ElementRef;
  @ViewChild('qrcode') qrcode!: ElementRef;
  principal: any;
  perfil: any;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    const principal = await this.profile.getStorage('principal');
    const result = await this.api.getPerfil();

    if (result.success) {
      this.perfil = result.data.perfil;
      this.principal = principal;
      await this.profile.setStorage("profile", this.perfil);
      this.generarCodigoQR();
      this.generarCodigoBarra();
    }
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
    if (!this.principal) {
      return;
    }

    const BarCodeText = this.principal.identification.replace('-', '/');

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
      return `${this.perfil.persTnombre} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }

    return '';
  }
  get nombreCarreras() {
    if (this.principal) {
      return this.principal.careers.map((item: any) => item.programName).join(", ");
    }

    return '';
  }
  get getQRCode() {
    if (this.perfil)
      return this.perfil.qrCode;
    return 'invalid';
  }
  get mostrarPassbook() {
    return this.pt.is('ios');
  }

}
