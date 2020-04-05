"use strict";

var preloadCheckApp = angular.module('preloadCheckApp', []);

//preload check controller
preloadCheckApp.controller('preloadCheckController', ['$scope', '$location', 'environment', 'preLoadService', function ($scope, $location, environment, preLoadService) {
	/*
	 *  If user wants to proceed further even when their browser is not supported.
	 */
	$scope.forceBrowserSupport = function () {
		preLoadService.setBrowserSupport(true);
		$location.path('/login');
	}

	//function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function () {
		if (environment.mode == 'beta' || environment.mode == 'local')
			return true;
		else
			return false;
	};
}]);

//preload check controller
preloadCheckApp.controller('preloadCheckDialogController', ['$scope', '$location', 'environment', 'preLoadService', '$modalInstance', 'dataAPI', function ($scope, $location, environment, preLoadService, $modalInstance, dataAPI) {

	$scope.browserSupportList = [];

	/*
	 *  If user wants to proceed further even when their browser is not supported.
	 */
	$scope.forceBrowserSupport = function () {
		preLoadService.setBrowserSupport(true);
		var pcConfig = preLoadService.getPCConfig();
		preLoadService.markBrowserSupport(pcConfig).then(function () {
			$scope.close(true);
		}, function (error) {
			console.error(error);
		});
	}

	//function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function () {
		if (environment.mode == 'beta' || environment.mode == 'local')
			return true;
		else
			return false;
	};


	$scope.close = function () {
		$modalInstance.dismiss(false);
	};

	var _init = function () {
		var browserDetails = preLoadService.getUserAgentDetails();
		if (browserDetails.support && browserDetails.support.length > 0) {
			$scope.browserSupportList = browserDetails.support;
			for (var index in $scope.browserSupportList) {
				$scope.browserSupportList[index].os = browserDetails.os;
			}
		} else {
			// For which we doesnot support they will see all the details
			$scope.browserSupportList = [];
			for (var os in reseller_config_global.browserSupport) {
				for (var browsers in reseller_config_global.browserSupport[os]) {
					var obj = reseller_config_global.browserSupport[os][browsers];
					var isExists = _.findIndex($scope.browserSupportList, function (t) { return obj.browser.indexOf(t.browser) > -1 });
					if (isExists === -1) {
						obj.os = os;
						$scope.browserSupportList.push(obj);
					} else {
						$scope.browserSupportList[isExists].os += " / " + os
					}
				}
			}
		}
	}

	_init();
}]);

//preload check health
preloadCheckApp.controller('healthCheckController', ['$scope', '$location', 'environment', 'preLoadService', function ($scope, $location, environment, preLoadService) {

	$scope.message = "Calling API";

	var _init = function () {
		preLoadService.checkHealth().then(function (response) {
			$scope.message = "Health Check is Successful!";
		}, function (error) {
			$scope.message = "Error while checking Health!";
		});
	}

	_init();
}]);


/**
 * This service is responsible for doing all task before proceeding further to application
 */
