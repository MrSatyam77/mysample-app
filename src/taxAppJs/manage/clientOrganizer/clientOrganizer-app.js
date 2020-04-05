'use strict';

var clientOrganizerApp = angular.module('clientOrganizerApp', []);


//List Controller start----------
clientOrganizerApp.controller('clientOrganizerListController',['$scope','$rootScope','$log','$filter','$location','$q','$timeout','NgTableParams','messageService','userService','dialogService','clientOrganizerService','localeService','environment',
                                                               function($scope,$rootScope,$log,$filter,$location,$q,$timeout,NgTableParams,messageService,userService,dialogService,clientOrganizerService,localeService,environment){
		
	//Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);    	
    };
    $scope.filterReturnConfig = {};
    $scope.filterReturnDisplay = {};
    // Options for Type in filter
    // This needs to be come from application config for types we support
    $scope.returnTypes = [{ title: "All Types", id: undefined },{ title: "1040 - Individual", id: "1040" },{ title: "1065 - Partership", id: "1065" },{ title: "1120 - Corporate", id: "1120" },{ title: "1120S - S-Corporate", id: "1120S" }];
    // End
    // Initial values for filter config
    $scope.initFilterConfigReturnTypes = function () {
        if ((angular.isUndefined($scope.filterReturnDisplay.type) || $scope.filterReturnDisplay.type != null || $scope.filterReturnDisplay.type == "") 
			&& (angular.isUndefined($scope.filterReturnConfig.returnType) || $scope.filterReturnConfig.returnType != null || $scope.filterReturnConfig.returnType == "")) {
            $scope.filterReturnDisplay.type = $scope.returnTypes[0].title;
            $scope.filterReturnConfig.returnType = $scope.returnTypes[0].type;
        }
		
    };
   
    $scope.backToHomeScreen = function() {
		$location.path('/home');
		
		}
 // List of available client organizer,
	$scope.clientOrganizerList = [];
    
    // Fetch list from API 
    var _initClientOrganizerList = function() {
           var deferred = $q.defer();
           
           // get list from API
           clientOrganizerService.getList().then(function (response) {
        	   $scope.clientOrganizerList = response;        	  
               deferred.resolve();
           }, function (error) {
               $log.error(error);
               deferred.reject(error);
           });
           
           return deferred.promise;
	};
    
    // For Grid - Start. First object is configuration and second is for data
    // and other operations from data
    $scope.listGrid = new NgTableParams({
        page : 1, // show initial page
        count: 10// count per page       
    }, {
        total : 0, // length of data
        sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
        getData : function ($defer, params) {
            // Request to API
            // get Data here				
            if (angular.isUndefined($scope.clientOrganizerList) || $scope.clientOrganizerList.length == 0) {
                _initClientOrganizerList().then(function () {
                	//Initially no need to apply any filter
    				var filteredData = $scope.clientOrganizerList;
                    //Apply standard sorting
                    var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                    // for paging
                    params.total(filteredData.length);
                    //Return Result to grid
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, function (error) {
                    $log.error(error);
                });
            }else if(angular.isDefined($scope.clientOrganizerList) && $scope.clientOrganizerList.length > 0){            	
				var filteredData = $scope.clientOrganizerList;
            	
            	//filter based on search field $scope.searchField
				if(angular.isDefined($scope.searchField) && $scope.searchField!=''){
					filteredData = $filter('filter')(filteredData,function(entry,index){
						if(angular.isDefined(entry.name) &&  entry.name.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
							return true;
						}else if(angular.isDefined(entry.description) && entry.description.toLowerCase().indexOf($scope.searchField.toLowerCase())>=0){
							return true;
						} else if (angular.isDefined(entry.returnType) && entry.returnType.toLowerCase().indexOf($scope.searchField.toLowerCase()) >= 0) {
                            return true;
                        }
					});
				};
				
				if(!_.isUndefined($scope.filterReturnConfig) && !_.isUndefined($scope.filterReturnConfig.returnType) && $scope.filterReturnConfig.returnType != ""){
					filteredData = $filter('filter')(filteredData, $scope.filterReturnConfig);//for return type filter
				}                
	            //Apply standard sorting
	            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
	         // for paging
                params.total(filteredData.length);
	            //Return Result to grid
	            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }
    });
    
  //Object holding timeout
	var filterTimeout = {};

	// Watch for search from user.
	$scope.$watch('searchField',function(newVal,oldVal){
		if ($scope.listGrid.settings().$scope!=null && newVal!=oldVal) {
			$timeout.cancel(filterTimeout);
			//Register new timeout for filter
			filterTimeout = $timeout(function(){					
				//Reload grid. Which will re-bind data by filtering it
				$scope.listGrid.reload();
				//go to first page.
				$scope.listGrid.page(1);
			},300);
		}
	});
    // Watcher for Filter
    $scope.$watch("filterReturnConfig.returnType", function (newVal, oldVal) {
        //This is require to prevent multiple reload on startup 
        if ($scope.listGrid.settings().$scope != null && newVal != oldVal) {
            $scope.listGrid.reload();
            //go to first page.
            $scope.listGrid.page(1);
        }
    });
    //Redirect to Edit screen when click on New for creating client organizer 
    $scope.create = function () {
        $location.path('/manage/clientOrganizer/edit');
    };
	
	$scope.clearSearch = function (){
		$scope.searchField = '';
	}; 

    //Redirect to Edit screen when click on edit of client organizer
    $scope.edit = function(id) {
    	$location.path('/manage/clientOrganizer/edit/' + id);
	};
	
	//Delete organizer when click on delete
	// Function will handle both single and multiple delete use case 
	$scope.remove = function(clientOrganizer) {		
		var displayText='';
		var organizerToDelete = [];
		// In-case of single organizer delete we directly push organizer to array 
        if (angular.isDefined(clientOrganizer) && angular.isDefined(clientOrganizer.isPredefined) && clientOrganizer.isPredefined==false) {
        	organizerToDelete.push(clientOrganizer.id);
        }
        else {
        	// In-case of multiple delete we check for selected organizer and push them to array
            _.forEach($scope.clientOrganizerList, function (clientOrganizer) {
                if (angular.isDefined(clientOrganizer.isSelected) && clientOrganizer.isSelected == true && angular.isDefined(clientOrganizer.isPredefined) && clientOrganizer.isPredefined==false) {
                	organizerToDelete.push(clientOrganizer.id);
                }
            });
        }
        // IF array size is greater then zero then only we remove client organizer
        if (_.size(organizerToDelete) > 0) {
        	if(_.size(organizerToDelete) > 1){
        		displayText = "Do you want to delete "+_.size(organizerToDelete)+" client organizer?";
        	}else{
        		displayText = "Do you want to delete this client organizer?";
        	}
        	//Dialog used for the confirmation from user to Delete or not the selected client organizer.
            var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
	            localeService.translate(displayText,'CLIENTORGANIZER_DOYOUDELETECLIENTORGANIZER_DIALOG_MESSAGE').then(function(translateText){
		        	var dialog = dialogService.openDialog("confirm",dialogConfiguration, {text: translateText});
		    		dialog.result.then(function(btn){ 
		    			clientOrganizerService.remove(organizerToDelete).then(function (success) {            	
		                    messageService.showMessage('Remove successfully', 'success','CLIENTORGANIZERLISTCONTROLLER_REMOVESUCCESS');
		                    // On successfully deletion we will reinitialized list.
		                    _initClientOrganizerList().then(function () {
		                    	$scope.listGrid.reload();
		                    }, function (error) {
		                        $log.error(error);
		                    });                
		                }, function (error) {
		                    $log.error(error);
		                });
		    		},function(btn){
		
					});
            });
        }

	};
	
	// Mark As Default
	$scope.markAsDefault = function(id,packageId) {
		//storing user details
		var userDetail = userService.getUserDetails();
		
		// if settings is undefined then we create it's new object
		if(_.isUndefined(userDetail.settings)){
			userDetail.settings = {};
		}
		
		// if preferences is undefined then we create it's new object
		if(_.isUndefined(userDetail.settings.preferences)){
			userDetail.settings.preferences = {};
		}
		
		// if clientOrganizer is undefined then we store it else we just update it
		if(_.isUndefined(userDetail.settings.preferences.clientOrganizer)){
			userDetail.settings.preferences.clientOrganizer = {packageId:id};
		}else{
			userDetail.settings.preferences.clientOrganizer[packageId]=id;
		}
		
		// sending updated preferences object to API
		userService.changeSettings('preferences',userDetail.settings.preferences).then(function (response) {
				messageService.showMessage('Preferences updated','success','CHANGEPREFERENCES_SAVE_MSG');
		    }, function (error) {
		        $log.error(error);
		});
	}; 
	
	 //Temporary function to differentiate features as per environment (beta/live)
	$scope.betaOnly = function(){
		if(environment.mode=='beta' || environment.mode=='local')
			return true;
		else
			return false;
	};
	
}]);
// List Controller end----------

//Edit Controller end----------
clientOrganizerApp.controller('clientOrganizerEditController',['_','$scope','$routeParams', '$log','$location','$filter','$timeout','$q','messageService','userService','dialogService','clientOrganizerService','localeService',
                                                               function(_,$scope, $routeParams, $log,$location,$filter,$timeout,$q,messageService,userService,dialogService,clientOrganizerService,localeService) {
	//Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);    	
    };
    
    // This needs to be come from application config for types we support
    $scope.returnTypes = [{ title: "1040 - Individual", id: "1040" },{ title: "1065 - Partership", id: "1065" },{ title: "1120 - Corporate", id: "1120" },{ title: "1120S - S-Corporate", id: "1120S" }];
    // End
    

    // Initialization
    var _init = function() {
    	$scope.clientOrganizer = {};  
    	
		if(angular.isDefined($routeParams.id) && $routeParams.id != ""){
			$scope.mode = "edit";
			_getData($routeParams.id);
			
		}else{
			$scope.mode = "create";
			
			// Default documents 
			$scope.clientOrganizer.taxDocuments = [{"name":"1099-INT"},{"name":"1099-DIV (or 1099-Comp)"},{"name":"Taxpayer's RRB-1099"},{"name":"Taxpayer's SSA-1099"},
			                                    {"name":"1099-Misc"},{"name":"1099-B"},{"name":"K-1 Scorp"},{"name":"1098 Home Mortgage"},{"name":"W2"},{"name":"1099R"},
			                                    {"name":"Spouse's RRB-1099"},{"name":"Spouse's SSA-1099"},{"name":"1099-Q"},{"name":"K-1 Partnership"},
			                                    {"name":"K-1 Trusts"},{"name":"1099-G Unemployment Compensation"}];
			
			// Default questionnaire
			$scope.clientOrganizer.questionnaire = [{"question":"What is your current address?"},{"question":"Did your marital status change?"},
			                                        {"question":"Were there any changes in dependents?"},{"question":"Did you have any child or dependent care expenses? Please include the provider's name, address, SSN/ITIN or EIN, and amount paid."},
			                                        {"question":"Did you buy or sell stocks, mutual funds, bonds, or other investment properties?"},{"question":"Did you buy, sell, or refinance your home?"},
			                                        {"question":"Did you donate money, clothes, cars, or stock?"},{"question":"Did you incur any tuition or continuing education expenses?"},
			                                        {"question":"Did you receive a distribution from or make a contribution to a retirement plan (401(k), IRA, etc.)?"},
			                                        {"question":"Did you and your dependents have health care coverage for the full-year?"},
			                                        {"question":"Did you receive any of the following IRS documents? Form 1095-A, 1095-B, or Form 1095-C? If so, please send."},
			                                        {"question":"For direct deposit, please provide your bank name, routing number, and account number?"},
			                                        {"question":"Do you want to electronically file your tax return?"},{"question":"Please list any questions or other concerns you might have."}
			                                       ];
			
			//Get letter head data.
			$scope.clientOrganizer.letterHead = clientOrganizerService.getLetterHead();
		}
		
	};	
	
	// Remove given document.
	$scope.removeDocument = function(document){
		_.remove($scope.clientOrganizer.taxDocuments, function(obj) {
			if(obj == document){
				return true;
			}
		});
	};
	
	// Remove given question.
	$scope.removeQuestion = function(question){
		_.remove($scope.clientOrganizer.questionnaire, function(obj) {
			if(obj == question){
				return true;
			}
		});
	};
	
	 //get details on bases of given id (Edit mode)
    var _getData = function(id) {
    	clientOrganizerService.open(id).then(function(response) {
    		$scope.clientOrganizer = response;    		
    	},function(error){
    		$log.error(error);
    	});
    }
    
    // Create new or edit a priceList
	$scope.save = function() {		
		if(angular.isDefined($scope.clientOrganizer)){
			//IF there is blank or undefined objects in array then remove them
			if(angular.isDefined($scope.clientOrganizer.taxDocuments)){
				_.remove($scope.clientOrganizer.taxDocuments,function(docObj){
					if(_.isEmpty(docObj) || _.isUndefined(docObj.name) || docObj.name == ""){
						return true;
					}
					return false;
				});
			}
			
			//IF there is blank or undefined objects in array then remove them
			if(angular.isDefined($scope.clientOrganizer.questionnaire)){
				_.remove($scope.clientOrganizer.questionnaire,function(questions){
					if(_.isEmpty(questions) || _.isUndefined(questions.question) || questions.question == ""){
						return true;
					}
					return false;
				});
			}
			
			// Check whether organizer is in edit mode or new mode						
			if($scope.mode == 'edit' && angular.isDefined($scope.clientOrganizer.isPredefined) && $scope.clientOrganizer.isPredefined==false){
				clientOrganizerService.save($scope.clientOrganizer).then(function(response) {
					messageService.showMessage('Updated successfully', 'success','CLIENTORGANIZEREDITCONTROLLER_UPDATESUCCESS');
					$location.path('/manage/clientOrganizer/list');
				},function(error){
					$log.error(error);
				});
			}else if($scope.mode == 'create'){
				clientOrganizerService.create($scope.clientOrganizer).then(function(response) {
					messageService.showMessage('Created successfully', 'success','CLIENTORGANIZEREDITCONTROLLER_ADDSUCCESS');
					$location.path('/manage/clientOrganizer/list');
				},function(error){
					$log.error(error);
				});
			}
		}
	};
	
	// Remove clientOrganizer	
	$scope.remove = function() {	
		if(angular.isDefined($scope.clientOrganizer.isPredefined) && $scope.clientOrganizer.isPredefined==false){
			//Dialog used for the confirmation from user to Delete or not the selected clientOrganizer.
	    	var dialogConfiguration = {'keyboard':false,'backdrop':false,'size':'sm','windowClass': 'my-class'};
	    	localeService.translate('Do you want to delete this client Organizer?','CLIENTORGANIZER_DOYOUDELETECLIENTORGANIZER_DIALOG_MESSAGE').then(function(translateText){
		    	var dialog = dialogService.openDialog("confirm",dialogConfiguration, {text: translateText});
				dialog.result.then(function(btn){
					var clientOrganizerToDelete = [];
					if (angular.isDefined($scope.clientOrganizer.id)) {
						clientOrganizerToDelete.push($scope.clientOrganizer.id);
		        	
						clientOrganizerService.remove(clientOrganizerToDelete).then(function (success) {
							messageService.showMessage('Remove successfully', 'success','CLIENTORGANIZEREDITCONTROLLER_REMOVESUCCESS');                
							$location.path('/manage/clientOrganizer/list');
						}, function (error) {
							$log.error(error);
						});
					}
		        },function(btn){
					// do nothing on cancel or close button click
				});
	    	});
		}
	};
	
	//on click cancel we just redirect to clientOrganizer list 
    $scope.cancel = function () {
    	$location.path('/manage/clientOrganizer/list');
	};
	

	//print client organizer
	$scope.print = function () {
		$scope.isQuestionnaireIncluded = true;
		$scope.isTaxDocumentsIncluded = true;
		$scope.isTaxNewsIncluded = true;
		$scope.isCoverLetterIncluded = true;
		$scope.isLetterHeadIncluded = true; 

		// cleint organizer name
		var taxPayerName = $scope.clientOrganizer.name;
		var selectedReturnType = $scope.clientOrganizer.returnType;

		// we will pre-fill the taxPayerName in cover letter section
		if (!_.isUndefined(taxPayerName) && taxPayerName != "") {
			$scope.coverLetterName = taxPayerName;
		}

		var content = [], fileName = "";
		if (angular.isDefined($scope.clientOrganizer)) {
			//check box image's base64 code
			var checkbox = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4y2NgYGD4TyGGEGSCUQNGDRg1gNoGkI0BF6E7xboN5iEAAAAASUVORK5CYII=';

			//Check whether letter head to include or not
			if ($scope.isLetterHeadIncluded == true) {
				//Push header only if there is a value
				if (angular.isDefined($scope.clientOrganizer.letterHead) && $scope.clientOrganizer.letterHead != '') {
					content.push({ text: $scope.clientOrganizer.letterHead, style: 'text_align_right', margin: [0, 0, 0, 10] });
				}
			}

			// Check whether cover letter to be included or not
			// margin should be 20, so if no name provide then margin 20 should apply in cover letter if it is defined and not empty.
			if ($scope.isCoverLetterIncluded == true) {
				var marginTop = 20;
				// If name defined then add to pdf.
				if (angular.isDefined($scope.coverLetterName) && $scope.coverLetterName != "") {
					fileName = $scope.coverLetterName + " - ";
					content.push({ text: "Dear " + $scope.coverLetterName + ",", margin: [0, marginTop, 0, 10] });
					marginTop = 0;
				}

				if (angular.isDefined($scope.clientOrganizer.coverLetter) && $scope.clientOrganizer.coverLetter != "") {
					content.push({ text: $scope.clientOrganizer.coverLetter, margin: [0, marginTop, 0, 10] });
				}
			}

			// Check whether news to be included or not
			if ($scope.isTaxNewsIncluded == true) {
				if (angular.isDefined($scope.clientOrganizer.taxNews) && $scope.clientOrganizer.taxNews != "") {
					content.push({ text: $scope.clientOrganizer.taxNews, margin: [0, 50, 0, 10] });
				}
			}

			// check whether documents to be added.
			// margins are given to show documents in two column of data.
			// checkbox is added additionally with each question
			if ($scope.isTaxDocumentsIncluded == true) {
				if (angular.isDefined($scope.clientOrganizer.taxDocuments) && $scope.clientOrganizer.taxDocuments.length > 0) {
					content.push({ text: "Please provide the following Tax documents needed to prepare your return", style: "header", margin: [0, 50, 0, 10] });
					var columns = [];
					_.forEach($scope.clientOrganizer.taxDocuments, function (obj, index) {
						if (!_.isEmpty(obj) && !_.isUndefined(obj.name) && obj.name != "") {
							columns.push({ width: 15, height: 15, image: checkbox, margin: [0, 0, 0, 10] });
							columns.push({ width: '*', text: obj.name, margin: [10, 0, 0, 10] });

							if ((index + 1) % 2 == 0) {
								content.push({ columns: columns });
								columns = [];
							} else if (index == ($scope.clientOrganizer.taxDocuments.length - 1)) {
								content.push({ columns: columns });
								columns = [];
							}
						}
					});
				}
			}

			//check whether questions to be added or not
			//checkbox and underlines are added additionally with each question
			if ($scope.isQuestionnaireIncluded == true) {
				if (angular.isDefined($scope.clientOrganizer.questionnaire) && $scope.clientOrganizer.questionnaire.length > 0) {
					content.push({ text: "Please provide the following information needed to prepare your tax return", style: "header", margin: [0, 50, 0, 10] });
					_.forEach($scope.clientOrganizer.questionnaire, function (questions) {
						if (!_.isEmpty(questions) && !_.isUndefined(questions.question) && questions.question != "") {
							var columns = [];
							columns.push({ width: 15, height: 15, image: checkbox, margin: [0, 0, 0, 10] });
							columns.push({ width: '*', text: questions.question, margin: [10, 0, 0, 10] });
							content.push({ columns: columns });
							content.push({ width: 510, height: 1, text: "_________________________________________________________________________________________", margin: [25, 3, 0, 10] });
						}
					});
				}
			}

			var docDefinition = {
				content: content,
				styles: {
					header: { bold: true, fontSize: 15 },
					text_align_right: { alignment: 'right' }
				},
				defaultStyle: {
					fontSize: 12,
				}
			};

			fileName = fileName + "Questionnaire";
			pdfMake.createPdf(docDefinition).download(fileName + ".pdf");
		}
	};

		
	// Load time initialization
	_init();
	
}]);

