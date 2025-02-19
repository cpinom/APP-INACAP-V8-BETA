import { Component, inject, OnInit } from '@angular/core';
import { EventsService } from 'src/app/core/services/events.service';

@Component({
  selector: 'app-dashboard-alumno',
  templateUrl: './dashboard-alumno.page.html',
  styleUrls: ['./dashboard-alumno.page.scss'],
})
export class DashboardAlumnoPage implements OnInit {

  private events = inject(EventsService);

  constructor() { }

  ngOnInit() {
  }
  checkTap(ev?: Event, index?: number) {
    this.events.app.next({ action: 'scrollTop', index: index, ev: ev });
  }

}
