//External Imports
import { Injectable } from '@angular/core';

//Internal Imports
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { APINAME } from "@app/proforma/proforma.constants";
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})

export class ProformaService {

  constructor(private _commonAPIService: CommonAPIService, ) { }
  /**
   * @author shreya kanani
   * @description Used to prforma return list
   */
  public getProformaList() {
    return new Promise((resolve, reject) => {
      //if userDetails has not settings property then we create it
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.PROFORMALIST,
        methodType: 'post'
      }).then((response) => {
        let proformalist =[];
        if (response.data && response.data.length > 0) {
        response.data.forEach((returnData) => {
        let data ={
          type : returnData.type,
          taxYear : returnData.taxYear,
          status : returnData.status,
          createdDate: moment(returnData.createdDate).format('MM/DD/YYYY'),
          count : returnData.count
        };
        proformalist.push(data);
       
      });
      for (let i = 0; i < proformalist.length; i++) {
        if (proformalist[i].status == 1 || proformalist[i].status == 0) {
          proformalist[i].status = 'In Process';
        } else if (proformalist[i].status == 2) {
          proformalist[i].status = 'Finished';
        } else if (proformalist[i].status == 3) {
          proformalist[i].status = 'Error';
        }
        if (proformalist[i].count && proformalist[i].count != '') {
          proformalist[i].status += '(' + proformalist[i].count + ')';
        }
        proformalist[i]['type'] = 'Proforma Request';
      }
        }
       resolve(proformalist);
      }, (error) => {
        reject(error);
      })
    })
  }
}