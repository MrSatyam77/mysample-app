var app = angular.module('taxApp', ['ngAnimate', 'ngTouch', 'ngCookies', 'pascalprecht.translate', 'ngTable', 'ui.bootstrap', 'toaster', 'angular-loading-bar',
	'ngSanitize', 'ui.select', 'ngCsv', 'kendo.directives', 'angular-intro', 'vcRecaptcha', 'taxRoutes', 'returnApp',
	'eFileSummaryWidget', 'trainingWidget', 'notesWidget', 'documentsWidget', 'calculatorWidget', 'printPacketsConfigurationWidget', 'completeSummaryApp',
	'newReturnApp', 'estimatorApp', 'commonServices', 'commonDirective',
	'preloadCheckApp', 'ui.layout', 'dialogs.main', 'dialogs.default-translations', 'colorpicker.module', 'ngFileUpload', 'EINApp',
	'preparerApp', 'printPacketsConfigurationApp', 'textAngular', 'clientLetterApp', 'summaryApp', 'epsApp', 'epsepayApp',
	'atlasApp', 'priceListApp', 'conversionApp', 'clientOrganizerApp', 'angular-sortable-view', 'commonController', 'commonFilters', 'tryItNowApp', 'reportApp', 'interviewApp', 'setup', 'redirectApp',
	'refundAdvantageApp', 'tpgApp', 'protectionPlusApp', 'redBirdApp', 'auditAlliesApp', 'cfp.hotkeys',
	'lineHelpWidget', 'customReturnTemplateListApp', 'monospaced.qrcode', 'prettyXml', 'clientPortalQuesAnsWidget', 'ngclipboard', 'clientPortalSignatureVerificationDialog', 'templatesApp']);


//Application constants
app.constant('dataAPI', {
	/* @if NODE_ENV='production' **
	base_url:'https://api.mytaxprepoffice.com',
	subscription_url:'https://subscription.mytaxprepoffice.com',
	media_url:'https://media.mytaxprepoffice.com',
	media_id:'2861A2772BAEB52425F62F5C046D12C8',
	chat_url:'chat.mytaxprepoffice.com',
	static_url : 'https://static.mytaxprepoffice.com',
	websocket_url:'https://ws.mytaxprepoffice.com',
	recaptcha_key: '6LfjgwsUAAAAAP7skKitqZLf6KOMZQwM9Pv63m4D',
	testingtool_url: 'https://mtpotesttoolapi.advanced-taxsolutions.com',
	firebase: {
		apiKey: "AIzaSyCEaYqDNKxijos2DyesbmpVauNg5MV1lgQ",
		authDomain: "live-tax-application.firebaseapp.com",
		databaseURL: "https://live-tax-application.firebaseio.com",
		projectId: "live-tax-application",
		storageBucket: "live-tax-application.appspot.com",
		messagingSenderId: "840619808027"
	}
	/* @endif */

	/* @if NODE_ENV='local' */
	base_url: 'https://api.advanced-taxsolutions.com',
	static_url: 'https://static.advanced-taxsolutions.com',
	media_url: 'https://media.mytaxprepoffice.com',
	media_id: 'B6E3FBFBBC818A19FEC121492F5A5AC8',
	chat_url: 'chat.advanced-taxsolutions.com',
	websocket_url: 'https://ws.secureservice.cloud/',
	recaptcha_key: '6LdGP6kUAAAAAKOIopdDDyn3AfdV0cKDxT3rxWNA',
	testingtool_url: 'https://mtpotesttoolapi.advanced-taxsolutions.com',
	firebase: {
		apiKey: "AIzaSyAUZgbdaCPRhFuO03sAz7WkN5-qJwLelbc",
		authDomain: "test-tax-application.firebaseapp.com",
		databaseURL: "https://test-tax-application.firebaseio.com",
		projectId: "test-tax-application",
		storageBucket: "",
		messagingSenderId: "454556854348"
	},
	/* @endif */

	/* @if NODE_ENV='test' **
	base_url:'https://api.advanced-taxsolutions.com',
	subscription_url:'http://subscription.advanced-taxsolutions.com',
	static_url : 'https://static.advanced-taxsolutions.com',
	media_url:'https://media.mytaxprepoffice.com',
	media_id:'B6E3FBFBBC818A19FEC121492F5A5AC8',
	chat_url:'chat.advanced-taxsolutions.com',
	websocket_url:'https://ws.advanced-taxsolutions.com',
	recaptcha_key: '6Lc1sGgUAAAAAJ1xWc5Ylw9Zgus5L3D2aGXM-Gnw',
	testingtool_url: 'https://mtpotesttoolapi.advanced-taxsolutions.com',
	firebase: {
		apiKey: "AIzaSyDNOGxIf74M5V63CHFL25wIEXwez1L79mI",
		authDomain: "beta-tax-application.firebaseapp.com",
		databaseURL: "https://beta-tax-application.firebaseio.com",
		projectId: "beta-tax-application",
		storageBucket: "beta-tax-application.appspot.com",
		messagingSenderId: "778432896517"
	}
	/* @endif */
});

