import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS } from 'src/app/core/constants/publico';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PublicService } from 'src/app/core/services/http/public.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ModalDescripcionPage } from './modal-descripcion/modal-descripcion.page';
import { ModalMallaPage } from './modal-malla/modal-malla.page';

@Component({
  selector: 'app-detalle-carrera',
  templateUrl: './detalle-carrera.page.html',
  styleUrls: ['./detalle-carrera.page.scss'],
})
export class DetalleCarreraPage implements OnInit {

  areaCcod!: string;
  carrCcod!: string;
  data: any;
  matricula = true;
  modalidad = {
    'diurna': false,
    'vespertina': false,
    'online': false
  };
  niveles: any;

  constructor(private route: ActivatedRoute,
    private api: PublicService,
    private dialog: DialogService,
    private error: ErrorHandlerService,
    private utils: UtilsService,
    private routerOutlet: IonRouterOutlet,
    private global: AppGlobal,
    private router: Router) { }

  async ngOnInit() {
    const loading = await this.dialog.showLoading({ message: 'Cargando...' });

    try {
      this.areaCcod = this.route.snapshot.paramMap.get('areaCcod') || '';
      this.carrCcod = this.route.snapshot.paramMap.get('espeCcod') || '';

      let oferta = await this.api.getStorage('oferta');
      let sedes: any[] = [];
      let result = await this.api.getCarrera(this.carrCcod);

      if (result.success) {
        this.data = result.data;
        this.data.nombre = result.data.nombre.replace(/\(.*\)/, '');
        this.matricula = result.data.permitirPostular;

        oferta.forEach((sede: any) => {
          if (sede.id !== '0') {
            sede.areas.forEach((area: any) => {
              if (area.id === this.areaCcod) {
                area.carrerasporinstitucion.forEach((institucion: any) => {
                  institucion.carreras.forEach((carrera: any) => {
                    if (carrera.espe_ccod === this.carrCcod) {
                      if (sede.id != '47') {
                        sedes.push({
                          sedeCcod: sede.id,
                          sedeTdesc: sede.nombre
                        });
                      }
                      if (carrera.regimen) {
                        this.modalidad.diurna = carrera.regimen.indexOf('diurna') > -1;
                        this.modalidad.vespertina = carrera.regimen.indexOf('vespertina') > -1;
                        this.modalidad.online = carrera.regimen.indexOf('online') > -1;
                      }
                    }
                  });
                });

                if (!this.data.hasOwnProperty('nombre_area')) {
                  this.data.nombre_area = area.nombre;
                }
              }
            })
          }
        });

        this.data.sedes = sedes;
      }
      else {
        throw Error();
      }
    }
    catch (error) {
      this.error.handle(error, () => {
        this.router.navigate([this.backUrl], { replaceUrl: true });
      });
    }
    finally {
      await loading.dismiss();
    }

    this.api.marcarVistaPublica(VISTAS.DETALLE_CARRERA, undefined, this.carrCcod);
  }
  async detalle(vista: number, e: Event) {
    e.preventDefault();

    const titulo = vista === 1 ? 'Descripción' : (vista === 2 ? 'Perfil de Egreso' : 'Campo Ocupacional');
    const html = vista === 1 ? this.data.descripcion : (vista === 2 ? this.data.perfil : this.data.campo);

    await this.dialog.showModal({
      component: ModalDescripcionPage,
      componentProps: {
        titulo: titulo,
        html: html
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }
  async malla() {
    const modal = await this.dialog.showModal({
      component: ModalMallaPage,
      componentProps: {
        carrTdesc: this.data.nombre,
        carrCcod: this.data.cod_carrera,
        espePlan: this.data.espe_plan,
        niveles: this.niveles
      },
      canDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    let result = await modal.onDidDismiss();

    if (result.data) {
      this.niveles = result.data;
    }
  }
  fup() {
    this.utils.openLink(`${this.global.Siga}/inacap.fup/`);
    this.api.marcarVistaPublica(VISTAS.FUP, 'Usuario da click en botón del FUP', this.carrCcod);
  }
  get backUrl() { return '/publico/programas/carreras'; }

}
