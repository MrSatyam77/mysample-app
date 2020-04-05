'use strict';

var tpgApp = angular.module('tpgApp', []);

tpgApp.controller('tpgController', ['$scope', '$log', '$location', '$injector', 'userService', 'dialogService', 'messageService', 'tpgService', 'dataAPI', 'environment', 'subscriptionService', 'passwordStrengthService', 'localeService', 'resellerService', '$timeout',
	function ($scope, $log, $location, $injector, userService, dialogService, messageService, tpgService, dataAPI, environment, subscriptionService, passwordStrengthService, localeService, resellerService, $timeout) {

		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};

		// check for both efin same or not.
		$scope.isBothEFINSame = false;

		var _init = function () {

			//get current taxYear
			$scope.taxYear = userService.getTaxYear();

			//condition to check that year equals to 2014
			if ($scope.taxYear == '2014') {
				// redirect to home because TPG bank is not listed in Financial Products for year 2014  
				$location.path('/home');
			}

			//get reseller name
			$scope.resellerConfig = resellerService.getValues(['appName']);
			$scope.hasFeature = function (featureName) {
				return resellerService.hasFeature(featureName);
			}

			// set by default first tab is true
			$scope.activeTab = {};

			if ($scope.taxYear === '2015') {
				$scope.activeTab.officeTab = true;
			} else if (parseInt($scope.taxYear) >= 2016 && parseInt($scope.taxYear) <= 2018) {
				$scope.activeTab.tpgProgramTab = true;
			} else if (parseInt($scope.taxYear) >= 2019) {
				$scope.activeTab.programTab = true;
			}

			if ($scope.taxYear == '2017') {
				var lastDate = new Date('10/21/2018');
				if (new Date() > lastDate) {
					$scope.isClosedEnrollmentFor2017 = true;
				}
			}

			//array object declare which contains the mapping of next and previous view for the steps of conversion
			switch (true) {
				case $scope.taxYear === '2015':
					$scope.nextAndPrevTpgViewMap = [
						{ "view": "officeTab", "next": "ownerTab", "previous": "", "currentView": true, "formName": "officeTabForm" },
						{ "view": "ownerTab", "next": "efinOwnerTab", "previous": "officeTab", "currentView": false, "formName": "ownerTabForm" },
						{ "view": "efinOwnerTab", "next": "bankTab", "previous": "ownerTab", "currentView": false, "formName": "efinOwnerTabForm" },
						{ "view": "bankTab", "next": "", "previous": "efinOwnerTab", "currentView": false, "formName": "bankTabForm" }
					];
					break;
				case parseInt($scope.taxYear) >= 2016:
					$scope.nextAndPrevTpgViewMap = [
						{ "view": "tpgProgramTab", "next": "proHistoryTab", "previous": "", "currentView": true, "formName": "tpgprogramTabForm" },
						{ "view": "proHistoryTab", "next": "officeTab", "previous": "tpgProgramTab", "currentView": false, "formName": "bankProductHistoryTabForm" },
						{ "view": "officeTab", "next": "ownerTab", "previous": "proHistoryTab", "currentView": false, "formName": "officeTabForm" },
						{ "view": "ownerTab", "next": "efinOwnerTab", "previous": "officeTab", "currentView": false, "formName": "ownerTabForm" },
						{ "view": "efinOwnerTab", "next": "bankTab", "previous": "ownerTab", "currentView": false, "formName": "efinOwnerTabForm" },
						{ "view": "bankTab", "next": "userSetupTab", "previous": "efinOwnerTab", "currentView": false, "formName": "bankTabForm" },
						{ "view": "userSetupTab", "next": "consentTab", "previous": "bankTab", "currentView": false, "formName": "userSetupTabForm" },
						{ "view": "consentTab", "next": "", "previous": "userSetupTab", "currentView": false, "formName": "consentTabForm" }
					];
				case parseInt($scope.taxYear) >= 19:
					$scope.nextAndPrevTpgViewMap = [
						{ "view": "programTab", "next": "tpgProgramTab", "previous": "", "currentView": true, "formName": "programTabForm" },
						{ "view": "tpgProgramTab", "next": "proHistoryTab", "previous": "programTab", "currentView": false, "formName": "tpgprogramTabForm" },
						{ "view": "proHistoryTab", "next": "officeTab", "previous": "tpgProgramTab", "currentView": false, "formName": "bankProductHistoryTabForm" },
						{ "view": "officeTab", "next": "ownerTab", "previous": "proHistoryTab", "currentView": false, "formName": "officeTabForm" },
						{ "view": "ownerTab", "next": "efinOwnerTab", "previous": "officeTab", "currentView": false, "formName": "ownerTabForm" },
						{ "view": "efinOwnerTab", "next": "bankTab", "previous": "ownerTab", "currentView": false, "formName": "efinOwnerTabForm" },
						{ "view": "bankTab", "next": "userSetupTab", "previous": "efinOwnerTab", "currentView": false, "formName": "bankTabForm" },
						{ "view": "userSetupTab", "next": "consentTab", "previous": "bankTab", "currentView": false, "formName": "userSetupTabForm" },
						{ "view": "consentTab", "next": "", "previous": "userSetupTab", "currentView": false, "formName": "consentTabForm" }
					];
					break;
			}


			// configuration for dropdown options
			$scope.dropdownOptions = {
				sexList: [
					{ displayText: 'Male', value: 1 },
					{ displayText: 'Female', value: 2 },
					{ displayText: 'Prefer not to answer', value: 3 }
				],
				idTypeList: [
					{ displayText: 'Driver License (U.S. State)', value: 1 },
					{ displayText: 'Driver License (Foreign)', value: 2 },
					{ displayText: 'US Passport', value: 3 },
					{ displayText: 'Foreign Passport', value: 4 },
					{ displayText: 'U.S. state-issued ID card', value: 5 },
					{ displayText: 'U.S. military ID card', value: 6 },
					{ displayText: 'Mexican Consular ID card', value: 7 },
					{ displayText: 'Native American tribal ID card', value: 8 },
					{ displayText: 'Alien ID, such as a green card or work Visa', value: 9 },
					{ displayText: 'OTHER', value: 10 }
				],
				transmitterUsedLastYear: [{
					dispalyText: "ATX",
					value: "ATX"
				}, {
					dispalyText: "Drake",
					value: "Drake"
				}, {
					dispalyText: "OLT",
					value: "OLT"
				}, {
					dispalyText: "TaxWise",
					value: "TaxWise"
				}, {
					dispalyText: "ATS",
					value: "ATS"
				}, {
					dispalyText: "Intuit ProSeries",
					value: "IntuitProSeries"
				}, {
					dispalyText: "Other",
					value: "OTHER"
				}, {
					dispalyText: "Crosslink",
					value: "Crosslink"
				}, {
					dispalyText: "Intuit Lacerte",
					value: "IntuitLacerte"
				}, {
					dispalyText: "TaxWise Online",
					value: "TaxWiseOnline"
				}, {
					dispalyText: "TaxWise Desktop",
					value: "TaxWiseDesktop"
				}],
				bankUsedLastYear: [
					{
						dispalyText: "TPG",
						value: "S"
					},
					{
						dispalyText: "Republic",
						value: "R"
					},
					{
						dispalyText: "River City",
						value: "C"
					},
					{
						dispalyText: "Refund Advantage",
						value: "V"
					},
					{
						dispalyText: "Refundo",
						value: "F"
					},
					{
						dispalyText: "EPS",
						value: "E"
					}
					, {
						dispalyText: "Navigator",
						value: "N"
					},
					{
						dispalyText: "Other",
						value: "O"
					}]

			};


			$scope.responseMessage2017 = {
				"E": { value: "E", displayText: "Your enrollment through Tax Products Group (TPG) has not been received for the current filing season." },
				"P": { value: "P", displayText: "Thank you for applying to offer tax-related products through Tax Products Group (TPG).Your enrollment application has been received and is currently being processed." },
				"V": { value: "V", displayText: "Thank you for applying to offer tax-related products through Tax Products Group (TPG).Additional information is needed in order for TPG to complete your application. Please contact TPG at your earliest convenience to verify your prior volume." },
				"W": { value: "W", displayText: "Thank you for applying to offer tax-related products through Tax Products Group (TPG).Additional information is needed in order for you to get paid. Please log on to the TPG website (www.sbtpg.com) to verify your information, including your bank account information. Payment of your tax preparation fees are on hold until this critical step has been completed." },
				"C": { value: "C", displayText: "Our records indicate you have not completed the Tax Products Group (TPG) Compliance Exam! Completion of the compliance training is required for all tax professionals that are offering tax-related products through TPG. Payment of your tax preparation fees are on hold until this critical step has been completed." },
				"A": { value: "A", displayText: "You’re approved with Tax Products Group (TPG). You're one step closer to completing your application. Log on the TPG website to confirm your information and to participate in additional TPG offered programs." },
				"D": { value: "D", displayText: "After carefully reviewing your application, it has been determined that you have not met the criteria to offer tax-related products through TPG for the upcoming tax season. Any products submitted through TPG will not be accepted." }
			}

			$scope.responseMsgFastCashAdavnce = {
				"O": { value: "O", displayText: "Thank you for applying to offer the Tax Products Group (TPG) FastCash Advance. Your application has been received and is currently being processed." },
				"V": { value: "V", displayText: "Thank you for applying to offer the Tax Products Group (TPG) FastCash Advance. There is additional information that is needed from you in order for us to complete your application. Please call (800)779-7228." },
				"C": { value: "C", displayText: "Our records indicate you have not completed the Tax Products Group (TPG) FastCash Advance Compliance Exam. Completion of the compliance training is required for all tax professionals that are offering FastCash Advance through TPG." },
				"A": { value: "A", displayText: "You’ve been approved to offer FastCash Advance through Tax Products Group (TPG)." },
				"I": { value: "I", displayText: "Thank you for applying to offer the Tax Products Group (TPG) FastCash Advance. After carefully reviewing your application, it has been determined that you have not met the criteria to offer this product." },
				"D": { value: "D", displayText: "Thank you for applying to offer the Tax Products Group (TPG) FastCash Advance. After carefully reviewing your application, it has been determined that you have not met the criteria to offer this product." },
			}
			// for tax year 2016 sexList value as string
			if (parseInt($scope.taxYear) >= 2016) {
				$scope.dropdownOptions.sexList = [
					{ displayText: 'Male', value: '1' },
					{ displayText: 'Female', value: '2' },
					{ displayText: 'Prefer not to answer', value: '3' }
				];
			}

			switch (true) {
				case $scope.taxYear === '2015':
					//this condition check  all object is defined or not
					if (_.isUndefined($scope.office)) {
						$scope.office = { packagePlan: 6, address: { city: "", state: "" }, isJadeeLastYearClient: "N" };
					}
					if (_.isUndefined($scope.owner)) {
						$scope.owner = { salutation: "", address: { city: "", state: "" }, eroBankFee: 0 };
					}
					if (_.isUndefined($scope.efinOwner)) {
						$scope.efinOwner = { salutation: "", firstName: "", lastName: "", sex: 0, email: "", address: { address: "", city: "", state: "" }, idType: 0, idNumber: "" };
					}
					if (_.isUndefined($scope.bank)) {
						$scope.bank = {};
					}
					if (_.isUndefined($scope.tpgForm)) {
						$scope.tpgForm = {};
					}
					break;

				case parseInt($scope.taxYear) >= 2016:
					//this condition check  all object is defined or not
					if (_.isUndefined($scope.tpgProgram)) {
						$scope.tpgProgram = { serviceBureauFee: 0, addOnTransmitterFee: "0", addOnTransmitterFeeAgreement: false, documentPrepFee: 0 };
					}
					if (_.isUndefined($scope.office)) {
						$scope.office = { userId: 1, citizenId: 1, customerId: 1, businessPlanId: 1, packageId: 6, priorRTProcessor: 'SBTPG', billingAddress: { city: "", state: "", address2: "" }, shippingAddress: { city: "", state: "", address2: "" }, isCustomerBack: "NonReturned", isNewCustomer: true };
					}
					if (_.isUndefined($scope.bankProductHistory)) {
						$scope.bankProductHistory = { priorEfin: "", generatedFundingRatio: 0, generatedNumberOfERCsERDsLastYear: 0, generatedNumberOfRALsLastYear: 0, generatedTotalPriorYearPrepFeeAmountPaid: 0 }
					}
					if (_.isUndefined($scope.owner)) {
						$scope.owner = { billingAddress: { city: "", state: "", address2: "" }, shippingAddress: { city: "", state: "", address2: "" }, ownerId: 1, citizenId: 1 }
					}
					if (_.isUndefined($scope.efinOwner)) {
						$scope.efinOwner = { billingAddress: { city: "", state: "", address2: "" }, shippingAddress: { city: "", state: "", address2: "" }, sameAsEfinOwner: false }
					}
					if (_.isUndefined($scope.bank)) {
						$scope.bank = {};
					}
					if (_.isUndefined($scope.userSetUp)) {
						$scope.userSetUp = { roleId: 2, newsLetter: 0, priorityMail: 0, notifications: 0 };
					}
					if (_.isUndefined($scope.consent)) {
						$scope.consent = {};
					}
					if (_.isUndefined($scope.tpgForm)) {
						$scope.tpgForm = {};
					}
					break;

			}
		}

		// Intialize tpg bank app
		_init();

		//Temporary function to differentiate features as per environment (beta/live)
		$scope.betaOnly = function () {
			if (environment.mode == 'beta' || environment.mode == 'local') {
				return true;
			} else {
				return false;
			}
		};

		$scope.convertCityInUppercase = function (address) {
			$timeout(function () {
				address.city = address.city.toUpperCase();
			}, 0)

		}

		//to check is user is paid user or not 
		var userDetails = userService.getUserDetails();
		$scope.isDemoUser = userDetails.isDemoUser;
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
			$location.path('/alert/licenseInfo');
			//First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller			  
			// var dialog = dialogService.openDialog("custom", {
			// 	'keyboard': false,
			// 	'backdrop': false,
			// 	'size': 'md'
			// }, "taxAppJs/return/workspace/partials/subscriptionDialog.html", "subscriptionDialogController", {
			// 		"bankProducts": true
			// 	});
			// dialog.result.then(function (btn) {
			// 	subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
			// }, function (btn) {
			// 	$location.path('/home');
			// });
		}

		// this local variable get current tab form name in nextAndPrevTpgViewMap array.
		var _getFormName = function () {
			var curView = _.find($scope.nextAndPrevTpgViewMap, { "currentView": true })["view"];
			//obtaining the index of the current view from the array object on which currently user is.  
			var index = _.findIndex($scope.nextAndPrevTpgViewMap, function (viewList) {
				return viewList.view == curView;
			});
			return $scope.nextAndPrevTpgViewMap[index].formName;
		};

		$scope.speacialState = ['IL'];

		//method defined to change view when user click on next or back button
		//curView = it contains the view on which the user is.
		//mode = it contains the mode of the click button whether it is next button or back button clicked 
		$scope.changeView = function (tabMode) {
			var curView = _.find($scope.nextAndPrevTpgViewMap, { "currentView": true })["view"];
			//obtaining the index of the current view from the array object on which currently user is.  
			var index = _.findIndex($scope.nextAndPrevTpgViewMap, function (viewList) {
				return viewList.view == curView;
			});
			if (!_.isUndefined(index) && index !== '') {
				//condition to check which button is pressed.
				if (tabMode == 'next') {
					_.find($scope.nextAndPrevTpgViewMap, { "view": curView })["currentView"] = false;
					_.find($scope.nextAndPrevTpgViewMap, { "view": $scope.nextAndPrevTpgViewMap[index].next })["currentView"] = true;
					$scope.formName = _getFormName();
					$scope.activeTab[$scope.nextAndPrevTpgViewMap[index].next] = true;
				} else if (tabMode == 'previous') {
					_.find($scope.nextAndPrevTpgViewMap, { "view": curView })["currentView"] = false;
					_.find($scope.nextAndPrevTpgViewMap, { "view": $scope.nextAndPrevTpgViewMap[index].previous })["currentView"] = true;
					$scope.formName = _getFormName();
					$scope.activeTab[$scope.nextAndPrevTpgViewMap[index].previous] = true;
				}
			}
		};
		//This function call user click tab head than move current tab to selected tab curView Is hold valued selected view.  
		$scope.tabChangeView = function (curView) {
			// this variable hold value to current tab.
			var oldCurView = _.find($scope.nextAndPrevTpgViewMap, { "currentView": true })["view"];
			//obtaining the index of the current view from the array object on which currently user is.  
			var index = _.findIndex($scope.nextAndPrevTpgViewMap, function (viewList) {
				return viewList.view == curView;
			});
			if (!_.isUndefined(index) && index !== '') {
				//condition to check which button is pressed.
				_.find($scope.nextAndPrevTpgViewMap, { "view": oldCurView })["currentView"] = false;
				_.find($scope.nextAndPrevTpgViewMap, { "view": $scope.nextAndPrevTpgViewMap[index].view })["currentView"] = true;
				$scope.formName = _getFormName();
				$scope.activeTab[$scope.nextAndPrevTpgViewMap[index].view] = true;
			}
		};

		// variable declare which contain response code, type and message 
		var codeList = {
			"Enrollment Rejected": { type: 'warning', message: "Your enrollment has been rejected by TPG." },
			"Pending For Submission": { type: 'warning', message: "Your enrollment is pending from TPG." },
			"Not Enrolled-Errors": { type: 'warning', message: "Your enrollment has been rejected by TPG." }
		};

		// this function call in page load time , check user make bank or edit bank 
		var initListBankTPG = function () {
			$scope.formName = _getFormName();
			tpgService.getTPG().then(function (response) {
				if (_.isUndefined($scope.bankTPGList)) {
					$scope.bankTPGList = {};
				}
				if (_.isEmpty(response.enrollmentData)) {
					$scope.tpgProgram.efin = angular.copy(userService.getLocationData()['efin']);
				}
				$scope.bankTPGList = response.enrollmentData;
				$scope.bankTPGpreviousData = JSON.parse(JSON.stringify(response.enrollmentData));
				// assigning the response to responseData for disable the save button
				$scope.responseData = (!_.isUndefined(response)) ? response : '';
				$scope.tpgResponseMessages = [];
				if ($scope.taxYear == '2015') {
					// condition to check response.enrollmentData.bankStatus is defined or not1000
					if (!_.isUndefined(response.enrollmentData.bankStatus)) {
						// assigning the response.enrollmentData.bankStatus to responseMessage for display the bankStatus message on UI
						$scope.responseMessage = response.enrollmentData.bankStatus;
					}
					// condition to check response.enrollmentData.acknowledgement is defined or not
					else if (!_.isUndefined(response.enrollmentData.acknowledgement)) {
						// assigning the response.enrollmentData.acknowledgement to responseMessage for display the acknowledgement message on UI
						$scope.responseMessage = response.enrollmentData.acknowledgement;
					}
				} else {
					// assigning the response status to rersponseMessage for display the message on UI
					if (!_.isUndefined(response.enrollmentData.status)) {
						$scope.responseMessage = codeList[response.enrollmentData.status];
					}

					//assining messages according to response
					if (!_.isUndefined(response.enrollmentData.status) && response.enrollmentData.status != 'Not Enrolled-Errors' && !_.isUndefined(response.enrollmentData.acknowledgement) && !_.isEmpty(response.enrollmentData.acknowledgement.enrollmentSubStatus) && !_.isUndefined(response.enrollmentData.acknowledgement.enrollmentSubStatus) && response.enrollmentData.acknowledgement.enrollmentSubStatus == $scope.responseMessage2017[response.enrollmentData.acknowledgement.enrollmentSubStatus].value) {
						$scope.tpgResponseMessages.push($scope.responseMessage2017[response.enrollmentData.acknowledgement.enrollmentSubStatus].displayText)
						$scope.enrollmentStatus = response.enrollmentData.acknowledgement.enrollmentSubStatus;
					}
					if (!_.isUndefined(response.enrollmentData.status) && response.enrollmentData.status != 'Not Enrolled-Errors' && !_.isUndefined(response.enrollmentData.acknowledgement) && !_.isEmpty(response.enrollmentData.acknowledgement.enrollmentStatus) && !_.isUndefined(response.enrollmentData.acknowledgement.enrollmentStatus) && response.enrollmentData.acknowledgement.enrollmentStatus == "A") {
						$scope.tpgResponseMessages.push("You are enrolled with TPG.")
					}

					if (!_.isUndefined(response.enrollmentData.status) && response.enrollmentData.status != 'Not Enrolled-Errors' && !_.isUndefined(response.enrollmentData.acknowledgement) &&
						!_.isEmpty(response.enrollmentData.acknowledgement.fastCashAdvanceEnrollmentSubStatus) && !_.isUndefined(response.enrollmentData.acknowledgement.fastCashAdvanceEnrollmentSubStatus) &&
						response.enrollmentData.acknowledgement.fastCashAdvanceEnrollmentSubStatus == $scope.responseMsgFastCashAdavnce[response.enrollmentData.acknowledgement.fastCashAdvanceEnrollmentSubStatus].value) {
						$scope.fastCashAdvanceStatus = response.enrollmentData.acknowledgement.fastCashAdvanceEnrollmentSubStatus;
						$scope.fastCashAdvanceStatusMsg = $scope.responseMsgFastCashAdavnce[response.enrollmentData.acknowledgement.fastCashAdvanceEnrollmentSubStatus].displayText;
					}

					//assigning tpg addOrRenew response message to UI
					/* if (!_.isUndefined(response.enrollmentData.acknowledgement) && !_.isUndefined(response.enrollmentData.acknowledgement.message) &&
						!_.isEmpty(response.enrollmentData.acknowledgement.message)) {
						//Due to old data
						if (_.isArray(response.enrollmentData.acknowledgement.message)) {
							$scope.tpgResponseMessages = response.enrollmentData.acknowledgement.message;
						} else {
							$scope.tpgResponseMessages = [response.enrollmentData.acknowledgement.message];
						}
					} */

					if (!_.isUndefined(response.enrollmentData.acknowledgement)) {
						for (var i = 1; i <= 10; i++) {
							var key = "ErrorCode" + i;
							if (!_.isEmpty(response.enrollmentData.acknowledgement[key]) && !_.isUndefined(response.enrollmentData.acknowledgement[key])) {
								$scope.tpgResponseMessages.push(response.enrollmentData.acknowledgement[key]);
							}
						}
					}

					// assigning tpg status response message to tpg UI
					if (!_.isUndefined(response.enrollmentData.bankStatus) && !_.isUndefined(response.enrollmentData.bankStatus.message) &&
						!_.isEmpty(response.enrollmentData.bankStatus.message)) {
						//Due to old data
						if (_.isArray(response.enrollmentData.bankStatus.message)) {
							$scope.tpgResponseMessages = response.enrollmentData.bankStatus.message;
						} else {
							$scope.tpgResponseMessages = [response.enrollmentData.bankStatus.message];
						}
					}


				}

				// condition to check response.enrollmentData.status is defined or not
				if (!_.isUndefined(response.enrollmentData.status)) {
					$scope.status = response.enrollmentData.status;
				}

				// this condition is check 'bankTPGList' is empty or not.
				if (!_.isUndefined($scope.bankTPGList) && !_.isEmpty($scope.bankTPGList)) {
					if ($scope.taxYear === '2015') {
						$scope.displayTPGBankData($scope.bankTPGList);
					} else {
						$scope.displayTPGBankData($scope.bankTPGList, response.isNewEnrollment);
					}

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


		//Password Strength Functions - Start  
		$scope.$watch('userSetUp.password', function (pass) {
			$scope.passwordStrength = passwordStrengthService.getStrength(pass);
		});
		//Password Strength Functions - End

		/**
		 * validate date format
		 */
		$scope.checkDateValidation = function (input) {
			var datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

			if (datePattern.test(input)) {
				$scope.isDateWrong = false;
				return false;
			} else {
				$scope.isDateWrong = true;
				return true;
			}
		}

		/**
		 * EfinOwner date validation
		 */
		$scope.checkEfinOwnerDateValidation = function (inputfieldName, date) {
			if ($scope.efinOwner.sameAsEfinOwner == false) {
				$scope.checkAge(inputfieldName, date)
				$scope.checkDateValidation(date)
			}
		}

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

		/**
 		* Function to check if both EFIN and Parent EFIN is same or not. IF both value are same than we genrate error.
 		*/
		$scope.checkBothEFINSame = function () {
			if (($scope.tpgProgram.parentEfin == $scope.tpgProgram.efin) && ($scope.office.typeOfCustomer == 'ServiceBureau' && $scope.tpgProgram.parentOrSubEfin == false)) {
				$scope.isBothEFINSame = true;
			} else {
				$scope.isBothEFINSame = false;
			}
		}

		//this function call Display all data in UI 
		$scope.displayTPGBankData = function (tpgBankData, isNewEnrollment) {

			// merge reposne api data with configuration
			if (!_.isUndefined(tpgBankData.office)) {
				$scope.office = _.merge($scope.office, tpgBankData.office);
			}
			if (!_.isUndefined(tpgBankData.owner)) {
				$scope.owner = _.merge($scope.owner, tpgBankData.owner);
			}
			if (!_.isUndefined(tpgBankData.efinOwner)) {
				$scope.efinOwner = _.merge($scope.efinOwner, tpgBankData.efinOwner);
			}

			// for taxyear greater then 2016 add bank product history and user setup in tpg enrollment
			if (parseInt($scope.taxYear) >= 2016) {
				if (!_.isUndefined(tpgBankData.tpgProgram)) {
					$scope.tpgProgram = _.merge($scope.tpgProgram, tpgBankData.tpgProgram);
				}
				if (!_.isUndefined(tpgBankData.bankProductHistory)) {
					$scope.bankProductHistory = _.merge($scope.bankProductHistory, tpgBankData.bankProductHistory);
				}
				if (!_.isUndefined(tpgBankData.userSetUp)) {
					$scope.userSetUp = _.merge($scope.userSetUp, tpgBankData.userSetUp);
				}
				if (!_.isUndefined(tpgBankData.consent)) {
					$scope.consent = _.merge($scope.consent, tpgBankData.consent);
				}
			}

			if (!_.isUndefined(tpgBankData.bank)) {
				$scope.bank = tpgBankData.bank;
				$scope.tpgForm.confiRoutingNumber = tpgBankData.bank.routingNumber;
				$scope.tpgForm.confiAccountNumber = tpgBankData.bank.accountNumber;
				if (tpgBankData.bank.accountType == 'Checking') {
					$scope.bank.accountType = "C";
				} else if (tpgBankData.bank.accountType == 'Saving') {
					$scope.bank.accountType = "S";
				}
			}

			// For new enrollment in tpg for current tax year
			if (isNewEnrollment == true) {
				// get prior year some enrolllment data to current year tpg bank
				if (!_.isUndefined(tpgBankData.acknowledgement) && parseInt($scope.taxYear) >= 2016) {
					if (_.keys(tpgBankData.acknowledgement).length > 0) {
						$scope.office.userId = !_.isUndefined(tpgBankData.acknowledgement.userId) ? parseInt(tpgBankData.acknowledgement.userId) : 1;
						$scope.office.customerId = !_.isUndefined(tpgBankData.acknowledgement.CustomerId) ? parseInt(tpgBankData.acknowledgement.CustomerId) : 1;
						$scope.office.isCustomerBack = 'Returned';
						$scope.office.isNewCustomer = false;
						$scope.owner.ownerId = !_.isUndefined(tpgBankData.acknowledgement.OwnerId) ? parseInt(tpgBankData.acknowledgement.OwnerId) : 1;
					}
				}
				// For the taxYear 2016 and new enrollment get efin from office
				if ($scope.taxYear == '2016') {
					$scope.tpgProgram.efin = tpgBankData.office.efin;
				}
				// condition to check newEnrollment equals to true and epsBankData not empty and the taxYear is equal to 2015 
				if (!_.isEmpty(tpgBankData) && $scope.taxYear == '2016') {
					// function call to update the values of tab
					_updateMapValue();
				}
			}


		};


		/**
		 * method update the prior year oldValue to current year newValue
		 * */
		var _updateMapValue = function () {
			// local variable to get the old and new value of Object
			var _mappedObject = tpgService.getMapObject();
			// loop over object receive from the service
			_.forEach(_mappedObject, function (obj, key) {
				// loop over tab properties whose mapping is done
				_.forEach(obj, function (prop) {
					if (!_.isUndefined(prop.values)) {
						// local variable to fetch the old and new value of the property of a specific tab
						var getOldNewValuePair = _.find(prop.values, { oldValue: $scope[key][prop.propName] });
						//condition to check variable is not undefined
						if (!_.isUndefined(getOldNewValuePair)) {
							// replace the old value with the new value which is mapped.
							$scope[key][prop.propName] = getOldNewValuePair.newValue;
						}
					}
				});
			});
		};

		/**
		 * Method prepared to copy the address(street address, city, state, zip) from Office/BusinessOwner/MailingAddress to Shipping address
		 * it will be called on the checkbox click event in shipping and mailing tab
		 */
		$scope.copyToShippingAddress = function (tabName) {
			//conditions to check whether Office Address checkbox is checked or Owner Address checkbox is checked or Mailing Address checkbox is checked
			if (!_.isUndefined(tabName.sameAsBillingAddress) && tabName.sameAsBillingAddress == true) {
				//copy office address to shipping address
				tabName.shippingAddress = angular.copy((!_.isUndefined(tabName.billingAddress)) ? tabName.billingAddress : {});
			} else {
				tabName.shippingAddress = {};
			}
		};


		//validate forms before saving data. Decision making function
		$scope.validateFormToSave = function (form) {
			//validate all forms
			if (!_.isUndefined(form) && (form.programTabForm.$invalid == true || form.tpgprogramTabForm.$invalid == true || form.officeTabForm.$invalid == true || form.ownerTabForm.$invalid == true || form.efinOwnerTabForm.$invalid == true || form.bankTabForm.$invalid == true || form.userSetupTabForm.$invalid == true || form.bankProductHistoryTabForm.$invalid == true || form.consentTabForm.$invalid == true || checkConsent())) {
				//open dialog if any form is invalid
				localeService.translate("Please review each of the ERO Enrollment Application Tabs, and complete the required fields displayed in red.", 'TPG_FORM_SAVE_ERROR').then(function (translatedText) {
					var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
					var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
				});
			} else {
				//call save after validating forms
				saveBankTPG();
			}
		}

		//method to download agreement of ERO or taxpayer
		$scope.getURLToDownloadPDF = function (pdfName) {
			switch (pdfName) {
				case 'FINANCIAL_SERVICES_AGREEMENT':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/tpg/Financial_Service_Agreement.pdf';
				default:
					return;
			}
		};

		// Save TPG
		var saveBankTPG = function () {
			//If demo user try to open bank . He/She will be prompted with dialog to either register
			//or continue with demo (which redirect user to home page)
			if (userService.getValue('isDemoUser') == true) {
				var salesDialogService = $injector.get('salesDialogService');
				salesDialogService.openSalesDialog("bankTPG");
			} else {
				if (subscriptionType == 'FREE') {
					$location.path('/home');
				}
				// assigning the default value to efinOwnerEin property of owner tab if user not fill the EIN field 
				$scope.owner.efinOwnerEin = (!_.isUndefined($scope.owner.efinOwnerEin) && !_.isEmpty($scope.owner.efinOwnerEin) && !_.isNull($scope.owner.efinOwnerEin)) ? $scope.owner.efinOwnerEin : "000000000";
				var data;
				if ($scope.taxYear == '2015') {
					data = {
						office: $scope.office,
						owner: $scope.owner,
						efinOwner: $scope.efinOwner,
						bank: $scope.bank,
						bankType: 'TPG'
					};
				} else {
					var fp1 = new Fingerprint({ canvas: true, ie_activex: true, screen_resolution: true });
					var deviceId = CryptoJS.SHA1(fp1.get()).toString();
					if ($scope.office.typeOfCustomer == 'CustomerERO') {
						// if ($scope.tpgProgram.serviceBureauFee > 0) {
						// 	$scope.tpgProgram.parentOrSubEfin = undefined;
						// 	$scope.tpgProgram.parentEfin = $scope.tpgProgram.efin;
						// } else {
						$scope.tpgProgram.parentOrSubEfin = undefined;
						$scope.tpgProgram.parentEfin = undefined;
						$scope.tpgProgram.serviceBureauFee = 0;
						// }
					}
					$scope.tpgProgram.deviceId = deviceId;
					if ($scope.bank.checkPrintingPreference != 'B') {
						$scope.bank.checkPrintingPreference = 'S'
					}
					data = {
						tpgProgram: $scope.tpgProgram,
						office: $scope.office,
						owner: $scope.owner,
						efinOwner: $scope.efinOwner,
						bank: $scope.bank,
						bankProductHistory: $scope.bankProductHistory,
						userSetUp: $scope.userSetUp,
						consent: $scope.consent,
						isSpeacialState: isSpeacialState,
						bankType: 'TPG'
					}
				}

				//this condition to check user data update or new create  
				if ($scope.mode === 'create') {
					//Create TPG 
					tpgService.createTPG(data).then(function (success) {
						messageService.showMessage('Save successfully', 'success', 'BANK_CREATESUCCESS_MSG');
						//after success we just redirect to home screen
						$location.path('/home');
					}, function (error) {
					});
				} else if ($scope.mode === 'update') {
					//Save TPG
					if ($scope.status == "Enrolled") {
						// Dialog used for the confirmation from user to Delete or not the selected user.
						var dialogConfiguration = {
							'keyboard': false,
							'backdrop': false,
							'size': 'md',
							'windowClass': 'my-class'
						};
						localeService.translate('You are already enrolled with TPG. if you save changes then your status change back to In Process.Do you want to save ?', 'USER_DOYOUDELETETHISUSER_DIALOG_MESSAGE').then(function (translateText) {
							var dialog = dialogService.openDialog("confirm", dialogConfiguration, {
								text: translateText
							});
							dialog.result.then(function (btn) {
								tpgService.saveTPG(data).then(function (success) {
									messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
									//after success we just redirect to home screen
									$location.path('/home');
								}, function (error) {
								});
							}, function (btn) {

							});
						});
					} else {
						tpgService.saveTPG(data).then(function (success) {
							messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
							//after success we just redirect to home screen
							$location.path('/home');
						}, function (error) {
						});
					}
				}
			}
		};

		$scope.setTPGPrecessionFee = function () {
			if ($scope.tpgProgram.documentPrepFee > 0 && $scope.tpgProgram.documentPrepFee <= 50) {
				$scope.tpgProgram.tpgProcessingFee = 5.00;
			} else if ($scope.tpgProgram.documentPrepFee > 50 && $scope.tpgProgram.documentPrepFee <= 100) {
				$scope.tpgProgram.tpgProcessingFee = 7.00;
			} else if ($scope.tpgProgram.documentPrepFee > 100 && $scope.tpgProgram.documentPrepFee <= 150) {
				$scope.tpgProgram.tpgProcessingFee = 10.00;
			}
		}

		/**
		 * This function is used to disable save button when there is no change in enrollment form
		 */
		$scope.isChangeData = function () {
			var bankTPGList = $scope.bankTPGpreviousData;
			if (!_.isEmpty(bankTPGList) && JSON.stringify(bankTPGList.tpgProgram) == JSON.stringify($scope.tpgProgram) &&
				JSON.stringify(bankTPGList.office) == JSON.stringify($scope.office) &&
				JSON.stringify(bankTPGList.owner) == JSON.stringify($scope.owner) &&
				JSON.stringify(bankTPGList.efinOwner) == JSON.stringify($scope.efinOwner) &&
				JSON.stringify(bankTPGList.bankProductHistory) == JSON.stringify($scope.bankProductHistory) &&
				JSON.stringify(bankTPGList.bank) == JSON.stringify($scope.bank) &&
				JSON.stringify(bankTPGList.userSetUp) == JSON.stringify($scope.userSetUp) &&
				JSON.stringify(bankTPGList.consent) == JSON.stringify($scope.consent)) {
				return true;
			} else {
				return false;
			}
		}

		// Match Function - Start
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
		 * Method prepared to copy the data from EFIN owner to Business owner
		 * it will be called on the checkbox click event in business owner tab
		 */
		$scope.sameAsEfinOwner = function () {
			//condition to check whether checkbox is checked or not
			if ($scope.efinOwner.sameAsEfinOwner == true) {
				// delete some property from efin owner if it same as owner
				delete $scope.efinOwner;
				$scope.efinOwner = {};
				$scope.efinOwner.sameAsEfinOwner = true;
				$scope.efinOwner.billingAddress = {};
				$scope.efinOwner.shippingAddress = {};
				$scope.efinOwner.sameAsBillingAddress = false;

			} else {//portion will be executed when check box is de-selected
				//reset business owner object
				$scope.efinOwner = { billingAddress: { city: "", state: "", address2: "" }, shippingAddress: { city: "", state: "", address2: "" }, sameAsEfinOwner: false }
			}
		};

		/**
		 * check address is not po box
		 */
		$scope.checkPOBoxAddress = function () {
			$scope.poBoxMessage = "";
			var officeBillingAddress, officeShippingAddress, ownerBillingAddress, ownerShippingAddress, efinOwnerBillingAddress, efinOwnerShippingAddress;
			if (!_.isEmpty($scope.office.billingAddress) && !_.isEmpty($scope.office.billingAddress.address)) {
				officeBillingAddress = $scope.office.billingAddress.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.office.shippingAddress) && !_.isEmpty($scope.office.shippingAddress.address)) {
				officeShippingAddress = $scope.office.shippingAddress.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.owner.billingAddress) && !_.isEmpty($scope.owner.billingAddress.address)) {
				ownerBillingAddress = $scope.owner.billingAddress.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.owner.shippingAddress) && !_.isEmpty($scope.owner.shippingAddress.address)) {
				ownerShippingAddress = $scope.owner.shippingAddress.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.efinOwner.billingAddress) && !_.isEmpty($scope.efinOwner.billingAddress.address)) {
				efinOwnerBillingAddress = $scope.efinOwner.billingAddress.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.efinOwner.shippingAddress) && !_.isEmpty($scope.efinOwner.shippingAddress.address)) {
				efinOwnerShippingAddress = $scope.efinOwner.shippingAddress.address.replace(/ /g, '');
			}

			var isExist = false;
			if (officeBillingAddress !== undefined) {
				if (officeBillingAddress.toLowerCase().indexOf('pobox') > -1 || officeBillingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					$scope.poBoxMessage = "Invalid Office's Billing Address field.<br>";
					isExist = true;

				}
			}

			if (officeShippingAddress !== undefined) {
				if (officeShippingAddress.toLowerCase().indexOf('pobox') > -1 || officeShippingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					$scope.poBoxMessage += "Invalid Office's Shipping Address field.<br>";
					isExist = true;

				}
			}

			if (efinOwnerBillingAddress !== undefined) {
				if (efinOwnerBillingAddress.toLowerCase().indexOf('pobox') > -1 || efinOwnerBillingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					$scope.poBoxMessage += "Invalid Efin Owner's Billing Address field.<br>";
					isExist = true;

				}
			}

			if (efinOwnerShippingAddress !== undefined) {
				if (efinOwnerShippingAddress.toLowerCase().indexOf('pobox') > -1 || efinOwnerShippingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					$scope.poBoxMessage += "Invalid Efin Owner's Shipping Address field.<br>";
					isExist = true;

				}
			}

			if (ownerBillingAddress !== undefined) {
				if (ownerBillingAddress.toLowerCase().indexOf('pobox') > -1 || ownerBillingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					$scope.poBoxMessage += "Invalid Owner's Billing Address field.<br>";
					isExist = true;

				}
			}

			if (ownerShippingAddress !== undefined) {
				if (ownerShippingAddress.toLowerCase().indexOf('pobox') > -1 || ownerShippingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					$scope.poBoxMessage += "Invalid Owner's Shipping Address field.<br>";
					isExist = true;

				}
			}

			if(isExist){
				return true
			}

			return false;
		}


		/**
		 * This function add transmitter fee agreement time stamp in 
		 * eps program
		 */
		$scope.addAddOnTransmitterFeeAgreementTS = function () {
			if ($scope.tpgProgram.addOnTransmitterFeeAgreement == true) {
				$scope.tpgProgram.addOnTransmitterFeeAgreementTS = moment(new Date());
			}
		}


		/**
		 * Method prepared to check program type and disbursment method
		 * are valid for particular state or not
		 * 
		 * @return {boolean} true or false
		 */
		$scope.checkForSpeacialState = function (expr) {

			if (//check if billing address contains any of special state
				(!_.isUndefined($scope.office.billingAddress) && !_.isUndefined($scope.office.billingAddress.state)
					&& $scope.speacialState.indexOf($scope.office.billingAddress.state.toUpperCase()) > -1)
				//check if shipping address contains any of special state
				|| (!_.isUndefined($scope.office.shippingAddress) && !_.isUndefined($scope.office.shippingAddress.state)
					&& $scope.speacialState.indexOf($scope.office.shippingAddress.state.toUpperCase()) > -1)) {
				isSpeacialState = true;
			} else {
				isSpeacialState = false;

			}
			// Chech office and efin owner address are not defined
			if (isSpeacialState) {

				switch (expr) {
					// if user has entered add on transmitter fee more then zero
					case 'addOnTransmitterFee':
						if ($scope.tpgProgram.addOnTransmitterFee > 0) {
							return true;
						} else {
							return false;
						}
					// if user has entered service bureue fee more then zero
					case 'serviceBureauFee':
						if ($scope.tpgProgram.serviceBureauFee > 0) {
							return true;
						} else {
							return false;
						}

				}
			}
		}

		/**
		 *  Method prepared to validate the consent element
		*/
		var checkConsent = function () {
			// if addOn transmitter fee is less then 0 and addOn transmitter agreement is false then
			// disable save button
			if ($scope.hasFeature('AddOnTransmitterFeeConsent') && !_.isUndefined($scope.tpgProgram.addOnTransmitterFee) && $scope.tpgProgram.addOnTransmitterFee > 0) {
				if ($scope.tpgProgram.addOnTransmitterFeeAgreement == false) {
					return true;
				}
			}
			if ($scope.tpgProgram.documentPrepFee != undefined && $scope.tpgProgram.documentPrepFee > 0 && $scope.tpgProgram.documentPrepFeeAgreement != true) {
				return true;
			}
		}

		// Method to be called on owner EIN to check whether SSN and EIN number match or not 
		$scope.matchSsnEinNumber = function () {
			// Condition to check ssn and ein defined or not
			if (!_.isUndefined($scope.owner.ssn) && !_.isUndefined($scope.owner.efinOwnerEin)) {
				// variable to store the owner ssn
				var _ownerSsn = $scope.owner.ssn;
				// condition to check ssn length equals to 11 and index of hyphen(‐) greater than 0
				if (_ownerSsn.length == 11 && $scope.owner.ssn.indexOf("-") > 0) {
					// remove hyphen(‐) from ssn
					_ownerSsn = _ownerSsn.replace(/-/g, ''); // SSN
				}
				// condition to check whether ssn and ein equals or not
				if (_ownerSsn == $scope.owner.efinOwnerEin) {
					$scope.ssnEinMatched = true;
				} else {
					$scope.ssnEinMatched = false;
				}
			} else {
				$scope.ssnEinMatched = false;
			}
		};
		// Match Function - End

		// this function call get bank data on bank/open API	
		initListBankTPG();
	}]);

