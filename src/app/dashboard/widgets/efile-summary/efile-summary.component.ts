/** External import */
import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

/** Internal import */
import { EFileSummaryService } from "./efile-summary.service";
import { IWidgetSize } from '@app/dashboard/dashboard.model';
import { IBarChart } from '@app/chart/bar-chart/barchart';
import { BarChartComponent } from '@app/chart/bar-chart/bar-chart.component';
import { eFileSumaryListService, BankRejectionService, BasketService, UserService } from '@app/shared/services';


@Component({
  selector: 'app-efile-summary',
  templateUrl: './efile-summary.component.html',
  styleUrls: ['./efile-summary.component.scss'],
  providers: [EFileSummaryService]
})
export class EfileSummaryComponent implements OnInit, OnChanges {
  @Input() columnConfig: IWidgetSize;
  @Input() rowColor: any;
  @ViewChild("eFileSummaryChart", { static: false }) public eFileSummaryChart: BarChartComponent;
  columns: any;// to hold column object values from service
  eFileSummaryDisplayData: any = [];//Store efile summary data
  chartOptions: IBarChart;

  private maxColumnSize: number = 3;
  private eFileSummary: any;
  constructor(private userService: UserService, private basketService: BasketService, private bankRejectionService: BankRejectionService, private eFileSummaryService: EFileSummaryService, private router: Router, private eFileSumaryListService: eFileSumaryListService) { }

  /**
   * @author Hitesh Soni
   * @date 05-08-2019
   * @readonly 
   * @returntype {void}
   * @memberof EfileSummaryComponent
   * @description Get efile summary data to API
   */
  getEFileSummaryData() {
    return new Promise((resolve, reject) => {
      this.eFileSummaryService.getEFileSummary().then((response: any) => {
        if (response.data) {
          this.eFileSummary = response.data;
          // this.eFileSummary = {
          //   "transmitted": 10,
          //   "notTransmitted": 20,
          //   "atIrs": 50,
          //   "atState": 22,
          //   "accpeted": 30,
          //   "rejected": 36,
          //   "cancelled": 45,
          //   "alerts": 100,
          //   "atBank": 12,
          //   "batched": 85,
          //   "atAgency": 70
          // };
          this.prearedEFileSummaryData()

          resolve();
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author Hitesh Soni
   * @date 05-08-2019
   * @readonly 
   * @returntype {void}
   * @memberof EfileSummaryComponent
   * @description Prepared data for efile summary
   */
  private prearedEFileSummaryData() {
    let counter = 0;
    this.eFileSummaryDisplayData = [];
    while (counter <= this.columns[this.columnConfig.columnNumber].length) {
      let firstcolumn = this.columns[this.columnConfig.columnNumber].slice(counter, counter + this.maxColumnSize);
      let fisrtColumnData = [];
      for (const key in this.eFileSummary) {
        if (this.eFileSummary.hasOwnProperty(key)) {
          let index = firstcolumn.findIndex(x => x.fieldName == key && x.fieldName != 'atAgency');
          if (index != -1) {
            fisrtColumnData.push({ "displayText": firstcolumn[index].displayText, value: this.eFileSummary[firstcolumn[index].fieldName], displayOrder: firstcolumn[index].displayOrder, filter: firstcolumn[index].filter, link: firstcolumn[index].link });
          }
        }
      }
      this.eFileSummaryDisplayData.push(fisrtColumnData.sort((item1, item2) => item1.displayOrder - item2.displayOrder));
      counter = counter + this.maxColumnSize;
    }
    if (this.columnConfig.columnNumber == "two") {
      this.chartOptions.data = this.eFileSummaryService.prepareChartData(this.eFileSummary);
      setTimeout(() => {
        this.eFileSummaryChart.draw();
      });
    }
  }

  public gotoList(filter, link) {
    if (filter) {
      if (filter === 'notTransmitted') {
        this.basketService.pushItem('returnListExternalFilter', 'notTransmitted');
      } else {
        this.eFileSumaryListService.filterChanged(filter);
        this.bankRejectionService.filterChanged(filter);
      }
      this.router.navigateByUrl(link);
    } else if (link) {
      this.router.navigateByUrl(link);
    }
  }

  /**
   * @author Hitesh Soni
   * @date 05-08-2019
   * @readonly 
   * @returntype {void}
   * @memberof EfileSummaryComponent
   * @description Detect changes on columnName changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.columns && changes.columnConfig.currentValue && changes.columnConfig.currentValue.columnNumber !== changes.columnConfig.previousValue.columnNumber) {
      this.prearedEFileSummaryData();
    }
  }

  /**
   * @author Hitesh Soni
   * @date 05-08-2019
   * @readonly 
   * @returntype {void}
   * @memberof EfileSummaryComponent
   * @description initialize data
   */
  ngOnInit() {
    this.columns = this.eFileSummaryService.ColumnSize;
    this.chartOptions = this.eFileSummaryService.prepareDefaultChartOption();
    if (this.userService.can('CAN_GET_EFILE_LIST')) {
      this.getEFileSummaryData();
    }
  }
}
