// External imports
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
// Internal imports
import { TrainingComponent } from '../training/training.component';
import { CommunicationService } from '@app/shared/services/communication.service';


@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss']
})
export class RightBarComponent implements OnInit, OnDestroy {
  @ViewChild('trainingComponent', { static: false }) trainingComponent: TrainingComponent;
  public searchText: any;
  public trainingDataList: any = [];
  public firstRefreshStart: boolean;
  public trainingDataLength = 0;
  lineHelpData: any; // to hold line help data
  communicationWatcher: Subscription; // to hold subscription
  showLineHelp = false; // to show linehelp menu
  routerChangewatcher: Subscription; // to hold routing change subscription
  public lineHelpDataKeysArray: any = [];

  constructor(private communicationService: CommunicationService, private router: Router) { }
  /**
   * @author Om kanada
   * @description
   * function is use to refresh manually api data.
   */
  public manuallyRefreshTraining(): void {
    this.firstRefreshStart = true;
    this.trainingComponent.manuallyRefreshTraining().then(Response => {
      if (Response) {
        this.firstRefreshStart = false;
      }
    }, (error) => {
      this.firstRefreshStart = false;
    });


  }
  /**
   * @author Om kanada
   * @description
   * Add watcher to display linehelp data.
   */
  communicationServiceWatcher(): void {
    this.communicationWatcher = this.communicationService.transmitter.subscribe((response: any) => {
      if (response.channel === 'MTPO-LINE-HELP') {
        this.lineHelpData = response.data;
        this.lineHelpDataKeysArray = Object.keys(this.lineHelpData);
      }
    });
  }

  /**
   * @author Om kanada
   * @description
   * Add watcher to routing url change.
   */
  routingUrlChangeWatcher(): void {
    // route url is equal to preferences then line help menu should display
    this.showLineHelp = (this.router.url.indexOf('preferences') >= 1) || (this.router.url.indexOf('conversionnew') >= 1) || (this.router.url.indexOf('bank/protectionPlus') >= 1);
    this.routerChangewatcher = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showLineHelp = (event.url.indexOf('preferences') >= 1 || event.url.indexOf('conversionnew') >= 1 || event.url.indexOf('bank/protectionPlus') >= 1);
        this.lineHelpData = undefined;
      }
    });
  }

  ngOnInit() {
    this.routingUrlChangeWatcher();
    this.communicationServiceWatcher();
  }

  ngOnDestroy() {
    if (this.communicationWatcher) {
      this.communicationWatcher.unsubscribe();
    }
    if (this.routerChangewatcher) {
      this.routerChangewatcher.unsubscribe();
    }
  }
}
