//External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal Imports
import { ResellerService } from '@app/shared/services/reseller.service';
import { SystemConfigService } from '@app/shared/services/system-config.service';
import { environment } from '@environments/environment';
import { SignatureService } from '@app/signature/signature.service';
import { SocketService } from '@app/shared/services/socket.service';
import { MessageService } from '@app/shared/services/message.service';

@Component({
  selector: 'app-signaturecapture',
  templateUrl: './signature-capture.component.html',
  styleUrls: ['./signature-capture.component.scss']
})
export class SignaturecaptureComponent implements OnInit {

  constructor(private resellerService: ResellerService,
    private systemconfigService: SystemConfigService,
    private signatureService: SignatureService,
    private activeModal: NgbActiveModal,
    private socketService: SocketService,
    private messageService: MessageService) { }

  @Input() data: any;
  private getCaptureSignaturePoolRequestTimer: any = { "first": 10000, "next": 5000 }; //here first request with 60 sec then 15 sec 
  private signatureCaptureAuthorizationID; any;
  private getCaptureAuthorizationTimer: any;
  public signatureCaptureStatus: any;  //set status based on response
  public isError: boolean = false; 
  public isScocketConnection: boolean = false;
  public signatureTypeLookup: any;
  public signatureCaptureData: any;
  public appName: any;
  public isAnyDeviceRegistered: boolean;
  public signatureType: any;
  public signatureDataList: any; //store signature data
  public signatureConsentsLookup: any = {
    1: { displayText: "I consent to use my electronically captured signature as a handwritten signature on printed tax returns, bank applications and any other forms needing the ERO signature to electronically file tax returns." },
    2: { displayText: "I consent to use my electronically captured signature as a handwritten signature on printed tax returns, bank applications and any other forms needing the Preparer signature to electronically file tax returns." },
    3: { displayText: "I received consent from the taxpayer and/or spouse to use their electronically captured signature as a handwritten signature on the printed tax return(s), bank application(s) and any other forms the taxpayer and/or spouse signature is needed to electronically file the tax return.  Furthermore, I confirm the taxpayer and/or spouse electronic signature was captured in my presence after verifying their identity using valid identification documents." },
    4: { displayText: "I received consent from the taxpayer and/or spouse to use their electronically captured signature as a handwritten signature on the printed tax return(s), bank application(s) and any other forms the taxpayer and/or spouse signature is needed to electronically file the tax return.  Furthermore, I confirm the taxpayer and/or spouse electronic signature was captured in my presence after verifying their identity using valid identification documents." },
  };

  //enum for signatureCapture steps
  public signatureCapture = {
    waitingForbarcodeScan: 0,
    barcodeScanned: 4,
    waitingForCaptureSignature: 5,
    capturingSignature: 6,
    reviewSignature: 7,
    uploadingSignature: 8,
    success: 9,
    failed: 10,
    authorized: 11,
    notAuthorized: 12,
  };


