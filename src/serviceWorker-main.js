//version 1.24


//@exclude
//DO_NOT_REMOVE ABOVE LINE

//Import lodash
importScripts('taxAppJs/lib/lodash.js');
// This polyfill provides Cache.add(), Cache.addAll(), and CacheStorage.match(),
// which are not implemented in Chrome 40 and others.
importScripts('taxAppJs/offline/lib/serviceworker-cache-polyfill.js');
//sw-toolbox
importScripts('taxAppJs/offline/lib/sw-toolbox/sw-toolbox.js');
//Import pouch db
importScripts('taxAppJs/offline/lib/pouchDB/pouchdb.min.js');
//utility functions
importScripts('taxAppJs/offline/sw-util.js');
//DB util
importScripts('taxAppJs/offline/sw-db.js');
//Request
importScripts('taxAppJs/offline/sw-request.js');
//
importScripts('taxAppJs/offline/sw-functions.js');
//DO_NOT_REMOVE BELOW LINE
//@endexclude

/* @if NODE_ENV='production' || NODE_ENV='test' **
importScripts('taxAppJs/dist/offline-lib-import.js');
importScripts('taxAppJs/dist/offline-src-import.js');
/* @endif */

//cache lists
var cacheList = {
};

//parameters that needs to be removed from post request url
var ignoreUrlParametersMatching = [/^TS/];

var _apiForCache = utils.apiForCache;
var _apiForQueue = utils.apiForQueue;
var _apiForCacheOptions = utils.apiForCacheOptions;
var _excludeAPIFromCache = utils.excludeAPIFromCache;
var _apiOnlineResponseFunctions = utils.apiOnlineResponseFunctions;
var _apiOnlineRequestFunctions = utils.apiOnlineRequestFunctions;

//
var _xsrfToken = '';

//hold default location id
var _defaultLocationId = '';

//Reseller Id
//note: Infuture this needs to be set dynamically based on domain.
var _resellerId = "RE-4dc601df-dc0e-4a7a-857d-9493ba33a223"

//TODO: Changes to make new tax year live
//Tax year
var _taxYear = "2018";

//This flag will help us to start precaching of returns inside return list
var _isReturnPreCacheChecked = true;

//
var _prefixToQueueRequest = 'queue_request_';

//to hold deleted static cachelist
var _deletedStaticCacheList = [];

//Delay in next return precache from return list.
var _returnPreCachingDealy = 100;


//to hold waiting time after one sloat is cache (time in milisec)
var _timeOutAfterEvereySloat = 100;

//to hold size item per sloat for static
var _itemsPerSloatForStatic = 15;

//to hold size item per sloat for app
var _itemsPerSloatForApp = 75;

//Flag wil be true if app precaching is in process
var _isAppCacheRunning = false;

//Flag will be true if downloading of cacheList will be in process
var _isDownloadCacheListCalled = false;

//set debug true
toolbox.options.debug = false;

/**
 * This function will delete old cache files and for app, it will pre cache again if new version will be found.
 */
var _deleteOldCache = function () {
    return new Promise(function (resolve, reject) {
        // Delete all caches that aren't named in cacheList.
        var expectedCacheNames = Object.keys(cacheList).map(function (cacheKey) {
            return cacheList[cacheKey].key;
        });
        caches.keys().then(function (cacheNames) {
            Promise.all(
                //-- Start
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) == -1 && cacheName.indexOf('$') == -1 && _isAppCacheRunning == false) {
                        //If app updates availbale, we will not check for other static states.
                        //This is done to make these updates in sync
                        if (cacheName.indexOf('app-v') != -1) {
                            console.log('Delete out of date cache: ', cacheName);
                            //Delete app cache
                            caches.delete(cacheName);
                            //send Message to new client that precahe is started
                            _executeWhenClientConnected(function () {
                                _sendMessageToClient('staticVersionUpdatingStart', {});
                            });
                            //pre cache app files again
                            preCacheFiles('app', '/taxAppJs/offline/cacheList.json').then(function () {
                                //send message to client that precaching is finished
                                _executeWhenClientConnected(function () {
                                    _sendMessageToClient('staticVersionUpdatingFinish', {});
                                    _sendMessageToClient('appVersionUpdated', {}); //send Message to new client when it is connected
                                });

                            });
                        } else {
                            console.log('Delete out of date cache: ', cacheName);
                            if (cacheName.indexOf('api-v') != -1) {
                                caches.delete(cacheName);
                            }
                            else {
                                //if deleted cachename is not in app or api then we condsider as static
                                caches.delete(cacheName);
                                //after deleting cache we are adding static cachename in array  so we can re-cache with new version
                                _deletedStaticCacheList.push(cacheName);
                            }
                        }
                    }
                })
                //-- End
            ).then(function () {
                resolve();
            });
        });
    });
};


