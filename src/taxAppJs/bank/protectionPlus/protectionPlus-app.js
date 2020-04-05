'use strict';

var protectionPlusApp = angular.module('protectionPlusApp', []);

protectionPlusApp.controller('protectionPlusController', ['$scope', '$log', '$injector', '$location', 'userService', 'messageService', 'dialogService', 'localeService', 'protectionPlusService', 'dataAPI', 'environment','communicationService',
    function ($scope, $log, $injector, $location, userService, messageService, dialogService, localeService, protectionPlusService, dataAPI, environment,communicationService) {

        //Check for privileges
        $scope.userCan = function (privilege) {
            return userService.can(privilege);
        };

        //Temporary function to differentiate features as per environment (beta/live)
        $scope.betaOnly = function () {
            if (environment.mode == 'beta' || environment.mode == 'local') {
                return true;
            } else {
                return false;
            }
        };

        //get current taxYear
        $scope.taxYear = userService.getTaxYear();
        /*  if($scope.taxYear != '2016' ){
              $location.path('/home');
          }*/

        var lineHelpData = { title: 'Protection Plus', body : 'Protection Plus provides Audit Assistance and ID Theft Restoration Services.<br><br>Protection Plus has a base price of $44.95. Tax professionals can mark up the price to a maximum retail price of $99.95.<br><br>Protection Plus offers free webinars that provide tax professionals with product knowledge and sales techniques to successfully offer Protection Plus products to taxpayers:<br><br><a href="https://taxprotectionplus.com/mtpo-webinars" target="_blank">https://taxprotectionplus.com/mtpo-webinars</a>'}
        communicationService.transmitData({
            channel: 'MTPO-LINE-HELP',
            topic: 'ProtectionPlus',
            data: lineHelpData
        });

        //to check is user is paid user or not 
        var userDetails = userService.getUserDetails();
        var subscriptionType = '';
        var masterLocationDetails;
        //get master location details
        if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
            masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
        }

        //get subscriptionType
        subscriptionType = userService.getLicenseValue('type');

        if (subscriptionType == 'FREE' && userDetails.isDemoUser != true) {
            $location.path('/alert/licenseInfo');
            //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller
            // var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/subscriptionDialog.html", "subscriptionDialogController", { "bankProducts": true });
            // dialog.result.then(function (btn) {
            //     subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
            // }, function (btn) {
            //     $location.path('/home');
            // });
        }

        //START: Default values
        if (_.isUndefined($scope.protectionPlusProgram)) {
            $scope.protectionPlusProgram = { efin: "" }
        }
        if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
            var customerNumber = userDetails.locations[userDetails.masterLocationId].customerNumber;
            $scope.protectionPlusProgram.customerNumber = customerNumber;
        }
        if (_.isUndefined($scope.office)) {
            $scope.office = { fullName: "", company: "", contactName: "", phoneNumber: "", address: { address: "", zip: "", city: "", state: "" }, officeEmail: "" }
        }
        if (_.isUndefined($scope.consent)) {
            $scope.consent = { protectionPlusProgramAgreement: false };
        }
        //END: Default values

        // set by default first tab is true
        $scope.activeTab = {};
        $scope.activeTab.protectionPlusProgramTab = true;

        //array object declare which contains the mapping of next and previous view for the steps of conversion for 2015
        $scope.nextAndPrevViewMap = [
            { "view": "protectionPlusProgramTab", "next": "officeTab", "previous": "", "currentView": true, "formName": "protectionPlusProgramTabForm" },
            { "view": "officeTab", "next": "consentTab", "previous": "protectionPlusProgramTab", "currentView": false, "formName": "officeTabForm" },
            { "view": "consentTab", "next": "", "previous": "officeTab", "currentView": false, "formName": "consentTabForm" }
        ];

        // variable declare which contain response code, type and message
        var codeList = {
            "In Process": { type: 'warning', message: "You can not resubmit enrollment details as your enrollment is in process." },
            "Not Enrolled-Errors": { type: 'warning', message: "You are not enrolled with Protection Plus program." },
            "Pending": { type: 'warning', message: "You can not resubmit enrollment details as your enrollment is pending." },
            "Enrolled": { type: 'success', message: "You are enrolled with Protection Plus." },
            "Rejected": { type: 'warning', message: "Your enrollment has been rejected by Protection Plus." }
        };

        // this local variable get current tab form name in nextAndPrevViewMap array.
        var _getFormName = function () {
            var curView = _.find($scope.nextAndPrevViewMap, { "currentView": true })["view"];
            //obtaining the index of the current view from the array object on which currently user is.  
            var index = _.findIndex($scope.nextAndPrevViewMap, function (viewList) {
                return viewList.view == curView;
            });
            return $scope.nextAndPrevViewMap[index].formName;
        };

        //method defined to change view when user click on next or back button
        //tabMode = it contains the mode of the click button whether it is next button or back button clicked 
        $scope.changeView = function (tabMode) {
            var curView = _.find($scope.nextAndPrevViewMap, { "currentView": true })["view"];
            //obtaining the index of the current view from the array object on which currently user is.  
            var index = _.findIndex($scope.nextAndPrevViewMap, function (viewList) {
                return viewList.view == curView;
            });
            if (!_.isUndefined(index) && index !== '') {
                //condition to check which button is pressed.
                if (tabMode == 'next') {
                    _.find($scope.nextAndPrevViewMap, { "view": curView })["currentView"] = false;
                    _.find($scope.nextAndPrevViewMap, { "view": $scope.nextAndPrevViewMap[index].next })["currentView"] = true;
                    $scope.formName = _getFormName();
                    $scope.activeTab[$scope.nextAndPrevViewMap[index].next] = true;
                } else if (tabMode == 'previuos') {
                    _.find($scope.nextAndPrevViewMap, { "view": curView })["currentView"] = false;
                    _.find($scope.nextAndPrevViewMap, { "view": $scope.nextAndPrevViewMap[index].previous })["currentView"] = true;
                    $scope.formName = _getFormName();
                    $scope.activeTab[$scope.nextAndPrevViewMap[index].previous] = true;
                }
            }
        };

        // this function call manually tab change and curView parameter is hold selected tab values. 
        $scope.tabChangeView = function (curView) {
            var oldCurView = _.find($scope.nextAndPrevViewMap, { "currentView": true })["view"];
            //obtaining the index of the current view from the array object on which currently user is.  
            var index = _.findIndex($scope.nextAndPrevViewMap, function (viewList) {
                return viewList.view == curView;
            });
            if (!_.isUndefined(index) && index !== '') {
                _.find($scope.nextAndPrevViewMap, { "view": oldCurView })["currentView"] = false;
                _.find($scope.nextAndPrevViewMap, { "view": $scope.nextAndPrevViewMap[index].view })["currentView"] = true;
                $scope.formName = _getFormName();
                $scope.activeTab[$scope.nextAndPrevViewMap[index].view] = true;
            }
        };

        //method to download agreement of ERO or taxpayer
        $scope.getURLToDownloadPDF = function (pdfName) {
            switch (pdfName) {
                case 'ERO-AGREEMENT':
                    return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/protectionPlus/Agreement_ERO.pdf';
                default:
                    return;
            }
        };


        $scope.validateFormToSave = function (form) {
            //validate all forms
            if (!_.isUndefined(form) && (form.protectionPlusProgramTabForm.$invalid || form.officeTabForm.$invalid || form.consentTabForm.$invalid || checkConsent())) {
                //open dialog if any form is invalid
                localeService.translate("Please review each of the ERO Enrollment Application Tabs, and complete the required fields displayed in red.", 'PROTECTIONPLUS_FORM_SAVE_ERROR').then(function (translatedText) {
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                });
            } else {
                //call save after validating forms
                $scope.saveProtectionPlusProgram();
            }
        }
        // this function call in page load time , check user make bank or edit bank 
        $scope.initListProtectionPlus = function () {
            $scope.formName = _getFormName();

            protectionPlusService.getProtectionPlus().then(function (response) {
                if (_.isUndefined($scope.protectionPlusList)) {
                    $scope.protectionPlusList = {};
                }
                $scope.protectionPlusList = response.enrollmentData;

                // assigning the response status to rersponseMessage for display the message on UI
                $scope.responseMessage = (!_.isUndefined(response.enrollmentData)) ? codeList[response.enrollmentData.status] : {};
                // condition to check response.enrollmentData.acknowledgement is defined or not and response.enrollmentData.acknowledgement is empty or not
                if (!_.isUndefined(response.enrollmentData.acknowledgement) && !_.isEmpty(response.enrollmentData.acknowledgement)) {
                    // scope variable declare which contains acknowledgement data
                    // assigning the acknowledgement to acknowledgementData for display the disbursement method which are use by user on UI 
                    $scope.acknowledgementData = response.enrollmentData.acknowledgement;
                }
                // this condition is check 'protectionPlusList' is empty or not.
                if (!_.isUndefined($scope.protectionPlusList) && !_.isEmpty($scope.protectionPlusList)) {
                    $scope.displayProtectionPlusData($scope.protectionPlusList, response.isNewEnrollment);
                }

                // this condition is check bank is NewEnroll or not.
                if (response.isNewEnrollment != undefined && response.isNewEnrollment != null && response.isNewEnrollment == false) {
                    $scope.mode = 'update';
                } else {
                    $scope.mode = 'create';
                }
            }, function (error) {
                $log.error(error);
            });
        };

        //this function call Display all data in UI 
        $scope.displayProtectionPlusData = function (protectionPlusData, isNewEnrollment) {

            // this condition check protectionPlusForm object defined or no.

            // all scope object assign values getting by bank/open API
            if (!_.isUndefined(protectionPlusData.protectionPlusProgram)) {
                $scope.protectionPlusProgram = protectionPlusData.protectionPlusProgram;
            }

            if (!_.isUndefined(protectionPlusData.office)) {
                $scope.office = protectionPlusData.office;
            }

            if (!_.isUndefined(protectionPlusData.consent)) {
                $scope.consent = protectionPlusData.consent;
            }

        };

        var checkConsent = function () {

            if (!_.isUndefined($scope.consent) && $scope.consent.protectionPlusProgramAgreement == false) {
                return true;
            }
            return false;
        }

        $scope.saveProtectionPlusProgram = function () {
            //If demo user try to open bank . He/She will be prompted with dialog to either register
            //or continue with demo (which redirect user to home page)
            if (userService.getValue('isDemoUser') == true) {
                var salesDialogService = $injector.get('salesDialogService');
                salesDialogService.openSalesDialog("protectionPlus");
            } else {
                var data = {
                    protectionPlusProgram: $scope.protectionPlusProgram,
                    office: $scope.office,
                    consent: $scope.consent,
                    bankType: 'PROTECTIONPLUS'
                };

                //this condition to check user data update or new create  
                if ($scope.mode === 'create') {
                    //Create ProtectionPlus         		
                    protectionPlusService.createProtectionPlus(data).then(function (success) {
                        messageService.showMessage('Saved successfully', 'success', 'BANK_CREATESUCCESS_MSG');
                        //after success we just redirect to home screen
                        $scope.initListProtectionPlus();
                    }, function (error) {
                    });
                } else if ($scope.mode === 'update') {
                    //Save ProtectionPlus
                    protectionPlusService.saveProtectionPlus(data).then(function (success) {
                        messageService.showMessage('Updated successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
                        //after success we just redirect to home screen
                        $scope.initListProtectionPlus();
                    }, function (error) {
                    });
                }
            }
        }
        // this function call get bank data on bank/open API	
        $scope.initListProtectionPlus();
    }]);

//ProtectionPlus Bank Factory - Start
protectionPlusApp.factory('protectionPlusService', ['$q', '$log', '$http', 'dataAPI', 'userService', function ($q, $log, $http, dataAPI, userService) {
    var protectionPlusService = {};

    // Get application tax year
    var _taxYear = userService.getTaxYear();


    /* to create New  Protectionplus*/
    protectionPlusService.createProtectionPlus = function (data) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/bank/create',
            data: {
                data: data
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* to update Protectionplus*/
    protectionPlusService.saveProtectionPlus = function (data) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/bank/save',
            data: {
                data: data
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* the below method is work for open screen get Protectionplus details*/
    protectionPlusService.getProtectionPlus = function () {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/bank/open',
            data: {
                bankType: 'PROTECTIONPLUS'
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return protectionPlusService;
}]);
//ProtectionPlus Factory - End
