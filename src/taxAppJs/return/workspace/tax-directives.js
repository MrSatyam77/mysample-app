angular.module('returnApp').directive('taxForm', ['$compile', 'contentService', function ($compile, contentService) {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            var _showForm = function () {
                contentService.getFormTemplate(scope.formScope.currentForm).then(function (formHtml) {
                    element.empty();
                    element.html(formHtml);
                    $compile(element.contents())(scope.formScope);
                    //Note: We should remove formLoading variable, as it is only used to show animation.
                    //Which can now be changed by listening to 'formLoaded'. Which is broadcasting below.
                    scope.formLoading = false;
                    //Broadcast message when form is loaded.
                    //Currently it is used by ERC function to jump on element when user click on error code it.
                    element.scrollTop(0);
                    scope.$broadcast('formLoaded');
                }, function () {
                    element.empty();
                    element.html('Oops ! something went bad, Try to load form again');
                });

            };

            var _hideForm = function () {
                element.empty();
                element.html("<div></div>");
                $compile(element.contents())(scope.formScope);
                //Note: We should remove formLoading variable, as it is only used to show animation.
                //Which can now be changed by listening to 'formLoaded'. Which is broadcasting below.
                scope.formLoading = false;
            }

            scope.$on('showForm', _showForm);
            scope.$on('hideForm', _hideForm);
        }
    };
}]);

angular.module('returnApp').directive('taxFormHeader', [function () {
    return {
        restrict: 'E',
        templateUrl: 'taxAppJs/return/workspace/partials/taxFormHeader.html'
    };
}]);

//Note: Changes done here must be done for depreciationStatement as well because depreciationWorksheet shares modified version of this directive
angular.module('returnApp').directive('taxStatement', ['_', '$compile', 'returnService', 'environment',
    function (_, $compile, returnService, environment) {
        return {
            restrict: 'E',
            //very important we need seperate scope created for each instance of directive created
            //otherwise only last statement on page will work
            scope: true,
            link: function (scope, element, attrs) {
                var _parentForm = scope.$parent.currentForm;
                var _rootElement = element;
                var _templateName = attrs.template;
                var _docName = attrs.document;
                var _attrs = attrs;
                var _childScope = [];

                //Temporary function to differentiate features as per environment (beta/live)
                var _betaOnly = function () {
                    if (environment.mode == 'beta' || environment.mode == 'local')
                        return true;
                    else
                        return false;
                }

                //intialize child scope per line
                var _initChildScope = function (data, index) {
                    var length = _childScope.length;
                    var currentScope = _childScope[length] = scope.$new(true);

                    currentScope[_docName] = data;
                    currentScope.docIndex = index;

                    currentScope.$on('postTaxFieldChange', function ($event) {
                        // currentScope.docIndex is only created by Tax-statement directive
                        $event.docIndex = $event.currentScope.docIndex;
                    });

                    //To remove statement line
                    currentScope.removeLine = _removeLine;
                    return currentScope;
                };

                var _removeLine = function (docIndex) {
                    if (_betaOnly() === true) {
                        returnService.openConfirmDialog("removeStatement", "Do you want to delete selected statement?").then(function (result) {
                            if (result === true) {
                                returnService.removeChildDoc(_docName, docIndex).then(function () {
                                    var scopeToRemove;
                                    for (var i = 0; i < _childScope.length; i++) {
                                        if (_childScope[i].docIndex === docIndex) {
                                            scopeToRemove = i;
                                            break;
                                        }
                                    }
                                    if (scopeToRemove >= 0) {
                                        var child;

                                        //Reverse the index for UI as we are placing statements from bottom to top (reverse order then array) 
                                        var _indexForUI = _childScope.length - (scopeToRemove + 1);
                                        child = _rootElement[0].children[1].childNodes[_indexForUI];

                                        child.remove();
                                        _childScope[i].$destroy();
                                        _childScope[i] = null;
                                        _childScope.splice(scopeToRemove, 1);
                                        child = null;
                                    }
                                });
                            }
                        })
                    } else {
                        returnService.removeChildDoc(_docName, docIndex).then(function () {
                            var scopeToRemove;
                            for (var i = 0; i < _childScope.length; i++) {
                                if (_childScope[i].docIndex === docIndex) {
                                    scopeToRemove = i;
                                    break;
                                }
                            }
                            if (scopeToRemove >= 0) {
                                var child;

                                //Reverse the index for UI as we are placing statements from bottom to top (reverse order then array) 
                                var _indexForUI = _childScope.length - (scopeToRemove + 1);
                                child = _rootElement[0].children[1].childNodes[_indexForUI];

                                child.remove();
                                _childScope[i].$destroy();
                                _childScope[i] = null;
                                _childScope.splice(scopeToRemove, 1);
                                child = null;
                            }
                        });
                    }
                };

                var _addLine = function () {
                    returnService.addChildDoc(_docName, _parentForm).then(function (data) {
                        _loadLine(_initChildScope(data.data, data.index));
                    });
                };

                //destroy child scopes
                var _clearChildScope = function () {
                    if (!_.isUndefined(_childScope) && _childScope.length > 0) {
                        for (var i = 0; i < _childScope.length; i++) {
                            _childScope[i].$destroy();
                            _childScope[i] = null;
                            _childScope.splice(i, 1);
                        }
                    }
                };

                //Load individual line
                var _loadLine = function (scope) {
                    if (_betaOnly() === true) {
                        var divElement = angular.element('<div class="add-template-inner-wrap"><div class="remove-template-btn-wrap mb-3"><button class="btn-gray fas fa-times" ng-click="removeLine(docIndex)"></button></div></div>');
                        var tag = '<div><template></template></div>';
                        var newdirective = angular.element(tag.replace('template', _templateName));
                        //copy attributes
                        var attrKeys = _.keys(_attrs.$attr);
                        if (attrKeys && attrKeys.length > 0) {
                            for (var i = 0; i < attrKeys.length; i++) {
                                // we do not want to copy this attributes
                                if (attrKeys[i] === 'parent' || attrKeys[i] === 'template' || attrKeys[i] === 'document')
                                    continue;
                                newdirective.children().attr(attrKeys[i], _attrs[attrKeys[i]]);
                            }
                        }
                        divElement.append(newdirective);
                        //compile and append line template
                        $compile(divElement.contents())(scope);

                        // prepend div element template in div which is child element of rootelement
                        angular.element(_rootElement[0].children[1]).prepend(divElement);

                        divElement = null;
                        newdirective = null;
                    } else {
                        var divElement = angular.element('<div><button class="btn-gray fas fa-times" ng-click="removeLine(docIndex)"></button></div>');
                        var tag = '<template></template>';
                        var newdirective = angular.element(tag.replace('template', _templateName));
                        //copy attributes
                        var attrKeys = _.keys(_attrs.$attr);
                        if (attrKeys && attrKeys.length > 0) {
                            for (var i = 0; i < attrKeys.length; i++) {
                                // we do not want to copy this attributes
                                if (attrKeys[i] === 'parent' || attrKeys[i] === 'template' || attrKeys[i] === 'document')
                                    continue;
                                newdirective.attr(attrKeys[i], _attrs[attrKeys[i]]);
                            }
                        }
                        divElement.prepend(newdirective);
                        //compile and append line template
                        $compile(divElement.contents())(scope);

                        // prepend div element template in div which is child element of rootelement
                        angular.element(_rootElement[0].children[1]).prepend(divElement);

                        divElement = null;
                        newdirective = null;
                    }
                };

                //To load lines on startup
                var _loadLines = function () {
                    returnService.getChildDocs(_docName, _parentForm).then(function (data) {
                        if (!_.isUndefined(data) && !_.isEmpty(data)) {
                            var keys = _.keys(data);
                            if (keys && keys.length > 0) {
                                for (var i = 0; i < keys.length; i++) {
                                    _loadLine(_initChildScope(data[keys[i]], keys[i]));
                                }
                            }
                        }
                    });
                };

                //To add statement line
                scope.addLine = _addLine;
                scope.betaOnly = _betaOnly;
                scope.rkey = _attrs.header || '+';
                //clear up everything otherwise memory leak
                scope.$on('$destroy', function () {
                    _clearChildScope();
                    _childScope = null;
                    _attrs = null;
                    _rootElement.empty();
                    _rootElement = null;
                });

                //load all line associated on start up
                _loadLines();

            },
            template: '<button class="btn-gray fas fa-plus" ng-class="{\'add-template\': betaOnly() === true}" ng-click="addLine()" tax-blur-key title="Add New"></button><!-- Container DIV--><div style="width:100%; margin-bottom:5px; margin-top:10px;"></div>'
        };
    }
]);


/**
 * This statement is used for asset Depreciation worksheet but can be used by others as well
 * This is modified version of tax-statement to show it externally from form and adding forms (worksheets) instead of docs
 * Note: Changes done in tax-statement must be done here as well
 * Rename data.value to data.parentOf4562 (for receiver)
 * Issues:
 */
