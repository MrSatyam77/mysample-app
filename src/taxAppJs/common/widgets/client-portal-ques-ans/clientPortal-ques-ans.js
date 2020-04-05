"use strict";
var clientPortalQuesAnsWidget = angular.module('clientPortalQuesAnsWidget', []);

clientPortalQuesAnsWidget.directive('clientPortalQuesAns', [function () {
    return {
        restrict: 'AE',
        templateUrl: 'taxAppJs/common/widgets/client-portal-ques-ans/partials/clientPortal-ques-ans.html',
        controller: ['$scope', '$rootScope', '$interval', '$location', '$log', '$timeout', '_', 'clientPortalWidgetService', 'userService', 'returnService', 'dialogService', 'environment', function ($scope, $rootScope, $interval, $location, $log, $timeout, _, clientPortalWidgetService, userService, returnService, dialogService, environment) {
          
          
            var markAsRead = false;

            $scope.download = function (docId) {
                clientPortalWidgetService.downloadDocument(docId).then(function (response) {
                    if (response) {
                        var blob = b64toBlob(response.base64Data, response.contentType);
                        var dlink = document.createElement('a');
                        dlink.download = response.fileName;
                        dlink.href = URL.createObjectURL(blob);
                        dlink.onclick = function (e) {
                            // revokeObjectURL needs a delay to work properly
                            var that = this;
                            setTimeout(function () {
                                window.URL.revokeObjectURL(that.href);
                            }, 1000);
                        };
                        dlink.click();
                        dlink.remove();
                    }
                }, function (error) {
                    console.error(error);
                })
            }


            $scope.downloadQuestionDocuments = function (clientId, questionId) {
                clientPortalWidgetService.downloadQuestionDocuments({ clientId: clientId, questionId: questionId }).then(function (result) {
                    if (result && result.file) {
                        var byteArray = new Uint8Array(result.file.data);
                        var blob = new Blob([byteArray], { type: result.contentType });
                        var a = window.document.createElement('a');
                        a.href = window.URL.createObjectURL(blob);
                        a.download = result.fileName;
                        // Append anchor to body.
                        // document.body.appendChild(a)
                        a.click();
                    } else {

                    }
                });
            }

            //Function to differentiate features as per environment (beta/live)
            $scope.betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            };

            // Convert base64file to blob
            var b64toBlob = function (b64Data, contentType) {
                contentType = contentType || '';
                var sliceSize = 512;
                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);
                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    var byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }

            $scope.getQuesAnsForReturnBySSN = function () {
                $scope.details = returnService.getTaxReturnSSNAndEmail()
                if (Object.keys($scope.details).length > 0 && $scope.details.ssn) {
                    clientPortalWidgetService.getQuesAnsForReturnBySSN($scope.details).then(function (response) {
                        if (response && response.answers && response.answers.length > 0) {
                            $scope.clientId = response.clientId;
                            $scope.sixthRefreshStart = false;
                            $scope.questionDetails = response;
                            $scope.calculateRatio();
                            changeMessageText();
                        } else {
                            $scope.clientId = undefined;
                            $scope.questionDetails = {};
                            clientPortalWidgetService.getPortalTrainingData('clientPortal', 'inviteClients').then(function (data) {
                                $scope.clienthelp = data;
                                $scope.sixthRefreshStart = false;
                            }, function (error) {
                                $scope.sixthRefreshStart = false;
                            })
                        }
                        _checkDownloadAllAvailable();
                    }, function (error) {
                        $scope.sixthRefreshStart = false;
                        console.error(error);
                    })
                } else {
                    $scope.sixthRefreshStart = false;
                }
            }


            var _checkDownloadAllAvailable = function () {
                $scope.downloadAllAvailable = false;
                if ($scope.questionDetails.answers && $scope.questionDetails.answers.length > 0) {
                    for (var index in $scope.questionDetails.answers) {
                        if ($scope.questionDetails.answers[index].answer && $scope.questionDetails.answers[index].answer.documents && $scope.questionDetails.answers[index].answer.documents.length > 0) {
                            $scope.downloadAllAvailable = true;
                        }
                    }
                }
            }

            // Mark as Viewed
            $scope.markQuestionReqViewed = function () {
                // if (!markAsRead) {
                    $scope.details = returnService.getTaxReturnSSNAndEmail();
                    if (Object.keys($scope.details).length > 0 && $scope.details.ssn) {
                        clientPortalWidgetService.markViewed($scope.details).then(function (response) {
                            // markAsRead = response;
                        });
                    }
                // }
            }


            $scope.calculateRatio = function () {
                $scope.ratio = 0;
                if ($scope.questionDetails['answers'] && $scope.questionDetails['answers'].length > 0) {
                    var answers = _.filter($scope.questionDetails['answers'], function (t) { return t.isAnswered }).length;
                    $scope.ratio = Math.round((((100 * answers) / $scope.questionDetails['answers'].length)).toFixed(2)) + '%';
                } else {
                    $scope.ratio = 0;
                }
                // this.cdr.detectChanges();
            }

            $scope.openSignatureVerificationDialog = function (signatureData, id, type) {
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' }, "taxAppJs/common/widgets/client-portal-ques-ans/dialogs/signature-verification.html", "clientPortalSignatureVerification", { signatureData: signatureData, type: type, id: id });
                dialog.result.then(function (response) {
                    if (!_.isUndefined(response)) {
                        $scope.getQuesAnsForReturnBySSN();
                    }
                });
            }

            // History
            $scope.historyQuestion = function (history) {
                var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' }, "taxAppJs/common/partials/clientPortalHistoryDialog.html", "clientPortalQuestionHistoryDialog", { history: history });
                dialog.result.then(function (response) { });
            }

            $scope.$on("refreshMyTaxPortal", function () {
                $scope.getQuesAnsForReturnBySSN();
            });

            var changeMessageText = function () {
                var questionDetailsData = $scope.questionDetails;
                var dataOfRemoteReview = { countForReview: 0, countForRequest: 0 }
                for (var i = 0; i < questionDetailsData.answers.length; i++) {
                    if (questionDetailsData.answers[i].type == 'REVIEW_SIGN') {
                        dataOfRemoteReview.countForReview++;
                    }
                    if (questionDetailsData.answers[i].type == 'REQ_SIGN') {
                        dataOfRemoteReview.countForRequest++;
                    }
                }
                $rootScope.$broadcast('getRemoteReviewSignature', dataOfRemoteReview);
            }


            $scope.getQuesAnsForReturnBySSN();
        }]
    };
}]);



