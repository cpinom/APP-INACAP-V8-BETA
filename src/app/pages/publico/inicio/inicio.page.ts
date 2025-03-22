import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import moment from 'moment';
import { VISTAS } from 'src/app/core/constants/publico';
import { PublicService } from 'src/app/core/services/http/public.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false
})
export class InicioPage implements OnInit, OnDestroy {

  private api = inject(PublicService);
  private pt = inject(Platform);
  private utils = inject(UtilsService);

  @ViewChild(IonContent) content!: IonContent;
  mostrarCargando = true;
  mostrarData = false;
  mostrarError = false;
  data: any;

  constructor() { }
  ngOnDestroy() { }
  async ngOnInit() {
    await this.pt.ready();
    await this.cargar();
    this.api.marcarVistaPublica(VISTAS.INICIO);
  }
  async cargar() {

    try {
      const result = await this.api.getPrincipal();

      if (result.success) {
        this.data = result.data;
        this.mostrarData = true;
        this.mostrarError = false;
        await this.api.setStorage('principal', this.data);
      }
      else {
        throw Error();
      }
    }
    catch (error: any) {
      const principal_stored = await this.api.getStorage('principal');

      if (!principal_stored) {
        this.data = undefined;
        this.mostrarData = false;
        this.mostrarError = true;
        return;
      }

      this.data = principal_stored;
      this.mostrarData = true;
    }
    finally {
      this.mostrarCargando = false;
    }
  }
  recargar(e: any) {
    this.mostrarError = false;

    setTimeout(() => {
      this.cargar().finally(() => {
        e.target.complete();
      });
    }, 500)
  }
  resolverFechaNoticia(data: string) {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

    if (regex.test(data)) {
      let fecha = moment(data, 'YYYY-MM-DDTHH:mm:ssZ');
      return fecha.format('DD/MM/YYYY HH:mm');
    }

    return data;
  }
  resolverDestacado(data: string) {
    if (data) {
      const tempElement = document.createElement('div');

      tempElement.innerHTML = data;

      let resultText = tempElement.textContent || '';
      resultText = resultText.trim();

      let words = resultText.split(' ');
      let truncatedText = '';

      for (let word of words) {
        if (truncatedText.length + word.length + 1 > 60) break;
        truncatedText += (truncatedText.length > 0 ? ' ' : '') + word;
      }

      return truncatedText;
    }

    return data;
  }
  async detalleNoticia(item: any) {
    await this.utils.openLink(item.url);
    this.api.marcarVistaPublica(VISTAS.DETALLE_NOTICIA);
  }

}
