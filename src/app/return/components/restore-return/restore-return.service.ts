//External Imports
import { Injectable } from '@angular/core';

//Internal Imports
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { APINAME } from "@app/return/return.constants";

@Injectable()
export class RestoreReturnService {

  constructor(private _commonAPIService: CommonAPIService) {

  }
  /**
* @author Satyam Jasoliya
* @description Used to  return list
*/
  public createRestoreReturnList(data:any) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({ apiName: APINAME.createRestoreReturn, parameterObject: data }).then((response) => {
        resolve(response.data || {});
      }, (error) => {
        reject(error);
      })
    })
  }
}


