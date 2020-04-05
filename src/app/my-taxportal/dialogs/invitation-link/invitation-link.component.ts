import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invitation-link',
  templateUrl: './invitation-link.component.html',
  styleUrls: ['./invitation-link.component.scss']
})
export class InvitationLinkComponent implements OnInit {

  public data: any;
  constructor(private activeModal: NgbActiveModal) { }

  /**
   * @author Ravi Shah
   * Close the Dialog
   * @memberof PreviewMailComponent
   */
  public close() {
    this.activeModal.close();
  }

  ngOnInit() {
  }

}
