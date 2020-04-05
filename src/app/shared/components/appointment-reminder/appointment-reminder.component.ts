// External imports
import { Component, Injector, OnInit, Input } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';
// Internal imports
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarService } from '@app/calendar/calendar.service';
@Component({
  selector: 'app-appointment-reminder',
  templateUrl: './appointment-reminder.component.html',
  styleUrls: ['./appointment-reminder.component.scss']
})
export class AppointmentReminderComponent implements OnInit {
  @Input() data: any;

  //private varible
  private snoozeAppointmentList = [];

  //public variable
  public appointmentDetail;
  public appointment: any;
  public selectedSnoozeTime;

  constructor(
    private _ngbActiveModal: NgbActiveModal,
    private _injector: Injector,
    private messageService: MessageService) { }

  /**
 * @author Satyam Jasoliya
 * @date 22th Oct 2019
 * @description remove appointment
 * @memberof appointmentReminder
 */
  private removeAppointment() {
    this.appointmentDetail.appointments = this.appointmentDetail.appointments.filter((obj) => { return obj.id !== this.appointment.id });
    if (this.appointmentDetail.appointments.length > 0) {
      this.appointment = this.appointmentDetail.appointments[0];
    }
  }


  /**
 * @author Satyam Jasoliya
 * @date 22th Oct 2019
 * @description snooze appointment
 * @memberof appointmentReminder
 */
  public snoozeAppointment() {
    // let selectedSnoozeTime;
    const calendarService = this._injector.get(CalendarService);
    this.appointment.alertTime.setMinutes(new Date().getMinutes() + this.selectedSnoozeTime);
    // this.appointment.snoozeCount = (this.appointment.snoozeCount) ? 1 : this.appointment.snoozeCount++;
    this.appointment.snoozeCount = (!this.appointment.snoozeCount) ? 1 : ++this.appointment.snoozeCount;
    // this.appointment.snoozeCount =  this.appointment.snoozeCount++;
    calendarService.saveEvent(this.appointment).then((response) => {
      this.snoozeAppointmentList.push(this.appointment);
      this.removeAppointment();
      this.messageService.showMessage('Appointment has been snooze.', 'success', 'REMINDER_UPDATESNOOZE_SUCCESS');
      //after the action is done we check the appointment list if it is empty then we simply close the dialog
      if (this.appointmentDetail.appointments.length === 0) {
        this._ngbActiveModal.close({ snoozeAppointmentList: this.snoozeAppointmentList });
      } (error) => {
        console.log(error);
        this.messageService.showMessage('Something went wrong while snoozing appointment.', 'error', 'REMINDER_UPDATESNOOZE_ERROR');
      }
    });
  }


  /**
   * @author Satyam Jasoliya
   * @date 22th Oct 2019
   * @description dismiss appointment
   * @memberof appointmentReminder
   */

  public dismissAppointment() {
    this.removeAppointment();
    if (this.appointmentDetail.appointments.length === 0) {
      this._ngbActiveModal.close({ snoozeAppointmentList: this.snoozeAppointmentList });
    }
  }

  /**
  * @author Satyam Jasoliya
  * @date 22th Oct 2019
  * @description dismiss all appointment
  * @memberof appointmentReminder
  */
  public dismissAll() {
    this._ngbActiveModal.close({ snoozeAppointmentList: this.snoozeAppointmentList });
  }

  /**
     * @author Satyam Jasoliya
     * @date 22th Oct 2019
     * @description selected appointment
     * @memberof appointmentSe
     */
  public selectAppointment(appointmentDetail) {
    this.appointment = appointmentDetail;
  }

  ngOnInit() {
    this.appointmentDetail = {
      appointments: this.data.appointments,
      snoozeTimeList: [
        { displayText: '10 Minutes', value: 10 },
        { displayText: '15 Minutes', value: 15 },
        { displayText: '20 Minutes', value: 20 },
        { displayText: '25 Minutes', value: 25 }
      ]
    };
    this.appointment = this.appointmentDetail.appointments[0];
    this.selectedSnoozeTime = this.appointmentDetail.snoozeTimeList[0].value;
  }
}
