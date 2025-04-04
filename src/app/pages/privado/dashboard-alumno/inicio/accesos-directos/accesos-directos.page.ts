import { Component, inject, OnInit } from '@angular/core';
import { ItemReorderEventDetail } from '@ionic/angular';
import { AccesosDirectos } from 'src/app/core/interfaces/alumnos.interfaces';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-accesos-directos',
  templateUrl: './accesos-directos.page.html',
  styleUrls: ['./accesos-directos.page.scss'],
})
export class AccesosDirectosPage implements OnInit {

  private dialog = inject(DialogService);
  private profile = inject(ProfileService);

  data: any;
  backup: any;
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
      key: 'E-CLASS',
      icon: 'assets/icon/devices.svg',
      label: 'Ambiente de Aprendizaje Online',
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
      icon: 'assets/icon/assignment_ind.svg',
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

  constructor() { }
  ngOnInit() {
    this.backup = JSON.parse(JSON.stringify(this.data));
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
  existenCambios(arr1: any[], arr2: any[]) {
    if (arr1.length !== arr2.length) return true;

    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];

      const claves = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
      for (const clave of claves) {
        if (obj1[clave] !== obj2[clave]) {
          return true;
        }
      }
    }

    return false;
  }
  async guardar() {
    if (this.existenCambios(this.backup, this.data)) {
      await this.dialog.dismissModal(this.data);
      return;
    }

    await this.dialog.dismissModal();
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }
  async reestablecer() {
    const programa = await this.profile.getPrograma();

    if (programa && programa.sedeCcod != 47) {
      const eClassAccess = this.accesosDirectos.find(t => t.key == 'E-CLASS');

      if (eClassAccess) {
        eClassAccess.disabled = true;
      }
    }

    await this.dialog.dismissModal(this.accesosDirectos);
  }

}
