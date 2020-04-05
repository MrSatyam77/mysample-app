// Internal Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

// External Imports
import { SystemConfigService } from '@app/shared/services/index';

@Component({
    selector: 'app-tutorial-info',
    templateUrl: './tutorial-info.component.html',
    styleUrls: ['./tutorial-info.component.scss']
})
export class TutorialInfoDialogComponent implements OnInit {

    constructor(private activeModal: NgbActiveModal) {}
    /**
    * @author Asrar Memon
    * @description This function is used to close dialog.
    */
    close() {
        this.activeModal.close(true);
    }

    ngOnInit() { }
}
