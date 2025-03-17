import { Component, inject, OnInit } from '@angular/core';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { CredencialVirtualPage } from './credencial-virtual/credencial-virtual.page';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  private events = inject(EventsService);
  private global = inject(AppGlobal);
  private profile = inject(ProfileService);
  private dialog = inject(DialogService);
  private nav = inject(NavController);

  avatarConfig = { show: true, icon: 'edit', color: '' };
  perfil: any;
  programa: any;
  activeTab = 0;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    this.programa = await this.profile.getPrograma();
    this.perfil = await this.profile.getPrincipal();
  }
  async fotoPerfil() {
    await this.nav.navigateForward('/dashboard-alumno/perfil/foto-perfil');
  }
  async credencialVirtual() {
    await this.dialog.showModal({
      cssClass: 'modal-credencial-virtual',
      component: CredencialVirtualPage,
      animated: false
    });
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get nombreCompleto() {
    if (this.perfil) {
      if (this.perfil.persTnombreSocial)
        return `${this.perfil.persTnombreSocial} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
      return `${this.perfil.persTnombre} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }

    return '';
  }
  get correo() {
    if (this.perfil) {
      return this.perfil.persTemail;
    }

    return '';
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
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
