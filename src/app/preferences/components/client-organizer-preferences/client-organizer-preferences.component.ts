import { Component, OnInit, Pipe, PipeTransform, Input, Output, EventEmitter } from '@angular/core';
import { MessageService, UserService, DialogService } from '@app/shared/services';
import { Router } from '@angular/router';
import { PreferencesService } from '@app/preferences/preferences.service';
import { PerOfficeConfigurationDialogComponent } from '@app/preferences/dialogs/per-office-configuration-dialog/per-office-configuration-dialog.component';
import { CommunicationService } from '@app/shared/services/communication.service';

@Component({
  selector: 'app-client-organizer-preferences',
  templateUrl: './client-organizer-preferences.component.html',
  styleUrls: ['./client-organizer-preferences.component.scss']
})
export class ClientOrganizerPreferencesComponent implements OnInit {

  @Input() clientOrganizerPreferences: any = {};
  @Input() userId: any;
  @Input() userDetails: any = {};
  @Input() lookup: any;
  @Input() officeList: any = [];
  @Input() view: any = {};
  @Output() getUpdatedPreferences = new EventEmitter();
  @Input() isAdmin: any = false;

  public lineHelp = {
    title: 'Client Organizer',
    body: '<p>Client organizers will assist you in gathering the necessary information from your tax clients to prepare their tax returns. </p> <p>According to the types of returns listed, you can choose a custom client organizer to appear each time you work on returns. You can also choose the Predefined 1040 Client Organizer to appear for 1040 returns. Additionally, under the <b>Actions</b> column dropdown menu in the Return List, you can print the client organizer for your client.</p> <p class="<%=admin%>">If you select Entire Firm, the dropdown menu under Options will allow you to choose the client organizers that will automatically appear for every user in your firm (according to the type of return being worked on).</p> <p class="<%=admin%>">If you select Individual Locations, the Configure Office button will allow you to choose which client organizers will automatically appear for the returns in each of your firm’s locations.</p> <p class="<%=admin%>">If you select Individual Users, the dropdown menu under Options will allow each user to choose the client organizers that will automatically appear for the returns they prepare.</p><p>Be sure to press the <b>Save</b> button to save your changes. Press the Cancel button to go back to the Dashboard.</p>',
    tooltip: 'Client organizers will assist you in gathering the necessary information from your tax clients to prepare their tax returns. According to the types of returns listed, you can choose a custom client organizer to appear each time you work on returns. You can also choose the Predefined 1040 Client Organizer to appear for 1040 returns. For additional help, click on the i icon and see the information under Line Help on the right-hand side of your screen.'
  }
  public rolesModel = [{ id: 0, name: 'Entire Firm' }, { id: 1, name: 'Individual Locations' }, { id: 2, name: 'Individual Users' }];
  constructor(private communicationService: CommunicationService, private router: Router, private preferencesService: PreferencesService, private messageService: MessageService, private userService: UserService, private dialogservice: DialogService) { }

  gotoHome() {
    this.router.navigate(['home']);
  }

  openConfigurationDialog(key, controlType, lookup) {
    this.dialogservice.custom(PerOfficeConfigurationDialogComponent, { key, controlType, lookup, locations: this.clientOrganizerPreferences[key].locations, officeList: this.officeList }, { size: 'lg' })
      .result.then((filterParams: any) => {
        if (filterParams) {
          this.clientOrganizerPreferences[key].locations = filterParams;
          this.clientOrganizerPreferences[key].value = undefined;
        }
      });
  }

  updatRole(rightModel: number, property: string) {
    if ((this.view.user && rightModel >= 2) || (this.view.office && rightModel >= 1) || (this.view.customer && rightModel >= 0)) {
      this.clientOrganizerPreferences[property].rightModel = rightModel;
      this.clientOrganizerPreferences[property].value = undefined;
    } else {
      this.messageService.showMessage("This settings can be modified by your administrator. Please contact them for any changes.", "error");
    }
  }

  savePreferences(IsFromTab?: boolean) {
    return new Promise((resolve, reject) => {
      let savePreferencesData = JSON.parse(JSON.stringify(this.clientOrganizerPreferences));
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
        clientOrganizer: savePreferencesData
      }
      this.preferencesService.savePreferences(paramObj, this.userId).then((response) => {
        if (IsFromTab) {
          this.getUpdatedPreferences.emit();
        }
        this.messageService.showMessage('Client organizer preference saved successfully.', 'success');
        resolve(true);
      }, (error) => {
        resolve(false);
      });
    });
  }

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