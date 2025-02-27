import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { IonNav, Platform } from '@ionic/angular';
import { InacapMailService } from 'src/app/core/services/http/inacapmail.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { MensajeService } from 'src/app/core/services/mensaje.service';
import { EventsService } from 'src/app/core/services/events.service';
import { PublicService } from 'src/app/core/services/http/public.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import * as moment from 'moment';
import { DialogService } from 'src/app/core/services/dialog.service';
import { AppGlobal } from 'src/app/app.global';

@Component({
  selector: 'app-message-content',
  templateUrl: './message-content.page.html',
  styleUrls: ['./message-content.page.scss'],
})
export class MessageContentPage implements OnInit, AfterViewInit {

  hideLoadingSpinner = true;
  message: any;
  messages!: any[];
  messageIndex!: number;
  comentario: string = '';

  private events = inject(EventsService);
  private api = inject(InacapMailService);
  private dialog = inject(DialogService);
  private global = inject(AppGlobal);
  private domSanitizer = inject(DomSanitizer);
  private snackbar = inject(SnackbarService);
  private nav = inject(IonNav);
  private pt = inject(Platform);
  private mensaje = inject(MensajeService);
  private publicApi = inject(PublicService);

  constructor() {
    moment.locale('es');
  }
  async ngAfterViewInit() {
    let index = 0;

    this.messages.forEach((t: any, i: number) => {
      if (t.id == this.message.id) { index = i; }
    });

    this.messageIndex = index;
    this.cargarMensaje();
  }
  async ngOnInit() { }
  async cargarMensaje() {
    try {
      let message = this.messages[this.messageIndex];

      if (!message.isLoaded) {
        let result = await this.api.getMessageV5(message.id);

        if (result.success) {
          result.data.attachments.forEach((item: any) => {
            if (item.thumbnail) {
              item.thumbnail = this.domSanitizer.bypassSecurityTrustUrl(item.thumbnail);
            }
          });

          message.data = result.data;
          message.isLoaded = true;

          if (this.pt.is('capacitor')) {
            if (!message.isRead) {
              this.api.markReadV5(message.id).then(() => {
                this.events.app.next({ action: 'mail:message-updated', value: message });
              });
            }
          }
        }
      }

      message.data.id = message.id;
      message.data._inicial = message.data.from && message.data.from.emailAddress.name ? message.data.from.emailAddress.name[0].toUpperCase() : 'I';
      message.data._fecha = moment(message.data.sentDateTime).format('ddd DD/MM/YYYY HH:mm');
    }
    catch (error: any) {
      await this.snackbar.showToast('Error cargando mensaje. Intente de nuevo.', 2000);
      await this.nav.pop();
    }
  }
  messageData() {
    return this.messages[this.messageIndex];
  }
  async descargarAdjunto(file: any) {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      let data = this.messageData();
      let userId = data.data.userId;
      let messageId = data.id;
      let urlAdjunto = `${this.global.Api}/api/v5/inacapmail/download?userId=${encodeURIComponent(userId)}&messageId=${encodeURIComponent(messageId)}&attachmentId=${encodeURIComponent(file.id)}`;
      let base64 = await this.publicApi.getBlob(urlAdjunto);

      if (this.pt.is('mobileweb')) {
        let linkSource = `data:${file.contentType};base64,${base64}`;

        const downloadLink = document.createElement('a');
        downloadLink.href = linkSource;
        downloadLink.download = file.name;
        downloadLink.click();
      }
      else {
        const fileResult = await Filesystem.writeFile({
          path: file.name,
          data: base64,
          directory: Directory.Cache
        });

        FileOpener.open({
          filePath: fileResult.uri,
          contentType: file.contentType
        });
      }
    }
    catch (error: any) {
      await this.snackbar.showToast('El archivo no se encuentra disponible.', 3000, 'danger')
    }
    finally {
      await loading.dismiss();
    }
  }
  async responder() {
    let message = this.messageData();
    let params = { messageId: message.id, cuerpo: this.comentario };
    let loading = this.dialog.showLoading({ message: 'Respondiendo...' });

    try {
      let result = await this.api.replyAllMessageV5(params);

      if (result.success) {
        this.snackbar.showToast('Correo respondido correctamente.', 3000, 'success');
        this.events.app.next({ action: 'mail:message-answered' });
        this.nav.pop();
      }
    }
    catch { }
    finally {
      (await loading).dismiss();
    }
  }
  async borrar() {
    let data = this.messageData();
    this.events.app.next({ action: 'mail:message-removed', value: data });
    this.nav.pop();
  }
  resolverIcono(contentType: string) {
    if (contentType == 'image') return 'image';
    if (contentType == 'application/pdf') return 'picture_as_pdf';
    else return 'insert_drive_file';
  }
  // resolverDestinatarios(message: any) {
  //   let result: any[] = [];

  //   message.data.toRecipients.forEach((element: any) => {
  //     result.push(element.emailAddress.address);
  //   });

  //   return result.join('<br />');
  // }
  bytesToSize(bytes: number) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
  countRowsInText(text: string) {
    var numberOfRowsInText = text.split('\n').length;
    return numberOfRowsInText > 10 ? 10 : numberOfRowsInText;
  }

  get responderTodos() {
    if (this.mensaje) {
      return this.message.data.toRecipients.length > 1 || this.message.data.ccRecipients.length > 1
    }
    return false;
  }
  get responderEnviador() {
    if (this.mensaje) {
      return this.message.data.toRecipients.length == 1 || this.message.data.ccRecipients.length == 1
    }
    return false;
  }

}
