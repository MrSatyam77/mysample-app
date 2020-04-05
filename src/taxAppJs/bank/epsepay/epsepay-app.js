'use strict';

var epsApp = angular.module('epsepayApp', []);

epsApp.controller('epsepayController', ['$scope', '$log', '$location', '$timeout', '$injector', '$window', 'messageService', 'userService', 'epsepayService', 'passwordStrengthService', 'dialogService', 'subscriptionService', 'resellerService', 'dataAPI', 'localeService', 'environment',
function ($scope, $log, $location, $timeout, $injector, $window, messageService, userService, epsepayService, passwordStrengthService, dialogService, subscriptionService, resellerService, dataAPI, localeService, environment) {
	
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
	
			//to check is user is paid user or not 
			var userDetails = userService.getUserDetails();
			var subscriptionType = '';
			var masterLocationDetails;
			var isSpeacialState = false;
			//get master location details
			if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
				masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
			}
	
			//get subscriptionType
			subscriptionType = userService.getLicenseValue('type');
	
			if (subscriptionType == 'FREE' && userDetails.isDemoUser != true) {
				//First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller			  
				var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/subscriptionDialog.html", "subscriptionDialogController", { "bankProducts": true });
				dialog.result.then(function (btn) {
					subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
				}, function (btn) {
					$location.path('/home');
				});
			}
	
			//get current taxYear
			$scope.taxYear = userService.getTaxYear();
	
			// Speacial state configuration
			$scope.speacialState = [];
	
	
			// set by default first tab is true
			$scope.activeTab = {};
			$scope.activeTab.accountIdentifierTab = true;
				//array object declare which contains the mapping of next and previous view for the steps of conversion for 2015
				$scope.nextAndPrevViewMap = [
					{ "view": "accountIdentifierTab", "next": "ownerTab", "previous": "", "currentView": true, "formName": "accountIdentifierTabForm" },
					{ "view": "ownerTab", "next": "contactTab", "previous": "accountIdentifierTab", "currentView": false, "formName": "ownerTabForm" },
					{ "view": "contactTab", "next": "bankTab", "previous": "ownerTab", "currentView": false, "formName": "contactTabForm" },
					{ "view": "bankTab", "next": "", "previous": "contactTab", "currentView": false, "formName": "bankTabForm" },
				];
	
			//get reseller name
			$scope.resellerConfig = resellerService.getValues(['appName']);
			$scope.hasFeature = function (featureName) {
				return resellerService.hasFeature(featureName);
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
			$scope.tooltip = true;
			
			//define objects
			if (_.isUndefined($scope.epayOwner)) {
				$scope.epayOwner = { };
			}
			if(_.isUndefined($scope.epayBank)){
				$scope.epayBank = {};
			}
			if (_.isUndefined($scope.epsForm)) {
				$scope.epsForm = {};
			}
			if(_.isUndefined($scope.epayContact)){
				$scope.epayContact = {};
			}
			if(_.isUndefined($scope.accountIdentifier)){
				$scope.accountIdentifier = {};
			}

				
	
			$scope.epayOwner.taxIdType = 'EIN'; //set default tax type ein selected
			$scope.taxIdTypeMask = '99-9999999'; //set default mask id as ein
			//set text mask based on selected type
			$scope.setTaskMask = function () {
				if ($scope.epayOwner.taxIdType === 'EIN') {
					$scope.taxIDTypeMask = '99-9999999';
				}
				else if ($scope.epayOwner.taxIdType === 'SSN') {
					$scope.taxIDTypeMask = '999-99-9999';
				}
			};
	
			// variable declare which contain response code, type and message 
			var codeList = {
				"In Process": { type: 'warning', message: "You can not resubmit enrollment details as your enrollment is in process." },
				"Pending": { type: 'warning', message: "Your enrollment is pending from EPS." },
				"Enrolled": { type: 'success', message: "You are enrolled with EPS." },
				"Rejected": { type: 'warning', message: "Your enrollment has been rejected by EPS" }
			};
	
			// this function call in page load time , check user make bank or edit bank 
			$scope.initListBankEPS = function () {
				$scope.formName = _getFormName();
				epsepayService.getEPSePay().then(function (response) {
					if (_.isUndefined($scope.bankEPSList)) {
						$scope.bankEPSList = {};
					}
					$scope.bankEPSList = response.enrollmentData;
					$scope.bankEPSpreviousData = JSON.parse(JSON.stringify(response.enrollmentData));
	
					// assigning the response status to rersponseMessage for display the message on UI
					$scope.responseMessage = (!_.isUndefined(response.enrollmentData)) ? codeList[response.enrollmentData.status] : {};
	
					// condition to check response.enrollmentData.acknowledgement is defined or not and response.enrollmentData.acknowledgement is empty or not
					if (!_.isUndefined(response.enrollmentData.acknowledgement) && !_.isEmpty(response.enrollmentData.acknowledgement)) {
						// scope variable declare which contains acknowledgement data
						// assigning the acknowledgement to acknowledgementData for display the disbursement method which are use by user on UI 
						$scope.acknowledgementData = response.enrollmentData.acknowledgement;
					}
	
					// this condition is check 'bankEPSList' is empty or not.
					if (!_.isUndefined($scope.bankEPSList) && !_.isEmpty($scope.bankEPSList)) {
						$scope.displayEPSBankData($scope.bankEPSList, response.isNewEnrollment);
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
	
			/**
			 * This function is used to disable save button when there is no change in enrollment form
			 */
			$scope.isChangeData = function () {
				var bankEPSList = $scope.bankEPSpreviousData;
				if (!_.isEmpty(bankEPSList) && JSON.stringify(bankEPSList.accountIdentifier) == JSON.stringify($scope.accountIdentifier) &&
					JSON.stringify(bankEPSList.epayOwner) == JSON.stringify($scope.epayOwner) &&
					JSON.stringify(bankEPSList.epayContact) == JSON.stringify($scope.epayContact) &&
					JSON.stringify(bankEPSList.epayBank) == JSON.stringify($scope.epayBank)) {
					return true;
				} else {
					return false;
				}
			}
	
			//this function call Display all data in UI 
			$scope.displayEPSBankData = function (epsBankData, isNewEnrollment) {
				// this condition check epsForm object defined or no.
	
				if (!_.isUndefined(epsBankData.epayBank)) {
					$scope.epayBank = epsBankData.epayBank;
					$scope.epsForm.confiRoutingNumber = epsBankData.epayBank.routingNumber;
					$scope.epsForm.confiAccouuntNumber = epsBankData.epayBank.accountNumber;
				}
				
				if(!_.isUndefined(epsBankData.epayOwner)){
					$scope.epayOwner = epsBankData.epayOwner;
				}

				if(!_.isUndefined(epsBankData.epayContact)){
					$scope.epayContact = epsBankData.epayContact;
				}

				if(!_.isUndefined(epsBankData.accountIdentifier)){
					$scope.accountIdentifier = epsBankData.accountIdentifier;
				}
				
				$scope.setTaskMask();
	
			};
			
	
			//validate forms before saving data. Decision making function
			$scope.validateFormToSave = function (form) {
				//validate all forms
				if (!_.isUndefined(form) && (form.accountIdentifierTabForm.$invalid == true || form.ownerTabForm.$invalid == true || form.contactTabForm.$invalid == true || form.bankTabForm.$invalid == true)) {
					//open dialog if any form is invalid
					localeService.translate("One or more required fields are pending in enrollment form. Please go through each tab and look for field(s) having red border.", 'EPS_FORM_SAVE_ERROR').then(function (translatedText) {
						var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class displaytext' };
						var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
					});
				} else {
					//call save after validating forms
					saveBankEPS();
				}
			}
	
			//Save EPS 
			var saveBankEPS = function () {
				//If demo user try to open bank . He/She will be prompted with dialog to either register
				//or continue with demo (which redirect user to home page)
				if (userService.getValue('isDemoUser') == true) {
					var salesDialogService = $injector.get('salesDialogService');
					salesDialogService.openSalesDialog("bankEPAY");
				} else {
					if (subscriptionType == 'FREE') {
						$location.path('/home');
					}
					$scope.accountIdentifier.identifierType = "EFIN";
					var	data = {
							accountIdentifier: $scope.accountIdentifier,
							epayOwner: $scope.epayOwner,
							epayContact: $scope.epayContact,
							epayBank: $scope.epayBank,
							bankType: 'EPAY'
					};
				
	
					//this condition to check user data update or new create  
					if ($scope.mode === 'create') {
						//Create EPS 
						epsepayService.createEPSePay(data).then(function (success) {
							messageService.showMessage('Save successfully', 'success', 'BANK_CREATESUCCESS_MSG');
							//after success we just redirect to home screen
							$location.path('/home');
						}, function (error) {
						});
					} else if ($scope.mode === 'update') {
						epsepayService.saveEPSePay(data).then(function (success) {
							messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
							//after success we just redirect to home screen
							$location.path('/home');
						}, function (error) {
						});
								
					}
				}
			};
	
			//Password Strength Functions - Start  
			$scope.$watch('userSetUp.password', function (pass) {
				$scope.passwordStrength = passwordStrengthService.getStrength(pass);
			});
			//Password Strength Functions - End
	
			// Match Function - Start
			// Method to be called on password match or not 
			$scope.matchPasswored = function (formObject, hide) {
				if (angular.isDefined(hide) && hide == true) {
					$scope.confirmPassError = false;
				} else {
					if (angular.isDefined(formObject)) {
						$scope.confirmPassError = formObject.$error.iMatch;
					}
				}
			};
			// Match Function - End
	
			// Method to be called on routing number match or not 
			$scope.matchRoutingNumber = function (formObject, hide) {
				if (angular.isDefined(hide) && hide == true) {
					$scope.confirmRoutingNumberError = false;
				} else {
					if (angular.isDefined(formObject)) {
						$scope.confirmRoutingNumberError = formObject.$error.iMatch;
					}
				}
			};
			// Match Function - End
	
			// Method to be called on account number match or not 
			$scope.matchAccountNumber = function (formObject, hide) {
				if (angular.isDefined(hide) && hide == true) {
					$scope.confirmAccountNumberError = false;
				} else {
					if (angular.isDefined(formObject)) {
						$scope.confirmAccountNumberError = formObject.$error.iMatch;
					}
				}
			};
			// Match Function - End
	
			
			/**
			 * Method prepared to check the user age > 18 or not
			 * */
			$scope.checkAge = function (form, date) {
				// condition to check date is available
				if (!_.isUndefined(date) && !_.isNull(date)) {
					var enteredDate = moment(date, 'MM/DD/YYYY').utc();
					var currentDate = moment().utc();
					var setDate = moment(currentDate, 'MM/DD/YYYY').utc();
					var years = setDate.diff(enteredDate, 'years');
					if (years < 18) {
						// set the valid property in $error of form element
						form.$setValidity('valid', false);
					} else {
						form.$setValidity('valid', true);
					}
				} else {
					form.$setValidity('valid', true);
				}
			};
	
	
			// this function call get bank data on bank/open API	
			$scope.initListBankEPS();
		}]);

//EPS Bank Factory - Start
epsApp.factory('epsepayService', ['$q', '$log', '$http', 'dataAPI', 'userService', function ($q, $log, $http, dataAPI, userService) {
	var epsepayService = {};

	
	// Get application tax year
	var _taxYear = userService.getTaxYear();

	/* to create New  EPS*/
	epsepayService.createEPSePay = function (data) {
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

	/* to update EPS*/
	epsepayService.saveEPSePay = function (data) {
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

	/* the below method is work for open screen get EPS details*/
	epsepayService.getEPSePay = function () {
		
		var deferred = $q.defer();
		//load list from data api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/open',
			data: {
				bankType: 'EPAY'
			}
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	return epsepayService;
}]);
//EPS Factory - End