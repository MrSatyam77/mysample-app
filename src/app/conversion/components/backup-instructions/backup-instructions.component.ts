import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'conversion-backup-instructions',
  templateUrl: './backup-instructions.component.html',
  styleUrls: ['./backup-instructions.component.scss']
})
export class BackupInstructionsComponent implements OnInit {
  /** Public variable */
  @Input() selectedSoftware: any;
  /** constructor */
  constructor() { }

  /** Init */
  ngOnInit() {
  }

}
