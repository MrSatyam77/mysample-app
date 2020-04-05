import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from "moment";

import { BankRejectionService, MessageService, DialogService, CommunicationService, UserService } from '@app/shared/services';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { GridOptions } from 'ag-grid-community';
import { ExportDialogComponent } from '@app/efile-center/dialogs/export-dialog/export-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bank-efile-center',
  templateUrl: './bank-efile-center.component.html',
  styleUrls: ['./bank-efile-center.component.scss']
})
export class BankEfileCenterComponent implements OnInit {

  @ViewChild('efileBankAgGridComponent', { static: false }) efileBankAgGridComponent: StandardAgGridComponent;

  private gridApi: any;
  public gridOptions: GridOptions;
  public rowData: any;
  public defaultFilter: any = { searchText: '', status: 'All' };
  public filter: any = { searchText: '', status: 'All' };
  public bankRejectionType: any;
  public communicationServiceWatcher: Subscription;
  private filterMaping: any;

  constructor(private userService: UserService, private router: Router, private bankRejectionListService: BankRejectionService, private messageService: MessageService, private dialogService: DialogService, private communicationService: CommunicationService) { }

  /**
   * @author Ravi Shah
   * On Grid is Ready Call Api For the Data
   * @param {*} params
   * @memberof BankEfileCenterComponent
   */
  onGridReady(params: any) {
    this.gridApi = params.api;
    // Set Filter on Click of Sidebar and Dashboard
    this.filter.status = this.bankRejectionListService.filterStatusPassed;
    this.externalFilter();
    this.getList();
  }
  /**
   * @author Ravi Shah
   * to get list
   * @memberof BankEfileCenterComponent
   */
  public getList(manualRefresh?: boolean) {
    return new Promise((resolve, reject) => {
      this.bankRejectionListService.getList().then((result: any) => {
        this.rowData = result.data;
        if (!manualRefresh) {
          if (result.gridPref && Object.keys(result.gridPref).length > 0) {
            this.loadGridState(result.gridPref || {});
          } else {
            this.filter.status = this.bankRejectionListService.filterStatusPassed;
            this.externalFilter()
          }
        }
        resolve(result);
      }, (error) => {
        console.error(error);
        reject(error);
      });
    });
  }

  /**
 * @author Ravi Shah
 * Set Grid State and Filter
 * @private
 * @param {*} gridPref
 * @memberof BankEfileCenterComponent
 */
  private loadGridState(gridPref: any) {
    if (this.bankRejectionListService.filterStatusPassed !== 'All') {
      this.filter.status = this.bankRejectionListService.filterStatusPassed;
      this.filter.searchText = this.defaultFilter.searchText || '';
    } else {
      this.filter = gridPref.userFilter || JSON.parse(JSON.stringify(this.defaultFilter));
    }
    this.efileBankAgGridComponent.setGridState(gridPref || {});
    this.quickSearch(this.filter.searchText)
    this.externalFilter();
  }

  /**
   * @author Ravi Shah
   * Call The Standard Grid Function for the Quick Search in Ag grid
   * @param {string} searchText
   * @memberof BankEfileCenterComponent
   */
  quickSearch(searchText: string) {
    this.efileBankAgGridComponent.quickFilter(searchText);
  }

  /**
   * @author Ravi Shah
   * Call the Standard Grid Function for the External Filters
   * @memberof BankEfileCenterComponent
   */
  externalFilter() {
    this.efileBankAgGridComponent.externalFilter();
  }

  /**
   * @author Ravi Shah
   * External Filter Handler
   * @private
   * @param {*} node
   * @returns
   * @memberof BankEfileCenterComponent
   */
  private externalFilterStatus(node: any) {
    if (this.filter.status !== 'All') {
      let obj = this.filterMaping.find(t => t.id === this.filter.status);
      return node.data.eFileStatus !== undefined && node.data.eFileStatus !== null && obj.status.includes(node.data.eFileStatus);
    }
    return true;
  }

  /**
   * @author Ravi Shah
   * Open the Open Bank Rejections
   * @private
   * @param {*} taxBankRejectionReturn
   * @memberof BankEfileCenterComponent
   */
  private openBankRejectionReturn(taxBankRejectionReturn) {
    if (taxBankRejectionReturn.isCheckedOut == true) {
      var message = "some one else";
      if (taxBankRejectionReturn.checkedOutBy) {
        message = taxBankRejectionReturn.checkedOutBy;
      } else if (taxBankRejectionReturn.email) {
        message = taxBankRejectionReturn.email;
      }
      this.messageService.showMessage('This return is opened for editing by ' + message, 'error');
    } else {
      if (taxBankRejectionReturn.eFileStatus == 14) {
        //condition to check previously return was saved from which mode
        if (!taxBankRejectionReturn.returnMode || taxBankRejectionReturn.returnMode == 'input') {
          this.router.navigate(['return', 'edit', taxBankRejectionReturn.id, 'bankRejected'])
        } else if (taxBankRejectionReturn.returnMode == 'interview') {
          this.router.navigate(['return', 'edit', taxBankRejectionReturn.id, 'bankRejected'])
        }
      } else {
        //condition to check previously return was saved from which mode
        if (!taxBankRejectionReturn.returnMode || taxBankRejectionReturn.returnMode == 'input') {
          this.router.navigate(['return', 'edit', taxBankRejectionReturn.id]);
        } else if (taxBankRejectionReturn.returnMode == 'interview') {
          this.router.navigate(['return', 'edit', taxBankRejectionReturn.id]);
        }
      }
    }
  };

