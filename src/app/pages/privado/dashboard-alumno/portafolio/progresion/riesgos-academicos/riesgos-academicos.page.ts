import { Component, inject, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PortafolioService } from 'src/app/core/services/http/portafolio.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-riesgos-academicos',
  templateUrl: './riesgos-academicos.page.html',
  styleUrls: ['./riesgos-academicos.page.scss'],
})
export class RiesgosAcademicosPage implements OnInit {

  private profile = inject(ProfileService);
  private api = inject(PortafolioService);
  private error = inject(ErrorHandlerService);

  programa: any;
  perfil: any;
  data: any;
  mostrarCargando = true;
  mostrarData = false;

  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    this.programa = await this.profile.getPrograma();
    this.perfil = await this.profile.getPrincipal();

    try {
      const { matrNcorr, carrCcod, planCcod } = this.programa;
      const result = await this.api.getPrincipal(matrNcorr, carrCcod, planCcod);

      if (result.success) {
        this.data = result.data;
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
      this.mostrarData = true;
    }
  }
  async recargar() {
    this.mostrarCargando = true;
    this.mostrarData = false;
    await this.cargar();
  }

}
