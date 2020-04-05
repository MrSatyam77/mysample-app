'use strict'

var customReturnTemplateListApp = angular.module('customReturnTemplateListApp', []);

customReturnTemplateListApp.directive('customReturnTemplateLists', [function () {
    return {
		restrict: 'AE',
		templateUrl: '/taxAppJs/return/customTemplate/partials/customTemplate.html',
        controller: ['$scope' ,'$log' ,'$location' ,'$filter' ,'$q', '$timeout' ,'_' ,'NgTableParams' ,'environment' ,'userService' ,'returnAPIService' ,'messageService' ,'localeService' ,'dialogService', 'networkHealthService', 'basketService' ,'systemConfig',
		function($scope, $log, $location, $filter, $q, $timeout, _, NgTableParams, environment, userService, returnAPIService, messageService, localeService, dialogService, networkHealthService, basketService, systemConfig){
	
		//Temporary function to differentiate features as per environment (beta/live)
		$scope.betaOnly = function(){
			if(environment.mode == 'beta' || environment.mode == 'local'){
				return true;
			} else {
				return false;
			}
		};
	
		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};
	
		// Return Actions array
		$scope.returnActions = ['Delete Custom Return Template'];
	
		// Check whether action is disabled or not.
		// We check whether action is disabled or not so we have to pass true for disabling action.
		$scope.isActionDisabled = function(action,returnObj) {
			switch (action) {
				// delete selected return
				case "Delete Custom Return Template":
					return canDelete(returnObj);		
				default:
					return false;					
			}
		};
	
		//get class name for return
		$scope.setReturnClass = function (returnObj) {
			return returnAPIService.setReturnClass(returnObj);
		};
		
		//check user can delete return or not
		//We check whether action is disabled or not so we have to pass true for disabling action.
		var canDelete = function (returnObj) { 
			if ($scope.userCan('CAN_REMOVE_TEMPLATE') == false) {
				return true;
			} else if (returnObj.isCheckedOut == true || returnObj.isLocked == true) { 
				return true;
			} else { 
				return false;
			}
		};
	
		// Load template return list from API
		var initCustomReturnTemplateList = function(){
			var deffered = $q.defer();
	
			returnAPIService.getReturnList(undefined, true).then(function(response){
				$scope.customReturnTemplateList = angular.copy(response);
				deffered.resolve(response);
			}, function(error){
				$log.error(error);
				deffered.reject(error);
			});
	
			return deffered.promise;
		}
	
		// Options for Type in filter
		// This needs to be come from application config for types we support
		//$scope.returnTypes=[{title:"All Types",id:"all"},{title:"1040 - Individual",id:"1040"},{title:"1065 - Partnership",id:"1065"},{title:"1120 - Corporate",id:"1120"},{title:"1120S - S-Corporate",id:"1120S"}];
		$scope.returnTypes=_.union([{title:"All Types",id:"all"}],systemConfig.getReleasedPackages());
		// End
		
		//Filter configuration
		//Note: Due to auto filter implementation on grid, We have to make two objects. One represent display text while one act as id
		//We can not mix both in one other wise grid will try to auto filter on those value as well.
		//For Example - in Type filter we have text as '1040 - individual' but in grid it is written as just 1040
		$scope.filterConfig={};
		$scope.filterDisplay={};
		//$scope.filterConfig.returnType='All Types';
		//End- Filter configuration
		
		// Initial values for filter config
		$scope.initFilterConfig = function(){
			if((_.isUndefined($scope.filterDisplay.type) || $scope.filterDisplay.type!=null || $scope.filterDisplay.type=="")
				&& (_.isUndefined($scope.filterConfig.typeTitle) || $scope.filterConfig.typeTitle!=null || $scope.filterConfig.typeTitle=="")){
				$scope.filterDisplay.type=$scope.returnTypes[0].title;
				$scope.filterConfig.type=$scope.returnTypes[0].type;
			}
			
		};
		//End
		
		var gridFilterOrderedData = [];//hold grid data with order and filter
		// For Grid - Start. First object is configuration and second is for data
		// and other operations from data
		//here we are not given default sorting because we have sorted date by updateddate
		$scope.customReturnTemplateListGrid = new NgTableParams({
			page : 1, // show initial page
			count : 10, // count per page
			
		}, {
			total : 0, // length of data
			sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
			getData : function($defer, params) {
				// Request to API
				// We used to cache data at service level. Now we just use data of controller for table.
				//returnListService.updateReturnList($defer, params, $scope.filterConfig);
				
				// If data is not available then it will reload data from API, else it will use cached data for filtering and sorting			
				if (_.isUndefined($scope.customReturnTemplateList)) {				 
					initCustomReturnTemplateList().then(function(response) {
						// Only On successful API response we bind data to grid.					
						var filteredData = customReturnTemplateListGridFilter($scope.customReturnTemplateList);				
						
						var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						gridFilterOrderedData = orderedData;                                                                                                                   
						params.total(filteredData.length);
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					},function(error){
						$log.error(error);
					});
				}else{
					// cached data
					//filter for return data
					var filteredData = customReturnTemplateListGridFilter($scope.customReturnTemplateList);	
					var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					gridFilterOrderedData = orderedData;                     
					params.total(filteredData.length);
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			}
		});
	
	
		//Filter function for grid
		var customReturnTemplateListGridFilter = function(data){
	
			var filteredData = data;
	
			// filter based on filter config type
			if(!_.isUndefined($scope.filterConfig) && !_.isUndefined($scope.filterConfig.type) && $scope.filterConfig.type !='' && $scope.filterConfig.type != 'all'){
				filteredData = $filter('filter')(filteredData, function(entry, index) {
					if(entry.type.toLowerCase() == $scope.filterConfig.type.toLowerCase()){
						return true;
					}
				});
			}
	
			//filter based on search field $scope.searchField
			if(!_.isUndefined($scope.searchField) && $scope.searchField!=''){
				filteredData = $filter('filter')(filteredData,function(retunEntry,index){
					if(!_.isUndefined(retunEntry.ssnOrEinFull) && retunEntry.ssnOrEinFull.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
						return true;
					}else if(!_.isUndefined(retunEntry.taxPayerName) && retunEntry.taxPayerName.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
						return true;
					}else if(!_.isUndefined(retunEntry.type) && retunEntry.type.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
						return true;
					}else if(!_.isUndefined(retunEntry.year) && retunEntry.year.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
						return true;
					}else if(!_.isUndefined(retunEntry.states) && retunEntry.states.toLowerCase().replace(" ","").indexOf($scope.searchField.toLowerCase())>=0){
						return true;
					} 
				});
			};
			
			//Return filtered data
			return filteredData;	
	
		}
	
		// Watcher for Filter
		// Note: There is one issue currently, When ever filter apply (search,
		// sorting, etc...) It will reload this grid which result in new API Call.
		$scope.$watch("filterConfig.type", function() {
			//This is require to prevent multiple reload on startup 
			if ($scope.customReturnTemplateListGrid.settings().$scope!=null) {			
				$scope.customReturnTemplateListGrid.reload();						 
			}
		});
	
		$scope.clearSearch = function (){
			$scope.searchField = '';
		};
		// change route to new template return view
		$scope.newReturnTemplate = function(){
			//for pass variable from controller to another basket service is used
			basketService.pushItem('newReturnType', 'customReturnTemplate');
			//for pass previous path from controller to another basket service is used
			basketService.pushItem('previousPathForHeaderNav', '/return/customTemplate/list');
			// redirect to new return screen
			$location.path('/return/new/');
		}
	
		//Object holding timeout
		var filterTimeout = {};
		//Watch for search field
		$scope.$watch('searchField',function(newVal,oldVal){
			//If Grid data is defined
			if ($scope.customReturnTemplateListGrid.settings().$scope!=null) {
				//If there is cahnge in old and new value
				if(newVal!=oldVal){
					//Cancel old search filter
					$timeout.cancel(filterTimeout);
					//Register new timeout for filter
					filterTimeout = $timeout(function(){					
						//Reload grid. Which will re-bind data by filtering it
						$scope.customReturnTemplateListGrid.reload();
						//go to first page.
						$scope.customReturnTemplateListGrid.page(1);
					},300);				
				}			
			}
		});
		// For Grid - End
	
		//Open Return
		$scope.openReturn = function(taxReturn){
			if(taxReturn.isCheckedOut==true){
				var message = "some one else"; 
				if(!_.isUndefined(taxReturn.checkedOutBy)){
					message = taxReturn.checkedOutBy;
				}else if(!_.isUndefined(taxReturn.email)){
					message = taxReturn.email;
				}
				messageService.showMessage('This custom return template is opened for editing by '+ message,'error');
			}else{
				// set previous path - return custom template if return is open from custom template list template
				basketService.pushItem('previousPathForOtherNav', '/manage/templates/customerReturnTemplates');
				//condition to check last save return in which mode on that basic user is redirected to input mode or interview mode
				if(!_.isUndefined(taxReturn.returnMode) && !_.isNull(taxReturn.returnMode) && taxReturn.returnMode == 'interview'){
					$location.path('/return/interview/'+taxReturn.id);
				}else{
					$location.path('/return/edit/'+taxReturn.id);
				}
			}
		};
	
		/*
		 * Return Action. like Delete return
		 */
		//returnObj is the parameter which contains the selected return.
		//action is the parameter which contains the particular action.
		$scope.returnAction = function(action,returnObj) {
			// there will be many actions that user can perform
			switch (action) {
			// delete selected return
			case "Delete Custom Return Template":
				if(!_.isUndefined(returnObj) && !_.isEmpty(returnObj)){
					//Dialog used for the confirmation from user to Delete or not the selected Return.
					var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
					localeService.translate('Do you want to delete this custom return template?','CUSTOMTEMPLATELIST_DOYOUDELETETHISRETURN_DIALOG_MESSAGE').then(function(translateText){
						var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
						dialog.result.then(function(btn){
							returnAPIService.deleteReturn([returnObj.id]).then(function(data) {
								messageService.showMessage('Custom Return Template Deleted Successfully', 'success');
								//reload data.
								initCustomReturnTemplateList().then(function(response) {
									$scope.customReturnTemplateListGrid.reload();
								}, function(error) {
									$log.error(error);
								});
							}, function(error) {
								messageService.showMessage('Server Error', 'error');
								$log.error(error);
							});
						},function(btn){
							// Do nothing on cancel
						});
					});	
				}			
				break;
				
			default:
				break;
			}
		};
		
		/* 
		 *  The function is used to reload data from API, and then it reloads the grid of successful response.	
		 * 	Right now, When user click on refresh icon, the function will execute.
		 *  We do not set refreshStart FLAG true in this function, as we may need to use this function somewhere else,
		 *  other wise it will start rotating refresh icon in html.  
		 */
		$scope.manuallyRefresh = function () {
			initCustomReturnTemplateList().then(function (response) {
				$scope.customReturnTemplateListGrid.reload();
				$scope.refreshStart = false;
			}, function (error) {
				$log.error(error);
				$scope.refreshStart = false;
			});
		};
	
		//Initialize network status flag and subscribe channel to get update 
		$scope.isOnline = networkHealthService.getNetworkStatus();
	
		var _networkStatusSubscription = postal.subscribe({
			channel: 'MTPO-UI',
			topic: 'networkStatus',
			callback: function (data, envelope) {
				$scope.isOnline = data.isOnline;
			}
		});
	
		
		$scope.$on('$destroy', function () {
			//unsubscribe network status subscription to prevent memory leak
			_networkStatusSubscription.unsubscribe();
		});
        }]
    }
}]);
// customReturnTemplateListApp.controller('customReturnTemplateListController', ['$scope' ,'$log' ,'$location' ,'$filter' ,'$q', '$timeout' ,'_' ,'NgTableParams' ,'environment' ,'userService' ,'returnAPIService' ,'messageService' ,'localeService' ,'dialogService', 'networkHealthService', 'basketService' ,'systemConfig',
// 	function($scope, $log, $location, $filter, $q, $timeout, _, NgTableParams, environment, userService, returnAPIService, messageService, localeService, dialogService, networkHealthService, basketService, systemConfig){

