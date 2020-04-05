"use strict";
//namespace defination
var calculation = calculation || {};

calculation.calcReview = (function (context){    
    // self from worker, it is to get access global variable set in context
    var _context = context;
    var _calculation = context.calculation;
    var _ = context._;
    var _rules = {};
    var _loadedRules = {};
    var _loadedMethods = {};
    var _baseURL = {};
    var _reviewErrors = [];

    var _init = function () {        
    };
    
    var _loadRule = function (reviewUrl) {
        if (_.isUndefined(_loadedRules[reviewUrl.url]) || _loadedRules[reviewUrl.url] === false) {
            try {
                var url = reviewUrl.url + 'rule.js';
                _context.importScripts(url);
                _loadedRules[reviewUrl.url] = true;
            } catch (e) {
                _calculation.logger.log('Error downloading review rule file from : ' + reviewUrl.url + e);
                _loadedRules[reviewUrl.url] = false;
            }
        }
    };
    
    var _loadMethods = function (reviewUrl) {
        if (_.isUndefined(_loadedMethods[reviewUrl.url]) || _loadedMethods[reviewUrl.url] === false) {
            try {
                var url = reviewUrl.url + 'methods.js';
                _context.importScripts(url);
                _loadedMethods[reviewUrl.url] = true;
            } catch (e) {
                _calculation.logger.log('Error downloading review method file from : ' + reviewUrl.url + e);
                _loadedMethods[reviewUrl.url] = false;
            }
        }
    };
    
    var _addRule = function (rule) {
        if (!_.isUndefined(rule) && _.isObject(rule)) {
           _rules = _.assign(_rules,rule);
        }
    };

    // add URL to base URL rule and call load rule function
    var _addUrl = function (key, url) {
        _baseURL[key] = url;
        _loadRule(_baseURL[key]);
        _loadMethods(_baseURL[key]);      
    };
    
    var _start = function (ruleDocs) {
        //clear review error stack
        _reviewErrors = [];
        if (!_.isUndefined(_rules) && !_.isEmpty(_rules)) {
            var ruleKeys = _getRuleKeys(ruleDocs);
            _.forEach(ruleKeys, function (key){
                if (!_.isUndefined(_rules[key])) {
                    var rule = _rules[key];
                    //check whether rule has value for path and method name
                    if (!_.isUndefined(rule.path) && !_.isUndefined(rule.method)) {
                        //check methods file is downloaded before executing method
                        if (!_.isUndefined(_baseURL[rule.path]) && 
                            !_.isUndefined(_loadedMethods[_baseURL[rule.path].url]) &&
                            _loadedMethods[_baseURL[rule.path].url] === true) {
                            //get state name (1040.federal)
                            var stateName = rule.path.split('.')[1];
                            var packageName = 'p'+rule.path.split('.')[0];
                            //check namespace and whether method is loaded before executing
                            if (!_.isUndefined(_calculation.review) &&
                                !_.isUndefined(_calculation.review[packageName]) &&
                                !_.isUndefined(_calculation.review[packageName][stateName]) &&
                                !_.isUndefined(_calculation.review[packageName][stateName][rule.method])) {
                                try {
                                    // execute method and get doc indexes  
                                    var docIndexes = _calculation.review[packageName][stateName][rule.method]();
                                    if (!_.isUndefined(docIndexes)) {
                                        for (var index = 0; index < docIndexes.length; index++) {
                                            var error = {
                                                fieldName: rule.fieldName, docName: rule.docName, docIndex: docIndexes[index],
                                                category: rule.category,
                                                message: rule.message,
                                                key: key,
                                                severity: rule.severity,
                                                suggestion: rule.suggestion
                                            };
                                            _reviewErrors.push(error);
                                        }
                                    }
                                }
                                catch (e) {
                                    //To:do change _calculation.logger.log to proper log forwarder
                                    _calculation.logger.log('error while executing Review method: '+ rule.method + e);
                                }                              
                            }
                        }
                    }
                }
            });
        }
        //review done send back errors      
        _context.postMessage({ msgType: 'reviewCompleted', reviewErrors: _reviewErrors});
        
    };

    var _getRuleKeys = function(ruleDocs) {
        var ruleKeys = [];
        if(!_.isUndefined(ruleDocs) && ruleDocs.length > 0) {
            _.forEach(_rules, function(rule, ruleKey) {
                if(!_.isUndefined(rule.docName) && ruleDocs.indexOf(rule.docName) != -1) {
                    ruleKeys.push(ruleKey);
                }
            });
        } else {
            ruleKeys = _.keys(_rules);
        }
        return ruleKeys;
    }

    return {
        init: _init,
        addUrl: _addUrl,
        addRule: _addRule,
        start: _start
};
})(this);