'use strict';
var commonController = angular.module('commonController', []);


//subscription dialog controller
commonController.controller('subscriptionDialogController', ['$scope', '$modalInstance', '$log', 'userService', 'data', 'resellerService', 'systemConfig', function ($scope, $modalInstance, $log, userService, data, resellerService, systemConfig) {
	$scope.bankProducts = false;
	if (!_.isUndefined(data) && !_.isUndefined(data.bankProducts))
		$scope.bankProducts = data.bankProducts;
	else
		$scope.bankProducts = false;

	$scope.data = data;

	//get appname from resellerService
	$scope.appName = resellerService.getValue("appName");

	//get tax year
	var taxYear = userService.getTaxYear();

	//get licenceName
	$scope.licenseName = systemConfig.getLicenseDisplayText(userService.getLicenseValue('licenseName', taxYear));

	var userDetails = userService.getUserDetails();
	//get master location details
	if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
		var masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
		if (!angular.isUndefined(masterLocationDetails) && !angular.isUndefined(masterLocationDetails.customerNumber)) {
			$scope.hasCustomerId = true;
		}
	}

    /*
	 *  Success
	 */
	$scope.subscribe = function () {
		// unlock api call
		$modalInstance.close();
	};

    /*
	 *  Cancel 
	 */
	$scope.close = function () {
		$modalInstance.dismiss('Canceled');
	};

    /**
     * method to show and hide the feature according to the reseller config
     */
	$scope.hasFeature = function (featureName) {
		return resellerService.hasFeature(featureName);
	};

}]);

