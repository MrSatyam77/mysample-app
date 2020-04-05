/** External import */
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IFileList, DECISION } from '@app/conversion/conversion.model';

@Component({
  selector: 'app-files-conflicts',
  templateUrl: './files-conflicts.component.html',
  styleUrls: ['./files-conflicts.component.scss']
})
export class FilesConflictsComponent implements OnInit {
  data: any;
  filelist: IFileList[] = [];
  isNewFile: boolean;
  isOverWrite: boolean;

  constructor(
    private _activeModal: NgbActiveModal,
    private _cdr: ChangeDetectorRef
  ) { }

  /** Continuee for upload */
  Continue() {
    this.processFileData('continue');
    this._activeModal.close({ result: true, data: this.data });
  }

  /** Cancel for upload */
  Cancel() {
    this.processFileData('cancel');
    this._activeModal.close({ result: false, data: this.data });
  }

  /** Close dialog */
  close() {
    this.processFileData('cancel');
    this._activeModal.close({ result: false, data: this.data });
    this._activeModal.close({ result: false });
  }

  /** Handel checkbox check all */
  checkAll($event, type) {
    if (type == 'new' && $event.target.checked) {
      this.data.newFiles.forEach(element => {
        element.isSelected = true;
      });
      this.data.oldFiles.forEach(element => {
        element.isSelected = false;
        element.decision = DECISION.NEW;
      });
      this.isOverWrite = false;
    }
    else if (type == 'old' && $event.target.checked) {
      this.data.oldFiles.forEach(element => {
        element.decision = DECISION.OVERWRITE;
        element.isSelected = true;
      });
      this.data.newFiles.forEach(element => {
        element.isSelected = false;
      });
      this.isNewFile = false;
    }
    else {
      this.data.newFiles.forEach(element => {
        element.isSelected = false;
      });
      this.data.oldFiles.forEach(element => {
        element.isSelected = false;
        element.decision = DECISION.SKIP;
      });
      this.isNewFile = false;
      this.isOverWrite = false;
    }
  }

  /** Handel file check box event */
  filecheckCheckBox(file, type) {
    if (type == 'new' && file.isSelected) {
      this.data.oldFiles.forEach(element => {
        if (file.fileName == element.fileName) {
          element.isSelected = false;
          element.decision = DECISION.NEW;
        }
      });
    }
    else if (type == 'old' && file.isSelected) {
      file.decision = DECISION.OVERWRITE;
      this.data.newFiles.forEach(element => {
        if (file.fileName == element.fileName) {
          element.isSelected = false;
        }
      });
    }
    else {
      this.data.oldFiles.forEach(element => {
        if (file.fileName == element.fileName) {
          element.isSelected = false;
          element.decision = DECISION.SKIP;
        }
      });
    }
    this.isNewFile = false;
    this.isOverWrite = false;
  }

  ngOnInit() { }

  /** Map id with file name */
  private processFileData(type) {
    this.data.oldFiles.forEach(element => {
      if (type == "cancel") {
        element.decision = DECISION.SKIP;
      }
      else if (type == "continue") {
        if (!element.decision) {
          element.decision = DECISION.SKIP;
        }
      }
    });
  }
}
