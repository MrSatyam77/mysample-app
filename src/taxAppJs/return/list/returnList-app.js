'use strict';

var returnListApp = angular.module('returnListApp', []);

//Controller 
returnListApp.controller('returnListController', ['$scope', '$routeParams', '$log', '$location', '$filter', '$q', '$timeout', 'NgTableParams', 'toaster', 'messageService', 'returnAPIService', 'userService', 'dialogService', 'basketService', 'localeService', 'exportService', 'systemConfig', 'environment', 'networkHealthService', '$injector',
	function ($scope, $routeParams, $log, $location, $filter, $q, $timeout, NgTableParams, toaster, messageService, returnAPIService, userService, dialogService, basketService, localeService, exportService, systemConfig, environment, networkHealthService, $injector) {

		//Temporary function to differentiate features as per environment (beta/live)
		$scope.betaOnly = function () {
			if (environment.mode == 'beta' || environment.mode == 'local')
				return true;
			else
				return false;
		};
		$scope.backToHomeScreen = function () {
			$location.path('/home');

		}

		var exportConfig = {
			"pdf": {
				"all": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 70 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "homeTelephone", text: "PHONE NUMBER", width: 'auto' }, { key: "taxPayerEmail", text: "E-MAIL", width: 'auto', }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1040": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 70 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "homeTelephone", text: "PHONE NUMBER", width: 'auto' }, { key: "taxPayerEmail", text: "E-MAIL", width: 'auto', }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1065": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 150 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "homeTelephone", text: "PHONE NUMBER", width: 'auto' }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1120": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 150 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1120s": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 150 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1041": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 150 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"990": [{ key: "ssnOrEinFull", text: "SSN/EIN", width: 150 }, { key: "taxPayerName", text: "TAXPAYER NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 70 }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }]
			},
			"csv": {
				"all": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "taxpayerFirstName", text: "FIRST NAME" }, { key: "taxpayerLastName", text: "LAST NAME" }, { key: "businessName", text: "BUSINESS NAME" }, { key: "spouseName", text: "SPOUSE NAME", width: 'auto' }, { key: "homeTelephone", text: "PHONE NUMBER", width: 'auto' }, { key: "taxPayerEmail", text: "E-MAIL", width: 'auto' }, { key: "birthDate", text: "TAXPAYER BIRTHDATE", width: 'auto' }, { key: "spouseBirthDate", text: "SPOUSE BIRTHDATE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1040": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "taxpayerFirstName", text: "FIRST NAME" }, { key: "taxpayerLastName", text: "LAST NAME" }, { key: "spouseName", text: "SPOUSE NAME", width: 'auto' }, { key: "homeTelephone", text: "PHONE NUMBER", width: 'auto' }, { key: "taxPayerEmail", text: "E-MAIL", width: 'auto' }, { key: "birthDate", text: "TAXPAYER BIRTHDATE", width: 'auto' }, { key: "spouseBirthDate", text: "SPOUSE BIRTHDATE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1065": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "businessName", text: "BUSINESS NAME" }, { key: "homeTelephone", text: "PHONE NUMBER", width: 'auto' }, { key: "type", text: "TYPE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1120": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "businessName", text: "BUSINESS NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1120s": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "businessName", text: "BUSINESS NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"1041": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "businessName", text: "BUSINESS NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }],
				"990": [{ key: "ssnOrEinFull", text: "SSN/EIN" }, { key: "businessName", text: "BUSINESS NAME" }, { key: "type", text: "TYPE", width: 'auto' }, { key: "street", text: "STREET" }, { key: "city", text: "CITY" }, { key: "state", text: "STATE" }, { key: "zip", text: "ZIP" }, { key: "year", text: "YEAR", width: 'auto' }, { key: "states", text: "ASSOCIATED STATES", width: 'auto' }, { key: "status.title", text: "STATUS", width: 'auto' }, { key: "updatedByName", text: "PREPARED BY", width: 'auto' }]
			}
		};



		if (angular.isDefined($routeParams.message)) {
			toaster.pop('error', '', $routeParams.message);
		}
		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};

		//Load filter from basketService. (Non transmitted)
		//This is used when user come on this screen from toDos widget
		var externalFilter = basketService.popItem('returnListExternalFilter');

		// Return status array from returnAPIService    
		$scope.returnStatus = angular.copy(userService.getReturnStatusList());

		// Return Actions array
		$scope.returnActions = ['Delete Return', 'Print Client Organizer', 'Message', 'Copy Return', 'Create Amend Return'];

		// Check whether action is disabled or not.
		// We check whether action is disabled or not so we have to pass true for disabling action.
		$scope.isActionDisabled = function (action, returnObj) {
			switch (action) {
				// delete selected return
				case "Delete Return":
					return canDelete(returnObj);

				case "Print Client Organizer":
					return !$scope.userCan("CAN_PRINT_CLIENTORGANIZER");

				case "Message":
					return false;

				case "Copy Return":
					return false;

				case 'Create Amend Return':
					if (returnObj.type === "1040" && canCreateAmendedCopy(returnObj) === true) {
						return false;
					} else {
						return true;
					}

				default:
					return false;
			}
		};

		// to display action or not this function called.
		$scope.isactionDisplayed = function (action) {
			switch (action) {
				// delete selected return
				case "Delete Return":
					return true;

				case "Print Client Organizer":
					return true;

				case "Message":
					return true;

				case "Copy Return":
					if ($scope.betaOnly())
						return true;
					else
						return false

				case 'Create Amend Return':
					if ($scope.betaOnly())
						return true;
					else
						return false


				default:
					return false;
			}
		}

		// right now we allow to create amended copy for federal state and accespted return only.
		var canCreateAmendedCopy = function (returnObj) {
			var canCreate = false;
			if (returnObj.eFileStatus && returnObj.eFileStatus.federal) {
				_.forEach(Object.keys(returnObj.eFileStatus.federal), function (key) {
					if (key === "1040"
						&& returnObj.eFileStatus.federal[key]["returnTypeCategory"] === "MainForm"
						&& returnObj.eFileStatus.federal[key]["status"] === 9) {
						canCreate = true;
					}
				})
			}
			return canCreate;
		}

		//check user can delete return or not
		//We check whether action is disabled or not so we have to pass true for disabling action.
		var canDelete = function (returnObj) {
			// if(!_.isUndefined(returnObj.eFileStatus) && !_.isUndefined(returnObj.eFileStatus.federal)){
			// 	var federalObject = _.find(returnObj.eFileStatus.federal,{status:9});
			// }
			if ($scope.userCan('CAN_REMOVE_RETURN') == false) {
				return true;
			} else if (returnObj.isCheckedOut == true || returnObj.isLocked == true) {
				return true;
			} else if (!_.isUndefined(returnObj.eFileStatus)) {
				_.forEach(returnObj.eFileStatus, function (val, key) {
					_.forEach(val, function (subState, subKey) {
						if (subState.status == 9) {
							return true;
						}
					});
				});
			} else if (!_.isUndefined(returnObj.eFileStatus)) {
				_.forEach(returnObj.eFileStatus, function (val, key) {
					_.forEach(val, function (subState, subKey) {
						if (subState.status != 8) {
							return true;
						}
					});
				});
			} else {
				return false;
			}
		};

		//get class name for return
		$scope.setReturnClass = function (returnObj) {
			return returnAPIService.setReturnClass(returnObj);
		};
		//Export section start here
		//common function is called we have to just pass  type (for now only two type you can pass pdf or Csv)
		//note: pass width when you required
		$scope.exportList = function (type) {
			var exportList = [];
			if (!_.isUndefined($scope.filterConfig) && !_.isUndefined($scope.filterConfig.type)) {
				if ($scope.filterConfig.type == "all") {
					exportList = exportConfig[type.toLowerCase()]["all"];
				} else {
					exportList = exportConfig[type.toLowerCase()][$scope.filterConfig.type];
				}
			} else {
				exportList = exportConfig[type.toLowerCase()]["all"];
			}

			exportService.exportList(exportList, gridFilterOrderedData, 'ReturnList', type);
		};
		//Export section end here
		//Reload New Return List from API
		var initReturnList = function () {
			var deferred = $q.defer();

			returnAPIService.getReturnList().then(function (response) {
				$scope.returnList = angular.copy(response);
				deferred.resolve(response);
			}, function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};

		// Options for Type in filter
		// This needs to be come from application config for types we support
		//$scope.returnTypes=[{title:"All Types",id:"all"},{title:"1040 - Individual",id:"1040"},{title:"1065 - Partnership",id:"1065"},{title:"1120 - Corporate",id:"1120"},{title:"1120S - S-Corporate",id:"1120S"}];
		$scope.returnTypes = _.union([{ title: "All Types", id: "all" }], systemConfig.getReleasedPackages());
		// End

		//Filter configuration
		//Note: Due to auto filter implementation on grid, We have to make two objects. One represent display text while one act as id
		//We can not mix both in one other wise grid will try to auto filter on those value as well.
		//For Example - in Type filter we have text as '1040 - individual' but in grid it is written as just 1040
		$scope.filterConfig = {};
		$scope.filterDisplay = {};
		//$scope.filterConfig.returnType='All Types';
		//End- Filter configuration


		// Initial values for filter config
		$scope.initFilterConfig = function () {
			if ((angular.isUndefined($scope.filterDisplay.type) || $scope.filterDisplay.type != null || $scope.filterDisplay.type == "")
				&& (angular.isUndefined($scope.filterConfig.typeTitle) || $scope.filterConfig.typeTitle != null || $scope.filterConfig.typeTitle == "")) {
				$scope.filterDisplay.type = $scope.returnTypes[0].title;
				$scope.filterConfig.type = $scope.returnTypes[0].type;
			}

		};

		// to display data or message of sample Return
		$scope.returnListStatusCheck = function (dataLength) {
			if (dataLength > 0) {
				$scope.returnListStatus = ''
			} else {
				$scope.returnListStatus = 'sampleReturnMessage'
			}

		}
		//End
		var gridFilterOrderedData = [];//hold grid data with order and filter
		// For Grid - Start. First object is configuration and second is for data
		// and other operations from data
		//here we are not given default sorting because we have sorted date by updateddate
		$scope.returnListGrid = new NgTableParams({
			page: 1, // show initial page
			count: 10, // count per page

		}, {
				total: 0, // length of data
				sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
				getData: function ($defer, params) {
					// Request to API
					// We used to cache data at service level. Now we just use data of controller for table.
					//returnListService.updateReturnList($defer, params, $scope.filterConfig);

					// If data is not available then it will reload data from API, else it will use cached data for filtering and sorting			
					if (angular.isUndefined($scope.returnList)) {
						initReturnList().then(function (response) {
							// Only On successful API response we bind data to grid.					
							var filteredData = returnListGridFilter($scope.returnList);

							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
							gridFilterOrderedData = orderedData;
							params.total(filteredData.length);
							$scope.returnListStatusCheck(filteredData.length);
							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
						}, function (error) {
							$log.error(error);
						});
					} else {
						// cached data
						//filter for return data
						var filteredData = returnListGridFilter($scope.returnList);
						var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
						gridFilterOrderedData = orderedData;
						params.total(filteredData.length);
						$scope.returnListStatusCheck(filteredData.length);
						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				}
			});

		//Filter function for grid
		var returnListGridFilter = function (data) {
			var filteredData = data;
			if (angular.isDefined($scope.filterConfig) && angular.isDefined($scope.filterConfig.type) && $scope.filterConfig.type != '' && $scope.filterConfig.type != 'all') {
				filteredData = $filter('filter')(filteredData, function (entry, index) {
					if (entry.type.toLowerCase() == $scope.filterConfig.type.toLowerCase()) {
						return true;
					}
				});
			}


			//Filter on externally passed filter name
			if (!_.isUndefined(externalFilter) && !_.isEmpty(externalFilter)) {
				switch (externalFilter) {
					case 'notTransmitted':
						//Filter out returns those are not transmitted yet
						filteredData = _.filter(filteredData, function (obj) { return !obj.eFileStatus; });
						break;
					default:
						break;
				}
			}

			//filter based on search field $scope.searchField
			if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
				filteredData = $filter('filter')(filteredData, function (retunEntry, index) {
					if (angular.isDefined(retunEntry.ssnOrEinFull) && retunEntry.ssnOrEinFull.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.taxPayerName) && retunEntry.taxPayerName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.homeTelephone) && retunEntry.homeTelephone.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.updatedByName) && retunEntry.updatedByName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.type) && retunEntry.type.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.year) && retunEntry.year.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.status) && angular.isDefined(retunEntry.status.title) && retunEntry.status.title.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					} else if (angular.isDefined(retunEntry.states) && retunEntry.states.toLowerCase().replace(" ", "").indexOf($scope.searchField.toLowerCase()) >= 0) {
						return true;
					}
				});
			};

			//Return filtered data
			return filteredData;
		};

		// Watcher for Filter
		// Note: There is one issue currently, When ever filter apply (search,
		// sorting, etc...) It will reload this grid which result in new API Call.
		$scope.$watch("filterConfig.type", function () {
			//This is require to prevent multiple reload on startup 
			if ($scope.returnListGrid.settings().$scope != null) {
				$scope.returnListGrid.reload();
			}
		});

		//Object holding timeout
		var filterTimeout = {};
		//Watch for search field
		$scope.$watch('searchField', function (newVal, oldVal) {
			//If Grid data is defined
			if ($scope.returnListGrid.settings().$scope != null) {
				//If there is cahnge in old and new value
				if (newVal != oldVal) {
					//Cancel old search filter
					$timeout.cancel(filterTimeout);
					//Register new timeout for filter
					filterTimeout = $timeout(function () {
						//Reload grid. Which will re-bind data by filtering it
						$scope.returnListGrid.reload();
						//go to first page.
						$scope.returnListGrid.page(1);
					}, 300);
				}
			}
		});
		// For Grid - End

		//Open Return
		$scope.openReturn = function (taxReturn) {
			if (taxReturn.isCheckedOut == true) {
				var message = "some one else";
				if (!angular.isUndefined(taxReturn.checkedOutBy)) {
					message = taxReturn.checkedOutBy;
				} else if (!angular.isUndefined(taxReturn.email)) {
					message = taxReturn.email;
				}
				messageService.showMessage('This return is opened for editing by ' + message, 'error');
			} else {
				//condition to check last save return in which mode on that basic user is redirected to input mode or interview mode
				if (!_.isUndefined(taxReturn.returnMode) && !_.isNull(taxReturn.returnMode) && taxReturn.returnMode == 'interview') {
					$location.path('/return/interview/' + taxReturn.id);
				} else {
					$location.path('/return/edit/' + taxReturn.id);
				}
			}
		};

		//create new Return
		$scope.createNewReturn = function () {
			$location.path('/return/new');
		}

		$scope.addSampleReturns = function () {
			//Notes: Used $injector as this function will not be called many times which help us to avoid circular dependency in future.
			var returnAPIService = $injector.get('returnAPIService');
			returnAPIService.addSampleReturns().then(function (response) {
				postal.publish({
					channel: 'MTPO-Dashboard',
					topic: 'refreshReturnList',
					data: {}
				});
				$scope.returnList = undefined
				$scope.returnListGrid.reload();
				messageService.showMessage('Sample returns added successfully', 'success');
			}, function (error) {
				$log.error(error);
			});
		}
		/*
		 *  change status of return
		 */
		$scope.changeReturnStatus = function (selectedReturn, newStatus) {
			// If previous status is same as changed status then we don't need to call API.				    			
			returnAPIService.changeReturnStatus({ id: selectedReturn.id, status: newStatus }).then(function (data) {
				messageService.showMessage('Status Changed Successfully', 'success');

				//reinitialize respective return status.
				selectedReturn.status = userService.getReturnStatusObject(newStatus.id);
			}, function (error) {
				messageService.showMessage('Server Error', 'error');
			});
		};

		//open dialog with all custom status.
		$scope.openCustomStatusDialog = function () {
			var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/common/partials/customReturnStatusDialog.html", "customReturnStatusDialogController");

			dialog.result.then(function () {
				//reinitialize array
				$scope.returnStatus = angular.copy(userService.getReturnStatusList());
				//reinitialize return status other wise changes in custom status will not reflect immediately.
				_.forEach($scope.returnList, function (returnData) {
					if (returnData.status && returnData.status.id && returnData.status.isPredefined == false) {
						returnData.status = userService.getReturnStatusObject(returnData.status.id);
					}
				});
			}, function (canceled) {
				console.info("canceled");
			});
		};

		/**
		 * delete multiple returns
		 */

		$scope.deleteReturns = function () {
			//holds return ids
			var returnToDelete = [];
			//get selected return ids
			_.forEach($scope.returnList, function (retrun) {
				if (angular.isDefined(retrun.isSelected) && retrun.isSelected == true) {
					returnToDelete.push(retrun.id);
				}
			});
			//if return is seleted and length is greater then 0
			if (returnToDelete.length > 0) {
				var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
				localeService.translate('Delete return(s) from the Return List?', 'RETURNLIST_DOYOUDELETETHISRETURN_DIALOG_MESSAGE').then(function (translateText) {
					//open confirmation dialog
					var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
					dialog.result.then(function (btn) {
						//call delete return
						returnAPIService.deleteReturn(returnToDelete).then(function (data) {
							//show success msg
							messageService.showMessage('Return Deleted Successfully', 'success');
							//reload data.
							initReturnList().then(function (response) {
								$scope.returnListGrid.reload();
							}, function (error) {
								$log.error(error);
							});
						}, function (error) {
							messageService.showMessage('Server Error', 'error');
							$log.error(error);
						});
					}, function (btn) {
						// Do nothing on cancel
					});
				});
			}
		}

		/*
		 * Return Action. like Delete return
		 */
		//returnObj is the parameter which contains the selected return.
		//action is the parameter which contains the particular action.
		$scope.returnAction = function (action, returnObj) {
			// there will be many actions that user can perform
			switch (action) {
				// delete selected return
				case "Delete Return":
					if (!_.isUndefined(returnObj) && !_.isEmpty(returnObj)) {
						//Dialog used for the confirmation from user to Delete or not the selected Return.
						var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
						localeService.translate('Delete return(s) from the Return List?', 'RETURNLIST_DOYOUDELETETHISRETURN_DIALOG_MESSAGE').then(function (translateText) {
							var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
							dialog.result.then(function (btn) {
								var returnsToDelete;
								returnsToDelete = [];
								returnsToDelete.push(returnObj.id);
								returnAPIService.deleteReturn(returnsToDelete).then(function (data) {
									messageService.showMessage('Return Deleted Successfully', 'success');
									//reload data.
									initReturnList().then(function (response) {
										$scope.returnListGrid.reload();
									}, function (error) {
										$log.error(error);
									});
								}, function (error) {
									messageService.showMessage('Server Error', 'error');
									$log.error(error);
								});
							}, function (btn) {
								// Do nothing on cancel
							});
						});
					}
					break;

				case "Print Client Organizer":
					basketService.pushItem('taxPayerNameForClientOrganizer', returnObj.taxPayerName);
					basketService.pushItem('returnTypeForClientOrganizer', returnObj.type);
					$location.path("/manage/clientOrganizer/print");
					break;

				case "Message":
					$scope.openTextMessage(returnObj);
					break;

				case "Copy Return":
					createDuplicateReturn(returnObj, "copy");
					break;

				case 'Create Amend Return':
					createDuplicateReturn(returnObj, "amended");
					break;

				default:
					break;
			}
		};

		/**
		 * @author Hannan Desai
		 * @param  returnObj
		 * 			Contains object of selected return
		 * @description
		 * 			This function is used to create the same copy of selected return.
		 */
		var createDuplicateReturn = function (returnObj, type) {
			returnAPIService.createDuplicateReturn(returnObj.id, type).then(function (response) {
				if (type === 'amended') {
					messageService.showMessage('Amended return created successfully.', 'success');
				} else {
					messageService.showMessage('Return copied successfully.', 'success');
				}
				//reload data.
				initReturnList().then(function (response) {
					$scope.returnListGrid.reload();
				}, function (error) {
					$log.error(error);
				});
			}, function (error) {
				messageService.showMessage('Server Error', 'error');
				$log.error(error);
			})
		}

		/* 
		 *  The function is used to reload data from API, and then it reloads the grid of successful response.	
		 * 	Right now, When user click on refresh icon, the function will execute.
		 *  We do not set refreshStart FLAG true in this function, as we may need to use this function somewhere else,
		 *  other wise it will start rotating refresh icon in html.  
		 */
		$scope.manuallyRefresh = function () {
			initReturnList().then(function (response) {
				$scope.returnListGrid.reload();
				$scope.returnStatus = angular.copy(userService.getReturnStatusList());
				$scope.refreshStart = false;
			}, function (error) {
				$log.error(error);
				$scope.refreshStart = false;
			});
		};

		$scope.clearSearch = function () {
			$scope.searchField = '';
		};
		/**
		 * method to mark return as default/remove return from default
		 * @param action - it is their to decide whether return is to be added to default or to be removed 
		 * @param returnDetail - holds the return detail from the list whose action button is clicked to mark return as default or to remove it from default
		 */
		$scope.manageDefaultReturn = function (action, returnDetail) {
			if (action == 'ADD') {
				//returnId and return Title passed to the dailog
				var data = { returnId: returnDetail.id, returnTitle: returnDetail.taxPayerName };
				var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' },
					"taxAppJs/common/partials/setReturnAsDefault.html", "setReturnAsDefaultController", data);
				dialog.result.then(function (defaultReturnTitle) {
					returnDetail.isDefaultReturn = true;
					messageService.showMessage('Return added to default', 'success', 'RETURN_MAKEDEFAULT_SUCCESS');
				});
			} else if (action == 'REMOVE') {
				//service method call which calls the API to remove the return from default
				returnAPIService.manageDefaultReturn(action, returnDetail.id).then(function (response) {
					returnDetail.isDefaultReturn = false;
					messageService.showMessage('Return has been removed from default', 'success', 'RETURNREMOVED_FROM_DEFAULT');
				}, function (error) {
					$log.error(error);
				});
			}
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

		// this function will open dialog to send text message.
		$scope.openTextMessage = function (data) {
			var data = { 'recipientName': data.taxPayerName, 'cellNumber': data.homeTelephone, 'message': '' };
			dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' }, "taxAppJs/common/partials/textMessageDialog.html", "textMessageDialogController", data);
		}
	}]);

