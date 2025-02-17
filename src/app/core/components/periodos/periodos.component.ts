import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AlertInput } from '@ionic/angular';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss'],
})
export class PeriodosComponent implements OnInit {

  @Input('label') label: any;
  @Input('selected') selected: any;
  @Input('periodos') periodos!: any[];
  @Output() onPeriodoSelected: EventEmitter<any> = new EventEmitter();

  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() {
    if (this.periodos.length) {
      if (!this.selected) {
        this.selected = this.periodos[0].periCcod;
      }
      else {
        const periodo = (this.periodos as any[]).filter(t => t.periCcod == this.selected)[0];

        if (!periodo) {
          this.selected = this.periodos[0].periCcod;
        }
      }

      this.aplicarPeriodo();
    }
  }
  aplicarPeriodo(_periCcod?: any) {
    if (_periCcod) {
      this.selected = _periCcod;
    }
    const periodo = (this.periodos as any[]).filter(t => t.periCcod == this.selected)[0];
    this.label = periodo.periTdesc;
  }
  async periodoTap() {
    let options: AlertInput[] = [];

    for (let i = 0; i < this.periodos.length; i++) {
      options.push({
        name: 'opcion',
        type: 'radio',
        label: this.periodos[i].periTdesc,
        value: this.periodos[i].periCcod,
        checked: this.periodos[i].periCcod == this.selected
      });
    }

    await this.dialog.showAlert({
      subHeader: 'Seleccione el período que desee visualizar',
      header: 'Período Académico',
      inputs: options,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Actualizar',
          role: 'destructive',
          handler: (periCcod) => {
            if (periCcod) {
              this.commitPeriodo(periCcod);
            }

            return true;
          }
        }
      ]
    });
  }
  async commitPeriodo(periCcod: any) {
    this.selected = periCcod;
    this.aplicarPeriodo();
    this.onPeriodoSelected.emit(periCcod);
  }

}
