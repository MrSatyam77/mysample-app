"use strict";

var tryItNowApp = angular.module('tryItNowApp',[]);

tryItNowApp.controller('tryItNowController',['$scope','$location','$log','$timeout','authService','messageService','localeService','dialogService','mediaService',
                                       function($scope,$location,$log,$timeout,authService,messageService,localeService,dialogService,mediaService){
	// Used to show preparing text. WE show text on start of demo session.
	$scope.isPreparingDemoUser = false;
	
	//Dialog configurations.
	var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'md','windowClass': 'my-class'};
	
	var _init = function() {
		// Check whether there is active session. IF there is active session then show confirmation dialog.
		// We have to use timeout here to wait till response of session call comes. Other wise these functionallity won't work.
		$timeout(function(){
			if(authService.getIsAuthenticated() == true){
				// Ask to save return			
				 localeService.translate('You are already logged in with another user on this system. Do you want to continue with that user instead of demo account?','TRYITNOW_RESTORESESSION').then(function(translatedText){
			     	var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translatedText});
			 		dialog.result.then(function(btn){
			 			$location.path('/home');
			 		},function(btn){
			 			// We logout respected user. IF user ignore active session
			 			authService.logout().then(function(){
				 			// On close we start demo session
				 			 _prepareDemoUser(); 			
			 			},function(error){
			 				$log.error(error);
			 			});
			 			
			 		});
				 });
			}else{
				_prepareDemoUser();
			}
		},1000);
	};
	
	//prepare demo user
	var _prepareDemoUser = function() {
		//For Media API
	    mediaService.callView('tryitnow','','','');
	    
		$scope.isPreparingDemoUser = true;
		// ELSE call tryitnow API. On Success we redirect user to home.
		authService.createDemoUser().then(function (success){
			$scope.isPreparingDemoUser = false;
			var data = success;
			var dialog = dialogService.openDialog("custom",dialogConfiguration,"taxAppJs/auth/tryItNow/partials/accountInformation.html","demoAccountInfoDialogController",data);
			dialog.result.then(function(){
				authService.recreateLogin(success);
				$location.path('/home');
			},function(btn){
				authService.recreateLogin(success);
				$location.path('/home');
			});
		},function(error){
            $log.error(error);
            $scope.isPreparingDemoUser = false;
            dialogService.openDialog("custom",dialogConfiguration,"taxAppJs/auth/tryItNow/partials/error.html","errorDialogController");
		});
	};
	
	
	// --- initialization start
	_init();
	
	
}]);

//Demo account information dialog controller
tryItNowApp.controller('demoAccountInfoDialogController', ['$scope','$modalInstance','$log','$location','data','authService', 'messageService', function ($scope, $modalInstance, $log, $location, data, authService, messageService) {
	//We store email id and password.
	$scope.accountInfo = {};
	$scope.accountInfo.userName = data.email;  
	$scope.accountInfo.password = data.password;
    $scope.isEmailAccountInfo = false; //flag decides whether emailaccountinfo button is clicked or not
    /*
	 *  On continue session we redirect user to home
	 */
	$scope.continueSession = function () {		
        $modalInstance.close();
    };
    
    //send account info to provided email address
    $scope.emailAccountInformation = function(){
    	authService.sendDemoAccountInfo($scope.email, $scope.accountInfo).then(function (success){
    		messageService.showMessage('Account information sent successfully','success','DEMOUSER_MAILSUCCESS');
    		$modalInstance.close();
    	}, function(error){
    		$modalInstance.close();
    	});
    };
    
    /*
	 *  Cancel 
	 */	
	$scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };	
}]);

//error dialog controller
tryItNowApp.controller('errorDialogController', ['$scope','$modalInstance','$log','$location',function ($scope, $modalInstance, $log, $location) {
    
    /*
	 *  Register with us
	 */
	$scope.registerWithUs = function () {		
        $modalInstance.close();
        $location.path('/registration');
    };
}]);