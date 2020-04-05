// External Imports
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// Internal Imports
import { UserService, ResellerService, UtilityService } from '@app/shared/services';
import { SalesDialogService } from '@app/shared/services/sales-dialog.service';


@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent implements OnInit {

  @Input() rowColor: any;
  public permission: any = {}; // For Check permission of user on base on privilege
  public taxYear: any; // get taxYear
  public taxYearInNumber: any; // get taxYear in number
  public enableConversion: any; // get enable conversion flag from license object
  public hasFeaturePermission: any; // user has this feature or not
  public hasLicensePermission: any; // check License
  constructor(private router: Router, private userService: UserService,
    private resellerService: ResellerService, private salesDialogService: SalesDialogService) { }
  /**
   * @author Om kanada
   * @description
   * Permission Based on privillege
   */
  private permissionBasedOnUserCan(): void {
    this.permission = {
      canListConversion: this.userService.can('CAN_LIST_CONVERSION'),
      canListPreforma: this.userService.can('CAN_LIST_PROFORMA'),
      canListPricelist: this.userService.can('CAN_LIST_PRICELIST'),
      canListClientLetter: this.userService.can('CAN_LIST_CLIENTLETTER'),
      canListClientToOraganizer: this.userService.can('CAN_LIST_CLIENTORGANIZER'),
      canListEin: this.userService.can('CAN_LIST_EIN'),
      canViewReport: this.userService.can('CAN_VIEW_REPORT'),
      canBackupReturn: this.userService.can('CAN_BACKUP_RETURN'),
      canRestoreReturn: this.userService.can('CAN_RESTORE_RETURN'),
      canListTemplate: this.userService.can('CAN_LIST_TEMPLATE'),
      canListDevice: this.userService.can('CAN_LIST_DEVICE'),
      canOpenPrintSet: this.userService.can('CAN_OPEN_PRINTSET'),
    };
  }

  /**
   * @author Om kanada
   * @description
   * routing through ToolBoxName
   */
  routingBasedOnToolBoxName(toolName: string): void {
    if (toolName === 'Proforma') {
      this.router.navigate(['proforma', 'list']);
    } else if (toolName === 'PriceList') {
      this.router.navigate(['manage', 'templates', 'priceList']);
    } else if (toolName === 'ClientLetter') {
      this.router.navigate(['manage', 'templates', 'clientLetter']);
    } else if (toolName === 'ClientOrganizer') {
      this.router.navigate(['manage', 'clientOrganizer', 'list']);
    } else if (toolName === 'EINLibraries') {
      this.router.navigate(['manage', 'templates', 'einLibraries']);
    } else if (toolName === 'Reports') {
      this.router.navigate(['report', 'view']);
    } else if (toolName === 'BackupReturns') {
      this.router.navigate(['return', 'restore-backup']);
    } else if (toolName === 'RestoreReturns') {
      this.router.navigate(['return', 'restore-backup', 'restore']);
    } else if (toolName === 'CustomReturnTemplate') {
      this.router.navigate(['manage', 'templates', 'customerReturnTemplates']);
    } else if (toolName === 'PrintPackets') {
      this.router.navigate(['manage', 'templates', 'printPackets']);
    } else if (toolName === 'SignatureDevices') {
      this.router.navigate(['signature', 'list']);
    } else if (toolName === "instantFormView") {
      this.router.navigateByUrl("/instantFormView/trustedDeviceList");
    }
  }
  /**
   * @author Om kanada
   * @description
   * check whether user has feature
   */
  public hasFeature(featureName: string): void {
    this.hasFeaturePermission = this.resellerService.hasFeature(featureName);
  }
  /**
   * @author Om kanada
   * @description * check for License
   */
  public hasLicense(licenseName: string): void {
    this.hasLicensePermission = this.userService.getLicenseValue(licenseName, undefined);
  }

  /**
   * @author Om kanada
   * @description * if condition to allow conversion in demo a/c.
   */
  public goToConversion(): void {
    // Remove if condition to allow conversion in demo a/c.

    // If demo user try to open conversion. He/She will be prompted with dialog to either register
    // or continue with demo (which redirect user to home page)
    // ELSE redirect to list page.
    if (this.userService.getValue('isDemoUser') === true) {
      this.salesDialogService.openSalesDialog('conversion');
    } else {
      if (parseInt(this.taxYear) < 2018) {
        this.router.navigate(['conversion', 'list']);
      }
      else {
        this.router.navigateByUrl('/conversionnew');
      }
    }
  }


  ngOnInit() {
    this.permissionBasedOnUserCan();
    this.hasFeature('SIGNATURE');
    this.hasLicense('enableSignaturePad');

    // get taxyear in ineteger
    this.taxYearInNumber = parseInt(this.userService.getTaxYear(), 0);

    // get enable conversion flag from license object
    this.enableConversion = this.userService.getLicenseValue('enableConversion', this.taxYear);

  }
}
