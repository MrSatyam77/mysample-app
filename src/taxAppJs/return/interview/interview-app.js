"use strict";

/**
 * Note
 * =======
 * isInterviewFormLoading is boolean variable used to show and hide loading bar on form load
 * It is also used to disable the footer button while form loading
 * we make the variable true in _changeTab(),loadInstanceGridForm(),addInstanceGridForm() and _manageInterviewStates() method
 * we toggle this variable to false in _changeTab()(only when the screen holds the grid),loadInterviewForm()(only when the screen is fixed screen) and on 'formLoaded' broadcast listen
 */

var interviewApp = angular.module('interviewApp',[]);

/**
 * This filter will help to apply thousandSeparator to those values that are displayed in instance grid
 */
interviewApp.filter('formatThousandSeparator',['$filter','contentService',function($filter,contentService){
	return function(value,docName,fieldName){
		//we check here that value is defined and not blank 
		if(!_.isUndefined(value) && value!=''){
			//this will return type of particular field
			var fieldType = contentService.getFieldType(docName+'.'+fieldName);		
			//we check here that fieldType is defined
			if (!_.isUndefined(fieldType)){ 
				if(fieldType == 'Money'){            	 
					//we filter here our value with fraction '0'
					value = $filter('number')(value,0);
				}else if(fieldType=='Double'){	         		 
               		//If value has fraction digit (.) we split values
               		//Note: We have to remove fraction digits and '.' to filter number properly otherwise it will parse to next integer.
               		if(value.indexOf('.')>0){
               			//the value will split by '.'
                		var _splitData = value.split('.');
                		//we combine _spliteData here & filtered value will be stored      		
                		value = $filter('number')(_splitData[0],0)+""+_splitData[1];
                	}
       	 		}
			}
		}
		return value;
	};

}]);

/**
 * This filter is to simply return the tab Name in which error has occurred
 */
interviewApp.filter('getTabName',[function(){
	return function(value,elementMapping,interviewTabsConfig){
		var formObj = value;
		if(!_.isUndefined(formObj) && formObj != '' && !_.isUndefined(elementMapping)){
			value = _.find(elementMapping,{fieldName:formObj.docName+'.'+formObj.fieldName});			
		}
		if(_.isUndefined(value) && !_.isUndefined(interviewTabsConfig) && !_.isEmpty(interviewTabsConfig)){
			_.forEach(interviewTabsConfig,function(configObj){
				if(configObj.form.docName == formObj.docName){
					if(!_.isUndefined(configObj.masterId)){
						value = configObj.title + " ("+_.find(interviewTabsConfig,{id:configObj.masterId}).title+")";
					}else{
						value = configObj.title;
					}
					return false;
				}
			});
			if(_.isUndefined(value)){
				value = formObj.form.extendedProperties.displayName;
			}
		}
		return _.isObject(value)?value.title:value;
	};
}]);