angular.module('returnApp').directive('depreciationStatement', ['_', '$compile', '$filter', '$rootScope', 'returnService', 'environment', 'userService', function (_, $compile, $filter, $rootScope, returnService, environment, userService) {
    return {
        restrict: 'E',
        //very important we need seperate scope created for each instance of directive created
        //otherwise only last statement on page will work
        scope: true,
        link: function (scope, element, attrs) {
            var _parentDocName = attrs.parent;
            var _rootElement = element;
            var _templateName = attrs.template;
            var _docName = attrs.document;
            var _attrs = attrs;
            var _childScope = [];
            //get the taxYear for which user is logged in
            var taxYear = userService.getTaxYear();

            //Temporary function to differentiate features as per environment (beta/live)
            var _betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            }

            //intialize child scope per line
            var _initChildScope = function (data, index) {
                var length = _childScope.length;
                var currentScope = _childScope[length] = scope.$new(true);

                currentScope[_docName] = data;
                currentScope.docIndex = index;

                currentScope.$on('postTaxFieldChange', function ($event, fieldName, newVal) {
                    //Broadcast change to return controller's current form to further give to return service
                    //This is just done to avoid duplicate code
                    $rootScope.$broadcast('peerPostTaxFieldChange', fieldName, newVal, $event.currentScope.docIndex);
                    //stop propogation there is no need to propogate this event higher in scope hierarchy
                    $event.stopPropagation();

                });

                //To remove statement line
                currentScope.removeLine = _removeLine;
                return currentScope;
            };

            var _removeDoc = function (docIndex) {
                var scopeToRemove;
                for (var i = 0; i < _childScope.length; i++) {
                    if (_childScope[i].docIndex === docIndex) {
                        scopeToRemove = i;
                        break;
                    }
                }
                if (scopeToRemove >= 0) {
                    var child;

                    //Reverse the index for UI as we are placing statements from bottom to top (reverse order then array) 
                    var _indexForUI = _childScope.length - (scopeToRemove + 1);
                    child = _rootElement[0].children[1].childNodes[_indexForUI];

                    child.remove();
                    _childScope[i].$destroy();
                    _childScope[i] = null;
                    _childScope.splice(scopeToRemove, 1);
                    child = null;
                }


            };

            var _removeLine = function (docIndex) {
                //Remove Form
                var formToRemove = returnService.getFormFromDoc(_docName, docIndex);//Will return {form:FormObject, isStatement:boolean}
                if (angular.isDefined(formToRemove) && angular.isDefined(formToRemove.form)) {
                    returnService.removeForm(formToRemove.form).then(function () {
                        //Remove Doc & UI Lines
                        _removeDoc(docIndex);
                    });
                } else {
                    //In this case there is only doc to be remove no form exist for that doc
                    returnService.removeChildDoc(_docName, docIndex).then(function () {
                        //Remove Doc & UI Lines
                        _removeDoc(docIndex);
                    });
                }
            };

            var _addLine = function () {
                //Step - 1 Add doc (we want to add doc only not a form instance so we have used function below).                
                returnService.addDocOnly(_docName).then(function (response) {
                    var _addedDocIndex = response;
                    //pass doc of added form to load line
                    var doc = returnService.getDoc(_docName, _addedDocIndex);
                    _loadLine(_initChildScope(doc, _addedDocIndex));
                }, function (error) {

                });
            };

            var _addSelectedForm = scope.$on('addSelectedForm', function (event, data) {
                returnService.getCurrentForms(_docName).then(function (forms) {
                    data.docIndex = parseInt(data.docIndex);
                    var form = forms.find(function (obj) { return (obj.docIndex == data.docIndex) });
                    if (!_.isUndefined(form)) {
                        returnService.updateParentForDep(form, data.formInfo.form4562Index);
                        if (data.newFormAdded == true) {
                            $rootScope.$broadcast('changeLookUp', {});
                        }
                    } else {
                        returnService.addForm(data.formInfo.formToAdd, undefined, data.formInfo.form4562Index, true, data.formInfo.docIndex).then(function (formAdded) {
                            if (data.newFormAdded == true) {
                                $rootScope.$broadcast('changeLookUp', {});
                            }
                        });
                    }
                })
            });

            //Listener to listen for adding form (Based on selection in Form column)
            //{ docIndex : 25, parentDocIndex: 19, value :{formObject (SchC)}}
            var _formSelectedInStatementAsForm = scope.$on('formSelectedInStatementAsForm', function (event, data) {
                if (angular.isDefined(data.value)) {
                    if (parseInt(taxYear) >= 2018 && (data.value.docName === 'dSchE' || data.value.docName === 'dSchEDup' || data.value.docName === 'd8825' || data.value.docName === 'd8825Dup') && (data.type == 'asset' || data.type == 'vehicle')) {
                        //If parent of 4562 (SchC etc...) is not added then add parent form and 4562 first
                        if (angular.isUndefined(data.value.docIndex)) {
                            var _form4562ParentToBeAdd = returnService.getSingleAvailableForm(data.value.docName);
                            var _4562ToAdd = returnService.getSingleAvailableForm('d4562');
                            returnService.addForm(_4562ToAdd, _form4562ParentToBeAdd.id).then(function (form4562Added) {
                                //Now Add Worksheet under 4562
                                var formToAdd = returnService.getSingleAvailableForm(_docName);

                                returnService.getCurrentForms('dDeprwkt').then(function (forms) {
                                    var form = forms.find(function (obj) { return (obj.docIndex == data.docIndex) });
                                    if (!_.isUndefined(form)) {
                                        form.currentParent = { docName: "d4562", displayName: "4562", objType: "" };
                                        // childForm, oldParent, newParentIndex
                                        returnService.updateParentForDep(form, form4562Added.docIndex);
                                        if (data.newFormAdded == true) {
                                            $rootScope.$broadcast('changeLookUp', {});
                                        }
                                    } else {
                                        data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': form4562Added.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                        scope.$broadcast('addSelectedForm', data);
                                        // returnService.addForm(formToAdd, undefined, form4562Added.docIndex, true, data.docIndex).then(function (formAdded) {
                                        //     //Nothing decided to do yet. As doc was already added. May be we can fire all calculation of the worksheet here
                                        // });
                                    }
                                });
                            });
                        } else {
                            //Step 2 - Get docIndex of 4562 of passed form (SchC,2106,etc...)  
                            var _form4562List = returnService.getChildForms('d4562', data.value);

                            // //Step 3 - Add form for already added doc                   
                            var formToAdd = returnService.getSingleAvailableForm(_docName);
                            //If 4562 does not found under parent form (sch c, etc...). Add 4562 first other wise just pass parentDocIndex to establish connection
                            if (angular.isUndefined(_form4562List) || _form4562List.length <= 0) {
                                // First Add 4562 under parent (SchC, etc...)
                                var _4562ToAdd = returnService.getSingleAvailableForm('d4562');
                                returnService.addForm(_4562ToAdd, undefined, data.value.docIndex).then(function (form4562Added) {
                                    returnService.postTaxFieldChange({ fieldName: form4562Added.docName + ".BusinessOrActivity", index: form4562Added.docIndex, newVal: data.value.displayName + ' (' + data.propertyValue + ')' });
                                    data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': form4562Added.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                    scope.$broadcast('addSelectedForm', data);
                                });
                            }
                            else {
                                var index;

                                // contains parentform docname of depreciation wroksheet (either asset or vehicle).
                                var parentDoc;
                                if (data.type == "asset") {
                                    parentDoc = "dDeprwkt"
                                } else if (data.type == "vehicle") {
                                    parentDoc = "dVehicleDeprWkt";
                                }

                                // here, we loop through already added 4562 and check if property form already added than we add only depreciation worksheet,
                                // otherwise, we first add 4562 and add depreciation worksheet under that 4562.
                                for (var i = 0; i < _form4562List.length; i++) {
                                    var val = returnService.getElementValue("BusinessOrActivity", _form4562List[i].form.docName, _form4562List[i].form.docIndex);
                                    if (val === (data.value.displayName + ' (' + data.propertyValue + ')')) {
                                        index = i;
                                        break;
                                    }
                                }

                                // check if desired 4562 already added than add only child depreciation worksheet.
                                if (angular.isDefined(index) && index >= 0) {
                                    returnService.getCurrentForms(parentDoc).then(function (forms) {
                                        // to check whether depreciation workheet already added , than we intend only to chnage parent of depreciation worksheet.
                                        var form = forms.find(function (obj) { return (obj.docIndex == data.docIndex) });
                                        if (!_.isUndefined(form)) {
                                            returnService.updateParentDepriciationWorksheet(form, _form4562List[index].form.docIndex);
                                            if (data.newFormAdded == true) {
                                                $rootScope.$broadcast('changeLookUp', {});
                                            }
                                        } else {
                                            data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': _form4562List[index].form.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                            scope.$broadcast('addSelectedForm', data);
                                        }
                                    })
                                } else {
                                    var _4562ToAdd = returnService.getSingleAvailableForm('d4562');
                                    returnService.getCurrentForms(parentDoc).then(function (forms) {
                                        var form = forms.find(function (obj) { return (obj.docIndex == data.docIndex) });
                                        // to check whether depreciation workheet already added , than we intend only to add parent (4562( first and then chnage parent of worksheet to newly added 4562.
                                        if (!_.isUndefined(form)) {
                                            returnService.addForm(_4562ToAdd, undefined, data.value.docIndex).then(function (form4562Added) {
                                                // this field is just for visually indication that this 4562 belongs to which form (e.g. Schedule E (A))
                                                returnService.postTaxFieldChange({ fieldName: form4562Added.docName + ".BusinessOrActivity", index: form4562Added.docIndex, newVal: data.value.displayName + ' (' + data.propertyValue + ')' });
                                                returnService.updateParentDepriciationWorksheet(form, form4562Added.docIndex);
                                                if (data.newFormAdded == true) {
                                                    $rootScope.$broadcast('changeLookUp', {});
                                                }
                                            });
                                        } else {
                                            returnService.addForm(_4562ToAdd, undefined, data.value.docIndex).then(function (form4562Added) {
                                                // this field is just for visually indication that this 4562 belongs to which form (e.g. Schedule E (A))
                                                returnService.postTaxFieldChange({ fieldName: form4562Added.docName + ".BusinessOrActivity", index: form4562Added.docIndex, newVal: data.value.displayName + ' (' + data.propertyValue + ')' });
                                                data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': form4562Added.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                                scope.$broadcast('addSelectedForm', data);
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                    else {
                        //If parent of 4562 (SchC etc...) is not added then add parent form and 4562 first
                        if (angular.isUndefined(data.value.docIndex)) {
                            var _form4562ParentToBeAdd = returnService.getSingleAvailableForm(data.value.docName);
                            var _4562ToAdd = returnService.getSingleAvailableForm('d4562');
                            returnService.addForm(_4562ToAdd, _form4562ParentToBeAdd.id).then(function (form4562Added) {
                                //Now Add Worksheet under 4562
                                var formToAdd = returnService.getSingleAvailableForm(_docName);
                                data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': form4562Added.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                scope.$broadcast('addSelectedForm', data);
                            });
                        } else {
                            //Step 2 - Get docIndex of 4562 of passed form (SchC,2106,etc...)                   
                            var _form4562 = returnService.getChildForm('d4562', data.value);
                            //Step 3 - Add form for already added doc                   
                            var formToAdd = returnService.getSingleAvailableForm(_docName);
                            //If 4562 does not found under parent form (sch c, etc...). Add 4562 first other wise just pass parentDocIndex to establish connection
                            if (angular.isUndefined(_form4562)) {
                                //First Add 4562 under parent (SchC, etc...)
                                var _4562ToAdd = returnService.getSingleAvailableForm('d4562');
                                returnService.addForm(_4562ToAdd, undefined, data.value.docIndex).then(function (form4562Added) {
                                    returnService.postTaxFieldChange({ fieldName: form4562Added.docName + ".BusinessOrActivity", index: form4562Added.docIndex, newVal: data.propertyValue });
                                    var _doc = returnService.getDoc(form4562Added.docName, form4562Added.docIndex);
                                    data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': form4562Added.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                    scope.$broadcast('addSelectedForm', data);
                                });
                            } else {
                                //4562 is already added , so just add child worksheet and parent relation

                                data.formInfo = { 'formToAdd': formToAdd, 'form4562Index': _form4562.docIndex, 'docIndex': data.docIndex, 'newFormAdded': data.newFormAdded }
                                scope.$broadcast('addSelectedForm', data);
                            }
                        }
                    }
                }
            });

            // change parent for Depreciation
            var _formChangedInStatementAsForm = scope.$on('formChangedInStatementAsForm', function (event, data) {
                if (angular.isDefined(data.value)) {
                    // returnService.postTaxFieldChange({fieldName:data.fieldName,index:data.docIndex,newVal:data.value})
                    if (parseInt(taxYear) >= 2018 && (data.value.docName === 'dSchE' || data.value.docName === 'dSchEDup' || data.value.docName === 'd8825' || data.value.docName === 'd8825Dup') && (data.type == 'asset' || data.type == 'vehicle')) {
                    } else {
                        //If parent of 4562 (SchC etc...) is not added then add parent form and 4562 first
                        if (angular.isUndefined(data.value.docIndex)) {

                        } else {
                            //Step 2 - Get docIndex of 4562 of passed form (SchC,2106,etc...)                   
                            var _form4562 = returnService.getChildForm('d4562', data.value);
                            //Step 3 - Add form for already added doc                   
                            var formToAdd = returnService.getSingleAvailableForm(_docName);

                            //If 4562 does not found under parent form (sch c, etc...). Add 4562 first other wise just pass parentDocIndex to establish connection
                            if (angular.isUndefined(_form4562)) {
                                //First Add 4562 under parent (SchC, etc...)
                                var _4562ToAdd = returnService.getSingleAvailableForm('d4562');
                                returnService.addForm(_4562ToAdd, undefined, data.value.docIndex).then(function (form4562Added) {
                                    returnService.postTaxFieldChange({ fieldName: form4562Added.docName + ".BusinessOrActivity", index: form4562Added.docIndex, newVal: data.propertyValue });
                                    var _doc = returnService.getDoc(form4562Added.docName, form4562Added.docIndex);
                                    formToAdd.docIndex = parseInt(data.docIndex);
                                    returnService.updateParentForDep(formToAdd, form4562Added.docIndex);
                                    if (data.newFormAdded == true) {
                                        $rootScope.$broadcast('changeLookUp', {});
                                    }

                                });
                            } else {
                                formToAdd.docIndex = parseInt(data.docIndex);
                                returnService.updateParentForDep(formToAdd, _form4562.docIndex);
                                if (data.newFormAdded == true) {
                                    $rootScope.$broadcast('changeLookUp', {});
                                }
                            }
                        }
                    }
                }
            });

            //destroy child scopes
            var _clearChildScope = function () {
                if (_childScope != null && !_.isUndefined(_childScope) && _childScope.length > 0) {
                    for (var i = 0; i < _childScope.length; i++) {
                        _childScope[i].$destroy();
                        _childScope[i] = null;
                        _childScope.splice(i, 1);
                    }
                }
            };

            //Load individual line
            var _loadLine = function (scope) {
                var divElement = angular.element('<div><button class="btn-gray fas fa-times" ng-click="removeLine(docIndex)"></button></div>');
                var tag = '<template></template>';
                var newdirective = angular.element(tag.replace('template', _templateName));
                //copy attributes
                var attrKeys = _.keys(_attrs.$attr);
                if (attrKeys && attrKeys.length > 0) {
                    for (var i = 0; i < attrKeys.length; i++) {
                        // we do not want to copy this attributes
                        if (attrKeys[i] === 'parent' || attrKeys[i] === 'template' || attrKeys[i] === 'document')
                            continue;
                        newdirective.attr(attrKeys[i], _attrs[attrKeys[i]]);
                    }
                }
                divElement.prepend(newdirective);
                //compile and append line template
                $compile(divElement.contents())(scope);


                // prepend div element template in div
                angular.element(_rootElement[0].children[1]).prepend(divElement);


                divElement = null;
                newdirective = null;
            };
            //To load lines on startup
            var _loadLines = function () {
                var instanceForms = returnService.getForm(_parentDocName);

                _.forEach(instanceForms, function (form) {
                    returnService.getChildDocs(_docName, form).then(function (data) {
                        if (!_.isUndefined(data) && !_.isEmpty(data)) {
                            var keys = _.keys(data);
                            if (keys && keys.length > 0) {
                                for (var i = 0; i < keys.length; i++) {
                                    _loadLine(_initChildScope(data[keys[i]], keys[i]));
                                }
                            }
                        }
                    });
                });
                returnService.getChildDocs(_docName, {}, true).then(function (data) {
                    if (!_.isUndefined(data) && !_.isEmpty(data)) {
                        var keys = _.keys(data);
                        if (keys && keys.length > 0) {
                            for (var i = 0; i < keys.length; i++) {
                                _loadLine(_initChildScope(data[keys[i]], keys[i]));
                            }
                        }
                    }
                });
            };
            //To add statement line
            scope.addLine = _addLine;
            scope.rkey = _attrs.header || '+';
            //clear up everything otherwise memory leak
            scope.$on('$destroy', function () {
                _formSelectedInStatementAsForm();
                _formChangedInStatementAsForm();
                _addSelectedForm();
                _clearChildScope();
                _childScope = null;
                _attrs = null;
                _rootElement.empty();
                _rootElement = null;
            });

            //load all line associated on start up
            _loadLines();
            //bind scroll event to make header sticky
            var depreciationDialogBodyElement = angular.element(document.getElementById("depreciationDialogBody"));
            var scollView = depreciationDialogBodyElement[0];
            scope.$parent.deprBodyTitleTop = 0;
            depreciationDialogBodyElement.bind('scroll', function () {
                scope.$apply(function () {
                    scope.$parent.deprBodyTitleTop = scollView.scrollTop;
                });
            });
        },
        template: '<button class="btn-gray fas fa-plus" ng-click="addLine()" tax-blur-key></button><!-- Container DIV--><div style="width:100%; margin-bottom:5px;"></div>'
    };
}]);

//Zip lookup - Start
angular.module('returnApp').directive('zipLookup', ['$timeout', '$filter', function ($timeout, $filter) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var zipElement = element.children().children()[0];
            var elementChildren;

            //Bind focus lost for element (zip entry)
            angular.element(zipElement).bind('blur', function (event) {
                elementChildren = element.children();

                if (elementChildren != undefined && elementChildren.length > 1) {
                    // Get Input element
                    zipElement = _.find(elementChildren, function (child) {
                        if (child.tagName.toLowerCase() == "input") {
                            return true;
                        }
                    });
                } else {
                    zipElement = element.children()[0].getElementsByTagName('input')[0];
                }

                //Zipcode should not be calculated or it should be overidden
                if (angular.element(zipElement).attr('readonly') != 'readonly') {
                    //Get City and State from entered zipcode
                    var result = $filter('zipCode')(angular.element(zipElement).val());

                    postal.publish({
                        channel: 'MTPO-Return',
                        topic: 'zipUpdate',
                        data: {
                            zipElementName: angular.element(zipElement).attr('tax-field'),
                            zipDetails: result,
                            zipUpdate: {
                                city: {
                                    'elementName': elementChildren.parent().parent().next().children().next().children().children().attr('tax-field'),
                                    'docIndex': scope.$parent.docIndex != undefined ? scope.$parent.docIndex : scope.$parent.$parent.docIndex,
                                    'object': { 'value': result.city, 'isCalculated': true }
                                }, state: {
                                    'elementName': elementChildren.parent().parent().next().next().children().next().children().children().attr('tax-field'),
                                    'docIndex': scope.$parent.docIndex != undefined ? scope.$parent.docIndex : scope.$parent.$parent.docIndex,
                                    'object': { 'value': result.state, 'isCalculated': true }
                                }
                            }
                        }
                    });

                    //Check if zipcode field is overridden or city field is not readonly or overridden
                    //if(angular.element(element.next().children()[0]).attr('readonly')!='readonly' || angular.element(element.next().children()[0]).attr('overridden')=='overridden'){
                    //scope.$emit('postTaxFieldChange', angular.element(element.next().children()[0]).attr('tax-field'), {'value':result.city,'isCalculated':true});
                    //}

                    //Check if zipcode field is overridden or state field is not readonly or overridden
                    //if(angular.element(element.next().next().children()[0]).attr('readonly')!='readonly' || angular.element(element.next().next().children()[0]).attr('overridden')!='overridden'){
                    //scope.$emit('postTaxFieldChange', angular.element(element.next().next().children()[0]).attr('tax-field'), {'value':result.state,'isCalculated':true});
                    //}
                }
            });

            //subscribe to event which will be raised when user unoverride zipcode
            var _removeOverrideOnZip = postal.subscribe({
                channel: 'MTPO-Return',
                topic: 'removeOverrideOnZip',
                callback: function (data, envelope) {
                    // update city & state
                    var result = $filter('zipCode')(data.calValue);

                    scope.$emit('postTaxFieldChange', elementChildren.parent().parent().next().children().next().children().attr('tax-field'), { 'value': result.city, 'isCalculated': true });
                    scope.$emit('postTaxFieldChange', elementChildren.parent().parent().next().next().children().next().children().attr('tax-field'), { 'value': result.state, 'isCalculated': true });
                }
            });

            scope.$on('$destroy', function () {
                angular.element(zipElement).unbind('blur');
                //to prevent memory lick
                _removeOverrideOnZip.unsubscribe();
            });
        }
    };
}]);
//Zip lookup - End

//EIN type ahead - start

//EIN - type ahead - end

angular.module('returnApp').directive('taxField', ['_', '$filter', '$rootScope', '$timeout', 'contentService', 'returnService', 'environment', function (_, $filter, $rootScope, $timeout, contentService, returnService, environment) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var _isValueChanged = false;
            var _newVal;
            var _fieldName = attrs.taxField;
            var _element = element;
            //Temporary function to differentiate features as per environment (beta/live)
            var _betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            }

            var _applyFieldStyle = function (field) {

                //calculated 
                var calculated = $filter('calculated')(field, _fieldName);
                if (calculated)
                    _element.attr('readonly', 'readonly');
                else
                    _element.removeAttr('readonly');

                //overridden
                var overridden = $filter('overridden')(field, _fieldName);
                if (overridden)
                    _element.attr('overridden', 'overridden');
                else
                    _element.removeAttr('overridden');

                //required
                var required = $filter('required')(field, _fieldName);
                if (required)
                    _element.attr('required', 'required');
                else
                    _element.removeAttr('required');

                //enabled
                var enabled = $filter('enabled')(field, _fieldName);
                if (!enabled)
                    _element.attr('disabled', 'disabled');
                else
                    _element.removeAttr('disabled');

                //estimated                
                var estimated = $filter('estimated')(field, _fieldName);
                if (estimated)
                    _element.attr('estimated', 'estimated');
                else
                    _element.removeAttr('estimated');


                //Field Type
                var fieldType = $filter('fieldType')(field, _fieldName);
                switch (fieldType) {
                    case 'Money':
                    case 'Double':
                    case 'Number':
                        _element.addClass('text-right');
                        break;
                    default:
                        _element.removeClass('text-right');
                        break;
                }
            };
            _applyFieldStyle(scope.field);


            //This is used to format display value.
            //Note: For Checkboxes, we must have to use $setViewValue instead $viewValue other wise it will not work. And if use $setViewValue for other input
            //It will go into infinite loop some time.
            modelCtrl.$formatters.push(function (bindValue) {
                var fieldType = contentService.getFieldType(_fieldName);
                if (bindValue != undefined) {
                    $timeout(function () {
                        var transformedInput = bindValue;

                        if (!_.isUndefined(fieldType)) {
                            if (fieldType == 'Money') {
                                //conver to string
                                transformedInput = transformedInput.toString();
                                //Remove thousund seperator otherwise 'number' filter will return blank
                                transformedInput = transformedInput.replace(/,/g, "");

                                //If value is blank then do not format it
                                if (transformedInput != '') {
                                    //Filter value with 'number' (core angular filter) and set as $viewValue
                                    modelCtrl.$viewValue = $filter('number')(transformedInput, 0);
                                    //Render $viewValue on ui
                                    modelCtrl.$render();
                                }

                            } else if (fieldType == 'Double') {
                                //conver to string
                                transformedInput = transformedInput.toString();
                                //Remove thousund seperator otherwise 'number' filter will return blank
                                transformedInput = transformedInput.replace(/,/g, "");

                                //If value is blank then do not format it
                                if (transformedInput != '') {
                                    var _fractionDigits = undefined;
                                    var _inputValueWithoutFraction = transformedInput;

                                    //If value has fraction digit (.) split values
                                    //Note: We have to remove fraction digits and '.' to filter number properly otherwise it will parse to next integer.
                                    if (transformedInput.indexOf('.') > 0) {
                                        var _splitData = transformedInput.split('.');
                                        // value with out fraction digit            
                                        _inputValueWithoutFraction = _splitData[0];
                                        //fraction digits
                                        _fractionDigits = _splitData[1];
                                    }

                                    //Filter value (without fraction digits)  with 'number' (core angular filter)
                                    var _maskedValue = $filter('number')(_inputValueWithoutFraction, 0);
                                    if (_fractionDigits != undefined) {
                                        _maskedValue = _maskedValue + '.' + _fractionDigits;
                                    }

                                    //set new value as $viewValue
                                    modelCtrl.$viewValue = _maskedValue;
                                    //Render $viewValue on ui
                                    modelCtrl.$render();
                                }
                            } else if (fieldType == 'Boolean') {//Note: We must have to set view value using  $setViewValue.                                 
                                //Else set same value as view value
                                modelCtrl.$setViewValue(transformedInput);
                                //Render $viewValue on ui
                                modelCtrl.$render();
                            } else {
                                //Else set same value as view value
                                modelCtrl.$viewValue = transformedInput;
                                //Render $viewValue on ui
                                modelCtrl.$render();
                            }
                        } else {
                            //Else set same value as view value
                            modelCtrl.$viewValue = transformedInput;
                            //Render $viewValue on ui
                            modelCtrl.$render();
                        }
                    }, 0);
                } else {
                    //Notes:
                    //For checkboxes it is mandatory to set undefined as viewValu otherwise it will create issue
                    //Note: We must have to set view value using  $setViewValue.
                    if (fieldType == 'Boolean') {
                        //Else set same value as view value
                        modelCtrl.$setViewValue(bindValue);
                        //Render $viewValue on ui
                        modelCtrl.$render();
                    }
                }
            });

            scope.fieldType = $filter('fieldType')(scope.field, attrs.taxField);
            //This function is used to open calculator on field
            scope.openCalculator = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (scope.fieldType == "Money" || scope.fieldType == "Double") {
                    var _currentField = scope.fieldname.split('.');
                    postal.publish({
                        channel: 'MTPO-Return',
                        topic: 'openCalculator',
                        data: {
                            fieldData: { "docName": _currentField[0], "elementId": attrs.taxField, "docIndex": scope.$parent.$parent.docIndex }
                        }
                    });
                }
            }

            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue === undefined) return '';
                var transformedInput = inputValue;
                var fieldType = contentService.getFieldType(_fieldName);
                var fieldPattern = $filter('patternFormat')(_fieldName);
                var regExp = new RegExp(fieldPattern, 'g');
                if (!_.isUndefined(fieldPattern) && !_.isUndefined(fieldType)) {
                    //For Money field we will round it after focus lost.
                    if (fieldType == 'Double' || fieldType == 'Money') {
                        //Record caret position
                        var _caretPosition = _element[0].selectionStart;
                        if (transformedInput.indexOf(',') > 0) {
                            _caretPosition = _caretPosition - transformedInput.match(/,/g).length;
                        }

                        //Remove thousund seperator otherwise 'number' filter will return blank
                        transformedInput = transformedInput.replace(/,/g, "");
                        inputValue = inputValue.replace(/,/g, "");

                        var _fractionDigits = undefined;
                        var _inputValueWithoutFraction = transformedInput;

                        //If value has fraction digit (.) split values
                        //Note: We have to remove fraction digits and '.' to filter number properly otherwise it will parse to next integer.
                        if (transformedInput.indexOf('.') > 0) {
                            var _splitData = transformedInput.split('.');
                            // value with out fraction digit            
                            _inputValueWithoutFraction = _splitData[0];
                            //fraction digits
                            _fractionDigits = _splitData[1];
                        }

                        //If value is blank then do not format it
                        if (_inputValueWithoutFraction != '' && _inputValueWithoutFraction != '-') {
                            //Filter value (without fraction digits)  with 'number' (core angular filter)
                            var _maskedValue = $filter('number')(_inputValueWithoutFraction, 0);
                            if (_fractionDigits != undefined) {
                                _maskedValue = _maskedValue + '.' + _fractionDigits;
                            }

                            //set new value as $viewValue
                            modelCtrl.$viewValue = _maskedValue;
                            //Render $viewValue on ui
                            modelCtrl.$render();

                            //Reset caret position
                            if (_maskedValue.indexOf(',') > 0) {
                                _caretPosition = _caretPosition + _maskedValue.match(/,/g).length;
                            }
                            _element[0].setSelectionRange(_caretPosition, _caretPosition);
                        }
                    } else if (fieldType == 'Number' || fieldType == 'Alpha') {
                        if (!new RegExp(regExp).test(inputValue)) {
                            transformedInput = transformedInput.substr(0, transformedInput.length - 1);
                        }
                    }
                    //transformedInput = inputValue.replace(regExp, '');
                }
                //Apply Max Length to input field
                var maxLength = $filter('maxLength')(_fieldName);
                if (!_.isUndefined(maxLength) && transformedInput.length > maxLength)
                    transformedInput = transformedInput.substring(0, maxLength);
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });


            if (_element[0].tagName === 'BUTTON') {
                _element.on('click', function () {
                    returnService.lastChangedField = undefined;
                });
            }

            if (_element[0].tagName === 'INPUT') {
                _element.on('focus', function () {
                    returnService.lastChangedField = undefined;
                });
            }

            if (_element[0].tagName === 'SELECT') {
                _element.on('change', function () {
                    returnService.lastChangedField = undefined;
                });
            }

            //on blur event does not work on combo/select type when user click to different field using mouse
            //in such case blur event handler is fired forcefully from watch function see below
            //it works with Tab, this probelm is not found in text box
            _element.on('blur', function () {
                //if field is calculated and focus lost from field we do not want to fire calculation
                //when calculated field is overridden and value changed we want to fire it
                // lastChangeField is for trick for checkbox,radio and select. checkbox and radio share same model so we get focus 
                //lost request from multiple watchers but we want to fire calculation only once per watch
                // TODO : This will fire calculation for two times for estimated and calculated value field
                if (_isValueChanged && (!_newVal.isCalculated || _newVal.isOverridden)
                    && (_.isUndefined(returnService.lastChangedField) || returnService.lastChangedField !== _fieldName)) {
                    scope.$emit('postTaxFieldChange', attrs.taxField, _newVal);
                    _isValueChanged = false;
                    returnService.lastChangedField = _fieldName;
                }
            });
            //here we are broadcasting focus event with taxfield for training widget 
            _element.on('focus', function (e) {
                $rootScope.$broadcast('fieldFocus', attrs.taxField);
            });
            //we want to watch field object not only change to value, will be helpfull when other 
            //property on field changes and we want to take some decisions.
            scope.$watchCollection(attrs.ngModel.replace('.value', ''), function (newVal, oldVal) {
                if (!_.isEqual(newVal, oldVal)) {
                    _newVal = newVal;
                    _applyFieldStyle(newVal);
                    _isValueChanged = true;
                    //Trick to apply changes immediately for check box,radio and select
                    if (_element[0].tagName === 'BUTTON' || _element[0].tagName === 'SELECT') {
                        //We have wrapped it to timeout otherwise it makes error for $digest
                        $timeout(function () {
                            _element.triggerHandler('blur');
                        });
                    }
                }
            });

            //Shortcut Code START
            //Binding Shortcut for override and estimate feature
            //register event for override  or remove override and  estimate or remove estimate on textfield
            _element.on('keydown', function (event) {
                if (event.shiftKey == true && event.keyCode == 119) { //remove override 
                    scope.field.value = scope.field.calValue;
                    scope.field.isOverridden = false;
                    //fire calculation after unoverridden values
                    scope.$emit('postTaxFieldChange', attrs.taxField, scope.field);

                    //If user remove override on zip field post message to zipLookup so the city and state can be updated
                    if (element.parent().attr('zip-lookup') != undefined) {
                        postal.publish({
                            channel: 'MTPO-Return',
                            topic: 'removeOverrideOnZip',
                            data: {
                                calValue: scope.field.value
                            }
                        });
                    }
                    event.preventDefault();
                    //Set focus on element upon overridden field.
                    element.focus();
                } else if (event.keyCode == 119) {//override
                    if (_.isUndefined(scope.field))
                        scope.field = {};
                    if (!_.isUndefined(scope.field.value))
                        scope.field.calValue = scope.field.value;
                    scope.field.isOverridden = true;
                    event.preventDefault();
                    //Set focus on element upon overridden field.
                    element.focus();
                } else if (event.shiftKey == true && event.keyCode == 114) {//Remove Estimate
                    scope.field.isEstimated = false;
                    //fire calculation after estimated values
                    scope.$emit('postTaxFieldChange', attrs.taxField, scope.field);
                    event.preventDefault();
                    //Set focus on element upon overridden field.
                    element.focus();
                } else if (event.keyCode == 114) {//Estimate
                    if (_.isUndefined(scope.field))
                        scope.field = {};
                    scope.field.isEstimated = true;
                    event.preventDefault();
                    //Set focus on element upon overridden field.
                    element.focus();
                } else if (event.keyCode == 115) {//for Open calculator
                    scope.openCalculator(event);
                }
            });

            //destroy event
            _element.on('$destroy', function (event) {
                _element.off('keydown', event);
                //Added later to check performance
                _element.off('click', event);
                _element.off('focus', event);
                _element.off('change', event);
                _element.off('blur', event);
                //
                //scope.$destroy();
            });
            //ShortCut Code END              
        }
    };

}]);

