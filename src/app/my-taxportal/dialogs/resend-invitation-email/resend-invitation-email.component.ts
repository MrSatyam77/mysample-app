import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-resend-invitation-email',
  templateUrl: './resend-invitation-email.component.html',
  styleUrls: ['./resend-invitation-email.component.scss']
})
export class ResendInvitationEmailComponent implements OnInit {

  public data: any;
  public resendInvitationForm: FormGroup;
  public changingEmailMandatory = [202, 400, 402, 500, 501, 502, 503, 504, 505];
  constructor(private messageService: MessageService, private myTaxportalService: MyTaxportalService, private activeModal: NgbActiveModal, private fb: FormBuilder) { }

  /**
   * @author Ravi Shah
   * Close the Dialog
   * @memberof PreviewMailComponent
   */
  public close() {
    this.activeModal.close();
  }

  /**
   * @author Ravi Shah
   * Resend Invitation Email
   * @memberof ResendInvitationEmailComponent
   */
  public resendEmail() {
    let allowSendingMail = false;
    if (this.data.clientData.status === 'Failed') {
      if (this.data.clientData.errorCode) {
        if (this.changingEmailMandatory.includes(this.data.clientData.errorCode) && this.resendInvitationForm.valid && this.resendInvitationForm.value.newEmail.toLowerCase() === this.resendInvitationForm.value.oldEmail.toLowerCase()) {
          allowSendingMail = false;
        } else {
          allowSendingMail = true;
        }
      } else {
        allowSendingMail = true;
      }
    } else {
      allowSendingMail = true;
    }

    var apiParam = this.resendInvitationForm.value;
    var existingClient = this.data.allClients.filter((obj) => {
      return obj.email === apiParam.newEmail && obj.clientId !== apiParam.clientId;
    });
    const self = this;
    if (allowSendingMail && this.resendInvitationForm.valid) {
      if (!(existingClient && existingClient.length > 0)) {
        self.myTaxportalService.resendToInviteClient(apiParam).then((response) => {
          self.activeModal.close(apiParam.newEmail);
        }, function (error) {
          // @pending
          // if (!(error && error.code === 4070)) {
          //   this.messageService.showMessage('This email already exist in another client.', 'error', 'ERROR_MSG');
          // } else {
          //   this.messageService.showMessage('Error occured while processing your request.', 'error', 'ERROR_MSG');
          // }
        });
      } else {
        self.messageService.showMessage('An invitation has already been sent to this email address.', 'error', 'ERROR_MSG');
      }
    } else {
      self.messageService.showMessage('The e-mail address is invalid. Please enter a valid e-mail address to resend the invitation.', 'error', 'ERROR_MSG');
    }
  }

  /**
   * @author Ravi Shah
   * Initialize Invitation Email Component
   * @private
   * @memberof ResendInvitationEmailComponent
   */
  private initailizeResendInvitationForm(dataItem) {
    this.resendInvitationForm = this.fb.group({
      clientId: [dataItem.clientId, [Validators.required]],
      newEmail: [dataItem.email, [Validators.required, Validators.email]],
      oldEmail: [dataItem.email, [Validators.required, Validators.email]],
    })
  }

  ngOnInit() {
    this.initailizeResendInvitationForm(this.data.clientData);
  }

}