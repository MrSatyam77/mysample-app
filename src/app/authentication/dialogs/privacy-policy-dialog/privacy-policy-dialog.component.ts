import { Component, OnInit } from '@angular/core';
import { ResellerService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-privacy-policy-dialog',
  templateUrl: './privacy-policy-dialog.component.html',
  styleUrls: ['./privacy-policy-dialog.component.scss']
})
export class PrivacyPolicyDialogComponent implements OnInit {
  public resellerConfig: any = {};
  public stateWisePackageList:any;

  constructor(private modalService: NgbActiveModal, private resellerService: ResellerService) { }

  close() {
    this.modalService.close(false);
  }

  ngOnInit() {
    this.resellerConfig = this.resellerService.getResellerConfig();
  }
}
