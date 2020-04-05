// External Imports
import { Injectable } from '@angular/core';
// Internal imports
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/dashboard/dashboard.constants';
@Injectable({
  providedIn: 'root'
})
export class AppointmentListService {

  constructor(private commonApiService: CommonAPIService) { }

  public getAppointmentList(Data: any) {
    return new Promise((resolve, reject) => {
      // this.appointmentService.initSnoozer();
      this.commonApiService.getPromiseResponse({ apiName: APINAME.CALENDER_LISTBYDATE, parameterObject: { data: Data } }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
}
