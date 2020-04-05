/** External */
import { Injectable } from '@angular/core';
import * as moment from 'moment';

/** Internal */
import { CommonAPIService, ResellerService, SystemConfigService, UserService } from '@app/shared/services';
import { APINAME } from './my-taxportal.constant';

@Injectable()
export class MyTaxportalService {

  private invitationStatusEnum = {
    'inProcess': {
      'icon': 'assets/images/mytaxportal/inprocess.png',
      'text': 'In Process',
      'tooltip': 'The Invitation e-mail is being sent. Please click Refresh for the latest invitation status.',
      'className': 'inprocessicon'
    },
    'In Process': {
      'icon': 'assets/images/mytaxportal.png',
      'text': 'In Process',
      'tooltip': 'The Invitation e-mail is being sent. Please click Refresh for the latest invitation status.',
      'className': 'inprocessicon'
    },
    'Invited': {
      'icon': 'assets/images/mytaxportal/inprocess.png',
      'text': 'In Process',
      'tooltip': 'The Invitation e-mail is being sent. Please click Refresh for the latest invitation status.',
      'className': 'inprocessicon'
    },
    'Delivered': {
      'icon': 'assets/images/mytaxportal/delivered.png',
      'text': 'Delivered',
      'tooltip': ' The invitation email has been sent successfully. If your client does not see the invitation in their inbox, please ask them to check their spam folder. If they find it there, please ask them to mark emails from MyTAXPortal as "Not Spam."',
      'className': 'deliveredicon'
    },
    'Accepted': {
      'icon': 'assets/images/mytaxportal/accepted.png',
      'text': 'Accepted',
      'tooltip': 'Your client has accepted the invitation and has also completed the MyTAXPortal account setup.',
      'className': 'acceptedicon'
    },
    'Failed': {
      '400': {
        'icon': 'assets/images/mytaxportal/failed.png',
        'text': 'Failed',
        'tooltip': 'We could not deliver the email after the maximum number of attempts because the sender\'s email address is greylisted by the taxpayer\'s email server. If you wish to complete the request right away, you can use the Send Invitation via SMS feature.',
        'className': 'failedicon'
      },
      '401': {
        'icon': 'assets/images/mytaxportal/failed.png',
        'text': 'Failed',
        'tooltip': 'We could not deliver the email to your client\'s account because their mailbox does not have enough space to receive the emails. Please ask them to increase their email storage capacity or delete some emails in order to receive the email.  If you wish to send the invitation immediately, please click on the Resend option under the Actions dropdown and enter a different email address. You can also use the Send Invitation via SMS feature.',
        'className': 'failedicon'
      },
      '501': {
        'icon': 'assets/images/mytaxportal/failed.png',
        'text': 'Failed',
        'tooltip': 'Your client\'s email address is invalid. Please click on the Resend option under the Actions dropdown and enter a valid email address to complete the invitation process.',
        'className': 'failedicon'
      },
      '503': {
        'icon': 'assets/images/mytaxportal/failed.png',
        'text': 'Failed',
        'tooltip': 'Your client\'s email address is invalid. Please click on the Resend option under the Actions dropdown and enter a valid email address to complete the invitation process.',
        'className': 'failedicon'
      },
      '504': {
        'icon': 'assets/images/mytaxportal/failed.png',
        'text': 'Failed',
        'tooltip': 'Your client\'s email address is invalid. Please click on the Resend option under the Actions dropdown and enter a valid email address to complete the invitation process.',
        'className': 'failedicon'
      },
      '203': {
        'icon': 'assets/images/mytaxportal/alreadyInvited.png',
        'text': 'Already Invited',
        'tooltip': 'This email address is already associated with another taxpayer using MyTAXPortal. Please use a different email address.',
        'className': 'alreadyinvitedicon'
      },
      'default': {
        'icon': 'assets/images/mytaxportal/failed.png',
        'text': 'Failed',
        'tooltip': 'Sorry! We could not deliver the email to the taxpayer. You can use the Send Invitation via SMS feature to complete the invitation request.',
        'className': 'failedicon'
      }
    }
  }

  private showAnswerType = [{ "id": "Yes/No", "displayText": "Yes/No" }, { "id": "Free Text", "displayText": "Free Text" }, { "id": "Document", "displayText": "Document" }];
  private showAnswerYesOrNo = [{ "id": "Yes", "displayText": "Yes is selected" }, { "id": "No", "displayText": "No is selected" }, { "displayText": "Both" }];
  /** constructor */
  constructor(
    private commonApiService: CommonAPIService,
    private userService: UserService,
    private systemConfig: SystemConfigService,
    private resellerService: ResellerService
  ) { }

