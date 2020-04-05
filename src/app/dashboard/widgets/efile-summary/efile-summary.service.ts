/** Internal import */
import { Injectable } from "@angular/core";
/** Internal import */
import { IEFileSummaryCoulmnsSize } from '@app/dashboard/dashboard.model';
import { CommonAPIService } from '@app/shared/services';
import { APINAME } from '@app/dashboard/dashboard.constants';
import { IBarChart } from '@app/chart/bar-chart/barchart';

@Injectable()
export class EFileSummaryService {
    /** Column filed name and display text */
    readonly columns: IEFileSummaryCoulmnsSize = {
        'one': [
            {
                fieldName: 'notTransmitted',
                displayText: 'Not Transmitted',
                graphXAxisLabel: 'Not\nTransmitted',
                color: "#000000",
                link: '/return/list',
                displayOrder: 1,
                filter: 'notTransmitted'
            },
            {
                fieldName: 'transmitted',
                displayText: 'Transmitted',
                graphXAxisLabel: 'Transmitted',
                color: "#4472C4",
                displayOrder: 3,
                link: '/eFile/list',
                filter: 'Transmitted'
            }, {
                fieldName: 'atIrs',
                displayText: 'At IRS',
                graphXAxisLabel: 'At IRS',
                color: "#00FFCC",
                displayOrder: 4,
                link: '/eFile/list',
                filter: 'AtIRS'
            }, {
                fieldName: 'atState',
                displayText: 'At State',
                graphXAxisLabel: 'At State',
                color: "#00FFCC",
                displayOrder: 5,
                link: '/eFile/list',
                filter: 'AtState'
            },
            {
                fieldName: 'atBank',
                displayText: 'At Bank',
                graphXAxisLabel: 'At Bank',
                color: "#00FFCC",
                displayOrder: 6,
                link: '/eFile/list/bank',
                filter: 'AtBank'
            },
            {
                fieldName: 'rejected',
                displayText: 'Rejected',
                graphXAxisLabel: 'Rejected',
                color: "#FF0000",
                displayOrder: 7,
                link: '/eFile/list',
                filter: 'Rejected'
            },
            {
                fieldName: 'accpeted',
                displayText: 'Accepted',
                graphXAxisLabel: 'Accepted',
                color: "#00B050",
                displayOrder: 8,
                link: '/eFile/list',
                filter: 'Accepted'
            },
            {
                fieldName: 'alerts',
                displayText: 'IRS Alerts Messages',
                graphXAxisLabel: 'IRS Alerts \n Messages',
                color: "#FFC000",
                displayOrder: 9,
                link: '/eFile/list',
                filter: 'IRS Alerts'
            }
        ],
        'two': [
            {
                fieldName: 'notTransmitted',
                displayText: 'Not Transmitted',
                graphXAxisLabel: 'Not\nTransmitted',
                color: "#000000",
                link: '/return/list',
                displayOrder: 1,
                filter: 'notTransmitted'
            },
            {
                fieldName: 'transmitted',
                displayText: 'Transmitted',
                graphXAxisLabel: 'Transmitted',
                color: "#4472C4",
                displayOrder: 3,
                link: '/eFile/list',
                filter: 'Transmitted'
            }, {
                fieldName: 'atIrs',
                displayText: 'At IRS',
                graphXAxisLabel: 'At IRS',
                color: "#00FFCC",
                displayOrder: 4,
                link: '/eFile/list',
                filter: 'AtIRS'
            }, {
                fieldName: 'atState',
                displayText: 'At State',
                graphXAxisLabel: 'At State',
                color: "#00FFCC",
                displayOrder: 5,
                link: '/eFile/list',
                filter: 'AtState'
            },
            {
                fieldName: 'atBank',
                displayText: 'At Bank',
                graphXAxisLabel: 'At Bank',
                color: "#00FFCC",
                displayOrder: 6,
                link: '/eFile/list/bank',
                filter: 'AtBank'
            },
            {
                fieldName: 'rejected',
                displayText: 'Rejected',
                graphXAxisLabel: 'Rejected',
                color: "#FF0000",
                displayOrder: 7,
                link: '/eFile/list',
                filter: 'Rejected'
            },
            {
                fieldName: 'accpeted',
                displayText: 'Accepted',
                graphXAxisLabel: 'Accepted',
                color: "#00B050",
                displayOrder: 8,
                link: '/eFile/list',
                filter: 'Accepted'
            },
            {
                fieldName: 'alerts',
                displayText: 'IRS Alerts Messages',
                graphXAxisLabel: 'IRS Alerts\nMessages',
                color: "#FFC000",
                displayOrder: 9,
                link: '/eFile/list',
                filter: 'IRS Alerts'
            }
        ]
    };

    constructor(private commonApiService: CommonAPIService) { }

    /**
     * @author Hitesh Soni
     * @date 02-08-2019
     * @readonly 
     * @returntype {IeFileSummaryCoulmnsSize}
     * @memberof EFileSummaryService
     * @description get column size
     */
    public get ColumnSize(): IEFileSummaryCoulmnsSize {
        return this.columns;
    }

    /**
     * @author Hitesh Soni
     * @date 05-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof EFileSummaryService
     * @description Get efile summary
     */
    getEFileSummary() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_EFILE_SUMMARY }).then((response) => {
                resolve(response);
            }, (error) => {
                reject(error);
            });
        });
    }

    /**
     * @author Hitesh Soni
     * @date 06-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof EFileSummaryService
     * @description Prepare default chart options
     */
    prepareDefaultChartOption() {
        let chartOptions: IBarChart = {
            xProperty: { filedName: "displayText" },
            yProperties: [{ filedName: "value", barColor: "color" }],
            noDataMessage: "no data found",
            options: { header: { text: "E-File Summary", show: false } },
            showXAxis: true
        };
        return chartOptions;
    }

    /**
     * @author Hitesh Soni
     * @date 06-08-2019
     * @readonly 
     * @returntype {Promis}
     * @memberof EFileSummaryService
     * @description Prepare chart data
     */
    prepareChartData(data: any) {
        let chartData = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                let filterData = this.columns.two.filter(x => x.fieldName == key);
                if (filterData.length > 0) {
                    chartData.push({ displayText: filterData[0].graphXAxisLabel, value: data[key], color: filterData[0].color, displayOrder: filterData[0].displayOrder });
                }
            }
        }
        return chartData.sort((item1, item2) => item1.displayOrder - item2.displayOrder);
    }
}