"use strict";
// generated directive


angular.module('returnApp').directive('t0001', ['contentService', function (contentService) {
    //	PANEL_HEADER
    return {
        restrict: 'E',
        scope: {
            rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0001')
    };
}]);

angular.module('returnApp').directive('t0002', ['contentService', function (contentService) {
    //	ONE_LINE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0002')
    };
}]);

angular.module('returnApp').directive('parentFormDisplayLine', ['contentService', function (contentService) {
    //	ONE_LINE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('parentFormDisplay')
    };
}]);

angular.module('returnApp').directive('t4742', ['contentService', function (contentService) {
    //	Vehicle_Depreciation_Wkt_LBL_INFO
    // ONE_LINE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t4742')
    };
}]);

angular.module('returnApp').directive('t0002n', ['contentService', function (contentService) {
    //	ONE_LINE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0002n')
    };
}]);

angular.module('returnApp').directive('t0003', ['contentService', function (contentService) {
    //	ONE_LINE_R_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0003')
    };
}]);

angular.module('returnApp').directive('t0004', ['contentService', function (contentService) {
    //	ONE_LINE_L_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0004')
    };
}]);

angular.module('returnApp').directive('t0005', ['contentService', function (contentService) {
    //	ONE_LINE_R_YN
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field', value1: '@', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0005')
    };
}]);

angular.module('returnApp').directive('t0006', ['contentService', function (contentService) {
    //	ONE_LINE_LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0006')
    };
}]);

angular.module('returnApp').directive('t0007', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0007')
    };
}]);

angular.module('returnApp').directive('t0008', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0008')
    };
}]);

angular.module('returnApp').directive('t0009', ['contentService', function (contentService) {
    //	ONE_LINE_3INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0009')
    };
}]);

angular.module('returnApp').directive('t0011', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_4TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0011')
    };
}]);

angular.module('returnApp').directive('t0012', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0012')
    };
}]);

angular.module('returnApp').directive('t0013', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0013')
    };
}]);

angular.module('returnApp').directive('t0014', ['contentService', function (contentService) {
    //	TWO_LINE_2TXT_2LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0014')
    };
}]);

angular.module('returnApp').directive('t0015', ['contentService', function (contentService) {
    //	ONE_LINE_TXTLBL
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0015')
    };
}]);

angular.module('returnApp').directive('t0016', ['contentService', function (contentService) {
    //	TWO_LINE_YN
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value11: '@', value12: '@', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0016')
    };
}]);

angular.module('returnApp').directive('t0017', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTINFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0017')
    };
}]);

angular.module('returnApp').directive('invoiceHeader', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTINFO - Different Header style for Invoice form
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('invoiceHeader')
    };
}]);

angular.module('returnApp').directive('t0018', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0018')
    };
}]);

angular.module('returnApp').directive('t0020', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0020')
    };
}]);

angular.module('returnApp').directive('t0021', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0021')
    };
}]);

angular.module('returnApp').directive('t0022', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0022')
    };
}]);

angular.module('returnApp').directive('t0023', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0023')
    };
}]);

angular.module('returnApp').directive('t0024', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0024')
    };
}]);

angular.module('returnApp').directive('t0025', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0025')
    };
}]);

angular.module('returnApp').directive('t0026', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0026')
    };
}]);

angular.module('returnApp').directive('t0027', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0027')
    };
}]);

angular.module('returnApp').directive('t0028', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0028')
    };
}]);

angular.module('returnApp').directive('t0029', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0029')
    };
}]);

angular.module('returnApp').directive('t0030', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0030')
    };
}]);

angular.module('returnApp').directive('t0031', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0031')
    };
}]);

angular.module('returnApp').directive('t0032', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_Tbl
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0032')
    };
}]);

angular.module('returnApp').directive('t0034', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1_3
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0034')
    };
}]);

angular.module('returnApp').directive('t0035', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_2_4
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0035')
    };
}]);

angular.module('returnApp').directive('t0036', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0036')
    };
}]);

angular.module('returnApp').directive('t2342', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1name', field2: '=', field2name: '@field2name', field3: '=', field3name: '@field3name', field4: '=', field4name: '@field4name'
        },
        templateUrl: contentService.getLineTemplateUrl('t2342')
    };
}]);

angular.module('returnApp').directive('t2347', ['contentService', function (contentService) {
    //	FOREIGN_ADDRESS_INNER
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1name', field2: '=', field2name: '@field2name', field3: '=', field3name: '@field3name', field4: '=', field4name: '@field4name', field5: '=', field5name: '@field5name'
        },
        templateUrl: contentService.getLineTemplateUrl('t2347')
    };
}]);

angular.module('returnApp').directive('t0037', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0037')
    };
}]);

angular.module('returnApp').directive('t0038', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_CHK_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0038')
    };
}]);

angular.module('returnApp').directive('t0039', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0039')
    };
}]);

angular.module('returnApp').directive('t0040', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0040')
    };
}]);

angular.module('returnApp').directive('t0041', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0041')
    };
}]);

angular.module('returnApp').directive('t0042', ['contentService', function (contentService) {
    //	ONE_LINE_9TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0042')
    };
}]);

angular.module('returnApp').directive('t0043', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0043')
    };
}]);

angular.module('returnApp').directive('t0044', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0044')
    };
}]);

angular.module('returnApp').directive('t0045', ['contentService', function (contentService) {
    //	ONE_LINE_9TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0045')
    };
}]);

angular.module('returnApp').directive('t0046', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0046')
    };
}]);

angular.module('returnApp').directive('t0047', ['contentService', function (contentService) {
    //	ONE_LINE_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0047')
    };
}]);

angular.module('returnApp').directive('t0048', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_CHK_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0048')
    };
}]);

angular.module('returnApp').directive('t0050', ['contentService', function (contentService) {
    //	ONE_LINE_11TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0050')
    };
}]);

angular.module('returnApp').directive('t0051', ['contentService', function (contentService) {
    //	ONE_LINE_11TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t0051')
    };
}]);

angular.module('returnApp').directive('t0052', ['contentService', function (contentService) {
    //	ONE_LINE_12TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0052')
    };
}]);

angular.module('returnApp').directive('t0053', ['contentService', function (contentService) {
    //	ONE_LINE_12TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t0053')
    };
}]);

angular.module('returnApp').directive('t0054', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_4CHK_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t0054')
    };
}]);

angular.module('returnApp').directive('t0055', ['contentService', function (contentService) {
    //	ONE_LINE_3CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0055')
    };
}]);

angular.module('returnApp').directive('t0056', ['contentService', function (contentService) {
    //	2CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno1: '@', rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0056')
    };
}]);

angular.module('returnApp').directive('t0057', ['contentService', function (contentService) {
    //	4CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno1: '@', rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2', lineno3: '@', rkey3: '@', field3: '=', field3name: '@field3', lineno4: '@', rkey4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0057')
    };
}]);

angular.module('returnApp').directive('t0058', ['contentService', function (contentService) {
    //	5CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0058')
    };
}]);

angular.module('returnApp').directive('t0059', ['contentService', function (contentService) {
    //	6CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0059')
    };
}]);

angular.module('returnApp').directive('t0060', ['contentService', function (contentService) {
    //	FINANCETRANSACTION
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', value15: '@', field16: '=', field16name: '@field16', value16: '@', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', value20: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0060')
    };
}]);

angular.module('returnApp').directive('t0061', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_2TXT_F
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0061')
    };
}]);

angular.module('returnApp').directive('t0062', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0062')
    };
}]);

angular.module('returnApp').directive('t0063', ['contentService', function (contentService) {
    //	ONE_LINE_R_2CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0063')
    };
}]);

angular.module('returnApp').directive('t0064', ['contentService', function (contentService) {
    //	ONE_LINE_R_4CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0064')
    };
}]);

angular.module('returnApp').directive('t0065', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_G_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0065')
    };
}]);

angular.module('returnApp').directive('t0066', ['contentService', function (contentService) {
    //	ONE_LINE_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t0066')
    };
}]);

angular.module('returnApp').directive('clientLetterSelection', ['contentService', function (contentService) {
    //	ONE_LINE_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('clientLetterSelection')
    };
}]);

angular.module('returnApp').directive('priceList', ['$filter', '$log', 'contentService', 'returnService', 'NgTableParams', 'priceListService', 'userService', 'environment', function ($filter, $log, contentService, returnService, NgTableParams, priceListService, userService, environment) {
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', field1: '='
        },
        link: function (scope, element, attrs) {
            //Flag is used to preserve old values in case of selected pricelist.
            var isInitialCall = false;
            var dPriceList = scope.$parent.dPriceList || scope.$parent.$parent.dPriceList;
            var wholePriceListData = undefined;

            //Temporary function to differentiate features as per environment (beta/live)
            var betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            }

            // IF price list is selected then assign it in scope.
            if (angular.isDefined(scope.field1)) {
                scope.selectedPrice = scope.field1;
                //If dPriceList (doc of invoice form) has refreshOnLoad property as true then allow to refresh form price grid.
                //By default grid will not refresh on load other wise whenever user will open this form , grdi will be refresh and this is just waste of computation
                if (angular.isDefined(dPriceList) && angular.isDefined(dPriceList.refreshOnLoad)) {
                    delete dPriceList.refreshOnLoad;
                    isInitialCall = false;
                } else {
                    isInitialCall = true;
                }

            }

            if (isInitialCall == false) {
                priceListService.getPriceList(scope.selectedPrice).then(function (response) {
                    wholePriceListData = JSON.parse(JSON.stringify(response));
                    // IF list's form match with scope's form then we push amount in scope's form.
                    _.forEach(response.priceListData.forms, function (obj) {
                        _.forEach(scope.forms, function (form) {
                            if (form.docName == obj.docName) {
                                form.amount = obj.amount;
                                form.charge = form.count * form.amount;
                                //If NaN then convert to 0
                                if (isNaN(form.charge) == true) {
                                    form.charge = 0;
                                }
                            }
                        });
                    });
                    scope.formPriceListGrid.reload();
                    scope.services = response.priceListData.services;

                    //comment as per mantis ticket change request  20231
                    /*  _.forEach(scope.services, function (service) {
                        service.isSelected = true;
                    });  */

                    // We need to emit total amounts
                    scope.updateServiceTotal();
                    scope.updateFormTotal();
                }, function (error) {
                    $log.error(error);
                });

            }

            // Note: we have to watch dropdown change because ng-change event scope not available due to templating        	
            scope.$watch("selectedPrice", function (newValue, oldValue) {
                if (angular.isDefined(scope.selectedPrice) && scope.selectedPrice != null && scope.selectedPrice != '') {
                    scope.field1 = scope.selectedPrice;
                    if (newValue !== oldValue) {
                        //Get list
                        priceListService.getPriceList(scope.selectedPrice).then(function (response) {
                            wholePriceListData = JSON.parse(JSON.stringify(response));
                            // IF list's form match with scope's form then we push amount in scope's form.
                            _.forEach(response.priceListData.forms, function (obj) {
                                _.forEach(scope.forms, function (form) {
                                    if (form.docName == obj.docName) {
                                        form.amount = obj.amount;
                                        form.charge = form.count * form.amount;
                                        //If NaN then convert to 0
                                        if (isNaN(form.charge) == true) {
                                            form.charge = 0;
                                        }
                                    }
                                });
                            });
                            scope.formPriceListGrid.reload();
                            scope.services = response.priceListData.services;

                            //comment as per mantis ticket change request  20231
                            /*  _.forEach(scope.services, function (service) {
                                service.isSelected = true;
                            });  */

                            // We need to emit total amounts
                            scope.updateServiceTotal(environment);
                            scope.updateFormTotal();
                        }, function (error) {
                            $log.error(error);
                        });
                    }
                } else {
                    scope.selectedPrice = "";
                    scope.field1 = "";
                    isInitialCall = false;
                }
            });


            //Check for privileges
            scope.userCan = function (privilege) {
                return userService.can(privilege);
            };

            scope.formPriceListGrid = new NgTableParams({
                count: 5000, sorting: { displayName: 'asc' }
            }, {
                    counts: [], total: 0,
                    sortingIndicator: 'div', // decides whether to show sorting indicator next to header or right side.
                    getData: function ($defer, params) {
                        if (angular.isUndefined(scope.forms)) {
                            // Get current forms
                            returnService.getForms().then(function (response) {
                                scope.forms = response;
                                var forms = [];
                                // Process form only if its not an inactive form
                                _.forEach(scope.forms, function (form) {
                                    if (form.extendedProperties.formStatus != "InActive") {
                                        // Form must be added once in list
                                        if (_.findIndex(forms, { 'docName': form.docName }) == -1) {
                                            var cnt = 0;
                                            // Get form's count 
                                            _.forEach(scope.forms, function (obj) {
                                                if (obj.extendedProperties.formStatus != "InActive") {
                                                    if (obj.docName == form.docName) {
                                                        cnt++;
                                                    }
                                                }
                                            });
                                            forms.push({ "formName": form.formName, "displayName": form.extendedProperties.displayName, "description": form.extendedProperties.description, "status": form.extendedProperties.status, "tags": form.extendedProperties.tags, "tagOrder": form.extendedProperties.tagOrder, "docIndex": form.docIndex, "docName": form.docName, "formStatus": form.extendedProperties.formStatus, "count": cnt, "amount": 0, "charge": 0, "state": form.state, "packageName": form.packageName });
                                        }
                                    }
                                });

                                // to add protection plus fee in invoice manually.
                                if (returnService.isProtctionPlusAvailable() === true && betaOnly() === true) {
                                    forms.push({ displayName: "Audit Protection Plus", count: 1, amount: 0, charge: 0, docName: "dProtectionPlus" });
                                }

                                // IF scope have price list then get it's amount and replace it into forms
                                // use case: on change of tabs we need to load old data
                                if (angular.isDefined(dPriceList.priceList) && dPriceList.priceList.length > 0) {
                                    _.forEach(forms, function (form) {
                                        _.forEach(dPriceList.priceList, function (obj) {
                                            if (form.docName == obj.docName) {
                                                if (angular.isDefined(obj.amount) && obj.amount != "") {
                                                    // To avoid NaN we parse amount to integer
                                                    // Remove this code once we have amount field in price list edit screen
                                                    try {
                                                        var amt = parseInt(obj.amount);
                                                        form.amount = amt;
                                                        form.charge = form.count * form.amount;
                                                    } catch (e) {
                                                        form.charge = 0;
                                                    }
                                                } else {
                                                    form.charge = 0;
                                                }
                                            }
                                        });
                                    });
                                }

                                // Load services if already defined
                                // use case: on change of tabs we need to load old data
                                if (angular.isDefined(dPriceList.services) && dPriceList.services.length > 0) {
                                    scope.services = dPriceList.services;
                                }

                                scope.forms = forms;
                                scope.updateServiceTotal();
                                scope.updateFormTotal();
                                var orderedData = params.sorting() ? $filter('orderBy')(scope.forms, params.orderBy()) : filteredData;
                                params.total(orderedData.length);
                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }, function (error) {

                            });
                        } else {
                            var filteredData = scope.forms;
                            var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                            params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    }
                });

            //  change total amount on blur of form's amount text box
            scope.updateFormTotal = function () {
                dPriceList.priceList = scope.forms;
                var formTotal = 0;
                _.forEach(scope.forms, function (form) {
                    if (angular.isDefined(form.charge) && form.charge != "") {
                        // To avoid NaN we parse amount to integer
                        // Remove this code once we have amount field in text box
                        try {
                            var amt = parseFloat(form.charge);
                            if (amt > -1) {
                                formTotal = parseFloat(formTotal + amt);
                            }
                        } catch (e) {

                        }
                    }
                });
                scope.$parent.$emit('postTaxFieldChange', 'dPriceList.TotalFormCharge', { 'value': formTotal, 'isCalculated': true });
            };

            //  change total amount on blur of services's amount text box
            scope.updateServiceTotal = function (isUpdatedFromUi) {
                var serviceTotal = 0;
                dPriceList.services = scope.services;
                _.forEach(scope.services, function (service) {
                    if (angular.isDefined(service.isSelected) && service.isSelected == true && angular.isDefined(service.amount) && service.amount != "") {
                        // To avoid NaN we parse amount to integer
                        // Remove this code once we have amount field in text box
                        try {
                            var amt = parseInt(service.amount);
                            if (amt > -1) {
                                serviceTotal = serviceTotal + amt;
                            }
                        } catch (e) {

                        }
                    }

                });
                scope.$parent.$emit('postTaxFieldChange', 'dPriceList.ServicesCharges', { 'value': serviceTotal, 'isCalculated': true });
                if (isUpdatedFromUi && !_.isUndefined(wholePriceListData)) {
                    if (!_.isUndefined(wholePriceListData) && !_.isUndefined(wholePriceListData.priceListData)) {
                        for (var i = 0; i < scope.services.length; i++) {
                            if (scope.services[i].isSelected == true) {
                                wholePriceListData.priceListData.services[i].isSelected = true;
                            } else {
                                wholePriceListData.priceListData.services[i].isSelected = false;
                            }
                        };
                        priceListService.savePriceList(wholePriceListData);
                    }
                }

            };
        },
        templateUrl: contentService.getLineTemplateUrl('priceList')
    };
}]);

angular.module('returnApp').directive('t0067', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0067')
    };
}]);

angular.module('returnApp').directive('t0068', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0068')
    };
}]);

angular.module('returnApp').directive('t0069', ['contentService', function (contentService) {
    //	PREPARER_INFO
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t0069')
    };
}]);

angular.module('returnApp').directive('t0070', ['contentService', function (contentService) {
    //	ONE_LINE_R_YESNO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0070')
    };
}]);

angular.module('returnApp').directive('t0071', ['contentService', function (contentService) {
    //	ONE_LINE_2CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0071')
    };
}]);

angular.module('returnApp').directive('t0072', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0072')
    };
}]);

angular.module('returnApp').directive('t0073', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0073')
    };
}]);

angular.module('returnApp').directive('t0074', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_CMB_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0074')
    };
}]);

angular.module('returnApp').directive('t0075', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0075')
    };
}]);

angular.module('returnApp').directive('t0077', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0077')
    };
}]);

angular.module('returnApp').directive('t0078', ['contentService', function (contentService) {
    //	ONE_LINE_FOREIGN_ADDRESS_IRS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0078')
    };
}]);

angular.module('returnApp').directive('t0079', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0079')
    };
}]);

angular.module('returnApp').directive('t0080', ['contentService', function (contentService) {
    //	ONE_LINE_9TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0080')
    };
}]);

angular.module('returnApp').directive('t0081', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_US_FORIGN_ADDRESS_3CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t0081')
    };
}]);

angular.module('returnApp').directive('t0082', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0082')
    };
}]);

angular.module('returnApp').directive('t0083', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0083')
    };
}]);

angular.module('returnApp').directive('t0084', ['contentService', function (contentService) {
    //	FOUR_LINE_ADDRESS_15TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t0084')
    };
}]);

angular.module('returnApp').directive('t0085', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_TXT_3CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0085')
    };
}]);

angular.module('returnApp').directive('t0086', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0086')
    };
}]);

