import { Component, OnInit } from '@angular/core';

enum Educacion {
  Superior = 0,
  Continua = 1
}

@Component({
  selector: 'app-programas',
  templateUrl: './programas.page.html',
  styleUrls: ['./programas.page.scss'],
  standalone: false
})
export class ProgramasPage implements OnInit {

  tabsModel = Educacion.Superior;

  constructor() { }

  ngOnInit() {
  }
  segmentChanged(ev: any) {
    debugger
  }

}
