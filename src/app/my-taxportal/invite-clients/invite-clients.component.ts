import { Component, OnInit } from '@angular/core';
import { MyTaxportalService } from '../my-taxportal.service';
import { Router } from '@angular/router';
import { UserService, DialogService, MessageService } from '@app/shared/services';
import { PreviewMailComponent } from '../dialogs/preview-mail/preview-mail.component';

@Component({
  selector: 'app-invite-clients',
  templateUrl: './invite-clients.component.html',
  styleUrls: ['./invite-clients.component.scss']
})
export class InviteClientsComponent implements OnInit {

  public settings: any = {};
  public permission: any = {};
  private clientSelectedForInvitation: any = [];
  public showManageClientScreenBasedOnTaxYear: boolean;
  public taxYear: any;
  public isApiCalled: any;
  public isSendingInvitation: boolean = false;

  constructor(private messageService: MessageService, private dialogService: DialogService, private userService: UserService, private router: Router, private myTaxportalService: MyTaxportalService) { }

  /**
   * @author Ravi Shah
   * Go to Home
   * @memberof InviteClientsComponent
   */
  public gotoHome() {
    this.router.navigate(['home']);
  }

  /**
 * @author Ravi Shah
 * Get Client Portal Settings
 * @private
 * @memberof MyTaxportalSettingsComponent
 */
  private getSettings() {
    this.myTaxportalService.getSettings().then((response: any) => {
      this.myTaxportalService.getQuestionSet(response.selectedQuestionSet).then((result: any) => {
        if (response && response.emailTemplates && response.emailTemplates.length > 0) {
          response.invEmailSub = response.emailTemplates[0].subject ? response.emailTemplates[0].subject : undefined;
          response.invEmailBody = response.emailTemplates[0].body ? response.emailTemplates[0].body : undefined;
        }
        this.settings = response;
        if (response.questionSets && response.questionSets.length > 0) {
          var questionSetExists = response.questionSets.findIndex((obj) => {
            return obj.id === response.selectedQuestionSet;
          });
          if (questionSetExists !== -1) {
            this.settings.questionTitle = response.questionSets[questionSetExists].title;
            this.settings.selectedQuestionSet = response.selectedQuestionSet;
          }
          this.updateEmailTemplate();
          this.settings.changedQuestionSet = result;
          this.settings.changedQuestionSet.questionDocId = response.selectedQuestionSet;
        } else {
          this.settings.questionTitle = undefined;
        }
        this.isApiCalled = false;
      }, error => {
        this.isApiCalled = false;
      });
    }, error => {
      this.isApiCalled = false;
    })
  }


  /**
   * @author Ravi Shah
   * Call on Settings Change
   * @memberof MyTaxportalSettingsComponent
   */
  public updateEmailTemplate() {
    let renderEle = document.getElementById('render-email-template')
    if (renderEle) {
      if (this.settings.emailTemplates) {
        renderEle.innerHTML = this.settings.emailTemplates[0].body;
      } else {
        renderEle.innerHTML = '';
      }
      var companyEle = renderEle.getElementsByTagName('span');
      if (companyEle && companyEle.length > 0) {
        companyEle[0].innerHTML = this.settings.companyName ? this.settings.companyName : '&lt;Tax Preparer Company Name&gt;';
      }
      var ele = document.getElementById('render-email-template').innerHTML;
      this.settings.emailTemplates[0].body = ele;
      this.settings.invEmailBody = ele;
    }
  }

  /**
   * @author Ravi Shah
   * Preview Mail on Invitation
   * @memberof InviteClientsComponent
   */
  public previewMail() {
    if (this.clientSelectedForInvitation && this.clientSelectedForInvitation.length > 0) {
      this.dialogService.custom(PreviewMailComponent, { settings: this.settings, clientDetails: this.clientSelectedForInvitation[0] }, { 'keyboard': false, 'backdrop': false, 'size': 'lg' }).result.then(() => { });
    } else {
      this.messageService.showMessage('Please select at least one client in order to preview mail.', 'error');
    }
  }

  /**
   * @author Ravi Shah
   * Navigate to specific Url
   * @memberof InviteClientsComponent
   */
  public gotoRoute(url: any) {
    this.router.navigate(url);
  }

  public selectClientEmit(selectedClient: any) {
    this.clientSelectedForInvitation = selectedClient;
  }

  public sendInviteClientData() {
    this.isSendingInvitation = true;
    if (this.settings.invEmailSub && this.settings.invEmailBody && (this.settings.selectedQuestionSet || this.settings.changedQuestionSet)) {
      if (this.clientSelectedForInvitation && this.clientSelectedForInvitation.length > 0) {
        let emailDataToSendclients = JSON.parse(JSON.stringify(this.clientSelectedForInvitation));
        for (var i = 0; i < emailDataToSendclients.length; i++) {
          emailDataToSendclients[i].emailSubject = this.settings.invEmailSub;
          emailDataToSendclients[i].emailBody = this.settings.invEmailBody;
          emailDataToSendclients[i].questionDocId = this.settings.selectedQuestionSet;
          emailDataToSendclients[i].changedQuestionSet = this.settings.changedQuestionSet;
        }
        this.myTaxportalService.sendInvitation(emailDataToSendclients).then((result) => {
          this.isSendingInvitation = false;
          this.router.navigate(['mytaxportal', 'manage-invited-clients']);
        }, error => {
          this.isSendingInvitation = false;
        });
      } else {
        this.isSendingInvitation = false;
        this.messageService.showMessage('Please select at least one client to send invitation.', 'error', 'ERROR_MSG', 0);
      }
    } else {
      this.isSendingInvitation = false;
      if (!this.settings.invEmailSub) {
        this.messageService.showMessage('Please enter the email subject.', 'error', 'ERROR_MSG');
      } else if (!this.settings.invEmailBody) {
        this.messageService.showMessage('Please enter the email body.', 'error', 'ERROR_MSG');
      } else if (!this.settings.selectedQuestionSet && !this.settings.selectedQuestionSet) {
        this.messageService.showMessage('Please select the question set.', 'error', 'ERROR_MSG');
      }
    }
  }

  ngOnInit() {
    this.isApiCalled = true;
    this.taxYear = this.userService.getTaxYear();
    this.showManageClientScreenBasedOnTaxYear = this.myTaxportalService.canClientPortalAccess();
    if (this.showManageClientScreenBasedOnTaxYear) {
      this.getSettings();
      this.permission = {
        canInviteClient: this.userService.can('CAN_INVITE_CLIENT')
      }
    } else {
      this.isApiCalled = false;
    }
  }

}
