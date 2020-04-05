import { Component, OnInit, OnDestroy, Renderer, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, pipe, from } from 'rxjs';
import { CommunicationService, UserService } from '@app/shared/services';
import { AuthenticationService } from '@app/authentication/authentication.service';
import { eFileSumaryListService, BankRejectionService } from '@app/shared/services';
import { DialogService } from '@app/shared/services';
import { ReleaseStateDetailsWithStateOnlyComponent } from '../release-state-details-with-state-only/release-state-details-with-state-only.component';
import { environment } from '@environments/environment';

declare var $: any;


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})



export class SideBarComponent implements OnInit, OnDestroy {
  public searchText: string = "";
  public url: string = '';
  public showDashboardSettings: boolean = false;
  private subscription: Subscription;
  private subscriptionRouter: Subscription;
  public sidebarDetails: any = [];
  public static_url = environment.static_url;
  public moduleDetails: any
  public activeClass: any = {
    "module": "",
    "subModule": ""
  };

  private filterMapping = [
    { "id": "inTransmission", filter: 'Transmitted' },
    { "id": "atIRS", filter: 'AtIRS' },
    { "id": "atState", filter: 'AtState' },
    { "id": "atBank", filter: 'AtBank' },
    { "id": "rejects", filter: 'Rejected' },
    { "id": "accepted", filter: 'Accepted' },
    { "id": "irsAlerts", filter: 'IRS Alerts' },
    { "id": "rejectedReturns", filter: 'Rejected' } // from Return Submenu
  ]

  constructor(private dialogeService: DialogService, private communicationService: CommunicationService, private router: Router, private userService: UserService, private authService: AuthenticationService, private render: Renderer, private eFileSumaryListService: eFileSumaryListService, private bankRejectionService: BankRejectionService) {

  }

  /**
   * @author Ravi Shah
   * Transmit the Data for Communication to another component
   * @param {string} channel
   * @param {string} topic
   * @param {*} [data]
   * @memberof SideBarComponent
   */
  sendTransmittedData(channel: string, topic: string, data?: any) {
    this.communicationService.transmitData({
      channel: channel,
      topic: topic,
      data: data || {}
    });
  }


  redirectSubModule(subModule: any) {
    this.activeClass.subModule = subModule.id;
    this.moduleDetails = this.filterMapping.find(t => t.id === subModule.id);
    if (subModule.id === 'StateFormsApproval' || subModule.id === 'returnStateFormsApproval') {
      //  this.dialogeService.custom(ReleaseStateDetailsWithStateOnlyComponent, {}, { keyboard: false, backdrop: false, size: 'xl' });
      if (subModule.link.indexOf('http') > -1) {
        window.open(subModule.link, '_blank');
      } else {
        this.router.navigateByUrl(subModule.link);
      }
    } else if (this.moduleDetails && subModule.link === '/eFile/list') {
      this.eFileSumaryListService.filterStatusPassed = this.moduleDetails.filter;
      this.eFileSumaryListService.filterChanged(this.moduleDetails.filter);
      this.bankRejectionService.filterChanged(this.moduleDetails.filter);
      if (subModule.link.indexOf('http') > -1) {
        window.open(subModule.link, '_blank');
      } else {
        this.router.navigateByUrl(subModule.link);
      }
    } else {
      if (subModule.link.indexOf('http') > -1) {
        window.open(subModule.link, '_blank');
      } else {
        this.router.navigateByUrl(subModule.link);
      }
    }
  }


  /**
   * @author Ravi Shah
   * Navigate through the Application
   * @param {String[]} path
   * @memberof SideBarComponent
   */
  goto(path: String[]) {
    this.router.navigate(path);
  }

  communicationServiceWatcher() {
    this.subscription = this.communicationService.transmitter.subscribe((data: any) => {
      if (data.channel === 'MTPO-URL-CHANGE' && data.topic === 'urlChange') {
        this.url = data.data || '';
        this.showDashboardSettings = this.url.indexOf('/home/settings') > -1;
      } else if (data.channel === 'MTPO-MENU-CHANGE' && data.topic === 'updateSidebar') {
        this.getSidebarDetails(this.url);
      }
    });
  }

