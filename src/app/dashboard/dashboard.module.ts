import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpgradeModule } from "@angular/upgrade/static";
import { RouterModule } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { setUpLocationSync } from "@angular/router/upgrade";
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { NgxMaskModule } from 'ngx-mask'


import { GridStackModule } from '../grid-stack';
import { ChartModule } from "../chart/chart.module";
import { DashboardService } from './dashboard.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardSettingsComponent } from './widgets/dashboard-settings/dashboard-settings.component';
import { ToolboxComponent } from './widgets/toolbox/toolbox.component';
import { HiddenWidgetComponent } from './widgets/hidden-widget/hidden-widget.component';
import { YourFirmComponent } from './widgets/your-firm/your-firm.component';
import { MytaxportalComponent } from './widgets/mytaxportal/mytaxportal.component';
import { FinancialProductsComponent } from './widgets/financial-products/financial-products.component';
import { RejectedReturnComponent } from './widgets/rejected-return/rejected-return.component';
import { ReturnSummaryComponent } from './widgets/return-summary/return-summary.component';
import { EfileSummaryComponent } from './widgets/efile-summary/efile-summary.component';
import { NewsSummaryComponent } from './widgets/news-summary/news-summary.component';
import { QuickReturnSummaryComponent } from './widgets/quick-return-summary/quick-return-summary.component';
import { BankApplicationSummaryComponent } from './widgets/bank-application-summary/bank-application-summary.component';
import { ToDoSummaryComponent } from './widgets/to-do-summary/to-do-summary.component';
import { AppointmentListComponent } from './widgets/appointment-list/appointment-list.component';
import { ReturnSummaryFilterDialog } from './dialogs/return-summary-filter/return-summary-filter.component';
import { TutorialInfoDialogComponent } from '@app/dashboard/dialogs/tutorial-info/tutorial-info.component';
import { DialogService } from '@app/shared/services';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardSettingsComponent,
    RejectedReturnComponent,
    ToolboxComponent,
    HiddenWidgetComponent,
    YourFirmComponent,
    MytaxportalComponent,
    FinancialProductsComponent,
    ReturnSummaryComponent,
    EfileSummaryComponent,
    NewsSummaryComponent,
    QuickReturnSummaryComponent,
    BankApplicationSummaryComponent,
    ToDoSummaryComponent,
    AppointmentListComponent,
    ReturnSummaryFilterDialog,
    TutorialInfoDialogComponent
  ],
  imports: [
    CommonModule,
    UpgradeModule,
    GridStackModule,
    ChartModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DashboardRoutingModule,
    KeyboardShortcutsModule.forRoot(),
    NgxMaskModule.forRoot(),
  ],
  providers: [DialogService, DashboardService],
  entryComponents: [ReturnSummaryFilterDialog, TutorialInfoDialogComponent]
})
export class DashboardModule {
  constructor(private _upgrade: UpgradeModule) {
    // this._upgrade.bootstrap(document.documentElement, ["taxApp"]);
    // setUpLocationSync(this._upgrade);
    // let auth = this._upgrade.injector.get("authService");
  }
}
