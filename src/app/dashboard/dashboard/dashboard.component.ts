import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ShortcutInput, ShortcutEventOutput } from "ng-keyboard-shortcuts";
import { Subscription } from 'rxjs';

import { GridStackItemComponent, GridStackComponent } from 'src/app/grid-stack';
import { IDashboardWidgetOption, IRefreshOption, IWidgetColumnConfiguration } from '../dashboard.model';
import { DashboardService } from '../dashboard.service';
import { RejectedReturnComponent } from '../widgets/rejected-return/rejected-return.component';
import { ReturnSummaryComponent } from '../widgets/return-summary/return-summary.component';
import { FinancialProductsComponent } from '../widgets/financial-products/financial-products.component';
import { UserService, ResellerService, CommunicationService, MessageService, UtilityService, IntroService, DialogService } from '@app/shared/services';
import { FinancialProductsService } from '@app/dashboard/widgets/financial-products/financial-products.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { AppointmentListComponent } from '../widgets/appointment-list/appointment-list.component';
import { EfileSummaryComponent } from '../widgets/efile-summary/efile-summary.component';
import { QuickReturnSummaryComponent } from '@app/dashboard/widgets/quick-return-summary/quick-return-summary.component';
import { NewsSummaryComponent } from '../widgets/news-summary/news-summary.component';
import { TutorialInfoDialogComponent } from '../dialogs/tutorial-info/tutorial-info.component';
import { RatingService } from "@app/ratings/rating.service";
import { RatingsConfirmationComponent } from "@app/ratings/dialog/ratings-confirmation/ratings-confirmation.component";
import { environment } from '@environments/environment';
import { NewFeatureUpdateComponent } from '@app/shared/components/new-feature-update/new-feature-update.component';

