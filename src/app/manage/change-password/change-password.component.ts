import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

// Internal imports
import { MessageService, PasswordStrengthService, DialogService } from '../../shared/services';
// import { AuthenticationService } from '../authentication.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ChangePasswordService } from './change-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {

  public formChangePassword: FormGroup;
  public passwordStrength: any = {}; // hold password strength
  private routeSubscription: Subscription;

  @ViewChild('confirmPassword', { static: false }) confirmPassword: NgbPopover;
  @ViewChild('newPassword', { static: false }) newPassword: NgbPopover;

  constructor(
    private fb: FormBuilder, private messageService: MessageService, private changePasswordService: ChangePasswordService,
    private router: Router, private injector: Injector, private activatedRoute: ActivatedRoute, private dialogService: DialogService) {
  }

  /**
   * @author Ravi Shah
   * Change Password API
   * @memberof ChangePasswordComponent
   */
  public changePassword() {
    if (this.formChangePassword.valid) {
      if (this.formChangePassword.value.oldPassword === this.formChangePassword.value.newPassword) {
        this.messageService.showMessage("'Your new password must be different from your old password.'", "error");
      } else {
        this.changePasswordService.changePassword(this.formChangePassword.value).then((result) => {
          this.messageService.showMessage("Password changed successfully", "success");
          this.gotoHome();
        })
      }
    }
  }

  /**
   * @author Ravi Shah
   * Navigate to Home
   * @memberof ChangePasswordComponent
   */
  public gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * @author Ravi Shah
   * Initialize Form Change Password
   * @memberof ChangePasswordComponent
   */
  public initChangePasswordForm() {
    this.formChangePassword = this.fb.group({
      oldPassword: this.fb.control('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,():_-])[A-Za-z\d$@#$!%*?&.,():_-]{8,}/)]),
      newPassword: this.fb.control('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,():_-])[A-Za-z\d$@#$!%*?&.,():_-]{8,}/)]),
      confirmPassword: this.fb.control('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,():_-])[A-Za-z\d$@#$!%*?&.,():_-]{8,}/)]),
    },
      {
        validator: this.controlMatchValidator('newPassword', 'confirmPassword')
      }
    );
  }

  /**
   * @author Ravi Shah
   * Check Password Strength
   * @param {string} password
   * @memberof ChangePasswordComponent
   */
  public checkPasswordStrength(password: string): void {
    const passwordStrengthService = this.injector.get(PasswordStrengthService);
    this.passwordStrength = passwordStrengthService.getStrength(password);
  }

  /**
   * @author Ravi Shah
   * Open popover on error
   * @param {*} type
   * @memberof ChangePasswordComponent
   */
  public openPopOverConfirmPasswordError(type) {
    if (type === 'confirmPassword') {
      if (this.formChangePassword.controls.confirmPassword && this.formChangePassword.controls.confirmPassword.errors && this.formChangePassword.value.confirmPassword) {
        this.confirmPassword.open();
      } else {
        this.confirmPassword.close();
      }
    } else if (type === 'confirmPassword' || type === 'newPassword') {
      if (this.passwordStrength.type !== 'strong' && this.formChangePassword.value.newPassword) {
        this.newPassword.open();
        this.confirmPassword.close();
      } else {
        if (this.formChangePassword.controls.confirmPassword && this.formChangePassword.controls.confirmPassword.errors && this.formChangePassword.value.confirmPassword) {
          this.confirmPassword.open();
        } else {
          this.confirmPassword.close();
        }
        this.newPassword.close();
      }
    }
  }

  /**
   * @author Ravi Shah
   * Custom Validation to match new password and confirm password
   * @private
   * @param {*} controlName1
   * @param {*} controlName2
   * @returns {ValidatorFn}
   * @memberof ChangePasswordComponent
   */
  private controlMatchValidator(controlName1, controlName2): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get(controlName1).value; // to get value in input tag
      const confirmPassword = control.get(controlName2).value; // to get value in input tag
      if (control.get(controlName1).valid && password !== confirmPassword) {
        control.get('confirmPassword').setErrors({ match: true });
      } else {
        control.get('confirmPassword').setErrors(null);
        return null;
      }
    };
  }

  ngOnInit() {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe((params: any) => {
      if (params.params.option === 'expire') {
        let dialogData = { "title": "Password Expired", "text": "Per the IRS security guidelines, you are required to change your password every 90 days. Please click OK, to change your password.", type: 'notify' };
        this.dialogService.notify(dialogData, {});
      }
    });
    this.initChangePasswordForm();
  }


  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
