import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-practicas',
  templateUrl: './practicas.page.html',
  styleUrls: ['./practicas.page.scss'],
})
export class PracticasPage implements OnInit {

  carrera: any;
  practica: any;

  constructor(private profile: ProfileService,
    private mensaje: MensajeService,
    private api: AlumnoService,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private snackbar: SnackbarService) {
    this.practica = this.router.getCurrentNavigation()?.extras.state;
  }
  async ngOnInit() {
    let principal = await this.profile.getStorage('principal');
    let programa = principal.programas[principal.programaIndex];

    this.carrera = programa;
    this.api.marcarVista(VISTAS_ALUMNO.PRACTICAS);
  }
  async correo(persTemail: string) {
    try {
      await this.mensaje.crear(persTemail);
    }
    catch (error: any) {
      this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  llamar() {
    window.open(`tel:${this.practica.coordinador.contacto}`, '_system');
  }
  get routerOutletEl() { return this.routerOutlet.nativeEl; }
  get backUrl() { return this.router.url.replace('/practicas', '') }

}

