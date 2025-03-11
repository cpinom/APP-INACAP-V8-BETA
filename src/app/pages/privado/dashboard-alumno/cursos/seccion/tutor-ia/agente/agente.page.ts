import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agente',
  templateUrl: './agente.page.html',
  styleUrls: ['./agente.page.scss'],
})
export class AgentePage implements OnInit {

  message!: string;

  constructor() { }

  ngOnInit() {
  }
  sendMessage () {
    console.log(this.message);
  }

}
