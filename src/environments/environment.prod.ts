export const environment = {
	production: true,
	sentry_project_url: 'https://65829a48b05140e48853ce4c40a1fe26@qa.dynamic1001.com/31', // for live
	sentry_project_token: 'v2',
	base_url:'https://api.mytaxprepoffice.com',
	subscription_url:'https://subscription.mytaxprepoffice.com',
	media_url:'https://media.mytaxprepoffice.com',
	media_id:'2861A2772BAEB52425F62F5C046D12C8',
	chat_url:'chat.mytaxprepoffice.com',
	static_url : 'https://static.mytaxprepoffice.com',
	websocket_url:'https://ws.mytaxprepoffice.com',
	recaptcha_key: '6LfjgwsUAAAAAP7skKitqZLf6KOMZQwM9Pv63m4D',
	testingtool_url: 'https://mtpotesttoolapi.advanced-taxsolutions.com',
	firebase: {
		apiKey: "AIzaSyCEaYqDNKxijos2DyesbmpVauNg5MV1lgQ",
		authDomain: "live-tax-application.firebaseapp.com",
		databaseURL: "https://live-tax-application.firebaseio.com",
		projectId: "live-tax-application",
		storageBucket: "live-tax-application.appspot.com",
		messagingSenderId: "840619808027"
	},
	mode: 'production',
	packages: [{ title: "1040 - Individual", id: "1040", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1065 - Partnership", id: "1065", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1120 - Corporation", id: "1120", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1120S - S Corporation", id: "1120s", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "1041 - Fiduciary", id: "1041", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }, { title: "990 - Exempt Organization", id: "990", isReleased: true, availableForTaxYear: ["2014", "2015", "2016", "2017", "2018", "2019"] }],
	availableTaxYears: [{ title: 'Tax Year 2014', id: '2014', isReleased: true }, { title: 'Tax Year 2015', id: '2015', isReleased: true }, { title: 'Tax Year 2016', id: '2016', isReleased: true }, { title: 'Tax Year 2017', id: '2017', isReleased: true }, { title: 'Tax Year 2018', id: '2018', isReleased: true }, { title: 'Tax Year 2019', id: '2019', isReleased: true }],
	dynamic_tm_data: {},
	reseller_config_global: { appId: 'RE-4dc601df-dc0e-4a7a-857d-9493ba33a223', shortCode: 'mtpo', browserSupport: {} },
	sockethost: 'https://rtcws.mytaxprepoffice.com',
	uploadServiceUrl: "https://conupload.mytaxprepoffice.com/upload",
	ConversionSupportedTaxYear: 2018
};
