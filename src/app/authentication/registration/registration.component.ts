// External Imports
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import * as Fingerprint from 'fingerprintjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// Internal Imports
import { ResellerService } from '@app/shared/services/reseller.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { UserService } from '@app/shared/services/user.service';
import { MessageService } from '@app/shared/services/message.service';
import { PasswordStrengthService } from '@app/shared/services/password-strength.service';
import { BasketService } from '@app/shared/services/basket.service';
import { MediaService } from '@app/shared/services/media.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { TermsAndPolicyDialogComponent } from '../dialogs/terms-and-policy-dialog/terms-and-policy-dialog.component';
import { PrivacyPolicyDialogComponent } from '../dialogs/privacy-policy-dialog/privacy-policy-dialog.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  // Widget Popover
  @ViewChild('confirmPassword', { static: false }) confirmPassword: NgbPopover;
  @Input('toggle') toggler: any;
  public regFormStep1: FormGroup;
  public resetPasswordForm: FormGroup;
  public showPasswordHelp: boolean = false;
  public inputType = {
    "password": 'password',
    "confirmPassword": 'password'
  }
  // object that hold checkbox value
  public regForm: {
    isAgreeToTerms: boolean,
    email: string
  } = {
      isAgreeToTerms: false,
      email: ''
    };

  // Contains the message of successfully completion of step 1 and mail sent to email address
  public regStep1Message = false;
  public regAlreadyVerifyMsg = false;
  public deactiveUser = false; // to hold is deactive user is login
  public trackingId = '';
  // Check whether API call is active or not.On call of API we disable respective button. and  On response of that call we enable that button.
  public isActiveApiCall = false;
  // this is a default set phone no mask
  private params: any;
  public phoneMask = '(000) 000-0000';
  public registrationWidth: any;
  public resellerConfig: any;
  public emailId: any; // to hold emailId
  public isResetPassword: boolean;
  public regStep: any;
  public showConfirmErrMessage: boolean;
  public showResetErrMessage: boolean;
  public passResetLinkSentMsg: boolean;
  public mediaApi: any;
  public isRegPopOver: boolean;
  public alreadyRegisteredUser: boolean;
  public key;
  public locationId: any;
  public regSuccNotLoginError: boolean;
  public RegIncompletDataError: boolean;
  public passChangeSuccNotLoginError: boolean;
  public resetPassPopOver: boolean;
  public passNotReset: boolean;
  public passUnfortuNotReset: boolean;
  public passChangeIncompletDataMsg: boolean;
  public confirmPassError: boolean;
  public isFirstActive: boolean;
  public isSecondActive: boolean;
  public regFormStep2: FormGroup;
  public passwordStrength: any = {};
  public countryName: string = 'us';
  public countryDetailsData: any;
  // this object hold all country details
  public countryDetails: any = [];
  public selectedCountry: any = [{
    id: '(+1)',
    text: `<span class="flag-icon flag-icon-us" style="padding-left:25px;"/>`
  }];
  public imagePath: any;



  constructor(
    private resellerService: ResellerService,
    private authService: AuthenticationService,
    private userService: UserService,
    private messageService: MessageService,
    private basketService: BasketService,
    private mediaService: MediaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private systemConfigservice: SystemConfigService,
    private injector: Injector,
    private dialogService: DialogService,
    private passwordStrengthService: PasswordStrengthService) { }

  /**
   * @author Mansi Makwana
   * @description
   *        This function is used to define registration form controls and validators.
   */
  private createRegistrationForm() {
    this.regFormStep1 = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNo: ['', Validators.required],
      firmName: ['', Validators.required]

    });
  }

  public togglePasswordView(type) {
    this.inputType[type] = this.inputType[type] === 'password' ? 'text' : 'password'
  }

  /**
  * @author Heena Bhesaniya
  * @description  method to show and hide the feature according to the reseller config
  * @param featureName pass feature name
  */
  public hasFeature(featureName: string): boolean {
    return this.resellerService.hasFeature(featureName);
  }


  /**
   * @author Mansi Makwana
   * @description
   *        This function is used to define complete registration form controls and validators.
   */
  private createCompleteRegistrationForm() {
    this.regFormStep2 = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      securityQuestion: ['', Validators.required],
      securityAnswer: ['', Validators.required],
      isAgreeToTerms: [null, Validators.required]

    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }
  // convenience getter for easy access to registration form fields
  get f() { return this.regFormStep2.controls; }

  /**
   * @author Mansi Makwana
   * @description
   *        This function is used to define reset password form controls and validators.
   */
  private createResetPassowrdForm() {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });

  }
  // convenience getter for easy access to reset password form fields
  get f1() { return this.resetPasswordForm.controls; }


  /**
   * @author Mansi Makwana
   * @description
   *        This function is used to match password and confirmPassword
   */
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  /**
   * @author Mansi Makwana
   * @description
   *  This function is used for popover with any screen size
   */
  updateScreenSize() {
    this.registrationWidth = window.innerWidth;
  }

  /**
   * @author Mansi Makwana
   * @description
   *  This function is used for redirect given path
   */
  public goTo(location, id, mode) {
    if ((id) && id !== '') {
      this.basketService.pushItem('login_emailId', id);
    }
    if ((mode) && mode !== '') {
      this.basketService.pushItem('mode', mode);
    }
    if ((location) && location !== '') {
      this.router.navigateByUrl(location);
    }
  }

  public gotoLogin() {
    this.router.navigateByUrl('/login')
  }

  /**
   * @author Mansi Makwana
   * @description
   *  some basic initlialization while registration url is fire
   */
  init() {
    if (this.params) {
      this.key = this.params.split('=');
      if (this.key[0] === 'confirmPassword') {
        // create complete Registration form
        this.createCompleteRegistrationForm();
        // Used to show loader until API response
        // Toggle the reset password block to false
        this.isResetPassword = false;
        // Call api to verify key to register the user
        this.authService.verifyRegRequest(this.key[1]).then((success: any) => {
          this.regStep = 'step2';
          if (success.code === 2000) {
            this.regFormStep2.controls.email.setValue(success.data);
            this.regForm.email = success.data;
          }
        }, (error) => {
          this.regStep = '';
          this.router.navigate(['registration']);
          this.showConfirmErrMessage = true;
          if (error.code == 4009) {
            this.regAlreadyVerifyMsg = true;
          }
        });

      } else if (this.key[0] === 'resetPassword') {
        // create reset Password form
        this.createResetPassowrdForm();
        // Shows the loading until the response of verifying key is not got
        this.regStep = '';
        // Calls the API to verify the key obtained from urlChanged
        this.authService.verifyKey(this.key[1]).then((success: any) => {
          // Toggle to reset password block
          this.isResetPassword = true;
          this.regForm.email = success.email;
          this.resetPasswordForm.controls.email.setValue(success.email);
        }, (error) => {
          if (error.status === 401) {
            if (error.code === 4008) {
              // To show the error message when verify the link
              this.showResetErrMessage = true;

              this.passResetLinkSentMsg = true;
            }
          } else if (error.code === 4008) {
            // To show the error message when verify the link
            this.showResetErrMessage = true;

            this.passResetLinkSentMsg = true;
          } else {
            // Toggle to reset password block
            this.isResetPassword = true;
          }
        });
      } else if (this.key[0] === 'id') {
        // shows the registration step 1 form if key is id (tracking Id)
        this.regStep = 'step1';
        this.isResetPassword = false;
        // Read tracking id from query parameter
        this.trackingId = this.key[1];

      }
    } else {
      // shows the registration step 1 form if key is undefined or null
      this.regStep = 'step1';
      this.isResetPassword = false;

      // If tracking id is not available in url then try to Read from cookie
      // @pending
      //  this.trackingId = $cookies.taxtrackingid;
    }
  }

  /**
   * @author Mansi Makwana
   * @updatedBy om kanada
   * @description
   *        This function is used to set selected dropdown value 
   */
  public selected(value: any): void {
    const self = this;
    const countryCode1 = value.id;
    self.countryDetailsData.forEach(element => {
      if (element.dialCode === countryCode1) {
        self.countryName = element.countryCode;
      }
    });

    // user select 'US' Country than taxmask set or othrer any country select than not set text mask
    if (self.countryName !== 'us') {
      this.phoneMask = '';
    } else {
      this.phoneMask = '(000) 000-0000';
    }
  }
  /**
   * @author Mansi Makwana
   * @description
   *  This function is used for registration
   */
  register() {
    this.isRegPopOver = false;
    this.alreadyRegisteredUser = false;
    if ((this.regFormStep1) && this.regFormStep1.value !== null) {
      this.isActiveApiCall = true;
      let apiParams: any = [];
      apiParams.email = this.regFormStep1.controls.email.value;
      apiParams.firstName = this.regFormStep1.controls.firstName.value;
      apiParams.lastName = this.regFormStep1.controls.lastName.value;
      apiParams.countryCode = this.countryName ? this.countryName : 'us';
      apiParams.phoneNo = this.regFormStep1.controls.phoneNo.value;
      apiParams.firmName = this.regFormStep1.controls.firmName.value;

      // call media view with action
      this.mediaService.callView('registration', '', '', 'register');
      // Call api to register the user and send the mail to user email address
      this.authService.registration(apiParams, this.trackingId).then((success: any) => {
        this.isActiveApiCall = false;
        if (success.code === 2004) {
          this.regStep = '';
          // Toggle the popover on click of register button on step 1
          if ((success.data) && (success.data !== null) && success.data !== '') {
            this.regStep = 'step2';
            this.router.navigateByUrl('/registration?confirmPassword=' + success.data);
          }
        }
      }, (error) => {
        this.isActiveApiCall = false;
        if (error.code === 4000) {
          // contains the error message if user email id is already register
          this.isRegPopOver = true;
        } else if (error.code === 4027) {
          this.alreadyRegisteredUser = true;
        }
      });
    }
  }

  /**
   * @author Mansi Makwana
   * @description
   *  This function is used for confirm registration
   */
  public confirmRegistration() {
    this.isFirstActive = true;
    this.isSecondActive = false;

    if ((this.regFormStep2) && this.regFormStep2.value != null) {
      let apiParams: any = [];
      apiParams.email = this.regFormStep2.controls.email.value;
      apiParams.password = this.regFormStep2.controls.password.value;
      apiParams.securityQuestion = this.regFormStep2.controls.securityQuestion.value;
      apiParams.securityAnswer = this.regFormStep2.controls.securityAnswer.value;
      apiParams.isAgreeToTerms = this.regFormStep2.controls.isAgreeToTerms.value;

      // Call api to confirm the registration the user
      this.authService.confirmRegRequest(apiParams, this.key[1]).then((success: any) => {

        if (success.code === 2001) {
          this.authService.login(this.regFormStep2.controls.email.value, this.regFormStep2.controls.password.value).then((success: any) => {
            // to avoid redirect to home screen when user don't have default location id
            this.locationId = this.userService.getLocationId(undefined);
            if ((this.locationId) && this.locationId !== '') {
              this.router.navigateByUrl('/home');
            } else {
              this.router.navigateByUrl('/home');
            }
            this.messageService.showMessage('Registered & Logged In Successfully', 'success', 'REGISTRATIONCONT_REGLOGSUCCES_MSG');

          }, (error) => {
            if (error.code === 4022) {
              this.regStep = '';
              this.deactiveUser = true; // set here user is deactivate
            } else {
              this.messageService.showMessage('Registered Successfully', 'success', 'REGISTRATIONCONT_REGISTEREDSUCCES_MSG');
              this.regSuccNotLoginError = true;
              this.regStep = '';
            }
            this.showConfirmErrMessage = true;
            // $location.path('/login');
            console.log(error);
          });
        }
      }, (error) => {
        console.log(error);
      });
    } else {

      this.showConfirmErrMessage = true;
      this.RegIncompletDataError = true;
    }
  }

  /**
   * @author Mansi Makwana
   * @description
   * Method to be called on reset button when user want to reset the password
   */
  resetPassword() {
    if ((this.resetPasswordForm) && this.resetPasswordForm.value !== null) {

      this.authService.resetPassword(this.resetPasswordForm.controls.email.value, this.key[1], this.resetPasswordForm.controls.password.value).then((success: any) => {
        if (success.code === 2000) {
          this.authService.login(this.resetPasswordForm.controls.email.value, this.resetPasswordForm.controls.password.value).then((success: any) => {
            this.router.navigateByUrl('/home');
            this.messageService.showMessage('Password Changed & Logged In Successfully', 'success', 'REGISTRATIONCONT_PASSCHANGLOGINSUCCESS_MSG');

          }, (error) => {
            this.showResetErrMessage = true;
            this.passChangeSuccNotLoginError = true;
            this.isResetPassword = false;
            console.log(error);
          });
        }
      }, (error) => {

        // Toggle the popover on reset button if password is not reset due to some error
        this.resetPassPopOver = true;
        if (error.code === 5000) {
          // contains the error message when password is not reset
          this.passNotReset = true;
        } else {
          this.passUnfortuNotReset = true;
        }
        setTimeout(() => {
          this.resetPassPopOver = false;
        }, 20000);
      });
    } else {

      this.showResetErrMessage = true;
      this.passChangeIncompletDataMsg = true;
    }
  }


  /**
   * @author Mansi Makwana
   * @description
   *  Method to be called on goto login page
   */
  goToLogin() {
    this.router.navigateByUrl('/login');
  }


  /**
   * @author Mansi Makwana
   * @description
   *  This function is used to decide termOfUse & privacyPolicy action based on reseller configuration
   */
  TermsAndPolicyAction(actionType) {
    // If links are available
    if (this.resellerConfig[actionType + 'Url'] !== undefined && this.resellerConfig[actionType + 'Url'] !== '') {
      window.open(this.resellerConfig[actionType + 'Url'], '_blank');
    } else {
      // Decide actionType and provide url based on it
      if (actionType === 'termOfUse') {
        this.dialogService.custom(TermsAndPolicyDialogComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'lg' });
      } else if (actionType === 'privacyPolicy') {
        this.dialogService.custom(PrivacyPolicyDialogComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'lg' });
      }
    }
  }

  /**
   * @author Mansi Makwana
   * @description
   *  This function is used to check password strength
   */
  checkPasswordStrength(formName: string): void {
    let password;
    if (formName === 'regFormStep2') {
      password = this.regFormStep2.controls.password.value;
    } else if (formName === 'resetPasswordForm') {
      password = this.resetPasswordForm.controls.password.value;
    }

    this.passwordStrength = this.passwordStrengthService.getStrength(password);
  }

  /**
   * @author Mansi Makwana
   * @description
   *  This function is used to set selected value
   */
  public refreshValue(value: any): void {
    this.selectedCountry[0] = value;
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      let element: any = document.getElementById('background-image');
      this.imagePath = element.value;
      if (!this.authService.getIsAuthenticated()) {
        if (location.href.indexOf('?') > -1) {
          this.params = location.href.split('?').pop();
        }
        this.init();
        // get reseller config ()
        this.resellerConfig = this.resellerService.getValues(['shortCode', 'appName', 'privacyPolicyUrl', 'termOfUseUrl']);
        // cal intially to get screen width
        this.updateScreenSize();
        // goto url
        this.emailId = this.basketService.popItem('registrationEmailId');
        if (this.emailId !== null && (this.emailId) && this.emailId !== '') {
          this.regForm.email = this.emailId;
        }
        this.countryDetailsData = this.systemConfigservice.getCountryDetail();
        this.countryDetails = [];
        this.countryDetailsData.forEach((country: any) => {
          this.countryDetails.push({
            id: country.dialCode,
            name: `<span class="flag-icon flag-icon-${country.countryCode}" style="padding-left:25px;"></span> ${country.countryName}${country.dialCode}`
          });
        });
        this.mediaApi = this.mediaService.callView('registration', '', '', '');
        this.createRegistrationForm();
      } else {
        this.router.navigate(['home']);
      }
    });
  }
}
