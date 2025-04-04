import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef, Renderer2, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, IonTextarea, Platform } from '@ionic/angular';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { InacapMailService } from '../../services/http/inacapmail.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UtilsService } from '../../services/utils.service';
import { MediaService } from '../../services/media.service';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import * as moment from 'moment';
import { VISTAS_DOCENTE } from '../../constants/docente';
import { VISTAS_ALUMNO } from '../../constants/alumno';
import { VISTAS_EXALUMNO } from '../../constants/exalumno';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss'],
})
export class MensajeComponent implements OnInit, OnDestroy {

  @Output() action: EventEmitter<any> = new EventEmitter();
  @ViewChild('correoInput') correoInput!: ElementRef<HTMLInputElement>;
  @ViewChild('asunto') asuntoEl!: IonInput;
  @ViewChild('cuerpo') cuerpoEl!: IonTextarea;
  @ViewChild('contenido') messageEl!: ElementRef;
  @ViewChild('adjuntosInput') adjuntarEl!: ElementRef;
  mensajeForm: FormGroup;
  asunto!: string;
  cuerpo!: string;
  correo: any;
  adjuntos: any[] = [];
  users!: any[];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  emailInitial = false;
  message: any;
  mostrarAsunto = true;
  isReply = false;
  isDraft = false;
  hasAttachments = false;
  messageId!: string;
  updatingMessage!: boolean;
  toSubscr!: Subscription;
  bodySubscr!: Subscription;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  correoCtrl = new FormControl('');
  correosFiltrados!: Observable<any[]>;
  correos: string[] = [];
  mostrarCargando = false;

  private formBuilder = inject(FormBuilder);
  private dialog = inject(DialogService);
  private api = inject(InacapMailService);
  private utils = inject(UtilsService);
  private snackbar = inject(SnackbarService);
  private error = inject(ErrorHandlerService);
  private renderer = inject(Renderer2);
  private pt = inject(Platform);
  private media = inject(MediaService);
  private router = inject(Router);

  constructor() {

    this.mensajeForm = this.formBuilder.group({
      para: [''],
      asunto: [''],
      cuerpo: ['', Validators.required]
    });

    this.habilitarEventos();
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && value.match(this.emailPattern)) {
      this.correos.push(value);
    }

    event.chipInput!.clear();

