import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bank-application-summary',
  templateUrl: './bank-application-summary.component.html',
  styleUrls: ['./bank-application-summary.component.scss']
})
export class BankApplicationSummaryComponent implements OnInit {

  @Input() rowColor: any;
  
  constructor() { }

  ngOnInit() {
  }

}
