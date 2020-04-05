
//External Imports
import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

//Internal Imports
import { BasketService } from '@app/shared/services/basket.service';
import { UserService } from '@app/shared/services/user.service';
import { QuickReturnSummaryService } from '@app/dashboard/widgets/quick-return-summary/quick-return-summary.service';
import { SystemConfigService } from '@app/shared/services';
import { ReturnAPIService } from '@app/return/return-api.service'
@Component({
  selector: 'app-quick-return-summary',
  templateUrl: './quick-return-summary.component.html',
  styleUrls: ['./quick-return-summary.component.scss']
})
export class QuickReturnSummaryComponent implements OnInit {

  @Input() rowColor: any;

  //hold all data that need to be displayed
  public quickSummary: any = {};
  //store value of ssn or EIN
  @Input() ssnorein: string;
  //form refresh icon 
  @Output() isRefresh: EventEmitter<any> = new EventEmitter();
  //display message for EIN or SSN
  public message: string = "Enter a valid SSN/ITIN to view the return's summary.";
  //set default tax type ein selected
  public maskType: string;
  public selectedType: string;
  //set default mask id as ein
  public taxIdTypeMask: string = '999-99-9999';
  public maskTypeChange: boolean = false;
  public maskTypeDisplayValue: string;
  public showMask: boolean = true;
  public taxMaskId: string = "000-00-0000"
  public returnList: any = []
  //Default mapping for SSN
  public leastSummaryMapping: Array<object> = [
    { "set": { "objectName": "taxPayer", "property": "firstName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "firstName" } },
    { "set": { "objectName": "taxPayer", "property": "lastName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "lastName" } },
    { "set": { "objectName": "return", "property": "status" }, "get": { "form": "header", "getElement": "status" } },
    { "set": { "objectName": "return", "property": "returnType" }, "get": { "form": "header", "getElement": "packageNames" } },
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
    { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "dReturnInfo", "getElement": "strRefundType" } },
    { "set": { "objectName": "return", "property": "selectedBank" }, "get": { "form": "dReturnInfo", "getElement": "strbank" } },
    { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040" },
    { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040A", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040A" },
    { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040EZ", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040EZ" },
    { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040SS", "getElement": "QuickreturnTotalAGI" }, "mainForm": "1040SS" },



  ];

  //hold efile lookup data
  public efileStatusLookup: any;

  constructor(private _basketService: BasketService,
    private _router: Router,
    private _userService: UserService, private _quickReturnSummaryService: QuickReturnSummaryService, private _systemConfigService: SystemConfigService, private returnAPIService: ReturnAPIService) {
    this.efileStatusLookup = this._systemConfigService.getEfileStatusLookup();
  }


  ngOnInit() {
    if (this.maskType == undefined) {
      this.maskType = "SSN";
      this.selectedType = 'ssn'
    }
    if(this.betaOnly()) {
      this.getAllReturnList();
    }
  }

  /**
   * @author Asrar Memon
   * @description //to get beta only flag
   */
  public betaOnly() {
    if (environment.mode == 'local' || environment.mode == 'beta') {
      return true;
    } else {
      return false;
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.returnList.filter(v => {
          if(true) {
            if(v[this.selectedType]) {
              return v[this.selectedType].toLowerCase().indexOf(term.toLowerCase()) > -1
            }
          }
        }))
    )
  formatter = (x) => x[this.selectedType];

  setSelectedType() {
    if (this.maskType == "SSN") {
      this.selectedType = 'ssn'
    } else if (this.maskType == "EIN") {
      this.selectedType = 'ein'
    } else if (this.maskType === 'Name') {
      this.selectedType = 'taxPayerName'
    } else if (this.maskType === 'Phone') {
      this.selectedType = 'homeTelephone'
    } else if (this.maskType === 'Email') {
      this.selectedType = 'email'
    }
  }
  /**
   * set mask type
   */
  setMaskId() {
    if (this.maskType == "SSN") {
      this.taxMaskId = "000-00-0000";
      this.showMask = true;
    } else if (this.maskType == "EIN") {
      this.taxMaskId = "00-0000000"
      this.showMask = true;
    } else if (this.maskType == "Phone") {
      this.taxMaskId = "(000)000-0000";
      this.showMask = true;
    } else {
      this.taxMaskId = undefined;
      this.showMask = false;
    }
    this.ssnorein = undefined;
  }

  //set text mask based on selected type
  public setTaskMask(type): void {
    this.maskTypeChange = true;
    this.maskType = type;
    this.ssnorein = "";
    this.quickSummary = {};
    if (this.maskType == 'SSN') {
      this.message = "Enter a valid " + this.maskType + "/ITIN to view the return's summary.";
    } else {
      this.message = "Enter a valid " + this.maskType + " to view the return's summary.";
    }

    if (this.maskType == 'EIN') {
      this.taxIdTypeMask = '99-9999999';
      this.leastSummaryMapping = [
        { "set": { "objectName": "return", "property": "status" }, "get": { "form": "header", "getElement": "status" } },
        { "set": { "objectName": "return", "property": "returnType" }, "get": { "form": "header", "getElement": "packageNames" } },
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
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1065", "getElement": "OrdinaryBusinessIncomeLoss" }, "mainForm": "1065" },
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1065B", "getElement": "QuickSummaryAGI" }, "mainForm": "1065B" },
        { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "d1065RIS", "getElement": "RefundType" } },


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
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120S", "getElement": "OrdinaryIncomeLossFromTrade" }, "mainForm": "1120S" },
        { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "d1120SRIS", "getElement": "RefundType" } },




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
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120C", "getElement": "TaxableIncomeBeforeNOL" }, "mainForm": "1120C" },
        { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "d1120CRIS", "getElement": "RefundType" } },


        { "set": { "objectName": "partnership", "property": "usStreet" }, "get": { "form": "d990CIS", "getElement": "StreetAddress" } },
        { "set": { "objectName": "partnership", "property": "usCity" }, "get": { "form": "d990CIS", "getElement": "City" } },
        { "set": { "objectName": "partnership", "property": "usState" }, "get": { "form": "d990CIS", "getElement": "State" } },
        { "set": { "objectName": "partnership", "property": "usZipCode" }, "get": { "form": "d990CIS", "getElement": "Zipcode" } },
        { "set": { "objectName": "partnership", "property": "fgStreet" }, "get": { "form": "d990CIS", "getElement": "ForeighAddress" } },
        { "set": { "objectName": "partnership", "property": "fgCity" }, "get": { "form": "d990CIS", "getElement": "ForeignCity" } },
        { "set": { "objectName": "partnership", "property": "fgState" }, "get": { "form": "d990CIS", "getElement": "ForeignProvinceOrState" } },
        { "set": { "objectName": "partnership", "property": "fgPostalCode" }, "get": { "form": "d990CIS", "getElement": "ForeignPostalCode" } },
        { "set": { "objectName": "partnership", "property": "fgCountry" }, "get": { "form": "d990CIS", "getElement": "Country" } },
        { "set": { "objectName": "partnership", "property": "phoneNo" }, "get": { "form": "d990CIS", "getElement": "Phone" } },
        //{ "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120C", "getElement": "TaxableIncomeBeforeNOL" }, "mainForm": "1120C" },
        { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "d990RIS", "getElement": "RefundType" } },


        { "set": { "objectName": "partnership", "property": "usStreet" }, "get": { "form": "d1041CIS", "getElement": "Address" } },
        { "set": { "objectName": "partnership", "property": "usCity" }, "get": { "form": "d1041CIS", "getElement": "city" } },
        { "set": { "objectName": "partnership", "property": "usState" }, "get": { "form": "d1041CIS", "getElement": "state" } },
        { "set": { "objectName": "partnership", "property": "usZipCode" }, "get": { "form": "d1041CIS", "getElement": "Zipcode" } },
        { "set": { "objectName": "partnership", "property": "fgStreet" }, "get": { "form": "d1041CIS", "getElement": "ForeignAddress" } },
        { "set": { "objectName": "partnership", "property": "fgCity" }, "get": { "form": "d1041CIS", "getElement": "ForeignZipCity" } },
        { "set": { "objectName": "partnership", "property": "fgState" }, "get": { "form": "d1041CIS", "getElement": "ProvinceOrState" } },
        { "set": { "objectName": "partnership", "property": "fgPostalCode" }, "get": { "form": "d1041CIS", "getElement": "PostalCode" } },
        { "set": { "objectName": "partnership", "property": "fgCountry" }, "get": { "form": "d1041CIS", "getElement": "ForeignCountry" } },
        { "set": { "objectName": "partnership", "property": "phoneNo" }, "get": { "form": "d1041CIS", "getElement": "Phone" } },
        //{ "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1120C", "getElement": "TaxableIncomeBeforeNOL" }, "mainForm": "1120C" },
        { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "d1041RIS", "getElement": "RefundType" } }


      ];
    } else if (this.maskType == 'SSN') {
      this.taxIdTypeMask = '999-99-9999';
      this.leastSummaryMapping = [
        { "set": { "objectName": "taxPayer", "property": "firstName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "firstName" } },
        { "set": { "objectName": "taxPayer", "property": "lastName" }, "get": { "form": "header", "usrDetail": "client", "getElement": "lastName" } },
        { "set": { "objectName": "return", "property": "status" }, "get": { "form": "header", "getElement": "status" } },
        { "set": { "objectName": "return", "property": "returnType" }, "get": { "form": "header", "getElement": "packageNames" } },
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
        { "set": { "objectName": "return", "property": "refundPaymentType" }, "get": { "form": "dReturnInfo", "getElement": "strRefundType" } },
        { "set": { "objectName": "return", "property": "selectedBank" }, "get": { "form": "dReturnInfo", "getElement": "strbank" } },
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040" },
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040A", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040A" },
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040EZ", "getElement": "AdjustedGrossIncomeAmt" }, "mainForm": "1040EZ" },
        { "set": { "objectName": "income", "property": "adjustedGrossIncome" }, "get": { "form": "d1040SS", "getElement": "QuickreturnTotalAGI" }, "mainForm": "1040SS" },


      ];
    }
  };


  public changeTextValueForSsnOrEin() {
    if(this.maskType == "SSN") {
      if(this.ssnorein && (this.ssnorein.length == 3 || this.ssnorein.length == 6) ) {
        this.ssnorein += '-'
      }
    } else if(this.maskType == "EIN") {
      if(this.ssnorein && (this.ssnorein.length == 2) ) {
        this.ssnorein += '-'
      }
    } else if(this.maskType == "Phone") {
      if(!this.ssnorein || this.ssnorein.length == 1 ) {
        this.ssnorein = '('
      } else if(this.ssnorein && this.ssnorein.length === 4) {
        this.ssnorein += ')'
      } else if(this.ssnorein && this.ssnorein.length === 8) {
        this.ssnorein += '-'
      }
    }
  }
  /**
   * @description Key press event
   *              If enter is press then we will call getReturnStummary function
   * @param event 
   */
  public keyPress(event): void {
    if(this.betaOnly()) {
      this.changeTextValueForSsnOrEin();
    } else {
      // 13 is key code for 'enter' key
      if (event.keyCode == 13) {
        this.getReturnStummary();
      }
    }
  };

  goToDetail() {
    setTimeout(() => {
      this.ssnorein = this.ssnorein[this.selectedType];
      this.loadMoreDetail();
    });
    
  }
  /**
   *load more details of quick return summary 
   */
  public loadMoreDetail(): void {
    this._basketService.pushItem("maskType", this.maskType);
    this._basketService.pushItem('ssnorein',this.ssnorein);
    this._router.navigate(['/return/summary']);
  }

  /**
   * Get return summary by provided SSN from user.
   */
  public getReturnStummary(): void {
    this.maskTypeChange = false;
    // If ssn is blank then no need to proceed further
    if (this.ssnorein) {
      const self = this;
      self._quickReturnSummaryService.getQuickReturnSummary(self.ssnorein, self.leastSummaryMapping, self.maskType).then((response) => {
        if (self.maskTypeChange == false) {
          self.quickSummary = self._quickReturnSummaryService.completeSummaryService.quickSummary;
          self.message = self._quickReturnSummaryService.completeSummaryService.message;
          if (self.quickSummary.taxPayerDetail && Object.keys(self.quickSummary.taxPayerDetail).length > 0) {
            self.maskTypeDisplayValue = "SSN";
          }
          if (self.quickSummary.partnership && Object.keys(self.quickSummary.partnership).length > 0) {
            self.maskTypeDisplayValue = "EIN";
          }
          if (self.quickSummary.federalEfileData && self.quickSummary.federalEfileData.length > 0) {
            self.quickSummary.federalData = self.quickSummary.federalEfileData.find((obj) => {
              return obj.returnTypeCategory == 'MainForm' || obj.returnTypeCategory == 'ExtensionForm' || obj.returnTypeCategory == 'AmendedForm'
            });
          }
          if (self.quickSummary.stateEfileData && self.quickSummary.stateEfileData.length > 0) {
            self.quickSummary.stateData = self.quickSummary.stateEfileData.find((obj) => {
              return obj.returnTypeCategory == 'MainForm' || obj.returnTypeCategory == 'ExtensionForm' || obj.returnTypeCategory == 'AmendedForm'
            });
          }
        }
        self.isRefresh.emit(false);
      }, (error) => {
        self.message = self._quickReturnSummaryService.completeSummaryService.message;
        self.isRefresh.emit(false);
      });
    } else {
      this.isRefresh.emit(false);
      this.quickSummary = {};
      //condition done if tab press by user and SSN/EIN is blank then show the default msg and not error 
      if (this.ssnorein == '') {
        this.message = "Enter a valid " + this.maskType + "/ITIN to view the return's summary.";
      } else {
        this.message = "You have entered invalid " + this.maskType + ".";
      }
    }
  };

  getAllReturnList() {
    this.returnAPIService.getReturnList().then((res) => {
      if (res) {
        this.returnList = res;
        for (const returnData of this.returnList) {
          if (returnData.type === '1040') {
            returnData.ssn = returnData.ssnOrEinFull;
          } else {
            returnData.ein = returnData.ssnOrEinFull;
          }

        }
      } else {
        this.returnList = []
      }
    })
  }
  /**
   * @description get default status  
   * @param status 
   */
  public getDefaultStatus(status) {
    if (status) {
      //refresh return status list.. 
      return this._userService.getReturnStatusObject(status, undefined, true);
    }
  };

}
