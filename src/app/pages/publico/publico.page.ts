import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { AppGlobal } from 'src/app/app.global';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.page.html',
  standalone: false
})
export class PublicoPage implements OnInit, AfterViewInit {

  @ViewChild(IonTabs, { static: false }) tabs!: IonTabs;
  private global = inject(AppGlobal);
  private events = inject(EventsService);

  constructor() { }
  ngOnInit() { }
  ngAfterViewInit() {
    this.global.PublicOutlet = this.tabs.outlet;
  }

}
