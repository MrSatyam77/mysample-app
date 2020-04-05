import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { userDetail } from '@app/office/office';

@Component({
  selector: 'app-office-administrator-detail',
  templateUrl: './office-administrator-detail.component.html',
  styleUrls: ['./office-administrator-detail.component.scss']
})
export class OfficeAdministratorDetailComponent implements OnInit, OnChanges {

  @Input() adminUsers: any;
  public filteredAdminUsers: Array<userDetail> = [];
  constructor() { }

  private filterAdminUsers(limit?: number) {
    this.adminUsers = JSON.parse(JSON.stringify(this.adminUsers));
    if (limit) {
      this.filteredAdminUsers = this.adminUsers.slice(0, limit);
    } else {
      this.filteredAdminUsers = this.adminUsers;
    }
  }

  ngOnChanges() {
    this.filterAdminUsers(5);
  }

  ngOnInit() {
  }

}