//export controller
commonController.controller('exportHeaderSelectionController', ['$scope', '$modalInstance', '$window', 'data', function ($scope, $modalInstance, $window, data) {

	$scope.headerList = data.headerList;//require to show header list in html

	var gridFilterOrderedData = data.gridFilterOrderedData; //get filterdata

	$scope.type = data.type;//get type for export like pdf or csv for now 

	$scope.exportFileName = data.exportFileName;//get export file name

	$scope.viewType = data.viewType;
	if (_.isUndefined($scope.viewType)) {
		$scope.viewType = 'landscape';
	}

	//create export list base which column user is selected
	$scope.getSelectedDataList = function () {
		//change only for in case of efile export list mantis #26283
		if ($scope.exportFileName == 'eFileSummaryList') {
			var obj = _.find($scope.headerList, { "key": "eFileStateName" });
			var gridFilterOrderedDataFilteredData = [];
			if (obj.isSelected == false) {
				_.forEach(gridFilterOrderedData, function (state) {
					if (state.eFileStateName.toLowerCase() == 'federal') {
						gridFilterOrderedDataFilteredData.push(state);
					}
				});
				gridFilterOrderedData = gridFilterOrderedDataFilteredData;
			}
		}
		var exportReaturnList = [];
		_.forEach(gridFilterOrderedData, function (returnObj) {
			var csvObj = {};
			_.forEach($scope.headerList, function (header) {

				if (header.isSelected) {
					var value = _.cloneDeep(returnObj);
					//splitout properties by dot
					var properties = header.key.split('.');
					//Loop till last property
					while (properties.length && (value = value[properties.shift()])) { }

					csvObj[header.key] = value;
				}
			});
			exportReaturnList.push(csvObj);
		});
		return exportReaturnList;
	};

	//prepare header5 list for csv
	$scope.getHeaderListForCSV = function () {
		var selectedHeaderList = [];
		_.forEach($scope.headerList, function (header) {
			if (header.isSelected)
				selectedHeaderList.push(header.text);
		});
		return selectedHeaderList;
	};

	//Close of dialog should not stop process of add form 
	$scope.cancel = function () {
		$modalInstance.dismiss('Canceled');
	};

	$scope.printPdf = function () {
		var body = [];//to hold body part of pdf
		var headreNameList = [];//to hold selected header list
		var widths = []; // hold widths
		//create header list which user column selected 
		//only for pdf :note : here user can pass width if not passed then default '*'can be taken 
		_.forEach($scope.headerList, function (header) {
			if (header.isSelected) {
				headreNameList.push({ text: header.text, style: 'tableHeader' });
				var headerwidth = header.width == undefined ? '*' : header.width;
				widths.push(headerwidth);
			}
		});
		body.push(headreNameList);
		var temp = []; /// to hold temporary list for body with selected key 
		var selectedDataList = $scope.getSelectedDataList();

		//prepare list as require for pdf 
		_.forEach(selectedDataList, function (obj, key) {
			var keys = _.keys(obj);//get all selected keys
			temp = [];//make temp empty 
			_.forEach(keys, function (key) {
				temp.push(obj[key]);
			});
			body.push(temp);
		});
		var content = [];//to hold enitire content of pdf
		content.push({ table: { widths: widths, body: body }, layout: 'lightHorizontalLines' });
		// this object hold css content to design table alignment and  table content. 
		var docDefinition = {
			pageSize: 'A4',
			footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
			content: content,
			pageOrientation: $scope.viewType,
			pageMargins: [20, 40, 20, 40],
			styles: {
				tableHeader: {
					bold: true,
					fontSize: 12,
					color: 'black',
					fillColor: '#eaeaea'
				}
			},
			defaultStyle: {
				fontSize: 12,
			}
		};

		var iOS = ($window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
		if (iOS == true)
			pdfMake.createPdf(docDefinition).open();
		else
			pdfMake.createPdf(docDefinition).download($scope.exportFileName + ".pdf");
		//after complete just close header slection dialoge 
		$modalInstance.dismiss('Canceled');
	};
}]);


//register  dialog controller
//INCase of Demo user we prompt user to register. IF user tries to register then we first log him of and then redirect to register screen.
commonController.controller('salesDialogController', ['$scope', '$modalInstance', '$location', '$routeParams', 'userService', 'authService', 'data', function ($scope, $modalInstance, $location, $routeParams, userService, authService, data) {

	//If demo user try to open any of urls provided as below by url. He/She will be prompted with dialog to either register
	//or continue with demo (which redirect user to home page)

	// initialization function
	var _init = function () {
		$scope.content = data;
	};

    /*
	 *  register now
	 */
	$scope.registerNow = function () {
		$modalInstance.close();
		//Check demo user

		// Logout that user.
		authService.logout().then(function (success) {
			// on success of logout redirect to registration.
			$location.path('/registration');
		}, function (error) {
			$log.error(error);
		});

	};

    /*
	 *  Cancel 
	 */
	$scope.close = function () {
		//get current location path
		var curPath = $location.path();
		var routeParameterArray = _.values($routeParams);

		if (routeParameterArray.length > 0) {
			curPath = curPath.substring(0, curPath.indexOf("/" + routeParameterArray[0]));
		}

		if (_.includes($scope.content.urls, curPath)) {
			$location.path("/home");
		}

		$modalInstance.dismiss('Canceled');
	};

	/*
	 * Initialization
	 * 
	 */

	_init();
}]);


//register  dialog controller
//INCase of Demo user we prompt user to register. IF user tries to register then we first log him of and then redirect to register screen.
commonController.controller('newVersionReleasedDialogController', ['$scope', '$modalInstance', '$location', '$injector', '$window', 'data', function ($scope, $modalInstance, $location, $injector, $window, data) {

	$scope.isProcessing = false;

	//sourceOfAction - As we are using this release dialog for multiple uses, like for new updates from offline (app only) and from couchbase both, 
	//we need information for which it is called. so, we can take custom action accordingly
	//We are not using $rootScope to avoid unnecessory bindings and digest cycles.
	var sourceOfAction = ''
	if (!_.isUndefined(data) && !_.isUndefined(data.sourceOfAction)) {
		sourceOfAction = data.sourceOfAction;
	}


	/*
	 *  reload page
	 */
	$scope.reloadPage = function () {
		$scope.isProcessing = true;
		//IF user in have open return then we will save return and then we will refresh the page. 
		if ($location.path().indexOf("/return/edit") > -1) {
			var returnService = $injector.get('returnService');
			returnService.saveReturn(false).then(function () {
				$window.location.reload();
			}, function (error) {
				$log.error(error);
				$modalInstance.close();
			});
		} else {
			$window.location.reload();
		}
	};

	/*
	 *  Cancel 
	 */
	$scope.close = function () {
		$modalInstance.dismiss('Canceled');
		//
		if (sourceOfAction == 'offline') {
			var _serviceWorkerIPC = $injector.get('serviceWorkerIPC');
			_serviceWorkerIPC.checkForCacheUpdate();
		}
	};

}]);

//Renewal Notification Dialog
commonController.controller('renewalNotificationDialogController', ['$scope', '$modalInstance', '$injector', '$filter', '$log', 'data', 'userService', 'resellerService', function ($scope, $modalInstance, $injector, $filter, $log, data, userService, resellerService) {
	$scope.isProcessing = false;

	//The following flag is used to check whether user have selected this option or not.
	$scope.is2015DialogSkipped = false;

	/**
     * method to show and hide the feature according to the reseller config
     */
	$scope.hasFeature = function (featureName) {
		return resellerService.hasFeature(featureName);
	};

	//we pass the payment status from dialog configuration, instead of using $rootscope variable, 
	//to avoid unnecessary digest cycle for the dialog as nothing's going to be change in dialog.
	$scope.paymentStatus = "";
	if (!_.isUndefined(data) && !_.isUndefined(data.paymentStatus)) {
		$scope.paymentStatus = data.paymentStatus;
	}

	//expiration date for annual offer - start
	var momentInPST = moment().tz("America/Los_Angeles");
	if (momentInPST.month() == 3 && momentInPST.date() <= 3) {
		$scope.expirationDate = $filter('date')(new Date(momentInPST.year(), momentInPST.month(), 3), 'longDate');
	} else {
		momentInPST = moment().tz("America/Los_Angeles").endOf('month');
		$scope.expirationDate = $filter('date')(new Date(momentInPST.year(), momentInPST.month(), momentInPST.date()), 'longDate');
	}
	//expiration date for annual offer - end

	//calculate price for 2015TaxSoftware dialog
	$scope.price = 149.95;
	if (momentInPST.year() == 2015 && (momentInPST.month() > 3 || (momentInPST.month() === 3 && momentInPST.date() > 3))) {
		$scope.price += (momentInPST.month() - 2) * 10;
	} else if (momentInPST.year() != 2015) {
		$scope.price = 249.95;
	}

	// Price must not be larger then 249.95
	if ($scope.price > 249.95) {
		$scope.price = 249.95;
	}
	//calculate price for 2015TaxSoftware dialog end

	/*
	 *  reload page
	 */
	$scope.renewNow = function () {
		if ($scope.hasFeature('SUBSCRIPTION')) {
			$scope.isProcessing = true;
			//Redirect User to subscription.
			var userService = $injector.get('userService');
			var subscriptionService = $injector.get('subscriptionService');

			subscriptionService.goToSubscription(userService.getValue('masterLocationData.customerNumber'));
		}
	};

	//IF payment status is 'lock' then we allow user to logout or do the payment.
	// HERE we redirect to logout page.. to make code consistent .. We do the same while doing log out from headerNav controller.
	$scope.logout = function () {
		$modalInstance.dismiss('Canceled');
		var location = $injector.get('$location');
		location.path('/logout');
	};

	// IN 2015TaxSoftware Dialog IF user press skip now we check whether 'do not show me again' checkbox is ticked or not.
	// IF ticked we will call an API.
	$scope.skipNow = function () {
		$modalInstance.dismiss('Canceled');
		//IF flag is true then update the user settings
		if ($scope.is2015DialogSkipped == true) {
			userService.changeSettings('is2015DialogSkipped', true).then(function (success) {
				//No operation required
			}, function (error) {
				$log.error(error);
			});
		}
	};

	/*
	 *  Cancel 
	 */
	$scope.close = function () {
		$modalInstance.dismiss('Canceled');
	};

}]);


//intro Dialog
commonController.controller('introDialogController', ['$scope', '$modalInstance', 'resellerService', function ($scope, $modalInstance, resellerService) {
	/*
	 *  Close Dialog 
	 */
	$scope.closeDialog = function () {
		$modalInstance.close();
	};

	//get appName from resellerService
	$scope.appName = resellerService.getValue("appName");

}]);

//custom status dialog controller
commonController.controller('customReturnStatusDialogController', ['$scope', '$modalInstance', 'userService', 'data', function ($scope, $modalInstance, userService, data) {
	//Flag is used for showing error message text.
	$scope.isError = false;
	$scope.isProcessing = false;
	$scope.customReturnStatus = angular.copy(userService.getCustomReturnStatusList());

	/**
	 *  We will add status to local array. 
	 *  On click of 'ok' we will save it
	 */
	$scope.addStatus = function () {
		if (!_.isUndefined($scope.newTitle) && $scope.newTitle != "") {
			$scope.customReturnStatus.push({ title: $scope.newTitle, isNew: true });
			$scope.newTitle = "";
		}
	};

	/**
	 * On click of 'ok' button we will prepare 3 arrays
	 * newStatus, changedStatus and deleteStatus
	 * IF any array have length > 0 then we will make API call
	 * Due to bug in api we have to delete extra properties from arrays before API request.
	 */
	$scope.saveCustomReturnStatus = function () {
		var newStatus = [], changedStatus = [], deletedStatus = [];
		//Prepare all status in three category  
		_.forEach(angular.copy($scope.customReturnStatus), function (status) {
			if (status.isNew) {
				newStatus.push(status);
				delete status.isNew;
			} else if (status.isChanged) {
				changedStatus.push(status);
				delete status.isChanged;
			} else if (status.isDeleted) {
				deletedStatus.push(status);
				delete status.isDeleted;
			}
			delete status.isPredefined;
		});

		//IF any array will have value then only we will make API call else we will close modal.
		if (newStatus.length > 0 || changedStatus.length > 0 || deletedStatus.length > 0) {
			$scope.isProcessing = true;
			userService.saveCustomReturnStatus({ newStatus: newStatus, deletedStatus: deletedStatus, changedStatus: changedStatus }).then(function (response) {
				$scope.isProcessing = false;
				$modalInstance.close();
			}, function (error) {
				$scope.isProcessing = false;
				$scope.isError = true;
			});
		} else {
			$modalInstance.close();
		}
	};

	/**
	 *  Cancel 
	 */
	$scope.close = function () {
		$modalInstance.close();
	};
}]);



/**
 * controller for the dialog to make the return as default return
 */
commonController.controller('setReturnAsDefaultController', ['$scope', '$modalInstance', '$log', '$injector', 'data',
	function ($scope, $modalInstance, $log, $injector, data) {
		$scope.returnTitle = (!_.isUndefined(data.returnTitle) && !_.isNull(data.returnTitle)) ? data.returnTitle : '';
		var returnId = data.returnId;
		$scope.markDefaultReturn = function () {
			var returnAPIService = $injector.get('returnAPIService');
			//API call to make the return as default return
			returnAPIService.manageDefaultReturn('ADD', returnId, $scope.returnTitle).then(function (response) {
				$modalInstance.close($scope.returnTitle);
			}, function (error) {
				$log.error(error);
			});
		};

		//  Close dialog
		$scope.close = function () {
			$modalInstance.dismiss('Canceled');
		};
	}]);


/**
 * controller for the dialog to make the return as default return
 */
commonController.controller('requiredPrivilegesDialogController', ['$scope', '$modalInstance', '$log', 'data', 'userService', 'rolesService',
	function ($scope, $modalInstance, $log, data, userService, rolesService) {
		//variable that holds the required privilege for the view which is requested to be loaded 
		var _requiredPrivilegesList = data.privilegesList;
		//array of object that holds the privilege category wise  
		$scope.requiredPrivileges = {};
		//variable that holds the users current location detail
		$scope.userLocationData = userService.getValue('locationData');
		/**
		 *method to load data during initialization of dialog 
		 */
		var _init = function () {
			//calling the previleges list api that holds all privilege of admin (we use admin privilege as a template) 
			rolesService.getAdminPrivileges().then(function (_adminPrivilegesList) {
				if (!_.isUndefined(_adminPrivilegesList) && !_.isEmpty(_adminPrivilegesList)) {
					//loop over the required privileges for particular page
					_.forEach(_requiredPrivilegesList, function (privilege) {
						//condition to check whether the user has that privilege or not
						if (!userService.can(privilege)) {
							var privilegeObj = _.find(_adminPrivilegesList, { name: privilege });
							if (_.isUndefined($scope.requiredPrivileges[privilegeObj.category])) {
								$scope.requiredPrivileges[privilegeObj.category] = { name: privilegeObj.category, privileges: [] };
							}
							$scope.requiredPrivileges[privilegeObj.category].privileges.push(privilegeObj);
						}
					});//End of loop
				}
			}, function (error) {
				$log.error(error);
			});
		};

		//  Close dialog
		$scope.close = function () {
			$modalInstance.dismiss('Canceled');
		};

		//Initialization
		_init();
	}]);


/**
 * controller for the dialog to list out the error message cause due to server
 */
commonController.controller('serverErrorDialogController', ['$scope', '$modalInstance', 'data',
	function ($scope, $modalInstance, data) {
		//variable that holds the error message
		$scope.errorMessage = { displayText: data.dialogMessage };

		//method to be called when clicked on 'ok' button
		$scope.logout = function () {
			$modalInstance.close();
		};

		//Close dialog
		$scope.close = function () {
			$modalInstance.dismiss('Canceled');
		};
	}]);

/**
 * controller for the dialog to list out the error message cause due to server
 */
// commonController.controller('appointmentReminderController', ['$scope', '$modalInstance', '$log', 'data', 'appointmentService', 'messageService',
// 	function ($scope, $modalInstance, $log, data, appointmentService, messageService) {
// 		//variable that holds the list of appointments and array of snooze time
// 		$scope.appointmentDetail = {
// 			appointments: data.appointments,
// 			snoozeTimeList: [
// 				{ displayText: '10 Minutes', value: 10 },
// 				{ displayText: '15 Minutes', value: 15 },
// 				{ displayText: '20 Minutes', value: 20 },
// 				{ displayText: '25 Minutes', value: 25 }
// 			]
// 		};
// 		//variable that holds the appointment detail to be shown above the list 
// 		$scope.appointment = $scope.appointmentDetail.appointments[0];

// 		//array that will store the appointment which are snooze or dismiss respectively
// 		var _snoozeAppointmentList = [];

// 		/**
// 		 * method to remove the appointment from the list on which action is taken
// 		 */
// 		var _removeAppointment = function () {
// 			var removedAppointment = _.remove($scope.appointmentDetail.appointments, function (appointmentObj) {
// 				return appointmentObj.id == $scope.appointment.id;
// 			});
// 			//condition to check the length of appointment list 
// 			if ($scope.appointmentDetail.appointments.length > 0) {
// 				$scope.appointment = $scope.appointmentDetail.appointments[0];
// 			}

// 		};

// 		/**
// 		 * method will be called when user click on the snooze button
// 		 */
// 		$scope.snoozeAppointment = function () {
// 			$scope.appointment.alertTime.setMinutes(new Date().getMinutes() + $scope.selectedSnoozeTime);
// 			$scope.appointment.snoozeCount = (_.isUndefined($scope.appointment.snoozeCount)) ? 1 : ++$scope.appointment.snoozeCount;
// 			appointmentService.save($scope.appointment).then(function (response) {
// 				_snoozeAppointmentList.push($scope.appointment);
// 				_removeAppointment();
// 				messageService.showMessage('Appointment has been snooze.', 'success', 'REMINDER_UPDATESNOOZE_SUCCESS');
// 				//after the action is done we check the appointment list if it is empty then we simply close the dialog
// 				if ($scope.appointmentDetail.appointments.length == 0) {
// 					$modalInstance.close({ snoozeAppointmentList: _snoozeAppointmentList });
// 				}
// 			}, function (error) {
// 				$log.error(error);
// 				messageService.showMessage('Something went wrong while snoozing appointment.', 'error', 'REMINDER_UPDATESNOOZE_ERROR');
// 			});

// 		};

// 		/**
// 		 * method prepared to dismiss the appointment
// 		 */
// 		$scope.dismissAppointment = function () {
// 			_removeAppointment();
// 			if ($scope.appointmentDetail.appointments.length == 0) {
// 				$modalInstance.close({ snoozeAppointmentList: _snoozeAppointmentList });
// 			}
// 		};

// 		/**
// 		 * method prepared to dismiss all the appointment which are in the list
// 		 */
// 		$scope.dismissAll = function () {
// 			$modalInstance.close({ snoozeAppointmentList: _snoozeAppointmentList });
// 		};

// 		/**
// 		 * method to select the appointment which is clicked
// 		 */
// 		$scope.selectAppointment = function (appointmentDetail) {
// 			$scope.appointment = appointmentDetail;
// 		};


// 	}]);

/**
 * controller for the terms of use and privacy policy dialog 
 */
commonController.controller('termsAndPolicyDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
	$scope.resellerConfig = "";

	if (!_.isUndefined(data) && !_.isUndefined(data.resellerConfig)) {
		$scope.resellerConfig = data.resellerConfig;
	}
	//Close dialog
	$scope.close = function () {
		$modalInstance.close();
	};
}]);

