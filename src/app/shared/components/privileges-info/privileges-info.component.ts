// External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

// Internal Imports
import { CommonAPIService, UserService } from '@app/shared/services/index';
import { APINAME } from '@app/shared/shared.constants';

@Component({
  selector: 'app-privileges-info',
  templateUrl: './privileges-info.component.html',
  styleUrls: ['./privileges-info.component.scss']
})
export class PrivilegesInfoComponent implements OnInit {

  @Input() data: any;
  public requiredPrivileges = {};

  // holds array of required privileges
  public requirePrivilegesKeys = [];

  //variable that holds the users current location detail
  public userLocationData: any;

  constructor(private _activeModal: NgbActiveModal,
    private _commonAPIService: CommonAPIService,
    private _userService: UserService) { }

  /**
   * @author Satyam
   * @created Date 04/07/2019
   * @description method is used to leave message
   */
  private getPrivilegeData(): void {
    this._commonAPIService.getPromiseResponse({ apiName: APINAME.GET_ADMIN_PRIVILEGES, parameterObject: {} })
      .then((result) => {
        if (result.data && result.data.length > 0) {
          //loop over the required privileges for particular page
          this.data.privilegesList.forEach((privilege) => {
            //condition to check whether the user has that privilege or not
            if (!this._userService.can(privilege)) {
              let privilegeObj = result.data.find((obj) => { return obj.name === privilege });
              if (!this.requiredPrivileges[privilegeObj.category]) {
                this.requiredPrivileges[privilegeObj.category] = { name: privilegeObj.category, privileges: [] };
              }
              this.requiredPrivileges[privilegeObj.category].privileges.push(privilegeObj);
            }
          })
          this.requirePrivilegesKeys = Object.keys(this.requiredPrivileges);
        }
      })
  }

  /**
   * @author Satyam
   * @createdDate Date 04/07/2019
   * @description Purpose is to track ngFor List
   * @param index index of item
   */
  trackByFn(index) {
    return index;
  }

  /**
   * @description This function is used to close dialog.
   */
  close() {
    this._activeModal.close(true);
  }

  ngOnInit() {
    this.userLocationData = this._userService.getValue('locationData');
    this.getPrivilegeData();
  }
}