// Following service we use for showing context menu icon on focus.
// So we have put this service here.
returnApp.service('taxService', [function () {
    var taxService = {};

    // Stores the previous element
    taxService.previousElement = {};

    return taxService;
}]);

//work derived from
//https://github.com/ianwalter/ng-context-menu/tree/master/src
//Here basketService will not work, because it will pop element.
angular.module('returnApp').directive('taxContextMenu', ['$document', '$compile', '$filter', '_', 'contentService', 'returnService', 'taxService', 'environment', function ($document, $compile, $filter, _, contentService, returnService, taxService, environment) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var opened = false;

            //Temporary function to differentiate features as per environment (beta/live)
            var _betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            }

            //Estimate feautre temporary avalible only in beta
            scope.betaOnly = _betaOnly();


            function open(event) {
                var list;
                //If interview mode do not show jump list and create list
                if (returnService.getReturnMode() == 'interview') {
                    list = { jumpToList: [], createList: [] };
                } else {
                    var _currentForm = scope.$parent.$parent.currentForm;
                    if (!angular.isUndefined(_currentForm)) {
                        list = returnService.getLinkForms(scope.fieldname, _currentForm);
                    } else {
                        list = returnService.getLinkForms(scope.fieldname);
                    }
                }

                scope.jumpToList = list.jumpToList;
                scope.createList = list.createList;
                //calculating position for context menu 
                var menuElement = angular.element(document.getElementById('taxcontextmenu'));
                menuElement.addClass('open');
                var doc = $document[0].documentElement;
                var docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
                    docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0),
                    elementWidth = menuElement[0].scrollWidth,
                    elementHeight = menuElement[0].scrollHeight;
                var docWidth = doc.clientWidth + docLeft,
                    docHeight = doc.clientHeight + docTop,
                    totalWidth = elementWidth + event.pageX,
                    totalHeight = elementHeight + event.pageY,
                    left = Math.max(event.pageX - docLeft, 0),
                    top = Math.max(event.pageY - docTop, 0);

                //To adjust width as per user's mouse point
                if (totalWidth > docWidth) {
                    left = left - (totalWidth - docWidth);
                }

                //Calculate approximate height of context menu
                //by default its height is 39 as override option is always their in menu
                var menuHeight = 39;
                //condition to check the jumToList array and according to its lenght we calculate the height required by the jump list in context menu
                if (scope.jumpToList.length > 0) {
                    menuHeight += 38 + (20 * scope.jumpToList.length);
                }
                //condition to check the createList array and according to its lenght we calculate the height required by the jump list in context menu
                if (scope.createList.length > 0) {
                    menuHeight += 29 + (20 * scope.createList.length);
                }
                //variable that holds the available height after the element on which right click is fired 
                var availableHeight = docHeight - top;
                //condition to check is the availableHeight is sufficient or not to show contect menu
                if (availableHeight < menuHeight) {
                    top -= menuHeight;
                }
                //If top is in minus open it from top of the page
                top = top < 0 ? 0 : top;

                //open contextmenu
                menuElement.css('top', top + 'px');
                menuElement.css('left', left + 'px');
                opened = true;
                menuElement = null;
            }

            function close() {
                var menuElement = angular.element(document.getElementById('taxcontextmenu'));
                if (menuElement) {
                    menuElement.removeClass('open');
                    menuElement.remove();
                    opened = false;
                }
                menuElement = null;
                scope.jumpToList = [];
                scope.createList = [];
            }

            // Common function to open context menu
            var _openContextMenu = function (event) {
                contentService.getLineTemplate('taxcontextmenu').then(function (Html) {
                    var taxform = angular.element(document.getElementsByTagName('tax-form'));
                    var menuHTML = $compile(Html)(scope);
                    taxform.append(menuHTML);
                    open(event);
                    taxform = null;
                });

                event.preventDefault();
                event.stopPropagation();
            };

            // Common function to show contextmenu icon
            //TODO: Once we release estimated feature for live, we no longer this function as it will be shown in every case.                    
            var _showContextmenuIcon = function () {
                // Close any open context menu of other element.
                close();

                //Get Previous element from service, check IF current element and previous element is not same.
                // IF current element is not same then check whether previous element have contextmenu icon. IF yes then remove that icon.
                var previousElement = taxService.previousElement;
                if (!_.isUndefined(previousElement) && !_.isEmpty(previousElement) && previousElement !== element) {
                    if (!_.isUndefined(previousElement.prev()) && !_.isEmpty(previousElement.prev())) {
                        previousElement.prev().remove();
                    }
                }

                //Check whether contextmenu icon is there or not. 
                if (_.isEmpty(element.prev())) {
                    //Store current element as previous element
                    taxService.previousElement = element;

                    //String contains html for context menu
                    var htmlString = "";

                    // Incase of button html string is different then other.
                    if (element[0].tagName.toLowerCase() == 'button') {
                        htmlString = "<span ng-click='openContextMenu($event);' class='font_size_16 fa fa-ellipsis-v cursor_pointer float-left contexmenu_checkbox'></span>";
                    } else {
                        htmlString = "<span ng-click='openContextMenu($event);' class='font_size_16 fa fa-ellipsis-v cursor_pointer float-left contexmenu_textbox'></span>";
                    }

                    // compile template. Otherwise angular directives won't work. (like - ng-click and ng-show etc.)
                    var tempHtml = $compile(htmlString)(scope);
                    //Append html before the element
                    element.before(tempHtml);
                }


            };

            /*
             * Note: In IOS devices focus event do not work for buttons. So we have to listen for Click event.
             *      We check here that element must be a button to proceed further. 
             */
            element.on('click', function (event) {
                //Check whether element is button then only proceed further
                if (element[0].tagName.toLowerCase() == 'button') {
                    //show icon..,
                    _showContextmenuIcon();
                }
            });


            //On Focus append contextmenu icon into the field
            /*  Note:- 1.) We stores the previous element into service,
             *              On Focus we check whether previous element have context menu icon. IF yes then we remove that icon.
             */
            element.on('focus', function (event) {
                //show icon..,
                _showContextmenuIcon();
            });

            //on click of icon open context menu
            scope.openContextMenu = function (event) {
                _openContextMenu(event);
            };

            // On click of document check whether to open context menu or not            
            element.on('contextmenu', function (event) {
                _openContextMenu(event);
            });

            var handleKeyUpEvent = function (event) {
                if (opened && event.keyCode === 27) {
                    close();
                }
            };

            var handleClickEvent = function (event) {
                if (opened && (event.button !== 2 || event.target !== element)) {
                    close();
                }
            };

            //This function provide override feature. it directly post changes to calculation
            //TODO : This will fire calculation for two times from one from here and another calculation fire in watch from taxField Directive 
            scope.setOverride = function (isOverridden) {
                if (isOverridden) {
                    if (_.isUndefined(scope.field))
                        scope.field = {};
                    if (!_.isUndefined(scope.field.value))
                        scope.field.calValue = scope.field.value;
                    scope.field.isOverridden = true;
                } else {
                    scope.field.value = scope.field.calValue;
                    scope.field.isOverridden = false;
                    //fire calculation after unoverridden values
                    scope.$emit('postTaxFieldChange', attrs.taxField, scope.field);

                    //If user remove override on zip field post message to zipLookup so the city and state can be updated
                    if (element.parent().attr('zip-lookup') != undefined) {
                        postal.publish({
                            channel: 'MTPO-Return',
                            topic: 'removeOverrideOnZip',
                            data: {
                                calValue: scope.field.value
                            }
                        });
                    }

                }

                //Set focus on element upon overridden field.
                element.focus();
            };

            //This function provide estimate feature. 
            //TODO : This will fire calculation for two times from one from here and another calculation fire in watch from taxField Directive 
            scope.setEstimate = function (isEstimate) {
                if (isEstimate) {
                    if (_.isUndefined(scope.field))
                        scope.field = {};
                    scope.field.isEstimated = true;
                } else {
                    scope.field.isEstimated = false;
                }
                //fire calculation after estimated values
                scope.$emit('postTaxFieldChange', attrs.taxField, scope.field);
                //Set focus on element upon overridden field.
                element.focus();

            };

            scope.addForm = function (form) {
                close();
                scope._addToStackNavigation();
                scope.$emit('addForm', form, true);
            };

            scope.loadForm = function (form) {
                close();
                scope._addToStackNavigation();
                scope.$emit('loadForm', form, true);
            };

            //This function will store formdata before we jump or create any new form on calculated field  
            scope._addToStackNavigation = function () {
                var docIndex = element[0].id.split('-');
                var _currentField = scope.fieldname.split('.');
                var obj = { 'docName': _currentField[0], 'fieldName': _currentField[1], 'docIndex': docIndex[1] };
                //push current form data to previous stack navigation
                returnService.addToStackNavigation(obj, "previous");
                //it will blank next stack from next stack navigation
                returnService.blankNextStackNavigation();
            }

            $document.on('keyup', handleKeyUpEvent);
            // Firefox treats a right-click as a click and a contextmenu event while other browsers
            // just treat it as a contextmenu event
            $document.on('click', handleClickEvent);
            $document.on('contextmenu', handleClickEvent);

            scope.$on('$destroy', function () {
                $document.off('keyup', handleKeyUpEvent);
                $document.off('click', handleClickEvent);
                $document.off('contextmenu', handleClickEvent);

                //Added later to check performance
                element.off('click');
                element.off('focus');
                element.off('contextmenu');
            });
        }
    };
}]);

