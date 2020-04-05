'use strict';
var setup = angular.module("setup", []);

setup.controller("quickSetupController", ['$scope', '$location', '$log', '$routeParams', 'userService', 'preparerService', 'setupService','environment','utilityService','resellerService','systemConfig','localeService','dialogService','signatureService', 'messageService', '$rootScope', '$q', function($scope, $location, $log, $routeParams, userService, preparerService, setupService,environment,utilityService,resellerService,systemConfig,localeService,dialogService ,signatureService, messageService, $rootScope, $q){
	//Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);
    };
    
    //Flag checks whether data is loaded or not. IF not then shows progress animation.
    $scope.isDataLoading = true;
    //Flag enables/disables doNotShowAgain check-box
	$scope.isManualInvoke = false;
	//Contains redirect URL. IF screen is invoked automatically then this will contain last URL.
	var redirectUrl = "/home";
    
	$scope.office = {};
	$scope.preparer = {};
	$scope.usAddress = {};	
	$scope.foreignAddress = {};
	//address type list 
	$scope.addressTypeList = [{id : 'usAddress', title: 'US Address'}, {id : 'foreignAddress', title: 'Foreign Address'}];
	//selected address type
	$scope.addressType = angular.copy($scope.addressTypeList[0]);

	//selected address type
	$scope.addressTypeOwner = angular.copy($scope.addressTypeList[0]);

	//array holds exemptCode list for NY state
	$scope.exemptCodeList = [{"text":"", "value":""},{"text":"01-Attorney", "value":"01"},{"text":"02-Employee of attorney", "value":"02"},
                             {"text":"03-CPA", "value":"03"},{"text":"04-Employee of CPA", "value":"04"},{"text":"05-PA (Public Accountant)", "value":"05"},
                             {"text":"06-Employee of PA", "value":"06"},{"text":"07-Enrolled agent", "value":"07"},{"text":"08-Employee of enrolled agent", "value":"08"},
                             {"text":"09-Volunteer tax preparer", "value":"09"},{"text":"10-Employee of business preparing that business’ return", "value":"10"}];
	
	var locationData = angular.copy(userService.getLocationData());

	//get efin status lookup
	$scope.efinStatusLookup = systemConfig.getEfinStatusLookup();

	// get User Detail
	var userDetails = angular.copy(userService.getUserDetails());

	//hold Preparer list
	$scope.preparerList;

	$scope.isOfficeInvalid = true;

	// to manage tooltip
	$scope.manageTooltip = {
		phonePreparer: false, emailPreparer: false, evsPreparer: false,
		phoneOffice: false, emailOffice: false, evsOffice: false, completeInfo: false, recoveryEmail: false
	}

	// store information of single user and prepare only etc
	$scope.mainInfo = {};
	// Quick Office Setup template show based on this variable 
	$scope.showSetup;
	$scope.doChange = false;

	$scope.screenHandler = { isLockEfinWait: true, isVeriyBtnDisabled: true, isContinueBtnDisabled: true, EfinWaitbtn : false  };

	/**
	 * Get location data. Checks whether quickSetup is there in settings. IF flags are set then pre-load the office and preparer's data.
	 * US-Address or Foreign-Address will be taken from office. IF it will not be available then will be taken from preparer's data.  
	 */
	var _init = function(){

		// based on this var we are show screen
		if (locationData) {
			$scope.office.isPredefined = locationData.isPredefined
		}

		//IF routeParams have manual object then set isManualInvoke Flag.
		if(!_.isUndefined($routeParams.manual) && $routeParams.manual == "m"){
			$scope.isManualInvoke = true;
		}else if(!_.isUndefined($routeParams.manual) && $routeParams.manual == "a"){
			//ELSE IF routeParams have url then replace all '_' in that url with '/'
			if(!_.isUndefined($routeParams.url) && $routeParams.url != ""){
				redirectUrl = $routeParams.url;
				redirectUrl = redirectUrl.replace(/_/g,"/");
			}
		}
			
		//get quick office setup
		setupService.get().then(function(preparerList){
			$scope.preparerList = preparerList;
			//Check location settings
			if(!_.isUndefined(locationData)){
				if(locationData.settings && locationData.settings.setupConfig && locationData.settings.setupConfig.doNotShowAgain){
					$scope.doNotShowAgain = locationData.settings.setupConfig.doNotShowAgain;
				}
				if(locationData && locationData.settings && locationData.settings.setupConfig && locationData.settings.setupConfig.isOfficeDone && locationData.settings.setupConfig.isPreparerDone){
					$scope.isSetupCompleted = true;
				} 
				
				//load office data						
				$scope.office = locationData;
				$scope.oldEfin = angular.copy(locationData.efin);
				$scope.oldDocumentId = angular.copy(locationData.documentId);
				
				//assign address
				if (!_.isUndefined(locationData.usAddress) && !_.isEmpty(locationData.usAddress)) {
					$scope.office.usAddress = locationData.usAddress;
				}

				//assign address
				if (!_.isUndefined(locationData.foreignAddress) && !_.isEmpty(locationData.foreignAddress)) {
					$scope.office.foreignAddress = locationData.foreignAddress;
				}

				if (!_.isUndefined(userDetails) && locationData.isVerifiedEmail == true) {
					$scope.licenseEmail = userDetails.email
				}
				// by default set addressDiffFromPreparer to false.
				if (_.isUndefined(locationData.addressDiffFromPreparer)) {
					$scope.office.addressDiffFromPreparer = false;
				}

				$scope.mainInfo = {
					'singleOfficePreparer': locationData.singleOfficePreparer, 'EfinEfilingStatus':locationData.EfinEfilingStatus , 'paperOnly': false
				};

				$scope.userMainInfo = angular.copy($scope.mainInfo);

				// show form based on user selected answer
				_isshowSetUp();


				// //select address type
				// if(locationData.addressType){				
				// 	$scope.addressType = angular.copy(_.find($scope.addressTypeList, {id: locationData.addressType}));				
				// }
				
				// //assign address
				// if(!_.isUndefined(locationData.usAddress) && !_.isEmpty(locationData.usAddress)){
				// 	$scope.usAddress = locationData.usAddress;
				// }
				
				// //assign address
				// if(!_.isUndefined(locationData.foreignAddress) && !_.isEmpty(locationData.foreignAddress)){
				// 	$scope.foreignAddress = locationData.foreignAddress;
				// }
			}
			
			//Check is associatedPreparerId available
			if(locationData.associatedPreparerId != undefined && locationData.associatedPreparerId !=''){
				//get Preparer data using associatedPreparerId
				$scope.getPreparerData(locationData.associatedPreparerId);
				$scope.preparer.preparerId = locationData.associatedPreparerId; 
			}else if(_.isUndefined($scope.preparerList) || _.isEmpty($scope.preparerList)){//if preparer list is empty
				$scope.preparer.preparerFname = locationData.contactFirstName == undefined ? "" : locationData.contactFirstName;						
				$scope.preparer.preparerLname = locationData.contactLastName == undefined ? "" : locationData.contactLastName;
				var prepareId = $scope.preparer.preparerFname.substring(0, 2) + $scope.preparer.preparerLname.substring(0, 2)
					//prepare preparer's data   //check undefined
					$scope.preparer = { preparerId: prepareId, preparerName: name, preparerFname: $scope.preparer.preparerFname, preparerLname: $scope.preparer.preparerLname, firmName: locationData.name };
					if (!_.isUndefined(userDetails)) {
						$scope.preparer.telephone = userDetails.phoneNo;
						$scope.preparer.email = userDetails.email;
					}
					if (locationData.isVerifiedEmail == true) {
						$scope.preparer.isEmailVerified = true
					}
					_setAddressFromCRM()
			}else{
				//by default get first preparer if preparer list is not empty
				$scope.getPreparerData($scope.preparerList[0].preparerId);
			}	

			$scope.isDataLoading = false;

			if ($scope.hasLicense('enableSignaturePad') && $scope.hasFeature('SIGNATURE') && $scope.userCan('CAN_OPEN_SIGNATURE')) {
				_signatureViewAll(true);
			}
			// check all conditions for enable office
			$scope.EnableOfficeVerify()
		}, function(error){
			$scope.isDataLoading = false;
			$scope.preparer.preparerFname = locationData.contactFirstName == undefined ? "" : locationData.contactFirstName;						
			$scope.preparer.preparerLname = locationData.contactLastName == undefined ? "" : locationData.contactLastName;
			var prepareId = $scope.preparer.preparerFname.substring(0, 2) + $scope.preparer.preparerLname.substring(0, 2)
			//prepare preparer's data   //check undefined
			$scope.preparer = { preparerId: prepareId, preparerName: name, preparerFname: $scope.preparer.preparerFname, preparerLname: $scope.preparer.preparerLname, firmName: locationData.name };
			if (!_.isUndefined(userDetails)) {
				$scope.preparer.telephone = userDetails.phoneNo;
				$scope.preparer.email = userDetails.email;
			}
			if (locationData.isVerifiedEmail == true) {
				$scope.preparer.isEmailVerified = true
			}
			_setAddressFromCRM()
		});		
	};

	// to show line help in quick office setup 
	$scope.showLineHelp = function (elementId) {
		$rootScope.$broadcast('showLineHelp', elementId);
	}

	// to hide line help in quick office setup 
	$scope.hideLineHelp = function (elementId) {
		$rootScope.$broadcast('hideLineHelp', elementId);
	}

	// reset varible when user click on one office with a single tax preparer No button
	$scope.changeSingleTaxPreparer = function () {
		$scope.mainInfo = {'singleOfficePreparer': 1, 'EfinEfilingStatus' : undefined, 'paperOnly': false};
		$scope.userMainInfo = angular.copy($scope.mainInfo);
		$scope.screenHandler.isContinueBtnDisabled = false
		_isshowSetUp()
	}

	// mark false to invalid office
	$scope.EnableOfficeVerify = function () {
		$scope.isOfficeInvalid = undefined
		if ($scope.office.phoneDiffFromPreparer == true) {
			if ($scope.office.isBusinessPhoneVerified == true) {
				$scope.isOfficeInvalid = false;
			} else {
				$scope.isOfficeInvalid = true;
			}
		}
		if ($scope.office.emailDiffFromPreparer == true && $scope.isOfficeInvalid !== true) {
			if ($scope.office.isBusinessMailVerified == true) {
				$scope.isOfficeInvalid = false;
			} else {
				$scope.isOfficeInvalid = true;
			}
		}
		if ($scope.isOfficeInvalid == undefined) {
			$scope.isOfficeInvalid = false;
		}
	}
	
	// call function when user change on Email an check type Email and license Email both are same
	$scope.ChangePrepareEmail = function () {
		if ($scope.preparer.email !== undefined && $scope.preparer.email && $scope.preparer.email == $scope.licenseEmail) {
			$scope.preparer.isEmailVerified = true
		} else {
			$scope.preparer.isEmailVerified = false
		}

	}

	// this function show dialog of telephone verification. 
	$scope.telephoneVerification = function (phoneNumber, type) {
		var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/manage/setup/partials/dialog/telephoneVerification.html", "telephoneVerificationDialogController", { 'telephoneNumber': phoneNumber });
		dialog.result.then(function (response) {
			if (response === true) {
				messageService.showMessage('Your telephone number is verified successfully.', 'success', 'SUCCESS_MSG');
				if (type == 'preparer') {
					$scope.preparer.isTelephoneVerified = true;
				} else if (type == 'office') {
					$scope.office.isBusinessPhoneVerified = true;
					$scope.EnableOfficeVerify();
				}
			}
		})
	};

	
	// this function show dialog of Emails verification.
	$scope.emailVerification = function (emailAddress, type) {
		var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/manage/setup/partials/dialog/EmailVerificationDialog.html", "EmailVerifyDialogController", { 'email': emailAddress });
		dialog.result.then(function (response) {
			if (response === 9000) {
				messageService.showMessage('Your email is verified successfully.', 'success', 'SUCCESS_MSG');
				if (type == 'preparer') {
					$scope.preparer.isEmailVerified = true;
				} else if (type == 'office') {
					$scope.office.isBusinessMailVerified = true;
					$scope.EnableOfficeVerify();
				} else if (type == 'recoveryEmail') {
					$scope.preparer.secondaryEmailVerified = true;
				}
			}
		})
	};

	// confirmation before lock prepare information
	$scope.confirmation = function (type) {
		var deffered = $q.defer();
		var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/manage/setup/partials/dialog/confirmDialog.html", "setupConfirmDialogController",
			{ 'preparer': $scope.preparer,  'type': type, 'office': $scope.office,  });
		dialog.result.then(function (response) {
			if (response === true) {
				deffered.resolve(response);
			}

		});
		return deffered.promise;
	}

	// alert show to unlock 
	$scope.alertToVerifyUnlock = function (type) {
		var deffered = $q.defer();
		var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/manage/setup/partials/dialog/alertToVerifyUnlock.html", "setupAlertDialogController", { 'type': type });
		dialog.result.then(function (response) {
			deffered.resolve(response);
		})
		return deffered.promise;
	}

	// show failed dialog
	$scope.verificationFailed = function () {
		if($scope.userMainInfo.EfinEfilingStatus == 0) {
			var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' }, "taxAppJs/manage/setup/partials/dialog/verificationFailedDialog.html", "setupAlertDialogController", { 'type': '' });
			dialog.result.then(function (response) {
				if (response === true) {
					$scope.openPreparerEfinLetterDialog()
				}
			})
		}
	}

	// redirect to home
	$scope.gotoHome = function (isApiCall) {
		if(isApiCall == true) {
			$scope.AddSingleOfficeUser(true)
		} else {
			$location.path(redirectUrl);
		}
		
	}

	/**
	 * verify dialog
	 * first open confirm dialob before lock
	 * after that ask questions to user for verification
	 */
	$scope.verify = function () {
		if ($scope.preparer.isTelephoneVerified && $scope.preparer.isEmailVerified) {
			$scope.confirmation('preparer').then(function (response) {
				if (($scope.office.efinStatus == 0 || $scope.userMainInfo.EfinEfilingStatus == 2 ) && $scope.preparer.preparerVerified !== false && $scope.isOfficeInvalid != true) {
					 _getQuestionsAnswersList();
				} else if($scope.userMainInfo.EfinEfilingStatus == 0) {
					$scope.openPreparerEfinLetterDialog()
				} else if($scope.userMainInfo.EfinEfilingStatus == 1) {
					$scope.screenHandler.isLockEfinWait = true
				}
			});
		}
	}

	// unlock by prepare
	$scope.unlockPrepare = function () {
		$scope.alertToVerifyUnlock('prepare').then(function (res) {
			if (res == true) {
				if ($scope.office.efinStatus == 2) {
					$scope.office.efinStatus = 0;
					$scope.office.detailUnlockByUser = true;
					locationData.efinStatus = 0;
				}
				if ($scope.preparer.preparerVerified == true) {
					$scope.preparer.preparerVerified = undefined
					locationData.preparerVerified = undefined;
				}
				userService.setLocationData(locationData);
				$rootScope.$broadcast('setupDoneListener', true);
				$scope.save();
			}
		})
	}

	// add single user flag and set false officeCreation Flag
	$scope.AddSingleOfficeUser = function (isRedirect) {
		if($scope.mainInfo.singleOfficePreparer == 0 && $scope.mainInfo.EfinEfilingStatus == 2) {
			$scope.mainInfo.paperOnly = true;
		}
		setupService.AddSingleOfficeUserFlag($scope.mainInfo).then(function (res) {
			$scope.screenHandler.isContinueBtnDisabled = true;
			locationData.singleOfficePreparer = $scope.mainInfo.singleOfficePreparer;
			locationData.EfinEfilingStatus = $scope.mainInfo.EfinEfilingStatus;
			if($scope.mainInfo.singleOfficePreparer == 0 && $scope.mainInfo.EfinEfilingStatus == 2) {
				locationData.efinStatus = 5;
				$scope.office.efinStatus = 5;
				$scope.mainInfo.paperOnly = true
			} else if ($scope.mainInfo.EfinEfilingStatus != 2 && $scope.office.efinStatus == 5) {
				locationData.efinStatus = 0;
				$scope.office.efinStatus = 0;
				$scope.mainInfo.paperOnly = false
			}
			if($scope.mainInfo.EfinEfilingStatus !== 0) {
				$scope.office.efin = undefined;
			}
			if ($scope.screenHandler.EfinWaitbtn == true && $scope.mainInfo.EfinEfilingStatus != 1) {
				$scope.screenHandler.EfinWaitbtn = false
			}
			$scope.doChange = true;
			userService.setLocationData(locationData);
			$scope.userMainInfo = angular.copy($scope.mainInfo);
			_isshowSetUp()
			if (isRedirect == true || $scope.mainInfo.singleOfficePreparer == 1) {
				$location.path(redirectUrl);
			}
			messageService.showMessage('Information saved successfully.', 'success', 'SUCCESS_MSG');
		}, function (error) {

		})
	}
	

	// call Api for get all Questions
	var _getQuestionsAnswersList = function () {
		var objectToGetEVSQuestionList = {};		
		if($scope.office.addressDiffFromPreparer == true) {
			if(!$scope.preparer.usAddress) {
				$scope.preparer.usAddress = {}
			}	
			objectToGetEVSQuestionList = { 'preparerFname': $scope.preparer.preparerFname, 'preparerLname': $scope.preparer.preparerLname, 'preparerSsn': $scope.preparer.preparerSsn, 'street': $scope.preparer.usAddress.street, 'city': $scope.preparer.usAddress.city, 'state': $scope.preparer.usAddress.state, 'zipCode': $scope.preparer.usAddress.zipCode, 'email': $scope.preparer.email }
		} else {
			if (!$scope.office.usAddress) {
				$scope.office.usAddress = {}
			}
			objectToGetEVSQuestionList = { 'preparerFname': $scope.preparer.preparerFname, 'preparerLname': $scope.preparer.preparerLname, 'preparerSsn': $scope.preparer.preparerSsn, 'street': $scope.office.usAddress.street, 'city': $scope.office.usAddress.city, 'state': $scope.office.usAddress.state, 'zipCode': $scope.office.usAddress.zipCode, 'email': $scope.preparer.email }
		}
		var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' }, "taxAppJs/manage/setup/partials/dialog/verificationQuestions.html", "verificationQuestionsDialogController", { 'preparerId': $scope.preparer.preparerId, 'objectToGetEVSQuestionList': objectToGetEVSQuestionList });
		dialog.result.then(function (response) {
			if (response == true) {
				$scope.preparer.preparerVerified = true;
				locationData.efinStatus = 2;
			} else if (response == false) {
				$scope.preparer.preparerVerified = false;
				$scope.verificationFailed();
			} else if( response == 'EfinRequired') {
				$scope.preparer.preparerVerified = false;
				$scope.openPreparerEfinLetterDialog();
				$scope.save();
			}
			// To update the locationData manually.
			locationData.preparerVerified = $scope.preparer.preparerVerified;
			userService.setLocationData(locationData);
			$rootScope.$broadcast('setupDoneListener', true);
		})
	}

	// setup sections show based on conditions
	var _isshowSetUp = function () {
		$scope.showSetup = false;
		if ($scope.mainInfo.singleOfficePreparer == 0 && ($scope.mainInfo.EfinEfilingStatus == 0 || $scope.mainInfo.EfinEfilingStatus == 1 || $scope.mainInfo.EfinEfilingStatus == 2)) {
			$scope.showSetup = true
		}
	}

	// get address from CRM in location doc and set to prepare 
	var _setAddressFromCRM = function () {
		if (locationData) {
			if (locationData.CRMAddress) {
				if (locationData.CRMAddress.country == 'US') {
					$scope.office.usAddress = {}
					$scope.office.usAddress.street = locationData.CRMAddress.address1
					$scope.office.usAddress.zipCode = locationData.CRMAddress.zipCode;
					$scope.office.usAddress.city = locationData.CRMAddress.city
					$scope.office.usAddress.state = locationData.CRMAddress.state
				}
			}
			$scope.preparer.isTelephoneVerified = locationData.isVerifiedContact
		}
	}

	var _signatureViewAll = function (forceUpdate) {
		$scope.isDataLoading = true;
		var getSignatureObj = { "typeList": [1, 2], "preparerId": $scope.preparer.preparerId };
		signatureService.signatureViewAll(getSignatureObj, forceUpdate).then(function (signaturesData) {
			if (signaturesData != undefined) {
				if (signaturesData[1] != undefined && signaturesData[1].image != undefined)
					$scope.EROSignatureData = signaturesData[1].image;
				else
					$scope.EROSignatureData = undefined;
				if (signaturesData[2] != undefined && signaturesData[2].image != undefined)
					$scope.preparerSignatureData = signaturesData[2].image;
				else
					$scope.preparerSignatureData = undefined;
			}
			$scope.isDataLoading = false;
		}, function (error) {
			$scope.isDataLoading = false;
		});
	};
	
	/**
	 * Save function
	 * IF any address available then it saves address in both office as well as preparer data.
	 * IF office is not empty then check whether all properties are not undefined then set 'isOfficeDone' true else false 
	 * IF preparer is not empty then check whether all properties are not undefined then set 'isPreparerDone' true else false
	 * Save changes
	 */
	$scope.save = function(){

		var deffered = $q.defer();

		//Flag indicates that either office or preparer is not empty.
		var isOfficeOrPreparerAvailable = false;
		$scope.office.addressType = $scope.addressType.id;

		// if($scope.addressType.id == "usAddress"){
		// 	//checks whether usAddress is there then assign it to both office and preparer
		// 	if(!_.isEmpty($scope.usAddress)){
		// 		if((!_.isUndefined($scope.usAddress.street) && $scope.usAddress.street != "") || (!_.isUndefined($scope.usAddress.city) && $scope.usAddress.city != "") || (!_.isUndefined($scope.usAddress.zipCode) && $scope.usAddress.zipCode != "") || (!_.isUndefined($scope.usAddress.state) && $scope.usAddress.state != "") || (!_.isUndefined($scope.usAddress.telephone) && $scope.usAddress.telephone != "")){
		// 			$scope.office.usAddress = $scope.usAddress;					
		// 			$scope.preparer.usAddress = $scope.usAddress;					
		// 		}
				
		// 		if(!_.isUndefined($scope.usAddress.telephone) && $scope.usAddress.telephone != ""){
		// 			$scope.preparer.telephone = $scope.usAddress.telephone;
		// 		}
		// 	}
		// 	$scope.office.foreignAddress = {};
		// 	$scope.preparer.foreignAddress = {};
		// }else{			
		// 	//checks whether foreignAddress is there then assign it to both office and preparer
		// 	if(!_.isEmpty($scope.foreignAddress)){
		// 		if((!_.isUndefined($scope.foreignAddress.street) && $scope.foreignAddress.street != "") || (!_.isUndefined($scope.foreignAddress.city) && $scope.foreignAddress.city != "") || (!_.isUndefined($scope.foreignAddress.postalCode) && $scope.foreignAddress.postalCode != "") || (!_.isUndefined($scope.foreignAddress.state) && $scope.foreignAddress.state != "") || (!_.isUndefined($scope.foreignAddress.country) && $scope.foreignAddress.country != "") || (!_.isUndefined($scope.foreignAddress.telephone) && $scope.foreignAddress.telephone != "")){
		// 			$scope.office.foreignAddress = $scope.foreignAddress;					
		// 			$scope.preparer.foreignAddress = $scope.foreignAddress;					
		// 		}			
		// 	}
		// 	$scope.office.usAddress = {};
		// 	$scope.preparer.usAddress = {};
		// }
		
		//checks whether office is there
		if(!_.isEmpty($scope.office)){
			//IF anyone is not blank then set flag to true
			if((!_.isUndefined($scope.office.name) && $scope.office.name != "") || (!_.isUndefined($scope.office.efin) && $scope.office.efin != "") || (!_.isUndefined($scope.office.contactFirstName) && $scope.office.contactFirstName != "") || (!_.isUndefined($scope.office.contactLastName) && $scope.office.contactLastName != "")){
				isOfficeOrPreparerAvailable = true;
			}
			
			if(!_.isUndefined($scope.preparer.preparerFname) && $scope.preparer.preparerFname != "" && !_.isUndefined($scope.preparer.preparerLname) && $scope.preparer.preparerLname != ""){
				$scope.preparer.preparerName = $scope.preparer.preparerFname + " " + $scope.preparer.preparerLname;
			}else{
				$scope.preparer.preparerName = $scope.office.contactFirstName + " " + $scope.office.contactLastName;
			}
			
			if(_.isUndefined($scope.preparer.firmName) || $scope.preparer.firmName == ""){
				$scope.preparer.firmName = $scope.office.name;
			}
		}
		
		//checks whether preparer is there
		if(!_.isEmpty($scope.preparer)){
			//IF anyone is not blank then set flag to true
			if((!_.isUndefined($scope.preparer.preparerId) && $scope.preparer.preparerId != "") || (!_.isUndefined($scope.preparer.preparerName) && $scope.preparer.preparerName != "") || (!_.isUndefined($scope.preparer.preparerSsn) && $scope.preparer.preparerSsn != "") && (!_.isUndefined($scope.preparer.preparerTin) && $scope.preparer.preparerTin != "") || (!_.isUndefined($scope.preparer.firmName) && $scope.preparer.firmName != "")){
				isOfficeOrPreparerAvailable = true;
			}
		}
		
		//IF at least office or preparer available then make api request
		if(isOfficeOrPreparerAvailable){
			//assign preparerId to associatedPreparerId
			$scope.office.associatedPreparerId = $scope.preparer.preparerId;
			//set doNotShowAgain
			var setupConfig = {doNotShowAgain : $scope.doNotShowAgain};

			if($scope.userMainInfo.EfinEfilingStatus == 2) {
				$scope.office.paperFilingOnly = true;
			} else {
				$scope.office.paperFilingOnly = false;
			}

			setupService.save($scope.office, $scope.preparer, setupConfig).then(function(setupConfig){
				//if efin is changed then change efinStatus to pending(if efin letter is not uploaded for updated efin)
				if($scope.oldEfin != $scope.office.efin && $scope.oldDocumentId == $scope.office.documentId && $scope.office.efinStatus != 5){
					$scope.office.efinStatus = 0;
				}
				//To avoid synchronize data from server we modified location locally.				
				//update data 
				locationData.associatedPreparerId =$scope.preparer.preparerId;
				userService.setLocationData(locationData);
				//update config
				userService.updateLocationsSetUpConfig(setupConfig);

				if ($scope.preparer.isTelephoneVerified == true && $scope.preparer.isEmailVerified == true &&
					$scope.isOfficeInvalid == false) {
					$scope.screenHandler.isVeriyBtnDisabled = false;
				}

				messageService.showMessage('Setup information saved successfully.', 'success', 'SUCCESS_MSG');
				deffered.resolve();
				// $location.path(redirectUrl);
			});
		}else{
			$location.path(redirectUrl);
		}
		return deffered.promise;
	};
	
	/**
	 * On skip button we will set doNotShowAgain flag in location.
	 */
	$scope.skip = function(){
		if(!locationData.settings){
			locationData.settings = {};
		}
		
		if(!locationData.settings.setupConfig){
			locationData.settings.setupConfig = {};
		}
		
		var setupConfig = locationData.settings.setupConfig;
		setupConfig.doNotShowAgain = $scope.doNotShowAgain;
		setupService.updateSetupConfigFlags(setupConfig).then(function(){
			var locationSetUpConfigResult = {};
			locationSetUpConfigResult[locationData.locationId] = {"setupConfig": setupConfig};
			userService.updateLocationsSetUpConfig(locationSetUpConfigResult);
			$location.path(redirectUrl);
		});
	};

	//This Function is used to open dialog 
	$scope.openUploadEfinLetterDialog = function(){
		utilityService.openUploadEfinLetterDialog({'key':$scope.office.locationId,'firmName':$scope.office.name,"efin":$scope.office.efin}).then(function(result){
            if(angular.isDefined(result) && result.data.code === 2000){
                $scope.office.efinStatus =1;
                $scope.office.documentId = result.data.data.documentId;
            }   
		},function(error){
			$log.error(error);
		});
	}

	//This Function is used to open efin letter dialog for preparer
	$scope.openPreparerEfinLetterDialog = function () {
		if($scope.userMainInfo.EfinEfilingStatus == 0) {
			utilityService.openUploadEfinLetterDialog({ 'key': $scope.office.locationId, 'firmName': $scope.office.name, "efin": $scope.office.efin }).then(function (result) {
				if (angular.isDefined(result) && result.data.code === 2000) {
					$scope.office.efinStatus = 1;
					$scope.office.documentId = result.data.data.documentId;
				}
			}, function (error) {
				$log.error(error);
			});
		}
	}

	$scope.getPreparerData = function(id){
		var obj= _.find($scope.preparerList,{"preparerId":id});
		if(obj !=undefined){
			$scope.preparer = _.cloneDeep(obj);
			//if preparer fname or lname is undefined or blank then we assign preparerName to it
			if((_.isUndefined($scope.preparer.preparerFname) || $scope.preparer.preparerFname == "") && (_.isUndefined($scope.preparer.preparerLname) || $scope.preparer.preparerLname == "")){
				//split name
				var splitPreparerName= $scope.preparer.preparerName.split(' ');    
				$scope.preparer.preparerFname = splitPreparerName[0];        	
				$scope.preparer.preparerLname = splitPreparerName[1];        	
			}
		}else {
			$scope.preparer ={preparerId : id , preparerName:'',preparerFname:'',preparerLname:'',preparerSsn:'',preparerTin:'',firmName:''}
			//in case of new register user we assign fname and lname of office contact person 
			if(_.isUndefined($scope.preparerList) || _.isEmpty($scope.preparerList)){
				$scope.preparer.preparerFname =$scope.office.contactFirstName;
				$scope.preparer.preparerLname = $scope.office.contactLastName;
			}
		}
	}

	//This function used to check is efin changed , if changed then we change efin status to 'Not Verified'
	$scope.isEfinChange = function(){
		if(($scope.oldEfin != $scope.office.efin || 
			(( $scope.oldEfin == undefined || $scope.oldEfin == '' ) && $scope.office.efin != undefined && $scope.office.efin != '')) &&
			 ($scope.office.documentId == undefined || $scope.office.documentId == '') && ($scope.office.efinStatus != 5)) {
				$scope.office.efinStatus = 0;
		}
	}

	$scope.captureSignature = function () {
		var _captureObjectArray = [];
		if ((!_.isUndefined($scope.office.name) && $scope.office.name != "") || (!_.isUndefined($scope.office.efin) && $scope.office.efin != "") || (!_.isUndefined($scope.office.contactFirstName) && $scope.office.contactFirstName != "") || (!_.isUndefined($scope.office.contactLastName) && $scope.office.contactLastName != "")) {
			_captureObjectArray.push({
				type: 1,
				ID: $scope.office.locationId,
				name: $scope.office.name
			});
		}
		if ((!_.isUndefined($scope.preparer.preparerId) && $scope.preparer.preparerId != "") || (!_.isUndefined($scope.preparer.preparerName) && $scope.preparer.preparerName != "") || (!_.isUndefined($scope.preparer.preparerSsn) && $scope.preparer.preparerSsn != "") && (!_.isUndefined($scope.preparer.preparerTin) && $scope.preparer.preparerTin != "") || (!_.isUndefined($scope.preparer.firmName) && $scope.preparer.firmName != "")) {
			_captureObjectArray.push({
				type: 2,
				ID: $scope.preparer.preparerId,
				name: $scope.preparer.preparerName
			});
		}
		signatureService.openSignatureCaptureDialog(_captureObjectArray).then(function (result) {
			if (angular.isDefined(result) && result === true) {
				_signatureViewAll(true);
			}
		}, function (error) {
			$log.error(error);
		});
	};

	$scope.removeSignature = function (type) {
		var signatureTypeObject;
		if (type == 1)
			signatureTypeObject = { type: 1, ID: $scope.office.locationId };
		else
			signatureTypeObject = { type: 2, ID: $scope.preparer.preparerId };

		signatureService.removeSignature(signatureTypeObject).then(function (signaturesData) {
			_signatureViewAll(true);
		}, function (error) {
		});
	};

	//Temporary function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function(){
		if(environment.mode=='beta' || environment.mode=='local')
			return true;
		else
			return false;
	};

	// method to show and hide the feature according to the reseller config
	$scope.hasFeature = function (featureName) {
		return resellerService.hasFeature(featureName);
	};   
	
	
    //check for License
    $scope.hasLicense = function (licenseName) {
       return userService.getLicenseValue(licenseName);
    };

	/** 
	 * Initialization section
	 */
	_init();
}]);

