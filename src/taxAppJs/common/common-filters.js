'use strict';
var commonFilters = angular.module('commonFilters', []);

/**
*This filter is used to format number with leading zeros
**/      
/*angular.module('commonFilters').filter('numberFixedLen',[function(){
	return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
       };
}]);*/

/**
*This filter is used to format miliseconds into minutes and seconds (mm:ss)
**/   
angular.module('commonFilters').filter('getTimeInMinutesAndSeconds', [function(){
    return function ( input )
    {
        var mm =  Math.floor((input % (1000*60*60))/(1000*60)) + '';
        while ( mm.length < 2 )
        {
            mm = '0' + mm;
        }

        var ss = Math.floor(( input % ( 1000 * 60) ) / (1000) ) + '';
        while ( ss.length < 2 )
        {
            ss = '0' + ss;
        }

        return mm + ':' + ss;
    };
}]);