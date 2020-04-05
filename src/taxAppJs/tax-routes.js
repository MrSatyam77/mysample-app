'use strict';

var taxRoutes = angular.module('taxRoutes', ['ngRoute']);

//This configures the routes and associates each route with a view and a controller
taxRoutes.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/browsersupport', {
        // If browser not supported
        controller: 'preloadCheckController',
        templateUrl: '/taxAppJs/preloadCheck/partials/support.html'
    })
        .when('/return/edit/:id?/:efileStatus?', {
            // This is will open return for editing
            controller: 'returnController',
            templateUrl: '/taxAppJs/return/workspace/partials/returnWorkspace.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_RETURN', 'CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_CREATE_EIN', 'CAN_SAVE_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS', 'CAN_LIST_PRICELIST'] }
        }).when('/return/list/:message?', {
            template: ""
        }).when('/return/backup', {
            // This will open backup list
            controller: 'backupController',
            templateUrl: '/taxAppJs/return/backup/partials/backup.html',
            access: { requiredAuthentication: true, privileges: ['CAN_BACKUP_RETURN'] }
        })
        // .when('/return/new', {
        //     // This will open new return page
        //     controller: 'newReturnController',
        //     templateUrl: '/taxAppJs/return/new/partials/newReturn.html',
        //     access: { requiredAuthentication: true, privileges: ['CAN_CREATE_RETURN', 'CAN_LIST_RETURN', 'CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] }
        // })
        .when('/return/restore/upload', {
            // This will open new return page
            controller: 'restoreReturnUploadController',
            templateUrl: '/taxAppJs/return/restore/partials/restore-upload.html',
            access: { requiredAuthentication: true, privileges: ['CAN_RESTORE_RETURN'] }
        }).when('/return/restore/list', {
            // This will open new return page
            controller: 'restoreReturnListController',
            templateUrl: '/taxAppJs/return/restore/partials/restore-list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_RETURN', 'CAN_RESTORE_RETURN'] }
        })
        .when('/estimator', {
            // This is will open tax estimator		
            templateUrl: '/taxAppJs/estimator/partials/estimator.html'
        }).when('/registration', {
            // This is will open registration
            template: '',
        })
        .when('/manage/user/list', {
            // This is will open manageuser
            controller: 'userListController',
            templateUrl: '/taxAppJs/manage/user/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_USER'] }
        }).when('/manage/user/edit/:id?', {
            // This is will open manageuser
            controller: 'userEditController',
            templateUrl: '/taxAppJs/manage/user/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_USER', 'CAN_SAVE_USER', 'CAN_REMOVE_USER'] }
        }).when('/office/selection/:mode?', {
            template: ""
        }).when('/manage/location/list', {
            // This is will open location		
            controller: 'locationListController',
            templateUrl: '/taxAppJs/manage/location/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_LOCATION'] }
        }).when('/manage/location/edit/:id?', {
            // This is will add location	
            controller: 'locationEditController',
            templateUrl: '/taxAppJs/manage/location/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_LOCATION', 'CAN_SAVE_LOCATION', 'CAN_REMOVE_LOCATION'] }
        // }).when('/manage/role/list', {
        //     // This is will list out role
        //     controller: 'rolesListController',
        //     templateUrl: '/taxAppJs/manage/role/partials/list.html',
        //     access: { requiredAuthentication: true, privileges: ['CAN_LIST_ROLE'] }
        // }).when('/manage/role/edit/:id?', {
        //     // This is will add role
        //     controller: 'rolesEditController',
        //     templateUrl: '/taxAppJs/manage/role/partials/edit.html',
        //     access: { requiredAuthentication: true, privileges: ['CAN_OPEN_ROLE', 'CAN_CREATE_ROLE', 'CAN_SAVE_ROLE', 'CAN_REMOVE_ROLE'] }
        // })
        }).when('/manage/EIN/list', {
            // This is will list out EINS
            controller: 'EINListController',
            templateUrl: '/taxAppJs/manage/EIN/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_EIN'] }
        }).when('/manage/EIN/edit/:id?', {
            // This is will ADD EINS
            controller: 'EINEditController',
            templateUrl: '/taxAppJs/manage/EIN/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_EIN', 'CAN_SAVE_EIN', 'CAN_REMOVE_EIN'] }
        })
        .when('/return/interview/:id?', {
            controller: 'returnController',
            templateUrl: '/taxAppJs/return/interview/partials/interview.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] }
        }).when('/return/interview/:id?/rejected', {
            controller: 'returnController',
            templateUrl: '/taxAppJs/return/interview/partials/interview.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] }
        }).when('/return/interview/:id?/alerts', {
            controller: 'returnController',
            templateUrl: '/taxAppJs/return/interview/partials/interview.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] }
        }).when('/return/interview/:id?/bankRejected', {
            controller: 'returnController',
            templateUrl: '/taxAppJs/return/interview/partials/interview.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_RETURN', 'CAN_SAVE_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_INTERVIEW', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] }
        }).when('/bank/protectionPlus', {
            // This is will protectionPlus info 
            controller: 'protectionPlusController',
            templateUrl: '/taxAppJs/bank/protectionPlus/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK'] },
            featureName: "PROTECTIONPLUS"
        }).when('/bank/eps', {
            // This is will open eps info	
            controller: 'epsController',
            templateUrl: '/taxAppJs/bank/eps/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            featureName: "EPS"
        }).when('/bank/epay', {
            // This is will open eps info	
            controller: 'epsepayController',
            templateUrl: '/taxAppJs/bank/epsepay/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            featureName: "EPS_E-PAY"
        }).when('/bank/navigator', {
            // This is will navogator info  
            controller: 'atlasController',
            templateUrl: '/taxAppJs/bank/atlas/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            featureName: "NAVIGATOR",
            extendedProperties: { name: "Navigator" }
        }).when('/bank/navigator/result', {
            // This is will navigator result info  
            controller: 'atlasController',
            templateUrl: '/taxAppJs/bank/atlas/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            featureName: "NAVIGATOR",
            extendedProperties: { name: "Navigator" }
        }).when('/bank/atlas', {
            // This is will atlas info	
            controller: 'atlasController',
            templateUrl: '/taxAppJs/bank/atlas/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            featureName: "ATLAS",
            extendedProperties: { name: "Atlas" }
        }).when('/bank/atlas/result', {
            // This is will atlas info	
            controller: 'resultController',
            templateUrl: '/taxAppJs/bank/atlas/partials/result.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            extendedProperties: { name: "Atlas" }
        }).when('/bank/refundAdvantage', {
            // This is will refund advantage info	
            controller: 'refundAdvantageController',
            templateUrl: '/taxAppJs/bank/refundAdvantage/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK'] },
            featureName: "REFUNDADVANTAGE"
        }).when('/bank/tpg', {
            // This is will tpg info	
            controller: 'tpgController',
            templateUrl: '/taxAppJs/bank/tpg/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK', 'CAN_SAVE_BANK'] },
            featureName: "TPG"
        }).when('/bank/redBird', {
            // This is will redBird info	
            controller: 'redBirdController',
            templateUrl: '/taxAppJs/bank/redBird/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK'] },
            featureName: "REDBIRD"
        }).when('/bank/auditAllies', {
            // This is will auditAllies info	
            controller: 'auditAlliesController',
            templateUrl: '/taxAppJs/bank/auditAllies/partials/info.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_BANK'] },
            featureName: "AUDITALLIES"
        }).when('/manage/change/password/:option?', {
            template: ""
        }).when('/manage/preparer/list', {
            // This is will open location		
            controller: 'preparerListController',
            templateUrl: '/taxAppJs/manage/preparer/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_PREPARER'] }
        }).when('/manage/preparer/edit/:id?', {
            // This is will open location		
            controller: 'preparerEditController',
            templateUrl: '/taxAppJs/manage/preparer/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_PREPARER', 'CAN_CREATE_PREPARER', 'CAN_SAVE_PREPARER', 'CAN_REMOVE_PREPARER'] }
        }).when('/manage/clientLetter/list', {
            controller: 'clientLetterListController',
            templateUrl: '/taxAppJs/manage/clientLetter/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_CLIENTLETTER'] }
        }).when('/manage/clientLetter/edit/:id?', {
            controller: 'clientLetterController',
            templateUrl: '/taxAppJs/manage/clientLetter/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_CLIENTLETTER', 'CAN_CREATE_CLIENTLETTER', 'CAN_SAVE_CLIENTLETTER', 'CAN_REMOVE_CLIENTLETTER'] }
        }).when('/return/summary', {
            controller: 'completeSummaryController',
            templateUrl: '/taxAppJs/return/summary/partials/detailSummary.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_RETURN', 'CAN_GET_EFILE_STATUS', 'CAN_LIST_EIN', 'CAN_LIST_PREPARER', 'CAN_GET_BANK_STATUS'] }
        }).when('/eFile/list', {
            template: ""
        }).when('/eFile/list/:key', {
            template: ""
        }).when('/manage/priceList/list', {
            controller: 'priceListController',
            templateUrl: '/taxAppJs/manage/priceList/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_PRICELIST'] }
        }).when('/manage/priceList/edit', {
            controller: 'priceListEditController',
            templateUrl: '/taxAppJs/manage/priceList/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_CREATE_PRICELIST', 'CAN_REMOVE_PRICELIST', 'CAN_LIST_PRICELIST'] }
        }).when('/manage/priceList/edit/:id?', {
            controller: 'priceListEditController',
            templateUrl: '/taxAppJs/manage/priceList/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_PRICELIST', 'CAN_SAVE_PRICELIST', 'CAN_REMOVE_PRICELIST', 'CAN_LIST_PRICELIST'] }
        }).when('/manage/clientOrganizer/edit/:id?', {
            controller: 'clientOrganizerEditController',
            templateUrl: '/taxAppJs/manage/clientOrganizer/partials/edit.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_CLIENTORGANIZER', 'CAN_CREATE_CLIENTORGANIZER', 'CAN_SAVE_CLIENTORGANIZER', 'CAN_REMOVE_CLIENTORGANIZER'] }
        }).when('/manage/clientOrganizer/list', {
            controller: 'clientOrganizerListController',
            templateUrl: '/taxAppJs/manage/clientOrganizer/partials/list.html',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_CLIENTORGANIZER'] }
        }).when('/manage/clientOrganizer/print', {
            controller: 'clientOrganizerPrintController',
            templateUrl: '/taxAppJs/manage/clientOrganizer/partials/print.html',
            access: { requiredAuthentication: true, privileges: ['CAN_PRINT_CLIENTORGANIZER'] }
        }).when('/manage/printPackets', {
            controller: 'printPacketsConfigurationController',
            templateUrl: '/taxAppJs/manage/printPacketsConfiguration/partials/printPacketsConfiguration.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_PRINTSET'] }
        }).when('/manage/printPackets/:rightModel', {
            controller: 'printPacketsConfigurationController',
            templateUrl: '/taxAppJs/manage/printPacketsConfiguration/partials/printPacketsConfiguration.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_PRINTSET'] }
        }).when('/manage/printPackets/:rightModel/:locationId', {
            controller: 'printPacketsConfigurationController',
            templateUrl: '/taxAppJs/manage/printPacketsConfiguration/partials/printPacketsConfiguration.html',
            access: { requiredAuthentication: true, privileges: ['CAN_OPEN_PRINTSET'] }
        }).when('/manage/templates/:key?', {
            controller: 'templatesController',
            templateUrl: '/taxAppJs/manage/templates/partials/templates.html',
            access: { requiredAuthentication: true }
        })
        .when('/conversion/new', {
            templateUrl: '/taxAppJs/conversion/partials/conversion.html',
            controller: 'conversionEditController',
            access: { requiredAuthentication: true, privileges: ['CAN_DO_CONVERSION'] }
        }).when('/conversion/list', {
            templateUrl: '/taxAppJs/conversion/partials/list.html',
            controller: 'conversionListController',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_CONVERSION'] }
        }).when('/manage/support/email', {
            template: ""
        }).when('/manage/support/email/:subject/:message?', {
            template: ""
        }).when('/tryitnow', {
            templateUrl: '/taxAppJs/auth/tryItNow/partials/tryItNow.html',
            controller: 'tryItNowController',
            access: { requiredAuthentication: false }
        }).when('/report/view/:id?', {
            controller: 'reportViewerController',
            templateUrl: '/taxAppJs/report/partials/view.html',
            access: { requiredAuthentication: true, privileges: ['CAN_VIEW_REPORT'] }
        }).when('/redirect/:url?', {
            controller: 'redirectController',
            templateUrl: '/taxAppJs/common/redirect/partials/redirect.html',
            access: { requiredAuthentication: true }
        }).when('/manage/preferences/change/:tabName?/:userId?', {
            controller: 'preferencesController',
            controllerAs: 'vm',
            templateUrl: '/taxAppJs/manage/setup/partials/preferences.html',
            access: { requiredAuthentication: true }
        }).when('/return/customTemplate/list/', {
            // This will open custom template list
            templateUrl: '/taxAppJs/return/customTemplate/partials/customTemplate.html',
            controller: 'customReturnTemplateListController',
            access: { requiredAuthentication: true, privileges: ['CAN_LIST_TEMPLATE'] }
        }).when('/checkHealth', {
            // If browser not supported
            controller: 'healthCheckController',
            templateUrl: '/taxAppJs/preloadCheck/partials/checkHealth.html'
        }).when("/calendar", {
            template: ""
        }).when("/calendar/appointment", {
            template: ""
        }).when("/calendar/appointment/edit/:option?", {
            template: ""
        }).when("/role/list",{
            template: ""
        }).when("/role/edit/:option?",{
            template:""
        }).when('/login', {
            template: ""
        }).when('/logout', {
            template: ""
        }).when('/design/ui-controls', {
            template: ""
        }).when('/design/page-design', {
            template: ""
        }).when('/design/layout-design', {
            template: ""
        }).when('/ratings/your-experience', {
            template: ""
        }).when('/proforma/list', {
            template: ""
        }).when('/proforma/new', {
            template: ""
        }).when('/signature/list', {
            template: ""
        }).when('/home', {
            template: ""
        }).when('/home/settings/:rightModel', {
            template: ""
        }).when('/home/settings/:rightModel/:locationId', {
            template: ""
        }).when('/instantFormView/authorizeDevice', {
            template: ""
        }).when('/instantFormView/trustedDeviceList', {
            template: ""
        }).when('/instantFormView/device-list', {
            template: ""
        }).when('/instantFormView/preview', {
            template: ""
        }).when("/office/overview", {
            template: ""
        }).when("/office/settings", {
            template: ""
        }).when("/preferences-demo", {
            template: ""
        }).when("/conversionnew", {
            template: ""
        }).when("/conversionnew/new", {
            template: ""
        }).when("/preferences/:screen/:option?", {
            template: ""
        }).when("/eFile/approved/list", {
            template: ""
        }).when("/alert/allowedFeature", {
            template: ""
        }).when("/alert/privilegesInfo", {
            template: ""
        }).when("/alert/licenseInfo", {
            template: ""
        }).when("/calendar", {
            template: ""
        }).when("/calendar/appointment/edit/:option?", {
            template: ""
        }).when('/return/new', {
            template: ""
        }).when("/return/restore-backup/:key?", {
            template: ""
        }).when("/mytaxportal/settings", {
            template: ""
        }).when("/mytaxportal/manage-invited-clients", {
            template: ""
        }).when("/mytaxportal/invite-clients", {
            template: ""
        }).when("/mytaxportal/questionsset", {
            template: ""
        }).when("/mytaxportal/questionsset/:Id", {
            template: ""
        }).when("/reporting/view/:reportName", {
            template: ""
        }).when("/reports/view/:reportId", {
            template: ""
        }).when("/reports/custom/edit/:reportId", {
            template: ""
        }).when("/reports/list", {
            template: ""
        })
        .otherwise({
            //If user try to open url that is not registered here. It will be redirected to login page. 
            //Note:If user is already logged in then he/she will be redirected to homepage
            redirectTo: "/login"
        });
}]);