  /**
   * @author Ravi Shah
   * Call on the action event handler
   * @param {*} { actionType, dataItem }
   * @memberof BankEfileCenterComponent
   */
  public onActionClicked({ actionType, dataItem }) {
    switch (actionType) {
      case 'openBankRejectionReturn':
        this.openBankRejectionReturn(dataItem);
        break;
      default:
        break;
    }
  }

  /**
   * @author Ravi Shah
   * Export to CSV and PDF
   * @param {*} formatType
   * @memberof BankEfileCenterComponent
   */
  public exportList(formatType: any) {

    let columnConfig = [
      { key: "ssnOrEinFull", text: "SSN/EIN", selected: true },
      { key: "taxpayerFirstName", text: "FIRST NAME", selected: true },
      { key: "taxpayerLastName", text: "LAST NAME", selected: true },
      { key: "type", text: "TYPE", selected: true },
      { key: "year", text: "YEAR", selected: true },
      { key: "bankStatus", text: "BANK STATUS", selected: true }
    ];
    this.dialogService.custom(ExportDialogComponent, { columnConfiguration: columnConfig }, { 'keyboard': false, 'backdrop': false, 'size': 'md' }).result.then(res => {
      if (res) {
        let params = {
          columnKeys: res,
          fileName: 'bankSummaryList',
          sheetName: 'Sheet 1',
          allColumns: true
        };
        this.efileBankAgGridComponent.exportGrid(formatType, params);
      }
    })
  }

  saveGridSettings() {
    this.efileBankAgGridComponent.saveGridState().then(() => {
      this.messageService.showMessage('Grid Settings for Bank Application List saved successfully.', 'success');
    });
  }

  resetGridSettings() {
    this.efileBankAgGridComponent.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchText);
      this.externalFilter();
      this.messageService.showMessage('Grid Settings for Bank Application List reset successfully.', 'success');
    });
  }

  /**
   * @author Ravi Shah
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberof BankEfileCenterComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "SSN/EIN",
          field: "ssnOrEinFull",
          width: 200,
          hide: true
        },
        {
          headerName: "FIRST NAME",
          field: "taxpayerFirstName",
          width: 200,
          hide: true
        },
        {
          headerName: "LAST NAME",
          field: "taxpayerLastName",
          width: 200,
          hide: true
        },
        {
          headerName: "SSN/EIN",
          field: "ssnOrEin",
          width: 110,
          sort: "asc",
          cellRenderer: (params: any) => {
            let conditionalClass = this.userService.can('CAN_GET_EFILE_LIST') ? '' : 'no-clicking';
            return `<i class='fa ${this.bankRejectionListService.setReturnClass(params.data)}'></i> 
              <a class="text-primary ${conditionalClass}" data-action-type="openBankRejectionReturn">${params.data.ssnOrEin}</a>`
          },
          suppressMovable: true
        },
        {
          headerName: "TAXPAYER NAME",
          field: "taxPayerName",
          width: 225
        },
        {
          headerName: "TYPE",
          field: "type",
          width: 100
        },
        {
          headerName: "YEAR",
          field: "year",
          width: 90
        },
        {
          headerName: "BANK NAME",
          field: "eFileStateName",
          width: 120,
          sortable: false,
          cellRenderer: (params: any) => {
            return params.value ? params.value.toUpperCase() : '';
          }
        },
        {
          headerName: "BANK STATUS",
          field: "bankStatus",
          width: 140,
          sortable: false
        },
        {
          headerName: "PREACK STATUS",
          field: "preAckStatus",
          width: 160,
          sortable: false
        },
        {
          headerName: "ACCEPTANCE DATE",
          field: "acknowledgementDateFormatted",
          tooltipField: '',
          width: 180
        },
        {
          width: 80,
          type: 'rowActionRenderer',
          cellClass: 'ag-grid-action-wrapper',
          template:
            `<div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle no-clicking" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-cog padding_right_5"></i>
            </button>
          </div>`,
          suppressMovable: true
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    }
  }


  /**
   * @author Ravi Shah
   * Call on Initialization
   * @memberof BankEfileCenterComponent
   */
  ngOnInit() {
    const self = this
    self.communicationServiceWatcher = this.bankRejectionListService.receivedFilter.subscribe((response: any) => {
      self.filter.status = response.id;
      self.externalFilter();
    })
    self.gridOptions = this._gridOptions;
    self.bankRejectionType = this.bankRejectionListService.bankRejectionType;
    this.filterMaping = this.bankRejectionListService.filterMaping;
  }

  /**
   * @author Ravi Shah
   * Destroy the watcher on Destroy of component
   * @memberof BankEfileCenterComponent
   */
  ngOnDestroy() {
    if (this.communicationServiceWatcher) {
      this.communicationServiceWatcher.unsubscribe();
    }
  }
}