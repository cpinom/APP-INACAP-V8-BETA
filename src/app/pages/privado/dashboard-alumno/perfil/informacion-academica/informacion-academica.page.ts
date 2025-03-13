import { Component, inject, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-informacion-academica',
  templateUrl: './informacion-academica.page.html',
  styleUrls: ['./informacion-academica.page.scss'],
})
export class InformacionAcademicaPage implements OnInit {

  private profile = inject(ProfileService);
  private api = inject(AlumnoService);

  periodo: any;
  programa: any;
  perfil: any;
  resultados!: any[];

  constructor() { }

  async ngOnInit() {
    const principal = await this.profile.getStorage('principal');
    const periodo = (principal.periodos as any[]).filter(t => t.periSeleccionado == true)[0];
    this.perfil = await this.profile.getPrincipal();
    this.programa = principal.programas[principal.programaIndex];
    this.periodo = periodo;

    await this.cargarEvaluacionDiagnostica();
  }
  async cargarEvaluacionDiagnostica() {
    const result = await this.api.getEvalDiagnostica();

    if(result.success) {
      this.resultados = result.resultados;
    }
  }

}
