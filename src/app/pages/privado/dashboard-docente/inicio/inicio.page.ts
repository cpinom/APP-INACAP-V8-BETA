import { Component, ElementRef, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { AlertController, IonContent, IonModal, IonRouterOutlet, LoadingController, NavController, Platform } from '@ionic/angular';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CredencialVirtualPage } from '../perfil/credencial-virtual/credencial-virtual.page';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';
import { localeEs, MbscEventcalendarView, MbscEventClickEvent, MbscPageChangeEvent } from '@mobiscroll/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import * as moment from 'moment';
import { EstacionamientosService } from 'src/app/core/services/http/estacionamientos.service';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { PeriodosComponent } from 'src/app/core/components/periodos/periodos.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('ramos', { read: ElementRef }) public ramosContent!: ElementRef<any>;
  @ViewChild(PeriodosComponent) periodosCmp!: PeriodosComponent;
  avisosDestacados: any;
  cargandoClases!: boolean;
  fechaSemana: any = moment();
  clases: any;
  cursos: any;
  fechaHorario: any = moment().toDate();//.format('YYYY-MM-DD');
  mostrarData = false;
  multipleSedes = false;
  sedeCcod: any;
  status: any;
  errorStatus = false;
  ultimaCarga: string | undefined;
  urlMoodle = 'https://lms.inacap.cl/auth/saml2/login.php?wants=https://lms.inacap.cl/my/';
  periodoForm: FormGroup;
  principal: any;
  inacapMail: any;
  mostrarCargando = true;
  mostrarError = false;
  scrollObs: Subscription;

  cargandoEstados = false;

  myView: MbscEventcalendarView = {
    calendar: { type: 'week' },
    agenda: { type: 'day' }
  };
  pickerLocale = localeEs;
  theme: string;
  themeVariant: any;
  eventosHorario: any;

  private api = inject(DocenteService);
  private estacionmientosApi = inject(EstacionamientosService);
  private alert = inject(AlertController);
  private error = inject(ErrorHandlerService);
  private profile = inject(ProfileService);
  private auth = inject(AuthService);
  private utils = inject(UtilsService);
  private fb = inject(FormBuilder);
  private snackbar = inject(SnackbarService);
  private events = inject(EventsService);
  private dialog = inject(DialogService);
  private loadingCtrl = inject(LoadingController);
  private routerOutlet = inject(IonRouterOutlet);
  private global = inject(AppGlobal);
  private router = inject(Router);
  private nav = inject(NavController);
  private pt = inject(Platform);

  constructor() {

    moment.locale('es');

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 0 && this.router.url == '/dashboard-docente/inicio') {
        this.content?.scrollToTop(500);
        this.ramosContent && this.ramosContent.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });

    this.periodoForm = this.fb.group({
      periodo: ['', Validators.required]
    });

    this.periodo?.valueChanges.subscribe(async (value) => {
      await this.guardarPeriodo(value);
    });

    this.theme = this.pt.is('ios') || this.pt.is('mobileweb') ? 'ios' : 'material';
    this.themeVariant = this.profile.isDarkMode() ? 'dark' : 'light';
  }
  async ngOnInit() {

  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async ionViewWillEnter() {
    this.mostrarCargando = true;
    await this.cargar();
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

        if (!principal.sedeCcod) {
          if (principal.sedes.length == 1) {
            principal.sedeCcod = principal.sedes[0].sedeCcod;
          }
          else if (principal.sedes.length > 1) {
            if (forzar) {
              const loading = await this.loadingCtrl.getTop();

              if (loading) {
                await loading.dismiss();
              }
            }

            principal.sedeCcod = await this.resolverSede(principal.sedes);
          }
        }
      }
    }
    catch {
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

        if (this.pt.is('mobileweb')) {
          const fechaActual = moment(this.fechaHorario);
          const fechaInicio = moment(periodo.acpeFinicio, 'DD/MM/YYYY');
          const fechaFin = moment(periodo.acpeFtermino, 'DD/MM/YYYY');
          const estaEnRango = fechaActual.isBetween(fechaInicio, fechaFin, 'day', '[]');

          if (!estaEnRango) {
            this.fechaHorario = fechaInicio.toDate();
          }
        }
      }

      this.principal = principal;
      this.cursos = principal.cursos;
      this.sedeCcod = principal.sedeCcod;
      this.mostrarData = true;
      this.profile.setStorage('principal', principal);
      this.events.app.next({ action: 'app:docente-principal' });
      this.cargarStatus();
      this.cargarHorario();
      this.mostrarCargando = false;
      this.cargarCorreos();
    }

  }
  recargar(e?: any) {
    this.mostrarError = false;
    // this.mostrarCargando = true;
    setTimeout(() => {
      this.cargar(true).finally(() => {
        e && e.target.complete();
      });
    }, 500);
  }
  async seccionTap(data: any) {
    await this.nav.navigateForward(`${this.router.url}/seccion`, { state: data });
  }
  async resolverSede(sedes: any[]) {
    let inputs = [];
    let sedeCcod = sedes[0].sedeCcod;

    inputs = sedes.map(t => {
      return {
        value: t.sedeCcod,
        label: t.sedeTdesc,
        type: 'radio' as 'radio',
        checked: t.sedeCcod == sedeCcod
      }
    });

    let alert = await this.alert.create({
      backdropDismiss: false,
      keyboardClose: false,
      header: 'Seleccione una Sede',
      buttons: [
        {
          text: 'Continuar',
          role: 'destructive'
        }
      ],
      inputs: inputs,
    });

    await alert.present();

    const sedeResult = await alert.onWillDismiss();

    if (sedeResult.role == 'destructive') {
      if (sedeResult.data && sedeResult.data.values) {
        return Promise.resolve(sedeResult.data.values);
      }
    }

    return Promise.resolve();
  }
  async cargarHorario() {
    if (!this.sedeCcod) {
      this.eventosHorario = undefined;
      return;
    }

    const fechaLunes = moment(this.fechaHorario).clone().startOf('week');
    const fechaInicio = fechaLunes.clone().startOf('week').format('DD/MM/YYYY');
    const fechaTermino = fechaLunes.clone().add(5, 'day').format('DD/MM/YYYY');

    this.cargandoClases = true;

    try {
      const result = await this.api.getHorarioV6(fechaInicio, fechaTermino);

      if (result.success) {
        var eventos: any[] = [];
        var horario = result.data;

        if (horario.length) {
          horario.forEach((dia: any) => {
            dia.eventos.forEach((bloque: any) => {
              let cssClass = '';

              if (bloque.estado == 1) cssClass = 'suspendida';
              if (bloque.estado == 2 || bloque.estado == 4) cssClass = 'progreso';
              if (bloque.estado == 3) cssClass = 'realizada';

              eventos.push({
                title: `${bloque.asignatura}<br/>Sección: ${bloque.seccion}<br/>Sala: ${bloque.sala}`,
                start: moment(`${dia.fecha} ${bloque.horaInicio}`, 'DD/MM/YYYY HH:mi').toDate(),
                end: moment(`${dia.fecha} ${bloque.horaTermino}`, 'DD/MM/YYYY HH:mi').toDate(),
                cssClass: cssClass,
                data: bloque
              })

            });
          })
        }

        this.eventosHorario = eventos;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.cargandoClases = false;
    }
  }
  async cargarStatus() {
    if (!this.sedeCcod) {
      this.status = undefined;
      this.profile.removeStorage('status');
      return;
    }

    try {
      const result = await this.api.getConfiguracionesV6(this.sedeCcod);

      if (result.success) {
        Object.assign(result.data, { loaded: moment().format('DDMMYYYYHHmmss') });
        this.status = result.data;
        this.profile.setStorage('status', this.status);
        this.errorStatus = false;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
      this.errorStatus = true;
      this.profile.getStorage('status').then(status => {
        if (status.loaded) {
          this.ultimaCarga = 'Última actualización: ' + moment(status.loaded, 'DDMMYYYYHHmmss').format('DD/MM/YYYY HH:mm');
        }
      })
    }
    finally { }
  }
  async cargarCorreos() {
    try {
      const result = await this.api.getCorreosV5();

      if (result.success) {
        this.inacapMail = result.inbox;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
  }
  async periodoSeleccionado(periCcod: any) {
    this.periodo?.setValue(periCcod);
  }
  async guardarPeriodo(periCcod: any) {
    const loading = await this.dialog.showLoading({ message: 'Guardando...' });
    let revertirCambios = false;

    this.dialog.dismissModal

    try {
      const params = { periCcod: periCcod };
      const result = await this.api.guardarPeriodoV5(params);

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
        await this.error.handle(error);
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
        const periodo = (principal.periodos as any[]).filter(t => t.periCcod == principal.periodo)[0];

        this.periodo?.setValue(periodo.periCcod, { emitEvent: false });
        this.periodosCmp?.aplicarPeriodo(periodo.periCcod);
      }
      catch { }
    }
  }
  async onHorarioChange(args: MbscPageChangeEvent) {
    this.fechaHorario = moment(args.firstDay);
    this.cargarHorario();
  }
  async onSeccionClick(args: MbscEventClickEvent) { }
  async logout() {
    await this.auth.tryLogout();
  }
  async errorAlert(errorMsg?: any) {
    let message = 'El servicio no se encuentra disponible o presenta algunos problemas de cobertura, reintenta en un momento.';
    if (errorMsg) {
      message = errorMsg;
    }
    const alert = await this.alert.create({
      header: 'INACAP Móvil',
      message: message,
      buttons: ['Aceptar']
    });
    alert.present();
    return;
  }
  async credencialVirtual() {
    await this.dialog.showModal({
      component: CredencialVirtualPage,
      presentingElement: this.routerOutlet.nativeEl
    });
  }
  resolverEstado(estadoClase: any) {
    switch (estadoClase) {
      case 1:
        return ['green', ''];
      case 2:
        return ['red', 'Suspendida']; // Texto manipulable desde la API, para avisar tb Cambio de Sala
      case 3:
        return 'blue';
      default:
        return 'gray';
    }
  }
  resolverNotaRojo(nota: number) {
    if (nota < 4) {
      return 'rojo';
    }
    return '';
  }
  async moodleTap() {
    try {
      let auth = await this.auth.getAuth();
      let url = `${this.global.Api || 'http://localhost:49446'}/Moodle?user=${auth.user.data.persNcorr}&token=${auth.private_token}`;

      await this.utils.openLink(url);
    }
    catch {
      await this.utils.openLink(this.urlMoodle);
    }

    this.api.marcarVista(VISTAS_DOCENTE.AAI);
  }
  microsoftTeamsTap() {
    this.utils.openLink('https://teams.microsoft.com/');
    this.api.marcarVista(VISTAS_DOCENTE.MICROSOFTTEAMS);
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:docente-notificaciones' });
  }
  async mostrarDetalleEstacionamiento(e: Event, modal: IonModal) {
    e.preventDefault();

    const { estados } = this.status.estacionamientos;

    if (estados) {
      await modal.present();
    }
  }
  async recargarEstacionamientos() {
    this.cargandoEstados = true;

    try {
      let sedeCcod = this.sedeCcod;
      let aepeNcorr = 2;
      let response = await this.estacionmientosApi.getEstados(sedeCcod, aepeNcorr);

      if (response.success) {
        this.status.estacionamientos.estados = response.estados;
        this.status.estacionamientos.perfilEstados = response.perfilEstados;
      }
    }
    catch (error: any) {
      if (error && error.status) {
        await this.error.handle(error);
      }
    }
    finally {
      this.cargandoEstados = false;
    }
  }
  ocultarDescatado(index: number) {
    if (index == 1) {
      this.principal.mostrarEstacionamientos = false;
      this.profile.setStorage('principal', this.principal);
    }
  }
  get estacionamiento() {
    if (this.mostrarEstacionamientos) {
      const { estacionamientos } = this.status;
      const { postulacion, estados } = estacionamientos;

      if (estados) {
        if (estados.disponibles > 0) {
          return { cls: 'success', text: 'Estacionamientos disponibles', icon: postulacion.aeveTicono }
        }
        else {
          return { cls: 'danger', text: 'Estacionamiento completo', icon: postulacion.aeveTicono }
        }
      }
    }

    return { cls: 'secondary', text: 'No Disponible', icon: 'error' };
  }
  get mostrarEstacionamientos() {
    if (this.principal && !this.principal.mostrarEstacionamientos) {
      return false;
    }

    if (this.status && this.status.estacionamientos) {
      const { estacionamientos } = this.status;
      const { postulacion, perfilEstados } = estacionamientos;

      if (perfilEstados && perfilEstados.estado == 1) {
        if (postulacion && postulacion.aepeCcod == 2) {
          return true;
        }
      }
    }

    return false;
  }
  get mostrarReservaEspacios() {
    if (this.pt.is('mobileweb')) {
      return true;
    }
    if (this.status) {
      return this.status.reservaEspacios === true;
    }
    return false;
  }
  get mostrarTutorias() {
    if (this.status) {
      return this.status.tutor === true;
    }
    return false;
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
  get periodo() { return this.periodoForm.get('periodo'); }
  get version() {
    return this.global.Version;
  }

}
