//External Exports
import { Injectable } from '@angular/core';

//Internal Exports
import { CommonAPIService } from '@app/shared/services';
import { APINAME } from '@app/dashboard/dashboard.constants';
import { ReturnAPIService } from '@app/return/return-api.service';

@Injectable({
  providedIn: 'root'
})

export class QuickReturnSummaryService {
  //quickReturnSummary to manage current list and act as cache as well
  public completeSummaryService: any = { quickReturnSummary: {}, quickSummary: {}, message: "Enter a valid SSN/ITIN to view the return's summary." };
  //Is true when the return is found from the data obtained from API else it will be false and error message is show of provided ssn not found 
  public isReturnFound: boolean = false;
  //state list array    
  public StateArray: Array<string> = ['al', 'ar', 'az', 'ca', 'co', 'ct', 'dc', 'de', 'ga', 'hi', 'ia', 'id', 'il', 'in', 'ks', 'ky', 'la', 'md', 'mi', 'me', 'mn', 'mo', 'ms', 'nc', 'nd', 'ne', 'nj', 'nm', 'ny', 'oh', 'or', 'ok', 'pa', 'ri', 'sc', 'va', 'vt', 'wi', 'wv'];
  constructor(private _commonAPIService: CommonAPIService, private _returnAPIService: ReturnAPIService) {
  }

