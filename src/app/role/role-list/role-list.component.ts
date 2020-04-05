/** External Import */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { GridOptions } from 'ag-grid-community';

/** Internal Import */
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { DialogService } from '@app/shared/services/dialog.service';
import { MessageService } from '@app/shared/services/message.service';
import { RoleService } from '@app/role/role.service';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {

  @ViewChild('roleList', { static: false }) roleList: StandardAgGridComponent;

  //private variable
  private gridApi: any;

  //public variable
  public gridOptions: GridOptions;
  public rowData: any;
  public filter: any = { searchText: '', status: 'All' };
  public selctedRowCount: number = 0; // stores selected row count
  // public isSelected:boolean;

  constructor(private roleservice: RoleService,
    private userService: UserService,
    private router: Router,
    private dialogService: DialogService,
    private messageService: MessageService) { }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description grid data
* @memberof roleComponent
*/
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getAvailableRolesList();
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description make grid 
* @memberof roleComponent
*/
  private get _gridOptions(): GridOptions {
    return {
      isRowSelectable: (params) => {
        return !this.userService.can('CAN_REMOVE_ROLE') || !params.data.isPredefined;
      },
      columnDefs: [
        {
          headerName: "ROLES",
          field: "name",
          width: 400,
          tooltipField: '',
          suppressMovable: true,
          checkboxSelection: true,
          sort: 'asc',
          cellRenderer: (params: any) => {
            return `
            <a class="text-primary" data-action-type="redirectRole">${params.data.name}</a>`;
          },
        },
        {
          headerName: "DESCRIPTION",
          field: "description",
          width: 400,
          sortable: false,
          tooltipField: '',
        },
        {
          headerName: 'ACTIONS',
          width: 400,
          sortable: false,
          tooltipField: '',
          cellClass: 'ag-grid-action-wrapper',
          cellRenderer: (params: any) => {
            let conditionalClass = !this.userService.can('CAN_REMOVE_ROLE') || params.data.isPredefined ? 'no-clicking disabled' : '';
            return `<div class="dropdown">
          <button type="button" class="btn btn-outline-primary dropdown-toggle" data-toggle="dropdown">
              <i class="fas fa-cog" ></i>
          </button>
          <div class="dropdown-menu">
              <a class="dropdown-item ${conditionalClass}"  data-action-type="deletedata">Delete</a>
          </div>
      </div>`}
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    }
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description available role list
* @memberof roleComponent
*/
  private getAvailableRolesList() {
    this.roleservice.getAvailableRoles({ role: true }).then((result: any) => {
      this.rowData = result;
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description action clicked delete redire role data
* @memberof roleComponent
*/
  public onActionClicked({ actionType, dataItem }) {
    switch (actionType) {
      case 'deletedata':
        this.singleDelete(dataItem);
        break;
      case 'redirectRole':
        this.redirectRoleData(dataItem);
        break;
      default:
        break;
    }
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description filter 
* @memberof roleComponent
*/
  private externalFilterStatus(node: any) {
    if (this.filter.status !== 'All') {
      return node.data.type && node.data.type.toLowerCase() === this.filter.status.toLowerCase();
    }
    return true;
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description search grid data
* @memberof roleComponent
*/
  quickSearch(searchText: string) {
    this.roleList.quickFilter(searchText);
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description redirect edit mode
* @memberof roleComponent
*/
  private redirectRoleData(dataItem: any) {
    this.router.navigateByUrl("role/edit/" + dataItem.key);
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description delete role
* @memberof roleComponent
*/
  public multipleDelete() {
    let roleRemoveId: any = this.roleList.getSelectedValue.map(t => t.key);
    this.dialogService.confirm({ text: 'This role may assigned to any user. Please check before deleting it.', title: 'Confirmation' }, { 'keyboard': false, 'backdrop': false, 'size': 'mf', 'windowClass': 'my-class' }).result.then((responseIfYes) => {
      this.roleservice.removeRoles({ 'roleIds': roleRemoveId }).then((response) => {
        this.messageService.showMessage('Remove successfully', 'success', 'ROLELISTCONTROLLER_REMOVESUCCESS');
        this.getAvailableRolesList();
      })
    }, (error) => {
    });
  }

  /**
   * @author Ravi Shah
   * Single Delete Function
   * @param {*} [dataItem]
   * @memberof RoleListComponent
   */
  public singleDelete(dataItem?: any) {
    let roleRemoveId: any = [dataItem.key];
    this.dialogService.confirm({ text: 'This role may assigned to any user. Please check before deleting it.', title: 'Confirmation' }, { 'keyboard': false, 'backdrop': false, 'size': 'mf', 'windowClass': 'my-class' }).result.then((responseIfYes) => {
      this.roleservice.removeRoles({ 'roleIds': roleRemoveId }).then((response) => {
        this.messageService.showMessage('Remove successfully', 'success', 'ROLELISTCONTROLLER_REMOVESUCCESS');
        this.getAvailableRolesList();
      })
    }, (error) => {
    });
  }


  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description privilege
* @memberof roleComponent
*/
  public userCan(privilege) {
    return this.userService.can(privilege);
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description redirect to home page
* @memberof roleComponent
*/
  public gotoHome() {
    this.router.navigate(["home"]);
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description create new role
* @memberof roleComponent
*/
  public createNewRole() {
    this.router.navigate(["role/edit"]);
  }

  public cellClick(selectedRows: any) {
    this.selctedRowCount = selectedRows.length;
  }

  ngOnInit() {
    this.gridOptions = this._gridOptions;
  }

}
