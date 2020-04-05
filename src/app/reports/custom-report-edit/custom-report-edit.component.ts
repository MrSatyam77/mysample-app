//External Imports
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

//Internal Imports
import { OfficeService } from '@app/office/office.service';
import { ReportsService } from '@app/reports/reports.service';
import { UserService, MessageService, DialogService } from '@app/shared/services';

@Component({
  selector: 'app-custom-report-edit',
  templateUrl: './custom-report-edit.component.html',
  styleUrls: ['./custom-report-edit.component.scss']
})

export class CustomReportEditComponent implements OnInit {
  // ui form variable
  public customReportForm: FormGroup;
  //hold userlist
  public userList: any = [];
  //hold field list
  public fieldList: any = [];
  //hold selected Fields
  public associatedFields: any = [];
  //hold mode value
  public mode: string;
  //hold report id
  public reportId;
  //hold flag for loading bar
  public isLoading: boolean = false;

  constructor(private _router: Router,
    private _fb: FormBuilder,
    private _officeService: OfficeService,
    private _route: ActivatedRoute,
    private _reportService: ReportsService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _dialogService: DialogService) { }

  /**
   *@author Heena Bhesaniya
   * @description Used to route to home
   */
  backToHomeScreen() {
    this._router.navigateByUrl('/home');
  }

  /**
    *@author Heena Bhesaniya
    * @description Used to route to list screen
    */
  goToList() {
    this._router.navigateByUrl('/reports/list');
  }

  // This function is used to define controls of ui form.
  private createCustomReportForm() {
    this.customReportForm = this._fb.group({
      reportName: ["", Validators.required],
      reportDescription: ["", Validators.required],
      associatedUsers: [[], Validators.required],
    })
  }

  /**
   * @author Hannan Desai
   * @description
   *        Used to call service function to get user list from api.
   */
  public getUserList() {
    const self = this;
    this._officeService.getUserListFromAPI().then((result: any) => {
      self.isLoading = false;
      if (result.userList && result.userList.length > 0) {
        let userList = [];
        //filter data
        result.userList.forEach((user) => {
          userList.push({ name: user.firstName + ' ' + user.lastName, id: user.key });
        });
        self.userList = userList;
      }
    })
  }

  /**
   * @author Heena Bhesaniya
   * @description Save Report data
   */
  saveReport() {
    //filter selected fields data
    let associatedFields = [];
    this.fieldList.forEach(element => {
      if (element.isSelected) {
        associatedFields.push(element.fieldId);
      }
    });
    //field must be selectd if not available then show notification dialog to user
    if (associatedFields && associatedFields.length > 0) {
      //create object for save
      let data = {
        reportId: this.reportId,
        reportName: this.customReportForm.controls.reportName.value,
        reportDescription: this.customReportForm.controls.reportDescription.value,
        associatedUsers: this.customReportForm.controls.associatedUsers.value,
        associatedFields: associatedFields
      }

      //save report data
      const self = this;
      if (this.mode == 'new') {//if mode is new
        //call api to add/new report data
        self._reportService.saveReportData(data).then((result: any) => {
          //show add success msg
          self._messageService.showMessage("Report Saved Data Successfully.", 'success');
          //redirect to custom report list
          self._router.navigate(['reports/list']);
        });
      } else {
        self._reportService.updateReportData(data).then((result: any) => {
          //show update success msg
          self._messageService.showMessage("Report Data Updated Successfully.", 'success');
          //redirect to custom report list
          self._router.navigate(['reports/list']);
        });
      }
    } else { // if associated field is not selected then open dialog
      //open notify dialog
      let dialog = this._dialogService.notify({ title: 'Notification', text: "Please Select At Least One Associated Fields/Columns." }, { 'keyboard': false, 'backdrop': false, 'size': 'md', 'windowClass': 'my-class' });
    }

  }

  /**
   * @author Heena Bhesaniya
   * @description get specific report data for editing 
   */
  getReportData() {
    const self = this;
    //get specific report data
    this._reportService.getReportDataById(self.reportId).then((response: any) => {
      self.isLoading = false;
      if (response) { // if data available
        self.reportId = response.reportId,
        self.associatedFields = response.associatedFields;
        //bind associated field value with lookup data if available
        if (self.associatedFields && self.associatedFields.length > 0) {
          self.associatedFields.forEach(obj => {
            self.fieldList.find((field => {
              if (field.fieldId == obj) {
                field.isSelected = true;
              }
            }))
          });
        }
        //set form value
        self.setCustomReportFormValue(response);
      }
    })
  }

  /**
  * @author Heena Bhesaniya
  * @description get field list from api
  */
  getFieldList() {
    const self = this;
    //get specific report data
    this._reportService.getFieldList().then((response: any) => {
      if (response) { // if data available
        self.fieldList = response;
        if (self.mode === "edit") {
          self.getReportData();
        } else {
          self.isLoading = false;
        }
      }
    })
  }

  /**
   * @author Heena Bhesaniya
   * @description set data in reactive forms value
   */
  setCustomReportFormValue(data) {
    //set value in form
    this.customReportForm.setValue({
      reportName: data.reportName,
      reportDescription: data.reportDescription,
      associatedUsers: data.associatedUsers
    });
  }

  ngOnInit() {
    this.isLoading = true;
    //get field list
    this.getFieldList();
    //check mode based on route parameter
    if (this._route.snapshot.params.reportId == 'new') {//assign new if value new in route params
      this.mode = 'new';
      this.reportId = 'new';
    } else {//edit if reportId is Exist
      this.mode = 'edit';
      this.reportId = this._route.snapshot.params.reportId;
    }

    //if user has rights to list user then call api to get user list
    if (this._userService.can('CAN_LIST_USER')) {
      //get user list for dropdown
      this.getUserList();
    }

    //initiliaze form contoller
    this.createCustomReportForm();
  }

}
