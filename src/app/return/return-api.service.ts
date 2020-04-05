// External Imports
import { Injectable, Injector } from "@angular/core";
import * as moment from "moment";

// Internal Imports
import { UserService } from '@app/shared/services/user.service';
import { APINAME } from "@app/return/return.constants";
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { UtilityService } from '@app/shared/services/utility.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';

@Injectable({
  providedIn: 'root'
})

export class ReturnAPIService {
  // Object to hold every year list and also act as cache
  private returnList: any = {};
  // holds selected taxyear
  private taxYear = this._userService.getTaxYear();
  // Array to hold values of return status
  public returnStatus = ['In Process', 'Complete', 'Incomplete'];

  constructor(
    private _userService: UserService,
    private _commonAPIService: CommonAPIService,
    private _utilityService: UtilityService,
    private _injector: Injector) {
    this.init();
  }

  // Filter the return list based on isItForCustomTemplate flag
  private filterTemplateFromReturnList(_returnList: any, _isItForCustomTemplate: boolean): any {
    if (_isItForCustomTemplate === true) {
      // Filter from return list which are isDefaultReturn flag is true
      _returnList = _returnList.filter((returnObj) => {
        return returnObj.isDefaultReturn === true;
      });
    } else {
      // Filter from return list which are isDefaultReturn flag is false or Undefined
      _returnList = _returnList.filter((returnObj) => {
        return !returnObj.isDefaultReturn;
      });
    }
    return _returnList;
  }