// 	//Temporary function to differentiate features as per environment (beta/live)
// 	$scope.betaOnly = function(){
// 		if(environment.mode == 'beta' || environment.mode == 'local'){
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	};

// 	//Check for privileges
//     $scope.userCan = function (privilege) {
//         return userService.can(privilege);
//     };

//     // Return Actions array
//     $scope.returnActions = ['Delete Custom Return Template'];

//     // Check whether action is disabled or not.
//     // We check whether action is disabled or not so we have to pass true for disabling action.
//     $scope.isActionDisabled = function(action,returnObj) {
//     	switch (action) {
// 			// delete selected return
// 			case "Delete Custom Return Template":
// 				return canDelete(returnObj);		
// 			default:
// 				return false;					
//     	}
// 	};

// 	//get class name for return
//     $scope.setReturnClass = function (returnObj) {
//         return returnAPIService.setReturnClass(returnObj);
//     };
    
//     //check user can delete return or not
// 	//We check whether action is disabled or not so we have to pass true for disabling action.
//     var canDelete = function (returnObj) { 
//         if ($scope.userCan('CAN_REMOVE_TEMPLATE') == false) {
//             return true;
//         } else if (returnObj.isCheckedOut == true || returnObj.isLocked == true) { 
//             return true;
//         } else { 
//             return false;
//         }
//     };

