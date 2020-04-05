'use strict';

var preparerApp = angular.module('preparerApp', []);
preparerApp.controller('preparerListController', ['$scope', '$filter', '$log', '$location', '$q', '$timeout', 'NgTableParams', 'preparerService', 'messageService', 'userService', 'dialogService', 'localeService', 'environment', function ($scope, $filter, $log, $location, $q, $timeout, NgTableParams, preparerService, messageService, userService, dialogService, localeService, environment) {
    //Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);
    };

    //intialize avilaber preparer list
    var _initAvailablePreparer = function () {

        var deferred = $q.defer();
        preparerService.getAvailablePreparerList().then(function (response) {
            $scope.availablePreparer = response;

            deferred.resolve(response);
        }, function (error) {

            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    var gridFilterOrderedData = [];//hold grid data with order and filter
    // For Grid - Start. First object is configuration and second is for data
    // and other operations from data
    $scope.availablePreparerList = new NgTableParams({
        page: 1, // show initial page
        count: 10,// count per page
        sorting: {
            // initial sorting
            preparerId: 'asc'
        }
    }, {
            total: 0, // length of data
            sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
            getData: function ($defer, params) {
                //Request to API
                //get Data here				
                if (angular.isUndefined($scope.availablePreparer)) {
                    _initAvailablePreparer().then(function (response) {
                        // Only On successful API response we bind data to grid.			
                        var filteredData = $scope.availablePreparer;
                        filteredData = $filter('filter')(filteredData, $scope.searchField);
                        //Apply standard sorting
                        var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                        gridFilterOrderedData = orderedData;
                        params.total(filteredData.length);
                        //Return Result to grid
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                    }, function (error) {
                        $log.error(error);
                    });
                }
                else {
                    // Only On successful API response we bind data to grid.			
                    var filteredData = $scope.availablePreparer;
                    //filter based on search field $scope.searchField
                    if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
                        filteredData = $filter('filter')(filteredData, function (Preparer, index) {
                            if (angular.isDefined(Preparer.preparer.preparerId) && Preparer.preparer.preparerId.indexOf($scope.searchField.toLowerCase()) >= 0) {
                                return true;
                            }
                            else if (angular.isDefined(Preparer.preparer.preparerName) && Preparer.preparer.preparerName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
                                return true;
                            }
                            else if (angular.isDefined(Preparer.preparer.preparerSsn) && Preparer.preparer.preparerSsn.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
                                return true;
                            }
                            else if (angular.isDefined(Preparer.preparer.preparerTin) && Preparer.preparer.preparerTin.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
                                return true;
                            }
                            else if (angular.isDefined(Preparer.preparer.email) && Preparer.preparer.email.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
                                return true;
                            }
                        });
                    };
                    //Apply standard sorting
                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                    gridFilterOrderedData = orderedData;
                    params.total(filteredData.length);
                    //Return Result to grid
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                }
            }
        });
    //Object holding timeout
    var filterTimeout = {};
    //Watch for search field
    $scope.$watch('searchField', function (newVal, oldVal) {
        //If Grid data is defined and there is cahnge in old and new value
        if ($scope.availablePreparerList.settings().$scope != null && newVal != oldVal) {
            //Cancel old search filter
            $timeout.cancel(filterTimeout);
            //Register new timeout for filter
            filterTimeout = $timeout(function () {
                //Reload grid. Which will re-bind data by filtering it
                $scope.availablePreparerList.reload();
                //go to first page.
                $scope.availablePreparerList.page(1);
            }, 300);
        }
    });

    $scope.clearSearch = function (){
        $scope.searchField = '';
    }; 
    //for create new preparer redirect edit screen
    $scope.createNewPreparer = function () {
        $location.path('/manage/preparer/edit');
    };

    //user can remove preparer from two way single and multiple when key passed its single remove 
    $scope.removePreparer = function (key) {
        var displayText = '';
        var preparerToDelete = [];
        if (angular.isDefined(key)) {
            preparerToDelete.push(key);
        }
        else {
            _.forEach($scope.availablePreparer, function (preparer) {
                if (angular.isDefined(preparer.preparer.isSelected) && preparer.preparer.isSelected == true) {
                    preparerToDelete.push(preparer.preparer.preparerId);
                }
            });
        }
        if (_.size(preparerToDelete) != 0) {
            if (_.size(preparerToDelete) > 1) {
                displayText = "Do you want to delete " + _.size(preparerToDelete) + " preparers ?";
            } else {
                displayText = "Do you want to delete this preparer ?";
            }

            //Dialog used for the confirmation from user to Delete or not the selected Preparer.
            var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
            localeService.translate(displayText, 'PREPARER_DOYOUDELETETHISPREPARER_DIALOG_MESSAGE').then(function (translateText) {
                var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
                dialog.result.then(function (btn) {
                    preparerService.removePreparer(preparerToDelete).then(function (success) {
                        messageService.showMessage('Remove successfully', 'success', 'PREPARERLISTCONTROLLER_REMOVESUCCESS');
                        _initAvailablePreparer().then(function (response) {
                            $scope.availablePreparerList.reload();
                        }, function (error) {
                            $log.error(error);
                        });
                    }, function (error) {
                        $log.error(error);
                    });
                }, function (btn) {

                });
            });
        }
    };

    //for edit preparer we jusr redirect to edit screen with key 
    $scope.editPreparer = function (key) {
        $location.path('/manage/preparer/edit/' + key);
    };

    // Mark As Default
    $scope.markAsDefault = function (value, key) {
        //storing user details
        var userDetail = userService.getUserDetails();

        // if settings is undefined then we create it's new object
        if (_.isUndefined(userDetail.settings)) {
            userDetail.settings = {};
        }

        // if preferences is undefined then we create it's new object 
        if (_.isUndefined(userDetail.settings.preferences)) {
            userDetail.settings.preferences = {};
        }

        // if defaultPreparer is undefined then we store it else we just update it
        if (_.isUndefined(userDetail.settings.preferences.returnWorkspace)) {
            userDetail.settings.preferences.returnWorkspace = { defaultPreparer: value };
        } else {
            userDetail.settings.preferences.returnWorkspace[key] = value;
        }

        // sending updated preferences object to API
        userService.changeSettings('preferences', userDetail.settings.preferences).then(function (response) {
            messageService.showMessage('Preferences updated', 'success', 'CHANGEPREFERENCES_SAVE_MSG');
        }, function (error) {
            $log.error(error);
        });
    };
    //Temporary function to differentiate features as per environment (beta/live)
    $scope.betaOnly = function () {
        if (environment.mode == 'beta' || environment.mode == 'local')
            return true;
        else
            return false;
    };
}]);

//* edit controller *//
preparerApp.controller('preparerEditController', ['$scope', '$log', '$location', '$routeParams', '$q', 'preparerService', 'messageService', 'userService', 'dialogService', 'localeService', 'utilityService', 'resellerService', 'environment', 'signatureService', 'manageUserService', function ($scope, $log, $location, $routeParams, $q, preparerService, messageService, userService, dialogService, localeService, utilityService, resellerService, environment, signatureService, manageUserService) {

    //Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);
    };

    //check for License
    $scope.hasLicense = function (licenseName) {
        return userService.getLicenseValue(licenseName);
    };

    //get user list for associated users;
    $scope.getUserlist = function () {
        if ($scope.userCan('CAN_LIST_USER')) {
            $scope.userList = manageUserService.getAvailablUserList().then(function (list) {
                $scope.userList = list;
            });
        }
    }

    //Temporary function to differentiate features as per environment (beta/live)
    $scope.betaOnly = function () {
        if (environment.mode == 'beta' || environment.mode == 'local')
            return true;
        else
            return false;
    };

    $scope.exemptCodeList = [{ "text": "", "value": "" }, { "text": "01-Attorney", "value": "01" }, { "text": "02-Employee of attorney", "value": "02" },
    { "text": "03-CPA", "value": "03" }, { "text": "04-Employee of CPA", "value": "04" }, { "text": "05-PA (Public Accountant)", "value": "05" },
    { "text": "06-Employee of PA", "value": "06" }, { "text": "07-Enrolled agent", "value": "07" }, { "text": "08-Employee of enrolled agent", "value": "08" },
    { "text": "09-Volunteer tax preparer", "value": "09" }, { "text": "10-Employee of business preparing that business’ return", "value": "10" }];

    //when Preparer already exist we store value is true
    $scope.isPreparerExistErr = false;

    //Object holding Preparer information
    $scope.preparer = {};
    $scope.preparer.usAddress = {};
    $scope.preparer.foreignAddress = {};
    //$scope.preparer.selfEmployed=false;
    //Object holding Non-Paid Preparer Indicator values 
    $scope.preparer.nonPaidIndicator = '';
    /*    $scope.nonPainPreparerIndicator = [
                            {value: 'IRS-PREPARED'},
                            {value: 'IRS-REVIEWED'},
                            {value: 'Self Prepared'},
                            {value: 'Unpaid Preparer'}
                         ];*/
    //here we are checking mode is update or create if it is create nothing to do else we have to call pi method to get exsting info for update 
    var _init = function () {
        if (angular.isDefined($routeParams.id)) {
            $scope.mode = 'update';
        }
        else {
            $scope.mode = 'create';
        }
        if ($scope.mode == 'update') {
            _getPreparerForEdit($routeParams.id);
        }
        else if ($scope.mode == 'create') {
            //for now nothing to do 
        }
    };

    //get preparer details for edit based on id 
    var _getPreparerForEdit = function (id) {

        preparerService.getPreparer(id).then(function (success) {
            $scope.preparer = success;
            if (!_.isUndefined(success.associatedUser)) {
                $scope.preparer.associatedUser = success.associatedUser[0];
            }
            if ((_.isUndefined($scope.preparer.preparerFname) || $scope.preparer.preparerFname == "") && (_.isUndefined($scope.preparer.preparerLname) || $scope.preparer.preparerLname == "")) {
                var splitPreparerName = $scope.preparer.preparerName.split(' ');
                $scope.preparer.preparerFname = splitPreparerName[0];
                $scope.preparer.preparerLname = splitPreparerName[1];
            }
        }, function (error) {

            $log.error(error);
        });
    };

    //save or update preparer Base ON Id 
    $scope.savePreparer = function () {
        $scope.preparer.preparerName = $scope.preparer.preparerFname + " " + $scope.preparer.preparerLname;
        var associatedUser = [];
        if (!_.isEmpty($scope.preparer.associatedUser)) {
            associatedUser.push($scope.preparer.associatedUser)
        }
        if(_.isUndefined($scope.preparer.usAddress)){
            $scope.preparer.usAddress={};
        }
        if(_.isUndefined($scope.preparer.foreignAddress)){
            $scope.preparer.foreignAddress={};
        }
        if ($scope.mode == 'update') {

            preparerService.updatePreparer($scope.preparer.preparerId, $scope.preparer.preparerName, $scope.preparer.preparerFname, $scope.preparer.preparerLname, $scope.preparer.preparerSsn, $scope.preparer.preparerTin, $scope.preparer.practitionerPin, $scope.preparer.firmName, $scope.preparer.usAddress.street, $scope.preparer.usAddress.zipCode, $scope.preparer.usAddress.city, $scope.preparer.usAddress.state, $scope.preparer.foreignAddress.street, $scope.preparer.foreignAddress.postalCode, $scope.preparer.foreignAddress.city, $scope.preparer.foreignAddress.state, $scope.preparer.foreignAddress.country, $scope.preparer.email, $scope.preparer.date, $scope.preparer.selfEmployed, $scope.preparer.EIN, $scope.preparer.telephone, $scope.preparer.fax, $scope.preparer.nytprin, $scope.preparer.nyExemptCode, $scope.preparer.orLicenceNumber, associatedUser, $scope.preparer.nmCRSidentificationNumber, $scope.preparer.preparerStin).then(function (success) {

                messageService.showMessage('Updated successfully', 'success', 'PREPAREREDITCONTROLLER_UPDATESUCCESS');
                //after success we just redirect to preparer list screen
                $location.path('/manage/preparer/list');
            }, function (error) {

                $log.error(error);
            });
        }
        else {

            preparerService.createPreparer($scope.preparer.preparerId, $scope.preparer.preparerName, $scope.preparer.preparerFname, $scope.preparer.preparerLname, $scope.preparer.preparerSsn, $scope.preparer.preparerTin, $scope.preparer.practitionerPin, $scope.preparer.firmName, $scope.preparer.usAddress.street, $scope.preparer.usAddress.zipCode, $scope.preparer.usAddress.city, $scope.preparer.usAddress.state, $scope.preparer.foreignAddress.street, $scope.preparer.foreignAddress.postalCode, $scope.preparer.foreignAddress.city, $scope.preparer.foreignAddress.state, $scope.preparer.foreignAddress.country, $scope.preparer.email, $scope.preparer.date, $scope.preparer.selfEmployed, $scope.preparer.EIN, $scope.preparer.telephone, $scope.preparer.fax, $scope.preparer.nytprin, $scope.preparer.nyExemptCode, $scope.preparer.orLicenceNumber, associatedUser, $scope.preparer.nmCRSidentificationNumber, $scope.preparer.preparerStin).then(function (success) {

                messageService.showMessage('Created successfully', 'success', 'PREPAREREDITCONTROLLER_CREATESUCCESS');
                //after success we just redirect to preparer list screen
                $location.path('/manage/preparer/list');
            }, function (error) {

                if (error.status == 401) {
                    if (error.data.code == 4011) {
                        $scope.isPreparerExistErr = true;
                    }
                    else {
                        $scope.isPreparerExistErr = false;
                        $log.error(error);
                    }
                }
            });
        }

    };

    //on click cancel we just redirect to preparer list screen 
    $scope.cancel = function () {
        $location.path('/manage/preparer/list');
    };

    //for remove single preparer
    $scope.removePreparer = function () {
        //Dialog used for the confirmation from user to Delete or not the selected Preparer.
        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
        localeService.translate('Do you want to delete this preparer ?', 'PREPARER_DOYOUDELETETHISPREPARER_DIALOG_MESSAGE').then(function (translateText) {
            var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
            dialog.result.then(function (btn) {
                var preparerToDelete = [];
                preparerToDelete.push($routeParams.id);
                preparerService.removePreparer(preparerToDelete).then(function (success) {
                    messageService.showMessage('Remove successfully', 'success', 'PREPAREREDITCONTROLLER_REMOVESUCCESS');
                    //after success reditrect to preparer list screen
                    $location.path('/manage/preparer/list');
                }, function (error) {
                    $log.error(error);
                });
            }, function (btn) {

            });
        });
    };

    $scope.capturePreparer = function () {
        if ($scope.mode == 'update') {
            var _captureObjectArray = [];

            _captureObjectArray.push({
                type: 2,
                ID: $routeParams.id,
                name: $scope.preparer.preparerName
            });

            signatureService.openSignatureCaptureDialog(_captureObjectArray).then(function (result) {
                if (angular.isDefined(result) && result === true) {
                    _init();
                }
            }, function (error) {
                $log.error(error);
            });
        }
    };

    $scope.removeSignature = function (type) {
        var signatureTypeObject = { type: 2, ID: $routeParams.id };
        signatureService.removeSignature(signatureTypeObject).then(function (signaturesData) {
            _init();
        }, function (error) {
        });
    };

    //method to show and hide the feature according to the reseller config
    $scope.hasFeature = function (featureName) {
        return resellerService.hasFeature(featureName);
    };
    //just cal first time init function
    _init();
    $scope.getUserlist();
}]);


