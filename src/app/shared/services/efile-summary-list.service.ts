import { Injectable, EventEmitter } from '@angular/core';
import { CommonAPIService } from './common-api.service';
import { UserService } from './user.service';
import { ConfigService } from './config.service';
import { APINAME } from '../shared.constants';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class eFileSumaryListService {

  // Variables
  public filterMaping = [{ id: 'All', status: ['any'], state: 'any', display: 'All' }, { id: 'Transmitted', status: [0, 1, 2, 3, 4, 5, 6], state: 'any', display: 'Transmitted' }, { id: 'AtIRS', status: [7], state: 'federal', display: 'At IRS' }, { id: 'AtState', status: [7], state: 'anystate', display: 'At State' }, { id: 'Accepted', status: [9], state: 'any', display: 'Accepted' }, { id: 'Rejected', status: [8], state: 'any', display: 'Rejected' }, { id: 'Canceled', status: [21], state: 'any', display: 'Canceled' }, { id: 'IRS Alerts', status: [8, 9], state: 'any', display: 'IRS Alerts / Messages' }, { id: 'Rejected As Unsolvable', status: [22], state: 'any', display: 'Rejected As Unsolvable' }];
  public filterStatusPassed = 'All';
  public eFileType = [{ title: "All Status", id: 'All' }, { title: "Transmitted", id: "Transmitted" }, { title: "At IRS", id: "AtIRS" }, { title: "At State", id: "AtState" }, { title: "Accepted", id: "Accepted" }, { title: "Rejected", id: "Rejected" }, { title: "Canceled", id: "Canceled" }, { title: "IRS Alerts / Messages", id: "IRS Alerts" }, { title: "Rejected As Unsolvable", id: "Rejected As Unsolvable" }]
  receivedFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private commonApiService: CommonAPIService, private userService: UserService, private configService: ConfigService) { }

  /**
   * @author Ravi Shah
   * Get All Efile List
   * @param {string} [status='']
   * @returns
   * @memberof eFileSumaryListService
   */
  public getList(status = '') {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.EFILE_LIST, parameterObject: { status: status } }).then((response) => {
        let returnList = [];
        // To check whether return is opened by current user or not.
        let userDetail = this.userService.getUserDetails();
        let stateList = this.configService.getConfigData().stateList;

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
              let isCheckedOut = returnData.isCheckedOut;
              if (userDetail.email == returnData.email) {
                isCheckedOut = false;
              }
              // For More return type we need to write conditions here

              let taxPayerName = "";
              let ssnOrEinFull = undefined;
              let ssnOrEin = undefined;
              let taxpayerFirstName = "", taxpayerLastName = "", businessName = "";

              // We have to check undefined condition separately other wise last name overrides everything.					
              if (_packageName == "1040") {
                taxpayerFirstName = returnData.client.firstName == undefined ? "" : returnData.client.firstName;
                taxpayerLastName = returnData.client.lastName == undefined ? "" : returnData.client.lastName;
                taxPayerName = taxpayerFirstName + " " + taxpayerLastName;
                ssnOrEinFull = returnData.client.ssn;
                ssnOrEin = ssnOrEinFull.substring(7);
              } else if (_packageName == "1065" || _packageName == "1120" || _packageName == "1120s" || _packageName == "1041" || _packageName == "990") {
                taxPayerName = returnData.client.companyName;
                ssnOrEinFull = returnData.client.ein;
                ssnOrEin = ssnOrEinFull.substring(6);
                businessName = returnData.client.companyName;
              }

              let refundType = "";
              if (_packageName == "1040" && returnData.eFileStateName == "federal" && returnData.client && returnData.client.refundType && returnData.client.refundType.value) {
                refundType = returnData.client.refundType.value;
              } else if (returnData.refundType) {
                refundType = returnData.refundType;
              }

              // To set additional status for state when state has sttus Transmitted.
              // Waiting for Federal, ATS Testing, Paper Only                    
              let eFileStatusMessage = "";
              if (returnData.eFileStatus) {
                let stateConfig = stateList[_packageName].find(t => t.name === returnData.eFileStateName.toUpperCase());
                if (stateConfig && stateConfig.eFileStatus && stateConfig.eFileStatus.value) {
                  if (stateConfig.eFileStatus.value == 'approved') {
                    if (returnData.eFileStatus == 0) {
                      eFileStatusMessage = "(" + stateConfig.eFileStatus.displayTextForEFileList + ")";
                    } else if (returnData.eFileStatus > 0 && returnData.eFileStatus <= 6) {
                      eFileStatusMessage = "(Transmitting)";
                    }
                  } else if (stateConfig.eFileStatus.value == 'ats') {
                    if (returnData.eFileStatus == 0 || returnData.eFileStatus == 1) {
                      eFileStatusMessage = "(" + stateConfig.eFileStatus.displayTextForEFileList + ")";
                    }
                  } else if (stateConfig.eFileStatus.value == 'paperOnly') {
                    if (returnData.eFileStatus == 0 || returnData.eFileStatus == 1) {
                      eFileStatusMessage = "(" + stateConfig.eFileStatus.displayTextForEFileList + ")";
                    }
                  }
                }
              }

              // Return list structure.
              let returnDetail = {
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
                alertCount: returnData.alertCount,
                acknowledgementDate: returnData.acknowledgementDate,
                balanceDue: returnData.balanceDue,
                expectedRefund: returnData.expectedRefund,
                submissionId: returnData.submissionId,
                acknowledgedRefund: returnData.acknowledgedRefund,
                acknowledgedBalanceDue: returnData.acknowledgedBalanceDue,
                refundType: refundType,
                eFileStatusMessage: this.getEfleStatus(returnData) + ' ' + eFileStatusMessage,
                key: returnData.key,
                returnMode: returnData.returnMode,
                returnType: returnData.returnType,
                returnTypeDisplayText: returnData.returnTypeDisplayText,
                returnTypeCategory: returnData.returnTypeCategory,
                cellNumber: returnData.client.cellPhoneNumber,
                ackDt: returnData.eFileStatus == 9 ? moment(returnData.acknowledgementDate).format('MM/DD/YYYY HH:mm') : '-'
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
      })
    });
  }



  /**
   * @author Ravi Shah
   * API Calling for the Efile cancellation
   * @memberof eFileSumaryListService
   */
  public cancelEFile = function (returnObj) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.EFILE_CANCEL, parameterObject: { "eFileId": returnObj.key } }).then((response) => {
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  };


  /**
   * @author Ravi Shah
   * Icon Class based on Return Object
   * @param {*} returnObj
   * @returns
   * @memberof eFileSumaryListService
   */
  public setReturnClass(returnObj) {
    if (returnObj.isCheckedOut === true)
      return 'fa-shield-alt';
    else if (returnObj.isLocked === true)
      return 'fa-lock';
    else if (returnObj.isConvertedReturn === true)
      return 'fa-exchange';
    else if (returnObj.isProformaReturn === true)
      return 'fa-exchange';
    else
      return 'margin_right_12';
  };

  /**
   * @author Ravi Shah
   * get Efile status
   * @memberof eFileSumaryListService
   */
  public getEfleStatus = function (returnObject) {
    let allStatus = [0, 1, 2, 3, 4, 5, 6];
    //Check if eFileStatus is defined in return
    if (returnObject.eFileStatus) {
      if (allStatus.includes(returnObject.eFileStatus)) {
        return "Transmitted";
      } else if (returnObject.eFileStatus == 7) {
        if (returnObject.eFileStateName) {
          if (returnObject.eFileStateName.toLowerCase() == 'federal' || returnObject.eFileStateName.toLowerCase() == 'federalext') {
            return "At IRS";
          } else {
            return "At State";
          }
        }
      } else if (returnObject.eFileStatus == 8) {
        return "Rejected" + " (" + returnObject.errorCount + ")"; //here we are just appending count with lable rejected .
      } else if (returnObject.eFileStatus == 9) {
        return "Accepted";
      } else if (returnObject.eFileStatus == 21) {
        return "Canceled";
      } else if (returnObject.eFileStatus == 22) {
        return "Rejected As Unsolvable";
      } else {
        return "";
      }
    } else {
      return "";
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
    let obj = this.eFileType.find(t => t.id === filter);
    if (obj) {
      this.filterStatusPassed = obj.id;
      this.receivedFilter.emit(obj);
    } else {
      this.filterStatusPassed = 'All';
      this.receivedFilter.emit({ title: "All Status", id: 'All' });
    }
  }
}