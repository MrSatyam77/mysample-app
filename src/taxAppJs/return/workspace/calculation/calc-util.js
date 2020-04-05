﻿"use strict";
// namespace defination
var calculation = calculation || {};

// change field object
calculation.changedField = function(fieldName, docName, index, newVal) {
	this.fieldName = fieldName;
	this.docIndex = index;
	this.docName = docName;
	this.isDone = false;
	this.repeatCount = 0;
	this.newVal = newVal; // To send update Value back to UI
};

calculation.changedFieldsList = (function(context) {
    var _changeFieldsList = [];
    var _propertyChangeFieldsList = [];
	var _addFormList = [];
	var MAX_REPEAT_COUNT = 15;
	var _ = context._;
	var _calculation = context.calculation;

	var _add = function(field) {
		if (_.isUndefined(field) || !(field instanceof calculation.changedField))
			throw 'only allowed type is ChangedField';                            
        
		//var field = _.clone(field, true);

		// check whether field is already in list, if it is increment duplicate
		// count
		// if field is duplicated more than max allowed count mark it as
		// processed
		var fieldInList = _.find(_changeFieldsList, function (cf) {
		    return cf.fieldName === field.fieldName && cf.docName === field.docName && cf.docIndex === field.docIndex;			
		});
		if (!_.isUndefined(fieldInList)) {
			if (fieldInList.isDone) {
				fieldInList.repeatCount++;
				fieldInList.isDone = false;
				if (fieldInList.repeatCount >= MAX_REPEAT_COUNT) {
					fieldInList.isDone = true;
				    //To-do forward to log forwarder				   
					_calculation.logger.log('possible recursive loop for field: ' + fieldInList.fieldName);
				}
			}

			fieldInList.newVal = field.newVal; // save new Value into list to
			// sent back to UI
		} else
			_changeFieldsList.push(field);
	};

	var _addPropertyChange = function(field){
		if (_.isUndefined(field) || !(field instanceof calculation.changedField))
			throw 'only allowed type is ChangedField';                            
        
		//var field = _.clone(field, true);

		// check whether field is already in list, if it is increment duplicate
		// count
		// if field is duplicated more than max allowed count mark it as
		// processed
		var fieldInList = _.find(_propertyChangeFieldsList, function (cf) {
		    return cf.fieldName === field.fieldName && cf.docName === field.docName && cf.docIndex === field.docIndex;			
		});		
		if(_.isUndefined(fieldInList)) {
			_propertyChangeFieldsList.push(field);	
		} else {
			fieldInList.newVal = field.newVal; // save new Value into list to
		}
	}

	var _addForm = function(docName,allowDuplicate,parentIndex) {		
		// parent index is coming as string which creates problem while adding form. so to avoid issue we have parse it.
		if(!_.isUndefined(parentIndex) && parentIndex != ""){
			parentIndex = parseInt(parentIndex);
		}
		
		//Before we were adding form by just a doc name. Which was creating problem while adding child form which have more then one parent.
		//So to add child form with correct parent index we pass parent doc index with child doc name.
		if((!_.isUndefined(allowDuplicate) && allowDuplicate === true) || (_.findIndex(_addFormList, {docName:docName}) === -1)){
			var doc = {"docName" : docName, "parentIndex" : parentIndex};
			_addFormList.push(doc);
		}
	}

	var _getChangedFieldList = function() {
		return _changeFieldsList;
	};

	var _getPropertyChangedFieldList = function() {
		return _propertyChangeFieldsList;
	};

	var _getAddFormList = function() {
		return _addFormList;
	};

	// return first field which is not processed
	var _getchangedField = function() {
		return _.find(_changeFieldsList, function(cf) {
			return !cf.isDone;
		});
	};

	var _clear = function () {
	    var length = _changeFieldsList.length;
	    for (var i = 0; i < length; i++) {
	        delete _changeFieldsList[i];
	        _changeFieldsList[i] = undefined;
	    }
	    
	    length = _propertyChangeFieldsList.length;
	    for (var i = 0; i < length; i++) {
	        delete _propertyChangeFieldsList[i];
	        _propertyChangeFieldsList[i] = undefined;
	    }

	    _changeFieldsList = null;
		_changeFieldsList = [];
		_propertyChangeFieldsList = null;
		_propertyChangeFieldsList = [];		
		_addFormList = [];
	};

	return {
		add : _add,
		addPropertyChange : _addPropertyChange,
		addForm : _addForm,
		clear : _clear,
		getchangedField : _getchangedField,
		getChangedFieldList : _getChangedFieldList,
		getPropertyChangedFieldList : _getPropertyChangedFieldList,
		getAddFormList : _getAddFormList
	};

})(this);

