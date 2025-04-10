import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { IonContent, IonModal, IonRouterOutlet, ModalController, NavController, Platform } from '@ionic/angular';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Haptics } from '@capacitor/haptics';
import { Subscription } from 'rxjs';
import { EventsService } from 'src/app/core/services/events.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import * as moment from 'moment';
import { FCM } from '@capacitor-community/fcm';
import { DatosContactoPage } from './datos-contacto/datos-contacto.page';
import { AccesosDirectosPage } from './accesos-directos/accesos-directos.page';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { InacapMailService } from 'src/app/core/services/http/inacapmail.service';
import { EstacionamientosService } from 'src/app/core/services/http/estacionamientos.service';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { CredencialVirtualPage } from '../perfil/credencial-virtual/credencial-virtual.page';
import { ConfettiService } from 'src/app/core/services/confetti.service';
import { AccesosDirectos } from 'src/app/core/interfaces/alumnos.interfaces';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('ramos', { read: ElementRef }) public ramosContent!: ElementRef<any>;
  @ViewChild('evaluacionesMdl') evaluacionesMdl!: IonModal;
  fechaHorario: any = moment().toDate();
  mostrarDescatados = true;
  mostrarStatus = false;
  errorStatus = false;
  ultimaCarga!: string;
  principal: any;
  status: any;
  programa: any;
  cursos!: any[];
  clases: any;
  cargandoClases = true;
  mostrarData!: boolean;
  descatadoFn: any;
  practica!: boolean;
  numeroEvalInicial = 3;
  numeroEvalMostrando = this.numeroEvalInicial;
  urlMoodle = 'https://lms.inacap.cl/auth/saml2/login.php?wants=https://lms.inacap.cl/my/';
  perfilIncompleto = true;
  evaluaciones!: any[];
  perfilOk!: boolean;
  periodoForm: FormGroup;
  inacapMail: any;
  horarioObservable!: Subscription;
  scrollObs: Subscription;
  reloadObs: Subscription;
  eventos: any;
  accesosDirectos: AccesosDirectos[] = [
    {
      key: 'MOODLE',
      icon: 'assets/icon/cast.svg',
      label: 'Ambiente de Aprendizaje',
      visible: true
    },
    {
      key: 'INACAPMAIL',
      icon: 'assets/icon/outlook.svg',
      label: 'INACAPMail',
      visible: true
    },
    {
      key: 'E-CLASS',
      icon: 'assets/icon/devices.svg',
      label: 'Ambiente de Aprendizaje Online',
      visible: true
    },
    {
      key: 'HORARIO',
      icon: 'assets/icon/date_range.svg',
      label: 'Horario',
      visible: true
    },
    {
      key: 'CREDENCIAL',
      icon: 'assets/icon/qr_code_2.svg',
      label: 'Credencial Virtual',
      visible: true
    },
    {
      key: 'CERTIFICADOS',
      icon: 'assets/icon/description.svg',
      label: 'Certificados',
      visible: true
    },
    {
      key: 'MALLA_CURRICULAR',
      icon: 'assets/icon/table_chart.svg',
      label: 'Malla Curricular',
      visible: true
    },
    {
      key: 'PROGRESION',
      icon: 'assets/icon/trending_up.svg',
      label: 'Mi Progresión',
      visible: true
    },
    {
      key: 'PRACTICA_PROFESIONAL',
      icon: 'assets/icon/assignment_ind.svg',
      label: 'Práctica Profesional',
      visible: true
    },
    {
      key: 'SEGURO_ACCIDENTES',
      icon: 'assets/icon/healing.svg',
      label: 'Seguro de Accidentes',
      visible: true
    },
    {
      key: 'SOLICITUDES',
      icon: 'assets/icon/task.svg',
      label: 'Solicitudes',
      visible: true
    },
    {
      key: 'TEAMS',
      icon: 'assets/icon/teams.svg',
      label: 'Acceso Teams',
      visible: true
    },
    {
      key: 'SEDE',
      icon: 'assets/icon/business.svg',
      label: 'Mi Sede',
      visible: true
    },
    {
      key: 'ONEDRIVE',
      icon: 'assets/icon/cloud.svg',
      label: 'OneDrive',
      visible: true
    },
    {
      key: 'RESERVAS_ESPACIOS',
      icon: 'assets/icon/workspaces.svg',
      label: 'Reserva de Espacios',
      visible: true
    },
    {
      key: 'PORTAL_PAGOS',
      icon: 'assets/icon/account_balance_wallet.svg',
      label: 'Portal de Pagos',
      visible: true
    },
    {
      key: 'VISUALIZACION_PAGOS',
      icon: 'assets/icon/credit_card.svg',
      label: 'Visualización de Pagos',
      visible: true
    }
  ];
  cargandoEstados = false;
  tabsModel = 0;

  private api = inject(AlumnoService);
  private mailApi = inject(InacapMailService);
  private estacionmientosApi = inject(EstacionamientosService);
  private auth = inject(AuthService);
  private profile = inject(ProfileService);
  private global = inject(AppGlobal);
  private utils = inject(UtilsService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);
  private events = inject(EventsService);
  private dialog = inject(DialogService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private routerOutlet = inject(IonRouterOutlet);
  private nav = inject(NavController);
  private pt = inject(Platform);
  private modal = inject(ModalController);
  private confetti = inject(ConfettiService);

  constructor() {

    moment.locale('es');

    this.periodoForm = this.fb.group({
      periodo: ['', Validators.required]
    });

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 0 && this.router.url == '/dashboard-alumno/inicio') {
        this.tabsModel = 0;
        this.content?.scrollToTop(500);
        this.ramosContent && this.ramosContent.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });

    this.reloadObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:alumno-principal-inicio') {
        this.cargar();
      }
    });

    this.profile.getStorage('principal').then(principal => {
      this.perfilOk = !!principal;
    });

    this.periodo?.valueChanges.subscribe((value) => {
      this.guardarPeriodo(value);
    });
  }
  ngAfterViewInit() { }
  async ngOnInit() {
    try {
      const preferencias = await this.profile.getStorage('preferencias');
      const { movil } = preferencias;

      if (movil.accesos_directos && movil.accesos_directos.length > 0) {
        this.accesosDirectos = movil.accesos_directos;
      }
    }
    catch { }
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
    this.reloadObs.unsubscribe();
  }
  async ionViewWillEnter() {
    this.mostrarData = false;

    await this.cargar();
    await this.verificarSaludo();
  }
  async recargar(e?: any) {
    if (!e) {
      this.mostrarData = false;
    }
    setTimeout(() => {
      this.cargar(true).finally(() => {
        e && e.target.complete();
      })
    }, 100)

  }
  async cargar(forzar?: boolean) {
    let principal_storaged = await this.profile.getStorage('principal');
    let principal;

    try {
      const result = await this.api.getPrincipalV5();

      if (result.success) {
        principal = result.data;
        principal.programaIndex = 0;
        principal.mostrarDescatados = true;
        principal.mostrarEstacionamientos = true;
        principal.mostrarFotoPerfil = true;

        if ('mostrarSaludo' in principal) {
          principal.mostrarSaludo = principal_storaged.mostrarSaludo;
        }

        if (!forzar && principal_storaged) {
          principal.programaIndex = principal_storaged.programaIndex;
          principal.mostrarDescatados = principal_storaged.mostrarDescatados;
          principal.mostrarEstacionamientos = principal_storaged.mostrarEstacionamientos;
          principal.mostrarFotoPerfil = principal_storaged.mostrarFotoPerfil;
          principal.mostrarSaludo = principal_storaged.mostrarSaludo;
        }
      }
    }
    catch {
      if (principal_storaged != null) {
        principal = principal_storaged;
      }
    }

    if (principal) {
      if (principal.periodos.length) {
        const periodo = (principal.periodos as any[]).filter(t => t.periSeleccionado == true)[0];

        if (periodo) {
          this.periodo?.setValue(periodo.periCcod, { emitEvent: false });
        }
      }

      this.programa = principal.programas[principal.programaIndex];
      this.cursos = this.procesarCursos(this.programa.asignaturas || []);
      this.evaluaciones = principal.evaluaciones.filter((t: any) => t.planCcod == this.programa.planCcod);
      this.principal = principal;
      this.practica = this.programa.habilitaPractica;
      this.mostrarData = true;
      this.perfilOk = true;
      this.events.app.next({ action: 'app:alumno-principal' });

      if (!this.mostrarOnline) {
        const eClassAccess = this.accesosDirectos.find(t => t.key == 'E-CLASS');

        if (eClassAccess) {
          eClassAccess.disabled = true;
        }
      }

      await this.profile.setStorage('principal', principal);
      await this.cargarHorarioV2();
      await this.cargarStatus();
      this.cargarCorreos();
      this.verificarSuscripciones();
      this.verificarDatosContacto();
    }
    else {
      this.mostrarData = true;
    }
  }
  async cargarHorarioV2() {
    this.cargandoClases = true;

    const periCcod = this.programa.periCcod;
    const sedeCcod = this.programa.sedeCcod;
    const fechaInicio = moment(this.fechaHorario).format('DD/MM/YYYY');

    try {
      const result = await this.api.getAgenda(sedeCcod, periCcod, fechaInicio, fechaInicio);

      if (result.success) {
        this.eventos = result.data.eventos;
      }
      else {
        this.eventos = undefined;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.cargandoClases = false;
    }

  }
  resolverFechaAgenda(index: number) {
    if (index == 0) {
      const agendaDia = moment(this.fechaHorario).format('dddd')
      return agendaDia.charAt(0).toUpperCase() + agendaDia.slice(1);
    }
    else if (index == 1) {
      const agendaFecha = moment(this.fechaHorario).format('D MMM');
      return agendaFecha;
    }

    return '';
  }
  resolverIconoAgenda(item: any, type: number) {
    if (type == 0) {
      if (item.bloqTipo == 'evaluacion')
        return 'notas';
      if (item.bloqTipo == 'seccion' || item.bloqTipo == 'subseccion')
        return 'school';
      if (item.bloqTipo == 'recuperacion')
        return 'schedule';
    }
    else if (type == 1) {
      if (item.bloqTipo == 'evaluacion')
        return 'variant-4';
      if (item.bloqTipo == 'seccion' || item.bloqTipo == 'subseccion')
        return 'variant-3';
      if (item.bloqTipo == 'recuperacion')
        return 'variant-5';
    }

    return '';
  }
  resolverTipoAgenda(item: any) {
    if (item.bloqTipo == 'evaluacion')
      return `Evaluación - ${item.asigTdesc}`;
    if (item.bloqTipo == 'seccion')
      return `Clases - ${item.asigTdesc}`;
    return item.asigTdesc;
  }
  resolverFechaEvaluacion(fecha: string) {
    const fechaFormateada = moment(fecha, "DD/MM/YYYY").format("dddd D [de] MMMM");
    const fechaFinal = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

    return fechaFinal;
  }
  async verEvaluacionesTap() {
    await this.evaluacionesMdl.present();
  }
  procesarCursos(cursos: any[]) {
    if (cursos.length) {
      cursos = cursos.sort((a: any, b: any) => {
        if (a.estadoClase === 1 && b.estadoClase !== 1) {
          return -1;
        }
        if (a.estadoClase !== 1 && b.estadoClase === 1) {
          return 1;
        }
        return 0;
      })
    }

    return cursos;
  }
  async cargarStatus() {
    this.mostrarStatus = true;
    this.errorStatus = false;

    try {
      const sedeCcod = this.programa.sedeCcod;
      const planCcod = this.programa.planCcod;
      const result = await this.api.getStatusV5(sedeCcod, planCcod);

      if (result.success) {
        this.status = result.data;
        //this.status.destacado = { tipo: 2, titulo: '¡Bienvenido a INACAP!', descripcion: 'Estamos muy contentos de tenerte con nosotros. En esta sección encontrarás información relevante para tu vida académica y estudiantil. ¡Éxito en tu semestre!', link: null };

        Object.assign(result.data, { loaded: moment().format('DDMMYYYYHHmmss') });

        await this.profile.setStorage('status', result.data);
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
      this.errorStatus = true;
      this.profile.getStorage('status').then(status => {
        this.ultimaCarga = 'Última actualización: ' + moment(status.loaded, 'DDMMYYYYHHmmss').format('DD/MM/YYYY HH:mm');
      })
    }
    finally {
      this.mostrarStatus = false;
    }
  }
  async cargarCorreos() {
    try {
      const accesoDirecto = this.accesosDirectos.find(t => t.key == 'INACAPMAIL' && t.visible);

      if (!accesoDirecto) return;

      const folderId = await this.mailApi.getStorage('inboxId');
      const result = await this.mailApi.getMailSummary(folderId || '');

      if (result.success) {
        accesoDirecto.count = result.inbox.unReadTotal;
        await this.mailApi.setStorage('inboxId', result.inbox.id);
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
  }
  async accesoDirectoTap(item: any) {

    switch (item.key) {
      case 'MOODLE':
        await this.moodleTap();
        break;
      case 'INACAPMAIL':
        await this.nav.navigateForward('/dashboard-alumno/inicio/inacapmail');
        break;
      case 'E-CLASS':
        await this.moodleOnlineTap();
        break;
      case 'HORARIO':
        await this.nav.navigateForward('/dashboard-alumno/inicio/horario');
        break;
      case 'CREDENCIAL':
        await this.credencialVirtualTap();
        break;
      case 'CERTIFICADOS':
        await this.nav.navigateForward('/dashboard-alumno/inicio/certificados');
        break;
      case 'MALLA_CURRICULAR':
        await this.nav.navigateForward('/dashboard-alumno/inicio/malla-curricular');
        break;
      case 'PROGRESION':
        await this.nav.navigateForward('/dashboard-alumno/inicio/progresion');
        break;
      case 'PRACTICA_PROFESIONAL':
        await this.nav.navigateForward('/dashboard-alumno/inicio/ofertas-practica');
        break;
      case 'SEGURO_ACCIDENTES':
        await this.nav.navigateForward('/dashboard-alumno/inicio/seguro-accidentes');
        break;
      case 'SOLICITUDES':
        await this.nav.navigateForward('/dashboard-alumno/inicio/solicitudes-academicas');
        break;
      case 'TEAMS':
        await this.nav.navigateForward('/dashboard-alumno/inicio/microsoft-teams');
        break;
      case 'SEDE':
        await this.nav.navigateForward('/dashboard-alumno/inicio/sede');
        break;
      case 'ONEDRIVE':
        await this.nav.navigateForward('/dashboard-alumno/inicio/onedrive');
        break;
      case 'RESERVAS_ESPACIOS':
        await this.nav.navigateForward('/dashboard-alumno/inicio/reserva-espacios');
        break;
      case 'PORTAL_PAGOS':
        await this.nav.navigateForward('/dashboard-alumno/inicio/portal-pagos');
        break;
      case 'VISUALIZACION_PAGOS':
        await this.nav.navigateForward('/dashboard-alumno/inicio/cuenta-corriente');
        break;
    }
  }
  get AccesosDirectos() {
    return this.accesosDirectos.filter(t => t.visible);
  }
  async verificarSuscripciones() {
    const preferencias = await this.profile.getPreferencias();

    if (preferencias.movil.hasOwnProperty('notificaciones')) {
      if (preferencias.movil.notificaciones.inacapmail == 1) {
        let storageSubs = await this.mailApi.getStorage('subscription');
        let verifiySubs = true;

        if (storageSubs) {
          let now = moment();
          let expiration_date = moment(storageSubs, 'DD/MM/YYYY hh:mm');

          if (now.isSameOrBefore(expiration_date, 'seconds')) {
            verifiySubs = false;
          }
        }

        if (verifiySubs) {
          try {
            const resultSubs = await this.mailApi.getMailSubscription();

            if (resultSubs.success) {
              this.mailApi.setStorage('subscription', resultSubs.data.fechaExpiracion);
            }
          }
          catch { }
        }
      }
      if (this.programa) {
        const sedeTopic = this.programa.sedeTopic;

        if (preferencias.movil.notificaciones.sede == 1) {
          if (sedeTopic && this.pt.is('capacitor')) {
            try {
              const subscribeTo = await FCM.subscribeTo({ topic: sedeTopic });
            }
            catch { }
          }
        }
        else {
          if (sedeTopic && this.pt.is('capacitor')) {
            try {
              const unsubscribeFrom = await FCM.unsubscribeFrom({ topic: sedeTopic });
            }
            catch { }
          }
        }
      }
    }
  }
  async periodoSeleccionado(periCcod: any) {
    this.periodo?.setValue(periCcod);
  }
  async guardarPeriodo(periCcod: any) {
    const loading = await this.dialog.showLoading({ message: 'Guardando...' });
    let revertirCambios = false;

    try {
      const params = { periCcod: periCcod };
      const result = await this.api.guardarPeriodo(params);

      if (result.success) {
        await this.cargar(true);
        await this.snackbar.showToast(result.message, 3000, 'success');
        await this.api.removeStorage('cursos');
        await this.api.removeStorage('users');
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
      await this.snackbar.showToast('No fue posible completar la solicitud.', 3000, 'danger');
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
  async seccionTap(data: any) {
    const { seccCcod, ssecNcorr } = data;
    const principal = await this.profile.getStorage('principal');
    const programa = principal.programas[principal.programaIndex];
    const asignaturas = programa.asignaturas as any[];
    const seccion = asignaturas.find(item => item.seccCcod == seccCcod);
    const params = {
      asigCcod: seccion.asigCcod,
      asigTdesc: seccion.asigTdesc,
      tasgTdesc: seccion.tasgTdesc,
      modaTdesc: seccion.modaTdesc,
      seccCcod: seccCcod,
      ssecNcorr: ssecNcorr,
      asistencia: seccion.asistencia,
      matrNcorr: programa.matrNcorr,
      periCcod: programa.periCcod
    };

    await this.nav.navigateForward(`${this.router.url}/seccion`, { state: params });
  }
  async mostrarAccesosDirectos() {
    const modal = await this.dialog.showModal({
      component: AccesosDirectosPage,
      componentProps: { data: this.accesosDirectos },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        this.accesosDirectos = result.data;
        this.sincronizarPreferencias();
      }
    });
  }
  async sincronizarPreferencias() {
    let preferencias = await this.profile.getPreferencias();

    preferencias.movil['accesos_directos'] = this.accesosDirectos;

    const loading = await this.dialog.showLoading({ message: 'Guardando...' });

    try {
      await this.api.guardarPreferencias(preferencias);
      await this.profile.setStorage('preferencias', preferencias);
    }
    catch {
      return Promise.resolve(false);
    }
    finally {
      await loading.dismiss();
    }

    return Promise.resolve(true);
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
      let sedeCcod = this.programa.sedeCcod;
      let aepeNcorr = 1;
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
  async verificarDatosContacto() {
    if (this.status) {
      const { datosContacto } = this.status;
      const { actualizarCelular, actualizarCorreo } = datosContacto;
      let cantidad = datosContacto.cantidad;

      if (actualizarCelular == true || actualizarCorreo == true) {
        let actualizaDatos = await this.profile.getStorage('actualizaDatos');

        if (actualizaDatos) {
          cantidad = actualizaDatos.cantidad;

          let esPasado = moment(actualizaDatos.fecha, 'DD/MM/YYYY').isBefore(moment(), 'day');

          if (!esPasado) {
            return;
          }
        }

        const currentModal = await this.modal.getTop();

        if (!currentModal) {
          await this.dialog.showModal({
            component: DatosContactoPage,
            componentProps: {
              actualizarCorreo: actualizarCorreo,
              actualizarCelular: actualizarCelular,
              cantidad: cantidad
            },
            presentingElement: this.routerOutlet.nativeEl,
            canDismiss: async (data?: any, role?: string) => {
              if (role == 'gesture' || role == 'backdrop') {
                return false;
              }
              return true
            }
          });
        }
      }
      else {
        await this.profile.removeStorage('actualizaDatos');
      }
    }
  }
  async verificarSaludo() {
    const principal = await this.profile.getStorage('principal');
    let perfil;

    if (!principal) return;
    if (principal.mostrarSaludo === false) return;

    try {
      let programa = principal.programas[principal.programaIndex];
      let result = await this.api.getPerfilV5(programa.sedeCcod);

      if (result.success) {
        perfil = result.perfil;
        await this.profile.setPrincipal(perfil);

        if (perfil.estadoSolicitudFoto == 0) {
          this.events.app.next({ action: 'app:foto-perfil-enviada' });
        }
      }
    }
    catch { }

    if (perfil && perfil.estadoCumpleanos == 1) {

      const saludo = `Hola ${(perfil.persTnombreSocial || perfil.persTnombre)} 😊<br/>¡Te deseamos un muy feliz cumpleaños! <br/>Gracias por ser parte de INACAP.`;

      await this.confetti.showConfettiAlert('¡¡¡Feliz Cumpleaños!!!', saludo, 10);
      await Haptics.vibrate({ duration: 5000 });

      principal.mostrarSaludo = false;

      await this.profile.setStorage('principal', principal);
    }
  }
  async credencialVirtualTap() {

    await this.dialog.showModal({
      cssClass: 'modal-credencial-virtual',
      component: CredencialVirtualPage,
      animated: false
    });

  }
  async justificacionInasistenciaTap() {
    if (this.mostrarJustificaEvaluacion) {
      const principal = await this.profile.getStorage('principal');
      const programa = principal.programas[principal.programaIndex];
      const params = {
        tisoCcod: 1,
        tisoTdesc: 'Solicitud de Justificación de Inasistencia a una Evaluación',
        planCcod: programa.planCcod
      };

      await this.nav.navigateForward(`${this.router.url}/solicitud-justificacion-inasistencia`, { state: params });
    }
  }
  async alertaPracticaProfesional() {

    if (!this.habilitarPracticas) {
      await this.dialog.showAlert({
        cssClass: 'warning-alert',
        header: 'Práctica Profesional',
        message: `<div class="image"><img src="./assets/images/warning.svg" /><br />El módulo de práctica profesional estará disponible una vez obtenidos los créditos necesarios, según tu plan de estudio.</div>`,
        buttons: [{
          text: 'Aceptar'
        }]
      });
    }

  }
  async longPressTap(e: any) {
    // debugger
    // e.stopPropagation();
    // const { target } = e;
  }
  async moodleTap() {
    try {
      const auth = await this.auth.getAuth();
      const token = encodeURIComponent(auth.private_token);
      const url = `https://siga.inacap.cl/inacap.api.movil/Moodle?user=${auth.user.data.persNcorr}&token=${token}`;

      await this.utils.openLink(url);
    }
    catch {
      await this.utils.openLink(this.urlMoodle);
    }
    finally {
      this.api.marcarVista(VISTAS_ALUMNO.AAI);
    }
  }
  async moodleOnlineTap() {
    await this.utils.openLink('https://spcv.eclass.com/sso/spinitsso-redirect-cv?id=19&portal=811&campus=1104');
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  resolverEstado(estadoClase: any) {
    switch (estadoClase) {
      case 1:
        return ['green'];
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
  resolverAsistenciaRojo(asistencia: number) {
    if (asistencia < 60) {
      return 'rojo';
    }
    return '';
  }
  resolverAsistencia(asistenca: number) {
    return Math.round(asistenca);
  }
  async ocultarDescatado(index: number, e: any) {
    e.stopPropagation();
    if (index == 0) this.principal.mostrarDescatados = false;
    if (index == 1) this.principal.mostrarEstacionamientos = false;
    if (index == 2) this.principal.mostrarFotoPerfil = false;

    await this.profile.setStorage('principal', this.principal);
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
  get periodo() { return this.periodoForm.get('periodo'); }
  get estacionamiento() {
    if (this.mostrarEstacionamientos) {
      const { estacionamientos } = this.status;
      const { postulacion, estados } = estacionamientos;

      if (estados.disponibles > 0) {
        return { cls: 'success', text: 'Estacionamientos disponibles', icon: postulacion.aeveTicono }
      }
      else {
        return { cls: 'danger', text: 'Estacionamiento completo', icon: postulacion.aeveTicono }
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
  get destacado() {
    if (this.status && this.status.destacado) {
      return this.status.destacado;
    }
  }
  get mostrarDestacados() {
    if (this.status && this.status.destacado) {
      if (this.principal.mostrarDescatados) {
        return true;
      }
    }
    return false;
  }
  get mostrarJustificaEvaluacion() {
    if (this.status) {
      return this.status.justificaEvaluacion === true;
    }
    return false;
  }
  get mostrarPostulaciones() {
    if (this.status && this.status.delegados) {
      return this.status.delegados.postulaciones.habilita == true;
    }
    return false;
  }
  get mostrarVotaciones() {
    if (this.status && this.status.delegados) {
      return this.status.delegados.votaciones.habilita == true;
    }
    return false;
  }
  get mostrarReservaEspacios() {
    if (this.status) {
      return this.status.reservaEspacios == 1;
    }
    return false;
  }
  get resolverDestacado() {
    let html = '';

    if (this.destacado) {
      if (this.destacado.link) {
        html += `<a href="${this.destacado.link}">${this.destacado.titulo}</a>`;
      }
      else {
        html += `<div>${this.destacado.titulo}</div>`;
      }
    }

    return html;
  }
  get mostrarOnline() {
    if (this.programa && this.programa.sedeCcod == 47) {
      return true;
    }
    return false;
  }
  get habilitarPracticas() {
    if (this.status) {
      return this.status.habilitaPractica == 1;
    }

    return false;
  }
  get routerOutletEl() {
    return this.routerOutlet.nativeEl;
  }
  async logout() {
    await this.auth.tryLogout();
  }
  get version() {
    return this.global.Version;
  }

}
