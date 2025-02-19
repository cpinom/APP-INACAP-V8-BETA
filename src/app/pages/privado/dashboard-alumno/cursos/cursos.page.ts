import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  principal: any;
  programa: any;
  periodoForm: FormGroup;
  alertPeriodo = {
    header: 'Período Académico',
    subHeader: 'Selecciona el período que deseas visualizar'
  };
  scrollObs: Subscription;
  reloadObs: Subscription;

  constructor(private profile: ProfileService,
    private loading: LoadingController,
    private api: AlumnoService,
    private error: ErrorHandlerService,
    private global: AppGlobal,
    private events: EventsService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private nav: NavController,
    private router: Router,
    private dialog: DialogService) {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 1) {
        this.content?.scrollToTop(500);
      }
    });

    this.reloadObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:alumno-principal-cursos') {
        this.cargar();
      }
    });

    this.periodoForm = this.fb.group({
      periodo: ['', Validators.required]
    });

    this.periodo?.valueChanges.subscribe((value) => {
      this.guardarPeriodo(value);
    });
  }
  ngOnInit() {
    this.api.marcarVista(VISTAS_ALUMNO.CURSOS);
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
    this.reloadObs.unsubscribe();
  }
  async cargar(forzar?: boolean) {
    let principal: any;
    let principal_storaged = await this.profile.getStorage('principal');

    if (!principal_storaged || forzar) {
      try {
        throw Error();
        principal = {}//await this.api.getPrincipal();
        principal.mostrarDescatados = true;
        principal.mostrarEstacionamientos = true;

        if (forzar && principal_storaged) {
          principal.programaIndex = principal_storaged.programaIndex;
        }
        else {
          principal.programaIndex = 0;
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
          return;
        }
        // this.snackbar.showToast('No es posible cargar tus datos.', 3000, 'danger');
      }
    }
    else {
      principal = principal_storaged;
    }

    if (principal) {
      if (principal.periodos.length) {
        const periodo = (principal.periodos as any[]).filter(t => t.periSeleccionado == true)[0];
        this.periodo?.setValue(periodo.periCcod, { emitEvent: false });
      }

      this.principal = principal;
      this.programa = this.principal.programas[this.principal.programaIndex];

      this.profile.setStorage('principal', principal);
    }
  }
  async ionViewWillEnter() {
    await this.cargar();
  }
  async guardarPeriodo(periCcod: any) {
    let loading = await this.loading.create({ message: 'Guardando...' });
    let revertirCambios = false;

    await loading.present();

    try {
      let params = { periCcod: periCcod };
      let result = await this.api.guardarPeriodo(params);

      if (result.success) {
        await this.cargar(true);

        this.snackbar.showToast(result.message, 3000, 'success');
        this.api.removeStorage('cursos');
        this.api.removeStorage('users');
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
      }
      revertirCambios = true;
      this.snackbar.showToast('No fue posible completar la solicitud.', 3000, 'danger');
    }
    finally {
      await loading.dismiss();
    }

    if (revertirCambios) {
      try {
        const principal = await this.profile.getStorage('principal');
        const periodo = (principal.periodos as any[]).filter(t => t.periSeleccionado)[0];

        this.periodo?.setValue(periodo.periCcod, { emitEvent: false });
      }
      catch { }
    }
  }
  async guardarPrograma() {
    let loading = await this.dialog.showLoading({ message: 'Procesando...' });
    let programaIndex = (this.principal.programas as any[]).findIndex(t => t.matrNcorr == this.programa.matrNcorr);

    try {
      let sedeCcod = this.programa.sedeCcod;
      let planCcod = this.programa.planCcod;
      let result = await this.api.getStatusV5(sedeCcod, planCcod);

      if (result.success) {
        this.principal.programaIndex = programaIndex;
        this.profile.setStorage('status', result.data);
        this.profile.setStorage('principal', this.principal);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
      }
      this.snackbar.showToast('No fue posible completar la solicitud.', 3000, 'danger');
    }
    finally {
      await loading.dismiss();
    }
  }
  resolverAsistencia(value: any, tipo: number) {
    value = value.replace(',', '.');
    return tipo == 1 ? Number(value) / 100 : (tipo == 2 ? Math.round(value) : value);
  }
  async seccionTap(data: any) {
    await this.nav.navigateForward(`${this.router.url}/seccion`, { state: data });
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
  get periodo() {
    return this.periodoForm.get('periodo');
  }
  get periodoText() {
    if (this.principal) {
      let result = (this.principal.periodos as any[]).filter(t => t.periSeleccionado);

      if (result.length) {
        return result[0].periTdesc;
      }
    }

    return '';
  }

}
