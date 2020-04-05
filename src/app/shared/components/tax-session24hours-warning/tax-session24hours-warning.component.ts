//External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tax-session24hours-warning',
  templateUrl: './tax-session24hours-warning.component.html',
  styleUrls: ['./tax-session24hours-warning.component.scss']
})

export class TaxSession24hoursWarningComponent implements OnInit {
  //hold input data
  @Input() data;
  //hold interval object
  private interval: any;
  //hold remaining time to dispay
  public remainingTime: number;

  constructor(private ngbActiveModal: NgbActiveModal) { }

  /**
   * @description close diloag
   * @param signout  pass action 'continue' or 'signout'
   */
  close(button: string) {
    // cancel interval
    clearInterval(this.interval);
    this.interval = undefined;
    //close diloag
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
    }, 60000);
  }
}
