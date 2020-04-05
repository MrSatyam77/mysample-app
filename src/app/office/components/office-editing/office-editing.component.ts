// External Imports
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

// Internal Imports
import { officeDetail } from '@app/office/office';
import { OfficeService } from '@app/office/office.service';
import { MessageService, SystemConfigService, UtilityService } from '@app/shared/services';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-office-editing',
  templateUrl: './office-editing.component.html',
  styleUrls: ['./office-editing.component.scss']
})
export class OfficeEditingComponent implements OnInit, OnChanges {
  // holds controls of ui form
  public officeEditForm: FormGroup;

  // holds current office detail object
  @Input() officeDetail: officeDetail;

  // output event for refresh office list after successfull save.
  @Output() close = new EventEmitter<boolean>();

  // country dropdown data
  public countryList = this._systemConfig.getCountryDetail();

  constructor(
    private _fb: FormBuilder,
    private _officeService: OfficeService,
    private _messageService: MessageService,
    private _systemConfig: SystemConfigService,
    private _utilityService: UtilityService) { }

  /**
   *To check environment 
   */
  public betaOnly(){
    if(environment.mode == 'local' || environment.mode == 'beta'){
      return true;
    }else{
      return false;
    }
  }


  /**
   * @author Hannan Desai
   * @description
   *        This function is used to call api to save office details.
   */
  public save() {
    let updatedOfficeDetail: officeDetail = {
      key: this.officeDetail.key,
      name: this.officeEditForm.controls.firmName.value,
      addressType: this.officeEditForm.controls.addressType.value,
      planningToUseBankProduct: this.officeDetail.planningToUseBankProduct
    }
    let addressPropName = this.officeEditForm.controls.addressType.value === 2 ? "foreignAddress" : "usAddress";
    updatedOfficeDetail[addressPropName] = {
      street: this.officeEditForm.controls.street.value,
      zipCode: this.officeEditForm.controls.zipCode.value,
      postalCode: this.officeEditForm.controls.zipCode.value,
      city: this.officeEditForm.controls.city.value,
      state: this.officeEditForm.controls.state.value,
      telephone: this.officeEditForm.controls.telephone.value,
      country: this.officeEditForm.controls.addressType.value === 2 ? this.officeEditForm.controls.country.value : undefined
    }
    // if mode is create than pass newOffice to service to call create api otherwise save api.
    let isNewOffice = this.officeDetail.key === "newOffice" ? true : false;
    // call api to save office detail.
    this._officeService.saveOfficeDetail(updatedOfficeDetail, isNewOffice).then((result) => {
      this._messageService.showMessage("Office saved successfully.", "success");
      this.close.emit(true);
    }, (error) => { })
  }

  // set city and state based on zip code
  public setDataBasedOnZipCode() {
    if (this.officeEditForm.controls.addressType.value === 1) {
      this._utilityService.getCityState(this.officeEditForm.controls.zipCode.value).then((zipData: any) => {
        if (zipData) {
          this.officeEditForm.controls.city.setValue(zipData.city);
          this.officeEditForm.controls.state.setValue(zipData.state);
        };
      });
    }
  }

  // called on cancel office editing
  public cancel() {
    this.close.emit(false);
  }

  /**
   * @author Hannan Desai
   * @description
   *         Used to define controls of ui form.
   */
  private initializeOfficeEditForm() {
    this.officeEditForm = this._fb.group({
      firmName: [null, [Validators.required, Validators.pattern("(([A-Za-z0-9-\#\(\)]|&|') ?)*([A-Za-z0-9-\#\(\)]|&|')")]],
      addressType: 1,
      street: ["", Validators.pattern('[A-Za-z0-9]( ?[A-Za-z0-9\-/])*')],
      zipCode: "",
      city: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      state: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      country: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      telephone: ""
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *          This function is used to set existing office details into form controls.
   */
  private setValuesInForm() {
    this.officeEditForm.setValue({
      firmName: this.officeDetail.name ? this.officeDetail.name : "",
      addressType: this.officeDetail.addressType ? this.officeDetail.addressType : "",
      street: this.officeDetail.address && this.officeDetail.address.street ? this.officeDetail.address.street : "",
      zipCode: this.officeDetail.address && this.officeDetail.address.zipCode ? this.officeDetail.address.zipCode : "",
      city: this.officeDetail.address && this.officeDetail.address.city ? this.officeDetail.address.city : "",
      state: this.officeDetail.address && this.officeDetail.address.state ? this.officeDetail.address.state : "",
      telephone: this.officeDetail.address && this.officeDetail.address.telephone ? this.officeDetail.address.telephone : "",
      country: this.officeDetail.address && this.officeDetail.address.country ? this.officeDetail.address.country : ""
    })
  }

  ngOnChanges() {
    this.officeDetail = JSON.parse(JSON.stringify(this.officeDetail));
    if (!this.officeEditForm) {
      this.initializeOfficeEditForm();
    }
    this.setValuesInForm();
  }

  ngOnInit() {
    // set icon class fro country image
    this.countryList.forEach((country) => {
      country.iconClass = "flag-icon flag-icon-" + country.countryCode;
    });
  }

}
