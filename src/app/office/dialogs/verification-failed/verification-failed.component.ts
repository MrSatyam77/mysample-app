import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verification-failed',
  templateUrl: './verification-failed.component.html',
  styleUrls: ['./verification-failed.component.scss']
})
export class VerificationFailedComponent implements OnInit {

  constructor(private _ngbActiveModal: NgbActiveModal) { }

  ngOnInit() {}

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