//     // Load template return list from API
//     var initCustomReturnTemplateList = function(){
//     	var deffered = $q.defer();

//     	returnAPIService.getReturnList(undefined, true).then(function(response){
//     		$scope.customReturnTemplateList = angular.copy(response);
//     		deffered.resolve(response);
//     	}, function(error){
//     		$log.error(error);
//     		deffered.reject(error);
//     	});

//     	return deffered.promise;
//     }

//     // Options for Type in filter
// 	// This needs to be come from application config for types we support
// 	//$scope.returnTypes=[{title:"All Types",id:"all"},{title:"1040 - Individual",id:"1040"},{title:"1065 - Partnership",id:"1065"},{title:"1120 - Corporate",id:"1120"},{title:"1120S - S-Corporate",id:"1120S"}];
// 	$scope.returnTypes=_.union([{title:"All Types",id:"all"}],systemConfig.getReleasedPackages());
// 	// End
	
// 	//Filter configuration
// 	//Note: Due to auto filter implementation on grid, We have to make two objects. One represent display text while one act as id
// 	//We can not mix both in one other wise grid will try to auto filter on those value as well.
// 	//For Example - in Type filter we have text as '1040 - individual' but in grid it is written as just 1040
// 	$scope.filterConfig={};
// 	$scope.filterDisplay={};
// 	//$scope.filterConfig.returnType='All Types';
// 	//End- Filter configuration
	
