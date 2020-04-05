"use strict";

var conversionApp = angular.module('conversionApp', []);

//controller for new conversion 
conversionApp.controller('conversionEditController', ['$scope', '$log', 'Upload', '$q', '$http', '$location', '$filter', '$injector', 'dataAPI', 'userService', 'conversionService', 'environment', 'resellerService', '$rootScope',
	function ($scope, $log, Upload, $q, $http, $location, $filter, $injector, dataAPI, userService, conversionService, environment, resellerService, $rootScope) {

		//Temporary function to differentiate features as per environment (beta/live)
		$scope.betaOnly = function () {
			if (environment.mode == 'beta' || environment.mode == 'local')
				return true;
			else
				return false;
		};

		//get appName from resellerService
		$scope.appName = resellerService.getValue("appName");

		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};



		//Remove if condition to allow conversion in demo a/c.
		//If demo user try to open conversion by url. He/She will be prompted with dialog to either register
		//or continue with demo (which redirect user to home page)    
		if (userService.getValue('isDemoUser') == true) {
			var salesDialogService = $injector.get('salesDialogService');
			salesDialogService.openSalesDialog("conversion");
		}

		//array object declare which contains the mapping of next and previous view for the steps of conversion
		$scope.nextAndPrevViewMap = [
			{ "view": "first", "title": "Welcome", "isVisible": "true", "next": "second", "previous": "" },
			{ "view": "second", "title": "Select Software", "isVisible": "false", "next": "third", "previous": "first" },
			{ "view": "third", "title": "Important Instructions", "isVisible": "false", "next": "fourth", "previous": "second" },
			{ "view": "fourth", "title": "Backup Instructions", "isVisible": "false", "next": "fifth", "previous": "third" },
			{ "view": "fifth", "title": "Upload", "isVisible": "false", "next": "", "previous": "fourth" },
			{ "view": "sixth", "title": "Confirmation", "isVisible": "false", "next": "", "previous": "" }
		];

		//array containing the number of step the user has reached
		$scope.conversionTopMenu = [
			{ "view": "first", "title": "Welcome" }
		];

		//Start - tax year code
		$scope.softwareName = {
			"2014": {
				"2013": [
					{ "text": "ATX 2013(1040)", "value": "ATX2013", "displayText": "ATX", "name": "ATX" },
					{ "text": "CCHPro System 2013 (1040)", "value": "CCHProSystem2013", "displayText": "CCHPro", "name": "CCHProSystem" },
					{ "text": "Crosslink 2013 (1040)", "value": "Crosslink2013", "displayText": "CrossLink", "name": "Crosslink" },
					{ "text": "Drake 2013 (1040)", "value": "Drake2012", "displayText": "Drake", "name": "Drake" },
					{ "text": "Lacerte 2013 (1040)", "value": "Lacerte2013", "displayText": "Lacerte", "name": "Lacerte" },
					{ "text": "Pro Series 2013 (1040)", "value": "ProSeries2013", "displayText": "Pro Series", "name": "ProSeries" },
					{ "text": "TaxACT 2013 (1040)", "value": "TaxACT2013", "displayText": "TaxAct", "name": "TaxACT" },
					{ "text": "TaxExact 2013 (1040)", "value": "TrxSoftware2013", "displayText": "TaxExact", "name": "TaxExact" },
					{ "text": "TaxSlayer 2013 (1040)", "value": "TaxSlayer2013", "displayText": "TaxSlayer", "name": "TaxSlayer" },
					{ "text": "TaxWise 2013 (1040)", "value": "TaxWise2013", "displayText": "TaxWise", "name": "TaxWise" },
					{ "text": "TRX Software 2013 (1040)", "value": "TrxSoftware2013", "displayText": "TRX Software", "name": "TrxSoftware" },
					{ "text": "UltraTax 2013 (1040, 1065, 1120, 1120s)", "value": "UltraTax2013", "displayText": "UltraTax", "name": "UltraTax" }
				]
			},
			"2015": {
				"2014": [
					{ "text": "ATX 2014 (1040, 1065, 1120, 1120s)", "value": "ATX2014", "displayText": "ATX", "name": "ATX" },
					{ "text": "Crosslink 2014 (1040)", "value": "Crosslink2014", "displayText": "CrossLink", "name": "Crosslink" },
					{ "text": "Drake 2014 (1040, 1065, 1120, 1120s)", "value": "Drake2014", "displayText": "Drake", "name": "Drake" },
					{ "text": "Lacerte 2014 (1040, 1065, 1120, 1120s)", "value": "Lacerte2014", "displayText": "Lacerte", "name": "Lacerte" },
					{ "text": "Pro Series 2014 (1040, 1065, 1120, 1120s)", "value": "ProSeries2014", "displayText": "Pro Series", "name": "ProSeries" },
					{ "text": "OLTPRO 2014 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2014", "displayText": "OLT Pro", "name": "OLTPRO" },
					{ "text": "TaxACT 2014 (1040)", "value": "TaxACT2014", "displayText": "TaxAct", "name": "TaxACT" },
					{ "text": "TaxSlayer 2014 (1040)", "value": "TaxSlayer2014", "displayText": "TaxSlayer", "name": "TaxSlayer" },
					{ "text": "TaxWise 2014 (1040, 1065, 1120, 1120s)", "value": "TaxWise2014", "displayText": "TaxWise", "name": "TaxWise" },
					{ "text": "UltraTax 2014 (1040, 1065, 1120, 1120s)", "value": "UltraTax2014", "displayText": "UltraTax", "name": "UltraTax" },
					{ "text": "ProSystem FX 2014 (1040, 1065, 1120, 1120s)", "value": "ProSystemFX2014", "displayText": "ProSystem FX", "name": "ProSystemFX" }
				]
			},
			"2016": {
				"2015": [
					{ "text": "ATX 2015 (1040, 1065, 1120, 1120s)", "value": "ATX2015", "displayText": "ATX", "name": "ATX" },
					{ "text": "Crosslink 2015 (1040)", "value": "Crosslink2015", "displayText": "CrossLink", "name": "Crosslink" },
					{ "text": "Drake 2015 (1040, 1065, 1120, 1120s)", "value": "Drake2015", "displayText": "Drake", "name": "Drake" },
					{ "text": "Lacerte 2015 (1040, 1065, 1120, 1120s)", "value": "Lacerte2015", "displayText": "Lacerte", "name": "Lacerte" },
					{ "text": "Pro Series 2015 (1040, 1065, 1120, 1120s)", "value": "ProSeries2015", "displayText": "Pro Series", "name": "ProSeries" },
					{ "text": "OLTPRO 2015 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2015", "displayText": "OLT Pro", "name": "OLTPRO" },
					{ "text": "TaxACT 2015 (1040)", "value": "TaxACT2015", "displayText": "TaxAct", "name": "TaxACT" },
					{ "text": "TaxSlayer 2015 (1040)", "value": "TaxSlayer2015", "displayText": "TaxSlayer", "name": "TaxSlayer" },
					{ "text": "TaxWise 2015 (1040, 1065, 1120, 1120s)", "value": "TaxWise2015", "displayText": "TaxWise", "name": "TaxWise" },
					{ "text": "UltraTax 2015 (1040, 1065, 1120, 1120s)", "value": "UltraTax2015", "displayText": "UltraTax", "name": "UltraTax" },
					{ "text": "ProSystem FX 2015 (1040, 1065, 1120, 1120s)", "value": "ProSystemFX2015", "displayText": "ProSystem FX", "name": "ProSystemFX" },
					{ "text": "Turbo Tax 2015 (1040)", "value": "TurboTax2015", "displayText": "Turbo Tax", "name": "TurboTax" }
				],
				"2016": [
					{ "text": "ATX 2016 (1040, 1065, 1120, 1120s)", "value": "ATX2016", "displayText": "ATX", "name": "ATX" },
					{ "text": "Crosslink 2016 (1040)", "value": "Crosslink2016", "displayText": "CrossLink", "name": "Crosslink" },
					{ "text": "Drake 2016 (1040, 1065, 1120, 1120s)", "value": "Drake2016", "displayText": "Drake", "name": "Drake" },
					{ "text": "Lacerte 2016 (1040, 1065, 1120, 1120s)", "value": "Lacerte2016", "displayText": "Lacerte", "name": "Lacerte" },
					{ "text": "Pro Series 2016 (1040, 1065, 1120, 1120s)", "value": "ProSeries2016", "displayText": "Pro Series", "name": "ProSeries" },
					{ "text": "OLTPRO 2016 (1040)", "value": "OLTPRO2016", "displayText": "OLT Pro", "name": "OLTPRO" },
					{ "text": "TaxACT 2016 (1040)", "value": "TaxACT2016", "displayText": "TaxAct", "name": "TaxACT" },
					{ "text": "TaxSlayer 2016 (1040)", "value": "TaxSlayer2016", "displayText": "TaxSlayer", "name": "TaxSlayer" },
					{ "text": "TaxWise 2016 (1040, 1065, 1120, 1120s)", "value": "TaxWise2016", "displayText": "TaxWise", "name": "TaxWise" },
					{ "text": "UltraTax 2016 (1040, 1065, 1120, 1120s)", "value": "UltraTax2016", "displayText": "UltraTax", "name": "UltraTax" },
					{ "text": "ProSystem FX 2016 (1040, 1065, 1120, 1120s)", "value": "ProSystemFX2016", "displayText": "ProSystem FX", "name": "ProSystemFX" },
					{ "text": "Turbo Tax 2016 (1040)", "value": "TurboTax2016", "displayText": "Turbo Tax", "name": "TurboTax" }
				]
			},
			"2017": {
				"2017": [
					{ "text": "ATX 2017 (1040, 1065, 1120, 1120s)", "value": "ATX2017", "displayText": "ATX", "name": "ATX" },
					{ "text": "Crosslink 2017 (1040)", "value": "Crosslink2017", "displayText": "CrossLink", "name": "Crosslink" },
					{ "text": "Drake 2017 (1040,1065,1120,1120s)", "value": "Drake2017", "displayText": "Drake", "name": "Drake" },
					{ "text": "Lacerte 2017 (1040,1065,1120,1120s)", "value": "Lacerte2017", "displayText": "Lacerte", "name": "Lacerte" },
					{ "text": "OLTPRO 2017 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2017", "displayText": "OLT Pro", "name": "OLTPRO" },
					{ "text": "Pro Series 2017 (1040,1065,1120,1120s)", "value": "ProSeries2017", "displayText": "Pro Series", "name": "ProSeries" },
					{ "text": "TaxACT 2017 (1040)", "value": "TaxACT2017", "displayText": "TaxAct", "name": "TaxACT" },
					{ "text": "TaxSlayer 2017 (1040)", "value": "TaxSlayer2017", "displayText": "TaxSlayer", "name": "TaxSlayer" },
					{ "text": "TaxWise 2017 (1040, 1065, 1120, 1120s)", "value": "TaxWise2017", "displayText": "TaxWise", "name": "TaxWise" },
					{ "text": "Turbo Tax 2017 (1040)", "value": "TurboTax2017", "displayText": "Turbo Tax", "name": "TurboTax" },
					{ "text": "ProSystem FX 2017 (1040)", "value": "ProSystemFX2017", "displayText": "ProSystem FX", "name": "ProSystemFX" },
					{ "text": "UltraTax 2017 (1040, 1065, 1120, 1120s)", "value": "UltraTax2017", "displayText": "UltraTax", "name": "UltraTax" }
				]
			},
			"2018": {
				"2018": [
					{ "text": "ProSeries 2018 (1040,1065,1120,1120s)", "value": "ProSeries2018", "displayText": "ProSeries", "name": "ProSeries" },
					{ "text": "TaxWise 2018 (1040,1065,1120,1120s)", "value": "TaxWise2018", "displayText": "TaxWise", "name": "TaxWise" },
					{"text": "OLTPRO 2018 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2018", "displayText": "OLT Pro", "name": "OLTPRO" },
					{ "text": "ATX 2018 (1040, 1065, 1120, 1120s)", "value": "ATX2018", "displayText": "ATX", "name": "ATX" },
					{ "text": "Turbo Tax 2018 (1040)", "value": "TurboTax2018", "displayText": "Turbo Tax", "name": "TurboTax" }
				]

			}

		};

		//holds the current selected year by user
		$scope.taxYear = userService.getTaxYear();

		if (parseInt($scope.taxYear) > 2017) {
			$location.path('/conversionnew');
		}

		//
		if (parseInt($scope.taxYear) <= 2016) {
			$location.path('/home');
		}
		//  else if ($scope.taxYear == '2018') {
		// 	//get enable conversion flag from license object
		// 	$scope.enableConversion = userService.getLicenseValue('enableConversion', $scope.taxYear);
		// 	if ($scope.enableConversion != true) {
		// 		$location.path('/home');
		// 	}
		// }

		//arranging the data name wise
		//$scope.softwareName = $filter('orderBy') ($scope.softwareName[$scope.taxYear],'text');	

		//selectiopn of software
		$scope.uploadedSoftDetail = {};
		$scope.uploadedSoftDetail.selSoftware = conversionService.getSelectedSoftware();
		if (angular.isUndefined($scope.uploadedSoftDetail.selSoftware) || $scope.uploadedSoftDetail.selSoftware == "") {
			$scope.uploadedSoftDetail = { selSoftware: $scope.softwareName[0] };
		}

		//object declared to obtain the selected software and tax year
		//Note :- as the value were not directly obtained so the object is declared
		$scope.uploadedSoftDetail = {};
		//hold userData(username and password)
		$scope.userData = {};

		//Get details of logged in user
		$scope.userDetails = userService.getUserDetails();

		//variable declared to show the error message when error comes while uploading file more than 20MB 
		$scope.fileSizeMessage = false;
		//variable declared to show the warning message maximum size limit 20MB
		$scope.fileSizeLimitWarning = false;
		//variable to show error message while uploading file
		$scope.uploadErrMessage = false;
		//variable to show error messgae file is invalid
		$scope.invalidFileType = false;
		//hold lit of supported file type
		$scope.acceptFileType = 'application/zip,application/x-zip,application/x-zip-compressed,multipart/x-zip';
		$scope.selectSoftwarePage = false;
		//method defined to change view when user click on next or back button
		//curView = it contains the view on which the user is.
		//mode = it contains the mode of the click button whether it is next button or back button clicked 
		$scope.changeView = function (curView, mode) {
			$scope.selectSoftwarePage = false;
			$scope.fileSizeLimitWarning = false;
			$scope.fileSizeMessage = false;
			$scope.uploadErrMessage = false;
			$scope.invalidFileType = false;
			if (curView == 'first' && mode == 'next' || curView == 'third' && mode == 'prev')
				$scope.selectSoftwarePage = true;
			//condition is to reset the progress bar status if user goes back to third step and again comes here.		
			//condition is to show warning message for file size 20 mb
			if (curView == 'fourth' && mode == 'next') {
				$scope.uploadProgress = 0;
				$scope.fileSizeLimitWarning = true;
			}
			//obtaining the index of the current view from the array object on which currently user is.  
			var index = _.findIndex($scope.nextAndPrevViewMap, function (viewList) {
				return viewList.view == curView;
			});
			//set the visibility of the current view to false.  
			$scope.nextAndPrevViewMap[index].isVisible = 'false';
			//condition to check which button is pressed.
			if (mode == 'next') {
				$scope.nextAndPrevViewMap[++index].isVisible = 'true';
			} else if (mode == 'back') {
				$scope.nextAndPrevViewMap[--index].isVisible = 'true';
			}

			//calling the method to re-initialized the conversionTopMenu array as the view changes.
			viewMenu($scope.nextAndPrevViewMap, index);

		};

		//method defined to show the view from the listed view in top menu when user click on it.
		//view = contains the view name to which user want to go. 
		$scope.goToView = function (view) {
			$scope.selectSoftwarePage = false;
			$scope.fileSizeLimitWarning = false;
			$scope.invalidFileType = false;
			if (view == 'second')
				$scope.selectSoftwarePage = true;
			//condition is to show warning message for file size 20 mb
			if (view == 'fifth') {
				$scope.fileSizeLimitWarning = true;
			}
			//obtaining the index of the current view from the array object
			var curViewindex = _.findIndex($scope.nextAndPrevViewMap, function (viewList) {
				return viewList.isVisible == 'true';
			});

			//obtaining the index of the view from the array object to which user want to go.
			var goToViewIndex = _.findIndex($scope.nextAndPrevViewMap, function (viewList) {
				return viewList.view == view;
			});
			//setting the visibility of current view to false.
			$scope.nextAndPrevViewMap[curViewindex].isVisible = 'false';
			//setting the view visibility true to which user want to go.
			$scope.nextAndPrevViewMap[goToViewIndex].isVisible = 'true';

			viewMenu($scope.nextAndPrevViewMap, goToViewIndex);
		};

		//method prepared to re-initialized the viewMenuMap as the user click on next or previous button as well as on link button of top menu
		var viewMenu = function (nextPrevMap, index) {
			$scope.conversionTopMenu = [];
			for (var cnt = 0; cnt <= index; cnt++) {
				$scope.conversionTopMenu.push({ view: nextPrevMap[cnt].view, title: nextPrevMap[cnt].title });
			}
		};
		$scope.uploadProgress = 0;
		$scope.onFileSelect = function ($files) {
			var deferred = $q.defer();
			$scope.uploadErrMessage = false;
			//define maximum size for uploading file
			var maxAllowedSize = 5120 * 1024 * 1024;
			for (var i = 0; i < $files.length; i++) {
				var file = $files[i];
				//check file is in supported file list
				//Note: We write patch here, In some windows pc , we are unable to get file type
				//As we have not found proper solution, we just allow each file for which type is blank.
				if (file.type != '' && !_.includes($scope.acceptFileType.split(','), file.type) || file.type == '') {
					$scope.fileType = file.type;
					$scope.invalidFileType = true;
					$scope.fileSizeMessage = false;
					$scope.uploadErrMessage = false;
					$scope.fileSizeLimitWarning = false;
				}
				else {
					$scope.invalidFileType = false;
					//condition to check whether file size is within the limit or not
					if (file.size < maxAllowedSize) {
						$scope.fileSizeMessage = false;
						//disable previous when file is uploaded
						$scope.disablePrev = true;
						//declare to show the message to user if the file uploaded size is more than the limit
						$scope.message = '';
						$scope.softwareDetail = { 'text': $scope.uploadedSoftDetail.selSoftware.text, 'value': $scope.uploadedSoftDetail.selSoftware.value, 'name': $scope.uploadedSoftDetail.selSoftware.name };
						$scope.upload = Upload.upload({
							url: dataAPI.base_url + '/conversion/upload', //upload.php script, node.js route, or servlet url
							fields: {
								upload: {
									softwareName: $scope.softwareDetail,
									taxYear: $scope.taxYear,
									userData: $scope.userData
								}
							},
							file: file, // or list of files ($files) for html5 only
							//fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
							// customize file formData name ('Content-Disposition'), server side file variable name. 
							//fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
							// customize how data is added to formData. See #40#issuecomment-28612000 for sample code
							//formDataAppender: function(formData, key, val){}
						}).then(function (response) {
							$scope.changeView('fifth', 'next');
							$scope.uploadProgress = 100;
						}, function (error) {
							$log.log(error);
							$scope.disablePrev = false;
							//to show the message when error occurs while uploading
							$scope.uploadErrMessage = true;
							$scope.fileSizeMessage = false;
							$scope.uploadProgress = 0;
						}, function (update) {
							$scope.uploadProgress = parseInt(100.0 * update.loaded / update.total) > 90 ? 90 : parseInt(100.0 * update.loaded / update.total);
						});
					} else if (file.size > maxAllowedSize) {
						$scope.fileSizeMessage = true;
						$scope.uploadErrMessage = false;
						$scope.fileSizeLimitWarning = false;
					}
				}
			}
			return deferred.promise;
		};

		// Keep track of selected software.
		$scope.changeSoftware = function () {
			$scope.userData = {};
			conversionService.setSelectedSoftware($scope.uploadedSoftDetail.selSoftware);
			$rootScope.selectedSofwareName = $scope.uploadedSoftDetail.selSoftware;
			//here we are set current loaded form for support widget 
			$scope.$broadcast('ConversionSoftwareName', $scope.uploadedSoftDetail.selSoftware);
		};

		//method call on done button when user finishes the uploading of file and is on last step
		$scope.goToListView = function () {
			$location.path('conversion/list');
		};
		if ($scope.betaOnly() == true) {
			$scope.softwareName = {
				"2014": {
					"2013": [
						{ "text": "ATX 2013(1040)", "value": "ATX2013", "displayText": "ATX", "name": "ATX" },
						{ "text": "CCHPro System 2013 (1040)", "value": "CCHProSystem2013", "displayText": "CCHPro", "name": "CCHPro System" },
						{ "text": "Crosslink 2013 (1040)", "value": "Crosslink2013", "displayText": "CrossLink", "name": "Crosslink" },
						{ "text": "Drake 2013 (1040)", "value": "Drake2012", "displayText": "Drake", "name": "Drake" },
						{ "text": "Lacerte 2013 (1040)", "value": "Lacerte2013", "displayText": "Lacerte", "name": "Lacerte" },
						{ "text": "Pro Series 2013 (1040)", "value": "ProSeries2013", "displayText": "Pro Series", "name": "ProSeries" },
						{ "text": "TaxACT 2013 (1040)", "value": "TaxACT2013", "displayText": "TaxAct", "name": "TaxACT" },
						{ "text": "TaxExact 2013 (1040)", "value": "TrxSoftware2013", "displayText": "TaxExact", "name": "TaxExact" },
						{ "text": "TaxSlayer 2013 (1040)", "value": "TaxSlayer2013", "displayText": "TaxSlayer", "name": "TaxSlayer" },
						{ "text": "TaxWise 2013 (1040)", "value": "TaxWise2013", "displayText": "TaxWise", "name": "TaxWise" },
						{ "text": "TRX Software 2013 (1040)", "value": "TrxSoftware2013", "displayText": "TRX Software", "name": "TrxSoftware" },
						{ "text": "UltraTax 2013 (1040, 1065, 1120, 1120s)", "value": "UltraTax2013", "displayText": "UltraTax", "name": "UltraTax" }
					]
				},
				"2015": {
					"2014": [
						{ "text": "ATX 2014 (1040, 1065, 1120, 1120s)", "value": "ATX2014", "displayText": "ATX", "name": "ATX" },
						{ "text": "Crosslink 2014 (1040)", "value": "Crosslink2014", "displayText": "CrossLink", "name": "Crosslink" },
						{ "text": "Drake 2014 (1040, 1065, 1120, 1120s)", "value": "Drake2014", "displayText": "Drake", "name": "Drake" },
						{ "text": "Lacerte 2014 (1040, 1065, 1120, 1120s)", "value": "Lacerte2014", "displayText": "Lacerte", "name": "Lacerte" },
						{ "text": "Pro Series 2014 (1040, 1065, 1120, 1120s)", "value": "ProSeries2014", "displayText": "Pro Series", "name": "ProSeries" },
						{ "text": "OLTPRO 2014 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2014", "displayText": "OLT Pro", "name": "OLTPRO" },
						{ "text": "TaxACT 2014 (1040)", "value": "TaxACT2014", "displayText": "TaxAct", "name": "TaxACT" },
						{ "text": "TaxSlayer 2014 (1040)", "value": "TaxSlayer2014", "displayText": "TaxSlayer", "name": "TaxSlayer" },
						{ "text": "TaxWise 2014 (1040, 1065, 1120, 1120s)", "value": "TaxWise2014", "displayText": "TaxWise", "name": "TaxWise" },
						{ "text": "UltraTax 2014 (1040, 1065, 1120, 1120s)", "value": "UltraTax2014", "displayText": "UltraTax", "name": "UltraTax" },
						{ "text": "ProSystem FX 2014 (1040, 1065, 1120, 1120s)", "value": "ProSystemFX2014", "displayText": "ProSystem FX", "name": "ProSystemFX" }
					]
				},
				"2016": {
					"2015": [
						{ "text": "ATX 2015 (1040, 1065, 1120, 1120s)", "value": "ATX2015", "displayText": "ATX", "name": "ATX" },
						{ "text": "Crosslink 2015 (1040)", "value": "Crosslink2015", "displayText": "CrossLink", "name": "Crosslink" },
						{ "text": "Drake 2015 (1040, 1065, 1120, 1120s)", "value": "Drake2015", "displayText": "Drake", "name": "Drake" },
						{ "text": "Lacerte 2015 (1040, 1065, 1120, 1120s)", "value": "Lacerte2015", "displayText": "Lacerte", "name": "Lacerte" },
						{ "text": "Pro Series 2015 (1040, 1065, 1120, 1120s)", "value": "ProSeries2015", "displayText": "Pro Series", "name": "ProSeries" },
						{ "text": "OLTPRO 2015 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2015", "displayText": "OLT Pro", "name": "OLTPRO" },
						{ "text": "TaxACT 2015 (1040)", "value": "TaxACT2015", "displayText": "TaxAct", "name": "TaxACT" },
						{ "text": "TaxSlayer 2015 (1040)", "value": "TaxSlayer2015", "displayText": "TaxSlayer", "name": "TaxSlayer" },
						{ "text": "TaxWise 2015 (1040, 1065, 1120, 1120s)", "value": "TaxWise2015", "displayText": "TaxWise", "name": "TaxWise" },
						{ "text": "UltraTax 2015 (1040, 1065, 1120, 1120s)", "value": "UltraTax2015", "displayText": "UltraTax", "name": "UltraTax" },
						{ "text": "ProSystem FX 2015 (1040, 1065, 1120, 1120s)", "value": "ProSystemFX2015", "displayText": "ProSystem FX", "name": "ProSystemFX" },
						{ "text": "Turbo Tax 2015 (1040)", "value": "TurboTax2015", "displayText": "Turbo Tax", "name": "TurboTax" }
					],
					"2016": [
						{ "text": "ATX 2016 (1040, 1065, 1120, 1120s)", "value": "ATX2016", "displayText": "ATX", "name": "ATX" },
						{ "text": "Crosslink 2016 (1040)", "value": "Crosslink2016", "displayText": "CrossLink", "name": "Crosslink" },
						{ "text": "Drake 2016 (1040, 1065, 1120, 1120s)", "value": "Drake2016", "displayText": "Drake", "name": "Drake" },
						{ "text": "Lacerte 2016 (1040, 1065, 1120, 1120s)", "value": "Lacerte2016", "displayText": "Lacerte", "name": "Lacerte" },
						{ "text": "Pro Series 2016 (1040, 1065, 1120, 1120s)", "value": "ProSeries2016", "displayText": "Pro Series", "name": "ProSeries" },
						{ "text": "OLTPRO 2016 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2016", "displayText": "OLT Pro", "name": "OLTPRO" },
						{ "text": "TaxACT 2016 (1040)", "value": "TaxACT2016", "displayText": "TaxAct", "name": "TaxACT" },
						{ "text": "TaxSlayer 2016 (1040)", "value": "TaxSlayer2016", "displayText": "TaxSlayer", "name": "TaxSlayer" },
						{ "text": "TaxWise 2016 (1040, 1065, 1120, 1120s)", "value": "TaxWise2016", "displayText": "TaxWise", "name": "TaxWise" },
						{ "text": "UltraTax 2016 (1040, 1065, 1120, 1120s)", "value": "UltraTax2016", "displayText": "UltraTax", "name": "UltraTax" },
						{ "text": "ProSystem FX 2016 (1040, 1065, 1120, 1120s)", "value": "ProSystemFX2016", "displayText": "ProSystem FX", "name": "ProSystemFX" }
					]
				},
				"2017": {
					"2017": [
						{ "text": "ATX 2017 (1040, 1065, 1120, 1120s)", "value": "ATX2017", "displayText": "ATX", "name": "ATX" },
						{ "text": "Crosslink 2017 (1040)", "value": "Crosslink2017", "displayText": "CrossLink", "name": "Crosslink" },
						{ "text": "Drake 2017 (1040)", "value": "Drake2017", "displayText": "Drake", "name": "Drake" },
						{ "text": "Lacerte 2017 (1040)", "value": "Lacerte2017", "displayText": "Lacerte", "name": "Lacerte" },
						{ "text": "OLTPRO 2017 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2017", "displayText": "OLT Pro", "name": "OLTPRO" },
						{ "text": "Pro Series 2017 (1040)", "value": "ProSeries2017", "displayText": "Pro Series", "name": "ProSeries" },
						{ "text": "TaxACT 2017 (1040)", "value": "TaxACT2017", "displayText": "TaxAct", "name": "TaxACT" },
						{ "text": "TaxSlayer 2017 (1040)", "value": "TaxSlayer2017", "displayText": "TaxSlayer", "name": "TaxSlayer" },
						{ "text": "TaxWise 2017 (1040, 1065, 1120, 1120s)", "value": "TaxWise2017", "displayText": "TaxWise", "name": "TaxWise" },
						{ "text": "Turbo Tax 2017 (1040)", "value": "TurboTax2017", "displayText": "Turbo Tax", "name": "TurboTax" },
						{ "text": "ProSystem FX 2017 (1040)", "value": "ProSystemFX2017", "displayText": "ProSystem FX", "name": "ProSystemFX" },
						{ "text": "UltraTax 2017 (1040, 1065, 1120, 1120s)", "value": "UltraTax2017", "displayText": "UltraTax", "name": "UltraTax" }
					]
				},
				"2018": {
					"2018": [
						{ "text": "ProSeries 2018 (1040, 1065, 1120, 1120s)", "value": "ProSeries2018", "displayText": "ProSeries", "name": "ProSeries" },
						{ "text": "TaxWise 2018 (1040, 1065, 1120, 1120s)", "value": "TaxWise2018", "displayText": "TaxWise", "name": "TaxWise" },
						{ "text": "OLTPRO 2018 (1040, 1065, 1120, 1120s)", "value": "OLTPRO2018", "displayText": "OLT Pro", "name": "OLTPRO" },
						{ "text": "ATX 2018 (1040, 1065, 1120, 1120s)", "value": "ATX2018", "displayText": "ATX", "name": "ATX" },
						{ "text": "Turbo Tax 2018 (1040)", "value": "TurboTax2018", "displayText": "Turbo Tax", "name": "TurboTax" }
					]
				}

			};
		}
		var init = function () {
			$scope.uploadedSoftDetail.softwareYear = $scope.softwareYear[0];
			if ($scope.taxYear == '2018') {
				$scope.uploadedSoftDetail.selSoftware = $scope.softwareName[0]
				$rootScope.selectedSofwareName = $scope.uploadedSoftDetail.selSoftware;
			}
		}
		$scope.taxYear = userService.getTaxYear();

		$scope.taxYearConversion = $filter('orderBy')($scope.softwareName[$scope.taxYear]);

		if ($scope.taxYearConversion !== undefined && $scope.taxYearConversion !== null && $scope.taxYearConversion !== "") {
			$scope.softwareYear = Object.keys($scope.taxYearConversion)
		}
		$scope.softwareName = $filter('orderBy')($scope.taxYearConversion[$scope.softwareYear[0]]);
		// Change Opetion of software base On tax year
		$scope.changeSoftwareYear = function () {
			$scope.softwareName = $filter('orderBy')($scope.taxYearConversion[$scope.uploadedSoftDetail.softwareYear], 'text');
		}
		init();
	}]);

