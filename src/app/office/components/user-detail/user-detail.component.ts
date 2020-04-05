// External Imports
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

// Internal Imports
import { userDetail } from '@app/office/office';
import { UserService, ResellerService, DialogService, MessageService, BasketService } from '@app/shared/services';
import { OfficeService } from '@app/office/office.service';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { ChangePasswordComponent } from '@app/office/dialogs/change-password/change-password.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnChanges {

  @Input() userDetail: userDetail;
  @Output() edit = new EventEmitter<string>();
  @Output() refreshUserList = new EventEmitter<any>();
  private loggedInUserDetail = this._userService.getUserDetails();
  public userCan: any = {};
  public hasFeature: any = {};
  public noMoreActiveUser: boolean = false;

  constructor(
    private _userService: UserService,
    private _resellerService: ResellerService,
    private _dailogService: DialogService,
    private _officeService: OfficeService,
    private _messageService: MessageService,
    private _authService: AuthenticationService,
    private _basketService: BasketService,
    private _router: Router) { }

  public editUser() {
    this.edit.emit(this.userDetail.key);
  }

  private prepareData() {
    this.userDetail.isLoggedInUser = this.loggedInUserDetail.email === this.userDetail.email ? true : false;
    if (this._officeService.getActiveUserCount() >= this._userService.getLicenseValue('noOfUsers')) {
      this.noMoreActiveUser = true;
    }
  }

  // to delete user
  public deleteUser() {
    const self = this;
    let dialogRef = this._dailogService.confirm({ title: "Confirmation", text: "Do you want to delete this user ?" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'sm' })
    dialogRef.result.then((result) => {
      self._officeService.removeUser([this.userDetail.key]).then((result) => {
        self._messageService.showMessage("User removed successully.", "success");
        this.refreshUserList.emit({ save: true });
      })
    })
  }

  // to activate deactivate user based on condition
  public activeDeactiveUser(status: boolean) {
    const self = this;
    if (status === true) {
      if (this._officeService.getActiveUserCount() >= this._userService.getLicenseValue('noOfUsers')) {
        self._messageService.showMessage("Please buy additional user subscription.", "success");
      } else {
        self.changeUserStatus(status);
      }
    } else {
      self._dailogService.confirm({ title: "Confirmation", text: "Are you sure you want to deactivate this user ?" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'sm' })
        .result.then((yes) => {
          self.changeUserStatus(status);
        })
    }
  }

  // call api to chnage user active status.
  private changeUserStatus(status: boolean) {
    this._officeService.changeUserActiveStatus([this.userDetail.key], status).then((result) => {
      this._messageService.showMessage("User active status updated successfully.", "success");
      this.refreshUserList.emit({ save: true });
    })
  }

  // to resend confirmation email
  public resendConfirmation() {
    this._authService.resendConfirmation(this.userDetail.email).then((result) => {
      this._messageService.showMessage('Confirmation email sent.', 'success');
    })
  }

  // open dialog to chnage other user password
  public changeOtherUserPassword() {
    this._dailogService.custom(ChangePasswordComponent, { email: this.userDetail.email }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' })
      .result.then((result) => { })
  }

  // to open dialog to display confirmation link
  public getConfirmationLink() {
    let text = 'Please send below mentioned link to user for completing registration. If you would like to complete registration for this user in this browser please logout current user first.';
    let confirmationLink = "<div class='margin_top_20'>Link - " + location.protocol + "//" + location.host + "/registration?confirmPassword=" + this.userDetail.encryptedEmail + "</div>";
    // holds the title and content of dialog
    let htmlContent = {
      title: "Confirmation Link",
      text: "<div>" + text + "</div>" + confirmationLink
    };
    this._dailogService.notify(htmlContent, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' });
  }

  // reset open return for editing
  public resetCheckedOutReturn() {
    this._dailogService.confirm(
      { title: "Confirmation", text: "Do you want to reset the returns that are open for editing by " + this.userDetail.firstName + " " + this.userDetail.lastName + "?" },
      { 'keyboard': false, 'backdrop': 'static', 'size': 'md' }).result.then((result) => {
        this._officeService.resetOpenReturns(this.userDetail.key).then((result: any) => {
          if (result.returncount === 0) {
            let htmlContent = {
              title: "Notification",
              text: "<div>" + "No returns were opened for editing by " + this.userDetail.firstName + " " + this.userDetail.lastName + "." + "</div>"
            };
            this._dailogService.notify(htmlContent, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' });
          } else {
            this._messageService.showMessage('The returns were successfully reset, they are now available for editing.', 'success');
          }
        })
      })
  }

  // go to user prefrence acreen.
  public gotoPreferenceScreen() {
    //for pass previous path from controller to another basket service is used
    this._basketService.pushItem('previousPathForHeaderNav', '/manage/user/list');
    //if userId is same as current user then do not pass. It will fetch current userDetails
    if (this.userDetail.isLoggedInUser) {
      this._router.navigateByUrl("/preferences");
    } else {
      this._router.navigateByUrl('/preferences/' + this.userDetail.key);
    }
  }

  // to unlock user
  public unlockOtherUser() {
    const self = this;
    let dialogConfig = { 'keyboard': false, 'backdrop': 'static', 'size': 'sm' };
    self._dailogService.confirm({ title: "Confirmation", text: 'Do you want to unlock this user?' }, dialogConfig)
      .result.then((result) => {
        self._officeService.unlockOtherUser(self.userDetail.email).then((result) => {
          self._messageService.showMessage('User unlocked successfully.', 'success');
          self.refreshUserList.emit({ save: true });
        }, (error) => {
          let dialogMessage = "There is something wrong with your request.please contact support."
          dialogConfig.size = 'md';
          if (error.code == 4040) {
            dialogConfig.size = 'sm';
            dialogMessage = "This user is not locked.";
          }
          let htmlContent = {
            title: "Notification",
            text: "<div>" + dialogMessage + "</div>"
          };
          self._dailogService.notify(htmlContent, dialogConfig);
        })
      })
  }

  // to get roles and restriction flags to allow/disallow feature,
  private getRolesAndRestrictionFlags() {
    this.userCan = {
      removeUser: this._userService.can('CAN_REMOVE_USER'),
      saveUser: this._userService.can('CAN_SAVE_USER'),
      openUser: this._userService.can('CAN_OPEN_USER')
    }
    this.hasFeature = {
      createUser: this._resellerService.hasFeature('CREATEUSER'),
      deleteUser: this._resellerService.hasFeature('DELETEUSER'),
      subscription: this._resellerService.hasFeature('SUBSCRIPTION'),
    }
  }

  ngOnChanges() {
    this.getRolesAndRestrictionFlags();
    this.prepareData();
  }

  ngOnInit() { }
}