  /**
   * @author Ravi Shah
   * Get Settings
   * @returns
   * @memberof MyTaxportalService
   */
  public getSettings() {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.GET_SETTING }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Save Company Details
   * @param {*} details
   * @returns
   * @memberof MyTaxportalService
   */
  public saveCompanySettings(details: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.SAVE_COMPANY_SETTING, parameterObject: details }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Save Settings
   * @param {*} details
   * @returns
   * @memberof MyTaxportalService
   */
  public saveSettings(details: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.SAVE_SETTING, parameterObject: details }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah 
   * Remove Company Logo
   * @returns
   * @memberof MyTaxportalService
   */
  public removeCompanyLogo() {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.REMOVE_COMPANY_LOGO }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
    * @author Ravi Shah
    * Get All CLient List
    * @returns
    * @memberof MyTaxportalService
    */
  public getAllClientList() {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.GET_CLIENT_LIST }).then((allClientList: any) => {
        this.getInvitedClientList().then((invitedClients: any) => {
          let clientIds = [];
          if (invitedClients.data) {
            clientIds = invitedClients.data.map(t => t.clientId);
          }
          if (clientIds.length > 0) {
            for (var obj of allClientList.data) {
              obj.isDisabled = clientIds.includes(obj.clientId);
            }
          }
        });
        resolve(allClientList.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Call API to get Invited Client
   * @returns
   * @memberof MyTaxportalService
   */
  public getInvitedClientList() {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.GET_ALL_INVITED_CLIENTS }).then((response) => {
        resolve(response || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah 
   * Get All Invited Clients
   * @returns
   * @memberof MyTaxportalService
   */
  public getAllInvitedClients() {
    return new Promise((resolve, reject) => {
      this.getInvitedClientList().then((response: any) => {
        if (response.data) {
          for (let data of response.data) {
            data.clientName = data.firstName + ' ' + data.lastName;
            data.invitedDateTime = moment(data.invitedDate).format('MM/DD/YYYY hh:mm A');
            data.clientStatus = data.isActiveClient ? 'Active' : 'Inactive';
            data.questionSummary = `${data.answeredQuestions} of ${data.totalQuestions}`;

            if (data.status !== 'Failed' && this.invitationStatusEnum[data.status]) {
              data.icon = this.invitationStatusEnum[data.status].icon;
              data.text = this.invitationStatusEnum[data.status].text;
              data.tooltip = this.invitationStatusEnum[data.status].tooltip;
              data.className = this.invitationStatusEnum[data.status].className;
            } else if (data.status === 'Failed' && this.invitationStatusEnum[data.status]) {
              if (this.invitationStatusEnum[data.status][data.errorCode]) {
                data.icon = this.invitationStatusEnum[data.status][data.errorCode].icon;
                data.text = this.invitationStatusEnum[data.status][data.errorCode].text;
                data.tooltip = this.invitationStatusEnum[data.status][data.errorCode].tooltip;
                data.className = this.invitationStatusEnum[data.status][data.errorCode].className;
                // data.tooltip = this.invitationStatusEnum[data.status][data.errorCode].tooltip;
                // data.className = this.invitationStatusEnum[data.status][data.errorCode].className;
              } else {
                data.icon = this.invitationStatusEnum[data.status]['default'].icon;
                data.text = this.invitationStatusEnum[data.status]['default'].text;
                data.tooltip = this.invitationStatusEnum[data.status]['default'].tooltip;
                data.className = this.invitationStatusEnum[data.status]['default'].className;
              }
            }

            // Checking Mark Answer as Unread Flag
            if (data.answerSubmittedDate) {
              if (data.answerViewDate) {
                if (new Date(data.answerSubmittedDate) > new Date(data.answerViewDate)) {
                  data.markAsUnRead = true;
                } else {
                  data.markAsUnRead = false;
                }
              } else {
                data.markAsUnRead = true;
              }
            } else {
              data.markAsUnRead = false;
            }

            // Checking Mark Signature as Unread Flag
            if (!data.markAsUnRead) {
              if (data.signatureSubmittedDate) {
                if (data.signatureViewDate) {
                  if (new Date(data.signatureSubmittedDate) > new Date(data.signatureViewDate)) {
                    data.markAsUnRead = true;
                  } else {
                    data.markAsUnRead = false;
                  }
                } else {
                  data.markAsUnRead = true;
                }
              } else {
                data.markAsUnRead = false;
              }
            }
          }
        }
        resolve(response || {});
      }, (error) => {
        reject(error);
      });
    });
  }


  /**
   * @author Ravi Shah
   * Call on Active Inactive Invited Client
   * @param {*} clientId
   * @param {*} isActiveClient
   * @returns
   * @memberof MyTaxportalService
   */
  public activeInactiveClient(clientId, isActiveClient) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.CHANGE_CLIENT_STATUS, parameterObject: { clientId: clientId, isActiveClient: isActiveClient } }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Call API to Delete  Invited Client
   * @param {*} params
   * @returns
   * @memberof MyTaxportalService
   */
  public deleteInvitedClient(params: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.DELETE_INVITED_CLIENT, parameterObject: params }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });

  }

  /**
   * @author Ravi Shah
   * Resend Invite Client
   * @param {*} params
   * @returns
   * @memberof MyTaxportalService
   */
  public resendToInviteClient(params: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.RESENT_INVITATION_EMAIL, parameterObject: params }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Change SSN
   * @param {*} params
   * @returns
   * @memberof MyTaxportalService
   */
  public changeSSN(params: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.CHANGE_SSN, parameterObject: params }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Change Clien Phone Number
   * @param {string} clientId
   * @returns
   * @memberof MyTaxportalService
   */
  public getClientsPhone(clientId: string) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.GET_CLIENT_PHONENUMBER, parameterObject: { clientId } }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi SHah
   * Send SMS through Plivo
   * @param {string} clientId
   * @param {string} cellNumber
   * @param {string} preparerName
   * @param {string} message
   * @returns
   * @memberof MyTaxportalService
   */
  public sendTextMessage(clientId: string, cellNumber: string, preparerName: string, message: string) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.CHANGE_LINK_GENERATED_DATE, parameterObject: { 'clientId': clientId, 'phoneNumber': cellNumber } }).then((response) => {
        this.commonApiService.getPromiseResponse({
          apiName: APINAME.PLIVO_SEND_TEXT_MESSAGE, parameterObject: { 'clientId': clientId, 'phone': cellNumber, 'message': message, 'preparerName': preparerName }
        }).then((result) => {
          resolve(true);
        }, (error) => {
          reject(error);
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
  * @author Hitesh Soni
  * Create new Question
  * @returns
  * @memberof MyTaxportalService
  */
  save(data: any) {
    const self = this;
    if (data.id) {
      return new Promise((resolve, reject) => {
        self.commonApiService.getPromiseResponse({ apiName: APINAME.QUESTIONSET_UPDATE, parameterObject: data }).then((response) => {
          if (response.data) { resolve(response); }
          else { resolve([]); }
        }, (error) => {
          reject(error);
        });
      });
    }
    else {
      return new Promise((resolve, reject) => {
        self.commonApiService.getPromiseResponse({ apiName: APINAME.QUESTIONSET_CREATE, parameterObject: data }).then((response) => {
          if (response.data) { resolve(response); }
          else { resolve([]); }
        }, (error) => {
          reject(error);
        });
      });
    }
  }

  /**
  * @author Hitesh Soni
  * Update Question
  * @returns
  * @memberof MyTaxportalService
  */
  updateQuestion(data: any) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.QUESTIONSET_UPDATE, parameterObject: data }).then((response) => {
        if (response.data) { resolve(response); }
        else { resolve([]); }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
  * @author Hitesh Soni
  * Delete Question
  * @returns
  * @memberof MyTaxportalService
  */
  deleteQuestion(questionId: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.QUESTIONSET_DELETE, parameterObject: { 'id': questionId } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
  * @author Hitesh Soni
  * Copy Question set
  * @returns
  * @memberof MyTaxportalService
  */
  copyQuestionSet(questionId: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.QUESTIONSET_COPY, parameterObject: { 'id': questionId } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
  * @author Hitesh Soni
  * Get Question set
  * @returns
  * @memberof MyTaxportalService
  */
  getQuestionSet(questionId: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.QUESTIONSET_GET, parameterObject: { 'id': questionId } }).then((response) => {
        /** View Request */
        let questionData = response.data;
        if (questionId.indexOf('CP-QUESTIONS_') > -1) {
          if (questionData.answers && questionData.answers.length > 0) {
            questionData.questions = JSON.parse(JSON.stringify(questionData.answers));
            for (var index in questionData.questions) {
              questionData.questions[index].answer = questionData.questions[index].answer ? questionData.questions[index].answer : {}
            }
          }
        }

        /** Signature */
        if (questionData.answers) {
          questionData.answers.forEach(element => {
            if (element.type === 'REQ_SIGN') {
              if (element.signatureData && element.signatureData.signatures) {
                element.isTaxPayerSigned = (element.signatureData.signatures.findIndex(function (t) { t.signatureType === 'taxpayer' }) > -1) ? true : false;
                if (element.signatureData.isSpouseSignatureNeeded != false) {
                  element.isSpouseSigned = (element.signatureData.signatures.findIndex(function (t) { t.signatureType === 'spouse' }) > -1) ? true : false;
                } else {
                  element.isSpouseSigned = true;
                }
              } else {
                element.isTaxPayerSigned = false;
                element.isSpouseSigned = false;
              }
            }
            else {
              element.isTaxPayerSigned = true;
              element.isSpouseSigned = true;
            }
          });
        }

        /** Set Default preview mode  and answer type*/
        questionData.questions.forEach(element => {
          element.mode = 'preview';
          if (!element.answerType) {
            element.answerType = JSON.parse(JSON.stringify(this.showAnswerType));
          }
        });
        resolve(questionData);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
  * @author Hitesh Soni
  * check user has client portal access
  * @returns
  * @memberof MyTaxportalService
  */
  canClientPortalAccess() {
    let userDetails = this.userService.getUserDetails();
    let userTaxYear = this.userService.getTaxYear().toString();
    let isVitaCustomer = false
    if (userDetails && userDetails.masterLocationId == this.systemConfig.getVitaCustomerLocation()) {
      isVitaCustomer = true
    }
    // check weather return can disable for offline mode
    if (userTaxYear == 2018 && isVitaCustomer != true && this.resellerService.hasFeature('MYTAXPORTAL')) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author Hitesh Soni
   * Get answer type list
   * @returns
   * @memberof MyTaxportalService
   */
  getAnswerType() {
    return this.showAnswerType;
  }

  /**
   * @author Hitesh Soni
   * Get answer type list
   * @returns
   * @memberof MyTaxportalService
   */
  getShowAnswer() {
    return this.showAnswerYesOrNo;
  }

  /* @author Ravi Shah
   * Call Api for Delete Client 
   * @param {string} clientId
   * @returns
   * @memberof MyTaxportalService
   */
  public deleteClient(clientId: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.DELETE_CLIENT, parameterObject: { clientId } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Call API for Save Client
   * @param {*} dataItem
   * @returns
   * @memberof MyTaxportalService
   */
  public saveClient(dataItem: any) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.SAVE_CLIENT, parameterObject: dataItem }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Hitesh
   * Call API for download pdf
   * @param {*} pdfLink
   * @returns
   * @memberof MyTaxportalService
   */
  downloadReturnDocument(pdfLink) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.RETURN_PDF_DOWNLOAD + pdfLink, methodType: "get" }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Hitesh
   * Call API for download document by docid
   * @param {*} pdfLink
   * @returns
   * @memberof MyTaxportalService
   */
  downloadDocument(docId) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.DOWNLOAD_DOCUMENT, parameterObject: { "docId": docId } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Hitesh
   * Convert Convert base64file to blob
   * @param {*} pdfLink
   * @returns
   * @memberof MyTaxportalService
   */
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    let sliceSize = 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  /**
   * Assign id 
   * @param allQuestions 
   * @param removeMode 
   */
  public assignId(allQuestions, removeMode?: any) {
    let counter = Math.max(allQuestions.questions.map(x => { return x ? x : 0 }));
    counter = counter ? counter : 0;
    allQuestions.questions.forEach(element => {
      counter += 1;
      element.id = element.id ? element.id : counter;
      if (removeMode) {
        delete element.mode;
      }
    });
  }

  /**
   * Process history data
   * @param history 
   */
  public processHistoryData(history) {
    let allHistory = [];
    history.forEach(element => {
      let newObj = {} as any;
      if (element.name.indexOf('yesNo') > -1) {
        newObj.name = 'Yes No';
      } else if (element.name.indexOf('files') > -1) {
        newObj.name = 'Documents';
      } else if (element.name.indexOf('freeText') > -1) {
        newObj.name = 'Free Text';
      }

      /** Old value */
      if (element.name === 'files') {
        let oldVal = element.oldValue && element.oldValue.length > 0 ? element.oldValue.split(',') : undefined;
        newObj.oldValue = [];
        if (oldVal) {
          for (let index in oldVal) {
            let fileObj = {
              fileName: oldVal[index].split(':')[0],
              docId: oldVal[index].split(':')[1]
            };
            newObj.oldValue.push(fileObj);
          }
        }
      } else {
        newObj.oldValue = element.oldValue;
      }

      /** New value */
      if (element.name === 'files') {
        var newVal = element.newValue && element.newValue.length > 0 ? element.newValue.split(',') : undefined;
        newObj.newValue = [];
        if (newVal) {
          for (var index in newVal) {
            var fileObj = {
              fileName: newVal[index].split(':')[0],
              docId: newVal[index].split(':')[1]
            };
            newObj.newValue.push(fileObj);
          }
        }
      } else {
        newObj.newValue = element.newValue;
      }

      newObj.changeDate = moment(element.changeDate).format('MM/DD/YYYY hh:mm A');
      if (newObj.name) {
        allHistory.push(newObj)
      }
    });

    return allHistory;
  }

  public sendInvitation(sendInviteClientData: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.SEND_INVITATION, parameterObject: { clients: sendInviteClientData } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  public markViewed(clientRequestData: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.MARK_AS_READ, parameterObject: clientRequestData }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
}
