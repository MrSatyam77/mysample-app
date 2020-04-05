"use strict";

var clientLetterApp = angular.module('clientLetterApp', [ 'textAngular' ]);


clientLetterApp.controller('clientLetterController', [ '$scope', '$rootScope', '$log', '$routeParams', '$location', 'clientLetterService', '_', 'messageService', 'userService', 'dialogService', 'localeService', function($scope, $rootScope, $log, $routeParams, $location, clientLetterService, _, messageService, userService, dialogService, localeService) {

	// IF we don't initialize 'letter' blank, on click of place holder it will add 'undefined' as text.
	$scope.clientLetter = {
		"letter" : ""
	};

	// Check for privileges
	$scope.userCan = function(privilege) {
		return userService.can(privilege);
	};

	
	
	/*
	 * to initialize controller's data. Here we are checking mode is edit or create if it is create nothing to do else we have to call API method to get corresponding letter and get Placeholder list
	 */
	var _init = function() {
		if (angular.isDefined($routeParams.id)) {
			$scope.mode = 'edit';
			// get corresponding letter
			_getClientLetterForEdit($routeParams.id);
		} else {
			// for now nothing to do
			$scope.mode = 'create';
		}
		// get Placeholder list
		clientLetterService.getPlaceHolderList().then(function(response) {
			$scope.getPlaceHolderList = response;
		}, function(error) {
			$log.error(error);
		});
	};

	// get EIN details for edit based on id
	var _getClientLetterForEdit = function(id) {
		// Open corresponding client letter
		clientLetterService.openClientLetter($routeParams.id).then(function(response) {
			$scope.clientLetter = response;
		}, function(error) {
			$log.error(error);
			$location.path('/manage/templates/clientLetter');
		});
	};

	// Just call first time init function
	_init();

	// Create new or edit a letter
	$scope.create = function() {
		if (angular.isDefined($scope.clientLetter)) {
			// Check whether letter is in edit mode or new mode
			// IF edit mode then check for standard template.
			if ($scope.mode == 'edit' && angular.isDefined($scope.clientLetter.isPredefined) && $scope.clientLetter.isPredefined == false) {
				clientLetterService.saveClientLetter($scope.clientLetter).then(function(response) {
					messageService.showMessage('Updated successfully', 'success', 'CLIENTLETTERCONTROLLER_UPDATESUCCESS');
					$location.path('/manage/templates/clientLetter');
				}, function(error) {
					$log.error(error);
				});
			} else if ($scope.mode == 'create') {
				clientLetterService.createClientLetter($scope.clientLetter).then(function(response) {
					messageService.showMessage('Created successfully', 'success', 'CLIENTLETTERCONTROLLER_ADDSUCCESS');
					$location.path('/manage/templates/clientLetter');
				}, function(error) {
					$log.error(error);
				});
			}
		}
	};

	
	// Delete letter
	$scope.del = function() {
		// Dialog used for the confirmation from user to Delete or not the selected client letter.
		var dialogConfiguration = {
			'keyboard' : false,
			'backdrop' : false,
			'size' : 'sm',
			'windowClass' : 'my-class'
		};
		localeService.translate("Do you want to delete this client letter ?", 'CLIENTLETTER_DOYOUDELETELETTER_DIALOG_MESSAGE').then(function(translateText) {
			var dialog = dialogService.openDialog("confirm", dialogConfiguration, {text: translateText});
			dialog.result.then(function(btn) {
				var letterToDelete = [];
				if (angular.isDefined($scope.clientLetter.isPredefined) && $scope.clientLetter.isPredefined == false && angular.isDefined($scope.clientLetter.id)) {
					letterToDelete.push($scope.clientLetter.id);

					clientLetterService.deleteClientLetter(letterToDelete).then(function(success) {
						messageService.showMessage('Remove successfully', 'success', 'CLIENTLETTERCONTROLLER_REMOVESUCCESS');
						$location.path('/manage/templates/clientLetter');
					}, function(error) {
						$log.error(error);
					});
				}
			}, function(btn) {

			});
		});
	};

	// on click cancel we just redirect to clientLetter list screen
	$scope.cancel = function() {
		$location.path('/manage/templates/clientLetter');
	};

	

} ]);