/**
 *  Controller for showing licence related  message dialog
 */
returnApp.controller('licenseErrorDialogController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

	//this flag will help us to focus on button
	$scope.focusMe = true;

	//close dialog
	$scope.close = function () {
		$modalInstance.close();
	};
}]);

/**
 *  Controller for showing waiting status dialog
 */
returnApp.controller('waitingStatusDialogController', ['$scope', '$modalInstance', '$timeout', 'data', function ($scope, $modalInstance, $timeout, data) {
	//get doNotShowDone
	$scope.doNotShowDone = data;
	//flag for showing message
	$scope.isDone = false;
	//subscription of close dialog
	var _dialogCloseSubscription = postal.subscribe({
		channel: 'MTPO-Return',
		topic: 'ProgressDialogClose',
		callback: function (data, envelope) {
			if ($scope.doNotShowDone == undefined) {
				$scope.isDone = true;
				//close dialog after 1 milisecond
				$timeout(function () {
					$scope.close();
					//close dialog callback publish
					postal.publish({
						channel: 'MTPO-Return',
						topic: 'ProgressDialogCloseCallBack',
						data: {}
					});
				}, 1000);
			} else {
				//close dialog after 0.5 milisecond
				$timeout(function () {
					$scope.close();
					//close dialog callback publish
					postal.publish({
						channel: 'MTPO-Return',
						topic: 'ProgressDialogCloseCallBack',
						data: {}
					});
				}, 500);
			}
		}
	});

	//close dilaog
	$scope.close = function () {
		$modalInstance.close();
	};

	//destroy
	$scope.$on('$destroy', function (event) {
		_dialogCloseSubscription.unsubscribe();
	})

}]);

