'use strict';

//define module
var printPacketsConfigurationApp = angular.module('printPacketsConfigurationApp', []);

//printPacketsConfiguration  Controller
// printPacketsConfigurationApp.controller('printPacketsConfigurationController', [function () {
// }]);

// printPacketsConfiguration  Directive
printPacketsConfigurationApp.directive('printPacketsConfigurations', [function () {
    return {
        restrict: 'AE',
        templateUrl: '/taxAppJs/manage/printPacketsConfiguration/partials/printPacketsConfiguration.html',
        controller: [function () {
        }]
    }
}]);