  // Method to get Return list from API
  //Note: currently limit is only used to split last records. In future we have to pass this limit to Data API, so it only send last records.
  public getReturnList(limit?: number, _isItForCustomTemplate?: boolean, moduleName?: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      //load list from data api
      self._commonAPIService.getPromiseResponse({ apiName: APINAME.RETURN_LIST, parameterObject: { moduleName: moduleName } }).then((response) => {
        //get the tax year for which user is logged in
        self.taxYear = self._userService.getTaxYear();
        // Empty return list, Otherwise repeated data will append
        self.returnList[self.taxYear] = [];
        // To check whether return is opened by current user or not.
        let userDetail = self._userService.getUserDetails();
        // API return data in Different format, we need to format data in defined structure.
        response.data.forEach((returnData) => {
          // Package name list.We use this because we only need first package name after removing 'common' name.
          if (returnData) {
            //Get pacakge name other then 'common'
            let _packageName = returnData.packageNames.filter((obj) => {
              return obj !== 'common'
            })[0];

            // Flag is used to check whether return is opened by current user or not.
            let isCheckedOut = returnData.isCheckedOut;
            if (userDetail.email === returnData.email) {
              isCheckedOut = false;
            }

            let taxPayerName = "", ssnOrEinFull = undefined, ssnOrEin = undefined, birthDate = undefined;
            let spouseName = "", spouseBirthDate = undefined;
            let usAddress = { street: "", city: "", state: "", zip: "" };
            let taxpayerFirstName = "", taxpayerLastName = "", businessName = "";
            let states = "";

            // store state list without federal and converts string into uppercase
            if (returnData.states) {
              let statesList = JSON.parse(JSON.stringify(returnData.states));
              statesList.splice(0, 1)
              states = statesList.join(", ").toUpperCase();
            }

            // We have to check undefined condition separately other wise last name overrides everything.
            if (_packageName == "1040") {
              taxpayerFirstName = returnData.client.firstName == undefined ? "" : returnData.client.firstName;
              taxpayerLastName = returnData.client.lastName == undefined ? "" : returnData.client.lastName;
              taxPayerName = taxpayerFirstName + " " + taxpayerLastName;
              ssnOrEinFull = returnData.client.ssn == undefined ? "" : returnData.client.ssn;
              ssnOrEin = returnData.client.applyForW7 != true ? ssnOrEinFull.substring(7) : "Apply W7";

              //prepare spouse name
              let spouseFirstName = returnData.client.spouseFirstName == undefined ? "" : returnData.client.spouseFirstName;
              let spouseLastName = returnData.client.spouseLastName == undefined ? "" : returnData.client.spouseLastName;
              spouseName = spouseFirstName + " " + spouseLastName;

              birthDate = returnData.client.birthDate;
              spouseBirthDate = returnData.client.spouseBirthDate;

            } else if (_packageName == "1065" || _packageName == "1120" || _packageName == "1120s" || _packageName == "1041" || _packageName == "990") {
              taxPayerName = returnData.client.companyName;
              taxpayerFirstName = returnData.client.companyName;
              ssnOrEinFull = returnData.client.ein == undefined ? "" : returnData.client.ein;
              ssnOrEin = ssnOrEinFull.substring(6);
              businessName = returnData.client.companyName;
            }

            //prepare us address for printing usaddress in export list.
            if (returnData.client.usAddress) {
              if (returnData.client.usAddress.street && returnData.client.usAddress.street != "") {
                usAddress.street = returnData.client.usAddress.street;
              }

              if (returnData.client.usAddress.city) {
                usAddress.city = returnData.client.usAddress.city;
              }

              if (returnData.client.usAddress.state) {
                usAddress.state = returnData.client.usAddress.state;
              }

              if (returnData.client.usAddress.zip) {
                usAddress.zip = returnData.client.usAddress.zip;
              }
            }

            // Return list structure.
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
              status: self._userService.getReturnStatusObject(returnData.status, undefined, true),
              statustitle: returnData.status.title,
              taxPayerName: taxPayerName,
              taxpayerFirstName: taxpayerFirstName,
              taxpayerLastName: taxpayerLastName,
              businessName: businessName,
              type: _packageName,
              year: returnData.year,
              updatedDate: returnData.updatedDate == undefined ? "2014-01-01T00:00:00+00:00" : returnData.updatedDate,
              eFileStatus: returnData.eFileStatus,
              homeTelephone: returnData.client.homeTelephone == undefined ? "" : returnData.client.homeTelephone,
              taxPayerEmail: returnData.client.email == undefined ? "" : returnData.client.email,
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
              isDefaultReturn: (returnData.isDefaultReturn) ? returnData.isDefaultReturn : false,
              returnMode: (returnData.returnMode) ? returnData.returnMode : undefined,
              subType: returnData.subType ? returnData.subType : ""
            };
            self.returnList[self.taxYear].push(returnDetail);
          }
        });



        //  Sort return list from updatedDate
        // here function sort by only sorting in ascending order so we reverse entire list after sorting
        self.returnList[self.taxYear] = this._utilityService.sortByProperty(self.returnList[self.taxYear], 'updatedDate').reverse();

        if (!moduleName) {
          //If limit is passed, we have to send only that number of records
          if (limit && self.returnList[self.taxYear].length > limit) {
            let limitedReturnList = JSON.parse(JSON.stringify(self.returnList[self.taxYear].slice(0, limit)));
            resolve(self.filterTemplateFromReturnList(limitedReturnList, _isItForCustomTemplate));
          } else {
            // Filter the return list based on isItForCustomTemplate flag
            resolve(self.filterTemplateFromReturnList(JSON.parse(JSON.stringify(self.returnList[self.taxYear])), _isItForCustomTemplate));
          }
        } else {
          if (limit && self.returnList[self.taxYear].length > limit) {
            let limitedReturnList = JSON.parse(JSON.stringify(self.returnList[self.taxYear].slice(0, limit)));
            resolve({
              data: self.filterTemplateFromReturnList(limitedReturnList, _isItForCustomTemplate),
              gridPref: response.gridPref
            });
          } else {
            // Filter the return list based on isItForCustomTemplate flag
            resolve({
              data: self.filterTemplateFromReturnList(JSON.parse(JSON.stringify(self.returnList[self.taxYear])), _isItForCustomTemplate),
              gridPref: response.gridPref
            });
          }
        }

      }, (error) => {
        // @pending
        // $rootScope.$broadcast('notTransmittedReturnsCounter', 0);
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *         This will give previous year return list
   */
  public getPriorYearReturnList() {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonAPIService.getPromiseResponse({ apiName: APINAME.PRIORYEAR_RETURN_LIST }).then((response) => {
        //get the tax year for which user is logged in
        self.taxYear = self._userService.getTaxYear();
        //getting previous year
        let prevTaxYear = (parseInt(self.taxYear) - 1).toString();
        // Empty return list, Otherwise repeated data will append
        self.returnList[prevTaxYear] = [];
        // API return data in Different format, we need to format data in defined structure.
        response.data.forEach((returnData) => {
          // Package name list.We use this because we only need first package name after removing 'common' name.
          if (returnData) {
            //Get pacakge name other then 'common'
            let _packageName = returnData.packageNames.filter((obj) => {
              return obj !== 'common'
            })[0];

            let taxPayerName = "", ssnOrEinFull = undefined, ssnOrEin = undefined;
            // We have to check undefined condition separately other wise last name overrides everything.
            if (_packageName == "1040") {
              let taxpayerFirstName = returnData.client.firstName == undefined ? "" : returnData.client.firstName;
              let taxpayerLastName = returnData.client.lastName == undefined ? "" : returnData.client.lastName;
              taxPayerName = taxpayerFirstName + " " + taxpayerLastName;
              ssnOrEinFull = returnData.client.ssn == undefined ? "" : returnData.client.ssn;
              ssnOrEin = ssnOrEinFull.substring(7);

            } else if (_packageName == "1065" || _packageName == "1120" || _packageName == "1120s" || _packageName == "1041" || _packageName == "990") {
              taxPayerName = returnData.client.companyName;
              ssnOrEinFull = returnData.client.ein == undefined ? "" : returnData.client.ein;
              ssnOrEin = ssnOrEinFull.substring(6);
            }

            // Return list structure.
            let returnDetail = {
              id: returnData.id,
              ssnOrEin: ssnOrEin,
              taxPayerName: taxPayerName,
              type: _packageName,
              year: returnData.year,
              updatedByName: returnData.updatedByName,
              isProformaProceed: returnData.isProformaProceed,
              isDefaultReturn: (returnData.isDefaultReturn) ? returnData.isDefaultReturn : false,
            };
            //as we are getting the return list of previous year we need to store those return to its belonging year in returnList object
            self.returnList[prevTaxYear].push(returnDetail);
          }
        });
        resolve(self.returnList[prevTaxYear]);
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   *	Following Service is used for check the newly return
   *				is avalible in prior year return list
   *	with the checking of 'performaRequest' property in header
   */
  public checkInPriorYearReturnList(ssnOrEin: string, returnType: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.PRIORYEAR_RETURN_CHECK,
        parameterObject: { ssnOrEin: ssnOrEin, returnType: returnType }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        resolve(false);
      });
    })
  }

  /**
   * Following service is used to perform proforma on
   * 					single return and create a new
   *  return in current year tax software
   */
  public proformaOnNewReturn(returnId: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.PROFORMA_NEW_RETURN,
        parameterObject: {
          returnId: returnId
        }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      })
    })
  }

  /*
   *  Following Service is used for getting cached return list.
   *  Note:- Return list is used locally, so if we need it in another place we have to make unnecessary API call.
   * 			To avoid this scenario we define following service.
  */
  public getCachedReturnList(_isItForCustomTemplate?: boolean) {
    const self = this;
    return new Promise((resolve, reject) => {
      //get the tax year for which user is logged in
      self.taxYear = self._userService.getTaxYear();

      if (self.returnList[self.taxYear] && self.returnList[self.taxYear].length > 0) {
        resolve(self.filterTemplateFromReturnList(JSON.parse(JSON.stringify(self.returnList[self.taxYear])), _isItForCustomTemplate));
      } else {
        self.getReturnList(undefined, _isItForCustomTemplate).then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        })
      }
    })
  }


  /*
   *  Following Service is used for getting summary of return
   *
   */
  public getQuickReturnSummary(returnId: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.RETURN_SUMMARY,
        parameterObject: {
          returnId: returnId
        }
      }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    })
  }


  //This method is used to push new return
  //Note: We may not required this method, If we pass whole return in workspace instead of saving it and then re opening it via url
  public addReturn(tempReturn: any) {
    return new Promise((resolve, reject) => {
      this.saveReturn(tempReturn).then((success) => {
        resolve(success);
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
  * This method will call api and return unique id for return
  */
  public createReturn() {
    const self = this;
    //genUniqueReturnId
    return new Promise((resolve, reject) => {
      //Call API
      self._commonAPIService.getPromiseResponse({
        apiName: APINAME.CREATE_RETURN,
        parameterObject: {
          "deviceInformation": self._utilityService.getDeviceInformation()
        }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      })
    })
  }

  //This method return tax return based on Id and dataRequired(i.e from where does the return is required either from draft or latest)
  public openReturn(returnId: string, dataSource: string) {
    return new Promise((resolve, reject) => {
      //load list from data api
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.OPEN_RETURN,
        parameterObject: {
          returnId: returnId,
          dataSource: dataSource
        }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
      //To avoid circular dependecy
      let systemConfig = this._injector.get(SystemConfigService);
      systemConfig.loadRefundStatusLinks();
    })
  }

  //Close Return
  public closeReturn(returnData: any, saveBeforeClose: boolean) {
    const self = this;
    return new Promise((resolve, reject) => {
      if (saveBeforeClose === true) {
        //Call save return service
        self.saveReturn(returnData).then((success) => {
          self.callCloseReturnAPI(returnData.header.id).then((success) => {
            resolve("success");
          }, (error) => {
            reject(error);
          })
        }, (error) => {
          reject(error);
        })
      } else {
        self.callCloseReturnAPI(returnData.header.id).then((success) => {
          resolve("success");
        }, (error) => {
          reject(error);
        })
      }
    })
  }

  /**
   * Used to call close return api.
   * @param returnId 
   *        Holds returnId
   */
  private callCloseReturnAPI(returnId: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonAPIService.getPromiseResponse({
        apiName: APINAME.CLOSE_RETURN, parameterObject: { returnId: returnId }
      }).then((success) => {
        resolve('success');
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @param returnData 
   *            Holds return data
   * @param isAuto 
   *            Holds boolean flag whether return is auto saved or not.
   * @description
   *            Used to save return
   */
  public saveReturn(returnData: any, isAuto?: boolean) {
    const self = this;
    return new Promise((resolve, reject) => {
      let updatedReturnData = returnData;
      //update header info from docs.
      //Note: This needs to move on calculation side.
      if (!returnData.header.isNewReturn) {
        let packageName = returnData.header.packageNames.filter((obj) => {
          return obj !== 'common'
        })[0];

        if (packageName && packageName == "1040") {
          updatedReturnData = self.prepare1040ReturnData(returnData);
        } else if (packageName == "1065") {
          updatedReturnData = self.prepare1065ReturnData(returnData);
        } else if (packageName == "1120") {
          updatedReturnData = self.prepare1120ReturnData(returnData);
        } else if (packageName == "1120s") {
          updatedReturnData = self.prepare1120sReturnData(returnData);
        } else if (packageName == "1041") {
          updatedReturnData = self.prepare1041ReturnData(returnData);
        } else if (packageName == "990") {
          updatedReturnData = self.prepare990ReturnData(returnData);
        }
      }

      //Call Data API to save reuturn
      //Note: Currently by default we are passing 'FULL_RETURN' to dump whole return on save at server.
      //But soon, we have to change it and dump only once after new return and we need change tracker
      self._commonAPIService.getPromiseResponse({
        apiName: APINAME.SAVE_RETURN,
        parameterObject: {
          returnId: updatedReturnData.header.id,
          content: [{
            cmd: isAuto === true ? "DRAFT_RETURN" : "FULL_RETURN",
            data: updatedReturnData
          }],
          deviceInformation: self._utilityService.getDeviceInformation()
        }
      }).then((success) => {
        resolve('success');
      }, (error) => {
        reject(error);
      });

    })
  }


  /**
   * @author Hannan Desai
   * @param returnData 
   * @description
   *        Used to modify data on save return for 1040 package.
   */
  private prepare1040ReturnData(returnData: any): any {
    if (returnData.docs && returnData.docs.dMainInfo) {
      //get Maininfo doc
      let keys = Object.keys(returnData.docs.dMainInfo);
      let dMainInfo = returnData.docs.dMainInfo[keys[0]];

      if (dMainInfo) {
        //tax payer first name
        if (dMainInfo.tpfnmi && dMainInfo.tpfnmi.value) {
          returnData.header.client.firstName = dMainInfo.tpfnmi.value;
        }

        //tax payer las name
        if (dMainInfo.tplnm && dMainInfo.tplnm.value) {
          returnData.header.client.lastName = dMainInfo.tplnm.value;
        }

        //tax payer ssn
        if (dMainInfo.tpssn && dMainInfo.tpssn.value) {
          returnData.header.client.ssn = dMainInfo.tpssn.value;
        }

        //tax payer phone number
        if (dMainInfo.strfgtptel && dMainInfo.strfgtptel.value) {
          returnData.header.client.homeTelephone = dMainInfo.strfgtptel.value;
        } else {
          returnData.header.client.homeTelephone = undefined;
        }

        //tax payer work phone number
        if (dMainInfo.strtpcellfax && dMainInfo.strtpcellfax.value) {
          returnData.header.client.cellPhoneNumber = dMainInfo.strtpcellfax.value;
        } else {
          returnData.header.client.cellPhoneNumber = undefined;
        }

        //tax payer cell phone number
        if (dMainInfo.strworktptel && dMainInfo.strworktptel.value) {
          returnData.header.client.workTelePhone = dMainInfo.strworktptel.value;
        } else {
          returnData.header.client.workTelePhone = undefined;
        }

        //tax payer spouse first Name
        if (dMainInfo.strspfnmi && dMainInfo.strspfnmi.value) {
          returnData.header.client.spouseFirstName = dMainInfo.strspfnmi.value;
        }

        //tax payer spouse last Name
        if (dMainInfo.strsplnm && dMainInfo.strsplnm.value) {
          returnData.header.client.spouseLastName = dMainInfo.strsplnm.value;
        }


        //email address
        if (dMainInfo.strtpeml && dMainInfo.strtpeml.value) {
          returnData.header.client.email = dMainInfo.strtpeml.value;
        } else {
          returnData.header.client.email = undefined;
        }

        //client birthdate
        if (dMainInfo.strtpdob && dMainInfo.strtpdob.value) {
          returnData.header.client.birthDate = dMainInfo.strtpdob.value;
        }

        //spouse birthdate
        if (dMainInfo.strspdob && dMainInfo.strspdob.value) {
          returnData.header.client.spouseBirthDate = dMainInfo.strspdob.value;
        }

        // us address
        let usAddress: any = {};
        if (dMainInfo.strusaptno && dMainInfo.strusaptno.value) {
          usAddress.appartmentNo = dMainInfo.strusaptno.value;
        }

        if (dMainInfo.strusstrt && dMainInfo.strusstrt.value) {
          usAddress.street = dMainInfo.strusstrt.value;
        }

        if (dMainInfo.struszip && dMainInfo.struszip.value) {
          usAddress.zip = dMainInfo.struszip.value;
        }

        if (dMainInfo.struscty && dMainInfo.struscty.value) {
          usAddress.city = dMainInfo.struscty.value;
        }

        if (dMainInfo.strusst && dMainInfo.strusst.value) {
          usAddress.state = dMainInfo.strusst.value;
        }

        // Apt Number
        if (dMainInfo.strusaptno && dMainInfo.strusaptno.value) {
          returnData.header.client.aptNumber = dMainInfo.strusaptno.value;
        }

        returnData.header.client.usAddress = usAddress;

        //applyForW7
        if (dMainInfo.tpApplyForW7 && dMainInfo.tpApplyForW7.value) {
          returnData.header.client.applyForW7 = dMainInfo.tpApplyForW7.value;
        } else {
          returnData.header.client.applyForW7 = false;
        }
      }
    }

    if (returnData.docs && returnData.docs.dReturnInfo) {
      //get return info doc
      var keys = Object.keys(returnData.docs.dReturnInfo);
      var dReturnInfo = returnData.docs.dReturnInfo[keys[0]];
      if (dReturnInfo.strRefundType) {
        returnData.header.client.refundType = dReturnInfo.strRefundType;
      }
    }
    return returnData;
  }

  /**
   * @author Hannan Desai
   * @param returnData 
   * @description
   *        Used to modify data on save return for 1065 package.
   */
  private prepare1065ReturnData(returnData: any): any {
    if (returnData.docs && returnData.docs.d1065CIS) {
      //get client info
      let keys = Object.keys(returnData.docs.d1065CIS);
      let d1065CIS = returnData.docs.d1065CIS[keys[0]];

      if (d1065CIS) {
        //EIN
        if (d1065CIS.EIN && d1065CIS.EIN.value) {
          returnData.header.client.ein = d1065CIS.EIN.value;
        }

        //company name
        if (d1065CIS.PartnerName && d1065CIS.PartnerName.value) {
          returnData.header.client.companyName = d1065CIS.PartnerName.value;
        }

        //Phone
        if (d1065CIS.Phone && d1065CIS.Phone.value) {
          returnData.header.client.homeTelephone = d1065CIS.Phone.value;
        } else {
          returnData.header.client.homeTelephone = undefined;
        }

        //us address
        let usAddress: any = {};
        if (d1065CIS.USStreet && d1065CIS.USStreet.value) {
          usAddress.street = d1065CIS.USStreet.value;
        }

        if (d1065CIS.USZip && d1065CIS.USZip.value) {
          usAddress.zip = d1065CIS.USZip.value;
        }

        if (d1065CIS.USCity && d1065CIS.USCity.value) {
          usAddress.city = d1065CIS.USCity.value;
        }

        if (d1065CIS.USState && d1065CIS.USState.value) {
          usAddress.state = d1065CIS.USState.value;
        }

        // Apt Number
        if (d1065CIS.strusaptno && d1065CIS.strusaptno.value) {
          returnData.header.client.aptNumber = d1065CIS.strusaptno.value;
        }

        returnData.header.client.usAddress = usAddress;
      }
    }
    return returnData;
  }

  /**
   * @author Hannan Desai
   * @param returnData 
   * @description
   *        Used to modify data on save return for 1120 package.
   */
  private prepare1120ReturnData(returnData: any): any {
    if (returnData.docs && returnData.docs.d1120CCIS) {
      //get client info
      let keys = Object.keys(returnData.docs.d1120CCIS);
      let d1120CCIS = returnData.docs.d1120CCIS[keys[0]];

      if (d1120CCIS) {
        //EIN
        if (d1120CCIS.EIN && d1120CCIS.EIN.value) {
          returnData.header.client.ein = d1120CCIS.EIN.value;
        }

        //name
        if (d1120CCIS.NameofCorporation && d1120CCIS.NameofCorporation.value) {
          returnData.header.client.companyName = d1120CCIS.NameofCorporation.value;
        }

        //us address
        let usAddress: any = {};
        if (d1120CCIS.StreetAddress && d1120CCIS.StreetAddress.value) {
          usAddress.street = d1120CCIS.StreetAddress.value;
        }

        if (d1120CCIS.Zipcode && d1120CCIS.Zipcode.value) {
          usAddress.zip = d1120CCIS.Zipcode.value;
        }

        if (d1120CCIS.City && d1120CCIS.City.value) {
          usAddress.city = d1120CCIS.City.value;
        }

        if (d1120CCIS.State && d1120CCIS.State.value) {
          usAddress.state = d1120CCIS.State.value;
        }

        // Apt Number
        if (d1120CCIS.strusaptno && d1120CCIS.strusaptno.value) {
          returnData.header.client.aptNumber = d1120CCIS.strusaptno.value;
        }

        returnData.header.client.usAddress = usAddress;
      }
    }
    return returnData;
  }

  /**
   * @author Hannan Desai
   * @param returnData 
   * @description
   *        Used to modify data on save return for 1120s package.
   */
  private prepare1120sReturnData(returnData: any): any {
    if (returnData.docs && returnData.docs.d1120SCIS) {
      //get client info
      let keys = Object.keys(returnData.docs.d1120SCIS);
      let d1120SCIS = returnData.docs.d1120SCIS[keys[0]];

      if (d1120SCIS) {
        //EIN
        if (d1120SCIS.EIN && d1120SCIS.EIN.value) {
          returnData.header.client.ein = d1120SCIS.EIN.value;
        }

        //name
        if (d1120SCIS.NameofSCorporation && d1120SCIS.NameofSCorporation.value) {
          returnData.header.client.companyName = d1120SCIS.NameofSCorporation.value;
        }

        //us address
        let usAddress: any = {};
        if (d1120SCIS.Address && d1120SCIS.Address.value) {
          usAddress.street = d1120SCIS.Address.value;
        }

        if (d1120SCIS.Zipcode && d1120SCIS.Zipcode.value) {
          usAddress.zip = d1120SCIS.Zipcode.value;
        }

        if (d1120SCIS.city && d1120SCIS.city.value) {
          usAddress.city = d1120SCIS.city.value;
        }

        if (d1120SCIS.state && d1120SCIS.state.value) {
          usAddress.state = d1120SCIS.state.value;
        }

        // Apt Number
        if (d1120SCIS.strusaptno && d1120SCIS.strusaptno.value) {
          returnData.header.client.aptNumber = d1120SCIS.strusaptno.value;
        }

        returnData.header.client.usAddress = usAddress;
      }
    }
    return returnData;
  }

  /**
   * @author Hannan Desai
   * @param returnData 
   * @description
   *        Used to modify data on save return for 1041 package.
   */
  private prepare1041ReturnData(returnData: any): any {
    if (returnData.docs && returnData.docs.d1041CIS) {
      //get client info
      let keys = Object.keys(returnData.docs.d1041CIS);
      let d1041CIS = returnData.docs.d1041CIS[keys[0]];

      if (d1041CIS) {
        //EIN
        if (d1041CIS.EIN && d1041CIS.EIN.value) {
          returnData.header.client.ein = d1041CIS.EIN.value;
        }
        //name
        if (d1041CIS.Nameofestate && d1041CIS.Nameofestate.value) {
          returnData.header.client.companyName = d1041CIS.Nameofestate.value;
        }

        // Apt Number
        if (d1041CIS.strusaptno && d1041CIS.strusaptno.value) {
          returnData.header.client.aptNumber = d1041CIS.strusaptno.value;
        }
      }
    }
    return returnData;
  }

  /**
   * @author Hannan Desai
   * @param returnData 
   * @description
   *        Used to modify data on save return for 990 package.
   */
  private prepare990ReturnData(returnData: any): any {
    if (returnData.docs && returnData.docs.d990CIS) {
      //get client info
      let keys = Object.keys(returnData.docs.d990CIS);
      let d990CIS = returnData.docs.d990CIS[keys[0]];

      if (d990CIS) {
        //EIN
        if (d990CIS.EIN && d990CIS.EIN.value) {
          returnData.header.client.ein = d990CIS.EIN.value;
        }
        //name
        if (d990CIS.PartnerName && d990CIS.PartnerName.value) {
          returnData.header.client.companyName = d990CIS.PartnerName.value;
        }
        // Apt Number
        if (d990CIS.strusaptno && d990CIS.strusaptno.value) {
          returnData.header.client.aptNumber = d990CIS.strusaptno.value;
        }
      }
    }
    return returnData;
  }

  //this method used to backup all the doc in returnIds
  public backupReturn(returnIds: Array<any>) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.BACKUP_RETURN,
        parameterObject: { 'backupReturnIds': returnIds }
      }).then((documentKey) => {
        resolve(documentKey);
      }, (error) => {
        reject(error);
      });
    })
  }

  //this method used to proforma the all the doc in returnIds
  public proformaOnReturn(returnIds: Array<any>, isFullPerforma: boolean) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.PROFORMA_RETURN,
        parameterObject: { "proformaReturnIds": returnIds, "isFullPerforma": isFullPerforma }
      }).then((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    })
  }

  // This method changes the status of selected return
  public changeReturnStatus(returnData: any) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.RETURN_CHANGE_STATUS,
        parameterObject: {
          'changeStatus': {
            returnId: returnData.id,
            status: returnData.status
          }
        }
      }).then((success) => {
        resolve('success');
      }, (error) => {
        reject(error);
      });
    })
  };

  // This method delete return
  public deleteReturn(returnIds: Array<any>) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.DELETE_RETURN,
        parameterObject: {
          'deleteReturn': {
            returnIds: returnIds,
          }
        }
      }).then((success) => {
        resolve('success');
      }, (error) => {
        reject(error);
      });
    })
  };

  // Following service is used to add a sample return in return list
  public addSampleReturns() {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.ADD_SAMPLE_RETURN,
        parameterObject: {}
      }).then((success) => {
        resolve('success');
      }, (error) => {
        reject(error);
      });
    })
  }

  //This method is used to invoke send efile on server
  public sendEfile(returnId: string, states: any, packageName: string, stateOnly: boolean) {
    return new Promise((resolve, reject) => {
      //get device information
      let deviceInformation = this._utilityService.getDeviceInformation();

      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.CREATE_EFILE,
        parameterObject: {
          'returnId': returnId,
          'states': states,
          'packageName': packageName,
          'stateOnly': stateOnly,
          'timeStamp': moment().format(),
          'deviceId': deviceInformation.deviceId,
          "deviceInformation": deviceInformation
        }
      }).then((success) => {
        resolve('success');
      }, (error) => {
        reject(error);
      });
    })
  }

  //to set class base on return status
  public setReturnClass(returnObj: any): string {
    if (returnObj.isCheckedOut)
      return 'fa-shield-alt';
    else if (returnObj.isLocked)
      return 'fa-lock';
    else if (returnObj.isConvertedReturn)
      return 'fa-exchange-alt';
    else if (returnObj.isProformaReturn)
      return 'fa-exchange-alt';
    else if (returnObj.isRestoredReturn)
      return 'fa-exchange-alt';
    else if (returnObj.isRemoteSignLocked)
      return 'fa-lock';
    else
      return 'margin_right_0';
  }

  /**
  * method to call API which set return as a default return
  */
  public manageDefaultReturn(action: string, returnId: string, returnTitle?: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.MANAGE_DEFAULT_RETURN,
        parameterObject: {
          returnId: returnId,
          returnTitle: returnTitle,
          action: action
        }
      }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
  * method to call API which get default return detail
  */
  public getTaxReturn(returnId: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.GET_DEFAULT_RETURN,
        parameterObject: {
          returnId: returnId
        }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      })
    })
  }


  // This function checks ssn or ein inside returnList array
  //If ssn or ein exist than it will return true else false
  public checkSSNorEIN(ssnOrein: string): boolean {
    //get the tax year for which user is logged in
    this.taxYear = this._userService.getTaxYear();
    let isExist = false;
    //loop over returnlist
    this.returnList[this.taxYear].forEach((returnObj) => {
      if (returnObj.ssnOrEinFull == ssnOrein) {
        isExist = true;
        return false;//loop break
      }
    });
    return isExist;
  }

  /**
   * method call API that returns the list of k1Data available for particular SSN or EIN number
  */
  public getListOfK1Data(ssnOrEin: any) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.GET_LIST_K1,
        parameterObject: {
          number: ssnOrEin
        }
      }).then(function (response) {
        resolve(response.data);
      }, function (error) {
        reject(error);
      })
    })
  }

  /**
   * this function calls APi that get return k1 Data of given returns based on returnId.
   */
  public getK1DataFromReturn(k1ToImport: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.GET_RETURN_K1DATA,
        parameterObject: {
          k1ToImport: k1ToImport
        }
      }).then(function (response) {
        resolve(response.data);
      }, function (error) {
        reject(error);
      })
    })
  }

  // call api to create copy of return
  public createDuplicateReturn(returnId: string, type: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.CREATE_DUPLICATE_RETURN,
        parameterObject: { returnId: returnId, type: type }
      }).then((result) => {
        resolve(result.data)
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *         To perform initialiation logic.
   */
  private init() {
    //loop over available years to maintain the return list year wise in returnList obj
    this._userService.getAvailableTaxYears().forEach((yearObj) => {
      this.returnList[yearObj.id] = [];
    });
  }
}