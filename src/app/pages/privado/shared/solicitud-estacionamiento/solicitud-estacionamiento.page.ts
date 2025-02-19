import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { EstacionamientosService } from 'src/app/core/services/http/estacionamientos.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import { ValidatePatenteAuto, ValidatePatenteMoto } from 'src/app/core/validators/patente.validators';

enum USUARIO {
  alumno = 1,
  docente = 2
};

@Component({
  selector: 'app-solicitud-estacionamiento',
  templateUrl: './solicitud-estacionamiento.page.html',
  styleUrls: ['./solicitud-estacionamiento.page.scss'],
})
export class SolicitudEstacionamientoPage implements OnInit {

  mostrarCargando = true;
  mostrarData = false;
  data: any;
  tabsModel = 0;
  solicitudForm: FormGroup;
  vehiculos: any;
  submitted!: boolean;
  tituloSolicitud = 'Nueva Solicitud';
  sedeCcod: any;
  permitePostular!: boolean;
  permiteEditar!: boolean;
  editarPostulacion!: boolean;
  poseePostulacion!: boolean;
  mostrarEstadoPostulacion!: boolean;
  nombreSede!: string;

  private api = inject(EstacionamientosService);
  private router = inject(Router);
  private profile = inject(ProfileService);
  private dialog = inject(DialogService);
  private error = inject(ErrorHandlerService);
  private fb = inject(FormBuilder);

  constructor() {

    this.solicitudForm = this.fb.group({
      aepoNcorr: [0],
      aepeNcorr: [],
      aejoNcorr: [],
      aeveNcorr: [, Validators.required],
      aepoTpatente: [, Validators.required],
      acuerdo: [, Validators.requiredTrue]
    });

    this.tipoVehiculo?.valueChanges.subscribe((value: any) => {
      if (value == 1) {
        this.patente?.clearValidators();
        this.patente?.setValidators([Validators.required, ValidatePatenteAuto]);
        this.patente?.updateValueAndValidity();
      }
      else if (value == 2) {
        this.patente?.clearValidators();
        this.patente?.setValidators([Validators.required, ValidatePatenteMoto]);
        this.patente?.updateValueAndValidity();
      }
    });

  }
  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    const principal = await this.profile.getStorage('principal');

