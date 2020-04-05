'use strict';
app.factory('mediaService',['$http','$location','$routeParams','$timeout','_','dataAPI','userService','resellerService','$interval',function($http,$location,$routeParams,$timeout,_,dataAPI,userService,resellerService,$interval){
	var mediaService = {};
	
	//This variable used to track if tracking is still initializing
	var initializing = false;
	
	//This will hold views while tracking is initializing
	var pendingViews = [];
	
	/**
	 * This is used to initialize tracking on starting of application
	 */
	mediaService.initTracking = function(){
		if(dataAPI.media_url!=undefined && dataAPI.media_id!=undefined && resellerService.hasFeature("TRACKING")){
			//This variable tells that initialization is in process
			initializing = true;
			
			//update global object for tracking
			dynamic_tm_data = {
	            setup: "app",
	            uid: "", 
	            uemail: "", 
	            module: "", 
	            mode: "",
	            form: "", 
	            action: ""
	        };
			
			//Load JS file for tracking
			//Note: We have done this to have different Js files loaded for different environment as well it should not block rendering of site
			$http({
	            method: 'GET',
	            url: dataAPI.media_url + '/tm_js.aspx?id='+dataAPI.media_id+'&mode=2&dt_freetext=&dt_subid1=&dt_subid2=&dt_keywords='
	        }).then(function(response){
	        	var po = document.createElement('script'); po.type = 'text/javascript';
	        	po.appendChild(document.createTextNode(response.data));
	        	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	        	
	        	//As tracking JS is loaded, we should call all pending views 	        		        		
		        _performPendingViews();	        		        	
	        });
		}
	};
	
	/**
	 * This method will be called from training widget and identifyAndCallView function
	 */
	mediaService.callView = function(moduleName,mode,currentForm,action){
		if(dataAPI.media_url!=undefined && dataAPI.media_id!=undefined && resellerService.hasFeature("TRACKING")){
			//If initialization of tracking is in process we should not call view instead we collect those call in queue
			if(initializing==true){
				pendingViews.push({moduleName:moduleName,mode:mode,currentForm:currentForm});
			}else{
				//Load user details
				var userDetails = userService.getUserDetails();
				if(_.isUndefined(userDetails) || _.isEmpty(userDetails)){
					userDetails={email:'',masterLocationData:{customerNumber:''}};
				}else if(_.isUndefined(userDetails.masterLocationData) || _.isEmpty(userDetails.masterLocationData)){
					userDetails.masterLocationData = {customerNumber:''};
				}else if(_.isUndefined(userDetails.masterLocationData.customerNumber)){
					userDetails.masterLocationData.customerNumber='';
				}
				
				//update global object for tracking
				dynamic_tm_data = {
		            setup: "app",
		            uid: userDetails.masterLocationData.customerNumber, 
		            uemail: userDetails.email, 
		            module: moduleName, 
		            mode: mode,
		            form: currentForm, 
		            action: action
		        };
				
				//call view
				//start interval in every 0.5 seconds
				var intervalDT_ProcessNewPage = $interval(function(){
					//if DT_ProcessNewPage is defined then cancel interval other call it after every interval
					if(typeof DT_ProcessNewPage != 'undefined'){
						DT_ProcessNewPage();
						//cancel inteval
						if(intervalDT_ProcessNewPage != undefined){
							$interval.cancel(intervalDT_ProcessNewPage)
							intervalDT_ProcessNewPage = undefined;
						}
					}		
				},500);
		   }
		}		
	};
	

	
	/**
	 * This method will be called from pages where training widget is not available.
	 * Note: This function is not used yet 
	 */
	mediaService.identifyAndCallView = function(customMode){	
		if(resellerService.hasFeature("TRACKING")){
			//get current location path
			var curPath = $location.path();
			var routeParameterArray = _.values($routeParams);
			if (routeParameterArray.length > 0) {
				curPath = curPath.substring(0, curPath.indexOf("/" + routeParameterArray[0]));
			}
			//to store split path
			var curSplitPath = curPath.split('/');
			var module = curSplitPath[curSplitPath.length - 2];
			var mode = curSplitPath[curSplitPath.length - 1];
			//If there is no module, make mode as module and mode blank
			if(module=='' && mode!=''){
				module = mode;
				mode='';
			}

			//Call media api
			if(customMode!=undefined){
				mediaService.callView(module, customMode, "");
			}else{
				mediaService.callView(module, mode, "");
			}     
		}
	};
	
	/**
	 * This function perform any pending view.
	 * When tracking is under initialization we store all views in queue
	 */
	var _performPendingViews = function(){
		//If queue has any item
		if(pendingViews.length>0){
			//In slower PCs it happens that it takes time to have javascript loaded even it is downloaded.
			//If view function (global) 'DT_ProcessNewPage' is not defined that repeat this method after 500 ms 
			if(typeof DT_ProcessNewPage == 'undefined'){				
				$timeout(function(){
					_performPendingViews();
				},500);
			}else{
				//Mark intialization as complete
				initializing = false;
				//iterate over queue
				for(var index in pendingViews){
					//Arguments for view
					var _args = pendingViews[index];			
					mediaService.callView(_args.moduleName,_args.mode,_args.currentForm);
				}
			}			
		}else{
			//Mark intialization as complete
			initializing = false;
		}
	};
	
	return mediaService;
}]);