/*
 *   Directive is written to insert text into html editor on click of text.
 *   1. Here we bind mouse down event of text and then we prevent that event.
 *   2. We check whether focus is on html editor.
 *   3. We execute html editor's internal command (Available through service) to insert content.
 * 
 */
angular.module('clientLetterApp').directive('taxEditorPlaceholder',taxEditorPlaceholder); 
taxEditorPlaceholder.$inject = ['taExecCommand'];

//implementation function for directive
function taxEditorPlaceholder(taExecCommand){
	return {		
		link : function(scope, elem, attr) {
			//get element
			var placElem = angular.element(elem);

			//bind "mousedown" event
			placElem.bind('mousedown', function(e, eventData) {
				//open accordian if closed.
				//scope.isOpen = true;
				
				//prevent event to execute further. this will prevent text-editor to loose focus.
				e.preventDefault();

				//check whether isplaceholder attribute is set to true and taxEditorPlaceholder attribute is defined, then,
				if (attr.isplaceholder == "true" && !_.isUndefined(attr.taxEditorPlaceholder) && attr.taxEditorPlaceholder != "") {
					//check weather text editor is current active element. 
					if (!_.isUndefined(document.activeElement) && !_.isUndefined(document.activeElement.id) && _.includes(document.activeElement.id, "taTextElement")) {
						// insert html
						var _taExecCommand = taExecCommand();
						_taExecCommand('insertHtml', false, "<span>" + scope.item + "</span>");
					}
				}
			});
			
			
		}
	}
};
clientLetterApp.directive('manageClientLetters', [function () {
    return {
		restrict: 'AE',
		
        templateUrl: '/taxAppJs/manage/clientLetter/partials/list.html',
        controller: ['$scope', '$rootScope', '$log', '$filter', '$location', '$q', '$timeout', 'NgTableParams', '_', 'clientLetterService', 'messageService', 'userService', 'dialogService', 'localeService', function($scope, $rootScope, $log, $filter, $location, $q, $timeout, NgTableParams, _, clientLetterService, messageService, userService, dialogService, localeService) {
			// List of available client letter,
			$scope.clientLetterList = [];
		
			// Check for privileges
			$scope.userCan = function(privilege) {
				return userService.can(privilege);
			};
		
		
			// Fetch list from API
			var _initclientLetterList = function() {
				var deferred = $q.defer();
		
				clientLetterService.getclientLetterList().then(function(response) {
					$scope.clientLetterList = response;
					// _.sortBy($scope.clientLetterList, 'isPredefined')
					deferred.resolve();
				}, function(error) {
					$log.error(error);
					deferred.reject(error);
				});
		
				return deferred.promise;
			};
			var gridFilterOrderedData = [];// hold grid data with order and filter
			// For Grid - Start. First object is configuration and second is for data
			// and other operations from data
			$scope.availableClientLetterList = new NgTableParams({
				page : 1, // show initial page
				count : 10
			// count per page
			}, {
				total : 0, // length of data
				sortingIndicator : 'div', // decides whether to show sorting indicator next to header or right side.
				getData : function($defer, params) {
					// Request to API
					// get Data here
					if (angular.isUndefined($scope.clientLetterList) || $scope.clientLetterList.length == 0) {
						_initclientLetterList().then(function() {
							// Initially no need to apply any filter
							var filteredData = $scope.clientLetterList;
							// Apply standard sorting
							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
							gridFilterOrderedData = orderedData;
							// for paging
							params.total(filteredData.length);
							// Return Result to grid
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}, function(error) {
							$log.error(error);
						});
					} else if (angular.isDefined($scope.clientLetterList) && $scope.clientLetterList.length > 0) {
						var filteredData = $scope.clientLetterList;
		
						// filter based on search field $scope.searchField
						if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
							filteredData = $filter('filter')(filteredData, function(entry, index) {
								if (angular.isDefined(entry.name) && entry.name.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
									return true;
								} else if (angular.isDefined(entry.description) && entry.description.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
									return true;
								}
							});
						}
						;
		
						// Apply standard sorting
						var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						gridFilterOrderedData = orderedData;
						// for paging
						params.total(filteredData.length);
						// Return Result to grid
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				}
			});
		
			// Object holding timeout
			var filterTimeout = {};
		
			// Watch for search from user.
			$scope.$watch('searchField', function(newVal, oldVal) {
				if ($scope.availableClientLetterList.settings().$scope != null && newVal != oldVal) {
					$timeout.cancel(filterTimeout);
					// Register new timeout for filter
					filterTimeout = $timeout(function() {
						// Reload grid. Which will re-bind data by filtering it
						$scope.availableClientLetterList.reload();
						// go to first page.
						$scope.availableClientLetterList.page(1);
					}, 300);
				}
			});

			$scope.clearSearch = function (){
				$scope.searchField = '';
			}; 
		
			// Redirect to Edit screen when click on New for creating client letter
			$scope.create = function() {
				$location.path('/manage/clientLetter/edit');
			};
		
			// Redirect to Edit screen when click on edit for creating client letter
			$scope.edit = function(clientLetter) {
				$location.path('/manage/clientLetter/edit/' + clientLetter.id);
			};
		
			// Delete letter when click on delete
			// Function will handle both single and multiple delete use case
			$scope.del = function(clientLetter) {
				var displayText = '';
				var letterToDelete = [];
				// In-case of single letter delete we directly push letter to array
				if (angular.isDefined(clientLetter) && clientLetter.isPredefined == false) {
					letterToDelete.push(clientLetter.id);
				} else {
					// In-case of multiple delete we check for selected letter and push them to array
					_.forEach($scope.clientLetterList, function(clientLetter) {
						if (angular.isDefined(clientLetter.isSelected) && clientLetter.isSelected == true && clientLetter.isPredefined == false) {
							letterToDelete.push(clientLetter.id);
						}
					});
				}
				// IF array size is greater then zero then only we remove client letter
				if (_.size(letterToDelete) > 0) {
					if (_.size(letterToDelete) > 1) {
						displayText = "Do you want to delete " + _.size(letterToDelete) + " client latters ?";
					} else {
						displayText = "Do you want to delete this client letter ?";
					}
					// Dialog used for the confirmation from user to Delete or not the selected client letter.
					var dialogConfiguration = {
						'keyboard' : false,
						'backdrop' : false,
						'size' : 'sm',
						'windowClass' : 'my-class'
					};
					localeService.translate(displayText, 'CLIENTLETTER_DOYOUDELETELETTER_DIALOG_MESSAGE').then(function(translateText) {
						var dialog = dialogService.openDialog("confirm", dialogConfiguration, {text: translateText});
						dialog.result.then(function(btn) {
							clientLetterService.deleteClientLetter(letterToDelete).then(function(success) {
								messageService.showMessage('Remove successfully', 'success', 'CLIENTLETTERLISTCONTROLLER_REMOVESUCCESS');
								// On successfully deletion we will reinitialized list.
								_initclientLetterList().then(function() {
									$scope.availableClientLetterList.reload();
								}, function(error) {
									$log.error(error);
								});
							}, function(error) {
								$log.error(error);
							});
						}, function(btn) {
		
						});
					});
				}
		
			};
        }]
    }
}]);