// 	// Initial values for filter config
// 	$scope.initFilterConfig = function(){
// 		if((_.isUndefined($scope.filterDisplay.type) || $scope.filterDisplay.type!=null || $scope.filterDisplay.type=="")
// 			&& (_.isUndefined($scope.filterConfig.typeTitle) || $scope.filterConfig.typeTitle!=null || $scope.filterConfig.typeTitle=="")){
// 			$scope.filterDisplay.type=$scope.returnTypes[0].title;
// 			$scope.filterConfig.type=$scope.returnTypes[0].type;
// 		}
		
// 	};
// 	//End
	
//     var gridFilterOrderedData = [];//hold grid data with order and filter
// 	// For Grid - Start. First object is configuration and second is for data
//     // and other operations from data
//     //here we are not given default sorting because we have sorted date by updateddate
// 	$scope.customReturnTemplateListGrid = new NgTableParams({
// 		page : 1, // show initial page
// 		count : 10, // count per page
		
// 	}, {
// 		total : 0, // length of data
// 		sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
// 		getData : function($defer, params) {
// 			// Request to API
// 			// We used to cache data at service level. Now we just use data of controller for table.
// 			//returnListService.updateReturnList($defer, params, $scope.filterConfig);
			
// 			// If data is not available then it will reload data from API, else it will use cached data for filtering and sorting			
// 			if (_.isUndefined($scope.customReturnTemplateList)) {				 
// 				initCustomReturnTemplateList().then(function(response) {
// 					// Only On successful API response we bind data to grid.					
// 					var filteredData = customReturnTemplateListGridFilter($scope.customReturnTemplateList);				
					
