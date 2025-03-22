import { Component, OnInit } from '@angular/core';

enum Sedes {
  Cercanas = 0,
  Todas = 1
}

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.page.html',
  styleUrls: ['./sedes.page.scss'],
  standalone: false
})
export class SedesPage implements OnInit {

  tabsModel = Sedes.Cercanas;

  constructor() { }

  ngOnInit() {
  }
  segmentChanged(ev: any) {
  }

}
