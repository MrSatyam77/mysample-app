// 'use strict';
// var rolesApp = angular.module('rolesApp', []);

// //Role List controller
// rolesApp.controller('rolesListController', ['$scope','$filter','$log','$location','$q','$timeout','NgTableParams','rolesService','messageService','userService','dialogService','localeService',function ($scope, $filter, $log, $location, $q, $timeout, NgTableParams, rolesService, messageService, userService,dialogService,localeService) {
    
//     //Check for privileges
//     $scope.userCan = function (privilege) {
//         return userService.can(privilege);
//     };
//     $scope.backToHomeScreen = function() {
//         $location.path('/home');
        
//         }
//     //initialize  role  list
//     var _initAvailablerole = function () {
        
//         var deferred = $q.defer();
//         rolesService.getAvailableRoles().then(function (response) {
//             $scope.availableRoles = response;
            
//             deferred.resolve();
//         }, function (error) {
            
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
//     var gridFilterOrderedData = [];//hold grid data with order and filter
//     // For Grid - Start. First object is configuration and second is for data
//     // and other operations from data
//     $scope.availableRolesList = new NgTableParams({
//         page : 1, // show initial page
//         count: 10,// count per page
//         sorting : {
//             // initial sorting
//             name : 'asc'
//         }
//     }, {
//         total : 0, // length of data
//         sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
//         getData : function ($defer, params) {
//             // Request to API
//             // get Data here				
//             if (angular.isUndefined($scope.availableRoles)) {
//                 _initAvailablerole().then(function () {
//                     // Only On successful API response we bind data to grid.			
//                     var filteredData = $scope.availableRoles;
//                     filteredData = $filter('filter')(filteredData, $scope.searchField);		
//                     //Apply standard sorting
//                     var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) :filteredData;
//                     gridFilterOrderedData = orderedData;     
//                     params.total(filteredData.length);
//                     //Return Result to grid
//                     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
//                 }, function (error) {
//                     $log.error(error);
//                 });
//             }
//             else {
//                 // Only On successful API response we bind data to grid.			
//                 var filteredData = $scope.availableRoles;
//                 //filter based on search field $scope.searchField
//                 if (angular.isDefined($scope.searchField) && $scope.searchField != '') {
//                     filteredData = $filter('filter')(filteredData, function (Role, index) {
//                         if (angular.isDefined(Role.name) && Role.name.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
//                             return true;
//                         }
//                         else if (angular.isDefined(Role.description) && Role.description.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
//                             return true;
//                         }
                        
//                     });
//                 }                ;
//                 //Apply standard sorting
//                 var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) :filteredData;
//                 gridFilterOrderedData = orderedData;     
//                 params.total(filteredData.length);
//                 //Return Result to grid
//                 $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
//             }
//         }
//     });
//     //Object holding timeout
//     var filterTimeout = {};
//     //Watch for search field
//     $scope.$watch('searchField', function (newVal, oldVal) {
//         //If Grid data is defined and there is cahnge in old and new value
//         if ($scope.availableRolesList.settings().$scope != null && newVal != oldVal) {
//                 //Cancel old search filter
//                 $timeout.cancel(filterTimeout);
//                 //Register new timeout for filter
//                 filterTimeout = $timeout(function () {
//                     //Reload grid. Which will re-bind data by filtering it
//                     $scope.availableRolesList.reload();
//                     //go to first page.
//                     $scope.availableRolesList.page(1);
//                 }, 300);
//         }
//     });
//     //Redirect to Edit screen when click on New for creating role 
//     $scope.createNewRole = function () {
//         $location.path('/manage/role/edit');
//     };
   
//    // To enable or disable delete button based on check box selected
//     $scope.selectcheckBox = function (key) {
//         $scope.selectedCheckBox = key;
//     };

//     // $scope.isDeleteButttonEnable=false;
//     // $scope.roleSelected = function(){
//     //     $scope.isDeleteButttonEnable = false;
//     //     _.forEach($scope.availableRoles, function (role) {
//     //         if(role.isSelected == true){
//     //             $scope.isDeleteButttonEnable = true;
//     //         }
//     //     });
//     // }
    
