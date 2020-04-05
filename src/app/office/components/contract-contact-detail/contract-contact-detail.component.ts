import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-contract-contact-detail',
  templateUrl: './contract-contact-detail.component.html',
  styleUrls: ['./contract-contact-detail.component.scss']
})
export class ContractContactDetailComponent implements OnInit, OnChanges {

  // list of contract contacts
  @Input() contractContacts: any = [];

  // detail obj of contract contact
  public contractContactDetail: any;

  constructor() { }

  ngOnChanges() {
    this.contractContacts = JSON.parse(JSON.stringify(this.contractContacts));
    if (this.contractContacts.length <= 1) {
      this.contractContactDetail = this.contractContacts[0] ? this.contractContacts[0] : undefined;
    }
  }

  ngOnInit() {
  }

}
