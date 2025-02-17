import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonNav } from '@ionic/angular';
import { VISTAS_ALUMNO, VISTAS_DOCENTE, VISTAS_EXALUMNO } from 'src/app/app.constants';
import { AlumnoService } from 'src/app/core/services/alumno/alumno.service';
import { DocenteService } from 'src/app/core/services/docente/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { ExalumnoService } from 'src/app/core/services/exalumno/exalumno.service';
import { InacapMailService } from 'src/app/core/services/inacapmail.service';
import { FolderContentPage } from './folder-content/folder-content.page';
import { FolderErrorPage } from './folder-error/folder-error.page';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inacapmail',
  templateUrl: './inacapmail.page.html',
  styleUrls: ['./inacapmail.page.scss'],
})
export class InacapmailPage implements OnInit, OnDestroy {

  users: any;
  folders: any;
  selectedFolder: any;
  title: string = 'Cargando...';
  returnPath: string;
  cargando = false;
  rootPage = FolderContentPage;
  @ViewChild('nav') nav: IonNav;
  errorObs: Subscription;

  constructor(private router: Router,
    private events: EventsService,
    private api: InacapMailService,
    private error: ErrorHandlerService,
    private alumnoApi: AlumnoService,
    private docenteApi: DocenteService,
    private exalumnoApi: ExalumnoService) {

    this.errorObs = this.events.app.subscribe(event => {
      if (event.action == 'mail:folder-error-reload') {
        this.init();
      }
    });

    if (this.esAlumno) {
      this.returnPath = '/alumno/inicio';
    }
    else if (this.esDocente) {
      this.returnPath = '/docente/inicio';
    }
    else {
      this.returnPath = '/exalumno/inicio';
    }
  }
  ngOnInit() {
    this.init();
  }
  ngOnDestroy(): void {
    this.errorObs.unsubscribe();
  }
  async init() {
    let folders = await this.api.getStorage('folders');

    if (!folders) {
      try {
        let result = await this.api.getPrincipal();

        if (result.success) {
          folders = result.folders;
        } 
        else {
          throw Error(result.message);
        }
      }
      catch (error) {
        if (error.status == 401) {
          this.error.handle(error);
        }
      }
    }

    if (!folders) {
      this.nav.setRoot(FolderErrorPage);
      return
    }

    this.folders = folders;
    this.folders.forEach(folder => folder.selected = false);

    if (!this.selectedFolder) {
      this.selectedFolder = folders.find(folder => folder.isInbox);
      this.selectedFolder.selected = true;
    }

    if (this.selectedFolder) {
      await this.nav.setRoot(FolderContentPage, { folder: this.selectedFolder });
    }

    this.api.setStorage('folders', this.folders);
    this.resolverCorreos();
    this.api.marcarVista(this.Vista);
  }
  async folderTap(folder: any) {
    this.selectedFolder = folder;
    this.folders.forEach(folder => folder.selected = folder.id == this.selectedFolder.id);
    this.api.setStorage('folders', this.folders);
    this.nav.setRoot(FolderContentPage, { folder: folder });
  }
  async recargar() {
    this.cargando = true;

    try {
      let folders;
      let result = await this.api.getPrincipal();

      if (result.success) {
        folders = result.folders;
      } 
      else {
        throw Error();
      }

      folders.forEach(folder => {
        if (folder.id == this.selectedFolder.id) {
          folder.selected = true;
        }
      });

      this.folders = folders;
      this.api.setStorage('folders', this.folders);
    }
    catch (error) {
      if (error.status == 401) {
        this.error.handle(error);
      }
    }
    finally {
      this.cargando = false;
    }
  }
  async resolverCorreos() {
    let api;
    let cursos;
    let correos = [];

    if (this.esAlumno) api = this.alumnoApi;
    else if (this.esDocente) api = this.docenteApi;
    else if (this.esExalumno) api = this.exalumnoApi;

    cursos = await api.getStorage('cursos');

    if (!cursos) {
      try {
        let result = await api.getAlumnos();

        if (result.success) {
          cursos = result.cursos;
        }
      }
      catch { }
    }

    if (cursos) {
      cursos.forEach(curso => {
        curso.alumnos.forEach(alumno => {
          let index = correos.findIndex(t => t.correo == alumno.persTemailInacap);

          if (index == -1) {
            correos.push({
              correo: alumno.persTemailInacap,
              nombre: `${alumno.persTapePaterno}, ${alumno.persTnombre}`
            })
          }
        })
      });

      api.setStorage('cursos', cursos);
      api.setStorage('users', correos);
    }
  }
  get esAlumno() { return this.router.url.startsWith('/alumno'); }
  get esDocente() { return this.router.url.startsWith('/docente'); }
  get esExalumno() { return this.router.url.startsWith('/exalumno'); }
  get Vista() {
    return this.esAlumno ? VISTAS_ALUMNO.INACAPMAIL : (this.esDocente ? VISTAS_DOCENTE.INACAPMAIL : VISTAS_EXALUMNO.INACAPMAIL);
  }

}
