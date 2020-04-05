// External Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Internal Imports
import { SystemConfigService, UserService, BasketService, DialogService, MessageService } from '@app/shared/services';
import { K1ImportComponent } from '@app/return/dialogs/k1-import/k1-import.component';
import { ProformaCheckComponent } from '@app/return/dialogs/proforma-check/proforma-check.component';
import { ContentService } from '@app/shared/services/content.service';
import { ReturnAPIService } from '@app/return/return-api.service';

@Component({
  selector: 'app-new-return',
  templateUrl: './new-return.component.html',
  styleUrls: ['./new-return.component.scss']
})
export class NewReturnComponent implements OnInit {

  // ui form variable
  public newReturnForm: FormGroup;

  // holds varibale for this component
  public newReturn: any = {
    returnTypeId: "", returnTypeTitle: "", returnType: "normalReturn",
    selectedDefaultReturn: "Please Select", returnWithDefault: "", saveReturnInProcess: false
  };

  // holds return types array
  public returnTypes: Array<any>;

  // holds selcted taxyear value
  public taxYear = this._userService.getTaxYear();

  // holds return list array
  public returnList: any;

  // holds custom return template array
  public defaultReturnList: any = [];

  // holds logged in user detail
  private userDetails = this._userService.getUserDetails();

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _systemConfig: SystemConfigService,
    private _userService: UserService,
    private _returnAPIService: ReturnAPIService,
    private _basketService: BasketService,
    private _dialogService: DialogService,
    private _contentService: ContentService,
    private _messageService: MessageService) { }

  // to redirect back to home screen.
  public backToHomeScreen() {
    this._router.navigateByUrl("/home");
  }

  /**
   * wrapper function that first checks whether entered ssn or ein already exist if yes than we take the confirmation form the user whether he want to create
   * return with same ssn or ein. on basis of his confirmation we take the further steps to create the new return 
   */
  public createReturn(mode?: string) {
    const self = this;
    self.newReturn.saveReturnInProcess = true;
    // @pending
    // _addFederalToCache().then(function () {
    //   This will retrieve the ssn/ein from already existing list and compares with current ssn/ein 
    //   if both same then popup dialog opens with message of duplication of SSN/EIN
    const ssnOrEin = self.newReturn.returnTypeId === '1040' ? this.newReturnForm.controls.ssn.value : this.newReturnForm.controls.ein.value;
    if (self._returnAPIService.checkSSNorEIN(ssnOrEin) && self.newReturn.returnType !== "customReturnTemplate") {
      let dialogRef = self._dialogService.confirm({ title: "Confirmation", text: "There is already a return with this SSN/EIN . Do you want to continue ?" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' })
      dialogRef.result.then((result) => {
        // here if returnType is 1040, than we need to check wheather any K1Data vailable for this SSN.
        if (self.newReturn.returnTypeId === '1040' && self.newReturn.returnType !== 'customReturnTemplate') {
          self.getListOfK1Data(mode, ssnOrEin);
        } else {
          self.callCreateReturnAPI(mode);
        }
      }, (error) => {
        this.newReturn.saveReturnInProcess = false;
      })
    } else {
      // here if returnType is 1040, than we need to check wheather any K1Data available for this SSN.
      if (self.newReturn.returnTypeId === '1040' && self.newReturn.returnType !== 'customReturnTemplate') {
        self.getListOfK1Data(mode, ssnOrEin);
      } else {
        self.callCreateReturnAPI(mode);
      }
    }
    // }, function (error) {
    //   $scope.saveReturnInProcess = false;
    // });
  }

  /**
	* method that get list available k1 data for entered SSN or EIN.
	* @param - mode holds the mode in which return is to be open either 'interview' mode or 'input' mode
	* @param - ssn or ein number. 
	*/
  public getListOfK1Data(mode: string, ssnOrEin: string) {
    const self = this;
    self._returnAPIService.getListOfK1Data([ssnOrEin]).then((response: any) => {
      if (response.length > 0) {
        let dialog = self._dialogService.confirm({ title: "Confirmation", text: "Schedule K-1 data for the shareholder exists, do you want to import the information?" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' })
        dialog.result.then((result) => {
          // if there is multiple k1-data exists for SSN, than we will open the dialog to choose from them.
          // otherwise we will directly import the k1 data.
          if (response.length > 1) {
            // open dialog to show list of k1-data, if multiple k-1 data exists for entered SSN.
            const customDialog = self._dialogService.custom(K1ImportComponent, { 'data': response, 'ssn': ssnOrEin }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
            customDialog.result.then((btn) => {
              let importForms = btn.filter((obj) => { return obj.isSelected === true });
              self.callCreateReturnAPI(mode, importForms);
            });
          } else {
            self.callCreateReturnAPI(mode, response);
          }
        }, (cancel) => {
          self.callCreateReturnAPI(mode);
        })
      } else {
        self.callCreateReturnAPI(mode);
      }
    }, (error) => {
      self.callCreateReturnAPI(mode);
    })
  }

  /**
	* method prepared to create new return
	* @param - mode holds the mode in which return is to be open either 'interview' mode or 'input' mode
	* @param - importForms holds the list of k1-forms that has to be imported.
	*/
  public callCreateReturnAPI(mode: string, importForms?: any) {
    const self = this;
    //this will check the proforma applicable for particular ssn/ein
    self.checkProforma().then(function (proformaDone) {
      if (proformaDone == false) {
        self._contentService.getDefaultReturn(self.newReturn.returnTypeId).then(function (response: any) {
          let taxReturn = response;

          //Generate unique id for new return
          self._returnAPIService.createReturn().then(function (data) {
            //These are header and other common details - These may change as per requirment 
            taxReturn.header.id = data;

            // For More return type we need to write conditions here
            if (self.newReturn.returnTypeId == '1040') {
              taxReturn.header.client.ssn = self.newReturnForm.controls.ssn.value;
              if (self.newReturn.returnType === "customReturnTemplate") {
                taxReturn.header.client.firstName = self.newReturnForm.controls.templateName.value;
              } else {
                taxReturn.header.client.firstName = self.newReturnForm.controls.firstName.value;
                taxReturn.header.client.lastName = self.newReturnForm.controls.lastName.value;
              }

              //ITIN (W7)
              if (self.newReturn.applyForW7 == true) {
                //Add flag
                taxReturn.header.client.applyForW7 = self.newReturn.applyForW7;
                //Add W7 in defaultForms
                taxReturn.defaultForms.push({ "formName": "fW7", "docName": "dW7", "packageName": "1040", "state": "federal" });
              }

              // if user choose to import k1-data.
              if (importForms && importForms.length > 0) {
                taxReturn.importedK1Data = importForms;
              }
            }

            else if (self.newReturn.returnTypeId == '1065' || self.newReturn.returnTypeId == "1120" || self.newReturn.returnTypeId == '1120s' || self.newReturn.returnTypeId == '1041' || self.newReturn.returnTypeId == '990') {
              taxReturn.header.client.ein = self.newReturnForm.controls.ein.value;
              if (self.newReturn.returnType === "customReturnTemplate") {
                taxReturn.header.client.companyName = self.newReturnForm.controls.templateName.value;
              } else {
                taxReturn.header.client.companyName = self.newReturnForm.controls.companyName.value;
              }
            }
            // If it is custom template return then
            if (self.newReturn.returnType === 'customReturnTemplate') {
              taxReturn.header.isDefaultReturn = true;
            }
            //we will set first default status id into header.
            taxReturn.header.status = self._systemConfig.getReturnStatus()[0].id;

            // Multi Year Changes - earlier it was coming from systemConfig (hard coded taxyear), now it will be user selected tax year (fallback to current year)
            taxReturn.header.year = self._userService.getTaxYear();

            if (self.newReturn.returnWithDefault)
              taxReturn.header.returnWithDefault = self.newReturn.returnWithDefault;

            //Recalucate  - false (For future use)
            taxReturn.header.isRecalculate = false;
            //To indicate that this is new return
            taxReturn.header.isNewReturn = true;
            //To indicate by whom return is created
            taxReturn.header.createdByName = self.userDetails.lastName ? (self.userDetails.firstName + " " + self.userDetails.lastName) : self.userDetails.firstName + "";
            //To indicate the id by whom the return is created
            taxReturn.header.createdById = self.userDetails.key;
            //To indicate on which date return is created
            taxReturn.header.createdDate = new Date();

            //we have to set the returnMode in header of taxReturn if the mode is interview
            //Note : we have to do because return get open in input mode from the list though we had opened the return in interview mode when we created the new return 
            if (mode == 'interview') {
              taxReturn.header.returnMode = mode;
            }

            // @pending we have to set flag for return is created in offline mode 
            // if ($scope.isOnline == false) {
            //   //add new flag  for return is created in offline 
            //   taxReturn.header.isCreatedOffline = true;
            // }

            // Pass return to dataAPI for saving
            //Note: We should have to remove this part and rather then opening new return with url, We should have to open it by passing whole return
            self._returnAPIService.addReturn(taxReturn).then(function (success) {
              if (mode == 'interview') {
                //open Interview Mode
                self._router.navigateByUrl('return/interview/' + taxReturn.header.id);
                //$location.path('return/interviewDemo/'+taxReturn.header.id);
              } else {
                //Open Return
                self._router.navigateByUrl('return/edit/' + taxReturn.header.id);
              }
              self.newReturn.saveReturnInProcess = false;
            }, function (error) {
              self.newReturn.saveReturnInProcess = false;
              self._messageService.showMessage('Error in saving newly created return', 'error');
            });

          }, function (error) {
            self.newReturn.saveReturnInProcess = false;
            console.error(error);
          });

        }, function (error) {
          self.newReturn.saveReturnInProcess = false;
          console.error(error);
        });
      } else {
        self.newReturn.saveReturnInProcess = false;
      }
    }, function (error) {
      self.newReturn.saveReturnInProcess = false;
      console.error(error);
    });
  }

  //check the return avalible in prior year return list
  private checkProforma() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (self.newReturn.returnType == 'normalReturn') {
        let ssnOrEin;
        let returnType;
        //this will take the ssn/ein for checking the avaliblity of ssn/ein in prior year return list
        if (self.newReturn.returnTypeId == '1040') {
          ssnOrEin = self.newReturnForm.controls.ssn.value;
          returnType = self.newReturn.returnTypeId;
        } else if (self.newReturn.returnTypeId == '1065' || self.newReturn.returnTypeId == "1120" || self.newReturn.returnTypeId == '1120s' || self.newReturn.returnTypeId == '1041' || self.newReturn.returnTypeId == '990') {
          ssnOrEin = self.newReturnForm.controls.ein.value;
          returnType = self.newReturn.returnTypeId;
        }

        //this will check the ssn/ein avalible in prior year return list
        self._returnAPIService.checkInPriorYearReturnList(ssnOrEin, returnType).then(function (returnId) {
          if (returnId != false) {
            const dialog = self._dialogService.custom(ProformaCheckComponent, returnId, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
            dialog.result.then(function (result) {
              if (result === false) {
                resolve(false);
              } else {
                self._router.navigateByUrl('return/edit/' + result);
                resolve(true);
              }
            }, function (btn) {
              resolve();
            });
          } else {
            //if ssn/ein is not avalible in prior year return list
            resolve(false);
          }
        }, function (error) {
          console.error(error);
        });
      } else {
        // if new custom return template is created
        resolve(false);
      }
    })
  };

  // This function called on change of return type dropdown.
  public onReturnTypeChange(returnType: any) {
    this.newReturn.returnTypeId = returnType.id;
    this.newReturn.returnTypeTitle = returnType.title;
    this.filterDefaultReturn();
    this.updateFormValidation();
  }

  // filter default return list array based on return type
  private filterDefaultReturn() {
    this.defaultReturnList = [];
    this.returnList.forEach((returnObj: any) => {
      if (this.newReturn.returnTypeId && returnObj.type === this.newReturn.returnTypeId) {
        this.defaultReturnList.push({
          returnId: returnObj.id,
          packageName: returnObj.type,
          displayName: returnObj.taxPayerName
        })
      }
    });
  }

  // This function is used to perform initialization logic for this component.
  private init() {
    const self = this;

    self.returnTypes = self._systemConfig.getReleasedPackages();

    let returnType = self._basketService.popItem('newReturnType');

    // Pop item form basket service based on type of new return will create
    self.newReturn.returnType = returnType ? returnType : "normalReturn";

    if (!self.newReturn.returnTypeTitle || !self.newReturn.returnTypeId) {
      self.newReturn.returnTypeTitle = self.returnTypes[0].title;
      self.newReturn.returnTypeId = self.returnTypes[0].id;
    }

    //method called to get the custom template return list
    self._returnAPIService.getCachedReturnList(true).then((response: any) => {
      self.returnList = response;
      self.filterDefaultReturn();
    });

    self._contentService.refreshTaxYear();
  }

  // This function is used update validation on fields based on return type selected and other value.
  public updateFormValidation() {
    const self = this;
    self.newReturnForm.controls.ssn.disable();
    self.newReturnForm.controls.ein.disable();
    self.newReturnForm.controls.firstName.disable();
    self.newReturnForm.controls.lastName.disable();
    self.newReturnForm.controls.companyName.disable();
    self.newReturnForm.controls.templateName.disable();

    if (self.newReturn.returnType === "normalReturn") {
      if (self.newReturn.returnTypeId === "1040") {
        if (!self.newReturn.applyForW7) {
          self.newReturnForm.controls.ssn.enable();
        }
        self.newReturnForm.controls.firstName.enable();
        self.newReturnForm.controls.lastName.enable();
      } else if (self.newReturn.returnTypeId == '1065' || self.newReturn.returnTypeId == '1120' || self.newReturn.returnTypeId == '1120s'
        || self.newReturn.returnTypeId == '1041' || self.newReturn.returnTypeId == '990') {
        self.newReturnForm.controls.ein.enable();
        self.newReturnForm.controls.companyName.enable();
      }
    } else if (self.newReturn.returnType === "customReturnTemplate") {
      self.newReturnForm.controls.templateName.enable();
    }
  }

  // This function is used to define controls of ui form.
  private createNewReturnForm() {
    this.newReturnForm = this._fb.group({
      ssn: ["", Validators.required],
      ein: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      companyName: ["", Validators.required],
      templateName: ["", Validators.required]
    })
    this.updateFormValidation();
  }

  ngOnInit() {
    this.init();
    this.createNewReturnForm();
  }
}