angular.module('returnApp').directive('taxBlurKey', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('keydown', function (event) {
                if (event.keyCode == 13) {
                    //prevent default behaviour
                    event.preventDefault();

                    //jquery field selector for form fields (input, button/checkbox, select)
                    var fieldSelector = 'tax-form input[type=text][disabled!=disabled],tax-form button[disabled!=disabled],tax-form select[disabled!=disabled]';
                    //Appending fields for dialog
                    fieldSelector = fieldSelector + ',.modal-body input[type=text][disabled!=disabled], .modal-body button[disabled!=disabled], .modal-body select[disabled!=disabled]';

                    //get inputboxes inside tax form to emulate tab                    
                    var inputboxes = $window.jQuery(fieldSelector);
                    //var inputboxes = $window.jQuery('tax-form input[type=text][disabled!=disabled]');

                    // getting next index. If shift key is pressed go to previous instead of next
                    var nextIndex;
                    if (event.shiftKey == true) {
                        //decrementing current index by 1 to go to previous textbox
                        nextIndex = inputboxes.index(this) - 1;
                    } else {
                        //incrementing current index by 1 to go to next textbox
                        nextIndex = inputboxes.index(this) + 1;
                    }

                    // getting total number of inputboxes on the page to detect how far we need to go
                    var maxIndex = inputboxes.length;
                    // check to see if next index is still smaller then max index
                    if (nextIndex != undefined && nextIndex < maxIndex) {
                        // setting index to next textbox using CSS3 selector of nth child
                        inputboxes[nextIndex].focus();
                    }
                }
            });

            //Added later to check performance
            scope.$on('$destroy', function () {
                element.off('keydown');
            });
        }
    };
}]);


angular.module('returnApp').directive('taxTextbox', ['returnService', 'environment', function (returnService, environment) {
    return {
        restrict: 'E',
        scope: {
            field: '=', //case sensitive in browser attribute name must always be lowercase
            fieldname: '@'
        },
        link: function (scope, element, attrs) {

            //Temporary function to differentiate features as per environment (beta/live)
            var _betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            }

            //open dialof if field is disabled
            scope.click = function () {
                if (_betaOnly() == true && scope.field.isEnabled == false) {
                    returnService.openDialogOnDisabledField();
                }
            }
        },
        template: '<div class="three-dot-wrap" ng-click="click()"><input id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" class="form-control" ng-model="field.value" type="text" tax-blur-key tax-field="{{fieldname}}" tax-mask="{{field | maskFormat:fieldname}}" tax-mask-placeholder-on-focus="true" tax-mask-use-view-value="true" tax-context-menu value="{{field.value}}"></div>'
    };
}]);

angular.module('returnApp').directive('taxTextarea', [function () {
    return {
        restrict: 'E',
        scope: {
            field: '=', //case sensitive in browser attribute name must always be lowercase
            fieldname: '@'
        },
        template: '<div class="three-dot-wrap"><textarea id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" class="form-control" ng-model="field.value" type="text" tax-blur-key tax-field="{{fieldname}}" tax-context-menu value="{{field.value}}"><div>'
    };
}]);


angular.module('returnApp').directive('taxCheckBox', [function () {
    return {
        restrict: 'E',
        scope: {
            field: '=', //case sensitive in browser attribute name must always be lowercase
            fieldname: '@'
        },
        template: '<div class="three-dot-wrap"><button id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" class="custom_input" ng-model="field.value" tax-field="{{fieldname}}" tax-context-menu tax-btn-checkbox tax-blur-key></button></div>'

    };

}]);

angular.module('returnApp').directive('taxRadio', [function () {
    return {
        restrict: 'E',
        scope: {
            field: '=', //case sensitive in browser attribute name must always be lowercase
            fieldname: '@',
            value: '@',
        },
        template: '<div class="three-dot-wrap"><button id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" class="custom_input" ng-model="field.value" tax-btn-radio="{{value}}" tax-field="{{fieldname}}" tax-context-menu tax-blur-key uncheckable></button></div>'
    };

}]);

angular.module('returnApp').directive('taxLabel', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            rkey: '@',
        },
        link: function (scope, element, attrs) {
            var _loadLabel = function (rkey) {
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
            };

            _loadLabel(scope.rkey);

            scope.$on('localChanged', function () {
                _loadLabel(scope.rkey);
            });
        },
        template: '<label title="{{localText}}">{{localText}}</label>'
    };
}]);

angular.module('returnApp').directive('taxLabelHtml', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            rkey: '@',
        },
        link: function (scope, element, attrs) {
            var _loadLabel = function (rkey) {
                scope.uniqueId = scope.$id;
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
                setTimeout(function () {
                    scope.title = $('#' + scope.uniqueId).text();
                }, 0)
            };

            _loadLabel(scope.rkey);

            scope.$on('localChanged', function () {
                _loadLabel(scope.rkey);
            });
        },
        template: '<label data-ng-bind-html="localText" title="{{title}}" id="{{uniqueId}}"></label>'
    };
}]);

angular.module('returnApp').directive('taxButton', [function () {
    return {
        restrict: 'E',
        scope: {
            rkey: '@',
            click: '&'
        },
        template: '<button ng-click="click()">{{rkey|localText}}</button>'
    };
}]);

//Business lookup start
angular.module('returnApp').directive('taxLookupLevel1', ['contentService', '_', '$timeout', function (contentService, _, $timeout) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@'
        },
        link: function (scope, element, attrs) {
            var _loadMainGroups = function (fieldname) {
                var lookupName = contentService.getFieldLookupName(fieldname);
                var mainlookupwithoutblank = contentService.getLookupMainGroup(lookupName);
                scope.lookupMainGroups = [''].concat(mainlookupwithoutblank);
                if (angular.isUndefined(scope.lookupMainGroups)) {
                    scope.lookupMainGroups = [];
                };
                scope.lookupMainGroups
                if (angular.isUndefined(scope.field)) {
                    scope.field = {};
                }
            };

            //Load lookup data
            scope.lookupMainGroups = [];
            _loadMainGroups(scope.fieldname);

            // We watch whole object instead of value property, to avoid mis behaviour.
            var watchForField = scope.$watchCollection(function () { return scope.field }, function (newVal, oldVal) {
                if (angular.isDefined(newVal) && angular.isDefined(newVal.value) && newVal.value != oldVal.value) {
                    scope.$root.$broadcast(scope.fieldname + 'Changed', newVal.value);
                    scope.$emit('postTaxFieldChange', scope.fieldname, { 'value': newVal.value, 'isCalculated': false });
                }
            });

            // initial broadcast.
            $timeout(function () {
                scope.$root.$broadcast(scope.fieldname + 'Changed', scope.field.value);
            }, 100);

            //Clean up on destroy
            scope.$on('$destroy', function () {
                watchForField();
            });

        },
        templateUrl: contentService.getLineTemplateUrl('lookUpLevel1')
        //template:'<input type="text" ng-model="field.value" typeahead="group for group in lookupMainGroups | filter:$viewValue" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" tax-field="{{fieldname}}" class="form-control" tax-context-menu>'
    };
}]);

angular.module('returnApp').directive('taxLookupLevel2', ['contentService', '_', '$rootScope', 'userService', function (contentService, _, $rootScope, userService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@',
            field2: "=",
            listenerField: '@field2name'
        },
        link: function (scope, element, attrs) {

            var taxYear = userService.getTaxYear();
            var isInit = true;

            var _loadSubGroups = function (fieldName, mainGroupName) {
                if (taxYear == '2019') {
                    var lookupName = contentService.getFieldLookupName(fieldName);

                    if (mainGroupName) {
                        lookupSubGroupsInfo = contentService.getLookupByMainGroup(lookupName, mainGroupName);
                        scope.lookupSubGroups = lookupSubGroupsInfo;
                        scope.mainGroupLookup = angular.copy(scope.lookupSubGroups);
                    } else {
                        scope.lookupSubGroups = undefined
                    }

                    if (scope.lookupSubGroups === undefined || scope.lookupSubGroups.length === 0) {

                        // var lookupData = contentService.getLookup(lookupName);
                        scope.lookupSubGroups = [];
                        scope.LookupObj = []
                        scope.selectedOptionsData = [];
                        scope.mainGroupLookup = [];
                        var lookupMainGroups = contentService.getLookupMainGroup(lookupName);
                        for (var lookupInfo in lookupMainGroups) {
                            scope.LookupObj.push({ 'mainGrop': lookupMainGroups[lookupInfo], 'data': contentService.getLookupByMainGroup(lookupName, lookupMainGroups[lookupInfo]) })
                            scope.selectedOptionsData = scope.selectedOptionsData.concat(contentService.getLookupByMainGroup(lookupName, lookupMainGroups[lookupInfo]));
                        }
                        scope.selectedOptionsData = _.sortBy(scope.selectedOptionsData, 'value')
                        if (!mainGroupName) {
                            scope.lookupSubGroups = scope.selectedOptionsData;
                        } else {
                            scope.lookupSubGroups = contentService.getLookupByMainGroup(lookupName, mainGroupName);
                        }
                    }
                    if (!isInit && scope.field && scope.field.value && lookupSubGroupsInfo.findIndex(function (lookup) { return lookup.value === scope.field.value }) == -1) {
                        scope.$emit('postTaxFieldChange', scope.fieldname, { 'value': '', 'isCalculated': false });
                    } else if (!isInit && scope.field && scope.field.value && !mainGroupName) {
                        scope.$emit('postTaxFieldChange', scope.fieldname, { 'value': '', 'isCalculated': false });
                    } else {
                        isInit = false
                    }

                } else {
                    var lookupName = contentService.getFieldLookupName(fieldName);
                    scope.lookupSubGroups = contentService.getLookupByMainGroup(lookupName, mainGroupName);
                }


                if (angular.isUndefined(scope.lookupSubGroups)) {
                    scope.lookupSubGroups = [];
                };
                if (angular.isUndefined(scope.field)) {
                    scope.field = {};
                }
            };
            // $timeout(function () {
            //     scope.$root.$broadcast(scope.fieldname + 'Changed', scope.field.value);
            // }, 100)
            //Load lookup data
            scope.lookupSubGroups = [];
            var level1Listener = scope.$root.$on(scope.listenerField + 'Changed', function (event, mainGroupName) {
                _loadSubGroups(scope.fieldname, mainGroupName);
            });

            scope.showLineHelp = function () {
                $rootScope.$broadcast('fieldFocus', scope.fieldname);
            }

            scope.searchResults = function (data) {
                if (taxYear == '2019') {
                    if ((data == undefined || data == '') && scope.mainGroupLookup.length > 0) {
                        scope.lookupSubGroups = scope.mainGroupLookup;
                    } else {
                        scope.lookupSubGroups = angular.copy(scope.selectedOptionsData);
                    }
                }
            }
            // We watch whole object instead of value property, to avoid mis behaviour.
            var watchForField = scope.$watchCollection(function () { return scope.field }, function (newVal, oldVal) {
                if (angular.isDefined(newVal) && angular.isDefined(newVal.value) && newVal.value != oldVal.value) {
                    if (taxYear == '2019') {
                        if (newVal.value != '' && newVal.value != undefined) {
                            for (var obj in scope.LookupObj) {
                                if (scope.LookupObj[obj].data.findIndex(function (lookupObject) { return lookupObject.value == newVal.value }) > -1) {
                                    scope.$emit('postTaxFieldChange', scope.listenerField, { 'value': scope.LookupObj[obj].mainGrop, 'isCalculated': false });
                                    break;
                                }
                            }
                        }
                    }
                    scope.$emit('postTaxFieldChange', scope.fieldname, { 'value': newVal.value, 'isCalculated': false });
                }
            });

            //Clean up on destroy
            scope.$on('$destroy', function () {
                level1Listener();
                watchForField();
            });
            if (taxYear == '2019') {
                _loadSubGroups(scope.fieldname);
            }
        },
        templateUrl: contentService.getLineTemplateUrl('lookUpLevel2')
        //template:'<input type="text" ng-model="field.value" typeahead="group.value as group.text for group in lookupSubGroups | filter:$viewValue" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" tax-field="{{fieldname}}" class="form-control" tax-context-menu>'
    };
}]);

