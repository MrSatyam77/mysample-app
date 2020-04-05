"use strict";
//Controller for addForm Dialog
//Issue: We should remove this controller.
returnApp.controller('addFormDialogController', ['_', '$scope', '$modalInstance', '$log', '$filter', 'returnService', 'data', function (_, $scope, $modalInstance, $log, $filter, returnService, data) {
    // Already added forms
    var existingForms = data.existingForms;

    // Available forms (released forms)
    var availableForms = data.availableForms;

    // Selected forms
    // important note :- We have to take this list because add form will be called from many places. At some place available forms and formlist same where at some place it will not be same.
    // So to get selected forms we have to loop through form list only.
    var formList = data.formList;

    // Array will hold list of single instance multilevel parent 
    var autoParents = [];

    var _init = function () {
        // Array will hold objects which are either multi-instace or have muliple parents.
        $scope.formsToAdd = [];
        // Array will hold objects which are parents of selected parent object of a form.
        $scope.selectedForm = [];

        // Loop through all forms and check whether they are selected.
        angular.forEach(formList, function (form) {
            if (form.letsAdd) {
                // Get parents.
                var parents = returnService.getParentForms(form);
                if (angular.isDefined(parents) && !_.isEmpty(parents)) {
                    $scope.formsToAdd.push({ "child": form, "parents": parents });
                }
            }
        });
    };

    // ON Selection of a parent, get list of super parents.
    $scope.getParentForms = function (selectedForm, child) {
        if (angular.isDefined($scope.selectedForm)) {
            // Check whether super parent exists in list or not.
            // And procced further
            var temp = _.findIndex($scope.selectedForm, { "child": child });

            // IF parent not exists in list then get its parent.
            if (angular.isUndefined(temp) || temp == -1) {
                if (angular.isUndefined(selectedForm.docIndex)) {
                    // get parents
                    var parents = returnService.getParentForms(selectedForm);
                    if (angular.isDefined(parents) && !_.isEmpty(parents)) {
                        // IF single parent then directly set values
                        // Else push into super parent list
                        if (parents.length == 1 && selectedForm.parentID != "0") {
                            autoParents.push(selectedForm);
                        } else {
                            $scope.selectedForm.push({ "child": child, "form": selectedForm, "parents": parents });
                        }
                    }
                }
            } else {
                // IF selected parent already exists then no need to procceed for super parent.
                if (angular.isDefined(selectedForm.docIndex)) {
                    _.remove($scope.selectedForm, function (form) {
                        return form.child == child;
                    });
                } else {
                    // ELSE Change selected super parent, and load its details
                    var parents = returnService.getParentForms(selectedForm);
                    if (angular.isDefined(parents) && !_.isEmpty(parents)) {
                        if (parents.length == 1 && selectedForm.parentID != "0") {
                            autoParents.push(selectedForm);
                        } else {
                            $scope.selectedForm.splice(temp, 1, { "child": child, "form": selectedForm, "parents": parents });
                        }
                    }
                }
            }
        }
    };


    /*
 *  Save the list of selected parent for each form
 */
    $scope.save = function () {
        // adding single parent or single instance multilevel parent.
        if (angular.isDefined(autoParents) && !_.isEmpty(autoParents)) {
            _.forEach(autoParents, function (obj) {
                var parentObj = _.find(availableForms, { 'id': obj.parentID });
                obj.isMultilevelParent = true;
                $scope.formsToAdd.push({ "child": obj, "selectedParent": parentObj });
            });
        }

        // Loop through super parents list, and add to forms to add
        _.forEach($scope.selectedForm, function (obj) {
            obj.form.isMultilevelParent = true;
            $scope.formsToAdd.push({ "child": obj.form, "selectedParent": obj.selectedParent });
        });

        // close model with data to manipulate.
        $modalInstance.close($scope.formsToAdd);
    };

    /*
 *  Close of dialog should not stop process of add form 
 */
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };

    _init();
}]);

//Unlock return dialog controller
returnApp.controller('unlockReturnDialogController', ['_', '$scope', '$modalInstance', '$log', 'data', 'returnAPIService', 'messageService','environment', function (_, $scope, $modalInstance, $log, data, returnAPIService, messageService,environment) {
    $scope.unlock = data;

    /*
 *  Save the list of selected parent for each form
 *  Success
 */
    $scope.unlockReturn = function () {
        // unlock api call
        $modalInstance.close();
    };

    /*
 *  Close of dialog should not stop process of add form
 *  Cancel 
 */
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };

    /**
     * call copy return api
     */
    $scope.copyReturn = function () {
        returnAPIService.createDuplicateReturn($scope.unlock.returnId, 'copy').then(function (response) {
            messageService.showMessage('Return copied successfully.', 'success');
            // unlock api call
            $modalInstance.close({ type: 'copy', returnId: response });
        }, function (error) {
            messageService.showMessage('Server Error', 'error');
            $log.error(error);
        });
    }

     /**
     * call copy return api
     */
    $scope.amendedReturn = function () {
        returnAPIService.createDuplicateReturn($scope.unlock.returnId, 'amended').then(function (response) {
            messageService.showMessage('Amended Return created successfully.', 'success');
            // unlock api call
            $modalInstance.close({ type: 'amended', returnId: response });
        }, function (error) {
            messageService.showMessage('Server Error', 'error');
            $log.error(error);
        });
    }


    //Temporary function to differentiate features as per environment (beta/live)
    $scope.betaOnly = function () {
        if (environment.mode == 'beta' || environment.mode == 'local')
            return true;
        else
            return false;
    };

}]);

//printSelectedFormsDialogController

returnApp.controller('printSelectedFormsDialogController', ['_', '$scope', '$modalInstance', 'data', function (_, $scope, $modalInstance, data) {
    $scope.activeForms = data.activeForms;
    //make select or unslelect all forms
    $scope.selectAllForm = function (isSelect) {
        _.forEach($scope.activeForms, function (form) {
            form.isSelected = isSelect;
        });

    };
    /*
 *  Save the list of selected parent for each form
 *  Success
 */
    $scope.save = function () {
        // unlock api call		
        $modalInstance.close(_.filter($scope.activeForms, { isSelected: true }));
    };

    /*
 *  Close of dialog should not stop process of add form
 *  Cancel 
 */
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };

}]);


//depreciationDialogController
returnApp.controller('depreciationDialogController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    //Temporary function to differentiate features as per environment (beta/live)
    $scope.betaOnly = function () {
    if (environment.mode == 'beta' || environment.mode == 'local')
        return true;
    else
        return false;
    };
    //  Close dialog
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };
    $scope.printAsset = function (docNameForPrint) {
        $modalInstance.close({ type: 'printAsset', docName: docNameForPrint });
    }
    $scope.emailAsset = function (docNameForPrint) {
        $modalInstance.close({ type: 'emailAsset', docName: docNameForPrint });
    }

}]);


//einDBDialogController
returnApp.controller('einDBDialogController', ['_', '$scope', '$modalInstance', 'data', function (_, $scope, $modalInstance, data) {
    $scope.isDonotShowDialog = false;
    /*
 *  Save the list of selected parent for each form
 *  Success
 */
    $scope.saveEIN = function (flag) {
        // unlock api call
        $modalInstance.close({ isDonotShowDialog: $scope.isDonotShowDialog, isAutoSave: flag });
    };

}]);

//pdfPasswordProtectedDialogController

returnApp.controller('pdfPasswordProtectedDialogController', ['_', '$scope', '$modalInstance', function (_, $scope, $modalInstance) {
    $scope.passwordDetails = {};
    /*
 *  Save the set password of selected location
 *  Success
 */
    $scope.save = function () {
        $modalInstance.close($scope.passwordDetails);
    };

    $scope.uncheckForPasswordType = function (isSelectedOfPasswordProtectePdf) {
        if (isSelectedOfPasswordProtectePdf == false) {
            $scope.passwordDetails.isProtectedDefaultPassword = undefined;
        }
    };
}]);

//Custome password controller
returnApp.controller('pdfCustomPasswordDialogController', ['_', '$scope', '$modalInstance', function (_, $scope, $modalInstance) {

    /*
 *  Save the set custom password of selected Printing
 *  Success
 */
    $scope.save = function (customPasswordDetails) {
        $modalInstance.close(customPasswordDetails);
    };
}]);