    if (this.esAlumno) {
      this.tipoPerfil?.setValue(USUARIO.alumno);

      try {
        const programa = principal.programas[principal.programaIndex];
        const sedeCcod = programa.sedeCcod;
        const aepeNcorr = USUARIO.alumno;
        const response = await this.api.getPrincipalV6(sedeCcod, aepeNcorr);

        if (response.success) {
          this.sedeCcod = sedeCcod;
          this.jornada?.setValue(programa.jornCcod);
          this.data = response.data;
          this.permiteEditar = true;
          this.data.info = this.data.info || {};
          this.permitePostular = (this.data.info && this.data.info.aeasNvigencia == 1) ? true : false;
          this.editarPostulacion = true;
          this.nombreSede = programa.sedeTdesc;

          if (this.data.postulacion) {
            this.poseePostulacion = true;
            // Permite editar postulación cuando la sede lo permita y tenga una postulación pendiente
            this.permiteEditar = (this.data.info && this.data.info.aeasNpermiteEdicion == 1) && this.data.postulacion.aepeCcod == 1;
            this.mostrarEstadoPostulacion = this.permitePostular || this.data.postulacion.aepeCcod != 1;
            this.editarPostulacion = false;
            this.tituloSolicitud = 'Editar Postulación';
            this.idPostulacion?.setValue(this.data.postulacion.aepoNcorr);
            this.tipoVehiculo?.setValue(this.data.postulacion.aeveNcorr);
            this.patente?.setValue(this.data.postulacion.aepoTpatente);

            if (!this.permitePostular) {
              this.permiteEditar = false;
            }
          }
          else {
            if (this.data.vehiculos.length == 1) {
              this.tipoVehiculo?.setValue(this.data.vehiculos[0].aeveNcorr);
            }
          }
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
          return;
        }
      }
      finally {
        this.mostrarData = true;
        this.mostrarCargando = false;
      }
    }
    else if (this.esDocente) {
      this.tipoPerfil?.setValue(USUARIO.docente);
      this.jornada?.setValue(-1);

      try {
        const sedeCcod = principal.sedeCcod;
        const aepeNcorr = USUARIO.docente;
        const response = await this.api.getPrincipalV6(sedeCcod, aepeNcorr);

        if (response.success) {
          this.sedeCcod = sedeCcod;
          this.jornada?.setValue(0);
          this.data = response.data;
          this.editarPostulacion = true;
          this.data.info = this.data.info || {};
          this.permitePostular = this.data.info && this.data.info.aeasNvigencia == 1

          if (this.data.postulacion) {
            this.poseePostulacion = true;
            this.editarPostulacion = this.data.info.aeasNpermiteEdicion == 1 && this.data.postulacion.aepeCcod == 1;
            this.mostrarEstadoPostulacion = this.permitePostular || this.data.postulacion.aepeCcod != 1;
            this.tituloSolicitud = 'Editar Postulación';
            this.idPostulacion?.setValue(this.data.postulacion.aepoNcorr);
            this.tipoVehiculo?.setValue(this.data.postulacion.aeveNcorr);
            this.patente?.setValue(this.data.postulacion.aepoTpatente);

            if (!this.permitePostular) {
              this.editarPostulacion = false;
            }
          }
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
          return;
        }
      }
      finally {
        this.mostrarData = true;
        this.mostrarCargando = false;
      }
    }
  }
  editarTap() {
    this.editarPostulacion = !this.editarPostulacion;
  }
  async guardar() {
    this.submitted = true;

    if (this.solicitudForm.valid) {
      const loading = await this.dialog.showLoading({ message: 'Procesando...' });
      let estadoPostulacion = true;
      let mensajePostulacion = 'La postulación ha sido procesada correctamente.';

      try {
        let params = Object.assign({ sedeCcod: this.sedeCcod }, this.solicitudForm.value);
        let response = await this.api.guardarPostulacion(params);

        if (response.success) {
          this.data.postulacion = response.data.postulacion;
          this.poseePostulacion = true;
          this.editarPostulacion = false;
          this.permiteEditar = this.data.info.aeasNpermiteEdicion == 1 && this.data.postulacion.aepeCcod == 1;
          this.mostrarEstadoPostulacion = this.permitePostular || this.data.postulacion.aepeCcod != 1;
          this.tituloSolicitud = 'Editar Postulación';
          this.idPostulacion?.setValue(this.data.postulacion.aepoNcorr);
          this.tipoVehiculo?.setValue(this.data.postulacion.aeveNcorr);
          this.patente?.setValue(this.data.postulacion.aepoTpatente);
        }
        else {
          estadoPostulacion = false;
          mensajePostulacion = response.message;
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          this.error.handle(error);
          return;
        }

        estadoPostulacion = false;
        mensajePostulacion = 'Ha ocurrido un error inesperado procesando tu solicitud. Vuelve a intentarlo.';
      }
      finally {
        await loading.dismiss();
      }

      if (estadoPostulacion === true) {
        await this.presentSuccess(mensajePostulacion);
      }
      else {
        await this.presentError(mensajePostulacion)
      }
    }
  }
  async presentSuccess(mensaje: string) {
    await this.dialog.showAlert({
      keyboardClose: false,
      backdropDismiss: false,
      header: 'Solicitud Estacionamiento',
      cssClass: 'success-alert',
      message: `<div class="image"><ion-icon src = "./assets/icon/check_circle.svg"></ion-icon></div>${mensaje}`,
      buttons: ['Aceptar']
    });
  }
  async presentError(text?: string) {
    const message = text ? text : 'Hubo un error enviando su solicitud. Comuníquese con la asistencia telefónica.';

    await this.dialog.showAlert({
      backdropDismiss: false,
      keyboardClose: false,
      header: 'Error',
      message: message,
      buttons: ['Cerrar']
    });
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    setTimeout(() => {
      this.cargar();
    }, 100);
  }

  get backUrl() { return this.router.url.replace('/solicitud-estacionamiento', ''); }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno') }
  get esDocente() { return this.router.url.startsWith('/dashboard-docente') }
  get idPostulacion() { return this.solicitudForm.get('aepoNcorr'); }
  get tipoPerfil() { return this.solicitudForm.get('aepeNcorr'); }
  get tipoVehiculo() { return this.solicitudForm.get('aeveNcorr'); }
  get patente() { return this.solicitudForm.get('aepoTpatente'); }
  get jornada() { return this.solicitudForm.get('aejoNcorr'); }
  get acuerdo() { return this.solicitudForm.get('acuerdo'); }

}