// Get 2 or 3 level's of lookup
angular.module('returnApp').directive('codeLookup', ['contentService', '_', function (contentService, _) {
    return {
        restrict: 'E',
        scope: {
            field1: '=',
            field1name: '@',
            field2: "=",
            field2name: '@',
            field3: '=',
            field3name: '@'
        },
        link: function (scope, element, attrs) {
            var _loadGroups = function (fieldName) {
                var lookupName = contentService.getFieldLookupName(fieldName);
                scope.lookupGroups = contentService.getLookup(lookupName);
                if (!_.isUndefined(scope.lookupGroups) && _.isArray(scope.lookupGroups) && !_.isEmpty(scope.lookupGroups)) {
                    // IF field3 is not defined then no need to split value.
                    if (!_.isUndefined(scope.field3name) && !_.isEmpty(scope.field3name)) {
                        // split value property from '-'
                        _.forEach(scope.lookupGroups, function (obj) {
                            var temp = obj.value.split("-");
                            if (!_.isUndefined(temp[0]) && !_.isEmpty(temp[0])) {
                                obj.value = temp[0].trim();
                            }

                            if (!_.isUndefined(temp[1]) && !_.isEmpty(temp[1])) {
                                obj.additional = temp[1].trim();
                            }
                        });
                    }
                } else {
                    scope.lookupGroups = [];
                }
            };

            //Load lookup data
            scope.lookupGroups = [];
            _loadGroups(scope.field1name);

            // watch on field1
            scope.$watchCollection(function () { return scope.$parent.field1 }, function (newVal, oldVal) {
                //Compare if newVal is changed or not
                if (!_.isUndefined(newVal) && !_.isEqual(newVal, oldVal) && !_.isUndefined(newVal.lookupData) && newVal.value == newVal.lookupData.value) {
                    // Find object from array by selected value
                    //Note: We have added lookupData (object) to filter out. (do not remove it)
                    if (!_.isEmpty(newVal.lookupData)) {
                        // Only emit if text not blank
                        if (!_.isUndefined(newVal.lookupData.text)) {
                            scope.$emit('postTaxFieldChange', scope.field2name, { 'value': newVal.lookupData.text, 'isCalculated': true });
                        }
                        // Only emit if additional value not blank
                        if (!_.isUndefined(newVal.lookupData.additional)) {
                            scope.$emit('postTaxFieldChange', scope.field3name, { 'value': newVal.lookupData.additional });
                        }

                        //Passing value to calc so, dependent relation get fire.
                        scope.$emit('postTaxFieldChange', scope.field1name, { 'value': newVal.value });
                    }
                }
            });

            //Clean up on destroy
            scope.$on('$destroy', function () {

            });
        },
        templateUrl: contentService.getLineTemplateUrl('codelookUp')
        //template:'<input type="text" ng-model="field.value" typeahead="group.value as group.text for group in lookupSubGroups | filter:$viewValue" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" tax-field="{{fieldname}}" class="form-control" tax-context-menu>'
    };
}]);
//Business lookup end

angular.module('returnApp').directive('taxLookup', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@'
        },
        link: function (scope, element, attrs) {
            scope.lookupItems = [];
            var _loadLookup = function (fieldname) {
                var lookupName = contentService.getFieldLookupName(fieldname);
                scope.lookupItems = contentService.getLookup(lookupName);

                //Note: Add blank option if not available in lookup. This is required so user can un-select value from combobox (means select blank value)
                if (scope.lookupItems != undefined && scope.lookupItems[0].value != '') {
                    scope.lookupItems.unshift({ text: '', value: '' });
                }

                //Note: As we are adding blank option in lookup options, When there is no value in 'field.value' angular first option as blank in combobox which removed once user select any other option.
                //Now, this leads to two blank option at first. To solve this, we have to assign blank value to field if there is no value in it, which in result select blank option added by us or found in lookup (from metadata)
                if (scope.field == undefined) {
                    scope.field = { value: '' };
                } else if (scope.field.value == undefined || scope.field.value == null) {
                    scope.field.value = '';
                }

            };

            _loadLookup(scope.fieldname);

            scope.$on('lookuploaded', function () {
                _loadLookup(scope.fieldname);
            });

            scope.$on('localChanged', function () {
                _loadLookup(scope.fieldname);
            });
        },
        template: '<div class="three-dot-wrap"><select class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field.value" tax-field="{{fieldname}}" ng-options="lookupItem.value as lookupItem.text for lookupItem in lookupItems" tax-context-menu tax-blur-key style="vertical-align: middle;"></select><div>'
    };
}]);

/**
 * This directive is used to have last name lookup which will allow preparer to select taxpayer's last name for spouse/child or type different
 */
angular.module('returnApp').directive('taxLastName', [function () {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@',
            listenerfield: '=',
            listenerfieldName: '@',
            listenerfieldSpouse: '=',
            listenerfieldSpouseName: '@'
        },
        controller: ['$scope', 'returnService', function ($scope, returnService) {
            //Array of fields
            var fields = [];
            if ($scope.listenerfieldName != undefined) {
                fields.push($scope.listenerfieldName);
            }
            if ($scope.listenerfieldSpouseName != undefined) {
                fields.push($scope.listenerfieldSpouseName);
            }

            //Watch taxpayer & spouse last names to regenerate lookup items
            var watchForField = $scope.$watchCollection(function () { return $scope.listenerfield }, function (newVal, oldVal) {
                //Compare if newVal is changed or not
                if (!_.isUndefined(newVal) && !_.isUndefined(newVal.value)) {
                    //re generate lookup
                    $scope.updateLookUp();
                }
            });

            var watchForFieldSpouse = $scope.$watchCollection(function () { return $scope.listenerfieldSpouse }, function (newVal, oldVal) {
                //Compare if newVal is changed or not
                if (!_.isUndefined(newVal) && !_.isUndefined(newVal.value)) {
                    //re generate lookup
                    $scope.updateLookUp();
                }
            });


            //holding items for lookup(values)
            $scope.lookupItems = [];

            //Update/Generate lookup with latest value on focus
            $scope.updateLookUp = function () {
                //Reset lookup values
                $scope.lookupItems = [];
                //Loop through each fields and push it's values in lookup
                for (var index in fields) {
                    var _field = fields[index].split('.');
                    var _fieldValue = returnService.getElementValue(_field[1], _field[0]);
                    if (_fieldValue != undefined && _fieldValue != '' && $scope.lookupItems.indexOf(_fieldValue) == -1) {
                        $scope.lookupItems.push(_fieldValue);
                    }
                }
            }

            //listen for destroy event to safely de-register various events/watchers, etc...
            $scope.$on('$destroy', function () {
                //un register watchers
                watchForField();
                watchForFieldSpouse();
            });
        }],
        template: '<div class="three-dot-wrap"><input class="form-control" type="text" typeahead="item for item in lookupItems|filter:$viewValue" typeahead-append-to-body="true" typeahead-focus-first="false" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field.value" tax-field="{{fieldname}}" tax-context-menu tax-blur-key></div>'
    };
}]);

/**
 * This directive will be used if we want to have auto state add functionality on any template which have state name as value.
 */
angular.module('returnApp').directive('autoAddState', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //Check type of 
            element.first().bind('change', scope.valueChange);

            //Special cases
            //1. W2 Line 14 - get state value from label and as last line
            scope.specialCase = attrs.autoAddStateSpecialCase;

            //
            scope.$on('$destroy', function () {
                element.first().unbind('change');
            });
        },
        controller: ['$scope', function ($scope) {
            //
            $scope.valueChange = function (event) {
                //
                var selectedOption = event.target.options[event.target.selectedIndex];
                //NOTE: Due to some reason angular add values type in value for example 'string:<VALUE>'
                //We have to remove it for processing further
                var value = selectedOption.value != undefined ? selectedOption.value.replace('string:', '') : '';
                var elementName = event.target.attributes['tax-field'] != undefined ? event.target.attributes['tax-field'].value : 'NOT_FOUND';

                switch ($scope.specialCase) {
                    case 'w2Line14':
                        var label = selectedOption.label;
                        var _matchedValues = label.match(/(?:\([^()]*\))+/g);
                        if (_matchedValues.length > 0) {
                            value = _matchedValues[_matchedValues.length - 1].replace(/\(|\)/g, '')
                        }
                }

                //
                postal.publish({
                    channel: 'MTPO-Return',
                    topic: 'zipUpdate',
                    data: {
                        zipElementName: elementName.split('.')[0] + '.isForcedAutoAddState',
                        zipDetails: { 'state': value }
                    }
                });
            }
        }]
    };
}]);

angular.module('returnApp').directive('clientLetterLookup', ['clientLetterService', function (clientLetterService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@'
        },
        link: function (scope, element, attrs) {
            clientLetterService.getclientLetterList().then(function (response) {
                scope.lookupItems = response;
            }, function (error) {
                $log.error(error);
            });
        },
        template: '<div class="three-dot-wrap"><select class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field.value" tax-field="{{fieldname}}" ng-options="lookupItem.id as lookupItem.name for lookupItem in lookupItems | filter:lookupItem.isPredefined==false" tax-context-menu tax-blur-key></select></div>'
    };
}]);

angular.module('returnApp').directive('priceListLookup', ['priceListService', function (priceListService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@'
        },
        link: function (scope, element, attrs) {
            priceListService.getPriceListList().then(function (response) {
                scope.lookupItems = response;
            }, function (error) {
                $log.error(error);
            });
        },
        template: '<div class="three-dot-wrap"><select class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field" tax-field="{{fieldname}}" ng-options="lookupItem.id as lookupItem.name for lookupItem in lookupItems" tax-context-menu tax-blur-key><option value=""></option></select></div>'
    };
}]);

angular.module('returnApp').directive('taxLineno', [function () {
    return {
        restrict: 'E',
        scope: {
            lineno: '@',
        },
        template: '<label style="min-width:30px; text-align:center; float:left; background:#f5f5f5;">{{lineno}}</label>'
    };
}]);

angular.module('returnApp').directive('taxLink', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            rkey: '@',
            link: '@',
        },
        link: function (scope, element, attrs) {
            var _loadLabel = function (rkey) {
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
            };

            _loadLabel(scope.rkey);

            scope.$on('localChanged', function () {
                _loadLabel(scope.rkey);
            });
        },
        template: '<a href="{{link}}" target="_blank"><label title="{{localText}}">{{localText}}</label></a>'
    };
}]);

angular.module('returnApp').directive('taxLinenoEnd', [function () {
    return {
        restrict: 'E',
        scope: {
            lineno: '@',
        },
        template: '<label style="min-width:30px;text-align:center;float:left;background:#f5f5f5;margin-top:3px;">{{lineno}}</label>'
    };
}]);

//copied from UI bootstrap to have readonly functionality
angular.module('returnApp').directive('taxBtnRadio', ['_', function (_) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            //model -> UI
            ngModelCtrl.$render = function () {
                element.toggleClass('active', angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.taxBtnRadio)));
            };

            //ui->model
            element.on('click', function () {
                if (_.isUndefined(element[0].attributes.readonly)) {
                    var isActive = element.hasClass('active');

                    if (!isActive || angular.isDefined(attrs.uncheckable)) {
                        scope.$apply(function () {
                            //changed from null to empty string, was creating problem with calculation
                            ngModelCtrl.$setViewValue(isActive ? "" : scope.$eval(attrs.taxBtnRadio));
                            ngModelCtrl.$render();
                        });
                    }
                }
            });

            //Added later to check performance
            scope.$on('$destroy', function () {
                element.off('click');
            });
        }
    };
}]);


//copied from UI bootstrap to have readonly functionality
angular.module('returnApp').directive('taxBtnCheckbox', ['_', function (_) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            function getTrueValue() {
                return getCheckboxValue(attrs.btnCheckboxTrue, true);
            }

            function getFalseValue() {
                //Passing undefined as false value, to make in mandatory. 'false' will be considered as value
                return getCheckboxValue(attrs.btnCheckboxFalse, undefined);
            }

            function getCheckboxValue(attributeValue, defaultValue) {
                var val = scope.$eval(attributeValue);
                return angular.isDefined(val) ? val : defaultValue;
            }

            //model -> UI
            ngModelCtrl.$render = function () {
                element.toggleClass('active', angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
            };

            //ui->model
            element.on('click', function () {
                if (_.isUndefined(element[0].attributes.readonly)) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(element.hasClass('active') ? getFalseValue() : getTrueValue());
                        ngModelCtrl.$render();
                    });
                }
            });

            //Added later to check performance
            scope.$on('$destroy', function () {
                element.off('click');
            });
        }
    };
}]);

//Directive to have default focus based on true value of passed ngModel as attribute value
angular.module('returnApp').directive('taxFocusMe', ['$timeout', function ($timeout) {
    return {
        scope: { triggerModel: '=taxFocusMe' },
        link: function (scope, element) {
            //This function will have focus for element
            var letsFocus = function () {
                //timeout is required. Otherwise it will not work.
                $timeout(function () {
                    //Set focus on element.
                    element.focus();
                }, 200);
            }

            //Init
            if (scope.triggerModel == true) {
                letsFocus();
            }

            //Register watcher
            var watcher = scope.$watch('triggerModel', function (newValue, oldValue) {
                if (newValue != oldValue && newValue == true) {
                    letsFocus();
                }
            });

            //Listen for destroy event
            scope.$on('$destroy', function () {
                //Un register watcher
                watcher();
            });
        }
    };
}]);

//Directive to show accordian header as panel header
//Note: Used in depreceation worksheet
angular.module('returnApp').directive('taxAccordianHeading', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            rkey: '@',
            isOpen: '='
        },
        link: function (scope, element, attrs) {
            var _loadLabel = function (rkey) {
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
            };

            _loadLabel(scope.rkey);

            scope.$on('localChanged', function () {
                _loadLabel(scope.rkey);
            });
        },
        template: '<accordion-heading>{{localText}}<i class="float-right glyphicon color_gray" ng-class="{\'glyphicon-chevron-down\': isOpen, \'glyphicon-chevron-right\': !isOpen}"></i></accordion-heading>'
    };
}]);

//Directive to show tab header as panel header
//Note: We have to use "replace: true" to replace our html element with tab-heading. Otherwise it will not work
//Used in Vehicle depreceation worksheet
angular.module('returnApp').directive('taxTabHeading', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            rkey: '@'
        },
        link: function (scope, element, attrs) {
            var _loadLabel = function (rkey) {
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
            };

            _loadLabel(scope.rkey);

            scope.$on('localChanged', function () {
                _loadLabel(scope.rkey);
            });
        },
        template: '<tab-heading>{{localText}}</tab-heading>'
    };
}]);

