//External Imports
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

//Internal Imports
import { DialogService } from '@app/shared/services/dialog.service';
import { LocalStorageUtilityService, } from '@app/shared/services/local-storage-utility.service';
import { UserService } from '@app/shared/services/user.service';
import { TaxIdleConfigService } from '@app/shared/directives/tax-idle-config.service';
import { TaxSession24hoursWarningComponent } from '@app/shared/components/tax-session24hours-warning/tax-session24hours-warning.component';
import { CommunicationService } from '@app/shared/services/communication.service';

@Directive({
  selector: '[appTaxSession24]'
})
export class TaxSession24Directive implements OnInit, OnDestroy {
  //hold session time object
  private config: any
  //hold interval data
  private interval:any;
  //get user details
  private userDetails: any;
  //hold subsciption object
  private _logoutSubscription: any;

  constructor(private _taxIdleConfigService: TaxIdleConfigService,
    private _dialogService: DialogService,
    private _localStorageUtilityService: LocalStorageUtilityService,
    private _router: Router,
    private _userService: UserService,
    private _communicationService: CommunicationService) {
    //subscription of autologout for set timer
    const self = this;
    self._logoutSubscription = self._communicationService.transmitter.subscribe((data:any) => {
      if (data.topic == 'LogoutFromTaxSession24') {
        self.logout();
      }
    });
  }

  /**
  * @author Heena Bhesaniya
  * @description Register idle timeout
  */
  ngOnInit() {
    this.config = this._taxIdleConfigService.getConfigForTaxSession();
    this.userDetails = this._userService.getUserDetails(undefined);
    //start timeout
    this.registerInterval();
  }

  /**
 * @author Heena Bhesaniya
 * @description This function will be called when last 30 minutes are remaining for auto logout
 * @param remainingTime pass remaining time 
 */
  public openWarningDialog(remainingTime) {
    //de-register interval
    this.deRegisterInterval();
    //Open dialog from here
    const self = this;
    let dialog = self._dialogService.custom(TaxSession24hoursWarningComponent, { warningTime: remainingTime }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((btn) => {
      if (btn == 'logout') {
        self.logout();
      }
    });
  }

  /**
  * @author Heena Bhesaniya
  * @description Register interval for taxSession24
  */
  public registerInterval() {
    //register interval
    const self = this;
    this.interval = setInterval(() => {
      self.taxSessionIntervalCallback();
    }, (self.config.intervalTime * (60 * 1000)));//one minute interval time

    //First time call
    setTimeout(() => {
      self.taxSessionIntervalCallback();
    }, 5000);
  }

  /**
   * @author Heena Bhesaniya
   * @description Execute this function in interval to check if session expired (24 hours) or not
   */
  public taxSessionIntervalCallback() {
    //check is userDetails and lastLoggedInDate is defined
    if (this.userDetails && this.userDetails.lastLoggedInDate) {
      let oldDate = moment(this.userDetails.lastLoggedInDate);//now
      //get current date
      let currentDate = moment();
      //get deffirence in minutes
      let minutes = currentDate.diff(oldDate, 'minutes');
      //check is total diffrence is greater then 24 hours then perform logout directly
      if (minutes >= 1440) {
        this.logout();
      }
      //if minutes(total minutes) in between  23 hours and 30 minutes and 24 hours then open dialog and subscribe message to diaplay time in header nav 
      else if (minutes >= 1410 && minutes < 1440) {
        //method to open dialog
        this.openWarningDialog(1440 - minutes);
        //publish postal message for start timer in headerNav
        this._communicationService.transmitData({
          channel: 'MTPO-Return',
          topic: 'SetTimerForAutoLogout',
          data: { warningTime: ((1440 - minutes) * (60 * 1000)) }
        });
      }
    }
  }

  /**
   * @author Heena Bhesaniya
   * @description de-register interval
   */
  public deRegisterInterval() {
    if (this.interval != undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
    if (this._logoutSubscription != undefined) {
      this._logoutSubscription = undefined;
    }
  }

  /**
   * @author Heena Bhesaniya
   * @description logout after warning time is over
   */
  public logout() {
    //Add loginOption to local storage
    this._localStorageUtilityService.addToLocalStorage('loginOption', 'taxsession24hourlogout');
    //publish message for forced sign out
    this._communicationService.transmitData({
      channel: 'MTPO-Return',
      topic: 'forcedSignOut',
      data: {}
    });

    //Logout user	
    this._router.navigate(['/logout']);
  }

  /**
   * @author Heena Bhesaniya
   * @description Deregister all the events on destroy
   */
  ngOnDestroy() {
    //de-register interval
    this.deRegisterInterval();
  }
}
