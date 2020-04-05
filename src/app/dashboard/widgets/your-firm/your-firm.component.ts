// External imports
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// Internal imports
import { UserService, ResellerService, SubscriptionService } from '@app/shared/services';

@Component({
  selector: 'app-your-firm',
  templateUrl: './your-firm.component.html',
  styleUrls: ['./your-firm.component.scss']
})
export class YourFirmComponent implements OnInit {

  @Input() rowColor: any;
  public result: any = {}; // To store result to check setup is done or not
  public permission: any = {}; // For Check permission of user on base on privilege
  public userDetails: any = {};    // Load master details
  public hasFeaturePermission: any; // user has this feature or not
  public yourFirmDetails: any = {};
  constructor(private router: Router, private userService: UserService, private resellerService: ResellerService, private subscriptionService: SubscriptionService) { }

  /**
   * @author Om kanada
   * @description
   * Permission Based on privillege
   */
  private permissionBasedOnUserCan(): void {
    this.permission = {
      canListPrepare: this.userService.can('CAN_LIST_PREPARER'),
      canListLocation: this.userService.can('CAN_LIST_LOCATION'),
      canListUser: this.userService.can('CAN_LIST_USER'),
      canListRole: this.userService.can('CAN_LIST_ROLE'),
      canListEin: this.userService.can('CAN_LIST_EIN'),
    };
  }

  /**
   * @author Om kanada
   * @description
   * check whether user has feature
   */
  public hasFeature(featureName: string): boolean {
    return this.resellerService.hasFeature(featureName);
  }

  /**
   * @author Om kanada
   * @description
   * Redirect to subscription
   */
  public goToSubscription(): void {
    if (this.hasFeaturePermission) {
      // Load master details
      this.userDetails = this.userService.getUserDetails();
      if (!this.userDetails) {
        this.userDetails = { masterLocationData: { customerNumber: '' } };
      } else if (!(this.userDetails.masterLocationData)) {
        this.userDetails.masterLocationData = { customerNumber: '' };
      } else if (!(this.userDetails.masterLocationData.customerNumber)) {
        this.userDetails.masterLocationData.customerNumber = '';
      }
      // Call Subscription service
      this.subscriptionService.goToSubscription(this.userDetails.masterLocationData.customerNumber);

    }
  }
  /**
   * @author Om kanada
   * @description
   * routing through Firmname
   */

  public routingBasedOnFirmName(FirmName: string): void {
    if (FirmName === 'QuickOfficeSetup') {
      this.router.navigate(['office/overview']);
    } else if (FirmName === 'Office') {
      this.router.navigate(['manage', 'location', 'list']);
    } else if (FirmName === 'Preparer') {
      this.router.navigate(['manage', 'preparer', 'list']);
    } else if (FirmName === 'User') {
      this.router.navigate(['manage', 'user', 'list']);
    } else if (FirmName === 'Role') {
      this.router.navigate(['manage', 'role', 'list']);
    }
  }

  ngOnInit() {
    this.hasFeaturePermission = this.hasFeature('SUBSCRIPTION');
    this.permissionBasedOnUserCan();
    this.result = this.userService.isSetupDone();
    this.yourFirmDetails.isSetupCompleted = this.result.isSetupDone;
    this.yourFirmDetails.singleOfficePreparer = this.result.singleOfficePreparer;
  }



}