//Constant to have environment beta/live
app.constant('environment', {
	/* @if NODE_ENV='local' */
	mode: 'local'
	/* @endif */
	/* @if NODE_ENV='test' **
	mode:'beta'
	/* @endif */
	/* @if NODE_ENV='production' **
	mode:'live'
	/* @endif */
});


/* @if NODE_ENV='local'|| NODE_ENV='test'*/
//TODO: We assume that it will improve performance of application.
//If required to debug then fire this in console- angular.reloadWithDebugInfo();
app.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
}]);
/* @endif */

//config to enable CORS.
app.config(['$sceDelegateProvider', function ($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our static domain.  Notice the difference between * and **.
		/* @if NODE_ENV='local' */
		'http://192.168.0.40:3001/**', 'http://192.168.0.174:3001/**', 'http://192.168.0.174:3002/**', 'http://192.168.0.14:3001/**', 'http://192.168.0.158:3001/**', 'http://192.168.0.40:3001/**', 'http://192.168.0.40:3000/**', 'http://localhost:3012/**', 'http://192.168.0.152:3001/**', 'http://192.168.0.230:3001/**', 'http://192.168.0.148:3001/**', 'http://192.168.0.146:3001/**',
		'https://static.advanced-taxsolutions.com/**', 'https://api.advanced-taxsolutions.com/**', 'http://192.168.0.253:3003/**', 'http://192.168.0.166:3002/**', 'http://192.168.0.148:3002/**', 'https://media.mytaxprepoffice.com/**', 'http://192.168.0.14:3002/**', 'http://192.168.0.14:3003/**',
		'https://api.mytaxprepoffice.com:8843/**', 'chatnode.advanced-taxsolutions.com:31130/**', 'http://api-tv.advanced-taxsolutions.com/**', 'http://static-tv.advanced-taxsolutions.com/**', 'https://teststatic.mytaxprepoffice.com/**', 'https://testapi.mytaxprepoffice.com']);
	/* @endif */
	/* @if NODE_ENV='production' **
	'https://static.mytaxprepoffice.com/**','https://api.mytaxprepoffice.com/**','https://static.taxvisioncloud.com/**','https://api.taxvisioncloud.com/**','https://static.mytaxprepoffice.com/**','https://static.secureservice.cloud/**','https://api.mytaxprepoffice.com/**','https://teststatic.mytaxprepoffice.com/**']);
	/* @endif */
	/* @if NODE_ENV='test' **
	'https://static.advanced-taxsolutions.com/**','https://api.advanced-taxsolutions.com/**','http://api-tv.advanced-taxsolutions.com/**','http://static-tv.advanced-taxsolutions.com/**',
	'http://192.168.0.40:3001/**', 'http://192.168.0.40:3011/**', 'https://testapi.mytaxprepoffice.com/**','https://teststatic.mytaxprepoffice.com/**']);
	/* @endif */


	// The blacklist overrides the whitelist so the open redirect here is blocked.
	$sceDelegateProvider.resourceUrlBlacklist(['http://myapp.example.com/clickThru**']);
}]);



//Register intercepter for $http request and response
app.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push('httpInterceptor');
	//Enable with credentials -true  for every call
	$httpProvider.defaults.withCredentials = true;
}]);