declare var introJs: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  // Screen Breakpoint
  private minWidth: number = 992;
  //hold subscription object
  private dashboardSubscription: Subscription;
  private routeSubscription: Subscription;

  private params: any;

  // Shortcuts
  public shortcuts: ShortcutInput[] = [];

  // Columns
  private columnArray = ['one', 'two', 'three', 'four'];

  // Permission & Features
  public permission: any = {};
  public features: any = {};

  //for quick return summery
  public maskType: string = "SSN";
  public ssnorein: string = '';
  public taxMaskId: string = "000-00-0000"
  public showMask: boolean = true;
  public reloadQuickReturnSummery: boolean = false;
  //hold taxYear
  public taxYear: string;

  // Widget Options Variables
  public widgetsOptions: IDashboardWidgetOption;
  public hiddenWidgets: IDashboardWidgetOption[] = [];
  private preserveWidgetOption: IDashboardWidgetOption;
  public isSettingsEnabled: boolean = false;
  public columnConfiguration: IWidgetColumnConfiguration = {
    returnSummary: {},
    efileSummary: {},
    newsSummary: {},
    quickReturnSummary: {},
    // bankApplicationSummary: {},
    // toDoSummary: {},
    rejectedReturns: {},
    appointmentList: {},
    yourFirm: {},
    myTaxPortal: {},
    financialProducts: {},
    // toolBox: {},
    hiddenWidgets: {},
  };
  public refresh: IRefreshOption = {
    rejectedReturnComponent: false,
    returnSummaryComponent: false,
    financialProductsComponent: false,
    appointmentListComponent: false,
    eFileSummaryComponent: false,
    newsSummaryComponent: false,
  };

  public hiddenStep: Array<string>;

  public userDetails: any;

  // Main Grid Stack
  @ViewChild('gridStackMain', { static: false }) gridStackMain: GridStackComponent;

  // Widget Item
  @ViewChild('returnSummaryWidgets', { static: false }) returnSummaryWidgets: GridStackItemComponent;
  @ViewChild('efileSummaryWidgets', { static: false }) efileSummaryWidgets: GridStackItemComponent;
  @ViewChild('newsSummaryWidgets', { static: false }) newsSummaryWidgets: GridStackItemComponent;
  @ViewChild('quickReturnSummaryWidgets', { static: false }) quickReturnSummaryWidgets: GridStackItemComponent;
  // @ViewChild('bankApplicationSummaryWidgets', { static: false }) bankApplicationSummaryWidgets: GridStackItemComponent;
  // @ViewChild('toDoSummaryWidgets', { static: false }) toDoSummaryWidgets: GridStackItemComponent;
  @ViewChild('rejectedReturnsWidgets', { static: false }) rejectedReturnsWidgets: GridStackItemComponent;
  @ViewChild('appointmentListWidgets', { static: false }) appointmentListWidgets: GridStackItemComponent;
  @ViewChild('yourFirmWidgets', { static: false }) yourFirmWidgets: GridStackItemComponent;
  @ViewChild('myTaxPortalWidgets', { static: false }) myTaxPortalWidgets: GridStackItemComponent;
  @ViewChild('financialProductsWidgets', { static: false }) financialProductsWidgets: GridStackItemComponent;
  // @ViewChild('toolBoxWidgets', { static: false }) toolBoxWidgets: GridStackItemComponent;
  @ViewChild('hiddenWidgetsWidgets', { static: false }) hiddenWidgetsWidgets: GridStackItemComponent;

  // Widgets Component
  @ViewChild('rejectedReturnComponent', { static: false }) rejectedReturn: RejectedReturnComponent;
  @ViewChild('recentReturnComponent', { static: false }) recentReturn: ReturnSummaryComponent;
  @ViewChild('financialProductsComponent', { static: false }) financialProductsComponent: FinancialProductsComponent;
  @ViewChild('appointmentListComponent', { static: false }) appointmentListComponent: AppointmentListComponent;
  @ViewChild('eFileSummaryComponent', { static: false }) eFileSummaryComponent: EfileSummaryComponent;
  @ViewChild('quickReturnSummerycomponent', { static: false }) quickReturnSummerycomponent: QuickReturnSummaryComponent;
  @ViewChild('newsSummaryComponent', { static: false }) newsSummaryComponent: NewsSummaryComponent;


  // Widget Popover
  @ViewChild('returnSummary', { static: false }) returnSummary: NgbPopover;
  @ViewChild('efileSummary', { static: false }) efileSummary: NgbPopover;
  @ViewChild('newsSummary', { static: false }) newsSummary: NgbPopover;
  @ViewChild('quickReturnSummary', { static: false }) quickReturnSummary: NgbPopover;
  // @ViewChild('bankApplicationSummary', { static: false }) bankApplicationSummary: NgbPopover;
  // @ViewChild('toDoSummary', { static: false }) toDoSummary: NgbPopover;
  @ViewChild('rejectedReturns', { static: false }) rejectedReturns: NgbPopover;
  @ViewChild('appointmentList', { static: false }) appointmentList: NgbPopover;
  @ViewChild('yourFirm', { static: false }) yourFirm: NgbPopover;
  @ViewChild('myTaxPortal', { static: false }) myTaxPortal: NgbPopover;
  @ViewChild('financialProducts', { static: false }) financialProducts: NgbPopover;
  // @ViewChild('toolBox', { static: false }) toolBox: NgbPopover;
  isClientPortalFeatureEnable: boolean;


  constructor(private systemConfigService: SystemConfigService, private utilService: UtilityService, private _activatedRoute: ActivatedRoute, private dashboardService: DashboardService, private communicationService: CommunicationService, private router: Router, private userService: UserService, private resellerService: ResellerService, private messageService: MessageService, private utilityService: UtilityService, private introService: IntroService, private dialogService: DialogService, private _ratingService: RatingService, private financialProductsService: FinancialProductsService) { }

  /**
     * Calculate Height on Window Resize and get the column configuration
     * @param {*} event Resize Event
     * @memberof GridStackComponent
     */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.widgetsOptions) {
      for (let widgetName in this.columnConfiguration) {
        this.columnConfiguration[widgetName] = this.getColumnConfiguration(widgetName);
      }
      // View Doesn't get Updated
      setTimeout(() => {
        this.calculateHeight();
      }, 1);
    }
  }

  /**
   * set mask type
   */
  setMaskId() {
    if (this.maskType == "SSN") {
      this.taxMaskId = "000-00-0000";
      this.showMask = true;
    } else if (this.maskType == "EIN") {
      this.taxMaskId = "00-0000000"
      this.showMask = true;
    } else if (this.maskType == "Phone") {
      this.taxMaskId = "(000)000-0000";
      this.showMask = true;
    } else {
      this.taxMaskId = undefined;
      this.showMask = false;
    }
    this.ssnorein = undefined;
  }

  /**
  * @author Mansi Makwana
  * @description open return summary filter dialog
  */
  openFilterDialog() {
    this.recentReturn.openFilterDialog();
  }

  /**
   * @author Ravi Shah
   * Get Instance of the Widgets
   * @param {string} widgetName
   * @returns {GridStackItemComponent}
   * @memberof DashboardComponent
   */
  getWidgetInstance(widgetName: string): GridStackItemComponent {
    switch (widgetName) {
      case 'returnSummary':
        return this.returnSummaryWidgets;
      case 'efileSummary':
        return this.efileSummaryWidgets;
      case 'newsSummary':
        return this.newsSummaryWidgets;
      case 'quickReturnSummary':
        return this.quickReturnSummaryWidgets;
      // case 'bankApplicationSummary':
      //   return this.bankApplicationSummaryWidgets;
      // case 'toDoSummary':
      //   return this.toDoSummaryWidgets;
      case 'rejectedReturns':
        return this.rejectedReturnsWidgets;
      case 'appointmentList':
        return this.appointmentListWidgets;
      case 'yourFirm':
        return this.yourFirmWidgets;
      case 'myTaxPortal':
        return this.myTaxPortalWidgets;
      case 'financialProducts':
        return this.financialProductsWidgets;
      // case 'toolBox':
      //   return this.toolBoxWidgets;
      case 'hiddenWidgets':
        return this.hiddenWidgetsWidgets;
      default:
        console.error("Wrong Widgets Name");
        return;
    }
  }

  /**
   * @author Ravi Shah
   * Purpose of this function is to preview the color of the widget
   * @param {*} dataItem
   * @memberof DashboardComponent
   */
  changeColor(dataItem: any) {
    this.widgetsOptions[dataItem.name].backgroundColor = dataItem.backgroundColor;
    this.widgetsOptions[dataItem.name].foregroundColor = dataItem.colorCode;
    this.widgetsOptions[dataItem.name].rowColor = dataItem.rowColor;
    let widgets = this.getWidgetInstance(dataItem.name);
    widgets.update(this.widgetsOptions[dataItem.name].x, this.widgetsOptions[dataItem.name].y, this.widgetsOptions[dataItem.name].width, this.widgetsOptions[dataItem.name].height, this.widgetsOptions[dataItem.name].backgroundColor, this.widgetsOptions[dataItem.name].foregroundColor);
  }

  /**
   * @author Ravi Shah
   * This function will save the dashboard settings to the database by calling the api
   * @param {*} dataItem
   * @memberof DashboardComponent
   */
  public saveSettings(dataItem) {
    this.widgetsOptions[dataItem.name].backgroundColor = dataItem.settings.backgroundColor;
    this.widgetsOptions[dataItem.name].width = dataItem.settings.width;
    this.widgetsOptions[dataItem.name].height = dataItem.settings.height;
    this.widgetsOptions[dataItem.name].rowColor = dataItem.settings.rowColor;
    let widgets = this.getWidgetInstance(dataItem.name);
    if (dataItem.settings.hide) {
      delete dataItem.settings.hide
      this.widgetsOptions[dataItem.name].visible = false;
      this.initializeHiddenWidget();
      this.gridStackMain.removeWidget(widgets);
    }
    if (!this.widgetsOptions[dataItem.name].locked) {
      this.gridStackMain.updateSize(widgets);
    }
    this.columnConfiguration[dataItem.name] = {
      columnNumber: dataItem.settings.columnNumber,
      count: dataItem.settings.count
    };
    this.calculateHeight();
    this[dataItem.name].close();
    this.saveDashboardSettings(false);
  }

  /**
   * @author Ravi Shah
   * Call API to Update Widget Settings
   * @memberof DashboardComponent
   */
  saveDashboardSettings(redirect: boolean) {
    return new Promise((resolve, reject) => {
      this.dashboardService.saveUserDashboardSettings(this.widgetsOptions, this.params.rightModel, this.params.locationId).then(() => {
        this.messageService.showMessage('Dashboard setting change successfully.', 'success');
        this.preserveWidgetOption = JSON.parse(JSON.stringify(this.widgetsOptions));
        if (redirect) {
          this.router.navigate(['preferences', 'user', 'dashboard']);
        }
        resolve(true);
      }, (error) => {
        this.messageService.showMessage('Error while changing the dashboard settings', 'error');
        resolve(false);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Call API to Restore Widget Settings
   * @memberof DashboardComponent
   */
  resetDashboardSettings() {
    this.widgetsOptions = undefined;
    this.dashboardService.resetUserDashboardSettings(this.widgetsOptions, this.params.rightModel, this.params.locationId).then((result) => {
      this.messageService.showMessage('Dashboard setting reset successfully.', 'success');
      this.preserveWidgetOption = undefined;
      this.router.navigate(['preferences', 'user', 'dashboard']);
    }, (error) => {
      this.messageService.showMessage('Error while resetting the dashboard settings', 'error');
      this.widgetsOptions = JSON.parse(JSON.stringify(this.preserveWidgetOption));
    });
  }

  /**
   * @author Ravi Shah
   * Revert the Setting on the Click on Cancel in the Menu
   * @param {string} widgetName
   * @memberof DashboardComponent
   */
  public revertSettings(widgetName: string) {
    this.widgetsOptions[widgetName] = JSON.parse(JSON.stringify(this.preserveWidgetOption[widgetName]));
    let widgets = this.getWidgetInstance(widgetName);
    widgets.update(this.widgetsOptions[widgetName].x, this.widgetsOptions[widgetName].y, this.widgetsOptions[widgetName].width, this.widgetsOptions[widgetName].height, this.widgetsOptions[widgetName].backgroundColor, this.widgetsOptions[widgetName].foregroundColor)
    this.initializeHiddenWidget();
    this[widgetName].close();
  }

  /**
   * @author Ravi Shah
   * Unhide the widget on the click of hidden widget item
   * @param {string} widgetName
   * @memberof DashboardComponent
   */
  public unhideWidget(widgetName: string) {
    this.widgetsOptions[widgetName].visible = true;
    let widgets = this.getWidgetInstance(widgetName);
    this.initializeHiddenWidget();
    this.gridStackMain.addWidget(widgets);
    this.saveDashboardSettings(false);
  }

  /**
   * @author Ravi Shah
   * Initialize Dashboard Widgets
   * @memberof DashboardComponent
   */
  private initializeHiddenWidget() {
    this.hiddenWidgets = [];
    this.hiddenStep = [];
    const introStepWithWidget = this.dashboardService.introStepInfo;
    for (let widget in this.widgetsOptions) {
      if (!this.widgetsOptions[widget].visible) {
        if (this.gridStackMain) {
          let widgets = this.getWidgetInstance(widget);
          this.gridStackMain.removeWidget(widgets);
        }
        this.hiddenWidgets.push(this.widgetsOptions[widget]);
        if (introStepWithWidget[widget]) {
          for (const step of introStepWithWidget[widget]) {
            this.hiddenStep.push('#' + step);
          }
        }
      }
    }
  }

  private defaultDashboard() {
    this.widgetsOptions = this.dashboardService.defaultWidgetOptions;
    if (this.isSettingsEnabled) {
      let settings = this.dashboardService.widgetMapping;
      for (let key in settings) {
        this.widgetsOptions[key] = Object.assign(this.widgetsOptions[key], settings[key]);
        let columnConfig = this.getColumnConfiguration(key);
        this.widgetsOptions[key] = Object.assign(this.widgetsOptions[key], columnConfig);
        this.columnConfiguration[key] = columnConfig;
        this.widgetsOptions[key].noResize = true;
      }
      this.preserveWidgetOption = JSON.parse(JSON.stringify(this.widgetsOptions));
      const self = this;
      setTimeout(() => {
        self.initializeHiddenWidget();
        self.calculateHeight();
      }, 1);
    } else {
      for (let key in this.widgetsOptions) {
        this.columnConfiguration[key] = this.getColumnConfiguration(key);
        this.widgetsOptions[key].noMove = true;
        this.widgetsOptions[key].noResize = true;
      }
      const self = this;
      setTimeout(() => {
        self.calculateHeight();
      }, 1);
    }
  }

  /**
   * @author Ravi Shah
   * @date 19th July 2019
   * Initializing the Dashboard Widget Configuration according to User by API call
   * @private
   * @memberof DashboardComponent
   */
  private initializeDashboardWidgets() {
    let obj = { rightModel: this.params.rightModel, locationId: this.params.locationId }
    this.dashboardService.getUserDashboardSettings(obj).then((result) => {

      for (let widgets in this.dashboardService.defaultWidgetOptions) {
        if (!result[widgets]) {
          result[widgets] = this.dashboardService.defaultWidgetOptions[widgets];
        }
      }

      //call bank service to get enrollment data if not visible
      if (!(result.financialProducts && result.financialProducts.visible) && this.permission.canGetBankStatus) {
        this.financialProductsService.getBankProducts();
      }

      // result = this.dashboardService.defaultWidgetOptions;
      let homeKeepingField = ['isDeleted', 'deletedBy', 'CreatedDate', 'UpdatedDate', 'UpdatedBy', 'createdBy'];
      for (let field of homeKeepingField) {
        delete result[field];
      }
      this.widgetsOptions = result;
      if (this.isSettingsEnabled) {
        let settings = this.dashboardService.widgetMapping;
        for (let key in settings) {
          this.widgetsOptions[key] = Object.assign(this.widgetsOptions[key], settings[key]);
          let columnConfig = this.getColumnConfiguration(key);
          this.widgetsOptions[key] = Object.assign(this.widgetsOptions[key], columnConfig);
          this.columnConfiguration[key] = columnConfig;
          this.widgetsOptions[key].noResize = true;
          if (key === 'hiddenWidgets') {
            this.widgetsOptions[key].visible = true;
          }
        }
        this.preserveWidgetOption = JSON.parse(JSON.stringify(this.widgetsOptions));
        const self = this;
        setTimeout(() => {
          self.initializeHiddenWidget();
          self.calculateHeight();
        }, 1);
      } else {
        for (let key in this.widgetsOptions) {
          this.columnConfiguration[key] = this.getColumnConfiguration(key);
          this.widgetsOptions[key].noMove = true;
          this.widgetsOptions[key].noResize = true;
          if (key === 'hiddenWidgets') {
            this.widgetsOptions[key].visible = false;
          }
        }
        const self = this;
        setTimeout(() => {
          self.initializeHiddenWidget();
          self.calculateHeight();
          self.introJsInit();
          if (this.userService.getUpdateNewFeatureFlag() != true) {
            self.openNewFeatureUpdateDialog();
          } else {
            self.getAskRating();
          }
        }, 1);
      }
    }, error => {
      this.messageService.showMessage('Error while getting the dashboard settings', 'error');
    });
  }

  /**
   * @author Heena Bhesaniya
   */
  openNewFeatureUpdateDialog() {
    if (this.userService.getUpdateNewFeatureFlag() != true) {
      this.dialogService.custom(NewFeatureUpdateComponent, {}, {});
    }
  }

  /**
   * @author Ravi Shah
   * Get the column Configuration of the Widgets
   * @param {string} widgetName
   * @returns
   * @memberof DashboardComponent
   */
  getColumnConfiguration(widgetName: string) {
    let ratio = this.dashboardService.widgetRatioSize;
    if (this.widgetsOptions[widgetName]) {
      this.widgetsOptions[widgetName].rowColor = this.colorLuminance(this.widgetsOptions[widgetName].backgroundColor)
      if (window.innerWidth > this.minWidth) {
        let width = this.widgetsOptions[widgetName].width;
        let height = this.widgetsOptions[widgetName].height;
        return ratio[widgetName].find(t => t.size.width === width && t.size.height === height);
      } else {
        return ratio[widgetName].find(t => t.id === 'mobile');
      }
    }
  }
  /**
   * @author Om Kanada
   * function used to decide hide or show mytaxportal widget on based on taxyear,vita user and hasFeature
   * @memberof DashboardComponent
   */
  initialCheckHideOrMyTaxPortalWidget(): void {
    const userTaxYear = this.userService.getTaxYear().toString();
    const userDetails = this.userService.getUserDetails();
    const hasFeature = this.resellerService.hasFeature('MYTAXPORTAL');
    let isVitaCustomer = false;
    if (userDetails && userDetails.masterLocationId === this.systemConfigService.getVitaCustomerLocation()) {
      isVitaCustomer = true;
    }
    // check weather return can disable for offline mode
    if (userTaxYear === '2018' && isVitaCustomer !== true && hasFeature) {
      this.isClientPortalFeatureEnable = true;
    } else {
      this.isClientPortalFeatureEnable = false;
    }
  }
  /**
   * @author Ravi Shah
   * Calculate the Height to show the no. of the datas
   * @private
   * @memberof DashboardComponent
   */
  private calculateHeight() {
    let padding = 131;
    let rowHeight = 41;
    if (this.rejectedReturnsWidgets && this.rejectedReturnsWidgets.nativeElement) {
      this.columnConfiguration.rejectedReturns.count = Math.floor((this.rejectedReturnsWidgets.nativeElement.offsetHeight - padding) / rowHeight);
    }
    if (this.returnSummaryWidgets && this.returnSummaryWidgets.nativeElement) {
      this.columnConfiguration.returnSummary.count = Math.floor((this.returnSummaryWidgets.nativeElement.offsetHeight - padding) / rowHeight);
    }
  }

  /**
   * @author Om Kanada
   * Refresh the Rejected Return Widget
   * @memberof DashboardComponent
   */
  public refreshRejectedReturnWidget() {
    this.refresh.rejectedReturnComponent = true;
    this.rejectedReturn.callListAPI().then((response) => {
      this.refresh.rejectedReturnComponent = false;
    }, error => {
      this.refresh.rejectedReturnComponent = false;
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description refresh falg data set in quick return summery
   */
  reloadQuickReturnSummary(data) {
    if (this.ssnorein) {
      this.reloadQuickReturnSummery = data;
    }
  }

  /**
   * @author Hitesh Soni
   * @deprecated Refresh E-File summary
   */
  refreshEFileSummary() {
    this.refresh.eFileSummaryComponent = true;
    this.eFileSummaryComponent.getEFileSummaryData().then(() => {
      this.refresh.eFileSummaryComponent = false;
    }, (error) => {
      this.refresh.eFileSummaryComponent = false;
    })
  }

  /**
   * @author Om Kanada
   * Refresh the financial Products Widget
   * @memberof DashboardComponent
   */
  public refreshFinancialProductsWidget() {
    this.refresh.financialProductsComponent = true;
    this.financialProductsComponent.callBankAPI().then((response) => {
      this.refresh.financialProductsComponent = false;
    }, error => {
      this.refresh.financialProductsComponent = false;
    });
  }
  /**
  * @author Om Kanada
  * Refresh the appointment List Widget
  * @memberof DashboardComponent
  */
  public refreshAppointmentListWidget() {
    this.refresh.appointmentListComponent = true;
    this.appointmentListComponent.callListAPI().then((response) => {
      this.refresh.appointmentListComponent = false;
    }, error => {
      this.refresh.appointmentListComponent = false;
    });
  }

  /**
   * @author Mansi Makwana
   * @description Refresh return summary widget
   */
  refreshReturnSummaryWidget() {
    this.refresh.returnSummaryComponent = true;
    this.recentReturn.callListAPI().then((response) => {
      this.refresh.returnSummaryComponent = false;
    }, error => {
      this.refresh.returnSummaryComponent = false;
    });
  }

  /**
   * @author Mansi Makwana
   * @description Refresh news summary widget
   */
  refreshNewsSummary() {
    this.refresh.newsSummaryComponent = true;
    this.newsSummaryComponent.callListAPI().then((response) => {
      this.refresh.newsSummaryComponent = false;
    }, error => {
      this.refresh.newsSummaryComponent = false;
    });
  }


  /**
   * @author Ravi Shah
   * Initializing the keyboard shortcuts
   * @memberof DashboardComponent
   */
  initializeShortcut() {
    this.shortcuts.push(
      {
        key: ["f1"],
        label: "Help",
        description: "Help",
        command: (e: ShortcutEventOutput) => {
          e.event.preventDefault();
          this.utilityService.openShortcutDialog();
        },
        preventDefault: true
      },
      {
        key: ["cmd + r"],
        label: "New Return",
        description: "Open New Returns",
        command: (e: ShortcutEventOutput) => {
          e.event.preventDefault();
          this.router.navigate(['return', 'new']);
        },
        preventDefault: true
      },
      {
        key: ["cmd + l"],
        label: "Return List",
        description: "Return List",
        command: (e: ShortcutEventOutput) => {
          e.event.preventDefault();
          this.router.navigate(['return', 'list']);
        },
        preventDefault: true
      }
    );
  }

  /**
   * @author Ravi Shah
   * Check the Permission and Features
   * @memberof DashboardComponent
   */
  checkPermissionAndFeatures() {
    this.permission = {
      canListReturn: this.userService.can('CAN_LIST_RETURN'),
      canOpenReturn: this.userService.can('CAN_OPEN_RETURN'),
      canGetEfileList: this.userService.can('CAN_GET_EFILE_LIST'),
      canListCalender: this.userService.can('CAN_LIST_CALENDAR'),
      canOpenBank: this.userService.can('CAN_OPEN_BANK'),
      canGetBankStatus: this.userService.can('CAN_GET_BANK_STATUS')
    };
    this.features = {
      news: this.resellerService.hasFeature('NEWS'),
      bank: this.resellerService.hasFeature('BANK')
    }
  }

  /**
   * @author Ravi Shah
   * Add watcher to save and reset the dashboard setting from the sidebar
   * @memberof DashboardComponent
   */
  communicationServiceWatcher() {
    this.dashboardSubscription = this.communicationService.transmitter.subscribe((data: any) => {
      if (data.topic === 'saveSettings') {
        this.saveDashboardSettings(true);
      } else if (data.topic === 'restoreSettings') {
        this.resetDashboardSettings();
      } else if (data.topic === 'introForDashbord') {
        this.introJsInit('manualDashbord');
      }
    });
  }

  public colorLuminance(col, amt = 20) {
    var usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }
    var g = (num & 0x0000FF) + amt;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  }

  ngAfterViewInit() {
    this.initializeShortcut();
  }

  /**
   * @author Asrar Memon
   * to show introduction information to user
   * @memberof DashboardComponent
   */
  introJsInit(type?: string) {
    const introJsObj = introJs();
    this.userDetails = this.userService.getUserDetails();
    const options = this.introService.getIntroOptions('home', 'home', undefined);
    if (this.hiddenStep && this.hiddenStep.length > 0 && options && options.steps) {
      const self = this;
      const step = JSON.parse(JSON.stringify(options.steps));
      step.forEach((item, index) => {
        if (self.hiddenStep.indexOf(item.element) > -1) {
          options.steps.splice(options.steps.findIndex(obj => obj.element === item.element), 1);
        }
      });
    }

    if (!this.userDetails || !this.userDetails.settings || !this.userDetails.settings.introConfig
      || Object.keys(this.userDetails.settings.introConfig).length === 0) {
      let dialog = this.dialogService.custom(TutorialInfoDialogComponent, {}, { 'keyboard': false, 'backdrop': false, 'size': 'md' });
      dialog.result.then((response) => {
        introJsObj.setOptions(options);
        introJsObj.start();
        this.saveIntroConfig('home', 'home', undefined);
      });
    } else if (type === 'manualDashbord') {
      introJsObj.setOptions(options);
      introJsObj.start();
    }
  }


  saveIntroConfig(moduleName, modeName, introLevel) {
    let introConfig: any = {};

    // get intro config
    if (this.userDetails && this.userDetails.settings && this.userDetails.settings.introConfig) {
      introConfig = this.userDetails.settings.introConfig;
    }

    // IF moduleName is all then get all modules for introConfig and loop through each to mark it as Done.
    if (moduleName.toLowerCase() === 'all') {
      // _.forEach(introService.getModulesNames(), function (modules) {
      //   introConfig[modules.moduleName] = {};
      //   introConfig[modules.moduleName][modules.modeName] = { isDone: true };
      // });
    } else {
      // get module
      const introModuleData = (introLevel) ? introConfig[introLevel] : introConfig[moduleName];
      if (introModuleData === undefined || introModuleData === '') {
        // IF module is undefined then we need to define it first.
        (introLevel) ? introConfig[introLevel] = {} : introConfig[moduleName] = {};
      }
      if (introLevel) {
        introConfig[introLevel][moduleName] = {};
        introConfig[introLevel][moduleName][modeName] = { isDone: true };
      } else {
        introConfig[moduleName][modeName] = { isDone: true };
      }
    }

    // condition to check when the function is called
    // if the function is called when the tutorial for oneTime is called then no need to execute below code
    // this will be only execute when main tutorial is done at that time all oneTime tutorial of that particular module are to be done
    if (introLevel) {
      // below code is to fetch the oneTime config of tutorial for the current page if exist
      // Note :- this is done because when the main tutorial get over then all its oneTime tutorial must get done
      const _oneTimeIntroOptions = JSON.parse(JSON.stringify(this.introService.getIntroOptions(moduleName, modeName, 'oneTime')));
      if (_oneTimeIntroOptions && _oneTimeIntroOptions.steps && _oneTimeIntroOptions.steps.length > 0) {
        if (introConfig.oneTime === undefined) {
          introConfig.oneTime = {};
        }
        introConfig.oneTime[moduleName] = {};
        introConfig.oneTime[moduleName][modeName] = { isDone: true };
      }
    }

    this.userService.changeSettings('introConfig', introConfig, undefined).then((response) => {
      this.userDetails.settings.introConfig = introConfig;
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * @author Heena Bhesaniya
   * call api to check whether we need to ask for rating or not
   */
  getAskRating() {
    const self = this;
    //get askForRating flag to show/hide 'Rate Your Experience' from header
    self._ratingService.ratingDisplay().then((success: boolean) => {
      if (success == true) {
        self.dialogService.custom(RatingsConfirmationComponent, {}, { 'keyboard': false, 'backdrop': true, 'size': 'md' });
      }
    }, (error) => {
      console.error(error);
    });
  }

  /**
   * @author Ravi Shah
   * Intialize Dashboard on Init
   * @memberof DashboardComponent
   */
  ngOnInit() {
    this.routeSubscription = this._activatedRoute.paramMap.subscribe((params: any) => {
      this.params = params.params;
      this.communicationServiceWatcher();
      this.checkPermissionAndFeatures();
      // Enable Drag and Drop and Other Feature on Settings screen only
      this.isSettingsEnabled = this.router.url.indexOf('/home/settings') > -1;
      this.initializeDashboardWidgets();
      this.initialCheckHideOrMyTaxPortalWidget();
      // this.defaultDashboard();

      //get tax year
      this.taxYear = this.userService.getTaxYear();
    });
  }

  /**
   * @author Ravi Shah
   * Save Before the Route Change
   * @returns
   * @memberof DashboardComponent
   */
  saveBeforeRouteChange() {
    return new Promise((resolve, reject) => {
      this.saveDashboardSettings(false).then((result) => {
        resolve(true);
      }, error => {
        reject(false);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Check is thier any unsaved changes
   * @returns
   * @memberof DashboardComponent
   */
  haveUnsavedChanges() {
    return !this.utilService.checkObjectEquals(this.preserveWidgetOption, this.widgetsOptions);
  }

  /**
   * @author Heena Bhesaniya
   * @description //to get beta only flag
   */
  public betaOnly() {
    if (environment.mode == 'local' || environment.mode == 'beta') {
      return true;
    } else {
      return false;
    }
  }


  /**
   * @author Ravi Shah
   * Call on before ngOndestroy to check the unsaved Changes
   * @returns
   * @memberof DashboardComponent
   */
  // canDeactivate() {
  //   return new Promise((resolve, reject) => {
  //     if (!this.utilService.checkObjectEquals(this.preserveWidgetOption, this.widgetsOptions)) {
  //       this.dialogService.unsaved({}, {}).result.then(response => {
  //         this.saveDashboardSettings(false).then((result) => {
  //           resolve(response);
  //         }, error => {
  //           resolve(false);
  //         })
  //       });
  //     } else {
  //       resolve(true);
  //     }
  //   });
  // }


  ngOnDestroy() {
    if (this.dashboardSubscription) {
      this.dashboardSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
