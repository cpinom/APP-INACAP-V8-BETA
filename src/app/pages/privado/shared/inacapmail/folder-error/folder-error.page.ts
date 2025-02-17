import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonNav } from '@ionic/angular';
import { FolderContentPage } from '../folder-content/folder-content.page';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-folder-error',
  templateUrl: './folder-error.page.html',
  styleUrls: ['./folder-error.page.scss'],
})
export class FolderErrorPage implements OnInit {

  constructor(private router: Router,
    private nav: IonNav,
    private events: EventsService) { }

  ngOnInit() { }
  recargar() {
    this.nav.setRoot(FolderContentPage);
    this.events.app.next({ action: 'mail:folder-error-reload' })
  }
  get returnPath() {
    if (this.router.url.startsWith('/alumno/inicio')) {
      return '/alumno/inicio';
    } 
    else if (this.router.url.startsWith('/docente/inicio')) {
      return '/docente/inicio';
    } 
    else if (this.router.url.startsWith('/exalumno/inicio')) {
      return '/exalumno/inicio';
    }
  }

}
