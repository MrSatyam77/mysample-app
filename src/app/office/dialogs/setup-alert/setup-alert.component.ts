//External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-setup-alert',
  templateUrl: './setup-alert.component.html',
  styleUrls: ['./setup-alert.component.scss']
})
export class SetupAlertComponent implements OnInit {
  constructor(private _ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {  }

	/**
   * @author Heena Bhesaniya
   * @description dismiss dialog  
   */
  public dismiss() {
    this._ngbActiveModal.dismiss('Canceled')
  };

  /**
   * @author Heena Bhesaniya
   * @description close dialog  
   * @param data data that need to be passed on close dialog  
   */
  close(data) {
    this._ngbActiveModal.close(data);
  }
}