//     $scope.clearSearch = function (){
//         $scope.searchField = '';
//     };  
//     //for remove role we have two way multiple or single pass key for single 
//     $scope.removeRoles = function (key) {
//     	var displayText='';
//         var roleToDelete = [];
//         if (angular.isDefined(key)) {
//             roleToDelete.push(key);
//         }
//         else {
//             _.forEach($scope.availableRoles, function (role) {
//                 if (angular.isDefined(role.isSelected) && role.isSelected == true) {
//                     roleToDelete.push(role.key);
//                 }
//             });
//         }
//         if (_.size(roleToDelete) != 0) {
//         	if(_.size(roleToDelete) > 1){
//         		displayText = "These roles may assigned to any user. Please check before deleting them.";
//         	}else{
//         		displayText = "This role may assigned to any user. Please check before deleting it.";
//         	}
//         	//Dialog used for the confirmation from user to Delete or not the selected role.
//         	var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
//         	localeService.translate(displayText,'ROLE_DOYOUDELETEROLE_DIALOG_MESSAGE').then(function(translateText){
// 	        	var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
// 				dialog.result.then(function(btn){
// 					rolesService.removeRoles(roleToDelete).then(function (success) {
//                         messageService.showMessage('Remove successfully', 'success','ROLELISTCONTROLLER_REMOVESUCCESS');
//                        	_initAvailablerole().then(function (response) {
//                             $scope.selectedCheckBox=false;
// 							$scope.availableRolesList.reload();
// 						}, function (error) {	                    
// 							$log.error(error);
// 						});
// 					}, function (error) {	                
// 						$log.error(error);
// 					});
// 				},function(btn){
	
// 				});
//         	});
//         }
//     };
    
//     //for editing we just redirect to edit screen with key of perticular record
//     $scope.editRole = function (key) {
//         $location.path('/manage/role/edit/' + key);
//     };

// }]);

// //* edit controller *//
// rolesApp.controller('rolesEditController', ['$scope','$log','$location','$routeParams','$q','rolesService','messageService','userService','dialogService','localeService',function ($scope, $log, $location, $routeParams, $q, rolesService, messageService, userService, dialogService, localeService) {
    
//     //Check for privileges
//     $scope.userCan = function (privilege) {
//         return userService.can(privilege);
//     };
    
//     //Object holding role information
//     $scope.role = {};
    
//     //List of priviliages of the role
//     $scope.role.privilageList = [];
    
//     $scope.categoryList = [];
    
//     //initialization with available privilages
//     var _init = function () {
//         if (angular.isDefined($routeParams.id)) {
//             $scope.mode = 'update';
//         }
//         else {
//             $scope.mode = 'create';
//         }
//         if ($scope.mode == 'update') {
//             _getRoleForEdit($routeParams.id);
//         }
//         else if ($scope.mode == 'create') {
//             _initAvailablePrivilage().then(function (success) {
//             }, function (error) {
//                 $log.error(error);
//             });
//         }
//     };
    
//     //function to cal api for get available privilages 
//     var _initAvailablePrivilage = function () {
        
//         var deferred = $q.defer();
//         rolesService.getAvailablePrivilage().then(function (success) {
//             $scope.role.privilageList = success;
//             $scope.categoryList = _.uniq(_.pluck($scope.role.privilageList, 'category'));
            
//             deferred.resolve(success);
//         }, function (error) {
            
//             $log.error(error);
//         });
//         return deferred.promise;
//     };
    
//     //get role details for edit base on id 
//     var _getRoleForEdit = function (id) {
        
//         rolesService.getRole(id).then(function (success) {
//             $scope.role = success;
//             var temprole = angular.copy(success);
//             _initAvailablePrivilage().then(function (success) {
//                 $scope.role.privilageList = success;
//                 _.forEach($scope.role.privilageList, function (privileges) {
//                     var currentIndex = _.findIndex(temprole.privileges, function (privilage) {
//                         return privilage.name === privileges.name;
//                     });
//                     if (currentIndex != -1) {
//                         privileges.isSelected = true;
//                     }
//                     else {
//                         privileges.isSelected = false;
//                     }
                    
//                 });
//             }, function (error) {
                
//                 $log.error(error);
//             });
//         }, function (error) {
            
//             $log.error(error);
//         });
//     };
    
//     //save new role or update exsitng role base on mode
//     $scope.saveRole = function () {
//         //For Que
//         var privilageToSave = [];
//         //Prepare list of privilage need to be added
//         _.forEach($scope.role.privilageList, function (privilage) {
//             if (angular.isDefined(privilage.isSelected)) {
//                 if (privilage.isSelected == true) {
//                     privilageToSave.push(privilage.name);
//                 }
//             }
//         });
//         if ($scope.mode == 'update') {
//             rolesService.updateRole($routeParams.id, $scope.role.name, $scope.role.description, privilageToSave).then(function (success) {
//             	userService.syncUserDetailsWithApi().then(function(response){
//             		$location.path('/manage/role/list');
//             	},function(error){
//             		$location.path('/manage/role/list');
//             	});
//                 messageService.showMessage('Updated successfully', 'success', 'ROLEEDITCONTROLLER_UPDATESUCCESS');
//             }, function (error) {
//                 $log.error(error);
//             });
//         }
//         else {
//             rolesService.createRole($scope.role.name, $scope.role.description, privilageToSave).then(function (success) {
//                 messageService.showMessage('Created successfully', 'success', 'ROLEEDITCONTROLLER_CREATESUCCESS');
//                 $location.path('/manage/role/list');
//             }, function (error) {
//                 $log.error(error);
//             });
//         }
        
//     };
    