// clientLetterApp.controller('clientLetterListController', [ '$scope', '$rootScope', '$log', '$filter', '$location', '$q', '$timeout', 'NgTableParams', '_', 'clientLetterService', 'messageService', 'userService', 'dialogService', 'localeService', function($scope, $rootScope, $log, $filter, $location, $q, $timeout, NgTableParams, _, clientLetterService, messageService, userService, dialogService, localeService) {
// 	// List of available client letter,
// 	$scope.clientLetterList = [];

// 	// Check for privileges
// 	$scope.userCan = function(privilege) {
// 		return userService.can(privilege);
// 	};


// 	// Fetch list from API
// 	var _initclientLetterList = function() {
// 		var deferred = $q.defer();

// 		clientLetterService.getclientLetterList().then(function(response) {
// 			$scope.clientLetterList = response;
// 			// _.sortBy($scope.clientLetterList, 'isPredefined')
// 			deferred.resolve();
// 		}, function(error) {
// 			$log.error(error);
// 			deferred.reject(error);
// 		});

// 		return deferred.promise;
// 	};
// 	var gridFilterOrderedData = [];// hold grid data with order and filter
// 	// For Grid - Start. First object is configuration and second is for data
// 	// and other operations from data
// 	$scope.availableClientLetterList = new NgTableParams({
// 		page : 1, // show initial page
// 		count : 10
// 	// count per page
// 	}, {
// 		total : 0, // length of data
// 		sortingIndicator : 'div', // decides whether to show sorting indicator next to header or right side.
// 		getData : function($defer, params) {
// 			// Request to API
// 			// get Data here
// 			if (angular.isUndefined($scope.clientLetterList) || $scope.clientLetterList.length == 0) {
// 				_initclientLetterList().then(function() {
// 					// Initially no need to apply any filter
// 					var filteredData = $scope.clientLetterList;
// 					// Apply standard sorting
// 					var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
// 					gridFilterOrderedData = orderedData;
// 					// for paging
// 					params.total(filteredData.length);
// 					// Return Result to grid
// 					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
// 				}, function(error) {
// 					$log.error(error);
// 				});
// 			} else if (angular.isDefined($scope.clientLetterList) && $scope.clientLetterList.length > 0) {
// 				var filteredData = $scope.clientLetterList;

