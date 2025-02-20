import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CuentaCorrienteService } from 'src/app/core/services/http/cuentacorriente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.page.html',
  styleUrls: ['./beneficios.page.scss'],
})
export class BeneficiosPage implements OnInit {

  instituciones!: any[];
  beneficios!: any[];
  form: FormGroup;
  conceptos!: any[];
  mostrarData = false;
  mostrarCargando = true;

  private api = inject(CuentaCorrienteService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private error = inject(ErrorHandlerService);

  constructor() {

    this.form = this.fb.group({
      institucion: [null, Validators.required],
      semestre: [2, Validators.required],
      beneficio: [null, Validators.required]
    });

    this.institucion?.valueChanges.subscribe(() => {
      this.cargarBeneficios(false);
    });

    this.semestre?.valueChanges.subscribe(() => {
      this.cargarBeneficios(false);
    });

    this.beneficio?.valueChanges.subscribe(() => {
      this.cargarBeneficios(false);
    });
  }

  async ngOnInit() {
    await this.cargar();
    await this.cargarBeneficios(true);
    this.mostrarData = true;
    this.mostrarCargando = false;
  }

  async cargar() {
    try {
      let result = await this.api.getFiltrosBeneficios();

      if (result.success) {
        let instCcod = this.route.snapshot.paramMap.get('instCcod');
        this.instituciones = result.instituciones;
        this.institucion?.setValue(instCcod, { emitEvent: false });
        this.beneficios = result.beneficios;

        if (result.beneficios.length) {
          this.beneficio?.setValue(this.beneficios[0].beneficio, { emitEvent: false });
        }
      }
    }
    catch (error: any) {
      this.error.handle(error);
    }
  }

  async cargarBeneficios(inicial: boolean) {
    if (this.form.valid) {
      // let loading = await this.loading.create({ message: 'Caergando...' });
      let carrCcod = this.route.snapshot.paramMap.get('carrCcod');
      let compNdocto = this.route.snapshot.paramMap.get('compNdocto');
      let params = {
        tipoBeneficio: this.beneficio?.value,
        tipoSemestre: this.semestre?.value,
        instCcod: this.institucion?.value,
        carrCcod: carrCcod,
        compNdocto: compNdocto
      };

      try {
        this.mostrarCargando = true;
        let result = await this.api.getDetalleBeneficio(params);

        if (result.success) {
          this.conceptos = result.data;
        }
      }
      catch (error: any) {
        this.error.handle(error);
      }
      finally {
        this.mostrarCargando = false;
      }
    }
  }

  get institucion() { return this.form.get('institucion'); }
  get semestre() { return this.form.get('semestre'); }
  get beneficio() { return this.form.get('beneficio'); }
  get fechaActual() {
    if (this.instituciones && this.instituciones.length) {
      return this.instituciones[0].fecha;
    }
    return '';
  }

}
