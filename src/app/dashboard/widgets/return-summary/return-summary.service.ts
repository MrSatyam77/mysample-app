// Internal Imports
import { Injectable } from '@angular/core';

// External Imports
import { CommonAPIService, UserService, SystemConfigService } from '@app/shared/services';
import { APINAME } from '../../dashboard.constants';
import { IReturnSummaryCoulmnsSize } from '../../dashboard.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReturnSummaryService {

  public readonly columns: IReturnSummaryCoulmnsSize = {
    'one': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: "col-6 text-truncate"
    }, {
      fieldName: 'taxPayerName',
      displayText: "TAXPAYER'S NAME",
      className: "col text-truncate"
    }, {
      fieldName: 'status',
      displayText: 'STATUS',
      className: "col-6 text-truncate"
    }],
    'two': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: "col-4 text-truncate"
    }, {
      fieldName: 'taxPayerName',
      displayText: "TAXPAYER'S NAME",
      className: "col text-truncate"
    }, {
      fieldName: 'status',
      displayText: 'STATUS',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'type',
      displayText: 'TYPE',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'homeTelephone',
      displayText: 'PHONE NUMBER',
      className: "col-4 text-truncate"
    }],
    'three': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: "col-2 text-truncate"
    }, {
      fieldName: 'taxPayerName',
      displayText: "TAXPAYER'S NAME",
      className: "col text-truncate"
    }, {
      fieldName: 'status',
      displayText: 'STATUS',
      className: "col-2 text-truncate"
    }, {
      fieldName: 'type',
      displayText: 'TYPE',
      className: "col-2 text-truncate"
    }, {
      fieldName: 'homeTelephone',
      displayText: 'PHONE NUMBER',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'email',
      displayText: 'EMAIL',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'modifiedDate',
      displayText: 'DATE MODIFIED',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'eFileStatus',
      displayText: 'FED EFILE STATUS',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'transmissionDate',
      displayText: 'TRANSMISSION DATE',
      className: "col-3 text-truncate"
    }],
    'four': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: "col-2 text-truncate"
    }, {
      fieldName: 'taxPayerName',
      displayText: "TAXPAYER'S NAME",
      className: "col text-truncate"
    }, {
      fieldName: 'status',
      displayText: 'STATUS',
      className: "col-2 text-truncate"
    }, {
      fieldName: 'type',
      displayText: 'TYPE',
      className: "col-1 text-truncate"
    }, {
      fieldName: 'homeTelephone',
      displayText: 'PHONE NUMBER',
      className: "col-2 text-truncate"
    }, {
      fieldName: 'email',
      displayText: 'EMAIL',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'modifiedDate',
      displayText: 'DATE MODIFIED',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'eFileStatus',
      displayText: 'FED EFILE STATUS',
      className: "col-3 text-truncate"
    }, {
      fieldName: 'transmissionDate',
      displayText: 'TRANSMISSION DATE',
      className: "col-3 text-truncate"
    }]
  };


  constructor(private commonApiService: CommonAPIService, private userService: UserService, private systemConfigService: SystemConfigService) { }


  /**
   * to get Return-summary columns size
   * @author Mansi Makwana
   * @date 1st August 2019
   * @readonly
   * @type {IReturnSummaryCoulmnsSize}
   * @memberof ReturnSummary
   */
  public get ColumnSize(): IReturnSummaryCoulmnsSize {
    return this.columns;
  }
  /**
   * @author Mansi Makwana
   * @description  This function is used to get return summary List.
   */
  public getReturns(limit) {
    return new Promise((resolve, reject) => {
      const self = this;
      let recentReturnsList: any = [];
      let isItForCustomTemplate: any;
      self.getReturnList(limit, isItForCustomTemplate).then((response) => {
        recentReturnsList = response;
        // Filter out returns those are not transmitted and broadcast for toDos widget
        // We have to use call back function to filter out here. Else count will be wrong.
        // @pending
        // $rootScope.$broadcast('notTransmittedReturnsCounter', _.filter(returnList, function (data) {
        // if (data.eFileStatus === undefined) {
        // return true;
        // }
        // return false;
        // }).length);

        // check for user setting, IF settings for recent return widget is there then filter the list.
        let returnListFilters = self.userService.getValue('settings.widgets.recentReturns');
        if (returnListFilters && Object.keys(returnListFilters).length > 0) {
          recentReturnsList = self.filterReturnList(returnListFilters, response);
        }
        // // splice array with limit (top 10 here)
        // if (limit && recentReturnsList.length > limit) {
        //   recentReturnsList = recentReturnsList.splice(0, limit);
        // }
        for (let returns of recentReturnsList) {
          if (returns.isCheckedOut) {
            returns.className = 'fa fa-shield-alt';
          }

          else if (returns.isLocked)
            returns.className = 'fa fa-lock';
          else if (returns.isConvertedReturn)
            returns.className = 'fas fa-exchange-alt';
          else if (returns.isProformaReturn)
            returns.className = 'fas fa-exchange-alt';
          else if (returns.isRestoredReturn)
            returns.className = 'fas fa-exchange-alt';
          else if (returns.isRemoteSignLocked)
            returns.className = 'fa fa-lock';
          else
            returns.className = 'margin_right_17';
        }
        resolve(recentReturnsList);
      }, (error) => {
        reject(error);
      });
      return recentReturnsList;
    });
  }

  /**
   * @author Mansi Makwana
   * @description  This function is used to process return summary List.
   * Note: currently limit is only used to split last records. In future we have to pass this limit to Data API,
   *  so it only send last records.
   */
  public getReturnList(limit, isItForCustomTemplate) {
    const self = this;
    let taxYear: number;
    // Object to hold every year list and also act as cache
    let returnList: any = {};
    let packageName: any = {};
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.RETURN_LIST }).then((response) => {
        // get the tax year for which user is logged in
        taxYear = this.userService.getTaxYear();
        // Empty return list, Otherwise repeated data will append
        returnList[taxYear] = [];
        // To check whether return is opened by current user or not.
        const userDetail = this.userService.getUserDetails();
        const allEfileStatusLookup = this.systemConfigService.getEfileStatusLookup();
        // API return data in Different format, we need to format data in defined structure.
        response.data.forEach(returnData => {
          // Package name list.We use this because we only need first package name after removing 'common' name.
          if (returnData) {
            // Get package name other then 'common'
            if (returnData.packageNames[1] === 'common') {
              packageName = returnData.packageNames[0];
            }
            // Flag is used to check whether return is opened by current user or not.
            let isCheckedOut = returnData.isCheckedOut;
            if (userDetail.email === returnData.email) {
              isCheckedOut = false;
            }
            let taxPayerName = '';
            let ssnOrEinFull;
            let ssnOrEin;
            let birthDate;
            let spouseName = '';
            let spouseBirthDate;
            let usAddress = { street: '', city: '', state: '', zip: '' };
            let taxpayerFirstName = '';
            let taxpayerLastName = '';
            let businessName = '';
            let states = '';
            // store state list without federal and converts string into uppercase
            if (returnData.states !== undefined && returnData.states !== '') {
              let statesList = returnData.states;
              statesList.splice(0, 1);
              states = statesList.join(', ').toUpperCase();
            }
            // We have to check undefined condition separately other wise last name overrides everything.
            if (packageName === '1040') {
              taxpayerFirstName = returnData.client.firstName === undefined ? '' : returnData.client.firstName;
              taxpayerLastName = returnData.client.lastName === undefined ? '' : returnData.client.lastName;
              taxPayerName = taxpayerFirstName + ' ' + taxpayerLastName;
              ssnOrEinFull = returnData.client.ssn === undefined ? '' : returnData.client.ssn;
              ssnOrEin = returnData.client.applyForW7 !== true ? ssnOrEinFull.substring(7) : 'Apply W7';

              // prepare spouse name
              let spouseFirstName = returnData.client.spouseFirstName === undefined ? '' : returnData.client.spouseFirstName;
              let spouseLastName = returnData.client.spouseLastName === undefined ? '' : returnData.client.spouseLastName;
              spouseName = spouseFirstName + ' ' + spouseLastName;

              birthDate = returnData.client.birthDate;
              spouseBirthDate = returnData.client.spouseBirthDate;
            }
            else if (packageName === '1065' || packageName === '1120' || packageName === '1120s' || packageName === '1041' || packageName === '990') {
              taxPayerName = returnData.client.companyName;
              ssnOrEinFull = returnData.client.ein === undefined ? "" : returnData.client.ein;
              ssnOrEin = ssnOrEinFull.substring(6);
              businessName = returnData.client.companyName;

            }
            // prepare us address for printing usaddress in export list.
            if (returnData.client.usAddress && returnData.client.usAddress !== null) {
              if (returnData.client.usAddress.street && returnData.client.usAddress.street !== '') {
                usAddress.street = returnData.client.usAddress.street;
              }

              if (returnData.client.usAddress.city && returnData.client.usAddress.city !== '') {
                usAddress.city = returnData.client.usAddress.city;
              }

              if (returnData.client.usAddress.state && returnData.client.usAddress.state !== '') {
                usAddress.state = returnData.client.usAddress.state;
              }

              if (returnData.client.usAddress.zip && returnData.client.usAddress.zip !== '') {
                usAddress.zip = returnData.client.usAddress.zip;
              }
            }
            // Return list structure.
            let eFileStatus: any;
            if (returnData.eFileStatus) {
              let state = Object.keys(returnData.eFileStatus);
              let packages = Object.keys(returnData.eFileStatus[state[0]]);
              eFileStatus = returnData.eFileStatus[state[0]][packages[0]].status;
            }


            let returnDetail = {
              checkedOutBy: returnData.checkedOutBy,
              email: returnData.email,
              id: returnData.id,
              isLocked: returnData.isLocked == undefined ? false : returnData.isLocked,
              isRemoteSignLocked: returnData.isRemoteSignLocked == undefined ? false : returnData.isRemoteSignLocked,
              isCheckedOut: isCheckedOut == undefined ? false : isCheckedOut,
              isConvertedReturn: returnData.isConvertedReturn == undefined ? false : returnData.isConvertedReturn,
              isProformaReturn: returnData.isProformaReturn == undefined ? false : returnData.isProformaReturn,
              isRestoredReturn: returnData.isRestoredReturn == undefined ? false : returnData.isRestoredReturn,
              ssnOrEinFull: ssnOrEinFull,
              ssnOrEin: ssnOrEin,
              states: states,
              status: this.userService.getReturnStatusObject(returnData.status, undefined, true).title,
              taxPayerName: taxPayerName,
              taxpayerFirstName: taxpayerFirstName,
              taxpayerLastName: taxpayerLastName,
              businessName: businessName,
              type: packageName,
              year: returnData.year,
              updatedDate: returnData.updatedDate === undefined ? returnData.createdDate : returnData.updatedDate,
              eFileStatus: (eFileStatus !== undefined && eFileStatus !== null && allEfileStatusLookup[eFileStatus]) ? allEfileStatusLookup[eFileStatus].displayText : '',
              homeTelephone: returnData.client.homeTelephone == undefined ? returnData.client.cellPhoneNumber : returnData.client.homeTelephone,
              cellPhoneNumber: returnData.client.cellPhoneNumber,
              taxPayerEmail: returnData.client.email === undefined ? '' : returnData.client.email,
              spouseName: spouseName,
              street: usAddress.street,
              city: usAddress.city,
              state: usAddress.state,
              zip: usAddress.zip,
              birthDate: birthDate,
              spouseBirthDate: spouseBirthDate,
              createdById: returnData.createdById,
              updatedById: returnData.updatedById,
              updatedByName: returnData.updatedByName,
              isDefaultReturn: returnData.isDefaultReturn ? returnData.isDefaultReturn : false,
              returnMode: returnData.returnMode ? returnData.returnMode : undefined,
              modifiedDate: moment(returnData.updatedDate).format('MM/DD/YYYY'),
              transmissionDate: moment(returnData.createdDate).format('MM/DD/YYYY')
            };
            returnList[taxYear].push(returnDetail);

          }
        });
        //  Sort return list from updatedDate
        // here function sort by only sorting in ascending order so we reverse entire list after sorting
        returnList[taxYear] = returnList[taxYear].sort((obj1, obj2) => {
          if (obj1.updatedDate < obj2.updatedDate) {
            return -1;
          }
          if (obj1.updatedDate > obj2.updatedDate) {
            return 1;
          }
          return 0;
        });
        returnList[taxYear] = returnList[taxYear].reverse();

        // If limit is passed, we have to send only that number of records
        // if (limit && returnList[taxYear].length > limit) {
        //   let limitedReturnList = [];
        //   for (let i = 0; i <= limit; i++) {
        //     limitedReturnList.push(returnList[taxYear][i]);
        //   }
        //   resolve(this.filterTemplateFromReturnList(limitedReturnList, isItForCustomTemplate));
        // }
        // Filter the return list based on isItForCustomTemplate flag
        resolve(this.filterTemplateFromReturnList(returnList[taxYear], isItForCustomTemplate));
      }, (error) => {
        // @pending
        // $rootScope.$broadcast('notTransmittedReturnsCounter', 0);
        reject(error);
      });
      return returnList;
    });
  }

  /**
   * @author Mansi Makwana
   * @description  This function is used to Filter the return list based on isItForCustomTemplate flag
   */
  public filterTemplateFromReturnList(returnList, isItForCustomTemplate) {
    if (isItForCustomTemplate === true) {
      // Filter from return list which are isDefaultReturn flag is true
      returnList = returnList.filter((returnObj) => {
        return returnObj.isDefaultReturn === true;
      });
    } else {
      // Filter from return list which are isDefaultReturn flag is false or Undefined
      returnList = returnList.filter((returnObj) => {
        return returnObj.isDefaultReturn === false || (!returnObj.isDefaultReturn);
      });
    }
    return returnList;
  }

  /**
   * @author Mansi Makwana
   * @description  This function is used to  add a sample return in return list
   */
  public addSampleReturns() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.ADD_SAMPLE_RETURNS }).then((response) => {
        resolve('succsess');
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Mansi Makwana
   * @description  This function is used to  filter return list.
   */
  public filterReturnList(filterParams, newReturnList) {
    const self = this;
    const userDetail = self.userService.getUserDetails();
    if (filterParams) {
      if (filterParams.returnType === 'me') {
        newReturnList = newReturnList.filter((t => {
          if (t.createdById === userDetail.key || t.updatedById === userDetail.key) {
            return t;
          }
        }));
        // newReturnList = newReturnList.union(tempResp, newReturnList.filter(tempResp, { updatedById: userDetail.key }));
      }
      // For More return type we need to write conditions here
      if (filterParams.pkgType !== 'all') {
        newReturnList = newReturnList.filter((t => {
          if (t.type === filterParams.pkgType) {
            t.status = newReturnList.status === undefined ? this.userService.getReturnStatusObject(newReturnList.status, undefined, true) : newReturnList.status;
            t.status = t.status.title;
            t.homeTelephone = newReturnList.homeTelephone === undefined ? newReturnList.cellPhoneNumber : newReturnList.homeTelephone;
            return t;
          }
        }));

      }
    }
    return newReturnList;
  }

  /**
   * @author Mansi Makwana
   * @description  This function is used to Filter the return list
   */
  updatefilters(filterParams) {
    const self = this;
    let isItForCustomTemplate: any;
    /**
     * returnList to manage current list and act as cache as well
     */
    let returnList: any = [];
    return new Promise((resolve, reject) => {
      self.getCachedReturnList(isItForCustomTemplate).then((response) => {
        // apply filter
        returnList = this.filterReturnList(filterParams, response);
        //  If limit is passed, we have to send only that number of records
        // if (limit && returnList.length > limit) {
        //   resolve(returnList.splice(0, limit));
        // } else {
        resolve(returnList);
        // }
      }, (error) => {
        reject(error);
      });
      return returnList;
    });
  }

  /**
   * @author Mansi Makwana
   * @description  This function is used to for getting cached return list.
   *  Note:- Return list is used locally, so if we need it in another place we have to make unnecessary API call.
   * 	To avoid this scenario we define following service.
   */
  public getCachedReturnList(isItForCustomTemplate) {
    const self = this;
    let taxYear: number;
    // Object to hold every year list and also act as cache
    let returnList: any = {};
    return new Promise((resolve, reject) => {
      // get the tax year for which user is logged in
      taxYear = self.userService.getTaxYear();
      if (returnList[taxYear] !== undefined && returnList[taxYear].length > 0) {
        resolve(self.filterTemplateFromReturnList(returnList[taxYear], isItForCustomTemplate));
      } else {
        self.getReturnList(undefined, isItForCustomTemplate).then((response) => {
          returnList = response
          resolve(returnList);

        }, (error) => {
          reject(error);
        });
      }
      return returnList;
    });
  }


}
