//External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//Internal Imports
import { APINAME } from '@app/shared/shared.constants';
import { UserService, CommonAPIService, MessageService } from '@app/shared/services';

@Component({
  selector: 'app-generate-customer-id',
  templateUrl: './generate-customer-id.component.html',
  styleUrls: ['./generate-customer-id.component.scss']
})

export class GenerateCustomerIdComponent implements OnInit {
  // holds controls of ui form
  public generateCustomerIdForm: FormGroup;
  //hold customer id
  customerId: string;
  //hold old customer id
  oldCustomerId: string;
  //is Editable flag
  isEdit:boolean = false;

  constructor(private _ngbActiveModal: NgbActiveModal,
    private _fb: FormBuilder,
    private _userService: UserService,
    private _commonAPIService: CommonAPIService,
    private _messageService: MessageService) {
  }

  /**
   * @author Heena Bhesaniya
   * @description get customer id and set if exist otherwise set blank if not exist 
   */
  ngOnInit() {
    //get customer id
    let userDetails = this._userService.getUserDetails();
    this.customerId = userDetails.locations[userDetails.masterLocationId].customerIdValue;
    if (this.customerId) {
      this.oldCustomerId = JSON.parse(JSON.stringify(this.customerId));
    }
    if (!this.generateCustomerIdForm) {
      this.initializeEditForm();
    }
    //set value in form ui controls
    this.setValuesInForm();
  }


  /**
   * @author  Heena Bhesaniya
   * @description
   *         Used to define controls of ui form.
   */
  private initializeEditForm() {
    this.generateCustomerIdForm = this._fb.group({
      customerId: ["", Validators.required]
    })
  }

  /**
   * @author Heena Bhesaniya
   * @description
   *          This function is used to set existing customer id detail into form controls.
   */
  private setValuesInForm() {
    this.generateCustomerIdForm.setValue({
      customerId: this.customerId ? this.customerId : ""
    })
  }

  /**
   * @author Heena Bhesaniya
   * @description call api to check whether this number is exist or not
   */
  saveCustomerId() {
    //get new customer id
    let newCustomerId = this.generateCustomerIdForm.controls.customerId.value;
    const self = this;
    //call api to check is customer id is already exist
    self._commonAPIService.getPromiseResponse({ apiName: APINAME.CHECK_CUSTOMERID_DOC_EXISTS, parameterObject: { cId: newCustomerId }, methodType: "post" }).then((response) => {
      //if exist then show error
      if (response.data == true) {
        self._messageService.showMessage("Customer Id already exists, Please Regenetare again.", "error");
      } else { // otherwise update/add customer is
        self._commonAPIService.getPromiseResponse({ apiName: APINAME.SAVE_CUSTOMER_ID, parameterObject: { oldCId: self.customerId, newCId: newCustomerId }, methodType: "post" }).then((response) => {
          if (response.data == true) {
            //show message
            self._messageService.showMessage("Generated successfully.", "success");
            //get user details
            let userDetails = self._userService.getUserDetails();
            //set new customer id
            userDetails.locations[userDetails.masterLocationId].customerIdValue = newCustomerId;
            //update data in user service
            self._userService.updateUserDetails(userDetails);
            //close dialog  
            self.close();
          }
        });
      }
    });
  }

  /**
   * @author Heena Bhesaniya
   * @description close dilaog  
   */
  close() {
    this._ngbActiveModal.close();
  }
}
