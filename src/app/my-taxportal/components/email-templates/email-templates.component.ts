import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MessageService, UserService, DialogService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { PreviewMailComponent } from '@app/my-taxportal/dialogs/preview-mail/preview-mail.component';

@Component({
  selector: 'app-email-templates',
  templateUrl: './email-templates.component.html',
  styleUrls: ['./email-templates.component.scss']
})
export class EmailTemplatesComponent implements OnInit {

  @Input() settings: any = {};
  @Output() settingsChange: EventEmitter<any> = new EventEmitter<any>();

  public mode: string = 'view';
  public permission: any = {};
  private preserveEmailTemplate: string;

  constructor(private messageService: MessageService, private userService: UserService, private dialogService: DialogService, private myTaxPortalService: MyTaxportalService) { }

  /**
   * @author Ravi Shah
   * Save Settings
   * @memberof EmailTemplatesComponent
   */
  public saveSettings() {
    this.myTaxPortalService.saveSettings(this.settings).then(() => {
      this.mode = 'view';
      this.preserveEmailTemplate = JSON.parse(JSON.stringify(this.settings.emailTemplates));
      this.messageService.showMessage('Settings saved successfully.', 'success');
    })
  }

  /**
   * @author Ravi Shah
   * Preview Mail
   * @memberof EmailTemplatesComponent
   */
  public previewMail() {
    let settingsData = JSON.parse(JSON.stringify(this.settings));
    for (var index in this.settings.emailTemplates) {
      settingsData.invEmailSub = this.settings.emailTemplates[index].subject;
      settingsData.invEmailBody = this.settings.emailTemplates[index].body;
    }
    this.dialogService.custom(PreviewMailComponent, { settings: settingsData, clientDetails: { firstName: '<Client Name>', lastName: '' } }, { 'keyboard': false, 'backdrop': false, 'size': 'lg' });
  }

  /**
   * @author Ravi Shah
   * Switch to Edit Mode
   * @memberof EmailTemplatesComponent
   */
  public switchToEditMode() {
    if (this.mode === 'view') {
      this.preserveEmailTemplate = JSON.parse(JSON.stringify(this.settings.emailTemplates));
      this.mode = 'edit';
    } else {
      this.settings.emailTemplates = this.preserveEmailTemplate;
      this.mode = 'view';
    }
  }

  ngOnInit() {
    this.permission = {
      canSettingSave: this.userService.can('CAN_SAVE_CLIENT_SETTING')
    }
  }

}
