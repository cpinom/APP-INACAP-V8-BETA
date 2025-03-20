import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutorIaService } from 'src/app/core/services/http/tutor-ia.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

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
