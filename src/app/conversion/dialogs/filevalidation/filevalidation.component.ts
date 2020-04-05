/** Internal import */
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from "moment";
/** External import */
import { IFileList } from '@app/conversion/conversion.model';

@Component({
  selector: 'conversion-filevalidation',
  templateUrl: './filevalidation.component.html',
  styleUrls: ['./filevalidation.component.scss']
})
export class FileValidationComponent implements OnInit {
  /** Public variable */
  data: any;
  invalidFileFormat: string[] = [];
  isAllInvalidFile: boolean;

  constructor(private _activeModal: NgbActiveModal) { }

  /** Close dialog */
  cancel() {
    this._activeModal.close({ result: false });
  }

  /** continuee */
  continue() {
    this._activeModal.close({ result: true });
  }

  /** OK */
  ok() {
    this._activeModal.close({ result: false });
  }
  /** close */
  close() {
    this._activeModal.close({ result: false });
  }

  /** Init */
  ngOnInit() {
    if (this.data.software.name.toLowerCase() == "drake") {
      this.invalidFileFormat = this.data.files.filter(x => x.isValid == false);//.map(x => x.fileName);
    }
    else {
      this.invalidFileFormat = this.data.files.filter(x => x.isValid == false);//.map(x => x.fileName);
    }
    // Check all file is invalid
    if (this.data.files.length == this.invalidFileFormat.length) {
      this.isAllInvalidFile = true;
    }
    else {
      this.isAllInvalidFile = false;
    }
  }
}
