import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { TutorIaService } from 'src/app/core/services/http/tutor-ia.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  private api = inject(TutorIaService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private error = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private snackbar = inject(SnackbarService);

  seccion: any;
  temas: any;
  preguntaForm: FormGroup;
  preguntas: any;
  mostrarCargando = true;
  mostrarData = false;
  vista = 0;
  respuestas: { [key: string]: string } = {}; // Almacena las respuestas seleccionadas
  resultado: any;
  mostrarResultados: boolean = false;
  formulario: FormGroup | undefined;

  constructor() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);

    this.preguntaForm = this.fb.group({
      tema: ['', Validators.required],
      preguntas: [5],
      nivel: [1],
    });
  }
  async ngOnInit() {
    await this.cargar();
    this.marcarVista(0);
  }
  async cargar() {
    try {
      const { asigCcod } = this.seccion;
      const result = await this.api.getTemas(asigCcod);

      if (result.success) {
        this.temas = result.data;
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true
    }
  }
  async iniciarTest() {
    if (this.preguntaForm.valid) {
      const loading = await this.dialog.showLoading({ message: 'Iniciando test...' });

      try {
        const { asigCcod } = this.seccion;
        const params = {
          asigCcod: asigCcod,
          cantidad_preguntas: this.preguntasCtrl?.value,
          nivel_usuario: this.nivelCtrl?.value,
          topico: this.temaCtrl?.value
        };
        const result = await this.api.iniciarTest(params);

        if (result.success) {
          await loading.dismiss();
          this.preguntas = result.data;
          this.vista = 1;
          this.generarFormulario();
          this.marcarVista(1);
        }
      }
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
          return;
        }
      }
    }
  }
  generarFormulario() {
    const group: any = {};

    this.preguntas.forEach((_: any, index: any) => {
      group[`pregunta_${index}`] = ['', Validators.required]; // valor inicial vacío
    });

    this.formulario = this.fb.group(group);
  }
  async finalizarTest() {
    if (this.formulario?.valid) {
      const respuestas = this.formulario.value;
      let respuestasArray: any = {};
      let index = 0;

      for (let key in respuestas) {
        respuestasArray[index] = `${this.preguntas[index].token}|${respuestas[key]}`;
        index++;
      }

      console.log(respuestasArray);

      const loading = await this.dialog.showLoading({ message: 'Procesando test...' });

      try {
        const result = await this.api.procesarTest(respuestasArray);

        if (result.success) {
          this.resultado = result.data;
          this.presentTestAlert();
          this.marcarVista(2);
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

        await this.snackbar.showToast('Ocurrió un error al procesar el test.', 3000, 'danger');
      }
      finally {
        await loading.dismiss();
      }
    }
  }
  cerraTest() {
    this.formulario = undefined;
    this.preguntas = [];
    this.respuestas = {};
    this.resultado = null;
    this.mostrarResultados = false;
    this.vista = 0;
  }
  mostrarCorrecta(i: number, j: number) {

    const part = this.resultado.respuestas[i].split('|');

    if (j == part[0] /*&& part[0] == part[1]*/) {
      return true;
    }

    return false;

  }
  mostrarIncorrecta(i: number, j: number) {
    const part = this.resultado.respuestas[i].split('|');

    if (j == part[1] && part[0] != part[1]) {
      return true;
    }

    return false;

  }
  async presentTestAlert() {
    await this.dialog.showAlert({
      header: 'Resultado del Test',
      message: `Has obtenido ${this.resultado.correctas} correctas y ${this.resultado.incorrectas} incorrectas.`,
      backdropDismiss: false,
      keyboardClose: false,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
            this.cerraTest();
          }
        },
        {
          text: 'Ver Resultados',
          role: 'destructive',
          handler: () => {
            this.mostrarResultados = true;
          }
        }
      ]
    });
  }
  marcarVista(paso: number) {
    if (this.esAlumno) {
      if (paso == 0) this.api.marcarVista(VISTAS_ALUMNO.TUTOR_IA_TEST);
      else if (paso == 1) this.api.marcarVista(VISTAS_ALUMNO.TUTOR_IA_INICIA_TEST);
      else if (paso == 2) this.api.marcarVista(VISTAS_ALUMNO.TUTOR_IA_FINALIZA_TEST);
    }
    else {
      if (paso == 0) this.api.marcarVista(VISTAS_DOCENTE.TUTOR_IA_TEST);
      else if (paso == 1) this.api.marcarVista(VISTAS_DOCENTE.TUTOR_IA_INICIA_TEST);
      else if (paso == 2) this.api.marcarVista(VISTAS_DOCENTE.TUTOR_IA_FINALIZA_TEST);
    }
  }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }
  get temaCtrl() { return this.preguntaForm.get('tema'); }
  get preguntasCtrl() { return this.preguntaForm.get('preguntas'); }
  get nivelCtrl() { return this.preguntaForm.get('nivel'); }

}
