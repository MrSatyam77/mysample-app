// External Imports
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
// Internal Imports
import { UserService, MessageService, eFileSumaryListService } from '@app/shared/services';
import { RejectedReturnService } from '@app/dashboard/widgets/rejected-return/rejected-return.service';
@Component({
  selector: 'app-rejected-return',
  templateUrl: './rejected-return.component.html',
  styleUrls: ['./rejected-return.component.scss'],
  providers: [RejectedReturnService]
})
export class RejectedReturnComponent implements OnInit, OnDestroy {

  @Input() column: any;
  @Input() rowColor: any;
  public columnData: any; // To get columnData
  private refreshTimer: Subscription; // To callApi after Some Time Of delay
  public recentRejectedReturnsList: any = []; // display response of  callListAPI
  public refreshStart: boolean; // To Start refresh page
  public permission: any = {}; // For Check permission of user on base on privilege
  public setClass: string; // To setClass
  public dataShow = false; // Handle show data

  constructor(private eFileSumaryListService: eFileSumaryListService, private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private rejectedReturnService: RejectedReturnService) { }


  /**
   * @author Om kanada
   * @description
   *  Register $interval for background update of list, third argument is for infinite and last is to prevent to execute on every dirty checking.
   */
  private refreshList() {
    this.refreshTimer = interval(60300).subscribe(() => {
      if (this.router.url.includes('/home')) {
        this.rejectedReturnService.getRejectedReturnList(this.column.count).then((response) => {
          this.recentRejectedReturnsList = response;
        }, (error) => {
          if (error && error.code && (error.code === 4004 || error.code === 4005)) {
            this.cancelInterval();
          }
        });
      } else {
        this.cancelInterval();
      }
    });
  }


  /**
   * @author Om kanada
   * @description
   * This method is responsible for calling List api and register/unregister interval for auto refresh.
   */
  public manualRefreshListRejectedReturn(delay: number): void {
    this.refreshStart = true;
    if (this.userService.can('CAN_GET_EFILE_LIST')) {
      if (this.refreshTimer) {
        this.cancelInterval();
        this.refreshTimer = undefined;
      }
      if (delay) {
        setTimeout(() => {
          this.callListAPI();
        }, delay);
      } else {
        this.callListAPI();
      }
    }
  }

  /**
   * @author Om kanada
   * @description
   * API call.
   */
  public callListAPI() {
    return new Promise((resolve, reject) => {
      this.rejectedReturnService.getRejectedReturnList(this.column.count).then((response: Array<any>) => {

        this.recentRejectedReturnsList = response;
        this.dataShow = true;

        resolve(response);
        if (!this.refreshTimer) {
          this.refreshList();
        }
        this.refreshStart = false;
      }, (error) => {
        if (!this.refreshTimer) {
          this.refreshList();
        }
        this.refreshStart = false;
      });

    });
  }

  /**
   * @author Om kanada
   * @description
   *
   */
  public goToRejectedList(filter): void {
    this.eFileSumaryListService.filterStatusPassed = filter;
    this.router.navigate(['eFile', 'list']);
  }

  /**
   * @author Om kanada
   * @description
   * Open Return
   */
  public openRejectedReturn(taxRejectedReturn: any): void {
    if (taxRejectedReturn.isCheckedOut === true) {
      let message = 'some one else';
      if (taxRejectedReturn.checkedOutBy) {
        message = taxRejectedReturn.checkedOutBy;
      } else if (taxRejectedReturn.email) {
        message = taxRejectedReturn.email;
      }
      this.messageService.showMessage('This return is opened for editing by ' + message, 'error');
    } else {
      // condition to check previously return was saved in which mode
      if (taxRejectedReturn.type && taxRejectedReturn.type === 'bank') {
        if ((!taxRejectedReturn.returnMode) || taxRejectedReturn.returnMode === 'input') {
          this.router.navigateByUrl('/return/edit/' + taxRejectedReturn.id + '/bankRejected');
        } else if (taxRejectedReturn.returnMode === 'interview') {
          this.router.navigateByUrl('/return/interview/' + taxRejectedReturn.id + '/bankRejected');
        }
      } else {
        if ((!taxRejectedReturn.returnMode) || taxRejectedReturn.returnMode === 'input') {
          this.router.navigateByUrl('/return/edit/' + taxRejectedReturn.id + '/rejected');
        } else if (taxRejectedReturn.returnMode === 'interview') {
          this.router.navigateByUrl('/return/interview/' + taxRejectedReturn.id + '/rejected');
        }
      }
    }
  }

  /**
   * @author Om kanada
   * @description
   * cancel interval.
   */
  private cancelInterval() {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
  }


  ngOnDestroy() {
    this.cancelInterval();
  }


  ngOnInit() {
    this.columnData = this.rejectedReturnService.ColumnSize;
    this.permission = {
      canGetEfileList: this.userService.can('CAN_GET_EFILE_LIST')
    };
    this.manualRefreshListRejectedReturn(40);
  }

}
