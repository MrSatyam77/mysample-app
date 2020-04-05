"use strict";

//TODO: 1) We should call _refreshFormTree function in loadForm as it is responsible for loading form on screen in all cases like (Adding New Form, 
//          Adding Default Forms as part of state, Jump To, ERC Links). Currenlty it is called individually at many places, it should be removed from those places an

returnApp.controller('returnController', ['_', '$rootScope', '$scope', '$routeParams', '$location', '$filter', '$log', '$q', '$anchorScroll', '$window', '$interval', '$timeout', '$injector', 'toaster', 'NgTableParams', 'systemConfig', 'dialogService', 'returnService', 'contentService', 'messageService', 'userService', 'localeService', 'basketService', 'subscriptionService', 'dataAPI', 'environment', 'resellerService', 'networkHealthService', 'serviceWorkerIPC', 'cachingService', 'hotkeys', 'browserService', 'utilityService', 'signatureService', 'configService', 'communicationService', 'rtcSocketService', 'webRTCService', 'localStorageUtilityService', 'documentsService', 'savePrintConfigurationService',
    function (_, $rootScope, $scope, $routeParams, $location, $filter, $log, $q, $anchorScroll, $window, $interval, $timeout, $injector, toaster, NgTableParams, systemConfig, dialogService, returnService, contentService, messageService, userService, localeService, basketService, subscriptionService, dataAPI, environment, resellerService, networkHealthService, serviceWorkerIPC, cachingService, hotkeys, browserService, utilityService, signatureService, configService, communicationService, rtcSocketService, webRTCService, localStorageUtilityService, documentsService, savePrintConfigurationService) {

        if (!$rootScope.headerNav) {
            $rootScope.headerNav = {};
        }

        //Check for privileges
        $scope.userCan = function (privilege) {
            return userService.can(privilege);
        };

        //Temporary function to differentiate features as per environment (beta/live)
        $scope.betaOnly = function () {
            if (environment.mode == 'beta' || environment.mode == 'local')
                return true;
            else
                return false;
        };

        //check for License
        $scope.hasLicense = function (licenseName) {
            return userService.getLicenseValue(licenseName);
        };

        //deduct pixels from accordian's hieght
        //If betaObly is removed then on UI, remove {{::deductHieght}} and put fix value 310 or 65 in place of {{::deductHieght}}
        if ($scope.betaOnly() == true) {
            $scope.deductHieght = 360;
        } else {
            $scope.deductHieght = 360;
        }

        //os name
        $scope.os = browserService.getSystemInformation('os');

        //is ios or not
        $scope.isIOS = ($window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);

        //color preference for severity
        $scope.colorPreference = {};

        //This variable holds current tax year
        $scope.taxYear = userService.getTaxYear();
        $scope.parseValueOfTaxYear = parseInt($scope.taxYear);

        //get current tax year from system config
        var _currentTaxYear = systemConfig.getCurrentTaxYear();

        var _currentForm;
        //interval Variable used for automatic save the return after specific time
        //Note:The below variable is define because it returns reference error when checked for angular.isDefined() in saveReturn() 
        var autoSaveInterval;

        var _performReviewRules = {
            "1120s": {
                "federal": [
                    { "activeForm": "d7004", "allowedForms": ["d1120SCIS", "d1120SRIS", "d7004", "d8879S"], "ignoreForms": [] },
                    { "activeForm": "d1120S", "ignoreForms": ["d7004"] }
                ]
            },
            "1040": {
                "federal": [
                    { "activeForm": "d56", "allowedForms": ["dMainInfo", "dReturnInfo", "d8879", "d56"] },
                    { "activeForm": "d2350", "allowedForms": ["dMainInfo", "dReturnInfo", "d8879", "d2350"] },
                    { "activeForm": "d4868", "allowedForms": ["dMainInfo", "dReturnInfo", "d8879", "d4868"] },
                    { "activeForm": "d1040", "ignoreForms": ["d56", "d2350", "d4868"] }
                ],
                "ny": [
                    { "activeForm": "dNYIT370", "allowedForms": ["dNYIT370"] }
                ],
                "dc": [
                    { "activeForm": "dDCFR127", "allowedForms": ["dDCFR127"] }
                ],
                "md": [
                    { "activeForm": "dMD502E", "allowedForms": ["dMD502E"] }
                ],
                "nj": [
                    { "activeForm": "dNJ630", "allowedForms": ["dNJ630"] }
                ]
            },
            "1120": {
                "federal": [
                    { "activeForm": "d7004", "allowedForms": ["d1120CCIS", "d1120CRIS", "d7004", "d8879C"], "ignoreForms": [] },
                    { "activeForm": "d1120C", "ignoreForms": ["d7004"] }
                ]
            },
            "1065": {
                "federal": [
                    { "activeForm": "d7004", "allowedForms": ["d1065CIS", "d1065RIS", "d7004", "d8879PE"], "ignoreForms": [] },
                    { "activeForm": "d1065", "ignoreForms": ["d7004"] }
                ]
            },
            "1041": {
                "federal": [
                    { "activeForm": "d7004", "allowedForms": ["d1041CIS", "d1041RIS", "d7004", "d8879F"], "ignoreForms": [] },
                    { "activeForm": "d1041", "ignoreForms": ["d7004"] }
                ]
            }
        };

        //Flag to update whether ERC calculation done or not
        var isCalcERC = false;

        //Flag to update whether ERC on service side (mandatory & required) completed or not.
        var isServiceERC = false;

        //Flag to determine if there is any Reject severity ERC pending
        $scope.isRejectERCPending = undefined;

        //Flag to ask confirmation dialog on save.
        //Note: We have used this flag to implement intermediate change tracker. This flag will be true on calcDone and false on manual save.
        var askForSaveConfirmation = false;

        //Flag to save the return to draft is return cointains change.
        //Note: We have used this flag to implement intermediate change tracker. This flag will be true on calcDone and false on manual save.
        var isReturnChangedForAutoSave = false;

        //Flag to text loading on recalculate return. false = hide
        $scope.isRecalculateReturn = false;

        //Flag to set loading on split return. false = hide
        $scope.isSplitReturn = false;

        $scope.isCalcRunning = false;

        $scope.formLoading = false;

        //For printing animation
        $scope.isPrinting = false;

        //Variable indicating ongoing print request
        var numberOfPrintRequest = 0;

        //Flag to show popover on close return. false = hide 
        $scope.isReturnClose = false;

        //Object for screen (height / width)
        $scope.screen = {};

        //Object for ercTable height/width.
        //Major Issue: We have to get height of header,toolbar, etc... runtime instead of minus fix value to get accurate height for erc grid 
        $scope.ercTable = {};

        // Variable checks whether current return can be unlock or not, depending upon different scenarios
        $scope.unlockReturn = {};

        //stores client packageName
        $scope.client = {};

        $scope.userSettings = userService.getValue('settings');

        //Interview Mode Changes
        //Evaluate in which mode return needs to be loaded. Interview or Input and same should be notified to returnService.
        if ($location.path().indexOf('return/interview') > 0) {
            $scope.returnMode = "interview";
        } else {
            $scope.returnMode = "input";
        }

        //Flag to show the addForm dropdown on left panel
        //By default is his hidden it is show when the button is clicked
        $scope.addFormToogle = { isOpen: false };
        //Flag to show the Add State dropdown
        $scope.addStateToggle = { isOpen: false };
        //Flag to show the Status dropdown
        $scope.statusToggle = { isOpen: false };
        //Flag to show the Print dropdown
        $scope.printToggle = { isOpen: false };
        //Flag to show the E-File dropdown
        $scope.efileToggle = { isOpen: false };
        //Flag to show the Tools dropdown
        $scope.toolsToogle = { isOpen: false };
        //Flag to show the Quick forms dropdown
        $scope.quickAddFormToggle = { isOpen: false };
        //Flag to show the signature dropdown
        $scope.signatureToggle = { isOpen: false };

        //variable that store emailverified information
        $scope.emailVerified;

        //Variable that to hold if limit of residence states exceed (2)
        $scope.residentStatesLimitExceed = false;

        // Variable that to hold if user add other then federal
        $scope.isStateAdded = false;

        // this form are not supported for print Perview
        $scope.previewNotSupported = ['dCustomLetter', 'dEPSBankApp', 'dTPGBankApp', 'dRefundAdvantageBankApp', 'dAtlasBankApp']

        $scope.SignlockToggle = {};

        $scope.isClientPortalFeatureEnable = false;

        // holds return subtype to show in tax from header (ameded or copy)
        $scope.returnSubType = "";

        //Initialize network status flag and subscribe channel to get update 
        $scope.isOnline = networkHealthService.getNetworkStatus();
        var _networkStatusSubscription = postal.subscribe({
            channel: 'MTPO-UI',
            topic: 'networkStatus',
            callback: function (data, envelope) {
                $scope.isOnline = data.isOnline;
                //if user go to offline we are getting precache list and update precache status 
                if ($scope.isOnline === false) {
                    _updatePreCacheStatus();
                }
            }
        });

        var _headerToggle = communicationService.transmitter.subscribe(function (e) {
            switch (e.topic) {
                case 'headerToggleLeft':
                    $rootScope.headerNav.collapseLeftPane = !$rootScope.headerNav.collapseLeftPane;
                    //set this variable as true to identify that user has decide on collapse or expand. So we do not do it automatically on resize 
                    $rootScope.headerNav.collapseLeftPaneByUser = true;
                    //Patch: To avoid animation (open/closed) when user has collapsed right panel and navigating on different screens
                    $rootScope.headerNav.applyLeftAnimation = true;
                    //make applyLeftAnimation false after one second
                    $timeout(function () {
                        $rootScope.headerNav.applyLeftAnimation = false;
                    }, 700);
                    break;

                case 'headerToggleRight':
                    $rootScope.headerNav.collapseRightPane = !$rootScope.headerNav.collapseRightPane;
                    //set this variable as true to identify that user has decide on collapse or expand. So we do not do it automatically on resize 
                    $rootScope.headerNav.collapseRightPaneByUser = true;

                    //Patch: To avoid animation (open/closed) when user has collapsed right panel and navigating on different screens
                    $rootScope.headerNav.applyRightAnimation = true;
                    //make applyRightAnimation false after one second
                    $timeout(function () {
                        $rootScope.headerNav.applyRightAnimation = false;
                    }, 700);
                    break;


                default:
                    break;
            }
        });

        //subscribe channel for to reload/refresh current form
        var _reloadCurrentFormChanges = postal.subscribe({
            channel: 'MTPO-Return',
            topic: 'ReloadCurrentForm',
            callback: function (data, envelope) {
                $scope.loadFormChanges(data.form)
            }
        });


        //subscribe channel for open calculator from tax-directive
        var _openCalculatorSubscription = postal.subscribe({
            channel: 'MTPO-Return',
            topic: 'openCalculator',
            callback: function (data, envelope) {
                $scope.openCalculator(data);
            }
        });

        //subscribe channel for close calculator from directive
        var _closeCalculatorSubscription = postal.subscribe({
            channel: 'MTPO-Return',
            topic: 'closeCalculator',
            callback: function (data, envelope) {
                $scope.isOpenCalculator = false;
            }
        });

        //This function is used to open calculator dialog
        $scope.openCalculator = function (data) {
            if (data != undefined) {
                //store object of focusable taxfield
                returnService.storeObjectOfFocusedField(data.fieldData);
            }
            $scope.isOpenCalculator = true;
            //open dialog
            // dialogService.openDialog("custom", { 'keyboard': true, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/dialog/calculatorDialog.html", "calculatorDialogController");
        }

        //This function is used to close calculator dialog
        $scope.closeCalc = function () {
            $scope.isOpenCalculator = false;
        }

        //For Pre Ack
        // $scope.DisableUnlockButton = function () {
        //     var efileStatus = returnService.getEfileStatus();
        //     var federalMainForm = _.find(efileStatus["federal"], { 'returnTypeCategory': "MainForm" });
        //     var BankForm;
        //     //for bank forms
        //     _.forEach(efileStatus, function (val, key) {
        //         _.forEach(val, function (subType, subKey) {
        //             if (subType.returnTypeCategory == 'BankForm' &&  subType.returnType != 'protectionplus') {
        //                 BankForm = subType;
        //             }
        //         });
        //     });

        //     var preAck = returnService.preAck();
        //     if (federalMainForm != undefined && (federalMainForm.status == 8 || federalMainForm.status == 21)) {
        //         $scope.isUnlockDisabled = false;
        //     } else if (BankForm != undefined && BankForm.status == 14) {
        //         $scope.isUnlockDisabled = false;
        //     } else {
        //         if (preAck == true && federalMainForm != undefined && federalMainForm.status != 8 && federalMainForm.status != 21 && BankForm != undefined && BankForm.status != 14) {
        //             $scope.isUnlockDisabled = true;
        //             //for preAck
        //             var dialogConfig = { "title": "Notification", "text": "This return can not be unlocked because it includes a Pre-Acknowledgement Advance application. You will be able to Unlock/Edit this return once the IRS sends an acknowledgement." };
        //             var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
        //         }
        //     }
        // }

        // subscribe for autoAddState when zipcode is entered or changed
        var _autoAddStateSubscription = postal.subscribe({
            channel: 'MTPO-Return',
            topic: 'zipUpdate',
            callback: function (data, envelope) {
                //Update city and state field when changed    
                if (data.zipUpdate != undefined && data.zipUpdate.city != undefined)
                    _postTaxFieldChange(data.zipUpdate.city.elementName, data.zipUpdate.city.object, data.zipUpdate.city.docIndex);

                if (data.zipUpdate != undefined && data.zipUpdate.state != undefined)
                    _postTaxFieldChange(data.zipUpdate.state.elementName, data.zipUpdate.state.object, data.zipUpdate.city.docIndex);


                if (!_.isUndefined(data.zipDetails.state) && data.zipDetails.state != '') {
                    //State name must be pushed in the following array for state's return to be added
                    var stateList = [];
                    //get state config for current year
                    var stateListFromConfig = configService.getConfigData($scope.taxYear).stateList;
                    //get state of particular package
                    var filterdList = _.find(stateListFromConfig[$scope.client.packageName], { "name": data.zipDetails.state });
                    //if it is betaonly then allow to add , otherwise check if it is approved/isDisable from config for live auto add state
                    if ($scope.betaOnly() == true || $scope.taxYear != '2019' || filterdList.isDisabled == false) {
                        _checkForAutoAddStateReturn(data, envelope).then(function (dataFromCheckForAutoAddState) {
                            //If user has selected autoState to be added from peferences then publish selected state
                            if (dataFromCheckForAutoAddState == true) {
                                //if user has set preferences, add state name to array                        
                                stateList.push({ name: data.zipDetails.state, letsAdd: true });
                                //add state using preferences. used third parameter as true for silently adding state. Do not open it.
                                $scope.addStates(stateList, 'FY', true);
                            }
                        });
                    }
                }
            }

        });


        var _checkForAutoAddStateReturn = function (data, envelope) {
            var deferred = $q.defer();

            //Get States that are already added in return
            var addedStates = angular.copy(returnService.getAddedStates());

            //check for state is already added or not. If already added then do not add
            if (_.findIndex(addedStates, { name: data.zipDetails.state }) > -1) {
                deferred.resolve(false);
            } else if (_.findIndex($scope.availableStates, function (stateConfig) { return (stateConfig.name == data.zipDetails.state && stateConfig.doNotAutoAdd != true) }) > -1) {
                //Get user details from user service to check preferences exist or not
                var userDetails = angular.copy(userService.getUserDetails());
                //check for preferences are exist and current zipElementName is a key and its value is true
                //if preference is exist and user wants to add state return based on current zip field then add otherwise do not add
                if (!_.isUndefined(userDetails.settings) && !_.isUndefined(userDetails.settings.preferences) && !_.isUndefined(userDetails.settings.preferences.returnWorkspace) && !_.isUndefined(userDetails.settings.preferences.returnWorkspace.autoAddState) && !_.isUndefined(userDetails.settings.preferences.returnWorkspace.autoAddState.individual)) {
                    //Either It should be all true or individual line
                    if (userDetails.settings.preferences.returnWorkspace.autoAddState.individual[data.zipElementName] != undefined && userDetails.settings.preferences.returnWorkspace.autoAddState.individual[data.zipElementName].value == true) {
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }

                } else {

                    //Get configuration for preferences from systemConfig
                    var autoAddStateConfig = angular.copy(systemConfig.getAutoAddStatePreferences());
                    //check preferences in configuration
                    if (autoAddStateConfig[data.zipElementName] == undefined) {
                        //if
                        deferred.resolve(false);

                    } else {
                        //if user preferences are not exist for adding state return automatically then
                        //Shows dialog if user want to add preference for adding state return from Client Information Sheet or W2 form address
                        var autoAddStateReturnDialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/autoAddStateReturnDialog.html", "AutoAddStateReturnDialogController", {});
                        //wait for user response on dialog
                        autoAddStateReturnDialog.result.then(function (autoAddStateReturnDecisionFromDialog) {
                            var dataObj = {};
                            //we need to provide formatted object in the form of dataObj.autoAddState to _setPreferencesForPrinting
                            dataObj['key'] = 'autoAddState';
                            dataObj['value'] = autoAddStateReturnDecisionFromDialog;
                            dataObj.configData = {};

                            _.forEach(autoAddStateConfig, function (obj) {
                                if (obj.options.indexOf(autoAddStateReturnDecisionFromDialog) > -1) {
                                    autoAddStateConfig[obj.fieldName].value = true;
                                }
                            });

                            //To decide adding state return.
                            if (autoAddStateConfig[data.zipElementName].options.indexOf(autoAddStateReturnDecisionFromDialog) > -1) {
                                deferred.resolve(true);
                            } else {
                                deferred.resolve(false);
                            }

                            //Assign formatted object
                            dataObj.configData.all = false;
                            if (autoAddStateReturnDecisionFromDialog == 3) {
                                dataObj.configData.all = true;
                            }
                            dataObj.configData.individual = autoAddStateConfig;
                            //we have reused and combined the setPreferencesForPrinting function as per our requirement
                            //Do not wait for network call, it can be done in background
                            _setPreferences(userDetails, dataObj);

                        }, function (btn) {
                            //cancel or close
                            deferred.resolve(false);
                        });
                    }
                }
            } else {
                //Either this state does not have any tax or not released yet
                deferred.resolve(false);
            }

            return deferred.promise;

        };


        //Check for user is Demo user
        // demo user set watermark
        var getWaterMark = function () {
            var waterMarkText = '';
            //demo user or free license
            if ((userService.getValue('isDemoUser') == true || userService.getLicenseValue('type') == 'FREE')
                || (($scope.client.packageName == "1040" || $scope.client.packageName == "1041" || $scope.client.packageName == "990") && userService.getLicenseValue('individual') != true)
                || (($scope.client.packageName == "1065" || $scope.client.packageName == "1120" || $scope.client.packageName == "1120s") && userService.getLicenseValue('business') != true)) {
                //
                waterMarkText = 'Free Trial - Do Not File';
            }

            return waterMarkText;
        };
        //	 Function is used to get height of different elements at runtime.
        var getElementHeights = function (data) {
            // Variables for element height
            var commonHeader, returnWorkspacetoolbar, returnWorkspacepagetitle, performHeader, element;

            // $scope.toolbarHeight = document.getElementById("returnWorkspacetoolbar").clientHeight;
            // $scope.returnTitle = document.getElementById("returnWorkspacepagetitle").clientHeight;

            // Get element and its client height property 
            element = angular.element(document.getElementById("commonHeader"));
            if (element.length > 0) {
                commonHeader = element[0].clientHeight;
            }

            element = angular.element(document.getElementById("returnWorkspacetoolbar"));
            if (element.length > 0) {
                returnWorkspacetoolbar = element[0].clientHeight;
            }

            element = angular.element(document.getElementById("returnWorkspacepagetitle"));
            if (element.length > 0) {
                returnWorkspacepagetitle = element[0].clientHeight;
            }

            element = angular.element(document.getElementById("performHeader"));
            if (element.length > 0) {
                performHeader = element[0].clientHeight;
            }

            //Note : Following code is written to avoid scenario when we didn't get div's height.
            //Issue: When first time page load, or on page reload. 
            if (commonHeader == undefined || commonHeader == 0) {
                commonHeader = 46;
            }

            if (returnWorkspacetoolbar == undefined || returnWorkspacetoolbar == 0) {
                returnWorkspacetoolbar = 48;
            }

            if (returnWorkspacepagetitle == undefined || returnWorkspacepagetitle == 0) {
                returnWorkspacepagetitle = 48;
            }

            if (performHeader == undefined || performHeader == 0) {
                performHeader = 38;
            }

            if (angular.isUndefined($scope.ercTable)) {
                $scope.ercTable = {};
            }

            // Checking whether uiSplitbarChanges or not. If data != undefined then uiSplitbarChanges its height else screen is resized.
            if ($rootScope.headerNav != undefined) {
                if (data == undefined) {
                    data = 0;
                    $scope.ercTable.height = (($rootScope.headerNav.screenHeight - data - commonHeader - returnWorkspacetoolbar - returnWorkspacepagetitle) / 2) - performHeader - 58;
                } else {
                    $scope.ercTable.height = $rootScope.headerNav.screenHeight - data - commonHeader - returnWorkspacetoolbar - returnWorkspacepagetitle - performHeader - 58;
                }
            }
        };
        var isHeightChanged = false;
        //watch for screenHeight from return header (root scope) to update other things here.
        //Note: Previously we have bound resize event but now we are only watching rootscope height
        $scope.$watch('headerNav.screenHeight', function () {
            $log.debug('screen height changed');

            $scope.$evalAsync(function () {
                //Function calculate div's height dynamically for ERC Grid scrollbar
                isHeightChanged = true;
                _calculateAccordianHeight();
                getElementHeights();
            });
        });

        // Object used to check whether user gave permission to change url
        $scope.hasPermissionTochangeLocation = false;

        // Use case: When url will change then dialog will pop for save return. On result of that popup we have to move to location
        // IF we don't manage boolean variable then popup will come continuesly	
        var closeDialog = $scope.$on("$locationChangeStart", function (event, next, current) {
            // check permission to change url
            //Case 1 : This may be second redirect (first was cancelled by us as we have to either ask confirmation or directly close return).		
            // if ($scope.hasPermissionTochangeLocation === false) {
            //     var path = $location.$$url;
            //     //prevent the location change.
            //     event.preventDefault();
            //     SetPathOnCloseDailog(path);

            // }
        });

        var SetPathOnCloseDailog = function (path) {
            //Do not show confirmation dialog (for save) If there is no change in return
            if (askForSaveConfirmation === true && $scope.lockToggle.isLocked == false) {
                // Ask to save return
                var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
                localeService.translate('Do you want to save your return?', 'RETURNCONTROLLER_DOYOUWANTTOSAVERETURN').then(function (translatedText) {
                    var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translatedText });
                    dialog.result.then(function (btn) {
                        // set permission to change url
                        $scope.hasPermissionTochangeLocation = true;
                        // close return true will save return first and then it will close return.
                        closeReturn(true).then(function (success) {
                            if (path == '/logout' || path == '/home' || path.indexOf('return_interview') > 1 || path.indexOf('return_edit') > 1) {
                                $location.path(path);
                            }
                        }, function (error) {
                            $log.log(error);
                        });

                        if (path != '/logout' && path != '/home' && path.indexOf('return_interview') < 0 && path.indexOf('return_edit') < 0) {
                            // redirect to the path
                            $location.path(path);
                        }
                    }, function (btn) {//Note: For close only (without saving), we have to care only for logout otherwise async call of close api may result in error
                        if (btn == 'close') {
                            return;
                        } else if (btn == 'no') {
                            // set permission to change url
                            $scope.hasPermissionTochangeLocation = true;
                            // close return true will save return first and then it will close return.
                            closeReturn(false).then(function (success) {
                                if (path == '/logout') {
                                    $location.path("/logout");
                                }
                            }, function (error) {
                                $log.log(error);
                            });

                            if (path != '/logout') {
                                // redirect to the path
                                $location.path(path);
                            }
                        }
                    });
                });
            } else {
                //change flag to avoid recursion 
                $scope.hasPermissionTochangeLocation = true;
                //false is passed to only close (without save)
                closeReturn(false).then(function (success) {
                    //logout has to performed only after close return
                    if (path == '/logout') {
                        $location.path("/logout");
                    }
                }, function (error) {
                    $log.log(error);
                });

                //Other then logout we may redirect as it will not cause any issue.
                if (path != '/logout') {
                    // redirect to the path
                    //This require to sync with angular other wise it will not redirect
                    $rootScope.$evalAsync(function () {
                        $location.path(path);
                    });
                }
            }
        }
        //Subscribe postal mesaage to avoid dialog for save return when system forcefully sign out user
        var _forcedSignOutSubscription = postal.subscribe({
            channel: 'MTPO-Return',
            topic: 'forcedSignOut',
            callback: function (data, envelope) {
                $scope.hasPermissionTochangeLocation = true;
            }
        });

        var browserSidePrinting = function(formPropList, docIndexes, printingType, waterMarkText, pdfPasswordDetails, maskSensitiveInfo, signatureRequired, refundSectionData, _preparerId) {
            if(!_preparerId) {
                if ($scope.client.packageName == '1040')
                    _preparerId = returnService.getElementValue('strprid', 'dReturnInfo');
                else if ($scope.client.packageName == '1065')
                    _preparerId = returnService.getElementValue('PrepareID', 'd1065RIS');
                else if ($scope.client.packageName == '1120')
                    _preparerId = returnService.getElementValue('PrepareID', 'd1120CRIS');
                else if ($scope.client.packageName == '1120s')
                    _preparerId = returnService.getElementValue('PrepareID', 'd1120SRIS');
                else if ($scope.client.packageName == '1041')
                    _preparerId = returnService.getElementValue('PrepareID', 'd1041RIS');
                else if ($scope.client.packageName == '990')
                    _preparerId = returnService.getElementValue('PrepareID', 'd990RIS');
            }
            if(printingType === 'printSingleForm' || printingType === 'printBlankForm') {
                formPropList = [formPropList];
            }
            var docFields = angular.copy(contentService.getReturnDocFields());
            var _taxReturn = angular.copy(returnService.getTaxReturn());
            var getSignatureObj = { "returnId": _taxReturn.header.id, "preparerId": _preparerId };
            signatureService.signatureViewAll(getSignatureObj, false).then(function (signaturesData) {
                savePrintConfigurationService.setPrintConfiguration(undefined, _taxReturn, docFields, signaturesData);
                if(printingType === 'printSingleForm' || printingType === 'printBlankForm') {
                    //If form is not passed as argument then use current form
                    returnService.printForm(formPropList[0], printingType, undefined, waterMarkText, pdfPasswordDetails, true).then(function (url) {
                        showOrHidePrintingAnimation('response');
                    }, function (error) {
                        //call function to update printing animation
                        showOrHidePrintingAnimation('response');
                    });
                } else {
                    
                //Call service for printing
                returnService.printMultipleForms(formPropList, docIndexes, printingType, waterMarkText, pdfPasswordDetails, maskSensitiveInfo, signatureRequired, refundSectionData, true).then(function () {
                    //call function to update printing animation
                    showOrHidePrintingAnimation('response');
                }, function (error) {
                    //call function to update printing animation
                    showOrHidePrintingAnimation('response');
                });
                }
            })
        }

        var _init = function () {
            //left pane form information
            returnService.getForms().then(function (data) {
                $scope.forms = data;

                //update status of fomrs in tree
                _refreshFormTreeStatus();

                _currentForm = _.first($scope.forms);
                //load default form, mostly client information sheet
                //assumed it is first form in array
                _initFormScope(_currentForm);
                _initHeader(_currentForm);
                _initAvailableForms();
                _initAvailableQuickForms();

                //Note :- we have broadcast to just notify the interview controller that the return is loaded as we now load the interview tab status from the _taxReturn
                if ($scope.returnMode == 'interview')
                    $scope.$broadcast('returnDetailLoaded', {});
            });

            //Properties for form Tree in left pane
            $scope.formTree = { fedAccordionOpen: true };


            //Properties for default in right pane        
            $scope.rightPane = { rightpanefifthaccordionopen: true };

            //left pane categories		
            contentService.getCategories().then(function (data) {
                $scope.categories = data;
            });

            //Get States added in return
            _initAddedStates();

            //load available states
            _initStates();

            //get and set precache status for state 
            _updatePreCacheStatus();

            //if user is online and state are not precached then show dialoge else precache the state 
            _checkStatePrecacheStatus();

            //Get AGI/Refund/Owe/BIS for Federal and all added states
            returnService.updateReturnOverview();

            /// get Userdetail for check what user already verified his email or not.
            $scope.emailVerified = userService.getEmailVerificationflag();


            // Get client Information
            $scope.client.packageName = returnService.getPackageName();
            //set the flag to true if the return is default return
            $scope.isDefaultReturn = !_.isUndefined(returnService.getValueFromHeader('isDefaultReturn')) ? returnService.getValueFromHeader('isDefaultReturn') : false;

            // set the flag if return is isConverted Return
            $scope.isConvertedReturn = returnService.getIsConvertedReturn()

            // get and set color preferences
            _initColorPreferences();
            //register hoykeys
            _registerHotkeys();
            if ($scope.returnMode == 'input') {
                document.getElementById('returnWorkspaceFormOne').addEventListener('touchend', stopPropagation);
                document.getElementById('returnWorkspaceFormTwo').addEventListener('touchend', stopPropagation);
                document.getElementById('returnWorkspaceFormThree').addEventListener('touchend', stopPropagation);
            }
            document.getElementById('header_logo_myTaxPrepOffice').addEventListener('click', logoClickCloseReturn)
            var userDetails = userService.getUserDetails()
            if (userDetails && userDetails.masterLocationId == systemConfig.getVitaCustomerLocation()) {
                $scope.isVitaCustomer = true
            }

            // check weather return can disable for offline mode
            if ($scope.taxYear == '2018' && $scope.isVitaCustomer != true && $scope.hasFeature('MYTAXPORTAL')) {
                return $scope.isClientPortalFeatureEnable = true;
            } else {
                return $scope.isClientPortalFeatureEnable = false;
            }
            //$scope.DisableUnlockButton();
        };

        var stopPropagation = function () {
            event.stopPropagation();
        }

        var logoClickCloseReturn = function () {
            $scope.closeReturn();
        }
        /**
         *This function will get color preferences from _userDetails otherwise provide default colors
         */
        var _initColorPreferences = function () {
            //This Object hold User Detail 
            var _userDetails = userService.getUserDetails();

            //if colorPreference has not performReview, add object
            if ($scope.colorPreference.performReview == undefined) {
                $scope.colorPreference.performReview = {};
            }

            //This Condition Check userDetails on "preferences.color.performReview" is there or not
            if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences) && !_.isUndefined(_userDetails.settings.preferences.color) && !_.isUndefined(_userDetails.settings.preferences.color.performReview)) {

                $scope.colorPreference.performReview.reject = _userDetails.settings.preferences.color.reject;
                $scope.colorPreference.performReview.warning = _userDetails.settings.preferences.color.warning;
                $scope.colorPreference.performReview.info = _userDetails.settings.preferences.color.info;

            } else {
                //Set default color if user's color preferences for performReviewColors are not available
                var performReview = userService.getColorPreferences();
                $scope.colorPreference.performReview.reject = performReview.reject;
                $scope.colorPreference.performReview.warning = performReview.warning;
                $scope.colorPreference.performReview.info = performReview.info;
            }
        };

        //Initialization of UI components like 'Form Grid in Add Form' 
        var _initUI = function () {
            //Return Status    
            $scope.returnStatus = returnService.getReturnStatusList();

            //Left Pane Definitions and Objects- Start

            // For Grid - Start. First object is configuration and second is for data
            // and other operations from data 
            // Note 1: For filter we are reloading this grid using watch operation and apply filter inside getData part. It will be ok until we have cached object
            // Issue1 : count per page is set to 5000 for grid to avoid paging. But we have to identify way to get this by length of available data
            $scope.addFormListGrid = new NgTableParams({
                page: 1, // show initial page
                count: 5000,
                sorting: {
                    // initial sorting
                    displayName: 'asc'
                }
            }, {
                    total: 0, // length of data
                    counts: [],
                    sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
                    getData: function ($defer, params) {
                        // get Data here
                        //Note: Currently Table grid is initialize based on current available forms. 
                        //      We have to write code to refresh this grid as result of change in availableForms when adding states.
                        if (angular.isUndefined($scope.availableForms)) {
                            _initAvailableForms();
                        }
                        //Apply standard sorting
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.availableForms, params.orderBy()) : $scope.availableForms;

                        //Filter based on search field.
                        //Issue: currently we are reloading grid for filter. But it may be costly operation if result is not from cached object
                        //Note: this will be needed if we do our 
                        //orderedData=$filter('addFormFilter')(orderedData,angular.isDefined($scope.addForm.Search)?$scope.addForm.Search:'');

                        //Return Result to grid
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });




            //Left Pane Definitions and Objects - End


            //rejection section start
            //hold rejection error list 
            var rejectionError = [];
            //initialize  init Rejection Error List
            var _initRejectionErrorList = function () {
                $scope.isRejectionLoading = true;
                var deferred = $q.defer();
                returnService.getRejectionErrorList($routeParams.id).then(function (response) {
                    //initally just blank error list 
                    $scope.rejectionErrorList = [];
                    rejectionError = [];
                    if (!_.isUndefined(response) && response.length !== 0) {
                        _.forEach(response, function (rejection) {
                            _.forEach(rejection.errorList, function (error) {
                                var object = {};
                                object.errorCategory = error.errorCategory;
                                object.ruleNumber = error.ruleNumber;
                                object.severity = error.severity;
                                object.errorMessage = error.errorMessage;
                                object.dataValue = error.dataValue;
                                object.field = error.field;
                                object.originalErrorMessage = error.originalErrorMessage;
                                object.stateName = rejection.stateName.toUpperCase();
                                rejectionError.push(object);
                            });
                        });
                        $scope.rejectionErrorList = angular.copy(rejectionError);
                    }
                    $scope.isRejectionLoading = false;
                    deferred.resolve();
                }, function (error) {
                    $log.error(error);
                    $scope.isRejectionLoading = false;
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            // hold alert list
            var alertError = [];
            // function for call api of alert for list data
            var _initAlertList = function () {
                $scope.isAlertLoading = true;
                var deferred = $q.defer();
                returnService.getAlertList($routeParams.id).then(function (response) {
                    //initally just blank error list 
                    $scope.alertList = [];
                    alertError = [];
                    if (!_.isUndefined(response) && response.length !== 0) {
                        _.forEach(response, function (rejection) {
                            _.forEach(rejection.alertList, function (error) {
                                var object = {};
                                object.alertCategory = error.alertCategoryCd;
                                object.ruleNumber = error.ruleNum;
                                object.severity = error.severityCd;
                                object.alertMessageTxt = error.alertMessageTxt;
                                object.dataValue = error.dataValue;
                                object.stateName = rejection.stateName.toUpperCase();
                                alertError.push(object);
                            });
                        });
                        $scope.alertList = angular.copy(alertError);
                    }
                    $scope.isAlertLoading = false;
                    deferred.resolve();
                }, function (error) {
                    $log.error(error);
                    $scope.isAlertLoading = false;
                    deferred.reject(error);
                });
                return deferred.promise;
            }

            /**
		 * Wrapper function to load rejection. Created to use for interview mode for now.
		 */
            $scope.initRejectionErrorList = function () {
                return _initRejectionErrorList();
            };

            //rejection grid start
            $scope.rejectionGrid = new NgTableParams({
                page: 1, // show initial page
                count: 5000,// count per page
                sorting: {
                    // initial sorting
                    ruleNumber: 'asc'
                }
            }, {
                    total: 0, // length of data
                    counts: [],
                    sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
                    getData: function ($defer, params) {
                        // Request to API
                        // get Data here				
                        if (angular.isUndefined($scope.rejectionErrorList)) {
                            _initRejectionErrorList().then(function () {
                                //Apply standard sorting
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.rejectionErrorList, params.orderBy()) : $scope.rejectionErrorList;
                                //Return Result to grid
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }, function (error) {
                                $log.error(error);
                            });
                        }
                        else {
                            //Apply standard sorting
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.rejectionErrorList, params.orderBy()) : $scope.rejectionErrorList;
                            //Return Result to grid
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                });

            /**
             * Wrapper function to load alert. Created to use for interview mode for now.
             */
            $scope.initAlertMessageList = function () {
                return _initAlertList();
            };

            // alert Grid
            $scope.alertGrid = new NgTableParams({
                page: 1, // show initial page
                count: 5000,// count per page
                sorting: {
                    // initial sorting
                    ruleNumber: 'asc'
                }
            }, {
                    total: 0, // length of data
                    counts: [],
                    sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
                    getData: function ($defer, params) {
                        // Request to API
                        // get Data here				
                        if (angular.isUndefined($scope.alertList)) {
                            _initAlertList().then(function () {
                                //Apply standard sorting
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.alertList, params.orderBy()) : $scope.alertList;
                                //Return Result to grid
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }, function (error) {
                                $log.error(error);
                            });
                        }
                        else {
                            //Apply standard sorting
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.alertList, params.orderBy()) : $scope.alertList;
                            //Return Result to grid
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                })


            ////bank rejection section start
            ////hold bank rejection error list 
            var bankRejectionError = [];
            //initialize  init Rejection Error List
            var _initBankRejectionErrorList = function () {
                $scope.isBankRejectionLoading = true;
                var deferred = $q.defer();
                returnService.getBankRejectionErrorList($routeParams.id).then(function (response) {
                    //initally just blank error list 
                    $scope.bankRejectionErrorList = [];
                    if (!_.isUndefined(response) && response.length !== 0) {
                        $scope.bankRejectionErrorList = response;
                    }
                    $scope.isBankRejectionLoading = false;
                    deferred.resolve();
                }, function (error) {
                    $log.error(error);
                    $scope.isBankRejectionLoading = false;
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            $scope.initBankRejectionErrorList = function () {
                return _initBankRejectionErrorList();
            };

            //bank rejection grid start
            $scope.bankRejectionGrid = new NgTableParams({
                page: 1, // show initial page
                count: 5000,// count per page
                sorting: {
                    // initial sorting
                    errorMessage: 'asc'
                }
            }, {
                    total: 0, // length of data
                    counts: [],
                    sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
                    getData: function ($defer, params) {
                        // Request to API
                        // get Data here				
                        if (angular.isUndefined($scope.bankRejectionErrorList)) {
                            _initBankRejectionErrorList().then(function () {
                                //Apply standard sorting
                                var orderedData = params.sorting() ? $filter('orderBy')($scope.bankRejectionErrorList, params.orderBy()) : $scope.bankRejectionErrorList;
                                //Return Result to grid
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }, function (error) {
                                $log.error(error);
                            });
                        }
                        else {
                            //Apply standard sorting
                            var orderedData = params.sorting() ? $filter('orderBy')($scope.bankRejectionErrorList, params.orderBy()) : $scope.bankRejectionErrorList;
                            //Return Result to grid
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                });
            ////Bank rejection grid end

            ////rejection section end


            //ERC Pane Definitions and Objects -  Start
            // For Grid - Start. 
            // First object is configuration and second is for data and other operations from data. 
            // Note 1: For filter we are reloading this grid using watch operation and apply filter inside getData part. It will be ok until we have cached object
            // Issue1 : count per page is set to 5000 for grid to avoid paging. But we have to identify way to get this by length of available data
            $scope.ercGrid = new NgTableParams({
                page: 1, // show initial page
                count: 5000,
                sorting: {
                    // initial sorting
                    docName: 'dsc',
                }
            }, {
                    total: 0, // length of data
                    counts: [],
                    sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
                    getData: function ($defer, params) {
                        // get Data here				
                        if (angular.isUndefined($scope.availableERC)) {
                            _initAvailableERC();
                        }

                        //Apply standard sorting
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.availableERC, params.orderBy()) : $scope.availableERC;
                        //Return Result to grid
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });

            //ERC grid height
            //Issue : We get wrong height of elements  at this time. So we wait for a second.
            $timeout(function () {
                //Calculate height of other divs and then update ERC grid height to have proper scrollbar
                getElementHeights();
            }, 1000);

            //ERC Pane Definitions and Objects -  End

            //MutationObserver - Start
            //This code is to watch dom changes for left form tree, so we can calculate height when user expand/collapse category or accordion 
            //as well as add/remove form or state. Calculation of height is required to for context menu position. Otherwise there is no such requirement to calculate it.

            //Holding mutation observer
            var observer;
            //Flag to check if mutation is already invoked our code. This is required to maintain as we are observing each child and their class attributes,
            //we may have hundred calls about user action.
            var isMutationInvoked = false;

            //We have wrapped this code inside function to call it recursively
            function registerMutation() {
                // create an observer instance
                observer = new MutationObserver(function (mutations) {
                    //Check If mutation is already invoked then do not enter
                    if (isMutationInvoked == false) {
                        //Set flag to true			    	
                        isMutationInvoked = true;
                        //Disconnect observer so we do not have further call for same purpose. 
                        //This is specially required to avoid recursion where dom update invoke our code and our code again change doem.
                        observer.disconnect();

                        //Perform logic in timeout to wait for html to complete it's work and finish most of observer invocation due to single user action 
                        setTimeout(function () {
                            console.debug("mutation invoked .. !! ");
                            //Logic Here			            
                            _calculateAccordianHeight();

                            //Reset Flag
                            isMutationInvoked = false;
                            //Register observer again
                            registerMutation();
                        }, 300);
                    }
                });
                // configuration of the observer:
                var config = { attributes: true, childList: true, subtree: true, attributeFilter: ["style"] };

                // pass in the target node, as well as the observer options
                observer.observe(document.querySelector('#side_bar_menu_wrap'), config);
            };

            //Interview Mode Changes
            //register mutation observer only when returnMode is 'input'
            if ($scope.returnMode == 'input') {
                registerMutation();
            }

            //MutationObserver - End
        };

        var _calculateAccordianHeight = function () {
            var sidebarHeight = 0;
            // Get main accordion element.
            var element = angular.element(document.querySelector("#manualAccordian"));
            // Get parent of manual accordion
            var sideBarMenuWrapElement = document.querySelector('#side_bar_menu_wrap');

            if (!_.isUndefined(element) && element != null && !_.isUndefined(sideBarMenuWrapElement) && sideBarMenuWrapElement != null) {
                // IF not undefined calculate parent div's height.
                if (!_.isUndefined(sideBarMenuWrapElement) && sideBarMenuWrapElement != "") {
                    sidebarHeight = sideBarMenuWrapElement.offsetHeight;
                }

                //console.log(sidebarHeight + " > " + $rootScope.headerNav.screenHeight);

                //Now check whether federal accordian is opened or not. IF opened then calculate federal accordian's height, ELSE check whether state accordian is open? 
                if (!_.isUndefined($scope.formTree) && !_.isUndefined($scope.formTree.fedAccordionOpen) && $scope.formTree.fedAccordionOpen) {
                    // get federal accordian
                    var fedAccElement = document.querySelector('#federalAccordianContent');
                    var federalAccordianContentHeight = 0;

                    // IF federal accordian is not undefined then calculate its height 
                    if (!_.isUndefined(fedAccElement)) {
                        federalAccordianContentHeight = fedAccElement.offsetHeight + (45 * $scope.returnStates.length) + 55;
                    }
                    //console.log(sidebarHeight + " > " + federalAccordianContentHeight + "=" + ($rootScope.headerNav.screenHeight - (202 + (45 * $scope.returnStates.length)) - 15));

                    //IF federal accordian's height is greater then sidebar then we need to add scroll to federal accordian
                    //ELSE we remove scroll incase if it is added before.
                    if (sidebarHeight < federalAccordianContentHeight) {
                        element.addClass('scroll_visible');
                        // $scope.categoryHeight = ($rootScope.headerNav.screenHeight - (202 + (45 * $scope.returnStates.length)) - 15) + 'px';
                        $scope.isAccordianScrollVisible = true;
                    } else {
                        $scope.isAccordianScrollVisible = false;
                        _removeClass();
                        if (isHeightChanged) {
                            isHeightChanged = false;
                            //$scope.categoryHeight = "auto";
                        }
                    }
                } else if (!_.isUndefined($scope.returnStates) && $scope.returnStates.length > 0) {
                    // Find the state accordian which is open.
                    var openedState = _.find($scope.returnStates, { "isOpen": true });
                    if (openedState) {
                        // get opened state accordian
                        var stateAccordian = document.getElementById('stateAccordianContent_' + openedState.name);
                        //console.log(sidebarHeight + ">" + (stateAccordian.offsetHeight + (215 + (45 * $scope.returnStates.length))));

                        //check whether opened accordian's height is greater then sidebar menu's height 
                        // IF 'yes' then we need to add scroll to federal accordian
                        //ELSE we remove scroll in case if it is added before.
                        if (sidebarHeight < (stateAccordian.offsetHeight + (195 + (45 * $scope.returnStates.length)))) {
                            //element.addClass('scroll_visible');
                            $scope.isAccordianScrollVisible = true;
                            $scope.stateCategoryMaxHeight = $rootScope.headerNav.screenHeight - (195 + (45 * $scope.returnStates.length)) + 'px';
                        } else {
                            $scope.isAccordianScrollVisible = false;
                            _removeClass();
                            if (isHeightChanged) {
                                isHeightChanged = false;
                                $scope.stateCategoryMaxHeight = "auto";
                            }
                        }
                    }
                }

                // IF sidebar height becomes greater then headernav's height then add scroll to sidebar
                //
                if (sidebarHeight > $rootScope.headerNav.screenHeight) {
                    angular.element(sideBarMenuWrapElement).css("overflow-y", "auto");
                } else {
                    angular.element(sideBarMenuWrapElement).css("overflow-y", "hidden");
                }
            }
        };

        var _removeClass = function () {
            var element = angular.element(document.querySelector("#manualAccordian"));
            element.removeClass('scroll_visible');
            /*$scope.categoryHeight = "auto";
            $scope.stateCategoryMaxHeight = "auto";*/
        }

        //$scope.ercGrid.settings().$scope = $scope;

        var _initAvailableForms = function () {
            //make forms available for adding.
            $scope.availableForms = returnService.getAvailableForms();
            //removed atlas form object.
            _.remove($scope.availableForms, { "docName": "dAtlasBankApp" });
            //removed EPS form object.
            _.remove($scope.availableForms, { "docName": "dEPSBankApp" });
            //removed Refund Advantage form object.
            _.remove($scope.availableForms, { "docName": "dRefundAdvantageBankApp" });
            //removed TPG form object.
            _.remove($scope.availableForms, { "docName": "dTPGBankApp" });
            //remove non visible forms (special statement forms build for interview mode only)
            _.remove($scope.availableForms, { "isHiddenForm": true });
        };

        //Define quick add form list
        var _initAvailableQuickForms = function () {
            $scope.availableQuickForms = returnService.getAvailableQuickForms();
            if ($scope.availableQuickForms != undefined && $scope.availableQuickForms != null && $scope.availableForms != undefined && $scope.availableForms != null) {
                _.forEach($scope.availableQuickForms, function (quickFormObj) {
                    quickFormObj.status = _.result(_.find($scope.availableForms, { 'docName': quickFormObj.docName }), 'status');
                });
            }
        };

        //States that are added in return
        var _initAddedStates = function (forceUpdate) {
            //Check if already have added state list
            if (angular.isDefined($scope.returnStates) && $scope.returnStates.length > 0) {
                //Get New List from service
                //Issue: Due to some issue on return service, we are unable to get states with residency type when we add it.
                //So we are passing true argument to have force update instead of getting already built list.
                //We have to solve this issue to avoid building state list everytime
                var stateList = angular.copy(returnService.getAddedStates(forceUpdate));
                //Loop each record to copy isOpen attribute from existing
                _.forEach(stateList, function (state) {
                    var oldState = _.find($scope.returnStates, { name: state.name });
                    if (angular.isDefined(oldState)) {
                        state.isOpen = oldState.isOpen;
                    };
                });
                $scope.returnStates = stateList;
            } else {
                $scope.returnStates = [];
                angular.copy(returnService.getAddedStates(true), $scope.returnStates);//Force update instead of returning from cached variable
            }

        };

        /// if user is not online and added state are not precached then show dialoge else if user is online then precached that state 
        var _checkStatePrecacheStatus = function () {
            //hold added state 
            var statesArry = [];

            // preapare state list 
            _.forEach($scope.returnStates, function (state) {
                statesArry.push({ "state": state.name, "year": $scope.taxYear });
            });

            //push federal because state not contain federal 
            statesArry.push({ "state": "Federal", "year": $scope.taxYear });

            //inject service worker 
            var _serviceWorkerIPC = $injector.get('serviceWorkerIPC');

            if ($scope.isOnline == false && $scope.taxYear == '2016' && $scope.userSettings.preferences != undefined && $scope.userSettings.preferences.offline != undefined && $scope.userSettings.preferences.offline.enableOffline == true) {
                // checke whatever selected state is cached or not
                _serviceWorkerIPC.checkStatePrecacheStatus(statesArry).then(function (response) {
                    /// get all no-cached state
                    var nonCachedState = _.pluck(_.where(response.data, { 'preCache': false }), 'state');
                    // check length of state
                    if (nonCachedState != undefined && nonCachedState.length > 0) {
                        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/nocachedstateDialog.html", "NocachedStateDialogController", { "statelist": nonCachedState });
                        dialog.result.then(function (btn) { }, function (btn) {
                            /// redirect to home page
                            $location.path('/home');
                        });
                    }

                });
            } else if ($scope.isOnline == true && $scope.taxYear == '2016' && statesArry.length > 0 && $scope.userSettings.preferences != undefined && $scope.userSettings.preferences.offline != undefined && $scope.userSettings.preferences.offline.enableOffline == true) {
                //inject _preferencesService
                var _preferencesService = $injector.get('preferencesService');
                _preferencesService.precacheStatesAndUpdateInPrefrences(statesArry);
            }
        };

        //List of available states and upcoming states to add in tax return
        var _initStates = function () {
            //Get all states
            var stateList = returnService.getAvailableStates();
            // Get all released state and Sort alphabetically
            $scope.availableStates = _.filter(stateList, { isReleased: true });
            $scope.availableStates = $filter('orderBy')($scope.availableStates, 'name');
            // Get all upcoming state and Sort alphabetically
            $scope.upcomingStates = _.filter(stateList, { isReleased: false });
            $scope.upcomingStates = $filter('orderBy')($scope.upcomingStates, 'name');
        };

        //status for which state are successfully preCached or not 
        var _updatePreCacheStatus = function () {
            serviceWorkerIPC.getCacheList().then(function (response) {
                if (response.data != undefined && Object.keys(response.data).length > 0) {
                    _.forEach($scope.availableStates, function (aState) {
                        var _cacheName = (aState.name + "-" + $scope.taxYear).toUpperCase();
                        if (response.data[_cacheName] != undefined && response.data[_cacheName].preCache != undefined)
                            aState.preCache = response.data[_cacheName].preCache;
                        else
                            aState.preCache = false;
                    });
                }
            }, function (error) {
            });
        };

        //to show client data in form header
        var _initHeader = function () {
            returnService.getFormData(_currentForm).then(function (data) {
                $scope[_currentForm.docName] = data;
            });

        };

        var _loadForm = function (form, doNotAddToStackNavigation) {
            if (_currentFormInStackNavigation != undefined && form.docIndex != _currentFormInStackNavigation.docIndex) {
                //blank currentform instance of stack navigation
                _currentFormInStackNavigation = undefined;
            }
            //check flag for stackNavigation if it is true then add to previous stack navigation
            if (doNotAddToStackNavigation != true) {
                //This will add current form to previous stack navigation before load any form
                returnService.addToStackNavigation({ "docName": _currentForm.docName, "docIndex": _currentForm.docIndex }, "previous");
                //it will blank next stack from next stack navigation 
                returnService.blankNextStackNavigation();
            }
            _initFormScope(form);
            sendDataToPrintPreviewApp();
        };

        var _addForm = function (form) {
            returnService.addForm(form).then(function (form) {
                _loadForm(form);
            });
        };

        var _removeForm = function (form) {
            returnService.removeForm(form).then(function (form) {
                //Change view if deleted form is on screen
                //Note: isHiddenForm - We have written this condition for interviewmode. As we have some forms which are hiddent in form tree and they will never be available in $scope.forms
                if (!_.isEmpty(_currentForm) && (_currentForm.docIndex === form.docIndex || (_.findIndex($scope.forms, { docIndex: _currentForm.docIndex }) < 0 && _currentForm.extendedProperties.isHiddenForm != true))) {
                    if ($scope.returnMode == 'interview') {//If interview mode then do not load first form (when we remove current form)
                        _loadForm({});
                    } else {
                        var newForm = _.first($scope.forms);
                        if (!_.isUndefined(newForm)) {
                            //Here we pass flag true that informs loadForm  do not add currentform to the stack navigaton
                            //because we deleted that form
                            _loadForm(newForm, true);
                        }
                    }
                }
                //Toast Message about removed from
                messageService.showMessage('Form Removed', 'info', 'REMOVE_FORM_FORMREMOVED_MSG');

                //Refresh available forms and add form grid
                _refreshAddForm();
            });
        };

        var _postTaxFieldChange = function (fieldName, newVal, docIndex) {

            // This is done to ensure that for money type user can only input whole numbers
            //user should not be able to enter number in fracton for money field
            var fieldType = contentService.getFieldType(fieldName);
            if (!_.isUndefined(fieldType) && fieldType.toString().toLowerCase() === 'money') {
                var value = newVal.value;
                if (value) {
                    if (parseInt(value).toString() != value)
                        newVal.value = Math.round(parseFloat(value)).toString();
                }
            } else if (!_.isUndefined(fieldType) && fieldType.toString().toLowerCase() === 'double') {
                var value = newVal.value;
                if (value) {
                    if (isNaN(parseFloat(value))) {
                        newVal.value = "";
                    } else {
                        newVal.value = parseFloat(value).toString();
                    }
                }
            }

            returnService.postTaxFieldChange({
                fieldName: fieldName,
                index: docIndex,
                newVal: newVal
            });

        };

        var _initFormScope = function (form) {
            if (_.isUndefined(form) || _.isEmpty(form)) {
                if ($scope.formScope && !_.isEmpty($scope.formScope)) {
                    $scope.formScope.$destroy();
                    $scope.formScope = {};

                    _currentForm = {};
                }
                //isolated scope is created to hold form data and its state in Angular
                $scope.formScope = $scope.$new(true);

                $scope.$broadcast('formLoadedWithForm', {});
                $scope.$broadcast('hideForm');
            } else {
                $scope.formLoading = true;
                //boolean variable to toggle the Add New Instance button in toolbar
                $scope.isNewInstanceAllowed = returnService.checkForNewInstance(form.formName);

                if ($scope.formScope && !_.isEmpty($scope.formScope)) {
                    $scope.formScope.$destroy();
                    $scope.formScope = null;
                }

                //isolated scope is created to hold form data and its state in Angular
                $scope.formScope = $scope.$new(true);
                $scope.formScope.currentForm = _currentForm = form;

                //To support ID creation
                $scope.formScope.docIndex = _currentForm.docIndex;

                //taxfield directive emit this event 
                //this is done so taxfield directive can be used at any nested level otherwise taxfield would have to
                // use nested $parent which restrict our use of taxfield to certain depth 
                var postTaxFieldChange = $scope.formScope.$on('postTaxFieldChange', function ($event, fieldName, newVal) {
                    //this is done to support statements inside a form
                    var index = $event.docIndex ? $event.docIndex : _currentForm.docIndex;

                    _postTaxFieldChange(fieldName, newVal, index);

                    //stop propogation there is no need to propogate this event higher in scope hierarchy
                    $event.stopPropagation();
                });

                //depericiation statement emit this event. way depericiation statment used it is peer not child or parent of current form scope
                //depriciation statement broadcast this event    
                var peerPostTaxFieldChange = $scope.formScope.$on('peerPostTaxFieldChange', function ($event, fieldName, newVal, docIndex) {
                    _postTaxFieldChange(fieldName, newVal, docIndex);

                });

                //Asynch call to get form data
                returnService.getFormData(form).then(function (data) {
                    $scope.formScope[_currentForm.docName] = data;
                    //here we are set current loaded form for support widget 
                    $scope.$broadcast('formLoadedWithForm', _currentForm);
                    $scope.$broadcast('showForm');
                    localStorageUtilityService.addToLocalStorage('returnPreview', returnService.getDataToSendToPrintPreview())
                });

                //To listen on destroy.
                $scope.formScope.$on('$destroy', function () {
                    //remove listner to avoid memory leak
                    postTaxFieldChange();
                    peerPostTaxFieldChange();
                });
            }
        };

        /**
	 * Function to enable/disable print animation
	 */
        var showOrHidePrintingAnimation = function (type) {
            //If type is request then increment number and if it is response decrement it.
            if (type == 'request') {
                numberOfPrintRequest++;
            } else if (type == 'response') {
                numberOfPrintRequest--;
            }
            //If number of requests are more then 0, It means there is still any process on going.
            //Enable printing animation by making isPriniting variable true.
            if (numberOfPrintRequest > 0) {
                $scope.isPrinting = true;
            } else {
                //No requests is ongoing , so mark isPrinting false
                $scope.isPrinting = false;
            }
        };

        //clean last return data and calcWorker.
        //The reason to do it we want to load db (location,preparer,EIN) first before return is open because when return is new then it start firing calculation
        //and in case of Invoice calculation does not get location information that is required.
        returnService.resetOldReturn();

        //Pass location details to calculation
        returnService.loadDB('locationDB', userService.getLocationData()).then(function (success) { }, function (error) { $log.error(error); });
        //Call to Load EIN and Preparer DB. (for calculation)
        returnService.loadDB('einDB').then(function (success) { }, function (error) { $log.error(error); });
        returnService.loadDB('prepDB').then(function (success) { }, function (error) { $log.error(error); });
        //load resellerDb to get reseller info for calculation
        returnService.loadDB('resellerDB', resellerService.getResellerConfig()).then(function (success) { }, function (error) { $log.error(error); });
        returnService.loadDB('environmentDB', environment.mode).then(function (success) { }, function (error) { $log.error(error); });
        returnService.loadDB('licenseDB').then(function (success) { }, function (error) { $log.error(error); });

        //Open Return
        //Initially we will call the API to get the acknowlegement whether draft exists or not
        //It will return both latest and draft in response if draft exists
        //Pass returnMode (interview or input), Return service will pass it to content service
        returnService.openReturn($routeParams.id, 'checkDraft', $scope.returnMode).then(function (response) {
            //If user has loaded draft version. Then treat it as regular unsaved return. (Ask to save on close) 
            if (!_.isUndefined(response) && !_.isUndefined(response.status) && response.status == 'draft') {
                askForSaveConfirmation = true;
            }
            $scope.lockToggle = {};
            $scope.lockToggle.isLocked = returnService.getReturnLockFlag();
            $scope.SignlockToggle = {};
            $scope.SignlockToggle.isRemoteSignLocked = returnService.getRemoteSignLocked();

            //broadcast that new return has load 
            //It is used to identify return in widgets like document manager, Notes
            $rootScope.$broadcast('TaxReturnOpen', $routeParams.id);
            _init();
            _initUI();
            //Enable Rejection Panel if location path has status rejected
            if (angular.isDefined($routeParams.efileStatus) && $routeParams.efileStatus === 'rejected') {
                $scope.toggleErrorPanel(true);
                dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/common/partials/rejectedReturn.html", "rejectedReturnsInstructionDialogController");
            } else if (angular.isDefined($routeParams.efileStatus) && $routeParams.efileStatus === 'alerts') {
                $scope.toggleErrorPanel(false);
                $scope.toggleAlertPanel(true);
            }
            //Enable Bank Rejection Panel if location path has status Bank rejected
            if (angular.isDefined($routeParams.efileStatus) && $routeParams.efileStatus === 'bankRejected') {
                $scope.toggleBankErrorPanel(true);
                dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/common/partials/rejectedReturn.html", "rejectedReturnsInstructionDialogController");
            }
            //Call the automatic save function after specific interval  
            initSaveReturnInterval();
            //Pass bank details to calculation
            var bankProductsService = $injector.get('bankProductsService');
            // Change for new Bank
            //Check if bank call made before opening this return. This will help on ctrl+F5 
            if (bankProductsService.isBankProductCalled()) {
                //As bank call was made then just get atlas bank xml
                returnService.loadDB('bankDB', bankProductsService.getAtlasBankXml()).then(function (success) { }, function (error) { $log.error(error); });
                //As bank call was made then just get EPS bank fee details
                returnService.loadDB('epsBankDB', bankProductsService.getEPSBankFeeDetails()).then(function (success) { }, function (error) { $log.error(error); });
                //As bank call was made then just get Refund Advantage bank fee details
                returnService.loadDB('refundAdvantageBankDB', bankProductsService.getRefundAdvantageBankFeeDetails()).then(function (success) { }, function (error) { $log.error(error); });
                //As bank call was made then just get TPG bank fee details
                returnService.loadDB('tpgBankDB', bankProductsService.getTPGBankFeeDetails()).then(function (success) { }, function (error) { $log.error(error); });
                //As bank call was made then just get REDBIRD bank details
                returnService.loadDB('redBirdBankDB', bankProductsService.getRedBirdBankDetails()).then(function (success) { }, function (error) { $log.error(error); });
                //As bank call was made then just get protection plus bank details
                returnService.loadDB('protectionPlusDB', bankProductsService.getProtectionPlusDetails()).then(function (success) { }, function (error) { $log.error(error); });
            } else {
                //As bank status api was not called before, First call api then get bankXml data
                bankProductsService.getBankProducts().then(function () {
                    returnService.loadDB('bankDB', bankProductsService.getAtlasBankXml()).then(function (success) { }, function (error) { $log.error(error); });
                    returnService.loadDB('epsBankDB', bankProductsService.getEPSBankFeeDetails()).then(function (success) { }, function (error) { $log.error(error); });
                    returnService.loadDB('refundAdvantageBankDB', bankProductsService.getRefundAdvantageBankFeeDetails()).then(function (success) { }, function (error) { $log.error(error); });
                    returnService.loadDB('tpgBankDB', bankProductsService.getTPGBankFeeDetails()).then(function (success) { }, function (error) { $log.error(error); });
                    returnService.loadDB('redBirdBankDB', bankProductsService.getRedBirdBankDetails()).then(function (success) { }, function (error) { $log.error(error); });
                    returnService.loadDB('protectionPlusDB', bankProductsService.getProtectionPlusDetails()).then(function (success) { }, function (error) { $log.error(error); });
                }, function (error) { $log.error(error); });
            }
            // check for amended return if return created by the use of create amended than we have to add amended form and load that form also
            if (returnService.getSubType()) {
                $scope.returnSubType = returnService.getSubType().toLowerCase();
            }
            if ($scope.betaOnly() === true && $scope.returnSubType === 'amended' && !returnService.getAmendedCreatedFlag()) {
                addAndLoadAmendedForm();
            }
            // establish connection with webRTC and subscribe and emit to socket events.		
            setUpWebRTCAndSocket();
            // after load form store return
        }, function (error) {
            if (error.data != undefined && error.data.code != undefined) {
                if (error.data.code == 4007) {
                    $scope.hasPermissionTochangeLocation = true;
                    $location.path('/return/list');
                } else if (error.data.code == 4032) {
                    //Redirect to Return List with message as return is not available
                    $scope.hasPermissionTochangeLocation = true;
                    $location.path('/return/list/' + error.data.messageKey);
                }
            } else {
                $scope.hasPermissionTochangeLocation = true;
                //Redirect to home page in other case
                $location.path('/home');
            }
        });

        /**
         * @author Hannan Desai
         * @description
         *          To add amended form and load that form in case of return created as amended copy.
         */
        var addAndLoadAmendedForm = function () {
            var acceptedStates = returnService.getAcceptedstateForCreateAmended();
            if (acceptedStates.length > 0) {
                var amendedConfig = [];
                _.forEach(acceptedStates, function (state) {
                    var stateConfig = systemConfig.getStateAndPackageWiseAmendedConfig(state.toLowerCase(), $scope.client.packageName.toLowerCase());
                    _.forEach(stateConfig, function (config) {
                        config.state = state.toLowerCase();
                    })
                    amendedConfig = amendedConfig.concat(stateConfig);
                })
                if (amendedConfig && amendedConfig.length > 0) {
                    // here we have to wait for content service to load, so we ran interval till its gives us undefined value.
                    var interval = $interval(function () {
                        var formToAdd = returnService.getSingleAvailableForm(amendedConfig[0].docName);
                        if (formToAdd) {
                            $interval.cancel(interval);
                            createAmended(amendedConfig, acceptedStates);
                        }
                    }, 100)
                }
            }
        }

        /**
         * @author Hannan Desai
         * @param {*} amendedConfig 
         * @param {*} callback 
         * @description
         *          This function is used to add amended form or check amneded checkbox based on amended config passed. 
         */
        var createAmended = function (amendedConfig, acceptedStates) {
            var addFormOperations = [];
            var taxFieldChange = [];
            _.forEach(amendedConfig, function (config) {
                if (config.isField === true) {
                    var form = returnService.getForm(config.docName)
                    if (form && form.length > 0) {
                        taxFieldChange.push(config);
                    } else {
                        var formToAdd = returnService.getSingleAvailableForm(config.docName);
                        if (formToAdd) {
                            addFormOperations.push(returnService.addForm(formToAdd));
                            taxFieldChange.push(config);
                        }
                    }
                } else {
                    var form = returnService.getForm(config.docName);
                    if (!form || form.length <= 0) {
                        var formToAdd = returnService.getSingleAvailableForm(config.docName);
                        if (formToAdd) {
                            addFormOperations.push(returnService.addForm(formToAdd));
                        }
                    }
                }
            })
            if (addFormOperations.length > 0) {
                $q.all(addFormOperations).then(function (addedForms) {
                    checkAmendedCheckbox(taxFieldChange);
                    var isFederal = _.find(addedForms, { state: "federal" });
                    if (isFederal) {
                        _loadForm(isFederal)
                    } else {
                        _loadForm(addedForms[0]);
                    }
                    returnService.setAmendedCreatedFlag(true);
                })
            } else {
                checkAmendedCheckbox(taxFieldChange);
                var isFederal = _.find(taxFieldChange, { state: "federal" });
                if (isFederal) {
                    _loadForm(returnService.getForm(isFederal.docName)[0]);
                } else {
                    _loadForm(returnService.getForm(taxFieldChange[0].docName)[0]);
                }
                returnService.setAmendedCreatedFlag(true);
            }
        }

        // This function is used to check checkbox for amended return in main form.
        var checkAmendedCheckbox = function (taxFieldChange) {
            if (taxFieldChange && taxFieldChange.length > 0) {
                _.forEach(taxFieldChange, function (config) {
                    var forms = returnService.getForm(config.docName);
                    if (forms && forms.length > 0) {
                        returnService.postTaxFieldChange({ fieldName: config.fieldName, docIndex: forms[0].docIndex, newVal: config.value });
                    }
                })
            }
        }

        // to establish connection with socket and webRTC.		
        var setUpWebRTCAndSocket = function () {
            if (localStorageUtilityService.checkLocalStorageKey("instantFormViewDeviceId")) {
                var deviceID = localStorageUtilityService.getFromLocalStorage("instantFormViewDeviceId");
                webRTCService.createConnectionWithWebRTC();
                webRTCService.createOffer().then(function (offer) {
                    // send offer to other peer.		
                    rtcSocketService.emit("passData", { type: "offer", offer: offer, id: deviceID }, function (data) { });
                }, function (error) { });
                // subscribe to socket event		
                rtcSocketService.on("passData", function (data) {
                    if (data.type == "offer") {
                        webRTCService.offerAnswer(data).then(function (answer) {
                            rtcSocketService.emit("passData", { type: "answer", answer: answer, id: deviceID }, function (data) { });
                        })
                    } else if (data.type == "answer") {
                        webRTCService.onAnswer(data.answer);
                    } else if (data.type == "candidate") {
                        webRTCService.onCandidate(data.candidate);
                    } else {
                        console.log(data);
                    }
                })
                // subscribe to event when ice candidate created by web rtc.		
                $rootScope.$on('iceCandidateCallback', function (event, data) {
                    rtcSocketService.emit("passData", { type: 'candidate', candidate: data, id: deviceID }, function (data) { });
                })
            }
        }

        /**
         * oprn dialog to restore return data by entering json data
         */
        $scope.restoreReturnByJsonData = function () {
            var customDialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' }, "taxAppJs/return/workspace/partials/dialog/restoreReturnDataByJson.html", "restoreReturnDataByJsonDialogController");
            customDialog.result.then(function (res) {
                if (res != undefined && res.jsonData != undefined) {
                    returnService.restoreReturnByJsonData(res.jsonData).then(function (response) {
                        $scope.forms = [];
                        $scope.returnStates = [];
                        setTimeout(function () {
                            _init();
                        }, 0)


                    }, function (error) {
                        console.log(error);
                    });

                }
            });
        }

        /**
         * this function will call when user click shedule k1 import from tools menu.
         * this function will call the service function which call API to get k1 data for particular ssn.
         * it also returns the already imported k1 data.
         */
        $scope.openK1ImportDialog = function () {
            //get list of available k1 data to import.
            returnService.getK1Data().then(function (result) {
                var k1ToImport = [];
                //filter based on k1 is already imported tha, we can not display it to import again.
                _.forEach(result.k1Data, function (obj) {
                    var alreadyImported = false;
                    _.forEach(result.importedK1Data, function (imported) {
                        if ((obj.returnId + obj.ssn) === (imported.returnId + imported.ssn)) {
                            alreadyImported = true;
                        }
                    });
                    if (alreadyImported === false) {
                        k1ToImport.push(obj);
                    }
                })

                // if k1 Data available to import after filtering than, we will display the dialog to choose which k1 user wants to import.
                if (k1ToImport.length > 0) {

                    if (k1ToImport.length == 1) {
                        // show confirm dialog if k1-data exists for entered SSN.
                        var dialog = dialogService.openDialog("confirm", { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, { text: "Schedule K-1 data for the shareholder exists, do you want to import the information?" });
                        dialog.result.then(function (result) {

                            k1ToImport[0].isUpdated = false;
                            //call service function that call API to get selected k1's data from that k1's return.
                            returnService.getK1DataFromReturn(k1ToImport).then(function (result) {

                                // add respected forms for imported k1's to worksheet.
                                returnService.addImportedK1Forms(result);

                                // update records of k1 data.
                                returnService.updateK1Records(k1ToImport);
                            }, function (error) {
                                console.log(error);
                                console.log("Error occured while getting data of imported K1 from return");
                            })
                        });
                    } else {
                        var customDialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/dialog/k1ImportDialog.html", "k1ImportDialogController", { 'data': k1ToImport, 'ssn': result.ssn });
                        customDialog.result.then(function (btn) {
                            var importForms = [];
                            _.forEach(btn, function (obj) {
                                if (!_.isUndefined(obj.isSelected) && obj.isSelected == true) {
                                    obj.isUpdated = false;
                                    importForms.push(obj);
                                }
                            })
                            //call service function that call API to get selected k1's data from that k1's return.
                            returnService.getK1DataFromReturn(importForms).then(function (result) {

                                // add respected forms for imported k1's to worksheet.
                                returnService.addImportedK1Forms(result);

                                // update records of k1 data.
                                returnService.updateK1Records(importForms);
                            }, function (error) {
                                console.log(error);
                                console.log("Error occured while getting data of imported K1 from return");
                            })
                        });
                    }
                } else {
                    // if no k1 data available to import than we will showing a notify dialog.
                    var dialogConfig = { "title": "No Data Available To Import", "text": "All the K1 data was imported or there is no data available to import." };
                    var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
                }
            }, function (error) {
                console.log(error);
                console.log("Error occured while getting list of available k1 data to import.");
            })
        }

        //Left Pane Functions - Start

        //this will expand category and accordion as per passed form 
        //Note: To collapse all accordion call this method without argument. Useful to avoid unnecessary scrollbars in transition. (For Ex- While adding state)
        var _refreshFormTree = function (form) {
            //Check if form is passed
            if (angular.isDefined(form)) {
                //Category of last form
                var lastFormProp = returnService.getFormProp(form.formName);
                //Expand either federal category or state accordion
                if (lastFormProp.state === 'federal') {
                    //Update isOpen for all categories. To expand last added form's category and collapse other categories. For federal forms only
                    _.some($scope.categories, function (category, index) {
                        if (category.name == lastFormProp.category) {
                            category.isOpen = true;
                            return true;
                        }
                    });

                    //Expand Federal accordion
                    if (angular.isUndefined($scope.formTree)) {
                        $scope.formTree = {};
                    }
                    //Expand Federal accordion
                    $scope.formTree.fedAccordionOpen = true;
                } else {
                    //Expand state for which this form is added
                    _.forEach($scope.returnStates, function (state) {
                        if (state.name == lastFormProp.state) {
                            state.isOpen = true;
                            //return true;
                        } else {
                            state.isOpen = false;
                        }
                    });
                }
            } else {
                //If form is not passed then collapse all accordion 
                //Collapse Federal accordion
                $scope.formTree.fedAccordionOpen = false;
                //Collapse all state accordion
                _.forEach($scope.returnStates, function (state) {
                    state.isOpen = false;
                });
            }
        };

        //Issue : we are unable to get only selected list of forms from ng-table (html). Thats why we are passing whole list of forms from grid
        //and iterate whole list to check if it is checked or not	 
        //Sequence of adding forms - 1)Forms having parent of parent will be added first (multilevel parent), 2) Single instance(no parent) or having single instance parent, 
        //3)Forms having parent (selected by user on popup)
        $scope.addForms = function (formList, doNotAddToStackNavigation) {
            //que for add form
            var formsToAdd = [];
            // IF there is multi parent or multi instance form available then set flag value to true
            var isDialogRequired = false;
            // Array will hold data of form with no parent or single parent single instance forms temporary
            // In case of, multi parent form or multi instance form availble then will process data on dialog save button click
            var tempForms = [];

            //Filter out only selected forms for add
            angular.forEach(formList, function (form) {
                if (form.letsAdd) {
                    var parentIds = form.parentID.split(',');
                    // IF multiple parents set flag to true.
                    if (angular.isDefined(form.parentID) && parentIds.length > 1) {
                        if (isDialogRequired == false) {
                            isDialogRequired = true;
                        }
                    } else {  // IF single parent then set flag to true only if form is multi-instance
                        if (parentIds.length == 1) {
                            var parentObj = _.find($scope.availableForms, { 'id': parentIds[0] });
                            if (angular.isDefined(parentObj) && parentObj.isMultiAllowed == true) {
                                if (isDialogRequired == false) {
                                    isDialogRequired = true;
                                }
                            } else {
                                //Add form IF single parent is not a multi-instance form
                                // We push data in temp array because we will process these data on save button click
                                tempForms.push(form);
                            }
                        } else {
                            //Add form IF no parent form available
                            // We push data in temp array because we will process these data on save button click
                            tempForms.push(form);
                        }
                    }
                }
            });

            // IF there is multi-parent / or a multi-instance form available then open dialog and let user select appropriate parent form.
            // ELSE proceed further
            if (isDialogRequired) {
                //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller, Fifth Arg - pass data for operation			  
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' },
                    "taxAppJs/return/workspace/partials/multiParentSelectionDialog.html", "addFormDialogController", { "availableForms": angular.copy($scope.availableForms), "formList": angular.copy(formList), "existingForms": angular.copy($scope.forms) });

                // IF dialog returns successfully then there will be list of form and its selected parents available
                // ELSE proceed further
                dialog.result.then(function (list) {
                    // Mulit instance form or multi parent form will be added
                    if (angular.isDefined(list) && list.length > 0) {
                        var specialList = [], normalList = [];
                        angular.forEach(list, function (form) {
                            /* Note:-
						 * Here we check for a following use case
						 * When both parent and child is selected, parent will be added twice,
						 * to avoid this scenario we remove selected parent form from selection,
						 * so only one instance of parent selected in that transaction.
						 */
                            if (angular.isDefined(tempForms) && tempForms.length > 0) {
                                _.remove(tempForms, function (currentObject) {
                                    return form.selectedParent.docName == currentObject.docName;
                                });
                            }

                            if (angular.isDefined(form.child) && angular.isDefined(form.child.isMultilevelParent) && form.child.isMultilevelParent == true) {
                                // IF user select existing form 
                                if (angular.isDefined(form.selectedParent.docIndex)) {
                                    specialList.push(returnService.addForm(form.child, undefined, form.selectedParent.docIndex));
                                } else { // IF user select new form
                                    specialList.push(returnService.addForm(form.child, form.selectedParent.id));
                                }
                            } else {
                                normalList.push(form);
                            }
                        });

                        $q.all(specialList).then(function (response) {
                            // Form with no parent or single parent single instance form will be added on successfully save button click
                            // Note: we do this after we manipulate parent list, because in same transactions 
                            if (angular.isDefined(tempForms) && tempForms.length > 0) {
                                angular.forEach(tempForms, function (form) {
                                    formsToAdd.push(returnService.addForm(form));
                                });
                            }

                            _.forEach(normalList, function (form) {
                                _.forEach(response, function (obj) {
                                    if (form.selectedParent.docName == obj.docName) {
                                        form.selectedParent.docIndex = obj.docIndex;
                                    }
                                });

                                if (angular.isDefined(form.selectedParent.docIndex)) {
                                    formsToAdd.push(returnService.addForm(form.child, undefined, form.selectedParent.docIndex));
                                } else { // IF user select new form
                                    formsToAdd.push(returnService.addForm(form.child, form.selectedParent.id));
                                }
                            });
                            _addFormCommonOperation(formsToAdd, doNotAddToStackNavigation);
                        }, function (error) {

                        });
                    }
                }, function (btn) {
                    //Note: In case of error/cancel/dismiss. We will not proceed add form.
                    //Reset Search START				
                    $scope.addForm.Search = "";
                    $scope.addForm.TypeSearch = "";
                    //Refresh form list and add form grid
                    _refreshAddForm();
                    //Reset Search END -------------
                    // IF user cancel add form then no need to show message.
                    if (btn != 'Canceled') {
                        messageService.showMessage('Sorry Add form can not be proceed. Try again', 'error', 'ADD_FORM_DIALOG_ERROR_MSG');
                    }
                });
            } else {
                // In case of, selected forms are single instance or forms with no parent, dialog will not open. We will proceed this form with out user inputs.   
                if (angular.isDefined(tempForms) && tempForms.length > 0) {
                    angular.forEach(tempForms, function (form) {
                        formsToAdd.push(returnService.addForm(form));
                    });
                }
                _addFormCommonOperation(formsToAdd, doNotAddToStackNavigation);
            }
        };

        //This function is created for code re-usability to support parent-child Add form case.
        var _addFormCommonOperation = function (formsToAdd, doNotAddToStackNavigation) {

            if (formsToAdd.length > 0) {
                $q.all(formsToAdd).then(function (data) {
                    //Load last added form
                    var lastForm = _.last(data);
                    //Add last form
                    _loadForm(lastForm, doNotAddToStackNavigation);

                    _refreshFormTree(lastForm);

                    //Reset Search
                    $scope.addForm.Search = "";
                    $scope.addForm.TypeSearch = "";

                    //Refresh form list and add form grid
                    _refreshAddForm();

                    //Toast Message
                    if (formsToAdd.length === 1) {
                        messageService.showMessage('Form Added', 'info', 'ADD_FORM_ADDED_MSG');
                    } else {
                        messageService.showMessage('Selected Forms Added', 'info', 'ADD_FORM_SELECTEDADDED_MSG');
                    }
                }, function (error) {
                    $log.error(error);
                });
            }
        };

        //Issue: This function getting called twice on add form or state. When adding form or state it also fires due to calculation. As this will be fire on end of calculation.
        var _refreshAddForm = function () {
            //Reload form list
            _initAvailableForms();

            //Note: Do not Refresh add form grid here as it freezes ui and this may be called by many operations. We just need to update data and refresh grid only when we open add form grid.

        };

        //this method precache states
        var _precacheState = function (stateList) {
            var _stateToPrecache = [];
            angular.forEach(stateList, function (state) {
                if (state.letsAdd && !state.isAdded) {
                    _stateToPrecache.push({ "state": state.name, "year": $scope.taxYear });
                }
            });
            //precache state only if user is online and offline feature is enable 
            if ($scope.isOnline == true && $scope.taxYear == '2016' && _stateToPrecache.length > 0 && $scope.userSettings.preferences != undefined && $scope.userSettings.preferences.offline != undefined && $scope.userSettings.preferences.offline.enableOffline == true) {
                //inject _preferencesService
                var _preferencesService = $injector.get('preferencesService');
                _preferencesService.precacheStatesAndUpdateInPrefrences(_stateToPrecache);
            }
        };
        //Issue : we are unable to get only selected list of states from ng-repeat. Thats why we are passing whole list of states
        //and iterate whole list to check if it is checked or not. If it is only the solution then please
        $scope.addStates = function (stateList, residentType, isSilentOperation) {
            //Check if residency limit is over or not
            var residencyLimitExceed = false;
            $scope.residentStatesLimitExceed = false;
            if (residentType === 'FY') {
                var _alreadyAddedStates = _.filter($scope.returnStates, { 'residencyStatus': 'FY' }).length;
                var _statesToAdd = _.filter(stateList, { letsAdd: true }).length
                if (_alreadyAddedStates + _statesToAdd > 2) {
                    residencyLimitExceed = true;
                    $scope.residentStatesLimitExceed = true;
                }
            }

            //If limit is not exceed
            if (residencyLimitExceed === false) {
                $scope.addStateToggle.isOpen = false;
                //For Que
                var statesToAdd = [];

                //we don't need this operation to be executed when we want already open accordian remain as it is.
                if (isSilentOperation != true) {
                    //Collapse federal & state accorions to avoid unnecessary scrollbars
                    _refreshFormTree();
                }

                //Prepare list of states need to be added
                angular.forEach(stateList, function (state) {
                    if (state.letsAdd && !state.isAdded) {
                        statesToAdd.push(returnService.addState(state.name.toLowerCase(), residentType));
                    }
                });
                //update residency of states in main info (calculation)
                returnService.updateStateResInCalc(residentType);
                if (statesToAdd.length > 0) {
                    $q.all(statesToAdd).then(function (stateNames) {
                        //update state accordion
                        _initAddedStates();
                        if ($scope.returnMode == 'input') {
                            //we don't need this operation to be executed when we want already open accordian remain as it is.
                            if (isSilentOperation != true) {
                                //Expand last added state accordion.
                                _.forEach($scope.returnStates, function (retState) {
                                    if (retState.name.toLowerCase() === _.last(stateNames)) {
                                        retState.isOpen = true;
                                    } else {
                                        retState.isOpen = false;
                                    }
                                });
                                //Open first form from last state from list
                                var stateFirstForm = $filter('stateFilter')($scope.forms, _.last(stateNames))[0];
                                if (!_.isUndefined(stateFirstForm)) {
                                    _loadForm(stateFirstForm);
                                }
                            }
                            //Refresh available forms and add form grid
                            _refreshAddForm();

                        }
                        //Reload available states
                        _initStates();
                        //Toast Message
                        if (statesToAdd.length === 1) {
                            messageService.showMessage('State Added', 'info', 'ADD_STATE_STATEADD_MSG');
                        } else {
                            messageService.showMessage('Selected States Added', 'info', 'ADD_STATE_SELECTEDSTATESADD_MSG');
                        }
                    }, function (error) {
                        $log.error(error);
                    });
                }
                _precacheState(stateList);
            } else {

            }

        };

        //Refund status from context menu of state
        $scope.getRefundStatusLink = function (stateName) {
            //Get state link to check refund status
            //Provide state name as a key in lower case
            window.open(systemConfig.getRefundStatusLink(stateName.toLowerCase()), "_blank")
            $scope.refundStatusLink = systemConfig.getRefundStatusLink(stateName.toLowerCase());
        }

        //Remove state from return
        $scope.removeState = function (stateName, $event, residentType) {
            //If state efile is approved then do not allow to remove it and show dialog with message
            var efileStatusAccepted = _.find(returnService.getEfileStatus(stateName.toLowerCase()), { "status": 9 });
            if (efileStatusAccepted != undefined) {
                //Attention Dialog
                var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                localeService.translate('You cannot delete this state as its E-File is already approved.', 'RETURNCONTROLLERYOUCANOTDELETESTATEEFILEAPPROVED').then(function (translatedText) {
                    var dialog = dialogService.openDialog("attention", dialogConfiguration, translatedText);
                });

                //Return true to break 
                return true;
            }

            returnService.removeState(stateName, residentType).then(function () {
                //update state accordion
                _initAddedStates();
                //condition kept to execute the below code only when return mode is 'input'
                if ($scope.returnMode == 'input') {
                    //Code to change form view if it is in removed state
                    //Get form property to check is state of current form is same that user want to remove
                    var formProp = returnService.getFormProp(_currentForm.formName);
                    if (!_.isUndefined(formProp) && formProp.state === stateName) {
                        var newForm = _.first($scope.forms);
                        if (!_.isUndefined(newForm))
                            _loadForm(newForm);

                        //Expand federal accordion as first form will be always in Federal
                        $scope.formTree.fedAccordionOpen = true;
                    } else {
                        //Expand accordion of current form
                        if (!_.isUndefined(formProp) && formProp.state == 'federal') {
                            $scope.formTree.fedAccordionOpen = true;
                        } else {
                            var obj = _.find($scope.returnStates, { name: 'formProp.state' });
                            if (obj != undefined) {
                                obj.isOpen = true;
                            }
                        }
                    }
                    //Refresh available forms and add form grid
                    _refreshAddForm();

                }
                //Reload available states
                _initStates();
                messageService.showMessage('State Removed', 'info', 'REMOV_STATE_STATEREMOVED_MSG');
                if (!_.isUndefined($event)) {
                    $event.stopPropagation();
                }
            }, function (error) {
                $log.error(error);
            });
        };

        //Change Residency status of state (FY,NR,PY)
        $scope.changeStateResidency = function (state, oldResidencyShortName, newResidencyShortName, $event) {
            var stateName = state.name;
            if (oldResidencyShortName != newResidencyShortName) {
                //If state efile is approved then do not allow to remove it and show dialog with message
                //If state efile is approved then do not allow to remove it and show dialog with message
                var efileStatusAccepted = _.find(returnService.getEfileStatus(stateName.toLowerCase()), { "status": 9 });
                if (efileStatusAccepted != undefined) {
                    //Attention Dialog
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    localeService.translate("You cannot change residency type for this state as its E-File is already approved.", 'RETURNCONTROLLER_YOUCANOTRESIDENCYEFILEAPPROVED').then(function (translatedText) {
                        var dialog = dialogService.openDialog("attention", dialogConfiguration, translatedText);
                    });

                    //Return true to break 
                    return true;
                }

                //return service call
                returnService.changeStateResidency(stateName, oldResidencyShortName, newResidencyShortName).then(function () {
                    //update state accordion
                    _initAddedStates();

                    //update state accordion isOpen.
                    _.find($scope.returnStates, function (retState) {
                        if (retState.name == stateName) {
                            retState.isOpen = state.isOpen;
                            //Break loop
                            return true;
                        }
                    });

                    //Reload available states
                    _initStates();

                    messageService.showMessage('State Residency Type Changed', 'info', 'CHANG_STATE_STATERESITYPECHAN_MSG');
                }, function (error) {
                    $log.error(error);
                });

            } else {
                //Prevent click if old and new residency status are same
                $event.stopPropagation();
            }
        };

        $scope.resetAccordian = function ($event) {
            $log.log(JSON.stringify($scope.returnStates) + " | formTree.fedAccordionOpen - " + $scope.formTree.fedAccordionOpen);
            $event.stopPropagation();
        };

        /**
	 * This will update formStatus property in form tree
	 * Active/InActive/Required
	 */
        var _refreshFormTreeStatus = function () {
            _.forEach($scope.forms, function (form) {
                //Get Form Status
                var result = returnService.getDocStatus(form.docName, form.docIndex);

                //Append property
                if (angular.isDefined(form.extendedProperties)) {
                    form.extendedProperties.formStatus = result;
                } else {
                    form.extendedProperties = { formStatus: result };
                }
            });
        };

        //For Parent form - Start
        $scope.getParentFormName = function (form) {
            if (angular.isDefined(form.parentDocIndex) && form.parentDocIndex != '' && form.parentDocIndex != '0') {
                return _.find($scope.forms, { 'docIndex': form.parentDocIndex }).extendedProperties.displayName;
            } else {
                return "";
            }
        };

        $scope.getParentForm = function (form) {
            if (angular.isDefined(form.parentDocIndex) && form.parentDocIndex != '' && form.parentDocIndex != '0') {
                return _.find($scope.forms, { 'docIndex': form.parentDocIndex });
            } else {
                return {};
            }
        };
        //For Parent form - End


        $scope.addForm = function (form) {
            //Check if isAdded flag is true
            if (form.isAdded == true) {
                //Load exisitng form with tree refresh
                var existingForm = _.find($scope.forms, { 'docName': form.docName });
                $scope.loadFormWithRefreshTree(existingForm);
            } else {
                // Array will hold list of selected form
                var formList = [];
                // If form is type of array then proceed further
                if (!_.isArray(form)) {
                    formList.push(form);
                } else {
                    formList = form;
                }

                //Loop through formlist.
                _.forEach(formList, function (obj, index) {

                    //get all properties of form
                    //Note: We require to have copy object to avoid unnecessary two way data binding.
                    var formObj = angular.copy(returnService.getSingleAvailableForm(obj.docName));

                    if (!_.isUndefined(formObj)) {
                        // add letsAdd property true to add form
                        formObj.letsAdd = true;
                        //Update form entry in list with updated one
                        formList[index] = formObj;
                    }
                });
                // call addforms function.
                $scope.addForms(formList);
            }
            document.getElementById("addFormDropdown").classList.remove("show");
        };

        //This function is used to open confirm dialog while deleting the form or close the return
        var _openConfirmDialog = function (type) {
            var deferred = $q.defer();
            returnService.openConfirmDialog(type).then(function (result) {
                deferred.resolve(result);
            })
            return deferred.promise;
        }

        $scope.removeForm = function (form, $event) {
            if ($event != undefined) {
                $event.stopPropagation();
            }
            // if removed form is k1PS or k1ET than we check if this form is imported k1 than , we also need to remove it from importedk1Data.
            if (form.docName === 'dSchK1PS' || form.docName === 'dSchK1ET') {
                var val = returnService.getElementValue("ReturnId", form.docName, form.docIndex);
                if (!_.isUndefined(val) && val !== "") {
                    var dialog = dialogService.openDialog("confirm", { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, { text: "You are deleting K-1 information that has been imported, are you sure you want to continue?" });
                    dialog.result.then(function (result) {
                        _removeForm(form);
                        returnService.removeImportedK1Data(val);
                    })
                }
                else {
                    _openConfirmDialog('removeForm').then(function (result) {
                        if (result == true) {//if result is true then perform action
                            _removeForm(form);
                        }
                    });
                }
            }
            else {
                _openConfirmDialog('removeForm').then(function (result) {
                    if (result == true) {//if result is true then perform action
                        _removeForm(form);
                    }
                });
            }
        };
        $scope.loadForm = function (form) {
            if (_currentForm.docIndex !== form.docIndex)
                _loadForm(form);
        };

        /**
         * Load Current form with if calculation changes in current form
         */
        $scope.loadFormChanges = function (form) {
            _loadForm(form);
        };

        //From UI if we have to load form and also expand category in tree. 
        //Note: This function will internally called same two function load form and refreshFromTree
        $scope.loadFormWithRefreshTree = function (form) {
            if (_currentForm.docIndex !== form.docIndex) {
                _loadForm(form);
                _refreshFormTree(form);
            }
        };

        //Function is used for changing class when amount's length's sum greater then 14.
        //We have total 3 field for figures fedAGI, fedRefund and fedOwe.
        $scope.getFedFiguresLength = function () {
            var temp = 0;
            if (angular.isDefined($scope.formTree)) {
                if (angular.isDefined($scope.formTree.fedAGI)) {
                    temp = temp + $scope.formTree.fedAGI.toString().length;
                }

                if (angular.isDefined($scope.formTree.fedRefund)) {
                    temp = temp + $scope.formTree.fedRefund.toString().length;
                }

                if (angular.isDefined($scope.formTree.fedOwe)) {
                    temp = temp + $scope.formTree.fedOwe.toString().length;
                }
            }
            return temp;
        };


        //Following function will return for with list of parent forms and current parent form.
        //When user will click edit form then this function will be executed.
        $scope.getParentForms = function (form) {
            //assigns parents to form
            form.parents = returnService.getParentForms(angular.copy(form));
            form.isDropDownVisible = true;
            //IF for have a parent then we select it by default.
            var _currentParent = _.find(form.parents, { docIndex: form.parentDocIndex });
            if (!_.isUndefined(_currentParent)) {
                form.currentParent = _currentParent;
            }
        };

        //change parent
        $scope.changeParent = function (childForm) {
            if (!_.isUndefined(childForm.currentParent)) {
                //we need to store oldparent to recalculate.
                var oldParent = _.find($scope.forms, { docIndex: childForm.parentDocIndex });
                //IF parent form is a new instance then first add parent form and then change the docIndex.
                //ELSE change parent directly			
                if (!_.isUndefined(childForm.currentParent.objType) && childForm.currentParent.objType.toLowerCase() == "new") {
                    //add parent then reassign parentId..
                    returnService.addForm(childForm.currentParent).then(function (newParentInstance) {
                        _updateFormObject(childForm, oldParent, newParentInstance.docIndex);
                    });
                } else {
                    _updateFormObject(childForm, oldParent, childForm.currentParent.docIndex);
                }
            }
        };


        //resets the child form object
        var _updateFormObject = function (childForm, oldParent, newParentInstance) {
            //reassign parentID
            childForm.parentDocIndex = childForm.currentParent.docIndex;
            returnService.changeParent(childForm, oldParent, newParentInstance);
            //delete unnecessary data
            delete childForm.isDropDownVisible;
            delete childForm.parents;
            delete childForm.currentParent;
        };


        //Left Pane Functions - End

        // Retun Header Functions - start

        //This function is temporary to format ssn in header. We have to change ui-mask to store formated value instead of un-formatted value.
        //Note: If we write one more filter other then changing ui-mask. It will heart performance of application
        /*$scope.$watch('dMainInfo.tpssn.value',function(newVal,oldVal){
		var ssn = newVal;
		if(angular.isDefined(ssn) && ssn!=null && ssn!=''){
			var frmtSSN = '';
	        while (ssn.length > 3) {
	        	frmtSSN += ssn.substr(0, 3) + '-';
	          ssn = ssn.substr(3);
	        }
	        frmtSSN += ssn;

	        $scope.dMainInfo.tpssn.maskValue = frmtSSN;
		}				
	});*/
        // Retun Header Functions - end


        //Toolbar Functions - Start

        //This function will save return using return-service
        //isAuto argument will be true if it called in background for auto save.
        //Note :- method is converted to promise pattern as this method is also used in Interview mode when user click on Input Mode button
        //so we need to wait until the return get save otherwise tha changes are not reflected when return are open after interview mode is closed.
        $scope.saveReturn = function (isAuto) {
            //Check if isAuto is undefined or null and stops AutoSave
            if (angular.isUndefined(isAuto) || isAuto == false) {
                //Cancel interval if manual save is called. As we have to re initialize this after completing manual save.
                if (angular.isDefined(autoSaveInterval)) {
                    $interval.cancel(autoSaveInterval);
                    autoSaveInterval = undefined;
                }
            }

            return returnService.saveReturn(isAuto).then(function () {
                //Write Toast Message here to notify user that return is saved successfully
                //Note: Current implementation is promise pattern, but we may have to implement some kind of loader to stop user from interacting with form while saving
                if (isAuto) {
                    messageService.showMessage('Return Automatically Saved in Draft', 'info', 'SAVE_RETURN_RETURNAUTOMATICSAVE_MSG');
                } else {
                    messageService.showMessage('Return Saved', 'info', 'SAVE_RETURN_RETURNSAVE_MSG');
                    //Re initialize auto interval
                    initSaveReturnInterval();
                    if ($scope.client.packageName == '1040' && $scope.taxYear === '2018') {
                        returnService.clientPortalcheck().then(function (res) {
                            var showSignature = res.data.data;
                            // if (showSignature == true) {
                            $rootScope.$broadcast('refreshMyTaxPortal');
                            // }
                        });
                    }
                    //set Confirmation to save flag false as return is saved
                    askForSaveConfirmation = false;
                }
                //set Confirmation to save flag false as return is saved
                isReturnChangedForAutoSave = false;
            }, function (error) {
                $log.error(error);
                //Write Toast Message here to notify user about error in save and return is not saved
            });
        };

        //This function will close return
        //Note: Currently it will redirect to dashboard page, but later we have to track user's history and redirect on last page before opening return workspace
        var closeReturn = function (saveBeforeClose) {
            var deferred = $q.defer();
            //Note :- we have to set the returnMode in header object of taxReturn if user save return while closing it
            if (saveBeforeClose == true) {
                returnService.setValueToHeader('returnMode', $scope.returnMode);
            }
            //call return-service to destroy current taxReturn object
            //Note: pass true to save return before close
            returnService.closeReturn(saveBeforeClose).then(function (success) {
                //Toast info message regarding close of return
                messageService.showMessage('Return Closed', 'info', 'CLOSE_RETURN_RETURNCLOSE_MSG');
                deferred.resolve("success");
            }, function (error) {
                messageService.showMessage('Error while closing return', 'error', 'CLOSE_RETURN_ERRORCLOSINGRETURN_MSG');
                deferred.reject(error);
            });
            return deferred.promise;
        };

        //This function will change return status (In Preocess, Finished, etc..)
        $scope.changeReturnStatus = function (status) {
            //call return-service
            returnService.changeReturnStatus(status).then(function (response) {
                //Update List
                _.forEach($scope.returnStatus, function (retStatus) {
                    if (retStatus.id == status.id) {
                        retStatus.isSelected = true;
                    } else {
                        retStatus.isSelected = false;
                    }
                });

                //Toast success Message
                messageService.showMessage('Status Changed Successfully', 'success', 'STATUS_CHANGE_STATUSCHANGE_MSG');
            }, function (error) {
                //Toast success Message
                messageService.showMessage('Unable to change status', 'error', 'STATUS_CHANGE_STATUSCHANGE_ERROR');
            });
        };

        //open dialog with all custom status.
        $scope.openCustomStatusDialog = function () {
            var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/common/partials/customReturnStatusDialog.html", "customReturnStatusDialogController");

            dialog.result.then(function (customStatus) {
                //reinitialize array
                $scope.returnStatus = returnService.getReturnStatusList();
            }, function (canceled) {
                console.info("canceled");
            });
        };

        //This function is written to toggle ERC Panel in bottom.
        //Note: It should not be required to write function to just change value. However, when implementing found this strange behaviour that changing value directly on ng-click not reflecting on condition for collapse
        $scope.toggleERCPanel = function (flagValue) {
            $scope.performReviewFlag = flagValue;
            $scope.bottomPanelFlag = flagValue;
            if (flagValue == true) {
                $scope.eFileRejectionFlag = false;
                $scope.eFileBankRejectionFlag = false;
                $scope.eFileAlertFlag = false;
            }
        };


        $scope.toggleErrorPanel = function (flagValue) {
            //variable for showing rejection error list
            $scope.currentEfileStatus = '';
            //get efileStatus object
            var efileStatus = returnService.getEfileStatus();
            _.forEach(efileStatus, function (val, key) {
                _.forEach(val, function (subType, subKey) {
                    if (subType.status == 8) {
                        $scope.currentEfileStatus = subType.status;
                    }
                });
            });

            $scope.eFileRejectionFlag = flagValue;
            $scope.bottomPanelFlag = flagValue;
            if (flagValue == true) {
                $scope.performReviewFlag = false;
                $scope.eFileBankRejectionFlag = false;
                $scope.eFileAlertFlag = false;
            }
        };

        $scope.toggleBankErrorPanel = function (flagValue) {
            //varable for showing bank rejection error list
            $scope.currentBankEfileStatus = '';
            //get efileStatus object
            var efileStatus = returnService.getEfileStatus();
            _.forEach(efileStatus, function (val, key) {
                _.forEach(val, function (subType, subKey) {
                    if (subType.status == 14) {
                        $scope.currentBankEfileStatus = subType.status;
                    }
                });
            });

            $scope.eFileBankRejectionFlag = flagValue;
            $scope.bottomPanelFlag = flagValue;
            if (flagValue == true) {
                $scope.performReviewFlag = false;
                $scope.eFileRejectionFlag = false;
                $scope.eFileAlertFlag = false;
            }
        };

        $scope.toggleAlertPanel = function (flagValue) {
            //variable for showing rejection error list
            $scope.currentEfileStatus = '';
            //get efileStatus object
            var efileStatus = returnService.getEfileStatus();
            _.forEach(efileStatus, function (val, key) {
                _.forEach(val, function (subType, subKey) {
                    if (subType.status == 9 || subType.status == 8) {
                        $scope.currentEfileStatus = subType.status;
                    }
                });
            });

            $scope.eFileAlertFlag = flagValue;
            $scope.bottomPanelFlag = flagValue;
            if (flagValue == true) {
                $scope.eFileRejectionFlag = false;
                $scope.performReviewFlag = false;
                $scope.eFileBankRejectionFlag = false;
            }
        }

        //Invpke recalculation of retun.
        $scope.recalcReturn = function () {
            //Enable Text loading animation
            $scope.isRecalculateReturn = true;
            returnService.recalcReturn();
        };

        //This Function is used to open send return to support dialog
        $scope.openSendReturntoSupportDialog = function () {
            //close toggle menu
            $scope.toolsToogle = { isOpen: false };
            //prompt for asking user to save return if there is changes 
            _promptToSaveBeforePrinting('sendReturnToSupport').then(function (result) {
                if (result === 'success') {
                    $scope.performReviewFlag = true;
                    $scope.performReview();
                    var TPData = returnService.getSendReturnToSupportData();
                    TPData.returnId = $routeParams.id;
                    //open dialog for send return to support
                    dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' }, "taxAppJs/return/workspace/partials/dialog/sendReturnToSupportDialog.html", "sendReturnToSupportDialogController", TPData);
                }
            }, function (error) {
                $log.error(error);
            });
        }

        $scope.stateConfigFromStatic = contentService.loadReturnTypeJson("returnType" + $scope.taxYear);
        $scope.returnTypeFormsConfig = contentService.loadReturnTypeJson("returnTypeForms_" + $scope.taxYear);
        $scope.stateOnlyConfig = contentService.loadReturnTypeJson("stateOnly");
        $scope.forceStateOnlyConfig = contentService.loadReturnTypeJson('forcedStateOnly2018')

        var getReturnTypeDataObject = function (packageName, state) {
            if (state == 'federal') {
                state = "Federal";
            } else {
                state = state.toUpperCase();
            }

            if (packageName == '1120') {
                packageName = "1120C";
            } else {
                packageName = packageName.toUpperCase();
            }

            var retunrnTypeStingifyjson = JSON.parse(JSON.stringify($scope.stateConfigFromStatic.$$state.value));
            var returnTypesArray = [];
            var objectFromAnyPackage = retunrnTypeStingifyjson[packageName][state];
            var objectFromCommon = retunrnTypeStingifyjson['Common'][state];
            if (objectFromAnyPackage != undefined) {
                for (var i in objectFromAnyPackage) {
                    returnTypesArray.push(objectFromAnyPackage[i])
                }
            }
            if (objectFromCommon != undefined) {
                for (var i in objectFromCommon) {
                    returnTypesArray.push(objectFromCommon[i])
                }
            }
            return returnTypesArray;
        }

        /*
        **This Function is used to get return type wise forms(which will send with created efile)
        */
        var getReturnTypeForms = function (state, returnType, activeFormsFormsOfAnyState, activeFormFormAnyStateObject) {
            //get config 
            var returnTypeFormsConfig = JSON.parse(JSON.stringify($scope.returnTypeFormsConfig.$$state.value));
            //get value from returnTypeForms config
            var activeFormsFromXML = returnTypeFormsConfig[$scope.client.packageName][state.toLowerCase()];
            if (activeFormsFromXML != undefined) {
                activeFormsFromXML = activeFormsFromXML[returnType];
            }
            //get common froms from active forms and returnTypeForms
            var activeFormSendToForEfile = _.intersection(activeFormsFromXML, activeFormsFormsOfAnyState);
            var activeFormsDisplayName = [];
            //get displayName from docName(for display perpose)
            for (var i = 0; i < activeFormSendToForEfile.length; i++) {
                var object = _.find(activeFormFormAnyStateObject, { "docName": activeFormSendToForEfile[i] });
                if (object != undefined) {
                    activeFormsDisplayName.push(object.extendedProperties.displayName);
                }
            }
            return activeFormsDisplayName;
        }

        /**
          * This function will prepare and  return States/Return types that need to be displayed in dialog
          */
        var prepareReturnTypesToDisplayForEfiling = function (type) {
            //get returnTypes array for federal
            var federalReturnTypeConfig = getReturnTypeDataObject($scope.client.packageName, 'federal')
            //get all active forms
            var allActiveForms = _getActiveForms();
            //get federal active forms
            var activeFormsFederal = $filter('stateFilter')(allActiveForms, 'federal');
            //holds federal forms to display in dialog user view purpose
            var filterFederalActiveForms = [];
            //docIndex for ERC  to find out statement docIndex
            var filterFederalActiveFormsDocIndex = [];
            _.forEach(activeFormsFederal, function (obj) {
                if (obj.docName != "dEPSBankApp" && obj.docName != "dAtlasBankApp" && obj.docName != "dTPGBankApp" && obj.docName != "dRefundAdvantageBankApp") {
                    filterFederalActiveForms.push(obj.docName);
                    filterFederalActiveFormsDocIndex.push(obj.docIndex);
                }
            });

            //get docName of statement to perform particular Statement ERC
            var statementDocNames = returnService.getStatementDocIndex(filterFederalActiveFormsDocIndex);
            //merge statement DocsName with for DocName
            filterFederalActiveForms = filterFederalActiveForms.concat(statementDocNames);


            var stateToDisplay = [];
            //returnType configLoop
            _.forEach(federalReturnTypeConfig, function (form) {
                //find active form from federal active form using federalReturnTypeConfig
                var obj = _.find(activeFormsFederal, { "docName": form.ActiveForm });

                //if available
                if (obj != undefined && obj.docName != "dEPSBankApp" && obj.docName != "dAtlasBankApp" && obj.docName != "dTPGBankApp" && obj.docName != "dRefundAdvantageBankApp") {
                    //get check box value if avilable
                    var formData = returnService.getDoc(obj.docName);

                    if (formData != undefined && formData[obj.docIndex].returnTypeForEfile != undefined && formData[obj.docIndex].returnTypeForEfile.value == "Amended") {
                        form.originalReturnType = form.ReturnTypeCode;
                        if (form.ReturnTypeCode != '' && form.ReturnTypeCode != undefined && form.ReturnTypeCode != null) {
                            form.ReturnTypeCode = form.ReturnTypeCode + "Amended";
                        }
                        form.ReturnTypeCategory = "AmendedForm";
                        form.ReturnTypeDisplayText = "Amended " + form.ReturnTypeDisplayText;
                    }
                    //get returnType activeForms 
                    var activeFormsData = getReturnTypeForms('federal', form.ReturnTypeCode, filterFederalActiveForms, activeFormsFederal);
                    //add in array for displaying in dilaog
                    stateToDisplay.push(Object.assign(form, obj, { fedRefund: $scope.formTree.fedRefund, fedOwe: $scope.formTree.fedOwe, fedBIS: $scope.formTree.fedBIS, name: "federal", activeForms: activeFormsData, activeFormsDocNames: filterFederalActiveForms }));
                }
            });

            //get added states
            var addedStates = returnService.getAddedStates();
            _.forEach(addedStates, function (state) {
                //get return type config for state 
                var stateReturnTypeConfig = getReturnTypeDataObject($scope.client.packageName, state.name);
                if (stateReturnTypeConfig != undefined) {
                    stateReturnTypeConfig = JSON.parse(JSON.stringify(stateReturnTypeConfig));
                }
                //get active form of particular state
                var activeFormsStates = $filter('stateFilter')(allActiveForms, state.name);
                var activesFormsNames = [];
                var activeFormsDocIndex = [];
                //reetrive ony display names
                _.forEach(activeFormsStates, function (obj) {
                    activesFormsNames.push(obj.docName);
                    activeFormsDocIndex.push(obj.docIndex);
                });

                //get docName of statement to perform particular Statement ERC
                var statementDocNamesForState = returnService.getStatementDocIndex(activeFormsDocIndex);
                //merge statement DocsName with for DocName
                activesFormsNames = activesFormsNames.concat(statementDocNamesForState);


                //state config loop
                var ohstate = true;
                _.forEach(stateReturnTypeConfig, function (form) {
                    //find active form from state from state active form using stateReturnTypeConfig
                    var obj = _.find(activeFormsStates, { "docName": form.ActiveForm });
                    //if available
                    if (obj != undefined) {
                        //get check box value if avilable
                        var formData = returnService.getDoc(obj.docName);
                        //special case for state oh (we have one form and two return types so based on calculation we are getting return type here)
                        if (ohstate == true && $scope.client.packageName == "1040" && state.name.toLowerCase() == 'oh' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            ohstate = false;
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if ($scope.client.packageName == "1040" && (state.name.toLowerCase() == 'ct') && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if (state.name.toLowerCase() == 'nh' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if (($scope.client.packageName == "1065" || $scope.client.packageName == "1120s") && (state.name.toLowerCase() == 'co') && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if (($scope.client.packageName == "1065" || $scope.client.packageName == "1040" || $scope.client.packageName == "1041" || $scope.client.packageName == "1120s" || $scope.client.packageName == "1120") && (state.name.toLowerCase() == 'pa') && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if (($scope.client.packageName == "1065" || $scope.client.packageName == "1120s") && state.name.toLowerCase() == 'md' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if ($scope.client.packageName == "1041" && state.name.toLowerCase() == 'ma' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if ($scope.client.packageName == "1040" && state.name.toLowerCase() == 'mi' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if ($scope.client.packageName == "1065" && state.name.toLowerCase() == 'ca' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if (($scope.client.packageName == "1065" || $scope.client.packageName == "1041" || $scope.client.packageName == "1040") && state.name.toLowerCase() == 'ky' && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                        } else if ($scope.client.packageName == "1040" && (state.name.toLowerCase() == 'ny') && (form.ReturnTypeCode == '' || form.ReturnTypeCode == undefined)) {
                            if (formData != undefined && formData[obj.docIndex].returnTypeCode != undefined && formData[obj.docIndex].returnTypeCode.value != undefined) {
                                form.ReturnTypeCode = formData[obj.docIndex].returnTypeCode.value;
                            }
                            if (formData != undefined && formData[obj.docIndex].vReturnType1 != undefined && formData[obj.docIndex].vReturnType1.value != undefined) {
                                var returnTypeVaucher1 = formData[obj.docIndex].vReturnType1.value;
                            }
                            if (formData != undefined && formData[obj.docIndex].vReturnType2 != undefined && formData[obj.docIndex].vReturnType2.value != undefined) {
                                var returnTypeVaucher2 = formData[obj.docIndex].vReturnType2.value;
                            }
                            if (formData != undefined && formData[obj.docIndex].vReturnType3 != undefined && formData[obj.docIndex].vReturnType3.value != undefined) {
                                var returnTypeVaucher3 = formData[obj.docIndex].vReturnType3.value;
                            }
                        }
                        if (formData != undefined && formData[obj.docIndex].returnTypeForEfile != undefined && formData[obj.docIndex].returnTypeForEfile.value == "Amended") {
                            form.originalReturnType = form.ReturnTypeCode;
                            if (form.ReturnTypeCode != '' && form.ReturnTypeCode != undefined && form.ReturnTypeCode != null) {
                                form.ReturnTypeCode = form.ReturnTypeCode + "Amended";
                            }
                            form.ReturnTypeCategory = "AmendedForm";
                            form.ReturnTypeDisplayText = "Amended " + form.ReturnTypeDisplayText;
                        }

                        //get state only flag
                        $scope.stateConfig = JSON.parse(JSON.stringify($scope.stateOnlyConfig.$$state.value));
                        var returnTypeStateOnlyConfigObjOfPackageName = $scope.stateConfig[$scope.client.packageName];
                        if (returnTypeStateOnlyConfigObjOfPackageName) {
                            var returnTypeStateOnlyConfigObjOfStates = returnTypeStateOnlyConfigObjOfPackageName[state.name.toLowerCase()];
                        }
                        if (returnTypeStateOnlyConfigObjOfStates) {
                            var getStateOnlyFlagBasedONReturnType = returnTypeStateOnlyConfigObjOfStates[form.ReturnTypeCode];
                        }
                        if (getStateOnlyFlagBasedONReturnType != undefined) {
                            obj.stateOnly = getStateOnlyFlagBasedONReturnType.stateOnly;
                        }

                        //force state only flag add to specific return type if available
                        //get state only flag
                        $scope.forceStateConfig = JSON.parse(JSON.stringify($scope.forceStateOnlyConfig.$$state.value));
                        var returnTypeForceStateOnlyConfigObjOfPackageName = $scope.forceStateConfig[$scope.client.packageName];
                        if (returnTypeForceStateOnlyConfigObjOfPackageName) {
                            var forceStateOnlyConfigObjOfStates = returnTypeForceStateOnlyConfigObjOfPackageName[state.name.toUpperCase()];
                            if (forceStateOnlyConfigObjOfStates != undefined) {
                                var getForceStateOnlyFlagBasedONReturnType = forceStateOnlyConfigObjOfStates[form.ReturnTypeCode];
                            }
                            if (getForceStateOnlyFlagBasedONReturnType != undefined) {
                                obj.forceStateOnly = true;
                            }
                        }

                        //get return type active forms
                        var activeFormsData = getReturnTypeForms(state.name, form.ReturnTypeCode, activesFormsNames, activeFormsStates);
                        //push data to display in dialog
                        if (form.ReturnTypeCode != '' && form.ReturnTypeCode != undefined && form.ReturnTypeCode != null) {
                            //add in array for displaying in dilaog
                            stateToDisplay.push(Object.assign(JSON.parse(JSON.stringify(form)), obj, state, { activeForms: activeFormsData }, { activeFormsDocNames: activesFormsNames }));
                        }

                        //ny 1040 ny speacil case  vaucher
                        if (!_.isEmpty(returnTypeVaucher1)) {
                            //add in array for displaying in dilaog
                            form.ReturnTypeCode = returnTypeVaucher1;
                            form.ReturnTypeDisplayText = "NY 2105 Voucher 2";
                            stateToDisplay.push(Object.assign(JSON.parse(JSON.stringify(form)), obj, state, { activeForms: activeFormsData }, { activeFormsDocNames: activesFormsNames }));
                        }
                        if (!_.isEmpty(returnTypeVaucher2)) {
                            //add in array for displaying in dilaog
                            form.ReturnTypeCode = returnTypeVaucher2;
                            form.ReturnTypeDisplayText = "NY 2105 Voucher 3";
                            stateToDisplay.push(Object.assign(JSON.parse(JSON.stringify(form)), obj, state, { activeForms: activeFormsData }, { activeFormsDocNames: activesFormsNames }));
                        }
                        if (!_.isEmpty(returnTypeVaucher3)) {
                            //add in array for displaying in dilaog
                            form.ReturnTypeCode = returnTypeVaucher3;
                            form.ReturnTypeDisplayText = "NY 2105 Voucher 4";
                            stateToDisplay.push(Object.assign(JSON.parse(JSON.stringify(form)), obj, state, { activeForms: activeFormsData }, { activeFormsDocNames: activesFormsNames }));
                        }
                    }
                });

            });
            //check for bank
            if ($scope.client.packageName == "1040") {
                //check if any main form of fdereal is active
                var isExistFormTypeForBankSelection = activeFormsFederal.filter(function (form) {
                    if (form.docName == "d1040" || form.docName == "d1040A" || form.docName == "d1040SS" || form.docName == "d1040NR" || form.docName == "d1040EZ") {
                        return form;
                    }
                    return undefined;
                });
                //if fereral main form is active
                if (!_.isUndefined(isExistFormTypeForBankSelection) && !_.isEmpty(isExistFormTypeForBankSelection)) {
                    //loop on federal active forms
                    _.forEach(activeFormsFederal, function (form) {
                        //check if any bank form is available in active form list // form.docName == "dAtlasBankApp" remove for live release
                        if (form.docName == "dEPSBankApp" || form.docName == "dTPGBankApp" || form.docName == "dRefundAdvantageBankApp" || form.docName == "dAtlasBankApp") {
                            //get selected bank name(selected in efile summery)
                            var bankObject = returnService.getSelectedBankData();
                            //get return type config of bank
                            var bankReturnTypeConfig = getReturnTypeDataObject($scope.client.packageName, 'federal');
                            var bankDataFromReturnConfig = _.find(bankReturnTypeConfig, { ReturnTypeCode: bankObject.name });

                            //For Pre Ack
                            var formData = returnService.getDoc(form.docName);
                            var bankSelected = returnService.getElementValue('strbank', 'dReturnInfo');
                            //check is return is paper filed
                            var returnPaperFiledElement = returnService.getElementValue('blnPinY', 'dReturnInfo');
                            var isPaperFiledReturn = false;
                            if($scope.betaOnly() == true && returnPaperFiledElement && returnPaperFiledElement == '2'){
                                isPaperFiledReturn = true;
                            }
                            // var preAck;
                            // if (formData != undefined && formData[form.docIndex].preAck != undefined && formData[form.docIndex].preAck.value != undefined && formData[form.docIndex].preAck.value == true) {
                            //     preAck = true;
                            // }
                            if (bankDataFromReturnConfig != undefined) {
                                //add in array for displaying in dilaog
                                stateToDisplay.push(Object.assign({ name: bankObject.name }, { ReturnTypeCode: bankDataFromReturnConfig.ReturnTypeCode, ReturnTypeCategory: bankDataFromReturnConfig.ReturnTypeCategory, ReturnTypeDisplayText: bankDataFromReturnConfig.ReturnTypeDisplayText, State: bankDataFromReturnConfig.State }, { activeForms: [form.extendedProperties.displayName] }, { activeFormsDocNames: [form.docName] }, { bankSelected: bankSelected , isPaperFiledReturn:isPaperFiledReturn}));
                            }
                        }
                    });
                }

                if (returnService.isProtctionPlusAvailable() == true) {
                    stateToDisplay.push({ name: 'protectionplus', ReturnTypeCode: 'protectionplus', ReturnTypeCategory: 'BankForm', ReturnTypeDisplayText: "Protection Plus", refund: 0 })
                }
            }

            return stateToDisplay;
        }

        /**
         * This function is used to get xml from mef 
         */
        $scope.getXML = function () {
            ////get return type
            var stateToDisplay = prepareReturnTypesToDisplayForEfiling('createXML');
            if (stateToDisplay.length == 0) {
                var text = localeService.translate("Please Active any main form to generate XML file.").then(function (translatedText) {
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                });
            } else {
                //open diloaf for efile selection
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                    "taxAppJs/return/workspace/partials/dialog/createXMLForReturn.html", "advanceEfileDialogController", { "states": stateToDisplay, "efileStatus": {}, 'taxYear': $scope.taxYear });
                // ELSE proceed further
                dialog.result.then(function (response) {
                    if (response != undefined) {
                        var docNames = [];
                        _.forEach(response.selectedStates, function (state) {
                            _.forEach(state.activeFormsDocNames, function (form) {
                                docNames.push(form);
                            });
                        });
                        $scope.performReviewFlag = true;
                        $scope.bottomPanelFlag = true;
                        $scope.eFileRejectionFlag = false
                        $scope.eFileBankRejectionFlag = false
                        performBeforeEfile(response.selectedStates, docNames, 'createXML')
                    }
                }, function (btn) {
                    //on close or cancel			
                });
            }
        }


        //get vailable states and forms
        $scope.getStateToDisplay = function (type) {
            //get return type
            var stateToDisplay = prepareReturnTypesToDisplayForEfiling();
            //get efile status object
            var efileObject = returnService.getEfileStatus();

            //check is federal extension or federal was accepted
            var federalObjMain = _.find(efileObject.federal, { "returnTypeCategory": "MainForm" });
            var federalObjExt = _.find(efileObject.federal, { "returnTypeCategory": "ExtensionForm" });
            if (federalObjMain != undefined || federalObjExt != undefined) {
                _.forEach(stateToDisplay, function (state) {
                    if (federalObjMain != undefined && state.returnType == federalObjMain.returnType && (federalObjMain.status == 1 || federalObjMain.status == 3 || federalObjMain.status == 5 || federalObjMain.status == 7 || federalObjMain.status == 9)) {
                        state.isDisabled = true;
                        state.isSelected = true;
                    } else {
                        state.isDisabled = false;
                        state.isSelected = false;
                    }

                    if (federalObjExt != undefined && state.returnType == federalObjExt.returnType && (federalObjExt.status == 1 || federalObjExt.status == 3 || federalObjExt.status == 5 || federalObjExt.status == 7 || federalObjExt.status == 9)) {
                        if (state.returnTypeCategory == "ExtensionForm") {
                            state.isDisabled = false;
                            state.isSelected = false;
                        } else {
                            state.isDisabled = true;
                            state.isSelected = false;
                        }
                    }
                });
            }


            //add already accepted states for displaying in advance efile dialog
            _.forEach(efileObject, function (state, key) {
                _.forEach(state, function (subState, subKey) {
                    //check is returntype is available in stateToDisplay and efileObject
                    var findObjectInstateToDisplay = stateToDisplay.find(function (obj) {
                        if (obj.State && obj.ReturnTypeCode) {
                            return obj.State.toLowerCase() == key && obj.ReturnTypeCode == subState.returnType;
                        }
                    });
                    //if available then merge status only for display purpose in dialog
                    if (findObjectInstateToDisplay != undefined) {
                        if (subState.status == 9 || subState.status == 17 || subState.status == 15 || subState.status == 19) {
                            findObjectInstateToDisplay.status = "Accepted";
                            findObjectInstateToDisplay.isSelected = true;
                            findObjectInstateToDisplay.isDisabled = true;
                        } else if (subState.status == 11 || subState.status == 13 || subState.status == 18) {
                            findObjectInstateToDisplay.status = "Transmitted";
                            findObjectInstateToDisplay.isSelected = true;
                            findObjectInstateToDisplay.isDisabled = true;
                        } else if (subState.status == 10) {
                            findObjectInstateToDisplay.status = "Waiting For Acceptence";
                            findObjectInstateToDisplay.isSelected = true;
                            findObjectInstateToDisplay.isDisabled = false;
                        } else if (subState.status == 8 || subState.status == 14) {
                            findObjectInstateToDisplay.status = "Rejected";
                        } else if (subState.status == 1 || subState.status == 3 || subState.status == 5) {
                            findObjectInstateToDisplay.status = "Transmitted";
                            findObjectInstateToDisplay.isSelected = true;
                            findObjectInstateToDisplay.isDisabled = true;
                        } else if (key == 'federal' && subState.status == 7) {
                            findObjectInstateToDisplay.status = "At IRS";
                            findObjectInstateToDisplay.isSelected = true;
                            findObjectInstateToDisplay.isDisabled = true;
                        } else if (key != 'federal' && subState.status == 7) {
                            findObjectInstateToDisplay.status = "At State";
                            findObjectInstateToDisplay.isSelected = true;
                            findObjectInstateToDisplay.isDisabled = true;
                        }
                    } else if (findObjectInstateToDisplay == undefined && subState.status == 9) {//if not available stateTpDisplay and available in efileObject then add whole object for display purpose
                        stateToDisplay.push({ name: key, State: key, ReturnTypeDisplayText: subState.returnTypeDisplayText, ReturnTypeCategory: subState.returnTypeCategory, activeForms: subState.activeForms, ReturnTypeCode: subState.returnType, status: "Accepted", isDisabled: true, isSelected: true });
                    }
                });
            });

            //for previous taxYear because extension type and amnded type in not supported for efile
            if (parseInt($scope.taxYear) <= 2017) {
                _.forEach(stateToDisplay, function (state) {
                    if (state.ReturnTypeCategory !== 'MainForm') {
                        state.isDisabled = true;
                    }
                    if ($scope.client.packageName == '990' && state.name == 'federal' && state.ReturnTypeCategory == 'ExtensionForm') {
                        state.isDisabled = false;
                    }
                });
            }

            //add attachment data
            var docList = documentsService.returnFilteredDocList($routeParams.id);
            _.forEach(stateToDisplay, function (state) {
                // for pdf attachments
                var stateWiseDocList = [];
                _.forEach(state.activeFormsDocNames, function (docName) {
                    var filteredFormDocList = _.filter(docList, { "docName": docName });
                    if (filteredFormDocList != undefined && filteredFormDocList.length > 0) {
                        var formData = contentService.getFormPropFromDoc(docName);
                        stateWiseDocList.push({ filteredFormDocList: filteredFormDocList, displayName: formData.displayName });
                    }
                });
                state.attachmentList = stateWiseDocList;

                if ($scope.betaOnly() === true) {
                    // to prepare data for k1s to display for transmit returns
                    if (state.State && state.PackageName && state.ReturnTypeCategory !== "BankForm") {
                        var k1s = systemConfig.getStateAndPackageWiseK1s(state.State.toUpperCase(), state.PackageName.toUpperCase());
                        if (k1s && k1s.length > 0) {
                            var stateWiseActiveK1s = [];
                            _.forEach(k1s, function (docObj) {
                                var docWiseActiveK1s = returnService.getActiveK1sFromDocName(docObj);
                                if (docWiseActiveK1s && docWiseActiveK1s.length > 0) {
                                    stateWiseActiveK1s = stateWiseActiveK1s.concat(docWiseActiveK1s);
                                }
                            })
                            state.listOfActiveK1s = stateWiseActiveK1s;
                        }
                    }
                }
            });

            //open dialog
            if (type == 'advanceEfile') {
                if (stateToDisplay.length == 0) {
                    var text = localeService.translate("Please Active any main form to Create Efile.").then(function (translatedText) {
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                    });
                } else {
                    //open diloaf for efile selection
                    var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                        "taxAppJs/return/workspace/partials/dialog/advanceEfileDialog.html", "advanceEfileDialogController", { "states": stateToDisplay, "efileStatus": {}, taxYear: $scope.taxYear });
                    // ELSE proceed further
                    dialog.result.then(function (response) {
                        if (response != undefined) {
                            var docNames = [];
                            var preAckAvailable;
                            _.forEach(response.selectedStates, function (state) {
                                // //For Pre Ack
                                // if (state.preAck == true) {
                                //     preAckAvailable = true;
                                // }
                                if (_performReviewRules[$scope.client.packageName] != undefined && _performReviewRules[$scope.client.packageName][state.name] != undefined) {
                                    var performReviewRule = _.find(_performReviewRules[$scope.client.packageName][state.name], function (item) {
                                        if (item.activeForm != undefined && state.activeFormsDocNames.indexOf(item.activeForm) != -1) {
                                            return item;
                                        }
                                    });
                                    if (performReviewRule != undefined) {
                                        if (performReviewRule.allowedForms != undefined && performReviewRule.allowedForms.length > 0) {
                                            state.activeFormsDocNames = performReviewRule.allowedForms;
                                        }
                                        if (performReviewRule.ignoreForms != undefined && performReviewRule.ignoreForms.length > 0) {
                                            state.activeFormsDocNames = _.difference(state.activeFormsDocNames, performReviewRule.ignoreForms)
                                        }
                                    }
                                }

                                //if efile is stateonly then required client information sheet data and efile summery data
                                if (state.stateOnly == true && (federalObjMain == undefined || federalObjMain.status != 9)) {
                                    if ($scope.client.packageName == '1040') {
                                        state.activeFormsDocNames.push('dReturnInfo');
                                        state.activeFormsDocNames.push('dMainInfo');
                                    } else if ($scope.client.packageName == '1065') {
                                        state.activeFormsDocNames.push('d1065RIS');
                                        state.activeFormsDocNames.push('d1065CIS');
                                    } else if ($scope.client.packageName == '1120') {
                                        state.activeFormsDocNames.push('d1120CRIS');
                                        state.activeFormsDocNames.push('d1120CCIS');
                                    } else if ($scope.client.packageName == '1120s') {
                                        state.activeFormsDocNames.push('d1120SRIS');
                                        state.activeFormsDocNames.push('d1120SCIS');
                                    } else if ($scope.client.packageName == '1041') {
                                        state.activeFormsDocNames.push('d1041RIS');
                                        state.activeFormsDocNames.push('d1041CIS');
                                    } else if ($scope.client.packageName == '990') {
                                        state.activeFormsDocNames.push('d990RIS');
                                        state.activeFormsDocNames.push('d990CIS');
                                    }
                                }

                                _.forEach(state.activeFormsDocNames, function (form) {
                                    //do not include docs if it is already included
                                    if (docNames.includes(form) == false) {
                                        docNames.push(form);
                                    }
                                });

                            });
                            // if (preAckAvailable) {
                            //     var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                            //     localeService.translate("You are submitting Pre-Acknolwegement bank application, Once Pre-Acknolwegement Bank Application is submitted then your return will be locked and we will submit this information to IRS. Afterwards you will not be able to do any changes on the return.<br>" +
                            //         "Are you sure you want to submit the application?", "RETUTNCONTROLLER_DOYOUWANTTOSPLITRETURN").then(function (translatedText) {
                            //             var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translatedText });
                            //             dialog.result.then(function (btn) {
                            //                 //success
                            //                 if (response.selectedStates.length > 0) {
                            //                     $scope.performReviewFlag = true;
                            //                     $scope.bottomPanelFlag = true;
                            //                     $scope.eFileRejectionFlag = false
                            //                     $scope.eFileBankRejectionFlag = false
                            //                     performBeforeEfile(response.selectedStates, docNames, undefined, response.stateOnly ? true : false);
                            //                 }
                            //             }, function (btn) {
                            //                 //cancel or close
                            //             });
                            //         });
                            // } else {
                            if (response.selectedStates.length > 0) {
                                $scope.performReviewFlag = true;
                                $scope.bottomPanelFlag = true;
                                $scope.eFileRejectionFlag = false
                                $scope.eFileBankRejectionFlag = false
                                performBeforeEfile(response.selectedStates, docNames, undefined, response.stateOnly ? true : false);
                            }
                        }
                        //}
                    }, function (btn) {
                        //on close or cancel			
                    });
                }
            } else {
                var sendAllPossibleStates = [];
                _.forEach(stateToDisplay, function (state) {
                    if (state.status !== 'Accepted') {
                        sendAllPossibleStates.push(state);
                    }
                });
                performBeforeEfile(sendAllPossibleStates);
            }

        }

        //This function will tell server to transmit efile.
        //Note: We are saving this return before calling efile api to have updated return on server.
        $scope.sendEfile = function (selectedStates, sendEfile) {
            //  //For Pre Ack
            // _.forEach(selectedStates, function (state) {
            //     if (state.preAck == true) {
            //         returnService.savePreAckInHeader();
            //     }
            // });
            if (returnService.getclientPortal() == true && returnService.getRemoteSignLocked() == true) {
                returnService.signatureUnLock().then(function () {
                    $scope.SignlockToggle.isRemoteSignLocked = returnService.setRemoteSignLocked(false);
                    $scope.sendEfileTo(selectedStates, sendEfile);
                });
            } else {
                //save return before efile
                returnService.saveReturn().then(function () {
                    $scope.sendEfileTo(selectedStates, sendEfile);
                }, function (error) {
                    $log.error(error);
                });
            }
        };

        $scope.sendEfileTo = function (selectedStates, sendEfile) {
            //To disable confirmation dialog as return is saved. (Change tracker)
            askForSaveConfirmation = false;
            //create efile
            /// check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified == true) {
                returnService.createEfileTosend(selectedStates, sendEfile).then(function (response) {
                    // mark islocked true
                    $scope.lockToggle.isLocked = returnService.setReturnLockFlag(true);

                    messageService.showMessage('Return submitted for Efile', 'success');
                    //get updated return list status
                    $scope.returnStatus = returnService.getReturnStatusList();

                    //for Pre Ack
                    //$scope.DisableUnlockButton();

                    //cancel auto save interval
                    if (angular.isDefined(autoSaveInterval)) {
                        $interval.cancel(autoSaveInterval);
                        autoSaveInterval = undefined;
                    }
                }, function (error) {
                    $log.error(error);
                });
            }
            else
                EmailVerification($scope.sendEfile);
        }
        /**
         * This function will check if there is any ERC pending with severity as 'Reject'.
         * And if found it will show warning message and display those ERC in erc panels.
         * Otherwise it just send e-file
         */
        $scope.checkAndEfile = function (type) {
            //check user is paid user or not
            // If not then promt user for subscription      
            if (userService.getLicenseValue('type') == 'ANNUAL') {
                // For More return type we need to write conditions here    
                if ($scope.client.packageName == "1040" || $scope.client.packageName == "1041" || $scope.client.packageName == "990") {
                    //Check if Individual efile is allowed (subscription bought)
                    if (userService.getLicenseValue('individual') == true) {
                        //Functions need to be performed before proceeding further
                        $scope.getStateToDisplay(type);
                    } else {
                        var obj = { "taxYear": $scope.taxYear, "package": "Individual" };
                        //open efile license dialog for individual
                        _openLicenseDialogforEfile(obj);
                    }
                } else if ($scope.client.packageName == "1065" || $scope.client.packageName == "1120" || $scope.client.packageName == "1120s") {
                    //Check if Business efile is allowed (subscription bought)
                    if (userService.getLicenseValue('business') == true) {
                        //Functions need to be performed before proceeding further
                        $scope.getStateToDisplay(type);
                    } else {
                        var obj = { "taxYear": $scope.taxYear, "package": "Business" }
                        //open efile license dialog for business
                        _openLicenseDialogforEfile(obj);
                    }
                } else {//Temporary condition If we introduce another package then 1040,1065,1120,1120s
                    var text = localeService.translate("Efile for this package will be available soon.").then(function (translatedText) {
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                    });
                }
            } else { //If user has Free license show dialog with upgrade button
                //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller              
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/subscriptionDialog.html", "subscriptionDialogController", { "bankProducts": false });
                dialog.result.then(function (btn) {
                    if ($scope.hasFeature('SUBSCRIPTION')) {
                        //Load user details
                        var userDetails = userService.getUserDetails();
                        //get master location details
                        if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
                            var masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
                            //Goto subscription page
                            subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
                        }
                    }
                }, function (btn) {
                    //cancel or close
                });
            }
        };

        /**
         * common function to open dialog about license of individual/business for perticular year. 
         * This dialog will come in case if use already have annual license for at least one year.
         */
        var _openLicenseDialogforEfile = function (obj) {
            //Show dialog to purchase business add-on or annual subscription
            //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller              
            var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/businessSubscriptionDialog.html", "subscriptionDialogController", obj);
            //First function is for success call (Buy Now/Change Subscription). This may change once we develope ability to purchase add on or change package in subscription app
            dialog.result.then(function (btn) {
                if ($scope.hasFeature('SUBSCRIPTION')) {
                    //Load user details
                    var userDetails = userService.getUserDetails();
                    //get master location details
                    if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
                        var masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
                        //Goto subscription page
                        subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
                    }
                }
            }, function (btn) {
                //cancel or close
            });
        };


        /**
         * 
         * this function show dialog of email verification if user email is not verified. 
         * 
         **/
        var EmailVerification = function (callback, arg1, arg2) {
            //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller			  
            var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/EmailVerificationDialog.html", "EmailVerificationDialogController");
            dialog.result.then(function (btn) {

                if (btn) {
                    // Set email verified flag to tru in local and UserService
                    userService.setEmailVerificationflag();
                    $scope.emailVerified = true;
                    //callback
                    callback(arg1, arg2);

                }

                //
            }, function (btn) {
                //cancel or close
            });
        };

        /**
	 * This function will perform steps required to be excuted before making efile.
	 * For example - checking ERC and if found show dialog with message and auto populate ERC panel if not visible
	 */
        var performBeforeEfile = function (selectedStates, docNames, type, stateOnly) {
            //Reset pending ERC flag to undefined.
            //Note: This is required to avoid cancelation of watcher, as we are cancelling watcher on true/false value.
            $scope.isRejectERCPending = undefined;
            //Invoke perform review
            $scope.performReview(false, docNames);
            //Put watcher on pending ERC flag
            var isRejectERCPendingWatcher = $scope.$watch('isRejectERCPending', function () {
                $log.debug('inside $scope.isRejectERCPending ' + $scope.isRejectERCPending);
                //If there is no ERC Pending
                if ($scope.isRejectERCPending == false) {
                    //Clear watcher put on ERC List		
                    isRejectERCPendingWatcher();
                    //Send Efile
                    //$scope.sendEfile();
                    //Disable E-File for 2017 in live
                    //check is preAck exist
                    // var bankOnj = _.find(selectedStates, { "ReturnTypeCategory": "BankForm" });
                    // if (bankOnj != undefined && bankOnj.preAck == true && (bankOnj.ReturnTypeCode == 'tpg' || bankOnj.ReturnTypeCode == 'eps' || bankOnj.ReturnTypeCode == 'refundadvantage') && $scope.client.packageName == '1040' && $scope.taxYear == '2018') {
                    //     //Send Efile
                    //     $scope.sendEfile(selectedStates, stateOnly);
                    // }else if($scope.betaOnly() == false && $scope.client.packageName != '1040' && $scope.taxYear == '2018'){
                    //     //Send Efile
                    //     $scope.sendEfile(selectedStates, stateOnly);
                    // } else
                    // else if ($scope.betaOnly() == false && $scope.taxYear == '2018') {
                    //     var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    //     localeService.translate("Tax returns E-filing will begin on January 2019.", 'EFILE_NEXTYEAR_NOTIFY').then(function (translatedText) {
                    //         var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                    //     });
                    // } 
                    if ($scope.betaOnly() == false && ($scope.taxYear == '2014' || $scope.taxYear == '2015')) {
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        localeService.translate("The IRS allows electronic filing for the current tax year, as well as two prior tax years. Electronic filing is no longer allowed for tax year 2015. Please paper file any remaining 2015 tax returns.", 'EFILE_PREVIOUSYEAR_NOTIFY').then(function (translatedText) {
                            var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                        });
                    } else {
                        if (type == 'createXML') {
                            returnService.getXML(selectedStates[0].name, selectedStates[0].ReturnTypeCode).then(function (response) {
                                if (response != undefined && response.efile != undefined && response.efile.xml != undefined) {
                                    //show message
                                    messageService.showMessage('Created XML Successfully', 'success', 'XML_CREATED_SUCCESS_MSG');
                                    var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                                        "taxAppJs/return/workspace/partials/dialog/showXML.html", "showXMLDialogController", { "xml": response.efile.xml, 'validationError': response.efile.validationError });
                                    dialog.result.then(function (buttonType) {
                                    });
                                }
                            }, function (error) {
                                $log.error(error);
                            });
                        } else {
                            //Send Efile
                            $scope.sendEfile(selectedStates, stateOnly);
                        }
                    }
                } else if ($scope.isRejectERCPending == true) {
                    //Clear watcher put on ERC List		
                    isRejectERCPendingWatcher();
                    if (type == 'createXML') {
                        //Attention Dialog
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        localeService.translate("There are errors in the return that need to be corrected before you can e-file. Please correct all validations displayed in red, with a Required type and Reject severity."
                            , 'RETURNCONTROLLER_SOMEERRORYOURRETURNPLZCORRECT').then(function (translatedText) {
                                var dialog = dialogService.openDialog("attention", dialogConfiguration, translatedText);
                                //If return has ERC Show bottom panel and ERC Grid				
                                $scope.performReviewFlag = true;
                                $scope.bottomPanelFlag = true;
                                $scope.eFileRejectionFlag = false
                                $scope.eFileBankRejectionFlag = false
                                $scope.eFileAlertFlag = false;
                                returnService.getXML(selectedStates[0].name, selectedStates[0].ReturnTypeCode).then(function (response) {
                                    if (response != undefined && response.efile != undefined && response.efile.xml != undefined) {
                                        //show message
                                        messageService.showMessage('Created XML Successfully', 'success', 'XML_CREATED_SUCCESS_MSG');
                                        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                                            "taxAppJs/return/workspace/partials/dialog/showXML.html", "showXMLDialogController", { "xml": response.efile.xml, 'validationError': response.efile.validationError });
                                        dialog.result.then(function (buttonType) {
                                        });
                                    }
                                }, function (error) {
                                    $log.error(error);
                                });
                            });

                    } else {
                        //Attention Dialog
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        localeService.translate("There are errors in the return that need to be corrected before you can e-file. Please correct all validations displayed in red, with a Required type and Reject severity.<br>" +
                            "<b>Notes:</b>" +
                            "<ul>" +
                            "<li>Any validation displayed as an “Override” are not required to be corrected for efiling however, we advise you to review the overridden entries to avoid IRS/State rejects.</ul>", 'RETURNCONTROLLER_SOMEERRORYOURRETURNPLZCORRECT').then(function (translatedText) {
                                var dialog = dialogService.openDialog("attention", dialogConfiguration, translatedText);
                                //If return has ERC Show bottom panel and ERC Grid				
                                $scope.performReviewFlag = true;
                                $scope.bottomPanelFlag = true;
                                $scope.eFileRejectionFlag = false
                                $scope.eFileBankRejectionFlag = false
                                $scope.eFileAlertFlag = false;
                            });

                    }
                }
            });
        };


        //created common function to ask user for save return or not before printing
        var _promptToSaveBeforePrinting = function (printingType) {
            var deferred = $q.defer();
            //if return is locked and user has unsaved data then open this dialog
            if (askForSaveConfirmation == true && $scope.lockToggle.isLocked == true && printingType != 'printBlankForm') {
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' },
                    "taxAppJs/return/workspace/partials/dialog/printLockedReturnMessageDialog.html", "printLockedReturnMessageDialogController", { "printingType": printingType });
                dialog.result.then(function (buttonType) {
                    if (buttonType == 'yes') {
                        deferred.resolve("success");
                    }
                });
            } else if (askForSaveConfirmation == true && (printingType == 'REQ_SIGN' || printingType == 'REVIEW_SIGN') && $scope.SignlockToggle.isRemoteSignLocked == true) {
                var dialogConfig = { "title": "Return is locked", "text": "You have made changes to the locked return. Please unlock the return and then save your changes.<br/> Please note that if you Unlock the return, the taxpayer’s Review or Remote Signature will be invalid for the current version of the return.You will have to send the updated return again for Review or Remote Signature" };
                var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
            } else if (askForSaveConfirmation == true && printingType != 'printBlankForm') {
                var confirmSize = 'sm';
                var dialogMsg = 'Do you want to save changes you made before printing?';
                if (printingType == 'sendReturnToSupport') {
                    dialogMsg = 'Do you want to save changes you made before send return to support?';
                    confirmSize = 'sm';
                } else if (printingType == 'REQ_SIGN') {
                    dialogMsg = 'To request the taxpayer’s remote signature, you must save the changes.  Do you want to Save and send the return for signature?';
                    confirmSize = 'md';
                } else if (printingType == 'REVIEW_SIGN') {
                    dialogMsg = 'Before sending the return for review, you must save the changes.  Do you want to Save and send the return for review?';
                    confirmSize = 'md';
                }

                // Ask to save return
                var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': confirmSize, 'windowClass': 'my-class' };
                localeService.translate(dialogMsg, 'RETURNCONTROLLER_DOYOUWANTTOSAVERETURNBEFOREPRINT').then(function (translatedText) {
                    var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translatedText });
                    dialog.result.then(function (btn) {
                        // save return 
                        returnService.saveReturn(false).then(function () {
                            //Write Toast Message here to notify user that return is saved successfully
                            //Note: Current implementation is promise pattern, but we may have to implement some kind of loader to stop user from interacting with form while saving
                            messageService.showMessage('Return Saved', 'info', 'SAVE_RETURN_RETURNSAVE_MSG');
                            //Re initialize auto interval
                            initSaveReturnInterval();
                            //set Confirmation to save flag false as return is saved
                            askForSaveConfirmation = false;
                            deferred.resolve("success");
                        }, function (error) {
                            //here we are promoting message with infinite time so whenever new error message come we are clear all previous message
                            messageService.clear();//to clear all previous toaster 
                            //Write Toast Message here to notify user about error in save and return is not saved
                            messageService.showMessage('Error while saving return. Please try again.', 'error', 'SAVE_RETURN_ERROR', 0);
                            deferred.reject(error);
                        });
                    }, function (btn) {
                        var retunVal = "success";
                        if (printingType == 'REQ_SIGN' || printingType == 'REVIEW_SIGN') {
                            retunVal = 'no'
                        }
                        if (btn == 'close') {
                            deferred.resolve(retunVal);
                        } else if (btn == 'no') {
                            deferred.resolve(retunVal);
                        }
                    });
                });
            } else {
                deferred.resolve("success");
            }
            return deferred.promise;
        };
        /**
	 * This function intiate printing of selected (single) form.
	 * We check whether return have changes or not,
	 * IF changes found then we ask user to save return before prining.
	 */
        $scope.printForm = function (form, printingType, isRetunUrl, isInBrowser) {

            var deferred = $q.defer();
            /// check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified != undefined && $scope.emailVerified == true) {
                //prompt for asking user to save return if there is changes 
                _promptToSaveBeforePrinting(printingType).then(function (result) {
                    if (result === 'success') {
                        //this function is return user requier Passwored Protected pdf or not 
                        _checkForPDFProtectedPreference().then(function (pdfPasswordDetails) {
                            //call function to update printing animation
                            showOrHidePrintingAnimation('request');

                            // call for barcode verification 
                            barcodeVerification([_currentForm]);

                            if(isInBrowser && $scope.betaOnly() && parseInt($scope.taxYear) > 2018) {
                                browserSidePrinting(form == undefined ? _currentForm : form, undefined, printingType, getWaterMark(), pdfPasswordDetails);
                            } else {
                                //If form is not passed as argument then use current form
                                returnService.printForm(form == undefined ? _currentForm : form, printingType, undefined, getWaterMark(), pdfPasswordDetails).then(function (url) {
                                    if (url != undefined) {
                                        if (isRetunUrl !== true) {
                                            $window.open(url, "_self");
                                        }
                                        deferred.resolve(url);
                                    } else {
                                        messageService.showMessage('Unable to print form', 'error', 'PRINT_FORM_ERROR', 0);
                                        deferred.reject(false);
                                    }
                                    //call function to update printing animation
                                    showOrHidePrintingAnimation('response');
                                }, function (error) {
                                    //call function to update printing animation
                                    showOrHidePrintingAnimation('response');
                                });
                            }
                        }, function (error) {
                            $log.error(error);
                            deferred.reject(false);
                        });
                    }
                }, function (error) {
                    $log.error(error);
                    deferred.reject(false);
                });
            } else {
                EmailVerification($scope.printForm, form, printingType);
            }
            return deferred.promise;
        };

        //Common function to print selecteDforms or completeReturns (all forms)
        var _printMultipleForms = function (formList, printingType) {
            //this function is return user requier Passwored Protected pdf or not 
            _checkForPDFProtectedPreference().then(function (pdfPasswordDetails) {
                //call function to update printing animation
                showOrHidePrintingAnimation('request');
                //docIndexes for printing
                var docIndexes = _.pluck(formList, 'docIndex');
                // List of form properties by looping on selected forms
                var formPropList = [];
                _.forEach(formList, function (form) {
                    //Used copy function to avoid accidental two way data binding
                    var formObj = angular.copy(returnService.getSingleAvailableForm(form.docName));
                    if (!_.isUndefined(formObj)) {
                        formPropList.push(formObj);
                    }
                });
                //Call service for printing
                returnService.printMultipleForms(formPropList, docIndexes, printingType, getWaterMark(), pdfPasswordDetails).then(function (url) {
                    if (url != undefined) {
                        $window.open(url, "_self");
                    } else {
                        messageService.showMessage('Unable to print form', 'error', 'PRINT_FORM_ERROR', 0);
                    }
                    //call function to update printing animation
                    showOrHidePrintingAnimation('response');
                }, function (error) {
                    //call function to update printing animation
                    showOrHidePrintingAnimation('response');
                });
            }, function (error) {
                $log.error(error);
            });
        };

        /**
         * This function is used to locked return
         */
        $scope.lockReturn = function () {
            //get efile status
            var efileObject = returnService.getEfileStatus();
            //check if return is already locked
            if ($scope.lockToggle.isLocked == false) {
                //check is return efiled already 
                if (_.isUndefined(efileObject) || _.isEmpty(efileObject)) { // if no then we can't lock return
                    messageService.showMessage('Only Accepted Returns by the IRS and/or State Agencies can be locked.', 'error');
                } else {
                    var _acceptedObjects = _.find(efileObject.federal, { status: 9 })
                    // if return is efiled and accepted
                    if (!_.isUndefined(efileObject) && _acceptedObjects != undefined) {
                        //call lock return function
                        returnService.lockReturn().then(function () {
                            //set locked falg true
                            $scope.lockToggle.isLocked = returnService.setReturnLockFlag(true);
                            //get updated return list status
                            $scope.returnStatus = returnService.getReturnStatusList();
                            //display success msg
                            messageService.showMessage('Returned locked successfully.The return you unlocked was Accepted by the IRS and/or State Agency. Any updates or changes will not be submitted electronically.', 'success');
                        }, function (error) { });
                    } else { // if return is not efiled/accepted
                        messageService.showMessage('Only Accepted Returns by the IRS and/or State Agencies can be locked.', 'error');
                    }
                }
            } else {//if return is already locked
                // messageService.showMessage('Your Return is already locked.', 'error');
            }

        }


        /**
    * This function is used to locked return for remote signature
    */
        $scope.lockReturnRemoteSignature = function (fromType) {
            //check if return is already locked
            if ($scope.SignlockToggle.isRemoteSignLocked == undefined || $scope.SignlockToggle.isRemoteSignLocked == false) {
                //call lock return function
                returnService.signatureLock(fromType).then(function () {
                    //set locked falg true
                    $scope.SignlockToggle.isRemoteSignLocked = returnService.setRemoteSignLocked(true);
                    //display success msg
                    messageService.showMessage('Returned locked successfully.', 'success');
                }, function (error) { });
            } else {//if return is already locked
                // messageService.showMessage('Your Return is already locked.', 'error');
            }

        }

        // Common function to check userDetails on isPasswordProtectedPDF flag is true or not
        var _checkForPDFProtectedPreference = function () {
            var deferred = $q.defer();

            // this Object hold User Detail 
            var _userDetails = userService.getUserDetails();
            // this Condition Check userDetails on "preferences.isPasswordProtectedPDF" is there or not
            if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences) && !_.isUndefined(_userDetails.settings.preferences) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace.passwordProtectedReturn)) {
                if (_userDetails.settings.preferences.returnWorkspace.passwordProtectedReturn == true) {
                    if (!_.isUndefined(_userDetails.settings.preferences.returnWorkspace.passwordType) && _userDetails.settings.preferences.returnWorkspace.passwordType == 'custom') {
                        // open dialog and show appropriate message, wait for user decision
                        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/pdfCustomPasswordDialog.html", "pdfCustomPasswordDialogController");
                        dialog.result.then(function (pdfPasswordDetails) {
                            if (!_.isUndefined(pdfPasswordDetails)) {
                                if (!_.isUndefined(pdfPasswordDetails.isIgnorePassword) && pdfPasswordDetails.isIgnorePassword == true) {
                                    deferred.resolve({ isPasswordProtectedPDF: false, customPassword: '' });
                                } else {
                                    deferred.resolve({ isPasswordProtectedPDF: true, customPassword: pdfPasswordDetails.customPassword });
                                }
                            }
                        }, function (btn) {
                            //cancel or close
                            //deferred.resolve(false);
                        });
                    } else {
                        deferred.resolve({ isPasswordProtectedPDF: true });
                    }
                } else {
                    deferred.resolve({ isPasswordProtectedPDF: false });
                }
            } else {
                // open dialog and show appropriate message, wait for user decision		  
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/pdfPasswordProtectedDialog.html", "pdfPasswordProtectedDialogController");
                dialog.result.then(function (pdfPasswordDetails) {
                    var formattedData = {};
                    formattedData['key'] = 'pdfPasswordDetails';
                    formattedData['value'] = pdfPasswordDetails;
                    _setPreferences(_userDetails, formattedData).then(function (pdfPasswordDetails) {
                        deferred.resolve(pdfPasswordDetails);
                    }, function (error) {
                        deferred.resolve(false);
                    });
                }, function (btn) {
                    //cancel or close
                    deferred.resolve(false);
                });
            }

            return deferred.promise;
        };

        /**
         * this Function set user Preferences for Printing
         * @userDetails
         * @isPasswordProtectedPDF(true or false)
         */
        var _setPreferences = function (userDetails, data) {
            var deferred = $q.defer();
            returnService.setPreferences(userDetails, data).then(function (result) {
                deferred.resolve(result);
            })
            return deferred.promise;
        };
        /**
         * This function is responsible for splitting individual returns
         */
        $scope.splitReturn = function () {
            var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
            localeService.translate("Do you want to split this return into two separate MFS returns?<br>" +
                "<b>Notes:</b>" +
                "<ul><li>All spouse related forms and data will be removed from this return and new return for spouse will be available in the return list." +
                "<li>However, you may discard changes by closing return without saving it and delete newly created spouse return from return list." +
                "</ul>", "RETUTNCONTROLLER_DOYOUWANTTOSPLITRETURN").then(function (translatedText) {
                    var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translatedText });
                    dialog.result.then(function (btn) {
                        //success
                        //set flag to set loading on split return
                        $scope.isSplitReturn = true;
                        returnService.splitReturn();
                    }, function (btn) {
                        //cancel or close
                    });
                });
        };

        //unlock return
        $scope.onUnlockReturn = function () {
            //open waiting status dialog
            returnService.openProgressDialog(true);
            //call api get updated header data 
            returnService.getUpdatedEfileStatusFromApi().then(function () {
                // unlock configuration
                _canUnlock();
                //close waiting status dialog
                returnService.closeProgressDialog();
                //close dialog callback  subscription
                var _progressDialogCloseSubscription = postal.subscribe({
                    channel: 'MTPO-Return',
                    topic: 'ProgressDialogCloseCallBack',
                    callback: function (data, envelope) {
                        //pass return id
                        $scope.unlockReturn.returnId = $routeParams.id;
                        // open dialog and show appropriate message, wait for user decision
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        var dialog = dialogService.openDialog("custom", dialogConfiguration, 'taxAppJs/return/workspace/partials/unlockMessages.html', "unlockReturnDialogController", $scope.unlockReturn);
                        dialog.result.then(function (btn) {
                            if (btn && (btn.type == 'copy' || btn.type == 'amended')) {
                                closeReturn(false).then(function () {
                                    $location.path('/return/edit/' + btn.returnId);
                                });
                            } else {
                                // unlock return
                                returnService.unlockReturn().then(function () {
                                    $scope.lockToggle.isLocked = returnService.setReturnLockFlag(false);
                                    messageService.showMessage('Return unlocked', 'success');
                                    //get updated return list status
                                    $scope.returnStatus = returnService.getReturnStatusList();
                                    // start autosave interval
                                    initSaveReturnInterval();
                                    if (returnService.getclientPortal() == true) {
                                        returnService.markSignatureInvalid();
                                        removeSignForclientPortal()
                                    }
                                    if ($scope.betaOnly()) {
                                        _isFullYearWktChange()
                                    }
                                    //unsubscribe dialog subscription
                                    _progressDialogCloseSubscription.unsubscribe();
                                }, function (error) {
                                    $log.error(error);
                                    //unsubscribe dialog subscription
                                    _progressDialogCloseSubscription.unsubscribe();
                                });
                            }
                        }, function (btn) {
                            if (btn == 'close') {
                                return;
                            } else if (btn == 'no') {
                                return;
                            }
                            //unsubscribe dialog subscription
                            _progressDialogCloseSubscription.unsubscribe();
                        });
                    }
                });
            }, function (error) {
                //close waiting status dialog
                utilityService.closeProgressDialog();
                $log.error(error);
            });
        };
        var _isFullYearWktChange = function () {
            var efileStatus = returnService.getEfileStatus();
            if (!_.isUndefined(efileStatus) && !_.isEmpty(efileStatus)) {
                //get federal data
                var federal = efileStatus["federal"];
                if (!_.isUndefined(federal) && !_.isEmpty(federal)) {
                    _.forEach(federal, function (federalObj) {
                        if (federalObj.returnTypeCategory == 'MainForm' && federalObj.status == 9) {
                            returnService.nonResiWktHistory();
                            $scope.saveReturn();
                        }
                    });
                }
            }
        }
        // unloack return for remote signature clientPortal/signature/signatureUnLock
        $scope.signatureUnLock = function () {
            // open dialog and show appropriate message, wait for user decision
            var clientPortalReturnUnlockDialog = { key: 'clientPortalReturnUnlock', defaultText: 'You received a Taxpayer Review or a Remote Signature from MyTAXPortal. If you Unlock the return, the taxpayer’s Review or Remote Signature will be invalid for the current version of the return. If you need to E-File the return, please select “Transmit Return” from the E-File drop-down menu.' }
            var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
            var dialog = dialogService.openDialog("custom", dialogConfiguration, 'taxAppJs/return/workspace/partials/unlockMessages.html', "unlockReturnDialogController", { canUnlock: true, message: clientPortalReturnUnlockDialog });
            dialog.result.then(function (btn) {
                // unlock return
                returnService.markSignatureInvalid();
                returnService.signatureUnLock().then(function () {
                    $scope.SignlockToggle.isRemoteSignLocked = returnService.setRemoteSignLocked(false);
                    $rootScope.$broadcast('refreshMyTaxPortal');
                    removeSignForclientPortal();
                    //get updated return list status
                    $scope.returnStatus = returnService.getReturnStatusList();
                    // start autosave interval
                    initSaveReturnInterval();
                    messageService.showMessage('Return unlocked', 'success');
                }, function (error) {
                    console.log(error)
                })
            }, function (btn) {
                if (btn == 'close') {
                    return;
                } else if (btn == 'no') {
                    return;
                }
            });
        }

        // if user click on unlock remove sign from return
        var removeSignForclientPortal = function () {
            var signatureTypeObject = { type: 3, ID: $routeParams.id };
            $scope.fillingStatus = returnService.getElementValue('filstts', 'dMainInfo');
            signatureService.removeSignatureWithoutDialog(signatureTypeObject).then(function () {
                if ($scope.fillingStatus == 2 || $scope.fillingStatus == '2') {
                    var signObjectForSpouse = { type: 4, ID: $routeParams.id };
                    signatureService.removeSignatureWithoutDialog(signObjectForSpouse).then(function () {
                        var getSignatureObj = { "typeList": [3, 4], "returnId": $routeParams.id };
                        signatureService.signatureViewAll(getSignatureObj, true).then(function (signaturesData) {
                        }, function (error) {
                        });
                    });
                } else {
                    var getSignatureObj = { "typeList": [3, 4], "returnId": $routeParams.id };
                    signatureService.signatureViewAll(getSignatureObj, true).then(function (signaturesData) {
                    }, function (error) {
                    });
                }
            });

        }
        // Check whether user can unlock return or not on base of status of return. 
        var _canUnlock = function () {
            var efileStatus = returnService.getEfileStatus();
            if (!_.isUndefined(efileStatus) && !_.isEmpty(efileStatus)) {
                //get federal data
                var federal = efileStatus["federal"];
                var messages = [
                    { key: 'FederalAtTransmission', defaultText: 'You <b>cannot Unlock</b> this return because the <b>federal</b> return is In <b>Transmission</b> mode. If you need to make changes; cancel the E-File Transmission from the E-File Summary widget and try again.' },
                    { key: 'FederalAtIRS', defaultText: 'You <b>cannot Unlock</b> this return, the <b>federal</b> return is <b>At IRS</b> waiting to be acknowledged.' },
                    { key: 'FederalAccepetd', defaultText: 'The <b>federal</b> return is <b>Accepted</b>. If you need to make changes, please complete an <b>Amended</b> Income Tax Return and paper file.' },
                    { key: 'FederalAccepted_StateAccpted', defaultText: 'The <b>federal</b> and <b>state</b> returns are <b>Accepted</b>. If you choose to make any changes, the <b>return(s) will not be Transmitted</b> again until you file amended returns.' },
                    { key: 'FederalAccepted_StateRejected', defaultText: 'The <b>federal</b> return is <b>Accepted</b> but, the state return(s) are <b>Rejected</b>. When you correct the rejection and retransmit, MyTAXPrepOffice will attach the Accepted copy of the federal return, even if changes have been made.' },
                    { key: 'FederalAccepted_SomeState_Accpted_Rejected', defaultText: 'The <b>federal</b> return is <b>Accepted</b> and <b>state return(s)</b> are either <b>rejected</b> or <b>accepted</b>. When you correct the rejection and retransmit, MyTAXPrepOffice will attach the Accepted copy of the federal return, even if changes have been made.' },
                    { key: 'FederalAccpeted_AnyStateAtTransmission', defaultText: 'You <b>cannot Unlock</b> this return, the <b>state return</b>(s) are still <b>In Transmission</b> mode.' },
                    { key: 'FederalAccpeted_AnyStateAtState', defaultText: 'You <b>cannot Unlock</b> this return, the <b>state return</b>(s) are still <b>At State</b> waiting to be acknowledged.' },
                    { key: 'FederalRejected', defaultText: 'The <b>federal</b> return was <b>Rejected</b>. Please select <b>Unlock</b> to <b>correct</b> the rejection.' },
                    { key: 'FederalRejected_SomeStateWaitingFederal', defaultText: 'Select <b>Unlock</b> to correct the <b>federal rejection</b>. The <b>state return</b>(s) will be <b>transmitted</b> to the state(s) when the <b>federal</b> return is <b>Accepted</b>.' },
                    { key: 'FederalSchemaError', defaultText: 'There are some <b>errors</b> in this return. Please <b>correct</b> these validations and <b>re-transmit</b> the return.' },
                    { key: 'FederalAccepted_StateSchemaError', defaultText: 'The <b>federal</b> return is <b>Accepted</b>. There are some <b>errors</b> in the <b>state return</b>(s). When you correct the validation(s) and retransmit, <b>MyTAXPrepOffice</b> will <b>attach</b> the <b>Accepted</b> copy of the <b>federal</b> return, even if changes have been made.' },
                    { key: 'FederalAccepted_StateReadyForTransmission', defaultText: 'You can unlock this return the <b>federal</b> return is <b>Accepted</b>. <b>State return</b>(s) are <b>not</b> yet <b>transmitted</b>.' },
                    { key: 'FederalCancelled', defaultText: 'You can unlock this return, the <b>federal</b> E-File <b>Transmission</b> for this return was <b>canceled</b>.' },
                    { key: 'FederalExtAccepted', defaultText: 'The <b>federal Extension</b> was <b>Accepted</b>. If you want to <b>E-File</b> the <b>federal return</b> please make the <b>required changes</b> and <b>re-transmit</b> the return.' },
                    { key: 'StateAtTransmission', defaultText: 'You <b>cannot Unlock</b> this return because the <b>state</b> return is <b>In Transmission</b> mode. If you need to make changes, cancel the E-File transmission from the E-File Summary widget and try again.' },
                    { key: 'StateAtState', defaultText: 'You <b>cannot Unlock</b> this return, the <b>state</b> return is <b>At State</b> waiting to be acknolwedged.' },
                    { key: 'StateAccpted', defaultText: 'The <b>state</b> return is <b>Accepted</b>. If you choose to make any changes, the <b>return</b> will <b>not</b> be submitted <b>electronically</b> until you prepare and file amended return(s).' },
                    { key: 'StateRejected', defaultText: 'The return was <b>Rejected</b>. Please select <b>Unlock</b> to correct the rejection.' },
                    { key: 'StateCancelled', defaultText: 'You can <b>Unlock</b> this return, the <b>state</b> E-File <b>Transmission</b> for this return was <b>canceled</b>.' },
                    { key: 'StateSchemaError', defaultText: 'There are some <b>errors</b> in this <b>return</b>. Please <b>correct</b> these validations and <b>re-transmit</b> the return.' }
                ];

                if (!_.isUndefined(federal) && !_.isEmpty(federal)) {
                    _.forEach(federal, function (federalObj) {
                        if ((federalObj.returnTypeCategory == 'MainForm' || federalObj.returnTypeCategory == 'ExtensionForm') && federalObj.status == 9) {

                            if (federalObj.returnTypeCategory == 'MainForm' && federalObj.status == 9) {
                                // allow unlock of return
                                $scope.unlockReturn.canUnlock = true;
                                // set message federal accepted
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccepetd" });
                                //if state/federal is accepted then add flag to show copy / amended create option
                                $scope.unlockReturn.showCopyAmendedOption = true;
                            }

                            // set msg for federal extention accepted
                            if (federalObj.returnTypeCategory == 'ExtensionForm' && federalObj.status == 9) {
                                // allow unlock of return
                                $scope.unlockReturn.canUnlock = true;
                                //set message
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalExtAccepted" });
                            }

                            //variables holds the count for different status of states.    				
                            var rejectedStateCount = 0, acceptedStateCount = 0, transmittedStateCount = 0, stateAtIRSCount = 0, schemaErrorCount = 0, stateReadyForEfileCount = 0;

                            _.forEach(efileStatus, function (state, key) { //foreach start ---
                                if (!_.isUndefined(key) && !_.isEmpty(key) && key != 'federal' && key != 'atlas') {
                                    _.forEach(state, function (returntype, subKey) { //foreach start ---
                                        if (returntype.status == 8) {
                                            rejectedStateCount = rejectedStateCount + 1;
                                        } else if (returntype.status == 9) {
                                            acceptedStateCount = acceptedStateCount + 1;
                                        } else if (returntype.status == 2) {
                                            schemaErrorCount = schemaErrorCount + 1;
                                        } else if (returntype.status == 1 || returntype.status == 0) {
                                            stateReadyForEfileCount = stateReadyForEfileCount + 1;
                                        } else {
                                            if (returntype.status == 7) {
                                                transmittedStateCount = transmittedStateCount + 1;
                                            } else if (returntype.status > 1 && returntype.status < 7) {
                                                stateAtIRSCount = stateAtIRSCount + 1;
                                            }
                                            // breaks loop, it just improve performance, will not effect on functionality
                                            return false;
                                        }
                                    });
                                }
                            });//foreach end ---

                            // set messages on condition bases
                            if (transmittedStateCount > 0) {
                                $scope.unlockReturn.canUnlock = false;
                                // set message federal accepted. any state at transmission
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccpeted_AnyStateAtTransmission" });
                            } else if (stateAtIRSCount > 0) {
                                // set message federal accepted. any state at IRS
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccpeted_AnyStateAtState" });
                                $scope.unlockReturn.canUnlock = false;
                            } else if (schemaErrorCount > 0) {
                                // set message federal accepted. any state schema error
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccepted_StateSchemaError" });
                                $scope.unlockReturn.canUnlock = true;
                            } else if (rejectedStateCount > 0) {
                                // IF all states are 'rejected' then we allow unlock
                                $scope.unlockReturn.canUnlock = true;
                                if (acceptedStateCount > 0) {
                                    // set message federal accepted. some states accepted and other rejected
                                    $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccepted_SomeState_Accpted_Rejected" });
                                } else {
                                    // set message federal accepted. all states rejected
                                    $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccepted_StateRejected" });
                                }
                            } else if (acceptedStateCount > 0) {
                                // IF all states are 'accepted' then we allow unlock
                                $scope.unlockReturn.canUnlock = true;
                                //if state/federal is accepted then add flag to show copy / amended create option
                                $scope.unlockReturn.showCopyAmendedOption = true;
                                // set message federal accepted. all states accepted
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccepted_StateAccpted" });
                            } else if (stateReadyForEfileCount > 0) {
                                // set message federal accepted. any state schema error
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAccepted_StateReadyForTransmission" });
                                $scope.unlockReturn.canUnlock = true;
                            }
                        }
                    });
                } if (!_.isUndefined(federal) && !_.isEmpty(federal)) {
                    _.forEach(federal, function (federalObj) {
                        if (federalObj.status == 8 || federalObj.status == 22) {
                            // allow unlock of return
                            $scope.unlockReturn.canUnlock = true;
                            // set message federal rejected
                            $scope.unlockReturn.message = _.find(messages, { "key": "FederalRejected" });
                            _.forEach(efileStatus, function (state, key) { //foreach start ---
                                if (!_.isUndefined(key) && !_.isEmpty(key) && key != "federal") {
                                    _.forEach(state, function (returnType, subKey) { //foreach start ---
                                        if (returnType.status == 0) {
                                            // set message federal accepted. with waiting for federal
                                            $scope.unlockReturn.message = _.find(messages, { "key": "FederalRejected_SomeStateWaitingFederal" });
                                        }

                                    });
                                }
                            });//foreach end --
                        } else if (federalObj.status == 2) {
                            $scope.unlockReturn.canUnlock = true;
                            // set message federal at IRS
                            $scope.unlockReturn.message = _.find(messages, { "key": "FederalSchemaError" });
                        } else if (federalObj.status == 21) {
                            $scope.unlockReturn.canUnlock = true;
                            // set message federal is cancelled
                            $scope.unlockReturn.message = _.find(messages, { "key": "FederalCancelled" });
                        } else if (federalObj.status >= 0 && federalObj.status < 8) { //IF federal have status other then' accepted' or 'rejected' then we don't allow unlock of return
                            $scope.unlockReturn.canUnlock = false;
                            if (federalObj.status == 7) {
                                // set message federal at IRS
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAtIRS" });
                            } else if (federalObj.status >= 0 && federalObj.status < 7) {
                                // set message federal at transmission
                                $scope.unlockReturn.message = _.find(messages, { "key": "FederalAtTransmission" });
                            }
                        }
                    });
                }

                //in case of only state is filed
                if (!_.isUndefined(efileStatus) && !_.isEmpty(efileStatus)) {
                    if (_.isUndefined(efileStatus.federal)) {
                        _.forEach(efileStatus, function (state, key) {
                            if (state != 'federal') {
                                _.forEach(state, function (returnType, subKey) {
                                    if (returnType.status == 2) {
                                        $scope.unlockReturn.canUnlock = true;
                                        // set message federal at IRS
                                        $scope.unlockReturn.message = _.find(messages, { "key": "StateSchemaError" });
                                    } else if (returnType.status == 8 || returnType.status == 22) {
                                        $scope.unlockReturn.canUnlock = true;
                                        // set message federal at IRS
                                        $scope.unlockReturn.message = _.find(messages, { "key": "StateRejected" });
                                    } else if (returnType.status == 9) {
                                        $scope.unlockReturn.canUnlock = true;
                                        // set message federal at IRS
                                        $scope.unlockReturn.message = _.find(messages, { "key": "StateAccpted" });
                                    } else if (returnType.status == 21) {
                                        $scope.unlockReturn.canUnlock = true;
                                        // set message federal at IRS
                                        $scope.unlockReturn.message = _.find(messages, { "key": "StateCancelled" });
                                    } else if (returnType.status >= 0 && returnType.status < 8) {
                                        $scope.unlockReturn.canUnlock = false;
                                        if (returnType.status == 7) {
                                            // set message federal at IRS
                                            $scope.unlockReturn.message = _.find(messages, { "key": "StateAtState" });
                                        } else if (returnType.status >= 0 || returnType.status <= 7) {
                                            // set message federal at IRS
                                            $scope.unlockReturn.message = _.find(messages, { "key": "StateAtTransmission" });
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        };

        //{{dMainInfo.tpfnmi.value}}&nbsp;{{dMainInfo.tplnm.value}}
        // For More return type we need to write conditions here
        $scope.printClientOrganizer = function () {

            /// check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified != undefined && $scope.emailVerified == true) {


                if (!angular.isUndefined($scope.client) && !angular.isUndefined($scope.client.packageName)) {
                    basketService.pushItem('returnTypeForClientOrganizer', $scope.client.packageName);
                    if ($scope.client.packageName == "1040") {
                        basketService.pushItem('taxPayerNameForClientOrganizer', $scope.dMainInfo.tpfnmi.value + " " + $scope.dMainInfo.tplnm.value);
                    } else if ($scope.client.packageName == "1065") {
                        //firm name
                        if (!_.isUndefined($scope.d1065CIS.PartnerName) && !_.isUndefined($scope.d1065CIS.PartnerName.value)) {
                            basketService.pushItem('taxPayerNameForClientOrganizer', $scope.d1065CIS.PartnerName.value);
                        }
                    } else if ($scope.client.packageName == "1120") {
                        //firm name
                        if (!_.isUndefined($scope.d1120CCIS.NameofCorporation) && !_.isUndefined($scope.d1120CCIS.NameofCorporation.value)) {
                            basketService.pushItem('taxPayerNameForClientOrganizer', $scope.d1120CCIS.NameofCorporation.value);
                        }
                    } else if ($scope.client.packageName == "1120s") {
                        //firm name
                        if (!_.isUndefined($scope.d1120SCIS.NameofSCorporation) && !_.isUndefined($scope.d1120SCIS.NameofSCorporation.value)) {
                            basketService.pushItem('taxPayerNameForClientOrganizer', $scope.d1120SCIS.NameofSCorporation.value);
                        }
                    } else if ($scope.client.packageName == "1041") {
                        //firm name
                        if (!_.isUndefined($scope.d1041CIS.Nameofestate) && !_.isUndefined($scope.d1041CIS.Nameofestate.value)) {
                            basketService.pushItem('taxPayerNameForClientOrganizer', $scope.d1041CIS.Nameofestate.value);
                        }
                    } else if ($scope.client.packageName == "990") {
                        //firm name
                        if (!_.isUndefined($scope.d990CIS.PartnerName) && !_.isUndefined($scope.d990CIS.PartnerName.value)) {
                            basketService.pushItem('taxPayerNameForClientOrganizer', $scope.d990CIS.PartnerName.value);
                        }
                    }
                }

                $location.path("/manage/clientOrganizer/print");
            }
            else EmailVerification($scope.printClientOrganizer);
        };

        //Show dialog with active forms to print
        //Issue : Currently we are only showing federal forms for printing.
        $scope.printSelectedForms = function () {

            /// check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified != undefined && $scope.emailVerified == true) {
                //prompt for asking user to save return if there is changes 
                _promptToSaveBeforePrinting('printSelectedForms').then(function (result) {
                    if (result === 'success') {
                        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' },
                            "taxAppJs/return/workspace/partials/printSelectedFormsDialog.html", "printSelectedFormsDialogController", { "activeForms": angular.copy(_getActiveForms()) });
                        // ELSE proceed further
                        dialog.result.then(function (formList) {
                            _printMultipleForms(formList, 'printSelectedForms');
                        }, function (btn) {
                            //on close or cancel			
                        });
                    }
                }, function (error) {
                    $log.error(error);
                });
            } else EmailVerification($scope.printSelectedForms);
        };

        /**
* This function will perform steps required to be excuted before making efile.
* For example - checking ERC and if found show dialog with message and auto populate ERC panel if not visible
*/
        $scope.performBeforeSignature = function (type) {
            var showSignature = returnService.getclientPortal();
            if (showSignature == true) {
                //Reset pending ERC flag to undefined.
                //Note: This is required to avoid cancelation of watcher, as we are cancelling watcher on true/false value.
                $scope.isRejectERCPending = undefined;
                $scope.performReviewFlag = true;
                var colneAskForSaveConfirmation = angular.copy(askForSaveConfirmation);
                returnService.postTaxFieldChange({ fieldName: 'dMainInfo.isFromClinetPortal', newVal: true });

                //Invoke perform review
                $scope.performReview();
                //Put watcher on pending ERC flag
                var isRejectERCPendingWatcher = $scope.$watch('isRejectERCPending', function () {
                    $log.debug('inside $scope.isRejectERCPending ' + $scope.isRejectERCPending);
                    //If there is no ERC Pending
                    if ($scope.isRejectERCPending == false) {
                        returnService.postTaxFieldChange({ fieldName: 'dMainInfo.isFromClinetPortal', newVal: false });
                        askForSaveConfirmation = colneAskForSaveConfirmation;
                        setTimeout(function () {
                            askForSaveConfirmation = colneAskForSaveConfirmation;
                        }, 100)
                        //Clear watcher put on ERC List		
                        isRejectERCPendingWatcher();

                        var email = returnService.getElementValue('strtpeml', 'dMainInfo');
                        var fillingstatus = returnService.getElementValue('filstts', 'dMainInfo');
                        var sponseEmail = returnService.getElementValue('strspeml', 'dMainInfo');

                        if (!email) {
                            // notify taxpayer email does not exists
                            var dialogConfig = { "title": "MyTAXPortal", "text": "<div>Please enter the taxpayer's email address in the Client Information Sheet.</div>" };
                            var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
                        } else {
                            if (type === 'REQ_SIGN') {
                                $scope.printPreview(undefined, 'REQ_SIGN');
                            } else if (type === 'REVIEW_SIGN') {
                                $scope.printPreview(undefined, 'REVIEW_SIGN');
                            }
                        }


                    } else if ($scope.isRejectERCPending == true) {
                        returnService.postTaxFieldChange({ fieldName: 'dMainInfo.isFromClinetPortal', newVal: false });
                        askForSaveConfirmation = colneAskForSaveConfirmation;
                        //Clear watcher put on ERC List		
                        isRejectERCPendingWatcher();
                        //Attention Dialog
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        localeService.translate("There are errors in the return that need to be corrected before you can e-file. Please correct all validations displayed in red, with a Required type and Reject severity.<br>" +
                            "<b>Notes:</b>" +
                            "<ul>" +
                            "<li>Any validation displayed as an “Override” are not required to be corrected for efiling however, we advise you to review the overridden entries to avoid IRS/State rejects.</ul>", 'RETURNCONTROLLER_SOMEERRORYOURRETURNPLZCORRECT').then(function (translatedText) {
                                var dialog = dialogService.openDialog("attention", dialogConfiguration, translatedText);
                                //If return has ERC Show bottom panel and ERC Grid				
                                $scope.performReviewFlag = true;
                                $scope.bottomPanelFlag = true;
                                $scope.eFileRejectionFlag = false
                                $scope.eFileBankRejectionFlag = false
                                $scope.eFileAlertFlag = false;
                            });
                    }
                });
            } else {
                var dialogConfig = { "title": "MyTAXPortal", "text": '<div>MyTAXPortal allows you allows you to securely exchange documents with your clients and collect signatures remotely making two-way communication between you and your clients quick and easy.<br /><br /> Click \“Invite Clients\” on the Dashboard MyTAXPortal widget to enable the <b>Send to Taxpayer for Review</b> and <b>Request for Remote Signature</b> features.</div>' };
                var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
            }
        };

        $rootScope.$on("getRemoteReviewSignature", function (event, dataOfRemoteReview) {
            if (!_.isUndefined(dataOfRemoteReview)) {
                $scope.countForReview = dataOfRemoteReview.countForReview;
                $scope.countForRequest = dataOfRemoteReview.countForRequest;
            }
        });

        // print preview dailog open
        $scope.printPreview = function (formForPreview, type) {
            // check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified != undefined && $scope.emailVerified == true) {
                var saveType = 'printPreview';
                if (type == 'REQ_SIGN') {
                    saveType = 'REQ_SIGN';
                } else if (type == 'REVIEW_SIGN') {
                    saveType = 'REVIEW_SIGN';
                }

                _promptToSaveBeforePrinting(saveType).then(function (result) {
                    if (result === 'success') {
                        if (type == 'REQ_SIGN' || type == 'REVIEW_SIGN') {
                            $scope.taxPortalConfig = contentService.loadTaxPortalConfig('taxPortalPrintForm_' + $scope.taxYear);
                            $scope.ClintpapreOnly = false;
                            if (returnService.getElementValue('blnPinY', 'dReturnInfo') == '2') {
                                $scope.ClintpapreOnly = true
                            }

                        }

                        var forms = angular.copy($scope.forms);
                        var _preparerId;
                        if ($scope.client.packageName == '1040')
                            _preparerId = returnService.getElementValue('strprid', 'dReturnInfo');
                        else if ($scope.client.packageName == '1065')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1065RIS');
                        else if ($scope.client.packageName == '1120')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1120CRIS');
                        else if ($scope.client.packageName == '1120s')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1120SRIS');
                        else if ($scope.client.packageName == '1041')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1041RIS');
                        else if ($scope.client.packageName == '990')
                            _preparerId = returnService.getElementValue('PrepareID', 'd990RIS');

                        //open Print Print Packets Forms dilaog
                        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                            "taxAppJs/return/workspace/partials/dialog/printPreviewDialog.html", "printPreviewDialogController", {
                                'forms': forms, 'preparerId': _preparerId, 'returnID': $routeParams.id, 'formForPreview': formForPreview, 'type': type, 'countForReview': $scope.countForReview, 'countForRequest': $scope.countForRequest,
                                'paperOnly': $scope.ClintpapreOnly, 'previewNotSupported': $scope.previewNotSupported
                            });
                        dialog.result.then(function (response) {
                            var fromType;
                            var signMainForm = []
                            if (response !== undefined && response.reqData != undefined &&
                                response.reqData.type != undefined && response.reqData.type != '') {
                                fromType = response.reqData.type;
                            }
                            if (fromType == undefined) {
                                //call function to update printing animation
                                showOrHidePrintingAnimation('request');
                            }

                            //formList
                            var formList = response.formList;
                            // call function to barcode verification 
                            barcodeVerification(formList);

                            //save password details in change preference 
                            if (response.passwordDetails.saveToUserPreferences == true) {
                                var formattedData = {};
                                formattedData['key'] = 'pdfPasswordDetails';
                                formattedData['value'] = response.passwordDetails;
                                var _userDetails = userService.getUserDetails();
                                _setPreferences(_userDetails, formattedData);
                            }

                            //getWaterMark
                            var waterMarkText = getWaterMark();
                            //if it is undefined then assign client water mark text 
                            if ((waterMarkText == undefined || waterMarkText == '') && response.waterMarkDetails != undefined) {
                                waterMarkText = response.waterMarkDetails;
                            }

                            //docIndexes for printing
                            var docIndexes = _.pluck(formList, 'docIndex');
                            // List of form properties by looping on selected forms
                            var formPropList = [];
                            _.forEach(formList, function (form) {
                                //Used copy function to avoid accidental two way data binding
                                var formObj = angular.copy(returnService.getSingleAvailableForm(form.docName));
                                if (!_.isUndefined(formObj)) {
                                    formPropList.push(formObj);
                                }
                                if (formObj && (formObj.docName == 'd1040' || formObj.docName == 'd8879')) {
                                    signMainForm.push(formObj.docName)
                                }
                            });

                            var refundSectionData = undefined;
                            //if bank application is included then add routing number and account number
                            if (response.selectedPacket == 'client' && $scope.client.packageName == '1040') {
                                _.forEach(formPropList, function (form) {
                                    if (returnService.IsReturnIncludesBankApplication()) {
                                        refundSectionData = {
                                            'd1040': {
                                                'RoutingTransitNumber': 'Bank',
                                                'DepositorAccountNumber': 'ProductAppliedFor'
                                            }
                                        }
                                    }
                                })
                            }
                            if (fromType == 'REQ_SIGN' || fromType == 'REVIEW_SIGN') {
                                if ($scope.ClintpapreOnly == true && signMainForm.indexOf('d1040') == -1) {
                                    messageService.showMessage('1040 Form is mandatory', 'error', 'PRINT_FORM_ERROR', 3000);
                                } else if ($scope.ClintpapreOnly != true && signMainForm.indexOf('d8879') == -1) {
                                    messageService.showMessage('8879 Form is mandatory', 'error', 'PRINT_FORM_ERROR', 3000);
                                } else {
                                    contentService.loadTaxPortalConfig('taxPortalPrintForm_' + $scope.taxYear).then(function (resConfig) {
                                        $scope.taxPortalConfig = resConfig
                                        var stateForms = []
                                        var stateInDoc = returnService.getStateOfReturn();
                                        if (stateInDoc !== undefined && stateInDoc.length > 0) {
                                            var taxPortalConfig = $scope.taxPortalConfig.taxPortalForms;
                                            for (var i01 = 0; i01 < stateInDoc.length; i01++) {
                                                var state = stateInDoc[i01];
                                                if (state !== undefined) {
                                                    var Selectedstate = taxPortalConfig[state.toUpperCase()];
                                                    if (Selectedstate != undefined) {
                                                        for (var i02 = 0; i02 < Selectedstate.length; i02++) {
                                                            var reqDoc = Selectedstate[i02].docName
                                                            var formReq = {};
                                                            var formIndex = formPropList.findIndex(function (t) { return t.docName === reqDoc });
                                                            if (formIndex > -1) {
                                                                var formToAdd = true;
                                                                if (Selectedstate[i02].efileOnly !== undefined && Selectedstate[i02].efileOnly == true) {
                                                                    var blnPinY = returnService.getElementValue('blnPinY', 'dReturnInfo');
                                                                    var blnPIN = returnService.getElementValue('blnPIN', 'dReturnInfo');
                                                                    if (blnPinY == '1' || blnPIN == true) {
                                                                        formToAdd = true
                                                                    } else {
                                                                        formToAdd = false
                                                                    }
                                                                    if (Selectedstate[i02].isReturnOnly == true && Selectedstate[i02].extensionForm != undefined && Selectedstate[i02].extensionForm != '') {
                                                                        var eIsActive = returnService.getElementValue('isActive', Selectedstate[i02].extensionForm);
                                                                        if (eIsActive == true) {
                                                                            formToAdd = false
                                                                        }
                                                                    }
                                                                } else if (Selectedstate[i02].papreOnly !== undefined && Selectedstate[i02].papreOnly == true) {
                                                                    var blnPinY = returnService.getElementValue('blnPinY', 'dReturnInfo');
                                                                    if (blnPinY == '2') {
                                                                        formToAdd = true
                                                                    } else {
                                                                        formToAdd = false
                                                                    }
                                                                }
                                                                if (formToAdd == true) {
                                                                    formReq.formPropList = [formPropList[formIndex]];
                                                                    formReq.docList = [docIndexes[formIndex]];
                                                                    stateForms.push(formReq)
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        //Call service for printing
                                        returnService.printedFormsLink(formPropList, docIndexes, 'printSelectedForms', waterMarkText, response.passwordDetails, response.maskSensitiveInfo, response.isAddSignature, refundSectionData, stateForms, $scope.ClintpapreOnly).then(function (resData) {
                                            if (resData != undefined) {
                                                response.reqData.pdfLink = resData.key;
                                                if (resData.pdf8879Key !== undefined) {
                                                    response.reqData.pdf8879Link = resData.pdf8879Key;
                                                }
                                                if (resData.statePdf !== undefined && resData.statePdf.length > 0) {
                                                    response.reqData.statePdf = resData.statePdf;
                                                }
                                                response.reqData.fileName = returnService.getFileNameForRemoteSign('printSelectedForms');
                                                returnService.sendSignatureOrReviewRequest(response.reqData).then(function () {
                                                    $scope.lockReturnRemoteSignature(fromType);
                                                    //show message
                                                    messageService.showMessage('Return sent successfully for this signature.', 'success', 'SAVE_SENT_SUCCESS_MSG');
                                                    $rootScope.$broadcast('refreshMyTaxPortal');
                                                }, function (error) {
                                                    $log.error(error);
                                                })
                                            }
                                        });
                                    }, function (error) {

                                    });
                                }
                            } else {
                                //Call service for printing
                                returnService.printMultipleForms(formPropList, docIndexes, 'printSelectedForms', waterMarkText, response.passwordDetails, response.maskSensitiveInfo, response.isAddSignature, refundSectionData).then(function (url) {
                                    if (url != undefined) {
                                        $window.open(url, "_self");
                                    } else {
                                        messageService.showMessage('Unable to print form', 'error', 'PRINT_FORM_ERROR', 0);
                                    }
                                    //call function to update printing animation
                                    showOrHidePrintingAnimation('response');
                                }, function (error) {
                                    if (fromType == undefined) {
                                        //call function to update printing animation
                                        showOrHidePrintingAnimation('response');
                                    }
                                });
                            }
                        })
                    }
                }, function (error) {
                    $log.error(error);
                })
            } else {
                EmailVerification($scope.printPreview);
            }
        }

        $scope.showRemoteSignature = function () {
            var showSignature = returnService.getclientPortal();
            return showSignature;
        }

        //Pass all active forms for printing
        //Issue : Limited to federal
        $scope.printCompleteReturn = function () {

            /// check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified != undefined && $scope.emailVerified == true) {
                //List of active forms
                var _activeForms = angular.copy(_getActiveForms());
                //prompt for asking user to save return if there is changes 
                _promptToSaveBeforePrinting('printCompleteReturn').then(function (result) {
                    if (result === 'success') {
                        //Send list for printing with printingType - printCompleteReturn
                        _printMultipleForms(_activeForms, 'printCompleteReturn');
                    }
                }, function (error) {
                    $log.error(error);
                });
            } else EmailVerification($scope.printCompleteReturn);
        };

        //This is temporary function for OR Barcode printing. Will use only in beta
        $scope.printBarcodeReturn = function (set, state) {
            //prompt for asking user to save return if there is changes 
            _promptToSaveBeforePrinting('printCompleteReturn').then(function (result) {
                if (result === 'success') {
                    _checkForPDFProtectedPreference().then(function (pdfPasswordDetails) {
                        //List of active forms
                        var formList = angular.copy(_getActiveForms());
                        //call function to update printing animation
                        showOrHidePrintingAnimation('request');
                        //docIndexes for printing
                        var docIndexes = _.pluck(formList, 'docIndex');
                        // List of form properties by looping on selected forms
                        var formPropList = [];
                        _.forEach(formList, function (form) {
                            //Used copy function to avoid accidental two way data binding
                            var formObj = angular.copy(returnService.getSingleAvailableForm(form.docName));
                            if (!_.isUndefined(formObj)) {
                                formPropList.push(formObj);
                            }
                        });
                        //Call service for printing
                        returnService.printBarcodeReturn(formPropList, docIndexes, 'printBarcodeForm', set, state, getWaterMark(), pdfPasswordDetails).then(function (url) {
                            if (url != undefined) {
                                $window.open(url, "_self");
                            } else {
                                messageService.showMessage('Unable to print form', 'error', 'PRINT_FORM_ERROR', 0);
                            }
                            //call function to update printing animation
                            showOrHidePrintingAnimation('response');
                        }, function (error) {
                            //call function to update printing animation
                            showOrHidePrintingAnimation('response');
                        });
                    }, function (error) {
                        $log.error(error);
                    });
                }
            }, function (error) {
                $log.error(error);
            });
        };

        // This is function is used to open print print packets forms dialog 
        $scope.printPackets = function (isInBrowser) {
            // check user is alrady verified his email, if not show dialog for email verification
            if ($scope.emailVerified != undefined && $scope.emailVerified == true) {
                //prompt for asking user to save return if there is changes 
                _promptToSaveBeforePrinting('printSelectedForms').then(function (result) {
                    if (result === 'success') {
                        var _preparerId;
                        if ($scope.client.packageName == '1040')
                            _preparerId = returnService.getElementValue('strprid', 'dReturnInfo');
                        else if ($scope.client.packageName == '1065')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1065RIS');
                        else if ($scope.client.packageName == '1120')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1120CRIS');
                        else if ($scope.client.packageName == '1120s')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1120SRIS');
                        else if ($scope.client.packageName == '1041')
                            _preparerId = returnService.getElementValue('PrepareID', 'd1041RIS');
                        else if ($scope.client.packageName == '990')
                            _preparerId = returnService.getElementValue('PrepareID', 'd990RIS');

                        var forms = angular.copy($scope.forms);
                        //open Print Print Packets Forms dilaog
                        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                            "taxAppJs/return/workspace/partials/dialog/printPacketsDialog.html", "printPacketsDialogController", { 'forms': forms, 'preparerId': _preparerId, 'returnID': $routeParams.id });
                        dialog.result.then(function (response) {
                            //call function to update printing animation
                            showOrHidePrintingAnimation('request');
                            //formList
                            var formList = response.formList;
                            // call function to barcode verification 
                            barcodeVerification(formList);


                            //save password details in change preference 
                            if (response.passwordDetails.saveToUserPreferences == true) {
                                var formattedData = {};
                                formattedData['key'] = 'pdfPasswordDetails';
                                formattedData['value'] = response.passwordDetails;
                                var _userDetails = userService.getUserDetails();
                                _setPreferences(_userDetails, formattedData);
                            }

                            //getWaterMark
                            var waterMarkText = getWaterMark();
                            //if it is undefined then assign client water mark text 
                            if ((waterMarkText == undefined || waterMarkText == '') && response.waterMarkDetails != undefined) {
                                waterMarkText = response.waterMarkDetails;
                            }

                            //docIndexes for printing
                            var docIndexes = _.pluck(formList, 'docIndex');
                            // List of form properties by looping on selected forms
                            var formPropList = [];
                            _.forEach(formList, function (form) {
                                //Used copy function to avoid accidental two way data binding
                                var formObj = angular.copy(returnService.getSingleAvailableForm(form.docName));
                                if (!_.isUndefined(formObj)) {
                                    formPropList.push(formObj);
                                }
                            });

                            var refundSectionData = undefined;
                            //if bank application is included then add routing number and account number
                            if (response.selectedPacket == 'client' && $scope.client.packageName == '1040') {
                                _.forEach(formPropList, function (form) {
                                    if (returnService.IsReturnIncludesBankApplication()) {
                                        refundSectionData = {
                                            'd1040': {
                                                'RoutingTransitNumber': 'Bank',
                                                'DepositorAccountNumber': 'ProductAppliedFor'
                                            }
                                        }
                                    }
                                })
                            }

                            if($scope.betaOnly() && parseInt($scope.taxYear) > 2018 && isInBrowser) {
                                browserSidePrinting(formPropList, docIndexes, 'printSelectedForms', waterMarkText, response.passwordDetails, response.maskSensitiveInfo, response.isAddSignature, refundSectionData, _preparerId);
                            } else {
                                //Call service for printing
                                returnService.printMultipleForms(formPropList, docIndexes, 'printSelectedForms', waterMarkText, response.passwordDetails, response.maskSensitiveInfo, response.isAddSignature, refundSectionData).then(function (url) {
                                    if (url != undefined) {
                                        $window.open(url, "_self");
                                    } else {
                                        messageService.showMessage('Unable to print form', 'error', 'PRINT_FORM_ERROR', 0);
                                    }
                                    //call function to update printing animation
                                    showOrHidePrintingAnimation('response');
                                }, function (error) {
                                    //call function to update printing animation
                                    showOrHidePrintingAnimation('response');
                                });
                            }
                        });
                    }
                }, function (error) {
                    $log.error(error);
                });
            } else {
                EmailVerification($scope.printPackets);
            }
        };
        // function for open barcode Verification dialog
        var barcodeVerification = function (forms) {
            // configration for list of forms we have to show verification dialog
            var showVerificationConfig = ["dNYIT2", "dNYIT1099R", "dNYIT112R", "dNYIT114", "dNYIT201", "dNYIT201ATT", "dIT201D", "dNYIT201X", "dNYIT203", "dIT203D", "dNYIT203X", "dNYIT213", "dNYIT214"
                , "dNYIT216", "dNYIT225", "dNYIT272", "dNYC208", "dNYIT215", "dNYIT3601", "dNYIT204", "dSchNYIT204IP", "dSchNYIT2041", "dNYIT205"];
            _.forEach(forms, function (printForm) {
                if (showVerificationConfig.includes(printForm.docName)) {
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    localeService.translate("Filing your return on paper is not recommended. If it is necessary to file a paper return, do not write on the return. Only signatures are allowed. Other handwritten information will not be used in tax computation or for processing your return.",
                        'BARCODE_VERIFICATION').then(function (translatedText) {
                            var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
                        });
                    return;
                }
            })

        }
        //This function will return list of forms which are active in current return
        //Note: have to improve this function
        var _getActiveForms = function (isFederalOnly) {
            var activeForms = [];

            _.forEach($scope.forms, function (form) {
                if (!_.isUndefined(form.extendedProperties) && !_.isUndefined(form.extendedProperties.formStatus) && (form.extendedProperties.formStatus.toLowerCase() == 'active' || form.extendedProperties.formStatus.toLowerCase() == 'required')) {
                    activeForms.push(form);
                }
            });

            //Filter out federal forms if isFederalOnly is true
            if (isFederalOnly == true) {
                activeForms = $filter('stateFilter')(activeForms, 'federal');
            }

            return activeForms;
        };

        $scope.openDepriciationDialog = function (templateName) {
            var html = contentService.getLineTemplateUrl(templateName);
            var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': '1200px' }, html, "depreciationDialogController");

            // IF dialog returns successfully then there will be data
            // ELSE proceed further
            dialog.result.then(function (data) {
                if (data && data.type === 'printAsset') {
                    _.forEach($scope.forms, function (form) {
                        if (form.docName == data.docName) {
                            $scope.printForm(form, 'printSingleForm')
                            return true;
                        }
                    })
                } else if (data && data.type === 'emailAsset') {
                    //First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller			  
                    var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/dialog/emailAssetDepreciation.html", "EmailAssetsDialogController", { 'data': { header: data.docName } });
                    dialog.result.then(function (emailAddress) {
                        if (emailAddress) {
                            _.forEach($scope.forms, function (form) {
                                if (form.docName == data.docName) {
                                    $scope.printForm(form, 'printSingleForm', true).then(function (url) {
                                        var info = { pdfLink: url, email: emailAddress };
                                        if (data.docName === 'dVehicleDeprWkt') {
                                            info.formName = 'Vehicle Depreciation Summary';
                                        } else {
                                            info.formName = 'Asset Depreciation Summary';
                                        }
                                        returnService.emailDepriciation(info).then(function (res) {
                                            messageService.showMessage('Assest pritned pdf send successfully', 'success');
                                        });
                                    })
                                    return true;
                                }
                            })

                        }
                    }, function (btn) {
                        //cancel or close
                    });


                }

                console.log(data);
            }, function (error) {
                console.log(error);
            });
        };

        /**
	 * method to save the return and redirect user to interview mode
	 */
        $scope.goToInterView = function () {
            var path;
            $scope.saveReturn().then(function () {
                $scope.hasPermissionTochangeLocation = true;
                if (!_.isUndefined($routeParams.efileStatus) && $routeParams.efileStatus === 'alerts') {
                    //Note :- to re-initialize the controller we redirect user to blank page and from their again to the desire page
                    path = ('return/interview/' + $routeParams.id + '/alerts').toString().replace(/\//g, '_');
                } else if (!_.isUndefined($routeParams.efileStatus) && $routeParams.efileStatus === 'rejected') {
                    //Note :- to re-initialize the controller we redirect user to blank page and from their again to the desire page
                    path = ('return/interview/' + $routeParams.id + '/rejected').toString().replace(/\//g, '_');
                } else if (!_.isUndefined($routeParams.efileStatus) && $routeParams.efileStatus === 'bankRejected') {
                    //Note :- to re-initialize the controller we redirect user to blank page and from their again to the desire page
                    path = ('return/interview/' + $routeParams.id + '/bankRejected').toString().replace(/\//g, '_');
                } else {
                    //Note :- to re-initialize the controller we redirect user to blank page and from their again to the desire page
                    path = ('return/interview/' + $routeParams.id).toString().replace(/\//g, '_');
                }
                $location.path("/redirect/" + path);
            });

        };


        $scope.captureSignature = function () {
            //create captureObject based on spouse or preparer  
            var _fillingStatus = returnService.getElementValue('filstts', 'dMainInfo');

            var _taxPayerFirstName = returnService.getElementValue('tpfnmi', 'dMainInfo');
            var _taxPayerLastName = returnService.getElementValue('tplnm', 'dMainInfo');

            var _spouseFirstName = returnService.getElementValue('strspfnmi', 'dMainInfo');
            var _spouseLastName = returnService.getElementValue('strsplnm', 'dMainInfo');

            var _returnID = $routeParams.id;
            var captureObject = [];

            //taxpayer object
            var taxpayerObj = {
                type: 3,
                ID: _returnID,
                name: (_taxPayerFirstName == undefined ? "" : _taxPayerFirstName) + " " + (_taxPayerLastName == undefined ? "" : _taxPayerLastName),
            };

            //spouse object 
            var spouseObj = {
                type: 4,
                ID: _returnID,
                name: (_spouseFirstName == undefined ? "" : _spouseFirstName) + " " + (_spouseLastName == undefined ? "" : _spouseLastName),
            };

            //default taxpayer object 
            captureObject.push(taxpayerObj);

            if (_fillingStatus != undefined && _fillingStatus == 2) {
                captureObject.push(spouseObj);
            }

            signatureService.openSignatureCaptureDialog(captureObject).then(function (result) {
                if (angular.isDefined(result) && result === true) {
                    //force update
                    var getSignatureObj = { "typeList": [3, 4], "returnId": $routeParams.id };
                    signatureService.signatureViewAll(getSignatureObj, true).then(function (signaturesData) {
                    }, function (error) {
                    });
                }
            }, function (error) {
                $log.error(error);
            });

        };

        $scope.removeSignature = function (type) {
            var signatureTypeObject = { type: type, ID: $routeParams.id };
            signatureService.removeSignature(signatureTypeObject).then(function (signaturesData) {
                var getSignatureObj = { "typeList": [3, 4], "returnId": $routeParams.id };
                signatureService.signatureViewAll(getSignatureObj, true).then(function (signaturesData) {
                }, function (error) {
                });
            }, function (error) {
            });
        };

        $scope.getSignaturesData = function () {
            //only get signature data if user open toggle 

            if ($scope.signatureToggle.isOpen == false) {
                //get filling status 
                $scope.fillingStatus = returnService.getElementValue('filstts', 'dMainInfo');
                //pass return ID to get return's signature Data
                var getSignatureObj = { "typeList": [3, 4], "returnId": $routeParams.id };

                signatureService.signatureViewAll(getSignatureObj, false).then(function (signaturesData) {
                    if (signaturesData != undefined) {
                        if (signaturesData[3] != undefined && signaturesData[3].image != undefined)
                            $scope.TaxPayerSignatureData = signaturesData[3].image;
                        else
                            $scope.TaxPayerSignatureData = undefined;
                        if (signaturesData[4] != undefined && signaturesData[4].image != undefined)
                            $scope.SpouseSignatureData = signaturesData[4].image;
                        else
                            $scope.SpouseSignatureData = undefined;
                    }
                }, function (error) {
                });

            }
        };
        //stackNavigation functions-Start

        //Intilize flag for stack navigation(previous and next)
        $scope.isStackNavigationEnabled = { "previous": false, "next": false };
        //This will subscribe to get stackNavigation length
        var _stackNavigationSubscription = postal.subscribe({
            channel: 'MTPO-Return',
            topic: 'StackNavigation',
            callback: function (data, envelope) {
                if (data.type == "previous") {
                    $scope.isStackNavigationEnabled.previous = data.isStackNavigationEnabled;
                } else if (data.type == "next") {
                    $scope.isStackNavigationEnabled.next = data.isStackNavigationEnabled;
                }
            }
        });

        //This varible is used to store current stacknavigation form data
        var _currentFormInStackNavigation;

        $scope.goToStackNavigation = function (type) {
            if (type == "previous") {

                //Push current form instance to next stack navigation
                if (_currentFormInStackNavigation == undefined) {
                    //add current form docIndex and docName to next stack navigation
                    returnService.addToStackNavigation({ "docIndex": _currentForm.docIndex, "docName": _currentForm.docName }, "next");
                } else {
                    returnService.addToStackNavigation(_currentFormInStackNavigation, "next");
                    _currentFormInStackNavigation = undefined;
                }

                //get Form from previous stack navigation and load
                _currentFormInStackNavigation = returnService.getFromStackNavigation("previous");
                $scope.goToERCField(_currentFormInStackNavigation, true);
            } else if (type == "next") {

                //Push current form instance to previous stack navigation
                if (_currentFormInStackNavigation == undefined) {
                    //add current form docIndex and docName to previous stack navigation
                    returnService.addToStackNavigation({ "docIndex": _currentForm.docIndex, "docName": _currentForm.docName }, "previous");
                } else {
                    returnService.addToStackNavigation(_currentFormInStackNavigation, "previous");
                    _currentFormInStackNavigation = undefined;
                }

                //get Form from next stack navigation and load
                _currentFormInStackNavigation = returnService.getFromStackNavigation("next");
                $scope.goToERCField(_currentFormInStackNavigation, true);
            }
        }

        //stackNavigation functions-End

        //Toolbar Functions - End

        //ERC Pane Functions - Start

        //Initiate ERC
        $scope.performReview = function (isERCPanelRequired, docNames) {
            //Only if ERC panel is visible.
            //Or if there is no need to show ERC Panel. This is used to bypass screen to check is there any ERC by pressing E-File button in toolbar
            if ($scope.performReviewFlag == true || isERCPanelRequired == false) {
                //Enable loading animation
                $scope.isERCLoading = true;
                if ($scope.betaOnly()) {
                    $scope.recalcReturn()
                    $scope.isCallPerformReview = true;
                    $scope.performReviewDoc = docNames;
                } else {
                    //invoke ERC computation in service
                    returnService.performReview(docNames);
                }
            }
        };

        // call method afer Done Recalculation
        $scope.doPerformReview = function () {
            //invoke ERC computation in service
            returnService.performReview($scope.performReviewDoc);
        }

        //Load Review Errors (ERC) from return service.
        //Note: This function will be called from either grid or broadcast event received from return service.
        var _initAvailableERC = function () {
            $scope.availableERC = returnService.getReviewErrors();
            //Note:- In interview mode we have to show required and estimated erc data if exist otherwise all data is shown
            if ($scope.returnMode == 'interview') {
                $scope.availableERC = $filter('interviewERCFilter')($scope.availableERC);
            }
        };

        //This function will be called when ERC calculated.
        var _reloadERC = function () {
            $log.debug('ERC reload');
            //get ERC Data
            _initAvailableERC();
            //
            if (!_.isEmpty($scope.availableERC) && !_.isUndefined(_.find($scope.availableERC, { 'severity': 'Reject' }))) {
                $scope.isRejectERCPending = true;
            } else {
                $scope.isRejectERCPending = false;
            }
            //Reload ERC Grid
            $scope.ercGrid.reload();

            //Reset flags
            isServiceERC = false;
            isCalcERC = false;

            //Turn off loading animation
            $scope.isERCLoading = false;
        };

        //Jump to field (and form) for which this error is displayed.
        //Note: This function is called from ERC Grid with error object.
        $scope.goToERCField = function (ercObject, doNotAddToStackNavigation) {
            //Element name on which we have to jump
            var elementId = ercObject.docName + '.' + ercObject.fieldName + '-' + ercObject.docIndex;
            $log.debug('elementId for jump - ' + elementId);
            //Check if the form to which element belongs is currently loaded or not.
            //Note: We have divided operation in two parts, because there is an issue on checking is CurrentForm two times.
            if (angular.isDefined(ercObject.form.docIndex) && _currentForm.docIndex !== ercObject.form.docIndex) {
                //Load Form.
                _loadForm(ercObject.form, doNotAddToStackNavigation);
                //Refresh Form Tree (left)(to expand category)
                _refreshFormTree(ercObject.form);
                //Listen for event which is broadcasted by taxForm directive after form is loaded.
                //Note: we have used variable for listening broadcast. As we have to unregister this broadcast after execution.
                //Otherwise it will create duplicate listeners. 
                if (ercObject.fieldName != undefined) {
                    var listenFormLoad = $scope.$on('formLoaded', function () {
                        $log.debug('formLoaded event listened by controller');
                        //Issue: There is currently issue that when we are firing focus event html is not loaded.
                        $timeout(function () {
                            //Trigger focus on element 
                            //this condition is added to focus on disabled field
                            if (document.getElementById(elementId).disabled == true) {
                                document.getElementById(elementId).disabled = false;
                                document.getElementById(elementId).focus();
                                document.getElementById(elementId).disabled = true
                            } else {
                                document.getElementById(elementId).focus();
                            }

                            //Issue: Below code is not working for some elements. Thats why we are using pure javascript for focus
                            /*var elementToJump = angular.element(document.getElementById(elementId));
                            elementToJump.triggerHandler('focus');
                            elementToJump=null;*/
                        }, 1000);

                        //Unregister Listener to avoid duplication. As this litener will be register on every call
                        listenFormLoad();
                    });
                }
            } else if (elementId != 'undefined.undefined-undefined') {
                //Trigger focus on element
                if (ercObject.fieldName != undefined) {
                    //this condition is added to focus on disabled field
                    if (document.getElementById(elementId).disabled == true) {
                        document.getElementById(elementId).disabled = false;
                        document.getElementById(elementId).focus();
                        document.getElementById(elementId).disabled = true
                    } else {
                        document.getElementById(elementId).focus();
                    }
                }
                //Issue: Below code is not working for some elements. Thats why we are using pure javascript for focus 
  			/*var elementToJump = angular.element(document.getElementById(elementId));
  			elementToJump.triggerHandler('focus');
  			elementToJump=null;*/
            }
        };

        //Jump to field (and form) for which this error is displayed.
        //Note: This function is called from rejected Grid with error object.
        $scope.goTorejectedFileld = function (rejectObj) {
            if (rejectObj.field !== undefined && rejectObj.field.indexOf('.') > -1) {
                var docWithField = rejectObj.field.split('.');
                var seldocName = docWithField[0];
                var selfieldName = docWithField[1];
                var selindex = returnService.getIndex(seldocName);
                if (selindex !== undefined && selindex.length > 0) {
                    var result = returnService.getFormFromDoc(seldocName, selindex[0]);
                    if (result !== undefined && result != null) {
                        result.docName = seldocName;
                        result.fieldName = selfieldName;
                        result.docIndex = result.form.docIndex;
                        $scope.goToERCField(result)
                    }
                }
            }
        }

        //Listener 


        //ERC Pane Functions - End

        //Common UI Functions - Start
        /**
	 * This function is used to add form from docName.
	 * If passed form is multi instance then it will add new form everytime.
	 * Otherwise it will check if that form is already added or not. If single instance form is already added then it will just load it. 
	 */
        $scope.addFormByDocName = function (docName) {
            //Get form details
            var formToAdd = _.find($scope.availableForms, { 'docName': docName });
            if (angular.isDefined(formToAdd)) {
                //Check if multiple form allowed
                if (formToAdd.isMultiAllowed == true && (formToAdd.maxOccurs > 1 || formToAdd.maxOccurs)) {
                    $scope.addForm(formToAdd);
                } else {
                    //Check if form already exist or not
                    var existingForm = _.find($scope.forms, { 'docName': docName });
                    if (angular.isDefined(existingForm)) {
                        //If form exist just load it (do not add new)
                        $scope.loadFormWithRefreshTree(existingForm);
                    } else {
                        $scope.addForm(formToAdd);
                    }
                }
            }
        };

        /**
	 * method prepared to open dialog when user wnat to import schedule C/D data from the excel to the return
	 */
        $scope.openScheduleImportDialog = function () {
            var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                "taxAppJs/return/workspace/partials/scheduleImportDialog.html", "importScheduleController");
            //data contains :- (1) formDetail - object that contains the form detail which is imported(i.e docName,displayName,docIndex(if form is existing),objType(either 'New' or 'Existing')
            //				   (2) generalData - array of object that contains all those data whose either 1099B received column or 1099BReportedToIRS column missing
            //					   For schedule c form the imported data will be in generalData array 
            //				   (3) scenerioA - array of object that contains all those data which has 1099B received with the basic report to IRS (i.e YES,YES)
            //				   (4) scenerioB - array of object that contains all those data which has 1099B received with NOT basic report to IRS (i.e YES,NO)
            //				   (5) scenerioC - array of object that contains all those data which has NOT 1099B received and NOT basic report to IRS (i.e NO,NO)
            dialog.result.then(function (importedData) {
                var _parentFormProp = angular.copy(returnService.getSingleAvailableForm(importedData.formDetail.docName));
                if (importedData.formDetail.docName == 'dSchD' || importedData.formDetail.docName == 'dSchedule1041D' || importedData.formDetail.docName == 'dSch1120SchD' || importedData.formDetail.docName == 'dSch1120SSchD') {
                    if (importedData.formDetail.docName == 'dSchD') {
                        var mapPropWithStmColumn = {
                            "shortTerm": [
                                { propName: 'description', fieldName: 'PropertyDescription40' },
                                { propName: 'dateAquired', fieldName: 'DateAcquired40' },
                                { propName: 'DateVariousAcq', fieldName: 'DateVariousAcq' },
                                { propName: 'dateSoldOrDisposed', fieldName: 'DateSold40' },
                                { propName: 'proceeds', fieldName: 'SalesPrice40' },
                                { propName: 'costOrOtherBasis', fieldName: 'CostOrOtherBasis40' },
                                { propName: 'code', fieldName: 'AdjustmentsToGainOrLossCd40' },
                                { propName: 'adjustment', fieldName: 'AmountAdjustment' }
                            ],
                            "longTerm": [
                                { propName: 'description', fieldName: 'PropertyDescription40L' },
                                { propName: 'dateAquired', fieldName: 'DateAcquired40L' },
                                { propName: 'DateVariousAcq', fieldName: 'DateVariousAcq' },
                                { propName: 'dateSoldOrDisposed', fieldName: 'DateSold40L' },
                                { propName: 'proceeds', fieldName: 'SalesPrice40L' },
                                { propName: 'costOrOtherBasis', fieldName: 'CostOrOtherBasis40L' },
                                { propName: 'code', fieldName: 'AdjustmentsToGainOrLossCd40L' },
                                { propName: 'adjustment', fieldName: 'AmountAdjustmentL' }
                            ]
                        };
                    } else if (importedData.formDetail.docName == 'dSchedule1041D' || importedData.formDetail.docName == 'dSch1120SchD' || importedData.formDetail.docName == 'dSch1120SSchD') {
                        var mapPropWithStmColumn = {
                            "shortTerm": [
                                { propName: 'description', fieldName: 'PropertyDescription' },
                                { propName: 'dateAquired', fieldName: 'DateAcquired' },
                                { propName: 'dateSoldOrDisposed', fieldName: 'DateSold' },
                                { propName: 'proceeds', fieldName: 'SalesPrice' },
                                { propName: 'costOrOtherBasis', fieldName: 'CostOrOtherBasis' },
                                { propName: 'code', fieldName: 'AdjustmentsToGainOrLossCd' },
                                { propName: 'adjustment', fieldName: 'AdjustmentsToGainOrLossAmt' }
                            ],
                            "longTerm": [
                                { propName: 'description', fieldName: 'PropertyDescription2' },
                                { propName: 'dateAquired', fieldName: 'DateAcquired2' },
                                { propName: 'dateSoldOrDisposed', fieldName: 'DateSold2' },
                                { propName: 'proceeds', fieldName: 'SalesPrice2' },
                                { propName: 'costOrOtherBasis', fieldName: 'CostOrOtherBasis2' },
                                { propName: 'code', fieldName: 'AdjustmentsToGainOrLossCd2' },
                                { propName: 'adjustment', fieldName: 'AdjustmentsToGainOrLossAmt2' }
                            ]
                        };
                    }
                    if (importedData.formDetail.objType == 'New') {
                        returnService.addForm(_parentFormProp).then(function (formDetail) {
                            returnService.importDataToForm(formDetail, importedData, mapPropWithStmColumn);
                            $scope.loadFormWithRefreshTree(formDetail);
                        });
                    } else if (importedData.formDetail.objType == 'Existing') {
                        _parentFormProp.docIndex = importedData.formDetail.docIndex;
                        returnService.importDataToForm(_parentFormProp, importedData, mapPropWithStmColumn);
                        $scope.loadFormWithRefreshTree(_parentFormProp);
                    }

                } else if (importedData.formDetail.docName == 'dSchC') {
                    var mapPropWithStmDocName = [
                        [{ propName: 'incomeDesc', stmName: 'dAdditionalCashIncome', fieldName: 'Description' },
                        { propName: 'incomeAmt', stmName: 'dAdditionalCashIncome', fieldName: 'Amount' }],
                        [{ propName: 'advertisingDesc', stmName: 'dSchCLi8AdvStmt', fieldName: 'Description' },
                        { propName: 'advertisingAmt', stmName: 'dSchCLi8AdvStmt', fieldName: 'Amount' }],
                        [{ propName: 'contractLaborDesc', stmName: 'dSchCLi11ConLabStmt', fieldName: 'Description' },
                        { propName: 'contractLaborAmt', stmName: 'dSchCLi11ConLabStmt', fieldName: 'Amount' }],
                        [{ propName: 'interest', fieldName: 'MortgageInterestPaidOtherAmt', isTotalAmount: true }],
                        [{ propName: 'homeInterestDesc', stmName: 'dSchCLi16AMortgageStmt', fieldName: 'Description' },
                        { propName: 'homeInterestAmt', stmName: 'dSchCLi16AMortgageStmt', fieldName: 'Amount' }],
                        [{ propName: 'propertyTaxesDesc', stmName: 'dSchCLi23TaxeLicencesStmt', fieldName: 'Description' },
                        { propName: 'propertyTaxesAmt', stmName: 'dSchCLi23TaxeLicencesStmt', fieldName: 'Amount' }],
                        [{ propName: 'repairsAndMaintenanceDesc', stmName: 'dSchCLi21RepMaiStmt', fieldName: 'Description' },
                        { propName: 'repairsAndMaintenanceAmt', stmName: 'dSchCLi21RepMaiStmt', fieldName: 'Amount' }],
                        [{ propName: 'utilitiesDesc', stmName: 'dSchCLi25UtilitiesExpenseStmt', fieldName: 'Description' },
                        { propName: 'utilitiesAmt', stmName: 'dSchCLi25UtilitiesExpenseStmt', fieldName: 'Amount' }],
                        [{ propName: 'otherExpensesDesc', stmName: 'dSchCOtherExpenses', fieldName: 'Description' },
                        { propName: 'otherExpensesAmt', stmName: 'dSchCOtherExpenses', fieldName: 'Amount' }]
                    ];
                    //condition to check that array is defiend and not empty
                    //This section will only be executed when the imported form is schedule C
                    if (!_.isUndefined(importedData.generalData) && !_.isEmpty(importedData.generalData)) {
                        if (!_.isUndefined(importedData.formDetail.objType) && importedData.formDetail.objType == 'New') {
                            returnService.addForm(_parentFormProp).then(function (formDetail) {
                                returnService.importDataToForm(formDetail, importedData.generalData, mapPropWithStmDocName);
                                $scope.loadFormWithRefreshTree(formDetail);
                            });
                        } else {
                            _parentFormProp.docIndex = importedData.formDetail.docIndex;
                            returnService.importDataToForm(_parentFormProp, importedData.generalData, mapPropWithStmDocName);
                            $scope.loadFormWithRefreshTree(_parentFormProp);
                        }
                    }

                }
            }, function (btn) {

            });
        };

        /**
	 * method to mark return as default/remove return from default
	 * @param action - it is their to decide whether return is to be added to default or to be removed 
	 */
        $scope.manageDefaultReturn = function (action) {
            if (action == 'ADD') {
                var data = { returnId: $routeParams.id };
                //client detail of open return get form the header 
                var clientInfo = returnService.getValueFromHeader('client');
                //condition kept because when the package is other than 1040 than client info dont have firstName and lastName it has company name 
                //so we have assigned the company name to return title
                if (_.isUndefined(clientInfo.firstName) && !_.isUndefined(clientInfo.companyName))
                    data.returnTitle = clientInfo.companyName;
                else
                    data.returnTitle = !_.isUndefined(clientInfo.lastName) ? clientInfo.firstName + ' ' + clientInfo.lastName : clientInfo.firstName;
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' },
                    "taxAppJs/common/partials/setReturnAsDefault.html", "setReturnAsDefaultController", data);
                dialog.result.then(function (defaultReturnTitle) {
                    $scope.isDefaultReturn = returnService.setValueToHeader('isDefaultReturn', true);
                    //Note :- This variable is not used any where it is only done to set the default return title in taxReturn header
                    var returnTitle = returnService.setValueToHeader('defaultReturnTitle', defaultReturnTitle);
                    messageService.showMessage('Return added to default', 'success', 'RETURN_MAKEDEFAULT_SUCCESS');
                });
            } else if (action == 'REMOVE') {
                //service method call which calls the API to remove the return from default
                returnService.manageDefaultReturn(action, $routeParams.id).then(function (response) {
                    $scope.isDefaultReturn = returnService.setValueToHeader('isDefaultReturn', false);
                    messageService.showMessage('Return has been removed from default', 'success', 'RETURNREMOVED_FROM_DEFAULT');
                }, function (error) {
                    $log.error(error);
                });
            }
        };

        /*
	 * this portion will be executed when formToAdd is undefined and user is selected More Forms from drop down
	 * It will open the dropdown of all froms
	 */
        $scope.openMoreFormsDropDown = function (event) {
            event.preventDefault();
            event.stopPropagation();
            $scope.addFormToogle.isOpen = !$scope.addFormToogle.isOpen;
            document.getElementById('step1').click()
            // if ($scope.addFormToogle.isOpen) {
            //     document.getElementById("addFormDropdown").classList.add("show");
            //     document.getElementById("availableQuickForms").classList.remove("show");
            // }
            // else {
            //     document.getElementById("addFormDropdown").classList.remove("show");
            //     document.getElementById("availableQuickForms").classList.add("show");
            // }
        };
        //Common UI Functions - End

        //Questionable Code - Need to review (Required or Not ?) - Start
        $scope.languageSelected = 'en-US';
        contentService.setPreferedLanguage('en-US');

        $scope.$watch('languageSelected', function (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                contentService.setPreferedLanguage(newVal);
                $rootScope.$broadcast('localChanged', newVal);
            }
        }, true);

        //Questionable Code - Need to review (Required or Not ?) - End

        //context Menu raise this event
        // We were used to add forms directly,
        // Now we open a dialog for parent child relationship. so we call addForms function.
        $scope.$on('addForm', function ($event, form, doNotAddToStackNavigation) {
            // Array will hold list of selected form
            var formList = [];
            // If form is type of array then proceed further
            if (!_.isArray(form)) {
                formList.push(form);
            } else {
                formList = form;
            }

            //Loop through formlist.
            _.forEach(formList, function (obj, index) {
                //get all properties of form
                //Note: We require to have copy object to avoid unnecessary two way data binding.
                var formObj = angular.copy(returnService.getSingleAvailableForm(obj.docName));

                if (!_.isUndefined(formObj)) {
                    // add letsAdd property true to add form
                    formObj.letsAdd = true;
                    //Update form entry in list with updated one
                    formList[index] = formObj;
                }
            });
            // call addforms function.
            //Here we pass flag true that informs loadForm  do not add currentform to the stack navigaton
            //because it is already added
            $scope.addForms(formList, doNotAddToStackNavigation);
        });

        //context Menu raise this event
        $scope.$on('loadForm', function ($event, form, doNotAddToStackNavigation) {
            //Here we pass flag true that informs loadForm  do not add currentform to the stack navigaton
            //because it is already added
            _loadForm(form, doNotAddToStackNavigation);
            //Refresh form tree when loading form as part of go to field
            _refreshFormTree(form);
        });

        //return service raise this event
        $scope.$on('calcDone', function () {
            $scope.isCalcRunning = false;

            //Disable Text loading animation
            $scope.isRecalculateReturn = false;

            //Disable animation
            $scope.isSplitReturn = false;

            //Note: Do not remove $scope apply from here. It is required to update ui as per updated properties and values due to calculation cycle.
            $scope.$apply();

            //set Confirmation dialog falg to ture as due to calculation there may be some changes in return
            askForSaveConfirmation = true;

            //changeTracker indicator for auto save
            isReturnChangedForAutoSave = true;

            // send data to print preview app.		
            sendDataToPrintPreviewApp();
        });

        /**		
         * send to real time print preview app.		
         */
        var sendDataToPrintPreviewApp = function () {
            webRTCService.sendMessage(returnService.getDataToSendToPrintPreview());
            localStorageUtilityService.addToLocalStorage('returnPreview', returnService.getDataToSendToPrintPreview())
        }

        //return service raise this event
        $scope.$on('calcStarted', function () {
            $scope.isCalcRunning = true;
            //Note: Do not remove $scope apply from here. It is required to update ui as per updated properties and values due to calculation cycle.
            $scope.$apply();
        });

        //return service raise this event
        $scope.$on('calcFormAdded', function () {
            //Refresh available form list and add form grid
            _refreshAddForm();
        });

        //return service raise this event when hasRequiredFields changed for any form
        $scope.$on('hasRequiredFieldsChanged', function () {
            //Update status of all forms in tree
            _refreshFormTreeStatus();
            if ($scope.betaOnly()) {
                if ($scope.isCallPerformReview == true) {
                    $scope.isCallPerformReview = false;
                    $scope.doPerformReview();
                }
                $scope.ChangeOnNonResiWkt();
            }
        });

        //return service will raise this event to update overview (AGI,Refund,Owe) after calculation cycle 
        //Note: Have to optimize this function
        // For More return type we need to write conditions here
        $scope.$on('updateReturnOverview', function (event, result, packgeName) {
            if (!_.isUndefined(result) && !_.isUndefined($scope.formTree)) {
                if (packgeName == "1040" || packgeName == "1041") {
                    //For Federal AGI
                    if (angular.isUndefined(result.fedAGI) || result.fedAGI == '' || result.fedAGI == null)
                        $scope.formTree.fedAGI = 0;
                    else
                        $scope.formTree.fedAGI = result.fedAGI;

                    //For Federal Refund/Owe- Default will be 'Refund $0'
                    //Note: Here we have append '$' with value, other wise we have to write ng-show/hide on html. 
                    //Which will add one more watch (internally) on any operation and may contribute to degrade performance.
                    if (angular.isUndefined(result.fedOwe) || result.fedOwe == '' || result.fedOwe == null)
                        $scope.formTree.fedOwe = undefined;
                    else
                        $scope.formTree.fedOwe = result.fedOwe;

                    //Check for Refund only if there is no Refund
                    if (_.isUndefined($scope.formTree.fedOwe)) {
                        if (angular.isUndefined(result.fedRefund) || result.fedRefund == '' || result.fedRefund == null)
                            $scope.formTree.fedRefund = 0;//Defalut value 0
                        else
                            $scope.formTree.fedRefund = result.fedRefund;
                    } else {
                        $scope.formTree.fedRefund = undefined;
                    }
                } else if (packgeName == "1065") {
                    //Check for BIS only if package 1065
                    if (angular.isUndefined(result.fedBIS) || result.fedBIS == '' || result.fedBIS == null) {
                        $scope.formTree.fedBIS = 0;//Defalut value 0
                    } else {
                        $scope.formTree.fedBIS = result.fedBIS;
                    }

                    //For Federal Refund/Owe- Default will be 'Refund $0'
                    //Note: Here we have append '$' with value, other wise we have to write ng-show/hide on html. 
                    //Which will add one more watch (internally) on any operation and may contribute to degrade performance.
                    if (angular.isUndefined(result.fedOwe) || result.fedOwe == '' || result.fedOwe == null)
                        $scope.formTree.fedOwe = undefined;
                    else
                        $scope.formTree.fedOwe = result.fedOwe;

                    //Check for Refund only if there is no Refund
                    if (_.isUndefined($scope.formTree.fedOwe)) {
                        if (angular.isUndefined(result.fedRefund) || result.fedRefund == '' || result.fedRefund == null)
                            $scope.formTree.fedRefund = 0;//Defalut value 0
                        else
                            $scope.formTree.fedRefund = result.fedRefund;
                    } else {
                        $scope.formTree.fedRefund = undefined;
                    }
                } else if (packgeName == "1120" || packgeName == "990") {
                    //For Federal TAX
                    if (angular.isUndefined(result.fedTAX) || result.fedTAX == '' || result.fedTAX == null)
                        $scope.formTree.fedTAX = 0;
                    else
                        $scope.formTree.fedTAX = result.fedTAX;

                    //For Federal Refund/Owe- Default will be 'Refund $0'
                    //Note: Here we have append '$' with value, other wise we have to write ng-show/hide on html. 
                    //Which will add one more watch (internally) on any operation and may contribute to degrade performance.
                    if (angular.isUndefined(result.fedOwe) || result.fedOwe == '' || result.fedOwe == null)
                        $scope.formTree.fedOwe = undefined;
                    else
                        $scope.formTree.fedOwe = result.fedOwe;

                    //Check for Refund only if there is no Refund
                    if (_.isUndefined($scope.formTree.fedOwe)) {
                        if (angular.isUndefined(result.fedRefund) || result.fedRefund == '' || result.fedRefund == null)
                            $scope.formTree.fedRefund = 0;//Defalut value 0
                        else
                            $scope.formTree.fedRefund = result.fedRefund;
                    } else {
                        $scope.formTree.fedRefund = undefined;
                    }
                } else if (packgeName == "1120s") {
                    //For Federal TAX
                    if (angular.isUndefined(result.fedTAX) || result.fedTAX == '' || result.fedTAX == null)
                        $scope.formTree.fedTAX = 0;
                    else
                        $scope.formTree.fedTAX = result.fedTAX;

                    //For Federal Refund/Owe- Default will be 'Refund $0'
                    //Note: Here we have append '$' with value, other wise we have to write ng-show/hide on html. 
                    //Which will add one more watch (internally) on any operation and may contribute to degrade performance.
                    if (angular.isUndefined(result.fedOwe) || result.fedOwe == '' || result.fedOwe == null)
                        $scope.formTree.fedOwe = undefined;
                    else
                        $scope.formTree.fedOwe = result.fedOwe;

                    //Check for Refund only if there is no Refund
                    if (_.isUndefined($scope.formTree.fedOwe)) {
                        if (angular.isUndefined(result.fedRefund) || result.fedRefund == '' || result.fedRefund == null)
                            $scope.formTree.fedRefund = 0;//Defalut value 0
                        else
                            $scope.formTree.fedRefund = result.fedRefund;
                    } else {
                        $scope.formTree.fedRefund = undefined;
                    }
                }

                //For State
                _initAddedStates();

                //Update UI
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        });

        //listener for beforeChangeEventIntro
        var beforeChangeEventIntro = $scope.$on("beforeChangeEventIntro", function (event, targetElement, type) {
            console.info("Before Change Event called return controller.");
            if (type == "beforeEvent") {
                $scope.bottomPanelFlag = true;
                $scope.performReviewFlag = true;

                if (!_.isUndefined(targetElement) && !_.isUndefined(targetElement.id) && targetElement.id != "") {
                    if (targetElement.id == "step4") {
                        //Open federal accordian if not
                        if (!_.isUndefined($scope.formTree) && !_.isUndefined($scope.formTree.fedAccordionOpen) && $scope.formTree.fedAccordionOpen != true) {
                            $scope.formTree.fedAccordionOpen = true;
                        }

                        //Open federal category if not
                        var curCategory = _.find($scope.categories, { name: "Federal" });
                        if (!_.isUndefined(curCategory) && curCategory.isOpen != true) {
                            curCategory.isOpen = true;
                        }

                        //following class added for positioning element properly.
                        angular.element(targetElement.parentElement).addClass("intro_active_li");
                    } else if (targetElement.id == "step3") {
                        //Open federal accordian if not
                        if (!_.isUndefined($scope.formTree) && !_.isUndefined($scope.formTree.fedAccordionOpen) && $scope.formTree.fedAccordionOpen != true) {
                            $scope.formTree.fedAccordionOpen = true;
                        }
                    } else if (targetElement.id == "step11") {
                        //get opened state if any.
                        var openedState = _.find($scope.returnStates, { isOpen: true });

                        //IF no state is opened then open first state from the list.    			
                        if (_.isUndefined(openedState)) {
                            $scope.returnStates[0].isOpen = true;
                        }
                    } else {
                        //ELSE we remove class or flags that were used to open certain div's
                        angular.element(targetElement.parentElement).removeClass("intro_active_li");
                    }
                }
            } else {
                $scope.bottomPanelFlag = false;
                $scope.performReviewFlag = false;
            }
        });

        //To listen for completion of ERC calculations
        $scope.$on('performReviewDone', function () {
            $log.debug('ERC - calc');
            if (isServiceERC == true) {
                isCalcERC = true;
                _reloadERC();
            } else {
                //As service side ERC is still not finished just make calc ERC flag true
                isCalcERC = true;
            }
        });

        //To listen for completion of ERC (mandatory & required) service side
        $scope.$on('performReviewDoneServiceSide', function () {
            $log.debug('ERC - service');
            if (isCalcERC == true) {
                isServiceERC = true;
                _reloadERC();
            } else {
                //As calc side ERC is still not finished just make service ERC flag true
                isServiceERC = true;
            }
        });

        //Listen for event which is broadcasted by taxForm directive after form is loaded.
        //Issue: We have to listen and fire anchorscroll in timeout as there is an issue. 
        //If we do this without timeout. HTML was not rendered on browser and thus this will not work.
        $scope.$on('formLoaded', function () {
            //Below lines are written to automatically scroll the form to the top when new form is loaded 
            //taxform is the id of the current where form loaded in taxForm
            //Note: We can not use anchorScroll of angular as it reload page when using parameter with routeProvider.
            // New Note: Here we comment below function as after release of new app scrollIntoView with no parameter passed has caused a issue that
            //           hides application header.Here, we move below scroll function to taxForm directive and implemet diffrent logic for scroll to top
            //           of the form when form loads
            // $timeout(function () {
            //     // document.getElementById('taxform').scrollIntoView();
            // }, 500);
        });

        //initialize interval for auto save at 2 minutes. 
        //Note: Currently it is hard coded but it should be come from config.
        var initSaveReturnInterval = function () {
            if (angular.isUndefined(autoSaveInterval)) {
                // If return is locked then we don't allow save.
                if ($scope.lockToggle.isLocked == false && $scope.SignlockToggle.isRemoteSignLocked !== true) {
                    autoSaveInterval = $interval(function () {
                        if (isReturnChangedForAutoSave == true && $scope.lockToggle.isLocked == false
                            && $scope.SignlockToggle.isRemoteSignLocked !== true) {
                            if ($scope.returnMode == 'interview') {
                                //called the interviewController function to push the config to taxReturn
                                //Note :- interviewController is the child controller so we have to use $scope.$$childHead to call child controller function in parent
                                //we need to find another way to do this as $$childHead can be change any time
                                $scope.$$childHead.pushInterviewConfig();
                            }
                            $scope.saveReturn(true);
                        }
                    }, 120000, 0, false);
                }
            }
        };

        //Listen for splitbar drag and drop to update scrollbar in ERC grid
        //Note: This broadcast will have height of North Panel. We have calculated height for grid based on this.
        $scope.$on('uiSplitbarChanges', function (event, data) {
            //Check if data
            if (angular.isDefined(data)) {
                if (angular.isUndefined($scope.ercTable)) {
                    $scope.ercTable = {};
                }

                //Function calculate div's height dynamically 
                getElementHeights(data);
                //Apply for digest to update height in erc grid for scrollbar
                $scope.$apply();
            }
        });

        //Listen recalculate broadcast to enable animated loading
        //Note: full recalculate in return service also broadcasting this to have same animate loading as recalculate
        $scope.$on('enableRecalculateLoading', function () {
            $scope.isRecalculateReturn = true;
        });

        //Listen reloadIfCurentform to reload current form if it's all calculation has been fired.
        //Note: This is mainly used to reload added forms after its all calculation fired first time. Because statement added by calculation was not updated until that form re open.	 
        $scope.$on('reloadIfCurentform', function (event, docIndex) {
            //Check if current form index and index of doc for which all methods fired (means addDoc) are same or not
            if (_currentForm.docIndex == docIndex) {
                //Reload form html
                $scope.$broadcast('showForm');
            }
        });

        var SignUnlockForm = $scope.$on("SignunlockForm", function () {
            $scope.SignlockToggle.isRemoteSignLocked = returnService.setRemoteSignLocked(false);
        });


        /**
	 * method to show and hide the long text in form depends on user preferences
	 */
        $scope.toggleFullTextPrefrence = function () {

            //condition to check preference of the user exist or not
            if (!_.isUndefined($scope.userSettings.preferences) && !_.isUndefined($scope.userSettings.preferences.returnWorkspace)) {
                $scope.userSettings.preferences.returnWorkspace.wrapText = (!_.isUndefined($scope.userSettings.preferences.returnWorkspace.wrapText)) ? !$scope.userSettings.preferences.returnWorkspace.wrapText : true;
            } else {
                if (_.isUndefined($scope.userSettings.preferences)) {
                    $scope.userSettings.preferences = {};
                    $scope.userSettings.preferences.returnWorkspace = {};
                } else if (_.isUndefined($scope.userSettings.preferences.returnWorkspace)) {
                    $scope.userSettings.preferences.returnWorkspace = {};
                }
                $scope.userSettings.preferences.returnWorkspace.wrapText = true;
            }
            //called the changeSetting function in order to update the user preferences 
            userService.changeSettings('preferences', $scope.userSettings.preferences);
        };

        // openTextMessage method will open textbox to send text message 
        $scope.openTextMessage = function () {
            var doc = returnService.getTPNameAndCellNumber();
            var data = { 'recipientName': doc.name, 'cellNumber': doc.number, 'message': '' };
            dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' }, "taxAppJs/common/partials/textMessageDialog.html", "textMessageDialogController", data);
            // var dialog =      // dialog.result.then(function (result) {console.log(result)});
        }

        /**
     * method to show and hide the feature according to the reseller config
     */
        $scope.hasFeature = function (featureName) {
            return resellerService.hasFeature(featureName);
        };

        $scope.getStateOfReturn = function () {
            var stateList = returnService.getStateOfReturn();
            $scope.isStateAdded = false
            if (stateList !== undefined && stateList.length > 0) {
                for (var i10 = 0; i10 < stateList.length; i10++) {
                    if (stateList[i10] !== '' && stateList[i10] !== 'federal') {
                        $scope.isStateAdded = true;
                        break;
                    }
                }
            }
        }
        /**
        * close return workspace and set 
        * location path accordingly
        */
        $scope.closeReturn = function () {
            _openConfirmDialog('closeReturn').then(function (result) {
                if (result == true) {//if result is yes then perform action
                    //set previous path customReturn if return open from custom template list
                    var previousPathForOtherNav = basketService.popItem('previousPathForOtherNav');
                    if (!_.isUndefined(previousPathForOtherNav)) {
                        $location.path(previousPathForOtherNav);
                    } else {
                        // var path = $location.$$url;
                        SetPathOnCloseDailog('/home');

                    }
                }
            });
        };

        // remove Depreciation and add Vehicle with same parent
        $scope.ChangeToVehicle = function (doc) {
            var docDetail = returnService.getDoc(doc.docName, doc.docIndex);
            var formProperty = angular.copy(returnService.getSingleAvailableForm('dVehicleDeprWkt'));
            returnService.addForm(formProperty, undefined, doc.parentDocIndex).then(function (formTobeLoad) {
                if (docDetail !== undefined) {
                    if (docDetail.AssetRelatedForm != undefined && docDetail.AssetRelatedForm.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.VehicleRelatedForm', index: formTobeLoad.docIndex, newVal: docDetail.AssetRelatedForm.value });
                    }
                    if (docDetail.fieldem != undefined && docDetail.fieldem.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldaf', index: formTobeLoad.docIndex, newVal: docDetail.fieldem.value });
                    }
                    if (docDetail.fielden != undefined && docDetail.fielden.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldfw', index: formTobeLoad.docIndex, newVal: docDetail.fielden.value });
                    }
                    if (docDetail.fieldel != undefined && docDetail.fieldel.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldfv', index: formTobeLoad.docIndex, newVal: docDetail.fieldel.value });
                    }
                    if (docDetail.fieldek != undefined && docDetail.fieldek.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldfu', index: formTobeLoad.docIndex, newVal: docDetail.fieldek.value });
                    }
                    if (docDetail.fieldei != undefined && docDetail.fieldei.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldfs', index: formTobeLoad.docIndex, newVal: docDetail.fieldei.value });
                    }
                    if (docDetail.fieldcm != undefined && docDetail.fieldcm.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fielddv', index: formTobeLoad.docIndex, newVal: docDetail.fieldcm.value });
                    }
                    if (docDetail.fieldcl != undefined && docDetail.fieldcl.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldfk', index: formTobeLoad.docIndex, newVal: docDetail.fieldcl.value });
                    }
                    if (docDetail.fieldci != undefined && docDetail.fieldci.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldds', index: formTobeLoad.docIndex, newVal: docDetail.fieldci.value });
                    }
                    if (docDetail.fieldbz != undefined && docDetail.fieldbz.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldda', index: formTobeLoad.docIndex, newVal: docDetail.fieldbz.value });
                    }
                    if (docDetail.fielddg != undefined && docDetail.fielddg.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldej', index: formTobeLoad.docIndex, newVal: docDetail.fielddg.value });
                    }
                    if (docDetail.Convention != undefined && docDetail.Convention.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldec', index: formTobeLoad.docIndex, newVal: docDetail.Convention.value });
                    }
                    if (docDetail.fielddi != undefined && docDetail.fielddi.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fieldel', index: formTobeLoad.docIndex, newVal: docDetail.fielddi.value });
                    }
                    if (docDetail.fieldcu != undefined && docDetail.fieldcu.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fielddp', index: formTobeLoad.docIndex, newVal: docDetail.fieldcu.value });
                    }
                    if (docDetail.fieldcs != undefined && docDetail.fieldcs.value != undefined) {
                        returnService.postTaxFieldChange({ fieldName: 'dVehicleDeprWkt.fielddn', index: formTobeLoad.docIndex, newVal: docDetail.fieldcs.value });
                    }
                }

                $scope.$emit('loadForm', formTobeLoad, true);
                returnService.removeForm(doc);
            })
            var _form = returnService.getFormProp('fVehicleDeprWkt');
            //If more then one parent then pass only first one to auto bind with it
            if (!_.isUndefined(_form.parentID) && _form.parentID.split(',').length > 1) {
                _form.parentID = _form.parentID.split(',')[0];
            }
            // $scope.addForm(_form);
        }

        $scope.ChangeOnNonResiWkt = function () {
            var changeFiledsData = returnService.ChangeOnNonResiWkt();
            if (changeFiledsData !== undefined && changeFiledsData.length > 0) {
                var efileStatus = returnService.getEfileStatus();
                if (!_.isUndefined(efileStatus) && !_.isEmpty(efileStatus)) {
                    //get federal data
                    var federal = efileStatus["federal"];
                    if (!_.isUndefined(federal) && !_.isEmpty(federal)) {
                        _.forEach(federal, function (federalObj) {
                            if (federalObj.returnTypeCategory == 'MainForm' && federalObj.status == 9) {
                                dialogService.openDialog("custom", { 'keyboard': true, 'backdrop': false, 'size': 'lg' }, "taxAppJs/return/workspace/partials/dialog/nonResiWktMessageDialog.html", "nonResiWktMessageController", { 'data': changeFiledsData })
                            }
                        });
                    }
                }
            }
        }

        /**
         * This function is used to import return to QA/Testing tool.
         */
        $scope.importToQATool = function () {
            returnService.importReturnToQATool().then(function (result) {
                messageService.showMessage('Return imported to QA Tool successfully.', 'success', 'IMPORT_QATOOL_SUCCESS');
            }, function (error) {
                messageService.showMessage('Error ocurred while importing return to QA Tool.', 'error', 'IMPORT_QATOOL_ERROR');
            })
        }

        /**
        *This Function will bind hotkeys
        */
        var _registerHotkeys = function () {
            //bind hotkeys
            hotkeys.bindTo($scope)
                //for open help menu
                .add({
                    combo: 'f1',
                    description: 'Show / hide this help menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        //hotkeys.toggleCheatSheet();
                        var dialog = dialogService.openDialog("custom", { 'keyboard': true, 'backdrop': false, 'size': 'lg' }, "taxAppJs/return/workspace/partials/dialog/keyabordShortcutList.html", "keyboardShortcutListController");
                    }
                })
                //for Save return
                .add({
                    combo: 'f2',
                    description: 'Save Return',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.userCan('CAN_SAVE_RETURN')) {
                            $scope.saveReturn();
                        }
                    }
                })
                //for Open Status Menu
                .add({
                    combo: 'f7',
                    description: 'Open Status Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.statusToggle.isOpen == true) {
                                $scope.statusToggle.isOpen = false;
                            } else {
                                $scope.statusToggle.isOpen = true;
                            }
                        }
                    }
                })
                //for Close return
                .add({
                    combo: 'f10',
                    description: 'Close Return',
                    callback: function (e) {
                        e.preventDefault();
                        $scope.closeReturn();
                    }
                })
                //for open add form menu
                .add({
                    combo: 'mod+f10',
                    description: 'Open Add Form Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.addFormToogle.isOpen == true) {
                                $scope.addFormToogle.isOpen = false;
                            } else {
                                $scope.addFormToogle.isOpen = true;
                            }
                            document.getElementById('step1').click()
                        }
                    }
                })
                //for Remove/Delete Form
                .add({
                    combo: 'shift+f9',
                    description: 'Remove/Delete Form',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            var _canDeleteForm = $filter('canDeleteForm')($scope.formScope.currentForm.formName);
                            if (_canDeleteForm == true) {
                                $scope.removeForm($scope.formScope.currentForm);
                            }
                        }
                    }
                })
                //for Add Form from Multi Instance Form
                .add({
                    combo: 'shift+f10',
                    description: 'Add Form from Multi Instance Form',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            $scope.addFormByDocName($scope.formScope.currentForm.docName);
                        }
                    }
                })
                //for Perform Review
                .add({
                    combo: 'mod+d',
                    description: 'Peform Review',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            $scope.toggleERCPanel(true);
                            $scope.performReview();
                        } else if ($scope.returnMode == "interview") {
                            postal.publish({
                                channel: 'MTPO-Return',
                                topic: 'InterviewShortcut',
                                data: {
                                    type: "performReview"
                                }
                            });
                        }
                    }
                })

                //for print return
                .add({
                    combo: 'mod+p',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    description: 'Print Return',
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.userCan('CAN_PRINT_RETURN')) {
                            if ($scope.taxYear == '2014' || $scope.taxYear == '2015') {
                                $scope.printCompleteReturn();
                            } else if ($scope.taxYear != '2014' && $scope.taxYear != '2015') {
                                $scope.printPackets();
                            }
                        }
                    }
                })

                // for print preview
                //for print return
                .add({
                    combo: 'mod+f2',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    description: 'Print Preview',
                    callback: function (e) {
                        e.preventDefault();
                        if (parseInt($scope.taxYear) >= '2018') {
                            $scope.printPreview();
                        }
                    }
                })

                //for Rejection
                .add({
                    combo: 'mod+r',
                    description: 'Rejection',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            $scope.toggleErrorPanel(true);
                        }
                    }
                })
                //for File Return
                .add({
                    //temporary we assign shift+t because ctrl+t is reserved by crome 
                    combo: 'mod+e',
                    description: 'Transmit Return',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if (!($scope.lockToggle.isLocked) && $scope.isOnline && $scope.isDefaultReturn == false && $scope.userCan('CAN_CREATE_EFILE')) {
                            if ($scope.returnMode == 'interview') {
                                postal.publish({
                                    channel: 'MTPO-Return',
                                    topic: 'InterviewShortcut',
                                    data: {
                                        type: "rejection"
                                    }
                                });
                            }
                            $scope.checkAndEfile('advanceEfile');
                        }
                    }
                })
                //for Open E-File Menu
                .add({
                    combo: 'alt+e',
                    description: 'Open E-File Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.efileToggle.isOpen == true) {
                                $scope.efileToggle.isOpen = false;
                            } else {
                                $scope.efileToggle.isOpen = true;
                            }
                        }
                    }
                })
                //for Interview
                .add({
                    combo: 'alt+i',
                    description: 'Interview',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input' && $scope.userCan('CAN_INTERVIEW') && !($scope.isCalcRunning) && $scope.taxYear != '2014' && $scope.client.packageName == '1040') {
                            $scope.goToInterView();
                        }
                    }
                })

                //for Toggle Left bar
                .add({
                    combo: 'alt+l',
                    description: 'Toggle Left Side Bar',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            postal.publish({
                                channel: 'MTPO-Return',
                                topic: 'ToggleLeftRight',
                                data: {
                                    toggleValue: "left"
                                }
                            });
                        }
                    }
                })
                //for OPen Print Menu
                .add({
                    combo: 'alt+p',
                    description: 'Open Print Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.printToggle.isOpen == true) {
                                $scope.printToggle.isOpen = false;
                            } else {
                                $scope.printToggle.isOpen = true;
                            }
                        }
                    }
                })
                //for open quick forms menu
                .add({
                    combo: 'alt+q',
                    description: 'Open Quick Forms Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.quickAddFormToggle.isOpen == true) {
                                $scope.quickAddFormToggle.isOpen = false;
                            } else {
                                $scope.quickAddFormToggle.isOpen = true;
                            }
                        }
                        document.getElementById('quickAddFormToggle').click();
                    }
                })
                //for Toggle Right bar
                .add({
                    combo: 'alt+r',
                    description: 'Toggle Right Side Bar',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        postal.publish({
                            channel: 'MTPO-Return',
                            topic: 'ToggleLeftRight',
                            data: {
                                toggleValue: "right"
                            }
                        });
                    }
                })
                //Open Add State Menu
                .add({
                    combo: 'alt+s',
                    description: 'Open Add State Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.addStateToggle.isOpen == true) {
                                $scope.addStateToggle.isOpen = false;
                            } else {
                                $scope.addStateToggle.isOpen = true;
                            }
                        } else if ($scope.returnMode == 'interview') {
                            postal.publish({
                                channel: 'MTPO-Return',
                                topic: 'InterviewShortcut',
                                data: {
                                    type: "stateTab"
                                }
                            });
                        }
                    }
                })
                //for Open Tools Menu
                .add({
                    combo: 'alt+t',
                    description: 'Open Tools Menu',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'input') {
                            if ($scope.toolsToogle.isOpen == true) {
                                $scope.toolsToogle.isOpen = false;
                            } else {
                                $scope.toolsToogle.isOpen = true;
                            }
                        }
                    }
                })
                //for navigate prevous form
                .add({
                    combo: 'alt+pageup',
                    description: 'Previous Form',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == "input") {
                            if ($scope.isStackNavigationEnabled.previous == true) {
                                $scope.goToStackNavigation("previous");
                            }
                        } else if ($scope.returnMode == 'interview') {
                            postal.publish({
                                channel: 'MTPO-Return',
                                topic: 'InterviewShortcut',
                                data: {
                                    type: "previous"
                                }
                            });
                        }
                    }
                })
                // for navigate next form
                .add({
                    combo: 'alt+pagedown',
                    description: 'Next Form',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == "input") {
                            if ($scope.isStackNavigationEnabled.next == true) {
                                $scope.goToStackNavigation("next");
                            }
                        } else if ($scope.returnMode == 'interview') {
                            postal.publish({
                                channel: 'MTPO-Return',
                                topic: 'InterviewShortcut',
                                data: {
                                    type: "next"
                                }
                            });
                        }
                    }
                })
                // for open calculator from tools menu
                .add({
                    combo: 'f4',
                    description: 'Next Form',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        $scope.openCalculator();
                    }
                })

                // swith to intrview to form mode
                .add({
                    combo: 'alt+f',
                    description: 'Input Mode',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function (e) {
                        e.preventDefault();
                        if ($scope.returnMode == 'interview') {
                            postal.publish({
                                channel: 'MTPO-Return',
                                topic: 'InterviewShortcut',
                                data: {
                                    type: "inputMode"
                                }
                            });
                        }
                    }
                })



            /*//for Customize Status
            .add({
              combo: '',
              description: 'Customize Status',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.openCustomStatusDialog();
              }
            })
           //for Print Client Organizer
            .add({
              combo: '',
              description: 'Client Organizer',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.printClientOrganizer();
              }
            })
            //for Test Printing
            .add({
              combo: '',
              description: 'Test Printing',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.testPrintinig();
              }
            })
            //for Print Form
            .add({
              combo: 'mod+h',
              description: 'Print Form',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.printForm(undefined,'printSingleForm');
              }
            })
           //for Print Blank Form
            .add({
              combo: '',
              description: 'Print Blank Form',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.printForm(undefined,'printBlankForm');
              }
            })
            //for Print selected form
            .add({
              combo: '',
              description: 'Print Selected Forms',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.printSelectedForms();
              }
            })
            //for Bank App Rejection
            .add({
              combo: '',
              description: 'Bank App Rejection',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.toggleBankErrorPanel(true);
              }
            })
           //for Invoice
            .add({
              combo: '',
              description: 'Invoice',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.addFormByDocName('dPriceList');
              }
            })
            //for 2 year comparison
            .add({
              combo: '',
              description: '2 Year Comparison',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.addFormByDocName('d2YrFormCompare');
              }
            })
            //for Split Return
            .add({
              combo: '',
              description: 'Split Return',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.splitReturn();
              }
            })
            //for Asset Depreciation Summery
            .add({
              combo: '',
              description: 'Asset Depreciation Summery',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.openDepriciationDialog('assetDepreciationWktStatementList');
              }
            })
            //for Vehicle Depreciation Summery
            .add({
              combo: '',
              description: 'Vehicle Depreciation Summery',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.openDepriciationDialog('vehicleDepreciationWktStatementList');
              }
            })
            //for Recalculate
            .add({
              combo: '',
              description: 'Recalculate',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.recalcReturn();
              }
            })
            //for schedule C/D Import
            .add({
              combo: '',
              description: 'Schedule C/D Import',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.openScheduleImportDialog();
              }
            })
            //for Add To Custom Tempalate
            .add({
              combo: '',
              description: 'Add To Custom Tempalate',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                if($scope.isDefaultReturn == false){
                  $scope.manageDefaultReturn('ADD');
                }else{
                 $scope.manageDefaultReturn('REMOVE');
                }
              }
            })
            //for Wrap Text
            .add({
              combo: '',
              description: 'Wrap Text',
              allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
              callback: function(e) {
                e.preventDefault();
                $scope.toggleFullTextPrefrence();
              }
            })*/
        }

        //To listen on destroy.
        $scope.$on('$destroy', function () {
            if ($scope.returnMode == 'input') {
                document.getElementById('returnWorkspaceFormOne').removeEventListener('touchend', stopPropagation);
                document.getElementById('returnWorkspaceFormTwo').removeEventListener('touchend', stopPropagation);
                document.getElementById('returnWorkspaceFormThree').removeEventListener('touchend', stopPropagation);
            }
            document.getElementById('header_logo_myTaxPrepOffice').removeEventListener('click', logoClickCloseReturn)

            if (angular.isDefined(autoSaveInterval)) {
                $interval.cancel(autoSaveInterval);
                autoSaveInterval = undefined;
            }
            closeDialog();
            beforeChangeEventIntro();
            SignUnlockForm()
            //unsubscribe network status subscription to prevent memory leak
            _networkStatusSubscription.unsubscribe();
            _headerToggle.unsubscribe();
            if (_stackNavigationSubscription != undefined) {
                _stackNavigationSubscription.unsubscribe();
            }
            if (_openCalculatorSubscription != undefined) {
                _openCalculatorSubscription.unsubscribe();
            }
            if (_closeCalculatorSubscription != undefined) {
                _closeCalculatorSubscription.unsubscribe()
            }
            if (_reloadCurrentFormChanges != undefined) {
                _reloadCurrentFormChanges.unsubscribe();
            }
            //unsubscribe addAutoStateSubscription to prevent memory leak
            _autoAddStateSubscription.unsubscribe();
            //unsubscribe force signout subscription
            if (_forcedSignOutSubscription != undefined) {
                _forcedSignOutSubscription.unsubscribe();
            }
            // to close socket and webRTC connection.
            webRTCService.sendMessage({});
            webRTCService.closeConnection();
            localStorageUtilityService.removeFromLocalStorage('returnPreview')

        });


    }]);
