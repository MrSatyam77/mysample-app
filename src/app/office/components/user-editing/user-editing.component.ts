// External Imports
import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// Internal Imports
import { userDetail } from '@app/office/office';
import { OfficeService } from '@app/office/office.service';
import { MessageService, DialogService, UserService, CommunicationService, SystemConfigService, UtilityService } from '@app/shared/services';
import { EmailVerificationComponent } from '@app/office/dialogs/email-verification/email-verification.component';
import { PhoneVerificationComponent } from '@app/office/dialogs/phone-verification/phone-verification.component';
import { environment } from '@environments/environment';
import {SignatureService} from '@app/signature/signature.service';

@Component({
  selector: 'app-user-editing',
  templateUrl: './user-editing.component.html',
  styleUrls: ['./user-editing.component.scss']
})
export class UserEditingComponent implements OnInit, OnChanges, OnDestroy {
  // holds control of ui form
  public userEditFrom: FormGroup;

  // holds user detail obj
  @Input() userDetail: userDetail = {};

  // holds lookupData for locations and roles
  @Input() lookupData: any = {};

  // efin efiling status
  @Input() efinEfilingStatus: number;

  // holds logged in user deatil
  @Input() loggedInUserDetail: any = {};

  // output event for refresh office list after successfull save.
  @Output() close = new EventEmitter<any>();

  // element refrence of user image element
  @ViewChild('userImage', { static: true }) userImage: ElementRef;

  // rights object
  public userCan: any = { removeSignature: this._userService.can("CAN_REMOVE_SIGNATURE") };

  // list of cpuntry fro country lookup
  public countryLookupList: any = this._systemConfig.getCountryDetail();

  // unlock user message
  public unlockUserMessage: string = "Updating any of the following items will require you to complete the Verification Process again: First Name, Last Name, Email, Recovery Email, Cell Phone, SSN, and/or ERO Personal Address.";

  // subscribe to form value chnage to perfrom custom logic on value changes
  private emailChangeSubscription: any;
  private secondaryEmailChangeSubscription: any;
  private phoneChangeSubscription: any;
  private addressTypeSubscription: any;

  constructor(
    private _fb: FormBuilder,
    private _officeService: OfficeService,
    private _messageService: MessageService,
    private _dialogService: DialogService,
    private _userService: UserService,
    private _signatureService: SignatureService,
    private _systemConfig: SystemConfigService,
    private _utilityService: UtilityService) { }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to call API to save user detail.
   */
  public save() {
    // check wheteher new user or existing user to save.
    if (this.userDetail.key === "newUser") {
      this._officeService.createNewUser(this.prepareUserSaveObj()).then((result) => {
        this._messageService.showMessage("User created successfully.", "success");
        this.close.emit({ save: true, close: true });
      }, (error) => {
        if (error.code === 4000) {
          this._messageService.showMessage("User with entered emailId already exists.", "error");
        } else if (error.code === 4021) {
          this._messageService.showMessage("Please buy additional user subscription.", "error");
        }
      })
    } else {
      this._officeService.updateUserDetail(this.prepareUserSaveObj()).then((result) => {
        // if logged in user data updated than also change session response in memory eith latest one
        if (this.loggedInUserDetail.emailHash === this.userDetail.key) {
          this._userService.syncUserDetailsWithApi().then((response) => {
            this._messageService.showMessage("User saved successfully.", "success");
            this.close.emit({ save: true, close: true });
          })
        } else {
          this._messageService.showMessage("User saved successfully.", "success");
          this.close.emit({ save: true, close: true });
        }
      }, (error) => {
        if (error.code === 4021) {
          this._messageService.showMessage("Please buy additional user subscription.", "error");
        }
      })
    }
  }

