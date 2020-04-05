"use strict";
var commonDirective = angular.module('commonDirective', []);
/**
* this directive is useful when we require to  check input match 
* for example 
* Password: <input ng-model="user.password" type="password" name="password" />
* Confirm: <input ng-model="user.passwordConfirm" type="password" data-match="user.password" name="confirmPassword" />
*
*/
commonDirective.directive('iMatch', function () {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
        	iMatch: '='
        },
        link: function(scope, elem, attrs, ctrl) {
            scope.$watch(function() {
                var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                return ctrl.$pristine && angular.isUndefined(modelValue) || scope.iMatch === modelValue ;
            }, function(currentValue) {
                ctrl.$setValidity('iMatch', currentValue);
            });
        }
    };
});

/** 
 *this directive work for capital first letter of every word 
 */
commonDirective.directive('taxCapitalize', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                //if input value is undefine make it blank
                if (inputValue == undefined) inputValue = '';
                //make every first letter of word capital and assign to variable 
                var capitalized = inputValue.replace(/[^\s]+/g, function (str) {
                    return str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();
                });
                //check is capitalized value and input value both are same if yes then nothing to do else just replace with new value 
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]);  
        }
    };
});

// directive to filter zipcode
// Important note :- We expect ng-model as data-ng-model(to support html 5).So please pass data-ng-model instead of ng-model. Otherwise this directive will not work.
// Issue :- Currently this directive only support for upto 3 level of object ng-model. We need to make it dynamic.
//	example:- scope.city || scope.obj.city || scope.obj.obj.city 
commonDirective.directive('cmnZipLookup',['$filter','$rootScope',function($filter,$rootScope){
	return{
		restrict:'A',
		scope:{
			city:"=cmnZipLookupCity",
			state:"=cmnZipLookupState"
		},
		link: function (scope, element, attrs) {			
			//Bind focus lost for element (zip entry)			
			angular.element(element).bind('blur', function(event) {
				//Get City and State from entered zipcode
				var result = $filter('zipCode')(angular.element(element).val());
				if(!_.isUndefined(result) || !_.isEmpty(result)){
					
					// IF model is found for city, then proceed further
					if(!_.isUndefined(scope.city) && !_.isEmpty(scope.city)){
						// split model to bind with scope value
						var temp = scope.city.split(".");
						if(!_.isUndefined(temp[0]) && !_.isEmpty(temp[0]) && !_.isUndefined(temp[1]) && !_.isEmpty(temp[1])){
							if((!_.isUndefined(temp[1]) && !_.isEmpty(temp[1]))){
								//Check whether ng-model is of 3rd level of object
								if(!_.isUndefined(temp[2]) && !_.isEmpty(temp[2])){
									// set city on bases of given zipcode
									scope.$parent[temp[0].toString()][temp[1].toString()][temp[2].toString()] = result.city;
								}else{
									// set city on bases of given zipcode
									scope.$parent[temp[0].toString()][temp[1].toString()] = result.city;
								}
							}else{
								scope.$parent[temp[0].toString()] = result.city;
							}
						}
					}
					
					// IF model is found for state, then proceed further
					if(!_.isUndefined(scope.state) && !_.isEmpty(scope.state)){
						// split model to bind with scope value
						var temp = scope.state.split(".");
						if(!_.isUndefined(temp[0]) && !_.isEmpty(temp[0])){
							if((!_.isUndefined(temp[1]) && !_.isEmpty(temp[1]))){
								//Check whether ng-model is of 3rd level of object
								if(!_.isUndefined(temp[2]) && !_.isEmpty(temp[2])){
									// set city on bases of given zipcode
									scope.$parent[temp[0].toString()][temp[1].toString()][temp[2].toString()] = result.state;
								}else{
									// set city on bases of given zipcode
									scope.$parent[temp[0].toString()][temp[1].toString()] = result.state;
								}
							}else{
								scope.$parent[temp[0].toString()] = result.state;
							}
						}											
					}
					
					//Apply root scope.
					//Note :- IF we remove this then model value will not get updated on screen.
					$rootScope.$evalAsync(function () {});
				}				
			});
		}	
	};
}]);