interviewApp.controller('interviewController',['$scope','$q','$filter','$log','$timeout','$routeParams','$location','$compile','$interval','_','ngTableParams','returnService','userService','networkHealthService', 'basketService',
                                        function($scope,$q,$filter,$log,$timeout,$routeParams,$location,$compile,$interval,_,ngTableParams,returnService,userService,networkHealthService, basketService){
	
 	
    $scope.elementMapping = [
                             {fieldName:'dReturnInfo.strtppin',title:'Filing Information'}
                             ];
    
	//configuration of all tabs for interview mode
	$scope.interviewTabsConfig = [
	                              {id:'personalInfo', title:'Personal Information',form:{docName:'dMainInfo',formName:'fMainInfo'},active: true,custom:{},display:true},
	                              {id:'dependentInfo', title:'Dependent Information',isStatement:true,form:{docName:'dDependentstatement',formName:'fDependentstatement',parentFormName:'fMainInfo',parentDocName:'dMainInfo'},active: false ,instanceGridColumns: [{ title:'First Name', field:'efnm', headerClass: 'col-lg-4 col-md-4 col-sm-4' },{ title: 'Last Name', field:'elnm', headerClass: 'col-lg-4 col-md-4 col-sm-4' },{ title:'SSN / TIN', field:'essn', headerClass: 'col-lg-3 col-md-3 col-sm-3' },{ title:'Birth Date', field:'edob', headerClass: 'col-lg-3 col-md-3 col-sm-3' },{ title:'Age', field:'Age', headerClass: 'col-lg-3 col-md-3 col-sm-3' },{ title:'Relationship', field:'etprel', headerClass: 'col-lg-3 col-md-3 col-sm-3' }], custom: {},display:true},
	                              {id:'dayCareProvider', title:'Daycare Provider Information',isStatement:true,form:{docName:'d2441CareProviderstmt',formName:'f2441CareProviderstmt',parentFormName:'f2441',parentDocName:'d2441'},active: false ,instanceGridColumns: [{ title: "First Name", field: "PersonFirstName", headerClass: 'col-lg-3 col-md-3 col-sm-3' }, { title: "Last Name", field: "PersonLastName", headerClass: 'col-lg-3 col-md-3 col-sm-3' }, { title: "EIN/SSN", field: "SSN", headerClass: 'col-lg-2 col-md-2 col-sm-2' }, { title: "Address", field: "AddressLine1", headerClass: 'col-lg-2 col-md-2 col-sm-2' }, { title: "City", field: "City", headerClass: 'col-lg-2 col-md-2 col-sm-2' }, { title: "State", field: "State", headerClass: 'col-lg-2 col-md-2 col-sm-2' }, { title: "Zip Code", field: "Zipcode", headerClass: 'col-lg-3 col-md-3 col-sm-3' }, { title: "Amount Paid", field: "PaidAmt", headerClass: 'col-lg-3 col-md-3 col-sm-3' }], custom: {},display:true},
	                              parseInt(userService.getTaxYear()) <= 2017?{id:'ACA', title:'ACA',form:{docName:'dACAHealthCoverageWkt',formName:'fACAHealthCoverageWkt'},active: false,custom:{},display:true}:{id:'ACA1', title:'ACA',form:{docName:'dACAHealthCoverageWkt1',formName:'fACAHealthCoverageWkt1'},active: false,custom:{},display:true},  
								//{id:'ACA', title:'ACA',form:{docName:'dACAHealthCoverageWkt',formName:'fACAHealthCoverageWkt'},active: false,custom:{},display:true},
								{id:'1095A', title:'1095-A',form:{docName:'d1095A',formName:'f1095A'},active: false,instanceGridColumns:[{title:'Marketplace-assigned Policy Number',field:'MarketplacePolicyNumber',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Policy Issuer Name',field:'PolicyIssuer',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Monthly Premium Amount',field:'AnnualTotal1',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Monthly Premium Amount (SLCSP)',field:'AnnualTotal2',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Monthly Advance Payment',field:'AnnualTotal3',headerClass: 'col-lg-4 col-md-4 col-sm-4'}],custom:{},
	                            	  activeElements:[{element:'dACAHealthCoverageWkt.HealthInsInd',value:true},{element:'dACAHealthCoverageWkt.HealthInsInd2',value:true},{element:'dACAHealthCoverageWkt.HealthInsInd3',value:true},{element:'dACAHealthCoverageWkt.AnoPerHealthInsInd',value:true},{element:'dACAHealthCoverageWkt.AdvPreTaxInd',value:true},{element:'dACAHealthCoverageWkt.VictOfDomInd',value:true}],
	                            	  display:false},
	                              {id:'8965', title:'8965',form:{docName:'d8965',formName:'f8965'},active: false,custom:{},activeElements:[{element:'dACAHealthCoverageWkt.CovExeInd',value:true},{element:'dACAHealthCoverageWkt.CovExeInd2',value:true}],display:false},
	                              {id:'8962', title:'8962',form:{docName:'d8962',formName:'f8962'},active: false,custom:{},activeElements:[{element:'dACAHealthCoverageWkt.HealthInsInd',value:true},{element:'dACAHealthCoverageWkt.HealthInsInd2',value:true},{element:'dACAHealthCoverageWkt.HealthInsInd3',value:true},{element:'dACAHealthCoverageWkt.AnoPerHealthInsInd',value:true},{element:'dACAHealthCoverageWkt.AdvPreTaxInd',value:true},{element:'dACAHealthCoverageWkt.VictOfDomInd',value:true}],display:false},
	                            parseInt(userService.getTaxYear()) <= 2017? {id:'8965SharedResPayWkt', title:'Shared Responsibility',form:{docName:'d8965ShareResponsibilityPaymentWkt',formName:'f8965ShareResponsibilityPaymentWkt'},active: false,custom:{},activeElements:[{element:'dACAHealthCoverageWkt.CovExeNotAvlInd',value:true}],display:false} : {id:'8965SharedResPayWkt', title:'Shared Responsibility',form:{docName:'d8965ShareResponsibilityPaymentWkt',formName:'f8965ShareResponsibilityPaymentWkt'},active: false,custom:{},activeElements:[{element:'dACAHealthCoverageWkt1.Marketplace',value:true},{element: 'dACAHealthCoverageWkt1.Exemptionpenalty',value:true}],display:false},
								//{id:'8965SharedResPayWkt', title:'Shared Responsibility',form:{docName:'d8965ShareResponsibilityPaymentWkt',formName:'f8965ShareResponsibilityPaymentWkt'},active: false,custom:{},activeElements:[{element:'dACAHealthCoverageWkt.CovExeNotAvlInd',value:true}],display:false},  
								{id:'incomeDeduction', title:'Income/Deduction',form:{docName:'dIncDeductionInterviewMode',formName:'fIncDeductionInterviewMode'},active:false,custom:{},display:true},
	                              {id:'w2', title:'W-2',form:{docName:'dW2',formName:'fW2'},active: false,
	                            	  	  instanceGridColumns: [{ title: 'Employer', field: 'BusinessNameLine1', headerClass: 'col-lg-4 col-md-4 col-sm-4' }, { title: 'Taxpayer/Spouse', field: 'spcombo', headerClass: 'col-lg-4 col-md-4 col-sm-4' }, { title: 'Fed Income Box1', field: 'WagesAmt', headerClass: 'col-lg-4 col-md-4 col-sm-4' }, { title: 'Fed Withholding Box2', field: 'WithholdingAmt', headerClass: 'col-lg-4 col-md-4 col-sm-4' }, { title: 'State Withholding Box17', field: 'StateIncomeTaxAmt', headerClass: 'col-lg-4 col-md-4 col-sm-4' }], custom: {},activeElements:[{element:'dIncDeductionInterviewMode.W2Inc',value:true}],display:false},
	                              {id:'1099INT', title:'1099 INT',form:{docName:'d1099INT',formName:'f1099INT'},active: false,
	                            		  instanceGridColumns:[{title:'Payer Name',field:'PayersName',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Taxpayer/Spouse',field:'TPSP',headerClass: 'col-lg-3 col-md-3 col-sm-3'},{title:'Interest Income',field:'InterestIncome',headerClass: 'col-lg-3 col-md-3 col-sm-3'},{title:'Federal Income Tax Withheld',field:'FederalIncomeTaxWithheld',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Tax-exempt Interest',field:'TaxExemptInterest',headerClass: 'col-lg-3 col-md-3 col-sm-3'},{title:'State Tax Withheld',field:'StateTaxWithheld',headerClass: 'col-lg-3 col-md-3 col-sm-3'}],custom:{},activeElements:[{element:'dIncDeductionInterviewMode.IntrestInc',value:true}],display:false},
	                              {id:'1099DIV', title:'1099 DIV',form:{docName:'d1099DIV',formName:'f1099DIV'},active: false,
	                            		  instanceGridColumns:[{title:'Payer name',field:'PAYERSname',headerClass: 'col-lg-3 col-md-3 col-sm-3'},{title:'Taxpayer/Spouse',field:'TPSP',headerClass: 'col-lg-3 col-md-3 col-sm-3'},{title:'Total ordinary dividends',field:'Totalordinarydividends',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Qualified dividends',field:'Qualifieddividends',headerClass: 'col-lg-3 col-md-3 col-sm-3'},{title:'Fed. income tax withheld',field:'Federalincometaxwithheld',headerClass: 'col-lg-4 col-md-4 col-sm-4'},{title:'Exempt-interest div.',field:'Exemptinterestdividends',headerClass: 'col-lg-3 col-md-3 col-sm-3'}],custom:{},activeElements:[{element:'dIncDeductionInterviewMode.DivInc',value:true}],display:false},
	                              {id:'schB', title:'Schedule B',form:{docName:'dSchB',formName:'fSchB'},active: false,custom:{},activeElements:[{element:'dIncDeductionInterviewMode.IntrestInc',value:true},{element:'dIncDeductionInterviewMode.DivInc',value:true}],display:false},
	                              {id:'1099G', title:'1099 G',form:{docName:'d1099G',formName:'f1099G'},active: false,
	                            		  instanceGridColumns:[{title:'Payer name',field:'fieldbc',headerClass: 'col-lg-5 col-md-5 col-sm-5'},{title:'Taxpayer/Spouse',field:'TPSP',headerClass: 'col-lg-5 col-md-5 col-sm-5'},{title:'Unemployment compensation',field:'fieldam',headerClass: 'col-lg-5 col-md-5 col-sm-5'},{title:'Federal income tax withheld',field:'fieldaj',headerClass: 'col-lg-5 col-md-5 col-sm-5'}],custom:{},activeElements:[{element:'dIncDeductionInterviewMode.UnemployComp',value:true}],display:false},
	                              {id:'1099M', title:'1099 M',form:{docName:'d1099M',formName:'f1099M'},instanceGridColumns:[{title:'Payer Name',field:'fieldbh',headerClass: 'col-lg-5 col-md-5 col-sm-5'},{title:'Identification Number',field:'fieldbk',headerClass: 'col-lg-5 col-md-5 col-sm-5'},{title:'Other Income',field:'fieldbb',headerClass: 'col-lg-5 col-md-5 col-sm-5'},{title:'Federal Income Tax Withheld',field:'fieldaz',headerClass: 'col-lg-5 col-md-5 col-sm-5'}],active: false,custom:{},activeElements:[{element:'dIncDeductionInterviewMode.MiscellenousIncome',value:true}],blockedYears:"2016",display:false},
	                              {id:'eicDue', title:'EIC',form:{},custom:{},isMaster:true},
	                              {id:'dependentDue', title:'EIC Worksheet',form:{docName:'dSchEICwkt',formName:'fSchEICwkt'}, masterId:'eicDue',active:false,custom:{},display:true},
	                              {id:'taxPayerDue', title:'EIC Due Diligence',form:{docName:'d8867',formName:'f8867'}, masterId:'eicDue',active: false,custom:{},display:true},
	                              {id:'fillingInfo', title:'Filing Information',form:{docName:'dReturnInfo',formName:'fReturnInfo'},active: false,custom:{},display:true},
	                              {id:'state', title:'State',form:{},custom:{},isMaster:true},
	                              {id:'selectState',title:'Select State',form:{},masterId:'state',active: false,custom:{},display:true,isFixedScreen:true,executeFunction:'_manageInterviewStates',initFunction:'_initInterviewStates()'},
	                              {id:'partYrResi', title:'Part Year Residenet',form:{docName:'dPartYrResi',formName:'fPartYrResi'}, masterId:'state',active:false,custom:{},activeElements:[{element:'dPartYrResi.isActive',value:true},{element:'dPartYrResi.isActive',value:false}],display:false},
	                              {id:'nonResident', title:'Resident / Non-Resident',form:{docName:'dNonResi',formName:'fNonResi'}, masterId:'state',active:false,custom:{},activeElements:[{element:'dNonResi.isActive',value:true},{element:'dNonResi.isActive',value:false}],display:false},
	                              
	                              //AL state start
	                              {id:'al', title:'AL',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'al40',title:'AL 40',form:{docName:'dAL40',formName:'fAL40'},masterId:'al',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains al'},{element:'dMainInfo.PartYearResident',value:'contains al'}],display:false},
	                              {id:'al40schb',title:'AL Sch B',form:{docName:'dSchAL40B',formName:'fSchAL40B'},masterId:'al',active:false,custom:{},activeElements:[{element:'dAL40.SchAL40BInterview',value:true}],display:false},
	                              {id:'al40nr',title:'AL 40NR',form:{docName:'dAL40NR',formName:'fAL40NR'},masterId:'al',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains al'}],display:false},
	                              {id:'al40nrschb',title:'AL 40NR Schedule B',form:{docName:'dSchAL40NRSchB',formName:'fAL40NRSchB'},masterId:'al',active:false,custom:{},activeElements:[{element:'dAL40NR.SchAL40NRSchBInterview',value:true}],display:false},
	                              //AL state end
	                              
	                              //AZ state start
	                              {id:'az', title:'AZ',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'az140',title:'AZ 140',form:{docName:'dAZ140',formName:'fAZ140'},masterId:'az',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains az'}],display:false},
	                              {id:'az140py',title:'AZ 140PY',form:{docName:'dAZ140PY',formName:'fAZ140PY'},masterId:'az',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains az'}],display:false},
	                              {id:'az140nr',title:'AZ 140NR',form:{docName:'dAZ140NR',formName:'fAZ140NR'},masterId:'az',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains az'}],display:false},
	                              //AZ state end
	                              
	                              //AR state start
	                              {id:'ar', title:'AR',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ar1000f',title:'AR 1000F',form:{docName:'dAR1000F',formName:'fAR1000F'},masterId:'ar',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ar'}],display:false},
	                              {id:'ar1000nr',title:'AR 1000NR',form:{docName:'dAR1000NR',formName:'fAR1000NR'},masterId:'ar',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ar'},{element:'dMainInfo.NonResident',value:'contains ar'}],display:false},
	                              {id:'ar4sch',title:'AR 4',form:{docName:'dSchAR4',formName:'fSchAR4'},masterId:'ar',active:false,custom:{},activeElements:[{element:'dAR1000F.SchAR4Interview',value:true},{element:'dAR1000NR.SchAR4Interview',value:true}],display:false},
	                              //AR state end
	                              
	                            //CA state start
	                              {id:'ca', title:'CA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ca540',title:'CA 540',form:{docName:'dCA540',formName:'fCA540'},masterId:'ca',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ca'}],display:false},
	                              {id:'ca540schca',title:'CA 540 Sch CA',form:{docName:'dCA540SchCA',formName:'fCA540ScheduleCA'},masterId:'ca',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ca'}],display:false},
	                              {id:'ca540nr',title:'CA 540NR',form:{docName:'dCA540NR',formName:'fCA540NR'},masterId:'ca',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ca'},{element:'dMainInfo.NonResident',value:'contains ca'}],display:false},
	                              {id:'ca540nrschca',title:'CA 540NR Schedule CA',form:{docName:'dSchCA540NRSchCA',formName:'fCA540NRSchCA'},masterId:'ca',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ca'},{element:'dMainInfo.NonResident',value:'contains ca'}],display:false},
	                              //CA state end
	                              
	                              //CO state start
	                              {id:'co', title:'CO',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'co104',title:'CO 104',form:{docName:'dCO104',formName:'fCO104'},masterId:'co',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains co'},{element:'dMainInfo.PartYearResident',value:'contains co'},{element:'dMainInfo.NonResident',value:'contains co'}],display:false},
	                              //CO state end
	                              
	                              //CT state start
	                              {id:'ct', title:'CT',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ct1040',title:'CT 1040',form:{docName:'dCT1040',formName:'fCT1040'},masterId:'ct',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ct'}],display:false},
	                              {id:'ct1040nrpy',title:'CT 1040 NRPY',form:{docName:'dCT1040NRPY',formName:'fCT1040NRPY'},masterId:'ct',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ct'},{element:'dMainInfo.NonResident',value:'contains ct'}],display:false},
	                              //CT state end
	                              
	                              //DC state start
	                              {id:'dc', title:'DC',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'dc40',title:'DC 40',form:{docName:'dDC40',formName:'fDC40'},masterId:'dc',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains dc'},{element:'dMainInfo.PartYearResident',value:'contains dc'},{element:'dMainInfo.NonResident',value:'contains dc'}],display:false},
	                              //DC state end
	                              
	                              //DE state start
	                              {id:'de', title:'DE',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'de20001',title:'DE 200-01',form:{docName:'dDE20001',formName:'fDE20001'},masterId:'de',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains de'},{element:'dMainInfo.PartYearResident',value:'contains de'}],display:false},
	                              {id:'de20002',title:'DE 200-02',form:{docName:'dDE20002',formName:'fDE20002'},masterId:'de',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains de'}],display:false},
	                              //DE state end
	                              
	                              
	                              //GA state start
	                              {id:'ga', title:'GA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ga500',title:'GA 500',form:{docName:'dGA500',formName:'fGA500'},masterId:'ga',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ga'},{element:'dMainInfo.PartYearResident',value:'contains ga'},{element:'dMainInfo.NonResident',value:'contains ga'}],display:false},
	                              //GA state end
	                              
	                              //HI state start
	                              {id:'hi', title:'HI',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'hin11',title:'HI N11',form:{docName:'dHIN11',formName:'fHIN11'},masterId:'hi',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains hi'}],display:false},
	                              {id:'hin15',title:'HI N15',form:{docName:'dHIN15',formName:'fHIN15'},masterId:'hi',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains hi'},{element:'dMainInfo.NonResident',value:'contains hi'}],display:false},
	                              //HI state end
	                              
	                              //IA state start
	                              {id:'ia', title:'IA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ia1040',title:'IA 1040',form:{docName:'dIA1040',formName:'fIA1040'},masterId:'ia',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ia'},{element:'dMainInfo.PartYearResident',value:'contains ia'},{element:'dMainInfo.NonResident',value:'contains ia'}],display:false},
	                              //IA state end
	                              
	                              //ID state start
	                              {id:'id', title:'ID',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'id40',title:'ID 40',form:{docName:'dID40',formName:'fID40'},masterId:'id',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains id'}],display:false},
	                              {id:'id43',title:'ID 43',form:{docName:'dID43',formName:'fID43'},masterId:'id',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains id'},{element:'dMainInfo.NonResident',value:'contains id'}],display:false},
	                              //ID state end
	                              
	                              //IL state start
	                              {id:'il', title:'IL',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'il1040',title:'IL 1040',form:{docName:'dIL1040',formName:'fIL1040'},masterId:'il',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains il'},{element:'dMainInfo.PartYearResident',value:'contains il'},{element:'dMainInfo.NonResident',value:'contains il'}],display:false},
	                              {id:'il8453',title:'IL 8453',form:{docName:'dSchIL8453',formName:'fSchIL8453'},masterId:'il',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains il'},{element:'dMainInfo.PartYearResident',value:'contains il'},{element:'dMainInfo.NonResident',value:'contains il'}],display:false},
	                              //IL state end
	                              
	                              //IN state start
	                              {id:'in', title:'IN',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'init40',title:'IN IT40',form:{docName:'dINIT40',formName:'fINIT40'},masterId:'in',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains in'}],display:false},
	                              {id:'init40pnr',title:'IN IT40 PNR',form:{docName:'dINIT40PNR',formName:'fINIT40PNR'},masterId:'in',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains in'},{element:'dMainInfo.NonResident',value:'contains in'}],display:false},
	                              //IN state end
	                              
	                              //KS state start
	                              {id:'ks', title:'KS',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ksk40',title:'KS K40',form:{docName:'dKSK40',formName:'fKSK40'},masterId:'ks',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ks'},{element:'dMainInfo.PartYearResident',value:'contains ks'},{element:'dMainInfo.NonResident',value:'contains ks'}],display:false},
	                              //KS state end
	                              
	                              //KY state start
	                              {id:'ky', title:'KY',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ky740',title:'KY 740',form:{docName:'dKY740',formName:'fKY740'},masterId:'ky',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ky'}],display:false},
	                              {id:'ky740np',title:'KY 740NP',form:{docName:'dKY740NP',formName:'fKY740NP'},masterId:'ky',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ky'},{element:'dMainInfo.NonResident',value:'contains ky'}],display:false},
	                              //KY state end
	                              
	                              //LA state start
	                              {id:'la', title:'LA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'lait540',title:'LA IT 540',form:{docName:'dLAIT540',formName:'fLAIT540'},masterId:'la',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains la'}],display:false},
	                              {id:'lait540b',title:'LA IT 540B',form:{docName:'dLAIT540B',formName:'fLAIT540B'},masterId:'la',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains la'},{element:'dMainInfo.NonResident',value:'contains la'}],display:false},
	                              //LA state end
	                              
	                              //MA state start
	                              {id:'ma', title:'MA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'maform1',title:'MA Form1',form:{docName:'dMAForm1',formName:'fMAForm1'},masterId:'ma',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ma'}],display:false},
	                              {id:'maform1nrpy',title:'MA Form1 NR/PY',form:{docName:'dMAForm1NRPY',formName:'fMAForm1NRPY'},masterId:'ma',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ma'},{element:'dMainInfo.NonResident',value:'contains ma'}],display:false},
	                              //MA state end
	                              
	                              //MD state start
	                              {id:'md', title:'MD',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'md502',title:'MD 502',form:{docName:'dMD502',formName:'fMD502'},masterId:'md',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains md'},{element:'dMainInfo.PartYearResident',value:'contains md'}],display:false},
	                              {id:'md505',title:'MD 505',form:{docName:'dMD505',formName:'fMD505'},masterId:'md',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains md'}],display:false},
	                              //MA state end
	                              
	                              //ME state start
	                              {id:'me', title:'ME',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'me1040',title:'ME 1040',form:{docName:'dME1040',formName:'fME1040'},masterId:'me',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains me'},{element:'dMainInfo.PartYearResident',value:'contains me'},{element:'dMainInfo.NonResident',value:'contains me'}],display:false},
	                              //ME state end
	                              
	                              //MI state start
	                              {id:'mi', title:'MI',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'mi1040',title:'MI 1040',form:{docName:'dMI1040',formName:'fMI1040'},masterId:'mi',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains mi'},{element:'dMainInfo.PartYearResident',value:'contains mi'},{element:'dMainInfo.NonResident',value:'contains mi'}],display:false},
	                              //MI state end
	                              
	                              //MN state start
	                              {id:'mn', title:'MN',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'mnm1',title:'MN M1',form:{docName:'dMNM1',formName:'fMNM1'},masterId:'mn',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains mn'},{element:'dMainInfo.PartYearResident',value:'contains mn'},{element:'dMainInfo.NonResident',value:'contains mn'}],display:false},
	                              //MN state end
	                              
	                              //MO state start
	                              {id:'mo', title:'MO',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'mo1040',title:'MO 1040',form:{docName:'dMO1040',formName:'fMO1040'},masterId:'mo',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains mo'},{element:'dMainInfo.PartYearResident',value:'contains mo'},{element:'dMainInfo.NonResident',value:'contains mo'}],display:false},
	                              //MO state end
	                              
	                              //MS state start	                              
	                              {id:'ms', title:'MS',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ms80105',title:'MS 80105',form:{docName:'dMS80105',formName:'fMS80105'},masterId:'ms',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ms'}],display:false},
	                              {id:'ms80205',title:'MS 80205',form:{docName:'dMS80205',formName:'fMS80205'},masterId:'ms',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ms'},{element:'dMainInfo.NonResident',value:'contains ms'}],display:false},
	                              //MS state end
	                              
	                              //MT state start
	                              {id:'mt', title:'MT',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'mt2',title:'MT 2',form:{docName:'dMT2',formName:'fMT2'},masterId:'mt',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains mt'},{element:'dMainInfo.PartYearResident',value:'contains mt'},{element:'dMainInfo.NonResident',value:'contains mt'}],display:false},
	                              //MT state end
	                              
	                              //NC state start
	                              {id:'nc', title:'NC',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ncd400',title:'NC D400',form:{docName:'dNCD400',formName:'fNCD400'},masterId:'nc',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains nc'},{element:'dMainInfo.PartYearResident',value:'contains nc'},{element:'dMainInfo.NonResident',value:'contains nc'}],display:false},
	                              //NC state end
	                              
	                              //ND state start
	                              {id:'nd', title:'ND',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'nd1',title:'ND 1',form:{docName:'dND1',formName:'fND1'},masterId:'nd',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains nd'},{element:'dMainInfo.PartYearResident',value:'contains nd'},{element:'dMainInfo.NonResident',value:'contains nd'}],display:false},
	                              //ND state end
	                              
	                              //NE state start
	                              {id:'ne', title:'NE',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ne1040n',title:'NE 1040N',form:{docName:'dNE1040N',formName:'fNE1040N'},masterId:'ne',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ne'},{element:'dMainInfo.PartYearResident',value:'contains ne'},{element:'dMainInfo.NonResident',value:'contains ne'}],display:false},
	                              //NE state end
	                              
	                              //NJ state start
	                              {id:'nj', title:'NJ',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'nj1040',title:'NJ 1040',form:{docName:'dNJ1040',formName:'fNJ1040'},masterId:'nj',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains nj'},{element:'dMainInfo.PartYearResident',value:'contains nj'}],display:false},
	                              {id:'nj1040nr',title:'NJ 1040NR',form:{docName:'dNJ1040NR',formName:'fNJ1040NR'},masterId:'nj',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains nj'}],display:false},
	                              //NJ state end
	                              
	                              //NM state start
	                              {id:'nm', title:'NM',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'nmpit1',title:'NM PIT 1',form:{docName:'dNMPIT1',formName:'fNMPIT1'},masterId:'nm',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains nm'},{element:'dMainInfo.PartYearResident',value:'contains nm'},{element:'dMainInfo.NonResident',value:'contains nm'}],display:false},
	                              //NM state end
	                              
	                              //OH state start
	                              {id:'oh', title:'OH',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ohit1040',title:'OH IT 1040',form:{docName:'dOHIT1040',formName:'fOHIT1040'},masterId:'oh',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains oh'},{element:'dMainInfo.PartYearResident',value:'contains oh'},{element:'dMainInfo.NonResident',value:'contains oh'}],display:false},
	                              {id:'ohit2023',title:'OH IT 2023',form:{docName:'dOHIT2023',formName:'fOHIT2023'},masterId:'oh',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains oh'},{element:'dMainInfo.NonResident',value:'contains oh'}],display:false},
	                              {id:'ohitw2',title:'OH W2',form:{docName:'dOHW2',formName:'fOHW2'},masterId:'oh',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains oh'},{element:'dMainInfo.PartYearResident',value:'contains oh'},{element:'dMainInfo.NonResident',value:'contains oh'}],display:false},
	                              //OH state end
	                              
	                              //NY state start
	                              {id:'ny', title:'NY',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'nyit201',title:'NY IT 201',form:{docName:'dNYIT201',formName:'fNYIT201'},masterId:'ny',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ny'}],display:false},
	                              {id:'nyit203',title:'NY IT 203',form:{docName:'dNYIT203',formName:'fNYIT203'},masterId:'ny',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ny'},{element:'dMainInfo.NonResident',value:'contains ny'}],display:false},
	                              {id:'nywkt203pyincallowkt',title:' NY 203 PY Income Allocation Wkt',form:{docName:'dNYWkt203PYIncAllowkt',formName:'fNYWkt203PYIncAllowkt'},masterId:'ny',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ny'},{element:'dMainInfo.NonResident',value:'contains ny'}],display:false},
	                              
	                              //NY state end
	                              
	                              //OK state start
	                              {id:'ok', title:'OK',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ok511',title:'OK 511',form:{docName:'dOK511',formName:'fOK511'},masterId:'ok',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ok'}],display:false},
	                              {id:'ok511nr',title:'OK 511NR',form:{docName:'dOK511NR',formName:'fOK511NR'},masterId:'ok',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains ok'},{element:'dMainInfo.NonResident',value:'contains ok'}],display:false},
	                              //OK state end
	                              
	                              //OR state start
	                              {id:'or', title:'OR',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'or40',title:'OR 40',form:{docName:'dOR40',formName:'fOR40'},masterId:'or',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains or'}],display:false},
	                              {id:'or40p',title:'OR 40P',form:{docName:'dOR40P',formName:'fOR40P'},masterId:'or',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains or'}],display:false},
	                              {id:'or40n',title:'OR 40N',form:{docName:'dOR40N',formName:'fOR40N'},masterId:'or',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains or'}],display:false},
	                              //OR state end
	                              
	                              //PA state start
	                              {id:'pa', title:'PA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'pa40',title:'PA 40',form:{docName:'dPA40',formName:'fPA40'},masterId:'pa',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains pa'},{element:'dMainInfo.PartYearResident',value:'contains pa'},{element:'dMainInfo.NonResident',value:'contains pa'}],display:false},
	                              //PA state end
	                              
	                              //RI state start
	                              {id:'ri', title:'RI',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'ri1040l',title:'RI 1040L',form:{docName:'dRI1040L',formName:'fRI1040L'},masterId:'ri',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ri'},{element:'dMainInfo.PartYearResident',value:'contains ri'}],display:false},
	                              {id:'ri1040nr',title:'RI 1040NR',form:{docName:'dRI1040NR',formName:'fRI1040NR'},masterId:'ri',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains ri'}],display:false},
	                              //RI state end
	                              
	                              //SC state start
	                              {id:'sc', title:'SC',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'sc1040',title:'SC 1040',form:{docName:'dSC1040',formName:'fSC1040'},masterId:'sc',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains sc'},{element:'dMainInfo.PartYearResident',value:'contains sc'},{element:'dMainInfo.NonResident',value:'contains sc'}],display:false},
	                              //SC state end
	                              
	                              //UT state start
	                              {id:'ut', title:'UT',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'uttc40',title:'UT TC 40',form:{docName:'dUTTC40',formName:'fUTTC40'},masterId:'ut',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains ut'},{element:'dMainInfo.PartYearResident',value:'contains ut'},{element:'dMainInfo.NonResident',value:'contains ut'}],display:false},
	                              //UT state end
	                              
	                              //VA state start
	                              {id:'va', title:'VA',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'va760',title:'VA 760',form:{docName:'dVA760',formName:'fVA760'},masterId:'va',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains va'}],display:false},
	                              {id:'va760py',title:'VA 760PY',form:{docName:'dVA760PY',formName:'fVA760PY'},masterId:'va',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains va'}],display:false},
	                              {id:'va763',title:'VA 763',form:{docName:'dVA763',formName:'fVA763'},masterId:'va',active:false,custom:{},activeElements:[{element:'dMainInfo.NonResident',value:'contains va'}],display:false},
	                              //OR state end
	                              
	                              //VT state start
	                              {id:'vt', title:'VT',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'vtin111',title:'VTIN 111',form:{docName:'dVTIN111',formName:'fVTIN111'},masterId:'vt',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains vt'},{element:'dMainInfo.PartYearResident',value:'contains vt'},{element:'dMainInfo.NonResident',value:'contains vt'}],display:false},
	                              //UT state end
	                              
	                              //WI state start
	                              {id:'wi', title:'WI',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'wi1',title:'WI 1',form:{docName:'dWI1',formName:'fWI1'},masterId:'wi',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains wi'}],display:false},
	                              {id:'wi1npr',title:'WI 1NPR',form:{docName:'dWI1NPR',formName:'fWI1NPR'},masterId:'wi',active:false,custom:{},activeElements:[{element:'dMainInfo.PartYearResident',value:'contains wi'},{element:'dMainInfo.NonResident',value:'contains wi'}],display:false},
	                              //WI state end
	                              
	                              //WV state start
	                              {id:'wv', title:'WV',form:{},custom:{},isMaster:true,display:false,isState:true},
	                              {id:'wvit140',title:'WV IT 140',form:{docName:'dWVIT140',formName:'fWVIT140'},masterId:'wv',active:false,custom:{},activeElements:[{element:'dMainInfo.FullYearResident',value:'contains wv'},{element:'dMainInfo.PartYearResident',value:'contains wv'},{element:'dMainInfo.NonResident',value:'contains wv'}],display:false},
	                              //WV state end
	                              
	                              {id:'invoice', title:'Invoice',form:{docName:'dPriceList',formName:'fPriceList'},active: false,custom:{},display:true},	                              
	                              {id:'consentLetter', title:'Consent',form:{docName:'dConsetletter',formName:'fConsetletter'},active: false,custom:{},display:true,initFunction:"_initConsent()",isFixedScreen:true},
	                              //{id:'bank', title:'Bank',form:{docName:'dAtlasBankApp',formName:'fAtlasBankApp'},active: false,custom:{},display:true},
	                              {id:'atlasBank', title:'Bank',form:{docName:'dAtlasBankApp',formName:'fAtlasBankApp'},active: false,custom:{},display:false, activeElements:[{element:'dReturnInfo.strbank',value:'NAVIGATOR'}]},
	                              {id:'refundAdvantageBank', title:'Bank',form:{docName:'dRefundAdvantageBankApp',formName:'fRefundAdvantageBankApp'},active: false,custom:{},display:false,
		                            	  activeElements:[{element:'dReturnInfo.strbank',value:'REFUNDADVANTAGE'}]},
		                          {id:'epsBank', title:'Bank',form:{docName:'dEPSBankApp',formName:'fEPSBankApp'},active: false,custom:{},display:false,
			                           	  activeElements:[{element:'dReturnInfo.strbank',value:'EPS'}]},
			                      {id:'tpgBank', title:'Bank',form:{docName:'dTPGBankApp',formName:'fTPGBankApp'},active: false,custom:{},display:false,
				                       	  activeElements:[{element:'dReturnInfo.strbank',value:'TPG'}]},
								  {id:'rejectedReturn',title:'Rejection',form:{},active: false,custom:{},display:false,initFunction:"_initRejectedReturn()",isFixedScreen:true},
	                              {id:'bankRejection',title:'Bank Rejection',form:{},active: false,custom:{},display:false,initFunction:"_initBankRejection()",isFixedScreen:true},
	                              {id:'efileReturn',title:'E-File',form:{},active: false,custom:{},display:true,initFunction:"_initEfileReturn()",isFixedScreen:true}
	                              ];
	
	
	//color configuration for status
	var tabColorConfig = [
	                      {type:'success',selectedClassName:'highlight alert alert-success',bottomLineClassName:'success',className:'alert alert-success'},
	                      {type:'error',selectedClassName:'highlight alert alert-danger',bottomLineClassName:'danger',className:'alert alert-danger'}
	                      ];
	//Holding array of previously visited screen
	var previous = [];

	//Holding array of errors for current screen
	$scope.errorSummary = [];
	
	//Array having instance grid data
	var _dataForInstanceGrid = [];
	
	//array having column list (same from configuration)
	$scope.instanceGridColumns = [];
	
	//Boolean variable to show and hide the form on condition
	//Note :- this is done as we have to show the grid on full screen until the user click oin new button or on any row of the grid
	$scope.showForm = true;

	//Holding mutation observer
	var observer;
	
	//boolean variable for observer
	var isMutationInvoked = false;
	
	//Holding docIndex that needs to be preloaded
	var preloadInstanceGridDocIndex;
	
	//object that holds the parent tab ID and boolean variable of hasParent 
	//used to show the child tab under parent tab
	$scope.showChildTabProp = {};
	
	//holds the selected state for full year resident, part year resident and non resident
	$scope.selectedState = {
			fullYearResident:{},
			partYearResident:{},
			nonResident:{}
	};
	
	//object that keep the track of last selected state so that we can identify which state to remove and which to add
	var _lastselectedState = {};
	
	//boolean variable to show loading bar until form is loaded
	$scope.isInterviewFormLoading = true;
	
	//boolean variable to show and hide the loading bar same as isInterviewFormLoading
	//Note :- isInterviewFormLoading toggle when the form get loaded but in some cases though the form get loaded we still have some proceeses to be executed
	//so in order to show loading bar even though the form has loaded we have declare this boolean variable which will toggle only after all the processes get finish.
	$scope.isOtherOPerationInProcess = false;;
	
	//Check for privileges
    $scope.userCan = function (privilege) {
        return userService.can(privilege);
    };
	
	//Init UI (like instance grid, etc..)
	var _initUI = function(){
		$scope.instanceGrid = new ngTableParams({
            page: 1,            // show first page
            count: 99,           // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
        	counts: [],//No paging
            total: _dataForInstanceGrid.length, // length of data
            sortingIndicator:'div', // decides whether to show sorting indicator next to header or right side.
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting()?$filter('orderBy')(_dataForInstanceGrid, params.orderBy()):_dataForInstanceGrid;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
	};
	
	/**
	 * method that will get the status of all tab from the _taxReturn of returnService
	 * and will assign to custom object each tab config object
	 * This is done to keep the track of interview tabs
	 */
	var _initConfig = function(){
		var colorConfig;
		var interviewAllTabStatus = returnService.getInterviewAllTabStatus();
		if(!_.isUndefined(interviewAllTabStatus) && !_.isEmpty(interviewAllTabStatus)){
			_.forEach($scope.interviewTabsConfig,function(tabObj){
				tabObj.custom = !_.isUndefined(interviewAllTabStatus[tabObj.id])?interviewAllTabStatus[tabObj.id]:{};
				_setTabColorClassName(tabObj);
			});
		}
		//condition to check whether the url contains the 'rejected' or 'bankRejected' keyword
		if($location.path().indexOf('/rejected') > -1 || $location.path().indexOf('/bankRejected') > -1 || $location.path().indexOf('/alerts') > -1){  /**/
			$scope.isOtherOPerationInProcess = true;//toogle the variable to true as some processes are to be executed before showing the form
		}else{
			//condition to set the tab with their respective status
			if(!_.isUndefined($scope.interviewTabsConfig[0].custom)){
				$scope.errorSummary = (!_.isUndefined($scope.interviewTabsConfig[0].custom.errorSummary) && !_.isUndefined($scope.interviewTabsConfig[0].custom.errorSummary[$scope.formScope.docIndex]))?$scope.interviewTabsConfig[0].custom.errorSummary[$scope.formScope.docIndex].error:[];
				//condition to check the status of first tab
				if(!_.isUndefined($scope.interviewTabsConfig[0].custom.status)){
					colorConfig = _.find(tabColorConfig,{type:$scope.interviewTabsConfig[0].custom.status});
					//setting the color of bottom line depending on the status of first tab
					$scope.tabHeadingBottomLineColor = colorConfig.bottomLineClassName;
				}
			}
		}
		
			$scope.interviewTabsConfig.push({id:'alertReturn',title:'Alert',form:{},active: false,custom:{},display:false,initFunction:"_initAlertReturn()",isFixedScreen:true});
			//Load Alert  first (if any)
			$scope.initAlertMessageList().then(function () {
				//Note :- below code is to display reject tab
				if (!_.isUndefined($scope.alertList) && $scope.alertList.length > 0) {
					$scope.isOtherOPerationInProcess = false;
					var getAlertTabConfig = _getViewConfig('alertReturn');
					if (!_.isUndefined(getAlertTabConfig)) {
						getAlertTabConfig.display = true;
						if($location.path().indexOf('/alerts') > -1){
							_toggleCurrentView(_getViewConfig().id);
							//we are setting the class name of first tab
							//Note :- this is done because initially this tab is active and is highlighted but as url hold the 'rejected' keyword we need to assign the noram class to it
							_setTabColorClassName(_getViewConfig("personalInfo"));
							getAlertTabConfig.active = true;
							$scope.loadInterviewForm();
						}
					}
				}
			});
		
		//Load rejection first (if any)
		$scope.initRejectionErrorList().then(function(){
			//Note :- below code is to display reject tab
			if(!_.isUndefined($scope.rejectionErrorList) && $scope.rejectionErrorList.length > 0){
				$scope.isOtherOPerationInProcess = false;
				var getRejectedTabConfig = _getViewConfig('rejectedReturn');
				if(!_.isUndefined(getRejectedTabConfig)){
					getRejectedTabConfig.display = true;
					//checks whether the url hold the 'rejected' keyword if yes than we display the reject tab
					if($location.path().indexOf('/rejected') > -1){
						_toggleCurrentView(_getViewConfig().id);
						//we are setting the class name of first tab
						//Note :- this is done because initially this tab is active and is highlighted but as url hold the 'rejected' keyword we need to assign the noram class to it
						_setTabColorClassName(_getViewConfig("personalInfo"));
						getRejectedTabConfig.active = true;
						$scope.loadInterviewForm();
					}
				}
			}
		});

		
		//Load bank rejection first (if any)
		$scope.initBankRejectionErrorList().then(function(){
			//below code is to display bank reject tab
			if(!_.isUndefined($scope.bankRejectionErrorList) && $scope.bankRejectionErrorList.length > 0){
				$scope.isOtherOPerationInProcess = false;
				var getRejectedTabConfig = _getViewConfig('bankRejection');
				if(!_.isUndefined(getRejectedTabConfig)){
					getRejectedTabConfig.display = true;
					//checks whether the url hold the 'bankRejected' keyword if yes than we display the bank rejected tab
					if($location.path().indexOf('/bankRejected') > -1){
						_toggleCurrentView(_getViewConfig().id);
						//we are setting the class name of first tab
						//Note :- this is done because initially this tab is active and is highlighted but as url hold the 'rejected' keyword we need to assign the noram class to it
						_setTabColorClassName(_getViewConfig("personalInfo"));
						getRejectedTabConfig.active = true;
						$scope.loadInterviewForm();
					}
				}
			}
		});
		
		//we have to update the config detail initially when the return get loaded
		$scope.updateAllTabConfig();
		_initInterviewStates();
		/**
		 * Note:- set timeout to set the initial height of screen 
		 */
		$timeout(function(){
			_getScreenElementHeight();
		},0);
	};
	
	/**
	 * method to initialize state which are in return
	 */
	var _initInterviewStates = function(){
		//condition to check whether the current return holds any state
		if(!_.isUndefined($scope.availableStates) && !_.isNull($scope.availableStates) && !_.isEmpty($scope.availableStates)){
			//here we have assigned the available state of parrent $scope to the child scope
			//Note :- this is done because when we add or remove state _initState() of parent controller is called which update the $scope.availableState variavle of parent
			//due to which object in $scope.selectedState and in $scope.availableState differs and dropdown are not coming selected when we again switch to
			//select state tab on UI.
			if($scope.betaOnly() == false && $scope.taxYear == '2018'){
				$scope.listOfState = _.filter($scope.availableStates,{isDisabled:false});
			}else{
				$scope.listOfState = $scope.availableStates;
			}
			//variable that holds the added states
			var _addedState = _.filter($scope.availableStates,{isAdded:true});
			//condition to check whether states are their
			if(!_.isEmpty(_addedState)){
				//Reset selected states as we are going to build it again
				$scope.selectedState = {
					fullYearResident:{},
					partYearResident:{},
					nonResident:{}
				};
				//loop over available states to get the added state for respective resident type
				_.forEach(_addedState,function(stateObj){
					//condition to check whether state belongs to full year resident
					if(stateObj.residencyStatus == 'FY'){
						if(_.isUndefined($scope.selectedState.fullYearResident.firstState)){
							$scope.selectedState.fullYearResident.firstState = stateObj;
						}else if(_.isUndefined($scope.selectedState.fullYearResident.secondState)){
							$scope.selectedState.fullYearResident.secondState = stateObj;
						}
					}else if(stateObj.residencyStatus == 'PY'){//condition to check whether state belongs to part year resident
						if(_.isUndefined($scope.selectedState.partYearResident.firstState)){
							$scope.selectedState.partYearResident.firstState = stateObj;
						}else if(_.isUndefined($scope.selectedState.partYearResident.secondState)){
							$scope.selectedState.partYearResident.secondState = stateObj;
						}
					}else if(stateObj.residencyStatus == 'NR'){//condition to check whether state belongs to non resident
						if(_.isUndefined($scope.selectedState.nonResident.firstState)){
							$scope.selectedState.nonResident.firstState = stateObj;
						}else if(_.isUndefined($scope.selectedState.nonResident.secondState)){
							$scope.selectedState.nonResident.secondState = stateObj;
						}
					}
				});
			}
			
			//we have kept the copy of initially selected state of return
			//Note :- this is done to keep the track of old selected state so if user change any state then we can compare it and can remove those state and add new state
			_lastselectedState = angular.copy($scope.selectedState);
		}
	};
	
	$scope.pushInterviewConfig = function(){
		var interviewAllTabStatus = {};
		//iterate to get the last selected tab and set its className preperty to normal class name
		_.forEach($scope.interviewTabsConfig,function(tabConfigObj){
			interviewAllTabStatus[tabConfigObj.id] = tabConfigObj.custom; 
		});
		//called the function of return service to set the interview object in _taxReturn
		returnService.saveInterviewAllTabStatus(interviewAllTabStatus);	
	};

	//Saving Return detail and open it in normal mode 
	$scope.goToInputMode = function(){
		var path;
		$scope.pushInterviewConfig();		
		$scope.saveReturn().then(function(){
			//we are using $parent here, because amgularjs may not do two way databinding if it is not object. Remember '.' rule.
			//If there is no '.' (dot) in variable, no two way data binding.
			$scope.$parent.hasPermissionTochangeLocation=true;
			//Note :- to re-initialize the controller we redirect user to blank page and from their again to the desire page
			if($location.path().indexOf('/rejected') > -1){
				path=('return/edit/'+$routeParams.id+'/rejected').toString().replace(/\//g,'_');
			}if($location.path().indexOf('/alerts') > -1){
				path=('return/edit/'+$routeParams.id+'/alerts').toString().replace(/\//g,'_');
			}else if($location.path().indexOf('/bankRejected') > -1){
				path=('return/edit/'+$routeParams.id+'/bankRejected').toString().replace(/\//g,'_');
			}else{
				path=('return/edit/'+$routeParams.id).toString().replace(/\//g,'_');
			}
			$location.path("/redirect/" + path);
		});
	};
	
	/**
	 * method to close the interview mode
	 */
	$scope.closeInterviewReturn = function(){
		$scope.pushInterviewConfig();
		//set previous path customReturn if return open from custom template list
		var previousPathForOtherNav = basketService.popItem('previousPathForOtherNav');
		if(!_.isUndefined(previousPathForOtherNav)){
            $location.path(previousPathForOtherNav);
        } else {
            $location.path('home');
        }
	}; 
	
	/**
	 * method to be called on the save click of the table grid to save the instance detail
	 */
	$scope.saveFormInstance = function(){
		if(!_.isUndefined($scope.formScope) && !_.isUndefined($scope.formScope.currentForm)){
			// we have check weather the current form has error if yes than we show the error and save the return
			validateScreen($scope.formScope.currentForm.docName,$scope.formScope.currentForm.docIndex).then(function(success){
				//called the method to update the errorSummary array of custom object in tab config
				_updateTabErrSummary(_getViewConfig()); 
				if(!_.isUndefined(_getViewConfig().custom.errorSummary) && !_.isUndefined(_getViewConfig().custom.errorSummary[$scope.formScope.docIndex]) && !_.isUndefined(_getViewConfig().custom.errorSummary[$scope.formScope.docIndex].error)){
					$scope.errorSummary = _getViewConfig().custom.errorSummary[$scope.formScope.docIndex].error;
				}
				//Push interview config (color of tabsa and error messages) to save with return				
				$scope.pushInterviewConfig();
				$scope.saveReturn();
				//Refresh grid if exist on current screen
				_reloadInstanceGrid(_getViewConfig().form.docName);
				_setTabColorClassName(_getViewConfig());
			},function(error){
				$log.error(error);
			});
		}
	};
	
	//load form (or statement) from instance grid. Same tab with different doc (different index doc)
	$scope.loadIsntanceGridForm = function(_docIndex){	
		//boolean variable toggle to true when we click the row in grid to load form
		$scope.isInterviewFormLoading = true;
		// Note : we have to set focus for selected row on grid.
		var _gridHeader = document.getElementById('instanceGridHead');
		var _gridBody = document.getElementById('instanceGridBody');
		var _gridRow = document.getElementById('instanceGridRow-'+_docIndex);
		if(_gridHeader != null && _gridBody != null && _gridRow != null){
			//Note: This is scroll to selected row in grid.
			_gridBody.scrollTop= _gridRow.offsetTop - _gridHeader.offsetHeight;
		}
		
		var _tabConfig = _getViewConfig();
		//list of forms for current docName (all form instance of current form in return)
		var _forms = returnService.getForm(_tabConfig.form.docName);
		
		//if _forms array is empty, that means this is statement (special statement form)
		if(_.isEmpty(_forms)){
			//As we do not have special statement form entry in form list. We have to get form property and add docIndex in it
			var _form = angular.copy(returnService.getFormProp(_tabConfig.form.formName));			
			_form.docIndex = _docIndex;
			
			//set current statement docIndex in config to use it time of remove. Please make sure to reset it when required
			_tabConfig.form.docIndex = _docIndex;
			
			//load form
			$scope.loadForm(_form);						
		}else{//Normal Form
			//filter form list based on passed docIndex and load it Note: we have to parse docIndex from string to number.
			$scope.loadForm(_.find(_forms,{docIndex:parseInt(_docIndex)}));
		}
		//we have assign the error of instance that is loaded from the grid
		$scope.errorSummary = (!_.isUndefined(_tabConfig.custom.errorSummary) && !_.isUndefined(_tabConfig.custom.errorSummary[$scope.formScope.docIndex]))?_tabConfig.custom.errorSummary[$scope.formScope.docIndex].error:[];
		//we have to toggle the boolean variable to show the form as soon as user click on the row of table
		$scope.showForm = true;
	};
	
	//delete form (or statement) from instance grid. Same tab with different doc (different index doc)
	$scope.removeInstanceGridForm = function(_docIndex){
		//list of forms for current docName (all form instance of current form in return)
		var _forms = returnService.getForm(_getViewConfig().form.docName);
		
		
		if(!_.isEmpty(_forms)){
			//Form that need to be remove
			var _formToRemove = _.find(_forms,{docIndex:parseInt(_docIndex)});
			
			//remove form asked by user
			$scope.removeForm(_formToRemove);
			//remove the error summary of instance
			_removeInstanceErrorSummary(_docIndex);
			//reload grid
			_reloadInstanceGrid(_getViewConfig().form.docName);
		}else{//If _forms is empty that means this request is for statement not form
			var _currentTabConfig = _getViewConfig();
			
			//Remove doc using return service
			returnService.removeChildDoc(_currentTabConfig.form.docName,_docIndex).then(function(success){
				//reload grid
				_reloadInstanceGrid(_currentTabConfig.form.docName);
				//if user has removed currently loaded statement instance then reset docIndex configuration
				if(_currentTabConfig.form.docIndex==_docIndex){
					//set blank form in tax-form
					$scope.loadForm({});
					//reset docIndex
					delete _currentTabConfig.form.docIndex;
					$scope.errorSummary = [];
				}
				//remove the error summary of instance
				_removeInstanceErrorSummary(_docIndex);
			},function(error){
				$log.error(error);
			});
		}
		
	};
	
	/**
	 * method to remove the error summary of any instance of form or instance of statement
	 * which is deleted from the grid
	 * @param _docIndex - key in the errorSummary object of custom object  
	 */
	var _removeInstanceErrorSummary = function(_docIndex){
		var _currentTabConfig = _getViewConfig();
		if(!_.isUndefined(_docIndex) &&!_.isUndefined(_currentTabConfig.custom.errorSummary) && !_.isUndefined(_currentTabConfig.custom.errorSummary[_docIndex])){
			_currentTabConfig.custom.errorSummary = _.omit(_currentTabConfig.custom.errorSummary,_docIndex);
			//Note :- default we set the satus of tab as success
			_currentTabConfig.custom.status = 'success';
			//condition to check the errorSummary 
			if(!_.isUndefined(_currentTabConfig.custom.errorSummary) && !_.isEmpty(_currentTabConfig.custom.errorSummary)){
				//loop over error summary and if any instance holds the error then we will turn tab status as error
				_.forEach(_currentTabConfig.custom.errorSummary,function(formStatusObj){
					if(formStatusObj.status == 'error'){
						_currentTabConfig.custom.status = 'error';
						return false;
					}
				});
			}else{
				//we set the status as blank if errorSummary is empty
				_currentTabConfig.custom.status = '';
			}
			_setTabColorClassName(_currentTabConfig);
		}
	}; 
	
	//Add Form (or statement) from instance grid
	$scope.addInstanceGridForm = function(){
		//toggle boolean variable to true when we hit the new button to add new form
		$scope.isInterviewFormLoading = true;
		$scope.showForm = true;
		//we have to re-initialize error summary when we add new instance 
		$scope.errorSummary = [];
		//Third argument will help to forcefully add new form instead of checking if form is already exist (multi instance case).
		$scope.loadInterviewForm(_getViewConfig().form.docName,_getViewConfig().form.formName,true);
		_getScreenElementHeight();
	};
	
	/**
	 * method to highlight the row of grid with red border if the instance hold the error
	 * @param _docIndex - holds the index of the instance
	 */
	$scope.isError = function(_docIndex){
		var _currentTabConfig = _getViewConfig();
		if(!_.isUndefined(_docIndex) && !_.isUndefined(_currentTabConfig.custom.errorSummary) && !_.isUndefined(_currentTabConfig.custom.errorSummary[_docIndex])){
			if(!_.isUndefined(_currentTabConfig.custom.errorSummary[_docIndex].error) && !_.isEmpty(_currentTabConfig.custom.errorSummary[_docIndex].error)){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	};
	
	/**
	 * method to toggle the current tab on the index passed as parameter
	 * simply set the active property of the tab to false
	 */
	var _toggleCurrentView = function(tabId){
		var currentTabDetail = _getViewConfig(tabId);
		if(!_.isUndefined(currentTabDetail) && !_.isNull(currentTabDetail) && !_.isEmpty(currentTabDetail))
			currentTabDetail.active = false;
	}; 

	/**
	 * method to get the current active tab id and if the tab has the master tab then it will also give the parent tab id 
	 */
	var _getCurrentTabId = function(){
		//object that holds two property parentTabIndex and childTabIndex(if exist)
		var tabIds= {};
		var currentTabDetail = _.find($scope.interviewTabsConfig,{active:true});
		if(!_.isUndefined(currentTabDetail) && !_.isNull(currentTabDetail) && !_.isEmpty(currentTabDetail)){
			tabIds.currentTabId = currentTabDetail.id;
			//condition to check whether the current tab is the child tab holding masterId
			//If condition is true we wrap childTabIndex in the tabIndex object
			if(!_.isUndefined(currentTabDetail.masterId)){
				var getParentTabDetail = _getViewConfig(currentTabDetail.id);
				if(!_.isUndefined(getParentTabDetail) && !_.isNull(getParentTabDetail) && !_.isEmpty(getParentTabDetail))
					tabIds.parentTabId = getParentTabDetail.id;
			}
		}
		return tabIds;
	};

	/**
	 * method to get the index of the next tab to go
	 * @param curTabId - holds the id of current active tab
	 */
	var _getNextTabId = function(curTabId){
		var currentTabDetail = _getViewConfig(curTabId);
		//get id of next applicable screen form return service
			if(!_.isUndefined(currentTabDetail.nextScreenElement))
				return _getElementValue(currentTabDetail.nextScreenElement);
			else{
				//get the index of current screen 
				var _getCurrentTabIndex = _.findIndex($scope.interviewTabsConfig,function(tabObj){
					return tabObj.active == true;
				});
				if(_getCurrentTabIndex > -1){
					//calling the recursive function to get the next tab it
					return _findTabId(_getCurrentTabIndex);
				}
			}
	};
	
	/**
	 * recursive method to get the next Tab id to go
	 * @param currentTaBIndex - holds the index of the current active tab
	 */
	var _findTabId = function(currentTabIndex){
		currentTabIndex++;
		// when currentTabIndex greter then interviewTabsConfig length then reset currentTabIndex
		if(currentTabIndex > ($scope.interviewTabsConfig.length - 1)) {
			currentTabIndex = 0;
		}
		if(_.isUndefined($scope.interviewTabsConfig[currentTabIndex].isMaster) && $scope.interviewTabsConfig[currentTabIndex].display == true){
			return  $scope.interviewTabsConfig[currentTabIndex].id;
		}else if(!_.isUndefined($scope.interviewTabsConfig[currentTabIndex].isMaster) && $scope.interviewTabsConfig[currentTabIndex].isMaster == true){
			var childTab = _.find($scope.interviewTabsConfig,{masterId:$scope.interviewTabsConfig[currentTabIndex].id,display:true});
			return _.isUndefined(childTab)?_findTabId(currentTabIndex):childTab.id;
		}else{
			return _findTabId(currentTabIndex);
		}	
	};

	/**
	 * method to fetch the object of screen configuration
	 * @param viewId - holds the id of the screen whose configuration is to be fetched 
	 */
	var _getViewConfig = function(viewId){
		if(!_.isUndefined(viewId)){
			return _.find($scope.interviewTabsConfig,{id:viewId});
		}else{
			return _.find($scope.interviewTabsConfig,{active:true});
		}		
	};
	
	/**
	 * method to change the tab when clicked on nextTab or tabHeader
	 * @param prevTabId - holds the id of the previously active tab
	 * @param curTabId - holds the id of the tab to which we have to go
	 * Note: We have to remove code duplication. One for validationRequired and second for validation does not require
	 */
	var _changeTab = function(prevTabId,curTabId,avoidValidation){
		//boolean variable to show and hide loading form
		$scope.isInterviewFormLoading = true;
		//condition to check whether fixedScreen is true if it is than we make it false
		if($scope.fixedScreen == true){
			$scope.fixedScreen = false;
		}
		var previousTabDetail = _getViewConfig(prevTabId);
		//Blank error Summary if any
		$scope.errorSummary = [];
		
		//Perform review for that doc (screen). If avoidValidation is not passed as true
		if(avoidValidation!=true && !_.isUndefined($scope.formScope)){
			//assign the docName if the currentForm of formScope exist otherwise we fetch the docName form the tab config
			var _docName = !_.isUndefined($scope.formScope.currentForm)?$scope.formScope.currentForm.docName:_getViewConfig(prevTabId).form.docName;
			var _docIndex = !_.isUndefined($scope.formScope.currentForm)?$scope.formScope.currentForm.docIndex:undefined;
			validateScreen(_docName,_docIndex).then(function(success){
				_toggleCurrentView(prevTabId);
				
				//condition to check that previous tab is not fixed screen   
				if(previousTabDetail.isFixedScreen != true){					
					//if error summary has any value 
					_updateTabErrSummary(previousTabDetail);
					//called to set the className property in custom object of tab config according to the status
					_setTabColorClassName(previousTabDetail);
				}else if(previousTabDetail.isFixedScreen == true && !_.isUndefined(previousTabDetail.masterId)){//Note :- we have to check this condition because in some case fixed screen are as child tab 
					_setMasterTabColorClassName(previousTabDetail);
				}
				if(_.isUndefined(curTabId)){
					curTabId = previous.pop();
				}else{
					previous.push(prevTabId);
				}
				var tabDetail = _getViewConfig(curTabId);
				//check whether the tab's display property is false if yes than we fetch the next tab of it whose display is true
				//Note :- this is done because sometime it happen that user remove the data of any form which activate other tab and then click on that tab
				//whose display is now false. in such scenerio we just jump the user to next tab
				if(tabDetail.display == false){
					//temporary we activate te tab to fetch the next tab of it 
					tabDetail.active = true;
					var _nextTabId = _getNextTabId(curTabId);
					//after we get the next Id we toggle the active property to false
					_toggleCurrentView(tabDetail.id);
					//fetch the tab config whose id we have obtained
					tabDetail = _getViewConfig(_nextTabId);
				}
				//variable that holds the boolean value is true when the current tab is of state else it is false
				//Note :- this is done to make the state form design properly as the form for states are generated automaticaly and are not handled manually
				$scope.isState  = (!_.isUndefined(tabDetail.masterId))?_getViewConfig(tabDetail.masterId).isState:false; 
				if(!_.isUndefined(tabDetail) && !_.isNull(tabDetail) && !_.isEmpty(tabDetail)){
					tabDetail.active = true;
					_setTabColorClassName(tabDetail);
					if(_.isUndefined(tabDetail.instanceGridColumns)){
						$scope.loadInterviewForm(tabDetail.form.docName,tabDetail.form.formName);
					}else if(!_.isUndefined(tabDetail.instanceGridColumns)){
						//condition to check whether the tab holds the form object
						if(!_.isUndefined(tabDetail.form) && !_.isEmpty(tabDetail.form)){
							//method called to get form data
							//Note :- this is done as in UI before the form get loaded the data is displayed and the thousand seprater filter is not applied
							//so here after the form get loaded we reload the grid so that filter get applied
							returnService.getFormData(tabDetail.form).then(function(response){
								//we toggle the boolean variable of loading bar to false if the tab contains the grid and form is not to be loaded
								$scope.isInterviewFormLoading = false;
								$scope.loadInterviewForm(tabDetail.form.docName,tabDetail.form.formName);
							},function(error){
								$log.debug(error);
								$scope.isInterviewFormLoading = false;
							});
						}else{
							//If the tabDetail dont hold the form object we dont call the service method to get form data and simply toggle the loadding bar to false
							$scope.isInterviewFormLoading = false;
						}
					}
					//condition to check whether loaded form contains error or not
					if(!_.isUndefined(tabDetail.custom.errorSummary) && !_.isUndefined(tabDetail.custom.errorSummary[$scope.formScope.docIndex]) && !_.isUndefined(tabDetail.custom.errorSummary[$scope.formScope.docIndex].error))
						$scope.errorSummary = tabDetail.custom.errorSummary[$scope.formScope.docIndex].error;
				}
				
				//method to toggle previous button
				_togglePreviousBtn();
				//method called to show all child tab if the current tab is parent tab
				_showChildTab();
			},function(error){
				console.log(error);
				$scope.isInterviewFormLoading = false;
			});
		}
	};
	
	/**
	 * method to update the errorSummary array of custom object in tab config
	 */
	var _updateTabErrSummary = function(tabDetial){
		//If error summary is not defined
		if(_.isUndefined(tabDetial.custom.errorSummary)){
			tabDetial.custom.errorSummary = {};
		}
			
		//condition that just checks the error lenght if error exists
		if($scope.errorSummary.length==0){
			tabDetial.custom.status = 'success';
			tabDetial.custom.errorSummary[$scope.formScope.docIndex] = {status:'success'};
			tabDetial.custom.errorSummary[$scope.formScope.docIndex].error = [];
			//looped over the error summary to check if any instance has an error
			_.forEach(tabDetial.custom.errorSummary,function(formStatusObj){
				if(formStatusObj.status == 'error'){
					tabDetial.custom.status = 'error';
					return false;
				}
			});
		}else{
			tabDetial.custom.status = 'error';
			tabDetial.custom.errorSummary[$scope.formScope.docIndex] = {status:'error'};
			tabDetial.custom.errorSummary[$scope.formScope.docIndex].error = $scope.errorSummary;
			$scope.errorSummary = [];
		}
	};
	
	/**
	 * method that simply enable and disable previous button
	 */
	var _togglePreviousBtn = function(){
		//condition that checks the array of previous history
		if(previous.length > 0)
			$scope.previousBtnEnable = true;
		else
			$scope.previousBtnEnable = false;
	};

	$scope.currentTabId ;

	/**
	 * method called when user clicked on the tabs or next button 
	 * It will redirect user to that respective view
	 * @param viewDetail - that holds the object of the view to which user want to go
	 */
	$scope.changeTab = function(viewDetail,avoidValidation){	
		var tabIds = _getCurrentTabId();
		$scope.currentTabId = _getNextTabId(tabIds.currentTabId);
		if(!_.isUndefined(_getViewConfig().executeFunction)){
			//we have call the function that are to be executed before change tab in timeout 
			//we have done this to give a break to angular so that it can identify the changes in scope variable
			//Note :- we had to do this as the loading bar was not shown if we dont keep the timeout
			$timeout(function(){
				//fetch the next tab ID if viewDetail exist
				var nextTabId;
				if(!_.isUndefined(viewDetail)){
					if(viewDetail.isMaster != true){//condition to check whether received tabConfig is not master
						nextTabId = viewDetail.id;
					}else if(viewDetail.isMaster == true){//condition to check that tab clicked is master tab 
						nextTabId = _getActiveChildId(viewDetail);
					}
				}else{//if viewDetail is undefined we pass nextTabId as blank 
					nextTabId = '';//Note:- we send blank in next tab id as in such a scenerio user has clicked on next button and that we handle in the function that is to be executed
				}
				//variable storing function name as a string with nextTabId as a parameter	  
				var executeFunction = _getViewConfig().executeFunction+'("'+nextTabId+'")';
				//This will evaluate the string as the function
				eval(executeFunction);
			},50);			
		}else if((_.isUndefined(viewDetail) || (tabIds.currentTabId != viewDetail.id && _getViewConfig().masterId != viewDetail.id)) && $scope.sameStateErrMsg != true){
			var nextTabId;
			if(!_.isUndefined(viewDetail)){
				if(viewDetail.isMaster != true){//condition to check whether received tabConfig is not master
					nextTabId = viewDetail.id;
				}else if(viewDetail.isMaster == true){//condition to check that tab clicked is master tab 
					nextTabId = _getActiveChildId(viewDetail);
				}
			}else{//when viewDetail is undefined we simply get the nextTabId by passing the current tab id to the function
				nextTabId = _getNextTabId(tabIds.currentTabId);
			}
			_changeTab(tabIds.currentTabId,nextTabId,avoidValidation);
		}
	};
	
	/**
	 * method to get the active child of master
	 */
	var _getActiveChildId = function(tabDetail){
		//retreive the first active child tab of master tab which is clicked
		var _activeChildConfig = _.find($scope.interviewTabsConfig,{masterId:tabDetail.id,display:true});
		if(!_.isUndefined(_activeChildConfig)){
			return _activeChildConfig.id;
		}else{
			return "";
		}
	};
	
	/**
	 * method called on previous button press
	 * redirect user to previous view
	 */
	$scope.onPreviousClick = function(){
		var tabIds = _getCurrentTabId();
		//condition to restrict the tab change if two same state are selected in state tab
		if($scope.sameStateErrMsg != true){
			_changeTab(tabIds.currentTabId);
		}
	};

	/**
	 * method load the form depending on the param passed
	 * @param docName - holds the docName of form which is to be loaded
	 * @param formName - holds the formName which is to be loaded 
	 * Note: We have duplicated code to check if form (tab) has instance grid here and in _reloadInstanceGrid function. We have to remove this duplication
	 */
	$scope.loadInterviewForm = function(docName,formName,letsAdd){
		//If formName & docName is undefined that means we have to load fixed html instead of any form
		if(_.isUndefined(formName) && _.isUndefined(docName)){
			//make form screen blank. As we do not want to display any form.
			$scope.loadForm({});
			
			//Apply html for fixed screen
			var _element = angular.element(document.getElementById("fixedScreen"));
			_element.empty();
			_element.html("<ng-include src=\"'/taxAppJs/return/interview/partials/"+_getViewConfig().id+".html'\"> </ng-include>");
			$compile(_element.contents())($scope);
			//make this visible
			$scope.fixedScreen = true;
			//boolean variable to show the error msg instead of fixed screen if amount due is their
			$scope.isAmountDue = false;
			//call init function if any
			if(!_.isUndefined(_getViewConfig().initFunction)){
				eval(_getViewConfig().initFunction);
			}
			$scope.isInterviewFormLoading = false;
		}else{//Real Form		
			//boolean variable to show the error msg instead of fixed screen if amount due is their
			$scope.isAmountDue = false;
			$scope.fixedScreen = false;
			//If form (tab) represents statement (child statement of another Form)
			var _currentTabConfig = _getViewConfig();
			if(_currentTabConfig.isStatement==true){
				//check if parentFormName and parentDocName is configured
				if(!_.isUndefined(_currentTabConfig.form) && !_.isUndefined(_currentTabConfig.form.parentDocName) && !_.isUndefined(_currentTabConfig.form.parentFormName)){
					if(letsAdd==true){//This means do not check anything and just add statement. Will be called from 'Add' option in grid
						//parent form (from tree)				
						var _parentForm = returnService.getForm(_currentTabConfig.form.parentDocName)[0];
						//Add statement doc
						returnService.addChildDoc(_currentTabConfig.form.docName,_parentForm).then(function(result){
							//statement form properties. Used angular.copy to avoid two-way data binding
							 var _form = angular.copy(returnService.getFormProp(_currentTabConfig.form.formName));
						    _form.docIndex=result.index;
						    
						    //set current statement docIndex in config to use it time of remove. Please make sure to reset it when required
						    _currentTabConfig.form.docIndex = result.index;
						    
						    //load statement form				    
						    $scope.loadForm(_form);
						    
						    //statement grid (For special statement forms like CareProviderStatement, DependentStatement)
						    _reloadInstanceGrid(docName);
						  //toggle the form block
							$scope.showForm = true;
						},function(error){
							$log.error(error);
							$scope.showForm = false;
						});						
					}else{//Check if parent form (of statement) is exist and if not add one.
						//check if parent form is already exist or not (in return)
						var _parentForm = returnService.getForm(_currentTabConfig.form.parentDocName)[0];
						//If parent form is not available then add parent form first
						if(_.isUndefined(_parentForm)){
							_parentForm = returnService.getFormProp(_currentTabConfig.form.parentFormName);
							returnService.addForm(_parentForm);
						}
						//Reset statement docIndex in configuration
						if(!_.isUndefined(_currentTabConfig.form.docIndex)){
							delete _currentTabConfig.form.docIndex;
						}
						//make form screen blank. As we do not want to display any form. special statement form will be loaded from gird
						$scope.loadForm({});
						
						//statement grid (For special statement forms like CareProviderStatement, DependentStatement)
						_reloadInstanceGrid(docName);
						//toggle the form block
						$scope.showForm = false;
					}
					
				}
				
			}else{//If not then normal form load
				//If letsAdd is true that means we have to add new form. Without this we check if any instance of form is already exist 
				//and if yes then directly load that instance without adding new one (in case of multi instance). 
				if(letsAdd==true){
					var _form = returnService.getFormProp(formName);
					//If more then one parent then pass only first one to auto bind with it
					if(!_.isUndefined(_form.parentID) && _form.parentID.split(',').length>1){
						_form.parentID = _form.parentID.split(',')[0];
					}
					$scope.addForm(_form);
					$scope.showForm = true;
				}else{
					//check if form has instance grid and if yes then we will not load form.
					var _screen = _getViewConfig();
					if(!_.isUndefined(_screen) && _.isUndefined(_screen.instanceGridColumns)){
						//get first instance of form from return (if added)
						var _form = returnService.getForm(docName)[0];
						if(!_.isUndefined(_form)){
							$scope.loadForm(_form);
						}else{
							//If form is not already added then add new one
							_form = returnService.getFormProp(formName);
							//If more then one parent then pass only first one to auto bind with it
							if(!_.isUndefined(_form.parentID) && _form.parentID.split(',').length>1){
								_form.parentID = _form.parentID.split(',')[0];
							}
							$scope.addForm(_form);
						}
						$scope.showForm = true;
					}else{
						//Form has instance grid (multi instance)
						//remove currently loaded form (if any)
						$scope.loadForm({});
						$scope.showForm = false;
					}
				}
				//Instance Grid (For Forms like W2)		
				_reloadInstanceGrid(docName);
			}
		}
	};
	

	/**
	 * This method will perform required check and validation checks for given form
	 */
	var validateScreen = function(_docName,_docIndex){		
		var deferred = $q.defer();
		returnService.performReviewForDoc(_docName,_docIndex).then(function(response){			
			$scope.errorSummary = _.filter(response,function(ercObject){
				var elementId = ercObject.docName+'.'+ercObject.fieldName+'-'+ercObject.docIndex;
				if(document.getElementById(elementId)!=null){
					return true;
				}
			});
			deferred.resolve('complited');
		},function(error){			
			deferred.reject(error);
		});
		return deferred.promise;
	};

	/**
	 * method to make the screen header selected
	 * @param tabDetail - holds the tab detail
	 * Note :- this function is called in ng-repeat to set the active class to <li> tag
	 * so this function will be called iteratively 
	 */
	$scope.isActive = function(tabDetail){
		//If it is master tab
		if(!_.isUndefined(tabDetail.isMaster) && tabDetail.isMaster == true){
			//get any child having active true
			var _activeChild = _.find($scope.interviewTabsConfig,{masterId:tabDetail.id,active:true});
			//If found active master
			if(!_.isUndefined(_activeChild)){
				return true;
			}else{
				return false;
			}
		}else{//Normal tab
			return tabDetail.active;
		}
	};

	/**
	 * This method calls returnService to get value of element from current loaded form
	 */
	var _getElementValue = function(elementName,docName,docIndex){
		if(_.isUndefined(docName))
			docName = !_.isUndefined($scope.formScope.currentForm)?$scope.formScope.currentForm.docName:'';
		if(_.isUndefined(docIndex))
			docIndex = !_.isUndefined($scope.formScope.currentForm)?$scope.formScope.currentForm.docIndex:'';
		return returnService.getElementValue(elementName,docName,docIndex);			
	};
	
	
	/**
	 * This function will reload instance grid for current form
	 */
	var _reloadInstanceGrid = function(_docName){
		//current screen configuration
		var _screen = _getViewConfig();
		if(!_.isUndefined(_screen) && !_.isUndefined(_screen.instanceGridColumns)){
			//reset grid data
			_dataForInstanceGrid = [];			
			
			//docs from _taxReturn
			var _docs = _getDoc(_docName);			
			//doc indexes
			var _docIndexes = _.keys(_docs);			
			//array of data part
			_docs = _.values(_docs);			
			//column configuration
			$scope.instanceGridColumns = _getViewConfig().instanceGridColumns;
			
			//generate data for grid
			for(var index in _docs){
				//row
				var _dataObject = {};
				//decide data as per column configuration 
				_.forEach($scope.instanceGridColumns,function(columnObject){
					var _field = _docs[index][columnObject.field];
					if(!_.isUndefined(_field) && !_.isUndefined(_field.value)){
						_dataObject[columnObject.field]=_field.value;
					}else{
						_dataObject[columnObject.field]="";
					}					
				});
				
				//add doc index and docName as property
				_dataObject.docIndex = _docIndexes[index];
				_dataObject.docName = _docName;
				
				//push row in to array
				_dataForInstanceGrid.push(_dataObject);
			}		
			
			if(!_.isUndefined(preloadInstanceGridDocIndex)){
				$timeout(function(){
					//Load Instance
					$scope.loadIsntanceGridForm(preloadInstanceGridDocIndex);
					//Make it undefined
					preloadInstanceGridDocIndex = undefined;
				},500);
			}
		}else{
			//reset grid			
			_dataForInstanceGrid = [];
			$scope.instanceGridColumns = [];			
		}
		
		//Reload grid.
		$scope.instanceGrid.reload();

	};
	
	/**
	 * This method returns docindexes for passed docName (if that form is exist in return)
	 */
	var _getInstances = function(_docName){
		return _.pluck(_.filter($scope.forms,{docName:_docName}),'docIndex');
	};
	
	/**
	 * This method will get doc(s) from _taxRetrun useing returnService
	 */
	var _getDoc = function(_docName,_docIndex){
		var _doc = returnService.getDoc(_docName,_docIndex);
		return _doc;
	};
	
	/**
	 * method to adjust the screen height
	 */
	var _getScreenElementHeight = function () {
		$scope.blockHeight = {};
		$scope.blockHeight.defaultSubValue = 0;
		var element;
		element = angular.element(document.getElementById("tabHeading"));
		if (element.length > 0 && element[0].clientHeight != 0){
	        $scope.blockHeight.tabHeading = element[0].clientHeight;
	    }
		//performReviewGrid will only be execurted when the fixedSreen scenerio exist
		element = angular.element(document.getElementById("performReviewGrid"));
		if (element.length > 0 && element[0].clientHeight != 0){
	        $scope.blockHeight.reviewGridHeight = element[0].clientHeight;
	    } 
		
		//below id the block for the tab holding grid in it
    	element = angular.element(document.getElementById("formListBlock"));
	    if (element.length > 0 && element[0].clientHeight != 0){
	        $scope.blockHeight.formListBlockHeight = (element[0].clientHeight != 140 && $scope.showForm == true)?140:element[0].clientHeight;
	    	$scope.blockHeight.defaultSubValue = 75;
	    }else{
	    	$scope.blockHeight.formListBlockHeight = 0;
	    }
	    
	    if(!_.isUndefined($scope.errorSummary) && $scope.errorSummary.length > 0){
		    element = angular.element(document.getElementById("errorBlock"));
		    if (element.length > 0 ){
		    	$scope.blockHeight.errorBlockHeight = element[0].clientHeight;
		    }
	    }else{
	    	$scope.blockHeight.errorBlockHeight = -20;
	    }
	};
	
	/**
	 * method to set the className property in custom object of tab config detail
	 * It also set the bottom line color for the tab heading
	 */
	var _setTabColorClassName = function(tabDetail){
		var colorConfig,cnt = 0;
		if(!_.isUndefined(tabDetail.custom.status) && !_.isNull(tabDetail.custom.status) && tabDetail.custom.status != ''){			
			//below code will be executed for all tab either it is child of any tab or the tab itself which is not a parent 
			colorConfig = _.find(tabColorConfig,{type:tabDetail.custom.status});
			if(!_.isUndefined(colorConfig) && !_.isNull(colorConfig) && !_.isEmpty(colorConfig)){
				tabDetail.className = (tabDetail.active == true)?colorConfig.selectedClassName:colorConfig.className;
				if(_.isUndefined(tabDetail.masterId))
					$scope.tabHeadingBottomLineColor = (tabDetail.active == true)?colorConfig.bottomLineClassName:'';
				else{
					$scope.childTabHeadingBottomLineColor = (tabDetail.active == true)?colorConfig.bottomLineClassName:'';
				}
			}else{
				tabDetail.className = '';
			}
		}else{
			tabDetail.className = '';
		}
		
		//condition to check whether whether the current active tab is master
		if(!_.isUndefined(tabDetail.masterId)){
			_setMasterTabColorClassName(tabDetail);
		}
	};
	
	/**
	 * Set colour for parent tab (if any)
	 */
	var _setMasterTabColorClassName = function(tabDetail){
		var _colorConfig;
		//check if it has any parent
		if(!_.isUndefined(tabDetail.masterId)){
			//Get parent tab details
			var _parentTabDetails = _.find($scope.interviewTabsConfig,{id:tabDetail.masterId});
			//If child(given) tab has error then set parent as error
			if(tabDetail.custom.status=='error'){
				//colour configuration for error
				_colorConfig = _.find(tabColorConfig,{type:'error'});				
				_parentTabDetails.className = (tabDetail.active == true)?_colorConfig.selectedClassName:_colorConfig.className;
				$scope.tabHeadingBottomLineColor = (tabDetail.active == true)?_colorConfig.bottomLineClassName:'';
			}else{
				//local variable
				var _status='';
				//get all child docs
				var _childTabs = _.filter($scope.interviewTabsConfig,{masterId:tabDetail.masterId});
				//loop through each child and if any child has error then set error for parent and if every child has success then set success. 
				//And if any has blank (inactive) set blank
				_.forEach(_childTabs,function(_childTabDetails){
					if(_childTabDetails.custom.status=='error'){
						_status = 'error';						
						//break loop
						return false;
					}else if(_childTabDetails.custom.status=='success'){
						_status = 'success';
					}
				});
				
				//Apply color
				if(_status == 'error'){
					//colour configuration for error
					_colorConfig = _.find(tabColorConfig,{type:'error'});
					_parentTabDetails.className = (tabDetail.active == true)?_colorConfig.selectedClassName:_colorConfig.className;
					//set class name to bottom line of master tab if aby of its child is active
					$scope.tabHeadingBottomLineColor = (tabDetail.active == true)?_colorConfig.bottomLineClassName:'';
				}else if(_status == 'success'){
					//colour configuration for success
					_colorConfig = _.find(tabColorConfig,{type:'success'});
					_parentTabDetails.className = (tabDetail.active == true)?_colorConfig.selectedClassName:_colorConfig.className;
					//set class name to bottom line of master tab if aby of its child is active
					$scope.tabHeadingBottomLineColor = (tabDetail.active == true)?_colorConfig.bottomLineClassName:'';
				}else{
					_parentTabDetails.className = '';
					//set class name to bottom line of master tab if aby of its child is active
					$scope.tabHeadingBottomLineColor = '';
				}
				
			}			
		}
	};
	
	/**
	 * method that would be called recursively when the table is updated or error block is updated in UI
	 */
	var _registerMutation = function(){
		// create an observer instance
		observer = new MutationObserver(function(mutations) {
			//Check If mutation is already invoked then do not enter
		    if(isMutationInvoked==false){
		    	//Set flag to true			    	
		    	isMutationInvoked =true;
		    	//Disconnect observer so we do not have further call for same purpose. 
		    	//This is specially required to avoid recursion where dom update invoke our code and our code again change doem.
		        observer.disconnect();
		        
		    	//Perform logic in timeout to wait for html to complete it's work and finish most of observer invocation due to single user action 
		    	$timeout(function(){
		    		_getScreenElementHeight();
		    		 //Reset Flag
		            isMutationInvoked =false;
		    		_registerMutation();
		       },300);
		    }			  
		});
		// configuration of the observer:
		var config = {attributes:true,childList: true ,attributeFilter: ["style"]  };
		 
		// pass in the target node, as well as the observer options
		observer.observe(document.querySelector('#formListBlock'), config);
		observer.observe(document.querySelector('#errorBlock'), config);
		observer.observe(document.querySelector('#tabHeading'), config);
	};
	
	/**
	 * method to only show those tab whose display property or its child display property is true
	 */
	$scope.isTabToDisplay = function(tabConfig){
		if((_.isUndefined(tabConfig.isMaster) || tabConfig.isMaster == false) && tabConfig.display == true){
			return true;
		}else if(!_.isUndefined(tabConfig.isMaster) && tabConfig.isMaster == true){
			return !_.isUndefined(_.find($scope.interviewTabsConfig,{masterId:tabConfig.id,display:true}))?true:false;
		}else{
			return false;
		}
			
	};
	
	/**
	 * method to update the display property of all tab 
	 */
	$scope.updateAllTabConfig = function(){
		//If there is no current form, means there is no change then there is no needs to evaluate all tabs
		//Note :- we have to also check the condition whether current view holds any function to execute as some tab dont hold any form as they are fixed screen   
		if(!_.isUndefined($scope.formScope.currentForm) || !_.isUndefined(_getViewConfig().executeFunction)){
			//loop over all tab config
			_.forEach($scope.interviewTabsConfig,function(tabConfig){
				//If tab is not allowed in perticular year
				if(_.isUndefined(tabConfig.blockedYears) || (!_.isUndefined(tabConfig.blockedYears) && tabConfig.blockedYears.indexOf($scope.taxYear) == -1) ){
					//If any activeElements are defined in configuration for tab
					if(!_.isUndefined(tabConfig.activeElements) && !_.isEmpty(tabConfig.activeElements)){				
						//loop over the active element array
						_.forEach(tabConfig.activeElements,function(elementObj,index){
							//Get value
							var _elementValue = _getElementValue(elementObj.element);						
							if(!_.isUndefined(_elementValue) && !_.isNull(_elementValue) && _elementValue !== ''){
								//IF expected value is boolean then element value must be converted to boolean.
								//Sometime, we have boolean value as string in return
								if(typeof elementObj.value == 'boolean'){
									_elementValue = Boolean(_elementValue);
								}
								
								//If the excpected value is string and have contains in it string
								//this scenerio is to make the state tab visible
								if(typeof elementObj.value=='string' && elementObj.value.indexOf('contains ')>-1){
									//value recieved has the expected state in its string
									if(_elementValue.toLowerCase().indexOf((elementObj.value.split(' ')[1]).toLowerCase())>-1){
										tabConfig.display = true;
										return false;
									}
								}else{
									//If element and expected values are same make the tab visible
									if(_elementValue===elementObj.value){
										tabConfig.display = true;
										return false;
									}
								}							
								
							}
							//If not then check if current index is last and if yes then make the tab invisiblae (if it is visible)
							if((index+1) == tabConfig.activeElements.length && tabConfig.display == true){
								_removeDoc(tabConfig);
								tabConfig.display = false;
								return false;
							}						
						});//For Each for elements - End
					}
				}
			});//For each loop for tabs - End
		}
	};
	
	/**
	 * method to remove the form or statement doc if the tab display has turn to false from true
	 */
	var _removeDoc = function(tabConfig){
		//when we remove the form or statement we need to reset the custom object of tab config
		tabConfig.custom = {};
		//condition to check whether the tab is statement
		if(!_.isUndefined(tabConfig.isStatement) && tabConfig.isStatement == true){
			//fetch all the index of doc whose docName is pass
			var _docIndexList = returnService.getIndex(tabConfig.form.docName);
			if(!_.isUndefined(_docIndexList) && !_.isEmpty(_docIndexList)){
				//loop over index list to remove all the statement
				_.forEach(_docIndexList,function(docIndex){
					returnService.removeChildDoc(tabConfig.form.docName,docIndex);
				});
			}
		}else{
			//list of forms for current docName (all form instance of current form in return)
			var _forms = returnService.getForm(tabConfig.form.docName);
			if(!_.isEmpty(_forms)){
				//loop to remove the form and if it is multi-instance form than all its instance
				_.forEach(_forms,function(formObj){
					//get the boolean value to identify whether the for can be deleted or not
					var _canDeleteForm = $filter('canDeleteForm')(formObj.formName);
					if(_canDeleteForm == true){
						//remove form asked by user
						$scope.removeForm(formObj);
					}
				});
			}
		}
	};
	
	/**
	 * method to show the child tab if the current tab is the parent tab
	 */
	var _showChildTab = function(){
		//condition to restict the code to be executed when the user has selected the same state
		if($scope.sameStateErrMsg != true){
			//get the current active tab
			var tabDetail = _getViewConfig();
			//condition to check whether the current tab is the child tab
			if(!_.isUndefined(tabDetail.masterId)){
				$scope.showChildTabProp = {hasParent:true,masterTabId:tabDetail.masterId};
			}else if(!_.isUndefined(tabDetail.isMaster) && tabDetail.isMaster == true){
				//object that holds the id of master tab and a boolean variable of hasParent
				$scope.showChildTabProp = {hasParent:true,masterTabId:tabDetail.id};
				//fetch the child tab which lies under master tab
				var getChildTabConfig = _.find($scope.interviewTabsConfig,{masterId:tabDetail.id,display:true});
				if(!_.isUndefined(getChildTabConfig))
					$scope.changeTab(getChildTabConfig);//activate the first child of the master
			}else{
				$scope.showChildTabProp = {};
			}
			$scope.updateAllTabConfig();
		}
	};
	
	//intialize
	//Note :- we have used broadcast as we have to wait until the return get open
	//As we are now loading the tab status from the _taxReturn of returnService
	$scope.$on('returnDetailLoaded',function(event){
		//here we are checking user CAN_INTERVIEW not then just redirect at home screen 
	    if (!$scope.userCan('CAN_INTERVIEW') || userService.getTaxYear() == '2014') {
	        //Redirect
	        $location.path('home');
	    }else{
	    	_initUI();
			_initConfig();
			_registerMutation();
	    }
	});
	
	//method that to be called to initialize Efile 
	var _initEfileReturn = function(){
		//condition to check whether due is not their if amount due exist we dont execute the performReview function
		//Note :- this is done to restrict unnecessary function call 
		if(!_.isUndefined($scope.formTree) && (_.isUndefined($scope.formTree.fedOwe) || $scope.formTree.fedOwe == '')){
			$scope.toggleERCPanel(true);
			$scope.performReview();
		}else if(!_.isUndefined($scope.formTree) && !_.isUndefined($scope.formTree.fedOwe) && $scope.formTree.fedOwe != ''){
			//If amount due exist we will not show ERC-Grid instead of it we will inform user to go to input mode and complete the return
			$scope.isAmountDue = true;
		}
		//condition to check the availability of returnStates
		if(!_.isUndefined($scope.returnStates) && !_.isEmpty($scope.returnStates)){
			//loop over added state in return
			_.forEach($scope.returnStates,function(stateObj){
				//condition to check in each state whether any state holds the due amount
				if(!_.isUndefined(stateObj.stateOwe) && !_.isNull(stateObj.stateOwe) && stateObj.stateOwe != ''){
					$scope.isAmountDue = true;//toggle the value to true if the state holds due amount and we hide the e-file
					return false;//break loop
				}
			});//end of loop over returnStates array
		}
		$scope.getStateOfReturn();
	};
	
	//method to initialize rejected tab
	var _initRejectedReturn = function(){
		$scope.toggleErrorPanel(true);
	};

	//method to initialize alert tab
	var _initAlertReturn = function(){
		$scope.toggleAlertPanel(true);
	};
	
	//method to initialize bank rejected tab
	var _initBankRejection = function(){
		$scope.toggleBankErrorPanel(true);
	};
	
	/**
	 * method to print the signature authorization form
	 */
	$scope.printSignatureForm = function(){
		//get form details to be print
		var _form = returnService.getForm('d8879')[0];
		//condition to check wether the _form exist or not
		if(!_.isUndefined(_form) && !_.isEmpty(_form))
			$scope.printForm(_form,'printSingleForm');//called the return controller(parent) function to print the 8879 form 
	};
	
	/**
	 * method to print the Bank form
	 */
	$scope.printBankForm = function(){
		//condition to check wether the _form exist or not
		if(!_.isUndefined($scope.bankType) && !_.isNull($scope.bankType) && $scope.bankType != ''){
			var _form ;
			if( $scope.bankType === 'ATLAS'){
				_form = returnService.getForm('dAtlasBankApp')[0];
			}
			if(!_.isUndefined(_form) && !_.isEmpty(_form)){
				$scope.printForm(_form,'printSingleForm');//called the return controller(parent) function to print the bank form
			}
		}
	};
	
	//method that to be called to initialize Consent 
	var _initConsent = function(){
		//Get bank type for Printing
		$scope.bankType = _getElementValue('dReturnInfo.strbank');
	};
	
	/**
	 * method to redirect the user to the tab that holds the error
	 * @param erc - object holds the form detail
	 */
	$scope.goToERCTab = function(erc){
		//fetch the object that holds the currentTabId and parentId if the current tab is child of any master tab
		var tabIds = _getCurrentTabId();		
		//loop over all tab config to get the next tab ID
		
		//Step 1: Find tabConfig for docName of field
		var _nextTabConfig = _.find($scope.interviewTabsConfig,{form:{docName:erc.docName}});
		
		//Step 2: If it is not there then find tabConfig for docName of form (to which this field is belongs)
		//This will be case for statement inside form
		if(_.isUndefined(_nextTabConfig)){
			_nextTabConfig = _.find($scope.interviewTabsConfig,{form:{docName:erc.form.docName}});
		}
		
		//Element that requires to be jump
		var elementId = erc.docName+'.'+erc.fieldName+'-'+erc.docIndex;
		
		//condition to check wether tabIds object and nextTabId exist and are not same then and only than the below code will be executed 
		if(!_.isUndefined(tabIds) && !_.isUndefined(tabIds.currentTabId) && !_.isUndefined(_nextTabConfig) && !_.isUndefined(_nextTabConfig.id) && _nextTabConfig.id != ''){
			if(tabIds.currentTabId != _nextTabConfig.id){
				//condition to check wether tha tab holds the grid if yes then we load the form/statement accoring the docIndex that we received.
				//For this, we will set docIndex as 'preloadInstanceGridDocIndex' and on _reloadInstanceGrid we will check it
				if(!_.isUndefined(_getViewConfig(_nextTabConfig.id).instanceGridColumns)){
					preloadInstanceGridDocIndex = erc.docIndex;
				}
				_changeTab(tabIds.currentTabId,_nextTabConfig.id);				
				//Note :- we have to use timeout as such we have to wait until the UI get render on tab change
				//if we donot use timeout than Id to be focus is not availabe 
				$timeout(function(){
					//condition to check whether the element which is to be focused does exist in document
					//Note :- This is done as when the form is of multi-instance than only the grid is shown at the time
					//so the form is not available in such scenerio we have to skip the focus functionality
					if(!_.isUndefined(document.getElementById(elementId)) && !_.isNull(document.getElementById(elementId)))
						document.getElementById(elementId).focus();
				},1000);
			}else{
				document.getElementById(elementId).focus();
			}
		}
	};
	
	//object that holds two array one of removed state and another of newly added states
	var _manageStates = {newAddedState:[],removeState:[]};
	/**
	 * method that is called on change event of drop down when user select the state
	 * @param residentType - holds the value that state belongs to which resident (i.e full year, part year or non resident)
	 * @param key - holds the key name (i.e either firstState or secondState)
	 */
	$scope.isStateSelected = function(residentType,key){
		//array that holds state object
		var _stateList = [];
		//loop over selected state
		_.forEach($scope.selectedState,function(residentObj){
			_.forEach(residentObj,function(stateObj){
				if(!_.isNull(stateObj)){
					_stateList.push(stateObj);
				}
			});
		});//end of loop
		//retreiving the unique state from the _stateList prepared
		var _uniqStateList = _.uniq(_stateList,'name');
		//condition to compare the length of actually selected state list and the unique state list 
		//on basis of lenght we determine that whether the dupliate state exist or not
		if(_stateList.length != _uniqStateList.length){
			//boolean variable to show the duplicate state error messge
			$scope.sameStateErrMsg = true;
		}else{
			$scope.sameStateErrMsg = false;
		}
		//variable taken to set the type with sateDetail while pushing it in _manageState.newAddedState
		var _residentType;
		if(residentType == 'fullYearResident'){
			_residentType = 'FY';
		}else if(residentType == 'partYearResident'){
			_residentType = 'PY';
		}else if(residentType == 'nonResident'){
			_residentType = 'NR';
		}

		//condition to check that resident type received in parameter exist in the preloaded selected state
		if(!_.isUndefined(_lastselectedState[residentType]) && !_.isUndefined(_lastselectedState[residentType][key]) && !_.isNull(_lastselectedState[residentType][key])){
			//if we get the differnet value at same position in _lastselectedState and $scope.selectedState we remove old state and add new state 
			if(!_.isNull($scope.selectedState[residentType][key]) && !_.isEqual($scope.selectedState[residentType][key],_lastselectedState[residentType][key])){
				//check if state is added or not
				var _findStateDetail = _.find($scope.returnStates,{name:_lastselectedState[residentType][key].name});
				//if state is found added we simply push that state object in remove array to remove it
				if(!_.isUndefined(_findStateDetail) && !_.isEmpty(_findStateDetail)){
					_manageStates.removeState.push({type:_residentType,stateDetail:_lastselectedState[residentType][key]});
				}
				//getting the index of the state from the newAddedState if exist
				//this is done to remove the state form the newAddedSate of _manage if the state has been change from that position
				var _getAddedStateIndex = _.findIndex(_manageStates.newAddedState,function(obj){
					return obj.stateDetail.name == _lastselectedState[residentType][key].name;
				});
				//condition to check if we objtain the index and that state does not exist in $scope.selectedState
				if(_getAddedStateIndex > -1 && !_hasSelected(_lastselectedState[residentType][key])){
					//remove the state object
					_manageStates.newAddedState.splice(_getAddedStateIndex,1);
				}
				_manageStates.newAddedState.push({type:_residentType,stateDetail:$scope.selectedState[residentType][key]});
			}else if(_.isNull($scope.selectedState[residentType][key]) && !_.isNull(_lastselectedState[residentType][key])){//condition to check if $scope.selectedState is null as current position
				//we have to remove those state object which were push into newAddedState array initially and afterward was removed without changing tab
				if(!_hasSelected(_lastselectedState[residentType][key])){
					var removeState = _.remove(_manageStates.newAddedState,function(stateObj){
						return stateObj.stateDetail.name == _lastselectedState[residentType][key].name;
					});
				}
				//check if state is added or not
				var _findStateDetail = _.find($scope.returnStates,{name:_lastselectedState[residentType][key].name});
				//If the removeState array is empty then and only than we will push state object in _manageState.removeState array
				if((_.isUndefined(removeState) || _.isEmpty(removeState)) && !_.isUndefined(_findStateDetail) && !_.isEmpty(_findStateDetail)){
					_manageStates.removeState.push({type:_residentType,stateDetail:_lastselectedState[residentType][key]});
				}
			}
		}else{
			//we have to simply push the state object in newAddedState if default _lastselectedState is undefined or null as same position 
			_manageStates.newAddedState.push({type:_residentType,stateDetail:$scope.selectedState[residentType][key]});
		}

		//over here we update the default selectedState which we have populated during initialization
		//Note :- this is done to keep the track of state change at specific position of specific resident type
		if(_.isUndefined(_lastselectedState[residentType])){
			_lastselectedState[residentType] = {};
		}
		_lastselectedState[residentType][key] = angular.copy($scope.selectedState[residentType][key]);
	};
	
	/**
	 * method that manage the state to be add or remove
	 */
	var _manageInterviewStates = function(nextTabId){
		if($scope.sameStateErrMsg != true){
			$scope.isInterviewFormLoading = true;
			//array list that holds the objects of state according their resident type
			var _fullResidentStateList,_partYearResidentStateList,_nonResidentStateList;
			//variable that hold the doc object of non-resident and part-year resident object
			var _isNonResidentForm,_isPartYearFrom;

			//condition to check whether the _manageState object exist and is not emp
			if(!_.isUndefined(_manageStates) && !_.isEmpty(_manageStates)){
				//condition to check whether any state is their to remove
				if(!_.isUndefined(_manageStates.removeState) && !_.isEmpty(_manageStates.removeState)){
					//loop over remove state array to remove state one by one
					_.forEach(_manageStates.removeState,function(obj){
						if(!_.isNull(obj) && !_.isEmpty(obj)){
							$scope.removeState(obj.stateDetail.name);
							_resetStateCustomObject(obj.stateDetail);
						}
					});//remove state loop - End
				}
				//condition to check that is any new state their to add
				if(!_.isUndefined(_manageStates.newAddedState) && !_.isEmpty(_manageStates.newAddedState)){
					_manageStates.newAddedState = _.uniq(_manageStates.newAddedState,'stateDetail');
					//loop over new state array to add letsAdd property to all state object
					_.forEach(_manageStates.newAddedState,function(obj){
						if(!_.isNull(obj) && !_.isEmpty(obj)){
							obj.stateDetail.letsAdd = true;
							obj.stateDetail.isAdded = false;
						}
					});//new state added loop - End

					_fullResidentStateList = _.pluck(_.filter(_manageStates.newAddedState,{ 'type': 'FY' }),'stateDetail');
					_partYearResidentStateList = _.pluck(_.filter(_manageStates.newAddedState,{ 'type': 'PY' }),'stateDetail');
					_nonResidentStateList = _.pluck(_.filter(_manageStates.newAddedState,{ 'type': 'NR' }),'stateDetail');
					//variable that store the time to wait before calling $scope.addState() function again
					var _executeTime = 0;

					//condition that check whether the state belonging to full year residetn exist if yes than we simply call the addState function and 
					//increase the executeTime so as to wait before calling addState function again
					if(!_.isUndefined(_fullResidentStateList) && !_.isEmpty(_fullResidentStateList)){
						$scope.addStates(_fullResidentStateList,'FY');
						_executeTime += 1000;
					}

					//condition that check whether any state exist that belong to part year resident if yes we add those state and increase ececute time
					if(!_.isUndefined(_partYearResidentStateList) && !_.isEmpty(_partYearResidentStateList)){
						$timeout(function(){
							$scope.addStates(_partYearResidentStateList,'PY');
						},_executeTime);
						_executeTime += 1000;
					}

					//condition to check the non resident state if exist than we add those state
					if(!_.isUndefined(_nonResidentStateList) && !_.isEmpty(_nonResidentStateList)){
						$timeout(function(){
							$scope.addStates(_nonResidentStateList,'NR');
						},_executeTime);
					}
				}
				//condition kept to check is any state their to remove or state to add thane and only than we start interval
				if(!_.isEmpty(_manageStates.removeState) || !_.isEmpty(_manageStates.newAddedState)){
					//interval to check whether the doc of form exist till then we are showing loading bar 
					var _checkFromExistInterval = $interval(function(){
						if(_.isUndefined(_partYearResidentStateList) && _.isUndefined(_fullResidentStateList) && _.isUndefined(_nonResidentStateList)){
							$interval.cancel(_checkFromExistInterval);
							$scope.updateAllTabConfig();
							nextTabId = (!_.isUndefined(nextTabId) && nextTabId != '')?nextTabId:_getNextTabId('selectState');
							_changeTab(_getViewConfig().id,nextTabId);
						}else if(!_.isUndefined(_partYearResidentStateList) && !_.isEmpty(_partYearResidentStateList)){
							_isPartYearFrom = _getElementValue('dPartYrResi.isActive');
							if(!_.isUndefined(_isPartYearFrom) && !_.isNull(_isPartYearFrom) && _isPartYearFrom != '' &&
									!_.isUndefined(_fullResidentStateList) && !_.isEmpty(_fullResidentStateList) && !_.isUndefined(_nonResidentStateList) && !_.isEmpty(_nonResidentStateList)){
								_isNonResidentForm = _getElementValue('dNonResi.isActive');
								if(!_.isUndefined(_isNonResidentForm) && !_.isNull(_isNonResidentForm) && _isNonResidentForm !== ''){
									$interval.cancel(_checkFromExistInterval);
									$scope.updateAllTabConfig();
									nextTabId = (!_.isUndefined(nextTabId) && nextTabId != '')?nextTabId:'partYrResi';
									_changeTab(_getViewConfig().id,nextTabId);
								}
							}else if(!_.isUndefined(_isPartYearFrom) && !_.isNull(_isPartYearFrom) && _isPartYearFrom !== ''){
								$interval.cancel(_checkFromExistInterval);
								$scope.updateAllTabConfig();
								nextTabId = (!_.isUndefined(nextTabId) && nextTabId != '')?nextTabId:'partYrResi';
								_changeTab(_getViewConfig().id,nextTabId);
							}
						}else if((!_.isUndefined(_fullResidentStateList) && !_.isEmpty(_fullResidentStateList)) || (!_.isUndefined(_nonResidentStateList) && !_.isEmpty(_nonResidentStateList))){
							_isNonResidentForm = _getElementValue('dNonResi.isActive');
							if(!_.isUndefined(_isNonResidentForm) && !_.isNull(_isNonResidentForm) && _isNonResidentForm !== ''){
								$interval.cancel(_checkFromExistInterval);
								$scope.updateAllTabConfig();
								nextTabId = (!_.isUndefined(nextTabId) && nextTabId != '')?nextTabId:'nonResident';
								_changeTab(_getViewConfig().id,nextTabId);
							}
						}
					},1000);

				}else{
					nextTabId = (!_.isUndefined(nextTabId) && nextTabId != '')?nextTabId:_getNextTabId(_getViewConfig().id);
					_changeTab(_getViewConfig().id,nextTabId);
				}

				//after add and remove state operation get complete we reset the _manageState object	
				_manageStates = {newAddedState:[],removeState:[]};

			}else{
				nextTabId = (!_.isUndefined(nextTabId) && nextTabId != '')?nextTabId:_getNextTabId(_getViewConfig().id);
				_changeTab(_getViewConfig().id,nextTabId);
			}

		}
	};
	
	/**
	 * method to check whether the state exist in $scope.selectedState
	 * if state exist it will return true and if not than false
	 */
	var _hasSelected = function(stateDetail){
		var _isStateAdded = false;
		if(!_.isUndefined(stateDetail) && !_.isNull(stateDetail)){
			_.forEach($scope.selectedState,function(residentObj){
				_.forEach(residentObj,function(stateObj){
					if(!_.isNull(stateObj) && stateObj.name == stateDetail.name){
						_isStateAdded = true;
						return false;
					}
				});
				if(_isStateAdded == true){
					return false;
				}
			});
			return _isStateAdded;
		}else{
			return _isStateAdded;
		}
	};
	
	/**
	 * method prepared to reset the custom object of all the form which lies under the state when the state get remove
	 * @param stateObj - holds the state detail(i.e name,residencyStatus,efileState(if exist))
	 */
	var _resetStateCustomObject = function(stateObj){
		//filtering the tab config array to fetch the list of tab config
		var _getFormList = _.filter($scope.interviewTabsConfig,function(tabConfig){
			return tabConfig.masterId == stateObj.name.toLowerCase() || tabConfig.id == stateObj.name.toLowerCase();
		});
		if(!_.isUndefined(_getFormList) && !_.isEmpty(_getFormList)){
			//loop over the form list received
			_.forEach(_getFormList,function(formObj){
				formObj.custom = {};
				formObj.className = '';
			});
		}
	};
	
	//listen the broadcast of form loaded as it is not listen in the parent controller
	//we have listen this broadcast just to toggle the loading bar
	$scope.$on('formLoaded',function(){
		//Note:- we have to toggle the variable in timeout as it take time to load the form
		// we were facing same issue in return controller while loading form in input mode
		$timeout(function(){   
			$scope.isInterviewFormLoading = false;
		},0);
	});
	
    //Initialize network status flag and subscribe channel to get update 
    $scope.isOnline = networkHealthService.getNetworkStatus();
    var _networkStatusSubscription = postal.subscribe({
        channel: 'MTPO-UI',
        topic: 'networkStatus',
        callback: function (data, envelope) {
            $scope.isOnline = data.isOnline;
        }
    });

   //subscription from return-controller for  interviewModeShortcut
   var _interviewModeShortcutSubscription = postal.subscribe({
    	channel:'MTPO-Return',
    	topic:'InterviewShortcut',
    	callback:function(data,envelope){
    	  	interviewModeShortcutCallback(data);
    	}
    });
	

   //This function is used to call interview mode shortcut
   var interviewModeShortcutCallback = function(data){
   	    switch(data.type){
	   		case 'inputMode' :
	   				//go back to form mode
	   				$scope.goToInputMode();
	   			break;
	   		case 'previous' :
	   			//go to previous tab
	   			if(previous.length != 0)
	   				$scope.onPreviousClick();
	   			break;
	   		case 'next' :
	   				//go to next tab
    	   			$scope.updateAllTabConfig();
    	   			$scope.changeTab();
	   			break;
	   		case 'performReview' :
	   				//perform review
	   				//find object
	   				var object = _.find($scope.interviewTabsConfig,{'id':'efileReturn'});
    	   			$scope.changeTab(object);
    	   		break;
    	   	case 'stateTab' :
    	   			var object = _.find($scope.interviewTabsConfig,{'id':'state'});
    	   			//open state tab
    	   			$scope.changeTab(object);
    	   	case 'rejection' :
    	   			var object = _.find($scope.interviewTabsConfig,{'id':'efileReturn'});
    	   			//swith to e-file tab
    	   			$scope.changeTab(object);
    	   			break;
	   }	
   }

    //To listen on destroy.
    $scope.$on('$destroy', function () {
        //unsubscribe network status subscription to prevent memory leak
        _networkStatusSubscription.unsubscribe();
        //unsubscribe _interviewModeShortcutSubscription subscription
        _interviewModeShortcutSubscription.unsubscribe();
    });

}]);