//Service 
clientPortalQuesAnsWidget.factory('clientPortalWidgetService', ['$q', '$log', '$http', 'dataAPI', '$templateCache', function ($q, $log, $http, dataAPI, $templateCache) {
    var clientPortalQuesAnsService = {};
    /*get all available list for ques ans by ssn  */
    clientPortalQuesAnsService.getQuesAnsForReturnBySSN = function (returnDetails) {

        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientPortal/getClientQuestions',
            data: returnDetails
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    clientPortalQuesAnsService.getPortalTrainingData = function (moduleName, mode, currentForm, field, isManuallyRefresh) {
        //here we are just check its manually refresh call remove method just remove that url from cache;
        if (isManuallyRefresh == true) {
            var URL = encodeURI(dataAPI.base_url + '/training/get?currentForm=' + currentForm + '&field=' + field + '&mode=' + mode + '&module=' + moduleName);
            $templateCache.remove(URL);
        }
        var deferred = $q.defer();
        //load list from data api
        if (!_.isUndefined(moduleName) && !_.isUndefined(mode)) {
            $http({
                method: 'GET',
                url: dataAPI.base_url + '/training/get',
                cache: $templateCache,
                params: {
                    'module': moduleName,
                    'mode': mode,
                    'currentForm': currentForm,
                    'field': field
                }
            }).then(function (response) {
                deferred.resolve(response.data.data);
            }, function (error) {
                $log.error(error);
                deferred.reject(error);
            });

        }

        return deferred.promise;
    };

    clientPortalQuesAnsService.downloadDocument = function (docId) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientPortal/getUploadedDocument',
            data: { 'docId': docId }
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    clientPortalQuesAnsService.getSignatureVerifiedData = function (data) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientPortal/signature/verify',
            data: data
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // approve/reject Signature Verified Data
    clientPortalQuesAnsService.statusOfSignatureVerifiedData = function (data) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/clientPortal/signature/status',
            data: data
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    // download pdf
    clientPortalQuesAnsService.downloadReturnDocument = function (pdfLink) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'GET',
            url: dataAPI.base_url + '/clientPortal/returnPdfDownload/' + pdfLink,
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };


    clientPortalQuesAnsService.downloadQuestionDocuments = function (data) {
        var deferred = $q.defer();
        //load list from data api
        $http({
            method: 'POST',
            url: dataAPI.base_url + '/questions/document/download',
            data: data
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (error) {
            $log.error(error);
            deferred.reject(error);
        });
        return deferred.promise;
    };

    clientPortalQuesAnsService.markViewed = function (data) {
        var deffered = $q.defer();
        $http({
            method: "post",
            url: dataAPI.base_url + "/clientPortal/request/viewed",
            data: data
        }).then(function (response) {
            if (response.data) {
                deffered.resolve(response.data.data);
            }
        }, function (error) {
            console.log(error);
            deffered.reject(error);
        });
        return deffered.promise;
    }


    return clientPortalQuesAnsService;
}]);