setup.service("setupService", ['$http', '$q', 'dataAPI', function($http, $q, dataAPI){
	var setupService = {};
	
	setupService.save = function(office, preparer, quickSetup){
		var deffered = $q.defer();
		
		$http({
			method : "post",
			url : dataAPI.base_url + "/setup/save",
			data : {
				office: office,
				preparer: preparer,
				setupConfig: quickSetup
			}
		}).then(function(response){
			deffered.resolve(response.data.data);
		},function(error){
			deffered.reject(error);
		});		
		
		return deffered.promise;
	};
	
	setupService.updateSetupConfigFlags = function(quickSetup){
		var deffered = $q.defer();
		
		$http({
			method : "post",
			url : dataAPI.base_url + "/setup/updateSetupConfigFlags",
			data : {
				setupConfig: quickSetup
			}
		}).then(function(response){
			deffered.resolve();
		},function(error){
			deffered.reject(error);
		});		
		
		return deffered.promise;
	};
	
	setupService.get = function(){
		var deffered = $q.defer();
		
		$http({
			method : "post",
			url : dataAPI.base_url + "/setup/get"
		}).then(function(response){
			deffered.resolve(response.data.data);
		},function(error){
			deffered.reject(error);
		});		
		
		return deffered.promise;
	};	
	
	// api call for user verify in IDME
	setupService.verify = function (token) {
		var deffered = $q.defer();

		$http({
			method: "post",
			url: dataAPI.base_url + "/setup/idme/verifyUser",
			data: {
				accessToken: token
			}
		}).then(function (response) {
			if (response.data.data) {
				deffered.resolve(response.data.data);
			}
		}, function (error) {
			console.log('error')
			deffered.reject(error);
		});

		return deffered.promise;
	};

	// api call for questions Answers List for quick office setup
	setupService.getQuestionsAnswersList = function (objectToGetEVSQuestionList) {
		var deffered = $q.defer();
		$http({
			method: "post",
			url: dataAPI.base_url + "/setup/evs/verification",
			data: { 'FirstName': objectToGetEVSQuestionList.preparerFname, 'LastName': objectToGetEVSQuestionList.preparerLname, 'Ssn': objectToGetEVSQuestionList.preparerSsn, 'Street': objectToGetEVSQuestionList.street, 'City': objectToGetEVSQuestionList.city, 'State': objectToGetEVSQuestionList.state, 'ZipCode': objectToGetEVSQuestionList.zipCode, 'EmailAddress': objectToGetEVSQuestionList.email }
		}).then(function (response) {
			deffered.resolve(response.data);
		}, function (error) {
			deffered.reject(error);
		});
		return deffered.promise;
	}

	// api call for verification of Answers
	setupService.verificationQuestionAnswers = function (questionsAnswersList, questionsId, preparerId, count, nextAttemptPossible) {
		var deffered = $q.defer();
		$http({
			method: "post",
			url: dataAPI.base_url + "/setup/evs/verifyAnswers",
			data: { 'evsAnswerData': questionsAnswersList, 'id': questionsId, 'preparerId': preparerId, 'nextAttemptPossible': nextAttemptPossible, 'count': count }
		}).then(function (response) {
			deffered.resolve(response.data.data);
		}, function (error) {
			deffered.reject(error);
		});
		return deffered.promise;
	}

	// api call for update Efin efile status and is single user
	setupService.AddSingleOfficeUserFlag = function (data) {
		var deffered = $q.defer();

		$http({
			method: "post",
			url: dataAPI.base_url + "/setup/addSingleOfficeFlag",
			data: {
				data: data,
			}
		}).then(function (response) {
			deffered.resolve(response.data.data);
		}, function (error) {
			deffered.reject(error);
		});

		return deffered.promise;
	}

	return setupService;
}]);