//edit Controller end----------


// Print Controller start----------

clientOrganizerApp.controller('clientOrganizerPrintController',['_','$scope','$routeParams', '$log','$location','$filter','$timeout','$q','$rootScope','messageService','userService','dialogService','clientOrganizerService','basketService',
                                                               function(_,$scope, $routeParams, $log,$location,$filter,$timeout,$q,$rootScope,messageService,userService,dialogService,clientOrganizerService,basketService) {
	//Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);    	
    };
    
  
	
    // Initialization
    var _init = function() {
    	$scope.clientOrganizer = {};
    	$scope.clientOrganizer.taxDocuments = [];
    	$scope.clientOrganizer.questionnaire = [];
    	$scope.isQuestionnaireIncluded = true;
    	$scope.isTaxDocumentsIncluded = true;  
    	$scope.isTaxNewsIncluded = true;
    	$scope.isCoverLetterIncluded = true;
    	$scope.isLetterHeadIncluded = true;
    	
    	// Get taxPayerName from bucket service
    	var taxPayerName = basketService.popItem("taxPayerNameForClientOrganizer");
    	var selectedReturnType = basketService.popItem("returnTypeForClientOrganizer");  
    	
    	// If coming from return list then we will pre-fill the taxPayerName in cover letter section
    	if(!_.isUndefined(taxPayerName) && taxPayerName != ""){    		
    			$scope.coverLetterName = taxPayerName;    		
    	}
    	
    	// get list of templates from API
		clientOrganizerService.getList().then(function (response) {
			if(!_.isUndefined(response)){
				$scope.defaultTemplates= response;
			}
			
			if(_.isUndefined(selectedReturnType)){
	    		 // Load predefined template by default
				 $scope.selectedTemplate = _.find($scope.defaultTemplates, { 'isPredefined': true });
				_intializeClientOrganizer();
	    	}else{

	     	   //Select first template
	     	   if(angular.isDefined($scope.defaultTemplates) && $scope.defaultTemplates.length > 0){
	     		   	//here we get userDetail to pre-fill value of template which was saved default by user(in change preferences)
	     			var userDetail = userService.getUserDetails();
	     			//here we will check whether userDetail have clientOrganizer object or not
	     			if(!_.isUndefined(userDetail.settings) && !_.isUndefined(userDetail.settings.preferences) && !_.isUndefined(userDetail.settings.preferences.clientOrganizer) && !_.isUndefined(userDetail.settings.preferences.clientOrganizer[selectedReturnType])){
	     			   //here we find data of clientOrganizer by ID  
	     			   var data = _.find($scope.defaultTemplates,{id:userDetail.settings.preferences.clientOrganizer[selectedReturnType]});
	     			   
	     			   if(!_.isUndefined(data)){
	     				   //default data will be assigned to selectedTemplate
	     				   $scope.selectedTemplate = data;
	     			   }else{
	     				   // Load predefined template by default
	     				   $scope.selectedTemplate = _.find($scope.defaultTemplates, { 'isPredefined': true });
	     			   }
	     		   }else{
	     			   // Load predefined template by default
	     			   $scope.selectedTemplate = _.find($scope.defaultTemplates, { 'isPredefined': true });
	     		   } 
	     		   _intializeClientOrganizer();
	     	   }
	        }
			
		},function (error) {
            $log.error(error);
    	});
    	
	};
	
	var _intializeClientOrganizer = function() {
		$scope.clientOrganizer = $scope.selectedTemplate;
  	  	// IF default template don't have letterHead then get default letterHead from services 
  	  	if(angular.isUndefined($scope.clientOrganizer.letterHead) || $scope.clientOrganizer.letterHead == ""){
			$scope.clientOrganizer.letterHead = clientOrganizerService.getLetterHead();
		}
	};
	
	// Remove given document.
	$scope.removeDocument = function(document){
		_.remove($scope.clientOrganizer.taxDocuments, function(obj) {
			if(obj == document){
				return true;
			}
		});
	};
	
	// Remove given question.
	$scope.removeQuestion = function(question){
		_.remove($scope.clientOrganizer.questionnaire, function(obj) {
			if(obj == question){
				return true;
			}
		});
	};
	
	// Change default templates and reload data.
	$scope.changeTemplate = function() {
		_intializeClientOrganizer();
	};
	
	//Reload selected template.
	$scope.resetTemplate = function() {
		// reload selected template
		clientOrganizerService.open($scope.selectedTemplate.id).then(function(response) {
			// We have to reset both objects.
			$scope.selectedTemplate = response;			
			_intializeClientOrganizer();
    		
    		// Update default template
    		_.forEach($scope.defaultTemplates,function(template,$index){
    			if(template.id == response.id){
    				$scope.defaultTemplates[$index] = response;    				    				
    			}
    		});
    	},function(error){
    		$log.error(error);
    	});
	};	
    
    // Create new or edit a priceList
	$scope.print = function() {
		var content = [],fileName="";
		if(angular.isDefined($scope.clientOrganizer)){
			//check box image's base64 code
			var checkbox = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4y2NgYGD4TyGGEGSCUQNGDRg1gNoGkI0BF6E7xboN5iEAAAAASUVORK5CYII=';		
			
			//Check whether letter head to include or not
			if($scope.isLetterHeadIncluded == true){
				//Push header only if there is a value
				if(angular.isDefined($scope.clientOrganizer.letterHead) && $scope.clientOrganizer.letterHead != ''){
					content.push({text:$scope.clientOrganizer.letterHead,style:'text_align_right',margin:[0,0,0,10]});
				}
			}
			
			// Check whether cover letter to be included or not
			// margin should be 20, so if no name provide then margin 20 should apply in cover letter if it is defined and not empty.
			if($scope.isCoverLetterIncluded == true){
				var marginTop = 20;
				// If name defined then add to pdf.
				if(angular.isDefined($scope.coverLetterName) && $scope.coverLetterName != ""){					
					fileName = $scope.coverLetterName + " - ";
					content.push({text:"Dear " + $scope.coverLetterName + ",",margin:[0,marginTop,0,10]});
					marginTop = 0;
				}
				
				if(angular.isDefined($scope.clientOrganizer.coverLetter) && $scope.clientOrganizer.coverLetter != ""){
					content.push({text: $scope.clientOrganizer.coverLetter,margin:[0,marginTop,0,10]});
				}
			}
			
			// Check whether news to be included or not
			if($scope.isTaxNewsIncluded == true){
				if(angular.isDefined($scope.clientOrganizer.taxNews) && $scope.clientOrganizer.taxNews != ""){
					content.push({text: $scope.clientOrganizer.taxNews,margin:[0,50,0,10]});
				}
			}
			
			// check whether documents to be added.
			// margins are given to show documents in two column of data.
			// checkbox is added additionally with each question
			if($scope.isTaxDocumentsIncluded == true){				
				if(angular.isDefined($scope.clientOrganizer.taxDocuments) && $scope.clientOrganizer.taxDocuments.length > 0){
					content.push({text:"Please provide the following Tax documents needed to prepare your return",style:"header",margin:[0,50,0,10]});
					var	columns = [];
					_.forEach($scope.clientOrganizer.taxDocuments,function(obj,index){
						if(!_.isEmpty(obj) && !_.isUndefined(obj.name) && obj.name != ""){
							columns.push({ width: 15, height:15, image: checkbox,margin:[0,0,0,10]});							
							columns.push({ width: '*', text: obj.name,margin:[10,0,0,10]});
						
							if((index + 1) % 2 == 0){
								content.push({columns:columns});
								columns = [];
							}else if(index == ($scope.clientOrganizer.taxDocuments.length -1)){
								content.push({columns:columns});
								columns = [];
							}
						}
					});
				}
			}
			
			//check whether questions to be added or not
			//checkbox and underlines are added additionally with each question
			if($scope.isQuestionnaireIncluded == true){				
				if(angular.isDefined($scope.clientOrganizer.questionnaire) && $scope.clientOrganizer.questionnaire.length > 0){
					content.push({text:"Please provide the following information needed to prepare your tax return",style:"header",margin:[0,50,0,10]});
					_.forEach($scope.clientOrganizer.questionnaire,function(questions){
						if(!_.isEmpty(questions) && !_.isUndefined(questions.question) && questions.question != ""){
							var columns = [];
							columns.push({ width: 15, height:15, image: checkbox,margin:[0,0,0,10] });							
							columns.push({ width: '*', text: questions.question, margin:[10,0,0,10]});
							content.push({columns:columns});
							content.push({width:510,height: 1,text:"_________________________________________________________________________________________",margin:[25,3,0,10]});
						}
					});
				}			
			}
			
			var docDefinition = {						
					content:content,
					styles: {
						header: {bold: true, fontSize: 15 },
						text_align_right:{alignment: 'right'}
					},
					defaultStyle: {
						fontSize: 12,
					}
			};			

			fileName = fileName + "Questionnaire";
			pdfMake.createPdf(docDefinition).download(fileName +".pdf");
		}
	};
	
	//on click cancel we just redirect to clientOrganizer list 
    $scope.cancel = function () {
    	$location.path('/return/list');
    };
		
	// Load time initialization
	_init();
	
}]);

