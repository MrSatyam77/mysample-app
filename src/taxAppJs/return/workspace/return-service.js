returnApp.service('returnService', ['_', '$rootScope', '$q', '$log', '$filter', '$http', '$injector', '$timeout', '$location', 'contentService', 'returnAPIService', 'messageService', 'dataAPI', 'systemConfig', 'localeService', 'dialogService', 'resellerService', 'environment', 'utilityService', 'userService', '$interval', 'printingEngineService', 'officeService', 'savePrintConfigurationService',
	function (_, $rootScope, $q, $log, $filter, $http, $injector, $timeout, $location, contentService, returnAPIService, messageService, dataAPI, systemConfig, localeService, dialogService, resellerService, environment, utilityService, userService, $interval, printingEngineService, officeService, savePrintConfigurationService) {
		var _calcWorker; // hold calculation web worker
		var _taxReturn; //hold open tax Return
		var _addedStates = []; //hold states that are added in Return
		var _reviewErrors = []; // hold preform review Errors
		var _db = {}; //hold list of ein, preparer, etc..   
		var _isPerformReviewDone = false;//to hold perform review is done or not 
		var _isFieldRequiredCheck = false;//to hold field require check is done or not
		var _packageName = ""; // to hold return type.
		var _availableStateList = []; // to hold availableStates
		var einTimer;
		var _returnMode;
		var _importedK1Data;
		var _updatedK1DataPending = false;
		//This Will help us to store Stack Navigation data
		var stackNavigation = {
			"previous": [],
			"next": []
		};
		var objectOfFocusedField; //This will help to store current focused field Object  
		//get appname from resellerService
		var appName = resellerService.getValue("appName");

		var docIndexOfCurrentLoadedForm;

		// isConvertedReturn store
		var isConvertedReturn = false;

		var isclientPortal = false;

		var _performReviewRules = {
			"1120s": {
				"federal": [
					{ "activeForm": "d7004", "allowedForms": ["d1120SCIS", "d1120SRIS", "d7004", "d8879S"], "ignoreForms": [] },
					{ "activeForm": "d1120S", "ignoreForms": ["d7004"] }
				]
			},
			"1040": {
				"federal": [
					{ "activeForm": "d56", "allowedForms": ["dMainInfo", "dReturnInfo", "d8879", "d56"] },
					{ "activeForm": "d2350", "allowedForms": ["dMainInfo", "dReturnInfo", "d8879", "d2350"] },
					{ "activeForm": "d4868", "allowedForms": ["dMainInfo", "dReturnInfo", "d8879", "d4868"] },
					{ "activeForm": "d1040", "ignoreForms": ["d56", "d2350", "d4868"] }
				],
				"ny": [
					{ "activeForm": "dNYIT370", "allowedForms": ["dNYIT370"] }
				],
				"dc": [
					{ "activeForm": "dDCFR127", "allowedForms": ["dDCFR127"] }
				],
				"md": [
					{ "activeForm": "dMD502E", "allowedForms": ["dMD502E"] }
				],
				"nj": [
					{ "activeForm": "dNJ630", "allowedForms": ["dNJ630"] }
				]
			},
			"1120": {
				"federal": [
					{ "activeForm": "d7004", "allowedForms": ["d1120CCIS", "d1120CRIS", "d7004", "d8879C"], "ignoreForms": [] },
					{ "activeForm": "d1120C", "ignoreForms": ["d7004"] }
				]
			},
			"1065": {
				"federal": [
					{ "activeForm": "d7004", "allowedForms": ["d1065CIS", "d1065RIS", "d7004", "d8879PE"], "ignoreForms": [] },
					{ "activeForm": "d1065", "ignoreForms": ["d7004"] }
				]
			},
			"1041": {
				"federal": [
					{ "activeForm": "d7004", "allowedForms": ["d1041CIS", "d1041RIS", "d7004", "d8879F"], "ignoreForms": [] },
					{ "activeForm": "d1041", "ignoreForms": ["d7004"] }
				]
			}

		};

		var nonResiWktFields = {
			'taxpayer': [{ fieldName: 'fieldoo', description: 'Wages', lineNumber: '1' },
			{ fieldName: 'fieldoi', description: 'Excess received for business expense, moving expense', lineNumber: '2' },
			{ fieldName: 'fieldoa', description: 'Disability Income', lineNumber: '3' },
			{ fieldName: 'fieldoc', description: 'Household employee income', lineNumber: '4' },
			{ fieldName: 'fieldob', description: 'Allocated Tips', lineNumber: '5' },
			{ fieldName: 'fieldnk', description: 'Dependent care benefits', lineNumber: '6' },
			{ fieldName: 'fieldau', description: 'Additional income on W2', lineNumber: '7' },
			{ fieldName: 'fieldlp', description: 'Taxable interest income', lineNumber: '8' },
			{ fieldName: 'fieldao', description: 'Tax exempt Interest', lineNumber: '8a' },
			{ fieldName: 'fieldkz', description: 'Ordinary dividends', lineNumber: '9' },
			{ fieldName: 'fieldai', description: 'Exempt interest Dividends', lineNumber: '9a' },
			{ fieldName: 'fieldac', description: 'Qualified Dividends', lineNumber: '9b' },
			{ fieldName: 'fieldkt', description: 'Taxable refunds, credits or offsets of states and local income taxes', lineNumber: '10' },
			{ fieldName: 'fieldkn', description: 'Alimony received', lineNumber: '11' },
			{ fieldName: 'fieldkh', description: 'Business income or ( loss )', lineNumber: '12' },
			{ fieldName: 'fieldkb', description: 'Capital gain or(loss)', lineNumber: '13' },
			{ fieldName: 'fieldka', description: 'Other Gains', lineNumber: '14' },
			{ fieldName: 'fieldjp', description: 'Taxable IRA & pensions, annuities amount', lineNumber: '15' },
			{ fieldName: 'fielddd', description: 'IRA Distributions & pensions, annuities amount', lineNumber: '16' },
			{ fieldName: 'fieldjd', description: 'Rental Real estate, Royalties', lineNumber: '17' },
			{ fieldName: 'fieldcq', description: 'Partnerships & S Corporations', lineNumber: '17a' },
			{ fieldName: 'fieldck', description: 'Estates & Trusts', lineNumber: '17b' },
			{ fieldName: 'fieldix', description: 'Farm income or loss', lineNumber: '18' },
			{ fieldName: 'fieldir', description: 'Unemployment compensation', lineNumber: '19' },
			{ fieldName: 'fieldif', description: 'Taxable Social Security Benefits', lineNumber: '20' },
			{ fieldName: 'fieldce', description: 'Social Security benefits received', lineNumber: '20a' },
			{ fieldName: 'fieldie', description: 'Other Income', lineNumber: '21' },
			{ fieldName: 'fieldby', description: 'Form 2555 . Form 2555EZ', lineNumber: '21a' },
			{ fieldName: 'fieldbs', description: 'NOL Loss Carryover', lineNumber: '21b' },
			{ fieldName: 'fieldid', description: 'Total Income', lineNumber: '22' },
			{ fieldName: 'fieldbm', description: 'Educator expenses', lineNumber: '23' },
			{ fieldName: 'fieldhh', description: 'Certain business expenses of reservists, performing artist, fee basis government officials', lineNumber: '24' },
			{ fieldName: 'fieldmq', description: 'Health savings account deduction', lineNumber: '25' },
			{ fieldName: 'fieldgn', description: 'Moving expenses', lineNumber: '26' },
			{ fieldName: 'fieldgj', description: 'One Half of Self Employment taxes', lineNumber: '27' },
			{ fieldName: 'fieldfv', description: 'Self employed SEP, Simple,and qualified plans', lineNumber: '28' },
			{ fieldName: 'fieldft', description: 'Self employed health insurance deduction', lineNumber: '29' },
			{ fieldName: 'fieldfn', description: 'Penalty on early withdrawal', lineNumber: '30' },
			{ fieldName: 'fieldfh', description: 'Alimony paid', lineNumber: '31' },
			{ fieldName: 'fieldfd', description: 'IRA Deduction', lineNumber: '32' },
			{ fieldName: 'fieldgz', description: 'Student loan interest deduction', lineNumber: '33' },
			{ fieldName: 'fieldbg', description: 'Tuition and Fees Deduction', lineNumber: '34' },
			{ fieldName: 'fieldhb', description: 'Domestic production activities deduction', lineNumber: '35' },
			{ fieldName: 'fielden', description: 'Other Adjustments', lineNumber: '36a' },
			{ fieldName: 'fieldhn', description: 'Archer MSA deduction', lineNumber: '36b' },
			{ fieldName: 'fieldba', description: 'Form 2555 / Form 2555EZ deduction', lineNumber: '36c' },
			{ fieldName: 'fieldlk', description: 'Total Adjustments', lineNumber: '36' },
			{ fieldName: 'fieldli', description: 'Adjusted Gross Income', lineNumber: '37' }],
			'spouse': [{ fieldName: 'fieldon', description: 'Wages', lineNumber: '1' },
			{ fieldName: 'fieldoh', description: 'Excess received for business expense, moving expense', lineNumber: '2' },
			{ fieldName: 'fieldnx', description: 'Disability Income', lineNumber: '3' },
			{ fieldName: 'fieldnz', description: 'Household employee income', lineNumber: '4' },
			{ fieldName: 'fieldny', description: 'Allocated Tips', lineNumber: '5' },
			{ fieldName: 'fieldmy', description: 'Dependent care benefits', lineNumber: '6' },
			{ fieldName: 'fieldax', description: 'Additional income on W2', lineNumber: '7' },
			{ fieldName: 'fieldlo', description: 'Taxable interest income', lineNumber: '8' },
			{ fieldName: 'fieldar', description: 'Tax exempt Interest', lineNumber: '8a' },
			{ fieldName: 'fieldky', description: 'Ordinary dividends', lineNumber: '9' },
			{ fieldName: 'fieldal', description: 'Exempt interest Dividends', lineNumber: '9a' },
			{ fieldName: 'fieldaf', description: 'Qualified Dividends', lineNumber: '9b' },
			{ fieldName: 'fieldks', description: 'Taxable refunds, credits or offsets of states and local income taxes', lineNumber: '10' },
			{ fieldName: 'fieldkm', description: 'Alimony received', lineNumber: '11' },
			{ fieldName: 'fieldkg', description: 'Business income or ( loss )', lineNumber: '12' },
			{ fieldName: 'fieldjz', description: 'Capital gain or(loss)', lineNumber: '13' },
			{ fieldName: 'fieldjy', description: 'Other Gains', lineNumber: '14' },
			{ fieldName: 'fieldjo', description: 'Taxable IRA & pensions, annuities amount', lineNumber: '15' },
			{ fieldName: 'fielddg', description: 'IRA Distributions & pensions, annuities amount', lineNumber: '16' },
			{ fieldName: 'fieldjc', description: 'Rental Real estate, Royalties', lineNumber: '17' },
			{ fieldName: 'fieldct', description: 'Partnerships & S Corporations', lineNumber: '17a' },
			{ fieldName: 'fieldcn', description: 'Estates & Trusts', lineNumber: '17b' },
			{ fieldName: 'fieldiw', description: 'Farm income or loss', lineNumber: '18' },
			{ fieldName: 'fieldiq', description: 'Unemployment compensation', lineNumber: '19' },
			{ fieldName: 'fieldic', description: 'Taxable Social Security Benefits', lineNumber: '20' },
			{ fieldName: 'fieldch', description: 'Social Security benefits received', lineNumber: '20a' },
			{ fieldName: 'fieldib', description: 'Other Income', lineNumber: '21' },
			{ fieldName: 'fieldcb', description: 'Form 2555 . Form 2555EZ', lineNumber: '21a' },
			{ fieldName: 'fieldbv', description: 'NOL Loss Carryover', lineNumber: '21b' },
			{ fieldName: 'fieldia', description: 'Total Income', lineNumber: '22' },
			{ fieldName: 'fieldbp', description: 'Educator expenses', lineNumber: '23' },
			{ fieldName: 'fieldhg', description: 'Certain business expenses of reservists, performing artist, fee basis government officials', lineNumber: '24' },
			{ fieldName: 'fieldmo', description: 'Health savings account deduction', lineNumber: '25' },
			{ fieldName: 'fieldgm', description: 'Moving expenses', lineNumber: '26' },
			{ fieldName: 'fieldgg', description: 'One Half of Self Employment taxes', lineNumber: '27' },
			{ fieldName: 'fieldfu', description: 'Self employed SEP, Simple,and qualified plans', lineNumber: '28' },
			{ fieldName: 'fieldfs', description: 'Self employed health insurance deduction', lineNumber: '29' },
			{ fieldName: 'fieldfm', description: 'Penalty on early withdrawal', lineNumber: '30' },
			{ fieldName: 'fieldff', description: 'Alimony paid', lineNumber: '31' },
			{ fieldName: 'fieldfc', description: 'IRA Deduction', lineNumber: '32' },
			{ fieldName: 'fieldgy', description: 'Student loan interest deduction', lineNumber: '33' },
			{ fieldName: 'fieldbj', description: 'Tuition and Fees Deduction', lineNumber: '34' },
			{ fieldName: 'fieldha', description: 'Domestic production activities deduction', lineNumber: '35' },
			{ fieldName: 'fieldem', description: 'Other Adjustments', lineNumber: '36a' },
			{ fieldName: 'fieldhm', description: 'Archer MSA deduction', lineNumber: '36b' },
			{ fieldName: 'fieldbd', description: 'Form 2555 / Form 2555EZ deduction', lineNumber: '36c' },
			{ fieldName: 'fieldlj', description: 'Total Adjustments', lineNumber: '36' },
			{ fieldName: 'fieldlh', description: 'Adjusted Gross Income', lineNumber: '37' }]
		}

		//This variable holds current tax year
		var taxYear = userService.getTaxYear();

		// Change for new Bank
		// variable use for bank agreement printing configuration data
		if (taxYear == '2016') {
			var _bankAgreementPrintConfig = {
				"dEPSBankApp": [{ docName: "dEPSE1VisaPrepaidCardMPS", formName: "fEPSE1VisaPrepaidCardMPS", description: "EPS Visa Prepaid Card Request Form MPS", displayName: "EPS Visa Prepaid Card Request Form MPS", element: "E1VisaCardAddFormChk", expectedValue: true },
				{ docName: "dEPSRALGeneralAgreement", formName: "fEPSRALGeneralAgreement", description: "EPS RAL General Agreement", displayName: "EPS RAL General Agreement", element: "EPSRALGeneralAgreementChk", expectedValue: true },
				{ docName: "dEPSRTAgreementEBonusEAdvance", formName: "fEPSRTAgreementEBonusEAdvance", description: "EPS RT Agreement For eBonus And eAdvance", displayName: "EPS RT Agreement For eBonus And eAdvance", element: "EPSRTAgreementEBonusEAdvanceChk", expectedValue: true },
				{ docName: "dEPSRTAgreementECollect", formName: "fEPSRTAgreementECollect", description: "EPS RT Agreement For eCollect", displayName: "EPS RT Agreement For eCollect", element: "EPSRTAgreementECollectChk", expectedValue: true },
				{ docName: "dEPSRACDisclosureMN", formName: "fEPSRACDisclosureMN", description: "EPS RAC Disclosure MN", displayName: "EPS RAC Disclosure MN", element: "EPSRACDisclosureMNChk", expectedValue: true },
				{ docName: "dEPSRACDisclosureARILMDME", formName: "fEPSRACDisclosureARILMDME", description: "EPS RAC Disclosure AR IL MD ME", displayName: "EPS RAC Disclosure AR IL MD ME", element: "EPSRACDisclosureARILMDMEChk", expectedValue: true },
				{ docName: "dEPSRACDisclosureNY", formName: "fEPSRACDisclosureNY", description: "EPS RAC Disclosure NY", displayName: "EPS RAC Disclosure NY", element: "EPSRACDisclosureNYChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureCO", formName: "fEPSRALDisclosureCO", description: "EPS RAL Disclosure CO", displayName: "EPS RAL Disclosure CO", element: "EPSRALDisclosureCOChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureEBonusEAdvanceARMDME", formName: "fEPSRALDisclosureEBonusEAdvanceARMDME", description: "EPS RAL Disclosure eBonus eAdvance AR MD ME", displayName: "EPS RAL Disclosure eBonus eAdvance AR MD ME", element: "EPSRALDisclosureEBonusEAdvanceARMDMEChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWI", formName: "fEPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWI", description: "EPS RAL Disclosure eBonus eAdvance CA CT LA MI NC NJ NV OR TN TX VA WA WI", displayName: "EPS RAL Disclosure eBonus eAdvance CA CT LA MI NC NJ NV OR TN TX VA WA WI", element: "EPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWIChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureECollectARMDME", formName: "fEPSRALDisclosureECollectARMDME", description: "EPS RAL Disclosure eCollect AR MD ME", displayName: "EPS RAL Disclosure eCollect AR MD ME", element: "EPSRALDisclosureECollectARMDMEChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWI", formName: "fEPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWI", description: "EPS RAL Disclosure eCollect CA CT LA MI NC NJ NV OR TN TX VA WA WI", displayName: "EPS RAL Disclosure eCollect CA CT LA MI NC NJ NV OR TN TX VA WA WI", element: "EPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWIChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureIL", formName: "fEPSRALDisclosureIL", description: "EPS RAL Disclosure IL", displayName: "EPS RAL Disclosure IL", element: "EPSRALDisclosureILChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureMN", formName: "fEPSRALDisclosureMN", description: "EPS RAL Disclosure MN", displayName: "EPS RAL Disclosure MN", element: "EPSRALDisclosureMNChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureNY", formName: "fEPSRALDisclosureNY", description: "EPS RAL Disclosure NY", displayName: "EPS RAL Disclosure NY", element: "EPSRALDisclosureNYChk", expectedValue: true },
				{ docName: "dEPSTaxPreparationFeeAcknowledgement", formName: "fEPSTaxPreparationFeeAcknowledgement", description: "EPS Tax Preparation Fee Acknowledgement", displayName: "EPS Tax Preparation Fee Acknowledgement", element: "EPSTaxPreparationFeeAcknowledgementChk", expectedValue: true }
				],
				"dAtlasBankApp": [{ docName: "dNavigatorPaperCheckDisclosure", formName: "fNavigatorPaperCheckDisclosure", description: "Navigator Refund Anticipation Check (RAC) Disclosure", displayName: "Navigator Refund Anticipation Check (RAC) Disclosure", element: "isNavigatorPaperCheckDisclosure", expectedValue: true },
				{ docName: "dNavigatorElectronicSignatureDisclosure", formName: "fNavigatorElectronicSignatureDisclosure", description: "Navigator electronic signature disclosure and consent", displayName: "Navigator electronic signature disclosure and consent", element: "isNavigatorElectronicSignatureDisclosure", expectedValue: true },
				{ docName: "dNavigatorPaperCheckNY", formName: "fNavigatorPaperCheckNY", description: "Navigator Refund Anticipation Check (RAC) NY", displayName: "Navigator electronic signature disclosure and consent", element: "isNavigatorPaperCheckNY", expectedValue: true },
				{ docName: "dNavigatorRTAR", formName: "fNavigatorRTAR", description: "Navigator refund disclosure AR", displayName: "Navigator refund disclosure AR", element: "isNavigatorRTAR", expectedValue: true },
				{ docName: "dNavigatorRTMN", formName: "fNavigatorRTMN", description: "Navigator refund disclosure MN", displayName: "Navigator refund disclosure MN", element: "isNavigatorRTMN", expectedValue: true },
				{ docName: "dNavigatorRALDisclosure", formName: "fNavigatorRALDisclosure", description: "Navigator Refund Anticipation Loan Disclosure", displayName: "Navigator Refund Anticipation Loan Disclosure", element: "isNavigatorRALDisclosure", expectedValue: true },
				{ docName: "dNavigatorRALMN", formName: "fNavigatorRALMN", description: "Navigator Refund Anticipation Loan Minnesota", displayName: "Navigator Refund Anticipation Loan Minnesota", element: "isNavigatorRALMN", expectedValue: true },
				{ docName: "dNavigatorRALNJ", formName: "fNavigatorRALNJ", description: "Navigator Refund Anticipation Loan New Jersey", displayName: "Navigator Refund Anticipation Loan New Jersey", element: "isNavigatorRALNJ", expectedValue: true },
				{ docName: "dNavigatorRALNY", formName: "fNavigatorRALNY", description: "Navigator Refund Anticipation Loan Navigator New York", displayName: "Navigator Refund Anticipation Loan New York", element: "isNavigatorRALNY", expectedValue: true }
				],
				"dTPGBankApp": [//{docName : "dTPGConsentToDiscloseAndUseWithAdvance",formName : "fTPGConsentToDiscloseAndUseWithAdvance",description : "TPG Consent To Disclose And Use With Advance",displayName : "TPG Consent To Disclose And Use With Advance",element : "TPGConsentToDiscloseAndUseWithAdvanceChk",expectedValue : true},
					//We are not supporting following form this year, open it's comment when it will require in future
					//{docName : "dTPGDisbursementGeneral",formName : "fTPGDisbursementGeneral",description : "TPG Disbursement General",displayName : "TPG Disbursement General",element : "TPGDisbursementGeneralChk",expectedValue : true},
					//{docName : "dTPGRTFeeDisclosure",formName : "fTPGRTFeeDisclosure",description : "TPG RT Fee Disclosure",displayName : "TPG RT Fee Disclosure",element : "TPGRTFeeDisclosureChk",expectedValue : true},
					//{docName : "dTPGRTApplicationAndAgreement",formName : "fTPGRTApplicationAndAgreement",description : "TPG RT Application And Agreement",displayName : "TPG RT Application And Agreement",element : "TPGRTApplicationAndAgreementChk",expectedValue : true},
					//{docName : "dTPGNonRTApplicationAndAgreementAdvance",formName : "fTPGNonRTApplicationAndAgreementAdvance",description : "TPG Non RT Application And Agreement Advance",displayName : "TPG Non RT Application And Agreement Advance",element : "TPGNonRTApplicationAndAgreementAdvanceChk",expectedValue : true},
					{ docName: "dTPGFCBAdvanceAgreement", formName: "fTPGFCBAdvanceAgreement", description: "TPG FCB Advance Agreement", displayName: "TPG FCB Advance Agreement", element: "IsdTPGFCBAdvanceAgreement", expectedValue: true },
					{ docName: "dTPGDisclosureMN", formName: "fTPGDisclosureMN", description: "TPG Minnesota Disclosure", displayName: "TPG Minnesota Disclosure", element: "IsdTPGDisclosureMN", expectedValue: true },
					{ docName: "dTPGDisclosureNJ", formName: "fTPGDisclosureNJ", description: "TPG New Jersey Disclosure", displayName: "TPG New Jersey Disclosure", element: "IsdTPGDisclosureNJ", expectedValue: true },
					{ docName: "dTPGDisclosureNY", formName: "fTPGDisclosureNY", description: "TPG New Yourk Disclosure", displayName: "TPG New Yourk Disclosure", element: "IsdTPGDisclosureNY", expectedValue: true }
				],
				"dRefundAdvantageBankApp": [{ docName: "dRAGeneralRT", formName: "fRAGeneralRT", description: "Refund Advantage RT Taxpayer Agreement", displayName: "Refund Advantage RT Taxpayer Agreement", element: "BankAppTypeChk", expectedValue: "1" },
				{ docName: "dRAGeneralRT", formName: "fRAGeneralRT", description: "Refund Advantage RT Taxpayer Agreement", displayName: "Refund Advantage RT Taxpayer Agreement", element: "BankAppTypeChk", expectedValue: "3" },
				{ docName: "dRAGeneralRAL", formName: "fRAGeneralRAL", description: "Refund Advantage RAL Agreement", displayName: "Refund Advantage RAL Agreement", element: "BankAppTypeChk", expectedValue: "3" },
				{ docName: "dRAGeneralRAL", formName: "fRAGeneralRAL", description: "Refund Advantage RAL Agreement", displayName: "Refund Advantage RAL Agreement", element: "BankAppTypeChk", expectedValue: "2" },
				{ docName: "dRADisclosureRTAR", formName: "fRADisclosureRTAR", description: "Refund Advantage Arkansas Disclosure – RT", displayName: "Refund Advantage Arkansas Disclosure – RT", element: "IsdRADisclosureRTAR", expectedValue: true },
				{ docName: "dRADisclosureRTIL", formName: "fRADisclosureRTIL", description: "Refund Advantage Illinois Disclosure - RT", displayName: "Refund Advantage Illinois Disclosure - RT", element: "IsdRADisclosureRTIL", expectedValue: true },
				{ docName: "dRADisclosureRTME", formName: "fRADisclosureRTME", description: "Refund Advantage Maine Disclosure - RT", displayName: "Refund Advantage Maine Disclosure - RT", element: "IsdRADisclosureRTME", expectedValue: true },
				{ docName: "dRADisclosureRTMD", formName: "fRADisclosureRTMD", description: "Refund Advantage Maryland Disclosure - RT", displayName: "Refund Advantage Maryland Disclosure - RT", element: "IsdRADisclosureRTMD", expectedValue: true },
				{ docName: "dRADisclosureRTMN", formName: "fRADisclosureRTMN", description: "Refund Advantage Minnesota Disclosure - RT", displayName: "Refund Advantage Minnesota Disclosure - RT", element: "IsdRADisclosureRTMN", expectedValue: true },
				{ docName: "dRADisclosureStateRTNY", formName: "fRADisclosureStateRTNY", description: "Refund Advantage New York State Disclosure – RT", displayName: "Refund Advantage New York State Disclosure – RT", element: "IsRADisclosureStateRTNY", expectedValue: true },
				{ docName: "dRADisclosureCityRTNY", formName: "fRADisclosureCityRTNY", description: "Refund Advantage New York City Disclosure – RT", displayName: "Refund Advantage New York City Disclosure – RT", element: "IsdRADisclosureCityRTNY", expectedValue: true },
				{ docName: "dRADisclosureRALIL", formName: "fRADisclosureRALIL", description: "Refund Advantage Illinois Disclosure - RAL", displayName: "Refund Advantage Illinois Disclosure - RAL", element: "IsdRADisclosureRALIL", expectedValue: true },
				{ docName: "dRADisclosureRALWI", formName: "fRADisclosureRALWI", description: "Refund Advantage Wisconsin Disclosure - RAL", displayName: "Refund Advantage Wisconsin Disclosure - RAL", element: "IsdRADisclosureRALWI", expectedValue: true },
				{ docName: "dRADisclosureRALCO", formName: "fRADisclosureRALCO", description: "Refund Advantage Colorado Disclosure - RAL", displayName: "Refund Advantage Colorado Disclosure - RAL", element: "IsdRADisclosureRALCO", expectedValue: true },
				{ docName: "dRADisclosureRALMN", formName: "fRADisclosureRALMN", description: "Refund Advantage Minnesota Disclosure – RAL", displayName: "Refund Advantage Minnesota Disclosure – RAL", element: "IsdRADisclosureRALMN", expectedValue: true },
				{ docName: "dRADisclosureRALNY", formName: "fRADisclosureRALNY", description: "Refund Advantage New York Disclosure - RAL", displayName: "Refund Advantage New York Disclosure - RAL", element: "IsdRADisclosureRALNY", expectedValue: true },
				{ docName: "dRADisclosureRALCALANVTNTXVA", formName: "fRADisclosureRALCALANVTNTXVA", description: "Refund Advantage Multi-State (CA, LA, NV, TN, TX, VA) Disclosure1  - RAL", displayName: "Refund Advantage Multi-State (CA, LA, NV, TN, TX, VA) Disclosure1  - RAL", element: "IsdRADisclosureRALCALANVTNTXVA", expectedValue: true },
				{ docName: "dRADisclosureRALCTNC", formName: "fRADisclosureRALCTNC", description: "Refund Advantage Multi-State (CT and NC) Disclosure2 – RAL", displayName: "Refund Advantage Multi-State (CT and NC) Disclosure2 – RAL", element: "IsdRADisclosureRALCTNC", expectedValue: true },
				{ docName: "dRADisclosureRALARMEMD", formName: "fRADisclosureRALARMEMD", description: "Refund Advantage Multi-State (AR, ME, MD) Disclosure3 - RAL", displayName: "Refund Advantage Multi-State (AR, ME, MD) Disclosure3 - RAL", element: "IsdRADisclosureRALARMEMD", expectedValue: true },
				{ docName: "dRADisclosureRALNJ", formName: "fRADisclosureRALNJ", description: "Refund Advantage New Jersey Disclosure - RAL", displayName: "Refund Advantage New Jersey Disclosure - RAL", element: "IsdRADisclosureRALNJ", expectedValue: true },
				{ docName: "dRADisclosureRALWA", formName: "fRADisclosureRALWA", description: "Refund Advantage Washington Disclosure - RAL", displayName: "Refund Advantage Washington Disclosure - RAL", element: "IsdRADisclosureRALWA", expectedValue: true },
				{ docName: "dRADisclosureRALMI", formName: "fRADisclosureRALMI", description: "Refund Advantage Michigan Disclosure - RAL", displayName: "Refund Advantage Michigan Disclosure - RAL", element: "IsdRADisclosureRALMI", expectedValue: true }
				]
			};
		} else if (taxYear == '2017') {
			var _bankAgreementPrintConfig = {
				"dEPSBankApp": [{ docName: "dEPSE1VisaPrepaidCardMPS", formName: "fEPSE1VisaPrepaidCardMPS", description: "EPS Visa Prepaid Card Request Form MPS", displayName: "EPS Visa Prepaid Card Request Form MPS", element: "E1VisaCardAddFormChk", expectedValue: true },
				{ docName: "dEPSRTAgreementEBonusEAdvance", formName: "fEPSRTAgreementEBonusEAdvance", description: "EPS RT Agreement For eBonus And eAdvance", displayName: "EPS RT Agreement For eBonus And eAdvance", element: "EPSRTAgreementEBonusEAdvanceChk", expectedValue: true },
				{ docName: "dEPSRALGeneralAgreement", formName: "fEPSRALGeneralAgreement", description: "EPS RAL General Agreement", displayName: "EPS RAL General Agreement", element: "EPSRALGeneralAgreementChk", expectedValue: true },
				{ docName: "dEPSRTAgreementECollect", formName: "fEPSRTAgreementECollect", description: "EPS RT Agreement For eCollect", displayName: "EPS RT Agreement For eCollect", element: "EPSRTAgreementECollectChk", expectedValue: true },
				{ docName: "dEPSPlusUpAgreement", formName: "fEPSPlusUpAgreement", description: "EPS Plus Up Agreement", displayName: "EPS Plus Up Agreement", element: "IsEPSPlusUpAgreement", expectedValue: true },
				{ docName: "dEPSTaxPreparationFeeAcknowledgement", formName: "fEPSTaxPreparationFeeAcknowledgement", description: "EPS Tax Preparation Fee Acknowledgement", displayName: "EPS Tax Preparation Fee Acknowledgement", element: "EPSTaxPreparationFeeAcknowledgementChk", expectedValue: true },
				{ docName: "dEPSRACDisclosureMN", formName: "fEPSRACDisclosureMN", description: "EPS RAC Disclosure MN", displayName: "EPS RAC Disclosure MN", element: "EPSRACDisclosureMNChk", expectedValue: true },
				{ docName: "dEPSRACDisclosureARILMDME", formName: "fEPSRACDisclosureARILMDME", description: "EPS RAC Disclosure AR IL MD ME", displayName: "EPS RAC Disclosure AR IL MD ME", element: "EPSRACDisclosureARILMDMEChk", expectedValue: true },
				{ docName: "dEPSRACDisclosureNY", formName: "fEPSRACDisclosureNY", description: "EPS RAC Disclosure NY", displayName: "EPS RAC Disclosure NY", element: "EPSRACDisclosureNYChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureCO", formName: "fEPSRALDisclosureCO", description: "EPS RAL Disclosure CO", displayName: "EPS RAL Disclosure CO", element: "EPSRALDisclosureCOChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureEBonusEAdvanceARMDME", formName: "fEPSRALDisclosureEBonusEAdvanceARMDME", description: "EPS RAL Disclosure eBonus eAdvance AR MD ME", displayName: "EPS RAL Disclosure eBonus eAdvance AR MD ME", element: "EPSRALDisclosureEBonusEAdvanceARMDMEChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWI", formName: "fEPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWI", description: "EPS RAL Disclosure eBonus eAdvance CA CT LA MI NC NJ NV OR TN TX VA WA WI", displayName: "EPS RAL Disclosure eBonus eAdvance CA CT LA MI NC NJ NV OR TN TX VA WA WI", element: "EPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWIChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureECollectARMDME", formName: "fEPSRALDisclosureECollectARMDME", description: "EPS RAL Disclosure eCollect AR MD ME", displayName: "EPS RAL Disclosure eCollect AR MD ME", element: "EPSRALDisclosureECollectARMDMEChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWI", formName: "fEPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWI", description: "EPS RAL Disclosure eCollect CA CT LA MI NC NJ NV OR TN TX VA WA WI", displayName: "EPS RAL Disclosure eCollect CA CT LA MI NC NJ NV OR TN TX VA WA WI", element: "EPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWIChk", expectedValue: true },
				//{ docName: "dEPSRALDisclosureIL", formName: "fEPSRALDisclosureIL", description: "EPS RAL Disclosure IL", displayName: "EPS RAL Disclosure IL", element: "EPSRALDisclosureILChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureMN", formName: "fEPSRALDisclosureMN", description: "EPS RAL Disclosure MN", displayName: "EPS RAL Disclosure MN", element: "EPSRALDisclosureMNChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureNYCity", formName: "fEPSRALDisclosureNYCity", description: "EPS RAL Disclosure New York City Municipal", displayName: "EPS RAL Disclosure New York City Municipal", element: "EPSRALDisclosureNYCityChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureNY", formName: "fEPSRALDisclosureNY", description: "EPS RAL Disclosure NY", displayName: "EPS RAL Disclosure NY", element: "EPSRALDisclosureNYChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureILEBonusEAdvance", formName: "fEPSRALDisclosureILEBonusEAdvance", description: "EPS RAL Disclosure eBonus eAdvance IL", displayName: "EPS RAL Disclosure eBonus eAdvance IL", element: "EPSRALDisclosureILEBonusEAdvanceChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureILECollect", formName: "fEPSRALDisclosureILECollect", description: "EPS RAL Disclosure eCollect IL", displayName: "EPS RAL Disclosure eCollect IL", element: "EPSRALDisclosureILECollectChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureCO", formName: "fEPSRALPlusUpDisclosureCO", description: "EPS RAL Plus Up Colorado Disclosure", displayName: "EPS RAL Plus Up Colorado Disclosure", element: "EPSRALPlusUpDisclosureCOChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureILEBonusEAdvance", formName: "fEPSRALPlusUpDisclosureILEBonusEAdvance", description: "EPS RAL Plus-Up IL Disclosure eAdvance-eBonus", displayName: "EPS RAL Plus-Up IL Disclosure eAdvance-eBonus", element: "EPSRALPlusUpDisclosureILEBonusEAdvanceChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureILECollect", formName: "fEPSRALPlusUpDisclosureILECollect", description: "EPS RAL Plus-Up IL Disclosure eCollect", displayName: "EPS RAL Plus-Up IL Disclosure eCollect", element: "EPSRALPlusUpDisclosureILECollectChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpMinnesotaDisclosure", formName: "fEPSRALPlusUpMinnesotaDisclosure", description: "EPS RAL Plus Up Minnesota Disclosure", displayName: "EPS RAL Plus Up Minnesota Disclosure", element: "EPSRALPlusUpMinnesotaDisclosureChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureARMEMDEBonusEAdvance", formName: "fEPSRALPlusUpDisclosureARMEMDEBonusEAdvance", description: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eAdvance - eBonus", displayName: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eAdvance - eBonus", element: "EPSRALPlusUpDisclosureARMEMDEBonusEAdvanceChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureARMEMDECollect", formName: "fEPSRALPlusUpDisclosureARMEMDECollect", description: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eCollect", displayName: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eCollect", element: "EPSRALPlusUpDisclosureARMEMDECollectChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpNewYorkCityMunicipalInterestDisclosure", formName: "fEPSRALPlusUpNewYorkCityMunicipalInterestDisclosure", description: "EPS RAL Plus Up New York City Municipal Interest Disclosure", displayName: "EPS RAL Plus Up New York City Municipal Interest Disclosure", element: "EPSRALPlusUpNewYorkCityMunicipalInterestDisclosureChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpNewYorkDisclosure", formName: "fEPSRALPlusUpNewYorkDisclosure", description: "EPS RAL Plus Up New York Disclosure", displayName: "EPS RAL Plus Up New York Disclosure", element: "EPSRALPlusUpNewYorkDisclosureChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIEAdvanceEBonus", formName: "fEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIEAdvanceEBonus", description: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eAdvance-eBonus", displayName: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eAdvance-eBonus", element: "EPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIEAdvanceEBonusChk", expectedValue: true },
				{ docName: "dEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIECollect", formName: "fEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIECollect", description: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eCollect", displayName: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eCollect", element: "EPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIECollectChk", expectedValue: true }
				],
				"dAtlasBankApp": [{ docName: "dNavigatorPaperCheckDisclosure", formName: "fNavigatorPaperCheckDisclosure", description: "Navigator Refund Anticipation Check (RAC) Disclosure", displayName: "Navigator Refund Anticipation Check (RAC) Disclosure", element: "isNavigatorPaperCheckDisclosure", expectedValue: true },
				//{ docName: "dNavigatorElectronicSignatureDisclosure", formName: "fNavigatorElectronicSignatureDisclosure", description: "Navigator electronic signature disclosure and consent", displayName: "Navigator electronic signature disclosure and consent", element: "isNavigatorElectronicSignatureDisclosure", expectedValue: true },
				{ docName: "dNavigatorRTRALSeattle", formName: "fNavigatorRTRALSeattle", description: "Navigator RT RAL Seattle", displayName: "Navigator RT RAL Seattle", element: "NavigatorRTRALSeattleChk", expectedValue: true },
				{ docName: "dNavigatorRTSanAntonio", formName: "fNavigatorRTSanAntonio", description: "Navigator RT San Antonio", displayName: "Navigator RT San Antonio", element: "NavigatorRTSanAntonioChk", expectedValue: true },
				{ docName: "dNavigatorRTSeattle", formName: "fNavigatorRTSeattle", description: "Navigator RT Seattle", displayName: "Navigator RT Seattle", element: "NavigatorRTSeattleChk", expectedValue: true },
				{ docName: "dNavigatorPaperCheckNY", formName: "fNavigatorPaperCheckNY", description: "Navigator Refund Anticipation Check (RAC) NY", displayName: "Navigator electronic signature disclosure and consent", element: "isNavigatorPaperCheckNY", expectedValue: true },
				{ docName: "dNavigatorRTAR", formName: "fNavigatorRTAR", description: "Navigator refund disclosure AR", displayName: "Navigator refund disclosure AR", element: "isNavigatorRTAR", expectedValue: true },
				{ docName: "dNavigatorRTMN", formName: "fNavigatorRTMN", description: "Navigator refund disclosure MN", displayName: "Navigator refund disclosure MN", element: "isNavigatorRTMN", expectedValue: true },
				{ docName: "dNavigatorRALDisclosure", formName: "fNavigatorRALDisclosure", description: "Navigator Refund Anticipation Loan Disclosure", displayName: "Navigator Refund Anticipation Loan Disclosure", element: "isNavigatorRALDisclosure", expectedValue: true },
				{ docName: "dNavigatorRALSanAntonio", formName: "fNavigatorRALSanAntonio", description: "Navigator RAL San Antonio", displayName: "Navigator RAL San Antonio", element: "NavigatorRALSanAntonioChk", expectedValue: true },
				{ docName: "dNavigatorRALSeattle", formName: "fNavigatorRALSeattle", description: "Navigator RAL Seattle", displayName: "Navigator RAL Seattle", element: "NavigatorRALSeattleChk", expectedValue: true },
				{ docName: "dNavigatorRALMN", formName: "fNavigatorRALMN", description: "Navigator Refund Anticipation Loan Minnesota", displayName: "Navigator Refund Anticipation Loan Minnesota", element: "isNavigatorRALMN", expectedValue: true },
				{ docName: "dNavigatorRALNJ", formName: "fNavigatorRALNJ", description: "Navigator Refund Anticipation Loan New Jersey", displayName: "Navigator Refund Anticipation Loan New Jersey", element: "isNavigatorRALNJ", expectedValue: true },
				{ docName: "dNavigatorRALNY", formName: "fNavigatorRALNY", description: "Navigator Refund Anticipation Loan Navigator New York", displayName: "Navigator Refund Anticipation Loan New York", element: "isNavigatorRALNY", expectedValue: true },
				{ docName: "dNavigatorCreditRestore", formName: "fNavigatorCreditRestore", description: "Navigator Credit Restore", displayName: "Navigator Credit Restore", element: "NavigatorCreditRestoreChk", expectedValue: true }

				],
				"dTPGBankApp": [
					{ docName: "dTPGSignDisclosureAndConsent", formName: "fTPGSignDisclosureAndConsent", description: "TPG Sign Disclosure And Consent", displayName: "TPG Sign Disclosure And Consent", element: "TPGSignDisclosureAndConsentChk", expectedValue: true },
					{ docName: "dTPGConsentToUseWithRT", formName: "fTPGConsentToUseWithRT", description: "TPG Consent To Use With RT", displayName: "TPG Consent To Use With RT", element: "TPGConsentToUseWithRTChk", expectedValue: true },
					{ docName: "dTPGConsentToUseWithAdvance", formName: "fTPGConsentToUseWithAdvance", description: "TPG Consent To Use With Advance", displayName: "TPG Consent To Use With Advance", element: "TPGConsentToUseWithAdvanceChk", expectedValue: true },
					{ docName: "dTPGConsentToDiscloseWithRT", formName: "fTPGConsentToDiscloseWithRT", description: "TPG Consent To Disclose With RT", displayName: "TPG Consent To Disclose With RT", element: "TPGConsentToDiscloseWithRTChk", expectedValue: true },
					{ docName: "dTPGConsentToDiscloseWithAdvance", formName: "fTPGConsentToDiscloseWithAdvance", description: "TPG Consent To  Disclose With Advance", displayName: "TPG Consent To  Disclose With Advance", element: "TPGConsentToDiscloseWithAdvanceChk", expectedValue: true },
					{ docName: "dTPGAddintionalConsents", formName: "fTPGAddintionalConsents", description: "TPG Additional Concents(Authorization)", displayName: "TPG Additional Concents(Authorization)", element: "TPGAddintionalConsentsChk", expectedValue: true },

					{ docName: "dTPGCODisclosureRALFCA", formName: "dTPGCODisclosureRALFCA", description: "TPG Colorado Disclosure RAL FCA", displayName: "TPG Colorado Disclosure RAL FCA", element: "TPGCODisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGCOPosterRALFCA", formName: "fTPGCOPosterRALFCA", description: "TPG Colorado Poster RAL FCA", displayName: "TPG Colorado Poster RAL FCA", element: "TPGCOPosterRALFCAChk", expectedValue: true },
					{ docName: "dTPGILDisclosureRALFCA", formName: "fTPGILDisclosureRALFCA", description: "TPG Illinois Disclosure RAL FCA", displayName: "TPG Illinois Disclosure RAL FCA", element: "TPGILDisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGILPosterRALFCA", formName: "fTPGILPosterRALFCA", description: "TPG Illinois Poster RAL FCA", displayName: "TPG Illinois Poster RAL FCA", element: "TPGILPosterRALFCAChk", expectedValue: true },
					{ docName: "dTPGChicagoDisclosureRALFCA", formName: "fTPGChicagoDisclosureRALFCA", description: "TPG Chicago municipal Disclosure RAL FCA", displayName: "TPG Chicago municipal Disclosure RAL FCA", element: "TPGChicagoDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGMNDisclosureRALFCA", formName: "fTPGMNDisclosureRALFCA", description: "TPG Minnesota Disclosure RAL FCA", displayName: "TPG Minnesota Disclosure RAL FCA", element: "TPGMNDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGARMDMEDisclosureRALFCA", formName: "fTPGARMDMEDisclosureRALFCA", description: "TPG Multi State AR MD ME Discolsure RAL FCA", displayName: "TPG Multi State AR MD ME Discolsure RAL FCA", element: "TPGARMDMEDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGCACTLAMINCNJNVTNTXVAWADisclosureRALFCA", formName: "fTPGCACTLAMINCNJNVTNTXVAWADisclosureRALFCA", description: "TPG Multi State CA CT LA MI NC NJ NV TN TX VA WA Discolsure RAL FCA", displayName: "TPG Multi State CA CT LA MI NC NJ NV TN TX VA WA Discolsure RAL FCA", element: "TPGCACTLAMINCNJNVTNTXVAWADisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGARCALAMEMDNCNVTNVAPosterRALFCA", formName: "fTPGARCALAMEMDNCNVTNVAPosterRALFCA", description: "TPG Multi State AR CA LA ME MD NC NV TN VA Poster RAL FCA", displayName: "TPG Multi State AR CA LA ME MD NC NV TN VA Poster RAL FCA", element: "TPGARCALAMEMDNCNVTNVAPosterRALFCAChk", expectedValue: true },
					{ docName: "dTPGNYCityDisclosureFCA", formName: "fTPGNYCityDisclosureFCA", description: "TPG New York City Municiple Disclosure FCA", displayName: "TPG New York City Municiple Disclosure FCA", element: "TPGNYCityDisclosureFCAChk", expectedValue: true },
					{ docName: "dTPGNYDisclosureRALFCA", formName: "fTPGNYDisclosureRALFCA", description: "TPG NewYork Disclosure RAL FCA", displayName: "TPG NewYork Disclosure RAL FCA", element: "TPGNYDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGCODisclosureRALPlus", formName: "fTPGCODisclosureRALPlus", description: "TPG Colorado Disclosure RAL Plus", displayName: "TPG Colorado Disclosure RAL Plus", element: "TPGCODisclosureRALPlusChk", expectedValue: true },
					//{ docName: "dTPGCOWallPosterRALPlus", formName: "fTPGCOWallPosterRALPlus", description: "TPG Colorado Wall Poster RAL Plus", displayName: "TPG Colorado Wall Poster RAL Plus", element: "TPGCOWallPosterRALPlusChk", expectedValue: true },
					{ docName: "dTPGILDisclosureRALPlus", formName: "fTPGILDisclosureRALPlus", description: "TPG Illinois Disclosure RAL Plus", displayName: "TPG Illinois Disclosure RAL Plus", element: "TPGILDisclosureRALPlusChk", expectedValue: true },
					//{ docName: "dTPGILWallPosterRALPlus", formName: "fTPGILWallPosterRALPlus", description: "TPG Illinois Wall Poster RAL Plus", displayName: "TPG Illinois Wall Poster RAL Plus", element: "TPGILWallPosterRALPlusChk", expectedValue: true },
					{ docName: "dTPGMNDisclosureRALPlus", formName: "fTPGMNDisclosureRALPlus", description: "TPG Minnesota Disclosure RAL Plus", displayName: "TPG Minnesota Disclosure RAL Plus", element: "TPGMNDisclosureRALPlusChk", expectedValue: true },
					{ docName: "dTPGMultiStateARMDMEDisclosureRALPlus", formName: "fTPGMultiStateARMDMEDisclosureRALPlus", description: "TPG MultiState AR MD ME Disclosure RAL Plus", displayName: "TPG MultiState AR MD ME Disclosure RAL Plus", element: "TPGMultiStateARMDMEDisclosureRALPlusChk", expectedValue: true },
					{ docName: "dTPGMultiStateCACTLAMINCNJNVORTNTXVAWADisclosureRALPlus", formName: "fTPGMultiStateCACTLAMINCNJNVORTNTXVAWADisclosureRALPlus", description: "TPG MultiState CA CT LA MI NC NJ NV OR TN TX VA WA DisclosureRAL Plus", displayName: "TPG MultiState CA CT LA MI NC NJ NV OR TN TX VA WA DisclosureRAL Plus", element: "TPGMultiStateCACTLAMINCNJNVORTNTXVAWADisclosureRALPlusChk", expectedValue: true },
					//{ docName: "dTPGMultiStateARCALAMEMDNCNVTNVAWallPosterRALPlus", formName: "fTPGMultiStateARCALAMEMDNCNVTNVAWallPosterRALPlus", description: "TPG MultiState AR CA LA ME MD NC NV TN VA Wall Poster RAL Plus", displayName: "TPG MultiState AR CA LA ME MD NC NV TN VA Wall Poster RAL Plus", element: "TPGMultiStateARCALAMEMDNCNVTNVAWallPosterRALPlusChk", expectedValue: true },
					{ docName: "dTPGNYCityDisclosureRALPlus", formName: "fTPGNYCityDisclosureRALPlus", description: "TPG New York City Municiple Disclosure RAL Plus", displayName: "TPG New York City Municiple Disclosure RAL Plus", element: "TPGNYCityDisclosureRALPlusChk", expectedValue: true },
					{ docName: "dTPGNYDisclosureRALPlus", formName: "fTPGNYDisclosureRALPlus", description: "TPG New York Disclosure RAL Plus", displayName: "TPG New York Disclosure RAL Plus", element: "TPGNYDisclosureRALPlusChk", expectedValue: true },

					{ docName: "dTPGFCAAgreement", formName: "fTPGFCAAgreement", description: "TPG FCA Agreement", displayName: "TPG FCA Agreement", element: "TPGFCAAgreementChk", expectedValue: true },
					{ docName: "dTPGAdvancePlusAgreement", formName: "fTPGAdvancePlusAgreement", description: "TPG Advance Plus Agreement", displayName: "TPG Advance Plus Agreement", element: "TPGAdvancePlusAgreementChk", expectedValue: true },
					{ docName: "dTPGNonRTApplicationAndAgreementAdvance", formName: "fTPGNonRTApplicationAndAgreementAdvance", description: "TPG Non RT Application And Agreement Advance", displayName: "TPG Non RT Application And Agreement Advance", element: "TPGNonRTApplicationAndAgreementAdvanceChk", expectedValue: true },
					{ docName: "dTPGRTApplicationAndAgreement", formName: "fTPGRTApplicationAndAgreement", description: "TPG RT Application And Agreement", displayName: "TPG RT Application And Agreement", element: "TPGRTApplicationAndAgreementChk", expectedValue: true },
					{ docName: "dTPGRTFeeDisclosure", formName: "fTPGRTFeeDisclosure", description: "TPG RT Fee Disclosure", displayName: "TPG RT Fee Disclosure", element: "TPGRTFeeDisclosureChk", expectedValue: true }
					//{docName : "dTPGDisbursementGeneral",formName : "fTPGDisbursementGeneral",description : "TPG Disbursement General",displayName : "TPG Disbursement General",element : "TPGDisbursementGeneralChk",expectedValue : true}
				],
				"dRefundAdvantageBankApp": [{ docName: "dRAGeneralRT", formName: "fRAGeneralRT", description: "Refund Advantage RT Taxpayer Agreement", displayName: "Refund Advantage RT Taxpayer Agreement", element: "BankAppTypeChk", expectedValue: "1" },
				{ docName: "dRAGeneralRT", formName: "fRAGeneralRT", description: "Refund Advantage RT Taxpayer Agreement", displayName: "Refund Advantage RT Taxpayer Agreement", element: "BankAppTypeChk", expectedValue: "3" },
				{ docName: "dRAGeneralRAL", formName: "fRAGeneralRAL", description: "Refund Advantage RAL Agreement", displayName: "Refund Advantage RAL Agreement", element: "BankAppTypeChk", expectedValue: "3" },
				{ docName: "dRAGeneralRAL", formName: "fRAGeneralRAL", description: "Refund Advantage RAL Agreement", displayName: "Refund Advantage RAL Agreement", element: "BankAppTypeChk", expectedValue: "2" },
				//{ docName: "dRADisclosureRTAR", formName: "fRADisclosureRTAR", description: "Refund Advantage Arkansas Disclosure – RT", displayName: "Refund Advantage Arkansas Disclosure – RT", element: "IsdRADisclosureRTAR", expectedValue: true },
				//{ docName: "dRADisclosureRTIL", formName: "fRADisclosureRTIL", description: "Refund Advantage Illinois Disclosure - RT", displayName: "Refund Advantage Illinois Disclosure - RT", element: "IsdRADisclosureRTIL", expectedValue: true },
				//{ docName: "dRADisclosureRTME", formName: "fRADisclosureRTME", description: "Refund Advantage Maine Disclosure - RT", displayName: "Refund Advantage Maine Disclosure - RT", element: "IsdRADisclosureRTME", expectedValue: true },
				//{ docName: "dRADisclosureRTMD", formName: "fRADisclosureRTMD", description: "Refund Advantage Maryland Disclosure - RT", displayName: "Refund Advantage Maryland Disclosure - RT", element: "IsdRADisclosureRTMD", expectedValue: true },
				{ docName: "dRADisclosureRTMN", formName: "fRADisclosureRTMN", description: "Refund Advantage Minnesota Disclosure - RT", displayName: "Refund Advantage Minnesota Disclosure - RT", element: "IsdRADisclosureRTMN", expectedValue: true },
				{ docName: "dRADisclosureRTChicago", formName: "fRADisclosureRTChicago", description: "Refund Advantage Chicago Disclosure – RT", displayName: "Refund Advantage Chicago Disclosure – RT", element: "IsRADisclosureRTChicago", expectedValue: true },
				{ docName: "dRADisclosureRTARMDMEIL", formName: "RADisclosureRTARMDMEIL", description: "Refund Advantage Multi-State (AR, ME, MD,IL) Disclosure4 - RT", displayName: "Refund Advantage Multi-State (AR, ME, MD,IL) Disclosure4 - RT", element: "IsRADisclosureRTARMDMEIL", expectedValue: true },
				{ docName: "dRADisclosureRTNY", formName: "fRADisclosureRTNY", description: "Refund Advantage New York Disclosure – RT", displayName: "Refund Advantage New York Disclosure – RT", element: "IsRADisclosureRTNY", expectedValue: true },
				//{ docName: "dRADisclosureStateRTNY", formName: "fRADisclosureStateRTNY", description: "Refund Advantage New York State Disclosure – RT", displayName: "Refund Advantage New York State Disclosure – RT", element: "IsRADisclosureStateRALNY", expectedValue: true },
				//{ docName: "dRADisclosureCityRTNY", formName: "fRADisclosureCityRTNY", description: "Refund Advantage New York City Disclosure – RT", displayName: "Refund Advantage New York City Disclosure – RT", element: "IsdRADisclosureCityRALNY", expectedValue: true },
				{ docName: "dRADisclosureRALIL", formName: "fRADisclosureRALIL", description: "Refund Advantage Illinois Disclosure - RAL", displayName: "Refund Advantage Illinois Disclosure - RAL", element: "IsdRADisclosureRALIL", expectedValue: true },
				//{ docName: "dRADisclosureRALWI", formName: "fRADisclosureRALWI", description: "Refund Advantage Wisconsin Disclosure - RAL", displayName: "Refund Advantage Wisconsin Disclosure - RAL", element: "IsdRADisclosureRALWI", expectedValue: true },
				{ docName: "dRADisclosureRALCO", formName: "fRADisclosureRALCO", description: "Refund Advantage Colorado Disclosure - RAL", displayName: "Refund Advantage Colorado Disclosure - RAL", element: "IsdRADisclosureRALCO", expectedValue: true },
				{ docName: "dRADisclosureRALMN", formName: "fRADisclosureRALMN", description: "Refund Advantage Minnesota Disclosure – RAL", displayName: "Refund Advantage Minnesota Disclosure – RAL", element: "IsdRADisclosureRALMN", expectedValue: true },
				//{ docName: "dRADisclosureRALNY", formName: "fRADisclosureRALNY", description: "Refund Advantage New York Disclosure - RAL", displayName: "Refund Advantage New York Disclosure - RAL", element: "IsdRADisclosureRALNY", expectedValue: true },
				{ docName: "dRADisclosureCityRALNY", formName: "fRADisclosureCityRALNY", description: "Refund Advantage New York City Disclosure - RAL", displayName: "Refund Advantage New York City Disclosure - RAL", element: "IsRADisclosureCityRALNY", expectedValue: true },
				{ docName: "dRADisclosureStateRALNY", formName: "fRADisclosureStateRALNY", description: "Refund Advantage New State York Disclosure - RAL", displayName: "Refund Advantage New York State Disclosure - RAL", element: "IsRADisclosureStateRALNY", expectedValue: true },
				//{ docName: "dRADisclosureRALCALANVTNTXVA", formName: "fRADisclosureRALCALANVTNTXVA", description: "Refund Advantage Multi-State (CA, LA, NV, TN, TX, VA) Disclosure1  - RAL", displayName: "Refund Advantage Multi-State (CA, LA, NV, TN, TX, VA) Disclosure1  - RAL", element: "IsdRADisclosureRALCALANVTNTXVA", expectedValue: true },
				//{ docName: "dRADisclosureRALCTNC", formName: "fRADisclosureRALCTNC", description: "Refund Advantage Multi-State (CT and NC) Disclosure2 – RAL", displayName: "Refund Advantage Multi-State (CT and NC) Disclosure2 – RAL", element: "IsdRADisclosureRALCTNC", expectedValue: true },
				{ docName: "dRADisclosureRALARMEMD", formName: "fRADisclosureRALARMEMD", description: "Refund Advantage Multi-State (AR, ME, MD) Disclosure3 - RAL", displayName: "Refund Advantage Multi-State (AR, ME, MD) Disclosure3 - RAL", element: "IsdRADisclosureRALARMEMD", expectedValue: true },
				{ docName: "dRADisclosureRALMultiState", formName: "fRADisclosureRALMultiState", description: "Refund Advantage Multi-state Disclosure - RAL", displayName: "Refund Advantage Multi-state Disclosure - RAL", element: "IsdRADisclosureRALMultiState", expectedValue: true },
					//{ docName: "dRADisclosureRALNJ", formName: "fRADisclosureRALNJ", description: "Refund Advantage New Jersey Disclosure - RAL", displayName: "Refund Advantage New Jersey Disclosure - RAL", element: "IsdRADisclosureRALNJ", expectedValue: true },
					//{ docName: "dRADisclosureRALWA", formName: "fRADisclosureRALWA", description: "Refund Advantage Washington Disclosure - RAL", displayName: "Refund Advantage Washington Disclosure - RAL", element: "IsdRADisclosureRALWA", expectedValue: true },
					//{ docName: "dRADisclosureRALMI", formName: "fRADisclosureRALMI", description: "Refund Advantage Michigan Disclosure - RAL", displayName: "Refund Advantage Michigan Disclosure - RAL", element: "IsdRADisclosureRALMI", expectedValue: true }
				]
			};
		} else {
			var _bankAgreementPrintConfig = {
				"dEPSBankApp": [{ docName: "dEPSVisaPrepaidCardRequestFormMPS", formName: "fEPSVisaPrepaidCardRequestFormMPS", description: "EPS Visa Prepaid Card Request Form MPS", displayName: "EPS Visa Prepaid Card Request Form MPS", element: "E1VisaCardAddFormChk", expectedValue: true },
				{ docName: "dEPSRTAgreementEBonusEAdvance", formName: "fEPSRTAgreementEBonusEAdvance", description: "EPS RT Agreement For eBonus And eAdvance", displayName: "EPS RT Agreement For eBonus And eAdvance", element: "EPSRTAgreementEBonusEAdvanceChk", expectedValue: true },
				{ docName: "dEPSFreeRTAgreementFINAL", formName: "fEPSFreeRTAgreementFINAL", description: "EPS Free RT Agreement FINAL", displayName: "EPS Free RT Agreement FINAL", element: "EPSFreeRTAgreementFINALChk", expectedValue: true },
				//{ docName: "dEPSRALGeneralAgreement", formName: "fEPSRALGeneralAgreement", description: "EPS RAL General Agreement", displayName: "EPS RAL General Agreement", element: "EPSRALGeneralAgreementChk", expectedValue: true },
				{ docName: "dEPSRTAgreementECollect", formName: "fEPSRTAgreementECollect", description: "EPS RT Agreement For eCollect", displayName: "EPS RT Agreement For eCollect", element: "EPSRTAgreementECollectChk", expectedValue: true },
				{ docName: "dEPSRALInterestBearingNoFee", formName: "fEPSRALInterestBearingNoFee", description: "EPS RAL Interest Bearing No Fee", displayName: "EPS RAL Interest Bearing No Fee", element: "EPSRALInterestBearingNoFeeChk", expectedValue: true },
				{ docName: "dEPSRALNoFeeOnly", formName: "fEPSRALNoFeeOnly", description: "EPS RAL No Fee Only", displayName: "EPS RAL No Fee Only", element: "EPSRALNoFeeOnlyChk", expectedValue: true },
				//{ docName: "dEPSPlusUpAgreement", formName: "fEPSPlusUpAgreement", description: "EPS Plus Up Agreement", displayName: "EPS Plus Up Agreement", element: "IsEPSPlusUpAgreement", expectedValue: true },
				{ docName: "dEPSRACeAdvanceDisclosureARILMDME", formName: "fEPSRACeAdvanceDisclosureARILMDME", description: "EPS RAC eAdvance Disclosure AR IL MD ME", displayName: "EPS RAC eAdvance Disclosure AR IL MD ME", element: "EPSRACeAdvanceDisclosureARILMDMEChk", expectedValue: true },
				{ docName: "dEPSRACeBonusDisclosureARILMDME", formName: "fEPSRACeBonusDisclosureARILMDME", description: "EPS RAC eBonus Disclosure AR IL MD ME", displayName: "EPS RAC eBonus Disclosure AR IL MD ME", element: "EPSRACeBonusDisclosureARILMDMEChk", expectedValue: true },
				{ docName: "dEPSRACeCollectDisclosureARILMDME", formName: "fEPSRACeCollectDisclosureARILMDME", description: "EPS RAC eCollect Disclosure AR IL MD ME", displayName: "EPS RAC eCollect Disclosure AR IL MD ME", element: "EPSRACeCollectDisclosureARILMDMEChk", expectedValue: true },
				{ docName: "dEPSRACeBonusMinnesota", formName: "fEPSRACeBonusMinnesota", description: "EPS RAC eBonus Minnesota", displayName: "EPS RAC eBonus Minnesota", element: "isEPSRACeBonusMinnesota", expectedValue: true },
				{ docName: "dEPSRACeAdvanceMinnesota", formName: "fEPSRACeAdvanceMinnesota", description: "EPS RAC eAdvance Minnesota", displayName: "EPS RAC eAdvance Minnesota", element: "isEPSRACeAdvanceMinnesota", expectedValue: true },
				{ docName: "dEPSRACeCollectMinnesota", formName: "fEPSRACeCollectMinnesota", description: "EPS RAC eCollect Minnesota", displayName: "EPS RAC eCollect Minnesota", element: "isEPSRACeCollectMinnesota", expectedValue: true },
				{ docName: "dEPSRACeAdvanceDisclosureNY", formName: "fEPSRACeAdvanceDisclosureNY", description: "EPS RAC eAdvance Disaclosure NY", displayName: "EPS RAC eAdvance Disaclosure NY", element: "EPSeAdvanceRALDisclosureNYChk", expectedValue: true },
				{ docName: "dEPSRACeBonusDisclosureNY", formName: "fEPSRACeBonusDisclosureNY", description: "EPS RAC eBonus Disaclosure NY", displayName: "EPS RAC eBonus Disaclosure NY", element: "EPSeBonusRALDisclosureNYChk", expectedValue: true },
				{ docName: "dEPSRACeCollectDisclosureNY", formName: "fEPSRACeCollectDisclosureNY", description: "EPS RAC eCollect Disaclosure NY", displayName: "EPS RAC eCollect Disaclosure NY", element: "EPSeCollectRALDisclosureNYChk", expectedValue: true },

				{ docName: "dEPSDisclosureRTChicago", formName: "fEPSDisclosureRTChicago", description: "EPS Chicago Disclosure – RT", displayName: "EPS Chicago Disclosure – RT", element: "IsRADisclosureRTChicago", expectedValue: true },
				{ docName: "dEPSRALDisclosureCO", formName: "fEPSRALDisclosureCO", description: "EPS RAL Disclosure CO", displayName: "EPS RAL Disclosure CO", element: "EPSRALDisclosureCOChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureeBonusIL", formName: "fEPSRALDisclosureeBonusIL", description: "EPS RAL Disclosure eBonus IL", displayName: "EPS RAL Disclosure eBonus IL", element: "isEPSRALDisclosureeBonusIL", expectedValue: true },
				{ docName: "dEPSRALDisclosureeAdvanceIL", formName: "fEPSRALDisclosureeAdvanceIL", description: "EPS RAL Disclosure eAdvance IL", displayName: "EPS RAL Disclosure eAdvance IL", element: "isEPSRALDisclosureeAdvanceIL", expectedValue: true },
				{ docName: "dEPSRALDisclosureILECollect", formName: "fEPSRALDisclosureILECollect", description: "EPS RAL Disclosure eCollect IL", displayName: "EPS RAL Disclosure eCollect IL", element: "EPSRALDisclosureILECollectChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureMN", formName: "fEPSRALDisclosureMN", description: "EPS RAL Disclosure MN", displayName: "EPS RAL Disclosure MN", element: "EPSRALDisclosureMNChk", expectedValue: true },
				{ docName: "dEPSMultiStateRALDisclosureARCTMDMENJ", formName: "fEPSMultiStateRALDisclosureARCTMDMENJ", description: "EPS MultiState RAL Disclosure AR CT MD ME NJ", displayName: "EPS MultiState RAL Disclosure AR CT MD ME NJ", element: "isRALMultiStateARCTMDMENJ", expectedValue: true },
				{ docName: "dEPSMultiStateRALDisclosureCALAMINCNVORTNTXVAWAWI", formName: "fEPSMultiStateRALDisclosureCALAMINCNVORTNTXVAWAWI", description: "EPS MultiState RAL Dislosure CA LA MI NC NV OR TN TX VA WA WI", displayName: "EPS MultiState RAL Dislosure CA LA MI NC NV OR TN TX VA WA WI", element: "isRALMultiStateCALAMINCNVORTNTXVAWAWI", expectedValue: true },
				{ docName: "dEPSNewMexicoRALDisclosure", formName: "fEPSNewMexicoRALDisclosure", description: "EPS New Mexico RAL Disclosure", displayName: "EPS New Mexico RAL Disclosure", element: "isRALNewMexico", expectedValue: true },
				{ docName: "dEPSRALDisclosureNYCity", formName: "fEPSRALDisclosureNYCity", description: "EPS RAL Disclosure New York City Municipal", displayName: "EPS RAL Disclosure New York City Municipal", element: "EPSRALDisclosureNYCityChk", expectedValue: true },
				{ docName: "dEPSRALDisclosureNY", formName: "fEPSRALDisclosureNY", description: "EPS RAL Disclosure NY", displayName: "EPS RAL Disclosure NY", element: "EPSRALDisclosureNYChk", expectedValue: true },


				//{ docName: "dEPSRALDisclosureEBonusEAdvanceARMDME", formName: "fEPSRALDisclosureEBonusEAdvanceARMDME", description: "EPS RAL Disclosure eBonus eAdvance AR MD ME", displayName: "EPS RAL Disclosure eBonus eAdvance AR MD ME", element: "EPSRALDisclosureEBonusEAdvanceARMDMEChk", expectedValue: true },
				//{ docName: "dEPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWI", formName: "fEPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWI", description: "EPS RAL Disclosure eBonus eAdvance CA CT LA MI NC NJ NV OR TN TX VA WA WI", displayName: "EPS RAL Disclosure eBonus eAdvance CA CT LA MI NC NJ NV OR TN TX VA WA WI", element: "EPSRALDisclosureEBonusEAdvanceCACTLAMINCNJNVORTNTXVAWAWIChk", expectedValue: true },
				//{ docName: "dEPSRALDisclosureECollectARMDME", formName: "fEPSRALDisclosureECollectARMDME", description: "EPS RAL Disclosure eCollect AR MD ME", displayName: "EPS RAL Disclosure eCollect AR MD ME", element: "EPSRALDisclosureECollectARMDMEChk", expectedValue: true },
				//{ docName: "dEPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWI", formName: "fEPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWI", description: "EPS RAL Disclosure eCollect CA CT LA MI NC NJ NV OR TN TX VA WA WI", displayName: "EPS RAL Disclosure eCollect CA CT LA MI NC NJ NV OR TN TX VA WA WI", element: "EPSRALDisclosureEcollectCACTLAMINCNJNVORTNTXVAWAWIChk", expectedValue: true },
				//{ docName: "dEPSRALDisclosureIL", formName: "fEPSRALDisclosureIL", description: "EPS RAL Disclosure IL", displayName: "EPS RAL Disclosure IL", element: "EPSRALDisclosureILChk", expectedValue: true },
				//{ docName: "dEPSRALDisclosureILEBonusEAdvance", formName: "fEPSRALDisclosureILEBonusEAdvance", description: "EPS RAL Disclosure eBonus eAdvance IL", displayName: "EPS RAL Disclosure eBonus eAdvance IL", element: "EPSRALDisclosureILEBonusEAdvanceChk", expectedValue: true },

				//{ docName: "dEPSRALPlusUpDisclosureCO", formName: "fEPSRALPlusUpDisclosureCO", description: "EPS RAL Plus Up Colorado Disclosure", displayName: "EPS RAL Plus Up Colorado Disclosure", element: "EPSRALPlusUpDisclosureCOChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpDisclosureILEBonusEAdvance", formName: "fEPSRALPlusUpDisclosureILEBonusEAdvance", description: "EPS RAL Plus-Up IL Disclosure eAdvance-eBonus", displayName: "EPS RAL Plus-Up IL Disclosure eAdvance-eBonus", element: "EPSRALPlusUpDisclosureILEBonusEAdvanceChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpDisclosureILECollect", formName: "fEPSRALPlusUpDisclosureILECollect", description: "EPS RAL Plus-Up IL Disclosure eCollect", displayName: "EPS RAL Plus-Up IL Disclosure eCollect", element: "EPSRALPlusUpDisclosureILECollectChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpMinnesotaDisclosure", formName: "fEPSRALPlusUpMinnesotaDisclosure", description: "EPS RAL Plus Up Minnesota Disclosure", displayName: "EPS RAL Plus Up Minnesota Disclosure", element: "EPSRALPlusUpMinnesotaDisclosureChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpDisclosureARMEMDEBonusEAdvance", formName: "fEPSRALPlusUpDisclosureARMEMDEBonusEAdvance", description: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eAdvance - eBonus", displayName: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eAdvance - eBonus", element: "EPSRALPlusUpDisclosureARMEMDEBonusEAdvanceChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpDisclosureARMEMDECollect", formName: "fEPSRALPlusUpDisclosureARMEMDECollect", description: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eCollect", displayName: "EPS RAL Plus Up AR , ME ,MD Multi State Disclosure eCollect", element: "EPSRALPlusUpDisclosureARMEMDECollectChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpNewYorkCityMunicipalInterestDisclosure", formName: "fEPSRALPlusUpNewYorkCityMunicipalInterestDisclosure", description: "EPS RAL Plus Up New York City Municipal Interest Disclosure", displayName: "EPS RAL Plus Up New York City Municipal Interest Disclosure", element: "EPSRALPlusUpNewYorkCityMunicipalInterestDisclosureChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpNewYorkDisclosure", formName: "fEPSRALPlusUpNewYorkDisclosure", description: "EPS RAL Plus Up New York Disclosure", displayName: "EPS RAL Plus Up New York Disclosure", element: "EPSRALPlusUpNewYorkDisclosureChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIEAdvanceEBonus", formName: "fEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIEAdvanceEBonus", description: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eAdvance-eBonus", displayName: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eAdvance-eBonus", element: "EPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIEAdvanceEBonusChk", expectedValue: true },
				//{ docName: "dEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIECollect", formName: "fEPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIECollect", description: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eCollect", displayName: "EPS RAL Plus Up CA CT LA MI NC NJ NV OR TN TX VA WA WI Multi State eCollect", element: "EPSRALPlusUpDisclosureCACTLAMINCNJNVORTNTXVAWAWIECollectChk", expectedValue: true },

				//{ docName: "dEPSFasterMoneyVisaPrepaidCardRequestFormMPS", formName: "fEPSFasterMoneyVisaPrepaidCardRequestFormMPS", description: "EPS FasterMoney Visa Prepaid Card Request Form MPS", displayName: "EPS FasterMoney Visa Prepaid Card Request Form MPS", element: "EPSFasterMoneyVisaPrepaidCardRequestFormMPSChk", expectedValue: true },
				{ docName: "dEPSTaxPreparationFeeAcknowledgement", formName: "fEPSTaxPreparationFeeAcknowledgement", description: "EPS Tax Preparation Fee Acknowledgement", displayName: "EPS Tax Preparation Fee Acknowledgement", element: "EPSTaxPreparationFeeAcknowledgementChk", expectedValue: true },
				],
				"dAtlasBankApp": [
					{ docName: "dNavigatorEasyAdvanceInformationPage", formName: "fNavigatorEasyAdvanceInformationPage", description: "Navigator Easy Advance Information Page", displayName: "Navigator Easy Advance Information Page", element: "isNavigatorEasyAdvanceInformationPageChk", expectedValue: true },
					{ docName: "dNavigatorRATruthInLendingActDisclosure", formName: "fNavigatorRATruthInLendingActDisclosure", description: "Navigator RA Truth In Lending Act Disclosure", displayName: "Navigator RA Truth In Lending Act Disclosure", element: "isNavigatorRATruthInLendingActDisclosureChk", expectedValue: true },
					{ docName: "dNavigatorNeedToKnowSheetRT", formName: "fNavigatorNeedToKnowSheetRT", description: "Navigator Need To Know Sheet RT", displayName: "Navigator Need To Know Sheet RT", element: "isNavigatorNeedToKnowSheetRTChk", expectedValue: true },
					{ docName: "dNavigatorEARTAgreement", formName: "fNavigatorEARTAgreement", description: "Navigator EA RT Agreement", displayName: "Navigator EA RT Agreement", element: "isNavigatorEARTAgreementChk", expectedValue: true },
					{ docName: "dNavigatorEARTTPAgreement", formName: "fNavigatorEARTTPAgreement", description: "Navigator EA RT TP Agreement", displayName: "Navigator EA RT TP Agreement", element: "isNavigatorEARTTPAgreementChk", expectedValue: true },
					{ docName: "dNavigatorPrivacyNotice", formName: "fNavigatorPrivacyNotice", description: "Navigator Privacy Notice", displayName: "Navigator Privacy Notice", element: "isNavigatorPrivacyNoticeChk", expectedValue: true },
					// { docName: "dNavigatorPaperCheckDisclosure", formName: "fNavigatorPaperCheckDisclosure", description: "Navigator Refund Anticipation Check (RAC) Disclosure", displayName: "Navigator Refund Anticipation Check (RAC) Disclosure", element: "isNavigatorPaperCheckDisclosure", expectedValue: true },
					//{ docName: "dNavigatorElectronicSignatureDisclosure", formName: "fNavigatorElectronicSignatureDisclosure", description: "Navigator electronic signature disclosure and consent", displayName: "Navigator electronic signature disclosure and consent", element: "isNavigatorElectronicSignatureDisclosure", expectedValue: true },
					//{ docName: "dNavigatorRTRALSeattle", formName: "fNavigatorRTRALSeattle", description: "Navigator RT RAL Seattle", displayName: "Navigator RT RAL Seattle", element: "NavigatorRTRALSeattleChk", expectedValue: true },
					//{ docName: "dNavigatorRTSanAntonio", formName: "fNavigatorRTSanAntonio", description: "Navigator RT San Antonio", displayName: "Navigator RT San Antonio", element: "NavigatorRTSanAntonioChk", expectedValue: true },
					//{ docName: "dNavigatorRTSeattle", formName: "fNavigatorRTSeattle", description: "Navigator RT Seattle", displayName: "Navigator RT Seattle", element: "NavigatorRTSeattleChk", expectedValue: true },
					//{ docName: "dNavigatorPaperCheckNY", formName: "fNavigatorPaperCheckNY", description: "Navigator Refund Anticipation Check (RAC) NY", displayName: "Navigator electronic signature disclosure and consent", element: "isNavigatorPaperCheckNY", expectedValue: true },
					{ docName: "dNavigatorRTAR", formName: "fNavigatorRTAR", description: "Navigator refund disclosure AR", displayName: "Navigator refund disclosure AR", element: "isNavigatorRTAR", expectedValue: true },
					{ docName: "dNavigatorRTIL", formName: "fNavigatorRTIL", description: "Navigator refund disclosure IL", displayName: "Navigator refund disclosure IL", element: "isNavigatorRTIL", expectedValue: true },
					{ docName: "dNavigatorRTMaryLand", formName: "fNavigatorRTMaryLand", description: "Navigator refund disclosure Maryland", displayName: "Navigator refund disclosure Maryland", element: "isNavigatorRTMaryland", expectedValue: true },
					{ docName: "dNavigatorRTMaine", formName: "fNavigatorRTMaine", description: "Navigator refund disclosure Maine", displayName: "Navigator refund disclosure Maine", element: "isNavigatorRTMaine", expectedValue: true },
					{ docName: "dNavigatorRTMN", formName: "fNavigatorRTMN", description: "Navigator refund disclosure MN", displayName: "Navigator refund disclosure MN", element: "isNavigatorRTMN", expectedValue: true },
					{ docName: "dNavigatorRTNY", formName: "fNavigatorRTNY", description: "Navigator refund disclosure NY", displayName: "Navigator refund disclosure NY", element: "isNavigatorRTNY", expectedValue: true },
					// { docName: "dNavigatorRALDisclosure", formName: "fNavigatorRALDisclosure", description: "Navigator Refund Anticipation Loan Disclosure", displayName: "Navigator Refund Anticipation Loan Disclosure", element: "isNavigatorRALDisclosure", expectedValue: true },
					//{ docName: "dNavigatorRALSanAntonio", formName: "fNavigatorRALSanAntonio", description: "Navigator RAL San Antonio", displayName: "Navigator RAL San Antonio", element: "NavigatorRALSanAntonioChk", expectedValue: true },
					//{ docName: "dNavigatorRALSeattle", formName: "fNavigatorRALSeattle", description: "Navigator RAL Seattle", displayName: "Navigator RAL Seattle", element: "NavigatorRALSeattleChk", expectedValue: true },
					{ docName: "dNavigatorRALArkansasRA", formName: "fNavigatorRALArkansasRA", description: "Navigator RAL Arkansas RA", displayName: "Navigator RAL Arkansas RA", element: "isNavigatorRALArkansasRA", expectedValue: true },
					{ docName: "dNavigatorRALColoradoRA", formName: "fNavigatorRALColoradoRA", description: "Navigator RAL Colorado RA", displayName: "Navigator RAL Colorado RA", element: "isNavigatorRALColoradoRA", expectedValue: true },
					{ docName: "dNavigatorRALCTRA", formName: "fNavigatorRALCTRA", description: "Navigator RAL CT RA", displayName: "Navigator RAL CT RA", element: "isNavigatorRALCTRA", expectedValue: true },
					{ docName: "dNavigatorRALILRADisclosure_39_500Final", formName: "fNavigatorRALILRADisclosure_39_500Final", description: "Navigator RAL IL RA Disclosure_39_500 Final", displayName: "Navigator RAL IL RA Disclosure_39_500 Final", element: "navigatorRADisclosureIL500Chk", expectedValue: true },
					{ docName: "dNavigatorRALILRADisclosure_39_1500Final", formName: "fNavigatorRALILRADisclosure_39_1500Final", description: "Navigator RAL IL RA Disclosure_39_1500 Final", displayName: "Navigator RAL IL RA Disclosure_39_1500 Final", element: "navigatorRADisclosureIL1500Chk", expectedValue: true },
					{ docName: "dnavigatorRADisclosureIL2000", formName: "fnavigatorRADisclosureIL2000", description: "Navigator RA Disclosure IL 2000", displayName: "Navigator RA Disclosure IL 2000", element: "navigatorRADisclosureIL2000Chk", expectedValue: true },
					{ docName: "dnavigatorRADisclosureIL3000", formName: "fnavigatorRADisclosureIL3000", description: "Navigator RA Disclosure IL 3000", displayName: "Navigator RA Disclosure IL 3000", element: "navigatorRADisclosureIL3000Chk", expectedValue: true },
					{ docName: "dnavigatorRADisclosureIL6000", formName: "fnavigatorRADisclosureIL6000", description: "Navigator RA Disclosure IL 6000", displayName: "Navigator RA Disclosure IL 6000", element: "navigatorRADisclosureIL6000Chk", expectedValue: true },
					{ docName: "dnavigatorMarylandRADisclosure", formName: "fnavigatorMarylandRADisclosure", description: "Navigator Maryland RA Disclosure", displayName: "Navigator Maryland RA Disclosure", element: "navigatorMarylandRADisclosureChk", expectedValue: true },
					{ docName: "dnavigatorMaineRADisclosure", formName: "fnavigatorMaineRADisclosure", description: "Navigator Maine RA Disclosure", displayName: "Navigator Maine RA Disclosure", element: "navigatorMaineRADisclosureChk", expectedValue: true },
					{ docName: "dnavigatorMinnesotaRADisclosure", formName: "fnavigatorMinnesotaRADisclosure", description: "Navigator Minnesota RA Disclosure", displayName: "Navigator Minnesota RA Disclosure", element: "navigatorMinnesotaRADisclosureChk", expectedValue: true },
					{ docName: "dNavigatorRALNJ", formName: "fNavigatorRALNJ", description: "Navigator Refund Anticipation Loan New Jersey", displayName: "Navigator Refund Anticipation Loan New Jersey", element: "isNavigatorRALNJ", expectedValue: true },
					{ docName: "dnavigatorNCRADisclosure", formName: "fnavigatorNCRADisclosure", description: "Navigator NC RA Disclosure", displayName: "Navigator NC RA Disclosure", element: "navigatorNCRADisclosureChk", expectedValue: true },
					{ docName: "dNavigatorRALNY", formName: "fNavigatorRALNY", description: "Navigator Refund Anticipation Loan Navigator New York", displayName: "Navigator Refund Anticipation Loan New York", element: "isNavigatorRALNY", expectedValue: true },
					{ docName: "dNavigatorWIRA", formName: "fNavigatorWIRA", description: "Navigator Wisconsin RA Disclosure", displayName: "Navigator Wisconsin RA Disclosure", element: "isNavigatorWIRAChk", expectedValue: true },
					{ docName: "dNavigatorNYCRA", formName: "fNavigatorNYCRA", description: "Navigator New York City RA Disclosure", displayName: "Navigator New York City RA Disclosure", element: "isNavigatorNYCRAChk", expectedValue: true },
					// { docName: "dNavigatorCreditRestore", formName: "fNavigatorCreditRestore", description: "Navigator Credit Restore", displayName: "Navigator Credit Restore", element: "NavigatorCreditRestoreChk", expectedValue: true }
					// { docName: "dNavigatorRALMN", formName: "fNavigatorRALMN", description: "Navigator Refund Anticipation Loan Minnesota", displayName: "Navigator Refund Anticipation Loan Minnesota", element: "isNavigatorRALMN", expectedValue: true },
				],
				"dTPGBankApp": [
					//{ docName: "dTPGSignDisclosureAndConsent", formName: "fTPGSignDisclosureAndConsent", description: "TPG Sign Disclosure And Consent", displayName: "TPG Sign Disclosure And Consent", element: "TPGSignDisclosureAndConsentChk", expectedValue: true },
					{ docName: "dTPGConsentToUseWithRT", formName: "fTPGConsentToUseWithRT", description: "TPG Consent To Use With RT", displayName: "TPG Consent To Use With RT", element: "TPGConsentToUseWithRTChk", expectedValue: true },
					{ docName: "dTPGConsentToUseWithAdvance", formName: "fTPGConsentToUseWithAdvance", description: "TPG Consent To Use With Advance", displayName: "TPG Consent To Use With Advance", element: "TPGConsentToUseWithAdvanceChk", expectedValue: true },
					{ docName: "dTPGConsentToDiscloseWithRT", formName: "fTPGConsentToDiscloseWithRT", description: "TPG Consent To Disclose With RT", displayName: "TPG Consent To Disclose With RT", element: "TPGConsentToDiscloseWithRTChk", expectedValue: true },
					{ docName: "dTPGConsentToDiscloseWithAdvance", formName: "fTPGConsentToDiscloseWithAdvance", description: "TPG Consent To  Disclose With Advance", displayName: "TPG Consent To  Disclose With Advance", element: "TPGConsentToDiscloseWithAdvanceChk", expectedValue: true },
					{ docName: "dTPGAddintionalConsents", formName: "fTPGAddintionalConsents", description: "TPG Additional Concents(Authorization)", displayName: "TPG Additional Concents(Authorization)", element: "TPGAddintionalConsentsChk", expectedValue: true },

					{ docName: "dTPGCODisclosureRALFCA", formName: "dTPGCODisclosureRALFCA", description: "TPG Colorado Disclosure RAL FCA", displayName: "TPG Colorado Disclosure RAL FCA", element: "TPGCODisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGCOPosterRALFCA", formName: "fTPGCOPosterRALFCA", description: "TPG Colorado Poster RAL FCA", displayName: "TPG Colorado Poster RAL FCA", element: "TPGCOPosterRALFCAChk", expectedValue: true },
					{ docName: "dTPGILDisclosureRALFCA", formName: "fTPGILDisclosureRALFCA", description: "TPG Illinois Disclosure RAL FCA", displayName: "TPG Illinois Disclosure RAL FCA", element: "TPGILDisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGILPosterRALFCA", formName: "fTPGILPosterRALFCA", description: "TPG Illinois Poster RAL FCA", displayName: "TPG Illinois Poster RAL FCA", element: "TPGILPosterRALFCAChk", expectedValue: true },
					{ docName: "dTPGChicagoDisclosureRALFCA", formName: "fTPGChicagoDisclosureRALFCA", description: "TPG Chicago municipal Disclosure RAL FCA", displayName: "TPG Chicago municipal Disclosure RAL FCA", element: "TPGChicagoDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGMNDisclosureRALFCA", formName: "fTPGMNDisclosureRALFCA", description: "TPG Minnesota Disclosure RAL FCA", displayName: "TPG Minnesota Disclosure RAL FCA", element: "TPGMNDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGARMDMEDisclosureRALFCA", formName: "fTPGARMDMEDisclosureRALFCA", description: "TPG Multi State AR MD ME Discolsure RAL FCA", displayName: "TPG Multi State AR MD ME Discolsure RAL FCA", element: "TPGARMDMEDisclosureRALFCAChk", expectedValue: true },
					{ docName: "dTPGCACTLAMINCNJNVTNTXVAWADisclosureRALFCA", formName: "fTPGCACTLAMINCNJNVTNTXVAWADisclosureRALFCA", description: "TPG Multi State CA CT LA MI NC NJ NV TN TX VA WA Discolsure RAL FCA", displayName: "TPG Multi State CA CT LA MI NC NJ NV TN TX VA WA Discolsure RAL FCA", element: "TPGCACTLAMINCNJNVTNTXVAWADisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGARCALAMEMDNCNVTNVAPosterRALFCA", formName: "fTPGARCALAMEMDNCNVTNVAPosterRALFCA", description: "TPG Multi State AR CA LA ME MD NC NV TN VA Poster RAL FCA", displayName: "TPG Multi State AR CA LA ME MD NC NV TN VA Poster RAL FCA", element: "TPGARCALAMEMDNCNVTNVAPosterRALFCAChk", expectedValue: true },
					{ docName: "dTPGNYCityDisclosureFCA", formName: "fTPGNYCityDisclosureFCA", description: "TPG New York City Municiple Disclosure FCA", displayName: "TPG New York City Municiple Disclosure FCA", element: "TPGNYCityDisclosureFCAChk", expectedValue: true },
					{ docName: "dTPGNYDisclosureRALFCA", formName: "fTPGNYDisclosureRALFCA", description: "TPG NewYork Disclosure RAL FCA", displayName: "TPG NewYork Disclosure RAL FCA", element: "TPGNYDisclosureRALFCAChk", expectedValue: true },
					//{ docName: "dTPGCODisclosureRALPlus", formName: "fTPGCODisclosureRALPlus", description: "TPG Colorado Disclosure RAL Plus", displayName: "TPG Colorado Disclosure RAL Plus", element: "TPGCODisclosureRALPlusChk", expectedValue: true },
					//{ docName: "dTPGCOWallPosterRALPlus", formName: "fTPGCOWallPosterRALPlus", description: "TPG Colorado Wall Poster RAL Plus", displayName: "TPG Colorado Wall Poster RAL Plus", element: "TPGCOWallPosterRALPlusChk", expectedValue: true },
					//{ docName: "dTPGILDisclosureRALPlus", formName: "fTPGILDisclosureRALPlus", description: "TPG Illinois Disclosure RAL Plus", displayName: "TPG Illinois Disclosure RAL Plus", element: "TPGILDisclosureRALPlusChk", expectedValue: true },
					//{ docName: "dTPGILWallPosterRALPlus", formName: "fTPGILWallPosterRALPlus", description: "TPG Illinois Wall Poster RAL Plus", displayName: "TPG Illinois Wall Poster RAL Plus", element: "TPGILWallPosterRALPlusChk", expectedValue: true },
					//{ docName: "dTPGMNDisclosureRALPlus", formName: "fTPGMNDisclosureRALPlus", description: "TPG Minnesota Disclosure RAL Plus", displayName: "TPG Minnesota Disclosure RAL Plus", element: "TPGMNDisclosureRALPlusChk", expectedValue: true },
					{ docName: "dTPGFCAARCTMDMENJMultiStateRALDisclosure", formName: "fTPGFCAARCTMDMENJMultiStateRALDisclosure", description: "TPG FCA AR CT MD ME NJ MultiState RAL Disclosure", displayName: "TPG FCA AR CT MD ME NJ MultiState RAL Disclosure", element: "TPGFCAARCTMDMENJMultiStateRALDisclosureChk", expectedValue: true },
					{ docName: "dTPGFCAMultiStateCALAMINCNVORTNTXVAWAWIRALDisclosure", formName: "fTPGFCAMultiStateCALAMINCNVORTNTXVAWAWIRALDisclosure", description: "TPG FCA MultiState CA LA MI NC NV OR TN TX VA WA WI RAL Disclosure", displayName: "TPG FCA MultiState CA LA MI NC NV OR TN TX VA WA WI RAL Disclosure", element: "TPGFCAMultiStateCALAMINCNVORTNTXVAWAWIRALDisclosureChk", expectedValue: true },

					//{ docName: "dTPGMultiStateARMDMEDisclosureRALPlus", formName: "fTPGMultiStateARMDMEDisclosureRALPlus", description: "TPG MultiState AR MD ME Disclosure RAL Plus", displayName: "TPG MultiState AR MD ME Disclosure RAL Plus", element: "TPGMultiStateARMDMEDisclosureRALPlusChk", expectedValue: true },
					//{ docName: "dTPGMultiStateCACTLAMINCNJNVORTNTXVAWADisclosureRALPlus", formName: "fTPGMultiStateCACTLAMINCNJNVORTNTXVAWADisclosureRALPlus", description: "TPG MultiState CA CT LA MI NC NJ NV OR TN TX VA WA DisclosureRAL Plus", displayName: "TPG MultiState CA CT LA MI NC NJ NV OR TN TX VA WA DisclosureRAL Plus", element: "TPGMultiStateCACTLAMINCNJNVORTNTXVAWADisclosureRALPlusChk", expectedValue: true },
					{ docName: "dTPGFCANewMexicoRALDisclosure", formName: "fTPGFCANewMexicoRALDisclosure", description: "TPG FCA New Mexico RAL Disclosure", displayName: "TPG FCA New Mexico RAL Disclosure", element: "TPGFCANewMexicoRALDisclosureChk", expectedValue: true },

					//{ docName: "dTPGMultiStateARCALAMEMDNCNVTNVAWallPosterRALPlus", formName: "fTPGMultiStateARCALAMEMDNCNVTNVAWallPosterRALPlus", description: "TPG MultiState AR CA LA ME MD NC NV TN VA Wall Poster RAL Plus", displayName: "TPG MultiState AR CA LA ME MD NC NV TN VA Wall Poster RAL Plus", element: "TPGMultiStateARCALAMEMDNCNVTNVAWallPosterRALPlusChk", expectedValue: true },
					{ docName: "dTPGNYCityDisclosureRALPlus", formName: "fTPGNYCityDisclosureRALPlus", description: "TPG New York City Municiple Disclosure RAL Plus", displayName: "TPG New York City Municiple Disclosure RAL Plus", element: "TPGNYCityDisclosureRALPlusChk", expectedValue: true },
					{ docName: "dTPGNYDisclosureRALPlus", formName: "fTPGNYDisclosureRALPlus", description: "TPG New York Disclosure RAL Plus", displayName: "TPG New York Disclosure RAL Plus", element: "TPGNYDisclosureRALPlusChk", expectedValue: true },

					{ docName: "dTPGFCAAgreement", formName: "fTPGFCAAgreement", description: "TPG FCA Agreement", displayName: "TPG FCA Agreement", element: "TPGFCAAgreementChk", expectedValue: true },
					{ docName: "dTPGFCANoCostAgreemnt", formName: "fTPGFCANoCostAgreemnt", description: "TPG FCA No Cost Agreement", displayName: "TPG FCA No Cost Agreement", element: "TPGFCANoCostAgreementChk", expectedValue: true },
					{ docName: "dTPGFCAInterestBearingNoFeeAgreement", formName: "fTPGFCAInterestBearingNoFeeAgreement", description: "TPG FCA Interest Bearing No Fee Agreement", displayName: "TPG FCA Interest Bearing No Fee Agreement", element: "TPGFCAInterestBearingNoFeeChk", expectedValue: true },
					//{ docName: "dTPGAdvancePlusAgreement", formName: "fTPGAdvancePlusAgreement", description: "TPG Advance Plus Agreement", displayName: "TPG Advance Plus Agreement", element: "TPGAdvancePlusAgreementChk", expectedValue: true },
					{ docName: "dTPGNonRTApplicationAndAgreementAdvance", formName: "fTPGNonRTApplicationAndAgreementAdvance", description: "TPG Non RT Application And Agreement Advance", displayName: "TPG Non RT Application And Agreement Advance", element: "TPGNonRTApplicationAndAgreementAdvanceChk", expectedValue: true },
					{ docName: "dTPGRTApplicationAndAgreement", formName: "fTPGRTApplicationAndAgreement", description: "TPG RT Application And Agreement", displayName: "TPG RT Application And Agreement", element: "TPGRTApplicationAndAgreementChk", expectedValue: true },
					{ docName: "dTPGRTFeeDisclosure", formName: "fTPGRTFeeDisclosure", description: "TPG RT Fee Disclosure", displayName: "TPG RT Fee Disclosure", element: "TPGRTFeeDisclosureChk", expectedValue: true }
					//  { docName: "dTPGTaxRefundDepositePaymentAuth", formName: "fTPGTaxRefundDepositePaymentAuth", description: "TPG Tax Refund Deposit and Payment Authorization", displayName: "TPG Tax Refund Deposit and Payment Authorization", element: "TPGTaxRefundDepositePaymentAuthChk", expectedValue: true }
					//{docName : "dTPGDisbursementGeneral",formName : "fTPGDisbursementGeneral",description : "TPG Disbursement General",displayName : "TPG Disbursement General",element : "TPGDisbursementGeneralChk",expectedValue : true}

				],
				"dRefundAdvantageBankApp": [{ docName: "dRAGeneralRT", formName: "fRAGeneralRT", description: "Refund Advantage RT Taxpayer Agreement", displayName: "Refund Advantage RT Taxpayer Agreement", element: "BankAppTypeChk", expectedValue: "1" },
				{ docName: "dRAGeneralRT", formName: "fRAGeneralRT", description: "Refund Advantage RT Taxpayer Agreement", displayName: "Refund Advantage RT Taxpayer Agreement", element: "BankAppTypeChk", expectedValue: "2" },
				{ docName: "dRefundAdvantageFreeRTAgreement", formName: "fRefundAdvantageFreeRTAgreement", description: "RefundAdvantage Free RT", displayName: "RefundAdvantage Free RT", element: "BankAppTypeChk", expectedValue: "3" },
				{ docName: "dRAInterestBearingNofee", formName: "fRAInterestBearingNofee", description: "RA Interest Bearing No fee", displayName: "RA Interest Bearing No fee", element: "RAInterestBearingNofeeChk", expectedValue: true },
				{ docName: "dRefundAdvantageNoFee", formName: "fRefundAdvantageNoFee", description: "Refund Advantage No Fee", displayName: "Refund Advantage No Fee", element: "RefundAdvantageNoFeeChk", expectedValue: true },
				{ docName: "dRADisclosureRTMN", formName: "fRADisclosureRTMN", description: "Refund Advantage Minnesota Disclosure - RT", displayName: "Refund Advantage Minnesota Disclosure - RT", element: "IsdRADisclosureRTMN", expectedValue: true },
				{ docName: "dRADisclosureRTARMDMEIL", formName: "RADisclosureRTARMDMEIL", description: "Refund Advantage Multi-State (AR, ME, MD,IL) Disclosure4 - RT", displayName: "Refund Advantage Multi-State (AR, ME, MD,IL) Disclosure4 - RT", element: "IsRADisclosureRTARMDMEIL", expectedValue: true },
				{ docName: "dRADisclosureRTNY", formName: "fRADisclosureRTNY", description: "Refund Advantage New York Disclosure – RT", displayName: "Refund Advantage New York Disclosure – RT", element: "IsRADisclosureRTNY", expectedValue: true },

				{ docName: "dRADisclosureRTChicago", formName: "fRADisclosureRTChicago", description: "Refund Advantage Chicago Disclosure – RT", displayName: "Refund Advantage Chicago Disclosure – RT", element: "IsRADisclosureRTChicago", expectedValue: true },
				{ docName: "dRADisclosureRALCO", formName: "fRADisclosureRALCO", description: "Refund Advantage Colorado Disclosure - RAL", displayName: "Refund Advantage Colorado Disclosure - RAL", element: "IsdRADisclosureRALCO", expectedValue: true },
				{ docName: "dRADisclosureRALMN", formName: "fRADisclosureRALMN", description: "Refund Advantage Minnesota Disclosure – RAL", displayName: "Refund Advantage Minnesota Disclosure – RAL", element: "IsdRADisclosureRALMN", expectedValue: true },
				{ docName: "dRAMultiStateRALDisclosureARCTMDMENJ", formName: "fRAMultiStateRALDisclosureARCTMDMENJ", description: "RA MultiState RAL Disclosure AR CT MD ME NJ", displayName: "RA MultiState RAL Disclosure AR CT MD ME NJ", element: "isRALMultiStateARCTMDMENJ", expectedValue: true },
				{ docName: "dRAMultiStateRALDisclosureCALAMINCNVORTNTXVAWAWI", formName: "fRAMultiStateRALDisclosureCALAMINCNVORTNTXVAWAWI", description: "RA MultiState RAL Dislosure CA LA MI NC NV OR TN TX VA WA WI", displayName: "RA MultiState RAL Dislosure CA LA MI NC NV OR TN TX VA WA WI", element: "isRALMultiStateCALAMINCNVORTNTXVAWAWI", expectedValue: true },
				{ docName: "dRANewMexicoRALDisclosure", formName: "fRANewMexicoRALDisclosure", description: "RA New Mexico RAL Disclosure", displayName: "RA New Mexico RAL Disclosure", element: "isRALNewMexico", expectedValue: true },
				{ docName: "dRADisclosureCityRALNY", formName: "fRADisclosureCityRALNY", description: "Refund Advantage New York City Disclosure - RAL", displayName: "Refund Advantage New York City Disclosure - RAL", element: "IsRADisclosureCityRALNY", expectedValue: true },
				{ docName: "dRADisclosureStateRALNY", formName: "fRADisclosureStateRALNY", description: "Refund Advantage New State York Disclosure - RAL", displayName: "Refund Advantage New York State Disclosure - RAL", element: "IsRADisclosureStateRALNY", expectedValue: true },
				//{ docName: "dRAE1VisaPrepaidCardMPS", formName: "fRAE1VisaPrepaidCardMPS", description: "RA Visa Prepaid Card Request Form MPS", displayName: "RA Visa Prepaid Card Request Form MPS", element: "E1VisaCardAddFormChk", expectedValue: true },
				{ docName: "dRAFasterMoneyVisaPrepaidCardRequestFormMPS", formName: "fRAFasterMoneyVisaPrepaidCardRequestFormMPS", description: "RA FasterMoney Visa Prepaid Card Request Form MPS", displayName: "RA FasterMoney Visa Prepaid Card Request Form MPS", element: "RAFasterMoneyVisaPrepaidCardRequestFormMPSChk", expectedValue: true },
				{ docName: "dRATaxPreparationFeeAcknowledgement", formName: "fRATaxPreparationFeeAcknowledgement", description: "RA Tax Preparation Fee Acknowledgement", displayName: "RA Tax Preparation Fee Acknowledgement", element: "RATaxPreparationFeeAcknowledgementChk", expectedValue: true }
					// { docName: "dEPSRACDisclosureMN", formName: "fEPSRACDisclosureMN", description: "EPS RAC Disclosure MN", displayName: "EPS RAC Disclosure MN", element: "EPSRACDisclosureMNChk", expectedValue: true },
					// { docName: "dEPSRACDisclosureARILMDME", formName: "fEPSRACDisclosureARILMDME", description: "EPS RAC Disclosure AR IL MD ME", displayName: "EPS RAC Disclosure AR IL MD ME", element: "EPSRACDisclosureARILMDMEChk", expectedValue: true },
					// { docName: "dEPSRACDisclosureNY", formName: "fEPSRACDisclosureNY", description: "EPS RAC Disclosure NY", displayName: "EPS RAC Disclosure NY", element: "EPSRACDisclosureNYChk", expectedValue: true },
					// { docName: "dEPSRALDisclosureCO", formName: "fEPSRALDisclosureCO", description: "EPS RAL Disclosure CO", displayName: "EPS RAL Disclosure CO", element: "EPSRALDisclosureCOChk", expectedValue: true },
					// { docName: "dEPSRALDisclosureIL", formName: "fEPSRALDisclosureIL", description: "EPS RAL Disclosure IL", displayName: "EPS RAL Disclosure IL", element: "EPSRALDisclosureILChk", expectedValue: true },
					// { docName: "dEPSRALDisclosureMN", formName: "fEPSRALDisclosureMN", description: "EPS RAL Disclosure MN", displayName: "EPS RAL Disclosure MN", element: "EPSRALDisclosureMNChk", expectedValue: true },
					// { docName: "dEPSRALDisclosureNYCity", formName: "fEPSRALDisclosureNYCity", description: "EPS RAL Disclosure New York City Municipal", displayName: "EPS RAL Disclosure New York City Municipal", element: "EPSRALDisclosureNYCityChk", expectedValue: true },
					// { docName: "dEPSRALDisclosureNY", formName: "fEPSRALDisclosureNY", description: "EPS RAL Disclosure NY", displayName: "EPS RAL Disclosure NY", element: "EPSRALDisclosureNYChk", expectedValue: true },	
					/*{ docName: "dRADisclosureRTMN", formName: "fRADisclosureRTMN", description: "Refund Advantage Minnesota Disclosure - RT", displayName: "Refund Advantage Minnesota Disclosure - RT", element: "IsdRADisclosureRTMN", expectedValue: true },
					{ docName: "dRADisclosureRTChicago", formName: "fRADisclosureRTChicago", description: "Refund Advantage Chicago Disclosure – RT", displayName: "Refund Advantage Chicago Disclosure – RT", element: "IsRADisclosureRTChicago", expectedValue: true },
					{ docName: "dRADisclosureRTARMDMEIL", formName: "RADisclosureRTARMDMEIL", description: "Refund Advantage Multi-State (AR, ME, MD,IL) Disclosure4 - RT", displayName: "Refund Advantage Multi-State (AR, ME, MD,IL) Disclosure4 - RT", element: "IsRADisclosureRTARMDMEIL", expectedValue: true },
					{ docName: "dRADisclosureRTNY", formName: "fRADisclosureRTNY", description: "Refund Advantage New York Disclosure – RT", displayName: "Refund Advantage New York Disclosure – RT", element: "IsRADisclosureRTNY", expectedValue: true },
					{ docName: "dRADisclosureRALIL", formName: "fRADisclosureRALIL", description: "Refund Advantage Illinois Disclosure - RAL", displayName: "Refund Advantage Illinois Disclosure - RAL", element: "IsdRADisclosureRALIL", expectedValue: true },
					{ docName: "dRADisclosureRALCO", formName: "fRADisclosureRALCO", description: "Refund Advantage Colorado Disclosure - RAL", displayName: "Refund Advantage Colorado Disclosure - RAL", element: "IsdRADisclosureRALCO", expectedValue: true },
					{ docName: "dRADisclosureRALMN", formName: "fRADisclosureRALMN", description: "Refund Advantage Minnesota Disclosure – RAL", displayName: "Refund Advantage Minnesota Disclosure – RAL", element: "IsdRADisclosureRALMN", expectedValue: true },
					{ docName: "dRADisclosureCityRALNY", formName: "fRADisclosureCityRALNY", description: "Refund Advantage New York City Disclosure - RAL", displayName: "Refund Advantage New York City Disclosure - RAL", element: "IsRADisclosureCityRALNY", expectedValue: true },
					{ docName: "dRADisclosureStateRALNY", formName: "fRADisclosureStateRALNY", description: "Refund Advantage New State York Disclosure - RAL", displayName: "Refund Advantage New York State Disclosure - RAL", element: "IsRADisclosureStateRALNY", expectedValue: true },
					{ docName: "dRADisclosureRALARMEMD", formName: "fRADisclosureRALARMEMD", description: "Refund Advantage Multi-State (AR, ME, MD) Disclosure3 - RAL", displayName: "Refund Advantage Multi-State (AR, ME, MD) Disclosure3 - RAL", element: "IsdRADisclosureRALARMEMD", expectedValue: true },
					{ docName: "dRADisclosureRALMultiState", formName: "fRADisclosureRALMultiState", description: "Refund Advantage Multi-state Disclosure - RAL", displayName: "Refund Advantage Multi-state Disclosure - RAL", element: "IsdRADisclosureRALMultiState", expectedValue: true },*/

				]
			};
		}

		//consent config
		var consentConfig = [
			{ docName: "dConsentToUse", formName: "fConsentToUse", description: "Consent To Use", displayName: "Consent To Use", id: '90056' },
			{ docName: "dConsentToDisclose", formName: "fConsentToDisclose", description: "Consent To Disclose", displayName: "Consent To Disclose", id: '90057' }
		]

		//Temporary function to differentiate features as per environment (beta/live)
		var _betaOnly = function () {
			if (environment.mode == 'beta' || environment.mode == 'local')
				return true;
			else
				return false;
		}


		//Intialize Calculation worker
		var _initCalcWorker = function (path) {
			_calcWorker = new Worker(path);
			_calcWorker.addEventListener('message', function (e) {
				switch (e.data.msgType) {
					case 'started':
						$rootScope.$broadcast('calcStarted');
						break;
					case 'done':
						$rootScope.$broadcast('calcDone');
						service.updateReturnOverview();//AGI/Refund/Owe
						break;
					case 'changedField':
						for (var i = 0; i < e.data.fields.length; i++) {
							_setField(e.data.fields[i]);
						}
						if (e.data.fields.length > 0) {
							_updateDocRequired(e.data.fields).then(function (response) {
								if (response == true) {
									$rootScope.$broadcast('hasRequiredFieldsChanged');
								}
							});
						}
						break;
					case 'addForm':
						for (var i = 0; i < e.data.forms.length; i++) {
							var form = e.data.forms[i];
							//First argument is doc name, second argument is parent id (undefined) and third argument is parent doc index
							//Parent Id will be used if we would like to add new parent where as parent doc index just bind newly added child form with existing parent.
							_addForm(contentService.getForm(form.docName), undefined, form.parentIndex);
						}
						if (e.data.forms.length > 0) {
							$rootScope.$broadcast('calcFormAdded');
						}
						break;
					case 'addChildDoc':
						_addDoc(e.data.docName, e.data.parentIndex, true, e.data.index);
						break;
					case 'removeDoc':
						//mostly remove doc would be called by calculation engine when statement needs to be removed
						//before statements are removed validation doc required function would set correct required field on parent form
						_validateDocRequired(e.data.docName, e.data.index, true)
							.then(function () {
								_removeDoc(e.data.docName, e.data.index);
							}, function (reason) {
								$log.warn(reason);
								_removeDoc(e.data.docName, e.data.index);
							});
						break;
					case 'setCounterInReturnService':
						// if index comes from worker file is less than or equal to current conut than we do not update the count here, to prevent duplication by service side,
						if (e.data.count > _taxReturn.docs.count) {
							_taxReturn.docs.count = e.data.count;
						}
						break;
					case 'reviewCompleted':
						_reviewErrors = _reviewErrors.concat(e.data.reviewErrors);
						//notify that perform review is done and now you can call getReviewErrors
						$rootScope.$broadcast('performReviewDone');
						break;
					case 'reloadIfCurentform':
						//Notify return controller to reload form (If it is current form)
						$rootScope.$broadcast('reloadIfCurentform', e.data.docIndex);
						break;

					case 'einUpdated':
						_updateEIN(e.data.einList);
						break;

					case 'newEINEntered':
						_updateEIN([e.data.ein]);
						break;

					case 'removeForm':
						//mostly remove form would be called by calculation engine when Form needs to be removed
						//before form are removed validation doc required function would set correct required field on parent form
						var form = _.find(_taxReturn.forms, function (form) {
							return form.docName == e.data.docName && form.docIndex == e.data.docIndex;
						})
						if (!_.isUndefined(form)) {
							_validateDocRequired(form.docName, form.docIndex, true)
								.then(function () {
									_removeForm(form);
								}, function (reason) {
									$log.warn(reason);
									_removeForm(form);
								});
						}
						break;
				}

			}, false);
			_calcWorker.addEventListener('error', function (e) {
				$log.error('_calcWorker erro : Line' + e.lineno + 'in' + e.filename + ':' + e.message);
			}, false);

		};

		/**
		 *   The following function is used to change/add EIN
		 *   The function will have all EIN to be update or insert.
		 *   It will iterator by a loop and will call API method.
		 *   On successful response we will update our local db.   
		 */
		var _updateEIN = function (einList) {
			var userService = $injector.get('userService');
			var _userDetails = userService.getUserDetails();

			//If autoSaveEIN is false then do not update EIN details
			if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences)
				&& !_.isUndefined(_userDetails.settings.preferences.returnWorkspace) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace.autoSaveEIN)
				&& _userDetails.settings.preferences.returnWorkspace.autoSaveEIN == false) {
				//Do Nothing
				return;
			} else {
				//If autoSaveEIN is undefined then make it true and store in preference 
				_updateAutoSaveEINPreference(_userDetails);

				var einService = $injector.get('EINService');
				var einCreateList = [], einUpdateList = [];
				if (!_.isUndefined(einList)) {
					//Loop through each EIN to determine whether to update EIN or create it.    		 
					_.forEach(einList, function (ein) {
						if (_.isUndefined(ein.usAddress)) {
							ein.usAddress = {};
						}
						if (_.isUndefined(ein.foreignAddress)) {
							ein.foreignAddress = {};
						}

						var einObj = {
							ein: ein.ein,
							employersName: ein.employersName,
							usAddress: { street: ein.usAddress.street, zipCode: ein.usAddress.zipCode, city: ein.usAddress.city, state: ein.usAddress.state },
							foreignAddress: { street: ein.foreignAddress.street, postalCode: ein.foreignAddress.postalCode, city: ein.foreignAddress.city, state: ein.foreignAddress.state, country: ein.foreignAddress.country }
						};

						if (_.isUndefined(_db["einDB"]) || !_.isUndefined(_db["einDB"]["db"]) && !_.isUndefined(_db["einDB"]["db"][ein.ein])) {
							einUpdateList.push(einObj);
						} else {
							einCreateList.push(einObj);
						}
					});
				}

				if (einCreateList.length > 0) {
					einService.createEIN(einCreateList).then(function (response) {
						if (einUpdateList.length > 0) {
							_updateEINList(einUpdateList);
						} else {
							// After response comes we need to update our lookup for EIN
							var einDBList = _db["einDB"].db;
							_.forEach(einCreateList, function (ein) {
								einDBList[ein.ein] = ein;
							});
							_loadDBCommon("einDB", einDBList);
							//messageService.showMessage('Ein list created successfully.','success');
						}
					}, function (error) { });
				} else if (einUpdateList.length > 0) {
					_updateEINList(einUpdateList);
				}
			}
		};

		var _updateEINList = function (einUpdateList) {
			var einService = $injector.get('EINService');
			if (einUpdateList.length > 0) {
				einService.updateEIN(einUpdateList).then(function (response) {
					// After response comes we need to update our lookup for EIN
					var einDBList = _db["einDB"].db;
					_.forEach(einUpdateList, function (ein) {
						einDBList[ein.ein] = ein;
					});
					_loadDBCommon("einDB", einDBList);
					//messageService.showMessage('Ein list updated successfully.','success');
				}, function (error) { });
			}
		};

		/**
		 * This function will update autoSaveEIN in returnWorkspace preference.
		 * If there is no preference saved then we will make it true
		 */
		var _updateAutoSaveEINPreference = function (_userDetails) {
			//If preferences are undeifne then define it
			if (_.isUndefined(_userDetails.settings.preferences)) {
				_userDetails.settings.preferences = {};
			}

			//If preferences.returnWorkspace are undeifne then define it
			if (_.isUndefined(_userDetails.settings.preferences.returnWorkspace)) {
				_userDetails.settings.preferences.returnWorkspace = {};
			}

			//If autoSaveEIN is undefined then make it true and store in preference 
			if (_.isUndefined(_userDetails.settings.preferences.returnWorkspace.autoSaveEIN)) {
				_userDetails.settings.preferences.returnWorkspace.autoSaveEIN = true;

				//Inject userService
				var userService = $injector.get('userService');

				//save
				userService.changeSettings('preferences', _userDetails.settings.preferences).then(function (response) {
					//Saved nothing todo
				}, function (error) {
					$log.error(error);
				});
			}
		}

		var _clearCalcWorker = function () {
			if (!_.isUndefined(_calcWorker)) {
				_calcWorker.terminate();
				_calcWorker = undefined;
			}
			_initCalcWorker(environment.mode == 'local' ? 'taxAppJs/return/workspace/calculation/calc-worker.js' : 'taxAppJs/dist/calc-dist.js');
		};


		//split function this is copied from calc-service
		var _getDocFieldName = function (fieldName) {
			var s = fieldName;
			s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
			s = s.replace(/^\./, '');           // strip a leading dot
			var a = s.split('.');
			return { docName: a.shift(), fieldName: a.shift() };
		};

		// this implementation vary from calculation-service
		var _getDoc = function (docName, index) {
			var doc;
			if (!_.isUndefined(_taxReturn) && _taxReturn != null && _.has(_taxReturn.docs, docName)) {
				//return on documents with docname used to get child docs
				if (_.isUndefined(index) && !_.isUndefined(_taxReturn.docs[docName]))
					doc = _taxReturn.docs[docName];
				else if (!_.isUndefined(index) && !_.isUndefined(_taxReturn.docs[docName][index]))
					doc = _taxReturn.docs[docName][index];
			}
			//To:do change console.log to proper log forwarder 
			if (_.isUndefined(doc))
				$log.debug('something is wrong did not find doc:' + docName);
			return doc;
		};

		//this to get the list of doc index
		var _getIndex = function (docName) {
			if (!_.isUndefined(docName) && !_.isUndefined(_taxReturn.docs[docName]))
				return _.keys(_taxReturn.docs[docName]);
			else
				return [];
		};

		//function to get the form properties
		var _getFormProp = function (formName) {
			if (!_.isUndefined(formName)) {
				return contentService.getFormProp(formName);
			}
			return {};
		};

		// this implementation vary from calculation-service
		var _setField = function (field) {
			var names = _getDocFieldName(field.fieldName);
			var doc = _getDoc(names.docName, field.docIndex);
			if (!_.isUndefined(doc)) {
				if (_.isUndefined(doc[names.fieldName]))
					doc[names.fieldName] = {};
				doc[names.fieldName] = _.assign(doc[names.fieldName], field.newVal);
			}

		};

		// This implementation vary from calculation-service
		//TODO: We have cloned doc count to solve duplocate docIndex issue. However, we do not know how this updated later. We must find reason to have proper solution.
		var _addDoc = function (docName, parentIndex, isCalculated, calculationIndex) {
			var index = -1;
			if (!_.isUndefined(isCalculated) && !_.isUndefined(calculationIndex)) {
				index = calculationIndex;
				// if index comes from worker file is less than or equal to current conut than we do not update the count here, to prevent duplication by service side,
				if (calculationIndex > _taxReturn.docs.count) {
					_taxReturn.docs.count = calculationIndex;
				}
			} else {
				// Here, we allow service to add docs only at even number indexes to prevent duplication of indexes.
				if (_taxReturn.docs.count % 2 === 0) {
					_taxReturn.docs.count = parseInt(_taxReturn.docs.count) + 2;
				} else {
					_taxReturn.docs.count = parseInt(_taxReturn.docs.count) + 1;
				}
				index = _.clone(_taxReturn.docs.count);
				_calcWorker.postMessage({ msgType: 'setCounterinCalcService', count: index });
			}
			// add doc in docs list
			if (_.isUndefined(_taxReturn.docs[docName]))
				_taxReturn.docs[docName] = {};
			_taxReturn.docs[docName][index] = {};
			//add parent information
			if (!_.isUndefined(parent))
				_taxReturn.docs[docName][index].parent = parentIndex;
			//ask calculation to add doc to tax return
			if (_.isUndefined(isCalculated) || isCalculated === false)
				_calcWorker.postMessage({ msgType: 'addDoc', docName: docName, index: index, parentIndex: parentIndex });
			return index;
		};

		// This implementation is used to add doc only. it will not add form.
		// We had to use this function because in addDoc() function its fields were not loaded until form is added.
		// Here we don't addForm we just add doc.
		// We have to make this function async to load default values.
		var _addDocOnly = function (docName, parentIndex, isCalculated, calculationIndex) {
			var deffered = $q.defer();

			//Get form prop by docName
			var formProp = angular.copy(contentService.getFormPropFromDoc(docName));

			// Load doc fields
			contentService.loadDocFields(docName, formProp.packageName, formProp.state).then(function (response) {
				//We have to assign docIndex to load default values to proper field in a doc.
				var index = _addDoc(docName, parentIndex, isCalculated, calculationIndex);
				formProp.docIndex = index;
				_addFormDefaultValues(_taxReturn, formProp).then(function (success) {
					deffered.resolve(index);
				}, function (error) {
					$log.error(error);
					deffered.resolve(index);
				});
			}, function (error) {
				$log.error(error);
				deffered.reject(error);
			});

			return deffered.promise;
		};

		// This implementation vary from calculation-service
		var _removeDoc = function (docName, index, isCalculated) {
			//remove doc from doc list
			if (!_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][index])) {
				//remove doc based on index
				delete _taxReturn.docs[docName][index];
				//remove container if do not have any Doc
				if (_.isEmpty(_taxReturn.docs[docName]))
					delete _taxReturn.docs[docName];
			}
			//ask calulation to remove doc from tax return
			if (_.isUndefined(isCalculated) || isCalculated === false)
				_calcWorker.postMessage({ msgType: 'removeDoc', docName: docName, index: index });
		};


		// Array will hold list of forms to remove
		// Note :- We call _removeChildForm recursively so we have to keep this array in local scope of service
		var formsToRemove = [];

		/* 
		 * Use Case : - 
		 * IF form to remove is a parent of any form, then all its child forms and statements(same form) must be removed from list as well.
		 * This function will remove 'N' level of childs. 
		 */
		var _removeForm = function (form) {
			// Push parent form to array
			formsToRemove.push({ 'form': form });

			// Get all child of parent (all forms and statements)
			_removeChildForm(form);

			// Loop through array to remove parent and all child forms/statements
			_.forEach(formsToRemove, function (formObject) {
				_removeDoc(formObject.form.docName, formObject.form.docIndex);

				//remove form from form list
				if (_.isUndefined(formObject.isStatement) || formObject.isStatement == false) {
					var formIndex = _.indexOf(_taxReturn.forms, formObject.form);
					if (formIndex >= 0) {
						_taxReturn.forms.splice(formIndex, 1);
					}
				}
			});

			// Empty array after remove.
			formsToRemove = [];
			//remove deleted form from stack navigation
			_removeDeletedFormFromStackNavigation(form.docIndex);
		};

		// Following function will find all child form or child statement of parent form recursively and push into to array for further process of remove.
		//Note: The purpose of this extra function is to have recursion to find child forms/statements. Otherwise this code will be written in _removeForm.
		var _removeChildForm = function (parentForm) {
			// Get all child forms for given parent
			var childForms = _getChildForms(parentForm);
			if (!_.isUndefined(childForms) && !_.isEmpty(childForms)) {
				// merge all child forms in formsToRemove
				formsToRemove = _.union(formsToRemove, childForms);
				_.forEach(childForms, function (formObject) {
					// IF child form is of form type then look for more child (Recursion) 
					if (formObject.isStatement == false) {
						_removeChildForm(formObject.form);
					}
				});
			}
		};

		// Following function will find child forms or child statement of a single form.
		//Return format will be {form:form,isStatement:false} for Form and {form:{docIndex:docIndex,docName:docName},isStatement:true} for statement
		var _getChildForms = function (parentForm) {
			//array holding childForms and statements
			var childForms = [];

			// IF no parent found then return empty array
			if (_.isUndefined(parentForm) && _.isEmpty(parentForm)) {
				return childForms;
			}

			// Loop through all docs, this will contain name and object of a doc
			_.forEach(_taxReturn.docs, function (docObjects, docName) {
				if (docName != 'count') {
					//Doc object will be type of array in objects, so, loop through all doc objects, find if parent of doc and form.docIndex match
					_.forEach(docObjects, function (docObject, docIndex) {
						if (!_.isUndefined(docObject) && !_.isUndefined(docObject.parent) && (docObject.parent == parentForm.docIndex)) {
							// Get corresponding form object
							var childForm = _getFormFromDoc(docObject, docIndex);
							if (!_.isUndefined(childForm)) {
								// Check whether matched doc is type of 'form' or 'statements'
								if (childForm.isStatement == false) {
									childForms.push({ 'form': childForm.form, 'isStatement': false });
								} else if (childForm.isStatement == true) {
									childForms.push({ 'form': { 'docIndex': docIndex, 'docName': docName }, 'isStatement': true });
								}
							}
						}
					});
				}
			});
			return childForms;
		};

		//Common operations for add form
		//Note: The main purpose to create this function is to support parent-child add form.
		//Note: We have two similar argument 2nd is Parent Form Object and 3rd is Parent Form Doc Index.
		//The reason is in case of new parent, we do not have it's doc index because we are adding parent,child in queue (promise).
		//Issues: We have added an option to addform without adding doc, Means already added doc will be used to add form. Currently this option is already enabled 
		//for child form with existing parent. We have to enable this options for other request types as well. (Add form with new parent, add form without parent)
		var _addFormCommonOperation = function (form, parenForm, parentDocIndex, doNotAddDoc, docIndexIfDoNotAddDoc) {
			var deferred = $q.defer();

			//Case 1 - doc index of parent (3rd Arg) is passed to establish relation with already added form
			if (!_.isUndefined(parentDocIndex) && parentDocIndex != '' && parentDocIndex != null) {
				//Check if it is not required to add Doc (in this case we have to use docIndexToBeUsed as docIndex
				var docIndex = docIndexIfDoNotAddDoc;
				if (_.isUndefined(doNotAddDoc) || doNotAddDoc == false) {
					//Pass parent docIndex (For parent - child ) case
					var docIndex = _addDoc(form.docName, parentDocIndex);
				} else {
					//Note: This is special case, as we are not wrapping parentIndex under value object, We can not use PostTaxField change
					//So, we have to update UI return and calc return source separately    			
					_calcWorker.postMessage({ msgType: 'updateParent', docName: form.docName, index: docIndex, parentIndex: parentDocIndex });
					_taxReturn.docs[form.docName][docIndex].parent = parentDocIndex;

				}
				//copy required properties to save in return with parentDocIndex
				var newForm = { formName: form.formName, docName: form.docName, docIndex: docIndex, parentDocIndex: parentDocIndex, formOrder: form.formOrder };
			} else if (!_.isUndefined(parenForm) && !_.isEmpty(parenForm)) {//Case 2- object of Parent form is passed to establish relation.
				//This case is for new parent.
				//Get parent doc index
				var docIndexOfParent = _.findLast(_taxReturn.forms, { 'docName': parenForm.docName }).docIndex;

				//Check if it is not required to add Doc (in this case we have to use docIndexToBeUsed as docIndex for child
				var docIndex = docIndexIfDoNotAddDoc;
				if (_.isUndefined(doNotAddDoc) || doNotAddDoc == false) {
					//Pass parent docIndex (For parent - child ) case
					var docIndex = _addDoc(form.docName, docIndexOfParent);
				} else {
					//Note: This is special case, as we are not wrapping parentIndex under value object, We can not use PostTaxField change
					//So, we have to update UI return and calc return source separately    			
					_calcWorker.postMessage({ msgType: 'updateParent', docName: form.docName, index: docIndex, parentIndex: docIndexOfParent });
					_taxReturn.docs[form.docName][docIndex].parent = docIndexOfParent;
				}

				//copy required properties to save in return with parentDocIndex
				var newForm = { formName: form.formName, docName: form.docName, docIndex: docIndex, parentDocIndex: docIndexOfParent, formOrder: form.formOrder };
			} else {//Case 3 - Add form without parent
				var docIndex = _addDoc(form.docName);
				//copy required properties to save in return
				var newForm = { formName: form.formName, docName: form.docName, docIndex: docIndex, formOrder: form.formOrder };
			}

			//Add extendedProperties with displayName. This needs for display purpose only. So while saving return we have to remove it again (remove task is pending)
			newForm.extendedProperties = { displayName: form.displayName, description: form.description, status: (!_.isUndefined(form.status) ? form.status : 'preview') };
			//add print set property in new form
			var formProperty = contentService.getFormProp(form.formName);
			if (formProperty != undefined) {
				newForm.extendedProperties.whenToPrint = angular.copy(formProperty.whenToPrint);
				newForm.extendedProperties.id = formProperty.id;
				newForm.extendedProperties.printOrder = angular.copy(formProperty.printOrder);
				newForm.extendedProperties.printCategory = angular.copy(formProperty.printCategory);
				//add tag property for searching purpose
				newForm.extendedProperties.tags = angular.copy(formProperty.tags);
				newForm.extendedProperties.tagOrder = formProperty.tagOrder;
				newForm.state = formProperty.state;
				newForm.packageName = formProperty.packageName;
			}
			//condition that checks wether form property hold the isHiddenForm if yes than we set isHiddenForm property in extendedProperties of newForm
			if (!_.isUndefined($filter('hiddenForm')(form.formName))) {
				newForm.extendedProperties.isHiddenForm = $filter('hiddenForm')(form.formName);
			}
			//added the boolean variable in extended properties in order to show add new instance in right side dropdown
			newForm.extendedProperties.isNewInstanceAllowed = _checkForNewInstance(form.formName);

			//add form form in form list  
			_taxReturn.forms[_taxReturn.forms.length] = newForm;

			//Add Default values to Form     
			_addFormDefaultValues(_taxReturn, newForm).then(function (success) {
				deferred.resolve(newForm);
			}, function (error) {
				$log.error(error);
				deferred.resolve(newForm);
			});

			return deferred.promise;
		};

		//Issue: We have added an option to addform without adding doc, Means already added doc will be used to add form. Currently this option is already enabled 
		//for child form with existing parent. We have to enable this options for other request types as well. (Add form with new parent, add form without parent)
		var _addForm = function (form, parentId, parentDocIndex, doNotAddDoc, docIndexIfDoNotAddDoc) {
			var deferred = $q.defer();

			//Queue holding requests to add forms. Needed as we have to support child - parent case.
			var addFormCommonOperationQ = [];

			if (!_.isUndefined(form)) {
				//check whether form is already added in return or support multi instance
				//then only added in return, this is done to avoid mistakes in calculations
				var forms = _.where(_taxReturn.forms, { formName: form.formName });
				var formProp = contentService.getFormProp(form.formName);

				//Note: Parent Details needed to pass when adding child form in queue
				//Parent Form Id
				var parentFormId = '';
				//Parent Form Object
				var parentFormObj = {};
				//If adding parent form automatically in background (In case of single parent as single instance only)
				var autoParentAdd = false;
				// maxOccurs is 0 means unlimited 
				if (!_.isUndefined(formProp) && ((formProp.isMultiAllowed === true && (formProp.maxOccurs == undefined || parseInt(formProp.maxOccurs) == 0 || forms.length < parseInt(formProp.maxOccurs))) || _.isUndefined(forms) || forms.length <= 0)) {
					//Check if parentDocIndex is passed - This has been passed to establish relation with already added parent.
					if (!_.isUndefined(parentDocIndex) && parentDocIndex != '' && parentDocIndex != null) {
						//Parent Doc Index is passed, so we do not need to add any new parent form.
					} else {
						//IF Not then check id parentId is passed to establish relation with new parent
						if (!_.isUndefined(parentId) && parentId != '0' && parentId != '' && parentId != null) {
							parentFormId = parentId;
						} else if (!_.isUndefined(form.parentID) && form.parentID != '0' && form.parentID != '') {
							//Check if there is any parent available. So we can establish relation with it (new parent)
							//Note: This will be useful in case of single parent with single instance. 
							//So we don't have to ask for selection. 
							parentFormId = form.parentID.split(",")[0];

							//Set autoParentAdd flag true
							autoParentAdd = true;
						}

						//check if this form belongs to other form (child - parent)
						if (parentFormId != '' && parentFormId != '0') {
							//Set Parent Form Object
							parentFormObj = contentService.getFormFromId(parentFormId);
							if (!_.isUndefined(parentFormObj) && !_.isUndefined(parentFormObj.formName)) {
								var parentFormInTaxReturn = _.where(_taxReturn.forms, { formName: parentFormObj.formName });
								var parentFormProp = contentService.getFormProp(parentFormObj.formName);

								//Check that parent form is not exist
								if (!_.isUndefined(parentFormProp) && (_.isUndefined(parentFormInTaxReturn) || parentFormInTaxReturn.length <= 0)) {
									//add parent form
									addFormCommonOperationQ.push(_addFormCommonOperation(parentFormObj));
								} else {
									//If it is already exist
									//If form is going to be add from backend (No parent passed) or is single instance then do not add new form just map
									if (autoParentAdd == true || parentFormProp.isMultiAllowed == false) {
										parentDocIndex = parentFormInTaxReturn[0].docIndex;
									} else if (autoParentAdd == false && parentFormProp.isMultiAllowed == true) {//If parentId is passed and parent form is multi instance
										//add parent form
										addFormCommonOperationQ.push(_addFormCommonOperation(parentFormObj));
									}
								}
							}
						}
					}

					_getPreviewInfo([form], false)


					//For Original form (child Form)
					if (!_.isUndefined(parentDocIndex) && parentDocIndex != '' && parentDocIndex != null) {
						//Push original(child) form with parent doc index    			
						addFormCommonOperationQ.push(_addFormCommonOperation(form, undefined, parentDocIndex, doNotAddDoc, docIndexIfDoNotAddDoc));
					} else if (!_.isEmpty(parentFormObj)) {
						//Push original (child) form with parent form object.
						addFormCommonOperationQ.push(_addFormCommonOperation(form, parentFormObj, undefined, doNotAddDoc, docIndexIfDoNotAddDoc));
					} else {
						//Push original (child) form form for common operation
						addFormCommonOperationQ.push(_addFormCommonOperation(form));
					}

					//Process all forms. But return only child form.
					//Note: current
					$q.all(addFormCommonOperationQ).then(function (newForms) {
						if (newForms.length > 1) {
							var childForm = _.find(newForms, { 'formName': form.formName });
							if (!_.isUndefined(childForm)) {
								deferred.resolve(childForm);
							} else {
								deferred.resolve(_.last(newForms));
							}
						} else {
							deferred.resolve(newForms[0]);
						}
					}, function (error) {
						deferred.reject(error);
					});

				} else {
					deferred.resolve();
				}
			} else {
				console.log("form is undefined");
				deferred.resolve();
			}
			return deferred.promise;

		};

		var _loadPackageContent = function (packageNames, states) {
			var deferred = $q.defer();
			var updatedStatesList = contentService.getStatesPackages(packageNames, states);
			//step-1 add base URL for all calculation Maps
			for (var sIndex = 0; sIndex < updatedStatesList.length; sIndex++) {
				for (var pIndex = 0; pIndex < updatedStatesList[sIndex].packageNames.length; pIndex++) {
					var key = updatedStatesList[sIndex].packageNames[pIndex] + '.' + updatedStatesList[sIndex].name;
					_calcWorker.postMessage({
						'msgType': 'addCalcUrl', 'key': key,
						'url': { url: contentService.getCalculationURL(updatedStatesList[sIndex].packageNames[pIndex], updatedStatesList[sIndex].name) },
						'reviewUrl': { url: contentService.getReviewURL(updatedStatesList[sIndex].packageNames[pIndex], updatedStatesList[sIndex].name) }
					});
				}
			}

			var loadstuff = [];
			//step-2 using package information for federal/states in return load formslist
			loadstuff.push(contentService.loadFormsLists(updatedStatesList));

			//step-3 using package information in return load lookup        
			loadstuff.push(contentService.loadLookups(packageNames));

			//step-4 using package information for federal/states  in return load linkslist
			loadstuff.push(contentService.loadLinksLists(updatedStatesList));

			$q.all(loadstuff)
				.then(function () {
					deferred.resolve();
				})
				.catch(function (reason) {
					deferred.reject(reason);
				});

			return deferred.promise;
		};

		//TODO: This function is quite confusing, Here it shows first argument as doc(whole doc of form) and 
		//also used to find parent form in case of statement. However, returnService.getFormFromDoc function have 
		//first argument as docName. Please make it clear do we have to pass docName or whole doc ?. 
		//If both are alowed make them in different parameters other then confusing with one.
		var _getFormFromDoc = function (doc, docIndex) {
			if (!_.isUndefined(doc)) {
				//check whether document is form or child statement
				// form is required to get information of package and state
				var form = _.find(_taxReturn.forms, function (form) { return form.docIndex == docIndex; });
				var isStatment = false;
				//it may be that document is child statement so we do not have direct form
				if (_.isUndefined(form) && !_.isUndefined(doc.parent)) {
					form = _.find(_taxReturn.forms, function (form) { return form.docIndex == doc.parent; });
					isStatment = true;
				}
				return { form: form, isStatement: isStatment };
			}
		};


		var _setDocRequired = function (docName, docIndex, hasRequiredFields, isStatement, stmtDocName, stmtDocIndex, isRemoved) {

			var doc = _getDoc(docName, docIndex);

			//check whether field exists
			if (!_.has(doc, 'hasRequiredFields') || _.isUndefined(doc['hasRequiredFields']))
				doc['hasRequiredFields'] = {};

			if (!_.has(doc, 'hasFormRequiredFields') || _.isUndefined(doc['hasFormRequiredFields']))
				doc['hasFormRequiredFields'] = {};

			if (!_.has(doc, 'hasStmtRequiredFields') || _.isUndefined(doc['hasStmtRequiredFields']))
				doc['hasStmtRequiredFields'] = {};

			//incase required document is statement then it needs to be added into its parent document statment collections 
			if (isStatement) {
				//create collection of statements
				if (!_.has(doc['hasStmtRequiredFields'], 'statements') || _.isUndefined(doc['hasStmtRequiredFields']['statements']))
					doc['hasStmtRequiredFields']['statements'] = {}

				// add value to collection of statements
				var statementName = stmtDocName + '_' + stmtDocIndex;
				doc['hasStmtRequiredFields']['statements'][statementName] = hasRequiredFields;

				//incase statement is being deleted remove it for collection of statements
				if (!_.isUndefined(isRemoved) && isRemoved)
					delete doc['hasStmtRequiredFields']['statements'][statementName];

				//check whether any staments is required in collection of statements 
				var isAnyStmtRequired = _.find(doc['hasStmtRequiredFields']['statements'], function (name) { return name });

				//upadte statment collection over all flag so we do not need to scan all statement when parent document required field changes
				doc['hasStmtRequiredFields'].value = _.isUndefined(isAnyStmtRequired) ? false : isAnyStmtRequired;

				//incase form required field is set then do logical or with statement
				if (!_.isUndefined(doc['hasFormRequiredFields'].value))
					doc['hasRequiredFields'].value = doc['hasFormRequiredFields'].value || doc['hasStmtRequiredFields'].value;
				else
					doc['hasRequiredFields'].value = doc['hasStmtRequiredFields'].value;

				if (docIndex == docIndexOfCurrentLoadedForm.form.docIndex && docName == "d8965") {
					postal.publish({
						channel: 'MTPO-Return',
						topic: 'ReloadCurrentForm',
						data: {
							form: docIndexOfCurrentLoadedForm.form
						}
					});
				}

			}
			else {
				doc['hasFormRequiredFields'].value = hasRequiredFields;

				//incase statement required field is set then do lofical or with form
				if (!_.isUndefined(doc['hasStmtRequiredFields'].value))
					doc['hasRequiredFields'].value = doc['hasFormRequiredFields'].value || doc['hasStmtRequiredFields'].value;
				else
					doc['hasRequiredFields'].value = doc['hasFormRequiredFields'].value;
			}

		};

		/**
		 * Async function to check if any required filed in form and it's child statements.
		 * This will return 'CHANGE' if there is any change in 'hasRequiredFields' other wise it will 
		 * return 'NO CHANGE'
		 * isRemoved added to do clean up when document is removed as statement
		 */
		var _validateDocRequired = function (docName, docIndex, isRemoved) {
			var deferred = $q.defer();
			var doc = _getDoc(docName, docIndex);
			if (!_.isUndefined(doc)) {
				//get form from doc 
				var result = _getFormFromDoc(doc, docIndex);
				var form = result.form;
				var isStatment = result.isStatement;
				if (!_.isUndefined(form)) {
					var formProp = contentService.getFormProp(form.formName);
					//check whether document has any field marked as required but its value is not filled
					var fieldRequired = _.find(doc, function (field) {
						return !_.isUndefined(field) && !_.isNull(field) && !_.isUndefined(field.isRequired) &&
							field.isRequired && (_.isUndefined(field.value) || field.value === "");
					});
					//fieldRequired is undefined that means document do not have any such field
					//so check template document whether it has field marked as required
					if (_.isUndefined(fieldRequired)) {
						contentService.getDocFields(docName, formProp.packageName, formProp.state)
							.then(function (docTemplate) {
								//Filter out required fields from template and exclude field which are in document 
								//field in document is already taken care
								fieldRequired = _.find(docTemplate, function (field) {
									return (field.isRequired &&
										(_.isUndefined(doc[field.name]) || (_.isUndefined(doc[field.name].isRequired) &&
											(_.isUndefined(doc[field.name].value) || doc[field.name].value === ""))));
								});

								//This is done to solve one known bug with ACA worksheet where by default it was not showing Red smiley 
								if (_.isUndefined(fieldRequired)) {
									fieldRequired = _.find(doc, function (field) {
										return !_.isUndefined(field) && !_.isNull(field) && !_.isUndefined(field.isRequired) &&
											field.isRequired && (_.isUndefined(field.value) || field.value === "");
									});
								}
								//when document is being removed forcefully make it not required
								var hasRequiredFields = _.isUndefined(fieldRequired) ? false : !_.isUndefined(isRemoved) && isRemoved ? false : true;
								_setDocRequired(form.docName, form.docIndex, hasRequiredFields, isStatment, docName, docIndex, isRemoved);
								deferred.resolve(true);
							});
					} else {
						//If document has any field marked as required but its value is not filled
						//when document is being removed forcefully make it not required
						var hasRequiredFields = !_.isUndefined(isRemoved) && isRemoved ? false : true;
						_setDocRequired(form.docName, form.docIndex, hasRequiredFields, isStatment, docName, docIndex, isRemoved);
						deferred.resolve(true);
					}
				}
				else
					deferred.resolve(false);
			}
			else
				deferred.resolve(false);
			return deferred.promise;
		};

		var _updateDocRequired = function (fields) {
			var deferred = $q.defer();
			if (!_.isUndefined(fields) && fields.length > 0) {
				//get unique docName and index pairs
				var uniqueDocs = _.groupBy(fields, function (field) {
					return field.docName + '.' + field.docIndex;
				});
				if (!_.isUndefined(uniqueDocs)) {
					var processQ = [];
					// get Keys for Doc
					var keys = _.keys(uniqueDocs);
					for (var kIndex = 0; kIndex < keys.length; kIndex++) {
						var names = keys[kIndex].split('.');
						processQ.push(_validateDocRequired(names[0], names[1]));
					}
					if (processQ.length > 0) {
						$q.all(processQ)
							.then(function (changes) {
								if (_.indexOf(changes, true) !== -1)
									deferred.resolve(true);
								else
									deferred.resolve(false);
							}, function (error) {
								$log.error(error);
								//Return
								deferred.resolve(false);
							});
					} else
						deferred.resolve(false);

				} else {
					//If fields are not passed or having no value in it
					deferred.resolve(false);
				}
			}
			else
				deferred.resolve(false);
			return deferred.promise;
		};

		//For New Return - only. to add docs for forms
		var _newReturn = function () {
			var deferred = $q.defer();
			var defaultForms = _taxReturn.defaultForms;

			//Remove Default Forms array from return as we have copied it for further process and no longer required in original return
			delete _taxReturn.defaultForms;

			if (!_.isUndefined(_taxReturn.header.isNewReturn) && _taxReturn.header.isNewReturn === true) {
				var index = _taxReturn.docs.count;
				//Make isNewReturn to false
				_taxReturn.header.isNewReturn = false;
				//condition to check whether the return is copy from default return
				if (!_.isUndefined(_taxReturn.header.returnWithDefault) && !_.isNull(_taxReturn.header.returnWithDefault) && _taxReturn.header.returnWithDefault != '') {
					//API call to get details of default return 
					returnAPIService.getTaxReturn(_taxReturn.header.returnWithDefault).then(function (response) {
						//we delete the default return ID from the new return
						//delete _taxReturn.header.returnWithDefault;
						_taxReturn.header.packageNames = response.header.packageNames;
						_taxReturn.header.states = response.header.states;
						_taxReturn.header.status = response.header.status;
						_taxReturn.forms = response.forms;
						_taxReturn.docs = response.docs;
						//packages have to be loaded again because return used as custom template may have more packages in it than defaul once
						// to solve ticket 8352
						var packageNames = _taxReturn.header.packageNames;
						var states = _taxReturn.header.states;
						_loadPackageContent(packageNames, states).then(function () {
							_getPreviewInfo(_taxReturn.forms, true);
							//function call to assign the value to main form
							_assignInitialReturnData(true);
							deferred.resolve('YES');
						}, function (error) {
							$log.error(error);
							deferred.resolve('NO');
						});
					}, function (error) {
						$log.error(error);
						deferred.resolve('NO');
					});
				} else {
					var formList = [];
					_.forEach(defaultForms, function (form) {
						formList.push(_addForm(form));
					});

					//Process add form Queue
					//This will return list of forms that processed. But here we does not require any operation on that information.
					$q.all(formList).then(function (newForms) {
						// For More return type we need to write conditions here
						_assignInitialReturnData();
						// For More return type we need to write conditions here

						//injecting all services that we need for preferences using $injector
						var userService = $injector.get('userService');

						//this variable holds details of user having object 'settings'
						var userDetail = userService.getUserDetails();

						//here we check that whether settings object inside userDetail is defined or not 
						if (!_.isUndefined(userDetail) && !_.isUndefined(userDetail.settings) && !_.isUndefined(userDetail.settings.preferences) && !_.isUndefined(userDetail.settings.preferences.returnWorkspace)) {
							//here we check whether preparer object exists
							if (!_.isUndefined(userDetail.settings.preferences.returnWorkspace.defaultPreparer)) {
								//data inside preferences will be used to fill preparerId of every form in every package
								var preparerId = userDetail.settings.preferences.returnWorkspace.defaultPreparer;

								if (angular.isDefined(_packageName) && _packageName == '1040') {
									var doc = _.findWhere(_taxReturn.forms, { docName: 'dReturnInfo' });
									_postTaxFieldChange({ fieldName: doc.docName + '.' + 'strprid', index: doc.docIndex, newVal: { value: preparerId } });
								} else if (angular.isDefined(_packageName) && _packageName == '1065') {
									var doc = _.findWhere(_taxReturn.forms, { docName: 'd1065RIS' });
									_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PrepareID', index: doc.docIndex, newVal: { value: preparerId } });
								} else if (angular.isDefined(_packageName) && _packageName == "1120") {
									var doc = _.findWhere(_taxReturn.forms, { docName: 'd1120CRIS' });
									_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PrepareID', index: doc.docIndex, newVal: { value: preparerId } });
								} else if (angular.isDefined(_packageName) && _packageName == "1120s") {
									var doc = _.findWhere(_taxReturn.forms, { docName: 'd1120SRIS' });
									_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PrepareID', index: doc.docIndex, newVal: { value: preparerId } });
								} else if (angular.isDefined(_packageName) && _packageName == "1041") {
									var doc = _.findWhere(_taxReturn.forms, { docName: 'd1041RIS' });
									_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PrepareID', index: doc.docIndex, newVal: { value: preparerId } });
								} else if (angular.isDefined(_packageName) && _packageName == "990") {
									var doc = _.findWhere(_taxReturn.forms, { docName: 'd990RIS' });
									_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PrepareID', index: doc.docIndex, newVal: { value: preparerId } });
								}
								// For More return type we need to write conditions here
							}

							//here we check whether priceList object exists
							if (!_.isUndefined(userDetail.settings.preferences.returnWorkspace.priceList)) {
								//check whether 'invoice' form exists or not
								if (!_.isUndefined(_taxReturn.docs['dPriceList'])) {

									// this is to pre-fill default priceList
									_taxReturn.docs['dPriceList'][_.keys(_taxReturn.docs['dPriceList'])[0]].selectedPriceList = userDetail.settings.preferences.returnWorkspace.priceList;
									// This will reload form list (having prices) in invoice form. Because we are changing selected price list
									_taxReturn.docs['dPriceList'][_.keys(_taxReturn.docs['dPriceList'])[0]].refreshOnLoad = true;
								}
							}
						}

						//Other data like paper return based on data in office setup
						if (_packageName != undefined && _packageName === '1040' && userDetail.locationData != undefined && userDetail.locationData.paperFilingOnly === true) {
							var doc = _.findWhere(_taxReturn.forms, { docName: 'dReturnInfo' });
							_postTaxFieldChange({ fieldName: doc.docName + '.' + 'blnPinY', index: doc.docIndex, newVal: { value: '2' } });
						}
						deferred.resolve('YES');
					}, function (error) {
						$log.error(error);
						deferred.resolve('NO');
					});
				}
			} else {
				deferred.resolve('NO');
			}
			return deferred.promise;
		};

		/**
		 * method to load data on form
		 * If viewOnly is true then we only have to update '_taxReturn' (local object) and do not sync with calc version of tax return
		 * viewOnly is used when we would like to update on angular scope first and then on calc part, Otherwise UI will show old data until calc service 
		 * resend those changes to UI. This is used in default return.
		 */
		var _assignInitialReturnData = function (viewOnly) {
			if (!_.isUndefined(viewOnly) && viewOnly == true) {
				if (angular.isDefined(_packageName) && _packageName == '1040') {
					var doc = _.findWhere(_taxReturn.forms, { docName: 'dMainInfo' });
					//Update SSN,F. Name , etc.. via calculation. So it get reflected on other forms as well
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['strform'] = { value: "1" };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['tpfnmi'] = { value: _taxReturn.header.client.firstName };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['tplnm'] = { value: _taxReturn.header.client.lastName };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['tpssn'] = { value: _taxReturn.header.client.ssn };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['tpApplyForW7'] = { value: _taxReturn.header.client.applyForW7 };
				} else if (angular.isDefined(_packageName) && _packageName == '1065') {
					var doc = _.findWhere(_taxReturn.forms, { docName: 'd1065CIS' });
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['EIN'] = { value: _taxReturn.header.client.ein };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['PartnerName'] = { value: _taxReturn.header.client.companyName };
				} else if (angular.isDefined(_packageName) && _packageName == "1120") {
					var doc = _.findWhere(_taxReturn.forms, { docName: 'd1120CCIS' });
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['EIN'] = { value: _taxReturn.header.client.ein };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['NameofCorporation'] = { value: _taxReturn.header.client.companyName };
				} else if (angular.isDefined(_packageName) && _packageName == "1120s") {
					var doc = _.findWhere(_taxReturn.forms, { docName: 'd1120SCIS' });
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['EIN'] = { value: _taxReturn.header.client.ein };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['NameofSCorporation'] = { value: _taxReturn.header.client.companyName };
				} else if (angular.isDefined(_packageName) && _packageName == "1041") {
					var doc = _.findWhere(_taxReturn.forms, { docName: 'd1041CIS' });
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['EIN'] = { value: _taxReturn.header.client.ein };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['Nameofestate'] = { value: _taxReturn.header.client.companyName };
				} else if (angular.isDefined(_packageName) && _packageName == "990") {
					var doc = _.findWhere(_taxReturn.forms, { docName: 'd990CIS' });
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['EIN'] = { value: _taxReturn.header.client.ein };
					_taxReturn.docs[doc.docName][_.keys(_taxReturn.docs[doc.docName])[0]]['PartnerName'] = { value: _taxReturn.header.client.companyName };
				}
				//Update taxReturn in calc section
				_calcWorker.postMessage({ 'msgType': 'updateTaxReturn', 'taxReturn': _taxReturn.docs });
			}
			//Add value filled on New Return Screen
			if (angular.isDefined(_packageName) && _packageName == '1040') {
				var doc = _.findWhere(_taxReturn.forms, { docName: 'dMainInfo' });
				//Update SSN,F. Name , etc.. via calculation. So it get reflected on other forms as well
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'strform', index: doc.docIndex, newVal: { value: "1" } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'tpfnmi', index: doc.docIndex, newVal: { value: _taxReturn.header.client.firstName } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'tplnm', index: doc.docIndex, newVal: { value: _taxReturn.header.client.lastName } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'tpssn', index: doc.docIndex, newVal: { value: _taxReturn.header.client.ssn } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'tpApplyForW7', index: doc.docIndex, newVal: { value: _taxReturn.header.client.applyForW7 } });
			} else if (angular.isDefined(_packageName) && _packageName == '1065') {
				var doc = _.findWhere(_taxReturn.forms, { docName: 'd1065CIS' });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'EIN', index: doc.docIndex, newVal: { value: _taxReturn.header.client.ein } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PartnerName', index: doc.docIndex, newVal: { value: _taxReturn.header.client.companyName } });
			} else if (angular.isDefined(_packageName) && _packageName == "1120") {
				var doc = _.findWhere(_taxReturn.forms, { docName: 'd1120CCIS' });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'EIN', index: doc.docIndex, newVal: { value: _taxReturn.header.client.ein } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'NameofCorporation', index: doc.docIndex, newVal: { value: _taxReturn.header.client.companyName } });
			} else if (angular.isDefined(_packageName) && _packageName == "1120s") {
				var doc = _.findWhere(_taxReturn.forms, { docName: 'd1120SCIS' });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'EIN', index: doc.docIndex, newVal: { value: _taxReturn.header.client.ein } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'NameofSCorporation', index: doc.docIndex, newVal: { value: _taxReturn.header.client.companyName } });
			} else if (angular.isDefined(_packageName) && _packageName == "1041") {
				var doc = _.findWhere(_taxReturn.forms, { docName: 'd1041CIS' });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'EIN', index: doc.docIndex, newVal: { value: _taxReturn.header.client.ein } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'Nameofestate', index: doc.docIndex, newVal: { value: _taxReturn.header.client.companyName } });
			} else if (angular.isDefined(_packageName) && _packageName == "990") {
				var doc = _.findWhere(_taxReturn.forms, { docName: 'd990CIS' });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'EIN', index: doc.docIndex, newVal: { value: _taxReturn.header.client.ein } });
				_postTaxFieldChange({ fieldName: doc.docName + '.' + 'PartnerName', index: doc.docIndex, newVal: { value: _taxReturn.header.client.companyName } });
			}
		};

		/**
		 * This method is used to identify return splited from another return and Add forms and values that splited from original return
		 * This will return 'YES' if it is splited return or else return 'NO' as success
		 */
		var _splitReturnOperations = function (splitedReturn) {
			var deferred = $q.defer();
			if (!_.isUndefined(splitedReturn.header) && !_.isUndefined(splitedReturn.header.isSplitReturn) && splitedReturn.header.isSplitReturn == true) {
				//
				if (!_.isUndefined(splitedReturn.splitData) && !_.isUndefined(splitedReturn.splitData.forms)) {
					//Differentiate forms that need to be added full
					var spouseForms = _.filter(splitedReturn.splitData.forms, { isSpouseForm: true });
					//Other forms that are common
					//Note: xor provide symmetric difference (http://en.wikipedia.org/wiki/Symmetric_difference). Use it carefully
					var commonForms = _.xor(splitedReturn.splitData.forms, spouseForms);

					if (!_.isUndefined(spouseForms) && !_.isEmpty(spouseForms)) {
						_splitReturnAddSpouseForms(spouseForms).then(function (response) {
							_splitReturnAddValusForCommonForms(commonForms).then(function (response) {
								deferred.resolve('YES');
							});
						});
					} else {
						_splitReturnAddValusForCommonForms(commonForms).then(function (response) {
							deferred.resolve('YES');
						});
					}
				}
			} else {
				deferred.resolve('NO');
			}
			return deferred.promise;
		};

		/**
		 * This function is used to add parent forms for return splited from another return
		 * Will be caleed by _splitReturnOperations() only
		 */
		var _splitReturnAddSpouseForms = function (spouseForms) {
			var deferred = $q.defer();

			//Forms to add
			var formsToAdd = [];
			//List of parent form docIndexes (useful to replace with new one)
			var spouseParentDocIndexes = _.pluck(spouseForms, 'parentDocIndex');
			//List of parent forms
			var spouseParentFormList = [];
			spouseParentFormList = _.filter(spouseForms, function (splitForm) {
				return _.includes(spouseParentDocIndexes, splitForm.docIndex);
			});
			//Forms other then parent forms(Normal case)
			var spouseOtherFormList = [];
			//Note: xor provide symmetric difference (http://en.wikipedia.org/wiki/Symmetric_difference). Use it carefully
			spouseOtherFormList = _.xor(spouseForms, spouseParentFormList);

			//var first add ParentForms
			_.forEach(spouseParentFormList, function (spouseParentForm) {
				formsToAdd.push(_addForm(spouseParentForm));
			});

			//Add all parent Forms
			$q.all(formsToAdd).then(function (newForms) {
				_.forEach(spouseParentFormList, function (spouseParentForm, index) {
					//Now update parentDocIndexes in spouseOtherFormList
					var splitChildForm = _.find(spouseOtherFormList, { parentDocIndex: spouseParentForm.docIndex });
					if (!_.isUndefined(splitChildForm)) {
						splitChildForm.parentDocIndex = newForms[index].docIndex;
					}

					//Add field values to added forms
					_.forEach(spouseParentForm.fields, function (fieldObject, fieldName) {
						_postTaxFieldChange({ fieldName: newForms[index].docName + '.' + fieldName, index: newForms[index].docIndex, newVal: { value: fieldObject.value, isCalculated: fieldObject.isCalculated } });
					});
				});

				//Reset forms to add
				formsToAdd = [];
				//Now add other forms to add
				_.forEach(spouseOtherFormList, function (spouseOtherForm) {

					if (!_.isUndefined(spouseOtherForm.parentDocIndex)) {
						formsToAdd.push(_addForm(spouseOtherForm, undefined, spouseOtherForm.parentDocIndex));
					} else {
						formsToAdd.push(_addForm(spouseOtherForm));
					}
				});

				//Add remaining forms
				if (formsToAdd.length > 0) {
					$q.all(formsToAdd).then(function (newForms) {
						_.forEach(spouseOtherFormList, function (spouseOtherForm, index) {
							//Add field values to added forms
							_.forEach(spouseOtherForm.fields, function (fieldObject, fieldName) {
								_postTaxFieldChange({ fieldName: newForms[index].docName + '.' + fieldName, index: newForms[index].docIndex, newVal: { value: fieldObject.value, isCalculated: fieldObject.isCalculated } });
							});
						});
						deferred.resolve('YES');
					}, function (error) {
						deferred.resolve('NO');
						$log.error(error);
					});
				} else {
					deferred.resolve('YES');
				}
			});

			return deferred.promise;
		};

		/**
		 * This function is used to add forms (that are common for spouse and Taxpayer) or if already exist just add/update values
		 * Will be caleed by _splitReturnOperations() only
		 */
		var _splitReturnAddValusForCommonForms = function (commonForms) {
			var deferred = $q.defer();

			//Add form queue 
			var formsToAdd = [];
			//Temporary arrays holding add form form list. (Required to use it in loop to add all fields after add form)
			var tempForms = [];
			//Add fields for already added forms and make list fo forms that are not added
			_.forEach(commonForms, function (commonForm) {
				var alreadyAddedForm = _.find(_taxReturn.forms, { docName: commonForm.docName });
				if (!_.isUndefined(alreadyAddedForm) || !_.isEmpty(alreadyAddedForm)) {
					//Add fields
					_.forEach(commonForm.fields, function (fieldObject, fieldName) {
						_postTaxFieldChange({ fieldName: alreadyAddedForm.docName + '.' + fieldName, index: alreadyAddedForm.docIndex, newVal: { value: fieldObject.value, isCalculated: fieldObject.isCalculated } });
					});
				} else {
					//Ass Form is not added we have to add those forms in list
					tempForms.push(commonForm);
					formsToAdd.push(_addForm(commonForm));
				}

				//Process add form queue
				if (formsToAdd.length > 0) {
					$q.all(formsToAdd).then(function (newForms) {
						//Add fields
						_.forEach(tempForms, function (tempForm, index) {
							_.forEach(tempForm.fields, function (fieldObject, fieldName) {
								_postTaxFieldChange({ fieldName: newForms[index].docName.docName + '.' + fieldName, index: newForms[index].docName.docIndex, newVal: { value: fieldObject.value, isCalculated: fieldObject.isCalculated } });
							});
						});

						deferred.resolve('YES');
					});
				} else {
					deferred.resolve('YES');
				}
			});

			return deferred.promise;
		};


		/**
		 * This Method is used to copy default values from form to return
		 * Used in Add Form and New Return (Open Return with isNewReturn = true)
		 */
		var _addFormDefaultValues = function (taxReturn, formsPassed) {
			var deferred = $q.defer();

			//var taxReturn = angular.copy(returnPassed);    
			var formList = angular.copy(formsPassed);

			//Convert single form to form list
			if (!_.isArray(formList)) {
				formList = [formList];
			}

			//Array of request calls
			var formRequests = [];

			_.forEach(formList, function (form) {
				//Add request to queue
				if ((_.isUndefined(form.packageName) || form.packageName == '') && (_.isUndefined(form.state) || form.state == '')) {
					var formProp = contentService.getFormProp(form.formName);
					formRequests.push(contentService.getDocFields(form.docName, formProp.packageName, formProp.state));
				} else {
					formRequests.push(contentService.getDocFields(form.docName, form.packageName, form.state));
				};
			});

			//Call async queue
			$q.all(formRequests).then(function (formsFields) {
				//Loop for success data for all forms 
				_.forEach(formsFields, function (formFields, indexPoint) {
					//Form to add default fields.
					var form = formList[indexPoint];
					_addDefaultValues(form.docName, form.docIndex, formFields);
				});

				deferred.resolve('success');
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});

			return deferred.promise;
		};

		var _addDefaultValues = function (docName, index, formFields) {
			//Check if form has any default values
			_.forEach(formFields, function (field) {
				if (!_.isUndefined(field.value)) {
					var doc = _getDoc(docName, index);
					//Add default value to form doc
					doc[field.name] = { "value": field.value };
					//taxReturn.docs[form.docName][form.docIndex][field.name] = { "value": field.value };
					//post default values to calculation
					var field = {
						fieldName: docName + '.' + field.name,
						index: index,
						newVal: doc[field.name]
					};
					_postTaxFieldChange(field);
				}
			});

		};

		//Update states that are added in return. This will be called after adding or removing state from return
		var _updateAddedStates = function () {
			//Available packages in return
			var packageNames = _taxReturn.header.packageNames;

			var stateList = [];

			// For More return type we need to write conditions here

			//To add residencyStatus of states. Only for 1040 package
			if (_packageName == '1040' && _.has(_taxReturn.docs, 'dMainInfo')) {
				var keys = _.keys(_taxReturn.docs.dMainInfo);
				var doc = _taxReturn.docs.dMainInfo[keys[0]];
				var residencyStatuses = contentService.getStateResStatusShortName('ALL');

				_.forEach(_taxReturn.header.states, function (state) {
					if (state !== 'federal') {
						var stateToAdd = { name: state.toUpperCase(), isAdded: true };

						//For residency status
						_.forEach(residencyStatuses, function (residencyStatus) {
							var residencyStatusFullName = contentService.getStateResStatusFullName(residencyStatus);
							if (_.has(doc, residencyStatusFullName) && !_.isUndefined(doc[residencyStatusFullName].value) &&
								doc[residencyStatusFullName].value.indexOf(state.toLowerCase()) > -1) {
								stateToAdd.residencyStatus = residencyStatus;
							};
						});

						stateList.push(stateToAdd);
					};
				});
			} else {
				//If return has other then 1040 package
				_.forEach(_taxReturn.header.states, function (state) {
					if (state !== 'federal') {
						stateList.push({ name: state.toUpperCase(), isAdded: true });
					}
				});
			}

			//Now cache this result for future use.
			_addedStates = stateList;
		};
		//check is all operation for perform review is done or not 
		var _checkIsPerformReviewDoneThenBroadCast = function () {
			//check all the operation for perform review is done or not 
			if (!_.isUndefined(_isPerformReviewDone) && _isPerformReviewDone === true && !_.isUndefined(_isFieldRequiredCheck) && _isFieldRequiredCheck === true) {
				//make both variable false 
				_isPerformReviewDone = false;
				_isFieldRequiredCheck = false;
				//broadcast that perform review done 
				$rootScope.$broadcast('performReviewDoneServiceSide');
				$log.debug('Perform review - required check worked well');
			}
		};

		//Check required fields and validate them for given docName (all docs)
		var performReviewForDoc = function (docName, docIndex) {
			var deferred = $q.defer();
			// clear reviewErrors
			_reviewErrors = [];

			var _isValidationPerformedForDoc = false;
			var _isRequiredCheckedForDoc = false;

			if (!_.isUndefined(_taxReturn)) {
				var processQ = [];

				//If docIndex is passed then perform for that instance only
				if (angular.isDefined(docIndex)) {
					//create formObject using docNAme & docIndex
					var _formObject = { docName: docName, docIndex: docIndex };

					//find Child docs (statements)
					var _formObjects = _getChildForms(_formObject);
					if (!_.isEmpty(_formObjects)) {
						_formObjects = _.pluck(_formObjects, 'form');
					}

					//Push main form as well
					_formObjects.push(_formObject);

					//Loop on each form
					for (var indx in _formObjects) {
						//perform Validation checks (based on field leve or type level)
						_performFieldValidationCheck(_formObjects[indx].docName, _formObjects[indx].docIndex);
						//perform required field checks
						processQ.push(_performFieldRequiredCheck(_formObjects[indx].docName, _formObjects[indx].docIndex));
					}

				} else {//If docIndex is not passed then perform for all instance of form
					// get all indexes of document
					var docIndexes = _.keys(_taxReturn.docs[docName]);
					if (!_.isUndefined(docIndexes) && docIndexes.length > 0) {
						for (var index = 0; index < docIndexes.length; index++) {
							//create formObject using docNAme & docIndex
							var _formObject = { docName: docName, docIndex: docIndexes[index] };

							//find Child forms (statements)
							var _formObjects = _getChildForms(_formObject);
							if (!_.isEmpty(_formObjects)) {
								_formObjects = _.pluck(_formObjects, 'form');
							}

							//Push main form as well
							_formObjects.push(_formObject);

							//Loop on each form
							for (var indx in _formObjects) {
								//perform Validation checks (based on field leve or type level)
								_performFieldValidationCheck(_formObjects[indx].docName, _formObjects[indx].docIndex);
								//perform required field checks
								processQ.push(_performFieldRequiredCheck(_formObjects[indx].docName, _formObjects[indx].docIndex));
							}
						}
					}
				}
				//This flag help us to track that validation has been performed                
				_isValidationPerformedForDoc = true;

				//check if any doc is pushed in requiredCheck process

				if (processQ.length > 0) {
					$q.all(processQ).then(function () {
						//set variable true that field require check done
						_isRequiredCheckedForDoc = true;
						//Check if required & validation both checks done. Because validation check is sync operation while required check is async
						if (_isValidationPerformedForDoc == true && _isRequiredCheckedForDoc == true) {
							deferred.resolve(service.getReviewErrors());
						}
					}, function (error) {
						//set variable true that field require check done
						_isRequiredCheckedForDoc = true;
						$log.error(error);
						//Check if required & validation both checks done. Because validation check is sync operation while required check is async
						if (_isValidationPerformedForDoc == true && _isRequiredCheckedForDoc == true) {
							deferred.resolve(service.getReviewErrors());
						}
					});
				} else {
					//set variable true that field require check done
					_isRequiredCheckedForDoc = true;
				}


				//Check if required & validation both checks done. Because validation check is sync operation while required check is async
				if (_isValidationPerformedForDoc == true && _isRequiredCheckedForDoc == true) {
					deferred.resolve(service.getReviewErrors());
				}
			}

			return deferred.promise;
		}

		var _performReview = function (docNamesOfParticularStates) {
			// clear reviewErrors
			_reviewErrors = [];

			if (!_.isUndefined(_taxReturn)) {
				//get all documents in return
				//var docNames = _.keys(_taxReturn.docs);
				var docNames = _getDocsForPerformReview(docNamesOfParticularStates);
				//fire review with method execution in calculation engine
				_calcWorker.postMessage({ msgType: 'performReview', ruleDocs: docNames });

				if (!_.isUndefined(docNames) && docNames.length > 0) {
					var processQ = [];
					for (var dIndex = 0; dIndex < docNames.length; dIndex++) {
						// get all indexes of document
						var docIndexes = _.keys(_taxReturn.docs[docNames[dIndex]]);
						if (!_.isUndefined(docIndexes) && docIndexes.length > 0) {
							for (var index = 0; index < docIndexes.length; index++) {
								//perform Override checks
								_performFieldOverrideCheck(docNames[dIndex], docIndexes[index]);
								//perform Validation checks (based on field leve or type level)
								_performFieldValidationCheck(docNames[dIndex], docIndexes[index]);
								//perform required field checks
								processQ.push(_performFieldRequiredCheck(docNames[dIndex], docIndexes[index]));
								//perform estimated field checks
								_performFieldEstimatedCheck(docNames[dIndex], docIndexes[index])
							}
						}
					}
					//                
					_isPerformReviewDone = true;
					//call to check is all operation is done for perform review.
					_checkIsPerformReviewDoneThenBroadCast();
					if (processQ.length > 0) {
						if (processQ.length > 0) {
							$q.all(processQ)
								.then(function () {
									//set variable true that field require check done
									_isFieldRequiredCheck = true;
									//call to check is all operation is done for perform review.
									_checkIsPerformReviewDoneThenBroadCast();
								}, function (error) {
									//set variable true that field require check done
									_isFieldRequiredCheck = true;
									//call to check is all operation is done for perform review.
									_checkIsPerformReviewDoneThenBroadCast();
									$log.error(error);
								});
						}
					}
				}

				//Check for state for which we are not approved (in testing or not available for current tax year)
				//And show warning for those states            
				_.forEach(_taxReturn.header.states, function (stateName) {
					if (stateName.toLowerCase() != 'federal') {
						var stateConfig = _.find(_availableStateList, { "name": stateName.toUpperCase() });
						if (!_.isUndefined(stateConfig) && !_.isUndefined(stateConfig.eFileStatus) && !_.isUndefined(stateConfig.eFileStatus.value) && stateConfig.eFileStatus.value == "ats") {
							var error = {
								fieldName: undefined,
								category: 'efile',
								message: stateName.toUpperCase() + ' is not approved for E-filing we are sorry for the inconvenience this may cause you. Once the state is approved it will automatically be transmitted if the federal return is accepted or you will receive a validation message to review the return and transmit the e-file.',
								key: 'E-File',
								severity: 'Warning',
								suggestion: ''
							};
							_reviewErrors.push(error);
						} else if (stateConfig.eFileStatus.value == "paperOnly") {
							var error = {
								fieldName: undefined,
								category: 'efile',
								message: stateName.toUpperCase() + ' e-file approval has not been received for tax year ' + _taxReturn.header.year + '.The ' + stateName.toUpperCase() + ' e-file will not be created and sent. To file the return electronically go to ' + stateName.toUpperCase() + ' DOR website or print and mail the return.',
								key: 'E-File',
								severity: 'Warning',
								suggestion: ''
							};
							_reviewErrors.push(error);
						}
					}
				});
			}
		};

		var _getDocsForPerformReview = function (docNamesOfParticularStates) {
			var docNames = [];
			//if(_betaOnly()) {
			//var docNames = _.keys(_taxReturn.docs);        
			var performReviewRules = _performReviewRules[_packageName];

			for (var stateName in performReviewRules) {
				var stateRule = performReviewRules[stateName];
				if (!_.isUndefined(stateRule) && stateRule.length > 0) {
					for (var ruleIndex in stateRule) {
						var rule = stateRule[ruleIndex];
						if (!_.isUndefined(rule.activeForm)) {
							var ruleDocIndexes = _getIndex(rule.activeForm);
							if (!_.isUndefined(ruleDocIndexes) && ruleDocIndexes.length > 0) {
								var ruleDoc = _getDoc(rule.activeForm, ruleDocIndexes[0]);
								if (!_.isUndefined(ruleDoc) && !_.isUndefined(ruleDoc.isActive) && !_.isUndefined(ruleDoc.isActive.value) && (ruleDoc.isActive.value === true || ruleDoc.isActive.value === 'true')) {
									var taxReturnDocs;
									if (!_.isUndefined(docNamesOfParticularStates) && docNamesOfParticularStates.length > 0) {
										taxReturnDocs = docNamesOfParticularStates;
									} else {
										taxReturnDocs = _.keys(_taxReturn.docs);
									}
									if (docNamesOfParticularStates == undefined) {
										if (!_.isUndefined(rule.allowedForms) && rule.allowedForms.length > 0) {
											docNames = docNames.concat(docNames, _.intersection(taxReturnDocs, rule.allowedForms));
										}
										if (!_.isUndefined(rule.ignoreForms) && rule.ignoreForms.length > 0) {
											docNames = docNames.concat(docNames, _.difference(taxReturnDocs, rule.ignoreForms));
										}
									}
									break;
								}
							}
						}
					}
				}
			}
			//}    
			if (!_.isUndefined(docNames) && docNames.length > 0) {
				return docNames;
			} else {
				if (!_.isUndefined(docNamesOfParticularStates) && docNamesOfParticularStates.length > 0) {
					return docNamesOfParticularStates;
				} else {
					return _.keys(_taxReturn.docs)
				}
			}

			//return !_.isUndefined(docNames) && docNames.length > 0 ? docNames : _.keys(_taxReturn.docs);

		}

		var _performFieldOverrideCheck = function (docName, index) {
			//get document names
			var doc = _getDoc(docName, index);
			//get form from doc and check that is statement
			var result = _getFormFromDoc(doc, index);
			//get parent doc
			var parentDoc;
			//TODO: Due to some issues, statement does not removed when it's parent get deleted (specially when we remove complete state)
			//we made patch here to avoid error, but we have to fin solution that child statements should be removed when parent get deleted.
			if (result.isStatement === true && !_.isUndefined(result.form) && !_.isUndefined(result.form.docName) && !_.isUndefined(result.form.docIndex)) {
				parentDoc = _getDoc(result.form.docName, result.form.docIndex);
			}
			//check that doc is active and if it is statement doc then check parent doc is active
			if (!_.isUndefined(doc)
				&& ((result.isStatement === true && !_.isUndefined(parentDoc) && !_.isUndefined(parentDoc.isActive) && !_.isUndefined(parentDoc.isActive.value) && (_.isBoolean(parentDoc.isActive.value) ? parentDoc.isActive.value === true : parentDoc.isActive.value == 'true'))
					|| (!_.isUndefined(doc.isActive) && !_.isUndefined(doc.isActive.value) && (_.isBoolean(doc.isActive.value) ? doc.isActive.value === true : doc.isActive.value == 'true')))) {
				var fieldNames = _.keys(doc);
				if (!_.isUndefined(fieldNames) && fieldNames.length > 0) {
					for (var fIndex = 0; fIndex < fieldNames.length; fIndex++) {
						if (!_.isUndefined(doc[fieldNames[fIndex]]) && !_.isNull(doc[fieldNames[fIndex]]) && !_.isUndefined(doc[fieldNames[fIndex]].isOverridden) && (_.isBoolean(doc[fieldNames[fIndex]].isOverridden) ? doc[fieldNames[fIndex]].isOverridden === true : doc[fieldNames[fIndex]].isOverridden == 'true')) {
							var error = {
								fieldName: fieldNames[fIndex],
								docName: docName,
								docIndex: index,
								category: 'overridden',
								message: (_betaOnly() == true && doc[fieldNames[fIndex]].calValue && doc[fieldNames[fIndex]].calValue != doc[fieldNames[fIndex]].value) ? 'Calculated value('+ doc[fieldNames[fIndex]].calValue + ') is different from overridden value('+ doc[fieldNames[fIndex]].value + ') - please review for accuracy.' : 'Calculated value is overridden - please review for accuracy.',
								key: 'Overridden',
								severity: 'Warning',
								suggestion: ''
							};
							_reviewErrors.push(error);
						}
					}
				}
			}
		};

		var _performFieldEstimatedCheck = function (docName, index) {
			//get document names
			var doc = _getDoc(docName, index);
			//get form from doc and check that is statement
			var result = _getFormFromDoc(doc, index);
			//get parent doc
			var parentDoc;
			//TODO: Due to some issues, statement does not removed when it's parent get deleted (specially when we remove complete state)
			//we made patch here to avoid error, but we have to fin solution that child statements should be removed when parent get deleted.
			if (result.isStatement === true && !_.isUndefined(result.form) && !_.isUndefined(result.form.docName) && !_.isUndefined(result.form.docIndex)) {
				parentDoc = _getDoc(result.form.docName, result.form.docIndex);
			}
			//check that doc is active and if it is statement doc then check parent doc is activeElemente
			if (!_.isUndefined(doc)
				&& ((result.isStatement === true && !_.isUndefined(parentDoc) && !_.isUndefined(parentDoc.isActive) && !_.isUndefined(parentDoc.isActive.value) && (_.isBoolean(parentDoc.isActive.value) ? parentDoc.isActive.value === true : parentDoc.isActive.value == 'true'))
					|| (!_.isUndefined(doc.isActive) && !_.isUndefined(doc.isActive.value) && (_.isBoolean(doc.isActive.value) ? doc.isActive.value === true : doc.isActive.value == 'true')))) {
				var fieldNames = _.keys(doc);
				if (!_.isUndefined(fieldNames) && fieldNames.length > 0) {
					//iterate through all field in return document which are estimated and add those in error list
					for (var fIndex = 0; fIndex < fieldNames.length; fIndex++) {
						if (!_.isUndefined(doc[fieldNames[fIndex]]) && !_.isNull(doc[fieldNames[fIndex]]) && !_.isUndefined(doc[fieldNames[fIndex]].isEstimated)
							&& (_.isBoolean(doc[fieldNames[fIndex]].isEstimated) ? doc[fieldNames[fIndex]].isEstimated === true : doc[fieldNames[fIndex]].isEstimated == 'true')) {
							var error = {
								fieldName: fieldNames[fIndex], docName: docName, docIndex: index,
								category: 'estimated',
								message: 'Field is marked as estimated - please review for accuracy.',
								key: 'Estimated',
								severity: 'Warning',
								suggestion: ''
							};
							_reviewErrors.push(error);
						}
					}
				}
			}
		};

		var _performFieldValidationCheck = function (docName, index) {
			//get doc
			var doc = _getDoc(docName, index);
			//get form from doc 
			var result = _getFormFromDoc(doc, index);
			var form = result.form;
			//get parent doc
			var parentDoc;
			//TODO: Due to some issues, statement does not removed when it's parent get deleted (specially when we remove complete state)
			//we made patch here to avoid error, but we have to fin solution that child statements should be removed when parent get deleted.
			if (result.isStatement === true && !_.isUndefined(result.form) && !_.isUndefined(result.form.docName) && !_.isUndefined(result.form.docIndex)) {
				parentDoc = _getDoc(result.form.docName, result.form.docIndex);
			}
			//Check that document has isActive property and value as true other wise check if it is Statement as Statement does not have isActive property
			if (!_.isUndefined(doc)
				&& ((result.isStatement === true && !_.isUndefined(parentDoc) && !_.isUndefined(parentDoc.isActive) && !_.isUndefined(parentDoc.isActive.value) && (_.isBoolean(parentDoc.isActive.value) ? parentDoc.isActive.value === true : parentDoc.isActive.value == 'true'))
					|| (!_.isUndefined(doc.isActive) && !_.isUndefined(doc.isActive.value) && (_.isBoolean(doc.isActive.value) ? doc.isActive.value === true : doc.isActive.value == 'true')))) {

				if (!_.isUndefined(form)) {
					//Form Properties
					var formProp = contentService.getFormProp(form.formName);
					//load doc template
					//Note: When document of form is not available (as cache) in common service, It does not validate field.
					//To avoid such scenario we, just load doc fields as safe side(It will not load it, If already loaded)
					contentService.getDocFields(docName, formProp.packageName, formProp.state).then(function (docTemplate) {
						//Real logic - start
						_.forEach(doc, function (field, fieldName) {
							//if value is not blank
							if (!_.isUndefined(field) && !_.isNull(field) && !_.isUndefined(field.value) && field.value !== '') {
								//Check for max length first
								var maxLength = contentService.getFieldMaxLength(docName + '.' + fieldName);
								if (!_.isUndefined(maxLength) && maxLength != '' && field.value.length > maxLength) {
									var error = {
										fieldName: fieldName,
										docName: docName,
										docIndex: index,
										category: 'validation',
										message: 'Value must be less than or equal to ' + parseInt(maxLength) + ' characters.',
										key: 'Validation',
										severity: 'Reject',
										suggestion: ''
									};
									_reviewErrors.push(error);
								};
								var isValidPattern = true;
								//Check for validation of field (fallback to type)
								var expression = contentService.getFieldPattern(docName + '.' + fieldName);
								if (!_.isUndefined(expression) && !_.isUndefined(expression.pattern)) {
									try {
										//These flags are used for like ignore case , etc..
										if (!_.isUndefined(expression.flags) && expression.flags !== '') {
											var _regExpResult = new RegExp(expression.pattern, expression.flags).exec(field.value);
											//if(!new RegExp(expression.pattern,expression.flags).test(field.value)){
											if (_regExpResult == undefined || _regExpResult == null || _regExpResult.length == 0 || _regExpResult[0] == undefined || _regExpResult[0] == '' || _regExpResult[0] != field.value) {
												var error = {
													fieldName: fieldName,
													docName: docName,
													docIndex: index,
													category: 'validation',
													message: _.isUndefined(expression.patternMsg) == true ? "Value must be in required format" : expression.patternMsg,
													key: 'Validation',
													severity: 'Reject',
													suggestion: ''
												};
												_reviewErrors.push(error);
												isValidPattern = false;
											};
										} else {
											//If flag is not passed then
											var _regExpResult = new RegExp(expression.pattern).exec(field.value);
											//if(!new RegExp(expression.pattern).test(field.value)){
											if (_regExpResult == undefined || _regExpResult == null || _regExpResult.length == 0 || _regExpResult[0] == undefined || _regExpResult[0] == '' || _regExpResult[0] != field.value) {
												var error = {
													fieldName: fieldName,
													docName: docName,
													docIndex: index,
													category: 'validation',
													message: _.isUndefined(expression.patternMsg) == true ? "Value must be in required format" : expression.patternMsg,
													key: 'Validation',
													severity: 'Reject',
													suggestion: ''
												};
												_reviewErrors.push(error);
												isValidPattern = false;
											};
										};
									} catch (e) {
										// TODO: handle exception
										$log.error(e);
									};
								};

								//if pattern is valid then we will go for algorithm checking
								if (isValidPattern == true) {
									//here we call algorithm for validation of ssn , routing number
									var algorithm = contentService.getFieldAlgorithm(docName + '.' + fieldName);
									//if field value is not valid then we push error in perform review
									if (!_.isUndefined(algorithm) && algorithm.definition(field.value) == false) {
										var error = {
											fieldName: fieldName,
											docName: docName,
											docIndex: index,
											category: 'validation',
											message: algorithm.message,
											key: 'Validation',
											severity: 'Reject',
											suggestion: ''
										};
										_reviewErrors.push(error);
									}
								}
							};
						});
						//End
					}, function (error) {
						$log.error(error);
					});
				};
			};
		};

		var _performFieldRequiredCheck = function (docName, index) {
			var deferred = $q.defer();
			var doc = _getDoc(docName, index);
			//get form from doc 
			var result = _getFormFromDoc(doc, index);
			var form = result.form;
			//get parent doc
			var parentDoc;
			//TODO: Due to some issues, statement does not removed when it's parent get deleted (specially when we remove complete state)
			//we made patch here to avoid error, but we have to fin solution that child statements should be removed when parent get deleted.
			if (result.isStatement === true && !_.isUndefined(result.form) && !_.isUndefined(result.form.docName) && !_.isUndefined(result.form.docIndex)) {
				parentDoc = _getDoc(result.form.docName, result.form.docIndex);
			}

			//check that doc is active and if it is statement doc then check parent doc is active
			if (!_.isUndefined(doc)
				&& ((result.isStatement === true && !_.isUndefined(parentDoc) && !_.isUndefined(parentDoc.isActive) && !_.isUndefined(parentDoc.isActive.value) && (_.isBoolean(parentDoc.isActive.value) ? parentDoc.isActive.value === true : parentDoc.isActive.value == 'true'))
					|| (!_.isUndefined(doc.isActive) && !_.isUndefined(doc.isActive.value) && (_.isBoolean(doc.isActive.value) ? doc.isActive.value === true : doc.isActive.value == 'true')))) {

				if (!_.isUndefined(form)) {
					var formProp = contentService.getFormProp(form.formName);
					//iterate through all field in return document which are required and not filled and add those in error list
					_.forEach(doc, function (field, fieldName) {
						if (!_.isUndefined(field) && !_.isNull(field) && !_.isUndefined(field.isRequired) &&
							field.isRequired && (_.isUndefined(field.value) || field.value === "")) {
							var error = {
								fieldName: fieldName,
								docName: docName,
								docIndex: index,
								category: 'required',
								message: 'Required information has not been entered.',
								key: 'Required',
								severity: 'Reject',
								suggestion: ''
							};
							_reviewErrors.push(error);

						}
					});

					// now check all require field in doc template 
					contentService.getDocFields(docName, formProp.packageName, formProp.state)
						.then(function (docTemplate) {
							_.forEach(docTemplate, function (field, fieldName) {
								if (field.isRequired &&
									(_.isUndefined(doc[field.name]) || (_.isUndefined(doc[field.name].isRequired) &&
										(_.isUndefined(doc[field.name].value) || doc[field.name].value === "")))) {
									var error = {
										fieldName: fieldName,
										docName: docName,
										docIndex: index,
										category: 'required',
										message: 'Required information has not been entered.',
										key: 'Required',
										severity: 'Reject',
										suggestion: ''
									};
									_reviewErrors.push(error);
								}
							});
							deferred.resolve(true);
						}, function (error) {
							$log.error(error);
							deferred.resolve(false);
						});
				}
				else
					deferred.resolve(false);
			} else
				deferred.resolve(false);
			return deferred.promise;
		};

		var _postTaxFieldChange = function (field) {
			_calcWorker.postMessage({
				'msgType': 'ChangedField',
				'field': field
			});
		};

		/**
		 *This function is used to invoke full recaculate means every methods of added forms will be fire, same like add form.
		 * listOfForms = Collection having docName & docIndex for example [{docName:'d1040',docIndex:3}] 
		 */
		var fullReCalculate = function (listOfForms) {
			//set recalculate loading flag true to have loading animation
			$rootScope.$broadcast('enableRecalculateLoading');
			if (!_.isUndefined(listOfForms) && _.isArray(listOfForms)) {
				for (var index = 0; index < listOfForms.length; index++) {
					if (!_.isUndefined(listOfForms[index].docName) && !_.isUndefined(listOfForms[index].docIndex)) {
						_calcWorker.postMessage({ msgType: 'calcDocAllMethods', docName: listOfForms[index].docName, index: listOfForms[index].docIndex });
					}
				}
			} else if (!_.isUndefined(_taxReturn) && !_.isUndefined(_taxReturn.docs)) {
				var docNames = _.keys(_taxReturn.docs);
				if (!_.isUndefined(docNames) && docNames.length > 0) {
					for (var dIndex = 0; dIndex < docNames.length; dIndex++) {
						// get all indexes of document
						if (docNames[dIndex] != 'count') {
							var docIndexes = _.keys(_taxReturn.docs[docNames[dIndex]]);
							if (!_.isUndefined(docIndexes) && docIndexes.length > 0) {
								for (var index = 0; index < docIndexes.length; index++) {
									_calcWorker.postMessage({ msgType: 'calcDocAllMethods', docName: docNames[dIndex], index: docIndexes[index] });
								}
							}
						}
					}
				}
			}
		};

		/**
		 * This function return appropriate file name for printing of form/return
		 * printingType - is type of printing request. For ex - single form, blank form, etc..
		 * nameToInculde - is name of form
		 */
		var getFileNameForPrinting = function (printingType, formName) {

			var _fileName = "";
			// For More return type we need to write conditions here
			//Check for printingType
			if (printingType == 'printSingleForm') {
				if (_packageName == '1040') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.dMainInfo)[0];
					//Retun First_Last_formName_returnYear
					if (!_.isUndefined(_taxReturn.docs.dMainInfo[docIndex].tpfnmi)) {
						_fileName = _taxReturn.docs.dMainInfo[docIndex].tpfnmi.value + "_" + _taxReturn.docs.dMainInfo[docIndex].tplnm.value + "_" + formName + "_" + _taxReturn.header.year + '.pdf';
					} else {
						_fileName = _taxReturn.docs.dMainInfo[docIndex].tplnm.value + "_" + formName + "_" + _taxReturn.header.year + '.pdf';
					}
				} else if (_packageName == '1065') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1065CIS)[0];
					//Retun firmName_formName_returnYear
					_fileName = _taxReturn.docs.d1065CIS[docIndex].PartnerName.value + "_" + formName + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '1120') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1120CCIS)[0];
					//Retun firmName_formName_returnYear
					_fileName = _taxReturn.docs.d1120CCIS[docIndex].NameofCorporation.value + "_" + formName + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '1120s') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1120SCIS)[0];
					//Retun firmName_formName_returnYear
					_fileName = _taxReturn.docs.d1120SCIS[docIndex].NameofSCorporation.value + "_" + formName + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '1041') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1041CIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d1041CIS[docIndex].Nameofestate.value + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '990') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d990CIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d990CIS[docIndex].PartnerName.value + "_" + _taxReturn.header.year + '.pdf';
				}
			} else if (printingType == 'printBlankForm') {
				//Return formName_returnYear
				_fileName = formName + "_" + _taxReturn.header.year + '.pdf';
			} else if (printingType == 'printSelectedForms' || printingType == 'printCompleteReturn') {
				if (_packageName == '1040') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.dMainInfo)[0];
					//Retun First_Last_returnYear
					if (!_.isUndefined(_taxReturn.docs.dMainInfo[docIndex].tpfnmi)) {
						_fileName = _taxReturn.docs.dMainInfo[docIndex].tpfnmi.value + "_" + _taxReturn.docs.dMainInfo[docIndex].tplnm.value + "_" + _taxReturn.header.year + '.pdf';
					} else {
						_fileName = _taxReturn.docs.dMainInfo[docIndex].tplnm.value + "_" + _taxReturn.header.year + '.pdf';
					}
				} else if (_packageName == '1065') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1065CIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d1065CIS[docIndex].PartnerName.value + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '1120') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1120CCIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d1120CCIS[docIndex].NameofCorporation.value + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '1120s') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1120SCIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d1120SCIS[docIndex].NameofSCorporation.value + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '1041') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d1041CIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d1041CIS[docIndex].Nameofestate.value + "_" + _taxReturn.header.year + '.pdf';
				} else if (_packageName == '990') {
					//Get doc index of CIS
					var docIndex = _.keys(_taxReturn.docs.d990CIS)[0];
					//Retun firmName_returnYear
					_fileName = _taxReturn.docs.d990CIS[docIndex].PartnerName.value + "_" + _taxReturn.header.year + '.pdf';
				}
			}

			//Replace ',' with underscore and return
			return _fileName.replace(/,|\s/g, '_');
		};

		var _checkForNewInstance = function (formName) {
			//obtaining the from property in order to get the multiAllowed and maxOccurs of form
			var _formProp = _getFormProp(formName);
			//condition to check formProp is not undefined morover checking the maxOccurs of current form is not exceed and also checking that form is multi-instance form
			//Note :- this code is to enable and disable the new Instance button in tool bar
			if (!_.isUndefined(_formProp) && !_.isUndefined(_formProp.isMultiAllowed) && _formProp.isMultiAllowed != false
				&& ((!_.isUndefined(_formProp.maxOccurs) && parseInt(_formProp.maxOccurs) > 0 && _.keys(_getDoc(_formProp.docName)).length < parseInt(_formProp.maxOccurs)) || parseInt(_formProp.maxOccurs) == 0 || _.isUndefined(_formProp.maxOccurs))) {
				return true;//boolean variable for enabling and disabling new Instance button in return toolbar
			} else {
				return false;
			}
		};

		// Following functions are available outside
		var service = {};

		//Get List of Return Status    
		service.getReturnStatusList = function () {
			var userService = $injector.get('userService');
			var returnStatus = angular.copy(userService.getReturnStatusList());
			//Mark current status
			//On open of return we will check whether id exists or not. IF not then we will update the header.
			var returnInfo = { id: _taxReturn.header.id, isCheckedOut: _taxReturn.header.isCheckedOut, isLocked: _taxReturn.header.isLocked };
			//IF no status found then set it to default status.
			_taxReturn.header.status = userService.getReturnStatusObject(_taxReturn.header.status, returnInfo);
			//set is selected
			_.find(returnStatus, { id: _taxReturn.header.status.id }).isSelected = true;
			return returnStatus;
		};

		/**
		 * This function is used to update residency fields in main info for instance hold by calculation
		 */
		service.updateStateResInCalc = function (residencyStatus) {
			//add in Main Info residency status for state
			//either FullYearResident,PartYearResident,NonResident
			if (!_.isUndefined(residencyStatus) && _packageName == '1040' && _.has(_taxReturn.docs, 'dMainInfo')) {

				var residencyStatusFullName = contentService.getStateResStatusFullName(residencyStatus);

				//is1040 = true; //To avoid same if condition on later part of this function
				var keys = _.keys(_taxReturn.docs.dMainInfo);
				var doc = _taxReturn.docs.dMainInfo[keys[0]];

				// post residency status to calculation 
				_postTaxFieldChange({ fieldName: 'dMainInfo.' + residencyStatusFullName, index: keys[0], newVal: { value: doc[residencyStatusFullName].value } });
			} else {
				// No residency options for business states        	
			}

		};

		service.addState = function (stateName, residencyStatus) {
			//To avoid multiple if condition to check for 1040 package
			//var is1040 = false;
			var deferred = $q.defer();
			var packageNames = _taxReturn.header.packageNames;
			var states = [stateName];
			//here some more intialization stuff may come
			//step-1  add package information to Return header
			_taxReturn.header.states.push(stateName);
			//add in Main Info residency status for state
			//either FullYearResident,PartYearResident,NonResident
			if (!_.isUndefined(residencyStatus) && _packageName == '1040' && _.has(_taxReturn.docs, 'dMainInfo')) {
				var residencyStatusFullName = contentService.getStateResStatusFullName(residencyStatus);
				//is1040 = true; //To avoid same if condition on later part of this function
				var keys = _.keys(_taxReturn.docs.dMainInfo);
				var doc = _taxReturn.docs.dMainInfo[keys[0]];
				if (_.has(doc, residencyStatusFullName) && !_.isUndefined(doc[residencyStatusFullName].value)) {
					if (doc[residencyStatusFullName].value === "")
						doc[residencyStatusFullName].value = stateName;
					else
						doc[residencyStatusFullName].value = doc[residencyStatusFullName].value + "," + stateName;
				}
				else
					doc[residencyStatusFullName] = { value: stateName };

				// post residency status to calculation 
				//Note: We are not posting residency value for each state (to update in main info). Rather then controller will call updateStateResInCalc
				//seperately to update all states added in one transaction

			}//There will no residency option for business states

			//update Added states
			_updateAddedStates();

			//step-2 load package content 
			_loadPackageContent(packageNames, states)
				.then(function () {
					// get list of forms in returns for given state
					//Note: _.where is replaced with _.filter condition as we need (property1 & (property 2 or property 3(array) ) )
					var stateForms = [];

					//Add Non/Full Year Resident or PartYear Resident worksheet (only for 1040)
					if (_packageName == "1040") {
						stateForms = _.filter(contentService.getForms(packageNames, stateName), function (form) {
							if (form.isDefault === true && !_.isUndefined(form.residency) && (form.residency === 'ALL' || _.includes(form.residency.split(','), residencyStatus.toUpperCase()))) {
								return true;
							}
						});

						//Sort List of default forms.
						//Priority : main forms -> same residency (means form having FY will be priorities over ALL if add state request is for FY)
						stateForms = _.sortBy(_.sortBy(stateForms, { residency: residencyStatus.toUpperCase() }), { isMainForm: true }).reverse();

						if (residencyStatus === 'FY' || residencyStatus === 'NR') {
							if (_.some(_taxReturn.forms, { docName: 'dNonResi' }) == false)
								stateForms.push(contentService.getForm('dNonResi'));
						} else if (residencyStatus === 'PY') {
							if (_.some(_taxReturn.forms, { docName: 'dPartYrResi' }) == false)
								stateForms.push(contentService.getForm('dPartYrResi'));
						};
					} else {
						// For More return type we need to write conditions here
						stateForms = _.filter(contentService.getForms(packageNames, stateName), { "isDefault": true });

						//Sort List of default forms.
						//Priority : main forms 
						stateForms = _.sortBy(stateForms, { isMainForm: true }).reverse();
					}

					//add forms in queue
					var addFormQ = [];
					if (!_.isUndefined(stateForms) && stateForms.length > 0) {
						for (var fIndex = 0; fIndex < stateForms.length; fIndex++)
							addFormQ.push(_addForm(stateForms[fIndex]));
					}

					//Process add form Queue
					$q.all(addFormQ).then(function (newForms) {
						//This will return list of forms that processed. But here we does not require any operation on that information.
						deferred.resolve(stateName);
					}, function (error) {
						$log.error(error);
						deferred.resolve(stateName);
					});

				}, function (reason) {
					$log.warn(reason);
					deferred.resolve(stateName);
				});
			return deferred.promise;
		};

		service.removeState = function (stateName, residencyStatusType) {
			var deferred = $q.defer();

			// get list of forms in returns for given state
			var stateForms = _.filter(_taxReturn.forms, function (form) {
				var formProp = contentService.getFormProp(form.formName);
				if (formProp != undefined) {
					return formProp.state === stateName;
				}
			});
			//remove forms 
			if (!_.isUndefined(stateForms) && stateForms.length > 0) {
				for (var fIndex = 0; fIndex < stateForms.length; fIndex++)
					_removeForm(stateForms[fIndex]);
			}

			//remove state in return
			var sIndex = _.indexOf(_taxReturn.header.states, stateName.toLowerCase());
			_taxReturn.header.states.splice(sIndex, 1);

			//remove in Main Info residency status for state
			//either FullYearResident,PartYearResident,NonResident
			if (_packageName == '1040' && _.has(_taxReturn.docs, 'dMainInfo')) {
				var keys = _.keys(_taxReturn.docs.dMainInfo);
				var doc = _taxReturn.docs.dMainInfo[keys[0]];
				//Get list of residency status types (Full Names)
				var residencyStatuses = contentService.getStateResStatusFullName('ALL');
				_.forEach(residencyStatuses, function (residencyStatus) {
					if (_.has(doc, residencyStatus) && !_.isUndefined(doc[residencyStatus].value) &&
						doc[residencyStatus].value.indexOf(stateName.toLowerCase()) > -1) {
						//convert value to array
						var resStatusArray = doc[residencyStatus].value.split(',');
						//Loop over array. Remove and return when value match with return type
						_.find(resStatusArray, function (resStatusValue, index) {
							if (resStatusValue == stateName.toLowerCase()) {
								//Remove value
								resStatusArray.splice(index, 1);
								return true;
							}
						});

						//Update value with remaining states
						doc[residencyStatus].value = resStatusArray.toString();
						//update calculation
						service.updateStateResInCalc(residencyStatusType);
					};
				});
			} else {
				// For More return type we need to write conditions here
			}

			//Update added States
			_updateAddedStates();

			deferred.resolve();
			return deferred.promise;
		};

		//Change Residency status of state (FY,NR,PY)
		service.changeStateResidency = function (stateName, oldResidencyShortName, newResidencyShortName) {
			var deferred = $q.defer();

			if (_packageName == '1040' && _.has(_taxReturn.docs, 'dMainInfo')) {
				var keys = _.keys(_taxReturn.docs.dMainInfo);
				var doc = _taxReturn.docs.dMainInfo[keys[0]];

				var oldResidencyFullName = contentService.getStateResStatusFullName(oldResidencyShortName);

				//Delete state name from old status
				if (_.has(doc, oldResidencyFullName) && !_.isUndefined(doc[oldResidencyFullName].value) &&
					doc[oldResidencyFullName].value.indexOf(stateName.toLowerCase()) > -1) {
					//convert value to array
					var resStatusArray = doc[oldResidencyFullName].value.split(',');
					//Loop over array. Remove and return when value match with return type
					_.find(resStatusArray, function (resStatusValue, index) {
						if (resStatusValue == stateName.toLowerCase()) {
							//Remove value
							resStatusArray.splice(index, 1);
							//Break loop
							return true;
						}
					});

					//Update value with remaining states for old status
					doc[oldResidencyFullName].value = resStatusArray.toString();

					// post updated residency status to calculation
					_postTaxFieldChange({ fieldName: 'dMainInfo.' + oldResidencyFullName, index: keys[0], newVal: { value: doc[oldResidencyFullName].value } });


				};

				//Add state to new status
				var newResidencyFullName = contentService.getStateResStatusFullName(newResidencyShortName);

				if (_.has(doc, newResidencyFullName) && !_.isUndefined(doc[newResidencyFullName].value)) {
					if (doc[newResidencyFullName].value === "")
						doc[newResidencyFullName].value = stateName.toLowerCase();
					else
						doc[newResidencyFullName].value = doc[newResidencyFullName].value + "," + stateName.toLowerCase();
				}
				else
					doc[newResidencyFullName] = { value: stateName.toLowerCase() };

				// post updated residency status to calculation
				_postTaxFieldChange({ fieldName: 'dMainInfo.' + newResidencyFullName, index: keys[0], newVal: { value: doc[newResidencyFullName].value } });

				//Check for state worksheet and add if required
				if (newResidencyShortName === 'FY' || newResidencyShortName === 'NR') {
					if (_.some(_taxReturn.forms, { docName: 'dNonResi' }) == false)
						_addForm(contentService.getForm('dNonResi'));
				} else if (newResidencyShortName === 'PY') {
					if (_.some(_taxReturn.forms, { docName: 'dPartYrResi' }) == false)
						_addForm(contentService.getForm('dPartYrResi'));
				};

				//updated added states
				_updateAddedStates();

				deferred.resolve();
			} else {
				// For More return type we need to write conditions here
			}

			//updated added states
			_updateAddedStates();
			deferred.resolve();

			return deferred.promise;

		};

		service.resetOldReturn = function () {
			//step-1 clean last return data and calcWorker
			_taxReturn = null;
			_clearCalcWorker();

			//reset other variables
			stackNavigation = { "previous": [], "next": [] };
		}

		service.openReturn = function (returnId, source, returnMode) {
			var deferred = $q.defer();
			_returnMode = returnMode;
			//Step 1 is moved to resetOldReturn function.

			//step-2 load tax return using returnId from APIService
			returnAPIService.openReturn(returnId, source).then(function (response) {
				// to empty this array because it conatins old object of previously open return. 
				_importedK1Data = undefined;
				//checks whether in response their exists draft
				//response will only contain the draft if the draft exist of particular return in document
				if (!_.isUndefined(response.draft) && !_.isEmpty(response.draft)) {
					//we open the confirmation dialog if draft is available of the return
					//if the user click yes we fetch return from draft and load it
					var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' };
					localeService.translate('{{appName}} AutoRecover found an unsaved version of this tax return. <div>  Do you want to automatically load the draft version of this tax return?</div>', 'RETURNCONTROLLER_LOADFROMDRAFT', { appName: appName }).then(function (translatedText) {
						var dialog = dialogService.openDialog("confirm", dialogConfiguration, { title: 'Unsaved tax return', text: translatedText });
						dialog.result.then(function () {
							//assign the draft data 
							_taxReturn = response.draft;
							//after the response data is received we call the function to load the data in UI
							_loadReturn().then(function () {
								// check wheather in reponse there exists k1 data to import
								// if exists than we need to import that k1 Data into this return.
								if (!_.isUndefined(response.importedK1Data) && !_.isEmpty(response.importedK1Data)) {
									_importedK1Data = response.importedK1Data;
									_getK1DataFromReturn(response.importedK1Data);
									// _addImportedK1Forms(response.importedK1Data);
								}
								deferred.resolve({ 'status': 'draft' });
							}, function (error) {
								deferred.reject(error);
							});
						}, function (btn) {
							//this section will be executed when user click on NO button in confirmation dialog

							//assign the latest data
							_taxReturn = response.latest;
							//after the response data is received we call the function to load the data in UI
							_loadReturn().then(function () {
								// check wheather in reponse there exists k1 data to import
								// if exists than we need to import that k1 Data into this return.
								if (!_.isUndefined(response.importedK1Data) && !_.isEmpty(response.importedK1Data)) {
									_importedK1Data = response.importedK1Data;
									// _addImportedK1Forms(response.importedK1Data);
									_getK1DataFromReturn(response.importedK1Data);
								}
								deferred.resolve();
							}, function (error) {
								deferred.reject(error);
							});
						});
					});
				} else {
					//this section will be executed when draft would not be available in response

					//assign the latest data
					//NOTE:- Here we have directly assign the response as it contains direct value instead of key-value pair
					//we will get the direct data from the API in response if the draft for particular return does not exists in couchbase document

					// check wheather in reponse there exists k1 data to import
					// if exists than we need to import that k1 Data into this return.
					if (!_.isUndefined(response.importedK1Data) && !_.isEmpty(response.importedK1Data)) {
						_taxReturn = response.latest;
						_importedK1Data = response.importedK1Data;
						//after the response data is received we call the function to load the data in UI
						_loadReturn().then(function () {
							// _addImportedK1Forms(response.importedK1Data);
							_getK1DataFromReturn(response.importedK1Data);
							deferred.resolve();
						}, function (error) {
							deferred.reject(error);
						});
					} else {
						_taxReturn = response;
						//after the response data is received we call the function to load the data in UI
						_loadReturn().then(function () {
							deferred.resolve();
						}, function (error) {
							deferred.reject(error);
						});
					}
				}
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		/**
		 * This function will call the Function that returns data of imported k1 from its return.
		 * @param {array} importedK1 
		 */
		var _getK1DataFromReturn = function (importedK1) {
			var deffered = $q.defer();
			service.getK1DataFromReturn(importedK1).then(function (result) {
				_addImportedK1Forms(result);
				deffered.resolve(true);
			}, function (error) {
				console.log("Error occured while getting k1 data from return.");
				console.log(error);
				deffered.reject(error);
			})
			return deffered.promise;
		}

		/**
		 * this function will return all added forms filtered by docName.
		 * @param docName
		 * 			contains docName
		 */
		service.getCurrentForms = function (docName) {
			var deffered = $q.defer();
			service.getForms().then(function (forms) {
				var filteredForms = [];
				_.forEach(forms, function (form) {
					if (form.docName === docName) {
						filteredForms.push(form);
					}
				})
				deffered.resolve(filteredForms);
			})
			return deffered.promise;
		}

		/**
		 * function will call the function that add the respected froms for imported k1 data.
		 */
		service.addImportedK1Forms = function (data) {
			_addImportedK1Forms(data);
		}

		/**
		 * In this function we check the condition for efilestatus and return lock, and based on that we display the message.
		 */
		var _checkEfileStatusAndLockForK1Import = function () {
			var deffered = $q.defer();
			var efileObject = service.getEfileStatus('federal');
			var federalMainObject = _.find(efileObject, { 'returnTypeCategory': 'MainForm' })
			var isReturnLocked = service.getReturnLockFlag();
			var message = '';
			if (!_.isUndefined(federalMainObject) && federalMainObject.status == 9) {
				message = 'The 1040 Individual return has already been Accepted. The business return K-1 data has been updated. You will need to create an amended return.';
				deffered.reject({ message: message, title: 'Accepted Return' });
			} else {
				if (isReturnLocked === false) {
					deffered.resolve(true);
				} else {
					_updatedK1DataPending = true;
					message = 'Your return is in transmitted status. If you want to update your imported k1 data then please unlock your return and save your data.you need to transmit your return again. ';
					deffered.reject({ message: message, title: 'Transmitted Return' });
				}
			}
			return deffered.promise;
		}

		/**
		 * function will add respected k1 forms if user choose to import k1-data, while creating a return.
		 * we will add interval here to wait while downloading all forms.
		 */
		var _addImportedK1Forms = function (data) {
			_checkEfileStatusAndLockForK1Import().then(function (result) {
				var interval = $interval(function () {
					var formToAdd = service.getSingleAvailableForm('dSchK1ET');
					if (!_.isUndefined(formToAdd) && !_.isEmpty(formToAdd)) {
						$interval.cancel(interval);
						addAndUpdateK1Forms(data, function (result) {
						});
					}
				}, 100);
			}, function (errorMessage) {
				var dialogConfig = { "title": errorMessage.title, "text": errorMessage.message };
				var dialog = dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
			})
		}

		/**
		 * 
		 */
		var addAndUpdateK1Forms = function (data, callback) {
			if (data.length > 0) {
				var obj = data.shift();
				if (obj.isUpdated === true) {
					if (obj.packageName === '1041') {
						service.getCurrentForms('dSchK1ET').then(function (forms) {
							for (var i = 0; i < forms.length; i++) {
								var val = service.getElementValue("ReturnId", forms[i].docName, forms[i].docIndex);
								if (val == (obj.returnId + obj.ssn)) {
									_updateImportedK1Data(forms[i], obj);
									_updateImportedK1DataFromStatement(forms[i], obj);
									break;
								}
							}
							addAndUpdateK1Forms(data, callback);
						})
					} else if (obj.packageName === '1065' || obj.packageName === '1120s') {
						service.getCurrentForms('dSchK1PS').then(function (forms) {
							for (var i = 0; i < forms.length; i++) {
								var val = service.getElementValue("ReturnId", forms[i].docName, forms[i].docIndex);
								if (val == (obj.returnId + obj.ssn)) {
									_updateImportedK1Data(forms[i], obj);
									_updateImportedK1DataFromStatement(forms[i], obj);
									break;
								}
							}
							addAndUpdateK1Forms(data, callback);
						})
					}
				}
				else {
					if (obj.packageName === '1041') {
						service.getCurrentForms('dSchK1ET').then(function (forms) {
							var alreadyAdded = false;
							for (var i = 0; i < forms.length; i++) {
								var val = service.getElementValue("ReturnId", forms[i].docName, forms[i].docIndex);
								if (val == (obj.returnId + obj.ssn)) {
									alreadyAdded = true;
									break;
								}
							}
							if (alreadyAdded === false) {
								var formToAdd = service.getSingleAvailableForm('dSchK1ET');
								service.addForm(formToAdd).then(function (formAdded) {
									_postTaxFieldChange({ fieldName: formAdded.docName + ".ReturnId", index: formAdded.docIndex, newVal: obj.returnId + obj.ssn });
									_updateImportedK1Data(formAdded, obj);
									_updateImportedK1DataFromStatement(formAdded, obj);
									addAndUpdateK1Forms(data, callback);
								});
							} else {
								addAndUpdateK1Forms(data, callback);
							}
						})
					} else if (obj.packageName === '1065' || obj.packageName === '1120s') {
						service.getCurrentForms('dSchK1PS').then(function (forms) {
							var alreadyAdded = false;
							for (var i = 0; i < forms.length; i++) {
								var val = service.getElementValue("ReturnId", forms[i].docName, forms[i].docIndex);
								if (val == (obj.returnId + obj.ssn)) {
									alreadyAdded = true;
									break;
								}
							}
							if (alreadyAdded === false) {
								var formToAdd = service.getSingleAvailableForm('dSchK1PS');
								service.addForm(formToAdd).then(function (formAdded) {
									_postTaxFieldChange({ fieldName: formAdded.docName + ".ReturnId", index: formAdded.docIndex, newVal: obj.returnId + obj.ssn });
									_updateImportedK1Data(formAdded, obj);
									_updateImportedK1DataFromStatement(formAdded, obj);
									addAndUpdateK1Forms(data, callback);
								});
							} else {
								addAndUpdateK1Forms(data, callback);
							}
						})
					}
				}
			}
			else {
				callback(true);
			}
		}

		/**
		 * this function will add imported schedule k1's data to respected added form.
		 * @param formAdded	
		 * 			contains {object} of added form.
		 * @param importedData
		 * 			contains data of imported schedule k1.
		 */
		var _updateImportedK1Data = function (formAdded, importedData) {
			var mappingData = systemConfig.getK1MappingData(importedData.packageName);
			var keys = _.keys(_taxReturn.docs.dMainInfo);

			// for package 1065 or 1120s we also need to select entity type dropdown.
			if (importedData.packageName === '1065') {
				_postTaxFieldChange({ fieldName: formAdded.docName + ".fieldlv", index: formAdded.docIndex, newVal: 'P' });
			} else if (importedData.packageName === '1120s') {
				_postTaxFieldChange({ fieldName: formAdded.docName + ".fieldlv", index: formAdded.docIndex, newVal: 'S' });
			}

			// if spouse ssn than change the value of TPSP dropdown to spouse.
			if (_taxReturn.docs.dMainInfo[keys[0]].strspssn) {
				if (importedData.ssn === _taxReturn.docs.dMainInfo[keys[0]].strspssn.value) {
					_postTaxFieldChange({ fieldName: formAdded.docName + ".TPSP", index: formAdded.docIndex, newVal: 'Spouse' });
				}
			}

			_.forEach(Object.keys(importedData.data), function (key) {
				if (!_.isUndefined(mappingData[key]) && !_.isUndefined(importedData.data[key]['value'])) {
					_postTaxFieldChange({ fieldName: formAdded.docName + "." + mappingData[key], index: formAdded.docIndex, newVal: importedData.data[key]['value'] });
				}
			})
		}

		/**
		 * this function will update the imported k1PS or k1ET data that comes from statements data of imported return.
		 * also removed the deleted data.
		 * @param formAdded
		 * 			contains {object} of added form.
		 * @param importedData
		 * 			contains data of imported schedule k1.
		 */
		var _updateImportedK1DataFromStatement = function (formAdded, importedData) {
			var mappingData = systemConfig.getK1StatementsMapping(importedData.packageName);
			_.forEach(Object.keys(mappingData), function (key) {
				if (!_.isUndefined(importedData.statementData[key])) {

					_.forEach(mappingData[key], function (doc) {

						var newValue;
						_.forEach(Object.keys(importedData.statementData[key]), function (index) {
							if (importedData.statementData[key][index][doc.name]['value'] && importedData.statementData[key][index][doc.value]['value']) {
								if (importedData.statementData[key][index][doc.name]['value'] == doc['property']) {
									if (_.isUndefined(newValue)) {
										newValue = 0;
									}
									newValue += parseInt(importedData.statementData[key][index][doc.value]['value']);
								}
							}
						})
						if (!_.isUndefined(newValue)) {
							_postTaxFieldChange({ fieldName: formAdded.docName + "." + doc.element, index: formAdded.docIndex, newVal: newValue });
						} else {
							_postTaxFieldChange({ fieldName: formAdded.docName + "." + doc.element, index: formAdded.docIndex, newVal: '' });
						}
					})
				} else {
					// we do this if user deletes one of the statements data and reopen indiuvidual return than we also had to remove imported data of removed statement.
					// so, here we cant have any record that the statement is deleted & we have to remove imported data.
					// so, we simply empty all textfield data related to statement that is not imported.
					_.forEach(mappingData[key], function (doc) {
						_postTaxFieldChange({ fieldName: formAdded.docName + "." + doc.element, index: formAdded.docIndex, newVal: '' });
					});
				}
			})
		}

		/**
		 * function will remove k1 records from existing imported k1 records.
		 * when use delete k1PS or k1ET form that has beem imported from other return.
		 */
		service.removeImportedK1Data = function (returnId) {
			for (var i = 0; i < _importedK1Data.length; i++) {
				if ((_importedK1Data[i]['returnId'] + _importedK1Data[i]['ssn']) == returnId) {
					_importedK1Data.splice(i, 1);
				}
			}
		}

		/**
		 * function will call return api service function that return the list of k1 data related to ssn.
		 * this function is called by return controller when user choose to import k1 data from tools menu.
		 */
		service.getK1Data = function () {
			var deffered = $q.defer();
			var ssn = [_taxReturn.header.client.ssn];
			var keys = _.keys(_taxReturn.docs.dMainInfo);
			// if spouse ssn exists than we also pass this to get data of spouse ssn too.
			if (_taxReturn.docs.dMainInfo[keys[0]].strspssn.value) {
				ssn.push(_taxReturn.docs.dMainInfo[keys[0]].strspssn.value);
			}
			returnAPIService.getListOfK1Data(ssn).then(function (data) {
				deffered.resolve({ 'k1Data': data, 'importedK1Data': _importedK1Data, 'ssn': ssn });
			}, function (error) {
				console.log(error);
				console.log("Error while getting k1 data from location");
				deffered.reject(error);
			})
			return deffered.promise;
		}

		/**
		 * this function call the returnAPI function that calls the API to get data of imported k1 from that k1's return doc.
		 */
		service.getK1DataFromReturn = function (importForms) {
			var deffered = $q.defer();
			returnAPIService.getK1DataFromReturn(importForms).then(function (result) {
				deffered.resolve(result);
			}, function (error) {
				deffered.reject(error);
			})
			return deffered.promise;
		}

		/**
		 * this will update records of k1 data.
		 * we will need keep track of imported k1 data.
		 * so, here if user add k1 data from tools than we will add it into the already imported k1 data.
		 */
		service.updateK1Records = function (importedForms) {
			_.forEach(importedForms, function (obj) {

				_importedK1Data.push(obj); // for local record to check.
			});
			// for (var obj of importedForms) {
			// 	_importedK1DataFromTools.push(obj); // to send to save API for update imported k1 records.
			// }
		}

		/**
		 * function prepared to keep the data in syncronised way
		 * it will be called only after the response from the open return is got and _taxReturn variable is populated
		 */
		var _loadReturn = function () {
			var deferred = $q.defer();

			//Multi Year Changes
			//Update tax year in content service.  
			//Invalidate resource (like forms, docs, etc...) if tax year is different (make them empty) 
			//Service/factory is singleton in angular js and only invok once. And we have to refresh taxyear everytime user make changes in taxyear combo. 
			//To avoid listner in content service, we are updating tax year, everytime return is get open. We know that it will update same taxyear everytime but it is
			//more safe and fast then broadcast-reciever. If in future any other service needs to be updated on change of taxyear we should switch to broadcast solution    	
			contentService.refreshTaxYear();

			//Interview Mode Changes
			//Refresh returnMode in content service
			contentService.refreshReturnMode(_returnMode);


			if (!_.isUndefined(_taxReturn)) {
				var packageNames = _taxReturn.header.packageNames;
				//set pacakge name other then 'common'
				_packageName = contentService.setPackageName(packageNames);
				//_packageName = _.without(packageNames,'common')[0];

				if (_packageName === '1040' && taxYear === '2018') {
					service.clientPortalcheck();
				}
				var states = _taxReturn.header.states;

				//step-1 intialize calculation
				_calcWorker.postMessage({ 'msgType': 'init', 'taxReturn': _taxReturn.docs, 'constant': contentService.getcalcConstant(), 'log': false });
				//step-2 load return related content
				_loadPackageContent(packageNames, states).then(function () {
					_getPreviewInfo(_taxReturn.forms, true);
					//For New Return - only
					//Note: Add docs as listed in forms
					_newReturn(_taxReturn).then(function (success) {
						//Check for recalculate (For future use)
						if (!_.isUndefined(_taxReturn.header.isRecalculate) && _taxReturn.header.isRecalculate === true) {
							service.recalcReturn();
							//Make recalculation false to prevent recalculation everytime return open.
							_taxReturn.header.isRecalculate = false;
						}
						var isFullRecalculateNeeded = false;
						//Check if Retun is through conversion.
						//And if yes then call full recalculate to fire every methods for all forms in return.
						if (!_.isUndefined(_taxReturn.header) && !_.isUndefined(_taxReturn.header.isConvertedReturn) && _taxReturn.header.isConvertedReturn == true) {
							//Fire all methods
							isFullRecalculateNeeded = true;

							isConvertedReturn = true

							//set converted return flag as false
							_taxReturn.header.isConvertedReturn = false;
						}

						//Check if Retun is through proforma.
						//And if yes then call full recalculate to fire every methods for all forms in return.
						if (!_.isUndefined(_taxReturn.header) && !_.isUndefined(_taxReturn.header.isProformaReturn) && _taxReturn.header.isProformaReturn == true) {
							//Fire all methods
							isFullRecalculateNeeded = true;

							//set proforma return flag as false
							_taxReturn.header.isProformaReturn = false;
						}

						if (isFullRecalculateNeeded == true) {
							fullReCalculate();
						}

						//Check if Retun is through restore.
						//And if yes then call full recalculate to fire every methods for all forms in return.
						if (!_.isUndefined(_taxReturn.header) && !_.isUndefined(_taxReturn.header.isRestoredReturn) && _taxReturn.header.isRestoredReturn == true) {
							//Note: Earlier we were performing full recalculate and this flag was used to track that only. Now, we have decided not to perform recalculate.
							//In next version, we will ask user through popup about re-calculate.

							//set proforma return flag as false
							_taxReturn.header.isRestoredReturn = false;
						}


						//If it is New Return. success will be 'YES'
						if (success == 'YES') {
							if (_packageName == '1040') {
								_splitReturnOperations(_taxReturn).then(function (response) {
									//Save Return. So in case user has not saved return the whole new return process will not execute next time he/she open this return again.
									/*service.saveReturn().then(function(response){
											deferred.resolve();
										},function(error){
											$log.warn(error);
											deferred.resolve();
										});*/
									deferred.resolve();
								}, function (error) {
									//Save Return. So in case user has not saved return the whole new return process will not execute next time he/she open this return again.
									/*service.saveReturn().then(function(response){
											deferred.resolve();
										},function(error){
											$log.warn(error);
											deferred.resolve();
										});*/
									$log.error(error);
									deferred.resolve();
								});
							} else {
								//If package is not 1040
								// For More return type we need to write conditions here
								deferred.resolve();
							}
						} else {
							//If it is not new return just return to caller
							// For More return type we need to write conditions here
							deferred.resolve();
						};
					}, function (error) {
						$log.error(error);
						deferred.reject(error);
					});

				}, function (reason) {
					$log.warn(reason);
					deferred.resolve();
				});
			}
			else
				deferred.resolve(angular.noop);

			return deferred.promise;
		};

		/**
		 * it saves invoice data state wise
		 * we are summerize data of particular state form
		 */
		var calculatedPriceListData = function (invoiceData) {
			invoiceData.summerizePriceListData = [];
			var bankAppData = [];
			for (var i = 0; i < _taxReturn.header.states.length; i++) {
				if (_taxReturn.header.states[i] == "federal") {
					var formsList = _.filter(invoiceData.priceList, { 'state': 'federal' });
				} else {
					var formsList = _.filter(invoiceData.priceList, { 'state': _taxReturn.header.states[i].toUpperCase() });
				}

				var total = 0;
				var obj = {};
				if (!_.isUndefined(formsList) && formsList.length > 0) {
					for (var j = 0; j < formsList.length; j++) {
						if (formsList[j].docName == "dEPSBankApp" || formsList[j].docName == "dAtlasBankApp" || formsList[j].docName == "dTPGBankApp" || formsList[j].docName == "dRefundAdvantageBankApp") {
							var bankObj = {};
							bankObj.description = formsList[j].displayName + " Tax Return Preparation";
							bankObj.total = formsList[j].charge;
							bankAppData.push(bankObj);
						} else {
							total += formsList[j].charge;
						}
					}
					obj.description = _taxReturn.header.states[i].toUpperCase() + " Tax Return Preparation";
					obj.total = total;
					invoiceData.summerizePriceListData.push(obj);
				}
			}
			for (var i = 0; i < bankAppData.length; i++) {
				invoiceData.summerizePriceListData.push(bankAppData[i]);
			}
		}

		/**
		 * This function will call ReturnAPIService to save return using promise pattern
		 */
		//isAuto is the value passed by controller if their is an automatic save it contains true as a value
		service.saveReturn = function (isAuto) {
			var deferred = $q.defer();

			//save invoice info

			//check whether 'invoice' form exists or not
			if (!_.isUndefined(_taxReturn.docs['dPriceList'])) {
				// this is to pre-fill default priceList
				var invoiceData = _taxReturn.docs['dPriceList'][_.keys(_taxReturn.docs['dPriceList'])[0]]
				calculatedPriceListData(invoiceData);

			}

			//update list of states with their refund
			addStateRefundsInMainInfo();

			//Update Return Mode
			_taxReturn.header.returnMode = _returnMode;
			// if there is importedk1data exists than we also pass this data to save API.
			if (!_.isUndefined(_importedK1Data)) {

				_taxReturn.importedK1Data = _importedK1Data;
			}
			//call to returnAPIService
			returnAPIService.saveReturn(_taxReturn, isAuto).then(function () {
				deferred.resolve('success');
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		/**
		 * This function will be called from return controller on close return to destroy taxReturn object
		 */
		service.closeReturn = function (saveBeforeClose) {
			var deferred = $q.defer();
			//If Save is required then first update state information with refund
			if (saveBeforeClose == true) {
				addStateRefundsInMainInfo();
			}

			returnAPIService.closeReturn(_taxReturn, saveBeforeClose).then(function (success) {
				_taxReturn = null;
				// clear reviewErrors when you close return
				_reviewErrors = [];
				deferred.resolve(success);
			}, function (error) {
				deferred.reject(error);
			});

			return deferred.promise;
		};


		/**
		*This Function will used to open common progress dialog
		**/
		service.openProgressDialog = function (doNotShowDone) {
			//open progress dialog 
			var dialogService = $injector.get('dialogService');
			dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'sm' }, "taxAppJs/common/partials/waitingStatusDialog.html", "waitingStatusDialogController", doNotShowDone);
		}

		/**
		*This function is used to common close dialog
		**/
		service.closeProgressDialog = function () {
			//close dialog
			postal.publish({
				channel: 'MTPO-Return',
				topic: 'ProgressDialogClose',
				data: {}
			});
		}

		service.createEfileTosend = function (selectedState, stateOnly) {
			var deferred = $q.defer();
			//For Federal 
			var refundType = {};
			var docName, docIndex;
			var pkgName = _packageName.toString().toLowerCase();
			var states = [];
			if (!_.isUndefined(_taxReturn.docs)) {
				var federalObject = _.find(selectedState, { 'name': 'federal' })
				if (!_.isUndefined(federalObject)) {
					//for FEDERAL
					var fieldList = contentService.getFedReturnOverViewFields(_packageName, 'federal');
					//Loop through fieldList and check which form is active
					_.forEach(fieldList, function (fields) {
						docName = fields.docName;
						if (!_.isUndefined(_taxReturn.docs[docName])) {
							// to avoid unnecessary operation we take docindex here.
							docIndex = _.keys(_taxReturn.docs[docName])[0];
							if (!_.isUndefined(docIndex) && docIndex != "" && !_.isUndefined(_taxReturn.docs[docName][docIndex].isActive) && _taxReturn.docs[docName][docIndex].isActive.value == true) {
								//refund Type
								if (!_.isUndefined(fields.refundType) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundType])) {
									refundType.federal = _taxReturn.docs[docName][docIndex][fields.refundType].value;
								};
								// end of switch statement
								return false; // break the loop IF any field is not undefined or greater then 0 Else look further.
							}// end of if condition for index
						}
					});
					var prepareObject = {
						state: federalObject.name.toLowerCase(),
						returnType: federalObject.ReturnTypeCode,
						returnTypeDisplayText: federalObject.ReturnTypeDisplayText,
						returnTypeCategory: federalObject.ReturnTypeCategory
					};
					//add original return type if exist
					if (federalObject.originalReturnType != undefined) {
						prepareObject.originalReturnType = federalObject.originalReturnType;
					}
					//add active forms for after accptence display purpose
					prepareObject.activeForms = federalObject.activeForms;
					if (pkgName != '1065') {
						var balanceDue = angular.isDefined(federalObject.fedOwe) === true ? federalObject.fedOwe : 0;
						var refundAmount = 0;
						if (balanceDue == 0) {
							refundAmount = angular.isDefined(federalObject.fedRefund) === true ? federalObject.fedRefund : 0;
						}
						prepareObject.refund = parseInt(refundAmount);
						prepareObject.balanceDue = parseInt(balanceDue),
							prepareObject.refundType = (refundType.federal == true || refundType.federal == false) ? "" : refundType.federal;
					} else {
						var refundAmount = angular.isDefined(federalObject.fedBIS) === true ? parseInt(federalObject.fedBIS) : 0;
					}
					states.push(prepareObject);
				}

				//For State
				_.forEach(selectedState, function (state) {
					docName = "", docIndex = "";
					if (state.name != 'federal') {
						var fieldList = contentService.getStateReturnOverViewFields(_packageName, state.name, state.residencyStatus);
						//Loop through fieldList and check which form is active
						_.forEach(fieldList, function (fields) {
							docName = fields.docName;

							if (!_.isUndefined(_taxReturn.docs[docName])) {
								// to avoid unnecessary operation we take docindex here.
								docIndex = _.keys(_taxReturn.docs[docName])[0];

								//IF we find docIndex then we need to proceed futher else look into other forms.
								// ALSO check whether the doc is active or not.
								if (!_.isUndefined(docIndex) && docIndex != "" && !_.isUndefined(_taxReturn.docs[docName][docIndex].isActive) && _taxReturn.docs[docName][docIndex].isActive.value == true) {
									if (!_.isUndefined(fields) && !_.isUndefined(fields.refundType) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundType])) {
										var refundTypeField = _taxReturn.docs[docName][docIndex][fields.refundType].value;
										if (!_.isUndefined(refundTypeField)) {
											refundType[state.name.toLowerCase()] = (refundTypeField == false || refundTypeField == true) ? "" : refundTypeField;
										}
									}

									return false;
								}
							}
						}); //end of fieldlist loop
						var prepareStateObject = {
							state: state.name.toLowerCase(),
							returnType: state.ReturnTypeCode,
							returnTypeDisplayText: state.ReturnTypeDisplayText,
							returnTypeCategory: state.ReturnTypeCategory
						};
						if (state.originalReturnType != undefined) {
							prepareStateObject.originalReturnType = state.originalReturnType;
						}
						//attached flag if available
						if (state.forceStateOnly != undefined && state.forceStateOnly == true) {
							prepareStateObject.forceStateOnly = true;
						}

						//add active forms for after accptence display purpose
						prepareStateObject.activeForms = state.activeForms;
						var balanceDue = angular.isDefined(state.stateOwe) === true ? state.stateOwe : 0;
						var refund = 0;
						if (balanceDue == 0) {
							refund = angular.isDefined(state.stateRefund) === true ? parseInt(state.stateRefund) : 0;
						}
						// if (state.preAck == true) {
						// 	prepareStateObject.preAck = state.preAck;
						// }
						prepareStateObject.refund = parseInt(refund);
						prepareStateObject.balanceDue = parseInt(balanceDue),
							prepareStateObject.refundType = refundType[state.name.toLowerCase()];
						states.push(prepareStateObject);

					}
				}); //end of state loop
				console.log(states);

				returnAPIService.sendEfile(_taxReturn.header.id, states, _packageName, stateOnly).then(function (success) {
					//Set initial efileStatus in header as we have updated status when user re-open this return.
					// if (_.isUndefined(_taxReturn.header.eFileStatus)) {
					// 	_taxReturn.header.eFileStatus = { 'federal': { 'status': 1 } };
					// }
					var userService = $injector.get('userService');
					var _userDetails = userService.getUserDetails();

					//If returnStatus update flag is true
					if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences)
						&& !_.isUndefined(_userDetails.settings.preferences.returnWorkspace) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace.returnStatus) && _userDetails.settings.preferences.returnWorkspace.returnStatus == true) {
						// change status after efle creation 
						_taxReturn.header.status = { id: "default_10", title: "E-File", isPredefined: true };
					}else{
						_taxReturn.header.status = { id: "default_6", title: "Complete", isPredefined: true };
					}


					//call api to get latest updated efileStatus
					service.getUpdatedEfileStatusFromApi();
					deferred.resolve(success);
				}, function (error) {
					deferred.reject(error);
				});

				return deferred.promise;
			}
			return deferred.promise;
		}


		/**
		 *Its check Whether return include any bank aplication or not
		 */

		service.IsReturnIncludesBankApplication = function () {
			var returnInfoDoc = _taxReturn.docs.dReturnInfo[_.keys(_taxReturn.docs.dReturnInfo)[0]];
			//Check if bank product is checked and bank is selected
			if (angular.isDefined(returnInfoDoc.strRefundType) && angular.isDefined(returnInfoDoc.strRefundType.value) && returnInfoDoc.strRefundType.value == '1' &&
				angular.isDefined(returnInfoDoc.strbank) && angular.isDefined(returnInfoDoc.strbank.value) && (returnInfoDoc.strbank.value.toLowerCase() == 'navigator' || returnInfoDoc.strbank.value.toLowerCase() == 'atlas' || returnInfoDoc.strbank.value.toLowerCase() == 'eps' || returnInfoDoc.strbank.value.toLowerCase() == 'refundadvantage' || returnInfoDoc.strbank.value.toLowerCase() == 'tpg' || returnInfoDoc.strbank.value.toLowerCase() == 'redbird')) {
				return true;
			}

			//Check If Protection Plus checkbox is tick and protection plus enrollment done
			//Exception: IF Bank is EPS then we do not have to make E-File for Protection Plus bank.      
			var bankProductsService = $injector.get('bankProductsService');
			if (bankProductsService.getProtectionPlusStatus() == true && returnInfoDoc.ProtectionPlusChk != undefined && returnInfoDoc.ProtectionPlusChk.value == true
				&& returnInfoDoc.strbank != undefined && returnInfoDoc.strbank.value != undefined && returnInfoDoc.strbank.value.toString().toLowerCase() != 'eps') {
				return true;
			}

			return false;
		}

		/**
		 * check is  protection plus checkbox is checked or not
		 */
		service.isProtctionPlusAvailable = function () {
			var returnInfoDoc = _taxReturn.docs.dReturnInfo[_.keys(_taxReturn.docs.dReturnInfo)[0]];
			//Check If Protection Plus checkbox is tick and protection plus enrollment done
			//Exception: IF Bank is EPS then we do not have to make E-File for Protection Plus bank.      
			var bankProductsService = $injector.get('bankProductsService');
			if (bankProductsService.getProtectionPlusStatus() == true && returnInfoDoc.ProtectionPlusChk != undefined && returnInfoDoc.ProtectionPlusChk.value == true
				&& returnInfoDoc.strbank != undefined && returnInfoDoc.strbank.value != undefined) { //returnInfoDoc.strbank.value.toString().toLowerCase() != 'eps'  // eps condition remove for protection plus need to ask
				return true;
			}

			return false;
		}


		/**
		 * Function to print single form
		 * form - form object
		 * type - PrintSingleForm or printBlankForm
		 */
		service.printForm = function (form, printingType, bankType, waterMark, pdfPasswordDetails, isInBrowser) {
			var deffered = $q.defer();

			// Change for new Bank
			// Condition to check docName defined or not and docName equals to bank form
			if (!_.isUndefined(form.docName) && (_bankAgreementPrintConfig[form.docName] != undefined) && printingType != 'printBlankForm') {
				var formData = [];
				var formIndexes = [];
				// Form properties add to formData 
				formData.push(_getFormProp(form.formName));
				// docIndex add to formIndexes
				formIndexes.push(form.docIndex);
				// Assigning the printing Type 'printSelectedForms' to printingType for printing selected forms 
				printingType = 'printSelectedForms';
				// Function to call for printing multiple forms 
				service.printMultipleForms(formData, formIndexes, printingType, waterMark, pdfPasswordDetails).then(function (response) {
					deffered.resolve(response);
				}, function (error) {
					deffered.resolve();
				});
			} else {
				//Get form properties
				var formProp = contentService.getFormProp(form.formName);
				//Get File name for printing
				var _fileName = getFileNameForPrinting(printingType, formProp.displayName);

				//Inject userService & get location id to retrieve printing file
				//Note: As this function is rarely used, it is good to inject service runtime instead as dependecy injection
				var userService = $injector.get('userService');
				var _locationId = userService.getLocationId();

				//Check if form is Client letter and if it is then pass customLetter id if selected by user
				var customTemplate = "";
				if (form.docName == 'dCustomLetter' && !_.isUndefined(_taxReturn.docs.dCustomLetter[form.docIndex].selectCustmLetter) && !_.isUndefined(_taxReturn.docs.dCustomLetter[form.docIndex].selectCustmLetter.value)) {
					customTemplate = _taxReturn.docs.dCustomLetter[form.docIndex].selectCustmLetter.value;
				}
				var ltaxYear =  userService.getTaxYear()
				if(isInBrowser && _betaOnly() && parseInt(ltaxYear) > 2018) {
					var locationData;
					officeService.getLocation(_locationId).then(function (response) {
						if (!_.isUndefined(response)) {
							locationData = response;
	
						}
						//Call to print post api
						var data = {
							printingType: printingType,
							returnId: _taxReturn.header.id,
							fileName: _fileName,
							docList: [parseInt(form.docIndex)],
							formPropList: [formProp],
							packageName: formProp.packageName,
							state: formProp.state,
							isState: formProp.state == 'federal' ? false : true,
							locationData: _locationId,
							customTemplate: customTemplate,
							isPasswordProtectedPDF: pdfPasswordDetails.isPasswordProtectedPDF,
							waterMark: waterMark,
							pdfCustomPassword: pdfPasswordDetails.customPassword,
							deviceInformation: utilityService.getDeviceInformation(),
							currentDate: new Date(),
							locationDetails: locationData ? locationData : undefined
						}
						var taxReturn = service.getTaxReturn();
						// service.getUpdatedEfileStatusFromApi().then(function(){
						service.getSubmissionIds(data.returnId).then(function (submissionIdsObj) {
							taxReturn.submissionIds = submissionIdsObj;
							createSubmissionIds(data, taxReturn);
							groupFormListHandler(data.formPropList, data.docList)
							savePrintConfigurationService.setSelectedPreviewInfo(angular.copy(contentService.getselectedPreviewInfo(data.formPropList)))
							printingEngineService.printMultipleForms(data).then(function (response) {
								deffered.resolve(response);
							}, function (error) {
								$log.error(error);
								deffered.reject(error);
							});
						}, function (error) {
							$log.error(error);
						});
					});
				} else {
					//Call to print post api
					$http({
						method: 'POST',
						url: dataAPI.base_url + '/print/printReturn',
						data: {
							printingType: printingType,
							returnId: _taxReturn.header.id,
							fileName: _fileName,
							docIndex: parseInt(form.docIndex),
							formProp: formProp,
							packageName: formProp.packageName,
							state: formProp.state,
							isState: formProp.state == 'federal' ? false : true,
							bankType: bankType,
							locationData: _locationId,
							customTemplate: customTemplate,
							isPasswordProtectedPDF: pdfPasswordDetails.isPasswordProtectedPDF,
							waterMark: waterMark,
							pdfCustomPassword: pdfPasswordDetails.customPassword,
							deviceInformation: utilityService.getDeviceInformation(),
							currentDate: new Date()
						}
					}).then(function (response) {
						if (!_.isUndefined(response) && !_.isUndefined(response.data) && !_.isUndefined(response.data.data) && !_.isUndefined(response.data.data.key)) {
							//Return with url for get API. so return controller can invoke $window.open
							deffered.resolve(dataAPI.base_url + "/print/getFile?key=" + response.data.data.key + "&locationId=" + _locationId);
						} else {
							//As there is no data in response, No sense to make next api call, for us, it is error 
							deffered.resolve();
						}
					}, function (error) {
						$log.error();
						//Post api is in erro so, there is no need to download pdf
						deffered.reject();
					});
				}
			}
			return deffered.promise;
		};

		service.getSelectedBankData = function () {
			var returnInfoDoc = _taxReturn.docs.dReturnInfo[_.keys(_taxReturn.docs.dReturnInfo)[0]];
			//Check if bank product is checked and atlas bank selected
			if (angular.isDefined(returnInfoDoc.strRefundType) && angular.isDefined(returnInfoDoc.strRefundType.value) && returnInfoDoc.strRefundType.value == '1' &&
				angular.isDefined(returnInfoDoc.strbank) && angular.isDefined(returnInfoDoc.strbank.value) && (returnInfoDoc.strbank.value.toLowerCase() == 'navigator' || returnInfoDoc.strbank.value.toLowerCase() == 'atlas' || returnInfoDoc.strbank.value.toLowerCase() == 'eps' || returnInfoDoc.strbank.value.toLowerCase() == 'refundadvantage' || returnInfoDoc.strbank.value.toLowerCase() == 'tpg' || returnInfoDoc.strbank.value.toLowerCase() == 'redbird')) {
				return { name: returnInfoDoc.strbank.value.toLowerCase(), refund: 0 }
			}
		}

		/**
		 * Temporary method for OR Barcode printing
		 */
		service.printBarcodeReturn = function (formPropList, docIndexes, printingType, set, state, waterMark, pdfPasswordDetails) {
			var deffered = $q.defer();
			//Get File name for printing
			var _fileName = getFileNameForPrinting(printingType);

			//Inject userService & get location id to retrieve printing file
			//Note: As this function is rarely used, it is good to inject service runtime instead as dependecy injection
			var userService = $injector.get('userService');
			var _locationId = userService.getLocationId();

			//Check if Client letter is exist and if it is then pass customLetter id if selected by user
			var customTemplate = "";
			if (_.find(formPropList, { docName: 'dCustomLetter' }) != undefined) {
				var docIdForCustomLetter = _.keys(_taxReturn.docs.dCustomLetter)[0];
				if (!_.isUndefined(_taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter) && !_.isUndefined(_taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter.value)) {
					customTemplate = _taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter.value;
				}
			}

			//Call to print post api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/print/printReturn',
				data: {
					'printingType': printingType,
					returnId: _taxReturn.header.id,
					fileName: set,
					docList: docIndexes,
					formPropList: formPropList,
					packageName: _packageName,
					state: state,
					isState: false,
					locationData: _locationId,
					customTemplate: customTemplate,
					printingSet: set,
					isPasswordProtectedPDF: pdfPasswordDetails.isPasswordProtectedPDF,
					waterMark: waterMark,
					pdfCustomPassword: pdfPasswordDetails.customPassword,
					deviceInformation: utilityService.getDeviceInformation(),
					currentDate: new Date()
				}
			}).then(function (response) {
				if (!_.isUndefined(response) && !_.isUndefined(response.data) && !_.isUndefined(response.data.data) && !_.isUndefined(response.data.data.key)) {
					//Return with url for get API. so return controller can invoke $window.open
					deffered.resolve(dataAPI.base_url + "/print/getFile?key=" + response.data.data.key + "&locationId=" + _locationId);
				} else {
					//As there is no data in response, No sense to make next api call, for us, it is error 
					deffered.resolve();
				}
			}, function (error) {
				$log.error();
				//Post api is in erro so, there is no need to download pdf
				deffered.reject();
			});

			return deffered.promise;
		};

		/**
		 * Function to print bank agreement forms base on condition
		 * */
		var _bankAgreementFormPrint = function (formPropList, docIndexes) {
			// Loop to get particular bank form object from formPropList 
			_.forEach(formPropList, function (formObject) {
				// Change for new Bank
				// Condition to check whether docName is defined or not and docName equals to bank form or not
				if (!_.isUndefined(formObject.docName) && (_bankAgreementPrintConfig[formObject.docName] != undefined)) {
					// Loop to get bank agreement printing config and key form _bankAgreementPrintConfig variable
					//_.forEach(_bankAgreementPrintConfig, function (obj, key) {
					var obj = _bankAgreementPrintConfig[formObject.docName];
					var bankFormPropList = [];
					// Loop to get all printing config for single key 
					_.forEach(obj, function (prop) {
						// Condition to check form value is equals to expected value from _bankAgreementPrintConfig 
						if (!_.isUndefined(_taxReturn.docs[formObject.docName]) && !_.isUndefined(_taxReturn.docs[formObject.docName][_.keys(_taxReturn.docs[formObject.docName])]) && !_.isUndefined(_taxReturn.docs[formObject.docName][_.keys(_taxReturn.docs[formObject.docName])][prop.element]) && !_.isUndefined(_taxReturn.docs[formObject.docName][_.keys(_taxReturn.docs[formObject.docName])][prop.element].value) && _taxReturn.docs[formObject.docName][_.keys(_taxReturn.docs[formObject.docName])][prop.element].value == prop.expectedValue) {
							// Variable use to store bank data
							var bankData = {
								canDelete: false,
								category: "Other",
								description: prop.description,
								displayName: prop.displayName,
								docName: prop.docName,
								formBelongsToPackages: "1040",
								formName: prop.formName,
								id: formObject.id,
								isDefault: false,
								isHiddenForm: false,
								isMultiAllowed: false,
								maxOccurs: "1",
								packageName: "1040",
								parentID: "0",
								state: "federal",
								status: "Final",
								type: "Frm",
								updatedDate: "2015-12-29 11:19:09.82"
							};
							//Add form to list
							bankFormPropList.push(bankData);

						}
					});
					//Add the bank list to formPropList
					if (bankFormPropList.length > 0) {
						//current index of bank's base form
						var _indexOfBaseForm = _.findIndex(formPropList, { docName: formObject.docName }) + 1;
						for (var index in bankFormPropList) {
							//Add form to formPropList
							formPropList.splice(_indexOfBaseForm, 0, bankFormPropList[index]);
							// Add the index to docIndexes 
							docIndexes.splice(_indexOfBaseForm, 0, parseInt(_.keys(_taxReturn.docs[formObject.docName])[0]));

							//increment _indexOfBaseForm
							_indexOfBaseForm++;
						}
					}

					//});
				}
			});


		};

		/**
		 * Function to print passed forms (list of forms)
		 * Common function to print selecteDforms or completeReturns (all forms)
		 * Note: Currently we are passing list of docName but we have to pass list of forms and then print engine have to use that data to decide which forms belongs to state or not and other things
		 */
		service.printMultipleForms = function (formPropList, docIndexes, printingType, waterMark, pdfPasswordDetails, maskSensitiveInfo, signatureRequired, refundSectionData, isInBrowser) {
			var deffered = $q.defer();

			//Function to print bank agreement forms base on condition
			_bankAgreementFormPrint(formPropList, docIndexes);

			//Get File name for printing
			var _fileName = getFileNameForPrinting(printingType);

			//Inject userService & get location id to retrieve printing file
			//Note: As this function is rarely used, it is good to inject service runtime instead as dependecy injection
			var userService = $injector.get('userService');
			var _locationId = userService.getLocationId();

			//Check if Client letter is exist and if it is then pass customLetter id if selected by user
			var customTemplate = "";
			if (_.find(formPropList, { docName: 'dCustomLetter' }) != undefined) {
				var docIdForCustomLetter = _.keys(_taxReturn.docs.dCustomLetter)[0];
				if (!_.isUndefined(_taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter) && !_.isUndefined(_taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter.value)) {
					customTemplate = _taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter.value;
				}
			}

			var formList = [];
			var docIndexList = [];
			if (taxYear == '2017' || taxYear == '2018') {
				for (var i = 0; i < formPropList.length; i++) {
					if (formPropList[i].docName != undefined && formPropList[i].docName !== 'dTPGBankApp') {
						formList.push(formPropList[i]);
						docIndexList.push(docIndexes[i]);
					}
				}
			} else {
				formList = formPropList;
				docIndexList = docIndexes;
			}
			var formList = [];
			var docIndexList = [];
			if (taxYear == '2018') {
				for (var i = 0; i < formPropList.length; i++) {
					if (formPropList[i].docName != undefined && formPropList[i].docName !== 'dAtlasBankApp') {
						formList.push(formPropList[i]);
						docIndexList.push(docIndexes[i]);
					}
				}

			} else {
				formList = formPropList;
				docIndexList = docIndexes;
			}


			// var index = 2;
			// //add consenset to use and consent to disclose
			// if (parseInt(taxYear) >= 2017 && _packageName == '1040') {
			// 	for (var i = 0; i < consentConfig.length; i++) {
			// 		formList.push({
			// 			canDelete: false,
			// 			category: "Federal",
			// 			description: consentConfig[i].description,
			// 			displayName: consentConfig[i].displayName,
			// 			docName: consentConfig[i].docName,
			// 			formBelongsToPackages: "common",
			// 			formName: consentConfig[i].formName,
			// 			id: consentConfig[i].id,
			// 			isDefault: false,
			// 			isHiddenForm: false,
			// 			isMultiAllowed: false,
			// 			maxOccurs: "1",
			// 			packageName: "common",
			// 			parentID: "0",
			// 			state: "federal",
			// 			status: "Final",
			// 			type: "Frm",
			// 			updatedDate: "2015-12-29 11:19:09.82"
			// 		});
			// 		docIndexList.push(_taxReturn.docs.count + index);
			// 		index += 2;
			// 	}
			// }
			var ltaxYear =  userService.getTaxYear()
			if(isInBrowser && _betaOnly() && parseInt(ltaxYear) > 2018) {
				var locationData;
				officeService.getLocation(_locationId).then(function (response) {
					if (!_.isUndefined(response)) {
						locationData = response;

					}
					//Call to print post api
					var data = {
						'printingType': printingType,
						returnId: _taxReturn.header.id,
						fileName: _fileName,
						docList: docIndexList,
						formPropList: formList,
						packageName: _packageName,
						state: 'federal',
						isState: false,
						locationData: _locationId,
						customTemplate: customTemplate,
						isPasswordProtectedPDF: pdfPasswordDetails.isPasswordProtectedPDF,
						waterMark: waterMark,
						pdfCustomPassword: pdfPasswordDetails.customPassword,
						maskSensitiveInfo: maskSensitiveInfo,
						signatureRequired: signatureRequired,
						deviceInformation: utilityService.getDeviceInformation(),
						refundSectionData: refundSectionData,
						currentDate: new Date(),
						locationDetails: locationData ? locationData : undefined
					}
					var taxReturn = service.getTaxReturn();
					// service.getUpdatedEfileStatusFromApi().then(function(){
					service.getSubmissionIds(data.returnId).then(function (submissionIdsObj) {
						taxReturn.submissionIds = submissionIdsObj;
						createSubmissionIds(data, taxReturn);
						groupFormListHandler(data.formPropList, data.docList)
						savePrintConfigurationService.setSelectedPreviewInfo(angular.copy(contentService.getselectedPreviewInfo(data.formPropList)))
						printingEngineService.printMultipleForms(data).then(function (response) {
							deffered.resolve(response);
						}, function (error) {
							$log.error(error);
							deffered.reject(error);
						});
					}, function (error) {
						$log.error(error);
					});
				});
			} else {
				//Call to print post api
				$http({
					method: 'POST',
					url: dataAPI.base_url + '/print/printReturn',
					data: {
						'printingType': printingType,
						returnId: _taxReturn.header.id,
						fileName: _fileName,
						docList: docIndexList,
						formPropList: formList,
						packageName: _packageName,
						state: 'federal',
						isState: false,
						locationData: _locationId,
						customTemplate: customTemplate,
						isPasswordProtectedPDF: pdfPasswordDetails.isPasswordProtectedPDF,
						waterMark: waterMark,
						pdfCustomPassword: pdfPasswordDetails.customPassword,
						maskSensitiveInfo: maskSensitiveInfo,
						signatureRequired: signatureRequired,
						deviceInformation: utilityService.getDeviceInformation(),
						refundSectionData: refundSectionData,
						currentDate: new Date()
					}
				}).then(function (response) {
					if (!_.isUndefined(response) && !_.isUndefined(response.data) && !_.isUndefined(response.data.data) && !_.isUndefined(response.data.data.key)) {
						var formUrl = dataAPI.base_url + "/print/getFile?key=" + response.data.data.key + "&locationId=" + _locationId;
						//Return with url for get API. so return controller can invoke $window.open
						deffered.resolve(formUrl);
					} else {
						//As there is no data in response, No sense to make next api call, for us, it is error 
						deffered.resolve();
					}
				}, function (error) {
					$log.error();
					//Post api is in erro so, there is no need to download pdf
					deffered.reject();
				});
			}
			return deffered.promise;
		};

		/**
		 * Function to print passed forms (list of forms)
		 * Common function to print selecteDforms or completeReturns (all forms)
		 * Note: Currently we are passing list of docName but we have to pass list of forms and then print engine have to use that data to decide which forms belongs to state or not and other things
		 */
		service.printedFormsLink = function (formPropList, docIndexes, printingType, waterMark, pdfPasswordDetails, maskSensitiveInfo, signatureRequired, refundSectionData, stateForms, paperOnly) {
			var deffered = $q.defer();

			//Function to print bank agreement forms base on condition
			_bankAgreementFormPrint(formPropList, docIndexes);

			//Get File name for printing
			var _fileName = getFileNameForPrinting(printingType);

			//Inject userService & get location id to retrieve printing file
			//Note: As this function is rarely used, it is good to inject service runtime instead as dependecy injection
			var userService = $injector.get('userService');
			var _locationId = userService.getLocationId();

			//Check if Client letter is exist and if it is then pass customLetter id if selected by user
			var customTemplate = "";
			if (_.find(formPropList, { docName: 'dCustomLetter' }) != undefined) {
				var docIdForCustomLetter = _.keys(_taxReturn.docs.dCustomLetter)[0];
				if (!_.isUndefined(_taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter) && !_.isUndefined(_taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter.value)) {
					customTemplate = _taxReturn.docs.dCustomLetter[docIdForCustomLetter].selectCustmLetter.value;
				}
			}

			var formList = [];
			var docIndexList = [];
			if (taxYear == '2017' || taxYear == '2018') {
				for (var i = 0; i < formPropList.length; i++) {
					if (formPropList[i].docName != undefined && formPropList[i].docName !== 'dTPGBankApp') {
						formList.push(formPropList[i]);
						docIndexList.push(docIndexes[i]);
					}
				}
			} else {
				formList = formPropList;
				docIndexList = docIndexes;
			}
			var formList = [];
			var docIndexList = [];
			if (taxYear == '2018') {
				for (var i = 0; i < formPropList.length; i++) {
					if (formPropList[i].docName != undefined && formPropList[i].docName !== 'dAtlasBankApp') {
						formList.push(formPropList[i]);
						docIndexList.push(docIndexes[i]);
					}
				}

			} else {
				formList = formPropList;
				docIndexList = docIndexes;
			}
			//Call to print post api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/clientPortal/signature/getPdfLink',
				data: {
					'printingType': printingType,
					returnId: _taxReturn.header.id,
					fileName: _fileName,
					docList: docIndexList,
					formPropList: formList,
					packageName: _packageName,
					state: 'federal',
					isState: false,
					locationData: _locationId,
					customTemplate: customTemplate,
					isPasswordProtectedPDF: pdfPasswordDetails.isPasswordProtectedPDF,
					waterMark: waterMark,
					pdfCustomPassword: pdfPasswordDetails.customPassword,
					maskSensitiveInfo: maskSensitiveInfo,
					signatureRequired: signatureRequired,
					deviceInformation: utilityService.getDeviceInformation(),
					refundSectionData: refundSectionData,
					stateForms: stateForms,
					paperOnly: paperOnly
				}
			}).then(function (response) {
				if (!_.isUndefined(response) && !_.isUndefined(response.data) && !_.isUndefined(response.data.data) && !_.isUndefined(response.data.data.key)) {
					deffered.resolve(response.data.data);
				} else {
					//As there is no data in response, No sense to make next api call, for us, it is error 
					deffered.resolve();
				}
			}, function (error) {
				$log.error();
				//Post api is in erro so, there is no need to download pdf
				deffered.reject();
			});

			return deffered.promise;
		};

		 var groupFormListHandler = function (formPropertyList, docIndexes) {
			var parentForm = [];
			var removeForm = [];
			if (formPropertyList) {
				for (var index = 0; index < formPropertyList.length; index++) {
					if (formPropertyList[index] && formPropertyList[index].groupFormList) {
						removeForm.push(formPropertyList[index].docName);
						parentForm.push(formPropertyList[index].groupFormList);
						formPropertyList[index] = [];
					}
				}
				for (var i=0; i < removeForm.length; i++) {
					if(_taxReturn.docs[removeForm[i]]) {
						var removeDocIndex = Object.keys(_taxReturn.docs[removeForm[i]])[0];
						var parentDocIndex = Object.keys(_taxReturn.docs[parentForm[i]])[0];
						var indexIndocList = docIndexes.indexOf(parseInt(removeDocIndex));
						if(docIndexes.indexOf(parentDocIndex) === -1) {
							docIndexes[indexIndocList] = parseInt(parentDocIndex);
							formPropertyList.push(contentService.getForm(parentForm[i]));
						} else {
							docIndexes.splice(indexIndocList, 1)
						}
					}
				}
			}
		};

		var create = function (efin) {
			var date = new Date();
			var staticValue = 33;
			var EFIN = '' + pad(efin, 6);
			var year = '' + date.getFullYear();
			var day = '' + pad(getDay(date) + '', 3);
			var customStr = Math.random().toString(36).substring(2, 9);
			var submissionid = EFIN + year + day + customStr;
			return submissionid;
		}

		var pad = function (str, max) {
			str = str.toString();
			return str.length < max ? pad('0' + str, max) : str;
		}

		var getDay = function (date) {
			var now = date;
			var start = new Date(now.getFullYear(), 0, 0);
			var diff = now - start;
			var oneDay = 1000 * 60 * 60 * 24;
			var day = Math.floor(diff / oneDay);
			return day;
		}
		var createSubmissionIds = function (infoForPrint, taxReturn) {
			var printingType = infoForPrint.printingType;
			var eFileStatus = service.getEfileStatus();
			var aSingleForm = infoForPrint;
			if (infoForPrint.locationDetails) {
				var aLocationDoc = infoForPrint.locationDetails;
				aSingleForm.locationData = aLocationDoc;
				aSingleForm.locationData.deviceId = infoForPrint.deviceInformation.deviceId;
				aSingleForm.locationData.iptimestemp = infoForPrint.deviceInformation.systemTs;
				aSingleForm.locationData.currentDate = infoForPrint.currentDate;
				// aSingleForm.locationData.ip = common.correctIpAddress(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
				if (taxReturn) {
					aSingleForm.jsonData = taxReturn;
					if (eFileStatus) {
						// Send efileStatus in print return
						aSingleForm.eFileStatus = eFileStatus;
					}
					var isSaveSubmissionId = false;
					var generatedSubmissionId = {};
					if (taxReturn.header && taxReturn.header.states) {
						var states = taxReturn.header.states;
						for (var sIndex in states) {
							if (eFileStatus && eFileStatus[states[sIndex]]) {
								var subTypeForEfile = eFileStatus[states[sIndex]];
								//   var stateArray = _.keys(subTypeForEfile);
								var stateArray = Object.keys(subTypeForEfile);
								if (stateArray.length > 0) {
									for (var i in stateArray) {
										if (subTypeForEfile[stateArray[i]].submissionId && subTypeForEfile[stateArray[i]].submissionId !== '') {
											aSingleForm.submissionIds = aSingleForm.submissionIds || {};
											var category = subTypeForEfile[stateArray[i]].returnTypeCategory;
											aSingleForm.submissionIds[states[sIndex]] = aSingleForm.submissionIds[states[sIndex]] || {};
											aSingleForm.submissionIds[states[sIndex]][category] = subTypeForEfile[stateArray[i]].submissionId;
										} else {
											if (taxReturn.submissionIds !== undefined && taxReturn.submissionIds[states[sIndex]] && taxReturn.submissionIds[states[sIndex]].MainForm && taxReturn.submissionIds[states[sIndex]].MainForm.length > 0) {
												var submId = {};
												submId[states[sIndex]] = { "MainForm": taxReturn.submissionIds[states[sIndex]].MainForm[0] };
												aSingleForm.submissionIds = Object.assign(aSingleForm.submissionIds || {}, submId);
											} else {
												aSingleForm.submissionIds = aSingleForm.submissionIds || {};
												aSingleForm.submissionIds[states[sIndex]] = { "MainForm": "" };
											}
										}
									}
								}
								//console.log(">>>>>>>>>>"+aSingleForm.submissionIds[states[sIndex]]);
							} else {
								var submissionId = {};
								if (taxReturn.submissionIds !== undefined && taxReturn.submissionIds[states[sIndex]] && taxReturn.submissionIds[states[sIndex]].MainForm && taxReturn.submissionIds[states[sIndex]].MainForm.length > 0 && ((taxReturn.submissionIds[states[sIndex]].MainForm[0].indexOf(aLocationDoc.efin)) === 0)) {
									// submissionIds[states[sIndex]] = aReturnDoc.submissionIds[states[sIndex]].MainForm[0];
									submissionId[states[sIndex]] = { "MainForm": taxReturn.submissionIds[states[sIndex]].MainForm[0] };
									aSingleForm.submissionIds = Object.assign(aSingleForm.submissionIds || {}, submissionId);
								} else {
									if (aLocationDoc.efin && aLocationDoc.efin !== '') {
										var subId = create(aLocationDoc.efin);
										submissionId[states[sIndex]] = { "MainForm": subId };
										taxReturn.submissionIds = taxReturn.submissionIds || {};
										taxReturn.submissionIds[states[sIndex]] = {};
										taxReturn.submissionIds[states[sIndex]]['MainForm'] = [subId];
										generatedSubmissionId[states[sIndex]] = {};
										generatedSubmissionId[states[sIndex]]['MainForm'] = [subId];
										isSaveSubmissionId = true;
									}
									aSingleForm.submissionIds = Object.assign(aSingleForm.submissionIds || {}, submissionId);
								}
								
								// taxReturn.submissionIds = Object.assign(taxReturn.submissionIds || {}, submissionId);
								//call to save submissionIds
							}
						}
					}
					if(isSaveSubmissionId) {
						service.saveReturnSubmissionIds(generatedSubmissionId).then(function (response) {
							console.log('save Return' + response);
						}, function (error) {
							$log.error(error);
						});
					}
				}
			}
		};
		
		/**
		 * This function will be called from return controller to change status of currently open return 
		 */
		service.changeReturnStatus = function (status) {
			var deffered = $q.defer();

			//Update header properties first (locally)
			_taxReturn.header.status = status;

			//API required id of return and status to be updated
			var updateData = { id: _taxReturn.header.id, status: _taxReturn.header.status };

			//Update return status
			returnAPIService.changeReturnStatus(updateData).then(function (response) {
				deffered.resolve(response)
			}, function (error) {
				deffered.reject(error);
			});

			return deffered.promise;
		};

		service.preAck = function () {
			return _taxReturn.header.preAck;
		}

		service.savePreAckInHeader = function () {
			_taxReturn.header.preAck = true;
		}

		service.getChildDocs = function (docName, parentForm, parentNotFound) {
			var deferred = $q.defer();
			var docs = _getDoc(docName);
			var childDocs = {};

			//find child docs based on parent index
			if (!_.isUndefined(docs)) {
				var keys = _.keys(docs);
				if (keys && keys.length > 0) {
					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						if (docs[key].parent == parentForm.docIndex) {
							childDocs[key] = docs[key];
						} else if (parentNotFound == true && (docs[key].parent == undefined || docs[key].parent == '')) {
							childDocs[key] = docs[key];
						}
					}
				}
			}
			if (parentNotFound == true) {
				deferred.resolve(childDocs);
			} else {
				//download document with property
				var formProp = contentService.getFormProp(parentForm.formName);
				contentService.getDocFields(docName, formProp.packageName, formProp.state)
					.then(function () {
						deferred.resolve(childDocs);
					}, function (reason) {
						$log.warn(reason);
						deferred.resolve(childDocs);
					});
			}
			return deferred.promise;
		};

		service.addChildDoc = function (docName, parentForm) {
			var deferred = $q.defer();
			var index = _addDoc(docName, parentForm.docIndex);
			var doc = _getDoc(docName, index);
			var formProp = contentService.getFormProp(parentForm.formName);
			contentService.getDocFields(docName, formProp.packageName, formProp.state)
				.then(function (formFields) {
					//add default values
					_addDefaultValues(docName, index, formFields);
					deferred.resolve({ data: doc, index: index });
				}, function (reason) {
					$log.warn(reason);
					deferred.resolve({ data: doc, index: index });
				});
			return deferred.promise;
		};

		service.removeChildDoc = function (docName, index) {
			var deferred = $q.defer();

			//This function is called to clear required fields from parent form while in statment line is deleted
			_validateDocRequired(docName, index, true)
				.then(function () {
					_removeDoc(docName, index);
					deferred.resolve();
				}, function (reason) {
					$log.warn(reason);
					_removeDoc(docName, index);
					deferred.resolve();
				});
			return deferred.promise;
		};

		//it is fire and forget method for caller so does not require promise
		service.postTaxFieldChange = function (field) {
			_postTaxFieldChange(field);
		};

		// Get All instance of a single doc
		service.getForm = function (docName) {
			return _.filter(_taxReturn.forms, { docName: docName });
		}

		//does not do any Asynch job yet
		service.getForms = function () {
			var deferred = $q.defer();
			//Add extended property with displayName to use it on form tree.
			//Note: This will be added in return for temporary purpose. While saving return we have to remove whole extendedProperties
			_.forEach(_taxReturn.forms, function (form) {
				if (_.isUndefined(form.extendedProperties)) {
					form.extendedProperties = { displayName: $filter('formDisplayName')(form.formName), description: $filter('formDescription')(form.formName), status: $filter('formStatus')(form.formName) };
					//condition that checks wether form property hold the isHiddenForm if yes than we set isHiddenForm property in extendedProperties of form
					if (!_.isUndefined($filter('hiddenForm')(form.formName))) {
						form.extendedProperties.isHiddenForm = $filter('hiddenForm')(form.formName);
					}
				} else {
					form.extendedProperties.displayName = $filter('formDisplayName')(form.formName);
					form.extendedProperties.description = $filter('formDescription')(form.formName);
					form.extendedProperties.status = $filter('formStatus')(form.formName);
					//condition that checks wether form property hold the isHiddenForm if yes than we set isHiddenForm property in extendedProperties of form
					if (!_.isUndefined($filter('hiddenForm')(form.formName))) {
						form.extendedProperties.isHiddenForm = $filter('hiddenForm')(form.formName);
					}
				}
				//add print set property
				var formProperty = contentService.getFormProp(form.formName);
				if (formProperty != undefined) {
					form.extendedProperties.whenToPrint = angular.copy(formProperty.whenToPrint);
					form.extendedProperties.id = formProperty.id;
					form.extendedProperties.printOrder = angular.copy(formProperty.printOrder);
					form.extendedProperties.printCategory = angular.copy(formProperty.printCategory);
					//add tag property for searching purpose
					form.extendedProperties.tags = angular.copy(formProperty.tags);
					form.extendedProperties.tagOrder = formProperty.tagOrder;
					form.state = formProperty.state;
					form.packageName = formProperty.packageName;
				}
				//added the boolean variable in extended properties in order to show add new instance in right side dropdown
				form.extendedProperties.isNewInstanceAllowed = _checkForNewInstance(form.formName);
			});

			deferred.resolve(_taxReturn.forms);
			return deferred.promise;
		};

		// May this needs to be convert in to async call if required later
		service.getAddedStates = function (forceUpdate) {
			if (_addedStates.length == 0 || forceUpdate == true) {
				_updateAddedStates();
			}
			return angular.copy(_addedStates);
		};

		//does not do any Asynch job yet
		service.addForm = function (form, parentId, parentDocIndex, doNotAddDoc, docIndexIfDoNotAddDoc) {
			var deferred = $q.defer();
			_addForm(form, parentId, parentDocIndex, doNotAddDoc, docIndexIfDoNotAddDoc).then(function (newForm) {
				deferred.resolve(newForm);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});

			return deferred.promise;
		};
		//does not do any Asynch job yet
		service.removeForm = function (form) {
			var deferred = $q.defer();
			_removeForm(form);
			deferred.resolve(form);
			return deferred.promise;
		};

		service.getPrefixText = function (form, prefix) {
			var doc = _getDoc(form.docName, form.docIndex);
			if (!_.isUndefined(doc) && !_.isUndefined(doc[prefix]) && !_.isUndefined(doc[prefix].value))
				return doc[prefix].value;
		};

		service.getLinkForms = function (fieldName, currentForm) {
			var list = { jumpToList: [], createList: [] };
			var names = _getDocFieldName(fieldName);
			var linkList = contentService.getLinksList(names.docName, names.fieldName);
			//List of forms which are child of current instance
			var _childFormList = [];
			//form property of current form (if passed)        
			var currentFormProperty;
			if (!_.isUndefined(currentForm)) {
				currentFormProperty = contentService.getFormProp(currentForm);
			}

			if (!_.isUndefined(linkList)) {
				for (var fIndex = 0; fIndex < linkList.length; fIndex++) {
					//
					var formProp = contentService.getFormProp(linkList[fIndex]);
					var forms = [];
					//If the form is child of current form, then we only have to list the instance of those child forms which are conntected this parent(current form) only
					if (formProp != undefined && currentFormProperty != undefined && formProp.parentID.toString().indexOf(currentFormProperty.id.toString())) {
						forms = _.where(_taxReturn.forms, { formName: linkList[fIndex], parentDocIndex: currentForm.docIndex });
						//Also look for child of child
						_.forEach(_childFormList, function (_childForm) {
							forms = _.union(forms, _.where(_taxReturn.forms, { formName: linkList[fIndex], parentDocIndex: _childForm.docIndex }));
						});
					} else {
						//This is useful forms like 1040 which is not directly act as parent form in form tree. For Example W2 value on Line 7.
						forms = _.where(_taxReturn.forms, { formName: linkList[fIndex] });
					}

					if (!_.isUndefined(forms) && forms.length > 0)
						list.jumpToList = list.jumpToList.concat(forms);

					//If th form is not already added then make it part of create list
					if (!_.isUndefined(formProp) && !_.isUndefined(formProp.formBelongsToPackages) && _.includes(formProp.formBelongsToPackages.split(','), _packageName) && (formProp.isMultiAllowed === true || forms.length <= 0)) {
						var form = {};
						form.formName = linkList[fIndex];
						form.docName = formProp.docName;
						list.createList.push(form);
					}

				}
			}

			return list;
		};

		service.getFormData = function (form) {
			var deferred = $q.defer();
			var doc = _getDoc(form.docName, form.docIndex);
			docIndexOfCurrentLoadedForm = { form: form, doc: doc };
			var formProp = contentService.getFormProp(form.formName);
			contentService.getDocFields(formProp.docName, formProp.packageName, formProp.state)
				.then(function () {
					deferred.resolve(doc);
				}, function (reason) {
					$log.warn(reason);
					deferred.resolve(doc);
				});
			return deferred.promise;
		};

		service.getAvailableForms = function () {
			//List of packages and states from return 
			var packageNames = _taxReturn.header.packageNames;
			var stateNames = _taxReturn.header.states;

			var forms = contentService.getForms(packageNames, stateNames);

			//Clone forms
			var availableFroms = _.cloneDeep(forms);

			//Loop forms to mark that are already added and single instance as isAdded true
			_.forEach(availableFroms, function (form) {
				//find whether form is in return
				var formInReturn = _.where(_taxReturn.forms, { formName: form.formName });
				//check whether form allow multi instance then form is available
				// if form does not allow multi instance but it is not in return then form is available
				if (form.isMultiAllowed === true && form.maxOccurs != undefined && parseInt(form.maxOccurs) != 0 && formInReturn.length >= parseInt(form.maxOccurs))
					form.isAdded = true;
				else if (form.isMultiAllowed === false && !_.isUndefined(formInReturn) && formInReturn.length > 0)
					form.isAdded = true;
			});

			return availableFroms;
		};

		/**
		 * This function is wrapper to call contentService.getForm(docName) for controller and directives
		 */
		service.getSingleAvailableForm = function (docName) {
			return contentService.getForm(docName);
		};

		/**
		 * This function is wrapper to call _getDoc(docName,docIndex) to return doc for controller and directives
		 */
		service.getDoc = function (docName, docIndex) {
			return _getDoc(docName, docIndex);
		};

		/**
		 * This function is wrapper to call _getIndex(docName) to return list of doc Index for controller and directives
		 */
		service.getIndex = function (docName) {
			return _getIndex(docName);
		};

		/**
		 * This function is wrapper to call _getFormFromDoc(docName,docIndex) to return form(from return) for controller and directives
		 */
		service.getFormFromDoc = function (docName, docIndex) {
			return _getFormFromDoc(docName, docIndex);
		};

		/**
		 * wrapper function to get the form propery 
		 */
		service.getFormProp = function (formName) {
			return _getFormProp(formName);
		}

		/**
		 * This function is wrapper to call _addDoc(docName, parentIndex, isCalculated, calculationIndex)
		 */
		service.addDoc = function (docName, parentIndex, isCalculated, calculationIndex) {
			return _addDoc(docName, parentIndex, isCalculated, calculationIndex);
		};

		/**
		 * This function is wrapper to call _addDocOnly(docName, parentIndex, isCalculated, calculationIndex)
		 */
		service.addDocOnly = function (docName, parentIndex, isCalculated, calculationIndex) {
			return _addDocOnly(docName, parentIndex, isCalculated, calculationIndex);
		};

		/**
		 * This function will return parentForm (passed docNAme) of passed childForm (docName, docIndex)
		 */
		service.getParentForm = function (childDocName, childDocIndex) {
			//holding parent form instance to return
			var _parentFormToReturn;
			//get child doc first to get docId of parent
			var childDoc = _getDoc(childDocName, childDocIndex);
			if (childDoc.parent != undefined) {
				_parentFormToReturn = _.find(_taxReturn.forms, { docIndex: childDoc.parent });
			}
			return _parentFormToReturn;
		};

		/**
		 * This function return childForm (passed docName) for passed parentForm
		 * Note: This function will return only first instance if more then one child forms are added
		 */
		service.getChildForm = function (docName, parentForm) {
			//Get list of child forms
			var childFormList = _getChildForms(parentForm);
			//Pluck form objects and find child instance
			return _.find(_.pluck(childFormList, 'form'), { docName: docName });
		};

		/**
		 * This function return list of childForms (passed docName) for passed parentForm
		 * Note: This function will return only all instance of child forms that are added
		 */
		service.getChildForms = function (docName, parentForm) {
			// Get list of child forms
			var childFormList = _getChildForms(parentForm);
			return childFormList;
		}

		/**
		 * wrapper function to check wheter the form is multi instance or not
		 * on the basis of it we toggle the button of add new instance on toolbar
		 */
		service.checkForNewInstance = function (formName) {
			return _checkForNewInstance(formName);
		}

		/**
		 * This method will return available states as released from config     * 
		 */
		service.getAvailableStates = function () {
			//List of states that are available as released for package of user's return    	
			angular.copy(contentService.getReleasedStates(_taxReturn.header.packageNames), _availableStateList);

			//States that are already added in return
			var addedStates = this.getAddedStates();

			//remove states from list which are already added
			//Note: We have done like this because due to differences in property we are unable to merge both arrays
			_.forEach(addedStates, function (addedState) {
				//Find available state from already added one
				var matchedState = _.find(_availableStateList, { name: addedState.name });
				if (!_.isUndefined(matchedState)) {
					//Merge properties from added states to available state. isAdded and Residency Type.
					_.assign(matchedState, addedState);
				}

			});

			return _availableStateList;
		};

		service.getDocStatus = function (docName, docIndex) {
			//Issue: Due to conversion problem - there are some forms in _taxReturns.forms but missing in docs.
			//To avoid crashing we just return 'InActive' if that happens
			if (_.isUndefined(_taxReturn['docs'][docName]) || _.isUndefined(_taxReturn['docs'][docName][docIndex])) {
				return 'InActive';
			}

			var isActive = _taxReturn['docs'][docName][docIndex]['isActive'];
			if (!_.isUndefined(isActive) && isActive.value == true) {
				var hasRequiredFields = _taxReturn['docs'][docName][docIndex]['hasRequiredFields'];
				if (!_.isUndefined(hasRequiredFields) && hasRequiredFields.value == true) {
					return 'Required';
				}
				return 'Active';
			} else {
				return 'InActive';
			};
		};

		/**
		 * This method will check AGI/Refund/Owe for Federal and States 
		 */
		service.updateReturnOverview = function () {
			//For Federal 
			var result = {};
			var docName, docIndex;
			var pkgName = _packageName.toString().toLowerCase();
			if (!_.isUndefined(_taxReturn.docs)) {
				//for FEDERAL
				var fieldList = contentService.getFedReturnOverViewFields(_packageName, 'federal');
				//Loop through fieldList and check which form is active
				_.forEach(fieldList, function (fields) {
					docName = fields.docName;
					if (!_.isUndefined(_taxReturn.docs[docName])) {
						// to avoid unnecessary operation we take docindex here.
						docIndex = _.keys(_taxReturn.docs[docName])[0];

						//IF we find docIndex then we need to proceed futher else look into other forms.
						// ALSO check whether the doc is active or not.
						if (!_.isUndefined(docIndex) && docIndex != "" && !_.isUndefined(_taxReturn.docs[docName][docIndex].isActive) && _taxReturn.docs[docName][docIndex].isActive.value == true) {
							switch (pkgName) {
								case '1040':
								case '1041':
									//FED AGI
									if (!_.isUndefined(fields.agiField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.agiField])) {
										result.fedAGI = _taxReturn.docs[docName][docIndex][fields.agiField].value;
									};

									//Federal Owe    			
									if (!_.isUndefined(fields.oweField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
										var fedOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
										if (!_.isUndefined(fedOwe) && fedOwe != '' && fedOwe != '0') {
											result.fedOwe = fedOwe;
										};
									}

									//If Owe is not there, Pass Refund
									if (_.isUndefined(result.fedOwe)) {
										if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
											result.fedRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
										}
									}
									break;

								case '1065':
									if (!_.isUndefined(fields) && !_.isUndefined(fields.bisField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.bisField])) {
										result.fedBIS = _taxReturn.docs[docName][docIndex][fields.bisField].value;
									} else {
										result.fedBIS = 0;
									}

									//Federal Owe               
									if (!_.isUndefined(fields.oweField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
										var fedOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
										if (!_.isUndefined(fedOwe) && fedOwe != '' && fedOwe != '0') {
											result.fedOwe = fedOwe;
										};
									}

									//If Owe is not there, Pass Refund
									if (_.isUndefined(result.fedOwe)) {
										if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
											result.fedRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
										}
									}

									break;

								case '1120':
								case '990':
									//FED TAX
									if (!_.isUndefined(fields.taxField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.taxField])) {
										result.fedTAX = _taxReturn.docs[docName][docIndex][fields.taxField].value;
									}

									//Federal Owe    			
									if (!_.isUndefined(fields.oweField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
										var fedOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
										if (!_.isUndefined(fedOwe) && fedOwe != '' && fedOwe != '0') {
											result.fedOwe = fedOwe;
										};
									}

									//If Owe is not there, Pass Refund
									if (_.isUndefined(result.fedOwe)) {
										if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
											result.fedRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
										}
									}
									break;

								case '1120s':
									//FED TAX
									if (!_.isUndefined(fields.taxField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.taxField])) {
										result.fedTAX = _taxReturn.docs[docName][docIndex][fields.taxField].value;
									}

									//Federal Owe    			
									if (!_.isUndefined(fields.oweField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
										var fedOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
										if (!_.isUndefined(fedOwe) && fedOwe != '' && fedOwe != '0') {
											result.fedOwe = fedOwe;
										}
									}

									//If Owe is not there, Pass Refund
									if (_.isUndefined(result.fedOwe)) {
										if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
											result.fedRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
										}
									}
									break;
								// For More return type we need to write conditions here
								default:

									break;
							}// end of switch statement
							return false; // break the loop IF any field is not undefined or greater then 0 Else look further.
						}// end of if condition for index
					}
				});


				//For State
				_.forEach(_addedStates, function (state) {
					docName = "", docIndex = "";
					var isNoFormActive = true;
					var fieldList = contentService.getStateReturnOverViewFields(_packageName, state.name, state.residencyStatus);
					//Loop through fieldList and check which form is active
					_.forEach(fieldList, function (fields) {
						docName = fields.docName;

						if (!_.isUndefined(_taxReturn.docs[docName])) {
							// to avoid unnecessary operation we take docindex here.
							docIndex = _.keys(_taxReturn.docs[docName])[0];

							//IF we find docIndex then we need to proceed futher else look into other forms.
							// ALSO check whether the doc is active or not.
							if (!_.isUndefined(docIndex) && docIndex != "" && !_.isUndefined(_taxReturn.docs[docName][docIndex].isActive) && _taxReturn.docs[docName][docIndex].isActive.value == true) {
								switch (pkgName) {
									case '1040':
										isNoFormActive = false;
										var isOwe = false;
										if (!_.isUndefined(fields) && !_.isUndefined(fields.oweField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
											var stateOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
											if (!_.isUndefined(stateOwe) && stateOwe != '' && stateOwe != '0') {
												state.stateOwe = stateOwe;
												isOwe = true;
											} else {
												state.stateOwe = undefined;
											}
										}

										//If Owe is not there, then Refund
										if (isOwe == false) {
											state.stateOwe = undefined;
											if (!_.isUndefined(fields) && !_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
												var stateRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
												if (_.isUndefined(stateRefund) || stateRefund == '') {
													state.stateRefund = 0;
												} else {
													state.stateRefund = stateRefund;
												}
											} else {
												state.stateRefund = 0;
											}
										} else {
											state.stateRefund = undefined;
										}
										break;

									case '1065':
										if (!_.isUndefined(fields) && !_.isUndefined(fields.bisField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.bisField])) {
											isNoFormActive = false;
											state.stateBIS = _taxReturn.docs[docName][docIndex][fields.bisField].value;
										}

										isNoFormActive = false;
										var isOwe = false;
										if (!_.isUndefined(fields) && !_.isUndefined(fields.oweField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
											var stateOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
											if (!_.isUndefined(stateOwe) && stateOwe != '' && stateOwe != '0') {
												state.stateOwe = stateOwe;
												isOwe = true;
											} else {
												state.stateOwe = undefined;
											}
										}

										//If Owe is not there, then Refund
										if (isOwe == false) {
											if (!_.isUndefined(fields) && !_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
												var stateRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
												if (_.isUndefined(stateRefund) || stateRefund == '') {
													state.stateRefund = 0;
												} else {
													state.stateRefund = stateRefund;
												}
											} else {
												state.stateRefund = 0;
											}
										} else {
											state.stateRefund = undefined;
										}
										break;

									case '1120':
										isNoFormActive = false;
										//Owe			
										if (!_.isUndefined(fields) && !_.isUndefined(fields.oweField)) {
											var isOwe = false;
											if (!_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
												var stateOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
												if (!_.isUndefined(stateOwe) && stateOwe != '' && stateOwe != '0') {
													state.stateOwe = stateOwe;
													isOwe = true;
												} else {
													state.stateOwe = undefined;
												}
											}

											//If Owe is not there, then Refund
											if (isOwe == false) {
												if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
													var stateRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
													if (_.isUndefined(stateRefund) || stateRefund == '') {
														state.stateRefund = 0;
													} else {
														state.stateRefund = stateRefund;
													}
												} else {
													state.stateRefund = 0;
												}
											} else {
												state.stateRefund = undefined;
											}
										}
										break;

									case '1120s':
										isNoFormActive = false;
										//Owe			
										if (!_.isUndefined(fields) && !_.isUndefined(fields.oweField)) {
											var isOwe = false;
											if (!_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
												var stateOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
												if (!_.isUndefined(stateOwe) && stateOwe != '' && stateOwe != '0') {
													state.stateOwe = stateOwe;
													isOwe = true;
												} else {
													state.stateOwe = undefined;
												}
											}

											//If Owe is not there, then Refund
											if (isOwe == false) {
												if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
													var stateRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
													if (_.isUndefined(stateRefund) || stateRefund == '') {
														state.stateRefund = 0;
													} else {
														state.stateRefund = stateRefund;
													}
												} else {
													state.stateRefund = 0;
												}
											} else {
												state.stateRefund = undefined;
											}
										}
										break;
									case '1041':
										isNoFormActive = false;
										//Owe			
										if (!_.isUndefined(fields) && !_.isUndefined(fields.oweField)) {
											var isOwe = false;
											if (!_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
												var stateOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
												if (!_.isUndefined(stateOwe) && stateOwe != '' && stateOwe != '0') {
													state.stateOwe = stateOwe;
													isOwe = true;
												} else {
													state.stateOwe = undefined;
												}
											}

											//If Owe is not there, then Refund
											if (isOwe == false) {
												if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
													var stateRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
													if (_.isUndefined(stateRefund) || stateRefund == '') {
														state.stateRefund = 0;
													} else {
														state.stateRefund = stateRefund;
													}
												} else {
													state.stateRefund = 0;
												}
											} else {
												state.stateRefund = undefined;
											}
										}
										break;
									case '990':
										isNoFormActive = false;
										//Owe			
										if (!_.isUndefined(fields) && !_.isUndefined(fields.oweField)) {
											var isOwe = false;
											if (!_.isUndefined(_taxReturn.docs[docName][docIndex][fields.oweField])) {
												var stateOwe = _taxReturn.docs[docName][docIndex][fields.oweField].value;
												if (!_.isUndefined(stateOwe) && stateOwe != '' && stateOwe != '0') {
													state.stateOwe = stateOwe;
													isOwe = true;
												} else {
													state.stateOwe = undefined;
												}
											}

											//If Owe is not there, then Refund
											if (isOwe == false) {
												if (!_.isUndefined(fields.refundField) && !_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][fields.refundField])) {
													var stateRefund = _taxReturn.docs[docName][docIndex][fields.refundField].value;
													if (_.isUndefined(stateRefund) || stateRefund == '') {
														state.stateRefund = 0;
													} else {
														state.stateRefund = stateRefund;
													}
												} else {
													state.stateRefund = 0;
												}
											} else {
												state.stateRefund = undefined;
											}
										}
										break;
									// For More return type we need to write conditions here
									default:

										break;
								}// end of switch statement

								return false;
							}
						}
					}); //end of fieldlist loop

					//IF no form active then show refund to '0' and we need to reset owefield to avoid uneccessary display in this senario.
					if (isNoFormActive) {
						switch (pkgName) {
							case '1040':
								state.stateOwe = undefined;
								state.stateRefund = 0;
								break;

							case '1065':
								state.stateBIS = 0;
								break;

							case '1120':
								state.stateOwe = undefined;
								state.stateRefund = 0;
								break;

							case '1120s':
								state.stateOwe = undefined;
								state.stateRefund = 0;
								break;

							case '1041':
								state.stateOwe = undefined;
								state.stateRefund = 0;
								break;
							// For More return type we need to write conditions here
							default:

								break;
						}// end of switch statement
					}
				}); //end of state loop
			}

			//Broadcast result
			$rootScope.$broadcast('updateReturnOverview', result, _packageName);
		};

		//Invoke ERC
		service.performReview = function (docNames) {
			_performReview(docNames);
		};

		//Check require fileds and perform validation for one doc. This will not perform ERC
		service.performReviewForDoc = function (docName, docIndex) {
			//Returning local promise method. Due to this we do not have to make this method promise as it is just intermidiate method (exposed one)
			return performReviewForDoc(docName, docIndex);
		};

		//Invoke reCalculation of Return
		service.recalcReturn = function () {
			_calcWorker.postMessage({ 'msgType': 'reCalculate' });
		};

		//This function will return all ERC errors. normally calls after ERC computation get finished.
		service.getReviewErrors = function () {
			_.forEach(_reviewErrors, function (error) {
				var doc = _getDoc(error.docName, error.docIndex);
				var result = _getFormFromDoc(doc, error.docIndex);
				if (_.isUndefined(result)) {
					result = { form: { extendedProperties: { displayName: 'Setup' } } };
				}
				error.form = result.form;
				error.displayName = result.form.extendedProperties.displayName;
			});
			return _.cloneDeep(_reviewErrors);
		};

		//
		service.splitReturn = function () {
			//Load split return config first
			contentService.getSplitReturnConfig().then(function (data) {
				//Split config
				var splitConfig = data.returnData;

				//object holdign all split data
				/*{docName:"",parentDocName:"", fields:[
					{name:"",value:"",isCalculated:,isRequired:}
				]}*/
				var splitData = {};

				//Step 1 - Collect all forms and fields belongs to spouse as per mapping file. 
				splitData.forms = []; //array holding list of forms and their fields with value
				//Iterating each form in mapping file
				_.forEach(splitConfig.forms, function (formEntry) {
					//Check if form is added in return or not
					if (!_.isUndefined(_taxReturn.docs[formEntry.docName])) {
						//Get all instances of form
						var tpspDocs = _taxReturn.docs[formEntry.docName];
						//Loop through each instance
						_.forEach(tpspDocs, function (tpspDoc, tpspDocIndex) {
							//If there are no specified feilds in mapping. Means whole form may belongs to spouse.
							if (_.isUndefined(formEntry.fields) && formEntry.isSpouseForm == true) {
								//Check if current instance belongs to spouse
								if (!_.isUndefined(tpspDoc[formEntry.TPSPField]) && _.includes(formEntry.value.split(','), tpspDoc[formEntry.TPSPField].value)) {
									//Add this form to splitData. (used for removing spouse information from current return and adding to new return)
									//Add form details
									var formObject = _.find(_taxReturn.forms, { 'docName': formEntry.docName, 'docIndex': parseInt(tpspDocIndex) });
									//Mark this form as spouse form (this will used to remove form from taxpayer return.
									if (!_.isUndefined(formObject)) {
										formObject.isSpouseForm = formEntry.isSpouseForm;
										//Loop all fields and add them as well
										formObject.fields = {};
										_.forEach(tpspDoc, function (field, fieldName) {
											formObject.fields[fieldName] = field;
										});

										//push this form to splitData. Always use angular.copy to avoid two-way data binding
										splitData.forms.push(angular.copy(formObject));
									}
								}
							} else if (!_.isUndefined(formEntry.fields) && !_.isEmpty(formEntry.fields)) {
								//If there are specified fields for form. Means there are perticular fields which may belongs to spouse.	    				
								//Add form details
								var formObject = _.find(_taxReturn.forms, { 'docName': formEntry.docName, 'docIndex': parseInt(tpspDocIndex) });
								//Loop all fields in mapping config file and add them with data from taxReturn
								formObject.fields = {};
								_.forEach(formEntry.fields, function (field) {
									var docField = tpspDoc[field.SP];
									if (!_.isUndefined(docField)) {
										formObject.fields[field.TP] = tpspDoc[field.SP];
										//Add field name to remove for spouse
										formObject.fields[field.TP].removeFieldName = field.SP;
										//check if field is common. To avoid deleting it for taxpayer
										if (field.common == true) {
											//set this field as common
											formObject.fields[field.TP].common = true;
										}
									}
								});
								//add filing status as single
								formObject.fields['filstts'] = { value: '3' };

								//push this form to splitData. Always use angular.copy to avoid two-way data binding
								splitData.forms.push(angular.copy(formObject));
							}
						});
					}
				});


				//Read Header Fields
				splitData.header = {};
				_.forEach(splitConfig.header, function (value, key) {
					var docName = value.split('.')[0];
					var fieldName = value.split('.')[1];
					//Add header data
					splitData.header[key] = _taxReturn.docs[docName][_.keys(_taxReturn.docs[docName])[0]][fieldName].value;
				});

				var keys = _.keys(_taxReturn.docs.dMainInfo);
				var dMainInfo = _taxReturn.docs.dMainInfo[keys[0]];

				//copy taxpayer data in spouse mfs return 
				splitData.forms[0].fields['strspssn'] = { value: (dMainInfo.tpssn ? dMainInfo.tpssn.value : '') };
				splitData.forms[0].fields['strspfnmi'] = { value: (dMainInfo.tpfnmi ? dMainInfo.tpfnmi.value : '') };
				splitData.forms[0].fields['strsplnm'] = { value: (dMainInfo.tplnm ? dMainInfo.tplnm.value : '') };
				splitData.forms[0].fields['strsuffix2'] = { value: (dMainInfo.strsuffix ? dMainInfo.strsuffix.value : '') };
				splitData.forms[0].fields['strspdob'] = { value: (dMainInfo.strtpdob ? dMainInfo.strtpdob.value : '') };
				splitData.forms[0].fields['strspcellfax'] = { value: (dMainInfo.strtpcellfax ? dMainInfo.strtpcellfax.value : '') };
				splitData.forms[0].fields['strfgsptel'] = { value: (dMainInfo.strfgtptel ? dMainInfo.strfgtptel.value : '') };
				splitData.forms[0].fields['strworksptel'] = { value: (dMainInfo.strworktptel ? dMainInfo.strworktptel.value : '') };
				splitData.forms[0].fields['strworksptelExt'] = { value: (dMainInfo.strworktptelExt ? dMainInfo.strworktptelExt.value : '') };
				splitData.forms[0].fields['strspeml'] = { value: (dMainInfo.strtpeml ? dMainInfo.strtpeml.value : '') };
				splitData.forms[0].fields['strspocp'] = { value: (dMainInfo.strtpocp ? dMainInfo.strtpocp.value : '') };
				splitData.forms[0].fields['IdentityProtectionPINSP'] = { value: (dMainInfo.IdentityProtectionPINTP ? dMainInfo.IdentityProtectionPINTP.value : '') };
				splitData.forms[0].fields['strspdod'] = { value: (dMainInfo.strtpdod ? dMainInfo.strtpdod.value : '') };


				//Step 2 - Remove All spouse forms and specified data from common forms
				//Note: We are doing this in two step other then removing theme in step 1. Because in step 1 If we remove parent form, It will remove all its
				//child forms and then we no longer can get required data.    		
				_.forEach(splitData.forms, function (splitDataForm) {
					//Check if whole form belongs to spouse
					if (splitDataForm.isSpouseForm == true) {
						//remove that form from return
						service.removeForm(splitDataForm);
					} else {
						//As one form is used for both. We have to remove entries that belongs to spouse
						_.forEach(splitDataForm.fields, function (fieldObject, fieldName) {
							//check if field is common then do not empty it
							//Note: spouse field (field that require to remove is in as removeFieldName in field Object)
							if (fieldObject.common != true) {
								_postTaxFieldChange({ fieldName: splitDataForm.docName + '.' + fieldObject.removeFieldName, index: splitDataForm.docIndex, newVal: { value: "", isCalculated: false } });
							}
						});
					}
				});

				//Change filing status to single
				var mainInfoDoc = _.find(_taxReturn.forms, { docName: 'dMainInfo' });
				_postTaxFieldChange({ fieldName: mainInfoDoc.docName + '.filstts', index: mainInfoDoc.docIndex, newVal: { value: "3", isCalculated: false } });

				//Step 3 - Create new return for spouse

				//Generate unique id for new return
				returnAPIService.createReturn().then(function (returnId) {
					//Get Default Return and update header and attach splitData as well.
					contentService.getDefaultReturn('1040').then(function (response) {
						//variable holding - default return
						var splitedReturn = response;

						//Attach splitData
						splitedReturn.splitData = splitData;

						//Inject userService and Load user details. (required to update in return header)
						//Note: As this function is rarely used, it is good to inject service runtime instead as dependecy injection 
						var userService = $injector.get('userService')
						var userDetails = userService.getUserDetails();

						//These are header and other common details - These may change as per requirment	    			
						splitedReturn.header.id = returnId;
						//Mark this return as splitReturn to have more process when this return get open
						splitedReturn.header.isSplitReturn = true;
						splitedReturn.header.client.ssn = splitData.header.ssn;
						splitedReturn.header.client.firstName = splitData.header.firstName;
						splitedReturn.header.client.lastName = splitData.header.lastName;
						//we will set first default status id into header.					
						splitedReturn.header.status = systemConfig.getReturnStatus()[0].id;
						//get tax year from sysytem
						splitedReturn.header.year = userService.getTaxYear();
						//Recalucate  - false (For future use)
						splitedReturn.header.isRecalculate = false;
						//To indicate that this is new return
						splitedReturn.header.isNewReturn = true;
						//To indicate by whom return is created
						splitedReturn.header.createdByName = angular.isDefined(userDetails.lastName) ? (userDetails.firstName + " " + userDetails.lastName) : userDetails.firstName + "";
						//To indicate the id by whom the return is created
						splitedReturn.header.createdById = userDetails.key;
						//To indicate on which date return is created
						splitedReturn.header.createdDate = new Date();

						// Pass return to dataAPI for saving
						returnAPIService.addReturn(splitedReturn).then(function (success) {
							//Once spouse return saved succesfully, save this return as well.
							//service.saveReturn();
							messageService.showMessage('New return for spouse has been created and available in return list.', 'success');
						}, function (error) {
							messageService.showMessage('Error in saving newly created return', 'error');
						});
					});
				}, function (error) {
					$log.error(error);
				});
			});
		};

		//This function will be called from service.loadDB to make some common code reusable
		var _loadDBCommon = function (dbName, data) {
			//create new property in _db object
			_db[dbName] = {};
			_db[dbName].type = dbName;
			_db[dbName].db = data;
			//pass db to calcultion engine
			_calcWorker.postMessage({ msgType: 'postUtilDB', 'db': _db[dbName] });
		}

		// Change for new Bank
		//This will load DB like EIN and Preparer and make them available via _db.
		service.loadDB = function (dbName, dbData) {
			var deferred = $q.defer();
			//Check if dbName is passed and not blank
			if (!_.isUndefined(dbName) && dbName != '') {
				switch (dbName) {
					case 'einDB':
						var EINList = {};
						//Call API
						$http({
							method: 'POST',
							url: dataAPI.base_url + '/ein/list'
						}).then(function (response) {
							//Loop on response to format as per our requirment and push as property in Object.
							_.forEach(response.data.data.einList, function (einData) {
								EINList[einData.ein.ein] = einData.ein;
							});
							//call common function
							_loadDBCommon(dbName, EINList);
							deferred.resolve();
						}, function (error) {
							$log.error(error);
							deferred.reject(error);
						});
						break;
					case 'prepDB':
						var prepList = {};
						//Call API
						$http({
							method: 'POST',
							url: dataAPI.base_url + '/preparer/list'
						}).then(function (response) {
							_.forEach(response.data.data.preparerList, function (prepData) {
								prepList[prepData.preparer.preparerId] = prepData.preparer;
							});
							//call common function
							_loadDBCommon(dbName, prepList);
							deferred.resolve();
						}, function (error) {
							$log.error(error);
							deferred.reject(error);
						});
						break;
					case 'locationDB':
						if (!_.isUndefined(dbData)) {
							_loadDBCommon(dbName, dbData);
							deferred.resolve();
						} else {
							deferred.reject('location(office) data is undefined');
						}
						break;
					case 'redBirdBankDB':
						if (!_.isUndefined(dbData)) {
							_loadDBCommon(dbName, dbData);
							deferred.resolve();
						} else {
							deferred.reject('bank(bankFeeDetails) data is undefined');
						}
						break;
					case 'tpgBankDB':
						if (!_.isUndefined(dbData)) {
							_loadDBCommon(dbName, dbData);
							deferred.resolve();
						} else {
							deferred.reject('bank(bankFeeDetails) data is undefined');
						}
						break;
					case 'refundAdvantageBankDB':
						if (!_.isUndefined(dbData)) {
							_loadDBCommon(dbName, dbData);
							deferred.resolve();
						} else {
							deferred.reject('bank(bankFeeDetails) data is undefined');
						}
						break;
					case 'epsBankDB':
						if (!_.isUndefined(dbData)) {
							_loadDBCommon(dbName, dbData);
							deferred.resolve();
						} else {
							deferred.reject('bank(bankFeeDetails) data is undefined');
						}
						break;
					case 'licenseDB':
						var licenseDetails = {};
						//Call API
						$http({
							method: 'POST',
							url: dataAPI.base_url + '/customer/getCustomerDetails'
						}).then(function (response) {
							licenseDetails = response.data.data.licenseOwner;
							//call common function
							_loadDBCommon(dbName, licenseDetails);
							deferred.resolve();
						}, function (error) {
							$log.error(error);
							deferred.reject(error);
						});
					break;		
					case 'protectionPlusDB':
					case 'resellerDB':
					case 'environmentDB':
					case 'bankDB':
						if (!_.isUndefined(dbData)) {
							_loadDBCommon(dbName, dbData);
							deferred.resolve();
						} else {
							deferred.reject('data is undefined');
						}
						break;
					default:
						deferred.resolve();
						break;
				}
			}
			return deferred.promise;
		};
		//to get rejection error list base on return id
		service.getRejectionErrorList = function (returnId) {
			var deferred = $q.defer();
			//load list from data api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/efile/getRejection',
				data: {
					returnId: returnId
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		//to get rejection error list base on return id
		service.getAlertList = function (returnId) {
			var deferred = $q.defer();
			//load list from data api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/efile/getAlert',
				data: {
					returnId: returnId
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		service.getSubmissionIds = function () {
			var deferred = $q.defer();
			//load list from data api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/return/getSubmissionIds',
				data: {
					returnId: _taxReturn.header.id
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		}

		//get Efile status from return header.
		//Return blank array if not available to avoid to check undefined at reciever end
		service.getEfileStatus = function (stateName, property) {
			//Loop on object to get property value
			var _getValue = function (stateEfileStatus) {
				//To avoid accidental refference                    
				var value = _.cloneDeep(stateEfileStatus);
				//splitout properties by dot
				var properties = property.split('.');
				//Loop till last property
				while (properties.length && (value = value[properties.shift()])) { }
				//return value
				return value;
			}

			//efileStatus to local variable
			var efileStatus = _taxReturn.header.eFileStatus;

			//If state name is not passed return complete status
			if (stateName === undefined) {
				if (!_.isUndefined(efileStatus)) {
					//If property is not passed then return whole object
					if (property === undefined) {
						return efileStatus;
					} else {
						//Return array of property for all states
						var _result = {};
						for (var statePropertyName in efileStatus) {
							//Push in result
							_result[statePropertyName] = (_getValue(efileStatus[statePropertyName]));
						}
						//return data
						return _result;
					}
				} else {
					return {};
				}
			} else {//State is passed
				//If there is no efileStatus then return undefined
				if (!_.isUndefined(efileStatus) && !_.isUndefined(efileStatus[stateName])) {
					//If property is not passed then return whole object
					if (property === undefined) {
						return efileStatus[stateName];
					} else {
						return _getValue(efileStatus[stateName]);
					}
				} else {
					return undefined;
				}
			}

		};

		//This Function is used to get updated header from api
		service.getUpdatedEfileStatusFromApi = function () {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/return/eFileStatus',
				data: {
					returnId: _taxReturn.header.id
				}
			}).then(function (response) {
				_taxReturn.header.eFileStatus = response.data.data;
				deferred.resolve();
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		}

		//This Function is used to send return to support
		service.sendReturnToSupport = function (supportData) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/support/sendReturn',
				data: {
					returnId: _taxReturn.header.id,
					subject: supportData.subject,
					message: supportData.message,
					submissionId: supportData.submissionId,
					rejectionErrors: supportData.rejectionErrors,
					tpFirstName: supportData.firstName,
					tpLastName: supportData.lastName,
					companyName: supportData.companyName,
					packageName: supportData.packageName
				}
			}).then(function (response) {
				deferred.resolve();
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		}


		//This Function is used to get xml for return type
		service.getXML = function (state, returnType) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/efile/generateXML',
				data: {
					returnId: _taxReturn.header.id,
					returnType: returnType,
					state: state,
					deviceInformation: utilityService.getDeviceInformation()
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		}

		// set return islocked flag
		service.setReturnLockFlag = function (flag) {
			_taxReturn.header.isLocked = flag;
			return flag;
		};

		//get return islocked flag
		service.getReturnLockFlag = function () {
			return _taxReturn.header.isLocked != undefined ? _taxReturn.header.isLocked : false;
		};

		// get return isRemoteSignLocked flag
		service.setRemoteSignLocked = function (flag) {
			_taxReturn.header.isRemoteSignLocked = flag;
			return flag;
		};

		//get return isRemoteSignLocked flag
		service.getRemoteSignLocked = function () {
			return _taxReturn.header.isRemoteSignLocked != undefined ? _taxReturn.header.isRemoteSignLocked : false;
		};

		// unlock return
		service.unlockReturn = function () {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: dataAPI.base_url + '/return/unlock',
				data: {
					returnId: _taxReturn.header.id
				}
			}).then(function (response) {
				//update return status
				_taxReturn.header.status = { id: "default_1", title: "In Process", isPredefined: true };
				if (_updatedK1DataPending === true) {
					_getK1DataFromReturn(_importedK1Data).then(function (result) {
						_updatedK1DataPending = false;
						messageService.showMessage('Imported k1 data has been updated successfully.', 'success');
					}, function (error) {
						// messageService.showMessage('New return for spouse has been created and available in return list.', 'error');
					})
				}
				deferred.resolve(response);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		// lock return
		service.lockReturn = function () {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: dataAPI.base_url + '/efile/lockReturn',
				data: {
					returnId: _taxReturn.header.id
				}
			}).then(function (response) {
				//update retrurn status
				_taxReturn.header.status = { id: "default_6", title: "Complete", isPredefined: true }
				deferred.resolve(response);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		// lock return for remote signature
		service.signatureLock = function (fromType) {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: dataAPI.base_url + '/clientPortal/signature/signatureLock',
				data: {
					returnId: _taxReturn.header.id,
					signType: fromType
				}
			}).then(function (response) {
				//update retrurn status
				// _taxReturn.header.status = { id: "default_6", title: "Complete", isPredefined: true }
				deferred.resolve(response);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		// lock return for remote signature
		service.signatureUnLock = function () {
			var deferred = $q.defer();

			$http({
				method: 'POST',
				url: dataAPI.base_url + '/clientPortal/signature/signatureUnLock',
				data: {
					returnId: _taxReturn.header.id
				}
			}).then(function (response) {
				//update retrurn status
				_taxReturn.header.status = { id: "default_1", title: "In Process", isPredefined: true };
				deferred.resolve(response);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};


		service.clientPortalcheck = function () {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/clientPortal/check',
				data: {
					ssn: _taxReturn.header.client.ssn
				}
			}).then(function (response) {
				isclientPortal = response.data.data;
				//update retrurn status
				deferred.resolve(response);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		// lock return for remote signature
		service.markSignatureInvalid = function () {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/clientPortal/signature/invalid',
				data: {
					ssn: _taxReturn.header.client.ssn
				}
			}).then(function (response) {
				//update retrurn status
				// _taxReturn.header.status = { id: "default_6", title: "Complete", isPredefined: true }
				deferred.resolve(response);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		//Get Forms required as quick return
		service.getAvailableQuickForms = function () {
			if (!_.isUndefined(_packageName)) {
				return contentService.getAvailableQuickForms(_packageName);
			} else {
				//If it is undefined return blank array
				return [];
			}
		};

		service.getclientPortal = function () {
			return isclientPortal;
		}
		//To return package name of opened return
		service.getPackageName = function () {
			return _packageName;
		};

		service.getDisbursementMethodData = function () {
			var disbursementMethodData = {};
			var primSsn = _taxReturn.docs.dAtlasBankApp[_.keys(_taxReturn.docs.dAtlasBankApp)[0]].TPSSN.value;
			disbursementMethodData.primSsn = primSsn.replace(/-/g, "");
			disbursementMethodData.dan = _taxReturn.docs.dReturnInfo[_.keys(_taxReturn.docs.dReturnInfo)[0]].strdan.value;
			return disbursementMethodData;
		};

		//to get Bank rejection error list base on return id
		service.getBankRejectionErrorList = function (returnId) {
			var deferred = $q.defer();
			//load list from data api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/bank/getRejection',
				data: {
					returnId: returnId
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		//This function will return all available parent forms of a form with grouped by two category 'new' or 'existing' 
		service.getParentForms = function (frm) {
			var form = contentService.getFormProp(frm.formName);
			var availableForms = service.getAvailableForms();
			if (_.isUndefined(form.parentID)) {
				return;
			}
			// Array will hold parent ids of one form
			var parentIds = form.parentID.split(',');

			if (!_.isUndefined(form.parentID) && parentIds.length > 0) {
				// Array will hold parent objects of one form
				var parents = [];
				// This flag is used whether the form is multi-instace or have muliple parents.
				var isFormToAdd = false;

				// Set flag value whether the form is multi-instace or have muliple parents.
				if (parentIds.length > 1) {
					isFormToAdd = true;
				} else if (parentIds.length == 1) {
					// Get parent object from parent id in form
					var parentObj = _.find(availableForms, { 'id': parentIds[0] });
					// Check whether parent object exists or not
					if (angular.isDefined(parentObj)) {
						if (parentObj.isMultiAllowed == true) {
							isFormToAdd = true;
						} else {
							isFormToAdd = false;
						}
					}
				}

				// IF flag is set then only we will proceed further

				/* Important Note ----
				 *  Note :- Angular.copy is used while pushing data into parents array,
				 *  	    If we don't use this then two way data bind will work and data will only come in existing list,
				 *  		so existing list will have two same objects. 
				 *  		This issue comes only in case of form is multi instance.
				 */

				if (isFormToAdd == true) {
					// Loop through parent ids 
					angular.forEach(parentIds, function (id) {
						// Get parent object from parent id in form
						var temp = _.find(availableForms, { 'id': id });
						var parentObj = angular.copy(temp);

						// Check whether parent object exists or not
						if (angular.isDefined(parentObj)) {
							// Existing parent's objects
							var tempParentObj = _.filter(_taxReturn.forms, { 'docName': parentObj.docName });
							// IF parent form already added put it in exists list
							if (angular.isDefined(tempParentObj) && tempParentObj.length > 0) {
								// If existing form is multi-instance form then its entry will be there in both type (new/ existing).
								if (parentObj.isMultiAllowed == true) {
									parentObj.objType = "New";
									parentObj.prefixTitle = parentObj.displayName;
									parents.push(angular.copy(parentObj));
								}

								// Add all existing forms in list
								angular.forEach(tempParentObj, function (tempParent) {
									parentObj.objType = "Existing";
									parentObj.docIndex = tempParent.docIndex;
									// Get prefix for a form if available
									var prefix = $filter('formPrefix')(tempParent);
									if (angular.isDefined(prefix) && prefix != "") {
										parentObj.prefixTitle = parentObj.displayName + " " + prefix;
									} else {
										parentObj.prefixTitle = parentObj.displayName;
									}
									parents.push(angular.copy(parentObj));
								});
							}
							// IF parent form is new.
							else if (angular.isDefined(parentObj)) {
								parentObj.objType = "New";
								parentObj.prefixTitle = parentObj.displayName;
								parents.push(parentObj);
							}
						}
					});

					// Order by object type ( 'Existing' or 'New' )
					parents = $filter('orderBy')(parents, 'objType', false);

					return parents;
				}
				return [];
			}

			return [];
		};

		//function will be evaluated when some one change the parent
		service.changeParent = function (childForm, oldParent, newParentIndex) {
			// update return's data
			_taxReturn.docs[childForm.docName][childForm.docIndex].parent = newParentIndex;
			_calcWorker.postMessage({ msgType: 'updateParent', docName: childForm.docName, index: childForm.docIndex, parentIndex: newParentIndex });


			//---forms to recalculate start---
			//old parent and child form to be pushed.
			var formListToRecalculate = [];
			//push form
			formListToRecalculate.push({ docName: childForm.docName, docIndex: childForm.docIndex });
			//push all child forms
			var childFormInstances = _getChildForms(childForm);
			_.forEach(childFormInstances, function (child) {
				if (!_.isUndefined(child.form) && !_.isUndefined(child.form.docName) && !_.isUndefined(child.form.docIndex)) {
					formListToRecalculate.push({ docName: child.form.docName, docIndex: child.form.docIndex });
				}
			});
			//push old parent
			formListToRecalculate.push({ docName: oldParent.docName, docIndex: oldParent.docIndex });
			//push new parent
			formListToRecalculate.push({ docName: childForm.currentParent.docName, docIndex: newParentIndex });
			//perform recalculate
			fullReCalculate(formListToRecalculate);
			//---forms to recalculate end---

			//IF the form is 4562 then we need to update depreciation wrksheet as well.
			if (childForm.docName == "d4562" && childFormInstances.length > 0) {
				//prepare new relatesTo object
				var relatesto = {
					displayName: childForm.currentParent.displayName,
					docName: childForm.currentParent.docName,
					docIndex: newParentIndex,
					isDisabled: true,
					objType: childForm.currentParent.objType
				};

				//loop through each child of 4562 (vehicle and asset wrksheet)
				//updates object
				_.forEach(childFormInstances, function (child) {
					if (!_.isUndefined(child.form) && !_.isUndefined(child.form.docName) && !_.isUndefined(child.form.docIndex)) {
						_taxReturn.docs[child.form.docName][child.form.docIndex].relatesto = relatesto;
					}
				});
			}
		};


		service.updateParentForDep = function (childForm, newParentIndex) {
			// update return's data
			_taxReturn.docs[childForm.docName][childForm.docIndex].parent = newParentIndex;
			var childForm = _.find(_taxReturn.forms, { docIndex: childForm.docIndex });
			if (childForm !== undefined) {
				childForm.parentDocIndex = newParentIndex;
			}
			_calcWorker.postMessage({ msgType: 'updateParent', docName: childForm.docName, index: childForm.docIndex, parentIndex: newParentIndex });
			service.recalcReturn()
			$rootScope.$broadcast('parentChangeDepreciation', {})
		}

		/**
		 * This function will update parent for given child form.
		 * @param {*} childForm 
		 * 		doc of child form.
		 * @param {*} newParentIndex
		 * 		new parentIndex 
		 */
		service.updateParentDepriciationWorksheet = function (childForm, newParentIndex) {
			// update return's data
			_taxReturn.docs[childForm.docName][childForm.docIndex].parent = newParentIndex;

			// change parentIndex in forms also.
			for (var i = 0; i < _taxReturn.forms.length; i++) {
				if (childForm.docIndex == _taxReturn.forms[i].docIndex) {
					_taxReturn.forms[i].parentDocIndex = newParentIndex;
				}
			}

			_calcWorker.postMessage({ msgType: 'updateParent', docName: childForm.docName, index: childForm.docIndex, parentIndex: newParentIndex });
			service.recalcReturn();
			$rootScope.$broadcast('parentChangeDepreciation', {})
		}

		/**
		 * method prepared to import the data and load it to the respective form
		 * parentFormDetail - contains the form detail of parent form either schedule D or Schedule C
		 * importedData - array of object that contains the data to import
		 * mappedColumnWithStm - array the contains the form element name to which data are to be mapped
		 */
		service.importDataToForm = function (parentFormDetail, importedData, mappedColumnWithStm) {
			var shortTermAndLongTermObj = {}, isFormFound;
			if (parentFormDetail.docName == 'dSchD') {
				var formDetail = angular.copy(service.getSingleAvailableForm('d8949'));
				if (!_.isUndefined(importedData.scenerioA) && !_.isEmpty(importedData.scenerioA)) {
					isFormFound = false;
					if (!_.isUndefined(_taxReturn.docs['d8949'])) {
						shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioA);
						_.forEach(_taxReturn.docs['d8949'], function (formObj, key) {
							if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && !_.isEmpty(shortTermAndLongTermObj.longTermData) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value) && formObj.TransRptOn1099BThatShowBssInd.value == '1' && formObj.TransRptOn1099BThatShowBssInd2.value == '4') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd.value == '1') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd2.value == '4') {
								formDetail.docIndex = key;
								isFormFound = true;
							}
						});
						if (isFormFound == true) {
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm);
						}
					}
					if (_.isUndefined(_taxReturn.docs['d8949']) || isFormFound == false) {
						_addForm(formDetail).then(function (formDetail) {
							shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioA);
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, { shortTermValue: { value: '1' }, longTermValue: { value: '4' } })
						});
					}
				}
				if (!_.isUndefined(importedData.scenerioB) && !_.isEmpty(importedData.scenerioB)) {
					isFormFound = false;
					if (!_.isUndefined(_taxReturn.docs['d8949'])) {
						shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioB);
						_.forEach(_taxReturn.docs['d8949'], function (formObj, key) {
							if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && !_.isEmpty(shortTermAndLongTermObj.longTermData) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value) && formObj.TransRptOn1099BThatShowBssInd.value == '2' && formObj.TransRptOn1099BThatShowBssInd2.value == '5') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd.value == '2') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd2.value == '5') {
								formDetail.docIndex = key;
								isFormFound = true;
							}
						});
						if (isFormFound == true) {
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm);
						}
					}
					if (_.isUndefined(_taxReturn.docs['d8949']) || isFormFound == false) {
						_addForm(formDetail).then(function (formDetail) {
							shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioB);
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, { shortTermValue: { value: '2' }, longTermValue: { value: '5' } });
						});
					}

				}
				if (!_.isUndefined(importedData.scenerioC) && !_.isEmpty(importedData.scenerioC)) {
					isFormFound = false;
					if (!_.isUndefined(_taxReturn.docs['d8949'])) {
						shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioC);
						_.forEach(_taxReturn.docs['d8949'], function (formObj, key) {
							if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && !_.isEmpty(shortTermAndLongTermObj.longTermData) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value) && formObj.TransRptOn1099BThatShowBssInd.value == '3' && formObj.TransRptOn1099BThatShowBssInd2.value == '6') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd.value == '3') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd2.value == '6') {
								formDetail.docIndex = key;
								isFormFound = true;
							}
						});
						if (isFormFound == true) {
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm);
						}
					}
					if (_.isUndefined(_taxReturn.docs['d8949']) || isFormFound == false) {
						_addForm(formDetail).then(function (formDetail) {
							shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioC);
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, { shortTermValue: { value: '3' }, longTermValue: { value: '6' } });
						});
					}
				}
			} else if (parentFormDetail.docName == 'dSchedule1041D' || parentFormDetail.docName == 'dSch1120SchD' || parentFormDetail.docName == 'dSch1120SSchD') {
				var formDetail = angular.copy(service.getSingleAvailableForm('d8949Business'));
				if (!_.isUndefined(importedData.scenerioA) && !_.isEmpty(importedData.scenerioA)) {
					isFormFound = false;
					if (!_.isUndefined(_taxReturn.docs['d8949Business'])) {
						shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioA);
						_.forEach(_taxReturn.docs['d8949Business'], function (formObj, key) {
							if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && !_.isEmpty(shortTermAndLongTermObj.longTermData) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value) && formObj.TransRptOn1099BThatShowBssInd.value == '1' && formObj.TransRptOn1099BThatShowBssInd2.value == '1') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd.value == '1') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd2.value == '1') {
								formDetail.docIndex = key;
								isFormFound = true;
							}
						});
						if (isFormFound == true) {
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, undefined, parentFormDetail.docName);
						}
					}
					if (_.isUndefined(_taxReturn.docs['d8949Business']) || isFormFound == false) {
						_addForm(formDetail).then(function (formDetail) {
							shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioA);
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, { shortTermValue: { value: '1' }, longTermValue: { value: '1' } }, parentFormDetail.docName)
						});
					}
				}
				if (!_.isUndefined(importedData.scenerioB) && !_.isEmpty(importedData.scenerioB)) {
					isFormFound = false;
					if (!_.isUndefined(_taxReturn.docs['d8949Business'])) {
						shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioB);
						_.forEach(_taxReturn.docs['d8949Business'], function (formObj, key) {
							if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && !_.isEmpty(shortTermAndLongTermObj.longTermData) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value) && formObj.TransRptOn1099BThatShowBssInd.value == '2' && formObj.TransRptOn1099BThatShowBssInd2.value == '2') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd.value == '2') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd2.value == '2') {
								formDetail.docIndex = key;
								isFormFound = true;
							}
						});
						if (isFormFound == true) {
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, undefined, parentFormDetail.docName);
						}
					}
					if (_.isUndefined(_taxReturn.docs['d8949Business']) || isFormFound == false) {
						_addForm(formDetail).then(function (formDetail) {
							shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioB);
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, { shortTermValue: { value: '2' }, longTermValue: { value: '2' } }, parentFormDetail.docName);
						});
					}

				}
				if (!_.isUndefined(importedData.scenerioC) && !_.isEmpty(importedData.scenerioC)) {
					isFormFound = false;
					if (!_.isUndefined(_taxReturn.docs['d8949Business'])) {
						shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioC);
						_.forEach(_taxReturn.docs['d8949Business'], function (formObj, key) {
							if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && !_.isEmpty(shortTermAndLongTermObj.longTermData) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value) && formObj.TransRptOn1099BThatShowBssInd.value == '3' && formObj.TransRptOn1099BThatShowBssInd2.value == '3') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd2) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd2.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd.value == '3') {
								formDetail.docIndex = key;
								isFormFound = true;
							} else if (!_.isEmpty(shortTermAndLongTermObj.shortTermData) && _.isEmpty(shortTermAndLongTermObj.longTermData) && (_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) || _.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value)) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd) && !_.isUndefined(formObj.TransRptOn1099BThatShowBssInd.value) && formObj.TransRptOn1099BThatShowBssInd2.value == '3') {
								formDetail.docIndex = key;
								isFormFound = true;
							}
						});
						if (isFormFound == true) {
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, undefined, parentFormDetail.docName);
						}
					}
					if (_.isUndefined(_taxReturn.docs['d8949Business']) || isFormFound == false) {
						_addForm(formDetail).then(function (formDetail) {
							shortTermAndLongTermObj = _getShortTermAndLongTermData(importedData.scenerioC);
							_checkTransactionRpt(formDetail, shortTermAndLongTermObj, mappedColumnWithStm, { shortTermValue: { value: '3' }, longTermValue: { value: '3' } }, parentFormDetail.docName);
						});
					}
				}
			} else if (parentFormDetail.docName == 'dSchC') {
				var fieldsWithTotalAmt = {};
				_.forEach(importedData, function (obj) {
					var objKeys = _.keys(obj);
					if (!_.isEmpty(objKeys)) {
						_.forEach(mappedColumnWithStm, function (objArr) {
							var isStmExist = false;
							var stmName;
							_.forEach(objArr, function (mapObj) {
								if (_.includes(objKeys, mapObj.propName)) {
									if (isStmExist == false && !_.isUndefined(obj[mapObj.propName]) && !_.isNull(obj[mapObj.propName]) && obj[mapObj.propName] != '' && (_.isUndefined(mapObj.isTotalAmount) || mapObj.isTotalAmount == false)) {
										isStmExist = true;
										stmName = mapObj.stmName;
									} else if (!_.isUndefined(mapObj.isTotalAmount) && mapObj.isTotalAmount == true) {
										if (!_.isUndefined(_taxReturn.docs[parentFormDetail.docName][parentFormDetail.docIndex][mapObj.fieldName]) && _.isUndefined(fieldsWithTotalAmt[mapObj.fieldName])) {
											fieldsWithTotalAmt[mapObj.fieldName] = _taxReturn.docs[parentFormDetail.docName][parentFormDetail.docIndex][mapObj.fieldName].value;
										} else if (_.isUndefined(fieldsWithTotalAmt[mapObj.fieldName])) {
											fieldsWithTotalAmt[mapObj.fieldName] = 0;
										}
										fieldsWithTotalAmt[mapObj.fieldName] += !_.isUndefined(obj[mapObj.propName]) ? parseInt(obj[mapObj.propName]) : 0;
									}
								}
							});
							if (isStmExist == true) {
								service.addChildDoc(stmName, parentFormDetail).then(function (response) {
									_.forEach(objArr, function (mapObj) {
										if (!_.isUndefined(obj[mapObj.propName]) && !_.isNull(obj[mapObj.propName])) {
											_postTaxFieldChange({ fieldName: mapObj.stmName + '.' + mapObj.fieldName, index: response.index, newVal: { value: obj[mapObj.propName] } });
										}
									});
								});
							}
						});
					}
				});
				_.forEach(fieldsWithTotalAmt, function (amount, key) {
					_postTaxFieldChange({ fieldName: parentFormDetail.docName + '.' + key, index: parentFormDetail.docIndex, newVal: { value: amount } });
				});
			}
		};

		/**
		 * method build to separate the complete array into two shortTermData and longTermData
		 */
		var _getShortTermAndLongTermData = function (importedData) {
			var shortTermData = [], longTermData = [];
			//for separating the array into long term and short term data we need 'shortTermOrLongTerm' property in all objects
			var getIndex = _.indexOf(_.keys(importedData[0]), 'shortTermOrLongTerm');
			//condition to check whether the column exist or not
			//if the column does not exist we transfer all data in shortTerm array
			if (getIndex != -1) {
				//loop on the complete data array which is to be split
				_.forEach(importedData, function (obj) {
					//condition to check whether the data contains value as 'short term' or 's' 
					if (_.isUndefined(obj.shortTermOrLongTerm) || obj.shortTermOrLongTerm.toLowerCase() == 's' || obj.shortTermOrLongTerm.toLowerCase() == 'short term')
						shortTermData.push(obj);
					else if (obj.shortTermOrLongTerm.toLowerCase() == 'l' || obj.shortTermOrLongTerm.toLowerCase() == 'long term')
						longTermData.push(obj);
				});
			} else {
				shortTermData = angular.copy(importedData);
			}
			return { shortTermData: shortTermData, longTermData: longTermData };
		};

		/**
		 * method prepared to tick the checkbox in 8949 form and import the data in statements of that form
		 * formDetial - contains the form detail to which we need to import the data
		 * shortTermAndLongTermObj - object that holds two array of short term and long term data
		 * mappedColumnWithStm - object that holds array for short term and long term to map data to form fields
		 * chkValueObj - object that holds the value for short term and long term to check their check box
		 */
		var _checkTransactionRpt = function (formDetail, shortTermAndLongTermObj, mappedColumnWithStm, chkValueObj, docName) {
			if (!_.isEmpty(shortTermAndLongTermObj.shortTermData)) {
				if (!_.isUndefined(chkValueObj)) {
					_postTaxFieldChange({ fieldName: formDetail.docName + '.' + 'TransRptOn1099BThatShowBssInd', index: formDetail.docIndex, newVal: chkValueObj.shortTermValue });
				}
				if (docName == 'dSchedule1041D' || docName == 'dSch1120SchD' || docName == 'dSch1120SSchD') {
					_addImportedDataToStatements(shortTermAndLongTermObj.shortTermData, formDetail, mappedColumnWithStm.shortTerm, 'dCapitalGainsAndLossesAssetGrp');
				} else {
					_addImportedDataToStatements(shortTermAndLongTermObj.shortTermData, formDetail, mappedColumnWithStm.shortTerm, 'dForm8949Pg1');
				}
			}
			if (!_.isEmpty(shortTermAndLongTermObj.longTermData)) {
				if (!_.isUndefined(chkValueObj)) {
					_postTaxFieldChange({ fieldName: formDetail.docName + '.' + 'TransRptOn1099BThatShowBssInd2', index: formDetail.docIndex, newVal: chkValueObj.longTermValue });
				}
				if (docName == 'dSchedule1041D' || docName == 'dSch1120SchD' || docName == 'dSch1120SSchD') {
					_addImportedDataToStatements(shortTermAndLongTermObj.longTermData, formDetail, mappedColumnWithStm.longTerm, 'dCapitalGainsAndLossesAssetGrp2');
				} else {
					_addImportedDataToStatements(shortTermAndLongTermObj.longTermData, formDetail, mappedColumnWithStm.longTerm, 'dForm8949Pg2');
				}
			}
		}

		/**
		 * method prepared to mapped the data to their respective form  
		 * data - contains the data of either short term or long term array
		 * formDetail - contains form detail (i.e docName,docIndex etc) 
		 * mappedColumnWithStm - array that contains to which data are to be mapped
		 * childDocName - string that holds the docName to be added for the statements in form
		 */
		var _addImportedDataToStatements = function (data, formDetail, mappedColumnWithStm, childDocName) {
			_.forEach(data, function (obj) {
				service.addChildDoc(childDocName, formDetail).then(function (response) {
					var objkeys = _.keys(obj);
					_.forEach(mappedColumnWithStm, function (mapObj) {
						_.forEach(objkeys, function (key) {
							if (key == mapObj.propName) {
								if (['SalesPrice40', 'SalesPrice40L', 'SalesPrice', 'SalesPrice2', 'CostOrOtherBasis40', 'CostOrOtherBasis40L', 'CostOrOtherBasis', 'CostOrOtherBasis'].indexOf(key)) {
									if (obj[key] && typeof (obj[key]) == 'string') {
										obj[key] = obj[key].replace(',', '');
									}
								}
								_postTaxFieldChange({ fieldName: childDocName + '.' + mapObj.fieldName, index: response.index, newVal: { value: obj[key] } });
							}
						})
					});
				});
			});
		};

		//Stack Navigation local function START

		/**
		*This Function will help us to enable-disable flag for stack navigation
		*/
		var _publishStackNavigationFlag = function (type, isStackNavigationEnabled) {
			postal.publish({
				channel: 'MTPO-Return',
				topic: 'StackNavigation',
				data: {
					type: type,
					isStackNavigationEnabled: isStackNavigationEnabled
				}
			});
		}

		/**
		*This function will store Form data To the StackNavigation as per argument type
		*/
		var _addToStackNavigation = function (elementInStack, type) {
			if (type != undefined && type != '') {
				if (type == "previous") {
					//push data to previous array
					stackNavigation.previous.push(elementInStack);
					if (stackNavigation.previous.length == 1) {
						_publishStackNavigationFlag("previous", true)
					}
				} else if (type == "next") {
					//push data to next array
					stackNavigation.next.push(elementInStack);
					if (stackNavigation.next.length == 1) {
						_publishStackNavigationFlag("next", true);
					}
				}
			}
		}

		/**
		*This function will return Form data form the StackNavigation as per argument type
		*/
		var _getFromStackNavigation = function (type) {
			var elementInStack;
			if (type != undefined && type != '') {
				if (type == "previous") {
					//pop form data from previous array
					elementInStack = stackNavigation.previous.pop()
					//get form using docIndex and docName
					var form = _getFormFromDoc(elementInStack.docName, elementInStack.docIndex)
					elementInStack.form = angular.copy(form.form);
					if (stackNavigation.previous.length == 0) {
						_publishStackNavigationFlag("previous", false);
					}
				} else if (type == "next") {
					//pop form data from next array
					elementInStack = stackNavigation.next.pop()
					//get form using docIndex and docName
					var form = _getFormFromDoc(elementInStack.docName, elementInStack.docIndex)
					elementInStack.form = angular.copy(form.form);
					if (stackNavigation.next.length == 0) {
						_publishStackNavigationFlag("next", false)
					}
				}
			}
			return elementInStack;
		}

		/**
		*This function will help us to blank next stack navigation
		*/
		var _blankNextStackNavigation = function () {
			//blank next
			stackNavigation.next = [];
			//disable next button
			_publishStackNavigationFlag("next", false);
		}

		/**
		*This Function is used to delete form from stack navigation
		*/
		var _removeDeletedFormFromStackNavigation = function (docIndex) {
			//remove deleted from from previous stack navigation
			stackNavigation.previous = _.remove(stackNavigation.previous, function (obj) {
				if (obj.docIndex != docIndex) {
					return obj;
				}
			});
			//if after deletd length is 0 of previous stack navigation then disable previous button
			if (stackNavigation.previous.length == 0) {
				_publishStackNavigationFlag("previous", false);
			}
			//remove deleted from from next stack navigation
			stackNavigation.next = _.remove(stackNavigation.next, function (obj) {
				if (obj.docIndex != docIndex) {
					return obj;
				}
			});
			//if after deletd length is 0 of next stack navigation then disable next button
			if (stackNavigation.next.length == 0) {
				_publishStackNavigationFlag("next", false)
			}
		}

		//stackNavigation local function END

		//Calculator local function START

		/**
		*This Function will help us to store focused field Object
		**/
		var _storeObjectOfFocusedField = function (currentValue) {
			objectOfFocusedField = currentValue;
		}

		/**
		*This Function will return focused field Object
		**/
		var _getObjectOfFocusedField = function () {
			return objectOfFocusedField;
		}

		//Calculator local function END

		/**
		 * method to get the value from the taxReturn header
		 * It will return the value of the respective key but if the key is name of the object than it will sent complete object 
		 * @param key - is the header property whose value is required
		 * @param obj - is the object where we have to search the key
		 */
		service.getValueFromHeader = function (key, obj) {
			var obj = (_.isUndefined(obj)) ? _taxReturn.header : obj;
			for (var i in obj) {
				if (!obj.hasOwnProperty(i)) continue;
				if (typeof obj[i] == 'object') {
					if (i == key) {
						return obj[i];
					} else {
						service.getValueFromHeader(key, obj[i]);
					}
				} else if (i == key) {
					return obj[i];
				}
			}
		};

		/**
		 * method to set the value to the header property
		 * @param key - is the header property name or object name in header
		 * @param value - is the value to be assign to header property and if it is object than complete object is to be sent
		 * (for eg :- if the key=client and want to set the first name then in value the complete object of client is to be sent(i.e firstName,lastName,ssn...etc))
		 */
		service.setValueToHeader = function (key, value) {
			if (!_.isUndefined(key) && !_.isNull(key) && key != '' && !_.isUndefined(value) && !_.isNull(value)) {
				_taxReturn.header[key] = value;
			}
			return value;
		};

		/**
		 * method that call the API to add or remove the return from default list
		 */
		service.manageDefaultReturn = function (action, returnId, title) {
			var deferred = $q.defer();
			returnAPIService.manageDefaultReturn(action, returnId, title).then(function (response) {
				deferred.resolve(response);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		};

		/**
		 * This method will return value of element for d1040.filstts
		 * @param elementName - name of that element
		 * @param docName - docName for which we have to get element value
		 * @param docIndex - docIndex of that doc (form)
		 * @param isWholeObject - If true return complete field instead of just value property
		 */
		service.getElementValue = function (elementName, docName, docIndex, isWholeObject) {
			var _element;

			//condition to check whether the elementName holds the '.' operator
			if (elementName.indexOf('.') > 0) {
				//split the element name from '.' operator
				var splitElementNameArr = elementName.split('.');
				docName = splitElementNameArr[0];
				elementName = splitElementNameArr[1];
				docIndex = _.keys(_taxReturn.docs[docName])[0];
			}

			//if docIndex is not available we get it from available docName
			if (_.isUndefined(docIndex) && !_.isUndefined(docName)) {
				if (!_.isUndefined(_taxReturn.docs[docName])) {
					docIndex = _.keys(_taxReturn.docs[docName])[0];
				}
			}

			//check all the available variable to get the element value
			if (!_.isUndefined(docName) && !_.isUndefined(docIndex) &&
				!_.isUndefined(_taxReturn.docs[docName]) && !_.isUndefined(_taxReturn.docs[docName][docIndex]) && !_.isUndefined(_taxReturn.docs[docName][docIndex][elementName])) {
				if (isWholeObject == true)
					return _taxReturn.docs[docName][docIndex][elementName];
				else
					return _taxReturn.docs[docName][docIndex][elementName].value;
			} else {
				return "";
			}
		};

		/**
		 * This method will return current return mode. Which was set by return controller with open return call 
		 */
		service.getReturnMode = function () {
			return _returnMode;
		}

		//Stack Navigation expose function START

		/**
		*This Function will store Object in stackNavigation  
		*/
		service.addToStackNavigation = function (elementInStack, type) {
			return _addToStackNavigation(elementInStack, type);
		}

		/**
		*This Function will return object from StackNvigation 
		*/
		service.getFromStackNavigation = function (type) {
			var elementInStack = _getFromStackNavigation(type);
			return elementInStack;
		}

		/**
		*This function will help us to blank next stack navigation
		*/
		service.blankNextStackNavigation = function () {
			return _blankNextStackNavigation();
		}

		//stackNavigation expose function END

		//Calculator expose function START

		/**
		*This Function will help us to store focused field Object
		*/
		service.storeObjectOfFocusedField = function (currentValue) {
			return _storeObjectOfFocusedField(currentValue);
		}

		/**
		*This Function return focused field Object
		*/
		service.getObjectOfFocusedField = function () {
			var fieldValue = _getObjectOfFocusedField();
			return fieldValue;
		}

		/**
		*This Function is used to get value of focused field
		*/
		service.captureFieldValue = function (isWholeObject) {
			var fieldValue = service.getElementValue(objectOfFocusedField.elementId, objectOfFocusedField.docName, objectOfFocusedField.docIndex, isWholeObject);
			return fieldValue;
		}

		//Calculator Expose Function END

		/**
		 * method that store the status of all tab of interview in the interview object of _taxReturn
		 * @param interviewAllTabStatus - holds the object of tab status with tab Id as its key
		 */
		service.saveInterviewAllTabStatus = function (interviewAllTabStatus) {
			_taxReturn.interview = interviewAllTabStatus;
		};

		/**
		 *  This mnethod will update/add field in MainInfo having states with their refund value 
		 */
		var addStateRefundsInMainInfo = function () {
			if (_packageName != undefined && _packageName == '1040') {
				//Get States that are already added in return
				var statesWithRefund = [];

				//Loop each record
				_.forEach(_addedStates, function (state) {
					if (state.name != undefined && state.name != '' && Number.parseInt(state.stateRefund) > 0) {
						statesWithRefund.push({ name: state.name, refund: state.stateRefund });
					}
				});

				//Update this details to mainInfo
				var keys = _.keys(_taxReturn.docs.dMainInfo);
				_taxReturn.docs.dMainInfo[keys[0]].statesWithRefund = { value: JSON.stringify(statesWithRefund) };
			}
		}

		/**
		 * this method is use for get statsic information of svg and metaInformation for preview
		 */
		var _getPreviewInfo = function (forms, isGetField) {
			var deferred = $q.defer();
			try {
				contentService.getPreviewInformation(forms, isGetField).then(function (response) {
					deferred.resolve(response);
				}, function (error) {
					$log.error(error);
					deferred.reject(error);
				})
			} catch (e) {
				deferred.resolve();
			}
			return deferred.promise;
		}

		/**
		 * method that will just return the interview object form _taxReturn
		 */
		service.getInterviewAllTabStatus = function () {
			if (!_.isUndefined(_taxReturn) && !_.isNull(_taxReturn) && !_.isUndefined(_taxReturn.interview))
				return _taxReturn.interview;
			else
				return {};
		};

		// get tax return
		service.getTaxReturn = function () {
			return angular.copy(_taxReturn);
		}

		service.getTPNameAndCellNumber = function () {
			var packageName = _taxReturn.header.packageNames[0];
			var config = {
				"1040": {
					"propName": "dMainInfo",
					"number": "strtpcellfax",
					"name": ["tpFNam", "tplnm"]
				},
				"1065": {
					"propName": "d1065CIS",
					"number": "Phone",
					"name": "PartnerName"
				},
				"1041": {
					"propName": "d1041CIS",
					"number": "PhoneNumber",
					"name": "Nameofestate"
				},
				"1120": {
					"propName": "d1120CCIS",
					"number": "PhoneNumber",
					"name": "NameofCorporation"
				},
				"1120s": {
					"propName": "d1120SCIS",
					"number": "PhoneNumber",
					"name": "NameofSCorporation"
				},
				"990": {
					"propName": "d990CIS",
					"number": "Phone",
					"name": "PartnerName"
				}
			}
			var propName = config[packageName]['propName'];
			var keys = _.keys(_taxReturn.docs[propName]);
			var doc = _taxReturn.docs[propName][keys[0]];
			if (packageName === '1040') {
				var tpName = doc[config[packageName]['name'][0]]['value'] + ' ' + doc[config[packageName]['name'][1]]['value'];;
			} else {
				var tpName = doc[config[packageName]['name']]['value'];
			}
			var phone;
			if (!_.isUndefined(doc[config[packageName]['number']])) {
				phone = doc[config[packageName]['number']]['value'];
			}
			return { 'name': tpName, 'number': phone };
		}

		// SERVICE TO FETCH SSN AND EMAIL
		service.getTaxReturnSSNAndEmail = function () {
			if (_taxReturn && _taxReturn.header && _taxReturn.header.client) {
				return {
					ssn: _taxReturn.header.client.ssn ? _taxReturn.header.client.ssn : undefined,
				}
			} else {
				return {}
			}
		}

		// get value of converted return flag
		service.getIsConvertedReturn = function () {
			return isConvertedReturn
		}
		// set value of converted return flag
		service.setIsConvertedReturn = function (val) {
			isConvertedReturn = val;
		}

		service.getTaxReturnDetails = function () {
			if (_taxReturn && _taxReturn.header && _taxReturn.header.client) {
				return {
					taxpayer: {
						firstName: _taxReturn.header.client.firstName,
						lastName: _taxReturn.header.client.lastName,
						ssn: _taxReturn.header.client.ssn,
						email: _taxReturn.header.client.email,
						usAddress: {
							street: _taxReturn.header.client.usAddress.street,
							city: _taxReturn.header.client.usAddress.city,
							state: _taxReturn.header.client.usAddress.state,
							zipCode: _taxReturn.header.client.usAddress.zip,
						}
					},
					spouse: {
						firstName: _taxReturn.header.client.spouseFirstName,
						lastName: _taxReturn.header.client.spouseLastName,
						usAddress: {
							street: _taxReturn.header.client.usAddress.street,
							city: _taxReturn.header.client.usAddress.city,
							state: _taxReturn.header.client.usAddress.state,
							zipCode: _taxReturn.header.client.usAddress.zip,
						}
					}

				}
			} else {
				return {}
			}
		}

		service.sendSignatureOrReviewRequest = function (data) {
			var deferred = $q.defer();
			data.returnId = _taxReturn.header.id;
			//load list from data api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/clientPortal/sendSignatureOrReviewRequest',
				data: data
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};

		service.getFileNameForRemoteSign = function (printType) {
			return getFileNameForPrinting(printType);
		}

		/**
		 * This function will return taxpayer firstname, lastname and ssn data to pass it to sendReturnToSupport dialog.
		 */
		service.getSendReturnToSupportData = function () {
			if (_taxReturn.header.packageNames[0].toString() == "1040") {
				return { firstName: _taxReturn.header.client.firstName, lastName: _taxReturn.header.client.lastName, ssn: _taxReturn.header.client.ssn, packageName: 1040 };
			} else {
				return { companyName: _taxReturn.header.client.companyName, packageName: _taxReturn.header.packageNames[0] }
			}
		}

		service.getStateOfReturn = function () {
			return _taxReturn.header.states;
		}
		// set mapping of oldValue and new Value Non Resi wkt
		service.nonResiWktHistory = function () {
			if (_taxReturn && _taxReturn.header && (_taxReturn.header.nonResiHistory == undefined || _taxReturn.header.nonResiHistory == '')) {
				var fields = nonResiWktFields
				var nonResiWktHistory = {}
				for (var i10 = 0; i10 < fields['taxpayer'].length; i10++) {
					nonResiWktHistory[fields['taxpayer'][i10].fieldName] = {
						'primary': service.getElementValue(fields['taxpayer'][i10].fieldName, 'dNonResi')
					}
				}
				for (var i10 = 0; i10 < fields['spouse'].length; i10++) {
					nonResiWktHistory[fields['spouse'][i10].fieldName] = {
						'primary': service.getElementValue(fields['spouse'][i10].fieldName, 'dNonResi')
					}
				}
				_taxReturn.header.nonResiHistory = nonResiWktHistory
			}
		}

		// find any change on non resi wrk after recal 
		service.ChangeOnNonResiWkt = function () {
			var changes = []
			if (_taxReturn && _taxReturn.header && _taxReturn.header.nonResiHistory) {
				for (var i10 = 0; i10 < nonResiWktFields['taxpayer'].length; i10++) {
					var fieldConfig = angular.copy(nonResiWktFields['taxpayer'][i10]);
					var currentValue = service.getElementValue(fieldConfig.fieldName, 'dNonResi');
					var nonResField = _taxReturn.header.nonResiHistory[fieldConfig.fieldName];
					var fieldVal = (nonResField == undefined || nonResField == '') ? {} : nonResField;
					if (fieldVal.diff == undefined && currentValue != fieldVal.primary) {
						fieldConfig.diff = currentValue;
						fieldVal.diff = currentValue;
						fieldConfig.primary = fieldVal.primary
						changes.push(fieldConfig)
					}
				}
				for (var i11 = 0; i11 < nonResiWktFields['spouse'].length; i11++) {
					var fieldConfig = angular.copy(nonResiWktFields['spouse'][i11]);
					var currentValue = service.getElementValue(fieldConfig.fieldName, 'dNonResi');
					var nonResField = _taxReturn.header.nonResiHistory[fieldConfig.fieldName];
					var fieldVal = (nonResField == undefined || nonResField == '') ? {} : nonResField;
					if (fieldVal.diff == undefined && currentValue != fieldVal.primary) {
						fieldConfig.diff = currentValue;
						fieldVal.diff = currentValue;
						fieldConfig.primary = fieldVal.primary
						changes.push(fieldConfig)
					}
				}
				return changes;
			} else {
				return changes;
			}
		}

		// find statement docName for perform review
		service.getStatementDocIndex = function (stateActiveFormArray) {
			//array holding childForms and statements
			var childForms = [];
			if (stateActiveFormArray.length > 0) {
				// Loop through all docs, this will contain name and object of a doc
				_.forEach(_taxReturn.docs, function (docObjects, docName) {
					if (docName != 'count') {
						//Doc object will be type of array in objects, so, loop through all doc objects, find if parent of doc and form.docIndex match
						_.forEach(docObjects, function (docObject, docIndex) {
							for (var i = 0; i < stateActiveFormArray.length; i++) {
								if (!_.isUndefined(docObject) && (!_.isEmpty(docObject.parent) || !_.isNull(docObject.parent)) && !_.isUndefined(docObject.parent) && ((parseInt(docObject.parent[0]) == stateActiveFormArray[i]) || (parseInt(docObject.parent) == stateActiveFormArray[i]))) {
									//do not include docs if it is already included
									if (childForms.includes(docName) == false) {
										childForms.push(docName);
									}
								}
							}
						});
					}
				});
			}
			return childForms;

		}

		// to send return to QA tool
		service.importReturnToQATool = function () {
			var deffered = $q.defer();
			//Call to print post api
			$http({
				method: 'POST',
				url: dataAPI.testingtool_url + '/testCase/createTestCase',
				data: { "data": _taxReturn }
			}).then(function (result) {
				deffered.resolve();
			}, function (error) {
				deffered.reject();
			})
			return deffered.promise;
		}

		service.restoreReturnByJsonData = function (jsonData) {
			var deferred = $q.defer();
			_taxReturn.header.packageNames = jsonData.header.packageNames;
			_taxReturn.header.states = jsonData.header.states;
			_taxReturn.docs = jsonData.docs;
			_taxReturn.forms = jsonData.forms;
			if (jsonData != undefined && jsonData.interview != undefined) {
				_taxReturn.interview = jsonData.interview;
			}
			_loadReturn().then(function () {
				deferred.resolve();
			}, function (error) {
				deferred.reject(error)
			});

			return deferred.promise;
		}

		// prepare objcet to send to print preview app.
		service.getDataToSendToPrintPreview = function () {
			var previewObj = _taxReturn ? JSON.parse(JSON.stringify(_taxReturn.docs)) : {};
			previewObj["taxYear"] = userService.getTaxYear();
			previewObj["packageName"] = docIndexOfCurrentLoadedForm.form.packageName;
			previewObj["docName"] = docIndexOfCurrentLoadedForm.form.docName;
			previewObj["stateName"] = _getFormProp(docIndexOfCurrentLoadedForm.form.formName).state.toLowerCase();
			previewObj["instance"] = docIndexOfCurrentLoadedForm.form.docIndex;
			return previewObj;
		}

		// send email for  printed Depriciation
		service.emailDepriciation = function (jsonData) {
			var deffered = $q.defer();
			//Call to print post api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/return/emailAsset',
				data: jsonData
			}).then(function (result) {
				deffered.resolve();
			}, function (error) {
				deffered.reject();
			})
			return deffered.promise;
		}

		// to find and return active k1s for particular return based on given docName.(used to dispaly k1s in transmit return dialog)
		service.getActiveK1sFromDocName = function (docObj) {
			var taxReturn = JSON.parse(JSON.stringify(_taxReturn));
			var activeK1s = [];
			if (docObj.docName && taxReturn.docs[docObj.docName] && Object.keys(taxReturn.docs[docObj.docName]).length > 0) {
				_.forEach(Object.keys(taxReturn.docs[docObj.docName]), function (docIndex) {
					var form = _.filter(taxReturn.forms, { "docIndex": parseInt(docIndex) })[0];
					if (form && form.extendedProperties && (form.extendedProperties.formStatus === 'Active' || form.extendedProperties.formStatus === 'Required')) {
						var displayName = "";
						if (docObj.prefixField && docObj.prefixField !== "" && taxReturn.docs[docObj.docName][docIndex][docObj.prefixField]) {
							displayName = form.extendedProperties.displayName + "(" + taxReturn.docs[docObj.docName][docIndex][docObj.prefixField].value + ")";
						} else {
							displayName = form.extendedProperties.displayName;
						}
						activeK1s.push({ "displayName": displayName, "docIndex": docIndex });
					}
				})
			}
			return activeK1s;
		}

		/**
		 * this function is used to open dialog on disabled field
		 */
		service.openDialogOnDisabledField = function () {
			var textMsg = "This field is calculated by the software and may not be changed.";
			//Dialog configuration
			var dialogConfig = { "title": "Notification", "text": textMsg };
			//Show dialog
			dialogService.openDialog("notify", { 'keyboard': true, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' }, dialogConfig);
		}

		//This function is used to open confirm dialog while deleting the form or close the return
		service.openConfirmDialog = function (type, dialogText) {
			var deferred = $q.defer();
			//hold user details
			var _userDetails = userService.getUserDetails();

			//flag that used to decide will we need to open dialog
			var isopenDialog = false;
			//check user preferences
			if (!_.isUndefined(_userDetails) && !_.isUndefined(_userDetails.settings) && !_.isUndefined(_userDetails.settings.preferences) && !_.isUndefined(_userDetails.settings.preferences.returnWorkspace) && (_userDetails.settings.preferences.returnWorkspace.doNotAskforConfirmDlg != true)) {
				isopenDialog = true;
			} else if (_.isUndefined(_userDetails) || _.isUndefined(_userDetails.settings) || _.isUndefined(_userDetails.settings.preferences) || _.isUndefined(_userDetails.settings.preferences.returnWorkspace)) {
				isopenDialog = true;
			}
			//check if dialog flag is true
			if (isopenDialog == true) {
				//object that holds dialog title and text
				var data;
				switch (type) {
					case 'removeForm':
						data = { "text": "Do you want to delete this form?" };
						break;
					case 'closeReturn':
						data = { "text": "Do you want to close this return?" };
						break;
					case 'removeStatement':
						data = { "text": dialogText }
						break;
				}
				//open confirm dialog for remove form  or close return
				var dialog = dialogService.openDialog("custom", { 'keyboard': true, 'backdrop': false, 'size': 'sm' }, "taxAppJs/return/workspace/partials/dialog/confirmDialog.html", "confirmationDialogController", data);
				dialog.result.then(function (result) {
					var formattedData = {};
					formattedData['key'] = 'confirmDialogDetails';
					formattedData['value'] = result;
					//save data to user preference
					service.setPreferences(_userDetails, formattedData).then(function () {
					}, function (error) {
					});
					if (result.buttonType == 'yes') {
						deferred.resolve(true)
					}
				});
			} else {//if user already set confirm dialog flag true them this part will be executed
				deferred.resolve(true);
			}

			return deferred.promise;
		}

		/**
         * this Function set user Preferences for Printing
         * @userDetails
         * @isPasswordProtectedPDF(true or false)
         */
		service.setPreferences = function (userDetails, data) {
			var deferred = $q.defer();
			//format object for autoAddState
			var autoAddState = {};
			//format object password protected details
			var passwordProtectedDetails = {};
			// Change Settings : pass propertyName and value to have updated in userdocument
			if (_.isUndefined(userDetails.settings) && _.isEmpty(userDetails.settings)) {
				userDetails.settings = {};
			}
			if (_.isUndefined(userDetails.settings.preferences)) {
				userDetails.settings.preferences = {};
			}
			if (_.isUndefined(userDetails.settings.preferences.returnWorkspace)) {
				userDetails.settings.preferences.returnWorkspace = {};
			}


			switch (data.key) {
				case 'autoAddState':
					//create autoAddState property if not exist
					if (_.isUndefined(userDetails.settings.preferences.returnWorkspace.autoAddState)) {
						userDetails.settings.preferences.returnWorkspace.autoAddState = {};
					}

					//make all checked or unchecked as per user's choice
					userDetails.settings.preferences.returnWorkspace.autoAddState = data.configData;
					break;
				case 'pdfPasswordDetails':
					if (!_.isUndefined(data.value)) {
						passwordProtectedDetails = data.value;
					}
					if (!_.isUndefined(passwordProtectedDetails) && (_.isUndefined(passwordProtectedDetails.isPasswordProtectedPDF) || passwordProtectedDetails.isPasswordProtectedPDF == false)) {
						passwordProtectedDetails.isPasswordProtectedPDF = false;
					}
					userDetails.settings.preferences.returnWorkspace['isPasswordProtectedPDF'] = passwordProtectedDetails.isPasswordProtectedPDF;
					if (!_.isUndefined(passwordProtectedDetails.isProtectedDefaultPassword)) {
						userDetails.settings.preferences.returnWorkspace['isCustomPassword'] = !passwordProtectedDetails.isProtectedDefaultPassword;
					}
					break;
				case 'confirmDialogDetails':
					userDetails.settings.preferences.returnWorkspace.doNotAskforConfirmDlg = data.value.doNotAsk;
					break;
			}

			// this is function update preferences for database
			userService.changeSettings('preferences', userDetails.settings.preferences).then(function (response) {
				switch (data.key) {
					case 'pdfPasswordDetails':
						deferred.resolve({ isPasswordProtectedPDF: passwordProtectedDetails.isPasswordProtectedPDF, customPassword: passwordProtectedDetails.customPassword });
						break;
					default: deferred.resolve({});
						break;
				}
			}, function (error) {
				deferred.resolve(false);
			});
			return deferred.promise;
		};

		// This function is used to return accepted states array to create amended for that state in case of amended copy is created.
		service.getAcceptedstateForCreateAmended = function () {
			var acceptedStates = [];
			if (_taxReturn.header && _taxReturn.header.eFileStatus) {
				_.forEach(Object.keys(_taxReturn.header.eFileStatus), function (state) {
					_.forEach(Object.keys(_taxReturn.header.eFileStatus[state]), function (key) {
						if (_taxReturn.header.eFileStatus[state][key]["returnTypeCategory"] === "MainForm" && _taxReturn.header.eFileStatus[state][key]["status"] === 9) {
							if (acceptedStates.indexOf(state) < 0) {
								acceptedStates.push(state);
							}
						}
					})
				})
			}
			return acceptedStates;
		}

		// This function is used to set amended created flag fro this return after amended config created we have set this flag to true.
		service.setAmendedCreatedFlag = function (value) {
			if (!_.isUndefined(_taxReturn.header.isAmendedCreated)) {
				_taxReturn.header.isAmendedCreated = value;
			}
		}

		// This function is used to return amended creation flagh.
		service.getAmendedCreatedFlag = function () {
			return _taxReturn.header.isAmendedCreated;
		}

		service.saveReturnSubmissionIds = function (submissionIds) {
			var deferred = $q.defer();
			//load list from data api
			$http({
				method: 'POST',
				url: dataAPI.base_url + '/return/submissionId/save',
				data: {
					returnId: _taxReturn.header.id,
					submissionIds: submissionIds
				}
			}).then(function (response) {
				deferred.resolve(response.data.data);
			}, function (error) {
				$log.error(error);
				deferred.reject(error);
			});
			return deferred.promise;
		};
		/**
		 * @author Hannan Desai
		 * @description
		 * 			This function is used to check for amended return than amended from is added or not if not than add and load this form on return open.
		 */
		service.getSubType = function () {
			return _taxReturn.header.subType;
		}

		return service;
	}]);