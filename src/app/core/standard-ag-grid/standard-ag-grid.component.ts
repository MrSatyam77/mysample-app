import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { StandardAgGridService } from './standard-ag-grid.service';
import { PdfMakeWrapper } from 'pdfmake-wrapper';


@Component({
  selector: 'app-standard-ag-grid',
  templateUrl: './standard-ag-grid.component.html',
  styleUrls: ['./standard-ag-grid.component.scss'],
  providers: [StandardAgGridService]
})
export class StandardAgGridComponent implements OnInit {

  @Input() uniqueKey: string = 'id';
  @Input() result: any = [];
  @Input() defaultFilter: any = {};
  @Input() gridOptions: GridOptions = {};
  @Input() rowSelection: string = 'single';
  @Input('name') gridName: string;
  @Input() className: string = 'ag-standard-grid-container-wrapper';

  @Input() filter: any = {};
  @Output('filterChange') filterChange: EventEmitter<any> = new EventEmitter<any>();

  @Output('onStandardGridReady') ready: EventEmitter<any> = new EventEmitter<any>();
  @Output('onCellClick') cellClick: EventEmitter<any> = new EventEmitter<any>();
  @Output('action') action: EventEmitter<any> = new EventEmitter<any>();
  @Input() configuration: any = {
    selection: {
      mode: 'single',
      checkbox: false,
      headerCheckbox: false
    }
  }

  public firstChange: boolean = true;

  /**
   * @author Ravi Shah
   * For the Responsive Ag Grid
   * @param {*} event
   * @memberof StandardAgGridComponent
   */
  onGridSizeChanged(event: any) {
    // Fit the Grid Column Size only for Desktop, Laptops else for tablets and mobile phone we will have vertical scroll with touch UI
    if (window.innerWidth >= 768) {
      event.api.sizeColumnsToFit();
    }
  }

  private disableClickSelectionRenderers = ['rowActionRenderer'];
  // private defaultConfiguration: any = {
  //   selection: {
  //     mode: 'single',
  //     checkbox: true,
  //     headerCheckbox: false
  //   }
  // }
  private gridApi: any;
  private gridColumnApi: any;

  constructor(private standardAgGridService: StandardAgGridService) { }

  /**
   * @author Ravi Shah
   * Call on cell focused
   * @param {*} e
   * @memberof SimpleAgGridComponent
   */
  onCellFocused(e) {
    // if (e.column && e.column.colDef && e.column.colDef.type && this.disableClickSelectionRenderers.includes(e.column.colDef.type)) {
    // e.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = true;
    // }
  }

  /**
   * @author Ravi Shah
   * Get Selected Value
   * @readonly
   * @type {string}
   * @memberof StandardAgGridComponent
   */
  public get getSelectedValue(): Array<any> {
    return this.gridApi.getSelectedRows();
  }

  /**
   * @author Ravi Shah
   * Emit the action click event
   * @param {*} e
   * @memberof SimpleAgGridComponent
   */
  public onRowClicked(e) {
    if (e.event.target) {
      const actionType = e.event.target.getAttribute('data-action-type');
      const dataValue = e.event.target.getAttribute('data-value');
      if (actionType) {
        this.action.emit({ actionType: actionType, dataItem: e.data, node: e.node, value: dataValue });
      }
    }
    e.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = false;
  }

  /**
   * @author Ravi Shah
   * Emit Events on the Grid Ready and pass the instance of the grid
   * @param {*} event
   * @memberof SimpleAgGridComponent
   */
  public onGridReady(event: any) {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;

    // Store Default Grid State
    this.standardAgGridService.maintainDefaultGridState(this.gridName, this.getGridState());

    // Set Stored Grid State
    this.ready.emit(event);
  }

  /**
   * @author Ravi Shah
   * On Selection Change
   * @param {*} event
   * @memberof SimpleAgGridComponent
   */
  onSelectionChanged(event: any) {
    // if (this.configuration.selection.checkbox) {
    const selectedRowData = event.api.getSelectedRows();
    this.cellClick.emit(selectedRowData);
    // }
  }

  /**
   * @author Ravi Shah
   * Search The Text into the whole grid
   * @param {*} searchText
   * @memberof SimpleAgGridComponent
   */
  public quickFilter(searchText: any) {
    this.gridApi.setQuickFilter(searchText);
    return this.gridOptions.api.getDisplayedRowCount();
  }

  public setRowData(data: any, rowNode: any) {
    if (rowNode) {
      rowNode.setData(data);
    }
  }

  /**
   * @author Ravi Shah
   * External Filter for the External Fields
   * @memberof StandardAgGridComponent
   */
  public externalFilter() {
    this.gridApi.onFilterChanged();
  }

