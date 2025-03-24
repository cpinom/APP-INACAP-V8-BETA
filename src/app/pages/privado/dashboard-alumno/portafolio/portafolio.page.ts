import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IonContent, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { PortafolioService } from 'src/app/core/services/http/portafolio.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-portafolio',
  templateUrl: './portafolio.page.html',
  styleUrls: ['./portafolio.page.scss'],
})
export class PortafolioPage implements OnInit, OnDestroy {

  @ViewChild(IonContent) content!: IonContent;
  activeTab = 0;
  scrollObs: Subscription;
  programa: any;
  perfil: any;
  data: any;
  mostrarCargando = true;
  mostrarData = false;

  private events = inject(EventsService);
  private global = inject(AppGlobal);
  private api = inject(PortafolioService);
  private pt = inject(Platform);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);
  private profile = inject(ProfileService);
  private nav = inject(NavController);
  private router = inject(Router);

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 2) {
        this.content?.scrollToTop(500);
        this.activeTab = 0;
      }
    });

  }
  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    this.programa = await this.profile.getPrograma();
    this.perfil = await this.profile.getPrincipal();

    try {
      const { matrNcorr, carrCcod, planCcod } = this.programa;
      const result = await this.api.getPrincipal(matrNcorr, carrCcod, planCcod);

      if (result.success) {
        this.data = result.data;
      }
    }
    catch (error: any) { }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }
  resolverPorcentaje(value: string) {
    // Reemplaza la coma por un punto y convierte a número
    let numericValue = parseFloat(value.replace(",", "."));

    // Si el valor es negativo, lo deja en 0
    if (numericValue < 0) {
      return 0;
    }

    // Convierte a decimal (dividiendo por 100)
    return numericValue / 100;
  }
  resolverRiesgos() {
    if (this.data) {
      // return this.data.riesgosAcademicos.filter((item: any) => {
      //   item.alnoCriesgoAlumno == 'RA' || item.alnoCriesgoAlumno == 'R/A' ||
      //     item.alnoCriesgoAlumno == 'RN' || item.alnoCriesgoAlumno == 'R/N' ||
      //     item.alnoCriesgoAlumno == 'RNA' || item.alnoCriesgoAlumno == 'R/NA'
      // }).length;
      return this.data.riesgosAcademicos.filter((item: any) => item.alnoCriesgoAlumno !== 'SR').length;
    }
    return '';
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async riesgosAcademicosTap() {
    await this.nav.navigateForward(`${this.router.url}/progresion/riesgos-academicos`, { state: this.data.riesgosAcademicos });
  }
  // async descargar() {
  //   const loading = await this.dialog.showLoading({ message: 'Exportando...' });

  //   try {
  //     const result = await this.api.descargarPortafolio({});
  //     debugger

  //     if (result.success) {
  //       if (this.pt.is('mobileweb')) {
  //         const linkSource = `data:application/pdf;base64,${result.data.base64}`;
  //         const downloadLink = document.createElement('a');
  //         downloadLink.href = linkSource;
  //         downloadLink.download = result.data.nombreArchivo;
  //         downloadLink.click();
  //       }
  //       else {
  //         const fileResult = await Filesystem.writeFile({
  //           path: result.data.nombreArchivo,
  //           data: result.data.base64,
  //           directory: Directory.Cache
  //         });

  //         await FileOpener.open({
  //           filePath: fileResult.uri,
  //           contentType: 'application/pdf'
  //         });
  //       }
  //     }
  //     else {
  //       throw Error();
  //     }
  //   }
  //   catch (error: any) {
  //     if (error && error.status == 401) {
  //       await this.error.handle(error);
  //       return;
  //     }

  //     this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
  //   }
  //   finally {
  //     await loading.dismiss();
  //   }
  // }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }
  get nombreCompleto() {
    if (this.perfil) {
      if (this.perfil.persTnombreSocial)
        return `${this.perfil.persTnombreSocial} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
      return `${this.perfil.persTnombre} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }

    return '';
  }

}