/**
 *  Controller for Dialog of Telephone Verification code..
 */
setup.controller('telephoneVerificationDialogController', ['$scope', '$modalInstance', 'data', '$q', '$log', '$http', 'dataAPI', function ($scope, $modalInstance, data, $q, $log, $http, dataAPI) {

	$scope.telephoneNumber = data.telephoneNumber;
	$scope.isCodeSend = true;
	$scope.inValidcode = false;
	$scope.showResendMsg = false;
	$scope.codeExpired = false;
	var countryCode = '';
	var codeId = "";

	//  Close dialog
	$scope.close = function () {
		$scope.inValidcode = false;
		$scope.showResendMsg = false;
		$modalInstance.dismiss('Canceled');
	};

	// resendCode calls api to Resend verification code 
	$scope.resendCode = function () {
		$scope.showResendMsg = true;
		$scope.inValidcode = false;
		$scope.sendTelephoneNumberToVerifyCode();
		$scope.verificationCode = "";
	};

	// ValidateCode calls api to check verification code
	$scope.validateCode = function () {
		var deffered = $q.defer();
		$scope.showResendMsg = false;
		// Call post api to validate Telephone VerificationCode
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/setup/verifyPhone',
			data: {
				'countryCode': countryCode,
				'phone': $scope.telephoneNumber,
				'code': $scope.verificationCode,
				'id': codeId
			}
		}).then(function (response) {
			if (response.data.code === 9000) {
				$modalInstance.close(true);
			} else if (response.data.code === 9001) {
				$scope.inValidcode = true;
				$scope.codeExpired = false;
			}
			else if (response.data.code === 9002) {
				$scope.codeExpired = true;
				$scope.inValidcode = false;
			}
		}, function (error) {
			$log.error();
			deffered.reject();
		});
	};

	// sendTelephoneNumberToVerifyCode calls api to send telephoneNumber to get code
	$scope.sendTelephoneNumberToVerifyCode = function () {
		$scope.codeExpired = false;
		$scope.inValidcode = false;
		if ($scope.telephoneNumber !== undefined && $scope.telephoneNumber.replace(/[\(\)-]+/g,'') == '9825626294' ) {
			countryCode = '+91'
		}
		if($scope.telephoneNumber !== undefined) {
			$scope.telephoneNumber = $scope.telephoneNumber.replace(/[\(\)-]+/g,'')
		}
		var deffered = $q.defer();
		// Call api to send Telephone Verificationcode 
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/setup/send/textMessage',
			data: {
				'countryCode': countryCode,
				'phone': $scope.telephoneNumber
			}
		}).then(function (response) {
			codeId = response.data.data;
			$scope.isCodeSend = true;
		}, function (error) {
			$log.error();
			deffered.reject();
		});
	};
	$scope.sendTelephoneNumberToVerifyCode();
}]);