/* Services start from here */
preparerApp.factory('preparerService', ['$q', '$log', '$http', 'dataAPI', 'userService', function ($q, $log, $http, dataAPI, userService) {
    var preparerService = {};

    /*get all available preparer for showing in list */
    preparerService.getAvailablePreparerList = function () {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/preparer/list'
        }).then(function (response) {
            deferred.resolve(response.data.data.preparerList);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* to create New preparer*/
    preparerService.createPreparer = function (preparerId, preparerName, preparerFname, preparerLname, preparerSsn, preparerTin, practitionerPin, firmName, usStreet, usZipCode, usCity, usState, frStreet, frPostalCode, frCity, frState, frCountry, email, date, selfEmployed, EIN, telephone, fax, nytprin, nyExemptCode, orLicenceNumber, associatedUser, nmCRSidentificationNumber, preparerStin) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/preparer/create',
            data: {
                data: {
                    preparerId: preparerId,
                    preparerName: preparerName,
                    preparerFname: preparerFname,
                    preparerLname: preparerLname,
                    preparerSsn: preparerSsn,
                    preparerTin: preparerTin,
                    practitionerPin: practitionerPin,
                    firmName: firmName,
                    nytprin: nytprin, nyExemptCode: nyExemptCode, orLicenceNumber: orLicenceNumber,
                    usAddress: {
                        street: usStreet,
                        zipCode: usZipCode,
                        city: usCity,
                        state: usState
                    },
                    foreignAddress: {
                        street: frStreet,
                        postalCode: frPostalCode,
                        city: frCity,
                        state: frState,
                        country: frCountry
                    },
                    email: email,
                    date: date,
                    selfEmployed: selfEmployed,
                    EIN: EIN,
                    telephone: telephone,
                    fax: fax,
                    associatedUser: associatedUser,
                    nmCRSidentificationNumber: nmCRSidentificationNumber,
                    preparerStin: preparerStin
                }
            }
        }).then(function (response) {
            if (response && response.data && response.data.data && !_.isEmpty(response.data.data)) {
                userService.updateLocationsSetUpConfig(response.data.data);
            }
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /*below method is api cal to update exsting preparer*/
    preparerService.updatePreparer = function (preparerId, preparerName, preparerFname, preparerLname, preparerSsn, preparerTin, practitionerPin, firmName, usStreet, usZipCode, usCity, usState, frStreet, frPostalCode, frCity, frState, frCountry, email, date, selfEmployed, EIN, telephone, fax, nytprin, nyExemptCode, orLicenceNumber, associatedUser, nmCRSidentificationNumber, preparerStin) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/preparer/save',
            data: {
                data: {
                    preparerId: preparerId,
                    preparerName: preparerName,
                    preparerFname: preparerFname,
                    preparerLname: preparerLname,
                    preparerSsn: preparerSsn,
                    preparerTin: preparerTin,
                    practitionerPin: practitionerPin,
                    firmName: firmName,
                    nytprin: nytprin, nyExemptCode: nyExemptCode, orLicenceNumber: orLicenceNumber,
                    usAddress: {
                        street: usStreet,
                        zipCode: usZipCode,
                        city: usCity,
                        state: usState
                    },
                    foreignAddress: {
                        street: frStreet,
                        postalCode: frPostalCode,
                        city: frCity,
                        state: frState,
                        country: frCountry
                    },
                    email: email,
                    date: date,
                    selfEmployed: selfEmployed,
                    EIN: EIN,
                    telephone: telephone,
                    fax: fax,
                    associatedUser: associatedUser,
                    nmCRSidentificationNumber: nmCRSidentificationNumber,
                    preparerStin: preparerStin
                }
            }
        }).then(function (response) {
            if (response && response.data && response.data.data && !_.isEmpty(response.data.data)) {
                userService.updateLocationsSetUpConfig(response.data.data);
            }
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* the below method is work for edit screen get preparer details based on id the*/
    preparerService.getPreparer = function (preparerId) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/preparer/open',
            data: {
                data: { 'preparerId': preparerId }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* this method is work on both screen for remove preparer  */
    preparerService.removePreparer = function (preparerIds) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: dataAPI.base_url + '/preparer/remove',
            data: {
                data: { 'preparerIds': preparerIds }
            }
        }).then(function (response) {
            if (response && response.data && response.data.data && !_.isEmpty(response.data.data)) {
                userService.updateLocationsSetUpConfig(response.data.data);
            }
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return preparerService;
}]);
