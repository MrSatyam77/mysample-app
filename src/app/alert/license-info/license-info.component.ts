//External Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Internal Imports
import { UserService, ResellerService, SystemConfigService, SubscriptionService } from '@app/shared/services';

@Component({
  selector: 'app-license-info',
  templateUrl: './license-info.component.html',
  styleUrls: ['./license-info.component.scss']
})

export class LicenseInfoComponent implements OnInit {
  constructor(private _userService: UserService,
    private _resellerService: ResellerService,
    private _systemConfigService: SystemConfigService,
    private _subscriptionService: SubscriptionService,
    private _router: Router) { }

  public bankProducts: boolean = false;
  public appName: string;
  public licenseName: string;
  public hasCustomerId: boolean;

  /**
  * @author Heena Bhesaniya
  * @description used to redirect subscrption url
  */
  public subscribe() {
    // unlock api call
    let userDetails = this._userService.getUserDetails();
    //get master location details
    if (userDetails.locations && userDetails.locations[userDetails.masterLocationId]) {
      let masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
      this._subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
    }

  };

  /**
  * @author Heena Bhesaniya
  * @description  method to show and hide the feature according to the reseller config
  */
  public hasFeature(featureName) {
    return this._resellerService.hasFeature(featureName);
  };

  /**
   * @author Heena Bhesaniya
   * @description used to navigate to dashboard
   */
  backToHomeScreen() {
    this._router.navigateByUrl('/home');
  }

   /**
   * @author Heena Bhesaniya
   * @description used to intialize data
   */
  ngOnInit() {

    //get appname from resellerService
    this.appName = this._resellerService.getValue("appName");

    //get tax year
    let taxYear = this._userService.getTaxYear();

    //get licenceName
    this.licenseName = this._systemConfigService.getLicenseDisplayText(this._userService.getLicenseValue('licenseName', taxYear));

    let userDetails = this._userService.getUserDetails();
    //get master location details
    if (userDetails.locations && userDetails.locations[userDetails.masterLocationId]) {
      let masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
      if (masterLocationDetails && masterLocationDetails.customerNumber) {
        this.hasCustomerId = true;
      }
    }
  }

}
