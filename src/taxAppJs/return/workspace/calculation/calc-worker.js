"use strict";

//@exclude
//DO_NOT_REMOVE ABOVE LINE
//import lodash it would not be accessible from outside
importScripts('../../../../../../taxAppJs/lib/lodash.js')
//import calculator engine
importScripts('calculator.js');
//import calculation Service
importScripts('calc-service.js');
//Import calculation controller helper
importScripts('calc-controller.js');
//Import calculation review engine
importScripts('calc-review.js');
//Import calculation Utility
importScripts('calc-util.js');
//import momentJS
importScripts('../../../../../../taxAppJs/lib/moment/moment.js');
//DO_NOT_REMOVE BELOW LINE
//@endexclude

/* @if NODE_ENV='production' || NODE_ENV='test' **
importScripts('../../../../../../taxAppJs/dist/calc-lib-import.js');
importScripts('../../../../../../taxAppJs/dist/calc-source-import.js');
/* @endif */

//Worker Event Listner
self.addEventListener('message', function (e) {
    switch (e.data.msgType) {
        case 'init':
            calculation.calculator.init();
            calculation.calcSvc.init(e.data.taxReturn);
            calculation.calcCtrl.init();
            calculation.calcReview.init();
            calculation.constant.init(e.data.constant);
            calculation.logger.init(e.data.log || false);
            break;
        case 'updateTaxReturn':
            calculation.calcSvc.init(e.data.taxReturn);
            break;
        case 'ChangedField':
            var field = e.data.field;
            calculation.calcSvc.setValue(field.fieldName, field.newVal, field.index, undefined, true);
            calculation.calculator.start();
            break;
        case 'start':
            calculation.calculator.start();
            break;
        case 'addCalcUrl':
            calculation.calcCtrl.addCalcUrl(e.data.key, e.data.url);
            calculation.calcReview.addUrl(e.data.key, e.data.reviewUrl);
            break;
        case 'addDoc':
            calculation.calcSvc.addDoc(e.data.docName, e.data.index, e.data.parentIndex);
            //TODO: This is just patch to solve duplicate docIndex issue.
            //For perfect solution either we have to make doc count singleton or we should not allow web worker to add childDoc.
            setTimeout(function () {
                calculation.calculator.calculateDocFields(e.data.docName, e.data.index);
            }, 0);
            break;
        case 'removeDoc':
            calculation.calcSvc.removeDoc(e.data.docName, e.data.index, true);
            calculation.calculator.start();
            break;
        case 'updateParent':
            calculation.calcSvc.updateParent(e.data.docName, e.data.index, e.data.parentIndex);
            break;
        case 'reCalculate':
            calculation.calcSvc.reCalculate();
            calculation.calculator.start();
            break;
        case 'calcDocAllMethods':
            calculation.calculator.calculateDocFields(e.data.docName, e.data.index);
            break;
        case 'calcAllDocAllMethods':
            calculation.calculator.calculateAllDocFields(e.data.data);
            break;
        case 'performReview':
            calculation.calcReview.start(e.data.ruleDocs);
            break;
        case 'setCounterinCalcService':
            calculation.calcSvc.setCounter(e.data.count);
            break;
        case 'postUtilDB':
            calculation.utils.setDB(e.data.db);
    }
}, false);
