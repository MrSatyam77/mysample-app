"use strict";
var completeSummaryApp = angular.module("completeSummaryApp", []);
//Directive
completeSummaryApp.directive('completeSummary', [function () {
    return {
        restrict: 'AE',
        templateUrl: 'taxAppJs/return/summary/partials/detailSummary-directive.html',
        controller: ['$scope', '$log', '$location', '$q', 'completeSummaryService', 'localeService', 'userService', 'messageService', 'basketService', 'environment', 'systemConfig', function ($scope, $log, $location, $q, completeSummaryService, localeService, userService, messageService, basketService, environment, systemConfig) {
            var completeSummmaryMapping = [
                //return block in more quick return summary start
                { "set": { "objectName": "return", "property": "fillStatus" }, "get": { "form": "dMainInfo", "getElement": "filstts" } },
                { "set": { "objectName": "return", "property": "status" }, "get": { "form": "header", "getElement": "status" } },
                { "set": { "objectName": "return", "property": "createdBy" }, "get": { "form": "header", "getElement": "createdByName" } },
                { "set": { "objectName": "return", "property": "createdDateTime" }, "get": { "form": "header", "getElement": "createdDate" } },
                { "set": { "objectName": "return", "property": "updatedBy" }, "get": { "form": "header", "getElement": "updatedByName" } },
                { "set": { "objectName": "return", "property": "lastEdited" }, "get": { "form": "header", "getElement": "lastSavedTime" } },
                { "set": { "objectName": "return", "property": "returnType" }, "get": { "form": "header", "getElement": "packageNames" } },
                { "set": { "objectName": "return", "property": "isCheckedOut" }, "get": { "form": "header", "getElement": "isCheckedOut" } },
                { "set": { "objectName": "return", "property": "checkedOutBy" }, "get": { "form": "header", "getElement": "checkedOutBy" } },
                { "set": { "objectName": "return", "property": "id" }, "get": { "form": "header", "getElement": "id" } },
                { "set": { "objectName": "return", "property": "email" }, "get": { "form": "header", "getElement": "email" } },
                { "set": { "objectName": "return", "property": "returnMode" }, "get": { "form": "header", "getElement": "returnMode" } },
                //return block end
                //taxpayer block in more quick return summary start
                { "set": { "objectName": "taxPayer", "property": "ssn" }, "get": { "form": "header", "usrDetail": "client", "getElement": "ssn" } },
                { "set": { "objectName": "taxPayer", "property": "firstName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "firstName" } },
                { "set": { "objectName": "taxPayer", "property": "lastName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "lastName" } },
                { "set": { "objectName": "taxPayer", "property": "usAptNo" }, "get": { "form": "dMainInfo", "getElement": "strusaptno" } },
                { "set": { "objectName": "taxPayer", "property": "usStreet" }, "get": { "form": "dMainInfo", "getElement": "strusstrt" } },
                { "set": { "objectName": "taxPayer", "property": "usCity" }, "get": { "form": "dMainInfo", "getElement": "struscty" } },
                { "set": { "objectName": "taxPayer", "property": "usState" }, "get": { "form": "dMainInfo", "getElement": "strusst" } },
                { "set": { "objectName": "taxPayer", "property": "usZipCode" }, "get": { "form": "dMainInfo", "getElement": "struszip" } },
                { "set": { "objectName": "taxPayer", "property": "fgStreet" }, "get": { "form": "dMainInfo", "getElement": "strfgstrt" } },
                { "set": { "objectName": "taxPayer", "property": "fgCity" }, "get": { "form": "dMainInfo", "getElement": "strfgcty" } },
                { "set": { "objectName": "taxPayer", "property": "fgState" }, "get": { "form": "dMainInfo", "getElement": "ProvinceOrState" } },
                { "set": { "objectName": "taxPayer", "property": "fgPostalCode" }, "get": { "form": "dMainInfo", "getElement": "PostalCode" } },
                { "set": { "objectName": "taxPayer", "property": "fgCountry" }, "get": { "form": "dMainInfo", "getElement": "strfgcntry" } },
                { "set": { "objectName": "taxPayer", "property": "phoneNo" }, "get": { "form": "dMainInfo", "getElement": "strfgtptel" } },
                { "set": { "objectName": "taxPayer", "property": "email" }, "get": { "form": "dMainInfo", "getElement": "strtpeml" } },
                { "set": { "objectName": "taxPayer", "property": "dateOfBirth" }, "get": { "form": "dMainInfo", "getElement": "strtpdob" } },
                { "set": { "objectName": "taxPayer", "property": "dateOfDeath" }, "get": { "form": "dMainInfo", "getElement": "strtpdod" } },
                //taxpayer block in more quick return summary end
                //spouse block in more quick return summary start
                { "set": { "objectName": "spouse", "property": "firstName" }, "get": { "form": "dMainInfo", "getElement": "strspfnmi" } },
                { "set": { "objectName": "spouse", "property": "lastName" }, "get": { "form": "dMainInfo", "getElement": "strsplnm" } },
                { "set": { "objectName": "spouse", "property": "ssn" }, "get": { "form": "dMainInfo", "getElement": "strspssn" } },
                { "set": { "objectName": "spouse", "property": "phoneNo" }, "get": { "form": "dMainInfo", "getElement": "strfgsptel" } },
                { "set": { "objectName": "spouse", "property": "email" }, "get": { "form": "dMainInfo", "getElement": "strspeml" } },
                { "set": { "objectName": "spouse", "property": "dateOfBirth" }, "get": { "form": "dMainInfo", "getElement": "strspdob" } },
                { "set": { "objectName": "spouse", "property": "dateOfDeath" }, "get": { "form": "dMainInfo", "getElement": "strspdod" } },
                //spouse block in more quick return summary end
                //preparer block in more quick return summary start
                { "set": { "objectName": "preparer", "property": "preparerId" }, "get": { "form": "dReturnInfo", "getElement": "strprid" } },
                { "set": { "objectName": "preparer", "property": "name" }, "get": { "form": "dReturnInfo", "getElement": "strprnm" } },
                { "set": { "objectName": "preparer", "property": "ssn" }, "get": { "form": "dReturnInfo", "getElement": "strprssn" } },
                { "set": { "objectName": "preparer", "property": "ptin" }, "get": { "form": "dReturnInfo", "getElement": "strprptin" } },
                { "set": { "objectName": "preparer", "property": "ein" }, "get": { "form": "dReturnInfo", "getElement": "strprein" } },
                { "set": { "objectName": "preparer", "property": "telephoneNo" }, "get": { "form": "dReturnInfo", "getElement": "strprtele" } },
                { "set": { "objectName": "preparer", "property": "email" }, "get": { "form": "dReturnInfo", "getElement": "strpreml" } },
                //preparer block in more quick return summary end
                //Bank block in more quick return summary start
                { "set": { "objectName": "bank", "property": "name" }, "get": { "form": "dReturnInfo", "getElement": "" } },
                { "set": { "objectName": "bank", "property": "accountNo" }, "get": { "form": "dReturnInfo", "getElement": "strdan" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "dReturnInfo", "getElement": "blnsavingacc" } },
                { "set": { "objectName": "bank", "property": "rtn" }, "get": { "form": "dReturnInfo", "getElement": "strrtn" } },
                //Bank block in more quick return summary end
                //Mapping for 1040 start
                //Income block start
                { "set": { "objectName": "income", "property": "wagesAndSalary" }, "get": { "form": "d1040", "getElement": "WagesSalariesAndTipsAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1040", "getElement": "QuickreturnIntDiv" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1040", "getElement": "BusinessIncomeLossAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1040", "getElement": "CapitalGainLossAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1040", "getElement": "NetFarmProfitOrLossAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1040", "getElement": "TotalOtherIncomeAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1040", "getElement": "TotalIncomeAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1040", "getElement": "TotalAdjustmentsAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1040", "getElement": "TotalItemizedOrStandardDedAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1040", "getElement": "TaxableIncomeAmt" }, "mainForm": "1040" },
                //Income block end
                //Credit block for 1040 start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1040", "getElement": "ForeignTaxCreditAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1040", "getElement": "CrForChildAndDEPDCareAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "dSchR", "getElement": "QuickreturnSchRCr" }, "mainForm": "1040", "required": { "form": "d1040", "getElement": "SpecificOtherCreditsInd" } },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1040", "getElement": "EducationCreditAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1040", "getElement": "RtrSavingsContributionsCrAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1040", "getElement": "EarnedIncomeCreditAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1040", "getElement": "ChildTaxCreditAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1040", "getElement": "AdditionalChildTaxCreditAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "dSchR", "getElement": "CreditForElderlyOrDisabledAmt" }, "mainForm": "1040", "required": { "form": "d1040", "getElement": "SpecificOtherCreditsInd" } },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1040", "getElement": "TotalCreditsAmt" }, "mainForm": "1040" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1040", "getElement": "TaxAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1040", "getElement": "AlternativeMinimumTaxAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1040", "getElement": "fielddz" }, "mainForm": "1040" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1040", "getElement": "TotalTaxAmt" }, "mainForm": "1040" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1040", "getElement": "WithholdingTaxAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1040", "getElement": "EstimatedTaxPaymentsAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1040", "getElement": "QuickreturnOtherPymt" }, "mainForm": "1040" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1040", "getElement": "EsPenaltyAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1040", "getElement": "AmountOwedAmt" }, "mainForm": "1040" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1040", "getElement": "RefundAmt" }, "mainForm": "1040" },
                //Payment block end
                //Mapping for 1040 end
                //Mapping for 1040A start
                //Income block start
                { "set": { "objectName": "income", "property": "wagesAndSalary" }, "get": { "form": "d1040A", "getElement": "WagesSalariesAndTipsAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1040A", "getElement": "QuickreturnIntDiv" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1040A", "getElement": "" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1040A", "getElement": "CapitalGainLossAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1040A", "getElement": "" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1040A", "getElement": "" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1040A", "getElement": "TotalIncomeAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1040A", "getElement": "TotalAdjustmentsAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040A", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1040A", "getElement": "TotalItemizedOrStandardDedAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1040A", "getElement": "TaxableIncomeAmt" }, "mainForm": "1040A" },
                //Income block end
                //Credit block for 1040 start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1040A", "getElement": "" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1040A", "getElement": "CrForChildAndDEPDCareAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1040A", "getElement": "CreditForElderlyOrDisabledAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1040A", "getElement": "EducationCreditAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1040A", "getElement": "RtrSavingsContributionsCrAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1040A", "getElement": "EarnedIncomeCreditAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1040A", "getElement": "ChildTaxCreditAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1040A", "getElement": "AdditionalChildTaxCreditAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1040A", "getElement": "" }, "mainForm": "1040A" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1040A", "getElement": "TotalCreditsAmt" }, "mainForm": "1040A" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1040A", "getElement": "TaxAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d6251", "getElement": "AlternativeMinimumTaxAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1040A", "getElement": "HealthCareRspnsPenaltyAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1040A", "getElement": "TotalTax" }, "mainForm": "1040A" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1040A", "getElement": "WithholdingTaxAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1040A", "getElement": "EstimatedTaxPaymentsAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1040A", "getElement": "QuickreturnOtherPymt" }, "mainForm": "1040A" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1040A", "getElement": "EsPenaltyAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1040A", "getElement": "AmountOwedAmt" }, "mainForm": "1040A" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1040A", "getElement": "RefundAmt" }, "mainForm": "1040A" },
                //Payment block end
                //Mapping for 1040A end
                //Mapping for 1040EZ start
                //Income block start
                { "set": { "objectName": "income", "property": "wagesAndSalary" }, "get": { "form": "d1040EZ", "getElement": "WagesSalariesAndTipsAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1040EZ", "getElement": "TaxableInterestAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040EZ", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1040EZ", "getElement": "TaxableIncomeAmt" }, "mainForm": "1040EZ" },
                //Income block end
                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1040EZ", "getElement": "EarnedIncomeCreditAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": ".ctc" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1040EZ", "getElement": "EarnedIncomeCreditAmt" }, "mainForm": "1040EZ" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1040EZ", "getElement": "TaxAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1040EZ", "getElement": "HealthCareRspnsPenaltyAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1040EZ", "getElement": "TotalTax" }, "mainForm": "1040EZ" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1040EZ", "getElement": "WithholdingTaxAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1040EZ", "getElement": "" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1040EZ", "getElement": "AmountOwedAmt" }, "mainForm": "1040EZ" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1040EZ", "getElement": "RefundAmt" }, "mainForm": "1040EZ" },
                //Payment block end
                //Mapping for 1040EZ end
                //Mapping for 1040SS start
                //Income block start
                { "set": { "objectName": "income", "property": "wagesAndSalary" }, "get": { "form": "d1040SS", "getElement": "PuertoRicoIncomeAmt" }, "mainForm": "1040EZSS" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1040SS", "getElement": "NetProfitOrLossAmt" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1040SS", "getElement": "GrossIncome50" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1040SS", "getElement": "QuickreturnTotalInc" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040SS", "getElement": "QuickreturnTotalAGI" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1040SS", "getElement": "QuickreturnTaxableInc" }, "mainForm": "1040SS" },
                //Income block end
                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": ".ctc" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1040SS", "getElement": "part1line8" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1040SS", "getElement": "HealthCoverageTaxCreditAmt" }, "mainForm": "1040SS" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1040SS", "getElement": "QuickreturnTotalCr" }, "mainForm": "1040SS" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1040SS", "getElement": "SelfEmploymentTaxAmt" }, "mainForm": "1040SS" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1040SS", "getElement": "TotalTaxAmt" }, "mainForm": "1040SS" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1040SS", "getElement": "TotalSocSecAndMedcrWithheldAmt" }, "mainForm": "1040SS" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1040SS", "getElement": "EstimatedTaxPaymentsAmt" }, "mainForm": "1040SS" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1040A", "getElement": "QuickreturnOtherPymt" }, "mainForm": "1040A" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1040SS", "getElement": "" }, "mainForm": "1040SS" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1040SS", "getElement": "AmountOwedAmt" }, "mainForm": "1040SS" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1040SS", "getElement": "RefundAmt" }, "mainForm": "1040SS" },
                //Payment block end
                //Mapping for 1040SS end

                //Mapping for 1040 State start
                //Mapping for AL 40
                { "set": { "objectName": "al", "property": "taxableIncome" }, "get": { "form": "dAL40", "getElement": "TaxableIncome" }, "activeForm": "dAL40" },
                { "set": { "objectName": "al", "property": "tax" }, "get": { "form": "dAL40", "getElement": "TotalTaxDue" }, "activeForm": "dAL40" },
                { "set": { "objectName": "al", "property": "credits" }, "get": { "form": "dAL40", "getElement": "AL40Totalcredits" }, "activeForm": "dAL40" },
                { "set": { "objectName": "al", "property": "payments" }, "get": { "form": "dAL40", "getElement": "AL40TotalPayments" }, "activeForm": "dAL40" },
                { "set": { "objectName": "al", "property": "interstAndPenalties" }, "get": { "form": "dAL40", "getElement": "EstimatedTaxPenalty" }, "activeForm": "dAL40" },
                { "set": { "objectName": "al", "property": "balanceDue" }, "get": { "form": "dAL40", "getElement": "AmountOwed" }, "activeForm": "dAL40" },
                { "set": { "objectName": "al", "property": "refund" }, "get": { "form": "dAL40", "getElement": "RefundAmount" }, "activeForm": "dAL40" },
                //Mapping for AL 40 End

                //Mapping for AL 40 NR
                { "set": { "objectName": "al", "property": "taxableIncome" }, "get": { "form": "dAL40NR", "getElement": "Credits" }, "activeForm": "dAL40NR" },
                { "set": { "objectName": "al", "property": "tax" }, "get": { "form": "dAL40NR", "getElement": "Taxdue" }, "activeForm": "dAL40NR" },
                { "set": { "objectName": "al", "property": "credits" }, "get": { "form": "dAL40NR", "getElement": "AL40NRTotalcredits" }, "activeForm": "dAL40NR" },
                { "set": { "objectName": "al", "property": "payments" }, "get": { "form": "dAL40NR", "getElement": "Al40NRTotalpayments" }, "activeForm": "dAL40NR" },
                { "set": { "objectName": "al", "property": "interstAndPenalties" }, "get": { "form": "dAL40NR", "getElement": "EstimatedTaxPenalty" }, "activeForm": "dAL40NR" },
                { "set": { "objectName": "al", "property": "balanceDue" }, "get": { "form": "dAL40NR", "getElement": "AmountOwed" }, "activeForm": "dAL40NR" },
                { "set": { "objectName": "al", "property": "refund" }, "get": { "form": "dAL40NR", "getElement": "REFUNDEDTOYOU" }, "activeForm": "dAL40NR" },
                //Mapping for AL 40NR End

                //Mapping for AR 1000F
                { "set": { "objectName": "ar", "property": "taxableIncome" }, "get": { "form": "dAR1000F", "getElement": "TaxableInc" }, "activeForm": "dAR1000F" },
                { "set": { "objectName": "ar", "property": "tax" }, "get": { "form": "dAR1000F", "getElement": "CombinedTax" }, "activeForm": "dAR1000F" },
                { "set": { "objectName": "ar", "property": "credits" }, "get": { "form": "dAR1000F", "getElement": "TotalCredits" }, "activeForm": "dAR1000F" },
                { "set": { "objectName": "ar", "property": "payments" }, "get": { "form": "dAR1000F", "getElement": "TotalPayments" }, "activeForm": "dAR1000F" },
                { "set": { "objectName": "ar", "property": "interstAndPenalties" }, "get": { "form": "dAR1000F", "getElement": "PenaltyAmount" }, "activeForm": "dAR1000F" },
                { "set": { "objectName": "ar", "property": "balanceDue" }, "get": { "form": "dAR1000F", "getElement": "TotalAmountDue" }, "activeForm": "dAR1000F" },
                { "set": { "objectName": "ar", "property": "refund" }, "get": { "form": "dAR1000F", "getElement": "AmtToBeRefunded" }, "activeForm": "dAR1000F" },
                //Mapping for AR 1000F End

                //Mapping for AR 1000NR
                { "set": { "objectName": "ar", "property": "taxableIncome" }, "get": { "form": "dAR1000NR", "getElement": "NetTaxableIncome" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "taxableIncome1" }, "get": { "form": "dAR1000NR", "getElement": "NetTaxableIncomespouse" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "tax" }, "get": { "form": "dAR1000NR", "getElement": "CombinedTax" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "credits" }, "get": { "form": "dAR1000NR", "getElement": "TotalCredits" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "payments" }, "get": { "form": "dAR1000NR", "getElement": "TotalPayments" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "interstAndPenalties" }, "get": { "form": "dAR1000NR", "getElement": "PenaltyAmount" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "balanceDue" }, "get": { "form": "dAR1000NR", "getElement": "BalanceDueWithReturn" }, "activeForm": "dAR1000NR" },
                { "set": { "objectName": "ar", "property": "refund" }, "get": { "form": "dAR1000NR", "getElement": "AmtToBeRefunded" }, "activeForm": "dAR1000NR" },
                //Mapping for AR 1000NR End

                //Mapping for AZ 140 start
                { "set": { "objectName": "az", "property": "taxableIncome" }, "get": { "form": "dAZ140", "getElement": "AZTaxableInc" }, "activeForm": "dAZ140" },
                { "set": { "objectName": "az", "property": "tax" }, "get": { "form": "dAZ140", "getElement": "SubTotal" }, "activeForm": "dAZ140" },
                { "set": { "objectName": "az", "property": "credits" }, "get": { "form": "dAZ140", "getElement": "TotalCr" }, "activeForm": "dAZ140" },
                { "set": { "objectName": "az", "property": "payments" }, "get": { "form": "dAZ140", "getElement": "TotalPymt" }, "activeForm": "dAZ140" },
                { "set": { "objectName": "az", "property": "interstAndPenalties" }, "get": { "form": "dAZ140", "getElement": "EstPaymentPenalityMSA" }, "activeForm": "dAZ140" },
                { "set": { "objectName": "az", "property": "balanceDue" }, "get": { "form": "dAZ140", "getElement": "AmtOwed" }, "activeForm": "dAZ140" },
                { "set": { "objectName": "az", "property": "refund" }, "get": { "form": "dAZ140", "getElement": "RefundAmt" }, "activeForm": "dAZ140" },
                //Mapping for AZ 140 end
                //Mapping for AZ 140PY start
                { "set": { "objectName": "az", "property": "taxableIncome" }, "get": { "form": "dAZ140PY", "getElement": "AZTaxableInc" }, "activeForm": "dAZ140PY" },
                { "set": { "objectName": "az", "property": "tax" }, "get": { "form": "dAZ140PY", "getElement": "SubtractionsFromIncomeAmount1" }, "activeForm": "dAZ140PY" },
                { "set": { "objectName": "az", "property": "credits" }, "get": { "form": "dAZ140PY", "getElement": "TotalCr" }, "activeForm": "dAZ140PY" },
                { "set": { "objectName": "az", "property": "payments" }, "get": { "form": "dAZ140PY", "getElement": "TotalPymt" }, "activeForm": "dAZ140PY" },
                { "set": { "objectName": "az", "property": "interstAndPenalties" }, "get": { "form": "dAZ140PY", "getElement": "EstPaymentPenalityMSA" }, "activeForm": "dAZ140PY" },
                { "set": { "objectName": "az", "property": "balanceDue" }, "get": { "form": "dAZ140PY", "getElement": "AmtOwed" }, "activeForm": "dAZ140PY" },
                { "set": { "objectName": "az", "property": "refund" }, "get": { "form": "dAZ140PY", "getElement": "RefundAmt" }, "activeForm": "dAZ140PY" },
                //Mapping for AZ 140PY end
                //Mapping for AZ 140NR start
                { "set": { "objectName": "az", "property": "taxableIncome" }, "get": { "form": "dAZ140NR", "getElement": "AZTaxableInc" }, "activeForm": "dAZ140NR" },
                { "set": { "objectName": "az", "property": "tax" }, "get": { "form": "dAZ140NR", "getElement": "SubTotal" }, "activeForm": "dAZ140NR" },
                { "set": { "objectName": "az", "property": "credits" }, "get": { "form": "dAZ140NR", "getElement": "TotalCr" }, "activeForm": "dAZ140NR" },
                { "set": { "objectName": "az", "property": "payments" }, "get": { "form": "dAZ140NR", "getElement": "TotalPymt" }, "activeForm": "dAZ140NR" },
                { "set": { "objectName": "az", "property": "interstAndPenalties" }, "get": { "form": "dAZ140NR", "getElement": "EstPaymentPenalityMSA" }, "activeForm": "dAZ140NR" },
                { "set": { "objectName": "az", "property": "balanceDue" }, "get": { "form": "dAZ140NR", "getElement": "AmtOwed" }, "activeForm": "dAZ140NR" },
                { "set": { "objectName": "az", "property": "refund" }, "get": { "form": "dAZ140NR", "getElement": "RefundAmt" }, "activeForm": "dAZ140NR" },
                //Mapping for AZ 140NR end
                //Mapping for AZ 140EZ start
                { "set": { "objectName": "az", "property": "taxableIncome" }, "get": { "form": "dAZ140EZ", "getElement": "AzTaxableInc" }, "activeForm": "dAZ140EZ" },
                { "set": { "objectName": "az", "property": "tax" }, "get": { "form": "dAZ140EZ", "getElement": "TotalTaxLiab" }, "activeForm": "dAZ140EZ" },
                { "set": { "objectName": "az", "property": "credits" }, "get": { "form": "dAZ140EZ", "getElement": "TotalCr" }, "activeForm": "dAZ140EZ" },
                { "set": { "objectName": "az", "property": "payments" }, "get": { "form": "dAZ140EZ", "getElement": "TotalPymt" }, "activeForm": "dAZ140EZ" },
                { "set": { "objectName": "az", "property": "balanceDue" }, "get": { "form": "dAZ140EZ", "getElement": "TaxDue" }, "activeForm": "dAZ140EZ" },
                { "set": { "objectName": "az", "property": "refund" }, "get": { "form": "dAZ140EZ", "getElement": "RefundAmt" }, "activeForm": "dAZ140EZ" },
                //Mapping for AZ 140EZ end

                //Mapping for CA 540 start
                { "set": { "objectName": "ca", "property": "taxableIncome" }, "get": { "form": "dCA540", "getElement": "CATaxableIncome" }, "activeForm": "dCA540" },
                { "set": { "objectName": "ca", "property": "tax" }, "get": { "form": "dCA540", "getElement": "StateIncomeTax" }, "activeForm": "dCA540" },
                { "set": { "objectName": "ca", "property": "credits" }, "get": { "form": "dCA540", "getElement": "TotalCredits" }, "activeForm": "dCA540" },
                { "set": { "objectName": "ca", "property": "payments" }, "get": { "form": "dCA540", "getElement": "TotalPayments" }, "activeForm": "dCA540" },
                { "set": { "objectName": "ca", "property": "interstAndPenalties" }, "get": { "form": "dCA540", "getElement": "InterestAndPenaltiesOwed" }, "activeForm": "dCA540" },
                { "set": { "objectName": "ca", "property": "balanceDue" }, "get": { "form": "dCA540", "getElement": "TotalAmtDue" }, "activeForm": "dCA540" },
                { "set": { "objectName": "ca", "property": "refund" }, "get": { "form": "dCA540", "getElement": "Refund" }, "activeForm": "dCA540" },
                //Mapping for CA 540 end
                //Mapping for CA 540NR start
                { "set": { "objectName": "ca", "property": "taxableIncome" }, "get": { "form": "dCA540NR", "getElement": "TotalTaxableIncome" }, "activeForm": "dCA540NR" },
                { "set": { "objectName": "ca", "property": "tax" }, "get": { "form": "dCA540NR", "getElement": "TotalTax2" }, "activeForm": "dCA540NR" },
                { "set": { "objectName": "ca", "property": "credits" }, "get": { "form": "dCA540NR", "getElement": "TotalCredits" }, "activeForm": "dCA540NR" },
                { "set": { "objectName": "ca", "property": "payments" }, "get": { "form": "dCA540NR", "getElement": "TotalPayments" }, "activeForm": "dCA540NR" },
                { "set": { "objectName": "ca", "property": "interstAndPenalties" }, "get": { "form": "dCA540NR", "getElement": "InterestAndPenaltiesOwed" }, "activeForm": "dCA540NR" },
                { "set": { "objectName": "ca", "property": "balanceDue" }, "get": { "form": "dCA540NR", "getElement": "AmountOwed" }, "activeForm": "dCA540NR" },
                { "set": { "objectName": "ca", "property": "refund" }, "get": { "form": "dCA540NR", "getElement": "DDRAmount" }, "activeForm": "dCA540NR" },
                //Mapping for CA 540NR end
                //Mapping for CA 540NRS start
                { "set": { "objectName": "ca", "property": "taxableIncome" }, "get": { "form": "dCA540NRS", "getElement": "CATaxableIncome" }, "activeForm": "dCA540NRS" },
                { "set": { "objectName": "ca", "property": "tax" }, "get": { "form": "dCA540NRS", "getElement": "TotalTax" }, "activeForm": "dCA540NRS" },
                { "set": { "objectName": "ca", "property": "credits" }, "get": { "form": "dCA540NRS", "getElement": "TotalCredits" }, "activeForm": "dCA540NRS" },
                { "set": { "objectName": "ca", "property": "payments" }, "get": { "form": "dCA540NRS", "getElement": "CAWithholding" }, "activeForm": "dCA540NRS" },
                { "set": { "objectName": "ca", "property": "interstAndPenalties" }, "get": { "form": "dCA540NRS", "getElement": "" }, "activeForm": "dCA540NRS" },
                { "set": { "objectName": "ca", "property": "balanceDue" }, "get": { "form": "dCA540NRS", "getElement": "AmountOwed" }, "activeForm": "dCA540NRS" },
                { "set": { "objectName": "ca", "property": "refund" }, "get": { "form": "dCA540NRS", "getElement": "Refund" }, "activeForm": "dCA540NRS" },
                //Mapping for CA 540NRS end
                //Mapping for CA 5402EZ start
                { "set": { "objectName": "ca", "property": "taxableIncome" }, "get": { "form": "dCA5402EZ", "getElement": "CAAGI" }, "activeForm": "dCA5402EZ" },
                { "set": { "objectName": "ca", "property": "tax" }, "get": { "form": "dCA5402EZ", "getElement": "TotalTax" }, "activeForm": "dCA5402EZ" },
                { "set": { "objectName": "ca", "property": "credits" }, "get": { "form": "dCA5402EZ", "getElement": "TotalCredits" }, "activeForm": "dCA5402EZ" },
                { "set": { "objectName": "ca", "property": "payments" }, "get": { "form": "dCA5402EZ", "getElement": "CAWithholding" }, "activeForm": "dCA5402EZ" },
                { "set": { "objectName": "ca", "property": "interstAndPenalties" }, "get": { "form": "dCA5402EZ", "getElement": "" }, "activeForm": "dCA5402EZ" },
                { "set": { "objectName": "ca", "property": "balanceDue" }, "get": { "form": "dCA5402EZ", "getElement": "AmountOwed" }, "activeForm": "dCA5402EZ" },
                { "set": { "objectName": "ca", "property": "refund" }, "get": { "form": "dCA5402EZ", "getElement": "Refund" }, "activeForm": "dCA5402EZ" },
                //Mapping for CA 5402EZ end

                //Mapping for CO 104
                { "set": { "objectName": "co", "property": "taxableIncome" }, "get": { "form": "dCO104", "getElement": "StateTaxableIncome" }, "activeForm": "dCO104" },
                { "set": { "objectName": "co", "property": "tax" }, "get": { "form": "dCO104", "getElement": "StateIncomeTax" }, "activeForm": "dCO104" },
                { "set": { "objectName": "co", "property": "credits" }, "get": { "form": "dCO104", "getElement": "CO104Totalcredits" }, "activeForm": "dCO104" },
                { "set": { "objectName": "co", "property": "payments" }, "get": { "form": "dCO104", "getElement": "CO104Totalpayments" }, "activeForm": "dCO104" },
                { "set": { "objectName": "co", "property": "interstAndPenalties" }, "get": { "form": "dCO104", "getElement": "CO104Totalintrestpenalty" }, "activeForm": "dCO104" },
                { "set": { "objectName": "co", "property": "balanceDue" }, "get": { "form": "dCO104", "getElement": "BalanceDueWithReturn" }, "activeForm": "dCO104" },
                { "set": { "objectName": "co", "property": "refund" }, "get": { "form": "dCO104", "getElement": "NetRefund" }, "activeForm": "dCO104" },
                //Mapping for CO 104 End

                //Mapping for CT1040
                { "set": { "objectName": "ct", "property": "taxableIncome" }, "get": { "form": "dCT1040", "getElement": "AdjustedGrossIncome" }, "activeForm": "dCT1040" },
                { "set": { "objectName": "ct", "property": "tax" }, "get": { "form": "dCT1040", "getElement": "CT1040TotalTax" }, "activeForm": "dCT1040" },
                { "set": { "objectName": "ct", "property": "credits" }, "get": { "form": "dCT1040", "getElement": "CT1040Totalcredits" }, "activeForm": "dCT1040" },
                { "set": { "objectName": "ct", "property": "payments" }, "get": { "form": "dCT1040", "getElement": "CT1040Totalpayments" }, "activeForm": "dCT1040" },
                { "set": { "objectName": "ct", "property": "interstAndPenalties" }, "get": { "form": "dCT1040", "getElement": "EstTaxUnderpaymentInterest" }, "activeForm": "dCT1040" },
                { "set": { "objectName": "ct", "property": "balanceDue" }, "get": { "form": "dCT1040", "getElement": "CT1040TotalTaxDue" }, "activeForm": "dCT1040" },
                { "set": { "objectName": "ct", "property": "refund" }, "get": { "form": "dCT1040", "getElement": "Refund" }, "activeForm": "dCT1040" },
                //Mapping for CT1040 End

                //Mapping for CTNRPY
                { "set": { "objectName": "ct", "property": "taxableIncome" }, "get": { "form": "dCT1040NRPY", "getElement": "StateTotalIncome" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "tax" }, "get": { "form": "dCT1040NRPY", "getElement": "CT1040NRPYTotalTax" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "credits" }, "get": { "form": "dCT1040NRPY", "getElement": "CT1040NRPYTotalcredits" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "payments" }, "get": { "form": "dCT1040NRPY", "getElement": "CT1040NRPYTotalPayments" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "interstAndPenalties" }, "get": { "form": "dCT1040NRPY", "getElement": "LatePenalty" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "interest" }, "get": { "form": "dCT1040NRPY", "getElement": "LateInterest" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "balanceDue" }, "get": { "form": "dCT1040NRPY", "getElement": "TaxDue" }, "activeForm": "dCT1040NRPY" },
                { "set": { "objectName": "ct", "property": "refund" }, "get": { "form": "dCT1040NRPY", "getElement": "Refund" }, "activeForm": "dCT1040NRPY" },
                //Mapping for CTNRPY End

                //Mapping for DC40
                { "set": { "objectName": "dc", "property": "taxableIncome" }, "get": { "form": "dDC40", "getElement": "TaxableIncomeAmt" }, "activeForm": "dDC40" },
                { "set": { "objectName": "dc", "property": "tax" }, "get": { "form": "dDC40", "getElement": "TaxAmt" }, "activeForm": "dDC40" },
                { "set": { "objectName": "dc", "property": "credits" }, "get": { "form": "dDC40", "getElement": "DC40Totalcredits" }, "activeForm": "dDC40" },
                { "set": { "objectName": "dc", "property": "payments" }, "get": { "form": "dDC40", "getElement": "DC40Totalpayments" }, "activeForm": "dDC40" },
                { "set": { "objectName": "dc", "property": "interstAndPenalties" }, "get": { "form": "dDC40", "getElement": "DC40Intrestpenlaty" }, "activeForm": "dDC40" },
                { "set": { "objectName": "dc", "property": "balanceDue" }, "get": { "form": "dDC40", "getElement": "TotalDueAmt" }, "activeForm": "dDC40" },
                { "set": { "objectName": "dc", "property": "refund" }, "get": { "form": "dDC40", "getElement": "NetRefundAmt" }, "activeForm": "dDC40" },
                //Mapping for DC40 End

                //Mapping for DE 200-01
                { "set": { "objectName": "de", "property": "taxableIncome" }, "get": { "form": "dDE20001", "getElement": "DE20001TotalTaxableIncome" }, "activeForm": "dDE20001" },
                { "set": { "objectName": "de", "property": "tax" }, "get": { "form": "dDE20001", "getElement": "DE20001TotalTax" }, "activeForm": "dDE20001" },
                { "set": { "objectName": "de", "property": "credits" }, "get": { "form": "dDE20001", "getElement": "DE20001TotalCredits" }, "activeForm": "dDE20001" },
                { "set": { "objectName": "de", "property": "payments" }, "get": { "form": "dDE20001", "getElement": "DE20001TotalPayments" }, "activeForm": "dDE20001" },
                { "set": { "objectName": "de", "property": "interstAndPenalties" }, "get": { "form": "dDE20001", "getElement": "PenaltyAndInterest" }, "activeForm": "dDE20001" },
                { "set": { "objectName": "de", "property": "balanceDue" }, "get": { "form": "dDE20001", "getElement": "BalanceDueWithReturn" }, "activeForm": "dDE20001" },
                { "set": { "objectName": "de", "property": "refund" }, "get": { "form": "dDE20001", "getElement": "NetRefund" }, "activeForm": "dDE20001" },
                //Mapping for DE 200-01 End

                //Mapping for DE 200-02
                { "set": { "objectName": "de", "property": "taxableIncome" }, "get": { "form": "dDE20002", "getElement": "StateTaxableIncome" }, "activeForm": "dDE20002" },
                { "set": { "objectName": "de", "property": "tax" }, "get": { "form": "dDE20002", "getElement": "TaxBeforeCredits" }, "activeForm": "dDE20002" },
                { "set": { "objectName": "de", "property": "credits" }, "get": { "form": "dDE20002", "getElement": "TotalNRCredit" }, "activeForm": "dDE20002" },
                { "set": { "objectName": "de", "property": "payments" }, "get": { "form": "dDE20002", "getElement": "TotalRefundableCredit" }, "activeForm": "dDE20002" },
                { "set": { "objectName": "de", "property": "interstAndPenalties" }, "get": { "form": "dDE20002", "getElement": "PenaltyAndInterest" }, "activeForm": "dDE20002" },
                { "set": { "objectName": "de", "property": "balanceDue" }, "get": { "form": "dDE20002", "getElement": "BalanceDueWithReturn" }, "activeForm": "dDE20002" },
                { "set": { "objectName": "de", "property": "refund" }, "get": { "form": "dDE20002", "getElement": "NetRefund" }, "activeForm": "dDE20002" },
                //Mapping for DE 200-02 End

                //Mapping for GA Start
                //Mapping for GA 500
                { "set": { "objectName": "ga", "property": "taxableIncome" }, "get": { "form": "dGA500", "getElement": "StateTaxableIncome" }, "activeForm": "dGA500" },
                { "set": { "objectName": "ga", "property": "tax" }, "get": { "form": "dGA500", "getElement": "StateIncomeTax" }, "activeForm": "dGA500" },
                { "set": { "objectName": "ga", "property": "credits" }, "get": { "form": "dGA500", "getElement": "TaxAfterCredits" }, "activeForm": "dGA500" },
                { "set": { "objectName": "ga", "property": "payments" }, "get": { "form": "dGA500", "getElement": "TotalPrePaymentCredits" }, "activeForm": "dGA500" },
                { "set": { "objectName": "ga", "property": "interstAndPenalties" }, "get": { "form": "dGA500", "getElement": "EstimatedTaxPenalty" }, "activeForm": "dGA500" },
                { "set": { "objectName": "ga", "property": "balanceDue" }, "get": { "form": "dGA500", "getElement": "BalanceDueWithReturn" }, "activeForm": "dGA500" },
                { "set": { "objectName": "ga", "property": "refund" }, "get": { "form": "dGA500", "getElement": "NetRefund" }, "activeForm": "dGA500" },
                //Mapping for GA 500 End

                //Mapping for GA 500EZ
                { "set": { "objectName": "ga", "property": "taxableIncome" }, "get": { "form": "dGA500EZ", "getElement": "StateTaxableIncome" }, "activeForm": "dGA500EZ" },
                { "set": { "objectName": "ga", "property": "tax" }, "get": { "form": "dGA500EZ", "getElement": "StateIncomeTax" }, "activeForm": "dGA500EZ" },
                { "set": { "objectName": "ga", "property": "credits" }, "get": { "form": "dGA500EZ", "getElement": "TaxAfterCredits" }, "activeForm": "dGA500EZ" },
                { "set": { "objectName": "ga", "property": "payments" }, "get": { "form": "dGA500EZ", "getElement": "TaxOverpayment" }, "activeForm": "dGA500EZ" },
                { "set": { "objectName": "ga", "property": "interstAndPenalties" }, "get": { "form": "dGA500EZ", "getElement": "" }, "activeForm": "dGA500EZ" },
                { "set": { "objectName": "ga", "property": "balanceDue" }, "get": { "form": "dGA500EZ", "getElement": "BalanceDueWithReturn" }, "activeForm": "dGA500EZ" },
                { "set": { "objectName": "ga", "property": "refund" }, "get": { "form": "dGA500EZ", "getElement": "NetRefund" }, "activeForm": "dGA500EZ" },
                //Mapping for GA 500EZ End

                //Mapping for GA 500X
                { "set": { "objectName": "ga", "property": "taxableIncome" }, "get": { "form": "dGA500X", "getElement": "StateTaxableIncome" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "tax" }, "get": { "form": "dGA500X", "getElement": "StateIncomeTax" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "credits" }, "get": { "form": "dGA500X", "getElement": "TaxAfterCredits" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "payments" }, "get": { "form": "dGA500X", "getElement": "TotalPrePaymentCredits" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "interstAndPenalties" }, "get": { "form": "dGA500X", "getElement": "LatePaymentPenalty" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "interest" }, "get": { "form": "dGA500X", "getElement": "Interest" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "balanceDue" }, "get": { "form": "dGA500X", "getElement": "AmountOwed" }, "activeForm": "dGA500X" },
                { "set": { "objectName": "ga", "property": "refund" }, "get": { "form": "dGA500X", "getElement": "RefundToBeReceived" }, "activeForm": "dGA500X" },
                //Mapping for GA 500X End
                //Mapping for GA End

                //Mapping for IA start
                //Mapping for IA 1040
                { "set": { "objectName": "ia", "property": "taxableIncome" }, "get": { "form": "dIA1040", "getElement": "IA1040TotalTaxableIncome" }, "activeForm": "dIA1040" },
                { "set": { "objectName": "ia", "property": "tax" }, "get": { "form": "dIA1040", "getElement": "IA1040TotalTax" }, "activeForm": "dIA1040" },
                { "set": { "objectName": "ia", "property": "credits" }, "get": { "form": "dIA1040", "getElement": "IA1040Totalcredits" }, "activeForm": "dIA1040" },
                { "set": { "objectName": "ia", "property": "payments" }, "get": { "form": "dIA1040", "getElement": "IA1040Totalpayments" }, "activeForm": "dIA1040" },
                { "set": { "objectName": "ia", "property": "interstAndPenalties" }, "get": { "form": "dIA1040", "getElement": "IA1040TotalInterestandpenalities" }, "activeForm": "dIA1040" },
                { "set": { "objectName": "ia", "property": "balanceDue" }, "get": { "form": "dIA1040", "getElement": "TotalAmountDue" }, "activeForm": "dIA1040" },
                { "set": { "objectName": "ia", "property": "refund" }, "get": { "form": "dIA1040", "getElement": "Refund" }, "activeForm": "dIA1040" },
                //Mapping for IA 1040 End
                //Mapping for IA End

                //Mapping for IL start
                //Mapping for IL 1040
                { "set": { "objectName": "il", "property": "taxableIncome" }, "get": { "form": "dIL1040", "getElement": "NetIncome" }, "activeForm": "dIL1040" },
                { "set": { "objectName": "il", "property": "tax" }, "get": { "form": "dIL1040", "getElement": "IL1040TotalTax" }, "activeForm": "dIL1040" },
                { "set": { "objectName": "il", "property": "credits" }, "get": { "form": "dIL1040", "getElement": "IL1040Totalcredits" }, "activeForm": "dIL1040" },
                { "set": { "objectName": "il", "property": "payments" }, "get": { "form": "dIL1040", "getElement": "IL1040Totalpayments" }, "activeForm": "dIL1040" },
                { "set": { "objectName": "il", "property": "interstAndPenalties" }, "get": { "form": "dIL1040", "getElement": "PenaltyIL2210" }, "activeForm": "dIL1040" },
                { "set": { "objectName": "il", "property": "balanceDue" }, "get": { "form": "dIL1040", "getElement": "BalanceDueWithReturn" }, "activeForm": "dIL1040" },
                { "set": { "objectName": "il", "property": "refund" }, "get": { "form": "dIL1040", "getElement": "NetRefund" }, "activeForm": "dIL1040" },
                //Mapping for IL 1040 End
                //Mapping for IL End

                //Mapping for KS start
                //Mapping for KS K40
                { "set": { "objectName": "ks", "property": "taxableIncome" }, "get": { "form": "dKSK40", "getElement": "StateTaxableIncome" }, "activeForm": "dKSK40" },
                { "set": { "objectName": "ks", "property": "tax" }, "get": { "form": "dKSK40", "getElement": "KS40TotalTax" }, "activeForm": "dKSK40" },
                { "set": { "objectName": "ks", "property": "credits" }, "get": { "form": "dKSK40", "getElement": "KS40TotalCredits" }, "activeForm": "dKSK40" },
                { "set": { "objectName": "ks", "property": "payments" }, "get": { "form": "dKSK40", "getElement": "TotalRefundableCredits" }, "activeForm": "dKSK40" },
                { "set": { "objectName": "ks", "property": "interstAndPenalties" }, "get": { "form": "dKSK40", "getElement": "KS40TotalInterestandpenalties" }, "activeForm": "dKSK40" },
                { "set": { "objectName": "ks", "property": "balanceDue" }, "get": { "form": "dKSK40", "getElement": "AmountYouOwe" }, "activeForm": "dKSK40" },
                { "set": { "objectName": "ks", "property": "refund" }, "get": { "form": "dKSK40", "getElement": "TotalRefund" }, "activeForm": "dKSK40" },
                //Mapping for KS K40 End
                //Mapping for KS End

                //Mapping for KY start
                //Mapping for KY 740NP
                { "set": { "objectName": "ky", "property": "taxableIncome" }, "get": { "form": "dKY740NP", "getElement": "Amount1" }, "activeForm": "dKY740NP" },
                { "set": { "objectName": "ky", "property": "tax" }, "get": { "form": "dKY740NP", "getElement": "TaxAmount" }, "activeForm": "dKY740NP" },
                { "set": { "objectName": "ky", "property": "credits" }, "get": { "form": "dKY740NP", "getElement": "KY740NPTotalCredits" }, "activeForm": "dKY740NP" },
                { "set": { "objectName": "ky", "property": "payments" }, "get": { "form": "dKY740NP", "getElement": "KY740NPTotalPayments" }, "activeForm": "dKY740NP" },
                { "set": { "objectName": "ky", "property": "interstAndPenalties" }, "get": { "form": "dKY740NP", "getElement": "Amount10" }, "activeForm": "dKY740NP" },
                { "set": { "objectName": "ky", "property": "balanceDue" }, "get": { "form": "dKY740NP", "getElement": "AdditionalTaxDue" }, "activeForm": "dKY740NP" },
                { "set": { "objectName": "ky", "property": "refund" }, "get": { "form": "dKY740NP", "getElement": "RefundAmount" }, "activeForm": "dKY740NP" },
                //Mapping for KY 740NP End

                //Mapping for KY 740
                { "set": { "objectName": "ky", "property": "taxableIncome" }, "get": { "form": "dKY740", "getElement": "KY740ToatlIncome" }, "activeForm": "dKY740" },
                { "set": { "objectName": "ky", "property": "tax" }, "get": { "form": "dKY740", "getElement": "KY740TotalTax" }, "activeForm": "dKY740" },
                { "set": { "objectName": "ky", "property": "credits" }, "get": { "form": "dKY740", "getElement": "KY740TotalCredits" }, "activeForm": "dKY740" },
                { "set": { "objectName": "ky", "property": "payments" }, "get": { "form": "dKY740", "getElement": "KY740TotalPayments" }, "activeForm": "dKY740" },
                { "set": { "objectName": "ky", "property": "interstAndPenalties" }, "get": { "form": "dKY740", "getElement": "SubtotalPenaltyInterest" }, "activeForm": "dKY740" },
                { "set": { "objectName": "ky", "property": "balanceDue" }, "get": { "form": "dKY740", "getElement": "AmountOwed" }, "activeForm": "dKY740" },
                { "set": { "objectName": "ky", "property": "refund" }, "get": { "form": "dKY740", "getElement": "Refund" }, "activeForm": "dKY740" },
                //Mapping for KY 740 End
                //Mapping for KY End

                //Mapping for LA start
                //Mapping for LA IT540
                { "set": { "objectName": "la", "property": "taxableIncome" }, "get": { "form": "dLAIT540", "getElement": "YourLATaxTableIncome" }, "activeForm": "dLAIT540" },
                { "set": { "objectName": "la", "property": "tax" }, "get": { "form": "dLAIT540", "getElement": "YourLAIncomeTax" }, "activeForm": "dLAIT540" },
                { "set": { "objectName": "la", "property": "credits" }, "get": { "form": "dLAIT540", "getElement": "LAIT540Totalcredits" }, "activeForm": "dLAIT540" },
                { "set": { "objectName": "la", "property": "payments" }, "get": { "form": "dLAIT540", "getElement": "TotalRefTaxCreditAndPayment" }, "activeForm": "dLAIT540" },
                { "set": { "objectName": "la", "property": "interstAndPenalties" }, "get": { "form": "dLAIT540", "getElement": "LAIT540TotalInterestandpenalties" }, "activeForm": "dLAIT540" },
                { "set": { "objectName": "la", "property": "balanceDue" }, "get": { "form": "dLAIT540", "getElement": "BalanceDueLA" }, "activeForm": "dLAIT540" },
                { "set": { "objectName": "la", "property": "refund" }, "get": { "form": "dLAIT540", "getElement": "AmountToBeRefunded" }, "activeForm": "dLAIT540" },
                //Mapping for LA IT540 End

                //Mapping for LA IT540B
                { "set": { "objectName": "la", "property": "taxableIncome" }, "get": { "form": "dLAIT540B", "getElement": "LANetIncome" }, "activeForm": "dLAIT540B" },
                { "set": { "objectName": "la", "property": "tax" }, "get": { "form": "dLAIT540B", "getElement": "YourLAIncomeTax" }, "activeForm": "dLAIT540B" },
                { "set": { "objectName": "la", "property": "credits" }, "get": { "form": "dLAIT540B", "getElement": "LAIT540BTotalcredits" }, "activeForm": "dLAIT540B" },
                { "set": { "objectName": "la", "property": "payments" }, "get": { "form": "dLAIT540B", "getElement": "LAIT540BTotalpayments" }, "activeForm": "dLAIT540B" },
                { "set": { "objectName": "la", "property": "interstAndPenalties" }, "get": { "form": "dLAIT540B", "getElement": "UnderpaymentPenalty" }, "activeForm": "dLAIT540B" },
                { "set": { "objectName": "la", "property": "refund" }, "get": { "form": "dLAIT540B", "getElement": "AmountToBeRefunded" }, "activeForm": "dLAIT540B" },
                //Mapping for LA IT540B End
                //Mapping for LA End	

                //Mapping for MD 502
                { "set": { "objectName": "md", "property": "taxableIncome" }, "get": { "form": "dMD502", "getElement": "TaxableNetIncome" }, "activeForm": "dMD502" },
                { "set": { "objectName": "md", "property": "tax" }, "get": { "form": "dMD502", "getElement": "MD502Totaltax" }, "activeForm": "dMD502" },
                { "set": { "objectName": "md", "property": "credits" }, "get": { "form": "dMD502", "getElement": "MD502Totalcredits" }, "activeForm": "dMD502" },
                { "set": { "objectName": "md", "property": "payments" }, "get": { "form": "dMD502", "getElement": "MD502Totalpayments" }, "activeForm": "dMD502" },
                { "set": { "objectName": "md", "property": "interstAndPenalties" }, "get": { "form": "dMD502", "getElement": "AppliedToNextYear" }, "activeForm": "dMD502" },
                { "set": { "objectName": "md", "property": "balanceDue" }, "get": { "form": "dMD502", "getElement": "RefundableTaxCredits" }, "activeForm": "dMD502" },
                { "set": { "objectName": "md", "property": "refund" }, "get": { "form": "dMD502", "getElement": "ToBeRefunded" }, "activeForm": "dMD502" },
                //Mapping for MD 502 End

                //Mapping for MD 505
                { "set": { "objectName": "md", "property": "taxableIncome" }, "get": { "form": "dMD505", "getElement": "TaxableNetIncome" }, "activeForm": "dMD505" },
                { "set": { "objectName": "md", "property": "tax" }, "get": { "form": "dMD505", "getElement": "StateIncomeTax" }, "activeForm": "dMD505" },
                { "set": { "objectName": "md", "property": "credits" }, "get": { "form": "dMD505", "getElement": "MD505Totalcredits" }, "activeForm": "dMD505" },
                { "set": { "objectName": "md", "property": "payments" }, "get": { "form": "dMD505", "getElement": "MD505Totalpayments" }, "activeForm": "dMD505" },
                { "set": { "objectName": "md", "property": "interstAndPenalties" }, "get": { "form": "dMD505", "getElement": "" }, "activeForm": "dMD505" },
                { "set": { "objectName": "md", "property": "balanceDue" }, "get": { "form": "dMD505", "getElement": "BalanceDue" }, "activeForm": "dMD505" },
                { "set": { "objectName": "md", "property": "refund" }, "get": { "form": "dMD505", "getElement": "ToBeRefunded" }, "activeForm": "dMD505" },
                //Mapping for MD 505 End	

                //Mapping for ME 1040
                { "set": { "objectName": "me", "property": "taxableIncome" }, "get": { "form": "dME1040", "getElement": "TaxInc" }, "activeForm": "dME1040" },
                { "set": { "objectName": "me", "property": "tax" }, "get": { "form": "dME1040", "getElement": "ME1040TotalTax" }, "activeForm": "dME1040" },
                { "set": { "objectName": "me", "property": "credits" }, "get": { "form": "dME1040", "getElement": "ME1040TotalCredits" }, "activeForm": "dME1040" },
                { "set": { "objectName": "me", "property": "payments" }, "get": { "form": "dME1040", "getElement": "ME1040TotalPayments" }, "activeForm": "dME1040" },
                { "set": { "objectName": "me", "property": "interstAndPenalties" }, "get": { "form": "dME1040", "getElement": "UndPmtPen" }, "activeForm": "dME1040" },
                { "set": { "objectName": "me", "property": "balanceDue" }, "get": { "form": "dME1040", "getElement": "TaxDue" }, "activeForm": "dME1040" },
                { "set": { "objectName": "me", "property": "refund" }, "get": { "form": "dME1040", "getElement": "Refund" }, "activeForm": "dME1040" },
                //Mapping for ME 1040 End

                //Mapping for MI 1040
                { "set": { "objectName": "mi", "property": "taxableIncome" }, "get": { "form": "dMI1040", "getElement": "TaxableIncome" }, "activeForm": "dMI1040" },
                { "set": { "objectName": "mi", "property": "tax" }, "get": { "form": "dMI1040", "getElement": "StateIncomeTax" }, "activeForm": "dMI1040" },
                { "set": { "objectName": "mi", "property": "credits" }, "get": { "form": "dMI1040", "getElement": "TotalCr" }, "activeForm": "dMI1040" },
                { "set": { "objectName": "mi", "property": "payments" }, "get": { "form": "dMI1040", "getElement": "TotalPymt" }, "activeForm": "dMI1040" },
                { "set": { "objectName": "mi", "property": "interstAndPenalties" }, "get": { "form": "dMI1040", "getElement": "IntandPenalty" }, "activeForm": "dMI1040" },
                { "set": { "objectName": "mi", "property": "balanceDue" }, "get": { "form": "dMI1040", "getElement": "BalanceDueWithReturn" }, "activeForm": "dMI1040" },
                { "set": { "objectName": "mi", "property": "refund" }, "get": { "form": "dMI1040", "getElement": "Refund" }, "activeForm": "dMI1040" },
                //Mapping for MI 1040 End  

                //Mapping for MN M1
                { "set": { "objectName": "mn", "property": "taxableIncome" }, "get": { "form": "dMNM1", "getElement": "StateTaxableIncome" }, "activeForm": "dMNM1" },
                { "set": { "objectName": "mn", "property": "tax" }, "get": { "form": "dMNM1", "getElement": "MNM1TotalTax" }, "activeForm": "dMNM1" },
                { "set": { "objectName": "mn", "property": "credits" }, "get": { "form": "dMNM1", "getElement": "MNM1TotalCredits" }, "activeForm": "dMNM1" },
                { "set": { "objectName": "mn", "property": "payments" }, "get": { "form": "dMNM1", "getElement": "MNM1TotalPayments" }, "activeForm": "dMNM1" },
                { "set": { "objectName": "mn", "property": "interstAndPenalties" }, "get": { "form": "dMNM1", "getElement": "Penalty" }, "activeForm": "dMNM1" },
                { "set": { "objectName": "mn", "property": "balanceDue" }, "get": { "form": "dMNM1", "getElement": "BalanceDueWithReturn" }, "activeForm": "dMNM1" },
                { "set": { "objectName": "mn", "property": "refund" }, "get": { "form": "dMNM1", "getElement": "NetRefund" }, "activeForm": "dMNM1" },
                //Mapping for MN M1 End

                //Mapping for MO1040
                { "set": { "objectName": "mo", "property": "taxableIncome" }, "get": { "form": "dMO1040", "getElement": "MO1040TaxableInc" }, "activeForm": "dMO1040" },
                { "set": { "objectName": "mo", "property": "tax" }, "get": { "form": "dMO1040", "getElement": "MO1040TotalTax" }, "activeForm": "dMO1040" },
                { "set": { "objectName": "mo", "property": "credits" }, "get": { "form": "dMO1040", "getElement": "MO1040Totalcredits" }, "activeForm": "dMO1040" },
                { "set": { "objectName": "mo", "property": "payments" }, "get": { "form": "dMO1040", "getElement": "MO1040TotalPayments" }, "activeForm": "dMO1040" },
                { "set": { "objectName": "mo", "property": "interstAndPenalties" }, "get": { "form": "dMO1040", "getElement": "EstimatedTaxPenalty" }, "activeForm": "dMO1040" },
                { "set": { "objectName": "mo", "property": "balanceDue" }, "get": { "form": "dMO1040", "getElement": "AmountYouOwe" }, "activeForm": "dMO1040" },
                { "set": { "objectName": "mo", "property": "refund" }, "get": { "form": "dMO1040", "getElement": "Refund" }, "activeForm": "dMO1040" },
                //Mapping for MO1040

                //Mapping for MO1040A
                { "set": { "objectName": "mo", "property": "taxableIncome" }, "get": { "form": "dMO1040A", "getElement": "TaxableIncome" }, "activeForm": "dMO1040A" },
                { "set": { "objectName": "mo", "property": "tax" }, "get": { "form": "dMO1040A", "getElement": "Tax" }, "activeForm": "dMO1040A" },
                { "set": { "objectName": "mo", "property": "credits" }, "get": { "form": "dMO1040A", "getElement": "" }, "activeForm": "dMO1040A" },
                { "set": { "objectName": "mo", "property": "payments" }, "get": { "form": "dMO1040A", "getElement": "TotalPaymentsCredits" }, "activeForm": "dMO1040A" },
                { "set": { "objectName": "mo", "property": "interstAndPenalties" }, "get": { "form": "dMO1040A", "getElement": "" }, "activeForm": "dMO1040A" },
                { "set": { "objectName": "mo", "property": "balanceDue" }, "get": { "form": "dMO1040A", "getElement": "AmountYouOwe" }, "activeForm": "dMO1040A" },
                { "set": { "objectName": "mo", "property": "refund" }, "get": { "form": "dMO1040A", "getElement": "Refund" }, "activeForm": "dMO1040A" },
                //Mapping for MO1040A

                //Mapping for MS 80105
                { "set": { "objectName": "ms", "property": "taxableIncome" }, "get": { "form": "dMS80105", "getElement": "MS80105Totaltaxableincome" }, "activeForm": "dMS80105" },
                { "set": { "objectName": "ms", "property": "tax" }, "get": { "form": "dMS80105", "getElement": "IncomeTaxDue" }, "activeForm": "dMS80105" },
                { "set": { "objectName": "ms", "property": "credits" }, "get": { "form": "dMS80105", "getElement": "MS80105Totalcredits" }, "activeForm": "dMS80105" },
                { "set": { "objectName": "ms", "property": "payments" }, "get": { "form": "dMS80105", "getElement": "TotalPayments" }, "activeForm": "dMS80105" },
                { "set": { "objectName": "ms", "property": "interstAndPenalties" }, "get": { "form": "dMS80105", "getElement": "UnderPaymentInterest" }, "activeForm": "dMS80105" },
                { "set": { "objectName": "ms", "property": "balanceDue" }, "get": { "form": "dMS80105", "getElement": "BalanceDue" }, "activeForm": "dMS80105" },
                { "set": { "objectName": "ms", "property": "refund" }, "get": { "form": "dMS80105", "getElement": "Refund" }, "activeForm": "dMS80105" },
                //Mapping for MS 80105

                //Mapping for MS 80205
                { "set": { "objectName": "ms", "property": "taxableIncome" }, "get": { "form": "dMS80205", "getElement": "MS80205Totaltaxableincome" }, "activeForm": "dMS80205" },
                { "set": { "objectName": "ms", "property": "tax" }, "get": { "form": "dMS80205", "getElement": "MS80205Totaltax" }, "activeForm": "dMS80205" },
                { "set": { "objectName": "ms", "property": "credits" }, "get": { "form": "dMS80205", "getElement": "OtherCredits" }, "activeForm": "dMS80205" },
                { "set": { "objectName": "ms", "property": "payments" }, "get": { "form": "dMS80205", "getElement": "MSTotalPayments" }, "activeForm": "dMS80205" },
                { "set": { "objectName": "ms", "property": "interstAndPenalties" }, "get": { "form": "dMS80205", "getElement": "LateInterestPenaltyAmount" }, "activeForm": "dMS80205" },
                { "set": { "objectName": "ms", "property": "balanceDue" }, "get": { "form": "dMS80205", "getElement": "BalanceDue" }, "activeForm": "dMS80205" },
                { "set": { "objectName": "ms", "property": "refund" }, "get": { "form": "dMS80205", "getElement": "Refund" }, "activeForm": "dMS80205" },
                //Mapping for MS 80205

                //Mapping for NC D400
                { "set": { "objectName": "nc", "property": "taxableIncome" }, "get": { "form": "dNCD400", "getElement": "NCTaxableInc" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "tax" }, "get": { "form": "dNCD400", "getElement": "NCD400TotalTax" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "credits" }, "get": { "form": "dNCD400", "getElement": "TaxCredits" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "payments" }, "get": { "form": "dNCD400", "getElement": "NCD400Totalpayment" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "interstAndPenalties" }, "get": { "form": "dNCD400", "getElement": "Penalties" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "interstAndPenalties1" }, "get": { "form": "dNCD400", "getElement": "Interest" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "balanceDue" }, "get": { "form": "dNCD400", "getElement": "TotalAmountDue" }, "activeForm": "dNCD400" },
                { "set": { "objectName": "nc", "property": "refund" }, "get": { "form": "dNCD400", "getElement": "RefundAmt" }, "activeForm": "dNCD400" },
                //Mapping for NC D400 End

                //Mapping for ND
                { "set": { "objectName": "nd", "property": "taxableIncome" }, "get": { "form": "dND1", "getElement": "NorthDakotataxableincome" }, "activeForm": "dND1" },
                { "set": { "objectName": "nd", "property": "tax" }, "get": { "form": "dND1", "getElement": "NDTax" }, "activeForm": "dND1" },
                { "set": { "objectName": "nd", "property": "credits" }, "get": { "form": "dND1", "getElement": "TotTaxCredits" }, "activeForm": "dND1" },
                { "set": { "objectName": "nd", "property": "payments" }, "get": { "form": "dND1", "getElement": "TotPayments" }, "activeForm": "dND1" },
                { "set": { "objectName": "nd", "property": "interstAndPenalties" }, "get": { "form": "dND1", "getElement": "PenaltyAndInterest" }, "activeForm": "dND1" },
                { "set": { "objectName": "nd", "property": "balanceDue" }, "get": { "form": "dND1", "getElement": "TaxDue" }, "activeForm": "dND1" },
                { "set": { "objectName": "nd", "property": "refund" }, "get": { "form": "dND1", "getElement": "NetRefund" }, "activeForm": "dND1" },
                //Mapping for ND End

                //Mapping for NE 1040N
                { "set": { "objectName": "ne", "property": "taxableIncome" }, "get": { "form": "dNE1040N", "getElement": "TaxTableIncome" }, "activeForm": "dNE1040N" },
                { "set": { "objectName": "ne", "property": "tax" }, "get": { "form": "dNE1040N", "getElement": "NE1040NTotalTax" }, "activeForm": "dNE1040N" },
                { "set": { "objectName": "ne", "property": "credits" }, "get": { "form": "dNE1040N", "getElement": "NE1040NTotalCredits" }, "activeForm": "dNE1040N" },
                { "set": { "objectName": "ne", "property": "payments" }, "get": { "form": "dNE1040N", "getElement": "NE1040NTotalPayments" }, "activeForm": "dNE1040N" },
                { "set": { "objectName": "ne", "property": "interstAndPenalties" }, "get": { "form": "dNE1040N", "getElement": "TaxPlusPenaltyAmount" }, "activeForm": "dNE1040N" },
                { "set": { "objectName": "ne", "property": "balanceDue" }, "get": { "form": "dNE1040N", "getElement": "AmountDue" }, "activeForm": "dNE1040N" },
                { "set": { "objectName": "ne", "property": "refund" }, "get": { "form": "dNE1040N", "getElement": "Refund" }, "activeForm": "dNE1040N" },
                //Mapping for NE 1040N End

                //Mapping for NE 1040XN
                { "set": { "objectName": "ne", "property": "taxableIncome" }, "get": { "form": "dNE1040XN", "getElement": "NE1040XNTotalTaxableIncome" }, "activeForm": "dNE1040XN" },
                { "set": { "objectName": "ne", "property": "tax" }, "get": { "form": "dNE1040XN", "getElement": "NE1040XNTotalTax" }, "activeForm": "dNE1040XN" },
                { "set": { "objectName": "ne", "property": "credits" }, "get": { "form": "dNE1040XN", "getElement": "NE1040XNTotalCredits" }, "activeForm": "dNE1040XN" },
                { "set": { "objectName": "ne", "property": "payments" }, "get": { "form": "dNE1040XN", "getElement": "NE1040XNTotalPayments" }, "activeForm": "dNE1040XN" },
                { "set": { "objectName": "ne", "property": "interstAndPenalties" }, "get": { "form": "dNE1040XN", "getElement": "NE1040XNTotalInterestandPenalties" }, "activeForm": "dNE1040XN" },
                { "set": { "objectName": "ne", "property": "balanceDue" }, "get": { "form": "dNE1040XN", "getElement": "NE1040XNTotalBalanceDue" }, "activeForm": "dNE1040XN" },
                { "set": { "objectName": "ne", "property": "refund" }, "get": { "form": "dNE1040XN", "getElement": "REFUND" }, "activeForm": "dNE1040XN" },
                //Mapping for NE 1040XN End

                //Mapping for NJ
                //NJ 1040
                { "set": { "objectName": "nj", "property": "taxableIncome" }, "get": { "form": "dNJ1040", "getElement": "NewJerseyTaxableIncome" }, "activeForm": "dNJ1040" },
                { "set": { "objectName": "nj", "property": "tax" }, "get": { "form": "dNJ1040", "getElement": "Tax" }, "activeForm": "dNJ1040" },
                { "set": { "objectName": "nj", "property": "credits" }, "get": { "form": "dNJ1040", "getElement": "NJ1040Totalcredits" }, "activeForm": "dNJ1040" },
                { "set": { "objectName": "nj", "property": "payments" }, "get": { "form": "dNJ1040", "getElement": "NJ1040Totalpayments" }, "activeForm": "dNJ1040" },
                { "set": { "objectName": "nj", "property": "interstAndPenalties" }, "get": { "form": "dNJ1040", "getElement": "PenalUnderpayOfEstTax" }, "activeForm": "dNJ1040" },
                { "set": { "objectName": "nj", "property": "balanceDue" }, "get": { "form": "dNJ1040", "getElement": "BalanceDueWithReturn" }, "activeForm": "dNJ1040" },
                { "set": { "objectName": "nj", "property": "refund" }, "get": { "form": "dNJ1040", "getElement": "NetRefund" }, "activeForm": "dNJ1040" },
                //NJ 1040

                //NJ 1040NR
                { "set": { "objectName": "nj", "property": "taxableIncome" }, "get": { "form": "dNJ1040NR", "getElement": "TaxableIncome" }, "activeForm": "dNJ1040NR" },
                { "set": { "objectName": "nj", "property": "tax" }, "get": { "form": "dNJ1040NR", "getElement": "Tax" }, "activeForm": "dNJ1040NR" },
                { "set": { "objectName": "nj", "property": "credits" }, "get": { "form": "dNJ1040NR", "getElement": "NJ1040NRTotalcredits" }, "activeForm": "dNJ1040NR" },
                { "set": { "objectName": "nj", "property": "payments" }, "get": { "form": "dNJ1040NR", "getElement": "NJ1040NRTotalpayments" }, "activeForm": "dNJ1040NR" },
                { "set": { "objectName": "nj", "property": "interstAndPenalties" }, "get": { "form": "dNJ1040NR", "getElement": "TotalTaxAndPenalty" }, "activeForm": "dNJ1040NR" },
                { "set": { "objectName": "nj", "property": "balanceDue" }, "get": { "form": "dNJ1040NR", "getElement": "BalanceOfTaxAfterCredit" }, "activeForm": "dNJ1040NR" },
                { "set": { "objectName": "nj", "property": "refund" }, "get": { "form": "dNJ1040NR", "getElement": "NetRefund" }, "activeForm": "dNJ1040NR" },
                //NJ 1040NR
                //Mapping for NJ End

                //Mapping for NM
                //NM PIT 1
                { "set": { "objectName": "nm", "property": "taxableIncome" }, "get": { "form": "dNMPIT1", "getElement": "StateTaxableIncome" }, "activeForm": "dNMPIT1" },
                { "set": { "objectName": "nm", "property": "tax" }, "get": { "form": "dNMPIT1", "getElement": "StateTaxOnTotalTaxableInc" }, "activeForm": "dNMPIT1" },
                { "set": { "objectName": "nm", "property": "credits" }, "get": { "form": "dNMPIT1", "getElement": "NMPIT1TotalCredits" }, "activeForm": "dNMPIT1" },
                { "set": { "objectName": "nm", "property": "payments" }, "get": { "form": "dNMPIT1", "getElement": "NMPIT1TotalPayments" }, "activeForm": "dNMPIT1" },
                { "set": { "objectName": "nm", "property": "interstAndPenalties" }, "get": { "form": "dNMPIT1", "getElement": "NMPIT1TotalInterestandpenlties" }, "activeForm": "dNMPIT1" },
                { "set": { "objectName": "nm", "property": "balanceDue" }, "get": { "form": "dNMPIT1", "getElement": "TaxMinusCreditsAndPayments" }, "activeForm": "dNMPIT1" },
                { "set": { "objectName": "nm", "property": "refund" }, "get": { "form": "dNMPIT1", "getElement": "NetRefund" }, "activeForm": "dNMPIT1" },
                //NM PIT 1

                //NM PIT X
                { "set": { "objectName": "nm", "property": "taxableIncome" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalTaxableIncome" }, "activeForm": "dNMPITX" },
                { "set": { "objectName": "nm", "property": "tax" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalTax" }, "activeForm": "dNMPITX" },
                { "set": { "objectName": "nm", "property": "credits" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalCredits" }, "activeForm": "dNMPITX" },
                { "set": { "objectName": "nm", "property": "payments" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalPaymets" }, "activeForm": "dNMPITX" },
                { "set": { "objectName": "nm", "property": "interstAndPenalties" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalInterestandPenalties" }, "activeForm": "dNMPITX" },
                { "set": { "objectName": "nm", "property": "balanceDue" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalBalanceDue" }, "activeForm": "dNMPITX" },
                { "set": { "objectName": "nm", "property": "refund" }, "get": { "form": "dNMPITX", "getElement": "NMPITXTotalRefund" }, "activeForm": "dNMPITX" },
                //NM PIT X
                //Mapping for NM End

                //Mapping for NY 
                //Mapping for NY IT 201
                { "set": { "objectName": "ny", "property": "taxableIncome" }, "get": { "form": "dNYIT201", "getElement": "Taxableincome" }, "activeForm": "dNYIT201" },
                { "set": { "objectName": "ny", "property": "tax" }, "get": { "form": "dNYIT201", "getElement": "NYIT201Totaltax" }, "activeForm": "dNYIT201" },
                { "set": { "objectName": "ny", "property": "credits" }, "get": { "form": "dNYIT201", "getElement": "NYIT201Totalcredits" }, "activeForm": "dNYIT201" },
                { "set": { "objectName": "ny", "property": "payments" }, "get": { "form": "dNYIT201", "getElement": "NYIT201Totalpayments" }, "activeForm": "dNYIT201" },
                { "set": { "objectName": "ny", "property": "interstAndPenalties" }, "get": { "form": "dNYIT201", "getElement": "ESTTXPNLTAMT2" }, "activeForm": "dNYIT201" },
                { "set": { "objectName": "ny", "property": "balanceDue" }, "get": { "form": "dNYIT201", "getElement": "BALDUEAMT2" }, "activeForm": "dNYIT201" },
                { "set": { "objectName": "ny", "property": "refund" }, "get": { "form": "dNYIT201", "getElement": "RFNDAMT2" }, "activeForm": "dNYIT201" },
                //Mapping for NY IT 201 end

                //Mapping for NY IT 203
                { "set": { "objectName": "ny", "property": "taxableIncome" }, "get": { "form": "dNYIT203", "getElement": "NYtaxableincome" }, "activeForm": "dNYIT203" },
                { "set": { "objectName": "ny", "property": "tax" }, "get": { "form": "dNYIT203", "getElement": "NYIT203Totaltax" }, "activeForm": "dNYIT203" },
                { "set": { "objectName": "ny", "property": "credits" }, "get": { "form": "dNYIT203", "getElement": "NYIT203Totalcredits" }, "activeForm": "dNYIT203" },
                { "set": { "objectName": "ny", "property": "payments" }, "get": { "form": "dNYIT203", "getElement": "NYIT203Totalpayments" }, "activeForm": "dNYIT203" },
                { "set": { "objectName": "ny", "property": "interstAndPenalties" }, "get": { "form": "dNYIT203", "getElement": "ESTTXPNLTAMT2" }, "activeForm": "dNYIT203" },
                { "set": { "objectName": "ny", "property": "balanceDue" }, "get": { "form": "dNYIT203", "getElement": "BALDUEAMT2" }, "activeForm": "dNYIT203" },
                { "set": { "objectName": "ny", "property": "refund" }, "get": { "form": "dNYIT203", "getElement": "RFNDAMT2" }, "activeForm": "dNYIT203" },
                //Mapping for NY IT 203 end

                //Mapping for NY IT 203x
                { "set": { "objectName": "ny", "property": "taxableIncome" }, "get": { "form": "dNYIT203X", "getElement": "taxableincome" }, "activeForm": "dNYIT203X" },
                { "set": { "objectName": "ny", "property": "tax" }, "get": { "form": "dNYIT203X", "getElement": "NYIT203XTotaltax" }, "activeForm": "dNYIT203X" },
                { "set": { "objectName": "ny", "property": "credits" }, "get": { "form": "dNYIT203X", "getElement": "NYIT203XTotalcredits" }, "activeForm": "dNYIT203X" },
                { "set": { "objectName": "ny", "property": "payments" }, "get": { "form": "dNYIT203X", "getElement": "NYIT203XTotalpayments" }, "activeForm": "dNYIT203X" },
                { "set": { "objectName": "ny", "property": "interstAndPenalties" }, "get": { "form": "dNYIT203X", "getElement": "" }, "activeForm": "dNYIT203X" },
                { "set": { "objectName": "ny", "property": "balanceDue" }, "get": { "form": "dNYIT203X", "getElement": "Amountyouowe" }, "activeForm": "dNYIT203X" },
                { "set": { "objectName": "ny", "property": "refund" }, "get": { "form": "dNYIT203X", "getElement": "Yourrefund" }, "activeForm": "dNYIT203X" },
                //Mapping for NY IT 203x end

                //Mapping for NYIT201X
                { "set": { "objectName": "ny", "property": "taxableIncome" }, "get": { "form": "dNYIT201X", "getElement": "Taxableincome1" }, "activeForm": "dNYIT201X" },
                { "set": { "objectName": "ny", "property": "tax" }, "get": { "form": "dNYIT201X", "getElement": "NYIT201XTotaltax" }, "activeForm": "dNYIT201X" },
                { "set": { "objectName": "ny", "property": "credits" }, "get": { "form": "dNYIT201X", "getElement": "NYIT201XTotalcredits" }, "activeForm": "dNYIT201X" },
                { "set": { "objectName": "ny", "property": "payments" }, "get": { "form": "dNYIT201X", "getElement": "NYIT201XTotalpayments" }, "activeForm": "dNYIT201X" },
                { "set": { "objectName": "ny", "property": "interstAndPenalties" }, "get": { "form": "dNYIT201X", "getElement": "" }, "activeForm": "dNYIT201X" },
                { "set": { "objectName": "ny", "property": "balanceDue" }, "get": { "form": "dNYIT201X", "getElement": "Amountyouowe" }, "activeForm": "dNYIT201X" },
                { "set": { "objectName": "ny", "property": "refund" }, "get": { "form": "dNYIT201X", "getElement": "YrRefund" }, "activeForm": "dNYIT201X" },
                //Mapping for NYIT201X
                //Mapping for NY END

                //Mapping for OH
                //Mapping for OH SD100
                { "set": { "objectName": "oh", "property": "taxableIncome" }, "get": { "form": "dOHSD100", "getElement": "TaxableIncome" }, "activeForm": "dOHSD100" },
                { "set": { "objectName": "oh", "property": "tax" }, "get": { "form": "dOHSD100", "getElement": "TaxAmount" }, "activeForm": "dOHSD100" },
                { "set": { "objectName": "oh", "property": "credits" }, "get": { "form": "dOHSD100", "getElement": "SeniorCitizenCredit" }, "activeForm": "dOHSD100" },
                { "set": { "objectName": "oh", "property": "payments" }, "get": { "form": "dOHSD100", "getElement": "TotalPayments" }, "activeForm": "dOHSD100" },
                { "set": { "objectName": "oh", "property": "interstAndPenalties" }, "get": { "form": "dOHSD100", "getElement": "IntandPenalty" }, "activeForm": "dOHSD100" },
                { "set": { "objectName": "oh", "property": "balanceDue" }, "get": { "form": "dOHSD100", "getElement": "BalanceDue" }, "activeForm": "dOHSD100" },
                { "set": { "objectName": "oh", "property": "refund" }, "get": { "form": "dOHSD100", "getElement": "Refund" }, "activeForm": "dOHSD100" },
                //Mapping for OH SD100 End
                //Mapping for OH IT 1040
                { "set": { "objectName": "oh", "property": "taxableIncome" }, "get": { "form": "dOHIT1040", "getElement": "TaxableIncome" }, "activeForm": "dOHIT1040" },
                { "set": { "objectName": "oh", "property": "tax" }, "get": { "form": "dOHIT1040", "getElement": "TotalTaxLiability" }, "activeForm": "dOHIT1040" },
                { "set": { "objectName": "oh", "property": "credits" }, "get": { "form": "dOHIT1040", "getElement": "CreditAmount" }, "activeForm": "dOHIT1040" },
                { "set": { "objectName": "oh", "property": "payments" }, "get": { "form": "dOHIT1040", "getElement": "TotalPymt" }, "activeForm": "dOHIT1040" },
                { "set": { "objectName": "oh", "property": "interstAndPenalties" }, "get": { "form": "dOHIT1040", "getElement": "INTERESTANDPENALTY" }, "activeForm": "dOHIT1040" },
                { "set": { "objectName": "oh", "property": "balanceDue" }, "get": { "form": "dOHIT1040", "getElement": "AMOUNTDUEPLUSINTERESTANDPENALTY" }, "activeForm": "dOHIT1040" },
                { "set": { "objectName": "oh", "property": "refund" }, "get": { "form": "dOHIT1040", "getElement": "YOURREFUND" }, "activeForm": "dOHIT1040" },
                //Mapping for OH IT 1040 End
                //Mapping for OH END

                //Mapping for OK
                //OK 511NR
                { "set": { "objectName": "ok", "property": "taxableIncome" }, "get": { "form": "dOK511NR", "getElement": "TaxableIncome" }, "activeForm": "dOK511NR" },
                { "set": { "objectName": "ok", "property": "tax" }, "get": { "form": "dOK511NR", "getElement": "OK511NRTotaltax" }, "activeForm": "dOK511NR" },
                { "set": { "objectName": "ok", "property": "credits" }, "get": { "form": "dOK511NR", "getElement": "OK511NRTotalcredits" }, "activeForm": "dOK511NR" },
                { "set": { "objectName": "ok", "property": "payments" }, "get": { "form": "dOK511NR", "getElement": "OK511NRTotalpayments" }, "activeForm": "dOK511NR" },
                { "set": { "objectName": "ok", "property": "interstAndPenalties" }, "get": { "form": "dOK511NR", "getElement": "TotalTaxPenaltyInterest" }, "activeForm": "dOK511NR" },
                { "set": { "objectName": "ok", "property": "balanceDue" }, "get": { "form": "dOK511NR", "getElement": "TaxDue" }, "activeForm": "dOK511NR" },
                { "set": { "objectName": "ok", "property": "refund" }, "get": { "form": "dOK511NR", "getElement": "RefundAmount" }, "activeForm": "dOK511NR" },
                //OK 511NR

                //OK 511
                { "set": { "objectName": "ok", "property": "taxableIncome" }, "get": { "form": "dOK511", "getElement": "TaxableIncome" }, "activeForm": "dOK511" },
                { "set": { "objectName": "ok", "property": "tax" }, "get": { "form": "dOK511", "getElement": "OK511Totaltax" }, "activeForm": "dOK511" },
                { "set": { "objectName": "ok", "property": "credits" }, "get": { "form": "dOK511", "getElement": "OK511Totalcredits" }, "activeForm": "dOK511" },
                { "set": { "objectName": "ok", "property": "payments" }, "get": { "form": "dOK511", "getElement": "OK511Totalpayments" }, "activeForm": "dOK511" },
                { "set": { "objectName": "ok", "property": "interstAndPenalties" }, "get": { "form": "dOK511", "getElement": "TotalTaxPenaltyInterest" }, "activeForm": "dOK511" },
                { "set": { "objectName": "ok", "property": "balanceDue" }, "get": { "form": "dOK511", "getElement": "TaxDue" }, "activeForm": "dOK511" },
                { "set": { "objectName": "ok", "property": "refund" }, "get": { "form": "dOK511", "getElement": "RefundAmount" }, "activeForm": "dOK511" },
                //OK 511
                //Mapping for Ok End

                //Mapping for OR
                //OR 40
                { "set": { "objectName": "or", "property": "taxableIncome" }, "get": { "form": "dOR40", "getElement": "StateTaxableIncome" }, "activeForm": "dOR40" },
                { "set": { "objectName": "or", "property": "tax" }, "get": { "form": "dOR40", "getElement": "OR40Totaltax" }, "activeForm": "dOR40" },
                { "set": { "objectName": "or", "property": "credits" }, "get": { "form": "dOR40", "getElement": "OR40TotalCredits" }, "activeForm": "dOR40" },
                { "set": { "objectName": "or", "property": "payments" }, "get": { "form": "dOR40", "getElement": "OR40TotalPayment" }, "activeForm": "dOR40" },
                { "set": { "objectName": "or", "property": "interstAndPenalties" }, "get": { "form": "dOR40", "getElement": "TotalPenaltyAndInterest" }, "activeForm": "dOR40" },
                { "set": { "objectName": "or", "property": "balanceDue" }, "get": { "form": "dOR40", "getElement": "AmountYouOwe" }, "activeForm": "dOR40" },
                { "set": { "objectName": "or", "property": "refund" }, "get": { "form": "dOR40", "getElement": "NetRefund" }, "activeForm": "dOR40" },
                //OR 40 End   

                //OR 40P
                { "set": { "objectName": "or", "property": "taxableIncome" }, "get": { "form": "dOR40P", "getElement": "StateTaxableIncome" }, "activeForm": "dOR40P" },
                { "set": { "objectName": "or", "property": "tax" }, "get": { "form": "dOR40P", "getElement": "OR40PTotalTax" }, "activeForm": "dOR40P" },
                { "set": { "objectName": "or", "property": "credits" }, "get": { "form": "dOR40P", "getElement": "OR40PTotalCredits" }, "activeForm": "dOR40P" },
                { "set": { "objectName": "or", "property": "payments" }, "get": { "form": "dOR40P", "getElement": "OR40PTotalPayment" }, "activeForm": "dOR40P" },
                { "set": { "objectName": "or", "property": "interstAndPenalties" }, "get": { "form": "dOR40P", "getElement": "TotalPenaltyAndInterest" }, "activeForm": "dOR40P" },
                { "set": { "objectName": "or", "property": "balanceDue" }, "get": { "form": "dOR40P", "getElement": "AmountYouOwe" }, "activeForm": "dOR40P" },
                { "set": { "objectName": "or", "property": "refund" }, "get": { "form": "dOR40P", "getElement": "Refund" }, "activeForm": "dOR40P" },
                //OR 40P End 

                //OR 40N
                { "set": { "objectName": "or", "property": "taxableIncome" }, "get": { "form": "dOR40N", "getElement": "StateTaxableIncome" }, "activeForm": "dOR40N" },
                { "set": { "objectName": "or", "property": "tax" }, "get": { "form": "dOR40N", "getElement": "OR40NTotaltax" }, "activeForm": "dOR40N" },
                { "set": { "objectName": "or", "property": "credits" }, "get": { "form": "dOR40N", "getElement": "OR40NTotalCredits" }, "activeForm": "dOR40N" },
                { "set": { "objectName": "or", "property": "payments" }, "get": { "form": "dOR40N", "getElement": "OR40NTotalpayment" }, "activeForm": "dOR40N" },
                { "set": { "objectName": "or", "property": "interstAndPenalties" }, "get": { "form": "dOR40N", "getElement": "TotalPenaltyAndInterest" }, "activeForm": "dOR40N" },
                { "set": { "objectName": "or", "property": "balanceDue" }, "get": { "form": "dOR40N", "getElement": "AmountYouOwe" }, "activeForm": "dOR40N" },
                { "set": { "objectName": "or", "property": "refund" }, "get": { "form": "dOR40N", "getElement": "Refund" }, "activeForm": "dOR40N" },
                //OR 40N End 
                //Mapping for OR End

                //Mapping for PA End
                { "set": { "objectName": "pa", "property": "taxableIncome" }, "get": { "form": "dPA40", "getElement": "AdjPATaxInc" }, "activeForm": "dPA40" },
                { "set": { "objectName": "pa", "property": "tax" }, "get": { "form": "dPA40", "getElement": "PA40Totaltax" }, "activeForm": "dPA40" },
                { "set": { "objectName": "pa", "property": "credits" }, "get": { "form": "dPA40", "getElement": "PA40Totalcredit" }, "activeForm": "dPA40" },
                { "set": { "objectName": "pa", "property": "payments" }, "get": { "form": "dPA40", "getElement": "PA40Totalpayments" }, "activeForm": "dPA40" },
                { "set": { "objectName": "pa", "property": "interstAndPenalties" }, "get": { "form": "dPA40", "getElement": "PenInt" }, "activeForm": "dPA40" },
                { "set": { "objectName": "pa", "property": "balanceDue" }, "get": { "form": "dPA40", "getElement": "TaxDue" }, "activeForm": "dPA40" },
                { "set": { "objectName": "pa", "property": "refund" }, "get": { "form": "dPA40", "getElement": "Refund" }, "activeForm": "dPA40" },
                //Mapping for PA End

                //Mapping for RI
                //RI1040NR
                { "set": { "objectName": "ri", "property": "taxableIncome" }, "get": { "form": "dRI1040NR", "getElement": "TaxableIncome" }, "activeForm": "dRI1040NR" },
                { "set": { "objectName": "ri", "property": "tax" }, "get": { "form": "dRI1040NR", "getElement": "RI1040NRTotalTax" }, "activeForm": "dRI1040NR" },
                { "set": { "objectName": "ri", "property": "credits" }, "get": { "form": "dRI1040NR", "getElement": "RI1040NRTotalCredits" }, "activeForm": "dRI1040NR" },
                { "set": { "objectName": "ri", "property": "payments" }, "get": { "form": "dRI1040NR", "getElement": "RI1040NRTotalPayments" }, "activeForm": "dRI1040NR" },
                { "set": { "objectName": "ri", "property": "interstAndPenalties" }, "get": { "form": "dRI1040NR", "getElement": "InterestRI2210Amt" }, "activeForm": "dRI1040NR" },
                { "set": { "objectName": "ri", "property": "balanceDue" }, "get": { "form": "dRI1040NR", "getElement": "AmtDue" }, "activeForm": "dRI1040NR" },
                { "set": { "objectName": "ri", "property": "refund" }, "get": { "form": "dRI1040NR", "getElement": "RefundAmt" }, "activeForm": "dRI1040NR" },
                //RI1040NR End

                //RI 1040L
                { "set": { "objectName": "ri", "property": "taxableIncome" }, "get": { "form": "dRI1040L", "getElement": "TaxableIncome" }, "activeForm": "dRI1040L" },
                { "set": { "objectName": "ri", "property": "tax" }, "get": { "form": "dRI1040L", "getElement": "RI1040LTotalTax" }, "activeForm": "dRI1040L" },
                { "set": { "objectName": "ri", "property": "credits" }, "get": { "form": "dRI1040L", "getElement": "RI1040LTotalCredits" }, "activeForm": "dRI1040L" },
                { "set": { "objectName": "ri", "property": "payments" }, "get": { "form": "dRI1040L", "getElement": "RI1040LTotalPayments" }, "activeForm": "dRI1040L" },
                { "set": { "objectName": "ri", "property": "interstAndPenalties" }, "get": { "form": "dRI1040L", "getElement": "InterestRI2210Amt" }, "activeForm": "dRI1040L" },
                { "set": { "objectName": "ri", "property": "balanceDue" }, "get": { "form": "dRI1040L", "getElement": "TotalAmtDue" }, "activeForm": "dRI1040L" },
                { "set": { "objectName": "ri", "property": "refund" }, "get": { "form": "dRI1040L", "getElement": "RefundAmt" }, "activeForm": "dRI1040L" },
                //RI 1040L End	                   		
                //Mapping for RI End

                //Mapping for SC End
                { "set": { "objectName": "sc", "property": "taxableIncome" }, "get": { "form": "dSC1040", "getElement": "IncomeSubjectTax" }, "activeForm": "dSC1040" },
                { "set": { "objectName": "sc", "property": "tax" }, "get": { "form": "dSC1040", "getElement": "TotalTax" }, "activeForm": "dSC1040" },
                { "set": { "objectName": "sc", "property": "credits" }, "get": { "form": "dSC1040", "getElement": "SC1040Totalcredits" }, "activeForm": "dSC1040" },
                { "set": { "objectName": "sc", "property": "payments" }, "get": { "form": "dSC1040", "getElement": "SC1040Toatalpayments" }, "activeForm": "dSC1040" },
                { "set": { "objectName": "sc", "property": "interstAndPenalties" }, "get": { "form": "dSC1040", "getElement": "LateTotalDue" }, "activeForm": "dSC1040" },
                { "set": { "objectName": "sc", "property": "balanceDue" }, "get": { "form": "dSC1040", "getElement": "NetDue" }, "activeForm": "dSC1040" },
                { "set": { "objectName": "sc", "property": "refund" }, "get": { "form": "dSC1040", "getElement": "NetRefund" }, "activeForm": "dSC1040" },
                //Mapping for SC End

                //Mapping for VA
                //VA 760 PY
                { "set": { "objectName": "va", "property": "taxableIncome" }, "get": { "form": "dVA760PY", "getElement": "VA760PYTotalTaxableIncome" }, "activeForm": "dVA760PY" },
                { "set": { "objectName": "va", "property": "tax" }, "get": { "form": "dVA760PY", "getElement": "VA760PYTotalTax" }, "activeForm": "dVA760PY" },
                { "set": { "objectName": "va", "property": "credits" }, "get": { "form": "dVA760PY", "getElement": "VA760PYTotalCredits" }, "activeForm": "dVA760PY" },
                { "set": { "objectName": "va", "property": "payments" }, "get": { "form": "dVA760PY", "getElement": "VA760PYTotalPayments" }, "activeForm": "dVA760PY" },
                { "set": { "objectName": "va", "property": "interstAndPenalties" }, "get": { "form": "dVA760PY", "getElement": "AdjAndVolContribSch760PYADJ" }, "activeForm": "dVA760PY" },
                { "set": { "objectName": "va", "property": "balanceDue" }, "get": { "form": "dVA760PY", "getElement": "AmtYouOwe" }, "activeForm": "dVA760PY" },
                { "set": { "objectName": "va", "property": "refund" }, "get": { "form": "dVA760PY", "getElement": "AmountOfRefund" }, "activeForm": "dVA760PY" },
                //VA 760 PY End   

                //VA 763
                { "set": { "objectName": "va", "property": "taxableIncome" }, "get": { "form": "dVA763", "getElement": "NonresidentTaxableIncm" }, "activeForm": "dVA763" },
                { "set": { "objectName": "va", "property": "tax" }, "get": { "form": "dVA763", "getElement": "VA763Totaltax" }, "activeForm": "dVA763" },
                { "set": { "objectName": "va", "property": "credits" }, "get": { "form": "dVA763", "getElement": "VA763Totalcredits" }, "activeForm": "dVA763" },
                { "set": { "objectName": "va", "property": "payments" }, "get": { "form": "dVA763", "getElement": "VA763Totalpayments" }, "activeForm": "dVA763" },
                { "set": { "objectName": "va", "property": "interstAndPenalties" }, "get": { "form": "dVA763", "getElement": "AdjustmentsContributions" }, "activeForm": "dVA763" },
                { "set": { "objectName": "va", "property": "balanceDue" }, "get": { "form": "dVA763", "getElement": "AmtYouOwe" }, "activeForm": "dVA763" },
                { "set": { "objectName": "va", "property": "refund" }, "get": { "form": "dVA763", "getElement": "Refund" }, "activeForm": "dVA763" },
                //VA 763 End 

                //VA 760
                { "set": { "objectName": "va", "property": "taxableIncome" }, "get": { "form": "dVA760", "getElement": "VATaxableIncm" }, "activeForm": "dVA760" },
                { "set": { "objectName": "va", "property": "tax" }, "get": { "form": "dVA760", "getElement": "VA760Totaltax" }, "activeForm": "dVA760" },
                { "set": { "objectName": "va", "property": "credits" }, "get": { "form": "dVA760", "getElement": "VA760Totalcredits" }, "activeForm": "dVA760" },
                { "set": { "objectName": "va", "property": "payments" }, "get": { "form": "dVA760", "getElement": "VA760Totalpayment" }, "activeForm": "dVA760" },
                { "set": { "objectName": "va", "property": "interstAndPenalties" }, "get": { "form": "dVA760", "getElement": "AdditionTaxPenInt" }, "activeForm": "dVA760" },
                { "set": { "objectName": "va", "property": "balanceDue" }, "get": { "form": "dVA760", "getElement": "AmtYouOwe" }, "activeForm": "dVA760" },
                { "set": { "objectName": "va", "property": "refund" }, "get": { "form": "dVA760", "getElement": "YourRefund" }, "activeForm": "dVA760" },
                //VA 760 End 
                //Mapping for VA End

                //Mapping for VTIN 111
                { "set": { "objectName": "vt", "property": "taxableIncome" }, "get": { "form": "dVTIN111", "getElement": "VTTaxableIncome" }, "activeForm": "dVTIN111" },
                { "set": { "objectName": "vt", "property": "tax" }, "get": { "form": "dVTIN111", "getElement": "VTIN111Totaltax" }, "activeForm": "dVTIN111" },
                { "set": { "objectName": "vt", "property": "credits" }, "get": { "form": "dVTIN111", "getElement": "VTIN111Totalcredits" }, "activeForm": "dVTIN111" },
                { "set": { "objectName": "vt", "property": "payments" }, "get": { "form": "dVTIN111", "getElement": "VTIN111Totalpayments" }, "activeForm": "dVTIN111" },
                { "set": { "objectName": "vt", "property": "interstAndPenalties" }, "get": { "form": "dVTIN111", "getElement": "UnderpaymentPenaltyInterest" }, "activeForm": "dVTIN111" },
                { "set": { "objectName": "vt", "property": "balanceDue" }, "get": { "form": "dVTIN111", "getElement": "TotalBalanceDue" }, "activeForm": "dVTIN111" },
                { "set": { "objectName": "vt", "property": "refund" }, "get": { "form": "dVTIN111", "getElement": "RefundAmount" }, "activeForm": "dVTIN111" },
                //Mapping for VTIN 111 End

                //Mapping for WI 
                //WI Form 1NPR
                { "set": { "objectName": "wi", "property": "taxableIncome" }, "get": { "form": "dWI1NPR", "getElement": "StateTaxableIncome" }, "activeForm": "dWI1NPR" },
                { "set": { "objectName": "wi", "property": "tax" }, "get": { "form": "dWI1NPR", "getElement": "WIFORM1NPRTotalTax" }, "activeForm": "dWI1NPR" },
                { "set": { "objectName": "wi", "property": "credits" }, "get": { "form": "dWI1NPR", "getElement": "WIFORM1NPRTotalCredits" }, "activeForm": "dWI1NPR" },
                { "set": { "objectName": "wi", "property": "payments" }, "get": { "form": "dWI1NPR", "getElement": "WIFORM1NPRTotalPayments" }, "activeForm": "dWI1NPR" },
                { "set": { "objectName": "wi", "property": "interstAndPenalties" }, "get": { "form": "dWI1NPR", "getElement": "UnderpaymentInterestCode" }, "activeForm": "dWI1NPR" },
                { "set": { "objectName": "wi", "property": "balanceDue" }, "get": { "form": "dWI1NPR", "getElement": "BalanceDueWithReturn" }, "activeForm": "dWI1NPR" },
                { "set": { "objectName": "wi", "property": "refund" }, "get": { "form": "dWI1NPR", "getElement": "NetRefund" }, "activeForm": "dWI1NPR" },
                //WI Form 1NPR end

                //WI 1A
                { "set": { "objectName": "wi", "property": "taxableIncome" }, "get": { "form": "dWI1A", "getElement": "StateTaxableIncome" }, "activeForm": "dWI1A" },
                { "set": { "objectName": "wi", "property": "tax" }, "get": { "form": "dWI1A", "getElement": "WI1ATotalTax" }, "activeForm": "dWI1A" },
                { "set": { "objectName": "wi", "property": "credits" }, "get": { "form": "dWI1A", "getElement": "WI1ATotalCredits" }, "activeForm": "dWI1A" },
                { "set": { "objectName": "wi", "property": "payments" }, "get": { "form": "dWI1A", "getElement": "WI1ATotalPayments" }, "activeForm": "dWI1A" },
                { "set": { "objectName": "wi", "property": "interstAndPenalties" }, "get": { "form": "dWI1A", "getElement": "UnderpaymentInterestCode" }, "activeForm": "dWI1A" },
                { "set": { "objectName": "wi", "property": "balanceDue" }, "get": { "form": "dWI1A", "getElement": "BalanceDueWithReturn" }, "activeForm": "dWI1A" },
                { "set": { "objectName": "wi", "property": "refund" }, "get": { "form": "dWI1A", "getElement": "NetRefund" }, "activeForm": "dWI1A" },
                //WI 1A end

                //WI Z
                { "set": { "objectName": "wi", "property": "taxableIncome" }, "get": { "form": "dWIZ", "getElement": "StateTaxableIncome" }, "activeForm": "dWIZ" },
                { "set": { "objectName": "wi", "property": "tax" }, "get": { "form": "dWIZ", "getElement": "WIZTotalTax" }, "activeForm": "dWIZ" },
                { "set": { "objectName": "wi", "property": "credits" }, "get": { "form": "dWIZ", "getElement": "Addcredits" }, "activeForm": "dWIZ" },
                { "set": { "objectName": "wi", "property": "payments" }, "get": { "form": "dWIZ", "getElement": "TaxWithheld" }, "activeForm": "dWIZ" },
                { "set": { "objectName": "wi", "property": "interstAndPenalties" }, "get": { "form": "dWIZ", "getElement": "" }, "activeForm": "dWIZ" },
                { "set": { "objectName": "wi", "property": "balanceDue" }, "get": { "form": "dWIZ", "getElement": "BalanceDueWithReturn" }, "activeForm": "dWIZ" },
                { "set": { "objectName": "wi", "property": "refund" }, "get": { "form": "dWIZ", "getElement": "NetRefund" }, "activeForm": "dWIZ" },
                //WI Z end

                //WI Form 1
                { "set": { "objectName": "wi", "property": "taxableIncome" }, "get": { "form": "dWI1", "getElement": "StateTaxableIncome" }, "activeForm": "dWI1" },
                { "set": { "objectName": "wi", "property": "tax" }, "get": { "form": "dWI1", "getElement": "WIForm1TotalTax" }, "activeForm": "dWI1" },
                { "set": { "objectName": "wi", "property": "credits" }, "get": { "form": "dWI1", "getElement": "WIForm1TotalCredits" }, "activeForm": "dWI1" },
                { "set": { "objectName": "wi", "property": "payments" }, "get": { "form": "dWI1", "getElement": "WIForm1TotalPayments" }, "activeForm": "dWI1" },
                { "set": { "objectName": "wi", "property": "interstAndPenalties" }, "get": { "form": "dWI1", "getElement": "WIForm1TotalInterestandPenalties" }, "activeForm": "dWI1" },
                { "set": { "objectName": "wi", "property": "balanceDue" }, "get": { "form": "dWI1", "getElement": "BalanceDueWithReturn" }, "activeForm": "dWI1" },
                { "set": { "objectName": "wi", "property": "refund" }, "get": { "form": "dWI1", "getElement": "NetRefund" }, "activeForm": "dWI1" },
                //WI Form 1

                //WI Form 1X
                { "set": { "objectName": "wi", "property": "taxableIncome" }, "get": { "form": "dWI1X", "getElement": "StateTaxableIncome" }, "activeForm": "dWI1X" },
                { "set": { "objectName": "wi", "property": "tax" }, "get": { "form": "dWI1X", "getElement": "WIForm1XTotalTax" }, "activeForm": "dWI1X" },
                { "set": { "objectName": "wi", "property": "credits" }, "get": { "form": "dWI1X", "getElement": "WIForm1XTotalCredits" }, "activeForm": "dWI1X" },
                { "set": { "objectName": "wi", "property": "payments" }, "get": { "form": "dWI1X", "getElement": "WIForm1XTotalPayments" }, "activeForm": "dWI1X" },
                { "set": { "objectName": "wi", "property": "interstAndPenalties" }, "get": { "form": "dWI1X", "getElement": "WIForm1XTotalInterestandPenalties" }, "activeForm": "dWI1X" },
                { "set": { "objectName": "wi", "property": "balanceDue" }, "get": { "form": "dWI1X", "getElement": "TotalAmountDue" }, "activeForm": "dWI1X" },
                { "set": { "objectName": "wi", "property": "refund" }, "get": { "form": "dWI1X", "getElement": "RequestedRefund" }, "activeForm": "dWI1X" },
                //WI Form 1X
                //Mapping for WI END

                //Mapping for WV IT-140
                { "set": { "objectName": "wv", "property": "taxableIncome" }, "get": { "form": "dWVIT140", "getElement": "WVTaxableIncome" }, "activeForm": "dWVIT140" },
                { "set": { "objectName": "wv", "property": "tax" }, "get": { "form": "dWVIT140", "getElement": "IncomeTaxDue" }, "activeForm": "dWVIT140" },
                { "set": { "objectName": "wv", "property": "credits" }, "get": { "form": "dWVIT140", "getElement": "WV140Totalcredits" }, "activeForm": "dWVIT140" },
                { "set": { "objectName": "wv", "property": "payments" }, "get": { "form": "dWVIT140", "getElement": "WV140Totalpayments" }, "activeForm": "dWVIT140" },
                { "set": { "objectName": "wv", "property": "interstAndPenalties" }, "get": { "form": "dWVIT140", "getElement": "UnderpaymentPenaltyAmount" }, "activeForm": "dWVIT140" },
                { "set": { "objectName": "wv", "property": "balanceDue" }, "get": { "form": "dWVIT140", "getElement": "TotalAmountDue" }, "activeForm": "dWVIT140" },
                { "set": { "objectName": "wv", "property": "refund" }, "get": { "form": "dWVIT140", "getElement": "RefundDueYou" }, "activeForm": "dWVIT140" },
                //Mapping for WV IT-140 End

                //Mapping for 1040 State end
                //Mapping for 1040 end

                //Mapping for 1065 start
                //Mapping of partnership block start
                { "set": { "objectName": "partnership", "property": "ein" }, "get": { "form": "header", "usrDetail": "client", "getElement": "ein" } },
                { "set": { "objectName": "partnership", "property": "companyName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "companyName" } },
                { "set": { "objectName": "partnership", "property": "usStreet" }, "get": { "form": "d1065CIS", "getElement": "USStreet" } },
                { "set": { "objectName": "partnership", "property": "usCity" }, "get": { "form": "d1065CIS", "getElement": "USCity" } },
                { "set": { "objectName": "partnership", "property": "usState" }, "get": { "form": "d1065CIS", "getElement": "USState" } },
                { "set": { "objectName": "partnership", "property": "usZipCode" }, "get": { "form": "d1065CIS", "getElement": "USZip" } },
                { "set": { "objectName": "partnership", "property": "fgStreet" }, "get": { "form": "d1065CIS", "getElement": "FGStreet" } },
                { "set": { "objectName": "partnership", "property": "fgCity" }, "get": { "form": "d1065CIS", "getElement": "FGCityStateZip" } },
                { "set": { "objectName": "partnership", "property": "fgState" }, "get": { "form": "d1065CIS", "getElement": "FGProvinceOrState" } },
                { "set": { "objectName": "partnership", "property": "fgPostalCode" }, "get": { "form": "d1065CIS", "getElement": "FGPostalCode" } },
                { "set": { "objectName": "partnership", "property": "fgCountry" }, "get": { "form": "d1065CIS", "getElement": "FGCountry" } },
                { "set": { "objectName": "partnership", "property": "phoneNo" }, "get": { "form": "d1065CIS", "getElement": "Phone" } },

                //preparer block in more quick return summary start
                { "set": { "objectName": "preparer", "property": "preparerId" }, "get": { "form": "d1065RIS", "getElement": "PrepareID" } },
                { "set": { "objectName": "preparer", "property": "name" }, "get": { "form": "d1065RIS", "getElement": "PrepareName" } },
                { "set": { "objectName": "preparer", "property": "ssn" }, "get": { "form": "d1065RIS", "getElement": "PrepareSSN" } },
                { "set": { "objectName": "preparer", "property": "ptin" }, "get": { "form": "d1065RIS", "getElement": "PreparePTIN" } },
                { "set": { "objectName": "preparer", "property": "ein" }, "get": { "form": "d1065RIS", "getElement": "PrepareEIN" } },
                { "set": { "objectName": "preparer", "property": "telephoneNo" }, "get": { "form": "d1065RIS", "getElement": "PreparePhone" } },
                { "set": { "objectName": "preparer", "property": "email" }, "get": { "form": "d1065RIS", "getElement": "PrepareEmail" } },
                //preparer block in more quick return summary end

                //Bank block in more quick return summary start
                { "set": { "objectName": "bank", "property": "name" }, "get": { "form": "d1065RIS", "getElement": "" } },
                { "set": { "objectName": "bank", "property": "accountNo" }, "get": { "form": "d1065RIS", "getElement": "strdan" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "d1065RIS", "getElement": "blnsavingacc" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "d1065RIS", "getElement": "blncurracc" } },
                { "set": { "objectName": "bank", "property": "rtn" }, "get": { "form": "d1065RIS", "getElement": "strrtn" } },
                //Bank block in more quick return summary end

                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1065", "getElement": "SubtractLine1dFromLine1c" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1065", "getElement": "OrdinaryIncomeLoss" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1065", "getElement": "NetGainLoss" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1065", "getElement": "NetFarmProfitLoss" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1065", "getElement": "OtherIncomeLoss" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1065", "getElement": "TotalIncomeLoss" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1065", "getElement": "TotalDeductions" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1065", "getElement": "OrdinaryBusinessIncomeLoss" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1065", "getElement": "OrdinaryBusinessIncomeLoss" }, "mainForm": "1065" },
                //Income block end

                //Credit block for 1065 start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "dSchR", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "dSchR", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1065", "getElement": "" }, "mainForm": "1065" },
                //Payment block end
                //Mapping for 1065 end

                //Mapping for 1065B Start
                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1065B", "getElement": "GrossReceiptsOrSalesBalance" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1065B", "getElement": "OrdinaryIncomeLoss" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1065B", "getElement": "NetGainLoss" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1065B", "getElement": "NetFarmProfitLoss" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1065B", "getElement": "OtherIncomeOrLoss" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1065B", "getElement": "QuickSummaryTotalIncome" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1065B", "getElement": "QuickSummaryTotalDed" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1065B", "getElement": "QuickSummaryAGI" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1065B", "getElement": "QuickSummaryTaxableInc" }, "mainForm": "1065B" },
                //Income block end

                //Credit block for 1065 start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "dSchR", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "dSchR", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1065B", "getElement": "Taxes" }, "mainForm": "1065B" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1065B", "getElement": "OtherPayments" }, "mainForm": "1065B" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1065B", "getElement": "" }, "mainForm": "1065B" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1065B", "getElement": "AmountOwed" }, "mainForm": "1065B" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1065B", "getElement": "Overpayment" }, "mainForm": "1065B" },
                //Payment block start
                //Mapping for 1065 end

                //Mapping for 1120s start	
                //Mapping of partnership block start
                { "set": { "objectName": "partnership", "property": "ein" }, "get": { "form": "header", "usrDetail": "client", "getElement": "ein" } },
                { "set": { "objectName": "partnership", "property": "companyName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "companyName" } },
                { "set": { "objectName": "partnership", "property": "usStreet" }, "get": { "form": "d1120SCIS", "getElement": "Address" } },
                { "set": { "objectName": "partnership", "property": "usCity" }, "get": { "form": "d1120SCIS", "getElement": "city" } },
                { "set": { "objectName": "partnership", "property": "usState" }, "get": { "form": "d1120SCIS", "getElement": "state" } },
                { "set": { "objectName": "partnership", "property": "usZipCode" }, "get": { "form": "d1120SCIS", "getElement": "Zipcode" } },
                { "set": { "objectName": "partnership", "property": "fgStreet" }, "get": { "form": "d1120SCIS", "getElement": "ForeignAddress" } },
                { "set": { "objectName": "partnership", "property": "fgCity" }, "get": { "form": "d1120SCIS", "getElement": "ForeignZipCity" } },
                { "set": { "objectName": "partnership", "property": "fgState" }, "get": { "form": "d1120SCIS", "getElement": "ProvinceOrState" } },
                { "set": { "objectName": "partnership", "property": "fgPostalCode" }, "get": { "form": "d1120SCIS", "getElement": "PostalCode" } },
                { "set": { "objectName": "partnership", "property": "fgCountry" }, "get": { "form": "d1120SCIS", "getElement": "ForeignCountry" } },
                { "set": { "objectName": "partnership", "property": "phoneNo" }, "get": { "form": "d1120SCIS", "getElement": "Phone" } },

                //preparer block in more quick return summary start
                { "set": { "objectName": "preparer", "property": "preparerId" }, "get": { "form": "d1120SRIS", "getElement": "PrepareID" } },
                { "set": { "objectName": "preparer", "property": "name" }, "get": { "form": "d1120SRIS", "getElement": "PrepareName" } },
                { "set": { "objectName": "preparer", "property": "ssn" }, "get": { "form": "d1120SRIS", "getElement": "PrepareSSN" } },
                { "set": { "objectName": "preparer", "property": "ptin" }, "get": { "form": "d1120SRIS", "getElement": "PreparePTIN" } },
                { "set": { "objectName": "preparer", "property": "ein" }, "get": { "form": "d1120SRIS", "getElement": "PrepareEIN" } },
                { "set": { "objectName": "preparer", "property": "telephoneNo" }, "get": { "form": "d1120SRIS", "getElement": "PreparePhone" } },
                { "set": { "objectName": "preparer", "property": "email" }, "get": { "form": "d1120SRIS", "getElement": "PrepareEmail" } },
                //preparer block in more quick return summary end

                //Bank block in more quick return summary start
                { "set": { "objectName": "bank", "property": "name" }, "get": { "form": "d1120SRIS", "getElement": "" } },
                { "set": { "objectName": "bank", "property": "accountNo" }, "get": { "form": "d1120SRIS", "getElement": "strdan" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "d1120SRIS", "getElement": "blnsavingacc" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "d1120SRIS", "getElement": "blncurracc" } },
                { "set": { "objectName": "bank", "property": "rtn" }, "get": { "form": "d1120SRIS", "getElement": "strrtn" } },
                //Bank block in more quick return summary end

                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1120S", "getElement": "GrossReceiptsOrSalesBalance" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1120S", "getElement": "NetGainLoss" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1120S", "getElement": "OtherIncomeLoss" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1120S", "getElement": "TotalIncomeLoss" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1120S", "getElement": "TotalDeductions" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120S", "getElement": "OrdinaryIncomeLossFromTrade" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1120S", "getElement": "OrdinaryIncomeLossFromTrade" }, "mainForm": "1120S" },
                //Income block end

                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "dSchR", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1120S", "getElement": "TotalTax" }, "mainForm": "1120S" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1120S", "getElement": "TotalPayments" }, "mainForm": "1120S" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1120S", "getElement": "" }, "mainForm": "1120S" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1120S", "getElement": "BalanceDue" }, "mainForm": "1120S" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1120S", "getElement": "Refund" }, "mainForm": "1120S" },
                //Payment block start	                   	
                //Mapping for 1120s stop




                //Mapping for 1120 start	
                //Mapping of partnership block start
                { "set": { "objectName": "partnership", "property": "ein" }, "get": { "form": "header", "usrDetail": "client", "getElement": "ein" } },
                { "set": { "objectName": "partnership", "property": "companyName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "companyName" } },
                { "set": { "objectName": "partnership", "property": "usStreet" }, "get": { "form": "d1120CCIS", "getElement": "StreetAddress" } },
                { "set": { "objectName": "partnership", "property": "usCity" }, "get": { "form": "d1120CCIS", "getElement": "city" } },
                { "set": { "objectName": "partnership", "property": "usState" }, "get": { "form": "d1120CCIS", "getElement": "state" } },
                { "set": { "objectName": "partnership", "property": "usZipCode" }, "get": { "form": "d1120CCIS", "getElement": "Zipcode" } },
                { "set": { "objectName": "partnership", "property": "fgStreet" }, "get": { "form": "d1120CCIS", "getElement": "ForeignAddress" } },
                { "set": { "objectName": "partnership", "property": "fgCity" }, "get": { "form": "d1120CCIS", "getElement": "ForeignAddressCity" } },
                { "set": { "objectName": "partnership", "property": "fgState" }, "get": { "form": "d1120CCIS", "getElement": "ForeignAddressProvinceOrState" } },
                { "set": { "objectName": "partnership", "property": "fgPostalCode" }, "get": { "form": "d1120CCIS", "getElement": "ForeignAddressPostalCode" } },
                { "set": { "objectName": "partnership", "property": "fgCountry" }, "get": { "form": "d1120CCIS", "getElement": "ForeignAddressCountry" } },
                { "set": { "objectName": "partnership", "property": "phoneNo" }, "get": { "form": "d1120CCIS", "getElement": "Phone" } },

                //preparer block in more quick return summary start
                { "set": { "objectName": "preparer", "property": "preparerId" }, "get": { "form": "d1120CRIS", "getElement": "PrepareID" } },
                { "set": { "objectName": "preparer", "property": "name" }, "get": { "form": "d1120CRIS", "getElement": "PrepareName" } },
                { "set": { "objectName": "preparer", "property": "ssn" }, "get": { "form": "d1120CRIS", "getElement": "PrepareSSN" } },
                { "set": { "objectName": "preparer", "property": "ptin" }, "get": { "form": "d1120CRIS", "getElement": "PreparePTIN" } },
                { "set": { "objectName": "preparer", "property": "ein" }, "get": { "form": "d1120CRIS", "getElement": "PrepareEIN" } },
                { "set": { "objectName": "preparer", "property": "telephoneNo" }, "get": { "form": "d1120CRIS", "getElement": "PreparePhone" } },
                { "set": { "objectName": "preparer", "property": "email" }, "get": { "form": "d1120CRIS", "getElement": "PrepareEmail" } },
                //preparer block in more quick return summary end

                //Bank block in more quick return summary start
                { "set": { "objectName": "bank", "property": "name" }, "get": { "form": "d1120CRIS", "getElement": "" } },
                { "set": { "objectName": "bank", "property": "accountNo" }, "get": { "form": "d1120CRIS", "getElement": "strdan" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "d1120CRIS", "getElement": "blnsavingacc" } },
                { "set": { "objectName": "bank", "property": "accountType" }, "get": { "form": "d1120CRIS", "getElement": "blncurracc" } },
                { "set": { "objectName": "bank", "property": "rtn" }, "get": { "form": "d1120CRIS", "getElement": "strrtn" } },
                //Bank block in more quick return summary end


                //1120C start
                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1120C", "getElement": "SubtractLine1dFromLine1c" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1120C", "getElement": "QuickSummaryIntDiv" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1120C", "getElement": "QuickSummaryCapitalgain" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1120C", "getElement": "OtherIncome" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1120C", "getElement": "TotalIncome" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1120C", "getElement": "TotalDeductions" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120C", "getElement": "TaxableIncomeBeforeNOL" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1120C", "getElement": "TaxableIncome" }, "mainForm": "1120C" },
                //Income block end

                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "dSchR", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1120C", "getElement": "TotalTax" }, "mainForm": "1120C" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1120C", "getElement": "" }, "mainForm": "1120C" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1120C", "getElement": "TotalPaymentsAndRefundCredits" }, "mainForm": "1120C" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1120C", "getElement": "EstimatedTaxPenalty" }, "mainForm": "1120C" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1120C", "getElement": "BalanceDue" }, "mainForm": "1120C" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1120C", "getElement": "Refund" }, "mainForm": "1120C" },
                //Payment block start
                //1120C end	                   		

                //1120H start
                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1120H", "getElement": "QuickSummaryGrossRecipets" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1120H", "getElement": "QuickSummaryIntDiv" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1120H", "getElement": "QuickSummaryCapitalgain" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1120H", "getElement": "OTHERNCOME" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1120H", "getElement": "GROSSINCOME" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1120H", "getElement": "TOTALDEDUCATION" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120H", "getElement": "TAXABLEINCOME" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1120H", "getElement": "TAXABLEINCOME19" }, "mainForm": "1120H" },
                //Income block end

                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1120H", "getElement": "TOTALTAX22" }, "mainForm": "1120H" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1120H", "getElement": "TOTALOFFEDERALTAXPAID" }, "mainForm": "1120H" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1120H", "getElement": "" }, "mainForm": "1120H" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1120H", "getElement": "AMOUNTOWNED" }, "mainForm": "1120H" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1120H", "getElement": "REFUNDED" }, "mainForm": "1120H" },
                //Payment block start
                //1120H end

                //1120L start
                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1120L", "getElement": "GrossPremiumsBalance" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1120L", "getElement": "InvestmentIncome" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1120L", "getElement": "CapitalGainNetIncome" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1120L", "getElement": "QuickSummaryOtherInc" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1120L", "getElement": "LifeInsuranceGrossIncome" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1120L", "getElement": "PartialTotalDeductions" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120L", "getElement": "SubtotalOfDeductions" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1120L", "getElement": "TaxableIncome" }, "mainForm": "1120L" },
                //Income block end

                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1120L", "getElement": "TotalTax" }, "mainForm": "1120L" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1120L", "getElement": "" }, "mainForm": "1120L" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1120L", "getElement": "USIncomeTaxPaidOrWithheld29k" }, "mainForm": "1120L" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1120L", "getElement": "EstimatedTaxPenalty" }, "mainForm": "1120L" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1120L", "getElement": "BalanceDue" }, "mainForm": "1120L" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1120L", "getElement": "Refund" }, "mainForm": "1120L" },
                //Payment block start
                //1120L end

                //1120POL start
                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1120POL", "getElement": "QuickSummaryGrossReciepts" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1120POL", "getElement": "QuickSummaryIntDiv" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1120POL", "getElement": "QuickSummaryCapitalgain" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1120POL", "getElement": "NonExemptFunction" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1120POL", "getElement": "Totalincome" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1120POL", "getElement": "DeducTotal" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120POL", "getElement": "QuickSummaryAGI" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1120POL", "getElement": "TaxTaxableincome" }, "mainForm": "1120POL" },
                //Income block end

                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1120POL", "getElement": "TaxTotaltax" }, "mainForm": "1120POL" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1120POL", "getElement": "TaxTotalPayments" }, "mainForm": "1120POL" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1120POL", "getElement": "" }, "mainForm": "1120POL" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1120POL", "getElement": "TaxDue" }, "mainForm": "1120POL" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1120POL", "getElement": "TaxOverpayment" }, "mainForm": "1120POL" },
                //Payment block start
                //1120POL end

                //1120PC start
                //Income block start
                { "set": { "objectName": "income", "property": "grossRecieptsOrNetSales" }, "get": { "form": "d1120PC", "getElement": "PremiumsEarnedTaxableIncome" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "interestAndDividend" }, "get": { "form": "d1120PC", "getElement": "QuickSummaryIntDiv" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "businessIncome" }, "get": { "form": "d1120PC", "getElement": "QuickSummaryBusinessInc" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "capitalGain" }, "get": { "form": "d1120PC", "getElement": "QuickSummaryCapitalgain" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "farmIncome" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "otherIncome" }, "get": { "form": "d1120PC", "getElement": "OtherIncome" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "totalIncome" }, "get": { "form": "d1120PC", "getElement": "GrossIncome" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "totalAdjustment" }, "get": { "form": "d1120PC", "getElement": "TotalDeductions" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120PC", "getElement": "SubtotalSpecialDeductions" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "itemizedOrStandardDed" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "income", "property": "taxableIncome" }, "get": { "form": "d1120PC", "getElement": "TaxableIncome" }, "mainForm": "1120PC" },
                //Income block end

                //Credit block start
                { "set": { "objectName": "credit", "property": "foreignTaxCredit" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "childAndDepCare" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "elderlyAndDisableCr" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "educationCredit" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "rtrSavingsCredit" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "eic" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "ctc" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "additionCTC" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "otherCredit" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "credit", "property": "totalCredit" }, "get": { "form": "d1120PC", "getElement": "TotalCredits" }, "mainForm": "1120PC" },
                //Credit block end
                //Tax block start
                { "set": { "objectName": "tax", "property": "taxOnIncome" }, "get": { "form": "d1120PC", "getElement": "TaxesPlusAltMinimumTax" }, "mainForm": "1120PC" },
                { "set": { "objectName": "tax", "property": "amt" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "tax", "property": "otherTaxes" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "tax", "property": "totalTax" }, "get": { "form": "d1120PC", "getElement": "TotalTax" }, "mainForm": "1120PC" },
                //Tax block end
                //Payment block start
                { "set": { "objectName": "payment", "property": "incomeTaxWithheld" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "payment", "property": "estimateTaxPayAmt" }, "get": { "form": "d1120PC", "getElement": "" }, "mainForm": "1120PC" },
                { "set": { "objectName": "payment", "property": "otherPayments" }, "get": { "form": "d1120PC", "getElement": "TotalPaymentsAndRefundCredits" }, "mainForm": "1120PC" },
                { "set": { "objectName": "payment", "property": "estimateTaxPenalyt" }, "get": { "form": "d1120PC", "getElement": "EstimatedTaxPenalty" }, "mainForm": "1120PC" },
                { "set": { "objectName": "payment", "property": "balanceDue" }, "get": { "form": "d1120PC", "getElement": "Refund" }, "mainForm": "1120PC" },
                { "set": { "objectName": "payment", "property": "refund" }, "get": { "form": "d1120PC", "getElement": "BalanceDue" }, "mainForm": "1120PC" }
                //Payment block start
                //1120PC end

                //Mapping for 1120 stop
            ];

            // to display it in ui, if this states come we can display as shown below key value pair.
            $scope.titleCaseStates = {
                "refundadvantage": "Refund Advantage",
                "federal": "Federal",
                "protectionplus": "Protection Plus",
                "navigator": "Navigator"
            };
            //Temporary function to differentiate features as per environment (beta/live)
            $scope.betaOnly = function () {
                if (environment.mode == 'beta' || environment.mode == 'local')
                    return true;
                else
                    return false;
            };

            $scope.ssnorein = basketService.popItem('ssnorein');
            // Select value coming from quicksummary widget.
            $scope.maskType = basketService.popItem("maskType");

            //get efile status code
            $scope.efileStatusLookup = systemConfig.getEfileStatusLookup();

            //IF value undefined or blank then set it to ssn
            if ($scope.maskType == undefined || $scope.maskType == "") {
                $scope.maskType = "SSN";
            }

            if ($scope.maskType == "SSN") {
                $scope.mask = "999-99-9999";
            } else if ($scope.maskType == "EIN") {
                $scope.mask = "99-9999999";
            } else if ($scope.maskType == "Phone") {
                $scope.mask = "(000)000-0000";
            } else {
                $scope.mask = undefined;
            }

            //variable contains the quickReturnSummary of the user whose ssn is entered
            //  $scope.quickSummary = completeSummaryService.quickSummary;
            //variable contains the message if certain error arises

            // if (!$scope.quickSummary) {
            //     localeService.translate("Enter a valid {{type}}/ITIN to view the return's summary.", 'QUICKRETURNSUMMARY_DEFAULTSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
            //         $scope.message = response;
            //     });
            // } else {
            //$scope.ssnorein = completeSummaryService.ssnorein;
            completeSummaryService.getQuickReturnSummary($scope.ssnorein, completeSummmaryMapping, $scope.maskType).then(function (response) {
                $scope.quickSummary = completeSummaryService.quickSummary;
                $scope.message = completeSummaryService.message;
                $scope.message = completeSummaryService.message;
                if ($scope.quickSummary.taxPayerDetail && Object.keys($scope.quickSummary.taxPayerDetail).length > 0) {
                    $scope.maskTypeDisplayValue = "SSN";
                }
                if ($scope.quickSummary.partnership && Object.keys($scope.quickSummary.partnership).length > 0) {
                    $scope.maskTypeDisplayValue = "EIN";
                }
            }, function (error) {
                $scope.message = completeSummaryService.message;
            });
            // }
            var _getReturnSummaryPromise = function () {
                var deferred = $q.defer();
                if (!angular.isUndefined($scope.ssnorein) && $scope.ssnorein != '') {
                    completeSummaryService.getQuickReturnSummary($scope.ssnorein, completeSummmaryMapping, $scope.maskType).then(function (response) {
                        $scope.quickSummary = completeSummaryService.quickSummary;
                        $scope.message = completeSummaryService.message;
                        if ($scope.quickSummary.taxPayerDetail && Object.keys($scope.quickSummary.taxPayerDetail).length > 0) {
                            $scope.maskTypeDisplayValue = "SSN";
                        }
                        if ($scope.quickSummary.partnership && Object.keys($scope.quickSummary.partnership).length > 0) {
                            $scope.maskTypeDisplayValue = "EIN";
                        }
                        deferred.resolve(response);
                    }, function (error) {
                        $scope.message = completeSummaryService.message;
                        deferred.reject(error);
                    });
                } else {
                    $scope.quickSummary = {};
                    //condition done if tab press by user and ssn is blank then show the default msg and not error 
                    if ($scope.ssnorein == '') {
                        localeService.translate("Enter a valid {{type}} to view the return's summary.", 'QUICKRETURNSUMMARY_DEFAULTSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
                            $scope.message = response;
                        });
                        completeSummaryService.quickSummary = undefined;
                        $scope.quickSummary = undefined;
                    } else {
                        localeService.translate("You have entered invalid {{type}}.", 'QUICKRETURNSUMMARY_INVALIDSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
                            $scope.message = response;
                        });
                    }
                    deferred.resolve();
                }
                return deferred.promise;
            };
            //calling the function to get the quick return of the ssn entered 
            $scope.getReturnStummary = function () {
                _getReturnSummaryPromise().then(function (response) {
                    $scope.fourthRefreshStart = false;
                }, function (error) {
                    $log.error(error);
                    $scope.fourthRefreshStart = false;
                });
            }
            /*
     *  Key press event
     *  If enter is press then we will call getReturnStummary function
     */
            $scope.keyPress = function (event) {
                // 13 is key code for 'enter' key
                if (event.keyCode == 13) {
                    $scope.getReturnStummary();
                }
            };

            //Open Return
            $scope.openReturn = function () {
                if (!_.isUndefined($scope.quickSummary) && !_.isUndefined($scope.quickSummary.returnInfoDetail)) {
                    if ($scope.quickSummary.returnInfoDetail.isCheckedOut == true) {
                        if (userService.getValue("email") == $scope.quickSummary.returnInfoDetail.email) {
                            var returnDetail = $scope.quickSummary.returnInfoDetail;
                            //when user redirect to location from here we just clear our data and set default message 
                            $scope.ssnorein = '';
                            localeService.translate("Enter a valid {{type}}/ITIN to view the return's summary.", 'QUICKRETURNSUMMARY_DEFAULTSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
                                $scope.message = response;
                            });
                            completeSummaryService.quickSummary = undefined;
                            $scope.quickSummary = undefined;
                            //condition to check previously in which mode the return was saved
                            if (!_.isUndefined(returnDetail.returnMode) && returnDetail.returnMode == 'interview') {
                                $location.path('/return/interview/' + returnDetail.id);
                            } else {
                                $location.path('/return/edit/' + returnDetail.id);
                            }
                        } else {
                            var message = "some one else";
                            if (!angular.isUndefined($scope.quickSummary.returnInfoDetail.checkedOutBy)) {
                                message = $scope.quickSummary.returnInfoDetail.checkedOutBy;
                            } else if (!angular.isUndefined($scope.quickSummary.taxPayerDetail.email)) {
                                message = $scope.quickSummary.taxPayerDetail.email;
                            }
                            messageService.showMessage('This return is opened for editing by ' + message, 'error');
                        }
                    } else {
                        var returnDetail = $scope.quickSummary.returnInfoDetail;
                        //when user redirect to location from here we just clear our data and set default message 
                        $scope.ssnorein = '';
                        localeService.translate("Enter a valid {{type}}/ITIN to view the return's summary.", 'QUICKRETURNSUMMARY_DEFAULTSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
                            $scope.message = response;
                        });
                        completeSummaryService.quickSummary = undefined;
                        $scope.quickSummary = undefined;
                        //condition to check previously in which mode the return was saved
                        if (!_.isUndefined(returnDetail.returnMode) && returnDetail.returnMode == 'interview') {
                            $location.path('/return/interview/' + returnDetail.id);
                        } else {
                            $location.path('/return/edit/' + returnDetail.id);
                        }
                    }
                }
            };

            //Check for privileges
            $scope.userCan = function (privilege) {
                return userService.can(privilege);
                //return true;
            };
            //method for open eFile
            $scope.openEFile = function (eFileId) {
                completeSummaryService.openEFile(eFileId).then(function (success) {
                }, function (error) {
                    $log.error(error);
                });
            };

            // On change value of SSN/EIN dropdown
            $scope.changeValue = function () {
                if ($scope.maskType == "SSN") {
                    $scope.mask = "999-99-9999";
                } else if ($scope.maskType == "EIN") {
                    $scope.mask = "99-9999999";
                } else if ($scope.maskType == "Phone") {
                    $scope.mask = "(000)000-0000";
                } else {
                    $scope.mask = undefined;
                }
                $scope.ssnorein = $scope.quickSummary = completeSummaryService.quickSummary = undefined;
                if ($scope.maskType == "SSN") {
                    localeService.translate("Enter a valid {{type}}/ITIN to  view the return's summary.", 'QUICKRETURNSUMMARY_DEFAULTSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
                        $scope.message = response;
                    });
                } else {
                    localeService.translate("Enter a valid {{type}} to  view the return's summary.", 'QUICKRETURNSUMMARY_DEFAULTSSNOREIN_MESSAGE', { "type": $scope.maskType }).then(function (response) {
                        $scope.message = response;
                    });
                }

            };

            //get default status 
            $scope.getDefaultStatus = function (status) {
                if (status) {
                    return userService.getReturnStatusObject(status, undefined, true);
                }
            };

            $scope.$on('$destroy', function () {
                $scope.mask = $scope.maskType = $scope.ssnorein = $scope.message = completeSummaryService.ssnorein = "";
            });
        }]
    };
}]);

//Filter
completeSummaryApp.filter('statusFromNumber', [function () {
    return function (federalObject) {
        //Check if eFileStatus is defined in return
        if (angular.isDefined(federalObject.status)) {
            if (_.contains([0, 1, 2, 3, 4, 5, 6], federalObject.status)) {
                return "Transmitted";
            } else if (federalObject.status == 7) {
                if (angular.isDefined(federalObject.stateName) && federalObject.stateName != '') {
                    if (federalObject.stateName.toLowerCase() == 'federal') {
                        return "At IRS";
                    } else {
                        return "At State";
                    }
                }
            } else if (federalObject.status == 8) {
                return "Rejected";
            } else if (federalObject.status == 9) {
                return "Accepted";
            } else if (federalObject.status == 21) {
                return "Cancelled";
                /// for bank product
            } else if (federalObject.status == 17 || federalObject.status == 15 || federalObject.status == 16) {
                return "Accepted";
            } else if (_.contains([10, 11, 12, 13, 18], federalObject.status)) {
                return "Transmitted";
            } else if (federalObject.status == 14) {
                return "Rejected";
            }
        }
    };
}]);