//copied from Ui-mak we have to modify it to show placeholder on focus and we want value with mask in it
returnApp.value('taxMaskConfig', {
    'maskDefinitions': {
        '9': /\d/,
        'A': /[a-zA-Z]/,
        '*': /[a-zA-Z0-9]/
    }
})
    .directive('taxMask', ['taxMaskConfig', function (maskConfig) {
        return {
            priority: 100,
            require: 'ngModel',
            restrict: 'A',
            compile: function uiMaskCompilingFunction() {
                var options = maskConfig;

                return function uiMaskLinkingFunction(scope, iElement, iAttrs, controller) {
                    var maskProcessed = false, eventsBound = false,
                        //Note: maskPlaceholder is replaced with uiMaskFormat to support mask and placeholder
                        maskCaretMap, maskPatterns, uiMaskFormat, maskComponents,
                        // Minimum required length of the value to be considered valid
                        minRequiredLength,
                        value, valueMasked, isValid,
                        // Vars for initializing/uninitializing
                        //Commented to support placeholder text and mask both
                        /*originalPlaceholder = iAttrs.placeholder,*/
                        originalMaxlength = iAttrs.maxlength,
                        // This variable is added by Zaid chauhan in library code to have option to remove default placeholder for mask format
                        placeholderOnFocus = angular.isDefined(iAttrs.taxMaskPlaceholderOnFocus) ? iAttrs.taxMaskPlaceholderOnFocus : false,
                        useViewValue = angular.isDefined(iAttrs.taxMaskUseViewValue) ? iAttrs.taxMaskUseViewValue : false,
                        // Vars used exclusively in eventHandler()
                        oldValue, oldValueUnmasked, oldCaretPosition, oldSelectionLength;

                    function initialize(maskAttr) {
                        if (!angular.isDefined(maskAttr)) {
                            return uninitialize();
                        }
                        processRawMask(maskAttr);
                        if (!maskProcessed) {
                            return uninitialize();
                        }
                        initializeElement();
                        bindEventListeners();
                        return true;
                    }
                    /*
                     function initUiMaskFormat(uiMaskFormatAttr) {
                      if(! angular.isDefined(uiMaskFormatAttr)) {
                        return;
                      }
                      Changed to below to to support mask and placeholder
                     */
                    function initUiMaskFormat(uiMaskFormatAttr) {
                        if (!angular.isDefined(uiMaskFormatAttr)) {
                            return;
                        }
                        //maskPlaceholder = placeholderAttr; - changed to support mask and placeholder
                        uiMaskFormat = uiMaskFormatAttr;

                        // If the mask is processed, then we need to update the value
                        if (maskProcessed) {
                            eventHandler();
                        }
                    }

                    function formatter(fromModelValue) {
                        if (!maskProcessed) {
                            return fromModelValue;
                        }
                        value = unmaskValue(fromModelValue || '');
                        isValid = validateValue(value);
                        controller.$setValidity('mask', isValid);
                        return isValid && value.length ? maskValue(value) : undefined;
                    }

                    function parser(fromViewValue) {
                        if (!maskProcessed) {
                            return fromViewValue;
                        }
                        value = unmaskValue(fromViewValue || '');
                        isValid = validateValue(value);
                        // We have to set viewValue manually as the reformatting of the input
                        // value performed by eventHandler() doesn't happen until after
                        // this parser is called, which causes what the user sees in the input
                        // to be out-of-sync with what the controller's $viewValue is set to.
                        controller.$viewValue = value.length ? maskValue(value) : '';
                        controller.$setValidity('mask', isValid);
                        if (value === '' && controller.$error.required !== undefined) {
                            controller.$setValidity('required', false);
                        }

                        if (useViewValue == 'true')
                            value = value.length ? maskValue(value) : '';

                        return isValid ? value : undefined;
                    }

                    var linkOptions = {};

                    if (iAttrs.uiOptions) {
                        linkOptions = scope.$eval('[' + iAttrs.uiOptions + ']');
                        if (angular.isObject(linkOptions[0])) {
                            // we can't use angular.copy nor angular.extend, they lack the power to do a deep merge
                            linkOptions = (function (original, current) {
                                for (var i in original) {
                                    if (Object.prototype.hasOwnProperty.call(original, i)) {
                                        if (!current[i]) {
                                            current[i] = angular.copy(original[i]);
                                        } else {
                                            angular.extend(current[i], original[i]);
                                        }
                                    }
                                }
                                return current;
                            })(options, linkOptions[0]);
                        }
                    } else {
                        linkOptions = options;
                    }

                    iAttrs.$observe('taxMask', initialize);
                    //iAttrs.$observe('placeholder', initPlaceholder); - Chnaged to support mask and placeholder
                    iAttrs.$observe('uiMaskFormat', initUiMaskFormat);
                    controller.$formatters.push(formatter);
                    controller.$parsers.push(parser);

                    function uninitialize() {
                        maskProcessed = false;
                        unbindEventListeners();

                        //Commented to support placeholder and masking both
                        /*if (angular.isDefined(originalPlaceholder)) {
                            iElement.attr('placeholder', originalPlaceholder);
                        } else {
                            iElement.removeAttr('placeholder');
                        }*/

                        if (angular.isDefined(originalMaxlength)) {
                            iElement.attr('maxlength', originalMaxlength);
                        } else {
                            iElement.removeAttr('maxlength');
                        }

                        iElement.val(controller.$modelValue);
                        controller.$viewValue = controller.$modelValue;
                        return false;
                    }

                    function initializeElement() {
                        value = oldValueUnmasked = unmaskValue(controller.$modelValue || '');
                        valueMasked = oldValue = maskValue(value);
                        isValid = validateValue(value);
                        var viewValue = isValid && value.length ? valueMasked : '';
                        if (iAttrs.maxlength) { // Double maxlength to allow pasting new val at end of mask
                            iElement.attr('maxlength', maskCaretMap[maskCaretMap.length - 1] * 2);
                        }

                        //Commented to support mask with placeholder
                        // This If Condition is modified by Zaid chauhan in library code to remove default mask placeholder
                        /*if (placeholderOnFocus == 'false') {
                            iElement.attr('placeholder', maskPlaceholder);
                        }*/
                        //Zaid Code - End

                        iElement.val(viewValue);
                        controller.$viewValue = viewValue;
                        // Not using $setViewValue so we don't clobber the model value and dirty the form
                        // without any kind of user interaction.
                    }

                    function bindEventListeners() {
                        if (eventsBound) {
                            return;
                        }
                        iElement.bind('blur', blurHandler);
                        iElement.bind('mousedown mouseup', mouseDownUpHandler);
                        iElement.bind('input keyup click focus', eventHandler);
                        eventsBound = true;
                    }

                    function unbindEventListeners() {
                        if (!eventsBound) {
                            return;
                        }
                        iElement.unbind('blur', blurHandler);
                        iElement.unbind('mousedown', mouseDownUpHandler);
                        iElement.unbind('mouseup', mouseDownUpHandler);
                        iElement.unbind('input', eventHandler);
                        iElement.unbind('keyup', eventHandler);
                        iElement.unbind('click', eventHandler);
                        iElement.unbind('focus', eventHandler);
                        eventsBound = false;
                    }

                    function validateValue(value) {
                        // Zero-length value validity is ngRequired's determination
                        return value.length ? value.length >= minRequiredLength : true;
                    }

                    function unmaskValue(value) {
                        var valueUnmasked = '',
                            maskPatternsCopy = maskPatterns.slice();
                        // Preprocess by stripping mask components from value
                        value = value.toString();
                        angular.forEach(maskComponents, function (component) {
                            value = value.replace(component, '');
                        });
                        angular.forEach(value.split(''), function (chr) {
                            if (maskPatternsCopy.length && maskPatternsCopy[0].test(chr)) {
                                valueUnmasked += chr;
                                maskPatternsCopy.shift();
                            }
                        });
                        return valueUnmasked;
                    }

                    function maskValue(unmaskedValue) {
                        var valueMasked = '',
                            maskCaretMapCopy = maskCaretMap.slice();

                        //maskPlaceholder changed to uiMaskFormat to support mask and placeholder
                        angular.forEach(uiMaskFormat.split(''), function (chr, i) {
                            if (unmaskedValue.length && i === maskCaretMapCopy[0]) {
                                valueMasked += unmaskedValue.charAt(0) || '_';
                                unmaskedValue = unmaskedValue.substr(1);
                                maskCaretMapCopy.shift();
                            }
                            else {
                                valueMasked += chr;
                            }
                        });
                        return valueMasked;
                    }

                    /*
                     function getPlaceholderChar(i) {
                          var placeholder = iAttrs.placeholder;
  
                          if (typeof placeholder !== 'undefined' && placeholder[i]) {
                            return placeholder[i];
                          } else {
                            return '_';
                          }
                        }
                        Below function is changed to support mask and placeholder
                     */
                    function getMaskFormatChar(i) {
                        var maskFormat = iAttrs.uiMaskFormat;

                        if (typeof maskFormat !== 'undefined' && maskFormat[i]) {
                            return maskFormat[i];
                        } else {
                            return '_';
                        }
                    }

                    // Generate array of mask components that will be stripped from a masked value
                    // before processing to prevent mask components from being added to the unmasked value.
                    // E.g., a mask pattern of '+7 9999' won't have the 7 bleed into the unmasked value.
                    // If a maskable char is followed by a mask char and has a mask
                    // char behind it, we'll split it into it's own component so if
                    // a user is aggressively deleting in the input and a char ahead
                    // of the maskable char gets deleted, we'll still be able to strip
                    // it in the unmaskValue() preprocessing.

                    //maskPlaceholder changed to uiMaskFormat to support mask and placeholder
                    function getMaskComponents() {
                        return uiMaskFormat.replace(/[_]+/g, '_').replace(/([^_]+)([a-zA-Z0-9])([^_])/g, '$1$2_$3').split('_');
                    }

                    function processRawMask(mask) {
                        var characterCount = 0;

                        maskCaretMap = [];
                        maskPatterns = [];
                        //maskPlaceholder changed to uiMaskFormat to support mask and placeholder
                        uiMaskFormat = '';

                        if (typeof mask === 'string') {
                            minRequiredLength = 0;

                            var isOptional = false,
                                splitMask = mask.split('');

                            angular.forEach(splitMask, function (chr, i) {
                                if (linkOptions.maskDefinitions[chr]) {

                                    maskCaretMap.push(characterCount);

                                    //maskPlaceholder changed to uiMaskFormat to support mask and placeholder
                                    uiMaskFormat += getMaskFormatChar(i);
                                    maskPatterns.push(linkOptions.maskDefinitions[chr]);

                                    characterCount++;
                                    if (!isOptional) {
                                        minRequiredLength++;
                                    }
                                }
                                else if (chr === '?') {
                                    isOptional = true;
                                }
                                else {
                                    //maskPlaceholder changed to uiMaskFormat to support mask and placeholder
                                    uiMaskFormat += chr;
                                    characterCount++;
                                }
                            });
                        }
                        // Caret position immediately following last position is valid.
                        maskCaretMap.push(maskCaretMap.slice().pop() + 1);

                        maskComponents = getMaskComponents();
                        maskProcessed = maskCaretMap.length > 1 ? true : false;
                    }

                    function blurHandler() {
                        oldCaretPosition = 0;
                        oldSelectionLength = 0;
                        if (!isValid || value.length === 0) {
                            valueMasked = '';
                            iElement.val('');
                            scope.$apply(function () {
                                controller.$setViewValue('');
                            });
                        }
                    }

                    function mouseDownUpHandler(e) {
                        if (e.type === 'mousedown') {
                            iElement.bind('mouseout', mouseoutHandler);
                        } else {
                            iElement.unbind('mouseout', mouseoutHandler);
                        }
                    }

                    iElement.bind('mousedown mouseup', mouseDownUpHandler);

                    function mouseoutHandler() {
                        /*jshint validthis: true */
                        oldSelectionLength = getSelectionLength(this);
                        iElement.unbind('mouseout', mouseoutHandler);
                    }

                    function eventHandler(e) {
                        /*jshint validthis: true */
                        e = e || {};
                        // Allows more efficient minification
                        var eventWhich = e.which,
                            eventType = e.type;

                        // Prevent shift and ctrl from mucking with old values
                        if (eventWhich === 16 || eventWhich === 91) { return; }

                        var val = iElement.val(),
                            valOld = oldValue,
                            valMasked,
                            valUnmasked = unmaskValue(val),
                            valUnmaskedOld = oldValueUnmasked,
                            valAltered = false,

                            caretPos = getCaretPosition(this) || 0,
                            caretPosOld = oldCaretPosition || 0,
                            caretPosDelta = caretPos - caretPosOld,
                            caretPosMin = maskCaretMap[0],
                            caretPosMax = maskCaretMap[valUnmasked.length] || maskCaretMap.slice().shift(),

                            selectionLenOld = oldSelectionLength || 0,
                            isSelected = getSelectionLength(this) > 0,
                            wasSelected = selectionLenOld > 0,

                            // Case: Typing a character to overwrite a selection
                            isAddition = (val.length > valOld.length) || (selectionLenOld && val.length > valOld.length - selectionLenOld),
                            // Case: Delete and backspace behave identically on a selection
                            isDeletion = (val.length < valOld.length) || (selectionLenOld && val.length === valOld.length - selectionLenOld),
                            isSelection = (eventWhich >= 37 && eventWhich <= 40) && e.shiftKey, // Arrow key codes

                            isKeyLeftArrow = eventWhich === 37,
                            // Necessary due to "input" event not providing a key code
                            isKeyBackspace = eventWhich === 8 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === -1)),
                            isKeyDelete = eventWhich === 46 || (eventType !== 'keyup' && isDeletion && (caretPosDelta === 0) && !wasSelected),

                            // Handles cases where caret is moved and placed in front of invalid maskCaretMap position. Logic below
                            // ensures that, on click or leftward caret placement, caret is moved leftward until directly right of
                            // non-mask character. Also applied to click since users are (arguably) more likely to backspace
                            // a character when clicking within a filled input.
                            caretBumpBack = (isKeyLeftArrow || isKeyBackspace || eventType === 'click') && caretPos > caretPosMin;

                        oldSelectionLength = getSelectionLength(this);

                        // These events don't require any action
                        if (isSelection || (isSelected && (eventType === 'click' || eventType === 'keyup'))) {
                            return;
                        }

                        // Value Handling
                        // ==============

                        // User attempted to delete but raw value was unaffected--correct this grievous offense
                        if ((eventType === 'input') && isDeletion && !wasSelected && valUnmasked === valUnmaskedOld) {
                            while (isKeyBackspace && caretPos > caretPosMin && !isValidCaretPosition(caretPos)) {
                                caretPos--;
                            }
                            while (isKeyDelete && caretPos < caretPosMax && maskCaretMap.indexOf(caretPos) === -1) {
                                caretPos++;
                            }
                            var charIndex = maskCaretMap.indexOf(caretPos);
                            // Strip out non-mask character that user would have deleted if mask hadn't been in the way.
                            valUnmasked = valUnmasked.substring(0, charIndex) + valUnmasked.substring(charIndex + 1);
                            valAltered = true;
                        }

                        // Update values
                        valMasked = maskValue(valUnmasked);

                        oldValue = valMasked;
                        oldValueUnmasked = valUnmasked;
                        iElement.val(valMasked);
                        if (valAltered) {
                            // We've altered the raw value after it's been $digest'ed, we need to $apply the new value.
                            scope.$apply(function () {
                                controller.$setViewValue(valUnmasked);
                            });
                        }

                        // Caret Repositioning
                        // ===================

                        // Ensure that typing always places caret ahead of typed character in cases where the first char of
                        // the input is a mask char and the caret is placed at the 0 position.
                        if (isAddition && (caretPos <= caretPosMin)) {
                            caretPos = caretPosMin + 1;
                        }

                        if (caretBumpBack) {
                            caretPos--;
                        }

                        // Make sure caret is within min and max position limits
                        caretPos = caretPos > caretPosMax ? caretPosMax : caretPos < caretPosMin ? caretPosMin : caretPos;

                        // Scoot the caret back or forth until it's in a non-mask position and within min/max position limits
                        while (!isValidCaretPosition(caretPos) && caretPos > caretPosMin && caretPos < caretPosMax) {
                            caretPos += caretBumpBack ? -1 : 1;
                        }

                        if ((caretBumpBack && caretPos < caretPosMax) || (isAddition && !isValidCaretPosition(caretPosOld))) {
                            caretPos++;
                        }
                        oldCaretPosition = caretPos;
                        setCaretPosition(this, caretPos);
                    }

                    function isValidCaretPosition(pos) { return maskCaretMap.indexOf(pos) > -1; }

                    function getCaretPosition(input) {
                        if (!input) return 0;
                        if (input.selectionStart !== undefined) {
                            return input.selectionStart;
                        } else if (document.selection) {
                            // Curse you IE
                            input.focus();
                            var selection = document.selection.createRange();
                            selection.moveStart('character', -input.value.length);
                            return selection.text.length;
                        }
                        return 0;
                    }

                    function setCaretPosition(input, pos) {
                        if (!input) return 0;
                        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
                            return; // Input's hidden
                        }
                        if (input.setSelectionRange) {
                            input.focus();
                            input.setSelectionRange(pos, pos);
                        }
                        else if (input.createTextRange) {
                            // Curse you IE
                            var range = input.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }

                    function getSelectionLength(input) {
                        if (!input) return 0;
                        if (input.selectionStart !== undefined) {
                            return (input.selectionEnd - input.selectionStart);
                        }
                        if (document.selection) {
                            return (document.selection.createRange().text.length);
                        }
                        return 0;
                    }

                    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
                    if (!Array.prototype.indexOf) {
                        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
                            if (this === null) {
                                throw new TypeError();
                            }
                            var t = Object(this);
                            var len = t.length >>> 0;
                            if (len === 0) {
                                return -1;
                            }
                            var n = 0;
                            if (arguments.length > 1) {
                                n = Number(arguments[1]);
                                if (n !== n) { // shortcut for verifying if it's NaN
                                    n = 0;
                                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
                                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                                }
                            }
                            if (n >= len) {
                                return -1;
                            }
                            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
                            for (; k < len; k++) {
                                if (k in t && t[k] === searchElement) {
                                    return k;
                                }
                            }
                            return -1;
                        };
                    }

                };
            }
        };
    }
    ]);

