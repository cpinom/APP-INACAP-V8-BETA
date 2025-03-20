import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutorIaService } from 'src/app/core/services/http/tutor-ia.service';

@Component({
  selector: 'app-agente-practico',
  templateUrl: './agente-practico.page.html',
  styleUrls: ['./agente-practico.page.scss'],
})
export class AgentePracticoPage implements OnInit {

  private api = inject(TutorIaService);
  private router = inject(Router);

  seccion: any;

  constructor() {
    this.seccion = this.router.getCurrentNavigation()?.extras.state;
    console.log(this.seccion);
  }

  ngOnInit() {
  }

}
