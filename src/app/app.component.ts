//External Imports
import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

//Internal Imports
import { AuthenticationService } from '@app/authentication/authentication.service';
import { CommunicationService } from '@app/shared/services';
import { LocalStorageUtilityService } from '@app/shared/services/local-storage-utility.service';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'inOutLeftAnimation',
      [
        transition(
          ':enter',
          [
            style({ 'margin-right': '-300px', 'transform': 'translateX(-300px)' }),
            animate('0.5s ease-out',
              style({}))
          ]
        ),
        transition(
          ':leave',
          [
            style({}),
            animate('0.5s ease-in',
              style({ 'margin-right': '-300px', 'transform': 'translateX(-300px)' }))
          ]
        )
      ]
    ),
    trigger(
      'inOutRightAnimation',
      [
        transition(
          ':enter',
          [
            style({ 'margin-left': '-300px', 'transform': 'translateX(300px)' }),
            animate('0.5s ease-out',
              style({}))
          ]
        ),
        transition(
          ':leave',
          [
            style({}),
            animate('0.5s ease-in',
              style({ 'margin-left': '-300px', 'transform': 'translateX(300px)' }))
          ]
        )
      ]
    )
  ]
})
export class AppComponent {
  /**
  * Calculate width of window on Window Resize and show/hide left and right panel based on size
  * @param {*} event Resize Event
  * @memberof GridStackComponent
  * @author Ronak Pandya
  */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.responsive(this.url);
  }

  public url: any = '';
  public showNavBar: boolean = true;
  public showLeftPanel: boolean = true;
  public showRightPanel: boolean = false;
  public toggler: any = {
    right: false,
    left: true
  };


  public noRightPanelUrl: any = ['/login', '/home', '/home/settings', '/manage/change/password', '/logout', '/return/edit', '/return/interview', '/instantFormView/preview', '/tryitnow'];

  public noheightLayout: any = ['/login', '/registration', '/return/edit', '/instantFormView/preview'];
  public noSpaceLayout: any = ['/home'];
  public noScrollLayout: any = ['/instantFormView/device-list'];
  public hideHeader = ['/instantFormView/preview']
  public isHideHeader: boolean = false;
  public layout: any = {};


  // public noheightLayout: any = ['/login', '/registration', '/instantFormView/preview'];
  // public returnWorkspaceLayout: any = ['/return/edit'];

  constructor(public _authService: AuthenticationService, private router: Router, private communicationService: CommunicationService,
    private localStorageUtilityService: LocalStorageUtilityService) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.url = event.urlAfterRedirects;
        if (this.hideHeader.indexOf(this.url) > -1) {
          this.isHideHeader = true;
        } else {
          this.isHideHeader = false;
        }
        this.responsive(event.urlAfterRedirects);
        this.communicationService.transmitData({
          channel: 'MTPO-URL-CHANGE',
          topic: 'urlChange',
          data: event.urlAfterRedirects
        });
      }
    });
  }

  togglerPanels(panelType: string) {
    if (panelType === 'headerToggleLeft') {
      this.showLeftPanel = !this.showLeftPanel;
    } else {
      this.showRightPanel = !this.showRightPanel;
    }
  }

  /**
   * @author Heena
   * @description 
   * return true if user is logged in.
   */
  public get isAuthenticated(): boolean {
    return this._authService.getIsAuthenticated();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    // Your logic on beforeunload
    this.localStorageUtilityService.removeFromLocalStorage('returnPreview')
  }

  // show/hide left and right panel based on size
  responsive(url) {
    if (window.innerWidth < 1440) {
      this.showLeftPanel = false;
      this.showRightPanel = false;
    } else {
      this.showLeftPanel = !(url.startsWith("/return/edit/") || url.startsWith("/return/interview/") || url.startsWith("/instantFormView/preview"));
      this.showRightPanel = !((this.noRightPanelUrl.filter(t => url === '/' || url.indexOf(t) > -1)).length > 0);
    }
    this.toggler.right = !((this.noRightPanelUrl.filter(t => url.indexOf(t) > -1)).length > 0) || url.startsWith('/return/edit') || url.startsWith('/return/edit') || url.startsWith("/return/interview/");
    this.toggler.left = !(url.startsWith("/return/interview/"));
    // Layout Configuration
    this.layout.noheight = (this.noheightLayout.filter(t => url === '/' || url.indexOf(t) > -1)).length > 0;
    this.layout.noSpace = (this.noSpaceLayout.filter(t => url.indexOf(t) > -1)).length > 0;
    this.layout.noScroll = (this.noScrollLayout.filter(t => url.indexOf(t) > -1)).length > 0;
    //this.layout.returnWorkspaceLayout = (this.returnWorkspaceLayout.filter(t => url.indexOf(t) > -1)).length > 0;
  }


  ngOnInit() {
    if (this.hideHeader.indexOf(this.router.url) > -1) {
      this.isHideHeader = true;
    } else {
      this.isHideHeader = false;
    }
    this.responsive(this.router.url);
  }

}
