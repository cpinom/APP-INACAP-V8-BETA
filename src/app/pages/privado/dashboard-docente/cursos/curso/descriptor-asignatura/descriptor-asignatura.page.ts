import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import $ from "jquery";
import { UtilsService } from 'src/app/core/services/utils.service';
import { IonContent } from '@ionic/angular';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';

@Component({
  selector: 'app-descriptor-asignatura',
  templateUrl: './descriptor-asignatura.page.html',
  styleUrls: ['./descriptor-asignatura.page.scss'],
})
export class DescriptorAsignaturaPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;
  asigCcod: any;
  descriptor: any;
  mostrarData = false;
  mostrarCargando = true;

  private router = inject(Router);
  private api = inject(DocenteService);
  private utils = inject(UtilsService);
  private error = inject(ErrorHandlerService);

  constructor() { }

  async ngOnInit() {
    this.asigCcod = this.router.getCurrentNavigation()?.extras.state;
    this.cargar();
    this.api.marcarVista(VISTAS_DOCENTE.DESCRIPTOR_ASIGNATURA);
  }
  async cargar() {
    try {
      const result = await this.api.getDescriptorAsignaturaV6(this.asigCcod);

      if (result.success) {
        this.descriptor = result.data;
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      if (error && error.status == 401) {
        this.error.handle(error)
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
    setTimeout(() => {
      this.cargar();
    }, 500);
  }
  onChangeDescriptor(e: any) {
    this.content.scrollToTop(500);
  }
  bibliografia(tbib_ccod: any) {
    if (this.descriptor && this.descriptor.bibliografias) {
      return this.descriptor.bibliografias.bibliografia.filter((t: any) => t.tbib_ccod == tbib_ccod);
    }
    return [];
  }
  resolverNumeroRomano(index: number) {
    if (index == 1) return 'I';
    if (index == 2) return 'II';
    if (index == 3) return 'III';
    if (index == 4) return 'IV';
    if (index == 5) return 'V';
    if (index == 6) return 'VI';
    if (index == 7) return 'VII';
    if (index == 8) return 'VIII';
    if (index == 9) return 'IX';
    if (index == 10) return 'X';
    return '';
  }
  resolverCompetencias(obj: any) {
    if (!obj) return obj;

    if (typeof obj[Symbol.iterator] === 'function') {
      return obj;
    }

    return [obj];
  }
  resolverUnidades(obj: any) {
    if (!obj) return obj;

    if (typeof obj[Symbol.iterator] === 'function') {
      return obj;
    }

    return [obj];

  }
  resolverCriterios(data: any[], asun_norden: number, unob_norden: number) {
    let html: string[] = [];

    data.forEach(item => {
      html.push(`<div><b>${asun_norden}.${unob_norden}.${item.obcr_norden}</b> - `);
      html.push(`${item.obcr_tdescrip.data}</div>`);
    });

    return html.join('');
  }
  resolverContenidos(data: any) {
    if (typeof data === 'string') {
      let $wrapper = $('<div />').append(data);
      let $element = $('li', $wrapper);
      let $value: string[] = [];

      if ($element.length == 0) {
        $element = $('p', $wrapper);

        if ($element.length == 0) {
          $value.push(`<div>${data}</div>`);
          return $value.join('');
        }

      }

      $element.each(function (i: any, element: any) {
        let html = element.innerHTML;
        html = html.replace(/&nbsp;/g, '');
        html = html.replace(/<br\s*\/?>/gi, '');
        let text = html;

        if (/<\/?[a-z][\s\S]*>/i.test(text)) {
          try {
            text = $(text).text();
          } catch { }
        }

        text = text.replace('· ', '');
        text = text.replace('-', '');

        if (text.length > 0) {
          $value.push(`<div>${text}</div>`);
        }
      });

      return $value.join('');
    }
    
    return '';
  }
  resolverActividades(obj: any) {
    if (!obj) return obj;

    let $value: any[] = [];

    if (typeof obj[Symbol.iterator] !== 'function') {
      obj = [obj];
    }

    obj.forEach((item: any, idx: number) => {
      let data = item.unac_tdescrip.data;

      if (/<\/?[a-z][\s\S]*>/i.test(data)) {
        let $element;

        try {
          $element = $('li', data);
        } catch {
          $element = $('li', `<div>${data}</div>`);
        }

        if ($element.length > 0) {
          $element.each(function (i: number, element: HTMLElement) {
            let html = element.innerHTML;
            html = html.replace(/&nbsp;/g, '');
            let text = html;

            try {
              text = $(html).text();
            } catch { }

            $value.push(`<div>${text}</div>`);
          });
        }
        else {
          let text = data;

          try {
            text = $(data).text();
          } catch { }

          $value.push(`<div>${text}</div>`);
        }
      }
      else {
        $value.push(`<div>${data}</div>`);
      }
    });

    return $value.join('');
  }
  resolverPerfilDocente(obj: any) {
    if (!obj) return obj;

    if (typeof obj[Symbol.iterator] !== 'function') {
      obj = [obj];
    }

    return obj;
  }
  resolverSoftware(obj: any) {
    if (!obj) return obj;

    if (typeof obj[Symbol.iterator] === 'function') {
      return obj;
    }

    return [obj];
  }
  async abrirEnlace(url: string, e: any) {
    e.preventDefault();
    await this.utils.openLink(url);
  }

}
