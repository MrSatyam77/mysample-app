"use strict";
var notesWidget = angular.module("notesWidget", []);
//Service 
notesWidget.factory('notesService', ['$q', '$log','$http','dataAPI',function ($q, $log, $http, dataAPI) {
    var notesService = {};

    /*get all available noteReturn list for showing  */
    notesService.getReturnNoteList = function () {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientnote/return/list'
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /*get all available notePreparer list for showing  */
    notesService.getPreparerNoteList = function () {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientnote/preparer/list'
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /*method for remove note from form or return */
    notesService.removeNoteForFormOrReturn = function (keyToRemove) {
        var deferred = $q.defer();
        
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientnote/return/remove',
            data: { 'noteId' : keyToRemove 
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /*method for remove preparer */
    notesService.removeNotePreparer = function (keyToRemove) {
        var deferred = $q.defer();
        
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientnote/preparer/remove',
            data: {
                'noteId' : keyToRemove
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* to create New Retrun Note with type requested key is key which are temporary generated*/ 
    notesService.saveNoteForFormOrReturn = function (description,type, requestedKey,date,returnId, docName) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientnote/return/create',
            data : {
                returnNote : {
                    description : description,
                    type: type,
                    requestedKey: requestedKey,
                    date: date,
                    returnId: returnId,
                    docName: docName,
                }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /* to create New preparer Note with requested key is key which are temporary generated*/
    notesService.saveNoteForPreparer= function (description, requestedKey,date) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientnote/preparer/create',
            data : {
                preparerNote : {
                    description : description,
                    requestedKey: requestedKey,
                    date:date
                }
            }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return notesService;
}]);

//Directive
notesWidget.directive('notes', [function () {
    return {
        restrict: 'AE',
        templateUrl: 'taxAppJs/common/widgets/notes/partials/notes-template.html',
        controller: ['$scope', '$log', '$q', 'notesService', 'userService', 'messageService', 'localeService', 'dialogService',function ($scope, $log, $q, notesService, userService, messageService,localeService, dialogService) {
            $scope.returnId = '';    //to store return id 
            $scope.docName = '';   //to store form name
            $scope.activeTab = {}; //to hold active tab 
            //initially show form tab
            $scope.activeTab.formTab = true;
            $scope.activeTab.returnTab = false;
            $scope.activeTab.preparerTab = false;
            $scope.notes = {};   //hold description for save
            $scope.preparerNoteDataList = []; //to hold preparer note data list
            $scope.formReturnNoteDataList = []; //to hold return note data list
            var key = 0; //initlize key value to pass in every save request here we are set initially set 0
            var noteType = ''; //to hold type
            var description = ''; //to hold description
            //on load first time call
            var _init = function () {
                _getReturnNoteList();
                _getPreparerNoteList();
           
            };
            //Listen broadcasted event after newReturn is loaded.
            //here we are store listner in id so we can destroy other wise it will create two listner
            var taxReturnOpen = $scope.$on('TaxReturnOpen', function ($event, returnKey) {
                $scope.returnId = returnKey;
                //Note :- we have to initialize after the return get open so we have called the _init function on broadcast listner
                //If we don't do this than initially wrong counter value is displayed and later on it get update 
                //check user have privilages to see client note 
                if ($scope.userCan('CAN_LIST_CLIENTNOTE')) {
                    _init();
                }
            });
            
            //Listen broadcasted event after form is loaded.
            //here we are store listner in id so we can destroy other wise it will create two listner
            var formLoadedWithForm = $scope.$on('formLoadedWithForm', function ($event, form) {
                $scope.docName = form.docName;
            });

            //manually refresh call 
            $scope.manuallyRefreshNote = function () {
                _getReturnNoteList();
                _getPreparerNoteList();
            };
            //this function is used to check user have privillages or not 
            $scope.userCan = function (privilege) {
                return userService.can(privilege);
            };
            
            //get form and return note list
            var _getReturnNoteList = function () {
                notesService.getReturnNoteList().then(function (success) {
                    $scope.formReturnNoteDataList = success;
                }, function (error) {
                    $log.error(error);
                });
            };

            //get preparer note list
            var _getPreparerNoteList = function () {
                notesService.getPreparerNoteList().then(function (success) {
                    $scope.preparerNoteDataList = success;
                    $scope.secondRefreshStart = false;
                }, function (error) {
                    $scope.secondRefreshStart = false;
                    $log.error(error);
                });
            };
            
           

           //move note here we are just removing note from fromtye after success just add new note to totype
            $scope.moveNote = function (key, desc, fromType, toType, previosDate) {
                    _removeNote(key, fromType).then(function (success) {
                        $scope.saveNote(toType, desc, previosDate);
                    }, function (error) {
                        $log.error(error);
                    });
            };

            //method for save note
            $scope.saveNote = function (type, desc,previosDate) {
                if ($scope.userCan('CAN_CREATE_CLIENTNOTE')) {
                    key++; //increament key value 
                    var currentDate = new Date();
                    if (!_.isUndefined(previosDate) && previosDate !== '') {
                        currentDate = previosDate;
                    }
                    
                    //set note type 
                    if (!_.isUndefined(type) && type !== '') {
                        noteType = type;
                    }
                    else {
                        if ($scope.activeTab.preparerTab === true)
                            noteType = 'preparer';
                        else if ($scope.activeTab.formTab === true)
                            noteType = 'form';
                        else if ($scope.activeTab.returnTab === true)
                            noteType = 'return';
                    }
                    //set desciription 
                    if (!_.isUndefined(desc) && desc !== '') {
                        description = desc;
                    }
                    else {
                        description = $scope.notes.description;
                    }
                    if (noteType === 'preparer') {
                        var noteToPush = { 'description': description, "date": currentDate, 'key': 'N' + key, "title": "You" };
                        $scope.preparerNoteDataList.push(noteToPush);
                        notesService.saveNoteForPreparer(description, 'N' + key, currentDate).then(function (success) {
                            //on success just replace our key with success key and created date with success createddate
                            var match = _.where($scope.preparerNoteDataList , { key  : success.requestedKey });
                            if (angular.isDefined(match) && _.size(match) != 0) {
                                match[0].key = success.key;
                            }
                        }, function (error) {
                            //when error occured just remove last added record and show edit mode
                            $scope.preparerNoteDataList = _.reject($scope.preparerNoteDataList, function (note) {
                                return note.key === 'N' + key;
                            });
                            $log.error(error);
                        });
                    }
                    else if (noteType === 'form' || noteType === 'return') {
                        //on save just push object in array with new key 
                        var noteToPush = { 'description': description , 'type': noteType, "date": currentDate, 'key': 'N' + key, "title": "You" , 'returnId': $scope.returnId, 'docName': $scope.docName };
                        $scope.formReturnNoteDataList.push(noteToPush);
                        notesService.saveNoteForFormOrReturn(description , noteType, 'N' + key, currentDate, $scope.returnId, $scope.docName).then(function (success) {
                            //on success just replace our key with success key 
                            var match = _.where($scope.formReturnNoteDataList , { key  : success.requestedKey });
                            if (angular.isDefined(match) && _.size(match) != 0) {
                                match[0].key = success.key;
                            }
                        }, function (error) {
                            //when error occured just remove last added record and move user to edit mode
                            $scope.formReturnNoteDataList = _.reject($scope.formReturnNoteDataList, function (note) {
                                return note.key === 'N' + key;
                            });
                            $log.error(error);
                        });
                    }
                }
            };
            
            //method to remove note 
           var _removeNote = function (keyToRemove,type) {
                var deferred = $q.defer();
                if (type === 'preparer') {
                    notesService.removeNotePreparer(keyToRemove).then(function (success) {
                        $scope.preparerNoteDataList = _.reject($scope.preparerNoteDataList, function (note) {
                            return note.key === keyToRemove;
                        });
                        deferred.resolve(success);
                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });
                }
                else {
                    notesService.removeNoteForFormOrReturn(keyToRemove).then(function (success) {
                        $scope.formReturnNoteDataList = _.reject($scope.formReturnNoteDataList, function (note) {
                            return note.key === keyToRemove;
                        });
                        deferred.resolve(success);
                    }, function (error) {
                        $log.error(error);
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            };
            
            //call function for remove note 
            $scope.removeNote = function (keyToRemove, type) {
                if ($scope.userCan('CAN_REMOVE_CLIENTNOTE')) {
                    localeService.translate("Do you want to delete this note ?", 'NOTE_DELETECONFIRM_MESSAGE').then(function (translateText) {
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
                        var dialog = dialogService.openDialog("confirm", dialogConfiguration, {text: translateText});
                        dialog.result.then(function (btn) {
                            _removeNote(keyToRemove, type).then(function (success) {
                            }, function (error) {
                                $log.error(error);
                            });
                        }, function (btn) {
                        });
                    });


                }
            };
            //Cleanup on destroy
            $scope.$on('$destroy', function () {
                taxReturnOpen();
                formLoadedWithForm();
            });
        }]
    };
} ]);
