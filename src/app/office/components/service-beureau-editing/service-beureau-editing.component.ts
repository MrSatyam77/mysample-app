// External Imports
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Internal Imports
import { MessageService, UtilityService } from '@app/shared/services';
import { OfficeService } from '@app/office/office.service';

@Component({
  selector: 'app-service-beureau-editing',
  templateUrl: './service-beureau-editing.component.html',
  styleUrls: ['./service-beureau-editing.component.scss']
})

export class ServiceBeureauEditingComponent implements OnInit, OnChanges {

  // holds ui from instance
  public serviceBeureauForm: FormGroup;

  // holds service beureau detail object
  @Input() serviceBeureauDetail: any;

  // output event for refresh customer detail after successfull save.
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private _fb: FormBuilder,
    private _messageService: MessageService,
    private _officeService: OfficeService,
    private _utilityService: UtilityService) { }

  /**
   * @author Hannan Desai
   * @description
   *        THis function is used to call service function that call api to save service beureau detail.
   */
  public save() {
    let updatedServiceBeureau = {
      name: this.serviceBeureauForm.controls.firmName.value,
      phoneNo: this.serviceBeureauForm.controls.phoneNo.value,
      efin: this.serviceBeureauForm.controls.efin.value,
      address: {
        street: this.serviceBeureauForm.controls.street.value,
        city: this.serviceBeureauForm.controls.city.value,
        state: this.serviceBeureauForm.controls.state.value,
        zipCode: this.serviceBeureauForm.controls.zipCode.value,
      }
    }

    this._officeService.saveCustomerDetail({ serviceBureau: updatedServiceBeureau }).then((result) => {
      this._messageService.showMessage("Service Bureau detail updated successfully.", "success");
      this.close.emit(true);
    })
  }

  // to hide editing section for service beureau
  public cancel() {
    this.close.emit(false);
  }

  // set city and state based on zip code
  public setDataBasedOnZipCode() {
    this._utilityService.getCityState(this.serviceBeureauForm.controls.zipCode.value).then((zipData: any) => {
      if (zipData) {
        this.serviceBeureauForm.controls.city.setValue(zipData.city);
        this.serviceBeureauForm.controls.state.setValue(zipData.state);
      };
    });
  }

  /**
   * @author Hannan Desai
   * @description
   *        USed to define form controls
   */
  private defineForm() {
    this.serviceBeureauForm = this._fb.group({
      firmName: ["", [Validators.required, Validators.pattern("(([A-Za-z0-9-\#\(\)]|&|') ?)*([A-Za-z0-9-\#\(\)]|&|')")]],
      street: ["", Validators.pattern("[A-Za-z0-9]( ?[A-Za-z0-9\-/])*")],
      city: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      state: ["", Validators.pattern("([A-Za-z] ?)*[A-Za-z]")],
      zipCode: "",
      phoneNo: ["", Validators.required],
      efin: ""
    })
  }

  // to set values into form control
  private setValuesIntoForm() {
    this.serviceBeureauForm.setValue({
      firmName: this.serviceBeureauDetail.name ? this.serviceBeureauDetail.name : "",
      street: this.serviceBeureauDetail.address && this.serviceBeureauDetail.address.street ? this.serviceBeureauDetail.address.street : "",
      city: this.serviceBeureauDetail.address && this.serviceBeureauDetail.address.city ? this.serviceBeureauDetail.address.city : "",
      state: this.serviceBeureauDetail.address && this.serviceBeureauDetail.address.state ? this.serviceBeureauDetail.address.state : "",
      zipCode: this.serviceBeureauDetail.address && this.serviceBeureauDetail.address.zipCode ? this.serviceBeureauDetail.address.zipCode : "",
      phoneNo: this.serviceBeureauDetail.phoneNo ? this.serviceBeureauDetail.phoneNo : "",
      efin: this.serviceBeureauDetail.efin ? this.serviceBeureauDetail.efin : "",
    })
  }

  ngOnChanges() {
    if (!this.serviceBeureauForm) {
      this.defineForm();
    }
    this.setValuesIntoForm();
  }

  ngOnInit() {
  }

}
