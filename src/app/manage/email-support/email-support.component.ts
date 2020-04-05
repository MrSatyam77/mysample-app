import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { UploadInput, UploaderOptions, UploadOutput, UploadFile } from 'ngx-uploader';
import { environment } from '@environments/environment';
import { MessageService } from '@app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { APINAME } from '../manage.constants';
import { EmailSupportService } from './email-support.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-email-support',
  templateUrl: './email-support.component.html',
  styleUrls: ['./email-support.component.scss'],
  providers: [EmailSupportService]
})
export class EmailSupportComponent implements OnInit {

  public emailAttachmentDetail: any = { subject: '', message: '', attachedFiles: [] }
  public errorType: string;
  private routeSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private messageService: MessageService, private router: Router, private emailSupportService: EmailSupportService) { }

  public disabledUpload: boolean = false;
  files: any = [];
  /**File Upload */
  options: UploaderOptions = {
    allowedContentTypes: [
      "application/pdf",
      "application/x-pdf",
      "application/acrobat",
      "applications/vnd.pdf",
      "text/pdf",
      "text/x-pdf",
      "image/jpeg",
      "image/jpg",
      "image/jp_",
      "application/jpg",
      "application/x-jpg",
      "image/pjpeg",
      "image/pipeg",
      "image/vnd.swiftview-jpeg",
      "image/x-xbitmap",
      "image/jpe_",
      "image/png",
      "application/png",
      "application/x-png",
      "application/msword",
      "application/doc",
      "appl/text",
      "application/vnd.msword",
      "application/vnd.ms-word",
      "application/winword",
      "application/word",
      "application/x-msw6",
      "application/x-msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "application/x-vnd.oasis.opendocument.text",
      "application/kswps",
      "application/vnd.ms-excel",
      "application/msexcel",
      "application/x-msexcel",
      "application/x-ms-excel",
      "application/vnd.ms-excel",
      "application/x-excel",
      "application/x-dos_ms_excel",
      "application/xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/kset",
      "image/tif",
      "image/x-tif",
      "image/tiff",
      "image/x-tiff",
      "application/tif",
      "application/x-tif",
      "application/tiff",
      "application/x-tiff",
      "application/zip",
      "application/x-zip",
      "application/x-zip-compressed",
      "application/octet-stream",
      "application/x-compress",
      "application/x-compressed",
      "multipart/x-zip",
      "text/plain",
      "application/txt",
      "browser/internal",
      "text/anytext",
      "widetext/plain",
      "widetext/paragraph"
    ],
    concurrency: 1
  };
  acceptedFileType: string;
  uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();
  @ViewChild('uploader', { static: false }) uploaderInput: ElementRef;


  /**
   * @author Ravi Shah
   * Save the Support Details
   * @memberof EmailSupportComponent
   */
  public save() {
    this.emailAttachmentDetail.attachedFiles = JSON.parse(JSON.stringify(this.files));
    this.emailSupportService.saveSupportDetail(this.emailAttachmentDetail).then((response: any) => {
      this.emailAttachmentDetail = { subject: '', message: '', attachedFiles: [] }
      this.files = [];
      this.errorType = '';
      this.messageService.showMessage('Request submitted', 'success');
    });
  }

  /**
   * @author Ravi Shah
   * Go to Home Page
   * @memberof EmailSupportComponent
   */
  public gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * @author Ravi Shah
   * Upload the Files Handler
   * @param {UploadOutput} output
   * @memberof EmailSupportComponent
   */
  onUploadOutput(output: UploadOutput): void {
    if (this.uploaderInput !== undefined && this.uploaderInput.nativeElement !== undefined) {
      this.uploaderInput.nativeElement.value = '';
    }
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      if (!this.disabledUpload && !this.errorType) {
        // 
        // uncomment this if you want to auto upload files when added
        const event: UploadInput = {
          type: 'uploadAll',
          url: `${environment.base_url}${APINAME.SUPPORT_EMAIL_ATTACHMENT}`,
          method: 'POST',
          headers: {
            'X-XSRF-TOKEN': JSON.parse(localStorage.getItem('xsrfToken'))
          },
          withCredentials: true,
        };
        this.uploadInput.emit(event);
      } else {
        this.uploadInput.emit({ type: 'removeAll' });
      }
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      if (output.file.size > (2 * 1024 * 1024)) {
        this.errorType = 'size';
      } else {
        this.errorType = '';
        this.files.push(output.file);
      }
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      this.disabledUpload = true;
    } else if (output.type === 'removed') {
    } else if (output.type === 'rejected') {
      this.errorType = 'invalid';
      this.uploadInput.emit({ type: 'cancel', id: output.file.id });
      this.messageService.showMessage(`Attached file with name : ${output.file.name} has invalid type. Please attach a valid file type.`, 'error');
    } else if (output.type === 'dragOver') {
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
    } else if (output.type === 'done') {
      this.disabledUpload = false;
      let isExists = this.files.findIndex(t => t.name === output.file.response.data.fileName && output.file.id === t.id);
      if (output.file.response.code === 2000) {
        if (isExists > -1) {
          this.files[isExists] = {
            id: output.file.response.data.id,
            fileName: output.file.response.data.fileName,
            name: output.file.response.data.fileName
          }
        }
        this.errorType = '';
      } else if (output.file.response.code === 4019) {
        this.files.splice(isExists, 1);
        this.errorType = 'invalid';
      } else {
        this.files.splice(isExists, 1);
        this.errorType = 'invalid';
      }
    }
  }

  /**
   * @author Ravi Shah
   * Remove Files
   * @param {number} index
   * @memberof EmailSupportComponent
   */
  public removeFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * @author Ravi Shah
   * Subject Change Handler
   * @memberof EmailSupportComponent
   */
  public onChangeSubject() {
    if (this.emailAttachmentDetail.subject && this.emailAttachmentDetail.subject.toLowerCase() == "training webinar") {
      this.emailAttachmentDetail.message = `<div class="ql-editor" data-gramm="false" contenteditable="true" data-placeholder="Insert text here ...">
        <h2><strong>How to Attend a Training Webinar</strong></h2>
        <p><br></p>
        <h3>Join us every <strong>Monday to Friday at 2 p.m. ET </strong> for a training webinar with one of our support specialists.</h3>
        <p><br></p>
        <h3>To join this meeting:</h3>
        <h3><br></h3>
        <h3>Go to:<a href="https://app.gotomeeting.com/?meetingId=799597533" rel="noopener noreferrer" target="_blank"> https://app.gotomeeting.com/?meetingId=799597533</a></h3>
        <h3><br></h3>
        <h3>Or follow the steps below:</h3>
        <h3><br></h3>
        <h3>1) Open Google Chrome</h3>
        <h3>2) Visit <a href="https://www.JoinGoToMeeting.com" rel="noopener noreferrer" target="_blank">www.JoinGoToMeeting.com</a></h3>
        <h3>3) Enter Meeting ID: 799-597-533</h3>
        <p><br></p>
        <h3>We’ll answer your questions during a live webinar walking you through the features and functions you need to be ready for tax season.</h3>
        <p><br></p>
        <h3>Thank you,</h3>
        <h3>MyTAXPrepOffice Team</h3>
        <p><br></p>
        </div>`
    }
  }

  ngOnInit() {
    this.acceptedFileType = this.options.allowedContentTypes.toString();
    this.routeSubscription = this.activatedRoute.paramMap.subscribe((params: any) => {
      this.emailAttachmentDetail.subject = params.params.subject ? params.params.subject : undefined;
      this.emailAttachmentDetail.message = params.params.message ? params.params.message : undefined;
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
