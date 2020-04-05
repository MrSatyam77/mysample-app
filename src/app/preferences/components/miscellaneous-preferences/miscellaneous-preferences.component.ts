import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { DialogService, UserService, MessageService, CommunicationService } from '@app/shared/services';
import { PreferencesService } from '@app/preferences/preferences.service';
import { PerOfficeConfigurationDialogComponent } from '@app/preferences/dialogs/per-office-configuration-dialog/per-office-configuration-dialog.component';

@Component({
  selector: 'app-miscellaneous-preferences',
  templateUrl: './miscellaneous-preferences.component.html',
  styleUrls: ['./miscellaneous-preferences.component.scss']
})
export class MiscellaneousPreferencesComponent implements OnInit {

  @Input() miscPreferences: any;
  @Input() userId: any;
  @Input() userDetails: any = {};
  @Input() lookup: any;
  @Input() officeList: any = [];
  @Input() isAdmin: any = false;
  @Input() view: any = {};
  @Output() getUpdatedPreferences = new EventEmitter();

  public lineHelp = {
    title: 'Dashboard Settings',
    body: '<p>MyTAXPrepOffice allows you to customize the Dashboard order, colors, and widget ratios. You can also choose to hide certain widgets.</p> <p class="<%=admin%>">If you select Entire Firm, the Edit Settings button under Options will allow you to choose the Dashboard settings that will appear for every user in your firm.</p> <p class="<%=admin%>">If you select Individual Locations, the Configure Office button will allow you to choose which Dashboard settings will appear for users in each of your firm’s locations.</p> <p class="<%=admin%>">If you select Individual Users, the Edit Settings button under Options will allow each user to choose their own Dashboard settings.</p> <p>Clicking on Edit Settings will take you to the Dashboard where you can click on the <b>Pencil</b> icon in the top right-hand corner of each widget to select the color, choose your widget ratio, or hide the widget. In the <b>Hidden Widgets</b> widget, simply click on a hidden widget to restore it to the dashboard.</p> <p>To rearrange the location of your widgets, place your cursor at the top of each widget until you see the four arrows. Then, drag and drop the widget to the desired location.</p> <p>Click Save to save your settings.</p> <p>Clicking on the three-dot icon in the <b>Recent Returns</b> widget will allow you to choose which returns are displayed. Click Ok to save your settings.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>',
    tooltip: 'MyTAXPrepOffice allows you to customize the Dashboard order, colors, and widget ratios. You can also choose to hide certain widgets. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
  }

  public miscellaneousRoleConfiguration: any = {
    dashboardSettings: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }]
  }

  constructor(private communicationService: CommunicationService, private router: Router, private dialogservice: DialogService, private userService: UserService, private preferencesService: PreferencesService, private messageService: MessageService) { }

  /**
   * @author Ravi Shah
   * Go to Dashboard Settings
   * @param {*} rightModel
   * @memberof MiscellaneousPreferencesComponent
   */
  goToSettings(rightModel) {
    if (rightModel === 1) {
      this.router.navigate(['home', 'settings', rightModel, this.officeList[0].key]);
    } else {
      this.router.navigate(['home', 'settings', rightModel]);
    }
  }

  /**
   * @author Ravi Shah
   * Route to Home
   * @memberof MiscellaneousPreferencesComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * Open Office Configuration Dialog
   * @author Ravi Shah
   * @param {*} key
   * @param {*} controlType
   * @param {*} route
   * @param {*} routeTitle
   * @memberof MiscellaneousPreferencesComponent
   */
  openConfigurationDialog(key, controlType, route, routeTitle) {
    this.dialogservice.custom(PerOfficeConfigurationDialogComponent, { key, controlType, route, routeTitle, locations: this.miscPreferences[key].locations, officeList: this.officeList }, { 'keyboard': false, 'backdrop': false, 'size': 'lg' })
      .result.then((filterParams: any) => {
        if (filterParams) {
          this.miscPreferences[key].locations = filterParams;
          this.miscPreferences[key].value = '';
        }
      });
  }

  /**
   * Check Role
   * @author Ravi Shah
   * @param {number} rightModel
   * @param {string} property
   * @memberof MiscellaneousPreferencesComponent
   */
  updatRole(rightModel: number, property: string) {
    if ((this.view.user && rightModel >= 2) || (this.view.office && rightModel >= 1) || (this.view.customer && rightModel >= 0)) {
      this.miscPreferences[property].rightModel = rightModel;
      this.miscPreferences[property].value = this.preferencesService.defaultPreferences.miscellaneous[property].value;
    } else {
      this.messageService.showMessage("This settings can be modified by your administrator. Please contact them for any changes.", "error");
    }
  }

  /**
   * Save Prefernces Changes
   * @author Ravi Shah
   * @param {boolean} [isFromTab]
   * @returns
   * @memberof MiscellaneousPreferencesComponent
   */
  savePreferences(isFromTab?: boolean) {
    return new Promise((resolve, reject) => {
      let savePreferencesData = JSON.parse(JSON.stringify(this.miscPreferences));
      for (let key in savePreferencesData) {
        if (savePreferencesData[key].rightModel === 1 && this.officeList.length === 1) {
          savePreferencesData[key].locations = [{
            id: this.officeList[0].id,
            name: this.officeList[0].name,
            value: savePreferencesData[key].value,
          }]
          savePreferencesData[key].value = undefined;
        }
      }
      let paramObj = {
        miscellaneous: savePreferencesData
      }
      this.preferencesService.savePreferences(paramObj, this.userId).then((response) => {
        this.messageService.showMessage('Miscellaneous preferences saved successfully.', 'success');
        this.getUpdatedPreferences.emit();
        resolve(true);
      }, (error) => {
        resolve(false);
      });
    });
  }

  /**
   * Line Helpo Communication Service
   * @author Ravi Shah
   * @param {string} title
   * @memberof MiscellaneousPreferencesComponent
   */
  informationLineHelp(title: string): void {
    this.lineHelp.body = this.lineHelp.body.replace(/<%=admin%>/g, this.isAdmin ? '' : 'd-none');
    this.communicationService.transmitData({
      topic: 'Preferences',
      channel: 'MTPO-LINE-HELP',
      data: this.lineHelp || {}
    });

  }

  ngOnInit() {
  }

}
