// External Imports
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Internal Imports
import { CommonAPIService, UserService } from '@app/shared/services/index';
import { APINAME } from '@app/shared/shared.constants';

@Component({
  selector: 'app-navigator-user-instruction',
  templateUrl: './navigator-user-instruction.component.html',
  styleUrls: ['./navigator-user-instruction.component.scss']
})

export class NavigatorUserInstructionComponent implements OnInit {

  public leaveMessage: any;
  public userDetails: any;

  constructor(private _commonAPIService: CommonAPIService,
    private _userService: UserService,
    private _ngbActiveModal: NgbActiveModal) { }

  /**
   * @author Satyam
   * @created Date 04/07/2019
   * @method void
   * @description method is used to leave message
   * @memberOf NavigatorUserInstructionComponent
   */
  leaveMsg(): void {
    const self = this;
    this._commonAPIService.getPromiseResponse({ apiName: APINAME.NAVIGATOR_LEAVE_MESSAGE, parameterObject: this.leaveMessage }).
      then(response => {
        self._ngbActiveModal.close(true);
      }, error => {
        console.error(error);
        self._ngbActiveModal.close(true);
      });
  }

  // to close dialog.
  close() {
    this._ngbActiveModal.close(true);
  }

  ngOnInit() {
    this.userDetails = this._userService.getUserDetails(undefined);
  }
}