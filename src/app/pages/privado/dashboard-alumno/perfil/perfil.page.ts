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
  activeTab = 0;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    const principal = await this.profile.getStorage('principal');

    if (principal) {
      const programa = principal.programas[principal.programaIndex];
      const perfil = await this.profile.getPrincipal();

      if (perfil) {
        this.perfil = perfil;
      }
    }

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

}
