import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VISTAS } from 'src/app/core/constants/publico';
import { EventsService } from 'src/app/core/services/events.service';
import { PublicService } from 'src/app/core/services/http/public.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-educacion-superior',
  templateUrl: './educacion-superior.component.html',
  styleUrls: ['./educacion-superior.component.scss'],
})
export class EducacionSuperiorComponent implements OnInit {

  // @ViewChild(IonContent) content: IonContent;
  oferta: any;
  areas: any;
  carreras: any;
  carrerasFiltradas: any;
  carrerasFiltro = '';
  mostrarError = false;
  mostrarData = false;
  charsMap: { [key: string]: string } = { '&aacute;': 'a', '&eacute;': 'e', '&iacute;': 'i', '&oacute;': 'o', '&uacute;': 'u', '&Aacute;': 'A', '&Eacute;': 'E', '&Iacute;': 'I', '&Oacute;': 'O', '&Uacute;': 'U', '&ntilde;': 'ñ', '&Ntilde;': 'Ñ' };
  charsMapNormal: { [key: string]: string } = { '&aacute;': 'á', '&eacute;': 'é', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú', '&Aacute;': 'Á', '&Eacute;': 'É', '&Iacute;': 'Í', '&Oacute;': 'Ó', '&Uacute;': 'Ú', '&ntilde;': 'ñ', '&Ntilde;': 'Ñ' };
  // subscription: Subscription;

  constructor(private api: PublicService,
    private snackbar: SnackbarService,
    private utils: UtilsService,
    private router: Router,
    private events: EventsService) {

    // this.subscription = this.events.app.subscribe((event: any) => {
    //   if (event.action == 'scrollTop' && event.index == 2 && this.router.url == '/publico/programas/carreras') {
    //     this.content?.scrollToTop(500);
    //   }
    // });

  }
  async ngOnInit() {
    await this.cargar();
    this.api.marcarVistaPublica(VISTAS.PROGRAMAS);
  }
  async cargar() {
    try {
      let response = await this.api.getOferta();
      this.oferta = response.items;
    }
    catch (error) {
      let response = await this.api.getStorage('oferta');

      if (response) {
        this.oferta = response;
      }
      else {
        this.mostrarError = true;
        return;
      }
    }

    if (this.oferta) {
      let areas = this.oferta[0].areas;

      this.areas = areas;
      this.procesarCarreras();
      this.api.setStorage('oferta', this.oferta);
    }
    else {
      this.snackbar.showToast('El servicio no se encuentra disponible o presenta algunos problemas de cobertura, reintenta en un momento.', 3000);
    }
  }
  recargar(e?: any) {
    this.mostrarError = false;
    this.carrerasFiltro = '';
    this.cargar().finally(() => {
      e && e.target.complete();
    })
  }
  procesarCarreras() {
    let carreras: any[] = [];

    this.areas.forEach((area: any) => {
      let carrerasArea: any[] = [];

      area.carrerasporinstitucion.forEach((institucion: any) => {
        carrerasArea = carrerasArea.concat(institucion['carreras']);
      });

      carrerasArea.forEach(carrera => {
        delete carrera['url'];

        this.oferta.forEach((sede: any) => {
          if (sede.id !== '0') {
            sede.areas.forEach((sedeArea: any) => {
              sedeArea.carrerasporinstitucion.forEach((carrInst: any) => {
                if (!('espeCcod' in carrera)) {
                  carrInst.carreras.forEach((carr: any) => {
                    if (carr.nombre === carrera.nombre) {
                      carrera['espeCcod'] = carr.espe_ccod;
                      carrera['institucion'] = carrInst.institucion;
                    }
                  });
                }
              });
            });
          }
        });

        carrera['areaCcod'] = area.id;
        carrera.nombre = this.charsFold(carrera.nombre, true);
        carreras.push(carrera);
      });
    });

    carreras.sort(function (a, b) {
      if (a.nombre < b.nombre) {
        return -1;
      }
      if (a.nombre > b.nombre) {
        return 1;
      }
      return 0;
    });

    this.carreras = carreras;
    this.carrerasFiltradas = carreras;
    this.mostrarData = true;
  }
  resolverRegimen(carrera: any, regimen: any) {
    return carrera.regimen.indexOf(regimen) > -1;
  }
  resolverInstitucion(carrera: any, validar?: boolean) {
    if (validar == true) {
      return carrera.institucion.toLowerCase().indexOf('instituto') > -1 || carrera.institucion.toLowerCase().indexOf('centro') > -1;
    }
    else {
      if (carrera.institucion.toLowerCase().indexOf('instituto') > -1) return 'ip';
      if (carrera.institucion.toLowerCase().indexOf('centro') > -1) return 'cft';
    }

    return '';
  }
  resaltarTexto(valor: string) {
    if (this.carrerasFiltro.length) {
      let filtro = this.carrerasFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
      let texto = valor.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
      let startIndex = texto.indexOf(filtro);

      if (startIndex != -1) {
        let endLength = filtro.length;
        let matchingString = valor.substr(startIndex, endLength);
        return valor.replace(matchingString, "<b>" + matchingString + "</b>");
      }
    }

    return valor;
  }
  charsFold(s: string, normal?: boolean) {
    if (!s) { return ''; }
    let method: 'charsMap' | 'charsMapNormal' = normal ? 'charsMapNormal' : 'charsMap';
    for (let char in this[method]) {
      s = s.replace(new RegExp(char, 'g'), this[method][char]);
    }
    return s;
  }
  // charsFold2(s: string, normal?: boolean) {
  //   if (!s) { return ''; }
  //   let method = normal ? 'charsMapNormal' : 'charsMap';
  //   for (let char in this[method]) {
  //     s = s.replaceAll(char, this[method][char]);
  //   }
  //   return s;
  // }
  filtrarCarreras() {
    this.carrerasFiltradas = this.carreras.filter((element: any) => {
      var text = element.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
      var filter = this.carrerasFiltro.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toLowerCase();
      var index = text.indexOf(filter);

      return index > -1;
    });
  }
  resetCarreras() {
    this.carrerasFiltro = '';
    this.carrerasFiltradas = this.carreras;
  }
  linkInfo() {
    this.utils.openLink('https://crmext.inacap.cl/PortalIngresoDatos/formulario-web.aspx?fuente=3');
  }

}
