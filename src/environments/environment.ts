// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  sentry_project_url: 'https://79282b52fc9a4c61992a9f4de734dd57@qa.dynamic1001.com/30', // for beta
  sentry_project_token: 'v0',
  base_url:'https://api.advanced-taxsolutions.com',
  static_url: 'https://static.advanced-taxsolutions.com',
  subscription_url: 'https://testsubscription.mytaxprepoffice.com',
  media_url: 'https://media.mytaxprepoffice.com',
  media_id: 'B6E3FBFBBC818A19FEC121492F5A5AC8',
  chat_url: 'chat.advanced-taxsolutions.com',
  websocket_url: 'http://localhost:3025',
  recaptcha_key: '6LcuiWgUAAAAAL5jHG7x18pxrgOVuGMFBDsIHSUq',
  testingtool_url: 'https://mtpotesttoolapi.advanced-taxsolutions.com',
  firebase: {
		apiKey: "AIzaSyAUZgbdaCPRhFuO03sAz7WkN5-qJwLelbc",
		authDomain: "test-tax-application.firebaseapp.com",
		databaseURL: "https://test-tax-application.firebaseio.com",
		projectId: "test-tax-application",
		storageBucket: "",
		messagingSenderId: "454556854348"
	},
  mode: 'local',
  packages: [{ title: "1040 - Individual", id: "1040", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1065 - Partnership", id: "1065", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1120 - Corporation", id: "1120", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1120S - S Corporations", id: "1120s", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1041 - Fiduciary", id: "1041", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "990 - Exempt Organizations", id: "990", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }],
  availableTaxYears: [{ title: 'Tax Year 2014', id: '2014', isReleased: true }, { title: 'Tax Year 2015', id: '2015', isReleased: true }, { title: 'Tax Year 2016', id: '2016', isReleased: true }, { title: 'Tax Year 2017', id: '2017', isReleased: true }, { title: 'Tax Year 2018', id: '2018', isReleased: true }, { title: 'Tax Year 2019', id: '2019', isReleased: true }],
  dynamic_tm_data: {},
  reseller_config_global: { appId: 'RE-4dc601df-dc0e-4a7a-857d-9493ba33a223', shortCode: 'mtpo', browserSupport: {} },
  sockethost: 'https://testcws.mytaxprepoffice.com',
  uploadServiceUrl: "http://192.168.0.239:4000/upload",
  ConversionSupportedTaxYear: 2018
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
