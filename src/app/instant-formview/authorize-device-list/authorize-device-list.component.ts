//External Imports
import { Component, ViewChild, TemplateRef, AfterViewInit, OnInit, ChangeDetectionStrategy,  ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';


//Internal Imports
import { CommonAPIService } from "@app/shared/services/index";
import { APINAME } from '@app/instant-formview/instant-formview.constant';
import { GridTemplateRendererComponent } from '@app/shared/components/grid-template-renderer/grid-template-renderer.component';


@Component({
  selector: 'app-authorize-device-list',
  templateUrl: './authorize-device-list.component.html',
  styleUrls: ['./authorize-device-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AuthorizeDeviceListComponent implements AfterViewInit, OnInit {
  public searchField : string = '';
  public noRowsTemplate = "<span></span>";
  constructor(private _commonAPIService: CommonAPIService, private ref: ChangeDetectorRef) { }

  @ViewChild('authorizeActionCell', { static: true }) authorizeActionCell: TemplateRef<any>;
  @ViewChild('deviceIconCell', { static: true }) deviceIconCell: TemplateRef<any>;

  // hold grid data
  public rowData: any;
  //hold column definition of grid
  public columnDefs = [];
  //to access the grids API
  public gridApi;
  //hold row height
  public rowHeight;

  public enableLoading = false;

  clearSearch() {
    this.searchField = '';
  }

  /**
   * @author Heena Bhesaniya
   * @description This function will load device list initilailly
   */
  ngOnInit() {
    //intially call function to load list
    this.loadDeviceList();
  }

  /**
   * @author Heena Bhesaniya
   * @description This function is used to define column header definition 
   * {
      headerName: 'Device',
      cellRendererFramework: GridTemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: this.deviceIconCell
      },
      sortable: false,
    },
   */
  ngAfterViewInit() {
    this.columnDefs = [
    {
      headerName: 'Device Name',
      field: 'deviceName',
      sortable: true,
      hide: false,
      headerTooltip: 'Device Name',
      lockPosition: true,
      suppressMenu: true,
      width: 50
    }, {
      headerName: 'IP Address',
      field: 'ip',
      sortable: true,
      hide: false,
      headerTooltip: 'IP Address',
      lockPosition: true,
      suppressMenu: true,
      width: 30
    }, {
      headerName: 'Date-Time',
      field: 'createdDate',
      sortable: true,
      valueFormatter: formatDate,
      hide: false,
      headerTooltip: 'Date-Time',
      lockPosition: true,
      suppressMenu: true,
      width: 40
    }, {
      headerName: 'Actions',
      hide: false,
      headerTooltip: 'Actions',
      lockPosition: true,
      suppressMenu: true,
      cellRendererFramework: GridTemplateRendererComponent,
      cellRendererParams: {
        ngTemplate: this.authorizeActionCell
      },
      sortable: false,
      width: 20
    }];
    this.rowHeight = 45;
  }

  /**
   * @author Heena Bhesaniya
   * @description This function will call before grid data load to access grid api for some configuratipn
   * @param params 
   */
  onGridReady(params) {
    this.gridApi = params.api; // To access the grids API
    params.api.sizeColumnsToFit();
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
   * @description load authorize device list
   */
  private loadDeviceList(): void {
    const self = this;
    self.enableLoading = true;
    self.ref.detectChanges();
    self._commonAPIService.getPromiseResponse({ apiName: APINAME.getAuthorizeDeviceList, methodType: 'post', parameterObject: { status: '0' } }).then((response: any) => {
      self.enableLoading = false;
      if (response && response.data && response.data) {
        self.gridApi.setRowData(response.data);
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
   * @description This function is used to filter/search on grid data
   * @param event 
   */
  public onFilterTextBoxChanged(event) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  /**
   * @author Heena Bhesaniya
   * @description This function will call when used will allow/deny any device
   * @param dataItem Whole row device data
   * @param isAuthorized flag true if allow or false if deny
   */
  public authorizeDevice(dataItem: any, isAuthorized: boolean) {
    const self = this;
    self._commonAPIService.getPromiseResponse({ apiName: APINAME.authorizeDevice, methodType: 'post', parameterObject: { deviceID: dataItem.deviceID, authorize: isAuthorized } }).then((response: any) => {
      self.loadDeviceList();
    }, error => {
      console.error(error);
    });
  }
}

/**
 * @author Heena Bhesaniya
 * @description Used to format date using moment js
 * @param params this value of original date value
 */
function formatDate(params) {
  return moment(params.value).format('LLLL')
}