import { Injectable } from '@angular/core';
import { CommonAPIService, UserService } from '@app/shared/services';
import { APINAME } from '@app/dashboard/dashboard.constants';
import * as moment from 'moment';

@Injectable()
export class RejectedReturnService {
  public readonly columnsList: any = {
    'one': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: 'col-6 text-truncate'
    }, {
      fieldName: 'name',
      displayText: "TAXPAYER'S NAME",
      className: 'col text-truncate'
    }, {
      fieldName: 'type',
      displayText: 'RETURN TYPE',
      className: 'col-6 text-truncate'
    }],
    'two': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: 'col-4 text-truncate'
    }, {
      fieldName: 'name',
      displayText: "TAXPAYER'S NAME",
      className: 'col text-truncate'
    }, {
      fieldName: 'type',
      displayText: 'RETURN TYPE',
      className: 'col-4 text-truncate'
    }, {
      fieldName: 'acknowledgementDate',
      displayText: 'REJECTED DATE',
      className: 'col-6 text-truncate'
    }
    ],
    'three': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: 'col-2 text-truncate'
    }, {
      fieldName: 'name',
      displayText: "TAXPAYER'S NAME",
      className: 'col text-truncate'
    }, {
      fieldName: 'type',
      displayText: 'RETURN TYPE',
      className: 'col-3 text-truncate'
    }, {
      fieldName: 'acknowledgementDate',
      displayText: 'REJECTED DATE',
      className: 'col-4 text-truncate'
    },
    {
      fieldName: 'rejectedCode',
      displayText: ' REJECT CODE',
      className: 'col-4 text-truncate'
    }],
    'four': [{
      fieldName: 'ssnOrEin',
      displayText: 'SSN/EIN',
      className: 'col-2 text-truncate'
    }, {
      fieldName: 'name',
      displayText: "TAXPAYER'S NAME",
      className: 'col text-truncate'
    }, {
      fieldName: 'type',
      displayText: 'RETURN TYPE',
      className: 'col-3 text-truncate'
    }, {
      fieldName: 'acknowledgementDate',
      displayText: 'REJECTED DATE',
      className: 'col-4 text-truncate'
    },
    {
      fieldName: 'rejectedCode',
      displayText: ' REJECT CODE',
      className: 'col-4 text-truncate'
    }]
  };
  constructor(private commonApiService: CommonAPIService, private userService: UserService) { }
  /**
   * @author Om kanada
   * @description
   *          Call API to get state rejected returns.
   */
  public getRejectedReturns() {
    const self = this;
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_REJECT_RETURNS, parameterObject: { status: '8' } }).then((response: any) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Om kanada
   * @description
   *          This function will call API to get rejected return of banks.
   */
  public getBankRejectedReturns() {
    const self = this;
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_BANK_REJECTION_RETURNS, parameterObject: { status: '' } }).then((response: any) => {
        const bankRejectedReturns = [];
        response.data.forEach(obj => {
          if (obj.eFileStatus && obj.eFileStatus === 14) {
            obj.type = 'bank';
            bankRejectedReturns.push(obj);
          }
        });
        resolve(bankRejectedReturns);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Om kanada
   * @description
   *          Return list of of both combine bank and state rejected returns.
   */
  public getRejectedReturnList(limit: number) {
    const self = this;
    return new Promise((resolve, reject) => {
      // get state rejected returns
      self.getRejectedReturns().then((aReturns: any) => {
        // get bank rejected returns
        self.getBankRejectedReturns().then((bReturns: any) => {
          const rejectedReturnListData = self.prepareReturnListData(aReturns.concat(bReturns), limit);
          for (const rejectedReturns of rejectedReturnListData) {
            if (rejectedReturns.isConvertedReturn || rejectedReturns.isProformaReturn) {
              rejectedReturns.className = ' fa fa-exchange';
            } else if (rejectedReturns.isLocked) {
              rejectedReturns.className = 'fa fa-lock';
            } else if (rejectedReturns.isCheckedOut) {
              rejectedReturns.className = 'fa fa-shield-alt';
            } else {
              rejectedReturns.className = 'margin_right_17';
            }
          }
          resolve(rejectedReturnListData);
        }, (error) => {
          reject(error);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Om kanada
   * @description
   *         Process data according to rejected return list structure.
   */
  public prepareReturnListData(data: Array<any>, limit: number) {
    const self = this;
    let rejectedReturnList = [];
    let packageName;
    const userDetail = self.userService.getUserDetails(undefined);
    data.forEach(rejectedReturnData => {
      if (rejectedReturnData) {
        // Get pacakge name other then 'common'
        // tslint:disable-next-line:max-line-length
        if (rejectedReturnData.packageNames[1] === 'common') {
          packageName = rejectedReturnData.packageNames[0];
        }
        // Flag is used to check whether return is opened by current user or not.
        let isCheckedOut = rejectedReturnData.isCheckedOut;
        if (userDetail.email === rejectedReturnData.email) {
          isCheckedOut = false;
        }
        let taxPayerName = '';
        let ssnOrEinFull;
        let ssnOrEin;
        // We have to check undefined condition separately other wise last name overrides everything.
        if (packageName === '1040') {
          const taxpayerFirstName = rejectedReturnData.client.firstName === undefined ? '' : rejectedReturnData.client.firstName;
          const taxpayerLastName = rejectedReturnData.client.lastName === undefined ? '' : rejectedReturnData.client.lastName;
          taxPayerName = taxpayerFirstName + ' ' + taxpayerLastName;
          ssnOrEinFull = rejectedReturnData.client.ssn;
          ssnOrEin = ssnOrEinFull.substring(7);
          // tslint:disable-next-line:max-line-length
        } else if (packageName === '1065' || packageName === '1120' || packageName === '1120s' || packageName === '1041' || packageName === '990') {
          taxPayerName = rejectedReturnData.client.companyName;
          ssnOrEinFull = rejectedReturnData.client.ein;
          ssnOrEin = ssnOrEinFull.substring(6);
        }
        // Return list structure.
        let rejectedReturnDetail = {
          ssnOrEinFull: ssnOrEinFull,
          ssnOrEin: ssnOrEin,
          name: taxPayerName,
          errorCount: rejectedReturnData.errorCount,
          email: rejectedReturnData.email,
          checkedOutBy: rejectedReturnData.checkedOutBy,
          isLocked: rejectedReturnData.isLocked === undefined ? false : rejectedReturnData.isLocked,
          isCheckedOut: isCheckedOut === undefined ? false : isCheckedOut,
          isConvertedReturn: rejectedReturnData.isConvertedReturn === undefined ? false : rejectedReturnData.isConvertedReturn,
          isProformaReturn: rejectedReturnData.isProformaReturn === undefined ? false : rejectedReturnData.isProformaReturn,
          id: rejectedReturnData.id,
          acknowledgementDate: rejectedReturnData.acknowledgementDate ? moment(rejectedReturnData.acknowledgementDate).format('MM/DD/YYYY') : '',
          returnMode: rejectedReturnData.returnMode,
          type: rejectedReturnData.returnType ? rejectedReturnData.returnType.toUpperCase() : '',
          rejectedCode: rejectedReturnData.rejectedCode
        };
        rejectedReturnList.push(rejectedReturnDetail);
      }
    });
    //  Sort rejected return list from updatedDate
    // here function sort by only sorting in ascending order so we reverse entire list after sorting
    rejectedReturnList = rejectedReturnList.sort((obj1, obj2) => {

      if (obj1.updatedDate < obj2.updatedDate) {
        return -1;
      }
      if (obj1.updatedDate > obj2.updatedDate) {
        return 1;
      }
      return 0;
    });
    rejectedReturnList = rejectedReturnList.reverse();
    let limitedRejectedReturnList = rejectedReturnList;
    // If limit is passed, we have to send only that number of records
    // if ((limit) && rejectedReturnList.length > limit) {
    //   limitedRejectedReturnList = [];
    //   for (let i = 0; i < limit; i++) {
    //     limitedRejectedReturnList.push(rejectedReturnList[i]);
    //   }
    // }
    return limitedRejectedReturnList;
  }

  public get ColumnSize() {
    return this.columnsList;
  }


}
