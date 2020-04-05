// External Imports
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { PdfMakeWrapper } from 'pdfmake-wrapper';

// Internal Imports
import { defaultGridConfiguration } from "@app/reports/reports";

@Component({
  selector: 'app-reports-grid',
  templateUrl: './reports-grid.component.html',
  styleUrls: ['./reports-grid.component.scss']
})

export class ReportsGridComponent implements OnInit, OnChanges {
  // Holds row data to be display in grid
  @Input() rowData: Array<any> = [];

  // Holds configuration for grid.
  @Input() colDefinations: Array<ColDef>;

  // holds report name of current report
  @Input() reportName: string;

  // holds grid api refrence to perform operation on grid.
  private gridApi: GridApi;

  constructor() { }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to apply quick serach to grid.
   */
  public applyQuickSearch(searchTerm: string) {
    this.gridApi.setQuickFilter(searchTerm);
  }

  /**
   * @author Hannan Desai
   * @param event 
   * @description 
   *      This function is called when ag grid is rendered successfully.
   */
  public onGridReady(event: any) {
    this.gridApi = event.api;
  }

  // This function called upon a grid size changed , we handle responsive logic here.
  public onGridSizeChanged(event: any) {
    // Fit the Grid Column Size only for Desktop, Laptops else for tablets and mobile phone we will have vertical scroll with touch UI
    if (window.innerWidth >= 768) {
      event.api.sizeColumnsToFit();
    }
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to export grid data in CSV format.
   */
  public exportEXCEL(fileName: string) {
    const params = {
      fileName: fileName,
      onlySelected: false,
      allColumns: true,
      sheetName: fileName,
      rowHeight: 18
    };
    this.gridApi.exportDataAsExcel(params);
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to export grid data in pdf fromat.
   */
  public exportPDF(fileName: string) {
    let pdfWrapper = new PdfMakeWrapper();
    const records = [];
    const columnHeader = [];
    const newBody: any = [];
    this.colDefinations.forEach((columns: any) => {
      columnHeader.push({
        text: columns.headerName,
        field: columns.field,
        style: 'tableHeader'
      })
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
    content.push({ table: { body: body }, layout: 'lightHorizontalLines' });
    pdfWrapper.pageSize('A3');
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
      pdfWrapper.create().download(`${fileName}.pdf`);
      // this.pdfWrapper.create(docDefinition).download("KeyBoardShortcutList" + ".pdf");
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit() {
  }

}