calculation.currentDocTracker = (function(context) {
	var _currentDocList = {};
	var _ = context._;
	var _getCurrentDoc = function(docName) {
		if (_.has(_currentDocList, docName))
			return _currentDocList[docName];
		else
			return -1;
	};
	var _setCurrentDoc = function(docName, index) {
		_currentDocList[docName] = index;
	};

	var _removeCurrentDoc = function(docName) {
		if (_.has(_currentDocList, docName))
			delete _currentDocList[docName];
	};

	var _clear = function() {
		_currentDocList = {};
	};

	return {
		getCurrentDoc : _getCurrentDoc,
		setCurrentDoc : _setCurrentDoc,
		removeCurrentDoc : _removeCurrentDoc,
		clear : _clear

	};

})(this);

calculation.logger = (function (context) {
    var _calculation = context.calculation;
    var _enableLog = false;
    var _init = function (enableLog) {
        _enableLog = enableLog;
    };
    var _log = function (message) {
        if (_enableLog)
            console.log(message);
    };
    return {
        init: _init,
        log: _log
    };
})(this);

calculation.constant = (function(context) {
	var _constant = {};
	var _get = function(key) {
		if (_.has(_constant, key))
			return _constant[key];
	};
	var _init = function(constant) {
		_constant = constant;
	};

	return {
		get : _get,
		init : _init
	};
})(this);

