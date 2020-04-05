// External Imports
import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

// Internal Imports
import { UserService, MessageService, ResellerService, SystemConfigService, UtilityService, MediaService, SubscriptionService, CommunicationService, BasketService, RTCSocketService, LocalStorageUtilityService, DialogService } from '@app/shared/services/index';
import { environment } from '@environments/environment';
import { BrowserService } from '@app/shared/services/browser.service';
import { FirebaseService } from '@app/shared/services/firebase.service';
import { PreloadCheckService } from '@app/authentication/preload-check.service';
import { GenerateCustomerIdComponent } from '@app/shared/components/generate-customer-id/generate-customer-id.component';
import { RatingService } from "@app/ratings/rating.service";
import { RatingsConfirmationComponent } from "@app/ratings/dialog/ratings-confirmation/ratings-confirmation.component";
import { SalesDialogService } from '@app/shared/services/sales-dialog.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { ReturnAPIService } from '@app/return/return-api.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

    // Widget Popover
    @ViewChild('accountPopover', { static: false }) accountPopover: NgbPopover;
    @ViewChild('instancePreviewPopover', { static: false }) instancePreviewPopover: NgbPopover;
    @ViewChild('notificationPopover', { static: true }) notificationPopover: NgbPopover;

    @Output() sidebarToggler: EventEmitter<any> = new EventEmitter<any>();
    @Input('toggle') toggler: any;

    public availableTaxYear: any;
    public taxYear: any;
    public currentPage: any = {};
    public headerNav: any = {};
    //public hasFeature: any;
    public isShortcutHelpAllowed: boolean = false;
    public isOnline: boolean = true;
    public helpToggle: any = {};
    public taxYearToggle: any = {};
    public Account: any = {};
    public licenseDetails: any = {};
    public masterLocationDetails: any = {};
    public refreshStart: boolean;
    public userAgent: any = {};
    public userDetails: any = {};
    public availableDocumentSize: any = '0';
    public availableMaxStorageSize: any = '0';
    public maxStorageSize: any;
    public notificationStatus: any;
    public Notification: any = {};
    public notiyNotAllowdLocation: any;
    public notificationSettings: any;
    public isNotificationSupported: any;
    public isDemoUser: any;
    public sidebar: boolean = true;
    public sidebarDetails: any = [];

    public themes: any = [
        { id: 'default-light', name: 'Default Light', path: 'assets/default-light.css' },
        { id: 'default-dark', name: 'Default Dark', path: 'assets/default-dark.css' },
        { id: 'green-light', name: 'Green Light', path: 'assets/green-light.css' },
        { id: 'green-dark', name: 'Green Dark', path: 'assets/green-dark.css' }
    ]
    public askForRating: boolean = true;
    private offerButtonSubscription: any;
    public offerButton: string = "";
    public newDeviceRequest: boolean = false;
    public isShowActiveSession: boolean = false;
    public resellerShortCode: string;

    constructor(
        private location: Location,
        private routes: Router,
        private userService: UserService,
        private messageService: MessageService,
        private resellerService: ResellerService,
        private activateRoute: ActivatedRoute,
        private systemConfig: SystemConfigService,
        private browerService: BrowserService,
        private utilityService: UtilityService,
        private mediaService: MediaService,
        private subscriptionService: SubscriptionService,
        private preLoadService: PreloadCheckService,
        private communicationService: CommunicationService,
        private basketService: BasketService,
        private firebaseService: FirebaseService,
        private returnAPIService: ReturnAPIService,
        private router: Router,
        private _rtcSocketService: RTCSocketService,
        private _localStorageUtilityService: LocalStorageUtilityService,
        private _dialogService: DialogService,
        private _ratingService: RatingService,
        private authService: AuthenticationService,
        private salesDialogService: SalesDialogService) {

        this.configureCurrentPage(this.router.url);
        router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.configureCurrentPage(event.url);
            }
        });
        this.setupSocketEventForInstantFormView();
    }

    public betaOnly() {
        if (environment.mode == 'local' || environment.mode == 'beta') {
            return true;
        } else {
            return false;
        }
    }

    public configureCurrentPage(url) {
        if (url.startsWith("/return/edit/"))
            this.currentPage.pageName = "ReturnWorkspace";
        else if (url.startsWith("/return/interview/") || url.startsWith("/return/interviewDemo/"))
            this.currentPage.pageName = "InterviewMode";
        else if (url.startsWith("/home/") || url.startsWith("/dashboard/"))
            this.currentPage.pageName = "Home";
        else if (url.startsWith("/selection")) {
            if ((!this.activateRoute.snapshot.params.mode)) {
                this.currentPage.pageName = 'Selection';
            }
        } else {
            this.currentPage.pageName = '';
        }
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to join socket room with cusomer id and also subscribe to socket events for new device request.
     */
    private setupSocketEventForInstantFormView() {
        let userDetails = this.userService.getUserDetails();
        let customerId = userDetails.locations[userDetails.masterLocationId].customerIdValue;
        if (customerId) {
            // join socket room with customer id
            this._rtcSocketService.emit("join", { id: customerId }, (data) => { });
        }

        // check whether there is already a device connected than also join room with that deviceID, in case of user reload app we resatblish socket conn
        if (this._localStorageUtilityService.checkLocalStorageKey("instantFormViewDeviceId")) {
            this._rtcSocketService.emit("join", { id: this._localStorageUtilityService.getFromLocalStorage("instantFormViewDeviceId") }, (data) => { });
        }

        // subscribe to device connected successfully event
        this._rtcSocketService.on("deviceConnected", (data) => {
            console.log("Device connected successfully." + data.deviceID);
            this.isShowActiveSession = true;
            this.newDeviceRequest = true;
            this.messageService.showMessage("New Device connected successfully.", "success");
        })

        // subscribe new device request event
        this._rtcSocketService.on("newDeviceRequest", (data) => {
            // this.instancePreviewPopover.toggle();
            // this.isShowActiveSession = true;
            this.newDeviceRequest = true;
        })
        const self = this;
        this._rtcSocketService.on("closeConnection", data => {
            self.isShowActiveSession = false;
            self._localStorageUtilityService.removeFromLocalStorage("instantFormViewDeviceId");
        });
        this._rtcSocketService.on("handleLeave", data => {
            self.isShowActiveSession = false;
            self._localStorageUtilityService.removeFromLocalStorage("instantFormViewDeviceId");
        });
    }

    setTheme(theme: any) {
        document.getElementById('link-theme').remove();
        const linkEl = document.createElement("link");
        linkEl.setAttribute("rel", "stylesheet");
        linkEl.setAttribute("type", "text/css");
        linkEl.setAttribute("href", theme.path);
        linkEl.id = 'link-theme';
        document.head.appendChild(linkEl);
    }

    /**
     * @author shreya kanani
     * @param taxYear 
     * @description change tax year 
     */
    changeTaxYear(taxYear) {
        this.taxYearToggle.isOpen = false
        let currentPath = this.routes.url;
        if (taxYear.id === '2014') {
            if (currentPath === '/proforma/new' || currentPath === '/proforma/list') {
                this.routes.navigate(['home']);
            }
        }
        this.taxYear = this.userService.setTaxYear(taxYear.id).then((success) => {
            //Update local variable with new Tax year
            this.taxYear = taxYear;
            //start - Code to refresh current view  
            //Below line will store current path in currPath variable
            let currentPath = this.routes.url;


            /*Below lines will replace the '/' of currPath with '_' and 
             * it will be passed as a parameter for the page 'redirect.html' */
            var path = currentPath.replace(/\//g, '_');
            this.routes.navigate(["/redirect/" + path]);
            //End - Code to refresh current view
        }, (error) => {
            this.messageService.showMessage('An error occurred while attempting to change the tax year. Please try again or contact support via Live Chat.', 'error');
        });
        this.authService.getSidebarDetailsFromAPI().then((sidebardata) => {
            this.sidebarDetails = sidebardata;
        });
        //change for 2019 allowed feature
        if (this.betaOnly() == false) {
            if (this.userService.getTaxYear() == '2019' && currentPath != '/login' && currentPath != '/registration' && currentPath != '/logout' && currentPath != '/manage/change/password' && currentPath != '/alert/privilegesInfo' && currentPath != '/home' && currentPath != '/alert/allowedFeature' && currentPath.indexOf('/office') != 0 && currentPath.indexOf('/manage') != 0 && currentPath.indexOf('/bank') != 0 && currentPath.indexOf('/preferences') != 0 && currentPath.indexOf('/home/settings') != 0 && currentPath.indexOf('/instantFormView') != 0) {
                this.routes.navigate(['/alert/allowedFeature']);
            } else {
                this.routes.navigate(['/home']);
            }
        }
    }

    taxAdvice() {
        // let url = window.location.pathname.split("/");
        // if (url.includes('return') && url.includes('edit')) {
        //   this.currentPage.pageName = 'ReturnWorkspace';
        // } else if (url.includes('home') || url.includes('home')) {
        //   this.currentPage.pageName = 'Home';
        // } else if (url.includes('selection')) {
        //   if ((!this.activateRoute.snapshot.params.mode)) {
        //     this.currentPage.pageName = 'Selection';
        //   }
        // } else if ((url.includes('return')) && (url.includes('interview')) || (url.includes('interviewDemo'))) {
        //   this.currentPage.pageName = 'InterviewMode';
        // }
        // this.hasFeature = function (featureName) {
        //   return this.resellerService.hasFeature(featureName);
        // };

    }



    /**
     * this will get nextworkstatus and show icon based on it. 
     * */

    // var _networkStatusSubscription = postal.subscribe({
    //  channel: 'MTPO-UI',
    //  topic: 'networkStatus',
    //  callback: function (data, envelope) {
    //    $scope.isOnline = data.isOnline;
    // }
    // });

    /**
     * @author shreya kanani
     * @description redirect to setup 
     */
    redirectToSetup() {
        this.routes.navigateByUrl("/office/overview");
    }
    /**
     * @author shreya kanani
     * @description open keyboardshortcut dialog
     */
    openKeyboardShortcutDialog() {
        this.utilityService.openShortcutDialog();
    }

    /**
     * @author shreya kanani
     * @description reload the app
     */
    reloadApplication() {
        this.browerService.reloadApplication(true);
    }

    /**
     * @author shreya kanani
     * @description call api on opening of accountinformation popover
     *
     */
    callMediaAPI() {
        this.Account.isOpen = true;
        this.helpToggle.isOpen = false;
        this.mediaService.identifyAndCallView('accountInformation');
    };

    public writeToUs() {
        if (this.isDemoUser == true) {
            this.salesDialogService.openSalesDialog("writeToUs");
        } else {
            this.routes.navigateByUrl("/manage/support/email");
        }
    };
    public hasFeature(featureName) {
        return this.resellerService.hasFeature(featureName);
    };

    /**
     * @author shreya kanani
     * @description refresh the userdetails 
     */
    refreshUserDetailsWithAPI() {
        const self = this;
        self.refreshStart = true;
        //Get user data from api
        self.userService.syncUserDetailsWithApi().then(function () {
            self.refreshStart = false;
            //Reload new data/refresh data
            self.getUserDetails();
        }, function (error) {
            self.refreshStart = false;

        });
    };

    /**
     * @author shreya kanani
     * @description get the userdetails 
     */
    getUserDetails() {
        this.userDetails = this.userService.getUserDetails();
        //get master location details
        if ((this.userDetails.locations) && (this.userDetails.locations[this.userDetails.masterLocationId])) {
            this.masterLocationDetails = this.userDetails.locations[this.userDetails.masterLocationId];
            //get value of addOnUsers
            this.licenseDetails.noAddOnUsersSubscription = this.userService.getLicenseValue('addonUsers', 'taxYear');

            //Get license name for all years
            this.licenseDetails.licenseNames = [];
            for (var index = this.availableTaxYear.length - 1; index >= 0; index--) {
                this.licenseDetails.licenseNames.push({ 'year': this.availableTaxYear[index].id, 'name': this.systemConfig.getLicenseDisplayText(this.userService.getLicenseValue('licenseName', this.availableTaxYear[index].id)) });
            }

            this.licenseDetails.subscriptionType = this.userService.getLicenseValue('type', 'taxYear');
            if ((this.masterLocationDetails.documentsSize)) {
                if (this.masterLocationDetails.documentsSize === 0)
                    this.availableDocumentSize = '0';
                else {
                    if (this.masterLocationDetails.documentsSize >= 1024) {
                        this.availableDocumentSize = (this.masterLocationDetails.documentsSize / 1024).toFixed(2);
                    }
                    else
                        this.availableDocumentSize = this.masterLocationDetails.documentsSize.toFixed(2);
                }
            }
            //store maxStorageSize
            this.maxStorageSize = this.userService.getLicenseValue('totalStorage', 'taxYear');
            if ((this.maxStorageSize)) {
                if (this.maxStorageSize === 0)
                    this.availableMaxStorageSize = '0';
                else {
                    if (this.maxStorageSize >= 1024)
                        this.availableMaxStorageSize = (this.maxStorageSize / 1024).toFixed(2);
                    else
                        this.availableMaxStorageSize = this.maxStorageSize
                }
            }
            if ((this.masterLocationDetails.documentsSize) && (this.maxStorageSize)) {
                if (this.maxStorageSize >= 1024 && this.masterLocationDetails.documentsSize < 1024 && this.masterLocationDetails.documentsSize > 0) {
                    this.availableMaxStorageSize = this.availableMaxStorageSize + ' GB';
                    this.availableDocumentSize = this.availableDocumentSize + ' MB';
                } else if (this.maxStorageSize >= 1024 && this.masterLocationDetails.documentsSize === 0) {
                    this.availableMaxStorageSize = this.availableMaxStorageSize + ' GB';
                } else {
                    if (this.maxStorageSize >= 1024)
                        this.availableMaxStorageSize = this.availableMaxStorageSize + ' GB';
                    else
                        this.availableMaxStorageSize = this.availableMaxStorageSize + ' MB';
                }
            }
        }
    };



    //Redirect to subscription
    public goToSubscription() {
        if (this.resellerService.hasFeature('SUBSCRIPTION')) {
            //Close account information
            this.Account.isOpen = false;
            //Display dialog
            this.subscriptionService.goToSubscription(this.masterLocationDetails.customerNumber);
        }
    };

    public getUrlToDownloadPdfUserMenual(type) {
        switch (type) {
            case 'user_menual':
                return environment.static_url + '/resources/v1/MyTAXPrepOffice_User_Manual.pdf';
            default:
                return;
        }

    };
    // Add sample returns in return list
    public addSampleReturns() {
        const self = this;
        this.returnAPIService.addSampleReturns().then(function (response) {
            self.communicationService.transmitData({ topic: "refreshReturnList", channel: 'MTPO-Dashboard', data: {} })
            self.messageService.showMessage('Sample returns added successfully', 'success');
        }, function (error) {
        });
    }

    /**
     * @author shreya kanani
     * @description initialize notification alerts
     */
    _initializingNotificationAlerts() {
        if (this.isNotificationSupported) {
            var userDetails = this.userService.getUserDetails();

            if (userDetails && userDetails.masterLocationId == 'L-bd2cbd37-6042-45a3-9ae1-19f938c855a5') {
                this.notiyNotAllowdLocation = true
            }
            if (this.notificationSettings == undefined || this.notificationSettings == '') {
                this.notiyNotAllowdLocation = true
            }
            this.notificationStatus = this.firebaseService.getNotificationStatus();
            if (!this.notificationStatus && this.notificationSettings) {
                var frequencyInMin = this.notificationSettings.frequencyOfAlerts;
                if ((this.userDetails.notification) && (this.userDetails.notification.lastAttemptedDate)) {
                    var timeDifferenceOfAttemptNotification = moment(moment().utc().format()).diff(this.userDetails.notification.lastAttemptedDate, 'minutes');
                    var diff = frequencyInMin - timeDifferenceOfAttemptNotification;
                    if (diff > 0) {
                        this._setTimerForNotificationAlerts(diff);
                    } else {
                        this.openNotificationAlert();
                    }
                } else {
                    this.openNotificationAlert();
                }
            }
        }
    }

    /**
   * @author Heena Bhesaniya
   * @description open dialog to generate customer id
   */
    openGenerateCuatomerIdDialog() {
        let dialog = this._dialogService.custom(GenerateCustomerIdComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'lg' });
    }


    /**
     * @author shreya kanani
     * @param minutes 
     * @description set time for notification alerts
     */
    _setTimerForNotificationAlerts(minutes) {
        setTimeout(() => {
            this.openNotificationAlert();
        }, minutes * 60 * 1000);
    }

    /**
     * @author shreya kanani
     * @description open notification
    */
    openNotificationAlert() {
        if (this.notificationStatus === 'granted') {
            this.Notification.isOpen = false;
            setTimeout(() => {
                this.notificationPopover.close();
            }, 1000);
        } else {
            if (this.hasFeature('NOTIFICATION') && this.isDemoUser != true && this.notiyNotAllowdLocation != true) {
                this.Notification.isOpen = true;
                setTimeout(() => {
                    this.notificationPopover.open();
                }, 1000);
                if (this.notificationStatus !== 'blocked') {
                    this._setTimerForNotificationAlerts(this.notificationSettings.frequencyOfAlerts)
                }
            }
        }
    }

    /**
     * @author shreya kanani
     * @param alertAction
     * @description notification action 
     */
    notificationAction(alertAction) {
        const self = this;
        self.Notification.isOpen = false;
        setTimeout(() => {
            self.notificationPopover.close();
        }, 1);
        if (alertAction === 'later') {
            // Call Do it Later API for updating the count
            this.userDetails.notification = this.userDetails.notification || {};
            if (this.userDetails.notification.doItLaterCount) {
                this.userDetails.notification.doItLaterCount += 1;
            } else {
                this.userDetails.notification.doItLaterCount = 1;
            }
            this.userDetails.notification.lastAttemptedDate = moment().utc().format();
            this.firebaseService.doItLater().then(function () {
                self._setTimerForNotificationAlerts(self.notificationSettings.frequencyOfAlerts)
            })
        } else {
            this.firebaseService.requestNotificationPermission().then(function () {
                self.notificationStatus = self.firebaseService.getNotificationStatus();
            });
        }
    }


    /**
    * @author Mansi Makwana
    * @description close Account information popover
    */
    close() {
        this.accountPopover.close();
    }

    /**
     * @author Ravi Shah
     * Toggle left and Right Pane
     * @param {*} topic
     * @memberof HeaderComponent
     */
    headerToggle(topic) {
        if (this.currentPage.pageName == 'ReturnWorkspace' || this.currentPage.pageName == 'InterviewMode') {
            if (topic === 'headerToggleRight' && this.currentPage.pageName == 'InterviewMode') {
                this.communicationService.transmitData({
                    channel: 'MTPO-UI',
                    topic: topic,
                    data: {}
                });
            } else if (topic === 'headerToggleLeft' && this.currentPage.pageName == 'InterviewMode') {
                this.sidebarToggler.emit(topic);
            } else {
                this.communicationService.transmitData({
                    channel: 'MTPO-UI',
                    topic: topic,
                    data: {}
                });
            }
        } else {
            this.sidebarToggler.emit(topic);
        }
    }

    /**
     * @author Asrar Memon
     * start manual training
     * @memberof HeaderComponent
     */
    ManualInAppTraining() {
        this.communicationService.transmitData({ topic: 'introForDashbord', channel: 'MTPO-Dashboard', data: {} });
    }

    /**
     * @author Asrar Memon
     * close preview diloag
     * @memberof HeaderComponent
     */
    closePreview(data) {
        this.instancePreviewPopover.toggle();
    }

    getAskRateFlag() {
        //get askForRating flag to show/hide 'Rate Your Experience' from header
        this._ratingService.ratingDisplay().then((success: boolean) => {
            this.askForRating = success;
        }, (error) => {
            console.error(error);
            this.askForRating = false;
        });
    }

    /**
     * @author Asrar Memon
     * Open Instant Form View in New Window
     * @memberof HeaderComponent
     */
    openInstantFormViewinNewWindow() {
        window.open(`${location.protocol}//${location.host}/instantFormView/preview`, '_blank');
    }

    public openRatingsConfirmationDialog() {
        this._dialogService.custom(RatingsConfirmationComponent, {}, { 'keyboard': false, 'backdrop': true, 'size': 'md' });
    }

    redirectToHome() {
        if (!this.router.url || this.router.url.indexOf('/return/edit/') === -1) {
            this.routes.navigate(['home']);
        }
    }

    ngOnInit() {
        const instantFormViewDeviceId = this._localStorageUtilityService.getFromLocalStorage('instantFormViewDeviceId');
        this.isShowActiveSession = false;
        if (instantFormViewDeviceId) {
            this.isShowActiveSession = true;
        }

        this.offerButtonSubscription = this.communicationService.transmitter.subscribe((data: any) => {
            if (data.channel === "offerButton" && data.topic === "offerButton") {
                this.offerButton = data.data;
            }
        })
        this.Account.isOpen = false;
        this.helpToggle.isOpen = false;

        this.availableTaxYear = this.userService.getAvailableTaxYears();//systemConfig.getAvailableTaxYears();
        /**
         * This will have tax year from userService (set by user or default one)
         */
        const data = this.userService.getTaxYear();
        this.taxYear = this.availableTaxYear.find((t) => { return t.id === data })
        this.taxAdvice();
        this.getUserDetails();
        if (this.systemConfig.isKeyboardShortcutsHelpAllowed(this.location.path())) {
            this.isShortcutHelpAllowed = true;
        }
        if ((this.userAgent) || (this.userAgent.browserName) || (this.userAgent.version) ||
            this.userAgent.browserName == "" || this.userAgent.version == "") {
            this.userAgent.agent = window.navigator.userAgent;
        }
        this.userAgent = this.preLoadService.getUserAgentDetails();
        this.notificationSettings = this.resellerService.getValue("notificationSettings");
        this.isNotificationSupported = this.firebaseService.isSupported();
        this.isDemoUser = this.userService.getValue('isDemoUser');
        this.resellerShortCode = this.resellerService.getValue("shortCode");
        if (this.hasFeature('NOTIFICATION') && !this.isDemoUser) {
            this._initializingNotificationAlerts();
        }
        this.isOnline = true;
        this.getAskRateFlag();
    }

    ngOnDestroy() {
        this.offerButtonSubscription.unsubscribe();
    }

}
