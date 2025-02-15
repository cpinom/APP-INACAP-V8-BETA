import { Component, inject } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {

  private pt = inject(Platform);

  constructor() {
    this.initializeApp();
  }

  async initializeApp() {
  }

}