commonDirective.directive('taxpattern', function() {
	  return {
	    require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            //taxpatternIgnoreCase is true  then ignore case on pattern match
            var taxpatternIgnoreCase = attrs.taxpatternIgnorecase;
            //taxpatternReverse is true then (pattern matches= valid) else (pattern matches= invalid)
            var taxpatternReverse= attrs.taxpatternReverse;
           
          if(Boolean(taxpatternIgnoreCase) == true)
                var TAX_REGEXP = new RegExp(attrs.taxpattern); // get pattern  
          else 
                var TAX_REGEXP = new RegExp(attrs.taxpattern, "i");//( "i"  for ignore case )
	      //Override $parsers.unshift function 
	      ctrl.$parsers.unshift(function(value) {
                if (value != undefined && value != '') {
                    if (Boolean(taxpatternReverse) == true) {
                        // IF pattern matches with view value then it is valid
                        if (TAX_REGEXP.test(value)) {
                            ctrl.$setValidity('taxpattern', true);
                        } else {
                            // IF pattern not matches with view value then it is invalid
                            ctrl.$setValidity('taxpattern', false);
                        }
                    }
                    else {
                        // IF pattern matches with view value then it is invalid
                        if (TAX_REGEXP.test(value)) {
                            ctrl.$setValidity('taxpattern', false);
                        } else {
                            // IF pattern not matches with view value then it is valid
                            ctrl.$setValidity('taxpattern', true);
                        }
                    }       			        
		        }else{
		        	// IF Empty then remove error ( as directive's purpose for only pattern match not checking required.)
		        	// To check required you need to use ng-required directive
		        	 ctrl.$setValidity('taxpattern', true);
		        }
		        return value;
	      });
	    }
	  };
});

//START: Idle Directive
//angular.module('taxIdleModule',[]);

// /**
//  *
//  */
// angular.module('taxIdleModule').provider('taxIdleConfig',function(){
// 	//
// 	var taxIdleConfig = {
// 		idleTime:15,
// 		warningTime:2
// 	};

// 	//	
// 	return({
// 		setIdleTime:setIdleTime,
// 		setWarningTime:setWarningTime,		
// 		$get:initTaxIdle
// 	});

// 	//Local functions
// 	//
// 	function initTaxIdle(){
// 		return {
// 			getConfig:getConfig
// 		};
// 	}

// 	//
// 	function setIdleTime(minutes){
// 		taxIdleConfig.idleTime = minutes;
// 	}

// 	//
// 	function setWarningTime(minutes){
// 		taxIdleConfig.warningTime = minutes;
// 	}

// 	//
// 	function getConfig(){
// 		return angular.copy(taxIdleConfig);
// 	}
// });

// /**
//  *
//  */
// angular.module('taxIdleModule').directive('taxIdle', [function(){
// 	return{
// 		restrict:'E',
// 		scope:{},		
// 		controller:['$scope','$document','$timeout','$rootScope','$location','$http','taxIdleConfig','dialogService','localStorageUtilityService','dataAPI',
// 					function($scope,$document,$timeout,$rootScope,$location,$http,taxIdleConfig,dialogService,localStorageUtilityService,dataAPI){
// 			//configuration
// 			var config = taxIdleConfig.getConfig();
// 			var isIdleTimerRinged = false;
// 			var idleTimeout;
// 			var warningTimeout;

// 			function init(){
// 				//Bind events
// 				$document.bind('mousemove', eventHandler);						
// 				$document.bind('mousewheel', eventHandler);
// 				$document.bind('mousedown', eventHandler);
// 				$document.bind('keydown', eventHandler);
// 				$document.bind('touchstart', eventHandler);
// 				$document.bind('touchmove', eventHandler);
// 				$document.bind('scroll', eventHandler);

// 				//start timeout
// 				registerIdleTimeout();
// 			}

// 			//This function will be handler for all events
// 			function eventHandler(event){
// 				if(isIdleTimerRinged === false){
// 					//de-register timeout
// 					deRegisterIdleTimeout();
// 					//register timeout again
// 					registerIdleTimeout();
// 				}
// 			}

// 			//This function will be called when last two minutes are remaining
// 			function idleTimeoutCallback(){
// 				//
// 				isIdleTimerRinged = true;

// 				$scope.test='Timeout';
// 				//Open dialog from here
// 				var dialog = dialogService.openDialog("custom", {'keyboard':false,'backdrop':false,'size':'md','windowClass': 'my-class'},"taxAppJs/common/partials/timeOutWarningDialog.html", "timeOutWarningDialogController",{warningTime:(config.warningTime*60)});
// 		        dialog.result.then(function(btnClicked){
// 		        	if(btnClicked!=undefined && btnClicked!=''){
// 		        		//
// 		        		switch(btnClicked.toLowerCase()){
// 		        			case 'continue':		        				
// 			        			//make timer ringed false
// 								isIdleTimerRinged = false;
// 								//de-register timeout
// 								deRegisterIdleTimeout();
// 								//register timeout again
// 								registerIdleTimeout();
// 								//Call keep alive api
// 								$http({
// 					                method: 'GET',
// 					                url: dataAPI.base_url + '/auth/keepAlive',
// 					            });
// 								break;
// 							case 'signout':
// 								//Add loginOption to local storage
// 								localStorageUtilityService.addToLocalStorage('loginOption','autosignout');
// 								//publish message for forced sign out
// 								postal.publish({
// 		                          channel:'MTPO-Return',
// 		                          topic:'forcedSignOut'
// 		                		});
// 								//Logout user
// 								$rootScope.$evalAsync(function () {	                                
// 	                                $location.path('/logout');	                                
//                             	});
// 		        		}		        		
// 		        	}
// 		        });
// 			}