/**
 * This function will download cacheList and update local variable as well as in pouchdb
 */
var _downloadCacheList = function () {
    return new Promise(function (resolve, reject) {
        console.log('Download CacheList Called');
        //check if flag is true (means download already in process), Do not download again.
        //This will only happen when serviceworker update is available and user session already runing
        if (_isDownloadCacheListCalled == true) {
            console.log('Downloading of cachelist is already in process');
            resolve();
        } else {
            //Make the falg true
            _isDownloadCacheListCalled = true;
            console.log('Download cachelist from network');

            //load cache list from json
            utils.loadJSONFile(whitelistedSubdomains['static'].domain + '/cacheVersions.json').then(function (response) {
                //if it is proper save it in db
                if (response != undefined && response.cacheList != undefined) {
                    //update cacheList
                    if (cacheList != undefined && Object.keys(cacheList).length > 0) {
                        for (var key in response.cacheList) {
                            if (response.cacheList.hasOwnProperty(key)) {
                                if (cacheList[key] != undefined && cacheList[key].preCache != undefined && cacheList[key].preCache === true)
                                    response.cacheList[key].preCache = true;
                            }
                        }
                    }
                    cacheList = response.cacheList;
                    db.updateDoc('cacheList', utils.cloneObject(cacheList)).then(function (response) { });
                    _isDownloadCacheListCalled = false;
                    resolve();
                    //getting old cache list from pouch db so we can set precache true false in new version file

                } else {
                    //make the flag false
                    _isDownloadCacheListCalled = false;
                    //reject promise
                    reject('cacheList is undefined');
                }
            }).catch(function (error) {
                //make the flag false
                _isDownloadCacheListCalled = false;
                console.log('Something goes wrong in downloading cacheList');
                console.error(error);
                //reject promise
                reject(error);
            });
        }
    });
};

/**
 * This function will analyze already downloaded cache list.
 * It will check for updates for app and static states. Delete theme and precache again.
 */
var _analyzeCacheList = function () {
    return new Promise(function (resolve, reject) {
        //call delete old cahe
        _deleteOldCache().then(function (success) {
            //after delete success we are precaching for static if there is any old version  is deleted in static
            if (_deletedStaticCacheList != undefined && _deletedStaticCacheList.length > 0) {
                //send Message to client that precahe is started
                _executeWhenClientConnected(function () {
                    _sendMessageToClient('staticVersionUpdatingStart', {});
                });
                // before starting precache deleted static files make precache as in process
                //make all process state as in process
                for (var index in _deletedStaticCacheList) {
                    var _splitStaticCacheName = _deletedStaticCacheList[index].split('-');
                    var _cacheName = (_splitStaticCacheName[0] + "-" + _splitStaticCacheName[1]).toUpperCase();// creating cacheName using year and state
                    if (cacheList[_cacheName].preCache === true)
                        cacheList[_cacheName].preCacheInProcess = true;
                }
                _executeWhenClientConnected(function () {
                    _sendMessageToClient('getCacheListAndUpdateStatus', {});
                });
                preCacheStaticFiles(_deletedStaticCacheList, function (statesList) {
                    //send message to client that precaching finished
                    _executeWhenClientConnected(function () {
                        _sendMessageToClient('staticVersionUpdatingFinish', {});
                    });
                    _executeWhenClientConnected(function () {
                        _sendMessageToClient('getCacheListAndUpdateStatus', {});
                    });
                    //return
                    resolve();
                }, function (error) {
                    //send message to client that precaching finished
                    _executeWhenClientConnected(function () {
                        _sendMessageToClient('staticVersionUpdatingFinish', {});
                    });
                    _executeWhenClientConnected(function () {
                        _sendMessageToClient('getCacheListAndUpdateStatus', {});
                    });
                    //return
                    resolve();
                });
            } else if (_isAppCacheRunning == true) {
                //App precaching is in process, do not return
            } else {
                //As nothing to precache, just return
                resolve();
            }
        }).catch(function (error) {
            console.error(error);
            resolve();
        });
    });
};



