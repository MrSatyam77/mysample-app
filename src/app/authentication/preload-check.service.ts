// External Imports
import { Injectable } from '@angular/core';
import * as UAParser from 'ua-parser-js';

// Internal Imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { environment } from '@environments/environment';
import { APINAME } from '@app/authentication/authentication.constants';

@Injectable({
    providedIn: 'root'
})

export class PreloadCheckService {
    //holds user agent data
    private preLoadService: any = { userAgent: {}, forceBrowserSupport: false };

    constructor(
        private _commonApiService: CommonAPIService) { }

    private betaOnly() {
        if (environment.mode == 'beta' || environment.mode == 'local') {
            return true;
        } else {
            return false;
        }
    }

    public checkBrowserSupported(browserDetail: any): void {
        this.isBrowserSupportedUAParser();
        let uaDetails = this.getUserAgentDetails();
        let browserObj = browserDetail.find((obj) => { return obj.browserName === uaDetails.browserName && obj.os === uaDetails.os; });
        if (browserObj) {
            this.setBrowserSupport(browserObj.forceBrowserSupport);
        } else {
            this.setBrowserSupport(false);
        }
    }

    /**
    * @author Heena Bhesaniya
    * @description Check Whether Browser is supported
    */
    public isBrowserSupportedUAParser() {
        let parser = new UAParser();
        let userAgent = parser.getResult();
        let browserSupportDoc = environment.reseller_config_global ? environment.reseller_config_global.browserSupport : {};
        let supports = [];
        if (browserSupportDoc && browserSupportDoc[userAgent.os.name]) {
            supports = browserSupportDoc[userAgent.os.name];
        }
        this.preLoadService.userAgent = {
            browserName: userAgent.browser.name,
            isBrowserSupported: false,
            version: userAgent.browser.major,
            os: userAgent.os.name,
            support: supports
        };

        // Check whether the os which is used support this browser
        if (browserSupportDoc && browserSupportDoc[userAgent.os.name] && browserSupportDoc[userAgent.os.name].length > 0) {
            let support = browserSupportDoc[userAgent.os.name];
            for (let browserDetails in support) {
                if (userAgent.browser && support[browserDetails].browser === userAgent.browser.name && !isNaN(parseInt(userAgent.browser.major)) && parseInt(userAgent.browser.major) >= support[browserDetails].version) {
                    this.preLoadService.userAgent.isBrowserSupported = true;
                    return true;
                }
            }
        }
        // Check whether user want to proceed further even if browser not supported
        if (this.checkBrowserSupport()) {
            return true;
        }
        return false;
    }

    /**
     * @author Heena Bhesaniya
     *@description Set forceBrowserSupport flag. 
    */
    public setBrowserSupport(flag) {
        this.preLoadService.forceBrowserSupport = flag;
    };

    /**
    * @author Heena Bhesaniya 
    * @description Check whether user have continue wtihout browser support 
    */
    public checkBrowserSupport() {
        if (this.preLoadService.forceBrowserSupport == true) {
            return true;
        }
        return false;
    };

    /**
    * @author Heena Bhesaniya 
    * @description return user agent details 
    */
    public getUserAgentDetails() {
        return this.preLoadService.userAgent;
    };

    /**
    * @author Heena Bhesaniya 
    * @description check health api call
    */
    public checkHealth() {
        const self = this;
        return new Promise((resolve, reject) => {
            self._commonApiService.getPromiseResponse({ apiName: APINAME.GET_HEALTH_CHECK, methodType: 'get' }).then((response: any) => {
                self.preLoadService.userAgent = response.data.data;
                resolve(self.preLoadService.userAgent);
                resolve();
            }, error => {
                reject(error);
            });
        });
    };

    /**
     * @author Heena Bhesaniya
     * @description used to call api for browser mark support
     * @param data 
     */
    public markBrowserSupport(data) {
        let self = this;
        return new Promise((resolve, reject) => {
            self._commonApiService.getPromiseResponse({ apiName: APINAME.POST_MARK_SUPPORT, methodType: 'post', parameterObject: data }).then((response: any) => {
                resolve(response.data.data);
            }, error => {
                reject(error);
            });
        });

    };

    /**
     * @author Heena Bhesaniya
     * @description GET PC CONFIGURATION
     */
    public getPCConfig() {
        let uaDetails = this.getUserAgentDetails();
        let keys = Object.keys(uaDetails);
        if (!uaDetails || keys.length === 0) {
            this.isBrowserSupportedUAParser();
            uaDetails = this.getUserAgentDetails()
        }
        delete uaDetails.support;
        uaDetails.resolution = screen.height + ' X ' + screen.width
        uaDetails.browserZoom = window.devicePixelRatio * 100
        uaDetails.forceBrowserSupport = this.checkBrowserSupport();
        return uaDetails;
    };

}
