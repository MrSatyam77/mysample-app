"use strict";
var appointmentListWidget = angular.module('appointmentListWidget', []);

/* Services from here */
appointmentListWidget.factory('appointmentListService', ['$q', '$log', '$http', 'dataAPI', 'appointmentService', function ($q, $log, $http, dataAPI, appointmentService) {
    var appointmentListService = {};
    appointmentListService.getAppointmentList = function (object) {
        var deferred = $q.defer();
        //Re initialize snoozer for appointments
        appointmentService.initSnoozer();

        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/calendar/listByDate',
            data: {
                data: object
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    return appointmentListService;
}]);

/*Directives from here*/
appointmentListWidget.directive('appointmentList', [function () {
    return {
        restrict: 'AE',
        templateUrl: 'taxAppJs/common/widgets/appointmentList/partials/appointmentList-template.html',
        scope: {},
        controller: ['$log', '$scope', '$interval', '$location', '$timeout', '$filter', '$rootScope', 'appointmentListService', 'userService', 'basketService', 'networkHealthService', function ($log, $scope, $interval, $location, $timeout, $filter, $rootScope, appointmentListService, userService, basketService, networkHealthService) {
            $scope.appointmentList = {};
            $scope.appointmentList.appointment = [];
            $scope.appointmentList.tomorrowsAppointment = 0;
            var refreshTimer;
            //Check for privileges
            $scope.userCan = function (privilege) {
                return userService.can(privilege);
            };

            //to convert date in current format 
            $scope.toDate = function (dateStr) {
                return new Date(dateStr);
            };

            /*Register $interval for background update of list, third argument is for infinite and last is to prevent to execute on every dirty checking*/
            var refreshList = function () {
                refreshTimer = $interval(function () {
                    var currentDateEnd = new Date();
                    currentDateEnd.setHours(23);
                    currentDateEnd.setMinutes(59);
                    currentDateEnd = moment.utc(currentDateEnd).format();
                    var obj = { currentDate: moment.utc(new Date()).format(), currentDateEnd: currentDateEnd };

                    appointmentListService.getAppointmentList(obj).then(function (response) {
                        $scope.appointmentList = response;
                    }, function (error) {
                        $log.log(error);
                        //If we receive token incorrect or unauthorized , do not continue this api until next initialization
                        if (angular.isDefined(error) && angular.isDefined(error.data) && angular.isDefined(error.data.code) && (error.data.code == 4004 || error.data.code == 4005)) {
                            cancelInterval();
                        }
                    });
                }, 60600, 0, false);
            };
            //Real API call
            //Note: We have made this common to avoid duplication of code. As we have to call this api either from timeout or without timeout
            var callListAPI = function () {
                var currentDateEnd = new Date();
                currentDateEnd.setHours(23);
                currentDateEnd.setMinutes(59);

                currentDateEnd = moment.utc(currentDateEnd).format();

                var obj = { currentDate: moment.utc(new Date()).format(), currentDateEnd: currentDateEnd };

                appointmentListService.getAppointmentList(obj).then(function (response) {
                    $scope.appointmentList = response;
                    $scope.refreshStart = false;
                    /*Re register background refresh of list if not*/
                    if (angular.isUndefined(refreshTimer)) {
                        refreshList();
                    }
                }, function (error) {
                    $scope.refreshStart = false;
                    /*Re register background refresh of list if not*/
                    if (angular.isUndefined(refreshTimer)) {
                        refreshList();
                    }
                    $log.log(error);
                });
            };
            $scope.manualRefreshList = function (delay) {
                if ($scope.userCan('CAN_LIST_CALENDAR')) {
                    /*Cancel iterate of auto refresh if already registered*/
                    if (angular.isDefined(refreshTimer)) {
                        cancelInterval();
                        refreshTimer = undefined;
                    }//Check if delay is passed
                    if (angular.isDefined(delay) && delay != null && delay != '') {
                        $timeout(function () {
                            //Call API function
                            callListAPI();
                        }, delay);
                    } else {
                        //Call API function
                        callListAPI();
                    }
                }
            };

            // open appointment scheduler
            $scope.openCalender = function () {
                $location.path('/calendar');
            };

            // open calendar in day mode. Selected date will be tomorrow. 
            $scope.viewTomorrow = function () {
                basketService.pushItem("calDateMode", "tomorrow");
                $location.path("/calendar");
            };

            // We need to set this because of setting start-end date in date picker
            $scope.newAppointment = function () {
                $location.path('/calendar/appointment/edit');
            };

            //on edit 
            $scope.edit = function (id) {
                $location.path("/calendar/appointment/edit/" + id);
            };

            // cancel interval
            var cancelInterval = function () {
                $interval.cancel(refreshTimer);
            };

            // Listen destoryHomeTimer event
            var destroyTimer = $rootScope.$on('destoryWidgetAutoRefresh', function () {
                cancelInterval();
            });

            //Initialize network status flag and subscribe channel to get update 
            $scope.isOnline = networkHealthService.getNetworkStatus();
            var _networkStatusSubscription = postal.subscribe({
                channel: 'MTPO-UI',
                topic: 'networkStatus',
                callback: function (data, envelope) {
                    $scope.isOnline = data.isOnline;
                }
            });

            $scope.$on('$destroy', function () {
                //unsubscribe network status subscription to prevent memory leak
                _networkStatusSubscription.unsubscribe();
                // cancel timer in case if is not cancel before.
                cancelInterval();
                // On destroy cancel listening of destroy timers
                destroyTimer();
            });

            /*Firstime loading of list */
            //Delayed for 75 milisecond to avoid issue in slow pc where application reads old key from storage when multiple apis are getting fire on same time
            $scope.manualRefreshList(70);
        }]
    };
}]);