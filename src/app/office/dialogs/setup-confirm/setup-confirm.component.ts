//External Imports 
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-setup-confirm',
  templateUrl: './setup-confirm.component.html',
  styleUrls: ['./setup-confirm.component.scss']
})

export class SetupConfirmComponent implements OnInit {
  public data: any;
  public userInfo: any;
  public type: string;
  public addressTypeOwner: string = 'usAddress';
  public addressType: string = 'usAddress';
  public confirmType: string;
  constructor(private _activeModal: NgbActiveModal) { }

  /**
   * @author Heena Bhesaniya  
   * @description This function is used to intialize/format the data that need to be shown
   */
  ngOnInit() {
    if (this.data.userDetail) {
      this.userInfo = JSON.parse(JSON.stringify(this.data.userDetail));
      this.type = this.data.type;
    }
  }

  /**
   * @author Heena Bhesaniya  
   * @description This function is used to close dialog.
   */
  close(closeValue) {
    this._activeModal.close(closeValue);
  }

}
