import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { DelegadosService } from 'src/app/core/services/http/delegados.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import * as desconocido from 'src/scripts/foto.desconocido';
import Swiper from 'swiper';

interface DataResult {
  success: boolean,
  candidatos: any,
  academico: any,
  code: number,
  message?: string
}

@Component({
  selector: 'app-votaciones',
  templateUrl: './votaciones.page.html',
  styleUrls: ['./votaciones.page.scss'],
})
export class VotacionesPage implements OnInit, AfterViewInit {

  @ViewChild('swiperEl', { static: false }) private swiperRef!: ElementRef;
  swiper!: Swiper;
  candidatos: any;
  mostrarCargando = true;
  mostrarData = false;
  mostrarCandidatos = false;
  fotoDesconocido = desconocido.imgBase64;
  votoPersona!: string;
  votoEmitido = false;
  academico: any;

  private api = inject(DelegadosService);
  private global = inject(AppGlobal);
  private error = inject(ErrorHandlerService);
  private nav = inject(NavController);
  private snackbar = inject(SnackbarService);
  private cdRef = inject(ChangeDetectorRef);
  private action = inject(ActionSheetController);
  private dialog = inject(DialogService);

  constructor() { }
  async ngOnInit() { }
  async ngAfterViewInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const result: DataResult = await this.api.getVotaciones();

      if (result.success) {
        if (result.code == 1) {
          this.academico = result.academico;
          this.candidatos = result.candidatos;
        }
        else if (result.code == 2) {
          this.votoEmitido = true;
        }
        else if (result.code == 0) {
          this.academico = result.academico;
          this.candidatos = [];
        }
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }

    if (this.mostrarData && this.candidatos && this.candidatos.length) {
      this.cdRef.detectChanges();
      this.swiper = this.swiperRef?.nativeElement.swiper;
      this.swiper.disable();
    }
  }
  async votar() {
    if (this.votoPersona) {
      const confirmar = await this.confirmar('¿Estás seguro de que deseas emitir tu voto?');

      if (!confirmar) return;

      const loading = await this.dialog.showLoading({ message: 'Enviando Voto...' });
      const info = this.candidatos[0];
      const params = {
        persNcorr: this.votoPersona,
        sedeCcod: info.sedeCcod,
        jornCcod: info.jornCcod,
        carrCcod: info.carrCcod,
        niveCcod: info.niveCcod
      };

      try {
        const result = await this.api.enviarVoto(params);

        if (result.success && result.code == 1) {
          await loading.dismiss();
          await this.presentarOk('Tu voto ha sido enviado existosamente.');
          return;
        }

        throw Error();
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }

        await this.snackbar.showToast('No se pudo procesar tu solicitud. Vuelve a intentar.');
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  presentarCandidatos() {
    this.swiper.enable();
    this.swiper.slideNext();
    this.swiper.disable();
  }
  resolverFoto(persNcorr: any) {
    return `${this.global.Api}/api/v3/imagen-persona/${persNcorr}`;
  }
  async presentarOk(message: string) {
    await this.dialog.showAlert({
      header: 'Elecciones de Delegados',
      backdropDismiss: false,
      keyboardClose: false,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.nav.navigateBack('/dashboard-alumno/inicio');
          }
        }
      ]
    });
  }
  async cerrar() {
    await this.nav.navigateBack('/dashboard-alumno/inicio');
  }
  confirmar(message: string, title?: string): Promise<boolean> {

    return new Promise(async (resolve) => {

      const actionSheet = await this.action.create({
        header: title || 'Elecciones de Delegados',
        subHeader: message,
        buttons: [
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => resolve(true)
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          }
        ]
      });

      await actionSheet.present();
    });
  }

}
