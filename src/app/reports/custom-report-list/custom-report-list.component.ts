//External Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';

//Internal Imports
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { UserService, MessageService } from '@app/shared/services';
import { ReportsService } from '@app/reports/reports.service';

@Component({
  selector: 'app-custom-report-list',
  templateUrl: './custom-report-list.component.html',
  styleUrls: ['./custom-report-list.component.scss']
})
export class CustomReportListComponent implements OnInit {

  @ViewChild('customReportListComponent', { static: false }) customReportListComponent: StandardAgGridComponent;
  public gridApi; //to access the grids API
  public gridOptions: GridOptions;
  public rowData: any  //hold row data
  public filter: any = { searchField: '' }; //filter grid data
  public defaultFilter: any = { searchField: '' };
  public refreshStart:boolean = false;
  //hold default definition grid columns
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: 'Name',
          field: 'reportName',
          width: 400,
        },
        {
          headerName: 'Description',
          field: 'reportDescription',
          width: 500,
        },
        {
          headerName: 'ACTIONS',
          width: 200,
          cellClass: 'ag-grid-action-wrapper',
          cellRenderer: (params: any) => {
            let conditionalClass = this._userService.can('IS_ADMINISTRATOR') ? '' : 'no-clicking';
            return `<div class="dropdown">
          <button type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown">
              <i class="fas fa-cog" ></i>
          </button>
          <div class="dropdown-menu">
              <a class="dropdown-item" data-action-type="viewReport">View Report</a>
              <a class="dropdown-item ${conditionalClass}" data-action-type="editReport">Edit Report</a>
          </div>
      </div>`}
        }
      ]
    }
  }

  constructor(private _userService: UserService,
    private _router: Router,
    private _messageService: MessageService,
    private _reportsService: ReportsService) { }

  /**
  * @author Heena Bhesaniya 
  * @description this method redirect to home page 
  */

  backToHomeScreen() {
    this._router.navigateByUrl('/home');
  }

  /**
   * @author Heena Bhesaniya
   * @description this method refresh the grid data
   */
  manuallyRefresh() {
    this.refreshStart = true;
    this._initAvailableReportList().then((response: any) => {
      this.refreshStart = false;
    }, error => {
      this.refreshStart = false;
    });

  }

  /**
  * @author Heena Bhesaniya
  * @param actionType
  * @description this method perform action on click
  */
  public onActionClicked({ actionType, dataItem }) {
    switch (actionType) {
      case 'viewReport':
        this._router.navigate(['reports/view' , dataItem.reportId])
        break;
      case 'editReport':
        this._router.navigate(['reports/custom/edit', dataItem.reportId])
        break;
      default:
        break;
    }
  }

  /**
  * @author Heena Bhesaniya
  * @param params
  * @description this method bind the data in grid
  */
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    this._initAvailableReportList();

  }

  /**
   * @author Heena Bhesaniya
   * @description get available report list
   */
  public _initAvailableReportList() {
    //get device list from api
    return new Promise((resolve, reject) => {
      this._reportsService.getAvailableReportList().then((result: any) => {
        this.rowData = result.customReports;
        if (result.gridPref && Object.keys(result.gridPref).length > 0) {
          this.loadGridState(result.gridPref);
        }
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  private loadGridState(gridPref: any) {
    this.filter = gridPref.userFilter || JSON.parse(JSON.stringify(this.defaultFilter));
    this.customReportListComponent.setGridState(gridPref);
    this.quickSearch(this.filter.searchField);
  }

  /**
   * @description 
   * 
   */
  createNewReport() {
    this._router.navigate(['reports/custom/edit', 'new'])
  }

  /**
  * @author Heena Bhesaniya
  * @param privilege 
  * @description this method check user privilege
  */
  userCan(privilege) {
    return this._userService.can(privilege);
  };

  /**
 * @author Heena Bhesaniya
 * @description this method save grid settings
 */
  saveGridSettings() {
    this.customReportListComponent.saveGridState().then(() => {
      this._messageService.showMessage('Grid Settings for report list saved successfully.', 'success');
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description this method reset grid settings
   */
  resetGridSettings() {
    this.customReportListComponent.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchField);
      this._messageService.showMessage('Grid Settings for report list saved successfully.', 'success');
    });
  }

  /**
    * @author Heena Bhesaniya
    * @param searchField 
    * @description this method filter grid data
    */
  quickSearch(searchField: string) {
    this.customReportListComponent.quickFilter(searchField);
  }


  ngOnInit() {
    this.gridOptions = this._gridOptions;
  }

}