angular.module('returnApp').directive('t0087', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_3G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0087')
    };
}]);

angular.module('returnApp').directive('t0088', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_3CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0088')
    };
}]);

angular.module('returnApp').directive('t0089', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0089')
    };
}]);

angular.module('returnApp').directive('t0090', ['contentService', function (contentService) {
    //	TWO_LINE_7TXT_3G_ADDRESS_7LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t0090')
    };
}]);

angular.module('returnApp').directive('t0091', ['contentService', function (contentService) {
    //	TWO_LINE_9TXT_2G_ADDRESS_9LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', rkey8: '@', field9: '=', field9name: '@field9', rkey9: '@', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t0091')
    };
}]);

angular.module('returnApp').directive('t0092', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0092')
    };
}]);

angular.module('returnApp').directive('t0093', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXT_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0093')
    };
}]);

angular.module('returnApp').directive('t0094', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0094')
    };
}]);

angular.module('returnApp').directive('t0095', ['contentService', function (contentService) {
    //	ONE_LINE_9TXTG_CHK_8LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0095')
    };
}]);

angular.module('returnApp').directive('t0096', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_3YNCHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0096')
    };
}]);

angular.module('returnApp').directive('t0097', ['contentService', function (contentService) {
    //	ONE_LINE_NAME_ADDRESS_7TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t0097')
    };
}]);

angular.module('returnApp').directive('t0098', ['contentService', function (contentService) {
    //	ONE_LINE_PROJECT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey: '@', field6: '=', field6name: '@field6', field8: '=', field8name: '@field8', field7: '=', field7name: '@field7', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0098')
    };
}]);

angular.module('returnApp').directive('t0099', ['contentService', function (contentService) {
    //  8CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@', rkey8: '@', field8: '=', field8name: '@field8', value8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0099')
    };
}]);

angular.module('returnApp').directive('t0100', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_ADDRESS_2CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0100')
    };
}]);

angular.module('returnApp').directive('t0101', ['contentService', function (contentService) {
    //	ONE_LINE_6YNCHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', value11: '@', value12: '@', field2: '=', field2name: '@field2', value21: '@', value22: '@', field3: '=', field3name: '@field3', value31: '@', value32: '@', field4: '=', field4name: '@field4', value41: '@', value42: '@', field5: '=', field5name: '@field5', value51: '@', value52: '@', field6: '=', field6name: '@field6', value61: '@', value62: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0101')
    };
}]);

angular.module('returnApp').directive('t0102', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_4G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0102')
    };
}]);

angular.module('returnApp').directive('t0103', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_4G_LBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0103')
    };
}]);

angular.module('returnApp').directive('t0104', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_YN
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field7: '=', field7name: '@field7', value7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0104')
    };
}]);

angular.module('returnApp').directive('t0105', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_4G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0105')
    };
}]);

angular.module('returnApp').directive('t0106', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_1G_5G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0106')
    };
}]);

angular.module('returnApp').directive('t0107', ['contentService', function (contentService) {
    //	TWO_LINE_8TXT_US_FG_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t0107')
    };
}]);

angular.module('returnApp').directive('t0108', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0108')
    };
}]);

angular.module('returnApp').directive('t0110', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CHK_7TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0110')
    };
}]);

angular.module('returnApp').directive('t0111', ['contentService', function (contentService) {
    //	3CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno1: '@', rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2', lineno3: '@', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0111')
    };
}]);

angular.module('returnApp').directive('t0112', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_2CMB_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0112')
    };
}]);

angular.module('returnApp').directive('t0113', ['contentService', function (contentService) {
    //	ONE_LINE_CMB_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0113')
    };
}]);

angular.module('returnApp').directive('t0114', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0114')
    };
}]);

angular.module('returnApp').directive('t0115', ['contentService', function (contentService) {
    //	ONE_LINE_3CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0115')
    };
}]);

angular.module('returnApp').directive('t0116', ['contentService', function (contentService) {
    //	ONE_LINE_3YNCHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0116')
    };
}]);

angular.module('returnApp').directive('t0117', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_3CHK_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0117')
    };
}]);

angular.module('returnApp').directive('t0118', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_3G_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0118')
    };
}]);

angular.module('returnApp').directive('t0119', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0119')
    };
}]);

angular.module('returnApp').directive('t0120', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_3G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0120')
    };
}]);

angular.module('returnApp').directive('t0121', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0121')
    };
}]);

angular.module('returnApp').directive('t0122', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2CHK_6TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0122')
    };
}]);

angular.module('returnApp').directive('t0124', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CHK_ADDRESS_COMBO_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field7: '=', field7name: '@field7', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0124')
    };
}]);

angular.module('returnApp').directive('t0126', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_2G_4CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0126')
    };
}]);

angular.module('returnApp').directive('t0127', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_CMB
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0127')
    };
}]);

angular.module('returnApp').directive('t0128', ['contentService', function (contentService) {
    //	ONE_LINE_9TXT_1G_CMB
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0128')
    };
}]);

angular.module('returnApp').directive('t0129', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_2G_3CMB_9CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12',
            field13: '=', field13name: '@field13',
            field14: '=', field14name: '@field14',
            field15: '=', field15name: '@field15',
            field16: '=', field16name: '@field16',
            field17: '=', field17name: '@field17',
            field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t0129')
    };
}]);

angular.module('returnApp').directive('t0130', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CMB_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0130')
    };
}]);

angular.module('returnApp').directive('t0131', ['contentService', function (contentService) {
    //	TwoLine_YNGRP
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0131')
    };
}]);

angular.module('returnApp').directive('t0132', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_2G_3CMB_9CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', rkey15: '@', rkey16: '@', rkey17: '@', rkey18: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0132')
    };
}]);

angular.module('returnApp').directive('t0133', ['contentService', function (contentService) {
    //	ONE_LINE_R_2CHK_UNGROUPED
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field1: '=', field1name: '@field1', rkey3: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0133')
    };
}]);

angular.module('returnApp').directive('t0134', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_ADDRESS_TXT_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0134')
    };
}]);

angular.module('returnApp').directive('t0135', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_ADDRESS_2TXT_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0135')
    };
}]);

angular.module('returnApp').directive('t0136', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t0136')
    };
}]);

angular.module('returnApp').directive('t0137', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_4CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0137')
    };
}]);

angular.module('returnApp').directive('t0138', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_2CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0138')
    };
}]);

angular.module('returnApp').directive('t0139', ['contentService', function (contentService) {
    //	FOUR_LINE_3TXT_3CHK_ADDRESS_7LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey5: '@', rkey4: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', rkey7: '@', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0139')
    };
}]);

angular.module('returnApp').directive('t0140', ['contentService', function (contentService) {
    //	TWO_LINE_6TXT_9CHK_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t0140')
    };
}]);

angular.module('returnApp').directive('t0141', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0141')
    };
}]);

angular.module('returnApp').directive('t0142', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0142')
    };
}]);

angular.module('returnApp').directive('t0143', ['contentService', function (contentService) {
    //	ONE_LINE_3LBL_TXT_LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', field1: '=', field1name: '@field1', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0143')
    };
}]);

angular.module('returnApp').directive('t0144', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_2G_CMB
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0144')
    };
}]);

angular.module('returnApp').directive('t0147', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_CMB_TXT_CMB_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0147')
    };
}]);

angular.module('returnApp').directive('t0148', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_3G_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0148')
    };
}]);

angular.module('returnApp').directive('t0149', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_3CHK_4TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value3: '@', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0149')
    };
}]);

angular.module('returnApp').directive('t0150', ['contentService', function (contentService) {
    //	TWO_LINE_8TXT_2CHK_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t0150')
    };
}]);

angular.module('returnApp').directive('t0152', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CHK_5TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0152')
    };
}]);

angular.module('returnApp').directive('t0153', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_5CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0153')
    };
}]);

angular.module('returnApp').directive('t0154', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_3CHK_4TXT_CHK_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t0154')
    };
}]);

angular.module('returnApp').directive('t0155', ['contentService', function (contentService) {
    //	TWO_LINE_12TXTG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t0155')
    };
}]);

angular.module('returnApp').directive('t0157', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_2YNCHK_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value41: '@', value42: '@', field5: '=', field5name: '@field5', value51: '@', value52: '@', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0157')
    };
}]);

angular.module('returnApp').directive('t0158', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_2YNCHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value41: '@', value42: '@', field5: '=', field5name: '@field5', value51: '@', value52: '@', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0158')
    };
}]);

angular.module('returnApp').directive('t0159', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_FOREIGN_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0159')
    };
}]);

angular.module('returnApp').directive('t0160', ['contentService', function (contentService) {
    //	ONE_LINE_4TXTG_2YNCHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7', value8: '@', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0160')
    };
}]);

angular.module('returnApp').directive('t0162', ['contentService', function (contentService) {
    //	TWO_LINE_9TXT_CHK_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t0162')
    };
}]);

angular.module('returnApp').directive('t0163', ['contentService', function (contentService) {
    //	ONE_LINE_5TXTG_YNCHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value61: '@', value62: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0163')
    };
}]);

angular.module('returnApp').directive('t0164', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_COMBO_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0164')
    };
}]);

angular.module('returnApp').directive('t0165', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_4G_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0165')
    };
}]);

angular.module('returnApp').directive('t0166', ['contentService', function (contentService) {
    //	ONE_LINE_5TXTG_ALL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t0166')
    };
}]);

angular.module('returnApp').directive('t0167', ['contentService', function (contentService) {
    //	ONE_LINE_6TXTG_ALL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t0167')
    };
}]);

angular.module('returnApp').directive('t0168', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_ALL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t0168')
    };
}]);

angular.module('returnApp').directive('t0169', ['contentService', function (contentService) {
    //	ONE_LINE_5TXTG_ALL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0169')
    };
}]);

angular.module('returnApp').directive('t0170', ['contentService', function (contentService) {
    //	ONE_LINE_6TXTG_ALL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0170')
    };
}]);

angular.module('returnApp').directive('t0171', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_ALL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0171')
    };
}]);

angular.module('returnApp').directive('t0172', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_3CHK_1YNCHK_1G_2G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value61: '@', value62: '@', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0172')
    };
}]);

angular.module('returnApp').directive('t0173', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_3CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0173')
    };
}]);

angular.module('returnApp').directive('t0174', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_YN_2TXT_YN_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0174')
    };
}]);

angular.module('returnApp').directive('t0175', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2ADDRESS_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t0175')
    };
}]);

angular.module('returnApp').directive('t0176', ['contentService', function (contentService) {
    //	TWO_LINE_2TXTG_2CHK_4TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t0176')
    };
}]);

angular.module('returnApp').directive('t0177', ['contentService', function (contentService) {
    //	TWO_LINE_4TXTG_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t0177')
    };
}]);

angular.module('returnApp').directive('t0178', ['contentService', function (contentService) {
    //	ONE_LINE_7TXTG_CMB
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field8: '=', field8name: '@field8', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0178')
    };
}]);

angular.module('returnApp').directive('t0182', ['contentService', function (contentService) {
    //	ONE_LINE_14TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t0182')
    };
}]);

angular.module('returnApp').directive('t0184', ['contentService', function (contentService) {
    //	ELECTRONICFUNDSWITHDRAWAL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0184')
    };
}]);

angular.module('returnApp').directive('t0185', ['contentService', function (contentService) {
    //	STATEDIRECTDEPOSIT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0185')
    };
}]);

angular.module('returnApp').directive('t0186', ['contentService', function (contentService) {
    //	ISIATTRANSACTION
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0186')
    };
}]);

angular.module('returnApp').directive('t0187', ['contentService', function (contentService) {
    //	TWO_LINE_2TXT_6CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t0187')
    };
}]);

angular.module('returnApp').directive('t0188', ['contentService', function (contentService) {
    //	TWO_LINE_2TXT_6CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0188')
    };
}]);

angular.module('returnApp').directive('t0189', ['contentService', function (contentService) {
    //	TWO_LINE_ADDRESS_8CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t0189')
    };
}]);

angular.module('returnApp').directive('t0190', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0190')
    };
}]);

angular.module('returnApp').directive('t0191', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_6CHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0191')
    };
}]);

angular.module('returnApp').directive('t0192', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_ADDRESS_TXT_2CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t0192')
    };
}]);

angular.module('returnApp').directive('t0193', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_2G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t0193')
    };
}]);

angular.module('returnApp').directive('t1193', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_ADDERESS_TXT_4CHK_2G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t1193')
    };
}]);

angular.module('returnApp').directive('t1194', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_ADDRESS_5G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15'
        },
        templateUrl: contentService.getLineTemplateUrl('t1194')
    };
}]);

angular.module('returnApp').directive('t1195', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_2CKH_2TXT_6CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value8: '@', field8: '=', field8name: '@field8', value9: '@', field9: '=', field9name: '@field9', value10: '@', field10: '=', field10name: '@field10', value11: '@', field11: '=', field11name: '@field11', value12: '@', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t1195')
    };
}]);

angular.module('returnApp').directive('t1196', ['contentService', function (contentService) {
    //  9CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@', rkey8: '@', field8: '=', field8name: '@field8', value8: '@', rkey9: '@', field9: '=', field9name: '@field9', value9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1196')
    };
}]);

angular.module('returnApp').directive('t1197', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t1197')
    };
}]);

angular.module('returnApp').directive('t1198', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_2G_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1198')
    };
}]);

angular.module('returnApp').directive('t1199', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_ADDERESS_TXT_4CHK_2G_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1199')
    };
}]);

angular.module('returnApp').directive('t1200', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_ADDRESS_5G_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1200')
    };
}]);

angular.module('returnApp').directive('t1201', ['contentService', function (contentService) {
    //	ONE_LINE_16TXT_TBL_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t1201')
    };
}]);

angular.module('returnApp').directive('t1202', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_CBO_4TXT_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t1202')
    };
}]);

angular.module('returnApp').directive('t1203', ['contentService', function (contentService) {
    //	ONE_LINE_16TXT_TBL_1G_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', rkey15: '@', rkey16: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1203')
    };
}]);

angular.module('returnApp').directive('t1204', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_7TXT_2CHK_TXT_2CHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23'
        },
        templateUrl: contentService.getLineTemplateUrl('t1204')
    };
}]);

angular.module('returnApp').directive('t1205', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_ADDRESS_TXT_2CHK_3TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1205')
    };
}]);

angular.module('returnApp').directive('t1206', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_8TXT_2CHK_ INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1206')
    };
}]);

angular.module('returnApp').directive('t1207', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_7TXT_2CHK_TXT_2CHK_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', rkey15: '@', rkey16: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1207')
    };
}]);

angular.module('returnApp').directive('t1208', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_6CHK_TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1208')
    };
}]);

angular.module('returnApp').directive('t1209', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_4TXT_2CHK_2TXT_2CHK_TXT_2CHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t1209')
    };
}]);

angular.module('returnApp').directive('t1210', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_4TXT_2CHK_2TXT_2CHK_TXT_2CHK_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', rkey15: '@', rkey16: '@', rkey17: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1210')
    };
}]);

angular.module('returnApp').directive('t1211', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_5TXT_4G_5G_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15'
        },
        templateUrl: contentService.getLineTemplateUrl('t1211')
    };
}]);

angular.module('returnApp').directive('t1212', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_5TXT_4G_5G_ADDRESS_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1212')
    };
}]);

angular.module('returnApp').directive('t1213', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_4TXT_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t1213')
    };
}]);

angular.module('returnApp').directive('t1214', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_4TXT_CHK_2TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1214')
    };
}]);

angular.module('returnApp').directive('t1215', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_7TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t1215')
    };
}]);

angular.module('returnApp').directive('t1216', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_7TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1216')
    };
}]);

angular.module('returnApp').directive('t1217', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_1TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t1217')
    };
}]);

angular.module('returnApp').directive('t1224', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_10TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t1224')
    };
}]);

angular.module('returnApp').directive('t1225', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS__2TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t1225')
    };
}]);

angular.module('returnApp').directive('t1227', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_4CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t1227')
    };
}]);

angular.module('returnApp').directive('t1218', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_1TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1218')
    };
}]);

angular.module('returnApp').directive('t1219', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_2CHK_2TXT_2CHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t1219')
    };
}]);

angular.module('returnApp').directive('t1220', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_2CHK_2TXT_2CHK_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1220')
    };
}]);

angular.module('returnApp').directive('t1226', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS__2TXT_2CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1226')
    };
}]);

angular.module('returnApp').directive('t1228', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_1G_5G_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1228')
    };
}]);

angular.module('returnApp').directive('t1229', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_4CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1229')
    };
}]);

angular.module('returnApp').directive('t1230', ['contentService', function (contentService) {
    //	Exaptions_Txt_VA
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', rkey2: '@', field3: '=', field3name: '@field3', rkey4: '@', field5: '=', field5name: '@field5', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t1230')
    };
}]);

angular.module('returnApp').directive('t1231', ['contentService', function (contentService) {
    //	Exaptions_TxtInfo_VA
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1231')
    };
}]);

angular.module('returnApp').directive('t1233', ['contentService', function (contentService) {
    //	Exaptions_VA
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', field3: '=', field3name: '@field3', rkey4: '@', field5: '=', field5name: '@field5', rkey6: '@', field7: '=', field7name: '@field7', rkey8: '@', field9: '=', field9name: '@field9', rkey10: '@', field11: '=', field11name: '@field11', rkey12: '@', rkey13: '@', field14: '=', field14name: '@field14', rkey15: '@', field16: '=', field16name: '@field16', rkey17: '@', field18: '=', field18name: '@field18', rkey19: '@', field20: '=', field20name: '@field20', rkey21: '@', field22: '=', field22name: '@field22', rkey23: '@', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t1233')
    };
}]);

angular.module('returnApp').directive('t2234', ['contentService', function (contentService) {
    //	TWO_LINE_3TXTG_2CHK_4TXT_2ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t2234')
    };
}]);

angular.module('returnApp').directive('t2235', ['contentService', function (contentService) {
    //	ONE_LINE_NAME_ADDRESS_CMB_7TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2235')
    };
}]);

angular.module('returnApp').directive('t2236', ['contentService', function (contentService) {
    //	ONE_LINE_NAME_ADDRESS_CMB_7TXTINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2236')
    };
}]);

angular.module('returnApp').directive('t2237', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_TXTG
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2237')
    };
}]);

angular.module('returnApp').directive('t2238', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CHK_TXT_CHK_4TXT_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2238')
    };
}]);

angular.module('returnApp').directive('t2239', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CHK_TXT_CHK_4TXT_CHK_2TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2239')
    };
}]);

angular.module('returnApp').directive('t2240', ['contentService', function (contentService) {
    //	MULTI_LINE_TXTG_US_FG_ADDRESS_9TXT_2CHK_TXT_2CHK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t2240')
    };
}]);

angular.module('returnApp').directive('t2241', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_US_FG_ADDRESS_9TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21'
        },
        templateUrl: contentService.getLineTemplateUrl('t2241')
    };
}]);

