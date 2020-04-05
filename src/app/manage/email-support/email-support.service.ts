import { Injectable } from '@angular/core';
import { CommonAPIService } from '@app/shared/services';
import { APINAME } from '../manage.constants';

@Injectable()
export class EmailSupportService {

  constructor(private commonAPIService: CommonAPIService) { }

  /**
   * @author Ravi Shah
   * Call Api Save Support Details
   * @param {*} details
   * @returns
   * @memberof EmailSupportService
   */
  saveSupportDetail(details: any) {
    return new Promise((resolve, reject) => {
      this.commonAPIService.getPromiseResponse({ apiName: APINAME.SUPPORT_EMAIL, parameterObject: details }).then((result: any) => {
        resolve(result.data);
      }, error => {
        reject(error);
      })
    })
  }
}
