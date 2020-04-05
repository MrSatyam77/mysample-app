// External imports
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
// Internal imports
import { CommonAPIService, MessageService } from "@app/shared/services/index";
import { APINAME, SITEURL } from "@app/ratings/ratings.constants";
import { RatingService } from "@app/ratings/rating.service";

@Component({
  selector: 'app-ratings-feedback',
  templateUrl: './ratings-feedback.component.html',
  styleUrls: ['./ratings-feedback.component.scss']
})
export class RatingsFeedbackComponent implements OnInit {
  public isShowScreen = {
    opinion: true, feedBack: false, shareLove: false    //set flag for giveRatings,feedback,shareLove
  }
  public ratings: number = 0;  // store ratings
  public feedBack: string = ''; // store feedback
  public apiParams: any = {
    ratingResponse: 'TakeMeThere'
  }

  constructor(
    private router: Router,
    private commonAPIService: CommonAPIService,
    private _messageService: MessageService,
    private _ratingService: RatingService,
  ) { }


  /**
   * @author Dhruvi shah
   * @createdDate 26th July 2019
   * @description function call After user give ratings to hide ratingsScreen & show screen based on rattings
   * @memberof RatingsFeedbackComponent
   */
  showScreenBasedOnRatings(): void {
    this.isShowScreen.opinion = false;
    if (this.ratings > 3) {
      this.isShowScreen.shareLove = true;
      this.isShowScreen.feedBack = false;
    } else if (this.ratings > 0 && this.ratings <= 3){  
      this.isShowScreen.feedBack = true;
      this.isShowScreen.shareLove = false;
    }
  }


  /**
   * @author Dhruvi shah
   * @createdDate 26th July 2019
   * @description call api to pass feedBack when ratings > 3 
   * @memberof RatingsFeedbackComponent
   */
  sendFeedback(): void {
    let apiParameters = JSON.parse(JSON.stringify(this.apiParams));
    apiParameters.ratingFeedback = this.feedBack;
    apiParameters.ratingInNo = this.ratings;
    this._ratingService.saveRattings(apiParameters).then(
      (success) => {
        // reset flag
        this.isShowScreen = {
          shareLove: false, feedBack: false, opinion: false,
        }
        // naviagte to dashboard
        this.router.navigate(['/dashboard']);
        this._messageService.showMessage('Your feedback was submitted successfully', 'success');
      }, (error) => {
        console.error(error);
        this._messageService.showMessage('Error occured while processing your request.', 'error');
      });
  }

  /**
   * @author Dhruvi shah
   * @createdDate 26th July 2019
   * @description call api to pass Ratings and selected site
   * @param {*} selectedSite
   * @memberof RatingsFeedbackComponent
   */
  redirectToSelectedReviewSite(selectedSite): void {
    let redirectToSelectedReviewSite = (selectedSite == 'BBB') ? SITEURL.BBB : SITEURL.SiteJabber;
    let apiParameters = JSON.parse(JSON.stringify(this.apiParams));
    apiParameters.reviewSiteselected = selectedSite;
    apiParameters.ratingInNo = this.ratings;
    this._ratingService.saveRattings(apiParameters).then(
      (success) => {
        // reset flag
        this.isShowScreen = {
          shareLove: false, feedBack: false, opinion: false,
        }
        // open site in new tab
        window.open(redirectToSelectedReviewSite, "_blank");
        // naviagte to dashboard
        this.router.navigate(['/dashboard']);
        this._messageService.showMessage('Your feedback was submitted successfully', 'success');
      }, (error) => {
        console.error(error);
        this._messageService.showMessage('Error occured while processing your request.', 'error');
      });
  }


  ngOnInit() {
  }

}
