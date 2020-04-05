'use strict';

var priceListApp = angular.module('priceListApp', []);

priceListApp.directive('managePriceList', [function () {
	return {
		restrict: 'AE',
		templateUrl: '/taxAppJs/manage/priceList/partials/list.html',
		controller: ['$scope', '$log', '$location', '$q', '$filter', '$timeout', 'messageService', 'userService', 'NgTableParams', 'priceListService', 'dialogService', 'localeService', 'environment', 'exportService',
			function ($scope, $log, $location, $q, $filter, $timeout, messageService, userService, NgTableParams, priceListService, dialogService, localeService, environment, exportService) {
				//Object holding timeout for search field
				var filterTimeout = {};

				//Check for privileges
				$scope.userCan = function (privilege) {
					return userService.can(privilege);
					//return true;
				};

				//initialize priceList list
				var _initPriceListList = function () {
					var deferred = $q.defer();
					priceListService.getPriceListList().then(function (response) {
						$scope.priceListList = response;
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
				$scope.priceListGrid = new NgTableParams({
					page: 1, // show initial page
					count: 10,// count per page
					sorting: {
						// initial sorting
						name: 'asc'
					}
				}, {
						total: 0, // length of data
						sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
						getData: function ($defer, params) {
							// Request to API
							// get Data here				
							if (angular.isUndefined($scope.priceListList)) {
								_initPriceListList().then(function () {
									// Only On successful API response we bind data to grid.			
									var filteredData = $scope.priceListList;
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
							} else {
								var filteredData = $scope.priceListList;
								//filter based on search field $scope.searchField
								if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
									filteredData = $filter('filter')(filteredData, function (entry, index) {
										if (angular.isDefined(entry.name) && entry.name.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
											return true;
										} else if (angular.isDefined(entry.description) && entry.description.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
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

				//Export section start here
				//common function is called we have to just pass  type (for now only two type you can pass pdf)
				//note: pass width when you required
				$scope.exportList = function (type, list) {
					var data = [];
					var temp = JSON.parse(JSON.stringify(list.forms));
					// loop for all forms
					for (var i = 0; i < temp.length; i++) {
						// if amount is available then we need to print that form
						if (!_.isUndefined(temp[i].amount)) {
							data.push({ displayName: temp[i].displayName ? temp[i].displayName : temp[i].formName, state: (temp[i].state == 'federal' ? 'Federal' : temp[i].state), amount: temp[i].amount });
						}
					}
					// loop for other serices data
					for (var i = 0; i < list.services.length; i++) {
						data.push({ displayName: list.services[i].description ? list.services[i].description : '', state: '-', amount: list.services[i].amount ? list.services[i].amount : '' })
					}

					//loop to add doller sign and period in all deta 
					for (var i = 0; i < data.length; i++) {
						//if amount does not have $ sign then add $ sign
						if (data[i].amount.indexOf('$') == -1) {
							data[i].amount = '$' + data[i].amount;
						}
						// if amount does not have . then add period
						if (data[i].amount.indexOf('.') == -1) {
							data[i].amount = data[i].amount + '.00';
						}
					}
					// export data to create pdf
					exportService.exportList([{ key: "displayName", text: "Form Name", width: 300 }, { key: "state", text: "Type", width: 100 }, { key: "amount", text: "Amount", width: 100 }], data, 'PriceList', 'pdf', 'portrait');
				};

				//Watch for search field
				$scope.$watch('searchField', function (newVal, oldVal) {
					//If Grid data is defined and newval and old val is not same
					if ($scope.priceListGrid.settings().$scope != null && newVal != oldVal) {
						//Cancel old search filter
						$timeout.cancel(filterTimeout);
						//Register new timeout for filter
						filterTimeout = $timeout(function () {
							//Reload grid. Which will re-bind data by filtering it
							$scope.priceListGrid.reload();
							//go to first page.
							$scope.priceListGrid.page(1);
						}, 300);
					}
				});

				//Redirect to Edit screen when click on New for creating priceList 
				$scope.createNewPriceList = function () {
					$location.path('/manage/priceList/edit');
				};

				//for remove priceList we have two way multiple or single pass key for single 
				$scope.deletePriceList = function (id) {
					var displayText = '';
					var priceListToDelete = [];
					if (angular.isDefined(id)) {
						priceListToDelete.push(id);
					}
					else {
						_.forEach($scope.priceListList, function (priceList) {
							if (angular.isDefined(priceList.isSelected) && priceList.isSelected == true) {
								priceListToDelete.push(priceList.id);
							}
						});
					}
					if (_.size(priceListToDelete) != 0) {
						if (_.size(priceListToDelete) > 1) {
							displayText = "Do you want to delete " + _.size(priceListToDelete) + " priceList?";
						} else {
							displayText = "Do you want to delete this priceList?";
						}

						//Dialog used for the confirmation from user to Delete or not the selected priceList.
						var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
						localeService.translate(displayText, 'PRICELIST_DOYOUDELETETHISPRICELIST_DIALOG_MESSAGE').then(function (translateText) {
							var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
							dialog.result.then(function (btn) {
								priceListService.deletePriceList(priceListToDelete).then(function (success) {
									messageService.showMessage('Remove successfully', 'success', 'PRICELISTLISTCONTROLLER_REMOVESUCCESS');
									_initPriceListList().then(function (response) {
										$scope.priceListGrid.reload();
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

				//for editing we just redirect to edit screen with key of perticular record
				$scope.editPriceList = function (id) {
					$location.path('/manage/priceList/edit/' + id);
				};

				$scope.clearSearch = function (){
					$scope.searchField = '';
				};  

				// Mark As Default
				$scope.markAsDefault = function (id) {
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

					// if priceList is undefined then we store it else we just update it
					if (_.isUndefined(userDetail.settings.preferences.returnWorkspace)) {
						userDetail.settings.preferences.returnWorkspace = { priceList: id };
					} else {
						userDetail.settings.preferences.returnWorkspace.priceList = id;
					}

					// sending updated preferences object to API
					userService.changeSettings('preferences', userDetail.settings.preferences).then(function (response) {
						messageService.showMessage('Preferences updated', 'success', 'CHANGEPREFERENCES_SAVE_MSG');
					}, function (error) {
						$log.error(error);
					});
				};

				/*
				 *   Initialize section
				 */

				//Temporary function to differentiate features as per environment (beta/live)
				$scope.betaOnly = function () {
					if (environment.mode == 'beta' || environment.mode == 'local')
						return true;
					else
						return false;
				};
			}]
	}
}]);
//List Controller
// priceListApp.controller('priceListController', ['$scope', '$log', '$location', '$q', '$filter', '$timeout', 'messageService', 'userService', 'NgTableParams', 'priceListService', 'dialogService', 'localeService', 'environment', 'exportService',
// 	function ($scope, $log, $location, $q, $filter, $timeout, messageService, userService, NgTableParams, priceListService, dialogService, localeService, environment, exportService) {
// 		//Object holding timeout for search field
// 		var filterTimeout = {};

// 		//Check for privileges
// 		$scope.userCan = function (privilege) {
// 			return userService.can(privilege);
// 			//return true;
// 		};

// 		//initialize priceList list
// 		var _initPriceListList = function () {
// 			var deferred = $q.defer();
// 			priceListService.getPriceListList().then(function (response) {
// 				$scope.priceListList = response;
// 				deferred.resolve();
// 			}, function (error) {
// 				$log.error(error);
// 				deferred.reject(error);
// 			});
// 			return deferred.promise;
// 		};
// 		var gridFilterOrderedData = [];//hold grid data with order and filter
// 		// For Grid - Start. First object is configuration and second is for data
// 		// and other operations from data
// 		$scope.priceListGrid = new NgTableParams({
// 			page: 1, // show initial page
// 			count: 10,// count per page
// 			sorting: {
// 				// initial sorting
// 				name: 'asc'
// 			}
// 		}, {
// 				total: 0, // length of data
// 				sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
// 				getData: function ($defer, params) {
// 					// Request to API
// 					// get Data here				
// 					if (angular.isUndefined($scope.priceListList)) {
// 						_initPriceListList().then(function () {
// 							// Only On successful API response we bind data to grid.			
// 							var filteredData = $scope.priceListList;
// 							filteredData = $filter('filter')(filteredData, $scope.searchField);
// 							//Apply standard sorting
// 							var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
// 							gridFilterOrderedData = orderedData;
// 							params.total(filteredData.length);
// 							//Return Result to grid
// 							$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
// 						}, function (error) {
// 							$log.error(error);
// 						});
// 					} else {
// 						var filteredData = $scope.priceListList;
// 						//filter based on search field $scope.searchField
// 						if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
// 							filteredData = $filter('filter')(filteredData, function (entry, index) {
// 								if (angular.isDefined(entry.name) && entry.name.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
// 									return true;
// 								} else if (angular.isDefined(entry.description) && entry.description.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
// 									return true;
// 								}
// 							});
// 						};
// 						//Apply standard sorting
// 						var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
// 						gridFilterOrderedData = orderedData;
// 						params.total(filteredData.length);
// 						//Return Result to grid
// 						$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
// 					}
// 				}
// 			});

// 		//Export section start here
// 		//common function is called we have to just pass  type (for now only two type you can pass pdf)
// 		//note: pass width when you required
// 		$scope.exportList = function (type, list) {
// 			var data = [];
// 			var temp = JSON.parse(JSON.stringify(list.forms));
// 			// loop for all forms
// 			for (var i = 0; i < temp.length; i++) {
// 				// if amount is available then we need to print that form
// 				if (!_.isUndefined(temp[i].amount)) {
// 					data.push({ displayName: temp[i].displayName ? temp[i].displayName : temp[i].formName, state: (temp[i].state == 'federal' ? 'Federal' : temp[i].state), amount: temp[i].amount });
// 				}
// 			}
// 			// loop for other serices data
// 			for (var i = 0; i < list.services.length; i++) {
// 				data.push({ displayName: list.services[i].description ? list.services[i].description : '', state: '-', amount: list.services[i].amount ? list.services[i].amount : '' })
// 			}

// 			//loop to add doller sign and period in all deta 
// 			for (var i = 0; i < data.length; i++) {
// 				//if amount does not have $ sign then add $ sign
// 				if (data[i].amount.indexOf('$') == -1) {
// 					data[i].amount = '$' + data[i].amount;
// 				}
// 				// if amount does not have . then add period
// 				if (data[i].amount.indexOf('.') == -1) {
// 					data[i].amount = data[i].amount + '.00';
// 				}
// 			}
// 			// export data to create pdf
// 			exportService.exportList([{ key: "displayName", text: "Form Name", width: 300 }, { key: "state", text: "Type", width: 100 }, { key: "amount", text: "Amount", width: 100 }], data, 'PriceList', 'pdf', 'portrait');
// 		};

// 		//Watch for search field
// 		$scope.$watch('searchField', function (newVal, oldVal) {
// 			//If Grid data is defined and newval and old val is not same
// 			if ($scope.priceListGrid.settings().$scope != null && newVal != oldVal) {
// 				//Cancel old search filter
// 				$timeout.cancel(filterTimeout);
// 				//Register new timeout for filter
// 				filterTimeout = $timeout(function () {
// 					//Reload grid. Which will re-bind data by filtering it
// 					$scope.priceListGrid.reload();
// 					//go to first page.
// 					$scope.priceListGrid.page(1);
// 				}, 300);
// 			}
// 		});

// 		//Redirect to Edit screen when click on New for creating priceList 
// 		$scope.create = function () {
// 			$location.path('/manage/priceList/edit');
// 		};

// 		//for remove priceList we have two way multiple or single pass key for single 
// 		$scope.deletePriceList = function (id) {
// 			var displayText = '';
// 			var priceListToDelete = [];
// 			if (angular.isDefined(id)) {
// 				priceListToDelete.push(id);
// 			}
// 			else {
// 				_.forEach($scope.priceListList, function (priceList) {
// 					if (angular.isDefined(priceList.isSelected) && priceList.isSelected == true) {
// 						priceListToDelete.push(priceList.id);
// 					}
// 				});
// 			}
// 			if (_.size(priceListToDelete) != 0) {
// 				if (_.size(priceListToDelete) > 1) {
// 					displayText = "Do you want to delete " + _.size(priceListToDelete) + " priceList?";
// 				} else {
// 					displayText = "Do you want to delete this priceList?";
// 				}

// 				//Dialog used for the confirmation from user to Delete or not the selected priceList.
// 				var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
// 				localeService.translate(displayText, 'PRICELIST_DOYOUDELETETHISPRICELIST_DIALOG_MESSAGE').then(function (translateText) {
// 					var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
// 					dialog.result.then(function (btn) {
// 						priceListService.deletePriceList(priceListToDelete).then(function (success) {
// 							messageService.showMessage('Remove successfully', 'success', 'PRICELISTLISTCONTROLLER_REMOVESUCCESS');
// 							_initPriceListList().then(function (response) {
// 								$scope.priceListGrid.reload();
// 							}, function (error) {
// 								$log.error(error);
// 							});
// 						}, function (error) {
// 							$log.error(error);
// 						});
// 					}, function (btn) {

// 					});
// 				});
// 			}
// 		};

// 		//for editing we just redirect to edit screen with key of perticular record
// 		$scope.edit = function (id) {
// 			$location.path('/manage/priceList/edit/' + id);
// 		};

// 		// Mark As Default
// 		$scope.markAsDefault = function (id) {
// 			//storing user details
// 			var userDetail = userService.getUserDetails();

// 			// if settings is undefined then we create it's new object
// 			if (_.isUndefined(userDetail.settings)) {
// 				userDetail.settings = {};
// 			}

// 			// if preferences is undefined then we create it's new object 
// 			if (_.isUndefined(userDetail.settings.preferences)) {
// 				userDetail.settings.preferences = {};
// 			}

// 			// if priceList is undefined then we store it else we just update it
// 			if (_.isUndefined(userDetail.settings.preferences.returnWorkspace)) {
// 				userDetail.settings.preferences.returnWorkspace = { priceList: id };
// 			} else {
// 				userDetail.settings.preferences.returnWorkspace.priceList = id;
// 			}

// 			// sending updated preferences object to API
// 			userService.changeSettings('preferences', userDetail.settings.preferences).then(function (response) {
// 				messageService.showMessage('Preferences updated', 'success', 'CHANGEPREFERENCES_SAVE_MSG');
// 			}, function (error) {
// 				$log.error(error);
// 			});
// 		};

// 		/*
// 		 *   Initialize section
// 		 */

// 		//Temporary function to differentiate features as per environment (beta/live)
// 		$scope.betaOnly = function () {
// 			if (environment.mode == 'beta' || environment.mode == 'local')
// 				return true;
// 			else
// 				return false;
// 		};
// 	}]);


//Edit Controller
priceListApp.controller('priceListEditController', ['_', '$scope', '$routeParams', '$log', '$location', '$filter', '$timeout', '$q', 'messageService', 'userService', 'priceListService', 'dialogService', 'NgTableParams', 'configService', 'contentService', 'localeService', 'systemConfig',
	function (_, $scope, $routeParams, $log, $location, $filter, $timeout, $q, messageService, userService, priceListService, dialogService, NgTableParams, configService, contentService, localeService, systemConfig) {

		// Array will hold list of package and its available states	
		// structure : [{"packageName":"","name":"stateName","packages":[]}]
		var packageListToGetForms = [];
		// Array will hold list of forms to be saved.
		var formsToSave = [];
		// Get old value of selected state.
		// This is used for removing old data of selected state from formsTosave and push new data into array
		// This value is needed because on change value in select we lost that value so we have to store it for further manipulation
		var previousState;

		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
			//return true;
		};

		//Check whether mode is edit or create if it is create nothing to do else we have to call API method to get existing info for edit 
		var _init = function () {
			//Making arrays is necessary for further manipulation
			//Note: IF following initialization removed then error will come in console. So do not remove this.
			$scope.priceList = {};
			$scope.priceList.priceListData = {};
			$scope.priceList.priceListData.services = [];
			$scope.priceList.priceListData.forms = [];

			contentService.setPackageName("1040");
			// Initialize state combo.
			_initStateCombo();
			//In create mode initialize combo and form list with first value
			$scope.selectedState = $scope.packageList[0];

			// Check for mode of the page
			if (angular.isDefined($routeParams.id)) {
				$scope.mode = 'edit';
				_getData($routeParams.id);
			} else {
				$scope.mode = 'create';
				// Initialize form list, by default it will be 1040 with federal data.
				_getForms("1040", "Federal").then(function (success) {
					$scope.formPriceListGrid.reload();
				});
			}
			//Multi Year Changes
			//Update tax year in content service.  
			//Service/factory is singleton in angular js and only invok once. And we have to refresh taxyear everytime user make changes in taxyear combo. 
			//To avoid listner in content service, we are updating tax year, everytime user change taxYear from header
			//more safe and fast then broadcast-reciever. If in future any other service needs to be updated on change of taxyear we should switch to broadcast solution    	
			contentService.refreshTaxYear();
		};

		// Get list of packages and states
		var _initStateCombo = function () {
			//Get available packages and states from config service
			var contentConfig = contentService.getConfigData();

			// Array will hold object containing state and its corresponding package name 
			$scope.packageList = [];
			var commonStates = contentService.getReleasedStates("common");
			commonStates = _.pluck(commonStates, 'name');
			//Get released packages from system config
			var releasedPackages = _.pluck(systemConfig.getReleasedPackages(), "id");

			// Loop through each package, package holds its available packages.
			_.forEach(releasedPackages, function (obj) {
				var releasedStates = contentService.getReleasedStates(obj);
				// States have many properties from which we need only one so we pluck names from list
				releasedStates = _.pluck(releasedStates, 'name');
				releasedStates = _.sortBy(releasedStates);
				// Federal is not considered as state so we have to insert it manually
				releasedStates.splice(0, 0, "Federal");

				// For comobo fill
				_.forEach(releasedStates, function (state) {
					$scope.packageList.push({ "packages": obj, "states": state });
					// Will be used for getting form data for this package
					var pkgNames = [obj];
					//This is required to load states fall under common as well. Because we are not showing common in combobox
					if ((_.indexOf(commonStates, state) > -1) || (state.toLowerCase() == "federal")) {
						pkgNames.push("common");
					}
					packageListToGetForms.push({ "packageName": obj, "name": state.toLowerCase(), "packageNames": pkgNames });
				});

			});
		};

		// Get available forms for selected package and selected state
		$scope.initForms = function () {
			//Save current form data before loading other forms
			_saveFormPrice();
			//load new form on bases of selection
			_getForms($scope.selectedState.packages, $scope.selectedState.states).then(function (success) {
				$scope.formPriceListGrid.reload();
			});
		};

		// Get available forms, for given package and state
		var _getForms = function (pkg, state) {
			var deferred = $q.defer();
			// Temporary array's
			var list = [];
			$scope.priceList.priceListData.forms = [];

			//Loop through available packages and its state
			//Use Filter
			/*_.forEach(packageListToGetForms,function(obj){
				if(obj.packageName == pkg && obj.name == state){
					var lstObj = {"name":obj.name,"packageNames":obj.packages};
					list.push(lstObj);
				}
			});*/

			list = _.filter(packageListToGetForms, { "packageName": pkg, "name": state.toLowerCase() });

			contentService.setPackageName(pkg);

			// load forms in content service and then get form details
			contentService.loadFormsLists(list).then(function () {
				_.forEach(list, function (lstObj) {
					var formList = contentService.getForms(lstObj.packageNames, lstObj.name.toLowerCase());

					// get amount details stored in formsToSave
					_.forEach(formList, function (obj) {
						//if hiddenForm then we do not push in priceList forms
						if (obj.isHiddenForm != true) {
							if (angular.isDefined(formsToSave) && _.isArray(formsToSave) && formsToSave.length > 0) {
								//Check if form is already in save queue 
								var _indexFormsToSave = _.findIndex(formsToSave, { docName: obj.docName, state: obj.state });
								if (_indexFormsToSave > -1) {
									$scope.priceList.priceListData.forms.push({ "formName": obj.formName, "displayName": obj.displayName, "description": obj.description, "status": obj.status, "tags": obj.tags, "tagOrder": obj.tagOrder, "docName": obj.docName, "state": obj.state, "packageName": obj.packageName, "amount": formsToSave[_indexFormsToSave].amount });
								} else {
									$scope.priceList.priceListData.forms.push({ "formName": obj.formName, "displayName": obj.displayName, "description": obj.description, "status": obj.status, "tags": obj.tags, "tagOrder": obj.tagOrder, "docName": obj.docName, "state": obj.state, "packageName": obj.packageName });
								}
							} else {
								$scope.priceList.priceListData.forms.push({ "formName": obj.formName, "displayName": obj.displayName, "description": obj.description, "status": obj.status, "tags": obj.tags, "tagOrder": obj.tagOrder, "docName": obj.docName, "state": obj.state, "packageName": obj.packageName });
							}
							deferred.resolve("success");
						}
					});
				});

				//IF There are saved forms available then put that price to forms
				_.forEach($scope.savedForms, function (form) {
					_.forEach($scope.priceList.priceListData.forms, function (obj) {
						if (form.docName == obj.docName) {
							obj.amount = form.amount;
						}
					});
				});
			}, function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		}

		//get details on bases of given id (Edit mode)
		var _getData = function (id) {
			priceListService.getPriceList(id).then(function (response) {
				// We store saveForms in scope. Because if package changes then data are not coming
				$scope.savedForms = response.priceListData.forms;
				_getForms("1040", "Federal").then(function (success) {
					// We need to push amount in current forms so we have to initialize object manually. so don't remove this initialization.
					$scope.priceList.id = response.id;
					$scope.priceList.name = response.name;
					$scope.priceList.description = response.description;
					$scope.priceList.priceListData.services = response.priceListData.services;
					// add amount to current form
					// We filter this while constructing forms
					/*_.forEach(response.priceListData.forms, function(form) {
						_.forEach($scope.priceList.priceListData.forms, function(obj) {
							if(form.docName==obj.docName){
								obj.amount=form.amount;
							}
						});
					});*/
					// add form to save
					_saveFormPrice();
					$scope.formPriceListGrid.reload();
				}, function (error) {
					$log.log(error);
				});
			}, function (error) {
				$log.error(error);
				$location.path('/manage/templates/priceList');
			});
		};

		// Function saves only values contains amount field to temporary array 
		var _saveFormPrice = function () {
			if (angular.isDefined($scope.priceList.priceListData) && angular.isDefined($scope.priceList.priceListData.forms)) {
				// We simply replace all forms of selected state of same package with new data
				if (angular.isDefined(previousState) && angular.isObject(previousState) && previousState.packages == $scope.selectedState.packages) {
					_.remove(formsToSave, function (obj) {
						if (obj.state.toLowerCase() == previousState.states.toLowerCase() && obj.packageName.toLowerCase() == previousState.packages.toLowerCase()) {
							return true;
						}
						return false;
					});
				}
				// Add forms with amount for save
				_.forEach($scope.priceList.priceListData.forms, function (obj) {
					if (angular.isDefined(obj.amount) && obj.amount != "" && _.findIndex(formsToSave, { docName: obj.docName }) == -1) {
						formsToSave.push(obj);

						// We remove current form object from saved form 
						_.remove($scope.savedForms, function (savedForm) {
							if (savedForm.docName == obj.docName) {
								return true;
							}
							return false;
						});
					}
				});
			}
			previousState = $scope.selectedState;
		};
		var gridFilterOrderedData = [];//hold grid data with order and filter
		// For Grid - Start. First object is configuration and second is for data
		// and other operations from data
		$scope.formPriceListGrid = new NgTableParams({
			page: 1, // show initial page
			count: 5000,// count per page
			sorting: {
				// initial sorting
				displayName: 'asc'
			}
		}, {
				counts: [],
				total: 0, // length of data
				sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
				getData: function ($defer, params) {
					// Request to API
					// get Data here
					// We initialize array in init function, so array will not be undefined ever.
					if (angular.isUndefined($scope.priceList.priceListData.forms)) {
						var data = [];
						params.total(data.length);
						$defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					} else if (angular.isDefined($scope.priceList.priceListData.forms)) {
						var filteredData = $scope.priceList.priceListData.forms;

						//filter based on search field comobo selection            	
						if (angular.isDefined($scope.selectedState) && angular.isDefined($scope.selectedState.states) && $scope.selectedState.packages != "All") {
							filteredData = $filter('filter')(filteredData, function (entry, index) {
								if (angular.isDefined(entry.state) && entry.state.toLowerCase().indexOf($scope.selectedState.states.toLowerCase()) >= 0) {
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

		// Create new or edit a priceList
		$scope.save = function () {
			if (angular.isDefined($scope.priceList)) {
				// Save only forms that have amount
				previousState = $scope.selectedState;
				_saveFormPrice();
				if (angular.isDefined(formsToSave) && _.isArray(formsToSave) && formsToSave.length > 0) {
					$scope.priceList.priceListData.forms = formsToSave;
				}

				//Add service only when either of description or amount field has some values
				if (angular.isDefined($scope.priceList.priceListData.services) && _.isArray($scope.priceList.priceListData.services) && $scope.priceList.priceListData.services.length > 0) {
					var serviceToSave = [], isValidService = false;
					_.forEach($scope.priceList.priceListData.services, function (service) {
						if ((angular.isDefined(service.description) && service.description != "") || (angular.isDefined(service.amount) && service.amount.toString() != "")) {
							isValidService = true;
						} else {
							isValidService = false;
						}

						if (isValidService) {
							serviceToSave.push(service);
						}
					});
					if (serviceToSave.length > 0) {
						$scope.priceList.priceListData.services = serviceToSave;
					}
				}

				// Check whether letter is in edit mode or new mode
				// IF edit mode then check for standard template.			
				if ($scope.mode == 'edit') {
					priceListService.savePriceList($scope.priceList).then(function (response) {
						messageService.showMessage('Updated successfully', 'success', 'priceListCONTROLLER_UPDATESUCCESS');
						$location.path('/manage/templates/priceList');
					}, function (error) {
						$log.error(error);
					});
				} else if ($scope.mode == 'create') {
					priceListService.createPriceList($scope.priceList).then(function (response) {
						messageService.showMessage('Created successfully', 'success', 'priceListCONTROLLER_ADDSUCCESS');
						$location.path('/manage/templates/priceList');
					}, function (error) {
						$log.error(error);
					});
				}
			}
		};

		// Delete priceList	
		$scope.deletePriceList = function () {
			//Dialog used for the confirmation from user to Delete or not the selected client letter.
			var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
			localeService.translate('Do you want to delete this priceList?', 'PRICELIST_DOYOUDELETETHISPRICELIST_DIALOG_MESSAGE').then(function (translateText) {
				var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
				dialog.result.then(function (btn) {
					var priceListToDelete = [];
					if (angular.isDefined($scope.priceList.id)) {
						priceListToDelete.push($scope.priceList.id);

						priceListService.deletePriceList(priceListToDelete).then(function (success) {
							messageService.showMessage('Remove successfully', 'success', 'priceListCONTROLLER_REMOVESUCCESS');
							$location.path('/manage/templates/priceList');
						}, function (error) {
							$log.error(error);
						});
					}
				}, function (btn) {

				});
			});
		};

		//on click cancel we just redirect to clientLetter list screen 
		$scope.cancel = function () {
			$location.path('/manage/templates/priceList');
		};

		// Add lines in services section
		$scope.addLine = function () {
			$scope.priceList.priceListData.services.push({});
		};

		// Remove lines in services section
		$scope.removeLine = function (index) {
			$scope.priceList.priceListData.services.splice(index, 1);
		};
		$scope.clearSearch = function (){
			$scope.searchField = '';
		}; 

		/*
		 *   Initialize section
		 */

		//Just call first time _init function
		_init();

	}]);
// call directive when user press enter key
priceListApp.directive('taxBlurKeyPricelist', ['$window', function ($window) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			element.on('keydown', function (event) {
				if (event.keyCode == 13) {
					//prevent default behaviour
					event.preventDefault();

					//jquery field selector for form fields (input, button/checkbox, select)
					var fieldSelector = 'input[type=text][disabled!=disabled],button[disabled!=disabled],select[disabled!=disabled]';
					//Appending fields for dialog
					fieldSelector = fieldSelector + ',.modal-body input[type=text][disabled!=disabled], .modal-body button[disabled!=disabled], .modal-body select[disabled!=disabled]';

					//get inputboxes inside tax form to emulate tab                    
					var inputboxes = $window.jQuery(fieldSelector);
					//var inputboxes = $window.jQuery('tax-form input[type=text][disabled!=disabled]');

					// getting next index. If shift key is pressed go to previous instead of next
					var nextIndex;
					if (event.shiftKey == true) {
						//decrementing current index by 1 to go to previous textbox
						nextIndex = inputboxes.index(this) - 1;
					} else {
						//incrementing current index by 1 to go to next textbox
						nextIndex = inputboxes.index(this) + 1;
					}

					// getting total number of inputboxes on the page to detect how far we need to go
					var maxIndex = inputboxes.length;
					// check to see if next index is still smaller then max index
					if (nextIndex != undefined && nextIndex < maxIndex) {
						// setting index to next textbox using CSS3 selector of nth child
						inputboxes[nextIndex].focus();
					}
				}
			});

			//Added later to check performance
			scope.$on('$destroy', function () {
				element.off('keydown');
			});
		}
	};
}]);

//Service
priceListApp.factory('priceListService', ['$q', '$log', '$http', 'dataAPI', function ($q, $log, $http, dataAPI) {
	var priceListService = {};

	/*get all available client letter list */
	priceListService.getPriceListList = function () {
		var deferred = $q.defer();
		//load list from data api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/priceList/list'
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};

	priceListService.getPriceList = function (id) {
		var deferred = $q.defer();
		if (!_.isUndefined(id) && id != "") {
			//open a client letter
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/priceList/open',
				data: {
					'data': {
						'id': id
					}
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
		} else {
			deferred.reject("Invalid or blank pricelist selected.");
		}

		return deferred.promise;
	};

	priceListService.createPriceList = function (priceList) {
		var deferred = $q.defer();
		//create client letter
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/priceList/create',
			data: {
				'data': {
					'name': priceList.name,
					'description': priceList.description,
					'priceListData': priceList.priceListData
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

	priceListService.savePriceList = function (priceList) {
		var deferred = $q.defer();
		//edit or save client letter
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/priceList/save',
			data: {
				'data': {
					'id': priceList.id,
					'name': priceList.name,
					'description': priceList.description,
					'priceListData': priceList.priceListData
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

	priceListService.deletePriceList = function (ids) {
		var deferred = $q.defer();
		//delete client letter
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/priceList/remove',
			data: {
				'data': {
					'priceListIds': ids
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

	return priceListService;
}]);
