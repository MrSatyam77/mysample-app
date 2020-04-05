// External Imports
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as Fingerprint from 'fingerprintjs';
import * as moment from 'moment';


// Internal Imports
import { DialogService } from '@app/shared/services/dialog.service';
import { KeyboardShortcutDialogComponent } from '@app/shared/components/keyboard-shortcut-dialog/keyboard-shortcut-dialog.component';
import { environment } from '@environments/environment';
import { CommonAPIService } from '@app/shared/services/common-api.service';

// import { UpdatedTermsComponent } from '../dialogs/updated-terms/updated-terms.component';
// import { UploadEfinLetterComponent } from '../dialogs/upload-efin-letter/upload-efin-letter.component';
// import { WaitingStatusComponent } from '../dialogs/waiting-status/waiting-status.component';


@Injectable({
    providedIn: 'root'
})

export class UtilityService {
    private _config = { baseURL: environment.static_url };
    private _urlPatternResources = '{{baseurl}}/resources/{{version}}/';
    private zipCodeList = {};
    constructor(private _dialogService: DialogService,
        private _commonAPIService: CommonAPIService) { }
    // content configuration
    private contentForDialog = {
        'subscription': { 'title': 'Purchase a MyTAXPrepOffice Plan', 'message': 'To purchase a MyTAXPrepOffice Plan, please complete the Registration process by clicking on the “Register Now” button. Click on “Continue with Demo Account” to return to the previous screen.' },
        'conversion': { 'urls': ['/conversion/list', '/conversion/new'], 'title': 'Conversion Testing', 'message': 'You are currently using the demo version of MyTAXPrepOffice. We would be glad to offer you the opportunity to test our conversion by first registering for a free MyTAXPrepOffice account. You will then be able to upload as many prior-year clients as you would like.' },
        'writeToUs': { 'urls': ['/manage/support/email'], 'title': ' Contacting Support', 'message': 'If you would like to ask us a question, you will need to register so we can get you a response.' },
        'user': { 'urls': ['/manage/user/edit'], 'title': 'Additional Users', 'message': 'Because additional users are setup with an email address, you need to register to test the additional user functionality.' },
        'bankEPS': { 'urls': ['/bank/eps'], 'title': 'Enrolling with EPS', 'message': 'We can only receive and process enrollment requests from registered customers.' },
        'bankEPAY': { 'urls': ['/bank/epay'], 'title': 'Enrolling with EPAY', 'message': 'We can only receive and process enrollment requests from registered customers.' },
        'bankATLAS': { 'urls': ['/bank/atlas', '/bank/atlas/result'], 'title': 'Enrolling with ATLAS', 'message': 'We can only receive and process enrollment requests from registered customers.' },
        'bankTPG': { 'urls': ['/bank/tpg'], 'title': 'Enrolling with TPG', 'message': 'We can only receive and process enrollment requests from registered customers.' },
        'protectionPlus': { 'urls': ['/bank/protectionPlus'], 'title': 'Enrolling with Protection Plus', 'message': 'We can only receive and process enrollment requests from registered customers.' },
        'printing': { 'title': 'Printing', 'message': 'If you would like to print a return, please register for a free account.' }
    }