/**
 *precaching static file on version change
 */
var preCacheStaticFiles = function (deletedStaticCacheList, callback) {
    if (deletedStaticCacheList.length == 0) {
        callback();
    }
    else {
        var _deletedCacheName = deletedStaticCacheList.shift();
        // process that object
        //pre cache static files again
        var _splitStaticCacheName = _deletedCacheName.split('-');
        var _staticCacheObj = { "year": _splitStaticCacheName[1], "state": _splitStaticCacheName[0] };
        var _cacheURL = utils.prepareURLForStatic(whitelistedSubdomains['static'].domain, _staticCacheObj); // preparing url using year and state
        var _cacheName = (_staticCacheObj.state + "-" + _staticCacheObj.year).toUpperCase();// creating cacheName using year and state
        // precache only for success status
        if (cacheList[_cacheName] != undefined && cacheList[_cacheName].preCache != undefined && cacheList[_cacheName].preCache === true) {
            //cache file using URL and Cache name
            preCacheFiles(_cacheName, _cacheURL).then(function (response) {
                cacheList[_cacheName].preCacheInProcess = false;
                //calling recursion function
                preCacheStaticFiles(deletedStaticCacheList, callback);

            }).catch(function (error) {
                cacheList[_cacheName].preCacheInProcess = false;
                //calling recursion function
                preCacheStaticFiles(deletedStaticCacheList, callback);
            });
        }
    }
};

/**
 * load cacheList from db
 * It will first check local variable then pouch db and in last will download from network.
 */
var _getCacheList = function () {
    //promise
    return new Promise(function (resolve, reject) {
        if (Object.keys(cacheList).length > 0) {
            //
            resolve();
        } else {
            console.log('Getting from db');
            //get from poucDB
            db.getDoc('cacheList').then(function (data) {
                //check if not undefined
                if (data != undefined) {
                    //available cacheList
                    cacheList = utils.cloneObject(data);
                    //return
                    resolve();
                } else {
                    //Download from network
                    _downloadCacheList().then(function () {
                        resolve();
                    }).catch(function () {
                        reject();
                    });
                }
            }).catch(function () {
                //Download from network
                _downloadCacheList().then(function () {
                    resolve();
                }).catch(function () {
                    reject();
                });
            });
        }
    });

};


/**
 * This Function will precache file in sloat
 * after every sloat sleep for some second
 * */
var _preCacheInSlot = function (dataList, itemsPerSloat, cacheKey, callback, errorCallback) {
    if (dataList.length == 0) {
        callback();
    } else {
        var sloatListForCache;
        if (dataList.length <= itemsPerSloat)
            sloatListForCache = dataList.splice(0, dataList.length);
        else
            sloatListForCache = dataList.splice(0, itemsPerSloat);

        caches.open(cacheList[cacheKey].key).then(function (cache) {
            cache.addAll(sloatListForCache).then(function () {
                setTimeout(function () {
                    _preCacheInSlot(dataList, itemsPerSloat, cacheKey, callback, errorCallback);
                }, _timeOutAfterEvereySloat);
            }, function (error) {
                console.error(error);
                errorCallback();
            });
        });

    }

};
/**
 * This function will precache list of files an add them to given cacheName
 */
var preCacheFiles = function (cacheKey, path) {
    //make app cache running if cachekey is app
    if (cacheKey === 'app') {
        _isAppCacheRunning = true;
    }
    //promise
    return new Promise(function (resolve, reject) {
        //console.log('Request to precahce for '+cacheKey);
        //load files from external json
        utils.loadJSONFile(path).then(function (data) {
            //check if list is defined
            if (data != undefined && data.list != undefined) {
                //
                var _domainModule = whitelistedSubdomains[cacheKey] == undefined ? 'static' : cacheKey;
                //
                for (var i in data.list) {
                    data.list[i] = whitelistedSubdomains[_domainModule].domain + data.list[i];
                }
                //cache file in sloat
                //set item  per sloat
                var _itemPerSloat = (cacheKey === 'app' ? _itemsPerSloatForApp : _itemsPerSloatForStatic);
                _preCacheInSlot(data.list, _itemPerSloat, cacheKey, function () {
                    if (cacheKey === 'app') {
                        _isAppCacheRunning = false;//make false on success
                    }
                    cacheList[cacheKey].preCache = true;
                    resolve();
                }, function (error) {
                    if (cacheKey === 'app') {
                        _isAppCacheRunning = false;//make false on error
                    }
                    cacheList[cacheKey].preCache = false;
                    console.error(error);
                    reject();
                });
            }
        }, function (error) {
            if (cacheKey === 'app') {
                _isAppCacheRunning = false;//make false on success
            }
            console.error(error);
            reject();
        });
    });
};

