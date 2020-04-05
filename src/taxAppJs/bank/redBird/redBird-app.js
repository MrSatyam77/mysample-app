'use strict';

var redBirdApp = angular.module('redBirdApp', []);

redBirdApp.controller('redBirdController', ['$location', 'userService', 'dialogService', 'subscriptionService', 
                                            function ($location, userService, dialogService, subscriptionService) {

	//to check is user is paid user or not 
	var userDetails = userService.getUserDetails();
	var subscriptionType = '';

	var masterLocationDetails; 
	//get master location details
	if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
		masterLocationDetails = userDetails.locations[userDetails.masterLocationId];
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

	//get current taxYear
	var taxYear = userService.getTaxYear();

	//condition to check that year not equals to 2015
	if(taxYear != '2015') {
		// redirect to home because Red Bird bank is not use in 2014 and 2016 
		$location.path('/home');
	}
}]);