import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, MessageService, DialogService } from '@app/shared/services';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { MyTaxportalService } from '../my-taxportal.service';
import { InvitationLinkComponent } from '../dialogs/invitation-link/invitation-link.component';
import { ResendInvitationEmailComponent } from '../dialogs/resend-invitation-email/resend-invitation-email.component';
import { ChangeSsnComponent } from '../dialogs/change-ssn/change-ssn.component';
import { ResendInvitationSmsComponent } from '../dialogs/resend-invitation-sms/resend-invitation-sms.component';
import { ClientQuestionOutlineComponent } from '../dialogs/client-question-outline/client-question-outline.component';


@Component({
  selector: 'app-manage-invited-clients',
  templateUrl: './manage-invited-clients.component.html',
  styleUrls: ['./manage-invited-clients.component.scss']
})
export class ManageInvitedClientsComponent implements OnInit {

  private gridApi: any;
  public settings: any = {};
  public gridOptions: GridOptions;
  public rowData: any;
  public defaultFilter: any = { searchText: '', userType: '', readType: '' };
  public filter: any = { searchText: '', userType: '', readType: '' };
  public returnTypes: any = [];
  public refreshStart: boolean = false;
  public interval: any;
  private refreshInterval: any = 30000;
  public showManageClientScreenBasedOnTaxYear: boolean;
  public taxYear: any;
  public isApiCalled: any;

  @ViewChild('myTaxportalManageInvitedClient', { static: false }) myTaxportalManageInvitedClient: StandardAgGridComponent;

  constructor(private router: Router, private myTaxportalService: MyTaxportalService, private userService: UserService, private messageService: MessageService, private dialogService: DialogService) { }



