// External Imports
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Internal Imports
import { ReportsService } from '@app/reports/reports.service';
import { ColDef } from 'ag-grid-community';
import { ReportsGridComponent } from '@app/reports/components/reports-grid/reports-grid.component';

@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrls: ['./view-report.component.scss']
})
export class ViewReportComponent implements OnInit, OnDestroy {

  // router subscription event
  private routerSubscription: any;

  // holds reportId to be displayed
  public reportData: { id: string, name: string, reportList: Array<any> } = { id: "", name: "Report", reportList: [] };

  // holds reports Obj that
  public reportGridData: Array<any> = [];

  // holds report grid column and row configuration in ag grid format comes from api
  public reportGridConfiguration: Array<ColDef> = [];

  // loading bar indicator
  public enableLoading: boolean = false;

  // holds filter text box ng model
  public searchTerm: string = "";

  // holds report grid component refrence
  @ViewChild("reportsGrid", { static: false }) reportsGridComponent: ReportsGridComponent;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _reportsService: ReportsService) { }

  // to navigate back to dashboard
  public gotoHome() {
    this._router.navigateByUrl("/home");
  }

  // This function is used to filter grid data using filter text box.
  public applyQuickSearch() {
    this.reportsGridComponent.applyQuickSearch(this.searchTerm);
  }

  // This function is used to call grid componenet function to download grid data in defined format.
  public export(type: string) {
    switch (type) {
      case "excel":
        this.reportsGridComponent.exportEXCEL(this.reportData.name);
        break;

      case "pdf":
        this.reportsGridComponent.exportPDF(this.reportData.name);
        break;

      default:
        break;
    }
  }

  // This function is used to change report.
  public viewReport(reportObj: any) {
    this._router.navigate(["/reports/view", reportObj.reportId]);
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to call api get data and column definations particular report.
   */
  public getReportData() {
    this.enableLoading = true;
    this._reportsService.viewReport(this.reportData.id).then((result: any) => {
      this.reportGridData = result.data;
      this.reportGridConfiguration = result.gridConfiguration;
      this.reportData.name = result.reportName;
      this.enableLoading = false;
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to get available report list.
   */
  private getAvailableReports() {
    this._reportsService.getAvailableReportList().then((response: any) => {
      this.reportData.reportList = response.predefinedReports.concat(response.customReports);
    })
  }

  public saveListSettings() {
  }

  ngOnInit() {
    this.getAvailableReports();
    this.routerSubscription = this._activatedRoute.paramMap.subscribe((params: any) => {
      this.reportData.id = params.params.reportId;
      this.getReportData();
    })
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

}
