import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutor-ia',
  templateUrl: './tutor-ia.page.html',
  styleUrls: ['./tutor-ia.page.scss'],
})
export class TutorIaPage implements OnInit {

  private router = inject(Router);

  constructor() { }

  ngOnInit() {
  }
  get backUrl() {
    return this.router.url.replace('/tutor-ia', '');
  }

}
