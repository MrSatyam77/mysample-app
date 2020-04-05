import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PreferencesService } from '@app/preferences/preferences.service';
import { MessageService, UserService, DialogService, CommunicationService } from '@app/shared/services';
import { PerOfficeConfigurationDialogComponent } from '@app/preferences/dialogs/per-office-configuration-dialog/per-office-configuration-dialog.component';

@Component({
  selector: 'app-theme-preferences',
  templateUrl: './theme-preferences.component.html',
  styleUrls: ['./theme-preferences.component.scss']
})
export class ThemePreferencesComponent implements OnInit {

  @Input() themePreferences: any;
  @Input() colorPreferences: any;
  @Input() userId: any;
  @Input() userDetails: any = {};
  @Input() lookup: any;
  @Input() officeList: any = [];
  @Output() getUpdatedPreferences = new EventEmitter();
  @Input() isAdmin: any = false;
  @Input() view: any = {};

  public roleConfiguration: any = {
    theme: [{ id: 2, name: 'Individual Users' }],
    menu: [{ id: 0, name: 'Entire Firm' }],
    performReview: [{ id: 2, name: 'Individual Users' }],
    formFields: [{ id: 2, name: 'Individual Users' }]
  }
  public lineHelp = {
    theme: {
      title: 'Theme',
      body: '<p>Theme selection provides you the ability to change the look of the fields within MyTAXPrepOffice.</p> <p>There are two themes available under the <b>Options</b> column: Classic and Modern. </p> <p>The Classic Theme displays fields within the software as boxes.</p><img class="img-fluid my-1" src="assets/images/line-help/classic.jpg"> <p>The Modern Theme does not display fields within the software as boxes. </p><img class="img-fluid my-1" src="assets/images/line-help/modern.jpg"><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>',
      tooltip: 'Theme selection provides you the ability to change the look of the fields within MyTAXPrepOffice. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
    },
    menu: {
      title: 'Menu Hints',
      body: '<p>In order to assist you with your transition to MyTAXPrepOffice, the same terms used in your previous software can appear in the Menu on the left-hand side of your screen. To enable this feature, please choose your previous software from the dropdown menu under <b>Options</b>.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>',
      tooltip: 'In order to assist you with your transition to MyTAXPrepOffice, the same terms used in your previous software can appear in the Menu on the left-hand side of your screen. To enable this feature, please choose your previous software from the dropdown menu under Options.'
    }
  }
  public formSettings: any = [{ id: 'background', name: 'Background', styleApply: ['border-color', "box-shadow"] }, { id: 'border', name: 'Border', styleApply: ['border-color'] }];
  public selectedSoftware: string;
  public selectedTheme: string = 'classic';

  constructor(private communicationService: CommunicationService, private router: Router, private preferencesService: PreferencesService, private messageService: MessageService, private userService: UserService, private dialogservice: DialogService) { }


  /**
   * Route to Home
   * @author Ravi Shah
   * @memberof ThemePreferencesComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * Open Office Configuration Dialog
   * @author Ravi Shah
   * @param {*} key
   * @param {*} controlType
   * @param {*} lookup
   * @memberof ThemePreferencesComponent
   */
  openConfigurationDialog(key, controlType, lookup) {
    this.dialogservice.custom(PerOfficeConfigurationDialogComponent, { key, controlType, lookup, locations: this.themePreferences[key].locations, officeList: this.officeList }, { size: 'lg' })
      .result.then((filterParams: any) => {
        if (filterParams) {
          this.themePreferences[key].locations = filterParams;
          this.themePreferences[key].value = undefined;
        }
      });
  }

  /**
   * Save Preferences
   * @author Ravi Shah
   * @param {boolean} [isFromTab]
   * @returns
   * @memberof ThemePreferencesComponent
   */
  savePreferences(isFromTab?: boolean) {
    return new Promise((resolve, reject) => {
      let paramObj = {
        themePreferences: this.themePreferences,
        color: this.colorPreferences
      }
      this.preferencesService.savePreferences(paramObj, this.userId).then((response) => {
        this.messageService.showMessage('Theme preference saved successfully.', 'success');
        this.preferencesService.applyThemeChanges().then(() => {
          if (this.userDetails.settings && this.userDetails.settings.preferences && this.userDetails.settings.preferences.themePreferences) {
            this.selectedTheme = this.userDetails.settings.preferences.themePreferences.theme;
          } else {
            this.selectedTheme = 'classic';
          }
        });
        this.preferencesService.applyMenuChanges(this.themePreferences.menu.value).then(() => { });
        this.getUpdatedPreferences.emit();
        resolve(true);
      }, (error) => {
        resolve(false);
      });
    });
  }

  /**
   * Line Help Communication Service
   * @author Ravi Shah
   * @param {string} title
   * @memberof ThemePreferencesComponent
   */
  informationLineHelp(title: string): void {
    this.communicationService.transmitData({
      topic: 'Preferences',
      channel: 'MTPO-LINE-HELP',
      data: this.lineHelp[title] || {}
    });

  }


  /**
   * @author Ravi Shah
   * Get Style for the Forms Controls
   * @param {*} key
   * @returns {*}
   * @memberof ColorPreferencesComponent
   */
  public getStyle(key: any): any {
    let style = {};
    let styleSelected = this.formSettings.find(t => t.id === this.colorPreferences[key].settings);
    for (let property of styleSelected.styleApply) {
      if (property === 'box-shadow') {
        style[property] = `inset 0px -1px 70px -31px ${this.colorPreferences[key].value}`;
      } else {
        style[property] = this.colorPreferences[key].value;
      }
    }
    return style;
  }

  /**
   * @author Ravi Shah
   *  Load Default Color Software Wise
   * @param {string} menuId
   * @memberof ColorPreferencesComponent
   */
  public loadDefaultColor(menuId: string) {
    this.selectedSoftware = menuId;
    for (let key in this.preferencesService.defaultColor[menuId]) {
      this.colorPreferences[key] = JSON.parse(JSON.stringify(this.preferencesService.defaultColor[menuId][key]));
    }
  }

  /**
   *  Select Default PreDefined Template
   */
  public selectPredefinedSettings(): any {
    for (let key in this.preferencesService.defaultColor) {
      let isMismatchProperty = false;
      for (let property in this.preferencesService.defaultColor[key]) {
        if (!(this.colorPreferences[property].value === this.preferencesService.defaultColor[key][property].value &&
          this.colorPreferences[property].settings === this.preferencesService.defaultColor[key][property].settings)) {
          isMismatchProperty = true;
        }
      }
      if (!isMismatchProperty) {
        this.selectedSoftware = key;
        return key;
      }
    }
    this.selectedSoftware = undefined;
    return undefined;
  }

  public applyRightModel(key: string, role: number) {
    if (key === 'formFields') {
      this.colorPreferences.normal.rightModel =
        this.colorPreferences.required.rightModel =
        this.colorPreferences.estimated.rightModel =
        this.colorPreferences.calculated.rightModel =
        this.colorPreferences.overriden.rightModel = role;
    } else {
      this.colorPreferences.reject.rightModel =
        this.colorPreferences.info.rightModel =
        this.colorPreferences.warning.rightModel = role;
    }
  }


  ngOnInit() {
    if (this.userDetails.settings && this.userDetails.settings.preferences && this.userDetails.settings.preferences.themePreferences) {
      this.selectedTheme = this.userDetails.settings.preferences.themePreferences.theme;
    } else {
      this.selectedTheme = 'classic';
    }
    // this.selectedTheme = 'modern';
    this.preferencesService.colorDefaults().then((res) => {
      this.selectPredefinedSettings();
    });
  }


}
