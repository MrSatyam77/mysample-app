// Internal Imports
import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';

// External Imports
import { UserService, DialogService, MessageService } from '@app/shared/services/index';
import { ReturnSummaryFilterDialog } from '@app/dashboard/dialogs/return-summary-filter/return-summary-filter.component';
import { ReturnSummaryService } from '@app/dashboard/widgets/return-summary/return-summary.service';
import { count } from 'rxjs/operators';
import { DashboardService } from '@app/dashboard/dashboard.service';


@Component({
  selector: 'app-return-summary',
  templateUrl: './return-summary.component.html',
  styleUrls: ['./return-summary.component.scss']
})
export class ReturnSummaryComponent implements OnInit, OnDestroy {


  @Input() columnName: any;
  @Input() rowColor: any;
  @Input() backgroundColor: any;
  
  public colum: any; // to hold column object values from service
  public recentReturnsList: any = [];  // hold response of return list
  public returnListStatus: string;
  public userDetail: string;
  public filterParams: any;
  public permission: any = {}; // For Check permission of user on base on privilege
  private refreshTimer: Subscription; // To callApi after Some Time Of delay
  public recentReturns: any = {};
  public limit = 25;

  constructor(private returnSummaryService: ReturnSummaryService, private userService: UserService, private dialogservice: DialogService,
    private messageService: MessageService, private router: Router, private dashboardService: DashboardService) { }

  /**
   * @author Mansi Makwana
   * @description used to get return summary list data
   */
  callListAPI() {
    return new Promise((resolve, reject) => {
      this.returnSummaryService.getReturns(this.limit).then((response: any) => {
        if (this.limit && response.length > 0) {
          this.recentReturnsList = response.splice(0, this.limit);
        }
        resolve(this.recentReturnsList);
        // check list is empty or not. IF empty then set flags accordingly.
        this.checkFilteredList(this.filterParams);

        // Re register background refresh of list if not
        if (!this.refreshTimer) {
          this.refreshList();
        }
        this.recentReturns.refreshStart = false;
      }, (error) => {
        // Re register background refresh of list if not
        if (!this.refreshTimer) {
          this.refreshList();
        }
        this.recentReturns.refreshStart = false;
        reject(error);
      });
    });
  }

  /**
   * @author Mansi Makwana
   * @description
   * IF filters are applied then set flag to true.
   * IF filters not passed as argument then take it from the user service.
   */
  private checkFilteredList(filterParams) {
    if (this.recentReturnsList.length === 0) {
      if (!(filterParams && Object.keys(filterParams).length > 0)) {
        filterParams = this.userService.getValue('settings.widgets.recentReturns');
      }
    }
    // Set the return list status for recent return list display in dashboard
    // Case : recent return list length > 0 then normal message
    if (this.recentReturnsList.length > 0) {
      this.returnListStatus = 'normalMessage';
    } // Case : recent return list length equal 0 and filter applied then filter message
    else if (this.recentReturnsList.length === 0 && (filterParams) && (filterParams.returnType !== 'all' || filterParams.pkgType !== 'all')) {
      this.returnListStatus = 'filterMessage';
    } // Case : recent return list length equals 0 and filter not applied then sample return message
    else if (this.recentReturnsList.length === 0) {
      this.returnListStatus = 'sampleReturnMessage';
    }
  }

  /**
   * @author Mansi Makwana
   * @description 
   * Register $interval for background update of list, third argument is for infinite and last 
   * is to prevent to execute on every dirty checking.
   */
  private refreshList() {
    this.refreshTimer = interval(60000).subscribe(() => {
      this.returnSummaryService.getReturns(this.limit).then((response: any) => {
        if (this.limit && response.length > 0) {
          this.recentReturnsList = response.splice(0, this.limit);
        }
        // check list is empty or not. IF empty then set flags accordingly.
        this.checkFilteredList(this.filterParams);
      }, (error) => {
        if (error && error.code && error.code === 4004 || error.code === 4005) {
          this.cancelInterval();
        } else {
          this.cancelInterval();
        }
      });
    });
  }

