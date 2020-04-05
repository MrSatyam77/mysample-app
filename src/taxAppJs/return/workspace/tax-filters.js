angular.module('returnApp').filter('localText',['contentService', function (contentService){
    return function (key,defaultText) {
        return contentService.getLocalizedValue(key) || defaultText || key;
    };
}]);
angular.module('returnApp').filter('maskFormat', ['contentService', function (contentService) {
    return function (field,fieldName) {
        if (!_.isUndefined(field) && !_.isUndefined(field.type))
            return contentService.getMask(field.type);
        else
        return contentService.getFieldMask(fieldName);
    };
}]);

angular.module('returnApp').filter('fieldType',['contentService',function(contentService){
	return function(field,fieldName){
		if (!_.isUndefined(field) && !_.isUndefined(field.type))
			return field.type;
		else{
			var result = contentService.getFieldType(fieldName);
			if(!_.isUndefined(result)){
				return result;
			}else{
				return "";
			}
		}
	};
}]);

angular.module('returnApp').filter('patternFormat', ['contentService', function (contentService) {
    return function (fieldName) {
    	var result = contentService.getFieldPattern(fieldName);
    	if(!_.isUndefined(result) && !_.isUndefined(result.pattern)){
    		return result.pattern;
    	}else{
    		return {};
    	}        
    };
}]);

angular.module('returnApp').filter('maxLength', ['contentService', function (contentService) {
    return function (fieldName) {
        return contentService.getFieldMaxLength(fieldName);
    };
}]);

angular.module('returnApp').filter('required', ['_','contentService', function (_, contentService) {
    return function (field, fieldName) {
        if (!_.isUndefined(field) && !_.isUndefined(field.value) && field.value !== "")
            return false;
        else if (!_.isUndefined(field) && !_.isUndefined(field.isRequired))
            return field.isRequired;
        else
            return contentService.getFieldIsRequired(fieldName);
    };
}]);

angular.module('returnApp').filter('enabled', ['_',function (_) {
    return function (field) {
        if (!_.isUndefined(field) && !_.isUndefined(field.isEnabled))
            return field.isEnabled;
        else
            return true;
    };
}]);
        
angular.module('returnApp').filter('calculatedContext', ['_', 'contentService', function (_, contentService) {
    return function (field, fieldName) {
            if (!_.isUndefined(field) && !_.isUndefined(field.isCalculated))
                return field.isCalculated;
            else
                return contentService.getFieldIsCalculated(fieldName);
    };
}]);


angular.module('returnApp').filter('calculated', ['_', 'contentService', function (_, contentService) {
    return function (field, fieldName) {
            if (!_.isUndefined(field) && !_.isUndefined(field.isCalculated) && (_.isUndefined(field.isOverridden) || field.isOverridden === false))
                return field.isCalculated;
            else if (!_.isUndefined(field) && !_.isUndefined(field.isOverridden) && field.isOverridden === true)
                return false;
            else
                return contentService.getFieldIsCalculated(fieldName);  
    };
}]);

angular.module('returnApp').filter('estimated',['_', function(_){
    return function(field){
       if(!_.isUndefined(field) && !_.isUndefined(field.isEstimated))
            return field.isEstimated;
        else 
          return false; 
    }
}]);

angular.module('returnApp').filter('overridden', ['_',function (_) {
    return function (field) {
        if (!_.isUndefined(field) && !_.isUndefined(field.isOverridden))
            return field.isOverridden;
        else
            return false;           
  };
}]);

angular.module('returnApp').filter('categoryFilter', ['_', 'contentService', function (_, contentService) {
    return function (forms, category) {    	
        var filtered = [];
        angular.forEach(forms, function (form) {
            var formProp = contentService.getFormProp(form.formName);
            if (!_.isUndefined(formProp) && !_.isUndefined(formProp.category) && formProp.category === category && formProp.isHiddenForm !== true) {
                filtered.push(form);
            }
        });        
        return filtered;
    };
}]);

/**
 * Filter formslist based on passed state.
 * It is currently used in state accordian on left pane
 * Note: Due to issue of lower/upper case. here we converted passed state to uppercase. 
 * (In dom and structure in static project state is used in lower case. While in form list and for display it is used in upper case) 
 */
