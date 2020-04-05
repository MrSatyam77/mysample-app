// External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-k1-import',
  templateUrl: './k1-import.component.html',
  styleUrls: ['./k1-import.component.scss']
})

export class K1ImportComponent implements OnInit {
  //hold k1 list
  public k1List: any;

  //ssn
  public ssn: string;

  //holds data passed to dialog
  @Input() data;
  
  constructor(private _ngbActiveModal: NgbActiveModal) { }

  /**
  * @author Heena Bhesaniya  
  * @description pass selected k1 in close response
  */
  public importK1Data() {
    this._ngbActiveModal.close(this.k1List);
  }

  // to dismiss a dailog
  public cancel() {
    this._ngbActiveModal.dismiss("canceled");
  }

  ngOnInit() {
    this.k1List = this.data.data;
    this.ssn = this.data.ssn
  }
}