//importScheduleController
returnApp.controller('importScheduleController', ['$scope', '$modalInstance', '$filter', '$log', 'ngTableParams', 'Upload', 'dataAPI', 'dialogService',
    function ($scope, $modalInstance, $filter, $log, ngTableParams, Upload, dataAPI, dialogService) {

        //array that keep the oldKey and newKey as per the user selecting header while arrange data step
        //oldKey holds the old key of json which is loaded from excel (i.e 0,1,2..etc where 0 stands for first column
        //newKey holds the value that is selected from the drop down on step 2 (i.e Arrange data)
        $scope.columnHeader = [];

        //array of object that contains complete data after the user click on next button after arranging data
        $scope.arrangedData = [];

        //array that store the menu which is to be shown in header
        //initially their is only on menu in header(i.e upload file)
        $scope.stepsToImportSchedule = [
            { step: 'step1', title: 'Upload file', next: 'step2', previous: '', isVisible: true },
            { step: 'step2', title: 'Arrange data', next: 'step3', previous: 'step1', isVisible: false },
            { step: 'step3', title: 'Verify & Import', next: '', previous: 'step2', isVisible: false }
        ];

        //array  object for top menu in dialog to import data
        $scope.headerMenu = [
            { step: 'step1', title: 'Upload file' }
        ];

        //variable declared to show the error message when error comes while uploading file more than 15MB 
        $scope.fileSizeMessage = false;
        //variable to show error message while uploading file
        $scope.uploadErrMessage = false;
        //variable to show error message file is invalid
        $scope.invalidFileType = false;

        $scope.isUploadedFile = false;

        //variable is used to allow the file that is to be uploaded
        $scope.acceptFile = '.xlsx,.xls,.ods';

        $scope.acceptFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet,application/vnd.ms-excel,application/kset';

        //object that keep the selected form detail(i.e docName,displayName,objType(will be 'New' or 'Existing') and docIndex(only if the objType is 'Existing') 
        $scope.importForSchedule = {};

        //initial state of progress bar while file upload
        $scope.uploadProgress = 0;

        //actual data that is loaded from excel sheet
        // 0 key stands for the first column in sheet value respected to this key are from the first column of excel sheet
        // 1 key stands for the second column in sheet value respected to this key are from the second column of excel sheet
        // ..
        // ..
        // n
        $scope.dataForImport = [];


        //array object used in the drop down in table header on step 2 while arranging the data
        $scope.colHeadingScheduleD = [
            { id: 'description', value: 'Description', dataType: 'text' },
            { id: 'dateAquired', value: 'Date Aquired', dataType: 'date' },
            { id: 'DateVariousAcq', value: 'Select Inherited or Various', dataType: 'text' },
            { id: 'dateSoldOrDisposed', value: 'Date sold or disposed', dataType: 'date' },
            { id: 'proceeds', value: 'Proceeds', dataType: 'text' },
            { id: 'costOrOtherBasis', value: 'Cost or other basis', dataType: 'number' },
            { id: 'code', value: 'Code', dataType: 'text' },
            { id: 'adjustment', value: 'Adjustment', dataType: 'number' },
            { id: 'shortTermOrLongTerm', value: 'Short term/ Long term "S/L"', dataType: 'text' },
            { id: 'received1099B', value: 'Received 1099B', dataType: 'boolean' },
            { id: '1099BwithBasisReportedToIRS', value: '1099B with basis reported to the IRS', dataType: 'boolean' },
            { id: 'doNotImport', value: 'Do Not Import' }
        ];

        $scope.colHeadingScheduleC = [
            { id: 'incomeDesc', value: 'Income description', dataType: 'text' },
            { id: 'incomeAmt', value: 'Income amount', dataType: 'number' },
            { id: 'advertisingDesc', value: 'Advertising description', dataType: 'text' },
            { id: 'advertisingAmt', value: 'Advertising amount', dataType: 'number' },
            { id: 'contractLaborDesc', value: 'Contract labor description', dataType: 'text' },
            { id: 'contractLaborAmt', value: 'Contract labor amount', dataType: 'number' },
            { id: 'interest', value: 'Interest', dataType: 'number' },
            { id: 'homeInterestDesc', value: 'Home interest description', dataType: 'text' },
            { id: 'homeInterestAmt', value: 'Home interest amount', dataType: 'number' },
            { id: 'propertyTaxesDesc', value: 'Property taxes (Rent or lease) description', dataType: 'text' },
            { id: 'propertyTaxesAmt', value: 'Property taxes (Rent or lease) amount', dataType: 'number' },
            { id: 'repairsAndMaintenanceDesc', value: 'Repairs and maintenance description', dataType: 'text' },
            { id: 'repairsAndMaintenanceAmt', value: 'Repairs and maintenance amount', dataType: 'number' },
            { id: 'utilitiesDesc', value: 'Utilities description', dataType: 'text' },
            { id: 'utilitiesAmt', value: 'Utilities amount', dataType: 'number' },
            { id: 'otherExpensesDesc', value: 'Other Expenses description', dataType: 'text' },
            { id: 'otherExpensesAmt', value: 'Other Expenses amount', dataType: 'number' },
            { id: 'doNotImport', value: 'Do Not Import' }
        ];

        //boolean variable taken to show the error message for the required column while arranging data on step 2 
        $scope.reqColErrMsg = false;

        //boolean variable taken to shoe the error message if two column has the same header
        $scope.uniqHeaderReqErr = false;

        //array object that contains the number of column that contains the invalid data
        var columnsWithInvalidData = [];

        //configure the table grid for step 2(i.e Arrange data)
        $scope.importScheduleTableGrid = new ngTableParams({
            page: 1,            // show first page
            total: 1,			//hide paggination
            count: $scope.dataForImport.length           // count per page
        }, {
                counts: [],
                getData: function ($defer, params) {
                    $defer.resolve($scope.dataForImport.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        //configure the table grid for step 3(i.e Verify & import)
        $scope.arrangeDataGrid = new ngTableParams({
            page: 1,            // show first page
            total: 1,			//hide pagination
            count: $scope.arrangedData.length           // count per page
        }, {
                counts: [],
                getData: function ($defer, params) {
                    $defer.resolve($scope.arrangedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });

        //method called when excel file is uploaded to import data	
        $scope.onFileSelect = function ($files) {
            if ($files.length > 0) {
                _resetAll();
                var maxAllowedSize = 15 * 1024 * 1024;
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    //check file is in supported file list
                    if (!_.includes($scope.acceptFileType.split(','), file.type)) {
                        $scope.fileType = file.type;
                        $scope.invalidFileType = true;
                        $scope.fileSizeMessage = false;
                        $scope.uploadErrMessage = false;
                    }
                    else {
                        $scope.invalidFileType = false;
                        //condition to check whether file size is within the limit or not
                        if (file.size < maxAllowedSize) {
                            $scope.fileSizeMessage = false;

                            //declare to show the message to user if the file uploaded size is more than the limit
                            $scope.message = '';
                            $scope.upload = Upload.upload({
                                url: dataAPI.base_url + '/return/uploadScheduleFile', //upload.php script, node.js route, or servlet url
                                file: $files[0], // or list of files ($files) for html5 only
                                //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                                // customize file formData name ('Content-Disposition'), server side file variable name. 
                                //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
                                // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                                //formDataAppender: function(formData, key, val){}
                            }).then(function (response) {
                                $scope.uploadProgress = 100;

                                $scope.noOfColumns = response.data.data.noOfColumn;
                                _.forEach(response.data.data.importedData, function (row) {
                                    var isNewRow = true;
                                    for (var i = 0; i < $scope.noOfColumns; i++) {
                                        if (isNewRow && row[i]) {
                                            $scope.dataForImport.push({});
                                            isNewRow = false;
                                        }
                                        if (row[i]) {
                                            $scope.dataForImport[$scope.dataForImport.length - 1][i] = row[i];
                                        }
                                    }
                                });
                                $scope.noOfActualData = $scope.dataForImport.length;
                                if (!_.isUndefined($scope.importForSchedule.formDetail) && !_.isEmpty($scope.importForSchedule.formDetail)) {
                                    $scope.isUploadedFile = true;
                                    $scope.next();
                                }
                            }, function (error) {
                                $log.log(error);
                                //to show the message when error occurs while uploading
                                $scope.uploadErrMessage = true;
                                $scope.fileSizeMessage = false;
                                $scope.uploadProgress = 0;
                            }, function (update) {
                                $scope.uploadProgress = parseInt(100.0 * update.loaded / update.total) > 90 ? 90 : parseInt(100.0 * update.loaded / update.total);
                            });
                        } else if (file.size > maxAllowedSize) {
                            $scope.fileSizeMessage = true;
                            $scope.uploadErrMessage = false;
                        }
                    }
                }
            }
        };

        //method used to go to next step
        $scope.next = function () {
            $scope.requiredColumnError = false;
            $scope.requiredColumnErrorMsg = "";
            //get the index of the current view in dialog
            var getCurrentViewIndex = _.findIndex($scope.stepsToImportSchedule, function (view) {
                return view.isVisible == true;
            });
            //condition to check whether index is got or not
            if (getCurrentViewIndex != -1) {
                //condition to check whether the current view is step 2 or not
                //this is done as on step 2 user arranges the data according to his choice and click on next
                //we are checking the data whether they are in correct format or not
                if ($scope.stepsToImportSchedule[getCurrentViewIndex].step == 'step2') {
                    //function called in the condition which return true or false
                    //if data are build successfully it will return true else false
                    if (_buildDataToArrange()) {
                        //if data successfully built than we send user to next step to verify it
                        _nextStep(getCurrentViewIndex);
                    } else {
                        //condition to check whether array of column containing error is not empty   
                        if (!_.isEmpty(columnsWithInvalidData)) {
                            //load the dialog with the warning if the columns in the table contains invalid data
                            var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'md' },
                                "taxAppJs/return/workspace/partials/scheduleImportWarningMsg.html", "schImportWarningController", { ColWithInvalidData: columnsWithInvalidData });
                            dialog.result.then(function (btn) {
                                //if the user ignore the warning and click on proceed we redirect him to next step to verify data
                                _nextStep(getCurrentViewIndex);
                            }, function (btn) {

                            });
                        }
                    }
                } else {
                    _nextStep(getCurrentViewIndex);
                }

            }
        };

        //method prepared which set the isVisible to false for current view and set isVisible to true for next step
        var _nextStep = function (getCurrentViewIndex) {
            $scope.stepsToImportSchedule[getCurrentViewIndex].isVisible = false;
            $scope.stepsToImportSchedule[++getCurrentViewIndex].isVisible = true;
            $scope.headerMenu.push({ step: $scope.stepsToImportSchedule[getCurrentViewIndex].step, title: $scope.stepsToImportSchedule[getCurrentViewIndex].title });
        };

        //method used to go to previous step
        $scope.previous = function () {
            var getCurrentViewIndex = _.findIndex($scope.stepsToImportSchedule, function (view) {
                return view.isVisible == true;
            });
            if (getCurrentViewIndex != -1) {
                $scope.stepsToImportSchedule[getCurrentViewIndex].isVisible = false;
                $scope.headerMenu.splice(getCurrentViewIndex, 1);
                $scope.stepsToImportSchedule[--getCurrentViewIndex].isVisible = true;
            }
        };

        /**
	 * method to go on particular step whose menu is clicked from the menu bar on top
	 */
        $scope.goToStep = function (step) {
            var getCurrentViewIndex = _.findIndex($scope.stepsToImportSchedule, function (view) {
                return view.isVisible == true;
            });
            if (getCurrentViewIndex != -1) {
                $scope.stepsToImportSchedule[getCurrentViewIndex].isVisible = false;
            }
            var getViewIndex = _.findIndex($scope.stepsToImportSchedule, function (view) {
                return view.step == step;
            });
            if (getViewIndex != -1) {
                $scope.stepsToImportSchedule[getViewIndex].isVisible = true;
            }
            $scope.headerMenu = [];
            for (var count = 0; count <= getViewIndex; count++) {
                $scope.headerMenu.push({ step: $scope.stepsToImportSchedule[count].step, title: $scope.stepsToImportSchedule[count].title });
            }
        };

        //called to ignore the specific row. It will toggle the isChecked property of the object if exists
        $scope.ignoreRow = function (rec) {
            rec.isChecked = !rec.isChecked;
        };

        /**
	 * method prepared to pair the newKey selected from the combo box on step2 with the respective old key
	 * This is done so as to keep the track which help to build the arrange data when user click next button on step 2
	 * it is called on change of value in drop down of step 2
	 */
        $scope.addOldColumHeader = function (index) {
            //variable to keep the track of index while loop on the $scope.columnHeader
            //If cntHeader and index are same than we skip the check on that iteration for duplicate
            var cntHeader = 0;
            if (!_.isUndefined($scope.columnHeader[index].newKey) && !_.isNull($scope.columnHeader[index].newKey)) {
                $scope.uniqHeaderReqErr = false;
                $scope.reqColErrMsg = false;
                _.forEach($scope.columnHeader, function (headerObj) {
                    if (cntHeader != index && !_.isEmpty(headerObj) && headerObj.newKey != 'doNotImport' && $scope.columnHeader[index].newKey == headerObj.newKey)
                        $scope.uniqHeaderReqErr = true;
                    cntHeader++;
                });
                var selHeader;
                if ($scope.importForSchedule.formDetail.docName == 'dSchD' || $scope.importForSchedule.formDetail.docName == 'dSchedule1041D' || $scope.importForSchedule.formDetail.docName == 'dSch1120SchD' || $scope.importForSchedule.formDetail.docName == 'dSch1120SSchD') {
                    selHeader = _.findWhere($scope.colHeadingScheduleD, { id: $scope.columnHeader[index].newKey });
                    $scope.columnHeader[index].colLabel = selHeader.value;
                    $scope.columnHeader[index].dataType = selHeader.dataType;
                } else {
                    selHeader = _.findWhere($scope.colHeadingScheduleC, { id: $scope.columnHeader[index].newKey });
                    $scope.columnHeader[index].colLabel = selHeader.value;
                    $scope.columnHeader[index].dataType = selHeader.dataType;
                }
                //condition checks whether oldKey exist on this index of $scope.columnHeader 
                //if oldKey does not exist then and only then we add oldKey on specific index else we skip this thing
                if (_.isUndefined($scope.columnHeader[index].oldKey) || _.isNull($scope.columnHeader[index].oldKey) || $scope.columnHeader[index].oldKey == '')
                    $scope.columnHeader[index].oldKey = index;
            } else {
                $scope.columnHeader.splice(index, 1, {});
            }
        };

        /**
	 * method to arrange the data as the user requirement 
	 * It set the header of the column selected from the combo box on step 2
	 */
        var _buildDataToArrange = function () {
            //boolean variable taken for duplicate header not allowed in columns
            //var isDuplicate = false;

            //condition to check whether user has selected required columns or not for schedule d
            if ($scope.importForSchedule.formDetail.docName == 'dSchD' || $scope.importForSchedule.formDetail.docName == 'dSchedule1041D' || $scope.importForSchedule.formDetail.docName == 'dSch1120SchD' || $scope.importForSchedule.formDetail.docName == 'dSch1120SSchD') {
                var received1099Bobj = _.find($scope.columnHeader, { "newKey": "received1099B" });
                var _1099BwithBasisReportedToIRS = _.find($scope.columnHeader, { "newKey": "1099BwithBasisReportedToIRS" });
                if (received1099Bobj == undefined || _1099BwithBasisReportedToIRS == undefined) {
                    $scope.requiredColumnError = true;
                    $scope.requiredColumnErrorMsg = "Selecting columns 'Received 1099B' and '1099B WITH BASIS REPORTED TO THE IRS' is required to import data.";
                    return false;
                }
            }

            //condition to check whether user has selected at least one column header or not
            if (_.isUndefined($scope.columnHeader) || _.isNull($scope.columnHeader) || _.isEmpty($scope.columnHeader)) {
                $scope.reqColErrMsg = true;
                return false;
            }

            if ($scope.uniqHeaderReqErr == true)
                return false;

            $scope.arrangedColumn;
            if ($scope.importForSchedule.formDetail.docName == 'dSchD' || $scope.importForSchedule.formDetail.docName == 'dSchedule1041D' || $scope.importForSchedule.formDetail.docName == 'dSch1120SchD' || $scope.importForSchedule.formDetail.docName == 'dSch1120SSchD')
                $scope.arrangedColumn = _arrangeColumnHeading($scope.colHeadingScheduleD, $scope.columnHeader);
            else if ($scope.importForSchedule.formDetail.docName == 'dSchC')
                $scope.arrangedColumn = _arrangeColumnHeading($scope.colHeadingScheduleC, $scope.columnHeader);

            if ($scope.arrangedColumn.length == 0) {
                $scope.reqColErrMsg = true;
                return false;
            }

            //re-initialize array
            $scope.arrangedData = [];
            columnsWithInvalidData = [];
            //loop on actual data loaded from excel file
            _.forEach($scope.dataForImport, function (row) {
                row.columnsWithInvalidData = [];
                //condition to check whether the object contains isChecked property
                //If yes the it must be false, if the isChecked property in object is true than we have to ignore that object
                //Note: one object is equal to one row and in grid we have a ignore column with check box in it
                if (_.isUndefined(row.isChecked) || row.isChecked == false) {
                    //object which will store the row data with new key replacing old key
                    var objBuild = {};
                    //loop on the $scope.arrangedColumn array which contains the oldKey and newKey pair
                    _.forEach($scope.arrangedColumn, function (headerObj) {
                        //boolean variable is set to true by default
                        var isValid = true;
                        if (!_.isUndefined(row[headerObj.oldKey]) && !_.isNull(row[headerObj.oldKey]) && headerObj.dataType == 'date') {
                            var displayDate = moment(row[headerObj.oldKey], ["MM/DD/YY", "MM/DD/YYYY", "DD/MM/YY", "DD/MM/YYYY"]).format("MM/DD/YYYY");
                            if (displayDate.toLowerCase() == 'invalid date') {
                                columnsWithInvalidData.push({ columnName: headerObj.colLabel, dataType: headerObj.dataType });
                                isValid = false;
                                row.columnsWithInvalidData.push(headerObj.colLabel);
                            } else {
                                row[headerObj.oldKey] = displayDate;
                            }
                        } else if (!_.isUndefined(row[headerObj.oldKey]) && !_.isNull(row[headerObj.oldKey]) && headerObj.dataType == 'number') {
                            if (_.isNaN(parseInt(row[headerObj.oldKey])) || !_.isNumber(parseInt(row[headerObj.oldKey]))) {
                                columnsWithInvalidData.push({ columnName: headerObj.colLabel, dataType: headerObj.dataType });
                                isValid = false;
                                row.columnsWithInvalidData.push(headerObj.colLabel);
                            }
                        } else if (!_.isUndefined(row[headerObj.oldKey]) && !_.isNull(row[headerObj.oldKey]) && headerObj.dataType == 'boolean') {
                            if (row[headerObj.oldKey].toLowerCase() != 'yes' && row[headerObj.oldKey].toLowerCase() != 'y' && row[headerObj.oldKey].toLowerCase() != 'no' && row[headerObj.oldKey].toLowerCase() != 'n') {
                                columnsWithInvalidData.push({ columnName: headerObj.colLabel, dataType: headerObj.dataType });
                                row.columnsWithInvalidData.push(headerObj.colLabel);
                                if (headerObj.newKey == 'received1099B' || headerObj.newKey == '1099BwithBasisReportedToIRS')
                                    row[headerObj.oldKey] = 'No';
                            }
                        }

                        //condition that checks whether any object's newKey property holds the 'do not import' value
                        //Note: we will skip the column whose header is 'do not import' selected by user on arrange data step
                        if (isValid == true && !_.isUndefined(headerObj) && headerObj.newKey != 'doNotImport')
                            if (headerObj.newKey == 'received1099B' || headerObj.newKey == '1099BwithBasisReportedToIRS')
                                objBuild[headerObj.newKey] = !_.isUndefined(row[headerObj.oldKey]) ? row[headerObj.oldKey] : 'No';
                            else
                                objBuild[headerObj.newKey] = row[headerObj.oldKey];

                    });
                    //simply we push the entire object in final array that is to be shown on step 3
                    $scope.arrangedData.push(objBuild);
                    //variable taken to show the no of rows arranged in step 3
                    $scope.noOfArrangeData = $scope.arrangedData.length;
                }
            });
            //removes the duplicate object from the array
            columnsWithInvalidData = _.uniq(columnsWithInvalidData, 'columnName');
            if (!_.isEmpty(columnsWithInvalidData))
                return false;
            else
                return true;
        };

        //method prepared to set the header in the proper order which we show in the image on step 1
        var _arrangeColumnHeading = function (colHeadingOpt, selHeader) {
            var arrangedColumn = [];
            _.forEach(colHeadingOpt, function (obj) {
                _.forEach(selHeader, function (selHeaderObj) {
                    if (!_.isUndefined(selHeaderObj) && !_.isNull(selHeaderObj) && !_.isEmpty(selHeaderObj) && obj.id == selHeaderObj.newKey) {
                        arrangedColumn.push(selHeaderObj);
                    }
                });
            });
            return arrangedColumn;
        };

        /**
	 * method prepared to check the check box if the value is either Yes or y
	 * this method is used for column containing Yes or no value
	 */
        $scope.getChecked = function (value) {
            if (!_.isUndefined(value))
                if ((!_.isUndefined(value) && value.toLowerCase() == 'y') || (!_.isUndefined(value) && value.toLowerCase() == 'yes'))
                    return true;
                else
                    return false;
        };

        /**
	 * method prepared to set the property when the check box in the column is checked or unchecked
	 */
        $scope.setChecked = function (rec, property) {
            if (_.isUndefined(rec[property]) || rec[property].toLowerCase() == 'no' || rec[property].toLowerCase() == 'n') {
                rec[property] = 'yes';
            } else {
                rec[property] = 'no';
            }
        };

        /**
	 * method is called on step 3 on import button when user verify the data and click on import button
	 */
        $scope.importSchedule = function () {
            //scenerioA - when 1099B received with the basic report to IRS
            //scenerioB - when 1099B received with No basic report to IRS
            //scenerioB - (1) when 1099B is not received but basic report to IRS is done (In real life it is not possible)
            //   		  (2) when 1099B is not received and No basic report to IRS
            //generalData - when either 1099B received column does not exist or 1099B with basic report to IRS column does not exist or both
            //				For schedule C all data will be in generalData array 
            var scenerioA = [], scenerioB = [], scenerioC = [], generalData = [];
            //loop on arrangedData
            //Note: it is done as we allow user to ignore any row if he wants on step 3
            _.forEach($scope.arrangedData, function (row) {
                //formatting varous and inherited value of Select Inherited or Various column
                if (!_.isUndefined(row.DateVariousAcq)) {
                    if (row.DateVariousAcq.toLowerCase() == 'v' || row.DateVariousAcq.toLowerCase() == 'various') {
                        row.DateVariousAcq = 'VARIOUS';
                    } else if (row.DateVariousAcq.toLowerCase() == 'i' || row.DateVariousAcq.toLowerCase() == 'inherited') {
                        row.DateVariousAcq = 'INHERITED';
                    }
                }
                //condition that checks whether the row contains isChecked property
                if (_.isUndefined(row.isChecked) || row.isChecked == false) {
                    if (!_.isUndefined(row.received1099B) && (row.received1099B.toLowerCase() == 'yes' || row.received1099B.toLowerCase() == 'y')) {
                        if (!_.isUndefined(row['1099BwithBasisReportedToIRS']) && (row['1099BwithBasisReportedToIRS'].toLowerCase() == 'yes' || row['1099BwithBasisReportedToIRS'].toLowerCase() == 'y')) {
                            scenerioA.push(row);
                        } else if (!_.isUndefined(row['1099BwithBasisReportedToIRS']) && (row['1099BwithBasisReportedToIRS'].toLowerCase() == 'no' || row['1099BwithBasisReportedToIRS'].toLowerCase() == 'n')) {
                            scenerioB.push(row);
                        }
                    } else if (!_.isUndefined(row.received1099B) && (row.received1099B.toLowerCase() == 'no' || row.received1099B.toLowerCase() == 'n')) {
                        if (!_.isUndefined(row['1099BwithBasisReportedToIRS']) && ((row['1099BwithBasisReportedToIRS'].toLowerCase() == 'yes' || row['1099BwithBasisReportedToIRS'].toLowerCase() == 'y') || (row['1099BwithBasisReportedToIRS'].toLowerCase() == 'no' || row['1099BwithBasisReportedToIRS'].toLowerCase() == 'n'))) {
                            scenerioC.push(row);
                        }
                    } else {
                        generalData.push(row);
                    }
                }
            });

            $modalInstance.close({ formDetail: $scope.importForSchedule.formDetail, scenerioA: scenerioA, scenerioB: scenerioB, scenerioC: scenerioC, generalData: generalData });
        };

        /**
	 * method to reset the complete dialog to the initial stage when user changes the import for on step 1
	 */
        var _resetAll = function () {
            columnsWithInvalidData = [];
            $scope.arrangedData = [];
            $scope.dataForImport = [];
            $scope.columnHeader = [];
            $scope.uploadProgress = 0;
            $scope.fileSizeMessage = false;
            $scope.uploadErrMessage = false;
            $scope.invalidFileType = false;
            $scope.reqColErrMsg = false;
            $scope.uniqHeaderReqErr = false;
            $scope.isUploadedFile = false;
        };

        //method prepared to scroll header with the scroll bar on step 2 and step 3
        $scope.initScroll = function () {
            var tableRow, tableHeader;
            if ($scope.headerMenu.length == 2) {
                tableRow = angular.element(document.getElementById('rowStep2'));
                tableHeader = angular.element(document.getElementById('headerStep2'));
            } else if ($scope.headerMenu.length == 3) {
                tableRow = angular.element(document.getElementById('rowStep3'));
                tableHeader = angular.element(document.getElementById('headerStep3'));
            }
            tableRow.bind('scroll', function (e) {
                tableHeader.css({
                    left: -tableRow[0].scrollLeft + 'px'
                });
            });
        };

        /**
	 * method prepared to perform ng-repeat on integer number
	 * It transforms the number to an array 
	 */
        $scope.getNumber = function (num) {
            return new Array(num);
        };

        /**
	 * method built to get the tooltip message on header when mouse is hover on it
	 */
        $scope.getToolTipMsg = function (columnNameArr) {
            var toolTipMsg = 'Incorrect data in column(s): ';
            _.forEach(columnNameArr, function (columnName, cnt) {
                toolTipMsg += columnName;
                if (cnt != (columnNameArr.length - 1))
                    toolTipMsg += ',';
            });
            return toolTipMsg;
        };

        //  Close dialog
        $scope.close = function () {
            $modalInstance.dismiss('Canceled');
        };

        //kept to reset the complete data when user change schedule form to import 
        $scope.$watch('importForSchedule.formDetail', function (obj) {
            if (!_.isUndefined(obj) && !_.isEmpty(obj))
                _resetAll();
        });

    }]);


/**
 * controller prepared to show the warning message when any column in table contains the invalid data
 */
returnApp.controller('schImportWarningController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {

    $scope.ColWithInvalidData = data.ColWithInvalidData;

    $scope.proceed = function () {
        $modalInstance.close();
    };

    //  Close dialog
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);

/**
 *  Controller for Email Verification code..
 */
returnApp.controller('EmailVerificationDialogController', ['$scope', '$modalInstance', '$q', '$log', '$filter', '$http', 'dataAPI', 'userService', function ($scope, $modalInstance, $q, $log, $filter, $http, dataAPI, userService) {

    $scope.IsCodeSend = false;
    $scope.InValidcode = false;
    $scope.showResendMsg = false;
    //  Close dialog
    $scope.close = function () {
        $scope.InValidcode = false;
        $scope.showResendMsg = false;
        $modalInstance.dismiss('Canceled');
    };

    ///resend verification code 
    $scope.ResendCode = function () {
        $scope.showResendMsg = true;
        $scope.InValidcode = false;
        $scope.SendEmailVerificationcode();
        $scope.verificationCode = "";
    };

    //   ValidateCode 
    $scope.ValidateCode = function () {
        var deffered = $q.defer();
        $scope.showResendMsg = false;
        //Call to print post api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/auth/validateEmailVerificationCode',
            data: {
                'verificationCode': $scope.verificationCode,
                'deviceId': userService.getFingerprint()
            }
        }).then(function (response) {

            if (response.data.data.EmailVerified == true) {
                $scope.InValidcode = false;
                $modalInstance.close(response.data.data.EmailVerified);
            }
            else if (response.data.data.EmailVerified == false) {
                $scope.InValidcode = true;

            }
        }, function (error) {
            $log.error();
            deffered.reject();
        });
    };

    //   SendVerification code
    $scope.SendEmailVerificationcode = function () {
        var deffered = $q.defer();
        //Call to print post api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/auth/sendEmailVerificationCode'

        }).then(function (response) {
            $scope.IsCodeSend = true;

        }, function (error) {
            $log.error();
            deffered.reject();
        });
    };
}]);



/**
 *  Controller for show warning message of No cached state dialog
 */
returnApp.controller('NocachedStateDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {

    /// assing statelist
    $scope.statelist = data.statelist;
    $scope.isNewReturn = false;
    //check is call for new return 
    if (data.isNewReturn != undefined)
        $scope.isNewReturn = data.isNewReturn;
    //  Close dialog
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };
}]);


/**
 *  Controller to show message dialog to ask for preferences for adding state return when zipCode entered 
 */
returnApp.controller('AutoAddStateReturnDialogController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.autoAddStatePreference;


    $scope.close = function () {
        $modalInstance.close($scope.autoAddStatePreference);
    };
}]);

/**
 *  Controller for show warning message of No cached state dialog
 */
returnApp.controller('keyboardShortcutListController', ['$scope', '$modalInstance', '$location', 'browserService', '$window',
    function ($scope, $modalInstance, $location, browserService, $window) {


        //os name
        $scope.os = browserService.getSystemInformation('os');
        //This variable hold printData for pdf printing
        var printData;

        if (_.includes($location.path(), 'home')) {
            printData = [{ header: 'Recent Returns', description: '', shortcut: '' },
            { header: '', description: 'New Return', shortcut: 'Ctrl+R' },
            { header: '', description: 'Return List', shortcut: 'Ctrl+L' }
            ];
            $scope.location = 'home';
        } else if (_.includes($location.path(), 'return/edit')) {
            printData = [{ header: 'Fields', description: '', shortcut: '' },
            { header: '', description: 'Override', shortcut: 'F8' },
            { header: '', description: 'Remove Override', shortcut: 'Shift+F8' },
            { header: '', description: 'Estimated', shortcut: 'F3' },
            { header: '', description: 'Remove Estimated', shortcut: 'Shift+F3' },
            { header: '', description: 'Calculator', shortcut: 'F4' },
            { header: 'Forms', description: '', shortcut: '' },
            { header: '', description: 'Open Add Form Menu', shortcut: 'Ctrl+F10' },
            { header: '', description: 'Open Quick Forms List', shortcut: 'Alt+Q' },
            { header: '', description: 'Add New Instance Of Current Form (Ex: W2)', shortcut: 'Shift+F10' },
            { header: '', description: 'Remove/Delete Current Form', shortcut: 'Shift+F9' },
            { header: '', description: 'Go To Previous Form (Stack Navigation)', shortcut: 'Alt+Page Up' },
            { header: '', description: 'Go To Next Form (Stack Navigation)', shortcut: '  Alt+Page Down' },
            { header: 'Return', description: '', shortcut: '' },
            { header: '', description: 'Save', shortcut: 'F2' },
            { header: '', description: 'Close', shortcut: 'F10' },
            { header: '', description: 'Open Return Status List', shortcut: 'F7' },
            { header: '', description: 'Open Print Menu', shortcut: 'Alt+P' },
            { header: '', description: 'Print Return', shortcut: 'Ctrl+P' },
            { header: '', description: 'Open E-File Menu', shortcut: 'Alt+E' },
            { header: '', description: 'Transmit Return', shortcut: 'Ctrl+E' },
            { header: '', description: 'Open Rejection', shortcut: 'Ctrl+R' },
            { header: '', description: 'Open Tools Menu', shortcut: 'Alt+T' },
            { header: '', description: 'Switch To Interview Mode', shortcut: 'Alt+I' },
            { header: '', description: 'Perform Review', shortcut: 'Ctrl+D' },
            { header: 'State', description: '', shortcut: '' },
            { header: '', description: 'Open Add State Menu', shortcut: 'Alt+S' },
            { header: 'Others', description: '', shortcut: '' },
            { header: '', description: 'Toggle Left Panel', shortcut: 'Alt+L' },
            { header: '', description: 'Toggle Right Panel', shortcut: 'Alt+R' },
            { header: 'Calculator', description: '', shortcut: '' },
            { header: '', description: 'Capture Value From TaxField', shortcut: 'F11' },
            { header: '', description: 'Insert Value Into TaxField', shortcut: 'Insert' },
            { header: '', description: 'Clear Current Entry', shortcut: 'Delete' },
            { header: '', description: 'Clear All', shortcut: 'Ctrl+Delete' },
            { header: '', description: 'Clear Memory', shortcut: 'Ctrl+L' },
            { header: '', description: 'Recall Memory', shortcut: 'Ctrl+R' },
            { header: '', description: 'Store in Memory', shortcut: 'Ctrl+M' },
            { header: '', description: 'Add to Memory', shortcut: 'Ctrl+A' },
            { header: '', description: 'Substract from Memory', shortcut: 'Ctrl+S' },
            { header: '', description: 'Remove Single Value', shortcut: 'Backspace' },
            ];
            $scope.location = 'return';
        } else if (_.includes($location.path(), 'return/interview')) {
            printData = [{ header: 'Fields', description: '', shortcut: '' },
            { header: '', description: 'Override', shortcut: 'F8' },
            { header: '', description: 'Remove Override', shortcut: 'Shift+F8' },
            { header: '', description: 'Estimated', shortcut: 'F3' },
            { header: '', description: 'Remove Estimated', shortcut: 'Shift+F3' },
            { header: '', description: 'Calculator', shortcut: 'F4' },
            { header: 'Forms', description: '', shortcut: '' },
            { header: '', description: 'Previous Form', shortcut: 'Alt+Page Up' },
            { header: '', description: 'Next Form', shortcut: '  Alt+Page Down' },
            { header: 'Return', description: '', shortcut: '' },
            { header: '', description: 'Save', shortcut: 'F2' },
            { header: '', description: 'Close', shortcut: 'F10' },
            { header: '', description: 'Print Return', shortcut: 'Ctrl+P' },
            { header: '', description: 'Transmit Return', shortcut: 'Ctrl+S' },
            { header: '', description: 'Switch To Form Mode', shortcut: 'Alt+F' },
            { header: '', description: 'Perform Review', shortcut: 'Ctrl+D' },
            { header: 'State', description: '', shortcut: '' },
            { header: '', description: 'Add State', shortcut: 'Alt+S' },
            { header: 'Others', description: '', shortcut: '' },
            { header: '', description: 'Toggle Right Panel', shortcut: 'Alt+R' },
            { header: 'Calculator', description: '', shortcut: '' },
            { header: '', description: 'Capture Value From TaxField', shortcut: 'F11' },
            { header: '', description: 'Insert Value Into TaxField', shortcut: 'Insert' },
            { header: '', description: 'Clear Current Entry', shortcut: 'Delete' },
            { header: '', description: 'Clear All', shortcut: 'Ctrl+Delete' },
            { header: '', description: 'Clear Memory', shortcut: 'Ctrl+L' },
            { header: '', description: 'Recall Memory', shortcut: 'Ctrl+R' },
            { header: '', description: 'Store in Memory', shortcut: 'Ctrl+M' },
            { header: '', description: 'Add to Memory', shortcut: 'Ctrl+A' },
            { header: '', description: 'Substract from Memory', shortcut: 'Ctrl+S' },
            { header: '', description: 'Remove Single Value', shortcut: 'Backspace' },
            ];
            $scope.location = 'interview';
        }

        //  Close dialog
        $scope.close = function () {
            $modalInstance.dismiss('Canceled');
        };


        //this function is used to print pdf 
        $scope.printPdf = function () {
            var temp = [];
            var body = [];
            //prepare list as require for pdf 
            _.forEach(printData, function (obj, key) {
                var keys = _.keys(obj);//get all selected keys
                var temp = [];//make temp empty 
                _.forEach(keys, function (key) {
                    if (key == 'header' && obj[key] != '') {
                        temp.push({ text: obj[key], style: 'tableHeader' });
                    } else if ((key == 'description' || key == "shortcut") && obj[key] == '') {
                        temp.push({ text: obj[key], style: "tableHeader" });
                    } else {
                        temp.push(obj[key]);
                    }
                });
                body.push(temp);
            });

            var content = [];//to hold enitire content of pdf
            content.push({ table: { widths: [100, 250, 150], body: body }, layout: 'lightHorizontalLines' });
            // this object hold css content to design table alignment and  table content. 
            var docDefinition = {
                pageSize: 'A4',
                footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
                content: content,
                pageMargins: [30, 40, 20, 40],
                styles: {
                    tableHeader: {
                        bold: true,
                        fontSize: 12,
                        color: 'black',
                        fillColor: '#eaeaea'
                    }
                },
                defaultStyle: {
                    fontSize: 12,
                }
            };

            var iOS = ($window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
            if (iOS == true)
                pdfMake.createPdf(docDefinition).open();
            else
                pdfMake.createPdf(docDefinition).download("KeyBoardShortcutList" + ".pdf");
        };
    }]);

/**
 *  Controller for show Calculator
 */
returnApp.controller('calculatorDialogController', ['$scope', '$modalInstance', 'browserService', '$injector', function ($scope, $modalInstance, browserService, $injector) {

    //Close dialog
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };

    //destroy
    $scope.$on('$destroy', function (event) {
        //This will help us to reset object of focusable field
        var _returnService = $injector.get('returnService');
        _returnService.storeObjectOfFocusedField(undefined);
        _returnService = null;
    })

}]);