angular.module('returnApp').directive('t2242', ['contentService', function (contentService) {
    //	MULTI_LINE_TXTG_US_FG_ADDRESS_5TXT_2CHK_2TXT_2CHK_TXT_2CHK_TXT
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field2: '=', field2name: '@field2', rkey3: '@', field4: '=', field4name: '@field4', rkey5: '@', field6: '=', field6name: '@field6', rkey7: '@', field8: '=', field8name: '@field8', rkey9: '@', field10: '=', field10name: '@field10', rkey11: '@', field12: '=', field12name: '@field12', rkey13: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', rkey19: '@', field17: '=', field17name: '@field17', rkey18: '@', field19: '=', field19name: '@field19', rkey20: '@', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', rkey23: '@', field24: '=', field24name: '@field24', rkey25: '@', field26: '=', field26name: '@field26', field27: '=', field27name: '@field27', rkey28: '@', field29: '=', field29name: '@field29', rkey30: '@', rkey31: '@', field32: '=', field32name: '@field32', field33: '=', field33name: '@field33', field34: '=', field34name: '@field34', field35: '=', field35name: '@field35', field36: '=', field36name: '@field36', field37: '=', field37name: '@field37', field38: '=', field38name: '@field38', field39: '=', field39name: '@field39', field40: '=', field40name: '@field40'
        },
        templateUrl: contentService.getLineTemplateUrl('t2242')
    };
}]);

angular.module('returnApp').directive('t2243', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_2CHK_GRP_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2243')
    };
}]);

angular.module('returnApp').directive('t2244', ['contentService', function (contentService) {
    //	MULTI_LINE_4TXT_8CHK_2TXT_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t2244')
    };
}]);

angular.module('returnApp').directive('t2245', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_2G_7G_6CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value8: '@', field8: '=', field8name: '@field8', value9: '@', field9: '=', field9name: '@field9', value10: '@', field10: '=', field10name: '@field10', value11: '@', field11: '=', field11name: '@field11', value12: '@', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2245')
    };
}]);

angular.module('returnApp').directive('t2246', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_2G_7G_6CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2246')
    };
}]);

angular.module('returnApp').directive('t2247', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2G_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2247')
    };
}]);

angular.module('returnApp').directive('t2248', ['contentService', function (contentService) {
    //	ONE_LINE_4YNCHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2248')
    };
}]);

angular.module('returnApp').directive('t2250', ['contentService', function (contentService) {
    //	ONE_LINE_2CHK_5TXT_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2250')
    };
}]);

angular.module('returnApp').directive('t2251', ['contentService', function (contentService) {
    //	ONE_LINE_2CHK_5TXT_1G_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2251')
    };
}]);

angular.module('returnApp').directive('t2252', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_3G_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2252')
    };
}]);

angular.module('returnApp').directive('t2253', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_3G_CHK_TXT_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2253')
    };
}]);

angular.module('returnApp').directive('t2254', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_CHK_5TXT_4G_5G_US_FG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t2254')
    };
}]);

angular.module('returnApp').directive('t2255', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_CHK_5TXT_4G_5G_US_FG_ADDRESS_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2255')
    };
}]);

angular.module('returnApp').directive('t2256', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_3G_2CHK_US_FG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2256')
    };
}]);

angular.module('returnApp').directive('t2257', ['contentService', function (contentService) {
    //	ONE_LINE_L_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field', value: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2257')
    };
}]);

angular.module('returnApp').directive('t2258', ['contentService', function (contentService) {
    //	ONE_LINE_R_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field', value: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2258')
    };
}]);

angular.module('returnApp').directive('t2259', ['contentService', function (contentService) {
    //	ONE_LINE_RADIO_TXT
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2259')
    };
}]);

angular.module('returnApp').directive('t2260', ['contentService', function (contentService) {
    //	ONE_LINE_R_2RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2260')
    };
}]);

angular.module('returnApp').directive('t2261', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_LINENO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey2: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2261')
    };
}]);

angular.module('returnApp').directive('t2261n', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_LINENO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey2: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2261n')
    };
}]);

angular.module('returnApp').directive('t2262', ['contentService', function (contentService) {
    //	Two_Line_MainInfo_FormSel_7CHK_CBO_1CHK
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2262')
    };
}]);

angular.module('returnApp').directive('t2263', ['contentService', function (contentService) {
    //	RIS_Account_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2263')
    };
}]);

angular.module('returnApp').directive('t2266', ['contentService', function (contentService) {
    //	RIS_PREPARER_INFO
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', value18: '@', field18: '=', field18name: '@field18', value19: '@', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22'
        },
        templateUrl: contentService.getLineTemplateUrl('t2266')
    };
}]);

angular.module('returnApp').directive('t2265', ['contentService', function (contentService) {
    //	RIS_Electronic_Sign
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2265')
    };
}]);

angular.module('returnApp').directive('t2269', ['contentService', function (contentService) {
    //	RIS_Pmt_Options
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2269')
    };
}]);

angular.module('returnApp').directive('t2267', ['contentService', function (contentService) {
    //	ONE_LINE_4CBO
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2267')
    };
}]);

angular.module('returnApp').directive('t2249', ['contentService', function (contentService) {
    //	ONE_LINE_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2249')
    };
}]);

angular.module('returnApp').directive('t0183', ['contentService', function (contentService) {
    //	ONE_LINE_14TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t0183')
    };
}]);

angular.module('returnApp').directive('t2270', ['contentService', function (contentService) {
    //	ONE_LINE_R_4YESNO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2270')
    };
}]);

angular.module('returnApp').directive('t2264', ['contentService', function (contentService) {
    //	Two_Line_W2_WageTax_CBO_7CHK
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2264')
    };
}]);

angular.module('returnApp').directive('t2271', ['contentService', function (contentService) {
    //	W2EMP_TXG_2TXT_TXG_2TXT_US_ADDRESS_4TXT_FOREIGN_ADDRESS_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', rkey20: '@', field20: '=', field20name: '@field20', rkey21: '@', field21: '=', field21name: '@field21', lineno22: '@', lineno23: '@', lineno24: '@', lineno25: '@', lineno26: '@', lineno27: '@', lineno28: '@', lineno29: '@', lineno30: '@', lineno31: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2271')
    };
}]);

angular.module('returnApp').directive('t2272', ['contentService', function (contentService) {
    //	W2_ONLINE_TXG_CBO_2TXT_CHK
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', lineno6: '@', lineno7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2272')
    };
}]);

/*
angular.module('returnApp').directive('t2277',['contentService',function (contentService) {
    //	MainInfo_HOH_1CHK_LBL_2TXT_1CHK
    return {
        restrict: 'E',
        scope: {
        lineno: '@',rkey1: '@',field1: '=', field1name: '@field1', value1: '@', rkey2: '@',rkey3: '@',field3: '=', field3name: '@field3', rkey4: '@',field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey5: '@'
        },
      templateUrl: contentService.getLineTemplateUrl('t2277')
    };
}]);
*/
angular.module('returnApp').directive('t2277', ['contentService', function (contentService) {
    //  MainInfo_HOH_1CHK_LBL_2TXT_1CHK
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2277')
    };
}]);

angular.module('returnApp').directive('t2278', ['contentService', function (contentService) {
    //	Maininfo_QW_1CHK_1TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2278')
    };
}]);

angular.module('returnApp').directive('t2273', ['contentService', function (contentService) {
    //	MainInfo_MFJ_1CHK_3YESNO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@',
            field1: '=',
            field1name: '@field1',
            value1: '@',
            rkey2: '@',
            field2: '=',
            field2name: '@field2',
            value21: '@',
            value22: '@',
            rkey3: '@',
            field3: '=',
            field3name: '@field3',
            field4: '=',
            field4name: '@field4',
            rkey5: '@', field5: '=',
            field5name: '@field5',
            field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2273')
    };
}]);

angular.module('returnApp').directive('t2274', ['contentService', function (contentService) {
    //	ONE_LINE_R_2YESNO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2274')
    };
}]);

angular.module('returnApp').directive('t2280', ['contentService', function (contentService) {
    //	W2Emp_TXG_8CHK_US_ADDRESS_FOREIGN_ADDRESS_16TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field12: '=', field12name: '@field12', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26', field27: '=', field27name: '@field27', field28: '=', field28name: '@field28', field29: '=', field29name: '@field29', field30: '=', field30name: '@field30', field31: '=', field31name: '@field31', field32: '=', field32name: '@field32', field33: '=', field33name: '@field33', field34: '=', field34name: '@field34', field35: '=', field35name: '@field35', field36: '=', field36name: '@field36', field37: '=', field37name: '@field37', field38: '=', field38name: '@field38', rkey39: '@', rkey40: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2280')
    };
}]);

angular.module('returnApp').directive('t0125', ['contentService', function (contentService) {
    //	ONE_LINE_3Y3NCHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t0125')
    };
}]);

angular.module('returnApp').directive('t2288', ['contentService', function (contentService) {
    //	W2_11TXT_4CBO_3CHK_7LBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', lineno19: '@', lineno20: '@', lineno21: '@', lineno22: '@', lineno23: '@', lineno24: '@', lineno25: '@', rkey26: '@', rkey27: '@', rkey28: '@', rkey29: '@', rkey30: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2288')
    };
}]);

angular.module('returnApp').directive('t2290', ['contentService', function (contentService) {
    //	ONE_LINE_3INFO_LINENO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2290')
    };
}]);

angular.module('returnApp').directive('t2294', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_INER
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2294')
    };
}]);

angular.module('returnApp').directive('t2295', ['contentService', function (contentService) {
    //	ONE_LINE_INNER
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2295')
    };
}]);

angular.module('returnApp').directive('t2293', ['contentService', function (contentService) {
    //	W2_7TXT_LINENO_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2293')
    };
}]);

angular.module('returnApp').directive('t2292', ['contentService', function (contentService) {
    //	W2_7TXT_LINENO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2292')
    };
}]);

angular.module('returnApp').directive('t2276', ['contentService', function (contentService) {
    //	W2G_App_Chk
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2276')
    };
}]);

angular.module('returnApp').directive('t2296', ['contentService', function (contentService) {
    //	ONE_LBL_R_2CHK_ONLY
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2296')
    };
}]);

angular.module('returnApp').directive('t2297', ['contentService', function (contentService) {
    //	ONE_LINE_YN_RADIO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2297')
    };
}]);

angular.module('returnApp').directive('t2298', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', value1: '@', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2298')
    };
}]);

angular.module('returnApp').directive('t2279', ['contentService', function (contentService) {
    //	W2G_Name_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2', lineno3: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', lineno5: '@', rkey5: '@', field5: '=', field5name: '@field5', lineno6: '@', rkey6: '@', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2279')
    };
}]);

angular.module('returnApp').directive('t2299', ['contentService', function (contentService) {
    //	W2_ONE_LINE_2LBL_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2299')
    };
}]);

angular.module('returnApp').directive('t2300', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_LBL_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', value1: '@', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2300')
    };
}]);

angular.module('returnApp').directive('t2301', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_3CHK_TBL_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2301')
    };
}]);

angular.module('returnApp').directive('t2281', ['contentService', function (contentService) {
    //	W2G_Address_Info1
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', lineno5: '@', rkey5: '@', field5: '=', field5name: '@field5', lineno6: '@', rkey6: '@', field6: '=', field6name: '@field6', lineno7: '@', rkey7: '@', field7: '=', field7name: '@field7', lineno8: '@', rkey8: '@', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2281')
    };
}]);

angular.module('returnApp').directive('t2282', ['contentService', function (contentService) {
    //	W2G_Address_Info2
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', lineno5: '@', rkey5: '@', field5: '=', field5name: '@field5', lineno6: '@', rkey6: '@', field6: '=', field6name: '@field6', lineno7: '@', rkey7: '@', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2282')
    };
}]);

angular.module('returnApp').directive('t2283', ['contentService', function (contentService) {
    //	W2G_5Lbl_5Txt
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2', lineno3: '@', rkey3: '@', field3: '=', field3name: '@field3', lineno4: '@', rkey4: '@', field4: '=', field4name: '@field4', lineno5: '@', rkey5: '@', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2283')
    };
}]);

angular.module('returnApp').directive('t2305', ['contentService', function (contentService) {
    //	ONE_LINE_R_2RADIO_CIS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2305')
    };
}]);

angular.module('returnApp').directive('t2308', ['contentService', function (contentService) {
    //	PREPARER_INFO_1040
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', value14: '@', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22'
        },
        templateUrl: contentService.getLineTemplateUrl('t2308')
    };
}]);

angular.module('returnApp').directive('t2309', ['contentService', function (contentService) {
    //	ONE_LINE_R_4YESNO_REDIO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2309')
    };
}]);

angular.module('returnApp').directive('t2285', ['contentService', function (contentService) {
    //	W2VI_App_Chk
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2285')
    };
}]);

angular.module('returnApp').directive('t2291', ['contentService', function (contentService) {
    //	ONE_LINE_7LBL_14TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', lineno3: '@', rkey3: '@', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', lineno7: '@', rkey7: '@', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', lineno9: '@', rkey9: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', lineno11: '@', rkey11: '@', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', lineno13: '@', rkey13: '@', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2291')
    };
}]);

angular.module('returnApp').directive('t2284', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_2LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2284')
    };
}]);

angular.module('returnApp').directive('t2286', ['contentService', function (contentService) {
    //	ONE_LINE_3LBL_1CHK
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2286')
    };
}]);

angular.module('returnApp').directive('t2287', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_1LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2287')
    };
}]);

angular.module('returnApp').directive('t0161', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_FOREIGN_ADDRESS_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t0161')
    };
}]);

angular.module('returnApp').directive('t2302', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CHK_ADDRESS_COMBO_2TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2302')
    };
}]);

angular.module('returnApp').directive('t2303', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_2G_4G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2303')
    };
}]);

angular.module('returnApp').directive('t2304', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_2G_4G_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2304')
    };
}]);

angular.module('returnApp').directive('t2307', ['contentService', function (contentService) {
    //	ONE_LINE_TXG_CBO_1TXT
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2307')
    };
}]);

angular.module('returnApp').directive('t1222', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t1222')
    };
}]);

angular.module('returnApp').directive('t2310', ['contentService', function (contentService) {
    //	W2G_Foreign_Add
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2310')
    };
}]);

angular.module('returnApp').directive('t2306', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_NO_LINE_SPACE
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2306')
    };
}]);

angular.module('returnApp').directive('t1223', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t1223')
    };
}]);

angular.module('returnApp').directive('t2289', ['contentService', function (contentService) {
    //	W2GU_TXG_US_ADDRESS_FOREIGN_ADDRESS_6TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field12: '=', field12name: '@field12', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', rkey39: '@', rkey40: '@', rkey41: '@', rkey42: '@', lineno43: '@', lineno44: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2289')
    };
}]);

angular.module('returnApp').directive('t2313', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_8949
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2313')
    };
}]);

angular.module('returnApp').directive('t2314', ['contentService', function (contentService) {
    //	ONE_LINE_2lbl_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2314')
    };
}]);

angular.module('returnApp').directive('t2311', ['contentService', function (contentService) {
    //	TWO_LINE_YN_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2311')
    };
}]);

angular.module('returnApp').directive('t2316', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_2G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2316')
    };
}]);

angular.module('returnApp').directive('t2317', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_2G_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2317')
    };
}]);

angular.module('returnApp').directive('t2321', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2321')
    };
}]);

angular.module('returnApp').directive('t2318', ['contentService', function (contentService) {
    //	ONE_LINE_3Y3NCHK_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2318')
    };
}]);

angular.module('returnApp').directive('t2323', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_2G_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2323')
    };
}]);

angular.module('returnApp').directive('t2324', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_2CMB_CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno1: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2324')
    };
}]);

angular.module('returnApp').directive('t2325', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_3HIDE
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2325')
    };
}]);

angular.module('returnApp').directive('t2315', ['contentService', function (contentService) {
    //	TWO_LINE_2LCHK_2RTXT
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2315')
    };
}]);

angular.module('returnApp').directive('t2328', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2328')
    };
}]);

angular.module('returnApp').directive('t2329', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_Inner
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2329')
    };
}]);

angular.module('returnApp').directive('t2330', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_LASTBLNK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2330')
    };
}]);

angular.module('returnApp').directive('t2331', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2331')
    };
}]);

angular.module('returnApp').directive('t2333', ['contentService', function (contentService) {
    //	ONE_LINE_Middle_3LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2333')
    };
}]);


angular.module('returnApp').directive('t2332', ['contentService', function (contentService) {
    //	ONE_LINE_3LBL
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2332')
    };
}]);

angular.module('returnApp').directive('t2334', ['contentService', function (contentService) {
    //	ONE_LINE_2BLNK_2TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2334')
    };
}]);

angular.module('returnApp').directive('t2335', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_2TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2335')
    };
}]);

angular.module('returnApp').directive('t2319', ['contentService', function (contentService) {
    //	ONE_LINE_R_6YESNO_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', value9: '@', field10: '=', field10name: '@field10', value10: '@', field11: '=', field11name: '@field11', value11: '@', field12: '=', field12name: '@field12', value12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2319')
    };
}]);

angular.module('returnApp').directive('t2336', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_TBL_INFO_4562
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2336')
    };
}]);

angular.module('returnApp').directive('t2337', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_BLNK_2TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2337')
    };
}]);

angular.module('returnApp').directive('t2338', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_CBO_2TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2338')
    };
}]);

angular.module('returnApp').directive('t2339', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_BLNK_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2339')
    };
}]);

angular.module('returnApp').directive('t2340', ['contentService', function (contentService) {
    //	ONE_LINE_3RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2340')
    };
}]);

angular.module('returnApp').directive('t2341', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2341')
    };
}]);

angular.module('returnApp').directive('t2343', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2343')
    };
}]);

angular.module('returnApp').directive('t2345', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2345')
    };
}]);

angular.module('returnApp').directive('t2346', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_4G_INFO_5713
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2346')
    };
}]);

angular.module('returnApp').directive('t2344', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2CHK_8283
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2344')
    };
}]);

angular.module('returnApp').directive('t2348', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_TBL_INFO_8283
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2348')
    };
}]);

angular.module('returnApp').directive('t2349', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_FOREIGN_ADDRESS_TBL_INfO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2349')
    };
}]);

angular.module('returnApp').directive('t2350', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_3G_2CHK_US_FG_ADDRESS_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2350')
    };
}]);

angular.module('returnApp').directive('t2351', ['contentService', function (contentService) {
    //	ONE_LINE_13TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2351')
    };
}]);

angular.module('returnApp').directive('t2352', ['contentService', function (contentService) {
    //	ONE_LINE_3INFO_8283
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2352')
    };
}]);

angular.module('returnApp').directive('t2353', ['contentService', function (contentService) {
    //	ONE_LINE_R_5YESNO_REDIO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', value9: '@', field10: '=', field10name: '@field10', value10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2353')
    };
}]);

angular.module('returnApp').directive('t2354', ['contentService', function (contentService) {
    //	ONE_LINE_7INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2354')
    };
}]);

angular.module('returnApp').directive('t2355', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2355')
    };
}]);

angular.module('returnApp').directive('t2356', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_2CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2356')
    };
}]);

angular.module('returnApp').directive('t2357', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2357')
    };
}]);

