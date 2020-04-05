// External imports
import { Injectable } from '@angular/core';

// Internal Imports
import { UserService, } from '@app/shared/services/user.service';
import { MediaService } from "@app/shared/services/media.service";
import { environment } from '@environments/environment';
import { SalesDialogService } from './sales-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  public userDetail: any; // To get userdetail

  constructor(
    private userService: UserService,
    private salesDialogService: SalesDialogService,
    private mediaService: MediaService) { }

  /**
   * @author Om kanada
   * @description
   * goto subscription page
   */
  public goToSubscription(customerNumber?: string) {
    // Check whether user is demo user or not.
    // IF Demo user then prompt for register.
    // ELSE open subscription module.
    if (this.userService.getValue('isDemoUser') === true) {
      this.salesDialogService.openSalesDialog('subscription');
    } else {
      // Get logged in user's details
      this.userDetail = this.userService.getUserDetails();
      // Customer number if not passed
      if (customerNumber === undefined) {
        if ((this.userDetail.locations) && (this.userDetail.locations[this.userDetail.masterLocationId])) {
          customerNumber = this.userDetail.locations[this.userDetail.masterLocationId].customerNumber;
        }
      }
      //
      const masterLocationId = this.userDetail.masterLocationId;
      // Call media Service. Pass true as it is for subscription call
      this.mediaService.identifyAndCallView('subscription');
      // Redirect to subscription app
      // tslint:disable-next-line:max-line-length
      window.open(environment.subscription_url + '/#/store?id=' + customerNumber + '&mLocation=' + masterLocationId + '&redirectUrl=' + window.location.href.replace('#', '%23'), '_blank');
    }
  }
}
