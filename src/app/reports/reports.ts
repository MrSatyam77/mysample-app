import { GridOptions } from 'ag-grid-community';

export interface ReportGridData {
    data: Array<any>,
    columnDefs: Array<any>
}

export const defaultGridConfiguration: GridOptions = {
    defaultColDef: {
        sortable: true,
        hide: false,
        resizable: true,
        autoHeight: true
    },
    rowSelection: "single"
}