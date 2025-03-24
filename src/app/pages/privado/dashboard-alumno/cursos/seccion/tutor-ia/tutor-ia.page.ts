import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tutor-ia',
  templateUrl: './tutor-ia.page.html',
  styleUrls: ['./tutor-ia.page.scss'],
})
export class TutorIaPage implements OnInit {

  private router = inject(Router);
  private nav = inject(NavController);

  seccion: any;

  constructor() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);
  }

  ngOnInit() {
  }
  agenteSocraticoTap() {
    this.nav.navigateForward(`${this.router.url}/agente-socratico`, { state: this.seccion });
  }
  agentePracticoTap() {
    this.nav.navigateForward(`${this.router.url}/agente-practico`, { state: this.seccion });
  }
  iniciarTestTap() {
    this.nav.navigateForward(`${this.router.url}/test`, { state: this.seccion });
  }
  get backUrl() {
    return this.router.url.replace('/tutor-ia', '');
  }

}