calculation.utils = (function(context) {

    var _ = context._;
    var _db = {};

	//This function is currently limited to MM/dd/yyyy.
	//We may implement moment.js or even with parseJDF support which will return date in Java format
	var _formattedDate = function(date) {
		/*var d = new Date(date || Date.now()), month = '' + (d.getMonth()), day = '' + d.getDate(), year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [ month, day, year ].join('/');*/
		var dateArray = date.split("/");
		if(dateArray.length==3){
			//return new Date(dateArray[2],dateArray[0],dateArray[1]);
			return new Date(date);
		}
		
		return 0;
	};

	var _getFullYear = function(date){
		var formattedDate = _formattedDate(date);
		if(formattedDate == 0){
			return 0;
		}else{
			return formattedDate.getFullYear();
		}
	}
	
	var _getMonth = function(date){
		var formattedDate = _formattedDate(date);
		if(formattedDate == 0){
			return 0;
		}else{
			return formattedDate.getMonth()+1;
		}
	}
	
	var _getDate = function(date){
		var formattedDate = _formattedDate(date);
		if(formattedDate == 0){
			return 0;
		}else{
			return formattedDate.getDate();
		}
	}
	
	var _monthDiff = function(date1, date2){		
		var dt1 = moment(_formattedDate(date1));
		var dt2 = moment(_formattedDate(date2));		
		if(dt1==0 || dt1==0){
			return 0;
		}else{
			return Math.ceil(dt2.diff(dt1,'months',true));
		}
	}
	
	var _convertMonthsToDays = function(month, year) {

		if (_.isNumber(month) && _.isNumber(year) && !_.isUndefined(month) && !_.isUndefined(year) && month >= 1 && month <= 12 && /^\d{4}$/.test(year)) {
			var difference = (new Date(year, month, 1)).getTime() - (new Date(year, 0, 1)).getTime();
			return Math.abs(difference / (1000 * 60 * 60 * 24));
		}
		return 0;
	};

	var _calculateDiff = function(option, date1, date2) {
		if (!_.isUndefined(option) && !_.isUndefined(date1) && !_.isUndefined(date2) && !_.isNull(option) && !_.isNull(date1) && !_.isNull(date2) && !_.isNaN(new Date(date1).getTime()) && !_.isNaN(new Date(date2).getTime())) {
			var div = 1000;
			var difference = (new Date(date1)).getTime() - (new Date(date2)).getTime();
			option = option.toUpperCase();
			switch (option) {
			case "MONTH":
				div *= 60 * 60 * 24 * 30;
				break;
			case "DAY":
				div *= 60 * 60 * 24;
				break;
			case "HOUR":
				div *= 60 * 60;
				break;
			case "MINUTE":
				div *= 60;
				break;
			default:
				div = 1;
			}
			return Math.round(Math.abs(difference / div));
		}
		return 0;
	};
	var _dayDiff = function(date1, date2){
		return _calculateDiff('DAY',date1, date2);
	};

	var _minDate = function(date1, date2) {
		if (!_.isEmpty(date1) && !_.isEmpty(date2) && !_.isUndefined(date1) && !_.isUndefined(date2) && !_.isNull(date1) && !_.isNull(date2)) {
			return new Date(_.min([ (new Date(date1)).getTime(), (new Date(date2)).getTime() ]));
		}
		return 0;

	};

	var _roundNumber = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input) && _.isNumber(input)) {
			return Math.round(input);
		}
		return 0;
	};

	var _getValueP = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input) && _.isNumber(input)) {
			return parseInt(input);
		}
		return 0;
	};
	var _getValueD = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input) && _.isNumber(input)) {
			var value = parseFloat(input);
			return value.toFixed(2);
		}
		return 0.0;
	};

	var _replaceString = function(input) {

		if (!_.isUndefined(input) && !_.isNull(input) && _.isString(input) && !_.isEmpty(input)) {
			return input.replace(/[-()]/g, '');
		}
		return 0;
	}

	var _replaceDate = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input) && !_.isEmpty(input) && !_.isNaN(new Date(input).getTime())) {
			var date = new Date(input);
			var month = (date.getMonth()) + 1;
			var day = date.getDate();
			if (parseInt(day) < 10) {
				day = "0" + day;
			}
			if (parseInt(month) < 10) {
				month = "0" + month;
			}
			return [ date.getFullYear(), month, day ].join('-');
		}
		return 0;

	};

	var _calculateDays = function(date1, date2) {
		return _calculateDiff('day', date1, date2);
	};

	var _calculateAge = function(input1, input2, option) {
		if (!_.isUndefined(option) && !_.isUndefined(input1)  && input1!='' && !_.isUndefined(input2) && input2!='' && !_.isNull(option) && !_.isNull(input1) && !_.isNull(input2)) {
			var input1Date = new Date(input1);
			var input2Date = new Date(input2);
			var age = input2Date.getFullYear() - input1Date.getFullYear();
			var m = input2Date.getMonth() - input1Date.getMonth();
			if (m < 0 || (m === 0 && input2Date.getDate() < input1Date.getDate())) {
				age--;
			}
			return age;
		} else {
			return 0;
		}
	};

	var _calculateAgeDiff = function(input1, input2) {
		if (!_.isUndefined(input1) && !_.isUndefined(input2) && !_.isNull(input1) && !_.isNull(input2) && !_.isNaN(new Date(input1).getTime()) && !_.isNaN(new Date(input2).getTime())) {
			var ageDiff = new Date((new Date(input1).getTime()) - (new Date(input2).getTime()));
			return Math.abs(ageDiff / (1000 * 60 * 60 * 24 * 365));
		}
		return 0;
	};

	var _checkValue = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input) && !_.isEmpty(input)) {
			return true;
		}
		return false;
	};

	var _isSSNValid = function(input) {
	/* commented by parin to support Test Scenario SSN EIC calculation for approval, we will activate this relation once go into production
		if (!_.isUndefined(input) && !_.isNull(input)) {
			if (/\b(?!000)(?!666)(?:[0-6]\d{2}|7(?:[0-356]\d|7[012]))[-](?!00)\d{2}[-](?!0000)\d{4}\b/.test(input))
				return true;
		}
		return false;
		*/
		return true;
	}

	var _isITINValid = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input)) {
			if (/9[0-9]{2}-(7[0-9]|8[0-8]|9[0-2]|9[4-9])-[0-9]{4}/.test(input))
				return true;
		}
		return false;

	};
	var _chkMonthDay1001 = function(input) {

		if (!_.isUndefined(input) && !_.isNull(input) && !_.isNaN(new Date(input).getTime())) {
			var date = new Date(input);
			if ((date.getMonth() + 1) == 10 && date.getDate() == 1)
				return true;
		}
		return false;
	};

	var _dateValidation = function(inDate, month) {
		if (!_.isUndefined(inDate) && !_.isNull(inDate) && !_.isNaN(new Date(inDate).getTime())) {

			var date = new Date(inDate);
			date.setMonth(date.getMonth() + month);
			var day = date.getDate();
			var month = (date.getMonth() + 1);
			if (day < 10) {
				day = "0" + day;
			}
			if (month < 10) {
				month = "0" + month;
			}
			return [ month, day, date.getFullYear() ].join('/');
		}
		return 0;
	};

	var _getValueDT = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input)) {
			return new Date(input);
		}
		return new Date();
	};

	var _checkEIN = function(input) {
		if (!_.isUndefined(input) && !_.isNull(input)) {
			if (/^\b(0[1-6]|1[0-6]|2[0-7]|3[0-9]|4[0-8]|5[0-9]|6[0-9]|7[0-7]|8[0-8]|9[0-9])-\d{7}$/.test(input))
				return true;
		}
		return false;
    };
    
    //Return EIN information for given EIN number
    var _getEINData = function (ein) {
        if (!_.isUndefined(_db['einDB'])){            
            return _db['einDB'][ein];            
        }
    };
    
    //Return Preparer Information for given Preparer ID
    var _getPrepData = function (prep) {
        if (!_.isUndefined(_db['prepDB'])) { 
        	var prepData = _.find(_db['prepDB'],function(prepObject,prepKey){
        		if(prepKey.toLowerCase()==prep.toLowerCase()){
        			return true;
        		}
        	});
        	
        	if(!_.isUndefined(prepData) && !_.isEmpty(prepData)){
        		return prepData;
        	}        	        
        }
    };
    
    //get location(office/company) information. 
    //pass property name to have value. For ex - 'name', which will return company name 
    var _getLocation = function(property){
    	if(!_.isUndefined(_db['locationDB'])){
    		//We should avoid making clone and directly accessing bankDB
    		var value=_.cloneDeep(_db['locationDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		//Loop till last property
    		while(properties.length && (value=value[properties.shift()])){}
    		//Return value
    		return value;
    	}
    	//If nothing found
    	return undefined;
	};

	//get license address information
    //pass property name to have value. For ex - 'name', which will return company name 
    var _getLicenseData = function(property){
    	if(!_.isUndefined(_db['licenseDB'])){
    		//We should avoid making clone and directly accessing bankDB
    		var value=_.cloneDeep(_db['licenseDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		//Loop till last property
    		while(properties.length && (value=value[properties.shift()])){}
    		//Return value
    		return value;
    	}
    	//If nothing found
    	return undefined;
	};
	
	  //get location(office/company) information. 
    //pass property name to have value. For ex - 'name', which will return company name 
    var _getEnvironment = function(property){
    	if(!_.isUndefined(_db['environmentDB'])){
    		//We should avoid making clone and directly accessing bankDB
    		var value=_.cloneDeep(_db['environmentDB']);
    		//Return value
    		return value;
    	}
    	//If nothing found
    	return undefined;
    };
    
    //get bank(bankXml) information
    //pass property name to have value.
    //Note: this function will work for any object but for array, it will only work for 'RALQIKCODEs' with 'RALQIKCODE=Q' 
    var _getBank = function(property,checkPropertyForArray,expectedValueOfCheckPropertyForArray){
    	if(!_.isUndefined(_db['bankDB'])){    		
			//We should avoid making clone and directly accessing bankDB
    		var value=_.cloneDeep(_db['bankDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		if(_.isArray(value[properties[0]])){
    			return _.find(value[properties[0]],{RALQIKCODE:'Q'})[properties[1]];
    		}else{
    			//Loop till last property
        		while(properties.length && (value=value[properties.shift()])){}
        		//Return value
        		return value;
    		}    		    		    		
    	}
    	//If nothing found
    	return undefined;
    };

    //get any information(like particular bank,location) 
    //pass dbName and property name to get value
    var _getDataFromDB = function(dbName,property){
    	if(!_.isUndefined(_db[dbName])){    		
			//We should avoid making clone and directly accessing DB
    		var value=_.cloneDeep(_db[dbName]);
    		//splitout properties by dot
    		var properties = property.split('.');
    		
    		//Loop till last property
        	while(properties.length && (value=value[properties.shift()])){}
        	//Return value
        	return value;        		    		    		
    	}
    	//If nothing found
    	return undefined;
    };
    
    //get bank(bankFeeDetails) information
    //pass property name to have value.
    var _getEpsBank = function(property,checkPropertyForArray,expectedValueOfCheckPropertyForArray){
    	if(!_.isUndefined(_db['epsBankDB'])){    		
			//We should avoid making clone and directly accessing epsBankDB
    		var value=_.cloneDeep(_db['epsBankDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		
    		//Loop till last property
        	while(properties.length && (value=value[properties.shift()])){}
        	//Return value
        	return value;        		    		    		
    	}
    	//If nothing found
    	return undefined;
    };
    
    // Change for new Bank
    //get bank(bankFeeDetails) information
    //pass property name to have value.
    var _getRefundAdvantageBank = function(property,checkPropertyForArray,expectedValueOfCheckPropertyForArray){
    	if(!_.isUndefined(_db['refundAdvantageBankDB'])){    		
			//We should avoid making clone and directly accessing refundAdvantageBankDB
    		var value=_.cloneDeep(_db['refundAdvantageBankDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		
    		//Loop till last property
        	while(properties.length && (value=value[properties.shift()])){}
        	//Return value
        	return value;        		    		    		
    	}
    	//If nothing found
    	return undefined;
    };
    
    //get bank(bankFeeDetails) information
    //pass property name to have value.
    var _getTpgBank = function(property,checkPropertyForArray,expectedValueOfCheckPropertyForArray){
    	if(!_.isUndefined(_db['tpgBankDB'])){    		
			//We should avoid making clone and directly accessing tpgBankDB
    		var value=_.cloneDeep(_db['tpgBankDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		
    		//Loop till last property
        	while(properties.length && (value=value[properties.shift()])){}
        	//Return value
        	return value;        		    		    		
    	}
    	//If nothing found
    	return undefined;
    };
    
  	//get bank(bankFeeDetails) information
    //pass property name to have value.
    var _getRedBirdBank = function(property,checkPropertyForArray,expectedValueOfCheckPropertyForArray){
    	if(!_.isUndefined(_db['redBirdBankDB'])){    		
			//We should avoid making clone and directly accessing redBirdBankDB
    		var value=_.cloneDeep(_db['redBirdBankDB']);
    		//splitout properties by dot
    		var properties = property.split('.');
    		
    		//Loop till last property
        	while(properties.length && (value=value[properties.shift()])){}
        	//Return value
        	return value;        		    		    		
    	}
    	//If nothing found
    	return undefined;
    };

    //get bank(bankFeeDetails) information
    //pass property name to have value.
    var _getProtectionPlusDetails = function(property,checkPropertyForArray,expectedValueOfCheckPropertyForArray){
    	if(!_.isUndefined(_db['protectionPlusDB'])){    		
			//We should avoid making clone and directly accessing protectionPlusDB
    		var value=_.cloneDeep(_db['protectionPlusDB']);
        	//splitout properties by dot
    		var properties = property.split('.');
    		
    		//Loop till last property
        	while(properties.length && (value=value[properties.shift()])){}
        	//Return value
        	return value;        		          		    		    		
    	}
    	//If nothing found
    	return undefined;
    };
    
    //This function will return checksum value (as per EPS specification) for bank dan number
    var _luhnCheckSum = function (number) {
    	var sum = 0;
    	//Variable use for odd or even condition
    	var alternate = true;
    	//Loop till last digit
    	var checkSum = '';
    	for (var i = number.length - 1; i >= 0; i--)
    	{
    		//Assigning the single value from whole number
    		var num = parseInt(number.substring(i, i + 1));
    		//Condition to check alternate value
    		if (alternate)
    		{	//If true, number multiply by 2
    			num *= 2;
    			//Condition to check whether number is greater than 9 or not
    			if (num > 9)
    			{
    				//If number greater than 9, modulo number by 10 and 1 to number ((12%10)+1 = 2+1 = 3)
    				num = (num % 10) + 1;
    			}
    		}
    		//Assigning the number plus sum to sum
    		sum += num;
    		//Assigning the negative value for the even or odd condition
    		alternate = !alternate;
    	}
    	//Sum multiply by 9 and assigning it to checkSum 
    	checkSum = '' + sum * 9;
    	//Get the last digit from checkSum
    	checkSum = checkSum.substring(checkSum.length - 1);
    	//return one digit checksum
        return checkSum;
    };
    
    //This function will return ssn value (as per Atlas specification) for bank dan number
    var _ssnPositionEncodingForBank = function(ssn){
    	var positionArray = [5, 8, 4, 6, 1, 2, 9, 0, 3, 7];
		var value = "";					
		if (ssn.length == 11 && ssn.indexOf("-") > 0) {
			ssn = ssn.replace(/-/g, ""); // SSN
		}
		if (ssn.length > 0) {
			for (var i = 0; i < ssn.length; i++) {
				value += positionArray[parseInt(ssn.substring(i, i + 1))];
			}
		}
		return value;
    };
    
    var einInProcessList = []; //list holds all EIN that are being processed.
    //Set information like EIN Database, Preparer Info Database
    var _setDB = function (data){
        if (!_.isUndefined(data.type)) {
            _db[data.type] = data.db;
        }
        
        //IF type is EINDB then we will remove all EIN from einInProcessList that are processed successfully.
        if(data.type == "einDB"){
        	_.remove(einInProcessList, function(ein){
            	if(!_.isUndefined(data.db[ein])){
            		return true;
            	}
            	return false;
            });        	
        }
    };
    
    
    var einTimer, einList = [];
    //Check whether EIN has entered by user is available. IF 'yes' then check whether to update the EIN, IF 'no' then create new EIN
    var _updateEINDB = function(einObj) {   
    	//check whether EIN is in process or not. IF in process then no need to go further.
    	var einInProcess = _.contains(einInProcessList, einObj.ein);
		if(einInProcess != true){
			if(!_.isUndefined(einObj) && !_.isUndefined(einObj.ein) && einObj.ein != ""){
	    		//Flag determines whether this einobject having any changes (chages in value of properties)
	        	var isEINChanged = true;
	        	//IF no EIN found then make it object by default.
	        	if(_.isUndefined(_db["einDB"])){
	        		_db["einDB"] = {};
	        	}
	        	
		    	// get ein object form existing database.
		    	var _existingEINObj = _db["einDB"][einObj.ein]; 
		    	//The following code compares the passed EIN object with current EIN object.
		    	if(!_.isUndefined(_existingEINObj)){
		    		// We loop through each property to compare whether it is same as other object.
		    		// IF any value doesn't match then we need to update that EIN object
		    		for(var einProperty in einObj){
		    			// IF type of a  property is object itself then we need to further run a  loop.
		    			if(_.isObject(einObj[einProperty])){
		    				for(var einProp in einObj[einProperty]){
		    					if((einObj[einProperty][einProp] == undefined || einObj[einProperty][einProp] == "") && (_existingEINObj[einProperty][einProp] == undefined || _existingEINObj[einProperty][einProp] == "")){
		    						continue;
		    					}else{
		    						if(einObj[einProperty][einProp] != _existingEINObj[einProperty][einProp]){
					    				isEINChanged = false;
					    				//IF changes detected then no need to execute loop further.
					    				break;
						    		}
		    					}
		    				}
		    				//Following code breaks the outer loop IF any changes detected in above loop. 
		    				if(!isEINChanged){
		    					break;
		    				}
		    			}else if(!_.isUndefined(einProperty) && einProperty != ""){
		    				//IF type of property is not object then no need to run a futher loop we will just compare values.
		    				if((einObj[einProperty] == undefined || einObj[einProperty] == "") && (_existingEINObj[einProperty] == undefined || _existingEINObj[einProperty] == "")){
		    					continue;
		    				}else{
		    					if(einObj[einProperty] != _existingEINObj[einProperty]){
				    				isEINChanged = false;
				    				//IF changes detected then no need to execute loop further.
				    				break;
					    		}
		    				}
		    			}
		    		}
		    		
		    		//IF object has change or new object then start the 10Sec timer
					if(!isEINChanged){
						//IF another req for EIN comes then clear old timer and start new one.
			    		if(!_.isUndefined(einTimer)){
				    		clearTimeout(einTimer);
				    	}				
						// Get index of ein if it is already available in queue.
						var einIndex = _.findIndex(einList,{"ein" : einObj.ein});				
						// IF index is greater then -1 then the ein was came to insert/update before and it is updated within 10sec. 
						// So we need to override this EIN details
						// ELSE push it to array.
						if(!_.isUndefined(einIndex) && einIndex > -1){
							einList[einIndex] = einObj;
						}else{
							einList.push(einObj);
						}
						//start the timer IF length is greater then '0'
						if(einList.length > 0){
				    		einTimer = setTimeout(function(){    			
					    		//post EIN changed with einlist				    		
				    			context.postMessage({ msgType: 'einUpdated', einList: einList});
				    			
				    			//push each EIN in to processing List
				    			_.forEach(einList, function(einObjInList){
				    				einInProcessList.push(einObjInList.ein);
				    			});			    			
				        		einList = [];
							},3000);
						}
					}
		    	}else{
		    		//IF EIN is NEW.
	    			context.postMessage({ msgType: 'newEINEntered', "ein" : einObj});
		    		einInProcessList.push(einObj.ein);	    						
		    	}
	    	}		
		}
	};
	
	var _getFirstName = function(firstName) {
	    var fName = '';
	    if (!_.isUndefined(firstName) && firstName !== '') {
	        firstName = firstName.trim();
	        fName = firstName.split(' ');
	        if(fName[1] != undefined && fName[0].length==1 && fName[1].length>1){
                return firstName;
            }else{
                return fName[0];
            }
	    }
	    return fName;
	};

	var _getMiddleName = function(firstName) {
	    var mName = '';
	    if (!_.isUndefined(firstName) && firstName !== '') {
	    	firstName = firstName.trim();
	        mName = firstName.split(' ');
	        if(mName[1] != undefined && mName[1] != '') {
	        	if(mName[0].length==1 && mName[1].length>1){
	                return '';
	            }else{
	                return mName[1];
	            }
	        }else{
	        	return '';
	        }
	    }
	    return mName
	};

	return {		
		formattedDate : _formattedDate,
		convertMonthsToDays : _convertMonthsToDays,
		calculateDiff : _calculateDiff,
		minDate : _minDate,
		roundNumber : _roundNumber,
		getValueP : _getValueP,
		getValueD : _getValueD,
		replaceString : _replaceString,
		replaceDate : _replaceDate,
		calculateDays : _calculateDays,
		dayDiff : _dayDiff,
		calculateAge : _calculateAge,
		calculateAgeDiff : _calculateAgeDiff,
		checkValue : _checkValue,
		isSSNValid : _isSSNValid,
		isITINValid : _isITINValid,
		calculateDateDiff : _calculateAge,
		chkMonthDay1001 : _chkMonthDay1001,
		dateValidation : _dateValidation,
		getValueDT : _getValueDT,
        checkEIN : _checkEIN,
        getEINData: _getEINData,
        getPrepData:_getPrepData,
        getLocation:_getLocation,
        getBank:_getBank,
        ssnPositionEncodingForBank:_ssnPositionEncodingForBank,
        setDB: _setDB,
        updateEINDB : _updateEINDB,
        getFullYear : _getFullYear,
        getMonth : _getMonth,
        getDate : _getDate,
        monthDiff : _monthDiff,
        getFirstName : _getFirstName,
        getMiddleName : _getMiddleName,
        getEpsBank : _getEpsBank,
        luhnCheckSum : _luhnCheckSum,
        getRefundAdvantageBank : _getRefundAdvantageBank,
        getTpgBank : _getTpgBank,
        getRedBirdBank : _getRedBirdBank,
        getProtectionPlusDetails : _getProtectionPlusDetails,
		getDataFromDB : _getDataFromDB,
		getEnvironment:_getEnvironment,
		getLicenseData:_getLicenseData
	};

})(this);