//TPG Bank Factory - Start
tpgApp.factory('tpgService', ['$q', '$log', '$http', 'dataAPI', function ($q, $log, $http, dataAPI) {
	var tpgService = {};

	var _oldAndNewValueMap = {
		"owner": [
			{
				"propName": "sex",
				"values": [{ "oldValue": 1, "newValue": "1" }, { "oldValue": 2, "newValue": "2" }, { "oldValue": 3, "newValue": "3" }]
			}
		],
		"efinOwner": [
			{
				"propName": "sex",
				"values": [{ "oldValue": 1, "newValue": "1" }, { "oldValue": 2, "newValue": "2" }, { "oldValue": 3, "newValue": "3" }]
			}
		],
		"bank": [
			{
				"propName": "accountType",
				"values": [{ "oldValue": "C", "newValue": "C" }, { "oldValue": "S", "newValue": "S" }]
			}
		]
	}

	/* to get the old value and new value map object*/
	tpgService.getMapObject = function () {
		return _oldAndNewValueMap;
	};

	/* to create New TPG */
	tpgService.createTPG = function (data) {
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

	/* to update TPG*/
	tpgService.saveTPG = function (data) {
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

	/* the below method is work for open screen get TPG details*/
	tpgService.getTPG = function () {
		var deferred = $q.defer();
		//load list from data api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/open',
			data: {
				bankType: 'TPG'
			}
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	return tpgService;
}]);
//TPG Factory - End
