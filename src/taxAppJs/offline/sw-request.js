'use strict'

var swRequest = (function(){

	/**
	 *
	 */
	var _cacheResponse = function(response,_strippedURL,cloneRequest){		
		//clone the response
		var _cloneResponse = response.clone();
		//Store response as json object - Start
		var _responseObj = {};
		//Read all header
		_responseObj.headers = {};
		var _headerKeys = _cloneResponse.headers.keys();
		var _key = '';
		while(_key = _headerKeys.next().value){
			if(_key != undefined){
				_responseObj.headers[_key] = _cloneResponse.headers.get(_key);
			}
		}

		//other details
		_responseObj.type = _cloneResponse.type;	

		//
		var _urlWithoutDomain = _strippedURL.replace(whitelistedSubdomains['api'].domain,'');		

		//Read Body data
		return _cloneResponse.json().then(function(data){
			/*This area is used to run function which requires to execute for every succesful response. 
			  For Example: getting defaultLocation Id from session or any other api from which we get it updated
			*/
			if(_apiOnlineResponseFunctions[_urlWithoutDomain] != undefined && _apiOnlineResponseFunctions[_urlWithoutDomain].functionToExecute != undefined){				
				swFunctions[_apiOnlineResponseFunctions[_urlWithoutDomain].functionToExecute](data);
			}

			/*Caching will start from here*/
			//body data
			_responseObj.body = data;
			
			//
			var _keyForDoc = _strippedURL;			
			
			//If the request is like 'return/open' where same url may have different data based on property in request
			if(_apiForCacheOptions[_urlWithoutDomain]!=undefined && _apiForCacheOptions[_urlWithoutDomain].lookForProperty!=undefined){
				//
				return cloneRequest.json().then(function(bodyData){
					_keyForDoc = _keyForDoc +'_'+bodyData[_apiForCacheOptions[_urlWithoutDomain].lookForProperty];
					//Add to pouchDB
					return db.updateDoc(_keyForDoc,_responseObj).then(function(success){
						return response;
					});
				}).catch(function(error){					
					console.error(error);
					return response;
				});				
			}else{ //set _strippedURL as key
				//Add to pouchDB
				return db.updateDoc(_keyForDoc,_responseObj).then(function(success){
					return response;
				});
			}				
		}).catch(function(error){
			console.error(error);
			return response;
		});
		//End			
	};

	/**
	 * This function will create response from already cached data in db
	 */
	var _responseFromCache = function(_strippedURL,error){
		return db.getDoc(_strippedURL).then(function(data){
			//If there is no cached data return error
			if(data == undefined || data.body == undefined){
				return error;
			}

			//Preparer for Response
			//Body for response
			var _body = JSON.stringify(data.body);

			//Headers
			var _headers = new Headers();
			for(var key in data.headers){
				if(key != 'xsrf-token'){
					_headers.set(key,data.headers[key]);
				}				
			}

			//init
			var _init = {"type":data.type,"url":data.url};
			_init.headers = _headers;

			//creat new request
			var _response = new Response(_body,_init);	

			//append other details
			//_response.type = data.type;				
			
			//return response
			return _response;
		}).catch(function(err){
			//return original error
			return error;
		});
	}

	/**
	 * This method cache fired request and return default response
	 */
	var _queueRequest = function(_cloneRequest,_strippedURL,error){
		console.log('Caching Request');

		//route url
		var _routerURL = _strippedURL.replace(whitelistedSubdomains['api'].domain,'');
        
        //hold new return id 
        var _returnId;
        //only for create return  we are generating guid and adding to response 
        if (_routerURL === "/return/create") {
            _returnId = "R-" + _generateGUID();
            _apiForQueue[_routerURL].response.data = _returnId;
        }
        
        
		//Preparer sample response
        //Body for response
        var _body = JSON.stringify(_apiForQueue[_routerURL].response);

		//Headers
		var _headers = new Headers();
		_headers.set('content-type','application/json; charset=utf-8');

		//init
		var _init = {};
		_init.headers = _headers;

		//creat new response
		var _response = new Response(_body,_init);


		//Qeue request in db and return with default response
		var _requestObj={};		

		//Read header
		_requestObj.headers = {};			
		var _headerKeys = _cloneRequest.headers.keys();
		var _key = '';
		while(_key = _headerKeys.next().value){
			if(_key != undefined){
				_requestObj.headers[_key] = _cloneRequest.headers.get(_key);
			}
		}

		//other details/flags
		_requestObj.otherDetails = {};
		_requestObj.otherDetails.credentials = _cloneRequest.credentials;
		_requestObj.otherDetails.method = _cloneRequest.method;
		_requestObj.otherDetails.mode = _cloneRequest.mode;
		_requestObj.otherDetails.redirect = _cloneRequest.redirect;
		_requestObj.otherDetails.referrer = _cloneRequest.referrer;	

		//For our purpose
		_requestObj.strippedURL = _strippedURL;	
        
		//Read body
		return _cloneRequest.json().then(function(data){
			//body data
            _requestObj.body = data;
            //if request is for new return we are adding return id in queue request 
            if (_routerURL === "/return/create") {
                _requestObj.body = {"returnId":_returnId};
            }
			
			//Add to pouchDB
			var _docKey = _prefixToQueueRequest+'_'+(new Date()).getTime();
			return db.updateDoc(_docKey,_requestObj).then(function(success){
				//Execute configured cleanUp function if any
				return _executeCleanUpFunction(_strippedURL, data).then(function(){
					return _response;
				});				
			});
		}).catch(function(error){
			console.error(error);
			return error;
		});
	};

	/**
	 * 	This code is used to call cleanUp / trailing function for this method (if defined).
	 *	For example, on save request, we have to update cached return & return list as per new content.
	 */
	var _executeCleanUpFunction = function(_strippedURL,data){
		/*  
		 */
		return new Promise(function (resolve,reject){
		 	//entry in configuration
			var _configurationEntry = _apiForQueue[_strippedURL.replace(whitelistedSubdomains['api'].domain,'')];
			//If method is defined in configuration
			if(_configurationEntry.functionToExecute != undefined){
				//If arguments for methods are defined
				if(_configurationEntry.args != undefined){
					//holding data for arguments
					var _argsData = [];
					//loop on every argument configuration and generate data
					for(var i in _configurationEntry.args){							
						_argsData[i] = data;
						for(var j in _configurationEntry.args[i]){
							_argsData[i] = _argsData[i][_configurationEntry.args[i][j]];
						}
					}						

					//call functon with argument
					return swFunctions[_configurationEntry.functionToExecute](_argsData[0],_argsData[1],_argsData[2]).then(function(){
						resolve();
					});
				}else{//No argument
					return swFunctions[_configurationEntry.functionToExecute]().then(function(){
						resolve();
					});
				}					
			}else{//No method
				resolve();
			}
	 	});	 	
	};

	/**
	 * XMLHttpRequest wrapper that returns a promise
	 * @param 
	 */
	var _xhrPromise = function(url, headersData, bodyData, otherDetails, isCachingRequired, cacheURL){
		return new Promise(function(resolve,reject){
			//init
			var _init = {};

			//Headers
			var _headers = new Headers();
			for(var property in headersData){
				_headers.set(property,headersData[property]);
			}
			//attach xsrf-token			
			_headers.set('X-XSRF-TOKEN',_xsrfToken);			
			_init.headers = _headers;

			//Body
			_init.body = JSON.stringify(bodyData);

			//other details
			for(var property in otherDetails){
				_init[property] = otherDetails[property];
			}			

			//create object for Request
			var _request = new Request(url,_init);

			//cloned request
			var _cloneRequest = _request.clone();

			//Fetch Request
			fetch(_request,_init).then(function(response){
				//check if response contains xsrf-token
				if(response.headers.get('XSRF-TOKEN') != undefined && response.headers.get('XSRF-TOKEN') != null){
					_xsrfToken = response.headers.get('XSRF-TOKEN');
					//Update new XSRF-TOKEN in client code (localstorage)
					_sendMessageToClient('setXSRFToken',{'xsrfToken':_xsrfToken});
				}
				//If response has error reject it
				if(response.status < 400){
					//If caching is required then send it for caching
					if(isCachingRequired){
						//stripped url
						var _strippedURL = '';
						//If data needs to be cached as different url then used in request
						if(cacheURL!=undefined && cacheURL!=''){
							_strippedURL = utils.stripIgnoredUrlParameters(cacheURL,ignoreUrlParametersMatching);	
						}else{
							_strippedURL = utils.stripIgnoredUrlParameters(_request.url.toString(),ignoreUrlParametersMatching);	
						}
						
						_cacheResponse(response,_strippedURL,_cloneRequest).then(function(){
							resolve(response);
						}).catch(function(){
							resolve(response);
						});
					}else{//No
						resolve(response);
					}					
				}else{
					reject(Error(url + ' failed with status ' + response.status));					
				}
			}).catch(function(error){
				reject(error);
			});			
		});
	};

	/**
	 *
	 */
	var _processQueuedRequest = function(docId){
		return new Promise(function(resolve,reject){
			db.getDoc(docId).then(function(data){
				//Temporary , need to write common function in util which append this query parameter
				var _url = data.strippedURL+'?TS='+((new Date()).getTime());
				_xhrPromise(_url, data.headers, data.body, data.otherDetails).then(function(){					
					db.deleteDoc(docId).then(function(){
						console.info('Processed pending request: '+_url);
					});
					//
					resolve();
				},function(error){
					console.log('Request for '+_url+' is failed');
					console.error(error);
					reject(error);
				});
			}).catch(function(error){
				console.log('Unable to proccess '+docId);
				console.error(error);
				reject(error);
			});
		});		
	};

	/**
	 *
	 */
	var _processPendingRequestQueue = function(docIds,completedList,failedList,callback){
		if(docIds.length>0){//
			//
			var _docId = docIds.shift();
			//
			_processQueuedRequest(_docId).then(function(){
				//
				completedList.push(_docId);
				//
				_processPendingRequestQueue(docIds,completedList,failedList,callback);
			}).catch(function(){
				//
				failedList.push(_docId);
				//
				_processPendingRequestQueue(docIds,completedList,failedList,callback);
			});
		}else{//
			callback(undefined,completedList,failedList);
		}
	};
    
    var _generateGUID = function () {
        var d = new Date().getTime();
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return guid;
    };

	/**
	 *
	 */
	var _callAPI = function(url,bodyData,cacheURL){
		//
		return new Promise(function(resolve,reject){
			//Headers
			var _headersData = {};
			_headersData['origin'] = whitelistedSubdomains['app'].domain;
			_headersData['x-xsrf-token'] = _xsrfToken;
			_headersData['x-location'] = _defaultLocationId;
			_headersData['content-type'] = 'application/json;charset=UTF-8';
			_headersData['accept'] = 'application/json, text/plain, */*';
			_headersData['x-appid'] = _resellerId;
			_headersData['x-taxyear'] = _taxYear;

			var _otherDetails = {};
			_otherDetails['credentials'] = 'include';
			_otherDetails['method'] = 'POST';
			_otherDetails['mode'] = 'cors';
			_otherDetails['redirect'] = 'follow';
			_otherDetails['referrer'] = whitelistedSubdomains['app'].domain+'/';

			_xhrPromise(url,_headersData,bodyData,_otherDetails, true, cacheURL).then(function(response){
				//parse response
				if(response ){
					resolve();
				}else{
					reject('There is no data in response');
				}				
			}).catch(function(error){
				reject(error);
			});
		});		
	};

	return{
		cacheResponse : _cacheResponse,
		queueRequest : _queueRequest,
		responseFromCache : _responseFromCache,
		processPendingRequestQueue : _processPendingRequestQueue,
		executeCleanUpFunction : _executeCleanUpFunction,
		callAPI : _callAPI
	}
})();