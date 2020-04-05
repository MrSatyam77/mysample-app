import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {

  public data: any; // To get data From dialogService

  constructor(private _activeModal: NgbActiveModal) { }

  /** close */
  close() {
    this._activeModal.close();
  }

  export() {
    this._activeModal.close(this.data.columnConfiguration.filter(t => t.selected).map(t=>t.key));
  }

  ngOnInit() {
  }

}
