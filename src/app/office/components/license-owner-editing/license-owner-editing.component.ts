// External Imports
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Internal Imports
import { MessageService } from '@app/shared/services';
import { OfficeService } from '@app/office/office.service';

@Component({
  selector: 'app-license-owner-editing',
  templateUrl: './license-owner-editing.component.html',
  styleUrls: ['./license-owner-editing.component.scss']
})
export class LicenseOwnerEditingComponent implements OnInit {

  // holds ui from instance
  public licenseOwnerForm: FormGroup;

  // holds service beureau detail object
  @Input() licenseOwnerDetail: any;

  // output event for refresh customer detail after successfull save.
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _officeService: OfficeService) { }

  /**
   * @author Hannan Desai
   * @description
   *        THis function is used to call service function that call api to save service beureau detail.
   */
  public save() {
    let updatedLicenseOwnerDetail = {
      firmName: this.licenseOwnerForm.controls.firmName.value,
      phoneNo: this.licenseOwnerForm.controls.phoneNo.value,
      ein: this.licenseOwnerForm.controls.ein.value,
      addressType:this.licenseOwnerForm.controls.addressType.value,
      address: {
        street: this.licenseOwnerForm.controls.street.value,
        city: this.licenseOwnerForm.controls.city.value,
        state: this.licenseOwnerForm.controls.state.value,
        zipCode: this.licenseOwnerForm.controls.zipCode.value,
        country: this.licenseOwnerForm.controls.country.value
      }
    }

    this._officeService.saveCustomerDetail({ licenseOwner: updatedLicenseOwnerDetail }).then((result) => {
      this._messageService.showMessage("License owner detail updated successfully.", "success");
      this.close.emit(true);
    })
  }

  // to hide editing section for service beureau
  public cancel() {
    this.close.emit(false);
  }

  /**
   * @author Hannan Desai
   * @description
   *        USed to define form controls
   */
  private defineForm() {
    this.licenseOwnerForm = this._fb.group({
      firmName: ["", [Validators.required, Validators.pattern("(([A-Za-z0-9-\#\(\)]|&|') ?)*([A-Za-z0-9-\#\(\)]|&|')")]],
      street: ["", Validators.pattern("[A-Za-z0-9]( ?[A-Za-z0-9\-/])*")],
      city: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      state: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      addressType:[""],
      zipCode: "",
      country: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      phoneNo: ["", Validators.required],
      ein: ""
    })
  }

  // to set values into form control
  private setValuesIntoForm() {
    this.licenseOwnerForm.setValue({
      firmName: this.licenseOwnerDetail.firmName ? this.licenseOwnerDetail.firmName : "",
      addressType:this.licenseOwnerDetail.addressType ? this.licenseOwnerDetail.addressType : "",
      street: this.licenseOwnerDetail.address && this.licenseOwnerDetail.address.street ? this.licenseOwnerDetail.address.street : "",
      city: this.licenseOwnerDetail.address && this.licenseOwnerDetail.address.city ? this.licenseOwnerDetail.address.city : "",
      state: this.licenseOwnerDetail.address && this.licenseOwnerDetail.address.state ? this.licenseOwnerDetail.address.state : "",
      zipCode: this.licenseOwnerDetail.address && this.licenseOwnerDetail.address.zipCode ? this.licenseOwnerDetail.address.zipCode : "",
      country: this.licenseOwnerDetail.address && this.licenseOwnerDetail.address.country ? this.licenseOwnerDetail.address.country : "",
      phoneNo: this.licenseOwnerDetail.phoneNo ? this.licenseOwnerDetail.phoneNo : "",
      ein: this.licenseOwnerDetail.ein ? this.licenseOwnerDetail.ein : "",
    })
  }

  ngOnChanges() {
    if (!this.licenseOwnerForm) {
      this.defineForm();
    }
    this.setValuesIntoForm();
  }

  ngOnInit() {
  }

}