  /**
   * @author Ravi Shah
   * On Grid is Ready Call Api For the Data
   * @param {*} params
   * @memberof ManageInvitedClientsComponent
   */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getList();
  }
  /**
   * @author Ravi Shah
   * to get list
   * @memberof ManageInvitedClientsComponent
   */
  public getList(manualRefresh?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.settings && this.settings.companyName) {
        this.myTaxportalService.getAllInvitedClients().then((result: any) => {
          this.rowData = result.data || [];
          this.refreshStart = false;
          if (!manualRefresh && result.gridPref && Object.keys(result.gridPref).length > 0) {
            this.loadGridState(result.gridPref || {});
          }
          resolve(result);
        }, (error) => {
          console.error(error);
          reject(error);
        });
      } else {
        this.rowData = [];
        this.refreshStart = false;
        resolve([]);
      }
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
    this.myTaxportalManageInvitedClient.setGridState(gridPref || {});
    this.quickSearch(this.filter.searchText)
    this.externalFilter();
  }


  /**
   * @author Ravi Shah
   * Call The Standard Grid Function for the Quick Search in Ag grid
   * @param {string} searchText
   * @memberof ManageInvitedClientsComponent
   */
  quickSearch(searchText: string) {
    this.myTaxportalManageInvitedClient.quickFilter(searchText);
  }

  /**
   * @author Ravi Shah
   * Call the Standard Grid Function for the External Filters
   * @memberof ManageInvitedClientsComponent
   */
  externalFilter() {
    this.myTaxportalManageInvitedClient.externalFilter();
  }

  /**
   * @author Ravi Shah
   * External Filter Handler
   * @private
   * @param {*} node
   * @returns
   * @memberof ManageInvitedClientsComponent
   */
  private externalFilterStatus(node: any) {
    let isMarkAsUnread = true;
    let isActiveOrInActive = true;

    if (this.filter.readType === 'true' || this.filter.readType === 'false') {
      if (this.filter.readType === 'true') {
        isMarkAsUnread = !node.data.markAsUnRead;
      } else {
        isMarkAsUnread = node.data.markAsUnRead;
      }
    }
    if (this.filter.userType === 'true' || this.filter.userType === 'false') {
      if (this.filter.userType === 'true') {
        isActiveOrInActive = node.data.isActiveClient;
      } else {
        isActiveOrInActive = !node.data.isActiveClient;
      }
    }
    return isMarkAsUnread && isActiveOrInActive;
  }

  /**
   * @author Ravi Shah
   * Action Click Handler
   * @param {*} { actionType, dataItem, node }
   * @memberof ManageInvitedClientsComponent
   */
  public onActionClicked({ actionType, dataItem, node }) {
    switch (actionType) {
      case 'copyClientPortalLink':
        this.copyClientPortalLink(dataItem)
        break;
      case 'sendInvitationTextMessage':
        this.sendInvitationTextMessage(dataItem);
        break;
      case 'viewQuestionOutline':
        this.viewQuestionOutline(dataItem, node)
        break;
      case 'resendToInviteClient':
        this.resendToInviteClient(dataItem, node);
        break;
      case 'changeSsnOfInviteClient':
        this.changeSsnOfInviteClient(dataItem, node)
        break;
      case 'activeInactiveClient':
        this.activeInactiveClient(dataItem, node);
        break;
      case 'deleteInvitedClient':
        this.deleteInvitedClient(dataItem);
        break;
      default:
        break;
    }
  }

  /**
   * @author Ravi Shah
   * Change the status of the Client to Active/Inactive Client
   * @private
   * @param {*} dataItem
   * @param {*} node
   * @memberof ManageInvitedClientsComponent
   */
  private activeInactiveClient(dataItem: any, node: any) {
    let translateText = `Are you sure you want to ${dataItem.isActiveClient ? 'deactivate' : 'activate'} the client’s status?`;
    const self = this;
    let dialog = self.dialogService.confirm({ text: translateText, title: 'Confirmation' }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((responseIfYes) => {
      this.myTaxportalService.activeInactiveClient(dataItem.clientId, !dataItem.isActiveClient).then((response: any) => {
        dataItem.isActiveClient = !dataItem.isActiveClient;
        this.messageService.showMessage('Client status updated successfully', 'success');
        this.myTaxportalManageInvitedClient.setRowData(dataItem, node);
      });
    }, (responseIfNo) => {

    });
  }

  /**
   * @author Ravi Shah
   * Delete the invited Client
   * @private
   * @param {*} dataItem
   * @memberof ManageInvitedClientsComponent
   */
  private deleteInvitedClient(dataItem: any) {
    let translateText = 'Are you sure you want to delete the client’s invitation?';
    const self = this;
    let dialog = self.dialogService.confirm({ text: translateText, title: 'Confirmation' }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    dialog.result.then((responseIfYes) => {
      self.myTaxportalService.deleteInvitedClient({ clientId: dataItem.clientId, inviteId: dataItem.id, summaryId: dataItem.summaryId, status: dataItem.status }).then(function (response) {
        self.messageService.showMessage('Invitation deleted successfully.', 'success');
        self.getList(true);
      }, function (error) {
        self.messageService.showMessage('Error occured while processing your request.', 'error');
      });
    }, (responseIfNo) => {

    });
  }



  /**
   * @author Ravi Shah
   * open the dialog to see the Invitation Link
   * @private
   * @param {*} dataItem
   * @memberof ManageInvitedClientsComponent
   */
  private copyClientPortalLink(dataItem: any) {
    this.dialogService.custom(InvitationLinkComponent, { link: dataItem.link }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
  }

  /**
   * @author Ravi Shah
   * Call on Resend the invitaion via email
   * @private
   * @param {*} dataItem
   * @memberof ManageInvitedClientsComponent
   */
  private resendToInviteClient(dataItem: any, node: any) {
    this.dialogService.custom(ResendInvitationEmailComponent, { allClients: this.rowData, clientData: dataItem }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }).result.then((response) => {
      if (response) {
        dataItem.email = response;
        this.myTaxportalManageInvitedClient.setRowData(dataItem, node);
        this.messageService.showMessage('The client’s invitation was successfully sent.', 'success');
      }
    });
  }

  /**
   * @author Ravi Shah
   * Change SSN of Invited Client
   * @private
   * @param {*} dataItem
   * @param {*} node
   * @memberof ManageInvitedClientsComponent
   */
  private changeSsnOfInviteClient(dataItem: any, node: any) {
    this.dialogService.custom(ChangeSsnComponent, { allClients: this.rowData, clientData: dataItem }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }).result.then((response) => {
      if (response) {
        dataItem.SSN = response;
        this.myTaxportalManageInvitedClient.setRowData(dataItem, node);
        this.messageService.showMessage("The taxpayer's SSN was successfully updated.", 'success');
      }
    });
  }

  /**
   * @author Hitesh Soni
   * Open Client Questions
   * @private
   * @param {*} dataItem
   * @memberof ManageInvitedClientsComponent
   */
  private viewQuestionOutline(dataItem, node) {
    if (dataItem.questionDocId) {
      if (dataItem.markAsUnRead) {
        this.myTaxportalService.markViewed({ clientId: dataItem.clientId });
        dataItem.markAsUnRead = false;
        this.myTaxportalManageInvitedClient.setRowData(dataItem, node);
      }
      let dialog = this.dialogService.custom(ClientQuestionOutlineComponent, dataItem, { 'keyboard': false, 'backdrop': false, 'size': 'xl', 'windowClass': 'my-class' });
      dialog.result.then((response) => {
        if (response) {
          this.getList(true);
        }
      });
    }

  }

  /**
    * @author Ravi Shah
    * Send Invitation Via SMS
    * @private
    * @param {*} dataItem
    * @memberof ManageInvitedClientsComponent
    */
  private sendInvitationTextMessage(dataItem) {
    var locationId = this.userService.getLocationId(undefined);
    var data = {
      'recipientName': dataItem.firstName + ' ' + dataItem.lastName, 'cellNumber': '', 'message': '', 'clientId': dataItem.clientId,
      'link': dataItem.link, 'locationId': locationId, 'companyName': this.settings.companyName
    };
    this.dialogService.custom(ResendInvitationSmsComponent, data, { 'keyboard': false, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' });
  }


  /**
   * @author Ravi Shah
   * Navigate to Specific Routes
   * @param {*} url
   * @memberof ManageInvitedClientsComponent
   */
  public gotoRoute(url: any) {
    this.router.navigate(url);
  }

  /**
   * @author Ravi Shah
   * Save Grid Settings
   * @memberof ManageInvitedClientsComponent
   */
  saveGridSettings() {
    this.myTaxportalManageInvitedClient.saveGridState().then(() => {
      this.messageService.showMessage('Grid Settings for Manage Invited Client saved successfully.', 'success');
    });
  }

  /**
   * @author Ravi Shah
   * Reset Grid Settings
   * @memberof ManageInvitedClientsComponent
   */
  resetGridSettings() {
    this.myTaxportalManageInvitedClient.defaultGridState().then(() => {
      this.quickSearch(this.filter.searchText);
      this.externalFilter();
      this.messageService.showMessage('Grid Settings for Manage Invited Client reset successfully.', 'success');
    });
  }

  /**
   * @author Ravi Shah
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberof ManageInvitedClientsComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "CLIENTS",
          field: "clientName",
          width: 200
        },
        {
          headerName: "E-MAIL ADDRESS",
          field: "email",
          width: 250
        },
        {
          headerName: "SSN",
          field: "SSN",
          width: 110
        },
        {
          headerName: "INVITATION STATUS",
          field: "text",
          tooltipField: '',
          width: 150,
          cellRenderer: (params: any) => {
            return ` <span class="cursor_pointer ${params.data.className}" title="${params.data.tooltip}">
                          <img class="cursor_pointer" src="${params.data.icon}" alt="${params.data.text}" />
                          ${params.data.text}
                      </span>`
          }
        },
        {
          headerName: "TOTAL QUESTION",
          field: "questionSummary",
          width: 100,
          tooltipField: '',
          sortable: false
        },
        {
          headerName: "INVITATION DATE & TIME",
          field: "invitedDate",
          tooltipField: '',
          width: 180,
          cellRenderer: (params: any) => {
            return `<span>${params.data.invitedDateTime}</span>`;
          }
        },
        {
          headerName: "CLIENT STATUS",
          field: "isActiveClient",
          tooltipField: "clientStatus",
          width: 130,
          cellRenderer: (params: any) => {
            if (params.value) {
              return `<i class="fas fa-check-square" aria-hidden="true"></i> Active`;
            } else {
              return `<i class="fas fa-times-circle" aria-hidden="true"></i> Inactive`;
            }
          }

        },
        {
          width: 86,
          headerName: "ACTIONS",
          field: 'isActiveClient',
          cellClass: 'ag-grid-action-wrapper',
          sortable: false,
          tooltipField: '',
          cellRenderer: (params: any) => {
            let menu = '';
            if (params.data.status && params.data.status !== 'Failed' && params.data.status !== 'Accepted' && params.data.failedReason !== 'CLIENT_EMAIL_EXIST') {
              menu += '<a class="dropdown-item" data-action-type="copyClientPortalLink">Invitation Link</a>';
            }
            if (params.data.status && params.data.status == 'Invited') {
              menu += '<a class="dropdown-item" data-action-type="sendInvitationTextMessage">Send Invitation via SMS</a>';
            }
            if (this.userService.can('CAN_VIEW_CLIENT_QUE')) {
              menu += '<a class="dropdown-item" data-action-type="viewQuestionOutline">View Request</a>';
            }
            if (params.data.isActiveClient && params.data.status != 'Accepted' && params.data.errorCode != 203 && this.userService.can('CAN_VIEW_CLIENT_QUE')) {
              menu += '<a class="dropdown-item" data-action-type="resendToInviteClient">Resend</a>';
            }
            menu += '<a class="dropdown-item" data-action-type="changeSsnOfInviteClient">Change SSN</a>';
            if (this.userService.can('CAN_CHANGE_CLIENT_STATUS')) {
              menu += `<a class="dropdown-item" data-action-type="activeInactiveClient">${params.data.isActiveClient ? 'Deactivate' : 'Activate'}</a>`;
            }
            menu += '<a class="dropdown-item" data-action-type="deleteInvitedClient">Delete</a>';
            return `<div class="dropdown">
            <button class="btn btn-outline-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-cog padding_right_5"></i>
            </button>
            <div class="dropdown-menu">${menu}</div>
          </div>`
          },
          suppressMovable: true
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this),
      rowClassRules: {
        'mark_read_wrapper': (params) => {
          return params.data.markAsUnRead
        }
      }
    }
  }

  /**
   * @author Ravi Shah
   * Get Settings of Client Portal
   * @private
   * @memberof ManageInvitedClientsComponent
   */
  private getSettings() {
    this.myTaxportalService.getSettings().then((result: any) => {
      this.isApiCalled = false;
      this.settings = result;
    }, error => {
      this.isApiCalled = false;
    })
  }

  /**
   * @author Ravi Shah
   * Component Initailization
   * @memberof ManageInvitedClientsComponent
   */
  ngOnInit() {
    this.isApiCalled = true;
    this.taxYear = this.userService.getTaxYear();
    this.showManageClientScreenBasedOnTaxYear = this.myTaxportalService.canClientPortalAccess();
    if (this.showManageClientScreenBasedOnTaxYear) {
      this.getSettings();
      this.gridOptions = this._gridOptions;
      const self = this;
      self.interval = setInterval(() => {
        self.getList(true);
      }, self.refreshInterval);
    } else {
      this.isApiCalled = false;
    }
  }

  /**
   * @author Ravi Shah
   * Destroy Initialize
   * @memberof ManageInvitedClientsComponent
   */
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined;
    }
  }
}
