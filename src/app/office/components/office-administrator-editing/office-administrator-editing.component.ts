// External Imports
import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// Internal Imports
import { OfficeService } from '@app/office/office.service';
import { MessageService } from '@app/shared/services';

@Component({
  selector: 'app-office-administrator-editing',
  templateUrl: './office-administrator-editing.component.html',
  styleUrls: ['./office-administrator-editing.component.scss']
})
export class OfficeAdministratorEditingComponent implements OnInit, OnChanges {

  public administratorForm: FormGroup;
  @Input() adminDetail: any;
  // output event for refresh customer detail after successfull save.
  @Output() close = new EventEmitter<boolean>();
  constructor(
    private _fb: FormBuilder,
    private _officeService: OfficeService,
    private _messageService: MessageService) { }

  /**
   * @author Hannan Desai
   * @description
   *        Used to call service function that saves adminstrator detail.
   */
  public save() {
    let updatedAdminDetail = {
      firstName: this.administratorForm.controls.firstName.value,
      lastName: this.administratorForm.controls.lastName.value,
      email: this.administratorForm.controls.email.value,
      phoneNo: this.administratorForm.controls.phoneNo.value,
    }

    this._officeService.saveCustomerDetail({ administartor: updatedAdminDetail }).then((result) => {
      this._messageService.showMessage("Administrator detail updated successfully.", "success");
      this.close.emit(true);
    })
  }

  // hide editing screen
  public cancel() {
    this.close.emit(false);
  }

  // to define from controls
  private defineForm() {
    this.administratorForm = this._fb.group({
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: ""
    })
  }

  // to set values into form controls
  private setValueIntoForm() {
    this.administratorForm.setValue({
      firstName: this.adminDetail.firstName ? this.adminDetail.firstName : "",
      lastName: this.adminDetail.lastName ? this.adminDetail.lastName : "",
      email: this.adminDetail.email ? this.adminDetail.email : "",
      phoneNo: this.adminDetail.phoneNo ? this.adminDetail.phoneNo : ""
    })
  }

  ngOnChanges() {
    if (!this.administratorForm) {
      this.defineForm();
    }
    this.setValueIntoForm();
  }

  ngOnInit() {
  }

}
