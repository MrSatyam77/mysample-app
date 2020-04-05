// External Imports
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Router } from '@angular/router';

// Internal Imports
import { PreviewService } from '../instant-formview.service';
// import { PostalChannelService } from '../postalChannel.service';
// import { WebRTCService } from '../../shared/services/webRTC.service';
// import { SocketService } from '../../shared/services/socket.service';
import { LocalStorageUtilityService, UtilityService } from '../../shared/services/index';
import { PriceListPreviewComponent } from '../price-list-preview/price-list-preview.component';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FormPreviewComponent implements OnInit, OnDestroy {

  public staticFormData = {};
  public previewConfig: any = {};
  public formInfo = { taxYear: '2018', packageName: '1040', docName: 'd1040', stateName: 'federal', instance: '6' }
  // public formInfo: any = {};
  public currentFormInfo: any = {};
  public fieldsContainers: any;
  public fieldInfo: any = {};
  public taxReturn: any = {};
  private postalDataSubscription: any;

  // stmt handler var
  private stmtDocInfo: any = {};
  private needToPrintStmt: any = {};
  public overflowHtml: string;
  public stmtPrintTitleAt: any = {};
  public returnStmtDoc = {};
  public notSupportYear: string;
  public isCustomeTamplate = false;
  public isPriceListLoaded = false;
  public priceListComponentRef:any;
  @ViewChild('stmtContainer', { static: false }) stmtContainer: ElementRef;
  @ViewChild('custome_tamplate_container', { static: false, read: ViewContainerRef }) custome_tamplate_container: ViewContainerRef;

  constructor(private previewService: PreviewService,
    // private webRTCService: WebRTCService,
    private route: ActivatedRoute,
    // private postalChannelService: PostalChannelService,
    // private socketService: SocketService,
    private cd: ChangeDetectorRef,
    private localStorageUtilityService: LocalStorageUtilityService,
    private router: Router, private utilityService: UtilityService, private resolver: ComponentFactoryResolver) { }

  // disconnect session
  disconnetSession() {
    this.localStorageUtilityService.removeFromLocalStorage('deviceId');
    this.localStorageUtilityService.removeFromLocalStorage('masterLocationId');
    this.localStorageUtilityService.removeFromLocalStorage('authStatus');
    this.router.navigate(['/authorizeDevice']);
  }

  // call static server to get svg and and metaInformation
  getStaticData() {
    this.previewService.getStaticData(this.formInfo.taxYear, this.formInfo.packageName, this.formInfo.stateName, this.formInfo.docName)
      .then(staticForm => {
        this.staticFormData = staticForm;
        this.cd.detectChanges();
        this.previewService.getFieldType(this.formInfo.taxYear, this.formInfo.packageName, this.formInfo.stateName, this.formInfo.docName)
          .then(res => {
            this.fieldInfo = res;
            this.processStaticData();
            this.cd.detectChanges();
          }, error => {

          });
        this.getStmtDoc();
      }, error => {
      });
  }

  // filter stmt doc from elements list
  getStmtDoc() {
    this.stmtDocInfo = {};
    for (const staticInfo of this.staticFormData[this.formInfo.docName]) {
      if (typeof staticInfo.metaInformation === 'string') {
        staticInfo.metaInformation = JSON.parse(staticInfo.metaInformation);
        for (const metaInfo of staticInfo.metaInformation) {
          if (metaInfo.objectType === 'statement') {
            this.stmtDocInfo[metaInfo.stmtName] = metaInfo;
          }
        }
      }
    }
    this.setNeedToPrintStmt();
  }

  // filter stmt to actule display stmt based on taxReturn Data
  setNeedToPrintStmt() {
    this.needToPrintStmt = {};
    this.returnStmtDoc = {};
    this.stmtPrintTitleAt = {};
    for (const stmt in this.stmtDocInfo) {
      if (this.taxReturn.docs && this.taxReturn.docs[stmt]) {
        let i = 0;
        for (const stmtDocKey in this.taxReturn.docs[stmt]) {
          if (this.stmtDocInfo[stmt].stmtParentDoc) {
            if (!this.returnStmtDoc[stmt]) {
              this.returnStmtDoc[stmt] = {};
            }
            this.returnStmtDoc[stmt][stmtDocKey] = this.taxReturn.docs[stmt][stmtDocKey];
            i++;
          } else if (parseInt(this.taxReturn.docs[stmt][stmtDocKey].parent, undefined) === parseInt(this.formInfo.instance, undefined)) {
            if (!this.returnStmtDoc[stmt]) {
              this.returnStmtDoc[stmt] = {};
            }
            this.returnStmtDoc[stmt][stmtDocKey] = this.taxReturn.docs[stmt][stmtDocKey];
            i++;
          }
        }
        if (parseInt(this.stmtDocInfo[stmt].stmtMaxCount, undefined) < i) {
          this.needToPrintStmt[stmt] = this.stmtDocInfo[stmt];
          this.stmtPrintTitleAt[this.stmtDocInfo[stmt].stmtPrintTitleAt] = this.stmtDocInfo[stmt].stmtTitle;
        }
      }
    }

  }

  // stmt add at end of pdf
  _addOverflowStmt() {
    try {
      this.overflowHtml = '';
      this.stmtContainer.nativeElement.innerHTML = '';
      let isAnyDataInDiv = false;
      for (const i in this.needToPrintStmt) {
        if (this.needToPrintStmt.hasOwnProperty(i)) {
          let stmtDiv = `<div class="stmt_TitleDiv">${this.needToPrintStmt[i].stmtTitle}</div>`;
          stmtDiv = stmtDiv + '<table border="1" style="width: 100%;">';
          const stmtData = this.returnStmtDoc[this.needToPrintStmt[i].stmtName];
          if (this.needToPrintStmt[i].stmtHeaders !== undefined && this.needToPrintStmt[i].stmtElements !== undefined) {
            const stmtHeaders = this.needToPrintStmt[i].stmtHeaders.split('|');
            const stmtElements = this.needToPrintStmt[i].stmtElements.split('|');
            // header add as per meta information
            let headerDiv = '';
            for (const stmtHeader of stmtHeaders) {
              headerDiv = headerDiv + `<th>${stmtHeader}</th>`;
            }
            // for (let i2 = 0; i2 < stmtHeaders.length; i2++) {
            //   headerDiv = headerDiv + `<th>${stmtHeaders[i2]}</th>`;
            // }
            stmtDiv = stmtDiv + `<tr style="background: #c0c0c0;">${headerDiv}</tr>`;
            let isappend = false;

            // add data in table
            for (const instace in stmtData) {
              if (stmtData.hasOwnProperty(instace)) {
                const instaceData = stmtData[instace];
                const tr = document.createElement('tr');
                let isAddTd = false;
                let tdContainer = '';
                for (let i2 = 0; i2 < stmtElements.length; i2++) {
                  if (stmtElements[i2] && stmtElements[i2].includes('.')) {
                    const eleName = stmtElements[i2].split('.');
                    const eleFromAlign = eleName[1].split('?');
                    if (instaceData[eleFromAlign[0]] !== undefined && instaceData[eleFromAlign[0]].value !== undefined &&
                      instaceData[eleFromAlign[0]].value !== '') {
                      if (instaceData[eleFromAlign[0]].value === true) {
                        tdContainer = tdContainer + `<td>YES</td>`;
                      } else {
                        tdContainer = tdContainer + `<td>${instaceData[eleFromAlign[0]].value}</td>`;
                      }

                      isappend = true;
                      isAddTd = true;
                    } else {
                      tdContainer = tdContainer + `<td></td>`;
                    }
                  } else {
                    tdContainer = tdContainer + `<td></td>`;
                  }
                }
                if (isAddTd === true) {
                  stmtDiv = stmtDiv + `<tr>${tdContainer}</tr>`;
                }
              }

            }
            if (isappend === true) {
              isAnyDataInDiv = true;
              stmtDiv = stmtDiv + '</table>';
              this.overflowHtml = this.overflowHtml + stmtDiv;
            }
          }
        }
      }
      if (isAnyDataInDiv === true) {
        this.stmtContainer.nativeElement.innerHTML = this.overflowHtml;
        this.stmtContainer.nativeElement.classList.add('stmt_box');
      } else {
        this.stmtContainer.nativeElement.classList.remove('stmt_box');
      }

    } catch (e) {
      console.log(e);
    }

  }


  // process on metaInfo and display formatted value
  processStaticData() {
    if (this.formInfo.docName === 'dDeprwkt' || this.formInfo.docName === 'dVehicleDeprWkt') {
      this.assertReport();
      this.isPriceListLoaded = false;
    } else if (this.formInfo.docName === 'dPriceList') {
      if (this.isPriceListLoaded !== true) {
        setTimeout(()=> {
          this.priceList();
        });
        this.isPriceListLoaded = true;
      }
    } else {
      this.isPriceListLoaded = false;
      const indexHandler = {};

      let i = 0;
      if (this.staticFormData[this.formInfo.docName]) {
        for (const staticInfo of this.staticFormData[this.formInfo.docName]) {
          this.fieldsContainers = document.getElementById('fields_containers_' + i);
          if (!this.fieldsContainers) {
            this.fieldsContainers = document.createElement('div');
            this.fieldsContainers.id = 'fields_containers_' + i;
            this.fieldsContainers.className = 'container';
          } else {
            this.fieldsContainers.innerHTML = '';
          }

          // this.overflowStmt = [];
          let metaInfo = JSON.parse(JSON.stringify(staticInfo.metaInformation));
          if (this.formInfo.docName === 'dOHSchJ' || this.formInfo.docName === 'dILSchB') {
            metaInfo = this.utilityService.sortByProperty(metaInfo, 'y');
          }
          const self = this;
          metaInfo.forEach((element) => {
            if (element.elementName !== undefined && element.elementName !== '') {
              if (element.docName === undefined || element.docName === '') {
                if (element.elementName.indexOf('.') > -1) {
                  const docEle = element.elementName.split('.');
                  element.docName = docEle[0];
                  element.elementName = docEle[1];
                  if (self.taxReturn.docs[element.docName]) {
                    element.formsinstant = Object.keys(self.taxReturn.docs[element.docName])[0];
                    self.processElementVal(element);
                  }
                } else {
                  element.docName = self.formInfo.docName;
                  element.formsinstant = self.formInfo.instance;
                  self.processElementVal(element);
                }
              } else if (self.taxReturn.docs[element.docName]) {
                if (!self.needToPrintStmt[element.docName]) {
                  const selectedDoc = this.stmtDocInfo[element.docName] ?
                    self.returnStmtDoc[element.docName] : self.taxReturn.docs[element.docName];
                  if (selectedDoc !== undefined) {
                    if (indexHandler[element.docName] && indexHandler[element.docName][element.elementName] !== undefined) {
                      indexHandler[element.docName][element.elementName]++;
                      element.formsinstant = Object.keys(selectedDoc)[indexHandler[element.docName][element.elementName]];
                    } else {
                      if (!indexHandler[element.docName]) {
                        indexHandler[element.docName] = {};
                      }
                      indexHandler[element.docName][element.elementName] = 0;
                      element.formsinstant = Object.keys(selectedDoc)[0];
                    }

                    self.processElementVal(element);
                  }
                } else if (self.needToPrintStmt[element.docName].stmtPrintTitleAt === element.name) {
                  element.formsinstant = self.formInfo.instance;
                  self.processElementVal(element, 'SEE ' + self.needToPrintStmt[element.docName].stmtTitle);
                }
              }
            }
          });
          if (document.getElementById('svg_containers_' + i)) {
            document.getElementById('svg_containers_' + i).parentElement.appendChild(this.fieldsContainers);
          }
          i++;
        }
        this._addOverflowStmt();
      }
    }

  }

  // price list create by this function 
  priceList() {
    // create main div to hold all information of assert
    var div = document.createElement('div')
    //  div.id = 'print_preview_pdf_' + index;
    //  div.style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
    div.style.padding = '15px';
    div.classList.add('overflow_containers');
    const priceListDetail: any = {};
    // get value for create print list
    priceListDetail.prepareFName = this._getPreparerInfoForPriceList(["strprnm", "PrepareName"]);
    priceListDetail.strprfrmnm = this._getPreparerInfoForPriceList(["strprfrmnm", "PrepareFirmName"]);
    priceListDetail.prepareAdd = this._getPreparerInfoForPriceList(["strpradd", "PrepareAdd"]);
    priceListDetail.prepareCSZ = this._getPreparerInfoForPriceList(["strprcity", "Preparecity"]) + "," + this._getPreparerInfoForPriceList(["strprst", "Preparestate"]) + " "
      + this._getPreparerInfoForPriceList(["strprzip", "Preparezip"]);
    priceListDetail.preparePh = this._getPreparerInfoForPriceList(["strprtele", "PreparePhone"]);
    priceListDetail.prepareEmail = this._getPreparerInfoForPriceList(["strpreml", "PrepareEmail"]);
    priceListDetail.PreparerName = this._getElementValue("dPriceList.PreparerName");
    priceListDetail.firmStreet1 = this._getElementValue("dPriceList.firmStreet");
    priceListDetail.firmCSZ = this._getElementValue("dPriceList.firmCity") + ',' + this._getElementValue("dPriceList.firmState") + ' ' + this._getElementValue("dPriceList.firmZip");
    priceListDetail.invoiceNumber = this._getElementValue("dPriceList.InvoiceNumber");
    priceListDetail.date = this._getElementValue("dPriceList.Date");
    priceListDetail.firmStreet = this._getElementValue("dPriceList.firmCity") + ',' + this._getElementValue("dPriceList.firmState") + ' ' + this._getElementValue("dPriceList.firmZip");
    priceListDetail.duedate = this._getElementValue("dPriceList.Duedate");
    priceListDetail.priceDate = this._getElementValue("dPriceList.Date");
    priceListDetail.summerizePriceListData = this._getElement("dPriceList.summerizePriceListData")
    priceListDetail.TotalPercentChargeAmt1 = this._getElementValue("dPriceList.TotalPercentChargeAmt1");
    priceListDetail.TotalCharges = this._getElementValue("dPriceList.TotalCharges", undefined, '0.00');
    priceListDetail.TotalPercentChargeAmttax = this._getElementValue("dPriceList.TotalPercentChargeAmttax", undefined, '0.00');
    priceListDetail.TotalPayment = this._getElementValue("dPriceList.TotalPayment", undefined, '0.00');
    priceListDetail.ServicesCharges = this._getElementValue("dPriceList.ServicesCharges", undefined, '0.00');
    priceListDetail.TotalOtherCharge = this._getElementValue("dPriceList.TotalOtherCharge", undefined, '0.00');
    priceListDetail.totalwithDiscount = 0;
    if (priceListDetail.summerizePriceListData == undefined || priceListDetail.summerizePriceListData == '') {
      priceListDetail.summerizePriceListData = []
    }
    priceListDetail.summerizePriceListData.push({ 'description': 'Discount', 'total': priceListDetail.TotalPercentChargeAmt1 })
    for (var i1 = 0; i1 < priceListDetail.summerizePriceListData.length; i1++) {
      if (priceListDetail.summerizePriceListData[i1] !== undefined) {
        if (priceListDetail.summerizePriceListData[i1].description != 'Discount') {
          priceListDetail.totalwithDiscount += parseFloat(priceListDetail.summerizePriceListData[i1].total);
        } else {
          priceListDetail.totalwithDiscount = priceListDetail.totalwithDiscount - parseFloat(priceListDetail.summerizePriceListData[i1].total);
        }
      }
    }
    priceListDetail.totalwithDiscount = priceListDetail.totalwithDiscount.toString().indexOf('.') == -1 ?
      priceListDetail.totalwithDiscount.toString() + '.00' : priceListDetail.totalwithDiscount.toString();
    // append all divs
    // console.log($scope.priceListDetail);
    this.custome_tamplate_container.clear();
    document.getElementById('custome_tamplate_container').innerHTML = '';
    const factory = this.resolver.resolveComponentFactory(PriceListPreviewComponent);
    const componentRef = this.custome_tamplate_container.createComponent(factory);
    componentRef.instance.priceListDetail = priceListDetail;
    this.priceListComponentRef = componentRef;
    // if (dir == 'down') {
    //   document.getElementById('displayed-svg').appendChild(div);
    // } else {
    //   document.getElementById('displayed-svg').insertBefore(div, document.getElementById('displayed-svg').firstChild);
    // }
  }

  _getPreparerInfoForPriceList(fieldNames) {
    var info = "";
    var allReturnInfos = ["dReturnInfo", "d1041RIS", "d1065RIS", "d1120CRIS", "d1120SRIS", "d990RIS"];
    for (var i = 0; i < allReturnInfos.length; i++) {
      for (var j = 0; j < fieldNames.length; j++) {
        var wholeFieldName = allReturnInfos[i] + "." + fieldNames[j];
        var elementValue = this._getElementValue(wholeFieldName, "");
        if (elementValue != undefined && elementValue != "") {
          info = elementValue;
        }
      }
    }
    return info;
  }

  _getElement(elementName, formInstance?) {
    var docName = elementName.split('.')[0];
    var elementName = elementName.split('.')[1];
    if (formInstance) {
      return this.taxReturn.docs[docName] ? this.taxReturn.docs[docName][formInstance] ?
        this.taxReturn.docs[docName][formInstance][elementName] : '' : '';
    } else {
      if (this.taxReturn.docs[docName]) {
        formInstance = Object.keys(this.taxReturn.docs[docName])[0];
        return this.taxReturn.docs[docName][formInstance][elementName] ? this.taxReturn.docs[docName][formInstance][elementName] : '';
      }
    }
    return
  }

  processElementVal(element, eleval?: string) {

    let eleValue = { value: eleval };
    if (eleval === undefined &&
      this.taxReturn.docs[element.docName] && this.taxReturn.docs[element.docName][element.formsinstant] !== undefined) {
      eleValue = this.taxReturn.docs[element.docName][element.formsinstant][element.elementName];
    }
    // special case for stmt
    if (this.stmtPrintTitleAt[element.name]) {
      eleValue = { value: 'SEE ' + this.stmtPrintTitleAt[element.name] };
    }

    const condition = (element.If === undefined) ? element.whenToPrint : element.If;
    if (condition && condition.indexOf('=') > -1) {
      const conditionSplit = condition.split('=');
      const eleName = conditionSplit[0];
      let docNameForCon = element.docName;
      let elementNameForCon = eleName;
      if (eleName.indexOf('.') > 0) {
        docNameForCon = eleName.split('.')[0];
        elementNameForCon = eleName.split('.')[1];
      }
      const checkValue = conditionSplit[1];
      if (this.taxReturn.docs[docNameForCon][element.formsinstant][elementNameForCon] && this.taxReturn.docs[docNameForCon][element.formsinstant][elementNameForCon].value &&
        this.taxReturn.docs[docNameForCon][element.formsinstant][elementNameForCon].value.toString() !== checkValue.toString()) {
        eleValue = { value: undefined };
      }
    }
    if (eleValue !== undefined) {
      this._setTextboxValue(eleValue.value, element, this.formInfo.stateName);
      if (element.objectType === 'checkbox') {
        if (element.isMatch === true) {
          this._setValueOfCheckBox(element);
        }
      } else if (element.objectType === 'statement') {
      } else {
        this._setValueOfInput(element);
      }
    }

  }

  // assert report create by this function
  assertReport() {
    // calculation of Total fields
    var totalVal = [];
    var totalFieldArr = [2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    if (this.formInfo.docName == 'dVehicleDeprWkt') {
      totalFieldArr = [2, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15]
    }
    for (var i0 = 0; i0 < totalFieldArr.length; i0++) {
      totalVal.push(0.0);
    }
    // create main div to hold all information of assert
    var div = document.createElement('div')
    div.id = 'print_preview_pdf_assertReport';
    //  div.style.transform = 'rotate(' + $scope.pages.rotateVal + 'deg)';
    div.classList.add('stmt_box')

    var stmtTitleDiv = document.createElement('div');
    stmtTitleDiv.classList.add('asset_TitleDiv')

    if (this.formInfo.docName == 'dVehicleDeprWkt') {
      stmtTitleDiv.innerHTML = 'Vehicle Asset Depreciation Report'
    } else {
      stmtTitleDiv.innerHTML = 'Asset Depreciation Report'
    }
    var table = document.createElement('table');
    table.style.width = '100%'
    table.classList.add('asset_table')
    var columnTitles = ["Description(Type)", "Date\nIn\nSvc", "Cost/\nBasis", "Prior\n179\nBonus", "Bus.\nUse\nPer.",
      "Method", "Cv", "Life", "Crnt.\n179", "Crnt.\nBonus", "Prior\nDepr.", "Crnt.\nDepr.\nDeduc.", "Prior\nSpecial\nDepr.\nAllow.",
      "Prior\nAMT", "Crnt.\nAMT", "Crnt.\nAmo.\nDep."]
    if (this.formInfo.docName == 'dVehicleDeprWkt') {
      columnTitles = ["Description", "Date\nAcqd.", "Cost", "Bus.\nUse", "179+\nSpec.", "Basis", "Method", "Rec.\nPer.", "Cv", "Prior\nDepr.", "Crnt.\nDepr.", "Next\nYear", "Prior\nAMT", "Crnt.\nAMT", "Gain/\nPrince", "Sales\nPrice", "Date\nSold"]
    }
    var tr = document.createElement('tr');
    tr.style['border-bottom'] = '1px solid #000';
    for (var j = 0; j < columnTitles.length; j++) {
      var th = document.createElement('th');
      th.innerHTML = columnTitles[j];
      tr.appendChild(th);
    }

    table.appendChild(tr);
    var assetDetails;
    if (this.formInfo.docName == 'dVehicleDeprWkt') {
      assetDetails = this.getVehicleAssetData(this.formInfo);
    } else {
      assetDetails = this.getAssetDetails(this.formInfo);
    }
    var parentForm = ''
    for (var i = 0; i < assetDetails.length; i++) {
      var assetDetail = assetDetails[i];
      if (parentForm !== assetDetail.parentFormInst) {
        var tr = document.createElement('tr');
        parentForm = assetDetail.parentFormInst;
        var td = document.createElement('td');
        td.colSpan = columnTitles.length;
        td.style.fontWeight = 'bold';
        td.innerHTML = 'Parent form: ' + assetDetail.parentFormName;
        tr.appendChild(td);
        table.appendChild(tr);
      }

      var tr1 = document.createElement('tr');
      var cellIndex = 0;
      for (var j = 0; j < assetDetail.values.length; j++) {
        var td = document.createElement('td');
        if (assetDetail.values[j] != undefined) {
          td.innerHTML = assetDetail.values[j];
        }
        if (totalFieldArr.indexOf(j) > -1) {
          td.style['text-align'] = 'right';
          if (!isNaN(parseFloat(assetDetail.values[j]))) {
            totalVal[cellIndex] = totalVal[cellIndex] + parseFloat(assetDetail.values[j]);
          }
          cellIndex++;
        }
        tr1.appendChild(td);
      }
      table.appendChild(tr1);

      // code for append total Value in table
      if ((assetDetails[i + 1] && parentForm !== assetDetails[i + 1].parentFormInst) || assetDetails.length == i + 1) {
        if (totalVal.length > 0) {
          var totaltr = document.createElement('tr');
          var td = document.createElement('td');
          td.innerHTML = 'Total :';
          totaltr.appendChild(td);
          totaltr.style['border-top'] = '1px solid #000';
          for (var i1 = 1; i1 < columnTitles.length; i1++) {
            var td = document.createElement('td');
            var index11 = totalFieldArr.indexOf(i1)
            if (index11 > -1) {
              td.style['text-align'] = 'right';
              if (Number.isInteger(totalVal[index11])) {
                td.innerHTML = totalVal[index11] + '.0';
              } else {
                td.innerHTML = totalVal[index11];
              }

            }
            totaltr.appendChild(td);
          }
          table.appendChild(totaltr);
        }
        totalVal = [];
        for (var i0 = 0; i0 < totalFieldArr.length; i0++) {
          totalVal.push(0.0);
        }
      }
    }
    div.appendChild(stmtTitleDiv);
    div.appendChild(table);
    if (this.priceListComponentRef) {
      this.priceListComponentRef.destroy();
    }
    document.getElementById('custome_tamplate_container').innerHTML = '';
    document.getElementById('custome_tamplate_container').appendChild(div);
  }

  getAssetDetails(printObj) {
    var assetData = []
    var parentForms = ["d1040SS", "d4835", "dSchC", "dSchF", "dSchE", "dSchEDup", "d2106", "d1065", "d8825", "d1120C", "d1120S", "d990"];
    var parentFormsName = ["1040SS", "4835", "Schedule C", "Schedule F", "Schedule E", "Schedule E (Duplicate)", "2106", "1065", "8825", "1120C", "1120S", "990"];
    for (var i = 0; i < parentForms.length; i++) {
      var parentForm = parentForms[i];
      var parentFormInsts = this._getFormInstances(parentForm);
      for (var j = 0; j < parentFormInsts.length; j++) {
        var parentFormInst = parentFormInsts[j];
        var d4562Insts = this._getChildInstFromParentInst("d4562", parentFormInst);
        for (var j1 = 0; j1 < d4562Insts.length; j1++) {
          var d4562Inst = d4562Insts[j1];
          var deprInsts = this._getChildInstFromParentInst("dDeprwkt", d4562Inst);
          for (var j2 = 0; j2 < deprInsts.length; j2++) {
            var deprInst = deprInsts[j2];
            if (printObj.instance && printObj.instance.indexOf(deprInst) > -1) {
              var parentFormName = parentFormsName[i] + (this._getElementValue("dDeprwkt.fieldem", deprInst, "") == "" ? "" : "(" + this._getElementValue("dDeprwkt.fieldem", deprInst, "") + ")");
              var checkForPropertyType = this._checkForPropertyType(parentFormName, this._getElementValue("dDeprwkt.fieldem", deprInst, ""));
              if (checkForPropertyType) {
                var fieldem = this._getElementValue("dDeprwkt.fieldem", deprInst);
                var deprClass = this._getElementValue("dDeprwkt.DeprClass", deprInst);
                var parentFormName = parentFormsName[i] + (fieldem != '' && fieldem != undefined ? '(' + fieldem + ')' : '');
                var values = [
                  this._getElementValue("dDeprwkt.fieldel", deprInst) + (deprClass != '' && deprClass != undefined ? '(' + deprClass + ')' : ''),
                  this._getElementValue("dDeprwkt.fieldek", deprInst),
                  this._getElementValue("dDeprwkt.fieldei", deprInst),
                  this._getElementValue("dDeprwkt.priorsection", deprInst),
                  this._getElementValue("dDeprwkt.fieldcl", deprInst),
                  this._getElementValue("dDeprwkt.fielddi", deprInst),
                  this._getElementValue("dDeprwkt.Convention", deprInst),
                  this._getElementValue("dDeprwkt.fielddg", deprInst),
                  this._getElementValue("dDeprwkt.fieldbz", deprInst),
                  this._getElementValue("dDeprwkt.fieldbs", deprInst),
                  this._getElementValue("dDeprwkt.fieldcs", deprInst),
                  this._getElementValue("dDeprwkt.fieldcu", deprInst),
                  this._getElementValue("dDeprwkt.fieldci", deprInst),
                  this._getElementValue("dDeprwkt.fieldbn", deprInst),
                  this._getElementValue("dDeprwkt.fieldbk", deprInst),
                  this._getElementValue("dDeprwkt.fieldbi", deprInst)

                ]
                assetData.push({ 'parentFormInst': parentFormInst, 'parentFormName': parentFormName, 'values': values })
              }
            }
          }
        }
      }
    }
    return assetData;
  }

  getVehicleAssetData(printObj) {

    var types = { '1': "Vehicles Under 6000 lbs", '2': "6000 - 14000 GVW", '3': "Trucks and Vans", '4': "Light Duty Trucks/Vans/SUVs Under 6000 lbs", '5': "Equipment and Trucks / Special Use Vehicles", '6': "Electric Automobiles" };

    var assetData = []
    var parentForms = ["d4835", "dSchC", "dSchF", "dSchE", "dSchEDup", "d2106", "d1065", "d8825", "d1120C", "d1120S"];
    var parentFormsName = ["4835", "Schedule C", "Schedule F", "Schedule E", "Schedule E (Duplicate)", "2106", "1065", "8825", "1120C", "1120S"];
    for (var i = 0; i < parentForms.length; i++) {
      var parentForm = parentForms[i];
      var parentFormInsts = this._getFormInstances(parentForm);
      for (var j = 0; j < parentFormInsts.length; j++) {
        var parentFormInst = parentFormInsts[j];
        var d4562Insts = this._getChildInstFromParentInst("d4562", parentFormInst);
        for (var j1 = 0; j1 < d4562Insts.length; j1++) {
          var d4562Inst = d4562Insts[j1];
          var deprInsts = this._getChildInstFromParentInst("dVehicleDeprWkt", d4562Inst);
          for (var j2 = 0; j2 < deprInsts.length; j2++) {
            var deprInst = deprInsts[j2];
            var parentFormName = parentFormsName[i] + (this._getElementValue("dVehicleDeprWkt.fieldaf", deprInst, "") == "" ? "" : "(" + this._getElementValue("dVehicleDeprWkt.fieldaf", deprInst, "") + ")");
            var checkForPropertyType = this._checkForPropertyType(parentFormName, this._getElementValue("dVehicleDeprWkt.fieldaf", deprInst, ""));
            if (checkForPropertyType) {
              if (printObj.formInstances && printObj.formInstances.indexOf(deprInst) > -1) {
                var deprClassValue = this._getElementValue("dVehicleDeprWkt.DeprClass", deprInst);
                var typeValue = "";
                if (deprClassValue != "") {
                  typeValue = types[deprClassValue];
                }
                var values = [this._getElementValue("dVehicleDeprWkt.fieldfv", deprInst, "") + ("(" + typeValue + ")"),
                this._getElementValue("dVehicleDeprWkt.fieldfu", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldfs", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldfk", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldda", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fielddr", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldec", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldej", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldel", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fielddn", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldcv", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fielddl", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldcr", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldcv3", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldes", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldfb", deprInst, ""),
                this._getElementValue("dVehicleDeprWkt.fieldfg", deprInst, "")];
                assetData.push({ 'parentFormInst': parentFormInst, 'parentFormName': parentFormName, 'values': values })
              }
            }

          }
        }
      }
    }
    return assetData;
  }
  // format value for Ny state
  _formatValueForNYState(value) {
    try {
      if (!isNaN(value)) {
        const decimalValue = value.split('.');
        return decimalValue[0];
      }
    } catch (e) {
      return value;
    }
    return value;
  }

  _checkForPropertyType(parentFormName, propteryType) {
    var check = true;
    if (parentFormName.includes("Schedule E") || parentFormName.includes("Schedule E (Duplicate)") || parentFormName.includes("8825") || parentFormName.includes("8825 (Duplicate)")) {
      if (propteryType != "") {
        var formProperty = parentFormName.substring(parentFormName.lastIndexOf("(") + 1, parentFormName.lastIndexOf(")"));
        check = (formProperty == propteryType) ? true : false;
      }
    }
    return check;
  }
  // get value from _taxReturn object
  _getElementValue(elementName, formInstance?, defaultValue?) {
    let returnVal;
    const docName = elementName.split('.')[0];
    elementName = elementName.split('.')[1];
    if (defaultValue === undefined) {
      defaultValue = '';
    }
    if (formInstance) {
      returnVal = this.taxReturn.docs[docName] ? this.taxReturn.docs[docName][formInstance] ?
        this.taxReturn.docs[docName][formInstance][elementName] ?
          this.taxReturn.docs[docName][formInstance][elementName].value : defaultValue : defaultValue : defaultValue;
    } else {
      if (this.taxReturn.docs[docName]) {
        formInstance = Object.keys(this.taxReturn.docs[docName])[0];
        returnVal = this.taxReturn.docs[docName][formInstance][elementName] ?
          this.taxReturn.docs[docName][formInstance][elementName].value : defaultValue;
      }
    }
    if (returnVal === 0 && defaultValue === '0.00') {
      returnVal = '0.00';
    }
    return returnVal;
  }

  // call contentService for get type
  _getFieldType(element) {
    if (element) {
      if (element.elementName.includes('.')) {
        const eleName = element.elementName.split('.')[1];
        return this.fieldInfo[this.formInfo.docName][eleName] ? this.fieldInfo[this.formInfo.docName][eleName].type : '';
      } else {
        return this.fieldInfo[this.formInfo.docName][element.elementName] ?
          this.fieldInfo[this.formInfo.docName][element.elementName].type : '';
      }
    }
  }

  // return instance of give form name
  _getFormInstances(formName) {
    return this.taxReturn && this.taxReturn.docs && this.taxReturn.docs[formName] ? Object.keys(this.taxReturn.docs[formName]) : '';
  }

  // return child instance of given form name and form instance
  _getChildInstFromParentInst(formName, parentFormInst) {
    var docSelected = this.taxReturn && this.taxReturn.docs && this.taxReturn.docs[formName] ? this.taxReturn.docs[formName] : '';
    var inst = []
    if (docSelected) {
      for (var childInst in docSelected) {
        if (docSelected[childInst].parent == parentFormInst) {
          inst.push(childInst);
        }
      }
    }
    return inst;
  }
  getChildDoc(childDocName, parentId) {
    var childDoc = {}
    if (this.taxReturn && this.taxReturn.docs && this.taxReturn.docs[childDocName]) {
      for (var index in this.taxReturn.docs[childDocName]) {
        var docObj = this.taxReturn.docs[childDocName][index];
        if (docObj.parent == parentId) {
          childDoc[index] = docObj
        }
      }
    }
    return childDoc;
  }

  // formate value base on requrments
  _formatValue(element, fieldType) {
    let value = element.elementValue;
    if (fieldType && fieldType.toLowerCase() === 'money') {
      value = value.toString().replace(/,/g, '');
      const splitval = value.split('.');
      let fractional: any = parseInt(splitval[0], undefined);
      if (fractional) {
        fractional = fractional.toLocaleString();
      }
      if (splitval[1]) {
        value = fractional + '.' + splitval[1];
      } else {
        value = fractional;
      }
    }
    if (fieldType && this.previewConfig.maskSensitiveInfo === true && value !== undefined) {
      switch (fieldType.toUpperCase()) {
        case 'ETIN':
        case 'EFIN':
        case 'ROUNTINGNO': {
          if (/^[0-9]*$/.test(value) === false) {
            break;
          }
          break;
        }
        case 'ACCOUNTNO': {
          if (/^[0-9]*$/.test(value) === false) {
            break;
          }
          break;
        }
        case 'PID': {
          value = value.replace(/./g, 'X');
          break;
        }
        case 'EIN': {
          if (/^[0-9]{2}\-[0-9]{7}$/.test(value) === true) {
            value = value.substring(0, value.length - 4).replace(/[0-9]/g, 'X') + value.substring(value.length - 4);
          }
          break;
        }
        case 'SSN': {
          if (/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/.test(value) === true) {
            value = value.substring(0, value.length - 4).replace(/[0-9]/g, 'X') + value.substring(value.length - 4);
          }
          break;
        }
        case 'PTIN': {
          value = value.replace(/[0-9]/g, 'X');
          break;
        }
      }
    }
    return value;
  }

  _setValueOfCheckBox(element) {
    const newElement = document.createElement('i');
    newElement.className = 'cross_icon';
    newElement.innerHTML = 'x';
    newElement.style.position = 'absolute';
    newElement.style.height = element.height + 'px';
    newElement.style.width = element.width + 'px';
    if (element.height < 16) {
      newElement.style['line-height'] = '8px';
    }
    newElement.style.left = parseFloat(element.x) + 2 + 'px';
    newElement.style.top = parseFloat(element.y) + 1 + 'px';
    this.fieldsContainers.appendChild(newElement);
  }

  // add text in svg
  _setValueOfInput(element) {
    if (element.combOf !== undefined && element.combOf !== '' && element.elementValue !== undefined && element.elementValue !== '') {
      const comboWidth = (parseFloat(element.width) / element.combOf);
      let x = parseFloat(element.x);
      const y = parseFloat(element.y);
      const combodiv = document.createElement('div');
      combodiv.style.left = x + 5 + 'px';
      combodiv.style.top = y + 2 + 'px';
      combodiv.style.width = element.width + 'px';
      combodiv.style.position = 'absolute';

      element.fieldType = this._getFieldType(element);
      let value = this._formatValue(element, element.fieldType);
      if (value !== undefined) {
        if (element.combOf !== value.length) {
          value = value.toString().replace(/-/g, '');
        }

        for (let i = 0; i < parseFloat(element.combOf); i++) {
          let j = 6;
          if (i !== 0) {
            j = comboWidth / 2;
          }
          // let y = parseFloat(element.y);
          const newElement = document.createElement('div');
          newElement.style.width = comboWidth + 'px';
          newElement.style.cssFloat = 'left';
          if (value[i] !== '-') {
            newElement.innerHTML = value[i];
          } else {
            newElement.innerHTML = '&nbsp;';
          }
          newElement.style['font-size'] = '8.5pt';
          newElement.style.color = '#000';
          if (newElement.innerHTML !== 'undefined' && newElement.innerHTML !== undefined) {
            combodiv.appendChild(newElement);
          }
          x = x + comboWidth;
        }
        this.fieldsContainers.appendChild(combodiv);
      }
    } else if (element.elementValue !== undefined && element.elementValue !== '') {
      element.fieldType = this._getFieldType(element);
      const value = this._formatValue(element, element.fieldType);
      const newElement = document.createElement('div');
      newElement.style.position = 'absolute';
      newElement.style.top = parseFloat(element.y) + 2 + 'px';
      if (element.alignment === 'right') {
        newElement.style.left = parseFloat(element.x) - 2 + 'px';
        newElement.style.width = parseFloat(element.width) - 2 + 'px';
        newElement.style.height = element.height + 'px';
        newElement.style['text-align'] = 'right';
        if (element.docName === 'd1120S') {
          newElement.style.top = parseFloat(element.y) + 1 + 'px';
        }
      } else if (element.alignment === 'center') {
        newElement.style.left = parseFloat(element.x) + 'px';

        newElement.style['text-align'] = 'center';
      } else {
        newElement.style['text-align'] = 'left';
        newElement.style.left = parseFloat(element.x) + 8 + 'px';
      }

      newElement.style['font-size'] = '8.5pt';
      newElement.style.color = '#000';
      newElement.style.width = element.width + 'px';

      newElement.innerHTML = value;
      this.fieldsContainers.appendChild(newElement);
    }

  }


  // value change as per display requiredments
  _setTextboxValue(value, element, stateName) {
    if (element.objectType === 'checkbox') {
      if (value !== undefined && value !== null && value !== '' && element.value !== undefined && element.value !== '') {
        const valueArray = element.value.split(',');
        for (const arrayInfo of valueArray) {
          if (value.toString().toLowerCase() === arrayInfo.toString().toLowerCase()) {
            element.isMatch = true;
          }
        }
        // for (let i = 0; i < valueArray.length; i++) {
        //   if (value.toString().toLowerCase() === valueArray[i].toString().toLowerCase()) {
        //     element.isMatch = true;
        //   }
        // }
      } else if (value !== undefined && value !== undefined && value !== ''
        && element.onValueCB !== undefined && element.onValueCB !== '') {
        if (value.toString().toLowerCase() === element.onValueCB.toString().toLowerCase()) {
          element.isMatch = true;
        } else if (value !== undefined && element.printvalue !== undefined && element.printvalue !== ''
          && (value === 'X' || value === true || value === false || value === 'true' || value === 'false')) {
          element.isMatch = true;
        }
      }

    } else if (element.multipleField && element.multipleField.includes(',')) {
      const fieldsArray = element.multipleField.split(',');
      for (let i = 0; i < fieldsArray.length; i++) {
        let token = fieldsArray[i];
        let temp = '';
        if (token.includes('=') && !token.endsWith('=')) {
          temp = token.subscribe(token.indexOf('=') + 1);
        } else if (token.includes('=') && token.endsWith('=')) {
          temp = '';
        } else {
          if (token.includes('.')) {
            temp = this._getElementValue(token);
          } else {
            const docName = element.docName;
            token = docName + '.' + token;
            temp = this._getElementValue(token, '1');
          }
        }

        if (temp !== undefined && temp.toString().trim() !== '' && temp.toString().trim() !== '0' && temp.toString().trim() !== '0.0') {
          temp = temp.toString();
          if (stateName && stateName.toLowerCase() === 'ny') {
            temp = this._formatValueForNYState(temp);
          }
          if (element.charToRemove !== undefined && element.charToRemove.trim() !== '') {
            const removeArray = element.charToRemove.split('|');
            for (const removeItem of removeArray) {
              temp = temp.replace(removeItem, '');
            }
            // for (let i0 = 0; i0 < removeArray.length; i0++) {
            //   temp = temp.replace(removeArray[i0], '');
            // }
          }

          if (element.charToReplace !== undefined && element.charToReplace.trim() !== '') {
            const charToReplace = element.charToReplace.split('#');
            for (const char of charToReplace) {
              const replaceArray = char.split('|');
              temp = temp.replace(replaceArray[0], replaceArray[1]);
            }
            // for (let i1 = 0; i1 < charToReplace.length; i1++) {
            //   const replaceArray = charToReplace[i1].split('|');
            //   temp = temp.replace(replaceArray[0], replaceArray[1]);
            // }
          }
          element.elementValue = temp;
          break;
        }

      }

    } else if (element.concat && element.concat.includes(',')) {
      let concatWith = ', ';
      let concat = element.concat;
      let temp = '';
      if (element.concatWith && element.concatWith.includes('#')) {
        concatWith = element.concatWith.substr(0, element.concatWith.indexOf('#'));
      }
      if (concat.includes('|')) {
        if (concat.substr(concat.indexOf('|')).includes('false')) {
          concatWith = ' ';
        }
        concat = concat.substr(0, concat.indexOf('|'));
      }
      const elementsArray = concat.split(',');
      for (let i = 0; i < elementsArray.length; i++) {
        let token = elementsArray[i];
        if (temp !== undefined && temp !== '') {
          if (token.includes('.')) {
            value = this._getElementValue(token);
            (value !== undefined && value !== '') ? temp += ' ' + concatWith + ' ' + value : temp = temp;

          } else {
            const docName = element.docName;
            token = docName + '.' + token;
            value = this._getElementValue(token, '1');
            (value !== undefined && value !== '') ? temp += ' ' + concatWith + ' ' + value : temp = temp;
          }
        } else {
          if (token.includes('.')) {
            temp = this._getElementValue(token);
          } else {
            const docName = element.docName;
            token = docName + '.' + token;
            temp = this._getElementValue(token, '1');
          }
        }
      }
      while (temp && temp.indexOf(',,') > -1) {
        temp = temp.replace(',,', ',');
      }
      if (temp && temp.endsWith(',')) {
        temp = temp.substr(0, temp.length - 1);
      }
      if (temp && temp.endsWith(', ')) {
        temp = temp.substr(0, temp.length - 2);
      }
      if (stateName && stateName.toLowerCase() === 'ny') {
        temp = this._formatValueForNYState(temp);
      }
      element.elementValue = temp ? temp : '';
    } else if (element.formatDate !== undefined && element.formatDate !== '') {
      if (value !== undefined && value !== '') {
        element.elementValue = moment(value, 'MM/DD/YYYY').format(element.formatDate.toUpperCase());
      }
    } else if (element.myDecimal !== undefined && element.myDecimal !== '' && value !== undefined) {
      let removeDot = false;
      let myDecimal = element.myDecimal;
      if (myDecimal.endsWith('|false')) {
        myDecimal = myDecimal.replace('|false', '').trim();
        removeDot = true;
      } else {
        myDecimal = myDecimal.replace('|true', '').trim();
      }
      let dblVal = 0.0;
      let pre = 0;
      if (value.toString().includes('', '')) {
        value = value.toString().replace(/,/g, '');
      }
      dblVal = parseFloat(value);
      pre = parseInt(myDecimal, undefined);
      const dblStr = dblVal.toString();
      const valArray = dblStr.split('.');
      if (valArray[1] !== undefined) {
        pre = pre - valArray[1].length;
      } else {
        valArray[1] = '';
      }

      for (let pk = 0; pk < pre; pk++) {
        valArray[1] += 0;
      }
      value = valArray[0] + '.' + valArray[1];
      if (element.charToRemove !== undefined && element.charToRemove.includes('.')) {
        value = valArray[0] + valArray[1];
      }
      if (removeDot) {
        value = value.replace('.', '');
      }
      element.elementValue = value;
    } else if (element.charFrom !== undefined && element.charFrom !== '' && value !== undefined) {
      if (element.charToRemove !== undefined && element.charToRemove !== '') {
        if (typeof value === 'string') {
          let finalValue = '';
          for (let i12 = 0; i12 < value.length; i12++) {
            if (value[i12] !== element.charToRemove) {
              finalValue += value[i12]
            }
          }
          value = finalValue;
        }
        value = value.replace(/-/g, '')
      }
      if (element.charTo !== undefined && element.charTo !== '') {
        element.elementValue = value.substring(parseInt(element.charFrom, undefined) - 1, parseInt(element.charTo, undefined));
      } else if (typeof value === 'string') {
        element.elementValue = value.substring(parseInt(element.charFrom, undefined) - 1);
      }
    } else if (element.charToRemove !== undefined && element.charToRemove !== '' && value !== undefined) {
      if (element.charFrom === undefined || element.charFrom === '') {
        let repalcedValue = '';
        for (const info of value) {
          if (info !== element.charToRemove) {
            repalcedValue = repalcedValue + info;
          }
        }
        // for (let i20 = 0; i20 < value.length; i20++) {
        //   if (value[i20] !== element.charToRemove) {
        //     repalcedValue = repalcedValue + value[i20];
        //   }
        // }
        element.elementValue = repalcedValue;
      }
    } else if (element.objectType === 'input' && element.printvalue !== undefined && element.printvalue !== ''
      && value !== undefined && element.value !== undefined) {
      if (element.value.toString() === value.toString()) {
        element.elementValue = element.printvalue;
      }
    } else {
      element.elementValue = value ? value : '';
    }

  }

  /**
   * @description
   *      To handle socket events for webRTC connection, offer and answer events.
   */
  setupWebRTCAndSocket() {
    // const self = this;
    // let deviceId = this.localStorageUtilityService.getFromLocalStorage('deviceId');
    // self.webRTCService.closeConnection();
    // self.webRTCService.createConnectionWithWebRTC();
    // self.socketService.on("passData", (data) => {
    //   if (data.type == "offer") {
    //     self.webRTCService.closeConnection();
    //     self.webRTCService.createConnectionWithWebRTC();
    //     self.webRTCService.offerAnswer(data.offer).then(function (answer) {
    //       self.socketService.emit("passData", { type: "answer", answer: answer, id: deviceId }, function (data) { });
    //     })
    //   } else if (data.type == "answer") {
    //     self.webRTCService.onAnswer(data.answer);
    //   } else if (data.type == "candidate") {
    //     self.webRTCService.onCandidate(data.candidate);
    //   } else {
    //     console.log(data);
    //   }
    // })
  }

  resetFields() {
    this.currentFormInfo = {};
    this.staticFormData = {};
    this.fieldInfo = {};
    this.taxReturn = {};
    if (this.stmtContainer && this.stmtContainer.nativeElement) {
      this.stmtContainer.nativeElement.innerHTML = '';
    }
    this.cd.detectChanges();
  }
  processPreview() {
    let data: any = { data: {} }
    data.data = this.localStorageUtilityService.getFromLocalStorage('returnPreview');
    if (data.data && parseInt(data.data.taxYear, undefined) > 2016) {
      this.notSupportYear = '';
      if (data.data) {
        this.formInfo = {
          taxYear: data.data.taxYear,
          packageName: data.data.packageName,
          docName: data.data.docName,
          stateName: data.data.stateName,
          instance: data.data.instance.toString()
        };
        if (this.formInfo.docName === 'dPriceList' || this.formInfo.docName === 'dDeprwkt' || this.formInfo.docName === 'dVehicleDeprWkt') {
          this.isCustomeTamplate = true;
          this.cd.detectChanges();
        } else {
          this.isCustomeTamplate = false;
        }
        this.taxReturn = { docs: data.data };
        if (this.currentFormInfo.docName === this.formInfo.docName) {
          const filedsEle = document.getElementsByClassName('fields_containers');
          while (filedsEle.length > 0) {
            filedsEle[0].remove();
          }
          this.setNeedToPrintStmt();
          this.processStaticData();
        } else {
          this.currentFormInfo = JSON.parse(JSON.stringify(this.formInfo));
          this.getStaticData();
        }
      } else {
        this.resetFields();
      }
    } else if (data.data && data.data.taxYear) {
      this.notSupportYear = data.data.taxYear;
      this.resetFields();
    } else {
      this.notSupportYear = '';
      this.resetFields();
    }

  }
  onStorageEvent(storageEvent) {

    if (storageEvent.key === 'returnPreview') {
      this.processPreview();
    }
  }
  ngOnInit() {
    window.addEventListener('storage', this.onStorageEvent.bind(this), false);
    this.processPreview();

    // const self = this;
    // self.setupWebRTCAndSocket();
    // // subscribe to postal channel events
    // self.postalDataSubscription = self.postalChannelService.postalMessage$.subscribe((data) => {
    //   if (data && data.topic === "ICECandidate") {
    //     self.socketService.emit(
    //       "passData",
    //       { type: "candidate", candidate: data.data, id: this.localStorageUtilityService.getFromLocalStorage('deviceId') },
    //       (data) => { });
    //   } else if (data && data.topic === 'updateData') {

    //   }
    // })

    // window.onbeforeunload = () => this.ngOnDestroy();
  }

  ngOnDestroy() {
    if (this.postalDataSubscription) {
      this.postalDataSubscription.unsubscribe();
    }
    // this.webRTCService.closeConnection();
  }

}
