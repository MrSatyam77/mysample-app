// External imports
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// Internal imports
import { UserService } from '@app/shared/services/user.service';
import { ResellerService } from '@app/shared/services/reseller.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';

@Component({
  selector: 'app-mytaxportal',
  templateUrl: './mytaxportal.component.html',
  styleUrls: ['./mytaxportal.component.scss']
})
export class MytaxportalComponent implements OnInit {
  @Input() rowColor: any;
  isClientPortalFeatureEnable: boolean;
  permission: any = {}; // For Check permission of user on base on privilege


  constructor(private router: Router, private userService: UserService, private resellerService: ResellerService, private systemConfigService: SystemConfigService) { }

  /**
   * @author Om Kanada
   * function used to decide hide or show mytaxportal widget on based on taxyear,vita user and hasFeature
   * @memberof MytaxportalComponent
   */
  initialCheckHideOrMyTaxPortalWidget(): void {
    const userTaxYear = this.userService.getTaxYear().toString();
    const userDetails = this.userService.getUserDetails();
    const hasFeature = this.resellerService.hasFeature('MYTAXPORTAL');
    let isVitaCustomer = false;
    if (userDetails && userDetails.masterLocationId === this.systemConfigService.getVitaCustomerLocation()) {
      isVitaCustomer = true;
    }
    // check weather return can disable for offline mode
    if (userTaxYear === '2018' && isVitaCustomer !== true && hasFeature) {
      this.isClientPortalFeatureEnable = true;
    } else {
      this.isClientPortalFeatureEnable = false;
    }
  }
  /**
   * @author Om kanada
   * @description
   *  On based on List routing.
   */
  public goToList(type: string): void {
    this.router.navigate(['mytaxportal', type]);
  }

  /**
   * @author Om kanada
   * @description
   *  Give Permission on based on privilege Oninit.
   */
  ngOnInit() {
    this.permission = {
      canViewInvitedClient: this.userService.can('CAN_VIEW_INVITED_CLIENT'),
      canInviteClient: this.userService.can('CAN_INVITE_CLIENT'),
      canViewClientSetting: this.userService.can('CAN_VIEW_CLIENT_SETTING')
    };
    this.initialCheckHideOrMyTaxPortalWidget();
  }

}