angular.module('returnApp').filter('stateFilter', ['_', 'contentService', function (_, contentService) {
    return function (forms, state) {    	
        var filtered = [];
        angular.forEach(forms, function (form) {
            var formProp = contentService.getFormProp(form.formName);
            if (!_.isUndefined(formProp) && !_.isUndefined(formProp.state) && formProp.state.toLowerCase() === state.toLowerCase()) {
                filtered.push(form);
            }
        });        
        return filtered;
    };
}]);

//Note: category removed from argument as it is not required for this filter
angular.module('returnApp').filter('canDeleteForm', ['_', 'contentService', function (_, contentService) {
    return function (formName) {
        var formProp = contentService.getFormProp(formName);
        return _.isUndefined(formProp) ? false : formProp.canDelete;
    };
}]);

angular.module('returnApp').filter('formDisplayName', ['_', 'contentService', function (_, contentService) {
    return function (formName) {
        var formProp = contentService.getFormProp(formName);
        return _.isUndefined(formProp) ? formName : formProp.displayName;
    };
}]);

angular.module('returnApp').filter('formDescription', ['_', 'contentService', function (_, contentService) {
    return function (formName) {
        var formProp = contentService.getFormProp(formName);
        return _.isUndefined(formProp) ? "" : formProp.description;
    };
}]);

/**
 * filter that find if the form properties hold the isHiddenForm property
 * This filter is made to add property in extendedProperties to hide the interview form in input mode
 * Note:- we have directly return the value before checking weather it is undefined because we check it at place where we have used it 
 */
angular.module('returnApp').filter('hiddenForm',['contentService',function(contentService){
	return function (formName) {
        var formProp = contentService.getFormProp(formName);
        return _.isUndefined(formProp)?undefined:formProp.isHiddenForm;
    };
}]);

/**
 * filter to get the display version of the form and if not available than we pass "preview" as default
 */
angular.module('returnApp').filter('formStatus', ['_', 'contentService', function (_, contentService) {
    return function (formName) {
        var formProp = contentService.getFormProp(formName);
        return (_.isUndefined(formProp) || _.isUndefined(formProp.status))  ? 'Preview' : formProp.status;
    };
}]);

angular.module('returnApp').filter('formPrefix', ['_', 'contentService','returnService', function (_, contentService,returnService) {
    return function (form) {
        var formProp = contentService.getFormProp(form.formName);
        if (_.isUndefined(formProp) || _.isUndefined(formProp.prefix) || _.isEqual(formProp.prefix, ""))
            return;
        var prefixText = returnService.getPrefixText(form, formProp.prefix);
        if (!_.isUndefined(prefixText) && !_.isEqual(prefixText,"")){
            var template = '(prefix)';
            if (prefixText.length > 25)
                prefixText = prefixText.substring(0, 26) + '...';
            prefixText = template.replace('prefix', prefixText);
            return prefixText;
        }
        else 
            return "";
    };
}]);

//Zipcode filter - will return object having city and state.
//Note: This filter get information from contetnService. 
//The reason to create such a layer is to have code re-usability as filter can be used from controller as well as view(html) 
angular.module('returnApp').filter('zipCode',['contentService',function(contentService){
	return function(zipCode){
		//Get city and state from contentService.
		//Note: ccontetService holds zipList under _resources.
		var result = contentService.getCityState(zipCode);
		//If result is undefined return blank city & state
		if(angular.isUndefined(result)){
			result = {'city':'','state':''};
		}		
		//Return object
		return result;
	};
}]);

//Left pane - add form filter - Start
/*angular.module('returnApp').filter('formStatus',['returnService',function(returnService){
	return function(form){
		var result = returnService.getDocStatus(form.docName,form.docId);
		if(angular.isDefined(form.extendedProperties)){
			form.extendedProperties.status = result;
		}else{
			form.extendedProperties = {status:result};
		}
		
		return form;
	};
}]);*/

/**
 * This filter is used to filter given form list based on FormName or DisplayName or Description (form list properties)
 * Note: From 2015, we have introduced form status, so we only filter status if tax year is not 2014
 */
