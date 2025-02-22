import { Component, OnInit, Output, ViewChild, EventEmitter, ElementRef, Renderer2, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  messageId!: string;
  updatingMessage!: boolean;
  toSubscr!: Subscription;
  bodySubscr!: Subscription;
  separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  correoCtrl = new FormControl('');
  correosFiltrados!: Observable<any[]>;
  correos: string[] = [];
  mostrarCargando = false;

  // private formBuilder = inject()

  constructor(private formBuilder: FormBuilder,
    private dialog: DialogService,
    private api: InacapMailService,
    private utils: UtilsService,
    private domSanitizer: DomSanitizer,
    private snackbar: SnackbarService,
    private error: ErrorHandlerService,
    private renderer: Renderer2,
    private pt: Platform,
    private media: MediaService,
    private router: Router) {

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

    if (this.messageId) {
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
          this.emailInitial = true;
          this.correos = [this.correo];
        }

        if (!this.emailInitial) {
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
  async updateMessage() {
    this.updatingMessage = true;
    this.mostrarCargando = true;

    let params = {
      messageId: this.messageId,
      destinatarios: this.correos.join(','),
      asunto: this.subject?.value || '',
      cuerpo: this.body?.value || ''
    };
    let message = await this.snackbar.create('Guardando...', false, 'secondary');

    message.present();

    try {
      await this.api.updateMessageV5(params);
    } catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
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
      let file = await this.media.getMedia();

      if (file) {
        let fileSize = file.size / 1024 / 1024;
        let index = this.adjuntos.length;

        if (fileSize <= 3) {
          this.adjuntos.push({});
          this.updatingMessage = true;
          this.mostrarCargando = true;

          try {
            let response: any = await this.api.addAttachment(file.path, file.name, { messageId: this.messageId });
            let result = response.data;
            let base64 = await this.media.getBase64String(file.path);

            this.adjuntos[index] = {
              id: result.id,
              name: file.name,
              type: result.type,
              size: result.size,
              content: base64.replace(/^data:(.*,)?/, '')
            };
          }
          catch (error: any) {
            this.adjuntos.splice(index, 1);
            this.snackbar.showToast('No fue posible cargar el archivo.', 2000);
          }
          finally {
            this.updatingMessage = false;
            this.mostrarCargando = false;
          }
        }
        else {
          this.snackbar.showToast('Los documentos no pueden exceder los 3 MB.', 2000);
        }
      }
    }
  }
  async adjuntar(event: any) {
    let formData = new FormData();
    let file = event.target.files[0];
    var fileSize = file.size / 1024 / 1024;
    let index = this.adjuntos.length;

    if (fileSize <= 3) {
      formData.append('file', file);
      this.adjuntos.push({});
      this.updatingMessage = true;
      this.mostrarCargando = true;

      try {
        let result = await this.api.addAttachmentWeb(formData, { messageId: this.messageId });
        let base64 = await this.utils.createImageFromFile(file);

        this.adjuntos[index] = {
          id: result.id,
          name: file.name,
          type: file.type,
          size: result.size,
          content: base64.replace(/^data:(.*,)?/, '')
        };
      }
      catch (error: any) {
        this.adjuntos.splice(index, 1);
        this.snackbar.showToast('No fue posible cargar el archivo.', 2000);
      }
      finally {
        this.updatingMessage = false;
        this.mostrarCargando = false;
      }
    }
    else {
      this.snackbar.showToast('Los documentos no pueden exceder los 3 MB.', 2000);
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
  async eliminarAlert(item: any, index: number) {
    await this.dialog.showActionSheet({
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarAdjunto(item, index);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
  }
  async eliminarAdjunto(deleteItem: any, index: number) {
    let attachmentId = this.adjuntos[index].id;
    let params = { messageId: this.messageId, attachmentId: attachmentId };
    let message = await this.snackbar.create('Eliminando adjunto...', false);
    this.updatingMessage = true;
    this.mostrarCargando = true;

    message.present();

    try {
      await this.api.removeAttachment(params);
    }
    catch (error: any) {
      if (error.status = 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.updatingMessage = false;
      this.mostrarCargando = false;
      message.dismiss();
    }

    this.adjuntos.forEach((item, index) => {
      if (item === deleteItem) this.adjuntos.splice(index, 1);
    });
  }
  mostrarMiniatura(type: string) {
    return type.indexOf('image/') > -1;
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
  resolverMiniatura(data: any) {
    if (data.type == 'image/jpeg')
      return 'data:image/jpeg;base64,' + data.content;
    if (data.type == 'image/png')
      return 'data:image/png;base64,' + data.content;
    if (data.type = 'image/svg+xml')
      return this.domSanitizer.bypassSecurityTrustUrl('data:image/svg+xml;base64,' + data.content);

    return '';
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