// dialog for verification of evs questions and answers
setup.controller("verificationQuestionsDialogController", ['$scope', '$modalInstance', 'setupService', 'data', 'messageService', function ($scope, $modalInstance, setupService, data, messageService) {

	$scope.isDataLoading = true;
	// to store response data to pass in another api call as request data
	$scope.isQuestionAnswersVerified = false;
	$scope.allQuestions = [];
	$scope.AtteptAnswer = []
	$scope.numberofAttept = 0;
	var noOfQuestion = 3
	// to verify questions answers
	$scope.verificationQuestionAnswers = function () {
		$scope.isDataLoading = true;
		var nextAttemptPossible;
		var count = $scope.questionsAnswersList.length;
		if ($scope.numberofAttept == 0) {
			if ($scope.allQuestions.length > noOfQuestion) {
				nextAttemptPossible = true
			} else {
				nextAttemptPossible = undefined;
			}
		}
		setupService.verificationQuestionAnswers($scope.questionsAnswersList, data.response.id, data.preparerId, count, nextAttemptPossible).then(function (response) {
			$scope.isDataLoading = false;
			// messageService.showMessage('Congratulations! Your identity is verified successfully ', 'success', 'SUCCESS_MSG');
			if (response.correctAnswerCount === $scope.questionsAnswersList.length) {
				$scope.isQuestionAnswersVerified = true;
			} else if (nextAttemptPossible == true && response.correctAnswerCount === $scope.questionsAnswersList.length - 1) {
				_nextAtteptForAnswer();
			} else {
				$scope.isQuestionAnswersVerified = false;
				messageService.showMessage('Fail to verify your identity.', 'info', 'INFO_MSG');
				$modalInstance.close($scope.isQuestionAnswersVerified);
			}
		}, function (error) {
			$scope.isDataLoading = false;
		});
	}

	var _nextAtteptForAnswer = function () {
		if ($scope.numberofAttept == 0) {
			$scope.AtteptAnswer = [];
			$scope.numberofAttept = 1;
			if ($scope.allQuestions && $scope.allQuestions.length > noOfQuestion) {
				$scope.questionsAnswersList = $scope.allQuestions.slice(noOfQuestion, noOfQuestion + 3);
			} else {
				$scope.isQuestionAnswersVerified = false;
				messageService.showMessage('Fail to verify your identity.', 'info', 'INFO_MSG');
				$modalInstance.close($scope.isQuestionAnswersVerified);
			}
		}
	}
	//  Close dialog
	$scope.close = function () {
		$modalInstance.close($scope.isQuestionAnswersVerified);
	};

	$scope.setCountOfAttendedQuestions = function (id) {
		if ($scope.AtteptAnswer.indexOf(id) == -1) {
			$scope.AtteptAnswer.push(id)
		}
	}
	//  Close dialog
	$scope.dismiss = function () {
		$modalInstance.dismiss('Canceled');
	};
	var _init = function () {
		$scope.isDataLoading = true;
		setupService.getQuestionsAnswersList(data.objectToGetEVSQuestionList).then(function (res) {
			if(res && res.code == 2009) {
				$modalInstance.close('EfinRequired');
			} else {
				data.response = res.data;
				$scope.allQuestions = angular.copy(res.data.questions);
				$scope.questionsAnswersList = $scope.allQuestions.slice(0, noOfQuestion);
			}
			$scope.isDataLoading = false;
		}, function (error) {
			$scope.isDataLoading = false;
		})
	}
	_init()
}]);

