import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VISTAS } from 'src/app/core/constants/publico';
import { PublicService } from 'src/app/core/services/http/public.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';


@Component({
  selector: 'app-modal-malla',
  templateUrl: './modal-malla.page.html',
  styleUrls: ['./modal-malla.page.scss'],
})
export class ModalMallaPage implements OnInit {

  carrTdesc: string = '';
  carrCcod: string = '';
  espePlan: string = '';
  niveles: any;
  mostrarData = false;

  constructor(private modalCtrl: ModalController,
    private api: PublicService,
    private snackbar: SnackbarService) { }

  ngOnInit() {
    this.cargar();
    this.api.marcarVistaPublica(VISTAS.MALLA_CURRICULAR);
  }
  async cargar() {
    if (!this.niveles) {
      try {
        let result = await this.api.getMalla(this.carrCcod + this.espePlan);

        if (result.success) {
          const { data } = result;
          this.niveles = data;
          this.mostrarData = true;
        }
        else {
          throw Error();
        }
      }
      catch (e) {
        this.snackbar.showToast('El servicio no se encuentra disponible o presenta algunos problemas de cobertura, reintenta en un momento.', 3000)
      }
      finally { }
    }
    else {
      this.mostrarData = true;
    }
  }
  asignaturaTap(asignatura: any) { }
  totalHoras(nivel: any) {
    var total = 0;

    nivel.malla.forEach((item: any) => {
      total += item.asigNhoras;
    });

    return total;
  }
  get totalHorasPlan() {
    if (this.niveles) {
      let total = 0;

      this.niveles.forEach((nivel: any) => {
        nivel.malla.forEach((malla: any) => {
          total += malla.asigNhoras;
        });
      });

      return total;
    }
    return 0;
  }
  get totalAsignaturas() {
    if (this.niveles) {
      let total = 0;

      this.niveles.forEach((nivel: any) => {
        total += nivel.malla.length;
      });

      return total;
    }

    return 0;
  }
  async cerrar() {
    await this.modalCtrl.dismiss(this.niveles);
  }
}