//Print Controller end----------

clientOrganizerApp.factory('clientOrganizerService',['$q', '$log','$http','dataAPI','userService', function ($q, $log, $http, dataAPI,userService) {
	var clientOrganizerService = {};
	
	// get Letter head if it isnot defined or empty.	
	clientOrganizerService.getLetterHead = function() {
		// Print office name and email id of current logged in user in letter head.
        var userDetails = userService.getUserDetails();
        var letterHead = "";
        
        if(angular.isDefined(userDetails.firstName)){
        	letterHead = userDetails.firstName;	        	
        }
        
        if(angular.isDefined(userDetails.lastName)){
        	letterHead = letterHead + " " + userDetails.lastName + "\n";
        }else if(angular.isDefined(userDetails.firstName)){	        	
        	letterHead = letterHead + "\n";
        }
        
        if(angular.isDefined(userDetails.locationData) && angular.isDefined(userDetails.locationData.name)){
        	letterHead =  letterHead + userDetails.locationData.name +  "\n" ;
        }
        
        if(angular.isDefined(userDetails.locationData) && angular.isDefined(userDetails.email)){
        	letterHead = letterHead + userDetails.email  +  "\n";
        }
        
        var tempData = userDetails.locations[userDetails.currentLocationId];
        if(angular.isDefined(tempData) && angular.isDefined(tempData.usAddress)  && !_.isEmpty(tempData.usAddress)){
	        if(angular.isDefined(tempData.usAddress.street) && tempData.usAddress.street != ""){
	        	letterHead = letterHead + tempData.usAddress.street;
	        }
	        
	        if((angular.isDefined(tempData.usAddress.city) && tempData.usAddress.city != "") || (angular.isDefined(tempData.usAddress.state) && tempData.usAddress.state != "") || (angular.isDefined(tempData.usAddress.zipCode) && tempData.usAddress.zipCode != "")){
	        	letterHead = letterHead + ",";
	        }
	        
	        letterHead = letterHead + "\n";
	        
	        if(angular.isDefined(tempData.usAddress.city) && tempData.usAddress.city != ""){
	        	letterHead = letterHead + tempData.usAddress.city;
	        }
	        
	        if(angular.isDefined(tempData.usAddress.state) && tempData.usAddress.state != ""){		        	
	        	letterHead = letterHead + " ," + tempData.usAddress.state;
	        }
	        
	        if(angular.isDefined(tempData.usAddress.zipCode) && tempData.usAddress.zipCode != ""){
	        	letterHead = letterHead + " " + tempData.usAddress.zipCode + "\n";
	        }
	        
	        if(angular.isDefined(tempData.usAddress.telephone) && tempData.usAddress.telephone !=""){
	        	letterHead = letterHead + "Phone : " + tempData.usAddress.telephone;
	        }
        }
        return letterHead;
	};
	
	 /*get all available client organizer list */
	clientOrganizerService.getList = function () {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientOrganizer/list'
        }).then(function (response) {
            deferred.resolve(response.data.data);            
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
  
	clientOrganizerService.create = function(clientOrganizer) {
    	var deferred = $q.defer();
    	//create client organizer
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientOrganizer/create',
            data : {
				'data' :clientOrganizer
			}
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    clientOrganizerService.open = function(id) {
    	var deferred = $q.defer();
    	//open a client organizer
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientOrganizer/open',
            data : {
				'data' : {
					'id' : id
				}
			}
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    clientOrganizerService.save = function(clientOrganizer) {
    	var deferred = $q.defer();
    	//edit or save client organizer
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientOrganizer/save',
            data : {
				'data' :clientOrganizer
			}
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    clientOrganizerService.remove = function(ids) {
    	var deferred = $q.defer();
    	//delete client organizer
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientOrganizer/remove',
            data : {
				'data' : {
					'clientOrganizerIds': ids					
				}
			}
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
	
	return clientOrganizerService;
}]);
