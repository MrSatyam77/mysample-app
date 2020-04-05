// External Import
import { Injectable } from '@angular/core';

// Internal Import
import { APINAME } from '@app/role/role.constants';
import { CommonAPIService } from '@app/shared/services';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private commonApiService: CommonAPIService) { }

  /**
 * @author Satyam Jasoliya
 * @date 04th Nev 2019
 * @description get admin privileges
 * @memberof roleComponent
 */
  public getAdminPrivileges() {
    let adminPrivileges: any = [];
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.PRIVILEGES_LIST_VERIFICATION, parameterObject: {} }).then((response) => {
        adminPrivileges = response.data;
        resolve(adminPrivileges);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description get available privilege
* @memberof roleComponent
*/
  public getAvailablePrivilage() {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.PRIVILEGES_LIST, parameterObject: {} }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description get available role
* @memberof roleComponent
*/
  public getAvailableRoles(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.ROLES_LIST, parameterObject: data }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description create role
* @memberof roleComponent
*/
  public createRole(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.ROLES_CREATE, parameterObject: data }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description update role
* @memberof roleComponent
*/
  public updateRole(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.ROLES_SAVE, parameterObject: data }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description get role
* @memberof roleComponent
*/
  public getRole(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.ROLES_OPEN, parameterObject: data }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
* @author Satyam Jasoliya
* @date 04th Nev 2019
* @description remove role
* @memberof roleComponent
*/
  public removeRoles(data: any) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.ROLES_REMOVE, parameterObject: data }).then((response) => {
        resolve(response);
      }, (error) => {
        reject(error);
      });
    });
  }

}
