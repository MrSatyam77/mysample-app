//External imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';

//Internal imports
import { UserService } from '@app/shared/services/user.service';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { SignatureService } from '@app/signature/signature.service';
import { MessageService } from '@app/shared/services/message.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { DeviceRegistrationComponent } from '@app/signature/dialogs/device-registration/device-registration.component';

@Component({
  selector: 'app-device-list',
  templateUrl: './signature-device-list.component.html',
  styleUrls: ['./signature-device-list.component.scss']
})

export class DeviceListComponent implements OnInit {

  @ViewChild('signatureDeviceListAgGridComponent', { static: false }) signatureDeviceListAgGridComponent: StandardAgGridComponent;


  constructor(private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private signatureService: SignatureService) { }

  public gridApi; //to access the grids API
  public gridOptions: GridOptions;
  public rowData: any;  //hold row data
  public defaultFilter: any = { searchField: '' };
  public filter: any = { searchField: '' }; //filter grid data
  public returnIds: any;
  //hold default definition grid columns
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: 'DEVICE NAME',
          field: 'model',
          width: 260,
        },
        {
          headerName: 'STATUS',
          field: 'status',
          width: 250
        },
        {
          headerName: 'NOTE',
          field: 'note',
          width: 270

        },
        {
          headerName: 'CREATE DATE',
          field: 'createdDate',
          width: 270
        },
        {
          headerName: 'ACTIONS',
          width: 217,
          cellClass: 'ag-grid-action-wrapper',
          cellRenderer: (params: any) => {
            let conditionalClass = this.userService.can('CAN_REMOVE_DEVICE') ? '' : 'no-clicking';
            return `<div class="dropdown">
          <button type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown">
              <i class="fas fa-cog" ></i>
          </button>
          <div class="dropdown-menu">
              <a class="dropdown-item ${conditionalClass}" data-action-type="removeDevicelist">Delete</a>
          </div>
      </div>`}
        }
      ]
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
  * @param privilege 
  * @description this method check user privilege
  */
  userCan(privilege) {
    return this.userService.can(privilege);
  };

  /**
  * @author shreya kanani
  * @param params
  * @description this method bind the data in grid
  */
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    this._initAvailableDeviceList();

  }

  /**
  * @author shreya kanani
  * @description this method save grid settings
  */
  saveGridSettings() {
    this.signatureDeviceListAgGridComponent.saveGridState().then(() => {
      this.messageService.showMessage('Grid Settings for Signature Device List saved successfully.', 'success');
    });
  }

  /**
   * @author shreya kanani
   * @description this method reset grid settings
   */
  resetGridSettings() {
    this.signatureDeviceListAgGridComponent.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchField);
      this.messageService.showMessage('Grid Settings for Signature Device List saved successfully.', 'success');
    });
  }
  /**
  * @author shreya kanani
  * @param searchField 
  * @description this method filter grid data
  */
  quickSearch(searchField: string) {
    this.signatureDeviceListAgGridComponent.quickFilter(searchField);
  }
  /**
   * @author shreya kanani
   * @param ID 
   * @description remove device from the devicelist
   */
  public removeDeviceList(obj) {
    const self = this;
    let dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
    let dialog = self.dialogService.confirm({ title: "confirmation", text: "Do you want to delete this device ?", type: "confirm" }, dialogConfiguration);
    dialog.result.then(() => {
      this.signatureService.removeDevice(obj.ID).then(() => {
        self.messageService.showMessage('Remove successfully', 'success', 'DEVICE_REMOVE_SUCCESS');
        this._initAvailableDeviceList().then(() => {
          this.gridOptions.api.refreshCells();
        }, (error) => {
          console.log(error);
        });
      }, (error) => {
        console.log(error);
      });
    });
  };
  /**
   * @author shreya kanani
   * @description get available device list
   */
  public _initAvailableDeviceList() {
    //get device list from api
    return new Promise((resolve, reject) => {
      this.signatureService.getAvailableDeviceList().then((result: any) => {
        this.rowData = result;
        if(result.gridPref && Object.keys(result.gridPref).length > 0){
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
    this.signatureDeviceListAgGridComponent.setGridState(gridPref);
    this.quickSearch(this.filter.searchField);
  }

  /**
   * @author shreya kanani
   * @description this method generate barcode
   */
  public generateBarcode() {
    return new Promise((resolve, reject) => {
      let dialog = this.dialogService.custom(DeviceRegistrationComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'md' });
      dialog.result.then((result) => {
        resolve(result);
        this._initAvailableDeviceList().then(() => {
          this.gridOptions.api.refreshCells();
        }, (error) => {
          console.log(error);
        });
        (error) => {
          reject(error);
        }
      });
    });
  }
  /**
   * @author shreya kanani
   * @param actionType
   * @description this method perform action on click
   */
  public onActionClicked({ actionType, dataItem }) {
    switch (actionType) {
      case 'removeDevicelist':
        this.removeDeviceList(dataItem);
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.gridOptions = this._gridOptions;
    //if user don't have license then redirect to home page 
    if (!this.userService.getLicenseValue('enableSignaturePad')) {
      this.router.navigateByUrl('home');
    }
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
