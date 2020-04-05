import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '@app/shared/services';
import { OfficeService } from '../office.service';


@Component({
  selector: 'app-office-change',
  templateUrl: './office-change.component.html',
  styleUrls: ['./office-change.component.scss']
})
export class OfficeChangeComponent implements OnInit {

  public availableLocationList: any = [];
  public location: any = {};
  private userDetails: any;
  private routeSubscription: Subscription;
  public mode: any = '';

  constructor(private router: Router, private userService: UserService, private officeService: OfficeService, private _activatedRoute: ActivatedRoute) { }

  /**
   * @author Ravi Shah
   * Change Default Locations & User Location
   * @memberof OfficeChangeComponent
   */
  public changeLocation = function () {
    //check is default location is selected and its not same as previous 
    if (this.location.defaultLocationKey !== undefined && this.location.defaultLocationKey !== null && this.userDetails.settings !== undefined && this.location.defaultLocationKey !== this.userDetails.settings.defaultLocationId) {
      this.userService.changeDefaultLocation(this.location.defaultLocationKey);
    } else if (this.location.defaultLocationKey == null && this.userDetails.settings && this.userDetails.settings.defaultLocationId) {
      this.userService.changeDefaultLocation("");
    }
    this.userService.changeUserLocation(this.location.currentLocationKey);
  };

  /**
   * @author Ravi Shah
   * Initialize the Change Office
   * @private
   * @memberof OfficeChangeComponent
   */
  private initializeChangeOffice() {
    this.userDetails = this.userService.getUserDetails();
    if (this.userDetails && this.userDetails.locations) {
      this.officeService.getAssignedLocationList().then((response: any) => {
        if (response) {
          this.availableLocationList = response.sort((item1, item2) => {
            return item1.name < item2.name ? -1 : 0;
          });
          this.availableLocationList.forEach(element => {
            element.locationId = element.key;
          });
          if (this.userDetails.settings && this.userDetails.settings.defaultLocationId) {
            this.location.defaultLocationKey = this.userDetails.settings.defaultLocationId;
          }
          //if user have currentLocation  then show currentLocation as selected
          if (this.userDetails.currentLocationId) {
            this.location.currentLocationKey = this.userDetails.currentLocationId;
          }
        }
      })
    }
  }

  /**
   * @author Ravi Shah
   * Navigate to home
   * @memberof OfficeChangeComponent
   */
  public gotoHome() {
    this.router.navigate(['home']);
  }

  /**
   * @author Ravi Shah
   * Call on Initialization of the Component
   * @memberof OfficeChangeComponent
   */
  ngOnInit() {
    this.initializeChangeOffice();
    this.routeSubscription = this._activatedRoute.paramMap.subscribe((params: any) => {
      if (params.params.mode === 'change') {
        this.mode = 'change';
      } else {
        this.mode = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