  /**
   * @author Heena Bhesaniya
   * @description api call to open efile base on efile id
   * @param eFileId pass efileid
   */
  public openEFile(eFileId) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonAPIService.getPromiseResponse({ apiName: APINAME.GET_EFILE_OPEN, methodType: 'post', parameterObject: { 'eFileId': eFileId } }).then((response: any) => {
        if (response && response.data) {
          let pom = document.createElement('a');
          pom.setAttribute('href', 'data:Application/xml;charset=utf-8,' + encodeURIComponent(response.data.data));
          pom.setAttribute('download', eFileId + ".xml");
          // Append anchor to body.
          document.body.appendChild(pom);
          pom.click();
          // Remove anchor from body
          document.body.removeChild(pom);
        }
        resolve(response.data);
      }, error => {
        reject(error);
      });
    });
  };

  /**
   * @author Heena Bhesaniya
   * @description 
   * //method prepared to obtained the quick return summary of the ssn propvided by the user
   * NOTE :- This function must be change as the static object are given in which value are set in property.It must be dynamic
   * @param ssnorein 
   * @param SummaryMapping 
   * @param type 
   */
  public getQuickReturnSummary(ssnorein, SummaryMapping, type) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.completeSummaryService.ssnorein = ssnorein;
      //object declared according to the block in quick return summary to store their respective data
      let returnInfo: any = {};
      let taxPayer: any = {};
      let spouse: any = {};
      let preparer: any = {};
      let bank: any = {};
      let income: any = {};
      let credit: any = {};
      let tax: any = {};
      let payment: any = {};
      let eFile: any = {};
      let partnership: any = {};
      let eFileStateDetails = [];
      let stateDetails = [];
      let packageName: string = "";
      let efileHistory = {};
      let returnInfoDoc: any = {};

      //Get return list data, if not available in cache then get data from API
      self._returnAPIService.getReturnList(undefined,false).then((response: any) => {
        // Get return id from given ssn
        //Use _find here
        response.forEach((returnDetail) => {
          // Check whether given ssn exists or not
          if (((type == "SSN" && returnDetail.type == '1040' && returnDetail.ssnOrEinFull == ssnorein.toLowerCase()) ||
             (type == "EIN" && returnDetail.type != '1040' && returnDetail.ssnOrEinFull == ssnorein.toLowerCase()) || 
             (type == "Email" && returnDetail.taxPayerEmail.toLowerCase() == ssnorein.toLowerCase()) ||
              (type == "Name" && returnDetail.taxPayerName.toLowerCase().indexOf(ssnorein.toLowerCase()) > -1 ) || 
              (type == 'Phone' && returnDetail.homeTelephone == ssnorein.toLowerCase())) && this.isReturnFound == false) {

            self.isReturnFound = true;
            // IF ssn exists then get appropriate returnid and get summary of that return
            self._returnAPIService.getQuickReturnSummary(returnDetail.id).then((response: any) => {
              let formName, elementName, usrObject, setKeyObject, setKeyElement, reqForm, reqElement, mainForm, activeForm;
              let clienInfo;
              let clientMainForm;
              let data: any = response.data;

              //Just to check to build the final object
              if (data) {
                //assign efile info
                if (data.eFile) {
                  let EfileKeys = Object.keys(data.eFile);
                  EfileKeys.forEach((EfileState) => {
                    if (EfileState === 'federal')
                      eFile = data.eFile[EfileState];
                    else
                      eFileStateDetails.push(data.eFile[EfileState]);
                  });
                }

                efileHistory = data.efileHistory;

                //letiable for the doc index of independent form and dependent form from the complete return
                let mainDocIndex, reqDocIndex;

                //use pluck here
                for (let countForm = 0; countForm < data["forms"].length; countForm++) {
                  if (data["forms"][countForm]["docName"] == 'dMainInfo') {
                    mainDocIndex = data["forms"][countForm]["docIndex"];
                    break;
                  } else if (data["forms"][countForm]["docName"] == 'd1065CIS') {
                    mainDocIndex = data["forms"][countForm]["docIndex"];
                    break;
                  } else if (data["forms"][countForm]["docName"] == 'd1120CCIS') {
                    mainDocIndex = data["forms"][countForm]["docIndex"];
                    break;
                  } else if (data["forms"][countForm]["docName"] == 'd1120SCIS') {
                    mainDocIndex = data["forms"][countForm]["docIndex"];
                    break;
                  }
                }

                //obtains the clients main form from the response of API
                if (data["docs"]["dMainInfo"]) {
                  if (data["docs"]["dMainInfo"][mainDocIndex]["strform"]) {
                    if (data["docs"]["dMainInfo"][mainDocIndex]["strform"]["value"]) {
                      switch (data["docs"]["dMainInfo"][mainDocIndex]["strform"]["value"]) {
                        case '1':
                          clientMainForm = '1040';
                          break;
                        case '2':
                          clientMainForm = '1040A';
                          break;
                        case '3':
                          clientMainForm = '1040EZ';
                          break;
                        case '4':
                          clientMainForm = '1040NR';
                          break;
                        case '5':
                          clientMainForm = '1040SS(PR)';
                          break;
                        default:
                          clientMainForm = "";
                          break;
                      }
                    }
                  }
                }
                if (data["docs"]["d1065CIS"]) {
                  if (data["docs"]["d1065CIS"][mainDocIndex]['bln1065'] && data["docs"]["d1065CIS"][mainDocIndex]["bln1065"]["value"]) {
                    clientMainForm = '1065';
                  } else if (data["docs"]["d1065CIS"][mainDocIndex]['bln1065B'] && data["docs"]["d1065CIS"][mainDocIndex]["bln1065B"]["value"]) {
                    clientMainForm = '1065B';
                  } else if (data["docs"]["d1065CIS"][mainDocIndex]['bln7004'] && data["docs"]["d1065CIS"][mainDocIndex]["bln7004"]["value"]) {
                    clientMainForm = '7004';
                  }
                }

                if (data["docs"]["d1120CCIS"]) {
                  if (data["docs"]["d1120CCIS"][mainDocIndex]["fillin1120"] && data["docs"]["d1120CCIS"][mainDocIndex]["fillin1120"]["value"]) {
                    switch (data["docs"]["d1120CCIS"][mainDocIndex]["fillin1120"]["value"]) {
                      case '1':
                        clientMainForm = '1120';
                        break;
                      case '2':
                        clientMainForm = '1120C';
                        break;
                      case '3':
                        clientMainForm = '1120H';
                        break;
                      case '4':
                        clientMainForm = '1120L';
                        break;
                      case '5':
                        clientMainForm = '1120POL';
                        break;
                      case '6':
                        clientMainForm = '1120PC';
                        break;
                      case '7':
                        clientMainForm = '7004';
                        break;
                      default:
                        clientMainForm = "";
                        break;
                    }
                  }
                }
                if (data["docs"]["d1120SCIS"]) {
                  clientMainForm = '1120S';
                }

                for (let countData = 0; countData < SummaryMapping.length; countData++) {
                  if (SummaryMapping[countData]["get"]) {
                    formName = SummaryMapping[countData]["get"]["form"];
                    elementName = SummaryMapping[countData]["get"]["getElement"];
                  }
                  //check whether the required object exists for current mapping
                  if (SummaryMapping[countData]["required"]) {
                    reqForm = SummaryMapping[countData]["required"]["form"];
                    reqElement = SummaryMapping[countData]["required"]["getElement"];
                  }
                  //is assign if the header section has the object inside it
                  usrObject = SummaryMapping[countData]["get"]["usrDetail"];
                  mainForm = SummaryMapping[countData]["mainForm"];
                  setKeyObject = SummaryMapping[countData]["set"]["objectName"];
                  setKeyElement = SummaryMapping[countData]["set"]["property"];
                  activeForm = SummaryMapping[countData]["activeForm"];
                  if (formName && formName == 'header') {
                    if (data[formName] && data[formName][usrObject] && data[formName][usrObject][elementName]) {
                      //check which key it belongs to 
                      if (setKeyObject == 'return') {
                        returnInfo[setKeyElement] = data[formName][usrObject][elementName];
                      } else if (setKeyObject == 'taxPayer') {
                        taxPayer[setKeyElement] = data[formName][usrObject][elementName];
                      } else if (setKeyObject == 'partnership') {
                        partnership[setKeyElement] = data[formName][usrObject][elementName];
                      }

                    } else if (data[formName] && data[formName][elementName]) {
                      if (setKeyObject == 'return') {
                        if (elementName == 'packageNames') {
                          //use _.without here (same as used in return service)
                          for (let countPackage = 0; countPackage < data[formName][elementName].length; countPackage++) {
                            if (data[formName][elementName][countPackage] != 'common') {
                              returnInfo[setKeyElement] = packageName = data[formName][elementName][countPackage];
                              break;
                            }
                          }
                        } else {
                          returnInfo[setKeyElement] = data[formName][elementName];
                        }
                      } else if (setKeyObject == 'taxPayer') {
                        taxPayer[setKeyElement] = data[formName][elementName];
                      }
                    } else {
                      if (setKeyObject == 'return') {
                        returnInfo[setKeyElement] = "";
                      } else if (setKeyObject == 'taxPayer') {
                        taxPayer[setKeyElement] = "";
                      }
                    }
                  }

                  //for payment information
                  if(formName && (formName == 'dReturnInfo'  || formName == 'd1065RIS' || formName == "d1120CRIS"  || formName == 'd1120SRIS' || formName =='d1041RIS' || formName == 'd990RIS')){
                    for (let countForm = 0; countForm < data["forms"].length; countForm++) {
                      if (data["forms"][countForm]["docName"] == formName) {
                        returnInfoDoc = data["forms"][countForm]["docIndex"];
                        break;
                      }
                    }
                    if (data["docs"][formName] && data["docs"][formName][returnInfoDoc][elementName] && data["docs"][formName][returnInfoDoc][elementName]["value"] && (setKeyObject == 'return')) {
                      bank[setKeyElement] = data["docs"][formName][returnInfoDoc][elementName]["value"];
                    }
                  }

                  if (formName && (formName == 'dMainInfo' || formName == 'dReturnInfo' || formName == 'd1065CIS' || formName == 'd1065RIS' || formName == "d1120CCIS" || formName == "d1120CRIS" || formName == 'd1120SCIS' || formName == 'd1120SRIS') && !mainForm) {
                    for (let countForm = 0; countForm < data["forms"].length; countForm++) {
                      if (data["forms"][countForm]["docName"] == formName) {
                        mainDocIndex = data["forms"][countForm]["docIndex"];
                        break;
                      }
                    }
                    if (data["docs"][formName] && data["docs"][formName][mainDocIndex][elementName] && data["docs"][formName][mainDocIndex][elementName]["value"]) {
                      switch(data["docs"][formName][mainDocIndex][elementName]["value"]) {
                        case "1":
                          returnInfo[setKeyElement] = "Single";
                          break;
                        case "2":
                          returnInfo[setKeyElement] = "Married filing jointly";
                          break;
                        case "3":
                          returnInfo[setKeyElement] = "Married filing separately";
                          break;
                        case "4":
                          returnInfo[setKeyElement] = "Head of Household";
                          break;
                        case "5":
                          returnInfo[setKeyElement] = "Qualifying widow(er) with dependent child";
                          break;
                        default:
                          if (setKeyObject == 'return') {
                            returnInfo[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'taxPayer') {
                            taxPayer[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'spouse') {
                            spouse[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'preparer') {
                            preparer[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'bank') {
                            bank[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'partnership') {
                            partnership[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          }
                          break;
                      }
                    }
                  } else if (formName && activeForm) { //prepares state details
                    for (let countForm = 0; countForm < data["forms"].length; countForm++) {
                      if (data["forms"][countForm]["docName"] == formName) {
                        mainDocIndex = data["forms"][countForm]["docIndex"];
                        break;
                      }
                    }
                    if (data["docs"][formName] && data["docs"][formName][mainDocIndex] && data["docs"][formName][mainDocIndex]["isActive"] && data["docs"][formName][mainDocIndex]["isActive"]["value"] == true) {
                      if (data["docs"][formName][mainDocIndex][elementName] && data["docs"][formName][mainDocIndex][elementName]["value"]) {
                        if (this.StateArray.includes(setKeyObject)) {
                          let currentIndex = undefined;
                          stateDetails.forEach((state, index) => {
                            if (state.stateName.toUpperCase() == setKeyObject.toUpperCase()) {
                              currentIndex = index;
                            }
                          })
                          if (currentIndex !== null && currentIndex != undefined) {
                            stateDetails[currentIndex][setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else {
                            let currentObject: any = {};
                            currentObject[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                            currentObject.stateName = setKeyObject.toUpperCase();
                            stateDetails.push(currentObject);
                          }
                        }
                      }
                    }
                  }
                  //statistical mapping
                  //checks whether mainform is same as the clientMainForm obtained from API
                  if (mainForm && clientMainForm == mainForm) {
                    mainDocIndex = '';
                    reqDocIndex = '';
                    //obtained the index of mainform and required form
                    for (let countForm = 0; countForm < data["forms"].length; countForm++) {
                      if (mainDocIndex && reqDocIndex && SummaryMapping[countData]["required"]) {
                        break;
                      } else if (mainDocIndex && !SummaryMapping[countData]["required"]) {
                        break;
                      }
                      if (data["forms"][countForm]["docName"] == formName) {
                        mainDocIndex = data["forms"][countForm]["docIndex"];
                      } else if (reqForm && data["forms"][countForm]["docName"] == reqForm) {
                        reqDocIndex = data["forms"][countForm]["docIndex"];
                      }
                    }
                    //condition to check whether current mapping has required object
                    if (SummaryMapping[countData]["required"]) {
                      if (data["docs"][reqForm] && data["docs"][reqForm][reqDocIndex][reqElement] && data["docs"][reqForm][reqDocIndex][reqElement]["value"]) {
                        if (data["docs"][formName] && data["docs"][formName][mainDocIndex][elementName] && data["docs"][formName][mainDocIndex][elementName]["value"]) {
                          if (setKeyObject == 'income') {
                            income[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'credit') {
                            credit[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'tax') {
                            tax[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          } else if (setKeyObject == 'payment') {
                            payment[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];
                          }

                        } else {
                          if (setKeyObject == 'income') {
                            income[setKeyElement] = "";
                          } else if (setKeyObject == 'credit') {
                            credit[setKeyElement] = "";
                          } else if (setKeyObject == 'tax') {
                            tax[setKeyElement] = "";
                          } else if (setKeyObject == 'payment') {
                            payment[setKeyElement] = "";
                          }
                        }
                      } else {
                        if (setKeyObject == 'income') {
                          income[setKeyElement] = "";
                        } else if (setKeyObject == 'credit') {1096903
                          credit[setKeyElement] = "";
                        } else if (setKeyObject == 'tax') {
                          tax[setKeyElement] = "";
                        } else if (setKeyObject == 'payment') {
                          payment[setKeyElement] = "";
                        }
                      }
                    } else {
                      if (data["docs"][formName] && data["docs"][formName][mainDocIndex][elementName] && data["docs"][formName][mainDocIndex][elementName]["value"]) {
                        if (setKeyObject == 'income') {
                          income[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];;
                        } else if (setKeyObject == 'credit') {
                          credit[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];;
                        } else if (setKeyObject == 'tax') {
                          tax[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];;
                        } else if (setKeyObject == 'payment') {
                          payment[setKeyElement] = data["docs"][formName][mainDocIndex][elementName]["value"];;
                        }


                      } else {
                        if (setKeyObject == 'income') {
                          income[setKeyElement] = "";
                        } else if (setKeyObject == 'credit') {
                          credit[setKeyElement] = "";
                        } else if (setKeyObject == 'tax') {
                          tax[setKeyElement] = "";
                        } else if (setKeyObject == 'payment') {
                          payment[setKeyElement] = "";
                        }
                      }
                    }
                  }
                }
              }

              let stateName;
              data.header.states.forEach((state) => {
                if (state != 'federal') {
                  stateName = state;
                }
              })
              // prepare federal efile data
              let federalEfileData: any = [];
              for (let i in eFile) {
                if (eFile[i].returnTypeCategory == 'MainForm' || eFile[i].returnTypeCategory == 'ExtensionForm' || eFile[i].returnTypeCategory == 'AmendedForm') {
                  federalEfileData.push(eFile[i]);
                }
              }

              let stateEfileData: any = [];
              for (let i in eFileStateDetails) {
                for (let j in eFileStateDetails[i]) {
                  if ((eFileStateDetails[i][j].returnTypeCategory == 'MainForm' || eFileStateDetails[i][j].returnTypeCategory == 'ExtensionForm' || eFileStateDetails[i][j].returnTypeCategory == 'AmendedForm') && eFileStateDetails[i][j].stateName == stateName) {
                    stateEfileData.push(eFileStateDetails[i][j]);
                  }
                }
              }

              let paymentInfo = {
                "1040":{
                 "1" : "Bank Product",
                 "2":"Direct Deposit",
                 "3":"Direct Debit",
                 "4":"Paper Check / Pay Balance Due by Mail"
                },
                "common":{
                  "1":"Direct Deposit",
                  "2": "Direct Debit",
                  "3":"Paper Check"
                }
              }
 
               if(bank && bank.refundPaymentType){
                 if(packageName == '1040')
                 bank.paymentOption = paymentInfo[packageName][bank.refundPaymentType];
                 else
                 bank.paymentOption = paymentInfo['common'][bank.refundPaymentType];
               }
 
              //Entire object is built by inserting the different objects according to the block 
              self.completeSummaryService.quickSummary = {
                packageName: packageName,
                stateName: stateName,
                returnInfoDetail: returnInfo,
                taxPayerDetail: taxPayer,
                spouseDetail: spouse,
                preparerDetail: preparer,
                bankDetail: bank,
                incomeDetail: income,
                creditDetail: credit,
                taxDetail: tax,
                paymentDetail: payment,
                eFileDetail: eFile,
                stateDetails: stateDetails,
                eFileStateDetails: eFileStateDetails,
                partnership: partnership,
                efileHistory: efileHistory,
                federalEfileData: federalEfileData,
                stateEfileData: stateEfileData
              };
              self.completeSummaryService.message = '';
              resolve();
            }, (error) => {
              self.completeSummaryService.quickSummary = {};
              //assign the message if the given ssn is not found in the API reponse
              this.completeSummaryService.message = "No information is available for this " + type + "."
              reject();
            });
          }
        });
        if (!this.isReturnFound) {
          this.completeSummaryService.quickSummary = {};
          this.completeSummaryService.message = "No information is available for this " + type + ".";
          resolve();
        }
        //As when the return is found isReturnFound letiable is toggle to true do as service doesn't get refresh every time so 
        //it is neccessary to toggle it back to false if not done than certain functionality will stop working
        if (this.isReturnFound == true) {
          this.isReturnFound = false;
        }
      }, (error) => {
        this.completeSummaryService.quickSummary = {};
        this.completeSummaryService.message = "You have not created any return.";
        this.completeSummaryService.message = "";
        reject();
      });
    });
  };
}
