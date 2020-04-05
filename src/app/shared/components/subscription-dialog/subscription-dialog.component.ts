// External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// Internal Imports
import { ResellerService, UserService, SystemConfigService } from '@app/shared/services';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.scss']
})
export class SubscriptionDialogComponent implements OnInit {
  @Input() data: any; // To get input data through dialog
  public bankProducts = false; // To get BankProducts
  public appName: any; // To get AppYear
  private taxYear: string; // Get tax year
  public licenseName: string; // Get licenseName
  private userDetails: any; // To get userDetails
  public hasCustomerId = false; // check wheteher
  public hasFeature: boolean; // To get Feature

  constructor(private modalInstance: NgbActiveModal, private systemConfigService: SystemConfigService, private resellerService: ResellerService, private userService: UserService) { }

  /**
   * @author Om kanada
   * @description
   * Close Dialog
   */
  public subscribe(): void {
    this.modalInstance.close('close');
  }

  /**
   * @author Om kanada
   * @description
   * Dismiss Dialog
   */
  public close(): void {
    this.modalInstance.close('dismiss');
  }


  ngOnInit() {
    if (this.data) {
      this.bankProducts = this.data.bankProducts;
    }
    this.appName = this.resellerService.getValue('appName');
    this.taxYear = this.userService.getTaxYear();
    this.licenseName = this.systemConfigService.getLicenseDisplayText(this.userService.getLicenseValue('licenseName', this.taxYear));
    this.userDetails = this.userService.getUserDetails();
    if (this.userDetails.locations && this.userDetails.locations[this.userDetails.masterLocationId]) {
      const masterLocationDetails = this.userDetails.locations[this.userDetails.masterLocationId];
      if ((masterLocationDetails) && (masterLocationDetails.customerNumber)) {
        this.hasCustomerId = true;
      }
    }
    this.hasFeature = this.resellerService.hasFeature('SUBSCRIPTION');
  }

}
