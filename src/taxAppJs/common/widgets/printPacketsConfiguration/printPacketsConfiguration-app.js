"use strict";
var printPacketsConfigurationWidget = angular.module('printPacketsConfigurationWidget', []);

/* Services from here */
printPacketsConfigurationWidget.factory('printPacketsConfigurationService', ['$q', '$log', '$http', 'dataAPI', function ($q, $log, $http, dataAPI) {
    var printPacketsConfigurationService = {};

    //This function is used to get saved data from open api
    printPacketsConfigurationService.openPrintPacketsConfiguration = function (paramObj) {
        var deferred = $q.defer();
        //open a printPackets
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/printSet/open',
            data: paramObj
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    //This function is used to reset print packets data
    printPacketsConfigurationService.resetPrintPacketsConfiguration = function (paramObj) {
        var deferred = $q.defer();
        //call reset printPackets api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/printSet/reset',
            data: paramObj
        }).then(function () {
            deferred.resolve();
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };


    //This function is used to save printPackets data into api
    printPacketsConfigurationService.savePrintPacketsConfiguration = function (printPacketsForms, waterMarkDetails, rightModel, userId, locationId) {
        var deferred = $q.defer();
        //edit or save printPackets
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/printSet/save',
            data: {
                'data': {
                    'forms': printPacketsForms,
                    'waterMarkDetails': waterMarkDetails,
                    userId: userId,
                    rightModel: rightModel,
                    locationId: locationId
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

    return printPacketsConfigurationService;
}]);

/*
* Filter formslist based on passed printCategory.
*/
printPacketsConfigurationWidget.filter('printPacketsCategoryFilter', ['_', 'contentService', function (_, contentService) {
    return function (forms, category) {
        var filtered = [];
        angular.forEach(forms, function (form) {
            if (!_.isUndefined(form) && !_.isUndefined(form.printCategory) && form.printCategory === category) {
                filtered.push(form);
            }
        });
        return filtered;
    };
}]);

/*
*This filter is used to filter given form list based on  DisplayName or Description(form list properties)
*/
printPacketsConfigurationWidget.filter('printPacketsFormListFilter', ['_', '$filter', 'environment', function (_, $filter, environment) {
    return function (items, searchText) {
        var filteredContains = [];

        if (searchText === undefined || searchText === '') {
            return items;
        }
        var _lengthOfItems = items == undefined ? 0 : items.length;

        //Avoid '-' in search
        searchText = searchText.replace('-', '');
        //Avoid 'form' keyword and trim extra spaces.
        searchText = searchText.replace('form', '').toString().trim();
        // Exact serach text
        for (var i = 0; i < _lengthOfItems; i++) {
            if (items[i].displayName.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                items[i].description.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
                filteredContains.push(items[i]);
            }
        }

        return _.union(filteredContains);
    };
}]);

/*printPacketsConfigurationWidget Directives from here*/
printPacketsConfigurationWidget.directive('printPacketsConfiguration', [function () {
    return {
        restrict: 'E',
        scope: {
            backUrl: '@cancelUrl'
        },
        templateUrl: 'taxAppJs/common/widgets/printPacketsConfiguration/partials/printPacketsConfiguration-template.html',
        controller: ['_', '$rootScope', '$scope', '$log', '$location', '$filter', '$timeout', '$q', 'messageService', 'userService', 'printPacketsConfigurationService', 'localeService', 'contentService', 'systemConfig', '$routeParams',
            function (_, $rootScope, $scope, $log, $location, $filter, $timeout, $q, messageService, userService, printPacketsConfigurationService, localeService, contentService, systemConfig, $routeParams) {
                //This Variable is used to hold form categories
                $scope.categories = [{ displayText: "Client Documents", value: "ClientDocuments", isOpen: false },
                { displayText: "Federal Forms", value: "FederalForms", isOpen: false },
                { displayText: "Federal Statements", value: "FederalStatements", isOpen: false },
                { displayText: "Federal Worksheets", value: "FederalWorksheets", isOpen: false },
                { displayText: "State Forms", value: "StateForms", isOpen: false },
                { displayText: "State Statements", value: "StateStatements", isOpen: false },
                { displayText: "State Worksheets", value: "StateWorksheets", isOpen: false }
                ];
                //Array will hold list of print packet
                $scope.printPacket = [{ displayText: 'Filing Copy', value: 'filing' },
                { displayText: 'Client Copy', value: 'client' },
                { displayText: 'Preparer Copy', value: 'preparer' },
                { displayText: 'Custom Copy', value: 'custom' }
                ];

                //array will hold whenToPrint Options
                $scope.whenToPrint = [{ displayText: 'Default', value: 'Default' },
                { displayText: 'Always', value: 'Always' },
                { displayText: 'Never', value: 'Never' }
                ];

                //This will hold form selected by user to do operation like moving up/down (in list)
                $scope.selectedFormId;
                //to check whether reset button is presssed or not 
                var isResetPressed = false;

                //Holding list of forms that change by users.
                //This will be reset once user save it
                var changeTracker = {};

                //list of states under common package
                var commonStates = [];

                //This variable is used to store lastSavedForms
                $scope.lastSavedForms = {};

                //This Function is used to hod water mark details
                $scope.waterMarkDetails = {};

                //This function will used to expand all accordian
                $scope.openAllItems = function () {
                    $scope.categories.map(function (item) {
                        item.isOpen = true;
                    });
                };


                //This function is used to close all accordian
                $scope.closeAllItems = function () {
                    $scope.categories.map(function (item) {
                        item.isOpen = false;
                    });
                };

                //Check for privileges
                $scope.userCan = function (privilege) {
                    return userService.can(privilege);
                };

                $scope.clearSearch = function (){
                    $scope.searchField = '';
                };

                //call API method to get existing info for edit 
                var _init = function () {
                    //check taxYear
                    var taxYear = userService.getTaxYear();
                    if (taxYear == '2014' || taxYear == '2015') {
                        $location.path('home');
                    }

                    //set default package     
                    $scope.selectedPackageName = '1040';
                    //set default state        
                    $scope.selectedStateName = 'All';
                    //set default packet 
                    $scope.selectedPacketName = 'filing';

                    //This will ensure that we have details for common package so we load common package form along with selevted package
                    commonStates = _getReleasedStateNames('common');

                    //get saved forms if any     
                    _getLastSavedForms().then(function () {
                        //refresh taxYear
                        contentService.refreshTaxYear();
                        //get released package List
                        $scope.returnTypes = systemConfig.getReleasedPackages();
                        //get forms
                        $scope.refreshFilter();
                    }, function (error) {
                        $log.error(error);
                    });
                };


                //get details for edit mode if available
                var _getLastSavedForms = function () {
                    $scope.enableLoading = true;
                    var deferred = $q.defer();
                    var parameterObject = {
                        rightModel: $routeParams.rightModel ? parseInt($routeParams.rightModel) : 2,
                        locationId: $routeParams.locationId
                    };
                    if (parameterObject.rightModel == 2) {
                        parameterObject.userId = userService.getUserDetails().key;
                    }
                    printPacketsConfigurationService.openPrintPacketsConfiguration(parameterObject).then(function (response) {
                        $scope.lastSavedForms = response.forms;
                        $scope.waterMarkDetails = response.waterMarkDetails;
                        deferred.resolve();
                        $scope.enableLoading = false;
                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                        $scope.enableLoading = false;
                    });
                    return deferred.promise;
                };

                //This function is used to update/merge property of form  whenever user changes
                var _mergeFormProperty = function (formListData) {
                    if (angular.isDefined(formListData) && !_.isEmpty(formListData)) {
                        _.forEach(formListData, function (obj, key) {
                            //find object from formList
                            var formListObj = _.find($scope.formList, { "id": key });
                            if (angular.isDefined(formListObj)) {
                                //replace with saved property
                                formListObj.whenToPrint = obj.whenToPrint;
                                formListObj.printOrder = obj.printOrder;
                            }
                        });
                    }
                }


                // save data of printpackets
                $scope.save = function () {
                    if ($scope.userCan('CAN_SAVE_PRINTSET')) {
                        if (angular.isDefined(changeTracker) && !_.isEmpty(changeTracker) || angular.isDefined($scope.waterMarkDetails)) {
                            //combine updated data with lastSavedForms data
                            _.forEach(changeTracker, function (obj, key) {
                                $scope.lastSavedForms[key] = obj;
                            });
                            var userId;
                            var rightModel = $routeParams.rightModel ? parseInt($routeParams.rightModel) : 2;
                            if (rightModel == 2) {
                                userId = userService.getUserDetails().key;
                            }
                            printPacketsConfigurationService.savePrintPacketsConfiguration(changeTracker, $scope.waterMarkDetails, rightModel, userId, $routeParams.locationId).then(function (response) {
                                //blank unneccessary data after saving printPackets data
                                changeTracker = {};
                                messageService.showMessage('Updated Print Packets Configuration successfully', 'success', 'PRINTPACKETSCONTROLLER_UPDATESUCCESS');
                                if ($scope.backUrl == 'dialog') {
                                    postal.publish({
                                        channel: 'MTPO-Return',
                                        topic: 'PrintPacketDialogClose',
                                        data: {
                                            "isResetPressed": isResetPressed
                                        }
                                    });
                                }
                            }, function (error) {
                                $log.error(error);
                            });
                        }
                    }
                };

                //This function is used to reset all saved data of users
                $scope.ResetPrintPackets = function () {
                    if ($scope.userCan('CAN_SAVE_PRINTSET')) {
                        //make reset flag true when user reset print packets data
                        isResetPressed = true;
                        changeTracker = {};
                        $scope.lastSavedForms = {};
                        $scope.waterMarkDetails = {};
                        var parameterObject = {
                            rightModel: $routeParams.rightModel ? parseInt($routeParams.rightModel) : 2,
                            locationId: $routeParams.locationId
                        };
                        if (parameterObject.rightModel == 2) {
                            parameterObject.userId = userService.getUserDetails().key;
                        }
                        printPacketsConfigurationService.resetPrintPacketsConfiguration(parameterObject).then(function () {
                            messageService.showMessage('Reset Print Packets Configuration successfully', 'success', 'PRINTPACKETSCONTROLLER_UPDATESUCCESS');
                            $scope.refreshFilter();
                        }, function (error) {
                            $log.error(error);
                        });
                    }
                }

                //on click cancel we just redirect to home screen 
                $scope.cancel = function () {
                    if ($scope.backUrl == 'dialog') {//if printPackets is open from dialog
                        postal.publish({
                            channel: 'MTPO-Return',
                            topic: 'PrintPacketDialogClose',
                            data: {
                                "isResetPressed": isResetPressed
                            }
                        });
                    } else {
                        $location.path($scope.backUrl);
                    }
                };

                ///// Scope Functions /////////////////

                /**
                 * This function will initiated from UI to update form position.
                 * However, this function will just find current and target postion and call another function shift it's position
                 * @param updateType
                 *                      up/down/first/last
                 */
                $scope.updatePrintOrder = function (updateType) {
                    //Only if any form is selected
                    if (updateType != undefined && $scope.selectedFormId != undefined && $scope.selectedFormId != '') {
                        //Form object that is selected by user in list
                        var selectedForm = _.find($scope.formList, { 'id': $scope.selectedFormId });

                        //Let's preparer filtered form list (same user is seeing on screen)
                        var _formList = $filter('filter')(_.cloneDeep($scope.formList), $scope.searchField);
                        _formList = $filter('printPacketsCategoryFilter')(_formList, selectedForm.printCategory);
                        _formList = $filter('orderBy')(_formList, ('printOrder.' + $scope.selectedPacketName));

                        //position of selected form in filtered array
                        var currentPosition = _.findIndex(_formList, { 'id': $scope.selectedFormId });
                        //Target postion
                        var targetPosition;

                        //Identify target position
                        switch (updateType) {
                            case 'up':
                                var currentIndex = currentPosition;
                                while (currentIndex != 0) {
                                    if (_formList[currentIndex - 1].printOrder[$scope.selectedPacketName] < _formList[currentIndex].printOrder[$scope.selectedPacketName]) {
                                        targetPosition = currentIndex - 1;
                                        break;
                                    } else {
                                        currentIndex = currentIndex - 1;
                                    }
                                }
                                break;
                            case 'down':
                                var currentIndex = currentPosition;
                                while (currentIndex != _formList.length - 1) {
                                    if (_formList[currentIndex + 1].printOrder[$scope.selectedPacketName] > _formList[currentIndex].printOrder[$scope.selectedPacketName]) {
                                        targetPosition = currentIndex + 1;
                                        break;
                                    } else {
                                        currentIndex = currentIndex + 1;
                                    }
                                }
                                break;
                            case 'first':
                                var currentIndex = currentPosition;
                                while (currentIndex != 0) {
                                    if (_formList[currentIndex - 1].printOrder == undefined || _formList[currentIndex - 1].printOrder[$scope.selectedPacketName] == undefined) {
                                        targetPosition = currentIndex;
                                        break;
                                    } else {
                                        currentIndex = currentIndex - 1;
                                    }
                                }

                                if (currentIndex == 0) {
                                    targetPosition = 0;
                                }
                                break;
                            case 'last':
                                var currentIndex = currentPosition;
                                while (currentIndex != _formList.length - 1) {
                                    if (_formList[currentIndex + 1].printOrder == undefined || _formList[currentIndex + 1].printOrder[$scope.selectedPacketName] == undefined) {
                                        targetPosition = currentIndex;
                                        break;
                                    } else {
                                        currentIndex = currentIndex + 1;
                                    }

                                    if (currentIndex == _formList.length - 1) {
                                        targetPosition = _formList.length - 1;
                                    }
                                }
                                break;
                        }

                        //If current(selected) position and target position is available let's shift form position
                        if (currentPosition != undefined && targetPosition != undefined) {
                            shiftPrintOrder(currentPosition, targetPosition, _formList);
                            //Auto scroll towards target position
                            $timeout(function () {
                                document.getElementById('Form-WhenToPrint-' + $scope.selectedFormId).focus();
                            }, 200)
                        }
                    }
                }

                /**
                 * This will set passed formId as selected formId. Which will be used to show selected css class as well as used in 
                 * changing position in list through buttons
                 */
                $scope.selectForm = function (formId) {
                    //If passed formId is same which is already selected then unselect it
                    if ($scope.selectedFormId == formId) {
                        $scope.selectedFormId = undefined;
                    } else {
                        $scope.selectedFormId = formId
                    }
                }

                //This function will be called when user change package in combo box
                $scope.refreshFilter = function () {
                    $scope.enableLoading = true;
                    if (angular.isUndefined($scope.waterMarkDetails) || _.isEmpty($scope.waterMarkDetails)) {
                        $scope.waterMarkDetails = { 'client': { isChecked: true, value: 'Client Copy' } };
                    }
                    //set default package 1040
                    if ($scope.selectedPackageName == undefined || $scope.selectedPackageName == '') {
                        $scope.selectedPackageName = '1040';
                    }
                    //set default state All
                    if ($scope.selectedStateName == undefined || $scope.selectedStateName == '') {
                        $scope.selectedStateName = 'All';
                    }

                    //set package Name in content service
                    contentService.setPackageName($scope.selectedPackageName);
                    //First update state list
                    _refreshStateList($scope.selectedPackageName);
                    //Update form list
                    _loadForms($scope.selectedPackageName, $scope.selectedStateName).then(function () {
                        //remove interview mode form form formList
                        _removeHiddenForm();
                        // merge or update saved data 
                        _mergeFormProperty($scope.lastSavedForms);
                        //merge or update changeTracker data
                        _mergeFormProperty(changeTracker);
                        //Sort formList by federal & state name
                        _sortFormList();
                        $scope.enableLoading = false;
                    }, function (error) {
                        $log.error(error);
                        $scope.enableLoading = false;
                    });
                }

                /**
                 * This method called from UI when user change whenToPrint option for perticular form
                 */
                $scope.changeWhenToPrint = function (form) {
                    addFormToChangeTracker(form);
                }

                //////// Non Exposed Functions ///////

                var _loadForms = function (packageName, stateName) {
                    var deferred = $q.defer();
                    //Enable Loading bar here

                    //List of states
                    var statesReleased = [];
                    if (stateName.toLowerCase() != 'all') {
                        statesReleased = [stateName.toLowerCase()];
                    } else {
                        statesReleased = _getReleasedStateNames(packageName);
                    }

                    //make form list empty
                    $scope.formList = [];

                    //first load form properties if not yet
                    _loadFormList(packageName, statesReleased).then(function () {
                        //get formlist from content service for all states
                        $scope.formList = contentService.getForms(packageName, statesReleased);
                        //Disable Loading bar here
                        deferred.resolve();
                    }, function (error) {
                        deferred.reject(error);
                        //Disable Loading bar here
                    });

                    return deferred.promise;
                }

                //This method will call content service to load form properties of all state for given package    
                var _loadFormList = function (packageName, statesReleased) {
                    var deferred = $q.defer();

                    //prepare state list to load forms
                    var stateListForRequest = [];
                    for (var index in statesReleased) {
                        //Check if common package have sam e state or not
                        var packageNames = [packageName];
                        if (_.indexOf(commonStates, statesReleased[index]) > -1) {
                            packageNames.push("common");
                        }
                        //Load state
                        stateListForRequest.push({ "packageName": packageName, "name": statesReleased[index].toLowerCase(), "packageNames": packageNames });
                    }

                    //Content service to load formlists if not yet loaded
                    contentService.loadFormsLists(stateListForRequest).then(function (response) {
                        deferred.resolve();
                    }, function (error) {
                        console.log('Error while getting formList for states released under packageName ' + packageName);
                        console.error(error);
                        deferred.resolve(error);
                    });

                    return deferred.promise;
                }

                //This function will update stateList as per passed packageName
                var _refreshStateList = function (packageName) {
                    $scope.stateList = _getReleasedStateNames(packageName, true);
                    //push all
                    $scope.stateList.splice(0, 0, 'All');

                    //
                    if (_.include($scope.stateList, $scope.selectedStateName) == false) {
                        $scope.selectedStateName = 'All';
                    }
                }

                /**
                *This function is used to remove unneccessary form from formList
                **/
                var _removeHiddenForm = function () {
                    _.remove($scope.formList, { "isHiddenForm": true });
                }

                //This function will provide StateList along with federal state
                var _getReleasedStateNames = function (packageName, doNotConvertToLowerCase, doNotAddFederal) {
                    var _stateList = contentService.getReleasedStateNames(packageName, doNotConvertToLowerCase);
                    _stateList = _stateList.sort();
                    if (doNotConvertToLowerCase == true) {
                        _stateList.splice(0, 0, 'Federal');
                    } else {
                        _stateList.splice(0, 0, 'federal');
                    }
                    return _stateList;

                }

                /**
                 * This function will sort formList with federal first and then state(s) in ascending order
                 * @param onlyPrintOrder
                 *                      If this is true then only filter on print order fo selected packet
                 */
                var _sortFormList = function (onlyPrintOrder) {
                    //Copy formList to local variable
                    var _formList = _.cloneDeep($scope.formList);

                    if (onlyPrintOrder != true) {
                        //Sort with state name in ascending order
                        _formList = _.sortBy(_formList, 'state');
                        //Sort federal forms first in the list
                        _formList = _.sortBy(_formList, function (form) {
                            return form.state.toLowerCase() != 'federal';
                        });
                    }

                    //OrderBy list with selected packet. 
                    //Please note that lodash _.sortBy will no twork on deep field which may be undefined for some onjects
                    //_formList = $filter('orderBy')(_formList,('printOrder.'+$scope.selectedPacketName));

                    //order by print order of selected packet


                    //Assign local variable to formList
                    $scope.forms = _.cloneDeep(_formList);
                }

                /**
                 * This function is performing actual operation to shift form in list
                 * @param positionFrom
                 *                      index of selected form in filtered form list
                 * @param positionTo
                 *                      index of target position in filtered form list
                 * @param filteredFormList
                 *                      filtered list (same which is shown on screen) of forms
                 */
                var shiftPrintOrder = function (positionFrom, positionTo, filteredFormList) {
                    //Let's first decide direction like up/down and either we have to plus the index or minus in loop
                    var direction;
                    var shiftOperator;
                    if (positionFrom > positionTo) {
                        direction = "up";
                        shiftOperator = -1;
                    } else if (positionFrom < positionTo) {
                        direction = "down";
                        shiftOperator = 1;
                    }

                    //If both indexes (positions) are same nothing to do. Means there is no direction to go
                    if (direction != undefined) {
                        //loop until we reached to target index
                        while (positionFrom != positionTo) {
                            //TODO: If there is any form current to target position which does not have print order then either we have
                            // to assign by our self in incremental order or assign print order to current and skip in between positions
                            // which does not hold print order
                            if (filteredFormList[positionFrom].printOrder == undefined
                                || filteredFormList[positionFrom].printOrder[$scope.selectedPacketName] == undefined) {
                                //Identify and assign new printOrder to all forms between last form having printOrder to till this form
                            }

                            //First find real position in formList (not filtered list)
                            var _currentFormIndex = _.findIndex($scope.formList, { 'id': filteredFormList[positionFrom].id });
                            var _targetFormIndex = _.findIndex($scope.formList, { 'id': filteredFormList[positionFrom + shiftOperator].id });

                            //print order value of current (postion) form
                            var _holdingValue = filteredFormList[positionFrom].printOrder[$scope.selectedPacketName];
                            //Swap print order between current and next in original form list
                            $scope.formList[_currentFormIndex].printOrder[$scope.selectedPacketName] = $scope.formList[_targetFormIndex].printOrder[$scope.selectedPacketName];
                            $scope.formList[_targetFormIndex].printOrder[$scope.selectedPacketName] = _holdingValue;

                            //Swap print order in filtered list as well to be on same state managment
                            filteredFormList[positionFrom].printOrder[$scope.selectedPacketName] = filteredFormList[positionFrom + shiftOperator].printOrder[$scope.selectedPacketName]
                            filteredFormList[positionFrom + shiftOperator].printOrder[$scope.selectedPacketName] = _holdingValue;

                            //Swap form psotion in filtered list, This will help us to simulate same list that going to be on screen due to swaping print order
                            var _holdingForm = _.cloneDeep(filteredFormList[positionFrom]);
                            filteredFormList[positionFrom] = _.cloneDeep(filteredFormList[positionFrom + shiftOperator]);
                            filteredFormList[positionFrom + shiftOperator] = _holdingForm;

                            //push forms to change tracker (list)
                            addFormToChangeTracker(filteredFormList[positionFrom]);
                            addFormToChangeTracker(filteredFormList[positionFrom + shiftOperator]);

                            //Move to next position
                            positionFrom = positionFrom + shiftOperator;
                        }
                    }
                }

                /**
                 * This method is called to add any form that got changed due to use's action
                 * like changing whentoprint option or print order
                 *
                 * @param formToBeAdded
                 *                      Pass either form object or formId
                 */
                var addFormToChangeTracker = function (formToBeAdded) {
                    //parameter can not be undefined
                    if (_.isEmpty(formToBeAdded) != true) {
                        //If passed argument is formId and not form(object) it self then first get form
                        if (typeof formToBeAdded == 'string') {
                            formToBeAdded = _.find($scope.formList, { 'id': formToBeAdded });
                        }
                        //push in list
                        changeTracker[formToBeAdded.id] = _.cloneDeep({ 'whenToPrint': formToBeAdded.whenToPrint, 'printOrder': formToBeAdded.printOrder });
                    }
                }


                /*
                 *   Initialize section
                 */
                _init();

            }]
    };
}]);