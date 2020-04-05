import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NewsSummaryService } from '@app/dashboard/widgets/news-summary/news-summary.service';
import { UserService } from '@app/shared/services/user.service';
import { environment } from '@environments/environment';
import { ResellerService } from '@app/shared/services/reseller.service';
import { DialogService } from '@app/shared/services';
import { ReleaseStateDetailsWithStateOnlyComponent } from '@app/shared/components/release-state-details-with-state-only/release-state-details-with-state-only.component';
import { ReleasePrintingDetailsComponent } from '@app/shared/components/release-printing-details/release-printing-details.component';

@Component({
  selector: 'app-news-summary',
  templateUrl: './news-summary.component.html',
  styleUrls: ['./news-summary.component.scss']
})
export class NewsSummaryComponent implements OnInit, OnDestroy {
  @Input() rowColor: any;
  @Input() foregroundColor: any;
  public newsSummaryList: any = []; // Default data of banksummaryList
  private refreshTimer: Subscription;
  public taxYear: number; // To get taxyear from userservice]
  public appName: string; // To get appName


  constructor(private dialogeService: DialogService, private resellerService: ResellerService, private userService: UserService, private router: Router, private newsSummaryService: NewsSummaryService) { }

  /**
   * @author Om kanada
   * @description
   * Register $interval for background update of list, third argument is for infinite and last is to prevent to execute on every dirty checking.
   */
  private refreshList(): void {
    this.refreshTimer = interval(60500).subscribe(() => {
      this.newsSummaryService.getNews(3).then((response: any) => {
        if (response) {
          this.newsSummaryList = response;
          // if (this.betaOnly() === true) {
          //   this.getText();
          // }
        }
      }, (error) => {
        if (error && error.data && error.data.code && (error.data.code === 4004 || error.data.code === 4005)) {
          this.cancelInterval();
        }

      });
    });
  }

  /**
   * @author Om kanada
   * @description
   * This method is responsible for calling List api and register/unregister interval for auto refresh.
   */
  manualRefreshListbankSummary(delay: number): void {

    /*Cancel iterate of auto refresh if already registered*/
    if (this.refreshTimer) {
      this.cancelInterval();
      this.refreshTimer = undefined;
    }
    // Check if delay is passed
    if (delay) {
      setTimeout(() => {
        this.callListAPI();
      }, delay);

    } else {
      // Call API function
      this.callListAPI();
    }
  }
  /**
   * @author Om kanada
   * @description
   * This method is responsible for calling banksummary api.
   */
  public callListAPI() {
    return new Promise((resolve, reject) => {
      this.newsSummaryService.getNews(3).then((response: any) => {
        if (response) {
          this.newsSummaryList = response;
          // if (this.betaOnly() === true) {
          //   this.getText();
          // }
          resolve(this.newsSummaryList);
        }
        if (!this.refreshTimer) {
          this.refreshList();
        }
      }, (error) => {
        if ((!this.refreshTimer)) {
          this.refreshList();
        }
        reject(error);
      });
    });
  }
  /**
   * @author Om kanada
   * @description
   * function to differentiate features as per environment (beta/live).
   */
  private betaOnly(): boolean {
    if (environment.mode === 'beta' || environment.mode === 'local') {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @author Om kanada
   * @description
   * cancel interval.
   */
  private cancelInterval(): void {
    if (this.refreshTimer) {
      this.refreshTimer.unsubscribe();
    }
  }
  /**
   * @author Om kanada
   * @description
   * Get text from newssummaryList.
   */
  private getText(): void {
    if (this.newsSummaryList && this.newsSummaryList.length > 0) {
      for (const i in this.newsSummaryList) {
        const span = document.createElement('span');
        span.innerHTML = this.newsSummaryList[i].description;
        this.newsSummaryList[i].description = span.textContent || span.innerText;
      }
    }
  }
  /**
   * @author Om kanada
   * @description
   * pure css note support multiline ellipsis so for now we are manually substr text.
   */
  public shortText(text: string, maxLength: number): string {
    let ret = text;
    if (ret.length > maxLength) {
      ret = ret.substr(0, maxLength - 3) + '...';
    }
    return ret;
  }
  /**
   * @author Om kanada
   * @description
   * Destroy refreshTimer.
   */
  ngOnDestroy(): void {
    this.cancelInterval();
  }
  /**
   * @author Om kanada
   * @description
   * open state release details dialog.
   */
  public openStateReleaseDetailsDialog(): void {
    if (this.taxYear < 2017) {
      this.dialogeService.custom(ReleaseStateDetailsWithStateOnlyComponent, {}, { keyboard: false, backdrop: false, size: 'lg' });
    } else if (this.taxYear >= 2018) {
      this.dialogeService.custom(ReleaseStateDetailsWithStateOnlyComponent, {}, { keyboard: false, backdrop: false, size: 'xl' });
    } else {
      this.dialogeService.custom(ReleaseStateDetailsWithStateOnlyComponent, {}, { keyboard: false, backdrop: false, size: 'xl' });
    }
  }
  /**
   * @author Om kanada
   * @description
   * open printing status dialog.
   */
  public openPrintingReleaseDetailsDialog(): void {
    if (this.taxYear >= 2017) {
      this.dialogeService.custom(ReleasePrintingDetailsComponent, {}, { keyboard: false, backdrop: false, size: 'xl' });
    }
  }

  /**
 * @author Ravi Shah
 * Redirect to the link based on condition
 * @memberof NewsSummaryComponent
 */
  public openLink() {
    if (this.betaOnly()) {
      window.open('https://news.advanced-taxsolutions.com/#/news', '_blank');
    } else {
      window.open('http://faq.mytaxprepoffice.com/news', '_blank');
    }
  }
  ngOnInit(): void {
    this.manualRefreshListbankSummary(60);
    //  getting current Tax year
    this.taxYear = parseInt(this.userService.getTaxYear(), 0);

    //  get appName config ()
    this.appName = this.resellerService.getValue('appName');
  }

}