  public getSidebarDetails(url) {
    this.sidebarDetails = this.userService.getSidebarDetails();
    if (!(this.sidebarDetails && this.sidebarDetails.length > 0)) {
      this.authService.getSidebarDetailsFromAPI().then((sidebarData: any) => {
        this.sidebarDetails = sidebarData;
        this.menuSelection(url);
        setTimeout(() => {
          this.expandSelectedMenuItem();
        }, 1)
      });
    } else {
      this.menuSelection(url);
      setTimeout(() => {
        this.expandSelectedMenuItem();
      }, 1)
    }

  }

  menuSelection(url) {
    // Set first time active class to left menu - if user directly change the url and not travel from the left menu
    if (this.sidebarDetails && this.sidebarDetails.length > 0) {
      let subModuleFound = false;
      for (let i = 0; i < this.sidebarDetails.length; i++) {
        if (this.sidebarDetails[i].subModule && this.sidebarDetails[i].subModule.length > 0) {
          for (let j = 0; j < this.sidebarDetails[i].subModule.length; j++) {
            if (url === this.sidebarDetails[i].subModule[j].link) {
              if (this.activeClass.module && this.activeClass.module === this.sidebarDetails[i].id) {
                this.activeClass.subModule = this.sidebarDetails[i].subModule[j].id;
                this.activeClass.module = this.sidebarDetails[i].id;
                subModuleFound = true;
                break;
              } else if (!this.activeClass.module) {
                this.activeClass.subModule = this.sidebarDetails[i].subModule[j].id;
                this.activeClass.module = this.sidebarDetails[i].id;
                subModuleFound = true;
                break;
              }
            }
          }
          if (subModuleFound)
            break;
        } else {
          if (url.includes('/home')) {
            if (url.indexOf(this.sidebarDetails[i].link) > -1) {
              this.activeClass.subModule = "";
              this.activeClass.module = this.sidebarDetails[i].id;
              for (let i = 0; i < this.sidebarDetails.length; i++) {
                let id = "#" + this.sidebarDetails[i].id;
                if ($(id)) {
                  $(id).collapse('hide');
                }
              }
              break;
            }
          } else if (url === this.sidebarDetails[i].link) {
            this.activeClass.subModule = "";
            this.activeClass.module = this.sidebarDetails[i].id;
            for (let i = 0; i < this.sidebarDetails.length; i++) {
              let id = "#" + this.sidebarDetails[i].id;
              if ($(id)) {
                $(id).collapse('hide');
              }
            }
            break;

          }
        }
      }

      // Hide menu taxyear wise
      let taxYear = this.userService.getTaxYear();
      for (let sidebars of this.sidebarDetails) {
        sidebars.visible = true;
        if (sidebars.subModule && sidebars.subModule.length > 0) {
          for (let sidebarsSubModule of sidebars.subModule) {
            if (sidebarsSubModule.allowedTaxYear) {
              sidebarsSubModule.visible = sidebarsSubModule.allowedTaxYear.includes(taxYear);
            } else {
              sidebarsSubModule.visible = true;
            }
          }
        }
      }
    }


  }

  public updateModuleData(sidebarModule) {
    this.activeClass.module = sidebarModule.id;
    //collapse all menu items except the selected menu item
    for (let i = 0; i < this.sidebarDetails.length; i++) {
      if (this.sidebarDetails[i].id !== sidebarModule.id) {
        let id = "#" + this.sidebarDetails[i].id;
        if ($(id)) {
          $(id).collapse('hide');
        }
      }
    }
    // if (sidebarModule.subModule && sidebarModule.subModule.length > 0) {
    //   let obj = sidebarModule.subModule.findIndex(t => t.id === this.activeClass.subModule);
    //   if (obj === -1) {
    //     this.activeClass.module = sidebarModule.id;
    //     this.redirectSubModule(sidebarModule.subModule[0]);
    //   }
    // }
  }

  clearSearch() {
    this.searchText = '';
  }

  ngOnInit() {
    this.url = this.router.url;
    this.showDashboardSettings = this.url.indexOf('/home/settings') > -1;
    this.communicationServiceWatcher();
    if (this.url !== '/') {
      this.getSidebarDetails(this.url);
    }
    this.subscriptionRouter = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.getSidebarDetails(event.url);
        this.url = event.url;
        this.showDashboardSettings = this.url.indexOf('/home/settings') > -1;
      }
    });
  }

  public expandSelectedMenuItem() {
    const self = this;
    if (self.activeClass.module) {
      let id = "#" + self.activeClass.module;
      if ($(id)) {
        $(id).collapse('show');
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionRouter) {
      this.subscriptionRouter.unsubscribe();
    }
  }

}
