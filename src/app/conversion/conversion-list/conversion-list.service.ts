/** Import External */
import { Injectable } from '@angular/core';
import * as moment from 'moment';
/** Import Internal */
import { CommonAPIService, UserService } from '@app/shared/services';
import { APINAME, DEFAULT_FORMAT } from '../conversion.constant';
import { ConversionUploaderservice } from "../conversion-uploader.service";
import { ConvertSizePipe } from '../convert-size.pipe';
import { ConversionDetailService } from '../conversion-details/conversion-detail.service';

@Injectable()
export class ConversionListService {
    /** Private filed */
    private columnDefs = [
        {
            headerName: 'Date', field: 'createdDateToDisplay', sortable: true, headerTooltip: 'Date',
            lockPosition: true,
            cellStyle: {
                color: 'blue',
                cursor: 'pointer'
            },
            cellRenderer: "agGroupCellRenderer",
            suppressMenu: true,
        },
        { headerName: 'Software', field: 'softwareName.name', sortable: true, headerTooltip: 'Software', lockPosition: true, suppressMenu: true, },
        {
            headerName: 'Upload Status',
            field: 'uploadStatus',
            cellRenderer: params => {
                if (typeof (params.value) == "string" && params.value) {
                    return `<div>${params.value}</div>`
                }
                else if (typeof (params.value) == "number") {
                    return `<div class= "progress">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style = 'width:${params.value}%' aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"> ${params.value} </div> </div>`
                }

            },
            lockPosition: true,
            suppressMenu: true,
            sortable: true,
            headerTooltip: 'Upload Status',
            cellClass: ['my-class1']
        },
        { headerName: 'Total Returns', field: 'totalCount', sortable: true, headerTooltip: 'Total Returns', lockPosition: true, suppressMenu: true, },
        { headerName: 'Converted Returns', field: 'convertedReturn', sortable: true, headerTooltip: 'Converted Returns', lockPosition: true, suppressMenu: true, },
        { headerName: 'Pending Returns', field: 'pending', sortable: true, headerTooltip: 'Pending Returns', lockPosition: true, suppressMenu: true, },
        { headerName: 'Conversion Failed Returns', field: 'fail', sortable: true, headerTooltip: 'Conversion Failed Returns', lockPosition: true, suppressMenu: true, },
        { headerName: 'Estimated Converted Time', field: 'ETAToDisplay', sortable: true, headerTooltip: 'Estimated Converted Time', lockPosition: true, suppressMenu: true, },
    ]

    private detailCellRendererParamsWithOutSSN = {
        detailGridOptions: {
            columnDefs: [
                { headerName: 'BackupFile', sortable: true, field: "backUpFileName", hide: false, headerTooltip: 'BackupFile', lockPosition: true, suppressMenu: true, width: 140, cellClass: "text-wrap", autoHeight: true },
                { headerName: 'Size', sortable: true, field: "sizeToDisplay", hide: false, headerTooltip: 'Size', lockPosition: true, suppressMenu: true, width: 80 },
                { headerName: 'Upload Status', sortable: true, field: "uploadStatus", hide: false, headerTooltip: 'Upload Status', lockPosition: true, suppressMenu: true, width: 120 },
                { headerName: 'Conversion Status', sortable: true, field: "conversionStatusToDisplay", hide: false, headerTooltip: 'Conversion Status', lockPosition: true, suppressMenu: true, width: 120 },
                { headerName: 'Year', sortable: true, field: "year", hide: false, headerTooltip: 'Year', lockPosition: true, suppressMenu: true, width: 60 },
                { headerName: 'SSN/EIN', sortable: true, field: "ssn", hide: false, headerTooltip: 'SSN/EIN', lockPosition: true, suppressMenu: true, width: 150 },
                { headerName: 'Name', sortable: true, field: "name", hide: false, headerTooltip: 'Name', lockPosition: true, suppressMenu: true, width: 150, cellClass: "text-wrap", autoHeight: true },
                { headerName: 'Type', sortable: true, field: "type", hide: false, headerTooltip: 'Type', lockPosition: true, suppressMenu: true, width: 150 },
                { headerName: 'Conversion Failure Reason', sortable: true, field: "failMessage", hide: false, headerTooltip: 'Conversion Failure Reason', lockPosition: true, suppressMenu: true, width: 230, tooltipField: "tooltip", cellClass: "text-wrap", autoHeight: true }
            ],
            onFirstDataRendered(params) {
                params.api.sizeColumnsToFit();
            },
            onGridSizeChanged(params) {
                params.api.sizeColumnsToFit();
            },
            getRowNodeId: function (data) {
                return data.backUpFileName;
            }
        },
        getDetailRowData: (params) => {
            this.getDetailConversionStatusList(params.data.jobId).then((response: any) => {
                if (response && Object.keys(response).length > 0) {
                    if (response.ssn) {
                        this.detailCellRendererParamsWithOutSSN.detailGridOptions.columnDefs.forEach(element => {
                            if (element.field == 'backUpFileName' || element.field == 'size' || element.field == 'uploadStatus') {
                                element.hide = true;
                            }
                        });
                    } else {
                        this.detailCellRendererParamsWithOutSSN.detailGridOptions.columnDefs.forEach(element => {
                            if (element.field == 'backUpFileName' || element.field == 'size' || element.field == 'uploadStatus') {
                                element.hide = false;
                            }
                        });
                    }
                    params.successCallback(response.returnStatistics);
                    /**
                     * listen file uploading event and update progressStatus of file to show uploading progress
                     */
                    if (this.conversionUploaderservice.resumableUpload && params.node.detailGridInfo) {
                        this.conversionUploaderservice.resumableUpload.on('fileProgress', function (file) {
                            var rowNode = params.node.detailGridInfo.api.getRowNode(file.fileName);
                            if (rowNode) {
                                rowNode.setDataValue("uploadStatus", 'In Process');
                            }
                        });

                        this.conversionUploaderservice.resumableUpload.on('fileSuccess', function (file) {
                            var rowNode = params.node.detailGridInfo.api.getRowNode(file.fileName);
                            if (rowNode) {
                                rowNode.setDataValue("uploadStatus", 'Success');
                            }
                        });

                        this.conversionUploaderservice.resumableUpload.on('complete', function (file) {
                            var rowNode = params.node.detailGridInfo.api.getRowNode(file.fileName);
                            if (rowNode) {
                                rowNode.setDataValue("uploadStatus", 'Success');
                            }
                        });

                        this.conversionUploaderservice.resumableUpload.on('fileError', function (file) {
                            var rowNode = params.node.detailGridInfo.api.getRowNode(file.fileName);
                            if (rowNode) {
                                rowNode.setDataValue("uploadStatus", 'Fail');
                            }
                        });
                    }
                } else {
                    params.successCallback([]);
                }
            }, (error) => {

            });
        }
    };

