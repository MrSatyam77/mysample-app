/** External Import */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import * as  moment from "moment";
import { NgSelectComponent } from '@ng-select/ng-select';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

/** Internal Import */
import { MessageService } from "@app/shared/services/message.service";
// import { AppointmentService } from "./appointment.service";
import { BasketService } from '@app/shared/services';
import { IAppointments } from '@app/calendar/calendar';
import { UserService } from "@app/shared/services/user.service";
import { CalendarService } from '@app/calendar/calendar.service';
// import { CommonAPIService } from "@app/shared/services/common-api.service";
// import { diffMinutes } from '@fullcalendar/core/datelib/marker';
// import { ColorPickerService } from 'ngx-color-picker';


@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  // providers: [AppointmentService]
})

export class AppointmentComponent implements OnInit {

  @ViewChild("participantSelect", { static: false }) participantSelect: NgSelectComponent;

  /** Public variable */

  public today = this.calendar.getToday();
  public limitList: number = 5;
  public appointmentRegisterForm: FormGroup;
  public sendList: any;
  public recentReturns: any;
  public remindMe: any;
  public meridian = true;
  public participants; // participants list
  public selected; // select all unselect all
  public Id: string;
  // public maskType: string = "SSN";
  // public returnno: string = '';
  // public taxMaskId: string = "000-00-0000"
  // public showMask: boolean = true;

  /** Private variable */

  private appointment: IAppointments;
  private color: string = "#34495e";//background color
  private privateColor: string = "#0FA5B0";
  private textColor: string = "#fff";
  private startTime; //start time
  private endTime;  // end time

  constructor(private fb: FormBuilder,
    private router: Router,
    private _userService: UserService,
    // private _commonAPIService: CommonAPIService,
    private _messageService: MessageService,
    //  private _appointmentService: AppointmentService,
    private calendarService: CalendarService,
    private basketService: BasketService,
    private activatedRoute: ActivatedRoute,
    private calendar: NgbCalendar
  ) { }

  // userCan(privilege) {
  //   return this._userService.can(privilege);
  // };
  /**
   * @author Satyam Jasoliya
   * @date 15th Oct 2019
   * @description create form control
   * @memberof appointmentService
   */

  /** Create form control */
  private appointmentFieldDataFun() {
    this.appointmentRegisterForm = this.fb.group({
      subject: this.fb.control('', Validators.required),
      description: this.fb.control(''),
      // firstName: this.fb.control(''),
      // lastName: this.fb.control(''),
      // cellPhone: this.fb.control(''),
      // emailAddress: this.fb.control('', [Validators.pattern(/^[A-Z0-9a-z\._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,15}$/)]),
      // street: this.fb.control(''),
      // zipCode: this.fb.control(''),
      // city: this.fb.control(''),
      // state: this.fb.control(''),
      startTime: this.fb.control(this.startTime),
      endTime: this.fb.control(this.endTime),
      startDate: this.fb.control(''),
      endDate: this.fb.control(''),
      // maskType: this.fb.control(this.maskType),
      // returnno: this.fb.control(this.returnno, { updateOn: "blur" }),
      // sendList: new FormArray(this.sendList.map(control => new FormControl(false))),
      remindMe: this.fb.control(0),
      userList: this.fb.control(''),
    });
  }

  // onCheckboxChange(isChecked: boolean, dep: any) {
  //   const formArray = <FormArray>this.appointmentRegisterForm.get('sendList');
  //   if (isChecked) {
  //     formArray.push(new FormControl(dep));
  //   } else {
  //     const index = formArray.controls.findIndex(x => x.value === dep)
  //     formArray.removeAt(index);
  //   }
  // }

  // setMaskId() {
  //   if (this.appointmentRegisterForm.controls.maskType.value == "SSN") {
  //     this.taxMaskId = "000-00-0000";
  //     this.showMask = true;
  //   } else if (this.appointmentRegisterForm.controls.maskType.value == "EIN") {
  //     this.taxMaskId = "00-0000000"
  //     this.showMask = true;
  //   } else {
  //     this.taxMaskId = undefined;
  //     this.showMask = false;
  //   }
  //   this.returnno = undefined;
  // }