/**
 * Handler that will be called when app url will be accessed.
 * One kind of 'fetch' event implementation
 */
var appRequestHandler = function (request, values, options) {
    //console.info('Request for caching app file');
    //check if cache list is available. If not then load it first
    if (Object.keys(cacheList).length > 0) {
        //set cache name
        options = utils.setOptions(options, cacheList['app'].key);
        //
        return toolbox.cacheFirst(request, values, options).catch(function () {
            //Here we will require fallback code incase we do not have cache copy and internet is also not working
        });
    } else {
        //load cache list
        _getCacheList().then(function () {
            //set cache name
            options = utils.setOptions(options, cacheList['app'].key);
            //
            return toolbox.cacheFirst(request, values, options).catch(function () {
                //Here we will require fallback code incase we do not have cache copy and internet is also not working
            });
        }).catch(function (error) {
            console.error(error);
        });
    }
};

/**
 * Handler that will be called when static url will be accessed.
 * One kind of 'fetch' event implementation.
 */
var staticRequestHandler = function (request, values, options) {
    //console.info('Request for caching static file');
    //check if cache list is available. If not then load it first
    if (Object.keys(cacheList).length > 0) {
        //cacheName to be used
        var _cacheName;
        if (cacheList[utils.getStaticCacheNameUsingURL(request.url)] != undefined)
            _cacheName = cacheList[utils.getStaticCacheNameUsingURL(request.url)].key;

        _cacheName = _cacheName == undefined ? cacheList['OtherStatic'].key : _cacheName;


        //
        return caches.open(_cacheName).then(function (cache) {
            //check if request is already cached
            return cache.match(request).then(function (response) {
                //If cached then return
                if (response) {
                    return response;
                }
                //clone request
                var _cloneRequest = request.clone();
                //make network call
                return fetch(_cloneRequest).then(function (response) {
                    // Check if we received a valid response
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    //clone response
                    var _cloneResponse = response.clone();
                    //cache the request
                    cache.put(request, _cloneResponse);
                    //return response
                    return response;
                });
            }).catch(function (error) {
                console.log('Error in static caching');
                console.error(error);
            });
        });

    }
};

/**
 * This mthod is responsible to execute logic for api requests
 */
