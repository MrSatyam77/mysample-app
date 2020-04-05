'use strict';

var epsApp = angular.module('epsApp', []);

epsApp.controller('epsController', ['$scope', '$log', '$location', '$timeout', '$injector', '$window', 'messageService', 'userService', 'epsService', 'passwordStrengthService', 'dialogService', 'subscriptionService', 'resellerService', 'dataAPI', 'localeService', 'environment',
	function ($scope, $log, $location, $timeout, $injector, $window, messageService, userService, epsService, passwordStrengthService, dialogService, subscriptionService, resellerService, dataAPI, localeService, environment) {

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
		$scope.isDemoUser = userDetails.isDemoUser;

		if (subscriptionType == 'FREE' && userDetails.isDemoUser != true) {
			$location.path('/alert/licenseInfo');
			//First Arg = dialog type, Second Arg - dialog Configuration, Third Arg - html template, Fourth Arg - controller			  
			// var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/return/workspace/partials/subscriptionDialog.html", "subscriptionDialogController", { "bankProducts": true });
			// dialog.result.then(function (btn) {
			// 	subscriptionService.goToSubscription(masterLocationDetails.customerNumber);
			// }, function (btn) {
			// 	$location.path('/home');
			// });
		}

		//get current taxYear
		$scope.taxYear = userService.getTaxYear();

		// Speacial state configuration
		$scope.speacialState = [];


		// set by default first tab is true
		$scope.activeTab = {};
		$scope.activeTab.epsProgramTab = true;
		if ($scope.taxYear != '2014') {
			//array object declare which contains the mapping of next and previous view for the steps of conversion for 2015
			$scope.nextAndPrevViewMap = [
				{ "view": "epsProgramTab", "next": "proHistoryTab", "previous": "", "currentView": true, "formName": "epsprogramTabForm" },
				{ "view": "proHistoryTab", "next": "officeTab", "previous": "epsProgramTab", "currentView": false, "formName": "bankProductHistoryTabForm" },
				{ "view": "officeTab", "next": "efinOwnerTab", "previous": "proHistoryTab", "currentView": false, "formName": "officeTabForm" },
				{ "view": "efinOwnerTab", "next": "businessOwnerTab", "previous": "officeTab", "currentView": false, "formName": "efinOwnerTabForm" },
				{ "view": "businessOwnerTab", "next": "controlPersonTab", "previous": "efinOwnerTab", "currentView": false, "formName": "businessOwnerTabForm" },
				{ "view": "controlPersonTab", "next": "bankTab", "previous": "businessOwnerTab", "currentView": false, "formName": "controlPersonTabForm" },
				{ "view": "bankTab", "next": "shipMailTab", "previous": "businessOwnerTab", "currentView": false, "formName": "bankTabForm" },
				{ "view": "shipMailTab", "next": "userSetupTab", "previous": "bankTab", "currentView": false, "formName": "shippingMailingTabForm" },
				{ "view": "userSetupTab", "next": "consentTab", "previous": "shipMailTab", "currentView": false, "formName": "userSetupTabForm" },
				{ "view": "consentTab", "next": "", "previous": "userSetupTab", "currentView": false, "formName": "consentTabForm" }
			];
		} else if ($scope.taxYear == '2014') {
			//array object declare which contains the mapping of next and previous view for the steps of conversion for 2014
			$scope.nextAndPrevViewMap = [
				{ "view": "epsProgramTab", "next": "proHistoryTab", "previous": "", "currentView": true, "formName": "epsprogramTabForm" },
				{ "view": "proHistoryTab", "next": "officeTab", "previous": "epsProgramTab", "currentView": false, "formName": "bankProductHistoryTabForm" },
				{ "view": "officeTab", "next": "ownerTab", "previous": "proHistoryTab", "currentView": false, "formName": "officeTabForm" },
				{ "view": "ownerTab", "next": "bankTab", "previous": "officeTab", "currentView": false, "formName": "ownerTabForm" },
				{ "view": "bankTab", "next": "shipMailTab", "previous": "ownerTab", "currentView": false, "formName": "bankTabForm" },
				{ "view": "shipMailTab", "next": "userSetupTab", "previous": "bankTab", "currentView": false, "formName": "shippingMailingTabForm" },
				{ "view": "userSetupTab", "next": "", "previous": "shipMailTab", "currentView": false, "formName": "userSetupTabForm" }
			];
		}

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
		// this array for Owner tab Transmitter Used Last Year field  values.
		$scope.transmitterUsedLastYear = [{
			dispalyText: "ATX",
			value: "ATX"
		}, {
			dispalyText: "CCH",
			value: "CCH"
		}, {
			dispalyText: "Drake",
			value: "Drake"
		}, {
			dispalyText: "FileYourTaxes.com",
			value: "FileYourTaxesDotCom"
		}, {
			dispalyText: "HR Block",
			value: "HRBlock"
		}, {
			dispalyText: "Jackson Hewitt",
			value: "JacksonHewitt"
		}, {
			dispalyText: "N/A",
			value: "NotAvailable"
		}, {
			dispalyText: "OLTPro",
			value: "OLTPro"
		}, {
			dispalyText: "Other",
			value: "Other"
		}, {
			dispalyText: "Petz/Crosslink",
			value: "PetzCrosslink"
		}, {
			dispalyText: "ProTaxPro",
			value: "ProTaxPro"
		}, {
			dispalyText: "QrTaxPro",
			value: "QrTaxPro"
		}, {
			dispalyText: "RCSTaxslayer",
			value: "RCSTaxslayer"
		}, {
			dispalyText: "TaxSimple",
			value: "TaxSimple"
		}, {
			dispalyText: "TaxAct",
			value: "TaxAct"
		}, {
			dispalyText: "TaxSoftware.com",
			value: "TaxSoftwareDotCom"
		}, {
			dispalyText: "UTS/Taxwise",
			value: "UTSTaxwise"
		}, {
			dispalyText: "MyTaxPrepOffice",
			value: "MyTaxPrepOffice"
		}, {
			dispalyText: "TaxWare",
			value: "TaxWare"
		}, {
			dispalyText: "Intuit",
			value: "Intuit"
		}];

		if ($scope.taxYear == '2017') {
			var lastDate = new Date('04/16/2018');
			if (new Date() > lastDate) {
				$scope.isClosedEnrollmentFor2017 = true;
			}
		}
		if($scope.taxYear == '2018'){
			var lastDate = new Date('05/09/2019');
			if (new Date() > lastDate) {
				$scope.isClosedEnrollmentFor2018 = true;
			}
		}

		//this condition check  all object is defined or not
		if ($scope.taxYear == '2014') {
			if (_.isUndefined($scope.owner)) {
				$scope.owner = {};
			}
		} else {
			if (_.isUndefined($scope.efinOwner)) {
				$scope.efinOwner = { salutation: "", mi: "", cellPhone: "", ptin: "", issueDate: "", idIssueLocation: "" };
			}
			if (_.isUndefined($scope.businessOwner)) {
				$scope.businessOwner = { salutation: "", mi: "", cellPhone: "", ptin: "", issueDate: "", idIssueLocation: "", address: { country: 'US' } };
			}
			if (_.isUndefined($scope.consent)) {
				$scope.consent = {};
			}
			if (_.isUndefined($scope.controlPerson)) {
				$scope.controlPerson = { address: { country: 'US' } };
			}
		}
		if (_.isUndefined($scope.shippingAndMailing)) {
			$scope.taxYear == '2015' ? $scope.shippingAndMailing = { supplyAddress: { address2: "" }, mailingAddress: { address2: "" } } : $scope.shippingAndMailing = {};
			parseInt($scope.taxYear) >= 2016 ? $scope.shippingAndMailing = { supplyAddress: { address2: "" }, mailingAddress: { address2: "" }, shipTo: "", mailTo: "" } : $scope.shippingAndMailing = {};

		}
		if (_.isUndefined($scope.office)) {
			$scope.taxYear == '2015' ? $scope.office = { salutation: "", addOnFee: "", alternatePhone: "", fax: "", webSite: "" } : $scope.office = {};
			parseInt($scope.taxYear) >= 2016 ? $scope.office = { salutation: "", totalPriorYearPrepFeeAmountPaid: 0, alternatePhone: "", fax: "", webSite: "" } : $scope.office = {};
		}
		if (_.isUndefined($scope.userSetUp)) {
			$scope.userSetUp = {};
		}
		if (_.isUndefined($scope.bank)) {
			$scope.bank = {};
		}
		if (_.isUndefined($scope.epsProgram)) {
			$scope.taxYear == '2015' ? $scope.epsProgram = { checks: "N", cards: "N", directToCash: "N", serviceBureauFee: 0, protectionPlusAddOnFee: "0.00", parentEfin: "" } : $scope.epsProgram = {};
			parseInt($scope.taxYear) >= 2016 ? $scope.epsProgram = { checks: "N", cards: "N", directToCash: "N", loanIndicator: "N", serviceBureauFee: 0, protectionPlusAddOnFee: "0.00", parentEfin: "", recordSubType: "N", addOnTransmitterFee: "0", addOnTransmitterFeeAgreement: false } : $scope.epsProgram = {};
		}
		if (_.isUndefined($scope.epsForm)) {
			$scope.epsForm = {};
		}
		if (_.isUndefined($scope.bankProductHistory)) {
			$scope.taxYear == '2015' ? $scope.bankProductHistory = { PriorBankVolumeSource: 2, PriorReturnVolumeSource: 2 } : $scope.bankProductHistory = {};
			parseInt($scope.taxYear) >= 2016 ? $scope.bankProductHistory = { priorBankVolumeSource: "ERO", priorReturnVolumeSource: "ERO", numberOfERCsERDsLastYear: 0, newToTransmitter: "N", priorEFIN: "", fundingRatio: 0 } : $scope.bankProductHistory = {};
		}

		$scope.office.taxIdType = 'EIN'; //set default tax type ein selected
		$scope.taxIdTypeMask = '99-9999999'; //set default mask id as ein
		//set text mask based on selected type
		$scope.setTaskMask = function () {
			if ($scope.office.taxIdType === 'EIN') {
				$scope.taxIdTypeMask = '99-9999999';
			}
			else if ($scope.office.taxIdType === 'SSN') {
				$scope.taxIdTypeMask = '999-99-9999';
			}
		};

		// variable declare which contain response code, type and message 
		var codeList = {
			"In Process": { type: 'warning', message: "You can not resubmit enrollment details as your enrollment is in process." },
			"Pending": { type: 'warning', message: "Your enrollment is pending from EPS." },
			"Enrolled": { type: 'success', message: "You are enrolled with EPS." },
			"Rejected": { type: 'warning', message: "Your enrollment has been rejected by EPS."},
			"Suspended": { type: 'warning', message: "Your enrollment has been suspended by EPS."},
			"Declined": { type: 'warning', message: "Your enrollment has been declined by EPS."},
			"Withdrawn": { type: 'warning', message: "Your enrollment has been Withdrawn by EPS."}
		};

		// this function call in page load time , check user make bank or edit bank 
		$scope.initListBankEPS = function () {
			$scope.formName = _getFormName();
			epsService.getEPS().then(function (response) {
				if (_.isUndefined($scope.bankEPSList)) {
					$scope.bankEPSList = {};
				}
				if(_.isEmpty(response.enrollmentData)){
					$scope.epsProgram.efin = angular.copy(userService.getLocationData()['efin']);
				}
				if(!_.isUndefined(response.checkStatus) && parseInt($scope.taxYear) >= 2018){
					if(response.checkStatus == "Rejected" || response.checkStatus == "Declined" || response.checkStatus == "Suspended" || response.checkStatus == "Not Enrolled" || response.checkStatus == "Withdrawn"){
						$scope.isAllowedEnrollment  = true; 
					}else{
						$scope.isAllowedEnrollment  = false;
						localeService.translate("Your Refund Advantage Enrollment status is " + response.checkStatus + ', your EPS ERO Enrollment Application cannot be completed. You will need to choose one provider (Refund Advantage or EPS) to be your default bank for processing Financial  Products for Tax Year ' + $scope.taxYear+ '.'  , 'ENROLLMENT_WARNING_ERROR').then(function (translatedText) {
							var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class displaytext' };
							dialogService.openDialog("notify", dialogConfiguration, translatedText);
						});
					}
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
			if (!_.isEmpty(bankEPSList) && JSON.stringify(bankEPSList.epsProgram) == JSON.stringify($scope.epsProgram) &&
				JSON.stringify(bankEPSList.office) == JSON.stringify($scope.office) &&
				JSON.stringify(bankEPSList.businessOwner) == JSON.stringify($scope.businessOwner) &&
				JSON.stringify(bankEPSList.efinOwner) == JSON.stringify($scope.efinOwner) &&
				JSON.stringify(bankEPSList.bankProductHistory) == JSON.stringify($scope.bankProductHistory) &&
				JSON.stringify(bankEPSList.userSetUp) == JSON.stringify($scope.userSetUp) &&
				JSON.stringify(bankEPSList.bank) == JSON.stringify($scope.bank) &&
				JSON.stringify(bankEPSList.shippingAndMailing) == JSON.stringify($scope.shippingAndMailing) &&
				JSON.stringify(bankEPSList.controlPerson) == JSON.stringify($scope.controlPerson) &&
				JSON.stringify(bankEPSList.consent) == JSON.stringify($scope.consent)) {
				return true;
			} else {
				return false;
			}
		}


		//compare date with future date
		//compare date with future date
		$scope.compareDate = function (date, field) {
			var copyObject = date;
			var todaysDate = new Date();
			var inputDate = new Date(copyObject);
			$scope.isAnyDateInvalid = false;
			if (inputDate > todaysDate) {
				if(field == 'EFIN Owner Expiration Date.'){
					$scope.FutureDateMsgEFINOwner = "";
				}else if(field == 'Business Owner Expiration Date.'){
					$scope.FutureDateMsgBusinessOwner = "";
				}else if(field == 'Control Person Expiration Date.'){
					$scope.FutureDateMsgControlPerson= "";
				}
			} else {
				if(field == 'EFIN Owner Expiration Date.'){
					$scope.FutureDateMsgEFINOwner = "Please enter future date in " + field;
					$scope.isAnyDateInvalid = true;
				}else if(field == 'Business Owner Expiration Date.'){
					$scope.FutureDateMsgBusinessOwner = "Please enter future date in " + field;
					$scope.isAnyDateInvalid = true;
				}else if(field == 'Control Person Expiration Date.'){
					$scope.FutureDateMsgControlPerson= "Please enter future date in " + field;
					$scope.isAnyDateInvalid = true;
				}
			}
		}

		//this function call Display all data in UI 
		$scope.displayEPSBankData = function (epsBankData, isNewEnrollment) {
			// this condition check epsForm object defined or no.

			// all scope object assign values getting by bank/open API
			if (!_.isUndefined(epsBankData.epsProgram)) {
				$scope.epsProgram = epsBankData.epsProgram;
				if (!_.isEmpty(epsBankData.epsProgram.serviceBureauFee)) {
					$scope.epsProgram.serviceBureauFee = parseFloat(epsBankData.epsProgram.serviceBureauFee);
				}
				if (!_.isEmpty(epsBankData.epsProgram.transmitterFee)) {
					$scope.epsProgram.transmitterFee = parseFloat(epsBankData.epsProgram.transmitterFee);
				}

				if ($scope.epsProgram.wantOfferProtectionPlus == 'N' || $scope.epsProgram.wantOfferProtectionPlus == false) {
					$scope.taxYear != '2014' ? $scope.epsProgram.protectionPlusAddOnFee = "0.00" : $scope.epsProgram.protectionPlusAddOnFee = 0;
				}
			}
			// addon transmitter fee and service bureaue fee are undefined then set it to false
			// so that can showed as required
			if (_.isUndefined(epsBankData.epsProgram.addOnTransmitterFeeAgreement)) {
				$scope.epsProgram.addOnTransmitterFeeAgreement = false;
			}
			if (!_.isUndefined(epsBankData.bankProductHistory)) {
				$scope.bankProductHistory = epsBankData.bankProductHistory;
				if (!_.isEmpty(epsBankData.bankProductHistory.yearsDoingBankProducts)) {
					$scope.bankProductHistory.yearsDoingBankProducts = parseFloat(epsBankData.bankProductHistory.yearsDoingBankProducts);
				}
				if (!_.isEmpty(epsBankData.bankProductHistory.yearsDoingEFile)) {
					$scope.bankProductHistory.yearsDoingEFile = parseFloat(epsBankData.bankProductHistory.yearsDoingEFile);
				}
				if (!_.isEmpty(epsBankData.bankProductHistory.fundingRatio)) {
					$scope.bankProductHistory.fundingRatio = parseFloat(epsBankData.bankProductHistory.fundingRatio);
				}
				if (!_.isEmpty(epsBankData.bankProductHistory.numOfTaxReturnsLastYear)) {
					$scope.bankProductHistory.numOfTaxReturnsLastYear = parseFloat(epsBankData.bankProductHistory.numOfTaxReturnsLastYear);
				}
				if (!_.isEmpty(epsBankData.bankProductHistory.projectedNumofBankProducts)) {
					$scope.bankProductHistory.projectedNumofBankProducts = parseFloat(epsBankData.bankProductHistory.projectedNumofBankProducts);
				}
				if (!_.isEmpty(epsBankData.bankProductHistory.numberOfERCsERDsLastYear)) {
					$scope.bankProductHistory.numberOfERCsERDsLastYear = parseFloat(epsBankData.bankProductHistory.numberOfERCsERDsLastYear);
				}

				if ($scope.taxYear == '2015') {
					$scope.bankProductHistory.priorBankVolumeSource = 2;
					$scope.bankProductHistory.priorReturnVolumeSource = 2;
				} else if (parseInt($scope.taxYear) >= 2016) {
					$scope.bankProductHistory.priorBankVolumeSource = "ERO";
					$scope.bankProductHistory.priorReturnVolumeSource = "ERO";
				}
			}
			if ($scope.taxYear == '2014') {
				if (!_.isUndefined(epsBankData.owner)) {
					$scope.owner = epsBankData.owner;
				}
			} else {
				// condition to check epsBankData.owner is not undefined and epsBankData.efinOwner is undefined
				if (!_.isUndefined(epsBankData.owner) && _.isUndefined(epsBankData.efinOwner)) {
					$scope.efinOwner = epsBankData.owner;
				}
				// condition to check epsBankData.owner is undefined and epsBankData.efinOwner is not undefined
				else if (_.isUndefined(epsBankData.owner) && !_.isUndefined(epsBankData.efinOwner)) {
					$scope.efinOwner = epsBankData.efinOwner;
					//correct date format because it is updated by bank enrollment response
					if(!_.isEmpty($scope.efinOwner.expirationDate)){
						$scope.efinOwner.expirationDate = moment($scope.efinOwner.expirationDate).format('MM/DD/YYYY')
					}
					if(!_.isEmpty($scope.efinOwner.dateOfBirth)){
						$scope.efinOwner.dateOfBirth = moment($scope.efinOwner.dateOfBirth).format('MM/DD/YYYY')
					}
				}
				if (!_.isUndefined(epsBankData.businessOwner)) {
					$scope.businessOwner = epsBankData.businessOwner;
					$scope.businessOwner.businessOwnerPercentOwnership = parseFloat(epsBankData.businessOwner.businessOwnerPercentOwnership);
					//correct date format because it is updated by bank enrollment response
					if(!_.isEmpty($scope.businessOwner.dateOfBirth)){
						$scope.businessOwner.dateOfBirth = moment($scope.businessOwner.dateOfBirth).format('MM/DD/YYYY')
					}
					if(!_.isEmpty($scope.businessOwner.expirationDate)){
						$scope.businessOwner.expirationDate = moment($scope.businessOwner.expirationDate).format('MM/DD/YYYY')
					}
				}
				if (!_.isUndefined(epsBankData.consent)) {
					$scope.consent = epsBankData.consent;
				}
			}

			if (!_.isUndefined(epsBankData.bank)) {
				$scope.bank = epsBankData.bank;
				$scope.epsForm.confiRoutingNumber = epsBankData.bank.routingNumber;
				$scope.epsForm.confiAccouuntNumber = epsBankData.bank.accountNumber;
				// this condition check csAccount type is 'c' or 's'. 'c' is true  and 's' is false;  
				if ($scope.taxYear == '2014') {
					if (epsBankData.bank.csAccountType == 'c') {
						$scope.epsForm.csAccountType = true;
					}
					else if (epsBankData.bank.csAccountType == 's') {
						$scope.epsForm.csAccountType = false;
					}
					// this condition check csAccount type is 'p' or 'b'. 'p' is true  and 'b' is false;
					if (epsBankData.bank.pbAccountType == 'p') {
						$scope.epsForm.pbAccountType = true;
					} else if (epsBankData.bank.pbAccountType == 'b') {
						$scope.epsForm.pbAccountType = false;
					}
				}
			}
			if (!_.isUndefined(epsBankData.shippingAndMailing)) {
				$scope.shippingAndMailing = epsBankData.shippingAndMailing;
				//assigning the default value to address2 property of supply and mailing address
				$scope.shippingAndMailing.supplyAddress.address2 = (_.isUndefined($scope.shippingAndMailing.supplyAddress.address2) || _.isNull($scope.shippingAndMailing.supplyAddress.address2)) ? "" : $scope.shippingAndMailing.supplyAddress.address2;
				$scope.shippingAndMailing.mailingAddress.address2 = (_.isUndefined($scope.shippingAndMailing.mailingAddress.address2) || _.isNull($scope.shippingAndMailing.mailingAddress.address2)) ? "" : $scope.shippingAndMailing.mailingAddress.address2;
			}
			if (!_.isUndefined(epsBankData.userSetUp)) {
				$scope.userSetUp = epsBankData.userSetUp;
				$scope.epsForm.confirmPass = epsBankData.userSetUp.password;
			}
			if (!_.isUndefined(epsBankData.office)) {
				$scope.office = epsBankData.office;
				if (!_.isEmpty(epsBankData.office.numberOfPrincipals)) {
					$scope.office.numberOfPrincipals = parseFloat(epsBankData.office.numberOfPrincipals);
				}
				if (!_.isEmpty(epsBankData.office.totalPriorYearPrepFeeAmountPaid)) {
					$scope.office.totalPriorYearPrepFeeAmountPaid = parseFloat(epsBankData.office.totalPriorYearPrepFeeAmountPaid);
				}
				if (!_.isEmpty(epsBankData.office.numberOfPersonnelInOffice)) {
					$scope.office.numberOfPersonnelInOffice = parseFloat(epsBankData.office.numberOfPersonnelInOffice);
				}
				if (!_.isEmpty(epsBankData.office.yearsInBusiness)) {
					$scope.office.yearsInBusiness = parseFloat(epsBankData.office.yearsInBusiness);
				}
				if (!_.isEmpty(epsBankData.office.yearsAtCurrentAddress)) {
					$scope.office.yearsAtCurrentAddress = parseFloat(epsBankData.office.yearsAtCurrentAddress);
				}
			}
			if (!_.isUndefined(epsBankData.controlPerson)) {
				$scope.controlPerson = epsBankData.controlPerson;
				if(!_.isEmpty($scope.controlPerson.dateOfBirth)){
					$scope.controlPerson.dateOfBirth = moment($scope.controlPerson.dateOfBirth).format('MM/DD/YYYY')
				}
				if(!_.isEmpty($scope.controlPerson.expirationDate)){
					$scope.controlPerson.expirationDate = moment($scope.controlPerson.expirationDate).format('MM/DD/YYYY')
				}

			}
			$scope.setTaskMask();

			// condition to check newEnrollment equals to true and epsBankData not empty and the taxYear is equal to 2015 
			if (isNewEnrollment == true && !_.isEmpty(epsBankData) && $scope.taxYear != '2014') {
				// function call to update the values of tab
				_updateMapValue();
			}
			$scope.compareDate($scope.efinOwner.expirationDate, "EFIN Owner Expiration Date.")
			$scope.compareDate($scope.businessOwner.expirationDate, "Business Owner Expiration Date.")
			$scope.compareDate($scope.controlPerson.expirationDate, "Control Person Expiration Date.")
		};

		/**
		 * method update the 2014 year oldValue to 2015 year newValue
		 * */
		var _updateMapValue = function () {
			// local variable to get the old and new value of Object
			var _mappedObject = epsService.getMapObject();
			// loop over object receive from the service
			_.forEach(_mappedObject, function (obj, key) {
				// loop over tab properties whose mapping is done
				_.forEach(obj, function (prop) {
					//condition that will look for the property in the object if undefined than we will assign it the default value
					//Note :- we have to do this thing as if user fills only required field than we have to send the other property with its default value which are not required
					if (_.isUndefined($scope[key][prop.propName]) || prop.propName == 'idIssueLocation') {
						// give default value 
						$scope[key][prop.propName] = prop.defaultValue;
					}
					//condition that checks if the current property holds the old new value array
					else if (!_.isUndefined(prop.values)) {
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

		//validate forms before saving data. Decision making function
		$scope.validateFormToSave = function (form) {
			//validate all forms
			if (!_.isUndefined(form) && (form.epsprogramTabForm.$invalid == true || form.bankProductHistoryTabForm.$invalid == true || form.officeTabForm.$invalid == true || form.efinOwnerTabForm.$invalid == true || form.businessOwnerTabForm.$invalid == true || form.bankTabForm.$invalid == true || form.shippingMailingTabForm.$invalid == true || form.userSetupTabForm.$invalid == true || form.consentTabForm.$invalid == true || form.controlPersonTabForm.$invalid == true || checkConsent())) {
				//open dialog if any form is invalid
				localeService.translate("Please review each of the ERO Enrollment Application Tabs, and complete the required fields displayed in red.", 'EPS_FORM_SAVE_ERROR').then(function (translatedText) {
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
				salesDialogService.openSalesDialog("bankEPS");
			} else {
				if (subscriptionType == 'FREE') {
					$location.path('/home');
				}
				if ($scope.taxYear == '2014') {
					// this condition to check  bank account type savings or checking Pass values in APi in c and s 
					if ($scope.epsForm.csAccountType == true) {
						$scope.bank.csAccountType = 'c';
					} else {
						$scope.bank.csAccountType = 's';
					}
					// this condition to check  bank account type personal or business Pass values in APi in p and b
					if ($scope.epsForm.pbAccountType == true) {
						$scope.bank.pbAccountType = 'p';
					} else {
						$scope.bank.pbAccountType = 'b';
					}
				}
				// this condition check EPS Program tab on this 'Do you want to offer protection plus?' is true or false, true than pass original values and false pas blank.  
				if ($scope.taxYear == '2014') {
					if ($scope.epsProgram.wantOfferProtectionPlus == false) {
						$scope.epsProgram.protectionPlusAddOnFee = '';
					}
				}
				//if it available in previous year then make it blank
				if ($scope.taxYear == '2018') {
					$scope.epsProgram.directToCash = undefined;
					$scope.bankProductHistory.numberOfAdvancesLastYear = undefined;
					$scope.bankProductHistory.fundingRatio = undefined;
					$scope.bankProductHistory.numberOfERCsERDsLastYear = undefined;
					$scope.office.totalPriorYearPrepFeeAmountPaid = undefined;
				}

				//add device id
				var fp1 = new Fingerprint({ canvas: true, ie_activex: true, screen_resolution: true });
				var deviceId = CryptoJS.SHA1(fp1.get()).toString();
				$scope.epsProgram.deviceId = deviceId;

				var data;
				if ($scope.taxYear == '2014') {
					data = {
						epsProgram: $scope.epsProgram,
						office: $scope.office,
						bankProductHistory: $scope.bankProductHistory,
						owner: $scope.owner,
						bank: $scope.bank,
						shippingAndMailing: $scope.shippingAndMailing,
						userSetUp: $scope.userSetUp,
						bankType: 'EPS'
					};
				} else {
					// local variable to get the old and new value of Object
					var _mappedOldNewValue = epsService.getMapObject();
					// loop over object receive from the service
					_.forEach(_mappedOldNewValue, function (obj, key) {
						// loop over tab properties whose mapping is done
						_.forEach(obj, function (prop) {
							//condition that will look for the property in the object if undefined than we will assign it the default value
							//Note :- we have to do this thing as if user fills only required field than we have to send the other property with its default value which are not required
							if (_.isUndefined($scope[key][prop.propName]) || _.isNull($scope[key][prop.propName])) {
								// give default value 
								$scope[key][prop.propName] = prop.defaultValue;
							}
						});
					});

					// parseFloat is used for convert the "01" to "1" and toFixed(2) is used for add the two decimal digit to the number 
					$scope.epsProgram.protectionPlusAddOnFee = (!_.isUndefined($scope.epsProgram.protectionPlusAddOnFee) && !_.isNull($scope.epsProgram.protectionPlusAddOnFee)) ? '' + parseFloat($scope.epsProgram.protectionPlusAddOnFee).toFixed(2) : "0.00";
					$scope.office.addOnFee = (!_.isUndefined($scope.office.addOnFee) && !_.isEmpty($scope.office.addOnFee) && !_.isNull($scope.office.addOnFee)) ? '' + parseFloat($scope.office.addOnFee).toFixed(2) : "";
					if (_.isEmpty($scope.bankProductHistory.fundingRatio)) {
						$scope.bankProductHistory.fundingRatio = 0;
					}
					//assigning the default value to address2 property of supply and mailing address 
					$scope.shippingAndMailing.supplyAddress.address2 = (_.isUndefined($scope.shippingAndMailing.supplyAddress.address2) || _.isNull($scope.shippingAndMailing.supplyAddress.address2)) ? "" : $scope.shippingAndMailing.supplyAddress.address2;
					$scope.shippingAndMailing.mailingAddress.address2 = (_.isUndefined($scope.shippingAndMailing.mailingAddress.address2) || _.isNull($scope.shippingAndMailing.mailingAddress.address2)) ? "" : $scope.shippingAndMailing.mailingAddress.address2;
					data = {
						epsProgram: $scope.epsProgram,
						office: $scope.office,
						bankProductHistory: $scope.bankProductHistory,
						efinOwner: $scope.efinOwner,
						businessOwner: $scope.businessOwner,
						controlPerson: $scope.controlPerson,
						bank: $scope.bank,
						shippingAndMailing: $scope.shippingAndMailing,
						userSetUp: $scope.userSetUp,
						consent: $scope.consent,
						isSpeacialState: isSpeacialState,
						bankType: 'EPS'
					};
				}

				//this condition to check user data update or new create  
				if ($scope.mode === 'create') {
					//Create EPS 
					epsService.createEPS(data).then(function (success) {
						messageService.showMessage('Save successfully', 'success', 'BANK_CREATESUCCESS_MSG');
						//after success we just redirect to home screen
						$location.path('/home');
					}, function (error) {
					});
				} else if ($scope.mode === 'update') {
					if ($scope.bankEPSList.status == "Enrolled") {
						// Dialog used for the confirmation from user to Delete or not the selected user.
						var dialogConfiguration = {
							'keyboard': false,
							'backdrop': false,
							'size': 'md',
							'windowClass': 'my-class'
						};
						localeService.translate('You are already enrolled with EPS. if you save changes then your status change back to In Process.Do you want to save ?', 'USER_DOYOUDELETETHISUSER_DIALOG_MESSAGE').then(function (translateText) {
							var dialog = dialogService.openDialog("confirm", dialogConfiguration, {
								text: translateText
							});
							dialog.result.then(function (btn) {
								epsService.saveEPS(data).then(function (success) {
									messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
									//after success we just redirect to home screen
									$location.path('/home');
								}, function (error) {
								});
							}, function (btn) {

							});
						});
					} else {
						//Save EPS
						epsService.saveEPS(data).then(function (success) {
							messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
							//after success we just redirect to home screen
							$location.path('/home');
						}, function (error) {
						});
					}
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
		 * Method prepared to copy the data from EFIN owner to Business owner
		 * it will be called on the checkbox click event in business owner tab
		 */
		$scope.sameAsEfinOwner = function (type) {
			if (type == 'businessOwner') {
				//condition to check whether checkbox is checked or not
				if ($scope.businessOwner.sameAsEfinOwner == true) {

					var country = '';
					if (!_.isUndefined($scope.businessOwner.address) && !_.isUndefined($scope.businessOwner.address.country)) {
						country = angular.copy($scope.businessOwner.address.country);
					}
					//copy efin owner to business owner
					$scope.businessOwner = angular.copy($scope.efinOwner);
					//we use to omit the email property from business owner as it does not hold email field in its tab
					$scope.businessOwner = _.omit($scope.businessOwner, 'email');
					//we use to omit the address propery is country is not usa
					$scope.businessOwner.address.country = country;
					if ((country !== 'US')) {
						$scope.businessOwner.address.country = country;
						$scope.businessOwner = _.omit($scope.businessOwner, 'address');
						$scope.businessOwner.address = {};
					}
					$scope.businessOwner.address.country = country;
					//we add the checkbox property again to business owner object as we need to keep the track of checkbox value
					$scope.businessOwner.sameAsEfinOwner = true;
				} else {//portion will be executed when check box is de-selected
					//reset business owner object
					$scope.businessOwner = { sameAsEfinOwner: false, address: { country: 'US' } };
				}
			} else if (type == 'controlPerson') {
				//condition to check whether checkbox is checked or not
				if ($scope.controlPerson.sameAsEfinOwner == true) {
					var country = '';
					if (!_.isUndefined($scope.controlPerson.address) && !_.isUndefined($scope.controlPerson.address.country)) {
						country = angular.copy($scope.controlPerson.address.country);
					}
					//copy efin owner to business owner
					$scope.controlPerson = angular.copy($scope.efinOwner);
					//we use to omit the email property from business owner as it does not hold email field in its tab
					$scope.controlPerson = _.omit($scope.controlPerson, 'email');
					//we use to omit the address propery is country is not usa
					$scope.controlPerson.address.country = country;
					if ((country !== 'US')) {
						$scope.controlPerson = _.omit($scope.controlPerson, 'address');
						$scope.controlPerson.address = {};
					}
					$scope.controlPerson.address.country = country;
					//we add the checkbox property again to business owner object as we need to keep the track of checkbox value
					$scope.controlPerson.sameAsEfinOwner = true;
				} else {//portion will be executed when check box is de-selected
					//reset business owner object
					$scope.controlPerson = { sameAsEfinOwner: false, address: { country: 'US' } };
				}
			}
		};

		/**
		 * Method prepared to copy the address(street address, city, state, zip) from Office/BusinessOwner to Mailing address
		 * it will be called on the checkbox click event in shipping and mailing tab
		 */
		$scope.copyToMailingAddress = function () {
			//conditions to check whether Office Address checkbox is checked or Owner Address checkbox is checked
			if (!_.isUndefined($scope.shippingAndMailing.mailingAddress.copiedFrom) && $scope.shippingAndMailing.mailingAddress.copiedFrom.fromOffice == true) {
				//copy office address to mailing address
				$scope.shippingAndMailing.mailingAddress = angular.copy((!_.isUndefined($scope.office.address)) ? $scope.office.address : {});
				//we add the checkbox property again to mailing address object as we need to keep the track of checkbox value
				$scope.shippingAndMailing.mailingAddress.copiedFrom = { fromOffice: true };
			} else if (!_.isUndefined($scope.shippingAndMailing.mailingAddress.copiedFrom) && $scope.shippingAndMailing.mailingAddress.copiedFrom.fromOwner == true) {
				//copy office address to mailing address
				$scope.shippingAndMailing.mailingAddress = angular.copy((!_.isUndefined($scope.businessOwner.address)) ? $scope.businessOwner.address : {});
				//we add the checkbox property again to mailing address object as we need to keep the track of checkbox value
				$scope.shippingAndMailing.mailingAddress.copiedFrom = { fromOwner: true };
			} else {//portion will be executed when none of check box is selected
				//reset shippingAndMailing.mailingAddress object
				$scope.shippingAndMailing.mailingAddress = { copiedFrom: {} };
			}
		};

		/**
		 * Method prepared to copy the address(street address, city, state, zip) from Office/BusinessOwner/MailingAddress to Shipping address
		 * it will be called on the checkbox click event in shipping and mailing tab
		 */
		$scope.copyToShippingAddress = function () {
			//conditions to check whether Office Address checkbox is checked or Owner Address checkbox is checked or Mailing Address checkbox is checked
			if (!_.isUndefined($scope.shippingAndMailing.supplyAddress.copiedFrom) && $scope.shippingAndMailing.supplyAddress.copiedFrom.fromOffice == true) {
				//copy office address to shipping address
				$scope.shippingAndMailing.supplyAddress = angular.copy((!_.isUndefined($scope.office.address)) ? $scope.office.address : {});
				//we add the checkbox property again to mailing address object as we need to keep the track of checkbox value
				$scope.shippingAndMailing.supplyAddress.copiedFrom = { fromOffice: true };
			} else if (!_.isUndefined($scope.shippingAndMailing.supplyAddress.copiedFrom) && $scope.shippingAndMailing.supplyAddress.copiedFrom.fromOwner == true) {
				//copy owner address to shipping address
				$scope.shippingAndMailing.supplyAddress = angular.copy((!_.isUndefined($scope.businessOwner.address)) ? $scope.businessOwner.address : {});
				//we add the checkbox property again to shipping address object as we need to keep the track of checkbox value
				$scope.shippingAndMailing.supplyAddress.copiedFrom = { fromOwner: true };
			} else if (!_.isUndefined($scope.shippingAndMailing.supplyAddress.copiedFrom) && $scope.shippingAndMailing.supplyAddress.copiedFrom.fromMailing == true) {
				//copy mailing address to shipping address
				$scope.shippingAndMailing.supplyAddress = angular.copy((!_.isUndefined($scope.shippingAndMailing.mailingAddress)) ? $scope.shippingAndMailing.mailingAddress : {});
				//we add the checkbox property again to shipping address object as we need to keep the track of checkbox value
				$scope.shippingAndMailing.supplyAddress.copiedFrom = { fromMailing: true };
			} else {//portion will be executed when none of check box is selected
				//reset shippingAndMailing.supplyAddress object
				$scope.shippingAndMailing.supplyAddress = { copiedFrom: {} };
			}
		};

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
		 *  Method prepared to validate the consent tab element
		 * */
		var checkConsent = function () {
			// Condition to check programType2015(e-Collect) value equals to 1 and wantOfferProtectionPlus value equals to Y
			if ($scope.epsProgram.programType2016 == 'eCollect' && $scope.epsProgram.wantOfferProtectionPlus == 'Y') {
				// Condition to check eCollectProgramAgreement value equals to false or protectionPlusUserAgreement value equals to false
				if ($scope.consent.protectionPlusUserAgreement == false) {
					return true;
				}
			}
			// Condition to check programType2015(e-Collect) value equals to 1 and wantOfferProtectionPlus value equals to N
			// else if ($scope.epsProgram.programType2016 == 'eCollect' && $scope.epsProgram.wantOfferProtectionPlus == 'N') {
			// 	// Condition to check eCollectProgramAgreement value equals to false
			// 	if ($scope.consent.eCollectProgramAgreement == false) {
			// 		return true;
			// 	}
			// }
			// Condition to check programType2015(e-Bonus) value equals to 3 and wantOfferProtectionPlus value equals to Y
			else if ($scope.epsProgram.programType2016 == 'eBonus' && $scope.epsProgram.wantOfferProtectionPlus == 'Y') {
				// Condition to check eBonusProgramAgreement value equals to false or protectionPlusUserAgreement value equals to false
				if ($scope.consent.protectionPlusUserAgreement == false) {
					return true;
				}
			}
			// Condition to check programType2015(e-Bonus) value equals to 3 and wantOfferProtectionPlus value equals to N
			// else if ($scope.epsProgram.programType2016 == 'eBonus' && $scope.epsProgram.wantOfferProtectionPlus == 'N') {
			// 	// Condition to check eBonusProgramAgreement value equals to false
			// 	if ($scope.consent.eBonusProgramAgreement == false) {
			// 		return true;
			// 	}
			// }
			// Condition to check programType2015(e-Advance) value equals to 5 for the tax year 2016
			else if ($scope.epsProgram.programType2016 == 'eAdvance' && $scope.epsProgram.wantOfferProtectionPlus == 'Y') {
				// Condition to check eAdvanceProgramAgreement value equls to false
				if ($scope.consent.protectionPlusUserAgreement == false) {
					return true;
				}
			}
			// Condition to check programType2015(e-Bonus) value equals to 3 and wantOfferProtectionPlus value equals to N
			// else if ($scope.epsProgram.programType2016 == 'eAdvance' && $scope.epsProgram.wantOfferProtectionPlus == 'N') {
			// 	// Condition to check eAdvanceProgramAgreement value equls to false
			// 	if ($scope.consent.eAdvanceProgramAgreement == false) {
			// 		return true;
			// 	}
			// }
			// if addOn transmitter fee is less then 0 and addOn transmitter agreement is false then
			// disable save button
			if ($scope.hasFeature('AddOnTransmitterFeeConsent') == true && !_.isUndefined($scope.epsProgram.addOnTransmitterFee) && $scope.epsProgram.addOnTransmitterFee > 0) {
				if ($scope.epsProgram.addOnTransmitterFeeAgreement == false) {
					return true;
				}
			}

			if ($scope.consent.eroProgramAgreement == false) {
				return true;
			}
		};

		/**
		 * This function add transmitter fee agreement time stamp in 
		 * eps program
		 */
		$scope.addAddOnTransmitterFeeAgreementTS = function () {
			if ($scope.epsProgram.addOnTransmitterFeeAgreement == true) {
				$scope.epsProgram.addOnTransmitterFeeAgreementTS = moment(new Date());
			}
		}

		/**
		 * Method prepared to check program type and disbursment method
		 * are valid for particular state or not
		 * 
		 * @return {boolean} true or false
		 */
		$scope.checkForSpeacialState = function (expr) {

			if (//check if office address contains any of special state
				(!_.isUndefined($scope.office.address) && !_.isUndefined($scope.office.address.state)
					&& $scope.speacialState.indexOf($scope.office.address.state.toUpperCase()) > -1)
				//check if owner address contains any of special state
				|| (!_.isUndefined($scope.efinOwner.address) && !_.isUndefined($scope.efinOwner.address.state)
					&& $scope.speacialState.indexOf($scope.efinOwner.address.state.toUpperCase()) > -1)) {
				isSpeacialState = true;
			} else {
				isSpeacialState = false;
			}
			// Chech office and efin owner address are not defined
			if (isSpeacialState) {

				switch (expr) {
					// if user has selected eAdvance program type
					case 'eAdvance':
						if ($scope.epsProgram.programType2016 == 'eAdvance') {
							return true;
						} else {
							return false;
						}

					// if user has selected eCollect program type with loan 
					case 'eCollectLoan':
						if ($scope.epsProgram.programType2016 == 'eCollect' && $scope.epsProgram.loanIndicator == 'Y') {
							return true;
						} else {
							return false;
						}
					// if user has entered add on transmitter fee more then zero
					case 'addOnTransmitterFee':
						if ($scope.epsProgram.addOnTransmitterFee > 0) {
							return true;
						} else {
							return false;
						}
					// if user has entered service bureue fee more then zero
					case 'serviceBureauFee':
						if ($scope.epsProgram.serviceBureauFee > 0) {
							return true;
						} else {
							return false;
						}
				}
			}
		}

		/**
		 * Method prepared to get the URL in order to download the e-collect, e-bonus or protection plus user agreement PDF 
		 * */
		$scope.getUrlToDownloadPdf = function (type) {
			switch (type) {
				case 'AGREEMENT':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Audit_Assistance.pdf';
				case 'E-BONUS':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_e-Bonus.pdf';
				case 'E-COLLECT':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_e-Collect.pdf';
				case 'E-ADVANCE':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_e-Advance.pdf';
				case 'ERO':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_ero.pdf';
				case 'Agreement_ra':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_ra.pdf';
				default:
					return;
			}

		};

		/**
		 * make data blank dependent on office type
		 */
		$scope.checkOfficeTypeData = function () {
			if ($scope.epsProgram.officeType == 'StandAlone') {
				$scope.epsProgram.parentOrSubEfin = undefined;
				$scope.epsProgram.serviceBureauFee = undefined;
				$scope.epsProgram.parentEfin = undefined;
				$scope.epsProgram.parentOfficeOwnerSSN = undefined;
			}
		}

		/**
		 * check address is not po box
		 */
		$scope.checkPOBoxAddress = function () {

			if ($scope.epsProgram.officeType === 'StandAlone' && $scope.shippingAndMailing.location == 'ParentOfficeAddress') {
				$scope.shippingAndMailing.location = undefined;
			}
			var businessOwnerAddress, efinOwnerAddress, controlPersonAddress , officeAddress , mailingAddress, supplyAddress;
			if (!_.isEmpty($scope.efinOwner.address) && !_.isEmpty($scope.efinOwner.address.address)) {
				efinOwnerAddress = $scope.efinOwner.address.address.replace(/ /g, '');
			}
			if (!_.isEmpty($scope.businessOwner.address) && !_.isEmpty($scope.businessOwner.address.address)) {
				businessOwnerAddress = $scope.businessOwner.address.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.controlPerson.address) && !_.isEmpty($scope.controlPerson.address.address)) {
				controlPersonAddress = $scope.controlPerson.address.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.office.address) && !_.isEmpty($scope.office.address.address)) {
			    officeAddress = $scope.office.address.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.shippingAndMailing.mailingAddress) && !_.isEmpty($scope.shippingAndMailing.mailingAddress.address)) {
			    mailingAddress = $scope.shippingAndMailing.mailingAddress.address.replace(/ /g, '');
			}

			if (!_.isEmpty($scope.shippingAndMailing.supplyAddress) && !_.isEmpty($scope.shippingAndMailing.supplyAddress.address)) {
			    supplyAddress = $scope.shippingAndMailing.supplyAddress.address.replace(/ /g, '');
			}

		
			if (businessOwnerAddress !== undefined) {
				if (businessOwnerAddress.toLowerCase().indexOf('pobox') > -1 || businessOwnerAddress.toLowerCase().indexOf('p.o.box') > -1) {
					return true;
				}
			}

			if (efinOwnerAddress !== undefined) {
				if (efinOwnerAddress.toLowerCase().indexOf('pobox') > -1 || efinOwnerAddress.toLowerCase().indexOf('p.o.box') > -1) {
					return true;
				}
			}

			if (controlPersonAddress !== undefined) {
				if (controlPersonAddress.toLowerCase().indexOf('pobox') > -1 || controlPersonAddress.toLowerCase().indexOf('p.o.box') > -1) {
					return true;
				}
			}

			if (officeAddress !== undefined) {
				if (officeAddress.toLowerCase().indexOf('pobox') > -1 || officeAddress.toLowerCase().indexOf('p.o.box') > -1) {
					return true;
				}
			}

			if (mailingAddress !== undefined) {
				if (mailingAddress.toLowerCase().indexOf('pobox') > -1 || mailingAddress.toLowerCase().indexOf('p.o.box') > -1) {
					return true;
				}
			}

			if (supplyAddress !== undefined) {
				if (supplyAddress.toLowerCase().indexOf('pobox') > -1 || supplyAddress.toLowerCase().indexOf('p.o.box') > -1) {
					return true;
				}
			}

			return false;
		}

		// this function call get bank data on bank/open API	
		$scope.initListBankEPS();
	}]);

//EPS Bank Factory - Start
epsApp.factory('epsService', ['$q', '$log', '$http', 'dataAPI', 'userService', function ($q, $log, $http, dataAPI, userService) {
	var epsService = {};

	// variable declare which contains the mapping of old and new value for specific tab
	var _oldAndNewValueMap = {
		"epsProgram": [
			{
				"propName": "wantOfferProtectionPlus",
				"values": [{ "oldValue": true, "newValue": "Y" }, { "oldValue": false, "newValue": "N" }]
			},
			{
				"propName": "officeType",
				"values": [{ "oldValue": "Stand Alone", "newValue": "StandAlone" }, { "oldValue": "Multi-Site", "newValue": "MultiSite" }]
			},
			{ "propName": "checks", "defaultValue": "N" },
			{ "propName": "cards", "defaultValue": "N" },
			{ "propName": "directToCash", "defaultValue": "N" },
			{ "propName": "serviceBureauFee", "defaultValue": 0 },
			{ "propName": "parentEfin", "defaultValue": "" }
		],
		"bankProductHistory": [
			{
				"propName": "previousBank",
				"values": [{ "oldValue": "Non", "newValue": "None" }, { "oldValue": "SBTGP", "newValue": "SBTPG" }]
			},
			{
				"propName": "transmitterUsedLastyear",
				"values": [{ "oldValue": "Creative Solutions", "newValue": "CreativeSolutions" }, { "oldValue": "eFile Interchange/PDI", "newValue": "eFileInterchangePDI" },
				{ "oldValue": "FileYourTaxes.com", "newValue": "FileYourTaxesDotCom" }, { "oldValue": "HR Block", "newValue": "HRBlock" },
				{ "oldValue": "Jackson Hewitt", "newValue": "JacksonHewitt" }, { "oldValue": "Laser Systems", "newValue": "LaserSystems" },
				{ "oldValue": "N/A", "newValue": "NotAvailable" }, { "oldValue": "Nelco/GreatTax", "newValue": "NelcoGreatTax" },
				{ "oldValue": "Petz/Crosslink", "newValue": "PetzCrosslink" }, { "oldValue": "TaxSoftware.com", "newValue": "TaxSoftwareDotCom" },
				{ "oldValue": "UTS/Taxwise", "newValue": "UTSTaxwise" }]
			},
			{
				"propName": "isBankProductRefuced",
				"values": [{ "oldValue": true, "newValue": "Y" }, { "oldValue": false, "newValue": "N" }]
			}
		],
		"office": [
			{
				"propName": "isLocationShared",
				"values": [{ "oldValue": true, "newValue": "Y" }, { "oldValue": false, "newValue": "N" }]
			},
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "addOnFee", "defaultValue": "" },
			{ "propName": "alternatePhone", "defaultValue": "" },
			{ "propName": "fax", "defaultValue": "" },
			{ "propName": "webSite", "defaultValue": "" }
		],
		"efinOwner": [
			{
				"propName": "idType",
				"values": [{ "oldValue": "Chile Cedual ID Card", "newValue": "ChileCedulaIDCard" }, { "oldValue": "Columbian Cedula ID Card", "newValue": "ColumbianCedulaIDCard" },
				{ "oldValue": "Columbian Consular Card", "newValue": "ColumbianConsularCard" }, { "oldValue": "DMV/DVM State ID", "newValue": "DMVDMVStateID" },
				{ "oldValue": "Driver's License Number", "newValue": "DriversLicenseNumber" }, { "oldValue": "EI Salvador UID Card", "newValue": "ElSalvadorDUICard" },
				{ "oldValue": "Foreign Passport", "newValue": "ForeignPassport" }, { "oldValue": "Guatemala Consular ID Card", "newValue": "GuatemalaConsularIDCard" },
				{ "oldValue": "Korean Consular Card", "newValue": "KoreanConsularCard" }, { "oldValue": "Matricula Consular", "newValue": "MatriculaConsular" },
				{ "oldValue": "Military ID", "newValue": "MilitaryID" }, { "oldValue": "Resident Alien ID", "newValue": "ResidentAlienID" },
				{ "oldValue": "US Passport", "newValue": "USPassport" }]
			},
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "mi", "defaultValue": "" },
			{ "propName": "cellPhone", "defaultValue": "" },
			{ "propName": "ptin", "defaultValue": "" },
			{ "propName": "issueDate", "defaultValue": "" },
			{ "propName": "idIssueLocation", "defaultValue": "" }
		],
		"businessOwner": [
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "mi", "defaultValue": "" },
			{ "propName": "cellPhone", "defaultValue": "" },
			{ "propName": "ptin", "defaultValue": "" },
			{ "propName": "issueDate", "defaultValue": "" },
			{ "propName": "idIssueLocation", "defaultValue": "" }
		],
		"bank": [
			{
				"propName": "csAccountType",
				"values": [{ "oldValue": "c", "newValue": "C" }, { "oldValue": "s", "newValue": "S" }]
			},
			{
				"propName": "pbAccountType",
				"values": [{ "oldValue": "p", "newValue": "P" }, { "oldValue": "b", "newValue": "B" }]
			}
		],
		"shippingAndMailing": [
			{
				"propName": "location",
				"values": [{ "oldValue": "Office Address", "newValue": "OfficeAddress" }]
			}
		],
		"userSetUp": [
			{
				"propName": "securityQuestion",
				"values": [{ "oldValue": "What is your mothers maiden name ?", "newValue": "MothersMaidenName" }, { "oldValue": "What was the name of your first pet ?", "newValue": "NameOfFirstPet" },
				{ "oldValue": "What high school did you attend ?", "newValue": "Highschool" }, { "oldValue": "What is the name of your first child ?", "newValue": "NameOfOldestChild" },
				{ "oldValue": "What is your fathers middle name ?", "newValue": "FathersMiddleName" }]
			}
		],
		"consent": [{ "propName": "protectionPlusUserAgreement", "defaultValue": false }
		],
	};

	// variable declare which contains the mapping of old and new value for specific tab
	var _oldAndNewValueMapOf2016 = {
		"epsProgram": [
			{
				"propName": "wantOfferProtectionPlus",
				"values": [{ "oldValue": true, "newValue": "Y" }, { "oldValue": false, "newValue": "N" }]
			},
			{
				"propName": "officeType",
				"values": [{ "oldValue": "Stand Alone", "newValue": "StandAlone" }, { "oldValue": "Multi-Site", "newValue": "MultiSite" }]
			},
			{ "propName": "checks", "defaultValue": "N" },
			{ "propName": "cards", "defaultValue": "N" },
			{ "propName": "directToCash", "defaultValue": "N" },
			{ "propName": "loanIndicator", "defaultValue": "N" },
			{ "propName": "serviceBureauFee", "defaultValue": 0 },
			{ "propName": "preAckLoans", "defaultValue": 'N' },
			{ "propName": "parentEfin", "defaultValue": "" },
			{ "propName": "recordSubType", "defaultValue": "N" },
			{ "propName": "addOnTransmitterFee", "defaultValue": "0" },
			{ "propName": "parentOfficeOwnerSSN", "defaultValue": "" },
			{ "propName": "addOnTransmitterFeeAgreement", "defaultValue": false }
		],
		"bankProductHistory": [
			{
				"propName": "previousBank",
				"values": [{ "oldValue": "Non", "newValue": "None" }, { "oldValue": "SBTGP", "newValue": "SBTPG" }]
			},
			{
				"propName": "transmitterUsedLastyear",
				"values": [{ "oldValue": "Creative Solutions", "newValue": "CreativeSolutions" }, { "oldValue": "eFile Interchange/PDI", "newValue": "eFileInterchangePDI" },
				{ "oldValue": "FileYourTaxes.com", "newValue": "FileYourTaxesDotCom" }, { "oldValue": "HR Block", "newValue": "HRBlock" },
				{ "oldValue": "Jackson Hewitt", "newValue": "JacksonHewitt" }, { "oldValue": "Laser Systems", "newValue": "LaserSystems" },
				{ "oldValue": "N/A", "newValue": "NotAvailable" }, { "oldValue": "Nelco/GreatTax", "newValue": "NelcoGreatTax" },
				{ "oldValue": "Petz/Crosslink", "newValue": "PetzCrosslink" }, { "oldValue": "TaxSoftware.com", "newValue": "TaxSoftwareDotCom" },
				{ "oldValue": "UTS/Taxwise", "newValue": "UTSTaxwise" }]
			},
			{
				"propName": "isBankProductRefuced",
				"values": [{ "oldValue": true, "newValue": "Y" }, { "oldValue": false, "newValue": "N" }]
			},
			{ "propName": "numberOfERCsERDsLastYear", "defaultValue": 0 },
			{ "propName": "priorBankVolumeSource", "defaultValue": "ERO" },
			{ "propName": "priorReturnVolumeSource", "defaultValue": "ERO" },
			{ "propName": "newToTransmitter", "defaultValue": "N" },
			{ "propName": "numberOfAdvancesLastYear", "defaultValue": 0 },
			{ "propName": "priorEFIN", "defaultValue": "" },
			{ "propName": "generatedFundingRatio", "defaultValue": 0 },
			{ "propName": "generatedNumberOfERCsERDsLastYear", "defaultValue": 0 },
			{ "propName": "generatedNumberOfRALsLastYear", "defaultValue": 0 },
			{ "propName": "generatedTotalPriorYearPrepFeeAmountPaid", "defaultValue": 0 },
		],
		"office": [
			{
				"propName": "isLocationShared",
				"values": [{ "oldValue": true, "newValue": "Y" }, { "oldValue": false, "newValue": "N" }]
			},
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "totalPriorYearPrepFeeAmountPaid", "defaultValue": 0 },
			{ "propName": "alternatePhone", "defaultValue": "" },
			{ "propName": "fax", "defaultValue": "" },
			{ "propName": "webSite", "defaultValue": "" }
		],
		"efinOwner": [
			{
				"propName": "idType",
				"values": [{ "oldValue": "Chile Cedual ID Card", "newValue": "ChileCedulaIDCard" }, { "oldValue": "Columbian Cedula ID Card", "newValue": "ColumbianCedulaIDCard" },
				{ "oldValue": "Columbian Consular Card", "newValue": "ColumbianConsularCard" }, { "oldValue": "DMV/DVM State ID", "newValue": "DMVDMVStateID" },
				{ "oldValue": "Driver's License Number", "newValue": "DriversLicenseNumber" }, { "oldValue": "EI Salvador UID Card", "newValue": "ElSalvadorDUICard" },
				{ "oldValue": "Foreign Passport", "newValue": "ForeignPassport" }, { "oldValue": "Guatemala Consular ID Card", "newValue": "GuatemalaConsularIDCard" },
				{ "oldValue": "Korean Consular Card", "newValue": "KoreanConsularCard" }, { "oldValue": "Matricula Consular", "newValue": "MatriculaConsular" },
				{ "oldValue": "Military ID", "newValue": "MilitaryID" }, { "oldValue": "Resident Alien ID", "newValue": "ResidentAlienID" },
				{ "oldValue": "US Passport", "newValue": "USPassport" }]
			},
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "mi", "defaultValue": "" },
			{ "propName": "cellPhone", "defaultValue": "" },
			{ "propName": "ptin", "defaultValue": "" },
			{ "propName": "issueDate", "defaultValue": "" },
			{ "propName": "idIssueLocation", "defaultValue": "" }
		],
		"businessOwner": [
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "mi", "defaultValue": "" },
			{ "propName": "cellPhone", "defaultValue": "" },
			{ "propName": "ptin", "defaultValue": "" },
			{ "propName": "issueDate", "defaultValue": "" },
			{ "propName": "idIssueLocation", "defaultValue": "" }
		],
		"controlPerson": [
			{ "propName": "salutation", "defaultValue": "" },
			{ "propName": "mi", "defaultValue": "" },
			{ "propName": "cellPhone", "defaultValue": "" },
			{ "propName": "issueDate", "defaultValue": "" },
			{ "propName": "idIssueLocation", "defaultValue": "" }
		],
		"bank": [
			{
				"propName": "csAccountType",
				"values": [{ "oldValue": "c", "newValue": "C" }, { "oldValue": "s", "newValue": "S" }]
			},
			{
				"propName": "pbAccountType",
				"values": [{ "oldValue": "p", "newValue": "P" }, { "oldValue": "b", "newValue": "B" }]
			}
		],
		"shippingAndMailing": [
			{
				"propName": "location",
				"values": [{ "oldValue": "Office Address", "newValue": "OfficeAddress" }]
			},
			{ "propName": "shipTo", "defaultValue": "" },
			{ "propName": "mailTo", "defaultValue": "" }
		],
		"userSetUp": [
			{
				"propName": "securityQuestion",
				"values": [{ "oldValue": "What is your mothers maiden name ?", "newValue": "MothersMaidenName" }, { "oldValue": "What was the name of your first pet ?", "newValue": "NameOfFirstPet" },
				{ "oldValue": "What high school did you attend ?", "newValue": "Highschool" }, { "oldValue": "What is the name of your first child ?", "newValue": "NameOfOldestChild" },
				{ "oldValue": "What is your fathers middle name ?", "newValue": "FathersMiddleName" }]
			}
		],
		"consent": [{ "propName": "protectionPlusUserAgreement", "defaultValue": false }
		],
	};

	// Get application tax year
	var _taxYear = userService.getTaxYear();

	/* to get the old value and new value map object*/
	epsService.getMapObject = function () {
		if (parseInt(_taxYear) >= 2016) {
			return _oldAndNewValueMapOf2016;
		} else {
			return _oldAndNewValueMap;
		}

	};



	/* to create New  EPS*/
	epsService.createEPS = function (data) {
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
	epsService.saveEPS = function (data) {
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
	epsService.getEPS = function () {
		var deferred = $q.defer();
		//load list from data api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/open',
			data: {
				bankType: 'EPS'
			}
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};
	return epsService;
}]);
//EPS Factory - End