    private conversionReturnList = [];
    private getRowNodeId;

    private conversionFailureReason = [{
        status: 1,
        message: "Password Protected Files",
        tooltip: "We regret to inform you that we were unable to complete your conversion request. Your client files are password protected. Please remove the password(s), create a new backup, and try again."
    },
    {
        status: 2,
        message: "Corrupted File",
        tooltip: "We regret to inform you that we were unable to complete your conversion request. Your backup file is corrupted. Please create a new backup and try again."
    },
    {
        status: 3,
        message: "Unsupported Return Types",
        tooltip: "We regret to inform you that we were unable to complete your conversion request. The following return types are not supported: 706, 709, 990, and 1041."
    },
    {
        status: 4,
        message: "Missing Required Info",
        tooltip: "We regret to inform you that we were unable to complete your conversion request. Your client files are missing the basic required information. Please complete the required information in your previous software and try again."
    },
    {
        status: 5,
        message: "Backup Not Proper",
        tooltip: "Please retry with Proper Backup."
    },
    {
        status: 6,
        message: "Please Proforma",
        tooltip: `The Conversion Team has completed your conversion. Your converted returns will be displayed in the Recent Returns widget for Tax Year 2018. The next step is transferring your returns from Tax Year 2018 to Tax Year 2019. Simply click Proforma/Prior Year Carry Forward in the Menu on the left of the Dashboard in Tax Year 2019.
        To learn how to use the Proforma/Prior Year Carry Forward feature, please read the Instructions or watch the training video.`
    },
    {
        status: 7,
        message: "Duplicate Files",
        tooltip: `We regret to inform you that we were unable to complete your conversion request. The backup folder that you uploaded is a duplicate of a previous request. Please inform us if you would like us to proceed with your conversion. Note: If you would like us to proceed, the returns will be duplicated and displayed in the Recent Returns widget and/or Return List.`
    },
    {
        status: 8,
        message: "Conversion In Process",
        tooltip: `The Conversion Team has received your uploaded returns and are in the process of converting your clients' returns.  Based on the number of returns being uploaded for conversion, your expected time frame is as follows:
        Under 200 returns: 1 day
        200-500 returns: 2 days
        Over 500 returns: 1 week
        Please allow enough time for the conversion to be processed. You will receive an email from the Conversion Team when your request is completed.`
    }
    ];

    /** Constructor */
    constructor(
        private commonApiService: CommonAPIService,
        private conversionUploaderservice: ConversionUploaderservice,
        private convertSizePipe: ConvertSizePipe,
        private userService: UserService,
        private conversionDetailService: ConversionDetailService
    ) {
    }

    /**
      * @author Hitesh Soni
      * @date 09-08-2019
      * @readonly 
      * @returntype {Promis}
      * @memberof ConversionListService
      * @description Get ag-grid column definations
      */
    getColumnDefinations() {
        return this.columnDefs;
    }

