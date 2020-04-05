// External Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Internal Imports
import { CommonAPIService, UserService, BasketService } from '@app/shared/services/index';
import { APINAME } from '@app/shared/shared.constants';


@Component({
  selector: 'app-privileges-info',
  templateUrl: './privileges-info.component.html',
  styleUrls: ['./privileges-info.component.scss']
})
export class PrivilegesInfoComponent1 implements OnInit {
  public requiredPrivileges = {};
  public requirePrivilegesKeys = [];
  public userLocationData: any;
  public privilege: any = [];

  constructor(
    private _commonAPIService: CommonAPIService,
    private _userService: UserService,
    private _basketService: BasketService,
    private router: Router
    ) {
     }

  private getPrivilegeData(): void {
    this._commonAPIService.getPromiseResponse({ apiName: APINAME.GET_ADMIN_PRIVILEGES, parameterObject: {} })
      .then((result) => {
        if (result.data && result.data.length > 0) {
          //loop over the required privileges for particular page
          this.privilege.privilegesList.forEach((privilege) => {
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

  trackByFn(index) {
    return index;
  }
  
  backToHomeScreen() {
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
    this.getPrivilegeData();
    this.privilege = this._basketService.popItem('requireprivileges');
  }

}