  /**
   * @author shreya kanani
   * @description this method check environment mode
   */
  betaOnly() {
    if (environment.mode == 'beta' || environment.mode == 'local') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @author shreya kanani
   * @description this method create signature
   */
  public _init() {
    if (this.data != undefined && this.data.captureObject != undefined) {
      this.signatureService.createSignatureForCapture(this.data.captureObject).then((response: any) => {
        if (response != undefined   && response.isApproved == true && response.authorizationData != undefined) {
          this.isAnyDeviceRegistered = true;
          this.signatureCaptureData = response.authorizationData;
          this.signatureCaptureAuthorizationID = response.ID;
          this.signatureCaptureStatus = this.signatureCapture.waitingForbarcodeScan;
          this.startSocketConnectionWithEventsForSignatureCapture();
          this.startRequestForCapture(this.getCaptureSignaturePoolRequestTimer.first);
        }else if (response != undefined  && response.isApproved == false) {
          this.isAnyDeviceRegistered = false;
        }
      }, (error) => {
        console.log(error);
      });
    }
    else {
      this.activeModal.close(false);
    }
  }

  /**
   * @author shreya kanani
   * @description start socket connection for signature capture
   */
  public startSocketConnectionWithEventsForSignatureCapture() {
    this.socketService.connect();
    this.socketService.on('connect', function () {
      this.socketService.emit('join', this.signatureCaptureAuthorizationID, function () {
      });
    });
    //when barcode scanned from device 
    this.socketService.on('signatureCapture', (data) => {
      this.isScocketConnection = true;
      this.stopRequestForCapture();
      if (data != undefined && data != undefined && data.uid === this.signatureCaptureAuthorizationID) {
        if (data.id === this.signatureCapture.success) {
          this.getCaptureAuthorization();
        }
        else if (data.id === this.signatureCapture.waitingForCaptureSignature || data.id === this.signatureCapture.capturingSignature) {
          //we are updating data from outside usigg socket service so here require evalasync to force update of scope
          setTimeout(() => {
            this.signatureType = data.type;
            this.signatureCaptureStatus = data.id;
          });
        }
        else {
          //we are updating data from outside usigg socket service so here require evalasync to force update of scope
          setTimeout(() => {
            this.signatureCaptureStatus = data.id;
          });
        }
      }
    });
    this.socketService.on('reconnect_failed',  ()=> {
      //after reconnection failed we can start timer
      if ((this.signatureCaptureStatus != this.signatureCapture.success) || (this.signatureCaptureStatus != this.signatureCapture.failed)) {
        this.isScocketConnection = false;
        if (this.getCaptureAuthorizationTimer == undefined)
          this.startRequestForCapture(this.getCaptureSignaturePoolRequestTimer.first);
      }
    });
    this.socketService.on('disconnect', () =>{
      this.isScocketConnection = false;
      console.log("disconnection success");
    });
  }

  /**
   * @author shreya kanani
   * @description this method authorize capture signature
   */
  public getCaptureAuthorization() {
    this.signatureService.getCaptureAuthorization({ "ID": this.signatureCaptureAuthorizationID }).then((response: any) => {
      if (response != undefined && response.isSignatureUploaded != undefined && response.isSignatureUploaded == true) {
        this.signatureCaptureStatus = this.signatureCapture.success;
        this.signatureDataList = response.signatureData;
        this.stopRequestForCapture();
      }else {
        this.startRequestForCapture(this.getCaptureSignaturePoolRequestTimer.next);
      }
    }, (error) => {
      this.stopRequestForCapture();
      this.isError = true;
      console.log(error);
    });
  }

  /**
   * @author shreya kanani
   * @param poolCaptureRequestTime
   * @description start request for signature capture 
   */
  //interval for startRequestForGet
  public startRequestForCapture(poolCaptureRequestTime) {
    this.getCaptureAuthorizationTimer = setTimeout(() => {
      this.getCaptureAuthorization();
    }, poolCaptureRequestTime);
  };

  /**
   * @author shreya kanani
   * @description stop request for signature capture
   */
  public stopRequestForCapture() {
    if (this.getCaptureAuthorizationTimer != undefined) {
    }
  }

  /**
   * @author shreya kanani
   * @description this method check all signature
   */
  public getIsCheckAll() {
    let isCheckAll = true;
    this.signatureDataList.forEach((signatureData) => {
      if (signatureData.isApprove == undefined || signatureData.isApprove == false)
        isCheckAll = false;
    });
    return isCheckAll;
  }

  /**
   * @author shreya kanani
   * @description this method approve signature
   */
  public approve() {
    const self = this;
    //prepare object for signature approve 
    let signatureDataList = [];
   this.signatureDataList.forEach(signatureData => {
      signatureDataList.push({ "type": signatureData.type, "ID": signatureData.ID, "isApproved": signatureData.isApprove })
    });
    let approveSignatureObject = { "ID": this.signatureCaptureAuthorizationID, "signatureData": signatureDataList };
    this.signatureService.approveSignature(approveSignatureObject).then(() => {
      let signatureApproveMessage = '';
      if (signatureDataList.length > 0 && signatureDataList[0].type != undefined) {
        if (signatureDataList[0].type == 3 || signatureDataList[0].type == 4) {
          signatureApproveMessage = this.signatureTypeLookup[3].displayText + " ";
        }
        else {
          signatureApproveMessage = this.signatureTypeLookup[signatureDataList[0].type].displayText + " ";
        }
      }
      //messageService show message 
      self.messageService.showMessage(signatureApproveMessage + 'signature is added ', 'success', 'SIGN_APPROVE_SUCCESS');
      self.activeModal.close(true);
      self.socketService.emit('signatureCapture', { type: "status", data: { id: this.signatureCapture.authorized, uid: this.signatureCaptureAuthorizationID } }, () => { });
    }, (error) => {
      this.socketService.emit('signatureCapture', { type: "status", data: { id: this.signatureCapture.notAuthorized, uid: this.signatureCaptureAuthorizationID } }, () => { });
      console.log(error);
    });
  }

  /**
   * @author shreya kanani
   * @description this method close the dialog 
   */
  public close() {
   if (this.signatureCaptureStatus == this.signatureCapture.success)
     this.socketService.emit('signatureCapture', { type: "status", data: { id: this.signatureCapture.notAuthorized, uid: this.signatureCaptureAuthorizationID } },  () => { });
    this.activeModal.close(false);
  }

  /**
   * @author shreya kanani
   * @description this method recapture the signature
   */
  public redraw() {
    this.socketService.emit('signatureCapture', { type: "status", data: { id: this.signatureCapture.waitingForCaptureSignature, uid: this.signatureCaptureAuthorizationID } }, () => { });
  }

 ngOnInit() {
    this._init();
    this.signatureTypeLookup = this.systemconfigService.getsignatureTypeLookup();
    this.appName = this.resellerService.getValue('appName');
  }

  /**
   * @author shreya kanani
   * @description on destroy
   */
  ngOnDestroy() {
    this.socketService.close();
    this.stopRequestForCapture();
  }
}
