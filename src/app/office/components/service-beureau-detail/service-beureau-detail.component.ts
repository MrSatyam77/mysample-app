// External Imports
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-beureau-detail',
  templateUrl: './service-beureau-detail.component.html',
  styleUrls: ['./service-beureau-detail.component.scss']
})
export class ServiceBeureauDetailComponent implements OnInit {

  @Input() serviceBeureauDetail: any;
  constructor() { }

  ngOnInit() {
  }

}
