import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-dashboard-exalumno',
  templateUrl: './dashboard-exalumno.page.html',
  styleUrls: ['./dashboard-exalumno.page.scss'],
})
export class DashboardExalumnoPage implements OnInit {

  private events = inject(EventsService);

  constructor() { }
  ngOnInit() { }
  checkTap(ev?: Event, index?: number) {
    this.events.app.next({ action: 'scrollTop', index: index, ev: ev });
  }

}