  // cancel event for editing scrrent
  public cancel() {
    this.close.emit({ save: false, close: true });
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to prepare user object to save.
   */
  private prepareUserSaveObj(): userDetail {
    let updatedUserDetail: userDetail = {
      key: this.userDetail.key,
      firstName: this.userEditFrom.controls.firstName.value,
      lastName: this.userEditFrom.controls.lastName.value,
      email: this.userEditFrom.controls.email.value,
      phoneNo: this.userEditFrom.controls.phoneNo.value,
      showReturn: this.userEditFrom.controls.showReturn.value,
      isActiveUser: this.userDetail.isActiveUser,
      userType: [],
      isSelfEmployed: this.userDetail.isSelfEmployed,
      secondaryEmail: this.userDetail.secondaryEmail,
      recoveryEmail: this.userDetail.secondaryEmail === true ? this.userEditFrom.controls.recoveryEmail.value : undefined,
      isAdministrator: this.userDetail.isAdministrator,
      isContractContact: this.userDetail.isContractContact,
      twoFactorAuthentication: this.userDetail.twoFactorAuthentication,
      isPhoneVerified: this.userDetail.isPhoneVerified,
      isEmailVerified: this.userDetail.isEmailVerified,
      isSecondaryEmailVerified: this.userDetail.isSecondaryEmailVerified
    }

    // based on user type we have added some field conditionally.
    if (this.userDetail.isPreparer === true || this.userDetail.isERO === true) {
      updatedUserDetail.address = {
        addressType: this.userEditFrom.controls.addressType.value,
        street: this.userEditFrom.controls.street.value,
        postalCode: this.userEditFrom.controls.postalCode.value,
        city: this.userEditFrom.controls.city.value,
        state: this.userEditFrom.controls.state.value,
        country: this.userEditFrom.controls.addressType.value === 2 ? this.userEditFrom.controls.country.value : undefined
      }

      // ERO specific fields
      if (this.userDetail.isERO === true) {
        updatedUserDetail.userType.push(2);
        updatedUserDetail.ssn = this.userEditFrom.controls.ssn.value;
      }

      // preparer specific fields
      if (this.userDetail.isPreparer === true) {
        updatedUserDetail.userType.push(1);
        updatedUserDetail.ein = !this.userDetail.isSelfEmployed ? this.userEditFrom.controls.ein.value : undefined;
        updatedUserDetail.PTIN = this.userEditFrom.controls.ptin.value ? "P" + this.userEditFrom.controls.ptin.value : undefined;
        updatedUserDetail.STIN = this.userEditFrom.controls.stin.value ? "S" + this.userEditFrom.controls.stin.value : undefined;
        updatedUserDetail.PPIN = this.userEditFrom.controls.ppin.value;
        updatedUserDetail.preparerId = this.userEditFrom.controls.preparerId.value;

        updatedUserDetail.isPreparerEmailSameAsLogin = this.userDetail.isPreparerEmailSameAsLogin;
        updatedUserDetail.preparerEmail = this.userDetail.isPreparerEmailSameAsLogin === true ? undefined : this.userEditFrom.controls.preparerEmail.value;
        updatedUserDetail.isPreparerPhoneSameAsLogin = this.userDetail.isPreparerPhoneSameAsLogin;
        updatedUserDetail.preparerPhone = this.userDetail.isPreparerPhoneSameAsLogin === true ? undefined : this.userEditFrom.controls.preparerPhone.value;
        updatedUserDetail.thirdPartyDesignee = this.userDetail.thirdPartyDesignee;

        updatedUserDetail.efilingStates = [];
        // nm state field
        if (this.userDetail.isNMEfileState) {
          updatedUserDetail.NM_CRS = this.userEditFrom.controls.nmCRS.value;
          updatedUserDetail.efilingStates.push("NM");
        }

        // ny state fields
        if (this.userDetail.isNYEfileState) {
          updatedUserDetail.NYTPRIN = this.userEditFrom.controls.nytprin.value;
          updatedUserDetail.NY_ExemptCode = this.userEditFrom.controls.nyExemptCode.value;
          updatedUserDetail.efilingStates.push("NY");
        }

        // or state fields
        if (this.userDetail.isOREfileState) {
          updatedUserDetail.OR_LicenseNumber = this.userEditFrom.controls.orLicenseNumber.value;
          updatedUserDetail.efilingStates.push("OR");
        }
      }
    }

    // selcted office object
    updatedUserDetail.locations = {};
    this.lookupData.locations.forEach(location => {
      if (location.isSelected === true) {
        updatedUserDetail.locations[location.locationId] = location.roleId
      }
    });
    return updatedUserDetail;
  }

  /**
   * @author Hannan Desai
   * @description
   *        To prepare data for location selection in user edit screen based on selected role model.
   */
  private prepareLocationSelectionData() {
    this.lookupData.locations.forEach(location => {
      if (this.userDetail.locations[location.locationId]) {
        location.isSelected = true;
        location.roleId = this.userDetail.locations[location.locationId];
      }
    });
  }

  // to verify primary email of user.
  public verifyEmail(type: boolean) {
    let emailToVerify = type === true ? this.userEditFrom.controls.email.value : this.userEditFrom.controls.recoveryEmail.value;
    this._officeService.sendMailForEmailVerify(emailToVerify).then((response: any) => {
      this._dialogService.custom(EmailVerificationComponent, {
        otpDocKey: response.id,
        userId: this.userDetail.key,
        email: emailToVerify
      }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' }).result.then((result) => {
        if (result === true) {
          if (type === true) {
            this.userDetail.isEmailVerified = true;
            this.userDetail.email = emailToVerify
          } else {
            this.userDetail.isSecondaryEmailVerified = true;
            this.userDetail.recoveryEmail = emailToVerify;
          }
        }
      })
    })
  }

