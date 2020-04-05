'use strict';

var atlasApp = angular.module('atlasApp', []);
atlasApp.controller('atlasController', ['$scope', '$route', '$log', '$location', '$timeout', '$injector', 'messageService', 'userService', 'atlasService', 'dialogService', 'subscriptionService', 'resellerService', 'environment', 'dataAPI','localeService',
    function ($scope, $route, $log, $location, $timeout, $injector, messageService, userService, atlasService, dialogService, subscriptionService, resellerService, environment, dataAPI,localeService) {


        $scope.betaOnly = function () {
            if (environment.mode == 'beta' || environment.mode == 'local') {
                return true;
            } else {
                return false;
            }
        };
        //Check for privileges
        $scope.userCan = function (privilege) {
            return userService.can(privilege);
        };

        if (!_.isUndefined($route.current) && !_.isUndefined($route.current.extendedProperties) && !_.isUndefined($route.current.extendedProperties.name)) {
            $scope.bankName = $route.current.extendedProperties.name;
        } else {
            $scope.bankName = 'Atlas';
        }

        //here we are checking user CAN_OPEN_BANK not then just redirect to home screen 
        /*if(!$scope.userCan('CAN_OPEN_BANK')) {
            //Redirect
            $location.path('/home');
        }*/

        //to check is user is paid user or not 
        var userDetails = userService.getUserDetails();
        var subscriptionType = '';
        var masterLocationDetails;
        //get master location details
        if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
            masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
        }

        /**
		 * validate date format
		 */
        $scope.checkDateValidation = function (input) {
            var datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

            if (datePattern.test(input)) {
                $scope.isDateWrong = false;
                return false;
            } else {
                $scope.isDateWrong = true;
                return true;
            }
        }

        // checkSamePhone will check office phone and alternate phone both are same or different.
        $scope.checkSamePhone = function() {
            $scope.isPhoneSame = false;
            if($scope.office.primaryPhoneNumber === $scope.office.secondaryPhone) {
                $scope.isPhoneSame = true;
            } else {
                $scope.isPhoneSame = false;
            }
        }

        $scope.businessIncorporationDateValidation = function(form,date){
            var enteredDate = moment(date, 'MM/DD/YYYY').utc();
            var currentDate = moment().utc();
            var startedDate = moment('01/01/1900','MM/DD/YYYY').utc();
            if(enteredDate <= currentDate && enteredDate >=startedDate){
                form.$setValidity('valid', true);
                return true;
            }else{
                form.$setValidity('valid', false);
                return false;
            }

        }


        //validate forms before saving data. Decision making function
		$scope.validateFormToSave = function (form) {
			//validate all forms
			if (!_.isUndefined(form) && (form.atlasProgramTabForm.$invalid == true || form.productHistoryTabForm.$invalid == true || form.officeTabForm.$invalid == true || form.ownerTabForm.$invalid == true || form.bankTabForm.$invalid == true || form.consentTabForm.$invalid == true || $scope.checkConsent())) {
				//open dialog if any form is invalid
				localeService.translate("Please review each of the ERO Enrollment Application Tabs, and complete the required fields displayed in red.", 'EPS_FORM_SAVE_ERROR').then(function (translatedText) {
					var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class displaytext' };
					var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
				});
			} else {
				//call save after validating forms
				$scope.saveBankAtlas();
			}
		}

        $scope.checkConsent = function(){

			if($scope.consent.eroProgramAgreement == false){
				return true;
            }
            
            	// if addOn transmitter fee is less then 0 and addOn transmitter agreement is false then
			// disable save button
			if ($scope.hasFeature('AddOnTransmitterFeeConsent') && !_.isUndefined($scope.atlasProgram.addOnTransmitterFee) && $scope.atlasProgram.addOnTransmitterFee > 0) {
				if ($scope.atlasProgram.addOnTransmitterFeeAgreement == false) {
					return true;
				}
			}
        }

        /**
		 * Method prepared to check the user age > 18 or not
		 * */
        $scope.checkAge = function (form, date) {
            // condition to check date is available
            if (!_.isUndefined(date) && !_.isNull(date)) {
                var enteredDate = moment(date, 'MM/DD/YYYY').utc();
                var currentDate = moment().utc();
                var setDate = moment(currentDate, 'MM/DD/YYYY').utc();
                var years = setDate.diff(enteredDate, 'years');
                if (years < 18) {
                    // set the valid property in $error of form element
                    form.$setValidity('valid', false);
                } else {
                    form.$setValidity('valid', true);
                }
            } else {
                form.$setValidity('valid', true);
            }
        };

        //get subscriptionType
        subscriptionType = userService.getLicenseValue('type');

        //get current taxYear
        $scope.taxYear = userService.getTaxYear();

        if ($scope.taxYear == '2017') {
            var lastDate = new Date('03/02/2018');
            if (new Date() > lastDate) {
                $scope.isClosedEnrollmentFor2017 = true;
            }
        }
        if ($scope.taxYear == '2018') {
            var lastDate = new Date('03/19/2019');
            if (new Date() > lastDate) {
                $scope.isClosedEnrollmentFor2018 = true;
            }
        }


        if (($scope.bankName.toUpperCase() == 'NAVIGATOR' && $scope.taxYear < '2016') || ($scope.bankName.toUpperCase() == 'ATLAS' && $scope.taxYear > '2015')) {
            // redirect to home because navigator bank is not listed in Financial Products for year 2016
            $location.path('/home');
        }
        //condition to check that year equals to 2014
        /*if ($scope.taxYear == '2016') {
            // redirect to home because atlas bank is not listed in Financial Products for year 2014
            $location.path('/home');
        }*/

        if (subscriptionType == 'FREE' && userDetails.isDemoUser != true && resellerService.hasFeature('SUBSCRIPTION')) {
            $location.path('/alert/licenseInfo');
            //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller			  
            // var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/subscriptionDialog.html", "subscriptionDialogController", { "bankProducts": true });
            // dialog.result.then(function (btn) {
            //     subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
            // }, function (btn) {
            //     $location.path('/home');
            // });
        }
        //get reseller name
        $scope.resellerConfig = resellerService.getValues(['appName']);
        $scope.hasFeature = function (featureName) {
            return resellerService.hasFeature(featureName);
        }


        // set by default first tab is true
        $scope.activeTab = {};
        $scope.activeTab.programTab = true;
        //array object declare which contains the mapping of next and previous view for the steps of conversion
        $scope.nextAndPrevAtlasViewMap = [
            { "view": "programTab", "next": "productHistoryTab", "previous": "", "currentView": true, "formName": "atlasProgramTabForm" },
            { "view": "productHistoryTab", "next": "officeTab", "previous": "programTab", "currentView": false, "formName": "productHistoryTabForm" },
            { "view": "officeTab", "next": "ownerTab", "previous": "productHistoryTab", "currentView": false, "formName": "officeTabForm" },
            { "view": "ownerTab", "next": "bankTab", "previous": "officeTab", "currentView": false, "formName": "ownerTabForm" },
            { "view": "bankTab", "next": "consentTab", "previous": "ownerTab", "currentView": false, "formName": "bankTabForm" },
            { "view": "consentTab", "next": "", "previous": "bankTab", "currentView": false, "formName": "consentTabForm" }
        ];

        var _customerNumber, _mailBox;
        // this local variable get current tab form name in nextAndPrevAtlasViewMap array.
        var _getFormName = function () {
            var curView = _.find($scope.nextAndPrevAtlasViewMap, { "currentView": true })["view"];
            //obtaining the index of the current view from the array object on which currently user is.  
            var index = _.findIndex($scope.nextAndPrevAtlasViewMap, function (viewList) {
                return viewList.view == curView;
            });
            return $scope.nextAndPrevAtlasViewMap[index].formName;
        }
        //method defined to change view when user click on next or back button
        //curView = it contains the view on which the user is.
        //mode = it contains the mode of the click button whether it is next button or back button clicked 
        $scope.changeView = function (tabMode) {
            var curView = _.find($scope.nextAndPrevAtlasViewMap, { "currentView": true })["view"];
            //obtaining the index of the current view from the array object on which currently user is.  
            var index = _.findIndex($scope.nextAndPrevAtlasViewMap, function (viewList) {
                return viewList.view == curView;
            });
            if (!_.isUndefined(index) && index !== '') {
                //condition to check which button is pressed.
                if (tabMode == 'next') {
                    _.find($scope.nextAndPrevAtlasViewMap, { "view": curView })["currentView"] = false;
                    _.find($scope.nextAndPrevAtlasViewMap, { "view": $scope.nextAndPrevAtlasViewMap[index].next })["currentView"] = true;
                    $scope.formName = _getFormName();
                    $scope.activeTab[$scope.nextAndPrevAtlasViewMap[index].next] = true;

                } else if (tabMode == 'previuos') {
                    _.find($scope.nextAndPrevAtlasViewMap, { "view": curView })["currentView"] = false;
                    _.find($scope.nextAndPrevAtlasViewMap, { "view": $scope.nextAndPrevAtlasViewMap[index].previous })["currentView"] = true;
                    $scope.formName = _getFormName();
                    $scope.activeTab[$scope.nextAndPrevAtlasViewMap[index].previous] = true;
                }
            }
        };
        //This function call user click tab head than move current tab to selected tab curView Is hold valued selected view.  
        $scope.tabChangeView = function (curView) {
            // this variable hold value to current tab.
            var oldCurView = _.find($scope.nextAndPrevAtlasViewMap, { "currentView": true })["view"];
            //obtaining the index of the current view from the array object on which currently user is.  
            var index = _.findIndex($scope.nextAndPrevAtlasViewMap, function (viewList) {
                return viewList.view == curView;
            });
            if (!_.isUndefined(index) && index !== '') {
                //condition to check which button is pressed.
                _.find($scope.nextAndPrevAtlasViewMap, { "view": oldCurView })["currentView"] = false;
                _.find($scope.nextAndPrevAtlasViewMap, { "view": $scope.nextAndPrevAtlasViewMap[index].view })["currentView"] = true;
                $scope.formName = _getFormName();
                $scope.activeTab[$scope.nextAndPrevAtlasViewMap[index].view] = true;
            }
        }

        // this array is Bank Product History tab Transmitter Used Last Year field  values.
        $scope.typeOfIdentification = _.sortBy([{
            key: "CM",
            dispalyText: "MILITARY ID"
        }, {
            key: "DL",
            dispalyText: "DRIVERS LICENSE"
        }, {
            key: "MX",
            dispalyText: "MEXICAN MATRICULA CARD"
        }, {
            key: "RA",
            dispalyText: "RESIDENT ALIEN ID"
        }, {
            key: "SI",
            dispalyText: "STATE ISSUED ID"
        }, {
            key: "UP",
            dispalyText: "U.S. PASSPORT"
        }, {
            key: "VS",
            dispalyText: "US VISA"
        }], 'dispalyText');

        // this array is Bank Product History tab Transmitter Used Last Year field  values.
        $scope.idIssueLocation = _.sortBy([{
            key: "AA",
            dispalyText: "AA"
        }, {
            key: "AE",
            dispalyText: "AE"
        }, {
            key: "AK",
            dispalyText: "AK"
        }, {
            key: "AL",
            dispalyText: "AL"
        }, {
            key: "AP",
            dispalyText: "AP"
        }, {
            key: "AR",
            dispalyText: "AR"
        }, {
            key: "AS",
            dispalyText: "AS"
        }, {
            key: "AZ",
            dispalyText: "AZ"
        }, {
            key: "CA",
            dispalyText: "CA"
        }, {
            key: "CO",
            dispalyText: "CO"
        }, {
            key: "CT",
            dispalyText: "CT"
        }, {
            key: "DC",
            dispalyText: "DC"
        }, {
            key: "DE",
            dispalyText: "DE"
        }, {
            key: "FL",
            dispalyText: "FL"
        }, {
            key: "FM",
            dispalyText: "FM"
        }, {
            key: "GA",
            dispalyText: "GA"
        }, {
            key: "GU",
            dispalyText: "GU"
        }, {
            key: "HI",
            dispalyText: "HI"
        }, {
            key: "IA",
            dispalyText: "IA"
        }, {
            key: "ID",
            dispalyText: "ID"
        }, {
            key: "IL",
            dispalyText: "IL"
        }, {
            key: "IN",
            dispalyText: "IN"
        }, {
            key: "KS",
            dispalyText: "KS"
        }, {
            key: "KY",
            dispalyText: "KY"
        }, {
            key: "LA",
            dispalyText: "LA"
        }, {
            key: "MA",
            dispalyText: "MA"
        }, {
            key: "MD",
            dispalyText: "MD"
        }, {
            key: "ME",
            dispalyText: "ME"
        }, {
            key: "MH",
            dispalyText: "MH"
        }, {
            key: "MI",
            dispalyText: "MI"
        }, {
            key: "MN",
            dispalyText: "MN"
        }, {
            key: "MO",
            dispalyText: "MO"
        }, {
            key: "MP",
            dispalyText: "MP"
        }, {
            key: "MS",
            dispalyText: "MS"
        }, {
            key: "MT",
            dispalyText: "MT"
        }, {
            key: "NC",
            dispalyText: "NC"
        }, {
            key: "ND",
            dispalyText: "ND"
        }, {
            key: "NE",
            dispalyText: "NE"
        }, {
            key: "NH",
            dispalyText: "NH"
        }, {
            key: "NJ",
            dispalyText: "NJ"
        }, {
            key: "NM",
            dispalyText: "NM"
        }, {
            key: "NV",
            dispalyText: "NV"
        }, {
            key: "NY",
            dispalyText: "NY"
        }, {
            key: "OH",
            dispalyText: "OH"
        }, {
            key: "OK",
            dispalyText: "OK"
        }, {
            key: "OR",
            dispalyText: "OR"
        }, {
            key: "PA",
            dispalyText: "PA"
        }, {
            key: "PR",
            dispalyText: "PR"
        },
        { key: "RI", dispalyText: "RI" },
        { key: "SC", dispalyText: "SC" },
        { key: "SD", dispalyText: "SD" },
        { key: "TN", dispalyText: "TN" },
        { key: "TX", dispalyText: "TX" },
        { key: "UT", dispalyText: "UT" },
        { key: "VA", dispalyText: "VA" },
        { key: "VI", dispalyText: "VI" },
        { key: "VT", dispalyText: "VT" },
        { key: "WA", dispalyText: "WA" },
        { key: "WI", dispalyText: "WI" },
        { key: "WV", dispalyText: "WV" },
        { key: "WY", dispalyText: "WY" }], 'dispalyText');

        if (_.isUndefined($scope.office)) {
            $scope.office = {};
        }
        if (_.isUndefined($scope.bankProductHistory)) {
            $scope.bankProductHistory = {generatedFundingRatio:0 , generatedNumberOfERCsERDsLastYear:0, generatedNumberOfRALsLastYear:0 , generatedTotalPriorYearPrepFeeAmountPaid:0,ultimateRejectRatio:0};
        }
        if (_.isUndefined($scope.atlasProgram)) {
            $scope.atlasProgram = {};
        }
        if (_.isUndefined($scope.owner)) {
            $scope.owner = {};
        }
        if (_.isUndefined($scope.atlasForm)) {
            $scope.atlasForm = {};
        }
        if (_.isUndefined($scope.bank)) {
            $scope.bank = {};
        }
        if (_.isUndefined($scope.consent)) {
            $scope.consent = {};
        }
        // this function call in page load time , check user make bank or edit bank 
        $scope.initBankAtlas = function () {
            $scope.formName = _getFormName();

            $scope.errorList = [];

            atlasService.getAtlasResponse($scope.bankName).then(function (response) {
                _customerNumber = response.enrollmentData.customerNumber;
                _mailBox = response.enrollmentData.mailBox;
                // Check for acknowledgement 
                var result = response.enrollmentData.acknowledgement;

                //Chcek IF acknowledgement not undefined then get errorlist or username or password for atlas.
                if (!_.isUndefined(result) && !_.isEmpty(result)) {
                    if (result.errorCount > 0) {
                        $scope.errorList = result.errors;
                    } else {
                        $scope.adminUserName = result.adminUserName;
                        $scope.adminPassword = result.adminPassword;
                    }
                }

                // this condition is check 'bankAtlasList' is defined or not.
                if (_.isUndefined($scope.bankAtlasList)) {
                    $scope.bankAtlasList = {};
                }
                $scope.bankAtlasList = response.enrollmentData;
                $scope.bankAtlasPreviousData = JSON.parse(JSON.stringify(response.enrollmentData));

                // condition to check isNewEnrollment is true or not
                if (response.isNewEnrollment == true) {
                    // assigning the office efin to atlasProgram efin to display the efin on UI
                    $scope.atlasProgram.efin = angular.copy(userService.getLocationData()['efin']);
                }

                // this condition is check 'bankAtlasList' is empty or not.
                if (!_.isUndefined($scope.bankAtlasList) && !_.isEmpty($scope.bankAtlasList)) {
                    $scope.displayAtlastData($scope.bankAtlasList);
                }
                // this condition is check bank is NewEnroll or not.
                if (response.isNewEnrollment != undefined && response.isNewEnrollment != null && response.isNewEnrollment == false) {
                    $scope.mode = 'update';
                }
                else {
                    $scope.mode = 'create';
                }
            }, function (error) {
            });
        };

        /**
		 * Method prepared to get the URL in order to download the e-collect, e-bonus or protection plus user agreement PDF 
		 * */
        $scope.getUrlToDownloadPdf = function (type) {
            switch (type) {
                case 'ERO':
                    return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/navigator/EROAgreement.pdf';
                default:
                    return;
            }

        };

        /**
         * 
         */
        $scope.checkServiceBureaFeeLimit  = function(){
            if( (parseFloat($scope.atlasProgram.serviceBureauFee) + parseFloat($scope.atlasProgram.addOnserviceBureauFee)) > 99.00 ){
                $scope.serviceLimitExeeded = true
            }else{
                $scope.serviceLimitExeeded = false;
            }
        }

         /**
         * 
         */
        $scope.checkTransmissionFeeLimit  = function(){
            if( (parseFloat($scope.atlasProgram.addOnTransmitterFee) + parseFloat($scope.atlasProgram.technologyFee)) > 84.00 ){
                $scope.transmistterLimitExeeded = true
            }else{
                $scope.transmistterLimitExeeded = false;
            }
        }

        /**
                * This function is used to disable save button when there is no change in enrollment form
                */
        $scope.isChangeData = function () {
            var bankAtlasList = $scope.bankAtlasPreviousData;
            if (!_.isEmpty(bankAtlasList) && JSON.stringify(bankAtlasList.atlasProgram) == JSON.stringify($scope.atlasProgram) &&
                JSON.stringify(bankAtlasList.office) == JSON.stringify($scope.office) &&
                JSON.stringify(bankAtlasList.owner) == JSON.stringify($scope.owner) &&
                JSON.stringify(bankAtlasList.bank) == JSON.stringify($scope.bank) &&
                JSON.stringify(bankAtlasList.consent) == JSON.stringify($scope.consent) &&
                JSON.stringify(bankAtlasList.bankProductHistory) == JSON.stringify($scope.bankProductHistory)) {
                return true;
            } else {
                return false;
            }
        }

        $scope.CheckRAandRAL = function(){
            if($scope.atlasProgram.cashAdvance == 'Y' || $scope.atlasProgram.wantsPreAckRAProduct == 'Y'){
                if($scope.atlasProgram.wantsRALoanProduct == 'Y' || $scope.atlasProgram.wantsPreRALoanProduct == 'Y'){
                    $scope.messageForRAandRAL = "You can only apply to participate in RA or Fixed RA programs not both.";
                    $scope.isMessageForRAandRAL = true;
                    return true;
                }
            }
            if($scope.atlasProgram.wantsRALoanProduct == 'Y' || $scope.atlasProgram.wantsPreRALoanProduct == 'Y'){
                if($scope.atlasProgram.cashAdvance == 'Y' || $scope.atlasProgram.wantsPreAckRAProduct == 'Y'){
                    $scope.messageForRAandRAL = "You can only apply to participate in RA or Fixed RA programs not both.";
                    $scope.isMessageForRAandRAL = true;
                    return true;
                }
            }
            $scope.isMessageForRAandRAL = false;
            return false;
        }

        //this display assign values on UI all model
        $scope.displayAtlastData = function (atlasBankData) {

            if (!_.isUndefined(atlasBankData.atlasProgram)) {
                $scope.atlasProgram = atlasBankData.atlasProgram;
            }
            if (!_.isUndefined(atlasBankData.bankProductHistory)) {
                $scope.bankProductHistory = atlasBankData.bankProductHistory;
                $scope.bankProductHistory.ultimateRejectRatio = atlasBankData.bankProductHistory.ultimateRejectRatio ? atlasBankData.bankProductHistory.ultimateRejectRatio : 0;
                if ($scope.bankProductHistory.businessIncorporationDate) {
                    var temp = new Date($scope.bankProductHistory.businessIncorporationDate);

                    // IF dateofBirth is type of object then change it into masking format
                    if (!_.isUndefined(temp) && angular.isDate(temp)) {
                        var month = temp.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        var date = temp.getDate();
                        if (date < 10) {
                            date = "0" + date;
                        }
                        var year = temp.getFullYear();
                        $scope.bankProductHistory.businessIncorporationDate = month.toString() + date.toString() + year.toString();
                    }
                }
            }
            if (!_.isUndefined(atlasBankData.office)) {
                $scope.office = atlasBankData.office;
                if ($scope.office.officeManagerDateofBirth) {
                    var temp = new Date($scope.office.officeManagerDateofBirth);

                    // IF dateofBirth is type of object then change it into masking format
                    if (!_.isUndefined(temp) && angular.isDate(temp)) {
                        var month = temp.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        var date = temp.getDate();
                        if (date < 10) {
                            date = "0" + date;
                        }
                        var year = temp.getFullYear();
                        $scope.office.officeManagerDateofBirth = month.toString() + date.toString() + year.toString();
                    }
                }
            }
            if (!_.isUndefined(atlasBankData.owner)) {
                $scope.owner = atlasBankData.owner;
                if ($scope.owner.dateOfBirth) {
                    var temp = new Date($scope.owner.dateOfBirth);

                    // IF dateofBirth is type of object then change it into masking format
                    if (!_.isUndefined(temp) && angular.isDate(temp)) {
                        var month = temp.getMonth() + 1;
                        if (month < 10) {
                            month = "0" + month;
                        }
                        var date = temp.getDate();
                        if (date < 10) {
                            date = "0" + date;
                        }
                        var year = temp.getFullYear();
                        $scope.owner.dateOfBirth = month.toString() + date.toString() + year.toString();
                    }
                }
            }
            if (!_.isUndefined(atlasBankData.bank)) {
                $scope.bank = atlasBankData.bank;
                // this condition to apply saving and Checking check box value true or false.
                if (atlasBankData.bank.csAccountType == 'c') {
                    $scope.atlasForm.csAccountType = true;
                }
                else if (atlasBankData.bank.csAccountType == 's') {
                    $scope.atlasForm.csAccountType = false;
                }
                //this condition to apply Personal and Business check box value true or false.
                if (atlasBankData.bank.pbAccountType == 'p') {
                    $scope.atlasForm.pbAccountType = true;
                } else if (atlasBankData.bank.pbAccountType == 'b') {
                    $scope.atlasForm.pbAccountType = false;
                }
                // both variable assign value provide confirm account number 
                $scope.confirmRoutingNumber = atlasBankData.bank.routingNumber;
                $scope.confirmAccouuntNumber = atlasBankData.bank.accountNumber;
            }
            if (!_.isUndefined(atlasBankData.consent)) {
                $scope.consent = atlasBankData.consent;
            }
        };
        //Save EPS 
        $scope.saveBankAtlas = function () {
            //If demo user try to open bank . He/She will be prompted with dialog to either register
            //or continue with demo (which redirect user to home page)
            if (userService.getValue('isDemoUser') == true) {
                var salesDialogService = $injector.get('salesDialogService');
                salesDialogService.openSalesDialog("bankATLAS");
            } else {
                if (subscriptionType == 'FREE') {
                    $location.path('/home');
                }
                // this condition to check  bank account type savings or checking Pass values in APi in c and s 
                if ($scope.atlasForm.csAccountType == true) {
                    $scope.bank.csAccountType = 'c';
                } else {
                    $scope.bank.csAccountType = 's';
                }
                // this condition to check  bank account type personal or business Pass values in APi in p and b
                if ($scope.atlasForm.pbAccountType == true) {
                    $scope.bank.pbAccountType = 'p';
                } else {
                    $scope.bank.pbAccountType = 'b';
                }
                //mantis issue number 1430 now onwards we are passing for both this field
                $scope.bankProductHistory.lastYearsQIKS = "0";
                $scope.bankProductHistory.lastYearsRALS = "0";

                // //This condition check if cash advance option is offred then pass code N03 other wise pass blank 
                // if ($scope.atlasProgram.cashAdvance == 'Y') {
                //     $scope.atlasProgram.cashAdvanceAmountCode = "N04";
                // } else {
                //     $scope.atlasProgram.cashAdvanceAmountCode = "N00";
                // }

                // We need to convert date into date object.
                // here we create new date with masked date value. Our date will be in mm/dd/yyyy format.        
                if (!_.isUndefined($scope.owner.dateOfBirth) && !_.isEmpty($scope.owner.dateOfBirth)) {
                    var dob = moment($scope.owner.dateOfBirth, "MM/DD/YYYY").format("MM/DD/YYYY");
                    $scope.owner.dateOfBirth = dob;
                }
                if(!_.isUndefined($scope.bankProductHistory.businessIncorporationDate) && !_.isEmpty($scope.bankProductHistory.businessIncorporationDate)){
                    var dob = moment($scope.bankProductHistory.businessIncorporationDate, "MM/DD/YYYY").format("MM/DD/YYYY");
                    $scope.bankProductHistory.businessIncorporationDate = dob;
                }
                if(!_.isUndefined($scope.office.officeManagerDateofBirth) && !_.isEmpty($scope.office.officeManagerDateofBirth)){
                    var dob = moment($scope.office.officeManagerDateofBirth, "MM/DD/YYYY").format("MM/DD/YYYY");
                    $scope.office.officeManagerDateofBirth =  dob;
                }

                if($scope.bankProductHistory.previousBankFacilitator == undefined){
                    $scope.bankProductHistory.previousBankFacilitator = "None"
                }

                if($scope.bankProductHistory.numberOfPersonnalInOffice == undefined || $scope.bankProductHistory.numberOfPersonnalInOffice == '' || $scope.bankProductHistory.numberOfPersonnalInOffice == null){
                    $scope.bankProductHistory.numberOfPersonnalInOffice = "0";
                }

                $scope.atlasProgram.cashAdvanceAmountCode = undefined;
                $scope.atlasProgram.technologyFee = "0";
                //this condition to check user data update or new create  
                if ($scope.mode === 'create') {
                    //Create Atlas
                    atlasService.createAtlas($scope.bankName, $scope.atlasProgram, $scope.office, $scope.bankProductHistory, $scope.owner, $scope.bank, _customerNumber, _mailBox, $scope.consent).then(function (success) {
                        messageService.showMessage('Save successfully', 'success', 'BANK_CREATESUCCESS_MSG');
                        //after success we just redirect to result screen
                        $location.path('/home');
                    }, function (error) {
                    });
                } else if ($scope.mode === 'update') {
                    //Save Atlas
                    atlasService.saveAtlas($scope.bankName, $scope.atlasProgram, $scope.office, $scope.bankProductHistory, $scope.owner, $scope.bank, _customerNumber, _mailBox, $scope.consent).then(function (success) {
                        messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
                        //after success we just redirect to result screen
                        $location.path('/home');
                    }, function (error) {
                    });
                }
            }
        };

        // Method to be called on routing number match or not 
        $scope.matchRoutingNumber = function (formObject, hide) {
            if (angular.isDefined(hide) && hide == true) {
                $scope.confirmRoutingNumberError = false;
            } else {
                if (angular.isDefined(formObject)) {
                    $scope.confirmRoutingNumberError = formObject.$error.iMatch;
                }
            }
        };
        // Match Function - End

        // Method to be called on account number match or not 
        $scope.matchAccountNumber = function (formObject, hide) {
            if (angular.isDefined(hide) && hide == true) {
                $scope.confirmAccountNumberError = false;
            } else {
                if (angular.isDefined(formObject)) {
                    $scope.confirmAccountNumberError = formObject.$error.iMatch;
                }
            }
        };
        // Match Function - End

        $scope.initBankAtlas();
    }]);

