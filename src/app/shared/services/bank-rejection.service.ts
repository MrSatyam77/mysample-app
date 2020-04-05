import { Injectable, EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import { CommonAPIService } from './common-api.service';
import { APINAME } from '../shared.constants';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BankRejectionService {

  receivedFilter: EventEmitter<any> = new EventEmitter<any>();
  public filterStatusPassed = 'All';
  public bankRejectionType = [{ title: "All Status", id: 'All' }, { title: "Transmitted", id: "Transmitted" }, { title: "Accepted", id: "Accepted" }, { title: "Rejected", id: "Rejected" }, { title: "Cancelled", id: "Cancelled" }, { title: "At Bank", id: "AtBank" }];
  //Mapping for filter
  public filterMaping = [{ id: 'All', status: ['any'], state: 'any', display: 'All' },
  { id: 'Transmitted', status: [10, 11, 12, 13], state: 'any', display: 'Transmitted' },
  { id: 'Accepted', status: [15, 16, 17, 19], state: 'any', display: 'Accepted' },
  { id: 'Rejected', status: [14], state: 'any', display: 'Rejected' },
  { id: 'AtBank', status: [18], state: 'any', display: 'At Bank' }];

  constructor(private userService: UserService, private commonApiService: CommonAPIService) { }


  public getList(status?: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.GET_BANK_REJECTION_RETURNS, parameterObject: { status: status } }).then((response) => {
        var returnList = [];
        // To check whether return is opened by current user or not.
        var userDetail = this.userService.getUserDetails();

        // API return data in Different format, we need to format data in defined structure.  
        if (response.data && response.data.length > 0) {
          response.data.forEach((returnData) => {
            // Package name list.We use this because we only need first package name after removing 'common' name.
            if (returnData && Object.keys(returnData).length > 0) {
              //Get pacakge name other then 'common'				
              let _packageName = returnData.packageNames.filter((obj) => {
                return obj !== 'common'
              })[0];

              // Flag is used to check whether return is opened by current user or not.
              var isCheckedOut = returnData.isCheckedOut;
              if (userDetail.email == returnData.email) {
                isCheckedOut = false;
              }
              // For More return type we need to write conditions here

              var taxPayerName = "";
              var ssnOrEinFull = undefined;
              var ssnOrEin = undefined;
              var taxpayerFirstName = "", taxpayerLastName = "", businessName = "";
              // We have to check undefined condition separately other wise last name overrides everything.					
              if (_packageName == "1040") {
                taxpayerFirstName = returnData.client.firstName == undefined ? "" : returnData.client.firstName;
                taxpayerLastName = returnData.client.lastName == undefined ? "" : returnData.client.lastName;
                taxPayerName = taxpayerFirstName + " " + taxpayerLastName;
                ssnOrEinFull = returnData.client.ssn;
                ssnOrEin = ssnOrEinFull.substring(7);
              } else if (_packageName == "1065" || _packageName == "1120" || _packageName == "1120s") {
                taxPayerName = returnData.client.companyName;
                ssnOrEinFull = returnData.client.ein;
                ssnOrEin = ssnOrEinFull.substring(6);
                businessName = returnData.client.companyName;
              }
              // Return list structure.
              var returnDetail = {
                checkedOutBy: returnData.checkedOutBy,
                id: returnData.id,
                isLocked: returnData.isLocked == undefined ? false : returnData.isLocked,
                isCheckedOut: isCheckedOut == undefined ? false : isCheckedOut,
                isConvertedReturn: returnData.isConvertedReturn == undefined ? false : returnData.isConvertedReturn,
                isProformaReturn: returnData.isProformaReturn == undefined ? false : returnData.isProformaReturn,
                ssnOrEinFull: ssnOrEinFull,
                ssnOrEin: ssnOrEin,
                status: returnData.status,
                taxPayerName: taxPayerName,
                taxpayerFirstName: taxpayerFirstName,
                taxpayerLastName: taxpayerLastName,
                businessName: businessName,
                type: _packageName,
                year: returnData.year,
                updatedDate: returnData.updatedDate == undefined ? "2014-01-01T00:00:00+00:00" : returnData.updatedDate,
                eFileStateName: returnData.eFileStateName,
                eFileStatus: returnData.eFileStatus,
                errorCount: returnData.errorCount,
                acknowledgementDate: returnData.acknowledgementDate,
                acknowledgementDateFormatted: returnData.eFileStatus === 17 ? moment(returnData.acknowledgementDate).format('MM/DD/YYYY HH:mm') : '-',
                balanceDue: returnData.balanceDue,
                expectedRefund: returnData.expectedRefund,
                submissionId: returnData.submissionId,
                acknowledgedRefund: returnData.acknowledgedRefund,
                returnMode: returnData.returnMode,
                preAckStatus: returnData.preAckStatus,
                bankStatus: this.getBankStatus(returnData)
              };

              returnList.push(returnDetail);
            }
          });
        }
        resolve({
          gridPref: response.gridPref || {},
          data: returnList
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  //to set class base on return status
  public setReturnClass(returnObj) {
    if (returnObj.isCheckedOut)
      return 'fa-shield-alt';
    else if (returnObj.isLocked)
      return 'fa-lock';
    else if (returnObj.isLocked)
      return 'fa-exchange-alt';
    else
      return 'margin_right_12';
  };


  public getBankStatus = function (returnObject) {
    //Check if eFileStatus is defined in return
    if (returnObject.eFileStatus) {
      if ([10, 11, 12, 13].includes(returnObject.eFileStatus)) {
        return "Transmitted";
      } else if ([14].includes(returnObject.eFileStatus)) {
        return "Rejected" + " (" + returnObject.errorCount + ")"; //here we are just appending count with lable rejected .
      } else if ([15, 16, 17, 19].includes(returnObject.eFileStatus)) {
        return "Accepted";
      } else if ([21].includes(returnObject.eFileStatus)) {
        return "Cancelled";
      } else if ([18].includes(returnObject.eFileStatus)) {
        return "At Bank"
      }
    }
  };

  /**
   * @author Ravi Shah
   * Change Filter into the AngularJs for the efile List
   * @param {string} filter
   * @returns {*}
   * @memberof eFileSumaryListService
   */
  public filterChanged(filter: string): any {
    let obj = this.bankRejectionType.find(t => t.id === filter);
    if (obj) {
      this.filterStatusPassed = obj.id;
      this.receivedFilter.emit(obj);
    } else {
      this.filterStatusPassed = 'All';
      this.receivedFilter.emit({ title: "All Status", id: 'All' });
    }
  }
}