/**
 *  Controller for showing time out warning dialog
 */
returnApp.controller('timeOutWarningDialogController', ['$scope', '$modalInstance', '$interval', 'data', function ($scope, $modalInstance, $interval, data) {

	$scope.remainingTime = Number.parseInt(data.warningTime);

	//interval for signout
	var interval = $interval(function () {
		$scope.remainingTime--;
		if ($scope.remainingTime == 0) {
			$scope.close('signout')
		}
	}, 1000);

	//close dialog
	$scope.close = function (button) {
		//cancel interval
		$interval.cancel(interval);
		$modalInstance.close(button);
	};
}]);

/**
 *  Controller for showing auto logout warning dialog
 */
returnApp.controller('taxSession24HoursWarningDialogController', ['$scope', '$modalInstance', '$interval', 'data', function ($scope, $modalInstance, $interval, data) {
	//Remaining Time in minutes
	$scope.remainingTime = Number.parseInt(data.warningTime);

	//interval for signout
	var interval = $interval(function () {
		$scope.remainingTime = $scope.remainingTime - 1;
		if ($scope.remainingTime == 0) {
			$scope.close();
		}
	}, 60000);

	//close dialog
	$scope.close = function (button) {
		//cancel interval
		$interval.cancel(interval);
		interval = undefined;
		$modalInstance.close(button);
	};
}]);

/**
 *  Controller for uploading verification letter of efin  
 */
returnApp.controller('uploadEfinLetterDialogController', ['$scope', '$modalInstance', '$timeout', 'Upload', 'dataAPI', 'data', 'messageService', 'userService', function ($scope, $modalInstance, $timeout, Upload, dataAPI, data, messageService, userService) {
	$scope.locationInfo = data;
	$scope.invalidType = false;//required to show error message that file not supported
	var pdfMimeType = 'application/pdf,application/x-pdf,application/acrobat,applications/vnd.pdf,text/pdf,text/x-pdf,';
	var jpegMimeType = 'image/jpeg,image/jpg,image/jp_,application/jpg,application/x-jpg,image/pjpeg,image/pipeg,image/vnd.swiftview-jpeg,image/x-xbitmap,image/jpe_,image/png,application/png,application/x-png,';
	$scope.acceptFileType = pdfMimeType + jpegMimeType;
	$scope.fileSizeMessage = false;//is file is maximum then 5 mb
	$scope.uploadErrMessage = false;//is any error occured on upload
	$scope.uploadProgress = 0;//declare varible to show upload progress 
	var filesOnHold;//to hold uploaded file
	$scope.isDisabled = false;

	//close dialog
	$scope.close = function (result) {
		$modalInstance.close(result);
	};

	//when user uploading any file
	$scope.onFileSelect = function ($files) {
		if (!_.isUndefined($files) && $files.length !== 0) {
			$scope.invalidType = false;
			$scope.fileSizeMessage = false;
			$scope.uploadErrMessage = false;
			$scope.uploadProgress = 0;
			filesOnHold = undefined;
			$scope.fileName = '';
			//check is file type is valid
			if (_.includes($scope.acceptFileType.split(','), $files[0].type)) {
				filesOnHold = $files[0];
				$scope.fileName = filesOnHold.name;
				if (!_.isUndefined(filesOnHold) && !_.isNull(filesOnHold)) {
					//define maximum size for uploading file
					var maxAllowedSize = 5 * 1024 * 1024;//for now maximum size is 5 mb
					//check is file is greater then 5 mb
					if (filesOnHold.size > maxAllowedSize) {
						$scope.fileSizeMessage = true;
					} else {
						$scope.isDisabled = true;
						Upload.upload({
							url: dataAPI.base_url + '/documentmanager/efin/uploadLetter',
							file: filesOnHold,
							fields: {
								upload: {
									locationId: $scope.locationInfo.locationId,
									isNewOffice: $scope.locationInfo.mode == 'create' ? true : false
								}
							}
						}).then(function (response) {
							$scope.isDisabled = false;
							$scope.uploadProgress = 0;
							$scope.close(response);
							//get userDetails
							var userDetails = userService.getUserDetails();
							//if we update currunt location 
							if (!_.isUndefined(userDetails.currentLocationId) && userDetails.currentLocationId !== '') {
								if ($scope.locationInfo.locationId === userDetails.currentLocationId) {
									//To avoid synchronize data from server we modified location locally.				
									//We have taken temp variable, because we are not sure at this point that user will save all details or not
									//so for saftey we are only syncing what is required at this point to avoid data mismatch between client and server
									var tempLocationData = angular.copy(userService.getLocationData());
									tempLocationData.efinStatus = 1;
									tempLocationData.documentId = response.data.data.documentId;
									userService.setLocationData(tempLocationData);

									//We also have to set isOfficeSetuDone as false to show red mark on widget in dashboard				
									var tempLocationSetUpConfig = {};
									tempLocationSetUpConfig[$scope.locationInfo.locationId] = { "setupConfig": { "isOfficeDone": false, "isPreparerDone": true } };
									userService.updateLocationsSetUpConfig(tempLocationSetUpConfig);

									//publish message to get refresh user headerNav data
									postal.publish({
										channel: 'MTPO-Dashboard',
										topic: 'RefreshUserHeaderNavData',
										data: {}
									});
								}
							}
							//show messaage
							messageService.showMessage('File uploaded successfully', 'success', 'DOCUMENT_UPLOADSUCESS');
						}, function (error) {
							$scope.isDisabled = false;
							$scope.uploadErrMessage = true;
							$scope.uploadProgress = 0;
						}, function (update) {
							$scope.uploadProgress = update;
						});
					}
				}
			} else {
				$scope.invalidType = true;
			}
		}
	};

}]);