/**
 *  Controller for Email Verification code..
 */
setup.controller('EmailVerifyDialogController', ['$scope', '$modalInstance', '$q', '$log', '$filter', '$http', 'dataAPI', 'userService', 'data', 'messageService', function ($scope, $modalInstance, $q, $log, $filter, $http, dataAPI, userService, data, messageService) {

	$scope.email = data.email;
	$scope.IsCodeSend = true;
	$scope.InValidcode = false;
	$scope.ErrorCode = false;
	$scope.showResendMsg = false;
	$scope.reqId = ''
	//  Close dialog
	$scope.close = function () {
		$scope.InValidcode = false;
		$scope.ErrorCode = false;
		$scope.showResendMsg = false;
		$modalInstance.dismiss('Canceled');
	};

	///resend verification code 
	$scope.ResendCode = function () {
		$scope.showResendMsg = true;
		$scope.InValidcode = false;
		$scope.ErrorCode = false;
		$scope.SendEmailVerificationcode();
		$scope.verificationCode = "";
	};

	//   ValidateCode 
	$scope.ValidateCode = function () {
		var deffered = $q.defer();
		$scope.showResendMsg = false;
		//Call to print post api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/setup/verification/verifyMail',
			data: {
				'verificationCode': $scope.verificationCode,
				'id': $scope.reqId
			}
		}).then(function (response) {
			console.log(response.data)
			if (response.data.code === 9000) {
				$scope.InValidcode = false;
				$scope.ErrorCode = false;
				$modalInstance.close(response.data.code);
			} else if (response.data.code === 9001) {
				$scope.InValidcode = true;
				messageService.showMessage('Please enter valid code.', 'info', 'INFO_MSG');
			} else if (response.data.code === 9002) {
				$scope.ErrorCode = true;
				messageService.showMessage('Please enter new code.Your code is expired.', 'info', 'INFO_MSG');
			}
		}, function (error) {
			$scope.ErrorCode = true;
			$log.error();
			deffered.reject();
		});
	};

	//   SendVerification code
	$scope.SendEmailVerificationcode = function () {
		var deffered = $q.defer();
		//Call to print post api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/setup/verification/sendMail',
			data: {
				'mail': $scope.email
			}

		}).then(function (response) {
			$scope.IsCodeSend = true;
			if (response && response.data && response.data.data) {
				$scope.reqId = response.data.data.id
			}
		}, function (error) {
			$log.error();
			deffered.reject();
		});
	};
	$scope.SendEmailVerificationcode();
}]);

