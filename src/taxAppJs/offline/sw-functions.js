'use strict'

var swFunctions = (function(){

	/*
	 * 
	 */
	var _saveReturnQueueFunction= function(returnData,returnId,saveCommand){
        return new Promise(function (resolve, reject){
                //Step 1: Update return
                //docId of cached return
                var _returnRequestDocId = whitelistedSubdomains['api'].domain + '/return/open_' + returnId;
                db.getDoc(_returnRequestDocId).then(function (docData) {
                    //Return Data
                    var _cahcedReturnData = docData.body.data;
                    //check if it has draft data
                    if (_cahcedReturnData.draft != undefined) {
                        //chaeck if it is draft request
                        if (saveCommand == 'DRAFT_RETURN') {
                            _cahcedReturnData.draft = returnData;
                        } else
                        {
                            //Normal save
                            _cahcedReturnData = returnData;
                        }
                    } else
                    {
                        //No draft object
                        //chaeck if it is draft request
                        if (saveCommand == 'DRAFT_RETURN') {
                            //copy existing data to latest part and new for draft
                            var _tempObject = _cahcedReturnData;
                            _cahcedReturnData = {};
                            _cahcedReturnData.latest = _tempObject;
                            _cahcedReturnData.draft = returnData;
                        } else {
                            _cahcedReturnData = returnData;
                        }
                    }
                    
                    //data
                    docData.body.data = _cahcedReturnData;
                    
                    //update cached return data
                    db.updateDoc(_returnRequestDocId, docData).then(function () {
                        //Step 2: Update return List
                        _updateReturnList(returnId, _cahcedReturnData, undefined).then(function (success) {
                            resolve();
                        }, function (error) {
                            console.error(error);
                            reject();
                        });
                    });
                }, function (error) {
                    //if return is not find in cache then we are creating new return 
                    var newReturnData = {
                        "body": {
                            "code": 2000,
                            "messageKey": "",
                            "data": returnData
                        }
                    };
                    //step 1 : (cache return as open)
                    //note : db.updatedoc will create new entry if not exist else update 
                    db.updateDoc(_returnRequestDocId, newReturnData).then(function () {
                        //add newly created return in return list 
                        _addToReturnList(returnId, returnData, undefined).then(function (success) {
                            resolve();
                        }, function (error) {
                            console.error(error);
                            reject();

                        });
                    });
                }).catch(function (error) {
                    console.info('Error while runing cleanup function for save request.');
                    console.error(error);
                    reject();
                });
		});
    };
    
    //this function will open return list from pouch db and update status using return id and then save into pouchdb
    var _changeReturnStatusQueueFunction = function (returnId,status) {
        return new Promise(function (resolve, reject) {
            var _returnRequestDocId = whitelistedSubdomains['api'].domain + '/return/open_' + returnId;
            // try to open return in couch bae if user not open even or not cached then we have to excute code in error 
            db.getDoc(_returnRequestDocId).then(function (docData) {
                if (docData != undefined && docData.body != undefined && docData.body.data != undefined) {
                    //Return Data
                    var _cahcedReturnData = docData.body.data;
                    //check if it has draft data then update status in draft else update status directly
                    if (_cahcedReturnData.draft != undefined) {
                        _cahcedReturnData.draft.header.status = { id: status.id, title: status.title };
                        _cahcedReturnData.latest.header.status = { id: status.id, title: status.title };
                    } else {
                        _cahcedReturnData.header.status = { id: status.id, title: status.title };
                    }
                    //data
                    // after update status in local variable assign to main data 
                    docData.body.data = _cahcedReturnData;
                    // update return data with new status in pouch db 
                    db.updateDoc(_returnRequestDocId, docData).then(function () {
                        //after success call for update return list with return data with no custom data as we are alredy  have data in header 
                        _updateReturnList(returnId, _cahcedReturnData, undefined).then(function (success) {
                            resolve();
                        }, function (error) {
                            console.error(error);
                            reject();
                        });
                    });
                }
            }, function (error) {
                   //if return is not 
                  var _customData = { "status": { id: status.id, title: status.title } };
                  _updateReturnList(returnId, undefined, _customData).then(function (success) {
                      resolve();
                  }, function (error) {
                      console.error(error);
                      reject();
                  });
            });	
        });
    };
    
    //this function will update return list as second or third argument are may  be undefined 
    var _updateReturnList = function (returnId,returnData,customData) {
        return new Promise(function (resolve, reject) {
            //docId of returnList cached data
            var _returnListRequestDocId = whitelistedSubdomains['api'].domain + '/return/list';
            //open return list from pouchdb 
            db.getDoc(_returnListRequestDocId).then(function (docData) {
                //
                if (docData != undefined && docData.body != undefined && docData.body.data != undefined) {
                    //get current return with return id from return list 
                    var _itemIndex = _.findIndex(docData.body.data, { id: returnId });
                    if (_itemIndex > -1) {
                        //if return data is passed then update current return with return data header or update with custom data 
                        if (returnData != undefined) {
                            // to hold header of return data if draft the from latest else directly 
                            var _header;
                            if (returnData.draft != undefined) 
                                _header = returnData.latest.header;
                            else
                                _header = returnData.header;
                            
                            //special condition for return data as efilestatus is not part of returndata 
                            if (docData.body.data[_itemIndex].eFileStatus != undefined) {
                                _header.eFileStatus = docData.body.data[_itemIndex].eFileStatus;
                            }
                            //
                            _header.updatedDate = new Date();
                            //
                            docData.body.data[_itemIndex] = _header;
                        }
                        else {
                            // Recursively merges own enumerable properties of the source object(s), that don’t resolve to undefined into the destination object. Subsequent sources overwrite property assignments of previous sources
                            _.merge(docData.body.data[_itemIndex], customData);
                        }
                        //after modifying doc data  just update doc data in pouch db 
                        db.updateDoc(_returnListRequestDocId, docData).then(function () {
                            //resolve after updating return list 
                            resolve();
                        });
                    }
                    else {
                        resolve();
                    }
                }
                else {
                    resolve();
                }
            }).catch(function (error) {
                console.info('Error while runing cleanup function for Update Return List.');
                console.error(error);
                reject();
            });
        });	
    };

    /* Functions which needs to be run on respective response*/
    //This function is used to grab defaultLocationId from session call
    var _sessionResponseEvaluation = function (data){    	
    	//If data is not undefined
		if(data){
			//This session response has user data
			if(data != undefined && data.data!=undefined && data.data.email != undefined && data.data.email != ''){
				//grab default location id
				if(data.data.settings != undefined && data.data.settings.defaultLocationId != undefined){
					_defaultLocationId = data.data.settings.defaultLocationId;
					//
					_isReturnPreCacheChecked = false;
				}
			}
		}    
    }
    
    //this function will add new return in  returnlist 
    var _addToReturnList = function (returnId, returnData) {
        return new Promise(function (resolve, reject) {
            //docId of returnList cached data
            var _returnListRequestDocId = whitelistedSubdomains['api'].domain + '/return/list';
            //open return list from pouchdb 
            db.getDoc(_returnListRequestDocId).then(function (docData) {
                if (docData != undefined && docData.body != undefined && docData.body.data != undefined) {
                    if (returnData != undefined) {
                        // to hold header of return data if draft the from latest else directly 
                        var _header;
                        if (returnData.draft != undefined)
                            _header = returnData.latest.header;
                        else
                            _header = returnData.header;
                        //
                        //
                        _header.updatedDate = new Date();
                        docData.body.data.push(_header);
                    }
                }
                //after modifying doc data  just update doc data in pouch db 
                db.updateDoc(_returnListRequestDocId, docData).then(function () {
                    //resolve after updating return list 
                    resolve();
                });
            }).catch(function (error) {
                console.info('Error while runing cleanup function for add return in list.');
                console.error(error);
                reject();
            });
        });
    };

    //
    var _returnListResponseEvaluation = function (data){
    	setTimeout(function(){
    		//check if returnList check has beeen done for this session
	    	if(_isReturnPreCacheChecked == false){
	    		//
	    		if(data!=undefined && data.data!=undefined){    			
	    			//	    			
	    			var _returnIds = _.pluck(_.sortBy(data.data, 'updatedDate').reverse(),'id');
	    			//
	    			_isReturnPreCacheChecked = true;
	    			//
	    			db.getDoc('alreadyCachedReturnIds_doc').then(function(docData){
	    				//
	    				var _remainingReturnIds = _.xor(_returnIds,_.intersection(_returnIds,docData.returnIds));
	    				if(_remainingReturnIds.length>0){
	    					//
	    					_cacheReturnIds(_remainingReturnIds,[],[],function(error,successList,failedList){
			    				//
			    				if(error){
			    					_isReturnPreCacheChecked = false;
			    				}

			    				//
			    				if(failedList.length>0){
			    					console.info('These returns falied: '+failedList.toString())
			    				}

			    				//
			    				if(successList.length>0){
			    					docData.returnIds = _.union(docData.returnIds,successList);
			    					//
			    					db.updateDoc('alreadyCachedReturnIds_doc',docData);
			    				}		    				

			    			});
	    				}
	    			},function(error){
	    				//
						_cacheReturnIds(_returnIds,[],[],function(error,successList,failedList){
		    				//
		    				if(error){
		    					_isReturnPreCacheChecked = false;
		    				}

		    				//
		    				if(failedList.length>0){
		    					console.info('These returns falied: '+failedList.toString())
		    				}

		    				//
		    				if(successList.length>0){
		    					var docData = {};
		    					docData.returnIds = successList;
		    					//
		    					db.updateDoc('alreadyCachedReturnIds_doc',docData);
		    				}
		    			});

	    			});
	    			
	    			
	    		}
	    	}
    	},5000);    	
    };

    //
    var _cacheReturnIds = function(returnIds,successList,failedList,callback){
    	if(returnIds.length>0){
    		//
    		var _returnId = returnIds.shift();
    		//
    		var _url = whitelistedSubdomains['api'].domain+"/return/get?TS="+((new Date()).getTime());
    		var _cacheURL = whitelistedSubdomains['api'].domain+"/return/open?TS="+((new Date()).getTime());

    		var _body = {"returnId":_returnId,"dataSource":"checkDraft"};

    		//
    		swRequest.callAPI(_url,_body,_cacheURL).then(function(){
    			//
    			successList.push(_returnId);
    			//
    			setTimeout(function(){
    				_cacheReturnIds(returnIds,successList,failedList,callback);
    			},_returnPreCachingDealy);    			
    		}).catch(function(error){
    			console.info('Error while precaching return : '+_returnId);
    			console.error(error);
    			//
    			failedList.push(_returnId);
    			if(error!=undefined && error.message=='Failed to fetch'){
    				//
    				callback(error,successList,failedList);
    			}else{    				
	    			//
	    			setTimeout(function(){
	    				_cacheReturnIds(returnIds,successList,failedList,callback);
	    			},_returnPreCachingDealy);
    			}    			
    		});
    	}else{
    		callback(undefined,successList,failedList);
    	}
    };

    /*Response functions - END*/

    /*Functions needs to be run on respective Requests*/
    // This function will be executed when serviceWorker recieve change defaultLocation request.
    //As we have to update _defaultLocationId due to this
    var _changeDefaultLocationRequestEvaluation = function(request){
    	//make it async as it involves parsing request
    	return new Promise(function (resolve,reject){
    		//clone passed request object
    		var _cloneRequest = request.clone();
    		//parse request body
    		_cloneRequest.json().then(function(bodyData){
    			//set defaultLocation
    			if(bodyData!=undefined && bodyData.locationId!=undefined){
                    _defaultLocationId = bodyData.locationId;
                    //on default location change is return is already cached as false 
                    _isReturnPreCacheChecked = false;
    			}
    			resolve();
    		}).catch(function(error){
    			console.info('Error in changeDefaultLocationRequestEvaluation function');
    			console.error(error);
    			resolve();
    		});
    	});
    	
    };
    /*Request functions - END*/    

    

	return{
        saveReturnQueueFunction: _saveReturnQueueFunction,
        changeReturnStatusQueueFunction:_changeReturnStatusQueueFunction,
        sessionResponseEvaluation:_sessionResponseEvaluation,
        changeDefaultLocationRequestEvaluation: _changeDefaultLocationRequestEvaluation,
        returnListResponseEvaluation: _returnListResponseEvaluation
	};
})();