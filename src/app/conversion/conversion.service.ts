/** Import External */
import { Injectable } from '@angular/core';
/** Import Internal */
import { CommonAPIService } from '@app/shared/services';
import { APINAME } from './conversion.constant';

@Injectable()
export class ConversionService {

  constructor(private commonApiService: CommonAPIService) { }

  /**
    * @author Hitesh Soni
    * @date 08-08-2019
    * @readonly 
    * @returntype {Promis}
    * @memberof ConversionService
    * @description Get efile summary
    */
  getConversionList() {
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.GET_CONVERSION_LIST }).then((response) => {
        if (response.data) { resolve(response); }
        else { resolve([]); }
      }, (error) => {
        reject(error);
      });
    });
  }

 
}
