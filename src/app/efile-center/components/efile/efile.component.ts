// External Import
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import * as moment from "moment";
import { Router } from '@angular/router';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import 'rxjs/operators';
import { Subscription } from 'rxjs';

// Internal Import
import { eFileSumaryListService } from '@app/shared/services/efile-summary-list.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { MessageService } from '@app/shared/services/message.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { UserService } from '@app/shared/services/user.service';
import { StandardAgGridComponent } from '@app/core/standard-ag-grid/standard-ag-grid.component';
import { ExportDialogComponent } from '@app/efile-center/dialogs/export-dialog/export-dialog.component';
import { TextMessageDialogComponent } from '@app/shared/components/text-message-dialog/text-message-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { EfileService } from './efile.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-efile',
  templateUrl: './efile.component.html',
  styleUrls: ['./efile.component.scss'],
  providers: [EfileService]
})
export class EfileComponent implements OnInit, OnDestroy {

  @ViewChild('efileAgGridComponent', { static: false }) efileAgGridComponent: StandardAgGridComponent;

  public gridOptions: GridOptions;
  public defaultFilter: any = { searchText: '', status: 'All', returnType: 'All' };
  public filter: any = { searchText: '', status: 'All', returnType: 'All' };
  public gridApi: any;
  public rowData: any;

  public eFileSummaryList: any; // to hold response
  public subscribeFilterChange: any;
  public filterDisplayEfile: any = { id: 'All' };
  public filterConfigEfile: any = [{ typeTitle: '' }];
  public eFileType: any;
  public filterMaping: any;
  public filterReturnDisplay: any = [{ type: '' }];
  public filterReturnConfig: any = [{ type: '' }];
  public returnTypes: any;
  public packageDetails: any;
  public types: any;
  public filterStatusPassed: any;
  public efileStatus: any;
  public communicationServiceWatcher: Subscription;
  // efile Actions array
  public efileActions = ['Cancel E-File', 'Print Confirmation Letter', 'Message', 'Print Form 9325', 'Remove From Rejected List'];


  constructor(private efileService: EfileService, private router: Router, private efileSummaryListService: eFileSumaryListService, private systemConfigService: SystemConfigService, private messageService: MessageService,
    private dialogService: DialogService, private userService: UserService, private currencyPipe: CurrencyPipe) {

  }


  /**
   * @author Mansi Makwana
   * to get efile summary list for binding data in ag-grid
   * @memberOf EfileComponent
   */
  public onGridReady(params: any) {
    this.gridApi = params.api;
    this.getList();
  }

