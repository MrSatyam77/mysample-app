"use strict";
var clientPortalSignatureVerificationDialog = angular.module('clientPortalSignatureVerificationDialog', []);

// CLIENT PORTAL VERIFICATION DIALOG
clientPortalSignatureVerificationDialog.controller('clientPortalSignatureVerification', ['$scope', '$modalInstance', 'data', 'messageService', 'clientPortalWidgetService', 'signatureService', 'systemConfig', 'returnService', '$rootScope', function ($scope, $modalInstance, data, messageService, clientPortalWidgetService, signatureService, systemConfig, returnService, $rootScope) {
    $scope.signatureData = data.signatureData;
    $scope.type = data.type;
    var id = data.id;
    $scope.allSignatureRelatedDetails = {};
    //to hold active tab
    $scope.activeTab = {};

    // to hold csr document key
    var signatureCaptureAuthorizationID = '' 
    $scope.signatureDataList = []
    $scope.signatureTypeLookup = angular.copy(systemConfig.getsignatureTypeLookup());
    /*
    *  Close of dialog should not stop process of add form 
    */
    $scope.close = function () {
        $modalInstance.dismiss('Canceled');
    };

    var _init = function () {
        clientPortalWidgetService.getSignatureVerifiedData({ id: $scope.signatureData.id, type: $scope.type }).then(function (response) {
            $scope.allSignatureRelatedDetails = response;
            if (angular.isDefined($scope.allSignatureRelatedDetails)) {
                signatureCaptureAuthorizationID = $scope.allSignatureRelatedDetails.csrKey;
                switch ($scope.allSignatureRelatedDetails.returnDetails) {
                    case 'taxpayer':
                        $scope.activeTab.taxpayer = true;
                        break;
                    case 'spouse':
                        $scope.activeTab.spouse = true;
                        break;
                    default:
                        $scope.activeTab.taxpayer = true;
                };
            }
        });
    }

    // to approve Signature Verified Data 
    $scope.statusOfSignatureData = function (status) {
        var object = {
            'clientId': $scope.allSignatureRelatedDetails.clientId,
            'ssn': $scope.allSignatureRelatedDetails.ssn,
            'id': id,
            'isApproved': status,
            'csrKey': $scope.allSignatureRelatedDetails.csrKey
        }
        clientPortalWidgetService.statusOfSignatureVerifiedData(object).then(function (response) {
            if (!_.isUndefined(response)) {
                if (status === true) {
                    messageService.showMessage('Signature approved successfully.', 'success', 'SUCCESS_MSG');
                } else {
                    returnService.signatureUnLock().then(function(res) {
                        $rootScope.$broadcast('SignunlockForm', {});
                        messageService.showMessage('Signature rejected successfully.', 'success', 'SUCCESS_MSG');
                    }, function(error) {
                        messageService.showMessage('Failed to Rejected', 'error');
                    })
                    
                }
                $modalInstance.close(status);
            }
        });
    }

        //when user click on approve signature 
        $scope.approve = function (status) {
            //prepare object for signature approve 
            var signatureDataList = [];
            _.forEach($scope.signatureDataList, function (signatureData) {
                signatureDataList.push({ "type": signatureData.type, "ID": signatureData.ID, "isApproved": true, "preparerListId": signatureData.preparerListId })
            });
            var approveSignatureObject = { "ID": signatureCaptureAuthorizationID, "signatureData": signatureDataList };
            signatureService.approveSignature(approveSignatureObject).then(function (response) {
                var signatureApproveMessage = '';
                if (signatureDataList.length > 0 && signatureDataList[0].type != undefined) {
                    if (signatureDataList[0].type == 3 || signatureDataList[0].type == 4) {
                        signatureApproveMessage = $scope.signatureTypeLookup[3].displayText + " ";
                    }
                    else {
                        signatureApproveMessage = $scope.signatureTypeLookup[signatureDataList[0].type].displayText + " ";
                    }
                }
                $scope.statusOfSignatureData(status)
                //messageService show message 
                messageService.showMessage(signatureApproveMessage + ' signature added successfully', 'success', 'SIGN_APPROVE_SUCCESS');
            }, function (error) {
                $log.error(error);
            });
        };

        $scope.getCaptureAuthorization = function (status) {
            if(status == true) {
                signatureService.getCaptureAuthorization({ "ID": signatureCaptureAuthorizationID }).then(function (response) {
                    if (response.data != undefined && response.data.isSignatureUploaded != undefined && response.data.isSignatureUploaded == true) {
                        $scope.signatureDataList = response.data.signatureData;
                        $scope.approve(status);
                    }
                }, function (error) {
                });
            } else {
                $scope.statusOfSignatureData(status);
            }
            
        };

    $scope.download = function (pdfLink) {
        clientPortalWidgetService.downloadReturnDocument(pdfLink).then(function (response) {
            if (response) {
                var a = document.createElement('a');
                var byteArray = new Uint8Array(response.data.data);
                var file = new Blob([byteArray], { type: 'application/pdf' });
                var fileURL = window.URL.createObjectURL(file);
                a.href = fileURL;
                a.download = $scope.allSignatureRelatedDetails.returnPdf.fileName;
                a.click();
            }
        }, function (error) {
            console.error(error);
        })
    }



    _init();
}]);

