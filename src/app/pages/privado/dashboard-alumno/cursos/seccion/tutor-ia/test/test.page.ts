import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
        debugger

        if (result.success) {
          await loading.dismiss();
          this.preguntas = result.data;
          this.vista = 1;
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
  async finalizarTest() {
    const todasRespondidas = this.preguntas.every((pregunta: any, index: number) => this.respuestas[index] !== undefined);

    console.log(this.respuestas);

    if (!todasRespondidas) {
      //this.snackbar.open('Debes elegir una respuesta de cada pregunta.', 'Cerrar', { duration: 3000 });
      return;
    }

    const loading = await this.dialog.showLoading({ message: 'Procesando test...' });

    try {
      const result = await this.api.procesarTest(this.respuestas);

      if (result.success) {
        this.resultado = result.data;
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
  cerraTest() {
    this.preguntas = [];
    this.respuestas = {};
    this.resultado = null;
    this.mostrarResultados = false;
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

  get temaCtrl() { return this.preguntaForm.get('tema'); }
  get preguntasCtrl() { return this.preguntaForm.get('preguntas'); }
  get nivelCtrl() { return this.preguntaForm.get('nivel'); }

}
