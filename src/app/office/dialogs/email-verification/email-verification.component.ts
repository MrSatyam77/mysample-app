// External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Internal Imports
import { OfficeService } from '@app/office/office.service';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  @Input() data: any;

  // holds verificationCode eneterd by user.
  public verificationCode: string = "";

  // show message variable
  public showMessage: number;

  constructor(
    private _activeModal: NgbActiveModal,
    private _officeService: OfficeService,
    private _messageService: MessageService) { }

  // to validate code enterd bu user.
  public validate() {
    this._officeService.validateCodeForMail(this.data.otpDocKey, this.verificationCode, this.data.userId).then((result: any) => {
      if (result.code === 9002) {
        // code expired
        this.showMessage = 2;
      } else if (result.code === 9001) {
        // invalid code
        this.showMessage = 1;
      } else if (result.code === 9000) {
        this._messageService.showMessage("Email verified successfully.", "success");
        this._activeModal.close(true);
      }
    })
  }

  // resend code in case of user didnt receive code.
  public resendCode() {
    this._officeService.sendMailForEmailVerify(this.data.email).then((result: any) => {
      this.data.otpDocKey = result.id;
      this.showMessage = 3;
    })
  }

  // to close dialog
  public close() {
    this._activeModal.dismiss();
  }

  ngOnInit() {
  }

}