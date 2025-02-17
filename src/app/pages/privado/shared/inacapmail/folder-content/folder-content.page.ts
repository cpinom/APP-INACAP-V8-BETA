import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, IonItemSliding, IonNav } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { InacapMailService } from 'src/app/core/services/inacapmail.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { MessageContentPage } from '../message-content/message-content.page';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { EventsService } from 'src/app/core/services/events.service';
import { Subject, Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-folder-content',
  templateUrl: './folder-content.page.html',
  styleUrls: ['./folder-content.page.scss'],
})
export class FolderContentPage implements OnInit, OnDestroy {

  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;
  @ViewChild(IonInfiniteScroll) infiniteItem: IonInfiniteScroll;
  messages = [];
  folderId: string;
  returnPath: string;
  hideLoadingSpinner = false;
  params = { pageSize: 30, skip: -1 };
  folderName = 'INACAPMail';
  folder: any;
  mostrarBuscador = false;
  mostrarData = false;
  mostrarBusqueda = false;
  deshabilitarNuevo = false;
  replyObs: Subscription;
  updateObs: Subscription;
  deleteObs: Subscription;
  filtroSubscription: Subscription;
  filtroChanged: Subject<string> = new Subject<string>();
  filtro: string;
  mensajesFiltrados: any[];

  constructor(private api: InacapMailService,
    private router: Router,
    private mensaje: MensajeService,
    private error: ErrorHandlerService,
    private nav: IonNav,
    private snackbar: SnackbarService,
    private events: EventsService) {

    this.filtroSubscription = this.filtroChanged
      .pipe(debounceTime(750))
      .subscribe(() => {
        this.filtrar()
      });

    this.replyObs = this.events.app.subscribe(event => {
      if (event.action == 'mail:message-answered') {
        debugger
      }
    });

    this.updateObs = this.events.app.subscribe(event => {
      if (event.action == 'mail:message-updated') {
        let message = this.messages.find(t => t.id == event.value.id);
        message.isRead = true;
      }
    });

    this.deleteObs = this.events.app.subscribe(event => {
      if (event.action == 'mail:message-removed') {
        this.deleteTap(event.value);
      }
    });

    if (this.router.url.startsWith('/alumno/inicio')) {
      this.returnPath = '/alumno/inicio';
    }
    else if (this.router.url.startsWith('/docente/inicio')) {
      this.returnPath = '/docente/inicio';
    }
    else if (this.router.url.startsWith('/exalumno/inicio')) {
      this.returnPath = '/exalumno/inicio';
    }
  }
  ngOnDestroy() {
    this.filtroSubscription.unsubscribe();
    this.replyObs.unsubscribe();
    this.updateObs.unsubscribe();
    this.deleteObs.unsubscribe();
  }
  ngOnInit() {
    if (this.folder) {
      if (('messages' in this.folder) && this.folder.messages.length) {
        this.messages = this.folder.messages;
      }

      this.folderName = this.folder.displayName;
      this.cargar(this.folder.id, undefined, false);
    }
  }
  filtrarMensajes() {
    this.filtroChanged.next('')
  }
  resetMensajes() { }
  async filtrar() {
    if (this.filtro) {
      this.hideLoadingSpinner = false;
      this.mostrarBusqueda = true;

      try {
        let result = await this.api.sarchMessagesV5(this.folderId, this.filtro);

        if (result.success) {
          this.mensajesFiltrados = result.messages;
        }
        else { }
      }
      catch { }
      finally {
        this.mostrarBusqueda = true;
        this.hideLoadingSpinner = true;
      }
    }
    else {
      this.mostrarBusqueda = false;
    }
  }
  async recargar(e: any) {
    this.infiniteItem && (this.infiniteItem.disabled = false);

    try {
      this.params.skip = -1;
      await this.cargar(this.folderId, undefined, false);
    }
    catch (error) {
      if (error.status = 401) {
        this.error.handle(error);
      }
    }
    finally {
      e.target.complete();
    }
  }
  async loadData(event: any) {
    await this.cargar(this.folderId, event, true);
  }
  async cargar(folderId: string, event?: any, data?: boolean) {
    this.mostrarData = this.messages.length ? true : (data === true);

    try {
      event && (this.hideLoadingSpinner = false);
      this.folderId = folderId;
      this.params.skip = this.params.skip == -1 ? 0 : this.params.pageSize + this.params.skip;

      let result = await this.api.getListMessagesV5(folderId, this.params.pageSize, this.params.skip);

      if (result.success) {
        if (this.messages.length && this.params.skip == 0) {
          this.messages = result.messages;
        } 
        else {
          this.messages = this.messages.concat(result.messages);
        }

        if (this.folder.isInbox) {
          this.api.getStorage('folders').then((folders: any[]) => {
            folders.forEach(folder => {
              if (folder.isInbox) folder.messages = this.messages;
            });

            this.api.setStorage('folders', folders);
          });
          this.folder.messages = this.messages;
        }

        if (result.messages.length == 0) {
          event && (event.target.disabled = true);
        }
      }
    }
    catch (error) {
      if (this.messages.length) {
        event && (event.target.disabled = true);
        this.snackbar.showToast('No fue posible cargar más mensajes.')
      } 
      else {
        if (error.status == 401) {
          this.error.handle(error);
        }
      }
    }
    finally {
      event && event.target.complete();
      this.hideLoadingSpinner = true;
      this.mostrarData = true;
    }
  }
  async messageTap(message: any) {
    await this.nav.push(MessageContentPage, {
      message: message,
      messages: this.mostrarBusqueda ? this.mensajesFiltrados : this.messages
    });
  }
  async mailTap() {
    try {
      this.deshabilitarNuevo = true;
      await this.mensaje.crear();
    }
    catch (error) {
      this.snackbar.showToast('Mensaje no disponible', 2000);
    }
    finally {
      this.deshabilitarNuevo = false;
    }
  }
  async deleteTap(data: any) {
    const message = await this.snackbar.create('Eliminando...', false);
    const messagesBack = Object.assign([], this.messages);

    this.messages = this.messages.filter(t => t.id !== data.id);

    await message.present();

    try {
      await this.api.deleteMessageV5(data.id);
      this.slidingItem && await this.slidingItem.closeOpened();
    }
    catch (error) {
      this.messages = messagesBack;
      this.error.handle(error);
    }
    finally {
      await message.dismiss();
    }
  }

}

