import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDashboardWidgetOption } from '@app/dashboard/dashboard.model';

@Component({
  selector: 'app-hidden-widget',
  templateUrl: './hidden-widget.component.html',
  styleUrls: ['./hidden-widget.component.scss']
})
export class HiddenWidgetComponent implements OnInit {

  @Input() rowColor: any;
  @Input() hiddenWidgets: IDashboardWidgetOption[] = [];
  @Output() unhide: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  unhideWidget(dataItem) {
    this.unhide.emit(dataItem.key)
  }

  // Method in component class
  trackByFn(index, item) {
    return index;
  }

  ngOnInit() {
  }

}
