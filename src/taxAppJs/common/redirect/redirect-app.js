"use strict";
var redirectApp = angular.module('redirectApp',[]);

// Controller 
redirectApp.controller('redirectController',['$location','$routeParams',function($location,$routeParams){
	
	//This condition will check whether routeParam exists or not 
	if($routeParams.url)
	{
		//This will store route parameter
		var _url = $routeParams.url;
		
		//This will redirect to URL passed as route parameter and it will replace '_' with '/'
		$location.path(_url.replace(/_/g,'/'));
		
		//Just to check routeParam
		//console.log(_url);
	}
	else
	{
		$location.path('/home');
	}
}]);