angular.module('returnApp').directive('t1232', ['contentService', function (contentService) {
    //	FINANCETRANSACTION_CA
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', value14: '@', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', value16: '@', field17: '=', field17name: '@field17', value17: '@', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', value21: '@', field22: '=', field22name: '@field22', value22: '@', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t1232')
    };
}]);

angular.module('returnApp').directive('t2358', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_3YNCHK_TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2358')
    };
}]);

angular.module('returnApp').directive('t2359', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2359')
    };
}]);

angular.module('returnApp').directive('t2360', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_INNER
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2360')
    };
}]);

angular.module('returnApp').directive('t2361', ['contentService', function (contentService) {
    //	ONE_LINE_2BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2361')
    };
}]);

angular.module('returnApp').directive('t2362', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2362')
    };
}]);

angular.module('returnApp').directive('t2364', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_3CHK_3TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2364')
    };
}]);

angular.module('returnApp').directive('t2363', ['contentService', function (contentService) {
    //	TAX_PAID_WKT
    return {
        restrict: 'E',
        scope: {
            //rkey1: '@',rkey2: '@',rkey3: '@',rkey4: '@',field5: '=', field5name: '@field5', rkey6: '@',field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', rkey13: '@',field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', rkey20: '@',field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26', rkey27: '@',field28: '=', field28name: '@field28', field29: '=', field29name: '@field29', field30: '=', field30name: '@field30', field31: '=', field31name: '@field31', field32: '=', field32name: '@field32', field33: '=', field33name: '@field33', rkey34: '@',field35: '=', field35name: '@field35', rkey36: '@',field37: '=', field37name: '@field37', rkey38: '@',field39: '=', field39name: '@field39', rkey40: '@',field41: '=', field41name: '@field41'
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', field5: '=', field5name: '@field5', rkey6: '@', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', rkey13: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', rkey20: '@', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26', rkey27: '@', field28: '=', field28name: '@field28', field29: '=', field29name: '@field29', field30: '=', field30name: '@field30', field31: '=', field31name: '@field31', field32: '=', field32name: '@field32', field33: '=', field33name: '@field33', rkey34: '@', field35: '=', field35name: '@field35', rkey36: '@', field37: '=', field37name: '@field37', rkey40: '@', field41: '=', field41name: '@field41'
        },
        templateUrl: contentService.getLineTemplateUrl('t2363')
    };
}]);

angular.module('returnApp').directive('t2365', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2365')
    };
}]);

angular.module('returnApp').directive('t2367', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_2TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2367')
    };
}]);

angular.module('returnApp').directive('t2366', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_2CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2366')
    };
}]);

angular.module('returnApp').directive('t2368', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_LASTBLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2368')
    };
}]);

angular.module('returnApp').directive('t2369', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_1G_2G_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2369')
    };
}]);

angular.module('returnApp').directive('t2371', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_1G_2G_2CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2371')
    };
}]);

angular.module('returnApp').directive('t2233', ['contentService', function (contentService) {
    //	IL_Refund_FinancialTransaction
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', value14: '@', field15: '=', field15name: '@field15', value15: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2233')
    };
}]);

angular.module('returnApp').directive('t0179', ['contentService', function (contentService) {
    //	ONE_LINE_4TXTG_CHK_5TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0179')
    };
}]);

angular.module('returnApp').directive('t2372', ['contentService', function (contentService) {
    //	ONE_LINE_2CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2372')
    };
}]);

angular.module('returnApp').directive('t2373', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_YN_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2373')
    };
}]);

angular.module('returnApp').directive('t2374', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', value11: '@', field12: '=', field12name: '@field12', value12: '@', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15'
        },
        templateUrl: contentService.getLineTemplateUrl('t2374')
    };
}]);

angular.module('returnApp').directive('t2375', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', value11: '@', field12: '=', field12name: '@field12', value12: '@', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2375')
    };
}]);

angular.module('returnApp').directive('t2376', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2376')
    };
}]);

angular.module('returnApp').directive('t2378', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_4CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2378')
    };
}]);

angular.module('returnApp').directive('t2377', ['contentService', function (contentService) {
    //	ESTIMATEDPAYMENT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2377')
    };
}]);

angular.module('returnApp').directive('t2380', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2YESNO_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', value11: '@', field12: '=', field12name: '@field12', value12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2380')
    };
}]);

angular.module('returnApp').directive('t2381', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXT_CHK_TXT_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2381')
    };
}]);

angular.module('returnApp').directive('t0181', ['contentService', function (contentService) {
    //	ONE_LINE_5TXTG_2YNCHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7', value8: '@', field8: '=', field8name: '@field8', value9: '@', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t0181')
    };
}]);

angular.module('returnApp').directive('t2312', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2312')
    };
}]);

angular.module('returnApp').directive('t2383', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2383')
    };
}]);

angular.module('returnApp').directive('t2384', ['contentService', function (contentService) {
    //	ONE_LINE_5TXTG_2YNCHK_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2384')
    };
}]);

angular.module('returnApp').directive('t2385', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_3CHK_4TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2385')
    };
}]);

angular.module('returnApp').directive('t2382', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_2BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2382')
    };
}]);

angular.module('returnApp').directive('t2386', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_2ND_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2386')
    };
}]);

angular.module('returnApp').directive('t2387', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_CHK_3TXT_Info
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2387')
    };
}]);

angular.module('returnApp').directive('t2388', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2388')
    };
}]);

angular.module('returnApp').directive('t2389', ['contentService', function (contentService) {
    //	ONE_LINE_11CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2389')
    };
}]);

angular.module('returnApp').directive('t2391', ['contentService', function (contentService) {
    //	ONE_LINE_6INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2391')
    };
}]);

angular.module('returnApp').directive('t2390', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_3COMBO_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2390')
    };
}]);

angular.module('returnApp').directive('t2392', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_ADDRESS_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2392')
    };
}]);

angular.module('returnApp').directive('t2393', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_5BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2393')
    };
}]);

angular.module('returnApp').directive('t2394', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLNK_TXT_5BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2394')
    };
}]);

angular.module('returnApp').directive('t2395', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_2BLNK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2395')
    };
}]);

angular.module('returnApp').directive('t2396', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_2TXT_2ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', rkey4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', rkey8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2396')
    };
}]);

angular.module('returnApp').directive('t2397', ['contentService', function (contentService) {
    //	ONE_TXT_4BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2397')
    };
}]);

angular.module('returnApp').directive('t2399', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2399')
    };
}]);

angular.module('returnApp').directive('t2398', ['contentService', function (contentService) {
    //	ONE_TXT_3BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2398')
    };
}]);

angular.module('returnApp').directive('t2400', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLNK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2400')
    };
}]);

angular.module('returnApp').directive('t2401', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_2BLNK_TXT_2BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2401')
    };
}]);

angular.module('returnApp').directive('t2402', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_3RADIO_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', value2: '@', field2name: '@field2', value3: '@', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2402')
    };
}]);

angular.module('returnApp').directive('t2403', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2403')
    };
}]);

angular.module('returnApp').directive('t2406', ['contentService', function (contentService) {
    //	W2_ONE_LINE_LBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', lineno2: '@', rkey3: '@', field4: '=', field4name: '@field4', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2406')
    };
}]);

angular.module('returnApp').directive('t2413', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_LBL_TXT_W2
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2413')
    };
}]);

angular.module('returnApp').directive('t2414', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_13CHK_TBL_1G_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', rkey15: '@', rkey16: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2414')
    };
}]);

angular.module('returnApp').directive('t2415', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_13CHK_TBL_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2415')
    };
}]);

angular.module('returnApp').directive('t2417', ['contentService', function (contentService) {
    //	ONE_LINE_3CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2417')
    };
}]);

angular.module('returnApp').directive('t2424', ['contentService', function (contentService) {
    //	ONE_LINE_R_CHK_SchC
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2424')
    };
}]);

angular.module('returnApp').directive('t2427', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_1TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2427')
    };
}]);

angular.module('returnApp').directive('t2428', ['contentService', function (contentService) {
    //	ONE_LINE_2CBO_TXT_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2428')
    };
}]);

angular.module('returnApp').directive('t2426', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_3CBO_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2426')
    };
}]);

angular.module('returnApp').directive('t2433', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTINFO_CA
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2433')
    };
}]);

angular.module('returnApp').directive('t2429', ['contentService', function (contentService) {
    //	ONE_LINE_4BLNK_2TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2429')
    };
}]);

angular.module('returnApp').directive('t2430', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2430')
    };
}]);

angular.module('returnApp').directive('t2431', ['contentService', function (contentService) {
    //	ONE_LINE_BLNK_4TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2431')
    };
}]);

angular.module('returnApp').directive('t2432', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2432')
    };
}]);

angular.module('returnApp').directive('t2434', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_ADDRESS_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2434')
    };
}]);

angular.module('returnApp').directive('t2437', ['contentService', function (contentService) {
    //	ONE_LINE_LookUp_Level2
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2437')
    };
}]);

angular.module('returnApp').directive('t2436', ['contentService', function (contentService) {
    //	ONE_LINE_LookUp_Level1
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey2: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2436')
    };
}]);

angular.module('returnApp').directive('t2435', ['contentService', function (contentService) {
    //	CIS_DEP_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', value9: '@', field10: '=', field10name: '@field10', value10: '@', rkey11: '@', field11: '=', field11name: '@field11', value11: '@', field12: '=', field12name: '@field12', value12: '@', rkey13: '@', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', value14: '@', rkey15: '@', field15: '=', field15name: '@field15', value15: '@', field16: '=', field16name: '@field16', value16: '@', rkey17: '@', field17: '=', field17name: '@field17', value17: '@', field18: '=', field18name: '@field18', value18: '@', rkey19: '@', field19: '=', field19name: '@field19', value19: '@', field20: '=', field20name: '@field20', value20: '@', rkey21: '@', field21: '=', field21name: '@field21', value21: '@', field22: '=', field22name: '@field22', value22: '@', rkey23: '@', field23: '=', field23name: '@field23', value23: '@', field24: '=', field24name: '@field24', value24: '@', rkey25: '@', field25: '=', field25name: '@field25', value25: '@', field26: '=', field26name: '@field26', value26: '@', rkey27: '@', field27: '=', field27name: '@field27', value27: '@', field28: '=', field28name: '@field28', value28: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2435')
    };
}]);

angular.module('returnApp').directive('t2440', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2440')
    };
}]);

angular.module('returnApp').directive('t2416', ['contentService', function (contentService) {
    //	MULTI_LINE_AL_Sch_AAC
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2', lineno3: '@', rkey3: '@', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', lineno12: '@', rkey12: '@', field12: '=', field12name: '@field12', lineno13: '@', rkey13: '@', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', lineno22: '@', rkey22: '@', field22: '=', field22name: '@field22', lineno23: '@', rkey23: '@', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26', field27: '=', field27name: '@field27', field28: '=', field28name: '@field28', field29: '=', field29name: '@field29', field30: '=', field30name: '@field30', field31: '=', field31name: '@field31'
        },
        templateUrl: contentService.getLineTemplateUrl('t2416')
    };
}]);

angular.module('returnApp').directive('t2443', ['contentService', function (contentService) {
    //	ONE_LINE_12TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t2443')
    };
}]);

angular.module('returnApp').directive('t2444', ['contentService', function (contentService) {
    //	ONE_LINE_ADDRESS_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2444')
    };
}]);

angular.module('returnApp').directive('t2423', ['contentService', function (contentService) {
    //	ONE_LINE_13TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2423')
    };
}]);

angular.module('returnApp').directive('t2418', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_US_FOREIGN_ADDRESS_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2418')
    };
}]);

angular.module('returnApp').directive('t2419', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_US_FOREIGN_ADDRESS_4TXT_Info
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2419')
    };
}]);

angular.module('returnApp').directive('t2447', ['contentService', function (contentService) {
    //	ONE_LINE_Code_LookUp
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2447')
    };
}]);

angular.module('returnApp').directive('t2412', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2412')
    };
}]);

angular.module('returnApp').directive('t2449', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_2G_3TXT_ADDRESS_1TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2449')
    };
}]);

angular.module('returnApp').directive('t2448', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_2G_3TXT_ADDRESS_1TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2448')
    };
}]);

angular.module('returnApp').directive('t2450', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_2G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2450')
    };
}]);

angular.module('returnApp').directive('t2451', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_2G_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2451')
    };
}]);

angular.module('returnApp').directive('t2446', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_CBO_TXT_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2446')
    };
}]);

angular.module('returnApp').directive('t2442', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2442')
    };
}]);

angular.module('returnApp').directive('t2404', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLNK_TXT_3BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2404')
    };
}]);

angular.module('returnApp').directive('t2405', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_3BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2405')
    };
}]);

angular.module('returnApp').directive('t2452', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2452')
    };
}]);

angular.module('returnApp').directive('t2420', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_CHK_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2420')
    };
}]);

angular.module('returnApp').directive('t2421', ['contentService', function (contentService) {
    //	ONE_LINE_R_4RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', value3: '@', field3: '=', field3name: '@field3', rkey4: '@', value4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2421')
    };
}]);

angular.module('returnApp').directive('t2453', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2453')
    };
}]);

angular.module('returnApp').directive('t2454', ['contentService', function (contentService) {
    //	ONE_LINE_13TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2454')
    };
}]);

angular.module('returnApp').directive('t2455', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2455')
    };
}]);

angular.module('returnApp').directive('t2457', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_COMBO_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2457')
    };
}]);

angular.module('returnApp').directive('t2458', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_US_FOREIGN_ADDRESS_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2458')
    };
}]);

angular.module('returnApp').directive('t2459', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2459')
    };
}]);

angular.module('returnApp').directive('t2460', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2460')
    };
}]);

angular.module('returnApp').directive('t2462', ['contentService', function (contentService) {
    //	ESTIMATEDPAYMENT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2462')
    };
}]);

angular.module('returnApp').directive('t2463', ['contentService', function (contentService) {
    //	ONE_LINE_5CBO_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2463')
    };
}]);

angular.module('returnApp').directive('t2464', ['contentService', function (contentService) {
    //	ONE_LINE_26TXT_TBL_1G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26'
        },
        templateUrl: contentService.getLineTemplateUrl('t2464')
    };
}]);

angular.module('returnApp').directive('t2465', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_4G_CBO_TXT_Code_LookUp
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2465')
    };
}]);

angular.module('returnApp').directive('t2461', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_TXT_Code_LookUp
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2461')
    };
}]);

angular.module('returnApp').directive('t2469', ['contentService', function (contentService) {
    //	STATEDIRECTDEPOSITOH
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2469')
    };
}]);

angular.module('returnApp').directive('t2473', ['contentService', function (contentService) {
    //	ONE_LINE_3CHK_Blank
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2473')
    };
}]);

angular.module('returnApp').directive('t2476', ['contentService', function (contentService) {
    //	ONE_LINE_L_CHK_LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2476')
    };
}]);

angular.module('returnApp').directive('t2471', ['contentService', function (contentService) {
    //	ONE_LINE_9TXT_9CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t2471')
    };
}]);

angular.module('returnApp').directive('assetDepreciationWktStatement', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field2: '=', field3: '=', field4: '=', field5: '=', field6: '=', field7: '=', field8: '=', field9: '=', field10: '=',
            field11: '=', field12: '=', field13: '=', field14: '=', field15: '=', field16: '=', field17: '=', field18: '=',
            field1name: '@field1', field2name: '@field2', field3name: '@field3', field4name: '@field4', field5name: '@field5', field6name: '@field6', field7name: '@field7',
            field8name: '@field8', field9name: '@field9', field10name: '@field10', field11name: '@field11', field12name: '@field12', field13name: '@field13', field14name: '@field14',
            field15name: '@field15', field16name: '@field16', field17name: '@field17', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('assetDepreciationWktStatement')
    };
}]);

angular.module('returnApp').directive('tFormLookup', ['contentService', function (contentService) {
    //	ONE_LINE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field', doclist: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('tFormLookup')
    };
}]);

angular.module('returnApp').directive('vehicleDepreciationWktStatement', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field2: '=', field3: '=', field4: '=', field5: '=', field6: '=', field7: '=', field8: '=', field9: '=', field10: '=', field11: '=', field12: '=',
            field13: '=', field14: '=', field15: '=', field16: '=', field17: '=', field18: '=', field19: '=', field20: '=', field21: '=', field22: '=', field23: '=', field24: '=', field25: '=',
            field1name: '@field1', field2name: '@field2', field3name: '@field3', field4name: '@field4', field5name: '@field5', field6name: '@field6', field7name: '@field7',
            field8name: '@field8', field9name: '@field9', field10name: '@field10', field11name: '@field11', field12name: '@field12', field13name: '@field13', field14name: '@field14',
            field15name: '@field15', field16name: '@field16', field17name: '@field17', field18name: '@field18', field19name: '@field19', field20name: '@field20', field21name: '@field21',
            field22name: '@field22', field23name: '@field23', field24name: '@field24', field25name: '@field25'
        },
        templateUrl: contentService.getLineTemplateUrl('vehicleDepreciationWktStatement')
    };
}]);

angular.module('returnApp').directive('t2468', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_5TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2468')
    };
}]);

angular.module('returnApp').directive('t2484', ['contentService', function (contentService) {
    //	Disbursement_Method_Atlas
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey6: '@', rkey7: '@', value7: '@', field7: '=', field7name: '@field7', rkey8: '@', value8: '@', field8: '=', field8name: '@field8', rkey9: '@', value9: '@', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2484')
    };
}]);

angular.module('returnApp').directive('t2489', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_TXT_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2489')
    };
}]);

angular.module('returnApp').directive('t2477', ['contentService', function (contentService) {
    //	ONE_LINE_TXG_CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2477')
    };
}]);

angular.module('returnApp').directive('t2486', ['contentService', function (contentService) {
    //	ONE_LINE_Code_LookUp_Listner1
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2486')
    };
}]);

angular.module('returnApp').directive('t2483', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_ADDRESS_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2483')
    };
}]);

angular.module('returnApp').directive('t2482', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_3BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2482')
    };
}]);

angular.module('returnApp').directive('t2481', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_TXT_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2481')
    };
}]);

angular.module('returnApp').directive('t2456', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_3BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2456')
    };
}]);

angular.module('returnApp').directive('t2472', ['contentService', function (contentService) {
    //	ONE_LINE_BLNK_2TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2472')
    };
}]);

angular.module('returnApp').directive('t2466', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_9TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2466')
    };
}]);

angular.module('returnApp').directive('t2490', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_TXT_SchE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t0067')
    };
}]);

angular.module('returnApp').directive('t2492', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1040ES
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2492')
    };
}]);

angular.module('returnApp').directive('t2487', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G_CBO_2CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2487')
    };
}]);

angular.module('returnApp').directive('t2488', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G_CBO_2CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2488')
    };
}]);

