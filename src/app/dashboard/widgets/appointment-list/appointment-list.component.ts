// External imports
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as moment from 'moment';
// Internal imports
import { UserService } from '@app/shared/services/user.service';
import { CommunicationService } from '@app/shared/services/communication.service';
import { AppointmentListService } from '@app/dashboard/widgets/appointment-list/appointment-list.service';
import { ICalenderListByDate } from '@app/dashboard/dashboard.model';
import { BasketService } from '@app/shared/services/basket.service';
@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit, OnDestroy {
  @Input() rowColor: any;
  private refreshTimer: Subscription; // To callApi after Some Time Of delay
  public permission: any = {}; // For Check permission of user on base on privilege
  public appointmentList: ICalenderListByDate; // To get response from api
  public refreshStart = false; // To start refresh
  public isOnline = false; // user isonline or not
  private networkStatusSubscription: any; // To get NetWorkSubscription
  constructor(private basketService: BasketService, private appointmentListService: AppointmentListService, private communicationService: CommunicationService, private userService: UserService, private router: Router) { }

  /**
   * @author Om kanada
   * @description
   * To refresh List after some interval of Time.
   */
  private refreshList(): void {
    this.refreshTimer = interval(60300).subscribe(() => {
      let currentDateEnd: any = new Date();
      currentDateEnd.setHours(23);
      currentDateEnd.setMinutes(59);
      currentDateEnd = moment.utc(currentDateEnd).format();
      const obj = { currentDate: moment.utc(new Date()).format(), currentDateEnd: currentDateEnd };
      this.appointmentListService.getAppointmentList(obj).then((response: ICalenderListByDate) => {
        this.appointmentList = response;
      }, (error) => {
        // If we receive token incorrect or unauthorized , do not continue this api until next initialization
        if ((error) && (error.data) && (error.data.code) && (error.data.code === 4004 || error.data.code === 4005)) {
          this.cancelInterval();
        }
      });
    });
  }

  /**
   * @author Om kanada
   * @description
   * To Get AppointmentList response From Api.
   */
  public callListAPI() {
    return new Promise((resolve, reject) => {
      let currentDateEnd: any = new Date();
      currentDateEnd.setHours(23);
      currentDateEnd.setMinutes(59);

      currentDateEnd = moment.utc(currentDateEnd).format();

      const obj = { currentDate: moment.utc(new Date()).format(), currentDateEnd: currentDateEnd };

      this.appointmentListService.getAppointmentList(obj).then((response: ICalenderListByDate) => {
        this.appointmentList = response;
        resolve(response);
        this.refreshStart = false;
        /*Re register background refresh of list if not*/
        if ((this.refreshTimer)) {
          this.refreshList();
        }
      }, (error) => {
        reject(error);
        this.refreshStart = false;
        /*Re register background refresh of list if not*/
        if (this.refreshTimer) {
          this.refreshList();
        }
      });
    });
  }
  /**
   * @author Om kanada
   * @description
   * This method is responsible for calling List api and register/unregister interval for auto refresh.
   */
  public manualRefreshList(delay: number): void {
    if (this.userService.can('CAN_LIST_CALENDAR')) {
      /*Cancel iterate of auto refresh if already registered*/
      if (this.refreshTimer) {
        this.cancelInterval();
        this.refreshTimer = undefined;
      }// Check if delay is passed
      if (delay) {
        setTimeout(() => {
          this.callListAPI();
        }, delay);
      } else {
        // Call API function
        this.callListAPI();
      }
    }
  }

  /**
   * @author Om kanada
   * @description
   * cancel interval.
   */
  private cancelInterval(): void {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
  }
  /**
   * @author Om kanada
   * @description
   * open appointment scheduler.
   */
  public openCalender(): void {
    this.router.navigate(['calendar']);
  }
  /**
   * @author Om kanada
   * @description
   * open calendar in day mode. Selected date will be tomorrow. .
   */
  public viewTomorrow(): void {
    this.basketService.pushItem('calDateMode', 'tomorrow');
    this.router.navigate(['calendar']);
  }
  /**
   * @author Om kanada
   * @description
   * We need to set this because of setting start-end date in date picker.
   */
  public newAppointment(): void {
    this.router.navigate(['calendar', 'appointment', 'edit']);
  }

  /**
   * @author Om kanada
   * @description
   * on edit .
   */
  public edit(id: number): void {
    this.router.navigate(['calendar', 'appointment', 'edit', id]);
  }
  /**
   * @author Om kanada
   * @description
   * cancel timer in case if is not cancel before.
   */
  ngOnDestroy(): void {
    this.cancelInterval();
  }
  /**
   * @author Om kanada
   * @description
   * call CommunicationService For Netwwork Status OnInit.
   */
  callCommunicationServiceForNetwworkStatusOnInit() {
    this.communicationService.transmitter.subscribe((data: any) => {
      if (data.topic === 'networkStatus') {
        this.isOnline = data.isOnline;
      }
    });
  }

  ngOnInit(): void {
    this.permission = {
      canOpenCalender: this.userService.can('CAN_OPEN_CALENDAR'),
      canListCalender: this.userService.can('CAN_LIST_CALENDAR'),
      canCreateCalender: this.userService.can('CAN_CREATE_CALENDAR'),

    };
    //  Initialize network status flag and subscribe channel to get update
    // this.isOnline = this.networkHealthService.getNetworkStatus();
    this.callCommunicationServiceForNetwworkStatusOnInit();
    this.manualRefreshList(70);
  }

}
