//External imports 
import { Component, OnInit, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { UploadInput, UploadOutput, UploaderOptions } from 'ngx-uploader';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { MessageService } from '@app/shared/services';
import { environment } from '@environments/environment';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { UtilityService, SystemConfigService } from '@app/shared/services';

//Internal imports
import { UserService } from '@app/shared/services/user.service';
import { RestoreReturnService } from './restore-return.service';

@Component({
  selector: 'app-restore-return',
  templateUrl: './restore-return.component.html',
  styleUrls: ['./restore-return.component.scss'],
  providers: [RestoreReturnService]
})
export class RestoreReturnComponent implements OnInit {
  @ViewChild('restoreReturnList', { static: false }) restoreReturnList: StandardAgGridComponent;

  // public variables
  public disabledUpload: boolean = false; // upload flag
  public errorType: string = '';  // file type
  public gridOptions: GridOptions;
  public rowData: any;  // bind grid-data
  public uploadProgressDetail: any = {}; // upload progress details
  public returnList: any = [];
  public filter: any = { searchText: '', status: 'All' };
  public returnTypes: any = [];

  //private variable
  private files: any = [];
  private gridApi: any;
  private uploadFileData: any; //store upload file data details
  private restoreJobId: any; //store restore job id


  /**File Upload */
  options: UploaderOptions = {
    allowedContentTypes: [
      "application/zip",
      "application/x-zip",
      "application/x-zip-compressed",
      "application/octet-stream",
      "application/x-compress",
      "application/x-compressed",
      "multipart/x-zip"
    ],
    concurrency: 1
  };
  acceptedFileType: string;
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  @ViewChild('uploader', { static: false }) uploaderInput: ElementRef;


  constructor(private messageService: MessageService,
    private router: Router,
    private userService: UserService,
    private utilityService: UtilityService,
    private systemConfigService: SystemConfigService,
    private restoreReturnService: RestoreReturnService) { }

  /**
   * @author Satyam Jasoliya
   * @description On Grid is Ready Call Api For the Data
   * @date 18-oct-2019
   * @param {*} params
   * @memberof RestoreReturnComponent
   */
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.rowData = JSON.parse(JSON.stringify(this.returnList));
    this.gridApi.setRowData(this.rowData);
  }

  /**
 * @author Satyam Jasoliya
 * @description External Filter Handler
 * @date 18-oct-2019
 * @memberof RestoreReturnComponent
 */
  private externalFilterStatus(node: any) {
    if (this.filter.status !== 'All') {
      return node.data.type && node.data.type.toLowerCase() === this.filter.status.toLowerCase();
    }
    return true;
  }

  /**
   * @author Satyam Jasoliya
   * @description Call The Standard Grid Function for the Quick Search in Ag grid
   * @param {string} searchText
   * @date 18-oct-2019
   * @memberof RestoreReturnComponent
   */
  quickSearch(searchText: string) {
    this.restoreReturnList.quickFilter(searchText);
  }

  /**
  * @author Satyam Jasoliya
  * @description Call the Standard Grid Function for the External Filters
  * @date 18-oct-2019
  * @memberof RestoreReturnComponent
  */
  externalFilter() {
    this.restoreReturnList.externalFilter();
  }

  /**
     * @author Satyam Jasoliya
     * @description Get the Grid Options for the Bank Application List
     * @date 18-oct-2019
     * @type {GridOptions}
     * @memberof RestoreReturnComponent
     */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: "SSN/EIN",
          field: "ssnOrEin",
          width: 203,
          suppressMovable: true,
          checkboxSelection: (params) => {
            if (params.data.isSuccess === true || params.data.isSuccess === false) {
              return false;
            }
            return true;
          },
          headerCheckboxSelection: true,
          cellRenderer: (params: any) => {
            if (params.data.isSuccess === true) {
              return `<i class="fas fa-check color_green mr-3"></i> ${params.value}`;
            } else if (params.data.isSuccess === false) {
              return `<i class="fas fa-times color_red mr-3"></i> ${params.value}`;
            } else {
              return params.value;
            }
          }
        },
        {
          headerName: "TAXPAYER NAME",
          field: "taxPayerName",
          width: 400
        },
        {
          headerName: "PHONE NUMBER",
          field: "homeTelephone",
          width: 200
        },
        {
          headerName: "TYPE",
          field: "type",
          width: 200,
          cellRenderer: (params: any) => {
            return params.data.type ? params.data.type.toUpperCase() : '';
          }
        },
        {
          headerName: "YEAR",
          field: "year",
          width: 180
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    }
  }

  /**
 * @author Ravi Shah
 * Upload the Files Handler
 * @param {UploadOutput} output
 * @memberof RestoreReturnComponent
 */
  onUploadOutput(output: UploadOutput): void {
    // console.log(output);
    if (this.uploaderInput !== undefined && this.uploaderInput.nativeElement !== undefined) {
      this.uploaderInput.nativeElement.value = '';
    }
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      if (!this.disabledUpload && !this.errorType) {
        // 
        // uncomment this if you want to auto upload files when added
        const event: UploadInput = {
          type: 'uploadAll',
          url: `${environment.base_url}/return/restoreReturn/upload`,
          method: 'POST',
          headers: {
            'X-XSRF-TOKEN': JSON.parse(localStorage.getItem('xsrfToken'))
          },
          withCredentials: true,
        };
        this.uploadInput.emit(event);
      } else {
        this.uploadInput.emit({ type: 'removeAll' });
      }
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      if (output.file.size > (50 * 1024 * 1024)) {
        this.errorType = 'size';
      } else {
        this.errorType = '';
        this.files.push(output.file);
        this.uploadProgressDetail = output.file;
      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      this.disabledUpload = true;
    } else if (output.type === 'removed') {
    } else if (output.type === 'rejected') {
      this.errorType = 'fileType';
      this.uploadInput.emit({ type: 'cancel', id: output.file.id });
      this.uploadProgressDetail = output.file;
      //  this.messageService.showMessage(`Attached file with name : ${output.file.name} has invalid type. Please attach a valid file type.`, 'error');
    } else if (output.type === 'dragOver') {
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
    } else if (output.type === 'done') {
      this.disabledUpload = false;
      let isExists = this.files.findIndex(t => t.name === output.file.response.data.fileName && output.file.id === t.id);
      if (output.file.response.code === 2000) {
        this.uploadFileData = output.file.response.data;
        if (this.uploadFileData && this.uploadFileData.returnList && this.uploadFileData.restoreJobId) {
          let listOfReturns = [];
          for (let key in this.uploadFileData.returnList) {
            listOfReturns.push(this.uploadFileData.returnList[key]);
          }
          this.returnList = this.modifyReturnList(listOfReturns);
          this.restoreJobId = this.uploadFileData.restoreJobId;
        }
        // console.log(this.uploadFileData);
        this.uploadProgressDetail = {};
        this.messageService.showMessage('File uploaded successfully', 'success');
        this.errorType = '';

      } else if (output.file.response.code === 4019) {
        this.files.splice(isExists, 1);
        this.errorType = 'invalid';
      } else {
        this.files.splice(isExists, 1);
        this.errorType = 'invalid';
      }
    }
  }

  /**
     * @author Satyam Jasoliya
     * @description * method to modify the return list to array from the object obtained from API
     * this is done to show return list in grid
     * @date 18-oct-2019
     * @memberof RestoreReturnComponent
     */
  private modifyReturnList(returnList: any) {
    const updatedReturnList = [];
    returnList.forEach((returnObj) => {
      if (returnObj) {
        let _packageName = returnObj.packageNames.filter((obj) => {
          return obj !== 'common'
        })[0];
        let taxPayerName = "", ssnOrEinFull = undefined, ssnOrEin = undefined;
        if (_packageName == "1040") {
          let taxpayerFirstName = (returnObj.client.firstName) ? returnObj.client.firstName : '';
          let taxpayerLastName = (returnObj.client.lastName) ? returnObj.client.lastName : "";
          taxPayerName = taxpayerFirstName + " " + taxpayerLastName;
          ssnOrEinFull = returnObj.client.ssn;
          ssnOrEin = ssnOrEinFull.substring(7);
        } else if (_packageName == "1065" || _packageName == "1120" || _packageName == "1120s" || _packageName == "1041" || _packageName == "990") {
          taxPayerName = returnObj.client.companyName;
          ssnOrEinFull = returnObj.client.ein;
          ssnOrEin = ssnOrEinFull.substring(6);
        }
        // Return list structure.
        let returnDetail = {
          checkedOutBy: returnObj.checkedOutBy,
          email: returnObj.email,
          id: returnObj.id,
          isLocked: (returnObj.isLocked == undefined) ? false : returnObj.isLocked,
          isCheckedOut: (returnObj.isCheckedOut == undefined || this.userService.getValue('email') == returnObj.email) ? false : returnObj.isCheckedOut,
          ssnOrEinFull: ssnOrEinFull,
          ssnOrEin: ssnOrEin,
          status: this.userService.getReturnStatusObject(returnObj.status, returnObj, false),
          taxPayerName: taxPayerName,
          type: _packageName,
          year: returnObj.year,
          updatedDate: (returnObj.updatedDate) ? returnObj.updatedDate : "2014-01-01T00:00:00+00:00",
          eFileStatus: returnObj.eFileStatus,
          homeTelephone: (returnObj.client.homeTelephone) ? returnObj.client.homeTelephone : "",
          taxPayerEmail: (returnObj.client.email) ? returnObj.client.email : ""
        };
        updatedReturnList.push(returnDetail);
      }
    });
    return this.utilityService.sortByProperty(updatedReturnList, 'updatedDate').reverse();
  }

  /**
   * @author Satyam Jasoliya
   * @description This method Restore the selected return from list when user press 'Restore' button
   * @date 18-oct-2019
   * @memberof RestoreReturnComponent
   */
  public returnRestore() {
    let selectedValue: any = this.restoreReturnList.getSelectedValue;
    let filteredObjects: any = selectedValue.filter(t => !(t.isSuccess === true || t.isSuccess === false));
    if (filteredObjects && filteredObjects.length > 0) {
      let returnIds = filteredObjects.map(filteredObjects => filteredObjects.id);
      this.restoreReturnService.createRestoreReturnList({ 'returnIds': returnIds, 'email': this.userService.getValue('email'), 'restoreJobId': this.restoreJobId }).then((response: any) => {
        this.messageService.showMessage('Return Restore successful', 'success');
        if (response && Object.keys(response).length > 0) {
          for (let returnId of response.success) {
            //finding the return object whose id matched with the return Id received in success array
            let indexOfReturn = this.rowData.findIndex(t => t.id === returnId);
            if (indexOfReturn !== -1) {
              this.rowData[indexOfReturn].isSuccess = true;//property set to show the tick mark icon instead of checkbox
            }
          }
        }
        if (response.error && Object.keys(response.error).length > 0) {
          //loop over the array holding the return ID which are not restored due to some error
          response.error.forEach((returnId) => {
            let indexOfReturn = this.rowData.findIndex(t => t.id === returnId);
            if (indexOfReturn !== -1) {
              this.rowData[indexOfReturn].isSuccess = false;//property set to show the tick mark icon instead of checkbox
            }
          });
        }
        this.gridApi.setRowData(this.rowData);
        this.returnList = JSON.parse(JSON.stringify(this.rowData));
      }, error => {
        this.messageService.showMessage('Error while restoring return. Please try again later.', 'error');
      });
    }
    else {
      this.messageService.showMessage('Please select a return(s)', 'error', 'RESTORE_SELECTRETURN_ERROR');
    }
  }

  ngOnInit() {
    //bind columns data
    this.gridOptions = this._gridOptions;
    //get allowed file type array
    this.acceptedFileType = this.options.allowedContentTypes.toString();
    //get released packages
    let packageDetails = this.systemConfigService.getReleasedPackages();
    // filter
    let types = [{ title: 'All Types', id: 'All' }];
    this.returnTypes = types.concat(packageDetails);
  }

}
