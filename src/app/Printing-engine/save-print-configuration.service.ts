import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SavePrintConfigurationService {
  getselectedPreviewInfo: any = [];
  taxReturn: any;
  docFields: any;
  signaturesData: any;
  svgInfoWithDocIndex: any;
  private appConfigDetails = {
    '2019': {
      TaxYear: '2019',
      NACTPCode: '1937',
      ORBarcodeVersion: '00',
      RETURN_YEAR: '2019',
      DUE_DATE: '04/15/2020',
      DUE_DATE_BUS: '03/15/2020',
      DUE_DATE_CORP: '04/15/2020',
      STATE_DUE_DATE: '04/15/2020',
      PAY_BY_DATE: '04/15/2020',
      DUE_DATE_990: '11/15/2020',
      EXT_DUE_DATE: '04/15/2020',
      EXT_STATE_DUE_DATE: '04/15/2020',
      FILING_YEAR: '2020'
    }
  };

  constructor() { }

  setPrintConfiguration(getselectedPreviewInfo, taxReturn, docFields, signaturesData) {
    this.getselectedPreviewInfo = getselectedPreviewInfo;
    this.taxReturn = taxReturn;
    this.docFields = docFields;
    this.signaturesData = signaturesData;
  }

  setSvgInfoWithDocIndex(svgInfo) {
    this.svgInfoWithDocIndex = svgInfo;
  }

  setTaxReturn(taxReturn) {
    this.taxReturn = taxReturn;
  }

  getSvgInfoWithDocIndex() {
    return this.svgInfoWithDocIndex;
  }

  getPrintDataConfiguration() {
    return this.getselectedPreviewInfo;
  }

  setSelectedPreviewInfo(getselectedPreviewInfo) {
    this.getselectedPreviewInfo = getselectedPreviewInfo;
  }
  getTaxReturn() {
    return this.taxReturn;
  }

  getFieldType() {
      return this.docFields;
  }

  getSignaturesData() {
    return this.signaturesData;
  }
  getSProperty(property, taxYear) {
    return this.appConfigDetails[taxYear][property];
  }

}
