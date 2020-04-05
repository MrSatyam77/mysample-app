// External Imports
import { Injectable, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Internal Imports
import { environment } from '@environments/environment';
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { UserService } from "@app/shared/services/user.service";
import { ResellerService } from "@app/shared/services/reseller.service";
declare var window;

@Injectable({
    providedIn: 'root'
})

export class MediaService {
    //This variable used to track if tracking is still initializing
    private initializing: Boolean = false;

    //This will hold views while tracking is initializing
    private pendingViews = [];

    constructor(
        private _resellerService: ResellerService,
        private _userService: UserService,
        private _commonApiService: CommonAPIService,
        private _injector: Injector) { }

	/**
     * @author Heena Bhesaniya
     * @description This is used to initialize tracking on starting of application
     */
    public initTracking() {
        if (environment.media_url != undefined && environment.media_id != undefined && this._resellerService.hasFeature("TRACKING")) {
            //This variable tells that initialization is in process
            this.initializing = true;

            //update global object for tracking
            environment.dynamic_tm_data = {
                setup: "app",
                uid: "",
                uemail: "",
                module: "",
                mode: "",
                form: "",
                action: ""
            };

            //Load JS file for tracking
            //Note: We have done this to have different Js files loaded for different environment as well it should not block rendering of site
            this._commonApiService.getPromiseResponse({ apiName: '/tm_js.aspx?id=' + environment.media_id + '&mode=2&dt_freetext=&dt_subid1=&dt_subid2=&dt_keywords=', methodType: 'get', showLoading: false, isCachable: false, originKey: 'media_url', responseType: 'Text' }).then((response: any) => {
                let po = document.createElement('script'); po.type = 'text/javascript';
                po.appendChild(document.createTextNode(response.data));
                let s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

                //As tracking JS is loaded, we should call all pending views 	        		        		
                this._performPendingViews();
            });
        };
    }

	/**
    * @author Heena Bhesaniya
	* @description This method will be called from training widget and identifyAndCallView function
	* @param moduleName pass module name
    * @param mode pass  mode name  
    * @param currentForm pass current open form name
    * @param action pass action name which is taken
    */
    public callView(moduleName, mode, currentForm, action) {
        if (environment.media_url != undefined && environment.media_id != undefined && this._resellerService.hasFeature("TRACKING")) {
            //If initialization of tracking is in process we should not call view instead we collect those call in queue
            if (this.initializing == true) {
                this.pendingViews.push({ moduleName: moduleName, mode: mode, currentForm: currentForm });
            } else {
                //Load user details
                let userDetails = this._userService.getUserDetails(undefined);
                if (userDetails == undefined || userDetails == {}) {
                    userDetails = { email: '', masterLocationData: { customerNumber: '' } };
                } else if (userDetails.masterLocationData === undefined || userDetails.masterLocationData == {}) {
                    userDetails.masterLocationData = { customerNumber: '' };
                } else if (userDetails.masterLocationData.customerNumber == undefined) {
                    userDetails.masterLocationData.customerNumber = '';
                }

                //update global object for tracking
                environment.dynamic_tm_data = {
                    setup: "app",
                    uid: userDetails.masterLocationData.customerNumber,
                    uemail: userDetails.email,
                    module: moduleName,
                    mode: mode,
                    form: currentForm,
                    action: action
                };

                //call view
                //start interval in every 0.5 seconds
                let intervalDT_ProcessNewPage = setInterval(() => {
                    // @pending
                    //if DT_ProcessNewPage is defined then cancel interval other call it after every interval
                    if (typeof window.DT_ProcessNewPage != 'undefined') {
                        window.DT_ProcessNewPage();
                        //cancel inteval
                        if (intervalDT_ProcessNewPage != undefined) {
                            clearInterval(intervalDT_ProcessNewPage)
                            intervalDT_ProcessNewPage = undefined;
                        }
                    }
                }, 500);
            }
        }
    };

    /**
    * @author Heena Bhesaniya
    * @description  * This method will be called from pages where training widget is not available.
      * Note: This function is not used yet 
    * @param customMode 
    */
    public identifyAndCallView(customMode) {
        if (this._resellerService.hasFeature("TRACKING")) {
            //get current location path
            let curPath = location.pathname;
            let route = this._injector.get(ActivatedRoute);
            let routeParameterArray = Object.values(route.snapshot.params);//need to check
            if (routeParameterArray.length > 0) {
                curPath = curPath.substring(0, curPath.indexOf("/" + routeParameterArray[0]));
            }
            //to store split path
            let curSplitPath = curPath.split('/');
            let module = curSplitPath[curSplitPath.length - 2];
            let mode = curSplitPath[curSplitPath.length - 1];
            //If there is no module, make mode as module and mode blank
            if (module == '' && mode != '') {
                module = mode;
                mode = '';
            }

            //Call media api
            if (customMode != undefined) {
                this.callView(module, customMode, "", "");
            } else {
                this.callView(module, mode, "", "");
            }
        }
    };

	/**
    * @author Heena Bhesaniya 
	* @description This function perform any pending view.
	* When tracking is under initialization we store all views in queue
	*/
    public _performPendingViews() {
        // If queue has any item
        // @pending
        if (this.pendingViews.length > 0) {
            //In slower PCs it happens that it takes time to have javascript loaded even it is downloaded.
            //If view function (global) 'DT_ProcessNewPage' is not defined that repeat this method after 500 ms 
            if (typeof window.DT_ProcessNewPage == 'undefined') {
                setTimeout(() => {
                    this._performPendingViews();
                }, 500);
            } else {
                //Mark intialization as complete
                this.initializing = false;
                //iterate over queue
                for (let index in this.pendingViews) {
                    //Arguments for view
                    let _args = this.pendingViews[index];
                    this.callView(_args.moduleName, _args.mode, _args.currentForm, "");
                }
            }
        } else {
            //Mark intialization as complete
            this.initializing = false;
        }
    };

}
