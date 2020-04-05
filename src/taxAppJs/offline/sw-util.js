'use strict'

var utils = (function(){
	//
	var _apiForQueue = {
                            '/return/save': { 'response': { 'code': 2000, 'messageKey': '', 'data': {} }, 'functionToExecute': 'saveReturnQueueFunction', 'args': [['content',0,'data'],['returnId'],['content',0,'cmd']] },
                            '/return/close': { 'response': { 'code': 2000, 'messageKey': '', 'data': {} } },
                            '/return/changeStatus': { 'response': { 'code': 2000, 'messageKey': '', 'data': {} }, 'functionToExecute': 'changeReturnStatusQueueFunction', 'args': [['changeStatus','returnId'],['changeStatus','status']] },
                            '/return/create': { 'response': { 'code': 2000, 'messageKey': ''} }
						};


	//List of apis (POST) for which we have to cache response (Network first)
	var _apiForCache = ['/return/list',//Return List
						'/return/open',//return open - different per return
						'/efile/list',//E-File List
						'/efile/summary',//E-File Summary (Counters)
						'/efile/getRejection',//E-File Rejection - different per return
						'/bank/summary',//Bank Summary (Counters)
						'/bank/getStatus',//Bank Status
						'/bank/getRejection',//Bank Rejection - different per return
						'/calendar/list',//Events
						'/calendar/listByDate',//Counters						
						'/preparer/list',//preparer list
						'/ein/list',//EIN list
						'/clientnote/preparer/list',//client notes belongs to preparer
						'/clientnote/return/list', //client notes belong to return or form
						'/priceList/list',//price list
						'/crm/subscription/status',//subscription status
						'/reseller/style/dashboard',//css style as per reseller config
						'/auth/style/user/preferences'//css style as per user configuration
						];

	var _apiForCacheOptions = {'/return/open':{'isUniqueURL':false,'lookForProperty':'returnId'},
								'/efile/getRejection':{'isUniqueURL':false,'lookForProperty':'returnId'},
								'/bank/getRejection':{'isUniqueURL':false,'lookForProperty':'returnId'}
								};

	var _excludeAPIFromCache = [
								'/auth/keepAlive',//This will used to check if internet is available or not
								'/app/version/get'//this is for versioning check, to reload all existing user from backend
								];

	var _apiOnlineResponseFunctions = {'/auth/session':{'functionToExecute':'sessionResponseEvaluation'},
										'/return/list':{'functionToExecute':'returnListResponseEvaluation'}
										};

	var _apiOnlineRequestFunctions = {'/auth/changeDefaultLocation':{'functionToExecute':'changeDefaultLocationRequestEvaluation'}										
									};

	//This function is used to append cache name to provided option.
	//This will be used in handler registered thorugh sw-toolbox to cache data on passed cachName
	var _setOptions = function(options,cacheName){
		//
		if(options==undefined){
			options={};
		}
		
		//
		if(cacheName!=undefined){
			//
			if(options.cache==undefined){
				options.cache={};
			}
			//
			options.cache.name=cacheName;
		}
		
		return options;
	};

	//This function will used to load json files
	var _loadJSONFile = function(filePath){
		//Promise
		return new Promise(function(resolve,reject){
			//Make request to load file
			fetch(filePath).then(function(response){
				//If response is not proper log and return
				if (response.status !== 200) {
		        	console.log('Looks like there was a problem. Status Code: ' +  response.status);
			        reject('Error while getting '+filePath);
		      	}else{
		      		// Examine the text in the response
			    	response.json().then(function(data) {	    		
			    		//check if list is defined
			    		if(data != undefined){
			    			//
			    			resolve(data);
			    		}	    		
				    },function(error){
						console.error(error);
						reject(error);
					});
		      	}		    
			},function(error){
				console.error(error);
				reject(error);
			})
		});
	};

	/*
	 * This method is used to remove passed url paremeters from url.
	 * Used to remove parameter which are added just to avoid cache.
	 */
	var _stripIgnoredUrlParameters = function (originalUrl, ignoreUrlParametersMatching) {
	    var url = new URL(originalUrl);

	    url.search = url.search.slice(1) // Exclude initial '?'
	      .split('&') // Split into an array of 'key=value' strings
	      .map(function(kv) {
	        return kv.split('='); // Split each 'key=value' string into a [key, value] array
	      })
	      .filter(function(kv) {
	        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
	          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
	        });
	      })
	      .map(function(kv) {
	        return kv.join('='); // Join each [key, value] array into a 'key=value' string
	      })
	      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

	    return url.toString();
	  };

  	/**
   	 * To create clone of object. (To avoid )
   	 */
   	var _cloneObject = function(object){
   		var _newObject = {};

   		for(var prop in object){
   			_newObject[prop] = object[prop];
   		}

   		return _newObject;
   	};
    
    /*
	 * This method is used to create static cache list name using request url
	 */
	var _getStaticCacheNameUsingURL = function (originalUrl) {
        //create Proper URL from string 
        var url = new URL(originalUrl);
        //to store final cache name 
        var _staticCacheName;
        //split url and create array 
        var _urlSplitList = url.pathname.split('/');
        //check _urlSplitList contains template then make final name as static 
        //TODO: Changes to make new tax year live
        if ((_urlSplitList.indexOf("template") > -1))
            _staticCacheName = "TEMPLATE";
        else if ((_urlSplitList.indexOf("lookup") > -1))
            _staticCacheName = "LOOKUP-2017";
        else if ((_urlSplitList.indexOf("defaults") > -1))
            _staticCacheName = "DEFAULTS-2018";
        else if (_urlSplitList.length > 5)// array length check is require bcoz we are creating _staticCacheName with specif index in _urlSplitList
            _staticCacheName =( _urlSplitList[4] +"-"+ _urlSplitList[1]).toUpperCase();
        else
            _staticCacheName = "OtherStatic"; // we are change version on every release of other static 

        return _staticCacheName;
    };
    
    /*
	 * This method is used to create URL using selected package and state object 
	 */
	var _prepareURLForStatic = function (staticDomain, staticCacheObj) {
        // to store final url 
        var _finalUrl = "";
        // check if all property is exist or not  other wise just return blank url
        if (staticCacheObj.state != undefined && staticCacheObj.year != undefined) {
            _finalUrl = staticDomain + "/" + staticCacheObj.year + "/cacheLists/" + staticCacheObj.state.toLowerCase() + ".json";
        }
        return _finalUrl;
    };
    
    /**
	 * This function will not support deep (inner level) copy
	 */
	var _copyObject = function (srcObject) {
        //Object to return
        var destObject = {};
        //Temporary Mutli array
        var tempMulti = [];
        for (var prop in srcObject) {
            if (srcObject.hasOwnProperty(prop)) {
                var temp = [prop,srcObject[prop]];
                tempMulti.push(temp);
            }
        }
        //Copy each property and value from source to destination
        for (var i = 0; i < tempMulti.length; i++) {
            destObject[tempMulti[i][0]] = tempMulti[i][1];
        }
        //Return new object
        return destObject;
    };
    
	return{
		apiForQueue: _apiForQueue,
		apiForCache: _apiForCache,
		apiForCacheOptions: _apiForCacheOptions,
		excludeAPIFromCache: _excludeAPIFromCache,
		apiOnlineResponseFunctions: _apiOnlineResponseFunctions,
		apiOnlineRequestFunctions: _apiOnlineRequestFunctions,
		setOptions: _setOptions,
		loadJSONFile: _loadJSONFile,
		stripIgnoredUrlParameters:_stripIgnoredUrlParameters,
        cloneObject: _cloneObject,
        getStaticCacheNameUsingURL: _getStaticCacheNameUsingURL,
        prepareURLForStatic: _prepareURLForStatic,
        copyObject: _copyObject
	}
})();