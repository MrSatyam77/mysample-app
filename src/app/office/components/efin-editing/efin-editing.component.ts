// External Imports
import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

// Internal Imports
import { efinDetail } from '@app/office/office';
import { OfficeService } from '@app/office/office.service';
import { MessageService, DialogService } from '@app/shared/services';
import { VerificationMissingInfoComponent } from '@app/office/dialogs/verification-missing-info/verification-missing-info/verification-missing-info.component';
import { SetupConfirmComponent } from '@app/office/dialogs/setup-confirm/setup-confirm.component';
import { VerificationQuestionsComponent } from '@app/office/dialogs/verification-questions/verification-questions.component';
import { UploadEfinLetterComponent } from '@app/office/dialogs/upload-efin-letter/upload-efin-letter.component';
import { VerificationFailedComponent } from '@app/office/dialogs/verification-failed/verification-failed.component';

@Component({
  selector: 'app-efin-editing',
  templateUrl: './efin-editing.component.html',
  styleUrls: ['./efin-editing.component.scss']
})
export class EfinEditingComponent implements OnInit, OnChanges {

  // holds efin detail object
  @Input() efinDetail: efinDetail = {};

  // holds looup data for locations
  @Input() locationLookupData: Array<any> = [];

  // holds licens owner object
  @Input() licenseOwnerDetail: any = [];

  // holds userlist array to filter ero users
  @Input() userList: any = [];

  // holds logged in user detail
  @Input() loggedInUserDetail: any = {};

  // close event for edit screen
  @Output() close = new EventEmitter<boolean>();

  // ouput event for go to user
  @Output() goToUser = new EventEmitter<string>();

  // ero lookup selection array
  public eroListLookup: Array<any> = [];

  // holds ui form refrence
  public efinEditForm: FormGroup;

  // unlock efin message
  public unlockEFINMessage: string = "Updating any of the following items will require you to complete the EFIN Verification Process again: EFIN, Tracking Number, Firm Name, Firm Address, and/or Associated ERO.";

  constructor(
    private _fb: FormBuilder,
    private _officeService: OfficeService,
    private _messageService: MessageService,
    private _dialogService: DialogService) { }

  // to call api to save efin detail
  public save() {
    let efinDetail: efinDetail = {
      id: this.efinDetail.id,
      efin: this.efinEditForm.controls.efin.value,
      trackingNumber: this.efinEditForm.controls.trackingNumber.value,
      firmName: this.efinEditForm.controls.firmName.value,
      isFirmNameSameAsFirm: this.efinDetail.isFirmNameSameAsFirm,
      firmEIN: this.efinEditForm.controls.firmEIN.value,
      isEINSameAsFirm: this.efinDetail.isEINSameAsFirm,
      efinStatus: this.efinDetail.efinStatus ? this.efinDetail.efinStatus : undefined,
      documentId: this.efinDetail.documentId ? this.efinDetail.documentId : undefined,
      firmAddress: {
        street: this.efinEditForm.controls.street.value,
        postalCode: this.efinEditForm.controls.postalCode.value,
        city: this.efinEditForm.controls.city.value,
        state: this.efinEditForm.controls.state.value,
        country: this.efinEditForm.controls.country.value,
      },
      isAddressSameAsFirm: this.efinDetail.isAddressSameAsFirm,
      associatedUsers: this.efinEditForm.controls.associatedERO.value ? [this.efinEditForm.controls.associatedERO.value] : [],
      efinToUseInOffice: []
    };
    this.locationLookupData.forEach((location) => {
      if (location.isSelected) {
        efinDetail.efinToUseInOffice.push(location.locationId);
      }
    })
    this._officeService.saveEFINDetail(efinDetail).then((result) => {
      this._messageService.showMessage("EFIN detail saved successfully.", "success");
      this.close.emit(true);
    }, (error) => {
      if (error.code === 4044) {
        this._messageService.showMessage("There is already an EFIN exists with same EFIN number, please try again with Other EFIN number.", "error");
      }
    })
  }

  // to cancel editing for efin
  public cancel() {
    this.close.emit(false);
  }

