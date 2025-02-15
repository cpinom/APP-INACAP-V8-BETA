import { Component, inject, Input, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent implements OnInit {

  @Input() src!: string;
  @Input() title!: string;
  private dialog = inject(DialogService);

  constructor() { }

  ngOnInit() { }

  async cerrar() {
    await this.dialog.dismissModal();
  }

}