/**
 *  Controller for show conformation while deleting form or close return
 */
returnApp.controller('confirmationDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {

    //store data passes by dialog to set dialog title and text
    $scope.data = data;

    //bing checkbox for confirmation
    $scope.doNotAsk = false;
    //this flag will help us to focus on button
    $scope.focusMe = true;

    //close dilaog
    $scope.close = function (buttonType) {
        //return data when you close dialog
        $modalInstance.close({ doNotAsk: $scope.doNotAsk, buttonType: buttonType });
    };

}]);

/**
 *  Controller for show printPacketsConfiguration in a dialog
 */
returnApp.controller('printPacketsConfigurationDialogController', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    //subscription of close dialog
    var _dialogCloseSubscription = postal.subscribe({
        channel: 'MTPO-Return',
        topic: 'PrintPacketDialogClose',
        callback: function (data, envelope) {
            $scope.close(data);
        }
    });
    //close dialog
    $scope.close = function (data) {
        $modalInstance.close(data);
        $modalInstance.dismiss('Canceled');
    };

    //destroy
    $scope.$on('$destroy', function (event) {
        _dialogCloseSubscription.unsubscribe();
    })

}]);


/**
 **  Controller for open print print packet forms dialog
 */
returnApp.controller('printPacketsDialogController', ['$scope', '$modalInstance', 'data', 'dialogService', '$filter', 'printPacketsConfigurationService', '$q', 'userService', '$log', 'environment', 'resellerService', 'signatureService', 'systemConfig',
    function ($scope, $modalInstance, data, dialogService, $filter, printPacketsConfigurationService, $q, userService, $log, environment, resellerService, signatureService, systemConfig) {
        //get pass data from dialog
        $scope.forms = angular.copy(data.forms);
        //This Variable is used to hold form categories
        $scope.categories = [{ displayText: "Client Documents", value: "ClientDocuments", isOpen: true },
        { displayText: "Federal Forms", value: "FederalForms", isOpen: true },
        { displayText: "Federal Statements", value: "FederalStatements", isOpen: true },
        { displayText: "Federal Worksheets", value: "FederalWorksheets", isOpen: true },
        { displayText: "State Forms", value: "StateForms", isOpen: true },
        { displayText: "State Statements", value: "StateStatements", isOpen: true },
        { displayText: "State Worksheets", value: "StateWorksheets", isOpen: true }
        ];

        //Array will hold list of print packet
        $scope.printPacket = [{ displayText: 'Filing Copy', value: 'filing' },
        { displayText: 'Client Copy', value: 'client' },
        { displayText: 'Preparer Copy', value: 'preparer' },
        { displayText: 'Custom Copy', value: 'custom' }
        ];

        //This will hold current selectedPacket
        $scope.selectedPacket = $scope.printPacket[0];
        //hold password Details
        $scope.passwordDetails = {};
        //flag for mask sensitive information
        $scope.maskSensitiveInfo = false;
        //to store flag for add signature
        $scope.isAddSignature = {};
        $scope.isAddSignature.isChecked = false;

        //Temporary function to differentiate features as per environment (beta/live)
        $scope.betaOnly = function () {
            if (environment.mode == 'beta' || environment.mode == 'local')
                return true;
            else
                return false;
        };

        //Check for privileges
        $scope.userCan = function (privilege) {
            return userService.can(privilege);
        };

        $scope.hasFeature = function (featureName) {
            return resellerService.hasFeature(featureName);
        };

        //check for License
        $scope.hasLicense = function (licenseName) {
            return userService.getLicenseValue(licenseName);
        };

        //This function will intilize data
        var _init = function () {
            //call function for analising password data
            analysisPasswordOption();
            //this function will merge api data with form data
            _mergeApiDataWithFormList();

            if ($scope.hasLicense('enableSignaturePad') && $scope.hasFeature('SIGNATURE') && $scope.userCan('CAN_OPEN_SIGNATURE') && (data.preparerId != undefined || data.returnID != undefined)) {
                //call method for get signature data
                _getSignatureData(data.returnID, data.preparerId);
                $scope.isAddSignature.isChecked = true; // make this flag as true only if user have rights of signature views 
            }
        }


        $scope.signatureTypeLookup = angular.copy(systemConfig.getsignatureTypeLookup());

        var _getSignatureData = function (returnID, preparerId) {
            var getSignatureObj = { "returnId": returnID, "preparerId": preparerId };
            signatureService.signatureViewAll(getSignatureObj, true).then(function (signaturesData) {
                $scope.signatureDataListLength = 0; // default data length is 0
                $scope.signatureDataList = signaturesData;

                if ($scope.signatureDataList != undefined)
                    $scope.signatureDataListLength = _.keys($scope.signatureDataList).length;
            }, function (error) {
            });
        };

        var analysisPasswordOption = function () {
            //get user details
            var _userDetails = userService.getUserDetails();
            //check if user preferences for pdf password is defined 
            if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences)
                && !_.isUndefined(_userDetails.settings.preferences) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace)
                && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace.passwordProtectedReturn)) {
                //check if isPasswordProtectedPDF true or not 
                if (_userDetails.settings.preferences.returnWorkspace.passwordProtectedReturn == true) {
                    //isCustomPassword is defined or not
                    if (!_.isUndefined(_userDetails.settings.preferences.returnWorkspace.passwordType)
                        && _userDetails.settings.preferences.returnWorkspace.passwordType == 'custom') {
                        //if user choose custom password for pdf
                        $scope.pdfPasswordOption = 'customPassword';
                        $scope.passwordDetails.isCustomPassword = true;
                    } else {
                        //if user choose default password for pdf
                        $scope.pdfPasswordOption = 'defaultPassword';
                    }
                } else {
                    //if pdf is not secure with password
                    $scope.pdfPasswordOption = 'noPassword';
                }
            } else {
                //When user ask for the first time for password
                $scope.pdfPasswordOption = 'selectedForPasswordProtectePdf';
            }
        }

        //This function is used to merge api data with form list
        var _mergeApiDataWithFormList = function (isResetPressed) {
            if ($scope.userCan('CAN_OPEN_PRINTSET')) {
                //get saved forms from api
                _getLastSavedFormsFromApi().then(function (response) {
                    //set waterMarkDetails
                    $scope.waterMarkDetails = response.waterMarkDetails;
                    //if user pressed reset button then assign old form data to forms
                    if (isResetPressed == true) {
                        $scope.forms = angular.copy(data.forms);
                    }
                    //Merge user changes
                    _.forEach(response.forms, function (form, id) {
                        //replace form property with print set property if available , otherwise form has default property
                        var objects = _.filter($scope.forms, function (object) { return object.extendedProperties.id == id });
                        _.forEach(objects, function (obj) {
                            obj.extendedProperties.whenToPrint = angular.copy(form.whenToPrint);
                            obj.extendedProperties.printOrder = angular.copy(form.printOrder);
                        });
                    });

                    //initialy we call print packets with default packets
                    $scope.changePrintPackets();
                },
                    function (error) {
                        $log.error(error);
                    });
            }
        }


        //This function is used to sort form by printOrder
        var _sortFormsbyPrintOrder = function () {
            $scope.forms = $filter('orderBy')($scope.forms, ('extendedProperties.printOrder.' + $scope.selectedPacket.value));
        }


        //This Function is Used to get saved data of printPacketConfiguration
        var _getLastSavedFormsFromApi = function () {
            var deferred = $q.defer();
            //call api to get print packets forms data
            printPacketsConfigurationService.openPrintPacketsConfiguration({ userId: userService.getUserDetails().key, rightModel: 2 }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };


        //This function will used to expand all accordian
        $scope.openAllItems = function () {
            $scope.categories.map(function (item) {
                item.isOpen = true;
            });
        };


        //This function is used to close all accordian
        $scope.closeAllItems = function () {
            $scope.categories.map(function (item) {
                item.isOpen = false;
            });
        };

        //This function is used to remove data of waterMarkText when we unselect the watermark checkbox
        $scope.removeWaterMarkData = function () {
            if ($scope.waterMarkDetails[$scope.selectedPacket.value].isChecked == false) {
                $scope.waterMarkDetails[$scope.selectedPacket.value].value = undefined;
            }
        }

        //This Function will convert whenToPrint default property to always
        $scope.changePrintPackets = function () {
            //sort form by printOrder
            _sortFormsbyPrintOrder();
            //if selected packet is client then assign text 'Client Copy' as a waterMarkText
            if (angular.isUndefined($scope.waterMarkDetails) || _.isEmpty($scope.waterMarkDetails)) {
                $scope.waterMarkDetails = { 'client': { isChecked: true, value: "Client Copy" } };
            }
            //check mask sensitive checkbox if selected packet is not filing
            if ($scope.selectedPacket.value == 'filing' || $scope.selectedPacket.value == 'custom') {
                $scope.maskSensitiveInfo = false;
            } else {
                $scope.maskSensitiveInfo = true;
            }
            //uncheck check all checkbox when change packet
            $scope.checkAll = false;
            _.forEach($scope.forms, function (form) {
                //check is whenToPrint is defined
                if (angular.isDefined(form.extendedProperties.whenToPrint)) {
                    //convert default to always if whenToPrint is defalut and form status is active or required
                    if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Default' &&
                        (form.extendedProperties.formStatus.toLowerCase() == 'active'
                            || form.extendedProperties.formStatus.toLowerCase() == 'required')) {
                        //if selected packet has default value as well it is also active or required formStatus then
                        //convert default to always
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Always';
                    } else if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Default') {//convert default to always if whenToPrint is defalut and form status is Inactive 
                        //if selected packet is default then assign never value to selected packet
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Never';
                    }
                }
            });
        }


        //This function is used to check/uncheck all form
        $scope.checkAllForm = function (checkedValue) {
            _.forEach($scope.forms, function (form) {
                //check is when to print Property is defined
                if (angular.isDefined(form.extendedProperties.whenToPrint)) {
                    if (checkedValue == true) {
                        //checkedValue is true , then assign 'always' value to all form 
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Always';
                    } else {
                        //checkedValue is false , then assign 'never' value to all form 
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Never';
                    }
                }
            });
        }


        //This function is used when user want to print forms 
        $scope.print = function (buttonType) {
            //This Array hold forms for printing 
            var formListToPrint = [];
            //hold password details
            var _passwordData;
            switch ($scope.pdfPasswordOption) {
                case 'customPassword'://pdf is secured with custom password
                    if ($scope.passwordDetails.customPassword == undefined || $scope.passwordDetails.customPassword == '') {
                        _passwordData = { isPasswordProtectedPDF: false, customPassword: '' };
                    } else {
                        _passwordData = { isPasswordProtectedPDF: true, customPassword: $scope.passwordDetails.customPassword };
                    }
                    break;

                case 'defaultPassword': //pdf is secured with default password
                    _passwordData = { isPasswordProtectedPDF: true };
                    break;

                case 'noPassword':// pdf is not secured with password
                    _passwordData = { isPasswordProtectedPDF: false };
                    break;

                case 'selectedForPasswordProtectePdf'://when user preference for password is undefined
                    _passwordData = $scope.passwordDetails;
                    _passwordData.saveToUserPreferences = true;
                    break;
            }

            //get categories wise form
            _.forEach($scope.categories, function (category) {
                var formList = $filter('printPacketCategoryDialogFilter')($scope.forms, category.value);
                _.forEach(formList, function (form) {
                    //if whenToPrint is 'always' for selected Packet form then push object into array  for printing
                    if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Always' && form.extendedProperties.isHiddenForm != true) {
                        formListToPrint.push(form);
                    }
                });
            });

            if ($scope.selectedPacket.value == "filing" || angular.isUndefined($scope.waterMarkDetails) || angular.isUndefined($scope.waterMarkDetails[$scope.selectedPacket.value])) {
                $scope.waterMarkDetails = ''
            } else {
                $scope.waterMarkDetails = $scope.waterMarkDetails[$scope.selectedPacket.value].value;
            }

            //return array for printing
            $modalInstance.close({ "formList": formListToPrint, "passwordDetails": _passwordData, 'waterMarkDetails': $scope.waterMarkDetails, "maskSensitiveInfo": $scope.maskSensitiveInfo, 'isAddSignature': $scope.isAddSignature.isChecked, "selectedPacket": $scope.selectedPacket.value });
        };


        //close dialog
        $scope.close = function () {
            $modalInstance.dismiss('Canceled');
        };


        //This function is used to open print packet configuration dialog
        $scope.openPrintPacketsConfigurationDialog = function () {
            if ($scope.userCan('CAN_OPEN_PRINTSET')) {
                //open dialog
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
                    "taxAppJs/return/workspace/partials/dialog/printPacketsConfigurationDialog.html", "printPacketsConfigurationDialogController");
                dialog.result.then(function (dialogResponse) {
                    var isResetPressed = false;

                    if (dialogResponse != undefined && dialogResponse.isResetPressed != undefined) {
                        isResetPressed = dialogResponse.isResetPressed;
                    }

                    //merge property of printPackets saved by user
                    _mergeApiDataWithFormList(isResetPressed);
                }, function () {
                });
            }
        }

        //just call init first time
        _init();

    }]);


