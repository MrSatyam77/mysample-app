import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { UserService, MessageService, DialogService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientDetailComponent } from '../client-detail/client-detail.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  private data: any;
  private selectedRowData: any;
  private gridApi: any;
  public gridOptions: GridOptions;
  public rowData: any;
  public filter: any = { searchText: '', status: '' };
  public returnTypes: any = [];
  public permission: any = {};
  private _emailPattern: any = new RegExp(/^\w+([.-]\w+)*@\w+([.-]\w+)*(\.\w{2,4})+$/);

  @ViewChild('myTaxportalClientList', { static: false }) myTaxportalClientList: StandardAgGridComponent;

  constructor(private dialogService: DialogService, private activeModal: NgbActiveModal, private userService: UserService, private myTaxportalService: MyTaxportalService, private messageService: MessageService) { }


  /**
   * @author Ravi Shah
   * Close the Dialog
   * @memberof ClientListComponent
   */
  public close() {
    this.activeModal.close(false);
  }

  /**
   * @author Ravi Shah
   * On Grid is Ready Call Api For the Data
   * @param {*} params
   * @memberof ClientListComponent
   */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getList();

  }
  /**
   * @author Ravi Shah
   * to get list
   * @memberof ClientListComponent
   */
  public getList() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.myTaxportalService.getAllClientList().then((result) => {
        self.rowData = result;
        resolve(result);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Call The Standard Grid Function for the Quick Search in Ag grid
   * @param {string} searchText
   * @memberof ClientListComponent
   */
  quickSearch(searchText: string) {
    this.myTaxportalClientList.quickFilter(searchText);
  }

  /**
   * @author Ravi Shah
   * Call the Standard Grid Function for the External Filters
   * @memberof ClientListComponent
   */
  externalFilter() {
    this.myTaxportalClientList.externalFilter();
  }

  /**
   * @author Ravi Shah
   * External Filter Handler
   * @private
   * @param {*} node
   * @returns
   * @memberof ClientListComponent
   */
  private externalFilterStatus(node: any) {
    if (this.filter.status) {
      if (this.filter.status === 'true') {
        return node.data.isDisabled;
      } else {
        return !node.data.isDisabled;
      }
    }
    return true;
  }

  /**
   * @author Ravi Shah
   * Action Handler
   * @param {*} { actionType, dataItem, node }
   * @memberof ClientListComponent
   */
  public onActionClicked({ actionType, dataItem, node }) {
    switch (actionType) {
      case 'editClient':
        this.editClient(dataItem);
        break;
      case 'deleteClient':
        this.deleteClient(dataItem, node);
        break;
      default:
        break;
    }
  }

  /**
   * @author Ravi Shah
   * Edit Client Screen
   * @param {*} dataItem
   * @memberof ClientListComponent
   */
  public editClient(dataItem: any) {
    dataItem.allClients = this.rowData;
    this.dialogService.custom(ClientDetailComponent, dataItem, { 'keyboard': false, 'backdrop': false, 'size': 'mf', 'windowClass': 'my-class' }).result.then((response) => {
      if (response) {
        this.getList();
      }
    });
  }

  /**
   * @author Ravi Shah
   * Delete Clients
   * @param {*} dataItem
   * @param {*} node
   * @memberof ClientListComponent
   */
  public deleteClient(dataItem: any, node: any) {
    this.dialogService.confirm({ text: 'Are you sure you want to delete this client?', title: 'Confirmation' }, { 'keyboard': false, 'backdrop': false, 'size': 'mf', 'windowClass': 'my-class' }).result.then((responseIfYes) => {
      this.myTaxportalService.deleteClient(dataItem.clientId).then((response) => {
        this.getList();
        this.messageService.showMessage('Client deleted successfully.', 'success');
      })
    }, (responseIfNo) => {

    });
  }

  /**
   * @author Ravi Shah
   * Pass Selected Client on Close of Dialog
   * @memberof ClientListComponent
   */
  public selectedClients() {
    let selectedClients = this.myTaxportalClientList.getSelectedValue || [];
    if (selectedClients.length > 0) {
      this.activeModal.close(selectedClients);
    } else {
      this.messageService.showMessage('Please select atleast one client(s) in order to send invitation', 'error');
    }
  }



  /**
   * @author Ravi Shah
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberof ClientListComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "FIRST NAME",
          field: "firstName",
          width: 200,
          checkboxSelection: (params) => {
            // @pending DISABLED
            if (params.data.email && !this._emailPattern.test(params.data.email || '')) {
              // INVALID EMAIL
              return false;
            } else if (!params.data.firstName || !params.data.lastName || !params.data.email || !params.data.SSN) {
              // INCOMPLETE EMAIL
              return false;
            }
            return true;
          },
          cellRenderer: (params) => {
            let element = ''
            if (params.data.email && !this._emailPattern.test(params.data.email || '')) {
              // INVALID EMAIL
              element += `<img class="cursor_pointer mr-3" src="taxAppJs/images/error-icon.png" title="Client's e-mail address is invalid.">`
            } else if (!params.data.firstName || !params.data.lastName || !params.data.email || !params.data.SSN) {
              // INCOMPLETE DATA
              element += `<img class="cursor_pointer mr-3" src="taxAppJs/images/error-icon.png" title="Client details are incomplete. First Name, Last Name, E-mail and SSN are mandatory.">`
            }
            element += `<span>${params.value}</span>`;
            if (this.selectedRowData.includes(params.data.clientId)) {
              params.node.setSelected(true);
            }
            return element;
          }
        },
        {
          headerName: "LAST NAME",
          field: "lastName",
          width: 200
        },
        {
          headerName: "EMAIL",
          field: "email",
          width: 200
        },
        {
          headerName: "PHONE NUMBER",
          field: "phone",
          width: 200
        },
        {
          headerName: "SSN",
          field: "SSN",
          width: 180
        },
        {
          headerName: "ACTIONS",
          width: 175,
          sortable: false,
          suppressMovable: true,
          cellClass: 'ag-grid-action-wrapper',
          type: 'rowActionRenderer',
          cellRenderer: (params) => {
            let conditionalClass = this.permission.canSaveClient && !params.data.isDisabled ? '' : 'no-clicking disabled';
            return `
            <button class="btn-sm float-left btn-outline-primary btn mr-2 ${conditionalClass}" data-action-type="editClient"><i class="fa fa-edit mr-2"></i>Edit</button>
            <button class="btn-sm float-left btn-outline-primary btn ${conditionalClass}" data-action-type="deleteClient"><i class="fa fa-trash mr-2"></i>Delete</button>
            `
          }
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this),
      rowClassRules: {
        'no-clicking': (params) => {
          return params.data.isDisabled
        }
      }
    }
  }

  ngOnInit() {
    this.selectedRowData = this.data.map(t => t.clientId);
    this.gridOptions = this._gridOptions;
    this.permission = {
      canSaveClient: this.userService.can('CAN_SAVE_CLIENT')
    }
  }
}

