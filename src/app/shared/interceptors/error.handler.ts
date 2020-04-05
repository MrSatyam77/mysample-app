// External Imports
import { Injectable, ErrorHandler, Injector } from "@angular/core";
import { HttpErrorResponse } from '@angular/common/http';

// Internal Imports
import { LocalStorageUtilityService, MessageService, SentryService } from "@app/shared/services/index";
import { AuthenticationService } from "@app/authentication/authentication.service";
import { InterceptedHttp } from '@app/shared/interceptors/http.interceptor';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CustomErrorHandler implements ErrorHandler {

    constructor(
        private sentryService: SentryService,
        private _localStorageUtilityService: LocalStorageUtilityService,
        private _messageService: MessageService,
        private _injector: Injector) { }

    /**
     * @author Hannan Desai
     * @param rejection 
     * @description
     *          Used to handle error and performs any custom logic when error comes from API side.
     */
    handleError(rejection: any) {
        if (rejection instanceof HttpErrorResponse) {
            this.sentryService.moveErrorToSentry(JSON.parse(JSON.stringify(rejection)));
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
                    authService.createSession(false).then(function (success) {
                    }, function (error) {
                        console.error(error);
                    });

                    // var promiseUpdate = promiseAuthService.then(function () {
                    //     return $http(rejection.config);
                    // });
                } else if (rejection.error.code == 4005) {//4005 = Invalid CSRF
                    const interceptorService = this._injector.get(InterceptedHttp);
                    //Check invalid CSRF attempt
                    if (interceptorService.getInvalidCSRFAttemptCount() === 0) {
                        //If Attempt is 0. Make make session request and on success of that session call re call error api with new token
                        interceptorService.setInvaildCSRFAttempt(1, rejection.url);

                        const authService = this._injector.get(AuthenticationService);

                        authService.createSession(false).then(function (success) {
                        }, function (error) {
                            console.error(error);
                        });

                        // var promiseUpdate = promiseAuthService.then(function () {
                        //     return $http(rejection.config);
                        // });
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
            if (environment.mode !== 'local') {
                this.sentryService.moveErrorToSentry(rejection.toString());
                console.error(rejection);
            } else {
                console.error(rejection);
            }
        }
    }

}

