import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-preview-mail',
  templateUrl: './preview-mail.component.html',
  styleUrls: ['./preview-mail.component.scss']
})
export class PreviewMailComponent implements OnInit {

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
