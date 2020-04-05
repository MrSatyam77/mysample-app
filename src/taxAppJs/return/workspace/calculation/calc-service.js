﻿"use strict";
// namespace defination
var calculation = calculation || {};

calculation.calcSvc = (function (context) {
    var _taxReturn;
    // self from calculation, it is to get access global variable set in context
    var _context = context;
    var _calculation = context.calculation;
    var _ = context._;

    var _init = function (taxReturn) {
        _taxReturn = taxReturn;

    };

    // pW2.wages
    // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
    var _getDocFieldName = function (fieldName) {
        var s = fieldName;
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
        var a = s.split('.');

        if (_.isUndefined(a.length) || a.length === 0 || a.length > 2)
            throw ('Provided field name is in wrong format expected format is dw2.wages:' + fieldName);

        return {
            docName: a.shift(),
            fieldName: a.shift()
        };
    };

    var _addForm = function (docName, allowDuplicate, parentIndex) {
        _calculation.changedFieldsList.addForm(docName, allowDuplicate, parentIndex);
    };

    var _addChildDoc = function (docName, parentIndex) {

        // Here, we allow worker to add docs only at odd number indexes to prevent duplication of indexes by return-service & worker file. 
        if (_taxReturn.count % 2 === 0) {
            _taxReturn.count = parseInt(_taxReturn.count) + 1;
        } else {
            _taxReturn.count = parseInt(_taxReturn.count) + 2;
        }
        var index = _taxReturn.count;
        // we can not need this post message because we have maintain seprate bunch of indexes avilable for worker file (odd number indexes) & js file (even number indexes).
        // _context.postMessage({
        //     msgType : 'setCounterInReturnService',
        //     'count' : index,
        // });
        _addDoc(docName, index, parentIndex);
        _context.postMessage({
            msgType: 'addChildDoc',
            'docName': docName,
            'parentIndex': parentIndex,
            'index': index
        });
        return index;
    };

    var _setCounter = function (count) {
        // Here, we allow service to update index only one time while initializing the worker, to get latest last updated count.
        if (!_taxReturn.count) {
            _taxReturn.count = count;
        }
    }

    // add doc in docs list of tax return
    var _addDoc = function (docName, index, parentIndex) {
        // if doc container does note exist then create it
        if (_.isUndefined(_taxReturn[docName]))
            _taxReturn[docName] = {};
        _taxReturn[docName][index] = {};
        // if child doc then add parent information
        if (!_.isUndefined(parentIndex))
            _taxReturn[docName][index].parent = parentIndex;
        // update tax return doc count
        _taxReturn.count = index;
    };

    // Update parent index in doc of child form
    var _updateParent = function (docName, index, parentIndex) {
        _taxReturn[docName][index].parent = parentIndex;
    };

    /**
     * remove form
     */
    var _removeForm = function (docName, index) {
        _context.postMessage({
            msgType: 'removeForm',
            'docName': docName,
            'docIndex': index
        });
    }


    // remove doc from doc list of tax return
    var _removeDoc = function (docName, index, isUI) {

        // check whether doc exist in doc list
        if (!_.isUndefined(_taxReturn[docName]) && !_.isUndefined(_taxReturn[docName][index])) {

            // run calculation on fields which are being removed to update other calculation in tax return
            var fieldNames = _.keys(_taxReturn[docName][index]);
            if (fieldNames && fieldNames.length > 0) {
                for (var i = 0; i < fieldNames.length; i++) {
                    _calculation.changedFieldsList.add(new _calculation.changedField(docName + '.' + fieldNames[i], docName, index));
                }
            }

            if (_.isUndefined(isUI) || isUI === false)
                _context.postMessage({
                    msgType: 'removeDoc',
                    'docName': docName,
                    'index': index
                });

            // remove doc based on index
            delete _taxReturn[docName][index];
            // remove container if do not have any Doc
            if (_.isEmpty(_taxReturn[docName]))
                delete _taxReturn[docName];
        }

    };

    // for recalcualtion add all fields in calculation
    var _reCalculate = function () {
        if (!_.isUndefined(_taxReturn)) {
            // get all documents in return
            var docNames = _.keys(_taxReturn);
            if (!_.isUndefined(docNames) && docNames.length > 0) {
                for (var dIndex = 0; dIndex < docNames.length; dIndex++) {
                    // get all indexes of document
                    var docIndexes = _.keys(_taxReturn[docNames[dIndex]]);
                    if (!_.isUndefined(docIndexes) && docIndexes.length > 0) {
                        for (var index = 0; index < docIndexes.length; index++) {
                            _pushFieldForCalcualtion(docNames[dIndex], docIndexes[index]);
                        }
                    }
                }
            }
        }
    };

    var _pushFieldForCalcualtion = function (docName, index) {
        // get all fields of document for given index
        var doc = _getDoc(docName, index);
        if (!_.isUndefined(doc)) {
            var fieldNames = _.keys(doc);
            if (!_.isUndefined(fieldNames) && fieldNames.length > 0) {
                for (var fIndex = 0; fIndex < fieldNames.length; fIndex++) {
                    // get field
                    var field = doc[fieldNames[fIndex]];
                    // add all the fields in calculation change tracker.
                    _calculation.changedFieldsList.add(new _calculation.changedField(docName + '.' + fieldNames[fIndex], docName, index));
                }

            }
        }
    };

    // get document based on index provided, if index is not provided use _getDocIndex method
    var _getDoc = function (docName, index) {
        var doc;
        // if index is not provided then use get doc index
        if (_.isUndefined(index))
            index = _getDocIndex(docName);

        if (_.has(_taxReturn, docName) && index !== -1 && !_.isUndefined(_taxReturn[docName][index]))
            doc = _taxReturn[docName][index];

        if (_.isUndefined(doc))
            _calculation.logger.log('something is wrong did not find doc:' + docName);
        return doc;
    };

    // get list of documents for multi instance pages and child pages
    var _getDocs = function (docName) {
        var docs;
        if (_.has(_taxReturn, docName) && !_.isUndefined(_taxReturn[docName]))
            docs = _taxReturn[docName];
        if (_.isUndefined(docs))
            _calculation.logger.log('something is wrong did not find doc:' + docName);
        return docs;
    };

    // get document index from current doc tracker or return first document from list
    var _getDocIndex = function (docName) {
        var index;

        if (_.has(_taxReturn, docName)) {
            // index parameter not present then use current doc tracker
            index = _calculation.currentDocTracker.getCurrentDoc(docName);
            // current tracker do not have information return first Doc index
            if (index === -1)
                index = _getDocIndexes(docName)[0];
        }
        return index;
    };

    // get list of indexes of doc
    var _getDocIndexes = function (docName, filters) {
        var indexes = [];

        // check wehther doc exist in tax return and on succes get list of inexes
        if (_.has(_taxReturn, docName)) {
            var docs = _taxReturn[docName];
            if (_.isUndefined(filters))
                indexes = _.keys(docs);
            else {
                var keys = _.keys(docs);
                if (keys && keys.length > 0) {
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        if (_applyFilters(docs[key], filters))
                            indexes.push(key);
                    }
                }
            }

            if (_.isUndefined(indexes))
                _calculation.logger.log('something is wrong did not find doc:' + docName);

        }
        return indexes;
    };

    // get list of indexes of child doc based on parent doc name
    var _getChildDocIndexesFromParentName = function (docName, parentName, filters) {
        var parentIndexes = _getDocIndexes(parentName);
        return _getChildDocIndexesFromParentIndex(docName, parentIndexes, filters);
    };

    // get list of indexes of child doc based on parent doc index
    var _getChildDocIndexesFromParentIndex = function (docName, parentIndex, filters) {
        var indexes = [];

        if (!_.isUndefined(parentIndex)) {

            var childDocs = _getDocs(docName);
            // find child docs based on parent index
            if (!_.isUndefined(childDocs)) {
                var keys = _.keys(childDocs);
                if (keys && keys.length > 0) {
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        // check whether we have single parentIndex or multiple Indexes
                        // _indexOf function compare values using strict === so need to convert parent to string
                        // parentIdexes stores value as string
                        if (_.isArray(parentIndex)) {
                            if (_.indexOf(parentIndex, childDocs[key].parent.toString()) >= 0 && _applyFilters(childDocs[key], filters))
                                indexes.push(key);
                        } else {
                            if (childDocs[key].parent == parentIndex && _applyFilters(childDocs[key], filters))
                                indexes.push(key);
                        }
                    }
                }
            }

        }
        return indexes;
    };

    // filters = [{fieldName:'dW2.Wages',fieldValue:'2',operator:'==',logicalOperator:'&&'},
    // {{fieldName:'dW2.Wages',fieldValue:'2',operator:'!=',logicalOperator:''}]
    // this method support all javasript inbuild operator and logical operators
    var _applyFilters = function (doc, filters) {
        if (_.isUndefined(filters))
            return true;
        else {
            var result = false;
            var nextLogicalOperator;
            // Note: We have appended ""+ in filter expression. Because in case of boolean value comparision. == does compare on type as well.
            // For Ex. true=="true" - will always return false. So we have appended "" Ex. ""+true=="true" will now return true.
            var filterExpression = '(""+doc["{{fieldname}}"].value).toLowerCase() {{operator}} "{{fieldValue}}".toLowerCase()';

            for (var fIndex = 0; fIndex < filters.length; fIndex++) {
                var filter = filters[fIndex];
                var names = _getDocFieldName(filter.fieldName);
                var transResult = false;
                // skip evaluation if field is not in document
                if (!_.isUndefined(names) && !_.isUndefined(doc[names.fieldName]) && !_.isUndefined(doc[names.fieldName].value)) {

                    var filterString = filterExpression.replace('{{fieldname}}', names.fieldName).replace('{{operator}}', filter.operator).replace('{{fieldValue}}', filter.fieldValue);
                    transResult = eval(filterString);
                } else {
                    if (filter.operator === '!=' && filter.fieldValue !== '')
                        transResult = true;
                    else
                        transResult = false;
                }

                if (!_.isUndefined(nextLogicalOperator) && !_.isEqual(nextLogicalOperator, ""))
                    result = eval('result ' + nextLogicalOperator + ' transResult');
                else
                    result = transResult;

                nextLogicalOperator = filter.logicalOperator;
            }
            return result;
        }
    };

    // sum function, this function sum given field from all doc indexes
    var _sum = function (fieldName, defVal, parentIndex, filters) {
        var names = _getDocFieldName(fieldName);
        var indexes;

        // if parent index defined then get only documents which are child of parent
        if (!_.isUndefined(parentIndex))
            indexes = _getChildDocIndexesFromParentIndex(names.docName, parentIndex, filters);
        else
            indexes = _getDocIndexes(names.docName, filters);

        var total = 0;
        if (!_.isUndefined(indexes)) {
            for (var i = 0; i < indexes.length; i++) {
                total = total + _getValue(fieldName, defVal, indexes[i]);
            }
        }
        return total;
    };

    // count function, this function count given field from all doc indexes
    var _count = function (fieldName, parentIndex, filters) {
        var names = _getDocFieldName(fieldName);
        var indexes;

        // if parent index defined then get only documents which are child of parent
        if (!_.isUndefined(parentIndex))
            indexes = _getChildDocIndexesFromParentIndex(names.docName, parentIndex, filters);
        else
            indexes = _getDocIndexes(names.docName, filters);

        var count = 0;
        if (!_.isUndefined(indexes))
            count = indexes.length;

        return count;
    };

    // we many need to consider using libraries like BigInteger or BigDecimal
    // when we have numbers larger than 16 digits
    var _divide = function (dividend, divisior, precision) {
        if (!_.isUndefined(precision) && !_.isNumber(precision))
            // parseFloat insure that it is returns as float not as string
            return parseFloat((dividend / divisior).toFixed(precision));
        else
            return parseFloat((dividend / divisior));
    };

    var _decimal = function (number, precision) {
        if (!_.isUndefined(precision) && _.isNumber(precision) && _.isNumber(number))
            // parseFloat insure that it is returns as float not as string
            return parseFloat((number).toFixed(precision));
        else
            return number;
    };

    // Will return value without rounding.
    var _precision = function (number, precision) {
        if (!_.isUndefined(precision) && _.isNumber(precision) && _.isNumber(number)) {
            var temp = number.toString().split('.');
            var test = temp[0] + "." + temp[1].substring(0, precision);
            return parseFloat(test);
        } else {
            return number;
        }
    };

    var _isManual = function (fieldName, index) {

        var field = _getField(fieldName, index);

        // if doc does not have value for field then return default value
        if (_.isUndefined(field) || _.isEmpty(field) || _.isUndefined(field.isCalculated))
            return true;
        else
            return !field.isCalculated;
    };

    // Verify whether document is included in return
    var _isDocIncluded = function (docName, index) {
        if (!_.isUndefined(index)) {
            // index is provided then check whether we have document with provided index
            if (_.has(_taxReturn, docName) && index !== -1 && !_.isUndefined(_taxReturn[docName][index]))
                return true;
            else
                return false;
        } else
            // index is not provided then check whether we have any document with doc name provided
            return _.has(_taxReturn, docName);
    };

    // Type conversion safety logic to convert data into type specified by default values
    // Checked Whether parsed value for int and float are not a number type, if it is then return defaul value to
    // avoid any crashe or wrong calculations
    var _convert = function (data, defValue) {
        if (_.isString(defValue) && _.isEqual(defValue, ""))
            return data.toString();
        else if (_.isString(defValue) && _.isEqual(defValue, "0")) {
            if (_.isEqual(data, ""))
                return 0;
            else {
                var value = parseInt(data);
                if (isNaN(value))
                    return 0;
                else
                    return value;
            }
        } else if (_.isString(defValue) && _.isEqual(defValue, "0.00")) {
            if (_.isEqual(data, ""))
                return 0.00;
            else {
                var value = parseFloat(data);
                if (isNaN(value))
                    return 0.00;
                else
                    return value;
            }
        } else if (_.isBoolean(defValue)) {
            if (data === 'X')
                return true;
            else if (_.isBoolean(data))
                return data;
            else
                return data.toString().toLowerCase() === 'true';
        }
        return data;
    };

    var _getField = function (fieldName, index) {
        var field;
        var names = _getDocFieldName(fieldName);
        var doc = _getDoc(names.docName, index);

        if (!_.isUndefined(doc)) {
            if (_.has(doc, names.fieldName) && !_.isUndefined(doc[names.fieldName]))
                field = doc[names.fieldName];
            else
                field = doc[names.fieldName] = {};
        }
        return field;
    };

    var _setField = function (fieldName, fieldProperty, newVal, index, isCalculated, isUI) {

        var names = _getDocFieldName(fieldName);
        var field = _getField(fieldName, index);
        index = index || _getDocIndex(names.docName);
        // we only want to add field in change field tracker if its value is modified
        // This help in improving performance of recalculation and normal calculation cycle
        var isValueChanged = false;
        if (!_.isUndefined(field)) {
            if (!_.isUndefined(newVal)) {
                // if (_.isObject(newVal) && (_.isEmpty(field) || !_.isEquals(field,newVal))){
                if (_.isObject(newVal)) {
                    field = _.assign(field, newVal);
                    isValueChanged = true;
                    // To check wheather newVal variable is boolean or not in order to solve Dependent info in CIS
                } else {
                    if (!_.isUndefined(fieldProperty)) {
                        switch (fieldProperty) {
                            case 'value': {
                                if (_.isUndefined(field.value) || field.value != (_.isBoolean(newVal) == true && _.isBoolean(field.value) == false ? '' + newVal : newVal)) {
                                    var mode = calculation.utils.getEnvironment();
                                    //get old field value
                                    var oldField = _getField(fieldName, index);
                                    //check if field is menual and if value exist 
                                    //then keep old value and make field oveeride and calculated true
                                    //store new field value in calValue
                                    if ((mode == 'beta' || mode == 'local') && _isManual(fieldName, index) == true && oldField.value != undefined && oldField.value != "" && isCalculated == true) {
                                        field = oldField;
                                        field.isCalculated = true;
                                        field.isOverridden = true;
                                    } else {
                                        // incase field is overridden store value in calValue field for later unoverridden
                                        if (!_.isUndefined(field.isOverridden) && field.isOverridden === true) {
                                            field.calValue = newVal;
                                        }
                                        else {
                                            field.value = newVal;
                                            isValueChanged = true;
                                        }
                                    }
                                }
                                break;
                            }
                            default: {
                                if (field[fieldProperty] != newVal) {
                                    field[fieldProperty] = newVal;
                                    _calculation.changedFieldsList.addPropertyChange(new _calculation.changedField(fieldName, names.docName, index, field));
                                }
                            }
                        }
                    }
                }
            }

            // always set calculated true when setfield function is called inside calculator
            // when isCalcualted is passed set calculated field accordingly
            if (!_.isUndefined(isCalculated)) {
                field.isCalculated = isCalculated;
                // Changes in isCalculated attribure is not consider as calculation change.
                // So we don't add field in calculation change tracker. But to reflect isCalculated attribute in UI we add field in property change tracker.
                // This will help to avoid unnecessary recursion in calcuation. 
                _calculation.changedFieldsList.addPropertyChange(new _calculation.changedField(fieldName, names.docName, index, field));
            } else if ((_.isUndefined(isUI) || isUI === false)) {
                if (_.isUndefined(field.isCalculated) || (!_.isUndefined(field.isCalculated) && field.isCalculated == true)) {
                    field.isCalculated = true;
                    // Changes in isCalculated attribure is not consider as calculation change.
                    // So we don't add field in calculation change tracker. But to reflect isCalculated attribute in UI we add field in property change tracker.
                    // This will help to avoid unnecessary recursion in calcuation.
                    _calculation.changedFieldsList.addPropertyChange(new _calculation.changedField(fieldName, names.docName, index, field));
                }
            }

            if (isValueChanged) {
                _calculation.changedFieldsList.add(new _calculation.changedField(fieldName, names.docName, index, field));
                // We also add field in property change tracker. By doing this, property change list has both calcuation and property changes.  
                // And we only need to pass property change list to UI at the end of the calculation cycle. 
                // This will help to avoid unnecessary processing to merge both calculation and property changes list before passing to UI. 
                _calculation.changedFieldsList.addPropertyChange(new _calculation.changedField(fieldName, names.docName, index, field));
            }
        }
    };

    var _getValue = function (fieldName, defValue, index) {

        if (_.isUndefined(defValue))
            throw (' defValue must be provided for type safety');

        var field = _getField(fieldName, index);

        // if doc does not have value for field then return default value
        if (_.isUndefined(field) || _.isEmpty(field) || _.isUndefined(field.value))
            return _convert(defValue, defValue);
        // return value depending on type in data
        else
            return _convert(field.value, defValue);
    };

    var _setValue = function (fieldName, newVal, index, isCalculated, isUI) {
        _setField(fieldName, 'value', newVal, index, isCalculated, isUI);
    };

    var _setEnabled = function (fieldName, enabled, index) {
        _setField(fieldName, 'isEnabled', enabled, index, undefined, true);
    };

    var _setRequired = function (fieldName, required, index) {
        _setField(fieldName, 'isRequired', required, index, undefined, true);
    };

    var _setType = function (fieldName, type, index) {
        _setField(fieldName, 'type', type, index, undefined, true);
    };

    return {
        init: _init,
        reCalculate: _reCalculate,
        pushFieldForCalcualtion: _pushFieldForCalcualtion,
        getValue: _getValue,
        setValue: _setValue,
        setEnabled: _setEnabled,
        setRequired: _setRequired,
        setType: _setType,
        addDoc: _addDoc,
        updateParent: _updateParent,
        addChildDoc: _addChildDoc,
        removeDoc: _removeDoc,
        addForm: _addForm,
        getDocIndexes: _getDocIndexes,
        getChildDocIndexesFromParentName: _getChildDocIndexesFromParentName,
        getChildDocIndexesFromParentIndex: _getChildDocIndexesFromParentIndex,
        isManual: _isManual,
        isDocIncluded: _isDocIncluded,
        sum: _sum,
        count: _count,
        divide: _divide,
        decimal: _decimal,
        precision: _precision,
        setCounter: _setCounter,
        removeForm: _removeForm
    };
})(this);
