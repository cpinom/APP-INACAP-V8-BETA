import { Component, inject, OnInit } from '@angular/core';
import { DialogService } from 'src/app/core/services/dialog.service';

@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss'],
})
export class BibliotecaComponent  implements OnInit {

  private dialog = inject(DialogService);
  data: any;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
