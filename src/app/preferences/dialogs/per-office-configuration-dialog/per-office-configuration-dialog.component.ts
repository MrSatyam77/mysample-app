import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '@app/shared/services';

@Component({
  selector: 'app-per-office-configuration-dialog',
  templateUrl: './per-office-configuration-dialog.component.html',
  styleUrls: ['./per-office-configuration-dialog.component.scss']
})
export class PerOfficeConfigurationDialogComponent implements OnInit {

  public content: any; // For store Content
  public data: any; // To get data From dialogService
  officeList: Array<any> = [];


  constructor(private activeModal: NgbActiveModal, private userService: UserService, private router: Router) { }

  /**
   * @author Sheo Ouseph
   * @description This function is used to close the dialog.
   */
  close() {
    this.activeModal.close(false);
  }

  /**
   * Routing to the Page
   * @author Ravi Shah
   * @param {*} link
   * @param {*} rightModel
   * @param {*} locationId
   * @memberof PerOfficeConfigurationDialogComponent
   */
  routeToPage(link, rightModel, locationId) {
    this.userService.changeUserLocation(locationId);
    this.router.navigateByUrl(`${link}/${rightModel}/${locationId}`);
    this.activeModal.close();
  }

  /**
   * Pass Data on the Save click
   * @author Ravi Shah
   * @memberof PerOfficeConfigurationDialogComponent
   */
  saveData() {
    this.activeModal.close(this.officeList);
  }

  ngOnInit() {
    this.content = this.data; // To load contentData on init
    this.officeList = this.content.officeList;
  }

}
