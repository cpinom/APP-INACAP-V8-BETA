import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonNav } from '@ionic/angular';
import { AlumnoService } from 'src/app/core/services/http/alumno.service';
import { DocenteService } from 'src/app/core/services/http/docente.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { InacapMailService } from 'src/app/core/services/http/inacapmail.service';
import { FolderContentPage } from './folder-content/folder-content.page';
import { FolderErrorPage } from './folder-error/folder-error.page';
import { EventsService } from 'src/app/core/services/events.service';
import { Subscription } from 'rxjs';
import { ExalumnoService } from 'src/app/core/services/http/exalumno.service';
import { VISTAS_ALUMNO } from 'src/app/core/constants/alumno';
import { VISTAS_DOCENTE } from 'src/app/core/constants/docente';
import { VISTAS_EXALUMNO } from 'src/app/core/constants/exalumno';

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
  @ViewChild('nav') nav!: IonNav;
  errorObs: Subscription;

  private router = inject(Router);
  private events = inject(EventsService);
  private api = inject(InacapMailService);
  private error = inject(ErrorHandlerService);
  private alumnoApi = inject(AlumnoService);
  private docenteApi = inject(DocenteService);
  private exalumnoApi = inject(ExalumnoService);

  constructor() {

    this.errorObs = this.events.app.subscribe(event => {
      if (event.action == 'mail:folder-error-reload') {
        this.init();
      }
    });

    if (this.esAlumno) {
      this.returnPath = '/dashboard-alumno/inicio';
    }
    else if (this.esDocente) {
      this.returnPath = '/dashboard-docente/inicio';
    }
    else {
      this.returnPath = '/dashboard-exalumno/inicio';
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
      catch (error: any) {
        if (error && error.status == 401) {
          await this.error.handle(error);
        }
      }
    }

    if (!folders) {
      this.nav.setRoot(FolderErrorPage);
      return
    }

    this.folders = folders;
    this.folders.forEach((folder: any) => folder.selected = false);

    if (!this.selectedFolder) {
      this.selectedFolder = folders.find((folder: any) => folder.isInbox);
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
    this.folders.forEach((folder: any) => folder.selected = folder.id == this.selectedFolder.id);
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

      folders.forEach((folder: any) => {
        if (folder.id == this.selectedFolder.id) {
          folder.selected = true;
        }
      });

      this.folders = folders;
      this.api.setStorage('folders', this.folders);
    }
    catch (error: any) {
      if (error && error.status == 401) {
        await this.error.handle(error);
      }
    }
    finally {
      this.cargando = false;
    }
  }
  async resolverCorreos() {
    let api;
    let cursos;
    let correos: any[] = [];

    if (this.esAlumno) api = this.alumnoApi;
    else if (this.esDocente) api = this.docenteApi;
    else if (this.esExalumno) api = this.exalumnoApi;

    if (api) {
      cursos = await api.getStorage('cursos');
    }

    if (!cursos) {
      try {
        let result: any;
        
        if (api && 'getAlumnos' in api) {
          result = await api.getAlumnos();
          if (result.success) {
            cursos = result.cursos;
          }
        }
      }
      catch { }
    }

    if (cursos) {
      cursos.forEach((curso: any) => {
        curso.alumnos.forEach((alumno: any) => {
          let index = correos.findIndex(t => t.correo == alumno.persTemailInacap);

          if (index == -1) {
            correos.push({
              correo: alumno.persTemailInacap,
              nombre: `${alumno.persTapePaterno}, ${alumno.persTnombre}`
            })
          }
        })
      });

      if (api) {
        api.setStorage('cursos', cursos);
        api.setStorage('users', correos);
      }
    }
  }
  get esAlumno() { return this.router.url.startsWith('/dashboard-alumno'); }
  get esDocente() { return this.router.url.startsWith('/dashboard-docente'); }
  get esExalumno() { return this.router.url.startsWith('/dashboard-exalumno'); }
  get Vista() {
    return this.esAlumno ? VISTAS_ALUMNO.INACAPMAIL : (this.esDocente ? VISTAS_DOCENTE.INACAPMAIL : VISTAS_EXALUMNO.INACAPMAIL);
  }

}
