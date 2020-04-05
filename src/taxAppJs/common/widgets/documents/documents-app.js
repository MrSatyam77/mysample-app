﻿"use strict";
var documentsWidget = angular.module("documentsWidget", []);

//Service
documentsWidget.factory('documentsService', ['$q', '$log', '$http', 'Upload', 'dataAPI', function ($q, $log, $http, Upload, dataAPI) {
  var documentsService = { documentList: [] };
  //method to get document list
  documentsService.getDocumentList = function () {
    var deferred = $q.defer();
    //load list from data api
    $http({
      method: 'POST',
      url: dataAPI.base_url + '/documentmanager/list',
    }).then(function (response) {
      deferred.resolve(response.data.data);
      documentsService.documentList = response.data.data;
    }, function (error) {
      $log.error(error);
      deferred.reject(error);
    });
    return deferred.promise;
  };
  documentsService.removeDocument = function (key) {
    var deferred = $q.defer();
    //load list from data api
    $http({
      method: 'POST',
      url: dataAPI.base_url + '/documentmanager/remove',
      data: {
        key: key
      },
    }).then(function (response) {
      deferred.resolve(response.data.data);
      documentsService.documentList = _.reject(documentsService.documentList, function (document) {
        return document.key === key;
      });
    }, function (error) {
      $log.error(error);
      deferred.reject(error);
    });
    return deferred.promise;
  };

  documentsService.uploadDocument = function (file, type, documentReturnId, documentDocName, docIndex, lineNo, lineText, description) {
    var deferred = $q.defer();
    Upload.upload({
      url: dataAPI.base_url + '/documentmanager/upload',
      fields: {
        upload: {
          type: type,
          returnId: documentReturnId,
          docName: documentDocName,
          docIndex: docIndex,
          date: new Date().toUTCString(),
          lineNo: lineNo,
          lineText: lineText,
          description: description
        }
      },
      file: file,
    }).then(function (response) {
      deferred.resolve(response);
    }, function (error) {
      $log.log(error);
      deferred.reject(error);
    }, function (update) {
      deferred.notify(parseInt(100.0 * update.loaded / update.total) > 90 ? 90 : parseInt(100.0 * update.loaded / update.total));
    });
    return deferred.promise;
  };
  documentsService.returnFilteredDocList = function (returnId) {
    var _filteredList = _.filter(documentsService.documentList, { returnId: returnId });
    if (_filteredList == undefined) {
      return [];
    }
    return _filteredList;
  }
  return documentsService;
}]);
//Directive
documentsWidget.directive('documents', [function () {
  return {
    restrict: 'AE',
    templateUrl: 'taxAppJs/common/widgets/documents/partials/documents-template.html',
    controller: ['$scope', '$log', '$q', '$routeParams', 'messageService', 'documentsService', 'userService', 'dataAPI', 'localeService', 'dialogService', 'environment', function ($scope, $log, $q, $routeParams, messageService, documentsService, userService, dataAPI, localeService, dialogService, environment) {
      // get current tax year.
      $scope.taxYear = userService.getTaxYear();

      //variable iniliazation start
      var docLineList =
        // DON'T DELETE START AND END COMMENT. IT IS USED BY CODE GENERATOR. THANKS :)
        //start binary attachment config
[
	{
		"docName": "MainForm",
		"line": [
			{
				"key": "1",
				"value": "Divorce Decree"
			},
			{
				"key": "2",
				"value": "Birth Certificate"
			},
			{
				"key": "3",
				"value": "Death Certificate"
			},
			{
				"key": "4",
				"value": "Hospital Medical Record"
			},
			{
				"key": "5",
				"value": "Form 1040 - Other"
			}
		]
	},
	{
		"docName": "dSchA",
		"line": [
			{
				"key": "6",
				"value": "Motor Vehicle Boat Airplane Contribution Excess Of 50"
			},
			{
				"key": "7",
				"value": "Sch A - Other"
			}
		]
	},
	{
		"docName": "dSchC",
		"line": [
			{
				"key": "8",
				"value": "Sch C"
			}
		]
	},
	{
		"docName": "dSchD",
		"line": [
			{
				"key": "9",
				"value": "Qualified Replacement Property Purchase Statement"
			},
			{
				"key": "10",
				"value": "ESOP Or Coop Stock Purchase Consent"
			},
			{
				"key": "11",
				"value": "Sch D - Other"
			}
		]
	},
	{
		"docName": "dSchE",
		"line": [
			{
				"key": "12",
				"value": "Sch E"
			}
		]
	},
	{
		"docName": "dSchH",
		"line": [
			{
				"key": "13",
				"value": "Sch H"
			}
		]
	},
	{
		"docName": "d2210",
		"line": [
			{
				"key": "14",
				"value": "Retirement Documentation"
			},
			{
				"key": "15",
				"value": "Disability Documentation"
			},
			{
				"key": "49",
				"value": "Police Report"
			},
			{
				"key": "50",
				"value": "Insurance Report"
			},
			{
				"key": "16",
				"value": "Form 2210 - Other"
			}
		]
	},
	{
		"docName": "d2848",
		"line": [
			{
				"key": "17",
				"value": "Power of Attorney"
			},
			{
				"key": "18",
				"value": "Form 2848 - Other"
			}
		]
	},
	{
		"docName": "d3115",
		"line": [
			{
				"key": "19",
				"value": "Form 3115 - Change in Accounting Method"
			},
			{
				"key": "20",
				"value": "Form 3115 - Other"
			}
		]
	},
	{
		"docName": "d3468",
		"line": [
			{
				"key": "21",
				"value": "Form 3468"
			}
		]
	},
	{
		"docName": "d3468",
		"line": [
			{
				"key": "23",
				"value": "Form 3468"
			}
		]
	},
	{
		"docName": "d4684",
		"line": [
			{
				"key": "24",
				"value": "Form 4684"
			}
		]
	},
	{
		"docName": "d4970",
		"line": [
			{
				"key": "25",
				"value": "Form 4970"
			}
		]
	},
	{
		"docName": "d5471",
		"line": [
			{
				"key": "27",
				"value": "Form 5471"
			}
		]
	},
	{
		"docName": "dSch5471SchO",
		"line": [
			{
				"key": "28",
				"value": "Form 5471 Sch O"
			},
			{
				"key": "Chart",
				"value": "Additional information Organizational Chart"
			}
		]
	},
	{
		"docName": "d8283",
		"line": [
			{
				"key": "29",
				"value": "Form 8283 - Signature Document"
			},
			{
				"key": "30",
				"value": "Historic Property Appraisal"
			},
			{
				"key": "31",
				"value": "Photograph"
			},
			{
				"key": "32",
				"value": "Development Restriction Description"
			},
			{
				"key": "33",
				"value": "Donee Organization Contemporaneous Written Acknowledgement"
			},
			{
				"key": "34",
				"value": "Form1098C"
			},
			{
				"key": "35",
				"value": "Art Appraisal"
			},
			{
				"key": "36",
				"value": "Qualified Appraisal"
			},
			{
				"key": "37",
				"value": "Form 8283 - Other"
			}
		]
	},
	{
		"docName": "d8332",
		"line": [
			{
				"key": "38",
				"value": "Form 8332 - Release of Exemption"
			},
			{
				"key": "39",
				"value": "Form 8332 - Other"
			}
		]
	},
	{
		"docName": "d8864",
		"line": [
			{
				"key": "40",
				"value": "Form 8864"
			}
		]
	},
	{
		"docName": "d8865",
		"line": [
			{
				"key": "41",
				"value": "Form 8865"
			}
		]
	},
	{
		"docName": "d8938",
		"line": [
			{
				"key": "44",
				"value": "Form 8938"
			}
		]
	},
	{
		"docName": "d8949",
		"line": [
			{
				"key": "46",
				"value": "Form 8949 Exception Reporting Statement"
			},
			{
				"key": "47",
				"value": "Form 8949 - Other"
			}
		]
	},
	{
		"docName": "dNYIT602",
		"line": [
			{
				"key": "Certificate",
				"value": "Claim for EZ Capital Tax Credit"
			}
		]
	},
	{
		"docName": "dNYIT606",
		"line": [
			{
				"key": "3",
				"value": "it606 Certificate Of Eligibility"
			},
			{
				"key": "4",
				"value": "IT606 Empire Zone Retention Certificate"
			}
		]
	},
	{
		"docName": "dNYIT611",
		"line": [
			{
				"key": "Certificate",
				"value": "Claim for Brownfield Cleanup Program"
			},
			{
				"key": "Certificate",
				"value": "Brownfield Redevelopment Tax Credit - Certificate of Completion"
			},
			{
				"key": "Certificate",
				"value": "Brownfield Redevelopment Tax Credit - Sale or Transfer Documentation"
			}
		]
	},
	{
		"docName": "dNYIT6111",
		"line": [
			{
				"key": "5",
				"value": "Brownfield Redevelopment Tax Credit - Sale or Transfer Documentation"
			}
		]
	},
	{
		"docName": "dNYIT603",
		"line": [
			{
				"key": "1",
				"value": "IT603 Empire Zone Retention Certificate"
			},
			{
				"key": "2",
				"value": "it603 Certificate Of Eligibility"
			}
		]
	},
	{
		"docName": "dNYIT634",
		"line": [
			{
				"key": "Certificate",
				"value": "Empire State Jobs Retention Program Credit"
			},
			{
				"key": "Certificate",
				"value": "IT-634 Job Certificate"
			}
		]
	},
	{
		"docName": "dNYIT642",
		"line": [
			{
				"key": "Certificate",
				"value": "Empire State Musical and Theatrical Production Credit"
			}
		]
	},
	{
		"docName": "dOK512SA",
		"line": [
			{
				"key": "Agreement",
				"value": "Nonresident Shareholder Agreement"
			}
		]
	},
	{
		"docName": "d1065",
		"line": [
			{
				"key": "IRS1065",
				"value": "U.S. Return of Partnership Income"
			},
			{
				"key": "Business",
				"value": "Tax Return Questionnaire"
			}
		]
	},
	{
		"docName": "d1120S",
		"line": [
			{
				"key": "IRS1120S",
				"value": "U.S. Income Tax Return for an S Corporation"
			},
			{
				"key": "Business",
				"value": "Tax Return Questionnaire"
			},
			{
				"key": "AutomaticExtensionofTime",
				"value": "Application for Automatic Extension of Time to File"
			},
			{
				"key": "Form_2553",
				"value": "Form 2553"
			},
			{
				"key": "8990",
				"value": "Business Interest Expense Under Section 163(j)"
			}
		]
	},
	{
		"docName": "dSchWVFIIATCS",
		"line": [
			{
				"key": "1",
				"value": "SCHEDULE WV/FIIA-TCS"
			},
			{
				"key": "credit",
				"value": "Schedule FIIA-TCS"
			}
		]
	},
	{
		"docName": "dSchWVRBICA",
		"line": [
			{
				"key": "credit",
				"value": "Schedule RBIC"
			},
			{
				"key": "Qualifiedrehabilitationexpenditurescertificationcertificate",
				"value": "Qualified rehabilitation expenditures certification certificate"
			}
		]
	},
	{
		"docName": "dSchWVSRDTC1",
		"line": [
			{
				"key": "credit",
				"value": "Schedule SRDTC-1"
			}
		]
	},
	{
		"docName": "dMDEL101",
		"line": [
			{
				"key": "Certificate",
				"value": "DECLARATION FOR ELECTRONIC FILING"
			}
		]
	},
	{
		"docName": "dMDEL102",
		"line": [
			{
				"key": "Certificate",
				"value": "Income Tax Payment For Electronic Filers"
			}
		]
	},
	{
		"docName": "dMDForm500CR",
		"line": [
			{
				"key": "Certificate1",
				"value": "500CR Part A CREDIT FOR ECONOMICALLY DISADVANTAGED EMPLOYEES NOT LOCATED IN A FOCUS AREA"
			},
			{
				"key": "Certificate2",
				"value": "500CR Part B HEALTH ENTERPRISE ZONE HIRING TAX CREDIT"
			},
			{
				"key": "Certificate3",
				"value": "500CR Part D JOB CREATION TAX CREDIT"
			},
			{
				"key": "Certificate4",
				"value": "500CR Part E COMMUNITY INVESTMENT TAX CREDIT"
			},
			{
				"key": "Certificate5",
				"value": "500CR Part G QUALIFIED VEHICLE TAX CREDIT"
			},
			{
				"key": "Certificate6",
				"value": "500CR Part H CYBERSECURITY INVESTMENT INCENTIVE TAX CREDIT"
			},
			{
				"key": "Certificate7",
				"value": "500CR Part J MARYLAND EMPLOYER SECURITY CLEARANCE COSTS TAX CREDIT"
			},
			{
				"key": "Certificate8",
				"value": "500CR Part K RESEARCH AND DEVELOPMENT TAX CREDITS"
			},
			{
				"key": "Certificate9",
				"value": "500CR Part L BIOTECHNOLOGY INVESTMENT INCENTIVE TAX CREDIT"
			},
			{
				"key": "Certificate10",
				"value": "500CR Part N CLEAN ENERGY INCENTIVE TAX CREDIT"
			},
			{
				"key": "Certificate11",
				"value": "500CR Part O MARYLAND-MINED COAL TAX CREDIT"
			},
			{
				"key": "Certificate12",
				"value": "500CR Part Q OYSTER SHELL RECYCLING TAX CREDIT"
			},
			{
				"key": "Certificate13",
				"value": "500CR Part R BIO-HEATING OIL TAX CREDIT"
			},
			{
				"key": "Certificate14",
				"value": "500CR Part S CELLULOSIC ETHANOL TECHNOLOGY RESEARCH AND DEVELOPMENT TAX CREDIT"
			},
			{
				"key": "Certificate16",
				"value": "500CR Part T WINERIES AND VINEYARDS TAX CREDIT"
			},
			{
				"key": "Certificate17",
				"value": "500CR Part U MARYLAND FILM PRODUCTION EMPLOYMENT TAX CREDIT"
			},
			{
				"key": "Certificate18",
				"value": "500CR Part V ENDOW MARYLAND TAX CREDIT"
			},
			{
				"key": "Certificate19",
				"value": "500CR Part W AEROSPACE, ELECTRONICS, OR DEFENSE CONTRACT TAX CREDIT"
			},
			{
				"key": "Certificate20",
				"value": "500CR Part X CREDIT FOR PRESERVATION AND CONSERVATION EASEMENTS"
			},
			{
				"key": "Certificate21",
				"value": "MD 500CR Part Y FOR APPRENTICE EMPLOYEE TAX CREDIT"
			},
			{
				"key": "Certificate22",
				"value": "MD 500CR Part Z FOR QUALIFIED FARMS TAX CREDIT"
			},
			{
				"key": "Certificate23",
				"value": "MD 500CR Part AA FOR QUALIFIED VETERAN EMPLOYEES TAX CREDIT"
			}
		]
	},
	{
		"docName": "dMD502CR",
		"line": [
			{
				"key": "Certificate1",
				"value": "502 CR Part G Line 1 credit certified by the Department of Health and Mental Hygiene"
			},
			{
				"key": "Certificate2",
				"value": "502 CR Part H Community Investment Tax Credit"
			},
			{
				"key": "Certificate3",
				"value": "502 CR Part I Endow Maryland Tax Credit"
			},
			{
				"key": "Certificate4",
				"value": "502 CR Part J Preceptors In Areas With Health Care Workforce Shortages Tax Credit"
			},
			{
				"key": "Certificate5",
				"value": "502 CR Part L Local Income Tax Credit Summary"
			},
			{
				"key": "Certificate6",
				"value": "502 CR Part M Line 2 Sustainable Communities Tax Credits"
			},
			{
				"key": "Certificate7",
				"value": "502 CR Part M Line 4 IRC Section 1341 Repayment Credit"
			},
			{
				"key": "Certificate8",
				"value": "502 CR Part M Line 5 Flow-through Nonresident PTE tax"
			},
			{
				"key": "Certificate9",
				"value": "502 CR Part M Line 1 Student Loan Debt Relief Tax Credit"
			},
			{
				"key": "OtherState1",
				"value": "Other State Return 1"
			}
		]
	},
	{
		"docName": "dMD502OtherStateTaxCrWkt",
		"line": [
			{
				"key": "OtherState2",
				"value": "Other State Return 2"
			}
		]
	},
	{
		"docName": "dMDForm502S",
		"line": [
			{
				"key": "Certificate",
				"value": "502S Line 2 Credit for Heritage Structure Rehabilitation Tax Credit"
			}
		]
	},
	{
		"docName": "dMD502SU",
		"line": [
			{
				"key": "Certificate1",
				"value": "MD502SU Line va The Honorable Louis L. Goldstein Volunteer Fire, Rescue and Emergency Medical Services Personnel Subtraction Modification Program"
			},
			{
				"key": "Certificate2",
				"value": "MD502SU Line vb The Honorable Louis L. Goldstein Volunteer Police Personnel Subtraction Modification Program"
			}
		]
	},
	{
		"docName": "dMD505SU",
		"line": [
			{
				"key": "Certificate1",
				"value": "MD505SU Line va The Honorable Louis L. Goldstein Volunteer Fire, Rescue and Emergency Medical Services Personnel Subtraction Modification Program"
			},
			{
				"key": "Certificate2",
				"value": "MD505SU Line vb The Honorable Louis L. Goldstein Volunteer Police Personnel Subtraction Modification Program"
			}
		]
	},
	{
		"docName": "d8453PE",
		"line": [
			{
				"key": "8453PE",
				"value": "U.S. Partnership Declaration for an IRS e-file Return"
			}
		]
	},
	{
		"docName": "d8453B",
		"line": [
			{
				"key": "8453B",
				"value": "U.S. Electing Large Partnership Declaration for an IRS e-file Return"
			}
		]
	},
	{
		"docName": "d8453C",
		"line": [
			{
				"key": "8453C",
				"value": "U.S. S Corporation Income Tax Declaration for an IRS e-file Return"
			}
		]
	},
	{
		"docName": "d8453S",
		"line": [
			{
				"key": "8453S",
				"value": "U.S. S Corporation Income Tax Declaration for an IRS e-file Return"
			}
		]
	},
	{
		"docName": "d8453FE",
		"line": [
			{
				"key": "8453FE",
				"value": "8453"
			}
		]
	},
	{
		"docName": "dKYSchFD",
		"line": [
			{
				"key": "KYSCHFD",
				"value": "Food Donation Tax Credit"
			}
		]
	},
	{
		"docName": "d1040",
		"line": [
			{
				"key": "IRS1040",
				"value": "U. S. Individual Income Tax Return"
			}
		]
	},
	{
		"docName": "d1120C",
		"line": [
			{
				"key": "IRS1120",
				"value": "U.S. Income Tax Return for an Corporation"
			},
			{
				"key": "Business",
				"value": "Tax Return Questionnaire"
			},
			{
				"key": "Combined",
				"value": "Combined Report"
			},
			{
				"key": "Schedule",
				"value": "Schedule D"
			},
			{
				"key": "2",
				"value": "FEDERAL1120RETURN"
			},
			{
				"key": "8990",
				"value": "Business Interest Expense Under Section 163(j)"
			}
		]
	},
	{
		"docName": "dNYIT601",
		"line": [
			{
				"key": "Certificate",
				"value": "Certificate Of Eligibility"
			},
			{
				"key": "Certificate",
				"value": "EmpireZone Retention Certificate"
			}
		]
	},
	{
		"docName": "dNYIT604",
		"line": [
			{
				"key": "Certificate",
				"value": "Certificate Of Eligibility"
			},
			{
				"key": "Certificate",
				"value": "EmpireZone Retention Certificate"
			}
		]
	},
	{
		"docName": "dSchVAOSC",
		"line": [
			{
				"key": "OtherState1",
				"value": "Other State Return 1"
			},
			{
				"key": "OtherState2",
				"value": "Other State Return 2"
			}
		]
	},
	{
		"docName": "dID39NRTaxCreditWkt",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState_Return_01"
			},
			{
				"key": "OtherState2",
				"value": "OtherState_Return_01"
			}
		]
	},
	{
		"docName": "d1099R",
		"line": [
			{
				"key": "IRS1099R",
				"value": "Distributions From Pensions, Annuities, Retirement or Profit-Sharing Plans, IRAs, Insurance Contracts, etc."
			}
		]
	},
	{
		"docName": "dNYIT612",
		"line": [
			{
				"key": "Certificate",
				"value": "Remediated Brownfield Credit for Real Property Taxes - Certificate of Completion"
			}
		]
	},
	{
		"docName": "dNYIT607",
		"line": [
			{
				"key": "Certificate",
				"value": "Excelsior Jobs Program - Credit Certificate"
			}
		]
	},
	{
		"docName": "dNYIT635",
		"line": [
			{
				"key": "Certificate",
				"value": "IT-635 Youth Works Certificate"
			}
		]
	},
	{
		"docName": "dNYIT633",
		"line": [
			{
				"key": "Certificate",
				"value": "IT633 Certificate of Eligibility"
			},
			{
				"key": "Certificate",
				"value": "IT633 Preliminary Schedule Of Benefits"
			}
		]
	},
	{
		"docName": "dNYIT605",
		"line": [
			{
				"key": "Certificate",
				"value": "IT605 Certificate of Eligibility"
			},
			{
				"key": "Certificate",
				"value": "IT605 Empire Zone Retention Certificate"
			}
		]
	},
	{
		"docName": "dNYIT248",
		"line": [
			{
				"key": "Certificate",
				"value": "IT248 Certificate of tax credit"
			}
		]
	},
	{
		"docName": "dMI4895",
		"line": [
			{
				"key": "1",
				"value": "4895_LOSSADJSCHEDULE"
			}
		]
	},
	{
		"docName": "dMI4902",
		"line": [
			{
				"key": "3",
				"value": "MBTSBTRECAP"
			}
		]
	},
	{
		"docName": "dMI4891",
		"line": [
			{
				"key": "4",
				"value": "FORM 4891/4892/4908/4909 UBG MEMBER FEDERAL RETURN"
			}
		]
	},
	{
		"docName": "dSchID39NR",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState_Return_01"
			},
			{
				"key": "OtherState2",
				"value": "OtherState_Return_01"
			}
		]
	},
	{
		"docName": "dSchVACR",
		"line": [
			{
				"key": "WasteOilCredAllow",
				"value": "WasteOilCredAllow"
			},
			{
				"key": "AgriBestMngmtCrAllow",
				"value": "AgriBestMngmtCrAllow"
			},
			{
				"key": "CredAllowF301",
				"value": "CredAllowF301"
			},
			{
				"key": "TillageCredAllow",
				"value": "TillageCredAllow"
			},
			{
				"key": "FertzrCredAllow",
				"value": "FertzrCredAllow"
			},
			{
				"key": "CleanFuelVehicleCred",
				"value": "CleanFuelVehicleCred"
			},
			{
				"key": "ForeignCredAllow",
				"value": "ForeignCredAllow"
			},
			{
				"key": "BiodieselCredAllow",
				"value": "BiodieselCredAllow"
			},
			{
				"key": "TotPriorCoalEmpCred",
				"value": "TotPriorCoalEmpCred"
			},
			{
				"key": "VIRGINACOALEMPLOYMENTC",
				"value": "VIRGINACOALEMPLOYMENTC"
			}
		]
	},
	{
		"docName": "dWV100SchTC",
		"line": [
			{
				"key": "credit",
				"value": "ScheduleSRDTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleATTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleCPITC1"
			},
			{
				"key": "credit",
				"value": "ScheduleIMSTTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleRBIC"
			},
			{
				"key": "credit",
				"value": "ScheduleJ"
			},
			{
				"key": "credit",
				"value": "ScheduleEOTCA"
			},
			{
				"key": "credit",
				"value": "ScheduleEOTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleWVAG1"
			},
			{
				"key": "credit",
				"value": "ScheduleNIPA2"
			},
			{
				"key": "credit",
				"value": "ScheduleFIIATCS"
			},
			{
				"key": "credit",
				"value": "ScheduleAFTC1"
			}
		]
	},
	{
		"docName": "dWV120SchTC",
		"line": [
			{
				"key": "credit",
				"value": "ScheduleSRDTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleATTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleCPITC1"
			},
			{
				"key": "credit",
				"value": "ScheduleIMSTTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleRBIC"
			},
			{
				"key": "credit",
				"value": "ScheduleJ"
			},
			{
				"key": "credit",
				"value": "ScheduleEOTCA"
			},
			{
				"key": "credit",
				"value": "ScheduleEOTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleWVAG1"
			},
			{
				"key": "credit",
				"value": "ScheduleNIPA2"
			},
			{
				"key": "credit",
				"value": "ScheduleFIIATCS"
			},
			{
				"key": "credit",
				"value": "ScheduleAFTC1"
			},
			{
				"key": "credit",
				"value": "ScheduleMPTAC1"
			},
			{
				"key": "credit",
				"value": "ScheduleMITC"
			},
			{
				"key": "credit",
				"value": "ScheduleL"
			},
			{
				"key": "credit",
				"value": "ScheduleK"
			},
			{
				"key": "credit",
				"value": "ScheduleUNLOC1"
			},
			{
				"key": "credit",
				"value": "UB-4APTSum"
			}
		]
	},
	{
		"docName": "dAZ131",
		"line": [
			{
				"key": "CourtCertificateShowingYouAappointment",
				"value": "CourtCertificateShowingYouAappointment"
			}
		]
	},
	{
		"docName": "d5227",
		"line": [
			{
				"key": "VA5227",
				"value": "Split Interest Trust Information Return"
			}
		]
	},
	{
		"docName": "dVA770Sch4",
		"line": [
			{
				"key": "OtherState2",
				"value": "Other State Return 2"
			}
		]
	},
	{
		"docName": "dVA770",
		"line": [
			{
				"key": "OtherState1",
				"value": "Other State Return 1"
			},
			{
				"key": "VA52271",
				"value": "Split Interest Trust Information Return1"
			}
		]
	},
	{
		"docName": "d1041",
		"line": [
			{
				"key": "ProFormaFederalReturn",
				"value": "ProForma Federal Return - OR 1041 only"
			},
			{
				"key": "2",
				"value": "Form 1128 for Short Period Return"
			}
		]
	},
	{
		"docName": "dOR41",
		"line": [
			{
				"key": "FIDwithholding",
				"value": "FID withholding"
			},
			{
				"key": "FIDReducedTaxRateSchedule",
				"value": "FID Reduced Tax Rate Schedule"
			},
			{
				"key": "CheckboxA",
				"value": "Death Certificate"
			},
			{
				"key": "Schedule1Line3B",
				"value": "Reduced-rate tax on qualifying income"
			}
		]
	},
	{
		"docName": "dPARCT101",
		"line": [
			{
				"key": "7004",
				"value": "Federal_Extension_Granted"
			}
		]
	},
	{
		"docName": "dSchID39R",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherStateReturn_01"
			}
		]
	},
	{
		"docName": "dID39RTaxCreditWkt",
		"line": [
			{
				"key": "OtherState2",
				"value": "OtherStateReturn_02"
			}
		]
	},
	{
		"docName": "d1042SRRB",
		"line": [
			{
				"key": "GreenCard",
				"value": "Green Card"
			},
			{
				"key": "8879",
				"value": "Signed Declaration"
			}
		]
	},
	{
		"docName": "dFrm1042SSSA",
		"line": [
			{
				"key": "GreenCard",
				"value": "Green Card"
			},
			{
				"key": "8879",
				"value": "Signed Declaration"
			}
		]
	},
	{
		"docName": "dSchAR1000TC",
		"line": [
			{
				"key": "OtherStateReturn",
				"value": "OtherStateReturn"
			}
		]
	},
	{
		"docName": "dMI1040",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState1"
			}
		]
	},
	{
		"docName": "dMI1040CR",
		"line": [
			{
				"key": "SpecialHousingStmt",
				"value": "SpecialHousingStmt"
			},
			{
				"key": "FEN851",
				"value": "FEN851"
			}
		]
	},
	{
		"docName": "dOR40N",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState1"
			},
			{
				"key": "FederalReturn1",
				"value": "Federal Return"
			}
		]
	},
	{
		"docName": "dOR40",
		"line": [
			{
				"key": "FederalReturn1",
				"value": "Federal Return"
			}
		]
	},
	{
		"docName": "dOR40P",
		"line": [
			{
				"key": "FederalReturn1",
				"value": "Federal Return"
			}
		]
	},
	{
		"docName": "dSchWIOS",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState1"
			}
		]
	},
	{
		"docName": "dHIN11",
		"line": [
			{
				"key": "ArboristAffidavit",
				"value": "ArboristAffidavit"
			},
			{
				"key": "RestraintInvoice",
				"value": "Child Restraint System"
			},
			{
				"key": "Exceptionaltreesdeduction",
				"value": "Exceptional trees deduction"
			}
		]
	},
	{
		"docName": "dHIN15",
		"line": [
			{
				"key": "ArboristAffidavit",
				"value": "ArboristAffidavit"
			},
			{
				"key": "RestraintInvoice",
				"value": "RestraintInvoice"
			}
		]
	},
	{
		"docName": "dSchMI1Sch2",
		"line": [
			{
				"key": "FedSchR",
				"value": "FedSchR"
			}
		]
	},
	{
		"docName": "d990",
		"line": [
			{
				"key": "Auditedfinancial",
				"value": "Auditedfinancial"
			}
		]
	},
	{
		"docName": "dMS80105",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState1"
			},
			{
				"key": "Line22",
				"value": "Form 80-360"
			}
		]
	},
	{
		"docName": "dSchDEI",
		"line": [
			{
				"key": "OtherState1",
				"value": "OtherState1"
			}
		]
	},
	{
		"docName": "dWVIT140RECAP",
		"line": [
			{
				"key": "1",
				"value": "Non-family adoption Credit"
			},
			{
				"key": "2",
				"value": "General Economic Opportunity Tax Credit"
			},
			{
				"key": "3",
				"value": "Strategic Research and Development Tax Credit"
			},
			{
				"key": "4",
				"value": "Environmental Agricultural Equipment Credit"
			},
			{
				"key": "5",
				"value": "Military Incentive Credit"
			},
			{
				"key": "6",
				"value": "Neighborhood Investment Program Credit"
			},
			{
				"key": "7",
				"value": "Historic Rehabilitated Buildings Investment Credit"
			},
			{
				"key": "8",
				"value": "Qualified Rehabilitated Buildings Investment Credit"
			},
			{
				"key": "9",
				"value": "Film Industry Investment Tax Credit"
			},
			{
				"key": "10",
				"value": "Apprenticeship Training Tax Credit"
			},
			{
				"key": "11",
				"value": "Alternative-Fuel Tax Credit"
			},
			{
				"key": "12",
				"value": "Commercial Patent Incentives Tax Credit"
			},
			{
				"key": "13",
				"value": "Conceal Carry Gun Permit Credit"
			},
			{
				"key": "OtherState1",
				"value": "Other State Return"
			}
		]
	},
	{
		"docName": "dMEPTDZoneTaxCrWkt",
		"line": [
			{
				"key": "MEPTDZoneTaxCrWkt",
				"value": "MEPTDZoneTaxCrWkt"
			}
		]
	},
	{
		"docName": "dMESchALn14wkt",
		"line": [
			{
				"key": "MESchALn14wkt",
				"value": "MESchALn14wkt"
			}
		]
	},
	{
		"docName": "dMESchALn9wkt",
		"line": [
			{
				"key": "MESchALn9wkt",
				"value": "MESchALn9wkt"
			}
		]
	},
	{
		"docName": "dNHDP10",
		"line": [
			{
				"key": "NHDP10Line4bAttachment",
				"value": "NHDP10Line4bAttachment"
			}
		]
	},
	{
		"docName": "dAZ140PTC",
		"line": [
			{
				"key": "Statementshowingyourpropertytaxes",
				"value": "Copy of a statement showing your property taxes that you paid"
			},
			{
				"key": "StatementshowingyourSSIPayments",
				"value": "Copy of a statement showing your SSIPayments that you paid"
			}
		]
	},
	{
		"docName": "dALSchPC",
		"line": [
			{
				"key": "1",
				"value": "DualEnrollmentCredit"
			},
			{
				"key": "2",
				"value": "Heroes For Hire Tax Credit Act part G Attachments"
			},
			{
				"key": "3",
				"value": "Irrigation/Reservoir System Credit"
			}
		]
	},
	{
		"docName": "dALSchBC",
		"line": [
			{
				"key": "1",
				"value": "Enterprise Zone Act Credit"
			},
			{
				"key": "2",
				"value": "Basic Skills Education Credit"
			},
			{
				"key": "3",
				"value": "Income Tax Credit"
			},
			{
				"key": "4",
				"value": "Alabama New Markets Development Credit"
			},
			{
				"key": "5",
				"value": "Rehabilitation Preservation and Development of Historic Structures Credit"
			},
			{
				"key": "6",
				"value": "Dual Enrollment Credit"
			},
			{
				"key": "11",
				"value": "Alabama Historical Commission Tax Credit Certificate"
			},
			{
				"key": "12",
				"value": "Capital Dock or Capital Credit Available"
			}
		]
	},
	{
		"docName": "dAR1000NR",
		"line": [
			{
				"key": "1",
				"value": "U. S. Individual Income Tax Return"
			}
		]
	},
	{
		"docName": "dMI4892",
		"line": [
			{
				"key": "4",
				"value": "ADDENDUM"
			}
		]
	},
	{
		"docName": "dHISchCR",
		"line": [
			{
				"key": "1",
				"value": "Fuel Tax Credit for Commercial Fisher"
			},
			{
				"key": "2",
				"value": "Carryover of Tax Credit"
			},
			{
				"key": "CesspoolConversionConnectionCredit",
				"value": "Cesspool Upgrade , Conversion or connection Credit"
			},
			{
				"key": "RenewableFuelsProductionTaxCredit",
				"value": "Renewable Fuels Production Tax Credit"
			},
			{
				"key": "OrganicFoodProductionTax",
				"value": "Organic Food Production Tax Credit"
			},
			{
				"key": "ImportantAgriculturalLandCredit",
				"value": "Important Agrucutral Land Qualified Agricultural Cost Tax Credit"
			},
			{
				"key": "TaxCreditforResearchActi",
				"value": "Tax Credit for Research Activities"
			}
		]
	},
	{
		"docName": "dAZ308I",
		"line": [
			{
				"key": "PartILine2",
				"value": "Credit Refundable Certification Received from the Arizona Commerce Authority"
			}
		]
	},
	{
		"docName": "dAZ346",
		"line": [
			{
				"key": "PartILine1",
				"value": "Letter of Approval Received from the Arizona Department of Revenue"
			}
		]
	},
	{
		"docName": "dMI1040H",
		"line": [
			{
				"key": "MI1040H",
				"value": "UnitaryCalculation"
			}
		]
	},
	{
		"docName": "dMIDETROITD1040NR",
		"line": [
			{
				"key": "MI5119",
				"value": "CityPOA"
			}
		]
	},
	{
		"docName": "dSchWV140SchM",
		"line": [
			{
				"key": "militaryorders",
				"value": "military orders"
			},
			{
				"key": "FormDD214",
				"value": "DD214"
			},
			{
				"key": "militaryordersB",
				"value": "military ordersB"
			},
			{
				"key": "FormDD214B",
				"value": "DD214B"
			}
		]
	},
	{
		"docName": "dNYIT644",
		"line": [
			{
				"key": "1",
				"value": "IT-644 Workers with Disability Certificate"
			}
		]
	},
	{
		"docName": "dNYIT646",
		"line": [
			{
				"key": "2",
				"value": "IT-646 Employee Training Incentive Program Certificate"
			}
		]
	},
	{
		"docName": "dNYIT246",
		"line": [
			{
				"key": "3",
				"value": "IT246 Certificate of tax credit"
			}
		]
	},
	{
		"docName": "dNYIT261",
		"line": [
			{
				"key": "4",
				"value": "IT261 Certificate of tax credit"
			}
		]
	},
	{
		"docName": "dNYIT613",
		"line": [
			{
				"key": "5",
				"value": "Brownfield Redevelopment Tax Credit - Certificate of Completion"
			}
		]
	},
	{
		"docName": "dNYIT204",
		"line": [
			{
				"key": "Certificate",
				"value": "Life Sciences Research and Development Tax Credit"
			},
			{
				"key": "Certificate1",
				"value": "Empire State Apprenticeship Tax Credit"
			}
		]
	},
	{
		"docName": "dNYIT648",
		"line": [
			{
				"key": "6",
				"value": "IT-648 Life Sciences Research and Developement Certificate"
			}
		]
	},
	{
		"docName": "dNCD403",
		"line": [
			{
				"key": "1",
				"value": "NC-NPA"
			}
		]
	},
	{
		"docName": "dNCD403Part3",
		"line": [
			{
				"key": "2",
				"value": "NC-NPA"
			}
		]
	},
	{
		"docName": "dVA500",
		"line": [
			{
				"key": "Nonapportionableincome",
				"value": "Nonapportionable Investment function income statement"
			},
			{
				"key": "Nonapportionableloss",
				"value": "Nonapportionable Investment function loss statement"
			}
		]
	},
	{
		"docName": "dVA500SchCR",
		"line": [
			{
				"key": "WasteOilCredAllow",
				"value": "Waste Motor Oil Burning Equipment Tax Credit"
			},
			{
				"key": "AgriBestMngmtCrAllow",
				"value": "Agricultural Best Management Practices Tax Credit"
			},
			{
				"key": "CredAllowF301",
				"value": "Enterprise Zone Act Tax Credit"
			},
			{
				"key": "TillageCredAllow",
				"value": "Conservation Tillage Equipment Tax Credit"
			},
			{
				"key": "FertzrCredAllow",
				"value": "Precision Fertilizer and Pesticide Application Equipment Tax Credit"
			},
			{
				"key": "CleanFuelVehicleCred",
				"value": "Vehicle Emissions Testing Equipment Tax Credit"
			},
			{
				"key": "BiodieselCredAllow",
				"value": "Biodiesel and Green Diesel Fuels Tax Credit"
			},
			{
				"key": "TotPriorCoalEmpCred",
				"value": "Coalfield Employment Enhancement Tax Credit"
			},
			{
				"key": "VIRGINACOALEMPLOYMENTC",
				"value": "Virginia Coal Employment and Production Incentive Tax Credit"
			}
		]
	},
	{
		"docName": "dKY740",
		"line": [
			{
				"key": "1",
				"value": "Amended U.S. Individual Income Tax Return"
			}
		]
	},
	{
		"docName": "dKY740NP",
		"line": [
			{
				"key": "1",
				"value": "Amended U.S. Individual Income Tax Return"
			}
		]
	},
	{
		"docName": "dAL20C",
		"line": [
			{
				"key": "7",
				"value": "Federal Form 851"
			},
			{
				"key": "8",
				"value": "Consolidated Income Spreadsheet"
			},
			{
				"key": "9",
				"value": "Consolidated Balance Sheets"
			},
			{
				"key": "10",
				"value": "Federal income tax deduction /refund"
			}
		]
	},
	{
		"docName": "dSchAL20cE",
		"line": [
			{
				"key": "13",
				"value": "AL Schedule E Federal income tax deduction /refund"
			}
		]
	},
	{
		"docName": "dSchVTIN117",
		"line": [
			{
				"key": "OtherState1",
				"value": "Other State Return 1"
			}
		]
	},
	{
		"docName": "dPA20S65",
		"line": [
			{
				"key": "1",
				"value": "Federal form 8824"
			},
			{
				"key": "2",
				"value": "PA Schedule RK1 Receiving"
			},
			{
				"key": "FederalForm8824",
				"value": "Federal form 8824"
			}
		]
	},
	{
		"docName": "dMA1065ScheduleLP",
		"line": [
			{
				"key": "InterimControl",
				"value": "Interim control deleading"
			},
			{
				"key": "Fullcompliance",
				"value": "Full compliance deleading"
			}
		]
	},
	{
		"docName": "dVTBI471",
		"line": [
			{
				"key": "70041",
				"value": "Extension of Time To File Certain. Business Income Tax, Information, and Other Return"
			},
			{
				"key": "VT8879C",
				"value": "VT Corporate or Business Income Tax Declaration for Electronic Filing"
			}
		]
	},
	{
		"docName": "dVTCO411",
		"line": [
			{
				"key": "NetOperatingLossDeduction",
				"value": "VT Net Operating Loss Deduction"
			},
			{
				"key": "7004",
				"value": "Extension of Time To File Certain. Business Income Tax, Information, and Other Returns"
			},
			{
				"key": "Vermontnetoperatinglossdeductionapplied",
				"value": "Vermount Net Operating Loss deduction applied"
			},
			{
				"key": "NonresidentEstimatedPayments",
				"value": "Nonresident Estimated Payments"
			},
			{
				"key": "RealEstateWithholdingPayments",
				"value": "Real Estate Withholding Payments"
			}
		]
	},
	{
		"docName": "dVTBA404",
		"line": [
			{
				"key": "InvestmentTaxCredit",
				"value": "Investment Tax Credit"
			},
			{
				"key": "CharitableHousing",
				"value": "Charitable Housing"
			},
			{
				"key": "AffordableHousing",
				"value": "Affordable Housing"
			},
			{
				"key": "QualifiedSaleofMobileHomePark",
				"value": "Qualified Sale of Mobile Home Park"
			},
			{
				"key": "VermontEntrepreneursSeedCapitalFund",
				"value": "Vermont Entrepreneur’s Seed Capital Fund"
			},
			{
				"key": "CodeImprovement",
				"value": "Code Improvement"
			},
			{
				"key": "HistoricRehabilitation",
				"value": "Historic Rehabilitation"
			},
			{
				"key": "FacadeImprovement",
				"value": "Facade Improvement"
			},
			{
				"key": "MachineryandEquipment",
				"value": "Machinery and Equipment"
			}
		]
	},
	{
		"docName": "dMI1041Sch1",
		"line": [
			{
				"key": "1",
				"value": "Income attributable to another state"
			},
			{
				"key": "2",
				"value": "INCOME FROM US GOVERNMENT OBLIGATIONS AND RELATED EXPENSES"
			},
			{
				"key": "3",
				"value": "BUSINESS ACTIVITY WORKSHEET"
			}
		]
	},
	{
		"docName": "dGAITFC",
		"line": [
			{
				"key": "partBLine3",
				"value": "Investments and Expenses"
			}
		]
	},
	{
		"docName": "dCA100S",
		"line": [
			{
				"key": "AutomaticExtensionofTime7004",
				"value": "Application for Automatic Extension of Time To File Certain. Business Income Tax, Information, and Other Returns"
			}
		]
	},
	{
		"docName": "dWV120",
		"line": [
			{
				"key": "990T",
				"value": "Exempt Organization Business Income Tax Return"
			},
			{
				"key": "IRS11201",
				"value": "Proforma 1120"
			}
		]
	},
	{
		"docName": "dIL1065",
		"line": [
			{
				"key": "IRS1065",
				"value": "U.S. Return of Partnership Income"
			}
		]
	},
	{
		"docName": "dWV141",
		"line": [
			{
				"key": "3",
				"value": "Schedule D"
			},
			{
				"key": "2",
				"value": "Schedule RBIC"
			},
			{
				"key": "4",
				"value": "Schedule FIIA-TCS"
			}
		]
	},
	{
		"docName": "dMI1041",
		"line": [
			{
				"key": "4",
				"value": "OTHER STATE RETURN"
			},
			{
				"key": "HistoricPrevention",
				"value": "Michigan Historic Preservation Tax Credit"
			},
			{
				"key": "SmallBusinessPrevention",
				"value": "Small Business Investment Tax Credit"
			}
		]
	},
	{
		"docName": "dNYIT205",
		"line": [
			{
				"key": "5",
				"value": "NY IT 650"
			},
			{
				"key": "Investcreditfinancialservicesindustry",
				"value": "Investment credit - financial services industry refund"
			}
		]
	},
	{
		"docName": "dWI2",
		"line": [
			{
				"key": "1",
				"value": "Federal_Extension_Granted"
			}
		]
	},
	{
		"docName": "dSchLAG",
		"line": [
			{
				"key": "OtherStateReturn",
				"value": "Other State Return"
			},
			{
				"key": "Line5A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line5B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line5C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line5D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line5E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line5F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line5G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line5H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line5I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line5J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line5K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line5L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line5M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line5N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line5O",
				"value": "Other - 199"
			},
			{
				"key": "Line5P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			},
			{
				"key": "Line6A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line6B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line6C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line6D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line6E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line6F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line6G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line6H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line6I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line6J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line6K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line6L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line6M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line6N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line6O",
				"value": "Other - 199"
			},
			{
				"key": "Line6P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			},
			{
				"key": "Line7A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line7B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line7C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line7D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line7E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line7F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line7G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line7H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line7I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line7J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line7K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line7L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line7M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line7N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line7O",
				"value": "Other - 199"
			},
			{
				"key": "Line7P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			},
			{
				"key": "Line8A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line8B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line8C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line8D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line8E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line8F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line8G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line8H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line8I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line8J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line8K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line8L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line8M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line8N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line8O",
				"value": "Other - 199"
			},
			{
				"key": "Line8P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			}
		]
	},
	{
		"docName": "dLAIT540",
		"line": [
			{
				"key": "1",
				"value": "Copy of your homeowner’s or property’s insurance declaration page"
			}
		]
	},
	{
		"docName": "dMO1120S",
		"line": [
			{
				"key": "Form7004",
				"value": "Attach a copy of the approved Federal Extension (Form 7004)"
			}
		]
	},
	{
		"docName": "dAZ165",
		"line": [
			{
				"key": "SchPartnrInfo",
				"value": "AZ Schedule E"
			}
		]
	},
	{
		"docName": "dWVIT140",
		"line": [
			{
				"key": "3",
				"value": "Schedule D"
			}
		]
	},
	{
		"docName": "CA540",
		"line": [
			{
				"key": "Taxpayerdateofdeath",
				"value": "Deceased Taxpayer Statement"
			},
			{
				"key": "Spousedateofdeath",
				"value": "Deceased Spouse Statement"
			}
		]
	},
	{
		"docName": "CASchX",
		"line": [
			{
				"key": "MilitaryHR100",
				"value": "Military Compensation"
			}
		]
	},
	{
		"docName": "CA3503",
		"line": [
			{
				"key": "Line3",
				"value": "Heritage Preservation Credit"
			}
		]
	},
	{
		"docName": "CA3523",
		"line": [
			{
				"key": "Line17a",
				"value": "Credit Reduction Schedule"
			}
		]
	},
	{
		"docName": "CA3546",
		"line": [
			{
				"key": "Line32",
				"value": "Heritage Preservation Credit"
			}
		]
	},
	{
		"docName": "CA3507",
		"line": [
			{
				"key": "Line31",
				"value": "Heritage Preservation Credit"
			}
		]
	},
	{
		"docName": "CA3548",
		"line": [
			{
				"key": "Line5",
				"value": "Heritage Preservation Credit"
			}
		]
	},
	{
		"docName": "SchCA565R",
		"line": [
			{
				"key": "Line1FColumnB",
				"value": "Other tangible assets"
			}
		]
	},
	{
		"docName": "SchCA565D1",
		"line": [
			{
				"key": "Line3",
				"value": "Casualties and Thefts Statement"
			}
		]
	},
	{
		"docName": "CA5870A",
		"line": [
			{
				"key": "Line22",
				"value": "Alternative minimum tax adjustments"
			}
		]
	},
	{
		"docName": "dNYCT243",
		"line": [
			{
				"key": "ClaimforBiofuelProduCredit",
				"value": "Claim for Biofuel Production Credit"
			}
		]
	},
	{
		"docName": "GA501",
		"line": [
			{
				"key": "Line11B",
				"value": ""
			}
		]
	},
	{
		"docName": "GA501X",
		"line": [
			{
				"key": "TrustisaQualifiedFuneralTrust",
				"value": "Georgia Tax Withheld"
			}
		]
	},
	{
		"docName": "dGA500Sch2",
		"line": [
			{
				"key": "Line11Multinstant form",
				"value": "Qualified Funeral"
			},
			{
				"key": "Line11Multinstantform2",
				"value": "Land Conservation Credit."
			},
			{
				"key": "GEORGIATAXCREDIT1",
				"value": "Form IT-HC and K-1 Low Income Housing Credit"
			},
			{
				"key": "GEORGIATAXCREDIT2",
				"value": "DNR Certification for Low Emission Vehicle Credit"
			},
			{
				"key": "GEORGIATAXCREDIT3",
				"value": "DNR Certification for Zero Emission Vehicle Credit"
			},
			{
				"key": "GEORGIATAXCREDIT4",
				"value": "DNR Certification for Electric Vehicle Charger Credit"
			},
			{
				"key": "GEORGIATAXCREDIT5",
				"value": "Form IT-RHC and DNR Certification for Historic Rehabilitation Credit for Historic Homes"
			},
			{
				"key": "GEORGIATAXCREDIT6",
				"value": "Form IT-CONSV and DNR Certificaiton for Land Conservation Credit"
			},
			{
				"key": "GEORGIATAXCREDIT7",
				"value": "Form IT-CEP for Clean Energy Property Credit"
			},
			{
				"key": "GEORGIATAXCREDIT8",
				"value": "Form IT-QHIE For Qualified Health Insurance Expenses Credit"
			},
			{
				"key": "GEORGIATAXCREDIT9",
				"value": "Form IT-HC and K-1 Low Income Housing Credit"
			},
			{
				"key": "GEORGIATAXCREDIT10",
				"value": "DNR Certification for Low Emission Vehicle Credit"
			},
			{
				"key": "GEORGIATAXCREDIT11",
				"value": "DNR Certification for Zero Emission Vehicle Credit"
			},
			{
				"key": "GEORGIATAXCREDIT12",
				"value": "DNR Certification for Electric Vehicle Charger Credit"
			},
			{
				"key": "GEORGIATAXCREDIT13",
				"value": "Form IT-RHC and DNR Certification for Historic Rehabilitation Credit for Historic Homes"
			},
			{
				"key": "GEORGIATAXCREDIT14",
				"value": "Form IT-CONSV and DNR Certificaiton for Land Conservation Credit"
			},
			{
				"key": "GEORGIATAXCREDIT15",
				"value": "Form IT-CEP for Clean Energy Property Credit"
			},
			{
				"key": "GEORGIATAXCREDIT16",
				"value": "Form IT-QHIE For Qualified Health Insurance Expenses Credit"
			}
		]
	},
	{
		"docName": "dGA700Sch2",
		"line": [
			{
				"key": "GEORGIATAXCREDIT17",
				"value": "Form IT-HC and K-1 Low Income Housing Credit"
			},
			{
				"key": "Schedule3CreditUsageCarryover1",
				"value": "DNR Certification for Low Emission Vehicle Credit"
			},
			{
				"key": "Schedule3CreditUsageCarryover2",
				"value": "DNR Certification for Zero Emission Vehicle Credit"
			},
			{
				"key": "Schedule3CreditUsageCarryover3",
				"value": "DNR Certification for Electric Vehicle Charger Credit"
			},
			{
				"key": "Schedule3CreditUsageCarryover4",
				"value": "Form IT-RHC and DNR Certification for Historic Rehabilitation Credit for Historic Homes"
			},
			{
				"key": "Schedule3CreditUsageCarryover5",
				"value": "Form IT-CONSV and DNR Certificaiton for Land Conservation Credit"
			},
			{
				"key": "Schedule3CreditUsageCarryover6",
				"value": "Form IT-CEP for Clean Energy Property Credit"
			},
			{
				"key": "Schedule3CreditUsageCarryover7",
				"value": "Form IT-QHIE For Qualified Health Insurance Expenses Credit"
			}
		]
	},
	{
		"docName": "dGA501Sch4",
		"line": [
			{
				"key": "GACreditUsageCarryover1",
				"value": "Form IT-HC and K-1 Low Income Housing Credit"
			},
			{
				"key": "GACreditUsageCarryover2",
				"value": "DNR Certification for Low Emission Vehicle Credit"
			},
			{
				"key": "GACreditUsageCarryover3",
				"value": "DNR Certification for Zero Emission Vehicle Credit"
			},
			{
				"key": "GACreditUsageCarryover4",
				"value": "DNR Certification for Electric Vehicle Charger Credit"
			},
			{
				"key": "GACreditUsageCarryover5",
				"value": "Form IT-RHC and DNR Certification for Historic Rehabilitation Credit for Historic Homes"
			},
			{
				"key": "GACreditUsageCarryover6",
				"value": "Form IT-CONSV and DNR Certificaiton for Land Conservation Credit"
			},
			{
				"key": "GACreditUsageCarryover7",
				"value": "Form IT-CEP for Clean Energy Property Credit"
			},
			{
				"key": "GACreditUsageCarryover8",
				"value": "Form IT-QHIE For Qualified Health Insurance Expenses Credit"
			}
		]
	},
	{
		"docName": "dGA600Sch9",
		"line": [
			{
				"key": "CLAIMEDTAXCREDITS1",
				"value": "Form IT-HC and K-1 Low Income Housing Credit"
			},
			{
				"key": "CLAIMEDTAXCREDITS2",
				"value": "DNR Certification for Low Emission Vehicle Credit"
			},
			{
				"key": "CLAIMEDTAXCREDITS3",
				"value": "DNR Certification for Zero Emission Vehicle Credit"
			},
			{
				"key": "CLAIMEDTAXCREDITS4",
				"value": "DNR Certification for Electric Vehicle Charger Credit"
			},
			{
				"key": "CLAIMEDTAXCREDITS5",
				"value": "Form IT-RHC and DNR Certification for Historic Rehabilitation Credit for Historic Homes"
			},
			{
				"key": "CLAIMEDTAXCREDITS6",
				"value": "Form IT-CONSV and DNR Certificaiton for Land Conservation Credit"
			},
			{
				"key": "CLAIMEDTAXCREDITS7",
				"value": "Form IT-CEP for Clean Energy Property Credit"
			},
			{
				"key": "CLAIMEDTAXCREDITS8",
				"value": "Form IT-QHIE For Qualified Health Insurance Expenses Credit"
			}
		]
	},
	{
		"docName": "dGA600SSch10Dup",
		"line": [
			{
				"key": "CreditUsageCarryover1",
				"value": "Form IT-HC and K-1 Low Income Housing Credit"
			},
			{
				"key": "CreditUsageCarryover2",
				"value": "DNR Certification for Low Emission Vehicle Credit"
			},
			{
				"key": "CreditUsageCarryover3",
				"value": "DNR Certification for Zero Emission Vehicle Credit"
			},
			{
				"key": "CreditUsageCarryover4",
				"value": "DNR Certification for Electric Vehicle Charger Credit"
			},
			{
				"key": "CreditUsageCarryover5",
				"value": "Form IT-RHC and DNR Certification for Historic Rehabilitation Credit for Historic Homes"
			},
			{
				"key": "CreditUsageCarryover6",
				"value": "Form IT-CONSV and DNR Certificaiton for Land Conservation Credit"
			},
			{
				"key": "CreditUsageCarryover7",
				"value": "Form IT-CEP for Clean Energy Property Credit"
			},
			{
				"key": "CreditUsageCarryover8",
				"value": "Form IT-QHIE For Qualified Health Insurance Expenses Credit"
			}
		]
	},
	{
		"docName": "dFigureyourcreditsStep3",
		"line": [
			{
				"key": "CertificatesissuedDCEO1",
				"value": "Certificates issued by DCEO"
			}
		]
	},
	{
		"docName": "dFigureyourCredit1299D",
		"line": [
			{
				"key": "CertificatesissuedDCEO2",
				"value": "Certificates issued by DCEO"
			}
		]
	},
	{
		"docName": "dIL1120ST",
		"line": [
			{
				"key": "FormW2G",
				"value": "Illinois gambling withholding"
			}
		]
	},
	{
		"docName": "dIL1299A",
		"line": [
			{
				"key": "Attach SchedulesK1PorK1T",
				"value": "River Edge Redevelopment Zone"
			}
		]
	},
	{
		"docName": "dILSch1299D",
		"line": [
			{
				"key": "RiverEdgeHistoricPreservation",
				"value": "River Edge Historic Preservation"
			},
			{
				"key": "AffordableHousingDonations",
				"value": "Affordable Housing Donations"
			},
			{
				"key": "Hospitalcredit",
				"value": "Hospital credit"
			}
		]
	},
	{
		"docName": "dSchILICR",
		"line": [
			{
				"key": "EducationExpenseCredit",
				"value": "Education Expense Credit"
			}
		]
	},
	{
		"docName": "dSchPAOC",
		"line": [
			{
				"key": "No",
				"value": "Other Credits"
			}
		]
	},
	{
		"docName": "dNCCD401S",
		"line": [
			{
				"key": "Partnership",
				"value": "Partnership"
			}
		]
	},
	{
		"docName": "dNCSchNA",
		"line": [
			{
				"key": "DateofValidSCorporationElection",
				"value": "Annual Report for Business Corporations"
			}
		]
	},
	{
		"docName": "dNCD403SchTC",
		"line": [
			{
				"key": "Line1IncomeProducingHistoricStructure",
				"value": "Income-Producing Historic Structure"
			},
			{
				"key": "Line2NonIncomeProducingHistoricStructure",
				"value": "Nonincome-Producing Historic Structure"
			},
			{
				"key": "Line3MillFacility",
				"value": "Income-Producing Historic Mill Facility"
			},
			{
				"key": "Line4HistoricMillFacility",
				"value": "Nonincome-Producing Historic Mill Facility"
			},
			{
				"key": "Line5IPHistoricStructure",
				"value": "Income-Producing Historic Structure"
			},
			{
				"key": "Line6NIPHStructure",
				"value": "Nonincome-Producing Historic Structure"
			}
		]
	},
	{
		"docName": "dOHIT1040",
		"line": [
			{
				"key": "JobRetentionCredit",
				"value": "Job retention credit"
			},
			{
				"key": "NewEmpInEntZoneCredit",
				"value": "Credit new employees"
			},
			{
				"key": "CredittEthanolPlantInvCredit",
				"value": "Invest Ohio credit"
			},
			{
				"key": "SmallBusinessInvCredit",
				"value": "Technology investment credit"
			},
			{
				"key": "EntZoneDayCareAndTrngCredit",
				"value": "Enterprise zone day care and training credits"
			},
			{
				"key": "ResearchAndDevelopmentCredit",
				"value": "Research and development credit"
			},
			{
				"key": "OhioHistoricPreservationCredit",
				"value": "Ohio historic preservation credit"
			}
		]
	},
	{
		"docName": "dOHSchE",
		"line": [
			{
				"key": "AmtOfCredit2",
				"value": "Job retention credit"
			},
			{
				"key": "AmtOfCredit3",
				"value": "Credit new employees"
			},
			{
				"key": "AmtOfCredit5",
				"value": "Credit for purchases of grape production property"
			},
			{
				"key": "AmtOfCredit6",
				"value": "Credit for investing in an Ohio small business"
			},
			{
				"key": "AmtOfCredit7",
				"value": "Technology investment credit"
			},
			{
				"key": "AmtOfCredit8",
				"value": "Enterprise zone day care and training credits"
			},
			{
				"key": "ResearchAndDevelopment",
				"value": "Research and development credit"
			},
			{
				"key": "AmtOfCredit9",
				"value": "Ohio historic preservation credit"
			}
		]
	},
	{
		"docName": "dNJ100SSchA2SchA3",
		"line": [
			{
				"key": "AngelInvestorTax",
				"value": "Angel Investor Tax Credit"
			},
			{
				"key": "GrowNJTC",
				"value": "Grow New Jersey Tax Credit"
			},
			{
				"key": "WindTC",
				"value": "Wind Energy Facility Tax Credits"
			},
			{
				"key": "RandDTC",
				"value": "Research and Development Tax Credit"
			},
			{
				"key": "Residential",
				"value": "Residential Economic Redevelopment and growth tax credit"
			},
			{
				"key": "Businessemployment",
				"value": "Business Employment Incentive Program Tax"
			},
			{
				"key": "PublicInfrastructureTax",
				"value": "Public Infrastructure Tax Credit"
			},
			{
				"key": "OtherTC",
				"value": "Other Tax Credits"
			}
		]
	},
	{
		"docName": "dNJSchA3",
		"line": [
			{
				"key": "AngelInvestorTax",
				"value": "Angel Investor Tax Credit"
			},
			{
				"key": "GrowNJTC",
				"value": "Grow New Jersey Tax Credit"
			},
			{
				"key": "WindTC",
				"value": "Wind Energy Facility Tax Credits"
			},
			{
				"key": "RandDTC",
				"value": "Research and Development Tax Credit"
			},
			{
				"key": "Residential",
				"value": "Residential Economic Redevelopment and growth tax credit"
			},
			{
				"key": "Businessemployment",
				"value": "Business Employment Incentive Program Tax"
			},
			{
				"key": "PublicInfrastructureTax",
				"value": "Public Infrastructure Tax Credit"
			},
			{
				"key": "OtherTC",
				"value": "Other Tax Credits"
			}
		]
	},
	{
		"docName": "dAZ308",
		"line": [
			{
				"key": "Increasedresearchactivity",
				"value": "Form 308 P -Credit for Increased Research Activities Distribution to Partners of a Partnership"
			},
			{
				"key": "CreditRefundable",
				"value": "Credit Refundable Certification from AZ"
			}
		]
	},
	{
		"docName": "dAZ305",
		"line": [
			{
				"key": "Part3Partnership",
				"value": "AZ Schedule 305- P Environment Technology Credit"
			}
		]
	},
	{
		"docName": "dALIrrigationCrAttachments",
		"line": [
			{
				"key": "IrrigationCredit",
				"value": "AL Irrigation Credit Attachments"
			}
		]
	},
	{
		"docName": "dSC1040",
		"line": [
			{
				"key": "DisabilityCertificate",
				"value": "Copy of Physicain certificate for disablility"
			},
			{
				"key": "SpecialNeedsChildCertificate",
				"value": "Special needs Child certificate received from SC Department of Social Services"
			},
			{
				"key": "ExplanationToAdditionOfIncome",
				"value": "Explanation to Other Addtion of Income"
			},
			{
				"key": "FormSCI361",
				"value": "Parental Refundable Credits"
			}
		]
	},
	{
		"docName": "dSchSC1040TC",
		"line": [
			{
				"key": "TaxCreditToAnotherState",
				"value": "Tax Credit for taxes paid to another state"
			}
		]
	},
	{
		"docName": "dTN170SchD",
		"line": [
			{
				"key": "GrossPremiumstaxcredit",
				"value": "Gross Premiums tax credit"
			},
			{
				"key": "TennesseeIncomeTax",
				"value": "Tennessee Income Tax"
			},
			{
				"key": "GreenEnergyTaxCredit",
				"value": "Green Energy Tax Credit"
			},
			{
				"key": "BrownfieldPropertyCredit",
				"value": "Brownfield Property Credit"
			},
			{
				"key": "BroadbandInternetAccess",
				"value": "Broadband Internet Access Tax Credit"
			}
		]
	},
	{
		"docName": "dSchLAGNR",
		"line": [
			{
				"key": "Line4A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line4B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line4C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line4D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line4E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line4F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line4G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line4H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line4I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line4J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line4K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line4L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line4M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line4N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line4O",
				"value": "Other - 199"
			},
			{
				"key": "Line4P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			},
			{
				"key": "Line5A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line5B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line5C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line5D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line5E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line5F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line5G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line5H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line5I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line5J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line5K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line5L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line5M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line5N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line5O",
				"value": "Other - 199"
			},
			{
				"key": "Line5P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			},
			{
				"key": "Line6A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line6B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line6C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line6D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line6E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line6F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line6G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line6H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line6I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line6J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line6K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line6L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line6M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line6N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line6O",
				"value": "Other - 199"
			},
			{
				"key": "Line6P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			},
			{
				"key": "Line7A",
				"value": "Education Credit Act 125 Recovery - 099"
			},
			{
				"key": "Line7B",
				"value": "Premium Tax - 100"
			},
			{
				"key": "Line7C",
				"value": "Commercial Fishing - 105"
			},
			{
				"key": "Line7D",
				"value": "Family Responsibility - 110"
			},
			{
				"key": "Line7E",
				"value": "Small Town Doctor/Dentist – 115"
			},
			{
				"key": "Line7F",
				"value": "Bone Marrow - 120"
			},
			{
				"key": "Line7G",
				"value": "Law Enforcement Education - 125"
			},
			{
				"key": "Line7H",
				"value": "First Time Drug Offenders - 130"
			},
			{
				"key": "Line7I",
				"value": "Bulletproof Vest - 135"
			},
			{
				"key": "Line7J",
				"value": "Nonviolent Offenders – 140"
			},
			{
				"key": "Line7K",
				"value": "Owner of Newly Constructed Accessible Home - 145"
			},
			{
				"key": "Line7L",
				"value": "Qualified Playgrounds - 150"
			},
			{
				"key": "Line7M",
				"value": "Debt Issuance - 155"
			},
			{
				"key": "Line7N",
				"value": "Donations of Materials, Equipment,Advisors, Instructors - 175"
			},
			{
				"key": "Line7O",
				"value": "Other - 199"
			},
			{
				"key": "Line7P",
				"value": "Conversion of Vehicle to Alternative Fuel - 185"
			}
		]
	},
	{
		"docName": "dSchLAFNR",
		"line": [
			{
				"key": "LineCodeA",
				"value": "52F - Ad Valorem Offshore Vessels"
			},
			{
				"key": "LineCodeB",
				"value": "54F - Telephone Company Property"
			},
			{
				"key": "LineCodeC",
				"value": "55F - Prison Industry Enhancement"
			},
			{
				"key": "LineCodeD",
				"value": "57F – Mentor-Protege"
			},
			{
				"key": "LineCodeE",
				"value": "58F - Milk Producers"
			},
			{
				"key": "LineCodeF",
				"value": "59F - Technology Commercialization"
			},
			{
				"key": "LineCodeI",
				"value": "60F - Historic Residential"
			},
			{
				"key": "LineCodeJ",
				"value": "65F - School Readiness Child Care Provider"
			},
			{
				"key": "LineCodeK",
				"value": "66F - School Readiness Child Care Directors and Staff"
			},
			{
				"key": "LineCodeL",
				"value": "67F - School Readiness Business-Supported Child Care"
			},
			{
				"key": "LineCodeM",
				"value": "68F - School Readiness Fees and Grants to Resource and Referral Agencies"
			},
			{
				"key": "LineCodeN",
				"value": "71F - Conversion of Vehicle to Alternative Fuel"
			},
			{
				"key": "LineCodeO",
				"value": "73F - Digital Interactive Media & Software"
			},
			{
				"key": "LineCodeP",
				"value": "80F - Other Refundable Credit"
			},
			{
				"key": "Line2CodeA",
				"value": "52F - Ad Valorem Offshore Vessels"
			},
			{
				"key": "Line2CodeB",
				"value": "54F - Telephone Company Property"
			},
			{
				"key": "Line2CodeC",
				"value": "55F - Prison Industry Enhancement"
			},
			{
				"key": "Line2CodeD",
				"value": "57F – Mentor-Protege"
			},
			{
				"key": "Line2CodeE",
				"value": "58F - Milk Producers"
			},
			{
				"key": "Line2CodeF",
				"value": "59F - Technology Commercialization"
			},
			{
				"key": "Line2CodeG",
				"value": "60F - Historic Residential"
			},
			{
				"key": "Line2CodeH",
				"value": "65F - School Readiness Child Care Provider"
			},
			{
				"key": "Line2CodeI",
				"value": "66F - School Readiness Child Care Directors and Staff"
			},
			{
				"key": "Line2CodeJ",
				"value": "67F - School Readiness Business-Supported Child Care"
			},
			{
				"key": "Line2CodeK",
				"value": "68F - School Readiness Fees and Grants to Resource and Referral Agencies"
			},
			{
				"key": "Line2CodeL",
				"value": "71F - Conversion of Vehicle to Alternative Fuel"
			},
			{
				"key": "Line2CodeM",
				"value": "73F - Digital Interactive Media & Software"
			},
			{
				"key": "Line2CodeN",
				"value": "80F - Other Refundable Credit"
			},
			{
				"key": "Line3CodeA",
				"value": "52F - Ad Valorem Offshore Vessels"
			},
			{
				"key": "Line3CodeB",
				"value": "54F - Telephone Company Property"
			},
			{
				"key": "Line3CodeC",
				"value": "55F - Prison Industry Enhancement"
			},
			{
				"key": "Line3CodeD",
				"value": "57F – Mentor-Protege"
			},
			{
				"key": "Line3CodeE",
				"value": "58F - Milk Producers"
			},
			{
				"key": "Line3CodeF",
				"value": "59F - Technology Commercialization"
			},
			{
				"key": "Line3CodeI",
				"value": "60F - Historic Residential"
			},
			{
				"key": "Line3CodeJ",
				"value": "65F - School Readiness Child Care Provider"
			},
			{
				"key": "Line3CodeK",
				"value": "66F - School Readiness Child Care Directors and Staff"
			},
			{
				"key": "Line3CodeL",
				"value": "67F - School Readiness Business-Supported Child Care"
			},
			{
				"key": "Line3CodeM",
				"value": "68F - School Readiness Fees and Grants to Resource and Referral Agencies"
			},
			{
				"key": "Line3CodeN",
				"value": "71F - Conversion of Vehicle to Alternative Fuel"
			},
			{
				"key": "Line3CodeO",
				"value": "73F - Digital Interactive Media & Software"
			},
			{
				"key": "Line3CodeP",
				"value": "80F - Other Refundable Credit"
			},
			{
				"key": "Line4CodeA",
				"value": "52F - Ad Valorem Offshore Vessels"
			},
			{
				"key": "Line4CodeB",
				"value": "54F - Telephone Company Property"
			},
			{
				"key": "Line4CodeC",
				"value": "55F - Prison Industry Enhancement"
			},
			{
				"key": "Line4CodeD",
				"value": "57F – Mentor-Protege"
			},
			{
				"key": "Line4CodeE",
				"value": "58F - Milk Producers"
			},
			{
				"key": "Line4CodeF",
				"value": "59F - Technology Commercialization"
			},
			{
				"key": "Line4CodeI",
				"value": "60F - Historic Residential"
			},
			{
				"key": "Line4CodeJ",
				"value": "65F - School Readiness Child Care Provider"
			},
			{
				"key": "Line4CodeK",
				"value": "66F - School Readiness Child Care Directors and Staff"
			},
			{
				"key": "Line4CodeL",
				"value": "67F - School Readiness Business-Supported Child Care"
			},
			{
				"key": "Line4CodeM",
				"value": "68F - School Readiness Fees and Grants to Resource and Referral Agencies"
			},
			{
				"key": "Line4CodeN",
				"value": "71F - Conversion of Vehicle to Alternative Fuel"
			},
			{
				"key": "Line4CodeO",
				"value": "73F - Digital Interactive Media & Software"
			},
			{
				"key": "Line4CodeP",
				"value": "80F - Other Refundable Credit"
			},
			{
				"key": "Line5CodeA",
				"value": "52F - Ad Valorem Offshore Vessels"
			},
			{
				"key": "Line5CodeB",
				"value": "54F - Telephone Company Property"
			},
			{
				"key": "Line5CodeC",
				"value": "55F - Prison Industry Enhancement"
			},
			{
				"key": "Line5CodeD",
				"value": "57F – Mentor-Protege"
			},
			{
				"key": "Line5CodeE",
				"value": "58F - Milk Producers"
			},
			{
				"key": "Line5CodeF",
				"value": "59F - Technology Commercialization"
			},
			{
				"key": "Line5CodeG",
				"value": "60F - Historic Residential"
			},
			{
				"key": "Line5CodeH",
				"value": "65F - School Readiness Child Care Provider"
			},
			{
				"key": "Line5CodeI",
				"value": "66F - School Readiness Child Care Directors and Staff"
			},
			{
				"key": "Line5CodeJ",
				"value": "67F - School Readiness Business-Supported Child Care"
			},
			{
				"key": "Line5CodeK",
				"value": "68F - School Readiness Fees and Grants to Resource and Referral Agencies"
			},
			{
				"key": "Line5CodeL",
				"value": "71F - Conversion of Vehicle to Alternative Fuel"
			},
			{
				"key": "Line5CodeM",
				"value": "73F - Digital Interactive Media & Software"
			},
			{
				"key": "Line5CodeN",
				"value": "80F - Other Refundable Credit"
			}
		]
	},
	{
		"docName": "dCO106CR",
		"line": [
			{
				"key": "AircraftManufacturer",
				"value": "Aircraft Manufacturer New Employee Credit:\nDR 0085 and/or DR 0086"
			},
			{
				"key": "ChildCareContribution",
				"value": "Child Care Contribution Credit: DR 1317"
			},
			{
				"key": "AffordableHousingCredit",
				"value": "Affordable Housing Credit: CHFA certification\nLetter"
			},
			{
				"key": "SchooltoCareerInvestment",
				"value": "School-to-Career Investment Credit: Certification letter"
			},
			{
				"key": "Otherstateincometaxreturn",
				"value": "Other state(s) income tax return(s)"
			},
			{
				"key": "InnovativeMotorVehicleCredit",
				"value": "Innovative Motor Vehicle Credit"
			},
			{
				"key": "JobGrowthIncentiveTaxCredit",
				"value": "Job Growth Incentive Tax Credit"
			},
			{
				"key": "HistoricPropert Preservation",
				"value": "Historic property preservation credit"
			},
			{
				"key": "EmployerChildCareInvestment",
				"value": "Employer child care investment credit"
			},
			{
				"key": "ColoradoWorksProgramCredit",
				"value": "Colorado works program credit"
			},
			{
				"key": "RemediationContaminatedLandCredit",
				"value": "Remediation of contaminated land credit"
			},
			{
				"key": "CreditForAdvancedIndustries",
				"value": "Credit for advanced industries"
			},
			{
				"key": "AuctionGroupLicenseFee",
				"value": "Certified auction group license fee credit"
			},
			{
				"key": "FoodContributedToHungerReliefCharitableOrganizations",
				"value": "Credit for food contributed to hunger-relief charitable organizations"
			},
			{
				"key": "PreservationOfHistoricStructuresCredit",
				"value": "Preservation of Historic Structures credit"
			}
		]
	},
	{
		"docName": "dCO112CR",
		"line": [
			{
				"key": "AircraftManufacturerCredit",
				"value": "Aircraft Manufacturer New Employee Credit:\nDR 0085 and/or DR 0086"
			},
			{
				"key": "ChildCareContribution1",
				"value": "Child Care Contribution Credit: DR 1317"
			},
			{
				"key": "JobGrowthIncentiveTaxCredit2",
				"value": "Job Growth Incentive Tax Credit"
			},
			{
				"key": "AffordableHousingCredit2",
				"value": "Affordable Housing Credit: CHFA certification\nLetter"
			},
			{
				"key": "SchooltoCareerInvestment2",
				"value": "School-to-Career Investment Credit: Certification letter"
			},
			{
				"key": "HistoricPropert Preservation2",
				"value": "Historic property preservation credit"
			},
			{
				"key": "ChildCareHomeInvestmentCredit",
				"value": "Child care center/family care home investment credit"
			},
			{
				"key": "EmployerChildCareFacilityInvestment",
				"value": "Employer child care facility investment credit"
			},
			{
				"key": "ColoradoWorksProgramCredit2",
				"value": "Colorado works program credit"
			},
			{
				"key": "ContaminatedLandRedevelopmentCredit",
				"value": "Contaminated land redevelopment credit"
			},
			{
				"key": "AuctionGroupLicenseFee2",
				"value": "Certified auction group license fee credit"
			},
			{
				"key": "IndustryInvestmentCredit",
				"value": "Advanced Industry Investment credit"
			},
			{
				"key": "FoodContributedToHungerReliefCharitableOrganizations2",
				"value": "Credit for food contributed to hunger-relief charitable organizations"
			},
			{
				"key": "PreservationOfHistoricStructuresCredit2",
				"value": "Preservation of Historic Structures credit"
			}
		]
	},
	{
		"docName": "dCO112",
		"line": [
			{
				"key": "CapitalGainSubtraction",
				"value": "Colorado Source Capital Gain Subtraction: DR 1316"
			}
		]
	},
	{
		"docName": "dCO105SchGStmtTaxPaidOtherStates",
		"line": [
			{
				"key": "Otherstateincometaxreturn2",
				"value": "Other state(s) income tax return(s)"
			}
		]
	},
	{
		"docName": "dCO105SchG",
		"line": [
			{
				"key": "RemediationOfContaminatedLand",
				"value": "Credit for Remediation of Contaminated Land"
			},
			{
				"key": "PreservationOfHistoricStructuresCredit3",
				"value": "Preservation of Historic Structures credit"
			}
		]
	},
	{
		"docName": "dCO104",
		"line": [
			{
				"key": "TaxpayerDR0102",
				"value": "Taxpayer DR0102"
			},
			{
				"key": "SpouseDR0102",
				"value": "Spouse DR0102"
			},
			{
				"key": "Taxpayerdeathcertificate",
				"value": "Taxpayer death certificate"
			},
			{
				"key": "Spousedeathcertificate",
				"value": "Spouse death certificate"
			}
		]
	},
	{
		"docName": "dCO104X",
		"line": [
			{
				"key": "104xTaxpayerDR0102",
				"value": "104x Taxpayer DR0102"
			},
			{
				"key": "104xSpouseDR0102",
				"value": "104x Spouse DR0102"
			},
			{
				"key": "104xTaxpayerdeathcertificate",
				"value": "104x Taxpayer death certificate"
			},
			{
				"key": "104xSpousedeathcertificate",
				"value": "104x Spouse death certificate"
			}
		]
	},
	{
		"docName": "dSchCO104CR",
		"line": [
			{
				"key": "Line6",
				"value": "Business Personal Property Credit"
			},
			{
				"key": "Line17CreditUsed",
				"value": "Plastic recycling investment Credit Used"
			},
			{
				"key": "Line19CreditUsed",
				"value": "Historic Property Preservation Credit Used"
			},
			{
				"key": "Line20CreditUsed",
				"value": "Child Care Center Investment Credit Used"
			},
			{
				"key": "Line21CreditUsed",
				"value": "Employer Child Care Facility Investment Credit Used"
			},
			{
				"key": "Line22CreditUsed",
				"value": "School-to-Career Investment Credit Used"
			},
			{
				"key": "Line23CreditUsed",
				"value": "Colorado Works Program Credit Used"
			},
			{
				"key": "Line24CreditUsed",
				"value": "Child Care Contribution Credit Used"
			},
			{
				"key": "Line25CreditUsed",
				"value": "Long-term Care Insurance Credit Used"
			},
			{
				"key": "Line26CreditUsed",
				"value": "Aircraft Manufacturer New Employee Credit Used"
			},
			{
				"key": "Line27CreditUsed",
				"value": "Credit for Environmental Remediation of Contaminated Land Credit Used"
			},
			{
				"key": "Line28CreditUsed",
				"value": "Colorado Job Growth Incentive Credit Used"
			},
			{
				"key": "Line29CreditUsed",
				"value": "Certified Auction Group License Fee Credit Used"
			},
			{
				"key": "Line30CreditUsed",
				"value": "Advanced Industry Investment Credit Used"
			},
			{
				"key": "Line31CreditUsed",
				"value": "Affordable Housing Credit Used"
			},
			{
				"key": "Line32CreditUsed",
				"value": "Credit for Food Contributed to Hunger-Relief Charitable Organizations Credit Used"
			},
			{
				"key": "Line34CreditUsed",
				"value": "Preservation of Historic Structures Credit Used"
			},
			{
				"key": "Line37CreditUsed",
				"value": "Rural & Frontier Health Care Preceptor Credit Used"
			}
		]
	},
	{
		"docName": "dMASchSC",
		"line": [
			{
				"key": "SepticCredit",
				"value": "Septic Credit"
			}
		]
	},
	{
		"docName": "dMAForm1",
		"line": [
			{
				"key": "CCCLoanReportedElectionAmt",
				"value": "CCCLoanReportedElectionAmt"
			},
			{
				"key": "ElectionDeferCropInsProcInd",
				"value": "ElectionDeferCropInsProcInd"
			}
		]
	},
	{
		"docName": "dSchF",
		"line": [
			{
				"key": "MortgageInterestPaidOtherAmt",
				"value": "MortgageInterestPaidOtherAmt"
			},
			{
				"key": "Form1098RecipientsStatement",
				"value": "Form1098RecipientsStatement"
			}
		]
	},
	{
		"docName": "dSchING",
		"line": [
			{
				"key": "LocalTaxesPaidOutOfIndiana",
				"value": "Credit for Local Taxes Paid outside Indiana"
			},
			{
				"key": "CreditforLocalTaxesPaidOutsideIndiana",
				"value": "Credit for Local Taxes Paid outside Indiana"
			}
		]
	},
	{
		"docName": "dINSch6OtherCredits",
		"line": [
			{
				"key": "CertificateIssuedByIEDCforCoalGasificationTechnologyInvestmentCredit",
				"value": "Coal Gasification Technology Investment Credit"
			},
			{
				"key": "EnterpriseZoneEmploymentExpenseCredit",
				"value": "Enterprise Zone Employment Expense Credit"
			},
			{
				"key": "MilitaryBaseInvestmentCostCredit",
				"value": "Military Base Investment Cost Credit"
			},
			{
				"key": "MilitaryBaseRecoveryCredit",
				"value": "Military Base Recovery Credit"
			}
		]
	},
	{
		"docName": "dSchIN6",
		"line": [
			{
				"key": "LocalTaxesPaidOutOfIndiana",
				"value": "Credit for Local Taxes Paid outside Indiana"
			},
			{
				"key": "CreditforLocalTaxesPaidOutsideIndiana",
				"value": "Credit for Local Taxes Paid outside Indiana"
			}
		]
	},
	{
		"docName": "dUTTC20S",
		"line": [
			{
				"key": "IRSAcceptanceLetter",
				"value": "IRS acceptance letter"
			}
		]
	},
	{
		"docName": "dUTTC20",
		"line": [
			{
				"key": "EstimatedPrepaymentDocumentation1",
				"value": "Estimated Prepayment Documentation"
			},
			{
				"key": "EstimatedPrepaymentDocumentation2",
				"value": "Estimated Prepayment Documentation"
			},
			{
				"key": "EstimatedPrepaymentDocumentation3",
				"value": "Estimated Prepayment Documentation"
			},
			{
				"key": "EstimatedPrepaymentDocumentation4",
				"value": "Estimated Prepayment Documentation"
			}
		]
	},
	{
		"docName": "dSchUTTC20A",
		"line": [
			{
				"key": "LossCarriedForwardfromPriorYears",
				"value": "Loss Carried Forward from Prior Years"
			},
			{
				"key": "LowIncomeHousingCredit",
				"value": "Recapture of low-income housing credit"
			}
		]
	},
	{
		"docName": "dSchUTTC20C",
		"line": [
			{
				"key": "OtherFederalCredits",
				"value": "Other Federal Credits"
			}
		]
	},
	{
		"docName": "dSchUTTC20D",
		"line": [
			{
				"key": "ContributionCarryforward",
				"value": "Contribution Carryforward Documentation"
			}
		]
	},
	{
		"docName": "dNonRefCredits",
		"line": [
			{
				"key": "LowIncomeHousingProject",
				"value": "Utah Credit Share Summary of Low-Income Housing Project – Form TC-40LIS"
			},
			{
				"key": "BondInterestCredit",
				"value": "Bond Interest Credit"
			}
		]
	},
	{
		"docName": "dRefundableCredits",
		"line": [
			{
				"key": "MinralProductionWithholdingTax",
				"value": "Minral Production Withholding Tax – Form 675R"
			}
		]
	},
	{
		"docName": "dCodeAndCredit4",
		"line": [
			{
				"key": "TaxPaidToAnotherState",
				"value": "Tax Paid to Another State (attach TC-41S)"
			}
		]
	},
	{
		"docName": "dCT1040",
		"line": [
			{
				"key": "CT1040CRC",
				"value": "CT-1040CRC"
			},
			{
				"key": "CT1040WH",
				"value": "Supplemental Schedule CT-1040WH"
			}
		]
	},
	{
		"docName": "dCT1040NRPY",
		"line": [
			{
				"key": "1040NRPYCT1040CRC",
				"value": "1040NRPY CT-1040CRC"
			}
		]
	},
	{
		"docName": "dCT10651120SI",
		"line": [
			{
				"key": "FormCT8822",
				"value": "Form CT-8822"
			}
		]
	},
	{
		"docName": "dCT1120",
		"line": [
			{
				"key": "FormCT1120RC",
				"value": "Form CT-1120RC"
			},
			{
				"key": "FormCT1120 RDC",
				"value": "Form CT-1120 RDC"
			},
			{
				"key": "FormCT1120XCHdocumentation",
				"value": "Form CT-1120 XCH documentation"
			},
			{
				"key": "ScheduleELine3ColumnA",
				"value": "Surplus reserves Beginning of Year"
			},
			{
				"key": "ScheduleELine3ColumnB",
				"value": "Surplus reserves End of Year"
			},
			{
				"key": "ScheduleELine5ColumnA",
				"value": "Holdings of stock of private corporations Beginning of Year"
			},
			{
				"key": "ScheduleELine5ColumnB",
				"value": "Holdings of stock of private corporations End of Year"
			},
			{
				"key": "ScheduleGLINE2CDateoftransfer",
				"value": "Connecticut realty property transferred"
			}
		]
	},
	{
		"docName": "dCT1120CR",
		"line": [
			{
				"key": "LINE5Checkbox",
				"value": "Form CT-1120 XCH"
			},
			{
				"key": "LINE8Checkbox",
				"value": "Form CT-1120 PIC"
			},
			{
				"key": "AdditionofAffiliates",
				"value": "Addition of Affiliates"
			},
			{
				"key": "DeletionofAffiliates",
				"value": "Deletion of Affiliates"
			}
		]
	},
	{
		"docName": "dAffiliateCorp2",
		"line": [
			{
				"key": "PartILine1",
				"value": "Forms CT-1120CC"
			}
		]
	},
	{
		"docName": "",
		"line": [
			{
				"key": "Title19Status",
				"value": "Form CT-19IT"
			}
		]
	},
	{
		"docName": "dCT1120PE",
		"line": [
			{
				"key": "Line2",
				"value": "Form CT-1120CU"
			}
		]
	},
	{
		"docName": "dCT1120XStmtExplain",
		"line": [
			{
				"key": "Line 22Statement",
				"value": "Form CT-1120K"
			}
		]
	},
	{
		"docName": "dSchCT1041FAStmtPart2TrustEstates",
		"line": [
			{
				"key": "PART24PETaxCredit",
				"value": "Schedule CT-PE"
			}
		]
	},
	{
		"docName": "dMO1120",
		"line": [
			{
				"key": "Interestfromexemptfederal",
				"value": "Interest from exempt federal"
			},
			{
				"key": "AgricultureDisasterRelief",
				"value": "Agriculture Disaster Relief"
			},
			{
				"key": "Corporationincometax",
				"value": "Corporation income tax"
			},
			{
				"key": "LowIncomeHousingCredit",
				"value": "Low Income Housing Credit"
			},
			{
				"key": "Estimatedtaxpayments",
				"value": "Estimated tax payments"
			}
		]
	},
	{
		"docName": "dMiscCreditInfo",
		"line": [
			{
				"key": "AlternativeFuelInfrastructure",
				"value": "Alternative Fuel Infrastructure"
			},
			{
				"key": "NeworExpandedBusinessFacility",
				"value": "New or Expanded Business Facility"
			},
			{
				"key": "BrownfieldJobsandInvestment",
				"value": "Brownfield “Jobs and Investment”"
			},
			{
				"key": "Distressed Area Land Assemblage",
				"value": "Distressed Area Land Assemblage"
			},
			{
				"key": "DryFireHydrant",
				"value": "Dry Fire Hydrant"
			},
			{
				"key": "DevelopmentTaxCredit",
				"value": "Development Tax Credit"
			},
			{
				"key": "EnterpriseZone",
				"value": "Enterprise Zone"
			},
			{
				"key": "FamilyDevelopmentAccount",
				"value": "Family Development Account"
			},
			{
				"key": "FilmProduction",
				"value": "Film Production"
			},
			{
				"key": "HistoricPreservation",
				"value": "Historic Preservation"
			},
			{
				"key": "SmallBusinessInvestmentCapital",
				"value": "Small Business Investment (Capital)"
			},
			{
				"key": "InnovationCampusTaxCredit",
				"value": "Innovation Campus Tax Credit"
			},
			{
				"key": "MissouriQualityJobs",
				"value": "Missouri Quality Jobs"
			},
			{
				"key": "MissouriWorksCredit",
				"value": "Missouri Works Credit"
			},
			{
				"key": "NeighborhoodAssistance",
				"value": "Neighborhood Assistance"
			},
			{
				"key": "NewEnterpriseCreation",
				"value": "New Enterprise Creation"
			},
			{
				"key": "NewEnhancedEnterpriseZone",
				"value": "New Enhanced Enterprise Zone"
			},
			{
				"key": "NewMarketTaxCredit",
				"value": "New Market Tax Credit"
			},
			{
				"key": "RebuildingCommunities",
				"value": "Rebuilding Communities"
			},
			{
				"key": "NeighborhoodPreservationAct",
				"value": "Rebuilding Communities and Neighborhood Preservation Act"
			},
			{
				"key": "QualifiedResearchExpense",
				"value": "Qualified Research Expense"
			},
			{
				"key": "Remediation",
				"value": "Remediation"
			},
			{
				"key": "SmallBusinessGuarantyFees",
				"value": "Small Business Guaranty Fees"
			},
			{
				"key": "SmallBusinessIncubator",
				"value": "Small Business Incubator"
			},
			{
				"key": "SportingEventCredit",
				"value": "Sporting Event Credit"
			},
			{
				"key": "SportingContributionCredit",
				"value": "Sporting Contribution Credit"
			},
			{
				"key": "TransportationDevelopment",
				"value": "Transportation Development"
			},
			{
				"key": "ProcessedWoodEnergy",
				"value": "Processed Wood Energy"
			},
			{
				"key": "WineGrapeProduction",
				"value": "Wine and Grape Production"
			},
			{
				"key": "YouthOpportunities",
				"value": "Youth Opportunities"
			},
			{
				"key": "BondEnhancement",
				"value": "Bond Enhancement"
			},
			{
				"key": "MissouriBusinessIncentives",
				"value": "Missouri Business Use Incentives for Large Certificate* Scale Development"
			},
			{
				"key": "DevelopmentReserveContributionCredit",
				"value": "Development Reserve Contribution Credit"
			},
			{
				"key": "ExportFinance",
				"value": "Export Finance"
			},
			{
				"key": "InfrastructureDevelopment",
				"value": "Infrastructure Development"
			},
			{
				"key": "AffordableHousingAssistance",
				"value": "Affordable Housing Assistance"
			},
			{
				"key": "MissouriLowIncomeHousing",
				"value": "Missouri Low Income Housing"
			},
			{
				"key": "SpecialNeedsAdoption",
				"value": "Special Needs Adoption"
			},
			{
				"key": "BankFranchiseTax",
				"value": "Bank Franchise Tax"
			},
			{
				"key": "BankTaxCreditforSCorporation",
				"value": "Bank Tax Credit for S Corporation"
			},
			{
				"key": "ChildrenCrisis",
				"value": "Children in Crisis"
			},
			{
				"key": "ChampionChildren",
				"value": "Champion for Children"
			},
			{
				"key": "DisabledAccess",
				"value": "Disabled Access"
			},
			{
				"key": "ResidentialDwellingAccessibility",
				"value": "Residential Dwelling Accessibility"
			},
			{
				"key": "FoodPantryTax",
				"value": "Food Pantry Tax"
			},
			{
				"key": "SelfEmployedHealthInsurance",
				"value": "Self-Employed Health Insurance"
			},
			{
				"key": "PublicSafetyOfficerSurvivingSpouse",
				"value": "Public Safety Officer Surviving Spouse"
			},
			{
				"key": "AgriculturalProductUtilizationContributor",
				"value": "Agricultural Product Utilization Contributor"
			},
			{
				"key": "FamilyFarmsAct",
				"value": "Family Farms Act"
			},
			{
				"key": "MeatProcessingFacilityInvestmentTaxCredit",
				"value": "Meat Processing Facility Investment Tax Credit"
			},
			{
				"key": "NewGenerationCooperativeIncentive",
				"value": "New Generation Cooperative Incentive"
			},
			{
				"key": "QualifiedBeef",
				"value": "Qualified Beef"
			},
			{
				"key": "CharcoalProducers",
				"value": "Charcoal Producers"
			},
			{
				"key": "DiaperBank",
				"value": "Diaper Bank"
			},
			{
				"key": "DisabilityCareProvider",
				"value": "Developmental Disability Care Provider"
			},
			{
				"key": "ShelterVictimsofDomesticViolence",
				"value": "Shelter for Victims of Domestic Violence"
			},
			{
				"key": "MaternityHome",
				"value": "Maternity Home"
			},
			{
				"key": "PregnancyResource",
				"value": "Pregnancy Resource"
			},
			{
				"key": "ResidentialTreatmentAgency",
				"value": "Residential Treatment Agency"
			},
			{
				"key": "SchoolChildrenHealthHunger",
				"value": "School Children Health and Hunger"
			},
			{
				"key": "SharedCare",
				"value": "Shared Care"
			}
		]
	},
	{
		"docName": "dOtherSubtractions",
		"line": [
			{
				"key": "WisconsinNetOperatingLossCarryforward",
				"value": "Wisconsin Net Operating Loss Carryforward"
			},
			{
				"key": "ExplanationToAmountsNotTaxablebyWisconsin",
				"value": "Amounts Not Taxable by Wisconsin"
			}
		]
	},
	{
		"docName": "dSchWICR",
		"line": [
			{
				"key": "LowIncomeHousingCredit",
				"value": "Schedule LI Low-income housing credit"
			},
			{
				"key": "Suppltofederalhistoricrehabilitationcredit",
				"value": "Schedule HR Supplement to federal historic rehabilitation credit"
			},
			{
				"key": "FarmlandPreservationCredit",
				"value": "Schedule FC Farmland Preservation Credit"
			}
		]
	},
	{
		"docName": "dWI1",
		"line": [
			{
				"key": "RepaymentCredit",
				"value": "Repayment Credit"
			},
			{
				"key": "Eligibleveteransandsurvivingspousespropertytaxcredit",
				"value": "Copy of property tax bill and certification to receive property tax credit"
			}
		]
	},
	{
		"docName": "dFormOK514",
		"line": [
			{
				"key": "DocumentationFromMutualFund",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "DocumentationFromMutualFund2",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "PartnerCredit",
				"value": "Documentation for Partner’s Credit"
			},
			{
				"key": "PartnerCredit2",
				"value": "Documentation for Partner’s Credit2"
			},
			{
				"key": "PartnerCredit3",
				"value": "Documentation for Partner’s Credit3"
			},
			{
				"key": "PartnersWithholding",
				"value": "Documentation for Partner’s Withholding"
			},
			{
				"key": "PartnersWithholding2",
				"value": "Documentation for Partner’s Withholding2"
			},
			{
				"key": "PartnersWithholding3",
				"value": "Documentation for Partner’s Withholding3"
			}
		]
	},
	{
		"docName": "dOK511CR",
		"line": [
			{
				"key": "SmallBusinessCapitalCredit",
				"value": "Small Business Capital Credit : Form 529"
			},
			{
				"key": "VolunteerFirefighterCredit",
				"value": "Volunteer Firefighter Credit : FTAC’s Form"
			},
			{
				"key": "ResearchandDevelopmentNewJobsCredit",
				"value": "Research and Development New Jobs Credit : Form 563"
			},
			{
				"key": "CreditforEmployeesAerospaceSector",
				"value": "Credit for Employees in the Aerospace Sector : Form 564"
			},
			{
				"key": "CreditsforEmployersAerospaceSector",
				"value": "Credits for Employers in the Aerospace Sector : Form 565"
			},
			{
				"key": "CreditforVentureCapitalInvestment",
				"value": "Credit for Venture Capital Investment : Form 518 – A or 518 – B"
			}
		]
	},
	{
		"docName": "dOK512S",
		"line": [
			{
				"key": "DocumentationFromMutualFund3",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "DocumentationFromMutualFund4",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "PartnerCredit4",
				"value": "Documentation for Partner’s Credit"
			},
			{
				"key": "PartnerCredit5",
				"value": "Documentation for Partner’s Credit2"
			},
			{
				"key": "PartnerCredit6",
				"value": "Documentation for Partner’s Credit3"
			},
			{
				"key": "scheduleoftaxcomputation",
				"value": "schedule of the tax computation"
			},
			{
				"key": "DonationSplit",
				"value": "Schedule showing donation split"
			}
		]
	},
	{
		"docName": "dOK512",
		"line": [
			{
				"key": "scheduleoftaxcomputation2",
				"value": "Schedule showing donation split"
			}
		]
	},
	{
		"docName": "dOK513",
		"line": [
			{
				"key": "DocumentationFromMutualFund5",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "DocumentationFromMutualFund6",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "BusinessSchedule",
				"value": "Business Income or Loss Schedule"
			},
			{
				"key": "DetailedScheduled",
				"value": "Detailed Scheduled"
			}
		]
	},
	{
		"docName": "dOK511",
		"line": [
			{
				"key": "OtherStatesReturn",
				"value": "other state’s return"
			},
			{
				"key": "Schedule511ALine1",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "Schedule511ALine3",
				"value": "Annuity Supplement"
			},
			{
				"key": "Schedule 511ALine10",
				"value": "Proof of Claim for Refund"
			},
			{
				"key": "Schedule511BLine1",
				"value": "Documentation from the mutual fund State"
			},
			{
				"key": "Schedule511CLine2",
				"value": "Documentation regarding the Social Security Administration"
			},
			{
				"key": "Schedule511CLine4",
				"value": "Proof of contribution"
			}
		]
	},
	{
		"docName": "dFormOK511Astmt",
		"line": [
			{
				"key": "Schedule511ALine14",
				"value": "Miscellaneous: Other Subtractions"
			}
		]
	},
	{
		"docName": "dFormOK511Cstmt",
		"line": [
			{
				"key": "Schedule511CLine6",
				"value": "copy of the written notice"
			},
			{
				"key": "Schedule511CLine63",
				"value": "copy of the written notice code 9"
			}
		]
	},
	{
		"docName": "dOK511NR",
		"line": [
			{
				"key": "Schedule511NRALine1FederalAmount",
				"value": "Documentation from the mutual fund"
			},
			{
				"key": "Schedule511NRBLine1FederalAmount",
				"value": "Documentation from the mutual fund2"
			}
		]
	},
	{
		"docName": "dMS80205",
		"line": [
			{
				"key": "Line24",
				"value": "Form 80-360"
			}
		]
	},
	{
		"docName": "dFranchiseTaxCredits",
		"line": [
			{
				"key": "PARTICODEAA",
				"value": "14 – Ad Valorem Inventory"
			},
			{
				"key": "PARTICODEAB",
				"value": "14 – Ad Valorem Inventory"
			},
			{
				"key": "PARTICODEAC",
				"value": "05 – Jobs Tax"
			}
		]
	},
	{
		"docName": "dIncomeTaxCredits",
		"line": [
			{
				"key": "PARTIICODEBA",
				"value": "14 – Ad Valorem Inventory"
			},
			{
				"key": "PARTIICODEBB",
				"value": "05 – Jobs Tax"
			},
			{
				"key": "PARTIICODE",
				"value": "14 – Ad Valorem Inventory"
			}
		]
	},
	{
		"docName": "dMS84122",
		"line": [
			{
				"key": "Line27",
				"value": "Income exemption"
			}
		]
	},
	{
		"docName": "dMS84110",
		"line": [
			{
				"key": "Line5",
				"value": "Deferred Taxes and Gains, Contingent Liabilities, All True Reserves and Other Elements"
			},
			{
				"key": "Line7",
				"value": "Holding Company Exclusion"
			},
			{
				"key": "Line17",
				"value": "Capital Examption"
			}
		]
	},
	{
		"docName": "dMS83122",
		"line": [
			{
				"key": "Line13",
				"value": "Additional Depreciation Schedule"
			},
			{
				"key": "Line22",
				"value": "Mississippi K-1s"
			},
			{
				"key": "Line221",
				"value": "Form 84-132"
			},
			{
				"key": "Line26",
				"value": "Other Ajustments Schedule"
			}
		]
	},
	{
		"docName": "dMS83124",
		"line": [
			{
				"key": "Line2",
				"value": "Cost of goods sold"
			},
			{
				"key": "Line4",
				"value": "Dividends"
			},
			{
				"key": "Line8",
				"value": "Allocable Capital Gain"
			},
			{
				"key": "Line9",
				"value": "Allocable Net Gain/ Loss"
			},
			{
				"key": "Line17",
				"value": "Taxes"
			},
			{
				"key": "Line26",
				"value": "Other Deductions"
			},
			{
				"key": "Line33",
				"value": "Adjustments"
			}
		]
	},
	{
		"docName": "dMS81110",
		"line": [
			{
				"key": "Line17e",
				"value": "Itemized Deduction Schedule"
			},
			{
				"key": "Line179",
				"value": "Other Additions  Schedule"
			},
			{
				"key": "Line17h",
				"value": "Other Deductions Schedule"
			},
			{
				"key": "Line17i",
				"value": "Other Additions  Schedule"
			},
			{
				"key": "Line20f",
				"value": "Non-Mississippi Income Schedule"
			},
			{
				"key": "Line20g",
				"value": "Other Deductions Schedule"
			}
		]
	},
	{
		"docName": "dSchMNM1C",
		"line": [
			{
				"key": "Line3",
				"value": "SEED Capital Investment Credit"
			},
			{
				"key": "Line5",
				"value": "Credit for attaining master’s degree"
			}
		]
	},
	{
		"docName": "dMNSchM4I",
		"line": [
			{
				"key": "Line4C",
				"value": "Sum of research expenses"
			}
		]
	},
	{
		"docName": "dMNM3",
		"line": [
			{
				"key": "Line16",
				"value": "Form PV44"
			}
		]
	},
	{
		"docName": "dMNSchRD",
		"line": [
			{
				"key": "Line44",
				"value": "Form 6765"
			}
		]
	},
	{
		"docName": "dMNM1REF",
		"line": [
			{
				"key": "Line6a",
				"value": "Enter National Park Service (NPS) project number"
			},
			{
				"key": "EnterpriseZoneCredit",
				"value": "Enterprise Zone Credit"
			}
		]
	},
	{
		"docName": "dSchMNKF",
		"line": [
			{
				"key": "Line21",
				"value": "Credit for historic structure rehabilitation"
			}
		]
	},
	{
		"docName": "dSchMNM1B",
		"line": [
			{
				"key": "CreditforHistoricstructurerehabilitation",
				"value": "Credit for historic structure rehabilitation"
			},
			{
				"key": "Angelinvestmenttaxcredit",
				"value": "Angel investment tax credit"
			}
		]
	},
	{
		"docName": "dMNM2",
		"line": [
			{
				"key": "Minnesotataxwithheld",
				"value": "Minnesota tax withheld"
			}
		]
	},
	{
		"docName": "dMNAWC",
		"line": [
			{
				"key": "Alternativewithholdingcertificateforyear",
				"value": "Alternative withholding certificate for year"
			}
		]
	},
	{
		"docName": "dMNM4",
		"line": [
			{
				"key": "HistoricStructureRehabilitationCredit",
				"value": "Historic Structure Rehabilitation Credit"
			}
		]
	},
	{
		"docName": "dKYSchITC",
		"line": [
			{
				"key": "CertifiedRehabilitation1",
				"value": "Certified Rehabilitation"
			},
			{
				"key": "CertifiedRehabilitation2",
				"value": "Certified Rehabilitation"
			},
			{
				"key": "TaxPaidtoAnotherState",
				"value": "Tax Paid to Another State"
			},
			{
				"key": "KentuckyInvestmentFund1",
				"value": "Kentucky Investment Fund"
			},
			{
				"key": "KentuckyInvestmentFund2",
				"value": "Kentucky Investment Fund"
			},
			{
				"key": "QualifiedResearchFacility1",
				"value": "Qualified Research Facility"
			},
			{
				"key": "QualifiedResearchFacility2",
				"value": "Qualified Research Facility"
			},
			{
				"key": "GEDIncentive1",
				"value": "GED Incentive"
			},
			{
				"key": "GEDIncentive2",
				"value": "GED Incentive"
			},
			{
				"key": "VoluntaryEnvironmentalRemediation1",
				"value": "Voluntary Environmental Remediation"
			},
			{
				"key": "VoluntaryEnvironmentalRemediation2",
				"value": "Voluntary Environmental Remediation"
			},
			{
				"key": "CleanCoalIncentive1",
				"value": "Clean Coal Incentive"
			},
			{
				"key": "CleanCoalIncentive2",
				"value": "Clean Coal Incentive"
			},
			{
				"key": "Ethanol1",
				"value": "Ethanol"
			},
			{
				"key": "Ethanol2",
				"value": "Ethanol"
			},
			{
				"key": "CellulosicEthanol1",
				"value": "Cellulosic Ethanol"
			},
			{
				"key": "CellulosicEthanol2",
				"value": "Cellulosic Ethanol"
			},
			{
				"key": "RailroadMaintenanceImprovement1",
				"value": "Railroad Maintenance & Improvement"
			},
			{
				"key": "RailroadMaintenanceImprovement2",
				"value": "Railroad Maintenance & Improvement"
			},
			{
				"key": "EndowKentucky1",
				"value": "Endow Kentucky"
			},
			{
				"key": "EndowKentucky2",
				"value": "Endow Kentucky"
			},
			{
				"key": "MarketsDevelopmentProgram1",
				"value": "New Markets Development Program"
			},
			{
				"key": "MarketsDevelopmentProgram2",
				"value": "New Markets Development Program"
			},
			{
				"key": "DistilledSpirits1",
				"value": "Distilled Spirits"
			},
			{
				"key": "DistilledSpirits2",
				"value": "Distilled Spirits"
			},
			{
				"key": "AngelInvestor1",
				"value": "Angel Investor"
			},
			{
				"key": "AngelInvestor2",
				"value": "Angel Investor"
			},
			{
				"key": "FilmIndustry1",
				"value": "Film Industry"
			},
			{
				"key": "FilmIndustry2",
				"value": "Film Industry"
			},
			{
				"key": "Inventory1",
				"value": "Inventory"
			},
			{
				"key": "Inventory2",
				"value": "Inventory"
			}
		]
	},
	{
		"docName": "dKY720",
		"line": [
			{
				"key": "Filmindustrytaxcredit",
				"value": "Film industry tax credit"
			},
			{
				"key": "Certifiedrehabilitationtaxcredit",
				"value": "Certified rehabilitation tax credit"
			},
			{
				"key": "Interestincome",
				"value": "Interest income (U.S. obligations)"
			}
		]
	},
	{
		"docName": "dNMPIT101",
		"line": [
			{
				"key": "Line4FirstName",
				"value": "Form RPD-41083"
			}
		]
	},
	{
		"docName": "dNMPIT1",
		"line": [
			{
				"key": "Line4c",
				"value": "Taxpayer death certificateor other proof of death"
			},
			{
				"key": "Line4d",
				"value": "sopuse death certificateor other proof of death"
			}
		]
	},
	{
		"docName": "dSchNMRPD41319",
		"line": [
			{
				"key": "Line1",
				"value": "agricultural water on conservation tax credits"
			},
			{
				"key": "Line3",
				"value": "New Mexico income tax return."
			}
		]
	},
	{
		"docName": "dSchNMRPD41326",
		"line": [
			{
				"key": "ScheduleA",
				"value": "certificate from NMDOH"
			}
		]
	},
	{
		"docName": "dSchNMRPD41340",
		"line": [
			{
				"key": "Line2",
				"value": "New Mexico corporate or personal income"
			}
		]
	},
	{
		"docName": "dSchNMRPD41261",
		"line": [
			{
				"key": "Line1",
				"value": "agricultural biomass income tax credits"
			}
		]
	},
	{
		"docName": "dSchNMRPD41361",
		"line": [
			{
				"key": "Line3",
				"value": "New Mexico income tax return."
			}
		]
	},
	{
		"docName": "dNMPTESchB",
		"line": [
			{
				"key": "Line7Column1",
				"value": "all other allocated income"
			},
			{
				"key": "Line7Column2",
				"value": "all other allocated income2"
			}
		]
	},
	{
		"docName": "dCreditDetails2",
		"line": [
			{
				"key": "CreditTypeCode1",
				"value": "E01 - Electronic card-reading equipment tax credit."
			},
			{
				"key": "CreditTypeCode2",
				"value": "G02 - Intergovernmental business tax credit Entitlement statement"
			},
			{
				"key": "CreditTypeCode3",
				"value": "J01 - Job mentorship tax credit RPD-41280"
			},
			{
				"key": "CreditTypeCode4",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41390"
			},
			{
				"key": "CreditTypeCode5",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41389"
			},
			{
				"key": "CreditTypeCode6",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41388"
			},
			{
				"key": "CreditTypeCode7",
				"value": "P01 - Preservation of cultural property credit CIT-4"
			},
			{
				"key": "CreditTypeCode8",
				"value": "P01 - Preservation of cultural property credit letter of certification"
			},
			{
				"key": "CreditTypeCode9",
				"value": "P01 - Preservation of cultural property credit New Mexico Cultural\nProperties Review Committee"
			},
			{
				"key": "CreditTypeCode10",
				"value": "P01 - Preservation of cultural property credit New Mexico Arts\nand Cultural Districts coordinator"
			},
			{
				"key": "CreditTypeCode11",
				"value": "S02 - Sustainable building tax credit letter of eligibility"
			},
			{
				"key": "CreditTypeCode12",
				"value": "S03 - New sustainable building tax credit RPD-41383"
			},
			{
				"key": "CreditTypeCode13",
				"value": "S03 - New sustainable building tax credit letter of eligibility"
			},
			{
				"key": "CreditTypeCode14",
				"value": "S03 - New sustainable building tax credit letter of eligibility RPD-41382"
			},
			{
				"key": "CreditTypeCode15",
				"value": "S03 - New sustainable building tax credit letter of eligibility certificate of\neligibility to the Department."
			},
			{
				"key": "CreditTypeCode16",
				"value": "V01 - Veteran employment tax credit RPD-41372"
			},
			{
				"key": "CreditTypeCode17",
				"value": "V01 - Veteran employment tax credit RPD-41371"
			},
			{
				"key": "CreditTypeCode18",
				"value": "V01 - Veteran employment tax credit RPD-41370"
			},
			{
				"key": "CreditTypeCode19",
				"value": "T02 - Technology job and resrarch and development (additional) tax credit RPD-41386"
			},
			{
				"key": "CreditTypeCode20",
				"value": "R03 - Renewable energy production tax credit"
			},
			{
				"key": "CreditTypeCode21",
				"value": "R03 - Renewable energy production tax credit Certificate of eligibility from EMNRD"
			},
			{
				"key": "CreditTypeCode22",
				"value": "R03 - Renewable energy production tax credit taxpayer's interest in the\nFacility"
			},
			{
				"key": "CreditTypeCode23",
				"value": "R03 - Renewable energy production tax credit Allocation Notice that EMNRD\nApproved"
			},
			{
				"key": "CreditTypeCode24",
				"value": "R03 - Renewable energy production tax credit annual Notice of Allocation from EMNRD"
			},
			{
				"key": "CreditTypeCode25",
				"value": "R03 - Renewable energy production tax credit tax credit due the taxpayer"
			},
			{
				"key": "CreditTypeCode26",
				"value": "A04 - Advanced energy tax credit RPD-41333"
			},
			{
				"key": "CreditTypeCode27",
				"value": "A05 - Agricultural biomass tax credit RPD-41362"
			},
			{
				"key": "CreditTypeCode28",
				"value": "B02 - Blended biodiesel fuel tax credit  RPD-41322"
			},
			{
				"key": "CreditTypeCode29",
				"value": "L01 - Land conservation incentives credit RPD-41335"
			},
			{
				"key": "CreditTypeCode30",
				"value": "L01 - Land conservation incentives credit certificate of eligibility to the Taxation and Revenue Department"
			},
			{
				"key": "CreditTypeCode31",
				"value": "E01 - Electronic card-reading equipment tax credit."
			},
			{
				"key": "CreditTypeCode32",
				"value": "G02 - Intergovernmental business tax credit Entitlement statement"
			},
			{
				"key": "CreditTypeCode33",
				"value": "J01 - Job mentorship tax credit RPD-41280"
			},
			{
				"key": "CreditTypeCode34",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41390"
			},
			{
				"key": "CreditTypeCode35",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41389"
			},
			{
				"key": "CreditTypeCode36",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41388"
			},
			{
				"key": "CreditTypeCode37",
				"value": "P01 - Preservation of cultural property credit CIT-4"
			},
			{
				"key": "CreditTypeCode38",
				"value": "P01 - Preservation of cultural property credit letter of certification"
			},
			{
				"key": "CreditTypeCode39",
				"value": "P01 - Preservation of cultural property credit New Mexico Cultural\nProperties Review Committee"
			},
			{
				"key": "CreditTypeCode40",
				"value": "P01 - Preservation of cultural property credit New Mexico Arts\nand Cultural Districts coordinator"
			},
			{
				"key": "CreditTypeCode41",
				"value": "S02 - Sustainable building tax credit letter of eligibility"
			},
			{
				"key": "CreditTypeCode42",
				"value": "S03 - New sustainable building tax credit RPD-41383"
			},
			{
				"key": "CreditTypeCode43",
				"value": "S03 - New sustainable building tax credit letter of eligibility"
			},
			{
				"key": "CreditTypeCode44",
				"value": "S03 - New sustainable building tax credit letter of eligibility RPD-41382"
			},
			{
				"key": "CreditTypeCode45",
				"value": "S03 - New sustainable building tax credit letter of eligibility certificate of\neligibility to the Department."
			},
			{
				"key": "CreditTypeCode46",
				"value": "V01 - Veteran employment tax credit RPD-41372"
			},
			{
				"key": "CreditTypeCode47",
				"value": "V01 - Veteran employment tax credit RPD-41371"
			},
			{
				"key": "CreditTypeCode48",
				"value": "V01 - Veteran employment tax credit RPD-41370"
			},
			{
				"key": "CreditTypeCode49",
				"value": "T02 - Technology job and resrarch and development (additional) tax credit RPD-41386"
			},
			{
				"key": "CreditTypeCode50",
				"value": "R03 - Renewable energy production tax credit"
			},
			{
				"key": "CreditTypeCode51",
				"value": "R03 - Renewable energy production tax credit Certificate of eligibility from EMNRD"
			},
			{
				"key": "CreditTypeCode52",
				"value": "R03 - Renewable energy production tax credit taxpayer's interest in the\nFacility"
			},
			{
				"key": "CreditTypeCode53",
				"value": "R03 - Renewable energy production tax credit Allocation Notice that EMNRD\nApproved"
			},
			{
				"key": "CreditTypeCode54",
				"value": "R03 - Renewable energy production tax credit annual Notice of Allocation from EMNRD"
			},
			{
				"key": "CreditTypeCode55",
				"value": "R03 - Renewable energy production tax credit tax credit due the taxpayer"
			},
			{
				"key": "CreditTypeCode56",
				"value": "A04 - Advanced energy tax credit RPD-41333"
			},
			{
				"key": "CreditTypeCode57",
				"value": "A05 - Agricultural biomass tax credit RPD-41362"
			},
			{
				"key": "CreditTypeCode58",
				"value": "B02 - Blended biodiesel fuel tax credit  RPD-41322"
			},
			{
				"key": "CreditTypeCode59",
				"value": "L01 - Land conservation incentives credit RPD-41335"
			},
			{
				"key": "CreditTypeCode60",
				"value": "L01 - Land conservation incentives credit certificate of eligibility to the Taxation and Revenue Department"
			}
		]
	},
	{
		"docName": "dNMCITSchB",
		"line": [
			{
				"key": "AllocationtoNewMexico",
				"value": "other income Allocation to New Mexico"
			}
		]
	},
	{
		"docName": "dNMFID1",
		"line": [
			{
				"key": "Line4NewMexiconetoperatingloss",
				"value": "New Mexico net operating loss RPD-41375"
			}
		]
	},
	{
		"docName": "dNMFIDBSch1",
		"line": [
			{
				"key": "otherincomeAllocationtoNewMexico2",
				"value": "other income Allocation to New Mexico"
			},
			{
				"key": "Lione3column3",
				"value": "schedule of other deductions"
			}
		]
	},
	{
		"docName": "dFIDCRSupplementalScheduleStmt",
		"line": [
			{
				"key": "CreditTypeCode60",
				"value": "A02 -Angel investment credit. Attach Form RPD-41320 and certificate of eligibility."
			},
			{
				"key": "CreditTypeCode61",
				"value": "A02 -Angel investment credit certificate of eligibility from the New Mexico EDD"
			},
			{
				"key": "CreditTypeCode62",
				"value": "C01 – Cancer clinical trial tax credit. Attach Form RPD-41358"
			},
			{
				"key": "CreditTypeCode63",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41390"
			},
			{
				"key": "CreditTypeCode64",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41389"
			},
			{
				"key": "CreditTypeCode65",
				"value": "F02 - Foster youth employment personal income tax credit. Attach RPD-41388"
			},
			{
				"key": "CreditTypeCode66",
				"value": "G01 – Geothermal ground-coupled heat pump tax credit. Attach Form RPD-41346 and certificate of eligibility."
			},
			{
				"key": "CreditTypeCode67",
				"value": "J01 - Job mentorship tax credit RPD-41280"
			},
			{
				"key": "CreditTypeCode68",
				"value": "L01 – Land conservation incentives credit. Attach approval letter of qualified donation."
			},
			{
				"key": "CreditTypeCode69",
				"value": "P01 - Preservation of cultural property credit New Mexico Cultural\nProperties Review Committee"
			},
			{
				"key": "CreditTypeCode70",
				"value": "P01 - Preservation of cultural property credit New Mexico Arts\nand Cultural Districts coordinator"
			},
			{
				"key": "CreditTypeCode71",
				"value": "R01 – Rural job tax credit. Attach Form RPD-41247"
			},
			{
				"key": "CreditTypeCode72",
				"value": "R01 – Rural job tax credit. Attach Certificate of\nEligibility for the Rural Job Tax Credit"
			},
			{
				"key": "CreditTypeCode73",
				"value": "R02 – Rural health care practitioners tax credit. Attach  certification of eligibility\nreceived from DOH"
			},
			{
				"key": "CreditTypeCode74",
				"value": "R03 - Renewable energy production tax credit Allocation Notice that EMNRD\nApproved"
			},
			{
				"key": "CreditTypeCode75",
				"value": "S01 – New sustainable building tax credit. Attach letter of eligibility."
			},
			{
				"key": "CreditTypeCode76",
				"value": "S02 - Sustainable building tax credit letter of eligibility"
			},
			{
				"key": "CreditTypeCode77",
				"value": "S03 - New sustainable building tax credit RPD-41383"
			},
			{
				"key": "CreditTypeCode78",
				"value": "S03 - New sustainable building tax credit letter of eligibility"
			},
			{
				"key": "CreditTypeCode79",
				"value": "S03 - New sustainable building tax credit letter of eligibility certificate of\neligibility to the Department."
			},
			{
				"key": "CreditTypeCode80",
				"value": "T02 - Technology job and resrarch and development (additional) tax credit RPD-41386"
			},
			{
				"key": "CreditTypeCode81",
				"value": "V01 - Veteran employment tax credit RPD-41370"
			},
			{
				"key": "CreditTypeCode82",
				"value": "V01 - Veteran employment tax credit Certification of Eligibility for the Veteran Employment Tax Credit"
			},
			{
				"key": "CreditTypeCode83",
				"value": "A04 - Advanced energy tax credit RPD-41333"
			},
			{
				"key": "CreditTypeCode84",
				"value": "A04 - Advanced energy tax credit Advanced Energy Tax Credit Application"
			},
			{
				"key": "CreditTypeCode85",
				"value": "A04 - Advanced energy tax credit certificate of Eligibility"
			},
			{
				"key": "CreditTypeCode86",
				"value": "A05 - Agricultural biomass tax credit RPD-41362"
			},
			{
				"key": "CreditTypeCode87",
				"value": "A05 - Agricultural biomass tax credit Agricultural Biomass IncomeTax Credit Approval"
			},
			{
				"key": "CreditTypeCode88",
				"value": "A05 - Agricultural biomass tax credit certificate of Eligibility"
			},
			{
				"key": "CreditTypeCode89",
				"value": "B01 – Business facility rehabilitation credit. Attach certificate of completion."
			},
			{
				"key": "CreditTypeCode90",
				"value": "C01 – Cancer clinical trial tax credit. Attach Form RPD-41358"
			}
		]
	},
	{
		"docName": "dKS120S",
		"line": [
			{
				"key": "NonbusinessIncomeDocumentation",
				"value": "Nonbusiness Income Documentation"
			},
			{
				"key": "NonbusinessIncomeDocumentationKansas",
				"value": "Nonbusiness Income Documentation Kansas"
			},
			{
				"key": "USGovernmentobligation",
				"value": "U.S. Government obligation"
			},
			{
				"key": "ForeignDividends",
				"value": "Foreign Dividends"
			},
			{
				"key": "Othertaxpayments",
				"value": "Other tax payments"
			}
		]
	},
	{
		"docName": "dPartIIShareholderPartnerData",
		"line": [
			{
				"key": "PARTIIColumn5",
				"value": "Adjustments due to Guaranteed Payments"
			}
		]
	},
	{
		"docName": "dKS121S",
		"line": [
			{
				"key": "PARTIColumn6d",
				"value": "Other additions to federal income"
			},
			{
				"key": "PARTIColumn9d",
				"value": "Foreign Dividends"
			},
			{
				"key": "PARTIColumn10d",
				"value": "Other subtractions to federal income"
			},
			{
				"key": "PARTIColumn13d",
				"value": "Nonbusiness Income Documentation"
			},
			{
				"key": "PARTIcolumn17a",
				"value": "Nonbusiness Income Documentation Kansas"
			},
			{
				"key": "PARTIColumn17b",
				"value": "Nonbusiness Income Documentation KansasB"
			},
			{
				"key": "OtherTangibleAssets1",
				"value": "Other Tangible Assets"
			},
			{
				"key": "OtherTangibleAssets2",
				"value": "Other Tangible AssetsB"
			}
		]
	},
	{
		"docName": "dKS121",
		"line": [
			{
				"key": "PARTIIOtherIncome",
				"value": "Other income"
			},
			{
				"key": "PartILine5d",
				"value": "Other additions to federal income"
			},
			{
				"key": "PartILine8d",
				"value": "foreign dividends"
			},
			{
				"key": "PartILine9d",
				"value": "Other subtractions from federal income"
			},
			{
				"key": "PartILine12d",
				"value": "Nonbusiness income Total company"
			},
			{
				"key": "PartILine16a",
				"value": "Nonbusiness income Kansas"
			},
			{
				"key": "PartILine16b",
				"value": "Nonbusiness income Kansas3"
			},
			{
				"key": "PartILine20d",
				"value": "net operating loss deduction"
			},
			{
				"key": "OtherTangibleAssets11",
				"value": "Other Tangible Assets"
			},
			{
				"key": "OtherTangibleAssets22",
				"value": "Other Tangible AssetsB"
			}
		]
	},
	{
		"docName": "dKS120",
		"line": [
			{
				"key": "Line12",
				"value": "Nonbusiness Income Documentation"
			},
			{
				"key": "PartILine1",
				"value": "Entrepreneurship Credit"
			},
			{
				"key": "PartILine2",
				"value": "Insurance Credit"
			},
			{
				"key": "PartILine6",
				"value": "Improvement Credit"
			},
			{
				"key": "PartILine7",
				"value": "Plugging Credit"
			},
			{
				"key": "PartILine8",
				"value": "Contribution Credit"
			},
			{
				"key": "PartILine10",
				"value": "Venture Capital Credit"
			},
			{
				"key": "PartILine11",
				"value": "Seed Capital Credit"
			},
			{
				"key": "PartILine16",
				"value": "Law Enforcement Training Center Credit"
			},
			{
				"key": "PartILine17",
				"value": "Petroleum Refinery Credit"
			},
			{
				"key": "PartILine18",
				"value": "Guard and Reserve Employer Credit"
			},
			{
				"key": "PartILine19",
				"value": "Port Authority Credit"
			},
			{
				"key": "PartILine20",
				"value": "Qualifying Pipeline Credit"
			},
			{
				"key": "PartILine21",
				"value": "Energy Credit"
			},
			{
				"key": "PartILine22",
				"value": "Environmental Compliance Credit"
			},
			{
				"key": "PartILine23",
				"value": "Storage and Blending Equipment Credit"
			},
			{
				"key": "PartILine24",
				"value": "Cogeneration Facility Credit"
			},
			{
				"key": "PartILine25",
				"value": "Disaster Capital Investment Credit"
			},
			{
				"key": "PartILine26",
				"value": "Farm Net Operating Loss"
			},
			{
				"key": "PartILine29",
				"value": "Child Day Care Assistance Credit"
			},
			{
				"key": "PartILine33",
				"value": "Farm Net Operating Loss"
			}
		]
	},
	{
		"docName": "dKSK41",
		"line": [
			{
				"key": "USGovernmentobligations2",
				"value": "U.S. Government obligations"
			},
			{
				"key": "Othernonrefundablecredits",
				"value": "Other nonrefundable credits"
			},
			{
				"key": "Refundablecredits",
				"value": "Refundable credits"
			}
		]
	},
	{
		"docName": "dKSSchK34",
		"line": [
			{
				"key": "Qualifiedbusinessfacilityincome",
				"value": "Qualified business facility income"
			}
		]
	},
	{
		"docName": "dKSK40otherstate",
		"line": [
			{
				"key": "OtherStatetaxreturn6",
				"value": "Other State(s) tax return"
			}
		]
	},
	{
		"docName": "dSchKSCR",
		"line": [
			{
				"key": "AngelInvestorCredit",
				"value": "Angel Investor Credit"
			},
			{
				"key": "CenterEntrepreneurshipCredit",
				"value": "Center for Entrepreneurship Credit"
			},
			{
				"key": "GasorOilWellCredit",
				"value": "Gas or Oil Well Credit"
			},
			{
				"key": "VentureLocalSeedCapitalCredit",
				"value": "Venture and Local Seed Capital Credit"
			},
			{
				"key": "PetroleumRefineryCredit",
				"value": "Petroleum Refinery Credit"
			},
			{
				"key": "QualifyingPipelineCredit",
				"value": "Qualifying Pipeline Credit"
			},
			{
				"key": "BioMasstoEnergyPlantCredit",
				"value": "BioMass-to-Energy Plant Credit"
			},
			{
				"key": "StorageandBlendingEquipmentCredit",
				"value": "Storage and Blending Equipment Credit"
			},
			{
				"key": "ElectricCogenerationFacilityCredit",
				"value": "Electric Cogeneration Facility Credit"
			},
			{
				"key": "DeclaredDisasterCapitalInvestment",
				"value": "Declared Disaster Capital Investment"
			}
		]
	},
	{
		"docName": "dSchKSS",
		"line": [
			{
				"key": "AdjustmentstoIncome",
				"value": "Adjustments to Income"
			}
		]
	},
	{
		"docName": "dSchAR1000ADJ",
		"line": [
			{
				"key": "Bordercityexemption",
				"value": "Border city exemption"
			}
		]
	},
	{
		"docName": "dAR1002F",
		"line": [
			{
				"key": "Otherstatetaxcredit",
				"value": "Other state tax credit"
			},
			{
				"key": "Farmincome",
				"value": "Farm income."
			}
		]
	},
	{
		"docName": "dAR902F",
		"line": [
			{
				"key": "Rentsroyaltiespartnerships",
				"value": "Rents, royalties, partnerships, other estates and trusts, etc."
			}
		]
	},
	{
		"docName": "dAR1100CT",
		"line": [
			{
				"key": "MultistateCorporationDirectAccounting",
				"value": "Multistate Corporation -Direct Accounting"
			},
			{
				"key": "LessCostofGoodsSold",
				"value": "Less Cost of Goods Sold"
			},
			{
				"key": "NetOperatingLosses",
				"value": "Net Operating Losses: (Adjust for Non-taxable Income)"
			}
		]
	},
	{
		"docName": "dAR1100SchA",
		"line": [
			{
				"key": "AddAdjustments",
				"value": "Add Adjustments"
			},
			{
				"key": "DeductAdjustments",
				"value": "Deduct Adjustments"
			},
			{
				"key": "DirectIncomeAllocatedArkansas",
				"value": "Direct Income Allocated to Arkansas"
			},
			{
				"key": "OtherGrossReceipts",
				"value": "Other Gross Receipts"
			}
		]
	},
	{
		"docName": "dAR1100SchREC",
		"line": [
			{
				"key": "Obligationinterestincome",
				"value": "U.S. Obligation interest income"
			},
			{
				"key": "Arkansasdepreciationadjustment",
				"value": "Add or Subtract Arkansas depreciation adjustment"
			},
			{
				"key": "Capitalgainorlossadjustment",
				"value": "Capital gain or loss adjustment for basis difference"
			}
		]
	},
	{
		"docName": "dAR1100S",
		"line": [
			{
				"key": "Costgoodssoldoperations",
				"value": "Cost of goods sold and/or operations"
			},
			{
				"key": "WithholdingPayment",
				"value": "Withholding Payment"
			},
			{
				"key": "BadDebts",
				"value": "Bad Debts: (Attach schedule)"
			}
		]
	},
	{
		"docName": "dAR1100SSchA",
		"line": [
			{
				"key": "OtherBusinessGrossReceipts",
				"value": "Other Business Gross Receipts"
			}
		]
	},
	{
		"docName": "dAR1100SSchD",
		"line": [
			{
				"key": "TaxableIncome1",
				"value": "Taxable Income"
			},
			{
				"key": "TaxableIncome2",
				"value": "Taxable Income"
			}
		]
	},
	{
		"docName": "dOR20SOtherAddition",
		"line": [
			{
				"key": "Line2Statement",
				"value": "Charitable donations not allowed for Oregon"
			}
		]
	},
	{
		"docName": "dORScheduleASCCorpSTMT",
		"line": [
			{
				"key": "ScetionACode",
				"value": "Charitable donations not allowed for Oregon"
			}
		]
	},
	{
		"docName": "dSchME1",
		"line": [
			{
				"key": "NetOperatingLossRecoveryAdjustment",
				"value": "Net Operating Loss Recovery Adjustment"
			}
		]
	},
	{
		"docName": "dME1310",
		"line": [
			{
				"key": "courtcertificateshowingyourappointment",
				"value": "court certificate showing your appointment"
			}
		]
	},
	{
		"docName": "dME1040Ln28cWkt",
		"line": [
			{
				"key": "AffordableHousingCertificate",
				"value": "Affordable Housing Certificate"
			}
		]
	},
	{
		"docName": "dME1120",
		"line": [
			{
				"key": "Line8a",
				"value": "Form REW-1"
			}
		]
	},
	{
		"docName": "dMESeedCapitalInvtCr",
		"line": [
			{
				"key": "Investmentcreditcertificate1",
				"value": "Investment credit certificate January 1, 2015 through December 31, 2015"
			},
			{
				"key": "Investmentcreditcertificate2",
				"value": "Investment credit certificate January 1, 2016 through December 31, 2016"
			},
			{
				"key": "Investmentcreditcertificate3",
				"value": "Investment credit certificate January 1, 2017 through December 31, 2017"
			},
			{
				"key": "Investmentcreditcertificate4",
				"value": "Investment credit certificate January 1, 2018 through December 31, 2018"
			}
		]
	},
	{
		"docName": "dMEHistoricRehbCrWkt",
		"line": [
			{
				"key": "historicpreservationcertification",
				"value": "Part 3 of the historic preservation certification application approved"
			},
			{
				"key": "smallprojectrehabilitationcertification",
				"value": "Part 3 of the small project rehabilitation certifi cation application approved"
			},
			{
				"key": "AffordableHousingCertificate",
				"value": "Affordable Housing Certificate"
			}
		]
	},
	{
		"docName": "dME1041Sch1",
		"line": [
			{
				"key": "NetOperatingLossAdjustmentSchedule",
				"value": "Net Operating Loss Adjustment Schedule"
			}
		]
	},
	{
		"docName": "dNE3800N",
		"line": [
			{
				"key": "NebraskaAdvantageActcredit",
				"value": "Nebraska Advantage Act credit"
			},
			{
				"key": "NebraskaAdvantageRuralDevelopment",
				"value": "Nebraska Advantage Rural Development Act distributed credit received"
			},
			{
				"key": "NewMarketsTaxCredit",
				"value": "New Markets Tax Credit (NMTC)"
			},
			{
				"key": "NebraskaHistoricTaxCredit",
				"value": "Nebraska Historic Tax Credit (NHTC)"
			},
			{
				"key": "NebraskaAdvantageRuralDevelopmentActcredit",
				"value": "Nebraska Advantage Rural Development Act credit"
			}
		]
	},
	{
		"docName": "dNE1120N",
		"line": [
			{
				"key": "Separatereportbyamember",
				"value": "Separate report by a member of a controlled group of corporations"
			},
			{
				"key": "Alternatemethod",
				"value": "Alternate method"
			},
			{
				"key": "Premiumtaxcredit",
				"value": "Premium tax credit"
			}
		]
	},
	{
		"docName": "dNE1120SchA",
		"line": [
			{
				"key": "Allocablenonapportionableincome",
				"value": "Allocable, nonapportionable income"
			},
			{
				"key": "Otherdecreasingadjustments",
				"value": "Other decreasing adjustments"
			}
		]
	},
	{
		"docName": "dSchNEK1N1065",
		"line": [
			{
				"key": "CommunityDevelopmentAssistanceActcredit",
				"value": "Community Development Assistance Act credit"
			},
			{
				"key": "EmploymentandInvestmentGrowthAct",
				"value": "Employment and Investment Growth Act"
			},
			{
				"key": "NebraskaAdvantageRuralDevelopmentAct",
				"value": "Nebraska Advantage Rural Development Act"
			},
			{
				"key": "ResearchandDevelopmentAct",
				"value": "Nebraska Advantage Research and Development Act"
			},
			{
				"key": "NewMarketsTaxCredit",
				"value": "New Markets Tax Credit"
			},
			{
				"key": "NebraskaHistoricTaxCredit",
				"value": "Nebraska Historic Tax Credit"
			}
		]
	},
	{
		"docName": "dSchNEK-199N1065",
		"line": [
			{
				"key": "NebraskaAdvantageAct",
				"value": "Nebraska Advantage Act"
			}
		]
	},
	{
		"docName": "dNE775N",
		"line": [
			{
				"key": "attachexplanation1",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation2",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation3",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation4",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation5",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation6",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation7",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation8",
				"value": "Corrected (If corrected, attach explanation)"
			},
			{
				"key": "attachexplanation9",
				"value": "Corrected (If corrected, attach explanation)"
			}
		]
	},
	{
		"docName": "dNE940N",
		"line": [
			{
				"key": "BeginningFarmercredit",
				"value": "Beginning Farmer credit"
			}
		]
	},
	{
		"docName": "dID49",
		"line": [
			{
				"key": "Creditreceivedthroughunitarysharing",
				"value": "Credit received through unitary sharing."
			}
		]
	},
	{
		"docName": "dID43",
		"line": [
			{
				"key": "TaxReimbursementIncentiveActcredit",
				"value": "Tax Reimbursement Incentive Act credit."
			}
		]
	},
	{
		"docName": "dID67",
		"line": [
			{
				"key": "CreditforcontributionstoIdahoyouth",
				"value": "Credit for contributions to Idaho youth and rehabilitation facilities"
			},
			{
				"key": "Creditforproductionequipment",
				"value": "Credit for production equipment using postconsumer waste"
			},
			{
				"key": "Promotersponsoredeventcredit",
				"value": "Promoter sponsored event credit"
			}
		]
	},
	{
		"docName": "dID68",
		"line": [
			{
				"key": "IdahoPUC",
				"value": "Idaho PUC"
			}
		]
	},
	{
		"docName": "dID85",
		"line": [
			{
				"key": "Creditreceivedthroughunitarysharing",
				"value": "Credit received through unitary sharing."
			}
		]
	},
	{
		"docName": "dID84",
		"line": [
			{
				"key": "CreditforcontributionstoIdahoyouth",
				"value": "Credit for contributions to Idaho youth and rehabilitation facilities"
			},
			{
				"key": "Creditforproductionequipment",
				"value": "Credit for production equipment using postconsumer waste"
			},
			{
				"key": "Promotersponsoredeventcredit",
				"value": "Promoter sponsored event credit"
			}
		]
	},
	{
		"docName": "dID42",
		"line": [
			{
				"key": "OtherAdditions",
				"value": "Other additions."
			}
		]
	},
	{
		"docName": "dRISchWTbl",
		"line": [
			{
				"key": "RITaxwithholding",
				"value": "Form RI 1099PT"
			}
		]
	},
	{
		"docName": "dSchRIII",
		"line": [
			{
				"key": "CreditforTaxestoOtherthanRI",
				"value": "Credit for Taxes paid to another State"
			},
			{
				"key": "CreditforTaxestomorethanoneState",
				"value": "Credit for Taxes paid to more than one State"
			}
		]
	},
	{
		"docName": "dSchRICR",
		"line": [
			{
				"key": "HistoricHomeOwenerAssistanceActRI",
				"value": "Historic Homeowner Assistance Act"
			},
			{
				"key": "TaxCreditforContrivutionstoScholarshipOrganizations",
				"value": "Tax Credit for Contributions to Scholarship Organizations"
			},
			{
				"key": "HistoricStructuresTaxCreditRI",
				"value": "Historic Structure Tax Credit"
			},
			{
				"key": "RINewQualifiedJobsIncentiveAct",
				"value": "Rhode Island New Qualified Jobs Incentive Act"
			},
			{
				"key": "RebuildRhodeIslandTaxCredit",
				"value": "Rebuild Rhode Island Tax Credit"
			},
			{
				"key": "MotionPictureProductionTaxCreditRI",
				"value": "Motion Picture Production Tax Credit"
			},
			{
				"key": "StayInvestedinRIWavemakerFellowship",
				"value": "Stay Invested in RI Wavemaker Fellowship"
			},
			{
				"key": "RecaptyureCreditOneRI",
				"value": "Recapture Credit 1"
			},
			{
				"key": "RecaptureCreditTwoRI",
				"value": "Recapture Credit 2"
			}
		]
	},
	{
		"docName": "dRI1040MU",
		"line": [
			{
				"key": "RiTaxPaidtoOtherStateOne",
				"value": "Tax paid to other State 1"
			},
			{
				"key": "RiTaxPaidtoOtherStateTwo",
				"value": "Tax paid to other State 2"
			},
			{
				"key": "RiTaxPaidtoOtherStateThree",
				"value": "Tax paid to other State 3"
			},
			{
				"key": "RiTaxPaidtoOtherStateFour",
				"value": "Tax paid to other State 4"
			}
		]
	},
	{
		"docName": "dRI6238",
		"line": [
			{
				"key": "Crforamountpaidfordwellingone",
				"value": "Credit for dwelling unit 1"
			},
			{
				"key": "Crforamountpaidfordwellingtwo",
				"value": "Credit for dwelling unit 2"
			},
			{
				"key": "Crforamountpaidfordwellingthree",
				"value": "Credit for dwelling unit 3"
			}
		]
	},
	{
		"docName": "dRISchCRPT",
		"line": [
			{
				"key": "RI TaxCretforContoSchpOrgan",
				"value": "Tax Credits for Contributions to Scholarship Organizations RI-2276"
			},
			{
				"key": "HistoricStruRITaxCredit",
				"value": "Historic Structures - Tax Credit RI-286B"
			},
			{
				"key": "RINewQuaJobsIncentiveAct",
				"value": "Rhode Island New Qualified Jobs Incentive Act 2015 RI-6754"
			},
			{
				"key": "RIRebuiRITaxCr",
				"value": "Rebuild Rhode Island Tax Credit RI-7253"
			},
			{
				"key": "MotPicProCre",
				"value": "Motion Picture Production Tax Credits RI-8201 and Musical and Theatrical Production Tax\nCredits"
			},
			{
				"key": "RecapRICret1",
				"value": "Recapture Credit 1"
			},
			{
				"key": "RecapRICret2",
				"value": "Recapture Credit 2"
			}
		]
	},
	{
		"docName": "dRI1120S",
		"line": [
			{
				"key": "TaxIncentiveRIModification",
				"value": "Modification for Tax Incentive for employers"
			}
		]
	},
	{
		"docName": "dRI2441",
		"line": [
			{
				"key": "ChildDayCareDocumentation",
				"value": "Documentation for Child Day Care Assistance"
			},
			{
				"key": "CreditCarriedForwardFromPriorYears",
				"value": "Credit Carried Forward from Prior Years"
			}
		]
	},
	{
		"docName": "dRI2949",
		"line": [
			{
				"key": "CopyfromHRIC",
				"value": "Schedule For Line2 Other Expenses"
			},
			{
				"key": "Copyofcreditfromprioryear",
				"value": "Credit Carry over from prior year"
			}
		]
	},
	{
		"docName": "dRI1120C",
		"line": [
			{
				"key": "CopyofResearchandDevelopmentAdj",
				"value": "Research and Development adjustments"
			},
			{
				"key": "CopyofPassthroughWithholdings",
				"value": "RI Passthrough Withholding"
			},
			{
				"key": "Schedulefornetoperatingloss",
				"value": "Net Operating Loss Schedule"
			},
			{
				"key": "TaxIncentiveforsmallbusiness",
				"value": "Form RI 107 – Modification for Tax Incentive for employers"
			},
			{
				"key": "Dividendreceivedfromothercompany",
				"value": "Dividend received from shares of Stock"
			},
			{
				"key": "Interestonothercertainobligations",
				"value": "Interest on certain obligations"
			},
			{
				"key": "incomeandotherobligations",
				"value": "Interest on Obligations of US Possessions and  other Interests"
			}
		]
	},
	{
		"docName": "dSchWVF",
		"line": [
			{
				"key": "Administratororexecutor",
				"value": "court certificate showing your appointment"
			},
			{
				"key": "laimantfortheestateofthedecedent,otherthanabove",
				"value": "death certificate or proof of death."
			}
		]
	},
	{
		"docName": "dSchWVRBIC",
		"line": [
			{
				"key": "NationalParksServicecertificate",
				"value": "National Parks Service certificate"
			}
		]
	},
	{
		"docName": "dWVIT210",
		"line": [
			{
				"key": "writtenrequest",
				"value": "written request"
			}
		]
	},
	{
		"docName": "dWv100SchB",
		"line": [
			{
				"key": "Interestordividendincome",
				"value": "Interest or dividend income"
			},
			{
				"key": "OtherAmountIncreasing",
				"value": "Other Amount"
			},
			{
				"key": "OtherAmountDecreasing",
				"value": "Other Amount"
			}
		]
	},
	{
		"docName": "dWV120SchB",
		"line": [
			{
				"key": "supportingdocumentation",
				"value": "supporting documentation"
			}
		]
	},
	{
		"docName": "dDE300Sch1",
		"line": [
			{
				"key": "IncomeApportioned1",
				"value": "Income Apportioned"
			}
		]
	},
	{
		"docName": "dDE300Sch2",
		"line": [
			{
				"key": "SectionCLine10ColumnA",
				"value": "Gross income from other sources Within DE"
			},
			{
				"key": "SectionCLine10ColumnB",
				"value": "Gross income from other sources Without DE"
			}
		]
	},
	{
		"docName": "dDE1100S",
		"line": [
			{
				"key": "OtherPaymentsExplanation",
				"value": "Other Payments Explanation"
			}
		]
	},
	{
		"docName": "dDE1100Sch2",
		"line": [
			{
				"key": "InterestincomeWiDelaware1",
				"value": "Interest income Without Delaware"
			},
			{
				"key": "Line7Column1",
				"value": "Applicable expenses Documentatrion Within DE"
			},
			{
				"key": "Line7Column2",
				"value": "Applicable expenses Documentatrion Without DE"
			}
		]
	},
	{
		"docName": "dDE1100Sch3",
		"line": [
			{
				"key": "Schedule3CLine2ColumnA",
				"value": "Gross income from other sources Within DE"
			},
			{
				"key": "Schedule3CLine 2ColumnB",
				"value": "Gross income from other sources Without DE"
			}
		]
	},
	{
		"docName": "dDE1100",
		"line": [
			{
				"key": "OtherPaymentsExplanation2",
				"value": "Other Payments Explanation"
			}
		]
	},
	{
		"docName": "dDE400",
		"line": [
			{
				"key": "otherstatereturn3",
				"value": "OTHER STATE RETURN"
			},
			{
				"key": "OtherPaymentsExplanation3",
				"value": "Other Payments Explanation"
			}
		]
	},
	{
		"docName": "dDE700",
		"line": [
			{
				"key": "Currentyearapprovedcredit",
				"value": "Current year approved credit Form 1100CR"
			},
			{
				"key": "ResearchandDevelopmentCredit",
				"value": "Research and Development Credit Revenue approval letter"
			},
			{
				"key": "LandandHistoricResourceTaxCredit",
				"value": "Land and Historic Resource Tax Credit Revenue approval letter"
			}
		]
	},
	{
		"docName": "dDE20001",
		"line": [
			{
				"key": "ScorporationPaymentsA",
				"value": "1100S Schedule A1 Col A"
			},
			{
				"key": "ScorporationPaymentsB",
				"value": "1100S Schedule A1 Col B"
			},
			{
				"key": "DivisionofRevenueapprovalletterA",
				"value": "Form 1801AC or Form 2001AC and the Division of Revenue approval letter A"
			},
			{
				"key": "DivisionofRevenueapprovalletterB",
				"value": "Form 1801AC or Form 2001AC and the Division of Revenue approval letter B"
			}
		]
	},
	{
		"docName": "dDE20002",
		"line": [
			{
				"key": "DivisionofRevenueapprovalletterA1",
				"value": "Form 1801AC or Form 2001AC and the Division of Revenue approval letter"
			},
			{
				"key": "ScorporationPaymentsA1",
				"value": "1100S Schedule A1"
			}
		]
	},
	{
		"docName": "dFormIA1040OtherAdjustmentStmt",
		"line": [
			{
				"key": "Domesticproductionactivitiesdeduction",
				"value": "i - Domestic production activities deduction"
			},
			{
				"key": "Netoperatingloss",
				"value": "u - Net operating loss, Iowa"
			}
		]
	},
	{
		"docName": "dIA2848",
		"line": [
			{
				"key": "RetentionOrRevocation",
				"value": "Retention / Revocation of prior Power(s) of Attorney."
			}
		]
	},
	{
		"docName": "dIA128",
		"line": [
			{
				"key": "",
				"value": "Supplemental Research Activities Tax Credit."
			}
		]
	},
	{
		"docName": "dIA128S",
		"line": [
			{
				"key": "",
				"value": "Supplemental Research Activities Tax Credit."
			}
		]
	},
	{
		"docName": "dIA133",
		"line": [
			{
				"key": "",
				"value": "Base employment level at the location with the 260E agreement"
			}
		]
	},
	{
		"docName": "dClaimed21",
		"line": [
			{
				"key": "Refundablecredits",
				"value": "Refundable Credits"
			}
		]
	},
	{
		"docName": "dClaimed1",
		"line": [
			{
				"key": "NonrefundableTaxCredits",
				"value": "Nonrefundable Tax Credits"
			}
		]
	},
	{
		"docName": "dIA1120",
		"line": [
			{
				"key": "",
				"value": "Other Payments"
			}
		]
	},
	{
		"docName": "dNH1065",
		"line": [
			{
				"key": "Separateentity",
				"value": "Separate entity items of income or expense"
			},
			{
				"key": "Adjustmentstogrossbusinessprofits",
				"value": "Adjustments to gross business profits"
			},
			{
				"key": "Basisincreaseassociated",
				"value": "Basis increase associated"
			},
			{
				"key": "ScheduleofTaxes",
				"value": "Schedule of Taxes"
			},
			{
				"key": "ResearchContributionComputation",
				"value": "Research Contribution Computation"
			}
		]
	},
	{
		"docName": "dNH1120",
		"line": [
			{
				"key": "Separateentity1",
				"value": "Separate entity items of income or expense"
			},
			{
				"key": "Basisincreaseassociated1",
				"value": "Basis increase associated"
			},
			{
				"key": "ScheduleofTaxes2",
				"value": "Schedule of Taxes"
			},
			{
				"key": "ResearchContributionComputation2",
				"value": "Research Contribution Computation"
			}
		]
	},
	{
		"docName": "dNH1041",
		"line": [
			{
				"key": "Separateentity2",
				"value": "Separate entity items of income or expense"
			},
			{
				"key": "Line6hASchedule1",
				"value": "Line 6h A Schedule"
			},
			{
				"key": "Line6hBSchedule",
				"value": "Line 6h B Schedule"
			},
			{
				"key": "ScheduleofTaxes1",
				"value": "Schedule of Taxes"
			},
			{
				"key": "ResearchContributionComputation1",
				"value": "Research Contribution Computation"
			}
		]
	},
	{
		"docName": "dNH1040",
		"line": [
			{
				"key": "Separateentity3",
				"value": "Separate entity items of income or expense"
			},
			{
				"key": "Line6iASchedule",
				"value": "Line 6i A Schedule"
			},
			{
				"key": "Line6iBSchedule",
				"value": "Line 6i B Schedule"
			},
			{
				"key": "ScheduleofTaxes3",
				"value": "Schedule of Taxes"
			},
			{
				"key": "ResearchContributionComputation3",
				"value": "Research Contribution Computation"
			}
		]
	},
	{
		"docName": "dMT2",
		"line": [
			{
				"key": "Farmandranchrisk",
				"value": "Farm and ranch risk management account deposits."
			},
			{
				"key": "Farmandranchrisk1",
				"value": "Farm and ranch risk management account deposits."
			},
			{
				"key": "Gainoneligiblesaleofmobilehomepark1",
				"value": "Gain on eligible sale of mobile home park. Include Form MHPE"
			},
			{
				"key": "Gainoneligiblesaleofmobilehomepark2",
				"value": "Gain on eligible sale of mobile home park. Include Form MHPE"
			},
			{
				"key": "HealthinsuranceforuninsuredMontananscredit1",
				"value": "Health insurance for uninsured Montanans credit. Include Form HI"
			},
			{
				"key": "HealthinsuranceforuninsuredMontananscredit2",
				"value": "Health insurance for uninsured Montanans credit. Include Form HI"
			},
			{
				"key": "AlternativetaxmethodNonresident1",
				"value": "Alternative tax method for certain nonresidents."
			},
			{
				"key": "AlternativetaxmethodNonresident2",
				"value": "Alternative tax method for certain nonresidents."
			},
			{
				"key": "Biodieselblendingandstoragecredit1",
				"value": "Biodiesel blending and storage credit."
			},
			{
				"key": "Biodieselblendingandstoragecredit2",
				"value": "Biodiesel blending and storage credit."
			},
			{
				"key": "Mineralandcoalexplorationincentivecredit1",
				"value": "Mineral and coal exploration incentive credit. Include Form MINE-CRED"
			},
			{
				"key": "Mineralandcoalexplorationincentivecredit2",
				"value": "Mineral and coal exploration incentive credit. Include Form MINE-CRED"
			},
			{
				"key": "Emergencylodgingcredit1",
				"value": "Emergency lodging credit. Include Form ELC"
			},
			{
				"key": "Emergencylodgingcredit2",
				"value": "Emergency lodging credit. Include Form ELC"
			}
		]
	},
	{
		"docName": "dMTCLT4",
		"line": [
			{
				"key": "LimitedCombination",
				"value": "Limited Combination (Attach statement)"
			},
			{
				"key": "Montananetoperatingloss",
				"value": "Enter your Montana net operating loss carried over to this period"
			},
			{
				"key": "incomeallocateddirectlytoMontana",
				"value": "Enter the income that you allocated directly to Montana"
			},
			{
				"key": "SeparateAccounting",
				"value": "Separate Accounting"
			},
			{
				"key": "FederalRevenueAgentReport",
				"value": "Federal Revenue Agent Report; include a complete copy of this report"
			},
			{
				"key": "Nonapportionableincome",
				"value": "Non apportionable income (include a detailed breakdown)"
			}
		]
	},
	{
		"docName": "dMTCLT4SchC",
		"line": [
			{
				"key": "ContractorsGrossReceiptsTaxCredit",
				"value": "Contractor's Gross Receipts Tax Credit (include supporting schedule)"
			}
		]
	},
	{
		"docName": "dMTCLT4S",
		"line": [
			{
				"key": "ForeignScorporationsdateCertificate",
				"value": "Foreign S corporations: date S corporation obtained certificate of authority"
			}
		]
	},
	{
		"docName": "dMTCLT4SSchII",
		"line": [
			{
				"key": "InnovativeEducationalProgramCredit",
				"value": "Innovative Educational Program Credit."
			},
			{
				"key": "StudentScholarshipOrganizationCredit",
				"value": "Student Scholarship Organization Credit"
			},
			{
				"key": "UnlockingPublicLandsCredit",
				"value": "Unlocking Public Lands Credit"
			},
			{
				"key": "ApprenticeshipTaxcredit",
				"value": "Apprenticeship Tax credit"
			}
		]
	},
	{
		"docName": "dDCD30Schedules",
		"line": [
			{
				"key": "BeginingorCloseingInventoryisDifferent",
				"value": "Attach an explanation if begining inventory is different than closeing inventory"
			}
		]
	},
	{
		"docName": "dDCSchI",
		"line": [
			{
				"key": "OtherlineDescription",
				"value": "Line 7 Other description to federal Income"
			},
			{
				"key": "DisabilityIncome",
				"value": "Line 2 Disability income exclusion from DC Form D-2440"
			},
			{
				"key": "DCDisabilityLawyerLoan",
				"value": "Line 12 DC Poverty Lawyer Loan Assistance"
			}
		]
	},
	{
		"docName": "dDCAFVCredit",
		"line": [
			{
				"key": "Existingvehiclerepairing",
				"value": "A Paid Invoice, receipts or equivalent proof for modifying the existing gasoline or diesel fuel vehicle"
			},
			{
				"key": "NewInstallationvehiclerepairing",
				"value": "A Paid Invoice, receipts or equivalent proof for modifying the Purchase or Installation of  gasoline or diesel fuel vehicle"
			},
			{
				"key": "ElectricPermit",
				"value": "A Electrical Permit"
			}
		]
	},
	{
		"docName": "dVTBI473",
		"line": [
			{
				"key": "Vermontnetoperatinglossdeductionapplied",
				"value": "Vermont net operating loss deduction applied"
			}
		]
	},
	{
		"docName": "dVTFI161",
		"line": [
			{
				"key": "VTRealEstateWithholding",
				"value": "VT Real Estate Withholding"
			}
		]
	},
	{
		"docName": "dVTBI476",
		"line": [
			{
				"key": "Vermontminimumentitytax",
				"value": "Vermont minimum entity tax"
			}
		]
	},
	{
		"docName": "dND58SchK",
		"line": [
			{
				"key": "ParticipatingAngelInvestor",
				"value": "Participating Angel Investor Statement"
			},
			{
				"key": "PropertyTaxClearanceRecord1",
				"value": "Property Tax Clearance Record"
			},
			{
				"key": "InterestfromUSobligations",
				"value": "Interest from U.S. obligations Documentation"
			},
			{
				"key": "Calculationoftheexemptincome",
				"value": "Calculation of the exempt income"
			},
			{
				"key": "Line6Documentation",
				"value": "Gain from eminent domain sale"
			},
			{
				"key": "Line8Documentation",
				"value": "Seed capital investment tax credit"
			},
			{
				"key": "Line9Documentation",
				"value": "Agricultural commodity Credit Documentation"
			},
			{
				"key": "Line10Documentation",
				"value": "fuel blending tax credit"
			},
			{
				"key": "Line11Documentation",
				"value": "fuel sales equipment tax credit"
			},
			{
				"key": "Line12aDocumentation",
				"value": "Geothermal energy device tax credit"
			},
			{
				"key": "Line12bDocumentation",
				"value": "Biomass solar or wind energy device tax credit"
			},
			{
				"key": "Line13aDocumentation",
				"value": "Employer internship program tax credit"
			},
			{
				"key": "Line14Documentation",
				"value": "Research expense tax credit"
			},
			{
				"key": "ScheduleQEC",
				"value": "Schedule QEC"
			},
			{
				"key": "NDScheduleK1",
				"value": "ND Schedule K1"
			},
			{
				"key": "Line16Documentation",
				"value": "Workforce recruitment tax credit"
			},
			{
				"key": "ScheduleME",
				"value": "Schedule ME"
			},
			{
				"key": "Line18Documentation",
				"value": "Nonprofit private primary school tax credit"
			},
			{
				"key": "Line19Documentation",
				"value": "Nonprofit private high school tax credit"
			},
			{
				"key": "Line20Documentation",
				"value": "Nonprofit private college tax credit"
			},
			{
				"key": "OtherStateReturn5",
				"value": "Other State Income Tax Return"
			}
		]
	},
	{
		"docName": "dSchND1065SchK1",
		"line": [
			{
				"key": "Angelinvestorcredit",
				"value": "Angel investor credit Documentation"
			},
			{
				"key": "ScheduleQEC15a",
				"value": "Schedule QEC 15a"
			},
			{
				"key": "ScheduleQEC15b",
				"value": "Schedule QEC 15b"
			},
			{
				"key": "NDScheduleK115c",
				"value": "ND Schedule K-1 15c"
			},
			{
				"key": "NDScheduleK115d",
				"value": "ND Schedule K-1 15d"
			},
			{
				"key": "Seedcapitalinvestment",
				"value": "Seed capital investment tax credit Documentation"
			},
			{
				"key": "Agriculturalcommodity",
				"value": "Agricultural commodity Credit Documentation"
			}
		]
	},
	{
		"docName": "dND58",
		"line": [
			{
				"key": "LineJStatement",
				"value": "Line J Statement"
			}
		]
	},
	{
		"docName": "dND60SchK",
		"line": [
			{
				"key": "ParticipatingAngelInvestor1",
				"value": "Participating Angel Investor Statement"
			},
			{
				"key": "InterestfromUSobligations1",
				"value": "Interest from U.S. obligations Documentation"
			},
			{
				"key": "PropertyTaxClearanceRecord",
				"value": "Property Tax Clearance Record"
			},
			{
				"key": "Line3Documentation1",
				"value": "New or expanding business income exemption3"
			},
			{
				"key": "Line5Documentation1",
				"value": "Seed capital investment tax credit"
			},
			{
				"key": "Line6Documentation1",
				"value": "Agricultural commodity processing facility investment tax credit"
			},
			{
				"key": "Line7Documentation1",
				"value": "Biodiesel or green diesel fuel blending tax credit7"
			},
			{
				"key": "Line8Documentation1",
				"value": "Biodiesel or green diesel fuel sales equipment tax credit"
			},
			{
				"key": "Line9Documentation1",
				"value": "Geothermal energy device tax credit"
			},
			{
				"key": "Line11Documentation1",
				"value": "Research expense tax credit"
			},
			{
				"key": "ScheduleQEC12a1",
				"value": "Schedule QEC 12a"
			},
			{
				"key": "ScheduleQEC12b1",
				"value": "Schedule QEC 12b"
			},
			{
				"key": "ScheduleME1",
				"value": "Schedule ME"
			},
			{
				"key": "OtherStateReturn6",
				"value": "Other State Income Tax Return"
			}
		]
	},
	{
		"docName": "dSchND1120SSchK1",
		"line": [
			{
				"key": "Seedcapitalinvestment1",
				"value": "Seed capital investment tax credit Documentation"
			},
			{
				"key": "Agriculturalcommodity1",
				"value": "Agricultural commodity Credit Documentation"
			},
			{
				"key": "ScheduleQEC12a",
				"value": "Schedule QEC 12a"
			},
			{
				"key": "ScheduleQEC12b",
				"value": "Schedule QEC 12b"
			},
			{
				"key": "NDScheduleK112c",
				"value": "ND Schedule K-1 12c"
			},
			{
				"key": "NDScheduleK112d",
				"value": "ND Schedule K-1 12d"
			},
			{
				"key": "Angelinvestorcredit1",
				"value": "Angel investor credit Documentation"
			}
		]
	},
	{
		"docName": "dND38",
		"line": [
			{
				"key": "Part1Line2Documentation",
				"value": "Additions Forms"
			},
			{
				"key": "InterestfromUSobligations2",
				"value": "Interest from U.S. obligations Documentation"
			},
			{
				"key": "Othersubtractions5",
				"value": "Other Subtrctions Forms"
			},
			{
				"key": "OtherStateReturn7",
				"value": "Other State Return"
			}
		]
	},
	{
		"docName": "dND1041SchK1",
		"line": [
			{
				"key": "ScheduleQEC15a2",
				"value": "Schedule QEC 15a"
			},
			{
				"key": "ScheduleQEC15b2",
				"value": "Schedule QEC 15b"
			},
			{
				"key": "NDScheduleK115c2",
				"value": "ND Schedule K-1 15c"
			},
			{
				"key": "NDScheduleK115d2",
				"value": "ND Schedule K-1 15d"
			}
		]
	},
	{
		"docName": "dND1",
		"line": [
			{
				"key": "NationalGuardOrReservemember",
				"value": "National Guard Or Reserve member"
			}
		]
	},
	{
		"docName": "dNDSchRZ",
		"line": [
			{
				"key": "Otherassets1",
				"value": "Other assets"
			},
			{
				"key": "Otherassets2",
				"value": "Other assets"
			},
			{
				"key": "Exemptionperiodstartdate",
				"value": "Exemption period start date"
			},
			{
				"key": "ProjectNumberPart2",
				"value": "Project number assigned by the local zone authority"
			},
			{
				"key": "ProjectNumberPart3",
				"value": "Project number assigned by the local zone authority"
			},
			{
				"key": "ProjectNumberPart4",
				"value": "Project number assigned by the local zone authority"
			},
			{
				"key": "Creditfor2017taxyearPart4",
				"value": "Credit for 2017 tax year"
			},
			{
				"key": "Carryforwardto2018taxyearPart4",
				"value": "Carryforward to 2018 tax year"
			},
			{
				"key": "AmountinvestedintheRFO",
				"value": "Amount invested in the RFO"
			},
			{
				"key": "Creditfor2017taxyearPart5",
				"value": "Credit for 2017 tax year"
			},
			{
				"key": "Carryforwardto2018taxyearPart5",
				"value": "Carryforward to 2018 tax year"
			},
			{
				"key": "ProjectNumberPart6",
				"value": "Project number assigned by the local zone authority"
			},
			{
				"key": "Creditfor2017taxyearPart6",
				"value": "Credit for 2017 tax year"
			},
			{
				"key": "Carryforwardto2018taxyearPart6",
				"value": "Carryforward to 2018 tax year"
			}
		]
	},
	{
		"docName": "dNDSchWE",
		"line": [
			{
				"key": "Reversalofintercompanyeliminations",
				"value": "Reversal of intercompany eliminations"
			},
			{
				"key": "Intercompanyeliminationsforwaters",
				"value": "Intercompany eliminations for waters edge group corporations"
			},
			{
				"key": "Totalforeigndividends",
				"value": "Total foreign dividends"
			},
			{
				"key": "Taxableincomeorloss80or20Corps",
				"value": "Taxable income or loss included on lines 1 or 2 from 80/20 corps"
			},
			{
				"key": "Totalnetbookincome80or20Corps",
				"value": "Total net book income of 80/20 corporations"
			}
		]
	},
	{
		"docName": "dHIN30SchO",
		"line": [
			{
				"key": "NotForHITaxPurpose",
				"value": "Line 3 Deduction allowable for Federal purpose but not for HI Tax Purpose"
			},
			{
				"key": "Interestfromnonunitar",
				"value": "Interest from nonunitary business"
			},
			{
				"key": "Royaltiesformnonunitar",
				"value": "Royalties from nonunitary business assets"
			},
			{
				"key": "Netgainfromnonunitrar",
				"value": "Net gain from nonunitary business assets"
			},
			{
				"key": "NetLossfromnonunitrary",
				"value": "Net loss from nonunitary business assets"
			},
			{
				"key": "DividendInclude",
				"value": "Dividend Included on line 12"
			},
			{
				"key": "AllOtherIncomefromIntangibles",
				"value": "All other income from intangibles"
			},
			{
				"key": "NetOperatingLossAdjust",
				"value": "Net Operating Loss Adjustment"
			}
		]
	},
	{
		"docName": "dHIN312",
		"line": [
			{
				"key": "QualifiedPropertyDetermination",
				"value": "Explanation as how the qualifying basis was determined and identify the property involved"
			}
		]
	}
]//end binary attachment config

      $scope.invalidType = false;//required to show error message that file not supported
      var pdfMimeType = 'application/pdf,application/x-pdf,application/acrobat,applications/vnd.pdf,text/pdf,text/x-pdf,';
      var jpegMimeType = 'image/jpeg,image/jpg,image/jp_,application/jpg,application/x-jpg,image/pjpeg,image/pipeg,image/vnd.swiftview-jpeg,image/x-xbitmap,image/jpe_,image/png,application/png,application/x-png,';
      var docMiMeType = 'application/msword,application/doc,appl/text,application/vnd.msword,application/vnd.ms-word,application/winword,application/word,application/x-msw6,application/x-msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/x-vnd.oasis.opendocument.text,application/kswps,';
      var exelMimeType = 'application/vnd.ms-excel,application/msexcel,application/x-msexcel,application/x-ms-excel,application/vnd.ms-excel,application/x-excel,application/x-dos_ms_excel,application/xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/kset,';
      var tiffMimeType = 'image/tif,image/x-tif,image/tiff,image/x-tiff,application/tif,application/x-tif,application/tiff,application/x-tiff,';
      var textType = 'text/plain,application/txt,browser/internal,text/anytext,widetext/plain,widetext/paragraph';
      var documentDocName = '';//to store docname
      $scope.acceptFileType = pdfMimeType + jpegMimeType + docMiMeType + exelMimeType + tiffMimeType + textType;
      $scope.fileSizeMessage = false;//is file is maximum then 5 mb
      $scope.maxDocumentSizeMessage = false;//is current location maximum document size is exid
      $scope.uploadErrMessage = false;//is any error occured on upload
      $scope.remainingSpace = 0;//to hold remaining space per location
      $scope.uploadProgress = 0;//declare varible to show upload progress
      $scope.documentReturnId = '';    //to store return id
      $scope.docIndex = '';//to store doc index
      $scope.activeTab = {}; //to hold active tab
      //initially show form tab
      $scope.activeTab.formTab = true;
      $scope.activeTab.returnTab = false;
      $scope.documentList = [];//to hold document list
      $scope.lineList = [];//to hold line list
      $scope.lineNo = '';//to hold number which user is selected
      $scope.description = '';//to hold description
      var filesOnHold;//to hold uploaded file
      $scope.fileName = '';//to hold uplodaed file name
      var type = '';//to hold type of document
      var userDetails = userService.getUserDetails();   //Get details of logged in user
      $scope.email = userDetails.email; //current user email id require to show username in document
      $scope.maxStorageSize = '';//to hold maximum document siz
      $scope.documentsSize = '';
      $scope.availableDocumentSize = '';
      $scope.availableMaxStorageSize = '';

      //Temporary function to differentiate features as per environment (beta/live)
      $scope.betaOnly = function () {
        if (environment.mode == 'beta' || environment.mode == 'local')
          return true;
        else
          return false;
      };

      var _updateDocumentSize = function (documentsSize) {
        $scope.documentsSize = documentsSize;
        if ($scope.documentsSize === 0)
          $scope.availableDocumentSize = '0';
        else {
          if ($scope.documentsSize >= 1024) {
            $scope.availableDocumentSize = ($scope.documentsSize / 1024).toFixed(2);
          }
          else
            $scope.availableDocumentSize = $scope.documentsSize.toFixed(2);
        }
        if ($scope.maxStorageSize === 0)
          $scope.availableMaxStorageSize = '0';
        else {
          if ($scope.maxStorageSize >= 1024)
            $scope.availableMaxStorageSize = ($scope.maxStorageSize / 1024).toFixed(2);
          else
            $scope.availableMaxStorageSize = $scope.maxStorageSize;
        }
        if ($scope.maxStorageSize >= 1024 && $scope.documentsSize < 1024 && $scope.documentsSize > 0) {
          $scope.availableMaxStorageSize = $scope.availableMaxStorageSize + ' GB';
          $scope.availableDocumentSize = $scope.availableDocumentSize + ' MB';
        } else if ($scope.maxStorageSize >= 1024 && $scope.documentsSize === 0) {
          $scope.availableMaxStorageSize = $scope.availableMaxStorageSize + ' GB';
        } else {
          if ($scope.maxStorageSize >= 1024)
            $scope.availableMaxStorageSize = $scope.availableMaxStorageSize + ' GB';
          else
            $scope.availableMaxStorageSize = $scope.availableMaxStorageSize + ' MB';
        }
      };
      //get master location details
      if (!_.isUndefined(userDetails.locations) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId])) {
        if (!_.isUndefined(userDetails.locations[userDetails.masterLocationId].maxStorageSize) && !_.isUndefined(userDetails.locations[userDetails.masterLocationId].documentsSize)) {
          $scope.maxStorageSize = userService.getLicenseValue('totalStorage');
          $scope.documentsSize = userDetails.locations[userDetails.masterLocationId].documentsSize;
          _updateDocumentSize($scope.documentsSize);
        }
      }

      //variable iniliazation End

      //this function is used to check user have privillages or not
      $scope.userCan = function (privilege) {
        return userService.can(privilege);
        //return true;
      };

      //creating url for open document request
      $scope.getURL = function (key) {
        if ($scope.userCan('CAN_DOWNLOAD_DOCUMENT'))
          return dataAPI.base_url + '/documentmanager/download?key=' + key + '&locationId=' + userDetails.currentLocationId;
        else
          return "_blank";
      };

      //method to get document list
      var _getDocumentList = function () {
        if ($scope.userCan('CAN_LIST_DOCUMENT')) {
          documentsService.getDocumentList().then(function (success) {
            $scope.thirdRefreshStart = false;
            $scope.documentList = success;
          }, function (error) {
            $scope.thirdRefreshStart = false;
            $log.error(error);
          });
        }
      };

      //to convert date in current format
      $scope.toDate = function (dateStr) {
        return new Date(dateStr);
      };

      //manually refresh call
      $scope.manuallyRefreshDocument = function () {
        _getDocumentList();
      };

      /**
       * used to diaply accepted file to user
       */
      $scope.openAcceptedFileDialog = function () {
        var dialog = dialogService.openDialog("custom", { 'keyboard': false, 'backdrop': false, 'size': 'lg' },
          "taxAppJs/common/partials/acceptedFileTypes.html", "acceptedFileTypesDialogController",{'pdfMimeType':pdfMimeType,'jpegMimeType':jpegMimeType,'docMiMeType':docMiMeType,'exelMimeType':exelMimeType,'tiffMimeType':tiffMimeType,'textType':textType});
      }

      //method to remove document
      $scope.removeDocument = function (key) {
        if ($scope.userCan('CAN_REMOVE_DOCUMENT')) {
          //method require to call translate text as locale
          localeService.translate("Do you want to delete this document ?", 'DOCUMENT_DELETECONFIRM_MESSAGE').then(function (translateText) {
            //confirmation dialoge user have to confirm for delete current document
            var dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
            var dialog = dialogService.openDialog("confirm", dialogConfiguration, { text: translateText });
            dialog.result.then(function (btn) {
              documentsService.removeDocument(key).then(function (success) {
                $scope.documentList = _.reject($scope.documentList, function (document) {
                  return document.key === key;
                });
                _updateDocumentSize(success.documentsSize);
                userService.updateUserDocumentDetails($scope.documentsSize);
              }, function (error) {
                $log.error(error);
              });
            }, function (btn) {
            });
          });
        }
      };
      //Listen broadcasted event after newReturn is loaded.
      //here we are store listner in id so we can destroy other wise it will create two listner
      var taxReturnOpen = $scope.$on('TaxReturnOpen', function ($event, returnKey) {
        $scope.documentReturnId = returnKey;
        //on first time load available document list
        _getDocumentList();
      });
      //Listen broadcasted event after form is loaded.
      //here we are store listner in id so we can destroy other wise it will create two listner
      var formLoadedWithForm = $scope.$on('formLoadedWithForm', function ($event, form) {
        documentDocName = form.docName;
        $scope.docName = form.docName;
        $scope.docIndex = form.docIndex;
        $scope.lineNo = '';//on every form load make line number blank
        //set line list base on form
        if (!_.isUndefined(_.where(docLineList, { 'docName': form.docName })[0])) {
          $scope.lineList = _.where(docLineList, { 'docName': form.docName })[0].line;
        }
        else {
          $scope.lineList = [];
        }
      });

      //method for upload document
      //note : current method is only for single document
      $scope.uploadDocument = function () {
        //check privillages
        if ($scope.userCan('CAN_UPLOAD_DOCUMENT')) {
          $scope.fileSizeMessage = false;
          $scope.uploadErrMessage = false;
          $scope.maxDocumentSizeMessage = false;
          if (!_.isUndefined(filesOnHold) && filesOnHold !== undefined) {
            //on file save check which tab is active
            if (!_.isUndefined($scope.activeTab.formTab) && $scope.activeTab.formTab === true) {
              var docIndex = $scope.docIndex;
              type = "form";
            }
            else if (!_.isUndefined($scope.activeTab.returnTab) && $scope.activeTab.returnTab === true) {
              documentDocName = undefined;
              var docIndex = undefined;
              type = "return";
            }
            //define maximum size for uploading file
            var maxAllowedSize = 5 * 1024 * 1024;//for now maximum size is 5 mb
            // _.forEach(filesOnHold, function (file) {
            //condition to check whether file size is within the limit or not
            if (filesOnHold.size < maxAllowedSize) {
              //condition to check whetheruser have remain maximum allowd size limit or not
              $scope.fileSizeMessage = false;
              if ($scope.documentsSize + ((filesOnHold.size / 1024) / 1024) > $scope.maxStorageSize) {
                $scope.maxDocumentSizeMessage = true;
              } else {
                $scope.maxDocumentSizeMessage = false;
                documentsService.uploadDocument(filesOnHold, type, $scope.documentReturnId, documentDocName, docIndex, $scope.lineNo.key, $scope.lineNo.value, $scope.description).then(function (success) {
                  _updateDocumentSize(success.data.data.documentsSize);
                  userService.updateUserDocumentDetails($scope.documentsSize);//update userDetails object
                  //push current record in document list
                  var DocumentToPush = { 'description': $scope.description, "fileName": filesOnHold.name, 'type': type, "date": new Date().toUTCString(), 'key': success.data.data.key, "createdByName": "You", 'returnId': $scope.documentReturnId, 'docName': documentDocName, 'docIndex': docIndex, "lineText": $scope.lineNo.value };

                  $scope.documentList.push(DocumentToPush);
                  documentsService.documentList = $scope.documentList;
                  $scope.description = '';
                  $scope.lineNo = '';
                  filesOnHold = undefined;
                  $scope.fileName = '';
                  $scope.uploadProgress = 0;
                  messageService.showMessage('File uploaded successfully', 'success', 'DOCUMENT_UPLOADSUCESS');

                }, function (error) {
                  $log.error(error);
                  $scope.uploadErrMessage = true;
                  $scope.uploadProgress = 0;
                }, function (update) {
                  $scope.uploadProgress = update;
                });
              }
            } else if (filesOnHold.size > maxAllowedSize) {
              $scope.fileSizeMessage = true;
              $scope.uploadErrMessage = false;
              $scope.fileSizeLimitWarning = false;
              $scope.maxDocumentSizeMessage = false;
            }

            // });
          }
        }
      };

      //when user uploading any file we are just storing on local variable
      $scope.onFileSelect = function ($files) {
        if (!_.isUndefined($files) && $files.length !== 0) {
          $scope.invalidType = false;
          $scope.fileSizeMessage = false;
          $scope.uploadErrMessage = false;
          $scope.maxDocumentSizeMessage = false;
          filesOnHold = undefined;
          $scope.fileName = '';
          if (_.includes($scope.acceptFileType.split(','), $files[0].type)) {
            if (!_.isUndefined($files) && $files.length !== 0) {
              filesOnHold = $files[0];
              $scope.fileName = filesOnHold.name;
            }
          } else {
            $scope.invalidType = true;
          }
        }
      };

      //onclick remove file just clear local varible
      $scope.removeFile = function () {
        filesOnHold = undefined;
        $scope.fileName = '';
      };


      //Cleanup on destroy
      $scope.$on('$destroy', function () {
        taxReturnOpen();
        formLoadedWithForm();
      });

    }]
  };
}]);