angular.module('returnApp').filter('addFormFilter',['_', '$filter', 'environment', function(_, $filter, environment){
	return function(items,searchText){
		var filteredExact = [];
		var filteredTags = [];
		var filteredContains = [];		
		
        var _lengthOfItems = items == undefined ? 0 : items.length;

		if(searchText === undefined || searchText === ''){
		      return items;		      
		}

        //Temporary function to differentiate features as per environment (beta/live)
        var _betaOnly = function(){
            if(environment.mode=='beta' || environment.mode=='local')
                return true;
            else
                return false;
        }
		
		//Avoid '-' in search
		searchText = searchText.replace('-','');
		//Avoid 'form' keyword and trim extra spaces.
		searchText = searchText.replace('form','').toString().trim();

        // Exact serach text
        for(var i = 0; i < _lengthOfItems ; i++){
            //Case 1: Exact Match
            if (items[i].displayName.toLowerCase()==searchText.toLowerCase() ||
                items[i].formName.toLowerCase()==searchText.toLowerCase() ||
                items[i].description.toLowerCase() == searchText.toLowerCase() ||   
                (items[i].status!=undefined && items[i].status.toLowerCase() == searchText.toLowerCase())) {
                filteredExact.push(items[i]);
            }
            //Case 2: Tag match
            else if(!_.isUndefined(items[i].tags)){
                if(items[i].tags.indexOf(searchText.toLowerCase()) != -1) {
                    filteredTags.push(items[i]);    
                }    
            }
            //Case 3: contains search text
            else if (items[i].displayName.toLowerCase().indexOf(searchText.toLowerCase()) != -1 || 
                items[i].formName.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                items[i].description.toLowerCase().indexOf(searchText.toLowerCase()) != -1 ||
                (items[i].status != undefined && items[i].status.toLowerCase().indexOf(searchText.toLowerCase()) != -1)) {
                filteredContains.push(items[i]);
            }
            
        }
        
        // Filter the filteredTags item by order properties
        filteredTags = $filter('orderBy')(filteredTags, 'tagOrder');
        
        
		//TODO: Do we really need to have this commented code? Ask Zaid to remove it if not required.
		/*angular.forEach(items,function(item){
		    if (item.displayName.toLowerCase().indexOf(searchText.toLowerCase())==0 ||
		    	item.formName.toLowerCase().indexOf(searchText.toLowerCase())==0) {
		    	filteredStratsWith.push(item);
			}
		});*/
		
		return _.union(filteredExact,_.union(filteredTags,filteredContains));

	};
}]);
//Left pane - add form filter - End

/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 * This is inherited from ui-select to work in level2 lookup where there is code and text
 */
angular.module('taxApp').filter('orFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

/**
 * custom filter to manipulate the ERC grid data
 * filter is used to hide the validation data until the required and estimated data exist 
 */
angular.module('taxApp').filter('interviewERCFilter',[function(){
	return function(ercData){
		if(!_.isUndefined(ercData) && !_.isNull(ercData)){
            // filter erc data with required or estimated category
            var _filteredERCData = _.filter(ercData, function(erc){
                return erc.category == 'required' || erc.category == 'estimated';
            });
			if(!_.isUndefined(_filteredERCData) && !_.isNull(_filteredERCData) && !_.isEmpty(_filteredERCData)){
				return _filteredERCData;
			}else{
				return ercData;
			}
		}
		return ercData;
	};
}]);

/**
 * filter the custom return template based on
 * new return type id
 */
angular.module('taxApp').filter('customReturnTemplateListFilter',[ function(){
    return function(customReturnTemplateList, returnTypeId) { 
        // exact match of default return list package name to return type 
        var customReturnTemplateListFilterData =  _.filter(customReturnTemplateList, function(customReturnTemplate) {
            if(!_.isUndefined(customReturnTemplate) && !_.isUndefined(customReturnTemplate.packageName)) {
                return customReturnTemplate.packageName === returnTypeId;    
            }
        });

        return customReturnTemplateListFilterData;
    }
}]);

/*
* Filter formslist based on passed printCategory.
*/
angular.module('returnApp').filter('printPacketCategoryDialogFilter', ['_', 'contentService', function (_, contentService) {
    return function (forms, category) {     
        var filtered = [];
        angular.forEach(forms, function (form) {
            if (!_.isUndefined(form) && !_.isUndefined(form.extendedProperties.printCategory) && form.extendedProperties.printCategory === category) {
                filtered.push(form);
            }
        });        
        return filtered;
    };
}]);
