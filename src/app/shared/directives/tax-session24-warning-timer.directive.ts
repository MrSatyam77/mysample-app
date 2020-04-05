//External Imports
import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';

//Internal Imports
import { BasketService } from '@app/shared/services/basket.service';
import { CommunicationService } from '@app/shared/services/communication.service';

@Directive({
  selector: '[appTaxSession24WarningTimer]'
})
export class TaxSession24WarningTimerDirective implements OnInit, OnDestroy {
  //hold subscription object
  private _startTimerSubscription: any;
  //hold warning time to show
  private warningTime: any;
  //Hold interval
  private autoLogoutInterval: any;

  constructor(
    private _basketService: BasketService,
    private _communicationService: CommunicationService,
    private _elementRef: ElementRef) {
    //subscription to  set timer in a headerNav
    const self = this;
    self._startTimerSubscription = self._communicationService.transmitter.subscribe((data: any) => {
      if (data.topic == 'SetTimerForAutoLogout') {
        self.startTimer(data.data.warningTime);
      }
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description if warning time is availble then start timer
   */
  ngOnInit() {
    //if warning time is available then get form basketService
    this.warningTime = this._basketService.popItem('taxSession24RemainingTime');
    this.setWarningTime(this.warningTime);
    if (this.warningTime != undefined && this.warningTime != '') {
      this.startTimer(this.warningTime);
    }
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to start timer for auto logout 
   * @param pass warning time to set
   */
  startTimer(warningTime) {
    const self = this;
    self.warningTime = warningTime;
    this.setWarningTime(self.warningTime);
    self.autoLogoutInterval = setInterval(() => {
      self.warningTime = self.warningTime - 1000;
      self.setWarningTime(self.warningTime);
      if (self.warningTime == 0) {
        //publish postal message for logout 
        this._communicationService.transmitData({
          channel: 'MTPO-Return',
          topic: 'LogoutFromTaxSession24',
          data: {}
        });
      }
    }, 1000);
  }

  /**
   * @author Heena Bhesaniya
   * @description //set warning time in directive inner html
   * @param warningTime pass time to set
   */
  setWarningTime(warningTime) {
    if (warningTime != undefined) {
      this._elementRef.nativeElement.innerHTML = warningTime;
    }
  }

  /**
   * @author Heena Bhesaniya
   * @description destroy interval and subscription events
   */
  ngOnDestroy() {
    //store autologout timer timeout in basketService
    if (this.warningTime != undefined && this.warningTime != '') {
      this._basketService.pushItem('taxSession24RemainingTime', this.warningTime);
      this.warningTime = undefined;
      this.setWarningTime(this.warningTime);
    }
    //cancel autoLogoutInterval
    if (this.autoLogoutInterval != undefined) {
      clearInterval(this.autoLogoutInterval);
      this.autoLogoutInterval = undefined;
    }
    //unsubscribe start timer subscription
    if (this._startTimerSubscription != undefined) {
      this._startTimerSubscription = undefined
    }
  }
}