//bankCardEnvelopNumber
angular.module('returnApp').directive('cardEnvelopeNumber', ['$http', '$log', 'dataAPI', 'returnService', 'bankProductsService', 'dialogService', function ($http, $log, dataAPI, returnService, bankProductsService, dialogService) {
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@', rkey2: '@', field2: '=', field2name: '@'
        },
        link: function (scope, element, attrs) {
            var mapping = [{ "atlasField": "ENVELOPENUMBER", "lable": "Card Envelope number" }, { "atlasField": "PRIMSSN", "lable": "Taxpayer's SSN" },
            { "atlasField": "DAN", "lable": "Account Number" }, { "atlasField": "FINALACCT", "lable": "Account Number" }];

            var isProcessing = false;
            scope.isError = false;
            var errors = [];
            var oldValue = "";

            // We have to bind blur event for textfield of field1.
            var cardNumber = element.children().children()[3].children[0];
            angular.element(cardNumber).bind('blur', function () {
                _validateCardNumber();
            });

            // We have to bind blur event for textfield of field2.
            var verifyCardNumber = element.children().children()[8].children[0];
            angular.element(verifyCardNumber).bind('blur', function () {
                _validateCardNumber();
            });

            //validate card Number
            //check whether field1 and field2 is not undefined and empty.
            //then check IF values match. IF 'YES' then call validate API
            // ON success do nothing. ON error show error message.
            //else show message.
            var _validateCardNumber = function () {
                if (isProcessing == false) {
                    if (scope.field1.value != undefined && scope.field1.value != "" && scope.field2.value != undefined && scope.field2.value != "") {
                        if (scope.field1.value == scope.field2.value) {
                            _resetData();
                            if (oldValue != scope.field1.value) {
                                var disbursementData = _getDisubursementData();
                                isProcessing = true;
                                oldValue = scope.field1.value;

                                $http({
                                    method: 'POST',
                                    url: dataAPI.base_url + '/bank/atlas/cashcard/verify',
                                    data: disbursementData
                                }).then(function (success) {
                                    var response = success.data.data;
                                    if (response.errorCount > 0) {
                                        errors = response.errors;
                                        scope.showErrors();
                                        scope.isError = true;
                                    } else {
                                        scope.isError = false;
                                        errors = [];
                                    }
                                    isProcessing = false;
                                }, function (error) {
                                    scope.isError = false;
                                    errors = [];
                                    isProcessing = false;
                                    oldValue = "";
                                    $log.error(error);
                                });
                            }
                        } else {
                            scope.isEnabled = true;
                            scope.lableText = "Card Envelope number does not match";
                        }
                    } else {
                        _resetData();
                    }

                }
            };

            scope.showErrors = function () {
                if (errors.length > 0) {
                    var text = "<ul>";
                    _.forEach(errors, function (error) {
                        var msg = error.errorMessage;
                        _.forEach(mapping, function (map) {
                            if (_.includes(msg, map.atlasField)) {
                                msg = msg.replace(map.atlasField, map.lable);
                            }
                        });

                        text = text + "<li>" + msg + "</li>";
                    });

                    text = text + "</ul>";

                    //Attention Dialog
                    var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'lg', 'windowClass': 'my-class' };
                    var dialog = dialogService.openDialog("error", dialogConfiguration, text);
                }
            };

            // reset flag and text.
            var _resetData = function () {
                scope.isEnabled = false;
                scope.lableText = "";
            };

            //get DisubursementData
            var _getDisubursementData = function () {
                // default values
                var disbursementData = { officeid: "", chkTrnCode: "QC", ralQikCode: "Q", moneyTransfer: "N", cardType: "I", envelopeNumber: scope.field1.value };

                //return info
                var returnData = returnService.getDisbursementMethodData();
                if (!_.isUndefined(returnData)) {
                    disbursementData.primSsn = returnData.primSsn;
                    disbursementData.dan = returnData.dan;
                    disbursementData.finalAcct = returnData.dan;
                }

                //bank Data
                var atlasXmlData = bankProductsService.getAtlasBankXml();

                if (!_.isUndefined(atlasXmlData)) {
                    if (!_.isUndefined(atlasXmlData.NTSEFILE)) {
                        disbursementData.efin = atlasXmlData.NTSEFILE.EFIN;
                        disbursementData.district = atlasXmlData.NTSEFILE.DISTRICT;
                        disbursementData.region = atlasXmlData.NTSEFILE.REGION;
                        disbursementData.mailBox = atlasXmlData.NTSEFILE.MAILBOX;
                    }

                    if (!_.isUndefined(atlasXmlData.NTSBANK)) {
                        disbursementData.finalRtn = atlasXmlData.NTSBANK.CASHCARDRTN;
                        disbursementData.rtn = atlasXmlData.NTSBANK.RTN;
                    }
                }

                return disbursementData;
            };

            scope.$on('$destroy', function () {
                angular.element(cardNumber).unbind('blur');
                angular.element(verifyCardNumber).unbind('blur');
            });
        },
        template: '<div class="row"><div class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-1 col-md-1 col-lg-1"></div><tax-label class="col-sm-5 col-md-5 col-lg-5" rkey="{{rkey1}}"></tax-label><tax-textbox class="col-sm-4 col-md-4 col-lg-4" field="field1" fieldname="{{field1name}}"></tax-textbox><i class="fa fa-exclamation-triangle padding_top_15 cursor_pointer" rkey="Invalid Card Envelope number. Click icon to see further details." ng-show="isError" ng-click="showErrors()" style="vertical-align: -webkit-baseline-middle;"></i> </div><div class="row"><div class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-1 col-md-1 col-lg-1"></div><tax-label class="col-sm-5 col-md-5 col-lg-5" rkey="{{rkey2}}"></tax-label><tax-textbox class="col-sm-4 col-md-4 col-lg-4" field="field2" fieldname="{{field2name}}"></tax-textbox> <lable class="text-danger_normal" style="vertical-align: -webkit-baseline-middle;" ng-show="isEnabled">{{lableText}}</lable></div>'
    };
}]);

angular.module('returnApp').directive('t2478', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_3TXT_CBO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2478')
    };
}]);

angular.module('returnApp').directive('t2479', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2479')
    };
}]);

angular.module('returnApp').directive('t2480', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2480')
    };
}]);

angular.module('returnApp').directive('t2493', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_TBLINFO_4136
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2493')
    };
}]);

angular.module('returnApp').directive('t2495', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_2TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2495')
    };
}]);

angular.module('returnApp').directive('t2494', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_12CHK_TBL_1G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2494')
    };
}]);

angular.module('returnApp').directive('t2496', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_INFO_INNER_LEVEL1
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2496')
    };
}]);

angular.module('returnApp').directive('t2497', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_INFO_INNER_LEVEL2
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2497')
    };
}]);

angular.module('returnApp').directive('t2498', ['contentService', function (contentService) {
    //	ONE_LINE_R_CHK_INNER
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2498')
    };
}]);

angular.module('returnApp').directive('t2503', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_4BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2503')
    };
}]);

angular.module('returnApp').directive('t2502', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_5BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2502')
    };
}]);

angular.module('returnApp').directive('t2499', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_2BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2499')
    };
}]);

angular.module('returnApp').directive('t2501', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_11TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t2501')
    };
}]);

angular.module('returnApp').directive('t2500', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_7TXT_4G
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2500')
    };
}]);

angular.module('returnApp').directive('t2475', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_3BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2475')
    };
}]);

angular.module('returnApp').directive('t2505', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2505')
    };
}]);

angular.module('returnApp').directive('t2504', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_5BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2504')
    };
}]);

angular.module('returnApp').directive('t2474', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2474')
    };
}]);

angular.module('returnApp').directive('t2506', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_BLNK_TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2506')
    };
}]);

angular.module('returnApp').directive('t2407', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_6BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2407')
    };
}]);

angular.module('returnApp').directive('t2408', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_5BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2408')
    };
}]);

angular.module('returnApp').directive('t2409', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_4BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2409')
    };
}]);

angular.module('returnApp').directive('t2410', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_3BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2410')
    };
}]);

angular.module('returnApp').directive('t2411', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2411')
    };
}]);

angular.module('returnApp').directive('t2379', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2TXT_YesNo
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', value5: '@', rkey5: '@', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2379')
    };
}]);

angular.module('returnApp').directive('t2507', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_3CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2507')
    };
}]);

angular.module('returnApp').directive('t2508', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2508')
    };
}]);

angular.module('returnApp').directive('t2509', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2509')
    };
}]);

angular.module('returnApp').directive('t2510', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2510')
    };
}]);

angular.module('returnApp').directive('t2511', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2511')
    };
}]);

angular.module('returnApp').directive('t2512', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2512')
    };
}]);

angular.module('returnApp').directive('t2513', ['contentService', function (contentService) {
    //	FINANCETRANSACTION_ME
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', value15: '@', field16: '=', field16name: '@field16', value16: '@', field17: '=', field17name: '@field17', value17: '@', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', value21: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2513')
    };
}]);

angular.module('returnApp').directive('t2514', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2514')
    };
}]);
angular.module('returnApp').directive('t2515', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2515')
    };
}]);

angular.module('returnApp').directive('t2520', ['contentService', function (contentService) {
    //	TWO_LINE_3TXTG_2CHK_CBO_2TXT_2ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2520')
    };
}]);


angular.module('returnApp').directive('t2516', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTG_2CHK_GRP_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2516')
    };
}]);

angular.module('returnApp').directive('t2517', ['contentService', function (contentService) {
    //	ONE_LINE_R_2YESNO_RADIO_2BLANK
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2517')
    };
}]);

angular.module('returnApp').directive('t2518', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CBO_3TXT_2CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2518')
    };
}]);

angular.module('returnApp').directive('t2519', ['contentService', function (contentService) {
    //	ONE_LINE_R_3RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2519')
    };
}]);

angular.module('returnApp').directive('t2521', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_CBO_7TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t2521')
    };
}]);

angular.module('returnApp').directive('t2522', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_CBO_6TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2522')
    };
}]);

angular.module('returnApp').directive('t2523', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_CBO_9TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2523')
    };
}]);

angular.module('returnApp').directive('t2524', ['contentService', function (contentService) {
    //	FINANCETRANSACTION_NC
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value13: '@', field14: '=', field14name: '@field14', value14: '@', field15: '=', field15name: '@field15', value15: '@', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', value17: '@', field18: '=', field18name: '@field18', value18: '@', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', value22: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2524')
    };
}]);

angular.module('returnApp').directive('t1221', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_CMB_4TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t1221')
    };
}]);

angular.module('returnApp').directive('t2525', ['contentService', function (contentService) {
    //	ONE_LINE_LINK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', link: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2525')
    };
}]);

angular.module('returnApp').directive('t2526', ['contentService', function (contentService) {
    //	TWO_LINE_6TXT_6YesNo_1Chk_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', lineno6: '@', rkey6: '@', field6: '=', field6name: '@field6', lineno7: '@', rkey7: '@', lineno8: '@', rkey8: '@', field8: '=', field8name: '@field8', value8: '@', rkey9: '@', field9: '=', field9name: '@field9', value9: '@', lineno10: '@', rkey10: '@', field10: '=', field10name: '@field10', value10: '@', rkey11: '@', field11: '=', field11name: '@field11', value11: '@', lineno12: '@', rkey12: '@', field12: '=', field12name: '@field12', value12: '@', rkey13: '@', field13: '=', field13name: '@field13', value13: '@', lineno14: '@', rkey14: '@', field14: '=', field14name: '@field14', value14: '@', rkey15: '@', field15: '=', field15name: '@field15', value15: '@', lineno16: '@', rkey16: '@', field16: '=', field16name: '@field16', value16: '@', rkey17: '@', field17: '=', field17name: '@field17', value17: '@', lineno18: '@', rkey18: '@', field18: '=', field18name: '@field18', value18: '@', rkey19: '@', field19: '=', field19name: '@field19', value19: '@', lineno20: '@', rkey20: '@', field20: '=', field20name: '@field20', lineno21: '@', rkey21: '@', field21: '=', field21name: '@field21', lineno22: '@', rkey22: '@', rkey23: '@', field23: '=', field23name: '@field23', value23: '@', rkey24: '@', field24: '=', field24name: '@field24', value24: '@', lineno25: '@', rkey25: '@', field25: '=', field25name: '@field25', lineno26: '@', rkey26: '@', field26: '=', field26name: '@field26'
        },
        templateUrl: contentService.getLineTemplateUrl('t2526')
    };
}]);

angular.module('returnApp').directive('t2527', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2BLANK_2TXT
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2527')
    };
}]);

angular.module('returnApp').directive('t2528', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2528')
    };
}]);

angular.module('returnApp').directive('t2531', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2531')
    };
}]);

angular.module('returnApp').directive('t2529', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_4CHK_1CBO_1CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2529')
    };
}]);

angular.module('returnApp').directive('t2530', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_4CHK_1CBO_1CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2530')
    };
}]);

angular.module('returnApp').directive('t2532', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3TXT_CHK_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t2532')
    };
}]);

angular.module('returnApp').directive('t2533', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3TXT_CHK_6TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2533')
    };
}]);

angular.module('returnApp').directive('t2534', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2534')
    };
}]);

angular.module('returnApp').directive('t2535', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2535')
    };
}]);

angular.module('returnApp').directive('t2536', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2536')
    };
}]);

angular.module('returnApp').directive('t2537', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2537')
    };
}]);

angular.module('returnApp').directive('t2539', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2CHK_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t2539')
    };
}]);

angular.module('returnApp').directive('t2540', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2CHK_6TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2540')
    };
}]);

angular.module('returnApp').directive('t2542', ['contentService', function (contentService) {
    //	ONE_LINE_9TXTG_CHK_8LBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2542')
    };
}]);

angular.module('returnApp').directive('t2541', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_ADDRESS_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2541')
    };
}]);

angular.module('returnApp').directive('t2543', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2543')
    };
}]);

angular.module('returnApp').directive('t2544', ['contentService', function (contentService) {
    //	ONE_LINE_L_4RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', value3: '@', field3: '=', field3name: '@field3', rkey4: '@', value4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2544')
    };
}]);

angular.module('returnApp').directive('t2546', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CHK_ADDRESS_COMBO_3TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field7: '=', field7name: '@field7', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2546')
    };
}]);

angular.module('returnApp').directive('t2545', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_CHK_ADDRESS_COMBO_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2545')
    };
}]);

angular.module('returnApp').directive('t2548', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2548')
    };
}]);

angular.module('returnApp').directive('t2538', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_BLANK_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2538')
    };
}]);

angular.module('returnApp').directive('t2552', ['contentService', function (contentService) {
    //	ONE_LINE_3BLNK_TXT_2BLNK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2552')
    };
}]);

angular.module('returnApp').directive('t2556', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_4G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2556')
    };
}]);

angular.module('returnApp').directive('t2557', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_1G_4G_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2557')
    };
}]);

angular.module('returnApp').directive('t2555', ['contentService', function (contentService) {
    //	TWO_LINE_CBO_4TXT_1G_1CHK_US_FOREIGN_ADDRESS_9TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t2555')
    };
}]);

angular.module('returnApp').directive('t2558', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_US_FORIGN_ADDRESS_3CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2558')
    };
}]);

angular.module('returnApp').directive('t2559', ['contentService', function (contentService) {
    //	TWO_LINE_CBO_4TXT_1G_1CHK_US_FOREIGN_ADDRESS_9TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', rkey15: '@', rkey16: '@', rkey17: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2559')
    };
}]);

angular.module('returnApp').directive('t2560', ['contentService', function (contentService) {
    //	ONE_LINE_3TXTINFO_MIDDLE
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2560')
    };
}]);

angular.module('returnApp').directive('t2561', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_3RADIO
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value3: '@', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2561')
    };
}]);

angular.module('returnApp').directive('t2562', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_3RADIO_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2562')
    };
}]);

angular.module('returnApp').directive('t2563', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2BLANK_ILSchUB
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2563')
    };
}]);

angular.module('returnApp').directive('t2564', ['contentService', function (contentService) {
    //	ONE_LINE_13TXT_1G_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2564')
    };
}]);

angular.module('returnApp').directive('t2441', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_YN_2TXT_YN_2TXT_Info
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2441')
    };
}]);

angular.module('returnApp').directive('t2565', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_US_FOREIGN_ADDRESS_1TXT_CBO_4TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2565')
    };
}]);

angular.module('returnApp').directive('t2566', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_US_FOREIGN_ADDRESS_1TXT_CBO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2566')
    };
}]);

angular.module('returnApp').directive('t2567', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_4NAME_4FEIN_4ACCOUNTNO_INFO_WITH_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2567')
    };
}]);

angular.module('returnApp').directive('t2568', ['contentService', function (contentService) {
    //	ONE_LINE_6NAME_6FEIN_6ACCOUNTNO_INFO_WITH_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', field17: '=', field17name: '@field17', rkey18: '@', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t2568')
    };
}]);

angular.module('returnApp').directive('t2569', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_BLNK_TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2569')
    };
}]);

angular.module('returnApp').directive('t2570', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_LBL_RADIO_LBL_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2570')
    };
}]);

angular.module('returnApp').directive('t2571', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_3NAME_3FEIN_3ACCOUNTNO_LBL_INFO_WITH_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2571')
    };
}]);

angular.module('returnApp').directive('t2572', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_5NAME_5FEIN_5ACCOUNTNO_INFO_WITH_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2572')
    };
}]);

angular.module('returnApp').directive('t2573', ['contentService', function (contentService) {
    //	ONE_LINE_3LBL_2NAME_2FEIN_2ACCOUNTNO_LBL_INFO_WITH_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2573')
    };
}]);

angular.module('returnApp').directive('t2574', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_BLANK_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2574')
    };
}]);

angular.module('returnApp').directive('t2576', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_BLANK_TXT_NY_STATE
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2576')
    };
}]);

angular.module('returnApp').directive('t2577', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_3BLNK_NY_STATE1
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2577')
    };
}]);

angular.module('returnApp').directive('t2578', ['contentService', function (contentService) {
    //	ONE_LINE_2BLNK_NY_STATE2
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2578')
    };
}]);


angular.module('returnApp').directive('t2575', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_3TXT_CHK_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2575')
    };
}]);

angular.module('returnApp').directive('t2547', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2547')
    };
}]);

angular.module('returnApp').directive('t2579', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_TXTG_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2579')
    };
}]);

angular.module('returnApp').directive('t2580', ['contentService', function (contentService) {
    //	ONE_LINE_US_FOREIGN_ADDRESS_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2580')
    };
}]);

angular.module('returnApp').directive('t2582', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_YES_NO_RADIO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2582')
    };
}]);

angular.module('returnApp').directive('t2585', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_YES_NO_RADIO_2TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2585')
    };
}]);

angular.module('returnApp').directive('t2587', ['contentService', function (contentService) {
    //	ONE_LINE_11TXT_1G_3G_6CBO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', rkey6: '@', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', rkey19: '@', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t2587')
    };
}]);

angular.module('returnApp').directive('t2588', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_2TXT_LBL_TXT_LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', rkey3: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2588')
    };
}]);

angular.module('returnApp').directive('t0076', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_ADDRESS_2RADIO_2TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t0076')
    };
}]);

angular.module('returnApp').directive('t2589', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_7BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2589')
    };
}]);

angular.module('returnApp').directive('t2592', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_1G_CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2592')
    };
}]);

