/** External import */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from "@angular/router";
/** Internal Import */
import { ConversionDetailService } from './conversion-detail.service';
import { UserService } from "../../shared/services/user.service";
import { environment } from '@environments/environment';
import { CommunicationService } from '@app/shared/services';

@Component({
  selector: 'conversion-detail',
  templateUrl: './conversion-detail.component.html',
  styleUrls: ['./conversion-detail.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversionDetailComponent implements OnInit {
  /** Public variable */
  nextAndPrevViewMap: any;
  currentIndex: number = 0;
  brbreadcrumb: any;
  softwareNames: any;
  softwareListString: string;
  taxYear: string;
  selectedSoftwareName: any;
  IsShowBackButton: boolean;
  public lineHelp = {
    title: 'Conversion New',
    body: `<b>Converting is simple with our Conversion Wizard</b>
    <p>Our Conversion Wizard tool allows you to convert your existing returns, client information, schedules and forms into MyTAXPrepOffice quickly and easily. </p>
    <b>Need help with your conversion?</b>
    <p>If you have any questions or need help with your conversion, please contact our Customer Support Team via Live Chat or email at support@mytaxprepoffice.com.</p>
    <p>Disclaimer</p>
    <p>1. Due to differences between various tax programs, not all data from the original returns will be converted. We convert the return types listed with the software companies as shown. Other return types are not converted.</p>
    <p>2. The conversion process does not recreate the original 2018 return. </p>
    <p>3. After the returns are converted, you will need to verify all returns to ensure accurate calculations. </p>
    <p>4. Various tax programs utilize many different combinations of depreciation methods. Some methods of depreciation listed in the prior software may not be able to be converted. We recommend that you verify the asset depreciation closely for accuracy.</p>
    `,
    tooltip: 'Client organizers will assist you in gathering the necessary information from your tax clients to prepare their tax returns. According to the types of returns listed, you can choose a custom client organizer to appear each time you work on returns. You can also choose the Predefined 1040 Client Organizer to appear for 1040 returns. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
  };
  enableConversion: any;

  /** constructor */
  constructor(
    private conversionDetailService: ConversionDetailService,
    private userService: UserService,
    private router: Router,
    private communicationService: CommunicationService
  ) { }
  /**
   * @author Mansi Makwana
   * To Redirect Home Screen
   * @memberOf ConversionListComponent
   */
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }
  next() {
    this.currentIndex++;
    if (this.currentIndex < this.nextAndPrevViewMap.length) {
      this.brbreadcrumb.push(this.nextAndPrevViewMap[this.currentIndex]);
    }
    else {
      this.currentIndex = this.nextAndPrevViewMap.length - 1;
    }
  }
  previous() {
    this.brbreadcrumb.splice(this.currentIndex, 1);
    this.currentIndex--;
  }

  getSelectedSoftware(event) {
    this.selectedSoftwareName = event;
    this.conversionDetailService.selectedSoftware = event;
    this.communicationService.transmitData({
      topic: 'ConversionSoftwareName',
      channel: '',
      data: this.selectedSoftwareName
    });
  }

  navigateToTab(index) {
    this.brbreadcrumb.splice(index + 1, this.brbreadcrumb.length - 1);
    this.currentIndex = index;
    // if (this.nextAndPrevViewMap[this.currentIndex].view == "software") {
    //   this.selectedSoftwareName = null;
    // }
  }

  /** Back to software selection */
  backToSoftwareSelection() {
    this.selectedSoftwareName = null;
  }

  /** Back to listing */
  backToList() {
    this.router.navigateByUrl("/conversionnew/");
  }

  /** show back button when user upload file */
  showBackToList() {
    this.IsShowBackButton = true;
  }

  /**
 * Line Help Communication Service
 * @author Ravi Shah
 * @param {string} title
 * @returns {void}
 * @memberof ReturnWorkspacePreferencesComponent
 */
  public informationLineHelp(): void {
    return this.communicationService.transmitData({
      topic: 'conversion new',
      channel: 'MTPO-LINE-HELP',
      data: this.lineHelp || {}
    });
  }

  /** Init */
  ngOnInit() {
    // this.userService.getTaxYear()
    this.taxYear = this.userService.getTaxYear();
    this.enableConversion = true;// this.userService.getLicenseValue('enableConversion', this.taxYear);
    if (parseInt(this.taxYear) < environment.ConversionSupportedTaxYear) {
      this.router.navigate(["conversion", "list"]);
      //location.href = `${ location.host } /conversion/list`;
      return;
    } else {
      this.nextAndPrevViewMap = this.conversionDetailService.getWizardView();
      this.brbreadcrumb = [];
      this.brbreadcrumb.push(this.nextAndPrevViewMap[this.currentIndex]);
      this.softwareNames = this.conversionDetailService.getSoftwareNames(this.taxYear);
      if (this.softwareNames && this.softwareNames.length > 0) {
        this.softwareListString = this.softwareNames.map(x => x.displayText).join(',');
      }
      this.selectedSoftwareName = this.conversionDetailService.selectedSoftware;
    }
    this.informationLineHelp();
  }
}
