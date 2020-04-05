//External Imports
import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//Internal Imports
import { APINAME } from '@app/shared/shared.constants';
import { TaxIdleConfigService } from '@app/shared/directives/tax-idle-config.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { LocalStorageUtilityService } from '@app/shared/services/local-storage-utility.service';
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { TimeOutWarningComponent } from '@app/shared/components/time-out-warning/time-out-warning.component';
import { CommunicationService } from '@app/shared/services/communication.service';

@Directive({
  selector: '[appTaxIdle]',
  host: {
    '(document:mousemove)': 'eventHandler($event)',
    '(document:mousewheel)': 'eventHandler($event)',
    '(document:mousedown)': 'eventHandler($event)',
    '(document:keydown)': 'eventHandler($event)',
    '(document:touchstart)': 'eventHandler($event)',
    '(document:touchmove)': 'eventHandler($event)',
    '(document:scroll)': 'eventHandler($event)',
  }
})

export class TaxIdleDirective implements OnInit, OnDestroy {

  //configuration
  private config;
  private isIdleTimerRinged = false;
  private idleTimeout;

  constructor(private _taxIdleConfigService: TaxIdleConfigService,
    private _dialogService: DialogService,
    private _localStorageUtilityService: LocalStorageUtilityService,
    private _router: Router,
    private _commonAPIService: CommonAPIService,
    private _communicationService: CommunicationService) {
    this.config = this._taxIdleConfigService.getConfigForTaxIdle();
    //start timeout
    this.registerIdleTimeout();
  }

  /**
   * @author Heena Bhesaniya
   * @description Register idle timeout
   */
  ngOnInit() {
    //start timeout
    this.registerIdleTimeout();
  }

  /**
   * @author Heena Bhesaniya
   * @description when mouse  or key or touch event will fire the we will de register time out here
   * This function will be handler for all events
   * @param ev doument event
   */
  eventHandler(ev: KeyboardEvent) {
    if (this.isIdleTimerRinged === false) {
      //de-register timeout
      this.deRegisterIdleTimeout();
      //register timeout again
      this.registerIdleTimeout();
    }
  }

  //This function will be called when last two minutes are remaining
  public idleTimeoutCallback() {
    //
    this.isIdleTimerRinged = true;
    const self = this;
    //Open dialog from here
    const dialog = self._dialogService.custom(TimeOutWarningComponent, { warningTime: (this.config.warningTime * 60) }, { 'keyboard': false, 'backdrop': false , 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((btnClicked) => {
      if (btnClicked != undefined && btnClicked != '') {
        switch (btnClicked.toLowerCase()) {
          case 'continue':
            //make timer ringed false
            self.isIdleTimerRinged = false;
            //de-register timeout
            self.deRegisterIdleTimeout();
            //register timeout again
            self.registerIdleTimeout();
            //Call keep alive api
            self._commonAPIService.getPromiseResponse({ apiName: APINAME.KEEP_ALIVE, methodType: 'get' })
            break;
          case 'signout':
            //Add loginOption to local storage
            self._localStorageUtilityService.addToLocalStorage('loginOption', 'autosignout');
            //publish message for forced sign out
            this._communicationService.transmitData({
              channel: 'MTPO-Return',
              topic: 'forcedSignOut',
              data: {}
            });

            //Logout user
            self._router.navigate(['/logout']);
        }
      }
    });
  }

  /**
  * @author Heena Bhesaniya
  * @description Register timeout for idleTime
  */
  public registerIdleTimeout() {
    //If last timeout is still runing first cancel it
    if (this.idleTimeout != undefined) {
      this.deRegisterIdleTimeout();
    }
    //register timeout
    const self = this;
    this.idleTimeout = setTimeout(() => {
      //Once time out reached					
      self.idleTimeoutCallback();
    }, (self.config.idleTime - self.config.warningTime) * (60 * 1000));
  }

  /**
   * @author Heena Bhesaniya
   * @description de-register idle timeout
   */
  public deRegisterIdleTimeout() {
    if (this.idleTimeout != undefined) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = undefined;
    }
  }

  /**
   * @author Heena Bhesaniya
   * @description Deregister all the events on destroy
   */
  ngOnDestroy() {
    //de-register timeout
    this.deRegisterIdleTimeout();
  }
}