/*
*  print preview  
*/
returnApp.controller('printPreviewDialogController', ['_', '$scope', '$modalInstance', 'returnService', '$filter', 'contentService', '$q', 'userService', 'printPacketsConfigurationService', 'data', 'resellerService', 'signatureService', '$log', 'systemConfig', '$window', '$compile',
    function (_, $scope, $modalInstance, returnService, $filter, contentService, $q, userService, printPacketsConfigurationService, data, resellerService, signatureService, $log, systemConfig, $window, $compile) {

        // filter information (meta information , svg ,docName, ect) store base on user select forms
        var PrintInfo = [];
        // hold svg and data of pdf as div
        var formSvg;
        // main div of fileds
        var fields_containers;
        // default page display 
        var defaultPage = 40;
        // maintain current display startPage
        var startPage = 0;
        // maintain current display endPage
        var endPage = defaultPage;
        // current display pages count
        var currentPages = 0;
        // id for solve issue of conflict style
        var uniqueId = 0;
        // add number of page at run time
        var numberOfPageAdd = 5;
        // last scroll direction store like up and down
        var lastScrollDir = ''
        // store all information of svg and metaInfo
        var staticPrevInfo = [];
        // length of total html of display svg
        var totalLengthOfSvg = 2046791;
        // get whole Return value from return service
        var _taxReturn = JSON.parse(JSON.stringify(returnService.getTaxReturn()));
        // which page currently user see handle using this var
        var visibleTop = 0;

        var maskSensitiveInfoArray = ['ETIN', 'EFIN', 'ROUNTINGNO', 'ACCOUNTNO', 'PID', 'EIN', 'SSN', 'PTIN'];
        //flag for mask sensitive information
        $scope.maskSensitiveInfo = false;

        //hold value, display text as water mark
        var waterMark_Text;

        // over Flow Detail save in this array
        var overflowStmt = [];
        var StmtDocName = {};
        //get pass data from dialog
        $scope.forms = angular.copy(_taxReturn.forms);
        //hold password Details
        $scope.passwordDetails = {};

        var scrollEnable = true;

        // Get client Information
        var clientPackageName = returnService.getPackageName();
        // pages information like total page and current Page
        $scope.pages = { currentPage: 0, totalPage: 0, currentPageId: 0, startId: 0, endId: 0, rotateVal: 0, zoom: 100 }

        // loader show and hide base on this value
        $scope.enableLoading = true;
        $scope.top_loder = false;
        $scope.bottom_loder = false;
        $scope.noText = false;

        //to store flag for add signature
        $scope.isAddSignature = {};
        $scope.isAddSignature.isChecked = false;

        // store priceListDetail store in var
        $scope.priceListDetail = {};
        //Array will hold list of print packet
        $scope.printPacket = [{ displayText: 'Filing Copy', value: 'filing' },
        { displayText: 'Client Copy', value: 'client' },
        { displayText: 'Preparer Copy', value: 'preparer' },
        { displayText: 'Custom Copy', value: 'custom' }
        ];

        //This Variable is used to hold form categories
        $scope.categories = [{ displayText: "Client Documents", value: "ClientDocuments", isOpen: true },
        { displayText: "Federal Forms", value: "FederalForms", isOpen: true },
        { displayText: "Federal Statements", value: "FederalStatements", isOpen: true },
        { displayText: "Federal Worksheets", value: "FederalWorksheets", isOpen: true },
        { displayText: "State Forms", value: "StateForms", isOpen: true },
        { displayText: "State Statements", value: "StateStatements", isOpen: true },
        { displayText: "State Worksheets", value: "StateWorksheets", isOpen: true }
        ];

        // current display form array
        $scope.previewForms = []

        // store platform
        $scope.platform = $window.navigator.platform

        //This will hold current selectedPacket
        $scope.selectedPacket = $scope.printPacket[0];

        $scope.isSendDisabled = true;

        var isSummerizePriceList = false;

        // CLIENT PORTAL SIGNATURE FLOW START
        $scope.signatureData = data;

        // this form are not supported for print Perview
        $scope.previewNotSupported = data.previewNotSupported

        $scope.question = {
            type: data.type,
            answerType: [
                { "id": "Yes/No", "displayText": "Yes/No" },
                { "id": "Free Text", "displayText": "Free Text" }
                // { "id": "Document", "displayText": "Document" }
            ],
            answer: {}
        };
        $scope.showAnswerYesOrNo = [{ "id": "Yes", "displayText": "Yes is selected" }, { "id": "No", "displayText": "No is selected" }, { "displayText": "Both" }];

        // to show manadatory fields
        $scope.showIsRequired = function (answerType) {
            var count = 0;
            for (var i = 0; i < answerType.length; i++) {
                if (answerType[i].isSelected == true) {
                    count++;
                }
                if (answerType[i].id === 'Yes/No' && answerType[i].isSelected === true) {
                    answerType[i].isRequired = true;
                } else if (answerType[i].id === 'Yes/No' && answerType[i].isSelected === false) {
                    answerType[i].isRequired = false;
                }
                if (answerType[i].id === 'Free Text' && answerType[i].isSelected === false) {
                    answerType[i].isRequired = false;
                }
                if (answerType[i].id === 'Document' && answerType[i].isSelected === false) {
                    answerType[i].isRequired = false;
                }
            }
            return count > 1;
        }

        // to show freetext dropdown
        $scope.showFreeText = function (answerType) {
            var showCheck = false;
            var yesNo = answerType.find(function (obj) { return obj.id == "Yes/No" });
            if (yesNo && yesNo.isSelected == true) {
                var doc = answerType.find(function (obj) { return obj.id == "Free Text" });
                if (!_.isUndefined(doc) && doc.isSelected == true && doc.isRequired == true) {
                    showCheck = true;
                }
            } else {
                showCheck = false;
            }
            return showCheck;
        }

        // to show document dropdown
        $scope.showDocument = function (answerType) {
            var showCheck = false;
            var yesNo = answerType.find(function (obj) { return obj.id == "Yes/No" });
            if (yesNo && yesNo.isSelected == true) {
                var doc = answerType.find(function (obj) { return obj.id == "Document" });
                if (!_.isUndefined(doc) && doc.isSelected == true && doc.isRequired == true) {
                    showCheck = true;
                }
            } else {
                showCheck = false;
            }
            return showCheck;
        }

        // to disable save until atleast one answer is selected
        $scope.isSaveDisabled = function () {
            var isAnySelected = false;
            for (var index in $scope.question.answerType) {
                if ($scope.question.answerType[index].isSelected) {
                    isAnySelected = true;
                }
            }
            if (!isAnySelected) {
                return isAnySelected;
            }
            return isAnySelected;
        }

        $scope.sendForSignatureOrReview = function () {
            var reqData = returnService.getTaxReturnSSNAndEmail();
            var fillingStatus = returnService.getElementValue('filstts', 'dMainInfo');
            reqData.questions = JSON.parse(JSON.stringify($scope.question));
            reqData.returnDetails = returnService.getTaxReturnDetails();

            reqData.isSpouseSignatureNeeded = fillingStatus == 2 ? true : false;
            if (reqData.returnDetails !== undefined) {
                if (reqData.isSpouseSignatureNeeded == true) {
                    if (reqData.returnDetails.spouse == undefined) {
                        reqData.returnDetails.spouse = {}
                    }
                    var sponseSSN = returnService.getElementValue('strspssn', 'dMainInfo');
                    var sponseEmail = returnService.getElementValue('strspeml', 'dMainInfo');
                    reqData.returnDetails.spouse.ssn = sponseSSN;
                    reqData.returnDetails.spouse.email = sponseEmail;
                } else {
                    delete reqData.returnDetails.spouse;
                }

            }
            if (reqData.questions.type === 'REQ_SIGN') {
                reqData.type = 'REQ_SIGN'
            } else if (reqData.questions.type === 'REVIEW_SIGN') {
                reqData.type = 'REVIEW_SIGN'
            }
            $scope.print(reqData);
        }

        //close dialog
        $scope.close = function () {
            _unbindEvent();
            $modalInstance.dismiss('Canceled');
        };

        //This function is used when user want to print forms 
        $scope.print = function (reqData) {
            //This Array hold forms for printing 
            var formListToPrint = [];
            //hold password details
            var _passwordData;
            switch ($scope.pdfPasswordOption) {
                case 'customPassword'://pdf is secured with custom password
                    if ($scope.passwordDetails.customPassword == undefined || $scope.passwordDetails.customPassword == '') {
                        _passwordData = { isPasswordProtectedPDF: false, customPassword: '' };
                    } else {
                        _passwordData = { isPasswordProtectedPDF: true, customPassword: $scope.passwordDetails.customPassword };
                    }
                    break;

                case 'defaultPassword': //pdf is secured with default password
                    _passwordData = { isPasswordProtectedPDF: true };
                    break;

                case 'noPassword':// pdf is not secured with password
                    _passwordData = { isPasswordProtectedPDF: false };
                    break;

                case 'selectedForPasswordProtectePdf'://when user preference for password is undefined
                    _passwordData = $scope.passwordDetails;
                    _passwordData.saveToUserPreferences = true;
                    break;
            }

            //get categories wise form
            _.forEach($scope.categories, function (category) {
                var formList = $filter('printPacketCategoryDialogFilter')($scope.forms, category.value);
                _.forEach(formList, function (form) {
                    //if whenToPrint is 'always' for selected Packet form then push object into array  for printing
                    if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Always' && form.extendedProperties.isHiddenForm != true) {
                        formListToPrint.push(form);
                    }
                });
            });

            if ($scope.selectedPacket.value == "filing" || angular.isUndefined($scope.waterMarkDetails) || angular.isUndefined($scope.waterMarkDetails[$scope.selectedPacket.value])) {
                $scope.waterMarkDetails = ''
            } else {
                $scope.waterMarkDetails = $scope.waterMarkDetails[$scope.selectedPacket.value].value;
            }
            _unbindEvent();
            //return array for printing
            $modalInstance.close({ "formList": formListToPrint, "passwordDetails": _passwordData, 'waterMarkDetails': $scope.waterMarkDetails, "maskSensitiveInfo": $scope.maskSensitiveInfo, 'isAddSignature': $scope.isAddSignature.isChecked, "selectedPacket": $scope.selectedPacket.value, 'reqData': reqData });
        };

        // functions to rotate all svgs
        $scope.rotate = function () {
            $scope.pages.rotateVal += 90;
            if ($scope.pages.rotateVal == 360) {
                $scope.pages.rotateVal = 0;
            }
            var childNodes = document.getElementById('displayed-svg').childNodes;
            for (var i = 0; i < childNodes.length; i++) {
                childNodes[i].style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
            }
        }
        // function to zoom in the displayed svg.
        $scope.zoomIn = function () {
            if ($scope.pages.zoom < 200) {
                $scope.pages.zoom += 10;
                document.getElementById('displayed-svg').style.zoom = $scope.pages.zoom + '%';
                document.getElementById('zoom_handler').style.zoom = $scope.pages.zoom + '%';
                visibleTop = document.getElementById('zoom_handler').getBoundingClientRect().top - 10;
            }
        }

        // function to zoomout the displayed svg.
        $scope.zoomOut = function () {
            if ($scope.pages.zoom > 60) {
                $scope.pages.zoom -= 10;
                document.getElementById('displayed-svg').style.zoom = $scope.pages.zoom + '%';
                document.getElementById('zoom_handler').style.zoom = $scope.pages.zoom + '%';
                visibleTop = document.getElementById('zoom_handler').getBoundingClientRect().top + 10;
            }
        }

        // function to fit to page
        $scope.fitToPage = function () {
            $scope.pages.zoom = 100;
            document.getElementById('displayed-svg').style.zoom = 0 + '%';
            document.getElementById('zoom_handler').style.zoom = 0 + '%';
            visibleTop = document.getElementById('zoom_handler').getBoundingClientRect().top;
        }

        // change watermark Information 
        $scope.watermarkChange = function () {
            var watermarkDivs = document.getElementsByClassName('watermark');
            //getWaterMark
            waterMark_Text = getWaterMark();
            //if it is undefined then assign client water mark text 
            if ((waterMark_Text == undefined || waterMark_Text == '') && $scope.waterMarkDetails && $scope.waterMarkDetails[$scope.selectedPacket.value] !== undefined) {
                waterMark_Text = $scope.waterMarkDetails[$scope.selectedPacket.value].value;
            }

            if ($scope.waterMarkDetails[$scope.selectedPacket.value] && $scope.waterMarkDetails[$scope.selectedPacket.value].isChecked === true
                && waterMark_Text !== undefined && waterMark_Text !== '') {
                for (var i = 0; i < watermarkDivs.length; i++) {
                    watermarkDivs[i].innerHTML = '<span class="waterMark_text">' + waterMark_Text + '</span>'
                }
            } else {
                for (var i = 0; i < watermarkDivs.length; i++) {
                    watermarkDivs[i].innerHTML = ''
                }
            }
        }

        //This function is used to remove data of waterMarkText when we unselect the watermark checkbox
        $scope.removeWaterMarkData = function () {
            if ($scope.waterMarkDetails[$scope.selectedPacket.value].isChecked == false) {
                $scope.waterMarkDetails[$scope.selectedPacket.value].value = undefined;
            }
            $scope.watermarkChange();
        }

        //Check for user is Demo user
        // demo user set watermark
        var getWaterMark = function () {
            var waterMarkText = '';
            //demo user or free license
            if ((userService.getValue('isDemoUser') == true || userService.getLicenseValue('type') == 'FREE')
                || ((clientPackageName == "1040" || clientPackageName == "1041" || clientPackageName == "990") && userService.getLicenseValue('individual') != true)
                || ((clientPackageName == "1065" || clientPackageName == "1120" || clientPackageName == "1120s") && userService.getLicenseValue('business') != true)) {
                //
                waterMarkText = 'Free Trial - Do Not File';
            }

            return waterMarkText;
        };

        var _unbindEvent = function () {
            var print_preview_container = document.getElementById('print_preview_container')
            angular.element(print_preview_container).unbind('DOMMouseScroll mouseup scroll')

        }

        //This function is used to sort form by printOrder
        var _sortFormsbyPrintOrder = function () {
            $scope.forms = $filter('orderBy')($scope.forms, ('extendedProperties.printOrder.' + $scope.selectedPacket.value));
        }

        // get value from _taxReturn object
        var _getElementValue = function (elementName, formInstance, defaultValue) {
            var returnVal
            var docName = elementName.split('.')[0];
            var elementName = elementName.split('.')[1];
            if (defaultValue == undefined) {
                defaultValue = ''
            }
            if (formInstance) {
                returnVal = _taxReturn.docs[docName] ? _taxReturn.docs[docName][formInstance] ?
                    _taxReturn.docs[docName][formInstance][elementName] ? _taxReturn.docs[docName][formInstance][elementName].value : defaultValue : defaultValue : defaultValue;
            } else {
                if (_taxReturn.docs[docName]) {
                    formInstance = Object.keys(_taxReturn.docs[docName])[0];
                    returnVal = _taxReturn.docs[docName][formInstance][elementName] ? _taxReturn.docs[docName][formInstance][elementName].value : defaultValue
                }
            }
            if (returnVal == 0 && defaultValue == '0.00') {
                returnVal = '0.00'
            }
            return returnVal
        }
        var _getElement = function (elementName, formInstance) {
            var docName = elementName.split('.')[0];
            var elementName = elementName.split('.')[1];
            if (formInstance) {
                return _taxReturn.docs[docName] ? _taxReturn.docs[docName][formInstance] ?
                    _taxReturn.docs[docName][formInstance][elementName] : '' : '';
            } else {
                if (_taxReturn.docs[docName]) {
                    formInstance = Object.keys(_taxReturn.docs[docName])[0];
                    return _taxReturn.docs[docName][formInstance][elementName] ? _taxReturn.docs[docName][formInstance][elementName] : ''
                }
            }
            return
        }

        // return instance of give form name
        var _getFormInstances = function (formName) {
            return _taxReturn && _taxReturn.docs && _taxReturn.docs[formName] ? Object.keys(_taxReturn.docs[formName]) : '';
        }

        // return child instance of given form name and form instance
        var _getChildInstFromParentInst = function (formName, parentFormInst) {
            var docSelected = _taxReturn && _taxReturn.docs && _taxReturn.docs[formName] ? _taxReturn.docs[formName] : '';
            var inst = []
            if (docSelected) {
                for (var childInst in docSelected) {
                    if (docSelected[childInst].parent == parentFormInst) {
                        inst.push(childInst);
                    }
                }
            }
            return inst;
        }
        var getChildDoc = function (childDocName, parentId) {
            var childDoc = {}
            if (_taxReturn && _taxReturn.docs && _taxReturn.docs[childDocName]) {
                for (var index in _taxReturn.docs[childDocName]) {
                    var docObj = _taxReturn.docs[childDocName][index];
                    if (docObj.parent == parentId) {
                        childDoc[index] = docObj
                    }
                }
            }
            return childDoc;
        }

        // formate value base on requrments
        var _formatValue = function (element, fieldType) {
            var value = element.elementValue;
            if (fieldType && fieldType.toLowerCase() == 'money') {
                value = value.toString().replace(/,/g, '')
                var splitval = value.split('.');
                var fractional = parseInt(splitval[0]);
                if (fractional) {
                    fractional = fractional.toLocaleString();
                }
                if (splitval[1]) {
                    value = fractional + '.' + splitval[1];
                } else {
                    value = fractional;
                }
            }
            if (fieldType && $scope.maskSensitiveInfo == true && value !== undefined) {
                switch (fieldType.toUpperCase()) {
                    case 'ETIN':
                    case 'EFIN':
                    case 'ROUNTINGNO': {
                        if (/^[0-9]*$/.test(value) == false) {
                            break;
                        }
                    }
                    case 'ACCOUNTNO': {
                        if (/^[0-9]*$/.test(value) == false) {
                            break;
                        }
                    }
                    case 'PID': {
                        value = value.replace(/./g, "X");
                        break;
                    }
                    case 'EIN': {
                        if (/^[0-9]{2}\-[0-9]{7}$/.test(value) == true) {
                            value = value.substring(0, value.length - 4).replace(/[0-9]/g, "X") + value.substring(value.length - 4)
                        }
                        break;
                    }
                    case 'SSN': {
                        if (/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/.test(value) == true) {
                            value = value.substring(0, value.length - 4).replace(/[0-9]/g, "X") + value.substring(value.length - 4)
                        }
                        break;
                    }
                    case 'PTIN': {
                        value = value.replace(/[0-9]/g, "X");
                        break;
                    }
                }
            }
            return value;
        }

        // format value for Ny state
        var _formatValueForNYState = function (value) {
            try {
                if (!isNaN(value)) {
                    var decimalValue = value.split('.')
                    return decimalValue[0]
                }
            } catch (e) {
                return value
            }
            return value
        }

        // value change as per display requiredments
        var _setTextboxValue = function (value, element, stateName) {
            if (element.objectType == 'checkbox') {
                if (value !== undefined && value !== null && value !== '' && element.value !== undefined && element.value !== '') {
                    var value_array = element.value.split(',');
                    for (var i = 0; i < value_array.length; i++) {
                        if (value.toString().toLowerCase() == value_array[i].toString().toLowerCase()) {
                            element.isMatch = true;
                        }
                    }
                } else if (value !== undefined && value !== undefined && value !== '' && element.onValueCB !== undefined && element.onValueCB !== '') {
                    if (value.toString().toLowerCase() == element.onValueCB.toString().toLowerCase()) {
                        element.isMatch = true;
                    }
                    else if (value !== undefined && element.printvalue !== undefined && element.printvalue !== ''
                        && (value === 'X' || value === true || value === false || value === 'true' || value === 'false')) {
                        element.isMatch = true;
                    }
                }

            } else if (element.multipleField && element.multipleField.includes(',')) {
                var fieldsArray = element.multipleField.split(',');
                for (var i = 0; i < fieldsArray.length; i++) {
                    var token = fieldsArray[i];
                    var temp = ''
                    if (token.includes('=') && !token.endsWith('=')) {
                        temp = token.subscribe(token.indexOf('=') + 1);
                    } else if (token.includes('=') && token.endsWith('=')) {
                        temp = ''
                    } else {
                        if (token.includes('.')) {
                            temp = _getElementValue(token);
                        } else {
                            var docName = element.docName;
                            token = docName + '.' + token;
                            temp = _getElementValue(token, element.formsinstant);
                        }
                    }

                    if (temp !== undefined && temp.toString().trim() != '' && temp.toString().trim() != '0' && temp.toString().trim() != '0.0') {
                        temp = temp.toString();
                        if (stateName && stateName.toLowerCase() == 'ny') {
                            temp = _formatValueForNYState(temp);
                        }
                        if (element.charToRemove !== undefined && element.charToRemove.trim() !== '') {
                            var removeArray = element.charToRemove.split('|');
                            for (var i0 = 0; i0 < removeArray.length; i0++) {
                                temp = temp.replace(removeArray[i0], '');
                            }
                        }

                        if (element.charToReplace !== undefined && element.charToReplace.trim() !== '') {
                            var charToReplace = element.charToReplace.split('#');
                            for (var i1 = 0; i1 < charToReplace.length; i1++) {
                                var replaceArray = charToReplace[i1].split('|');
                                temp = temp.replace(replaceArray[0], replaceArray[1]);
                            }
                        }
                        element.elementValue = temp;
                        break;
                    }

                }

            } else if (element.concat && element.concat.includes(',')) {
                var concatWith = ', '
                var concat = element.concat;
                var temp = '';
                if (element.concatWith && element.concatWith.includes('#')) {
                    concatWith = element.concatWith.substr(0, element.concatWith.indexOf('#'))
                }
                if (concat.includes('|')) {
                    if (concat.substr(concat.indexOf('|')).includes('false')) {
                        concatWith = ' '
                    }
                    concat = concat.substr(0, concat.indexOf('|'));
                }
                var elementsArray = concat.split(',');
                for (var i = 0; i < elementsArray.length; i++) {
                    var token = elementsArray[i]
                    if (temp !== undefined && temp !== '') {
                        if (token.includes('.')) {
                            var value = _getElementValue(token);
                            (value !== undefined && value !== '') ? temp += ' ' + concatWith + ' ' + value : ''

                        } else {
                            var docName = element.docName;
                            token = docName + '.' + token;
                            var value = _getElementValue(token, element.formsinstant);
                            (value !== undefined && value !== '') ? temp += ' ' + concatWith + ' ' + value : ''
                        }
                    } else {
                        if (token.includes('.')) {
                            temp = _getElementValue(token);
                        } else {
                            var docName = element.docName;
                            token = docName + '.' + token;
                            temp = _getElementValue(token, element.formsinstant);
                        }
                    }
                }
                while (temp && temp.indexOf(',,') > -1) {
                    temp = temp.replace(',,', ',')
                }
                if (temp && temp.endsWith(',')) {
                    temp = temp.substr(0, temp.length - 1)
                }
                if (temp && temp.endsWith(', ')) {
                    temp = temp.substr(0, temp.length - 2)
                }
                if (stateName && stateName.toLowerCase() == 'ny') {
                    temp = _formatValueForNYState(temp);
                }
                element.elementValue = temp ? temp : '';
            } else if (element.formatDate !== undefined && element.formatDate !== '') {
                if (value !== undefined && value !== '') {
                    element.elementValue = moment(value, 'MM/DD/YYYY').format(element.formatDate.toUpperCase());
                }
            } else if (element.myDecimal !== undefined && element.myDecimal !== '' && value !== undefined) {
                var removeDot = false;
                var myDecimal = element.myDecimal;
                if (myDecimal.endsWith('|false')) {
                    myDecimal = myDecimal.replace('|false', '').trim()
                    removeDot = true;
                } else {
                    myDecimal = myDecimal.replace('|true', '').trim()
                }
                var dblVal = 0.0;
                var pre = 0;
                if (value.toString().includes(",")) {
                    value = value.replace(/,/g, "");
                }
                dblVal = parseFloat(value);
                pre = parseInt(myDecimal);
                var dblStr = dblVal.toString();
                var valArray = dblStr.split('.');
                if (valArray[1] !== undefined) {
                    pre = pre - valArray[1].length;
                } else {
                    valArray[1] = '';
                }

                for (var pk = 0; pk < pre; pk++) {
                    valArray[1] += 0;
                }
                value = valArray[0] + '.' + valArray[1];
                if (element.charToRemove !== undefined && element.charToRemove.includes('.')) {
                    value = valArray[0] + valArray[1];
                }
                if (removeDot) {
                    value = value.replace('.', '');
                }
                element.elementValue = value;
            } else if (element.charFrom !== undefined && element.charFrom !== '' && value !== undefined) {
                if (element.charToRemove !== undefined && element.charToRemove !== '') {
                    if (typeof value === 'string') {
                        var finalValue = ''
                        for (var i12 = 0; i12 < value.length; i12++) {
                            if (value[i12] !== element.charToRemove) {
                                finalValue += value[i12]
                            }
                        }
                        value = finalValue;
                    }
                    value = value.replace(/-/g, '')
                }
                if (element.charTo !== undefined && element.charTo !== '') {
                    element.elementValue = value.substring(parseInt(element.charFrom) - 1, parseInt(element.charTo));
                } else if (typeof value == 'string') {
                    element.elementValue = value.substring(parseInt(element.charFrom) - 1);
                }
            } else if (element.charToRemove !== undefined && element.charToRemove !== '' && value != undefined) {
                if (element.charFrom == undefined || element.charFrom == '') {
                    var repalcedValue = ''
                    for (var i20 = 0; i20 < value.length; i20++) {
                        if (value[i20] != element.charToRemove) {
                            repalcedValue = repalcedValue + value[i20];
                        }
                    }
                    element.elementValue = repalcedValue
                }
            } else if (element.objectType == 'input' && element.printvalue != undefined && element.printvalue != '' && value != undefined && element.value != undefined) {
                if (element.value.toString() == value.toString()) {
                    element.elementValue = element.printvalue;
                }
            } else {
                element.elementValue = value ? value : '';
            }

        }

        // call contentService for get type
        var _getFieldType = function (element) {
            if (element) {
                if (element.elementName.includes('.')) {
                    return contentService.getFieldType(element.elementName);
                } else {
                    return contentService.getFieldType(element.docName + '.' + element.elementName);
                }
            }
        }

        // add text in svg
        var _setValueOfInput = function (element) {
            if (element.combOf !== undefined && element.combOf !== '' && element.elementValue !== undefined && element.elementValue !== '') {
                var comboWidth = (parseFloat(element.width) / element.combOf);
                var x = parseFloat(element.x)
                var y = parseFloat(element.y);
                var combodiv = document.createElement('div');
                combodiv.style.left = x + 1 + 'px'
                combodiv.style.top = y + 2 + 'px';
                combodiv.style.width = element.width + 'px';
                combodiv.style.position = 'absolute';
                element.fieldType = _getFieldType(element);
                var value = _formatValue(element, element.fieldType)
                if (value !== undefined) {
                    if (element.combOf != value.length) {
                        value = value.toString().replace(/-/g, '');
                    }

                    for (var i = 0; i < parseFloat(element.combOf); i++) {
                        var j = 6;
                        if (i !== 0) {
                            j = comboWidth / 2
                        }
                        var y = parseFloat(element.y);
                        var newElement = document.createElement('div');
                        newElement.style.width = comboWidth + 'px';
                        newElement.style.float = 'left'
                        if (value[i] !== '-') {
                            newElement.innerHTML = value[i];
                        } else {
                            newElement.innerHTML = '&nbsp;'
                        }
                        newElement.style['font-size'] = "8.5pt";
                        newElement.style['color'] = "#000";
                        if (newElement.innerHTML != 'undefined' && newElement.innerHTML != undefined) {
                            combodiv.appendChild(newElement)
                        }
                        x = x + comboWidth;
                    }
                    if (element.fieldType && maskSensitiveInfoArray.indexOf(element.fieldType.toUpperCase()) > -1) {
                        combodiv.className += 'maskSensitiveInfo'
                    }
                    fields_containers.appendChild(combodiv)
                }
            } else if (element.elementValue !== undefined && element.elementValue !== '') {
                element.fieldType = _getFieldType(element);
                var value = _formatValue(element, element.fieldType)
                var newElement = document.createElement('div');
                newElement.style.position = 'absolute'
                newElement.style.top = parseFloat(element.y) + 2 + 'px'
                if (element.alignment == 'right') {
                    newElement.style.left = parseFloat(element.x) - 2 + 'px';
                    // newElement.style.width = parseFloat(element.width) - 2 + 'px';
                    newElement.style.height = element.height + 'px';
                    newElement.style['text-align'] = 'right';
                    // if(element.docName == 'd1120S') {
                    //     newElement.style.top = parseFloat(element.y) + 1 + 'px'
                    // }
                } else if (element.alignment == 'center') {
                    newElement.style.left = parseFloat(element.x) + 'px';

                    newElement.style['text-align'] = 'center';
                } else {
                    newElement.style['text-align'] = 'left';
                    newElement.style.left = parseFloat(element.x) + 4 + 'px'
                }
                if (element.fieldType && maskSensitiveInfoArray.indexOf(element.fieldType.toUpperCase()) > -1) {
                    newElement.className += 'maskSensitiveInfo'
                }

                newElement.style['font-size'] = "8.5pt";
                newElement.style['color'] = "#000";
                newElement.style.width = element.width + 'px';

                newElement.innerHTML = value;
                fields_containers.appendChild(newElement)
            }

        }

        // add checkBox in svg
        var _setValueOfCheckBox = function (element) {
            var newElement = document.createElement('i');
            newElement.className = 'cross_icon';
            newElement.innerHTML = 'x';
            newElement.style.position = 'absolute'
            newElement.style.height = element.height + 'px'
            newElement.style.width = element.width + 'px'
            if (element.height < 16) {
                newElement.style['line-height'] = '8px';
            }
            newElement.style.left = parseFloat(element.x) + 'px'
            newElement.style.top = parseFloat(element.y) + 'px'
            fields_containers.appendChild(newElement)
        }

        // signature image set to html
        var _addSignature = function (element) {
            var index = -1;
            for (var indexOf in $scope.signatureTypeLookup) {
                if ($scope.signatureTypeLookup[indexOf]['displayText'] && $scope.signatureTypeLookup[indexOf]['displayText'].toLowerCase() == element.signatureFor.toLowerCase()) {
                    index = indexOf
                    break;
                }
            }
            if (index > -1 && $scope.signatureDataList && $scope.signatureDataList[index] && $scope.isAddSignature.isChecked == true) {
                var imageHeight = element.height;
                // current max width of sign is 113 
                var imageWidth = 113
                if (imageHeight > 25) {

                    imageHeight = 25
                }
                var signDiv = document.createElement('div')
                signDiv.classList.add('signature_info')
                var signImg = document.createElement('img')
                signImg.src = $scope.signatureDataList[index].image;
                signImg.style.left = parseFloat(element.x) + 'px'
                signImg.style.top = element.y + 'px'
                signImg.style.width = imageWidth + 'px'
                signImg.style.height = imageHeight + 'px'
                signImg.style.position = 'absolute'

                signDiv.appendChild(signImg)
                fields_containers.appendChild(signDiv)
            }
        }
        // stmt add at end of pdf
        var _addOverflowStmt = function () {
            try {
                var div = document.createElement('div')
                div.id = 'print_preview_pdf_' + $scope.pages.endId;
                div.style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
                div.classList.add('overflow_containers')
                var isAnyDataInDiv = false;
                for (var i = 0; i < overflowStmt.length; i++) {
                    var stmtTitleDiv = document.createElement('div');
                    stmtTitleDiv.classList.add('stmt_TitleDiv')
                    stmtTitleDiv.innerHTML = overflowStmt[i].stmtTitle
                    var table = document.createElement('table');
                    table.border = '1'
                    table.style.width = '100%'
                    var stmtData = _taxReturn.docs[overflowStmt[i].stmtName];
                    if (overflowStmt[i].stmtHeaders !== undefined && overflowStmt[i].stmtElements !== undefined) {
                        var stmtHeaders = overflowStmt[i].stmtHeaders.split('|')
                        var stmtElements = overflowStmt[i].stmtElements.split('|')
                        // header add as per meta information
                        var tr = document.createElement('tr');
                        tr.style.background = '#c0c0c0';
                        for (var i2 = 0; i2 < stmtHeaders.length; i2++) {
                            var th = document.createElement('th');
                            th.innerHTML = stmtHeaders[i2];
                            tr.appendChild(th);
                        }
                        table.appendChild(tr);
                        var isappend = false;

                        // add data in table
                        for (var instace in stmtData) {
                            var instaceData = stmtData[instace];
                            var tr = document.createElement('tr');
                            var isAddTd = false;
                            for (var i2 = 0; i2 < stmtElements.length; i2++) {
                                var td = document.createElement('td');
                                if (stmtElements[i2] && stmtElements[i2].includes('.')) {
                                    var eleName = stmtElements[i2].split('.');
                                    var eleFromAlign = eleName[1].split('?')
                                    if (instaceData[eleFromAlign[0]] !== undefined && instaceData[eleFromAlign[0]].value !== undefined &&
                                        instaceData[eleFromAlign[0]].value != '') {
                                        if (instaceData[eleFromAlign[0]].value === true) {
                                            td.innerHTML = 'YES';
                                        } else {
                                            td.innerHTML = instaceData[eleFromAlign[0]].value;
                                        }

                                        isappend = true;
                                        isAddTd = true;
                                    }
                                }
                                tr.appendChild(td);
                            }
                            if (isAddTd == true) {
                                table.appendChild(tr);
                            }

                        }
                        if (isappend == true) {
                            isAnyDataInDiv = true
                            div.appendChild(stmtTitleDiv)
                            div.appendChild(table)
                        }
                    }
                }
                if (isAnyDataInDiv == true) {
                    document.getElementById('displayed-svg').appendChild(div);
                } else {
                    $scope.pages.endId--;
                    $scope.pages.totalPage--;
                }

            } catch (e) {
                console.log(e)
            }

        }

        // assert report create by this function
        var _assertReport = function (printObj, index, dir, docName) {
            // calculation of Total fields
            var totalVal = [];
            var totalFieldArr = [2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            if (docName == 'dVehicleDeprWkt') {
                totalFieldArr = [2, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15]
            }
            for (var i0 = 0; i0 < totalFieldArr.length; i0++) {
                totalVal.push(0.0);
            }
            // create main div to hold all information of assert
            var div = document.createElement('div')
            div.id = 'print_preview_pdf_' + index;
            div.style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
            div.classList.add('overflow_containers')

            var stmtTitleDiv = document.createElement('div');
            stmtTitleDiv.classList.add('asset_TitleDiv')

            if (docName == 'dVehicleDeprWkt') {
                stmtTitleDiv.innerHTML = 'Vehicle Asset Depreciation Report'
            } else {
                stmtTitleDiv.innerHTML = 'Asset Depreciation Report'
            }
            var table = document.createElement('table');
            table.style.width = '100%'
            table.classList.add('asset_table')
            var columnTitles = ["Description(Type)", "Date\nIn\nSvc", "Cost/\nBasis", "Prior\n179\nBonus", "Bus.\nUse\nPer.",
                "Method", "Cv", "Life", "Crnt.\n179", "Crnt.\nBonus", "Prior\nDepr.", "Crnt.\nDepr.\nDeduc.", "Prior\nSpecial\nDepr.\nAllow.",
                "Prior\nAMT", "Crnt.\nAMT", "Crnt.\nAmo.\nDep."]
            if (docName == 'dVehicleDeprWkt') {
                columnTitles = ["Description", "Date\nAcqd.", "Cost", "Bus.\nUse", "179+\nSpec.", "Basis", "Method", "Rec.\nPer.", "Cv", "Prior\nDepr.", "Crnt.\nDepr.", "Next\nYear", "Prior\nAMT", "Crnt.\nAMT", "Gain/\nPrince", "Sales\nPrice", "Date\nSold"]
            }
            var tr = document.createElement('tr');
            tr.style['border-bottom'] = '1px solid #000';
            for (var j = 0; j < columnTitles.length; j++) {
                var th = document.createElement('th');
                th.innerHTML = columnTitles[j];
                tr.appendChild(th);
            }

            table.appendChild(tr);
            var assetDetails;
            if (docName == 'dVehicleDeprWkt') {
                assetDetails = getVehicleAssetData(printObj);
            } else {
                assetDetails = getAssetDetails(printObj);
            }
            var parentForm = ''
            for (var i = 0; i < assetDetails.length; i++) {
                var assetDetail = assetDetails[i];
                if (parentForm !== assetDetail.parentFormInst) {
                    var tr = document.createElement('tr');
                    parentForm = assetDetail.parentFormInst;
                    var td = document.createElement('td');
                    td.colSpan = columnTitles.length;
                    td.style.fontWeight = 'bold';
                    td.innerHTML = 'Parent form: ' + assetDetail.parentFormName;
                    tr.appendChild(td);
                    table.appendChild(tr);
                }

                var tr1 = document.createElement('tr');
                var cellIndex = 0;
                for (var j = 0; j < assetDetail.values.length; j++) {
                    var td = document.createElement('td');
                    if (assetDetail.values[j] != undefined) {
                        td.innerHTML = assetDetail.values[j];
                    }
                    if (totalFieldArr.indexOf(j) > -1) {
                        td.style['text-align'] = 'right';
                        if (!isNaN(parseFloat(assetDetail.values[j]))) {
                            totalVal[cellIndex] = totalVal[cellIndex] + parseFloat(assetDetail.values[j]);
                        }
                        cellIndex++;
                    }
                    tr1.appendChild(td);
                }
                table.appendChild(tr1);

                // code for append total Value in table
                if ((assetDetails[i + 1] && parentForm !== assetDetails[i + 1].parentFormInst) || assetDetails.length == i + 1) {
                    if (totalVal.length > 0) {
                        var totaltr = document.createElement('tr');
                        var td = document.createElement('td');
                        td.innerHTML = 'Total :';
                        totaltr.appendChild(td);
                        totaltr.style['border-top'] = '1px solid #000';
                        for (var i1 = 1; i1 < columnTitles.length; i1++) {
                            var td = document.createElement('td');
                            var index = totalFieldArr.indexOf(i1)
                            if (index > -1) {
                                td.style['text-align'] = 'right';
                                if (Number.isInteger(totalVal[index])) {
                                    td.innerHTML = totalVal[index] + '.0';
                                } else {
                                    td.innerHTML = totalVal[index];
                                }

                            }
                            totaltr.appendChild(td);
                        }
                        table.appendChild(totaltr);
                    }
                    totalVal = [];
                    for (var i0 = 0; i0 < totalFieldArr.length; i0++) {
                        totalVal.push(0.0);
                    }
                }
            }
            div.appendChild(stmtTitleDiv);
            div.appendChild(table);
            if (dir == 'down') {
                document.getElementById('displayed-svg').appendChild(div);
            } else {
                document.getElementById('displayed-svg').insertBefore(div, document.getElementById('displayed-svg').firstChild);
            }
        }

        // show text of not supported Form
        var _notSupportedForm = function (printObj, index, dir) {
            // create main div to hold all information of assert
            var div = document.createElement('div')
            div.id = 'print_preview_pdf_' + index;
            div.style.height = '1188px';
            div.style.width = '918px';
            div.style['text-align'] = 'left';
            div.classList.add('box_shadow_containers')
            if (data.type == 'REQ_SIGN' || data.type == 'REVIEW_SIGN') {
                div.innerHTML = '<div class="padding_15"><h4 style="text-align: center">' + printObj.displayName + '</h4> \n<div>The Print Preview option for this form is not available for Tax Year 2018.The taxpayer will be able to view the PDF version of this form in MyTAXPortal.\n \n<div>The Print Preview feature is an ongoing project with additional improvements expected for <b>Tax Year 2019</b>.</div></div>'
            } else {
                div.innerHTML = '<div class="padding_15"><h4 style="text-align: center">' + printObj.displayName + '</h4> \n <div>The Print Preview option for this form is not available for Tax Year 2018. Simply click <b>Print Form</b> from the form context menu or select <b>Print Form</b> from the <b>Print</b> menu to preview a PDF of this form. \n \n<div>The Print Preview feature is an ongoing project with additional improvements expected for <b>Tax Year 2019</b>.</div></div></div>'
            }


            if (dir == 'down') {
                document.getElementById('displayed-svg').appendChild(div);
            } else {
                document.getElementById('displayed-svg').insertBefore(div, document.getElementById('displayed-svg').firstChild);
            }
        }

        var _getPreparerInfoForPriceList = function (fieldNames) {
            var info = "";
            var allReturnInfos = ["dReturnInfo", "d1041RIS", "d1065RIS", "d1120CRIS", "d1120SRIS", "d990RIS"];
            for (var i = 0; i < allReturnInfos.length; i++) {
                for (var j = 0; j < fieldNames.length; j++) {
                    var wholeFieldName = allReturnInfos[i] + "." + fieldNames[j];
                    var elementValue = _getElementValue(wholeFieldName, "");
                    if (elementValue != undefined && elementValue != "") {
                        info = elementValue;
                    }
                }
            }
            return info;
        }
        // price list create by this function 
        var _priceList = function (index, dir) {
            // create main div to hold all information of assert
            var div = document.createElement('div')
            div.id = 'print_preview_pdf_' + index;
            div.style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
            div.style.padding = '15px';
            div.classList.add('overflow_containers');
            // get value for create print list
            $scope.priceListDetail.prepareFName = _getPreparerInfoForPriceList(["strprnm", "PrepareName"]);
            $scope.priceListDetail.strprfrmnm = _getPreparerInfoForPriceList(["strprfrmnm", "PrepareFirmName"]);
            $scope.priceListDetail.prepareAdd = _getPreparerInfoForPriceList(["strpradd", "PrepareAdd"]);
            $scope.priceListDetail.prepareCSZ = _getPreparerInfoForPriceList(["strprcity", "Preparecity"]) + "," + _getPreparerInfoForPriceList(["strprst", "Preparestate"]) + " "
                + _getPreparerInfoForPriceList(["strprzip", "Preparezip"]);
            $scope.priceListDetail.preparePh = _getPreparerInfoForPriceList(["strprtele", "PreparePhone"]);
            $scope.priceListDetail.prepareEmail = _getPreparerInfoForPriceList(["strpreml", "PrepareEmail"]);
            $scope.priceListDetail.PreparerName = _getElementValue("dPriceList.PreparerName");
            $scope.priceListDetail.firmStreet1 = _getElementValue("dPriceList.firmStreet");
            $scope.priceListDetail.firmCSZ = _getElementValue("dPriceList.firmCity") + ',' + _getElementValue("dPriceList.firmState") + ' ' + _getElementValue("dPriceList.firmZip");
            $scope.priceListDetail.invoiceNumber = _getElementValue("dPriceList.InvoiceNumber");
            $scope.priceListDetail.date = _getElementValue("dPriceList.Date");
            $scope.priceListDetail.firmStreet = _getElementValue("dPriceList.firmCity") + ',' + _getElementValue("dPriceList.firmState") + ' ' + _getElementValue("dPriceList.firmZip");
            $scope.priceListDetail.duedate = _getElementValue("dPriceList.Duedate");
            $scope.priceListDetail.priceDate = _getElementValue("dPriceList.Date");
            $scope.priceListDetail.summerizePriceListData = _getElement("dPriceList.summerizePriceListData")
            $scope.priceListDetail.TotalPercentChargeAmt1 = _getElementValue("dPriceList.TotalPercentChargeAmt1");
            $scope.priceListDetail.TotalCharges = _getElementValue("dPriceList.TotalCharges", undefined, '0.00');
            $scope.priceListDetail.TotalPercentChargeAmttax = _getElementValue("dPriceList.TotalPercentChargeAmttax", undefined, '0.00');
            $scope.priceListDetail.TotalPayment = _getElementValue("dPriceList.TotalPayment", undefined, '0.00');
            $scope.priceListDetail.ServicesCharges = _getElementValue("dPriceList.ServicesCharges", undefined, '0.00');
            $scope.priceListDetail.TotalOtherCharge = _getElementValue("dPriceList.TotalOtherCharge", undefined, '0.00');
            $scope.priceListDetail.totalwithDiscount = 0;
            if ($scope.priceListDetail.summerizePriceListData == undefined || $scope.priceListDetail.summerizePriceListData == '') {
                $scope.priceListDetail.summerizePriceListData = []
            }
            $scope.priceListDetail.summerizePriceListData.push({ 'description': 'Discount', 'total': $scope.priceListDetail.TotalPercentChargeAmt1 })
            for (var i1 = 0; i1 < $scope.priceListDetail.summerizePriceListData.length; i1++) {
                if ($scope.priceListDetail.summerizePriceListData[i1] !== undefined) {
                    if ($scope.priceListDetail.summerizePriceListData[i1].description != 'Discount') {
                        $scope.priceListDetail.totalwithDiscount += parseFloat($scope.priceListDetail.summerizePriceListData[i1].total);
                    } else {
                        $scope.priceListDetail.totalwithDiscount = $scope.priceListDetail.totalwithDiscount - parseFloat($scope.priceListDetail.summerizePriceListData[i1].total);
                    }
                }
            }
            $scope.priceListDetail.totalwithDiscount = $scope.priceListDetail.totalwithDiscount.toString().indexOf('.') == -1 ?
                $scope.priceListDetail.totalwithDiscount.toString() + '.00' : $scope.priceListDetail.totalwithDiscount.toString();
            // append all divs
            console.log($scope.priceListDetail);
            var _element = angular.element(div);
            _element.empty();
            _element.html("<ng-include src=\"'taxAppJs/return/workspace/partials/dialog/priceListPreview.html'\"> </ng-include>");
            $compile(_element.contents())($scope)

            if (dir == 'down') {
                document.getElementById('displayed-svg').appendChild(div);
            } else {
                document.getElementById('displayed-svg').insertBefore(div, document.getElementById('displayed-svg').firstChild);
            }
        }
        // filter forms base on user select packect
        var _filterforSelectedPacket = function () {
            if (staticPrevInfo && staticPrevInfo.length > 0) {
                PrintInfo = [];
                var deprwktInfo = { index: -1, formInstances: [] }
                var vehicleDeprWkt = { index: -1, formInstances: [] };
                for (var i = 0; i < $scope.previewForms.length; i++) {
                    var docs = _.filter(staticPrevInfo, function (obj) {
                        return obj.docName === $scope.previewForms[i].docName
                    });
                    if (docs && docs.length > 0) {
                        var info = JSON.parse(JSON.stringify(docs[0]))
                        if (info.length > 0) {
                            for (var j = 0; j < info.length; j++) {
                                var obj = info[j]
                                obj.docName = $scope.previewForms[i].docName;
                                obj.instance = $scope.previewForms[i].docIndex;
                                obj.state = $scope.previewForms[i].state
                                if (obj.docName == 'dOHSchJ' || obj.docName == 'dILSchB') {
                                    if (typeof obj.metaInformation == 'string') {
                                        obj.metaInformation = JSON.parse(obj.metaInformation)
                                    }
                                    obj.metaInformation = _.sortBy(obj.metaInformation, 'y');
                                }

                                if ($scope.previewNotSupported.indexOf($scope.previewForms[i].docName) > -1) {
                                    PrintInfo.push({ 'docName': obj.docName, 'instance': obj.docIndex, metaInformation: [], 'notSupport': true, 'displayName': $scope.previewForms[i].extendedProperties.displayName });
                                    break;
                                } else if (obj.docName == 'dPriceList') {
                                    if (_getElementValue("dPriceList.ASIcheckbox") != true) {
                                        isSummerizePriceList = true
                                        PrintInfo.push({ 'docName': 'dPriceList', 'instance': obj.docIndex, metaInformation: [] });
                                    } else {
                                        isSummerizePriceList = false
                                        PrintInfo.push(obj);
                                    }
                                } else if (obj.docName == 'dDeprwkt') {
                                    if (deprwktInfo.index == -1) {
                                        PrintInfo.push({ 'docName': obj.docName, metaInformation: [] });
                                        deprwktInfo.index = PrintInfo.length - 1;
                                    }
                                    deprwktInfo.formInstances.push(obj.instance.toString())
                                } else if (obj.docName == 'dVehicleDeprWkt') {
                                    if (vehicleDeprWkt.index == -1) {
                                        PrintInfo.push({ 'docName': obj.docName, metaInformation: [] });
                                        vehicleDeprWkt.index = PrintInfo.length - 1;
                                    }
                                    vehicleDeprWkt.formInstances.push(obj.instance.toString())
                                } else if (obj.metaInformation !== '') {
                                    PrintInfo.push(obj);
                                }
                            }
                        } else {
                            if ($scope.previewForms[i].docName == 'dPriceList') {
                                if (_getElementValue("dPriceList.ASIcheckbox") != true) {
                                    isSummerizePriceList = true
                                    PrintInfo.push({ 'docName': 'dPriceList', 'instance': $scope.previewForms[i].docIndex, metaInformation: [] });
                                } else {
                                    isSummerizePriceList = false
                                    PrintInfo.push({ 'docName': 'dPriceList', 'instance': $scope.previewForms[i].docIndex, metaInformation: [], 'notSupport': true, 'displayName': $scope.previewForms[i].extendedProperties.displayName });
                                }
                            } else if ($scope.previewNotSupported.indexOf($scope.previewForms[i].docName) > -1) {
                                PrintInfo.push({ 'docName': $scope.previewForms[i].docName, 'instance': $scope.previewForms[i].docIndex, metaInformation: [], 'notSupport': true, 'displayName': $scope.previewForms[i].extendedProperties.displayName });
                            }
                        }
                    }
                }
                endPage = PrintInfo.length;
                if (deprwktInfo.index > -1) {
                    PrintInfo[deprwktInfo.index].formInstances = deprwktInfo.formInstances;
                }
                if (vehicleDeprWkt.index > -1) {
                    PrintInfo[vehicleDeprWkt.index].formInstances = vehicleDeprWkt.formInstances;
                }
            }

            $scope.pages.totalPage = PrintInfo.length;
            _noDataCheck();
        }

        // reset variable if no data for print preview
        var _noDataCheck = function () {
            $scope.pages.rotateVal = 0;
            if (!PrintInfo || PrintInfo.length == 0) {
                $scope.noText = true;
                $scope.bottom_loder = false;
                $scope.top_loder = false;
                $scope.pages.currentPage = 0;
                $scope.pages.totalPage = 0;
            } else {
                $scope.noText = false;
                $scope.pages.currentPage = 1;
                $scope.pages.currentPageId = 1;
            }
        }

        var getAssetDetails = function (printObj) {
            var assetData = []
            var parentForms = ["d1040SS", "d4835", "dSchC", "dSchF", "dSchE", "dSchEDup", "d2106", "d1065", "d8825", "d1120C", "d1120S", "d990"];
            var parentFormsName = ["1040SS", "4835", "Schedule C", "Schedule F", "Schedule E", "Schedule E (Duplicate)", "2106", "1065", "8825", "1120C", "1120S", "990"];
            for (var i = 0; i < parentForms.length; i++) {
                var parentForm = parentForms[i];
                var parentFormInsts = _getFormInstances(parentForm);
                for (var j = 0; j < parentFormInsts.length; j++) {
                    var parentFormInst = parentFormInsts[j];
                    var d4562Insts = _getChildInstFromParentInst("d4562", parentFormInst);
                    for (var j1 = 0; j1 < d4562Insts.length; j1++) {
                        var d4562Inst = d4562Insts[j1];
                        var deprInsts = _getChildInstFromParentInst("dDeprwkt", d4562Inst);
                        for (var j2 = 0; j2 < deprInsts.length; j2++) {
                            var deprInst = deprInsts[j2];
                            if (printObj.formInstances && printObj.formInstances.indexOf(deprInst) > -1) {
                                var parentFormName = parentFormsName[i] + (_getElementValue("dDeprwkt.fieldem", deprInst, "") == "" ? "" : "(" + _getElementValue("dDeprwkt.fieldem", deprInst, "") + ")");
                                var checkForPropertyType = _checkForPropertyType(parentFormName, _getElementValue("dDeprwkt.fieldem", deprInst, ""), deprInst);
                                if (checkForPropertyType) {
                                    var fieldem = _getElementValue("dDeprwkt.fieldem", deprInst);
                                    var deprClass = _getElementValue("dDeprwkt.DeprClass", deprInst);
                                    var parentFormName = parentFormsName[i] + (fieldem != '' && fieldem != undefined ? '(' + fieldem + ')' : '');
                                    var values = [
                                        _getElementValue("dDeprwkt.fieldel", deprInst) + (deprClass != '' && deprClass != undefined ? '(' + deprClass + ')' : ''),
                                        _getElementValue("dDeprwkt.fieldek", deprInst),
                                        _getElementValue("dDeprwkt.fieldei", deprInst),
                                        _getElementValue("dDeprwkt.priorsection", deprInst),
                                        _getElementValue("dDeprwkt.fieldcl", deprInst),
                                        _getElementValue("dDeprwkt.fielddi", deprInst),
                                        _getElementValue("dDeprwkt.Convention", deprInst),
                                        _getElementValue("dDeprwkt.fielddg", deprInst),
                                        _getElementValue("dDeprwkt.fieldbz", deprInst),
                                        _getElementValue("dDeprwkt.fieldbs", deprInst),
                                        _getElementValue("dDeprwkt.fieldcs", deprInst),
                                        _getElementValue("dDeprwkt.fieldcu", deprInst),
                                        _getElementValue("dDeprwkt.fieldci", deprInst),
                                        _getElementValue("dDeprwkt.fieldbn", deprInst),
                                        _getElementValue("dDeprwkt.fieldbk", deprInst),
                                        _getElementValue("dDeprwkt.fieldbi", deprInst)

                                    ]
                                    assetData.push({ 'parentFormInst': parentFormInst, 'parentFormName': parentFormName, 'values': values })
                                }
                            }
                        }
                    }
                }
            }
            return assetData;
        }

        var getVehicleAssetData = function (printObj) {

            var types = { '1': "Vehicles Under 6000 lbs", '2': "6000 - 14000 GVW", '3': "Trucks and Vans", '4': "Light Duty Trucks/Vans/SUVs Under 6000 lbs", '5': "Equipment and Trucks / Special Use Vehicles", '6': "Electric Automobiles" };

            var assetData = []
            var parentForms = ["d4835", "dSchC", "dSchF", "dSchE", "dSchEDup", "d2106", "d1065", "d8825", "d1120C", "d1120S"];
            var parentFormsName = ["4835", "Schedule C", "Schedule F", "Schedule E", "Schedule E (Duplicate)", "2106", "1065", "8825", "1120C", "1120S"];
            for (var i = 0; i < parentForms.length; i++) {
                var parentForm = parentForms[i];
                var parentFormInsts = _getFormInstances(parentForm);
                for (var j = 0; j < parentFormInsts.length; j++) {
                    var parentFormInst = parentFormInsts[j];
                    var d4562Insts = _getChildInstFromParentInst("d4562", parentFormInst);
                    for (var j1 = 0; j1 < d4562Insts.length; j1++) {
                        var d4562Inst = d4562Insts[j1];
                        var deprInsts = _getChildInstFromParentInst("dVehicleDeprWkt", d4562Inst);
                        for (var j2 = 0; j2 < deprInsts.length; j2++) {
                            var deprInst = deprInsts[j2];
                            var parentFormName = parentFormsName[i] + (_getElementValue("dVehicleDeprWkt.fieldaf", deprInst, "") == "" ? "" : "(" + _getElementValue("dVehicleDeprWkt.fieldaf", deprInst, "") + ")");
                            var checkForPropertyType = _checkForPropertyType(parentFormName, _getElementValue("dVehicleDeprWkt.fieldaf", deprInst, ""));
                            if (checkForPropertyType) {
                                if (printObj.formInstances && printObj.formInstances.indexOf(deprInst) > -1) {
                                    var deprClassValue = _getElementValue("dVehicleDeprWkt.DeprClass", deprInst);
                                    var typeValue = "";
                                    if (deprClassValue != "") {
                                        typeValue = types[deprClassValue];
                                    }
                                    var values = [_getElementValue("dVehicleDeprWkt.fieldfv", deprInst, "") + ("(" + typeValue + ")"),
                                    _getElementValue("dVehicleDeprWkt.fieldfu", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldfs", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldfk", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldda", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fielddr", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldec", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldej", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldel", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fielddn", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldcv", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fielddl", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldcr", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldcv3", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldes", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldfb", deprInst, ""),
                                    _getElementValue("dVehicleDeprWkt.fieldfg", deprInst, "")];
                                    assetData.push({ 'parentFormInst': parentFormInst, 'parentFormName': parentFormName, 'values': values })
                                }
                            }

                        }
                    }
                }
            }
            return assetData;
        }

        var _checkForPropertyType = function (parentFormName, propteryType) {
            var check = true;
            if (parentFormName.includes("Schedule E") || parentFormName.includes("Schedule E (Duplicate)") || parentFormName.includes("8825") || parentFormName.includes("8825 (Duplicate)")) {
                if (propteryType != "") {
                    var formProperty = parentFormName.substring(parentFormName.lastIndexOf("(") + 1, parentFormName.lastIndexOf(")"));
                    check = (formProperty == propteryType) ? true : false;
                }
            }
            return check;
        }

        // page handler for how many pages display at staring
        var _pageHandler = function (isRefresh) {
            if (isRefresh === true) {
                document.getElementById('displayed-svg').innerHTML = ''
                lastScrollDir = ''
                document.getElementById('print_preview_container').scrollTop = 0;
            }
            _downScroll(startPage, endPage)
            endPage = currentPages;
        }

        // display remain pages for down scroll
        var _downScroll = function (startPage, endPage) {
            if (startPage == 0) {
                $scope.pages.endId = 0;
                $scope.pages.startId = 0;
                if (overflowStmt && overflowStmt.length > 0) {
                    $scope.pages.totalPage++;
                }
            }
            for (var i = startPage; i < endPage; i++) {
                if (lastScrollDir != '') {
                    _displaySvg(i, 'down')
                    if (PrintInfo[i]) {
                        $scope.pages.endId++;
                    }

                } else {
                    if (document.getElementById('displayed-svg').innerHTML.length < totalLengthOfSvg) {
                        _displaySvg(i, 'down')
                        $scope.pages.endId++;
                    } else {
                        break;
                    }
                }
            }

            if (document.getElementById('displayed-svg') && document.getElementById('displayed-svg').children.length > 0 && lastScrollDir != '') {
                while (document.getElementById('displayed-svg').innerHTML.length > totalLengthOfSvg) {
                    var firstChild = document.getElementById('displayed-svg').firstChild;
                    var childNodes = document.getElementById('displayed-svg').childNodes.length
                    if (firstChild !== null && firstChild !== undefined && childNodes > numberOfPageAdd + 2) {
                        $scope.pages.startId++;
                        document.getElementById('displayed-svg').removeChild(firstChild);
                    } else {
                        break;
                    }
                }

            }
            currentPages = document.getElementById('displayed-svg').childNodes.length;
            document.getElementById('displayed-svg').style.display = 'block';
            if ($scope.pages.endId >= PrintInfo.length && overflowStmt.length > 0) {
                _addOverflowStmt()
                $scope.pages.endId++;
            }
            if (startPage == 0) {
                // set Time out for first render all svg and then display block
                setTimeout(function () {
                    $scope.enableLoading = false;
                }, 300)
            } else {
                if ($scope.platform == 'iPad') {
                    document.getElementById('print_preview_pdf_' + (startPage - 1)).scrollIntoView(false);
                }
                $scope.enableLoading = false;
            }
        }

        // display remain pages for up scroll
        var _upScroll = function () {
            var focusedEle = endPage;
            for (var i = endPage; i > startPage; i--) {
                _displaySvg(i - 1, 'up')
                if (PrintInfo[i - 1]) {
                    $scope.pages.startId--;
                }
            }
            if (document.getElementById('displayed-svg') && document.getElementById('displayed-svg').children.length > 0 && lastScrollDir != '') {
                while (document.getElementById('displayed-svg').innerHTML.length > totalLengthOfSvg) {
                    var lastChild = document.getElementById('displayed-svg').lastChild;
                    var childNodes = document.getElementById('displayed-svg').childNodes.length
                    if (lastChild !== null && lastChild !== undefined && childNodes > numberOfPageAdd + 2) {
                        document.getElementById('displayed-svg').removeChild(lastChild);
                        $scope.pages.endId--;
                    } else {
                        break;
                    }
                }
                currentPages = document.getElementById('displayed-svg').childNodes.length;
            }

            document.getElementById('print_preview_pdf_' + focusedEle).scrollIntoView();
            $scope.enableLoading = false;
        }

        // render svg and other information to html
        var _displaySvg = function (i, dir) {
            try {
                var printObj = PrintInfo[i];
                if (printObj && printObj.notSupport == true) {
                    _notSupportedForm(printObj, i, dir)
                } else if (printObj && printObj.docName == 'dPriceList' && isSummerizePriceList == true) {
                    _priceList(i, dir);
                } else if (printObj && (printObj.docName == 'dDeprwkt' || printObj.docName == 'dVehicleDeprWkt')) {
                    _assertReport(printObj, i, dir, printObj.docName);
                } else if (printObj) {
                    // create elements for svg display to user
                    formSvg = document.createElement('div');
                    var svgDiv = document.createElement('div')
                    var obj = document.createElement('div');
                    var page_content_inner = document.createElement('div');
                    var watermarkDiv = document.createElement('div')

                    formSvg.id = 'print_preview_pdf_' + i;
                    formSvg.style.height = printObj.height ? printObj.height : 1188 + 'px'
                    formSvg.style.width = printObj.width ? printObj.width : 918 + 'px';
                    formSvg.style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
                    formSvg.classList.add('box_shadow_containers')

                    watermarkDiv.classList.add('watermark');
                    if ($scope.waterMarkDetails[$scope.selectedPacket.value] && $scope.waterMarkDetails[$scope.selectedPacket.value].isChecked === true
                        && waterMark_Text !== undefined && waterMark_Text !== '') {
                        watermarkDiv.innerHTML = '<span class="waterMark_text">' + waterMark_Text + '</span>'
                    }

                    svgDiv.style.height = '100%'
                    svgDiv.style.width = '100%'
                    svgDiv.classList.add('page_containers');

                    obj.classList.add('page_content')
                    page_content_inner.innerHTML = printObj.svg;
                    page_content_inner.classList.add('page_content_inner');
                    _setUniqIdToSvg(page_content_inner)

                    fields_containers = document.createElement('div')
                    fields_containers.id = 'fields_containers'
                    printObj.metaInformation.forEach(function (ele) {
                        if (ele.objectType == 'checkbox') {
                            if (ele.isMatch === true) {
                                _setValueOfCheckBox(ele)
                            }
                        } else if (ele.objectType == 'statement') {
                        } else if (ele.objectType == 'signature' && ele.signatureFor != undefined) {
                            _addSignature(ele)
                        } else {
                            _setValueOfInput(ele)
                        }
                    })

                    obj.appendChild(page_content_inner);
                    svgDiv.appendChild(obj)
                    svgDiv.appendChild(watermarkDiv)
                    formSvg.appendChild(svgDiv)
                    formSvg.appendChild(fields_containers)
                    if (dir == 'addForm') {
                        var childNodes = document.getElementById('displayed-svg').childNodes;
                        document.getElementById('displayed-svg').insertBefore(formSvg, childNodes[i])
                        if (childNodes.length > defaultPage) {
                            document.getElementById('displayed-svg').removeChild(document.getElementById('displayed-svg').lastChild);
                        }
                    } else if (dir == 'down') {
                        document.getElementById('displayed-svg').appendChild(formSvg);
                    } else {
                        document.getElementById('displayed-svg').insertBefore(formSvg, document.getElementById('displayed-svg').firstChild);
                    }
                } else {
                    endPage--;
                }
            } catch (e) {
                console.log(e);
            }
        }

        // remove and add mask infomation based on user checked or unchecked 
        $scope.maskSensitiveInfoClick = function () {
            var maskEles = document.getElementsByClassName('maskSensitiveInfo');
            while (maskEles.length > 0) {
                maskEles[0].parentNode.removeChild(maskEles[0]);
            }
            var childNodes = document.getElementById('displayed-svg').childNodes
            var j = 0;
            for (var i = $scope.pages.startId; i < $scope.pages.endId; i++) {
                var printObj = PrintInfo[i];
                formSvg = childNodes[j]
                fields_containers = formSvg.querySelectorAll("#fields_containers")[0];
                printObj.metaInformation.forEach(function (ele) {
                    if (ele.fieldType && ['ETIN', 'EFIN', 'ROUNTINGNO', 'ACCOUNTNO', 'PID', 'EIN', 'SSN', 'PTIN'].indexOf(ele.fieldType.toUpperCase()) > -1) {
                        _setValueOfInput(ele);
                    }
                })
                j++;
            }
        }
        // remove and add signature infomation based on user checked or unchecked 
        $scope.SignatureHandler = function () {
            var signEles = document.getElementsByClassName('signature_info');
            while (signEles.length > 0) {
                signEles[0].parentNode.removeChild(signEles[0]);
            }
            if ($scope.isAddSignature.isChecked == true) {
                var childNodes = document.getElementById('displayed-svg').childNodes
                var j = 0;
                for (var i = $scope.pages.startId; i < $scope.pages.endId; i++) {
                    var printObj = PrintInfo[i];
                    formSvg = childNodes[j]
                    if (printObj && formSvg !== undefined) {
                        fields_containers = formSvg.querySelectorAll("#fields_containers")[0];
                        printObj.metaInformation.forEach(function (ele) {
                            if (ele.objectType && ele.objectType == 'signature' && ele.signatureFor != undefined) {
                                _addSignature(ele);
                            }
                        })
                        j++;
                    }
                }
            }
        }
        // page Number display to top
        var pageNumberHandler = function () {
            try {
                var print_preview_container = document.getElementById('print_preview_container')
                visibleTop = document.getElementById('zoom_handler').getBoundingClientRect().top;
                angular.element(print_preview_container).bind("scroll", function (e) {
                    var display_node = document.getElementById('displayed-svg').childNodes
                    var top;
                    for (var i = 0; i < display_node.length; i++) {
                        top = display_node[i].getBoundingClientRect().top;
                        if (top < visibleTop) {
                            $scope.pages.currentPage = parseInt(display_node[i].id.split('print_preview_pdf_')[1]) + 1;
                        }
                    }
                });
            } catch (e) {
                console.log(e)
            }

        }

        // scroll Block of element
        var _blockScroll = function (print_preview_container, overflow) {
            print_preview_container.style[overflow] = 'hidden'
        }

        // scroll unBlock of element
        var _unBlockScroll = function (print_preview_container, overflow) {
            setTimeout(function () {
                print_preview_container.style[overflow] = 'auto'
            }, 300)
        }

        // page load on scroll
        var scollEventHandler = function () {
            var print_preview_container = document.getElementById('print_preview_container')
            var scrollHandlerVar = { height: print_preview_container.style.height, downScrollHeight: 2, overflow: 'overflow-y' }
            if (scrollHandlerVar.height !== undefined && scrollHandlerVar.height !== null) {
                scrollHandlerVar.height = parseInt(scrollHandlerVar.height)
            }
            // height based on device
            if ($scope.platform == 'iPad') {
                scrollHandlerVar.downScrollHeight = 1.2;
                scrollHandlerVar.overflow = 'overflow';
            }

            angular.element(print_preview_container).bind("scroll", function (e) {
                if (scrollEnable == false) {
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                }
                try {
                    if (scrollEnable === true && endPage < PrintInfo.length && print_preview_container.scrollTop +
                        (scrollHandlerVar.downScrollHeight * scrollHandlerVar.height) >= print_preview_container.scrollHeight) {
                        scrollEnable = false;
                        if (lastScrollDir === 'up') {
                            if (startPage < 0) {
                                startPage = 0;
                            }
                            startPage = startPage + currentPages;
                            endPage = startPage + numberOfPageAdd;
                        } else {
                            startPage = endPage;
                            endPage = endPage + numberOfPageAdd;
                        }
                        lastScrollDir = 'down';
                        $scope.enableLoading = true;
                        _blockScroll(print_preview_container, scrollHandlerVar.overflow)
                        $scope.bottom_loder = true;
                        setTimeout(function () {
                            _downScroll(startPage, endPage);
                            scrollEnable = true;
                            $scope.bottom_loder = false;
                            _unBlockScroll(print_preview_container, scrollHandlerVar.overflow)
                        }, 300)
                    } else if (scrollEnable === true && print_preview_container.scrollTop - 10 < 0 && startPage > 0) {
                        scrollEnable = false;
                        if (lastScrollDir === 'down') {
                            endPage = endPage - currentPages;
                            startPage = endPage - numberOfPageAdd;
                        } else {
                            endPage = startPage
                            startPage = endPage - numberOfPageAdd;
                        }
                        lastScrollDir = 'up';
                        _blockScroll(print_preview_container, scrollHandlerVar.overflow)
                        $scope.enableLoading = true;
                        $scope.top_loder = true;
                        setTimeout(function () {
                            _upScroll();
                            scrollEnable = true;
                            $scope.top_loder = false;
                            _unBlockScroll(print_preview_container, scrollHandlerVar.overflow)
                        }, 300)
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        }


        //Check for privileges
        $scope.userCan = function (privilege) {
            return userService.can(privilege);
        };

        var _refreshUI = function (isAddOrRemoveOne) {
            $scope.enableLoading = true;
            setTimeout(function () {
                startPage = 0;
                endPage = PrintInfo.length;
                lastScrollDir = '';
                if (isAddOrRemoveOne !== true) {
                    _filterforSelectedPacket();
                    _prepareAllMetaInfo();
                }
                _pageHandler(true);
            })
        }

        //This function will used to expand all accordian
        $scope.openAllItems = function () {
            $scope.categories.map(function (item) {
                item.isOpen = true;
            });
        };


        //This function is used to close all accordian
        $scope.closeAllItems = function () {
            $scope.categories.map(function (item) {
                item.isOpen = false;
            });
        };

        var resetoverflowCount = function () {
            for (var i in StmtDocName) {
                for (var j in StmtDocName[i]) {
                    if (j != 'firstElement' && j != 'stmtMaxCount') {
                        StmtDocName[i][j] = 0
                    }
                }
            }
        }

        // add  value in meta information object
        var _setElementsValue = function (printObj) {
            var state = printObj.state;
            var isAddValue = true
            var stmtReturnDoc = {};
            var seeStmt = []
            printObj.metaInformation.forEach(function (element) {
                isAddValue = true
                if (element.elementName !== undefined && element.elementName !== '') {
                    if (element.docName == undefined || element.docName == '') {
                        if (element.elementName.indexOf('.') > -1) {
                            var docEle = element.elementName.split('.');
                            element.docName = docEle[0];
                            element.elementName = docEle[1];
                            if (_taxReturn.docs[element.docName]) {
                                element.formsinstant = Object.keys(_taxReturn.docs[element.docName])[0];
                            }
                        } else {
                            element.docName = printObj.docName;
                            element.formsinstant = printObj.instance
                        }
                    } else if (_taxReturn.docs[element.docName]) {
                        if (StmtDocName[element.docName] != undefined) {
                            if (stmtReturnDoc[element.docName] == undefined) {
                                stmtReturnDoc[element.docName] = getChildDoc(element.docName, printObj.instance);
                            }
                            if (stmtReturnDoc[element.docName] !== undefined) {
                                if (StmtDocName[element.docName]['stmtMaxCount'] !== undefined && StmtDocName[element.docName]['stmtMaxCount'] > 0 &&
                                    Object.keys(stmtReturnDoc[element.docName]).length > StmtDocName[element.docName]['stmtMaxCount']) {
                                    if (StmtDocName[element.docName]['firstElement'] == element.elementName && seeStmt.indexOf(element.elementName) == -1) {
                                        seeStmt.push(element.elementName);
                                        element.elementValue = 'SEE STATEMENT'
                                    }
                                    isAddValue = false
                                } else {
                                    _.remove(overflowStmt, function (obj) {
                                        return obj.stmtName == element.docName;
                                    })
                                }
                                if (StmtDocName[element.docName][element.elementName] !== undefined) {
                                    element.formsinstant = Object.keys(stmtReturnDoc[element.docName])[StmtDocName[element.docName][element.elementName]];
                                    StmtDocName[element.docName][element.elementName] += 1;
                                } else {
                                    if (StmtDocName[element.docName] !== undefined) {
                                        StmtDocName[element.docName][element.elementName] = 1
                                    }
                                    element.formsinstant = Object.keys(stmtReturnDoc[element.docName])[0];
                                }
                            }
                        } else if (_taxReturn.docs[element.docName] !== undefined) {
                            element.formsinstant = Object.keys(_taxReturn.docs[element.docName])[0];
                        }
                    }
                    if (_taxReturn.docs[element.docName] && _taxReturn.docs[element.docName][element.formsinstant] !== undefined && isAddValue == true) {
                        var eleValue = _taxReturn.docs[element.docName][element.formsinstant][element.elementName];
                        if (eleValue !== undefined && eleValue !== '') {
                            try {
                                _setTextboxValue(eleValue.value, element, state);
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    }
                }
            });
        }

        var setStmtDoc = function () {
            overflowStmt = [];
            for (var i = 0; i < PrintInfo.length; i++) {
                if (PrintInfo[i] && PrintInfo[i].docName !== 'dDeprwkt' && PrintInfo[i].docName !== 'dVehicleDeprWkt') {
                    if (typeof PrintInfo[i].metaInformation == 'string') {
                        PrintInfo[i].metaInformation = JSON.parse(PrintInfo[i].metaInformation);
                    }
                    PrintInfo[i].metaInformation.forEach(function (element) {
                        if (element.objectType == 'statement') {
                            StmtDocName[element.stmtName] = {};
                            if (element.stmtMaxCount !== undefined) {
                                StmtDocName[element.stmtName]['stmtMaxCount'] = isNaN(parseInt(element['stmtMaxCount'])) != true ? parseInt(element['stmtMaxCount']) : undefined
                            }
                            if (element.stmtElements !== undefined && typeof element.stmtElements == 'string') {
                                var stmtEle = element.stmtElements.split('|');
                                for (var j = 0; j < stmtEle.length; j++) {
                                    if (stmtEle[j] !== undefined && stmtEle[j].split('.')[1] !== undefined) {
                                        var eleWithType = stmtEle[j].split('.')[1];
                                        if (eleWithType !== undefined && typeof eleWithType == 'string') {
                                            var eleName = eleWithType.split('?');
                                            if (eleName !== undefined && eleName.length > 0) {
                                                if (eleName[0] !== undefined) {
                                                    StmtDocName[element.stmtName][eleName[0]] = 0
                                                    if (j == 0) {
                                                        StmtDocName[element.stmtName]['firstElement'] = eleName[0];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            overflowStmt.push(element);
                        }
                    })
                }
            }
        }

        // function for change all value of element change based on setTextboxValue function
        var _prepareAllMetaInfo = function () {
            setStmtDoc();
            var fInstance;
            for (var i = 0; i < PrintInfo.length; i++) {
                if (PrintInfo[i] && PrintInfo[i].docName !== 'dDeprwkt' && PrintInfo[i].docName !== 'dVehicleDeprWkt') {
                    if (fInstance !== PrintInfo[i].instance) {
                        fInstance = angular.copy(PrintInfo[i].instance)
                        resetoverflowCount();
                    }
                    _setElementsValue(PrintInfo[i])
                }

            }
        }

        var _addFormToPreview = function (form) {
            var tempFormArray = []
            // $scope.previewForms.push(form);
            _.forEach($scope.categories, function (category) {
                var formList = $filter('printPacketCategoryDialogFilter')($scope.forms, category.value);
                _.forEach(formList, function (formObj) {
                    //if whenToPrint is 'always' for selected Packet form then push object into array  for printing
                    if (formObj.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Always' && formObj.extendedProperties.isHiddenForm != true) {
                        tempFormArray.push(formObj);
                    }
                });
            });
            $scope.previewForms = tempFormArray;
            // add form on fly code 
            $scope.enableLoading = true;
            _refreshUI();

        }

        // method for add or remove forms from display svg pages
        $scope.addOrRemoveForm = function (form) {
            if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Always') {
                form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Never'
                _.remove($scope.previewForms, function (obj) {
                    return (obj.docName === form.docName && obj.docIndex === form.docIndex)
                })

                _.remove(PrintInfo, function (obj) {
                    return (obj.docName === form.docName && obj.instance === form.docIndex)
                })
                if (form.docName == 'dDeprwkt' || form.docName == 'dVehicleDeprWkt') {
                    var deprwktDocs = _.filter(PrintInfo, function (obj) {
                        return obj.docName === form.docName
                    })
                    for (var j = 0; j < deprwktDocs.length; j++) {
                        var deprwktDoc = deprwktDocs[j];
                        _.remove(deprwktDoc.formInstances, function (inst) {
                            return inst == form.docIndex;
                        })
                    }
                    _.remove(PrintInfo, function (obj) {
                        return (obj.docName === form.docName && (obj.formInstances == undefined || obj.formInstances.length == 0))
                    })
                }
                $scope.pages.totalPage = PrintInfo.length;
                _refreshUI(true);
                _noDataCheck();
            } else {
                form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Always';
                _addFormToPreview(form);
            }

        }

        // need to replace font-family and clippath with uniq id for solved problem on conflict style
        var _setUniqIdToSvg = function (svgData) {
            var obj = svgData;
            var defs = obj.getElementsByTagName('svg')[0].getElementsByTagName('defs')[0];
            if (defs !== undefined) {
                if (defs.getElementsByTagName('style')[0] !== undefined) {
                    var fontFaceArray = defs.getElementsByTagName('style')[0].innerHTML.split('@font-face')
                    var styleString = ''
                    for (var i4 = 0; i4 < fontFaceArray.length; i4++) {
                        var fontface = fontFaceArray[i4]
                        if (fontface) {
                            fontface = fontface.replace('"', '"t' + uniqueId + '_')
                            styleString += '@font-face' + fontface
                        }
                    }
                    defs.getElementsByTagName('style')[0].innerHTML = styleString;
                    var tspanData = obj.getElementsByTagName('svg')[0].getElementsByTagName('tspan');
                    for (var i5 = 0; i5 < tspanData.length; i5++) {
                        var tspan = tspanData[i5];
                        var font = tspan.getAttribute('font-family');
                        tspan.setAttribute('font-family', 't' + uniqueId + '_' + font)
                    }
                }
                defs.innerHTML = defs.innerHTML.replace(/"clippath/g, '"t' + uniqueId + '_clippath')
                obj.innerHTML = obj.innerHTML.replace(/#clippath/g, '#t' + uniqueId + '_clippath')
                uniqueId++;
            }
        }
        // get all data of meta information and svg from content Service
        var _getPreviewInfo = function () {
            var Metainfo = contentService.getPreviewInfo();
            if (Metainfo) {
                var includedForms = []
                for (var i = 0; i < $scope.forms.length; i++) {
                    var form = $scope.forms[i];
                    for (var j = 0; j < Metainfo.length; j++) {
                        var info = Metainfo[j];
                        if (info[form.docName] && includedForms.indexOf(form.docName) === -1) {
                            includedForms.push(form.docName);
                            // _setUniqIdToSvg(info[form.docName])
                            info[form.docName].docName = form.docName;
                            staticPrevInfo.push(info[form.docName]);
                            break;
                        }
                    }
                }
            }
        }

        // form  sort By Categories and push on preview array
        var _sortByCategories = function () {
            $scope.previewForms = [];
            _.forEach($scope.categories, function (category) {
                var formList = $filter('printPacketCategoryDialogFilter')($scope.forms, category.value);
                _.forEach(formList, function (form) {
                    //if whenToPrint is 'always' for selected Packet form then push object into array  for printing
                    if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Always' && form.extendedProperties.isHiddenForm != true) {
                        $scope.previewForms.push(form);
                    }
                });
            });
        }

        //This function is used to check/uncheck all form
        $scope.checkAllForm = function (checkedValue) {
            _.forEach($scope.forms, function (form) {
                //check is when to print Property is defined
                if (angular.isDefined(form.extendedProperties.whenToPrint)) {
                    if (checkedValue == true) {
                        //checkedValue is true , then assign 'always' value to all form 
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Always';
                    } else {
                        //checkedValue is false , then assign 'never' value to all form 
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Never';
                    }
                }
            });
            _sortByCategories()
            _refreshUI();
        }

        //This Function will convert whenToPrint default property to always
        $scope.changePrintPackets = function (isCallStaticApi) {
            //sort form by printOrder
            _sortFormsbyPrintOrder();
            //if selected packet is client then assign text 'Client Copy' as a waterMarkText
            if (angular.isUndefined($scope.waterMarkDetails) || _.isEmpty($scope.waterMarkDetails)) {
                $scope.waterMarkDetails = { 'client': { isChecked: true, value: "Client Copy" } };
            }
            //getWaterMark
            waterMark_Text = getWaterMark();
            //if it is undefined then assign client water mark text 
            if ((waterMark_Text == undefined || waterMark_Text == '') && $scope.waterMarkDetails && $scope.waterMarkDetails[$scope.selectedPacket.value] != undefined) {
                waterMark_Text = $scope.waterMarkDetails[$scope.selectedPacket.value].value;
            }

            //check mask sensitive checkbox if selected packet is not filing
            if ($scope.selectedPacket.value == 'filing' || $scope.selectedPacket.value == 'custom') {
                $scope.maskSensitiveInfo = false;
            } else {
                $scope.maskSensitiveInfo = true;
            }
            //uncheck check all checkbox when change packet
            $scope.checkAll = false;
            _.forEach($scope.forms, function (form) {
                //check is whenToPrint is defined
                if (angular.isDefined(form.extendedProperties.whenToPrint)) {
                    //convert default to always if whenToPrint is defalut and form status is active or required
                    if (angular.isDefined(data.formForPreview)) {
                        if (data.formForPreview.docName == form.docName && data.formForPreview.docIndex == form.docIndex) {
                            form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Always';
                        } else {
                            form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Default';
                        }
                    } else if ((form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Default' || form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Always') &&
                        (form.extendedProperties.formStatus.toLowerCase() == 'active'
                            || form.extendedProperties.formStatus.toLowerCase() == 'required')) {
                        //if selected packet has default value as well it is also active or required formStatus then
                        //convert default to always
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Always';
                    } else if (form.extendedProperties.whenToPrint[$scope.selectedPacket.value] == 'Default') {//convert default to always if whenToPrint is defalut and form status is Inactive 
                        //if selected packet is default then assign never value to selected packet
                        form.extendedProperties.whenToPrint[$scope.selectedPacket.value] = 'Never';
                    }
                }
            });
            data.formForPreview = undefined;
            _sortByCategories()
            if (isCallStaticApi === true) {
                $scope.isSendDisabled = false;
                scollEventHandler();
                pageNumberHandler();
                _filterforSelectedPacket();
                _prepareAllMetaInfo();
                _pageHandler();
            } else {
                _refreshUI();
            }
        }

        //This Function is Used to get saved data of printPacketConfiguration
        var _getLastSavedFormsFromApi = function () {
            var deferred = $q.defer();
            //call api to get print packets forms data
            printPacketsConfigurationService.openPrintPacketsConfiguration().then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        // handle media quary for get all properly of div 
        var _getStyleProperty = function () {
            var displayed_svg = document.querySelector('#displayed-svg')
            if (displayed_svg) {
                var style = getComputedStyle(displayed_svg);
                if (style && style.zoom != undefined && style.zoom != '') {
                    $scope.pages.zoom = style.zoom * 100;
                }
            }
        }

        //This function is used to merge api data with form list
        var _mergeApiDataWithFormList = function (isResetPressed) {
            if ($scope.userCan('CAN_OPEN_PRINTSET')) {
                //get saved forms from api
                _getLastSavedFormsFromApi().then(function (response) {
                    //set waterMarkDetails
                    $scope.waterMarkDetails = response.waterMarkDetails;

                    if (data.type == 'REQ_SIGN' || data.type == 'REVIEW_SIGN') {
                        $scope.waterMarkDetails = { 'client': { isChecked: true, value: "Do Not File - Client Copy" } };
                    }

                    //if user pressed reset button then assign old form data to forms
                    if (isResetPressed == true) {
                        $scope.forms = angular.copy(data.forms);
                    }
                    //Merge user changes
                    _.forEach(response.forms, function (form, id) {
                        //replace form property with print set property if available , otherwise form has default property
                        var objects = _.filter($scope.forms, function (object) { return object.extendedProperties.id == id });
                        _.forEach(objects, function (obj) {
                            obj.extendedProperties.whenToPrint = angular.copy(form.whenToPrint);
                            obj.extendedProperties.printOrder = angular.copy(form.printOrder);
                        });
                    });
                    _getStyleProperty();
                    _getPreviewInfo();
                    //initialy we call print packets with default packets
                    $scope.changePrintPackets(true);
                },
                    function (error) {
                        $log.error(error);
                    });
            }
        }

        var analysisPasswordOption = function () {
            //get user details
            var _userDetails = userService.getUserDetails();
            //check if user preferences for pdf password is defined 
            if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences)
                && !_.isUndefined(_userDetails.settings.preferences) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace)
                && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace.passwordProtectedReturn)) {
                //check if passwordProtectedReturn true or not 
                if (_userDetails.settings.preferences.returnWorkspace.passwordProtectedReturn == true) {
                    //passwordType is defined or not
                    if (!_.isUndefined(_userDetails.settings.preferences.returnWorkspace.passwordType)
                        && _userDetails.settings.preferences.returnWorkspace.passwordType == 'custom') {
                        //if user choose custom password for pdf
                        $scope.pdfPasswordOption = 'customPassword';
                        $scope.passwordDetails.isCustomPassword = true;
                    } else {
                        //if user choose default password for pdf
                        $scope.pdfPasswordOption = 'defaultPassword';
                    }
                } else {
                    //if pdf is not secure with password
                    $scope.pdfPasswordOption = 'noPassword';
                }
            } else {
                //When user ask for the first time for password
                $scope.pdfPasswordOption = 'selectedForPasswordProtectePdf';
            }
        }

        $scope.signatureTypeLookup = angular.copy(systemConfig.getsignatureTypeLookup());

        var _getSignatureData = function (returnID, preparerId) {
            var getSignatureObj = { "returnId": returnID, "preparerId": preparerId };
            signatureService.signatureViewAll(getSignatureObj, true).then(function (signaturesData) {
                $scope.signatureDataListLength = 0; // default data length is 0
                $scope.signatureDataList = signaturesData;
                if ($scope.signatureDataList != undefined) {
                    $scope.signatureDataListLength = _.keys($scope.signatureDataList).length;
                }
                $scope.SignatureHandler()

            }, function (error) {
            });
        };


        //Check for privileges
        $scope.userCan = function (privilege) {
            return userService.can(privilege);
        };

        $scope.hasFeature = function (featureName) {
            return resellerService.hasFeature(featureName);
        };

        //check for License
        $scope.hasLicense = function (licenseName) {
            return userService.getLicenseValue(licenseName);
        };

        //This function will intilize data
        var _init = function () {
            if ($scope.platform == 'iPad') {
                totalLengthOfSvg = 1046791
            }
            if (data.type == 'REQ_SIGN') {
                if (data.paperOnly == true) {
                    $scope.question.questionText = 'Your return is ready. Please review it and sign Form 1040 U.S. Individual Income Tax Return and the state(s) e-file Signature Authorization if applicable. '
                } else {
                    $scope.question.questionText = 'Your return is ready. Please review it and sign Form 8879 IRS e-file Signature Authorization and the state(s) e-file Signature Authorization if applicable.'
                }
                $scope.selectedPacket = $scope.printPacket[1];
                if (data.countForRequest >= 1) {
                    $scope.question.questionText = 'Your tax preparer made changes to your return. Please review it again and enter your signature.'
                }
            } else if (data.type == 'REVIEW_SIGN') {
                $scope.question.questionText = 'Your return is ready. Please review it and provide your feedback.'
                $scope.selectedPacket = $scope.printPacket[1];
                if (data.countForReview >= 1) {
                    $scope.question.questionText = 'Your tax preparer made changes to your return, please review it again.'
                }
            }

            if ($scope.hasLicense('enableSignaturePad') && $scope.hasFeature('SIGNATURE') && $scope.userCan('CAN_OPEN_SIGNATURE') && (data.preparerId != undefined || data.returnID != undefined)) {
                //call method for get signature data
                _getSignatureData(data.returnID, data.preparerId);
                $scope.isAddSignature.isChecked = true; // make this flag as true only if user have rights of signature views 
            }

            if (data.formForPreview && data.formForPreview.extendedProperties) {
                for (var whenToPrint in data.formForPreview.extendedProperties.whenToPrint) {
                    if (data.formForPreview.extendedProperties.whenToPrint[whenToPrint] == 'Default') {
                        $scope.selectedPacket = _.find($scope.printPacket, { 'value': whenToPrint });
                        break;
                    }
                }
            }

            $scope.enableLoading = true;
            //call function for analising password data
            analysisPasswordOption();

            //this function will merge api data with form data
            _mergeApiDataWithFormList();

        }
        //just call init first time
        _init();
    }])

/**
/**
 *  Controller for showing Send Return to Support dialog
 */
returnApp.controller('sendReturnToSupportDialogController', ['$scope', '$modalInstance', 'returnService', 'messageService', '$log', 'data', 'NgTableParams', '$filter', '$q', function ($scope, $modalInstance, returnService, messageService, $log, data, NgTableParams, $filter, $q) {
    //This object hold message and subject
    $scope.supportObj = {};
    $scope.delayTime = false;

    $scope.supportObj.packageName = data.packageName.toString();

    if ($scope.supportObj.packageName == "1040") {
        $scope.supportObj.firstName = data.firstName;
        $scope.supportObj.lastName = data.lastName;
    } else {
        $scope.supportObj.companyName = data.companyName;
    }

    $scope.rejectionErrorList // contains efile rejections list.
    $scope.bankRejectionErrorList; // contains bank app rejections list.
    $scope.availableERC; // contains perform review error list.
    $scope.currentEfileStatus; // contains current efile status.
    $scope.currentBankEfileStatus; // contains current bank efile status.

    $scope.isAPICall = false; // set to true when api call is in process.

    //temp show subject data 
    $scope.showSubject = [
        { "id": "Preparing Returns", "displayText": "Preparing Returns" },
        { "id": "Rejected Returns", "displayText": "Rejected Returns" },
        { "id": "Bank Products", "displayText": "Bank Products" },
        { "id": "Efile", "displayText": "Efile" },
        { "id": "Printing", "displayText": "Printing" },
        { "id": "Calculation", "displayText": "Calculation" },
        { "id": "Perform Review", "displayText": "Perform Review" },
        { "id": "Other", "displayText": "Other" }];

    //rejection grid start
    $scope.rejectionGrid = new NgTableParams({
        page: 1, // show initial page
        count: 5000,// count per page
        sorting: {
            // initial sorting
            ruleNumber: 'asc'
        }
    }, {
            total: 0, // length of data
            counts: [],
            sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
            getData: function ($defer, params) {
                if (angular.isUndefined($scope.rejectionErrorList)) {
                    _initRejectionErrorList().then(function () {
                        //Apply standard sorting
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.rejectionErrorList, params.orderBy()) : $scope.rejectionErrorList;
                        //Return Result to grid
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }, function (error) {
                        $log.error(error);
                    });
                } else {
                    //Apply standard sorting
                    var orderedData = params.sorting() ? $filter('orderBy')($scope.rejectionErrorList, params.orderBy()) : $scope.rejectionErrorList;
                    //Return Result to grid
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        });

    //bank rejection grid start
    $scope.bankRejectionGrid = new NgTableParams({
        page: 1, // show initial page
        count: 5000,// count per page
        sorting: {
            // initial sorting
            errorMessage: 'asc'
        }
    }, {
            total: 0, // length of data
            counts: [],
            sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
            getData: function ($defer, params) {
                // Request to API
                // get Data here				
                if (angular.isUndefined($scope.bankRejectionErrorList)) {
                    _initBankRejectionErrorList().then(function () {
                        //Apply standard sorting
                        var orderedData = params.sorting() ? $filter('orderBy')($scope.bankRejectionErrorList, params.orderBy()) : $scope.bankRejectionErrorList;
                        //Return Result to grid
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }, function (error) {
                        $log.error(error);
                    });
                }
                else {
                    //Apply standard sorting
                    var orderedData = params.sorting() ? $filter('orderBy')($scope.bankRejectionErrorList, params.orderBy()) : $scope.bankRejectionErrorList;
                    //Return Result to grid
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            }
        });

    // perform review error grid.
    $scope.ercGrid = new NgTableParams({
        page: 1, // show initial page
        count: 5000,
        sorting: {
            // initial sorting
            docName: 'dsc',
        }
    }, {
            total: 0, // length of data
            counts: [],
            sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
            getData: function ($defer, params) {
                // get Data here				
                if (angular.isUndefined($scope.availableERC)) {
                    _initAvailableERC();
                }

                //Apply standard sorting
                var orderedData = params.sorting() ? $filter('orderBy')($scope.availableERC, params.orderBy()) : $scope.availableERC;
                //Return Result to grid
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

    /**
     * This function will call API that return Bank Rejctions.
     */
    var _initBankRejectionErrorList = function () {
        var deferred = $q.defer();
        $scope.isAPICall = true;
        returnService.getBankRejectionErrorList(data.returnId).then(function (response) {
            //initally just blank error list 
            $scope.bankRejectionErrorList = [];
            if (!_.isUndefined(response) && response.length !== 0) {
                $scope.bankRejectionErrorList = response;
            }
            $scope.isAPICall = false;
            deferred.resolve();
        }, function (error) {
            $scope.isAPICall = false;
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    /**
     * This function will call API that return efile rejection list.
     */
    var _initRejectionErrorList = function () {
        var deferred = $q.defer();
        $scope.isAPICall = true;
        returnService.getRejectionErrorList(data.returnId).then(function (response) {
            //initally just blank error list 
            $scope.rejectionErrorList = [];
            var rejectionError = [];
            if (!_.isUndefined(response) && response.length !== 0) {
                _.forEach(response, function (rejection) {
                    _.forEach(rejection.errorList, function (error) {
                        var object = {};
                        object.errorCategory = error.errorCategory;
                        object.ruleNumber = error.ruleNumber;
                        object.severity = error.severity;
                        object.errorMessage = error.errorMessage;
                        object.dataValue = error.dataValue;
                        object.stateName = rejection.stateName.toUpperCase();
                        rejectionError.push(object);
                    });
                });
                $scope.rejectionErrorList = angular.copy(rejectionError);
            }
            $scope.isAPICall = false;
            deferred.resolve();
        }, function (error) {
            $scope.isAPICall = false;
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // Load Review Errors (ERC) from return service.
    var _initAvailableERC = function () {
        $scope.availableERC = returnService.getReviewErrors();
    };

    // this function called when user change subject.
    $scope.subjectChange = function () {
        if ($scope.supportObj.subject == "Rejected Returns") {
            var efileStatus = returnService.getEfileStatus();

            // Efile Rejctions
            _.forEach(efileStatus, function (val, key) {
                _.forEach(val, function (subType, subKey) {
                    if (subType.status == 8) {
                        $scope.currentEfileStatus = subType.status;
                    }
                    if (subType.submissionId && subType.submissionId != '') {
                        $scope.supportObj.submissionId = subType.submissionId;
                    }
                });
            });

            // Bank Rejctions
            _.forEach(efileStatus, function (val, key) {
                _.forEach(val, function (subType, subKey) {
                    if (subType.status == 14) {
                        $scope.currentBankEfileStatus = subType.status;
                    }
                    if (subType.submissionId && subType.submissionId != '') {
                        $scope.supportObj.submissionId = subType.submissionId;
                    }
                });
            });
        } else if ($scope.supportObj.subject == "Perform Review") {
            //get ERC Data
            _initAvailableERC();
            //Reload ERC Grid
            $scope.ercGrid.reload();
        }
    }

    //This function is used to send return to support
    $scope.sendReturnToSupport = function () {
        _prepareRejectionError();
        $scope.isAPICall = true;
        returnService.sendReturnToSupport($scope.supportObj).then(function () {
            //show message
            messageService.showMessage('Return Sent Successfully', 'success', 'SAVE_SENT_SUCCESS_MSG');
            $scope.isAPICall = false;
            //close dialog
            $scope.close();
        }, function (error) {
            $scope.isAPICall = false;
            $log.error(error);
        })
    }

    // This function will prepare rejection error string to send it to api.
    var _prepareRejectionError = function () {
        $scope.supportObj.rejectionErrors = "<div>";
        if ($scope.supportObj.subject == "Rejected Returns") {
            var count = 1;
            if ($scope.rejectionErrorList.length > 0 && $scope.currentEfileStatus == 8) {
                for (var i = 0; i < $scope.rejectionErrorList.length; i++) {
                    $scope.supportObj.rejectionErrors = $scope.supportObj.rejectionErrors + "(" + count + ") " + $scope.rejectionErrorList[i].errorMessage + "<br>";
                    if ($scope.rejectionErrorList[i].dataValue != undefined && $scope.rejectionErrorList[i].dataValue != '') {
                        $scope.supportObj.rejectionErrors = $scope.supportObj.rejectionErrors + "Value: " + $scope.rejectionErrorList[i].dataValue + "<br>"
                    }
                    count++;
                }
            }
            if ($scope.bankRejectionErrorList.length > 0 && $scope.currentBankEfileStatus == 14) {
                for (var i = 0; i < $scope.bankRejectionErrorList.length; i++) {
                    $scope.supportObj.rejectionErrors = $scope.supportObj.rejectionErrors + "(" + count + ") " + $scope.bankRejectionErrorList[i].errorMessage + "<br>";
                    count++;
                }
            }
        } else if ($scope.supportObj.subject == "Perform Review") {
            var count = 1;
            if ($scope.availableERC.length > 0) {
                for (var i = 0; i < $scope.availableERC.length; i++) {
                    $scope.supportObj.rejectionErrors = $scope.supportObj.rejectionErrors + "(" + count + ") " + $scope.availableERC[i].message + "<br>";
                    count++;
                }
            }
        }
        $scope.supportObj.rejectionErrors = $scope.supportObj.rejectionErrors + "</div>";
    }

    //close dialog
    $scope.close = function () {
        $modalInstance.close();
        $modalInstance.dismiss('Canceled');
    };

    // Initialization function to get submission Id if exists.
    var _init = function () {
        var efileStatus = returnService.getEfileStatus();
        // Efile Rejctions
        _.forEach(efileStatus, function (val, key) {
            _.forEach(val, function (subType, subKey) {
                if (subType.status == 8) {
                    $scope.currentEfileStatus = subType.status;
                }
                if (subType.submissionId && subType.submissionId != '') {
                    $scope.supportObj.submissionId = subType.submissionId;
                }
            });
        });

        // Bank Rejctions
        _.forEach(efileStatus, function (val, key) {
            _.forEach(val, function (subType, subKey) {
                if (subType.status == 14) {
                    $scope.currentBankEfileStatus = subType.status;
                }
                if (subType.submissionId && subType.submissionId != '') {
                    $scope.supportObj.submissionId = subType.submissionId;
                }
            });
        });
    }

    _init();
}]);

/**
 *  Controller to show dialog when user changes while return is locked and try to print return
 */
returnApp.controller('printLockedReturnMessageDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    //hold type
    $scope.printingType = data.printingType;
    //this flag will help us to focus on button
    $scope.focusMe = true;

    //close dilaog
    $scope.close = function (buttonType) {
        //return data when you close dialog
        $modalInstance.close(buttonType);
    };

}]);


/**
 *  Controller to show dialog xml
 */
returnApp.controller('showXMLDialogController', ['$scope', '$modalInstance', 'data', '$window', function ($scope, $modalInstance, data, $window) {
    $scope.xml = data.xml;
    $scope.validationError = data.validationError;

    //close dilaog
    $scope.close = function (buttonType) {
        //return data when you close dialog
        $modalInstance.close(buttonType);
    };

    $scope.collapseAccordion = function (state) {

        for (var index in $scope.states) {
            if (state.name !== $scope.states[index].name) {
                $scope.states[index].isOpen = false;
            } else {
                $scope.states[index].isOpen = !state.isOpen;
            }
        }
    }
}]);

/**
 *  Controller to show dialog when user efile return
 */
returnApp.controller('advanceEfileDialogController', ['$scope', '$modalInstance', 'data', 'returnService', 'localeService', 'dialogService', '$log', 'environment', function ($scope, $modalInstance, data, returnService, localeService, dialogService, $log, environment) {
    $scope.states = data.states;
    $scope.states[0].isOpen = true;
    $scope.efileStatus = data.efileStatus;
    $scope.selectedStates = [];
    $scope.openedAccordion = 0;
    $scope.extensionMessageConfig = {
        "4868": { value: "You are e-filing Form 4868 Application for Automatic Extension of Time To File U.S. Individual Income Tax Return." },
        "7004": { value: "You are e-filing Form 7004 Application for Automatic Extension of Time To File Certain Business Income Tax, Information, and Other Returns." },
        "8868": { value: "You are e-filing Form 8868 Application for Automatic Extension of Time To File an Exempt Organization Return." },
        "2350": { value: "You are e-filing Form 2350 Application for Extension of Time To File U.S. Income Tax Return." }
    }

    //Temporary function to differentiate features as per environment (beta/live)
    $scope.betaOnly = function () {
        if (environment.mode == 'beta' || environment.mode == 'local')
            return true;
        else
            return false;
    };

    // to set open accorion flag
    $scope.setOpenedAcordion = function (index) {
        if (index === $scope.openedAccordion) {
            $scope.openedAccordion = "";
        } else {
            $scope.openedAccordion = index;
        }
    }

    var init = function () {
        var federalAllObj = _.filter($scope.states, { 'name': 'federal' });
        if (federalAllObj != undefined) {
            var federalMainFormObj = _.find(federalAllObj, { ReturnTypeCategory: 'MainForm' });
        }
        var bankObj = _.filter($scope.states, { "ReturnTypeCategory": "BankForm" });

        if (bankObj != undefined) {
            _.forEach(bankObj, function (bank) {
                if (bank.status == 'Rejected' || bank.isPaperFiledReturn == true) {
                    bank.isDisabled = false;
                } else {
                    bank.isDisabled = true;
                }
                if ((federalMainFormObj != undefined && federalMainFormObj.status == 'Accepted' && (bank.isSelected == undefined || bank.isSelected == false) && (bank.bankSelected == 'NAVIGATOR' || bank.bankSelected == 'REFUNDADVANTAGE' || bank.bankSelected == 'EPS' || bank.bankSelected == 'TPG'))) {
                    bank.isDisabled = false;
                }
            });
        }


        if ($scope.betaOnly() == false) {
            //disable amended if main form is not accepted
            _.forEach($scope.states, function (state) {
                if (state.ReturnTypeCategory == 'AmendedForm') {
                    var statesObject = _.filter($scope.states, { 'name': state.name });
                    var mainFormObject = _.find(statesObject, { ReturnTypeCategory: 'MainForm' });
                    if (mainFormObject != undefined && mainFormObject.status != 'Accepted') {
                        state.isDisabled = true;
                    }
                }
                if (state.ReturnTypeCategory == 'ExtensionForm') {
                    var statesObject = _.filter($scope.states, { 'name': state.name });
                    var mainFormObject = _.find(statesObject, { ReturnTypeCategory: 'MainForm' });
                    if (mainFormObject != undefined && mainFormObject.status == 'Accepted') {
                        state.isDisabled = true;
                    }
                }
            });
        }
    };

    $scope.send = function () {
        var federalAllObj = _.filter($scope.states, { 'name': 'federal' });
        if (federalAllObj != undefined) {
            var federalMainFormObj = _.find(federalAllObj, { ReturnTypeCategory: 'MainForm' });
            var federalEXTFormObj = _.find(federalAllObj, { ReturnTypeCategory: 'ExtensionForm' });
        }
        if (data.taxYear <= 2017) {
            var isStateMainFormExist = false;
            if (federalMainFormObj == undefined || federalMainFormObj.isSelected != true) {
                _.forEach($scope.states, function (state) {
                    if (state.name != 'federal' && state.ReturnTypeCategory == 'MainForm' && state.isDisabled != true && state.isSelected == true) {
                        isStateMainFormExist = true
                    }
                });
            }
            if (isStateMainFormExist) {
                localeService.translate("You need to e-file for Federal main form first and then efile for the state return.").then(function (translatedText) {
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    dialogService.openDialog("notify", dialogConfiguration, translatedText);
                });
            } else {
                _getSelectedState();
            }
        } else {
            if (federalMainFormObj == undefined || federalMainFormObj.isSelected != true) {
                var dialogConfiguration = {
                    'keyboard': false,
                    'backdrop': false,
                    'size': 'sm',
                    'windowClass': 'my-class'
                };
                //check if all selected state is stateOnly
                var isAllStateOnly;
                for (var i = 0; i < $scope.states.length; i++) {
                    if ($scope.states[i].name != 'federal') {
                        if ($scope.states[i].ReturnTypeCategory == 'MainForm' && $scope.states[i].isDisabled != true && $scope.states[i].isSelected == true && $scope.states[i].stateOnly == true) {
                            isAllStateOnly = true
                        } else if ($scope.states[i].ReturnTypeCategory == 'MainForm' && $scope.states[i].isDisabled != true && $scope.states[i].isSelected == true && $scope.states[i].stateOnly != true) {
                            isAllStateOnly = false;
                            break;
                        }
                    }
                }

                if (isAllStateOnly == false) {
                    localeService.translate("Your selected state return type is not approved for stateonly.Please select only Approved state for state only efile.").then(function (translatedText) {
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        dialogService.openDialog("notify", dialogConfiguration, translatedText);
                    });
                } else {

                    if (federalEXTFormObj != undefined && federalEXTFormObj.isSelected == true && federalEXTFormObj.status != "Accepted") {
                        if ($scope.betaOnly() == true) {
                            localeService.translate($scope.extensionMessageConfig[federalEXTFormObj.ReturnTypeCode].value, 'DISPLAY_TEXT_FOR_EXTENSIONEFILE_CONFIRMATION').then(function (translateText) {
                                var dialog = dialogService.openDialog("confirm", dialogConfiguration, {
                                    text: translateText
                                });
                                dialog.result.then(function (btn) {
                                    _getSelectedState(true);
                                }, function (btn) {
                                });
                            });
                        } else {
                            _getSelectedState(true);
                        }
                    } else {
                        localeService.translate('You are e-filing an unlinked return. Only the state return will be transmitted.', 'DISPLAY_TEXT_FOR_STATEONLYEFILE_CONFIRMATION').then(function (translateText) {
                            var dialog = dialogService.openDialog("confirm", dialogConfiguration, {
                                text: translateText
                            });
                            dialog.result.then(function (btn) {
                                _getSelectedState(true);
                            }, function (btn) {

                            });
                        });
                    }
                }
            } else {
                _getSelectedState();
            }
        }


    }


    var _getSelectedState = function (addStateOnly) {
        //get selected states for efiling
        _.forEach($scope.states, function (state) {
            if (state.isSelected == true && state.status != 'Accepted' && (state.isBankSelected == true || state.isDisabled != true)) {
                $scope.selectedStates.push(state);
            }
        });
        if ($scope.selectedStates.length == 0) {
            localeService.translate("Please select return type check-box, to create efile and transmit the return(s).").then(function (translatedText) {
                var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                dialogService.openDialog("notify", dialogConfiguration, translatedText);
            });
        } else {
            $modalInstance.close({ "selectedStates": $scope.selectedStates, "stateOnly": addStateOnly ? true : false });
        }
    }


    /**
     * Selecteion for xml creation(at a time only one selection)
     */
    $scope.deSelectAll = function (returnType) {
        //get selected states for efiling
        _.forEach($scope.states, function (state) {
            if (state.ReturnTypeCode == returnType) {
                state.isSelected = true;
            } else {
                state.isSelected = false;
            }
        });
    }

    //call api to create xml
    $scope.createXML = function () {
        var selectedObject = _.find($scope.states, { "isSelected": true });
        if (selectedObject != undefined) {
            $modalInstance.close({ "selectedStates": [selectedObject] });
        } else {
            var text = localeService.translate("Please Select Return Type to Create XML.").then(function (translatedText) {
                var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                var dialog = dialogService.openDialog("notify", dialogConfiguration, translatedText);
            });
        }
    }

    /**
     * Select bank if federal is selected
     */
    $scope.selectBank = function (selectedStates) {
        var bankObj = _.filter($scope.states, { "ReturnTypeCategory": "BankForm" });
        if (bankObj != undefined && selectedStates.name == 'federal' && selectedStates.ReturnTypeCategory == 'MainForm') {
            _.forEach(bankObj, function (bank) {
                if (selectedStates.isSelected == true) {
                    bank.isBankSelected = true;
                    bank.isSelected = true;
                    bank.isDisabled = true;
                } else {
                    bank.isSelected = false;
                    bank.isDisabled = true;
                }
            });
        }
    }


    //close dilaog
    $scope.close = function (buttonType) {
        //return data when you close dialog
        $modalInstance.close(buttonType);
    };

    //call init
    init();

}]);

/**
 * This controller give the list of k1 Data that user selected to import while multiple k1-exists.
 * We are opening a dialog show a list of multiple k1 data & give the user a option to choose from
 */
returnApp.controller('k1ImportDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {

    $scope.k1List = data.data;
    $scope.ssn = data.ssn;

    //pass the selected k-1's parent controller.
    $scope.importK1Data = function () {
        $modalInstance.close($scope.k1List);
    }

    // this function called when user cancel to import k-1 data.
    $scope.close = function () {
        $modalInstance.dismiss('cancelled');
    }
}]);

returnApp.controller('nonResiWktMessageController', ['$scope', '$modalInstance', 'data', 'NgTableParams', '$log', function ($scope, $modalInstance, data, NgTableParams, $log) {

    $scope.changeFields = data.data;
    $scope.ssn = data.ssn;

    //bank rejection grid start
    $scope.changeFieldsGrid = new NgTableParams({
        page: 0,            // show first page
        total: 1,			//hide paggination
        count: $scope.changeFields.length
    }, {
            total: 0, // length of data
            counts: [],
            sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
            getData: function ($defer, params) {
                $defer.resolve($scope.changeFields.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    // this function called when user cancel to import k-1 data.
    $scope.close = function () {
        $modalInstance.dismiss('cancelled');
    }
}]);

/**
 *  Controller to restore return data by json
 */
returnApp.controller('restoreReturnDataByJsonDialogController', ['$scope', '$modalInstance', 'dialogService', 'localeService', function ($scope, $modalInstance, dialogService, localeService) {
    $scope.jsonData;
    //close dilaog
    $scope.close = function (buttonType) {
        if (buttonType == 'save') {
            try {
                $scope.jsonData = JSON.parse($scope.jsonData);
                if ($scope.jsonData != undefined && $scope.jsonData.header != undefined && $scope.jsonData.docs != undefined && $scope.jsonData.forms != undefined) {
                    //return data when you close dialog
                    $modalInstance.close({ 'jsonData': $scope.jsonData });

                } else {
                    localeService.translate("Please Enter Valid Data.").then(function (translatedText) {
                        var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                        dialogService.openDialog("notify", dialogConfiguration, translatedText);
                    });
                }
            } catch (error) {
                localeService.translate("Please Enter Valid Data.").then(function (translatedText) {
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
                    dialogService.openDialog("notify", dialogConfiguration, translatedText);
                });
            }

        } else {
            //return data when you close dialog
            $modalInstance.close(buttonType);
        }
    };

}]);
/**
 *  Controller to restore return data by json
 */
returnApp.controller('EmailAssetsDialogController', ['$scope', '$modalInstance', 'data', function ($scope, $modalInstance, data) {
    $scope.email;
    $scope.isClickOnSend = false;
    $scope.headerText = ''
    //close dilaog
    $scope.close = function () {
        //return data when you close dialog
        $modalInstance.dismiss();
    };

    $scope.sendMail = function () {
        $scope.isClickOnSend = true;
        if ($scope.emailPrintedAssets.$valid) {
            $modalInstance.close($scope.email);
        }

    }
    _init = function () {
        if (data && data.data && data.data.header) {
            if (data.data.header === 'dVehicleDeprWkt') {
                $scope.headerText = 'Vehicle Depreciation Summary';
            } else {
                $scope.headerText = 'Asset Depreciation Summary';
            }
        }
    }

    _init();
}]);