// 			//Register timeout for idleTime
// 			function registerIdleTimeout(){
// 				//If last timeout is still runing first cancel it
// 				if(idleTimeout != undefined){
// 					deRegisterIdleTimeout();
// 				}
// 				//register timeout
// 				idleTimeout = $timeout(function(){
// 					//Once time out reached					
// 					idleTimeoutCallback();
// 				},(config.idleTime-config.warningTime)*(60*1000));
// 			}

// 			//de-register idle timeout
// 			function deRegisterIdleTimeout(){
// 				if(idleTimeout != undefined){
// 					$timeout.cancel(idleTimeout);
// 					idleTimeout = undefined;
// 				}
// 			}

// 			//Init directive
// 			init();

// 			//listen for destroy event to safely de-register various events/watchers, etc...
//             $scope.$on('$destroy', function(){            	
//                 //un-bind events
//                 $document.unbind('mousemove');						
// 				$document.unbind('mousewheel');
// 				$document.unbind('mousedown');
// 				$document.unbind('keydown');
// 				$document.unbind('touchstart');
// 				$document.unbind('touchmove');
// 				$document.unbind('scroll');
// 				//de-register timeout
//                 deRegisterIdleTimeout();
//             });
// 		}]
// 	}
// }]);
// //END: Idle Directive

// /**
//  *This Provider is used to do Configuration for taxSession24 hour logout
//  */
// angular.module('taxIdleModule').provider('taxSession24Config',function(){
// 	//configure object
// 	var taxSession24Config = {
// 		intervalTime:1,
// 		warningTime:30
// 	};

// 	//	
// 	return({
// 		seIintervalTime:seIintervalTime,
// 		setWarningTime:setWarningTime,		
// 		$get:initAutoLogout
// 	});

// 	//Local functions
	
// 	function initAutoLogout(){
// 		return {
// 			getConfig:getConfig
// 		};
// 	}

// 	//set interval time
// 	function seIintervalTime(minutes){
// 		taxSession24Config.intervalTime = minutes;
// 	}

// 	//set warning time
// 	function setWarningTime(minutes){
// 		taxSession24Config.warningTime = minutes;
// 	}

// 	//return configure object
// 	function getConfig(){
// 		return angular.copy(taxSession24Config);
// 	}
// });

// /**
//  *Directive for taxSession24 hour  logout
//  */
// angular.module('taxIdleModule').directive('taxSession24', [function(){
// 	return{
// 		restrict:'E',
// 		scope:{},		
// 		controller:['$scope','$interval','$timeout','$location','taxSession24Config','dialogService','userService','$rootScope','localStorageUtilityService',function($scope,$interval,$timeout,$location,taxSession24Config,dialogService,userService,$rootScope,localStorageUtilityService){
// 			//configuration
// 			var config = taxSession24Config.getConfig();
// 			var interval;
// 			//get user details
// 			var userDetails = userService.getUserDetails();

// 			function init(){
// 				//start timeout
// 				registerInterval();
// 			}

// 			//This function will be called when last 30 minutes are remaining for auto logout
// 			function openWarningDialog(remainingTime){
// 				//de-register interval
// 				deRegisterInterval();
// 				//Open dialog from here
// 				var dialog = dialogService.openDialog("custom", {'keyboard':false,'backdrop':false,'size':'md','windowClass': 'my-class'},"taxAppJs/common/partials/taxSession24HoursWarningDialog.html", "taxSession24HoursWarningDialogController",{warningTime:remainingTime});
// 				dialog.result.then(function(btn){
// 					if(btn == 'logout'){
// 						logout();	
// 					}
// 				});
// 			}

// 			//Register interval for taxSession24
// 			function registerInterval(){				
// 				//register interval
// 				interval = $interval(function(){
// 					taxSessionIntervalCallback();					
// 				},(config.intervalTime*(60*1000)));//one minute interval time

// 				//First time call
// 				$timeout(taxSessionIntervalCallback,5000);				
// 			}

