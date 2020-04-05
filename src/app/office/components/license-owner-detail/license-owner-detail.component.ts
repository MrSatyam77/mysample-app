// External Imports
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-license-owner-detail',
  templateUrl: './license-owner-detail.component.html',
  styleUrls: ['./license-owner-detail.component.scss']
})
export class LicenseOwnerDetailComponent implements OnInit, OnChanges {
  @Input() ownerDetail: any;
  @Input() licenseDetail: any;
  constructor() { }

  private prepareStorageData() {
    if (parseInt(this.licenseDetail.totalStorage) >= 1024) {
      this.licenseDetail.storage = Math.round(this.licenseDetail.totalStorage/1024) + " GB";
    } else {
      this.licenseDetail.storage = this.licenseDetail.totalStorage + " MB";
    }
  }

  ngOnChanges() {
    this.prepareStorageData();
  }

  ngOnInit() {
  }

}