    /**
     *@author Heena Bhesaniya
     * @description This function is used to remove reg expression from given string
     * @param value value that need to be replace with expression
     */
    private escapeRegExp(value) {
        return value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    public _getResourcesUrl() {
        let url = this._urlPatternResources.replace('{{baseurl}}', this._config.baseURL).replace('{{version}}', "v1");
        return url;
    };

    public loadResource(filename) {
        const self = this;
        let resourceUrl = this._getResourcesUrl() + filename + ".json";
        return new Promise((resolve, reject) => {
            self._commonAPIService.getPromiseResponse({
                methodType: "get",
                apiName: "/resources/v1/cityzip.json",
                originKey: "static_url"
            }).then((result) => {
                resolve(result);
            }, (error) => {
                console.log(error);
            })
        });
    }


    public getCityState(zidCode) {
        const self = this;
        return new Promise((resolve, reject) => {
            if (Object.keys(self.zipCodeList).length > 0) {
                resolve(self.zipCodeList[zidCode]);
            } else {
                self.loadResource('cityzip').then((response) => {
                    self.zipCodeList = response;
                    resolve(self.zipCodeList[zidCode]);
                })
            }
        });
    }

    /**
     * @author Heena Bhesaniya
     * @description This function will not support deep (inner level) copy
     * @param srcObject src obj is object from which we need to copy object
     */
    public copyObject(srcObject) {
        return JSON.parse(JSON.stringify(srcObject));
    };

    /**
     * @author Heena Bhesaniya
     * @description This function will replace arg2(find) with arg3(replace) to given value
     * @param value value 
     * @param find finding value
     * @param replace replace value
     */
    public replaceString(value, find, replace) {
        return value.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
    };

    /**
     * @author Heena Bhesaniya
     * @description This function will remove all space from the string.
     * @param value any string value
     */
    public removeSpaces(value) {
        return value.replace(/ /g, "");
    };

    /**
     * @author Heena Bhesaniya
     * @description This Function is used To return browser information
     */
    public getDeviceInformation() {
        //Generate deviceID required for some state and will be required by IRS from 2016
        let fp1 = new Fingerprint({ canvas: true, ie_activex: true, screen_resolution: true });
        let deviceId = CryptoJS.SHA1(fp1.get()).toString();
        //get platform details
        let platform = navigator.platform;
        if (platform.indexOf(' ') > -1) {
            let _splitPlateForm = platform.split(' ');
            platform = _splitPlateForm[0];
        }
        return { "userAgent": navigator.userAgent, "timeZoneOffsetNum": moment().utcOffset(), "browserLanguage": navigator.language, "platform": platform, "systemTs": moment().format(), "deviceId": deviceId }
    }

    /**
     * @author Heena Bhesaniya
     * @description This Function is used to open upload efin letter dialog
     * @param locationInfo pass location info object
     * @param mode pass mode new/edit
     */
    public openUploadEfinLetterDialog(locationInfo, mode) {
        // @pending
        // let self = this;
        // //open upload efin letter dialog
        // return new Promise((resolve, reject) => {
        //     let dialog = self._dialogService.openDialog(UploadEfinLetterComponent, { 'locationId': locationInfo.key, 'firmName': locationInfo.firmName, "efin": locationInfo.efin, "mode": mode }, { 'keyboard': false, backdrop: 'static', 'size': 'lg' });
        //     dialog.result.then(function (result) {
        //         resolve(result);
        //     }, function (error) {
        //         reject(error);
        //     });
        // });
    }

    /**
     * @author Heena Bhesaniya
     * @description This function is used to open updatedTerms Dialog
     */
    public openUpdatedTermsDialog() {
        // @pending
        // //get instance of dialogService
        // this._dialogService.openDialog(UpdatedTermsComponent, {}, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' });
    }

    // // to open dialog on click of rate your experiencefrom header nav.
    // public openRatingsConfirmationDialog() {
    //     this._dialogService.custom(RatingsConfirmationComponent, {}, { 'keyboard': false, 'backdrop': true, 'size': 'md' });
    // }
    /**
     * @author Om kanada
     * @description
     *  To opensales Dialog For Demo user
     */
    // public openSalesDialog(path: string): void {
    //     let content = this.contentForDialog[path];
    //     if (!content) {
    //         content = { title: 'Register Now', message: 'To use this functionality you need to first register with us.' };
    //     }
    //     this._dialogService.custom(SalesDialogComponent, { content: content }, {});

    // }
    /**
     * @author shreya kanani
     * @description
     * To open keyboard shortcut dialog
     */
    public openShortcutDialog() {
        this._dialogService.custom(KeyboardShortcutDialogComponent, {}, { 'keyboard': true, 'backdrop': false, 'size': 'lg' });
    }

    /**
   * @author Hannan Desai
   * @param data 
   *          Holds data to be sorted.
   * @param propertyName 
   *          Holds propname by which data has to be sorted.
   * @description
   *          Used to sort array of object by property name.
   */
    public sortByProperty(data: any, propertyName: string): Array<any> {
        let sortedData = data.sort((obj1: any, obj2: any) => {
            if (obj1[propertyName] < obj2[propertyName]) {
                return -1;
            }
            if (obj1[propertyName] > obj2[propertyName]) {
                return 1;
            }
            return 0;
        })
        return sortedData;
    }

    /**
     * @author Ravi Shah
     * Get the Length of the Object
     * @param {*} obj
     * @returns
     * @memberof UtilityService
     */
    private objectLength(obj) {
        //return Object.keys(obj).length;
        var i = 0;
        for (var prop in obj) {
            i++;
        }
        return i;
    }

    /**
     * @author Ravi Shah
     * Compare the two objects
     * @param {*} obj1
     * @param {*} obj2
     * @returns
     * @memberof UtilityService
     */
    public checkObjectEquals(obj1, obj2) {
        // If premitive or same instance of non-premitive
        if (obj1 === obj2) {
            return true;
        }
        //
        if (typeof obj1 == 'object' && typeof obj2 == 'object') {
            //Get number of properties in object
            let obj1Length = this.objectLength(obj1);
            let obj2Length = this.objectLength(obj2);
            //If both have no properties (empty objects) they are similar
            if (obj1Length == 0 && obj2Length == 0) {
                return true;
            } else if (obj1Length != obj2Length) {
                //If they do not match number properties then there is no need to check further
                return false;
            }

            //Holding result from loop
            let result = true;
            for (let prop in obj1) {
                //If we found false in last iteration just break it
                if (result == false) {
                    break;
                }

                //Property must be own not from inheritance
                if (obj2.hasOwnProperty(prop) == true && obj1[prop] == obj2[prop]) {
                    result = true;
                } else if (typeof obj1[prop] == 'object' && typeof obj2[prop] == 'object') {
                    result = this.checkObjectEquals(obj1[prop], obj2[prop]);
                } else {
                    result = false;
                }
            }

            //If the result of loop is true return ture
            if (result == true) {
                return true;
            }
        }
        //If there is no result just return false
        return false;
    }
}
