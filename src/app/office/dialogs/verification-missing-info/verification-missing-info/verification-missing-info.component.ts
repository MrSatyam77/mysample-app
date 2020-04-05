//External Imports
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verification-missing-info',
  templateUrl: './verification-missing-info.component.html',
  styleUrls: ['./verification-missing-info.component.scss']
})

export class VerificationMissingInfoComponent implements OnInit {
  //hold userDetails 
  @Input() data: any;
  //hold missing data info
  public missingUserData: any = [];
  constructor(private _ngbActiveModal:NgbActiveModal) { }

  /**
   *@author Heena Bhesaniya
   *@description close dialog   
   */
  close(jumpTo?: boolean){
    this._ngbActiveModal.close(jumpTo);
  } 

  ngOnInit() {
    if (this.data) {
      this.missingUserData = this.data;
    }
  }
}
