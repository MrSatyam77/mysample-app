import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService, DialogService, UserService, SystemConfigService } from '@app/shared/services';
import { CommunicationService } from '@app/shared/services/communication.service';
import { Router } from '@angular/router';
import { PreferencesService } from '@app/preferences/preferences.service';
import { PerOfficeConfigurationDialogComponent } from '@app/preferences/dialogs/per-office-configuration-dialog/per-office-configuration-dialog.component';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-return-workspace-preferences',
  templateUrl: './return-workspace-preferences.component.html',
  styleUrls: ['./return-workspace-preferences.component.scss']
})
export class ReturnWorkspacePreferencesComponent implements OnInit {

  @Input() returnWorkspacePreferences: any;
  @Input() userId: any;
  @Input() userDetails: any = {};
  @Input() lookup: any;
  @Input() officeList: any = [];
  @Input() isAdmin: any = false;
  @Input() view: any = {};
  @Output() getUpdatedPreferences = new EventEmitter();

  public returnWorkspaceRoleConfiguration: any = {
    defaultPreparer: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    priceList: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    autoSaveEIN: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    passwordProtectedReturn: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    wrapText: [{ id: 2, name: 'Individual Users' }],
    doNotAskforConfirmDlg: [{ id: 2, name: 'Individual Users' }],
    autoAddState: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    clientLetter: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    eFileTransmissionDialogue: [{ id: 2, name: 'Individual Users' }],
    autoSaveOccupation: [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }],
    printPacket: [{ id: 2, name: 'Individual Users' }],
    returnStatus: [{ id: 2, name: 'Individual Users' }]
  }

  public lineHelp: any = {
    pricelist: {
      title: 'Default Price List',
      body: "<p>MyTAXPrepOffice gives you the ability to create unlimited custom price lists that will automatically populate in the invoice of each return prepared in the software. Inside the Return Workspace, you can also manually choose a different price list instead of the price list that automatically populates.</p> <p>When you open a return or create a new return, you will find the price list by clicking on <b>Invoice</b> under the <b>Other</b> section of the Forms Navigator.</p> <p class='<%=admin%>'>If you select Entire Firm, the dropdown menu under Options will allow you to choose the price list that will automatically populate for every user in your firm.</p> <p class='<%=admin%>'>If you select Individual Locations, the Configure Office button will allow you to choose the price list that will automatically populate in the returns for each of your firm’s locations. </p> <p class='<%=admin%>'>If you select Individual Users, the dropdown menu under Options will allow each user to choose which price list will automatically populate in the returns they prepare. </p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: 'MyTAXPrepOffice gives you the ability to create unlimited custom price lists that will automatically populate in the invoice of each return prepared in the software. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
    },
    defaultpreparer: {
      title: 'Default Preparer',
      body: "<p>MyTAXPrepOffices uses preparer information to complete PIN signatures, PTINs, and special preparer credentials for New York and Oregon. </p> <p>Selecting a preparer as your default preparer will ensure that the information for the preparer of your choosing will automatically populate to the <b>Preparer</b> section of each return. Inside the Return Workspace, you can also manually choose a different preparer’s information to populate instead of the default preparer’s information.</p> <p class='<%=admin%>'>If you select Entire Firm, the dropdown menu under Options will allow you to choose the preparer information that will automatically populate for every user in your firm.</p> <p class='<%=admin%>'>If you select Individual Locations, the Configure Office button will allow you to choose the preparer information that will automatically populate in the returns for each of your firm’s locations. </p> <p class='<%=admin%>'>If you select Individual Users, the dropdown menu under Options will allow each user to choose the preparer information that will automatically populate in each return they prepare.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: 'Selecting a preparer as your default preparer will ensure that the information for the preparer of your choosing will automatically populate to the Preparer section of each return. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
    },
    saveein: {
      title: 'Auto-save EIN in EIN library for W2, 1099, and other similar forms?',
      body: "<p>Enable the EIN Auto-Save feature to save the data entered into the EIN library. The next time the same EIN is used, MyTAXPrepOffice will automatically complete the name and address fields in the return. </p> <p class='<%=admin%>'>If you select Entire Firm, you can choose whether or not to enable the EIN Auto-Save feature for every user in your firm.</p> <p class='<%=admin%>'>If you select Individual Locations, the Configure Office button will allow you to choose the locations for which you will enable or disable the EIN Auto-Save feature.</p> <p class='<%=admin%>'>If you select Individual Users, each user can choose whether or not to enable the EIN Auto-Save feature.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: 'Enable the EIN Auto-Save feature to save the data entered into the EIN library. The next time the same EIN is used, MyTAXPrepOffice will automatically complete the name and address fields in the return. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
    },
    passwordprotect: {
      title: 'Would you like to password protect returns when printing?',
      body: "<p>When this option is enabled, a password will always be required before printing. </p> <p class='<%=admin%>'>If you select Entire Firm, you can choose whether or not every user in your firm will be required to enter a password before printing.</p> <p class='<%=admin%>'>If you select Individual Locations, the Configure Office button will allow you to choose which locations will require a password before printing and which locations will not require a password before printing.</p> <p class='<%=admin%>'>If you select Individual Users, each user will choose whether or not a password will be required before printing.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: 'When this option is enabled, a password will always be required before printing. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
    },
    wraptext: {
      title: 'Wrap Text',
      body: "<p>Enabling the Wrap Text feature will allow all text in the Return Workspace to show. The text will be displayed in multiple lines. If this feature is not enabled, you will not be able to see the complete text unless you hover your mouse over the existing content.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: 'Enabling the Wrap Text feature will allow all text in the Return Workspace to show. The text will be displayed in multiple lines. If this feature is not enabled, you will not be able to see the complete text unless you hover your mouse over the existing content.'
    },
    confirmationdailog: {
      title: 'Confirmation Dialog',
      body: "<p>This option can be enabled to ensure that you do not receive pop-up messages that confirm certain actions you take in the software (e.g. \"Do you want to close this return?\"). We advise you not to disable the confirmation dialog boxes until you are familiar with MyTAXPrepOffice.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: "This option can be enabled to ensure that you do not receive pop-up messages that confirm certain actions you take in the software (e.g. \"Do you want to close this return?\"). We advise you not to disable the confirmation dialog boxes until you are familiar with MyTAXPrepOffice."
    },
    addstate: {
      title: 'Auto-add state return based on:',
      body: "<p>Enable this feature to automatically add all the main forms for a state to the federal return. You can choose to automatically add the state forms based on the address entered in the Client Information Sheet, W2, or both. </p> <p>Select the \"Do not auto-add state return\" checkbox to disable this feature.</p> <p class='<%=admin%>'>If you select Entire Firm, you can choose the auto-add state return basis for every user in your firm. </p> <p class='<%=admin%>'>If you select Individual Locations, the Configure Office button will allow you to choose the auto-add state return basis for each of your locations.</p> <p class='<%=admin%>'>If you select Individual Users, each user can choose the auto-add state return basis for the returns they prepare.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: 'Enable this feature to automatically add all the main forms for a state to the federal return. You can choose to automatically add the state forms based on the address entered in the Client Information Sheet, W2, or both. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
    },
    clientletter: {
      title: 'Client Letter',
      body: "<p>MyTAXPrepOffice will automatically insert the predefined client letter depending on the tax scenario you are preparing, into the Other section of the Forms Navigator. In addition to the predefined client letters, you can create unlimited custom client letters.  Default your customized client letter from the drop-down menu.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>"
    },
    printpacket: {
      title: 'Print Packet',
      body: "<p>MyTAXPrepOffice provides three predefined print packets: Filing Copy, Client Copy, and Preparer Copy. In addition to the predefined print packets, you can create a custom print packet. </p> <p>You can choose one of these print packets to automatically print each time a return is printed. Inside the Return Workspace, you can also manually choose a different print packet instead of the print packet that you chose to automatically print.</p> <p>Clicking on Edit Settings will take you to the <b>Print Packets</b> screen. Under Print Packet, you can choose Filing Copy, Client Copy, Preparer Copy, or Custom Copy. </p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>",
      tooltip: "MyTAXPrepOffice provides three predefined print packets: Filing Copy, Client Copy, and Preparer Copy. In addition to the predefined print packets, you can create a custom print packet. You can choose one of these print packets to automatically print each time a return is printed. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen."
    },
    returnStatus: {
      title: 'Return Status',
      body: "",
      tooltip: ""
    }
  }

  constructor(private systemConfig: SystemConfigService, private communicationService: CommunicationService, private router: Router, private preferencesService: PreferencesService, private messageService: MessageService, private dialogservice: DialogService, private userService: UserService) { }

  /**
 * @author Heena
 * @description this method check environment mode
 */
  public betaOnly() {
    if (environment.mode == 'beta' || environment.mode == 'local') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author Ravi Shah
   * Redirect to Home
   * @memberof ReturnWorkspacePreferencesComponent
   */
  gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * Route to Print Packet Settings
   * @author Ravi Shah
   * @param {*} rightModel
   * @memberof ReturnWorkspacePreferencesComponent
   */
  goToPrintPacketSettings(rightModel) {
    if (rightModel === 1) {
      this.router.navigate(['manage', 'templates', rightModel, this.officeList[0].id]);
    } else {
      this.router.navigate(['manage', 'templates', rightModel]);
    }
  }

  /**
   * @author Ravi Shah
   * Open Office Configuration Dialog
   * @param {*} key
   * @param {*} controlType
   * @param {*} lookup
   * @memberof ReturnWorkspacePreferencesComponent
   */
  openConfigurationDialog(key, controlType, lookup) {
    this.dialogservice.custom(PerOfficeConfigurationDialogComponent, { key, controlType, lookup, locations: this.returnWorkspacePreferences[key].locations, officeList: this.officeList }, { 'keyboard': false, 'backdrop': false, 'size': 'lg' })
      .result.then((filterParams: any) => {
        if (filterParams) {
          this.returnWorkspacePreferences[key].locations = filterParams;
          this.returnWorkspacePreferences[key].value = undefined;
        }
      });
  }

  /**
   * check roles on changes
   * @author Ravi Shah
   * @param {number} rightModel
   * @param {string} property
   * @memberof ReturnWorkspacePreferencesComponent
   */
  updatRole(rightModel: number, property: string) {
    if ((this.view.user && rightModel >= 2) || (this.view.office && rightModel >= 1) || (this.view.customer && rightModel >= 0)) {
      this.returnWorkspacePreferences[property].rightModel = rightModel;
      this.returnWorkspacePreferences[property].value = this.preferencesService.defaultPreferences.returnWorkspace[property].value;
    } else {
      this.messageService.showMessage("This settings can be modified by your administrator. Please contact them for any changes.", "error");
    }
  }

  /**
   * @author Ravi Shah
   * Save Preferences on Button Click
   * @memberof ReturnWorkspacePreferencesComponent
   */
  savePreferences(isFromTab?: boolean) {
    return new Promise((resolve, reject) => {
      let savePreferencesData = JSON.parse(JSON.stringify(this.returnWorkspacePreferences));
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
        returnWorkspace: savePreferencesData
      }
      this.preferencesService.savePreferences(paramObj, this.userId).then((response) => {
        this.messageService.showMessage('Return workspace preference saved successfully.', 'success');
        this.getUpdatedPreferences.emit();
        resolve(true);
      }, (error) => {
        resolve(true);
      });
    });
  }

  /**
   * update auto add state object
   * @author Ravi Shah
   * @param {*} tag
   * @memberof ReturnWorkspacePreferencesComponent
   */
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
    this.returnWorkspacePreferences.autoAddState.value = configData;
  }

  /**
   * Line Help Communication Service
   * @author Ravi Shah
   * @param {string} title
   * @returns {void}
   * @memberof ReturnWorkspacePreferencesComponent
   */
  public informationLineHelp(title: string): void {
    this.lineHelp[title].body = this.lineHelp[title].body.replace(/<%=admin%>/g, this.isAdmin ? '' : 'd-none');
    return this.communicationService.transmitData({
      topic: 'Preferences',
      channel: 'MTPO-LINE-HELP',
      data: this.lineHelp[title] || {}
    });
  }
  ngOnInit() {

  }

  ngOnChanges() {
    // if (this.lookup.preparerList && this.lookup.preparerList.length === 2) {
    //   this.returnWorkspacePreferences.defaultPreparer = this.lookup.preparerList[1];
    // }
    // if (!(this.returnWorkspacePreferences.autoAddState.value && Object.keys(this.returnWorkspacePreferences.autoAddState.value).length > 0)) {
    //   this.updateAutoAddStatePreferences(4);
    // }
  }
}
