// External Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Internal Imports
import { OfficeService } from '@app/office/office.service';
import { MessageService, UserService, SubscriptionService, DialogService } from '@app/shared/services';
import { officeDetail, userDetail } from '@app/office/office';

@Component({
  selector: 'app-office-overview',
  templateUrl: './office-overview.component.html',
  styleUrls: ['./office-overview.component.scss']
})

export class OfficeOverviewComponent implements OnInit {
  // holds inline editing variables
  public inlineEditing: { office?: string, user?: string, serviceBureau?: boolean, licenseOwner?: boolean, efin?: string }
    = { office: "", user: "", serviceBureau: false, licenseOwner: false, efin: "" };

  // holds all the details comes from various api call to display data in page
  public officeOverviewDetails: any = { officeList: [], userList: [], adminUserList: [], contractContacts: [], licenseOwner: {}, serviceBureau: {}, licenseDetail: {}, efinList: [] };

  // to store non filterd data 
  public filteredData: { officeList: Array<officeDetail>, userList: Array<userDetail> } = { officeList: [], userList: [] };

  // holds available office and role list fro user edit scrren.
  public lookupData: any = { locations: [], roles: [] };

  // holds filter variable for user and office search criteria
  public filterCriteria: { officeSearch: string, userSearch: string, activeUser: boolean, inActiveUser: boolean } =
    { officeSearch: "", userSearch: "", activeUser: false, inActiveUser: false };

  // count of active user
  public activeUserCount: number;

  // loading bar indicator
  public enableLoading: boolean = false;

  // holds migration messages array
  public migrationMessages: any = [];

  // holds logged in user detail to show hide some functionality based on user type
  public loggedInUserDetail: any = {};

  // holds privileges/roles object
  public userCan: any = {};

  constructor(
    private _officeService: OfficeService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _subscriptionService: SubscriptionService,
    private _dialogService: DialogService,
    private router: Router) { }