/**
 *  Controller for confirm Dialog.
 */
setup.controller('setupConfirmDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
	$scope.preparerInfo = angular.copy(data.preparer);
	$scope.type = data.type;
	$scope.officeInfo = angular.copy(data.office);
	$scope.addressTypeOwner = 'usAddress';
	$scope.addressType = 'usAddress';
	$scope.confirmType;
	//  Close dialog
	$scope.close = function (data) {
		$modalInstance.close(data);
	};

	var _init = function () {
		if (!$scope.preparerInfo.usAddress) {
			$scope.preparerInfo.usAddress = {}
		}
		if ($scope.preparerInfo.telephone !== undefined && typeof ($scope.preparerInfo.telephone) == 'string') {
			$scope.preparerInfo.telephone = $scope.preparerInfo.telephone.split(')').join(') ')
		}
		if ($scope.officeInfo.businessPhone !== undefined && typeof ($scope.officeInfo.businessPhone) == 'string') {
			$scope.officeInfo.businessPhone = $scope.officeInfo.businessPhone.split(')').join(') ')
		}
	}
	_init()
}]);


/**
 *  Controller for confirm Dialog.
 */
setup.controller('setupAlertDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
	$scope.type = data.type
	//  Close dialog
	$scope.dismiss = function () {
		$modalInstance.dismiss('Canceled');
	};

	$scope.close = function (data) {
		$modalInstance.close(data);
	}

}]);