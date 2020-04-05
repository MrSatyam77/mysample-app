"use strict";
returnApp.factory('contentService', ['_', '$q', '$http', '$sce', '$templateCache', '$log', 'configService', 'dataAPI', 'userService', 'environment',
    function (_, $q, $http, $sce, $templateCache, $log, configService, dataAPI, userService, environment) {
        var _urlPatternContent = '{{baseurl}}/{{taxyear}}/content/{{package}}/{{state}}/{{type}}/{{version}}/';
        var _urlPatternTemplate = '{{baseurl}}/template/{{version}}/';
        var _urlPatternLookup = '{{baseurl}}/{{taxyear}}/content/{{package}}/lookup/{{version}}/';
        var _urlPatternDefaults = '{{baseurl}}/{{taxyear}}/content/{{package}}/defaults/{{version}}/';
        var _urlPatternResources = '{{baseurl}}/resources/{{version}}/';
        var _docs = {}; //docs cache
        var _local = {}; //local cache
        var _lineHelp = {} //line help cache
        var _lookup = {}; // looup cache
        var _forms = {}; //form cache
        var _links = {}; //links cache
        var _jumptofields = {}; //links cache
        var _resource = {};//For resources like zipList (having city and states)
        var _defaultLanguage = 'en-US';
        var _preferedLanguage = 'en-US';
        var _packageName = "";
        var _loadedPdf = []

        var _config = { baseURL: dataAPI.static_url };

        var _loadedFormInfo = []; // store docName of allready loaded all information of svg and metaInfo

        //Load config data from configService (part of common services) and merge with local _config.
        _.assign(_config, configService.getConfigData());

        //Temporary function to differentiate features as per environment (beta/live)
        var _betaOnly = function () {
            if (environment.mode == 'beta' || environment.mode == 'local')
                return true;
            else
                return false;
        }

        var _categories = _config.categories;
        var _getTemplateUrl = function () {
            var url = _urlPatternTemplate.replace('{{baseurl}}', _config.baseURL).
                replace('{{version}}', _config.versions.template);
            return url;

        };

        var _getContentUrl = function (packageName, stateName, type) {
            var url = _urlPatternContent.replace('{{baseurl}}', _config.baseURL).
                replace('{{taxyear}}', _config.taxyear).//replace('/{{taxyear}}',"").
                replace('{{package}}', packageName).
                replace('{{state}}', stateName.toLowerCase()).
                replace('{{type}}', type).
                replace('{{version}}', _config.versions[packageName][stateName.toLowerCase()][type]);
            return url;
        };

        var _getLookupUrl = function (packageName, type) {
            var url = _urlPatternLookup.replace('{{baseurl}}', _config.baseURL).
                replace('{{taxyear}}', _config.taxyear).//replace('/{{taxyear}}',"").
                replace('{{package}}', packageName).
                replace('{{version}}', _config.versions[packageName][type]);
            return url;
        };

        var _getDefaultsUrl = function (packageName) {
            var url = _urlPatternDefaults.replace('{{baseurl}}', _config.baseURL).
                replace('{{taxyear}}', _config.taxyear).//replace('/{{taxyear}}',"").
                replace('{{package}}', packageName).
                replace('{{version}}', _config.versions[packageName]['defaults']);
            return url;
        };

        var _getResourcesUrl = function () {
            var url = _urlPatternResources.replace('{{baseurl}}', _config.baseURL).replace('{{version}}', _config.versions.resources);
            return url;
        };

        //This method will download given resource files from static server
        var _loadResource = function (resourceFile) {
            var deferred = $q.defer();
            var resourceUrl = _getResourcesUrl() + resourceFile + ".json";
            resourceUrl = $sce.getTrustedResourceUrl(resourceUrl);
            $http.get(resourceUrl, { cache: $templateCache }).then(function (response) {
                deferred.resolve(response.data);
            }, function (reason) {
                $log.error(reason);
                deferred.reject(reason);
            });
            return deferred.promise;
        };

        //split function this is copied from calc-service
        var _getField = function (fieldName) {
            var field;
            if (!_.isUndefined(fieldName)) {
                var s = fieldName;
                s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                s = s.replace(/^\./, '');           // strip a leading dot
                var a = s.split('.');
                var docName = a.shift();
                var fName = a.shift();

                if (_.has(_docs, docName) && _.has(_docs[docName], fName))
                    field = _docs[docName][fName];
            }
            return field;
        };

        var _getMask = function (type) {
            if (_.isUndefined(type))
                return '';
            switch (type.toLowerCase()) {
                case 'zipcode':
                case 'pin':
                    return '99999';
                case 'ssn':
                case 'itin':
                    return '999-99-9999';
                case 'date':
                    return '99/99/9999';
                case 'ein':
                    return '99-9999999';
                case 'efin':
                    return '999999';
                case 'phone':
                    return '(999)999-9999';
                case 'ptin':
                    return 'P99999999';
                case 'stin':
                    return 'S99999999';
                case 'year':
                    return '9999';
                case 'monthyear':
                case 'MonthYear':
                    return '99/9999';
                case 'MonthDay':
                case 'monthday':
                    return '99/99';
                case 'rountingno':
                    return '999999999';
                default:
                    return '';
            }
        };

        var service = {};

        //Multi Tax Year
        //Service/factory is singleton in angular js and only invoke once. And we have to refresh taxyear everytime user make changes in taxyear combo. 
        //To avoid listener in content service, we are updating tax year, everytime return is get open. We know that it will update same taxyear everytime but it is
        //more safe and fast then broadcast-receiver. If in future any other service needs to be updated on change of taxyear we should switch to broadcast solution
        //Exclude resource (for example- zip db) which does not related to tax year
        service.refreshTaxYear = function () {
            //check if taxyear already available in contetn service is different then selected by user 
            if (_.isUndefined(_config.taxyear) || _config.taxyear == '' || _config.taxyear != userService.getTaxYear()) {
                //update taxyear
                _config.taxyear = userService.getTaxYear();

                //Invalidate resource (like forms, docs, etc...) if tax year is different (make them empty)
                _docs = {}; //docs cache
                _local = {}; //local cache
                _lineHelp = {} //line help cache
                _lookup = {}; // looup cache
                _forms = {}; //form cache
                _links = {}; //links cache

                _loadedPdf = []; // remoeve from store when change year
                _loadedFormInfo = []
                
                //Need to load configuration again as taxyear changed
                //Load config data from configService (part of common services) and merge with local _config.
                _.assign(_config, configService.getConfigData(undefined, true));
            }
        };

        //Interview Mode Changes
        service.refreshReturnMode = function (mode) {
            _config.returnMode = mode;
        }

        //when use ng-pattern then we need to include / at the beging and end
        //example '^\\d{5}$' will become '/^\\d{5}$/'
        //when field has pattern defined then use it instead of pattern defined by type
        //Note: This will return object having pattern and message as result.
        service.getFieldPattern = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field)) {
                if (field.pattern) {
                    if (field.patternMsg) {
                        return { 'pattern': field.pattern, 'patternMsg': field.patternMsg };
                    } else {
                        return { 'pattern': field.pattern };
                    }
                }
                switch (field.type.toLowerCase()) {
                    case 'money':
                        return { 'pattern': '^[0-9.\\-]*$', 'patternMsg': 'Only numbers, dot and minus sign are allowed in Money field' };
                    case 'number':
                        return { 'pattern': '^[0-9]*$', 'patternMsg': 'Only numbers, dot and minus sign are allowed in Money field' };
                    case 'alpha':
                        return { 'pattern': '^[a-z,A-Z]*$', 'patternMsg': 'Only numbers, dot and minus sign are allowed in Money field' };
                    case 'string':
                    case 'alphaplusspace':
                        return { 'pattern': '[^w*|/(\r)*/]*$', 'patternMsg': 'No special characters are allowed' };
                    case 'zipcode':
                        return { 'pattern': '[0-9]{5}(([0-9]{4})|([0-9]{7}))?', 'patternMsg': 'ZIP Code must be 5 digits plus optional 4 or 7 digits' };
                    case 'date':
                        //mm/dd/yyy
                        if (_betaOnly() == true) {
                            return { 'pattern': '((0[13578]|1[02])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](18|19|20|99)[0-9]{2})|((0[469]|11)[\/.](0[1-9]|[12][0-9]|30)[\/.](18|19|20|99)[0-9]{2})|((02)[\/.](0[1-9]|1[0-9]|2[0-8])[\/.](18|19|20)[0-9]{2})|((02)[\/.]29[\/.](((18|19|20|99)(04|08|[2468][048]|[13579][26]))|2000))', 'patternMsg': 'Invalid Date. Please enter valid date and in MM/DD/YYYY format.' };
                        } else {
                            return { 'pattern': '((0[13578]|1[02])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](18|19|20)[0-9]{2})|((0[469]|11)[\/.](0[1-9]|[12][0-9]|30)[\/.](18|19|20)[0-9]{2})|((02)[\/.](0[1-9]|1[0-9]|2[0-8])[\/.](18|19|20)[0-9]{2})|((02)[\/.]29[\/.](((18|19|20)(04|08|[2468][048]|[13579][26]))|2000))', 'patternMsg': 'Invalid Date. Please enter valid date and in MM/DD/YYYY format.' };
                        }
                    case 'monthday':
                        return { 'pattern': '^(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])$', 'patternMsg': 'Date must be in MM/DD format for this field' };
                    case 'email':
                        return { 'pattern': '^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$', 'flags': 'i', 'patternMsg': 'Please enter proper email address.' };
                    case 'accountno':
                        return { 'pattern': '([A-Za-z0-9\\-]){0,17}', 'patternMsg': 'Bank Account Number must be 17 alphanumeric characters with hyphens' };
                    case 'rountingno':
                    case 'routingno':
                        return { 'pattern': '(01|02|03|04|05|06|07|08|09|10|11|12|21|22|23|24|25|26|27|28|29|30|31|32)[0-9]{7}', 'patternMsg': 'Routing Transit Number must be 9 digits beginning with 01 through 12, or 21 through 32' };
                    case 'state':
                        return {
                            'pattern': '^(?:(A[AEKLPSRZ]|C[AOT]|D[CE]|FL|FM|GA|GU|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$',
                            'patternMsg': 'Invalid state found. Valid states are: AL, AK, AS, AZ, AR, CA, CO, MP, CT, DE, DC, FM, FL, GA, GU, HI, ID, IL, IN, IA, KS, KY, LA, ME, MH, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PW, PA, PR, RI, SC, SD, TN, TX, VI, UT, VT, VA, WA, WV, WI, WY, AA, AE, AP'
                        }
                }
            }
        };

        //This Fubnction is used to validate RoutingNo/SSN/ITIN/AITIN using algorithm
        service.getFieldAlgorithm = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field)) {
                switch (field.type.toLowerCase()) {
                    case 'rountingno':
                    case 'routingno':
                        if (_betaOnly() == false) {
                            return {
                                'message': "Invalid Routing Number",
                                'definition': function (fieldValue) {
                                    var sum = 0;
                                    for (var i = 0; i < 9; i += 3) {
                                        sum += (fieldValue[i] * 3) + (fieldValue[i + 1] * 7) + (fieldValue[i + 2] * 1);
                                    }
                                    if (sum != 0 && sum % 10 == 0)
                                        return true;
                                    return false;
                                }
                            };
                        }
                        break;

                    case 'ssn':
                        //This algorithm is only works in live
                        if (_betaOnly() == false) {
                            return {
                                'message': "Invalid SSN Number",
                                'definition': function (fieldValue) {
                                    //validation for SSN
                                    var isValidSSN = true;
                                    //regular expression pattern for SSN , ITIN and ATIN 
                                    var ssnRegex = new RegExp("^(?!219-09-9999|078-05-1120|000-00-0000|111-11-1111|222-22-2222|333-33-3333|444-44-4444|555-55-5555|666-66-6666|777-77-7777|888-88-8888|123-45-6789|234-56-7890)(?!666|000|9\\d{2})\\d{3}-(?!00)\\d{2}-(?!0{4})\\d{4}$");
                                    var itinRegex = new RegExp("^9[0-9]{2}-([7]{1}[0-9]{1}|[8]{1}[0-8]{1}|9[0-2]{1}|9[4-9]{1})-[0-9]{4}$");
                                    var atinRegex = new RegExp("^9[0-9]{2}-93-[0-9]{4}$");
                                    //here we check if value is SSN , if it is not SSN then we check for ITIN ,if it is not ITIN then we check for ATIN 
                                    if (ssnRegex.test(fieldValue) == false &&
                                        itinRegex.test(fieldValue) == false &&
                                        atinRegex.test(fieldValue) == false) {
                                        isValidSSN = false;
                                    }
                                    return isValidSSN;
                                }
                            };
                        }
                        break;
                        // case 'ein': 
                        // //This algorithm is only works in live
                        // if (_betaOnly() == false) {
                        //     return {
                        //         'message': "Invalid EIN Number",
                        //         'definition': function (fieldValue) {
                        //             //validation for EIN
                        //             var isValidEIN = true;
                        //             //regular expression pattern for EIN
                        //             var einRegex = new RegExp("^(01|02|03|04|05|06|10|11|12|13|14|16|21|22|23|25|34|50|51|52|53|54|55|56|57|58|59|60|65|67|33|39|41|42|43|46|48|62|63|64|66|68|71|72|73|74|75|76|77|82|83|84|85|86|87|88|91|92|93|98|99|20|26|27|45|46|47|81|82|83|15|24|40|44|30|32|35|36|37|38|61|94|95|80|90|31)-([0-9]{7})$");
                        //             //here we check if it is valid or not 
                        //             if (einRegex.test(fieldValue) == false){
                        //                 isValidEIN = false;
                        //             }
                        //             return isValidEIN;
                        //         }
                        //     };
                        // }
                        // break;
                }
            }
        };

        service.getMask = function (type) {
            return _getMask(type);
        };

        service.getFieldMask = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field))
                return _getMask(field.type);
        };

        service.getFieldMaxLength = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field))
                return field.maxLength;
        };

        service.getFieldIsRequired = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field))
                return field.isRequired;
        };

        service.getFieldIsCalculated = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field))
                return field.isCalculated;
        };

        service.getFieldLookupName = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field))
                return field.lookupName;
        };

        service.getFieldType = function (fieldname) {
            var field = _getField(fieldname);
            if (!_.isUndefined(field))
                return field.type;
        };

        service.getDocFields = function (docName, packageName, state) {
            var deferred = $q.defer();
            //do we already have in it cach then give it
            if (!_.isUndefined(_docs[docName]))
                deferred.resolve(_docs[docName]);
            //download it for current version and cache it  
            else {
                var url = _getContentUrl(packageName, state, 'documents') + docName + '.json';
                url = $sce.getTrustedResourceUrl(url);
                $http.get(url, { cache: $templateCache })
                    .then(function (response) {
                        var doc = response.data[docName];
                        _docs[docName] = doc;
                        deferred.resolve(_docs[docName]);
                    },
                        function (reason) {
                            deferred.reject(reason);
                        });
            }
            return deferred.promise;
        };

        service.getCalculationURL = function (packageName, state) {
            return _getContentUrl(packageName, state, 'calculations');
        };

        service.getReviewURL = function (packageName, state) {
            return _getContentUrl(packageName, state, 'reviews');
        }

        service.getLinksList = function (docName, fieldName) {
            if (!_.isUndefined(_links[docName]) && _.has(_links[docName], fieldName))
                return _links[docName][fieldName];
        };

        service.getJumpToListList = function (docName, fieldName) {
            if (!_.isUndefined(_jumptofields[docName]) && _.has(_jumptofields[docName], fieldName))
                return _jumptofields[docName][fieldName];
        };

        //This function will return array of categories.
        //Note: Currently it is static, We have to load it from server
        service.getCategories = function () {
            var deferred = $q.defer();
            deferred.resolve(_categories);
            return deferred.promise;
        };

        service.getFormProp = function (formName) {
            return _forms[formName];
        };

        // This function will return form properties by its corresponding docName
        // IT is useful in functions where we only have docName.
        service.getFormPropFromDoc = function (docName) {
            return _.find(_forms, { docName: docName });
        };

        /**
         * This function will return city and state ("City,State") based on given zipcode
         */
        service.getCityState = function (zipCode) {
            //Filter zip list and return object associated with zipcode    	
            return _resource.zipList[zipCode];
        };

        /**
         * This function filter forms based on package names and state names
         * It will accept either array or single string for both argument
         */
        service.getForms = function (packageNames, stateNames) {
            //var _packageName = _.without(packageNames,'common')[0];
            //Check if package names are passed as array or there is only one package name as string
            if (!_.isArray(packageNames)) {
                //convert single package name into array
                packageNames = [packageNames];
            }

            //Check if state names are passed as array or there is only one package name as string
            if (!_.isArray(stateNames)) {
                //convert single state name into array
                stateNames = [stateNames];
            }

            //Filter code
            var forms = _.filter(_forms, function (form) {
                if (!_.isUndefined(form.formBelongsToPackages) && _.includes(form.formBelongsToPackages.split(','), _packageName) && _.includes(stateNames, form.state.toLowerCase())) {
                    return true;
                }
            });

            //To prevent direct binding
            return angular.copy(forms);
        };

        service.getForm = function (docName) {
            var form = _.findWhere(_forms, { docName: docName });
            //check whether this form belongs to current package.
            if (!_.isUndefined(form) && !_.isUndefined(form.formBelongsToPackages) && _.includes(form.formBelongsToPackages.split(','), _packageName)) {
                return form;
            }
            //We have to return nothing IF above condition isnot true.
            return;
        };

        //This function will return formObject based on passed Id
        service.getFormFromId = function (formId) {
            return _.find(_forms, { 'id': formId });
        };

        /**
         * This function will return list of available states (Released)
         */
        service.getReleasedStates = function (packageNames) {
            var availableStates = [];

            //Check if package names are passed as array or there is only one package name as string
            if (!_.isArray(packageNames)) {
                //convert single package name into array
                packageNames = [packageNames];
            }

            //State lists from config
            var stateList = [];

            //State list from config based on package of return (excluding common)
            angular.copy(_config.stateList[_packageName], stateList);

            //Loop on package names
            angular.forEach(packageNames, function (packageName) {
                //All keys from version list 
                var packageVersionKeys = _.keys(_config.versions[packageName]);

                //convert all keys to uppercase
                /*packageVersionKeys = _.map(packageVersionKeys,function(key){
                    return key.toUpperCase();
                });*/

                _.forEach(stateList, function (state) {
                    //compare with lowercase
                    if (_.includes(packageVersionKeys, state.name.toLowerCase())) {
                        availableStates.push(state);
                    }
                });
            });

            //Remove duplicate entries
            availableStates = _.uniq(availableStates);

            return availableStates;
        };

        /**
         * This function will return string array of states for passed packageName
         */
        service.getReleasedStateNames = function (packageName, doNotConvertToLowerCase) {
            //get released state list and pluck name with lower case
            var releasedStateNames = _.pluck(service.getReleasedStates(packageName), 'name');
            //Is second argument is true then do not convert liust into lowercase
            if (doNotConvertToLowerCase != true) {
                for (var index in releasedStateNames) {
                    releasedStateNames[index] = releasedStateNames[index].toLowerCase();
                }
            }

            return releasedStateNames;
        }

        /**
         * This function will return given states with it's package details from config 
         */
        service.getStatesPackages = function (packageNames, passedStateList) {
            //copy object to avoid two way data binding
            var stateList = _.cloneDeep(passedStateList);

            //State List with package information (Including Federal)
            var updatedStateList = [];

            //convert string to array for packageNames
            if (_.isUndefined(packageNames)) {
                packageNames = [packageNames];
            }

            //Convert string to array for stateList
            if (!_.isArray(stateList)) {
                stateList = [stateList];
            }

            //check if state in stateList is not object
            _.forEach(stateList, function (state, index) {
                if (!_.isObject(state)) {
                    stateList[index] = { name: state };
                }
            });

            //Loop on package names
            angular.forEach(packageNames, function (packageName) {
                //All keys from version list 
                var packageVersionKeys = _.keys(_config.versions[packageName]);

                //Loop on states
                _.forEach(stateList, function (state) {
                    //cast state name to lowercase for comparision
                    if (_.includes(packageVersionKeys, state.name.toLowerCase())) {
                        var tempState = _.find(updatedStateList, { name: state.name });

                        if (tempState == undefined) {
                            tempState = _.cloneDeep(state);
                            tempState.packageNames = [];
                            tempState.packageNames.push(packageName);
                            updatedStateList.push(tempState);
                        } else {
                            tempState.packageNames.push(packageName);
                        }
                    }
                });
            });

            return updatedStateList;
        };

        //We are collecting flattern data: keys and values
        var copyFlatternData = function (keys, copyFrom, copyTo) {

            for (var kIndex = 0; kIndex < keys.length; kIndex++) {
                if (!_.isUndefined(copyTo[keys[kIndex]]))
                    copyTo[keys[kIndex]] = _.assign(copyTo[keys[kIndex]], copyFrom[keys[kIndex]]);
                else
                    copyTo[keys[kIndex]] = copyFrom[keys[kIndex]];
            }
        }

        service.getFormTemplate = function (form) {
            var deferred = $q.defer();
            var packageName, state;
            var formName = form.formName;
            if (_.has(_forms, formName)) {
                packageName = _forms[formName].packageName;
                state = _forms[formName].state;
            }
            var formURL = _getContentUrl(packageName, state, 'forms') + formName + (_config.returnMode == 'interview' ? 'Interview' : '') + '.html';
            var localURL = _getContentUrl(packageName, state, 'locals') + formName + (_config.returnMode == 'interview' ? 'Interview' : '') + '.json';
            formURL = $sce.getTrustedResourceUrl(formURL);
            localURL = $sce.getTrustedResourceUrl(localURL);
            //download it for current version and cache form,local in templateCache
            // we are caching local twice once in template cache and once in our local cache
            //local cache hold transformed data
            $q.all([
                $http.get(formURL, { cache: $templateCache }),
                $http.get(localURL, { cache: $templateCache })])
                .then(function (data) {
                    var form = data[0].data;
                    var localeAndLineHelp = data[1].data;
                    //if locale is undefined then use localeAndLineHelp to collect keys
                    if (localeAndLineHelp.locale == undefined) {
                        //collect keys and values
                        copyFlatternData(_.keys(localeAndLineHelp), localeAndLineHelp, _local);
                    } else {
                        //if locale and lineHelp exist
                        var localTemp = localeAndLineHelp.locale;
                        var lineHelpTemp = localeAndLineHelp.help;
                        //collect keys from _locale
                        copyFlatternData(_.keys(localTemp), localTemp, _local);
                        //collect keys from _lineHelp
                        copyFlatternData(_.keys(lineHelpTemp), lineHelpTemp, _lineHelp);

                    }

                    deferred.resolve(form);
                })
                .catch(function (reason) {
                    deferred.reject(reason);
                });

            return deferred.promise;
        };

        //This 
        service.getDefaultReturn = function (packageName) {
            var deferred = $q.defer();
            var defaultReturnURL = _getDefaultsUrl(packageName) + 'return.json';
            defaultReturnURL = $sce.getTrustedResourceUrl(defaultReturnURL);
            //download it for current version and cache default in templateCache
            $http.get(defaultReturnURL, { cache: $templateCache })
                .then(function (response) {
                    var defaultReturn = response.data;
                    deferred.resolve(defaultReturn);
                }, function (reason) {
                    $log.error(reason);
                    deferred.reject(reason);
                });
            return deferred.promise;
        };

        //This function is used to load configuration(mapping) file for spliting return (MFJ/MFS to single)
        service.getSplitReturnConfig = function () {
            var deferred = $q.defer();

            var splitReturnConfigUrl = _getDefaultsUrl('1040') + 'splitConfig.json';
            splitReturnConfigUrl - $sce.getTrustedResourceUrl(splitReturnConfigUrl);
            //download it for current version and cache default in templateCache
            $http.get(splitReturnConfigUrl, { cache: $templateCache }).then(function (response) {
                deferred.resolve(response.data);
            }, function (reason) {
                $log.error(reason);
                deferred.reject(reason);
            });

            return deferred.promise;
        };

        service.getLineTemplate = function (TemplateName) {
            var deferred = $q.defer();
            var tempalteURL = service.getLineTemplateUrl(TemplateName);
            tempalteURL = $sce.getTrustedResourceUrl(tempalteURL);
            $http.get(tempalteURL, { cache: $templateCache })
                .then(function (response) {
                    var form = response.data;
                    deferred.resolve(form);
                }, function (reason) {
                    $log.error(reason);
                    deferred.reject(reason);
                });
            return deferred.promise;
        };

        service.loadReturnTypeJson = function (fileName) {
            var deferred = $q.defer();
            //Load zip list(city and state associated with zipcodes) and append to _config
            _loadResource(fileName).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        service.loadTaxPortalConfig = function(fileName) {
            var deferred = $q.defer();
            //Load zip list(city and state associated with zipcodes) and append to _config
            _loadResource(fileName).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        service.getLookup = function (lookupName) {

            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_lookup[language], lookupName))
                language = _defaultLanguage;
            if (!_.isUndefined(_lookup[language][lookupName]))
                return _lookup[language][lookupName].entry;
        };

        service.getLookupMainGroup = function (lookupName) {
            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_lookup[language], lookupName))
                language = _defaultLanguage;

            var mainGroups = [];
            if (!_.isUndefined(_lookup[language][lookupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups))
                mainGroups = _.keys(_lookup[language][lookupName].mainGroups);

            return mainGroups;
        };

        service.getLookupByMainGroup = function (lookupName, mainGroupName) {
            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_lookup[language], lookupName))
                language = _defaultLanguage;

            var lookupitems = [];
            if (!_.isUndefined(_lookup[language][lookupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName].entry))
                lookupitems = _lookup[language][lookupName].mainGroups[mainGroupName].entry;

            return lookupitems;
        };


        service.getLookupSubGroup = function (lookupName, mainGroupName) {
            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_lookup[language], lookupName))
                language = _defaultLanguage;

            var subGroups = [];
            if (!_.isUndefined(_lookup[language][lookupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName].subGroups))
                subGroups = _.keys(_lookup[language][lookupName].mainGroups[mainGroupName].subGroups);
            return subGroups;
        };


        service.getLookupBySubGroup = function (lookupName, mainGroupName, subGroupName) {
            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_lookup[language], lookupName))
                language = _defaultLanguage;

            var lookupitems = [];
            if (!_.isUndefined(_lookup[language][lookupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName]) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName].subGroups) &&
                !_.isUndefined(_lookup[language][lookupName].mainGroups[mainGroupName].subGroups[subGroupName]))
                lookupitems = _lookup[language][lookupName].mainGroups[mainGroupName].subGroups[subGroupName].entry;
            return lookupitems;
        };



        service.getLineTemplateUrl = function (TemplateName) {
            return _getTemplateUrl() + TemplateName + '.html';
        };

        service.getLocalizedValue = function (key) {
            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_local[language], key))
                language = _defaultLanguage;

            return _local[language][key];
        };

        //Get Line Help Value to display in right pane of workspace
        service.getLineHelpValue = function (key) {
            var language = _preferedLanguage;
            //if for language lookup is not available default to english
            if (!_.has(_lineHelp[language], key))
                language = _defaultLanguage;
            //if _lineHelp is defined and also check language and key are defined. If defined then return else return blank string.
            if (!_.isUndefined(_lineHelp) && !_.isUndefined(_lineHelp[language]) && !_.isUndefined(_lineHelp[language][key])) {
                return _lineHelp[language][key];
            } else {
                return "";
            }
        };

        service.loadLookups = function (packageNames) {
            var deferred = $q.defer();
            var lookupPromises = [];
            //put every request in queue
            for (var pIndex = 0; pIndex < packageNames.length; pIndex++) {
                lookupPromises[pIndex] = service.loadLookup(packageNames[pIndex]);
            }
            //fire all request in parallel
            $q.all(lookupPromises)
                .then(function () {
                    deferred.resolve();
                })
                .catch(function (reason) {
                    $log.error(reason);
                    deferred.resolve();
                });
            return deferred.promise;
        };

        service.loadLookup = function (packageName) {
            var deferred = $q.defer();
            if (!_.isUndefined(_lookup[packageName]) && !_.isUndefined(_lookup[packageName].loaded) &&
                _lookup[packageName].loaded === true)
                deferred.resolve();
            else {
                var lookupUrl = _getLookupUrl(packageName, 'lookup') + 'lookup.json';
                lookupUrl = $sce.getTrustedResourceUrl(lookupUrl);
                if (_.isUndefined(_lookup[packageName]))
                    _lookup[packageName] = {};
                //download it for current version and cache it in $templateCache
                // we are caching lookup twice once in template cache and once in our lookup cache
                //lookup cache hold transformed data
                $http.get(lookupUrl, { cache: $templateCache })
                    .then(function (response) {
                        var lookup = response.data;
                        var keys = _.keys(lookup);
                        for (var kIndex = 0; kIndex < keys.length; kIndex++) {
                            if (!_.isUndefined(_lookup[keys[kIndex]]))
                                _lookup[keys[kIndex]] = _.assign(_lookup[keys[kIndex]], lookup[keys[kIndex]]);
                            else
                                _lookup[keys[kIndex]] = lookup[keys[kIndex]];
                        }
                        _lookup[packageName].loaded = true;
                        deferred.resolve();
                    }, function (reason) {
                        _lookup[packageName].loaded = false;
                        $log.error(reason);
                        deferred.resolve();
                    });
            }
            return deferred.promise;
        };

        service.loadFormsLists = function (statesList) {//packageNames,states
            var deferred = $q.defer();
            var formslistPromises = [];
            var counter = 0;
            //put every request in queue
            for (var sIndex = 0; sIndex < statesList.length; sIndex++) {
                for (var pIndex = 0; pIndex < statesList[sIndex].packageNames.length; pIndex++) {
                    formslistPromises[counter] = service.loadFormsList(statesList[sIndex].packageNames[pIndex], statesList[sIndex].name);
                    counter++;
                }
            }

            //fire all request in parallel
            $q.all(formslistPromises)
                .then(function () {
                    deferred.resolve();
                })
                .catch(function (reason) {
                    $log.error(reason);
                    deferred.resolve();
                });
            return deferred.promise;
        };

        service.loadFormsList = function (packageName, state) {
            var deferred = $q.defer();
            if (!_.isUndefined(_forms[packageName]) && !_.isUndefined(_forms[packageName][state]) &&
                !_.isUndefined(_forms[packageName][state].loaded) && _forms[packageName][state].loaded === true)
                deferred.resolve();
            else {
                var formsListUrl = _getContentUrl(packageName, state, 'resources') + 'formslist.json';
                formsListUrl = $sce.getTrustedResourceUrl(formsListUrl);
                if (_.isUndefined(_forms[packageName]))
                    _forms[packageName] = {};
                if (_.isUndefined(_forms[packageName][state]))
                    _forms[packageName][state] = {};

                //download it for current version and cache it in $templateCache
                // we are caching formlist twice once in template cache and once in our lookup cache
                //lookup cache hold transformed data
                $http.get(formsListUrl, { cache: $templateCache })
                    .then(function (response) {
                        var formsList = response.data;
                        _forms[packageName][state].loaded = true;
                        _forms = _.assign(_forms, formsList);
                        deferred.resolve();
                    }, function (reason) {
                        _forms[packageName][state].loaded = false;
                        $log.error(reason);
                        deferred.resolve();
                    });
            }
            return deferred.promise;

        };

        service.loadJumpToLists = function (statesList) {//packageNames,states
            var deferred = $q.defer();
            var formslistPromises = [];
            var counter = 0;
            //put every request in queue
            for (var sIndex = 0; sIndex < statesList.length; sIndex++) {
                for (var pIndex = 0; pIndex < statesList[sIndex].packageNames.length; pIndex++) {
                    formslistPromises[counter] = service.loadJumpToList(statesList[sIndex].packageNames[pIndex], statesList[sIndex].name);
                    counter++;
                }
            }

            //fire all request in parallel
            $q.all(formslistPromises)
                .then(function () {
                    deferred.resolve();
                })
                .catch(function (reason) {
                    $log.error(reason);
                    deferred.resolve();
                });
            return deferred.promise;
        };

        service.loadJumpToList = function (packageName, state) {
            var deferred = $q.defer();
            if (!_.isUndefined(_jumptofields[packageName]) && !_.isUndefined(_jumptofields[packageName][state]) &&
                !_.isUndefined(_jumptofields[packageName][state].loaded) && _jumptofields[packageName][state].loaded === true)
                deferred.resolve();
            else {
                var formsListUrl = _getContentUrl(packageName, state, 'resources') + 'jumptolist.json';
                formsListUrl = $sce.getTrustedResourceUrl(formsListUrl);
                if (_.isUndefined(_jumptofields[packageName]))
                    _jumptofields[packageName] = {};
                if (_.isUndefined(_jumptofields[packageName][state]))
                    _jumptofields[packageName][state] = {};

                //download it for current version and cache it in $templateCache
                // we are caching formlist twice once in template cache and once in our lookup cache
                //lookup cache hold transformed data
                $http.get(formsListUrl, { cache: $templateCache })
                    .then(function (response) {
                        var formsList = response.data;
                        _jumptofields[packageName][state].loaded = true;
                        _jumptofields = _.assign(_jumptofields, formsList);
                        deferred.resolve();
                    }, function (reason) {
                        _jumptofields[packageName][state].loaded = false;
                        $log.error(reason);
                        deferred.resolve();
                    });
            }
            return deferred.promise;

        };

        // This function use for call statsic Api for given Form
        service.loadPrintingForm = function (form) {//packageNames,states
            var deferred = $q.defer();
            var packageName, state;
            var formName = form.formName;
            if (_.has(_forms, formName)) {
                packageName = _forms[formName].packageName;
                state = _forms[formName].state;
            }
            if(state !== undefined && _loadedPdf[form.docName] == undefined) {
                var printURL = _getContentUrl(packageName, state, 'printing') + form.docName + '.json';
                printURL = $sce.getTrustedResourceUrl(printURL);
                //download it for current version and cache form,local in templateCache
                // we are caching local twice once in template cache and once in our local cache
                //local cache hold transformed data
                $http.get(printURL, { cache: $templateCache })
                .then(function (response) {
                    _loadedPdf.push(response.data);
                    deferred.resolve(response.data);
                })
                .catch(function (reason) {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        };


        // get preview information using this function
        service.getPreviewInfo = function() {
            return angular.copy(_loadedPdf)
        }

        // get preview information using this function
        service.getselectedPreviewInfo = function (formList) {
            if (_loadedPdf) {
                var includedForms = {}
                for (var i = 0; i < formList.length; i++) {
                    var form = formList[i];
                    if(form) {
                        for (var j = 0; j < _loadedPdf.length; j++) {
                            var info = _loadedPdf[j];
                            if (info[form.docName]) {
                                var key = Object.keys(info)[0];
                                includedForms[key] =info[key];
                                break;
                            }
                        }
                    }
                }
                return includedForms;
            }

        }
        // return Docs
        service.getReturnDocFields = function () {
            return _docs;
        };
        service.loadLinksLists = function (statesList) {//packageNames, states
            var deferred = $q.defer();
            var linkslistPromises = [];
            var counter = 0;
            //put every request in queue
            for (var sIndex = 0; sIndex < statesList.length; sIndex++) {
                for (var pIndex = 0; pIndex < statesList[sIndex].packageNames.length; pIndex++) {
                    linkslistPromises[counter] = service.loadLinksList(statesList[sIndex].packageNames[pIndex], statesList[sIndex].name);
                    counter++;
                }
            }
            //fire all request in parallel
            $q.all(linkslistPromises)
                .then(function () {
                    deferred.resolve();
                })
                .catch(function (reason) {
                    $log.error(reason);
                    deferred.resolve();
                });
            return deferred.promise;
        };

        service.loadLinksList = function (packageName, state) {
            var deferred = $q.defer();
            if (!_.isUndefined(_links[packageName]) && !_.isUndefined(_links[packageName][state]) &&
                !_.isUndefined(_links[packageName][state].loaded) && _links[packageName][state].loaded === true)
                deferred.resolve();
            else {
                var linksListUrl = _getContentUrl(packageName, state, 'resources') + 'linkslist.json';
                linksListUrl = $sce.getTrustedResourceUrl(linksListUrl);
                if (_.isUndefined(_links[packageName]))
                    _links[packageName] = {};
                if (_.isUndefined(_links[packageName][state]))
                    _links[packageName][state] = {};

                //download it for current version and cache it in $templateCache
                // we are caching linklist twice once in template cache and once in our lookup cache
                //lookup cache hold transformed data
                $http.get(linksListUrl, { cache: $templateCache })
                    .then(function (response) {
                        var linksList = response.data;
                        _links[packageName][state].loaded = true;
                        _links = _.assign(_links, linksList);
                        deferred.resolve();
                    }, function (reason) {
                        _links[packageName][state].loaded = false;
                        $log.error(reason);
                        deferred.resolve();
                    });
            }
            return deferred.promise;

        };

        //This will return short name of residency type - FY/NR/PY from fullName
        service.getStateResStatusShortName = function (passedFullName) {
            if (passedFullName === 'ALL') {
                return _.pluck(_config.stateResidencyType, 'shortName');
            } else {
                return _.find(_config.stateResidencyType, { fullName: passedFullName }).shortName;
            }
        };

        //This will return full name of residency type from short name (FY/NR/PY)
        service.getStateResStatusFullName = function (passedShortName) {
            if (passedShortName === 'ALL') {
                return _.pluck(_config.stateResidencyType, 'fullName');
            } else {
                return _.find(_config.stateResidencyType, { shortName: passedShortName }).fullName;
            }
        };

        //This will return fileds for AGI/Due/Refund/etc... of form 
        service.getFedReturnOverViewFields = function (passedPackageName, passedStateName, passedDocName) {
            if (!_.isUndefined(passedDocName)) {
                return _.filter(_config.returnOverViewFields, { packageName: passedPackageName, stateName: passedStateName, docName: passedDocName });
            } else {
                return _.filter(_config.returnOverViewFields, { packageName: passedPackageName, stateName: passedStateName });
            }
        };

        //This will return fileds for AGI/Due/Refund/etc... of state 
        service.getStateReturnOverViewFields = function (passedPackageName, passedStateName, passedResidencyType) {
            if (!_.isUndefined(passedResidencyType)) {
                return _.filter(_config.returnOverViewFields, { packageName: passedPackageName, stateName: passedStateName, residencyType: passedResidencyType });
            } else {
                return _.filter(_config.returnOverViewFields, { packageName: passedPackageName, stateName: passedStateName });
            }
        };

        //This will return constants for calculation from _config object. It is used to pass data to calculation from return-service
        service.getcalcConstant = function () {
            if (!_.isUndefined(_config.calcConstant)) {
                return _config.calcConstant;
            } else {
                return {};
            }
        };

        //Load zip list(city and state associated with zipcodes) and append to _config
        _loadResource('cityzip').then(function (response) {
            _resource.zipList = response;
        }, function (error) {
            $log.error(error);
        });

        //Return whole config data    
        service.getConfigData = function () {
            return _config;
        };

        //Return quick add forms based on passed package name from _config
        service.getAvailableQuickForms = function (packageName) {
            //Find form list based on passed package name
            var quickFormList = _config.quickForms[packageName];
            if (!_.isUndefined(quickFormList)) {
                return quickFormList;
            } else {
                //If it is undefined return blank array
                return [];
            }
        };

        service.setDefaultLanguage = function (language) {
            _defaultLanguage = language;
        };

        service.setPreferedLanguage = function (language) {
            _preferedLanguage = language;
        };

        // Here we set packagename for return
        service.setPackageName = function (packageNames) {
            if (!_.isArray(packageNames)) {
                //convert single package name into array
                packageNames = [packageNames];
            }

            //get pacakge name other then 'common' and return it
            _packageName = _.without(packageNames, 'common')[0];
            return _packageName;
        };


        //Function is used to only load Doc fields. It will not return those fields.	
        service.loadDocFields = function (docName, packageName, state) {
            var deferred = $q.defer();

            //do we already have in it cach then do nothing
            if (_.has(_docs, docName)) {
                deferred.resolve();
            } else { //download it for current version and cache it
                var url = _getContentUrl(packageName, state, 'documents') + docName + '.json';
                url = $sce.getTrustedResourceUrl(url, { cache: $templateCache });
                $http.get(url)
                    .then(function (response) {
                        var doc = response.data[docName];
                        _docs[docName] = doc;
                        deferred.resolve();
                    },
                        function (reason) {
                            deferred.reject(reason);
                        });
            }

            return deferred.promise;
        };

         /**
		 * this method is use for get statsic information of svg and metaInformation for preview
		 */
		service.getPreviewInformation = function (forms, isGetField) {
			var deferred = $q.defer();
			try {
				var printingInfoPromise = [];
				for (var i = 0; i < forms.length; i++) {
					var form = forms[i];
					if (_loadedFormInfo.indexOf(form.docName) === -1) {
						_loadedFormInfo.push(form.docName);
						var formProp = service.getFormProp(form.formName);
						if (formProp && isGetField === true) {
							printingInfoPromise.push(service.getDocFields(form.docName, formProp.packageName, formProp.state))
						}
						printingInfoPromise.push(service.loadPrintingForm(form));
					}
				}
				$q.all(printingInfoPromise).then(function (data) {
					deferred.resolve();
				}).catch(function (reason) {
					deferred.resolve();
				});
			} catch (e) {
				deferred.resolve();
			}

			return deferred.promise;
        }

        //This function will help to initialize some stats which are necessary for this service
        var init = function () {
            //Set Tax Year
            service.refreshTaxYear();
            //Set Return Mode
            _config.returnMode = "input";
        }

        //Invoke initialization
        init();

        return service;
    }]);