  /**
   * @author Mansi Makwana
   * to get efile summary list
   * @memberOf EfileComponent
   */
  public getList(manualRefresh?: boolean) {
    return new Promise((resolve, reject) => {
      this.efileSummaryListService.getList().then((result: any) => {
        this.rowData = result.data;
        if (!manualRefresh) {
          if (result.gridPref && Object.keys(result.gridPref).length > 0) {
            this.loadGridState(result.gridPref || {});
          } else {
            this.filter.status = this.efileSummaryListService.filterStatusPassed;
            this.externalFilter();
          }
        }
        resolve(result);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Set Grid State and Filter
   * @private
   * @param {*} result
   * @memberof EfileComponent
   */
  private loadGridState(gridPref: any) {
    if (this.efileSummaryListService.filterStatusPassed !== 'All') {
      this.filter.status = this.efileSummaryListService.filterStatusPassed;
      this.filter.searchText = this.defaultFilter.searchText || '';
      this.filter.returnType = this.defaultFilter.returnType || 'All';
    } else {
      this.filter = gridPref.userFilter || JSON.parse(JSON.stringify(this.defaultFilter));
    }
    this.efileAgGridComponent.setGridState(gridPref);
    this.quickFilter(this.filter.searchText)
    this.externalFilter();
  }

  /**
   * @author Mansi Makwana
   * to filter data in ag-grid
   * @memberOf EfileComponent
   */
  quickFilter(searchValue: any) {
    this.efileAgGridComponent.quickFilter(searchValue);
  }

  /**
   * @author Ravi Shah
   * Save Grid Settings
   * @memberof EfileComponent
   */
  saveGridSettings() {
    this.efileAgGridComponent.saveGridState().then(() => {
      this.messageService.showMessage('Grid Settings for E-File List saved successfully.', 'success');
    });
  }

  /**
   * @author Ravi Shah
   * Reset Grid Settings
   * @memberof EfileComponent
   */
  resetGridSettings() {
    this.efileAgGridComponent.defaultGridState().then(() => {
      this.quickFilter(this.filter.searchText);
      this.externalFilter();
      this.messageService.showMessage('Grid Settings for E-File List reset successfully.', 'success');
    });
  }

  public externalFilterStatus(node: any) {
    let isStatusMatch = false;
    let isStateMatch = false;
    let isReturnTypeMatch = true;
    const filterMap = this.filterMaping.find(t => t.id === this.filter.status);
    if (node.data.eFileStateName !== undefined && node.data.eFileStateName !== null) {
      isStateMatch = (filterMap.state === undefined || filterMap.state == 'any' ||
        (filterMap.state == 'anystate' && node.data.eFileStateName != 'federal') ||
        (filterMap.state.toLowerCase() == node.data.eFileStateName.toLowerCase()));
    } else {
      isStateMatch = true;
    }
    if (this.filter.status === 'IRS Alerts' && node.data.alertCount && node.data.alertCount > 0) {
      isStatusMatch = true;
    } else if (this.filter.status !== 'IRS Alerts') {
      if (node.data.eFileStatus !== undefined && node.data.eFileStatus !== null) {
        filterMap.status.forEach(statusValue => {
          if (statusValue === undefined || statusValue === 'any' || statusValue === node.data.eFileStatus) {
            isStatusMatch = true;
          }
        });
      }
    }
    // ---

    if (this.filter.returnType !== 'All') {
      const obj = this.returnTypes.find(t => t.id === this.filter.returnType);
      isReturnTypeMatch = node.data.type === obj.id;
    } else {
      isReturnTypeMatch = true;
    }
    return isReturnTypeMatch && isStatusMatch && isStateMatch;
  }
  /**
   * @author Mansi Makwana
   * Call the Standard Grid Function for the External Filters
   * @memberOf EfileComponent
   */
  externalFilter() {
    this.efileAgGridComponent.externalFilter();
  }

  /**
   * @author Mansi Makawana
   * Export to CSV and PDF
   * @param {*} formatType
   * @memberof EfileComponent
   */
  public exportListEfile(formatType: any) {

    let columnConfig = [
      { key: "ssnOrEinFull", text: "SSN/EIN", selected: true },
      { key: "taxPayerName", text: "TAXPAYER NAME", selected: true },
      { key: "type", text: "TYPE", selected: true },
      { key: "year", text: "YEAR", selected: true },
      { key: "eFileStatusMessage", text: "E-FILE STATUS", selected: true },
      { key: "eFileStateName", text: "STATE", selected: true },
      { key: "returnTypeDisplayText", text: "RETURN TYPE", selected: true }
    ];
    this.dialogService.custom(ExportDialogComponent, { columnConfiguration: columnConfig }, { 'keyboard': false, 'backdrop': false, 'size': 'md' }).result.then(res => {
      if (res) {
        let params = {
          columnKeys: res,
          fileName: 'eFileSummarySheet',
          sheetName: 'Sheet 1',
          allColumns: true
        };
        this.efileAgGridComponent.exportGrid(formatType, params);
      }
    });
  }

  public initFilterConfigReturnTypes() {
    if (((this.filterReturnDisplay.type === undefined) || this.filterReturnDisplay.type != null || this.filterReturnDisplay.type === '')
      && ((this.filterReturnConfig.type === undefined) || this.filterReturnConfig.type != null || this.filterReturnConfig.type === '')) {
      this.filterReturnDisplay.type = this.returnTypes[0].title;
      this.filterReturnConfig.type = this.returnTypes[0].type;
    }
  }


  public onActionClicked({ actionType, dataItem, node }) {
    switch (actionType) {
      case 'openRejectedReturn':
        this.openRejectedReturn(dataItem);
        break;
      default:
        this.returnAction(actionType, dataItem, node);
        break;
    }
  }

  /**
   * @author Mansi Makwana
   *  Open Return
   * @memberOf EfileComponent
   */

  public openRejectedReturn(taxRejectedReturn) {
    if (taxRejectedReturn.isCheckedOut === true) {
      let message = 'some one else';
      if (taxRejectedReturn.checkedOutBy !== undefined) {
        message = taxRejectedReturn.checkedOutBy;
      } else if (taxRejectedReturn.email !== undefined) {
        message = taxRejectedReturn.email;
      }
      this.messageService.showMessage('This return is opened for editing by ' + message, 'error');
    } else {
      if ((taxRejectedReturn.eFileStatus === 8 || taxRejectedReturn.eFileStatus === 9) && taxRejectedReturn.alertCount > 0) {
        // condition to check that previously return was saved from 
        if ((taxRejectedReturn.returnMode === undefined) || taxRejectedReturn.returnMode === 'input') {
          this.router.navigateByUrl('/return/edit/' + taxRejectedReturn.id + '/alerts');
        } else if (taxRejectedReturn.returnMode === 'interview') {
          this.router.navigateByUrl('/return/interview/' + taxRejectedReturn.id + '/alerts');
        }
      } else if (taxRejectedReturn.eFileStatus === 8) {
        // condition to check that previously return was saved from 
        if ((taxRejectedReturn.returnMode === undefined) || taxRejectedReturn.returnMode === 'input') {
          this.router.navigateByUrl('/return/edit/' + taxRejectedReturn.id + '/rejected');
        } else if (taxRejectedReturn.returnMode === 'interview') {
          this.router.navigateByUrl('/return/interview/' + taxRejectedReturn.id + '/rejected');
        }
      } else {
        // condition to check that previously return was saved from
        if ((taxRejectedReturn.returnMode === undefined) || taxRejectedReturn.returnMode === 'input') {
          this.router.navigateByUrl('/return/edit/' + taxRejectedReturn.id);
        } else if (taxRejectedReturn.returnMode === 'interview') {
          this.router.navigateByUrl('/return/interview/' + taxRejectedReturn.id);
        }
      }
    }
  }

  /**
   * @author Mansi Makwana
   * Reset type filter to all
   * @memberOf EfileComponent
   */

  public resetStatusFilter() {
    this.filterDisplayEfile.type = this.eFileType[0].title;
    this.filterConfigEfile.type = this.eFileType[0].id;

  }

  /**
   * @author Mansi Makwana
   * to display the action or not to check beta only flag.
   * @param {action} action is the parameter which contains the particular action.
   * @memberOf EfileComponent
   */

  public isActionDisplayed(action) {
    switch (action) {
      case 'Cancel E-File':
        return true;

      case 'Print Confirmation Letter':
        return true;

      case 'Message':
        return true;

      case 'Print Form 9325':
        return true;

      case 'Remove From Rejected List':
        return true;

      default:
        return false;
    }
  }

  /**
   * @author Mansi Makwana
   * Check whether action is disabled or not.
   * We check whether action is disabled or not so we have to pass true for disabling action.
   * @param {action} action is the parameter which contains the particular action.
   * @param {returnObj} returnObj is the parameter which contains the selected efile status.
   * @memberOf EfileComponent
   */

  public isActionDisabled(action, returnObj) {
    switch (action) {
      case 'Cancel E-File':
        if ((returnObj.eFileStatus >= 0 && returnObj.eFileStatus <= 6) || returnObj.eFileStatus == 8) { //(returnObj.eFileStateName.toLowerCase() == 'federal' || returnObj.eFileStateName.toLowerCase() == 'federalext' )
          return false;
        }
        return true;

      case "Print Confirmation Letter":
        // allow print only if efile status is 'accepted' or 'rejected'
        if (returnObj.eFileStatus === 8 || returnObj.eFileStatus === 9) {
          return false;
        }
        return true;

      case "Message":
        // allow mesa
        if (returnObj.eFileStatus === 8 || returnObj.eFileStatus === 9) {
          return false;
        }
        return true;

      case "Print Form 9325":
        if (returnObj.type === '1040' && returnObj.eFileStateName.toString().toLowerCase() === 'federal' && returnObj.eFileStatus === 9) {
          return false;
        }
        return true;

      case "Remove From Rejected List":
        if (returnObj.eFileStatus === 8) {
          return false;
        }
        return true;

      default:
        return false;
    }
  }


  /**
   * @author Mansi Makwana
   * to display the action or not to vcehck beta only flag.
   * @param {action} action is the parameter which contains the particular action.
   * @param {efileObject} efileObj is the parameter which contains the selected efile.
   * @memberOf EfileComponent
   */

  returnAction(action, efileObject, node: any) {
    // there will be many actions that user can perform
    switch (action) {
      case 'Cancel E-File':
        // cancel EFILE
        // Note:- On success we check for special code 2005. IF code is 2005 then efile is not canceled due to some on going process. 
        // In this scenario we do nothing then just showing corresponding message to user.
        // Else we change EFILE status to 21 and blank the sub status.
        this.efileSummaryListService.cancelEFile(efileObject).then((response: any) => {
          if (response.code === 2005) {
            let dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
            let translatedText = { title: 'Notification', text: 'You can not cancel E-File at this time. Please try again later.', type: 'notify' };
            this.dialogService.notify(translatedText, dialogConfiguration);
          } else {
            efileObject.eFileStatus = 21;
            efileObject.eFileStatusMessage = this.efileSummaryListService.getEfleStatus(efileObject);
            this.efileAgGridComponent.setRowData(efileObject, node);
            this.messageService.showMessage("E-File Canceled", "success", "EFILE_CANCEL_SUCESS");
          }

        }, (error) => {
          console.error(error);
        });
        break;

      case 'Print Confirmation Letter':
        this.printConfirmationLetter(efileObject);
        break;

      case 'Message':
        this.openTextMessage(efileObject);
        break;

      case 'Print Form 9325':
        this.printForm9325(efileObject);
        break;

      case 'Remove From Rejected List':
        let dialog = this.dialogService.confirm({ title: 'Confirmation', text: "When a return is marked as Unresolvable,it will be removed from your Rejected queue. Use the Unresolvable option when a return has been e-filed unsuccessfully and need to be paper filed." }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
        dialog.result.then((result) => {
          this.efileService.changeStatusRejectToUnsolvable(efileObject).then((response: any) => {
            if (response.status === 22) {
              efileObject.eFileStatus = 22;
              efileObject.eFileStatusMessage = this.efileSummaryListService.getEfleStatus(efileObject);
              this.efileAgGridComponent.setRowData(efileObject, node);
              this.externalFilter();
            }
          });
        });
        break;

      default:
        break;
    }
  }


  /**
   * @author Mansi Makwana
   * print 9325 form after return was accepted
   * @memberOf EfileComponent
   */

  public printForm9325(efileObj) {
    let form = {
      "formName": "f9325",
      "category": "Other",
      "docName": "d9325",
      "description": "Acknowledgement and General Information for Taxpayers Who File Returns Electronically",
      "displayName": "9325",
      "id": "77859",
      "canDelete": true,
      "isMultiAllowed": false,
      "maxOccurs": "1",
      "parentID": "0",
      "type": "Frm",
      "packageName": "1040",
      "state": "federal",
      "isDefault": false,
      "formBelongsToPackages": "1040",
      "status": "Final",
      "updatedDate": "2018-01-13 06:26:11.483",
      "isHiddenForm": false,
      "printCategory": "FederalForms",
      "whenToPrint": {
        "client": "Default",
        "preparer": "Default",
        "filing": "Default",
        "custom": "Default"
      },
      "printOrder": {
        "client": "0010400227",
        "preparer": "0010400227",
        "filing": "0010400227",
        "custom": "0010400227"
      },
      "returnTypeCategory": efileObj.returnTypeCategory
    };
    this.efileService.printReturn(efileObj, form).then((response: any) => {
      if (response && response.key) {
        // Return with url for get API. so return controller can invoke $window.open
        let url = `${environment.base_url}/print/getFile?key=${response.key}&locationId=${this.userService.getLocationId(undefined)}`;
        window.open(url, '_self');
      }

    });
  }

  /**
   * @author Mansi Makwana
   * Print confirmation letter
   * @memberOf EfileComponent
   */

  public printConfirmationLetter(efileObject) {
    let pdfWrapper = new PdfMakeWrapper();
    pdfWrapper.pageMargins([40, 60, 40, 60]);
    let style: any = {
      header: { bold: true, fontSize: 15 }, text_align_right: { alignment: 'right' },
      tableExample: { margin: [50, 10, 0, 10], align: 'center' },
      tableHeader: { bold: true, fontSize: 13, color: 'black' }
    }
    pdfWrapper.styles(style)
    pdfWrapper.defaultStyle({ fontSize: 12 });
    let fileName = '';
    let content = [];


    if (efileObject.eFileStateName !== undefined) {
      let state = efileObject.eFileStateName;

      // set tax year as 2014 if is undefined  
      efileObject.year = efileObject.year !== undefined ? efileObject.year : '2014';

      // Get Client Name
      let clientName = '';
      if ((efileObject.taxPayerName !== undefined) && efileObject.taxPayerName !== '') {
        clientName = efileObject.taxPayerName;
      }
      // For More return type we need to write conditions here
      // print federal confirmation letter
      if (efileObject.eFileStateName.toString().toLowerCase() === 'federal' && efileObject.returnTypeCategory !== 'ExtensionForm') {
        if (efileObject.type === '1040') {
          content = this.get1040FedConfLetter(efileObject);
        } else if (efileObject.type === '1065' || efileObject.type.toLowerCase() === '1120' || efileObject.type.toLowerCase() === '1120s' || efileObject.type.toLowerCase() === '1041' || efileObject.type.toLowerCase() === '990') {
          content = this.getBusinessFedConfLetter(efileObject);
        }

        fileName = '';
        if ((clientName !== undefined) && clientName !== '') {
          fileName = clientName + ' ';
        }
        fileName = fileName + 'Federal_Confirmation_Letter';
      } else if (efileObject.eFileStateName.toString().toLowerCase() === 'federal' && efileObject.returnTypeCategory === 'ExtensionForm') {
        if (efileObject.type === '1040') {
          content = this.get1040FedExtConfLetter(efileObject);
        } else if (efileObject.type === '1065' || efileObject.type.toLowerCase() === '1120' || efileObject.type.toLowerCase() === '1120s' || efileObject.type.toLowerCase() == '1041' || efileObject.type.toLowerCase() === '990') {
          content = this.getBusinessFedExtConfLetter(efileObject);
        }

        fileName = '';
        if ((clientName !== undefined) && clientName !== '') {
          fileName = clientName + '_';
        }
        fileName = fileName + 'FederalExtention_Confirmation_Letter';
      } else { // print state confirmation letter
        content = this.getStateConfirmationLetterContent(efileObject);
        fileName = '';
        if ((clientName !== undefined) && clientName !== '') {
          fileName = clientName + ' ';
        }

        if ((state !== undefined) && state !== '') {
          fileName = fileName + state.toUpperCase() + ' ';
        }
        fileName = fileName + 'Confirmation_Letter';
      }
    }
    // Download pdf, instead of open or printing.		
    pdfWrapper.add(content);
    pdfWrapper.create().download(fileName + '.pdf');
  }

  /**
   * @author Mansi Makwana
   *  get Letter head if it isnot defined or empty.
   * @memberOf EfileComponent
   */

  public getLetterHead() {
    // Print office name and email id of current logged in user in letter head.
    let userDetails = this.userService.getUserDetails();
    let letterHead = '';

    if (userDetails.locationData.contactFirstName !== undefined) {
      letterHead = userDetails.locationData.contactFirstName;
    }

    if (userDetails.locationData.contactLastName !== undefined) {
      letterHead = letterHead + ' ' + userDetails.locationData.contactLastName + '\n';
    } else if (userDetails.locationData.contactFirstName !== undefined) {
      letterHead = letterHead + '\n';
    }

    if ((userDetails.locationData !== undefined) && (userDetails.locationData.name !== undefined)) {
      letterHead = letterHead + userDetails.locationData.name + '\n';
    }

    if ((userDetails.locationData !== undefined) && (userDetails.email !== undefined)) {
      letterHead = letterHead + userDetails.email + '\n';
    }

    let tempData = userDetails.locations[userDetails.currentLocationId];
    if ((tempData !== undefined) && (tempData.usAddress !== undefined) && (tempData.usAddress !== null)) {
      if ((tempData.usAddress.street !== undefined) && tempData.usAddress.street !== '') {
        letterHead = letterHead + tempData.usAddress.street;
      }

      if (((tempData.usAddress.city !== undefined) && tempData.usAddress.city !== '') || ((tempData.usAddress.state !== undefined) && tempData.usAddress.state !== '') || ((tempData.usAddress.zipCode !== undefined) && tempData.usAddress.zipCode !== '')) {
        letterHead = letterHead // remove as per  ticket #1087268 + ",";
      }

      letterHead = letterHead + '\n';

      if ((tempData.usAddress.city !== undefined) && tempData.usAddress.city !== '') {
        letterHead = letterHead + tempData.usAddress.city;
      }

      if ((tempData.usAddress.state !== undefined) && tempData.usAddress.state !== '') {
        letterHead = letterHead + ' , ' + tempData.usAddress.state;
      }

      if ((tempData.usAddress.zipCode !== undefined) && tempData.usAddress.zipCode !== '') {
        letterHead = letterHead + ' ' + tempData.usAddress.zipCode + '\n';
      }

      if ((tempData.usAddress.telephone !== undefined) && tempData.usAddress.telephone !== '') {
        letterHead = letterHead + 'Phone : ' + tempData.usAddress.telephone;
      }
    }
    return letterHead;
  }


  /**
   * @author Mansi Makwana
   * returns template contents as an array
   * @param {efileObject} efileObj is the parameter which contains the selected efile.
   * @memberOf EfileComponent
   */

  public get1040FedConfLetter(efileObject) {
    let content = [];
    let printDt: any = new Date();
    printDt = moment(printDt).format('MM/DD/YYYY hh:mm A');

    var columns = [];
    columns.push({ width: '*', text: "Federal E-File Confirmation", style: "header", margin: [0, 0, 0, 10] });
    columns.push({ width: '*', text: "Printed : " + printDt, style: 'text_align_right', margin: [0, 0, 0, 10] });
    content.push({ columns: columns });

    let letterhead = this.getLetterHead();
    if ((letterhead !== undefined) && letterhead !== '') {
      content.push({ text: letterhead, style: 'text_align_right', margin: [0, 10, 0, 10] });
    }

    let name = '';
    if ((efileObject.taxPayerName !== undefined) && efileObject.taxPayerName !== '') {
      name = efileObject.taxPayerName;
    }

    if ((name !== undefined) && name !== '') {
      content.push({ text: name, margin: [0, 20, 0, 0] });
    }

    let text = 'Thank you for electronically filing your ' + efileObject.year + ' federal income tax return. This letter is a confirmation of the transmission of your return to the IRS. It is designed to help you understand some of the procedures involved with electronic filing.PLEASE DO NOT SEND A PAPER COPY OF YOUR RETURN TO THE IRS. IF YOU DO, IT WILL DELAY THE PROCESSING OF YOUR RETURN.';

    content.push({ text: text, margin: [0, 20, 0, 10] });

    let ackDt = '', status = '', refundOrBalDue = [], subid = '', balanceDue = 0, isBalanceDueAvailable = false, refundType = '';

    if (efileObject.acknowledgementDate !== undefined) {
      ackDt = moment(efileObject.acknowledgementDate).format('MM/DD/YYYY hh:mm A');
    }

    if ((efileObject.eFileStatus !== undefined) && efileObject.eFileStatus !== '') {
      if (efileObject.eFileStatus === 8) {
        status = 'Rejected';
      } else if (efileObject.eFileStatus === 9) {
        status = 'Accepted';
      } else {
        status = '';
      }
    }

    if ((efileObject.acknowledgedBalanceDue !== undefined) && efileObject.acknowledgedBalanceDue > 0) {
      let balanceDue = this.currencyPipe.transform(efileObject.acknowledgedBalanceDue, 'USD', true, '1.0-0');
      isBalanceDueAvailable = true;
      refundOrBalDue = ['Balance Due', balanceDue.toString()];
    } else if ((efileObject.acknowledgedRefund !== undefined) && efileObject.acknowledgedRefund > 0) {
      let acknowledgedRefund_filter = this.currencyPipe.transform(efileObject.acknowledgedRefund, 'USD', true, '1.0-0');
      refundOrBalDue = ['Acknowledged Refund', acknowledgedRefund_filter.toString()];
    } else {
      if ((efileObject.expectedRefund === undefined) || efileObject.expectedRefund < 0) {
        efileObject.expectedRefund = 0;
      }
      let expectedRefund_filter = this.currencyPipe.transform(efileObject.expectedRefund, 'USD', true, '1.0-0');
      refundOrBalDue = ['Expected Refund', expectedRefund_filter.toString()];
    }

    if ((efileObject.submissionId !== undefined) && efileObject.submissionId !== '') {
      subid = efileObject.submissionId;
    }

    if ((efileObject.refundType !== undefined) && efileObject.refundType !== '') {
      refundType = efileObject.refundType;
    }

    var body = [];
    body.push([{ text: 'Federal Confirmation of Your Tax Return', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}]);
    body.push(['Acknowledgment Date', ackDt]);
    body.push(['Status', status]);
    body.push(refundOrBalDue);
    body.push(['Submission ID', subid]);

    if (refundType === '4') {
      body.push(['Type', 'Check']);
    }

    content.push({ style: 'tableExample', table: { widths: [150, 'auto'], headerRows: 2, body: body } });

    text = 'If You Need to Make a Change to Your Return';
    content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

    text = 'In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 1040X.';
    content.push({ text: text, margin: [0, 0, 0, 10] });

    if (efileObject.acknowledgedBalanceDue <= 0) {
      if (refundType === '4') {
        text = 'Your Refund as a Check';
        content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

        text = 'Your Federal tax return shows a refund as indicated above. You have elected to have your refund sent to you as a check. In most cases, refunds are received within three to four weeks from the date the state accepted the return.';
        content.push({ text: text, margin: [0, 0, 0, 10] });
      } else {
        text = 'Your Refund as a Direct Deposit';
        content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

        text = 'Your Federal tax return shows a refund as indicated above. You have requested that your refund be directly deposited into either your checking or savings account. Most refunds are directly deposited within two to three weeks of the acceptance date.';
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }

      text = 'If You Need to Ask About Your Refund';
      content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

      text = "If it has been more than four (4) weeks since the IRS accepted your return AND you have not received your refund, you can call the IRS toll-free Tele-Tax Refund information number, 1-800-829-4477, or go online to www.irs.gov, 'Where's My Refund?' to check the status of your refund. You will need to know the taxpayer's social security number, filing status, and the exact amount of the refund you expect. If you would like to contact your local IRS office call 1-800-829-1040. You may be required to give them your submission id, listed above.";
      content.push({ text: text, margin: [0, 0, 0, 10] });

    } else {
      if (refundType === '4') {
        text = 'Your selected to pay your balance due with a Check/Money Order';
        content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

        text = 'Your federal tax return displays a balance due as indicated above. You selected to mail a check or money order. Include your SSN, daytime phone number, and tax year 2018 and mail it before April 16th 2019.';
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }
    }
    return content;
  }

  /**
   * @author Mansi Makwana
   * get 1040 fedextconf letter
   *  @param {efileObject} efileObj is the parameter which contains the selected efile.
   * @memberOf EfileComponent
   */
  public get1040FedExtConfLetter(efileObject) {
    let content = [];
    let printDt: any = new Date();
    printDt = moment(printDt).format('MM/DD/YYYY hh:mm A');

    let columns = [];
    columns.push({ width: '*', text: "Federal Extension E-File Confirmation", style: "header", margin: [0, 0, 0, 10] });
    columns.push({ width: '*', text: "Printed : " + printDt, style: 'text_align_right', margin: [0, 0, 0, 10] });
    content.push({ columns: columns });

    let letterhead = this.getLetterHead();
    if ((letterhead !== undefined) && letterhead !== '') {
      content.push({ text: letterhead, style: 'text_align_right', margin: [0, 10, 0, 10] });
    }

    let name = '';
    if ((efileObject.taxPayerName !== undefined) && efileObject.taxPayerName !== '') {
      name = efileObject.taxPayerName;
    }

    if ((name !== undefined) && name !== '') {
      content.push({ text: name, margin: [0, 20, 0, 0] });
    }

    if (efileObject.returnType !== '4868') {
      let text = 'Thank you for electronically filing your ' + efileObject.year + ' federal extension income tax return. This letter is a confirmation of the transmission of your return to the IRS. It is designed to help you understand some of the procedures involved with electronic filing.';

      content.push({ text: text, margin: [0, 20, 0, 10] });

    }
    let ackDt;
    let status = '';
    let refundOrBalDue = [];
    let subid = '';
    let refundType = '';

    if ((efileObject.acknowledgementDate !== undefined)) {
      ackDt = moment(efileObject.acknowledgementDate).format('MM/DD/YYYY hh:mm A');

    }

    if ((efileObject.eFileStatus !== undefined) && efileObject.eFileStatus !== '') {
      if (efileObject.eFileStatus === 8) {
        status = 'Rejected';
      } else if (efileObject.eFileStatus === 9) {
        status = 'Accepted';
      } else {
        status = '';
      }
    }

    if ((efileObject.submissionId !== undefined) && efileObject.submissionId !== '') {
      subid = efileObject.submissionId;
    }
    if (efileObject.returnType === '4868') {
      if (efileObject.acknowledgementDate !== undefined) {
        ackDt = moment(efileObject.acknowledgementDate).format('MM/DD/YYYY hh:mm A');
      }
      var text = 'Your Form 4868, Application for Automatic Extension of Time to File U.S. Individual Income Tax Return, was accepted on ' + ackDt + '. The Submission ID assigned to your extension is ' + efileObject.submissionId;
      content.push({ text: text, margin: [0, 20, 0, 10] });
      text = 'PLEASE DO NOT SEND A PAPER COPY OF YOUR EXTENSION TO THE IRS.';
      content.push({ text: text, margin: [0, 20, 0, 10] });
      text = 'The purpose of Form 4868 is to apply for 6 more months (4 if “out of the country” and a U.S. citizen or resident) to file Form 1040, 1040NR, 1040NR-EZ, 1040-PR, or 1040-SS.'
      content.push({ text: text, margin: [0, 20, 0, 10] });


      return content;

    } else {
      var body = [];
      body.push([{ text: "Federal Extension Confirmation of Your Tax Return", style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}]);
      body.push(['Acknowledgment Date', ackDt]);
      body.push(['Status', status]);
      body.push(['Submission ID', subid]);

      content.push({ style: 'tableExample', table: { widths: [200, 'auto'], headerRows: 2, body: body } });

      return content;
    }
  }

  /**
   * @author Mansi Makwana
   *   state confirmation letter template
   *  returns template contents as an array
   *  @param {efileObject} efileObj is the parameter which contains the selected efile.
   * @memberOf EfileComponent
   */


  public getStateConfirmationLetterContent(efileObject) {
    let content = [];
    let printDt: any = new Date();
    printDt = moment(printDt).format('MM/DD/YYYY hh:mm A');

    let columns = [];
    columns.push({ width: '*', text: 'State E-File Confirmation', style: 'header', margin: [0, 0, 0, 10] });
    columns.push({ width: '*', text: "Printed : " + printDt, style: 'text_align_right', margin: [0, 0, 0, 10] });
    content.push({ columns: columns });

    let letterhead = this.getLetterHead();
    if ((letterhead !== undefined) && letterhead !== '') {
      content.push({ text: letterhead, style: 'text_align_right', margin: [0, 10, 0, 10] });
    }

    let name = '';
    if ((efileObject.taxPayerName !== undefined) && efileObject.taxPayerName !== '') {
      name = efileObject.taxPayerName;
    }

    if ((name !== undefined) && name !== '') {
      content.push({ text: name, margin: [0, 20, 0, 0] });
    }

    let text = 'Thank you for electronically filing your ' + efileObject.year + ' state income tax return. This letter is a confirmation of the transmission of your return to the state. It is designed to help you understand some of the procedures involved with electronic filing.PLEASE DO NOT SEND A PAPER COPY OF YOUR RETURN TO THE STATE. IF YOU DO, IT WILL DELAY THE PROCESSING OF YOUR RETURN.';

    content.push({ text: text, margin: [0, 20, 0, 10] });

    let ackDt = '';
    let status = '';
    let refundOrBalDue = [];
    let subid = '';
    let balanceDue = 0;
    let isBalanceDueAvailable = false;

    if (efileObject.acknowledgementDate !== undefined) {
      ackDt = moment(efileObject.acknowledgementDate).format('MM/DD/YYYY hh:mm A');

    }

    if ((efileObject.eFileStatus !== undefined) && efileObject.eFileStatus !== '') {
      if (efileObject.eFileStatus === 8) {
        status = "Rejected";
      } else if (efileObject.eFileStatus === 9) {
        status = "Accepted";
      } else {
        status = '';
      }
    }

    if ((efileObject.balanceDue !== undefined) && efileObject.balanceDue > 0) {
      let balanceDue = this.currencyPipe.transform(efileObject.balanceDue, 'USD', true, '1.0-0');
      isBalanceDueAvailable = true;
      refundOrBalDue = ['Balance Due', balanceDue.toString()];
    } else if ((efileObject.acknowledgedRefund !== undefined) && efileObject.acknowledgedRefund > 0) {
      let acknowledgedRefund_filter = this.currencyPipe.transform(efileObject.acknowledgedRefund, 'USD', true, '1.0-0');
      refundOrBalDue = ['Acknowledged Refund', acknowledgedRefund_filter.toString()];
    } else {
      if ((efileObject.expectedRefund === undefined) || efileObject.expectedRefund < 0) {
        efileObject.expectedRefund = 0;
      }
      let expectedRefund_filter = this.currencyPipe.transform(efileObject.expectedRefund, 'USD', true, '1.0-0');
      refundOrBalDue = ['Expected Refund', expectedRefund_filter.toString()];
    }

    if ((efileObject.submissionId !== undefined) && efileObject.submissionId !== '') {
      subid = efileObject.submissionId;
    }

    let body = [];
    body.push([{ text: 'State Confirmation of Your Tax Return', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}]);
    body.push(['State', efileObject.eFileStateName.toString().toUpperCase()]);
    body.push(['Acknowledgment Date', ackDt]);
    body.push(['Status', status]);
    body.push(refundOrBalDue);
    body.push(['Submission ID', subid]);

    content.push({
      style: 'tableExample',
      table: {
        widths: [150, 'auto'],
        headerRows: 2,
        body: body
      }
    });

    if (isBalanceDueAvailable !== true) { // 1 
      if (efileObject.refundType === "3") {
        text = "Your Refund as a Check";
        content.push({ text: text, style: "header", margin: [0, 20, 0, 10] });

        text = "Your state income tax return shows a refund as indicated above. You have elected to have your refund sent to you as a check. In most cases, refunds are received within three to four weeks from the date the state accepted the return.";
        content.push({ text: text, margin: [0, 0, 0, 10] });
      } else {
        text = "Your Refund as a Direct Deposit";
        content.push({ text: text, style: "header", margin: [0, 20, 0, 10] });

        text = "Your state income tax return shows a refund as indicated above. You have requested that your refund be directly deposited into either your checking or savings account. Most refunds are directly deposited within two to three weeks of the acceptance date.";
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }
    } else {
      if (efileObject.refundType === "1") {
        text = " Your balance due will be paid via electronic funds withdrawal";
        content.push({ text: text, style: "header", margin: [0, 20, 0, 10] });

        text = "Your state income tax return shows a balance due as indicted above. You have requested to pay your balance due via electronic funds withdrawal.";
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }
      if (efileObject.refundType === "3") {
        text = "Your selected to pay your balance due with a Check/Money Order";
        content.push({ text: text, style: "header", margin: [0, 20, 0, 10] });

        text = "Your state tax return displays a balance due as indicated above. You selected to mail a check or money order. Include your SSN, daytime phone number, and tax year 2018 and mail it before April 16th 2019.";
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }
    }

    return content;
  }

  /**
   * @author Mansi Makwana
   * Federal confirmation letter template for 1065
   * returns template contents as an array
   * For More return type we need to write conditions here
   *  @param {efileObject} efileObj is the parameter which contains the selected efile.
   * @memberOf EfileComponent
   */

  public getBusinessFedConfLetter(efileObject) {
    let content = [];
    let printDt: any = new Date();
    printDt = moment(printDt).format('MM/DD/YYYY hh:mm A');
    let pkgData =
    {
      "1065": {
        "tableHeader": "Partnership  Confirmation of Your Tax Return",
        "changesToReturn": "In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 1065, and check box G(5) on page 1. If the income, deduction, credits, or other information provided to any partner on Schedule K-1 are incorrect, file an amended Schedule K-1 for that partner with the amended Form 1065. Also give a copy of the amended Schedule K-1 to that partner.",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "1120": {
        "tableHeader": "Corporation Confirmation of Your Tax Return",
        "changesToReturn": "",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "1120s": {
        "tableHeader": "S-Corporation Confirmation of Your Tax Return",
        "changesToReturn": "In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 1120S, and check box F(5) on page 1. If the income, deduction, credits, or other information provided to any shareholder on Schedule K-1 are incorrect, file an amended Schedule K-1 for that shareholder with the amended Form 1120S. Also give a copy of the amended Schedule K-1 to that shareholder.",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "1041": {
        "tableHeader": "Fiduciary Confirmation of Your Tax Return",
        "changesToReturn": "In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 1041, and check 'Amended return' on Client Information Sheet.",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "990": {
        "tableHeader": "Exempt Organization Confirmation of Your Tax Return",
        "changesToReturn": "In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 990, and check 'Amended return' on Client Information Sheet.",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      }
    };

    var columns = [];
    columns.push({ width: '*', text: "Federal E-File Confirmation", style: "header", margin: [0, 0, 0, 10] });
    columns.push({ width: '*', text: "Printed : " + printDt, style: 'text_align_right', margin: [0, 0, 0, 10] });
    content.push({ columns: columns });

    let letterhead = this.getLetterHead();
    if ((letterhead !== undefined) && letterhead !== '') {
      content.push({ text: letterhead, style: 'text_align_right', margin: [0, 10, 0, 10] });
    }

    let name = '';
    if ((efileObject.taxPayerName !== undefined) && efileObject.taxPayerName !== '') {
      name = efileObject.taxPayerName;
    }

    if ((name !== undefined) && name !== '') {
      content.push({ text: name, margin: [0, 20, 0, 0] });
    }

    var text = 'Thank you for electronically filing your ' + efileObject.year + ' federal income tax return. This letter is a confirmation of the transmission of your return to the IRS. It is designed to help you understand some of the procedures involved with electronic filing.PLEASE DO NOT SEND A PAPER COPY OF YOUR RETURN TO THE IRS. IF YOU DO, IT WILL DELAY THE PROCESSING OF YOUR RETURN.';

    content.push({ text: text, margin: [0, 20, 0, 10] });

    let ackDt = '';
    let status = '';
    let subid = '';

    if ((efileObject.acknowledgementDate !== undefined)) {
      ackDt = moment(efileObject.acknowledgementDate).format('MM/DD/YYYY hh:mm A');

    }

    if ((efileObject.eFileStatus !== undefined) && efileObject.eFileStatus !== '') {
      if (efileObject.eFileStatus === 8) {
        status = "Rejected";
      } else if (efileObject.eFileStatus === 9) {
        status = "Accepted";
      } else {
        status = '';
      }
    }

    if ((efileObject.submissionId !== undefined) && efileObject.submissionId !== '') {
      subid = efileObject.submissionId;
    }

    let pkg = efileObject.type.toLowerCase();

    let body = [];
    body.push([{ text: pkgData[pkg].tableHeader, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}]);
    body.push(['Acknowledgment Date', ackDt]);
    body.push(['Status', status]);
    body.push(['Submission ID', subid]);

    content.push({ style: 'tableExample', table: { widths: [150, 'auto'], headerRows: 2, body: body } });

    if ((pkgData[pkg]) !== undefined) {
      if ((pkgData[pkg].changesToReturn !== undefined) && pkgData[pkg].changesToReturn !== '') {
        text = 'If You Need to Make a Change to Your Return';
        content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

        text = pkgData[pkg].changesToReturn;
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }

      if ((pkgData[pkg].additionalQuestions !== undefined) && pkgData[pkg].additionalQuestions !== '') {
        text = 'Additional Questions';
        content.push({ text: text, style: 'header', margin: [0, 20, 0, 10] });

        text = pkgData[pkg].additionalQuestions;
        content.push({ text: text, margin: [0, 0, 0, 10] });
      }
    }

    return content;
  }


  /**
   * @author Mansi Makwana
   * Federalext confirmation letter template for 1065
   * returns template contents as an array
   *  @param {efileObject} efileObj is the parameter which contains the selected efile.
   * @memberOf EfileComponent
   */

  public getBusinessFedExtConfLetter(efileObject) {
    let content = [];
    let printDt: any = new Date();
    printDt = moment(printDt).format('MM/DD/YYYY hh:mm A');
    let pkgData =
    {
      "1065": {
        "tableHeader": "Partnership  Confirmation of Your Tax Return",
        "changesToReturn": "In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 1065, and check box G(5) on page 1. If the income, deduction, credits, or other information provided to any partner on Schedule K-1 are incorrect, file an amended Schedule K-1 for that partner with the amended Form 1065. Also give a copy of the amended Schedule K-1 to that partner.",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "1120": {
        "tableHeader": "Corporation Confirmation of Your Tax Return",
        "changesToReturn": "",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "1120s": {
        "tableHeader": "S-Corporation Confirmation of Your Tax Return",
        "changesToReturn": "In the event you need to make a change or correct the return you filed electronically, you must file an amended paper return, Form 1120S, and check box F(5) on page 1. If the income, deduction, credits, or other information provided to any shareholder on Schedule K-1 are incorrect, file an amended Schedule K-1 for that shareholder with the amended Form 1120S. Also give a copy of the amended Schedule K-1 to that shareholder.",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "1041": {
        "tableHeader": "Fiduciary Confirmation of Your Tax Return",
        "changesToReturn": "",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      },
      "990": {
        "tableHeader": "Exempt Organization Confirmation of Your Tax Return",
        "changesToReturn": "",
        "additionalQuestions": "If you have another questions about your electronically filed return, you may call the Electronic Filing Section of the IRS at the Ogden Service Center at 866-255-0654, or you may write to Internal Revenue Service, Ogden Service Center, Attn: Stop 6052, 1160W. 1200 S. Ogden, UT 84201"
      }
    };

    var columns = [];
    columns.push({ width: '*', text: "Federal Extension E-File Confirmation", style: "header", margin: [0, 0, 0, 10] });
    columns.push({ width: '*', text: "Printed : " + printDt, style: 'text_align_right', margin: [0, 0, 0, 10] });
    content.push({ columns: columns });

    let letterhead = this.getLetterHead();
    if ((letterhead !== undefined) && letterhead !== '') {
      content.push({ text: letterhead, style: 'text_align_right', margin: [0, 10, 0, 10] });
    }

    let name = '';
    if ((efileObject.taxPayerName !== undefined) && efileObject.taxPayerName !== '') {
      name = efileObject.taxPayerName;
    }

    if ((name) && name !== '') {
      content.push({ text: name, margin: [0, 20, 0, 0] });
    }

    let text = "Thank you for electronically filing your " + efileObject.year + " federal extension income tax return. This letter is a confirmation of the transmission of your return to the IRS. It is designed to help you understand some of the procedures involved with electronic filing.";

    content.push({ text: text, margin: [0, 20, 0, 10] });

    let ackDt = '';
    let status = '';
    let subid = '';

    if ((efileObject.acknowledgementDate !== undefined)) {
      ackDt = moment(efileObject.acknowledgementDate).format('MM/DD/YYYY hh:mm A');

    }

    if ((efileObject.eFileStatus !== undefined) && efileObject.eFileStatus !== '') {
      if (efileObject.eFileStatus === 8) {
        status = "Rejected";
      } else if (efileObject.eFileStatus === 9) {
        status = "Accepted";
      } else {
        status = '';
      }
    }

    //
    if ((efileObject.submissionId !== undefined) && efileObject.submissionId !== '') {
      subid = efileObject.submissionId;
    }

    let pkg = efileObject.type.toLowerCase();

    let body = [];
    body.push([{ text: pkgData[pkg].tableHeader, style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}]);
    body.push(['Acknowledgment Date', ackDt]);
    body.push(['Status', status]);
    body.push(['Submission ID', subid]);

    content.push({ style: 'tableExample', table: { widths: [150, 'auto'], headerRows: 2, body: body } });

    return content;
  }

  // openTextMessage method will open textbox to send text message 
  public openTextMessage(obj) {
    var efileStatus = this.efileSummaryListService.getEfleStatus({ 'eFileStatus': obj.eFileStatus, 'eFileStateName': obj.eFileStateName, 'errorCount': obj.errorCount });
    var data = {
      'eFileStateName': obj.eFileStateName,
      'recipientName': obj.taxPayerName,
      'status': efileStatus,
      'message': '',
      'date': obj.acknowledgementDate,
      'refund': obj.expectedRefund,
      'balanceDue': obj.balanceDue,
      'submissionId': obj.submissionId,
      'cellNumber': obj.cellNumber
    };
    this.dialogService.custom(TextMessageDialogComponent, { data }, { 'keyboard': false, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' });
  }
  /**
   * @author Mansi Makwana
   * Get the Grid Options for the Bank Application List
   * @readonly
   * @private
   * @type {GridOptions}
   * @memberOf EfileComponent
   */
  private get _gridOptions(): GridOptions {
    return {
      columnDefs: [
        {
          headerName: 'SSN/EIN',
          headerTooltip: 'SSN/EIN',
          field: 'ssnOrEinFull',
          width: 110,
          sort: 'asc',
          cellRenderer: (params: any) => {
            return `<i class='fa margin_right_5 font_size_14 ${this.efileSummaryListService.setReturnClass(params.data)}'></i>
            <a class="text-primary" data-action-type="openRejectedReturn">${params.data.ssnOrEin}</a>`;
          },
        },
        {
          headerName: 'TAXPAYER NAME',
          headerTooltip: 'TAXPAYER NAME',
          field: 'taxPayerName',
          width: 225,
        },
        {
          headerName: 'TYPE',
          headerTooltip: 'TYPE',
          field: 'type',
          width: 100,
        },
        {
          headerName: 'YEAR',
          headerTooltip: 'YEAR',
          field: 'year',
          width: 90,
        },
        {
          headerName: 'E-FILE STATUS',
          headerTooltip: 'E-FILE STATUS',
          field: 'eFileStatusMessage',
          width: 120,
          sortable: false
        },
        {
          headerName: 'ACCEPTANCE DATE',
          headerTooltip: 'ACCEPTANCE DATE',
          field: 'ackDt',
          tooltipField: '',
          width: 180
        },
        {
          headerName: 'STATE',
          headerTooltip: 'STATE',
          field: 'eFileStateName',
          width: 140,
          cellRenderer: (params: any) => {
            return params.value ? params.value.toUpperCase() : '';
          }
        },
        {
          headerName: 'RETURN TYPE',
          headerTooltip: 'RETURN TYPE',
          field: 'returnTypeDisplayText',
          width: 160
        },
        {
          headerName: 'ACTIONS',
          headerTooltip: 'ACTIONS',
          field: 'ACTIONS',
          suppressMovable: true,
          width: 80,
          cellClass: 'ag-grid-action-wrapper',
          cellRenderer: ((params: any) => {
            let element = `<button type="button" class="btn btn-outline-primary dropdown-toggle"
            data-toggle="dropdown">
            <i class="fas fa-cog padding_right_5"></i>
              </button>
              <div class="dropdown-menu" style="cursor: pointer;">`
            for (let action of this.efileActions) {
              if (this.isActionDisabled(action, params.data)) {
                element += `<a class="dropdown-item no-clicking" tabindex="-1"  data-action-type="${action}">${action}</a>`
              } else {
                element += `<a class="dropdown-item" tabindex="-1"  data-action-type="${action}">${action}</a>`
              }
            }
            element += '</div>';
            return element;
          })
        }
      ],
      isExternalFilterPresent: () => {
        return true;
      },
      doesExternalFilterPass: this.externalFilterStatus.bind(this)
    };
  }

  ngOnInit() {
    const self = this;
    // self.communicationServiceWatcher = this.communicationService.transmitter.subscribe((response: any) => {
    //   if (response.topic === 'efileSummaryList' && response.channel === 'MTPO-MANUALREFRESH-LIST') {
    //     self.externalFilter();
    //   }
    // });
    this.gridOptions = this._gridOptions;
    this.filterMaping = this.efileSummaryListService.filterMaping;
    this.eFileType = this.efileSummaryListService.eFileType;
    this.packageDetails = this.systemConfigService.getReleasedPackages();
    this.types = [{ title: 'All Types', id: 'All' }];
    this.returnTypes = this.types.concat(this.packageDetails);
    this.communicationServiceWatcher = this.efileSummaryListService.receivedFilter.subscribe((filter) => {
      this.filter.status = filter.id;
      this.externalFilter();
    });
  }
  /**
   * @author Mansi Makwana
   * Destroy the watcher on Destroy of component
   * @memberof EfileComponent
   */
  ngOnDestroy() {
    if (this.communicationServiceWatcher) {
      this.communicationServiceWatcher.unsubscribe();
    }
  }

}