/**
 * Devices Registration Dialog Controller
 */
commonController.controller('devicesRegistrationDialogController', ['$scope', '$modalInstance', '$log', '$timeout', 'messageService', 'signatureService', 'resellerService', 'socketService', 'environment', function ($scope, $modalInstance, $log, $timeout, messageService, signatureService, resellerService, socketService, environment) {

	//get signature Pad App DownloadURL from resellerConfig
	var appDownloadURL = resellerService.getValues(['appDownloadURL']);

	if (appDownloadURL != undefined && appDownloadURL['appDownloadURL'] != undefined && appDownloadURL['appDownloadURL'].signaturePadApp != undefined) {
		$scope.signaturePadAppDownloadURLAndroid = appDownloadURL['appDownloadURL'].signaturePadApp.Android;//get android URL
		$scope.signaturePadAppDownloadURLIOS = appDownloadURL['appDownloadURL'].signaturePadApp.IOS;//get IOS URL
	}

	var getAuthorizePoolRequestTimer = { "first": 10000, "next": 5000 }; //here first request with 30 sec then 15 sec 
	$scope.devicesObject = {};//to store optinal note or other fields 
	var devicesRegistrationAuthorizationID;
	var getDeviceAuthorizationTimer;

	var authorization = {
		waitingForbarcodeScan: 0,
		barcodeScanned: 1,
		authorized: 2,
		notAuthorized: 3,
	};

	//Temporary function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function () {
		if (environment.mode == 'beta' || environment.mode == 'local')
			return true;
		else
			return false;
	};

	//set status based on response
	$scope.authorizationStatus;


	//call api to get QR data on init 
	var _init = function () {
		signatureService.createDevicesRegistration().then(function (response) {
			if (response != undefined && response.data != undefined && response.data.authorizationData != undefined) {
				$scope.signatureData = response.data.authorizationData;
				devicesRegistrationAuthorizationID = response.data.ID
				$scope.authorizationStatus = authorization.waitingForbarcodeScan;//set intial status 
				//if($scope.betaOnly==true)
				startSocketConnectionWithEventsForDeviceRegistration();
				startRequestForGetAuthorization(getAuthorizePoolRequestTimer.first);
			}
		}, function (error) {
			$log.error(error);
		});
	};

	var startSocketConnectionWithEventsForDeviceRegistration = function () {
		//
		socketService.connect();

		socketService.on('connect', function () {
			socketService.emit('join', devicesRegistrationAuthorizationID, function () {
			});
		});

		//when barcode scanned from device 
		socketService.on('authorization', function (data) {
			//clear timer on socket response
			stopRequestForGetAuthorization();
			if (data != undefined && data != undefined && data.id === authorization.barcodeScanned && data.uid === devicesRegistrationAuthorizationID) {
				getDeviceAuthorization();
			}
		});

		socketService.on('reconnect_failed', function (data) {
			//after reconnection failed we can start timer
			if ($scope.authorizationStatus === authorization.waitingForbarcodeScan) {
				if (getDeviceAuthorizationTimer == undefined)
					startRequestForGetAuthorization(getAuthorizePoolRequestTimer.first);
			}
		});

		socketService.on('disconnect', function () {
			console.log("disconnection success");
		});
	};

	var getDeviceAuthorization = function () {
		signatureService.getDeviceAuthorization({ "ID": devicesRegistrationAuthorizationID }).then(function (response) {
			//check on every response is Device Information Updated or not 
			if (response.data != undefined && response.data.isDeviceInformationUpdated != undefined && response.data.isDeviceInformationUpdated == true) {
				$scope.deviceInfo = response.data;
				$scope.authorizationStatus = authorization.barcodeScanned;
				stopRequestForGetAuthorization();
			}
			else {
				startRequestForGetAuthorization(getAuthorizePoolRequestTimer.next);
			}
		}, function (error) {
			stopRequestForGetAuthorization();
			$scope.isError = true;
			$log.error(error);
		});
	};

	//interval for startRequestForGetAuthorization
	var startRequestForGetAuthorization = function (PoolAuthRequestTime) {
		getDeviceAuthorizationTimer = $timeout(function () {
			getDeviceAuthorization();
		}, PoolAuthRequestTime);
	};

	var stopRequestForGetAuthorization = function () {
		if (getDeviceAuthorizationTimer != undefined)
			$timeout.cancel(getDeviceAuthorizationTimer);
	};

	//when user click on authorize
	$scope.authorize = function () {
		signatureService.authorizeDeviceRegistration({ "ID": devicesRegistrationAuthorizationID, "note": $scope.devicesObject.note }).then(function (response) {
			//messageService show message 
			messageService.showMessage('Device added successfully to list of authorized devices', 'success', 'APPROVE_SUCCESS');
			//after succeessfully authorize call event 
			socketService.emit('authorization', { type: "status", data: { id: authorization.authorized, uid: devicesRegistrationAuthorizationID } }, function () { });
			$modalInstance.close(true);
		}, function (error) {
			socketService.emit('authorization', { type: "status", data: { id: authorization.notAuthorized, uid: devicesRegistrationAuthorizationID } }, function () { });
			$log.error(error);
		});
	};

	//close dialog
	$scope.close = function () {
		if ($scope.authorizationStatus === authorization.barcodeScanned) {
			socketService.emit('authorization', { type: "status", data: { id: authorization.notAuthorized, uid: devicesRegistrationAuthorizationID } }, function () { });
		}
		$modalInstance.close(false);

	};

	//call on controller load 
	_init();

	//destroy
	$scope.$on('$destroy', function (event) {
		socketService.close();
		stopRequestForGetAuthorization();
	})

}]);




