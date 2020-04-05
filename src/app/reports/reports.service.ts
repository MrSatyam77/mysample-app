// External Imports
import { Injectable } from "@angular/core";

// Internal Imprts
import { CommonAPIService, UserService } from '@app/shared/services';
import { APINAME } from "@app/reports/reports.constants";

@Injectable({
    providedIn: 'root'
})

export class ReportsService {

    private data = {
        "reportName": "State Rejected Report",
        "gridConfiguration": [
            {
                "headerName": "OFFICE",
                "headerTooltip": "OFFICE",
                "field": "office",
                "width": 100,
                "sortable": true,
                "sort": 'asc'
            },
            {
                "headerName": "FIRST  NAME",
                "headerTooltip": "FIRST  NAME",
                "field": "firstName",
                "width": 200,
                "sortable": true
            },
            {
                "headerName": "LAST  NAME",
                "headerTooltip": "LAST  NAME",
                "field": "lastName",
                "width": 200,
                "sortable": true
            },
            {
                "headerName": "STREET ADDRESS",
                "headerTooltip": "Street Address",
                "field": "streetAddress",
                "width": 300,
                "sortable": true
            },
            {
                "headerName": "CITY",
                "headerTooltip": "CITY",
                "field": "city",
                "width": 150,
                "sortable": true
            },
            {
                "headerName": "STATE",
                "headerTooltip": "STATE",
                "field": "state",
                "width": 150,
                "sortable": true
            },
            {
                "headerName": "ZIPCODE",
                "headerTooltip": "ZIPCODE",
                "field": "zipCode",
                "width": 100,
                "sortable": true
            }
        ],
        "data": [
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" },
            { "office": "Ilink Infosoft", "firstName": "Hannan", "lastName": "Desai", "streetAddress": "1065, Park Avenue", "city": "New York", "state": "NY", "zipCode": "12345" }
        ]
    }
    constructor(
        private _commonAPIService: CommonAPIService,
        private _userService: UserService) { }

    /**
     * @author Hannan Desai
     * @param reportId 
     *          Holds reports Id of report to be viewed
     * @description
     *          This function is used to call api get data for specific report.
     */
    public viewReport(reportId: string) {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.VIEW_REPORT,
                parameterObject: { reportId: reportId }
            }).then((response: any) => {
                resolve(response.data);
                console.log(response.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
     * @author Hannan Desai
     * @description
     *          This function is used to call API get report list.
     */
    public getReportList() {
        return new Promise((resolve, reject) => {
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GET_REPORT_LIST,
                originKey: "report_url"
            }).then((result) => {
                resolve(result.data);
            }, (error) => {
                reject(error);
            })
        })
    }

    /**
* @author Heena Bhesaniya
* @param id report id
* @description this api is used to get specific report data
*/
    public getReportDataById(id: string) {
        return new Promise((resolve, reject) => {
            //get report data
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GETREPORTBYID,
                methodType: 'post',
                parameterObject: { 'reportId': id }
            }).then((response: any) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
    * @author Heena Bhesaniya
    * @param reportData whole report data 
    * @description save report data
    */
    public saveReportData(reportData) {
        return new Promise((resolve, reject) => {
            //remove device
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.SAVEREPORT,
                methodType: 'post',
                parameterObject: reportData,
            }).then((response: any) => {
                resolve(response.data.data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
    * @author Heena Bhesaniya
    * @param reportData whole report data 
    * @description save report data
    */
    public updateReportData(reportData) {
        return new Promise((resolve, reject) => {
            //remove device
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.UPDATEREPORT,
                methodType: 'post',
                parameterObject: reportData,
            }).then((response: any) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
    * @author Heena Bhesaniya
    * @param reportData 
    * @description get report list
    */
    public getAvailableReportList() {
        return new Promise((resolve, reject) => {
            //remove device
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GETREPORTLIST,
                methodType: 'post',
                parameterObject: {}
            }).then((response: any) => {
                // filter custom reports based on associated users if user is not a firm administrator.
                if (!this._userService.getValue("isAdministrator")) {
                    response.data.customReports = response.data.customReports.filter((obj) => {
                        return obj.associatedUsers && obj.associatedUsers.indexOf(this._userService.getValue("emailHash")) >= 0
                    })
                }
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
    * @author Heena Bhesaniya
    * @param reportData 
    * @description get field list
    */
    public getFieldList() {
        return new Promise((resolve, reject) => {
            //remove device
            this._commonAPIService.getPromiseResponse({
                apiName: APINAME.GETFIELDLIST,
                methodType: 'post',
                parameterObject: {}
            }).then((response: any) => {
                resolve(response.data);
            }, (error) => {
                reject(error);
            });
        });
    }
}