//                     var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
//                     gridFilterOrderedData = orderedData;                                                                                                                   
// 					params.total(filteredData.length);
// 					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
// 				},function(error){
// 					$log.error(error);
// 				});
// 			}else{
// 				// cached data
// 				//filter for return data
// 				var filteredData = customReturnTemplateListGridFilter($scope.customReturnTemplateList);	
//                 var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
//                 gridFilterOrderedData = orderedData;                     
// 				params.total(filteredData.length);
// 				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
// 			}
// 		}
// 	});


//     //Filter function for grid
//     var customReturnTemplateListGridFilter = function(data){

//     	var filteredData = data;

//     	// filter based on filter config type
// 		if(!_.isUndefined($scope.filterConfig) && !_.isUndefined($scope.filterConfig.type) && $scope.filterConfig.type !='' && $scope.filterConfig.type != 'all'){
// 			filteredData = $filter('filter')(filteredData, function(entry, index) {
// 				if(entry.type.toLowerCase() == $scope.filterConfig.type.toLowerCase()){
// 					return true;
// 				}
// 			});
// 		}

// 		//filter based on search field $scope.searchField
// 		if(!_.isUndefined($scope.searchField) && $scope.searchField!=''){
// 			filteredData = $filter('filter')(filteredData,function(retunEntry,index){
// 				if(!_.isUndefined(retunEntry.ssnOrEinFull) && retunEntry.ssnOrEinFull.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
// 					return true;
// 				}else if(!_.isUndefined(retunEntry.taxPayerName) && retunEntry.taxPayerName.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
// 					return true;
// 				}else if(!_.isUndefined(retunEntry.type) && retunEntry.type.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
// 					return true;
// 				}else if(!_.isUndefined(retunEntry.year) && retunEntry.year.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
// 					return true;
// 				}else if(!_.isUndefined(retunEntry.states) && retunEntry.states.toLowerCase().replace(" ","").indexOf($scope.searchField.toLowerCase())>=0){
// 					return true;
// 				} 
// 			});
// 		};
		
// 		//Return filtered data
// 		return filteredData;	

//     }

//     // Watcher for Filter
// 	// Note: There is one issue currently, When ever filter apply (search,
// 	// sorting, etc...) It will reload this grid which result in new API Call.
// 	$scope.$watch("filterConfig.type", function() {
// 		//This is require to prevent multiple reload on startup 
// 		if ($scope.customReturnTemplateListGrid.settings().$scope!=null) {			
// 			$scope.customReturnTemplateListGrid.reload();						 
// 		}
// 	});

// 	// change route to new template return view
// 	$scope.newReturnTemplate = function(){
// 		//for pass variable from controller to another basket service is used
// 		basketService.pushItem('newReturnType', 'customReturnTemplate');
// 		//for pass previous path from controller to another basket service is used
// 		basketService.pushItem('previousPathForHeaderNav', '/return/customTemplate/list');
// 		// redirect to new return screen
// 		$location.path('/return/new/');
// 	}

// 	//Object holding timeout
// 	var filterTimeout = {};
// 	//Watch for search field
// 	$scope.$watch('searchField',function(newVal,oldVal){
// 		//If Grid data is defined
// 		if ($scope.customReturnTemplateListGrid.settings().$scope!=null) {
// 			//If there is cahnge in old and new value
// 			if(newVal!=oldVal){
// 				//Cancel old search filter
// 				$timeout.cancel(filterTimeout);
// 				//Register new timeout for filter
// 				filterTimeout = $timeout(function(){					
// 					//Reload grid. Which will re-bind data by filtering it
// 					$scope.customReturnTemplateListGrid.reload();
// 					//go to first page.
// 					$scope.customReturnTemplateListGrid.page(1);
// 				},300);				
// 			}			
// 		}
// 	});
// 	// For Grid - End