  /**
   * @author Satyam Jasoliya
   * @date 15th Oct 2019
   * @description save data
   * @memberof appointmentService
   */
  public save() {
    const myEndDate = new Date(this.appointmentRegisterForm.get('endDate').value.year, this.appointmentRegisterForm.get('endDate').value.month - 1, this.appointmentRegisterForm.get('endDate').value.day);
    const myEndTime = this.appointmentRegisterForm.get('endTime').value;
    const endDate = (moment(myEndDate).format().split('T')[0]);
    const endTime = (moment(myEndTime).format().split('T')[1]);
    const mixEndDateTime = endDate.concat("T" + endTime);

    const myStartDate = new Date(this.appointmentRegisterForm.get('startDate').value.year, this.appointmentRegisterForm.get('startDate').value.month - 1, this.appointmentRegisterForm.get('startDate').value.day);
    const myStartTime = this.appointmentRegisterForm.get('startTime').value;
    const startDate = (moment(myStartDate).format().split('T')[0]);
    const startTime = (moment(myStartTime).format().split('T')[1]);
    const mixStartDateTime = startDate.concat("T" + startTime);

    let isPrivate = (this.appointmentRegisterForm.get('userList').value && this.appointmentRegisterForm.get('userList').value.length > 0) ? true : false;
    let participants = this.appointmentRegisterForm.get('userList').value;
    let alertTime = moment(this.appointmentRegisterForm.get('startDate').value);

    // const selectedPreferences = this.appointmentRegisterForm.value.sendList
    //   .map((checked, index) => checked ? this.sendList[index].id : null)
    //   .filter(value => value !== null);

    this.appointment = {
      color: isPrivate ? this.privateColor : this.color,
      textColor: this.textColor,
      subject: this.appointmentRegisterForm.get('subject').value,
      description: this.appointmentRegisterForm.get('description').value,
      start: moment.utc(mixStartDateTime).format(),
      //  end: moment.utc(this.appointmentRegisterForm.get('endDate').value).format(),
      end: moment.utc(mixEndDateTime).format(),
      participants: participants ? participants : [""],
      isPrivate: isPrivate,
      remindMeBefore: this.appointmentRegisterForm.get('remindMe').value,
      // alertTime = starttime-remind me before 
      alertTime: moment.utc(mixStartDateTime).subtract(this.appointmentRegisterForm.get('remindMe').value, "minutes").format(),
      // snoozeCount: 0,//need to discuss

      //new filed
      // returnno: this.appointmentRegisterForm.get('returnno').value,
      // firstName: this.appointmentRegisterForm.get('firstName').value,
      // lastName: this.appointmentRegisterForm.get('lastName').value,
      // cellPhone: this.appointmentRegisterForm.get('cellPhone').value,
      // emailAddress: this.appointmentRegisterForm.get('emailAddress').value,
      // street: this.appointmentRegisterForm.get('street').value,
      // zipCode: this.appointmentRegisterForm.get('zipCode').value,
      // city: this.appointmentRegisterForm.get('city').value,
      // state: this.appointmentRegisterForm.get('state').value,
      // sendList: this.appointmentRegisterForm.get('sendList').value
    }

    if (this.appointmentRegisterForm.valid && this.Id) {
      // update data api called
      this.appointment.id = this.Id;
      this.calendarService.save(this.appointment).then((response) => {
        if (response) {
          this._messageService.showMessage("Updated successfully.", "success");
          this.router.navigate(["calendar"]);
        }
      });
    }
    else {
      // insert data api called
      this.calendarService.create(this.appointment).then((response) => {
        if (response) {
          this._messageService.showMessage("Created successfully.", "success");
          this.router.navigate(["calendar"]);
        }
      });
    }

    // if (this.appointmentRegisterForm.valid){

    //   const apiParams = JSON.parse(JSON.stringify(this.appointmentRegisterForm.value));
    //   apiParams.color = isPrivate ? this.privateColor : this.color;
    //   apiParams.textColor=this.textColor;
    //   apiParams.start=moment.utc(this.appointmentRegisterForm.get('startDate').value).format();
    //   apiParams.end=moment.utc(this.appointmentRegisterForm.get('endDate').value).format();
    //   apiParams.participants= participants;
    //   apiParams.isPrivate= isPrivate;
    //   apiParams.alertTime=moment.utc(alertTime.subtract(this.appointmentRegisterForm.get('remindMe').value, "minutes")).format();
    //   apiParams.snoozeCount = 0;
    //   if(apiParams)
    //   {
    //     this._appointmentService.create(apiParams).then((result:any)=>{
    //       this.result=result;
    //       console.log(this.result);
    //     });  
    //   }
    //   else
    //   {
    //     console.log("error");
    //   }
    // }

    // console.log(this.appointment);
  }