  /**
   * @author Ravi Shah
   * Save Grid State
   * @returns
   * @memberof StandardAgGridComponent
   */
  public saveGridState() {
    return new Promise((resolve, reject) => {
      let gridStateSettings = this.standardAgGridService.removeEmpty(this.getGridState());
      this.standardAgGridService.saveGridSettings({ module: this.gridName, gridPref: gridStateSettings }).then(() => {
        resolve(true);
      }, error => {
        reject(error);
      });
    })
  }

  /**
   * @author Ravi Shah
   * Get Default Grid State
   * @returns
   * @memberof StandardAgGridComponent
   */
  public defaultGridState() {
    return new Promise((resolve, reject) => {
      this.setGridState(this.standardAgGridService.getDefaultGridState(this.gridName));
      this.filter = JSON.parse(JSON.stringify(this.defaultFilter));
      this.filterChange.emit(this.defaultFilter || {});
      this.saveGridState().then(() => {
        resolve(true);
      }, error => {
        reject(error);
      });;
    });
  }

  /**
   * @author Ravi Shah
   * SetGrid State which get from the Database
   * @memberof StandardAgGridComponent
   */
  public setGridState(params: any) {
    params = params ? params : {};
    this.gridColumnApi.setColumnState(params.colState || []);
    this.gridColumnApi.setColumnGroupState(params.groupState || []);
    this.gridApi.setSortModel(params.sortState || []);
    this.gridApi.setFilterModel(params.filterState || {});
  }

  /**
   * @author Ravi Shah
   * Get Grid State 
   * @param {*} event
   * @memberof StandardAgGridComponent
   */
  private getGridState() {
    let colState = this.gridColumnApi.getColumnState();
    let groupState = this.gridColumnApi.getColumnGroupState();
    let sortState = this.gridApi.getSortModel();
    let filterState = this.gridApi.getFilterModel();
    let userFilter = JSON.parse(JSON.stringify(this.filter || {}));
    return {
      colState,
      groupState,
      sortState,
      filterState,
      userFilter
    }
  }

  /**
   * @author Ravi Shah
   * Export the CSV and 
   * @param {string} format
   * @param {*} params
   * @memberof SimpleAgGridComponent
   */
  public exportGrid(format: string, params?: any) {
    if (params) { params.allColumns = true; params.rowHeight = '18px'; }
    switch (format) {
      case 'excel':
        this.gridApi.exportDataAsExcel(params);
        break;
      case 'csv':
        this.gridApi.exportDataAsCsv(params);
        break;
      case 'pdf':
        this.printPdf(params);
        break;
      default:
        console.error("Invalid Export Format");
        break;
    }
  }

  printPdf(params): void {
    let pdfWrapper = new PdfMakeWrapper();
    const records = [];
    const columnHeader = [];
    const newBody: any = [];
    this.gridOptions.columnDefs.forEach((columns: any) => {
      if (params.columnKeys.includes(columns.field)) {
        columnHeader.push({
          text: columns.headerName,
          field: columns.field,
          style: 'tableHeader'
        })
      }
    });
    this.gridApi.forEachNodeAfterFilter(function (rowNode, index) {
      let temp: any = [];
      columnHeader.forEach((columnDefinition) => {
        temp.push({
          text: rowNode.data[columnDefinition.field]
        });
      })
      records.push(temp);
    });

    newBody.push(columnHeader);
    let body = newBody.concat(records);
    const content = []; // to hold enitire content of pdf
    content.push({ table: { body: body, widths: '*' }, layout: 'lightHorizontalLines' });
    pdfWrapper.pageSize('A4');
    pdfWrapper.footer((currentPage, pageCount) => {
      return currentPage.toString() + ' of ' + pageCount;
    });
    pdfWrapper.pageMargins([10, 10, 10, 10]);
    pdfWrapper.styles({
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'black',
        fillColor: '#eaeaea'
      }
    });
    pdfWrapper.defaultStyle({ fontSize: 10 });
    const iOS = (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
    if (iOS === true) {
      pdfWrapper.add(body);
      pdfWrapper.create().open();
    } else {
      pdfWrapper.add(content);
      pdfWrapper.create().download(`${params.fileName}.pdf`);
      // this.pdfWrapper.create(docDefinition).download("KeyBoardShortcutList" + ".pdf");
    }
  }

  /**
   * @author Ravi Shah
   * Changes call when changes in the parent attributes
   * @param {SimpleChanges} changes
   * @memberof SimpleAgGridComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    // Watch Changes in the Grid Options
    if (changes.gridOptions && (changes.gridOptions.firstChange || this.standardAgGridService.checkObjectEquals(changes.gridOptions.previousValue || {}, changes.gridOptions.currentValue || {}))) {
      this.gridOptions = this.standardAgGridService.overrideProperties(this.gridOptions);
    }
  }

  /**
   * @author Ravi Shah
   * Call on Initialization of the Grid
   * @memberof StandardAgGridComponent
   */
  ngOnInit() {
    this.gridOptions = this.standardAgGridService.overrideProperties(this.gridOptions);
  }
}