  /**
   * @author Mansi Makwana
   * @description This method is used to Refresh list manuallly
   */
  manualRefreshList(delay: number) {
    // Check if user has privilege for return list
    if (this.permission.canGetListReturn) {
      // Cancel iterate of auto refresh if already registered
      if (this.refreshTimer) {
        this.cancelInterval();
        this.refreshTimer = undefined;
      }
      // Check if delay is passed
      if (delay && delay != null) {
        setTimeout(() => {
          this.callListAPI();
        }, delay);
      } else {
        // Call API function
        this.callListAPI();
      }


    } else {
      // IF User don't have rights then we need to return '0' for stop animation of refresh icon
      // @pending
      // $rootScope.$broadcast('notTransmittedReturnsCounter', 0);
    }
  }

  /**
   * @author Mansi Makwana
   * @description This method is used to open return
   */
  openReturn(taxReturn) {
    if (taxReturn.isCheckedOut === true) {
      let message = 'some one else';
      if (taxReturn.checkedOutBy) {
        message = taxReturn.checkedOutBy;
      } else if (taxReturn.email) {
        message = taxReturn.email;
      }
      this.messageService.showMessage('This return is opened for editing by ' + message, 'error');
    } else {
      // condition to check last save return in which mode on that basic user is redirected to input mode or interview mode
      if (!taxReturn.returnMode && taxReturn.returnMode !== null && taxReturn.returnMode === 'interview') {
        this.router.navigateByUrl('/return/interview/' + taxReturn.id);
      } else {
        this.router.navigateByUrl('/return/edit/' + taxReturn.id);
      }
    }

  }

  /**
   * @author Mansi Makwana
   * @description This method is used to Add Sample Returns in return list
   */
  public addSampleReturns() {
    // Notes: Used $injector as this function will not be called many times which help us to avoid circular dependency in future.
    // var returnAPIService = $injector.get('returnAPIService');
    this.returnSummaryService.addSampleReturns().then((response) => {
      this.manualRefreshList(0);
      this.messageService.showMessage('Sample returns added successfully', 'success');
    }, (error) => {
    });

  }
  /**
   * @author Mansi Makwana
   * @description This method is used to cancel Interval
   */
  private cancelInterval() {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
  }

  /**
   * @author Mansi Makwana
   * @description This method is used to open return summary filter dialog
   */

  openFilterDialog() {
    this.dialogservice.custom(ReturnSummaryFilterDialog, { data: this.userService.getValue('settings') }, {})
      .result.then((filterParams: any) => {
        if (filterParams !== false) {
          // starts rotation of icon
          this.recentReturns.refreshStart = true;
          // filter list according selected filters.
          this.returnSummaryService.updatefilters(filterParams).then((response: any) => {
            this.recentReturnsList = response;
            // reload list and refresh ui
            // if (this.limit && response.length > 0) {
            //   this.recentReturnsList = response.splice(0, this.limit);
            // }
            // check list is empty or not. IF empty then set flags accordingly.
            this.checkFilteredList(filterParams);
            // update user settings.

            // change user settings starts
            let settings = this.userService.getValue('settings');
            if (!settings) {
              settings = {};
            }
            if (!settings.widgets) {
              settings.widgets = {};
            }
            if (!settings.widgets.recentReturns) {
              settings.widgets.recentReturns = {};
            }
            settings.widgets.recentReturns = { returnType: filterParams.returnType, pkgType: filterParams.pkgType };
            this.userService.changeSettings('widgets', settings.widgets, undefined);
            // change user settings end
            // stops rotation of icon
            this.recentReturns.refreshStart = false;
          }, (error) => {
            this.recentReturns.refreshStart = false;
            // console.log(error);
          });
        }
      }, (btn) => {
        // on cancel of filter dialog
      });
  }

  /**
   * @author Mansi Makwana
   * @description This method is used to navigate to given path
   */
  public goTo(path) {
    this.router.navigateByUrl(path);
  }

  ngOnInit() {
    // to get columns values from return summary service
    this.colum = this.returnSummaryService.ColumnSize;
    let counterArray = this.dashboardService.widgetRatioSize['returnSummary'].map(t => t.count);
    this.limit = Math.max(...counterArray);
    this.permission = {
      canGetListReturn: this.userService.can('CAN_LIST_RETURN'),
      canGetCreateList: this.userService.can('CAN_CREATE_RETURN'),
      canGetOpenReturn: this.userService.can('CAN_OPEN_RETURN')
    };
    this.manualRefreshList(0);
  }

  /**
   * @author Mansi Makwana
   * @description This method is invoked immediately after a directive, pipe, or service instance is destroyed.
   */
  ngOnDestroy() {
    this.cancelInterval();
  }
}
