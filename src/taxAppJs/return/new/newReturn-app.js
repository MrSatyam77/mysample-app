'use strict';

var newReturnApp = angular.module('newReturnApp', []);

newReturnApp.controller('newReturnController', ['$scope', '$log', '$q', '$location', '$filter', '$injector', '_', 'dataAPI', 'systemConfig', 'localeService', 'contentService', 'returnAPIService', 'messageService', 'userService', 'environment', 'dialogService', 'networkHealthService', 'basketService',
	function ($scope, $log, $q, $location, $filter, $injector, _, dataAPI, systemConfig, localeService, contentService, returnAPIService, messageService, userService, environment, dialogService, networkHealthService, basketService) {
		$scope.newReturn = { selectedDefaultReturn: 'Please Select' };
		//array that holds the return list
		var allDefaultReturn = [];
		$scope.defaultReturnList = [];
		//Get details of logged in user
		var userDetails = userService.getUserDetails();
		$scope.backToHomeScreen = function() {
            $location.path('/home');
        }
		// varibale to disable continue button while one save return inprocess to prevent creating a duplication of return.
		$scope.saveReturnInProcess = false;


		// Options for Types	
		$scope.returnTypes = systemConfig.getReleasedPackages();
		// End

		/**
		 * This will have tax year from userService (set by user or default one)
		 */
		$scope.taxYear = userService.getTaxYear();

		//get current tax year from system config
		var _currentTaxYear = systemConfig.getCurrentTaxYear();

		// Pop item form basket service based on type of new return will create
		var newReturnType = basketService.popItem('newReturnType');

	
		// Set new return create type
		if (!_.isUndefined(newReturnType)) {
			$scope.newReturnType = newReturnType;
		} else {
			$scope.newReturnType = 'normalReturn';
		}

		//variable that holds the array of objects of all return which lies under current location and current tax year 
		var _returnList;

		//method to initialize the page
		var _init = function () {
			if (angular.isUndefined($scope.newReturn.returnType)) {
				$scope.newReturn.returnTypeTitle = $scope.returnTypes[0].title;
				$scope.newReturn.returnTypeId = $scope.returnTypes[0].id;
			}
			//method called to get the custom template return list
			returnAPIService.getCachedReturnList(true).then(function (response) {
				_returnList = response;
				_.forEach(response, function (returnObj) {
					if (!_.isUndefined(returnObj.isDefaultReturn) && returnObj.isDefaultReturn == true) {
						$scope.defaultReturnList.push({
							returnId: returnObj.id,
							packageName: returnObj.type,
							displayName: returnObj.taxPayerName
						});
					}
				});
			}, function (error) {
				$log.error(error);
			});
			//Multi Year Changes
			//Update tax year in content service.  
			//Service/factory is singleton in angular js and only invok once. And we have to refresh taxyear everytime user make changes in taxyear combo. 
			//To avoid listner in content service, we are updating tax year, everytime user change taxYear from header
			//more safe and fast then broadcast-reciever. If in future any other service needs to be updated on change of taxyear we should switch to broadcast solution    	
			contentService.refreshTaxYear();
		};



		//to add federal state for precache 
		var _addFederalToCache = function () {
			var deferred = $q.defer();
			// check is user selected offline feature and tax year is not 2014
			if ($scope.taxYear == '2016' && userDetails.settings.preferences != undefined && userDetails.settings.preferences.offline != undefined && userDetails.settings.preferences.offline.enableOffline == true) {
				// federal is require state to create new return in offline mode 
				var stateToPrecache = [{ "state": "federal", "year": $scope.taxYear }];
				if ($scope.isOnline == true) {
					//inject _preferencesService
					var _preferencesService = $injector.get('preferencesService');
					//if user is online then we are caching federal state
					_preferencesService.precacheStatesAndUpdateInPrefrences(stateToPrecache);
					deferred.resolve();
				}
				else {
					// require to check federal is cached or not 
					var _serviceWorkerIPC = $injector.get('serviceWorkerIPC');
					// checke whatever selected state is cached or not
					_serviceWorkerIPC.checkStatePrecacheStatus(stateToPrecache).then(function (response) {
						/// get all no-cached state
						var nonCachedState = _.pluck(_.where(response.data, { 'preCache': false }), 'state');
						// check length of state
						if (nonCachedState != undefined && nonCachedState.length > 0) {
							var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/nocachedstateDialog.html", "NocachedStateDialogController", { "statelist": nonCachedState, "isNewReturn": true });
							dialog.result.then(function (btn) { }, function (btn) {
								deferred.reject();
							});
						} else {
							deferred.resolve();
						}
					});
				}
			}
			else {
				deferred.resolve();
			}
			return deferred.promise;
		};

		/**
		 * wrapper function that first checks whether entered ssn or ein already exist if yes than we take the confirmation form the user whether he want to create
		 * return with same ssn or ein. on basis of his confirmation we take the further steps to create the new return 
		 */
		$scope.createReturn = function (mode) {
			$scope.saveReturnInProcess = true;
			// here we are precaching federal state 
			_addFederalToCache().then(function () {
				//   This will retrieve the ssn/ein from already existing list and compares with current ssn/ein 
				//   if both same then popup dialog opens with message of duplication of SSN/EIN  
				var ssnOrEin = (!_.isUndefined($scope.newReturn.ssn) && !_.isNull($scope.newReturn.ssn) && $scope.newReturn.ssn != '') ? $scope.newReturn.ssn : $scope.newReturn.ein;

				// This service returns true if SSN or EIN presents inside object otherwise returns false 
				var isSsnOrEinExist = returnAPIService.checkSSNorEIN(ssnOrEin);

				// if (isSsnOrEinExist) {
				//     // Shows dialog if SSN/EIN exist in the return list 
				//     var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
				//     localeService.translate("There is already a return with this SSN/EIN . Do you want to continue ?").then(function (translatedText) {
				//         var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translatedText });
				//         dialog.result.then(function (btn) {
				//             _createReturn(mode);
				//         });
				//     });
				// } else {
				//     _createReturn(mode);
				// }
				if (isSsnOrEinExist) {
					// Shows dialog if SSN/EIN exist in the return list 
					var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
					localeService.translate("There is already a return with this SSN/EIN . Do you want to continue ?").then(function (translatedText) {
						var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translatedText });
						dialog.result.then(function (btn) {
							
							// here if returnType is 1040, than we need to check wheather any K1Data vailable for this SSN.
							if ($scope.newReturn.returnTypeId === '1040' && $scope.newReturnType !== 'customReturnTemplate' &&  $scope.isOnline == true) {
								_getListOfK1Data(mode, ssnOrEin);
							} else {
								_createReturn(mode);
							}
						}, function (cancel) {
							$scope.saveReturnInProcess = false;
						});
					});
				} else {
					// here if returnType is 1040, than we need to check wheather any K1Data available for this SSN.
					if ($scope.newReturn.returnTypeId === '1040' && $scope.newReturnType !== 'customReturnTemplate' &&  $scope.isOnline == true) {
						_getListOfK1Data(mode, ssnOrEin);
					} else {
						_createReturn(mode);
					}
				}
			}, function (error) {
				$scope.saveReturnInProcess = false;
			});
		};

		/**
		* method that get list available k1 data for entered SSN or EIN.
		* @param - mode holds the mode in which return is to be open either 'interview' mode or 'input' mode
		* @param - ssn or ein number. 
		*/
		var _getListOfK1Data = function (mode, ssnOrEin) {
			returnAPIService.getListOfK1Data([ssnOrEin]).then(function (response) {
				if (response.length > 0) {
					localeService.translate("Schedule K-1 data for the shareholder exists, do you want to import the information?").then(function (translateText) {

						// show confirm dialog if k1-data exists for entered SSN.
						var dialog = dialogService.openDialog("confirm", { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, { text: translateText });
						dialog.result.then(function (result) {

							// if there is multiple k1-data exists for SSN, than we will open the dialog to choose from them.
							// otherwise we will directly import the k1 data.
							if (response.length > 1) {
								// open dialog to show list of k1-data, if multiple k-1 data exists for entered SSN.
								var customDialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/dialog/k1ImportDialog.html", "k1ImportDialogController", { 'data': response, 'ssn': ssnOrEin });
								customDialog.result.then(function (btn) {
									var importForms = [];
									_.forEach(btn, function (obj) {
										if (!_.isUndefined(obj.isSelected) && obj.isSelected == true) {
											importForms.push(obj);
										}
									})
									_createReturn(mode, importForms);
								});
							} else {
								_createReturn(mode, response);
							}
						}, function (btn) {
							_createReturn(mode);
						})
					})
				} else {
					_createReturn(mode);
				}
			}, function (error) {
				console.log(error);
				_createReturn(mode);
			})
		}

		/**
		 * method prepared to create new return
		 * @param - mode holds the mode in which return is to be open either 'interview' mode or 'input' mode
		 * @param - importForms holds the list of k1-forms that has to be imported.
		 */
		var _createReturn = function (mode, importForms) {
			//this will check the proforma applicable for particular ssn/ein
			checkProforma().then(function (proformaDone) {
				if (proformaDone == false) {
					contentService.getDefaultReturn($scope.newReturn.returnTypeId).then(function (response) {
						var taxReturn = response;

						//Generate unique id for new return
						returnAPIService.createReturn().then(function (data) {
							//These are header and other common details - These may change as per requirment 
							taxReturn.header.id = data;

							// For More return type we need to write conditions here
							if ($scope.newReturn.returnTypeId == '1040') {
								taxReturn.header.client.ssn = $scope.newReturn.ssn;
								taxReturn.header.client.firstName = $scope.newReturn.firstName;
								taxReturn.header.client.lastName = $scope.newReturn.lastName;

								//ITIN (W7)
								if ($scope.newReturn.applyForW7 == true) {
									//Add flag
									taxReturn.header.client.applyForW7 = $scope.newReturn.applyForW7;
									//Add W7 in defaultForms
									taxReturn.defaultForms.push({ "formName": "fW7", "docName": "dW7", "packageName": "1040", "state": "federal" });
								}

								// if user choose to import k1-data.
								if (!_.isUndefined(importForms) && importForms.length > 0) {
									taxReturn.importedK1Data = importForms;
								}
							}

							else if ($scope.newReturn.returnTypeId == '1065' || $scope.newReturn.returnTypeId == "1120" || $scope.newReturn.returnTypeId == '1120s' || $scope.newReturn.returnTypeId == '1041' || $scope.newReturn.returnTypeId == '990') {
								taxReturn.header.client.ein = $scope.newReturn.ein;
								taxReturn.header.client.companyName = $scope.newReturn.companyName;

							}
							// If it is custom template return then
							if ($scope.newReturnType === 'customReturnTemplate') {
								taxReturn.header.isDefaultReturn = true;
							}
							//we will set first default status id into header.
							taxReturn.header.status = systemConfig.getReturnStatus()[0].id;

							// Multi Year Changes - earlier it was coming from systemConfig (hard coded taxyear), now it will be user selected tax year (fallback to current year)
							taxReturn.header.year = userService.getTaxYear();

							if (!_.isUndefined($scope.newReturn.returnWithDefault) && !_.isNull($scope.newReturn.returnWithDefault) && $scope.newReturn.returnWithDefault != '')
								taxReturn.header.returnWithDefault = $scope.newReturn.returnWithDefault;

							//Recalucate  - false (For future use)
							taxReturn.header.isRecalculate = false;
							//To indicate that this is new return
							taxReturn.header.isNewReturn = true;
							//To indicate by whom return is created
							taxReturn.header.createdByName = angular.isDefined(userDetails.lastName) ? (userDetails.firstName + " " + userDetails.lastName) : userDetails.firstName + "";
							//To indicate the id by whom the return is created
							taxReturn.header.createdById = userDetails.key;
							//To indicate on which date return is created
							taxReturn.header.createdDate = new Date();

							//we have to set the returnMode in header of taxReturn if the mode is interview
							//Note : we have to do because return get open in input mode from the list though we had opened the return in interview mode when we created the new return 
							if (mode == 'interview') {
								taxReturn.header.returnMode = mode;
							}

							//we have to set flag for return is created in offline mode 
							if ($scope.isOnline == false) {
								//add new flag  for return is created in offline 
								taxReturn.header.isCreatedOffline = true;
							}
							// Pass return to dataAPI for saving
							//Note: We should have to remove this part and rather then opening new return with url, We should have to open it by passing whole return
							returnAPIService.addReturn(taxReturn).then(function (success) {
								if (mode == 'interview') {
									//open Interview Mode
									$location.path('return/interview/' + taxReturn.header.id);
								//$location.path('return/interviewDemo/'+taxReturn.header.id);
								} else {
									//Open Return
									$location.path('return/edit/' + taxReturn.header.id);
								}
								$scope.saveReturnInProcess = false;
							}, function (error) {
								$scope.saveReturnInProcess = false;
								messageService.showMessage('Error in saving newly created return', 'error');
							});

						}, function (error) {
							$scope.saveReturnInProcess = false;
							$log.error(error);
						});

					}, function (error) {
						$scope.saveReturnInProcess = false;
						$log.error(error);
					});
				} else {
					$scope.saveReturnInProcess = false;
				}
			}, function (error) {
				$scope.saveReturnInProcess = false;
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
		//End

		//check the return avalible in prior year return list
		var checkProforma = function () {
			var deffered = $q.defer();
			if ($scope.newReturnType == 'normalReturn') {
				var ssnOrEin;
				var returnType;
				//this will take the ssn/ein for checking the avaliblity of ssn/ein in prior year return list
				if ($scope.newReturn.returnTypeId == '1040') {
					ssnOrEin = $scope.newReturn.ssn;
					returnType = $scope.newReturn.returnTypeId;

				} else if ($scope.newReturn.returnTypeId == '1065' || $scope.newReturn.returnTypeId == "1120" || $scope.newReturn.returnTypeId == '1120s' || $scope.newReturn.returnTypeId == '1041' || $scope.newReturn.returnTypeId == '990') {
					ssnOrEin = $scope.newReturn.ein;
					returnType = $scope.newReturn.returnTypeId;
				}

				//this will check the ssn/ein avalible in prior year return list
				returnAPIService.checkInPriorYearReturnList(ssnOrEin, returnType).then(function (returnId) {
					if (returnId != false) {
						var dialogConfiguration = {
							'keyboard': false,
							'backdrop': false,
							'size': 'md',
							'windowClass': 'my-class'
						};

						var dialog = dialogService.openDialog("custom", dialogConfiguration, "taxAppJs/return/new/partials/proformaDialog.html", "proformaDialogController", returnId);
						dialog.result.then(function (result) {
							if (result === false) {
								deffered.resolve(false);
							} else {
								$location.path('return/edit/' + result);
								deffered.resolve(true);
							}
						}, function (btn) {
							deffered.resolve();
						});
					} else {
						//if ssn/ein is not avalible in prior year return list
						deffered.resolve(false);
					}
				}, function (error) {
					$log.error(error);
				});
			} else {
				// if new custom return template is created
				deffered.resolve(false);
			}

			return deffered.promise;
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

		/**
		 * Initialization
		 */
		_init();
	}]);

/**
 * This controller dynamically modified the custom text and button present into custom dialog based on response.
 * So instead of opening new dialog we are using existing dialog . 
 */
newReturnApp.controller('proformaDialogController', ['$scope', '$log', '$location', '$modalInstance', 'returnAPIService', 'messageService', 'data', function ($scope, $log, $location, $modalInstance, returnAPIService, messageService, data) {

	// isProcessing and isError are scope variable present in performaDialog.html file which is used to show processing button enable or disable based on response and 
	// isError shows error message if proforma for the previous year return not created successfully .
	$scope.isProcessing = false;
	$scope.isError = false;

	// 
	$scope.proformaOrNewReturn = function () {
		$scope.isProcessing = true;
		if ($scope.isError != true) {
			returnAPIService.proformaOnNewReturn(data).then(function (id) {
				$scope.isProcessing = false;
				if (id == "Fail") {
					// If user not get response then makes $scope.isError = true which shows the following message : 
					//Proforma for a prior year return was unsuccessfull. Do you want to create a new return ?
					$scope.isError = true;
				} else {
					messageService.showMessage('Proforma for a prior year return created successfully.', 'success', 'CREATE_RETURN_PROFORMA');
					$modalInstance.close(id);
				}
			}, function (error) {
				$scope.isProcessing = false;
				$log.error(error);
			});
		} else {
			$modalInstance.close(false);
		}
	};

	$scope.close = function () {
		if ($scope.isError != true) {
			$modalInstance.close(false);
		} else {
			$modalInstance.dismiss('cancelled');
		}
	};

}]);

