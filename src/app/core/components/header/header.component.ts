import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  @Input('inacapImg') logoSrc: any;
  @Input('personIcon') personIcon: any;
  @Input('personLink') personLink!: string;
  @Input('notificationIcon') notificationIcon: any;
  @Input('notificationLink') notificationLink!: string;
  @Output() personTap: EventEmitter<any> = new EventEmitter();
  @Output() notificacionTap: EventEmitter<any> = new EventEmitter();

  constructor(private nav: NavController) { }

  ngOnInit() { }
  async usuarioTap() {
    if (this.personLink) {
      await this.nav.navigateForward(this.personLink);
    }
  }
  async notificacionesTap() {
    if(this.notificationLink) {
      await this.nav.navigateForward(this.notificationLink);
    }
    this.notificacionTap.emit();
  }

}
