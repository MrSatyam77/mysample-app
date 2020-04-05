//External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-time-out-warning',
  templateUrl: './time-out-warning.component.html',
  styleUrls: ['./time-out-warning.component.scss']
})

export class TimeOutWarningComponent implements OnInit {
  //hold input data
  @Input() data;
  //hold interval object
  private interval: any;
  //hold remaining time to dispay
  public remainingTime: number;

  constructor(private ngbActiveModal: NgbActiveModal) { }

  /**
   * @description close dialog
   * @param signout  pass action 'continue' or 'signout'
   */
  public close(button) {
    // cancel interval
    clearInterval(this.interval);
    //close dilaog
    this.ngbActiveModal.close(button);
  }

  /**
   * @description 
   * initialize set interval
   */
  ngOnInit() {
    if (this.data) {
      this.remainingTime = Number.parseInt(this.data.warningTime, 10);
    }
    // interval for signout
    const self = this;
    self.interval = setInterval(() => {
      self.remainingTime--;
      if (self.remainingTime === 0) {
        self.close('signout');
      }
    }, 1000);
  }

}