// 				// filter based on search field $scope.searchField
// 				if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
// 					filteredData = $filter('filter')(filteredData, function(entry, index) {
// 						if (angular.isDefined(entry.name) && entry.name.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
// 							return true;
// 						} else if (angular.isDefined(entry.description) && entry.description.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
// 							return true;
// 						}
// 					});
// 				}
// 				;

// 				// Apply standard sorting
// 				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
// 				gridFilterOrderedData = orderedData;
// 				// for paging
// 				params.total(filteredData.length);
// 				// Return Result to grid
// 				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
// 			}
// 		}
// 	});

// 	// Object holding timeout
// 	var filterTimeout = {};

// 	// Watch for search from user.
// 	$scope.$watch('searchField', function(newVal, oldVal) {
// 		if ($scope.availableClientLetterList.settings().$scope != null && newVal != oldVal) {
// 			$timeout.cancel(filterTimeout);
// 			// Register new timeout for filter
// 			filterTimeout = $timeout(function() {
// 				// Reload grid. Which will re-bind data by filtering it
// 				$scope.availableClientLetterList.reload();
// 				// go to first page.
// 				$scope.availableClientLetterList.page(1);
// 			}, 300);
// 		}
// 	});

// 	// Redirect to Edit screen when click on New for creating client letter
// 	$scope.create = function() {
// 		$location.path('/manage/clientLetter/edit');
// 	};

// 	// Redirect to Edit screen when click on edit for creating client letter
// 	$scope.edit = function(clientLetter) {
// 		$location.path('/manage/clientLetter/edit/' + clientLetter.id);
// 	};

