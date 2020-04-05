import { Injectable } from '@angular/core';
import { CommonAPIService } from '@app/shared/services/common-api.service';
import { APINAME } from '@app/efile-center/components/efile/efile.constants';
import { UserService } from '@app/shared/services/user.service';
import { UtilityService } from '@app/shared/services/utility.service';
import { IServerSideCache } from 'ag-grid-community';

@Injectable()
export class EfileService {

  constructor(private commonApiService: CommonAPIService, private userService: UserService, private utilityService: UtilityService) { }

  /**
   * @author Mansi Makwana
   * API Calling for the Efile Rejection
   * @memberof EfileComponent
   */
  public changeStatusRejectToUnsolvable = function (returnObj) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({ apiName: APINAME.EFILE_REJECTION, parameterObject: { "eFileId": returnObj.key } }).then((response) => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * @author Mansi Makwana
   * API Calling for the print Return
   * @memberof EfileComponent
   */
  public printReturn(returnObj, form) {
    return new Promise((resolve, reject) => {
      this.commonApiService.getPromiseResponse({
        apiName: APINAME.EFILE_PRINT_RETURN, parameterObject: {
          printingType: 'printSingleForm',
          returnId: returnObj.id,
          fileName: returnObj.taxpayerLastName + '_' + '9325' + '_' + returnObj.year + '.pdf',
          docIndex: -1,
          formProp: form,
          packageName: returnObj.type,
          state: 'federal',
          isState: returnObj.eFileStateName == 'federal' ? false : true,
          locationData: this.userService.getLocationId(undefined),
          deviceInformation: this.utilityService.getDeviceInformation()
        }
      }).then((response) => {
        resolve(response.data);
      }, error => {
        reject(error);
      });
    });
  };
}
