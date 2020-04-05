import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'conversion-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  appName: string;
  constructor() { }

  ngOnInit() {
  }

}
