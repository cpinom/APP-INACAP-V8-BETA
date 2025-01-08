import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  @Input('inacapImg') logoSrc: any;
  @Input('personIcon') personIcon: any;
  @Input('notificationIcon') notificationIcon: any;
  @Output() personTap: EventEmitter<any> = new EventEmitter();
  @Output() notificacionTap: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
  usuarioTap() {
    this.personTap.emit();
  }
  notificacionesTap() {
    this.notificacionTap.emit();
  }

}
