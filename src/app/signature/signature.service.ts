//External Imports
import { Injectable } from '@angular/core';
import * as moment from 'moment';

//Internal Imports
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { APINAME } from "@app/signature/signature.constants";
import { DialogService } from '@app/shared/services/dialog.service';
import { SignaturecaptureComponent } from '@app/signature/dialogs/signature-capture/signature-capture.component';

@Injectable({
  providedIn: 'root'
})

export class SignatureService {

  constructor(private _commonAPIService: CommonAPIService,
    private dialogService: DialogService) { }

  public signatureData: any; //to store signature data
  /**
   * @author shreya kanani
   * @description get device list
  */
  public getAvailableDeviceList() {
    //load list from data api
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.SIGNATURELIST,
        methodType: 'post'
      }).then((response) => {
        let signaturelist =[];
        if (response.data && response.data.length > 0) {
        response.data.forEach((returnData) => {
        let data ={
          model : returnData.model,
          status : returnData.status,
          note : returnData.note,
          createdDate: moment(returnData.createdDate).format('MM/DD/YYYY'),
        };
        signaturelist.push(data);
       
      });
        for (var count = 0; count < signaturelist.length; count++) {
          if (signaturelist[count].status == 0) {
            signaturelist[count].status = 'Pending';
          } else if (signaturelist[count].status == 1) {
            signaturelist[count].status = 'Authorized';
          } else if (signaturelist[count].status == 2) {
            signaturelist[count].status = 'Revoke';
          }
        }
        }
        //console.log(response.data.status);
        resolve(signaturelist);
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * @author shreya kanani
   * @param id 
   * @description remove device
   */
  public removeDevice(id: string) {
    return new Promise((resolve, reject) => {
      //remove device
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.REMOVEDEVICE,
        methodType: 'post',
        parameterObject: { 'ID': id }
      }).then((response: any) => {
        resolve(response.data.data);
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * @author shreya kanani
   * @description create device registration
   */
  public createDevicesRegistration() {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.CREATEDEVICEREGISTRATION,
        methodType: 'post',
        parameterObject: {}
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author shreya kanani
   * @param approveObj 
   * @description authorize device registration
   */
  public authorizeDeviceRegistration(approveObj) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.AUTHORIZEDEVICEREGISTRATION,
        methodType: 'post',
        parameterObject: approveObj
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }
  
  /**
   * @author shreya kanani
   * @param getObj 
   * @description get device authorization
   */
  public getDeviceAuthorization(getObj) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.GETDEVICE,
        methodType: 'post',
        parameterObject: getObj
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author shreya kanani
   * @param captureObj
   * @description create signature for capture
   */
  public createSignatureForCapture(captureObj) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.CREATESIGNATURE,
        methodType: 'post',
        parameterObject: captureObj
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author shreya kanani
   * @param getCaptureObject
   * @description authorize capture signature 
   */
  public getCaptureAuthorization(getCaptureObject) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.GETCAPTUREAUTHORIZATION,
        methodType: 'post',
        parameterObject: getCaptureObject
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author shreya ikanani
   * @param approveSignatureObject
   * @description approve signature 
   */
  public approveSignature(approveSignatureObject) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.APPROVESIGNATURE,
        methodType: 'post',
        parameterObject: approveSignatureObject
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author shreya kanani
   * @param signatureTypeObject
   * @description remove signature 
   */
  public removeSignatureWithoutDialog(signatureTypeObject) {
    return new Promise((resolve, reject) => {
      this._commonAPIService.getPromiseResponse({
        apiName: APINAME.REMOVESIGNATURE,
        methodType: 'post',
        parameterObject: signatureTypeObject
      }).then((response) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * @author shreya kanani
   * @param getSignatureObj 
   * @param forceUpdate 
   * @description view all signature
   */
  public signatureViewAll(getSignatureObj, forceUpdate) {
    return new Promise((resolve, reject) => {
      if (forceUpdate == false && this.signatureData != undefined && ((getSignatureObj.preparerId != undefined && this.signatureData.preparerId == getSignatureObj.preparerId) || (getSignatureObj.returnId != undefined && this.signatureData.returnId == getSignatureObj.returnId))) {
        resolve(this.signatureData.imageData);
      }
      else {
        this._commonAPIService.getPromiseResponse({
          apiName: APINAME.SIGNATUREVIEWALL,
          methodType: 'post',
          parameterObject: getSignatureObj
        }).then((response) => {
          this.signatureData = {};
          if (getSignatureObj.preparerId != undefined)
            this.signatureData.preparerId = getSignatureObj.preparerId;
          else if (getSignatureObj.returnId != undefined)
            this.signatureData.returnId = getSignatureObj.returnId;
          this.signatureData.imageData = response.data;
          resolve(response.data);
        }, (error) => {
          reject(error);
        });
      }
    });
  }

  /**
   * @author shreya kanani
   * @param signatureTypeObject
   * @description remove signature 
   */
  public removeSignature(signatureTypeObject) {
    const self = this;
    let dialogConfiguration = { 'keyboard': false, 'backdrop': false, 'size': 'sm', 'windowClass': 'my-class' };
    let dialog = self.dialogService.confirm({ title: "confirmation", text: "Do you want to delete this signature ?", type: "confirm" }, dialogConfiguration);
    dialog.result.then(() => {
      return new Promise((resolve, reject) => {
        this._commonAPIService.getPromiseResponse({
          apiName: APINAME.REMOVESIGNATURE,
          methodType: 'post',
          parameterObject: signatureTypeObject
        }).then((response) => {
          resolve(response.data);
        }, (error) => {
          reject(error);
        });
      });
    });
  }
  
  /**
    * @author shreya kanani
    * @param captureObject
    * @description open signature capture dialog  
    */
  public openSignatureCaptureDialog(captureObject) {
    //open upload efin letter dialog
    return new Promise((resolve, reject) => {
      let dialog = this.dialogService.custom(SignaturecaptureComponent, { 'captureObject': captureObject }, { 'keyboard': false, 'backdrop': false, 'size': 'md' });
      dialog.result.then((result) => {
        resolve(result);
        (error) => {
          reject(error);
        }
      });
    });
  }
}