// 			//Execute this function in interval to check if session expired (24 hours) or not
// 			function taxSessionIntervalCallback(){
// 				//check is userDetails and lastLoggedInDate is defined
// 				if(angular.isDefined(userDetails) && angular.isDefined(userDetails.lastLoggedInDate)){
// 					var oldDate = moment(userDetails.lastLoggedInDate);//now
// 					//get current date
// 					var currentDate = moment();
// 				    //get deffirence in minutes
// 					var minutes = currentDate.diff(oldDate, 'minutes'); 
// 					//check is total diffrence is greater then 24 hours then perform logout directly
// 					if(minutes >= 1440) {
// 						logout();
// 					}
// 					//if minutes(total minutes) in between  23 hours and 30 minutes and 24 hours then open dialog and subscribe message to diaplay time in header nav 
// 					else if(minutes >= 1410 && minutes < 1440){
// 						//method to open dialog
// 						openWarningDialog(1440 - minutes);
// 						//publish postal message for start timer in headerNav
// 						postal.publish({
// 		                          channel:'MTPO-Return',
// 		                          topic:'SetTimerForAutoLogout',
// 		                          data:{warningTime:((1440 - minutes)*(60*1000))}
// 		                });  
// 					}
// 				}
// 			}

// 			//de-register interval
// 			function deRegisterInterval(){
// 				if(interval != undefined){
// 					$interval.cancel(interval);
// 					interval = undefined;
// 				}
// 			}

// 			function logout(){
// 				//Add loginOption to local storage
// 				localStorageUtilityService.addToLocalStorage('loginOption','taxsession24hourlogout');
// 				//publish message for forced sign out
// 				postal.publish({
// 					channel:'MTPO-Return',
// 					topic:'forcedSignOut'
// 				});
// 				//Logout user	
// 				$rootScope.$evalAsync(function () {	                                
//                 	$location.path('/logout');	                                
//             	});
// 			}
			
// 			//subscription of autologout for set timer
// 		    var _logoutSubscription = postal.subscribe({
// 		            channel:'MTPO-Return',
// 		            topic:'LogoutFromTaxSession24',
// 		            callback:function(data,envelope){  
// 		              	logout();
// 		            }
// 		    });

// 			//Init directive
// 			init();

// 			//listen for destroy event to safely de-register various events/watchers, etc...
//             $scope.$on('$destroy', function(){            	
// 				//de-register interval
//                 deRegisterInterval();
//                 if(_logoutSubscription!=undefined){
//                 	_logoutSubscription.unsubscribe();
//                 }
//             });
// 		}]
// 	}
// }]);
// //END: taxSession24

// /**
// *This directive is used to show timer in a headerNav
// **/
// angular.module('taxIdleModule').directive('taxSession24WarningTimer',[function(){
// 	return{
// 		restrict:'E',
// 		template:' <div class="float-left margin_top_10 font_size_20 font_bold" data-ng-if="warningTime != undefined"><i class="glyphicon glyphicon-time"></i> <span class="margin_left_2">{{warningTime | getTimeInMinutesAndSeconds }} </span></div>',
// 		controller:['$scope','$interval','basketService',function($scope,$interval,basketService){
// 		    //subscription to  set timer in a headerNav
// 		    var _startTimerSubscription = postal.subscribe({
// 		            channel:'MTPO-Return',
// 		            topic:'SetTimerForAutoLogout',
// 		            callback:function(data,envelope){  
// 		                startTimer(data.warningTime);
// 		            }
// 		    });

// 		    //Hold interval
// 		    var autoLogoutInterval;
// 		    //This function is used to start timer for auto logout
// 		    var startTimer = function(warningTime){
// 		        $scope.warningTime = warningTime;
// 		        autoLogoutInterval = $interval(function(){
// 		                 $scope.warningTime = $scope.warningTime - 1000;
// 		                 if($scope.warningTime == 0){
// 		                   //publish postal message for logout 
// 		                    postal.publish({
// 		                              channel:'MTPO-Return',
// 		                              topic:'LogoutFromTaxSession24',
// 		                              data:{}
// 		                    });  
// 		                 }
// 		         },1000);    
// 		    }

// 		    //if warning time is available then get form basketService
// 		    var warningTime = basketService.popItem('taxSession24RemainingTime');
// 		    if(warningTime != undefined && warningTime != '' ){
// 		        startTimer(warningTime);
// 		    }    

//     		//START : Tax Session 24 hours logout Code
// 			$scope.$on('$destroy',function(){
// 				//store autologout timer timeout in basketService
// 		        if($scope.warningTime != undefined && $scope.warningTime !=''){
// 		            basketService.pushItem('taxSession24RemainingTime',$scope.warningTime);
// 		            $scope.warningTime = undefined;
// 		        }
// 		        //cancel autoLogoutInterval
// 		        if(autoLogoutInterval !=undefined){
// 		            $interval.cancel(autoLogoutInterval);
// 		            autoLogoutInterval=undefined;
// 		        }
// 		        //unsubscribe start timer subscription
// 		        if(_startTimerSubscription != undefined){
// 		            _startTimerSubscription.unsubscribe();
// 		        }
// 			});	
// 		}]
// 	};
// }]);


