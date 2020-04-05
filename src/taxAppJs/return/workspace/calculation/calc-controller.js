"use strict";
//namespace defination
var calculation = calculation || {};

calculation.calcCtrl = (function (context) {
        
    // self from worker, it is to get access global variable set in context
    var _context = context;
    var _calculation = context.calculation;
    var _ = context._;
    var _map = { scripts: {}, fieldMaps: {}, loadedMaps: {} };
    var _loadedScripts = {};
    var _loadedTaxTable = {};
    var _baseURL = {};
    
    var _init = function(){
    
    };
    
    var _loadMap = function (map) {
        if (_.isUndefined(_map.loadedMaps[map.url]) || _map.loadedMaps[map.url] === false) {
            try {
                var url = map.url + 'cmap.js';
                _context.importScripts(url);
                _map.loadedMaps[map.url] = true;
            } catch (e) {
                _calculation.logger.log('Error downloading calculation map file from : ' + map.url + e);
                _map.loadedMaps[map.url] = false;
            }
        }
    };
    
    var _loadTaxTables = function (taxTable) {
        if (_.isUndefined(_loadedTaxTable[taxTable.url]) || _loadedTaxTable[taxTable.url] === false) {
            try {
                var url = taxTable.url + 'ctaxtables.js';
                _context.importScripts(url);
                _loadedTaxTable[taxTable.url] = true;
            } catch (e) {
                _calculation.logger.log('Error downloading calculation tax table file from : ' + taxTable.url + e);
                _loadedTaxTable[taxTable.url] = false;
            }
        }
    };

    // add URL to base URL map and call load map function
    var _addCalcUrl = function (key, url) {
        _baseURL[key] = url;
        _loadMap(_baseURL[key]);
        _loadTaxTables(_baseURL[key]);
    };

    var _addMap = function(map){

        if (_.isUndefined(map.scripts) || _.isUndefined(map.fieldMaps))
            throw 'invalid map format';
        //Merge addtional maps into core map
        _map.scripts = _.assign(_map.scripts, map.scripts);

        var keys = _.keys(map.fieldMaps);
        if (!_.isUndefined(keys) && keys.length > 0) {
            for (var kIndex = 0; kIndex < keys.length; kIndex++) {
                if (_.has(_map.fieldMaps, keys[kIndex]) && !_.isUndefined(_map.fieldMaps[keys[kIndex]].methodsMaps))
                    _map.fieldMaps[keys[kIndex]].methodsMaps = _map.fieldMaps[keys[kIndex]].methodsMaps.concat(map.fieldMaps[keys[kIndex]].methodsMaps);
                else {
                    _map.fieldMaps[keys[kIndex]] = {};
                    _map.fieldMaps[keys[kIndex]].methodsMaps = [];
                    _map.fieldMaps[keys[kIndex]].methodsMaps = _map.fieldMaps[keys[kIndex]].methodsMaps.concat(map.fieldMaps[keys[kIndex]].methodsMaps);
                }
            }
        }       
    };

    var _getMethodMaps = function (fieldName) {

        // incase do not find method maps send empty array
        var methodMaps = [];
        if(!_.isUndefined(_map.fieldMaps[fieldName]) &&
           !_.isUndefined(_map.fieldMaps[fieldName].methodsMaps) && 
           _map.fieldMaps[fieldName].methodsMaps.length > 0)
            methodMaps = _map.fieldMaps[fieldName].methodsMaps;
        return methodMaps;
    };

    var _getMethodNamesByDoc = function (docName) {
        // incase do not find methods send empty object
        var methods = {};
        if (!_.isUndefined(docName)) {
            //get calculation file name from document name. it assumed that only prefix are different
            var scriptName = 'c' + docName.slice(1) + ".js";
            //pairs function convert object map to array as key value pair. 
            //on zero index we have key and on one index we have object
            var script = _.find(_.pairs(_map.scripts), function (s) {
                return s[1].path.indexOf(scriptName) > 0;
            });

            //pluck function extract out properties from object map
            if (!_.isUndefined(script)) {
                _loadScript(script[0]);
                if (_loadedScripts[script[0]].success)
                    methods = _.pluck(script[1].methods, 'name');
            }
        }
        return methods;
    };

    var _getMethodName = function (method) {
        var methodName;
        _loadScript(method.sid);   
        if (_loadedScripts[method.sid].success)
            methodName = _map.scripts[method.sid].methods[method.mid].name;
        return methodName;
    };

    var _getDocNameFromScript = function (method) {
        var docName = '';
        var scriptName = _map.scripts[method.sid].path.split('/')[1].replace('.js','');
        docName = 'd' + scriptName.slice(1);
        return docName;
    }

    var _loadScript = function (sid) {

        //check whether required calculation file is already loaded
        if (_.isUndefined(_loadedScripts[sid]) ||
            (_loadedScripts[sid].success === false &&
             _loadedScripts[sid].try < 3)) {

            _loadedScripts[sid] = _loadedScripts[sid] || {};
            //script file is not loaded download it
            if (!_.isUndefined(_map.scripts[sid])) {
                try {
                    var path = _map.scripts[sid].path;
                    var paths = path.split('/');
                    var URL = _baseURL[paths[0]].url + paths[1];
                    _context.importScripts(URL);
                    _loadedScripts[sid].success = true;
                } catch (e) {
                    //To:do change _calculation.logger.log to proper log forwarder
                    _calculation.logger.log('Error downloading calculation file: ' + URL + e);
                    _loadedScripts[sid].success = false;
                    _loadedScripts[sid].try = ++_loadedScripts[sid].try || 1;
                }
            }
        }

    };

    return {
        init: _init,
        addMap: _addMap,
        addCalcUrl: _addCalcUrl,
        getMethodMaps: _getMethodMaps,
        getMethodName: _getMethodName,
        getMethodNamesByDoc: _getMethodNamesByDoc,
        getDocNameFromScript: _getDocNameFromScript
    };
})(this);







