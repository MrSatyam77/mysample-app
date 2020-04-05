//External inports
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';

//Internal imports
import { UserService } from '@app/shared/services/user.service';
import { ProformaService } from '@app/proforma/proforma.service';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-proformalist',
  templateUrl: './proforma-list.component.html',
  styleUrls: ['./proforma-list.component.scss']
})
export class ProformaListComponent implements OnInit {

  @ViewChild('proformaAgGridComponent', { static: false }) proformaAgGridComponent: StandardAgGridComponent;

  constructor(private messageService: MessageService, private router: Router,
    private userService: UserService,
    private proformaService: ProformaService) { }

  public refreshStart: boolean;
  // hold grid data
  public rowData: any;
  //to access the grids API
  public gridApi;
  public gridOptions: GridOptions;
  //hold multiple filter value
  public defaultFilter: any = { searchField: '' };
  public filter: any = { searchField: '' };
  //hold default definition grid columns
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "TITLE",
          field: "type",
          width: 310

        },
        {
          headerName: "YEAR",
          field: "taxYear",
          width: 300

        },
        {
          headerName: "STATUS",
          field: "status",
          width: 292,
          sort: 'desc',
          cellRenderer: (params: any) => {
            if (params.data.status == 'Error') {
              return `<span>Error</span>`
            }
            if (params.data.failedMessage && params.data.failedMessage != '') {
              return `<span style="position:relative">
              <div class="popover bottom"
                  style="display:block !important;position:absolute;top:16px;left:-155px;">
                  <div class="arrow"></div>
                  <div class="popover-inner">
                      <span class='popover_close'><i
                                  class='fas fa-times color_black'></i></a></span>
                      <div class="popover-content">
                           <div style="width: 250px;word-wrap:break-word;padding-top:6px;padding-right:5px;">
                              ${params.data.failedMessage}</div>
                      </div>
                  </div>
              </div>
          </span>`}
            else {
              return `<span>${params.data.status}</span>`
            }
          }
        },
        {
          headerName: 'DATE SUBMITTED',
          field: 'createdDate',
          width: 331
        }
      ]
    }
  }

  /**
   * @author shreya kanani
   * @description this method redirect to home screen
   */

  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  /**
   * @author shreya kanani
   * @description this method redirect to proformaedit screen
   */
  uploadNewProforma() {
    this.router.navigateByUrl('/proforma/new');
  };

  /**
   * @author shreya kanani
   * @param privilege 
   * @description this method check user privilege
   */
  userCan(privilege) {
    return this.userService.can(privilege);
  };

  /**
   * @author shreya kanani
   * @description this method save grid settings
   */
  saveGridSettings() {
    this.proformaAgGridComponent.saveGridState().then(() => {
      this.messageService.showMessage('Grid Settings for Proforma List saved successfully.', 'success');
    });
  }

  /**
   * @author shreya kanani
   * @description this method reset grid settings
   */
  resetGridSettings() {
    this.proformaAgGridComponent.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchField);
      this.messageService.showMessage('Grid Settings for Proforma List reset successfully.', 'success');
    });
  }

  /**
   * @author shreya kanani
   * @param params 
   * @description this method bind data in grid
   */
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    this.loadData();
  }
  /**
   * @author shreya kanani
   * @param searchField 
   * @description this method filter grid data
   */
  quickSearch(searchField: string) {
    this.proformaAgGridComponent.quickFilter(searchField);
  }

  /**
   * @author shreya kanani
   * @description this method bind the data in a grid
   */
  public loadData(manualRefresh?: boolean) {
    return new Promise((resolve, reject) => {
      this.proformaService.getProformaList().then((result: any) => {
        this.rowData = result;
         if (!manualRefresh && result.gridPref && Object.keys(result.gridPref).length > 0) {
          this.loadGridState(result.gridPref || {});
        }
        resolve(result);
      }, (error) => {
        console.error(error);
        reject(error);
      });
    });
  }

  private loadGridState(gridPref: any) {
    this.filter = gridPref.userFilter || JSON.parse(JSON.stringify(this.defaultFilter));
    this.proformaAgGridComponent.setGridState(gridPref);
    this.quickSearch(this.filter.searchField);
  }

  /**
   * @author shreya kanani
   * @description this method refresh the grid data
   */
  manuallyRefresh() {
    this.refreshStart = true;
    this.loadData(true).then((response: any) => {
      this.refreshStart = false;
    }, error => {
      this.refreshStart = false;
    });

  }

  ngOnInit() {
    this.gridOptions = this._gridOptions;
  }
}

/**
 * @author shreya kanani
 * @param params 
 * @description this method formate the date 
 */
function formatDate(params) {
  return moment(params.value).format('MM/DD/YYYY');
}