var apiRequestHandler = function (request, values, options) {
    //console.info('Request for API Type: '+request.method' and url: '+request.url);
    console.info('Request for POST : ' + request.url);
    //remove timestamp from url to use as key for caching
    var _strippedURL = utils.stripIgnoredUrlParameters(request.url.toString(), ignoreUrlParametersMatching);

    //
    var _urlWithoutDomain = _strippedURL.replace(whitelistedSubdomains['api'].domain, '');

    //cloning request
    var _cloneRequest = request.clone();

    //Network Frist
    return fetch(request).then(function (response) {
        //
        _xsrfToken = response.headers.get('xsrf-token');
        //Is it valid response ?
        if (response == undefined || response.status !== 200) {
            return response;
        }

        //If request has any locationId in header it must be default or else do, not process response for cache purpose
        if (_defaultLocationId == undefined || _defaultLocationId == '' || _cloneRequest.headers.get('X-Location') == null ||
            (_cloneRequest.headers.get('X-Location') != null && _cloneRequest.headers.get('X-Location') == _defaultLocationId)) {
            //Identify request for which we have to run some function
            //For example change defaultLocation api
            if (_apiOnlineRequestFunctions[_urlWithoutDomain] != undefined) {
                swFunctions[_apiOnlineRequestFunctions[_urlWithoutDomain].functionToExecute](_cloneRequest);
            }

            //If there is any cleanUp function configured for api request. Then we should run it.
            if (_apiForQueue[_strippedURL.replace(whitelistedSubdomains['api'].domain, '')] != undefined
                && _apiForQueue[_strippedURL.replace(whitelistedSubdomains['api'].domain, '')].functionToExecute != undefined) {
                //created another cloned request to read body
                var _anotherCloneRequest = _cloneRequest.clone();
                //Read body
                _anotherCloneRequest.json().then(function (requestData) {
                    //call cleanup function
                    swRequest.executeCleanUpFunction(_strippedURL, requestData);
                });
            }

            //If request type is 'GET' or It is belongs to list of POST requests for which caching is enabled
            if ((request.method == 'GET' || _apiForCache.indexOf(_urlWithoutDomain) != -1)
                && _excludeAPIFromCache.indexOf(_urlWithoutDomain) < 0) {
                return swRequest.cacheResponse(response, _strippedURL, _cloneRequest);
            } else {
                //
                return response;
            }
        } else {
            return response;
        }
    }, function (error) {
        if ((request.method == 'GET' || _apiForCache.indexOf(_urlWithoutDomain) != -1)
            && _excludeAPIFromCache.indexOf(_urlWithoutDomain) < 0) {

            //If the request is like 'return/open' where same url may have different data based on property in request
            if (_apiForCacheOptions[_urlWithoutDomain] != undefined && _apiForCacheOptions[_urlWithoutDomain].lookForProperty != undefined) {
                return _cloneRequest.json().then(function (bodyData) {
                    //Return from cache
                    return swRequest.responseFromCache(_strippedURL + '_' + bodyData[_apiForCacheOptions[_urlWithoutDomain].lookForProperty], error);
                }).catch(function () {
                    return error
                });
            } else {
                //Return from cache
                return swRequest.responseFromCache(_strippedURL);
            }
        } else if (_apiForQueue[_strippedURL.replace(whitelistedSubdomains['api'].domain, '')] != undefined) {
            //cache the request to sync later and return with dummy response.
            return swRequest.queueRequest(_cloneRequest, _strippedURL, error);
        } else {
            return error;
        }
    });
};

//Register handler for app
toolbox.router.get('/(.*)', appRequestHandler, { origin: whitelistedSubdomains['app'].domain });

//Register handler for static
toolbox.router.get('/(.*)', staticRequestHandler, { origin: whitelistedSubdomains['static'].domain });

//Register handler for api GET request
toolbox.router.get('/(.*)', apiRequestHandler, { origin: whitelistedSubdomains['api'].domain });

//Register handler for api POST request
toolbox.router.post('/(.*)', apiRequestHandler, { origin: whitelistedSubdomains['api'].domain });

/**
 * This function will called whenever user become online.
 */
var _switchToOnline = function () {
    var _queryOptions = {};
    _queryOptions.startkey = _prefixToQueueRequest;

    //query on db
    db.query(_queryOptions).then(function (docIdsList) {
        //
        swRequest.processPendingRequestQueue(docIdsList, [], [], function (error, completedList, failedList) {
            //
            if (error) {
                console.log('Error in processing queue');
                console.error(error);
            } else {
                //
                if (failedList.length > 0) {
                    console.log('Below Listed apis failed');
                    for (var index in failedList) {
                        console.error(Error('Failed: ' + failedList[index]));
                    }
                }
                //
                if (completedList.length > 0) {
                    console.info('Queue Processed -----------------------------------------------------------');
                }
            }
        });
    });
}

/**
 *
 */
var _executeWhenClientConnected = function (callback) {
    self.clients.matchAll().then(function (clients) {
        if (clients.length > 0) {
            callback();
        } else {
            console.info('Client Not Found, retry after 100 ms');
            setTimeout(function () {
                _executeWhenClientConnected(callback);
            }, 100);
        }
    });
};

//
var _sendMessageToClient = function (command, data) {
    self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            client.postMessage({ 'command': command, 'data': data });
        })
    });
};

/**
 * this function is recursion we are calling add file for every object
 * note: third argument is callback as we are calling function itself and we have to wait after response
 */
