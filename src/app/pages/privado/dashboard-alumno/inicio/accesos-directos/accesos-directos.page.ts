import { Component, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';

interface AccesosDirectos {
  key: string;
  icon: string;
  label: string;
  visible: boolean;
  count?: number;
}

@Component({
  selector: 'app-accesos-directos',
  templateUrl: './accesos-directos.page.html',
  styleUrls: ['./accesos-directos.page.scss'],
})
export class AccesosDirectosPage implements OnInit {

  data: any;
  accesosDirectos: AccesosDirectos[] = [
    {
      key: 'MOODLE',
      icon: 'assets/icon/cast.svg',
      label: 'Ambiente de Aprendizaje',
      visible: true
    },
    {
      key: 'INACAPMAIL',
      icon: 'assets/icon/outlook.svg',
      label: 'INACAPMail',
      visible: true
    },
    {
      key: 'HORARIO',
      icon: 'assets/icon/date_range.svg',
      label: 'Horario',
      visible: true
    },
    {
      key: 'CREDENCIAL',
      icon: 'assets/icon/qr_code_2.svg',
      label: 'Credencial Virtual',
      visible: true
    },
    {
      key: 'CERTIFICADOS',
      icon: 'assets/icon/description.svg',
      label: 'Certificados',
      visible: true
    },
    {
      key: 'MALLA_CURRICULAR',
      icon: 'assets/icon/table_chart.svg',
      label: 'Malla Curricular',
      visible: true
    },
    {
      key: 'PROGRESION',
      icon: 'assets/icon/trending_up.svg',
      label: 'Mi Progresión',
      visible: true
    },
    {
      key: 'PRACTICA_PROFESIONAL',
      icon: 'assets/icon/work.svg',
      label: 'Practica Profesional',
      visible: true
    },
    {
      key: 'SEGURO_ACCIDENTES',
      icon: 'assets/icon/healing.svg',
      label: 'Seguro de Accidentes',
      visible: true
    },
    {
      key: 'SOLICITUDES',
      icon: 'assets/icon/task.svg',
      label: 'Solicitudes',
      visible: true
    },
    {
      key: 'TEAMS',
      icon: 'assets/icon/teams.svg',
      label: 'Acceso Teams',
      visible: true
    },
    {
      key: 'SEDE',
      icon: 'assets/icon/business.svg',
      label: 'Mi Sede',
      visible: true
    },
    {
      key: 'ONEDRIVE',
      icon: 'assets/icon/cloud.svg',
      label: 'OneDrive',
      visible: true
    },
    {
      key: 'RESERVAS_ESPACIOS',
      icon: 'assets/icon/workspaces.svg',
      label: 'Reserva de Espacios',
      visible: true
    },
    {
      key: 'PORTAL_PAGOS',
      icon: 'assets/icon/account_balance_wallet.svg',
      label: 'Portal de Pagos',
      visible: true
    },
    {
      key: 'VISUALIZACION_PAGOS',
      icon: 'assets/icon/credit_card.svg',
      label: 'Visualización de Pagos',
      visible: true
    }
  ];

  constructor(private dialog: DialogService) { }

  ngOnInit() {
  }
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    this.data = ev.detail.complete(this.data);

    ev.detail.complete();
  }
  handleVisibility(item: any) {
    this.data = this.data.map((_item: any) => {
      return {
        ..._item,
        visible: _item.key == item.key ? !item.visible : _item.visible
      };
    });
  }
  resolverIcono(item: any) {
    if (item.visible) {
      return 'visibility';
    }
    else {
      return 'visibility_off';
    }
  }
  async guardar() {
    await this.dialog.dismissModal(this.data);
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  async reestablecer() {
    await this.dialog.dismissModal(this.accesosDirectos);
  }

}
