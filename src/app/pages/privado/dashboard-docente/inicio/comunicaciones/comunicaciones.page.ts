import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { MediaService } from 'src/app/core/services/media.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-comunicaciones',
  templateUrl: './comunicaciones.page.html',
  styleUrls: ['./comunicaciones.page.scss'],
})
export class ComunicacionesPage implements OnInit {

  @ViewChild('adjuntarInput') adjuntarEl!: ElementRef;
  mostrarCargando = true;
  mostrarData = false;
  cursos: any;
  form: FormGroup;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ¡!@#¿?,:;\n\r\$%\^\&*\ \)\(+=._-]+$';
  messageId!: string;
  archivos: any[] = [];

  constructor(private profile: ProfileService,
    private dialog: DialogService,
    private fb: FormBuilder,
    private api: DocenteService,
    private utils: UtilsService,
    private error: ErrorHandlerService,
    private media: MediaService,
    private pt: Platform,
    private snackbar: SnackbarService) {

    this.form = this.fb.group({
      asunto: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(this.patternStr)
      ])],
      mensaje: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(1000),
        Validators.pattern(this.patternStr)
      ])],
      secciones: new FormArray([], Validators.required),
      marcaDC: [false]
    })

  }
  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const principal = await this.profile.getStorage('principal');

      if (principal) {
        this.cursos = principal.cursos;
      }

      const request = await this.api.getComunicaciones();

      if (request.success) {
        this.messageId = request.data.messageId;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error);
        return
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    this.cargar()
  }
  async enviar() {
    debugger
    if (this.form.valid) {
      const confirmar = await this.confirmar('¿Estas seguro que deseas enviar el Mensaje?');
      debugger
    }
    else {
      this.asunto?.markAsTouched();
      this.mensaje?.markAsTouched();
    }
  }
  confirmar(message: string, title?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialog.showAlert({
        header: title || 'Nuevo Mensaje',
        message: message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: 'Continuar',
            role: 'destructive',
            handler: () => {
              resolve(true);
            }
          }
        ]
      })
    })
  }
  resolverCorreos(e: CustomEvent) {
    const cursos = this.cursos;
    const curso = cursos.find((c: any) => c.ssecNcorr == e.detail?.value.ssecNcorr);
    const cursoExiste = this.secciones.value.find((c: any) => c.ssecNcorr == e.detail?.value.ssecNcorr) != null;

    if (e.detail?.checked && !cursoExiste) {
      this.secciones.push(new FormControl({
        seccCcod: curso.seccCcod,
        ssecNcorr: curso.ssecNcorr,
        sedeCcod: curso.sedeCcod
      }));
    }
    else if (!e.detail?.checked && cursoExiste) {
      const index = this.secciones.value.findIndex((t: any) => t.ssecNcorr == e.detail?.value.ssecNcorr);
      this.secciones.removeAt(index);
    }
  }
  async adjuntar(inputEl: HTMLInputElement) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      const media = await this.media.getMedia();

      if (media) {
        const fileSize = media.size / 1024 / 1024;
        const base64String = media.data;

        if (fileSize >= 150) {
          this.presentError('Cargar Archivos', 'Los documentos no pueden exceder los 150 MB.');
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
    // input.click();
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

        const response = await this.api.cargarArchivoComunicaciones(this.messageId, params);

        if (response.success) {
          if (response.code == 202) {
            const progreso = Math.round(response.progress);
            loading.message = `(${progreso}%) procesando....`;
          }
          else if (response.code == 200) {
            this.archivos.push(response.file)
            await this.snackbar.showToast('Archivo cargado correctamente.', 3000, 'success');
          }
        }
        else {
          throw Error(response);
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
  async adjuntarWeb(event: any) {
    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024;

    if (fileSize >= 150) {
      await this.presentError('Cargar Archivos', 'Los documentos no pueden exceder los 150 MB.');
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
    /*if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024;

      if (fileSize >= 150) {
        this.snackbar.showToast('Los documentos no pueden exceder los 150 MB.', 2000);
        return;
      }

      try {
        await this.uploadFileFragmented(file);        
      }
      catch (error: any) {
        debugger
      }
      finally {
        this.adjuntarEl.nativeElement.value = '';
      }
    }*/
  }
  // async uploadFileFragmented(file: File, targetBase64Size: number = 3 * 1024 * 1024): Promise<void> {
  //   const loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });

  //   try {
  //     const chunkSizeInBytes = targetBase64Size;//Math.floor(targetBase64Size / 1.33);
  //     const totalParts = Math.ceil(file.size / chunkSizeInBytes);

  //     for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
  //       const start = (partNumber - 1) * chunkSizeInBytes;
  //       const end = Math.min(start + chunkSizeInBytes, file.size);
  //       const chunk = file.slice(start, end);
  //       const base64Fragment = await this.utils.fileFragmentedToBase64(chunk);

  //       const params = {
  //         file: base64Fragment.split(',')[1],
  //         fileName: encodeURIComponent(file.name),
  //         partNumber: partNumber,
  //         totalParts: totalParts
  //       };

  //       if (totalParts > 1 && partNumber == totalParts) {
  //         loading.message = '(100%) finalizando....';
  //       }

  //       const response = await this.api.cargarArchivoComunicaciones(this.messageId, params);

  //       if (response.success) {
  //         if (response.code == 202) {
  //           const progreso = Math.round(response.progress);
  //           loading.message = `(${progreso}%) procesando....`;
  //         }
  //         else if (response.code == 200) {
  //           this.archivos.push(response.file)
  //         }
  //       }
  //       else {
  //         throw Error();
  //       }
  //     }

  //     return Promise.resolve();
  //   }
  //   catch (error: any) {
  //     return Promise.reject(error);
  //   }
  //   finally {
  //     await loading.dismiss();
  //   }
  // }
  // async fileFragmentedToBase64(fileFragment: Blob): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       const base64 = reader.result as string;
  //       resolve(base64);
  //     };

  //     reader.onerror = (error) => {
  //       reject(`Error al convertir el fragmento a Base64: ${error}`);
  //     };

  //     reader.readAsDataURL(fileFragment);
  //   });
  // }
  async presentError(title: string, message: string) {
    const alert = await this.dialog.showAlert({
      cssClass: 'alert-message',
      message: `<img src="./assets/images/warning.svg" /><br />${message}`,
      header: title,
      buttons: ['Aceptar']
    });

    return alert;
  }
  get habilitarEnviar() {
    if (!this.messageId) return false;
    return true;
  }
  get asunto() { return this.form.get('asunto'); }
  get mensaje() { return this.form.get('mensaje'); }
  get secciones() { return this.form.get('secciones') as FormArray; }
  get asuntoError() {
    if (this.asunto?.touched) {
      if (this.asunto?.hasError('required')) return 'Campo es obligatorio.';
      if (this.asunto?.hasError('maxlength')) return 'Máximo 50 caracteres permitidos.';
      if (this.asunto?.hasError('pattern')) return 'Sólo puede ingresar caracteres alfanuméricos.';
    }

    return;
  }
  get mensajeError() {
    if (this.mensaje?.touched) {
      if (this.mensaje?.hasError('required')) return 'Campo es obligatorio.';
      if (this.mensaje?.hasError('maxlength')) return 'Máximo 1000 caracteres permitidos.';
      if (this.mensaje?.hasError('pattern')) return 'Sólo puede ingresar caracteres alfanuméricos.';
    }

    return;
  }
}
