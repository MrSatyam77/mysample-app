// External Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '@app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

//Internal Imports
import { CustomReportEditComponent } from '@app/reports/custom-report-edit/custom-report-edit.component';
import { CustomReportListComponent } from '@app/reports/custom-report-list/custom-report-list.component';
import { ReportsRoutingModule } from '@app/reports/reports-routing.module';
import { ViewReportComponent } from '@app/reports/view-report/view-report.component';
import { ReportsGridComponent } from '@app/reports/components/reports-grid/reports-grid.component';

@NgModule({
  declarations: [
    CustomReportEditComponent,
    CustomReportListComponent,
    ViewReportComponent,
    ReportsGridComponent
  ],
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CoreModule,
  ]
})
export class ReportsModule { }
