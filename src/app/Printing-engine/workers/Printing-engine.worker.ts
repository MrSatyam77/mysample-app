/// <reference lib="webworker" />
importScripts('app/Printing-engine/printing-handler/overflow-stmt-handler.js');
declare var setRequiredInfo: any;
addEventListener('message', ({ data }) => {
    const workerSvgHandler = {};
    let pdfCreatedWorker;
    let numberOfWorker = 4;
    const createPDF = () => {
        pdfCreatedWorker = new Worker('app/Printing-engine/workers/create-pdf.worker.js');
        const password = createPassWordOfPDf();
        pdfCreatedWorker.postMessage({ password: password, workerSvgHandler: workerSvgHandler, isPasswordProtectedPDF: data.isPasswordProtectedPDF });
        pdfCreatedWorker.onmessage = ({ data }) => {
            pdfCreatedWorker.terminate();
            postMessage(data, undefined);

        };

    };

    const createPassWordOfPDf = () => {
        if (data) {
            if (data.isPasswordProtectedPDF) {
                if (data.pdfCustomPassword) {
                    return data.pdfCustomPassword;
                } else {
                    if (data.taxReturn) {
                        if (data.taxReturn.header) {
                            if (data.taxReturn.header.packageNames) {
                                const userPackageList = data.taxReturn.header.packageNames.includes("1040");
                                if (userPackageList) {
                                    // this String variable hold user First name
                                    let userName = data.taxReturn.header.client.firstName;
                                    // this String hold user SSN
                                    let userSSN = data.taxReturn.header.client.ssn;
                                    // this condition check name and SSN is not blank.
                                    if (userName && userSSN) {
                                        // this array object split user name, his/her input Initial.
                                        const nameSplited = userName.split("\\s+");
                                        userName = nameSplited[0];
                                        // this condition check user name more than 4 character than sub string other
                                        // wise got full name.
                                        if (userName.length > 4) {
                                            // this substring get First fore digit of user name.
                                            userName = userName.substring(0, 4).toLowerCase();
                                        } else {
                                            userName = userName.toLowerCase();
                                        }
                                        // this Split "-" in SSN after last fore digit.
                                        const ssnSplited = userSSN.split("-");
                                        userSSN = ssnSplited[ssnSplited.length - 1];
                                    }
                                    return userName + userSSN;
                                } else {
                                    // variable hold Company Name
                                    let companyName = data.taxReturn.header.client.companyName;
                                    // variable hold Company EIN number
                                    let companyEIN = data.taxReturn.header.client.ein;
                                    if (companyName && companyEIN) {
                                        companyName = companyName.replace("[^\\w]", "");
                                        // this condition check user name more than 4 character than sub string other
                                        // wise got full name.
                                        if (companyName.length > 4) {
                                            // this substring get First fore digit of user name.
                                            companyName = companyName.substring(0, 4).toLowerCase();
                                        } else {
                                            companyName = companyName.toLowerCase();
                                        }
                                        // this Split "-" in SSN after last fore digit.
                                        const einSplited = companyEIN.split("-");
                                        if (einSplited[einSplited.length - 1].length > 4) {
                                            companyEIN = einSplited[einSplited.length - 1].substring(einSplited[einSplited.length - 1].length - 4);
                                        }
                                    }
                                    return companyName + companyEIN;


                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const prepareChildInfo = (printingInfo) => {
        printingInfo.form = data.forms;
        printingInfo.svgInfo = data.printDataInfo;
        printingInfo.waterMarkText = data.waterMarkText;
        printingInfo.maskSensitiveInfo = data.maskSensitiveInfo;
        printingInfo.taxReturn = data.taxReturn;
        printingInfo.docFields = data.docFields;
        printingInfo.signatureData = data.signatureData;
        printingInfo.signTypeLookup = data.signTypeLookup;
        printingInfo.formPropList = data.formPropList;
        printingInfo.removedDocIndex = data.removedDocIndex;
        printingInfo.printSelectedForms = data.printSelectedForms;
        printingInfo.submissionIds = data.submissionIds;
        return printingInfo;
    };

    const workerInstance = [];
    const assignSvgForDatatBind = () => {
        const formCanAssign = parseInt((data.docIndexes.length / 4).toString(), undefined);
        formCanAssign >= 1 ? numberOfWorker = 4 : numberOfWorker = 1;
        let counter = 0;
        const responseHandler = [];
        let stmtInformation = {};
        for (let i = 0; i < numberOfWorker; i++) {
            workerInstance.push(new Worker('@app/Printing-engine/workers/create-svg.worker', { type: 'module' }));
            let printingInfo: any = { docIndexes: [], form: [] };
            if (i === numberOfWorker - 1) {
                printingInfo.docIndexes = data.docIndexes.slice(counter, data.docIndexes.length);
            } else {
                printingInfo.docIndexes = data.docIndexes.slice(counter, counter + formCanAssign);
            }
            printingInfo = prepareChildInfo(printingInfo);
            workerInstance[i].postMessage(printingInfo);
            counter = counter + formCanAssign;
            workerInstance[i].onmessage = ({ data }) => {
                workerSvgHandler[i] = data.outputSvg;
                stmtInformation[i] = data.overFlowStmt;
                responseHandler.push(i);
                if (responseHandler.length === numberOfWorker) {
                    for (let i0 = 0; i0 < numberOfWorker; i0++) {
                        workerInstance[i0].terminate();
                    }
                    const overFlowStmt = setRequiredInfo({ taxReturn: printingInfo.taxReturn, docFields: printingInfo.docFields, stmtTobePrint: stmtInformation, maskSensitiveInfo: printingInfo.maskSensitiveInfo });
                    workerSvgHandler[numberOfWorker] = overFlowStmt;
                    createPDF();
                }
            };
        }
    };

    assignSvgForDatatBind();
});

