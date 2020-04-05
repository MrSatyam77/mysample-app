// Internal Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-release-state-details-with-state-only',
  templateUrl: './release-state-details-with-state-only.component.html',
  styleUrls: ['./release-state-details-with-state-only.component.scss']
})
export class ReleaseStateDetailsWithStateOnlyComponent implements OnInit {
 
  constructor(private activeModal: NgbActiveModal) { }

  /**
   * @author Mansi Makwana
   * @description This function is used to close dialog.
   */
  close() {
    this.activeModal.close(true);
  }
  ngOnInit() {
  }

}
