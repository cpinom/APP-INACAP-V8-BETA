import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SedeComponent } from 'src/app/core/components/sede/sede.component';
import { ProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.page.html'
})
export class SedePage implements OnInit {

  @ViewChild(SedeComponent, { static: true }) sedeCmp!: SedeComponent;
  mostrarCargando = true;
  mostrarError = false;

  private profile = inject(ProfileService);
  constructor() { }

  async ngOnInit() {
    await this.cargar();
  }
  async cargar() {
    let principal = await this.profile.getStorage('principal');
    let programa = principal.programas[principal.programaIndex];
    let sedes = [{ sedeCcod: programa.sedeCcod }];

    await this.sedeCmp.loadData(sedes);
  }
  async sedeCargada(e?: any) {
    this.mostrarCargando = false;
  }
  async sedeError(e?: any) {
    this.mostrarError = true;
  }

}
