'use strict';

var EINApp = angular.module('EINApp', []);

EINApp.directive('einLists', [function () {
    return {
        restrict: 'AE',
        templateUrl: '/taxAppJs/manage/EIN/partials/list.html',
        controller: ['$scope','$filter','$log','$location','$q','$timeout','NgTableParams','EINService','messageService','userService','dialogService','localeService',function ($scope, $filter, $log, $location, $q, $timeout, NgTableParams, EINService, messageService, userService, dialogService, localeService) {
    
            //Check for privileges
            $scope.userCan = function (privilege) {
                return userService.can(privilege);
            };
            
               //initialize  EIN  list
            var _initAvailableEIN = function () {
               
                var deferred = $q.defer();
                EINService.getAvailableEIN().then(function (response) {
                    $scope.availableEIN = response.einList;
                   
                    deferred.resolve();
                }, function (error) {
                   
                    $log.error(error);
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            var gridFilterOrderedData = [];//hold grid data with order and filter
            // For Grid - Start. First object is configuration and second is for data
            // and other operations from data
            $scope.availableEINList = new NgTableParams({
                page : 1, // show initial page
                count: 10,// count per page
                sorting : {
                    // initial sorting
                    ein : 'asc'
                }
            }, {
                total : 0, // length of data
                sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
                getData : function ($defer, params) {
                    // Request to API
                    // get Data here				
                    if (angular.isUndefined($scope.availableEIN)) {
                        _initAvailableEIN().then(function () {
                            // Only On successful API response we bind data to grid.			
                            var filteredData = $scope.availableEIN;
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
                        var filteredData = $scope.availableEIN;			
                        //filter based on search field $scope.searchField
                        if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
                            filteredData = $filter('filter')(filteredData, function (EIN, index) {
                                if (angular.isDefined(EIN.ein.ein) && EIN.ein.ein.indexOf($scope.searchField.toLowerCase()) >= 0 ){
                                    return true;
                                }
                                else if (angular.isDefined(EIN.ein.employersName) && EIN.ein.employersName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0){
                                    return true;
                                }
                                else if (angular.isDefined(EIN.ein.usAddress.street) && EIN.ein.usAddress.street.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
                                    return true;
                                }
                                else if (angular.isDefined(EIN.ein.usAddress.city) && EIN.ein.usAddress.city.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0 ){
                                    return true;
                                }
                                else if (angular.isDefined(EIN.ein.usAddress.state) && EIN.ein.usAddress.state.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0){
                                    return true;
                                }
                                else if (angular.isDefined(EIN.ein.usAddress.zipCode) && EIN.ein.usAddress.zipCode.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
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
                //If Grid data is defined and newval and old val is not same
                if ($scope.availableEINList.settings().$scope != null && newVal != oldVal) {
                        //Cancel old search filter
                        $timeout.cancel(filterTimeout);
                        //Register new timeout for filter
                        filterTimeout = $timeout(function () {
                            //Reload grid. Which will re-bind data by filtering it
                            $scope.availableEINList.reload();
                            //go to first page.
                            $scope.availableEINList.page(1);
                        }, 300);
                    
                }
            });
        
            //Redirect to Edit screen when click on New for creating EIN 
            $scope.createNewEIN = function () {
                $location.path('/manage/EIN/edit');
            };

            $scope.clearSearch = function (){
                $scope.searchField = '';
            };
            
            //for remove EIN we have two way multiple or single pass key for single 
            $scope.removeEIN = function (einNo) {
                
                var displayText='';
                var EINToDelete = [];
                if (angular.isDefined(einNo)) {
                    EINToDelete.push(einNo);
                }
                else {
                    _.forEach($scope.availableEIN, function (EIN) {
                        if (angular.isDefined(EIN.ein.isSelected) && EIN.ein.isSelected == true) {
                            EINToDelete.push(EIN.ein.ein);
                        }
                    });
                }
                if (_.size(EINToDelete) != 0) {
                   
                    if(_.size(EINToDelete) > 1){
                        displayText = "Do you want to delete "+_.size(EINToDelete)+" EIN ?";
                    }else{
                        displayText = "Do you want to delete this EIN ?";
                    }
                    
                    //Dialog used for the confirmation from user to Delete or not the selected EIN.
                    var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
                    localeService.translate(displayText,'EIN_DOYOUDELETETHISEIN_DIALOG_MESSAGE').then(function(translateText){
                        var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
                        dialog.result.then(function(btn){
                        
                            EINService.removeEIN(EINToDelete).then(function (success) {
                                messageService.showMessage('Remove successfully', 'success','EINLISTCONTROLLER_REMOVESUCCESS');
                                _initAvailableEIN().then(function (response) {
                               
                                    $scope.availableEINList.reload();
                                }, function (error) {
                               
                                    $log.error(error);
                                });
                                }, function (error) {
                           
                                    $log.error(error);
                                });
                        },function(btn){
            
                        });
                    });
                }
            };
            
            //for editing we just redirect to edit screen with key of perticular record
            $scope.editEIN = function (eno) {
                $location.path('/manage/EIN/edit/' + eno);
            };
        
        }]
    }
}]);

//EIN List controller
// EINApp.controller('EINListController', ['$scope','$filter','$log','$location','$q','$timeout','NgTableParams','EINService','messageService','userService','dialogService','localeService',function ($scope, $filter, $log, $location, $q, $timeout, NgTableParams, EINService, messageService, userService, dialogService, localeService) {
    
//     //Check for privileges
//     $scope.userCan = function (privilege) {
//         return userService.can(privilege);
//     };
    
//        //initialize  EIN  list
//     var _initAvailableEIN = function () {
       
//         var deferred = $q.defer();
//         EINService.getAvailableEIN().then(function (response) {
//             $scope.availableEIN = response.einList;
           
//             deferred.resolve();
//         }, function (error) {
           
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
//     var gridFilterOrderedData = [];//hold grid data with order and filter
//     // For Grid - Start. First object is configuration and second is for data
//     // and other operations from data
//     $scope.availableEINList = new NgTableParams({
//         page : 1, // show initial page
//         count: 10,// count per page
//         sorting : {
//             // initial sorting
//             ein : 'asc'
//         }
//     }, {
//         total : 0, // length of data
//         sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
//         getData : function ($defer, params) {
//             // Request to API
//             // get Data here				
//             if (angular.isUndefined($scope.availableEIN)) {
//                 _initAvailableEIN().then(function () {
//                     // Only On successful API response we bind data to grid.			
//                     var filteredData = $scope.availableEIN;
//                     filteredData = $filter('filter')(filteredData, $scope.searchField);		
//                     //Apply standard sorting
//                     var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
//                     gridFilterOrderedData = orderedData;     
//                     params.total(filteredData.length);
//                     //Return Result to grid
//                     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
//                 }, function (error) {
//                     $log.error(error);
//                 });
//             }
//             else {
//                 // Only On successful API response we bind data to grid.			
//                 var filteredData = $scope.availableEIN;			
//                 //filter based on search field $scope.searchField
//                 if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
//                     filteredData = $filter('filter')(filteredData, function (EIN, index) {
//                         if (angular.isDefined(EIN.ein.ein) && EIN.ein.ein.indexOf($scope.searchField.toLowerCase()) >= 0 ){
//                             return true;
//                         }
//                         else if (angular.isDefined(EIN.ein.employersName) && EIN.ein.employersName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0){
//                             return true;
//                         }
//                         else if (angular.isDefined(EIN.ein.usAddress.street) && EIN.ein.usAddress.street.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
//                             return true;
//                         }
//                         else if (angular.isDefined(EIN.ein.usAddress.city) && EIN.ein.usAddress.city.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0 ){
//                             return true;
//                         }
//                         else if (angular.isDefined(EIN.ein.usAddress.state) && EIN.ein.usAddress.state.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0){
//                             return true;
//                         }
//                         else if (angular.isDefined(EIN.ein.usAddress.zipCode) && EIN.ein.usAddress.zipCode.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
//                             return true;
//                         }
                        
//                     });
//                 };
//                 //Apply standard sorting
//                 var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
//                 gridFilterOrderedData = orderedData;     
//                 params.total(filteredData.length);
//                 //Return Result to grid
//                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
//             }
//         }
//     });
//     //Object holding timeout
//     var filterTimeout = {};
//     //Watch for search field
//     $scope.$watch('searchField', function (newVal, oldVal) {
//         //If Grid data is defined and newval and old val is not same
//         if ($scope.availableEINList.settings().$scope != null && newVal != oldVal) {
//                 //Cancel old search filter
//                 $timeout.cancel(filterTimeout);
//                 //Register new timeout for filter
//                 filterTimeout = $timeout(function () {
//                     //Reload grid. Which will re-bind data by filtering it
//                     $scope.availableEINList.reload();
//                     //go to first page.
//                     $scope.availableEINList.page(1);
//                 }, 300);
            
//         }
//     });

//     //Redirect to Edit screen when click on New for creating EIN 
//     $scope.createNewEIN = function () {
//         $location.path('/manage/EIN/edit');
//     };
    
//     //for remove EIN we have two way multiple or single pass key for single 
//     $scope.removeEIN = function (einNo) {
    	
//     	var displayText='';
//         var EINToDelete = [];
//         if (angular.isDefined(einNo)) {
//             EINToDelete.push(einNo);
//         }
//         else {
//             _.forEach($scope.availableEIN, function (EIN) {
//                 if (angular.isDefined(EIN.ein.isSelected) && EIN.ein.isSelected == true) {
//                     EINToDelete.push(EIN.ein.ein);
//                 }
//             });
//         }
//         if (_.size(EINToDelete) != 0) {
           
//         	if(_.size(EINToDelete) > 1){
//         		displayText = "Do you want to delete "+_.size(EINToDelete)+" EIN ?";
//         	}else{
//         		displayText = "Do you want to delete this EIN ?";
//         	}
        	
//         	//Dialog used for the confirmation from user to Delete or not the selected EIN.
//         	var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
//         	localeService.translate(displayText,'EIN_DOYOUDELETETHISEIN_DIALOG_MESSAGE').then(function(translateText){
// 	        	var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
// 				dialog.result.then(function(btn){
	        	
// 					EINService.removeEIN(EINToDelete).then(function (success) {
// 						messageService.showMessage('Remove successfully', 'success','EINLISTCONTROLLER_REMOVESUCCESS');
// 						_initAvailableEIN().then(function (response) {
	                   
// 							$scope.availableEINList.reload();
// 						}, function (error) {
	                   
// 							$log.error(error);
// 						});
// 						}, function (error) {
	               
// 							$log.error(error);
// 						});
// 				},function(btn){
	
// 				});
//         	});
//         }
//     };
    
//     //for editing we just redirect to edit screen with key of perticular record
//     $scope.editEIN = function (eno) {
//         $location.path('/manage/EIN/edit/' + eno);
//     };

// }]);

//* edit controller *//
EINApp.controller('EINEditController', ['$scope','$log','$location','$routeParams','$q','EINService','messageService','userService','dialogService','localeService',function ($scope, $log, $location, $routeParams, $q, EINService, messageService, userService, dialogService, localeService) {
    
    //Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);
    };
    
    //when EIN already exist we store value is true
    $scope.isEINExistErr = false;

    //Object holding EIN information
    $scope.EIN = {};
    $scope.EIN.usAddress = {};
    $scope.EIN.foreignAddress = {}

    //here we are checking mode is update or create if it is create nothing to do else we have to call pi method to get exsting info for update 
    var _init = function () {
        if (angular.isDefined($routeParams.id)) {
            $scope.mode = 'update';
        }
        else {
            $scope.mode = 'create';
        }
        if ($scope.mode == 'update') {
            _getEINForEdit($routeParams.id);
        }
        else if ($scope.mode == 'create') {
            //for now nothing to do 
        }
    };
    
    //get EIN details for edit based on id 
    var _getEINForEdit = function (id) {
       
        EINService.getEIN(id).then(function (success) {
           
            $scope.EIN = success;
        }, function (error) {
            $log.error(error);
        });
    };
    
    //save or update EIN Base ON Id 
    $scope.saveEIN = function () {
		 var einLst = [{
	     	ein : $scope.EIN.ein,
	         employersName : $scope.EIN.employersName,
	         usAddress: {street: $scope.EIN.usAddress.street, zipCode: $scope.EIN.usAddress.zipCode, city: $scope.EIN.usAddress.city, state: $scope.EIN.usAddress.state},
	         foreignAddress: {street: $scope.EIN.foreignAddress.street, postalCode: $scope.EIN.foreignAddress.postalCode, city: $scope.EIN.foreignAddress.city, state: $scope.EIN.foreignAddress.state, country: $scope.EIN.foreignAddress.country}
	        }];
    	 
        if ($scope.mode == 'update') {           
            EINService.updateEIN(einLst).then(function (success) {               
                messageService.showMessage('Updated successfully', 'success','EINLISTCONTROLLER_UPDATESUCCESS');
                //after success we just redirect to EIN list screen
                $location.path('/manage/templates/einLibraries');
            }, function (error) {
               
                $log.error(error);
            });
        }else {
            EINService.createEIN(einLst).then(function (success) {               
                messageService.showMessage('Created successfully', 'success','EINLISTCONTROLLER_CREATESUCCESS');
                //after success we just redirect to EIN list screen
                $location.path('/manage/templates/einLibraries');
            }, function (error) {               
                if (error.status == 401) {
                    if (error.data.code == 4010) {
                        $scope.isEINExistErr = true;
                    }
                    else {
                        $scope.isEINExistErr = false;
                        $log.error(error);
                    }
                }
            });
        }
        
    };
    
    //on click cancel we just redirect to EIN list screen 
    $scope.cancel = function () {
        $location.path('/manage/templates/einLibraries');
    };
    
    //for remove single EIN
    $scope.removeEIN = function () {
    	//Dialog used for the confirmation from user to Delete or not the selected EIN.
    	var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
    	localeService.translate('Do you want to delete this EIN?','EIN_DOYOUDELETETHISEIN_DIALOG_MESSAGE').then(function(translateText){
	    	var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
			dialog.result.then(function(btn){
				var EINToDelete = [];
				EINToDelete.push($routeParams.id);
				EINService.removeEIN(EINToDelete).then(function (success) {
					messageService.showMessage('Remove successfully', 'success','EINLISTCONTROLLER_REMOVESUCCESS');
					//after success reditrect to EIN list screen
					$location.path('/manage/templates/einLibraries');
				}, function (error) {
					$log.error(error);
				});	
			},function(btn){
				
			});
    	});
    };
    
    //just cal first time init function
    _init();
}]);


/* Services start from here */
EINApp.factory('EINService', ['$q', '$log','$http','dataAPI', function ($q, $log, $http, dataAPI) {
    var EINService = {};

    /*get all available Ein for showing in list */
    EINService.getAvailableEIN = function () {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/ein/list'
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* to create New EIN*/
    EINService.createEIN = function (einLst) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/ein/create',
            data: {
            	einList : einLst
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    /*below method is api cal to update exsting EIN*/
    EINService.updateEIN = function (einLst) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/ein/save',
            data: {
            	einList : einLst
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    /* the below method is work for edit screen get EIN details based on id the*/
    EINService.getEIN = function (einid) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/ein/open',
            data : {
                data : { 'ein' : einid }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    /* this method is work on both screen for remove EIN  */
    EINService.removeEIN = function (einIds) {
        var deferred = $q.defer();
        
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/ein/remove',
            data: {
                data : { 'einIds' : einIds }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return EINService;
} ]);