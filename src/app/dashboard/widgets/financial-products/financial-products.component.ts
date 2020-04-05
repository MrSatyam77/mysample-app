//  External  imports
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
// Internal imports
import { UserService, ResellerService, DialogService, SubscriptionService } from '@app/shared/services';
import { FinancialProductsService } from '@app/dashboard/widgets/financial-products/financial-products.service';
import { IbankProduct } from '@app/dashboard/widgets/financial-products/financial-products.model';
import { SubscriptionDialogComponent } from '@app/shared/components/subscription-dialog/subscription-dialog.component';
@Component({
  selector: 'app-financial-products',
  templateUrl: './financial-products.component.html',
  styleUrls: ['./financial-products.component.scss']
})
export class FinancialProductsComponent implements OnInit, OnDestroy {

  @Input() rowColor: any;
  private userDetails: any = {}; // To get user details From userservice
  private masterLocationDetails: any; // To get MasterLocation Details
  public permission: any = {}; // For Check permission of user on base on privilege
  private refreshTimer: Subscription; // To callApi after Some Time Of delay
  public bankProductList: any = []; // To get response of Api
  public refreshStart = false; // To start refresh
  public subscriptionType = ''; // To get subscriptionType
  constructor(private subscriptionService: SubscriptionService, private dialogService: DialogService, private router: Router, private resellerService: ResellerService, private financialProductService: FinancialProductsService, private userService: UserService) { }

  /**
   * @author Om kanada
   * @description
   *  Register $interval for background update of list, third argument is for infinite and last is to prevent to execute on every dirty checking.
   */
  public refreshList(): void {
    if (this.permission.canGetBankStatus) {
      this.refreshTimer = interval(60400).subscribe(() => {
        this.financialProductService.getBankProducts().then((response: Array<IbankProduct>) => {
          for (const index in response) {
            response[index].hasFeature = this.resellerService.hasFeature(response[index].bankType + 'Enrollment');
          }
          this.bankProductList = response;
        }, (error) => {
          if (error) {
            this.cancelInterval();
          }
        });
      });
    }
  }

  /**
   * @author Om kanada
   * @description
   * This method is responsible for calling BankList api and register/unregister interval for auto refresh.
   */
  public manualRefreshListBankProduct(delay: number): void {
    /*Cancel iterate of auto refresh if already registered*/
    if (this.refreshTimer) {
      this.cancelInterval();
      this.refreshTimer = undefined;
    }
    // Check if delay is passed
    if (delay) {
      setTimeout(() => {
        this.callBankAPI();
      }, delay);
    } else {
      // Call API function
      this.callBankAPI();
    }
  }
  /**
   * @author Om kanada
   * @description
   * cancel interval.
   */
  private cancelInterval(): void {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
  }

  public callBankAPI() {
    return new Promise((resolve, reject) => {
      this.financialProductService.getBankProducts().then((response: Array<IbankProduct>) => {
        this.refreshStart = false;

        // tslint:disable-next-line:forin
        for (const index in response) {
          response[index].hasFeature = this.resellerService.hasFeature(response[index].bankType + 'Enrollment');
        }
        this.bankProductList = response;
        resolve(response);
      }, (error) => {
        this.refreshStart = false;
        /*Re register background refresh of list if not*/
        if (this.refreshTimer) {
          this.refreshList();
        }
        reject(error);
      });

    });
  }
  /**
   * @author Om kanada
   * @description
   * On destroy.
   */
  ngOnDestroy() {
    this.cancelInterval();
  }
  // this gotoBAnk function is redirect particular bank as par user selected.
  goToBank(bankFlag: IbankProduct): void {
    // If enrollment for this bank is enabled for reseller
    // if (this.resellerService.hasFeature(bankFlag.bankType + 'Enrollment') === true) {
    // IF NOT PAID user then show subscription dialoge
    // ELSE redirect to bank
    if (this.userDetails.isDemoUser === true || this.subscriptionType === 'ANNUAL') {
      // condition to check the bank type
      if (bankFlag.bankType === 'EPS' || bankFlag.bankType === 'ATLAS' || bankFlag.bankType === 'NAVIGATOR' || bankFlag.bankType === 'REFUNDADVANTAGE' || bankFlag.bankType === 'TPG' || bankFlag.bankType === 'REDBIRD' || bankFlag.bankType === 'AUDITALLIES' || bankFlag.bankType === 'PROTECTIONPLUS' || bankFlag.bankType === 'EPAY') {
        if (bankFlag.bankType === 'EPS') {
          this.router.navigate(['bank', 'eps']);
        } else if (bankFlag.bankType === 'ATLAS') {
          this.router.navigate(['bank', 'atlas']);
        } else if (bankFlag.bankType === 'NAVIGATOR') {
          this.router.navigate(['bank', 'navigator']);
        } else if (bankFlag.bankType === 'REFUNDADVANTAGE') {
          this.router.navigate(['bank', 'refundAdvantage']);
        } else if (bankFlag.bankType === 'TPG') {
          this.router.navigate(['bank', 'tpg']);
        } else if (bankFlag.bankType === 'REDBIRD') {
          this.router.navigate(['bank', 'redBird']);
        } else if (bankFlag.bankType === 'AUDITALLIES') {
          this.router.navigate(['bank', 'auditAllies']);
        } else if (bankFlag.bankType === 'PROTECTIONPLUS') {
          this.router.navigate(['bank', 'protectionPlus']);
        } else if (bankFlag.bankType === 'EPAY') {
          this.router.navigate(['bank', 'epay']);
        }
      } else {
        // dialog open for those product whose enrollment is not available
        const dialogConfiguration = { keyboard: false, backdrop: false, size: 'md', windowClass: 'my-class displaytext' };
        this.dialogService.notify({}, dialogConfiguration);
      }
    } else {
      const dialog = this.dialogService.custom(SubscriptionDialogComponent, { bankProducts: true }, { keyboard: false, backdrop: false, size: 'md' });
      dialog.result.then((response) => {
        if (response === 'close') {
          if (this.resellerService.hasFeature('SUBSCRIPTION')) {
            this.subscriptionService.goToSubscription(this.masterLocationDetails.customerNumber);

          }
        }
      });
    }
  }

  ngOnInit() {

    this.userDetails = this.userService.getUserDetails();
    if (this.userDetails && this.userDetails.locations[this.userDetails.masterLocationId]) { }
    this.masterLocationDetails = this.userDetails.locations[this.userDetails.masterLocationId];
    this.permission = {
      canGetBankStatus: this.userService.can('CAN_GET_BANK_STATUS'),
      canOpenBank: this.userService.can('CAN_OPEN_BANK')
    };
    if (this.permission.canGetBankStatus) {
      this.manualRefreshListBankProduct(50);
    }
    // get subscriptionType
    this.subscriptionType = this.userService.getLicenseValue('type', undefined);
  }

}