atlasApp.controller('resultController', ['$scope', '$route', '$location', '$injector', 'atlasService', 'userService', function ($scope, $route, $location, $injector, atlasService, userService) {

    //If demo user try to open bank atlas -result by url. He/She will be prompted with dialog to either register
    //or continue with demo (which redirect user to home page)    
    if (userService.getValue('isDemoUser') == true) {
        var salesDialogService = $injector.get('salesDialogService');
        salesDialogService.openSalesDialog("bankATLAS");
    }

    $scope.errorList = [];

    if (!_.isUndefined($route.current) && !_.isUndefined($route.current.extendedProperties) && !_.isUndefined($route.current.extendedProperties.name)) {
        $scope.bankName = $route.current.extendedProperties.name;
    } else {
        $scope.bankName = 'Atlas';
    }
    atlasService.getAtlasResponse($scope.bankName).then(function (response) {
        var result = response.enrollmentData.acknowledgement;

        if (!_.isUndefined(result) && !_.isEmpty(result)) {
            $scope.status = result.status;

            if (result.errorCount > 0) {
                $scope.errorList = result.errors;
            } else {
                $scope.adminUserName = result.adminUserName;
                $scope.adminPassword = result.adminPassword;
            }
        }

    }, function (error) {

    });



    //Back To Atlas 
    $scope.backToAtlas = function () {
        $location.path('/bank/atlas');
    };

    //Back To Home
    $scope.done = function () {
        $location.path('/home');
    };
}]);