//controller for list part of conversion module
conversionApp.controller('conversionListController', ['$scope', '$log', '$q', '$http', '$location', '$filter', '$timeout', '$injector', 'NgTableParams', 'dataAPI', 'userService',
	function ($scope, $log, $q, $http, $location, $filter, $timeout, $injector, NgTableParams, dataAPI, userService) {
		//holds the current selected year by user
		$scope.taxYear = userService.getTaxYear();
		if (parseInt($scope.taxYear) > 2017) {
			$location.path('/conversionnew');
		}

		//Check for privileges
		$scope.userCan = function (privilege) {
			return userService.can(privilege);
		};

		//Remove if condition to allow conversion in demo a/c.
		//If demo user try to open conversion list by url. He/She will be prompted with dialog to either register
		//or continue with demo (which redirect user to home page)    
		if (userService.getValue('isDemoUser') == true) {
			var salesDialogService = $injector.get('salesDialogService');
			salesDialogService.openSalesDialog("conversion");
		}


		$scope.manuallyRefresh = function () {
			_initList().then(function (response) {
				$scope.conversionListTable.reload();
				$scope.refreshStart = false;
			}, function (error) {
				$log.error(error);
				$scope.refreshStart = false;
			});
		};
		//to initialize the list page of conversion
		var _initList = function () {
			var deferred = $q.defer();
			if ($scope.userCan('CAN_LIST_CONVERSION')) {
				$http.post(dataAPI.base_url + '/conversion/list').then(function (response) {
					$scope.conversionList = response.data.data;
					//loop is to assign the text in place of numeric value in status of conversion list
					for (var count = 0; count < $scope.conversionList.length; count++) {
						// if ($scope.conversionList[count].status == 1 || $scope.conversionList[count].status == 0) {
						// 	$scope.conversionList[count].status = 'In Process';
						// }
						if ($scope.conversionList[count].status == 7) {
							$scope.conversionList[count].status = 'Finished';
						} else if ($scope.conversionList[count].status == 6) {
							$scope.conversionList[count].status = 'Error';
						} else {
							$scope.conversionList[count].status = 'In Process';
						}
						//filtering the date object in require format
						$scope.conversionList[count].createdDate = $filter('date')($scope.conversionList[count].createdDate, "MM/dd/yyyy");
					}
					deferred.resolve();
				}, function (error) {
					$log.log(error);
					deferred.reject(error);
				});

			} else if (!$scope.userCan('CAN_LIST_CONVERSION')) {
				$location.path('/home');
			}
			return deferred.promise;
		};

		var gridFilterOrderedData = [];//hold grid data with order and filter
		//rendering data to table and applying search functionality on it.
		$scope.conversionListTable = new NgTableParams({
			page: 1, // show initial page
			count: 10 // count per page

		}, {
				total: 0, // length of data
				sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
				getData: function ($defer, params) {
					// Request to API
					// get Data here				
					if (angular.isUndefined($scope.conversionList)) {
						_initList().then(function () {
							// Only On successful API response we bind data to grid.			
							var filteredData = $scope.conversionList;
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
					}
					else {
						// Only On successful API response we bind data to grid.			
						var filteredData = $scope.conversionList;
						//filter based on search field $scope.searchField
						if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
							filteredData = $filter('filter')(filteredData, function (conversion, index) {
								if (angular.isDefined(conversion.softwareName.text) && conversion.softwareName.text.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
									return true;
								}
								else if (angular.isDefined(conversion.taxYear) && conversion.taxYear.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
									return true;
								}
								else if (angular.isDefined(conversion.status) && conversion.status.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
									return true;
								}
								else if (angular.isDefined(conversion.createdDate) && conversion.createdDate.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
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
		//Object holding timeout
		var filterTimeout = {};
		//Watch for search field
		$scope.$watch('searchField', function (newVal, oldVal) {
			//If Grid data is defined and newval and old val is not same
			if ($scope.conversionListTable.settings().$scope != null && newVal != oldVal) {
				//Cancel old search filter
				$timeout.cancel(filterTimeout);
				//Register new timeout for filter
				filterTimeout = $timeout(function () {
					//Reload grid. Which will re-bind data by filtering it
					$scope.conversionListTable.reload();
					//go to first page.
					$scope.conversionListTable.page(1);
				}, 300);

			}
		});

		$scope.clearSearch = function (){
			$scope.searchField = '';
		};
		//method call on new button of list page when user want to add new conversion
		$scope.uploadNewConversion = function () {
			$location.path('conversion/new');
		};

	}]);

conversionApp.factory("conversionService", [function () {
	var conversionService = {};

	conversionService.selectedSoftware = "";

	conversionService.setSelectedSoftware = function (software) {
		conversionService.selectedSoftware = software;
	};

	conversionService.getSelectedSoftware = function () {
		return conversionService.selectedSoftware;
	};

	return conversionService;
}]);
