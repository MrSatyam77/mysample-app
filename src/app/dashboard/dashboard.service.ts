import { Injectable } from '@angular/core';
import { IDashboardWidgetOption, IColorPallete, IWidgetSize, IRowColorPallete, IWidgetOption } from './dashboard.model';
import { CommonAPIService, UserService } from '@app/shared/services';
import { APINAME } from './dashboard.constants';

@Injectable()
export class DashboardService {

  private readonly _defaultWidgetOptions: IDashboardWidgetOption = {
    "returnSummary": { "title": "Recent Returns", "key": "returnSummary", "width": 12, "height": 6, "x": 0, "y": 0, "backgroundColor": "#26a69a", "foregroundColor": "#FFFFFF", "visible": true },
    "efileSummary": { "title": "E-File Summary", "key": "efileSummary", "width": 6, "height": 6, "x": 12, "y": 0, "backgroundColor": "#29b6f6", "foregroundColor": "#FFFFFF", "visible": true },
    "newsSummary": { "title": "News", "key": "newsSummary", "width": 6, "height": 6, "x": 18, "y": 0, "backgroundColor": "#f9a825", "foregroundColor": "#FFFFFF", "visible": true },
    "quickReturnSummary": { "title": "E-File Status / Quick Return Summary", "key": "quickReturnSummary", "width": 12, "height": 3, "x": 0, "y": 6, "backgroundColor": "#34495e", "foregroundColor": "#FFFFFF", "visible": true },
    "yourFirm": { "title": "Your Firm", "key": "yourFirm", "width": 6, "height": 3, "x": 18, "y": 9, "backgroundColor": "#34495e", "foregroundColor": "#FFFFFF", "visible": true },
    "myTaxPortal": { "title": "MyTAXPortal", "key": "myTaxPortal", "width": 6, "height": 3, "x": 0, "y": 12, "backgroundColor": "#34495e", "foregroundColor": "#FFFFFF", "visible": true },
    "rejectedReturns": { "title": "Rejected Summary", "key": "rejectedReturns", "width": 12, "height": 3, "x": 12, "y": 6, "backgroundColor": "#ef5350", "foregroundColor": "#FFFFFF", "visible": true },
    "appointmentList": { "title": "Appointment List", "key": "appointmentList", "width": 12, "height": 3, "x": 0, "y": 9, "backgroundColor": "#f9a825", "foregroundColor": "#FFFFFF", "visible": true },
    "financialProducts": { "title": "Financial Products", "key": "financialProducts", "width": 6, "height": 3, "x": 12, "y": 9, "backgroundColor": "#26a69a", "foregroundColor": "#FFFFFF", "visible": true },
    // "toolBox": { "title": "Toolbox", "key": "toolBox", "width": 6, "height": 6, "x": 6, "y": 12, "backgroundColor": "#3EC7F3", "foregroundColor": "#FFFFFF", "visible": true },
    "hiddenWidgets": { "title": "Hidden Widgets", "key": "hiddenWidgets", "width": 6, "height": 6, "x": 18, "y": 12, "backgroundColor": "#34495e", "foregroundColor": "#FFFFFF", "visible": true }
  };

