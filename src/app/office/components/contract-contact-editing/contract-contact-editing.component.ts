import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OfficeService } from '@app/office/office.service';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-contract-contact-editing',
  templateUrl: './contract-contact-editing.component.html',
  styleUrls: ['./contract-contact-editing.component.scss']
})
export class ContractContactEditingComponent implements OnInit, OnChanges {
  
  public contractContactForm: FormGroup;
  
  @Input() contractContactDetail: any;

  // output event for refresh customer detail after successfull save.
  @Output() close = new EventEmitter<boolean>();

  constructor(
    private _fb: FormBuilder,
    private _officeService: OfficeService,
    private _messageService: MessageService) { }

  /**
   * @author Hannan Desai
   * @description
   *        This function is sused to call service function to save contract contact detail.
   */
  save() {
    let updatedContractContact = {
      firstName: this.contractContactForm.controls.firstName.value,
      lastName: this.contractContactForm.controls.lastName.value,
      email: this.contractContactForm.controls.email.value,
      phoneNo: this.contractContactForm.controls.phoneNo.value,
    }

    this._officeService.saveCustomerDetail({ contractContact: updatedContractContact }).then((result) => {
      this._messageService.showMessage("Contract detail updated successfully.", "success");
      this.close.emit(true);
    })
  }

  // editing cancel event emit
  cancel() {
    this.close.emit(false);
  }

  // to define form controls
  defineForm() {
    this.contractContactForm = this._fb.group({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: ""
    })
  }

  // to set values into form controls.
  setValueIntoForm() {
    this.contractContactForm.setValue({
      firstName: this.contractContactDetail.firstName ? this.contractContactDetail.firstName : "",
      lastName: this.contractContactDetail.lastName ? this.contractContactDetail.lastName : "",
      email: this.contractContactDetail.email ? this.contractContactDetail.email : "",
      phoneNo: this.contractContactDetail.phoneNo ? this.contractContactDetail.phoneNo : ""
    })
  }

  ngOnChanges() {
    if (!this.contractContactForm) {
      this.defineForm();
    }
    this.setValueIntoForm();
  }

  ngOnInit() {
  }

}
