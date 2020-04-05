'use strict';

var refundAdvantageApp = angular.module('refundAdvantageApp', []);

refundAdvantageApp.controller('refundAdvantageController', ['$scope', '$location', '$log', 'userService', 'dialogService', 'subscriptionService', 'refundAdvService', 'messageService', 'environment', 'resellerService', 'passwordStrengthService', 'dataAPI', 'localeService',
	function ($scope, $location, $log, userService, dialogService, subscriptionService, refundAdvService, messageService, environment, resellerService, passwordStrengthService, dataAPI, localeService) {

		$scope.refundAdv = {};

		$scope.refundAdv.addOnTransmitterFee = 0;
		$scope.refundAdv.addOnTransmitterFeeAgreement = false;
		$scope.refundAdv.SBFee = 0;



		//to check is user is paid user or not 
		var userDetails = userService.getUserDetails();
		$scope.isDemoUser = userDetails.isDemoUser;
		var subscriptionType = '';

		var masterLocationDetails;

		$scope.taxYear = userService.getTaxYear();
		//Temporary function to differentiate features as per environment (beta/live)
		$scope.betaOnly = function () {
			if (environment.mode == 'beta' || environment.mode == 'local') {
				return true;
			} else {
				return false;
			}
		};

		$scope.speacialState = ['IL'];
		// AR, IL, MD, ME, NY
		$scope.refundAdv.isSpeacialState = false;

		//get master location details
		if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
			masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
		}

		// get current location state name
		if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.currentLocationId]) && !_.isUndefined(userDetails.locations[userDetails.currentLocationId].usAddress) &&
			!_.isUndefined(userDetails.locations[userDetails.currentLocationId].usAddress.state)) {
			// if us address state in speacial state then
			if ($scope.speacialState.indexOf(userDetails.locations[userDetails.currentLocationId].usAddress.state) != -1) {
				$scope.stateName = userDetails.locations[userDetails.currentLocationId].usAddress.state;
				$scope.refundAdv.isSpeacialState = true;
			} else {
				$scope.refundAdv.isSpeacialState = false;
			}

		}

		//get subscriptionType
		subscriptionType = userService.getLicenseValue('type');

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


		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};

		if (parseInt($scope.taxYear) >= 2018) {
			// variable declare which contain response code, type and message 
			var codeList = {
				"In Process": { type: 'warning', message: "You can not resubmit enrollment details as your enrollment is in process." },
				"Pending": { type: 'warning', message: "Your enrollment is pending from Refund Advantage." },
				"Enrolled": { type: 'success', message: "You are enrolled with Refund Advantage." },
				"Rejected": { type: 'warning', message: "Your enrollment has been rejected by Refund Advantage." },
				"Suspended": { type: 'warning', message: "Your enrollment has been suspended by Refund Advantage." },
				"Declined": { type: 'warning', message: "Your enrollment has been declined by Refund Advantage." },
				"Withdrawn": { type: 'warning', message: "Your enrollment has been Withdrawn by Refund Advantage.."}
			};
		} else {
			// variable declare which contain response code, type and message 
			var codeList = [
				{ code: "101", type: 'success', message: "You are successfully enrolled with Refund Advantage for tax season " + $scope.taxYear + "." },
				{ code: "102", type: 'success', message: "You are successfully enrolled with Refund Advantage for tax season " + $scope.taxYear + "." },
				{ code: "300", type: 'error', message: "We are sorry to inform you that Refund Advantage declined your enrollment application to participate in any of their financial tax refund products. For more information please contact Refund Advantage at 800-967-4934." },
				{ code: "301", type: 'error', message: "Your enrollment application is pending approval or denial. For more information please contact Refund Advantage at 800-967-4934." },
				{ code: "303", type: 'error', message: "Your account is inactive; please contact Refund Advantage at 800-967-4934." },
				{ code: "800", type: 'error', message: "You have not completed the required enrollment process. To participate in the Refund Advantage financial tax refund program you must enroll via their website <a href='https://www.refund-advantage.com/EasyEnrollment.aspx?mt=5' target='_blank'>www.refund-advantage.com</a>." },
				{ code: "900", type: 'error', message: "We are experiencing technical difficulties, please try again at a later time or contact technical support." },
				{ code: "901", type: 'error', message: "We are experiencing technical difficulties, please try again at a later time or contact technical support." },
				{ code: "903", type: 'error', message: "We are experiencing technical difficulties, please try again at a later time or contact technical support." },
				{ code: "904", type: 'error', message: "We are experiencing technical difficulties, please try again at a later time or contact technical support." },
				{ code: "998", type: 'error', message: "We are experiencing technical difficulties, please try again at a later time or contact technical support." },
				{ code: "999", type: 'error', message: "We are experiencing technical difficulties, please try again at a later time or contact technical support." }
			];
		}

		//condition to check that year equals to 2014
		if ($scope.taxYear == '2014') {
			// redirect to home because TPG bank is not use in 2014  
			$location.path('/home');
		}
		// set by default first tab is true
		$scope.activeTab = {};
		$scope.activeTab.epsProgramTab = true;
		//array object declare which contains the mapping of next and previous view for the steps of conversion for 2015
		$scope.nextAndPrevViewMap = [
			{ "view": "epsProgramTab", "next": "proHistoryTab", "previous": "", "currentView": true, "formName": "refundAdvtageprogramTabForm" },
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
			var lastDate = new Date('03/01/2018');
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
			parseInt($scope.taxYear) >= 2016 ? $scope.epsProgram = { checks: "N", cards: "N", directToCash: "N", loanIndicator: "N",preAckLoans:"N" , serviceBureauFee: 0, protectionPlusAddOnFee: "0.00", parentEfin: "", recordSubType: "N", addOnTransmitterFee: "0", addOnTransmitterFeeAgreement: false } : $scope.epsProgram = {};
		}
		if (_.isUndefined($scope.epsForm)) {
			$scope.epsForm = {};
		}
		if (_.isUndefined($scope.bankProductHistory)) {
			$scope.taxYear == '2015' ? $scope.bankProductHistory = { PriorBankVolumeSource: 2, PriorReturnVolumeSource: 2 } : $scope.bankProductHistory = {};
			parseInt($scope.taxYear) >= 2016 ? $scope.bankProductHistory = { priorBankVolumeSource: "ERO", priorReturnVolumeSource: "ERO", numberOfERCsERDsLastYear: 0, newToTransmitter: "N", priorEFIN: "", fundingRatio: 0 , generatedFundingRatio:0 , generatedNumberOfERCsERDsLastYear:0 ,generatedNumberOfRALsLastYear:0, generatedTotalPriorYearPrepFeeAmountPaid:0} : $scope.bankProductHistory = {};
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

		/**
	 * This function is used to disable save button when there is no change in enrollment form
	 */
		$scope.isChangeData = function () {
			var bankRAList = $scope.bankRApreviousData;
			if (!_.isEmpty(bankRAList) && JSON.stringify(bankRAList.epsProgram) == JSON.stringify($scope.epsProgram) &&
				JSON.stringify(bankRAList.office) == JSON.stringify($scope.office) &&
				JSON.stringify(bankRAList.businessOwner) == JSON.stringify($scope.businessOwner) &&
				JSON.stringify(bankRAList.efinOwner) == JSON.stringify($scope.efinOwner) &&
				JSON.stringify(bankRAList.bankProductHistory) == JSON.stringify($scope.bankProductHistory) &&
				JSON.stringify(bankRAList.userSetUp) == JSON.stringify($scope.userSetUp) &&
				JSON.stringify(bankRAList.bank) == JSON.stringify($scope.bank) &&
				JSON.stringify(bankRAList.shippingAndMailing) == JSON.stringify($scope.shippingAndMailing) &&
				JSON.stringify(bankRAList.controlPerson) == JSON.stringify($scope.controlPerson) &&
				JSON.stringify(bankRAList.consent) == JSON.stringify($scope.consent)) {
				return true;
			} else {
				return false;
			}
		}


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
					$scope.businessOwner.businessOwnerEmail = $scope.businessOwner.email;
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
			var businessOwnerAddress, efinOwnerAddress, controlPersonAddress , officeAddress, supplyAddress , mailingAddress;
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

		//get reseller name
		$scope.resellerConfig = resellerService.getValues(['appName']);
		$scope.hasFeature = function (featureName) {
			return resellerService.hasFeature(featureName);
		}

		/**
		 * Method prepared to get the office EFIN
		 * */
		var _initRefundAdvantage = function () {
			refundAdvService.getRefundAdvantageResponse().then(function (result) {
				// this condition is check bank is NewEnroll or not.
				if (result.isNewEnrollment != undefined && result.isNewEnrollment != null && result.isNewEnrollment == false) {
					$scope.mode = 'update';
				} else {
					$scope.mode = 'create';
				}
				if(!_.isUndefined(result.checkStatus) && parseInt($scope.taxYear) >= 2018){
					if (result.checkStatus == "Rejected" || result.checkStatus == "Declined" || result.checkStatus == "Suspended" || result.checkStatus == "Not Enrolled" || result.checkStatus == "Withdrawn") {
						$scope.isAllowedEnrollment = true;
					} else {
						$scope.isAllowedEnrollment = false;
						localeService.translate("Your EPS Enrollment status is " + result.checkStatus + ', your Refund Advantage ERO Enrollment cannot be completed. You will need to choose one provider (EPS or Refund Advantage) to be your default bank for processing Financial Products for Tax Year ' + $scope.taxYear+ '.' , 'ENROLLMENT_WARNING_ERROR').then(function (translatedText) {
							var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class displaytext' };
							dialogService.openDialog("notify", dialogConfiguration, translatedText);
						});
					}
				}
				if (parseInt($scope.taxYear) < 2018) {
					if (!_.isUndefined(result) && !_.isEmpty(result) && !_.isUndefined(result.acknowledgement) && !_.isEmpty(result.acknowledgement)) {
						//variable that holds the code and message to be displayed received from the API response code
						$scope.displayMessage = _.find(codeList, { code: result.acknowledgement.code });//getting message from the codeList array to be displayed
						//variable that holds the error message received from API
						$scope.messageOfEfinVerified = result.acknowledgement;
						// update response message when users receive an 800 error code
						if (!_.isUndefined($scope.messageOfEfinVerified) && !_.isUndefined($scope.messageOfEfinVerified.code) && $scope.messageOfEfinVerified.code == 800) {
							$scope.messageOfEfinVerified.message = "You were not found as having applied for the Refund Advantage program as a user of this software. Please call Refund Advantage's Client Operations at 1-800-967-4934 to update your software provider to " + $scope.resellerConfig.appName + ".";
						}
					}
					if (!_.isUndefined(result) && !_.isUndefined(result.efin)) {
						$scope.refundAdv.proceedFurther = true;
						$scope.refundAdv.efin = result.efin;
					} else {
						$scope.refundAdv.efin = angular.copy(userService.getLocationData()['efin']);
					}
					if (!_.isUndefined(result) && !_.isUndefined(result.addOnTransmitterFee) && !_.isUndefined(result.addOnTransmitterFeeAgreement)) {
						$scope.refundAdv.addOnTransmitterFee = result.addOnTransmitterFee;
						$scope.refundAdv.addOnTransmitterFeeAgreement = result.addOnTransmitterFeeAgreement;
					}
					if (!_.isUndefined(result) && !_.isUndefined(result.SBFee)) {
						$scope.refundAdv.SBFee = result.SBFee;
					}
					if (!_.isUndefined(result) && !_.isUndefined(result.protectionPlusAddOnFee)) {
						$scope.refundAdv.protectionPlusAddOnFee = result.protectionPlusAddOnFee;
					}
				} else {
					if (_.isUndefined($scope.bankRAList)) {
						$scope.bankRAList = {};
					}
					//get efin from location
					if(result && _.isEmpty(result.epsProgram)){
						$scope.epsProgram.efin = angular.copy(userService.getLocationData()['efin']);
					}
					$scope.bankRAList = result;
					$scope.bankRApreviousData = JSON.parse(JSON.stringify(result));

					// assigning the response status to rersponseMessage for display the message on UI
					$scope.responseMessage = (!_.isUndefined(result)) ? codeList[result.status] : {};

					//condition to check response.enrollmentData.acknowledgement is defined or not and response.enrollmentData.acknowledgement is empty or not
					if (!_.isUndefined(result.acknowledgement) && !_.isEmpty(result.acknowledgement)) {
						// scope variable declare which contains acknowledgement data
						// assigning the acknowledgement to acknowledgementData for display the disbursement method which are use by user on UI 
						$scope.acknowledgementData = result.acknowledgement;
					}

					// this condition is check 'bankEPSList' is empty or not.
					if (!_.isUndefined($scope.bankRAList) && !_.isEmpty($scope.bankRAList)) {
						$scope.displayRABankData($scope.bankRAList, result.isNewEnrollment);
					}
				}
			}, function (error) {
				$log.erorr(error);
			});
		};


		//this function call Display all data in UI 
		$scope.displayRABankData = function (bankData, isNewEnrollment) {
			// this condition check epsForm object defined or no.

			// all scope object assign values getting by bank/open API
			if (!_.isUndefined(bankData.epsProgram)) {
				$scope.epsProgram = bankData.epsProgram;
				// so that can showed as required
				if (_.isUndefined(bankData.epsProgram.addOnTransmitterFeeAgreement)) {
					$scope.epsProgram.addOnTransmitterFeeAgreement = false;
				}
			}
			// addon transmitter fee and service bureaue fee are undefined then set it to false

			if (!_.isUndefined(bankData.bankProductHistory)) {
				$scope.bankProductHistory = bankData.bankProductHistory;
				if ($scope.taxYear == '2015') {
					$scope.bankProductHistory.priorBankVolumeSource = 2;
					$scope.bankProductHistory.priorReturnVolumeSource = 2;
				} else if (parseInt($scope.taxYear) >= 2016) {
					$scope.bankProductHistory.priorBankVolumeSource = "ERO";
					$scope.bankProductHistory.priorReturnVolumeSource = "ERO";
				}
			}
			if ($scope.taxYear == '2014') {
				if (!_.isUndefined(bankData.owner)) {
					$scope.owner = bankData.owner;
				}
			} else {
				// condition to check bankData.owner is not undefined and bankData.efinOwner is undefined
				if (!_.isUndefined(bankData.efinOwner) && _.isUndefined(bankData.efinOwner)) {
					$scope.efinOwner = bankData.efinOwner;
				}
				// condition to check bankData.owner is undefined and bankData.efinOwner is not undefined
				else if (_.isUndefined(bankData.owner) && !_.isUndefined(bankData.efinOwner)) {
					$scope.efinOwner = bankData.efinOwner;
					if(!_.isEmpty($scope.efinOwner.dateOfBirth)){
						$scope.efinOwner.dateOfBirth = moment($scope.efinOwner.dateOfBirth).format('MM/DD/YYYY')
					}
					if(!_.isEmpty($scope.efinOwner.expirationDate)){
						$scope.efinOwner.expirationDate = moment($scope.efinOwner.expirationDate).format('MM/DD/YYYY')
						$scope.compareDate($scope.efinOwner.expirationDate, "EFIN Owner Expiration Date.")
					}
				}
				if (!_.isUndefined(bankData.businessOwner)) {
					$scope.businessOwner = bankData.businessOwner;
					$scope.businessOwner.businessOwnerPercentOwnership = parseFloat(bankData.businessOwner.businessOwnerPercentOwnership);
					if(!_.isEmpty($scope.businessOwner.dateOfBirth)){
						$scope.businessOwner.dateOfBirth = moment($scope.businessOwner.dateOfBirth).format('MM/DD/YYYY')
					}
					if(!_.isEmpty($scope.businessOwner.expirationDate)){
						$scope.businessOwner.expirationDate = moment($scope.businessOwner.expirationDate).format('MM/DD/YYYY')
						$scope.compareDate($scope.businessOwner.expirationDate, "Business Owner Expiration Date.")
					}
				}
				if (!_.isUndefined(bankData.consent)) {
					$scope.consent = bankData.consent;
				}
			}

			if (!_.isUndefined(bankData.bank)) {
				$scope.bank = bankData.bank;
				$scope.epsForm.confiRoutingNumber = bankData.bank.routingNumber;
				$scope.epsForm.confiAccouuntNumber = bankData.bank.accountNumber;
				// this condition check csAccount type is 'c' or 's'. 'c' is true  and 's' is false;  
				if ($scope.taxYear == '2014') {
					if (bankData.bank.csAccountType == 'c') {
						$scope.epsForm.csAccountType = true;
					}
					else if (bankData.bank.csAccountType == 's') {
						$scope.epsForm.csAccountType = false;
					}
					// this condition check csAccount type is 'p' or 'b'. 'p' is true  and 'b' is false;
					if (bankData.bank.pbAccountType == 'p') {
						$scope.epsForm.pbAccountType = true;
					} else if (bankData.bank.pbAccountType == 'b') {
						$scope.epsForm.pbAccountType = false;
					}
				}
			}
			if (!_.isUndefined(bankData.shippingAndMailing)) {
				$scope.shippingAndMailing = bankData.shippingAndMailing;
				//assigning the default value to address2 property of supply and mailing address
				$scope.shippingAndMailing.supplyAddress.address2 = (_.isUndefined($scope.shippingAndMailing.supplyAddress.address2) || _.isNull($scope.shippingAndMailing.supplyAddress.address2)) ? "" : $scope.shippingAndMailing.supplyAddress.address2;
				$scope.shippingAndMailing.mailingAddress.address2 = (_.isUndefined($scope.shippingAndMailing.mailingAddress.address2) || _.isNull($scope.shippingAndMailing.mailingAddress.address2)) ? "" : $scope.shippingAndMailing.mailingAddress.address2;
			}
			if (!_.isUndefined(bankData.userSetUp)) {
				$scope.userSetUp = bankData.userSetUp;
				$scope.epsForm.confirmPass = bankData.userSetUp.password;
			}
			if (!_.isUndefined(bankData.office)) {
				$scope.office = bankData.office;
				if (!_.isEmpty(bankData.office.yearsInBusiness)) {
					$scope.office.yearsInBusiness = parseFloat(bankData.office.yearsInBusiness);
				}
			}
			if (!_.isUndefined(bankData.controlPerson)) {
				$scope.controlPerson = bankData.controlPerson;
				if(!_.isEmpty($scope.controlPerson.dateOfBirth)){
					$scope.controlPerson.dateOfBirth = moment($scope.controlPerson.dateOfBirth).format('MM/DD/YYYY')
				}
				if(!_.isEmpty($scope.controlPerson.expirationDate)){
					$scope.controlPerson.expirationDate = moment($scope.controlPerson.expirationDate).format('MM/DD/YYYY')
					$scope.compareDate($scope.controlPerson.expirationDate, "Control Person Expiration Date.")
				}
			}
			$scope.setTaskMask();

			// condition to check newEnrollment equals to true and bankData not empty and the taxYear is equal to 2015 
			if (isNewEnrollment == true && !_.isEmpty(bankData) && $scope.taxYear != '2014') {
				// function call to update the values of tab
				_updateMapValue();
			}
			
			
			
		};

		/**
		 * method update the 2014 year oldValue to 2015 year newValue
		 * */
		var _updateMapValue = function () {
			// local variable to get the old and new value of Object
			var _mappedObject = refundAdvService.getMapObject();
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
		 * Method prepare to verify the EFIN
		 * */
		$scope.verifyEfin = function () {
			//service method called which will call API to verify the entered EFIN
			refundAdvService.verifyEfin($scope.refundAdv.efin.toString(), $scope.refundAdv.isSpeacialState).then(function (success) {
				//variable that holds the code and message to be displayed received from the API response code
				$scope.displayMessage = _.find(codeList, { code: success.code });//getting message from the codeList array to be displayed
				//variable that holds the error message received from API
				$scope.messageOfEfinVerified = success;
				// update response message when users receive an 800 error code
				if (!_.isUndefined($scope.messageOfEfinVerified) && !_.isUndefined($scope.messageOfEfinVerified.code) && $scope.messageOfEfinVerified.code == 800) {
					$scope.messageOfEfinVerified.message = "You were not found as having applied for the Refund Advantage program as a user of this software. Please call Refund Advantage's Client Operations at 1-800-967-4934 to update your software provider to " + $scope.resellerConfig.appName + ".";
				}
			}, function (error) {
				$log.error(error);
				$scope.displayMessage = _.find(_.filter(codeList, { type: 'error' }), { code: error.code });
				$scope.messageOfEfinVerified = error;
			});
		};


		/**
		 * This function add transmitter fee agreement time stamp in 
		 * eps program
		 */
		$scope.addAddOnTransmitterFeeAgreementTS = function () {
			if ($scope.refundAdv.addOnTransmitterFeeAgreement == true) {
				$scope.refundAdv.addOnTransmitterFeeAgreementTS = moment(new Date());
			}
		}

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
			if (!_.isUndefined(form) && (form.refundAdvtageprogramTabForm.$invalid == true || form.bankProductHistoryTabForm.$invalid == true || form.officeTabForm.$invalid == true || form.efinOwnerTabForm.$invalid == true || form.businessOwnerTabForm.$invalid == true || form.bankTabForm.$invalid == true || form.shippingMailingTabForm.$invalid == true || form.userSetupTabForm.$invalid == true || form.controlPersonTabForm.$invalid == true || $scope.checkConsent())) {
				//open dialog if any form is invalid
				localeService.translate("Please review each of the ERO Enrollment Application Tabs, and complete the required fields displayed in red.", 'EPS_FORM_SAVE_ERROR').then(function (translatedText) {
					var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class displaytext' };
					var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
				});
			} else {
				//call save after validating forms
				$scope.saveBankRefundAdvantage();
			}
		}

		/**
		 * Method prepared to check program type and disbursment method
		 * are valid for particular state or not
		 * 
		 * @return {boolean} true or false
		 */
		$scope.checkForSpeacialState = function (expr) {
			if ($scope.refundAdv.isSpeacialState) {
				switch (expr) {
					// if user has entered add on transmitter fee more then zero
					case 'addOnTransmitterFee':
						if ($scope.refundAdv.addOnTransmitterFee > 0) {
							return true;
						} else {
							return false;
						}
					// if user has entered add on SB fee more then zero
					case 'serviceBureauFee':
						if ($scope.refundAdv.SBFee > 0) {
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
		$scope.checkConsent = function () {
			// if addOn transmitter fee is less then 0 and addOn transmitter agreement is false then
			// disable save button
			if ($scope.hasFeature('AddOnTransmitterFeeConsent') && !_.isUndefined($scope.refundAdv.addOnTransmitterFee) && $scope.refundAdv.addOnTransmitterFee > 0) {
				if ($scope.refundAdv.addOnTransmitterFeeAgreement == false) {
					return true;
				}
			}

			if ($scope.consent.refundAdvantageProgramAgreement == false) {
				return true;
			}

			if ($scope.epsProgram.wantOfferProtectionPlus == 'Y' && $scope.consent.protectionPlusUserAgreement == false) {
				return true;
			}

		}

		// save refund advatage
		$scope.saveBankRefundAdvantage = function () {

			if (subscriptionType == 'FREE') {
				$location.path('/home');
			}


			// parseFloat is used for convert the "01" to "1" and toFixed(2) is used for add the two decimal digit to the number 
			$scope.epsProgram.protectionPlusAddOnFee = (!_.isUndefined($scope.epsProgram.protectionPlusAddOnFee) && !_.isNull($scope.epsProgram.protectionPlusAddOnFee)) ? '' + parseFloat($scope.epsProgram.protectionPlusAddOnFee).toFixed(2) : "0.00";
			$scope.office.addOnFee = (!_.isUndefined($scope.office.addOnFee) && !_.isEmpty($scope.office.addOnFee) && !_.isNull($scope.office.addOnFee)) ? '' + parseFloat($scope.office.addOnFee).toFixed(2) : "";
			if (_.isEmpty($scope.bankProductHistory.fundingRatio)) {
				$scope.bankProductHistory.fundingRatio = 0;
			}
			//assigning the default value to address2 property of supply and mailing address 
			$scope.shippingAndMailing.supplyAddress.address2 = (_.isUndefined($scope.shippingAndMailing.supplyAddress.address2) || _.isNull($scope.shippingAndMailing.supplyAddress.address2)) ? "" : $scope.shippingAndMailing.supplyAddress.address2;
			$scope.shippingAndMailing.mailingAddress.address2 = (_.isUndefined($scope.shippingAndMailing.mailingAddress.address2) || _.isNull($scope.shippingAndMailing.mailingAddress.address2)) ? "" : $scope.shippingAndMailing.mailingAddress.address2;

			//add device id
			var fp1 = new Fingerprint({ canvas: true, ie_activex: true, screen_resolution: true });
			var deviceId = CryptoJS.SHA1(fp1.get()).toString();
			$scope.epsProgram.deviceId = deviceId;

			if ($scope.mode == 'create') {
				$scope.epsProgram.programType2016 = "RefundAdvantage";
			}
			if($scope.epsProgram.serviceBureauFee == null || $scope.epsProgram.serviceBureauFee == undefined || $scope.epsProgram.serviceBureauFee == ''){
				$scope.epsProgram.serviceBureauFee = undefined;
			}
			$scope.consent.eroProgramAgreement = true; 
			var data = {
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
				bankType: 'REFUNDADVANTAGE'
			};

			if ($scope.mode == 'update') {
				//this condition to check user data update or new create  
				if ($scope.bankRAList.status == "Enrolled") {
					// Dialog used for the confirmation from user to Delete or not the selected user.
					var dialogConfiguration = {
						'keyboard': false,
						'backdrop': false,
						'size': 'md',
						'windowClass': 'my-class'
					};
					localeService.translate('You are already enrolled with Refund Advantage. if you save changes then your status change back to In Process.Do you want to save ?', 'USER_DOYOUDELETETHISUSER_DIALOG_MESSAGE').then(function (translateText) {
						var dialog = dialogService.openDialog("confirm", dialogConfiguration, {
							text: translateText
						});
						dialog.result.then(function (btn) {
							refundAdvService.saveRefundAdvantage(data).then(function (success) {
								messageService.showMessage('Update successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
								//after success we just redirect to home screen
								$location.path('/home');
							}, function (error) {
							});
						}, function (btn) {

						});
					});
				} else {
					//Save RA
					refundAdvService.saveRefundAdvantage(data).then(function (success) {
						messageService.showMessage('Save successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
						//after success we just redirect to home screen
						$location.path('/home');
					}, function (error) {
					});
				}
			} else {
				refundAdvService.createRefundAdvantage(data).then(function (success) {
					messageService.showMessage('Save successfully', 'success', 'BANK_UPDATESUCCESS_MSG');
					//after success we just redirect to home screen
					$location.path('/home');
				}, function (error) {
				});
			}
		}

		/**
		 * Method prepared to get the URL in order to download the e-collect, e-bonus or protection plus user agreement PDF 
		 * */
		$scope.getUrlToDownloadPdf = function (type) {
			switch (type) {
				case 'AGREEMENT':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Audit_Assistance.pdf';
				case 'ERO':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_ero.pdf';
				case 'Agreement_ra':
					return dataAPI.static_url + '/' + $scope.taxYear + '/download/bank/eps/Agreement_ra.pdf';
				default:
					return;
			}

		};

		//Initialization
		_initRefundAdvantage();
	}]);

//Refund Advantage Factory - Start
refundAdvantageApp.factory('refundAdvService', ['$q', '$log', '$http', 'dataAPI', 'userService', function ($q, $log, $http, dataAPI, userService) {

	var refundAdvService = {};

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

	refundAdvService.getMapObject = function () {
		if (parseInt(_taxYear) >= 2016) {
			return _oldAndNewValueMapOf2016;
		} else {
			return _oldAndNewValueMap;
		}

	};

	/* to verify the EFIN */
	refundAdvService.verifyEfin = function (efin, isSpeacialState) {
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/refundAdvantage/getStatus',
			data: {
				efin: efin,
				isSpeacialState: isSpeacialState,
				bankType: 'REFUNDADVANTAGE'
			}
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deferred.resolve(false);
		});
		return deferred.promise;
	};

	/**
	 * method call API to get the bank enrollment status
	 */
	refundAdvService.getRefundAdvantageResponse = function () {
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/open',
			data: {
				bankType: 'REFUNDADVANTAGE'
			}
		}).then(function (response) {
			response.data.data.enrollmentData.isNewEnrollment = response.data.data.isNewEnrollment;
			response.data.data.enrollmentData.checkStatus = response.data.data.checkStatus;
			deferred.resolve(response.data.data.enrollmentData);
		}, function (error) {
			$log.error(error);
			deferred.resolve(false);
		});
		return deferred.promise;
	};

	/**
	 * update refund advantage data
	 */
	refundAdvService.saveRefundAdvantage = function (data) {
		var deffered = $q.defer();
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/save',
			data: {
				data: data
			}
		}).then(function (response) {
			deffered.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deffered.reject(error);
		});

		return deffered.promise;
	}

	/**
	 * update refund advantage data
	 */
	refundAdvService.createRefundAdvantage = function (data) {
		var deffered = $q.defer();
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/bank/create',
			data: {
				data: data
			}
		}).then(function (response) {
			deffered.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deffered.reject(error);
		});

		return deffered.promise;
	}

	return refundAdvService;
}]);
//Refund Advantage Factory - End