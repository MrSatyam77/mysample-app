//list of sub domains for which cache is enabled
//@exclude
//DO_NOT_REMOVE ABOVE LINE
var whitelistedSubdomains = {
    'app': { domain: 'http://localhost:3010' },
    'static': { domain: 'http://localhost:3001' },
    'api': { domain: 'http://localhost:3011' }
};
//DO_NOT_REMOVE BELOW LINE
//@endexclude

/* @if NODE_ENV='test' **
//For Beta
var whitelistedSubdomains = {
    'app': { domain: 'https://tsg.advanced-taxsolutions.com' },
    'static': { domain: 'https://static.advanced-taxsolutions.com' },
    'api': { domain: 'https://api.advanced-taxsolutions.com' }
};
/* @endif */

/* @if NODE_ENV='production' **
//For Live
var whitelistedSubdomains = {
    'app': { domain: 'https://www.app-tsgtaxpros.com' },
    'static': { domain: 'https://static.mytaxprepoffice.com' },
    'api': { domain: 'https://api.mytaxprepoffice.com' }
};
/* @endif */

//File having all main logic
/* @if NODE_ENV='local' **/
importScripts('serviceWorker-main.js');
importScripts('firebase-messaging-sw.js');
/* @endif */

/* @if NODE_ENV='test'||NODE_ENV='production' **
importScripts('sw-dist.js');
/* @endif */
