import { Component, OnInit } from '@angular/core';
import { ResellerService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-terms-and-policy-dialog',
  templateUrl: './terms-and-policy-dialog.component.html',
  styleUrls: ['./terms-and-policy-dialog.component.scss']
})
export class TermsAndPolicyDialogComponent implements OnInit {

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
