import { Component, inject, OnInit } from '@angular/core';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';
import * as emplea from 'src/scripts/foto.emplea';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.page.html',
  styleUrls: ['./beneficios.page.scss'],
})
export class BeneficiosPage implements OnInit {

  private api = inject(ExalumnoService);
  private profile = inject(ProfileService);

  mostrarCargando = true;
  mostrarData = false;
  beneficios!: any[];
  fotoEmplea = emplea.imgBase64;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      let perfil = await this.profile.getStorage('profile');

      if (!perfil) {
        const result = await this.api.getPerfil();

        if (result.success) {
          perfil = result.data.perfil;
          await this.profile.setStorage("profile", perfil);
        }
      }

      const { sedeCcod } = perfil;
      const result = await this.api.getEmpleaBeneficios(sedeCcod);

      if (result.success) {
        this.beneficios = result.data.beneficios;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      console.error(error);
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }
  resolverFoto(ncorr: any) {
    return `${this.api.baseUrl}/v4/exalumno/emplea-imagen?ncorr=${ncorr}&tipo=2`;
  }

}