angular.module('returnApp').directive('t2593', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_1G_CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2593')
    };
}]);
angular.module('returnApp').directive('t2595', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_2TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2595')
    };
}]);

angular.module('returnApp').directive('t2596', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLANK_2TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2596')
    };
}]);

angular.module('returnApp').directive('t2597', ['contentService', function (contentService) {
    //	ONE_LINE_TXTINFO_2GINFO_3GINFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2597')
    };
}]);

angular.module('returnApp').directive('t2598', ['contentService', function (contentService) {
    //	ONE_LINE_2INFO_3GINFO_4INFO_5GINFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2598')
    };
}]);

angular.module('returnApp').directive('t2599', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_2G_ADDRESS_2RADIO_2TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2599')
    };
}]);

angular.module('returnApp').directive('t2600', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_2G_ADDRESS_2RADIO_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2600')
    };
}]);

angular.module('returnApp').directive('t2581', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_6CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2581')
    };
}]);

angular.module('returnApp').directive('t2583', ['contentService', function (contentService) {
    //	ONE_LINE_3NAME_3FEIN_3DATE_2LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2583')
    };
}]);

angular.module('returnApp').directive('t2584', ['contentService', function (contentService) {
    //	ONE_LINE_3NAME_3FEIN_3DATE_BLANK_LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2584')
    };
}]);

angular.module('returnApp').directive('t2586', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G_US_FORIGN_ADDRESS_10TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', field17: '=', field17name: '@field17', rkey18: '@', field18: '=', field18name: '@field18', rkey19: '@', field19: '=', field19name: '@field19', rkey20: '@', field20: '=', field20name: '@field20', rkey21: '@', field21: '=', field21name: '@field21', rkey22: '@', field22: '=', field22name: '@field22', rkey23: '@', field23: '=', field23name: '@field23'
        },
        templateUrl: contentService.getLineTemplateUrl('t2586')
    };
}]);

angular.module('returnApp').directive('t2594', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15'
        },
        templateUrl: contentService.getLineTemplateUrl('t2594')
    };
}]);

angular.module('returnApp').directive('t2485', ['contentService', function (contentService) {
    //	ONE_LINE_3US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26', field27: '=', field27name: '@field27', field28: '=', field28name: '@field28'
        },
        templateUrl: contentService.getLineTemplateUrl('t2485')
    };
}]);

angular.module('returnApp').directive('t2601', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2601')
    };
}]);

angular.module('returnApp').directive('t2602', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CHK_TXT_CBO_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2602')
    };
}]);

angular.module('returnApp').directive('t2603', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FORIGN_ADDRESS_4CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2603')
    };
}]);

angular.module('returnApp').directive('t2604', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FORIGN_ADDRESS_5CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t2604')
    };
}]);

angular.module('returnApp').directive('t2550', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CHK_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2550')
    };
}]);

angular.module('returnApp').directive('t2605', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_8TXT_1CHK
    return {
        lineno: '@', restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t2605')
    };
}]);


angular.module('returnApp').directive('t2606', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_2CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2606')
    };
}]);

angular.module('returnApp').directive('t2607', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CBO_7TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2607')
    };
}]);

angular.module('returnApp').directive('t2609', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_YESNO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2609')
    };
}]);

angular.module('returnApp').directive('t2610', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2610')
    };
}]);

angular.module('returnApp').directive('t2611', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2RADIO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', value2: '@', field2: '=', field2name: '@field2', value3: '@', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2611')
    };
}]);

angular.module('returnApp').directive('t2612', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_2RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value7: '@', value8: '@', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2612')
    };
}]);

angular.module('returnApp').directive('t2608', ['contentService', function (contentService) {
    //	ONE_LINE_2CHK_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2608')
    };
}]);

angular.module('returnApp').directive('t2613', ['contentService', function (contentService) {
    //	ONE_LINE_BLANK_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2613')
    };
}]);

angular.module('returnApp').directive('t2614', ['contentService', function (contentService) {
    //	ONE_LINE_2BLANK_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2614')
    };
}]);

angular.module('returnApp').directive('t2615', ['contentService', function (contentService) {
    //	ONE_LINE_3BLANK_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2615')
    };
}]);

angular.module('returnApp').directive('t2616', ['contentService', function (contentService) {
    //	ONE_LINE_4BLANK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2616')
    };
}]);

angular.module('returnApp').directive('t2617', ['contentService', function (contentService) {
    //	ONE_LINE_5BLANK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2617')
    };
}]);

angular.module('returnApp').directive('t2618', ['contentService', function (contentService) {
    //	ONE_LINE_6BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2618')
    };
}]);

angular.module('returnApp').directive('t2620', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2620')
    };
}]);

angular.module('returnApp').directive('t2621', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_CBO_TXT_5YES_NO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7', value8: '@', field8: '=', field8name: '@field8', value9: '@', field9: '=', field9name: '@field9', value10: '@', field10: '=', field10name: '@field10', value11: '@', field11: '=', field11name: '@field11', value12: '@', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2621')
    };
}]);

angular.module('returnApp').directive('t2622', ['contentService', function (contentService) {
    //	ONE_LINE_2CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2622')
    };
}]);

angular.module('returnApp').directive('t2625', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2G_CHK_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2625')
    };
}]);

angular.module('returnApp').directive('t2624', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2G_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2624')
    };
}]);

angular.module('returnApp').directive('t2626', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CBO_TXT_CHK_CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t2626')
    };
}]);

angular.module('returnApp').directive('t2623', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2623')
    };
}]);

angular.module('returnApp').directive('t2632', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CBO_BLANK_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2632')
    };
}]);

angular.module('returnApp').directive('t2631', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CBO_CHK_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2631')
    };
}]);

angular.module('returnApp').directive('t2628', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_3TXT_LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2628')
    };
}]);

angular.module('returnApp').directive('t2629', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_3TXT_LBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2629')
    };
}]);

angular.module('returnApp').directive('t2630', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_2RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', value4: '@', field4name: '@field4', field5: '=', value5: '@', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2630')
    };
}]);

angular.module('returnApp').directive('t2633', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_ALL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2633')
    };
}]);

angular.module('returnApp').directive('t2634', ['contentService', function (contentService) {
    //	ONE_LINE_2TXTG_ALL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2634')
    };
}]);

angular.module('returnApp').directive('t2627', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_3G_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2627')
    };
}]);

angular.module('returnApp').directive('t2640', ['contentService', function (contentService) {
    //	ONE_LINE_11INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2640')
    };
}]);

angular.module('returnApp').directive('t2637', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLANK_TXT_8BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t2637')
    };
}]);

angular.module('returnApp').directive('t2638', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLANK_8TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2638')
    };
}]);

angular.module('returnApp').directive('t2639', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_7BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2639')
    };
}]);

angular.module('returnApp').directive('t2635', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CHK_2RADIO_2TXT_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', value12: '@', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2635')
    };
}]);

angular.module('returnApp').directive('t2636', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CHK_2RADIO_2TXT_CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2636')
    };
}]);

angular.module('returnApp').directive('t2467', ['contentService', function (contentService) {
    //	ONE_LINE_9TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2467')
    };
}]);

angular.module('returnApp').directive('t2641', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_CBO_4TXT_CHK_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2641')
    };
}]);

angular.module('returnApp').directive('t2591', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_TXT_LBL_TXT_LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2591')
    };
}]);

angular.module('returnApp').directive('t2642', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_TXT_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t2642')
    };
}]);

angular.module('returnApp').directive('t2644', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_1G_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2644')
    };
}]);

angular.module('returnApp').directive('t2645', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_2YES_NO_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2645')
    };
}]);

angular.module('returnApp').directive('t2643', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CBO_2TXT_2RADIO_TXT_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14', value15: '@', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t2643')
    };
}]);

angular.module('returnApp').directive('t2647', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_1G_4G_7G_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2647')
    };
}]);

angular.module('returnApp').directive('t2646', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_1G_4G_7G_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t2646')
    };
}]);

angular.module('returnApp').directive('t2649', ['contentService', function (contentService) {
    //	ONE_LINE_2RADIO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2649')
    };
}]);

angular.module('returnApp').directive('t2648', ['contentService', function (contentService) {
    //	ONE_LINE_2RADIO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', value1: '@', field1: '=', field1name: '@field1', value2: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2648')
    };
}]);

angular.module('returnApp').directive('t2651', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2651')
    };
}]);

angular.module('returnApp').directive('t2652', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_CodeLookUp_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2652')
    };
}]);

angular.module('returnApp').directive('t2653', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2TXT_1G_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2653')
    };
}]);

angular.module('returnApp').directive('t2654', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2TXT_1G_CBO_2TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2654')
    };
}]);

angular.module('returnApp').directive('t2655', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2TXT_CHK_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2655')
    };
}]);

angular.module('returnApp').directive('t2656', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2TXT_CHK_CBO_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2656')
    };
}]);

angular.module('returnApp').directive('t2657', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_2YES_NO_COMBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', value6: '@', field6: '=', field6name: '@field6', value7: '@', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t2657')
    };
}]);

angular.module('returnApp').directive('t2658', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_6TXT_CBO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21'
        },
        templateUrl: contentService.getLineTemplateUrl('t2658')
    };
}]);

angular.module('returnApp').directive('t2659', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_6TXT_CBO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2659')
    };
}]);

angular.module('returnApp').directive('t2661', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_US_FG_ADDRESS_2TXT_CBO_YES_NO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14', value15: '@', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t2661')
    };
}]);

angular.module('returnApp').directive('t2662', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_US_FG_ADDRESS_2TXT_CBO_YES_NO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2662')
    };
}]);

angular.module('returnApp').directive('t2663', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_5TXT_CBO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t2663')
    };
}]);

angular.module('returnApp').directive('t2664', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_5TXT_CBO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2664')
    };
}]);

angular.module('returnApp').directive('t2665', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_3G_2RADIO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', value5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t2665')
    };
}]);

angular.module('returnApp').directive('t2666', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_3G_2RADIO_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2666')
    };
}]);

angular.module('returnApp').directive('t2667', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXG_CBO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2667')
    };
}]);

angular.module('returnApp').directive('t2668', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXG_CBO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2668')
    };
}]);

angular.module('returnApp').directive('t2669', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXG_CHK_CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2669')
    };
}]);

angular.module('returnApp').directive('t2670', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_TXG_CHK_CBO_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2670')
    };
}]);

angular.module('returnApp').directive('t2671', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_3G_4G_US_FG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t2671')
    };
}]);

angular.module('returnApp').directive('t2673', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_3G_4G_US_FG_ADDRESS_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2673')
    };
}]);

angular.module('returnApp').directive('t2674', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_2BLNK_TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2674')
    };
}]);

angular.module('returnApp').directive('t2675', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t2675')
    };
}]);

angular.module('returnApp').directive('t2676', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3CBO_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2676')
    };
}]);

angular.module('returnApp').directive('t2677', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_TXT_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t2677')
    };
}]);

angular.module('returnApp').directive('t2678', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_TXT_CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2678')
    };
}]);

angular.module('returnApp').directive('t2679', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2679')
    };
}]);

angular.module('returnApp').directive('t2680', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_4BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t2680')
    };
}]);

angular.module('returnApp').directive('t2681', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_LBL_6RADIO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', rkey3: '@', value3: '@', field3: '=', field3name: '@field3', rkey4: '@', value4: '@', field4: '=', field4name: '@field4', rkey5: '@', value5: '@', field5: '=', field5name: '@field5', rkey6: '@', value6: '@', field6: '=', field6name: '@field6', rkey7: '@', value7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', value8: '@', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t2681')
    };
}]);

angular.module('returnApp').directive('t2682', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_6TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2682')
    };
}]);

angular.module('returnApp').directive('t2683', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2683')
    };
}]);

angular.module('returnApp').directive('t2684', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_YESNO_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2684')
    };
}]);

angular.module('returnApp').directive('t2685', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_YESNO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t2685')
    };
}]);

angular.module('returnApp').directive('t2686', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_3BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2686')
    };
}]);

angular.module('returnApp').directive('t2687', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_1G_BLANK_2TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2687')
    };
}]);

angular.module('returnApp').directive('t2688', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_6G_US_FOREIGN_ADDRESS_1TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2688')
    };
}]);

angular.module('returnApp').directive('t2689', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t2689')
    };
}]);

angular.module('returnApp').directive('t2690', ['contentService', function (contentService) {
    //	ONE_LINE_CHK_BLANK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2690')
    };
}]);

angular.module('returnApp').directive('t2691', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_1G_6G_US_FOREIGN_ADDRESS_1TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2691')
    };
}]);

angular.module('returnApp').directive('t2692', ['contentService', function (contentService) {
    //	TWO_LINE_8TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2692')
    };
}]);

angular.module('returnApp').directive('t2693', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_3TXT_2G_3G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t2693')
    };
}]);

angular.module('returnApp').directive('t2694', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_3TXT_2G_3G_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2694')
    };
}]);

angular.module('returnApp').directive('t2695', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FG_2TXT_2CBO_3TXT_YN_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2695')
    };
}]);

angular.module('returnApp').directive('t2696', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_2CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t2696')
    };
}]);

angular.module('returnApp').directive('t2697', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FG_2TXT_2CBO_4TXT_YN_TXT_YN_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', value19: '@', field19: '=', field19name: '@field19', value20: '@', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', value22: '@', field22: '=', field22name: '@field22', value23: '@', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t2697')
    };
}]);

angular.module('returnApp').directive('t2698', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FG_2TXT_2CBO_5TXT_YN
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', value20: '@', field20: '=', field20name: '@field20', value21: '@', field21: '=', field21name: '@field21'
        },
        templateUrl: contentService.getLineTemplateUrl('t2698')
    };
}]);

angular.module('returnApp').directive('t2699', ['contentService', function (contentService) {
    //	ONE_LINE_L_5RADIO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', value3: '@', field3: '=', field3name: '@field3', rkey4: '@', value4: '@', field4: '=', field4name: '@field4', rkey5: '@', value5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2699')
    };
}]);

angular.module('returnApp').directive('t2700', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CBO_TXT_YN_8TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22'
        },
        templateUrl: contentService.getLineTemplateUrl('t2700')
    };
}]);

angular.module('returnApp').directive('t2701', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2701')
    };
}]);

angular.module('returnApp').directive('t2702', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_2TXT_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t2702')
    };
}]);

angular.module('returnApp').directive('t2703', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FG_2TXT_2CBO_3TXT_YN
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', value18: '@', field18: '=', field18name: '@field18', value19: '@', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t2703')
    };
}]);

angular.module('returnApp').directive('t2704', ['contentService', function (contentService) {
    //	ONE_LINE_US_FG_7TXT_2CBO_3YN_RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', rkey3: '@', field4: '=', field4name: '@field4', rkey5: '@', field6: '=', field6name: '@field6', rkey7: '@', field8: '=', field8name: '@field8', rkey9: '@', field10: '=', field10name: '@field10', rkey11: '@', field12: '=', field12name: '@field12', rkey13: '@', value14: '@', field14: '=', field14name: '@field14', value15: '@', field15: '=', field15name: '@field15', rkey19: '@', field17: '=', field17name: '@field17', rkey18: '@', field19: '=', field19name: '@field19', rkey20: '@', value21: '@', field21: '=', field21name: '@field21', value22: '@', field22: '=', field22name: '@field22', rkey23: '@', field24: '=', field24name: '@field24', rkey25: '@', value26: '@', field26: '=', field26name: '@field26', value27: '@', field27: '=', field27name: '@field27', rkey28: '@', field29: '=', field29name: '@field29', rkey30: '@', rkey31: '@', field32: '=', field32name: '@field32', field33: '=', field33name: '@field33', field34: '=', field34name: '@field34', field35: '=', field35name: '@field35', field36: '=', field36name: '@field36', field37: '=', field37name: '@field37', field38: '=', field38name: '@field38', field39: '=', field39name: '@field39', field40: '=', field40name: '@field40'
        },
        templateUrl: contentService.getLineTemplateUrl('t2704')
    };
}]);

angular.module('returnApp').directive('t2705', ['contentService', function (contentService) {
    //  6CHKGRP
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t2705')
    };
}]);

angular.module('returnApp').directive('t2706', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2706')
    };
}]);

angular.module('returnApp').directive('t2708', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2CHK_CBO_7TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t2708')
    };
}]);

angular.module('returnApp').directive('t2709', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2CHK_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t2709')
    };
}]);

angular.module('returnApp').directive('t3710', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_1G_2G_5G_7G_8G_10G_US_FG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t3710')
    };
}]);

angular.module('returnApp').directive('t3711', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_1G_2G_5G_7G_8G_10G_US_FG_ADDRESS_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t3711')
    };
}]);

angular.module('returnApp').directive('t3712', ['contentService', function (contentService) {
    //	TWO_LINE_7TXT_US_FG_ADDRESS_TBL_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t3712')
    };
}]);

angular.module('returnApp').directive('t3713', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_BLANK_TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t3713')
    };
}]);

angular.module('returnApp').directive('t3714', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLANK_TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t3714')
    };
}]);

//2015 Tax Year Tax Line directive entry for the template added in Return Information Sheet that is required in Interview Mode.
angular.module('returnApp').directive('t4002', ['contentService', function (contentService) {
    //	ONE_LINE_L_CHK_LBL_TXTG_LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4002')
    };
}]);

angular.module('returnApp').directive('t4001', ['contentService', function (contentService) {
    //  W2G_5Lbl_5Txt_CBO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', lineno2: '@', rkey2: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', lineno4: '@', rkey4: '@', field4: '=', field4name: '@field4', lineno5: '@', rkey5: '@', field5: '=', field5name: '@field5', lineno6: '@', rkey6: '@', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4001')
    };
}]);

angular.module('returnApp').directive('t4715', ['contentService', function (contentService) {
    //	ONE_LINE_2CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4715')
    };
}]);

angular.module('returnApp').directive('t4716', ['contentService', function (contentService) {
    //	ONE_LINE_2CBO_2TXT_With_Lookup_Listner
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t4716')
    };
}]);

angular.module('returnApp').directive('t4005', ['contentService', function (contentService) {
    //	STATEDIRECTDEPOSIT_INTERVIEW
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t4005')
    };
}]);

angular.module('returnApp').directive('t4718', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_3BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t4718')
    };
}]);

angular.module('returnApp').directive('t4720', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_2BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t4720')
    };
}]);

angular.module('returnApp').directive('t4721', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_TXT_3RADIO_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', value12: '@', field12: '=', field12name: '@field12', value13: '@', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t4721')
    };
}]);

angular.module('returnApp').directive('t4722', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_4CHK_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4722')
    };
}]);

angular.module('returnApp').directive('t4724', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CBO_8TXT_2CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t4724')
    };
}]);

angular.module('returnApp').directive('t4725', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2BLANK_TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4725')
    };
}]);

angular.module('returnApp').directive('t4726', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_TXT_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t4726')
    };
}]);

angular.module('returnApp').directive('t4727', ['contentService', function (contentService) {
    //	ONE_LINE_3CBO_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4727')
    };
}]);

angular.module('returnApp').directive('t4728', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2G_CBO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4728')
    };
}]);

