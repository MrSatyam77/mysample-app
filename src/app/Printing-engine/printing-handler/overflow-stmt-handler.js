let taxReturn;
let docFields;
let stmtTobePrint;
let currentSvg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg" version="1.1" width="918px" height="1188px" viewBox="0 0 918 1188">';
let outputSvg = []
let isupdated = true;
let maskSensitiveInfo = false;
let totalValues = {}
const setRequiredInfo = (data) => {
  taxReturn = data.taxReturn;
  docFields = data.docFields;
  stmtTobePrint = data.stmtTobePrint;
  maskSensitiveInfo = data.maskSensitiveInfo;
  return addOverFlowStmt();
}

const getChildDoc = (childDocName, parentId) => {
  const childDoc = {};
  if (taxReturn && taxReturn.docs && taxReturn.docs[childDocName]) {
    if (parentId !== undefined && parentId !== '') {
      for (const index in taxReturn.docs[childDocName]) {
        if (taxReturn.docs[childDocName][index]) {
          const docObj = taxReturn.docs[childDocName][index];
          if (parseInt(docObj.parent, undefined) === parseInt(parentId, undefined)) {
            childDoc[index] = docObj;
          }
        }
      }
    } else {
      return taxReturn.docs[childDocName];
    }
  }
  return childDoc;
}


