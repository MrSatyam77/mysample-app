// Internal Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

// External Imports
import { SystemConfigService } from '@app/shared/services/index';

@Component({
  selector: 'app-return-summary-filter',
  templateUrl: './return-summary-filter.component.html',
  styleUrls: ['./return-summary-filter.component.scss']
})
export class ReturnSummaryFilterDialog implements OnInit {

  public returnFilterList = [];
  public returnType = { modal: '' };
  public pkgType = { modal: '' };
  public pkgFilterList = [];
  public userSettings;
  public data: any; // To get data From dialogService

  constructor(private activeModal: NgbActiveModal, private systemConfigService: SystemConfigService) { }


  /**
   * @author Mansi Makwana
   * @description This function is used to filter dialog.
   */
  filterReturnList() {
    // close the dialog with parameters
    this.activeModal.close({ returnType: this.returnType.modal, pkgType: this.pkgType.modal });
  }

  /**
   * @author Mansi Makwana
   * @description This function is used to close dialog.
   */
  close() {
    this.activeModal.close(false);
  }
  ngOnInit() {
    // get pkg list from system config
    this.pkgFilterList = this.systemConfigService.getReleasedPackages();
    // push all at first index
    this.pkgFilterList.splice(0, 0, { title: 'All Systems', id: 'all' });
    // return filter list
    this.returnFilterList = [{ title: 'All', id: 'all' }, { title: 'Me', id: 'me' }];
    // check whether filter available or not. IF available then select corresponding checkbox.
    if (this.data && this.data.data.widgets && this.data.data.widgets.recentReturns && Object.keys(this.data.data.widgets.recentReturns).length > 0) {
      this.returnType.modal = this.data.data.widgets.recentReturns.returnType;
      this.pkgType.modal = this.data.data.widgets.recentReturns.pkgType;
    } else {
      this.returnType.modal = 'all';
      this.pkgType.modal = 'all';
    }
  }
}