//     //on click cancel we just redirect to list screen 
//     $scope.cancel = function () {
//         $location.path('/manage/role/list');
//     };

     
    
//     //for remove single role
//     $scope.removeRoles = function () {
    	
//     	//Dialog used for the confirmation from user to Delete or not the selected role.
//     	var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
//     	localeService.translate('This role may assigned to any user. Please check before deleting it.','ROLE_DOYOUDELETEROLE_DIALOG_MESSAGE').then(function(translateText){
// 	    	var dialog = dialogService.openDialog("confirm",dialogConfiguration,{text: translateText});
// 			dialog.result.then(function(btn){
// 				var roleToDelete = [];
// 				roleToDelete.push($routeParams.id);
// 					rolesService.removeRoles(roleToDelete).then(function (success) {
// 						messageService.showMessage('Remove successfully', 'success', 'ROLEEDITCONTROLLER_REMOVESUCCESS');
// 						$location.path('/manage/role/list');
// 					}, function (error) {
// 						$log.error(error);
// 					});	
// 				},function(btn){
				
// 			});
//     	});
//     };
    
//     //
//     _init();
// }]);

// /* Services start from here */
// rolesApp.factory('rolesService', ['$q', '$log','$http','dataAPI', function ($q, $log, $http, dataAPI) {
//     var rolesService = {};
    
//     var _adminPrivileges = [];
    
//     rolesService.getAdminPrivileges = function(){
//     	var deferred = $q.defer();
//     	//load defualt previlige list from api
//         if(_.isUndefined(_adminPrivileges) || _.isEmpty(_adminPrivileges)){
//             $http({
//                 method: 'POST',
//                 url: dataAPI.base_url + '/privileges/listForVerification',
//              }).then(function (response) {
//             	 _adminPrivileges = response.data.data;
//             	 deferred.resolve(_adminPrivileges);
//             }, function (error) {
//                 $log.error(error);
//                 deferred.reject(error);
//             });
//         } else {
//             deferred.resolve(_adminPrivileges);
//         }
//         return deferred.promise;    
//     };
    
//     /* below method is api cal to get available privilages for new role*/
//     rolesService.getAvailablePrivilage = function () {
//         var deferred = $q.defer();
//         //load list from data api
//         $http({
//             method: 'POST',
//             url: dataAPI.base_url + '/privileges/list',
//         }).then(function (response) {
//             deferred.resolve(response.data.data);
//         }, function (error) {
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
    
//     /* below method is api call for getting available roles for listing screen  same method is use both scree name user manage we have to pass param true to get all info */
//     rolesService.getAvailableRoles = function () {
//         var deferred = $q.defer();
//         //load list from data api
//         $http({
//             method: 'POST',
//             url: dataAPI.base_url + '/roles/list',
//             data: {
//                 role: true
//             }
//         }).then(function (response) {
//             deferred.resolve(response.data.data);
//         }, function (error) {
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
    
//     /* below method is api cal to creat role arguments require name*/
//     rolesService.createRole = function (name, desc, privileges) {
//         var deferred = $q.defer();
//         //load list from data api
//         $http({
//             method: 'POST',
//             url: dataAPI.base_url + '/roles/create',
//             data : {
//                 role : {
//                     name : name,
//                     description : desc,
//                     privileges : privileges
//                 }
//             }
//         }).then(function (response) {
//             deferred.resolve(response.data.data);
//         }, function (error) {
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
    
//     /*below method is api cal to update exsting role*/
//     rolesService.updateRole = function (id, name, desc, privileges) {
//         var deferred = $q.defer();
//         //load list from data api
//         $http({
//             method: 'POST',
//             url: dataAPI.base_url + '/roles/save',
//             data : {
//                 role : {
//                     key: id,
//                     name : name,
//                     description : desc,
//                     privileges : privileges
//                 }
//             }
//         }).then(function (response) {
//             deferred.resolve(response.data.data);
//         }, function (error) {
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
    
//     /* the below method is work for edit screen get role details based on id the*/
//     rolesService.getRole = function (id) {
//         var deferred = $q.defer();
//         //load list from data api
//         $http({
//             method: 'POST',
//             url: dataAPI.base_url + '/roles/open',
//             data : { 'roleId' : id }
//         }).then(function (response) {
//             deferred.resolve(response.data.data);
//         }, function (error) {
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
    
//     /* this method is work on both screen for remove roles  */
//     rolesService.removeRoles = function (roleIds) {
//         var deferred = $q.defer();
//         //load list from data api
//         $http({
//             method: 'POST',
//             url: dataAPI.base_url + '/roles/remove',
//             data : { 'roleIds' : roleIds }
//         }).then(function (response) {
//             deferred.resolve(response.data.data);
//         }, function (error) {
//             $log.error(error);
//             deferred.reject(error);
//         });
//         return deferred.promise;
//     };
//     return rolesService;
// } ]);