var _cacheStates = function (statesList, result, callback) {
    // final response is result what we are creating in this function using recursion
    if (statesList.length == 0) {
        callback(result);
    }
    else {
        var _staticCacheObj = utils.copyObject(statesList.shift()); //shift first object from statesList
        var _cacheURL;//hold cache url
        var _cacheName;//hold cache name

        //TODO: Changes to make new tax year live

        // process that object
        if (_staticCacheObj.key != undefined && _staticCacheObj.key == 'TEMPLATE') {
            _cacheURL = whitelistedSubdomains['static'].domain + '/template.json';
            _cacheName = 'TEMPLATE';
        }
        else if (_staticCacheObj.key != undefined && _staticCacheObj.key == 'LOOKUP-2018') {
            _cacheURL = whitelistedSubdomains['static'].domain + "/2018/cacheLists/lookup.json";
            _cacheName = 'LOOKUP-2018';
        }
        else if (_staticCacheObj.key != undefined && _staticCacheObj.key == 'DEFAULTS-2018') {
            _cacheURL = whitelistedSubdomains['static'].domain + "/2018/cacheLists/defaults.json";
            _cacheName = 'DEFAULTS-2018';
        }
        else {
            _cacheURL = utils.prepareURLForStatic(whitelistedSubdomains['static'].domain, _staticCacheObj); // preparing url using selected year and state
            _cacheName = (_staticCacheObj.state + "-" + _staticCacheObj.year).toUpperCase();// creating cacheName using selected year and state
        }
        //if cacheName is not in our cacheList then just avoid to cache and set preCache as false
        if (cacheList[_cacheName] != undefined && cacheList[_cacheName].key != undefined) {
            //check the current state is already in cachelist with true preCache
            if (cacheList[_cacheName].preCache != undefined && cacheList[_cacheName].preCache === true) {
                _staticCacheObj.preCache = true;//updating preCache
                cacheList[_cacheName].preCacheInProcess = false;
                result.push(_staticCacheObj);
                //calling recursion function
                _cacheStates(statesList, result, callback);
            }
            else {
                //cache file using URL and Cache name
                preCacheFiles(_cacheName, _cacheURL).then(function (response) {
                    _staticCacheObj.preCache = true;//updating preCache
                    cacheList[_cacheName].preCacheInProcess = false;
                    result.push(_staticCacheObj);
                    //calling recursion function
                    _cacheStates(statesList, result, callback);
                }).catch(function (error) {
                    _staticCacheObj.preCache = false;//updating preCache
                    cacheList[_cacheName].preCacheInProcess = false;
                    result.push(_staticCacheObj);
                    //calling recursion function
                    _cacheStates(statesList, result, callback);
                });
            }
        }
        else {
            _staticCacheObj.preCache = false;//updating preCache
            result.push(_staticCacheObj);
            //calling recursion function
            _cacheStates(statesList, result, callback);
        }
    }
};


//precache State List
var _precacheStateList = function (event) {
    if (event != undefined && event.data != undefined && event.data.data != undefined) {
        //calling recursion method for adding state in cache
        //add every time for any state template and lookup
        if (event.data.data.process.length > 0) {
            //make all process state as in process
            for (var index in event.data.data.process) {
                var _cacheNameForInProcess = (event.data.data.process[index].state + "-" + event.data.data.process[index].year).toUpperCase();
                if (cacheList[_cacheNameForInProcess].preCache != true)
                    cacheList[_cacheNameForInProcess].preCacheInProcess = true;
            }

            //TODO: Changes to make new tax year live
            //add lookup ,default and template and first postion beacuse we are adding this in cache before any state
            event.data.data.process.unshift({ key: 'TEMPLATE' }, { key: 'LOOKUP-2018' }, { key: 'DEFAULTS-2018' });
        }
        //
        _executeWhenClientConnected(function () {
            _sendMessageToClient('staticVersionUpdatingStart', {});
            _sendMessageToClient('getCacheListAndUpdateStatus', {});
        });
        _cacheStates(event.data.data.process, [], function (statesList) {
            //
            _executeWhenClientConnected(function () {
                _sendMessageToClient('getCacheListAndUpdateStatus', {});
                _sendMessageToClient('staticVersionUpdatingFinish', {});
            });

            //make all cancel status as pecache false
            if (event.data.data.cancel != undefined && event.data.data.cancel.length > 0) {
                for (var key in event.data.data.cancel) {
                    if (event.data.data.cancel.hasOwnProperty(key)) {
                        var _cacheNameForCancel = (event.data.data.cancel[key].state + "-" + event.data.data.cancel[key].year).toUpperCase();
                        cacheList[_cacheNameForCancel].preCache = false;
                    }
                }
            }
            // update cache list in pouch DB
            db.updateDoc('cacheList', utils.copyObject(cacheList)).then(function (response) {
                // returning success response
                event.ports[0].postMessage({
                    success: 'Cache Done',
                    data: statesList,
                    error: null
                });
            }, function (error) {
                console.log('Error while updating cacheList in db');
                console.error(error);
                event.ports[0].postMessage({
                    success: 'Cache Done',
                    data: statesList,
                    error: null
                });
            });
        }, function (error) {
            _executeWhenClientConnected(function () {
                _sendMessageToClient('getCacheListAndUpdateStatus', {});
                _sendMessageToClient('staticVersionUpdatingFinish', {});
            });
            event.ports[0].postMessage({
                error: error
            });
        });
    }
};

