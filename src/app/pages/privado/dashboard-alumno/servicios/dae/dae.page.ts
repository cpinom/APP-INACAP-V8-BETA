import { Component, inject, OnInit } from '@angular/core';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-dae',
  templateUrl: './dae.page.html',
  styleUrls: ['./dae.page.scss'],
})
export class DaePage implements OnInit {

  sedeCcod!: any;
  programa: any;
  status: any;
  data: any;
  mostrarCargando = true;
  mostrarData = false;

  private profile = inject(ProfileService);
  private api = inject(AlumnoService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  ngOnInit() {
  }
  async ionViewDidEnter() {
    await this.cargar();
  }
  async cargar(forzar?: boolean) {
    try {
      const principal = await this.profile.getStorage('principal');
      const programa = principal.programas[principal.programaIndex];

      if (programa) {
        let sedeCcod = programa.sedeCcod;

        if (this.sedeCcod && this.sedeCcod != sedeCcod) {
          sedeCcod = this.sedeCcod;
        }

        const dae = await this.profile.getStorage(`dae_${sedeCcod}`);
        this.programa = programa;
        this.status = await this.profile.getStorage('status');

        if (dae && !forzar) {
          this.data = dae;
        }
        else {
          const result = await this.api.getDAEV5(sedeCcod);

          if (result.success) {
            this.data = result.data;
            this.sedeCcod = sedeCcod;
            await this.profile.setStorage(`dae_${sedeCcod}`, result.data);
          }

          const status = await this.api.getStatusV5(sedeCcod, programa.planCcod);

          if (status.success) {
            this.status = status.data;
            await this.profile.setStorage('status', status.data);
          }
        }
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);;
        return;
      }
    }
    finally {
      this.mostrarCargando = false;
      this.mostrarData = true;
    }
  }
  recargar(e: any) {
    this.mostrarCargando = false;
    this.mostrarData = true;
    this.cargar(true).finally(() => {
      e && e.target.complete();
    });
  }

}