  /**
   * @author Mansi Makwana
   * To Redirect Home Screen
   * @memberof PreferencesComponent
   */
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  /**
   * @author Hannan Desai
   * @description
   *          Used to refresh officelist after any of the office data saved or updated.
   */
  public getOfficeList() {
    this._officeService.getOfficeListFromAPI().then((result: any) => {
      this.officeOverviewDetails.officeList = result;
      this.filterOffice();
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        Used to call service function to get user list from api.
   */
  public getUserList() {
    this._officeService.getUserListFromAPI().then((result: any) => {
      this.officeOverviewDetails.userList = result.userList;
      this.filterUser();
      this.officeOverviewDetails.adminUserList = result.adminUserList;
      this.officeOverviewDetails.contractContacts = result.contractContacts;
      this.activeUserCount = this._officeService.getActiveUserCount();
      this.enableLoading = false;
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function calls service function to get customer detail from api.
   */
  public getCustomerDetail() {
    this._officeService.getCustomerDetails().then((result: any) => {
      // objects
      this.officeOverviewDetails.serviceBureau = result.serviceBureau;
      this.officeOverviewDetails.contractContact = result.contractContact;
      this.officeOverviewDetails.licenseOwner = result.licenseOwner;

      // flags
      this.officeOverviewDetails.associatedWithServiceBureau = result.associatedWithServiceBureau;
      this.officeOverviewDetails.efinEfilingStatus = result.efinEfilingStatus;
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *          To call api get efin list available under location.
   */
  public getEFINList() {
    this._officeService.getEFINListFromAPI().then((efinList) => {
      this.officeOverviewDetails.efinList = efinList;
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        This function is used to get migration messages
   */
  public getDataMigrationMessages() {
    this._officeService.getMigrationMessages().then((messages) => {
      this.migrationMessages = messages;
    })
  }

  // to mark migration message as read when user click ok button on particular message.
  public markAsReadMessage(id: string) {
    this._officeService.markAsReadMessage(id).then((result) => {
      this._messageService.showMessage("Data migrated successfully.", "success");
      // refresh messages list.
      this.getDataMigrationMessages();
    })
  }

  // to mark new office alert message as read
  public markNewOfficeAlertAsRead() {
    this._officeService.markNewOfficeAlertAsRead().then((result) => {
      this._userService.syncUserDetailsWithApi();
      this.loggedInUserDetail.newOfficeAlertShown = true;
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *          This function is used to call service function that returns available office and roles list for office and role dropdown in user edit scrren.
   */
  private getLocationandRoleListForUserEdit() {
    this._officeService.getLocationAndRoleList().then((result: any) => {
      this.lookupData.locations = result.locationsData;
      this.lookupData.roles = result.roles;
    })
  }

  // to add new user
  public addUser() {
    let newUserExists = this.officeOverviewDetails.userList.find((obj) => { return obj.key === "newUser" });
    if (!newUserExists) {
      this.officeOverviewDetails.userList.push(
        {
          firstName: "",
          lastName: "",
          key: "newUser",
          isPreparerEmailSameAsLogin: true,
          isPreparerPhoneSameAsLogin: true,
          isActiveUser: true,
          userImageSrc: "assets/images/user-icon-01.png",
          twoFactorAuthentication: {}
        });
      // to scroll to new user
    }
    setTimeout(() => {
      this.goToUser("newUser");
    }, 10)
  }

  // to go to particular user tile and open it for editing also
  public goToUser(userId: string) {
    this.inlineEditing.user = userId;
    let user = document.getElementById(userId) as HTMLElement;
    if (user) {
      user.scrollIntoView(false);
    }
  }

  // to add new office
  public addOffice() {
    let newOfficeExist = this.filteredData.officeList.find((obj) => { return obj.key === "newOffice" });
    if (!newOfficeExist) {
      this.filteredData.officeList.push({ name: "", key: "newOffice", addressType: 1 });
      this.inlineEditing.office = "newOffice";
    }
    setTimeout(() => {
      let newOffice = document.getElementById("newOffice") as HTMLElement;
      if (newOffice) {
        newOffice.scrollIntoView(false);
      }
    }, 10)
  }

  // to add new efin
  public addEFIN() {
    let newEFINExist = this.officeOverviewDetails.efinList.find((obj) => { return obj.id === "newEFIN" });
    if (!newEFINExist) {
      this.officeOverviewDetails.efinList.push({ id: "newEFIN", efin: "", isFirmNameSameAsFirm: true, isEINSameAsFirm: true, isAddressSameAsFirm: true, associatedUsers: [], efinToUseInOffice: [] });
      this.inlineEditing.efin = "newEFIN"
    }
    setTimeout(() => {
      let newEFIN = document.getElementById("newEFIN") as HTMLElement;
      if (newEFIN) {
        newEFIN.scrollIntoView(false);
      }
    }, 10)
  }

  // close event fro user section
  public onUserClose(type: any) {
    if (type.save) {
      this.getUserList();
      this.getOfficeList();
      this.getAndSetLoggedInUserData();
    }
    if (type.close) {
      this.inlineEditing.user = "";
    }
    this.officeOverviewDetails.userList = this.officeOverviewDetails.userList.filter((obj) => { return obj.key !== "newUser" });
  }

  // close event of office section
  public onOfficeClose(type: boolean) {
    if (type) {
      this.getLocationandRoleListForUserEdit();
      this.getOfficeList();
      this.getUserList();
    }
    this.inlineEditing.office = "";
    this.filteredData.officeList = this.filteredData.officeList.filter((obj) => { return obj.key !== "newOffice" });
  }

  // close event of service beureau section.
  public onServiceBeureauClose(type: boolean) {
    if (type) {
      this.getCustomerDetail();
    }
    this.inlineEditing.serviceBureau = false;
  }

  // close event of contract contact section (remove this)
  public onContractClose(type: boolean) {
    if (type) {
      this.getCustomerDetail();
    }
    // this.inlineEditing.contractContact = false;
  }

  // close event of administrator section (remove this)
  public onAdministratorClose(type: boolean) {
    if (type) {
      this.getCustomerDetail();
    }
    // this.inlineEditing.administrator = false;
  }

  // close event of license owner section
  public onLicenseOwnerClose(type: boolean) {
    if (type) {
      this.getCustomerDetail();
    }
    this.inlineEditing.licenseOwner = false;
  }

  // close event fro efin section
  public onEFINClose(type: boolean) {
    if (type) {
      this.getEFINList();
      this.getUserList();
      this.getOfficeList();
    }
    this.inlineEditing.efin = "";
    this.officeOverviewDetails.efinList = this.officeOverviewDetails.efinList.filter((obj) => { return obj.id !== "newEFIN" });
  }

  // call api to update customer flags
  public updateCustomerDetail(property: string) {
    let parameterObject;
    if (property === "associatedWithServiceBureau") {
      parameterObject = { associatedWithServiceBureau: this.officeOverviewDetails.associatedWithServiceBureau };
    } else if (property === "singleOffice") {
      parameterObject = { singleOffice: this.officeOverviewDetails.singleOffice };
    } else if (property === "singlePreparer") {
      parameterObject = { singlePreparer: this.officeOverviewDetails.singlePreparer };
    } else if (property === "efinEfilingStatus") {
      parameterObject = { efinEfilingStatus: this.officeOverviewDetails.efinEfilingStatus };
    } else if (property === "roleModel") {
      parameterObject = { roleModel: this.officeOverviewDetails.roleModel };
    }
    if (parameterObject) {
      this._officeService.saveCustomerDetail(parameterObject).then((result) => {
        this._messageService.showMessage("Updated successfully.", "success");
      })
    }
  }

  // this function is used filter office based on office search criteria.
  public filterOffice() {
    this.filteredData.officeList = this.officeOverviewDetails.officeList.filter((office) => {
      if (office.name && office.name.toLowerCase().indexOf(this.filterCriteria.officeSearch.toLowerCase()) >= 0) {
        return true;
      }
      if (office.efin && office.efin.toString().toLowerCase().indexOf(this.filterCriteria.officeSearch.toString().toLowerCase()) >= 0) {
        return true;
      }
    })
  }

  // filter user based on active and inactive
  public filterUser() {
    if (this.filterCriteria.activeUser == true && this.filterCriteria.inActiveUser === true) {
      this.officeOverviewDetails.userList = this._officeService.filterActiveUser(undefined, this.filterCriteria.userSearch);
    } else if (this.filterCriteria.activeUser === true && !this.filterCriteria.inActiveUser) {
      this.officeOverviewDetails.userList = this._officeService.filterActiveUser(true, this.filterCriteria.userSearch);
    } else if (!this.filterCriteria.activeUser && this.filterCriteria.inActiveUser === true) {
      this.officeOverviewDetails.userList = this._officeService.filterActiveUser(false, this.filterCriteria.userSearch);
    } else {
      this.officeOverviewDetails.userList = this._officeService.filterActiveUser(undefined, this.filterCriteria.userSearch);
    }
  }

  // to redirect to subscription website to buy additional office or user.
  public redirectToSubscription() {
    this._subscriptionService.goToSubscription();
  }

  // open buy office info dialog
  public showBuyOfficeDialog() {
    this._dialogService.notify({ title: "Upgrade your License", text: "To purchase an additional location, please contact our Customer Support Team via Live Chat.", type: "" }, { 'keyboard': false, 'backdrop': 'static', 'size': 'md' });
  }

  public haveUnsavedChanges() {
    return false;
  }

  // to get roles flags from user detail to allow/disallow some feature
  private getAndSetLoggedInUserData() {
    this.loggedInUserDetail = this._userService.getUserDetails();
    this.officeOverviewDetails.licenseDetail = this._userService.getValue("license");
    this.officeOverviewDetails.licenseDetail.currentTaxYear = this._userService.getTaxYear();
    this.officeOverviewDetails.licenseDetail["latestLicenseDetail"] = this.officeOverviewDetails.licenseDetail.allowedTaxYears[this.officeOverviewDetails.licenseDetail.currentTaxYear];
    this.userCan = {
      saveUser: this._userService.can("CAN_SAVE_USER"),
      saveOffice: this._userService.can("CAN_SAVE_LOCATION")
    }
  }

  ngOnInit() {
    this.enableLoading = true;
    this.getLocationandRoleListForUserEdit();
    this.getCustomerDetail();
    this.getOfficeList();
    this.getUserList();
    this.getEFINList();
    this.getDataMigrationMessages();
    this.getAndSetLoggedInUserData();
  }
}
