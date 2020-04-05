﻿"use strict";
var calculation = calculation || {};

calculation.calculator = (function (context) {
    var _isRunning;
    // self from worker, it is to get access global variable set in _context
    var _context = context;
    var _calculation = context.calculation;
    var _ = context._;

    var _init = function() {
        _isRunning = false;   
   };

    var _start = function() {
        try {

            _context.postMessage({ msgType: 'started' });
            _isRunning = true;

            while (!_.isUndefined(_calculation.changedFieldsList.getchangedField())) {
                var changedfield = _calculation.changedFieldsList.getchangedField();
                var fieldName = changedfield.fieldName;

                //To-do temporary remove it
                _calculation.logger.log(fieldName);
                
                var methodMaps = _calculation.calcCtrl.getMethodMaps(fieldName);
                for (var count = 0 ; count < methodMaps.length; count++) {
                    //check whether we have document in return before firing calculation on that document
                    // this will save some evaluation and CPU cycle.
                    var docName = _calculation.calcCtrl.getDocNameFromScript(methodMaps[count]);
                    if (_calculation.calcSvc.isDocIncluded(docName)){
                        var methodName = _calculation.calcCtrl.getMethodName(methodMaps[count]);
                        //for multi instance forms, set on which doc calculation should be performed 
                        _calculation.currentDocTracker.setCurrentDoc(changedfield.docName, changedfield.docIndex);

                        //get calculation file name from document name. it assumed that only prefix are different
                        var scriptName = 'c' + docName.slice(1);
                        _runCalculation(scriptName,methodName);
                    }        
                }
                //mark field as done otherwise will go into infinite loop
                changedfield.isDone = true;
            }
        } catch (e) {
            //To:do change _calculation.logger.log to proper log forwarder
            _calculation.logger.log('error in calculation ' + e);

        }
        finally {
            // // Send all updated field and added forms to UI
            // property change list has both calculation and property change field
            var propertyChangedFieldList = _calculation.changedFieldsList.getPropertyChangedFieldList();            
            if (propertyChangedFieldList.length > 0)
                _context.postMessage({ msgType: 'changedField', fields: propertyChangedFieldList});
            
            var addFormList = calculation.changedFieldsList.getAddFormList();
            if(addFormList.length > 0)
                _context.postMessage({ msgType: 'addForm', forms: addFormList});
            _calculation.changedFieldsList.clear();
            _isRunning = false;
            _context.postMessage({ msgType: 'done' });
         
        }
    };

    var _runCalculation = function (scriptName,methodName) {
        //check whether method is defined in context and found then execute it
        try {
            if (!_.isUndefined(scriptName) && !_.isUndefined(_calculation[scriptName]) && !_.isUndefined(methodName) && !_.isUndefined(_calculation[scriptName][methodName]))
                _calculation[scriptName][methodName]();
        } catch (e) {
            //To:do change _calculation.logger.log to proper log forwarder
            _calculation.logger.log('error while executing method: ' + methodName + e);
        }

    };
    //This method is called when new form is added. this only fires calculations in document and then start normal calulation cycle 
    var _calculateDocFields = function (docName, index) {           
            _calculation.currentDocTracker.setCurrentDoc(docName, index);
            var methodNames = _calculation.calcCtrl.getMethodNamesByDoc(docName);
            
            if(methodNames.length > 0){
                //get calculation file name from document name. it assumed that only prefix are different
                var scriptName = 'c' + docName.slice(1);
                for (var count = 0 ; count < methodNames.length; count++)               
                    _runCalculation(scriptName, methodNames[count]);
            }
            else{
                // This is special case where what is added is statement and calculation for statements are written in parent form 
                //Therefore with docname no methods were return so we need to fire calculation using reCalculateDoc
                // it appears call to this function will not result anything as yet document has no field in it
                // In future we may add default value before calculation recieves it.
                _calculation.calcSvc.pushFieldForCalcualtion(docName, index);
            }            
         
            // start calculation for modified field, this function call will send changes back to UI
           _start(); 
           //Pass message to reload form for which all methods has been calculated (If it is current form)
           _context.postMessage({msgType:'reloadIfCurentform','docIndex':index});
           
    };
     
    var _calculateAllDocFields = function (data) {
        for(var i in data){
            var docName = data[i].docName;
            var index = data[i].index;
            _calculation.currentDocTracker.setCurrentDoc(docName, index);
            var methodNames = _calculation.calcCtrl.getMethodNamesByDoc(docName);
            
            if(methodNames.length > 0){
                //get calculation file name from document name. it assumed that only prefix are different
                var scriptName = 'c' + docName.slice(1);
                for (var count = 0 ; count < methodNames.length; count++)               
                    _runCalculation(scriptName, methodNames[count]);
            }
            else{
                // This is special case where what is added is statement and calculation for statements are written in parent form 
                //Therefore with docname no methods were return so we need to fire calculation using reCalculateDoc
                // it appears call to this function will not result anything as yet document has no field in it
                // In future we may add default value before calculation recieves it.
                _calculation.calcSvc.pushFieldForCalcualtion(docName, index);
            }
        }
        
     
        // start calculation for modified field, this function call will send changes back to UI
       _start();        
    };

    return { 
        init: _init,
        start: _start,
        calculateDocFields: _calculateDocFields,
        calculateAllDocFields : _calculateAllDocFields
    };

})(this);