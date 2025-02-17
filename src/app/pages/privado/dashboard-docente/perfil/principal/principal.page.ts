import { Component, inject, OnInit } from '@angular/core';
import { IonNav, ModalController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MediaService } from 'src/app/core/services/media.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CredencialVirtualPage } from '../credencial-virtual/credencial-virtual.page';
import { DatosPersonalesPage } from '../datos-personales/datos-personales.page';
import { FotoPerfilPage } from '../foto-perfil/foto-perfil.page';
import { SedesPage } from '../sedes/sedes.page';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {

  avatarConfig = { show: true, icon: 'photo_camera', color: '' };
  perfil: any;
  mostrarData = false;
  mostrarCargando = true;

  private dialog = inject(DialogService);
  private profile = inject(ProfileService);



  constructor(private api: DocenteService,
    private error: ErrorHandlerService,
    private nav: IonNav,
    private auth: AuthService,
    private media: MediaService,
    private pt: Platform,
    private snackbar: SnackbarService) { }

  async ngOnInit() {
    await this.cargar(true);
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    this.cargar(true);
  }
  async cargar(forzar?: boolean) {
    const perfil_storaged = await this.profile.getPrincipal();

    if (!perfil_storaged || forzar) {
      const principal = await this.profile.getStorage('principal');
      const sedeCcod = principal.sedeCcod;

      try {
        const result = await this.api.getPerfilV6(sedeCcod);

        if (result.success) {
          this.perfil = result.data;
          this.profile.setPrincipal(this.perfil);
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

    this.mostrarCargando = false;
    this.mostrarData = true;

  }
  async fotoPerfil(inputEl?: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      let file = await this.media.getMedia(true);

      if (file) {
        let fileSize = file.size / 1024 / 1024;

        if (fileSize <= 3) {
          await this.nav.push(FotoPerfilPage, { file: file });
        }
        else {
          this.snackbar.showToast('La imagen no pueden exceder los 3 MB.', 2000);
        }
      }
    }
  }
  async adjuntarPerfil(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var fileSize = file.size / 1024 / 1024;

      if (fileSize <= 3) {
        await this.nav.push(FotoPerfilPage, { file: file });
      }
      else {
        this.snackbar.showToast('La imagen no pueden exceder los 3 MB.', 2000);
      }
    }
  }
  async credencial() {
    this.nav.push(CredencialVirtualPage);
  }
  async datosPersonales() {
    this.nav.push(DatosPersonalesPage);
  }
  async sedes() {
    this.nav.push(SedesPage);
  }
  async logout() {
    await this.auth.tryLogout();
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
  get correo() {
    if (this.perfil) {
      return this.perfil.persTemail;
    }
  }

}
