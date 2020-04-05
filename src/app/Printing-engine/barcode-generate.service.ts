import { Injectable } from '@angular/core';
import { SavePrintConfigurationService } from '@app/Printing-engine/save-print-configuration.service';
import { UserService } from '@app/shared/services/user.service';
import * as bwipjs from 'bwip-js';
import * as moment from 'moment';
@Injectable({
    providedIn: 'root'
})

export class BarcodeGenerateService {
    public taxReturn;
    public printDataInfo;
    public forms;
    public locationDetail;
    public currentFormDocIndex;
    public barcodeData;
    constructor(private savePrintConfigurationService: SavePrintConfigurationService, private userService: UserService) { }


    getElementValue(elementName, formInstance?, defaultValue?) {
        let returnVal
        let docName = elementName.split('.')[0];
        let eleName = elementName.split('.')[1];
        if (defaultValue == undefined) {
            defaultValue = ''
        }
        if (formInstance) {
            returnVal = this.taxReturn.docs[docName] ? this.taxReturn.docs[docName][formInstance] ?
                this.taxReturn.docs[docName][formInstance][eleName] ? this.taxReturn.docs[docName][formInstance][eleName].value : defaultValue : defaultValue : defaultValue;
        } else {
            if (this.taxReturn.docs[docName]) {
                formInstance = Object.keys(this.taxReturn.docs[docName])[0];
                returnVal = this.taxReturn.docs[docName][formInstance][eleName] ? this.taxReturn.docs[docName][formInstance][eleName].value : defaultValue
            }
        }
        if (returnVal === 0 && defaultValue === '0.00') {
            returnVal = '0.00';
        }
        return returnVal;
    }

    // return child instance of given form name and form instance
    getChildInstFromParentInst(formName, parentFormInst) {
        const docSelected = this.taxReturn && this.taxReturn.docs && this.taxReturn.docs[formName] ? this.taxReturn.docs[formName] : '';
        const inst = [];
        if (docSelected) {
            for (let childInst in docSelected) {
                if (parseInt(docSelected[childInst].parent, undefined) === parseInt(parentFormInst, undefined)) {
                    inst.push(childInst);
                }
            }
        }
        return inst;
    }

    // return instance of give form name
    getFormInstances(formName) {
        return this.taxReturn && this.taxReturn.docs && this.taxReturn.docs[formName] ? Object.keys(this.taxReturn.docs[formName]) : '';
    }

    replaceString(str) {
        let tempString = '';
        if (str && str.length > 0) {
            for (let i = 0; i < str.length; i++) {
                if (str[i] === '(' || str[i] === '_' || str[i] === ')' || str[i] === '-') {
                    //  str[i] = '';
                } else {
                    tempString += str[i];
                }
            }
            return tempString;
        }
    }