/**
 *  common dialog for capture registration 
 */
commonController.controller('signatureCaptureDialogeController', ['$scope', '$modalInstance', '$timeout', '$log', 'dataAPI', 'data', 'messageService', 'signatureService', 'systemConfig', 'socketService', 'resellerService', 'environment', function ($scope, $modalInstance, $timeout, $log, dataAPI, data, messageService, signatureService, systemConfig, socketService, resellerService, environment) {
	var getCaptureSignaturePoolRequestTimer = { "first": 10000, "next": 5000 }; //here first request with 60 sec then 15 sec 
	var signatureCaptureAuthorizationID;
	$scope.signatureCaptureObject = {};
	var getCaptureAuthorizationTimer;
	//set status based on response
	$scope.signatureCaptureStatus;
	$scope.isError = false;
	$scope.isScocketConnection = false;

	$scope.signatureTypeLookup = angular.copy(systemConfig.getsignatureTypeLookup());
	$scope.appName = resellerService.getValue('appName');

	$scope.signatureConsentsLookup = {
		1: { displayText: "I consent to use my electronically captured signature as a handwritten signature on printed tax returns, bank applications and any other forms needing the ERO signature to electronically file tax returns." },
		2: { displayText: "I consent to use my electronically captured signature as a handwritten signature on printed tax returns, bank applications and any other forms needing the Preparer signature to electronically file tax returns." },
		3: { displayText: "I received consent from the taxpayer and/or spouse to use their electronically captured signature as a handwritten signature on the printed tax return(s), bank application(s) and any other forms the taxpayer and/or spouse signature is needed to electronically file the tax return.  Furthermore, I confirm the taxpayer and/or spouse electronic signature was captured in my presence after verifying their identity using valid identification documents." },
		4: { displayText: "I received consent from the taxpayer and/or spouse to use their electronically captured signature as a handwritten signature on the printed tax return(s), bank application(s) and any other forms the taxpayer and/or spouse signature is needed to electronically file the tax return.  Furthermore, I confirm the taxpayer and/or spouse electronic signature was captured in my presence after verifying their identity using valid identification documents." },
	};

	//enum for signatureCapture steps
	var signatureCapture = {
		waitingForbarcodeScan: 0,
		barcodeScanned: 4,
		waitingForCaptureSignature: 5,
		capturingSignature: 6,
		reviewSignature: 7,
		uploadingSignature: 8,
		success: 9,
		failed: 10,
		authorized: 11,
		notAuthorized: 12,
	};

	//Temporary function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function () {
		if (environment.mode == 'beta' || environment.mode == 'local')
			return true;
		else
			return false;
	};


	//
	var _init = function () {
		if (data != undefined && data.captureObject != undefined) {
			signatureService.createSignatureForCapture(data.captureObject).then(function (response) {
				if (response != undefined && response.data != undefined && response.data.isApproved == true && response.data.authorizationData != undefined) {
					$scope.isAnyDeviceRegistered = true;
					$scope.signatureCaptureData = response.data.authorizationData;
					signatureCaptureAuthorizationID = response.data.ID;
					$scope.signatureCaptureStatus = signatureCapture.waitingForbarcodeScan;
					//if($scope.betaOnly==true)
					startSocketConnectionWithEventsForSignatureCapture();
					startRequestForCapture(getCaptureSignaturePoolRequestTimer.first);
				}
				else if (response != undefined && response.data != undefined && response.data.isApproved == false) {
					$scope.isAnyDeviceRegistered = false;
				}
			}, function (error) {
				$log.error(error);
			});
		}
		else {
			$modalInstance.close(false);
		}
	};

	var startSocketConnectionWithEventsForSignatureCapture = function () {
		//
		socketService.connect();
		//
		socketService.on('connect', function () {
			socketService.emit('join', signatureCaptureAuthorizationID, function () {
			});
		});
		//when barcode scanned from device 
		socketService.on('signatureCapture', function (data) {
			$scope.isScocketConnection = true;
			stopRequestForCapture();
			if (data != undefined && data != undefined && data.uid === signatureCaptureAuthorizationID) {
				if (data.id === signatureCapture.success) {
					getCaptureAuthorization();
				}
				else if (data.id === signatureCapture.waitingForCaptureSignature || data.id === signatureCapture.capturingSignature) {
					//we are updating data from outside usigg socket service so here require evalasync to force update of scope
					$scope.$evalAsync(function () {
						$scope.signatureType = data.type;
						$scope.signatureCaptureStatus = data.id;
					});
				}
				else {
					//we are updating data from outside usigg socket service so here require evalasync to force update of scope
					$scope.$evalAsync(function () {
						$scope.signatureCaptureStatus = data.id;
					});
				}
			}
		});
		//
		socketService.on('reconnect_failed', function (data) {
			//after reconnection failed we can start timer
			if (($scope.signatureCaptureStatus != signatureCapture.success) || ($scope.signatureCaptureStatus != signatureCapture.failed)) {
				$scope.isScocketConnection = false;
				if (getCaptureAuthorizationTimer == undefined)
					startRequestForCapture(getCaptureSignaturePoolRequestTimer.first);
			}
		});
		socketService.on('disconnect', function () {
			$scope.isScocketConnection = false;
			console.log("disconnection success");
		});
	};

	var getCaptureAuthorization = function () {
		signatureService.getCaptureAuthorization({ "ID": signatureCaptureAuthorizationID }).then(function (response) {
			if (response.data != undefined && response.data.isSignatureUploaded != undefined && response.data.isSignatureUploaded == true) {
				$scope.signatureCaptureStatus = signatureCapture.success;
				$scope.signatureDataList = response.data.signatureData;
				stopRequestForCapture();
			}
			else {
				startRequestForCapture(getCaptureSignaturePoolRequestTimer.next);
			}
		}, function (error) {
			stopRequestForCapture();
			$scope.isError = true;
			$log.error(error);
		});
	};

	//interval for startRequestForGet
	var startRequestForCapture = function (poolCaptureRequestTime) {
		getCaptureAuthorizationTimer = $timeout(function () {
			getCaptureAuthorization();
		}, poolCaptureRequestTime);
	};

	var stopRequestForCapture = function () {
		if (getCaptureAuthorizationTimer != undefined)
			$timeout.cancel(getCaptureAuthorizationTimer);
	};


	$scope.getIsCheckAll = function () {
		var isCheckAll = true;
		_.forEach($scope.signatureDataList, function (signatureData) {
			if (signatureData.isApprove == undefined || signatureData.isApprove == false)
				isCheckAll = false;

		});
		return isCheckAll;
	};

	//when user click on approve signature 
	$scope.approve = function () {
		//prepare object for signature approve 
		var signatureDataList = [];
		_.forEach($scope.signatureDataList, function (signatureData) {
			signatureDataList.push({ "type": signatureData.type, "ID": signatureData.ID, "isApproved": signatureData.isApprove, "preparerListId": signatureData.preparerListId })
		});
		var approveSignatureObject = { "ID": signatureCaptureAuthorizationID, "signatureData": signatureDataList };
		signatureService.approveSignature(approveSignatureObject).then(function (response) {
			var signatureApproveMessage = '';
			if (signatureDataList.length > 0 && signatureDataList[0].type != undefined) {
				if (signatureDataList[0].type == 3 || signatureDataList[0].type == 4) {
					signatureApproveMessage = $scope.signatureTypeLookup[3].displayText + " ";
				}
				else {
					signatureApproveMessage = $scope.signatureTypeLookup[signatureDataList[0].type].displayText + " ";
				}
			}
			//messageService show message 
			messageService.showMessage(signatureApproveMessage + 'signature is added ', 'success', 'SIGN_APPROVE_SUCCESS');
			$modalInstance.close(true);
			socketService.emit('signatureCapture', { type: "status", data: { id: signatureCapture.authorized, uid: signatureCaptureAuthorizationID } }, function () { });
		}, function (error) {
			socketService.emit('signatureCapture', { type: "status", data: { id: signatureCapture.notAuthorized, uid: signatureCaptureAuthorizationID } }, function () { });
			$log.error(error);
		});
	};

	//close dialog
	$scope.close = function () {
		if ($scope.signatureCaptureStatus == signatureCapture.success)
			socketService.emit('signatureCapture', { type: "status", data: { id: signatureCapture.notAuthorized, uid: signatureCaptureAuthorizationID } }, function () { });
		$modalInstance.close(false);
	};

	$scope.redraw = function () {
		socketService.emit('signatureCapture', { type: "status", data: { id: signatureCapture.waitingForCaptureSignature, uid: signatureCaptureAuthorizationID } }, function () { });
	};

	//call on controller load 
	_init();

	//destroy
	$scope.$on('$destroy', function (event) {
		socketService.close();
		stopRequestForCapture();
	})
}]);

