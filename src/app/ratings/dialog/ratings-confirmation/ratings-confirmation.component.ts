// External imports
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Internal imports
import { UserService } from "@app/shared/services/user.service";
import { CommonAPIService } from "@app/shared/services/common-api.service";
import { MessageService } from "@app/shared/services/message.service";

import { APINAME } from "@app/ratings/ratings.constants";
import { RatingService } from "@app/ratings/rating.service";


@Component({
  selector: 'app-ratings-confirmation',
  templateUrl: './ratings-confirmation.component.html',
  styleUrls: ['./ratings-confirmation.component.scss']
})
export class RatingsConfirmationComponent implements OnInit {

  public userName: String;   // set user firstname

  constructor(
    private router: Router,
    private _userService: UserService,
    private _commonAPIService: CommonAPIService,
    private _messageService: MessageService,
    private _ratingService: RatingService,
    private ngbActiveModal: NgbActiveModal
  ) { }


  closeDialog() {
    this.ngbActiveModal.close();
  }

  /**
   * @author Dhruvi shah
   * @createdDate 26th July 2019
   * @description call Api for selectedRattingOption 'MayBeLater'/'NoThanks' and navigate to ratting-feedback for 'TakeMeThere'
   * @memberof RatingsConfirmationComponent
   */
  saveRattings(selectedRattingOption) {
    // api call for may be later and no thanks
    if (selectedRattingOption !== 'TakeMeThere') {
      let apiParams = {
        ratingResponse: selectedRattingOption
      }
      this._ratingService.saveRattings(apiParams).then(
        (success) => {
          //close dilaog
          this.closeDialog();
          // naviagte to dashboard
          this.router.navigate(['/dashboard']);
          this._messageService.showMessage('Your feedback was submitted successfully', 'success');
        }, (error) => {
          console.error(error);
          this._messageService.showMessage('Error occured while processing your request.', 'error');
        });
    }
    else {
      //close dilaog
      this.closeDialog();
      this.router.navigate(['ratings/your-experience']);
    }
  }


  /**
   * @author Dhruvi shah
   * @createdDate 26th July 2019
   * @memberof RatingsConfirmationComponent
   */
  ngOnInit() {
    this.userName = this._userService.getUserDetails().firstName;
  }

}