angular.module('returnApp').directive('t4729', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2G_CBO_6TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4729')
    };
}]);

angular.module('returnApp').directive('t2470', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_TXT_CBO
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t2470')
    };
}]);

angular.module('returnApp').directive('t4731', ['contentService', function (contentService) {
    //  ONE_LINE_10TXT_2CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t4731')
    };
}]);

angular.module('returnApp').directive('t4732', ['contentService', function (contentService) {
    //	ONE_LINE_13CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t4732')
    };
}]);

angular.module('returnApp').directive('t4733', ['contentService', function (contentService) {
    //	Disbursement_Method_EPS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', rkey6: '@', value6: '@', field6: '=', field6name: '@field6', rkey7: '@', value7: '@', field7: '=', field7name: '@field7', rkey8: '@', value8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', value11: '@', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4733')
    };
}]);

angular.module('returnApp').directive('t4736', ['contentService', function (contentService) {
    //  Disbursement_Method
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey6: '@', rkey7: '@', value7: '@', field7: '=', field7name: '@field7', rkey8: '@', value8: '@', field8: '=', field8name: '@field8', rkey9: '@', value9: '@', field9: '=', field9name: '@field9', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', value14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', rkey18: '@', value18: '@', field18: '=', field18name: '@field18', rkey19: '@', value19: '@', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t4736')
    };
}]);

angular.module('returnApp').directive('t4737', ['contentService', 'resellerService', function (contentService, resellerService) {
    //  atlas-audit-allies-fees
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1'
        },
        link: function (scope, element, attrs) {
            // Variable to get the complete reseller config
            var resellerConfig = resellerService.getResellerConfig();
            if (!_.isUndefined(resellerConfig)) {
                // Assign the shortcode to isShowAlliesFees variable to show/hide the Audit Allies fee
                scope.isShowAlliesFees = resellerConfig.shortCode;
            }
        },
        templateUrl: contentService.getLineTemplateUrl('t4737')
    };
}]);

//bankCardEnvelopeNumberWithoutApi
angular.module('returnApp').directive('cardEnvelopeNumberWithoutApi', [function () {
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@', rkey2: '@', field2: '=', field2name: '@'
        },
        link: function (scope, element, attrs) {
            // We have to bind blur event for textfield of field1.
            var cardNumber = element.children().children()[3].children[0];
            angular.element(cardNumber).bind('blur', function () {
                _compareCardNumber();
            });

            // We have to bind blur event for textfield of field2.
            var verifyCardNumber = element.children().children()[8].children[0];
            angular.element(verifyCardNumber).bind('blur', function () {
                _compareCardNumber();
            });

            //validate card Number
            //check whether field1 and field2 is not undefined and empty.
            //then check IF values match. IF 'NO' then display message.
            var _compareCardNumber = function () {
                if (scope.field1.value != undefined && scope.field1.value != "" && scope.field2.value != undefined && scope.field2.value != "") {
                    if (scope.field1.value == scope.field2.value) {
                        _resetData();
                    } else {
                        scope.isEnabled = true;
                        scope.lableText = "Card Envelope number does not match";
                    }
                } else {
                    _resetData();
                }
            };

            // reset flag and text.
            var _resetData = function () {
                scope.isEnabled = false;
                scope.lableText = "";
            };

            scope.$on('$destroy', function () {
                angular.element(cardNumber).unbind('blur');
                angular.element(verifyCardNumber).unbind('blur');
            });
        },
        template: '<div class="row"><div class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-1 col-md-1 col-lg-1"></div><tax-label class="col-sm-5 col-md-5 col-lg-5" rkey="{{rkey1}}"></tax-label><tax-textbox class="col-sm-4 col-md-4 col-lg-4" field="field1" fieldname="{{field1name}}"></tax-textbox><i class="fa padding_top_15 cursor_pointer"></i> </div><div class="row"><div class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-1 col-md-1 col-lg-1"></div><tax-label class="col-sm-5 col-md-5 col-lg-5" rkey="{{rkey2}}"></tax-label><tax-textbox class="col-sm-4 col-md-4 col-lg-4" field="field2" fieldname="{{field2name}}"></tax-textbox> <lable class="text-danger_normal" style="vertical-align: -webkit-baseline-middle;" ng-show="isEnabled">{{lableText}}</lable></div>'
    };
}]);

angular.module('returnApp').directive('t4734', ['contentService', function (contentService) {
    //  ONE_LINE_4TXT_2BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4734')
    };
}]);

angular.module('returnApp').directive('t4735', ['contentService', function (contentService) {
    //  ONE_LINE_3TXT_3BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4735')
    };
}]);

angular.module('returnApp').directive('t4738', ['contentService', function (contentService) {
    //	Disbursement_Method_TPG
    return {
        restrict: 'E',
        scope: {
            //lineno: '@',rkey1: '@',value1: '@', field1: '=', field1name: '@field1', rkey2: '@',value2: '@', field2: '=', field2name: '@field2', rkey3: '@',field3: '=', field3name: '@field3', rkey4: '@',field4: '=', field4name: '@field4', rkey5: '@',rkey6: '@',value6: '@', field6: '=', field6name: '@field6', rkey7: '@',value7: '@', field7: '=', field7name: '@field7', rkey8: '@',value8: '@', field8: '=', field8name: '@field8', rkey9: '@',field9: '=', field9name: '@field9', rkey10: '@',field10: '=', field10name: '@field10', rkey11: '@',value11: '@', field11: '=', field11name: '@field11', rkey12: '@',value12: '@', field12: '=', field12name: '@field12'
            lineno: '@', rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', rkey6: '@', value6: '@', field6: '=', field6name: '@field6', rkey7: '@', value7: '@', field7: '=', field7name: '@field7', rkey8: '@', value8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', value11: '@', field11: '=', field11name: '@field11', rkey12: '@', value12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', field17: '=', field17name: '@field17', rkey18: '@', rkey19: '@', value19: '@', field19: '=', field19name: '@field19', rkey20: '@', value20: '@', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t4738')
    };
}]);

angular.module('returnApp').directive('t4739', ['contentService', function (contentService) {
    //  ONE_LINE_TXT_4BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4739')
    };
}]);

angular.module('returnApp').directive('t4740', ['contentService', function (contentService) {
    //  ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CBO_11TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22'
        },
        templateUrl: contentService.getLineTemplateUrl('t4740')
    };
}]);

angular.module('returnApp').directive('t4741', ['contentService', function (contentService) {
    //  Dependent_Statement_2015
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t4741')
    };
}]);

angular.module('returnApp').directive('t4743', ['contentService', function (contentService) {
    //  ONE_LINE_CHK_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4743')
    };
}]);

angular.module('returnApp').directive('t4744', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CBO_2TXT_2RADIO_CHK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', value14: '@', field14: '=', field14name: '@field14', value15: '@', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t4744')
    };
}]);

angular.module('returnApp').directive('t4745', ['contentService', function (contentService) {
    //	ONE_LINE_2RADIO_7TXT_LBL_TXTG
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', rkey10: '@', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4745')
    };
}]);

angular.module('returnApp').directive('t4746', ['contentService', function (contentService) {
    //	ONE_LINE_2RADIO_7TXT_LBL_TXTG_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4746')
    };
}]);

angular.module('returnApp').directive('t4747', ['contentService', function (contentService) {
    //  ONE_LINE_TXTG_US_FOREIGN_ADDRESS_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t4747')
    };
}]);

angular.module('returnApp').directive('t4748', ['contentService', function (contentService) {
    //  SIX_LINE_12TXT_1CHK_13LBL_2G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t4748')
    };
}]);

angular.module('returnApp').directive('t4749', ['contentService', function (contentService) {
    //	SIX_LINE_17TXT_2CHK_19LBL_2G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@', rkey14: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', rkey15: '@', rkey16: '@', rkey17: '@', rkey18: '@', rkey19: '@', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t4749')
    };
}]);

angular.module('returnApp').directive('t4750', ['contentService', function (contentService) {
    //  ONE_LINE_2TXT_2G_CBO_3TXT_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4750')
    };
}]);

angular.module('returnApp').directive('t4751', ['contentService', function (contentService) {
    //	MainInfo_FormSel_2016
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@', rkey8: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4751')
    };
}]);

angular.module('returnApp').directive('t4752', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_CBO_LBL_CBO_LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4752')
    };
}]);

angular.module('returnApp').directive('t4753', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_2TXT_CHK_2TXT_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t4753')
    };
}]);

angular.module('returnApp').directive('t4754', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t4754')
    };
}]);

angular.module('returnApp').directive('t4758', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_TXT_CBO_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4758')
    };
}]);

angular.module('returnApp').directive('t4759', ['contentService', function (contentService) {
    //	ONE_LINE_3CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t4759')
    };
}]);

angular.module('returnApp').directive('t4761', ['contentService', function (contentService) {
    //	ONE_LINE_R_2RADIO_1BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4761')
    };
}]);

angular.module('returnApp').directive('t4762', ['contentService', function (contentService) {
    //	ONE_LINE_R_2RADIO_2BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4762')
    };
}]);

angular.module('returnApp').directive('t4763', ['contentService', function (contentService) {
    //	W2LINE_F_AND_LINE_14
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field12: '=', field12name: '@field12', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25', field26: '=', field26name: '@field26', field27: '=', field27name: '@field27', field28: '=', field28name: '@field28', field29: '=', field29name: '@field29', field30: '=', field30name: '@field30', field31: '=', field31name: '@field31', field32: '=', field32name: '@field32', field33: '=', field33name: '@field33', field34: '=', field34name: '@field34', field35: '=', field35name: '@field35', field36: '=', field36name: '@field36', field37: '=', field37name: '@field37', field38: '=', field38name: '@field38', rkey39: '@', rkey40: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4763')
    };
}]);

angular.module('returnApp').directive('t4764', ['contentService', function (contentService) {
    //	ONE_LINE_L_RADIO_LBL_TXTG_INNER
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4764')
    };
}]);

angular.module('returnApp').directive('t4765', ['contentService', function (contentService) {
    //	ONE_LINE_L_RADIO_LBL_CBO_LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4765')
    };
}]);

angular.module('returnApp').directive('t4766', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_3RADIO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4766')
    };
}]);

angular.module('returnApp').directive('t4767', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_3RADIO_2TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4767')
    };
}]);

angular.module('returnApp').directive('t4768', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_5TXT_CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19'
        },
        templateUrl: contentService.getLineTemplateUrl('t4768')
    };
}]);

angular.module('returnApp').directive('t4769', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4769')
    };
}]);

angular.module('returnApp').directive('t4770', ['contentService', function (contentService) {
    //  ONE_LINE_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', 'field3name': '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4770')
    };
}]);

angular.module('returnApp').directive('t4771', ['contentService', function (contentService) {
    //  Dependent_Statement_2015
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22'
        },
        templateUrl: contentService.getLineTemplateUrl('t4771')
    };
}]);

angular.module('returnApp').directive('t4772', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLANK_3TXT_2BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5'
        },
        templateUrl: contentService.getLineTemplateUrl('t4772')
    };
}]);

angular.module('returnApp').directive('t4773', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2BLANK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4773')
    };
}]);

angular.module('returnApp').directive('t4774', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_BLANK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t4774')
    };
}]);

angular.module('returnApp').directive('t4775', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLANK_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4775')
    };
}]);

angular.module('returnApp').directive('t4776', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_4BLANK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4776')
    };
}]);

angular.module('returnApp').directive('t4777', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2G_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4777')
    };
}]);

angular.module('returnApp').directive('t4778', ['contentService', function (contentService) {
    //	 ONE_LINE_R_2RADIO_Interview_Mode
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4778')
    };
}]);

angular.module('returnApp').directive('t4779', ['contentService', function (contentService) {
    //	SIX_LINE_17LBL_17TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t4779')
    };
}]);

angular.module('returnApp').directive('t4780', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G_CBO_TXT_CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4780')
    };
}]);

angular.module('returnApp').directive('t4781', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_1G_3G_CBO_TXT_CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4781')
    };
}]);

angular.module('returnApp').directive('t4782', ['contentService', function (contentService) {
    //	FILING_STATUS_PANEL_HEADER
    return {
        restrict: 'E',
        scope: {
            rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4782')
    };
}]);

angular.module('returnApp').directive('t4783', ['contentService', function (contentService) {
    //	TWO_LINE_LBL_TEXTAREA
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1'
        },
        templateUrl: contentService.getLineTemplateUrl('t4783')
    };
}]);

angular.module('returnApp').directive('t4784', ['contentService', function (contentService) {
    //  TWO_LINE_LBL_TEXTAREA
    return {
        restrict: 'E',
        scope: {
            field1: '=', field2: '='
        },
        templateUrl: contentService.getLineTemplateUrl('t4784')
    };
}]);

angular.module('returnApp').directive('t4786', ['contentService', function (contentService) {
    //  Card_Envelop_No
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4786')
    };
}]);

angular.module('returnApp').directive('t4787', ['contentService', function (contentService) {
    //  TWO_LINE_LBL_TEXTAREA
    return {
        restrict: 'E',
        scope: {
            rkey: '@', field1: '=', field2: '='
        },
        templateUrl: contentService.getLineTemplateUrl('t4787')
    };
}]);

angular.module('returnApp').directive('t4788', ['contentService', function (contentService) {
    //	ONE_LINE_HTML_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4788')
    };
}]);

angular.module('returnApp').directive('t4789', ['contentService', function (contentService) {
    //	ONE_LINE_L_PROTECTIONPLUS_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t4789')
    };
}]);

angular.module('returnApp').directive('t4790', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_CMB_CHK_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t4790')
    };
}]);

angular.module('returnApp').directive('t4791', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_CMB_CHK_5TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4791')
    };
}]);

angular.module('returnApp').directive('t4792', ['contentService', function (contentService) {
    //	TWO_LINE_7TXT_US_FG_ADDRESS_TBL_2CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18'
        },
        templateUrl: contentService.getLineTemplateUrl('t4792')
    };
}]);

angular.module('returnApp').directive('t4793', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2CHK_5TXT_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', value2: '@', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t4793')
    };
}]);

angular.module('returnApp').directive('t4794', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2CHK_5TXT_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4794')
    };
}]);

angular.module('returnApp').directive('t4795', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CBO_13CHK_TBL_1G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t4795')
    };
}]);

angular.module('returnApp').directive('t4796', ['contentService', function (contentService) {
    //	BANK_PRODUCT_MESSAGE
    return {
        restrict: 'E',
        scope: {
            rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4796')
    };
}]);

angular.module('returnApp').directive('t4797', ['contentService', function (contentService) {
    //	IN_STATE_PANEL_HEADER
    return {
        restrict: 'E',
        scope: {
            rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4797')
    };
}]);

angular.module('returnApp').directive('t4798', ['contentService', function (contentService) {
    //	NC_STATE_PANEL_HEADER
    return {
        restrict: 'E',
        scope: {
            rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4798')
    };
}]);

angular.module('returnApp').directive('t4799', ['contentService', function (contentService) {
    //	ONE_LINE_4CBO_6TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4799')
    };
}]);

angular.module('returnApp').directive('t4800', ['contentService', function (contentService) {
    //  MULTI_LINE_4TXT_3CHK_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4800')
    };
}]);

angular.module('returnApp').directive('t4801', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_WITH_LINENO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4801')
    };
}]);

angular.module('returnApp').directive('t4802', ['contentService', function (contentService) {
    //	ONE_LINE_BLNK_TXT_BLNK_TXT_BLNK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4802')
    };
}]);

angular.module('returnApp').directive('t4803', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_TXT_BLNK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4803')
    };
}]);

angular.module('returnApp').directive('t4804', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_2TXT_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4804')
    };
}]);

angular.module('returnApp').directive('t4805', ['contentService', function (contentService) {
    //	CIS_PERSONAL_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', field5: '=', field5name: '@field5', rkey6: '@', field6: '=', field6name: '@field6', rkey7: '@', field7: '=', field7name: '@field7', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', rkey12: '@', field12: '=', field12name: '@field12', rkey13: '@', field13: '=', field13name: '@field13', rkey14: '@', field14: '=', field14name: '@field14', rkey15: '@', field15: '=', field15name: '@field15', rkey16: '@', field16: '=', field16name: '@field16', rkey17: '@', field17: '=', field17name: '@field17', rkey18: '@', field18: '=', field18name: '@field18', rkey19: '@', field19: '=', field19name: '@field19', rkey20: '@', field20: '=', field20name: '@field20', rkey21: '@', field21: '=', field21name: '@field21'
        },
        templateUrl: contentService.getLineTemplateUrl('t4805')
    };
}]);

angular.module('returnApp').directive('t4806', ['contentService', function (contentService) {
    //	TWO_LINE_TXTG_TXT_CBO_TXT_3CBO_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t4806')
    };
}]);

angular.module('returnApp').directive('t4807', ['contentService', function (contentService) {
    //	ONE_LINE_11TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4807')
    };
}]);

angular.module('returnApp').directive('t4808', ['contentService', function (contentService) {
    //	EFWWithPaperChk
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', value11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4808')
    };
}]);

angular.module('returnApp').directive('t4809', ['contentService', function (contentService) {
    //  SDDWithPaperChk
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', value1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value3: '@', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', value8: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4809')
    };
}]);

angular.module('returnApp').directive('t4810', ['contentService', function (contentService) {
    //	ONE_LINE_2CBO_BLANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4810')
    };
}]);

angular.module('returnApp').directive('t4811', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_TXT_CBO_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4811')
    };
}]);

angular.module('returnApp').directive('t4812', ['contentService', '$injector', 'returnService', function (contentService, $injector, returnService) {
    //	Disbursement_Method_TPG_2017
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@', rkey8: '@', field8: '=', field8name: '@field8', value8: '@', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11', value11: '@', rkey12: '@', field12: '=', field12name: '@field12', value12: '@'
        },
        link: function (scope, element, attrs) {
            //to show popup when customer is not resgister for card potion in tpg bank 2017
            scope.showPopup = function () {

                var instantCardOptInValueFromAck = returnService.getElementValue('instantCardOptInValueFromAck', 'dTPGBankApp');
                var paperCheck = returnService.getElementValue('PaperCheck', 'dTPGBankApp');
                if (paperCheck === '3' && instantCardOptInValueFromAck !== 'X') {
                    var dialogService = $injector.get('dialogService');
                    var textMsg = "If you have not already opted into the Green Dot debit card program upon completion of your enrollment process, please make sure to go to TPG’s website at <a>www.sbtpg.com</a> and opt-in to the program on the Programs opt-in page.";
                    //Dialog configuration
                    var dialogConfig = { "title": "Notification", "text": textMsg };
                    //Show dialog
                    var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
                }
            }
        },
        templateUrl: contentService.getLineTemplateUrl('t4812')
    };
}]);

angular.module('returnApp').directive('t4813', ['contentService', function (contentService) {
    //	IN_STATE_PANEL_HEADER_2017
    return {
        restrict: 'E',
        scope: {
            rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4813')
    };
}]);

angular.module('returnApp').directive('t4814', ['contentService', function (contentService) {
    //	RIS_PREPARER_INFO_2017
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', value19: '@', field20: '=', field20name: '@field20', value20: '@', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23'
        },
        templateUrl: contentService.getLineTemplateUrl('t4814')
    };
}]);