  private readonly _widgetSettingMapping: any = {
    returnSummary: { noMove: false, autoPosition: true, config: { canHide: false, canChangeColor: true, canResize: true } },
    efileSummary: { noMove: false, autoPosition: false, config: { canHide: true, canChangeColor: true, canResize: true } },
    newsSummary: { noMove: true, autoPosition: true, config: { canHide: false, canChangeColor: true, canResize: false }, locked: true },
    quickReturnSummary: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: false } },
    // bankApplicationSummary: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: true } },
    // toDoSummary: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: true } },
    rejectedReturns: { noMove: false, autoPosition: true, config: { canHide: false, canChangeColor: true, canResize: true } },
    appointmentList: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: false } },
    yourFirm: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: false } },
    myTaxPortal: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: false } },
    financialProducts: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: false } },
    // toolBox: { noMove: false, autoPosition: true, config: { canHide: true, canChangeColor: true, canResize: false } },
    hiddenWidgets: { noMove: true, autoPosition: true, config: { canHide: false, canChangeColor: true, canResize: false } }
  }

  private readonly _widgetRatioSize: any = {
    returnSummary: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 10 },
      { id: 'two-two', ratio: '2:2', size: { width: 12, height: 6 }, columnNumber: 'two', count: 10 },
      { id: 'three-two', ratio: '3:2', size: { width: 18, height: 6 }, columnNumber: 'three', count: 10 },
      { id: 'three-three', ratio: '3:3', size: { width: 18, height: 9 }, columnNumber: 'three', count: 17 },
      { id: 'four-two', ratio: '4:2', size: { width: 24, height: 6 }, columnNumber: 'four', count: 10 },
      { id: 'four-three', ratio: '4:3', size: { width: 24, height: 9 }, columnNumber: 'four', count: 17 },
      { id: 'four-four', ratio: '4:4', size: { width: 24, height: 12 }, columnNumber: 'four', count: 24 }
    ],
    efileSummary: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'one-two', ratio: '1:2', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 },
      { id: 'two-two', ratio: '2:2', size: { width: 12, height: 6 }, columnNumber: 'two', count: 10 }
    ],
    newsSummary: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'one-two', ratio: '1:2', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 },
    ],
    quickReturnSummary: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'two-one', ratio: '2:1', size: { width: 12, height: 6 }, columnNumber: 'two', count: 10 },
    ],
    // bankApplicationSummary: [
    //   { ratio: '1:1', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 },
    //   { ratio: '2:2', size: { width: 12, height: 6 }, columnNumber: 'two', count: 10 }
    // ],
    // toDoSummary: [
    //   { ratio: '1:1', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 },
    //   { ratio: '2:2', size: { width: 12, height: 6 }, columnNumber: 'two', count: 10 }
    // ],
    appointmentList: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'two-one', ratio: '2:1', size: { width: 12, height: 3 }, columnNumber: 'two', count: 5 },
    ],
    rejectedReturns: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'two-one', ratio: '2:1', size: { width: 12, height: 3 }, columnNumber: 'two', count: 3 },
      { id: 'three-one', ratio: '3:1', size: { width: 18, height: 3 }, columnNumber: 'three', count: 3 },
      { id: 'three-two', ratio: '3:2', size: { width: 18, height: 6 }, columnNumber: 'three', count: 10 },
      { id: 'four-one', ratio: '4:1', size: { width: 24, height: 3 }, columnNumber: 'four', count: 3 },
      { id: 'four-two', ratio: '4:2', size: { width: 24, height: 6 }, columnNumber: 'four', count: 10 }
    ],

    yourFirm: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 5 },
    ],
    myTaxPortal: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 5 }
    ],
    financialProducts: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'one-two', ratio: '1:2', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 }
    ],
    toolBox: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'one-two', ratio: '1:2', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 }
    ],
    hiddenWidgets: [
      { id: 'mobile', ratio: '1:1', size: { width: 6, height: 3 }, columnNumber: 'one', count: 2 },
      { id: 'one-two', ratio: '1:2', size: { width: 6, height: 6 }, columnNumber: 'one', count: 5 }
    ]
  };

  private readonly _whiteColorPallete: IRowColorPallete = {
    row1: [
      { backgroundColor: '#e57373' },
      { backgroundColor: '#f06292' },
      { backgroundColor: '#ba68c8' },
      { backgroundColor: '#64b5f6' },
      { backgroundColor: '#4fc3f7' },
      { backgroundColor: '#4dd0e1' },
      { backgroundColor: '#4db6ac' },
      { backgroundColor: '#f9a825' },
      { backgroundColor: '#507091' }
    ],
    row2: [
      { backgroundColor: '#ef5350' },
      { backgroundColor: '#ec407a' },
      { backgroundColor: '#ab47bc' },
      { backgroundColor: '#42a5f5' },
      { backgroundColor: '#29b6f6' },
      { backgroundColor: '#26c6da' },
      { backgroundColor: '#26a69a' },
      { backgroundColor: '#ffa726' },
      { backgroundColor: '#496684' }
    ],
    row3: [
      { backgroundColor: '#e53935' },
      { backgroundColor: '#d81b60' },
      { backgroundColor: '#8e24aa' },
      { backgroundColor: '#1e88e5' },
      { backgroundColor: '#039be5' },
      { backgroundColor: '#00acc1' },
      { backgroundColor: '#00897b' },
      { backgroundColor: '#ff9800' },
      { backgroundColor: '#425d77' }
    ],
    row4: [
      { backgroundColor: '#d32f2f' },
      { backgroundColor: '#c2185b' },
      { backgroundColor: '#7b1fa2' },
      { backgroundColor: '#1976d2' },
      { backgroundColor: '#0288d1' },
      { backgroundColor: '#0097a7' },
      { backgroundColor: '#00796b' },
      { backgroundColor: '#fb8c00' },
      { backgroundColor: '#3b536b' }
    ],
    row5: [
      { backgroundColor: '#c62828' },
      { backgroundColor: '#ad1457' },
      { backgroundColor: '#6a1b9a' },
      { backgroundColor: '#1565c0' },
      { backgroundColor: '#0277bd' },
      { backgroundColor: '#00838f' },
      { backgroundColor: '#00695c' },
      { backgroundColor: '#f57c00' },
      { backgroundColor: '#34495e' }
    ],
    row6: [
      { backgroundColor: '#b71c1c' },
      { backgroundColor: '#880e4f' },
      { backgroundColor: '#4a148c' },
      { backgroundColor: '#0d47a1' },
      { backgroundColor: '#01579b' },
      { backgroundColor: '#006064' },
      { backgroundColor: '#004d40' },
      { backgroundColor: '#ef6c00' },
      { backgroundColor: '#2d3f51' }
    ]
  }

  private readonly _blackColorPallete: IRowColorPallete = {

    row1: [
      { backgroundColor: '#fab098' },
      { backgroundColor: '#efb3f9' },
      { backgroundColor: '#f5a3ca' },
      { backgroundColor: '#99d2fe' },
      { backgroundColor: '#b2ebf2' },
      { backgroundColor: '#dce775' },
      { backgroundColor: '#aed581' },
      { backgroundColor: '#fff176' },
      { backgroundColor: '#ffd54f' },
    ],
    row2: [
      { backgroundColor: '#fd9b7c' },
      { backgroundColor: '#eaa2f6' },
      { backgroundColor: '#f89ec0' },
      { backgroundColor: '#7ec5fd' },
      { backgroundColor: '#80deea' },
      { backgroundColor: '#d4e157' },
      { backgroundColor: '#9ccc65' },
      { backgroundColor: '#ffee58' },
      { backgroundColor: '#ffca28' },
    ],
    row3: [
      { backgroundColor: '#fe8d6a' },
      { backgroundColor: '#e08df5' },
      { backgroundColor: '#f48bb2' },
      { backgroundColor: '#63b8fc' },
      { backgroundColor: '#4dd0e1' },
      { backgroundColor: '#cddc39' },
      { backgroundColor: '#8bc34a' },
      { backgroundColor: '#ffeb3b' },
      { backgroundColor: '#ffc107' },
    ],
    row4: [
      { backgroundColor: '#fd7e56' },
      { backgroundColor: '#d589f6' },
      { backgroundColor: '#f576ad' },
      { backgroundColor: '#4aacfa' },
      { backgroundColor: '#26c6da' },
      { backgroundColor: '#c0ca33' },
      { backgroundColor: '#7cb342' },
      { backgroundColor: '#fdd835' },
      { backgroundColor: '#ffb300' },
    ],
    row5: [
      { backgroundColor: '#fd6b3d' },
      { backgroundColor: '#c885f6' },
      { backgroundColor: '#f56fa0' },
      { backgroundColor: '#38a3f7' },
      { backgroundColor: '#00bcd4' },
      { backgroundColor: '#afb42b' },
      { backgroundColor: '#689f38' },
      { backgroundColor: '#fbc02d' },
      { backgroundColor: '#ffa000' },
    ],
    row6: [
      { backgroundColor: '#fe5722' },
      { backgroundColor: '#b47ff3' },
      { backgroundColor: '#f05998' },
      { backgroundColor: '#2196f3' },
      { backgroundColor: '#00acc1' },
      { backgroundColor: '#9e9d24' },
      { backgroundColor: '#558b2f' },
      { backgroundColor: '#f9a825' },
      { backgroundColor: '#ff8f00' }
    ]
  }

  private readonly _introStepInfo = {
    returnSummary: ['step1', 'step2', 'step3'],
    quickReturnSummary: ['step4'],
    financialProducts: ['step5'],
    toolBox: ['step6'],
    rejectedReturns: ['step7'],
    yourFirm: ['step8']
  };


  constructor(private commonapiService: CommonAPIService, private userService: UserService) { }


  /**
   * Returns the Default Options of the Dashboard Widgets
   * @author Ravi Shah
   * @date 19th July 2019
   * @readonly
   * @type {IDashboardWidgetOption}
   * @memberof DashboardService
   */
  public get defaultWidgetOptions(): IDashboardWidgetOption {
    return JSON.parse(JSON.stringify(this._defaultWidgetOptions));
  }

  /**
   * Returns the all step with Dashboard Widgets use for get info of is visible
   * @author Asrar Memon
   * @date 22th Aug 2019
   * @readonly
   * @type {IDashboardWidgetOption}
   * @memberof DashboardService
   */
  public get introStepInfo() {
    return JSON.parse(JSON.stringify(this._introStepInfo));
  }
  /**
   * @author Ravi Shah
   * Mapping of the Setting Widget Wise
   * @readonly
   * @type {IDashboardWidgetOption}
   * @memberof DashboardService
   */
  public get widgetMapping(): IDashboardWidgetOption {
    return this._widgetSettingMapping;
  }

  /**
   * @author Ravi Shah
   * Purpose of this function is to return the default ratio to resize
   * @readonly
   * @type {IWidgetSize[]}
   * @memberof DashboardService
   */
  public get widgetRatioSize(): IWidgetSize[] {
    return this._widgetRatioSize;
  }

  /**
   * @author Dhruvi Shah
   * @description get the default colorPallete of the dashboard for WhiteFonts
   * @readonly
   * @type {IRowColorPallete}
   * @memberof DashboardService
   */
  public get whiteColorPallete(): IRowColorPallete {
    return this._whiteColorPallete;
  }

  /**
   * @author Dhruvi Shah
   * @description get the default colorPallete of the dashboard for BlackFonts
   * @readonly
   * @type {IRowColorPallete}
   * @memberof DashboardService
   */
  public get blackColorPallete(): IRowColorPallete {
    return this._blackColorPallete;
  }

  /**
   * @author Ravi Shah
   * Get Dashboard Settings
   * @returns {Promise<any>}
   * @memberof DashboardService
   */
  public getUserDashboardSettings(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      if (obj.rightModel) {
        obj.rightModel = parseInt(obj.rightModel);
      }
      this.commonapiService.getPromiseResponse({ apiName: APINAME.GET_USER_DASHBOARD_SETTINGS, parameterObject: obj }).then((result) => {
        resolve(result.data);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Save Dashboard Settings
   * @param {IDashboardWidgetOption} widgetSettings
   * @returns {Promise<any>}
   * @memberof DashboardService
   */
  public saveUserDashboardSettings(widgetSettings: IDashboardWidgetOption, rightModel, locationId): Promise<any> {
    let paramObj = JSON.parse(JSON.stringify(widgetSettings));
    if (rightModel) {
      paramObj.rightModel = parseInt(rightModel);
    }
    paramObj.locationId = locationId;
    if (paramObj.rightModel === 2) {
      paramObj.userId = this.userService.getUserDetails().key;
    }
    return new Promise((resolve, reject) => {
      this.commonapiService.getPromiseResponse({ apiName: APINAME.SAVE_USER_DASHBOARD_SETTINGS, parameterObject: paramObj }).then((result) => {
        resolve(result.data);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * @author Ravi Shah
   * Restore Dashboard Settings
   * @param {IDashboardWidgetOption} widgetSettings
   * @returns {Promise<any>}
   * @memberof DashboardService
   */
  public resetUserDashboardSettings(widgetSettings: IDashboardWidgetOption, rightModel, locationId): Promise<any> {
    return new Promise((resolve, reject) => {
      let paramObj: any = {};
      if (rightModel) {
        paramObj.rightModel = parseInt(rightModel);
      }
      paramObj.locationId = locationId;
      if (paramObj.rightModel === 2) {
        paramObj.userId = this.userService.getUserDetails().key;
      }
      this.commonapiService.getPromiseResponse({ apiName: APINAME.RESET_USER_DASHBOARD_SETTINGS, parameterObject: paramObj }).then((result) => {
        resolve(result.data);
      }, error => {
        reject(error);
      });
    });
  }
}