//To setup themes, etc... on initialization
app.run(['$rootScope', 'dataAPI', '$window', 'communicationService', 'resellerService', 'environment', 'contentService', function ($rootScope, dataAPI, $window, communicationService, resellerService, environment, contentService) {
	$rootScope.selectedTheme = 'classic';

	// set api and static url comes from reseller doc.
	var resellerConfig = resellerService.getResellerConfig();
	if (environment.mode !== 'local' && resellerConfig && resellerConfig.baseUrl && resellerConfig.staticUrl) {
		dataAPI.base_url = resellerConfig.baseUrl;
		dataAPI.static_url = resellerConfig.staticUrl;
	}

	var updateScreenSize = function () {
		if (angular.isUndefined($rootScope.headerNav)) {
			$rootScope.headerNav = {};
		}
		$rootScope.headerNav.screenWidth = $window.innerWidth;
		$rootScope.headerNav.screenHeight = $window.innerHeight;

		//Expand /collapse right pane as per user screen size
		if (angular.isDefined($rootScope.headerNav)) {
			//Do not collapse or expand if user has changed that by clicking in header 
			if (angular.isUndefined($rootScope.headerNav.collapseRightPaneByUser) || $rootScope.headerNav.collapseRightPaneByUser == false) {
				if ($rootScope.headerNav.screenWidth < 1440) {
					$rootScope.headerNav.collapseRightPane = true;
				} else {
					if (!$rootScope.headerNav.collapseRightPaneClose) {
						$rootScope.headerNav.collapseRightPane = false;
					}
				}
			}
		} else {//First time when page loads
			if ($rootScope.headerNav.screenWidth < 1440) {
				$rootScope.headerNav = { collapseRightPane: true };
			} else {
				$rootScope.headerNav = { collapseRightPane: false };
			}
		}

		//Expand /collapse left pane as per user screen size
		if (angular.isDefined($rootScope.headerNav)) {
			//Do not collapse or expand if user has changed that by clicking in header
			if (angular.isUndefined($rootScope.headerNav.collapseLeftPaneByUser) || $rootScope.headerNav.collapseLeftPaneByUser == false) {
				if ($rootScope.headerNav.screenWidth < 1200) {
					$rootScope.headerNav.collapseLeftPane = true;
				} else {
					if (!$rootScope.headerNav.collapseLeftPaneClose) {
						$rootScope.headerNav.collapseLeftPane = false;
					}
				}
			}
		} else {
			if ($rootScope.headerNav.screenWidth < 1200) {//First time when page loads
				$rootScope.headerNav = { collapseLeftPane: true };
			} else {
				$rootScope.headerNav = { collapseLeftPane: false };
			}
		}
	}

	angular.element($window).bind('resize', function () {
		updateScreenSize();
	});

	updateScreenSize();

	// this function is temporary to open signature dialog from angular side. will discarded once signature module rewrites in angular.
	var transmitterSubscription = communicationService.transmitter.subscribe(function (message) {
		if (message.topic === "refreshTaxYear" && message.channel === "contentService") {
			contentService.refreshTaxYear();
		}
	})

}]);

//TODO: We should make session call before bootstraping angularjs like we have done for reseller configuration
//call apis to get reseller config, establish session and get application version once per application boot
app.run(['$http', '$log', 'dataAPI', '$injector', '$location', '$rootScope', 'resellerService', 'softwareReleaseService', 'loadingBarService', 'serviceWorkerIPC', 'networkHealthService', function ($http, $log, dataAPI, $injector, $location, $rootScope, resellerService, softwareReleaseService, loadingBarService, serviceWorkerIPC, networkHealthService) {
	//Check network avaibility and register auto check
	networkHealthService.startNetworkCheck();
}]);

