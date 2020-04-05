import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, ViewEncapsulation } from '@angular/core';
import { SimpleAgGridService } from './simple-ag-grid.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-simple-ag-grid',
  templateUrl: './simple-ag-grid.component.html',
  styleUrls: ['./simple-ag-grid.component.scss'],
  providers: [SimpleAgGridService],
  encapsulation: ViewEncapsulation.None
})
export class SimpleAgGridComponent implements OnInit, OnChanges {

  @Input() columnDefination: ColDef[];
  @Input() result: any = [];
  @Input() pagination: boolean = false;
  @Output('onSimpleGridReady') ready: EventEmitter<any> = new EventEmitter<any>();
  @Output('onCellClick') cellClick: EventEmitter<any> = new EventEmitter<any>();
  @Output('action') action: EventEmitter<any> = new EventEmitter<any>();



  @Input() configuration: any = {
    selection: {
      mode: 'multiple',
      checkbox: true,
      headerCheckbox: true
    }
  }


  public defaultColDef = { sortable: true };
  private disableClickSelectionRenderers = ['rowActionRenderer'];
  private defaultConfiguration: any = {
    selection: {
      mode: 'single',
      checkbox: true,
      headerCheckbox: true
    }
  }
  public gridApi: any;

  constructor(private simpleAgGridService: SimpleAgGridService) { }

  /**
   * @author Ravi Shah
   * Call on cell focused
   * @param {*} e
   * @memberof SimpleAgGridComponent
   */
  onCellFocused(e) {
    if (e.column && this.disableClickSelectionRenderers.includes(e.column.colDef.cellRenderer)) {
      e.api.gridOptionsWrapper.gridOptions.suppressRowClickSelection = true;
    }
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
      if (actionType) {
        this.action.emit({ actionType: actionType, dataItem: e.data })
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
    event.api.sizeColumnsToFit();
    this.gridApi = event.api;
    this.ready.emit(event);
  }

  /**
   * @author Ravi Shah
   * On Selection Change
   * @param {*} event
   * @memberof SimpleAgGridComponent
   */
  onSelectionChanged(event: any) {
    const selectedRowData = this.gridApi.getSelectedRows();
    this.cellClick.emit(selectedRowData);
  }

  /**
   * @author Ravi Shah
   * Search The Text into the whole grid
   * @param {*} searchText
   * @memberof SimpleAgGridComponent
   */
  public quickFilter(searchText: any) {
    this.gridApi.setQuickFilter(searchText);
  }

  /**
   * @author Ravi Shah
   * Set Default Configuration for the Ag Grid
   * @private
   * @memberof SimpleAgGridComponent
   */
  private setDefaultConfiguration() {
    // Set Default Configuration
    for (let key in this.defaultConfiguration) {
      if (this.configuration[key]) {
        for (let property in this.defaultConfiguration[key]) {
          if (this.configuration[key][property] === undefined || this.configuration[key][property] === null) {
            this.configuration[key][property] = this.defaultConfiguration[key][property];
          }
        }
      } else {
        this.configuration[key] = this.defaultConfiguration[key];
      }
    }
  }

  /**
   * @author Ravi Shah
   * Overwrite the default properties to the columnDefinition
   * @memberof SimpleAgGridComponent
   */
  private overwriteProperties() {
    let propertiesToOverride: any = this.simpleAgGridService.overrideProperty;
    if (this.columnDefination && this.columnDefination.length > 0) {

      // Over write the properties
      for (let colDef of this.columnDefination) {
        for (let key in propertiesToOverride) {
          colDef[key] = propertiesToOverride[key]
        }
      }

      // Checkbox Rendering for the Selection Mode
      if (this.configuration.selection && (this.configuration.selection.checkbox || this.configuration.selection.mode === 'multiple')) {
        this.columnDefination[0].checkboxSelection = this.simpleAgGridService.renderCheckboxOnRow();
      }
      if (this.configuration.selection && this.configuration.selection.mode === 'multiple' && this.configuration.selection.headerCheckbox) {
        this.columnDefination[0].headerCheckboxSelection = this.simpleAgGridService.renderCheckboxOnHeader();
      }
    }
  }


  /**
   * @author Ravi Shah
   * Export the CSV and 
   * @param {string} format
   * @param {*} params
   * @memberof SimpleAgGridComponent
   */
  exportGrid(format: string, params: any) {
    switch (format) {
      case 'excel':
        this.gridApi.exportDataAsExcel(params);
        break;
      case 'csv':
        this.gridApi.exportDataAsCsv(params);
        break;
      default:
        console.error("Invalid Export Format");
        break;
    }
  }

  /**
   * @author Ravi Shah
   * Changes call when changes in the parent attributes
   * @param {SimpleChanges} changes
   * @memberof SimpleAgGridComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.previousValue !== changes.currentValue) {
      this.setDefaultConfiguration();
      this.overwriteProperties();
    }
  }


  ngOnInit() {
    this.setDefaultConfiguration();
    this.overwriteProperties()
  }
}
