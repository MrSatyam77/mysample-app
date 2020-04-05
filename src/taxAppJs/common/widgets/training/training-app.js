"use strict";
var trainingWidget = angular.module("trainingWidget",[]);

//Service 
trainingWidget.factory('trainingService',['$q','$log','$http','$templateCache','$cacheFactory','dataAPI','mediaService',function($q,$log,$http,$templateCache,$cacheFactory,dataAPI,mediaService){
    var trainingService = {};
    var trainingData = [];
    /* api call for getiing training information*/
    trainingService.getTrainingData = function (moduleName, mode, currentForm , field, isManuallyRefresh,conversionSofwareName) {
    	//here we are just check its manually refresh call remove method just remove that url from cache;
        if (isManuallyRefresh==true) {
            var URL = encodeURI(dataAPI.base_url + '/training/get?currentForm=' + currentForm + '&field=' + field + '&mode=' + mode + '&module=' + moduleName + "&conversionType="+ (moduleName =='conversion') ? conversionSofwareName:undefined);
            $templateCache.remove(URL);
        }
        var deferred = $q.defer();
        //load list from data api
        if(!_.isUndefined(moduleName) && !_.isUndefined(mode)){
            $http({
                method: 'GET',
                url: dataAPI.base_url + '/training/get',
                cache: $templateCache,
                params : {
                        'module' : moduleName,
                        'mode': mode,
                        'currentForm': currentForm ,
                        'field': field,
                        "conversionType":moduleName =='conversion' ? conversionSofwareName:undefined
                }
            }).then(function (response) {
                deferred.resolve(response.data.data);
            }, function (error) {
                $log.error(error);
                deferred.reject(error);
            });
            
            //Call to tracking API
            if(field=='' && isManuallyRefresh!=true){        	
                mediaService.callView(moduleName,mode,currentForm);
            }      

    	}
        
        return deferred.promise;
    };
	return trainingService;
}]);

//Directive
trainingWidget.directive('trainingWidget',[function(){
	return{
		restrict:'AE',
		templateUrl: 'taxAppJs/common/widgets/training/partials/training-template.html',
        controller: ['$scope', '$location', '$routeParams', '$log', '$timeout', 'trainingService','environment','$rootScope',function ($scope, $location, $routeParams, $log, $timeout, trainingService,environment,$rootScope) {           
            //to hold all list which we have to show
            $scope.trainingDataList = [];
            //to hold current form name
            var currentForm = {};
            //to hold current field name required for refresh call 
            var currentField = '';
            //to store split path
            var curSplitPath = [];
            //store softwarename for conversion
            var softwareNameForConversion;
            //get current location path
            var curPath = $location.path();
            var routeParameterArray = _.values($routeParams);
            if (routeParameterArray.length > 0) {
                curPath = curPath.substring(0, curPath.lastIndexOf("/" + routeParameterArray[0]));
            }
            //if mode is edit then only we have to listen broadcast form loaded event 
            if (curPath === '/return/edit') {
                //here we are listining brodcast event in new form load 
                var formLoadedWithForm=$scope.$on('formLoadedWithForm', function ($event, form) {
                    currentForm = form.formName;
                    //api call to getting training info base on module,mode and form name
                    trainingService.getTrainingData("return", "edit", currentForm, "",false).then(function (success) {
                        $scope.trainingDataList = success;
                    }, function (error) {
                        $log.error(error);
                    });
                });

                //to store timeout id for cancel req which are not executed
                var getTrainingDataPromise = {};
                //listining broadcast request on every field focus
                var fieldFocusListener = $scope.$on('fieldFocus', function ($event, elementId) {
                    currentField = elementId;
                    //here first we are cancel request which are panding 
                    $timeout.cancel(getTrainingDataPromise); 
                    //timeout fun occured after 2 sec
                    getTrainingDataPromise=$timeout(function () {
                        trainingService.getTrainingData("return", "edit", currentForm, elementId,false).then(function (success) {
                            $scope.trainingDataList = success;
                        }, function (error) {
                            $log.error(error);
                        })
                    }, 2000);
                });
            }else if(curPath === '/conversion/new'){
                 //here we are listining brodcast event in new form load 
                 var ConversionscreenLoadedWithSofwareName = $scope.$on('ConversionSoftwareName', function ($event, softwareName) {
                    if (softwareName.value != undefined) {
                        softwareNameForConversion = softwareName.name;
                    }
                    //api call to getting training info base on module,mode and form name
                    trainingService.getTrainingData("conversion", "new", "", "", false, softwareNameForConversion).then(function (success) {
                        $scope.trainingDataList = success;
                    }, function (error) {
                        $log.error(error);
                    });

                });
                if (_.isEmpty(ConversionscreenLoadedWithSofwareName)) {
                    trainingService.getTrainingData("conversion", "new", "", "", false, $rootScope.selectedSofwareName ? $rootScope.selectedSofwareName.name : undefined).then(function (success) {
                        $scope.trainingDataList = success;
                    }, function (error) {
                        $log.error(error);
                    });
                }
            }
            //here we are just passing module name and mode 
            else {
                curSplitPath = curPath.split('/');
                var moduleName = curSplitPath[curSplitPath.length - 2];
                var mode = curSplitPath[curSplitPath.length - 1];
                //If there is no module, make mode as module and mode blank
                if (moduleName == '' && mode != '') {
                    moduleName = mode;
                    mode = '';
                }
                trainingService.getTrainingData(moduleName, mode, "", "", false).then(function (success) {
                    $scope.trainingDataList = success;
                }, function (error) {
                    $log.error(error);
                });
            }
            
            //manually refresh when user click on refresh button get fresh data
            $scope.manuallyRefreshTraining = function () {
                if (curPath === '/return/edit') {
                    trainingService.getTrainingData("return", "edit", currentForm, currentField, true).then(function (success) {
                        $scope.firstRefreshStart = false;
                        $scope.trainingDataList = success;
                    }, function (error) {
                        $scope.firstRefreshStart = false;
                        $log.error(error);
                    })
                }else if(curPath === '/conversion/new'){
                    trainingService.getTrainingData("conversion", "new", "", "", true,$rootScope.selectedSofwareName.name).then(function (success) {
                        $scope.firstRefreshStart = false;
                        $scope.trainingDataList = success;
                    }, function (error) {
                        $scope.firstRefreshStart = false;
                        $log.error(error);
                    })
                }
                else {
                    var moduleName = curSplitPath[curSplitPath.length - 2];
                    var mode = curSplitPath[curSplitPath.length - 1];
                    //If there is no module, make mode as module and mode blank
                    if (moduleName == '' && mode != '') {
                        moduleName = mode;
                        mode = '';
                    }
                    trainingService.getTrainingData(moduleName, mode, "", "", true).then(function (success) {
                        $scope.firstRefreshStart = false;
                        $scope.trainingDataList = success;
                    }, function (error) {
                        $scope.firstRefreshStart = false;
                        $log.error(error);
                    });
                }
            };

            $scope.betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local') {
                    return true;
                } else {
                    return false;
                }
            };
    
            //Cleanup on destroy
            $scope.$on('$destroy',function(){
            	if(fieldFocusListener!=undefined)
            		fieldFocusListener();
            	if(fieldFocusListener!=undefined)                
                    formLoadedWithForm();
            });
            
		}]
	};
}]);