//Register $routeChangeStart event to intercept route change and redirect user to login page if it has not been Authenticated (logged in)
app.run(['$rootScope', '$location', 'environment', '$window', '$timeout', '$log', '$injector', 'toaster', 'authService', 'localStorageUtilityService', 'preLoadService', 'userService', 'resellerService', 'messageService', 'mediaService', 'basketService', function ($rootScope, $location, environment, $window, $timeout, $log, $injector, toaster, authService, localStorageUtilityService, preLoadService, userService, resellerService, messageService, mediaService, basketService) {
	$rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
		// Check whether browser is supported or not. We check it at time of login, so it will not go any further.
		var locPath = $location.path();
		//change for 2019 allowed feature
		if (environment.mode == 'live' && userService.getTaxYear() == '2019' && locPath != '/home' && locPath != '/login' && locPath != '/logout' && locPath != '/registration' && locPath != '/redirect/_registration' && locPath != '/redirect/_home' && locPath != '/redirect/_alert_allowedFeature' && locPath != '/alert/allowedFeature' && locPath != '/manage/change/password' && locPath.indexOf('/manage') != 0 && locPath != '/logout' && locPath != '/alert/privilegesInfo' && locPath.indexOf('/bank') != 0 && locPath.indexOf('/office') != 0 && locPath.indexOf('/preferences') != 0 && locPath.indexOf('/home/settings') != 0 && locPath.indexOf('/instantFormView') != 0) {
			$location.path('/alert/allowedFeature');
		}
		if (locPath.indexOf('/login') > -1 || locPath.indexOf('/registration') > -1 || locPath == '/tryitnow') {
			// If browser is not supported then redirect to appropriate page
			// if (!(environment.mode == 'beta' || environment.mode == 'local')) {
			// 	if (!preLoadService.isBrowserSupported()) {
			// 		//We have to wrap location change inside $evalAsync,so that the location changes properly and everything stays in sync
			// 		$rootScope.$evalAsync(function () {
			// 			$location.path('/browsersupport');
			// 		});
			// 	}
			// }
			// condition to check nextRoute.access id not null and has the featureToRemove property
			if (nextRoute != null && nextRoute.featureName) {
				// call the resellerService function to check whether the feature exist in featureToRemove of resellerConfig
				if (!resellerService.hasFeature(nextRoute.featureName)) {
					// cancel route change request
					event.preventDefault();
				}
			}
		}
		//redirect only if isAuthenticated is false
		$log.debug('route auth - ' + authService.getIsAuthenticated() + ' next location - ' + nextRoute.originalPath);
		if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication) {
			if (!authService.getIsAuthenticated() || localStorageUtilityService.checkLocalStorageKey('xsrfToken') == false) {
				//Store user path before redirect to login
				authService.setLastUserPath($location.path());
				//check if current route is login and has any params to be passed
				var _loginPath = '/login';
				if (!_.isUndefined(currentRoute) && !_.isUndefined(currentRoute.pathParams)) {
					for (var param in currentRoute.pathParams) {
						_loginPath = _loginPath + '/' + currentRoute.pathParams[param];
					}
				}
				//We have to wrap location change inside $evalAsync,so that the location changes properly and everything stays in sync
				$rootScope.$evalAsync(function () {
					$location.path(_loginPath);
				});
			} else if (authService.getIsAuthenticated() && userService.getIsPasswordChangeRequired() == true) {
				$location.path('/manage/change/password/expire');
			} else if (authService.getIsAuthenticated() && userService.getIsNavigatorUser() == true) {
				$location.path('/home');
				if (nextRoute.originalPath == '/home') {
					var dialogService = $injector.get('dialogService');
					var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
						"taxAppJs/common/partials/navigatorUserInstruction.html", "navigatorUserInstructionDialogController");
					dialog.result.then(function (response) {
						if (response == true) {
							//For Media API
							mediaService.callView('logout', '', '');

							//Call logout api
							authService.logout().then(function (success) {
								// Issue :- manually bootstrap IF possible.
								$window.location.reload(true);
								messageService.showMessage('Logged Out Successfully', 'success', 'HEADERNAVCON_LOGOUTSUCCESS_MSG');
							}, function (error) {
								$log.error(error);
							});
						}
					});
				}
			} else {//If user is authenticated check for any privilege required to access module
				authService.setLastUserPath('');
				//Check if we have defined any privileges for this route.
				//This feature is used to prevent user from logged out where he does not have rights and controller start making calls to api.
				//We will either redirect to home page without any message (for path called by our code but user does not have rights) or
				//just show dialog with missing privileges.
				if (nextRoute.access.privileges) {
					//check for each privileges. It may possible we require more then one privilege for some module
					for (var pIndex in nextRoute.access.privileges) {
						if (nextRoute.access.privileges[pIndex].includes("CAN_") && userService.can(nextRoute.access.privileges[pIndex]) == false) {
							//cancel route change request
							event.preventDefault();
							if (userService.getUserDetails().currentLocationId) {
								basketService.pushItem("requireprivileges", { privilegesList: nextRoute.access.privileges })
								$location.path("/alert/privilegesInfo");
							} else if (!currentRoute || !currentRoute.$$route || currentRoute.$$route.originalPath !== "/manage/location/selection/:mode?") {
								$location.path("/manage/location/selection");
							}
							return false;
						}
					}
				}
				// privilege check end
				// condition to check nextRoute.access id not null and has the featureToRemove property
				if (nextRoute.featureName) {
					// call the resellerService function to check whether the feature exist in featureToRemove of resellerConfig
					if (!resellerService.hasFeature(nextRoute.featureName)) {
						//cancel route change request
						event.preventDefault();
					}
				}
			}
		}
		// In case of logout we don't need to go further.
		else if (angular.isDefined(currentRoute) && angular.isDefined(currentRoute.originalPath) && currentRoute.originalPath == '/logout') {
			authService.setLastUserPath("/logout");
			//We have to wrap location change inside $evalAsync,so that the location changes properly and everything stays in sync
			$rootScope.$evalAsync(function () {
				$location.path('/login');
			});
		}
		else if ((nextRoute.originalPath == '/login/:userName?/:password?' || nextRoute.originalPath == '/login/:option?') && authService.lastUserPath == '') {
			//If User is already logged in redirect to Home page
			$log.debug('route auth - ' + authService.getIsAuthenticated());
			if (authService.getIsAuthenticated() && localStorageUtilityService.checkLocalStorageKey('xsrfToken') == true) {
				//We have to wrap location change inside $evalAsync,so that the location changes properly and everything stays in sync
				$rootScope.$evalAsync(function () {
					$location.path('/home');
				});

			} else {
				//We have to wrap location change inside $evalAsync,so that the location changes properly and everything stays in sync
				$rootScope.$evalAsync(function () {
					$location.path('/home');
				});
			}
		}
	});
}]);