var _preCacheAppFiles = function () {
    return new Promise(function (resolve, reject) {
        if (_isAppCacheRunning == false && cacheList['app'] != undefined && (cacheList['app'].preCache == undefined || cacheList['app'].preCache == false)) {
            _executeWhenClientConnected(function () {
                _sendMessageToClient('staticVersionUpdatingStart', {});
            });
            preCacheFiles('app', '/taxAppJs/offline/cacheList.json').then(function (response) {
                _executeWhenClientConnected(function () {
                    _sendMessageToClient('staticVersionUpdatingFinish', {});
                });
                resolve();
            }).catch(function (error) {
                _executeWhenClientConnected(function () {
                    _sendMessageToClient('staticVersionUpdatingFinish', {});
                });
                resolve();
            });
        } else {
            resolve();
        }
    });
};
//check State Precache Status
var _checkStatePrecacheStatus = function (event) {
    if (event != undefined && event.data != undefined && event.data.data != undefined && event.data.data.length > 0) {
        for (var key in event.data.data) {
            if (event.data.data.hasOwnProperty(key)) {
                var _cacheName = (event.data.data[key].state + "-" + event.data.data[key].year).toUpperCase();
                if (cacheList[_cacheName] != undefined && cacheList[_cacheName].preCache != undefined)
                    event.data.data[key].preCache = cacheList[_cacheName].preCache;
                else
                    event.data.data[key].preCache = false;
            }
        }
        event.ports[0].postMessage({
            success: 'Success',
            data: event.data.data,
            error: null
        });
    } else {
        event.ports[0].postMessage({
            error: 'Data is undefined'
        });
    }
};

/**
 * This method is used for caching update.
 * Sequence of Operations: Download New Cache List, Update App, Update Static, Download Static if not precached but available in user's preference
 */
var _checkForCacheUpdate = function (event) {
    //Download
    _downloadCacheList().then(function () {
        //Download App Cache
        _preCacheAppFiles().then(function (success) {
            //This will perform all update operations
            _analyzeCacheList().then(function () {
                console.log('Downloaded & Analyzed');
                //Download missing states (not precached but found in user preference)
                //This must be last step
                _executeWhenClientConnected(function () {
                    _sendMessageToClient('precacheMissingStates', {});
                });
            });
        });
    });
};

/**
 * This utility function is very helpful, when we like to execute some code when flag (variable) change its value.
 * It will be useful when some flag update on async function
 */
var _waitForFlagToChange = function (flagName, completeValue, callback) {
    if (self[flagName] == completeValue) {
        callback();
    } else {
        setTimeout(function () {
            _waitForFlagToChange(flagName, completeValue, callback);
        }, 500);
    }
};

//listen install event
self.addEventListener('install', function (event) {
    console.log('serviceWorker Installed');
    event.waitUntil(self.skipWaiting());
}, function (error) {
    console.log('serviceWorker Registration Failed: ' + error);
});

//activate event
self.addEventListener('activate', function (event) {
    console.log('serviceWorker activated');
});

//Message event
self.addEventListener('message', function (event) {
    console.log('Handling Message Event ');

    switch (event.data.command) {
        case 'precache':
            _precacheStateList(event);
            break;
        case 'switchToOnline':
            _switchToOnline();
            break;
        case 'setXSRFToken':
            _xsrfToken = event.data.xsrfToken;
            break;
        case 'cacheList':
            _getCacheList().then(function () {
                event.ports[0].postMessage({
                    success: 'Success',
                    data: cacheList,
                    error: null
                });
            });
            break;
        case 'checkStatePrecacheStatus':
            _checkStatePrecacheStatus(event);
            break;
        case 'preCacheAppFiles':
            _preCacheAppFiles();
            break;
        case 'checkForCacheUpdate':
            _checkForCacheUpdate(event);
            break;
        default:
            //
            event.ports[0].postMessage({
                error: 'Unkonwn Command'
            });
    };
});
