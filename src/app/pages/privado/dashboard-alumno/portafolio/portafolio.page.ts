import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IonContent, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AppGlobal } from 'src/app/app.global';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EventsService } from 'src/app/core/services/events.service';
import { PortafolioService } from 'src/app/core/services/http/portafolio.service';
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

  private events = inject(EventsService);
  private global = inject(AppGlobal);
  private api = inject(PortafolioService);
  private pt = inject(Platform);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);

  constructor() {

    this.scrollObs = this.events.app.subscribe((event: any) => {
      if (event.action == 'scrollTop' && event.index == 2) {
        this.content?.scrollToTop(500);
        this.activeTab = 0;
      }
    });

  }
  ngOnInit() {
  }
  ngOnDestroy() {
    this.scrollObs.unsubscribe();
  }
  async descargar() {
    const loading = await this.dialog.showLoading({ message: 'Exportando...' });

    try {
      const result = await this.api.descargarPortafolio({});
      debugger

      if (result.success) {
        if (this.pt.is('mobileweb')) {
          const linkSource = `data:application/pdf;base64,${result.data.base64}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = result.data.nombreArchivo;
          downloadLink.click();
        }
        else {
          const fileResult = await Filesystem.writeFile({
            path: result.data.nombreArchivo,
            data: result.data.base64,
            directory: Directory.Cache
          });

          await FileOpener.open({
            filePath: fileResult.uri,
            contentType: 'application/pdf'
          });
        }
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

      this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  notificacionesTap() {
    this.events.app.next({ action: 'app:alumno-notificaciones' });
  }
  get mostrarNotificaciones() {
    return this.global.NotificationFlag;
  }

}
