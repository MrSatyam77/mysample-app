import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { eFileSumaryListService } from '@app/shared/services/efile-summary-list.service';
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/shared/shared.constants';
import { MessageService } from '@app/shared/services/message.service';

@Component({
  selector: 'app-text-message-dialog',
  templateUrl: './text-message-dialog.component.html',
  styleUrls: ['./text-message-dialog.component.scss']
})
export class TextMessageDialogComponent implements OnInit {

  public dialogDisplayData: any;
  public data: any;
  public phoneMask = '(000) 000-0000';
  public sendTextMessageForm: FormGroup;
  constructor(private messageService: MessageService, private commonApiService: CommonAPIService, private fb: FormBuilder, private _activeModal: NgbActiveModal, private efileSummaryService: eFileSumaryListService) { }

  /**
   * @author Mansi Makwana
   * @description
   *  This function is used to define registration form controls and validators.
   */
  private createSendTextMessageForm() {
    this.sendTextMessageForm = this.fb.group({
      phoneNumber: ['', Validators.required],
      message: ['', Validators.required],
      preparerName: [this.dialogDisplayData.recipientName, Validators.required]
    });
  }

  /**
   * @author Mansi Makwana
   * @description
   *  lose dialog method
   */
  close() {
    this._activeModal.close(false);
  }


  /**
   * @author Mansi Makwana
   * @description
   *  This method is use to send text message
   */

  public sendTextMessage() {
    this.commonApiService.getPromiseResponse({
      apiName: APINAME.EFILE_SEND_TEXT_MESSAGE, parameterObject: {
        'phone': this.sendTextMessageForm.controls.phoneNumber.value,
        'message': this.sendTextMessageForm.controls.message.value,
        'preparerName': this.sendTextMessageForm.controls.preparerName.value
      }
    }).then((response) => {
      if (response) {
        this.messageService.showMessage('SMS Sent Successfully.', 'info');
        this._activeModal.close(false);
      }
    }, (error) => {
      this.messageService.showMessage('Error occurred while sending SMS.', 'error');
      this._activeModal.close(false);
    });
  }

  /**
   * @author Mansi Makwana
   * @description
   *  This method is used to initial load data
   */
  public initTextData() {
    this.dialogDisplayData = this.data;
    console.log(this.dialogDisplayData);
    // condition based on refund or balance due we show message text.
    if (this.dialogDisplayData.refund !== undefined && this.dialogDisplayData.refund !== '' && this.dialogDisplayData.refund > 0) {
      this.dialogDisplayData.message = this.dialogDisplayData.eFileStateName.toUpperCase() + ' confirmation of your tax return\n' + 'Acknowledgement Date : ' + this.dialogDisplayData.date + '\n' + 'Status : ' + this.dialogDisplayData.status + '\n' +
        'Acknowledgement Refund : $' + this.dialogDisplayData.refund + '\n' + 'Submission ID : ' + this.dialogDisplayData.submissionId;
    } else if (this.dialogDisplayData.balanceDue && this.dialogDisplayData.balanceDue !== '' && this.dialogDisplayData.balanceDue > 0) {
      this.dialogDisplayData.message = this.dialogDisplayData.eFileStateName.toUpperCase() + ' confirmation of your tax return\n' + 'Acknowledgement Date : ' + this.dialogDisplayData.date + '\n' + 'Status : ' + this.dialogDisplayData.status + '\n' +
        'Acknowledgement Balance Due : $' + this.dialogDisplayData.balanceDue + '\n' + 'Submission ID : ' + this.dialogDisplayData.submissionId;
    } else {
      if (this.dialogDisplayData.eFileStateName !== undefined && this.dialogDisplayData.submissionId !== undefined && this.dialogDisplayData.status !== undefined && this.dialogDisplayData.date !== undefined)
        this.dialogDisplayData.message = this.dialogDisplayData.eFileStateName.toUpperCase() + ' confirmation of your tax return\n' + 'Acknowledgement Date : ' + this.dialogDisplayData.date + '\n' + 'Status : ' + this.dialogDisplayData.status + '\n' +
          'Acknowledgement Refund : $' + 0.00 + '\n' + 'Submission ID : ' + this.dialogDisplayData.submissionId;
    }
  }

  ngOnInit() {
    if (this.data) {
      this.initTextData();
      this.createSendTextMessageForm();
    }
  }

}