// 	// Delete letter when click on delete
// 	// Function will handle both single and multiple delete use case
// 	$scope.del = function(clientLetter) {
// 		var displayText = '';
// 		var letterToDelete = [];
// 		// In-case of single letter delete we directly push letter to array
// 		if (angular.isDefined(clientLetter) && clientLetter.isPredefined == false) {
// 			letterToDelete.push(clientLetter.id);
// 		} else {
// 			// In-case of multiple delete we check for selected letter and push them to array
// 			_.forEach($scope.clientLetterList, function(clientLetter) {
// 				if (angular.isDefined(clientLetter.isSelected) && clientLetter.isSelected == true && clientLetter.isPredefined == false) {
// 					letterToDelete.push(clientLetter.id);
// 				}
// 			});
// 		}
// 		// IF array size is greater then zero then only we remove client letter
// 		if (_.size(letterToDelete) > 0) {
// 			if (_.size(letterToDelete) > 1) {
// 				displayText = "Do you want to delete " + _.size(letterToDelete) + " client latters ?";
// 			} else {
// 				displayText = "Do you want to delete this client letter ?";
// 			}
// 			// Dialog used for the confirmation from user to Delete or not the selected client letter.
// 			var dialogConfiguration = {
// 				'keyboard' : false,
// 				'backdrop' : false,
// 				'size' : 'sm',
// 				'windowClass' : 'my-class'
// 			};
// 			localeService.translate(displayText, 'CLIENTLETTER_DOYOUDELETELETTER_DIALOG_MESSAGE').then(function(translateText) {
// 				var dialog = dialogService.openDialog("confirm", dialogConfiguration, {text: translateText});
// 				dialog.result.then(function(btn) {
// 					clientLetterService.deleteClientLetter(letterToDelete).then(function(success) {
// 						messageService.showMessage('Remove successfully', 'success', 'CLIENTLETTERLISTCONTROLLER_REMOVESUCCESS');
// 						// On successfully deletion we will reinitialized list.
// 						_initclientLetterList().then(function() {
// 							$scope.availableClientLetterList.reload();
// 						}, function(error) {
// 							$log.error(error);
// 						});
// 					}, function(error) {
// 						$log.error(error);
// 					});
// 				}, function(btn) {

// 				});
// 			});
// 		}

// 	};
// } ]);

clientLetterApp.factory('clientLetterService', [ '$q', '$log', '$http', 'dataAPI', function($q, $log, $http, dataAPI) {
	var clientLetterService = {};

	/* get all available client letter list */
	clientLetterService.getclientLetterList = function() {
		var deferred = $q.defer();
		// load list from data api
		$http({
			method : 'POST',
			url : dataAPI.base_url + '/clientLetter/list'
		}).then(function(response) {
			deferred.resolve(_.sortBy(response.data.data, {
				"isPredefined" : false
			}));

		}, function(error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	clientLetterService.getPlaceHolderList = function() {
		var deferred = $q.defer();
		// load list from data api
		$http({
			method : 'POST',
			url : dataAPI.base_url + '/clientLetter/placeHolder/list'
		}).then(function(response) {
			deferred.resolve(response.data.data.placeHolder);
		}, function(error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	clientLetterService.createClientLetter = function(clientLetter) {
		var deferred = $q.defer();
		// create client letter
		$http({
			method : 'POST',
			url : dataAPI.base_url + '/clientLetter/create',
			data : {
				'data' : {
					'name' : clientLetter.name,
					'description' : clientLetter.description,
					'letter' : clientLetter.letter
				}
			}
		}).then(function(response) {
			deferred.resolve(response.data.data);
		}, function(error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	clientLetterService.openClientLetter = function(id) {
		var deferred = $q.defer();
		// open a client letter
		$http({
			method : 'POST',
			url : dataAPI.base_url + '/clientLetter/open',
			data : {
				'data' : {
					'id' : id
				}
			}
		}).then(function(response) {
			deferred.resolve(response.data.data);
		}, function(error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	clientLetterService.saveClientLetter = function(clientLetter) {
		var deferred = $q.defer();
		// edit or save client letter
		$http({
			method : 'POST',
			url : dataAPI.base_url + '/clientLetter/save',
			data : {
				'data' : {
					'id' : clientLetter.id,
					'name' : clientLetter.name,
					'description' : clientLetter.description,
					'letter' : clientLetter.letter
				}
			}
		}).then(function(response) {
			deferred.resolve(response.data.data);
		}, function(error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	clientLetterService.deleteClientLetter = function(clientLetter) {
		var deferred = $q.defer();
		// delete client letter
		$http({
			method : 'POST',
			url : dataAPI.base_url + '/clientLetter/remove',
			data : {
				'data' : {
					'clientLetterIds' : clientLetter
				}
			}
		}).then(function(response) {
			deferred.resolve(response.data.data);
		}, function(error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	return clientLetterService;
} ]);
