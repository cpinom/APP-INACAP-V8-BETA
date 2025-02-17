import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';

declare const QRCode: any;

@Component({
  selector: 'app-credencial-virtual',
  templateUrl: './credencial-virtual.page.html',
  styleUrls: ['./credencial-virtual.page.scss'],
})
export class CredencialVirtualPage implements OnInit {

  @ViewChild('qrcode') qrcode!: ElementRef;
  mostrarData = false;
  perfil: any;
  persNcorr: any;
  rut!: string;
  sede!: string;

  private auth = inject(AuthService);
  private profile = inject(ProfileService);
  private api = inject(DocenteService);
  private modalCtrl = inject(ModalController);
  private error = inject(ErrorHandlerService);

  constructor() { }

  ngOnInit() {
  }
  async cargar() {
    const auth = (await this.auth.getAuth()).user;
    const perfil_storaged = await this.profile.getPrincipal();
    const principal_storaged = await this.profile.getStorage('principal');
    const sedeCcod = principal_storaged.sedeCcod;

    if (!perfil_storaged) {

      try {
        const result = await this.api.getPerfilV6(sedeCcod);

        if (result.success) {
          this.perfil = result.data;
          this.profile.setPrincipal(this.perfil);
        }
        else {

        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
        }
      }
    }

    if (!this.perfil) {
      this.perfil = perfil_storaged;
    }

    if (sedeCcod) {
      const sede = principal_storaged.sedes.find((t: any) => t.sedeCcod == principal_storaged.sedeCcod);

      if (sede) {
        this.sede = sede.sedeTdesc;
      }
    }

    this.persNcorr = auth.data.persNcorr;
    this.rut = auth.data.rut;
    this.mostrarData = true;
  }
  async ionViewWillEnter() {
    await this.cargar();
  }
  async ionViewDidEnter() {
    this.generarCodigoQR();
  }
  async recargar() {
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar().finally(() => {
        this.generarCodigoQR();
      });
    }, 500)
  }
  generarCodigoQR() {
    if (!this.perfil) {
      return;
    }

    const options = {
      text: this.getQRCode,
      width: 140,
      height: 140,
      correctLevel: QRCode.CorrectLevel.H
    }

    new QRCode(this.qrcode.nativeElement, options);
  }
  async cerrar() {
    await this.modalCtrl.dismiss();
  }
  get nombreCompleto() {
    if (this.perfil) {
      return `${this.perfil.persTnombre} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }
    return '';
  }
  get getQRCode() {
    if (this.perfil)
      return this.perfil.qrCode;
    return 'invalid';
  }
  get mostrarEstacionamiento() {
    if (this.perfil) {
      if (this.perfil.estadoEstacionamiento == 2) return true;
      if (this.perfil.estadoEstacionamiento == 3) return false;
    }
    return null;
  }
  get mostrarCerrar() {
    return true;
  }

}
