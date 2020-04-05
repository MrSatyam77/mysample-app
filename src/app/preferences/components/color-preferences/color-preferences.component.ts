import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PerOfficeConfigurationDialogComponent } from '@app/preferences/dialogs/per-office-configuration-dialog/per-office-configuration-dialog.component';
import { Router } from '@angular/router';
import { MessageService, UserService, DialogService, CommunicationService } from '@app/shared/services';
import { PreferencesService } from '@app/preferences/preferences.service';

@Component({
  selector: 'app-color-preferences',
  templateUrl: './color-preferences.component.html',
  styleUrls: ['./color-preferences.component.scss']
})
export class ColorPreferencesComponent implements OnInit {


  @Input() colorPreferences: any;
  @Input() userId: any;
  @Input() userDetails: any = {};
  @Input() lookup: any;
  @Input() officeList: any = [];
  @Output() getUpdatedPreferences = new EventEmitter();
  @Input() isAdmin: any = false;
  public formSettings: any = [{ id: 'background', name: 'Background', styleApply: ['border-color', "box-shadow"] }, { id: 'border', name: 'Border', styleApply: ['border-color'] }];
  public selectedSoftware: any;
  public selectedTheme: any = 'classic';

  public rolesModel = [{ id: 2, name: 'Individual Users' }];
  public lineHelp = {
    title: 'Color Preferences',
    body: '<p>Customize your color preferences for the fields where you are entering information in a return. You can also customize your color preferences for the Perform Review feature. This feature will show any errors in your return before you e-file.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the <b>Cancel</b> button to go back to the Dashboard. Pressing the <b>Reset</b> button will restore the original MyTAXPrepOffice colors.</p>',
    tooltip: 'Customize your color preferences for the fields where you are entering information in a return. You can also customize your color preferences for the Perform Review feature. This feature will show any errors in your return before you e-file.'
  }
  constructor(private communicationService: CommunicationService, private router: Router, private preferencesService: PreferencesService, private messageService: MessageService, private userService: UserService, private dialogservice: DialogService) { }

  /**
   * @author Ravi Shah
   * Go To Home
   * @memberof ColorPreferencesComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * @author Ravi Shah
   * Reset Preference Settings
   * @memberof ColorPreferencesComponent
   */
  resetPreferences() {
    this.colorPreferences = this.preferencesService.defaultPreferences.color;
    this.savePreferences(true, true);
  }

  /**
   * @author Ravi Shah
   * Open Configuration Dialog
   * @param {*} key
   * @param {*} controlType
   * @param {*} lookup
   * @memberof ColorPreferencesComponent
   */
  openConfigurationDialog(key, controlType, lookup) {
    this.dialogservice.custom(PerOfficeConfigurationDialogComponent, { key, controlType, lookup, locations: this.colorPreferences[key].locations, officeList: this.officeList }, { size: 'lg' })
      .result.then((filterParams: any) => {
        if (filterParams) {
          this.colorPreferences[key].locations = filterParams;
          this.colorPreferences[key].value = undefined;
        }
      });
  }

  /**
   * @author Ravi Shah
   * Save Preferences
   * @param {boolean} [IsFromTab]
   * @param {boolean} [isReset]
   * @returns
   * @memberof ColorPreferencesComponent
   */
  savePreferences(IsFromTab?: boolean, isReset?: boolean) {
    return new Promise((resolve, reject) => {
      let paramObj = {
        color: this.colorPreferences
      }
      this.preferencesService.savePreferences(paramObj, this.userId).then((response) => {
        if (IsFromTab) {
          this.getUpdatedPreferences.emit();
        }
        this.preferencesService.applyThemeChanges().then(() => {
          if (isReset) {
            this.messageService.showMessage('Color preference reset successfully.', 'success');
          } else {
            this.messageService.showMessage('Color preference saved successfully.', 'success');
          }
          resolve(true);
        });
      }, (error) => {
        resolve(false);
      });
    });
  }

  /**
   * @author Ravi Shah
   *  Line Help
   * @param {string} title
   * @memberof ColorPreferencesComponent
   */
  informationLineHelp(title: string): void {
    this.communicationService.transmitData({
      topic: 'Preferences',
      channel: 'MTPO-LINE-HELP',
      data: this.lineHelp || {}
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



  ngOnInit() {
    if (this.userDetails.settings && this.userDetails.settings.preferences && this.userDetails.settings.preferences.themePreferences) {
      this.selectedTheme = this.userDetails.settings.preferences.themePreferences.theme;
    } else {
      this.selectedTheme = 'classic';
    }

    this.preferencesService.colorDefaults().then((res) => {
      this.selectPredefinedSettings();
    });
  }

}