    this.correoCtrl.setValue(null);
    this.updateMessage();
  }
  remove(correo: string): void {
    if (!this.emailInitial) {
      const index = this.correos.indexOf(correo);

      if (index >= 0) {
        this.correos.splice(index, 1);
        this.updateMessage();
      }
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.correos.push(event.option.value.correo);
    this.correoInput.nativeElement.value = '';
    this.correoCtrl.setValue(null);
    this.updateMessage();
  }
  _filter(value: any): any[] {
    const filterValue = (value.correo || value).toLowerCase() || '';
    const users = this.users.filter(user => user.correo.toLowerCase().includes(filterValue) || user.nombre.toLowerCase().includes(filterValue));

    if (users.length == 0 && (filterValue && filterValue.match(this.emailPattern))) {
      return [{ correo: filterValue, nombre: filterValue }];
    }

    return users;
  }
  habilitarEventos() {
    if (this.subject) {
      this.toSubscr = this.subject.valueChanges.pipe(
        debounceTime(3000),
        distinctUntilChanged()
      ).subscribe(() => {
        this.updateMessage();
      });
    }

    if (this.body) {
      this.bodySubscr = this.body.valueChanges.pipe(
        debounceTime(3000),
        distinctUntilChanged()
      ).subscribe(() => {
        this.updateMessage();
      });
    }
  }
  deshabilitarEventos() {
    this.toSubscr.unsubscribe();
    this.bodySubscr.unsubscribe();
  }
  deshabilitarAdjuntar() {
    if (!this.messageId) return true;
    if (this.adjuntos.length >= 5) return true;
    return false;
  }
  deshabilitarEnviar() {
    if (!this.messageId) return true;
    if (this.correos.length == 0) return true;
    if (this.updatingMessage == true) return true;
    return false;
  }
  async ngOnDestroy() {
    this.deshabilitarEventos();

    if (this.messageId && !this.isDraft) {
      try {
        await this.api.deleteMessageV5(this.messageId);
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
        }
      };
    }
  }
  async ngOnInit() {
    try {
      if (this.isReply) {
        this.emailInitial = true;
        this.mostrarAsunto = false;
        this.correos.push(this.message.from.emailAddress.address);

        setTimeout(() => {
          this.bindMessageBody();
          this.cuerpoEl.setFocus();
        }, 700);

      }
      else {
        this.correosFiltrados = this.correoCtrl.valueChanges.pipe(
          startWith(null),
          map((correo: any | null) => {
            return (correo ? this._filter(correo) : this.users.slice())
          }),
        );

        if (this.correo) {
          if (!this.isDraft) {
            this.emailInitial = true;
          }

          if (this.correo.indexOf(',') > -1) {
            this.correos = this.correo.split(',');
          }
          else {
            this.correos = [this.correo];
          }
        }

        if (!this.emailInitial && this.correos.length == 0) {
          setTimeout(() => {
            this.correoInput.nativeElement.focus();
          }, 700);
        }
      }

      if (this.asunto) {
        this.subject?.setValue(this.asunto, { emitEvent: false });
      }

      if (this.cuerpo) {
        this.body?.setValue(this.cuerpo, { emitEvent: false });
      }
      else {
        this.body?.setValue('\n\n\n\n\n\n\n\n\nEnviado desde APP INACAP', { emitEvent: false });
      }

      if (this.isDraft && this.hasAttachments) {
        await this.procesarAdjuntos();
      }

    }
    catch (error: any) { }
  }
  bindMessageBody() {
    if (this.isReply) {
      let links = this.messageEl.nativeElement.querySelectorAll('a[href]');

      if (links) {
        Array.from(links).forEach(link => {
          this.renderer.listen(link, 'click', (e) => {
            e.preventDefault();
            let url = (link as HTMLAnchorElement).href;
            this.utils.openLink(url);
          });
        });
      }
    }
  }
  async procesarAdjuntos() {
    try {
      const result = await this.api.getMessageAttachments(this.messageId);

      if (result.success) {
        const { attachments } = result.data;

        attachments.forEach((item: any) => {
          this.adjuntos.push({
            id: item.id,
            name: item.name,
            type: item.contentType,
            size: item.size,
            userId: item.userId,
            content: ''
          });
        });
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

      await this.snackbar.showToast('No fue posible cargar los adjuntos.', 3000, 'danger');
    }
  }
  async updateMessage() {
    this.updatingMessage = true;
    this.mostrarCargando = true;

    const params = {
      messageId: this.messageId,
      destinatarios: this.correos.join(','),
      asunto: this.subject?.value || '',
      cuerpo: this.body?.value || ''
    };
    const message = await this.snackbar.create('Guardando...', false, 'medium');

    await message.present();

    try {
      await this.api.updateMessageV5(params);
      await message.dismiss();
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('No fue posible guardar el mensaje.', 3000, 'danger');
    }
    finally {
      this.updatingMessage = false;
      this.mostrarCargando = false;
      message.dismiss();
    }
  }
  async adjuntarArchivos(inputEl: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      const media = await this.media.getMedia();

      if (media) {
        const fileSize = media?.size! / 1024 / 1024;
        const base64String = media.data;

        if (fileSize >= 25) {
          this.presentError('Cargar Archivos', 'Los documentos no pueden exceder los 25 MB.');
          return;
        }

        try {
          await this.uploadBase64Fragmented(base64String, media.name);
        }
        catch (error: any) {
          if (error && error.status == 401) {
            this.error.handle(error);
            return
          }

          await this.presentError('Cargar Archivos', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
        }
      }
    }
  }
  async adjuntar(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSize = file.size / 1024 / 1024;

      if (fileSize >= 25) {
        this.adjuntarEl.nativeElement.value = '';
        await this.presentError('Cargar Archivos', 'Los documentos no pueden exceder los 25 MB.');
        return;
      }

      try {
        const base64 = await this.utils.fileToBase64(file);
        await this.uploadBase64Fragmented(base64, file.name);
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
          return;
        }

        await this.presentError('Cargar Archivos', 'No se pudo procesar el archivo. Vuelve a intentarlo.');
      }
      finally {
        this.adjuntarEl.nativeElement.value = '';
      }
    }
  }
  async uploadBase64Fragmented(base64String: string, fileName: string): Promise<void> {
    const fragments = this.utils.divideBase64(base64String);
    const totalParts = fragments.length;
    const loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });

    try {
      for (let i = 0; i < fragments.length; i++) {
        const base64Fragment = fragments[i];
        const partNumber = i + 1;
        const params = {
          file: base64Fragment,
          fileName: encodeURIComponent(fileName),
          partNumber: partNumber,
          totalParts: totalParts
        };

        if (totalParts > 1 && partNumber == totalParts) {
          loading.message = '(100%) finalizando....';
        }

        const result = await this.api.addAttachmentV5(this.messageId, params);

        if (result.success) {
          if (result.code == 202) {
            const progreso = Math.round(result.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (result.code == 200) {
            const index = this.adjuntos.length;

            this.adjuntos[index] = {
              id: result.data.id,
              name: fileName,
              type: result.data.type,
              size: result.data.size,
              content: base64String,
              userId: result.data.userId
            };

            await this.snackbar.showToast('Archivo cargado correctamente.', 3000, 'success');
          }
        }
        else {
          throw Error(result);
        }

      }
    }
    catch (error) {
      return Promise.reject(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async enviar() {
    if (this.mensajeForm.valid) {
      this.deshabilitarEventos();

      const loading = await this.dialog.showLoading({ message: 'Enviado correo...' });
      const params = {
        messageId: this.messageId,
        destinatarios: this.correos.join(','),
        asunto: this.subject?.value || '',
        cuerpo: this.body?.value || '',
      };

      try {
        await this.api.sendMessage(params);

        this.messageId = '';

        if (this.isReply) {
          this.snackbar.showToast('Correo respondido correctamente.', 3000, 'success');
          this.dialog.dismissModal({ action: 'reply' });
        }
        else {
          this.snackbar.showToast('Correo enviado correctamente.', 3000, 'success');
          this.dialog.dismissModal({ action: 'send' });
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
        }
      }
      finally {
        loading.dismiss();
        this.api.marcarVista(this.Vista);
      }
    }
  }
  async eliminarAdjunto(deleteItem: any, index: number) {
    const loading = await this.dialog.showLoading({ message: 'Eliminando adjunto...' });
    const attachmentId = this.adjuntos[index].id;
    const params = { messageId: this.messageId, attachmentId: attachmentId };

    this.updatingMessage = true;
    this.mostrarCargando = true;

    try {
      await this.api.removeAttachment(params);
    }
    catch (error: any) {
      if (error.status = 401) {
        await this.error.handle(error);
        return;
      }

      await this.snackbar.showToast('No fue posible eliminar el adjunto.', 3000, 'danger');
    }
    finally {
      this.updatingMessage = false;
      this.mostrarCargando = false;

      await loading.dismiss();
    }

    this.adjuntos.forEach((item, index) => {
      if (item === deleteItem) this.adjuntos.splice(index, 1);
    });
  }
  async presentError(title: string, message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: title,
      buttons: ['Aceptar']
    });

    return alert;
  }
  mostrarMiniatura(item: any) {
    return item.type.indexOf('image/') > -1;
  }
  mostrarPdf(type: string) {
    return type == 'application/pdf';
  }
  mostrarExcel(type: string) {
    return type == 'application/vnd.ms-excel' || type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  mostrarDefecto(type: string) {
    return !this.mostrarPdf(type) && !this.mostrarExcel(type) && !this.mostrarMiniatura(type);
  }
  resolverMiniatura(item: any) {
    return `${this.api.baseUrl}/v5/inacapmail/thumbnail?userId=${item.userId}&messageId=${this.messageId}&attachmentId=${item.id}`;
  }
  resolverIcono(path: string) {
    return this.utils.resolverIcono(path);
  }
  formatearFecha(fecha: string) {
    return moment(fecha).format('ddd DD/MM/YYYY HH:mm')
  }
  bytesToSize(bytes: number) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
  async cerrar() {
    await this.dialog.dismissModal({ action: 'close' });
  }
  get subject() { return this.mensajeForm.get('asunto'); }
  get body() { return this.mensajeForm.get('cuerpo'); }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }
  get esDocente() { return this.router.url.startsWith('/dashboard-docente'); }
  get esExalumno() { return this.router.url.startsWith('/dashboard-exalumno'); }
  get Vista() {
    return this.esAlumno ? VISTAS_ALUMNO.ENVIA_CORREO : (this.esDocente ? VISTAS_DOCENTE.ENVIA_CORREO : VISTAS_EXALUMNO.ENVIA_CORREO);
  }

}
