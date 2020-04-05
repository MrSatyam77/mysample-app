//External Imports
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';

//Internal Imports
import { CommonAPIService, DialogService, RTCSocketService, LocalStorageUtilityService } from "@app/shared/services/index";
import { APINAME } from '@app/instant-formview/instant-formview.constant';
import { TrustedDeviceListConnectComponent } from '@app/instant-formview/dialogs/trusted-device-list-connect/trusted-device-list-connect.component';
import { GridTemplateRendererComponent } from '@app/shared/components/grid-template-renderer/grid-template-renderer.component';

@Component({
  selector: 'app-trusted-device-list',
  templateUrl: './trusted-device-list.component.html',
  styleUrls: ['./trusted-device-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TrustedDeviceListComponent implements OnInit, AfterViewInit {
  public searchField: string = "";
  public noRowsTemplate = "<span></span>";
  constructor(
    private _commonAPIService: CommonAPIService,
    private _dialogService: DialogService,
    private _rtcSocketService: RTCSocketService,
    private _localStorageUtilityService: LocalStorageUtilityService,
    private ref: ChangeDetectorRef) { }

  @ViewChild('connectActionCell', { static: true }) connectActionCell: TemplateRef<any>;
  // hold grid data
  public rowData: any;
  //hold grid header definition
  public columnDefs = [];
  // To access grid api functionality
  private gridApi;
  public gridColumnApi;
  //hold row height value
  public rowHeight;
  public enableLoading = false; // to display loader based on this var
  /**
   * @author Heena Bhesaniya
   * @description This function will call before grid data load to access grid api for some configuratipn
   * @param params 
   */
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  clearSearch() {
    this.searchField = '';
  }

  /**
   * @author Asrar Memon
   * @description This function will call change grid size so we have to change columns size also
   * @param params
   */
  onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }

  /**
   * @author Heena Bhesaniya
   * @description load authorize device list and set data in grid
   */
  private loadDeviceList(): void {
    const self = this;
    self.enableLoading = true;
    self.ref.detectChanges();
    self._commonAPIService.getPromiseResponse({ apiName: APINAME.getAuthorizeDeviceList, methodType: 'post', parameterObject: { status: '1' } }).then((response: any) => {
      self.enableLoading = false;
      if (response && response.data && response.data) {
        self.gridApi.setRowData(response.data);
        self.gridApi.sizeColumnsToFit();
      }
      self.ref.detectChanges();
    }, error => {
      self.enableLoading = false;
      self.ref.detectChanges();
      console.error(error);
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to get pin number and then open dialog to display pinumber and time
   * @param dataItem This is whole row device data
   */
  public connect(dataItem) {
    const self = this;
    self._commonAPIService.getPromiseResponse({ apiName: APINAME.getPinNumber, methodType: 'post', parameterObject: { 'deviceID': dataItem.deviceID } }).then((response: any) => {
      if (response && response.data) {
        this.setupSocketForDeviceConnection(dataItem.deviceID);
        let dialog = self._dialogService.custom(TrustedDeviceListConnectComponent, { pinNumber: response.data, deviceID: dataItem.deviceID }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' });
        dialog.result.then(response => {
        }, error => {
          console.error(error);
        });
      }
    }, error => {
      console.error(error);
    });
  }

  /**
   * @author Hannan Desai
   * @description
   *          To establish connection with new device and if already connected with old device than overwrite that connection.
   */
  private setupSocketForDeviceConnection(deviceID: string) {
    if (this._localStorageUtilityService.checkLocalStorageKey("instantFormViewDeviceId")) {
      this._rtcSocketService.emit("leave", { roomId: this._localStorageUtilityService.getFromLocalStorage("instantFormViewDeviceId") }, (data) => { });
    }
    // join socket room with deviceID
    this._rtcSocketService.emit("join", { id: deviceID }, (data) => { });
    this._localStorageUtilityService.addToLocalStorage("instantFormViewDeviceId", deviceID);
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to filter/search on grid data
   * @param event 
   */
  public onFilterTextBoxChanged(event) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to filter/search on grid data
   * @param event 
   */
  public delete(data) {
    const self = this;
    self.enableLoading = true;
    self.ref.detectChanges();
    self._commonAPIService.getPromiseResponse({
      apiName: APINAME.deleteTrustedDevice,
      methodType: 'post', parameterObject: { deviceID: data.deviceID }
    }).then((response: any) => {
      self.enableLoading = false;
      this.loadDeviceList();
    }, error => {
      self.enableLoading = false;
      self.ref.detectChanges();
      console.error(error);
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to define column header definition 
   */
  ngAfterViewInit() {
    this.columnDefs = [{
      headerName: 'Device Name',
      field: 'deviceName',
      sortable: true,
      hide: false,
      headerTooltip: 'Device Name',
      lockPosition: true,
      suppressMenu: true,
      width: 30
    }, {
      headerName: 'Status',
      sortable: true,
      field: 'status',
      hide: false,
      headerTooltip: 'Status',
      lockPosition: true,
      suppressMenu: true,
      valueGetter: function () {
        return 'Authorized';
      },
      width: 20

    }, {
      headerName: 'Note',
      field: 'note',
      sortable: true,
      hide: false,
      headerTooltip: 'Note',
      lockPosition: true,
      suppressMenu: true,
      width: 40
    }, {
      headerName: 'Date-Time',
      field: 'createdDate',
      sortable: true,
      valueFormatter: formatDate,
      hide: false,
      headerTooltip: 'Date-Time',
      lockPosition: true,
      suppressMenu: true,
      width: 30
    }, {
      headerName: 'Actions',
      hide: false,
      headerTooltip: 'Actions',
      lockPosition: true,
      suppressMenu: true,
      cellRendererFramework: GridTemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: this.connectActionCell
      },
      sortable: false,
      width: 10
    }];
    this.rowHeight = 45;
  }

  /**
   * @author Heena Bhesaniya
   * @description This function will load device list initilailly
   */
  ngOnInit() {
    //intially call function to load list
    this.loadDeviceList();
  }

}

/**
 * @author Heena Bhesaniya
 * @description Used to format date using moment js
 * @param params this value of original date value
 */
function formatDate(params) {
  // return moment(params.value).format('DD/MM/YYYY hh:mm:ss A')
  return moment(params.value).format('LLLL')
}