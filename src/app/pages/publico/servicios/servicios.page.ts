import { Component, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { PublicService } from 'src/app/core/services/public.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
  standalone: false
})
export class ServiciosPage implements OnInit {

  data: any;
  mostrarData = false;

  constructor(private api: PublicService) { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    try {
      const response = await this.api.getContacto();

      
      this.data = response;
    }
    catch (error) {
      console.error(error);
    }
    finally {
      this.mostrarData = true;
    }
  }
  async openUrl(url: string) {
    await Browser.open({ url: url });
  }
  async abrirNavegador(url: string) {
    await this.openUrl(this.data[url]);
  }

}
