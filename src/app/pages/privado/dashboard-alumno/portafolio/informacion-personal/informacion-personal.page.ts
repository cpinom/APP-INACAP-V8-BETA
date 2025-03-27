import { Component, inject, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.page.html',
  styleUrls: ['./informacion-personal.page.scss'],
})
export class InformacionPersonalPage implements OnInit {

  private profile = inject(ProfileService);
  private api = inject(AlumnoService);
  principal: any;
  programa: any;
  periodo: any;
  perfil: any;

  constructor() { }

  async ngOnInit() {
    this.profile.getStorage('principal').then(principal => {
      this.principal = principal;
      this.programa = principal.programas[principal.programaIndex];
      this.periodo = (principal.periodos as any[]).filter(t => t.periSeleccionado == true)[0];
      this.cargar();
    });
  }
  async cargar() {
    const perfil = await this.profile.getPrincipal();

    if (!perfil) {
      const result = await this.api.getPerfilV5(this.programa.sedeCcod);
    }
    else {
      this.perfil = perfil;
    }
  }

  get nombreCompleto() {
    if (this.perfil) {
      return `${this.perfil.persTnombreSocial || this.perfil.persTnombre} ${this.perfil.persTapePaterno} ${this.perfil.persTapeMaterno}`;
    }
    return '';
  }
  get imageBackground() {
    return this.profile.getBackgroundImagePath()
  }

}