/**
 *  Controller for to show updatedTerms Dialog  
 */
returnApp.controller('updatedTermsDialogController', ['$scope', '$modalInstance', '$http', 'dataAPI', 'utilityService', function ($scope, $modalInstance, $http, dataAPI, utilityService) {
	//close dialog
	$scope.buttonText = 'Ok';
	$scope.close = function () {
		$scope.buttonText = 'Processing...';
		//call api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/users/updateTermsOfUse',
			data: {
				"deviceInformation": utilityService.getDeviceInformation()
			}
		}).then(function (response) {
			//close dialog
			$modalInstance.close(false);
		}, function (error) {
			$log.error(error);
			//close dialog
			$modalInstance.close(false);
		});
	};

}]);


/**
 *  Controller for to show updatedTerms Dialog  
 */
returnApp.controller('navigatorUserInstructionDialogController', ['$scope', '$modalInstance', 'userService', '$location', '$http', 'dataAPI', function ($scope, $modalInstance, userService, $location, $http, dataAPI) {
	//close dialog
	$scope.userDetails = userService.getUserDetails();
	$scope.leaveMessage = undefined;
	$scope.leaveMsg = function () {
		//call api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/support/leaveMessage',
			data: {
				"message": $scope.leaveMessage
			}
		}).then(function (response) {
			//close dialog
			$modalInstance.close(true);
		}, function (error) {
			$modalInstance.close(true);
		});;
	};

	$scope.close = function () {
		$modalInstance.close(true);
	}
}]);

/**
 *  Controller for to show information regarding ID.me verification.  
 */
returnApp.controller('idMeVerificationDialog', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
	$scope.close = function () {
		$modalInstance.close(true);
	}
}]);

commonController.controller('textMessageDialogController', ['$scope', 'data', '$modalInstance', 'messageService', '$http', 'dataAPI', function ($scope, data, $modalInstance, messageService, $http, dataAPI) {

	// function to initialize the message and other data to display in dialog.
	// this function will call initially.
	var _initTextData = function () {
		$scope.dialogDisplayData = data;
		// condition based on refund or balance due we show message text.
		if (data.refund != undefined && data.refund != '' && data.refund > 0) {
			$scope.dialogDisplayData.message = data.eFileStateName.toUpperCase() + ' confirmation of your tax return\n' + 'Acknowledgement Date : ' + data.date + '\n' + 'Status : ' + data.status + '\n' +
				'Acknowledgement Refund : $' + data.refund + '\n' + 'Submission ID : ' + data.submissionId;
		} else if (data.balanceDue && data.balanceDue != '' && data.balanceDue > 0) {
			$scope.dialogDisplayData.message = data.eFileStateName.toUpperCase() + ' confirmation of your tax return\n' + 'Acknowledgement Date : ' + data.date + '\n' + 'Status : ' + data.status + '\n' +
				'Acknowledgement Balance Due : $' + data.balanceDue + '\n' + 'Submission ID : ' + data.submissionId;
		} else {
			if (data.eFileStateName != undefined && data.submissionId != undefined && data.status != undefined && data.date != undefined)
				$scope.dialogDisplayData.message = data.eFileStateName.toUpperCase() + ' confirmation of your tax return\n' + 'Acknowledgement Date : ' + data.date + '\n' + 'Status : ' + data.status + '\n' +
					'Acknowledgement Refund : $' + 0.00 + '\n' + 'Submission ID : ' + data.submissionId;
		}
	}

	_initTextData();

	// sendTextMessage method is to call sendTextMessage api.
	$scope.sendTextMessage = function () {
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/plivo/sendTextMessage',
			data: {
				'phone': $scope.dialogDisplayData.cellNumber,
				'message': $scope.dialogDisplayData.message,
				'preparerName': $scope.dialogDisplayData.recipientName
			}
		}).then(function (response) {
			messageService.showMessage('SMS Sent Successfully.', 'info');
			$modalInstance.close(false);
		}, function (error) {
			console.log(error);
			messageService.showMessage('Error occurred while sending SMS.', 'error');
			$modalInstance.close(false);
		});
	}


	// to close the dialog
	$scope.close = function () {
		$modalInstance.dismiss('Canceled');
	};
}
]);