  // to verify user phone send message with code.
  public verifyPhone() {
    this._officeService.sendMessageForPhoneVerify(this.userEditFrom.controls.phoneNo.value).then((response: any) => {
      this._dialogService.custom(PhoneVerificationComponent, {
        otpDocKey: response,
        userId: this.userDetail.key,
        phoneNo: this.userEditFrom.controls.phoneNo.value
      }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' }).result.then((result) => {
        if (result === true) {
          this.userDetail.isPhoneVerified = true;
          this.userDetail.phoneNo = this.userEditFrom.controls.phoneNo.value;
        }
      })
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to open signature capture dialog from anguar.
   */
  public captureSignature() {
    let data = [{
      type: this.userDetail.isERO === true ? 1 : 2,
      ID: this.userDetail.key,
      name: this.userEditFrom.controls.firstName.value + " " + this.userEditFrom.controls.lastName.value
    }];
    this._signatureService.openSignatureCaptureDialog(data).then((result) => {
      this._officeService.getUserDetail(this.userDetail.key).then((response: any) => {
        this.userDetail.signatures = response.signatures;
        this.userDetail.signatureImage = response.signatureImage
      })
    })
  }

  // when user chnage ero checkbox to true than we also have to default set preparer true also.
  public onSelectionOfERO() {
    if (!this.userDetail.isERO && this.userDetail.isAssociatedWithEfin === true) {
      this.userDetail.isERO = true;
      this._dialogService.notify({ title: "Cannot Change User Type", text: "You cannot change this user's type because it is associated to EFIN. If you want to change his user type, Please remove his association from EFIN.", type: "" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' });
    }
    if (this.userDetail.isERO === true) {
      this.userDetail.isPreparer = true;
    }
  }

  // here we have to check if there is no other contract contact available than prevent user to uncheck contract contact check box and show alert box
  public checkIfNoContractContact() {
    if (!this.userDetail.isContractContact) {
      if (this._officeService.getContractContactsCount() <= 1) {
        this.userDetail.isContractContact = true;
        this._dialogService.notify({ title: "Notification", text: "You need to keep atleast one license contact.", type: "notify" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' })
          .result.then((data) => { })
      }
    }
  }

  // to browse image
  public browseImage() {
    this.userImage.nativeElement.value = "";
    this.userImage.nativeElement.click();
  }

  // chnage event for image input
  public updateUserImage(event) {
    const self = this;
    var oFReader = new FileReader();
    oFReader.readAsDataURL(event.target.files[0]);

    oFReader.onload = function (oFREvent: any) {
      self.userDetail.userImageSrc = oFREvent.target.result;
      self.uploadProfileImage(event.target.files[0].name, oFREvent.target.result);
    }
  }

  // call api to upload profie image
  private uploadProfileImage(fileName: string, image: string) {
    this._officeService.uploadProfileImage(fileName, image, this.userDetail.key).then((result) => {
      this._messageService.showMessage("Profile picture updated usccessfully.", "success");
      this.close.emit({ save: true, close: false });
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to set validation on field conditionally,Based on user type selection.
   */
  private setUserTypeConditionalValidators() {
    // if user type is normal user than we have to disable this fields, otherwise it will cause a form validation error even if its hidden.
    // it is reactive form issue it will not remove the validation for hidden field, we have to find a proper solution for this in future.
    this.userEditFrom.controls.addressType.disable();
    this.userEditFrom.controls.street.disable();
    this.userEditFrom.controls.postalCode.disable();
    this.userEditFrom.controls.city.disable();
    this.userEditFrom.controls.state.disable();
    this.userEditFrom.controls.country.disable();
    this.userEditFrom.controls.ein.disable();
    this.userEditFrom.controls.ssn.disable();
    this.userEditFrom.controls.ptin.disable();
    this.userEditFrom.controls.stin.disable();

    // enable preparer based fields
    if (this.userDetail.isPreparer === true) {
      if (this.userDetail.isPreparerEmailSameAsLogin === undefined) {
        this.userDetail.isPreparerEmailSameAsLogin = true;
      }
      if (this.userDetail.isPreparerPhoneSameAsLogin === undefined) {
        this.userDetail.isPreparerPhoneSameAsLogin = true;
      }
      this.userEditFrom.controls.ptin.enable();
      this.userEditFrom.controls.stin.enable();
      this.userEditFrom.controls.ein.enable();
      this.userEditFrom.controls.addressType.enable();
      this.userEditFrom.controls.street.enable();
      this.userEditFrom.controls.postalCode.enable();
      this.userEditFrom.controls.city.enable();
      this.userEditFrom.controls.state.enable();
      this.userEditFrom.controls.country.enable();
      this.userEditFrom.controls.addressType.clearValidators();
      this.userEditFrom.controls.postalCode.clearValidators();
      this.userEditFrom.controls.street.setValidators([Validators.pattern("[A-Za-z0-9]( ?[A-Za-z0-9\-/])*")]);
      this.userEditFrom.controls.city.setValidators([Validators.pattern("([A-Za-z] ?)*[A-Za-z]")]);
      this.userEditFrom.controls.state.setValidators([Validators.pattern("([A-Za-z] ?)*[A-Za-z]")]);
      this.userEditFrom.controls.country.setValidators([Validators.pattern("([A-Za-z] ?)*[A-Za-z]")]);
    }

    // enable ero based fields
    if (this.userDetail.isERO === true) {
      this.userEditFrom.controls.ssn.enable();
      this.userEditFrom.controls.addressType.setValidators([Validators.required]);
      this.userEditFrom.controls.street.setValidators([Validators.required, Validators.pattern("[A-Za-z0-9]( ?[A-Za-z0-9\-/])*")]);
      this.userEditFrom.controls.postalCode.setValidators([Validators.required]);
      this.userEditFrom.controls.city.setValidators([Validators.required, Validators.pattern("([A-Za-z] ?)*[A-Za-z]")]);
      this.userEditFrom.controls.state.setValidators([Validators.required, Validators.pattern("([A-Za-z] ?)*[A-Za-z]")]);
      this.userEditFrom.controls.country.setValidators([Validators.required, Validators.pattern("([A-Za-z] ?)*[A-Za-z]")]);
    }

    this.userEditFrom.controls.addressType.updateValueAndValidity();
    this.userEditFrom.controls.street.updateValueAndValidity();
    this.userEditFrom.controls.postalCode.updateValueAndValidity();
    this.userEditFrom.controls.city.updateValueAndValidity();
    this.userEditFrom.controls.state.updateValueAndValidity();
    this.userEditFrom.controls.country.updateValueAndValidity();
  }

  // enable disable fields based on flags
  public setConditionalValidators() {
    this.setUserTypeConditionalValidators();
    this.userEditFrom.controls.recoveryEmail.disable();
    this.userEditFrom.controls.preparerPhone.disable();
    this.userEditFrom.controls.preparerEmail.disable();
    this.userEditFrom.controls.ein.disable();

    if (this.userDetail.key !== "newUser") {
      this.userEditFrom.controls.email.disable();
    }

    if (this.userDetail.secondaryEmail === true) {
      this.userEditFrom.controls.recoveryEmail.enable();
    }

    if (!this.userDetail.isPreparerEmailSameAsLogin && this.userDetail.isPreparer === true) {
      this.userEditFrom.controls.preparerEmail.enable();
    }

    if (!this.userDetail.isPreparerPhoneSameAsLogin && this.userDetail.isPreparer === true) {
      this.userEditFrom.controls.preparerPhone.enable();
    }

    if (!this.userDetail.isSelfEmployed && this.userDetail.isPreparer === true) {
      this.userEditFrom.controls.ein.enable();
    }

    this.userEditFrom.updateValueAndValidity();
  }

  // set city and state based on zip code
  public setDataBasedOnZipCode() {
    if (this.userEditFrom.controls.addressType.value === 1) {
      this._utilityService.getCityState(this.userEditFrom.controls.postalCode.value).then((zipData: any) => {
        if (zipData) {
          this.userEditFrom.controls.city.setValue(zipData.city);
          this.userEditFrom.controls.state.setValue(zipData.state);
        };
      });
    }
  }

  // used to perform logic when form value changes
  private subscribeToFormValueChanges() {
    const self = this;
    self.emailChangeSubscription = self.userEditFrom.get("email").valueChanges.subscribe((val) => {
      if (this.userDetail.email !== this.userEditFrom.controls.email.value) {
        self.userDetail.isEmailVerified = false;
      }
    })

    self.secondaryEmailChangeSubscription = self.userEditFrom.get("recoveryEmail").valueChanges.subscribe((val) => {
      if (this.userDetail.recoveryEmail !== this.userEditFrom.controls.recoveryEmail.value) {
        self.userDetail.isSecondaryEmailVerified = false;
      }
    })

    self.phoneChangeSubscription = self.userEditFrom.get("phoneNo").valueChanges.subscribe((val) => {
      if (this.userDetail.phoneNo !== this.userEditFrom.controls.phoneNo.value) {
        self.userDetail.isPhoneVerified = false;
      }
    })

    self.addressTypeSubscription = self.userEditFrom.get("addressType").valueChanges.subscribe((val) => {
      if (val === 1) {
        self.userEditFrom.controls.country.disable();
      } else if (val === 2) {
        self.userEditFrom.controls.country.enable();
      }
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        Used to get particular user detail from api.
   */
  private getUserDetailFromAPI() {
    this._officeService.getUserDetail(this.userDetail.key).then((aUser: any) => {
      aUser.key = this.userDetail.key;
      this.userDetail = aUser;
      this.setValuesInForm();
      // location selection data.
      if (this.userDetail.locations && Object.keys(this.userDetail.locations).length > 0) {
        this.prepareLocationSelectionData();
      }
    })
  }

  /**
  * @author Hannan Desai
  * @description 
  *        To define controls of ui form.
  */
  private createUserEditForm() {
    this.userEditFrom = this._fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      recoveryEmail: ["", Validators.required],
      phoneNo: ["", Validators.required],
      showReturn: 1,
      ptin: ["", Validators.required],
      stin: "",
      ppin: "",
      preparerId: "",
      nytprin: "",
      nyExemptCode: "",
      nmCRS: "",
      orLicenseNumber: "",
      ssn: ["", Validators.required],
      ein: ["", Validators.required],
      addressType: [""],
      street: ["", Validators.pattern("[A-Za-z0-9]( ?[A-Za-z0-9\-/])*")],
      postalCode: [""],
      city: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      state: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      country: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      preparerPhone: ["", Validators.required],
      preparerEmail: ["", Validators.required],
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *          To set values in form controls.
   */
  private setValuesInForm() {
    this.userEditFrom.setValue({
      firstName: this.userDetail.firstName ? this.userDetail.firstName : "",
      lastName: this.userDetail.lastName ? this.userDetail.lastName : "",
      email: this.userDetail.email ? this.userDetail.email : "",
      recoveryEmail: this.userDetail.recoveryEmail ? this.userDetail.recoveryEmail : "",
      phoneNo: this.userDetail.phoneNo ? this.userDetail.phoneNo : "",
      showReturn: this.userDetail.showReturn ? this.userDetail.showReturn : 1,
      ptin: this.userDetail.PTIN ? this.userDetail.PTIN : "",
      stin: this.userDetail.STIN ? this.userDetail.STIN : "",
      ppin: this.userDetail.PPIN ? this.userDetail.PPIN : "",
      preparerId: this.userDetail.preparerId ? this.userDetail.preparerId : "",
      nytprin: this.userDetail.NYTPRIN ? this.userDetail.NYTPRIN : "",
      nyExemptCode: this.userDetail.NY_ExemptCode ? this.userDetail.NY_ExemptCode : "",
      nmCRS: this.userDetail.NM_CRS ? this.userDetail.NM_CRS : "",
      orLicenseNumber: this.userDetail.OR_LicenseNumber ? this.userDetail.OR_LicenseNumber : "",
      ssn: this.userDetail.ssn ? this.userDetail.ssn : "",
      ein: this.userDetail.ein ? this.userDetail.ein : "",
      addressType: this.userDetail.address && this.userDetail.address.addressType ? this.userDetail.address.addressType : 1,
      street: this.userDetail.address && this.userDetail.address.street ? this.userDetail.address.street : "",
      postalCode: this.userDetail.address && this.userDetail.address.postalCode ? this.userDetail.address.postalCode : "",
      city: this.userDetail.address && this.userDetail.address.city ? this.userDetail.address.city : "",
      state: this.userDetail.address && this.userDetail.address.state ? this.userDetail.address.state : "",
      country: this.userDetail.address && this.userDetail.address.country ? this.userDetail.address.country : "",
      preparerEmail: this.userDetail.preparerEmail ? this.userDetail.preparerEmail : "",
      preparerPhone: this.userDetail.preparerPhone ? this.userDetail.preparerPhone : "",
    })
    this.setConditionalValidators();
  }

  ngOnChanges() {
    this.userDetail = JSON.parse(JSON.stringify(this.userDetail));
    this.lookupData = JSON.parse(JSON.stringify(this.lookupData));
    if (!this.userEditFrom) {
      this.createUserEditForm();
      this.subscribeToFormValueChanges();
    }
    this.setValuesInForm();
    // location selection data.
    if (this.userDetail.locations && Object.keys(this.userDetail.locations).length > 0) {
      this.prepareLocationSelectionData();
    }
    // to get latest user detail from api
    if (this.userDetail.key !== "newUser") {
      this.getUserDetailFromAPI();
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.phoneChangeSubscription.unsubscribe();
    this.emailChangeSubscription.unsubscribe();
    this.secondaryEmailChangeSubscription.unsubscribe();
    this.addressTypeSubscription.unsubscribe();
  }

}
