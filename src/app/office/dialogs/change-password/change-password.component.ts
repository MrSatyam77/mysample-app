// External Imports
import { Component, OnInit, Input, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Internal Imports
import { OfficeService } from '@app/office/office.service';
import { MessageService } from '@app/shared/services';
import { PasswordStrengthService } from '@app/shared/services/password-strength.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  // holds data passed when opening a dialog
  @Input() data: any;

  // holds ui ngModel variable
  public password: { newPassword: string, confirmPassword: string } = { newPassword: "", confirmPassword: "" };
  public passwordStrength: any = {}; // hold password strength
  public mustmatch = false; // hold password and confirmpassword must match value

  constructor(
    private _activeModal: NgbActiveModal,
    private _messageService: MessageService,
    private _officeService: OfficeService, private injector: Injector) { }

  // call api to chnage password for user
  public changePassword() {
    this._officeService.changeOtherUserPassword(this.data.email, this.password.newPassword).then((result) => {
      this._messageService.showMessage("Password changed successfully", "success");
      this._activeModal.close(true);
    })
  }

  // to close dialog
  public cancel() {
    this._activeModal.close();
  }

  /**
   * @author om kanada
   * @description
   *  This function is used to check password and confirm password.
   */
  MustMatch(controlName: string, matchingControlName: string): void {
    // set error on matchingControl if validation fails
    if (!controlName || !matchingControlName) {
      this.mustmatch = false;
    }
    if (controlName && matchingControlName) {
      if (controlName !== matchingControlName) {
        this.mustmatch = false;
      } else {
        this.mustmatch = true;
      }
    }
  }

  /**
   * @author om kanada
   * @description
   *  This function is used to check strength of password.
   */
  public checkPasswordStrength(password: string): void {
    const passwordStrengthService = this.injector.get(PasswordStrengthService);
    this.passwordStrength = passwordStrengthService.getStrength(password);
  }
  ngOnInit() {
  }

}