  //Cancel Event
  public cancel() {
    this.router.navigate(["calendar"])
  }

  /**
   * @author Satyam Jasoliya
   * @date 15th Oct 2019
   * @description delete data
   * @memberof appointmentService
   */
  //Delete event
  public deleteAppointment() {
    if (this.Id) {
      var ids = [this.Id];
    }
    if (ids) {
      this.calendarService.remove({ 'appointmentIds': ids }).then((response) => {
        this._messageService.showMessage("Deleted successfully.", "success");
        this.router.navigate(["calendar"])
      });
    }
  }

  /** Handle change event */
  // formInputChange() {
  //   this.appointmentRegisterForm.get("returnno").valueChanges.subscribe((data: string) => {
  //     this.getContactInformation();
  //   });
  // }

  // getrecentReturns(){
  //   this._appointmentService.getRecentReturns().subscribe((response)=>{
  //     this.result=response.data;
  //     console.log(this.result);
  //      for (const info in response.data) {
  //        console.log(info);
  //      }
  //   });
  // }

  /**
  * @author Satyam Jasoliya
  * @date 15th Oct 2019
  * @description get return list
  * @memberof appointmentService
  */
  private getCommonAllList() {
    if (this._userService.can('CAN_LIST_USER')) {
      this.calendarService.getUserList().subscribe((data: any) => {
        this.participants = data.data.filter((user) => { return user.key !== this._userService.getValue("emailHash") });
        this.fillData();
      });
    } else {
      this.fillData();
    }
  }

  /**
   * @author Satyam Jasoliya
   * @date 15th Oct 2019
   * @description fill data
   * @memberof appointmentService
   */
  private fillData() {
    if (this.Id) {
      this.calendarService.Open(this.Id).then((data) => {
        this.fillAppointmentDetails(data as IAppointments);
      });
    }
  }

  /**
  * @author Satyam Jasoliya
  * @date 15th Oct 2019
  * @description get user name
  * @memberof appointmentService
  */
  public getUserName(key) {
    let user = this.participants.find((user) => { return user.key === key });
    if (user) {
      return user.firstName + " " + user.lastName;
    } else {
      return "";
    }
  }
  /**
   * @author Hitesh Soni
   * @date 15th Oct 2019
   * @description set default form value
   * @memberof appointmentService
   */
  /** Set default data */
  private setDefaultData() {
    let startDate = this.basketService.popItem("APPOINTMENT_DATE");
    let endDate;
    if (!startDate) {
      startDate = moment(this.calendarService.setTimeInterval(new Date()));
    }
    else {
      startDate = moment(startDate);
    }
    endDate = moment(startDate).add(30, "minutes");
    //Set start and end date with time
    this.appointmentRegisterForm.controls["startDate"].setValue({
      year: startDate.years(),
      month: startDate.month() + 1,
      day: startDate.date()
    });
    this.appointmentRegisterForm.controls["startTime"].setValue({
      hour: startDate.hours(),
      minute: startDate.minutes()
    });
    this.appointmentRegisterForm.controls["endDate"].setValue({
      year: endDate.years(),
      month: endDate.month() + 1,
      day: endDate.date()
    });
    this.appointmentRegisterForm.controls["endTime"].setValue({
      hour: endDate.hours(),
      minute: endDate.minutes()
    });
  }

  /**
   * @author Satyam Jasoliya
   * @date 15th Oct 2019
   * @description set today/end date & clear date
   * @memberof appointmentService
   */
  public setTodayDate() {
    this.appointmentRegisterForm.controls.startDate.setValue(this.today);
  }
  public setTodayEndDate() {
    this.appointmentRegisterForm.controls.endDate.setValue(this.today);
  }
  public setClear() {
    this.appointmentRegisterForm.controls.startDate.setValue('');
  }
  public setEndClear() {
    this.appointmentRegisterForm.controls.endDate.setValue('');
  }


