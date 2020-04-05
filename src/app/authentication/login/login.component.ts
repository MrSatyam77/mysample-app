// External Imports
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import * as Fingerprint from 'fingerprintjs';

// Internal Imports
import { ResellerService, LocalStorageUtilityService, UserService, MessageService, BasketService, MediaService, AppLoadingBarService } from '@app/shared/services/index';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { environment } from '@environments/environment';
declare var grecaptcha: any;
var recaptchaThis: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public imagePath: any;

  // holds variables to show hide divisions, default login view
  public currentView: string = "login";

  //reCaptcha widgetId
  private reCaptchaWidgetId: string = '';

  // holds general message text and title
  public generalMessage: { title?: string, text?: string } = { title: "", text: "" };

  // holds confirmation message
  public confirmationMessage: string;

  //hold static url
  public static_url = environment.static_url;

  // holds controls of login ui form
  public loginControlForm: FormGroup;

  //Check whether API call is active or not.On call of API we disable respective button. and  On response of that call we enable that button. 
  public isActiveApiCall: boolean = false;

  // holds short code of reseller used for image to display on login page;
  public resellerConfig: any = {};

  // store login response comes from login api.
  private loginResponse: any;

  // Object that holding data for login page
  public loginObj: { isCredentialWrong: boolean, isRememberMe: boolean, userName: string, password: string, registrationAutoCompleteEmailId: string, forgotPasswordEmail: string, passwordType: string }
    = { isCredentialWrong: false, isRememberMe: false, userName: "", password: "", registrationAutoCompleteEmailId: "", forgotPasswordEmail: "", passwordType: "password" };

  constructor(
    private _resellerService: ResellerService,
    private _localStorageUtilityService: LocalStorageUtilityService,
    private _authService: AuthenticationService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _basketService: BasketService,
    private _mediaService: MediaService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder) { }


  /**
  * @author Heena Bhesaniya
  * @description make flag true of forgot password
   */
  public forgetPasswordLink() {
    this.currentView = "forgotPassword";
    this.loginControlForm.controls.forgotPasswordEmail.setValue(this.loginObj.forgotPasswordEmail);
  }

  /**
  * @author Heena Bhesaniya
  * @description  showTwoFactorAuthentication to show and hide html based on isTwoFactorAuthentication is true or false
  */
  public showTwoFactorAuthentication() {
    this.currentView = "twoFactorAuthentication";
  }

  /**
  * @author Heena Bhesaniya
  * @description verifyTwoFactorAuthentication is use to verify code for TwoFactorAuthentication
  */
  public verifyTwoFactorAuthentication() {
    const self = this;
    self._authService.verifyTwoFactorAuthenticationCode(self.loginControlForm.controls.verificationCode.value, self.loginResponse)
      .then((result) => {
        self.isActiveApiCall = false;
        if (self.loginObj.isRememberMe === true) {
          // Add loginCredentials to local storage
          self._localStorageUtilityService.addToLocalStorage('loginCredentials', { "userName": self.loginObj.userName, "isRememberMe": self.loginObj.isRememberMe });
        } else {
          // Remove loginCredentials to local storage
          self._localStorageUtilityService.removeFromLocalStorage('loginCredentials');
        }
        // //to avoid redirect to home screen when user don't have default location id 
        // let locationId = self._userService.getLocationId(false);
        // if (locationId && self._userService.isOfficeSetupDone()) {
        //   self._router.navigate(['/home']);
        // } else {
        //   // @temporary
        //   self._router.navigate(['/home']);
        // }
        self._messageService.showMessage('Logged In Successfully', 'success');
      }, error => {
        if (error === 9001) {
          self._messageService.showMessage('Code is Invalid.', 'info');
          self.loginControlForm.controls.verificationCode.setValue("");
        } else if (error === 9002) {
          self._messageService.showMessage('Code is Expired, Please Login again.', 'info');
          grecaptcha.reset(self.reCaptchaWidgetId);
          self.isActiveApiCall = false;
          self.loginControlForm.controls.password.setValue("");
          self.currentView = "login";
        }
      });
  }

  public gotoLogin() {
    this._router.navigate(['/login']);
  }

  /**
  * @author Heena Bhesaniya
  * @description  to resend two factor verification code
  */
  public resendTwoFactorAuthenticationCode() {
    this._authService.resendTwoFactorAuthenticationCode(this.loginResponse).then((response) => {
      this._messageService.showMessage('Code is resend succesfully', 'success');
    }, (error) => {
      this._messageService.showMessage('Error occured while processing your request.', 'error');
    })
  }

  /**
  * @author Heena Bhesaniya
  * @description go to registraion screen with email id field
  */
  public registraion() {
    this._basketService.pushItem('registrationEmailId', this.loginObj.registrationAutoCompleteEmailId);
    this._router.navigateByUrl('/registration');
  }

  /**
  * @author Heena Bhesaniya
  * @description this will call the callback function of recaptcha, if recaptcha validates successfully.
  */
  public recaptchaValidate() {
    grecaptcha.execute(this.reCaptchaWidgetId);
  }

  /**
   * @author Heena Bhesaniya
   * @description used to call login api
   * @param recaptchaResponse recaptcha response 
   * @param userName user name
   * @param password  password 
   */
  public login(recaptchaResponse: any) {
    //to clear all previous toaster 
    recaptchaThis._messageService.clear();
    //to remove highlighted link from forgot password
    recaptchaThis.loginObj.isCredentialWrong = false;
    //Check if captcha is done or not
    if (recaptchaResponse !== undefined && recaptchaResponse !== '') {
      recaptchaThis.isActiveApiCall = true;
      //Generate deviceID required for login
      let fp1 = new Fingerprint({ canvas: true, ie_activex: true, screen_resolution: true }).get().toString();
      recaptchaThis._authService.login(recaptchaThis.loginControlForm.controls.emailId.value, recaptchaThis.loginControlForm.controls.password.value, recaptchaResponse, fp1)
        .then((success: any) => {
          if (success.twoFactorAuthentication && success.twoFactorAuthentication.isEnabled === true) {
            recaptchaThis.loginResponse = success;
            recaptchaThis.loginObj.userName = recaptchaThis.loginControlForm.controls.emailId.value;
            recaptchaThis.loginObj.password = recaptchaThis.loginControlForm.controls.password.value;
            recaptchaThis.showTwoFactorAuthentication();
          } else {
            if (recaptchaThis.loginObj.isRememberMe === true) {
              //Add loginCredentials to local storage
              recaptchaThis._localStorageUtilityService.addToLocalStorage('loginCredentials',
                { "userName": recaptchaThis.loginControlForm.controls.emailId.value, "isRememberMe": recaptchaThis.loginObj.isRememberMe });
            } else {
              //Remove loginCredentials to local storage
              recaptchaThis._localStorageUtilityService.removeFromLocalStorage('loginCredentials');
            }
            recaptchaThis.isActiveApiCall = false;
            // //to avoid redirect to home screen when user don't have default location id 
            // if (recaptchaThis._userService.getLocationId(false)) {
            //   recaptchaThis._router.navigate(['/home']);
            // }
            recaptchaThis._messageService.showMessage('Logged In Successfully', 'success');
          }
        }, (error) => {
          recaptchaThis.isActiveApiCall = false;
          recaptchaThis.handleLoginError(error);
        });
    } else {
      recaptchaThis._messageService.showMessage('Please click the "I\'m not a robot" box, then click Log In.', 'error', undefined, 0);
    }
  }

  /**
   * @author Hannan Desai
   * @param error Holds error obj comes from server.
   * @description
   *        This function is used to handle error comes after login like overwrite session or wrong credntials and show message according to that.
   */
  private handleLoginError(error: any) {
    grecaptcha.reset(this.reCaptchaWidgetId);
    this._parseStateToDisplayMessage('');
    if (error.code === 4001) {
      //to highlight the forgot password link when credentials are wrong
      this.loginObj.isCredentialWrong = true;
    } else if (error.code === 4003) {
      // Check for 4003 (user already logged in). Prompt for overwrite previous login on ui
      this._parseStateToDisplayMessage('');
      this._messageService.clear();
      this.currentView = 'overwriteSession';
      this.loginObj.userName = this.loginControlForm.controls.emailId.value;
      this.loginObj.password = this.loginControlForm.controls.password.value;
      if (error.data.ip) {
        //Issue: break the line from Do you want to proceed is still remaining
        this.confirmationMessage = "<span class='float-left'> There is an active MyTAXPrepOffice session for this user, on the system or device using IP " + error.data.ip + ".</span><span class='clearfix padding_top_10 float-left'>Do you want to continue with a new MyTAXPrepOffice session? Selecting Yes, will log the user out from the other system or device.</span>";
      } else {
        this.confirmationMessage = "<span>There is an active MyTAXPrepOffice session for this user on other system or device.</span><br/><br/><span class='clearfix'>Do you want to continue with a new MyTAXPrepOffice session? Selecting Yes, will log the user out from the other system or device.</span>";
      }
    } else if (error.code === 4022) {
      this.currentView = 'deactiveUser';
    } else if (error.code == 4027) {
      this._authService.resendConfirmation(this.loginControlForm.controls.emailId.value)
        .then((success) => {
          this.currentView = 'notConfirmedUser';
        });
    } else if (error.code === 4039) {
      //to show message of account locked
      this._parseStateToDisplayMessage('accountlocked');
    }
  }

  /**
   * @author Heena Bhesaniya
   * @description Overwrite Session on basis of user choice
   * @param overwriteSessionFlag overwrite session flag value
   */
  public overwriteSession(overwriteSessionFlag: boolean) {
    const self = this;
    if (!overwriteSessionFlag) {
      this.currentView = 'login';
      return;
    }
    //Generate deviceID required for login
    let fp1 = new Fingerprint({ canvas: true, ie_activex: true, screen_resolution: true }).get().toString();
    self._authService.overwriteSession(overwriteSessionFlag, fp1).then((success: any) => {
      if (success.twoFactorAuthentication && success.twoFactorAuthentication.isEnabled === true) {
        self.loginResponse = success;
        self.showTwoFactorAuthentication();
      } else {
        // self._router.navigate(['/home'])
        self._messageService.showMessage('Logged In Successfully', 'success');
      }
    }, (error) => {
      self.currentView = 'login';
    });
  };

  /**
   * @author Heena Bhesaniya
   * @description Function to call on reset button of forgot password block
   */
  public forgotPassword() {
    const self = this;
    //condition to check whether the reseller has the feature of forgot password
    if (self.hasFeature('FORGOTPASSWORD')) {
      self.loginObj.registrationAutoCompleteEmailId = self.loginControlForm.controls.forgotPasswordEmail.value;
      // temporary commented because its redirect to the login page
      //self._parseStateToDisplayMessage('');
      self._authService.forgotPassword(self.loginControlForm.controls.forgotPasswordEmail.value)
        .then((success) => {
          self.currentView = "mailSentConfirmation";
          self.confirmationMessage = "<span>You should receive an email shortly with a link that will allow you to change your password.</span>";
          self.loginControlForm.controls.forgotPasswordEmail.setValue("");
        }, (error) => {
          if (error.data.code === 4001) {
            self.currentView = "invalidForgetEmail";
            self.confirmationMessage = "";
            //self.confirmationMessage = "<span class='text-danger'>Unfortunately we could not verify your email address.</span>";
          } else if (error.data.code === 4027) {
            self.confirmationMessage = "";
            self._authService.resendConfirmation(self.loginControlForm.controls.forgotPasswordEmail.value)
              .then((success) => {
                self.currentView = 'notConfirmedUser';
              });
          }
          self.loginControlForm.controls.forgotPasswordEmail.setValue("");
        });
    }
  };

  /**
  * @author Heena Bhesaniya
  * @description Function to call on resend confirmation
  */
  public resendConfirmation() {
    const self = this;
    //condition to check whether the reseller has the feature of resend confirmation mail
    if (self.hasFeature('RESENDCONFIRMATIONEMAIL')) {
      self.loginObj.registrationAutoCompleteEmailId = self.loginControlForm.controls.resendConfirmationEmail.value;
      self._authService.resendConfirmation(self.loginControlForm.controls.resendConfirmationEmail.value).then((success) => {
        self.currentView = 'resendConfirmationSent';
        self.loginControlForm.controls.resendConfirmationEmail.setValue("");
      }, error => {
        if (error.data.code === 4009) {
          self.loginObj.forgotPasswordEmail = self.loginControlForm.controls.resendConfirmationEmail.value;
          self.currentView = 'alreadyConfirmUser';
        } else if (error.data.code === 4001) {
          self.currentView = 'invalidEmail';
        }
        self.loginControlForm.controls.resendConfirmationEmail.setValue("");
      });
    }
  };

  /**
   * @author Heena Bhesaniya
   * @description This Function used to to call resendUnlockEmail api
   */
  public resendUnlockAccountEmail() {
    this._authService.resendUnlockAccountEmail(this.loginControlForm.controls.emailId.value).then((success) => {
      this._messageService.showMessage('Request is processed successfully', 'success');
    }, (error) => { });
  }

  /**
   * @author Heena Bhesaniya
   * @description  method to show and hide the feature according to the reseller config
   * @param featureName pass feature name
   */
  public hasFeature(featureName: string): boolean {
    return this._resellerService.hasFeature(featureName);
  }

  /**
   * @author Heena Bhesaniya
   * @description This function will prepare message according to state to be displayed on login page
   * @param state state value for which mesaage is displayed
   */
  public _parseStateToDisplayMessage(state: string): void {
    switch (state.toLowerCase()) {
      case 'autosignout':
        this.confirmationMessage = "";
        this.currentView = "generalMessage";
        this.generalMessage.title = "Logged out due to inactivity";
        this.generalMessage.text = "<div><span>As per IRS security guidelines, you were automatically logged out to protect your data due to more than 30 minutes of inactivity.</span></div> <div class='padding_top_10'><span>To Log In, click OK.</span></div>";
        break;
      case 'accountlocked':
        this.confirmationMessage = "";
        this.currentView = "generalMessage";
        this.generalMessage.title = "Account Locked";
        this.generalMessage.text = "<span>Your account was locked, due to multiple logins, with invalid login credentials. You will receive an email with a link to unlock your account.</span><div class='margin_top_10'><span>If you did not receive the email please click </span><a class='cursor_pointer' style='text-decoration:underline' ng-click='resendUnlockAccountEmail()'>here</a>.</div>";
        break;
      case 'unlockaccountsuccess':
        this.confirmationMessage = "";
        this.currentView = "generalMessage";
        this.generalMessage.title = "Success";
        this.generalMessage.text = "<span>Your account is unlocked now. You may proceed to login.</span>";
        break;
      case 'unlockaccounterror':
        this.confirmationMessage = "";
        this.currentView = "generalMessage";
        this.generalMessage.title = "Error";
        this.generalMessage.text = "<span>There is something wrong with your unlock request. Please contact support.</span>";
        break;
      case 'taxsession24hourlogout':
        this.confirmationMessage = "";
        this.currentView = "generalMessage";
        this.generalMessage.title = "Auto Log Out";
        this.generalMessage.text = "<div><span>As per IRS security guidelines, users must logged out from the tax software to protect your data 24 hours.</span></div><div class='padding_top_10'><span>To Log In, click OK.</span></div>";
        break;
      default:
        //Note : This case will help us to blank confirmation message and general message 
        //if we do not write this case then , it will show prevous message (any confirmation or general message) in a screen
        this.confirmationMessage = "";
        this.currentView = 'login';
        this.generalMessage.title = "";
        this.generalMessage.text = "";
    }
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to initialize recaptcha.
   */
  initializeRecaptcha(): void {
    const self = this;
    // to render recaptcha in our div we have to wait for recaptcha script to loaded completely.
    let reCaptchaRenderInterval = setInterval(() => {
      if (grecaptcha && typeof grecaptcha !== 'undefined' && typeof grecaptcha.render !== "undefined") {
        clearInterval(reCaptchaRenderInterval);
        self.reCaptchaWidgetId = grecaptcha.render('recaptcha', {
          'sitekey': environment.recaptcha_key,
          'callback': self.login,
          'size': 'invisible'
        });
      }
    }, 100);
  }

  /**
  * @author Heena Bhesaniya
  * @description some basic initlialization while login url is fire
  * like calling unlock api, calling media service , intilaize or execure recaptcha 
  */
  private init() {
    if (location.href.indexOf('?') > -1) {
      let optionValue = location.href.split('?').pop();
      if (optionValue) {
        if (optionValue.indexOf('unlock=') > -1) {
          this._authService.verifyUnlockKey(optionValue.split('=')[1]).then((success) => {
            this._parseStateToDisplayMessage('unlockaccountsuccess');
          }, (error) => {
            this._parseStateToDisplayMessage('unlockaccounterror');
          });
        } else {
          this._parseStateToDisplayMessage(optionValue.toLowerCase());
        }
      }
    }

    //To check if there is any state stored for login in local storage to display
    if (this._localStorageUtilityService.checkLocalStorageKey('loginOption') === true) {
      this._parseStateToDisplayMessage(this._localStorageUtilityService.getFromLocalStorage('loginOption'));
      this._localStorageUtilityService.removeFromLocalStorage('loginOption');
    }

    //To check if there is any object stored for loginCredentials  
    if (this._localStorageUtilityService.checkLocalStorageKey('loginCredentials') === true) {
      //get state from localStorage
      let loginCredentials = this._localStorageUtilityService.getFromLocalStorage('loginCredentials');
      this.loginControlForm.controls.emailId.setValue(loginCredentials.userName);
      this.loginObj.isRememberMe = loginCredentials.isRememberMe;
    }

    //call to basket service if key is exist it will return item other wise it will return null
    let emailId = this._basketService.popItem('login_emailId');
    if (emailId) {
      this.loginControlForm.controls.emailId.setValue(emailId);
    }

    //below code is work when user redirect for registration here we are checking mode;
    let mode = this._basketService.popItem('mode');
    if (mode && mode === 'reset') {
      this.currentView = "forgotPassword";
      if (emailId) {
        this.loginControlForm.controls.forgotPasswordEmail.setValue(emailId);
        this.loginControlForm.controls.emailId.setValue("");
      }
    }

    if (mode && mode === 'resend') {
      this.currentView = "resendConfirmation";
      if (emailId) {
        this.loginControlForm.controls.resendConfirmationEmail.setValue(emailId);
        this.loginControlForm.controls.emailId.setValue("");
      }
    }
    //Call view for login
    this._mediaService.callView('login', '', '', '');
    // initialize recaptcha div.
    this.initializeRecaptcha();
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to define login form controls and validators.
   */
  private createLoginForm() {
    this.loginControlForm = this._fb.group({
      emailId: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      forgotPasswordEmail: "",
      resendConfirmationEmail: "",
      verificationCode: ""
    })
  }



  /**
  * @author Heena Bhesaniya
  * @description get short code for reseller 
  */
  ngOnInit() {
    this._activatedRoute.queryParams.subscribe(params => {
      let element: any = document.getElementById('background-image');
      this.imagePath = element.value;
      recaptchaThis = this;
      this.createLoginForm();
      // get reseller shortcode.
      this.resellerConfig.shortCode = this._resellerService.getValue("shortCode");
      this.resellerConfig.hidePolicy = this._resellerService.getValue("hidePolicy");
      // to perform initialization logic.
      this.init();
    });
  }
}

