var templatesApp = angular.module('templatesApp', []);

templatesApp.controller('templatesController', ['$scope', '$routeParams', '$location', 'userService', 'environment',
    function ($scope, $routeParams, $location, userService, environment) {
        $scope.openTab = {};

        if ($routeParams.key) {
            $scope.openTab[$routeParams.key] = true;
        } else {
            $scope.openTab.printPackets = true;
        }
        $scope.backToHomeScreen = function () {
            $location.path('/home');

        }
        $scope.changeTab = function (tabName) {
            //change for 2019 allowed feature
            if (userService.getTaxYear() == '2019' && environment.mode == 'live' && (tabName == 'clientLetter' || tabName == 'customerReturnTemplates')) {
                $location.path('/alert/allowedFeature');
            } else {
                $scope.openTab[tabName] = true;
            }
        }
    }
])