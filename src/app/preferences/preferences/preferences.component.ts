import { Component, OnInit, ViewChild } from '@angular/core';
import { PreferencesService } from '../preferences.service';
import { SystemConfigService, UserService } from '@app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { CloseConfirmationComponent } from '@app/shared/components/close-confirmation/close-confirmation.component';
import { DialogService, UtilityService, CommunicationService } from '@app/shared/services';
@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  @ViewChild('returnworkspacepreferencesInfo', { static: false }) returnworkspacepreferencesInfo: any;
  @ViewChild('clientorganizerpreferencesInfo', { static: false }) clientorganizerpreferencesInfo: any;
  // @ViewChild('colorpreferencesInfo', { static: false }) colorpreferencesInfo: any;
  @ViewChild('miscellaneouspreferencesInfo', { static: false }) miscellaneouspreferencesInfo: any;
  // @ViewChild('competitorpreferences', { static: true }) competitorpreferences: any;
  @ViewChild('themepreferencesInfo', { static: false }) themepreferencesInfo: any;

  public lineHelp: any = {
    "theme": {
      "title": "Theme",
      "body": "<p>Make MyTAXPrepOffice even more user-friendly by changing the look of the fields in the software (Theme Selection) and/or by adding a few of the same terms used in your previous software (Menu Hints Option).</p> <p class=\"<%=admin%>\">The <b>Applicable To</b> column shows that all users have the option to choose their own theme, but the previous software terms will apply to everyone in your firm. </p> <p>The <b>Options</b> column allows you to choose your previous software.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the <b>Cancel</b> button to go back to the Dashboard.</p>",
    },
    "dashboard": {
      "title": "Dashboard Settings",
      "body": "<p>MyTAXPrepOffice allows you to customize the Dashboard order, colors, and widget ratios. You can also choose to hide certain widgets.</p> <p class=\"<%=admin%>\">If you select Entire Firm, the Edit Settings button under Options will allow you to choose the Dashboard settings that will appear for every user in your firm.</p> <p class=\"<%=admin%>\">If you select Individual Locations, the Configure Office button will allow you to choose which Dashboard settings will appear for users in each of your firm’s locations.</p> <p class=\"<%=admin%>\">If you select Individual Users, the Edit Settings button under Options will allow each user to choose their own Dashboard settings.</p> <p>Clicking on <b>Edit Settings</b> under the <b>Options</b> column will take you to the Dashboard where you can click on the <b>Pencil</b> icon in the top right-hand corner of each widget to select the color, choose your widget ratio, or hide the widget. In the <b>Hidden Widgets</b> widget, simply click on a hidden widget to restore it to the dashboard.</p> <p>To rearrange the location of your widgets, place your cursor at the top of each widget until you see the four arrows. Then, drag and drop the widget to the desired location.</p> <p>Click Save to save your settings.</p> <p>Clicking on the three-dot icon in the <b>Recent Returns</b> widget will allow you to choose which returns are displayed. Click Ok to save your settings.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the <b>Cancel</b> button to go back to the Dashboard.</p>",
    },
    "client-organizer": {
      "title": 'Client Organizer',
      "body": '<p>Client organizers will assist you in gathering the necessary information from your tax clients to prepare their tax returns. </p> <p>According to the types of returns listed, you can choose a custom client organizer to appear each time you work on returns. You can also choose the Predefined 1040 Client Organizer to appear for 1040 returns. Additionally, under the <b>Actions</b> column dropdown menu in the Return List, you can print the client organizer for your client.</p> <p class="<%=admin%>">If you select Entire Firm, the dropdown menu under Options will allow you to choose the client organizers that will automatically appear for every user in your firm (according to the type of return being worked on).</p> <p class="<%=admin%>">If you select Individual Locations, the Configure Office button will allow you to choose which client organizers will automatically appear for the returns in each of your firm’s locations.</p> <p class="<%=admin%>">If you select Individual Users, the dropdown menu under Options will allow each user to choose the client organizers that will automatically appear for the returns they prepare.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the <b>Cancel</b> button to go back to the Dashboard.</p>',
    },
    "color": {
      "title": "Color Preferences",
      "body": "<p>Customize your color preferences for the Perform Review feature. This feature will show any errors in your return before you e-file. You can also customize the colors used in the areas where you enter information.</p> <p class=\"<%=admin%>\">The <b>Applicable To</b> column shows that all users have the option to choose their own color preferences.</p> <p>The <b>Value</b> column allows you to choose a color.</p> <p>The <b>Preview</b> column gives you a preview of your color choices.</p> <p>Be sure to press the Save button to save your changes. Press the Cancel button to go back to the Dashboard. Pressing the Reset button will restore the original MyTAXPrepOffice colors.</p>",
    },
    "return-workspace": {
      "title": 'Return Workspace',
      "body": '<p>With MyTAXPrepOffice, you are in control of the Return Workspace. You can determine how information will be displayed and set some automatic population and printing options. If you choose to automatically add state returns, you can also select the basis on which to add them.</p><p class=\"<%=admin%>\">The <b>Applicable To</b> column allows you to apply the Return Workspace settings to your entire firm or to locations of your choosing. You also have the choice to allow each user to determine their own Return Workspace settings.</p><p>The <b>Options</b> column allows you to make specific selections.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the <b>Cancel</b> button to go back to the Dashboard.</p>',
    }
  }

  public allPreferences: any = {};
  public refreshStart = false;
  public isLoading: boolean = false;
  public lookup: any;
  public userId: any;
  public userDetails: any;
  public option: any = 'theme';
  private allowedOption = ['return-workspace', 'client-organizer', 'dashboard', 'theme'];
  private screenOption = ['admin', 'user'];
  public isAdmin = false;
  public view: any = {
    office: false,
    user: false,
    customer: false
  }
  public officeList: any = [];
  public actuleAllPreferences: any = {};

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private preferencesService: PreferencesService, private systemConfigService: SystemConfigService, private router: Router,
    private dialogService: DialogService, private utilityService: UtilityService, private communicationService: CommunicationService, private systemConfig: SystemConfigService) { }


  /**
   * @author Ravi Shah
   * Initialize the Default Options
   * @param {*} preference
   * @param {*} response
   * @memberof PreferencesComponent
   */
  initDefault(preference, response) {
    if (preference === 'clientOrganizer') {
      this.allPreferences[preference] = {};
      if (!this.lookup.packages) {
        this.lookup.packages = this.systemConfigService.getReleasedPackages();
      }
      for (let packages of this.lookup.packages) {
        if (response[preference] && response[preference][packages.id]) {
          if (this.officeList && this.officeList.length === 1) {
            this.allPreferences[preference][packages.id] = {
              rightModel: response[preference][packages.id].rightModel,
              isGlobal: true,
              value: (response[preference][packages.id].locations && response[preference][packages.id].locations.length > 0) ? response[preference][packages.id].locations[0].value : undefined,

            };
          } else {
            this.allPreferences[preference][packages.id] = {
              rightModel: response[preference][packages.id].rightModel,
              isGlobal: true,
              value: response[preference][packages.id].value,
              locations: response[preference][packages.id].locations,
            };
          }

        } else {
          this.allPreferences[preference][packages.id] = {
            rightModel: this.preferencesService.roles.user,
            isGlobal: true,
            value: ''
          };
        }

      }
    } else {
      this.allPreferences[preference] = JSON.parse(JSON.stringify(this.preferencesService.defaultPreferences[preference]));
    }
  }

  /**
   * @author Ravi Shah
   * Prepare the Preference  Object
   * @param {*} response
   * @memberof PreferencesComponent
   */
  prepareObject(response) {
    if (response && Object.keys(response)) {
      for (let preference in this.preferencesService.defaultPreferences) {
        if (response[preference] && Object.keys(response[preference]).length > 0) {
          if (preference === 'clientOrganizer') {
            this.initDefault(preference, response);
          } else {
            this.allPreferences[preference] = {};
            for (let key in this.preferencesService.defaultPreferences[preference]) {
              if (response[preference] && response[preference][key]) {
                if (response[preference][key].rightModel === 1 && this.officeList && this.officeList.length === 1) {
                  this.allPreferences[preference][key] = {
                    rightModel: response[preference][key].rightModel === undefined ? 2 : response[preference][key].rightModel,
                    isGlobal: true,
                    value: (response[preference][key].locations && response[preference][key].locations.length > 0) ? response[preference][key].locations[0].value : undefined,
                    settings: (response[preference][key].settings === undefined && preference === 'color') ? 'border' : response[preference][key].settings
                  };
                } else {
                  this.allPreferences[preference][key] = {
                    rightModel: response[preference][key].rightModel === undefined ? 2 : response[preference][key].rightModel,
                    isGlobal: true,
                    value: response[preference][key].value || this.preferencesService.defaultPreferences[preference][key].value,
                    locations: response[preference][key].locations || this.preferencesService.defaultPreferences[preference][key].locations,
                    settings: (response[preference][key].settings === undefined && preference === 'color') ? this.preferencesService.defaultPreferences[preference][key].settings : response[preference][key].settings
                  };
                }
              } else {
                this.initDefault(preference, response);
              }
            }
          }
        } else {
          this.initDefault(preference, response);
        }
      }
    } else {
      this.allPreferences = JSON.parse(JSON.stringify(this.preferencesService.defaultPreferences));
    }
  }

  /**
   * Updates the Rights of the Preferences
   * @author Ravi Shah
   * @memberof PreferencesComponent
   */
  public updateRights() {
    for (let preference in this.allPreferences) {
      for (let key in this.allPreferences[preference]) {
        if (this.allPreferences[preference][key].rightModel === 0) {
          if (this.view.customer) {
            this.allPreferences[preference][key].disable = false;
          } else {
            this.allPreferences[preference][key].disable = true;
          }
        } else if (this.allPreferences[preference][key].rightModel === 1) {
          if (this.view.customer || this.view.office) {
            this.allPreferences[preference][key].disable = false;
          } else {
            this.allPreferences[preference][key].disable = true;
          }
        } else if (this.allPreferences[preference][key].rightModel === 2) {
          this.allPreferences[preference][key].disable = false;
        }
      }
    }
  }

  /**
   * @author Ravi Shah
   * Get All Preferences for the Screen
   * @param {boolean} [isOnInit]
   * @memberof PreferencesComponent
   */
  getAllPreferences(isOnInit?: boolean) {
    this.allPreferences = undefined;
    this.preferencesService.getPreferences(this.userId).then((response) => {
      this.allPreferences = {};
      this.prepareObject(response);
      this.updateRights();
      this.setDefaults();
      if (!isOnInit) {
        this.refreshStart = false;
      }
      this.actuleAllPreferences = JSON.parse(JSON.stringify(this.allPreferences));
      this.isLoading = false;
    })
  }

  public updateAutoAddStatePreferences(tag) {
    var configData: any = {};
    var autoAddStateConfig = this.systemConfig.getAutoAddStatePreferences();
    //Format object according to decision from dialog
    for (let key in autoAddStateConfig) {
      if (autoAddStateConfig[key].options.indexOf(tag) > -1) {
        autoAddStateConfig[autoAddStateConfig[key].fieldName].value = true;
      }
    }
    //Assign formatted object
    configData.all = false;
    if (tag == 3) {
      configData.all = true;
    }
    configData.individual = autoAddStateConfig;
    configData.tag = tag;
    this.allPreferences.returnWorkspace.autoAddState.value = configData;
  }

  public setDefaults() {
    if (this.lookup.preparerList && this.lookup.preparerList.length === 2) {
      this.allPreferences.returnWorkspace.defaultPreparer = this.lookup.preparerList[1];
    }
    if (!(this.allPreferences.returnWorkspace.autoAddState.value && Object.keys(this.allPreferences.returnWorkspace.autoAddState.value).length > 0)) {
      this.updateAutoAddStatePreferences(4);
    }
  }

  public initializePreferences(isOnInit?: boolean) {
    this.isLoading = true;
    if (!isOnInit) {
      this.refreshStart = true;
    }
    this.preferencesService.getAllLookup().then((response: any) => {
      this.lookup = response;
      this.officeList = response.officeList;
      this.getAllPreferences(isOnInit);
    });
  }

  /**
 * @author Asrar Memon
 * check user has change any data
 * @returns
 * @memberof PreferencesComponent
 */
  haveUnsavedChanges() {
    const allowedOption = ['return-workspace', 'client-organizer', 'color', 'dashboard', 'competitor', 'theme'];
    const currentTabVar = ['returnWorkspace', 'clientOrganizer', 'color', 'miscellaneous', 'competitorPreferences', 'themePreferences'];
    const index = allowedOption.indexOf(this.option);
    if (index > -1) {
      if (this.actuleAllPreferences[currentTabVar[index]] && this.allPreferences[currentTabVar[index]]) {
        const obj1 = JSON.parse(JSON.stringify(this.actuleAllPreferences[currentTabVar[index]]));
        const obj2 = JSON.parse(JSON.stringify(this.allPreferences[currentTabVar[index]]));
        return !this.utilityService.checkObjectEquals(obj1, obj2);
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  updatePreferences() {
    this.actuleAllPreferences = JSON.parse(JSON.stringify(this.allPreferences));
  }

  /**
   * @author Asrar Memon
   * Save Before the Route Change
   * @returns
   * @memberof PreferencesComponent
   */
  saveBeforeRouteChange() {
    return new Promise((resolve, reject) => {
      switch (this.option) {
        case 'return-workspace':
          this.returnworkspacepreferencesInfo.savePreferences().then((value) => {
            resolve(true);
          });
          break;
        case 'client-organizer':
          this.clientorganizerpreferencesInfo.savePreferences().then((value) => {
            resolve(true);
          });
          break;
        case 'dashboard':
          this.miscellaneouspreferencesInfo.savePreferences().then((value) => {
            resolve(true);
          });
          break;
        case 'competitor':
          resolve(true);
          // this.competitorpreferences.savePreferences().then((value) => {
          //   resolve(true);
          // });
          break;
        case 'theme':
          this.themepreferencesInfo.savePreferences().then((value) => {
            resolve(true);
          });
          break;
        default:
          resolve(true);
      }
      // this.saveDashboardSettings(false).then((result) => {
      //   resolve(true);
      // }, error => {
      //   reject(false);
      // });
    });
  }

  /**
   * @author Asrar Memon
   * Save Before the Route Change
   * @returns
   * @memberof PreferencesComponent
   */
  tabChangeAskForSave() {
    return new Promise((resolve, reject) => {
      if (this.haveUnsavedChanges()) {
        this.dialogService.custom(CloseConfirmationComponent, {}, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' })
          .result.then((result: boolean) => {
            if (result === true) {
              // save here
              this.saveBeforeRouteChange().then(() => {
                resolve(true);
                this.actuleAllPreferences = JSON.parse(JSON.stringify(this.allPreferences));
              }, error => {
                reject(false);
              });

            } else {
              resolve(true);
            }
          }, (error) => {
          })
      } else {
        this.allPreferences = JSON.parse(JSON.stringify(this.actuleAllPreferences));
        resolve(true);
      }
    });
  }

  public changeTab(tabName) {
    this.tabChangeAskForSave().then(() => {
      this.option = tabName;
      this.informationLineHelp(this.option);
    });
  }

  /**
   * @author Mansi Makwana
   * To Redirect Home Screen
   * @memberof PreferencesComponent
   */
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  informationLineHelp(options) {
    this.lineHelp[options].body = this.lineHelp[options].body.replace(/<%=admin%>/g, this.isAdmin ? '' : 'd-none');
    this.communicationService.transmitData({
      topic: 'Preferences',
      channel: 'MTPO-LINE-HELP',
      data: this.lineHelp[options] || {}
    });
  }


  /**
   * @author Ravi Shah
   * On Initialize of the component
   * @memberof PreferencesComponent
   */
  ngOnInit() {
    this.isLoading = true;
    this.activatedRoute.paramMap.subscribe((params: any) => {
      if (params.params.option) {
        if (this.allowedOption.includes(params.params.option)) {
          this.option = params.params.option;
        } else {
          this.option = 'theme';
        }
      } else {
        this.option = 'theme';
      }
      this.informationLineHelp(this.option);
      this.userDetails = this.userService.getUserDetails();
      this.isAdmin = params.params.screen === 'admin';

      this.userId = this.userDetails.key;
      if (this.userDetails.isAdministrator || this.userDetails.isContractContact) {
        this.view.customer = true
      } else if (this.userService.is('Admin')) {
        this.view.office = true
      } else {
        this.view.user = true;
      }
      this.initializePreferences(true);
    });
  }
}