    formatDataforBarcode(currentEle, value, packageName) {
        try {
            // Validation class
            // const _validation = new Validation(); ???

            value = value.toString().trim().toUpperCase();

            // Types
            let bType = currentEle.bType;
            if (bType !== undefined && (bType === '' || value === undefined || value === '')) {
                if (bType.toLowerCase() === 'ohWeightedRatio') {
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 2) {
                                for (let pk = 0; pk <= 2 - temp[1].length; pk++) {
                                    temp[1] = temp[1] + '0';
                                }
                            } else {
                                temp[1] = temp[1].substring(0, 2);
                            }
                            value = '' + temp[0] + temp[1];
                        } else {
                            if (tempVal.length < 3) {
                                for (let pk = 0; pk < 3; pk++) {
                                    tempVal = '0' + tempVal;
                                }
                            }
                            value = '' + tempVal;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            } else if (bType !== undefined && bType !== '' && value !== undefined && value !== '') {
                if (bType.toLowerCase() === 'currency' && value.toUpperCase() !== 'SEQ217' && value.toUpperCase() !== 'SEQ162' && value.toUpperCase() !== 'SEQ31' && value.toUpperCase() !== "SEQ28") {
                    if (value.contains(',')) {
                        value = value.replace(',', '');
                    }
                    // value = Long.toString(Math.round(Double.parseDouble(value)));
                    value = value.toString(Math.round(parseInt(value, 0)));
                } else if (bType.toLowerCase() === 'percentage') {
                    // NumberFormat nf = NumberFormat.getInstance(); ??? 
                    if (packageName.includes('1120')) {
                        // nf.setMaximumFractionDigits(4); ????
                        // value = nf.format(parseInt(value, 0)); ???
                        value = Number.parseFloat(value).toFixed(4);
                        let tempVal = value.toString();
                        let temp = tempVal.split('\\.');

                        if (parseInt(temp[0], 0) < 100) {
                            if (temp[0].length === 1) {
                                temp[0] = '00' + parseInt(temp[0], 0);
                            } else if (temp[0].length === 2) {
                                temp[0] = '0' + parseInt(temp[0], 0);
                            }
                            if (temp[1].length < 4) {
                                for (let pk = 0; pk <= (4 - temp[1].length); pk++) {
                                    temp[1] += 0;
                                }
                            }
                            value = temp[0] + temp[1];
                        } else {
                            value = temp[0] + '0000';
                        }
                    } else {
                        // nf.setMaximumFractionDigits(1); ????
                        value = Number.parseFloat(value).toFixed(1);
                        if (value.contains('.')) {
                            value = value.replace('.', '');
                        } else {
                            if (parseInt(value, 0) < 100) {
                                value = parseInt(value, 0) + '0';
                            } else if (parseInt(value, 0) === 100) {
                                value = parseInt(value, 0) + '0';
                            }
                        }
                        if (value.length < 4) {
                            for (let i = value.length; i < 4; i++) {
                                value = '0' + value;
                            }
                        }
                    }
                } else if (bType.toLowerCase() === 'gaPercentage') {
                    // NumberFormat nf = NumberFormat.getInstance();
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            value = temp[0] + temp[1];
                            // Commented below as per asked in GA 600 and 600S rejections (03Jan2018)
                            /*if(temp[1].length() > 0 && temp[1].equalsIgnoreCase("00")) {
                            value = Math.round((Double.parseDouble(nf.format(Double.parseDouble(value)))))+"";
                            }else if(temp[1].length() > 0 && !temp[1].equalsIgnoreCase("00")) {
                            value = Math.round((Double.parseDouble(nf.format(Double.parseDouble(value))))) + "";
                            }*/
                        } else {
                            value = Math.round(value) + '';
                            // value = Math.round((Double.parseDouble(nf.format(Double.parseDouble(value))))) + ''; ?????
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'RICurrency') {
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 2) {
                                for (let pk = 0; pk <= (2 - temp[1].length); pk++) {
                                    temp[1] += '0';
                                }
                            } else {
                                temp[1] = temp[1].substring(0, 2);
                            }
                            value = temp[0] + temp[1];
                        } else {
                            value = tempVal + '00';
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'ohPercentage') {
                    // NumberFormat nf = NumberFormat.getInstance();
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 2) {
                                for (let pk = 0; pk <= (2 - temp[1].length); pk++) {
                                    temp[1] += '0';
                                }
                            } else {
                                temp[1] = temp[1].substring(0, 2);
                            }
                            if (temp[0].length < 3) {
                                for (let pk = 0; pk <= (3 - temp[0].length); pk++) {
                                    temp[0] = '0' + temp[0];
                                }
                            }

                            value = temp[0] + temp[1];
                        } else {
                            if (tempVal.length < 3) {
                                for (let pk = 0; pk <= (3 - tempVal.length); pk++) {
                                    tempVal = '0' + tempVal;
                                }
                            }
                            value = tempVal + '00';
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }

                } else if (bType.toLowerCase() === 'ohRatio') {
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 6) {
                                for (let pk = 0; pk <= (6 - temp[1].length); pk++) {
                                    temp[1] = temp[1] + '0';
                                }
                            } else {
                                temp[1] = temp[1].substring(0, 6);
                            }
                            value = temp[0] + temp[1];
                        } else {
                            if (tempVal.length < 7) {
                                for (let pk = 0; pk < 6; pk++) {
                                    tempVal = tempVal + "0";
                                }
                            }
                            value = tempVal;
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'ohWeightedRatio') {
                    try {
                        let tempVal = value.valueOf();
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 2) {
                                for (let pk = 0; pk <= (2 - temp[1].length); pk++) {
                                    temp[1] = temp[1] + '0';
                                }
                            } else {
                                temp[1] = temp[1].substring(0, 2);
                            }
                            value = '' + temp[0] + temp[1];
                        } else {
                            if (tempVal.length < 3) {
                                if (tempVal.toLowerCase() === '1') {
                                    tempVal = tempVal + '00';
                                } else {
                                    for (let pk = 0; pk <= (3 - tempVal.length); pk++) {
                                        tempVal = '0' + tempVal;
                                    }
                                }
                            }
                            value = '' + tempVal;
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'nyPercentage') {
                    // NumberFormat nf = NumberFormat.getInstance();
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 2) {
                                for (let pk = 0; pk <= (2 - temp[1].length); pk++) {
                                    temp[1] += 0;
                                }
                            }
                            value = temp[0] + temp[1];
                        } else {
                            value = tempVal + '.00';
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'NYRate') {
                    // NumberFormat nf = NumberFormat.getInstance();
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 3) {
                                for (let pk = 0; pk <= (3 - temp[1].length); pk++) {
                                    temp[1] += 0;
                                }
                            }
                            value = '.' + temp[1];
                        } else {
                            value = tempVal + '.00';
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'NYRateDec2') {
                    // NumberFormat nf = NumberFormat.getInstance();
                    try {
                        let tempVal = value;
                        let temp = {};
                        if (tempVal.includes('.')) {
                            temp = tempVal.split('\\.');
                            if (temp[1].length < 2) {
                                for (let pk = 0; pk <= (2 - temp[1].length); pk++) {
                                    temp[1] += 0;
                                }
                            }
                            value = '.' + temp[1];
                        } else {
                            value = tempVal + '.00';
                        }
                    } catch (e) {
                        e.printStackTrace();
                    }
                } else if (bType.toLowerCase() === 'OHNegInd'.toLowerCase()) {
                    if (value === '0' || value === '00') {
                        value = '0';
                    }
                } else if (bType.toLowerCase() === 'date') {
                    if (value) {
                        value = value.replace(/\//g, '');
                    }
                } else if (bType.toLowerCase() === 'ssn' || bType.toLowerCase() === 'ein' || bType.toLowerCase() === 'etin' || bType.toLowerCase() === 'zip' || bType.toLowerCase() === 'phone') {
                    value = this.replaceString(value);
                }

            }
            // For check boxes
            if (currentEle && currentEle.value !== undefined && currentEle.value !== ''
                && currentEle.printvalue !== undefined && currentEle.printvalue !== '') {
                let isMatch = false;
                for (const chkValue of currentEle.value.split(',')) {
                    if (chkValue.toLowerCase() === value.toLowerCase()) {
                        value = currentEle.printvalue;
                        isMatch = true;
                        break;
                    }
                }
                if (!isMatch) {
                    value = '';
                }
            }
        } catch (e) {
            // Logger.logger.error("Error in formatDataforBarcode of PrintUtilities", e);
        }
        return value;

    }

    setBarcodeData(value) {
        if (value !== undefined) {
            value = value.replace("  ", " ");
            const docName = this.forms[this.currentFormDocIndex].docName;
            const stateName = this.forms[this.currentFormDocIndex].state.toLowerCase();
            const packageName = this.forms[this.currentFormDocIndex].packageName;
            if (value.trim().length == 1 && (value == "0" || value == 0) &&
                docName !== "dGA500" && docName !== "dGA600" && docName !== "dGA600S" && docName !== "dOHIT1140" &&
                docName !== "dOHIT4708" && docName !== "dOHIT1040" && docName !== "dOHSD100" &&
                docName !== "dOHITBIS" && docName !== "dOHIT1041") {
                value = "";
            }

            if (stateName == "nj" && !packageName.includes("1065")
                && ((value.trim().length == 1 && value == "0") || (value.trim().length == 0 && value == ""))) {
                value = "0";
            } else if (stateName == "nj" && packageName.includes("1065") && value.trim() == "NJSEQ222324") {
                value = "0";
            }

            if (stateName == "ct" && (docName == "dCT10651120SI" || docName == "dCTScheduleAB" || docName == "dCT10651120SIScheduleCE" || docName == "dCT1041SchFA"
                || docName == "dCT1041SchC" || docName == "dCT1041") &&
                ((value.trim().length == 1 && value == "0") || (value.trim().length == 0 && value == ""))) {
                value = "0";
            }

            if (value.trim() == "0SEQ6" || value.trim() == "SEQ217" || (value.trim() == "SEQ162" && this.getElementValue("dOR40.ORSurplusDonateToSchoolsInd", false)) || value.trim() == "SEQ31" || value.trim() == "SEQ28" || (value.trim() == "SEQ32" && this.getElementValue("dNYIT203.line56print", 0) != '0')) {
                value = "0";
            } else if (value.trim() == "00SEQ7") {
                value = "00";
            }

            if (value.trim().includes("NYSEQ5")) {
                value = value.trim().substring(6);
            }

            this.barcodeData = this.barcodeData + value + '\n';
        } else {
            this.barcodeData = this.barcodeData + '\n';
        }

    }

    PrepareDataFor2Dbarcode(element, pageNumber) {
        // const frm1040isActive = this.getElementValue('d1040.isActive', false);
        // const frm1040AisActive = this.getElementValue('d1040A.isActive', false);
        // const frm1040EZisActive = this.getElementValue('d1040EZ.isActive', false);
        this.barcodeData = '';
        for (const barcodeInfo of element.barcodeData) {
            let tempValue = '';
            let multipleField = '';
            let originalValue = '';

            if (barcodeInfo.elementName && barcodeInfo.elementName.indexOf('.') > -1) {
                barcodeInfo.form = barcodeInfo.elementName.split('.')[0];
                barcodeInfo.eleNameWithDoc = barcodeInfo.elementName;
            } else if (barcodeInfo.elementName) {
                barcodeInfo.eleNameWithDoc = element.docName + '.' + barcodeInfo.elementName;
            }

            let seqNo = parseInt(barcodeInfo.sequence, undefined);
            if (barcodeInfo.formInstance !== undefined && barcodeInfo.formInstance !== '') {
                const formSq = parseInt(barcodeInfo.formInstance, 0);
                let formSq_Form;
                if (barcodeInfo.elementName.includes('.')) {
                    formSq_Form = barcodeInfo.elementName.split('.')[0];
                }
                let formInstances: any = this.getChildInstFromParentInst(formSq_Form, this.currentFormDocIndex); // js docInstance?????
                if (formInstances.length === 0 && barcodeInfo.isChildStatement !== true) { // js
                    formInstances = this.getFormInstances(formSq_Form);
                }

                if (formInstances.length > formSq) {
                    tempValue = this.getElementValue(barcodeInfo.elementName, formInstances[formSq], '');
                    if (barcodeInfo.multipleField) {
                        multipleField = barcodeInfo.multipleField;
                        if (multipleField.includes(',')) {
                            for (let token of multipleField.split(',')) {
                                if (token && token.includes('.')) {
                                    token = token;
                                } else {
                                    token = this.currentFormDocIndex + '.' + token; // currentDocName ????
                                }
                                const temp = this.getElementValue(token, formInstances[formSq], '');
                                if (temp && temp.length > 0) {
                                    // barcodeInfo.elementName = token;
                                    tempValue += temp;
                                }

                                // multipleField = multipleField.replace(token, token + '=' + temp);
                            }
                        }
                    }

                }
            } else {
                if (!barcodeInfo.form && barcodeInfo.eleNameWithDoc) {
                    tempValue = this.getElementValue(barcodeInfo.eleNameWithDoc, this.currentFormDocIndex, '');
                } else if (barcodeInfo.eleNameWithDoc) {
                    tempValue = this.getElementValue(barcodeInfo.eleNameWithDoc, '');
                }

                if (this.forms[this.currentFormDocIndex] && this.forms[this.currentFormDocIndex].state === 'nj'
                    && this.forms[this.currentFormDocIndex].packageName === '1065') {
                    if (this.getElementValue("dNJCBT1065.isActive", false) && (seqNo === 22 || seqNo === 23 || seqNo === 24) && pageNumber == 1) {
                        if (tempValue === "0") {
                            tempValue = "NJSEQ222324";
                        }
                    } else if (this.getElementValue("dNJForm1065.isActive", false) && (seqNo == 22 || seqNo == 23 || seqNo == 24) && pageNumber == 1) {
                        if (tempValue === "0") {
                            tempValue = "NJSEQ222324";
                        }
                    }
                }
                if (tempValue === undefined) {
                    tempValue = this.getElementValue(barcodeInfo.eleNameWithDoc, '');
                }
            }
            if (barcodeInfo.fixed !== undefined && barcodeInfo.fixed !== '') {
                tempValue = barcodeInfo.fixed;
            }

            if (barcodeInfo.property) {
                if (barcodeInfo.property === 'ip') {
                    tempValue = this.locationDetail.ip;
                } else if (barcodeInfo.property === 'deviceid') {
                    tempValue = this.locationDetail.deviceId;
                } else if (barcodeInfo.property === 'iptimestemp') {
                    tempValue = this.locationDetail.iptimestemp;
                } else {
                    tempValue = this.savePrintConfigurationService.getSProperty(barcodeInfo.property, this.userService.getTaxYear())
                }
            }
            tempValue = this.formatDataforBarcode(barcodeInfo, tempValue, this.forms[this.currentFormDocIndex].packageName);

            this.setBarcodeData(tempValue);
        }
        this.setBarcodeData("*EOD*");
        element.barcodeValue = this.barcodeData;
    }


    createBarcodeImage(inputData): Promise<any> {
        return new Promise((resolve, reject) => {
            let image;
            let barcodeType;
            if (inputData) {
                if (!inputData.height) {
                    inputData.height = 10;
                }
                if (!inputData.width) {
                    inputData.width = 30;
                }
                if (!inputData.textxAlign) {
                    inputData.textxAlign = 'center';
                }
                if (!inputData.fontFamily) {
                    inputData.fontFamily = 'Helvetica';
                }
                if (!inputData.fontSize) {
                    inputData.fontSize = 10;
                }

                if (inputData.barcodeType || inputData.barcodeType === '25' || ((this.forms[this.currentFormDocIndex].state && this.forms[this.currentFormDocIndex].state.toLowerCase() === 'ga'))) {
                    barcodeType = 'interleaved2of5';
                } else {
                    barcodeType = 'code39';
                }

                if (inputData.objectType === '2dbarcode') {
                    barcodeType = 'pdf417';
                }

                inputData.displayText = false;
                const canvas = document.createElement('canvas');
                bwipjs(canvas, {
                    bcid: barcodeType,       // Barcode type
                    text: inputData.barcodeValue,    // Text to encode
                    scale: 3,               // 3x scaling factor
                    height: inputData.height,
                    width: inputData.width,             // Bar height, in millimeters
                    includetext: inputData.displayText,            // Show human-readable text
                    textxalign: inputData.textxAlign,
                }, (err, png) => {
                    if (err) {
                        // Decide how to handle the error
                        // `err` may be a string or Error object
                        // inputData.barcodeImage = 'asasd';
                        resolve();
                    } else {
                        image = canvas.toDataURL('image/png');
                        inputData.barcodeImage = image;
                        resolve(image);
                    }

                });
            }
        });
    }

    processElements() {
        return new Promise((resolve, reject) => {
            const barcodePromise = [];
            for (let docIndex in this.printDataInfo) {
                if (this.printDataInfo[docIndex]) {
                    this.currentFormDocIndex = docIndex;
                    for (const page of this.printDataInfo[docIndex]) {
                        if (typeof page.metaInformation === 'string') {
                            page.metaInformation = JSON.parse(page.metaInformation);
                        }
                        for (const printEle of page.metaInformation) {
                            if (printEle.objectType === '1dbarcode') {
                                barcodePromise.push(this.createBarcodeImage(printEle));
                            } else if (printEle.objectType === '2dbarcode') {
                                printEle.docName = this.forms[docIndex].docName;
                                this.PrepareDataFor2Dbarcode(printEle, printEle);
                                barcodePromise.push(this.createBarcodeImage(printEle));
                            }
                        }
                    }
                }
            }
            Promise.all(barcodePromise).then((taskDone) => {
                resolve();
            });
        });
    }


    generateBarcode(forms, locationDetail) {
        return new Promise((resolve, reject) => {
            this.taxReturn = this.savePrintConfigurationService.getTaxReturn();
            this.printDataInfo = this.savePrintConfigurationService.getSvgInfoWithDocIndex();
            this.forms = forms;
            this.locationDetail = locationDetail;
            this.processElements().then((obj) => {
                resolve();
            });
        });
    }
}
