// External Imports
import { Injectable, Injector } from '@angular/core';
import { Router } from "@angular/router";

// Internal Imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { AppLoadingBarService } from '@app/shared/services/app-loading-bar.service';
import { UserService } from '@app/shared/services/user.service';
import { ResellerService } from '@app/shared/services/reseller.service';
import { LocalStorageUtilityService } from '@app/shared/services/local-storage-utility.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { PreloadCheckService } from "@app/authentication/preload-check.service";
import { environment } from "@environments/environment";
import { APINAME } from "@app/authentication/authentication.constants";
import { PreloadCheckComponent } from '@app/authentication/dialogs/preload-check/preload-check.component';
import { RTCSocketService } from '@app/shared/services/rtcSocket.service';
import { FirebaseService } from '@app/shared/services/firebase.service';
import { CalendarService } from '@app/calendar/calendar.service';

declare var LHCChatOptions: any;
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  private isAuthenticated: boolean = false;
  //flag that indicate is session established or not
  public isSessionEstablished: boolean = false;
  // store user last visited page url.
  public lastUserPath: string = "";

  constructor(
    private _commonAPI: CommonAPIService,
    private _preloadCheckService: PreloadCheckService,
    private _appLoadingBarService: AppLoadingBarService,
    private _userService: UserService,
    private _resellerService: ResellerService,
    private _localStorageUtilityService: LocalStorageUtilityService,
    private _commonAPIService: CommonAPIService,
    private _rtcSocketService: RTCSocketService,
    private firebaseService: FirebaseService,
    private _injector: Injector) {
  }

  //Sidebar details Changes : START
  /**
   * @author Ronak Pandya
   * @description
   *          This function is used to get values of the sidebar based on the previous software.
   */

  // call api to get sidebar medu details
  public getSidebarDetailsFromAPI() {
    return new Promise((resolve, reject) => {
      let previousSoftware = "mtpo";
      const self = this;
      let userDetails = this._userService.getUserDetails();
      if (userDetails.settings && userDetails.settings.preferences && userDetails.settings.preferences.themePreferences && userDetails.settings.preferences.themePreferences.menu) {
        if (!(typeof userDetails.settings.preferences.themePreferences.menu === "object")) {
          previousSoftware = userDetails.settings.preferences.themePreferences.menu;
        } else {
          previousSoftware = "mtpo";
        }
      } else {
        previousSoftware = "mtpo";
      }
      this.getSidebarDetailsBasedPreviousSoftwareFromApi(previousSoftware).then(function (res: any) {
        self._userService.updateSidebarDetails(res);
        resolve(res);
      }, function (err) {

      });
    })

  }

  public getSidebarDetailsBasedPreviousSoftwareFromApi(previousSoftware: string) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.GET_SIDEBAR_DETAILS,
        parameterObject: { 'previousSoftware': previousSoftware }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    })
  }
  //Sidebar details Changes : END

  /**
   * This function is
   */
  private betaOnly() {
    if (environment.mode === 'production') {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @author Hannan Desai
   * @param path 
   *        Holds path name
   * @description
   *        This function is used to store attempted path of user.We can redirct to this path after login.
   */
  public setLastUserPath(path: string): void {
    this.lastUserPath = path;
  }

  /**
   * @author Hannan Desai
   * @param isAuthenticated
   *        holds boolean value.
   * @description 
   *        This function is used to set isAuthenticated flag after login. 
   */
  public setIsAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticated = isAuthenticated;
  }

  /**
   * @author Hannan Desai
   * @description
   *         This function is used to return isAuthenticated flag, to check in auth guards and other places.
   */
  public getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * @author Hannan Desai
   * @param response 
   *         Contains response comes from login or session call.
   * @description
   *         This function is used to perform after login logic, here we inject chat code nad other directivesand also update user details.
   *         
   */
  private doLogin(response: any): void {
    //update isAuthenticated variable
    this.isAuthenticated = true;
    //Update user details
    this._userService.updateUserDetails(response);
    //update sidebar menu details
    // this.getSidebarDetailsFromAPI();
    if (this.betaOnly() === true) {
      // Inject Chat code with configuration	
      this.injectChatCode(response, environment.chat_url, true);
    } else if (this._resellerService.hasFeature('CHAT')) {
      // Inject Chat code with configuration
      this.injectChatCode(response, environment.chat_url, true);
    }

    // Inject custom directives that we need only after login
    // this.injectDirectives();

    // connect to socket server for web rtc
    this._rtcSocketService.connect();

    //start snooze feature for appointments if user has prevelege for it
     //start snooze feature for appointments if user has prevelege for it
     if (this._userService.can('CAN_LIST_CALENDAR')) {
      let calendarService = this._injector.get(CalendarService);
      calendarService.initSnoozer();
    }
  }
  /**
   * @author Hannan Desai
   * @description
   *        This function is used to perform logic after successfull logout.
   */
  public doLogout() {
    //Reset user details
    this._userService.updateUserDetails({});

    //reset isAuthenticated
    this.isAuthenticated = false;

    //Delete token
    this._localStorageUtilityService.removeFromLocalStorage('xsrfToken');

    //Delete taxyear
    this._localStorageUtilityService.removeFromLocalStorage('taxYear');
  }

  /**
   * @author Hannan Desai
   * @description
   *         Used to redirect to last attmpted user path if default location id is selected.
   */
  private redirectAfterSessionOrLogin(userDetail: any, redirctToLastUserPath?: boolean, fallback?: boolean) {
    let router = this._injector.get(Router);
    if (userDetail && userDetail.isPasswordChangeRequired === true) {
      router.navigateByUrl('/manage/change/password/expire');
    } else if (userDetail && Object.keys(userDetail.assignedLocations).length > 0 && !userDetail.settings.defaultLocationId) {
      router.navigateByUrl('/office/selection');
    } else if (redirctToLastUserPath === true && this.lastUserPath) {
      router.navigateByUrl(this.lastUserPath)
    } else if (fallback === true) {
      router.navigateByUrl("/home");
    }
  }

  /**
   * @author Hannan Desai
   * @param response 
   *          Contains response comes from session or login call.
   * @description
   *          This function is used to override user data after every session call, when user reloads the app.
   */
  public recreateLogin(response: any): void {
    this.doLogin(response);
  }

  /**
   * @author Hannan Desai
   * @param redirectToLastUserPath
   *        Holds the boolean flag, whether after session cal redirect to lastuserpath or default path. 
   * @description 
   *        This function is call session api and do further lgic after session establishment.
   */
  public createSession(redirectToLastUserPath: boolean) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.isSessionEstablished = false;
      self._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_SESSION, methodType: "get", showLoading: false })
        .then((response) => {
          // Check Browser Details
          if (response.data && response.data.browserDetails) {
            self._preloadCheckService.checkBrowserSupported(response.data.browserDetails);
          }
          if (!this._preloadCheckService.isBrowserSupportedUAParser() && location.pathname && location.pathname.toLowerCase() !== '/tryitnow' && !response.data.isDemoUser) {
            let dialogService = this._injector.get(DialogService);
            let dialog = dialogService.custom(PreloadCheckComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'lg' });
            dialog.result.then((response) => { });
          }
          //make flag true that indicate session establisment
          self.isSessionEstablished = true;
          if (response.data && response.data.email) {
            //As user is already logged in on server. Set details in client side/
            self.recreateLogin(response.data);
            //check and register service worker
            self.registerServiceWorker().then((result) => {
              self._appLoadingBarService.disableAppLoadingBar('system');
              resolve("success");
              self.redirectAfterSessionOrLogin(response.data, redirectToLastUserPath, false);
            }, (error) => {
              self._appLoadingBarService.disableAppLoadingBar('system');
              resolve("success");
              self.redirectAfterSessionOrLogin(response.data, redirectToLastUserPath, false);
            });
          } else {
            //No user data in session (user is not already logged in)
            self._appLoadingBarService.disableAppLoadingBar('system');
            if (self._resellerService.hasFeature('CHAT')) {
              self.injectChatCode(response, environment.chat_url, false);
            }
            resolve("success");
          }
        }, (error) => {
          self._appLoadingBarService.disableAppLoadingBar('system');
          reject(error);
        });
    })
  }

  /**
   * @author Hannan Desai
   * @param username 
   *        Conatins username
   * @param password 
   *        Contains password
   * @param recaptchaResponse
   *        Conatins response of recaptcha 
   * @param fingerPrint 
   *        Contains browser fingerprint.
   * @description
   *        This function is used to call login api.
   */
  public login(username: string, password: string, recaptchaResponse?: string, fingerPrint?: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      const parameterObject = {
        email: username,
        password: password,
        recaptchaResponse: recaptchaResponse,
        fingerPrint: fingerPrint,
        pcConfig: self._preloadCheckService.getPCConfig()
      }
      self._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_LOGIN, parameterObject: parameterObject }).then((response) => {
        // here we check if two factor authentication is enabled than we can not set login here.
        // else flow will work as it is.
        if (!response.data.twoFactorAuthentication || response.data.twoFactorAuthentication.isEnabled !== true) {
          self.registerServiceWorker().then(() => {
            self.doLogin(response.data);
            self.redirectAfterSessionOrLogin(response.data, false, true);
            resolve(response.data);
          }, () => {
            resolve(response.data);
          });
        } else {
          resolve(response.data);
        }
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @param verificationCode
   *        Conatins verification code entered by user. 
   * @param loginResponse 
   *        Conatins login response to set login.
   * @description
   *        Call API that checks the verification code for two factor authentication
   */
  public verifyTwoFactorAuthenticationCode(verificationCode: number, loginResponse: any) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_VERIFY_TWOFACTOR, parameterObject: { data: { 'code': verificationCode, 'emailHash': loginResponse.emailHash } } })
        .then((response) => {
          // if code matched than we set login flag true.
          if (response.code === 9000) {
            self.registerServiceWorker().then(() => {
              self.doLogin(loginResponse);
              self.redirectAfterSessionOrLogin(loginResponse, false, true);
              resolve(loginResponse);
            }, () => {
              resolve(loginResponse);
            });
          } else {
            // if verification code is not matched than we pass error code in error.
            reject(response.code);
          }
        }, (error) => {
          reject(error);
        });
    })
  }

  /**
   * @author Hannan Desai
   * @param loginResponse
   *        Holds response comes from login request.
   * @description 
   *        This function is call API to rsend two factor authentication code in login.
   */
  public resendTwoFactorAuthenticationCode(loginResponse: any) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_RESEND_TWOFACTOR_CODE, parameterObject: { data: { 'emailHash': loginResponse.emailHash } } })
        .then((response) => {
          if (response) {
            resolve(response.data);
          }
        }, (error) => {
          reject(error);
        });
    })
  }

  /**
   * @author Hannan Desai
   * @param overwriteSessionFlag
   *        Holds the overwrite session flag. 
   * @param fingerPrint 
   *        Holds the browser fingerprint.
   * @description
   *        This function is used to call API to overwrite session when user is already logged in somewhere else.
   */
  public overwriteSession(overwriteSessionFlag: boolean, fingerPrint: string) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonAPI.getPromiseResponse({
        apiName: APINAME.OVERWRITE_SESSION,
        parameterObject: { 'overwriteSession': overwriteSessionFlag, 'fingerPrint': fingerPrint, 'pcConfig': self._preloadCheckService.getPCConfig }
      }).then((response) => {
        if (!response.data.twoFactorAuthentication || response.data.twoFactorAuthentication.isEnabled !== true) {
          // check session overwrite is successful or not. perform necessary action.
          if (response.code == 2003) {
            self.registerServiceWorker().then(() => {
              self.doLogin(response.data);
              self.redirectAfterSessionOrLogin(response.data, false, true);
              resolve(response.data);
            }, () => {
              resolve(response.data);
            });
          } else {
            self.logout();
            reject();
          }
        } else {
          resolve(response.data);
        }
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This will call logout API and destroy session,
   */
  public logout() {
    const self = this;
    return new Promise((resolve, reject) => {
      self._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_LOGOUT }).then((success) => {
        self.doLogout();
        resolve(success);
      }, function (error) {
        reject(error);
      });
    })
  }


  /**
   * @author Hannan Desai
   * @param registrationData
   *        Holds registration data.
   * @param trackingId
   *        Holds tracking id.
   * @description
   *        Method is calling the API to sent the mail to user email address to confirm the registration 
   */
  public registration(registrationData: any, trackingId: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({
        apiName: APINAME.AUTH_REGISTRATION, parameterObject: {
          registration: {
            email: registrationData.email,
            firstName: registrationData.firstName,
            lastName: registrationData.lastName,
            phoneNo: registrationData.phoneNo,
            firmName: registrationData.firmName,
            addLocation: true,
            trackingId: trackingId == undefined ? '' : trackingId,
            countryCode: registrationData.countryCode
          }
        }
      }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @param key 
   *        Holds userID for registration.
   * @description
   *        Method is calling the API to verfiy the key used to confirm registration
   */
  public verifyRegRequest(key: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_VERIFY_REGISTRATION, parameterObject: { data: { key: key } } })
        .then((response) => {
          resolve(response);
        }, function (error) {
          reject(error);
        });
    })
  }

  /**
   * @author Hannan Desai
   * @param regForm 
   *        Holds registration details,
   * @param key
   *        Holds key for confirm registration.
   * @description
   *        Method is calling the API to confirm the registration for user         
   */
  public confirmRegRequest(regForm: any, key: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({
        apiName: APINAME.AUTH_CONFIRM_REGISTRATION, parameterObject: {
          verification: {
            email: regForm.email,
            password: regForm.password,
            securityQuestion: regForm.securityQuestion,
            securityAnswer: regForm.securityAnswer,
            isAgreeToTerms: regForm.isAgreeToTerms,
            key: key //key is the key for confirm registration
          }
        }
      }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @param username
   *        Holds email address of account.
   * @description
   *        Method call API to send the mail to email address when user click on reset password        
   */
  public forgotPassword(username) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_FORGOT_PASSWORD, parameterObject: { 'data': { 'email': username } } })
        .then(function (response) {
          resolve(response);
        }, function (error) {
          reject(error);
        });
    })
  }

  //  Method is calling the API to verify the key to reset the password
  public verifyForgotPasswordKey(key: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_VERIFY_FORGOT_PASSWORD, parameterObject: { 'data': { 'key': key } } })
        .then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    })
  }

  // Method to call API to reset the password
  public resetPassword(username: string, key: string, password: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_RESET_PASSWORD, parameterObject: { 'data': { 'email': username, 'key': key, 'password': password } } })
        .then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    })
  }

  // Method is calling the API to verify the unlock key to unlock user account
  public verifyUnlockKey(key: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_VERIFY_UNLOCK, parameterObject: { 'data': { 'key': key } } })
        .then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    })
  }

  //Method call API to send unlock user mail , if user does not receive email
  public resendUnlockAccountEmail(userEmail: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_RESEND_UNLOCK_MAIL, parameterObject: { 'data': { 'email': userEmail } } })
        .then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    })
  };

  //Method call API to send confirmation mail when user is register but not confirm yet
  public resendConfirmation(userEmail: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_RESEND_REGISTRATION_MAIL, parameterObject: { 'data': { 'email': userEmail } } })
        .then((response) => {
          resolve(response);
        }, (error) => {
          reject(error);
        });
    })
  };

  // Method setups a demo session for user.
  public createDemoUser() {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.AUTH_CREATE_DEMO_USER, parameterObject: {} })
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          reject(error);
        });
    })
  };

  // to send demo account info mail
  public sendDemoAccountInfo(email: string, accountInfo: any) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({
        apiName: APINAME.AUTH_SEND_DEMO_INFO,
        parameterObject: {
          'email': email,
          'accountInfo': { userName: accountInfo.userName, password: accountInfo.password }
        }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is called after session call to register service worker to our application.
   */
  private registerServiceWorker() {
    return new Promise((resolve, reject) => {
      let userDetails = this._userService.getUserDetails();
      if (this._resellerService.hasFeature('NOTIFICATION') && !userDetails.isDemoUser) {
        this.firebaseService.firebaseConfiguration().then(() => {
          resolve(true);
        })
      } else {
        resolve(true);
      }
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is called after service worker initialization to reload application after activation.
   */
  private reloadOnSWActivate() {

  }

  /**
   * @author Asrar memon
   * @description
   *        This function is used to inject chat code to our app.
   */
  private injectChatCode(userData: any, chatUrl: string, isAuthenticatedUser) {

    // //Redirect if operator offline
    LHCChatOptions.opt = {};
    //Height width of chat window
    LHCChatOptions.opt.widget_height = 340;
    LHCChatOptions.opt.widget_width = 300;
    LHCChatOptions.opt.popup_height = 520;
    LHCChatOptions.opt.popup_width = 500;
    if (isAuthenticatedUser === true) {
      LHCChatOptions.opt.offline_redirect = '/manage/support/email';
      LHCChatOptions.attr_prefill = new Array();
      LHCChatOptions.attr_prefill.push({ 'name': 'username', 'value': userData.firstName + ' ' + userData.lastName + ' (' + userData.locations[userData.masterLocationId].customerNumber + ')' });//Actually It will serve as Name at agent side
      LHCChatOptions.attr_prefill.push({ 'name': 'email', 'value': userData.email });
      LHCChatOptions.attr_prefill.push({ 'name': 'phone', 'value': userData.phoneNo });
      //
      LHCChatOptions.attr_online = new Array();
      LHCChatOptions.attr_online.push({ 'name': 'Account Number', 'value': userData.locations[userData.masterLocationId].customerNumber });
      LHCChatOptions.attr_online.push({ 'name': 'E-Mail', 'value': userData.email });
      LHCChatOptions.attr_online.push({ 'name': 'Name', 'value': userData.firstName + ' ' + userData.lastName });

      (function () {
        let po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        let refferer = (document.referrer) ? encodeURIComponent(document.referrer.substr(document.referrer.indexOf('://') + 1)) : '';
        let location = (document.location) ? encodeURIComponent(window.location.href.substring(window.location.protocol.length)) : '';
        po.src = '//' + chatUrl + '/lhc_web/index.php/chat/getstatus/(click)/internal/(position)/middle_right/(ma)/br/(check_operator_messages)/true/(top)/350/(units)/pixels/(leaveamessage)/true/(department)/1?r=' + refferer + '&l=' + location + '&prefill%5Busername%5D=Username%20here';
        let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    } else {
      LHCChatOptions.opt.offline_redirect = window.location.origin + '/contact-us?offline=true';
      LHCChatOptions.attr_prefill = new Array();
      LHCChatOptions.attr_prefill.push({
        'name': 'username',
        'value': 'Visitor (000020150000000)'
      }); //Actually It will serve as Name at agent side

      //
      LHCChatOptions.attr_online = new Array();
      LHCChatOptions.attr_online.push({
        'name': 'Account Number',
        'value': '000020150000000'
      });
      (function () {
        let _url = '//' + chatUrl + '/lhc_web/index.php/chat/getstatus/(position)/middle_right/(ma)/br/(check_operator_messages)/true/(top)/350/(units)/pixels/(leaveamessage)/true/(department)/1/(theme)/1?r=';;
        if (window.location.href.indexOf('test.') > 0 || window.location.href.indexOf('localhost') > 0) {
          _url = '//' + chatUrl + '/lhc_web/index.php/chat/getstatus/(position)/middle_right/(ma)/br/(check_operator_messages)/true/(top)/350/(units)/pixels/(leaveamessage)/true/(department)/1/(theme)/1?r=';;
        }
        let po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        let refferer = (document.referrer) ? encodeURIComponent(document.referrer.substr(document.referrer.indexOf('://') + 1)) : '';
        let location = (document.location) ? encodeURIComponent(window.location.href.substring(window.location.protocol.length)) : '';
        po.src = _url + refferer + '&l=' + location + '&prefill%5Busername%5D=Username%20here';
        let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    }
  }

  /**
  * @author om kanada
  * @param key
  * @description
  * Method is calling the API to verify the key to reset the password.
  */
  verifyKey(key: string) {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({
        apiName: APINAME.VERIFY_KEY,
        parameterObject: { 'data': { 'key': key } }
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Mansi Makwana
   * @description
   * Method is calling the API to get Quick Tips data
   */
  getQuickTipsData() {
    return new Promise((resolve, reject) => {
      this._commonAPI.getPromiseResponse({ apiName: APINAME.GET_QUICK_TIPS }).then((response: any) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });

  }

  /**
   * @author om kanada
   * @description
   * Method is calling the API to get News data
   */
  getNews(length: number) {
    length = 3;
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      this._commonAPI.getPromiseResponse({ apiName: APINAME.GET_NEWS, parameterObject: { items: length }, methodType: 'get' }).then((response: any) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
}
