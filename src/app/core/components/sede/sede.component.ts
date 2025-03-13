import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal, IonRouterOutlet, LoadingController, Platform } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { MensajeService } from '../../services/mensaje.service';
import { SnackbarService } from '../../services/snackbar.service';
import * as moment from 'moment';
import { ProfileService } from '../../services/profile.service';
import { EventsService } from '../../services/events.service';
import { PrivateService } from '../../services/http/private.service';
import { ROLES } from '../../constants/roles';
import { DialogService } from '../../services/dialog.service';
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { CafeteriaComponent } from './cafeteria/cafeteria.component';

@Component({
  selector: 'sede-comp',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss'],
})
export class SedeComponent implements OnInit {

  @Input("rol") rol!: string;
  @Output() onAction: EventEmitter<any> = new EventEmitter();
  @Output() onLoadCompleted: EventEmitter<any> = new EventEmitter();
  @Output() onError: EventEmitter<any> = new EventEmitter();
  @Output() onServicesClick: EventEmitter<any> = new EventEmitter();
  @ViewChild('cafeteria') cafeteriaMdl!: IonModal;
  @ViewChild('biblioteca') bibliotecaMdl!: IonModal;
  _sedeCcod!: string;
  sede: any;
  eventos!: any[];
  bibliotecaData: any;
  cafeterias!: any[];
  cafeteriaData: any;
  //docente
  sedes: any;
  sedeSelected: any;

  mostrarServicios = false;
  mostrarReservas = false;

  private api = inject(PrivateService);
  private utils = inject(UtilsService);
  private pt = inject(Platform);
  private loading = inject(LoadingController);
  private error = inject(ErrorHandlerService);
  private mensaje = inject(MensajeService);
  private snackbar = inject(SnackbarService);
  private profile = inject(ProfileService);
  private events = inject(EventsService);
  private dialog = inject(DialogService);
  private routerOutlet = inject(IonRouterOutlet);

  constructor() { }

  ngOnInit() { }
  async loadData(sedes: any) {
    this.sedes = sedes;

    if (this._sedeCcod != sedes[0].sedeCcod) {
      this._sedeCcod = sedes[0].sedeCcod;
    }
    else if (this._sedeCcod == sedes[0].sedeCcod) {
      return;
    }

    await this.cargarSede();
  }
  async cargarSede() {
    this.sede = undefined;

    try {
      const result = await this.api.getDetalleSedeV5(this._sedeCcod);

      if (result.success) {
        this.sede = result.data.sede;
        this.eventos = result.data.eventos || [];
        this.bibliotecaData = result.data.biblioteca;
        this.cafeterias = result.data.cafeterias || [];

        if (ROLES.ALUMNO == this.rol) {
          if ((this.cafeterias && this.cafeterias.length) || this.bibliotecaData) {
            this.mostrarServicios = true;
          }
        }

        this.profile.getStorage('status').then(status => {
          if (status) {
            this.mostrarServicios = true;
            this.mostrarReservas = status.reservaEspacios == 1;
          }
        });
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      this.onError.emit(error);
    }
    finally {
      this.onLoadCompleted.emit();
    }
  }
  resolverImagen() {
    if (this.sede) {
      return `${this.api.baseUrl}/v3/imagen-sede/${this._sedeCcod}`;
    }
    return '';
  }
  resolverFechaEvento(fecha: string) {
    return moment(fecha, 'DD/MM/YYYY HH:mm').locale('es').format('<b>DD</b> MMM').replace('.', '');
  }
  async mostrarRuta() {
    this.utils.openLink(`https://maps.google.com/maps?daddr=${this.sede.sedeTlatitud},${this.sede.sedeTlongitud}&amp;ll=`);

  }
  async nuevoCorreo(sedeTemail: any) {
    try {
      await this.mensaje.crear(sedeTemail);
    }
    catch (error: any) {
      await this.snackbar.showToast(error, 2000, 'danger');
    }
  }
  async mostrarCafeteria(cafeteria: any) {
    await this.dialog.showModal({
      component: CafeteriaComponent,
      componentProps: { data: cafeteria },
      presentingElement: this.routerOutlet.nativeEl
    })
    // this.cafeteriaData = cafeteria;
    // this.cafeteriaMdl.present();
    // this.onServicesClick.emit('cafeteria');
  }
  async reservasTap() {
    this.onAction.emit('reserva-espacios');
  }
  async descargarMenu() {
    let loading = await this.loading.create({ message: 'Descargando...' });

    await loading.present();

    try {
      let params = { apcaNcorr: this.cafeteriaData.apcaNcorr };
      let result = await this.api.descargarMenuCafeteria(params);
      let fileName = 'menu_' + this.cafeteriaData.apcaNcorr + '.pdf';

      if (result.success) {
        if (this.pt.is('mobileweb')) {
          const linkSource = `data:application/pdf;base64,${result.data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
        else {
          const file = await Filesystem.writeFile({
            path: fileName,
            data: result.data,
            directory: Directory.Cache
          });

          await FileOpener.open({
            filePath: file.uri,
            contentType: 'application/pdf'
          });
        }
      }
    }
    catch (error: any) {
      this.error.handle(error, undefined, true);
    }
    finally {
      await loading.dismiss();
    }
  }
  async mostrarBiblioteca() {
    await this.dialog.showModal({
      component: BibliotecaComponent,
      componentProps: { data: this.bibliotecaData },
      presentingElement: this.routerOutlet.nativeEl
    })
    // this.bibliotecaMdl.present();
    // this.onServicesClick.emit('biblioteca');
  }
  async abrirNavegador(url: string) {
    await this.utils.openLink(url);
  }
  onModalDismiss(e?: any) {
    this.events.app.next({ action: 'app:modal-dismiss' });
  }
  // get routerOutlet() {
  //   return getRouterOutlet(this.rol);
  // }
}

export function getRouterOutlet(rol: string) {
  if (ROLES.DOCENTE == rol) {
    return document.getElementsByTagName('ion-modal')[0];
  }
  return document.getElementById('ion-router-outlet-content');
}

