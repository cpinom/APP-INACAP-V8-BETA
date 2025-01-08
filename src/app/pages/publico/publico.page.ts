import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publico',
  templateUrl: './publico.page.html',
  standalone: false
})
export class PublicoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  checkTap(e: any, index: number) {
    console.log('checkTap', e, index);
  }

}
