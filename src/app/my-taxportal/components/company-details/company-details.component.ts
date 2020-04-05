import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { UserService, DialogService, MessageService } from '@app/shared/services';
import { ImageCropperComponent } from '@app/my-taxportal/dialogs/image-cropper/image-cropper.component';
import { MyTaxportalService } from '@app/my-taxportal/my-taxportal.service';


@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  @Input() settings: any = {};
  @Output() settingsChange: EventEmitter<any> = new EventEmitter<any>();

  public mode: string = 'view';
  public permission: any = {};
  private preserveCompanyName: string;

  @ViewChild('uploadCompanyLogoInput', { static: false }) uploadCompanyLogoInput: ElementRef;

  constructor(private messageService: MessageService, private userService: UserService, private dialogService: DialogService, private myTaxPortalService: MyTaxportalService) { }


  /**
   * @author Ravi Shah
   * Change Company Logo
   * @param {*} files
   * @memberof CompanyDetailsComponent
   */
  public changeCompanyLogo(files) {
    if (files && files.target && files.target.files && files.target.files[0]) {
      const fileName = files.target.files[0].name;
      const idxDot = fileName.lastIndexOf('.') + 1;
      const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (extFile === 'jpg' || extFile === 'jpeg' || extFile === 'png') {
        this.dialogService.custom(ImageCropperComponent, { title: 'test dialog custome', file: files }, {}).result.then((file: any) => {
          if (file && file.image) {
            this.settings.companyLogo = file.image;
            this.saveCompanyDetails({ img: file.image }).then((result) => {
              this.messageService.showMessage('Company Logo Uploaded Successfully.', 'success');
            });
          }
        });
      }
    }
  }

  /**
   * @author Ravi Shah
   * Remove Logo
   * @memberof CompanyDetailsComponent
   */
  public removeLogo() {
    this.myTaxPortalService.removeCompanyLogo().then(() => {
      if (this.uploadCompanyLogoInput && this.uploadCompanyLogoInput.nativeElement) {
        this.uploadCompanyLogoInput.nativeElement.value = '';
      }
      this.settings.companyLogo = undefined;
      this.mode = 'view';
      this.messageService.showMessage('Company Logo Removed Successfully.', 'success');
    });
  }

  /**
   * @author Ravi Shah
   * Save Company Name
   * @memberof CompanyDetailsComponent
   */
  public saveCompanyName() {
    this.myTaxPortalService.saveCompanySettings({ companyName: this.settings.companyName }).then((result) => {
      this.mode = 'view';
      this.preserveCompanyName = this.settings.companyName;
      this.messageService.showMessage('Company Settings saved successfully.', 'success');
      this.settingsChange.emit(this.settings);
    }, error => {
      this.messageService.showMessage('Error occured while saving the company settings.', 'error');
    })
  }

  /**
   * @author Ravi Shah
   * Switch to Edit Mode
   * @memberof CompanyDetailsComponent
   */
  public switchToEditMode() {
    if (this.mode === 'view') {
      this.preserveCompanyName = this.settings.companyName;
      this.mode = 'edit';
    } else {
      this.settings.companyName = this.preserveCompanyName;
      this.mode = 'view';
    }
  }

  /**
   * @author Ravi Shah
   * Save Company Details
   * @private
   * @param {*} details
   * @returns
   * @memberof CompanyDetailsComponent
   */
  private saveCompanyDetails(details: any) {
    return new Promise((resolve, reject) => {
      this.myTaxPortalService.saveCompanySettings(details).then((result) => {
        this.mode = 'view';
        resolve(result);
      })
    })
  }

  ngOnInit() {
    this.mode = this.settings.companyName ? 'view' : 'edit';
    this.permission = {
      canSettingSave: this.userService.can('CAN_SAVE_CLIENT_SETTING')
    }
  }
}