//Service (Factory) 
/*
 * Note: Now onwards we directly use returnAPIService from controller itself.
 */
/*returnListApp.factory('returnListService', [ '$q', '$log', '$http', '$filter','returnAPIService', function($q, $log, $http, $filter,returnAPIService) {

	var returnListService = {};

	// Array to hold current list and also act as cache
	returnListService.returnList = [];

	// Method to get data from api
	returnListService.updateReturnList = function($defer, params, filter) {
		// This will return data which is already cached
		// Note: There is one issue for which this cache is needed. On sorting
		// of grid it make this service call to load data.
		// We have to prevent this on sorting or any local filter.
		if (!angular.isUndefined(returnListService.returnList) && returnListService.returnList != null && returnListService.returnList.length > 0) {
			$log.info('From Cache');

			var filteredData = $filter('filter')(returnListService.returnList, filter);
			var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
			params.total(filteredData.length);
			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

		} else {
			$log.info('Making API Call');
			// Have to write $http api call to get data here rather then static
			returnAPIService.getReturnList().then(function(response){
				// Cache result once loaded
				angular.copy(response, returnListService.returnList);

				var filteredData = $filter('filter')(response, filter);
				var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
				params.total(filteredData.length);
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			},function(error){
				$log.error(error);
			});
		}
	};

	//This method will be changed when we connect our app with Data API
	returnListService.updateReturnListFromAPI = function(){
		var deferred = $q.defer();
		//Temp Code
		returnAPIService.getReturnList().then(function(response){
			// Cache result once loaded
			angular.copy(response, returnListService.returnList);

			deferred.resolve(response);
		},function(error){
			deferred.reject(error);
		});
		//Temp Code - End
		return deferred.promise;
	};

	return returnListService;
} ]);*/