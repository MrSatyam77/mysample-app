//External Imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';

//Internal Imports
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { UserService, SystemConfigService, DialogService, MessageService, BasketService, CommunicationService } from '@app/shared/services';
import { CustomReturnStatusComponent } from '@app/return/dialogs/custom-return-status/custom-return-status.component';
import { TextMessageDialogComponent } from '@app/shared/components/text-message-dialog/text-message-dialog.component';
import { environment } from '@environments/environment';
import { ExportDialogComponent } from '@app/efile-center/dialogs/export-dialog/export-dialog.component';
import { ReturnAPIService } from '@app/return/return-api.service';


@Component({
  selector: 'app-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.scss']
})
export class ReturnListComponent implements OnInit {

  @ViewChild('returnListAgGridComponent', { static: false }) returnListAgGridComponent: StandardAgGridComponent;

  constructor(private router: Router,
    private userService: UserService,
    private systemConfigService: SystemConfigService,
    private returnapiService: ReturnAPIService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private basketService: BasketService,
    private communicationService: CommunicationService,
    private activatedRoute: ActivatedRoute) { }

  public refreshStart: boolean; // hold grid data
  public rowData: any;  //to access the grids API
  private gridApi;
  public gridOptions: GridOptions; //hold multiple filter value
  public filter: any = { searchField: '', returnType: 'All', filterDataLength: null };
  private returnActions = ['Delete Return', 'Print Client Organizer', 'Message', 'Copy Return', 'Create Amend Return'];
  public defaultFilter: any = { searchField: '', returnType: 'All' };
  private packageDetails: any;  //hold package name
  public returnTypes: any;
  private types: any;
  private returnStatus: any;
  public isData: boolean = false;
  public message: any;