/**
 *  Controller for to show History Dialog  for Client Portal
 */
returnApp.controller('clientPortalQuestionHistoryDialog', ['$scope', '$modalInstance', 'data', 'NgTableParams', '$filter', 'clientPortalService', 'environment', function ($scope, $modalInstance, data, NgTableParams, $filter, clientPortalService, environment) {

	$scope.allHistory = [];

	//Temporary function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function () {
		if (environment.mode == 'beta' || environment.mode == 'local')
			return true;
		else
			return false;
	};

	var _init = function () {
		for (var index in data.history) {
			var obj = data.history[index];
			var newObj = {};
			if (obj.name.indexOf('yesNo') > -1) {
				newObj.name = 'Yes No';
			} else if (obj.name.indexOf('files') > -1) {
				newObj.name = 'Documents';
			} else if (obj.name.indexOf('freeText') > -1) {
				newObj.name = 'Free Text';
			}
			//  else {
			// 	newObj.name = obj.name;
			// }
			if (obj.name === 'files') {
				var oldVal = obj.oldValue && obj.oldValue.length > 0 ? obj.oldValue.split(',') : undefined;
				newObj.oldValue = [];
				if (oldVal) {
					for (var index in oldVal) {
						var fileObj = {
							fileName: oldVal[index].split(':')[0],
							docId: oldVal[index].split(':')[1]
						};
						newObj.oldValue.push(fileObj);
					}
				}
			} else {
				newObj.oldValue = obj.oldValue;
			}

			if (obj.name === 'files') {
				var newVal = obj.newValue && obj.newValue.length > 0 ? obj.newValue.split(',') : undefined;
				newObj.newValue = [];
				if (newVal) {
					for (var index in newVal) {
						var fileObj = {
							fileName: newVal[index].split(':')[0],
							docId: newVal[index].split(':')[1]
						};
						newObj.newValue.push(fileObj);
					}
				}
			} else {
				newObj.newValue = obj.newValue;
			}

			newObj.changeDate = obj.changeDate;
			if (newObj.name) {
				$scope.allHistory.push(newObj)
			}
		}
	}

	$scope.historyGrid = new NgTableParams({
		page: 1, // show initial page
		count: 10,// count per page
		sorting: {
			// initial sorting
			changeDate: 'desc'
		}
	}, {
			total: 0, // length of data
			sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
			getData: function ($defer, params) {
				// Request to API
				// get Data here				
				if (angular.isUndefined($scope.allHistory)) {
					//load list from API
					// Only On successful API response we bind data to grid.			
					var filteredData = historyGridFilter($scope.allHistory);
					//Apply standard sorting
					var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					params.total(filteredData.length);
					//Return Result to grid
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				} else {
					var filteredData = historyGridFilter($scope.allHistory);
					//Apply standard sorting
					var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
					params.total(filteredData.length);
					//Return Result to grid
					$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			}
		});


	//Filter function  - This is used to make common code for filter
	//This require as we are either loading data from cache or API call using promise
	var historyGridFilter = function (data) {
		var filteredData = data;
		//filter based on search field $scope.searchField
		if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
			filteredData = $filter('filter')(filteredData, function (entry, index) {
				if (angular.isDefined(entry.firstName) && entry.firstName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
					return true;
				} else if (angular.isDefined(entry.lastName) && entry.lastName.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
					return true;
				} else if (angular.isDefined(entry.email) && entry.email.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
					return true;
				} else if (angular.isDefined(entry.phone) && entry.phone.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
					return true;
				} else if (angular.isDefined(entry.SSN) && entry.SSN.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
					return true;
				}
			});
		};
		return filteredData;
	};

	$scope.download = function (docId) {
		if (docId) {
			clientPortalService.downloadDocument(docId).then(function (response) {
				if (response) {
					var blob = b64toBlob(response.base64Data, response.contentType);
					var dlink = document.createElement('a');
					dlink.download = response.fileName;
					dlink.href = URL.createObjectURL(blob);
					dlink.onclick = function (e) {
						// revokeObjectURL needs a delay to work properly
						var that = this;
						setTimeout(function () {
							window.URL.revokeObjectURL(that.href);
						}, 1000);
					};
					dlink.click();
					dlink.remove();
				}
			}, function (error) {
				console.error(error);
			})
		}
	}

	// Convert base64file to blob
	var b64toBlob = function (b64Data, contentType) {
		contentType = contentType || '';
		var sliceSize = 512;
		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		var blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}

	$scope.close = function () {
		$modalInstance.close(true);
	}

	_init();
}]);


/**
 *  Controller for to show rejectedReturnsInstruction Dialog  
 */
returnApp.controller('rejectedReturnsInstructionDialogController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
	//close dialog
	$scope.close = function () {
		$modalInstance.close(true);
	}
}]);


/**
 *  Controller for to show rejectedReturnsInstruction Dialog  
 */
returnApp.controller('acceptedFileTypesDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
	var pdfType = data.pdfMimeType.split(',');
	$scope.pdftypeArray = [];
	for (var i = 0; i < pdfType.length-1; i++) {
		var type = pdfType[i].split('/');
		$scope.pdftypeArray.push('.' + type[1]);
	}
	var iamgeType = data.jpegMimeType.split(',');
	$scope.imagetypeArray = [];
	for (var i = 0; i < iamgeType.length-1; i++) {
		var type = iamgeType[i].split('/');
		$scope.imagetypeArray.push('.' + type[1]);
	}
	var docType = data.docMiMeType.split(',');
	$scope.doctypeArray = [];
	for (var i = 0; i < docType.length-1; i++) {
		var type = docType[i].split('/');
		$scope.doctypeArray.push('.' + type[1]);
	}
	var excelType = data.exelMimeType.split(',');
	$scope.exceltypeArray = [];
	for (var i = 0; i < excelType.length-1; i++) {
		var type = excelType[i].split('/');
		$scope.exceltypeArray.push('.' + type[1]);
	}
	var tiffType = data.tiffMimeType.split(',');
	$scope.tiffMimeTypeArray = [];
	for (var i = 0; i < tiffType.length-1; i++) {
		var type = tiffType[i].split('/');
		$scope.tiffMimeTypeArray.push('.' + type[1]);
	}
	var textType = data.textType.split(',');
	$scope.texttypeArray = [];
	for (var i = 0; i < textType.length-1; i++) {
		var type = textType[i].split('/');
		$scope.texttypeArray.push('.' + type[1]);
	}
	//close dialog
	$scope.close = function () {
		$modalInstance.close(true);
	}
}]);