//Form lookup
//Displays form instances of passed doc (categoried in 'new' or 'exiting' instance.
angular.module('returnApp').directive('taxFormLookup', ['$filter', '$rootScope', 'contentService', 'returnService', 'userService', function ($filter, $rootScope, contentService, returnService, userService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@',
            formtype: '=',
            type: '@'
        },
        link: function (scope, element, attrs) {
            //Get all docList to manipulate and split it by comma
            var taxYear = userService.getTaxYear();
            var _docList = attrs.docList.split(",");
            var oldValue = scope.field;
            var isSchEForms = false;

            //boolean variable taken and is checked before adding the form
            //If it is true than and only than it will addForm when the combo box value is changed
            var _forDepreciation = false;

            scope.field.isDisabled = false
            setTimeout(function () {
                scope.field.isDisabled = false
            })
            //condition to chech whether forDepreciation exist in the attribute of directive
            // if (!_.isUndefined(attrs.forDepreciation) && !_.isNull(attrs.forDepreciation) && attrs.forDepreciation != '')
            //     _forDepreciation = _.isBoolean(attrs.forDepreciation) ? attrs.forDepreciation : JSON.parse(attrs.forDepreciation);
            var _loadLookup = function (fieldname) {
                scope.lookupItems = [];
                if (scope.$parent != undefined && scope.$parent.$parent != undefined && scope.$parent.$parent.docIndex != undefined) {
                    returnService.getForms().then(function (formList) {
                        var form = _.find(formList, { docIndex: parseInt(scope.$parent.$parent.docIndex) });
                        if (!_.isUndefined(form) && !_.isEmpty(form)) {
                            var doc = returnService.getDoc(form.docName, form.docIndex);
                            if (doc.parent != undefined) {
                                var form4562 = _.find(formList, { docIndex: doc.parent });
                                var doc4562 = returnService.getDoc(form4562.docName, form4562.docIndex);
                                if (doc4562.parent != undefined) {
                                    var parentForm = _.find(formList, { docIndex: doc4562.parent });
                                    var existInLookup = false;
                                    var formIndex = -1
                                    if (parentForm !== undefined && parentForm.docIndex !== undefined) {
                                        formIndex = _.findIndex(scope.lookupItems, { docIndex: parentForm.docIndex });
                                        if (formIndex !== undefined && formIndex > -1) {
                                            existInLookup = true
                                        }
                                    }
                                    var formData = _prepareFormData(parentForm);
                                    // formData.isDisabled = true;
                                    scope.field = formData;
                                    oldValue = scope.field
                                    //add docName as value
                                    if (existInLookup == false) {
                                        formData.value = formData.docName;
                                        scope.lookupItems.push(formData);
                                    } else {
                                        scope.lookupItems[formIndex] = formData;
                                    }
                                }
                            }
                        }
                    });
                }

                //first condition will be satisfied when the directive is not used for depreciation and it is done when we use the directive in multiple view scenerio
                //second condition is general and will be true if the field passed in directive scope is empty or undefined
                if (_forDepreciation == false || (_.isUndefined(scope.field) || _.isEmpty(scope.field))) {
                    var avalForms = returnService.getAvailableForms();
                    // loop through all docs
                    _.forEach(_docList, function (doc) {
                        //flag to determined whether it is added or not.
                        var isDocAdded = false;

                        // Get all instances of a doc
                        var formInstances = returnService.getForm(doc);

                        // get form properties of a doc
                        var formProperty = angular.copy(returnService.getSingleAvailableForm(doc));

                        //IF form has instances then loop through each instances and add them as existing
                        if (!_.isUndefined(formInstances) && !_.isEmpty(formInstances)) {
                            isDocAdded = true;
                            // loop through each instance and add to array
                            _.forEach(formInstances, function (form) {
                                var formData = {};
                                // check if form is selected then disable drop down
                                if (scope.field != undefined && scope.field.docIndex != undefined && scope.field.docIndex == form.docIndex) {
                                    formData = scope.field;
                                } else {
                                    //set docIndex and docName
                                    formData = _prepareFormData(form);
                                }

                                //add docName as value
                                formData.value = formData.docName;

                                scope.lookupItems.push(formData);
                            }); //end of formInstance loop
                        }

                        if (!_.isUndefined(formProperty)) {
                            if (formProperty != undefined && _.find(avalForms, formProperty)) {
                                var formData = {};
                                if (scope.field != undefined && !_.isEmpty(scope.field) && formProperty.docName == scope.field.docName && isDocAdded == false) {
                                    formData = scope.field;
                                } else {
                                    formData.displayName = formProperty.displayName;
                                    formData.docName = formProperty.docName;
                                    formData.objType = "New";
                                }
                                //IF multi instance then add to new category or doc is not added already then add to new category
                                if (formProperty.isMultiAllowed == true || isDocAdded == false) {
                                    //add docName as value
                                    formData.value = formData.docName;
                                    scope.lookupItems.push(formData);
                                }
                            }
                        }
                    });
                }

                // Order by object type ( 'Existing' or 'New' )
                scope.lookupItems = $filter('orderBy')(scope.lookupItems, 'objType', false);
            };

            var _prepareFormData = function (form) {
                var formData = {};

                //set docIndex and docName
                formData.docIndex = form.docIndex;
                formData.docName = form.docName;

                //set displayname with prefix
                var prefix = $filter('formPrefix')(form);
                var title = form.extendedProperties.displayName;
                if (angular.isDefined(prefix) && prefix != "") {
                    title = title + " " + prefix;
                }
                formData.displayName = title;

                //set objtype to existing
                formData.objType = "Existing";

                return formData;
            };

            // initial load
            _loadLookup(scope.fieldname);

            var _changeLookUp = scope.$on('changeLookUp', function (event, data) {
                _loadLookup(scope.fieldname);
            })
            //Function will be called on blur or click event
            scope.selectForm = function (event) {
                // Before adding form we have to make sure that docname is not undefined else this will throw errors.
                if (_forDepreciation == false && scope.field != undefined && !_.isEmpty(scope.field) && scope.field.docName != undefined) {
                    if (parseInt(taxYear) >= 2018 && (scope.field.docName === 'dSchE' || scope.field.docName === 'dSchEDup' || scope.field.docName === 'd8825' || scope.field.docName === 'd8825Dup') && (scope.type === 'asset' || scope.type === 'vehicle')) {
                        if (scope.formtype !== undefined && scope.formtype.value !== undefined && scope.formtype.value !== '') {
                            isSchEForms = true
                            _addForm();
                        }
                    } else {
                        isSchEForms = false
                        _addForm();
                    }
                }
            };

            scope.$on('$destroy', function () {
                _changeLookUp();
            })

            // On change clear field new to this combobox for assests depreciation
            var _addForm = function () {
                var obj = { 'type': scope.type };
                if (scope.$parent.$parent) {
                    // scope.field.isDisabled = true;
                    obj.value = scope.field;
                    if (scope.$parent.$parent.docIndex != undefined) {
                        obj.docIndex = scope.$parent.$parent.docIndex;
                    }

                    if (oldValue !== undefined && oldValue.docIndex != undefined && oldValue.docIndex != '') {
                        obj.isOnlyChange = true;
                    }

                    if (scope.formtype !== undefined) {
                        obj.propertyValue = scope.formtype.value;
                    }

                    //For new Form
                    if (obj.value.objType == 'New') {
                        // get form properties of a doc
                        var formProperty = angular.copy(returnService.getSingleAvailableForm(obj.value.docName));
                        scope.field.objType = "Existing";
                        returnService.addForm(formProperty).then(function (formAdded) {
                            scope.field.docIndex = formAdded.docIndex;
                            scope.field.objType = "Existing";
                            obj.newFormAdded = true;
                            if (obj.isOnlyChange !== true || isSchEForms == true) {
                                $rootScope.$broadcast('formSelectedInStatementAsForm', obj);
                            } else {
                                if (scope.formtype !== undefined) {
                                    scope.formtype.value = ''
                                    scope.formtype.isRequired = false
                                    obj.propertyValue = ''
                                }
                                $rootScope.$broadcast('formChangedInStatementAsForm', obj);
                            }
                            // scope.$evalAsync(function () {
                            //     scope.field.isDisabled = true;
                            // });
                        });
                    } else {
                        if (obj.isOnlyChange !== true || isSchEForms == true) {
                            $rootScope.$broadcast('formSelectedInStatementAsForm', obj);
                        } else {
                            if (scope.formtype !== undefined) {
                                scope.formtype.value = ''
                                scope.formtype.isRequired = false
                                obj.propertyValue = ''
                            }
                            $rootScope.$broadcast('formChangedInStatementAsForm', obj);
                        }
                    }
                }
            };
        },
        //We have removed tax-field directive here. Because it was triggering blur event. Here we need blur event to trigger on element blur.
        template: '<select ng-class="{\'no-clicking\' : field.isDisabled}" ng-disabled="field.isDisabled" ng-init="field != undefined?false:field={}"  tax-field="{{fieldname}}" class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field" ng-options="lookupItem.displayName group by lookupItem.objType for lookupItem in lookupItems" tax-context-menu tax-blur-key data-ng-change="selectForm()"></select>'
    };
}]);

//This lookup will be used where we need to pass custom options instead of bringing in from content.
//For example - Asset worksheet, "If Sch E" column
//we take array from attribute
//Please note that for both depreciation worksheet, "If Sch E" column we have passed object instead of array and then we take array by package name.
angular.module('returnApp').directive('taxLookupHavingFixedOptions', ['returnService', '$rootScope', 'userService', function (returnService, $rootScope, userService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@',
            form: '=',
            type: '@'
        },
        link: function (scope, element, attrs) {
            var packageWiseList = attrs.packageWiseList;
            scope.lookupItems = [];
            var taxYear = userService.getTaxYear();

            var _loadLookup = function (fieldname) {
                // IF array is passed package wise then take pckgName from return service and assign appropriate array.
                if (_.isUndefined(packageWiseList) || packageWiseList == "" || packageWiseList == false) {
                    scope.lookupItems = JSON.parse(attrs.lookupitems);
                } else if (packageWiseList == "true") {
                    var lookupItems = JSON.parse(attrs.lookupitems);
                    var _pkg = returnService.getPackageName();
                    if (!_.isUndefined(lookupItems) && !_.isUndefined(_pkg) && _pkg != "") {
                        scope.lookupItems = lookupItems[_pkg.toLowerCase()];
                    }
                }
            };

            scope.selectForm = function () {
                if (scope.form != undefined && !_.isEmpty(scope.form) && scope.form.docName != undefined) {
                    if (parseInt(taxYear) >= 2018 && (scope.form.docName == 'dSchE' || scope.form.docName == 'dSchEDup' || scope.form.docName === 'd8825' || scope.form.docName === 'd8825Dup') && (scope.type === 'asset' || scope.type === 'vehicle')) {
                        _addForm();
                    }
                }
            }

            // On change clear field new to this combobox for assests depreciation
            var _addForm = function () {
                var obj = {};
                if (scope.$parent.$parent) {
                    // scope.form.isDisabled = true;
                    obj.value = scope.form;
                    if (scope.$parent.$parent.docIndex != undefined) {
                        obj.docIndex = scope.$parent.$parent.docIndex;
                    }

                    //For new Form
                    if (obj.value.objType == 'New') {
                        // get form properties of a doc
                        var formProperty = angular.copy(returnService.getSingleAvailableForm(obj.value.docName));

                        returnService.addForm(formProperty).then(function (formAdded) {
                            scope.form.docIndex = formAdded.docIndex;

                            scope.form.objType = "Existing";
                            obj.propertyValue = scope.field.value;
                            obj.type = scope.type;
                            obj.newFormAdded = true;
                            $rootScope.$broadcast('formSelectedInStatementAsForm', obj);

                            // scope.$evalAsync(function () {
                            //     scope.form.isDisabled = true;
                            // });
                        });
                    } else {
                        obj.propertyValue = scope.field.value;
                        obj.type = scope.type;
                        $rootScope.$broadcast('formSelectedInStatementAsForm', obj);
                    }
                }
            };

            _loadLookup(scope.fieldname);
        },
        template: '<div class="three-dot-wrap"><select ng-init="field.value != undefined ?false:field.value=\'\'" ng-class="{\'no-clicking disabled\':(type == \'asset\' || type == \'vehicle\') && (form.docName !== \'dSchE\' && form.docName !== \'dSchEDup\' && form.docName !== \'d8825\' && form.docName !== \'d8825Dup\')}" class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field.value" tax-field="{{fieldname}}" ng-options="lookupItem.value as lookupItem.text for lookupItem in lookupItems" tax-context-menu tax-blur-key data-ng-change="selectForm()"><option value="" ng-if="lookupItems[0].value!=\'\'"></option></select><div>'
    };
}]);

//This function will display
angular.module('returnApp').directive('displayLastParent', ['$filter', 'returnService', function ($filter, returnService) {
    return {
        restrict: 'E',
        scope: {
            fieldname: '@',
            field: '='
        },
        link: function (scope, element, attrs) {
            var _currentForm = scope.$parent.$parent.currentForm || scope.$parent.currentForm;
            scope.lastParent = "No Parent";
            scope.field = {};
            var parentDocDisplay = function () {
                if (angular.isDefined(_currentForm.parentDocIndex)) {
                    returnService.getForms().then(function (formList) {
                        var _parentFormLevel1 = _.find(formList, { docIndex: _currentForm.parentDocIndex });
                        //
                        if (angular.isDefined(_parentFormLevel1)) {
                            if (angular.isDefined(_parentFormLevel1.parentDocIndex)) {
                                //
                                var _parentFormLevel2 = _.find(formList, { docIndex: _parentFormLevel1.parentDocIndex });
                                if (angular.isDefined(_parentFormLevel2)) {
                                    scope.lastParent = _parentFormLevel2.extendedProperties.displayName;
                                    var prefix = $filter('formPrefix')(_parentFormLevel2);
                                    if (angular.isDefined(prefix) && prefix != '') {
                                        scope.lastParent = scope.lastParent + prefix;
                                    }
                                } else {
                                    scope.lastParent = _parentFormLevel1.extendedProperties.displayName;
                                    var prefix = $filter('formPrefix')(_parentFormLevel1);
                                    if (angular.isDefined(prefix) && prefix != '') {
                                        scope.lastParent = scope.lastParent + prefix;
                                    }
                                }
                            } else {
                                scope.lastParent = _parentFormLevel1.extendedProperties.displayName;
                                //Prefix
                                var prefix = $filter('formPrefix')(_parentFormLevel1);
                                if (angular.isDefined(prefix) && prefix != '') {
                                    scope.lastParent = scope.lastParent + prefix;
                                }
                            }
                        }
                        scope.field.value = scope.lastParent;
                        scope.$emit('postTaxFieldChange', scope.fieldname, { 'value': scope.field.value });
                    });
                }
            }
            parentDocDisplay();
            var _parentChangeDepreciation = scope.$on('parentChangeDepreciation', function () {
                parentDocDisplay();
            })
            scope.$on('$destroy', function () {
                _parentChangeDepreciation();
            })
        },
        template: '<input id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" class="form-control" ng-model="field.value" type="text" tax-blur-key tax-field="{{fieldname}}" tax-mask="{{field | maskFormat:fieldname}}" tax-context-menu ng-disabled="true" value="{{field.value}}">'
    };
}]);

