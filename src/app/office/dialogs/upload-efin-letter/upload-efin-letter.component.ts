//External imports
import { Component, OnInit, ElementRef, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UploadFile, UploadInput, UploadOutput, UploaderOptions } from 'ngx-uploader';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

//Internal imports
import { MessageService, UserService, LocalStorageUtilityService, ResellerService } from '@app/shared/services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-upload-efin-letter',
  templateUrl: './upload-efin-letter.component.html',
  styleUrls: ['./upload-efin-letter.component.scss'],
})

export class UploadEfinLetterComponent implements OnInit {
  public errorType: any = { fileSize: false, invalidType: false };
  public fileSizeMessage: boolean = false;
  public data: any;
  disableUpload: boolean = false;
  uploadInput: EventEmitter<UploadInput>;
  isDocUploadLabelShow: boolean = true;
  public progressPercentage: number = 0;
  public userInfo: any;
  files: UploadFile[];
  // when user drags a file in upload area
  dragOver: boolean;
  isDisabled;
  public invalidType: boolean = false;
  //hold options for upload question data
  options: UploaderOptions = {
    allowedContentTypes: [
      'application/pdf', 'application/x-pdf', 'application/acrobat', 'applications/vnd.pdf', 'text/pdf,text/x-pdf',
      'image/jpeg', 'image/jpg,image/jp_', 'application/jpg', 'application/x-jpg', 'image/pjpeg', 'image/pipeg', 'image/vnd.swiftview-jpeg', 'image/x-xbitmap', 'image/jpe_,image/png', 'application/png', 'application/x-png'
    ],
    concurrency: 1
  };


  constructor(private _messageService: MessageService, private _ngbActiveModal: NgbActiveModal,
    private _userService: UserService, private _localStorageUtilityService: LocalStorageUtilityService,
    private _resellerService: ResellerService, private _cdr: ChangeDetectorRef, ) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }
  @ViewChild('uploader', { static: false }) uploaderInput: ElementRef;
  ngOnInit() {
    if (this.data) {
      this.userInfo = this.data.userInfo;
    }
  }

  /**
   * 
   * @param closeData 
   */
  public close(closeData?: any) {
    this._ngbActiveModal.close(closeData);
  };

  public onUploadOutput(output: UploadOutput): any {
    const self = this;
    let masterLocationId = self._userService.getValue('masterLocationId');
    self.invalidType = false;
    self.fileSizeMessage = false;
    if (self.uploaderInput !== undefined && self.uploaderInput.nativeElement !== undefined) {
      self.uploaderInput.nativeElement.value = '';
    }
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      if (!self.fileSizeMessage && !self.disableUpload) {
        const event: UploadInput = {
          type: 'uploadFile',
          file: self.files[0],
          url: `${environment.base_url}/documentmanager/efin/uploadLetter`,
          method: 'POST',
          data: {
            data: JSON.stringify({ 'userId': self.userInfo.key, "efin" : self.userInfo.efin , "emailHash": self.userInfo.email, "masterLocationId": masterLocationId })
          },
          headers: {
            'X-XSRF-TOKEN': self._localStorageUtilityService.getFromLocalStorage('xsrfToken'),
            'X-Appid': self._resellerService.getValue('appId'),
            'X-Location': self._userService.getLocationId(false),
            'X-Taxyear': self._userService.getTaxYear()
          }
        };
        self.uploadInput.emit(event);
      } else {
        self.uploadInput.emit({ type: 'removeAll' });
      }
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      if (output.file.size > 5 * 1024 * 1024) {
        self.errorType.fileSize = true;
      } else {
        self.files[0] = output.file;
        self.errorType.fileSize = false;
      }
      // self._cdr.detectChanges();
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // self.fileSizeMessage = false;
      self.disableUpload = true;
      self.isDocUploadLabelShow = true;

      // update current data in files array for uploading file
      const index = self.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      self.files[index] = output.file;
      self.progressPercentage = output.file.progress.data.percentage;

    } else if (output.type === 'removed') {
      // remove file from array when removed
      self.files = self.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      if (self.disableUpload) {
        self.dragOver = false;
        self.isDocUploadLabelShow = true;
      } else {
        self.dragOver = true;
        self.isDocUploadLabelShow = false;
      }
    } else if (output.type === 'dragOut') {
      self.dragOver = false;
      self.isDocUploadLabelShow = true;
    } else if (output.type === 'drop') {
      self.dragOver = false;
      self.isDocUploadLabelShow = true;
    } else if (output.type === 'done') {
      const document = JSON.parse(JSON.stringify(output.file.response));
      self._messageService.showMessage('File uploaded successfully', 'success');
      self.disableUpload = false;
      self.close(document);
      //get userDetails
      // let userDetails = self._userService.getUserDetails();
      //if we update currunt location 
      // if (userDetails.currentLocationId && userDetails.currentLocationId !== '') {
      //   if ($scope.locationInfo.locationId === userDetails.currentLocationId) {
      //     //To avoid synchronize data from server we modified location locally.				
      //     //We have taken temp variable, because we are not sure at self point that user will save all details or not
      //     //so for saftey we are only syncing what is required at self point to avoid data mismatch between client and server
      //     var tempLocationData = angular.copy(userService.getLocationData());
      //     tempLocationData.efinStatus = 1;
      //     tempLocationData.documentId = response.data.data.documentId;
      //     userService.setLocationData(tempLocationData);

      //     //We also have to set isOfficeSetuDone as false to show red mark on widget in dashboard				
      //     var tempLocationSetUpConfig = {};
      //     tempLocationSetUpConfig[$scope.locationInfo.locationId] = { "setupConfig": { "isOfficeDone": false, "isPreparerDone": true } };
      //     userService.updateLocationsSetUpConfig(tempLocationSetUpConfig);

      //     //publish message to get refresh user headerNav data
      //     postal.publish({
      //       channel: 'MTPO-Dashboard',
      //       topic: 'RefreshUserHeaderNavData',
      //       data: {}
      //     });
      //   }
      //}
    } else if (output.type === 'rejected') {
      // self.fileSizeMessage = false;
      self.invalidType = true;
    }
  }

}