// formate value base on requrments
const _formatValue = (eleValue, fieldType, maskSensitiveInfo) => {
  var value = eleValue;
  if (fieldType && fieldType.toLowerCase() == 'money') {
    value = value.toString().replace(/,/g, '')
    var splitval = value.split('.');
    let fractional = parseInt(splitval[0]);
    let fractionalStr;
    if (fractional) {
      fractionalStr = fractional.toLocaleString();
    }
    if (splitval[1]) {
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
  if (value == undefined || value === NaN || value === '') {
    value = eleValue;
  }
  return value;
}

let prevPageHeight = 0;
const stringWithLength = (stringToProcess, columnWidth) => {
  if (typeof stringToProcess === 'string') {
    const Words = stringToProcess.split(' ');
    const stringCreate = [];
    let processstring;
    let i1 = 0;
    for (const word of Words) {
      if (!processstring) {
        processstring = word
      } else {
        let temp = processstring + ' ' + word;
        if ((temp.length * 7) > columnWidth) {
          stringCreate.push(processstring)
          processstring = word;
        } else {
          processstring = temp;
        }
      }
      if (i1 == Words.length - 1) {
        stringCreate.push(processstring)
        processstring = '';
      }
      i1++;
    }
    return stringCreate;
  }
  return stringToProcess;
}

const createRow = (tableConfig, pageHeight, defultRowHeight, columnWidth, elementNames, row, isHeader, align, totalStmtElement) => {
  let j = 0;
  const processHandlerConfig = JSON.parse(JSON.stringify(tableConfig))
  let rowHeight = defultRowHeight;
  let extraPadding = 0;
  let textSvg = ''
  processHandlerConfig.y1 += pageHeight;
  for (let rowEle of elementNames) {
    if (rowEle && rowEle.indexOf('.') > -1) {
      rowEle = rowEle.split('.')[1];
    }
    let elementValue;
    if (isHeader) {
      elementValue = rowEle;
    } else {
      if (row[rowEle]) {
        elementValue = row[rowEle].value;
      }
    }
    if (totalStmtElement) {
      if (totalStmtElement.indexOf(rowEle) > -1 && !Number.isNaN(elementValue)) {
        if (totalValues[rowEle] === undefined) {
          totalValues[rowEle] = Number(elementValue)
        } else {
          totalValues[rowEle] += Number(elementValue);
        }
      }
    }
    if (elementValue !== null && elementValue !== undefined) {
      if (typeof elementValue !== 'string') {
        elementValue = elementValue.toString();
      }
      const alignHandler = { value: 0, textAnchor: 'start' };
      if (align[j] === 'right') {
        alignHandler.value = columnWidth - 4;
        alignHandler.textAnchor = 'end';
      }
      if(!Number.isNaN(parseFloat(elementValue))) {
          elementValue = _formatValue(elementValue, 'money', maskSensitiveInfo);
      }


      if ((7 * elementValue.length) < columnWidth) {
        textSvg += `<text x="${processHandlerConfig.x1 + alignHandler.value + 2}" y="${processHandlerConfig.y1 + (rowHeight - 4)}" font-family="default-font" font-size="8pt" text-anchor="${alignHandler.textAnchor}">${elementValue}</text>`;
      } else {
        const strArray = stringWithLength(elementValue, columnWidth);
        extraPadding = strArray.length * (rowHeight);
        let i2 = 0;
        for (let str of strArray) {
          textSvg += `<text x="${processHandlerConfig.x1 + alignHandler.value + 2}" y="${processHandlerConfig.y1 + i2 + (rowHeight - 4)}" font-family="default-font" font-size="8pt" text-anchor="${alignHandler.textAnchor}">${str}</text>`;
          i2 = i2 + rowHeight - 10;
        }
      }
    }

    processHandlerConfig.x1 = processHandlerConfig.x1 + columnWidth;
    j++;
  }
  rowHeight += extraPadding;
  pageHeight += rowHeight;
  return { 'textSvg': textSvg, 'pageHeight': pageHeight, 'rowHeight': rowHeight }
}

const drawTableLine = (headerTitles, processHandlerConfig, pageHeight, columnWidth) => {
  let lineEle = ''
  for (let headerTitle of headerTitles) {
    lineEle += `<line x1="${processHandlerConfig.x1}" y1="${processHandlerConfig.y1}"
      x2="${processHandlerConfig.x1}" y2="${processHandlerConfig.y1 + pageHeight}" style="stroke-width:1; stroke:black;" />`;
    processHandlerConfig.x1 = processHandlerConfig.x1 + columnWidth;
    // processHandlerConfig.x2 = processHandlerConfig.x2 + columnWidth;
  }
  return lineEle;
}

const addTotalFields = (stmtEleNames, tableConfig, pageHeight, rowHeight, columnWidth, stmtInfo) => {
  let j = 1;
  let textSvg = ''
  const processHandlerConfig = JSON.parse(JSON.stringify(tableConfig))
  textSvg += `<text x="${processHandlerConfig.x1}" y="${processHandlerConfig.y1 + pageHeight + (rowHeight - 5)}" font-family="default-font" font-size="8pt">Total</text>`;
  for (let tEle of stmtEleNames) {
    tEle = tEle.split('.')[1]
    if (stmtInfo.totalStmtElement && stmtInfo.totalStmtElement.indexOf(tEle) > -1) {
      const eleHandler = { value: 0, textAnchor: 'start', eleValue: 0 };
      // if (stmtInfo.totalAlignment[j] === 'right') {
      eleHandler.value = columnWidth - 4;
      eleHandler.textAnchor = 'end';
      //  }
      if (totalValues[tEle] !== undefined && totalValues[tEle] !== '' && !Number.isNaN(totalValues[tEle])) {
        eleHandler.eleValue = totalValues[tEle];
      }
      eleHandler.eleValue = _formatValue(eleHandler.eleValue, 'money', maskSensitiveInfo);
      textSvg += `<text x="${processHandlerConfig.x1 + (columnWidth * j) - 2}" y="${processHandlerConfig.y1 + pageHeight + (rowHeight - 5)}" font-family="default-font" font-size="8pt" text-anchor="${eleHandler.textAnchor}">${eleHandler.eleValue}</text>`;
    }
    j++


  }
  // textSvg += `<text x="${processHandlerConfig.x1}" y="${processHandlerConfig.y1 + pageHeight}" font-family="default-font" font-size="8pt" text-anchor="${alignHandler.textAnchor}">Total</text>`;
  pageHeight += rowHeight;
  return { 'textSvg': textSvg, 'pageHeight': pageHeight, 'rowHeight': rowHeight }

}


const createSmartTable = (headerTitles, align, elementNames, rowData, index, keys, stmtInfo) => {
  totalValues = {};
  isupdated = false;
  let resetConfig = { x1: 25, y1: 60, x2: 890, y2: 1130, pageHeight: 1130 };
  let tableConfig = { x1: 25, y1: 60, x2: 890, y2: 1130, pageHeight: 1130 };
  let isRowAdd = false;
  tableConfig.y1 += prevPageHeight;
  tableConfig.y2 += prevPageHeight;
  const columnWidth = (tableConfig.x2 - tableConfig.x1) / headerTitles.length;
  let pageHeight = 0;
  let svgtag = `<text x="${tableConfig.x1}" y="${tableConfig.y1}" font-family="helveticaBold" font-size="8pt" >${stmtInfo.stmtTitle}</text>`;
  tableConfig.y1 += 5;
  let textElem = `<line x1="${tableConfig.x1}" y1="${tableConfig.y1}" x2="${tableConfig.x2}"
   y2="${tableConfig.y1}"  style="stroke-width:1; stroke:black;" />'`;
  let processHandlerConfig = JSON.parse(JSON.stringify(tableConfig))
  let rowHeight = 20;
  // write text for header
  let rowEle = createRow(tableConfig, pageHeight, 20, columnWidth, headerTitles, undefined, true, align, undefined)
  rowHeight = rowEle.rowHeight;
  pageHeight = rowEle.pageHeight;
  textElem += rowEle.textSvg;

  textElem += ` <line x1="${tableConfig.x1}" y1="${tableConfig.y1 + rowHeight}" x2="${tableConfig.x2}" y2="${tableConfig.y1 + rowHeight}" style="stroke-width:1; stroke:black;" />`;
  svgtag += `<rect x="${tableConfig.x1}" y="${tableConfig.y1}" width="${tableConfig.x2 - tableConfig.x1}" height="${rowHeight}" fill='gainsboro'/>`
  svgtag += textElem;
  processHandlerConfig = JSON.parse(JSON.stringify(tableConfig))
  processHandlerConfig.y1 = processHandlerConfig.y1 + pageHeight;
  for (const row in rowData) {
    rowEle = createRow(tableConfig, pageHeight, 20, columnWidth, elementNames, rowData[row], false, align, stmtInfo.totalStmtElement)
    if (rowEle.textSvg) {


      rowHeight = rowEle.rowHeight;
      processHandlerConfig.y1 = processHandlerConfig.y1 + rowHeight;
      let rowLine = `<line x1="${processHandlerConfig.x1}" y1="${processHandlerConfig.y1}"
      x2="${processHandlerConfig.x2}" y2="${processHandlerConfig.y1}" style="stroke-width:1; stroke:black;" />`;
      isRowAdd = true;
      if (prevPageHeight + rowEle.pageHeight >= tableConfig.pageHeight) {
        svgtag += drawTableLine(headerTitles, JSON.parse(JSON.stringify(tableConfig)), pageHeight, columnWidth)
        // svgtag += `<line x1="${tableConfig.x2}" y1="${tableConfig.y2}"
        // x2="${tableConfig.x2}" y2="${processHandlerConfig.y1 + pageHeight}" style="stroke-width:1; stroke:black;" />`;
        tableConfig = JSON.parse(JSON.stringify(resetConfig));
        processHandlerConfig = JSON.parse(JSON.stringify(tableConfig))
        isupdated = true;
        pageHeight = 0;
        currentSvg += svgtag;
        outputSvg.push({ svg: currentSvg + '</svg>' });
        svgtag = ''
        prevPageHeight = 0;
        currentSvg = '<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svg="http://www.w3.org/2000/svg" version="1.1" width="918px" height="1188px" viewBox="0 0 918 1188">'
        currentSvg += `<line x1="${tableConfig.x1}" y1="${tableConfig.y1}" x2="${tableConfig.x2}"
        y2="${tableConfig.y1}"  style="stroke-width:1; stroke:black;" />'`;
        rowEle = createRow(tableConfig, pageHeight, 20, columnWidth, elementNames, rowData[row], false, align)
        svgtag += rowEle.textSvg
        pageHeight = rowEle.pageHeight
        //   svgtag += `<line x1="${processHandlerConfig.x1}" y1="${processHandlerConfig.y1}"
        // x2="${processHandlerConfig.x2}" y2="${processHandlerConfig.y1}" style="stroke-width:1; stroke:black;" />`;
        processHandlerConfig.y1 = processHandlerConfig.y1 + rowHeight;
        svgtag += `<line x1="${processHandlerConfig.x1}" y1="${processHandlerConfig.y1}"
      x2="${processHandlerConfig.x2}" y2="${processHandlerConfig.y1}" style="stroke-width:1; stroke:black;" />`;
      } else {
        svgtag += rowEle.textSvg
        pageHeight = rowEle.pageHeight
        svgtag += `<line x1="${processHandlerConfig.x1}" y1="${processHandlerConfig.y1}"
      x2="${processHandlerConfig.x2}" y2="${processHandlerConfig.y1}" style="stroke-width:1; stroke:black;" />`;
      }
    }

  }
  if (isRowAdd === true) {
    // draw line
    processHandlerConfig = JSON.parse(JSON.stringify(tableConfig))

    if (stmtInfo.elementTotal) {
      const totalFiledsRow = addTotalFields(elementNames, tableConfig, pageHeight, 20, columnWidth, stmtInfo)
      svgtag += totalFiledsRow.textSvg
      pageHeight = totalFiledsRow.pageHeight
      svgtag += `<line x1="${processHandlerConfig.x1}" y1="${processHandlerConfig.y1 + pageHeight}"
      x2="${processHandlerConfig.x2}" y2="${processHandlerConfig.y1 + pageHeight}" style="stroke-width:1; stroke:black;" />`;
    }
    svgtag += drawTableLine(headerTitles, processHandlerConfig, pageHeight, columnWidth)
    svgtag += `<line x1="${tableConfig.x2}" y1="${tableConfig.y1}"
      x2="${tableConfig.x2}" y2="${processHandlerConfig.y1 + pageHeight}" style="stroke-width:1; stroke:black;" />`;

    prevPageHeight += pageHeight + 20;
    currentSvg += svgtag;
  }
}

const ElementWithAlign = (StrWithAlign, isSplitWithDocName) => {
  if (StrWithAlign) {
    const tempEle = StrWithAlign.split('|');
    const stmtElement = []
    const stmtAlignment = []
    for (const ele of tempEle) {
      const alignWithEleName = ele.split('?')
      if (alignWithEleName[0] !== undefined && alignWithEleName[0] !== '') {
        if (isSplitWithDocName) {
          stmtElement.push(alignWithEleName[0].split('.')[1]);
        } else {
          stmtElement.push(alignWithEleName[0]);
        }

        if (alignWithEleName[1]) {
          stmtAlignment.push(alignWithEleName[1].split('=')[1]);
        } else {
          stmtAlignment.push('')
        }
      }
    }
    return { stmtElements: stmtElement, stmtAlignments: stmtAlignment }
  } else {
    return {  }
  }

}

addOverFlowStmt = () => {
  const keys = Object.keys(stmtTobePrint).length;
  for (let i = 0; i < keys; i++) {
    if (stmtTobePrint[i]) {
      for (const parentIndex in stmtTobePrint[i]) {
        for (const stmtDocName in stmtTobePrint[i][parentIndex]) {
          const stmtInfo = stmtTobePrint[i][parentIndex][stmtDocName];
          const stmtheader = stmtTobePrint[i][parentIndex][stmtDocName].stmtHeaders.split('|');
          const tempEle = ElementWithAlign(stmtTobePrint[i][parentIndex][stmtDocName].stmtElements, false)
          const statementDoc = getChildDoc(stmtDocName, parentIndex);
          if (Object.keys(statementDoc).length > 0) {
            if (stmtInfo.elementTotal) {
              const tempTotal = ElementWithAlign(stmtInfo.elementTotal, true);
              stmtInfo.totalAlignment = tempTotal.stmtAlignments;
              stmtInfo.totalStmtElement = tempTotal.stmtElements;
            }

            createSmartTable(stmtheader, tempEle.stmtAlignments, tempEle.stmtElements, statementDoc, i, keys, stmtInfo);
          }
        }
      }
    }
  }

  if (isupdated === false) {
    outputSvg.push({ svg: currentSvg + '</svg>' });
  }

  return outputSvg;

}

if (typeof module !== 'undefined' && module && typeof module.exports !== 'undefined') {
  module.exports = setRequiredInfo;
}