angular.module('returnApp').directive('taxBankProductLookup', ['$injector', '$rootScope', 'bankProductsService', 'returnService', 'dialogService', '$interval', '$timeout', function ($injector, $rootScope, bankProductsService, returnService, dialogService, $interval, $timeout) {

    // Change for new Bank
    var bankList = {
        'atlas': { docName: 'dAtlasBankApp' },
        'navigator': { docName: 'dAtlasBankApp' },
        'eps': { docName: 'dEPSBankApp' },
        'refundadvantage': { docName: 'dRefundAdvantageBankApp' },
        'tpg': { docName: 'dTPGBankApp' },
        'redbird': { docName: '' }
    };
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@fieldname',
        },

        link: function (scope, element, attrs) {
            //To hold interval for RTN and DAN numbers
            var intervalOfRTNDAN;

            var _loadLookup = function () {
                scope.lookupItems = [];
                scope.lookupItems.push({ "text": "", "value": "" });

                var lookupItems = bankProductsService.getBankList();
                _.forEach(lookupItems, function (item) {
                    scope.lookupItems.push({ "text": item, "value": item });
                });
            };

            // Change for new Bank
            scope.selectBank = function () {
                //check if interval is already defined
                if (angular.isDefined(intervalOfRTNDAN)) {
                    $interval.cancel(intervalOfRTNDAN);
                    intervalOfRTNDAN = undefined;
                }

                if (scope.field != undefined && scope.field.value != undefined) {
                    //We have to broadcast because direct binding wasn't working.
                    scope.$emit('postTaxFieldChange', "dReturnInfo.strbank", scope.field.value);

                    //START: Code for autoPopulated DAN and RTN numbers
                    //show dialog for populated value of DAN and RTN number
                    if (scope.field.value != '') {
                        var trialCount = 0;

                        //Note: This is temporary solution
                        //Timeout is used to delay reading of fields as calculation may take time to change old values adn if we do not do this 
                        //old values will be dsiplayed instead new.
                        $timeout(function () {
                            //Set interval because for new value it may take longer then this
                            intervalOfRTNDAN = $interval(function () {
                                trialCount++;
                                //Get DAN and RTN field values
                                var rtn = returnService.getElementValue('strrtn', 'dReturnInfo');
                                var dan = returnService.getElementValue('strdan', 'dReturnInfo');

                                //check dan and rtn number found of not
                                if (!_.isUndefined(rtn) && rtn != '' && !_.isUndefined(dan) && dan != '') {
                                    var textMsg = "You have selected to include a bank application with this return.The routing and account numbers were auto populated with <b>" + scope.field.value + "</b> information to process the taxpayer’s refund disbursement option.<br><br>Routing Number : " + rtn + "<br>Account Number : " + dan;
                                    //Dialog configuration
                                    var dialogConfig = { "title": "Notification", "text": textMsg };
                                    //Show dialog
                                    var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
                                    //cancel interval
                                    $interval.cancel(intervalOfRTNDAN);
                                } else if (trialCount > 120) {
                                    $interval.cancel(intervalOfRTNDAN);
                                }
                            }, 500);
                        }, 1200)
                    }
                    //END: Code for autoPopulated DAN and RTN numbers

                    // Condition to check if scope.field.value.toLowerCase() is defined or not and scope.field.value != ""
                    if (scope.field.value != "" && bankList[scope.field.value.toLowerCase()].docName != "") {
                        // Variable store the docName
                        var formProp = returnService.getSingleAvailableForm(bankList[scope.field.value.toLowerCase()].docName);
                        returnService.addForm(formProp);
                    }
                }
            };

            // initial load
            _loadLookup();

            scope.$on('$destroy', function () {
                // To prevent memory leak, destroy interval
                if (angular.isDefined(intervalOfRTNDAN)) {
                    $interval.cancel(intervalOfRTNDAN);
                    intervalOfRTNDAN = undefined;
                }
            });
        },
        template: '<select ng-init="field.value != undefined ?false:field.value=\'\'" class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field.value" tax-field="{{fieldname}}" ng-options="lookupItem.value as lookupItem.text for lookupItem in lookupItems" data-ng-change="selectBank()" tax-context-menu tax-blur-key><option value="" ng-if="lookupItems[0].value!=\'\'"></option></select>'
    };
}]);

angular.module('returnApp').directive('preparerLookup', ['preparerService', 'contentService', function (preparerService, contentService) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            fieldname: '@'
        },
        link: function (scope, element, attrs) {

            preparerService.getAvailablePreparerList().then(function (response) {
                scope.lookupItems = response;

            }, function (error) {
                $log.error(error);
            });
        },
        template: '<select class="custom_input_ddl" id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" ng-model="field.value" tax-field="{{fieldname}}" ng-options="lookupItem.preparer.preparerId as ( lookupItem.preparer.preparerId +\' \( \'+ lookupItem.preparer.preparerName + \' \) \' ) for lookupItem in lookupItems" tax-context-menu tax-blur-key></select>'

    };
}]);

// Create for PreFUND Program option for TPG Bank
angular.module('returnApp').directive('preFund', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@', field2: '=', field2name: '@', field3: '=', field3name: '@', field4: '=', field4name: '@'
        },
        template: '<div class="row" data-ng-show="field4.value"><label class="margin_left_11 text-danger" data-ng-show="field1.value==1">In order to opt PreFUND Program minimum refund amount should be ${{field2.value}} or greater.</label><label class="margin_left_11 text-success" data-ng-show="field1.value==2">${{field2.value}} will be disburse as PreFUND and ${{field3.value}} will be disburse using below selected DISBURSEMENT METHOD.</label></div>'
    };
}]);

//
angular.module('returnApp').directive('protectionPlusChk', ['bankProductsService', '$filter', 'returnService', function (bankProductsService, $filter, returnService) {
    return {
        restrict: 'E',
        scope: {
            fieldname: '@',
            field: '='
        },
        link: function (scope, element, attrs) {
            //if user is not enrolled with ptotectionPlus bank then disable checkbox &&
            //if user has not selected the bank eps then diable the checkbox
            if (bankProductsService.getProtectionPlusStatus() == false && (returnService.getElementValue('strbank', 'dReturnInfo') != 'EPS' || bankProductsService.getEPSBankFeeDetails()['auditProtection'] != 'Y')) {
                scope.$emit('postTaxFieldChange', scope.fieldname, { 'isEnabled': false });
            }
        },
        template: '<tax-check-box  field="field" fieldname="{{fieldname}}"></tax-check-box>'
    };
}]);

/**
 * Disable Efile summery refund/payment option after federal accepted
 */
angular.module('returnApp').directive('bankProductMessage', ['returnService', 'localeService', function (returnService, localeService) {
    return {
        restrict: 'E',

        link: function (scope, element, attrs) {
            scope.IsShowLabel = false;
            scope.labelTxt = ''
            var efileObject = returnService.getEfileStatus('federal');
            var federalMainObject = _.find(efileObject, { 'returnTypeCategory': 'MainForm' })

            //Check If federal e-file status is already accepted
            if (!_.isUndefined(federalMainObject) && federalMainObject.status == 9) {
                localeService.translate('You cannot change Refund/Payment Option as your Federal e-file is already accepted.', 'BANKPRODUCT_SHOW_MESSAGE').then(function (translatedText) {
                    scope.labelTxt = translatedText;
                });
                scope.IsShowLabel = true;
                scope.$emit('postTaxFieldChange', 'dReturnInfo.blnExtNoPayment', { 'isRequired': false, 'isEnabled': false });
                scope.$emit('postTaxFieldChange', 'dReturnInfo.strbankDisable', { 'isRequired': false, 'value': true });
                scope.$emit('postTaxFieldChange', 'dReturnInfo.strRefundType', { 'isRequired': false, 'isEnabled': false });
            } else {
                scope.$emit('postTaxFieldChange', 'dReturnInfo.strRefundType', { 'isRequired': false, 'isEnabled': true });
                scope.$emit('postTaxFieldChange', 'dReturnInfo.strbankDisable', { 'isRequired': false, 'value': false });
                scope.$emit('postTaxFieldChange', 'dReturnInfo.blnExtNoPayment', { 'isEnabled': true });
            }
        },
        template: '<label class="col-sm-24 col-md-24 col-lg-24" data-ng-if="IsShowLabel"><b>{{labelTxt}}</b></label>'
    };
}]);

// /**
//  * disable advances option after 28th of februry in EPS 
//  */
// angular.module('returnApp').directive('advanceBankProductMessageEps', ['returnService', 'localeService', function (returnService, localeService) {
//     return {
//         restrict: 'E',

//         link: function (scope, element, attrs) {
//             scope.IsShowLabelForEPS = false;
//             scope.labelTxtForEPS = '';
//             var lastDate = new Date('03/01/2018')
//             var efileObject = returnService.getEfileStatus('eps');
//             if((!_.isUndefined(efileObject) && !_.isUndefined(efileObject.eps) && efileObject.eps.status != 17) || _.isUndefined(efileObject)){
//                 if ((returnService.getElementValue('BankAppTypeChk', 'dEPSBankApp') == "1" || returnService.getElementValue('BankAppTypeChk', 'dEPSBankApp') == "3") && new Date() > lastDate) {
//                     localeService.translate('The Refund Advance option is not available after February 28th, 2018. Please select "Refund Transfer".', 'EPSADVANCEBANKPRODUCT_SHOW_MESSAGE').then(function (translatedText) {
//                         scope.labelTxtForEPS = translatedText;
//                     });
//                     scope.IsShowLabelForEPS = true;
//                 }
//             }
//         },
//         template: '<label class="col-sm-24 col-md-24 col-lg-24" data-ng-if="IsShowLabelForEPS"><b>{{labelTxtForEPS}}</b></label>'
//     };
// }]);


// /**
//  * disable advances option after 28th of februry in TPG
//  */
// angular.module('returnApp').directive('advanceBankProductMessageTpg', ['returnService', 'localeService', function (returnService, localeService) {
//     return {
//         restrict: 'E',

//         link: function (scope, element, attrs) {
//             scope.IsShowLabelForTPG = false;
//             scope.labelTxtForTPG = '';
//             var lastDate = new Date('03/01/2018')
//             var efileObject = returnService.getEfileStatus('tpg');
//             if((!_.isUndefined(efileObject) && !_.isUndefined(efileObject.tpg) && efileObject.tpg.status != 17) || _.isUndefined(efileObject)){
//                 if (efileObject.tpg.status != 17 && (returnService.getElementValue('BankAppTypeChk', 'dTPGBankApp') == "1" || returnService.getElementValue('BankAppTypeChk', 'dTPGBankApp') == "3") && new Date() > lastDate) {
//                     localeService.translate('The Fast Cash Advance option is not available after February 28th, 2018. Please select "Refund Transfer".', 'TPGADVANCEBANKPRODUCT_SHOW_MESSAGE').then(function (translatedText) {
//                         scope.labelTxtForTPG = translatedText;
//                     });
//                     scope.IsShowLabelForTPG = true;
//                 }
//             }

//         },
//         template: '<label class="col-sm-24 col-md-24 col-lg-24" data-ng-if="IsShowLabelForTPG"><b>{{labelTxtForTPG}}</b></label>'
//     };
// }]);


// /**
//  * disable advances option after 28th of februry in Refund advantages
//  */
// angular.module('returnApp').directive('advanceBankProductMessageRefundAdvantage', ['returnService', 'localeService', function (returnService, localeService) {
//     return {
//         restrict: 'E',

//         link: function (scope, element, attrs) {
//             scope.IsShowLabelForRA = false;
//             scope.labelTxtForRA = '';
//             var lastDate = new Date('03/01/2018')
//             var efileObject = returnService.getEfileStatus('refundadvantage');
//             if((!_.isUndefined(efileObject) && !_.isUndefined(efileObject.refundadvantage) && efileObject.refundadvantage.status != 17) || _.isUndefined(efileObject)){
//                 if ( efileObject.refundadvantage.status != 17 && (returnService.getElementValue('BankAppTypeChk', 'dRefundAdvantageBankApp') == "2" || returnService.getElementValue('BankAppTypeChk', 'dRefundAdvantageBankApp') == "3") && new Date() > lastDate) {
//                     localeService.translate('The Refund Advance option is not available after February 28th, 2018. Please select "Refund Transfer".', 'RAADVANCEBANKPRODUCT_SHOW_MESSAGE').then(function (translatedText) {
//                         scope.labelTxtForRA = translatedText;
//                     });
//                     scope.IsShowLabelForRA = true;
//                 }
//             }
//         },
//         template: '<label class="col-sm-24 col-md-24 col-lg-24" data-ng-if="IsShowLabelForRA"><b>{{labelTxtForRA}}</b></label>'
//     };
// }]);
/**
 * To show dialog when user select interest bearing.
 */
angular.module('returnApp').directive('taxBankRadio', ['dialogService', function (dialogService) {
    return {
        restrict: 'E',
        scope: {
            field: '=', //case sensitive in browser attribute name must always be lowercase
            fieldname: '@',
            value: '@',
            type: '@'
        },
        link: function (scope, element, attrs) {
            scope.openAdvanceProgrammeTypeDialog = function () {
                if (!_.isUndefined(scope.type) && scope.type == 'bankType' && !_.isUndefined(scope.field.value) && scope.field.value == '1') {
                    var textMsg = "As you would like to offer full advance amount to TaxPayer, he will be eligible for below loan tiers based on his refund.<br><br> 25% of net refund – minimum $500, maximum $2,500, fee $0 <br> 50% of net refund – minimum $1000, maximum $6,000, fee [calculated finance charge] <br>75% of net refund – minimum $1500, maximum $6,000, fee [calculated finance charge] <br> <br> <b>Formula for calculating finance charge: </b><br><br> FinanceCharge = 50% of Net Refund (max $6000)  x  $0.0009863  x  24 days <br>FinanceCharge = 75% of Net Refund (max $6000)  x  $0.0009863  x  24 days";
                    //Dialog configuration
                    var dialogConfig = { "title": "Notification", "text": textMsg };
                    //Show dialog
                    var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' }, dialogConfig);
                }
            }
        },
        template: '<button id="{{fieldname}}-{{$parent.$parent.docIndex || $parent.$parent.$parent.docIndex || $parent.docIndex}}" class="custom_input" ng-model="field.value" ng-click="openAdvanceProgrammeTypeDialog()" tax-btn-radio="{{value}}" tax-field="{{fieldname}}" tax-context-menu tax-blur-key uncheckable></button>'
    };
}]);


/**
 * showing submission ids on form
 */
angular.module('returnApp').directive('displaySubmissionId', ['$filter', 'returnService', function ($filter, returnService) {
    return {
        restrict: 'E',
        scope: {},
        link: function (scope, element, attrs) {
            var _currentForm = scope.$parent.$parent.currentForm || scope.$parent.currentForm;
            scope.submissionId = "";
            if (_currentForm != undefined) {
                //get from efile status
                var efileObject = returnService.getEfileStatus(_currentForm.state);
                var mainStateObjectEfileStatus = _.find(efileObject, { 'returnTypeCategory': 'MainForm' });

                //get from submission ids from return
                if (mainStateObjectEfileStatus != undefined && mainStateObjectEfileStatus.status == 9) {
                    scope.submissionId = mainStateObjectEfileStatus.submissionId;
                } else {
                    //get submission id
                    returnService.getSubmissionIds().then(function (submissionIds) {
                        if (submissionIds != undefined) {
                            var mainStateObjectSubmissionIds = submissionIds[_currentForm.state.toLowerCase()].MainForm[0];
                            if (mainStateObjectSubmissionIds) {
                                scope.submissionId = mainStateObjectSubmissionIds;
                            }
                        }
                    });
                }
            }

        },
        template: '<input type="text" class="form-control" value="{{submissionId}}" disabled tax-blur-key></input>'
    };
}]);

angular.module('returnApp').directive('worksheetStart', ['$filter', 'returnService', 'contentService', '$compile', function ($filter, returnService, contentService, $compile) {
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        link: function (scope, element, attrs) {
            var oldHtml = element.html();
            var accordianHtml = '<div id="accordion">' +
                '<div class="card">' +
                '<div class="card-header bg-primary-light font-weight-bold px-2" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" ng-click="isSelected = !isSelected" style="padding: 0px; border-bottom-color: #ecf9ff;">' +
                '<h5 class="mb-0">' +
                '<span ng-if="!isSelected" class="float-left mr-2 mt-2 no-clicking" style="opacity: 1;"><i class="fa fa-angle-up text-primary"></i></span>' +
                '<span ng-if="isSelected" class="float-left mr-2 mt-2 no-clicking" style="opacity: 1;"><i class="fa fa-angle-right text-primary"></i></span>' +
                '<button class="btn btn-link text-primary" style="text-decoration: none;"><span>{{localText}}</span></button>' +
                '</h5>' +
                '</div>' +
                '<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion" style="height:auto;">' +
                '<div class="card-body pl-1" id="card-body"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            var doc = new DOMParser().parseFromString(accordianHtml, "text/html");
            doc.getElementById("headingOne").id = 'headingOne' + scope.rkey;
            doc.getElementById("collapseOne").setAttribute('aria-labelledby', "headingOne" + scope.rkey);
            doc.getElementById('collapseOne').id = 'collapseOne' + scope.rkey;
            doc.getElementById("headingOne" + scope.rkey).setAttribute('data-target', '#collapseOne' + scope.rkey)
            doc.getElementById("card-body").innerHTML = oldHtml;
            element.html(doc.getElementById('accordion'));
            $compile(element.contents())(scope);
            var _loadLabel = function (rkey) {
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
            };

            _loadLabel(scope.rkey);
        }
    };
}]);


angular.module('returnApp').directive('worksheetLabel', ['contentService', function (contentService) {
    return {
        restrict: 'E',
        scope: {
            rkey: '@',
        },
        link: function (scope, element, attrs) {
            var _loadLabel = function (rkey) {
                scope.localText = contentService.getLocalizedValue(rkey) || rkey;
            };

            _loadLabel(scope.rkey);

            scope.$on('localChanged', function () {
                _loadLabel(scope.rkey);
            });
        },
        template: '<span>{{localText}}</span>'
    };
}]);