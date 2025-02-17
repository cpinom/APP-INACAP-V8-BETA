import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { IonContent, NavController } from '@ionic/angular';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { Router } from '@angular/router';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.page.html',
  styleUrls: ['./cursos.page.scss'],
})
export class CursosPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  persNcorr: any;
  cursos: any;
  multiplesSedes = false;
  sedes: any;
  periodoText!: string;
  periodoForm: FormGroup;
  principal: any;
  mostrarData = false;
  mostrarCargando = true;
  subscription: Subscription;

  private api = inject(DocenteService);
  private error = inject(ErrorHandlerService);
  private profile = inject(ProfileService);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);
  private fb = inject(FormBuilder);
  private events = inject(EventsService);
  private nav = inject(NavController);
  private router = inject(Router);
  private global = inject(AppGlobal);

  constructor() {

    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 1) {
        this.content?.scrollToTop(500);
      }
    });

    this.periodoForm = this.fb.group({
      periodo: ['', Validators.required]
    });

    this.periodo?.valueChanges.subscribe((value) => {
      this.guardarPeriodo(value);
    });

  }
  async ngOnInit() {
    this.api.marcarVista(VISTAS_DOCENTE.CURSOS);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  async ionViewWillEnter() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    this.cargar();
  }
  async cargar(forzar?: boolean) {
    let principal_storaged = await this.profile.getStorage('principal');
    let principal;

    try {
      const result = await this.api.getPrincipalV6();

      if (result.success) {
        principal = result.data;
        principal.mostrarEstacionamientos = true;
        principal.sedeCcod = undefined;

        if (principal_storaged && !forzar) {
          principal.mostrarEstacionamientos = principal_storaged.mostrarEstacionamientos;
          principal.sedeCcod = principal_storaged.sedeCcod;
        }

        if (!principal.sedeCcod && principal.sedes.length) {
          principal.sedeCcod = principal.sedes[0].sedeCcod;
        }
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return;
      }

      if (principal_storaged != null) {
        principal = principal_storaged;
        principal.mostrarEstacionamientos = principal_storaged.mostrarEstacionamientos;
        principal.sedeCcod = principal_storaged.sedeCcod;
      }
    }

    if (principal) {
      const periodo = (principal.periodos as any[]).filter(t => t.periCcod == principal.periodo)[0];

      if (periodo) {
        this.periodo?.setValue(periodo.periCcod, { emitEvent: false });
        this.periodoText = periodo.periTdesc;
      }

      this.principal = principal;
      this.sedes = principal.sedes;
      this.multiplesSedes = this.sedes.length > 1;
      this.cursos = principal.cursos;
      this.profile.setStorage('principal', principal);
    }

    this.mostrarData = true;
    this.mostrarCargando = false;

  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar(true);
    }, 500);
  }
  async periodoSeleccionado(periCcod: any) {
    this.periodo?.setValue(periCcod);
  }
  async guardarPeriodo(periCcod: any) {
    let loading = await this.dialog.showLoading({ message: 'Guardando...' });
    let revertirCambios = false;

    try {
      let params = { periCcod: periCcod };
      let result = await this.api.guardarPeriodoV5(params);

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
      await this.snackbar.showToast('No fue posible completar la solicitud.', 3000, 'danger');
    }
    finally {
      await loading.dismiss();
    }

    if (revertirCambios) {
      try {
        const principal = await this.profile.getStorage('principal');
        const periodo = (principal.periodos as any[]).filter(t => t.periCcod == principal.periodo)[0];

        this.periodo?.setValue(periodo.periCcod, { emitEvent: false });
        this.periodoText = periodo.periTdesc;
      }
      catch { }
    }
  }
  async seccionTap(data: any) {
    await this.nav.navigateForward(`${this.router.url}/seccion`, { state: data });
  }
  resolverRegimen(carrera: any, regimen: any) {
    return parseInt(carrera.jornCcod) === regimen;
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:docente-notificaciones' })
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
  get periodo() { return this.periodoForm.get('periodo'); }

}