//atlas Bank Factory - Start
atlasApp.factory('atlasService', ['$q', '$log', '$http', 'dataAPI', function ($q, $log, $http, dataAPI) {
    var atlasService = {};

    //attribute list as per new_Atlas Technical Specifications Excel Work Book
    var fieldMappingForError = [
        { atlasField: "BUSINESSTYPE", id: "typeOfBusiness", label: "Organization Type", tab: "Office" },
        { atlasField: "COMPNAME", id: "businessName", label: "Office Name", tab: "Office" },
        { atlasField: "ADDR", id: "address", label: "Address line1", tab: "Office" },
        { atlasField: "ADDR2", id: "address2", label: "Address line2", tab: "Office" },
        { atlasField: "CITY", id: "city", label: "City", tab: "Office" },
        { atlasField: "STATE", id: "state", label: "State", tab: "Office" },
        { atlasField: "ZIP", id: "zip", label: "ZIP Code", tab: "Office" },
        { atlasField: "EMAILADDR", id: "businessEmailAddress", label: "Office Email Address", tab: "Office" },
        { atlasField: "PHONE", id: "primaryPhoneNumber", label: "Office Phone", tab: "Office" },
        { atlasField: "PHONEEXT", id: "primaryPhoneExtension", label: "Office Phone Extension", tab: "Office" },
        { atlasField: "SECPHONE", id: "secondaryPhone", label: "Alternate Phone", tab: "Office" },
        { atlasField: "SECPHONEEXT", id: "secondaryExtension", label: "Alternate Phone Extension", tab: "Office" },
        { atlasField: "PRINCIPAL_SSN", id: "ssnNumber", label: "SSN of Primary Business Owner", tab: "Office" },
        { atlasField: "PRINCIPAL_EIN", id: "einOfBusiness", label: "EIN of Business", tab: "Office" },
        { atlasField: "FNAMECONT1", id: "firstName", label: "Contact First Name", tab: "Office" },
        { atlasField: "LNAMECONT1", id: "lastName", label: "Contact Last Name", tab: "Office" },
        { atlasField: "YEARS_OF_TAX_PREP_EXPERIENCE", id: "numberOfYearsProvidingTPS", label: "Number of years providing Tax Preparation Services", tab: "Office" },
        { atlasField: "NUMBER_OF_OFFICES", id: "numberOfOffices", label: "Number of Offices", tab: "Office" },
        { atlasField: "YEARS_IN_BUSINESS", id: "numberOfYearsInBusiness", label: "Years in Business", tab: "Office" },
        { atlasField: "YEARS_AT_ADDRESS", id: "numberOfYearsAtCurrentAddress", label: "Years at Current Address", tab: "Office" },
        { atlasField: "PRINCIPAL_DOB", id: "dateOfBirth", label: "Date of Birth", tab: "Owner" },
        { atlasField: "PRINCIPAL_TITLE", id: "titleOfPrincipalBusinessOwner", label: "Principal Business Owner", tab: "Owner" },
        { atlasField: "PRINCIPAL_TYPE_OF_PHOTO_ID", id: "typeOfIdentification", label: "ID Type", tab: "Owner" },
        { atlasField: "PRINCIPAL_ID_REFERENCE_NUMBER", id: "identificationReferenceNumber", label: "ID Number", tab: "Owner" },
        { atlasField: "PRINCIPAL_ID_STATE", id: "idIssueLocation", label: "ID Issue Location(state)", tab: "Owner" },
        { atlasField: "PTIN", id: "ptin", label: "PTIN", tab: "Owner" },
        { atlasField: "QUESTION1", id: "hasAssessedPreparerPenalties", label: "Has anyone associated with this firm been assessed preparer penalties?", tab: "Owner" },
        { atlasField: "QUESTION2", id: "hasConvictedOffenseUSRevenueLaws", label: "Has anyone associated with this firm been convicted of any offense under US Revenue Laws?", tab: "Owner" },
        { atlasField: "QUESTION4", id: "isRegisteredMoneyService", label: "Has anyone associated with this firm been barred from practice before the IRS or the US Tax Court?", tab: "Owner" },
        { atlasField: "QUESTION3", id: "hasBarredPractice", label: "Are you registered as a money service or check cashing business?", tab: "Owner" },
        { atlasField: "FEERTN", id: "routingNumber", label: "Routing Number", tab: "Bank" },
        { atlasField: "FEEACCOUNT", id: "accountNumber", label: "Account Number", tab: "Bank" },
        { atlasField: "FEENAME", id: "nameOnAccount", label: "Name on account", tab: "Bank" },
        { atlasField: "FEETYPE", id: "csAccountType", label: "Checking or Savings Account ?", tab: "Bank" },
    ];

    //function require to replace atlas field in error message with our label
    var _replaceAtlasFields = function (errorsList) {
        var errorMessage = '';//hold error message either orignal or replaced 
        _.forEach(errorsList, function (error) {
            errorMessage = error.errorMessage;
            _.forEach(fieldMappingForError, function (attribute) {
                if (_.includes(error.errorMessage, attribute.atlasField)) {
                    errorMessage = error.errorMessage.replace(attribute.atlasField, attribute.label);
                    return false;//here we have to break the loop because we have only one atribute id in one error meassge
                }
            });
            error.errorMessage = errorMessage;
        });
    };
    /* to create New  atlas*/
    atlasService.createAtlas = function (bankName, atlasProgram, office, bankProductHistory, owner, bank, customerNumber, mailBox, consent) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/bank/create',
            data: {
                data: {
                    atlasProgram: atlasProgram,
                    office: office,
                    bankProductHistory: bankProductHistory,
                    customerNumber: customerNumber,
                    mailBox: mailBox,
                    owner: owner,
                    bank: bank,
                    consent: consent,
                    bankType: bankName.toUpperCase()
                }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* to update atlas*/
    atlasService.saveAtlas = function (bankName, atlasProgram, office, bankProductHistory, owner, bank, customerNumber, mailBox, consent) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/bank/save',
            data: {
                data: {
                    atlasProgram: atlasProgram,
                    office: office,
                    bankProductHistory: bankProductHistory,
                    customerNumber: customerNumber,
                    mailBox: mailBox,
                    owner: owner,
                    bank: bank,
                    consent: consent,
                    bankType: bankName.toUpperCase()
                }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* the below method is work for open screen get atlas  details*/
    atlasService.getAtlasResponse = function (bankName) {
        var deferred = $q.defer();
        //load list from data api        
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/bank/open',
            data: {
                bankType: bankName.toUpperCase()
            }
        }).then(function (response) {
            //check there is error messgae 
            if (!_.isUndefined(response) && !_.isUndefined(response.data) && !_.isUndefined(response.data.data) && !_.isUndefined(response.data.data.enrollmentData) && !_.isUndefined(response.data.data.enrollmentData.acknowledgement) && !_.isUndefined(response.data.data.enrollmentData.acknowledgement.errors) && response.data.data.enrollmentData.acknowledgement.errors.length > 0) {
                _replaceAtlasFields(response.data.data.enrollmentData.acknowledgement.errors);
            }
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return atlasService;
}]);
//EPS Factory - End



