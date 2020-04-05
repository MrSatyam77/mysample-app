import { Injectable } from '@angular/core';
import { CommonAPIService } from '@app/shared/services';
import { APINAME } from '../manage.constants';

@Injectable()
export class ChangePasswordService {

  constructor(private _commonAPIService: CommonAPIService) { }


  /**
   * @author Ravi Shah
   * Call Change password API to change the password of the logged in user
   * @param {*} changePasswordDetails
   * @returns
   * @memberof AuthenticationService
   */
  public changePassword(changePasswordDetails: any) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.CHANGE_PASSWORD,
        parameterObject: { data: changePasswordDetails }
      }).then((result) => {
        resolve(result.data)
      }, (error) => {
        reject(error);
      })
    })
  }
}
