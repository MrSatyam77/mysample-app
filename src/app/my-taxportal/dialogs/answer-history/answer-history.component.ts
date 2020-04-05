/** External import */
import { Component, OnInit } from '@angular/core';
/** Internal import */
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';

@Component({
  selector: 'app-answer-history',
  templateUrl: './answer-history.component.html',
  styleUrls: ['./answer-history.component.scss']
})
export class AnswerHistoryComponent implements OnInit {
  data: any;
  gridOptions: GridOptions;
  gridApi: any;
  public rowData: any;
  /**
   * @author Hitesh Soni
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberof AnswerHistoryComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "Field Name",
          field: "name"
        },
        {
          headerName: "Old Value",
          cellRenderer: function (params) {
            if (params.data.name.indexOf('Documents') === -1) {
              return params.data.oldValue;
            }
            else {
              let documents = "";
              params.data.oldValue.forEach(element => {
                documents += `<div><a class='cursor_pointer uploaded_tag_card' data-action-type='downloadDocument' data-value='${element.docId}'>${element.fileName}</a></div>`;
              });
              return documents;
            }
          }
        },
        {
          headerName: "New Value",
          cellRenderer: function (params) {
            if (params.data.name.indexOf('Documents') === -1) {
              return params.data.newValue;
            }
            else {
              let documents = "";
              params.data.newValue.forEach(element => {
                documents += `<div><a class='cursor_pointer uploaded_tag_card' data-action-type='downloadDocument' data-value='${element.docId}'>${element.fileName}</a></div>`;
              });
              return documents;
            }
          }
        },
        {
          headerName: "Date",
          field: "changeDate"
        }
      ]
    }
  }

  constructor(
    private activeModal: NgbActiveModal,
    private myTaxportalService: MyTaxportalService
  ) { }


  /** Close dialog */
  close() {
    this.activeModal.close();
  }

  /**
   * @author Hitesh Soni
   * On Grid is Ready Call Api For the Data
   * @param {*} params
   * @memberof ClientListComponent
   */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.rowData = this.myTaxportalService.processHistoryData(this.data);
    params.api.sizeColumnsToFit(); 
  }

  /**
   * @author Hitesh Soni
   * On Grid is Ready Call Api For the Data
   * @param {docId} params
   * @memberof ClientListComponent
   */
  download(docId) {
    this.myTaxportalService.downloadDocument(docId).then((response: any) => {
      if (response) {
        let blob = this.myTaxportalService.b64toBlob(response.base64Data, response.contentType);
        let dlink = document.createElement('a');
        dlink.download = response.fileName;
        dlink.href = URL.createObjectURL(blob);
        dlink.onclick = function (e) {
          // revokeObjectURL needs a delay to work properly
          let that = this;
          setTimeout(function () {
            window.URL.revokeObjectURL(that['href']);
          }, 1000);
        };
        dlink.click();
        dlink.remove();
      }
    });
  }

  /**
   * @author Hitesh Soni
   * Download document
   * @param param0 
   */
  onActionClicked({ actionType, dataItem, node, value }) {
    if (actionType === "downloadDocument") {
      this.download(value);
    }
  }

  ngOnInit() {
    this.gridOptions = this._gridOptions
  }
}
