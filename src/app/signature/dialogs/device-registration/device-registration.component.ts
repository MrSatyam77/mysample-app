//External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal Imports
import { environment } from '@environments/environment';
import {SignatureService} from '@app/signature/signature.service';
import { MessageService } from '@app/shared/services/message.service';
import { ResellerService } from '@app/shared/services/reseller.service';
import { SocketService } from '@app/shared/services/socket.service';

@Component({
  selector: 'app-device-registration',
  templateUrl: './device-registration.component.html',
  styleUrls: ['./device-registration.component.scss']
})
export class DeviceRegistrationComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal,
    private socketService: SocketService,
    private messageService: MessageService,
    private resellerService: ResellerService,
    private signatureService: SignatureService) { }

  public authorizationStatus: any; //store authorization status
  private devicesRegistrationAuthorizationID: any;
  private getAuthorizePoolRequestTimer = { "first": 10000, "next": 5000 }; //here first request with 30 sec then 15 sec 
  public devicesObject: any = [{ note: '' }];   //to store optinal note or other fields
  private getDeviceAuthorizationTimer: any;
  public signatureData: any; //to store signature data
  public deviceInfo: any; //to store device info
  public isError: boolean = false;
  private appDownloadURL: any; //to download url
  public signaturePadAppDownloadURLAndroid: any; //to download app for android
  public signaturePadAppDownloadURLIOS: any; //to download app for ios
  private authorization = {
    waitingForbarcodeScan: 0,
    barcodeScanned: 1,
    authorized: 2,
    notAuthorized: 3,
  }

  /**
   * @author shreya kanani
   * @description this method register the device
   */
  public _init() {
    this.signatureService.createDevicesRegistration().then((response: any) => {
      if (response != undefined  && response.authorizationData != undefined) {
        this.signatureData = response.authorizationData;                                                                    
        this.devicesRegistrationAuthorizationID = response.ID
        this.authorizationStatus = this.authorization.waitingForbarcodeScan;//set intial status 
        this.startSocketConnectionWithEventsForDeviceRegistration();
        this.startRequestForGetAuthorization(this.getAuthorizePoolRequestTimer.first);
      }
    }, (error) => { 
      console.log(error);
    });
  }

  /**
   * @author shreya kanani
   * @description start connection 
   */
  public startSocketConnectionWithEventsForDeviceRegistration() {
    this.socketService.connect();

    this.socketService.on('connect', () => {
      this.socketService.emit('join', this.devicesRegistrationAuthorizationID, () => { });
    });
    //when barcode scanned from device 
    this.socketService.on('authorization', (data) => {
      //clear timer on socket response
      this.stopRequestForGetAuthorization();
      if (data != undefined && data != undefined && data.id === this.authorization.barcodeScanned && data.uid === this.devicesRegistrationAuthorizationID) {
        this.getDeviceAuthorization();
      }
    });

    this.socketService.on('reconnect_failed', () => {
      //after reconnection failed we can start timer
      if (this.authorizationStatus === this.authorization.waitingForbarcodeScan) {
        if (this.getDeviceAuthorizationTimer == undefined)
          this.startRequestForGetAuthorization(this.getAuthorizePoolRequestTimer.first);
      }
    });

    this.socketService.on('disconnect', () => {
      console.log("disconnection success");
    });
  }

  /**
   * @author shreya kanani
   * @description this method authorize the device
   */
  public getDeviceAuthorization() {
   this.signatureService.getDeviceAuthorization({ "ID": this.devicesRegistrationAuthorizationID }).then((response: any) => {
      //check on every response is Device Information Updated or not 
      if (response!= undefined && response.isDeviceInformationUpdated != undefined && response.isDeviceInformationUpdated == true) {
        this.deviceInfo = response;
        this.authorizationStatus = this.authorization.barcodeScanned;
        this.stopRequestForGetAuthorization();
      }
      else {
        this.startRequestForGetAuthorization(this.getAuthorizePoolRequestTimer.next);
      }
    }, (error) => {
      this.stopRequestForGetAuthorization();
      this.isError = true;
      console.log(error);
    });
  }

  /**
   * @author shreya kanani
   * @param PoolAuthRequestTime
   * @description this method start request for device authorization  
   */
  public startRequestForGetAuthorization(PoolAuthRequestTime) {
    this.getDeviceAuthorizationTimer = setTimeout(() => {
      this.getDeviceAuthorization();
    }, PoolAuthRequestTime);
  }

  /**
   * @author shreya kanani
   * @description this method stop request for device authorization
   */
  public stopRequestForGetAuthorization() {
    if (this.getDeviceAuthorizationTimer != undefined) {
      	//setTimeout.cancel(this.getDeviceAuthorizationTimer);
    }
  }

  /**
   * @author shreya kanani
   * @description this method authorize device registration
   */
  public authorize() {
    this.signatureService.authorizeDeviceRegistration({ "ID": this.devicesRegistrationAuthorizationID, "note": this.devicesObject.note }).then(() => {
      //messageService show message 
      this.messageService.showMessage('Device added successfully to list of authorized devices', 'success', 'APPROVE_SUCCESS');
      //after succeessfully authorize call event 
      this.socketService.emit('authorization', { type: "status", data: { id: this.authorization.authorized, uid: this.devicesRegistrationAuthorizationID } }, function () { });
      this.activeModal.close(true);
    }, (error) => {
      this.socketService.emit('authorization', { type: "status", data: { id: this.authorization.notAuthorized, uid: this.devicesRegistrationAuthorizationID } }, function () { });
      console.log(error);
    });
  }

  /**
   * @author shreya kanani
   * @description this method close dialog
   */
  public close() {
    if (this.authorizationStatus === this.authorization.barcodeScanned) {
      this.socketService.emit('authorization', { type: "status", data: { id: this.authorization.notAuthorized, uid: this.devicesRegistrationAuthorizationID } }, () => { });
    }
    this.activeModal.close(false);
  }

  /**
   * @author shreya kanani
   * @description this method check environment mode
   */
  public betaOnly() {
    if (environment.mode == 'beta' || environment.mode == 'local') {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this._init();
    this.appDownloadURL = this.resellerService.getValues(['appDownloadURL']);
    if (this.appDownloadURL != undefined && this.appDownloadURL['appDownloadURL'] != undefined && this.appDownloadURL['appDownloadURL'].signaturePadApp != undefined) {
      this.signaturePadAppDownloadURLAndroid = this.appDownloadURL['appDownloadURL'].signaturePadApp.Android;//get android URL
      this.signaturePadAppDownloadURLIOS = this.appDownloadURL['appDownloadURL'].signaturePadApp.IOS;//get IOS URL
    }
  }
  
  /**
   * @author shreya kanani
   * @description on destroy
   */
  ngOnDestroy() {
    this.socketService.close();
    this.stopRequestForGetAuthorization();

  }
}
