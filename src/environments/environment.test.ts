export const environment = {
	production: false,
	name:'test',
	sentry_project_url: 'https://79282b52fc9a4c61992a9f4de734dd57@qa.dynamic1001.com/30', // for beta
	sentry_project_token: 'v2',
	base_url:'https://api.advanced-taxsolutions.com',
	subscription_url:'http://subscription.advanced-taxsolutions.com',
	static_url : 'https://static.advanced-taxsolutions.com',
	media_url:'https://media.mytaxprepoffice.com',
	media_id:'B6E3FBFBBC818A19FEC121492F5A5AC8',
	chat_url:'chat.advanced-taxsolutions.com',
	websocket_url:'https://ws.advanced-taxsolutions.com',
	recaptcha_key: '6Lc1sGgUAAAAAJ1xWc5Ylw9Zgus5L3D2aGXM-Gnw',
	testingtool_url: 'https://mtpotesttoolapi.advanced-taxsolutions.com',
	firebase: {
		apiKey: "AIzaSyDNOGxIf74M5V63CHFL25wIEXwez1L79mI",
		authDomain: "beta-tax-application.firebaseapp.com",
		databaseURL: "https://beta-tax-application.firebaseio.com",
		projectId: "beta-tax-application",
		storageBucket: "beta-tax-application.appspot.com",
		messagingSenderId: "778432896517"
	},
	mode: 'beta',
	packages: [{ title: "1040 - Individual", id: "1040", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1065 - Partnership", id: "1065", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1120 - Corporation", id: "1120", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1120S - S Corporation", id: "1120s", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1041 - Fiduciary", id: "1041", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "990 - Exempt Organization", id: "990", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }],
	availableTaxYears: [{ title: 'Tax Year 2014', id: '2014', isReleased: true }, { title: 'Tax Year 2015', id: '2015', isReleased: true }, { title: 'Tax Year 2016', id: '2016', isReleased: true }, { title: 'Tax Year 2017', id: '2017', isReleased: true }, { title: 'Tax Year 2018', id: '2018', isReleased: true }, { title: 'Tax Year 2019', id: '2019', isReleased: true }],
	dynamic_tm_data: {},
	reseller_config_global: { appId: 'RE-4dc601df-dc0e-4a7a-857d-9493ba33a223', shortCode: 'mtpo', browserSupport: {} },
	sockethost: 'https://testcws.mytaxprepoffice.com',
	uploadServiceUrl: "https://conupload.mytaxprepoffice.com/upload",
	ConversionSupportedTaxYear: 2018
};
