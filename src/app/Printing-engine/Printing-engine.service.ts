import { Injectable } from '@angular/core';
import { SavePrintConfigurationService } from '@app/Printing-engine/save-print-configuration.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { BarcodeGenerateService } from '@app/Printing-engine/barcode-generate.service';
@Injectable({
  providedIn: 'root'
})
export class PrintingEngineService {
  public depriciationDocIndexArray = [];
  public vehicleDepriciationDocIndexArray = [];
  public mainWorker;
  constructor(private savePrintConfigurationService: SavePrintConfigurationService, private systemConfigService: SystemConfigService,
    private barcodeGenerateService: BarcodeGenerateService) { }

  public printMultipleForms(infoForPrint) {

    return new Promise((resolve, reject) => {
      if (typeof Worker !== 'undefined') {

        let printDataConfiguration = this.savePrintConfigurationService.getPrintDataConfiguration();
        // get forms information based on docList indexs
        const forms = {};
        const svgInfo = {};
        for (const docIndex of infoForPrint.docList) {
          forms[docIndex] = this.savePrintConfigurationService.getTaxReturn().forms.find((obj) => {
            return obj.docIndex === docIndex;
          });
          if (printDataConfiguration[forms[docIndex].docName]) {
            svgInfo[docIndex] = printDataConfiguration[forms[docIndex].docName];
          }
        }
        const docList = this.setDocIndexes(infoForPrint, forms);
        this.savePrintConfigurationService.setSvgInfoWithDocIndex(svgInfo);
        // Create a new
        this.mainWorker = new Worker('@app/Printing-engine/workers/Printing-engine.worker', { type: 'module' });
        this.barcodeGenerateService.generateBarcode(forms, infoForPrint.locationDetails).then(() => {

          const taxReturn = this.savePrintConfigurationService.getTaxReturn();
          printDataConfiguration = this.savePrintConfigurationService.getPrintDataConfiguration();
          const docFields = this.savePrintConfigurationService.getFieldType();
          const signData = this.savePrintConfigurationService.getSignaturesData();
          const signatureTypeLookup = this.systemConfigService.getsignatureTypeLookup();

          this.mainWorker.postMessage({
            taxReturn: taxReturn,
            // printDataConfiguration: printDataConfiguration,
            formPropList: infoForPrint.formPropList,
            docIndexes: docList,
            printSelectedForms: infoForPrint.printingType,
            waterMarkText: infoForPrint.waterMark,
            isPasswordProtectedPDF: infoForPrint.isPasswordProtectedPDF,
            pdfCustomPassword: infoForPrint.pdfCustomPassword,
            maskSensitiveInfo: infoForPrint.maskSensitiveInfo,
            signatureRequired: infoForPrint.signatureRequired,
            refundSectionData: infoForPrint.refundSectionData,
            docFields: docFields,
            signatureData: signData,
            signTypeLookup: signatureTypeLookup,
            currentDate: infoForPrint.currentDate,
            removedDocIndex: infoForPrint.removedDocIndex,
            forms: forms,
            submissionIds: infoForPrint.submissionIds,
            printDataInfo: this.savePrintConfigurationService.getSvgInfoWithDocIndex()
          });
        });


        this.mainWorker.onmessage = ({ data }) => {
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(data.blob);
          a.href = url;
          a.download = infoForPrint.fileName;
          a.click();
          this.mainWorker.terminate();
          resolve();
        };
      } else {
        // Web Workers are not supported in this environment.
        // You should add a fallback so that your program still executes correctly.
      }
    });
  }
  private setDocIndexes(infoForPrint, forms) {
    const taxReturn = this.savePrintConfigurationService.getTaxReturn();
    const depreciationDocName = ['dDeprwkt', 'dVehicleDeprWkt', 'dSchUTTC40W'];
    infoForPrint.removedDocIndex = {};
    depreciationDocName.forEach(element => {
      const docListAfterProcess = [];
      // let depreciationForms = taxReturn.forms.filter(x => x.docName === element);
      // let formDocIndexs = depreciationForms.map(x => x.docIndex);
      let removedDocIndex = []
      /** Keep first element of infoForPrint.docLis*/
      // if (depreciationForms.length > 1) {
      let i = 0;
      for (let docIn of infoForPrint.docList) {
        if (forms[docIn].docName === element && i !== 0) {
          removedDocIndex.push(docIn);
        } else {
          if (forms[docIn].docName === element && i == 0) {
            i++;
          }
          docListAfterProcess.push(docIn);
        }
        // }
        // if (infoForPrint.removedDocIndex[element]) {
        infoForPrint.removedDocIndex[element] = removedDocIndex
        // }
        infoForPrint.docList = JSON.parse(JSON.stringify(docListAfterProcess));
      }
    });
    return infoForPrint.docList;
  }
}
