import { Component, ElementRef, inject, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { GestureController, IonInfiniteScroll, IonItemSliding, IonNav } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { InacapMailService } from 'src/app/core/services/http/inacapmail.service';
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
  
  @ViewChildren('longPressItem') itemList!: QueryList<ElementRef>;
  @ViewChild(IonItemSliding) slidingItem!: IonItemSliding;
  @ViewChild(IonInfiniteScroll) infiniteItem!: IonInfiniteScroll;
  messages: any[] = [];
  folderId!: string;
  returnPath!: string;
  mostrarCargando = true;
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
  filtro!: string;
  mensajesFiltrados!: any[];

  private api = inject(InacapMailService);
  private router = inject(Router);
  private mensaje = inject(MensajeService);
  private error = inject(ErrorHandlerService);
  private nav = inject(IonNav);
  private snackbar = inject(SnackbarService);
  private events = inject(EventsService);
  private gesture = inject(GestureController);

  constructor() {

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
        let message: any = this.messages.find((t: any) => t.id == event.value.id);

        if (message) {
          message.isRead = true;
        }
      }
    });

    this.deleteObs = this.events.app.subscribe(event => {
      if (event.action == 'mail:message-removed') {
        this.deleteTap(event.value);
      }
    });

    if (this.router.url.startsWith('/dashboard-alumno/inicio')) {
      this.returnPath = '/dashboard-alumno/inicio';
    }
    else if (this.router.url.startsWith('/dashboard-docente/inicio')) {
      this.returnPath = '/dashboard-docente/inicio';
    }
    else if (this.router.url.startsWith('/dashboard-exalumno/inicio')) {
      this.returnPath = '/dashboard-exalumno/inicio';
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
      this.mostrarCargando = true;
      this.mostrarBusqueda = true;

      try {
        const result = await this.api.sarchMessagesV5(this.folderId, this.filtro);

        if (result.success) {
          this.mensajesFiltrados = result.messages;
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

        await this.snackbar.showToast('No fue posible realizar la búsqueda.', 2000);
      }
      finally {
        this.mostrarBusqueda = true;
        this.mostrarCargando = false;
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
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
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
      event && (this.mostrarCargando = true);
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

        // debugger
        // this.itemList && this.itemList.forEach((item: any, index: number) => {
        //   //debugger
        //   const gesture = this.gesture.create({
        //     el: item.el,
        //     gestureName: `long-press-${index}`,
        //     threshold: 0,
        //     onStart: (ev: any) => {
        //       console.log('long-press', ev);
        //     }
        //   });

        //   gesture.enable();
        // });

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
    catch (error: any) {
      if (this.messages.length) {
        event && (event.target.disabled = true);
        this.snackbar.showToast('No fue posible cargar más mensajes.')
      }
      else {
        if (error && error.status == 401) {
          await this.error.handle(error);
        }
      }
    }
    finally {
      event && event.target.complete();
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async messageTap(message: any) {
    if (message.isDraft) {
      await this.mensaje.borrador(message);
    }
    else {
      await this.nav.push(MessageContentPage, {
        message: message,
        messages: this.mostrarBusqueda ? this.mensajesFiltrados : this.messages
      });
    }
  }
  async mailTap() {
    try {
      this.deshabilitarNuevo = true;
      await this.mensaje.crear();
    }
    catch (error: any) {
      await this.snackbar.showToast('Mensaje no disponible', 2000);
    }
    finally {
      this.deshabilitarNuevo = false;
    }
  }
  async deleteTap(data: any) {
    const message = await this.snackbar.create('Eliminando...', false);
    const messagesBack = Object.assign([], this.messages);

    this.messages = this.messages.filter((t: any) => t.id !== data.id);

    await message.present();

    try {
      await this.api.deleteMessageV5(data.id);
      this.slidingItem && await this.slidingItem.closeOpened();
    }
    catch (error: any) {
      this.messages = messagesBack;
      await this.error.handle(error);
    }
    finally {
      await message.dismiss();
    }
  }

}