//Other application level configurations
app.config(['$locationProvider', '$translateProvider', '$provide', 'cfpLoadingBarProvider', 'hotkeysProvider', 'vcRecaptchaServiceProvider',
	function ($locationProvider, $translateProvider, $provide, cfpLoadingBarProvider, hotkeysProvider, vcRecaptchaServiceProvider) {
		//enable-disabled html5mode.
		$locationProvider.html5Mode(true);

		//Configuration for loading bar
		//Do not show spinner
		cfpLoadingBarProvider.includeSpinner = false;

		//load timezone data for moment
		moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');

		// To sanitize content provided to translate service. IF not set then it will enable CSP threat.
		// 'escaped' mode means it will sanitize all the inputs.
		$translateProvider.useSanitizeValueStrategy('escaped');

		//Configuration for reCaptcha
		/* @if NODE_ENV='local' */
		vcRecaptchaServiceProvider.setSiteKey('6LcuiWgUAAAAAL5jHG7x18pxrgOVuGMFBDsIHSUq');
		/* @endif */
		/* @if NODE_ENV='test' **
		vcRecaptchaServiceProvider.setSiteKey('6Lc1sGgUAAAAAJ1xWc5Ylw9Zgus5L3D2aGXM-Gnw');
		/* @endif */
		/* @if NODE_ENV='production' **
		vcRecaptchaServiceProvider.setSiteKey('6LfjgwsUAAAAAP7skKitqZLf6KOMZQwM9Pv63m4D');
		/* @endif */

		//Configuration for Editor (Text-Angular)
		// this demonstrates how to register a new tool and add it to the default toolbar
		$provide.decorator('taOptions', ['$delegate', function (taOptions) {
			// $delegate is the taOptions we are decorating
			// here we override the default toolbars and classes specified in taOptions.
			taOptions.toolbar = [
				['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
				['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
				['justifyLeft', 'justifyCenter', 'justifyRight'],
				['insertLink']
			];
			taOptions.classes = {
				focussed: 'focussed',
				toolbar: 'btn-toolbar',
				toolbarGroup: 'btn-group',
				toolbarButton: 'btn btn-default',
				toolbarButtonActive: 'active',
				disabled: 'disabled',
				textEditor: 'form-control',
				htmlEditor: 'form-control'
			};
			return taOptions; // whatever you return will be the taOptions
		}]);

		//Following code disables animation for all modals.
		//This was needed because modal was not closing in UI-Bootstrap 0.13v due to problem of animation.
		//$modalProvider.options.animation = false;

		//disable auto cheatsheet for angular hotkeys
		hotkeysProvider.includeCheatSheet = false;

		// //configuration for idle directive
		// taxIdleConfigProvider.setIdleTime(30);
		// taxIdleConfigProvider.setWarningTime(2);
		// //configuration for tax session 24 directive
		// taxSession24ConfigProvider.seIintervalTime(1);
		// taxSession24ConfigProvider.setWarningTime(30);
	}]);

//////////////////////////////////// MANUAL BOOTSTRAP & PRE-BOOTSTRAP ACTIONS /////////////////////////////////////////////////

//This function will hold all pre bootstrap actions required
var performPreBootstrapActions = function () {
	//API base url as per environment
	var base_url =/* @if NODE_ENV='local' */'http://192.168.0.40:3000';/* @endif *//* @if NODE_ENV='production' **'https://api.mytaxprepoffice.com';/* @endif *//* @if NODE_ENV='test' **'https://testapi.mytaxprepoffice.com';/* @endif */
	//get $http service of angular
	var initInjector = angular.injector(["ng"]);
	var $http = initInjector.get("$http");

	//Load reseller configuration
	$http.get(base_url + '/reseller/configuration?appId=' + reseller_config_global.appId).then(function (response) {
		//Assign response to global variable. This will be used to assign this data to angular service
		reseller_config_global = response.data.data;
		//Dashboard CSS (Reseller CSS) - START
		//Load CSS from server (preprocess less as per reseller preferences)			
		$http({
			method: 'POST',
			url: base_url + '/reseller/style/dashboard',
			data: {
				resellerId: reseller_config_global.appId
			}
		}).then(function (dashboardCSS) {
			//If file return any data
			if (dashboardCSS.data != undefined) {
				//Append CSS to body
				var _dashboardCSS = document.createElement('style');
				_dashboardCSS.id = "dashboardStyle";
				_dashboardCSS.innerHTML = dashboardCSS.data.data;
				document.body.appendChild(_dashboardCSS);
			}

			//Load CSS file for media queries related to dashboard
			//TODO: As we need this to be injected after actual css (less), we have written here.
			//Please find alternate solution as this will block application startup until this css get loaded
			$http.get('taxAppJs/home/css/dashboard.css').then(function (dashboardCSS) {
				//If file return any data
				if (dashboardCSS.data != undefined) {
					//Append CSS to body
					var _dashboardCSS = document.createElement('style');
					_dashboardCSS.id = "dashboardMediaStyle";
					_dashboardCSS.innerHTML = dashboardCSS.data;
					document.body.appendChild(_dashboardCSS);
				}
				//Bootstrap angular app
				// bootstrapApplication();
			}).catch(function (fileError) {
				//Bootstrap angular app
				// bootstrapApplication();				
			});
		}).catch(function (error) {
			//Bootstrap angular app
			// bootstrapApplication();				
		});

		//Dashboard CSS (Reseller CSS) - END			
	}, function (error) {
		console.error(error);
	});
}

//This function is called to manually bootstrap angular application
var bootstrapApplication = function () {
	angular.bootstrap(document, ["taxApp"]);
};

//If document is ready then check for pre bootstrap requirement and bootsrap application manually
angular.element(document).ready(function () {
	// performPreBootstrapActions();
});
