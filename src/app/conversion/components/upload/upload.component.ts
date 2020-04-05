/** External import */
import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";

import * as moment from "moment";
/** Internal import */
import { ConversionUploaderservice } from '@app/conversion/conversion-uploader.service';
import { ConversionDetailService } from '@app/conversion/conversion-details/conversion-detail.service';
import { FileValidationComponent } from "../../dialogs/filevalidation/filevalidation.component";
import { DialogService } from "@app/shared/services/dialog.service";
import { UserService, ResellerService } from '@app/shared/services';
import { IFileList } from '@app/conversion/conversion.model';
import { FilesConflictsComponent } from '@app/conversion/dialogs/files-conflicts/files-conflicts.component';

@Component({
  selector: 'convesrion-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  /** Public variable */
  @Input() selectedSoftware: any;
  @Output() checkFileUpload = new EventEmitter<boolean>();
  @ViewChild("browseButton", { static: true }) browseButton: ElementRef;
  @ViewChild("uploadFiles", { static: true }) uploadFiles: ElementRef;
  @ViewChild("dragHere", { static: true }) dragHere: ElementRef;

  /** Private variable */
  private fileValidationsData: any = {};
  private userDetails: any;
  private invalidFileSubscription: any;
  private SWPattern: any;
  private fileNameRegex = new RegExp('^[\$\~]');
  private folderPathRegex = new RegExp('(DT)\/\\b[0-9]\\b\/');

  fileList: IFileList[] = [];
  constructor(
    private _conversionUploaderSerive: ConversionUploaderservice,
    private _conversionDetailService: ConversionDetailService,
    private _dialogService: DialogService,
    private _userService: UserService,
    private _router: Router,
    private _resellerService: ResellerService,
  ) { }

  /** Init */
  ngOnInit() {
    this.fileValidationsData.supportExtension = this._conversionDetailService.getExtension(this._userService.getTaxYear());
    this.SWPattern = this._conversionDetailService.getPattern(this.selectedSoftware);
    this.userDetails = this._userService.getUserDetails();
    this.createResumableUpload();
  }

  /** Create new object for Resumable */
  private createResumableUpload() {
    /** remove previous object  */
    if (this._conversionUploaderSerive.resumableUpload) {
      this._conversionUploaderSerive.resumableUpload = undefined;
    }

    this._conversionUploaderSerive.createResumableObject(this.fileValidationsData.supportExtension, this.selectedSoftware.value);
    /** Check browser support */
    if (!this._conversionUploaderSerive.resumableUpload.support) {
      console.log("browser not support");
      return;
    }
    /** assign browse and drop  */
    this._conversionUploaderSerive.resumableUpload.assignBrowse(this.browseButton.nativeElement, this.selectedSoftware.isDirectory);
    this._conversionUploaderSerive.resumableUpload.assignDrop(this.dragHere.nativeElement);
    this.fileUploadEvents();

    /** Get invalid files */
    this.invalidFileSubscription = this._conversionUploaderSerive.invalidFileEvent.subscribe(
      (result) => {
        if (result && result.length > 0) {
          this.createNewJob(result);
        }
        else if (this.SWPattern.name == this.selectedSoftware.name.toLowerCase()) {
          this.createNewJob([]);
        }
      });
  }

  /** Handle file upload event */
  fileUploadEvents() {
    let _self = this;
    /** Add multiple files */
    this._conversionUploaderSerive.resumableUpload.on('filesAdded', function (files) {
      if (files.length > 0) {
        if (_self._conversionUploaderSerive.getFolderPath(files[0].relativePath) != "") {
          _self.fileValidationsData.IsFolder = true;
        }
        else {
          _self.fileValidationsData.IsFolder = false;
        }
        _self._conversionUploaderSerive.totalFiles = _self._conversionUploaderSerive.resumableUpload.files.length;
        if (!_self.SWPattern || _self.SWPattern.name !== _self.selectedSoftware.name.toLowerCase()) {
          _self.createNewJob([]);
        }
        else {
          _self._conversionUploaderSerive.customFileValidations(_self.SWPattern, _self._userService.getTaxYear());
        }
      }
    });
  }

  /** Create new Job */
  private createNewJob(invalidFiles) {
    let _self = this;
    let parameter = {
      softwareName: { text: this.selectedSoftware.text, value: this.selectedSoftware.value, name: this.selectedSoftware.name },
      taxYear: this._userService.getTaxYear(),
      isTestCase: this.selectedSoftware.name == "ProSeries" ? true : false,
      isLimitedConversion: this.selectedSoftware.name == "ProSeries" ? false : true
    }
    return new Promise((resolve, reject) => {
      this._conversionDetailService.beforeUpload(parameter).then((response: any) => {
        if (response) {
          this._conversionUploaderSerive.jobData = response.data;
          if (!this.updateFileStatus(invalidFiles)) {
            _self.fileValidationsData.files = this.fileList;
            _self.fileValidationsData.software = this.selectedSoftware;
            let dialog = _self._dialogService.custom(FileValidationComponent, _self.fileValidationsData, { 'keyboard': false, 'backdrop': false, 'size': 'md' });
            dialog.result.then((data) => {
              if (data.result) {
                this.updateJobData();
              }
              else {
                this._conversionDetailService.uploadCancel(this._conversionUploaderSerive.jobData.jobId, this.fileList.map(x => x.fileName)).then(
                  (result) => {
                    this.checkFileUpload.emit(true);
                  }
                );
                this.fileList = [];
                this._conversionUploaderSerive.clearObjects();
                this._conversionUploaderSerive.resumableUpload.cancel();
              }
            });
          }
          else {
            this.updateJobData();
          }
        }
      }, (error) => {
        this._conversionUploaderSerive.resumableUpload.cancel();
        this._conversionUploaderSerive.clearObjects();
        reject(error);
      });
    });

  }

  /** update job data if valid or invalid file */
  updateJobData(requiredVerification = true) {
    let _self = this;
    if (this.selectedSoftware.name.toLowerCase() == "drake") {
      this.fileList = this.fileList.filter(x => x.isValid);
    }
    let parameter = { cjKey: this._conversionUploaderSerive.jobData.jobId, fileList: this.fileList };
    return new Promise((resolve, reject) => {
      this._conversionDetailService.updateJobData(parameter).then((response: any) => {
        if (response.data) {
          if (requiredVerification) {
            _self.varifiesDuplicateFiles();
          }
          else {
            this.fileList = [];
          }
        }
      }, (error) => {
        this._conversionUploaderSerive.resumableUpload.cancel();
        this._conversionUploaderSerive.clearObjects();
        reject(error);
      });
    });
  }

  /** Varify duplicate files */
  varifiesDuplicateFiles() {
    let _self = this;
    let validFiles = this.fileList.filter(x => x.isValid == true);
    let parameter = { cjKey: this._conversionUploaderSerive.jobData.jobId, fileList: validFiles };
    return new Promise((resolve, reject) => {
      this._conversionDetailService.varifieFileList(parameter).then((response: any) => {
        if (response.data && response.data.length > 0) {
          let data = { newFiles: this._conversionDetailService.getDuplicateFileList(this.fileList, response.data), oldFiles: response.data };
          let dialog = this._dialogService.custom(FilesConflictsComponent, data, { 'keyboard': false, 'backdrop': false, 'size': 'lg' });
          dialog.result.then((data) => {
            if (data.result) {
              this.updateCustomerDecision(data.data).then((response) => {
                if (response) {
                  this._router.navigate(["conversionnew"]);
                  this.setFileUploadRequestData();
                  this._conversionUploaderSerive.resumableUpload.upload();
                }
              }, (error) => {
                this._conversionUploaderSerive.resumableUpload.cancel();
                this._conversionUploaderSerive.clearObjects();
              });
            }
            else {
              this.updateCustomerDecision(data.data).then((response) => {
                if (response) {
                  this._router.navigate(["conversionnew"]);
                }
              }, (error) => {
                this._conversionUploaderSerive.resumableUpload.cancel();
                this._conversionUploaderSerive.clearObjects();
              });
            }
          });
        }
        else {
          this.setFileUploadRequestData();
          this._conversionUploaderSerive.resumableUpload.upload();
          this._router.navigate(["conversionnew"])
        }
      }, (error) => {
        this._conversionUploaderSerive.resumableUpload.cancel();
        this._conversionUploaderSerive.clearObjects();
        reject(error);
      });
    });
  }

  /** Set file upload request data */
  setFileUploadRequestData() {
    this._conversionUploaderSerive.resumableUpload.updateQuery({
      locationId: this._userService.getLocationId(true),
      resellerId: this._resellerService.getValue('appId'),
      email: this.userDetails.email,
      taxYear: this._userService.getTaxYear(),
      softwareName: this.selectedSoftware.name,
      isTestCase: false,// this.selectedSoftware.name == "ProSeries" ? true : false,
      isLimitedConversion: true,// this.selectedSoftware.name == "ProSeries" ? false : true,
      conversionJobId: this._conversionUploaderSerive.jobData.jobId
    });
  }

  /** Update Customer decision file status */
  updateCustomerDecision(data) {
    return new Promise((resolve, reject) => {
      let parameter = { cjKey: this._conversionUploaderSerive.jobData.jobId, fileList: data.oldFiles };
      this._conversionDetailService.updateCustomerDecision(parameter).then((response: any) => {
        resolve(response.data);
      }, (error) => {
        reject(error);
      });
    });
  }

  /** Validate file(s) */
  private updateFileStatus(invalidFiles): boolean {
    this._conversionUploaderSerive.resumableUpload.files.forEach(element => {
      /** Validate file name start with '~','$' and 0 KB file */
      if (this.fileNameRegex.test(element.fileName) || element.size == 0) {
        invalidFiles.push(element);
      }
      /** Validate folder structure for drake like DT/0/ */
      if (this.selectedSoftware.name.toLowerCase() == "drake") {
        if (!this.folderPathRegex.test(element.relativePath) || element.relativePath.toLowerCase().indexOf("archive") != -1) {
          invalidFiles.push(element);
        }
      }
      else if (this.selectedSoftware.name.toLowerCase() == "ultratax") {
        if (element.relativePath.indexOf("UT18DATA") == -1) {
          invalidFiles.push(element);
        }
      }

      /** In case of tax wise or any other software files not remove from resumableupload so we need to check */
      let index = invalidFiles.findIndex(x => x.fileName == element.fileName);
      if (index == -1) {
        this.fileList.push({ fileName: element.fileName, createdDate: moment(element.file.lastModifiedDate).utc().format(), isValid: true, size: element.size });
      }
    });
    if (invalidFiles && invalidFiles.length > 0) {
      invalidFiles.forEach(element => {
        this.fileList.push({ fileName: element.name ? element.name : element.fileName, createdDate: moment(element.lastModifiedDate).utc().format(), isValid: false, size: element.size, relativePath: element.relativePath });
      });

      //delete invalid file from upload
      invalidFiles.forEach(element => {
        let fileIndex = this._conversionUploaderSerive.resumableUpload.files.findIndex(x => x.fileName == element.fileName);
        if (fileIndex != -1) {
          this._conversionUploaderSerive.resumableUpload.files.splice(fileIndex, 1);
        }
      });
    }

    if (this.selectedSoftware.name.toLowerCase() == "drake") {
      let validFiles = this.fileList.filter(x => x.isValid);
      if (validFiles.length > 0) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return (invalidFiles && invalidFiles.length > 0) ? false : true;
    }
  }

  /** Destroy */
  ngOnDestroy() {
    if (this.invalidFileSubscription) {
      this.invalidFileSubscription.unsubscribe()
    }
  }
}