  // to set default value from license owner object if same as frim checkbox is selected by user.
  public setFieldsBasedOnOwner() {
    if (this.efinDetail.isFirmNameSameAsFirm === true) {
      this.efinEditForm.controls.firmName.setValue(this.licenseOwnerDetail.firmName);
      this.efinEditForm.controls.firmName.disable();
    } else {
      this.efinEditForm.controls.firmName.enable();
    }

    if (this.efinDetail.isEINSameAsFirm === true) {
      this.efinEditForm.controls.firmEIN.setValue(this.licenseOwnerDetail.ein);
      this.efinEditForm.controls.firmEIN.disable();
    } else {
      this.efinEditForm.controls.firmEIN.enable();
    }

    if (this.efinDetail.isAddressSameAsFirm === true) {
      if (!this.licenseOwnerDetail.address) {
        this.licenseOwnerDetail.address = {}
      }
      this.efinEditForm.controls.street.setValue(this.licenseOwnerDetail.address.street);
      this.efinEditForm.controls.street.disable();
      this.efinEditForm.controls.city.setValue(this.licenseOwnerDetail.address.city);
      this.efinEditForm.controls.city.disable();
      this.efinEditForm.controls.state.setValue(this.licenseOwnerDetail.address.state);
      this.efinEditForm.controls.state.disable();
      this.efinEditForm.controls.postalCode.setValue(this.licenseOwnerDetail.address.zipCode);
      this.efinEditForm.controls.postalCode.disable();
      this.efinEditForm.controls.country.setValue(this.licenseOwnerDetail.address.country);
      this.efinEditForm.controls.country.disable();
    } else {
      this.efinEditForm.controls.street.enable();
      this.efinEditForm.controls.city.enable();
      this.efinEditForm.controls.state.enable();
      this.efinEditForm.controls.postalCode.enable();
      this.efinEditForm.controls.country.enable();
    }
  }

  // to verify ero
  /**
   * @author Heena  Bhesaniya
   * @description check if any data is missing in evs verification
   * @param eroID  // user id
   */
  public verifyERO(eroID) {
    this._officeService.getUserDetail(eroID).then((wholeUserData: any) => {
      //prepare object to show if any data is mising in evs verification
      let userDetails: any = {
        'Enter your first name': wholeUserData.firstName,
        'Enter your last name': wholeUserData.lastName,
        'Enter your SSN': wholeUserData.ssn,
        'Enter your street': wholeUserData.address && wholeUserData.address.street ? wholeUserData.address.street : '',
        'Enter your city': wholeUserData.address && wholeUserData.address.city ? wholeUserData.address.city : '',
        'Enter your state': wholeUserData.address && wholeUserData.address.state ? wholeUserData.address.state : '',
        'Enter your zip Code': wholeUserData.address && wholeUserData.address.postalCode ? wholeUserData.address.postalCode : '',
        'Enter your email address': wholeUserData.email,
        'Enter your cell phone': wholeUserData.phoneNo,
        'Verify your email address': wholeUserData.isEmailVerified == true ? wholeUserData.isEmailVerified : '',
        'Verify your cell phone': wholeUserData.isPhoneVerified == true ? wholeUserData.isPhoneVerified : ''
      };
      //get keys 
      let keys = Object.keys(userDetails)
      let missingUserData = [];
      //loop on keys  to check id any data is missing
      for (let i in keys) {
        //check if value exist
        if (userDetails[keys[i]] == undefined || userDetails[keys[i]] == '' || userDetails[keys[i]] == null) {//if not then push into mission info data
          missingUserData.push(keys[i])
        }
      }
      //if data is missing then show dialog to user that compelte your missing info first
      if (missingUserData.length > 0) {
        this._dialogService.custom(VerificationMissingInfoComponent, missingUserData, { 'keyboard': false, 'backdrop': 'static', 'size': 'lg' }).result.then((response) => {
          if (response === true) {
            this.goToUser.emit(eroID);
          }
        });
      } else {
        //if information is comeplete then show confirmation dialog
        userDetails.ein = wholeUserData.ein;
        wholeUserData.efin = this.efinEditForm.controls.efin.value ? this.efinEditForm.controls.efin.value : '';
        wholeUserData.firmName = this.efinEditForm.controls.firmName.value;
        wholeUserData.key = eroID;
        if ((wholeUserData && wholeUserData.address && wholeUserData.address.addressType == 2) || wholeUserData.userVerified == false) { // if user addess type is forign then open efin upload letter dialoig
          wholeUserData.efin = this.efinEditForm.controls.efin.value ? this.efinEditForm.controls.efin.value : '';
          wholeUserData.firmName = this.efinEditForm.controls.firmName.value;
          wholeUserData.key = eroID;
          this.openPreparerEfinLetterDialog(wholeUserData);
        } else {
          this.verify(wholeUserData);
        }
      }
    });

  }

