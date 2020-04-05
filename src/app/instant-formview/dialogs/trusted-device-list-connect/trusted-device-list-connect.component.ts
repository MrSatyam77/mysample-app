//External Imports
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal Imports
import { CommonAPIService } from "@app/shared/services/index";
import { APINAME } from '@app/instant-formview/instant-formview.constant';

@Component({
  selector: 'app-trusted-device-list-connect',
  templateUrl: './trusted-device-list-connect.component.html',
  styleUrls: ['./trusted-device-list-connect.component.scss']
})
export class TrustedDeviceListConnectComponent implements OnInit, OnDestroy {

  constructor(private _ngbActiveModal: NgbActiveModal, private _commonAPIService: CommonAPIService) { }

  //hold interval object
  public InterValForPIN = undefined;
  //hold time that need to displayed
  public time;
  //receive dialog input data
  @Input() data;
  //falg to show regenrate pin number when pin is expired.
  public showResendButton = false;

  /**
   * @author Heena Bhesaniya
   * @description call strt timer function to start time
   */
  ngOnInit() {
    this.startTimer();
  }

  /**
   * @author Heena Bhesaniya
   * @description this function is used to start interval
   */
  public startTimer() {
    const self = this;
    self.time = 120000;
    self.InterValForPIN = setInterval(() => {
      self.time = self.time - 1000;
      if (self.time === 0) {
        self.showResendButton = true;
      }
    }, 1000);
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to regenerate pin number
   */
  public resendPIN() {
    const self = this;
    self._commonAPIService.getPromiseResponse({ apiName: APINAME.getPinNumber, methodType: 'post', parameterObject: { 'deviceID': this.data.deviceID } }).then((response: any) => {
      if (response && response.data) {
        self.data.pinNumber = response.data;
        self.showResendButton = false;
        self.startTimer();
      }
    }, error => {
      console.error(error);
    });
  }

  /**
   *@author Heena Bhesaniya
   * @description This function is used to close dialog
   */
  public close() {
    this._ngbActiveModal.close();
    clearInterval(this.InterValForPIN);
  }

  /**
   * @author Heena Bhesaniya
   * @description This function will destroy/clear data
   */
  ngOnDestroy() {
    clearInterval(this.InterValForPIN);
  }
}