angular.module('returnApp').directive('t4817', ['contentService', function (contentService) {
    //	BANK_PRODUCT_MESSAGE
    return {
        restrict: 'E',
        scope: {
            rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4817')
    };
}]);

angular.module('returnApp').directive('t4818', ['contentService', function (contentService) {
    //	BANK_PRODUCT_MESSAGE
    return {
        restrict: 'E',
        scope: {
            rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4818')
    };
}]);

angular.module('returnApp').directive('t4819', ['contentService', function (contentService) {
    //	BANK_PRODUCT_MESSAGE
    return {
        restrict: 'E',
        scope: {
            rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4819')
    };
}]);

angular.module('returnApp').directive('t4820', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CHK_7TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4820')
    };
}]);

angular.module('returnApp').directive('t4821', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CHK_7TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4821')
    };
}]);

angular.module('returnApp').directive('t4822', ['contentService', function (contentService) {
    //	BANK_PRODUCT_MESSAGE
    return {
        restrict: 'E',
        scope: {
            rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4822')
    };
}]);

angular.module('returnApp').directive('t4823', ['contentService', function (contentService) {
    //  TXTG_CMB_2TXT_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t4823')
    };
}]);

angular.module('returnApp').directive('t4824', ['contentService', function (contentService) {
    //	TXTG_CMB_12TXT_US_FOREIGN_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23'
        },
        templateUrl: contentService.getLineTemplateUrl('t4824')
    };
}]);

angular.module('returnApp').directive('t4825', ['contentService', function (contentService) {
    //	TXTG_CBO_TXT_2CBO_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t4825')
    };
}]);

angular.module('returnApp').directive('t4826', ['contentService', function (contentService) {
    //	MULTI_LINE_6TXT_YN_2TXT_YN_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', rkey3: '@', field4: '=', field4name: '@field4', rkey5: '@', field6: '=', field6name: '@field6', rkey7: '@', field8: '=', field8name: '@field8', rkey9: '@', field10: '=', field10name: '@field10', rkey11: '@', field12: '=', field12name: '@field12', rkey13: '@', rkey14: '@', field15: '=', field15name: '@field15', value15: '@', rkey16: '@', field17: '=', field17name: '@field17', value17: '@', rkey18: '@', field19: '=', field19name: '@field19', rkey20: '@', field21: '=', field21name: '@field21', rkey22: '@', rkey23: '@', field24: '=', field24name: '@field24', value24: '@', rkey25: '@', field26: '=', field26name: '@field26', value26: '@', rkey27: '@', field28: '=', field28name: '@field28', rkey29: '@', field30: '=', field30name: '@field30'
        },
        templateUrl: contentService.getLineTemplateUrl('t4826')
    };
}]);

angular.module('returnApp').directive('t4827', ['contentService', function (contentService) {
    //	MainInfo_FormSel_2018
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@', rkey5: '@', field5: '=', field5name: '@field5', value5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7'
        },
        templateUrl: contentService.getLineTemplateUrl('t4827')
    };
}]);

angular.module('returnApp').directive('t4828', ['contentService', function (contentService) {
    //	ONE_LINE_11TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t4828')
    };
}]);

angular.module('returnApp').directive('t4829', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_11TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t4829')
    };
}]);

angular.module('returnApp').directive('t4830', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_2CHK_TBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4830')
    };
}]);

angular.module('returnApp').directive('t4831', ['contentService', function (contentService) {
    //	ONE_LINE_10TXT_2CBO_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4831')
    };
}]);

angular.module('returnApp').directive('t4832', ['contentService', function (contentService) {
    //  Dependent_Statement_2018
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23'
        },
        templateUrl: contentService.getLineTemplateUrl('t4832')
    };
}]);

angular.module('returnApp').directive('t4833', ['contentService', function (contentService) {
    //	ONE_LINE_1TXG_2CBO_3TXT_YESNO_US_FG_ADDRESS
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', value8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17'
        },
        templateUrl: contentService.getLineTemplateUrl('t4833')
    };
}]);

angular.module('returnApp').directive('t4834', ['contentService', function (contentService) {
    //	ONE_LINE_1TXG_2CBO_3TXT_YESNO_US_FG_ADDRESS_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4834')
    };
}]);

angular.module('returnApp').directive('t4835', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CHK_TXT_2CHK_5TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4835')
    };
}]);

angular.module('returnApp').directive('t4836', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CHK_TXT_2CHK_5TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4836')
    };
}]);

angular.module('returnApp').directive('t4837', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2CHK_TXT_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4837')
    };
}]);

angular.module('returnApp').directive('t4838', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2CHK_TXT_CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4838')
    };
}]);

angular.module('returnApp').directive('t4839', ['contentService', function (contentService) {
    //	ONE_LINE_DISPLAY_PARENT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', fieldname: '@field1'
        },
        templateUrl: contentService.getLineTemplateUrl('t4839')
    };
}]);

angular.module('returnApp').directive('t4840', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_2CHK_TXT_CHK_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t4840')
    };
}]);

angular.module('returnApp').directive('t4841', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_2CHK_TXT_CHK_TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4841')
    };
}]);

angular.module('returnApp').directive('t4842', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_3RADIO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', value3: '@', rkey4: '@', field4: '=', field4name: '@field4', value4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4842')
    };
}]);

angular.module('returnApp').directive('t4843', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_HTML_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4843')
    };
}]);

angular.module('returnApp').directive('t4844', ['contentService', function (contentService) {
    //	Disbursement_Method_EPS_2018
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', value1: '@', field1: '=', field1name: '@field1', rkey2: '@', value2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', rkey6: '@', value6: '@', field6: '=', field6name: '@field6', rkey7: '@', value7: '@', field7: '=', field7name: '@field7', rkey8: '@', value8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', rkey10: '@', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4844')
    };
}]);

angular.module('returnApp').directive('t4845', ['contentService', function (contentService) {
    //	FOUR_LINE_ADDRESS_14TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t4845')
    };
}]);

angular.module('returnApp').directive('t4846', ['contentService', function (contentService) {
    //	IN_STATE_PANEL_HEADER_2018
    return {
        restrict: 'E',
        scope: {
            rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4846')
    };
}]);

angular.module('returnApp').directive('t4847', ['contentService', function (contentService) {
    //	ONE_LINE_L_RADIO_BANK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field', value: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4847')
    };
}]);

angular.module('returnApp').directive('t4848', ['contentService', function (contentService) {
    //	Disbursement_Method_Navigator
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', value1: '@', rkey2: '@', field2: '=', field2name: '@field2', value2: '@', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4', rkey5: '@', rkey6: '@', field6: '=', field6name: '@field6', value6: '@', rkey7: '@', field7: '=', field7name: '@field7', value7: '@', rkey8: '@', field8: '=', field8name: '@field8', rkey9: '@', field9: '=', field9name: '@field9', value9: '@', rkey10: '@', field10: '=', field10name: '@field10', rkey11: '@', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4848')
    };
}]);

angular.module('returnApp').directive('t4849', ['contentService', function (contentService) {
    //	DEP_INFO_LABEL_WITH_LINK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4849')
    };
}]);

angular.module('returnApp').directive('t4850', ['contentService', function (contentService) {
    //	ONE_LINE_DISPLAY_SUBMISSION_ID
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', fieldname: '@field1'
        },
        templateUrl: contentService.getLineTemplateUrl('t4850')
    };
}]);

angular.module('returnApp').directive('t4851', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_HEADER
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4851')
    };
}]);

angular.module('returnApp').directive('t4852', ['contentService', function (contentService) {
    //	ONE_LINE_4CHK_4CHK_2CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', rkey11: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4852')
    };
}]);

angular.module('returnApp').directive('t4853', ['contentService', function (contentService) {
    //	ONE_LINE_4CHK_4CHK_2CHK_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4853')
    };
}]);

angular.module('returnApp').directive('t4854', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_CBO_TXT_4RADIO_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11'
        },
        templateUrl: contentService.getLineTemplateUrl('t4854')
    };
}]);

angular.module('returnApp').directive('t4855', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_4RADIO_4TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4855')
    };
}]);

angular.module('returnApp').directive('t4857', ['contentService', function (contentService) {
    //	ONE_LINE_8TXT_1G_3G_4G_US_FG_ADDRESS_CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', rkey18: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4857')
    };
}]);

angular.module('returnApp').directive('t4858', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_TXT_LBL_TXT_LBL_TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4858')
    };
}]);

angular.module('returnApp').directive('t4859', ['contentService', function (contentService) {
    //  Dependent_Statement_2019
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24'
        },
        templateUrl: contentService.getLineTemplateUrl('t4859')
    };
}]);

angular.module('returnApp').directive('t4860', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2CHK_CBO_5TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4860')
    };
}]);

angular.module('returnApp').directive('t4861', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_2CHK_CBO_5TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4861')
    };
}]);

angular.module('returnApp').directive('t4862', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_BLNK_2018
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4862')
    };
}]);

angular.module('returnApp').directive('t4863', ['contentService', function (contentService) {
    //	ONE_LINE_3BLANK_4TXT_BLNK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4863')
    };
}]);

angular.module('returnApp').directive('t4864', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_CMB_3TXT_CMB
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4864')
    };
}]);

angular.module('returnApp').directive('t4865', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_ADDRESS_CMB_2TXT_2CMB
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4865')
    };
}]);

angular.module('returnApp').directive('t4866', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CHK_2TXT_CMB_4TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10'
        },
        templateUrl: contentService.getLineTemplateUrl('t4866')
    };
}]);

angular.module('returnApp').directive('t4867', ['contentService', function (contentService) {
    //	ONE_LINE_BLNK_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4867')
    };
}]);

angular.module('returnApp').directive('t4868', ['contentService', function (contentService) {
    //	ONE_LINE_Zip_City_State
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4868')
    };
}]);

angular.module('returnApp').directive('t4869', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_CBO_7TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4869')
    };
}]);

angular.module('returnApp').directive('t4870', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FG_2TXT_2CBO_5TXT_1CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20'
        },
        templateUrl: contentService.getLineTemplateUrl('t4870')
    };
}]);

angular.module('returnApp').directive('t4871', ['contentService', function (contentService) {
    //	ONE_LINE_L_CHK_HTML_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t4871')
    };
}]);

angular.module('returnApp').directive('t4872', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2RADIO_1CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8'
        },
        templateUrl: contentService.getLineTemplateUrl('t4872')
    };
}]);

angular.module('returnApp').directive('t4873', ['contentService', function (contentService) {
    //	ONE_LINE_5TXT_2RADIO_1CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4873')
    };
}]);

angular.module('returnApp').directive('t4874', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2RADIO_1CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', value4: '@', field5: '=', field5name: '@field5', value5: '@', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4874')
    };
}]);

angular.module('returnApp').directive('t4875', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2RADIO_1CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4875')
    };
}]);

angular.module('returnApp').directive('t4876', ['contentService', function (contentService) {
    //	ONE_LINE_2LBL_HEADER_MIDDLE
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4876')
    };
}]);

angular.module('returnApp').directive('t4877', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3TXT_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14'
        },
        templateUrl: contentService.getLineTemplateUrl('t4877')
    };
}]);

angular.module('returnApp').directive('t4878', ['contentService', function (contentService) {
    //	ONE_LINE_TXTG_US_FOREIGN_ADDRESS_3TXT_CBO_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4878')
    };
}]);

angular.module('returnApp').directive('t4879', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_CIS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4879')
    };
}]);

angular.module('returnApp').directive('t4880', ['contentService', function (contentService) {
    //	ONE_LBL_R_2CHK_ONLY_CIS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4880')
    };
}]);

angular.module('returnApp').directive('t4881', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_INFO_CIS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4881')
    };
}]);

angular.module('returnApp').directive('t4882', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_4LBL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4882')
    };
}]);

angular.module('returnApp').directive('t4883', ['contentService', function (contentService) {
    //  ONE_LINE_2TXT_LastNameListner_CIS
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', 'field3name': '@field3'
        },
        templateUrl: contentService.getLineTemplateUrl('t4883')
    };
}]);

angular.module('returnApp').directive('t4884', ['contentService', function (contentService) {
    //	3TXT_1G_3G_CBO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', field1: '=', field1name: '@field1', rkey2: '@', field2: '=', field2name: '@field2', rkey3: '@', field3: '=', field3name: '@field3', rkey4: '@', field4: '=', field4name: '@field4'
        },
        templateUrl: contentService.getLineTemplateUrl('t4884')
    };
}]);

angular.module('returnApp').directive('t4885', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_3CHK_1TXT_1CHK_3TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4885')
    };
}]);

angular.module('returnApp').directive('t4886', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_3CHK_1TXT_1CHK_3TXT_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4886')
    };
}]);

angular.module('returnApp').directive('t4887', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_WKT_HDR
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4887')
    };
}]);

angular.module('returnApp').directive('t4888', ['contentService', function (contentService) {
    //	ONE_LINE_LBL_WKT_FTR
    return {
        restrict: 'E',
        scope: {

        },
        templateUrl: contentService.getLineTemplateUrl('t4888')
    };
}]);

angular.module('returnApp').directive('t4889', ['contentService', function (contentService) {
    //	ONE_LINE_5LBL_K1PS
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4889')
    };
}]);

angular.module('returnApp').directive('t4890', ['contentService', function (contentService) {
    //	ONE_LINE_TXT_BLNK_SMALL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field: '=', fieldname: '@field'
        },
        templateUrl: contentService.getLineTemplateUrl('t4890')
    };
}]);

angular.module('returnApp').directive('t4891', ['contentService', function (contentService) {
    //	ONE_LINE_2TXT_SMALL
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2'
        },
        templateUrl: contentService.getLineTemplateUrl('t4891')
    };
}]);

angular.module('returnApp').directive('t4892', ['contentService', function (contentService) {
    //	FOUR_LINE_USFG_ADDRESS_15TXT
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16', field17: '=', field17name: '@field17', field18: '=', field18name: '@field18', field19: '=', field19name: '@field19', field20: '=', field20name: '@field20', field21: '=', field21name: '@field21', field22: '=', field22name: '@field22', field23: '=', field23name: '@field23', field24: '=', field24name: '@field24', field25: '=', field25name: '@field25'
        },
        templateUrl: contentService.getLineTemplateUrl('t4892')
    };
}]);

angular.module('returnApp').directive('t4893', ['contentService', function (contentService) {
    //	ONE_LINE_1G_11TXT_TBL
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t4893')
    };
}]);

angular.module('returnApp').directive('t4894', ['contentService', function (contentService) {
    //	ONE_LINE_12TXT_TBLINFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4894')
    };
}]);

angular.module('returnApp').directive('t4895', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2CHK_3TXT_5CHK
    return {
        restrict: 'E',
        scope: {
            field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13'
        },
        templateUrl: contentService.getLineTemplateUrl('t4895')
    };
}]);

angular.module('returnApp').directive('t4896', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2CHK_3TXT_5CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@', rkey10: '@', rkey11: '@', rkey12: '@', rkey13: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4896')
    };
}]);

angular.module('returnApp').directive('t4897', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2CHK_1TXT_2CHK_1TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4897')
    };
}]);

angular.module('returnApp').directive('t4898', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_2CHK_1TXT_2CHK_1TXT_INFO
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@', rkey8: '@', rkey9: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4898')
    };
}]);

angular.module('returnApp').directive('t4899',['contentService',function (contentService) {
    //	EIC_Dependent_Information
    return {
        restrict: 'E',
        scope: {
        	lineno: '@', rkey1: '@',field1: '=', field1name: '@field1', rkey2: '@',field2: '=', field2name: '@field2', rkey3: '@',field3: '=', field3name: '@field3', rkey4: '@',rkey5: '@',field5: '=', field5name: '@field5', value5: '@', rkey6: '@',field6: '=', field6name: '@field6', value6: '@', rkey7: '@',rkey8: '@',field8: '=', field8name: '@field8', value8: '@', rkey9: '@',field9: '=', field9name: '@field9', value9: '@', rkey10: '@',rkey11: '@',field11: '=', field11name: '@field11', value11: '@', rkey12: '@',field12: '=', field12name: '@field12', value12: '@', rkey13: '@',rkey14: '@',field14: '=', field14name: '@field14', value14: '@', rkey15: '@',field15: '=', field15name: '@field15', value15: '@', rkey16: '@',field16: '=', field16name: '@field16'
        },
      templateUrl: contentService.getLineTemplateUrl('t4899')
    };
}]);

angular.module('returnApp').directive('t4900', ['contentService', function (contentService) {
    //	ONE_LINE_4TXT_TBL_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4900')
    };
}]);

angular.module('returnApp').directive('t4901', ['contentService', function (contentService) {
    //	ONE_LINE_7TXT_TBL_INFO_5471
    return {
        restrict: 'E',
        scope: {
            rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4901')
    };
}]);

angular.module('returnApp').directive('t4902', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2TXT_2RADIO_TXTG
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', value4: '@', field4: '=', field4name: '@field4', value5: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6'
        },
        templateUrl: contentService.getLineTemplateUrl('t4902')
    };
}]);

angular.module('returnApp').directive('t4903', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_2TXT_2RADIO_TXTG_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4903')
    };
}]);

angular.module('returnApp').directive('t4904', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_2RADIO_1CHK
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', value6: '@', field7: '=', field7name: '@field7', value7: '@', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9'
        },
        templateUrl: contentService.getLineTemplateUrl('t4904')
    };
}]);

angular.module('returnApp').directive('t4905', ['contentService', function (contentService) {
    //	ONE_LINE_6TXT_2RADIO_1CHK_INFO
    return {
        restrict: 'E',
        scope: {
            lineno: '@', rkey1: '@', rkey2: '@', rkey3: '@', rkey4: '@', rkey5: '@', rkey6: '@', rkey7: '@'
        },
        templateUrl: contentService.getLineTemplateUrl('t4905')
    };
}]);

angular.module('returnApp').directive('t4907', ['contentService', function (contentService) {
    //	ONE_LINE_3TXT_13CHK_TBL_1G
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12', field13: '=', field13name: '@field13', field14: '=', field14name: '@field14', field15: '=', field15name: '@field15', field16: '=', field16name: '@field16'
        },
        templateUrl: contentService.getLineTemplateUrl('t4907')
    };
}]);

angular.module('returnApp').directive('t4908', ['contentService', function (contentService) {
    //	ONE_LINE_CBO_USFG_ADDRESS_2TXT
    return {
        restrict: 'E',
        scope: {
            lineno: '@', field1: '=', field1name: '@field1', field2: '=', field2name: '@field2', field3: '=', field3name: '@field3', field4: '=', field4name: '@field4', rkey4: '@', field5: '=', field5name: '@field5', field6: '=', field6name: '@field6', field7: '=', field7name: '@field7', field8: '=', field8name: '@field8', rkey8: '@', field9: '=', field9name: '@field9', field10: '=', field10name: '@field10', field11: '=', field11name: '@field11', field12: '=', field12name: '@field12'
        },
        templateUrl: contentService.getLineTemplateUrl('t4908')
    };
}]);