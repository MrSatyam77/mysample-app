// External Imports
import { Injectable, Injector } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { catchError } from 'rxjs/operators';


// Internal Imports
import { LocalStorageUtilityService, UserService, ResellerService, MessageService, SentryService } from "@app/shared/services/index";
import { AuthenticationService } from '@app/authentication/authentication.service';

@Injectable({
  providedIn: "root"
})
export class InterceptedHttp implements HttpInterceptor {

  public invalidCSRFAttempt: number;
  public invalidCSRFErrorURL: string;

  constructor(
    private sentryService: SentryService,
    private _localStorageUtilityService: LocalStorageUtilityService,
    private _userService: UserService,
    private _resellerService: ResellerService,
    private _messageService: MessageService,
    private _injector: Injector) { }

  /**
   * @author Hannan Desai
   * @param req 
   * @param next 
   * @description This function is called to intercept any xhr http request, here we append needed headers to request.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ withCredentials: true });

    req = req.clone({
      headers: req.headers.delete("X-Cache")
    });

    if (!req.headers.has("Content-Type") && req.method === "POST") {
      req = req.clone({
        headers: req.headers.set("Content-Type", "application/json")
      });
    }

    //Append unique identifire to avoid caching.
    //All POST request, session and version from GET requests
    if ((req.url != "" && req.method == "POST") || req.url.indexOf("auth/session") > -1 || req.url.indexOf("app/version/get") > -1) {
      req = req.clone({
        url: req.url + "?TS=" + new Date().getTime()
      });
    }

    //Send XSRF Token
    if (this._localStorageUtilityService.getFromLocalStorage("xsrfToken")) {
      req = req.clone({
        headers: req.headers.set("X-XSRF-TOKEN", this._localStorageUtilityService.getFromLocalStorage("xsrfToken"))
      });
    }

    //Send Location id if exist and selected taxyear (default if user has not changed)
    //Argument false means do not fallback from current location > Default > Master
    const locationId = this._userService.getLocationId(false);
    if (locationId) {
      req = req.clone({
        headers: req.headers.set("X-Location", locationId)
      });
    }

    //set appId. If there is no appId in reseller config do not send it.
    const appId = this._resellerService.getValue('appId');
    if (req.url.indexOf('https://media.') < 0 && appId) {
      req = req.clone({
        headers: req.headers.set("X-Appid", appId)
      });
    }

    //X-Taxyear
    //Check if current url is in black list for tax year header. Do not pass X-Tax year for these urls(s)
    if (req.url.indexOf('https://media.') < 0 && req.url.indexOf('/auth/') < 0) {
      req = req.clone({
        headers: req.headers.set('X-Taxyear', this._userService.getTaxYear())
      })
    }

    return next
      .handle(req)
      .do(res => {
        if (res instanceof HttpResponse) {
          this.unwrapHttpValue(res);
        }
        return res;
      }, error => {
        this.handleError(error);
        return throwError(error);
      })
  }

  /**
   * @author Hannan Desai
   * @param response 
   * @description
   *    This function is called when response of xhr request comes, we replace new xsrf token, with old one 
   *    And also we do some other caching logic here.
   */
  unwrapHttpValue(response: any) {
    if (response != null) {
      // Store XSRF-Token
      if (response.headers.get('XSRF-TOKEN') != null) {
        this._localStorageUtilityService.addToLocalStorage('xsrfToken', response.headers.get('XSRF-TOKEN'));
      }
    }

    if (response.status == 200 && response.body && response.body.code) {
      //If invalidCSRFAttempt is not 0 (Means we have hold original request) and url of hold vs this is same then reset attempt 0
      if (this.invalidCSRFAttempt > 0 && this.invalidCSRFErrorURL && response.url
        && response.url.indexOf('/auth/session') < 0 && this.invalidCSRFErrorURL === response.url) {
        this.invalidCSRFAttempt = 0;
      }

      //Success mesassage
      this._messageService.showMessage('', '', 'DAPI_' + response.body.code);
    }
  }

