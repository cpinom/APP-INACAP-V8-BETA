import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinicas-academicas',
  templateUrl: './clinicas-academicas.page.html',
  styleUrls: ['./clinicas-academicas.page.scss'],
})
export class ClinicasAcademicasPage implements OnInit {

  mostrarCargando = true;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.mostrarCargando = false;
    }, 1000);
  }

}
