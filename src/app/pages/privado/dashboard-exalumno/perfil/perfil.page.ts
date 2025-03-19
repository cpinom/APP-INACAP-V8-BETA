import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { CredencialVirtualPage } from './credencial-virtual/credencial-virtual.page';
import { UtilsService } from 'src/app/core/services/utils.service';
import { IonContent, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit, OnDestroy {

  private api = inject(ExalumnoService);
  private profile = inject(ProfileService);
  private dialog = inject(DialogService);
  private utils = inject(UtilsService);
  private nav = inject(NavController);
  private auth = inject(AuthService);
  private events = inject(EventsService);

  @ViewChild(IonContent) content!: IonContent;
  scrollObs: Subscription;
  avatarConfig = { show: true, icon: 'edit', color: '' };
  perfil: any;

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 3) {
        this.content?.scrollToTop(500);
      }
    });

  }

  async ngOnInit() {
    await this.cargar();
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async cargar() {
    const result = await this.api.getPerfil();

    if (result.success) {
      this.perfil = result.data.perfil;
      await this.profile.setStorage("profile", this.perfil);
    }
  }
  async fotoPerfilTap() {
    if (this.perfil) {

      if (this.perfil.periCcod == this.perfil.periCcodActual) {
        await this.presentError('Foto Perfil', 'La foto perfil la debes actualizar desde tu perfil de Estudiante.');
        return;
      }

    }
  }
  async actualizarDatosTap() {
    await this.utils.openLink('https://emplea.inacap.cl/account');
  }
  async credencialVirtualTap() {
    await this.dialog.showModal({
      cssClass: 'modal-credencial-virtual',
      component: CredencialVirtualPage,
      animated: false
    });
  }
  async publicoTap() {
    await this.nav.navigateRoot('publico');
  }
  async logoutTap() {
    await this.auth.tryLogout();
  }
  async presentError(title: string, message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: title,
      buttons: ['Aceptar']
    });

    return alert;
  }
  get nombreCompleto() {
    if (this.perfil) {
      return `${(this.perfil.persTnombreSocial || this.perfil.persTnombre)} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }

    return '';
  }
  get correo() {
    if (this.perfil) {
      return this.perfil.persTemailInacap;
    }

    return '';
  }

}
