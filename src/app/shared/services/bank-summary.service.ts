import { Injectable, EventEmitter } from '@angular/core';
import { CommonAPIService } from './common-api.service';
import { UserService } from './user.service';
import { SystemConfigService } from './system-config.service';
import { APINAME } from '../shared.constants';

@Injectable({
  providedIn: 'root'
})
export class BankSummaryService {

  public filterMaping = [{ id: 'All', status: ['any'], state: 'any', display: 'All' }, { id: 'Transmitted', status: [0, 1, 2, 3, 4, 5, 6], state: 'any', display: 'Transmitted' }, { id: 'AtIRS', status: [7], state: 'federal', display: 'At IRS' }, { id: 'AtState', status: [7], state: 'anystate', display: 'At State' }, { id: 'Accepted', status: [9], state: 'any', display: 'Accepted' }, { id: 'Rejected', status: [8], state: 'any', display: 'Rejected' }, { id: 'Canceled', status: [21], state: 'any', display: 'Canceled' }, { id: 'IRS Alerts', status: [8, 9], state: 'any', display: 'IRS Alerts / Messages' }, { id: 'Rejected As Unsolvable', status: [22], state: 'any', display: 'Rejected As Unsolvable' }];
  public filterStatusPassed = 'All';

  receivedFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private commonApiService: CommonAPIService, private userService: UserService, private systemConfigService: SystemConfigService) { }

  /**
   * @author Ravi Shah
   * Get Bank Summary Details
   * @memberof BankSummaryService
   */
  public getbankSummary = function (returnObj) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.BANK_SUMMARY_DETAILS, parameterObject: {} }).then((response) => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
    });
  };
}