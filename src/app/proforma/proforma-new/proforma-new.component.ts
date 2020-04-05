//External imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';

//Internal imports
import { ReturnAPIService } from '@app/return/return-api.service';
import { MessageService } from '@app/shared/services/message.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-proformanew',
  templateUrl: './proforma-new.component.html',
  styleUrls: ['./proforma-new.component.scss']
})
export class ProformanewComponent implements OnInit {

  @ViewChild('proformaNewAgGridComponent', { static: false }) proformaNewAgGridComponent: StandardAgGridComponent;


  constructor(private router: Router,
    private returnapiService: ReturnAPIService,
    private messageService: MessageService,
    private systemConfigService: SystemConfigService, ) { }

  public gridApi;
  public filterConfig: any = [{ typeTitle: '' }];
  public packageDetails: any;  //hold package name
  public returnTypes: any;
  public types: any;
  public filterDisplay: any = [{ type: '' }];
  public refreshStart: any; // refresh grid data
  public rowData: any;  //hold row data
  public gridOptions: GridOptions;
  public filter: any = { searchField: '', returnType: 'All' };
  public proformaRequestError: any;
  public templateType: string = 'returns' // hold template type filter value
  //hold default definition grid columns
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: 'SSN/EIN',
          field: 'ssnOrEin',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 190,
          cellRenderer: (params: any) => {
            if (params.data.isProformaProceed) {
              return `<span>${params.data.ssnOrEin} <i class="fa fa-check color_green margin_left_10"></i>
            </span>`
            } else {
              return `<span>${params.data.ssnOrEin}</span>`
            }
          }
        },
        {
          headerName: 'TAXPAYER NAME',
          field: 'taxPayerName',
          width: 270
        },
        {
          headerName: 'TYPE',
          field: 'type',
          width: 250

        },
        {
          headerName: 'YEAR',
          field: 'year',
          width: 230
        },
        {
          headerName: 'PREPARER',
          field: 'updatedByName',
          width: 230
        },
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    }
  }


  /**
   * @author shreya kanani 
   * @description this method redirect to home page 
   */

  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  /**
   * @author shreya kanani
   * @param searchField 
   * @description this method filter grid data
   */


  public quickSearch(searchField: any) {
    this.gridApi.setQuickFilter(searchField);
  }

  /**
   * @author shreya kanani
   * @description this method filter data according to dropdown
   */
  externalFilter() {
    this.proformaNewAgGridComponent.externalFilter();
  }

  /**
   * @author shreya kanani
   * @param params
   * @description this method bind the data in grid
   */
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    this.initReturnList();
  }

  /**
   * @author shreya kanani
   * @param node 
   * @description this method filter grid data
   */
  private externalFilterStatus(node: any) {
    let isStateMatch = true;
    if (this.filter.returnType !== 'All') {
      let obj = this.returnTypes.find(t => t.id === this.filter.returnType);
      isStateMatch = node.data.type === obj.id;
    }
    else {
      isStateMatch = true;
    }

    let isReturnMatch = true;
    if (this.templateType == 'returns') {
      isReturnMatch = node.data.isDefaultReturn !== true
    } else if (this.templateType == 'customReturnTemplates') {
      isReturnMatch = node.data.isDefaultReturn === true
    }
    return isStateMatch && isReturnMatch;
  }

  /**
   * @author shreya kanani
   * @param isFullPerforma
   * @description this method perform proforma on retur 
   */
  proformaOnReturn(isFullPerforma) {
    const self = this;
    let _filteredObjects: any = this.proformaNewAgGridComponent.getSelectedValue;
    let returnIds = _filteredObjects.map(_filteredObjects => _filteredObjects.id);
    ///check the length of return ids
    if (returnIds.length > 0) {
      //pass the return id and year to the service to perform proforma
      this.returnapiService.proformaOnReturn(returnIds, isFullPerforma).then(() => {
        self.router.navigateByUrl('/proforma/list');
        self.messageService.showMessage('Request submitted successfully', 'success', 'PROFORMA_SUCCESS_MSG');
      }, (error) => {
        this.proformaRequestError = true;
      });
    } else {
      // This will give messsage to the user when user has not selected single return for proforma           
      if (this.templateType == 'customReturnTemplates') {
        this.messageService.showMessage('Please select a custom return template(s)', 'error', 'SELECT_RETURN_ERROR');
      } else {
        this.messageService.showMessage('Please select a return(s)', 'error', 'SELECT_RETURN_ERROR');
      }
    }
  }

  /**
   * @author shreya kanani
   * @description this method bind the data in grid
   */
  public initReturnList() {
    return new Promise((resolve, reject) => {
      this.returnapiService.getPriorYearReturnList().then((result) => {
        this.rowData = result;
        resolve(result);
      }, (error) => {
        console.error(error);
        reject(error);
      });
    });
  }

  /**
   * @author shreya kanani
   * @description this method refresh the grid data
   */
  manuallyRefresh() {
    this.refreshStart = true;
    this.initReturnList().then((response: any) => {
      this.refreshStart = false;
    });
  }

  initFilterConfig() {
    if (((this.filterDisplay.type == undefined) || this.filterDisplay.type != null || this.filterDisplay.type == "")
      && ((this.filterConfig.typeTitle == undefined) || this.filterConfig.typeTitle != null || this.filterConfig.typeTitle == "")) {
      this.filterDisplay.type = this.returnTypes[0].title;
      this.filterConfig.type = this.returnTypes[0].type;
    }
  }
  /**
   * @author shreya kanani
   * @description this method check environment mode
   */
  betaOnly() {
    if (environment.mode == 'beta' || environment.mode == 'local') {
      return true;
    } else {
      return false;
    }
  }


  ngOnInit() {
    this.gridOptions = this._gridOptions;
    this.packageDetails = this.systemConfigService.getReleasedPackages();
    this.types = [{ title: 'All Types', id: 'All' }];
    this.returnTypes = this.types.concat(this.packageDetails);
    this.initFilterConfig();
  }

}
