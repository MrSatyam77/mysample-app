/** External import */
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import "ag-grid-enterprise";
/** Internal Import */
import { ConversionListService } from './conversion-list.service';
import { ConversionUploaderservice } from "../conversion-uploader.service";
import { ConversionDetailService } from "../conversion-details/conversion-detail.service";
import { UserService, CommunicationService } from '@app/shared/services';
import { environment } from '@environments/environment';


@Component({
  selector: 'conversion-list',
  templateUrl: './conversion-list.component.html',
  styleUrls: ['./conversion-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConversionListService]
})
export class ConversionListComponent implements OnInit, OnDestroy {
  /** Public property */
  conversionList: any;
  columnDefs: any; // col defination for master job grid
  gridApi;//to access the grids API
  detailcolumnDef; // col defination for detail job grid
  getRowNodeId;// set jobId as id for master grid row
  public domLayout;
  isLoading: boolean;
  hasUploadCompleted: boolean = true;
  public searchText: string = "";
  public paginationPageSize = 15;
  hasUploadCompletedSubscription: Subscription
  firstRefreshStart: boolean;
  taxYear: string;
  enableConversion: any;
  lineHelp = {
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
    tooltip: ''
  };
  /** Constructor */
  constructor(
    private conversionListService: ConversionListService,
    private conversionUploaderservice: ConversionUploaderservice,
    private router: Router,
    private conversionDetailService: ConversionDetailService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private communicationService: CommunicationService
  ) {
    this.getRowNodeId = function (data) {
      return data.jobId;
    };
    this.domLayout = "autoHeight";
  }


  // /** Browse close event */
  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler($event) {
  //   if (this.conversionUploaderservice.hasUploadStart) {
  //     let files = this.conversionUploaderservice.resumableUpload.files.map(x => x.fileName);
  //     this.conversionListService.uploadCancel(files)
  //       .then(
  //         (response) => {

  //         });
  //     $event.preventDefault();
  //   }
  //   else {
  //     return false;
  //   }
  // }

  // /** Browse close event */
  // @HostListener('window:unload', ['$event'])
  // closeHandler($event) {
  //   return false;
  // }

  /**
   * @author Mansi Makwana
   * To Redirect Home Screen
   * @memberOf ConversionListComponent
   */
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }
  /**
   * @author Hitesh Soni
   * @date 08-08-2019
   * @readonly 
   * @returntype {void}
   * @memberof ConversionListComponent
   * @description Load data when grid is ready
   */
  onGridReady(params) {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api; // To access the grids API
    this.getConversionList();
  }

  /**
   * @author Dhruvi Shah
   * @date 02-09-2019
   * @description to resize column width 
   * @param {*} params
   * @memberof ConversionListComponent
   */
  onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  /**
  * @author Hitesh Soni
  * @date 08-08-2019
  * @readonly 
  * @returntype {void}
  * @memberof ConversionListComponent
  * @description Filter data
  */
  onFilterTextBoxChanged(event) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  addNew() {
    this.router.navigate(["/conversionnew/new"])
  }

  /** Refresh manually */
  manuallyRefreshTraining() {
    this.firstRefreshStart = true;
    this.getConversionList();
  }

  /**
   * @author Hitesh Soni
   * @date 08-08-2019
   * @readonly 
   * @returntype {void}
   * @memberof ConversionListComponent
   * @description Get efile summary data to API
   */
  private getConversionList() {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      this.conversionListService.getConversionList().then((response: any) => {
        //response = null;
        if (response && response.length > 0) {
          this.gridApi.setRowData(response);
          this.gridApi.sizeColumnsToFit();
          /**
           * @author Hitesh Soni
           * get last selected software for conversion file upload
           */
          this.conversionDetailService.selectedSoftware = this.conversionListService.getLastedConversionsSoftware(response, 'createdDate');
          if (this.conversionDetailService.selectedSoftware.name.toLowerCase() == "drake") {
            this.conversionDetailService.selectedSoftware.isDirectory = true;
          }
          this.isLoading = false;
          this.cdr.markForCheck();

          /**
           * @author Dhruvi shah
           * listen file uploading event and update progressStatus of file to show uploading progress
           */
          let self = this;
          this.conversionUploaderservice.fileProgressEvent.subscribe(
            (progress) => {
              let jobId = self.conversionUploaderservice.jobData.jobId;
              var rowNode = self.gridApi.getRowNode(jobId);
              if (rowNode) {
                if (progress >= 0 && progress < 100) {
                  rowNode.setDataValue("uploadStatus", progress);
                } else if (progress == 100) {
                  rowNode.setDataValue("uploadStatus", 'Success');
                }
              }
            }
          );
          this.firstRefreshStart = false;
          resolve();
        }
        else {
          this.isLoading = false;
          this.conversionDetailService.selectedSoftware = this.conversionListService.getPreviousSoftware();
          this.router.navigateByUrl("/conversionnew/new");
        }
      }, (error) => {
        this.isLoading = false;
        reject(error);
      });
    });
  }

  clearSearch() {
    this.searchText = '';
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


  ngOnInit() {
    this.taxYear = this.userService.getTaxYear();
    this.taxYear = this.userService.getTaxYear();
    this.enableConversion = this.userService.getLicenseValue('enableConversion', this.taxYear);
    if (parseInt(this.taxYear) < environment.ConversionSupportedTaxYear) {
      this.router.navigate(["conversion", "list"]);
    }
    else {
      this.columnDefs = this.conversionListService.getColumnDefinations();
      this.detailcolumnDef = this.conversionListService.getColumnDetailCellDefinationsWithOutSSN();
      /** subscribe for upload completed */
      this.hasUploadCompletedSubscription = this.conversionUploaderservice.hasUploadComplete.subscribe(
        (result) => {
          this.hasUploadCompleted = result;
        }
      );
      this.informationLineHelp();
    }
  }

  ngOnDestroy() {
    if (this.hasUploadCompletedSubscription) {
      this.hasUploadCompletedSubscription.unsubscribe();
    }
  }
}
