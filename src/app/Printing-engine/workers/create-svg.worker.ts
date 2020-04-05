/// <reference lib="webworker" />
import * as moment from 'moment';
import bwipjs from 'bwip-js';

addEventListener('message', ({ data }) => {
  let overflowStmt = [];
  const PrintInfo = data.svgInfo;
  const StmtDocName = {};
  const _taxReturn = data.taxReturn;
  const docFields = data.docFields;
  let outputSvgs = [];
  let currentSvg;
  let waterMarkText = data.waterMarkText;
  let formStatus = data.form;
  const signImageMap = data.signatureData;
  let currentFormDocIndex;
  let seeStmtFirstEles = [];
  let multiDocStmt = [];
  let stmtInForms = {};
  let currentFormProperty;
  let printHandler = { fontSize: 10, fontName: 'default-font' }
  const removeByAttr = (arr, attr, value) => {
    let i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (attr.length > 2 && arr[i][attr] === value)) {

        arr.splice(i, 1);

      }
    }
    return arr;
  };

  const _getPreparerInfoForPriceList = (fieldNames) => {
    let info = '';
    const allReturnInfos = ['dReturnInfo', 'd1041RIS', 'd1065RIS', 'd1120CRIS', 'd1120SRIS', 'd990RIS'];
    for (let i = 0; i < allReturnInfos.length; i++) {
      for (let j = 0; j < fieldNames.length; j++) {
        const wholeFieldName = allReturnInfos[i] + '.' + fieldNames[j];
        const elementValue = _getElementValue(wholeFieldName, '');
        if (elementValue != undefined && elementValue != '') {
          info = elementValue;
        }
      }
    }
    return info;
  }

  // to Add Watermark
  const addWatermark = (instance) => {
    let status;
    let formWaterMarkText;
    status = formStatus[instance].extendedProperties.status;
    formWaterMarkText = waterMarkText
    let topWatermark;
    if (status !== null && status === 'Preview') {
      topWatermark = 'Preview - Do not file this form';
    } else if (status !== null && status === 'Draft') {
      topWatermark = 'Draft Form – Do not file this form';
    }
    let topMarkSvg;
    if (topWatermark) {
      topMarkSvg = '<text  x="20" y="30" font-family="CourierBold" font-size="16pt" fill="rgb(255, 142, 142)">' + topWatermark + '</text>'
    }
    // currentSvg += '<text>'
    if (formWaterMarkText === undefined || formWaterMarkText === null) {
      return;
    } else {
      return topMarkSvg + `<style> #watermark { fill:grey;fill-opacity:0.5;font-size:100px; } </style>
    <text id="watermark" text-anchor="middle" x="50" y="700" font-family="default-font" fill="rgb(0,0,0)" font-style = "normal" font-weight="bold"  transform="rotate(-45 100 100)">${formWaterMarkText}</text>`;
    }

  };
  // split function this is copied from calc-service
  const _getFieldInfo = (fieldName) => {
    let field;
    if (fieldName) {
      let s = fieldName;
      s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
      s = s.replace(/^\./, '');           // strip a leading dot
      const a = s.split('.');
      const docName = a.shift();
      const fName = a.shift();

      if (docFields && docFields[docName] && docFields[docName][fName]) {
        field = docFields[docName][fName];
      }
    }
    return field;
  };


  const getChildDoc = (childDocName, parentId) => {
    const childDoc = {};
    if (_taxReturn && _taxReturn.docs && _taxReturn.docs[childDocName]) {
      if (parentId !== undefined && parentId !== '') {
        for (const index in _taxReturn.docs[childDocName]) {
          if (_taxReturn.docs[childDocName][index]) {
            const docObj = _taxReturn.docs[childDocName][index];
            if (parseInt(docObj.parent, undefined) === parseInt(parentId, undefined)) {
              childDoc[index] = docObj;
            }
          }
        }
      } else {
        return _taxReturn.docs[childDocName];
      }
    }
    return childDoc;
  };

  const _getElementValue = (elementName, formInstance?, defaultValue?) => {
    let returnVal;
    const docName = elementName.split('.')[0];
    elementName = elementName.split('.')[1];
    if (defaultValue == undefined) {
      defaultValue = '';
    }
    if (formInstance) {
      returnVal = _taxReturn.docs[docName] ? _taxReturn.docs[docName][formInstance] ?
        _taxReturn.docs[docName][formInstance][elementName] ? _taxReturn.docs[docName][formInstance][elementName].value : defaultValue : defaultValue : defaultValue;
    } else {
      if (_taxReturn.docs[docName]) {
        formInstance = Object.keys(_taxReturn.docs[docName])[0];
        returnVal = _taxReturn.docs[docName][formInstance][elementName] ? _taxReturn.docs[docName][formInstance][elementName].value : defaultValue
      }
    }
    if (returnVal == 0 && defaultValue == '0.00') {
      returnVal = '0.00'
    }
    return returnVal
  };

  const _getElement = (elementName, formInstance?) => {
    const docName = elementName.split('.')[0];
    elementName = elementName.split('.')[1];
    if (formInstance) {
      return _taxReturn.docs[docName] ? _taxReturn.docs[docName][formInstance] ?
        _taxReturn.docs[docName][formInstance][elementName] : '' : '';
    } else {
      if (_taxReturn.docs[docName]) {
        formInstance = Object.keys(_taxReturn.docs[docName])[0];
        return _taxReturn.docs[docName][formInstance][elementName] ? _taxReturn.docs[docName][formInstance][elementName] : ''
      }
    }
    return;
  };

  // return instance of give form name
  const _getFormInstances = (formName) => {
    return _taxReturn && _taxReturn.docs && _taxReturn.docs[formName] ? Object.keys(_taxReturn.docs[formName]) : '';
  };

  // return child instance of given form name and form instance
  const _getChildInstFromParentInst = (formName, parentFormInst) => {
    const docSelected = _taxReturn && _taxReturn.docs && _taxReturn.docs[formName] ? _taxReturn.docs[formName] : '';
    const inst = []
    if (docSelected) {
      for (const childInst in docSelected) {
        if (docSelected[childInst].parent == parentFormInst) {
          inst.push(childInst);
        }
      }
    }
    return inst;
  };

  // formate value base on requrments
  const _formatValue = (element, fieldType, maskSensitiveInfo) => {
    let value = element.elementValue;
    if (fieldType && fieldType.toLowerCase() == 'money') {
      value = value.toString().replace(/,/g, '')
      const splitval = value.split('.');
      const fractional = parseInt(splitval[0]);
      let fractionalStr;
      if (!Number.isNaN(fractional)) {
        fractionalStr = fractional.toLocaleString();
      }
      if (splitval[1] !== undefined && splitval[1] !== '') {
        value = fractionalStr + '.' + splitval[1];
      } else {
        value = fractionalStr;
      }
    }
    if (fieldType && maskSensitiveInfo === true && value !== undefined) {
      switch (fieldType.toUpperCase()) {
        case 'ETIN':
        case 'EFIN':
        case 'ROUNTINGNO': {
          if (/^[0-9]*$/.test(value) == false) {
            break;
          }
        }
        case 'ACCOUNTNO': {
          if (/^[0-9]*$/.test(value) == false) {
            break;
          }
        }
        case 'PID': {
          value = value.replace(/./g, "X");
          break;
        }
        case 'EIN': {
          if (/^[0-9]{2}\-[0-9]{7}$/.test(value) == true) {
            value = value.substring(0, value.length - 4).replace(/[0-9]/g, "X") + value.substring(value.length - 4)
          }
          break;
        }
        case 'SSN': {
          if (/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/.test(value) == true) {
            value = value.substring(0, value.length - 4).replace(/[0-9]/g, "X") + value.substring(value.length - 4)
          }
          break;
        }
        case 'PTIN': {
          value = value.replace(/[0-9]/g, "X");
          break;
        }
      }
    }
    return value;
  };


  // format value for Ny state
  const _formatValueForNYState = (value) => {
    try {
      if (!isNaN(value)) {
        const decimalValue = value.split('.');
        return decimalValue[0]
      }
    } catch (e) {
      return value
    }
    return value
  };

  // call contentService for get type
  const _getFieldType = (element) => {
    if (element) {
      let field;
      if (element.elementName.includes('.')) {
        field = _getFieldInfo(element.elementName);
      } else {
        field = _getFieldInfo(element.docName + '.' + element.elementName);
      }
      if (field) {
        return field.type;
      }
    }
  };

  const setIndentations = (element) => {
    let finalSVGFromSvgAndMetaData = '';
    const borderWidth = element.borderWidth;
    const height = element.height;
    const width = element.width;
    const x = Number(element.x);
    const y = Number(element.y);

    if (borderWidth != undefined) {
      if (borderWidth == 1) {
        finalSVGFromSvgAndMetaData += '<rect width="' + (width - 1) + '" height="' + (height - 1) + '" x="' + x + '" y="' + y + '" style="stroke-width:1.4; stroke:black;fill:white;" />';
      } else {
        const x2 = x + parseInt(width);
        finalSVGFromSvgAndMetaData += '<line x1="' + x + '" y1="' + (y + 18) + '" x2="' + x2 + '" y2="' + (y + 18) + '" style="stroke-width:1.4; stroke:black;" />';
      }
    }
    return finalSVGFromSvgAndMetaData;
  }

  // add text in svg
  const _setValueOfInput = (element) => {
    const fontInfo = { fontName: printHandler.fontName, fontSize: printHandler.fontSize }
    if (element.fontName) {
      fontInfo.fontName = element.fontName
    }
    if (element.fontSize) {
      fontInfo.fontSize = element.fontSize
    }
    if (element.combOf !== undefined && element.combOf !== '' && element.elementValue) {
      element.combOf = parseInt(element.combOf, undefined);
      const count = element.combOf;
      const numberSpace = (parseInt(element.width, undefined)) / count;
      let xValue = parseFloat(element.x) - 4;
      for (let i1 = 0; i1 < element.combOf; i1++) {
        if (element.elementValue[i1] !== undefined && element.elementValue[i1] !== '') {
          currentSvg = currentSvg + `<text x="${parseFloat(xValue.toString()) + (numberSpace / 2)}" y="${parseFloat(element.y + (parseFloat(element.height) / 2) + 5)}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${element.elementValue[i1].toUpperCase()}</text>`;
        }
        xValue = xValue + (numberSpace);
      }
    } else if (element.elementValue !== undefined && element.elementValue !== '') {
      element.fieldType = _getFieldType(element);
      let value = _formatValue(element, element.fieldType, data.maskSensitiveInfo);
      let alignment;
      if (element.alignment) {
        if (element.alignment === 'right') {
          element.x = parseFloat(element.x) + parseFloat(element.width) - 2;
          alignment = 'end';
        } else if (element.alignment === 'center') {
          element.x = element.x + (parseFloat(element.width) / 2);
          alignment = 'middle';
        } else if (element.alignment === 'left') {
          element.x = parseFloat(element.x) + 2;
          alignment = 'start';
        }
        currentSvg = currentSvg + `<text x="${parseFloat(element.x)}" text-anchor="${alignment}"  y="${parseFloat(element.y + (parseFloat(element.height) / 2) + 5)}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${value}</text>`;
      } else {
        currentSvg = currentSvg + `<text x="${parseFloat(element.x) + 10}" y="${parseFloat(element.y) + (parseFloat(element.height) / 2) + 5}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${value}</text>`;
      }
    }
  };

  const addSignature = (element) => {
    const signatureFor = element.signatureFor;
    const signatureType = element.signatureType;
    let signature;
    if (signatureFor !== undefined && signatureFor !== '') {
      switch (signatureFor) {
        case 'ero': {
          signature = signImageMap['1'] ? signImageMap['1'] : null;
          break;
        }
        case 'preparer': {
          signature = signImageMap['2'] ? signImageMap['2'] : null;
          break;
        }
        case 'taxpayer': {
          signature = signImageMap['3'] ? signImageMap['3'] : null;
          break;
        }
        case 'spouse': {
          signature = signImageMap['4'] ? signImageMap['4'] : null;
          break;
        }
        case 'tporsp': {
          if (element.tporspElement !== undefined && element.tporspElement !== '') {
            const tporspElement = element.tporspElement;
            let tporsp = '';
            if (tporspElement.indexOf('.') > -1) {
              tporsp = _getElementValue(tporspElement, '').toLowerCase();
            } else {
              tporsp = _getElementValue(element.docName + '.' + tporspElement, element.instance, '').toLowerCase();
            }
            if (tporsp === 'taxpayer') {
              signature = signImageMap['3'] ? signImageMap['3'] : null;
            } else if (tporsp === 'spouse') {
              signature = signImageMap['4'] ? signImageMap['4'] : null;
            }
          }
          break;
        }

      }
      if (signature) {
        let imageHeight = element.height;
        // current max width of sign is 113
        const imageWidth = 113
        if (imageHeight > 25) {

          imageHeight = 25
        }
        currentSvg += `<image xlink:href='${signature.image}' x='${element.x - 15}' y='${element.y}' height="${imageHeight}" width="${imageWidth}"/>`
      }
    }

  };

  const _setBarcodeData = (element) => {
    if (element && element.barcodeImage) {
      let textX;
      let textY;
      let transform = `rotate(0 100 100)`;
      if (element.width) {
        textX = (parseFloat(element.width) / 2) + 20;
      }
      if (element.aboveBarcodeText) {
        textY = parseFloat(element.y) - 5;
      }
      if (element.isSetChecksumText) {
        textY = parseFloat(element.y) + parseFloat(element.height) + 8;
      }
      if (element.rotation && element.rotation > 0) {
        if (element.rotation === 90 || element.rotation === 270) {
          if (element.rotation === 90) {
            transform = `rotate(90 100 100)`;
          } else {
            transform = `rotate(270 100 100)`;
          }
        } else {
          transform = `rotate(${element.rotation} 100 100)`;
        }
      }
      if (element.aboveBarcodeText || element.isSetChecksumText) {
        currentSvg += `<text x="${textX ? textX : element.x}" y="${textY ? textY : (element.y - 2)}" font-family="${element.fontName}" transform = '${transform}'  fill="rgb(0,0,0)" font-style = "normal" font-size="${element.fontSize}">${element.barcodeValue}</text>`;
      }
      currentSvg += `<image xlink:href='${element.barcodeImage}' x='${element.x}' y='${element.y}' height="${element.height}" transform = '${transform}' width="${element.width}"/>`;
    }
  };

  const _setDefaultValue = (element) => {
    const fontInfo = { fontName: printHandler.fontName, fontSize: printHandler.fontSize }
    if (element.fontName) {
      fontInfo.fontName = element.fontName
    }
    if (element.fontSize) {
      fontInfo.fontSize = element.fontSize
    }

    if (element.combOf !== undefined && element.combOf !== '' && element.defaultValue) {
      element.defaultValue = element.defaultValue.toString();
      element.combOf = parseInt(element.combOf, undefined);
      const count = element.combOf;
      const numberSpace = (parseInt(element.width, undefined)) / count;
      let xValue = parseFloat(element.x) - 4;
      for (let i1 = 0; i1 < element.combOf; i1++) {
        if (element.defaultValue[i1] !== undefined && element.defaultValue[i1] !== '') {
          currentSvg = currentSvg + `<text x="${parseFloat(xValue.toString()) + (numberSpace / 2)}" y="${parseFloat(element.y + 35)}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${element.defaultValue[i1].toUpperCase()}</text>`;
        }
        xValue = xValue + (numberSpace);
      }
    } else {
      currentSvg += `<text x="${element.x}" y="${element.y + 35}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${element.defaultValue}</text>`;
    }

  }

  // value change as per display requiredments
  const _setData = (value, element, stateName) => {
    if (element.objectType == 'checkbox') {
      _setCheckBox(value, element);
    } else if (element.objectType === 'date') {
      _setDate(element);
    } else if (element.objectType === 'otherField') {
      if (element.otherFieldType === 'submissionId') {
        _setSubmissionId(element, stateName);
      }
    } else if (element.objectType === 'signature') {
      addSignature(element);
    } else if (element.objectType === '1dbarcode' || element.objectType === '2dbarcode') {
      _setBarcodeData(element);
    } else if (!element.elementName && element.defaultValue) {
      _setDefaultValue(element);
    } else {
      _setTextboxValue(value, element, stateName);
    }
  }

  // set Date value
  const _setDate = (element) => {
    const defaultDateFormat = !element.dateFormat ? 'MM/DD/YYYY' : element.dateFormat;
    let defaultDate;
    if (element.currentDate !== null && element.currentDate !== '') {
      defaultDate = moment(element.currentDate);
    } else {
      defaultDate = moment();
    }
    if (element.dateDifference !== undefined && element.dateDifference !== '') {
      let days = parseInt(element.dateDifference, undefined);
      defaultDate.add(days, 'days');
    }
    const dateFormatVal = defaultDate.format(defaultDateFormat.toUpperCase());
    currentSvg = currentSvg + `<text x="${parseFloat(element.x)}" y="${parseFloat(element.y)}" font-family="default-font" font-size="10pt">${dateFormatVal}</text>`;
  }

  const _setSubmissionId = (element, stateName) => {
    if (element.otherFieldType === 'submissionId') {
      if (stateName) {
        const fontInfo = { fontName: printHandler.fontName, fontSize: printHandler.fontSize }
        if (element.fontName) {
          fontInfo.fontName = element.fontName
        }
        if (element.fontSize) {
          fontInfo.fontSize = element.fontSize
        }

        const submissionIdStateName = (stateName && stateName !== '') ? stateName.toLowerCase() : 'federal';
        let submissionId = '';
        if (data.submissionIds) {
          // const submissionIdsStateName = Object.keys(data.submissionIds);
          if(data.submissionIds[submissionIdStateName]) {
            submissionId = data.submissionIds[submissionIdStateName].MainForm;
          }
          if (element.combOf !== undefined && element.combOf !== '') {
            element.submissionId = submissionId.toString();
            element.combOf = parseInt(element.combOf, undefined);
            const count = element.combOf;
            const numberSpace = (parseInt(element.width, undefined)) / count;
            let xValue = parseFloat(element.x) - 4;
            for (let i1 = 0; i1 < element.combOf; i1++) {
              if (element.submissionId[i1] !== undefined && element.submissionId[i1] !== '') {
                currentSvg = currentSvg + `<text x="${parseFloat(xValue.toString()) + (numberSpace / 2)}" y="${parseFloat(element.y + (parseFloat(element.height) / 2))}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${element.submissionId[i1]}</text>`;
              }
              xValue = xValue + (numberSpace);
            }
          } else {
            currentSvg += `<text x="${element.x}" y="${element.y + (parseFloat(element.height) / 2)}" font-family="${fontInfo.fontName}" font-size="${fontInfo.fontSize}pt">${submissionId}</text>`;
          }
          // if (submissionId && submissionId !== '') {
          //   currentSvg = currentSvg + `<text x="${parseFloat(element.x)}" y="${parseFloat(element.y) + 20}" font-family="default-font" fill="rgb(0,0,0)" font-style = "normal" font-size="8pt">${submissionId}</text>`;
          // }
        }
      }
    }

  };

  // set checkbox value
  const _setCheckBox = (value, element) => {
    if (value !== undefined && value !== null && value !== '' && element.value !== undefined && element.value !== '') {
      const value_array = element.value.split(',');
      for (let i = 0; i < value_array.length; i++) {
        if (value.toString().toLowerCase() == value_array[i].toString().toLowerCase()) {
          element.isMatch = true;
        }
      }
    } else if (value !== undefined && value !== undefined && value !== '' && element.onValueCB !== undefined && element.onValueCB !== '') {
      if (value.toString().toLowerCase() == element.onValueCB.toString().toLowerCase()) {
        element.isMatch = true;
      } else if (value !== undefined && element.printvalue !== undefined && element.printvalue !== ''
        && (value === 'X' || value === true || value === false || value === 'true' || value === 'false')) {
        element.isMatch = true;
      }
    }
    _setCheckBoxTosvg(element);
  }

  // add checkbox value in svg
  const _setCheckBoxTosvg = (element) => {
    if (element.isMatch === true) {
      currentSvg = currentSvg + `<text x="${parseFloat(element.x) + 3}" y="${parseFloat(element.y) + (element.height / 2 + 3)}" font-family="ZapfDingbats"  fill="rgb(0,0,0)" font-style = "normal" font-size="8pt">8</text>`;
    }

  }


  // value change as per display requiredments
  const _setTextboxValue = (value, element, stateName) => {
    if (element.multipleField && element.multipleField.includes(',')) {
      const fieldsArray = element.multipleField.split(',');
      for (let i = 0; i < fieldsArray.length; i++) {
        let eleToken = fieldsArray[i];
        let temp = ''
        if (eleToken.includes('=') && !eleToken.endsWith('=')) {
          temp = eleToken.subscribe(eleToken.indexOf('=') + 1);
        } else if (eleToken.includes('=') && eleToken.endsWith('=')) {
          temp = ''
        } else {
          if (eleToken.includes('.')) {
            temp = _getElementValue(eleToken);
          } else {
            eleToken = element.docName + '.' + eleToken;
            temp = _getElementValue(eleToken, element.formsinstant);
          }
        }

        if (temp !== undefined && temp.toString().trim() != '' && temp.toString().trim() != '0' && temp.toString().trim() != '0.0') {
          temp = temp.toString();
          if (stateName && stateName.toLowerCase() == 'ny') {
            temp = _formatValueForNYState(temp);
          }
          if (element.charToRemove !== undefined && element.charToRemove.trim() !== '') {
            let removeArray = element.charToRemove.split('|');
            for (let i0 = 0; i0 < removeArray.length; i0++) {
              temp = temp.replace(removeArray[i0], '');
            }
          }

          if (element.charToReplace !== undefined && element.charToReplace.trim() !== '') {
            let charToReplace = element.charToReplace.split('#');
            for (let i1 = 0; i1 < charToReplace.length; i1++) {
              let replaceArray = charToReplace[i1].split('|');
              temp = temp.replace(replaceArray[0], replaceArray[1]);
            }
          }
          element.elementValue = temp;
          break;
        }

      }

    } else if (element.concat && element.concat.includes(',')) {
      let concatWith = ', '
      let concat = element.concat;
      let temp = '';
      if (element.concatWith && element.concatWith.includes('#')) {
        concatWith = element.concatWith.substr(0, element.concatWith.indexOf('#'))
      }
      if (concat.includes('|')) {
        if (concat.substr(concat.indexOf('|')).includes('false')) {
          concatWith = ' '
        }
        concat = concat.substr(0, concat.indexOf('|'));
      }
      let elementsArray = concat.split(',');
      for (let i = 0; i < elementsArray.length; i++) {
        let token = elementsArray[i]
        if (temp !== undefined && temp !== '') {
          if (token.includes('.')) {
            const tvalue = _getElementValue(token);
            (tvalue !== undefined && tvalue !== '') ? temp += ' ' + concatWith + ' ' + tvalue : '';

          } else {
            token = element.docName + '.' + token;
            const tvalue = _getElementValue(token, element.formsinstant);
            (tvalue !== undefined && tvalue !== '') ? temp += ' ' + concatWith + ' ' + tvalue : '';
          }
        } else {
          if (token.includes('.')) {
            temp = _getElementValue(token);
          } else {
            token = element.docName + '.' + token;
            temp = _getElementValue(token, element.formsinstant);
          }
        }
      }
      while (temp && temp.indexOf(',,') > -1) {
        temp = temp.replace(',,', ',')
      }
      if (temp && temp.endsWith(',')) {
        temp = temp.substr(0, temp.length - 1)
      }
      if (temp && temp.endsWith(', ')) {
        temp = temp.substr(0, temp.length - 2)
      }
      if (stateName && stateName.toLowerCase() == 'ny') {
        temp = _formatValueForNYState(temp);
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
        myDecimal = myDecimal.replace('|false', '').trim()
        removeDot = true;
      } else {
        myDecimal = myDecimal.replace('|true', '').trim()
      }
      let dblVal = 0.0;
      let pre = 0;
      if (value.toString().includes(',')) {
        value = value.replace(/,/g, '');
      }
      dblVal = parseFloat(value);
      pre = parseInt(myDecimal);
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
          let finalValue = ''
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
        element.elementValue = value.substring(parseInt(element.charFrom) - 1, parseInt(element.charTo));
      } else if (typeof value == 'string') {
        element.elementValue = value.substring(parseInt(element.charFrom) - 1);
      }
    } else if (element.charToRemove !== undefined && element.charToRemove !== '' && value != undefined) {
      if (element.charFrom == undefined || element.charFrom == '') {
        let repalcedValue = ''
        for (let i20 = 0; i20 < value.length; i20++) {
          if (value[i20] != element.charToRemove) {
            repalcedValue = repalcedValue + value[i20];
          }
        }
        element.elementValue = repalcedValue
      }
    } else if (element.objectType == 'input' && element.printvalue != undefined && element.printvalue != '' && value != undefined && element.value != undefined) {
      if (element.value.toString() == value.toString()) {
        element.elementValue = element.printvalue;
      }
    } else {
      element.elementValue = (value !== undefined && value !== '') ? value : '';
    }
    if (element.whenToPrint || element.If) {
      const tempvalue = element.elementValue;
      element.elementValue = undefined;
      const ifCondition = element.whenToPrint ? element.whenToPrint.split('=') : element.If.split('=');
      const ifVal = _getElementValue(element.docName + '.' + ifCondition[0], element.formsinstant, '');
      if (ifVal !== undefined && ifCondition[1] !== undefined && ifVal.toString() === ifCondition[1].toString()) {
        element.elementValue = (tempvalue !== undefined && tempvalue !== '') ? tempvalue : '';
      }
    }
    _setValueOfInput(element);
  }

  const getStyleContent = (svgInfo) => {
    const styleWithDefs = svgInfo.split('<defs>')[1];
    if (styleWithDefs) {
      const stlyeInfo = styleWithDefs.split('</defs>')[0];
      if (stlyeInfo) {
        return stlyeInfo.replace('<style type="text/css">', '').replace('<style>', '').replace('</style>', '');

      }
    }
  };

  const checkForStmt = (element, eleValue) => {
    const stmtDocs = _getChildInstFromParentInst(element.docName, currentFormDocIndex);
    if (StmtDocName[element.docName] && stmtDocs &&
      parseInt(StmtDocName[element.docName].stmtMaxCount, undefined) < stmtDocs.length) {
      const seeStmtEle = seeStmtFirstEles.find(firstEle => firstEle.name === element.name);
      if (seeStmtEle && StmtDocName[seeStmtEle.stmtName]) {
        if (parseInt(StmtDocName[seeStmtEle.stmtName].stmtMaxCount, undefined) < stmtDocs.length) {
          return 'SEE ' + StmtDocName[seeStmtEle.stmtName].stmtTitle;
        }
      }
      return;
    } else {
      delete stmtInForms[currentFormDocIndex][element.docName];
      return eleValue;
    }

  }

  const setFontsInfo = (printObj) => {
    const fontData = {};
    let styleContent = getStyleContent(printObj.svg);
    if (styleContent) {
      styleContent = styleContent.trim();
      if (styleContent.indexOf('@font-face') != -1) {
        const fontFacelist = styleContent.split('@font-face');
        for (let i = 1; i < fontFacelist.length; i++) {
          let svgFontName = fontFacelist[i].substring(fontFacelist[i].indexOf("\"") + 1, fontFacelist[i].lastIndexOf("\""));
          let svgFontBase64 = fontFacelist[i].substring(fontFacelist[i].indexOf("(") + 1, fontFacelist[i].lastIndexOf(")")).replace('data:font/opentype;base64,', '');
          fontData[svgFontName] = svgFontBase64;
        }
      }
    }
    return fontData;
  };

  const setFormInstance = (element, printObj) => {
    if (element.docName == undefined || element.docName == '') {
      if (element.elementName.indexOf('.') > -1) {
        const docEle = element.elementName.split('.');
        element.docName = docEle[0];
        element.elementName = docEle[1];
        if (_taxReturn.docs[element.docName]) {
          element.formsinstant = Object.keys(_taxReturn.docs[element.docName])[0];
        }
      } else {
        element.docName = printObj.docName;
        element.formsinstant = printObj.instance;
      }
    } else if (element.docName === printObj.docName) {
      element.formsinstant = printObj.instance;
    } else if (_taxReturn.docs[element.docName]) {
      const docFromParents = getChildDoc(element.docName, currentFormDocIndex);
      if (docFromParents !== undefined) {
        if (Object.keys(docFromParents).length > 0) {
          const temp = element.docName + '.' + element.elementName + '_' + currentFormDocIndex;
          if (multiDocStmt[temp] !== undefined) {
            multiDocStmt[temp] += 1;
          } else {
            multiDocStmt[temp] = 0;
          }
          element.formsinstant = Object.keys(docFromParents)[multiDocStmt[temp]];
        }
      }
    }
  }

  // add  value in meta information object
  const _setElementsValue = (printObj) => {
    const state = printObj.state;
    const seeStmt = [];
    const fontData = setFontsInfo(printObj);
    printObj.svg = printObj.svg.replace(/clip-path/g, 'clip-path1')
    currentSvg = printObj.svg.split('</svg>')[0];

    currentSvg += addWatermark(printObj.instance);
    currentFormDocIndex = printObj.instance;
    printObj.metaInformation.forEach((element) => {
      currentSvg += setIndentations(element);
      if (data.printSelectedForms !== 'printBlankForm') {
        if (element.elementName !== undefined && element.elementName !== '') {
          setFormInstance(element, printObj);
          let eleValue = _getElementValue(element.docName + '.' + element.elementName, element.formsinstant, undefined);
          if (_taxReturn.docs[element.docName] && _taxReturn.docs[element.docName][element.formsinstant] !== undefined) {
            if (StmtDocName[element.docName] !== undefined && StmtDocName[element.docName] !== '') {
              eleValue = checkForStmt(element, eleValue);
            }
            if (eleValue != undefined && eleValue !== '') {
              try {
                _setData(eleValue, element, state);
              } catch (e) {
                console.log(e)
              }
            }
          }
        } else {
          _setData('', element, state);
        }
      }
    });


    outputSvgs.push({
      svg: currentSvg + '</svg>', fontsData: fontData,
      height: printObj.height, width: printObj.width
    });
  };

  const setStmtDoc = () => {
    //  overflowStmt = [];
    for (const instance in PrintInfo) {
      if (PrintInfo[instance]) {
        stmtInForms[instance] = {};
        for (let i = 0; i < PrintInfo[instance].length; i++) {
          if (PrintInfo[instance][i] && PrintInfo[instance][i].docName !== 'dDeprwkt' && PrintInfo[instance][i].docName !== 'dVehicleDeprWkt') {
            if (typeof PrintInfo[instance][i].metaInformation === 'string') {
              PrintInfo[instance][i].metaInformation = JSON.parse(PrintInfo[instance][i].metaInformation);
            }
            PrintInfo[instance][i].metaInformation.sort((o1, o2) => { return o1.y - o2.y })
            for (const metaInfo of PrintInfo[instance][i].metaInformation) {
              if (metaInfo.objectType === 'statement') {
                StmtDocName[metaInfo.stmtName] = metaInfo;
                stmtInForms[instance][metaInfo.stmtName] = metaInfo;
                seeStmtFirstEles.push({ name: metaInfo.stmtPrintTitleAt, stmtName: metaInfo.stmtName });
              }
            }
          }
        }
      }
    }
  };


  const _priceList = () => {
    let currentSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="909" height="1286" viewBox="0 0 909 1286" version="1.1" style="display: block;margin-left: auto;margin-right: auto;">
    <defs>
    <clipPath id="c_1"><path d="M0,0H909V1286H0Z"/></clipPath>
    <style type="text/css"><![CDATA[
    text { white-space: pre; }
    path, image { pointer-events: none; }
    .s1{
    font-size: 20.80px;
    fill: #000033;
    }
    .s2{
    font-size: 14.86px;
    fill: #000033;
    }
    .s3{
    font-size: 10pt;
    fill: #808080;
    }
    .s4{
    font-size: 29.72px;
    fill: #000000;
    }
    .s5{
    font-size: 14.86px;
    fill: #000000;
    }
    .g0{
    fill: #C0C0C0;
    stroke: #C0C0C0;
    stroke-width: 1.486;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    }
    .g1{
    fill: none;
    stroke: #000000;
    stroke-width: 1.486;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    }
    ]]></style>
    </defs>
    <g clip-path="url(#c_1)">
    <path d="M0,0 L0,1286 L909,1286 L909,0 Z " fill="#FFFFFF" stroke="none"/>
    <path d="M46.1,475.2H863.4v34.2H46.1V475.2Z" class="g0"/>
    </g>

    <text x="46" y="287" class="s4" font-family="default-font">Invoice</text>
    <text x="46" y="344" class="s3" font-family="default-font">BILL TO</text>
    <text x="364" y="344" class="s3" font-family="default-font">INVOICE #</text>
    <text x="564" y="344" class="s3" font-family="default-font">DATE</text>
    <text x="780" y="344" class="s3" font-family="default-font">DUE DATE</text>
    <text x="54" y="500" class="s5" font-family="default-font">DESCRIPTION</text>
    <text x="782" y="500" class="s5" font-family="default-font">AMOUNT</text>
    </svg>`;

    const prepareFName = _getPreparerInfoForPriceList(['strprnm', 'PrepareName']);
    const strprfrmnm = _getPreparerInfoForPriceList(['strprfrmnm', 'PrepareFirmName']);
    const prepareAdd = _getPreparerInfoForPriceList(['strpradd', 'PrepareAdd']);
    const prepareCSZ = _getPreparerInfoForPriceList(['strprcity', 'Preparecity']) + ',' + _getPreparerInfoForPriceList(['strprst', 'Preparestate']) + ' '
      + _getPreparerInfoForPriceList(['strprzip', 'Preparezip']);
    const preparePh = _getPreparerInfoForPriceList(['strprtele', 'PreparePhone']);
    const prepareEmail = _getPreparerInfoForPriceList(['strpreml', 'PrepareEmail']);

    // const prepareFName = _getPreparerInfoForPriceList('dPriceList.contactperson');
    // const strprfrmnm = _getPreparerInfoForPriceList('dPriceList.firmname');
    // const prepareAdd = _getPreparerInfoForPriceList('dPriceList.prepareAdd');

    // const prepareCSZ = _getPreparerInfoForPriceList('dPriceList.Preparecity') + ',' + _getPreparerInfoForPriceList('dPriceList.Preparestate') + ' '
    //   + _getPreparerInfoForPriceList('dPriceList.Preparezip');

    //   const preparePh = _getPreparerInfoForPriceList('dPriceList.preparePh');
    // const prepareEmail = _getPreparerInfoForPriceList('dPriceList.prepareEmail');

    const PreparerName = _getElementValue('dPriceList.PreparerName');
    const firmStreet1 = _getElementValue('dPriceList.firmStreet');
    const firmCSZ = _getElementValue('dPriceList.firmCity') + ',' + _getElementValue('dPriceList.firmState') + ' ' + _getElementValue('dPriceList.firmZip');
    const invoiceNumber = _getElementValue('dPriceList.InvoiceNumber');
    const date = _getElementValue('dPriceList.Date');
    const firmStreet = _getElementValue('dPriceList.firmCity') + ',' + _getElementValue('dPriceList.firmState') + ' ' + _getElementValue('dPriceList.firmZip');
    const duedate = _getElementValue('dPriceList.Duedate');
    const priceDate = _getElementValue('dPriceList.Date');
    let summerizePriceListData = _getElement('dPriceList.summerizePriceListData');
    const TotalPercentChargeAmt1 = _getElementValue('dPriceList.TotalPercentChargeAmt1', undefined, '0.00');
    const TotalCharges = _getElementValue('dPriceList.TotalCharges', undefined, '0.00');
    const TotalPercentChargeAmttax = _getElementValue('dPriceList.TotalPercentChargeAmttax', undefined, '0.00');
    const TotalPayment = _getElementValue('dPriceList.TotalPayment', undefined, '0.00');
    const ServicesCharges = _getElementValue('dPriceList.ServicesCharges', undefined, '0.00');
    const TotalOtherCharge = _getElementValue('dPriceList.TotalOtherCharge', undefined, '0.00');
    let totalwithDiscount = 0;
    let convertedTotalwithDiscount = '';

    if (summerizePriceListData == undefined || summerizePriceListData == '') {
      summerizePriceListData = []
    }

    let finalSVG = currentSvg.replace('</svg>', '');

    let cordinatesWithValue = [{ "x": 46, "y": 128, "fieldName": prepareFName, fontSize: 14, fontColor: '#000033' }, { "x": 46, "y": 158, "fieldName": strprfrmnm, fontColor: '#000033' }, { "x": 46, "y": 173, "fieldName": prepareAdd, fontColor: '#808080' }, { "x": 46, "y": 191, "fieldName": prepareCSZ, fontColor: '#808080' }
      , { "x": 307, "y": 173, "fieldName": preparePh, fontColor: '#808080' }, { "x": 307, "y": 191, "fieldName": prepareEmail, fontColor: '#808080' }, { "x": 46, "y": 378, "fieldName": PreparerName }, { "x": 46, "y": 396, "fieldName": firmStreet1 },
    { "x": 46, "y": 410, "fieldName": firmCSZ }, { "x": 364, "y": 378, "fieldName": invoiceNumber }, { "x": 564, "y": 378, "fieldName": date }, { "x": 780, "y": 378, "fieldName": duedate }];

    summerizePriceListData.push({ 'description': 'Service Charges', 'total': ServicesCharges });
    summerizePriceListData.push({ 'description': 'Other Charges', 'total': TotalOtherCharge });
    summerizePriceListData.push({ 'description': 'Discount', 'total': TotalPercentChargeAmt1 });
    const summerizePriceListDataValue = [];
    for (let i1 = 0; i1 < summerizePriceListData.length; i1++) {
      if (summerizePriceListData[i1] !== undefined) {
        summerizePriceListDataValue.push({ 'description': summerizePriceListData[i1].description, 'total': summerizePriceListData[i1].total });
        if (summerizePriceListData[i1].description != 'Discount') {
          totalwithDiscount += parseFloat(summerizePriceListData[i1].total);
        } else {
          totalwithDiscount = totalwithDiscount - parseFloat(summerizePriceListData[i1].total);
        }
      }
    }

    const newXAxis = 50;
    let newYAxis = 0;
    for (let i = 0; i < summerizePriceListDataValue.length; i++) {
      newYAxis = i == 0 ? 552 : (cordinatesWithValue[cordinatesWithValue.length - 1].y + 52);
      cordinatesWithValue.push({ "x": newXAxis, "y": newYAxis, "fieldName": summerizePriceListDataValue[i].description });
    }

    for (const cordinate of cordinatesWithValue) {
      if (cordinate.fontColor === undefined || cordinate.fontColor === '') {
        cordinate.fontColor = '#000000'
      }
      if (!cordinate.fontSize) {
        cordinate.fontSize = 10;
      }
      finalSVG += `<text x="${cordinate.x}" y="${cordinate.y}" fill="${cordinate.fontColor}" font-family="default-font" font-size='${cordinate.fontSize}pt'>${cordinate.fieldName}</text>`;
    }
    convertedTotalwithDiscount = totalwithDiscount.toString().indexOf('.') == -1 ? totalwithDiscount.toString() + '.00' : totalwithDiscount.toString();

    let fieldName = "";
    let xAxis = 0;
    let yAxis = 0;

    const newXaxis = 830;
    let newYaxis = 0;

    for (let i = 0; i < summerizePriceListDataValue.length; i++) {
      if (i == 0) newYaxis = 552;
      else newYaxis = (newYaxis + 52);
      finalSVG += '<text x="' + newXaxis + '" y="' + newYaxis + '" text-anchor="end" font-family="default-font">' + '$  ' + summerizePriceListDataValue[i].total + '</text>';

      if (i == summerizePriceListDataValue.length - 1) {
        /* TOTALING DETAIL LINE */
        finalSVG += '<line x1="' + 600 + '" y1="' + (newYaxis + 52) + '" x2="' + 865 + '" y2="' + (newYaxis + 52) + '" style="stroke-width:1.4; stroke:black;" />';

        /* TOTALING DETAIL TITLES */
        finalSVG += '<text x="600" y="' + (newYaxis + 78) + '" class="s3" font-family="default-font" >SUB TOTAL</text>';
        finalSVG += '<text x="600" y="' + (newYaxis + 104) + '" class="s3" font-family="default-font">TAX</text>';
        finalSVG += ' <text x="600" y="' + (newYaxis + 130) + '" class="s3" font-family="default-font">TOTAL PAYMENT</text>';

        finalSVG += '<text x="600" y="' + (newYaxis + 156) + '" class="s3" font-family="default-font">TOTAL CHARGES</text>';
        finalSVG += '<text x="600" y="' + (newYaxis + 171) + '" class="s3" font-family="default-font">BY TIME</text>';

        finalSVG += '<text x="600" y="' + (newYaxis + 197) + '" class="s3" font-family="default-font">TOTAL STATE</text>';
        finalSVG += '<text x="600" y="' + (newYaxis + 212) + '" class="s3" font-family="default-font">CHARGES</text>';

        finalSVG += '<text x="600" y="' + (newYaxis + 238) + '" class="s3" font-family="default-font">BALANCE</text>';
        finalSVG += '<text x="600" y="' + (newYaxis + 253) + '" class="s3" font-family="default-font">DUE</text>';

        /* TOTALING DETAIL VALUES */
        finalSVG += '<text x="' + newXaxis + '" y="' + (newYaxis + 78) + '" text-anchor="end" class="s3" font-family="default-font">' + '$  ' + convertedTotalwithDiscount + '</text>';
        finalSVG += '<text x="' + newXaxis + '" y="' + (newYaxis + 104) + '" text-anchor="end" class="s3" font-family="default-font">' + '$  ' + TotalPercentChargeAmttax + '</text>';
        finalSVG += '<text x="' + newXaxis + '" y="' + (newYaxis + 130) + '" text-anchor="end" class="s3" font-family="default-font">' + '$  ' + TotalPayment + '</text>';
        finalSVG += '<text x="' + newXaxis + '" y="' + (newYaxis + 156) + '" text-anchor="end" class="s3" font-family="default-font">' + '$  ' + ServicesCharges + '</text>';
        finalSVG += '<text x="' + newXaxis + '" y="' + (newYaxis + 197) + '" text-anchor="end" class="s3" font-family="default-font">' + '$  ' + TotalOtherCharge + '</text>';
        finalSVG += '<text x="' + newXaxis + '" y="' + (newYaxis + 253) + '" text-anchor="end" class="s3" font-family="default-font">' + '$  ' + TotalCharges + '</text>';

        /* LEFT SIDE THANKING PARAGRAPH */
        finalSVG += '<text font-family="default-font" x="50" y="' + (newYaxis + 100) + '" class="s3">Thank you for allowing us to serve your tax filing needs</text>';
        finalSVG += '<text font-family="default-font" x="50" y="' + (newYaxis + 120) + '" class="s3">this year. The services performed for this tax return</text>';
        finalSVG += '<text font-family="default-font" x="50" y="' + (newYaxis + 140) + '" class="s3">and their respective fees are indicated above.</text>';
      }
    }
    outputSvgs.push({ svg: finalSVG, fontsData: [], height: 1188, width: 918 });
  }

  /**  Set Page break for pdf */
  const _setPageBreak = function (ylocation, svgtag, PrintInfo) {
    let newPage;
    if (ylocation > 918) {
      newPage = {};
      outputSvgs.push({ svg: svgtag + '</svg>', fontsData: '', width: 1188, height: 918 });
      newPage.svgtag = resetSvg(PrintInfo);
      newPage.cordinates = {
        x: 30,
        y: 120,
        x1: 200,
        y1: 160
      };
    }
    return newPage;
  };

  const setPDFStyle = () => {
    if (currentFormProperty.pdfFontName) {
      printHandler.fontName = currentFormProperty.pdfFontName;
    }
    if (currentFormProperty.pdfFontSize) {
      printHandler.fontSize = currentFormProperty.pdfFontSize;
    }
  }

  const groupPDF = (printinfo, index) => {
    if (data.removedDocIndex && data.removedDocIndex[data.form[index].docName]
      && data.removedDocIndex[data.form[index].docName].length > 0) {
      data.removedDocIndex[data.form[index].docName].unshift(index);
    }
    const formToDisplay = data.removedDocIndex[data.form[index].docName].length / 4;
    let gropPdfmultipage;
    let startIndex = 0;
    for (let j1 = 0; j1 < formToDisplay; j1++) {
      gropPdfmultipage = JSON.parse(JSON.stringify(printinfo));
      for (const gropPdfSvgInfo of gropPdfmultipage) {
        if (gropPdfSvgInfo) {
          const fontData = setFontsInfo(gropPdfSvgInfo);
          gropPdfSvgInfo.docName = data.form[index].docName;
          gropPdfSvgInfo.instance = index;
          gropPdfSvgInfo.state = data.form[index].state;
          const processData = {};

          for (let ele of gropPdfSvgInfo.metaInformation) {
            if (ele && ele.elementName) {
              if (processData[ele.elementName]) {
                processData[ele.elementName].push(ele);
              } else {
                processData[ele.elementName] = [ele];
              }
            }
          }
          currentSvg = gropPdfSvgInfo.svg.split('</svg>')[0];
          if (data.printSelectedForms !== 'printBlankForm') {
            currentSvg += addWatermark(gropPdfSvgInfo.instance);
            currentFormDocIndex = gropPdfSvgInfo.instance;
            for (const eleGroup in processData) {
              if (processData[eleGroup]) {
                let i1 = startIndex;
                processData[eleGroup].sort((a, b) => {
                  return parseInt(a.formInstence, undefined) - parseInt(b.formInstence, undefined)
                });
                for (const ele of processData[eleGroup]) {
                  if (processData[eleGroup].length === 4) {
                    const eleTobeProcess = ele;
                    if (!eleTobeProcess.docName) {
                      eleTobeProcess.docName = gropPdfSvgInfo[0].docName;
                    }
                    if (data.removedDocIndex[gropPdfSvgInfo.docName][i1]) {
                      const eleValue = _getElementValue(eleTobeProcess.docName + '.' + eleTobeProcess.elementName,
                        data.removedDocIndex[gropPdfSvgInfo.docName][i1], undefined);
                      if (eleValue != undefined && eleValue !== '') {
                        try {
                          _setData(eleValue, eleTobeProcess, gropPdfSvgInfo.state);
                        } catch (e) {
                          console.log(e)
                        }
                      }
                      i1++;
                    }
                  } else {
                    const eleValue = _getElementValue(ele.docName + '.' + ele.elementName, undefined, undefined);
                    if (eleValue != undefined && eleValue !== '') {
                      try {
                        _setData(eleValue, ele, gropPdfSvgInfo.state);
                      } catch (e) {
                        console.log(e)
                      }
                    }
                  }
                }
              }
            }
          }

          outputSvgs.push({
            svg: currentSvg + '</svg>', fontsData: fontData,
            height: gropPdfSvgInfo.height, width: gropPdfSvgInfo.width
          });

          //  _setElementsValue(JSON.parse(JSON.stringify(printinfo[i])));
        }
      }
      startIndex = startIndex + 4;
    }
  }

  const resetSvg =  (PrintInfo) => {
    let title;
    if (PrintInfo.docName == 'dVehicleDeprWkt') {
      title = 'Vehicle Asset Depreciation Report'
    } else {
      title = 'Asset Depreciation Report';
    }
    let svgtag = `<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg"   version="1.1" width="1188px" height="918px" viewBox="0 0 1188 918">
    <defs>
    <style type="text/css" >
                <![CDATA[
                    .page-data,.table-header {
                      font-size:10pt;
                      color:#000;
                      font-family:COURIERNEW
                    }
                    .table-body {
                      font-size:8pt;
                      color:#000;
                      font-family:COURIERNEW
                    }
                ]]>
            </style>
            </defs>
    `;

    /** Page Header */
    svgtag += '<text x="600" y="30" class="page-data" text-anchor="middle">' + title + '</text>';
    /** Table Header */
    svgtag += `
    <text x="30" y="85" class="table-header">Description</text>
    <text x="245" y="70" class="table-header">Date</text>
    <text x="245" y="85" class="table-header">Acqd.</text>
    <text x="336" y="85" class="table-header">Cost</text>
    <text x="378" y="70" class="table-header">Bus.</text>
    <text x="378" y="85" class="table-header">Use</text>
    <text x="426" y="70" class="table-header">179+</text>
    <text x="426" y="85" class="table-header">Spec.</text>
    <text x="482" y="85" class="table-header">Basis</text>
    <text x="533" y="85" class="table-header">Method</text>
    <text x="631" y="70" class="table-header">Rec.</text>
    <text x="631" y="85" class="table-header">Per.</text>
    <text x="673" y="85" class="table-header">Cv</text>
    <text x="760" y="70" class="table-header">Prior</text>
    <text x="760" y="85" class="table-header">Depr.</text>
    <text x="806" y="70" class="table-header">Crnt.</text>
    <text x="806" y="85" class="table-header">Depr.</text>
    <text x="863" y="70" class="table-header">Next</text>
    <text x="863" y="85" class="table-header">Year</text>
    <text x="920" y="70" class="table-header">Prior</text>
    <text x="920" y="85" class="table-header">AMT</text>
    <text x="967" y="70" class="table-header">Crnt.</text>
    <text x="967" y="85" class="table-header">AMT</text>
    <text x="1019" y="70" class="table-header">Gain/</text>
    <text x="1019" y="85" class="table-header">Prince</text>
    <text x="1076" y="70" class="table-header">Sales</text>
    <text x="1076" y="85" class="table-header">Price</text>
    <text x="1122" y="70" class="table-header">Date</text>
    <text x="1122" y="85" class="table-header">Sold</text>
    `;
    /** Seprator */
    svgtag += `<line x1="30" y1="93.5" x2="1157" y2="93.5" style="stroke:rgb(0,0,0);stroke-width:1"  fill="none" />`;
    return svgtag;

  }

  const createDepricationTable = (assetDetails, svgtag, cordinatesY, columnTitles, totalFieldArr) => {
    let parentForm = '';
    let IsParentFormchange = false;
    let cordinates: any = {
      x: 30,
      y: 120,
      x1: 200,
      y1: 160
    };
    if (cordinatesY) {
      cordinates.y = cordinatesY + 20;
    }
    /** Check new Page */
    let newPage = _setPageBreak(cordinates.y + 15, svgtag, PrintInfo);
    if (newPage) {
      svgtag = "";
      svgtag = newPage.svgtag;
      cordinates = newPage.cordinates;
      cordinates.y1 = cordinates.y;
    }

    let totalVal = [];
    let cellIndex = 0;
    for (let i0 = 0; i0 < totalFieldArr.length; i0++) {
      totalVal.push(0.0);
    }
    for (let i = 0; i < assetDetails.length; i++) {
      cellIndex = 0;
      let assetDetail = assetDetails[i];

      if (parentForm !== assetDetail.parentFormInst) {
        parentForm = assetDetail.parentFormInst;
        if (assetDetail.parentFormName.includes('undefined')) {
          assetDetail.parentFormName = assetDetail.parentFormName.split('(undefined)');
          assetDetail.parentFormName = assetDetail.parentFormName[0];
        }
        if (i > 0) {
          cordinates.y = cordinates.y1 + 20;
          IsParentFormchange = false;
        }
        svgtag += `<text x='${cordinates.x}' y='${cordinates.y} ' font-family="CourierBold">Parent form:  ${assetDetail.parentFormName}</text>`;
        cordinates.y += 20
      }

      let words;
      let arr = '';
      let rawlength = 0;
      if (assetDetail.values[0] === 'undefined()') {
        assetDetail.values[0] = '()';
      }
      words = assetDetail.values[0].split(' ');
      cordinates.y1 = cordinates.y + 15;
      cordinates.x1 = 245;
      let textAlign = 'middle';
      let svgtag1;
      // for print assetDetail.values

      let newPage = _setPageBreak(cordinates.y + 20, svgtag, PrintInfo);
      if (newPage) {
        svgtag = "";
        svgtag = newPage.svgtag;
        cordinates = newPage.cordinates;
        cordinates.y1 = cordinates.y;
      }

      let assetDetailsXList = [245, 336, 378, 426, 482, 533, 631, 673, 760, 806, 863, 920, 967, 1019, 1076, 1122];
      for (let j1 = 1; j1 < assetDetail.values.length; j1++) {
        if (assetDetail.values[j1] != undefined) {
          if (j1 == assetDetail.values.length - 1) {
            if (assetDetail.values[j1]) {
              svgtag += `<text x='${cordinates.x1}' y='${cordinates.y1}' class="table-body" font-family="CourierBold">${moment(assetDetail.values[j1]).format("MM/DD")}/</text>`;
              svgtag += `<text x='${cordinates.x1}' y='${cordinates.y1 + 13}' class="table-body" font-family="CourierBold">${moment(assetDetail.values[j1]).years()}</text>`;
            }
          }
          else {
            svgtag += `<text x='${cordinates.x1}' y='${cordinates.y1}' class="table-body" font-family="CourierBold">${assetDetail.values[j1]}</text>`;
          }
        }
        cordinates.x1 = assetDetailsXList[j1];
        if (totalFieldArr.indexOf(j1) > -1) {
          textAlign = 'end';
          svgtag += svgtag1;
          // isSameParentFormName = isSameParentFormName(i,assetDetail)
          if (!isNaN(parseFloat(assetDetail.values[j1]))) {
            totalVal[cellIndex] = totalVal[cellIndex] + parseFloat(assetDetail.values[j1]);
          }
          cellIndex++;
        }

      }
      // for print values[0] words in multiline
      newPage = _setPageBreak(cordinates.y1 + (13 * words.length), svgtag, PrintInfo);
      if (newPage) {
        svgtag = "";
        svgtag = newPage.svgtag;
        cordinates = newPage.cordinates;
        cordinates.y1 = cordinates.y;
      }

      for (let j = 0; j < words.length; j++) {
        if (rawlength > 13) {
          arr += '\n';
          rawlength = 0;
          svgtag += `<text x='${cordinates.x}' y='${cordinates.y1}' class="page-data" style="font-weight:bold">${arr}</text>`;
          cordinates.y1 = cordinates.y1 + 13;
          arr = '';
        }
        arr += words[j] + ' ';
        rawlength = arr.length;
      }
      svgtag += `<text x='${cordinates.x}' y='${cordinates.y1}' class="page-data" style="font-weight:bold">${arr}</text>`;
      cordinates.y = cordinates.y1;
      // for print line
      // isSameParentFormName = isParentFormName(i, assetDetail.parentFormName);
      if (i === assetDetails.length - 1 || (assetDetails[i + 1] && parentForm !== assetDetails[i + 1].parentFormInst)) {
        svgtag += `<line x1="${cordinates.x}" y1="${cordinates.y1 + 10}" x2="1157" y2="${cordinates.y1 + 10}" style="stroke:rgb(0,0,0);stroke-width:1"  fill="none" />`;
      }
      // code for append total Value in table
      let total;
      // if (!isSameParentFormName) {
      if ((assetDetails[i + 1] && parentForm !== assetDetails[i + 1].parentFormInst) || assetDetails.length == i + 1) {
        cordinates.x1 = 210;
        if (totalVal.length > 0) {
          cordinates.y1 = cordinates.y1 + 30;

          newPage = _setPageBreak(cordinates.y1, svgtag, PrintInfo);
          if (newPage) {
            svgtag = "";
            svgtag = newPage.svgtag;
            cordinates = newPage.cordinates;
            cordinates.y1 = cordinates.y;
          }

          svgtag += `<text x='${cordinates.x}' y='${cordinates.y1}' class="table-body" style="font-weight:bold">Total : </text>`;
          for (let i1 = 1; i1 < columnTitles.length; i1++) {
            let index = totalFieldArr.indexOf(i1)
            if (index > -1) {
              if (Number.isInteger(totalVal[index])) {
                total = totalVal[index] + '.0';
              } else {
                total = totalVal[index];
              }
              if (total && total.toString().length > 0) {
                if (total.toString().length > 10) {
                  const total1 = total.toString().substring(0, 10);
                  const total2 = total.toString().substring(10, total.length);
                  svgtag += `<text x='${cordinates.x1}' y='${cordinates.y1}' class="table-body" style="font-weight:bold">${total1} </text>`;
                  cordinates.y1 += 10;
                  svgtag += `<text x='${cordinates.x1}' y='${cordinates.y1}' class="table-body" style="font-weight:bold">${total2} </text>`;
                } else {
                  svgtag += `<text x='${cordinates.x1}' y='${cordinates.y1}' class="table-body" style="font-weight:bold">${total} </text>`;
                }
              }

            }
            cordinates.x1 = assetDetailsXList[i1];
          }
        }
        totalVal = [];
        for (let i0 = 0; i0 < totalFieldArr.length; i0++) {
          totalVal.push(0.0);
        }
        // }
      }
    }
    return { pageHeight: cordinates.y1, svg: svgtag }
  };
  const _checkForPropertyType =  (parentFormName, propteryType) => {
    let check = true;
    if (parentFormName.includes("Schedule E") || parentFormName.includes("Schedule E (Duplicate)") || parentFormName.includes("8825") || parentFormName.includes("8825 (Duplicate)")) {
      if (propteryType) {
        let formProperty = parentFormName.substring(parentFormName.lastIndexOf("(") + 1, parentFormName.lastIndexOf(")"));
        check = (formProperty == propteryType) ? true : false;
      }
    }
    return check;
  }

  const getVehicleAssetData =  (printObj) => {

    let types = { '1': "Vehicles Under 6000 lbs", '2': "6000 - 14000 GVW", '3': "Trucks and Vans", '4': "Light Duty Trucks/Vans/SUVs Under 6000 lbs", '5': "Equipment and Trucks / Special Use Vehicles", '6': "Electric Automobiles" };

    let assetData = []
    let parentForms = ["d1040SS", "d4835", "dSchC", "dSchF", "dSchE", "dSchEDup", "d2106", "d1065", "d8825", "d1120C", "d1120S", "d990", "d8825Dup", "d1041"];
    let parentFormsName = ["1040SS", "4835", "Schedule C", "Schedule F", "Schedule E", "Schedule E (Duplicate)", "2106", "1065", "8825", "1120C", "1120S", "990", "8825 (Duplicate)", "1041"];
    for (let i = 0; i < parentForms.length; i++) {
      let parentForm = parentForms[i];
      let parentFormInsts = _getFormInstances(parentForm);
      for (let j = 0; j < parentFormInsts.length; j++) {
        let parentFormInst = parentFormInsts[j];
        let d4562Insts = _getChildInstFromParentInst("d4562", parentFormInst);
        for (let j1 = 0; j1 < d4562Insts.length; j1++) {
          let d4562Inst = d4562Insts[j1];
          let deprInsts = _getChildInstFromParentInst("dVehicleDeprWkt", d4562Inst);

          for (let j2 = 0; j2 < deprInsts.length; j2++) {
            let deprInst = deprInsts[j2];
            let parentFormName = parentFormsName[i] + (_getElementValue("dVehicleDeprWkt.fieldaf", deprInst, "") == "" ? "" : "(" + _getElementValue("dVehicleDeprWkt.fieldaf", deprInst, "") + ")");
            let checkForPropertyType = _checkForPropertyType(parentFormName, _getElementValue("dVehicleDeprWkt.fieldaf", deprInst, ""));
            if (checkForPropertyType) {
              let deprClassValue = _getElementValue("dVehicleDeprWkt.DeprClass", deprInst);
              let typeValue = "";
              if (deprClassValue != "") {
                typeValue = types[deprClassValue];
              }

              let values = [_getElementValue("dVehicleDeprWkt.fieldfv", deprInst, "") + ("(" + typeValue + ")"),
              _getElementValue("dVehicleDeprWkt.fieldfu", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldfs", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldfk", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldda", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fielddr", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldec", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldej", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldel", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fielddn", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldcv", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fielddl", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldcr", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldcv3", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldes", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldfb", deprInst, ""),
              _getElementValue("dVehicleDeprWkt.fieldfg", deprInst, "")];

              assetData.push({ 'parentFormInst': parentFormInst, 'parentFormName': parentFormName, 'values': values })
            }

          }
        }
      }
    }
    return assetData;
  };

  let getAssetDetails =  (printObj) => {
    let assetData = []
    let parentForms = ["d1040SS", "d4835", "dSchC", "dSchF", "dSchE", "dSchEDup", "d2106", "d1065", "d8825", "d1120C", "d1120S", "d990"];
    let parentFormsName = ["1040SS", "4835", "Schedule C", "Schedule F", "Schedule E", "Schedule E (Duplicate)", "2106", "1065", "8825", "1120C", "1120S", "990"];
    for (let i = 0; i < parentForms.length; i++) {
      let parentForm = parentForms[i];
      let parentFormInsts = _getFormInstances(parentForm);
      for (let j = 0; j < parentFormInsts.length; j++) {
        let parentFormInst = parentFormInsts[j];
        let d4562Insts = _getChildInstFromParentInst("d4562", parentFormInst);
        for (let j1 = 0; j1 < d4562Insts.length; j1++) {
          let d4562Inst = d4562Insts[j1];
          let deprInsts = _getChildInstFromParentInst("dDeprwkt", d4562Inst);
          for (let j2 = 0; j2 < deprInsts.length; j2++) {
            let deprInst = deprInsts[j2];

            let parentFormName = parentFormsName[i] + (_getElementValue("dDeprwkt.fieldem", deprInst, "") == "" ? "" : "(" + _getElementValue("dDeprwkt.fieldem", deprInst, "") + ")");
            let checkForPropertyType = _checkForPropertyType(parentFormName, _getElementValue("dDeprwkt.fieldem", deprInst, ""));
            if (checkForPropertyType) {
              let fieldem = _getElementValue("dDeprwkt.fieldem", deprInst);
              let deprClass = _getElementValue("dDeprwkt.DeprClass", deprInst);
              let parentFormName = parentFormsName[i] + (fieldem != '' && fieldem != undefined ? '(' + fieldem + ')' : '');
              let values = [
                _getElementValue("dDeprwkt.fieldel", deprInst) + (deprClass != '' && deprClass != undefined ? '(' + deprClass + ')' : ''),
                _getElementValue("dDeprwkt.fieldek", deprInst),
                _getElementValue("dDeprwkt.fieldei", deprInst),
                _getElementValue("dDeprwkt.priorsection", deprInst),
                _getElementValue("dDeprwkt.fieldcl", deprInst),
                _getElementValue("dDeprwkt.fielddi", deprInst),
                _getElementValue("dDeprwkt.Convention", deprInst),
                _getElementValue("dDeprwkt.fielddg", deprInst),
                _getElementValue("dDeprwkt.fieldbz", deprInst),
                _getElementValue("dDeprwkt.fieldbs", deprInst),
                _getElementValue("dDeprwkt.fieldcs", deprInst),
                _getElementValue("dDeprwkt.fieldcu", deprInst),
                _getElementValue("dDeprwkt.fieldci", deprInst),
                _getElementValue("dDeprwkt.fieldbn", deprInst),
                _getElementValue("dDeprwkt.fieldbk", deprInst),
                _getElementValue("dDeprwkt.fieldbi", deprInst)

              ]
              assetData.push({ 'parentFormInst': parentFormInst, 'parentFormName': parentFormName, 'values': values })
            }
          }
        }
      }
    }
    return assetData;
  };

  // assert report create by this function
  const _assertreport =  (PrintInfo) => {
    let totalVal = [];
    let totalFieldArr = [2, 3, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    for (let i0 = 0; i0 < totalFieldArr.length; i0++) {
      totalVal.push(0.0);
    }
    let columnTitles = ["Description(Type)", "Date\nIn\nSvc", "Cost/\nBasis", "Prior\n179\nBonus", "Bus.\nUse\nPer.",
      "Method", "Cv", "Life", "Crnt.\n179", "Crnt.\nBonus", "Prior\nDepr.", "Crnt.\nDepr.\nDeduc.", "Prior\nSpecial\nDepr.\nAllow.",
      "Prior\nAMT", "Crnt.\nAMT", "Crnt.\nAmo.\nDep."];

    // calculation of Total fields

    if (PrintInfo.docName == 'dVehicleDeprWkt') {
      columnTitles = ["Description", "Date\nAcqd.", "Cost", "Bus.\nUse", "179+\nSpec.", "Basis", "Method", "Rec.\nPer.", "Cv", "Prior\nDepr.", "Crnt.\nDepr.", "Next\nYear", "Prior\nAMT", "Crnt.\nAMT", "Gain/\nPrince", "Sales\nPrice", "Date\nSold"]
    }
    if (PrintInfo.docName == 'dVehicleDeprWkt') {
      totalFieldArr = [2, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15]
    }
    totalFieldArr = [2, 4, 5, 7, 9, 10, 11, 12, 13, 14, 15]
    let assetDetails;
    if (PrintInfo.docName == 'dVehicleDeprWkt') {
      assetDetails = getVehicleAssetData(PrintInfo);
    } else {
      assetDetails = getAssetDetails(PrintInfo);
    }
    console.log(assetDetails);
    let svgtag;
    // reset svg (title and header)
    svgtag = resetSvg(PrintInfo);
    // if (pageHeight < totalSvgHeight) {
    // let cellIndex = 0;
    const isAddedParentName: any = {};
    // create svg 
    for (let i = 0; i < assetDetails.length; i++) {
      if (assetDetails[i]) {
        if (assetDetails[i].parentFormName.includes('undefined')) {
          assetDetails[i].parentFormName = assetDetails[i].parentFormName.split('(undefined)');
          assetDetails[i].parentFormName = assetDetails[i].parentFormName[0];
        }
      }
      if (Object.keys(isAddedParentName).length > 0 && isAddedParentName[assetDetails[i].parentFormName]) {
        isAddedParentName[assetDetails[i].parentFormName].push(assetDetails[i]);
      } else {
        isAddedParentName[assetDetails[i].parentFormName] = [assetDetails[i]];
      }
    }
    let deprecationTableDetails: any = {};
    deprecationTableDetails.svg = svgtag;
    let cordinatesY;
    for (const item of Object.keys(isAddedParentName)) {
      deprecationTableDetails = createDepricationTable(isAddedParentName[item], deprecationTableDetails.svg, cordinatesY, columnTitles, totalFieldArr);
      deprecationTableDetails.svg = deprecationTableDetails.svg;
      cordinatesY = deprecationTableDetails.pageHeight;
    }
    svgtag = deprecationTableDetails.svg;
    outputSvgs.push({ svg: svgtag + '</svg>', fontsData: '', width: 1188, height: 918 });
  };

  // function for change all value of element change based on setTextboxValue function
  const _prepareAllMetaInfo = () => {
    setStmtDoc();
    for (const index of data.docIndexes) {
      if (PrintInfo[index]) {
        const docName = data.form[index].docName;
        currentFormProperty = data.formPropList.find((obj) => {
          return obj.docName === docName;
        });
        setPDFStyle();
        if (docName === 'dSchUTTC40W') {
          groupPDF(PrintInfo[index], index);
        } else if (docName === 'dPriceList' && data.printSelectedForms !== 'printBlankForm' && !_getElementValue("dPriceList.ASIcheckbox")) {
          _priceList();
        } else if ((docName === 'dDeprwkt' || docName === 'dVehicleDeprWkt') && data.printSelectedForms !== 'printBlankForm') {
          PrintInfo[index]["docName"] = docName;
          _assertreport(PrintInfo[index]);
        } else {
          for (let i = 0; i < PrintInfo[index].length; i++) {
            if (PrintInfo[index][i]) {
              PrintInfo[index][i].docName = data.form[index].docName;
              PrintInfo[index][i].instance = index;
              PrintInfo[index][i].state = data.form[index].state;
              _setElementsValue(JSON.parse(JSON.stringify(PrintInfo[index][i])));
            }
          }
        }
      }
    }
    postMessage({ outputSvg: outputSvgs, overFlowStmt: stmtInForms }, undefined);

  };


  _prepareAllMetaInfo();
})
