import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { BuzonOpinionService } from 'src/app/core/services/http/buzonopinion.service';
import { MediaService } from 'src/app/core/services/media.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-nueva-opinion',
  templateUrl: './nueva-opinion.component.html',
  styleUrls: ['./nueva-opinion.component.scss'],
})
export class NuevaOpinionComponent implements OnInit {

  opinionForm: FormGroup;
  patternStr = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ!@#"\'\n\r\$%\^\&*\ \)\(+=.,_-]+$';
  tipoUsuario!: string;
  clasificaciones: any;
  topicos: any;
  temas: any;
  submitAttempt!: boolean;
  solicitudId = 0;
  nombreDocumento!: string;

  private api = inject(BuzonOpinionService);
  private dialog = inject(DialogService);
  private error = inject(ErrorHandlerService);
  private media = inject(MediaService);
  private pt = inject(Platform);
  private snackbar = inject(SnackbarService);
  private formBuilder = inject(FormBuilder);

  constructor() {

    this.opinionForm = this.formBuilder.group({
      clopCcod: ['', Validators.required],
      ticoCcod: ['', Validators.required],
      coopCcod: ['', Validators.required],
      resoTsugerencia: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(2000),
        Validators.pattern(this.patternStr)
      ])]
    });

  }
  ngOnInit() {
    this.clopCcod?.setValue(this.clasificaciones[0].clopCcod);
    this.ticoCcod?.setValue(this.topicos[0].ticoCcod);
    this.coopCcod?.setValue(this.temas[0].coopCcod);
    this.mensaje?.setValue('');
  }
  async getSubcategorias(ticoCcod: any) {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      const result = await this.api.getSubcategoriasV6(ticoCcod);

      if (result.success) {
        this.temas = result.data.temas;
        this.coopCcod?.patchValue(this.temas[0].coopCcod);
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
    finally {
      await loading.dismiss();
    }
  }
  async adjuntarArchivoWeb(event: any) {
    if (event.target.files.length > 0) {
      let formData = new FormData();
      let file = event.target.files[0];
      var fileSize = file.size / 1024 / 1024;

      if (fileSize <= 3) {
        let loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });
        formData.append('file', file);

        try {
          let params = { tuserCcod: this.tipoUsuario };
          let result = await this.api.cargarArchivoWeb(formData, params);

          if (result.success == false) {
            this.snackbar.showToast(result.message);
            return;
          }

          this.solicitudId = result.resoNcorr;
          this.nombreDocumento = file.name;
        }
        catch (error) { }
        finally {
          await loading.dismiss();
        }
      }
      else {
        this.snackbar.showToast('El archivo no pueden exceder los 3 MB.', 2000);
      }
    }
  }
  async adjuntarArchivo(inputEl: any) {
    if (this.pt.is('mobileweb')) {
      inputEl.click();
    }
    else {
      let file = await this.media.getMedia(true);

      if (file) {
        let fileSize = file.size / 1024 / 1024;

        if (fileSize <= 3) {
          let loading = await this.dialog.showLoading({ message: 'Cargando archivo...' });

          try {
            const params = { tuserCcod: this.tipoUsuario };
            const response: any = await this.api.cargarArchivo(file.path, file.name, params);
            const result = response.data;

            if (result.success == false) {
              this.snackbar.showToast(result.message);
              return;
            }

            this.solicitudId = result.resoNcorr;
            this.nombreDocumento = file.name;

          }
          catch (error) {
            this.snackbar.showToast('No fue posible cargar el archivo.', 2000);
          }
          finally {
            await loading.dismiss();
          }
        }
        else {
          this.snackbar.showToast('Los documentos no pueden exceder los 3 MB.', 2000);
        }
      }
    }
  }
  async enviar() {
    this.submitAttempt = true;

    if (this.opinionForm.valid) {
      const params = Object.assign(this.opinionForm.value, { tuserCcod: this.tipoUsuario, resoNcorr: this.solicitudId });
      const loading = await this.dialog.showLoading({ message: 'Enviando...' });

      try {
        const result = await this.api.enviarOpinionV6(params);

        if (result.success) {
          this.presentSuccess(result.data);
          this.dialog.dismissModal(true);
        }
      }
      catch (error) {
        this.error.handle(error);
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  async presentSuccess(result: any) {
    let mensaje = 'Su opinión N° ' + result.resoNcorr + ' se ha ingresado con éxito.'

    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Nueva Opinión',
      cssClass: 'success-alert',
      message: '<div class="image"><img src = "./assets/images/icon_check_circle.svg" width="35px" height="35px"></div>' + mensaje,
      buttons: [{
        text: 'Aceptar'
      }]
    });
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  get clopCcod() { return this.opinionForm.get('clopCcod'); }
  get ticoCcod() { return this.opinionForm.get('ticoCcod'); }
  get coopCcod() { return this.opinionForm.get('coopCcod'); }
  get mensaje() { return this.opinionForm.get('resoTsugerencia'); }

}
