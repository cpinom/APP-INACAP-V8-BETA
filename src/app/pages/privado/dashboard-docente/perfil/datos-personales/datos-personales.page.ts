import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonNav } from '@ionic/angular';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { EditarCorreoPage } from '../../../shared/datos-personales/editar-correo/editar-correo.page';
import { EditarTelefonoPage } from '../../../shared/datos-personales/editar-telefono/editar-telefono.page';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit, OnDestroy {

  perfil: any;
  principal: any;
  status: any;
  subscription: Subscription;

  constructor(private profile: ProfileService,
    private nav: IonNav,
    private events: EventsService,
    private dialog: DialogService,
    private api: DocenteService,
    private error: ErrorHandlerService) {

    this.subscription = this.events.app.subscribe((event) => {
      if (event.action == 'app:docente-datos-refresca') {
        debugger
        this.recargar();
      }
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async ngOnInit() {
    this.status = await this.profile.getStorage('status');
    this.principal = await this.profile.getStorage("principal");
    this.perfil = await this.profile.getPrincipal();
  }

  async recargar() {
    const loading = await this.dialog.showLoading({ message: 'Actualizando...' });

    try {
      const principal = await this.profile.getStorage('principal');
      const sedeCcod = principal.sedeCcod;
      const result = await this.api.getPerfilV6(sedeCcod);

      if (result.success) {
        this.perfil = result.data;
        this.profile.setPrincipal(this.perfil);
      }
    }
    catch (error) {
      this.error.handle(error, undefined, true);
    }
    finally {
      await loading.dismiss();
    }
  }
  async editarCorreo() {
    await this.nav.push(EditarCorreoPage);
  }
  async editarTelefono() {
    await this.nav.push(EditarTelefonoPage);
  }
  get permitirEditar() {
    return true;
    if (this.status && this.status.servicios) {
      if ('sms' in this.status.servicios) {
        return this.status.servicios.sms === true;
      }
    }

    return false;
  }

}