preloadCheckApp.factory('preLoadService', ['$window', '$log', 'localStorageUtilityService', '$http', '$q', 'dataAPI', '_', function ($window, $log, localStorageUtilityService, $http, $q, dataAPI, _) {
	var preLoadService = {};

	// Flag to check whether user want to proceed further even if browser not supported
	preLoadService.forceBrowserSupport = false;
	preLoadService.userAgent = {};

	/**
	 * Check Whether Browser is supported
	 */
	preLoadService.isBrowserSupportedUAParser = function () {
		var parser = new UAParser();
		var userAgent = parser.getResult();
		var browserSupportDoc = reseller_config_global.browserSupport;
		var supports = [];
		if (browserSupportDoc && browserSupportDoc[userAgent.os.name]) {
			supports = browserSupportDoc[userAgent.os.name];
		}
		preLoadService.userAgent = {
			browserName: userAgent.browser.name,
			isBrowserSupported: false,
			version: userAgent.browser.major,
			os: userAgent.os.name,
			support: supports
		};
		$log.debug(userAgent);

		// Check whether the os which is used support this browser
		if (browserSupportDoc && browserSupportDoc[userAgent.os.name] && browserSupportDoc[userAgent.os.name].length > 0) {
			var support = browserSupportDoc[userAgent.os.name];
			for (var browserDetails in support) {
				if (userAgent.browser && support[browserDetails].browser === userAgent.browser.name && !isNaN(parseInt(userAgent.browser.major)) && parseInt(userAgent.browser.major) >= support[browserDetails].version) {
					preLoadService.userAgent.isBrowserSupported = true;
					return true;
				}
			}
		}

		// Check whether user want to proceed further even if browser not supported
		if (preLoadService.checkBrowserSupport()) {
			return true;
		}
		return false;
	}

	preLoadService.isBrowserSupported = function () {
		// Check whether user want to proceed further even if browser not supported
		if (preLoadService.checkBrowserSupport()) {
			return true;
		}

		var objAgent = $window.navigator.userAgent;
		var objfullVersion, isBrowserSupported = false, objOffsetVersion;
		$log.debug(objAgent);

		// From mobile browser of Anroid and ios
		if ((objAgent.indexOf("Mobile")) != -1) {
			isBrowserSupported = true;
			preLoadService.userAgent.browserName = "Mobile";
		}

		//In edge browser
		else if ((objOffsetVersion = objAgent.indexOf("Edge")) != -1) {
			preLoadService.userAgent.browserName = "Edge";
			objfullVersion = objAgent.substring(objOffsetVersion + 5, objOffsetVersion + 7);
			if (objfullVersion >= 14)
				isBrowserSupported = true;
		}

		//In Chrome
		else if ((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) {
			objfullVersion = objAgent.substring(objOffsetVersion + 7, objOffsetVersion + 9);
			preLoadService.userAgent.browserName = "Chrome";
			preLoadService.userAgent.version = objfullVersion;

			if (objfullVersion >= 34)
				isBrowserSupported = true;
		}

		// In Firefox
		else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
			objfullVersion = objAgent.substring(objAgent.lastIndexOf('/') + 1);
			preLoadService.userAgent.browserName = "Firefox";
			preLoadService.userAgent.version = objfullVersion;
			if (objfullVersion >= 29)
				isBrowserSupported = true;
		}


		// In Safari 
		// Issue : Chrome also have Safari value in its User agent, so we have to check whether it comes from MAC OS (official OS for Safari). 
		// Current User agent : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.1.25 (KHTML, like Gecko) Version/8.0 Safari/600.1.25"
		// Note : IF user agent format will change then this code will not work. 
		//		
		else if ((objOffsetVersion = objAgent.indexOf("Mac OS")) != -1) {
			// for mac os
			if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
				// split by space.
				var userAgents = objAgent.split(" ");
				// loop through array.				 
				_.forEach(userAgents, function (str) {
					// check whether string has 'version' ( safari 8 - version/8.0 )
					if (str.toLowerCase().indexOf("version") > -1) {
						//split version by splace '/'
						var versionArray = str.split("/");
						if (!_.isUndefined(versionArray[1])) {
							// replace additional characters, parse to integer
							str = parseInt(versionArray[1].replace("(", "").replace(" ", "").replace(")", "").replace("/", ""));
							if (str > 7.0) {
								isBrowserSupported = true;
							}
						}
					}
				});

				// following code checks for mac os version and then checks browser's version.
				// This is not needed because safari is available from mac os 10.7 onwards only.

				/* //split user agent by space.
				var userAgents = objAgent.split(" ");
				//find os word's index and add 2 in that.
				// because we expect that in mac os there will be version after mac os x 10_10)				
				var indexOfOSVersion = _.indexOf(userAgents,"os") + 2;
				//get version of mac os(string value like 10_10_1)
				var osVersionstr = userAgents[indexOfOSVersion];
				//split string by underscore '_'
				var osVersionArray = osVersionstr.split("_");
				console.log(osVersionArray);
				// replace space, right- left round brackets.
				// It is very important. If we remove this browser support code will not work properly.
				if(!_.isUndefined(osVersionArray[0])){
					if(!_.isUndefined(osVersionArray[1])){
						var osVersion = parseInt(osVersionArray[0].toString().replace("(","").replace(" ","").replace(")","").replace("/",""));
						console.log(osVersion);
						var osSubVersion = parseInt(osVersionArray[1].toString().replace("(","").replace(" ","").replace(")","").replace("/",""));
						console.log(osSubVersion);
						
						//check whether mac os version greater then 10 or 10.9 
						if(osVersion >= 10 && osSubVersion >= 9){					
							_.forEach(userAgents, function(str) {								
								if(str.toLowerCase().indexOf("version") > -1){									
									var versionArray = str.split("/");
									if(!_.isUndefined(versionArray[1])){
										str = versionArray[1].replace("(","").replace(" ","").replace(")","").replace("/","");
										if(str > 7.0){
											isBrowserSupported=true;
										}
									}									
								}
							});
						}
					}
				}*/
			}
		}

		/*
		 *  In Microsoft internet explorer
		 *  		
		 */

		else if ((objOffsetVersion = objAgent.indexOf("MSIE")) != -1 || (objOffsetVersion = objAgent.indexOf("rv:11.0")) != -1) {
			objfullVersion = objAgent.substring(objOffsetVersion + 5);
			preLoadService.userAgent.browserName = "IE";
			if ((objOffsetVersion = objAgent.indexOf("rv:11.0")) != -1) {
				preLoadService.userAgent.version = "11";
				isBrowserSupported = true;
			} else {
				preLoadService.userAgent.version = objfullVersion.substring(0, 2);
				isBrowserSupported = false;
			}
		}

		else if ((objOffsetVersion = objAgent.indexOf("Opera")) != -1) {
			if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
				objfullVersion = objAgent.substring(objOffsetVersion + 8, objOffsetVersion + 11);

			preLoadService.userAgent.browserName = "Opera";
			preLoadService.userAgent.version = objfullVersion;
			isBrowserSupported = false;
		}


		return isBrowserSupported;
	};

	/*
	 *  Set forceBrowserSupport flag.
	 */
	preLoadService.setBrowserSupport = function (flag) {
		preLoadService.forceBrowserSupport = flag;
		//		localStorageUtilityService.addToLocalStorage('browserSupport',flag);
	};

	/*
	 *  Check whether user have continue wtihout browser support 
	 */
	preLoadService.checkBrowserSupport = function () {
		if (preLoadService.forceBrowserSupport == true) {
			return true;
		}
		/*else if(localStorageUtilityService.checkLocalStorageKey('browserSupport') == true){
			return true;
		}*/
		return false;
	};

	preLoadService.getUserAgentDetails = function () {
		return preLoadService.userAgent;
	};


	// Check Health
	preLoadService.checkHealth = function () {
		var deferred = $q.defer();
		$http.get(dataAPI.base_url + '/health/check').then(function (response) {
			preLoadService.userAgent = response.data.data;
			deferred.resolve(preLoadService.userAgent);
		});
		return deferred.promise;
	};


	preLoadService.markBrowserSupport = function (data) {
		var deferred = $q.defer();
		//load list from data api
		$http({
			method: 'POST',
			url: dataAPI.base_url + '/auth/browser/markSupport',
			data: data
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			$log.error(error);
			deferred.reject(error);
		});
		return deferred.promise;
	};


	// GET PC CONFIGURATION
	preLoadService.getPCConfig = function () {
		var uaDetails = preLoadService.getUserAgentDetails();
		if (!uaDetails || _.size(uaDetails) === 0) {
			preLoadService.isBrowserSupportedUAParser();
			uaDetails = preLoadService.getUserAgentDetails()
		}
		delete uaDetails.support;
		uaDetails.resolution = screen.height + ' X ' + screen.width
		uaDetails.browserZoom = window.devicePixelRatio * 100
		uaDetails.forceBrowserSupport = preLoadService.checkBrowserSupport();
		return uaDetails;
	};

	return preLoadService;
}]);