  /**
   * @author Heena Bhesaniya
   * @description open confirmation dialog  
   * @param wholeUserData  user details
   */
  public verify(wholeUserData) {
    const self = this;
    this.confirmation(wholeUserData).then((response) => {
      //open question  answer dialog for evs verification
      self._getQuestionsAnswersList(wholeUserData);
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description // call Api for get all Questions
   * @param wholeUserData  user details
   */
  public _getQuestionsAnswersList(wholeUserData) {
    const self = this;
    //prepare object to call evs verification api
    let objectForQuestion = { 'FirstName': wholeUserData.firstName, 'LastName': wholeUserData.lastName, 'Ssn': wholeUserData.ssn, 'Street': wholeUserData.address.street, 'City': wholeUserData.address.city, 'State': wholeUserData.address.state, 'ZipCode': wholeUserData.address.postalCode, 'EmailAddress': wholeUserData.email }
    //open question/answer dialog
    let questionDialog = this._dialogService.custom(VerificationQuestionsComponent, { objectToGetEVSQuestionList: objectForQuestion, userInfo: wholeUserData }, { 'keyboard': false, 'backdrop': 'static', 'size': 'xl' });
    questionDialog.result.then((response) => {
      if (response == true) {
        //if user is verified then make efinStatus 2
        self.efinDetail.efinStatus = 2;
        this.save();
      } else if (response == false) {
        //if userVerified is false them open verfication failed dialog
        self.verificationFailed(wholeUserData);
      } else if (response == 'EfinRequired') {
        //if efin is required then open efin upload dialoag
        self.openPreparerEfinLetterDialog(wholeUserData);
      }
    })
  }

  /** 
   * @author Heena Bhesaniya
   * @description open verfication failed dialog
   * */
  verificationFailed(userDetail) {
    const self = this;
    let dialog = this._dialogService.custom(VerificationFailedComponent, {}, { 'keyboard': false, 'backdrop': 'static', 'size': 'lg' });
    dialog.result.then((response) => {
      if (response === true) {
        //if response if true then open efin upload dialog
        self.openPreparerEfinLetterDialog(userDetail)
      }
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description open efin upload letter dialog
   * @param userDetail 
   */
  openPreparerEfinLetterDialog(userDetail) {
    const self = this;
    let dialog = self._dialogService.custom(UploadEfinLetterComponent, { userInfo: userDetail }, { 'keyboard': false, 'backdrop': 'static', 'size': 'lg' });
    dialog.result.then((response) => {
      //if response is success
      if (response && response.data && response.data.code === 2000) {
        //make efin status 1
        self.efinDetail.efinStatus = 1;
        self.efinDetail.documentId = response.data.documentId;
        this.save();
      }
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description open confirmation dialog 
   * @param wholeUserData 
   */
  public confirmation(wholeUserData) {
    const self = this;
    return new Promise((resolve, reject) => {
      let dialog = self._dialogService.custom(SetupConfirmComponent, { userDetail: wholeUserData }, { 'keyboard': false, 'backdrop': 'static', 'size': 'lg' });
      dialog.result.then((response) => {
        if (response === true) {
          resolve(response);
        }
      });
    });
  }

  // to prepare associated office selection data
  private prepareLocationAndUserSelectionData() {
    this.eroListLookup = this.userList.filter((user) => { return user.isERO === true });
    // selected locations
    this.locationLookupData.forEach((element) => {
      if (this.efinDetail.efinToUseInOffice.indexOf(element.locationId) >= 0) {
        element.isSelected = true;
      }
    })
  }

  // to set values into from controls
  private setValuesIntoForm() {
    this.efinEditForm.setValue({
      efin: this.efinDetail.efin ? this.efinDetail.efin : "",
      trackingNumber: this.efinDetail.trackingNumber ? this.efinDetail.trackingNumber : "",
      firmName: this.efinDetail.firmName ? this.efinDetail.firmName : "",
      firmEIN: this.efinDetail.firmEIN ? this.efinDetail.firmEIN : "",
      street: this.efinDetail.firmAddress && this.efinDetail.firmAddress.street ? this.efinDetail.firmAddress.street : "",
      postalCode: this.efinDetail.firmAddress && this.efinDetail.firmAddress.postalCode ? this.efinDetail.firmAddress.postalCode : "",
      city: this.efinDetail.firmAddress && this.efinDetail.firmAddress.city ? this.efinDetail.firmAddress.city : "",
      state: this.efinDetail.firmAddress && this.efinDetail.firmAddress.state ? this.efinDetail.firmAddress.state : "",
      country: this.efinDetail.firmAddress && this.efinDetail.firmAddress.country ? this.efinDetail.firmAddress.country : "",
      associatedERO: this.efinDetail.associatedUsers && this.efinDetail.associatedUsers.length > 0 ? this.efinDetail.associatedUsers[0] : ""
    })
  }

  // to initialize ui from and define its control
  private createEFINEditFrom() {
    this.efinEditForm = this._fb.group({
      efin: ["", Validators.required],
      trackingNumber: "",
      firmName: ["", [Validators.required, Validators.pattern("(([A-Za-z0-9-\#\(\)]|&|') ?)*([A-Za-z0-9-\#\(\)]|&|')")]],
      firmEIN: "",
      street: ["", Validators.pattern("[A-Za-z0-9]( ?[A-Za-z0-9\-/])*")],
      postalCode: "",
      city: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      state: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      country: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      associatedERO: ""
    })
  }

  ngOnChanges() {
    this.efinDetail = JSON.parse(JSON.stringify(this.efinDetail));
    this.locationLookupData = JSON.parse(JSON.stringify(this.locationLookupData));
    this.userList = JSON.parse(JSON.stringify(this.userList));
    if (!this.efinEditForm) {
      this.createEFINEditFrom();
    }
    this.setValuesIntoForm();
    this.setFieldsBasedOnOwner();
    this.prepareLocationAndUserSelectionData();
  }

  ngOnInit() {
  }

}
