import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, SystemConfigService, MessageService } from '@app/shared/services';
import { GridOptions } from 'ag-grid-community';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { environment } from '@environments/environment';
import { ReturnAPIService } from '@app/return/return-api.service';

@Component({
  selector: 'app-backup-return',
  templateUrl: './backup-return.component.html',
  styleUrls: ['./backup-return.component.scss']
})
export class BackupReturnComponent implements OnInit {

  private gridApi: any;
  public gridOptions: GridOptions;
  public rowData: any;
  public filter: any = { searchText: '', status: 'All' };
  public defaultFilter: any = { searchText: '', status: 'All' };
  public returnTypes: any = [];

  @ViewChild('returnBackupList', { static: false }) returnBackupList: StandardAgGridComponent;

  constructor(private userService: UserService, private systemConfigService: SystemConfigService, private returnAPIService: ReturnAPIService, private messageService: MessageService) { }



  /**
   * @author Ravi Shah
   * On Grid is Ready Call Api For the Data
   * @param {*} params
   * @memberof BackupReturnComponent
   */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getList();
  }
  /**
   * @author Ravi Shah
   * to get list
   * @memberof BackupReturnComponent
   */
  public getList(manualRefresh?: boolean) {
    return new Promise((resolve, reject) => {
      this.returnAPIService.getReturnList(undefined, undefined, 'backupReturnList').then((result: any) => {
        this.rowData = result.data;
        if (!manualRefresh && result.gridPref && Object.keys(result.gridPref).length > 0) {
          this.loadGridState(result.gridPref);
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
* @memberof ManageInvitedClientsComponent
*/
  private loadGridState(gridPref: any) {
    this.filter = gridPref.userFilter || JSON.parse(JSON.stringify(this.defaultFilter));
    this.returnBackupList.setGridState(gridPref || {});
    this.quickSearch(this.filter.searchText);
    this.externalFilter();
  }

  /**
   * @author Ravi Shah
   * Call The Standard Grid Function for the Quick Search in Ag grid
   * @param {string} searchText
   * @memberof BackupReturnComponent
   */
  quickSearch(searchText: string) {
    this.returnBackupList.quickFilter(searchText);
  }

  /**
   * @author Ravi Shah
   * Call the Standard Grid Function for the External Filters
   * @memberof BackupReturnComponent
   */
  externalFilter() {
    this.returnBackupList.externalFilter();
  }

  /**
   * @author Ravi Shah
   * External Filter Handler
   * @private
   * @param {*} node
   * @returns
   * @memberof BackupReturnComponent
   */
  private externalFilterStatus(node: any) {
    if (this.filter.status !== 'All') {
      return node.data.type && node.data.type.toLowerCase() === this.filter.status.toLowerCase();
    }
    return true;
  }

  /**
   * @author Ravi Shah
   * Save Grid Settings
   * @memberof BackupReturnComponent
   */
  saveGridSettings() {
    this.returnBackupList.saveGridState().then(() => {

      this.messageService.showMessage('Grid Settings for Backup Return List saved successfully.', 'success');
    });;
  }

  /**
   * @author Ravi Shah
   * Reset Grid Settings
   * @memberof BackupReturnComponent
   */
  resetGridSettings() {
    this.returnBackupList.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchText);
      this.externalFilter();
      this.messageService.showMessage('Grid Settings for Backup Return List reset successfully.', 'success');
    });
  }

  backupReturn() {
    //filter the return list  based on the search field
    let filteredData: any = this.returnBackupList.getSelectedValue;
    if (filteredData && filteredData.length > 0) {
      let returnIds = filteredData.map(t => t.id);
      this.returnAPIService.backupReturn(returnIds).then((documentKey: any) => {
        // location id pass with get request to prevent unauthorized access from another location id
        var locationId = this.userService.getLocationId(false);
        //tax year is passed because backup taken as year wise
        var taxYear = this.userService.getTaxYear();
        //this will download the zip file in browser 
        window.open(environment.base_url + '/return/download?key=' + documentKey.data + '&locationId=' + locationId + '&taxYear=' + taxYear, "_self");
        this.messageService.showMessage('Return backup successful', 'success');
      })
    } else {
      this.messageService.showMessage('Please select a return(s)', 'error');
    }
  };

  /**
   * @author Ravi Shah
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberof BackupReturnComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "SSN/EIN",
          field: "ssnOrEinFull",
          width: 203,
          suppressMovable: true,
          checkboxSelection: true,
          headerCheckboxSelection: true,
          cellRenderer: (params: any) => {
            return params.data.ssnOrEin
          }
        },
        {
          headerName: "TAXPAYER NAME",
          field: "taxPayerName",
          width: 400
        },
        {
          headerName: "PHONE NUMBER",
          field: "homeTelephone",
          width: 200
        },
        {
          headerName: "TYPE",
          field: "type",
          width: 100,
          cellRenderer: (params: any) => {
            return params.data.type ? params.data.type.toUpperCase() : '';
          }
        },
        {
          headerName: "YEAR",
          field: "year",
          width: 100
        },
        {
          headerName: "STATUS",
          field: "status.title",
          width: 185
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    }
  }

  ngOnInit() {
    this.gridOptions = this._gridOptions;
    let packageDetails = this.systemConfigService.getReleasedPackages();
    let types = [{ title: 'All Types', id: 'All' }];
    this.returnTypes = types.concat(packageDetails);
  }

}