// 	//Open Return
// 	$scope.openReturn = function(taxReturn){
// 		if(taxReturn.isCheckedOut==true){
// 			var message = "some one else"; 
// 			if(!_.isUndefined(taxReturn.checkedOutBy)){
// 				message = taxReturn.checkedOutBy;
// 			}else if(!_.isUndefined(taxReturn.email)){
// 				message = taxReturn.email;
// 			}
// 			messageService.showMessage('This custom return template is opened for editing by '+ message,'error');
// 		}else{
// 			// set previous path - return custom template if return is open from custom template list template
// 			basketService.pushItem('previousPathForOtherNav', '/return/customTemplate/list');
// 			//condition to check last save return in which mode on that basic user is redirected to input mode or interview mode
// 			if(!_.isUndefined(taxReturn.returnMode) && !_.isNull(taxReturn.returnMode) && taxReturn.returnMode == 'interview'){
// 				$location.path('/return/interview/'+taxReturn.id);
// 			}else{
// 				$location.path('/return/edit/'+taxReturn.id);
// 			}
// 		}
// 	};

// 	/*
// 	 * Return Action. like Delete return
// 	 */
// 	//returnObj is the parameter which contains the selected return.
// 	//action is the parameter which contains the particular action.
// 	$scope.returnAction = function(action,returnObj) {
// 		// there will be many actions that user can perform
// 		switch (action) {
// 		// delete selected return
// 		case "Delete Custom Return Template":
// 			if(!_.isUndefined(returnObj) && !_.isEmpty(returnObj)){
// 				//Dialog used for the confirmation from user to Delete or not the selected Return.
// 				var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
// 				localeService.translate('Do you want to delete this custom return template?','CUSTOMTEMPLATELIST_DOYOUDELETETHISRETURN_DIALOG_MESSAGE').then(function(translateText){
// 			    	var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
// 					dialog.result.then(function(btn){
//                         returnAPIService.deleteReturn([returnObj.id]).then(function(data) {
//                             messageService.showMessage('Custom Return Template Deleted Successfully', 'success');
//                             //reload data.
//                             initCustomReturnTemplateList().then(function(response) {
//                                 $scope.customReturnTemplateListGrid.reload();
//                             }, function(error) {
//                                 $log.error(error);
//                             });
//                         }, function(error) {
//                             messageService.showMessage('Server Error', 'error');
//                             $log.error(error);
//                         });
// 					},function(btn){
// 						// Do nothing on cancel
// 					});
// 				});	
// 			}			
// 			break;
			
// 		default:
// 			break;
// 		}
// 	};
	
// 	/* 
// 	 *  The function is used to reload data from API, and then it reloads the grid of successful response.	
// 	 * 	Right now, When user click on refresh icon, the function will execute.
// 	 *  We do not set refreshStart FLAG true in this function, as we may need to use this function somewhere else,
// 	 *  other wise it will start rotating refresh icon in html.  
// 	 */
// 	$scope.manuallyRefresh = function () {
// 		initCustomReturnTemplateList().then(function (response) {
//             $scope.customReturnTemplateListGrid.reload();
//             $scope.refreshStart = false;
//         }, function (error) {
//             $log.error(error);
//             $scope.refreshStart = false;
//         });
//     };

//     //Initialize network status flag and subscribe channel to get update 
//     $scope.isOnline = networkHealthService.getNetworkStatus();

//     var _networkStatusSubscription = postal.subscribe({
//         channel: 'MTPO-UI',
//         topic: 'networkStatus',
//         callback: function (data, envelope) {
//             $scope.isOnline = data.isOnline;
//         }
//     });

    
//     $scope.$on('$destroy', function () {
//         //unsubscribe network status subscription to prevent memory leak
//         _networkStatusSubscription.unsubscribe();
//     });

// }]);