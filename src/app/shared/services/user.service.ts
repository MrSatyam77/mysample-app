// External Imports
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import FingerPrint from "fingerprintjs";
import * as CryptoJs from "crypto-js";

// Internal Imports
import { LocalStorageUtilityService } from "@app/shared/services/local-storage-utility.service";
import { ResellerService } from "@app/shared/services/reseller.service";
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { DialogService } from "@app/shared/services/dialog.service";
import { APINAME } from "@app/shared/shared.constants";
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { CommunicationService } from '@app/shared/services/communication.service';
import { UpdatedtermsComponent } from '@app/shared/components/updatedterms/updatedterms.component';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    // holds logged in user details
    private userDetails: any = {};
    //flag for password change
    private isPasswordChangeRequired: boolean = false;
    //flag if Navigator user
    private isNavigatorUser: boolean = false;
    // auto refresh of renewal status
    private renewalStatusRefreshTimer: any;

    // holds selected taxyear of user.
    private taxYear: string = "2018";

    //Holding CSS as per user preferences for all themes
    private themeStyles: any = {};

    // holds selected theme
    private selectedTheme: string = "classic";

    // holds role object of selected location.
    private userRole: any;

    private returnStatusList: Array<any> = [];

    //holds value of the sidebar
    private sidebarDetails: any = [];

    private colorPreference: any = {
        //Default colors for Perform Review
        reject: '#a94442',
        warning: '#8a6d3b',
        info: '#3c763d',
        //Default colors for Form Fields               
        normal: '#000000',
        required: '#ff0000',
        calculated: '#ffd800',
        overriden: '#c0c0c0 ',
        estimated: '#3c763d'
    };

    constructor(
        private _localStorageUtilityService: LocalStorageUtilityService,
        private _resellerService: ResellerService,
        private _commonAPIService: CommonAPIService,
        private _injector: Injector,
        private communicationService: CommunicationService) {
        // set taxyear from localstorage.
        if (this._localStorageUtilityService.checkLocalStorageKey("taxYear")) {
            this.taxYear = this._localStorageUtilityService.getFromLocalStorage("taxYear");
        }
        this.getReturnStatusList();
    }

    //To get isPasswordChangeRequired flag. It is used for password expired at every 90 days feature.
    public getIsPasswordChangeRequired(): boolean {
        return this.isPasswordChangeRequired;
    }

    //To get isNavigatorUser flag. It is used for navigator customer to show dilaog
    public getIsNavigatorUser(): boolean {
        return this.isNavigatorUser;
    }

    // to set is passwordchange required variable.
    public setIsPasswordChangeRequired(value: boolean): void {
        this.userDetails.isPasswordChangeRequired = value;
        this.isPasswordChangeRequired = value;
    }

    //Return current locationId.
    //Note: If current locationId is missing we will return defaultLocationId.It will not fallback to default locationId if isFallback is passed as false
    public getLocationId(isFallback: boolean): string {
        if (this.userDetails) {
            if (this.userDetails.currentLocationId) {
                return this.userDetails.currentLocationId;
            } else if (isFallback && this.userDetails.settings && this.userDetails.settings.defaultLocationId) {
                return this.userDetails.settings.defaultLocationId;
            }
        }
    }

    /** Multi Year
    *Return current tax year (selected by user) or default
    *This code is written as part of multi year feature
    */
    public getTaxYear = function () {
        return this.taxYear;
    };

    /** Multi Year
    *set taxyear for this logged in session
    *This code is written as part of multi year feature
    *Note: we may have to store taxyear in localstorage and clear it out when user loged out.So, tax year does not change if user refresh browser.
    */
    public setTaxYear(taxYear: string) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.taxYear = taxYear;
            //we add here _taxYear to local storage
            self._localStorageUtilityService.addToLocalStorage('taxYear', self.taxYear);

            if (self.userDetails.locationData.returnListIds && self.userDetails.locationData.returnListIds[taxYear]) {
                resolve('success');
            } else {
                //There is no returnListId in client for passed tax year so call api to verify and make one if required
                self._commonAPIService.getPromiseResponse({
                    apiName: APINAME.USER_CHANGE_TAXYEAR,
                    parameterObject: {
                        taxYear: taxYear
                    }
                }).then((response) => {
                    //Update new returnlist id (for passed year in location)
                    if (self.userDetails.locationData.returnListIds) {
                        self.userDetails.locationData.returnListIds[taxYear] = response.data.returnListId;
                    }
                    resolve(response.data);
                }, (error) => {
                    reject(error);
                });
            }
        })
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to return available taxyear.
     */
    public getAvailableTaxYears() {
        let releasedTaxYears = [];
        if (this.userDetails && this.userDetails.license && this.userDetails.license.allowedTaxYears) {
            let systemConfig = this._injector.get(SystemConfigService);
            releasedTaxYears = systemConfig.getAvailableTaxYears();
            let copyOfReleasedTaxYears = JSON.parse(JSON.stringify(releasedTaxYears));
            copyOfReleasedTaxYears.forEach((year) => {
                if (this.userDetails.license.allowedTaxYears[year.id] === undefined) {
                    releasedTaxYears = releasedTaxYears.filter((obj) => { return obj.id !== year.id })
                }
            });
        }
        return releasedTaxYears;
    }

    /**
     * @author Hannan Desai
     * @param privilegeName
     *          Holds value of privilege to be checked.
     * @description
     *          This function check for given privilege if user have access to that privilege or not based on that return boolean value. 
     */
    public can(privilegeName: string): boolean {
        if (privilegeName) {
            // if user is either company administrator or contract contact than bydefauly pass true
            if (this.userDetails.isAdministrator === true || this.userDetails.isContractContact === true) {
                return true;
            }

            //If there privileges not found for logged in user then return false
            if (!this.userRole || !this.userRole.privileges) {
                return false;
            }
            //Get previlege object
            var privilegeObj = this.userRole.privileges.find((obj) => { return obj.name === privilegeName });
            //If that object not found means user does not have that rights
            if (!privilegeObj || typeof privilegeObj !== 'object') {
                return false;
            } else {
                //Privilege Found
                return true;
            }
        }
        //Default return as false;
        return false;
    }

    //Check if user has required role or not
    public is(roleType: string): boolean {
        //Note: we have to change name with category or roleType when data api change.
        if (this.userRole.name == roleType) {
            return true;
        }
        return false;
    };

    // Change Settings : pass propertyName and value to have updated in userdocument
    public changeSettings(propertyName: string, value: any, userId: string) {
        //Created local variable as we have dynamic key. And this may use in future to update multiple properties at once and we would like to avoid updating
        //all setting instead of changed one.
        let settings = {};
        settings[propertyName] = value;
        //update userDetails based on userId or currently loggedIn user
        if (userId && userId !== this.userDetails.key) {
            return this.updatePreferenceForOtherUser(propertyName, value, userId, settings);
        } else {
            return this.updateSettingsForLoggedInUser(propertyName, value, settings);
        }

    };

    /**
     * @author Hannan Desai
     * @param propertyName
     *          Holds property that needs to be changed. 
     * @param value 
     *          Holds new value of that property
     * @param settings 
     *          Holds settings object
     * @description
     *          This function is used to update settings of lgged in user and calls the API for the same.
     */
    private updateSettingsForLoggedInUser(propertyName: string, value: any, settings: any) {
        return new Promise((resolve, reject) => {
            //if userDetails has not settings property then we create it
            if (!this.userDetails.settings) {
                this.userDetails.settings = {};
            }
            this.userDetails.settings[propertyName] = value;
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_CHANGE_SETTING,
                parameterObject: {
                    settings: settings
                }
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    };

    /**
     * @author Hannan Desai
     * @param propertyName
     *          Holds changed property name. 
     * @param value 
     *          Holds new value
     * @param userId 
     *          Holds userId 
     * @param settings
     *          Holds settings obj 
     */
    private updatePreferenceForOtherUser(propertyName: string, value: any, userId: string, settings: any) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_CHANGE_PREFERENCE,
                parameterObject: {
                    userId: userId,
                    settings: settings
                }
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    }
    //Return single value for single property
    public getValue(key) {
        var value = JSON.parse(JSON.stringify(this.userDetails));
        //splitout properties by dot
        var keys = key.split('.');
        //Loop till last property
        while (keys.length) {
            var key = keys.shift();
            if (value[key]) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        return value;
    }

    // to set role data of location.
    private setRole(role: string) {
        this.userRole = JSON.parse(JSON.stringify(role));
    }

    //return true if flag exist
    public getUpdateNewFeatureFlag() {
        if (this.userDetails && this.userDetails.newFeatureFlag) {
            return this.userDetails.newFeatureFlag;
        } else {
            return false;
        }
    }

    //return true if flag exist
    public setNewFeatureFlag(value) {
        this.userDetails.newFeatureFlag = value;
    }

    public updateUserDetails(userData: any) {
        //copying data - required to copy propery by property
        this.userDetails = JSON.parse(JSON.stringify(userData));

        // check user type
        if (this.userDetails.userType && this.userDetails.userType.length > 0) {
            // prepare
            if (this.userDetails.userType.indexOf(1) >= 0) {
                this.userDetails.isPreparer = true;
            }
            // ero
            if (this.userDetails.userType.indexOf(2) >= 0) {
                this.userDetails.isERO = true;
            }
        }

        //check if password expired
        if (userData && userData.isPasswordChangeRequired === true) {
            // let router = this._injector.get(Router);
            this.isPasswordChangeRequired = true;
            // router.navigateByUrl('/password/change/expire');
            // urlToRedirect.isPasswordChangeRequired = true;
        }

        //check for navigator users
        if (userData && userData.license && userData.license.isNavigatorCustomer === true) {
            this.isNavigatorUser = true;
        }

        // set theme
        // IF theme is not found in user Details then set default theme. ELSE change current theme to theme saved by user.
        if (this.userDetails.settings && this.userDetails.settings.preferences && this.userDetails.settings.preferences.themePreferences) {
            // We store theme in rootscope here.
            // $rootScope.selectedTheme = userDetails.settings.selectedTheme;
            this.selectedTheme = this.userDetails.settings.preferences.themePreferences.theme;
        } else {
            this.selectedTheme = 'classic';
        }

        // Apply user's style (css) as per preferences and theme, load data from API first
        this.updateUserStyle(false);

        // set master location data
        if (this.userDetails.masterLocationId) {
            this.userDetails.masterLocationData = this.userDetails.locations[this.userDetails.masterLocationId];
        }

        let isLocationMissing = false;
        if (this.userDetails.locations) {
            this.setCurrentLocationIdAndData();
            if (Object.keys(this.userDetails.assignedLocations).length > 1 && !this.userDetails.settings.defaultLocationId) {
                isLocationMissing = true;
            }
        }

        //Required changes like updating default taxYear etc...
        //If there is no userData (logout) then we do not require to evaluate license
        if (userData) {
            this.evaluateLicense();
        }

        //IF setup is not done then redirect to setup screen
        if (!this.isOfficeSetupDone() && this.isPasswordChangeRequired === false && !isLocationMissing) {
            let router = this._injector.get(Router);
            let curPath = window.location.pathname;
            // if (curPath.indexOf("/manage/quicksetup") == -1) {
            // if (curPath.indexOf("home") > -1 || curPath.indexOf("login") > -1) {
            // router.navigateByUrl('/manage/quicksetup');
            // } else {
            // curPath = curPath.replace(/\//g, "_");
            // router.navigateByUrl('/manage/quicksetup/a/' + curPath);
            // }
            // }
        }

        // set role
        if (this.userDetails.locations && this.userDetails.locations[this.userDetails.currentLocationId] && this.userDetails.locations[this.userDetails.currentLocationId]["role"]) {
            this.setRole(this.userDetails.locations[this.userDetails.currentLocationId]["role"]);
        }

        //Once user details is updated start auto refresh of renewal status
        this.manualRefreshRenewalStatus(0);

        //check if Terms and Condition version is updated then show dialog
        if (this._resellerService.getValue('shortCode') === 'mtpo' && userData && userData.termsOfUseUpdate === true) {
            const dialogService = this._injector.get(DialogService);
            dialogService.custom(UpdatedtermsComponent, {}, { keyboard: false, backdrop: 'static', size: 'lg' });
        }

        //if user is demoUser then we set emailVerified flag true 
        if (userData.isDemoUser == true) {
            this.setEmailVerificationflag();
        }
    }

    // to update sidebar details
    public updateSidebarDetails(sidebarDetails) {
        this.sidebarDetails = sidebarDetails;
    }

    /**
     * @author Hannan Desai
     * @description
     *         This function is used to set cuurentLocationId for user and if default not selected than we redirect to location selection screen.
     */
    private setCurrentLocationIdAndData() {
        let locationKeys = [];
        if (this.userDetails.assignedLocations) {
            locationKeys = Object.keys(this.userDetails.assignedLocations);
        }

        if (this.userDetails.settings && this.userDetails.settings.defaultLocationId) {
            this.userDetails.currentLocationId = this.userDetails.settings.defaultLocationId;
        } else {
            if (locationKeys.length > 1) {
                // router.navigateByUrl('/office/selection');
            } else if (locationKeys.length === 1) {
                this.userDetails.currentLocationId = locationKeys[0];
            }
        }

        //Making default location data available
        if (this.userDetails.locations[this.userDetails.currentLocationId]) {
            this.userDetails.locationData = this.userDetails.locations[this.userDetails.currentLocationId];
        }
    }

    /**
     * @author Hannan Desai
     * @param locationId 
     *          Holds location id.
     * @description
     *          This function is called when user chnage location, we update a default location id.
     */
    public changeUserLocation(locationId: string) {
        const self = this;
        //set default location based on LocationId
        if (self.userDetails && self.userDetails.locations && self.userDetails.locations[locationId]) {
            self.userDetails.currentLocationId = locationId;
            self.userDetails.locationData = self.userDetails.locations[locationId];
            //execute common logic
            self.commonChangeUserLocation();

        } else {
            //load location data from api
            self.getLocationDetailsFromApi(locationId, true, true).then(function (locationData) {
                self.userDetails.currentLocationId = locationId;
                self.userDetails.locationData = locationData;
                self.userDetails.locations[locationId] = locationData;
                //execute common logic
                self.commonChangeUserLocation();
            }, function (error) { });
        }
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to peform common logic after location change.
     */
    private commonChangeUserLocation() {
        //set role base on current LocationId
        if (this.userDetails.locations && this.userDetails.locations[this.userDetails.currentLocationId] && this.userDetails.locations[this.userDetails.currentLocationId].role) {
            this.setRole(this.userDetails.locations[this.userDetails.currentLocationId].role);
        }
        let router = this._injector.get(Router);
        //IF setup is not done then redirect to setup screen
        router.navigateByUrl('home');
        // if (!this.isOfficeSetupDone()) {
        //     const curPath = window.location.pathname;
        //     if (curPath.indexOf("/manage/quicksetup") == -1) {
        //         router.navigateByUrl('/manage/quicksetup');
        //     }
        // } else {
        //     router.navigateByUrl('home');
        // }
    }

    /**
     * @author Hannan Desai
     * @param locationId 
     *          Holds locationId
     * @param withRoleData 
     *          Holds boolean flag
     * @param forChangeLocation 
     */
    private getLocationDetailsFromApi(locationId: string, withRoleData: boolean, forChangeLocation: boolean) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: forChangeLocation === true ? APINAME.LOCATION_CHANGE : APINAME.LOCATION_OPEN,
                parameterObject: {
                    locationId: locationId,
                    withRoleData: withRoleData,
                }
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    }

    //api call for change user default location
    public changeDefaultLocationApi(locationId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.LOCATION_DEFAULT_CHANGE,
                parameterObject: {
                    locationId: locationId
                }
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    };

    //method call for get latest user details from api
    public getUserDetailsFromApi() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_DETAIL_GET,
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    };

    //method call for get other user's preferences
    public getOtherUserPreferencesFromApi(userId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.USER_GET_PREFRENCE,
                parameterObject: { 'userId': userId }
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    }

    //method to sync user details with latest details
    public syncUserDetailsWithApi() {
        const self = this;
        return new Promise((resolve, reject) => {
            //here we are store current location key in variable so after sync we can set it
            let currentLocationId = self.userDetails.currentLocationId;
            self.getUserDetailsFromApi().then((response) => {
                self.userDetails = response;
                self.userDetails.currentLocationId = currentLocationId;
                //set default location based on LocationId
                if (self.userDetails && self.userDetails.locations && self.userDetails.locations[self.userDetails.currentLocationId]) {
                    self.userDetails.locationData = self.userDetails.locations[self.userDetails.currentLocationId];
                    self.setRole(self.userDetails.locations[self.userDetails.currentLocationId].role);
                }
                // check user type
                if (self.userDetails.userType && self.userDetails.userType.length > 0) {
                    // preparer
                    if (self.userDetails.userType.indexOf(1) >= 0) {
                        self.userDetails.isPreparer = true;
                    }
                    // ero
                    if (self.userDetails.userType.indexOf(2) >= 0) {
                        self.userDetails.isERO = true;
                    }
                }
                //License changes
                self.evaluateLicense();
                resolve();
            }, (error) => {
                reject();
            });
        })
    };

    //Update default location
    public changeDefaultLocation(locationId: string) {
        this.userDetails.settings.defaultLocationId = locationId;
        //API Call to update on server as well
        this.changeDefaultLocationApi(locationId);
    }

    //Return user Details
    public getUserDetails(userId?: string) {
        //if userId is of the current user then don't call api. We have already userDetails of current user.
        //if userId is passed to get userDetail of other user then call API
        if (userId && userId !== this.userDetails.key) {
            return this.getOtherUserPreferencesFromApi(userId);
        } else {
            return this.userDetails;
        }
    }

    //Return sidebar Details
    public getSidebarDetails() {
        return this.sidebarDetails;
    }

    //update user document details
    public updateUserDocumentDetails(documentsSize: any) {
        if (this.userDetails.locations && this.userDetails.locations[this.userDetails.masterLocationId]) {
            this.userDetails.locations[this.userDetails.masterLocationId].documentsSize = documentsSize;
        }
    }

    //set Email verification flage from user detail.
    public setEmailVerificationflag() {
        //emailVerification is not defined
        if (this.userDetails.emailVerification == undefined) {
            this.userDetails.emailVerification = {};
        }

        this.userDetails.emailVerification.verifiedEmail = true;
    };

    //Get Email verification flage from user detail.
    public getEmailVerificationflag(): boolean {
        if (this.userDetails.emailVerification && this.userDetails.emailVerification.verifiedEmail) {
            return this.userDetails.emailVerification.verifiedEmail;
        } else {
            return false;
        }
    };

    //Get Fingerprint from client.
    public getFingerprint() {
        //Generate deviceID required for some state and will be required by IRS from 2016
        let fp1 = new FingerPrint({ canvas: true, ie_activex: true, screen_resolution: true });
        return CryptoJs.SHA1(fp1.get()).toString();
    };

    //Return location data (current and if current is not available then default)
    public getLocationData() {
        return this.userDetails.locationData;
    };

    //set the current location data
    public setLocationData(officeData) {
        Object.assign(this.userDetails.locationData, officeData);
    };

    //------ quick office setup start
    //Return location data (current and if current is not available then default)
    public isOfficeSetupDone(): boolean {
        if (this.userDetails.locationData) {
            if (this.userDetails.locationData.singleOfficePreparer === 0 && this.userDetails.locationData.efinStatus === 2) {
                return true;
            } else if (this.userDetails.locationData.settings && this.userDetails.locationData.settings.setupConfig && this.userDetails.locationData.settings.setupConfig.doNotShowAgain) {
                return true;
            } else if (this.userDetails.locationData.settings && this.userDetails.locationData.settings.setupConfig
                && this.userDetails.locationData.settings.setupConfig.isOfficeDone && this.userDetails.locationData.settings.setupConfig.isPreparerDone) {
                return true;
            } else {
                return false;
            }
        } else {
            //As there is no location Data, There is no sense to evaluate office setup
            return true;
        }
    }

    //update the setUpConfig in all location of user
    public updateLocationsSetUpConfig(locationsSetUpConfig: any) {
        Object.keys(locationsSetUpConfig).forEach((locationId) => {
            let officeData = this.userDetails.locations[locationId];
            if (officeData) {
                if (!officeData.settings) {
                    officeData.settings = {};
                }
                officeData.settings.setupConfig = locationsSetUpConfig[locationId].setupConfig;
            }
        });
        //update the current location data of user
        this.setLocationData(this.userDetails.locations[this.userDetails.currentLocationId]);
    }

    // renewal status starts
    //This function just update renewal flags as per data recieved from api and if user has not viewed renewal screen
    //in this session then show it that screen
    private updateRenewalFlags(data) {
        // FREE, NORMAL, WHITE, YELLOW, LOCK, RED
        if (data) {
            this.communicationService.transmitData({ topic: "offerButton", channel: "offerButton", data: data })
        } else {
            this.communicationService.transmitData({ topic: "offerButton", channel: "offerButton", data: "" })
        }
    };

    //Real API function that get renewal status from api
    private renewalStatusAPI() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.LICENSE_GET_STATUS
            }).then((response) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        })
    };

    /*Register $interval for background refresh*/
    private autoRefreshRenewalStatus() {
        const self = this;
        self.renewalStatusRefreshTimer = setInterval(() => {
            //If is logged in, otherwise cancel interval
            if (self.userDetails) {
                self.renewalStatusAPI().then((response) => {
                    //Update renewal status flags
                    this.updateRenewalFlags(response);
                }, (error) => {
                    //If we receive token incorrect or unauthorized , do not continue this api until next initialization
                    if (error && error.data && error.data.code && (error.data.code == 4004 || error.data.code == 4005)) {
                        clearInterval(self.renewalStatusRefreshTimer);
                    }
                });
            } else {
                //cancel interval
                clearInterval(self.renewalStatusRefreshTimer);
            }
        }, 7200000);
    };

    //API function that will update renewal status for first time and register auto refresh interval
    private getRenewalStatus() {
        //Only if user is logged in. Means userDetails is defined
        const self = this;
        if (self.userDetails) {
            self.renewalStatusAPI().then((response) => {
                //Update renewal status flags
                self.updateRenewalFlags(response);
                /*Re register background refresh of list if not*/
                if (!self.renewalStatusRefreshTimer) {
                    self.autoRefreshRenewalStatus();
                }
            }, (error) => {
                /*Re register background refresh of list if not*/
                if (!self.renewalStatusRefreshTimer) {
                    self.autoRefreshRenewalStatus();
                }
            });
        }
    };

    // cancel interval
    private cancelAutoRenewalCheck() {
        clearInterval(this.renewalStatusRefreshTimer);
    }

    //Function to make request of renewal status at specific interval of time
    private manualRefreshRenewalStatus(delay: number) {
        /*Cancel iterate of auto refresh if already registered*/
        if (this.renewalStatusRefreshTimer) {
            this.cancelAutoRenewalCheck();
            this.renewalStatusRefreshTimer = undefined;
        }

        //Check if delay is passed
        if (delay) {
            setTimeout(() => {
                //Call API function
                this.getRenewalStatus();
            }, delay);
        } else {
            //Call API function
            this.getRenewalStatus();
        }
    };
    //End - Start - renewal status sync
    // renewal ends

    /**
	 * Following function will modify custom status
	 */
    public saveCustomReturnStatus(obj: any) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.LOCATION_SAVE_RETURN_STATUS,
                parameterObject: {
                    newStatus: obj.newStatus,
                    changedStatus: obj.changedStatus,
                    deletedStatus: obj.deletedStatus
                }
            }).then((response) => {
                //because new status' ids are created at server side we get whole custom status as response and we need to update user service accordingly.
                this.setCustomReturnStatus(response.data);
                resolve();
            }, (error) => {
                reject(error);
            });
        })
    };

    /**
     * Function will initialize custom return status.
     * sets default values if not available.
     * This function makes sure that there will be atleast blank array of status available.
     */
    private initializeCustomReturnStatus() {
        //IF location not found then set it blank
        if (!this.userDetails.locationData) {
            this.userDetails.locationData = {};
        }

        //IF location -> settings not found then set it blank
        if (!this.userDetails.locationData.settings) {
            this.userDetails.locationData.settings = {};
        }

        //IF location -> settings -> customReturnStatus not found then set it blank
        if (!this.userDetails.locationData.settings.customReturnStatus) {
            this.userDetails.locationData.settings.customReturnStatus = [];
        }

        //for each custom status set 'isPredefined' flag false.
        this.userDetails.locationData.settings.customReturnStatus.forEach((status) => {
            status.isPredefined = false;
        });
    }

    /**
    * Local function that sets customReturnStatus
    */
    private setCustomReturnStatus(data: any) {
        this.initializeCustomReturnStatus();
        if (data && data.length > 0) {
            this.userDetails.locationData.settings.customReturnStatus = data;
        } else {
            this.userDetails.locationData.settings.customReturnStatus = [];
        }
    }

    /**
    * Local function that sets default values first and then return customReturnStatus
    * here it is must to set isPredefined flag otherwise sorting will not work.
    */
    public getCustomReturnStatusList() {
        this.initializeCustomReturnStatus();
        return this.userDetails.locationData.settings.customReturnStatus;
    }

    /**
    * Will merge default and custom status array and will also set 'isPredefined' flag accordingly.
    */
    public getReturnStatusList() {
        let customStatus = this.getCustomReturnStatusList();
        let systemConfig = this._injector.get(SystemConfigService);
        // combine two array without duplication.
        this.returnStatusList = customStatus.concat(systemConfig.getReturnStatus());
        systemConfig = undefined;
        return this.returnStatusList;
    };


    /**
    * get Status object
    * AS name suggest this function will take status id and will return respective status object.
    * Pass returnData only when you want to update status on server (to support backward compatibility).
    * Currently status is updated only at time of return open
    * the return must not be locked in this case.
    * List will have only temporary status object and status will not update on server in case of preparing list.
    */
    public getReturnStatusObject(status?: any, returnData?: any, refreshStatusList?: any) {
        let id = typeof (status) === 'object' ? status.id : status;

        if (refreshStatusList) {
            refreshStatusList = this.getReturnStatusList();
        }
        //FIND status from id in the array
        let foundStatus = this.returnStatusList.find((obj) => { return obj.id === id });

        //IF not found then try to find it from title ELSE set 'default_1'
        if (!foundStatus) {
            foundStatus = this.returnStatusList.find((obj) => { return obj.title === id });

            if (!foundStatus) {
                foundStatus = this.returnStatusList.find((obj) => { return obj.id === "default_1" });
            }

            //if returnData is defined and return is not locked then update status on server.
            // TODO: This is only workaaround as we import returnAPISevice in it we keep getting service not edfined error.
            // So we copy function to user service, we need to find proper solution in future, we need to resturucture our services.
            if (returnData && !returnData.isLocked) {
                this.changeReturnStatus({ id: returnData.id, status: foundStatus });
            }
        }
        return foundStatus;
    }

    // This method changes the status of selected return
    public changeReturnStatus(returnData: any) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.RETURN_CHANGE_STATUS,
                parameterObject: {
                    'changeStatus': {
                        returnId: returnData.id,
                        status: returnData.status
                    }
                }
            }).then((success) => {
                resolve('success');
            }, (error) => {
                reject(error);
            });
        })
    };

    //Return master location data
    public getMasterLocationData() {
        return this.userDetails.masterLocationData;
    }

    //License Changes : START
    /**
     * @author Hannan Desai
     * @description
     *          This function is used to retun value from license doc.
     */
    public getLicenseValue(property: string, taxYear?: string) {
        let resultToReturn;

        switch (property) {
            case 'individual':
            case 'business':
            case 'webLibrary':
            case 'licenseName':
            case 'enableSignaturePad':
            case 'enableConversion':
                //If taxyear is not passed use, current taxyear selected in header
                if (!taxYear) {
                    taxYear = this.taxYear;
                }
                if (this.userDetails && this.userDetails.license && this.userDetails.license.allowedTaxYears
                    && this.userDetails.license.allowedTaxYears[taxYear] != undefined) {

                    resultToReturn = this.userDetails.license.allowedTaxYears[taxYear][property];
                }
                break;
            default:
                if (this.userDetails && this.userDetails.license) {
                    resultToReturn = this.userDetails.license[property];
                }
                break;
        }
        return resultToReturn;
    }

    /**
     * This function will evaluate user's license for below points
     * - If license details are not proper (type, applicable years, etc...)
     * - Switch year if it is not available as per license
     */
    private evaluateLicense() {
        //Step 1: If there is no license or required flags show error dialog
        if (!this.userDetails || !this.userDetails.license || !this.userDetails.license.type
            || !this.userDetails.license.allowedTaxYears) {

            //Show dialog to contact support
            let dialogService = this._injector.get(DialogService);

            // var dialogConfiguration = { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
            // var dialog = dialogService.openDialog("custom", dialogConfiguration, "taxAppJs/common/partials/licenseErrorDialog.html", "licenseErrorDialogController");
        } else {
            //Step 2: Tax Year            
            var taxYearKeys = Object.keys(this.userDetails.license.allowedTaxYears);
            if (taxYearKeys.indexOf(this.taxYear) === -1) {
                this.setTaxYear(taxYearKeys[taxYearKeys.length - 1]);
            }
        }
    }

    /**
     * This function is responsible for applying css as per colors selected in preference.
     * @param loadFromAPI - If this flag is true then first load new css for all themes from API before applying
     */
    public updateUserStyle(loadFormAPI: boolean) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (loadFormAPI || !(self.themeStyles && Object.keys(self.themeStyles).length > 0)) {
                //Call API
                self._commonAPIService.getPromiseResponse({
                    apiName: APINAME.USER_GET_STYLE_PREFRENCE
                }).then((styleResponse) => {
                    //Response having styles for each theme
                    if (styleResponse && styleResponse.data) {
                        //Assign to local variable
                        self.themeStyles = styleResponse.data;
                        //apply as per current selected theme
                        self.applyUserStyle();
                        resolve();
                    }
                }, (error) => {
                    reject(error);
                });
            } else {
                //Just apply css as per preference and theme
                self.applyUserStyle();
                resolve();
            }
        })
    }

    //User's Style - START
    private applyUserStyle() {
        //Check if style is already append
        let _userPreferenceStyle = document.getElementById('userPreferenceStyle');
        if (_userPreferenceStyle) {
            _userPreferenceStyle.innerHTML = this.themeStyles[this.selectedTheme];
        } else {
            //Not exist then create one
            _userPreferenceStyle = document.createElement('style');
            //Assign id to update later when user change theme
            _userPreferenceStyle.id = "userPreferenceStyle";
            //apply css
            _userPreferenceStyle.innerHTML = this.themeStyles[this.selectedTheme];
            //append to body
            document.body.appendChild(_userPreferenceStyle);
        }
    }

    // get preparerlist from API.
    private getPreparerListFromAPI() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({ apiName: APINAME.USER_GET_PREPARER_LIST }).then((response) => {
                this.userDetails.preparerList = response.data.preparerList;
                resolve(true);
            }, (error) => {
                reject(error);
            });
        })
    }

    // return available list of preparer.
    public getPreparerList() {
        return new Promise((resolve, reject) => {
            if (this.userDetails.preparerList && this.userDetails.preparerList.length > 0) {
                resolve(this.userDetails.preparerList);
            } else {
                this.getPreparerListFromAPI().then((data) => {
                    resolve(this.userDetails.preparerList);
                }, (error) => {
                    reject(error);
                })
            }
        })
    }

    // return if seup done based on condition wheather single office and preparer or multiple office and preparer.
    public isSetupDone() {
        if (!this.userDetails.locationData) {
            return { "isSetupDone": true, "redirectUrl": "/home", "singleOfficePreparer": false };
        } else {
            if (this.userDetails.locationData.singleOfficePreparer == 0) {
                return { "isSetupDone": this.isSingleSetupDone(), "redirectUrl": "/manage/quicksetup", "singleOfficePreparer": true };
            } else {
                return { "isSetupDone": this.isSingleSetupDone(), "redirectUrl": "/home", "singleOfficePreparer": false };
            }
        }
    }

    private isSingleSetupDone() {
        if (this.userDetails.locationData) {
            if ((this.userDetails.locationData.efinStatus == 2 || this.userDetails.locationData.preparerVerified == true)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @author Ravi Shah
     * get Color Preferences of the User
     * @returns
     * @memberof UserService
     */
    public getColorPreferences() {
        if (this.userDetails.settings && this.userDetails.settings.preferences && this.userDetails.settings.preferences.color && Object.keys(this.userDetails.settings.preferences.color).length > 0) {
            return this.userDetails.settings.preferences.color;
        }
        return this.colorPreference;
    }

    /**
     * @author Ravi Shah
     * Update the Preference Settings
     * @param {*} preferenceData
     * @memberof UserService
     */
    public updateUserPreferences(preferenceData) {
        if (!this.userDetails.settings) {
            this.userDetails.settings = {};
        }
        this.userDetails.settings.preferences = preferenceData;

        //set theme
        // IF theme is not found in user Details then set default theme. ELSE change current theme to theme saved by user.
        if (this.userDetails.settings && this.userDetails.settings.preferences && this.userDetails.settings.preferences.themePreferences) {
            // We store theme in rootscope here.
            // $rootScope.selectedTheme = userDetails.settings.selectedTheme;
            this.selectedTheme = this.userDetails.settings.preferences.themePreferences.theme;
        } else {
            this.selectedTheme = 'classic';
        }

        //Apply user's style (css) as per preferences and theme, load data from API first
        this.updateUserStyle(false);
    }
}