    /**
        * @author Dhruvi shah
        * @date 22-08-2019
        * @readonly 
        * @returntype {Promis}
        * @memberof ConversionListService
        * @description Get ag-grid column sub grid definations
        */
    getColumnDetailCellDefinationsWithOutSSN() {
        return this.detailCellRendererParamsWithOutSSN;
    }

    /**
      * @author Hitesh Soni
      * @date 08-08-2019
      * @readonly 
      * @returntype {Promis}
      * @memberof ConversionListService
      * @description Get efile summary
      */
    getConversionList() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_CONVERSION_LIST }).then((response) => {
                if (response.data) {
                    this.conversionReturnList = response.data;
                    resolve(self.processDataForDisplay(response.data));
                }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * @author Dhruvi shah
     * @date 22-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof ConversionListService
     * @description Get sub grid data
     */
    getDetailConversionStatusList(returnId) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_CONVERSION_DETAIL_LIST, parameterObject: { 'cjKey': returnId } }).then((response) => {
                if (response.data && response.data.returnStatistics && response.data.returnStatistics.length > 0) {
                    resolve(self.processConversionData(response.data));
                }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /** Get name of lasted conversion software*/
    getLastedConversionsSoftware(data, property, desc = true) {
        data.sort(function (a, b) {
            if (new Date(a[property]).getTime() < new Date(b[property]).getTime())
                return desc ? 1 : -1;
            if (new Date(a[property]).getTime() > new Date(b[property]).getTime())
                return desc ? -1 : 1;
            return 0;
        });
        return data[0]["softwareName"];
    }

    /** Get previous use software */
    getPreviousSoftware() {
        let userDetails = this.userService.getUserDetails();
        let locationId = this.userService.getLocationId(true);
        let software = this.conversionDetailService.getSoftwareNames(this.userService.getTaxYear());
        if (userDetails.locations[locationId].previousSoftware) {
            let index = software.findIndex(x => x.name.toLowerCase() == userDetails.locations[locationId].previousSoftware.toLowerCase());
            if (index != -1) {
                return software[index];
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }

    /**
     * @author Hitesh Soni
     * @date 08-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof ConversionListService
     * @description Upload Close event
     */
    uploadCancel(fileList) {
        const self = this;
        let requestData = { 'cjKey': this.conversionUploaderservice.jobData.jobId, fileList: fileList };
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_CONVERSION_DETAIL_LIST, parameterObject: requestData }).then((response) => {
                if (response.data && response.data.returnStatistics && response.data.returnStatistics.length > 0) {
                    resolve(self.processConversionData(response.data));
                }
                else { resolve([]); }
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * @author Hitesh Soni
     * @date 08-08-2019
     * @readonly 
     * @returntype {object}
     * @memberof ConversionListService
     * @description Get Conversion Failure reason 
     */
    getConversionFailureReason(statusCode) {
        let index = this.conversionFailureReason.findIndex(x => x.status == statusCode);
        if (index != -1) {
            return this.conversionFailureReason[index];
        }
        else {
            return null;
        }
    }

    /**
     * @author Hitesh Soni
     * @date 08-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof ConversionListService
     * @description Process data for diaply
     */
    private processDataForDisplay(data) {
        // 2- cancel 1- success
        data.forEach(element => {
            if (element.uploadStatus) {
                if (element.uploadStatus === 2) { element.uploadStatus = 'Cancelled' }
                else if (element.uploadStatus === 1) { element.uploadStatus = 'Success' }
                else { element.uploadStatus = 'Fail' }
            }
            if (element.createdDate) {
                element.createdDateToDisplay = moment(element.createdDate).format(DEFAULT_FORMAT.DATE);
            }
            if (element.ETA) {
                element.ETAToDisplay = moment().startOf('day').minutes(element.ETA).format('HH:mm:ss');
            } else {
                element.ETAToDisplay = moment().startOf('day').minutes(0).format('HH:mm:ss');
            }

        });
        return data;
    }

    /**
     * @author Dhruvi shah
     * @date 23-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof ConversionListService
     * @description get status as string from numbers for sub grid 
     */
    private processConversionData(conversionlist) {
        // 0: Open,
        // 1.3.4 - InProcess
        // 6- success
        // 2.5 -Fail
        conversionlist.returnStatistics.forEach(element => {
            if (element.size) {
                element.sizeToDisplay = this.convertSizePipe.transform(element.size);
            }
            if (element.status == 0) {
                element.conversionStatusToDisplay = 'Open';
            } else if (element.status == 1 || element.status == 3 || element.status == 4) {
                element.conversionStatusToDisplay = 'In Process';
            } else if (element.status == 2 || element.status == 5) {
                element.conversionStatusToDisplay = 'Fail';
            } else if (element.status == 6) {
                element.conversionStatusToDisplay = 'Success';
            }
            //Set conversion fail reason with tooltip
            if (element.failureReason) {
                let reason = this.getConversionFailureReason(element.failureReason);
                if (reason) {
                    element.failMessage = reason.message;
                    element.tooltip = reason.tooltip;


                }
            }
        });
        return conversionlist;

    }

}
