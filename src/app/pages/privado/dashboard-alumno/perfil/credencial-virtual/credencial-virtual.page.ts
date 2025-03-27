import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CapacitorPassToWallet } from '@atroo/capacitor-pass-to-wallet';
import { Platform } from '@ionic/angular';
import JsBarcode from 'jsbarcode';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
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
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);
  private pt = inject(Platform);

  @ViewChild('barcode') barcode!: ElementRef;
  @ViewChild('qrcode') qrcode!: ElementRef;
  perfil: any;
  programa: any;
  generandoPassbook = false;

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
  async walletTap() {
    debugger
    const programa = await this.profile.getPrograma();
    const perfil = await this.profile.getPrincipal();

    if (perfil) {
      const loading = await this.dialog.showLoading({message:'Generando Wallet...'});

      try {
        this.generandoPassbook = true;

        const params = {
          sedeCcod: programa.sedeCcod,
          sedeTdesc: programa.sedeTdesc,
          carrTdesc: programa.carrTdesc,
          jornTdesc: programa.jornTdesc
        };
        const result = await this.api.getPassbook(params);

        if (result.success) {
          await loading.dismiss();
          const base64 = result.data;
          const passbook = await CapacitorPassToWallet.addToWallet({ base64: base64 });
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

        await this.dialog.showAlert({
          cssClass: 'warning-alert',
          header: 'Credencial Virtual',
          message: `<div class="image"><img src="./assets/images/warning.svg" /><br />Error generando Wallet. Vuelva a intentar más tarde.</div>`,
          buttons: ['Aceptar']
        });
      }
      finally {
        this.generandoPassbook = false;
        await loading.dismiss();
      }
    }
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
  get mostrarPassbook() {
    return false;
    // return this.pt.is('ios');
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
