import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DialogService } from '@app/shared/services';
import { ClientListComponent } from '@app/my-taxportal/dialogs/client-list/client-list.component';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-select-clients',
  templateUrl: './select-clients.component.html',
  styleUrls: ['./select-clients.component.scss']
})
export class SelectClientsComponent implements OnInit {

  public selectedClients: any = [];
  private gridApi: any;
  public gridOptions: GridOptions;
  public rowData: any;
  @Output() onClientSelect: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialogService: DialogService) { }

  @Input() settings: any = {};

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.setRowData(this.selectedClients);
  }

  /**
   * @author Ravi Shah
   * Open The Select Client List
   * @memberof SelectClientsComponent
   */
  public selectClients() {
    this.dialogService.custom(ClientListComponent, this.selectedClients || [], { 'keyboard': false, 'backdrop': false, 'size': 'xlg', 'windowClass': 'my-class' }).result.then((result) => {
      if (result !== false) {
        if (result && result.length > 0) {
          this.selectedClients = result;
          this.settings.invEmailTo = this.selectedClients.map(t => t.email).toString();
          if (this.gridApi) {
            this.gridApi.setRowData(result);
          }
        } else {
          this.selectedClients = [];
          this.settings.invEmailTo = '';
        }
        this.onClientSelect.emit(result || []);
      }
    })
  }

  public onActionClicked({ actionType, dataItem, node }) {
    switch (actionType) {
      case 'deleteSelectedClient':
        this.dialogService.confirm({ text: 'Are you sure you want to delete client?', title: 'Confirmation' }, {}).result.then((response) => {
          this.selectedClients.splice(node.rowIndex, 1);
          this.gridApi.setRowData(this.selectedClients);
          this.settings.invEmailTo = (this.selectedClients && this.selectedClients.length > 0) ? this.selectedClients.map(t => t.email).toString() : undefined;
          this.onClientSelect.emit(this.selectedClients || []);
        }, (responseIfNo) => {

        });
        break;
      default:
        break;
    }
  }


  /**
   * @author Ravi Shah
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberof SelectClientsComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "FIRST NAME",
          field: "firstName",
          width: 200
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
          field: "SSN",
          width: 180,
          cellRenderer: (params) => {
            return '<button class="cursor_pointer btn btn-sm btn-outline-primary" data-action-type="deleteSelectedClient"><i class="fas fa-trash"></i> Delete</button>';
          }
        }
      ]
    }
  }

  ngOnInit() {
    this.gridOptions = this._gridOptions;
  }

}
