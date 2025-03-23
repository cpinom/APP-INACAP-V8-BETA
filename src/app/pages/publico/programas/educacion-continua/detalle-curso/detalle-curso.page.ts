import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { VISTAS } from 'src/app/core/constants/publico';
import { EducacionContinuaService } from 'src/app/core/services/http/educacion-continua.service';
import { PublicService } from 'src/app/core/services/http/public.service';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.page.html',
  styleUrls: ['./detalle-curso.page.scss'],
})
export class DetalleCursoPage implements OnInit {

  data: any;
  tabsModel = 0;
  fechaForm: FormGroup;
  sedeFechas: any;
  codigoInstancia!: string;

  constructor(private api: EducacionContinuaService,
    private publicApi: PublicService,
    private router: Router,
    private nav: NavController,
    private utils: UtilsService,
    private fb: FormBuilder,
    private global: AppGlobal) {

    this.fechaForm = this.fb.group({
      codinstancia: ['', Validators.required]
    });

    this.data = this.router.getCurrentNavigation()?.extras.state;
  }
  ngOnDestroy() {
    //this.api.removeStorage('curso');
  }
  resolverFechas() {
    let grupos = this.utils.groupBy(this.data.iniciocurso, 'fecha');
    let fechas = [];

    for (let grupo in grupos) {
      fechas.push({
        label: this.resolverFecha(grupo),
        items: grupos[grupo]
      });
    }
    return fechas;
  }
  async ngOnInit() {
    if (!this.data) {
      await this.nav.navigateBack(this.backPath);
      return;
    }
    else {
      this.sedeFechas = this.resolverFechas();
      this.codigoInstancia = this.data.iniciocurso[0].codinstancia;
      this.codinstancia?.setValue(this.codigoInstancia);
      this.publicApi.marcarVistaPublica(VISTAS.DETALLE_CURSO);
    }
  }
  async ionViewDidEnter() { }
  async ionViewWillLeave() { }
  async matricular() {
    await this.inscripcion();
  }
  async postular() {
    const url = 'https://fs16.formsite.com/disenogst/v61w452ae1/index.html?_ga=2.140586550.580867460.1615811784-521774017.1602609432';
    await this.utils.openLink(url);
  }
  async inscripcion() {
    if (this.fechaForm.valid) {
      const codcurso = this.data.codcurso;
      const codinstancia = this.sedeFecha ? this.sedeFecha.codinstancia : '0';
      const url = `https://siga.inacap.cl/Inacap.Api.EducacionContinua/Home?action=config&t=${this.data.codTipoCurso}&s=0&v=1&c=${codcurso}&i=${codinstancia}&u=`;

      await this.utils.openLink(url);

      // await this.api.setStorage('curso', Object.assign(this.data, { codinstancia: this.codinstancia?.value }));

      // if (this.esExalumno) {
      //   await this.nav.navigateForward(`${this.router.url}/formulario-inscripcion`);
      // }
      // else {
      //   await this.nav.navigateForward('/publico/programas/detalle-curso/formulario-inscripcion');
      // }
    }
  }
  async info() {
    const tipocurso = this.data.informacion[0].codsence ? 1 : 5;
    const codcurso = this.data.codcurso;
    const codsede = this.sedeFecha ? this.sedeFecha.sedeCcod : '0';
    const codinstancia = this.sedeFecha ? this.sedeFecha.codinstancia : '0';
    const url = `https://crmext.inacap.cl/CRM_MercadoAbierto/SolicitudInformacion.aspx?t=${tipocurso}&s=${codsede}&c=${codcurso}&v=1&i=${codinstancia}`;
    await this.utils.openLink(url);
  }
  sedeFechaChange() {
    this.codinstancia?.setValue(this.sedeFecha.codinstancia);
  }
  resolverFecha(fechaCadena: string) {
    let fecha = fechaCadena.split(' ');
    let mesEn = fecha[1];
    var nomMesesp = ["undefined",
      "Enero", "Febrero", "Marzo",
      "Abril", "Mayo", "Junio", "Julio",
      "Agosto", "Septiembre", "Octubre",
      "Noviembre", "Diciembre"
    ];

    var nomMesen = ["undefined",
      "january", "february", "march",
      "april", "may", "june", "july",
      "august", "september", "october",
      "november", "december"
    ];
    var x = 0;
    var mes = mesEn;
    while (nomMesen.length >= x) {
      if (nomMesen[x] == mesEn) {
        mes = nomMesesp[x];
      }
      x++;
    }
    return `${fecha[0]} ${mes} ${fecha[2]}`;
  }
  get sedeFecha() {
    if (this.codigoInstancia) {
      return this.data.iniciocurso.find((t: any) => t.codinstancia == this.codigoInstancia);
    }
    return null;
  }
  get imgSrc() {
    return this.data ? `${this.global.Api}/api/v3/educacion-continua/imagen-curso/${this.data.codcurso}/1` : '';
  }
  get codinstancia() {
    return this.fechaForm.get('codinstancia');
  }
  get esExalumno() {
    return this.router.url.startsWith('/exalumno');
  }
  get backPath() {
    return this.esExalumno ? '/exalumno/inicio/educacion-continua' : '/publico/programas/educacion-continua';
  }

}
