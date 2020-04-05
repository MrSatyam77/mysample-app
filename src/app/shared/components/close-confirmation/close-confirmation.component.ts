// External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-close-confirmation',
  templateUrl: './close-confirmation.component.html',
  styleUrls: ['./close-confirmation.component.scss']
})
export class CloseConfirmationComponent implements OnInit {

  constructor(
    private _activeModal: NgbActiveModal) { }

  // to close dialog
  close(save: boolean) {
    this._activeModal.close(save);
  }

  // to cancel dialog
  cancel() {
    this._activeModal.dismiss(true);
  }

  ngOnInit() {
  }

}