  /**
   * @author Hannan Desai
   * @param count 
   *      Conatins count of reattempt.
   * @param url 
   *      Contains url for which reattempts handled.
   * @description 
   *      This function is called when invalid CSRF rejection code comes from API, than we retry that API after session call for one time.
   */
  setInvaildCSRFAttempt(count: number, url: string) {
    this.invalidCSRFAttempt = count;
    this.invalidCSRFErrorURL = url;
  }

  /**
   * @author Hannan Desai
   * @description This function is used to return current count of invalid CSRF attempt.
   */
  getInvalidCSRFAttemptCount(): number {
    return this.invalidCSRFAttempt;
  }

  /**
   * @author Hannan Desai
   * @param rejection 
   *        Holds error object
   * @description
   *        This function is used todisplay custom error messages in format of toaster when error comes from server.
   */
  private handleError(rejection: any) {
    if (rejection instanceof HttpErrorResponse) {
      this.sentryService.moveErrorToSentry(JSON.stringify(rejection));
      //Store XSRF-Token
      if (rejection.headers.get('XSRF-TOKEN')) {
        this._localStorageUtilityService.addToLocalStorage('xsrfToken', rejection.headers.get('XSRF-TOKEN'));
      }

      if (rejection.status == 500) {
        //This is required for training and news part only.
        if (rejection.url.indexOf('training') < 0 && rejection.url.indexOf('news') < 0 && rejection.url.indexOf('crm') < 0) {
          this._messageService.showMessage('', '', 'DAPI_' + (rejection.error.code || rejection.status));
        }
      } else if (rejection.status == 503) {
        //message key need to be change as it will come from API it self
        this._messageService.showMessage('', '', 'DAPI_' + (rejection.error.code || rejection.status));
      } else if (rejection.status == 400) {
        //message key need to be change as it will come from API it self
        this._messageService.showMessage('', '', 'DAPI_' + (rejection.error.code || rejection.status));
      } else if (rejection.status == 401) {
        this._messageService.showMessage('', '', 'DAPI_' + (rejection.error.code || rejection.status));
      } else if (rejection.status == 403) {
        if (rejection.error.code == 4006) {
          //Retry - Code
          //To Avoid circular dependecy
          const authService = this._injector.get(AuthenticationService);
          authService.createSession(false).then((success) => {
          }, function (error) {
            console.error(error);
          });
        } else if (rejection.error.code == 4005) {//4005 = Invalid CSRF
          //Check invalid CSRF attempt
          if (this.getInvalidCSRFAttemptCount() === 0) {
            //If Attempt is 0. Make make session request and on success of that session call re call error api with new token
            this.setInvaildCSRFAttempt(1, rejection.url);

            const authService = this._injector.get(AuthenticationService);

            authService.createSession(false).then((success) => {
            }, function (error) {
              console.error(error);
            });
          } else {
            //This means we have tried this api one more time for invalid csrf token. So do not try more.
            //To Avoid circular dependecy
            var authService = this._injector.get(AuthenticationService);

            //Delete Token
            this._localStorageUtilityService.removeFromLocalStorage('xsrfToken');
            authService.setIsAuthenticated(false);
            //refresh page and redirect to login page
            location.pathname = '/login';
            window.location.reload();
          }
        } else if (rejection.error.code == 4004) {
          // 4004 = Unauthorized request
          //To Avoid circular dependecy
          const authService = this._injector.get(AuthenticationService);
          //Delete Token
          this._localStorageUtilityService.removeFromLocalStorage('xsrfToken');
          authService.setIsAuthenticated(false);
          //We have to wrap location change inside $evalAsync,so that the location changes properly and everything stays in sync
          location.pathname = '/login';
          window.location.reload();
        }
      }
    } else {
      this.sentryService.moveErrorToSentry(rejection.toString());
    }
  }
}
