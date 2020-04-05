import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '@app/shared/services';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-resend-invitation-sms',
  templateUrl: './resend-invitation-sms.component.html',
  styleUrls: ['./resend-invitation-sms.component.scss']
})
export class ResendInvitationSmsComponent implements OnInit {

  public data: any;
  public changeSSNForm: FormGroup;
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
   * Send Text message using Plivo
   * @memberof ResendInvitationSmsComponent
   */
  public sendTextMessage() {
    this.myTaxportalService.sendTextMessage(this.data.clientId, this.data.cellNumber, this.data.recipientName, this.data.message).then((response) => {
      this.messageService.showMessage('SMS invitation has been sent successfully.', 'success');
      this.activeModal.close(false);
    }, function (error) {
      this.messageService.showMessage('Error occurred while sending SMS.', 'error');
      this.activeModal.close(false);
    })
  }

  /**
   * @author Ravi Shah
   * Initialize Data
   * @private
   * @memberof ResendInvitationSmsComponent
   */
  private _initData() {
    this.data.message = this.data.companyName + ' has invited you to use MyTAXPortal. Please click the link below to set up your MyTAXPortal account.' +
      '\n\n' + this.data.link + '\n\n' + 'The invitation link expires in 48 hours.';
    this.myTaxportalService.getClientsPhone(this.data.clientId).then((response) => {
      this.data.cellNumber = response ? response : undefined;
    })
  }

  ngOnInit() {
    this._initData();
  }
}