  /** Set contact information */
  // private getContactInformation() {
  //   let contactIndex;
  //   if (this.appointmentRegisterForm.controls.maskType.value == "SSN") {
  //     contactIndex = this.recentReturns.findIndex(x => x.client.ssn && x.client.ssn == this.appointmentRegisterForm.get("returnno").value);
  //   } else if (this.appointmentRegisterForm.controls.maskType.value == "EIN") {
  //     contactIndex = this.recentReturns.findIndex(x => x.client.ein && x.client.ein == this.appointmentRegisterForm.get("returnno").value);
  //   }
  //   if (contactIndex != -1) {
  //     let contact = this.recentReturns[contactIndex];
  //     this.appointmentRegisterForm.controls.firstName.setValue(contact.client.firstName ? contact.client.firstName : '');
  //     this.appointmentRegisterForm.controls.lastName.setValue(contact.client.lastName ? contact.client.lastName : '');
  //     this.appointmentRegisterForm.controls.cellPhone.setValue(contact.client.cellPhone ? contact.client.cellPhone : '');
  //     this.appointmentRegisterForm.controls.emailAddress.setValue(contact.client.emailAddress ? contact.client.emailAddress : '');
  //     this.appointmentRegisterForm.controls.street.setValue(contact.client.usAddress.street ? contact.client.usAddress.street : '');
  //     this.appointmentRegisterForm.controls.zipCode.setValue(contact.client.usAddress.zipCode ? contact.client.usAddress.zipCode : '');
  //     this.appointmentRegisterForm.controls.city.setValue(contact.client.usAddress.city ? contact.client.usAddress.city : '');
  //     this.appointmentRegisterForm.controls.state.setValue(contact.client.usAddress.state ? contact.client.usAddress.state : '');
  //   }
  // }

  /**
 * @author Hitesh Soni
 * @date 15th Oct 2019
 * @description fill data
 * @memberof appointmentService
 */
  /** Fill details */
  private fillAppointmentDetails(data: IAppointments) {
    let participantsList = [];
    this.participants.forEach(element => {
      let pIndex = data.participants.findIndex(x => x == element.key);
      if (pIndex != - 1) {
        participantsList.push(element.key);
      }
    });
    this.appointmentRegisterForm.patchValue({
      subject: data.subject,
      description: data.description,
      // firstName: data.firstName,
      // lastName: data.lastName,
      // cellPhone: data.cellPhone,
      // emailAddress: data.emailAddress,
      // street: data.street,
      // zipCode: data.zipCode,
      // city: data.city,
      // state: data.state,
      startTime: { hour: moment(data.start).hours(), minute: moment(data.start).minutes() },
      endTime: { hour: moment(data.end).hours(), minute: moment(data.end).minutes() },
      startDate: { year: moment(data.start).year(), month: moment(data.start).month() + 1, day: moment(data.start).date() },
      endDate: { year: moment(data.end).year(), month: moment(data.end).month() + 1, day: moment(data.end).date() },
      remindMe: data.remindMeBefore,
      userList: participantsList
    });
    // this.appointmentRegisterForm = this.fb.group({
    //   subject: this.fb.control('', Validators.required),
    //   description: this.fb.control('', Validators.required),
    //   firstName: this.fb.control(''),
    //   lastName: this.fb.control(''),
    //   cellPhone: this.fb.control(''),
    //   emailAddress: this.fb.control('', [Validators.pattern(/^[A-Z0-9a-z\._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,15}$/)]),
    //   street: this.fb.control(''),
    //   zipCode: this.fb.control(''),
    //   city: this.fb.control(''),
    //   state: this.fb.control(''),
    //   startTime: this.fb.control(this.startTime),
    //   endTime: this.fb.control(this.endTime),
    //   startDate: this.fb.control(''),
    //   endDate: this.fb.control(''),
    //   maskType: this.fb.control(this.maskType),
    //   returnno: this.fb.control(this.returnno, { updateOn: "blur" }),
    //   sendList: new FormArray(this.sendList.map(control => new FormControl(false))),
    //   remindMe: this.fb.control(''),
    //   userList: this.fb.control(null),
    // });
  }

  /**
 * @author Satyam Jasoliya
 * @date 15th Oct 2019
 * @description dropdown select all button
 * @memberof appointmentService
 */
  public selectAll() {
    this.selected = this.participants.map(item => item.key);
    this.appointmentRegisterForm.get('userList').patchValue(this.selected);
  }

  /**
   * @author Satyam Jasoliya
   * @date 15th Oct 2019
   * @description dropdown unselect all button
   * @memberof appointmentService
   */

  public unselectAll() {
    this.selected = this.appointmentRegisterForm.get('userList').patchValue([]);
    this.selected = [];
  }

  ngOnInit() {
    this.Id = this.activatedRoute.snapshot.paramMap.get("id");
    this.sendList = this.calendarService.getAppointmentSendList();
    this.remindMe = this.calendarService.getRemindMeList();
    this.appointmentFieldDataFun();
    this.getCommonAllList();
    if (!this.Id) {
      this.setDefaultData();
    }
    // this.formInputChange();
  }
}
