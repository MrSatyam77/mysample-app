import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-to-do-summary',
  templateUrl: './to-do-summary.component.html',
  styleUrls: ['./to-do-summary.component.scss']
})
export class ToDoSummaryComponent implements OnInit {

  @Input() rowColor: any;
  constructor() { }

  ngOnInit() {
  }

}
