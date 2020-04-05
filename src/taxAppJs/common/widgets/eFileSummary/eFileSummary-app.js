"use strict";
var eFileSummaryWidget = angular.module('eFileSummaryWidget', []);

/* Services from here */
eFileSummaryWidget.factory('eFileSummaryService', ['$q', '$http', 'dataAPI', function ($q, $http, dataAPI) {
	var eFileSummaryService = {};

	eFileSummaryService.geteFileSummary = function () {
		var deferred = $q.defer();

		$http({
			method: 'post',
			url: dataAPI.base_url + '/efile/summary'
		}).then(function (response) {
			deferred.resolve(response.data.data);
		}, function (error) {
			deferred.reject(error);
		});

		return deferred.promise;
	};

	return eFileSummaryService;
}]);

/*Directives from here*/
eFileSummaryWidget.directive('eFileSummary', [function () {
	return {
		restrict: 'AE',
		templateUrl: 'taxAppJs/common/widgets/eFileSummary/partials/eFileSummary-template.html',
		scope: {},
		controller: ['$scope', '$rootScope', '$interval', '$location', '$log', '$timeout', '_', 'eFileSummaryService', 'eFileSumaryListService', 'userService', function ($scope, $rootScope, $interval, $location, $log, $timeout, _, eFileSummaryService, eFileSumaryListService, userService) {
			//Default data
			$scope.eFileSummaryList = { transmitted: 0, atIrs: 0, atState: 0, accpeted: 0, rejected: 0, alerts: 0 };
			//variable holding interval
			var refreshTimer;

			/*Register $interval for background update of list, third argument is for infinite and last is to prevent to execute on every dirty checking*/
			var refreshList = function () {
				refreshTimer = $interval(function () {
					if ($location.path() == '/home') {
						eFileSummaryService.geteFileSummary().then(function (response) {
							if (!_.isEmpty(response)) {
								$scope.eFileSummaryList = response;
							} else {
								$scope.eFileSummaryList = { transmitted: 0, atIrs: 0, atState: 0, accpeted: 0, rejected: 0 };
							}
						}, function (error) {
							$log.log(error);
							//If we receive token incorrect or unauthorized , do not continue this api until next initialization
							if (angular.isDefined(error) && angular.isDefined(error.data) && angular.isDefined(error.data.code) && (error.data.code == 4004 || error.data.code == 4005)) {
								cancelInterval();
							}
						});
					} else {
						cancelInterval();
					}
				}, 60100, 0, false);
			};

			//Refresh List
			//This method is responsible for calling List api and register/unregister interval for auto refresh
			//note: The real api call is moved to callEFileListAPI() function to avoid duplication of code.
			$scope.manualRefreshListeFileSummary = function (delay) {
				if ($scope.userCan('CAN_GET_EFILE_LIST')) {

					/*Cancel iterate of auto refresh if already registered*/
					if (angular.isDefined(refreshTimer)) {
						cancelInterval();
						refreshTimer = undefined;
					}
					//Check if delay is passed
					if (angular.isDefined(delay) && delay != null && delay != '') {
						$timeout(function () {
							//Call API function
							callEFIleListAPI();
						}, delay);
					} else {
						//Call API function
						callEFIleListAPI();
					}

				} else {
					// IF User don't have rights then we need to return '0' for stop animation of refresh icon 
					$rootScope.$broadcast('rejectedReturnsCounter', 0);
				}
			};

			//Real API call
			//Note: We have made this common to avoid duplication of code. As we have to call this api either from timeout or without timeout
			var callEFIleListAPI = function () {
				eFileSummaryService.geteFileSummary().then(function (response) {
					$scope.refreshStart = false;
					if (!_.isEmpty(response)) {
						$scope.eFileSummaryList = response;
					} else {
						$scope.eFileSummaryList = { transmitted: 0, atIrs: 0, atState: 0, accpeted: 0, rejected: 0 };
					}
					//Note: This will be listen at toDos widget to avoid api call
					$rootScope.$broadcast('rejectedReturnsCounter', $scope.eFileSummaryList.rejected);
					/*Re register background refresh of list if not*/
					if (angular.isUndefined(refreshTimer)) {
						refreshList();
					}
				}, function (error) {
					$scope.refreshStart = false;
					$rootScope.$broadcast('rejectedReturnsCounter', 0);
					/*Re register background refresh of list if not*/
					if (angular.isUndefined(refreshTimer)) {
						refreshList();
					}

					$log.log(error);
				});
			};

			//Check for privileges
			$scope.userCan = function (privilege) {
				return userService.can(privilege);
			};

			//Go to list screen with client side filter
			$scope.goToList = function (filter) {
				eFileSumaryListService.filterStatusPassed = filter;
				$location.path("/eFile/list");
			};

			// cancel interval
			var cancelInterval = function () {
				$interval.cancel(refreshTimer);
			};

			// Listen destoryHomeTimer event
			var destroyTimer = $rootScope.$on('destoryWidgetAutoRefresh', function () {
				cancelInterval();
			});

			var manualRefreshListToDosInfoCalled = $rootScope.$on('manualRefreshListToDosInfoCalled', function () {
				$scope.manualRefreshListeFileSummary(10);
			});
			$scope.$on('$destroy', function () {
				// cancel timer in case if is not cancel before.
				cancelInterval();
				// On destroy cancel listening of destroy timers
				destroyTimer();
				manualRefreshListToDosInfoCalled();
			});


			////Watch for rejected returns counter and then broadcast it
			////Note: This will be listen at toDos widget to avoid api call
			//$scope.$watch('eFileSummaryList.rejected', function (newVal, oldVal){
			//    $rootScope.$broadcast('rejectedReturnsCounter', newVal);            	     
			//});


			/*Firstime loading of list*/
			/*Firstime loading of list and register auto refresh*/
			//Delayed for 20 milisecond to avoid issue in slow pc where application reads old key from storage when multiple apis are getting fire on same time
			$scope.manualRefreshListeFileSummary(10);
		}]
	};
}]);