  //hold default definition grid columns
  private get _gridOptions(): GridOptions {
    return {
      isRowSelectable: (params) => {
        return !this.isActionDisabled('Delete Return', params.data);
      },
      columnDefs: [
        {
          headerName: "SSN/EIN",
          field: "ssnOrEinFull",
          width: 200,
          hide: true
        },
        {
          headerName: 'SSN/EIN',
          field: 'ssnOrEin',
          width: 130,
          checkboxSelection: true,
          cellRenderer: ((params: any) => {
            let conditionalReturnClass = this.setReturnClass(params.data);
            let condition = !this.userCan('CAN_OPEN_RETURN') ? 'no-clicking ' : '';
            let element = ` <div class="float-left">
            <i class="fa font_size_14  ${conditionalReturnClass} "></i>
             <a class="${condition}" data-action-type="openreturn" style="color:#00628e;">${params.data.ssnOrEin}</a></div>`
            return element;
          })

        },
        {
          headerName: 'TP FIRST NAME ENTITY Name',
          field: 'taxpayerFirstName',
          width: 250
        },
        {
          headerName: 'TP LAST NAME',
          field: 'taxpayerLastName',
          width: 170
        },
        {
          headerName: 'PHONE NO',
          field: 'homeTelephone',
          width: 150

        },
        {
          headerName: "EMAIL",
          field: "taxPayerEmail",
          width: 200,
          hide: true
        },
        {
          headerName: 'TYPE',
          field: 'type',
          width: 100,
          cellRenderer: (params: any) => {
            return params.value ? params.value.toUpperCase() : '';
          }
        },
        {
          headerName: 'Sub Type',
          field: 'subType',
          width: 100,
          cellRenderer: (params: any) => {
            return params.value ? params.value.toUpperCase() : '';
          }
        },
        {
          headerName: 'YEAR',
          field: 'year',
          width: 100
        },
        {
          headerName: 'STATES',
          field: 'states',
          width: 80
        },
        {
          headerName: 'PREPARED BY',
          field: 'updatedByName',
          width: 130
        },
        {
          headerName: 'STATUS',
          field: 'statustitle',
          width: 230,
          cellRenderer: ((params: any) => {
            let conditionalClass = params.data.isCheckedOut || !this.userCan('CAN_SAVE_RETURN') ? 'no-clicking disabled' : '';
            let element = `<div class="dropdown">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" id="typeFilter" data-toggle="dropdown">
                ${params.data.status.title}
            </button>
            <div class="dropdown-menu" style="cursor: pointer;">
                <a class="dropdown-item" tabindex="-1" data-action-type="opencustomdialog">Customize
                    Status </a>
                <div class="dropdown-divider"></div>`
            for (let status of this.returnStatus) {
              element += `<a class="dropdown-item ${conditionalClass}" data-action-type="changestatus" data-value='${JSON.stringify(status)}' tabindex="-1" >${status.title}</a>`
            }
            element += '</div></div>';
            return element;
          })
        },
        {
          headerName: 'ACTIONS',
          width: 120,
          cellRenderer: ((params: any) => {
            let element = ` <div class="dropdown pl-4 position-relative" is-open="returnActionToggle.isOpen" data-ng-class="{'no-clicking':!isOnline}">
            <button type="button" class="btn btn-outline-primary dropdown-toggle" id="typeFilter" data-toggle="dropdown">
                <i class="fas fa-cog padding_right_5"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
                <li>`
            for (let action of this.returnActions) {
              let conditionalClass = this.isActionDisabled(action, params.data) ? 'no-clicking disabled' : '';
              if (this.isactionDisplayed(action) == true) {
                element += `<a class="dropdown-item ${conditionalClass}" data-action-type="returnaction" data-value='${JSON.stringify(action)}' tabindex="-1" >${action}</a>`
              }
            }
            element += '</li></ul></div>';
            return element;
          })
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    }
  }

  /**
  * @author shreya kanani
  * @param actionType
  * @description this method perform action on click
  */
  public onActionClicked({ actionType, dataItem, node, value }) {
    switch (actionType) {
      case 'opencustomdialog':
        this.openCustomStatusDialog();
        break;
      case 'changestatus':
        this.changeReturnStatus(dataItem, node, JSON.parse(value));
        break;
      case 'returnaction':
        this.returnAction(JSON.parse(value), dataItem);
        break;
      case 'openreturn':
        this.openReturn(dataItem);
        break;
      default:
        break;
    }
  }

  /**
   * @author shreya kanani
   * @description this method save grid settings
   */
  saveGridSettings() {
    this.returnListAgGridComponent.saveGridState().then(() => {
      this.messageService.showMessage('Grid Settings for return List saved successfully.', 'success');
    });
  }

  /**
   * @author shreya kanani
   * @description this method reset grid settings
   */
  resetGridSettings() {
    this.returnListAgGridComponent.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchField);
      this.externalFilter();
      this.messageService.showMessage('Grid Settings for return List reset successfully.', 'success');
    });
  }

  /**
   * @author shreya kanani
   * @param returnObj 
   * @description get class name for return
   */
  public setReturnClass(returnObj) {
    return this.returnapiService.setReturnClass(returnObj);
  }

  /**
   * @author shreya kanani 
   * @description this method redirect to home page 
   */
  public backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  /**
   * @author shreya kanani
   * @param searchField 
   * @description this method filter grid data
   */
  quickSearch(searchField: string) {
    this.filter.filterDataLength = this.returnListAgGridComponent.quickFilter(searchField);
  }

  /**
   * @author shreya kanani
   * @description this method filter data according to dropdown
   */
  externalFilter() {
    this.returnListAgGridComponent.externalFilter();
  }

  /**
  * @author shreya kanani
  * @param privilege 
  * @description this method check user privilege
  */
  public userCan(privilege) {
    return this.userService.can(privilege);
  }

  /**
   * @author shreya kanani
   * @description create new return
   */
  public createNewReturn() {
    this.router.navigateByUrl('/return/new');
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
    return isStateMatch;
  }

  /**
   * @author shreya kanani
   * @description this method bind the data in grid
   */
  public initReturnList(manualRefresh?: boolean) {
    return new Promise((resolve, reject) => {
      this.isData = false;
      this.returnapiService.getReturnList().then((result: any) => {
        this.rowData = result;
        this.isData = true;
        this.filter.filterDataLength = result.length;
        if (!manualRefresh && result.gridPref && Object.keys(result.gridPref).length > 0) {
          this.loadGridState(result.gridPref || {});
        }
        else {
          this.externalFilter();
        }
        resolve(result);
      }, (error) => {
        this.isData = false;
        console.log(error);
        reject(error);
      });
    });
  }

  private loadGridState(gridPref: any) {
    this.filter = gridPref.userFilter || JSON.parse(JSON.stringify(this.defaultFilter));
    this.returnListAgGridComponent.setGridState(gridPref || {});
    this.quickSearch(this.filter.searchField);
    this.externalFilter();
  }

  /**
   * @author shreya kanani
   * @description this method open custom status dialog
   */
  public openCustomStatusDialog() {
    let dialog = this.dialogService.custom(CustomReturnStatusComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'md' });
    dialog.result.then(() => {
      //reinitialize array
      this.returnStatus = this.userService.getReturnStatusList();
      this.gridApi.redrawRows();
      //reinitialize return status other wise changes in custom status will not reflect immediately.
      this.returnStatus.forEach(returnData => {
        if (returnData.status && returnData.status.id && returnData.status.isPredefined == false) {
          returnData.status = this.userService.getReturnStatusObject(returnData.status.id);
        }
      });
    }, () => {
      console.info("canceled");
    });
  }

  /**
   *@author shreya kanani
   * @param selectedReturn 
   * @param node 
   * @param newStatus 
   * @description this method change return status
   */
  public changeReturnStatus(selectedReturn, node: any, newStatus) {
    // If previous status is same as changed status then we don't need to call API.				    			
    this.returnapiService.changeReturnStatus({ id: selectedReturn.id, status: newStatus }).then(() => {
      this.messageService.showMessage('Status Changed Successfully', 'success');

      selectedReturn.status = this.userService.getReturnStatusObject(newStatus.id);
      selectedReturn.statustitle = selectedReturn.status.title;

      this.returnListAgGridComponent.setRowData(selectedReturn, node);

      console.log(newStatus.status);
    }, () => {
      this.messageService.showMessage('Server Error', 'error');
    });
  }

  /**
   * @author shreya kanani
   * @description delete return
   */
  public deleteReturns() {
    return new Promise((resolve, reject) => {
      //holds return ids
      let returnToDelete = [];
      let _filteredObjects: any = this.returnListAgGridComponent.getSelectedValue;
      returnToDelete = _filteredObjects.map(_filteredObjects => _filteredObjects.id);
      //if return is seleted and length is greater then 0
      if (returnToDelete.length > 0) {
        let dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
        //open confirmation dialog
        var dialog = this.dialogService.confirm({ title: "confirmation", text: "Delete return(s) from the Return List?", type: "confirm" }, dialogConfiguration);
        dialog.result.then((result) => {
          //call delete return
          resolve(result);
          this.returnapiService.deleteReturn(returnToDelete).then(() => {
            //show success msg
            this.messageService.showMessage('Return Deleted Successfully', 'success');
            //reload data.
            this.initReturnList().then(() => {
              this.gridApi.refreshCells();
            }, (error) => {
              console.log(error);
              reject(error);
            });
          }, (error) => {
            this.messageService.showMessage('Server Error', 'error');
            console.log(error);
          });
        }, () => {
          // Do nothing on cancel
        });
      }
    });
  }

  /**
   * @author shreya kanani
   * @description refresh grid data
   */
  public manuallyRefresh() {
    this.refreshStart = true;
    this.initReturnList().then(() => {
      this.returnStatus = this.userService.getReturnStatusList();
      this.refreshStart = false;
    }, (error) => {
      console.log(error);
      this.refreshStart = false;
    });
  }

  /**
   * @author shreya kanani
   * @param action 
   * @description display action
   */
  public isactionDisplayed(action) {
    switch (action) {
      // delete selected return
      case "Delete Return":
        return true;

      case "Print Client Organizer":
        return true;

      case "Message":
        return true;

      case "Copy Return":
        if (this.betaOnly())
          return true;
        else
          return false

      case 'Create Amend Return':
        if (this.betaOnly())
          return true;
        else
          return false


      default:
        return false;
    }
  }

  /**
   * @author shreya kanani
   * @param action
   * @param returnObj
   * @description check whether action is disabled or not 
   */
  public isActionDisabled(action, returnObj) {
    switch (action) {
      // delete selected return
      case "Delete Return":
        return this.canDelete(returnObj);

      case "Print Client Organizer":
        return !this.userCan("CAN_PRINT_CLIENTORGANIZER");

      case "Message":
        return false;

      case "Copy Return":
        return false;

      case 'Create Amend Return':
        if (this.canCreateAmendedCopy(returnObj) === true) {
          return false;
        } else {
          return true;
        }

      default:
        return false;
    }
  }

  /**
  * @author shreya kanani
  * @description this method check environment mode
  */
  public betaOnly() {
    if (environment.mode == 'beta' || environment.mode == 'local') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author shreya kanani
   * @description check user can delete return or not 
   */
  public canDelete(returnObj) {
    if (this.userCan('CAN_REMOVE_RETURN') == false) {
      return true;
    } else if (returnObj.isCheckedOut == true || returnObj.isLocked == true) {
      return true;
    } else if ((returnObj.eFileStatus)) {
      Object.keys(returnObj.eFileStatus).forEach(val => {
        Object.keys(returnObj.eFileStatus[val]).forEach(subState => {
          if (returnObj.eFileStatus[val][subState].status == 9) {
            return true;
          }
        });
      });
    } else if ((returnObj.eFileStatus)) {
      Object.keys(returnObj.eFileStatus).forEach(val => {
        Object.keys(returnObj.eFileStatus[val]).forEach(subState => {
          if (returnObj.eFileStatus[val][subState].status !== 8) {
            return true;
          }
        });
      });
    } else {
      return false;
    }
  }

  /**
   * @author shreya kanani 
   * @param action 
   * @param returnObj 
   * @description return action like delete return
   */
  public returnAction(action, returnObj) {
    // there will be many actions that user can perform
    switch (action) {
      // delete selected return
      case "Delete Return":
        if ((returnObj) && (returnObj != null)) {
          // Dialog used for the confirmation from user to Delete or not the selected Return.
          let dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
          let dialog = this.dialogService.confirm({ title: "confirmation", text: "Delete return(s) from the Return List?", type: "confirm" }, dialogConfiguration);
          dialog.result.then((btn) => {
            let returnsToDelete = [];
            returnsToDelete.push(returnObj.id);
            this.returnapiService.deleteReturn(returnsToDelete).then(() => {
              this.messageService.showMessage('Return Deleted Successfully', 'success');
              this.initReturnList().then(() => {
                this.gridOptions.api.refreshCells();
              }, (error) => {
                console.log(error);
              });
            }, (error) => {
              this.messageService.showMessage('Server Error', 'error');
              console.log(error);
            });
          }, () => {
            //  Do nothing on cancel
          });
        }
        break;

      case "Print Client Organizer":
        this.basketService.pushItem('taxPayerNameForClientOrganizer', returnObj.taxPayerName);
        this.basketService.pushItem('returnTypeForClientOrganizer', returnObj.type);
        this.router.navigateByUrl("/manage/clientOrganizer/print");
        break;

      case "Message":
        this.openTextMessage(returnObj);
        break;

      case "Copy Return":
        this.createDuplicateReturn(returnObj, "copy");
        break;

      case 'Create Amend Return':
        this.createDuplicateReturn(returnObj, "amended");
        break;

      default:
        break;
    }
  }

  /**
   * @author shreya kanani 
   * @param returnObj 
   * @param type 
   * @description this method create duplicate return
   */
  public createDuplicateReturn(returnObj, type) {
    this.returnapiService.createDuplicateReturn(returnObj.id, type).then((response) => {
      if (type === 'amended') {
        this.messageService.showMessage('Amended return created successfully.', 'success');
      } else {
        this.messageService.showMessage('Return copied successfully.', 'success');
      }
      //reload data.
      this.initReturnList().then((response) => { });
    }, (error) => {
      this.messageService.showMessage('Server Error', 'error');
    })
  }

  /**
   * @author shreya kanani
   * @param returnObj 
   * @description create amended copy of return
   */
  public canCreateAmendedCopy(returnObj) {
    let canCreate = false;
    if (returnObj.eFileStatus) {
      for (let state of Object.keys(returnObj.eFileStatus)) {
        for (let key of Object.keys(returnObj.eFileStatus[state])) {
          if (returnObj.eFileStatus[state][key]["returnTypeCategory"] === "MainForm" && returnObj.eFileStatus[state][key]["status"] === 9) {
            canCreate = true;
            break;
          }
        }
        if (canCreate === true) {
          break;
        }
      }
    }
    return canCreate;
  }

  /**
   * @author shreya kanani
   * @param data 
   * @description open text message dialog
   */
  public openTextMessage(data) {
    this.dialogService.custom(TextMessageDialogComponent, { 'recipientName': data.taxPayerName, 'cellNumber': data.homeTelephone, 'message': '' }, { 'keyboard': false, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' });
  }

  /**
   * @author shreya kanani
   * @description this method add sample return
   */
  public addSampleReturns() {
    this.returnapiService.addSampleReturns().then((response) => {
      this.communicationService.transmitData({ topic: "refreshReturnList", channel: 'MTPO-Dashboard', data: {} });
      this.initReturnList();
      this.messageService.showMessage('Sample returns added successfully', 'success');
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * @author shreya kanani
   * @param formatType 
   * @description this method export file
   */
  public exportList(formatType: any) {

    let columnConfig = [
      { key: "ssnOrEinFull", text: "SSN/EIN", selected: true },
      { text: 'TP FIRST NAME ENTITY Name', key: 'taxpayerFirstName', selected: true },
      { text: 'TP LAST NAME', key: 'taxpayerLastName', selected: true },
      { key: "homeTelephone", text: "PHONE NUMBER", selected: true },
      { key: "taxPayerEmail", text: "EMAIL", selected: true },
      { key: "type", text: "TYPE", selected: true },
      { key: "year", text: "YEAR", selected: true },
      { key: "states", text: "ASSOCIATED STATES", selected: true },
      { key: "statustitle", text: "STATUS", selected: true },
      { key: "updatedByName", text: "PREPARED BY", selected: true }
    ];
    this.dialogService.custom(ExportDialogComponent, { columnConfiguration: columnConfig }, { 'keyboard': false, 'backdrop': false, 'size': 'md' }).result.then(res => {
      if (res) {
        let params = {
          columnKeys: res,
          fileName: 'ReturnList',
          sheetName: 'Sheet 1',
          allColumns: true
        };
        this.returnListAgGridComponent.exportGrid(formatType, params);
      }
    });
  }

  /**
   * @author shreya kanani
   * @param taxReturn 
   * @description open return for editing
   */
  public openReturn(taxReturn) {
    if (taxReturn.isCheckedOut == true) {
      let message = "some one else";
      if ((taxReturn.checkedOutBy)) {
        message = taxReturn.checkedOutBy;
      } else if ((taxReturn.email)) {
        message = taxReturn.email;
      }
      this.messageService.showMessage('This return is opened for editing by ' + message, 'error');
    } else {
      //condition to check last save return in which mode on that basic user is redirected to input mode or interview mode
      if ((taxReturn.returnMode) && (taxReturn.returnMode != null) && taxReturn.returnMode == 'interview') {
        this.router.navigateByUrl('/return/interview/' + taxReturn.id);
      } else {
        this.router.navigateByUrl('/return/edit/' + taxReturn.id);
      }
    }
  }

  ngOnInit() {
    this.gridOptions = this._gridOptions;
    this.packageDetails = this.systemConfigService.getReleasedPackages();
    this.types = [{ title: 'All Types', id: 'All' }];
    this.returnTypes = this.types.concat(this.packageDetails);
    this.returnStatus = this.userService.getReturnStatusList();
    this.message = this.activatedRoute.snapshot.paramMap.get('message?');
    if (this.message) {
      this.messageService.showMessage(this.message, 'error');
    }

  }

}
