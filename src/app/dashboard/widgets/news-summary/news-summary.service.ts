// External imports
import { Injectable } from '@angular/core';
// Internal imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/dashboard/dashboard.constants';

@Injectable({
  providedIn: 'root'
})
export class NewsSummaryService {

  constructor(private commonApiService: CommonAPIService) { }
  /**
   * @author Om kanada
   * @description
   *          Call API to get bank summary.
   */
  public getNews(length: number) {
    length = 3;
    const self = this;
    return new Promise((resolve, reject) => {
      self.commonApiService.getPromiseResponse({ apiName: APINAME.NEWS_GET, parameterObject: { items: length }, methodType :'get' }).then((response: any) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
}
